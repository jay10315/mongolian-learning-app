import { QRCodeGenerator } from '../utils/qrcode.js';
import { SoundEffects } from '../utils/helpers.js';
// ナビゲーションバー（デスクトップ上部 ＆ モバイル下部固定）
import { SpeechService } from '../services/speech.js';
import { AuthService } from '../services/auth.js';
import { SyncService } from '../services/sync.js';
import { GamificationService } from '../services/gamification.js';
import { ThemeService } from '../services/theme.js';
import { ThemeModal } from './ThemeModal.js';
import { PenguinMascot } from './PenguinMascot.js';
import { AuthModal } from './AuthModal.js';
import { CloudSettingsModal } from './CloudSettingsModal.js';
import { BatchAudioModal } from './BatchAudioModal.js';

export class Navbar {
  static currentTab = 'home';
  static onTabChange = null;

  static init(currentTab, onTabChange) {
    this.currentTab = currentTab;
    this.onTabChange = onTabChange;
    this.render();

    SpeechService.onVoiceStatusChange(() => {
      this.updateVoiceStatus();
    });

    SyncService.addListener(() => {
      this.updateSyncStatus();
    });

    ThemeService.addListener(() => {
      this.render();
    });
  }

  static setTab(tab) {
    this.currentTab = tab;
    this.render();
    if (this.onTabChange) {
      this.onTabChange(tab);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  static render() {
    const headerContainer = document.getElementById('app-header');
    const bottomNavContainer = document.getElementById('mobile-bottom-nav');
    const currentUser = AuthService.getCurrentUser();
    const profile = GamificationService.getProfile();
    const themeState = ThemeService.getThemeState();
    const isDarkMode = themeState.isDark;

    const tabs = [
      { id: 'home', label: 'ホーム', icon: '🏠' },
      { id: 'genre_master', label: 'ジャンル別単語', icon: '🏷️' },
      { id: 'exercise_notebook', label: '練習ノート', icon: '📓' },
      { id: 'word_game', label: '単語ゲーム', icon: '🎮' },
      { id: 'word_test', label: '単語テスト', icon: '📝' },
      { id: 'japanese_test', label: '日本語訳テスト', icon: '🇯🇵' },
      { id: 'grammar_test', label: '文法テスト', icon: '📐' },
      { id: 'declension_test', label: '格変化・活用', icon: '⚡' },
      { id: 'suffix_dojo', label: '語尾・助詞道場', icon: '⚡' },
      { id: 'interview_prep', label: '口述試験特訓', icon: '🎙️' },
      { id: 'roleplay', label: '会話ロールプレイ', icon: '🏕️' },
      { id: 'number_master', label: '数字マスター', icon: '🔢' },
      { id: 'shadowing_dictation', label: 'シャドーイング', icon: '🎙️' },
      { id: 'culture', label: 'ことわざ・なぞなぞ', icon: '🐴' },
      { id: 'word_family', label: '語根・対義語', icon: '🌳' },
      { id: 'expedition', label: 'ペンギン探検隊', icon: '🗺️' },
      { id: 'listening_test', label: 'リスニング', icon: '🎧' },
      { id: 'reading_test', label: '読解テスト', icon: '📖' },
      { id: 'typing_test', label: 'タイピング', icon: '⌨️' },
      { id: 'sentence_test', label: '文章入力テスト', icon: '✍️' },
      { id: 'pronunciation_test', label: '発音特訓', icon: '🎙️' },
      { id: 'flashcards', label: 'カード', icon: '🃏' },
      { id: 'review', label: '間違い復習', icon: '🔥' },
      { id: 'materials', label: '教材登録', icon: '📚' },
      { id: 'reference', label: '文法まとめ', icon: '📖' }
    ];

    if (headerContainer) {
      headerContainer.innerHTML = `
        <header class="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
          <div class="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between">
            <!-- ロゴ -->
            <div class="flex items-center gap-3 cursor-pointer" id="nav-logo">
              <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-md">
                М
              </div>
              <div>
                <h1 class="text-base sm:text-lg font-bold text-slate-800 leading-tight flex items-center gap-1.5">
                  Монгол хэл
                  <span class="text-[11px] font-normal text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 hidden sm:inline-block">
                    モンゴル語学習ノート
                  </span>
                </h1>
                <p class="text-[11px] text-slate-500">モンゴル語学習・単語文法テスト</p>
              </div>
            </div>

            <!-- 右側: 同期状態 ＆ ユーザーアカウント ＆ 音声エンジン -->
            <div class="flex items-center gap-2">
              
              <!-- Оцон шувуу ＆ レベル表示ピル -->
              <button type="button" id="btn-penguin-status" class="text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5 font-black bg-gradient-to-r from-sky-50 to-emerald-50 text-sky-900 border border-sky-300 hover:border-sky-500 transition-all shadow-2xs cursor-pointer">
                <span>🐧</span>
                <span>Lv.${profile.level}</span>
                <span class="hidden sm:inline text-[11px] text-sky-700 font-bold">${profile.currentTitle}</span>
              </button>

              <!-- クラウド同期インジケーター -->
              <button type="button" id="btn-cloud-sync-status" class="text-xs px-2 sm:px-2.5 py-1 rounded-full flex items-center gap-1.5 font-medium transition-all border cursor-pointer hover:shadow-2xs">
                <span class="w-2 h-2 rounded-full" id="sync-dot"></span>
                <span id="sync-text" class="hidden xs:inline">同期確認中</span>
              </button>

              <!-- ユーザーアカウントボタン -->
              <button type="button" id="btn-user-auth" class="text-xs px-2.5 sm:px-3 py-1 rounded-full flex items-center gap-1.5 font-bold transition-all border ${
                currentUser ? 'bg-slate-800 text-white border-slate-800 hover:bg-slate-900' : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
              }">
                <span>👤</span>
                <span class="max-w-[80px] sm:max-w-[120px] truncate">${currentUser ? (currentUser.displayName || currentUser.username) : 'ログイン'}</span>
              </button>

              <!-- 🌙/☀️ ワンタップナイトモード切替 -->
              <button type="button" id="btn-toggle-night-mode" class="text-xs px-2 sm:px-2.5 py-1 rounded-full flex items-center gap-1 font-bold transition-all border cursor-pointer hover:shadow-2xs ${
                isDarkMode 
                  ? 'bg-amber-400/20 text-amber-300 border-amber-400/40 hover:bg-amber-400/30' 
                  : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
              }" title="ナイトモード切替（ワンタップで昼夜反転）">
                <span>${isDarkMode ? '☀️' : '🌙'}</span>
                <span class="hidden md:inline">${isDarkMode ? 'ライト' : 'ナイト'}</span>
              </button>

              <!-- 🎨 背景色・テーマパレット設定 -->
              <button type="button" id="btn-open-theme-palette" class="text-xs px-2 sm:px-2.5 py-1 rounded-full flex items-center gap-1 font-bold transition-all border border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 cursor-pointer hover:shadow-2xs" title="背景色・テーマの変更（お好みの色にカスタマイズ）">
                <span>🎨</span>
                <span class="hidden sm:inline">背景色</span>
              </button>

              <!-- タブレット・スマホ連携ボタン -->
              <button type="button" id="btn-device-connect" class="text-xs px-2 sm:px-2.5 py-1 rounded-full flex items-center gap-1 font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-all shadow-2xs cursor-pointer" title="タブレットやスマホで開く">
                <span>📱</span>
                <span class="hidden sm:inline">タブレット連携</span>
              </button>

              <!-- 音声一括ダウンロードボタン -->
              <button type="button" id="btn-batch-audio-dl" class="text-xs px-2 sm:px-2.5 py-1 rounded-full flex items-center gap-1 font-bold bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-300 transition-all shadow-2xs cursor-pointer" title="全音声を端末に一括保存（完全オフライン対応）">
                <span>📥</span>
                <span class="hidden sm:inline">音声一括DL</span>
              </button>

              <!-- 音声エンジンステータス（デスクトップ） -->
              <div id="voice-indicator" class="hidden lg:flex text-xs px-2.5 py-1 rounded-full items-center gap-1.5 font-medium bg-slate-100 text-slate-600 border border-slate-200">
                <span class="w-2 h-2 rounded-full bg-slate-400" id="voice-dot"></span>
                <span id="voice-text">音声確認中...</span>
              </div>
            </div>
          </div>

          <!-- デスクトップ用タブバー -->
          <div class="hidden md:block max-w-6xl mx-auto px-4 sm:px-6">
            <nav class="flex space-x-1 border-t border-slate-100 pt-1 pb-1 overflow-x-auto no-scrollbar scroll-smooth">
              ${tabs.map(t => {
                const isActive = this.currentTab === t.id;
                return `
                  <button type="button" class="nav-tab-btn px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                    isActive 
                      ? 'bg-emerald-50 text-emerald-800 font-bold border-b-2 border-emerald-600' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }" data-tab="${t.id}">
                    <span>${t.icon}</span>
                    <span>${t.label}</span>
                  </button>
                `;
              }).join('')}
            </nav>
          </div>
        </header>
      `;

      // ロゴクリックでホームへ
      const logo = headerContainer.querySelector('#nav-logo');
      if (logo) logo.addEventListener('click', () => this.setTab('home'));

      // ペンギンステータスピル
      const penguinBtn = headerContainer.querySelector('#btn-penguin-status');
      if (penguinBtn) {
        penguinBtn.addEventListener('click', () => {
          PenguinMascot.showPenguinRoomModal(this.onTabChange);
        });
      }

      // クラウド同期ボタン
      const cloudBtn = headerContainer.querySelector('#btn-cloud-sync-status');
      if (cloudBtn) {
        cloudBtn.addEventListener('click', () => {
          CloudSettingsModal.show(() => {
            this.render();
          });
        });
      }

      // アカウントボタン
      const authBtn = headerContainer.querySelector('#btn-user-auth');
      if (authBtn) {
        authBtn.addEventListener('click', () => {
          AuthModal.show(() => {
            this.render();
          });
        });
      }

      // ワンタップナイトモード切替
      const nightModeBtn = headerContainer.querySelector('#btn-toggle-night-mode');
      if (nightModeBtn) {
        nightModeBtn.addEventListener('click', () => {
          ThemeService.toggleNightMode();
        });
      }

      // 背景色・テーマパレットモーダル
      const themePaletteBtn = headerContainer.querySelector('#btn-open-theme-palette');
      if (themePaletteBtn) {
        themePaletteBtn.addEventListener('click', () => {
          ThemeModal.show(() => this.render());
        });
      }

      // タブレット連携ボタン
      const deviceBtn = headerContainer.querySelector('#btn-device-connect');
      if (deviceBtn) {
        deviceBtn.addEventListener('click', () => {
          this.showTabletConnectModal();
        });
      }

      // 音声一括ダウンロードボタン
      const batchAudioBtn = headerContainer.querySelector('#btn-batch-audio-dl');
      if (batchAudioBtn) {
        batchAudioBtn.addEventListener('click', () => {
          BatchAudioModal.show();
        });
      }

      // デスクトップタブクリック
      headerContainer.querySelectorAll('.nav-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const tabId = btn.getAttribute('data-tab');
          this.setTab(tabId);
        });
      });
    }

    // スマホ用ボトムナビゲーション（片手操作・親指リーチ最適化）
    if (bottomNavContainer) {
      bottomNavContainer.innerHTML = `
        <div class="mobile-bottom-nav md:hidden py-1 px-1 bg-white/95 backdrop-blur-md border-t border-slate-200">
          <div class="grid grid-cols-5 gap-0.5 text-center">
            ${[
              tabs.find(t => t.id === 'home'),
              tabs.find(t => t.id === 'word_game'),
              tabs.find(t => t.id === 'word_test'),
              tabs.find(t => t.id === 'review'),
              { id: 'account_action', label: currentUser ? 'アカウント' : 'ログイン', icon: '👤' }
            ].filter(Boolean).map(t => {
              const isActive = this.currentTab === t.id;
              return `
                <button type="button" class="mobile-tab-btn py-1 px-0.5 flex flex-col items-center justify-center rounded-lg transition-all ${
                  isActive ? 'text-emerald-700 font-bold bg-emerald-50/80' : 'text-slate-500 hover:text-slate-700'
                }" data-tab="${t.id}">
                  <span class="text-lg leading-none mb-0.5">${t.icon}</span>
                  <span class="text-[10px] leading-tight truncate w-full">${t.label}</span>
                </button>
              `;
            }).join('')}
          </div>
        </div>
      `;

      bottomNavContainer.querySelectorAll('.mobile-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const tabId = btn.getAttribute('data-tab');
          if (tabId === 'account_action') {
            AuthModal.show(() => this.render());
          } else {
            this.setTab(tabId);
          }
        });
      });
    }

    this.updateVoiceStatus();
    this.updateSyncStatus();
  }

  static updateSyncStatus() {
    const dot = document.getElementById('sync-dot');
    const text = document.getElementById('sync-text');
    const btn = document.getElementById('btn-cloud-sync-status');
    if (!dot || !text || !btn) return;

    const status = SyncService.state.status;
    const queueLen = SyncService.state.pendingCount;

    if (status === 'synced') {
      dot.className = "w-2 h-2 rounded-full bg-emerald-500";
      text.textContent = "クラウド同期済";
      btn.className = "text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5 font-medium bg-emerald-50 text-emerald-800 border border-emerald-200";
      btn.title = "Supabaseクラウドデータベースと同期完了";
    } else if (status === 'syncing') {
      dot.className = "w-2 h-2 rounded-full bg-amber-500 animate-spin";
      text.textContent = "同期中...";
      btn.className = "text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5 font-medium bg-amber-50 text-amber-800 border border-amber-200";
      btn.title = "データを同期しています...";
    } else if (status === 'offline') {
      dot.className = "w-2 h-2 rounded-full bg-orange-500";
      text.textContent = queueLen > 0 ? `未送信 ${queueLen}件` : "オフライン";
      btn.className = "text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5 font-medium bg-orange-50 text-orange-800 border border-orange-200";
      btn.title = "オフラインです。データは端末に保存され、通信復帰時に自動送信されます。";
    } else {
      // local_only
      dot.className = "w-2 h-2 rounded-full bg-slate-400";
      text.textContent = "ローカル保存中";
      btn.className = "text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5 font-medium bg-slate-100 text-slate-600 border border-slate-200";
      btn.title = "クリックしてクラウド同期を設定（スマホ・PC同期）";
    }
  }

  static async updateVoiceStatus() {
    const indicator = document.getElementById('voice-indicator');
    const dot = document.getElementById('voice-dot');
    const text = document.getElementById('voice-text');
    if (!indicator || !dot || !text) return;

    try {
      const stats = await SpeechService.getCacheStats();
      if (stats && stats.count > 0) {
        dot.className = "w-2 h-2 rounded-full bg-emerald-500 animate-pulse";
        text.textContent = `音声: ${stats.count}件端末保存済`;
        indicator.className = "text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5 font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 cursor-pointer";
        indicator.title = "クリックして音声一括ダウンロード画面を開く";
        indicator.onclick = () => BatchAudioModal.show();
        return;
      }
    } catch (_) {}

    dot.className = "w-2 h-2 rounded-full bg-sky-500";
    text.textContent = "高品位 Neural 音声";
    indicator.className = "text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5 font-medium bg-sky-50 text-sky-800 border border-sky-200 cursor-pointer";
    indicator.title = "クリックして音声一括ダウンロード画面を開く";
    indicator.onclick = () => BatchAudioModal.show();
  }

  static showTabletConnectModal() {
    let modal = document.getElementById('tablet-connect-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'tablet-connect-modal';
      document.body.appendChild(modal);
    }

    const host = typeof window !== 'undefined' && window.location ? window.location.hostname : '';
    const port = typeof window !== 'undefined' && window.location && window.location.port ? window.location.port : '5173';
    const isLocalhost = host === 'localhost' || host === '127.0.0.1' || !host;
    let targetIp = isLocalhost ? '192.168.2.226' : host;
    const protocol = typeof window !== 'undefined' && window.location && window.location.protocol.startsWith('http')
      ? window.location.protocol
      : 'http:';
    const pathname = typeof window !== 'undefined' && window.location ? (window.location.pathname || '/') : '/';
    const cleanPath = pathname.endsWith('.html') ? pathname : (pathname.endsWith('/') ? pathname : pathname + '/');

    const currentUser = AuthService.getCurrentUser();
    const magicToken = currentUser ? AuthService.createMagicLoginToken(currentUser) : null;
    const sessionId = 'pair_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);

    // サーバーにペアセッションを登録（軽量QR用）
    if (currentUser && magicToken) {
      AuthService.registerPairSession(sessionId, currentUser, magicToken);
    }

    // 動作モード: 'quick' (軽量・高速読取) | 'full' (完全データ同封)
    let qrMode = 'quick';
    let isPaired = false;
    let pollInterval = null;
    let broadcastChannel = null;

    const buildUrl = (mode) => {
      const base = `${protocol}//${targetIp}:${port}${cleanPath}`;
      if (mode === 'quick') {
        const sep = base.includes('?') ? '&' : '?';
        return `${base}${sep}pair=${encodeURIComponent(sessionId)}&device_sync=1`;
      }
      if (currentUser) {
        const fullMagicUrl = AuthService.createMagicLoginUrl(currentUser, base);
        const sep = fullMagicUrl.includes('?') ? '&' : '?';
        return `${fullMagicUrl}${sep}session_id=${encodeURIComponent(sessionId)}&device_sync=1`;
      }
      const sep = base.includes('?') ? '&' : '?';
      return `${base}${sep}session_id=${encodeURIComponent(sessionId)}&device_sync=1`;
    };

    const renderModal = () => {
      const currentUrl = buildUrl(qrMode);
      const qrSvg = QRCodeGenerator.generateSvg(currentUrl, {
        errorCorrectionLevel: 'M',
        cellSize: qrMode === 'quick' ? 4 : 3,
        margin: 4
      });

      modal.className = "fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in";
      modal.innerHTML = `
        <div class="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-100 space-y-4 max-h-[92vh] overflow-y-auto">
          
          <!-- ヘッダー -->
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <div class="flex items-center gap-2">
              <span class="text-2xl">📱</span>
              <div>
                <h3 class="font-extrabold text-base text-slate-800">タブレット・スマホで開く</h3>
                <p class="text-[11px] text-slate-500">iPad・Android・iPhoneと連携</p>
              </div>
            </div>
            <button type="button" id="btn-close-tablet-modal" class="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
              ✕
            </button>
          </div>

          <!-- ユーザーバッジ -->
          ${currentUser ? `
            <div class="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="text-lg">👤</span>
                <div class="text-left">
                  <div class="text-[10px] text-emerald-700 font-bold">自動ログイン設定済み</div>
                  <div class="text-xs font-black text-emerald-900">${currentUser.displayName || currentUser.username}</div>
                </div>
              </div>
              <span class="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold">ワンタップ連携</span>
            </div>
          ` : ''}

          <!-- リアルタイム同期・疎通ステータスバナー -->
          <div id="tablet-sync-status-box" class="p-3 rounded-2xl flex items-center justify-center gap-2.5 text-xs font-bold transition-all shadow-xs ${
            isPaired
              ? 'bg-emerald-50 border-2 border-emerald-500 text-emerald-900 shadow-md'
              : 'bg-amber-50 border border-amber-200 text-amber-900'
          }">
            ${
              isPaired
                ? `<span class="text-xl animate-bounce">🎉</span>
                   <div class="text-left">
                     <div class="text-xs sm:text-sm font-black text-emerald-800">同期完了！ 端末が正常に連携されました</div>
                     <div id="tablet-sync-paired-details" class="text-[11px] text-emerald-700 font-semibold mt-0.5">接続待機から自動ログインへ切り替えました</div>
                   </div>`
                : `<span class="inline-block w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping shrink-0"></span>
                   <span id="tablet-sync-status-text">📡 接続待機中... スマホやタブレットでQRコードを読み取ってください</span>`
            }
          </div>

          <!-- QRコード表示エリア（完全オフライン＆高コントラスト） -->
          <div class="text-center space-y-2.5">
            <div class="inline-block p-3 bg-white rounded-2xl border-2 border-slate-200 shadow-sm max-w-[240px] w-full mx-auto">
              <div id="tablet-qr-svg-wrapper" class="w-48 h-48 sm:w-52 sm:h-52 mx-auto flex items-center justify-center overflow-hidden">
                ${qrSvg || '<div class="text-xs text-red-500">QRコードの生成に失敗しました</div>'}
              </div>
            </div>

            <!-- QRモード切替ピル -->
            <div class="flex items-center justify-center gap-1.5 p-1 bg-slate-100 rounded-xl max-w-xs mx-auto text-[11px] font-bold">
              <button type="button" id="btn-toggle-qr-quick" class="flex-1 py-1 px-2 rounded-lg transition-all cursor-pointer ${
                qrMode === 'quick' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }">
                ⚡️ クイック同期 (高速読取)
              </button>
              <button type="button" id="btn-toggle-qr-full" class="flex-1 py-1 px-2 rounded-lg transition-all cursor-pointer ${
                qrMode === 'full' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }">
                📦 完全データ同封
              </button>
            </div>
          </div>

          <!-- URLコピー欄 -->
          <div class="space-y-1.5">
            <div class="flex items-center justify-between text-[11px] font-bold text-slate-500">
              <label>タブレットのブラウザ（Safari / Chrome）に入力 または開く:</label>
              <button type="button" id="btn-toggle-ip-edit" class="text-indigo-600 hover:underline text-[10px]">
                IP変更
              </button>
            </div>
            
            <div id="ip-edit-container" class="hidden pb-1">
              <div class="flex items-center gap-1 text-xs">
                <span class="text-slate-500 font-bold text-[11px]">PCのWi-Fi IP:</span>
                <input type="text" id="input-custom-ip" value="${targetIp}" class="flex-1 px-2 py-1 border border-indigo-300 rounded-md text-xs font-mono font-bold">
                <button type="button" id="btn-apply-custom-ip" class="px-2.5 py-1 bg-indigo-600 text-white rounded-md text-xs font-bold">反映</button>
              </div>
            </div>

            <div class="flex items-center gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-200">
              <input type="text" id="tablet-connect-url-input" value="${currentUrl}" readonly class="w-full bg-transparent text-xs sm:text-sm font-black text-indigo-700 text-center select-all focus:outline-hidden">
              <button type="button" id="btn-copy-tablet-url" class="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shrink-0 transition-all active:scale-95 cursor-pointer">
                URLコピー
              </button>
            </div>

            ${magicToken ? `
              <div class="flex items-center justify-between gap-2 pt-1">
                <button type="button" id="btn-copy-tablet-token-only" class="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all cursor-pointer" data-token="${magicToken}">
                  📋 同期コードのみコピー
                </button>
                <button type="button" id="btn-download-tablet-backup" class="flex-1 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold transition-all cursor-pointer">
                  💾 バックアップ保存 (.json)
                </button>
              </div>
            ` : ''}
          </div>

          <!-- 接続の手順ガイド -->
          <div class="bg-amber-50 rounded-2xl p-3.5 border border-amber-200 text-xs text-amber-900 space-y-1.5 leading-relaxed">
            <div class="font-bold flex items-center gap-1">
              <span>💡</span> 接続の手順
            </div>
            <ol class="list-decimal list-inside space-y-1 text-[11px] text-amber-950">
              <li>タブレットをこのPCと<strong>同じWi-Fi</strong>に接続します</li>
              <li>タブレットのカメラでQRコードを読み取るか、ブラウザのURL欄に入力します</li>
              ${currentUser ? `<li><strong>パスワード入力不要</strong>で自動ログイン＆ペンギンの育成状況も引き継がれます</li>` : `<li>画面共有やAirDrop不要で、そのままタッチ操作で快適に学習できます</li>`}
            </ol>
          </div>

          <button type="button" id="btn-close-tablet-modal-bottom" class="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-colors cursor-pointer">
            ${isPaired ? '✅ 連携完了（閉じる）' : '閉じる'}
          </button>
        </div>
      `;

      bindEvents();
    };

    // ペアリング成功時の処理
    const onPairSuccess = (info) => {
      if (isPaired) return;
      isPaired = true;
      if (pollInterval) {
        clearInterval(pollInterval);
        pollInterval = null;
      }
      try {
        if (typeof SoundEffects !== 'undefined' && SoundEffects.playCorrect) {
          SoundEffects.playCorrect();
        }
      } catch (_) {}

      const statusBox = modal.querySelector('#tablet-sync-status-box');
      if (statusBox) {
        statusBox.className = "p-3.5 bg-emerald-50 border-2 border-emerald-500 text-emerald-900 rounded-2xl flex items-center justify-center gap-2.5 text-xs font-black shadow-md animate-bounce";
        statusBox.innerHTML = `
          <span class="text-xl">🎉</span>
          <div class="text-left">
            <div class="text-xs sm:text-sm font-black text-emerald-800">同期完了！ 端末が正常に連携されました</div>
            <div class="text-[11px] text-emerald-700 font-semibold mt-0.5">接続端末: ${info.device || 'モバイル端末'} （${info.displayName || info.username || 'アカウント連携済'}）</div>
          </div>
        `;
      }
      const bottomBtn = modal.querySelector('#btn-close-tablet-modal-bottom');
      if (bottomBtn) {
        bottomBtn.textContent = '✅ 連携完了（閉じる）';
        bottomBtn.className = "w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs transition-colors cursor-pointer";
      }
    };

    const bindEvents = () => {
      const closeModal = () => {
        if (pollInterval) clearInterval(pollInterval);
        if (broadcastChannel) {
          try { broadcastChannel.close(); } catch (_) {}
        }
        window.removeEventListener('storage', storageHandler);
        modal.remove();
      };

      const closeTopBtn = modal.querySelector('#btn-close-tablet-modal');
      if (closeTopBtn) closeTopBtn.addEventListener('click', closeModal);
      const closeBottomBtn = modal.querySelector('#btn-close-tablet-modal-bottom');
      if (closeBottomBtn) closeBottomBtn.addEventListener('click', closeModal);
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });

      // QRモード切替
      const btnQuick = modal.querySelector('#btn-toggle-qr-quick');
      if (btnQuick) {
        btnQuick.addEventListener('click', () => {
          qrMode = 'quick';
          renderModal();
        });
      }
      const btnFull = modal.querySelector('#btn-toggle-qr-full');
      if (btnFull) {
        btnFull.addEventListener('click', () => {
          qrMode = 'full';
          renderModal();
        });
      }

      // IP変更トグル
      const ipToggleBtn = modal.querySelector('#btn-toggle-ip-edit');
      const ipContainer = modal.querySelector('#ip-edit-container');
      if (ipToggleBtn && ipContainer) {
        ipToggleBtn.addEventListener('click', () => {
          ipContainer.classList.toggle('hidden');
        });
      }
      const applyIpBtn = modal.querySelector('#btn-apply-custom-ip');
      if (applyIpBtn) {
        applyIpBtn.addEventListener('click', () => {
          const input = modal.querySelector('#input-custom-ip');
          if (input && input.value.trim()) {
            targetIp = input.value.trim();
            renderModal();
          }
        });
      }

      // URLコピー
      const copyBtn = modal.querySelector('#btn-copy-tablet-url');
      if (copyBtn) {
        copyBtn.addEventListener('click', () => {
          const url = buildUrl(qrMode);
          navigator.clipboard.writeText(url).then(() => {
            copyBtn.textContent = 'コピー完了！';
            copyBtn.className = "px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold shrink-0";
            setTimeout(() => {
              copyBtn.textContent = 'URLコピー';
              copyBtn.className = "px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shrink-0 transition-all active:scale-95 cursor-pointer";
            }, 2000);
          }).catch(() => {
            const input = modal.querySelector('#tablet-connect-url-input');
            if (input) {
              input.select();
              document.execCommand('copy');
              copyBtn.textContent = 'コピー完了！';
            }
          });
        });
      }

      // トークンのみコピー
      const copyTokenBtn = modal.querySelector('#btn-copy-tablet-token-only');
      if (copyTokenBtn) {
        copyTokenBtn.addEventListener('click', () => {
          const token = copyTokenBtn.getAttribute('data-token');
          if (token) {
            navigator.clipboard.writeText(token).then(() => {
              copyTokenBtn.textContent = '✅ トークンをコピーしました';
              setTimeout(() => {
                copyTokenBtn.textContent = '📋 同期コードのみコピー';
              }, 2000);
            });
          }
        });
      }

      // バックアップJSONダウンロード
      const backupBtn = modal.querySelector('#btn-download-tablet-backup');
      if (backupBtn) {
        backupBtn.addEventListener('click', () => {
          const dataStr = AuthService.exportBackupData(currentUser);
          if (dataStr) {
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `mongol_learning_backup_${currentUser.username}_${Date.now()}.json`;
            a.click();
            URL.revokeObjectURL(url);
          }
        });
      }
    };

    // 疎通監視リスナー 1: BroadcastChannel
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        broadcastChannel = new BroadcastChannel('mongol_app_sync_channel');
        broadcastChannel.onmessage = (event) => {
          if (event.data && (event.data.sessionId === sessionId || event.data.username === (currentUser && currentUser.username))) {
            onPairSuccess(event.data);
          }
        };
      }
    } catch (_) {}

    // 疎通監視リスナー 2: StorageEvent
    const storageHandler = (e) => {
      if (e.key === 'mongol_app_last_pair_event' && e.newValue) {
        try {
          const data = JSON.parse(e.newValue);
          if (data.sessionId === sessionId || data.username === (currentUser && currentUser.username)) {
            onPairSuccess(data);
          }
        } catch (_) {}
      }
    };
    window.addEventListener('storage', storageHandler);

    // 疎通監視リスナー 3: サーバーポーリング (LAN経由の異端末同期)
    pollInterval = setInterval(async () => {
      if (isPaired) return;
      const res = await AuthService.checkPairStatus(sessionId);
      if (res && res.status === 'paired') {
        onPairSuccess(res.session || {});
      }
    }, 1200);

    // サーバー情報から正確なWi-FiローカルIPを取得して反映
    fetch('/api/server_info')
      .then(r => r.ok ? r.json() : null)
      .then(info => {
        if (info && info.local_ip && info.local_ip !== targetIp) {
          targetIp = info.local_ip;
          if (!isPaired) renderModal();
        }
      }).catch(() => {});

    renderModal();
  }
}
