// クラウド同期・オフラインキューサービス（Supabase REST / LocalStorage ハイブリッド）
import { AuthService } from './auth.js';

// アプリ公式 Supabase クラウド初期設定（手動入力不要で全端末が即時同期可能）
export const DEFAULT_SUPABASE_CONFIG = {
  supabaseUrl: 'https://hwmnxtgnhahjgpziczic.supabase.co',
  supabaseAnonKey: 'sb_publishable_Win4LjLX9fBwruCa9etB8Q_yQZ-Sa7F',
  syncEnabled: true
};

export class SyncService {
  /**
   * Supabase URL をサニタイズ（末尾の /rest/v1 や余分なスラッシュを自動除去）
   */
  static cleanSupabaseUrl(rawUrl) {
    if (!rawUrl || typeof rawUrl !== 'string') return '';
    let u = rawUrl.trim();
    // 末尾の /rest/v1/ や /rest/v1 を徹底除去
    u = u.replace(/\/rest\/v1\/?$/i, '');
    u = u.replace(/\/+$/, '');
    if (u && !u.startsWith('http://') && !u.startsWith('https://')) {
      u = 'https://' + u;
    }
    return u;
  }
  static CONFIG_KEY = 'mongol_app_cloud_config_v1';
  static QUEUE_KEY = 'mongol_app_sync_queue_v1';
  static LAST_SYNC_KEY = 'mongol_app_last_sync_time_v1';

  static state = {
    status: 'local_only', // 'synced' | 'syncing' | 'offline' | 'local_only' | 'error'
    lastSyncTime: null,
    pendingCount: 0,
    errorMessage: null,
    listeners: []
  };

  /**
   * クラウド設定を取得（ユーザー入力またはグローバル設定）
   */
  static getConfig() {
    try {
      const stored = localStorage.getItem(this.CONFIG_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.supabaseUrl) {
          parsed.supabaseUrl = this.cleanSupabaseUrl(parsed.supabaseUrl);
          return parsed;
        }
      }
      if (typeof window !== 'undefined' && window.MONGOL_APP_CONFIG) {
        const c = window.MONGOL_APP_CONFIG;
        c.supabaseUrl = this.cleanSupabaseUrl(c.supabaseUrl);
        return c;
      }
      // デフォルト設定を返却（全端末で初期設定なしでも即使えるようにする）
      return { ...DEFAULT_SUPABASE_CONFIG };
    } catch (e) {
      return { ...DEFAULT_SUPABASE_CONFIG };
    }
  }

  static saveConfig(config) {
    if (config) {
      const sanitized = {
        ...config,
        supabaseUrl: this.cleanSupabaseUrl(config.supabaseUrl)
      };
      localStorage.setItem(this.CONFIG_KEY, JSON.stringify(sanitized));
    } else {
      localStorage.removeItem(this.CONFIG_KEY);
    }
    this.updateStatus();
  }

  static isCloudConfigured() {
    const config = this.getConfig();
    return Boolean(config && config.supabaseUrl && config.supabaseAnonKey);
  }

  /**
   * 初期化: ネットワーク監視とキューの自動送信リスナーを設定
   */
  static init(onStatusChange) {
    if (onStatusChange) this.addListener(onStatusChange);

    this.state.lastSyncTime = localStorage.getItem(this.LAST_SYNC_KEY);
    this.state.pendingCount = this.getQueue().length;

    // オンライン・オフラインイベント監視
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        console.log('[SyncService] Network restored. Attempting auto-sync...');
        this.triggerSync();
      });

      window.addEventListener('offline', () => {
        this.updateStatus('offline');
      });
    }

    this.updateStatus();

    // 起動時の自動同期
    if (this.isCloudConfigured() && navigator.onLine) {
      setTimeout(() => this.triggerSync(), 1500);
    }
  }

  static addListener(fn) {
    this.state.listeners.push(fn);
    fn(this.state);
  }

  static notifyListeners() {
    this.state.listeners.forEach(fn => fn({ ...this.state }));
  }

  static updateStatus(overrideStatus = null) {
    const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
    const isConfigured = this.isCloudConfigured();
    const user = AuthService.getCurrentUser();

    if (!isConfigured || !user) {
      this.state.status = 'local_only';
    } else if (!isOnline) {
      this.state.status = 'offline';
    } else if (overrideStatus) {
      this.state.status = overrideStatus;
    } else if (this.getQueue().length > 0) {
      this.state.status = 'offline'; // 未同期アイテムあり
    } else {
      this.state.status = 'synced';
    }

    this.state.pendingCount = this.getQueue().length;
    this.notifyListeners();
  }

  // --- オフライン同期キュー管理 ---

  static getQueue() {
    try {
      const data = localStorage.getItem(this.QUEUE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  static saveQueue(queue) {
    localStorage.setItem(this.QUEUE_KEY, JSON.stringify(queue));
    this.state.pendingCount = queue.length;
    this.notifyListeners();
  }

  /**
   * 同期キューにアクションを追加（オフライン・オンライン問わず即時記録）
   * @param {string} actionType 'UPDATE_WORD_PROGRESS' | 'RECORD_MISTAKE' | 'RESOLVE_MISTAKE' | 'RECORD_HISTORY' | 'UPDATE_SETTINGS'
   * @param {Object} payload 変更データ
   */
  static enqueueChange(actionType, payload) {
    const queue = this.getQueue();
    queue.push({
      id: `sync_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      action: actionType,
      payload: payload,
      timestamp: new Date().toISOString()
    });
    this.saveQueue(queue);

    // オンラインかつ設定済ならバックグラウンド同期をトリガー
    if (navigator.onLine && this.isCloudConfigured() && AuthService.getCurrentUser()) {
      this.triggerSync();
    }
  }

  // --- 同期処理の実行 ---

  static isSyncing = false;

  static async triggerSync() {
    if (this.isSyncing) return;
    const config = this.getConfig();
    const user = AuthService.getCurrentUser();

    // 1. ローカルWebサーバー（LAN内）へ常に自動バックグラウンド同期
    try {
      if (user && navigator.onLine && typeof AuthService.syncAllToServer === 'function') {
        AuthService.syncAllToServer(user.username);
      }
    } catch (_) {}

    if (!config || !user || !navigator.onLine) {
      this.updateStatus();
      return;
    }

    this.isSyncing = true;
    this.updateStatus('syncing');

    try {
      // 1. 保留中キューの送信
      await this.flushQueue(config, user);

      // 2. ローカル既存データ（間違えた問題・進捗・アカウント）のクラウド一括プッシュ
      await this.pushAllLocalDataToCloud(config, user);

      // 3. クラウドからの最新データ取得・マージ
      await this.pullFromCloud(config, user);

      const now = new Date().toISOString();
      this.state.lastSyncTime = now;
      localStorage.setItem(this.LAST_SYNC_KEY, now);
      this.state.errorMessage = null;
      this.updateStatus('synced');
    } catch (err) {
      console.warn('[SyncService] Sync warning/error:', err);
      this.state.errorMessage = err.message || '同期中に一時的な通信エラーが発生しました。';
      this.updateStatus(navigator.onLine ? 'error' : 'offline');
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * ローカルキューをSupabaseへ一括送信
   */
  static async flushQueue(config, user) {
    const queue = this.getQueue();
    if (queue.length === 0) return;

    const remainingQueue = [];
    const url = this.cleanSupabaseUrl(config.supabaseUrl);
    const headers = {
      'apikey': config.supabaseAnonKey,
      'Authorization': `Bearer ${config.supabaseAnonKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'resolution=merge-duplicates'
    };

    for (const item of queue) {
      try {
        if (item.action === 'UPDATE_WORD_PROGRESS') {
          const prog = item.payload;
          const body = {
            user_id: user.id,
            word_id: prog.wordId,
            srs_level: prog.srsLevel,
            interval_days: prog.intervalDays,
            next_review_date: prog.nextReviewDate,
            last_learned_at: prog.lastLearnedAt,
            study_count: prog.studyCount,
            correct_count: prog.correctCount,
            wrong_count: prog.wrongCount,
            accuracy: prog.accuracy,
            updated_at: prog.updatedAt || new Date().toISOString()
          };

          const res = await fetch(`${url}/rest/v1/user_word_progress`, {
            method: 'POST',
            headers,
            body: JSON.stringify(body)
          });
          if (!res.ok && res.status !== 409) {
            throw new Error(`Progress sync failed: ${res.statusText}`);
          }
        } else if (item.action === 'RECORD_MISTAKE') {
          const m = item.payload;
          const body = {
            id: m.id,
            user_id: user.id,
            question: m.question,
            correct_answer: m.correctAnswer,
            user_answer: m.userAnswer,
            type: m.type || 'word',
            category: m.category || '全般',
            explanation: m.explanation || '',
            wrong_count: m.wrongCount || 1,
            last_wrong_date: m.lastWrongDate || new Date().toISOString(),
            resolved: Boolean(m.resolved),
            updated_at: new Date().toISOString()
          };

          const res = await fetch(`${url}/rest/v1/user_mistakes`, {
            method: 'POST',
            headers,
            body: JSON.stringify(body)
          });
          if (!res.ok && res.status !== 409) {
            throw new Error(`Mistake sync failed: ${res.statusText}`);
          }
        } else if (item.action === 'RECORD_HISTORY') {
          const h = item.payload;
          const body = {
            id: h.id,
            user_id: user.id,
            type: h.type || 'word',
            total: h.total,
            correct: h.correct,
            category: h.category || '',
            mode: h.mode || '',
            timestamp: h.timestamp || new Date().toISOString()
          };

          const res = await fetch(`${url}/rest/v1/user_history`, {
            method: 'POST',
            headers,
            body: JSON.stringify(body)
          });
          if (!res.ok && res.status !== 409) {
            throw new Error(`History sync failed: ${res.statusText}`);
          }
        }
      } catch (e) {
        console.warn(`[SyncService] Queue item failed, keeping in queue:`, item, e);
        remainingQueue.push(item);
      }
    }

    this.saveQueue(remainingQueue);
  }

  /**
   * クラウド上の最新進捗をダウンロードし、ローカルデータと統合
   */
  static async pullFromCloud(config, user) {
    const url = this.cleanSupabaseUrl(config.supabaseUrl);
    const headers = {
      'apikey': config.supabaseAnonKey,
      'Authorization': `Bearer ${config.supabaseAnonKey}`,
      'Accept': 'application/json'
    };

    // 1. 単語進捗の取得
    try {
      const res = await fetch(`${url}/rest/v1/user_word_progress?user_id=eq.${user.id}`, { headers });
      if (res.ok) {
        const rows = await res.json();
        if (Array.isArray(rows) && rows.length > 0) {
          const localMap = JSON.parse(localStorage.getItem('mongol_app_word_progress_v1') || '{}');
          rows.forEach(r => {
            const existing = localMap[r.word_id];
            // 更新日時または学習回数が進んでいる方を採用
            if (!existing || new Date(r.updated_at) >= new Date(existing.updatedAt || 0)) {
              localMap[r.word_id] = {
                wordId: r.word_id,
                srsLevel: r.srs_level,
                intervalDays: r.interval_days,
                nextReviewDate: r.next_review_date,
                lastLearnedAt: r.last_learned_at,
                studyCount: r.study_count,
                correctCount: r.correct_count,
                wrongCount: r.wrong_count,
                accuracy: r.accuracy,
                updatedAt: r.updated_at
              };
            }
          });
          localStorage.setItem('mongol_app_word_progress_v1', JSON.stringify(localMap));
        }
      }
    } catch (e) {
      console.warn('[SyncService] Pull progress failed:', e);
    }

    // 2. 間違いノートの取得
    try {
      const res = await fetch(`${url}/rest/v1/user_mistakes?user_id=eq.${user.id}`, { headers });
      if (res.ok) {
        const rows = await res.json();
        if (Array.isArray(rows) && rows.length > 0) {
          const localMistakes = JSON.parse(localStorage.getItem('mongol_app_mistakes_v1') || '[]');
          rows.forEach(r => {
            const idx = localMistakes.findIndex(m => m.id === r.id || (m.question === r.question && m.correctAnswer === r.correct_answer));
            const cloudItem = {
              id: r.id,
              question: r.question,
              correctAnswer: r.correct_answer,
              userAnswer: r.user_answer,
              type: r.type,
              category: r.category,
              explanation: r.explanation,
              wrongCount: r.wrong_count,
              lastWrongDate: r.last_wrong_date,
              resolved: r.resolved
            };
            if (idx !== -1) {
              // 間違い回数は大きい方を維持
              cloudItem.wrongCount = Math.max(cloudItem.wrongCount, localMistakes[idx].wrongCount || 1);
              localMistakes[idx] = cloudItem;
            } else {
              localMistakes.push(cloudItem);
            }
          });
          localStorage.setItem('mongol_app_mistakes_v1', JSON.stringify(localMistakes));
          // 画面へ更新通知を発火
          try {
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('mongol_app_mistakes_updated'));
            }
          } catch (_) {}
        }
      }
    } catch (e) {
      console.warn('[SyncService] Pull mistakes failed:', e);
    }

    // 3. 万能スナップショットからのフォールバック取得
    try {
      const res = await fetch(`${url}/rest/v1/user_sync_snapshot?user_id=eq.${user.id}`, { headers });
      if (res.ok) {
        const rows = await res.json();
        if (Array.isArray(rows) && rows.length > 0 && rows[0].payload) {
          const snap = rows[0].payload;
          
          // アカウントの自動復元
          if (snap.account && typeof AuthService !== 'undefined') {
            try {
              AuthService.mergeServerUsers([snap.account]);
              const curUser = AuthService.getCurrentUser();
              if (!curUser || curUser.username !== snap.account.username) {
                AuthService.setSession(snap.account);
              }
            } catch (_) {}
          }

          // 間違いノートの復元
          if (Array.isArray(snap.mistakes) && snap.mistakes.length > 0) {
            const currentMistakes = JSON.parse(localStorage.getItem('mongol_app_mistakes_v1') || '[]');
            snap.mistakes.forEach(m => {
              const exists = currentMistakes.some(x => x.id === m.id || (x.question === m.question && x.correctAnswer === m.correctAnswer));
              if (!exists) currentMistakes.push(m);
            });
            localStorage.setItem('mongol_app_mistakes_v1', JSON.stringify(currentMistakes));
          }

          // 単語進捗の復元（両キー対応）
          if (snap.wordProgress && typeof snap.wordProgress === 'object') {
            const curProg = JSON.parse(localStorage.getItem('mongol_app_word_progress_v1') || '{}');
            Object.assign(curProg, snap.wordProgress);
            localStorage.setItem('mongol_app_word_progress_v1', JSON.stringify(curProg));
          }
          if (snap.srsProgress && typeof snap.srsProgress === 'object') {
            const curSrs = JSON.parse(localStorage.getItem('mongol_app_srs_progress_v1') || '{}');
            Object.assign(curSrs, snap.srsProgress);
            localStorage.setItem('mongol_app_srs_progress_v1', JSON.stringify(curSrs));
          }

          // ゲーム統計・XP・レベル・称号の完全復元
          if (snap.gameStats && typeof snap.gameStats === 'object') {
            const curStats = JSON.parse(localStorage.getItem('mongol_app_game_stats_v1') || '{}');
            const merged = { ...curStats, ...snap.gameStats };
            // より高いXP・レベルを維持
            if (snap.gameStats.totalXp && (!curStats.totalXp || snap.gameStats.totalXp > curStats.totalXp)) {
              merged.totalXp = snap.gameStats.totalXp;
              merged.level = snap.gameStats.level;
              merged.currentTitle = snap.gameStats.currentTitle;
            }
            localStorage.setItem('mongol_app_game_stats_v1', JSON.stringify(merged));
          }

          // ペンギンマスコット育成・称号の復元
          if (snap.mascot && typeof snap.mascot === 'object') {
            localStorage.setItem('mongol_app_penguin_mascot_v1', JSON.stringify(snap.mascot));
          }
          if (snap.penguinMascot && typeof snap.penguinMascot === 'object') {
            localStorage.setItem('mongol_app_penguin_mascot_v1', JSON.stringify(snap.penguinMascot));
          }

          // 日別学習目標・進捗の復元
          if (snap.dailyStats && typeof snap.dailyStats === 'object') {
            localStorage.setItem('mongol_app_daily_stats_v1', JSON.stringify(snap.dailyStats));
          }

          try {
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('mongol_app_mistakes_updated'));
              window.dispatchEvent(new CustomEvent('mongol_app_storage_updated'));
            }
          } catch (_) {}
        }
      }
    } catch (e) {
      console.warn('[SyncService] Pull user_sync_snapshot failed:', e);
    }
  }

  /**
   * ローカルに蓄積されている全学習データ（アカウント、間違えた問題、単語進捗、履歴）をSupabaseへ一括プッシュ
   */
  static async pushAllLocalDataToCloud(config, user) {
    if (!config || !user || !config.supabaseUrl || !config.supabaseAnonKey) return;
    const url = this.cleanSupabaseUrl(config.supabaseUrl);
    const headers = {
      'apikey': config.supabaseAnonKey,
      'Authorization': `Bearer ${config.supabaseAnonKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'resolution=merge-duplicates'
    };

    // 1. アカウント情報のUPSERT
    try {
      const accountBody = {
        id: user.id,
        username: user.username,
        display_name: user.displayName || user.username,
        salt: user.salt || '',
        password_hash: user.passwordHash || '',
        recovery_salt: user.recoverySalt || '',
        recovery_code_hash: user.recoveryCodeHash || '',
        last_login_at: new Date().toISOString()
      };
      await fetch(`${url}/rest/v1/user_accounts`, {
        method: 'POST',
        headers,
        body: JSON.stringify(accountBody)
      });
    } catch (e) {
      console.warn('[SyncService] Push user_accounts failed:', e);
    }

    // 2. 間違えた問題（全件）のUPSERT
    try {
      const mistakes = JSON.parse(localStorage.getItem('mongol_app_mistakes_v1') || '[]');
      if (Array.isArray(mistakes) && mistakes.length > 0) {
        for (let i = 0; i < mistakes.length; i += 50) {
          const chunk = mistakes.slice(i, i + 50).map(m => ({
            id: m.id || `m_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            user_id: user.id,
            question: m.question || '',
            correct_answer: m.correctAnswer || '',
            user_answer: m.userAnswer || '',
            type: m.type || 'word',
            category: m.category || '単語',
            explanation: m.explanation || '',
            wrong_count: m.wrongCount || 1,
            last_wrong_date: m.lastWrongDate || new Date().toISOString(),
            resolved: Boolean(m.resolved),
            updated_at: new Date().toISOString()
          }));
          await fetch(`${url}/rest/v1/user_mistakes`, {
            method: 'POST',
            headers,
            body: JSON.stringify(chunk)
          });
        }
      }
    } catch (e) {
      console.warn('[SyncService] Push user_mistakes failed:', e);
    }

    // 3. 単語進捗（全件）のUPSERT
    try {
      const progMap = JSON.parse(localStorage.getItem('mongol_app_word_progress_v1') || '{}');
      const progList = Object.values(progMap);
      if (progList.length > 0) {
        for (let i = 0; i < progList.length; i += 50) {
          const chunk = progList.slice(i, i + 50).map(p => ({
            user_id: user.id,
            word_id: p.wordId || p.id,
            srs_level: p.srsLevel || 0,
            interval_days: p.intervalDays || 0,
            next_review_date: p.nextReviewDate || null,
            last_learned_at: p.lastLearnedAt || new Date().toISOString(),
            study_count: p.studyCount || 1,
            correct_count: p.correctCount || 0,
            wrong_count: p.wrongCount || 0,
            accuracy: p.accuracy || 0,
            updated_at: p.updatedAt || new Date().toISOString()
          }));
          await fetch(`${url}/rest/v1/user_word_progress`, {
            method: 'POST',
            headers,
            body: JSON.stringify(chunk)
          });
        }
      }
    } catch (e) {
      console.warn('[SyncService] Push user_word_progress failed:', e);
    }

    // 4. 学習履歴のUPSERT
    try {
      const history = JSON.parse(localStorage.getItem('mongol_app_history_v1') || '[]');
      if (Array.isArray(history) && history.length > 0) {
        const recentHistory = history.slice(-50);
        const chunk = recentHistory.map(h => ({
          id: h.id || `h_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          user_id: user.id,
          type: h.type || 'word',
          total: h.total || 0,
          correct: h.correct || 0,
          category: h.category || '',
          mode: h.mode || '',
          timestamp: h.timestamp || new Date().toISOString()
        }));
        await fetch(`${url}/rest/v1/user_history`, {
          method: 'POST',
          headers,
          body: JSON.stringify(chunk)
        });
      }
    } catch (e) {
      console.warn('[SyncService] Push user_history failed:', e);
    }

    // 5. 万能スナップショットのUPSERT（全学習データまるごと即時同期フォールバック）
    try {
      const fullSnapshot = {
        user_id: user.id,
        username: user.username,
        updated_at: new Date().toISOString(),
        payload: {
          account: user,
          mistakes: JSON.parse(localStorage.getItem('mongol_app_mistakes_v1') || '[]'),
          wordProgress: JSON.parse(localStorage.getItem('mongol_app_word_progress_v1') || '{}'),
          srsProgress: JSON.parse(localStorage.getItem('mongol_app_srs_progress_v1') || '{}'),
          gameStats: JSON.parse(localStorage.getItem('mongol_app_game_stats_v1') || '{}'),
          dailyStats: JSON.parse(localStorage.getItem('mongol_app_daily_stats_v1') || '{}'),
          mascot: JSON.parse(localStorage.getItem('mongol_app_penguin_mascot_v1') || '{}'),
          penguinMascot: JSON.parse(localStorage.getItem('mongol_app_penguin_mascot_v1') || '{}'),
          history: JSON.parse(localStorage.getItem('mongol_app_history_v1') || '[]')
        }
      };
      await fetch(`${url}/rest/v1/user_sync_snapshot`, {
        method: 'POST',
        headers,
        body: JSON.stringify(fullSnapshot)
      });
      console.log('[SyncService] Successfully pushed full snapshot to Supabase.');
    } catch (e) {
      console.warn('[SyncService] Push user_sync_snapshot failed:', e);
    }
  }

  /**
   * Supabaseから指定アカウントまたは全アカウント情報を検索・取得してローカルにマージ
   */
  static async fetchAccountFromCloud(targetUsername = null) {
    const config = this.getConfig();
    if (!config || !config.supabaseUrl || !config.supabaseAnonKey) return null;
    const url = this.cleanSupabaseUrl(config.supabaseUrl);
    const headers = {
      'apikey': config.supabaseAnonKey,
      'Authorization': `Bearer ${config.supabaseAnonKey}`,
      'Accept': 'application/json'
    };

    try {
      let endpoint = `${url}/rest/v1/user_accounts?select=*`;
      if (targetUsername) {
        endpoint += `&username=ilike.${encodeURIComponent(targetUsername.trim())}`;
      }
      let rows = [];
      try {
        const res = await fetch(endpoint, { headers });
        if (res.ok) {
          rows = await res.json();
        }
      } catch (_) {}

      // user_accounts が空またはテーブル未存在の場合、user_sync_snapshot からもアカウントを自動抽出
      if (!Array.isArray(rows) || rows.length === 0) {
        try {
          let snapEndpoint = `${url}/rest/v1/user_sync_snapshot?select=*`;
          if (targetUsername) {
            snapEndpoint += `&username=ilike.${encodeURIComponent(targetUsername.trim())}`;
          }
          const snapRes = await fetch(snapEndpoint, { headers });
          if (snapRes.ok) {
            const snaps = await snapRes.json();
            if (Array.isArray(snaps) && snaps.length > 0) {
              const fromSnap = snaps.filter(s => s.payload && s.payload.account).map(s => s.payload.account);
              if (fromSnap.length > 0) {
                AuthService.mergeServerUsers(fromSnap);
                return fromSnap;
              }
            }
          }
        } catch (_) {}
        return null;
      }

      const matched = rows.map(r => ({
        id: r.id,
        username: r.username,
        displayName: r.display_name || r.username,
        salt: r.salt,
        passwordHash: r.password_hash,
        recoverySalt: r.recovery_salt,
        recoveryCodeHash: r.recovery_code_hash,
        recoveryUsed: r.recovery_used,
        createdAt: r.created_at,
        lastLoginAt: r.last_login_at
      }));

      // ローカルユーザーにマージ
      AuthService.mergeServerUsers(matched);
      return matched;
    } catch (e) {
      console.warn('[SyncService] fetchAccountFromCloud failed:', e);
      return null;
    }
  }
}
