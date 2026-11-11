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

  static setTab(tab, options = null) {
    this.currentTab = tab;
    this.render();
    if (this.onTabChange) {
      this.onTabChange(tab, options);
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
      { id: 'active_words', label: '今覚える単語', icon: '📚' },
      { id: 'later_words', label: 'あとで覚える単語', icon: '⏳' },
      { id: 'word_family', label: '単語ファミリー', icon: '🌳' },
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
      { id: 'root_antonym', label: '語根・対義語', icon: '🌲' },
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
        <header class="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs w-full max-w-full overflow-hidden">
          <div class="max-w-6xl mx-auto px-2.5 sm:px-6 py-2 flex items-center justify-between w-full">
            <!-- ロゴ -->
            <div class="flex items-center gap-2 sm:gap-3 cursor-pointer shrink-0" id="nav-logo">
              <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white font-bold text-base sm:text-xl shadow-md">
                М
              </div>
              <div>
                <h1 class="text-sm sm:text-lg font-bold text-slate-800 leading-tight flex items-center gap-1">
                  Монгол хэл
                  <span class="text-[10px] font-normal text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200 hidden sm:inline-block">
                    モンゴル語ノート
                  </span>
                </h1>
                <p class="text-[10px] text-slate-500 hidden sm:block">モンゴル語学習・単語文法テスト</p>
              </div>
            </div>

            <!-- 右側: 同期状態 ＆ ユーザーアカウント ＆ ナイトモード（スマホ超軽量化・画面はみ出し完全防止） -->
            <div class="flex items-center gap-1 sm:gap-2 shrink-0">
              
              <!-- Оцон шувуу ＆ レベル表示ピル -->
              <button type="button" id="btn-penguin-status" class="text-[11px] sm:text-xs px-1.5 sm:px-2.5 py-1 rounded-full flex items-center gap-1 font-black bg-gradient-to-r from-sky-50 to-emerald-50 text-sky-900 border border-sky-300 hover:border-sky-500 transition-all shadow-2xs cursor-pointer">
                <span>🐧</span>
                <span>Lv.${profile.level}</span>
                <span class="hidden md:inline text-[11px] text-sky-700 font-bold">${profile.currentTitle}</span>
              </button>

              <!-- クラウド同期インジケーター -->
              <button type="button" id="btn-cloud-sync-status" class="text-[11px] sm:text-xs px-1.5 sm:px-2.5 py-1 rounded-full flex items-center gap-1 font-bold transition-all border cursor-pointer hover:shadow-2xs" title="クラウド同期設定・状態確認">
                <span>☁️</span>
                <span class="w-2 h-2 rounded-full" id="sync-dot"></span>
                <span id="sync-text" class="hidden sm:inline">同期</span>
              </button>

              <!-- ユーザーアカウントボタン -->
              <button type="button" id="btn-user-auth" class="text-[11px] sm:text-xs px-1.5 sm:px-3 py-1 rounded-full flex items-center gap-1 font-bold transition-all border ${
                currentUser ? 'bg-slate-800 text-white border-slate-800 hover:bg-slate-900' : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
              }">
                <span>👤</span>
                <span class="max-w-[50px] sm:max-w-[120px] truncate">${currentUser ? (currentUser.displayName || currentUser.username) : 'ログイン'}</span>
              </button>

              <!-- 🌙/☀️ ワンタップナイトモード切替 -->
              <button type="button" id="btn-toggle-night-mode" class="text-[11px] sm:text-xs px-1.5 sm:px-2.5 py-1 rounded-full flex items-center gap-1 font-bold transition-all border cursor-pointer hover:shadow-2xs ${
                isDarkMode 
                  ? 'bg-amber-400/20 text-amber-300 border-amber-400/40 hover:bg-amber-400/30' 
                  : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
              }" title="夜間・ダークモード切替">
                <span>${isDarkMode ? '☀️' : '🌙'}</span>
              </button>
            </div>
          </div>

          
