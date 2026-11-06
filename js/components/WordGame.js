// 単語・文法・翻訳 統合バトルゲーム コンポーネント（独立したゲームコーナー）
import { StorageService } from '../services/storage.js';
import { SpeechService } from '../services/speech.js';
import { SoundEffects, shuffleArray, getWordGrammarDetails, isWordAnswerMatch, SPECIAL_CYRILLIC_BAR, isCyrillic, isPronunciationCautionWord } from '../utils/helpers.js';
import { PenguinMascot } from './PenguinMascot.js';

export class WordGameComponent {
  static container = null;
  static onNavigate = null;

  // ゲーム状態
  static state = {
    view: 'mode_select', // 'mode_select' | 'playing' | 'result'
    mode: 'speedrun',     // 'speedrun' | 'survival' | 'combo' | 'relax'
    questionGenre: 'ja_meaning', // 'ja_meaning' (日本語訳) | 'mn_translation' (モンゴル語訳) | 'grammar' (文法) | 'mixed' (ミックス)
    inputMode: 'choice_4', // 'choice_4' | 'text'
    selectedCategory: 'all',

    // プレイ中データ
    questionsPool: [],
    currentQuestionIndex: 0,
    currentQuestion: null,
    choices: [],
    
    // スコア＆統計
    score: 0,
    combo: 0,
    maxCombo: 0,
    correctCount: 0,
    totalAnswered: 0,
    xpEarned: 0,
    startTime: null,
    questionStartTime: null,
    answerTimes: [],
    
    // モード固有
    timeLeft: 60,
    lives: 3,
    maxLives: 3,
    
    // インタラクション制御
    hasAnswered: false,
    selectedChoiceId: null,
    isCorrect: false,
    mistakes: [],
    correctAnswers: [],
    resultFilter: 'all',
    
    // 結果データ
    lastGameResult: null,
    showAchievementsModal: false
  };

  static timerInterval = null;
  static dropInterval = null;
  static dropState = {
    y: 2,
    duration: 5500,
    startTime: 0,
    isDestroyed: false
  };

  static playLaserSound() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.16);
      gain.gain.setValueAtTime(0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.16);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.17);
    } catch (_) {}
  }

  static render(container, onNavigate) {
    this.container = container;
    this.onNavigate = onNavigate;
    this.stopTimer();

    if (this.state.view === 'playing') {
      this.renderPlaying();
    } else if (this.state.view === 'result') {
      this.renderResult();
    } else {
      this.state.view = 'mode_select';
      this.renderModeSelect();
    }
  }

  // ==========================================
  // 1. モード選択画面
  // ==========================================
  static renderModeSelect() {
    const stats = StorageService.getGameStats();
    const vocabList = StorageService.getVocabulary();
    const grammarQuizzes = StorageService.getGrammarQuizzes();
    const declensionQuizzes = StorageService.getDeclensionQuizzes();
    const totalGrammarQuestions = grammarQuizzes.length + declensionQuizzes.length;
    const categories = Array.from(new Set(vocabList.map(v => v.category).filter(Boolean)));

    // XP進捗の計算
    const currentLevel = stats.level || 1;
    let baseLevelXp = 0;
    let xpForNext = 150;
    for (let lv = 1; lv < currentLevel; lv++) {
      baseLevelXp += xpForNext;
      xpForNext = Math.round(150 * Math.pow(1.15, lv));
    }
    const currentXpInLevel = Math.max(0, stats.totalXp - baseLevelXp);
    const xpPercent = Math.min(100, Math.round((currentXpInLevel / xpForNext) * 100));

    this.container.innerHTML = `
      <div class="max-w-4xl mx-auto space-y-5 animate-fade-in pb-16">
        
        <!-- プレイヤーヘッダーカード -->
        <div class="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 rounded-2xl p-5 text-white shadow-md relative overflow-hidden">
          <div class="absolute -right-8 -bottom-8 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
            <div>
              <div class="flex items-center gap-2">
                <span class="text-2xl">🎮</span>
                <h2 class="text-xl sm:text-2xl font-black tracking-tight">モンゴル語 学習バトル</h2>
                <span class="text-xs bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full font-bold">4ジャンル対応</span>
              </div>
              <p class="text-xs text-emerald-100 mt-1">
                日本語訳・モンゴル語訳・文法・ミックスから選んで挑戦！XPを獲得して <span class="cyrillic-text font-bold">Оцон шувуу</span> とレベルアップを目指そう。
              </p>
            </div>

            <div class="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
              <button type="button" id="btn-open-penguin-room" class="px-3 py-2 bg-white/15 hover:bg-white/25 active:scale-95 transition-all rounded-xl text-xs font-bold flex items-center gap-1.5 border border-white/20 shadow-xs">
                <span>🐧</span>
                <span>お部屋</span>
              </button>
              <button type="button" id="btn-open-achievements" class="px-3 py-2 bg-white/15 hover:bg-white/25 active:scale-95 transition-all rounded-xl text-xs font-bold flex items-center gap-1.5 border border-white/20 shadow-xs">
                <span>🏆</span>
                <span>実績 (${(stats.unlockedAchievements || []).length}/10)</span>
              </button>
            </div>
          </div>

          <!-- プレイヤー進捗バー -->
          <div class="mt-4 pt-4 border-t border-white/15 grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-xl bg-white text-emerald-800 font-black text-xl flex items-center justify-center shadow-md shrink-0">
                Lv.${currentLevel}
              </div>
              <div>
                <div class="text-xs text-emerald-100 font-medium">現在の称号</div>
                <div class="font-extrabold text-white text-sm sm:text-base">${stats.currentTitle || '草原の見習い 🌱'}</div>
              </div>
            </div>

            <div class="sm:col-span-2 space-y-1">
              <div class="flex justify-between text-xs text-emerald-100 font-semibold">
                <span>XP: ${stats.totalXp.toLocaleString()}</span>
                <span>次のレベルまで: ${Math.max(0, xpForNext - currentXpInLevel)} XP</span>
              </div>
              <div class="w-full bg-black/20 h-3 rounded-full overflow-hidden p-0.5">
                <div class="bg-gradient-to-r from-amber-300 to-yellow-400 h-full rounded-full transition-all duration-500 shadow-xs" style="width: ${xpPercent}%"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- 自己ベストハイスコア概要 -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div class="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs text-center">
            <div class="text-[11px] text-slate-500 font-bold flex items-center justify-center gap-1">
              <span>⏱️</span> スピードラン
            </div>
            <div class="text-base sm:text-lg font-black text-amber-600 mt-0.5">
              ${(stats.highScores?.speedrun || 0).toLocaleString()} <span class="text-xs font-normal text-slate-400">点</span>
            </div>
          </div>

          <div class="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs text-center">
            <div class="text-[11px] text-slate-500 font-bold flex items-center justify-center gap-1">
              <span>❤️</span> サバイバル
            </div>
            <div class="text-base sm:text-lg font-black text-rose-600 mt-0.5">
              ${(stats.highScores?.survival || 0).toLocaleString()} <span class="text-xs font-normal text-slate-400">点</span>
            </div>
          </div>

          <div class="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs text-center">
            <div class="text-[11px] text-slate-500 font-bold flex items-center justify-center gap-1">
              <span>🔥</span> コンボ最高
            </div>
            <div class="text-base sm:text-lg font-black text-orange-600 mt-0.5">
              ${Math.max(stats.bestCombos?.combo || 0, stats.bestCombos?.speedrun || 0, stats.bestCombos?.survival || 0)} <span class="text-xs font-normal text-slate-400">連続</span>
            </div>
          </div>

          <div class="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs text-center">
            <div class="text-[11px] text-slate-500 font-bold flex items-center justify-center gap-1">
              <span>📚</span> 累計正解数
            </div>
            <div class="text-base sm:text-lg font-black text-emerald-600 mt-0.5">
              ${(stats.totalCorrect || 0).toLocaleString()} <span class="text-xs font-normal text-slate-400">問</span>
            </div>
          </div>
        </div>

        <!-- 1. 出題ジャンル選択（日本語訳 / モンゴル語訳 / 文法 / ミックス） -->
        <div class="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="text-xs sm:text-sm font-black text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
              <span>📚</span> 出題ジャンルを選ぶ
            </h3>
            <span class="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
              タップして切り替え
            </span>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            
            <!-- 日本語訳 -->
            <button type="button" class="btn-genre-card p-3 rounded-2xl border-2 text-left transition-all ${
              this.state.questionGenre === 'ja_meaning'
                ? 'border-indigo-600 bg-indigo-50/60 shadow-xs ring-2 ring-indigo-500/20'
                : 'border-slate-200 hover:border-slate-300 bg-slate-50/60'
            }" data-genre="ja_meaning">
              <div class="flex items-center justify-between mb-1.5">
                <span class="text-2xl">🇯🇵</span>
                <span class="w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  this.state.questionGenre === 'ja_meaning' ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'
                }">
                  ${this.state.questionGenre === 'ja_meaning' ? '<span class="w-1.5 h-1.5 bg-white rounded-full"></span>' : ''}
                </span>
              </div>
              <div class="font-black text-xs sm:text-sm text-slate-900">日本語訳</div>
              <div class="text-[10px] text-slate-500 mt-0.5 font-medium leading-tight">モンゴル語を見て日本語を回答</div>
            </button>

            <!-- モンゴル語訳 -->
            <button type="button" class="btn-genre-card p-3 rounded-2xl border-2 text-left transition-all ${
              this.state.questionGenre === 'mn_translation'
                ? 'border-emerald-600 bg-emerald-50/60 shadow-xs ring-2 ring-emerald-500/20'
                : 'border-slate-200 hover:border-slate-300 bg-slate-50/60'
            }" data-genre="mn_translation">
              <div class="flex items-center justify-between mb-1.5">
                <span class="text-2xl">🇲🇳</span>
                <span class="w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  this.state.questionGenre === 'mn_translation' ? 'border-emerald-600 bg-emerald-600' : 'border-slate-300'
                }">
                  ${this.state.questionGenre === 'mn_translation' ? '<span class="w-1.5 h-1.5 bg-white rounded-full"></span>' : ''}
                </span>
              </div>
              <div class="font-black text-xs sm:text-sm text-slate-900">モンゴル語訳</div>
              <div class="text-[10px] text-slate-500 mt-0.5 font-medium leading-tight">日本語を見てキリル文字を回答</div>
            </button>

            <!-- イラスト当て -->
            <button type="button" class="btn-genre-card p-3 rounded-2xl border-2 text-left transition-all ${
              this.state.questionGenre === 'visual'
                ? 'border-sky-600 bg-sky-50/60 shadow-xs ring-2 ring-sky-500/20'
                : 'border-slate-200 hover:border-slate-300 bg-slate-50/60'
            }" data-genre="visual">
              <div class="flex items-center justify-between mb-1.5">
                <span class="text-2xl">🖼️</span>
                <span class="w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  this.state.questionGenre === 'visual' ? 'border-sky-600 bg-sky-600' : 'border-slate-300'
                }">
                  ${this.state.questionGenre === 'visual' ? '<span class="w-1.5 h-1.5 bg-white rounded-full"></span>' : ''}
                </span>
              </div>
              <div class="font-black text-xs sm:text-sm text-slate-900">イラスト当て</div>
              <div class="text-[10px] text-slate-500 mt-0.5 font-medium leading-tight">絵を見てモンゴル語を即答</div>
            </button>

            <!-- 文法 -->
            <button type="button" class="btn-genre-card p-3 rounded-2xl border-2 text-left transition-all ${
              this.state.questionGenre === 'grammar'
                ? 'border-amber-600 bg-amber-50/60 shadow-xs ring-2 ring-amber-500/20'
                : 'border-slate-200 hover:border-slate-300 bg-slate-50/60'
            }" data-genre="grammar">
              <div class="flex items-center justify-between mb-1.5">
                <span class="text-2xl">📐</span>
                <span class="w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  this.state.questionGenre === 'grammar' ? 'border-amber-600 bg-amber-600' : 'border-slate-300'
                }">
                  ${this.state.questionGenre === 'grammar' ? '<span class="w-1.5 h-1.5 bg-white rounded-full"></span>' : ''}
                </span>
              </div>
              <div class="font-black text-xs sm:text-sm text-slate-900">文法</div>
              <div class="text-[10px] text-slate-500 mt-0.5 font-medium leading-tight">全48課・助詞・格変化（${totalGrammarQuestions}問）</div>
            </button>

            <!-- ミックス -->
            <button type="button" class="btn-genre-card p-3 rounded-2xl border-2 text-left transition-all ${
              this.state.questionGenre === 'mixed'
                ? 'border-purple-600 bg-purple-50/60 shadow-xs ring-2 ring-purple-500/20'
                : 'border-slate-200 hover:border-slate-300 bg-slate-50/60'
            }" data-genre="mixed">
              <div class="flex items-center justify-between mb-1.5">
                <span class="text-2xl">🎲</span>
                <span class="w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  this.state.questionGenre === 'mixed' ? 'border-purple-600 bg-purple-600' : 'border-slate-300'
                }">
                  ${this.state.questionGenre === 'mixed' ? '<span class="w-1.5 h-1.5 bg-white rounded-full"></span>' : ''}
                </span>
              </div>
              <div class="font-black text-xs sm:text-sm text-slate-900">ミックス</div>
              <div class="text-[10px] text-slate-500 mt-0.5 font-medium leading-tight">全ジャンルからランダム出題！</div>
            </button>

          </div>
        </div>

        <!-- 2. 4つのゲームモード選択 -->
        <div>
          <h3 class="text-sm font-extrabold text-slate-800 mb-2.5 flex items-center gap-1.5">
            <span>🎯</span> ゲームモードを選択
          </h3>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            
            <!-- 1. スピードラン -->
            <div class="game-mode-card bg-white rounded-2xl p-5 border-2 ${this.state.mode === 'speedrun' ? 'border-amber-500 shadow-md bg-amber-50/20' : 'border-slate-200 hover:border-amber-400'} transition-all cursor-pointer relative" data-mode="speedrun">
              <div class="flex items-start justify-between">
                <div class="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-2xl font-bold shadow-xs">
                  ⏱️
                </div>
                <span class="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  制限時間 60秒
                </span>
              </div>
              <h4 class="text-lg font-black text-slate-900 mt-3 flex items-center gap-1.5">
                スピードラン
              </h4>
              <p class="text-xs text-slate-600 mt-1 leading-relaxed">
                60秒間でできるだけ多く正解せよ！回答速度ボーナスとコンボでハイスコアを叩き出そう。
              </p>
              <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-extrabold text-amber-700">
                <span>自己ベスト: ${(stats.highScores?.speedrun || 0).toLocaleString()} 点</span>
                <button type="button" class="btn-direct-start-mode px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs shadow-xs transition-all active:scale-95 cursor-pointer flex items-center gap-1" data-mode="speedrun">
                  <span>挑戦する</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            <!-- 2. サバイバル -->
            <div class="game-mode-card bg-white rounded-2xl p-5 border-2 ${this.state.mode === 'survival' ? 'border-rose-500 shadow-md bg-rose-50/20' : 'border-slate-200 hover:border-rose-400'} transition-all cursor-pointer relative" data-mode="survival">
              <div class="flex items-start justify-between">
                <div class="w-12 h-12 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center text-2xl font-bold shadow-xs">
                  ❤️
                </div>
                <span class="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800">
                  ライフ 3つ
                </span>
              </div>
              <h4 class="text-lg font-black text-slate-900 mt-3 flex items-center gap-1.5">
                サバイバル
              </h4>
              <p class="text-xs text-slate-600 mt-1 leading-relaxed">
                持ちライフは3。1問間違えるごとにライフが減少！制限時間なし、何問生き残れるか限界に挑戦。
              </p>
              <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-extrabold text-rose-700">
                <span>自己ベスト: ${(stats.highScores?.survival || 0).toLocaleString()} 点</span>
                <button type="button" class="btn-direct-start-mode px-3.5 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-black text-xs shadow-xs transition-all active:scale-95 cursor-pointer flex items-center gap-1" data-mode="survival">
                  <span>挑戦する</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            <!-- 3. コンボチャレンジ -->
            <div class="game-mode-card bg-white rounded-2xl p-5 border-2 ${this.state.mode === 'combo' ? 'border-orange-500 shadow-md bg-orange-50/20' : 'border-slate-200 hover:border-orange-400'} transition-all cursor-pointer relative" data-mode="combo">
              <div class="flex items-start justify-between">
                <div class="w-12 h-12 rounded-xl bg-orange-100 text-orange-800 flex items-center justify-center text-2xl font-bold shadow-xs">
                  🔥
                </div>
                <span class="text-xs font-bold px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800">
                  1ミスで即終了
                </span>
              </div>
              <h4 class="text-lg font-black text-slate-900 mt-3 flex items-center gap-1.5">
                コンボチャレンジ
              </h4>
              <p class="text-xs text-slate-600 mt-1 leading-relaxed">
                ミスが許されない極限モード！コンボが続くほどスコア倍率が跳ね上がる。目指せ連続20問以上！
              </p>
              <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-extrabold text-orange-700">
                <span>最高コンボ: ${(stats.bestCombos?.combo || 0)} 連続</span>
                <button type="button" class="btn-direct-start-mode px-3.5 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-black text-xs shadow-xs transition-all active:scale-95 cursor-pointer flex items-center gap-1" data-mode="combo">
                  <span>挑戦する</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            <!-- 4. リラックス -->
            <div class="game-mode-card bg-white rounded-2xl p-5 border-2 ${this.state.mode === 'relax' ? 'border-emerald-500 shadow-md bg-emerald-50/20' : 'border-slate-200 hover:border-emerald-400'} transition-all cursor-pointer relative" data-mode="relax">
              <div class="flex items-start justify-between">
                <div class="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-2xl font-bold shadow-xs">
                  🍃
                </div>
                <span class="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  無制限
                </span>
              </div>
              <h4 class="text-lg font-black text-slate-900 mt-3 flex items-center gap-1.5">
                リラックス
              </h4>
              <p class="text-xs text-slate-600 mt-1 leading-relaxed">
                時間制限もゲームオーバーもなし。マイペースに楽しく学習してXPを着実に獲得できます。
              </p>
              <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-extrabold text-emerald-700">
                <span>のんびり学習</span>
                <button type="button" class="btn-direct-start-mode px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs shadow-xs transition-all active:scale-95 cursor-pointer flex items-center gap-1" data-mode="relax">
                  <span>挑戦する</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            <!-- 5. ペンギンドロップ（落下単語シューティング） -->
            <div class="game-mode-card bg-gradient-to-br from-slate-900 via-indigo-950 to-sky-950 text-white rounded-2xl p-5 border-2 ${this.state.mode === 'drop' ? 'border-sky-400 shadow-xl ring-2 ring-sky-400/50' : 'border-slate-700 hover:border-sky-400'} transition-all cursor-pointer relative col-span-1 sm:col-span-2 overflow-hidden group" data-mode="drop">
              <div class="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none"></div>
              <div class="absolute -top-10 -right-10 w-44 h-44 bg-sky-500/20 rounded-full blur-3xl pointer-events-none"></div>

              <div class="relative z-10">
                <div class="flex items-start justify-between">
                  <div class="flex items-center gap-3">
                    <div class="w-12 h-12 rounded-xl bg-sky-500/30 border border-sky-400/50 text-sky-300 flex items-center justify-center text-2xl font-bold shadow-xs">
                      🐧
                    </div>
                    <div>
                      <div class="flex items-center gap-2">
                        <h4 class="text-lg font-black text-white flex items-center gap-1.5">
                          ペンギンドロップ（防衛バトル）
                        </h4>

                      </div>
                      <p class="text-[11px] text-sky-200/80 mt-0.5">
                        上空から降ってくる日本語をモンゴル語タップで撃破！
                      </p>
                    </div>
                  </div>
                  <span class="text-xs font-bold px-2.5 py-0.5 rounded-full bg-sky-500/30 text-sky-200 border border-sky-400/40">
                    ライフ 3つ ⚡ アクション
                  </span>
                </div>

                <p class="text-xs text-slate-300 mt-2.5 leading-relaxed">
                  上空から迫り来る日本語の言葉を、モンゴル語の単語タップでペンギンが氷のビーム撃破！連続正解でフィーバー突入＆サングラスペンギンが大活躍！
                </p>

                <div class="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-extrabold text-sky-300">
                  <span>自己ベスト: ${(stats.highScores?.drop || 0).toLocaleString()} 点</span>
                  <button type="button" class="btn-direct-start-mode px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-black text-xs shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-1.5" data-mode="drop">
                    <span>挑戦する</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- 3. オプション設定 -->
        <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
          <div class="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <span>⚙️</span> 出題オプション
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label class="block text-slate-500 font-semibold mb-1">回答スタイル</label>
              <div class="grid grid-cols-2 gap-2">
                <button type="button" class="btn-input-mode p-2.5 rounded-xl border font-bold flex items-center justify-center gap-1.5 transition-all ${
                  this.state.inputMode === 'choice_4' ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'bg-slate-50 border-slate-200 text-slate-600'
                }" data-input="choice_4">
                  <span>🎯</span> 4択タップ
                </button>
                <button type="button" class="btn-input-mode p-2.5 rounded-xl border font-bold flex items-center justify-center gap-1.5 transition-all ${
                  this.state.inputMode === 'text' ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'bg-slate-50 border-slate-200 text-slate-600'
                }" data-input="text">
                  <span>✍️</span> 記述入力
                </button>
              </div>
            </div>

            <div>
              <label class="block text-slate-500 font-semibold mb-1">出題範囲 / カテゴリー</label>
              ${this.state.questionGenre === 'grammar' ? `
                <div class="p-2.5 bg-amber-50/70 border border-amber-200 rounded-xl font-bold text-amber-900 text-xs flex items-center gap-2">
                  <span>📐</span>
                  <span>重要文法・助詞・格変化（全${totalGrammarQuestions}問）</span>
                </div>
              ` : `
                <select id="game-category-select" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800">
                  <option value="all">全単語（全${vocabList.length}語）</option>
                  <option value="verbs_only" ${this.state.selectedCategory === 'verbs_only' ? 'selected' : ''}>🌱 動詞のみ</option>
                  <option value="nouns_only" ${this.state.selectedCategory === 'nouns_only' ? 'selected' : ''}>🏛 名詞のみ</option>
                  ${categories.map(cat => `
                    <option value="${cat}" ${this.state.selectedCategory === cat ? 'selected' : ''}>${cat}</option>
                  `).join('')}
                </select>
              `}
            </div>
          </div>
        </div>

        <!-- ゲーム開始大ボタン -->
        <button type="button" id="btn-start-game" class="w-full py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-700 hover:to-indigo-700 text-white font-black text-lg rounded-2xl shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2">
          <span>🚀</span>
          <span>選択したジャンル・モードでゲーム開始</span>
        </button>

      </div>

      <!-- 実績モーダルコンテナ -->
      <div id="game-achievements-modal" class="hidden"></div>
    `;

    this.bindModeSelectEvents();
  }

  static bindModeSelectEvents() {
    // ジャンル選択カードクリック
    this.container.querySelectorAll('.btn-genre-card').forEach(card => {
      card.addEventListener('click', () => {
        const genre = card.getAttribute('data-genre');
        this.state.questionGenre = genre;
        this.renderModeSelect();
      });
    });

    // モードカード上の「挑戦する →」ボタン直接クリックで即ゲーム開始
    this.container.querySelectorAll('.btn-direct-start-mode').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const mode = btn.getAttribute('data-mode');
        this.state.mode = mode;
        this.startGame();
      });
    });

    // モード選択カードクリック
    this.container.querySelectorAll('.game-mode-card').forEach(card => {
      card.addEventListener('click', () => {
        const mode = card.getAttribute('data-mode');
        if (this.state.mode === mode) {
          // 既に選択中のカードを再度クリックした場合もゲーム開始
          this.startGame();
        } else {
          this.state.mode = mode;
          this.renderModeSelect();
        }
      });
    });

    // 入力スタイル切り替え
    this.container.querySelectorAll('.btn-input-mode').forEach(btn => {
      btn.addEventListener('click', () => {
        this.state.inputMode = btn.getAttribute('data-input');
        this.renderModeSelect();
      });
    });

    // カテゴリー変更
    const catSelect = this.container.querySelector('#game-category-select');
    if (catSelect) {
      catSelect.addEventListener('change', (e) => {
        this.state.selectedCategory = e.target.value;
      });
    }

    // スタートボタン
    const startBtn = this.container.querySelector('#btn-start-game');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        this.startGame();
      });
    }

    // ペンギンのお部屋を開く
    const roomBtn = this.container.querySelector('#btn-open-penguin-room');
    if (roomBtn) {
      roomBtn.addEventListener('click', () => {
        PenguinMascot.showPenguinRoomModal(this.onNavigate);
      });
    }

    // 実績モーダルを開く
    const achBtn = this.container.querySelector('#btn-open-achievements');
    if (achBtn) {
      achBtn.addEventListener('click', () => {
        this.showAchievements();
      });
    }
  }

  // ==========================================
  // 2. ゲーム開始・初期化
  // ==========================================
  static startGame() {
    const vocabList = StorageService.getVocabulary();
    const grammarQuizzes = StorageService.getGrammarQuizzes();
    const declensionQuizzes = StorageService.getDeclensionQuizzes();
    const illustrationQuizzes = StorageService.getIllustrationQuizzes();
    const allGrammar = [...grammarQuizzes, ...declensionQuizzes];

    // 単語リストのカテゴリー絞り込み
    let filteredVocab = [...vocabList];
    if (this.state.selectedCategory === 'verbs_only') {
      filteredVocab = filteredVocab.filter(v => v.isVerb || (v.pos && v.pos.includes('動詞')));
    } else if (this.state.selectedCategory === 'nouns_only') {
      filteredVocab = filteredVocab.filter(v => v.pos && v.pos.includes('名詞'));
    } else if (this.state.selectedCategory !== 'all') {
      filteredVocab = filteredVocab.filter(v => v.category === this.state.selectedCategory);
    }
    if (filteredVocab.length < 4) {
      filteredVocab = [...vocabList];
    }

    // ジャンル別プール構築
    let pool = [];
    if (this.state.mode === 'drop') {
      // ペンギンドロップ（）は日本語からモンゴル語（キリル文字）を撃ち落とす
      pool = filteredVocab.map(v => ({ ...v, _genre: 'mn_translation' }));
    } else if (this.state.questionGenre === 'ja_meaning') {
      // 日本語訳（モンゴル語 → 日本語）
      pool = filteredVocab.map(v => ({ ...v, _genre: 'ja_meaning' }));
    } else if (this.state.questionGenre === 'mn_translation') {
      // モンゴル語訳（日本語 → モンゴル語）
      pool = filteredVocab.map(v => ({ ...v, _genre: 'mn_translation' }));
    } else if (this.state.questionGenre === 'visual') {
      // ビジュアルイラスト当て（絵 → モンゴル語）
      pool = illustrationQuizzes.map(iq => ({ ...iq, _genre: 'visual' }));
    } else if (this.state.questionGenre === 'grammar') {
      // 文法問題（文法テスト・格変化・助詞）
      pool = allGrammar.map(g => ({ ...g, _genre: 'grammar' }));
    } else {
      // ミックス: 日本語訳、モンゴル語訳、イラスト当て、文法の全ジャンル均等混合
      const jaPool = shuffleArray(filteredVocab).slice(0, 35).map(v => ({ ...v, _genre: 'ja_meaning' }));
      const mnPool = shuffleArray(filteredVocab).slice(0, 35).map(v => ({ ...v, _genre: 'mn_translation' }));
      const visPool = shuffleArray(illustrationQuizzes).slice(0, 20).map(iq => ({ ...iq, _genre: 'visual' }));
      const grPool = shuffleArray(allGrammar).slice(0, 20).map(g => ({ ...g, _genre: 'grammar' }));
      pool = [...jaPool, ...mnPool, ...visPool, ...grPool];
    }

    this.state.questionsPool = shuffleArray(pool);
    this.state.currentQuestionIndex = 0;
    this.state.score = 0;
    this.state.combo = 0;
    this.state.maxCombo = 0;
    this.state.correctCount = 0;
    this.state.totalAnswered = 0;
    this.state.xpEarned = 0;
    this.state.mistakes = [];
    this.state.correctAnswers = [];
    this.state.resultFilter = 'all';
    this.state.answerTimes = [];
    this.state.startTime = Date.now();
    this.state.hasAnswered = false;

    // モード別初期値
    if (this.state.mode === 'speedrun') {
      this.state.timeLeft = 60;
    } else if (this.state.mode === 'survival' || this.state.mode === 'drop') {
      this.state.lives = 3;
      this.state.maxLives = 3;
    }

    this.state.view = 'playing';
    this.loadQuestion();

    if (this.state.mode === 'speedrun') {
      this.startSpeedrunTimer();
    }
  }

  static stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.stopDropLoop();
  }

  static stopDropLoop() {
    if (this.dropInterval) {
      clearInterval(this.dropInterval);
      this.dropInterval = null;
    }
  }

  static startDropLoop() {
    this.stopDropLoop();
    this.dropInterval = setInterval(() => {
      if (this.state.view !== 'playing' || this.state.mode !== 'drop' || this.dropState.isDestroyed) {
        return;
      }
      const elapsed = Date.now() - this.dropState.startTime;
      const pct = Math.min(100, (elapsed / this.dropState.duration) * 100);
      this.dropState.y = pct;

      const targetCard = this.container.querySelector('#drop-target-card');
      if (targetCard) {
        targetCard.style.top = `${pct * 0.74}%`;
        if (pct > 70) {
          targetCard.classList.add('ring-2', 'ring-rose-500', 'animate-pulse');
        }
      }

      if (pct >= 100) {
        this.stopDropLoop();
        this.handleDropCrash();
      }
    }, 30);
  }

  static handleDropCrash() {
    if (this.state.hasAnswered) return;
    this.state.hasAnswered = true;
    this.state.combo = 0;
    this.state.lives--;
    this.state.totalAnswered++;

    const q = this.state.currentQuestion;
    const correctDisplay = q.dictForm || q.word || q.mongolian || '';
    this.state.mistakes.push({
      genre: 'drop',
      question: q,
      userAnswer: '（防衛ライン突破）',
      correctAnswer: correctDisplay
    });

    SoundEffects.playWrong();

    const arena = this.container.querySelector('#drop-arena');
    if (arena) {
      arena.classList.add('animate-shake');
      setTimeout(() => arena.classList.remove('animate-shake'), 600);
    }

    const mascotEl = this.container.querySelector('#drop-penguin-mascot');
    if (mascotEl) {
      mascotEl.innerHTML = PenguinMascot.getSvg({
        mood: 'wrong',
        sunglasses: true,
        size: 76
      });
    }

    const targetCard = this.container.querySelector('#drop-target-card');
    if (targetCard) {
      targetCard.className = "absolute left-1/2 -translate-x-1/2 w-11/12 max-w-sm p-3.5 rounded-2xl bg-rose-600 text-white text-center font-black shadow-xl border-2 border-rose-300 z-20";
      targetCard.innerHTML = `
        <div class="text-rose-100 font-black text-xs flex items-center justify-center gap-1.5">
          <span>💔 防衛ライン突破！</span>
          <span>正解: ${correctDisplay}</span>
        </div>
      `;
    }

    const metricEl = this.container.querySelector('#game-mode-metric');
    if (metricEl) {
      metricEl.innerHTML = this.getModeMetricHtml();
    }

    if (this.state.lives <= 0) {
      setTimeout(() => this.endGame('dead'), 1100);
    } else {
      setTimeout(() => {
        if (this.state.view === 'playing') {
          this.advanceToNextQuestion();
        }
      }, 1000);
    }
  }

  static startSpeedrunTimer() {
    this.stopTimer();
    this.timerInterval = setInterval(() => {
      this.state.timeLeft--;
      const timerEl = this.container.querySelector('#game-timer-val');
      const timerBar = this.container.querySelector('#game-timer-bar');
      if (timerEl) timerEl.textContent = this.state.timeLeft;
      if (timerBar) {
        const pct = Math.max(0, (this.state.timeLeft / 60) * 100);
        timerBar.style.width = `${pct}%`;
        if (this.state.timeLeft <= 10) {
          timerBar.className = "bg-rose-500 h-full transition-all duration-300";
        }
      }

      if (this.state.timeLeft <= 0) {
        this.stopTimer();
        this.endGame('timeup');
      }
    }, 1000);
  }

  static loadQuestion() {
    // プールが尽きたら再シャッフルして継続（スコアや履歴をリセットしない）
    if (this.state.currentQuestionIndex >= this.state.questionsPool.length) {
      this.state.questionsPool = shuffleArray([...this.state.questionsPool]);
      this.state.currentQuestionIndex = 0;
    }

    const q = this.state.questionsPool[this.state.currentQuestionIndex];
    this.state.currentQuestion = q;
    this.state.hasAnswered = false;
    this.state.selectedChoiceId = null;
    this.state.questionStartTime = Date.now();

    const genre = this.state.mode === 'drop' ? 'mn_translation' : (q._genre || this.state.questionGenre || 'ja_meaning');

    // 4択選択肢の生成
    this.buildChoices(q, genre);

    if (this.state.mode === 'drop') {
      this.stopDropLoop();
      // コンボや正解数に応じて徐々に落下スピードがアップ（5.5秒 -> 最短2.0秒）
      const dropDuration = Math.max(2000, 5500 - (this.state.correctCount * 140));
      this.dropState = {
        y: 2,
        duration: dropDuration,
        startTime: Date.now(),
        isDestroyed: false
      };
    }

    this.renderPlaying();

    if (this.state.mode === 'drop') {
      this.startDropLoop();
    }
  }

  static buildChoices(q, genre) {
    const vocabList = StorageService.getVocabulary();
    const grammarQuizzes = StorageService.getGrammarQuizzes();
    const declensionQuizzes = StorageService.getDeclensionQuizzes();
    const allGrammar = [...grammarQuizzes, ...declensionQuizzes];

    if (genre === 'ja_meaning') {
      // 1. 日本語訳: 選択肢は日本語の意味
      const others = vocabList.filter(v => v.id !== q.id && v.japanese !== q.japanese);
      const distractors = shuffleArray(others).slice(0, 3).map(v => ({
        id: v.id,
        text: v.japanese,
        isCorrect: false,
        isCyrillic: false
      }));
      this.state.choices = shuffleArray([
        { id: q.id, text: q.japanese, isCorrect: true, isCyrillic: false },
        ...distractors
      ]);

    } else if (genre === 'mn_translation') {
      // 2. モンゴル語訳: 選択肢はモンゴル語（キリル文字）
      const d = getWordGrammarDetails(q);
      const correctText = d.dictForm || q.mongolian;
      const others = vocabList.filter(v => v.id !== q.id && v.mongolian !== q.mongolian && (v.dictForm || v.mongolian) !== correctText);
      const distractors = shuffleArray(others).slice(0, 3).map(v => {
        const vd = getWordGrammarDetails(v);
        return {
          id: v.id,
          text: vd.dictForm || v.mongolian,
          isCorrect: false,
          isCyrillic: true
        };
      });
      this.state.choices = shuffleArray([
        { id: q.id, text: correctText, isCorrect: true, isCyrillic: true },
        ...distractors
      ]);

    } else if (genre === 'visual') {
      // 3. ビジュアルイラスト当て: 選択肢はモンゴル語（キリル文字）
      const illustrationQuizzes = StorageService.getIllustrationQuizzes();
      const correctText = q.dictForm || q.mongolian;
      // まず他のイラスト問題からキリル文字ダミーを優先抽出、不足時は一般単語から抽出
      const otherIllus = illustrationQuizzes.filter(iq => iq.id !== q.id && (iq.dictForm || iq.mongolian) !== correctText);
      const otherVocab = vocabList.filter(v => (v.dictForm || v.mongolian) !== correctText);
      const pool = [...shuffleArray(otherIllus), ...shuffleArray(otherVocab)];
      const uniqueDistractors = [];
      const seen = new Set([correctText]);
      for (const item of pool) {
        const text = item.dictForm || item.mongolian;
        if (text && !seen.has(text)) {
          seen.add(text);
          uniqueDistractors.push({
            id: item.id,
            text: text,
            isCorrect: false,
            isCyrillic: true
          });
          if (uniqueDistractors.length >= 3) break;
        }
      }
      this.state.choices = shuffleArray([
        { id: q.id, text: correctText, isCorrect: true, isCyrillic: true },
        ...uniqueDistractors
      ]);

    } else {
      // 4. 文法クイズ: 選択肢は文法項目・助詞・活用形
      const clean = s => (s || '').toLowerCase().trim().replace(/[.,!?。、！？\s«»"']/g, '');
      const correctClean = clean(q.answer);

      if (q.options && Array.isArray(q.options) && q.options.length >= 2) {
        // 問題にoptionsが定義されている場合
        let opts = [...q.options];
        if (opts.length < 4) {
          // 4択に満たない場合は他問題の選択肢から補充
          const extra = [];
          for (const og of shuffleArray(allGrammar)) {
            if (og.options && Array.isArray(og.options)) {
              for (const o of og.options) {
                if (!opts.includes(o) && !extra.includes(o)) {
                  extra.push(o);
                  if (opts.length + extra.length >= 4) break;
                }
              }
            }
            if (opts.length + extra.length >= 4) break;
          }
          opts.push(...extra.slice(0, 4 - opts.length));
        }

        this.state.choices = shuffleArray(opts.slice(0, 4)).map((opt, idx) => ({
          id: 'g_opt_' + idx,
          text: opt,
          isCorrect: clean(opt) === correctClean || (Array.isArray(q.acceptableAnswers) && q.acceptableAnswers.some(a => clean(a) === clean(opt))),
          isCyrillic: isCyrillic(opt)
        }));

        // 正解が選択肢に含まれていない場合のセーフガード
        if (!this.state.choices.some(c => c.isCorrect)) {
          this.state.choices[0] = {
            id: 'g_opt_correct',
            text: q.answer,
            isCorrect: true,
            isCyrillic: isCyrillic(q.answer)
          };
          this.state.choices = shuffleArray(this.state.choices);
        }

      } else {
        // optionsがない記述文法問題（文全体など）: 他問題の正解文から誤答肢を生成
        const otherAnswers = Array.from(new Set(allGrammar.map(g => g.answer).filter(a => a && clean(a) !== correctClean)));
        const distractors = shuffleArray(otherAnswers).slice(0, 3).map((ans, idx) => ({
          id: 'g_dist_' + idx,
          text: ans,
          isCorrect: false,
          isCyrillic: isCyrillic(ans)
        }));
        this.state.choices = shuffleArray([
          { id: 'g_correct', text: q.answer, isCorrect: true, isCyrillic: isCyrillic(q.answer) },
          ...distractors
        ]);
      }
    }
  }

  // ==========================================
  // 3. プレイ画面
  // ==========================================
  static renderPlaying() {
    const q = this.state.currentQuestion;
    if (!q) return;

    const genre = q._genre || this.state.questionGenre || 'ja_meaning';
    const comboMultiplier = this.getComboMultiplier(this.state.combo);
    const questionNumber = this.state.totalAnswered + 1;

    // 単語詳細（単語系ジャンルの場合）
    const details = (genre === 'ja_meaning' || genre === 'mn_translation') ? getWordGrammarDetails(q) : null;

    if (this.state.mode === 'drop') {
      const isFever = this.state.combo >= 5;
      this.container.innerHTML = `
        <div class="max-w-2xl mx-auto space-y-3 animate-fade-in pb-16">
          
          <!-- ゲームHUDバー -->
          <div class="bg-slate-900 text-white rounded-2xl p-3 sm:p-4 border border-slate-800 shadow-md flex items-center justify-between gap-2 sm:gap-3">
            <div class="flex items-center gap-2">
              <div class="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/40 flex items-center justify-center text-lg">
                🐧
              </div>
              <div>
                <div class="flex items-center gap-1.5">
                  <span class="text-xs font-black text-sky-300">ペンギンドロップ</span>
                  ${isFever ? '<span class="text-[10px] font-black px-1.5 py-0.2 rounded-md bg-amber-400 text-slate-950 animate-pulse">FEVER 2X</span>' : ''}
                </div>
                <div id="game-mode-metric" class="text-xs font-black flex items-center gap-1">
                  ${this.getModeMetricHtml()}
                </div>
              </div>
            </div>

            <div class="text-center flex flex-col items-center gap-0.5">
              <span class="text-xs font-black px-2.5 py-0.5 rounded-full bg-slate-800 text-sky-300 border border-slate-700">
                第 <span class="text-sm font-black text-amber-400">${questionNumber}</span> 問
              </span>
              ${this.state.combo > 1 ? `
                <div class="animate-bounce">
                  <span class="text-[10px] font-black text-amber-300 bg-amber-500/20 border border-amber-400/50 px-2 py-0.2 rounded-full">
                    🔥 ${this.state.combo} COMBO (x${comboMultiplier})
                  </span>
                </div>
              ` : `
                <div class="text-[10px] font-bold text-slate-400">撃破: ${this.state.correctCount} 問</div>
              `}
            </div>

            <div class="flex items-center gap-2 sm:gap-3">
              <div class="text-right">
                <div class="text-[10px] text-slate-400 font-bold uppercase">SCORE</div>
                <div class="text-base sm:text-xl font-black text-amber-300" id="game-current-score">
                  ${this.state.score.toLocaleString()}
                </div>
              </div>

              <button type="button" id="btn-finish-game" class="px-2.5 sm:px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-rose-300 text-xs font-black rounded-xl border border-slate-700 transition-all active:scale-95 flex items-center gap-1 cursor-pointer shrink-0" title="ゲームを終了して結果を見る">
                <span>🏁</span>
                <span class="hidden xs:inline">終了</span>
              </button>
            </div>
          </div>

          <!-- ペンギンドロップ アリーナ -->
          <div id="drop-arena" class="relative w-full h-80 sm:h-96 rounded-3xl bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 p-4 border-2 ${isFever ? 'border-amber-400 shadow-2xl ring-2 ring-amber-400/50' : 'border-sky-500/30 shadow-xl'} overflow-hidden flex flex-col justify-between select-none">
            
            <!-- 背景スター＆サイバーグリッド -->
            <div class="absolute inset-0 bg-[radial-gradient(#38bdf8_1.2px,transparent_1.2px)] [background-size:20px_20px] opacity-25 pointer-events-none"></div>
            
            ${isFever ? `
              <div class="absolute top-2 left-1/2 -translate-x-1/2 z-20 px-3 py-1 bg-gradient-to-r from-amber-400 via-orange-500 to-yellow-400 text-slate-950 text-xs font-black rounded-full shadow-lg animate-pulse tracking-wider flex items-center gap-1">
                <span>⚡ FEVER TIME! 2X SCORE ⚡</span>
              </div>
            ` : ''}

            <!-- 落下ターゲットエリア -->
            <div class="relative w-full flex-1">
              
              <!-- 落下中の日本語単語カード -->
              <div id="drop-target-card" class="absolute left-1/2 -translate-x-1/2 w-11/12 max-w-sm p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-sky-600 via-indigo-600 to-sky-700 text-white text-center font-black shadow-xl border-2 border-sky-300 transition-all duration-75 z-10" style="top: ${this.dropState?.y || 2}%">
                <div class="text-[10px] text-sky-200 uppercase tracking-widest font-bold">撃ち落とせ！</div>
                <div class="text-lg sm:text-2xl font-black tracking-wide drop-shadow-sm">
                  ${q.meaning_ja || q.japanese || ''}
                </div>
              </div>

              <!-- ビーム照射用 SVG オーバーレイ -->
              <svg id="drop-laser-svg" class="absolute inset-0 w-full h-full pointer-events-none z-20">
                <defs>
                  <linearGradient id="laserGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stop-color="#38bdf8" stop-opacity="1" />
                    <stop offset="100%" stop-color="#fef08a" stop-opacity="1" />
                  </linearGradient>
                </defs>
                <line id="drop-laser-beam" x1="50%" y1="92%" x2="50%" y2="20%" stroke="url(#laserGrad)" stroke-width="8" stroke-linecap="round" class="hidden" />
              </svg>

            </div>

            <!-- 防衛ライン（GROUND / DEFENSE LINE） -->
            <div class="relative z-10 w-full border-t-2 border-dashed border-sky-400/40 pt-1 pb-1 flex items-center justify-between text-[10px] font-mono text-sky-300/70">
              <span>🛡️ SHIELD BARRIER</span>
              <span>LINE: DEFENSE</span>
            </div>

            <!-- サングラスペンギン台座 -->
            <div class="relative z-10 flex flex-col items-center">
              <div id="drop-penguin-mascot" class="transform transition-transform">
                ${PenguinMascot.getSvg({
                  mood: isFever ? 'combo' : (this.state.lives < 2 ? 'wrong' : 'welcome'),
                  sunglasses: true,
                  size: 76
                })}
              </div>
              <div class="text-[10px] font-black text-amber-300 mt-0.5 flex items-center gap-1">
                <span>😎</span>
                <span>${isFever ? 'フィーバーイケペン！' : 'サングラス迎撃ペンギン'}</span>
              </div>
            </div>

          </div>

          <!-- 4択モンゴル語回答ボタン（画面下部） -->
          <div class="space-y-2">
            <div class="text-xs font-bold text-slate-600 flex items-center justify-between px-1">
              <span>正解のモンゴル語（キリル文字）をタップ！</span>
              <span class="text-[11px] text-sky-600 font-extrabold">即座に氷のレーザー発射 ⚡</span>
            </div>

            <div class="grid grid-cols-2 gap-2.5">
              ${this.state.choices.map((choice, idx) => {
                return `
                  <button type="button" class="btn-game-choice text-left p-3.5 sm:p-4 rounded-2xl border-2 border-slate-200 hover:border-sky-400 bg-white hover:bg-sky-50 text-slate-900 font-black text-sm sm:text-base transition-all active:scale-95 flex items-center justify-between shadow-xs cursor-pointer group" data-choice-id="${choice.id}">
                    <span class="cyrillic-text font-black text-base text-slate-800 group-hover:text-sky-700 leading-tight">
                      ${choice.text}
                    </span>
                    <span class="w-6 h-6 rounded-full bg-slate-100 group-hover:bg-sky-200 text-slate-600 group-hover:text-sky-900 text-xs font-bold flex items-center justify-center shrink-0 ml-1">
                      ${idx + 1}
                    </span>
                  </button>
                `;
              }).join('')}
            </div>
          </div>

        </div>
      `;

      this.bindPlayingEvents();
      return;
    }

    this.container.innerHTML = `
      <div class="max-w-2xl mx-auto space-y-4 animate-fade-in pb-16">
        
        <!-- ゲームHUDバー -->
        <div class="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200 shadow-xs flex items-center justify-between gap-2 sm:gap-3">
          
          <!-- 左: モード情報＆スピードラン用中断 -->
          <div class="flex items-center gap-2">
            ${this.state.mode === 'speedrun' ? `
              <button type="button" id="btn-quit-game" class="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors" title="ゲームを中断して戻る">
                <span class="text-sm">✕</span>
              </button>
            ` : ''}
            <div>
              <div class="flex items-center gap-1.5">
                <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  ${this.getModeName(this.state.mode)}
                </span>
                <span class="text-[10px] font-black px-1.5 py-0.2 rounded-md ${this.getGenreBadgeClass(genre)}">
                  ${this.getGenreShortName(genre)}
                </span>
              </div>
              <div class="text-xs font-black text-slate-800 flex items-center gap-1">
                ${this.getModeMetricHtml()}
              </div>
            </div>
          </div>

          <!-- 中央: 問題番号（何問めか） ＆ コンボ表示 -->
          <div class="text-center flex flex-col items-center gap-0.5">
            <span class="text-xs font-black px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
              第 <span class="text-sm font-black text-emerald-700">${questionNumber}</span> 問
            </span>
            ${this.state.combo > 1 ? `
              <div class="animate-bounce">
                <span class="text-[10px] font-black text-orange-600 bg-orange-50 border border-orange-200 px-2 py-0.2 rounded-full shadow-2xs">
                  🔥 ${this.state.combo} COMBO (x${comboMultiplier})
                </span>
              </div>
            ` : `
              <div class="text-[10px] font-bold text-slate-400">正解: ${this.state.correctCount} 問</div>
            `}
          </div>

          <!-- 右: スコア ＆ 終了ボタン（スピードラン以外のモード用） -->
          <div class="flex items-center gap-2 sm:gap-3">
            <div class="text-right">
              <div class="text-[10px] text-slate-400 font-bold">SCORE</div>
              <div class="text-base sm:text-xl font-black text-slate-900 tracking-tight" id="game-current-score">
                ${this.state.score.toLocaleString()}
              </div>
            </div>

            ${this.state.mode !== 'speedrun' ? `
              <button type="button" id="btn-finish-game" class="px-2.5 sm:px-3 py-1.5 bg-gradient-to-r from-rose-50 to-amber-50 hover:from-rose-100 hover:to-amber-100 text-rose-700 hover:text-rose-800 text-xs font-black rounded-xl border border-rose-200 shadow-2xs transition-all active:scale-95 flex items-center gap-1 cursor-pointer shrink-0" title="ゲームを終了して結果を見る">
                <span>🏁</span>
                <span class="hidden xs:inline">終了</span>
              </button>
            ` : ''}
          </div>

        </div>

        <!-- スピードラン用タイマーバー -->
        ${this.state.mode === 'speedrun' ? `
          <div class="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden shadow-inner">
            <div id="game-timer-bar" class="bg-amber-500 h-full transition-all duration-300" style="width: ${(this.state.timeLeft / 60) * 100}%"></div>
          </div>
        ` : ''}

        <!-- メイン問題カード -->
        <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm text-center relative overflow-hidden space-y-3">
          
          <!-- ジャンル明示バッジ ＆ 第◯問バッジ -->
          <div class="flex items-center justify-between">
            <span class="text-xs font-black px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs">
              第 <span class="text-emerald-700 text-sm font-black">${questionNumber}</span> 問目
            </span>
            <span class="text-xs px-3 py-1 rounded-full font-black border ${this.getGenreHeaderBadge(genre)}">
              ${this.getGenreHeaderTitle(genre, q)}
            </span>
          </div>

          <!-- 出題指示文 -->
          <div class="text-xs font-bold text-slate-400">
            ${this.getPromptSubtitle(genre, q)}
          </div>

          <!-- メイン問題表示 -->
          ${this.renderQuestionMainDisplay(genre, q, details)}

          <!-- サブ情報（品詞・ヒントなど: タップで展開） -->
          <div class="pt-1 text-center">
            <button type="button" id="btn-toggle-game-hint" class="text-xs text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 px-3 py-1 rounded-full font-bold border border-slate-200 transition-all inline-flex items-center gap-1.5 cursor-pointer select-none active:scale-95 shadow-2xs">
              <span>💡</span>
              <span id="game-hint-toggle-text">ヒント・品詞を見る ▼</span>
            </button>
            <div id="game-hint-content" class="hidden mt-2 animate-fade-in">
              ${this.renderQuestionSubInfo(genre, q, details)}
            </div>
          </div>

          <!-- 音声再生ボタン -->
          <div class="pt-1">
            <button type="button" id="btn-speak-game-word" class="text-xs text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-1.5 rounded-full font-bold inline-flex items-center gap-1.5 transition-all shadow-2xs">
              <span>🔊</span>
              <span>発音を聞く</span>
            </button>
          </div>

        </div>

        <!-- 回答エリア -->
        <div class="space-y-3">
          ${this.state.inputMode === 'choice_4' ? `
            <!-- 4択選択ボタン群（PCキー 1-4 にも対応） -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              ${this.state.choices.map((choice, idx) => {
                let btnClass = "bg-white border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 text-slate-800";
                let badgeClass = "bg-slate-100 text-slate-600";
                
                if (this.state.hasAnswered) {
                  if (choice.isCorrect) {
                    btnClass = "bg-emerald-600 border-emerald-600 text-white font-black shadow-md scale-101";
                    badgeClass = "bg-white text-emerald-800";
                  } else if (choice.id === this.state.selectedChoiceId && !this.state.isCorrect) {
                    btnClass = "bg-rose-600 border-rose-600 text-white font-bold animate-shake";
                    badgeClass = "bg-white text-rose-800";
                  } else {
                    btnClass = "bg-slate-50 border-slate-200 text-slate-400 opacity-60";
                    badgeClass = "bg-slate-200 text-slate-500";
                  }
                }

                return `
                  <button type="button" class="btn-game-choice text-left p-4 rounded-2xl border-2 ${btnClass} font-bold text-sm sm:text-base transition-all active:scale-98 flex items-center justify-between shadow-2xs" data-choice-id="${choice.id}" ${this.state.hasAnswered ? 'disabled' : ''}>
                    <span class="leading-tight ${choice.isCyrillic ? 'cyrillic-text font-bold text-base' : ''}">${choice.text}</span>
                    <span class="text-xs w-6 h-6 rounded-full ${badgeClass} flex items-center justify-center font-extrabold shrink-0 ml-2">
                      ${idx + 1}
                    </span>
                  </button>
                `;
              }).join('')}
            </div>
          ` : `
            <!-- 記述入力エリア -->
            <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
              <input type="text" id="game-text-input" 
                class="w-full text-base sm:text-lg p-3.5 bg-slate-50 border-2 border-slate-300 focus:border-emerald-600 rounded-xl font-bold text-slate-800 outline-hidden ${genre !== 'ja_meaning' ? 'cyrillic-text text-center' : ''}" 
                placeholder="${this.getTextInputPlaceholder(genre)}" 
                ${this.state.hasAnswered ? 'disabled' : ''} 
                autofocus autocomplete="off">

              <!-- キリル文字クイックバー（モンゴル語訳・文法入力時） -->
              ${genre !== 'ja_meaning' ? `
                <div class="flex flex-wrap items-center justify-center gap-1.5 pt-1">
                  <span class="text-[10px] text-slate-400 font-bold mr-1">タップ入力:</span>
                  ${SPECIAL_CYRILLIC_BAR.map(char => `
                    <button type="button" class="btn-insert-game-char px-2.5 py-1 bg-slate-100 hover:bg-emerald-100 active:bg-emerald-200 text-slate-800 font-bold rounded-lg text-xs transition-colors cyrillic-text" data-char="${char}">
                      ${char}
                    </button>
                  `).join('')}
                </div>
              ` : ''}

              <button type="button" id="btn-submit-game-text" class="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl transition-all active:scale-98 shadow-sm ${this.state.hasAnswered ? 'disabled opacity-50' : ''}">
                回答する (Enter)
              </button>
            </div>
          `}

          <!-- 不正解時の即時フィードバックバナー -->
          ${this.state.hasAnswered && !this.state.isCorrect ? `
            <div class="p-4 bg-rose-50 border border-rose-200 rounded-2xl animate-fade-in flex items-center justify-between gap-3 text-xs">
              <div class="space-y-0.5">
                <div class="flex items-center gap-1.5">
                  <span class="font-black text-rose-800">❌ 正解:</span>
                  <span class="font-black text-rose-950 text-base ${genre !== 'ja_meaning' ? 'cyrillic-text' : ''}">${this.getCorrectAnswerDisplay(genre, q, details)}</span>
                </div>
                ${this.getWrongExplanationHtml(genre, q, details)}
              </div>
              <button type="button" id="btn-next-question-fast" class="px-4 py-2.5 bg-rose-600 text-white font-black rounded-xl shrink-0 shadow-2xs hover:bg-rose-700 transition-all">
                次へ →
              </button>
            </div>
          ` : ''}

        </div>

        <!-- スピードラン以外のモード用：手動終了ボタン（下部） -->
        ${this.state.mode !== 'speedrun' ? `
          <div class="flex justify-center pt-1">
            <button type="button" id="btn-bottom-finish-game" class="px-4 py-2 bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-700 text-xs font-black rounded-xl border border-slate-200 hover:border-rose-300 shadow-2xs transition-all active:scale-98 flex items-center gap-2 cursor-pointer">
              <span>🏁</span>
              <span>ゲームを終了して結果を見る (${this.state.totalAnswered}問解答済)</span>
            </button>
          </div>
        ` : ''}

      </div>
    `;

    this.bindPlayingEvents();
  }

  static getGenreShortName(genre) {
    switch (genre) {
      case 'ja_meaning': return '日本語訳';
      case 'mn_translation': return 'モンゴル語訳';
      case 'visual': return 'イラスト当て';
      case 'grammar': return '文法';
      case 'mixed': return 'ミックス';
      default: return 'ゲーム';
    }
  }

  static getGenreBadgeClass(genre) {
    switch (genre) {
      case 'ja_meaning': return 'bg-indigo-100 text-indigo-800';
      case 'mn_translation': return 'bg-emerald-100 text-emerald-800';
      case 'visual': return 'bg-sky-100 text-sky-800';
      case 'grammar': return 'bg-amber-100 text-amber-900';
      default: return 'bg-purple-100 text-purple-900';
    }
  }

  static getGenreHeaderBadge(genre) {
    switch (genre) {
      case 'ja_meaning': return 'bg-indigo-50 border-indigo-200 text-indigo-700';
      case 'mn_translation': return 'bg-emerald-50 border-emerald-200 text-emerald-700';
      case 'visual': return 'bg-sky-50 border-sky-200 text-sky-700';
      case 'grammar': return 'bg-amber-50 border-amber-200 text-amber-800';
      default: return 'bg-purple-50 border-purple-200 text-purple-700';
    }
  }

  static getGenreHeaderTitle(genre, q) {
    switch (genre) {
      case 'ja_meaning': return '🇯🇵 モンゴル語 → 日本語訳';
      case 'mn_translation': return '🇲🇳 日本語 → モンゴル語訳';
      case 'visual': return '🖼️ 絵を見てモンゴル語を当てよう！';
      case 'grammar': return `📐 文法クイズ（${q.category || q.lessonGroup || '文法'}）`;
      default: return '🎲 ミックス問題';
    }
  }

  static getPromptSubtitle(genre, q) {
    switch (genre) {
      case 'ja_meaning': return 'モンゴル語を見て【日本語の意味】を答えよ';
      case 'mn_translation': return '日本語を見て【モンゴル語（キリル文字）】を答えよ';
      case 'visual': return 'イラストに合う【モンゴル語（キリル文字）】を選べ';
      case 'grammar': return '問題文に合う【正しい回答】を選べ';
      default: return '問題の答えを選択せよ';
    }
  }

  static renderQuestionMainDisplay(genre, q, details) {
    if (genre === 'ja_meaning') {
      return `
        <div class="text-3xl sm:text-5xl font-black text-slate-900 cyrillic-text tracking-normal pt-1 select-none">
          ${details.dictForm || q.mongolian}
        </div>
      `;
    } else if (genre === 'mn_translation') {
      return `
        <div class="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight pt-1 select-none">
          ${q.japanese}
        </div>
      `;
    } else if (genre === 'visual') {
      return `
        <div class="py-2 select-none flex flex-col items-center justify-center">
          <div class="bg-white rounded-3xl p-3 shadow-md border border-slate-100 inline-block transform transition-transform hover:scale-105 duration-300">
            ${q.svg}
          </div>
        </div>
      `;
    } else {
      return `
        <div class="text-lg sm:text-2xl font-black text-slate-900 leading-snug pt-1 px-2 select-none cyrillic-text">
          ${q.question}
        </div>
      `;
    }
  }

  static renderQuestionSubInfo(genre, q, details) {
    if (genre === 'ja_meaning') {
      return `
        <div class="flex flex-wrap items-center justify-center gap-2 pt-1">
          <span class="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
            【品詞: ${q.pos || (details.isVerb ? '動詞' : '単語')}】
          </span>
          ${details.isVerb && details.root ? `
            <span class="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
              語幹: <span class="cyrillic-text">${details.root}</span>
            </span>
          ` : ''}
          ${(typeof isPronunciationCautionWord === 'function' && isPronunciationCautionWord(q) && q.pronunciation) ? `
            <span class="text-xs text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full font-bold border border-amber-200">
              ⚠️ 読み注意: [${q.pronunciation}]
            </span>
          ` : ''}
        </div>
      `;
    } else if (genre === 'mn_translation') {
      return `
        <div class="flex flex-wrap items-center justify-center gap-2 pt-1">
          <span class="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
            【品詞: ${q.pos || (details.isVerb ? '動詞' : '単語')}】
          </span>
          ${details.isVerb ? `
            <span class="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
              語幹または辞書形
            </span>
          ` : ''}
          ${q.category ? `
            <span class="text-xs text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full font-medium">
              ${q.category}
            </span>
          ` : ''}
        </div>
      `;
    } else if (genre === 'visual') {
      return `
        <div class="flex flex-wrap items-center justify-center gap-2 pt-1">
          ${q.category ? `
            <span class="text-xs px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-800 font-bold border border-sky-200">
              ${q.category}
            </span>
          ` : ''}
          ${q.hint ? `
            <span class="text-xs text-slate-500 bg-slate-50 px-2.5 py-0.5 rounded-full font-medium">
              💡 ${q.hint}
            </span>
          ` : ''}
        </div>
      `;
    } else {
      return `
        <div class="flex flex-wrap items-center justify-center gap-2 pt-1">
          ${q.category ? `
            <span class="text-xs px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 font-bold border border-amber-200">
              ${q.category}
            </span>
          ` : ''}
          ${q.hint || q.rule ? `
            <span class="text-xs text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full font-medium">
              💡 ${q.hint || q.rule}
            </span>
          ` : ''}
        </div>
      `;
    }
  }

  static getTextInputPlaceholder(genre) {
    if (genre === 'ja_meaning') return '日本語の意味を入力...';
    if (genre === 'mn_translation' || genre === 'visual') return 'モンゴル語（キリル文字）を入力...';
    return '回答を入力...';
  }

  static getCorrectAnswerDisplay(genre, q, details) {
    if (genre === 'ja_meaning') return q.japanese;
    if (genre === 'mn_translation') return details.dictForm || q.mongolian;
    if (genre === 'visual') return `${q.dictForm || q.mongolian} [${q.pronunciation || ''}] - ${q.japanese}`;
    return q.answer;
  }

  static getWrongExplanationHtml(genre, q, details) {
    if (genre === 'ja_meaning') {
      return details.derivation ? `<div class="text-rose-600 text-[11px] mt-0.5">${details.derivation}</div>` : '';
    } else if (genre === 'mn_translation') {
      return `
        <div class="text-rose-600 text-[11px] mt-0.5">
          ${details.isVerb && details.root ? `語幹: <span class="cyrillic-text font-bold">${details.root}</span> ` : ''}
          ${details.derivation || ''}
        </div>
      `;
    } else if (genre === 'visual') {
      return `
        <div class="text-slate-600 text-[11px] mt-0.5">
          💡 ${q.hint || q.japanese}
        </div>
      `;
    } else {
      return `
        <div class="text-rose-700 text-[11px] mt-0.5">
          ${q.explanation || ''} ${q.rule ? `（${q.rule}）` : ''}
        </div>
      `;
    }
  }

  static getModeName(mode) {
    switch (mode) {
      case 'speedrun': return '⏱️ スピードラン';
      case 'survival': return '❤️ サバイバル';
      case 'combo': return '🔥 コンボチャレンジ';
      case 'relax': return '🍃 リラックス';
      case 'drop': return '🐧 ペンギンドロップ';
      default: return '学習バトル';
    }
  }

  static getModeMetricHtml() {
    switch (this.state.mode) {
      case 'speedrun':
        return `<span class="text-amber-600">残り <span id="game-timer-val" class="font-black text-base">${this.state.timeLeft}</span> 秒</span>`;
      case 'survival':
      case 'drop':
        const hearts = '❤️'.repeat(Math.max(0, this.state.lives)) + '🖤'.repeat(Math.max(0, this.state.maxLives - this.state.lives));
        return `<span class="text-base tracking-wider">${hearts}</span>`;
      case 'combo':
        return `<span class="text-orange-600 font-extrabold">${this.state.combo} 連続中</span>`;
      case 'relax':
        return `<span class="text-emerald-700">マイペース学習中</span>`;
      default:
        return '';
    }
  }

  static getComboMultiplier(combo) {
    if (combo >= 20) return 3.0;
    if (combo >= 15) return 2.5;
    if (combo >= 10) return 2.0;
    if (combo >= 5) return 1.5;
    if (combo >= 3) return 1.2;
    return 1.0;
  }

  static bindPlayingEvents() {
    const q = this.state.currentQuestion;
    const genre = q._genre || this.state.questionGenre || 'ja_meaning';

    // 手動終了ハンドラー（スピードラン以外のモードを手動終了して結果を表示）
    const handleManualFinish = () => {
      if (this.state.totalAnswered === 0) {
        if (confirm('まだ1問も解答していませんが、ゲームを終了してモード選択画面に戻りますか？')) {
          this.stopTimer();
          this.state.view = 'mode_select';
          this.renderModeSelect();
        }
      } else {
        if (confirm(`現在の成績（${this.state.correctCount}問正解 / スコア: ${this.state.score.toLocaleString()}点）でゲームを終了し、結果画面を表示しますか？`)) {
          this.stopTimer();
          this.endGame('manual');
        }
      }
    };

    const finishBtn = this.container.querySelector('#btn-finish-game');
    if (finishBtn) finishBtn.addEventListener('click', handleManualFinish);

    const bottomFinishBtn = this.container.querySelector('#btn-bottom-finish-game');
    if (bottomFinishBtn) bottomFinishBtn.addEventListener('click', handleManualFinish);

    // スピードラン用中断ボタン
    const quitBtn = this.container.querySelector('#btn-quit-game');
    if (quitBtn) {
      quitBtn.addEventListener('click', () => {
        if (confirm('ゲームを中断して戻りますか？')) {
          this.stopTimer();
          if (this.state.totalAnswered > 0) {
            this.endGame('quit');
          } else {
            this.state.view = 'mode_select';
            this.renderModeSelect();
          }
        }
      });
    }

    // ヒント・品詞トグル
    const toggleHintBtn = this.container.querySelector('#btn-toggle-game-hint');
    const hintContent = this.container.querySelector('#game-hint-content');
    const hintToggleText = this.container.querySelector('#game-hint-toggle-text');
    if (toggleHintBtn && hintContent) {
      toggleHintBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const isHidden = hintContent.classList.toggle('hidden');
        if (hintToggleText) {
          hintToggleText.textContent = isHidden ? 'ヒント・品詞を見る ▼' : 'ヒントを閉じる ▲';
        }
      });
    }

    // 音声発音ボタン
    const speakBtn = this.container.querySelector('#btn-speak-game-word');
    if (speakBtn) {
      speakBtn.addEventListener('click', () => {
        if (genre === 'grammar') {
          // 文法問題の場合、正解または問題文を読み上げ
          SpeechService.speakMongolian(q.answer || q.question);
        } else {
          SpeechService.speakMongolian(q.mongolian);
        }
      });
    }

    // キリル文字クイック挿入ボタン
    this.container.querySelectorAll('.btn-insert-game-char').forEach(btn => {
      btn.addEventListener('click', () => {
        const char = btn.getAttribute('data-char');
        const input = this.container.querySelector('#game-text-input');
        if (input && !this.state.hasAnswered) {
          const start = input.selectionStart || input.value.length;
          const end = input.selectionEnd || input.value.length;
          input.value = input.value.substring(0, start) + char + input.value.substring(end);
          input.focus();
          input.selectionStart = input.selectionEnd = start + char.length;
        }
      });
    });

    // 4択ボタン選択
    if (this.state.inputMode === 'choice_4') {
      this.container.querySelectorAll('.btn-game-choice').forEach(btn => {
        btn.addEventListener('click', () => {
          if (this.state.hasAnswered) return;
          const choiceId = btn.getAttribute('data-choice-id');
          this.handleChoiceAnswer(choiceId);
        });
      });

      // キーボードショートカット (1, 2, 3, 4)
      const onKeyDown = (e) => {
        if (this.state.hasAnswered) return;
        const keyMap = { '1': 0, '2': 1, '3': 2, '4': 3 };
        if (e.key in keyMap && this.state.choices[keyMap[e.key]]) {
          window.removeEventListener('keydown', onKeyDown);
          const choice = this.state.choices[keyMap[e.key]];
          this.handleChoiceAnswer(choice.id);
        }
      };
      window.addEventListener('keydown', onKeyDown, { once: true });
    } else {
      // 記述入力
      const input = this.container.querySelector('#game-text-input');
      const submitBtn = this.container.querySelector('#btn-submit-game-text');

      const submit = () => {
        if (this.state.hasAnswered || !input) return;
        const val = input.value.trim();
        if (!val) return;

        let isMatch = false;
        if (genre === 'ja_meaning') {
          isMatch = isWordAnswerMatch(val, q, 'mn_to_ja');
        } else if (genre === 'mn_translation' || genre === 'visual') {
          isMatch = isWordAnswerMatch(val, q, 'ja_to_mn');
        } else {
          // 文法問題判定
          const clean = s => (s || '').toLowerCase().trim().replace(/[.,!?。、！？\s«»"']/g, '');
          const u = clean(val);
          isMatch = Boolean(
            u && (
              clean(q.answer) === u ||
              (Array.isArray(q.acceptableAnswers) && q.acceptableAnswers.some(a => clean(a) === u)) ||
              (Array.isArray(q.options) && clean(q.answer) === u)
            )
          );
        }

        this.processAnswer(isMatch, val);
      };

      if (input) {
        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') submit();
        });
      }
      if (submitBtn) {
        submitBtn.addEventListener('click', submit);
      }
    }

    // 即時次へボタン（不正解時）
    const nextFastBtn = this.container.querySelector('#btn-next-question-fast');
    if (nextFastBtn) {
      nextFastBtn.addEventListener('click', () => {
        this.advanceToNextQuestion();
      });
    }
  }

  static handleChoiceAnswer(choiceId) {
    if (this.state.hasAnswered) return;
    if (this.state.mode === 'drop') {
      this.handleDropChoiceAnswer(choiceId);
      return;
    }
    const selected = this.state.choices.find(c => String(c.id) === String(choiceId));
    const isCorrect = selected ? Boolean(selected.isCorrect) : false;
    this.state.selectedChoiceId = choiceId;
    this.processAnswer(isCorrect, selected ? selected.text : null);
  }

  static handleDropChoiceAnswer(choiceId) {
    if (this.state.hasAnswered || this.dropState.isDestroyed) return;

    const selected = this.state.choices.find(c => String(c.id) === String(choiceId));
    const isCorrect = selected ? Boolean(selected.isCorrect) : false;

    if (isCorrect) {
      this.state.hasAnswered = true;
      this.dropState.isDestroyed = true;
      this.stopDropLoop();

      this.state.correctCount++;
      this.state.totalAnswered++;
      this.state.combo++;
      if (this.state.combo > this.state.maxCombo) {
        this.state.maxCombo = this.state.combo;
      }

      // レーザー効果音 ＆ 正解音
      this.playLaserSound();
      if (this.state.combo >= 3) {
        SoundEffects.playCombo(this.state.combo);
      } else {
        SoundEffects.playCorrect();
      }

      // レーザービーム描画
      const laserBeam = this.container.querySelector('#drop-laser-beam');
      if (laserBeam) {
        const targetY = Math.max(10, Math.min(85, this.dropState.y * 0.74));
        laserBeam.setAttribute('y2', `${targetY}%`);
        laserBeam.classList.remove('hidden');
      }

      // ペンギンのジャンプアクション（サングラス着用）
      const mascotEl = this.container.querySelector('#drop-penguin-mascot');
      if (mascotEl) {
        mascotEl.classList.add('animate-bounce');
        mascotEl.innerHTML = PenguinMascot.getSvg({
          mood: this.state.combo >= 5 ? 'combo' : 'happy',
          sunglasses: true,
          size: 76
        });
      }

      // 落下ターゲットの爆発エフェクト
      const targetCard = this.container.querySelector('#drop-target-card');
      const q = this.state.currentQuestion;
      const responseSeconds = Math.max(0.3, (Date.now() - this.dropState.startTime) / 1000);
      this.state.answerTimes.push(responseSeconds);

      // スコア計算: 基礎150 + 撃破高度ボーナス + コンボ倍率
      const heightBonus = Math.round((100 - this.dropState.y) * 2);
      const mult = this.getComboMultiplier(this.state.combo);
      const gainedScore = Math.round((150 + heightBonus) * mult);
      this.state.score += gainedScore;

      const gainedXp = Math.round(25 * mult);
      this.state.xpEarned += gainedXp;

      if (targetCard) {
        targetCard.className = "absolute left-1/2 -translate-x-1/2 w-11/12 max-w-sm p-4 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 text-white text-center font-black shadow-2xl border-2 border-yellow-200 z-30 animate-scale-up";
        targetCard.innerHTML = `
          <div class="flex flex-col items-center justify-center gap-1">
            <span class="text-2xl animate-spin">💥</span>
            <div class="text-xl font-black text-yellow-100 tracking-wider">レーザー撃破！！</div>
            <div class="text-xs font-black text-amber-950 bg-amber-300 px-3 py-0.5 rounded-full shadow-xs">
              +${gainedScore.toLocaleString()} PTS (${mult}x)
            </div>
          </div>
        `;
      }

      const scoreEl = this.container.querySelector('#game-current-score');
      if (scoreEl) scoreEl.textContent = this.state.score.toLocaleString();

      const correctDisplay = q.dictForm || q.word || q.mongolian || '';
      this.state.correctAnswers.push({
        genre: 'drop',
        question: q,
        userAnswer: selected ? selected.text : correctDisplay,
        correctAnswer: correctDisplay,
        responseSeconds
      });

      // 次の問題へスムーズに進行 (0.45秒後)
      setTimeout(() => {
        if (this.state.view === 'playing') {
          this.advanceToNextQuestion();
        }
      }, 450);

    } else {
      // 不正解: ボタンが赤く震えるが、ターゲットは落下継続（再タップ可能）
      this.state.combo = 0;
      SoundEffects.playWrong();

      const clickedBtn = this.container.querySelector(`[data-choice-id="${choiceId}"]`);
      if (clickedBtn) {
        clickedBtn.classList.add('bg-rose-100', 'border-rose-400', 'animate-shake');
        setTimeout(() => {
          clickedBtn.classList.remove('bg-rose-100', 'border-rose-400', 'animate-shake');
        }, 500);
      }

      const mascotEl = this.container.querySelector('#drop-penguin-mascot');
      if (mascotEl) {
        mascotEl.innerHTML = PenguinMascot.getSvg({
          mood: 'wrong',
          sunglasses: true,
          size: 76
        });
      }
    }
  }

  static processAnswer(isCorrect, userText) {
    this.state.hasAnswered = true;
    this.state.isCorrect = isCorrect;
    this.state.totalAnswered++;

    // 回答速度の計測
    const responseSeconds = Math.max(0.5, ((Date.now() - this.state.questionStartTime) / 1000));
    this.state.answerTimes.push(responseSeconds);

    const q = this.state.currentQuestion;
    const genre = q._genre || this.state.questionGenre || 'ja_meaning';
    const details = (genre === 'ja_meaning' || genre === 'mn_translation') ? getWordGrammarDetails(q) : null;

    if (isCorrect) {
      this.state.correctCount++;
      this.state.combo++;
      if (this.state.combo > this.state.maxCombo) {
        this.state.maxCombo = this.state.combo;
      }

      // スコア計算
      // 基礎点100 + スピードボーナス(最速2秒以内で最大50点) * コンボ倍率
      const speedBonus = Math.max(0, Math.round((3.0 - responseSeconds) * 25));
      const mult = this.getComboMultiplier(this.state.combo);
      const points = Math.round((100 + speedBonus) * mult);
      this.state.score += points;

      // XP計算（基礎20 + コンボボーナス + スピードボーナス）
      const gainedXp = Math.round(20 * mult + (responseSeconds < 2 ? 10 : 0));
      this.state.xpEarned += gainedXp;

      // 効果音
      if (this.state.combo >= 3) {
        SoundEffects.playCombo(this.state.combo);
      } else {
        SoundEffects.playCorrect();
      }

      let correctDisplay = '';
      if (genre === 'ja_meaning') {
        correctDisplay = q.japanese;
      } else if (genre === 'mn_translation') {
        correctDisplay = details ? (details.dictForm || q.mongolian) : q.mongolian;
      } else if (genre === 'visual') {
        correctDisplay = q.dictForm || q.mongolian;
      } else {
        correctDisplay = q.answer;
      }

      this.state.correctAnswers.push({
        genre,
        question: q,
        userAnswer: userText || correctDisplay,
        correctAnswer: correctDisplay,
        responseSeconds
      });

      this.renderPlaying();

      // 正解時はテンポよく自動送り (0.65秒)
      setTimeout(() => {
        if (this.state.view === 'playing') {
          this.advanceToNextQuestion();
        }
      }, 650);

    } else {
      // 不正解
      this.state.combo = 0;
      SoundEffects.playWrong();

      let correctDisplay = '';
      if (genre === 'ja_meaning') {
        correctDisplay = q.japanese;
      } else if (genre === 'mn_translation') {
        correctDisplay = details ? (details.dictForm || q.mongolian) : q.mongolian;
      } else if (genre === 'visual') {
        correctDisplay = q.dictForm || q.mongolian;
      } else {
        correctDisplay = q.answer;
      }

      // 間違いリストに追加
      this.state.mistakes.push({
        genre,
        question: q,
        userAnswer: userText || '(選択肢の誤答)',
        correctAnswer: correctDisplay
      });

      // モード別ペナルティ
      if (this.state.mode === 'survival') {
        this.state.lives--;
        if (this.state.lives <= 0) {
          this.renderPlaying();
          setTimeout(() => this.endGame('dead'), 1200);
          return;
        }
      } else if (this.state.mode === 'combo') {
        this.renderPlaying();
        setTimeout(() => this.endGame('combo_broken'), 1200);
        return;
      }

      this.renderPlaying();

      // 不正解時はユーザーが正解を確認できるよう待機 (2.0秒)
      setTimeout(() => {
        if (this.state.view === 'playing' && this.state.hasAnswered) {
          this.advanceToNextQuestion();
        }
      }, 2000);
    }
  }

  static advanceToNextQuestion() {
    this.state.currentQuestionIndex++;
    this.loadQuestion();
  }

  // ==========================================
  // 4. ゲーム終了＆リザルト
  // ==========================================
  static endGame(reason = 'finish') {
    this.stopTimer();

    // データの記録・レベルアップ・実績チェック
    const result = StorageService.recordGameResult({
      mode: this.state.mode,
      score: this.state.score,
      maxCombo: this.state.maxCombo,
      correctCount: this.state.correctCount,
      totalCount: this.state.totalAnswered,
      xpEarned: this.state.xpEarned
    });

    this.state.lastGameResult = result;
    this.state.view = 'result';

    if (result.leveledUp) {
      setTimeout(() => {
        SoundEffects.playLevelUp();
      }, 300);
    }

    this.renderResult();
  }

  static renderResult() {
    const { score, maxCombo, correctCount, totalAnswered, xpEarned, mistakes } = this.state;
    const correctList = this.state.correctAnswers || [];
    const currentFilter = this.state.resultFilter || 'all';

    const allItems = [
      ...mistakes.map(m => ({ ...m, isCorrect: false })),
      ...correctList.map(c => ({ ...c, isCorrect: true }))
    ];

    const filteredItems = allItems.filter(item => {
      if (currentFilter === 'correct') return item.isCorrect;
      if (currentFilter === 'wrong') return !item.isCorrect;
      return true;
    });

    const accuracy = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;
    const avgSpeed = this.state.answerTimes.length > 0 
      ? (this.state.answerTimes.reduce((a, b) => a + b, 0) / this.state.answerTimes.length).toFixed(1)
      : '0.0';

    const result = this.state.lastGameResult || {};
    const rankInfo = this.calculateRank(score, accuracy, correctCount);
    const genreTitle = this.getGenreShortName(this.state.questionGenre);

    this.container.innerHTML = `
      <div class="max-w-2xl mx-auto space-y-5 animate-fade-in pb-16">
        
        <!-- ランク＆スコアカード -->
        <div class="bg-gradient-to-b ${rankInfo.bgGradient} rounded-3xl p-6 sm:p-8 text-white text-center shadow-lg relative overflow-hidden">
          
          <div class="text-xs font-black tracking-widest uppercase opacity-90">
            ${this.getModeName(this.state.mode)} [${genreTitle}] 終了
          </div>

          <!-- ランクバッジ -->
          <div class="my-3 inline-block">
            <div class="w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-full bg-white/20 backdrop-blur-md border-4 border-white/50 flex flex-col items-center justify-center shadow-xl animate-scale-up">
              <span class="text-4xl sm:text-5xl font-black">${rankInfo.rank}</span>
              <span class="text-[10px] font-extrabold uppercase mt-0.5 tracking-wider">${rankInfo.title}</span>
            </div>
          </div>

          <!-- スコア表示 -->
          <div class="text-3xl sm:text-5xl font-black tracking-tight mt-1">
            ${score.toLocaleString()} <span class="text-base font-normal opacity-80">PTS</span>
          </div>

          ${result.isNewHighScore ? `
            <div class="mt-2 inline-block px-3 py-1 bg-amber-400 text-slate-900 rounded-full font-black text-xs shadow-md animate-bounce">
              🏆 自己ベスト更新！ NEW RECORD!
            </div>
          ` : ''}

          <!-- 獲得XP -->
          <div class="mt-3 text-xs font-bold text-white/90">
            獲得XP: <span class="font-black text-base text-amber-300">+${xpEarned.toLocaleString()} XP</span>
          </div>

          <!-- レベルアップ通知 -->
          ${result.leveledUp ? `
            <div class="mt-3 p-3 bg-white/20 backdrop-blur-md rounded-2xl border border-white/40 text-center animate-pulse">
              <span class="text-base">🎉</span>
              <span class="font-black text-sm">LEVEL UP! Lv.${result.newLevel} に到達しました！</span>
            </div>
          ` : ''}

          <!-- 新解除実績通知 -->
          ${result.newAchievements && result.newAchievements.length > 0 ? `
            <div class="mt-2 p-2.5 bg-amber-400/90 text-slate-950 rounded-xl font-black text-xs">
              ✨ 実績解除: ${result.newAchievements.map(id => this.getAchievementName(id)).join(', ')}
            </div>
          ` : ''}

        </div>

        <!-- 詳細統計カード -->
        <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div class="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <div class="text-[11px] text-slate-500 font-bold">正解数</div>
            <div class="text-lg font-black text-slate-800">${correctCount} / ${totalAnswered}</div>
          </div>
          <div class="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <div class="text-[11px] text-slate-500 font-bold">正解率</div>
            <div class="text-lg font-black text-emerald-600">${accuracy}%</div>
          </div>
          <div class="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <div class="text-[11px] text-slate-500 font-bold">最大コンボ</div>
            <div class="text-lg font-black text-orange-600">${maxCombo} 連続</div>
          </div>
          <div class="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <div class="text-[11px] text-slate-500 font-bold">平均回答速度</div>
            <div class="text-lg font-black text-indigo-600">${avgSpeed} 秒</div>
          </div>
        </div>

        <!-- 解答問題の一覧・復習（正解・不正解フィルター付き） -->
        <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
            <h3 class="text-xs sm:text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
              <span>📋</span> 解答した問題の一覧 (${allItems.length}問)
            </h3>
            <div class="flex flex-wrap items-center gap-1">
              <div class="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
                <button type="button" class="filter-wordgame-result-btn px-2.5 py-1 rounded-lg transition-all cursor-pointer ${currentFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs font-black' : 'text-slate-500 hover:text-slate-800'}" data-filter="all">
                  すべて (${allItems.length})
                </button>
                <button type="button" class="filter-wordgame-result-btn px-2.5 py-1 rounded-lg transition-all cursor-pointer ${currentFilter === 'correct' ? 'bg-emerald-600 text-white shadow-2xs font-black' : 'text-slate-500 hover:text-emerald-700'}" data-filter="correct">
                  ⭕ 正解 (${correctList.length})
                </button>
                <button type="button" class="filter-wordgame-result-btn px-2.5 py-1 rounded-lg transition-all cursor-pointer ${currentFilter === 'wrong' ? 'bg-rose-600 text-white shadow-2xs font-black' : 'text-slate-500 hover:text-rose-700'}" data-filter="wrong">
                  ❌ 不正解 (${mistakes.length})
                </button>
              </div>
              ${mistakes.length > 0 ? `
                <button type="button" id="btn-save-all-mistakes" class="text-xs text-rose-700 bg-rose-50 hover:bg-rose-100 px-2.5 py-1.5 rounded-lg font-bold transition-all border border-rose-200 cursor-pointer shrink-0">
                  間違いノート保存
                </button>
              ` : ''}
            </div>
          </div>

          ${filteredItems.length === 0 ? `
            <div class="text-center py-6 text-xs text-slate-400">
              該当する問題はありません。
            </div>
          ` : `
            <div class="divide-y divide-slate-100 max-h-72 overflow-y-auto pr-1">
              ${filteredItems.map(m => {
                const item = m.question;
                const genre = m.genre || item._genre || 'ja_meaning';
                const isCorr = m.isCorrect;
                const statusBadge = isCorr
                  ? '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 shrink-0">⭕ 正解</span>'
                  : '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 shrink-0">❌ 不正解</span>';

                if (genre === 'grammar') {
                  return `
                    <div class="py-2.5 flex items-start justify-between gap-3 text-xs">
                      <div class="space-y-1">
                        <div class="flex items-center gap-1.5">
                          ${statusBadge}
                          <span class="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold">文法</span>
                          <span class="font-bold text-slate-900 text-xs sm:text-sm">${item.question}</span>
                        </div>
                        <div class="text-slate-700">
                          正解: <span class="cyrillic-text font-black text-sky-800">${m.correctAnswer}</span>
                        </div>
                        ${!isCorr ? `<div class="text-slate-500">あなたの回答: <span class="line-through text-rose-600">${m.userAnswer}</span></div>` : ''}
                        ${item.explanation ? `<div class="text-slate-500 text-[11px] bg-slate-50 p-1.5 rounded-lg">${item.explanation}</div>` : ''}
                      </div>
                      ${/[\u0400-\u04FF]/.test(m.correctAnswer) ? `
                        <button type="button" class="btn-speak-game-result text-slate-400 hover:text-emerald-700 p-2 rounded-lg hover:bg-slate-50 cursor-pointer" data-word="${m.correctAnswer}" title="発音を聞く">
                          🔊
                        </button>
                      ` : ''}
                    </div>
                  `;
                } else if (genre === 'mn_translation') {
                  const d = getWordGrammarDetails(item);
                  return `
                    <div class="py-2.5 flex items-center justify-between gap-3 text-xs">
                      <div class="space-y-0.5">
                        <div class="flex items-center gap-1.5">
                          ${statusBadge}
                          <span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold">モンゴル語訳</span>
                          <span class="font-bold text-slate-900 text-xs sm:text-sm">${item.japanese}</span>
                        </div>
                        <div class="text-slate-900 font-extrabold cyrillic-text text-sm">
                          正解: ${d.dictForm || item.mongolian} ${d.isVerb && d.root ? `(語幹: ${d.root})` : ''}
                        </div>
                        ${!isCorr ? `<div class="text-slate-500">あなたの回答: <span class="line-through text-rose-600">${m.userAnswer}</span></div>` : ''}
                      </div>
                      <button type="button" class="btn-speak-game-result text-slate-400 hover:text-emerald-700 p-2 rounded-lg hover:bg-slate-50 cursor-pointer" data-word="${item.mongolian}" title="発音を聞く">
                        🔊
                      </button>
                    </div>
                  `;
                } else if (genre === 'visual') {
                  const thumbSvg = item.svg ? item.svg.replace(/class="[^"]*"/, 'class="w-full h-full object-contain p-0.5"') : '';
                  return `
                    <div class="py-2.5 flex items-center justify-between gap-3 text-xs">
                      <div class="flex items-center gap-2.5">
                        <div class="w-12 h-12 shrink-0 bg-white rounded-xl border border-slate-200 overflow-hidden p-0.5 shadow-2xs flex items-center justify-center">
                          ${thumbSvg}
                        </div>
                        <div class="space-y-0.5">
                          <div class="flex items-center gap-1.5">
                            ${statusBadge}
                            <span class="text-[10px] px-2 py-0.5 rounded-full bg-sky-100 text-sky-900 font-bold">イラスト</span>
                            <span class="font-bold text-slate-900 text-xs">${item.japanese}</span>
                          </div>
                          <div class="text-slate-900 font-extrabold cyrillic-text">
                            正解: ${item.dictForm || item.mongolian} ${(typeof isPronunciationCautionWord === "function" && isPronunciationCautionWord(item) && item.pronunciation) ? `<span class="text-amber-700 font-bold ml-1">⚠️ [${item.pronunciation}]</span>` : ''}
                          </div>
                          ${!isCorr ? `<div class="text-slate-500">あなたの回答: <span class="line-through text-rose-600">${m.userAnswer}</span></div>` : ''}
                        </div>
                      </div>
                      <button type="button" class="btn-speak-game-result text-slate-400 hover:text-emerald-700 p-2 rounded-lg hover:bg-slate-50 cursor-pointer" data-word="${item.mongolian}" title="発音を聞く">
                        🔊
                      </button>
                    </div>
                  `;
                } else {
                  const d = getWordGrammarDetails(item);
                  return `
                    <div class="py-2.5 flex items-center justify-between gap-3 text-xs">
                      <div class="space-y-0.5">
                        <div class="flex items-center gap-1.5">
                          ${statusBadge}
                          <span class="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-900 font-bold">日本語訳</span>
                          <span class="font-extrabold text-slate-900 cyrillic-text text-sm">${d.dictForm || item.mongolian}</span>
                          ${(typeof isPronunciationCautionWord === "function" && isPronunciationCautionWord(item) && item.pronunciation) ? `<span class="text-amber-700 font-bold text-xs ml-1">⚠️ [${item.pronunciation}]</span>` : ''}
                        </div>
                        <div class="text-slate-700 font-medium">正解: <span class="font-bold text-slate-900">${item.japanese}</span></div>
                        ${!isCorr ? `<div class="text-slate-500">あなたの回答: <span class="line-through text-rose-600">${m.userAnswer}</span></div>` : ''}
                      </div>
                      <button type="button" class="btn-speak-game-result text-slate-400 hover:text-emerald-700 p-2 rounded-lg hover:bg-slate-50 cursor-pointer" data-word="${item.mongolian}" title="発音を聞く">
                        🔊
                      </button>
                    </div>
                  `;
                }
              }).join('')}
            </div>
          `}
        </div>

        <!-- アクションボタン群 -->
        <div class="space-y-2.5">
          <button type="button" id="btn-play-again" class="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-base rounded-2xl shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer">
            <span>🔄</span>
            <span>もう一度遊ぶ (${this.getModeName(this.state.mode)})</span>
          </button>

          <div class="grid grid-cols-2 gap-2.5">
            <button type="button" id="btn-change-mode" class="py-3 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold text-xs rounded-xl transition-all shadow-2xs cursor-pointer">
              🎯 別のモード・ジャンルを選ぶ
            </button>
            <button type="button" id="btn-back-to-home" class="py-3 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold text-xs rounded-xl transition-all shadow-2xs cursor-pointer">
              🏠 ホームへ戻る
            </button>
          </div>
        </div>
              🏠 ホームへ戻る
            </button>
          </div>
        </div>

        <!-- スピードラン以外のモード用：手動終了ボタン（下部） -->
        ${this.state.mode !== 'speedrun' ? `
          <div class="flex justify-center pt-1">
            <button type="button" id="btn-bottom-finish-game" class="px-4 py-2 bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-700 text-xs font-black rounded-xl border border-slate-200 hover:border-rose-300 shadow-2xs transition-all active:scale-98 flex items-center gap-2 cursor-pointer">
              <span>🏁</span>
              <span>ゲームを終了して結果を見る (${this.state.totalAnswered}問解答済)</span>
            </button>
          </div>
        ` : ''}

      </div>
    `;

    this.bindResultEvents();
  }

  static calculateRank(score, accuracy, correctCount) {
    if (score >= 2500 || (accuracy >= 95 && correctCount >= 15)) {
      return { rank: 'S', title: '草原の英雄', bgGradient: 'from-amber-500 via-orange-500 to-rose-600' };
    }
    if (score >= 1500 || (accuracy >= 85 && correctCount >= 10)) {
      return { rank: 'A', title: '達人', bgGradient: 'from-emerald-600 via-teal-600 to-cyan-600' };
    }
    if (score >= 800 || accuracy >= 70) {
      return { rank: 'B', title: '一人前', bgGradient: 'from-sky-600 via-blue-600 to-indigo-600' };
    }
    return { rank: 'C', title: '見習い', bgGradient: 'from-slate-600 via-slate-700 to-slate-800' };
  }

  static getAchievementName(id) {
    const ACHIEVEMENTS = {
      first_game: '初めの一歩 🎮',
      speed_runner: 'スピードスター ⏱️',
      survivor: '不屈の魂 🛡️',
      combo_master: 'コンボマスター 🔥',
      combo_god: '草原の神風 ⚡',
      perfect_accuracy: '百発百中 🎯',
      level_10: '一人前の旅人 🌟',
      level_30: 'チンギスの伝令 🐎',
      century: '百戦錬磨 📚',
      score_3000: 'ハイスコアラー 🏆'
    };
    return ACHIEVEMENTS[id] || id;
  }

  static bindResultEvents() {
    // もう一度遊ぶ
    const playAgainBtn = this.container.querySelector('#btn-play-again');
    if (playAgainBtn) {
      playAgainBtn.addEventListener('click', () => {
        this.startGame();
      });
    }

    // モード・ジャンル変更
    const changeModeBtn = this.container.querySelector('#btn-change-mode');
    if (changeModeBtn) {
      changeModeBtn.addEventListener('click', () => {
        this.state.view = 'mode_select';
        this.renderModeSelect();
      });
    }

    // ホームへ戻る
    const homeBtn = this.container.querySelector('#btn-back-to-home');
    if (homeBtn) {
      homeBtn.addEventListener('click', () => {
        if (this.onNavigate) this.onNavigate('home');
      });
    }

    // 結果リストフィルター切り替え
    this.container.querySelectorAll('.filter-wordgame-result-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.state.resultFilter = btn.getAttribute('data-filter');
        this.renderResult();
      });
    });

    // 解答一覧の単語発音
    this.container.querySelectorAll('.btn-speak-game-result, .btn-speak-mistake').forEach(btn => {
      btn.addEventListener('click', () => {
        const word = btn.getAttribute('data-word');
        if (word) SpeechService.speakMongolian(word);
      });
    });

    // 間違えた単語の発音
    this.container.querySelectorAll('.btn-speak-mistake').forEach(btn => {
      btn.addEventListener('click', () => {
        const word = btn.getAttribute('data-word');
        SpeechService.speakMongolian(word);
      });
    });

    // 間違いを一括保存
    const saveMistakesBtn = this.container.querySelector('#btn-save-all-mistakes');
    if (saveMistakesBtn) {
      saveMistakesBtn.addEventListener('click', () => {
        this.state.mistakes.forEach(m => {
          const item = m.question;
          const genre = m.genre || item._genre || 'ja_meaning';
          if (genre === 'grammar') {
            StorageService.recordMistake({
              question: `【文法ゲーム】${item.question}`,
              userAnswer: m.userAnswer,
              correctAnswer: m.correctAnswer,
              type: 'grammar',
              category: item.category || item.lessonGroup || '文法ゲーム',
              explanation: item.explanation || `正解: ${item.answer}`
            });
          } else if (genre === 'visual') {
            StorageService.recordMistake({
              question: `【イラスト】${item.japanese}`,
              userAnswer: m.userAnswer,
              correctAnswer: item.dictForm || item.mongolian,
              type: 'word',
              category: item.category || 'イラスト単語',
              explanation: `${item.japanese} = ${item.dictForm || item.mongolian} [${item.pronunciation || ''}]。${item.hint || ''}`
            });
          } else {
            const d = getWordGrammarDetails(item);
            StorageService.recordMistake({
              question: `【単語ゲーム】${d.dictForm || item.mongolian} の意味`,
              userAnswer: m.userAnswer,
              correctAnswer: m.correctAnswer,
              type: 'word',
              category: item.category || '単語ゲーム',
              explanation: `正解: ${item.japanese} (辞書形: ${d.dictForm || item.mongolian}${d.isVerb ? `, 語幹: ${d.root}` : ''})`
            });
          }
        });
        saveMistakesBtn.textContent = "✓ 保存完了！";
        saveMistakesBtn.className = "text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg font-bold border border-emerald-200";
        saveMistakesBtn.disabled = true;
      });
    }
  }

  // ==========================================
  // 5. 実績・称号モーダル
  // ==========================================
  static showAchievements() {
    const modalContainer = this.container.querySelector('#game-achievements-modal');
    if (!modalContainer) return;

    const stats = StorageService.getGameStats();
    const unlocked = new Set(stats.unlockedAchievements || []);

    const ALL_ACHIEVEMENTS = [
      { id: 'first_game', icon: '🎮', title: '初めの一歩', desc: '単語ゲームを初めてプレイする' },
      { id: 'speed_runner', icon: '⏱️', title: 'スピードスター', desc: 'スピードランで15問以上正解する' },
      { id: 'survivor', icon: '🛡️', title: '不屈の魂', desc: 'サバイバルで20問以上耐え抜く' },
      { id: 'combo_master', icon: '🔥', title: 'コンボマスター', desc: '10連続正解を達成する' },
      { id: 'combo_god', icon: '⚡', title: '草原の神風', desc: '25連続正解を達成する' },
      { id: 'perfect_accuracy', icon: '🎯', title: '百発百中', desc: '正解率100%で完了（10問以上回答）' },
      { id: 'level_10', icon: '🌟', title: '一人前の旅人', desc: 'プレイヤーレベル10に到達する' },
      { id: 'level_30', icon: '🐎', title: 'チンギスの伝令', desc: 'プレイヤーレベル30に到達する' },
      { id: 'century', icon: '📚', title: '百戦錬磨', desc: '累計100問正解を達成する' },
      { id: 'score_3000', icon: '🏆', title: 'ハイスコアラー', desc: '1回のプレイで3000点以上獲得する' }
    ];

    modalContainer.className = "fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in";
    modalContainer.innerHTML = `
      <div class="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <div class="flex items-center gap-2">
            <span class="text-2xl">🏆</span>
            <div>
              <h3 class="text-base font-extrabold text-slate-900">実績・称号コレクション</h3>
              <p class="text-xs text-slate-500">解除済み: ${unlocked.size} / ${ALL_ACHIEVEMENTS.length}</p>
            </div>
          </div>
          <button type="button" id="btn-close-achievements" class="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 text-lg">
            ✕
          </button>
        </div>

        <div class="overflow-y-auto space-y-2.5 pr-1 flex-1">
          ${ALL_ACHIEVEMENTS.map(ach => {
            const isUnlocked = unlocked.has(ach.id);
            return `
              <div class="p-3.5 rounded-2xl border ${isUnlocked ? 'border-amber-300 bg-amber-50/50' : 'border-slate-200 bg-slate-50/70 opacity-60'} flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl ${isUnlocked ? 'bg-amber-400 text-slate-950' : 'bg-slate-200 text-slate-400'} flex items-center justify-center text-xl shrink-0">
                  ${ach.icon}
                </div>
                <div class="flex-1">
                  <div class="flex items-center justify-between">
                    <h4 class="text-xs font-black text-slate-900">${ach.title}</h4>
                    <span class="text-[10px] font-extrabold px-2 py-0.5 rounded-full ${isUnlocked ? 'bg-amber-200 text-amber-900' : 'bg-slate-200 text-slate-500'}">
                      ${isUnlocked ? '達成！' : '未解除'}
                    </span>
                  </div>
                  <p class="text-[11px] text-slate-500 mt-0.5">${ach.desc}</p>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <button type="button" id="btn-close-achievements-bottom" class="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all">
          閉じる
        </button>
      </div>
    `;

    const close = () => {
      modalContainer.className = "hidden";
      modalContainer.innerHTML = '';
    };

    modalContainer.querySelector('#btn-close-achievements')?.addEventListener('click', close);
    modalContainer.querySelector('#btn-close-achievements-bottom')?.addEventListener('click', close);
    modalContainer.addEventListener('click', (e) => {
      if (e.target === modalContainer) close();
    });
  }
}
