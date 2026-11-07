// モンゴル語練習ノート（МОНГОЛ ХЭЛНИЙ ДАСГАЛЫН ДЭВТЭР）学習コンポーネント
// 教科書全18課の練習問題を課ごとに学習可能
// 正解・不正解問わず超詳細な解説（文法、語尾、母音調和、語順、他表現との違い）を常時表示
import { StorageService } from '../services/storage.js';
import { SpeechService } from '../services/speech.js';
import { GamificationService } from '../services/gamification.js';
import { SoundEffects, SPECIAL_CYRILLIC_BAR, shuffleArray } from '../utils/helpers.js';
import { exerciseNotebookQuizzes } from '../data/exerciseNotebookQuizzes.js';

export class ExerciseNotebookTestComponent {
  static container = null;
  static onNavigate = null;
  static activeInput = null;

  static state = {
    view: 'lesson_select', // 'lesson_select' | 'quiz' | 'result'
    selectedLesson: 'all', // 'all' | 1 .. 18
    quizzes: [],
    currentIndex: 0,
    currentQuiz: null,
    score: 0,
    xpEarned: 0,
    combo: 0,
    maxCombo: 0,
    userAnswer: '',
    isAnswered: false,
    isCorrect: false,
    results: []
  };

  static render(container, onNavigate) {
    this.container = container;
    this.onNavigate = onNavigate;

    if (this.state.view === 'quiz' && this.state.currentQuiz) {
      this.renderQuiz();
    } else if (this.state.view === 'result') {
      this.renderResult();
    } else {
      this.state.view = 'lesson_select';
      this.renderLessonSelect();
    }
  }

  // ==========================================
  // 1. 課選択画面
  // ==========================================
  static renderLessonSelect() {
    const lessons = exerciseNotebookQuizzes || [];
    const totalQuizCount = lessons.reduce((acc, l) => acc + (l.quizzes ? l.quizzes.length : 0), 0);

    const lessonCards = lessons.map(l => {
      const qCount = l.quizzes ? l.quizzes.length : 0;
      return `
        <div class="lesson-card bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-5 border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between" data-lesson="${l.lesson}">
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <span class="px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-black text-xs">
                第${l.lesson}課
              </span>
              <span class="text-xs font-bold text-slate-500 dark:text-slate-400">
                ${qCount}問収録
              </span>
            </div>
            <h3 class="font-black text-slate-900 dark:text-white text-sm sm:text-base group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              ${l.lessonTitle}
            </h3>
          </div>
          <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs">
            <span class="text-slate-500 font-bold">筆記・空欄補充・文法</span>
            <span class="font-black text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
              スタート <span>→</span>
            </span>
          </div>
        </div>
      `;
    }).join('');

    this.container.innerHTML = `
      <div class="animate-fade-in max-w-4xl mx-auto px-4 py-4 space-y-6">
        
        <!-- ヘッダーバナー -->
        <div class="bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div class="relative z-10 space-y-3">
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-indigo-100">
              <span>📓</span> МОНГОЛ ХЭЛНИЙ ДАСГАЛЫН ДЭВТЭР
            </div>
            <h1 class="text-2xl sm:text-3xl font-black tracking-tight">
              練習ノート問題集（全18課）
            </h1>
            <p class="text-xs sm:text-sm text-indigo-100/90 leading-relaxed max-w-2xl font-bold">
              教科書と直結した練習ノートの全問題を解く専用モードです。筆記練習、空欄補充、疑問助詞、格変化、文の書き換えを網羅。<br>
              正解・不正解問わず、<strong class="text-amber-300">文法・語尾・母音調和・構文の超詳細な解説</strong>をすべて確認できます！
            </p>
            <div class="pt-2 flex flex-wrap gap-2.5">
              <button type="button" class="btn-start-all-lessons px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm shadow-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer">
                <span>⚡</span> 全18課からランダム出題（10問）
              </button>
            </div>
          </div>
          <div class="absolute -right-10 -bottom-10 text-9xl opacity-10 select-none pointer-events-none">📓</div>
        </div>

        <!-- 課一覧グリッド -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <h2 class="font-black text-slate-900 dark:text-white text-base sm:text-lg flex items-center gap-2">
              <span>📚</span> 学習する課を選択
            </h2>
            <span class="text-xs font-bold text-slate-500">全${lessons.length}課・計${totalQuizCount}問</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            ${lessonCards}
          </div>
        </div>
      </div>
    `;

    // イベントバインド
    const btnAll = this.container.querySelector('.btn-start-all-lessons');
    if (btnAll) {
      btnAll.addEventListener('click', () => {
        this.startSession('all');
      });
    }

    this.container.querySelectorAll('.lesson-card').forEach(card => {
      card.addEventListener('click', () => {
        const lessonNum = parseInt(card.getAttribute('data-lesson'), 10);
        this.startSession(lessonNum);
      });
    });
  }

  // ==========================================
  // 2. セッション開始
  // ==========================================
  static startSession(lessonChoice) {
    this.state.selectedLesson = lessonChoice;
    let pool = [];

    if (lessonChoice === 'all') {
      (exerciseNotebookQuizzes || []).forEach(l => {
        if (l.quizzes) pool.push(...l.quizzes.map(q => ({ ...q, lessonNumber: l.lesson, lessonTitle: l.lessonTitle })));
      });
      pool = shuffleArray(pool).slice(0, 10);
    } else {
      const found = (exerciseNotebookQuizzes || []).find(l => l.lesson === lessonChoice);
      if (found && found.quizzes) {
        pool = found.quizzes.map(q => ({ ...q, lessonNumber: found.lesson, lessonTitle: found.lessonTitle }));
      }
    }

    if (pool.length === 0) {
      alert('問題が準備されていません。');
      return;
    }

    this.state.quizzes = pool;
    this.state.currentIndex = 0;
    this.state.score = 0;
    this.state.xpEarned = 0;
    this.state.combo = 0;
    this.state.maxCombo = 0;
    this.state.results = [];
    this.initQuiz(0);
    this.state.view = 'quiz';
    this.renderQuiz();
  }

  static initQuiz(index) {
    this.state.currentIndex = index;
    this.state.currentQuiz = this.state.quizzes[index] || null;
    this.state.userAnswer = '';
    this.state.isAnswered = false;
    this.state.isCorrect = false;
  }

  // ==========================================
  // 3. クイズ画面のレンダリング
  // ==========================================
  static renderQuiz() {
    const q = this.state.currentQuiz;
    if (!q) {
      this.finishSession();
      return;
    }

    const total = this.state.quizzes.length;
    const currentNum = this.state.currentIndex + 1;
    const progressPercent = Math.round((currentNum / total) * 100);

    const isInput = q.exerciseType === 'input';
    const hasOptions = Array.isArray(q.options) && q.options.length > 0;

    let inputAreaHTML = '';
    if (this.state.isAnswered) {
      // 解答済みの結果＆超詳細解説表示
      const badgeClass = this.state.isCorrect 
        ? 'bg-emerald-500 text-white' 
        : 'bg-rose-500 text-white';
      const badgeIcon = this.state.isCorrect ? '⭕ 正解！' : '❌ 不正解';

      inputAreaHTML = `
        <div class="space-y-4 animate-fade-in">
          <!-- 正否バナー -->
          <div class="p-4 rounded-2xl ${this.state.isCorrect ? 'bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-500' : 'bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-500'} flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="px-3 py-1 rounded-xl ${badgeClass} font-black text-sm">
                ${badgeIcon}
              </span>
              <span class="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                あなたの回答: <strong class="font-black">${this.state.userAnswer || '（未入力）'}</strong>
              </span>
            </div>
            ${this.state.isCorrect ? `<span class="text-xs font-black text-emerald-600 dark:text-emerald-400">+10 PTS / +5 XP</span>` : ''}
          </div>

          <!-- 正解の提示 -->
          <div class="p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 space-y-1">
            <div class="text-xs font-bold text-slate-500 dark:text-slate-400">正しい解答:</div>
            <div class="font-black text-indigo-600 dark:text-indigo-400 text-xl cyrillic-text">
              ${q.correctAnswer}
            </div>
          </div>

          <!-- ★ 超詳細解説エリア（正解・不正解問わず必ず表示） -->
          <div class="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50/70 dark:from-slate-800 dark:to-slate-800/90 border-2 border-amber-300 dark:border-amber-500/50 space-y-3 shadow-sm">
            <div class="flex items-center justify-between">
              <span class="font-black text-amber-950 dark:text-amber-300 text-sm sm:text-base flex items-center gap-1.5">
                <span>📖</span> 文法・語尾・正解の徹底解説:
              </span>
              <button type="button" class="btn-play-answer-audio px-2.5 py-1 rounded-lg bg-amber-200 dark:bg-amber-900/60 hover:bg-amber-300 text-amber-950 dark:text-amber-200 font-bold text-xs flex items-center gap-1">
                <span>🔊</span> 発音を聞く
              </button>
            </div>
            <div class="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line font-medium border-t border-amber-200 dark:border-slate-700 pt-2.5">
              ${q.explanation}
            </div>
          </div>

          <!-- 次へボタン -->
          <div class="pt-2 flex justify-end">
            <button type="button" class="btn-next-quiz px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-sm sm:text-base shadow-lg transition-all active:scale-95 cursor-pointer flex items-center gap-2">
              <span>${currentNum >= total ? '結果発表を見る' : '次の問題へ'}</span>
              <span>→</span>
            </button>
          </div>
        </div>
      `;
    } else if (hasOptions && !isInput) {
      // 選択肢形式
      const optionButtons = q.options.map((opt, idx) => `
        <button type="button" class="btn-option w-full p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/40 text-left font-black text-sm sm:text-base text-slate-900 dark:text-white transition-all active:scale-98 shadow-2xs flex items-center gap-3 cursor-pointer group" data-answer="${opt}">
          <span class="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 group-hover:bg-indigo-500 group-hover:text-white transition-colors flex items-center justify-center text-xs font-black">
            ${idx + 1}
          </span>
          <span class="cyrillic-text flex-1">${opt}</span>
        </button>
      `).join('');

      inputAreaHTML = `
        <div class="space-y-3 pt-2">
          ${optionButtons}
        </div>
      `;
    } else {
      // キリル文字入力形式
      inputAreaHTML = `
        <div class="space-y-4 pt-2">
          <div class="relative">
            <input type="text" class="quiz-input-field w-full p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 focus:border-indigo-500 dark:focus:border-indigo-400 text-slate-900 dark:text-white font-black text-base sm:text-lg cyrillic-text outline-hidden shadow-inner" placeholder="キリル文字で解答を入力..." autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false">
          </div>

          <!-- キリル文字バー -->
          <div class="pt-1">
            ${SPECIAL_CYRILLIC_BAR}
          </div>

          <div class="pt-2 flex justify-end">
            <button type="button" class="btn-submit-input px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm sm:text-base shadow-lg transition-all active:scale-95 cursor-pointer flex items-center gap-2">
              <span>回答する（Enter）</span>
              <span>✓</span>
            </button>
          </div>
        </div>
      `;
    }

    this.container.innerHTML = `
      <div class="animate-fade-in max-w-2xl mx-auto px-4 py-4 space-y-5">
        
        <!-- ナビゲーションバー -->
        <div class="flex items-center justify-between text-xs font-bold text-slate-500">
          <button type="button" class="btn-back-to-lessons hover:text-slate-800 dark:hover:text-slate-200 transition-colors flex items-center gap-1 cursor-pointer">
            <span>←</span> 課一覧に戻る
          </button>
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-black">
              第${q.lessonNumber}課
            </span>
            <span>問題 ${currentNum} / ${total}</span>
          </div>
        </div>

        <!-- プログレスバー -->
        <div class="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
          <div class="bg-gradient-to-r from-indigo-500 to-purple-500 h-full transition-all duration-300" style="width: ${progressPercent}%;"></div>
        </div>

        <!-- スコア・コンボ -->
        <div class="flex items-center justify-between text-xs font-bold px-1">
          <span class="text-amber-600 dark:text-amber-400 font-black">
            スコア: ${this.state.score} PTS ｜ +${this.state.xpEarned} XP
          </span>
          ${this.state.combo > 1 ? `
            <span class="text-orange-500 font-black animate-bounce inline-flex items-center gap-1">
              🔥 ${this.state.combo} 連続正解！
            </span>
          ` : ''}
        </div>

        <!-- 問題カード -->
        <div class="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-7 border-2 border-slate-200 dark:border-slate-700 shadow-md space-y-4">
          <div class="text-xs sm:text-sm font-bold text-indigo-600 dark:text-indigo-400">
            ${q.prompt}
          </div>

          <div class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-relaxed cyrillic-text py-2">
            ${q.question}
          </div>
        </div>

        <!-- 回答入力または解説エリア -->
        ${inputAreaHTML}

      </div>
    `;

    // イベントバインド
    const btnBack = this.container.querySelector('.btn-back-to-lessons');
    if (btnBack) {
      btnBack.addEventListener('click', () => {
        if (confirm('学習を中断して課一覧に戻りますか？')) {
          this.state.view = 'lesson_select';
          this.renderLessonSelect();
        }
      });
    }

    if (this.state.isAnswered) {
      const btnNext = this.container.querySelector('.btn-next-quiz');
      if (btnNext) {
        btnNext.addEventListener('click', () => {
          if (this.state.currentIndex + 1 < this.state.quizzes.length) {
            this.initQuiz(this.state.currentIndex + 1);
            this.renderQuiz();
          } else {
            this.finishSession();
          }
        });
      }

      const btnAudio = this.container.querySelector('.btn-play-answer-audio');
      if (btnAudio) {
        btnAudio.addEventListener('click', () => {
          const speakText = q.correctAnswer || q.question.replace(/\[____\]/g, q.correctAnswer);
          SpeechService.speak(speakText);
        });
      }
    } else if (hasOptions && !isInput) {
      this.container.querySelectorAll('.btn-option').forEach(btn => {
        btn.addEventListener('click', () => {
          const ans = btn.getAttribute('data-answer');
          this.handleAnswer(ans);
        });
      });
    } else {
      const inputField = this.container.querySelector('.quiz-input-field');
      const btnSubmit = this.container.querySelector('.btn-submit-input');
      this.activeInput = inputField;

      if (inputField) {
        inputField.focus();
        inputField.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            this.handleAnswer(inputField.value);
          }
        });
      }

      if (btnSubmit && inputField) {
        btnSubmit.addEventListener('click', () => {
          this.handleAnswer(inputField.value);
        });
      }

      // キリル文字パレット
      this.container.querySelectorAll('.btn-insert-char').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const char = btn.getAttribute('data-char');
          if (inputField && char) {
            const start = inputField.selectionStart || inputField.value.length;
            const end = inputField.selectionEnd || inputField.value.length;
            const val = inputField.value;
            inputField.value = val.substring(0, start) + char + val.substring(end);
            inputField.selectionStart = inputField.selectionEnd = start + char.length;
            inputField.focus();
          }
        });
      });
    }
  }

  // ==========================================
  // 4. 解答判定
  // ==========================================
  static handleAnswer(answer) {
    const q = this.state.currentQuiz;
    if (!q || this.state.isAnswered) return;

    const trimmedUser = (answer || '').trim();
    const cleanUser = trimmedUser.toLowerCase().replace(/[.,!?\s]/g, '');
    const cleanCorrect = (q.correctAnswer || '').toLowerCase().replace(/[.,!?\s]/g, '');

    let isCorrect = (cleanUser === cleanCorrect);
    if (!isCorrect && Array.isArray(q.acceptableAnswers)) {
      isCorrect = q.acceptableAnswers.some(ans => cleanUser === ans.toLowerCase().replace(/[.,!?\s]/g, ''));
    }

    this.state.userAnswer = trimmedUser;
    this.state.isAnswered = true;
    this.state.isCorrect = isCorrect;

    if (isCorrect) {
      SoundEffects.playCorrect();
      this.state.score += 10;
      this.state.xpEarned += 5;
      this.state.combo += 1;
      if (this.state.combo > this.state.maxCombo) {
        this.state.maxCombo = this.state.combo;
      }
      try {
        if (typeof GamificationService !== 'undefined' && GamificationService.addXp) {
          GamificationService.addXp(5);
        }
      } catch (_) {}
    } else {
      SoundEffects.playWrong();
      this.state.combo = 0;
      this.state.xpEarned += 1;
      try {
        if (typeof GamificationService !== 'undefined' && GamificationService.addXp) {
          GamificationService.addXp(1);
        }
      } catch (_) {}

      // 間違いノートに自動記録
      try {
        StorageService.recordMistake({
          question: `【第${q.lessonNumber}課 練習ノート】${q.question}`,
          userAnswer: trimmedUser || '（未入力）',
          correctAnswer: q.correctAnswer,
          type: 'grammar',
          category: `練習ノート 第${q.lessonNumber}課`,
          explanation: q.explanation
        });
      } catch (_) {}
    }

    this.state.results.push({
      quiz: q,
      userAnswer: trimmedUser,
      isCorrect: isCorrect
    });

    this.renderQuiz();
  }

  // ==========================================
  // 5. 結果発表画面
  // ==========================================
  static finishSession() {
    this.state.view = 'result';
    this.renderResult();
  }

  static renderResult() {
    const total = this.state.results.length;
    const correctCount = this.state.results.filter(r => r.isCorrect).length;
    const accuracy = total > 0 ? Math.round((correctCount / total) * 100) : 0;

    const listHTML = this.state.results.map((r, idx) => `
      <div class="p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 ${r.isCorrect ? 'border-emerald-200 dark:border-emerald-900/60' : 'border-rose-200 dark:border-rose-900/60'} space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-slate-500">
            問題 ${idx + 1} ｜ 第${r.quiz.lessonNumber}課
          </span>
          <span class="px-2.5 py-0.5 rounded-full ${r.isCorrect ? 'bg-emerald-100 text-emerald-800 font-black' : 'bg-rose-100 text-rose-800 font-black'} text-xs">
            ${r.isCorrect ? '⭕ 正解' : '❌ 不正解'}
          </span>
        </div>
        <div class="font-black text-slate-900 dark:text-white text-sm cyrillic-text">
          ${r.quiz.question}
        </div>
        <div class="text-xs space-y-1">
          <div class="text-slate-600 dark:text-slate-300">
            あなたの回答: <strong class="${r.isCorrect ? 'text-emerald-600' : 'text-rose-600'}">${r.userAnswer || '（未入力）'}</strong>
          </div>
          ${!r.isCorrect ? `
            <div class="text-indigo-600 dark:text-indigo-400 font-bold">
              模範解答: ${r.quiz.correctAnswer}
            </div>
          ` : ''}
        </div>
        <div class="p-2.5 rounded-xl bg-amber-50 dark:bg-slate-900 border border-amber-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 whitespace-pre-line font-medium leading-relaxed">
          ${r.quiz.explanation}
        </div>
      </div>
    `).join('');

    this.container.innerHTML = `
      <div class="animate-fade-in max-w-2xl mx-auto px-4 py-6 space-y-6">
        
        <!-- サマリーカード -->
        <div class="bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl text-center space-y-4">
          <div class="text-4xl">🎉</div>
          <h2 class="text-2xl sm:text-3xl font-black">
            練習ノート完了！
          </h2>
          <div class="grid grid-cols-3 gap-3 pt-2 max-w-md mx-auto text-center">
            <div class="p-3 rounded-2xl bg-white/20 backdrop-blur-md">
              <div class="text-2xl font-black">${correctCount}/${total}</div>
              <div class="text-[11px] text-indigo-100 font-bold">正解数</div>
            </div>
            <div class="p-3 rounded-2xl bg-white/20 backdrop-blur-md">
              <div class="text-2xl font-black">${accuracy}%</div>
              <div class="text-[11px] text-indigo-100 font-bold">正解率</div>
            </div>
            <div class="p-3 rounded-2xl bg-white/20 backdrop-blur-md">
              <div class="text-2xl font-black">+${this.state.xpEarned}</div>
              <div class="text-[11px] text-indigo-100 font-bold">獲得XP</div>
            </div>
          </div>
        </div>

        <!-- アクションボタン -->
        <div class="flex flex-wrap gap-3 justify-center">
          <button type="button" class="btn-retry-session px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-2">
            <span>🔄</span> もう一度挑戦
          </button>
          <button type="button" class="btn-back-to-menu px-6 py-3 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 hover:bg-slate-100 text-slate-800 dark:text-slate-200 font-black text-sm shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-2">
            <span>📚</span> 課の選択に戻る
          </button>
        </div>

        <!-- 振り返りリスト -->
        <div class="space-y-3 pt-2">
          <h3 class="font-black text-slate-900 dark:text-white text-base flex items-center gap-2">
            <span>📝</span> 解答と全問解説
          </h3>
          <div class="space-y-3">
            ${listHTML}
          </div>
        </div>

      </div>
    `;

    // イベントバインド
    const btnRetry = this.container.querySelector('.btn-retry-session');
    if (btnRetry) {
      btnRetry.addEventListener('click', () => {
        this.startSession(this.state.selectedLesson);
      });
    }

    const btnMenu = this.container.querySelector('.btn-back-to-menu');
    if (btnMenu) {
      btnMenu.addEventListener('click', () => {
        this.state.view = 'lesson_select';
        this.renderLessonSelect();
      });
    }
  }
}

if (typeof window !== 'undefined') {
  window.ExerciseNotebookTestComponent = ExerciseNotebookTestComponent;
}
