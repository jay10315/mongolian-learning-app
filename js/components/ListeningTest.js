// リスニング問題コンポーネント（穴埋め ＆ ディクテーション ＆ 数字特化）
import { StorageService } from '../services/storage.js';
import { SpeechService } from '../services/speech.js';
import { GamificationService } from '../services/gamification.js';
import { PenguinMascot } from './PenguinMascot.js';
import { SoundEffects, shuffleArray, SPECIAL_CYRILLIC_BAR, isListeningAnswerMatch, scrollToQuizTop } from '../utils/helpers.js';

export class ListeningTestComponent {
  static container = null;
  static onNavigate = null;

  static state = {
    view: 'settings', // 'settings' | 'testing' | 'result'
    settings: {
      category: 'numbers', // 'numbers' | 'conversation' | 'grammar' | 'all'
      mode: 'blank', // 'blank' (穴埋め) | 'dictation' (ディクテーション)
      inputMode: 'choice', // 'choice' (4択) | 'text' (記述入力)
      questionCount: 10,
      autoPlay: true
    },
    quizzes: [],
    currentIndex: 0,
    currentQuiz: null,
    shuffledOptions: [],
    hasAnswered: false,
    userAnswer: '',
    isCorrect: false,
    isPlayingAudio: false,
    showHint: false,
    results: [],
    sessionScore: 0,
    sessionXp: 0,
    sessionResult: null,
    resultFilter: 'all'
  };

  static render(container, onNavigate) {
    this.container = container;
    this.onNavigate = onNavigate;

    if (this.state.view === 'testing') {
      this.renderTesting();
    } else if (this.state.view === 'result') {
      this.renderResult();
    } else {
      this.state.view = 'settings';
      this.renderSettings();
    }
  }

  // ==========================================
  // 1. 設定画面
  // ==========================================
  static renderSettings() {
    const allQuizzes = StorageService.getListeningQuizzes() || [];
    const numberCount = allQuizzes.filter(q => q.category === 'numbers').length;
    const convCount = allQuizzes.filter(q => q.category === 'conversation').length;
    const gramCount = allQuizzes.filter(q => q.category === 'grammar').length;

    this.container.innerHTML = `
      <div class="animate-fade-in max-w-xl mx-auto px-4 py-4 space-y-4">
        
        <!-- ヘッダー -->
        <div class="bg-gradient-to-r from-teal-600 via-cyan-600 to-sky-700 rounded-2xl p-5 text-white shadow-md relative overflow-hidden">
          <div class="relative z-10">
            <div class="flex items-center gap-2 mb-1">
              <span class="text-xs font-bold px-2 py-0.5 rounded-full bg-white/20 text-white border border-white/30">
                🎧 ネイティブ音声対応
              </span>
              <span class="text-xs text-teal-100 font-medium">全${allQuizzes.length}問 収録</span>
            </div>
            <h2 class="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
              <span>🎧</span> モンゴル語リスニングテスト
            </h2>
            <p class="text-xs text-teal-100 mt-1 leading-relaxed">
              ネイティブ音声を聞き取り！難関の数字・金額・時刻から日常会話・基本構文まで、穴埋め＆ディクテーションで徹底攻略。
            </p>
          </div>
          <div class="absolute -right-4 -bottom-6 text-7xl opacity-15 select-none pointer-events-none">
            🔊
          </div>
        </div>

        <!-- 設定フォーム -->
        <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-5">
          
          <!-- 1. 問題ジャンル選択 -->
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
              <span>🎯</span> 出題ジャンルを選ぶ
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              
              <!-- 数字特化（最重要ハイライト） -->
              <button type="button" class="btn-category-select text-left p-3 rounded-xl border-2 transition-all cursor-pointer ${
                this.state.settings.category === 'numbers' ? 'border-amber-500 bg-amber-50/70 shadow-2xs' : 'border-slate-200 hover:border-amber-300'
              }" data-val="numbers">
                <div class="flex items-center justify-between">
                  <span class="font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
                    <span>🔢</span> 数字特化（金額・時間・電話）
                  </span>
                  <span class="text-[10px] font-black px-1.5 py-0.5 rounded bg-amber-500 text-white">イチオシ</span>
                </div>
                <div class="text-[11px] text-slate-500 mt-1">
                  1〜100、千・万、トゥグルグ金額、時刻、電話番号、年齢（${numberCount}問）
                </div>
              </button>

              <!-- 日常会話・旅行 -->
              <button type="button" class="btn-category-select text-left p-3 rounded-xl border-2 transition-all cursor-pointer ${
                this.state.settings.category === 'conversation' ? 'border-teal-500 bg-teal-50/70 shadow-2xs' : 'border-slate-200 hover:border-teal-300'
              }" data-val="conversation">
                <div class="flex items-center justify-between">
                  <span class="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                    <span>💬</span> 日常会話・旅行・挨拶
                  </span>
                  <span class="text-[10px] text-slate-400 font-medium">${convCount}問</span>
                </div>
                <div class="text-[11px] text-slate-500 mt-1">
                  自己紹介、買い物、道案内、食事、定番フレーズの聞き取り
                </div>
              </button>

              <!-- 基本文法・構文 -->
              <button type="button" class="btn-category-select text-left p-3 rounded-xl border-2 transition-all cursor-pointer ${
                this.state.settings.category === 'grammar' ? 'border-teal-500 bg-teal-50/70 shadow-2xs' : 'border-slate-200 hover:border-teal-300'
              }" data-val="grammar">
                <div class="flex items-center justify-between">
                  <span class="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                    <span>📐</span> 基本文法・構文
                  </span>
                  <span class="text-[10px] text-slate-400 font-medium">${gramCount}問</span>
                </div>
                <div class="text-[11px] text-slate-500 mt-1">
                  過去形、否定、願望、禁止、並列順次、格助詞の聞き分け
                </div>
              </button>

              <!-- 全ジャンル総合 -->
              <button type="button" class="btn-category-select text-left p-3 rounded-xl border-2 transition-all cursor-pointer ${
                this.state.settings.category === 'all' ? 'border-teal-500 bg-teal-50/70 shadow-2xs' : 'border-slate-200 hover:border-teal-300'
              }" data-val="all">
                <div class="flex items-center justify-between">
                  <span class="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                    <span>🌟</span> 全ジャンル総合
                  </span>
                  <span class="text-[10px] text-slate-400 font-medium">全${allQuizzes.length}問</span>
                </div>
                <div class="text-[11px] text-slate-500 mt-1">
                  数字・会話・文法をランダムにシャッフル出題
                </div>
              </button>

            </div>
          </div>

          <!-- 2. 学習モード選択（穴埋め ＆ ディクテーション） -->
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
              <span>⚡</span> 出題モードを選ぶ
            </label>
            <div class="grid grid-cols-2 gap-2">
              <button type="button" class="btn-mode-select p-3 rounded-xl border-2 text-center transition-all cursor-pointer ${
                this.state.settings.mode === 'blank' ? 'border-teal-600 bg-teal-50/80 shadow-2xs font-extrabold text-teal-900' : 'border-slate-200 hover:bg-slate-50 text-slate-700 font-bold'
              }" data-val="blank">
                <div class="text-base mb-0.5">🧩</div>
                <div class="text-xs sm:text-sm">穴埋めモード</div>
                <div class="text-[10px] text-slate-500 font-normal mt-0.5">文中の空欄部を聞き取って解答</div>
              </button>

              <button type="button" class="btn-mode-select p-3 rounded-xl border-2 text-center transition-all cursor-pointer ${
                this.state.settings.mode === 'dictation' ? 'border-teal-600 bg-teal-50/80 shadow-2xs font-extrabold text-teal-900' : 'border-slate-200 hover:bg-slate-50 text-slate-700 font-bold'
              }" data-val="dictation">
                <div class="text-base mb-0.5">✍️</div>
                <div class="text-xs sm:text-sm">ディクテーション</div>
                <div class="text-[10px] text-slate-500 font-normal mt-0.5">音声をそのまま文字・数字で書き取り</div>
              </button>
            </div>
          </div>

          <!-- 3. 入力方式選択 -->
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
              <span>⌨️</span> 回答形式を選ぶ
            </label>
            <div class="grid grid-cols-2 gap-2">
              <button type="button" class="btn-inputmode-select p-2.5 rounded-xl border-2 text-center transition-all cursor-pointer ${
                this.state.settings.inputMode === 'choice' ? 'border-teal-600 bg-teal-50/80 shadow-2xs font-bold text-teal-900' : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }" data-val="choice">
                <span class="text-xs">🔘 4択選択（タップで回答）</span>
              </button>

              <button type="button" class="btn-inputmode-select p-2.5 rounded-xl border-2 text-center transition-all cursor-pointer ${
                this.state.settings.inputMode === 'text' ? 'border-teal-600 bg-teal-50/80 shadow-2xs font-bold text-teal-900' : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }" data-val="text">
                <span class="text-xs">⌨️ 記述入力（キリル文字 / 数字）</span>
              </button>
            </div>
          </div>

          <!-- 4. 出題数 & 自動再生 -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 border-t border-slate-100">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1.5">出題数</label>
              <div class="flex items-center gap-1.5">
                ${[5, 10, 20, 50].map(cnt => `
                  <button type="button" class="btn-count-select flex-1 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                    this.state.settings.questionCount === cnt ? 'bg-slate-800 text-white border-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-100'
                  }" data-val="${cnt}">
                    ${cnt === 50 ? '全問' : `${cnt}問`}
                  </button>
                `).join('')}
              </div>
            </div>

            <div class="flex items-center justify-between sm:justify-end gap-3 pt-4 sm:pt-0">
              <label class="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer select-none">
                <input type="checkbox" id="check-auto-play" ${this.state.settings.autoPlay ? 'checked' : ''} class="rounded text-teal-600 focus:ring-0 w-4 h-4 cursor-pointer">
                <span>問題表示時に自動で音声再生</span>
              </label>
            </div>
          </div>

          <!-- スタートボタン -->
          <button type="button" id="btn-start-listening" class="w-full py-3.5 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-extrabold rounded-xl shadow-md hover:shadow-lg transition-all active:scale-98 text-base flex items-center justify-center gap-2 cursor-pointer">
            <span>🎧</span>
            <span>リスニングを開始する →</span>
          </button>

        </div>
      </div>
    `;

    this.bindSettingsEvents();
  }

  static bindSettingsEvents() {
    // ジャンル選択
    this.container.querySelectorAll('.btn-category-select').forEach(btn => {
      btn.addEventListener('click', () => {
        this.state.settings.category = btn.getAttribute('data-val');
        this.renderSettings();
      });
    });

    // モード選択（穴埋め / ディクテーション）
    this.container.querySelectorAll('.btn-mode-select').forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.getAttribute('data-val');
        this.state.settings.mode = mode;
        // ディクテーション選択時は自然に記述入力を推奨
        if (mode === 'dictation') {
          this.state.settings.inputMode = 'text';
        }
        this.renderSettings();
      });
    });

    // 入力方式選択
    this.container.querySelectorAll('.btn-inputmode-select').forEach(btn => {
      btn.addEventListener('click', () => {
        this.state.settings.inputMode = btn.getAttribute('data-val');
        this.renderSettings();
      });
    });

    // 出題数
    this.container.querySelectorAll('.btn-count-select').forEach(btn => {
      btn.addEventListener('click', () => {
        this.state.settings.questionCount = parseInt(btn.getAttribute('data-val'), 10);
        this.renderSettings();
      });
    });

    // 自動再生
    const autoPlayCheck = this.container.querySelector('#check-auto-play');
    if (autoPlayCheck) {
      autoPlayCheck.addEventListener('change', (e) => {
        this.state.settings.autoPlay = e.target.checked;
      });
    }

    // スタート
    const startBtn = this.container.querySelector('#btn-start-listening');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        this.startTest();
      });
    }
  }

  // ==========================================
  // 2. テスト開始
  // ==========================================
  static startTest() {
    let list = StorageService.getListeningQuizzes() || [];
    const cat = this.state.settings.category;

    if (cat && cat !== 'all') {
      list = list.filter(q => q.category === cat);
    }

    if (list.length === 0) {
      alert('該当するリスニング問題がありません。');
      return;
    }

    list = shuffleArray([...list]);
    const max = this.state.settings.questionCount;
    this.state.quizzes = list.slice(0, max);
    this.state.currentIndex = 0;
    this.state.results = [];
    this.state.sessionScore = 0;
    this.state.sessionXp = 0;
    this.state.sessionResult = null;
    try {
      if (typeof GamificationService !== 'undefined') {
        if (typeof GamificationService.resetSessionCombo === 'function') {
          GamificationService.resetSessionCombo();
        } else if (typeof GamificationService.resetCombo === 'function') {
          GamificationService.resetCombo();
        }
      }
    } catch (_) {}

    this.state.view = 'testing';
    this.loadQuiz(0);
  }

  static loadQuiz(index) {
    this.state.currentIndex = index;
    const q = this.state.quizzes[index];
    scrollToQuizTop(this.container);
    this.state.currentQuiz = q;
    this.state.hasAnswered = false;
    this.state.userAnswer = '';
    this.state.isCorrect = false;
    this.state.showHint = false;
    this.state.isPlayingAudio = false;

    // 4択選択肢のシャッフル
    if (this.state.settings.inputMode === 'choice') {
      let opts = q.options && q.options.length >= 4 ? [...q.options] : [];
      if (opts.length === 0) {
        opts = [q.blankWord || q.answer];
        // 他の問題からダミー選択肢を補充
        const others = this.state.quizzes.filter(item => item.id !== q.id).map(item => item.blankWord || item.answer).filter(Boolean);
        shuffleArray(others);
        opts.push(...others.slice(0, 3));
      }
      this.state.shuffledOptions = shuffleArray(opts);
    } else {
      this.state.shuffledOptions = [];
    }

    this.renderTesting();

    // 自動音声再生
    if (this.state.settings.autoPlay) {
      setTimeout(() => {
        this.playAudio(false);
      }, 350);
    }
  }

  // ==========================================
  // 3. 音声再生処理
  // ==========================================
  static playAudio(isSlow = false) {
    const q = this.state.currentQuiz;
    if (!q) return;

    const textToSpeak = q.audioText || q.sentence.replace(/[\[\]]/g, '') || q.blankWord;
    this.state.isPlayingAudio = true;
    this.updateAudioIndicator(true);

    const promise = isSlow ? SpeechService.speakSlow(textToSpeak) : SpeechService.speak(textToSpeak);

    if (promise && typeof promise.then === 'function') {
      promise.then(() => {
        setTimeout(() => {
          this.state.isPlayingAudio = false;
          this.updateAudioIndicator(false);
        }, 1200);
      }).catch(() => {
        this.state.isPlayingAudio = false;
        this.updateAudioIndicator(false);
      });
    } else {
      setTimeout(() => {
        this.state.isPlayingAudio = false;
        this.updateAudioIndicator(false);
      }, 1500);
    }
  }

  static updateAudioIndicator(isPlaying) {
    const btnPlay = this.container.querySelector('#btn-play-audio-normal');
    const wave = this.container.querySelector('#audio-wave-anim');
    if (btnPlay) {
      if (isPlaying) {
        btnPlay.classList.add('ring-4', 'ring-teal-400', 'bg-teal-700');
      } else {
        btnPlay.classList.remove('ring-4', 'ring-teal-400', 'bg-teal-700');
      }
    }
    if (wave) {
      wave.className = isPlaying ? 'flex items-center gap-1 text-teal-600 animate-pulse text-xs font-bold' : 'hidden';
    }
  }

  // ==========================================
  // 4. テスト実行中画面
  // ==========================================
  static renderTesting() {
    const q = this.state.currentQuiz;
    const idx = this.state.currentIndex;
    const total = this.state.quizzes.length;
    const progressPercent = Math.round(((idx) / total) * 100);
    const isBlankMode = this.state.settings.mode === 'blank';
    const isNumberQuiz = q.category === 'numbers';

    // 穴埋め用の文面フォーマット
    const formattedSentence = q.sentence ? q.sentence.replace(/\[(.*?)\]/g, `<span class="bg-amber-100 text-amber-900 border-2 border-dashed border-amber-400 px-2.5 py-0.5 rounded-lg font-black inline-block mx-1 shadow-2xs">$1</span>`) : '';

    this.container.innerHTML = `
      <div class="animate-fade-in max-w-xl mx-auto px-4 py-3 space-y-3.5">
        
        <!-- プログレスバー ＆ HUD -->
        <div class="space-y-1.5">
          <div class="flex justify-between items-center text-xs font-bold text-slate-500">
            <span class="flex items-center gap-2">
              <span>リスニング ${idx + 1} / ${total}</span>
              ${GamificationService.sessionCombo >= 2 ? `
                <span class="px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200 animate-bounce text-[10px]">
                  🔥 ${GamificationService.sessionCombo} COMBO
                </span>
              ` : ''}
              <span class="text-[10px] px-2 py-0.5 rounded-full ${isNumberQuiz ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-teal-50 text-teal-700 border-teal-200'} border">
                ${q.categoryLabel || 'リスニング'}
              </span>
            </span>
            <div class="flex items-center gap-3">
              <span class="text-teal-600 font-extrabold">+${this.state.sessionScore || 0} PTS</span>
              <span class="text-teal-700 font-extrabold">+${this.state.sessionXp || 0} XP</span>
              <button type="button" id="btn-quit-listening" class="text-slate-400 hover:text-slate-700 ml-1 cursor-pointer">中断</button>
            </div>
          </div>
          <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div class="bg-teal-500 h-full transition-all duration-300" style="width: ${progressPercent}%"></div>
          </div>
        </div>

        <!-- 音声プレイヤーメインカード -->
        <div class="bg-gradient-to-b from-white to-slate-50 rounded-2xl p-5 border border-slate-200 shadow-sm text-center relative overflow-hidden space-y-3">
          
          <div class="flex items-center justify-between text-xs text-slate-400 font-bold border-b border-slate-100 pb-2">
            <span>${isBlankMode ? '🧩 穴埋めリスニング' : '✍️ ディクテーション'}</span>
            <div id="audio-wave-anim" class="hidden">
              <span>🔊</span> <span>音声再生中...</span>
            </div>
            <span>ショートカット: Rで再生</span>
          </div>

          <!-- 音声再生ボタン群 -->
          <div class="flex items-center justify-center gap-3 py-2">
            
            <!-- 通常再生ボタン -->
            <button type="button" id="btn-play-audio-normal" class="px-5 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold shadow-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer text-sm sm:text-base">
              <span class="text-xl">🔊</span>
              <span>もう一度聞く</span>
            </button>

            <!-- ゆっくり再生ボタン（0.75倍速） -->
            <button type="button" id="btn-play-audio-slow" class="px-4 py-3 rounded-2xl bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-200 font-bold shadow-2xs transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer text-xs sm:text-sm">
              <span class="text-base">🐢</span>
              <span>ゆっくり再生 (0.75x)</span>
            </button>
          </div>

          <!-- 穴埋めモードの場合：文の空欄表示 -->
          ${isBlankMode ? `
            <div class="pt-2">
              <div class="text-xs text-slate-400 font-semibold mb-1">空欄に入る言葉を聞き取ってください:</div>
              <div class="text-lg sm:text-2xl font-black text-slate-800 tracking-tight cyrillic-text leading-relaxed">
                ${q.sentence.replace(/\[(.*?)\]/g, `<span class="bg-amber-100 text-amber-900 border-2 border-dashed border-amber-400 px-3 py-1 rounded-xl font-black inline-block mx-1 shadow-2xs text-base sm:text-xl">[ ？ ]</span>`)}
              </div>
              <div class="text-xs text-slate-500 font-medium mt-2">
                🇯🇵 ${q.japanese}
              </div>
            </div>
          ` : `
            <!-- ディクテーションモードの場合 -->
            <div class="pt-1 space-y-1">
              <div class="text-sm font-bold text-slate-700">
                聞き取ったモンゴル語（または数字）を書き取ってください
              </div>
              ${isNumberQuiz ? `
                <div class="text-[11px] text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg inline-block border border-amber-200 font-medium">
                  💡 数字問題は算用数字（例: 5000）でもキリル文字（таван мянган）でも正解判定されます！
                </div>
              ` : ''}

              <!-- 日本語ヒントトグル -->
              <div class="pt-1">
                ${!this.state.showHint ? `
                  <button type="button" id="btn-toggle-hint" class="text-xs text-slate-400 hover:text-slate-600 underline font-medium">
                    💡 日本語の意味を表示
                  </button>
                ` : `
                  <div class="text-xs text-slate-600 font-medium bg-slate-100 p-2 rounded-lg">
                    🇯🇵 ${q.japanese}
                  </div>
                `}
              </div>
            </div>
          `}
        </div>

        <!-- 回答エリア（未回答時） -->
        ${!this.state.hasAnswered ? `
          <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
            
            ${this.state.settings.inputMode === 'choice' && this.state.shuffledOptions.length > 0 ? `
              <!-- 4択選択 -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                ${this.state.shuffledOptions.map((opt, i) => `
                  <button type="button" class="btn-listening-choice text-left p-3.5 rounded-xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/50 text-slate-800 font-bold text-sm transition-all active:scale-98 flex items-center justify-between cyrillic-text cursor-pointer" data-val="${opt}">
                    <span><span class="inline-block w-5 text-slate-400 font-normal">${i + 1}.</span> ${opt}</span>
                    <span class="text-xs text-slate-400 font-normal">選択</span>
                  </button>
                `).join('')}
              </div>
            ` : `
              <!-- 記述入力（ディクテーション・記述穴埋め） -->
              <div class="space-y-2">
                <input type="text" id="input-listening-answer" 
                  class="w-full text-base sm:text-lg p-3 rounded-xl border-2 border-slate-300 focus:border-teal-500 focus:outline-hidden text-center font-bold text-slate-800 cyrillic-text cyrillic-input" 
                  placeholder="${isNumberQuiz ? '数字またはモンゴル語を入力...' : '聞き取った形を入力...'}" 
                  data-cyrillic="true"
                  autofocus autocomplete="off">

                <!-- キリル文字クイックバー -->
                <div class="flex items-center gap-1 overflow-x-auto py-1.5 scrollbar-none">
                  <span class="text-[11px] text-slate-400 shrink-0">タップ入力:</span>
                  ${SPECIAL_CYRILLIC_BAR.map(c => `
                    <button type="button" class="btn-quick-char px-2 py-1 text-xs font-bold bg-slate-100 hover:bg-teal-100 text-slate-700 rounded border border-slate-200 shrink-0 cursor-pointer" data-char="${c}">
                      ${c}
                    </button>
                  `).join('')}
                </div>

                <!-- 数字特化時のクイックテンキーバー -->
                ${isNumberQuiz ? `
                  <div class="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
                    <span class="text-[11px] text-slate-400 shrink-0">数字:</span>
                    ${['0','1','2','3','4','5','6','7','8','9', 'төгрөг'].map(d => `
                      <button type="button" class="btn-quick-char px-2.5 py-1 text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 rounded border border-amber-200 shrink-0 cursor-pointer" data-char="${d}">
                        ${d}
                      </button>
                    `).join('')}
                  </div>
                ` : ''}

                <button type="button" id="btn-submit-listening-text" class="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-md transition-all active:scale-98 text-sm mt-2 cursor-pointer">
                  回答する（Enter）
                </button>
              </div>
            `}
          </div>
        ` : `
          <!-- 回答後フィードバック・完全解説カード -->
          <div class="animate-fade-in space-y-4">
            <div class="p-5 rounded-2xl border ${this.state.isCorrect ? 'bg-emerald-50/95 border-emerald-300 text-emerald-950' : 'bg-rose-50/95 border-rose-300 text-rose-950'} shadow-sm space-y-3">
              
              <div class="flex items-center justify-between">
                <div class="text-2xl font-bold ${this.state.isCorrect ? 'text-emerald-800' : 'text-rose-800'}">
                  ${this.state.isCorrect ? '⭕ 正解！' : '❌ 不正解'}
                </div>
                <button type="button" id="btn-replay-feedback-audio" class="px-3 py-1.5 rounded-lg bg-white/80 hover:bg-white text-xs font-bold text-slate-700 border border-slate-300 shadow-2xs flex items-center gap-1 cursor-pointer">
                  <span>🔊</span> もう一度聞く
                </button>
              </div>

              <!-- 不正解時のユーザー回答 -->
              ${!this.state.isCorrect ? `
                <div class="text-xs bg-rose-100/70 p-2 rounded-lg border border-rose-200 text-rose-900">
                  <span>あなたの回答: </span>
                  <span class="font-bold line-through">${this.state.userAnswer || '(未入力)'}</span>
                </div>
              ` : ''}

              <!-- 完全文・正解表示 -->
              <div class="bg-white rounded-xl p-3.5 border border-slate-200 space-y-2 text-xs sm:text-sm">
                <div>
                  <div class="text-[10px] text-slate-400 font-bold mb-0.5">📖 モンゴル語全文</div>
                  <div class="text-base sm:text-lg font-black text-slate-900 cyrillic-text">
                    ${q.sentence.replace(/\[(.*?)\]/g, `<span class="text-emerald-700 font-black border-b-2 border-emerald-500 pb-0.5">$1</span>`)}
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                  <div class="bg-slate-50 p-2 rounded-lg border border-slate-200">
                    <div class="text-[10px] text-slate-400 font-bold">🎯 聞き取り対象語</div>
                    <div class="font-bold text-emerald-800 text-sm mt-0.5 cyrillic-text">
                      ${q.blankWord || q.answer} ${q.numericAnswer ? `<span class="text-slate-500 font-normal">(${q.numericAnswer})</span>` : ''}
                    </div>
                  </div>

                  <div class="bg-slate-50 p-2 rounded-lg border border-slate-200">
                    <div class="text-[10px] text-slate-400 font-bold">🇯🇵 日本語訳</div>
                    <div class="font-bold text-slate-800 text-sm mt-0.5">
                      ${q.japanese}
                    </div>
                  </div>
                </div>

                <!-- 文法・数字・発音解説 -->
                ${q.explanation ? `
                  <div class="bg-amber-50/70 p-2.5 rounded-lg border border-amber-200 text-xs text-amber-900 space-y-0.5">
                    <div class="font-bold flex items-center gap-1">
                      <span>💡</span> 解説・数字のポイント:
                    </div>
                    <div>${q.explanation}</div>
                  </div>
                ` : ''}
              </div>

            </div>

            <!-- 次へボタン -->
            <button type="button" id="btn-next-listening" class="w-full py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-extrabold rounded-xl shadow-md transition-all active:scale-98 text-sm flex items-center justify-center gap-1 cursor-pointer">
              <span>${idx + 1 < total ? '次の問題へ（Enter） →' : '結果を見る 🎉'}</span>
            </button>
          </div>
        `}
      </div>
    `;

    this.bindTestingEvents();
  }

  static bindTestingEvents() {
    // 中断ボタン
    const quitBtn = this.container.querySelector('#btn-quit-listening');
    if (quitBtn) {
      quitBtn.addEventListener('click', () => {
        if (confirm('テストを中断しますか？')) {
          SpeechService.stop();
          this.state.view = 'settings';
          this.renderSettings();
        }
      });
    }

    // 音声再生ボタン（通常）
    const playBtn = this.container.querySelector('#btn-play-audio-normal');
    if (playBtn) {
      playBtn.addEventListener('click', () => {
        this.playAudio(false);
      });
    }

    // 音声再生ボタン（ゆっくり 0.75x）
    const playSlowBtn = this.container.querySelector('#btn-play-audio-slow');
    if (playSlowBtn) {
      playSlowBtn.addEventListener('click', () => {
        this.playAudio(true);
      });
    }

    // 日本語ヒントトグル
    const hintBtn = this.container.querySelector('#btn-toggle-hint');
    if (hintBtn) {
      hintBtn.addEventListener('click', () => {
        this.state.showHint = true;
        this.renderTesting();
      });
    }

    // 回答前イベント
    if (!this.state.hasAnswered) {
      if (this.state.settings.inputMode === 'choice') {
        this.container.querySelectorAll('.btn-listening-choice').forEach(btn => {
          btn.addEventListener('click', () => {
            const val = btn.getAttribute('data-val');
            this.checkAnswer(val);
          });
        });
      } else {
        const input = this.container.querySelector('#input-listening-answer');
        const submitBtn = this.container.querySelector('#btn-submit-listening-text');

        if (input && submitBtn) {
          const doSubmit = () => {
            const val = input.value.trim();
            if (val) this.checkAnswer(val);
          };

          submitBtn.addEventListener('click', doSubmit);
          input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              doSubmit();
            }
          });
        }

        // クイックキリル文字バー入力
        this.container.querySelectorAll('.btn-quick-char').forEach(btn => {
          btn.addEventListener('click', () => {
            const char = btn.getAttribute('data-char');
            if (input) {
              const start = input.selectionStart || input.value.length;
              const end = input.selectionEnd || input.value.length;
              input.value = input.value.slice(0, start) + char + input.value.slice(end);
              input.focus();
              input.setSelectionRange(start + char.length, start + char.length);
            }
          });
        });
      }
    } else {
      // 回答後イベント
      const nextBtn = this.container.querySelector('#btn-next-listening');
      if (nextBtn) {
        nextBtn.focus();
        nextBtn.addEventListener('click', () => {
          this.goNext();
        });
      }

      const replayBtn = this.container.querySelector('#btn-replay-feedback-audio');
      if (replayBtn) {
        replayBtn.addEventListener('click', () => {
          this.playAudio(false);
        });
      }
    }
  }

  // ==========================================
  // 5. 回答チェック
  // ==========================================
  static checkAnswer(userAns) {
    if (this.state.hasAnswered) return;

    const q = this.state.currentQuiz;
    this.state.hasAnswered = true;
    this.state.userAnswer = userAns;

    const isCorrect = isListeningAnswerMatch(userAns, q, this.state.settings.mode);
    this.state.isCorrect = isCorrect;

    if (isCorrect) {
      SoundEffects.playCorrect();
      // 正解時に間違いノートの問題を克服済みにする
      StorageService.resolveMistakeByQuestion(q.sentence || q.japanese, q.answer);
    } else {
      SoundEffects.playWrong();
      StorageService.recordMistake({
        question: `【リスニング】${q.sentence ? q.sentence.replace(/\[(.*?)\]/g, '____') : q.audioText}`,
        userAnswer: userAns || '(未回答)',
        correctAnswer: q.blankWord || q.answer,
        type: 'listening',
        category: q.categoryLabel || 'リスニング',
        explanation: `${q.explanation || ''} (日本語: ${q.japanese || ''})`
      });
    }

    // ゲーミフィケーション集計（スコア・XP・コンボ）
    const feedback = GamificationService.recordAnswer({ isCorrect, testType: 'listening' });
    this.state.sessionScore = (this.state.sessionScore || 0) + feedback.scoreGained;
    this.state.sessionXp = (this.state.sessionXp || 0) + feedback.xpGained;

    this.state.results.push({
      quiz: q,
      userAnswer: userAns,
      isCorrect: isCorrect
    });

    this.renderTesting();
  }

  static goNext() {
    SpeechService.stop();
    scrollToQuizTop(this.container);
    if (this.state.currentIndex + 1 < this.state.quizzes.length) {
      this.loadQuiz(this.state.currentIndex + 1);
    } else {
      const total = this.state.quizzes.length;
      const correct = this.state.results.filter(r => r.isCorrect).length;
      const wrong = total - correct;

      StorageService.recordHistory({
        type: 'listening',
        total: total,
        correct: correct,
        category: this.state.settings.category
      });

      const sessionResult = GamificationService.finishSession({
        testType: 'listening',
        testTitle: 'リスニングテスト',
        correctCount: correct,
        wrongCount: wrong,
        sessionScore: this.state.sessionScore || 0,
        sessionXp: this.state.sessionXp || 0
      });
      this.state.sessionResult = sessionResult;

      this.state.view = 'result';
      this.renderResult();

      if (sessionResult.leveledUp || sessionResult.newTitleUnlocked || sessionResult.evolved) {
        setTimeout(() => {
          GamificationService.showCelebrationModal({
            newLevel: sessionResult.newLevel,
            title: sessionResult.currentTitle,
            evolved: sessionResult.evolved,
            oldStage: sessionResult.oldStage,
            newStage: sessionResult.newStage
          });
        }, 250);
      }
    }
  }

  // ==========================================
  // 6. 結果画面
  // ==========================================
  static renderResult() {
    const total = this.state.quizzes.length;
    const correct = this.state.results.filter(r => r.isCorrect).length;
    const wrong = total - correct;
    const currentFilter = this.state.resultFilter || 'all';

    const filteredResults = this.state.results.filter(r => {
      if (currentFilter === 'correct') return r.isCorrect;
      if (currentFilter === 'wrong') return !r.isCorrect;
      return true;
    });

    this.container.innerHTML = `
      <div class="animate-fade-in max-w-xl mx-auto px-4 py-4 space-y-4">
        
        <!-- ゲームリザルト ＆ Оцон шувууフィードバック -->
        ${GamificationService.renderGameResultCard({
          testTitle: 'リスニングテスト',
          correctCount: correct,
          wrongCount: wrong,
          sessionScore: this.state.sessionScore || 0,
          sessionXp: this.state.sessionXp || 0
        })}

        <!-- 結果一覧フィルター（要件1: 正解したやつも一覧で見れる機能） -->
        <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
          <div class="flex items-center justify-between">
            <h4 class="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <span>📋</span> 解答一覧 ＆ 音声聞き直し
            </h4>
            
            <div class="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
              <button type="button" class="btn-filter-result px-2.5 py-1 rounded-lg transition-all cursor-pointer ${currentFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'}" data-filter="all">
                すべて (${total})
              </button>
              <button type="button" class="btn-filter-result px-2.5 py-1 rounded-lg transition-all cursor-pointer ${currentFilter === 'correct' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-slate-500 hover:text-emerald-700'}" data-filter="correct">
                正解 (${correct})
              </button>
              <button type="button" class="btn-filter-result px-2.5 py-1 rounded-lg transition-all cursor-pointer ${currentFilter === 'wrong' ? 'bg-rose-600 text-white shadow-2xs' : 'text-slate-500 hover:text-rose-700'}" data-filter="wrong">
                不正解 (${wrong})
              </button>
            </div>
          </div>

          <!-- 各問題の詳細カード一覧 -->
          <div class="space-y-2.5">
            ${filteredResults.length === 0 ? `
              <div class="text-center py-6 text-slate-400 text-xs">
                該当する問題はありません。
              </div>
            ` : filteredResults.map((r, i) => `
              <div class="p-3.5 rounded-xl border ${r.isCorrect ? 'border-emerald-200 bg-emerald-50/40' : 'border-rose-200 bg-rose-50/40'} space-y-2">
                <div class="flex items-start justify-between gap-2">
                  <div class="flex items-center gap-2">
                    <span class="text-sm">${r.isCorrect ? '⭕' : '❌'}</span>
                    <span class="text-xs font-bold text-slate-700">${r.quiz.categoryLabel}</span>
                  </div>
                  <button type="button" class="btn-replay-item px-2 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 shadow-2xs flex items-center gap-1 cursor-pointer" data-text="${r.quiz.audioText || r.quiz.sentence.replace(/[\[\]]/g, '')}">
                    <span>🔊</span> 再生
                  </button>
                </div>

                <div class="text-sm font-bold text-slate-900 cyrillic-text">
                  ${r.quiz.sentence.replace(/\[(.*?)\]/g, `<span class="text-emerald-700 font-extrabold border-b border-emerald-400">$1</span>`)}
                </div>

                <div class="text-xs text-slate-600">
                  🇯🇵 ${r.quiz.japanese}
                </div>

                <div class="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-200/60">
                  <div>
                    <span class="text-slate-400">あなたの回答: </span>
                    <span class="font-bold ${r.isCorrect ? 'text-emerald-800' : 'text-rose-700 line-through'}">${r.userAnswer || '(未回答)'}</span>
                  </div>
                  <div>
                    <span class="text-slate-400">正解: </span>
                    <span class="font-bold text-emerald-800 cyrillic-text">${r.quiz.blankWord || r.quiz.answer} ${r.quiz.numericAnswer ? `(${r.quiz.numericAnswer})` : ''}</span>
                  </div>
                </div>

                ${r.quiz.explanation ? `
                  <div class="text-[11px] text-slate-500 bg-white/70 p-2 rounded-lg border border-slate-200">
                    💡 ${r.quiz.explanation}
                  </div>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </div>

        <!-- アクションボタン群 -->
        <div class="flex flex-col sm:flex-row gap-2 pt-2">
          <button type="button" id="btn-restart-listening" class="flex-1 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-md transition-all active:scale-98 text-sm flex items-center justify-center gap-1.5 cursor-pointer">
            <span>🔄</span> もう一度挑戦する
          </button>
          
          <button type="button" id="btn-goto-mistakes-from-listening" class="flex-1 py-3 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 font-bold rounded-xl transition-all active:scale-98 text-sm flex items-center justify-center gap-1.5 cursor-pointer">
            <span>🔥</span> 間違いノートを確認
          </button>

          <button type="button" id="btn-home-from-listening" class="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all text-sm cursor-pointer">
            ホーム
          </button>
        </div>

      </div>
    `;

    this.bindResultEvents();
  }

  static bindResultEvents() {
    // フィルター切り替え
    this.container.querySelectorAll('.btn-filter-result').forEach(btn => {
      btn.addEventListener('click', () => {
        this.state.resultFilter = btn.getAttribute('data-filter');
        this.renderResult();
      });
    });

    // 各問題の音声再生
    this.container.querySelectorAll('.btn-replay-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const text = btn.getAttribute('data-text');
        if (text) SpeechService.speak(text);
      });
    });

    // もう一度
    const restartBtn = this.container.querySelector('#btn-restart-listening');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        this.state.view = 'settings';
        this.renderSettings();
      });
    }

    // 間違いノートへ
    const mistakeBtn = this.container.querySelector('#btn-goto-mistakes-from-listening');
    if (mistakeBtn) {
      mistakeBtn.addEventListener('click', () => {
        if (this.onNavigate) this.onNavigate('review');
      });
    }

    // ホームへ
    const homeBtn = this.container.querySelector('#btn-home-from-listening');
    if (homeBtn) {
      homeBtn.addEventListener('click', () => {
        if (this.onNavigate) this.onNavigate('home');
      });
    }
  }
}
