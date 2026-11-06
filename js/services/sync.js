// クラウド同期・オフラインキューサービス（Supabase REST / LocalStorage ハイブリッド）
import { AuthService } from './auth.js';

export class SyncService {
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
      if (stored) return JSON.parse(stored);
      if (typeof window !== 'undefined' && window.MONGOL_APP_CONFIG) {
        return window.MONGOL_APP_CONFIG;
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  static saveConfig(config) {
    if (config) {
      localStorage.setItem(this.CONFIG_KEY, JSON.stringify(config));
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

    if (!config || !user || !navigator.onLine) {
      this.updateStatus();
      return;
    }

    this.isSyncing = true;
    this.updateStatus('syncing');

    try {
      // 1. 保留中キューの送信
      await this.flushQueue(config, user);

      // 2. クラウドからの最新データ取得・マージ
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
    const url = config.supabaseUrl.replace(/\/+$/, '');
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
    const url = config.supabaseUrl.replace(/\/+$/, '');
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
        }
      }
    } catch (e) {
      console.warn('[SyncService] Pull mistakes failed:', e);
    }
  }
}
