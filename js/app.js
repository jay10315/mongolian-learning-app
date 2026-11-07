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
import { WordFamilyComponent } from './components/WordFamilyQuiz.js';
import { PenguinExpeditionComponent } from './components/PenguinExpedition.js';
import { SpellingGameComponent } from './components/SpellingGame.js';
import { ExerciseNotebookTestComponent } from './components/ExerciseNotebookTest.js';
import { SuffixRuleDojoComponent } from './components/SuffixRuleDojo.js';
import { EtymologyMasterComponent } from './components/EtymologyMaster.js';
import { InterviewMasterComponent } from './components/InterviewMaster.js';
import { GenreWordMasterComponent } from './components/GenreWordMaster.js';

class App {
  static currentTab = 'home';

  static init() {
    // 0. ワンクリックURLログイン（Magic Login Token）およびSupabaseクラウド自動設定
    if (typeof window !== 'undefined' && window.location) {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('login_token') || urlParams.get('auth_token');
        const sessionId = urlParams.get('session_id') || urlParams.get('pair');
        const sbUrl = urlParams.get('sb_url') || urlParams.get('supabase_url');
        const sbKey = urlParams.get('sb_key') || urlParams.get('supabase_key');

        let hasCustomParams = false;

        // A. Supabase 設定の自動注入
        if (sbUrl && sbKey) {
          hasCustomParams = true;
          try {
            const decodedUrl = decodeURIComponent(sbUrl).trim();
            const decodedKey = decodeURIComponent(sbKey).trim();
            SyncService.saveConfig({ supabaseUrl: decodedUrl, supabaseAnonKey: decodedKey });
            console.log('[App] Auto-configured Supabase credentials from URL parameters');
          } catch (e) {
            console.warn('[App] Failed to auto-configure Supabase:', e);
          }
        }

        // B. Magic Login Token による自動ログイン
        if (token) {
          hasCustomParams = true;
          const res = AuthService.processMagicLoginToken(token);
          if (res.success) {
            if (sessionId) {
              AuthService.notifyPairSuccess(sessionId, res.user);
            }
            // Supabase設定があれば即座に最新データをPull
            const activeConfig = SyncService.getConfig();
            if (activeConfig && activeConfig.supabaseUrl) {
              SyncService.pullFromCloud(activeConfig, res.user).catch(() => {});
            }
            setTimeout(() => {
              AuthService.showLoginSuccessToast(res.user.displayName || res.user.username);
            }, 300);
          }
        } else if (sessionId) {
          fetch(`/api/sync/pair/data?sessionId=${encodeURIComponent(sessionId)}`)
            .then(r => r.ok ? r.json() : null)
            .then(data => {
              if (data && data.token) {
                const res = AuthService.processMagicLoginToken(data.token);
                if (res.success) {
                  AuthService.notifyPairSuccess(sessionId, res.user);
                  const activeConfig = SyncService.getConfig();
                  if (activeConfig && activeConfig.supabaseUrl) {
                    SyncService.pullFromCloud(activeConfig, res.user).catch(() => {});
                  }
                  setTimeout(() => {
                    AuthService.showLoginSuccessToast(res.user.displayName || res.user.username);
                  }, 300);
                }
              }
            }).catch(() => {});
        } else if (sbUrl && sbKey) {
          // トークンなしでもログイン中なら即座にPull
          const currentUser = AuthService.getCurrentUser();
          if (currentUser) {
            const activeConfig = SyncService.getConfig();
            SyncService.pullFromCloud(activeConfig, currentUser).catch(() => {});
          }
        }

        // URLをクリーンに保つ
        if (hasCustomParams) {
          const cleanUrl = window.location.pathname;
          window.history.replaceState({}, document.title, cleanUrl);
        }
      } catch (err) {
        console.warn('[App] Magic login token check error:', err);
      }
    }

    // 1. ストレージ初期化
    StorageService.init();

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
    Navbar.init(this.currentTab, (tab) => {
      this.navigate(tab);
    });

    // 5. 初期タブの描画
    this.renderCurrentView();

    // 6. Service Worker登録（PWAオフライン対応）
    this.registerServiceWorker();
  }

  static navigate(tab) {
    this.currentTab = tab;
    this.renderCurrentView();
  }

  static renderCurrentView() {
    const mainContainer = document.getElementById('main-content');
    if (!mainContainer) return;

    mainContainer.innerHTML = '';

    const onNavigate = (tab) => {
      Navbar.setTab(tab);
    };

    switch (this.currentTab) {
      case 'genre_master':
        GenreWordMasterComponent.render(mainContainer, onNavigate);
        break;
      case 'home':
        HomeComponent.render(mainContainer, onNavigate);
        break;
      case 'word_game':
        WordGameComponent.render(mainContainer, onNavigate);
        break;
      case 'word_test':
        WordTestComponent.render(mainContainer, onNavigate);
        break;
      case 'japanese_test':
        JapaneseTestComponent.render(mainContainer, onNavigate);
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
      case 'suffix_dojo':
        SuffixRuleDojoComponent.render(mainContainer, onNavigate);
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
                if (k !== 'mongol-app-cache-v3') {
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
