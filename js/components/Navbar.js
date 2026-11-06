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
      { id: 'spelling_game', label: 'スペルゲーム', icon: '🌕' },
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

    const host = window.location.hostname;
    const port = window.location.port || '5173';
    // localhostの場合、Wi-FiローカルIPアドレス（192.168.2.226）を推奨URLとして提示
    const isLocalhost = host === 'localhost' || host === '127.0.0.1' || !host;
    const targetIp = isLocalhost ? '192.168.2.226' : host;
    const targetBaseUrl = window.location.protocol.startsWith('http')
      ? `${window.location.protocol}//${targetIp}:${port}`
      : `http://${targetIp}:${port}`;

    const currentUser = AuthService.getCurrentUser();
    const magicToken = currentUser ? AuthService.createMagicLoginToken(currentUser) : null;
    const targetUrl = magicToken ? AuthService.createMagicLoginUrl(currentUser, targetBaseUrl) : targetBaseUrl;

    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(targetUrl)}`;

    modal.className = "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in";
    modal.innerHTML = `
      <div class="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <div class="flex items-center gap-2">
            <span class="text-2xl">📱</span>
            <div>
              <h3 class="font-extrabold text-base text-slate-800">タブレット・スマホで開く</h3>
              <p class="text-[11px] text-slate-500">iPad・Android・iPhoneと連携</p>
            </div>
          </div>
          <button type="button" id="btn-close-tablet-modal" class="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
            ✕
          </button>
        </div>

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

        <div class="text-center space-y-3">
          <div class="inline-block p-3 bg-white rounded-2xl border-2 border-slate-200 shadow-xs">
            <img src="${qrUrl}" alt="QRコード" class="w-44 h-44 mx-auto rounded-lg" onerror="this.style.display='none'; document.getElementById('qr-fallback-box').classList.remove('hidden');">
            <div id="qr-fallback-box" class="hidden text-xs text-slate-500 py-6">
              カメラまたはブラウザに下記URLを入力してください
            </div>
          </div>

          <div class="space-y-1.5">
            <label class="block text-[11px] font-bold text-slate-500">タブレットのブラウザ（Safari / Chrome）に入力 または開く:</label>
            <div class="flex items-center gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-200">
              <input type="text" id="tablet-connect-url-input" value="${targetUrl}" readonly class="w-full bg-transparent text-xs sm:text-sm font-black text-indigo-700 text-center select-all focus:outline-hidden">
              <button type="button" id="btn-copy-tablet-url" class="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shrink-0 transition-all active:scale-95">
                コピー
              </button>
            </div>
          </div>
        </div>

        <div class="bg-amber-50 rounded-2xl p-3.5 border border-amber-200 text-xs text-amber-900 space-y-1.5 leading-relaxed">
          <div class="font-bold flex items-center gap-1">
            <span>💡</span> 接続の手順
          </div>
          <ol class="list-decimal list-inside space-y-1 text-[11px] text-amber-950">
            <li>タブレットをこのPCと<strong>同じWi-Fi</strong>に接続します</li>
            <li>タブレットのカメラでQRコードを読み取るか、ブラウザのURL欄に上記を入力します</li>
            ${currentUser ? `<li><strong>パスワード入力不要</strong>で自動ログイン＆ペンギンの育成状況も引き継がれます</li>` : `<li>画面共有やAirDrop不要で、そのままタッチ操作で快適に学習できます</li>`}
          </ol>
        </div>

        <button type="button" id="btn-close-tablet-modal-bottom" class="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-colors">
          閉じる
        </button>
      </div>
    `;

    const closeModal = () => modal.remove();
    modal.querySelector('#btn-close-tablet-modal').addEventListener('click', closeModal);
    modal.querySelector('#btn-close-tablet-modal-bottom').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    const copyBtn = modal.querySelector('#btn-copy-tablet-url');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(targetUrl).then(() => {
          copyBtn.textContent = 'コピー完了！';
          copyBtn.className = "px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold shrink-0";
          setTimeout(() => {
            copyBtn.textContent = 'コピー';
            copyBtn.className = "px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shrink-0 transition-all active:scale-95";
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
  }
}
