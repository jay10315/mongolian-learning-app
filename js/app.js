import { LaterWordsComponent } from './components/LaterWords.js';
// メインアプリケーションコントローラー
import { StorageService } from './services/storage.js';
import { AuthService } from './services/auth.js';
import { SpeechService } from './services/speech.js';
import { ThemeService } from './services/theme.js';
import { CyrillicKeyboard } from './components/CyrillicKeyboard.js';
import { Navbar } from './components/Navbar.js';
import { HomeComponent } from './components/Home.js';
import { WordGameComponent } from './components/WordGame.js';
import { WordTestComponent } from './components/WordTest.js';
import { JapaneseTestComponent } from './components/JapaneseTest.js';
import { GrammarTestComponent } from './components/GrammarTest.js';
import { DeclensionTestComponent } from './components/DeclensionTest.js';
import { FlashcardsComponent } from './components/Flashcards.js';
import { ReviewNotebookComponent } from './components/ReviewNotebook.js';
import { MaterialManagerComponent } from './components/MaterialManager.js';
import { ReferenceGuideComponent } from './components/ReferenceGuide.js';
import { ListeningTestComponent } from './components/ListeningTest.js';
import { ReadingTestComponent } from './components/ReadingTest.js';
import { TypingTestComponent } from './components/TypingTest.js';
import { SentenceTranslationTestComponent } from './components/SentenceTranslationTest.js';
import { PronunciationTestComponent } from './components/PronunciationTest.js';
import { RoleplayComponent } from './components/RoleplayTest.js';
import { NumberMasterComponent } from './components/NumberMasterTest.js';
import { ShadowingDictationComponent } from './components/ShadowingDictationTest.js';
import { CultureComponent } from './components/CultureQuiz.js';
import { WordFamilyComponent } from './components/WordFamilyComponent.js';
import { WordFamilyQuizComponent } from './components/WordFamilyQuiz.js';
import { PenguinExpeditionComponent } from './components/PenguinExpedition.js';
import { SpellingGameComponent } from './components/SpellingGame.js';
import { ExerciseNotebookTestComponent } from './components/ExerciseNotebookTest.js';
import { SuffixRuleDojoComponent } from './components/SuffixRuleDojo.js';
import { PronounMasterComponent } from './components/PronounMaster.js';
import { SpatialPostpositionMasterComponent } from './components/SpatialPostpositionMaster.js';
import { EtymologyMasterComponent } from './components/EtymologyMaster.js';
import { MockExamComponent } from './components/MockExam.js';
import { InterviewMasterComponent } from './components/InterviewMaster.js';
import { GenreWordMasterComponent } from './components/GenreWordMaster.js';

class App {
  static currentTab = 'home';

  static init() {
    // 0. QRコード・同期用リンク・URLハッシュによる即時データ自動引き継ぎ
    if (typeof window !== 'undefined' && window.location) {
      try {
        let syncInput = '';

        // 1. URLハッシュ (#sync=...) の最優先検知（サーバーにデータ送信せず414/404完全防止）
        if (window.location.hash && window.location.hash.includes('sync=')) {
          const m = window.location.hash.match(/sync=([^&\s]+)/i);
          if (m) syncInput = decodeURIComponent(m[1]).trim();
        }

        // 2. クエリパラメータ (?sync_token=... / ?login_token=... / ?token=...) の検知
        const urlParams = new URLSearchParams(window.location.search);
        // C2. auto_sync クエリパラメータ検知（QRコード読取後の即時自動同期）
        if (urlParams.get('auto_sync') === '1') {
          console.log('[App] Detected auto_sync=1. Triggering instant bidirectional sync...');
          if (typeof SyncService !== 'undefined' && SyncService.triggerSync) {
            SyncService.triggerSync().then(() => {
              if (typeof AuthService !== 'undefined' && AuthService.showLoginSuccessToast) {
                AuthService.showLoginSuccessToast('✅ クラウドから全学習データを同期しました！');
              }
            }).catch(console.warn);
          }
          try {
            window.history.replaceState(null, '', window.location.origin + window.location.pathname);
          } catch (_) {}
        }
        if (!syncInput) {
          syncInput = urlParams.get('sync_token') ||
                      urlParams.get('login_token') ||
                      urlParams.get('auth_token') ||
                      urlParams.get('token') ||
                      urlParams.get('data') || '';
        }

        const sbUrl = urlParams.get('sb_url') || urlParams.get('supabase_url');
        const sbKey = urlParams.get('sb_key') || urlParams.get('supabase_key');
        const userParam = urlParams.get('u') || urlParams.get('user') || urlParams.get('username');
        const sessionId = urlParams.get('session_id') || urlParams.get('pair');

        // A. Supabase 設定の自動注入
        if (sbUrl && sbKey) {
          try {
            const decodedUrl = decodeURIComponent(sbUrl).trim();
            const decodedKey = decodeURIComponent(sbKey).trim();
            if (typeof SyncService !== 'undefined' && SyncService.saveConfig) {
              SyncService.saveConfig({ supabaseUrl: decodedUrl, supabaseAnonKey: decodedKey, syncEnabled: true });
            }
          } catch (_) {}
        }

        // B. 同期コード / ハッシュ / トークンによる即時データ自動引き継ぎ（最優先）
        if (syncInput) {
          console.log('[App] Detected sync token in URL/Hash. Restoring data...');
          const res = (typeof AuthService.importBackupData === 'function')
            ? AuthService.importBackupData(syncInput)
            : AuthService.processMagicLoginToken(syncInput);
          if (res.success) {
            if (sessionId && AuthService.notifyPairSuccess) {
              AuthService.notifyPairSuccess(sessionId, res.user);
            }

            // URLをクリーンアップ（ハッシュやクエリパラメータを除去）
            try {
              const cleanUrl = window.location.origin + window.location.pathname;
              window.history.replaceState(null, '', cleanUrl);
            } catch (_) {}

            setTimeout(() => {
              const uName = (res.user && (res.user.displayName || res.user.username)) || 'pen';
              const stats = res.stats || {};
              const note = stats.mistakesCount ? ` (間違い${stats.mistakesCount}問 / 進捗${stats.wordsCount}語)` : '';
              AuthService.showLoginSuccessToast(`データを同期しました！【${uName}】${note}`);
            }, 300);
          } else {
            console.warn('[App] Automatic sync token restore failed:', res.error);
          }
        } else if (userParam && (sbUrl || (typeof SyncService !== 'undefined' && SyncService.isCloudConfigured && SyncService.isCloudConfigured()))) {
          // C. クラウド（Supabase）直結のURL引継ぎ
          const cleanUser = userParam.trim().toLowerCase();
          const existingUsers = AuthService.getLocalUsers();
          let matchedUser = existingUsers.find(u => AuthService.normalizeUsername(u.username) === cleanUser);
          if (!matchedUser) {
            matchedUser = {
              id: `usr_${Date.now()}`,
              username: cleanUser,
              displayName: userParam.trim(),
              createdAt: new Date().toISOString(),
              lastLoginAt: new Date().toISOString()
            };
            existingUsers.push(matchedUser);
            AuthService.saveLocalUsers(existingUsers);
          }
          const session = AuthService.setSession(matchedUser);
          const activeConfig = SyncService.getConfig();
          if (activeConfig && activeConfig.supabaseUrl) {
            SyncService.pullFromCloud(activeConfig, session).then(() => {
              setTimeout(() => {
                AuthService.showLoginSuccessToast(`データを同期しました（${cleanUser}）`);
              }, 400);
            }).catch(() => {});
          }
          try {
            window.history.replaceState(null, '', window.location.origin + window.location.pathname);
          } catch (_) {}
        }
      } catch (err) {
        console.warn('[App] Automatic sync detection error:', err);
      }
    }
    // 1. ストレージ初期化
    StorageService.init();

    // 1.1 デフォルトアカウント「pen」の自動ログイン保証（ログイン操作不要で常時同期）
    try {
      let curUser = AuthService.getCurrentUser();
      if (!curUser) {
        const users = AuthService.getLocalUsers();
        let penUser = users.find(u => AuthService.normalizeUsername(u.username) === 'pen') || users[0];
        if (!penUser) {
          penUser = {
            id: 'usr_1793885321289_e34dbfca',
            username: 'pen',
            displayName: 'pen',
            createdAt: '2026-11-07T00:00:00.000Z'
          };
          users.push(penUser);
          AuthService.saveLocalUsers(users);
        }
        AuthService.setSession(penUser);
      }
    } catch (_) {}

    // 2. テーマ・背景色初期化（ユーザー設定またはナイトモード反映）
    try {
      ThemeService.init();
    } catch (e) {
      console.warn('[App] ThemeService.init error:', e);
    }

    // サーバー（LAN経由）に登録済みのアカウントをバックグラウンドで取得・同期
    try {
      AuthService.fetchServerAccounts().then(serverUsers => {
        if (serverUsers && serverUsers.length > 0) {
          AuthService.mergeServerUsers(serverUsers);
        }
      }).catch(() => {});
    } catch (_) {}

    // 2. 音声サービス初期化
    SpeechService.init();

    // 3. キリル文字キーボード初期化
    CyrillicKeyboard.init();

    // 4. ナビゲーションバー初期化
    Navbar.init(this.currentTab, (tab, options = null) => {
      this.navigate(tab, options);
    });

    // 5. 初期タブの描画
    this.renderCurrentView();

    // 6. Service Worker登録（PWAオフライン対応）
    this.registerServiceWorker();
  }

  static navigate(tab, options = null) {
    this.currentTab = tab;
    this.tabOptions = options;
    this.renderCurrentView();
  }

  static renderCurrentView() {
    const mainContainer = document.getElementById('main-content');
    if (!mainContainer) return;

    mainContainer.innerHTML = '';

    const onNavigate = (tab, options = null) => {
      Navbar.setTab(tab, options);
    };

    switch (this.currentTab) {
      case 'genre_master':
        GenreWordMasterComponent.render(mainContainer, onNavigate);
        break;
      case 'active_words':
        {
          const Comp = (typeof LaterWordsComponent !== 'undefined' && LaterWordsComponent) ||
                       (typeof window !== 'undefined' && window.LaterWordsComponent);
          if (Comp && typeof Comp.render === 'function') {
            Comp.render(mainContainer, onNavigate, { mode: 'active' });
          } else {
            console.error('[App] LaterWordsComponent is not defined');
            mainContainer.innerHTML = '<div class="p-8 text-center text-red-500 font-bold">コンポーネント読み込みエラーが発生しました。再読み込みしてください。</div>';
          }
        }
        break;
      case 'later_words':
        {
          const Comp = (typeof LaterWordsComponent !== 'undefined' && LaterWordsComponent) ||
                       (typeof window !== 'undefined' && window.LaterWordsComponent);
          if (Comp && typeof Comp.render === 'function') {
            Comp.render(mainContainer, onNavigate, { mode: 'later' });
          } else {
            console.error('[App] LaterWordsComponent is not defined');
            mainContainer.innerHTML = '<div class="p-8 text-center text-red-500 font-bold">コンポーネント読み込みエラーが発生しました。再読み込みしてください。</div>';
          }
        }
        break;
      case 'home':
        HomeComponent.render(mainContainer, onNavigate);
        break;
      case 'word_game':
        WordGameComponent.render(mainContainer, onNavigate);
        break;
      case 'word_test':
        WordTestComponent.render(mainContainer, onNavigate, this.tabOptions);
        break;
      case 'japanese_test':
        JapaneseTestComponent.render(mainContainer, onNavigate, this.tabOptions);
        break;
      case 'grammar_test':
        GrammarTestComponent.render(mainContainer, onNavigate);
        break;
      case 'declension_test':
        DeclensionTestComponent.render(mainContainer, onNavigate);
        break;
      case 'listening_test':
        ListeningTestComponent.render(mainContainer, onNavigate);
        break;
      case 'reading_test':
        ReadingTestComponent.render(mainContainer, onNavigate);
        break;
      case 'typing_test':
        TypingTestComponent.render(mainContainer, onNavigate);
        break;
      case 'sentence_test':
        SentenceTranslationTestComponent.render(mainContainer, onNavigate);
        break;
      case 'pronunciation_test':
        PronunciationTestComponent.render(mainContainer, onNavigate);
        break;
      case 'mock_exam':
        const mockExam = new MockExamComponent(mainContainer, onNavigate);
        mockExam.render();
        break;
      case 'interview_prep':
        InterviewMasterComponent.render(mainContainer, onNavigate);
        break;
      case 'roleplay':
        RoleplayComponent.render(mainContainer, onNavigate);
        break;
      case 'number_master':
        NumberMasterComponent.render(mainContainer, onNavigate);
        break;
      case 'shadowing_dictation':
        ShadowingDictationComponent.render(mainContainer, onNavigate);
        break;
      case 'culture':
        CultureComponent.render(mainContainer, onNavigate);
        break;
      case 'word_family':
        WordFamilyComponent.render(mainContainer, onNavigate);
        break;
      case 'root_antonym':
        WordFamilyQuizComponent.render(mainContainer, onNavigate);
        break;
      case 'suffix_dojo':
        SuffixRuleDojoComponent.render(mainContainer, onNavigate);
        break;
      case 'pronoun_master':
        PronounMasterComponent.render(mainContainer, onNavigate);
        break;
      case 'spatial_postposition_master':
        SpatialPostpositionMasterComponent.render(mainContainer, onNavigate);
        break;
      case 'etymology_master':
        EtymologyMasterComponent.render(mainContainer, onNavigate);
        break;
      case 'expedition':
        PenguinExpeditionComponent.render(mainContainer, onNavigate);
        break;
      case 'exercise_notebook':
        ExerciseNotebookTestComponent.render(mainContainer, onNavigate);
        break;
      case 'spelling_game':
        SpellingGameComponent.render(mainContainer, onNavigate);
        break;
      case 'flashcards':
        FlashcardsComponent.render(mainContainer, onNavigate);
        break;
      case 'review':
        ReviewNotebookComponent.render(mainContainer, onNavigate);
        break;
      case 'looked_up_words':
        ReviewNotebookComponent.state.view = 'list';
        ReviewNotebookComponent.state.filterType = 'looked_up';
        ReviewNotebookComponent.render(mainContainer, onNavigate);
        break;
      case 'materials':
        MaterialManagerComponent.render(mainContainer, onNavigate);
        break;
      case 'reference':
        ReferenceGuideComponent.render(mainContainer, onNavigate);
        break;
      default:
        HomeComponent.render(mainContainer, onNavigate);
    }
  }

  static registerServiceWorker() {
    try {
      // Service WorkerはHTTPSまたはlocalhostでのみ有効化（タブレット等のLANアクセス時のSecurityErrorを防止）
      const isSecure = typeof window !== 'undefined' && (
        window.location.protocol === 'https:' ||
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1'
      );
      if (!isSecure) return;

      if ('serviceWorker' in navigator) {
        try {
          if ('caches' in window && caches.keys) {
            caches.keys().then(keys => {
              keys.forEach(k => {
                if (k !== 'mongol-app-cache-v10') {
                  try { caches.delete(k); } catch (_) {}
                }
              });
            }).catch(() => {});
          }
        } catch (_) {}

        try {
          if (navigator.serviceWorker.getRegistrations) {
            navigator.serviceWorker.getRegistrations().then(regs => {
              if (regs) {
                for (let reg of regs) {
                  try { reg.update(); } catch (_) {}
                }
              }
            }).catch(() => {});
          }
        } catch (_) {}

        window.addEventListener('load', () => {
          navigator.serviceWorker.register('./sw.js').catch(err => {
            console.log('SW registration note:', err);
          });
        });
      }
    } catch (_) {}
  }
}

// DOM読み込み完了時、またはすでに完了している場合に確実に起動
function startApplication() {
  try {
    App.init();
  } catch (err) {
    console.error('Fatal initialization error:', err);
    const mainEl = document.getElementById('main-content') || document.body;
    mainEl.innerHTML = `
      <div style="padding: 24px; color: #991b1b; background: #fee2e2; border-radius: 12px; margin: 20px; font-family: sans-serif;">
        <h2 style="font-weight: bold; margin-bottom: 8px;">初期化エラーが発生しました:</h2>
        <pre style="background: white; padding: 12px; border-radius: 8px; border: 1px solid #fca5a5; overflow-x: auto;">${err.stack || err.message || err}</pre>
      </div>
    `;
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApplication);
} else {
  startApplication();
}
