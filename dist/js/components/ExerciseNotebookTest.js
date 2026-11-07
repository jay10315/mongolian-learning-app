// 練習ノート問題集コンポーネント（全18課・1242問完全網羅・出題数選択・PC配列キーボード・4択対応）
import { StorageService } from '../services/storage.js';
import { SpeechService } from '../services/speech.js';
import { GamificationService } from '../services/gamification.js';
import { SoundEffects, shuffleArray, isFuzzyMatch, renderCyrillicInputAssistantHTML, bindCyrillicInputAssistant } from '../utils/helpers.js';
import { exerciseNotebookQuizzes } from '../data/exerciseNotebookQuizzes.js';

export class ExerciseNotebookTestComponent {
  static container = null;
  static onNavigate = null;
  static activeInput = null;

  static state = {
    view: 'lesson_select', // 'lesson_select' | 'quiz' | 'result'
    selectedLesson: 'all', // 'all' | 1 .. 18
    selectedCount: 10,     // 5 | 10 | 20 | 'all'
    quizzes: [],
    currentIndex: 0,
    currentQuiz: null,
    score: 0,
    xpEarned: 0,
    combo: 0,
    maxCombo: 0,
    userAnswer: '',
    selectedChoice: null,
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
  // 1. 課選択＆出題数設定画面
  // ==========================================
  static renderLessonSelect() {
    const lessons = exerciseNotebookQuizzes || [];
    const totalQuizCount = lessons.reduce((acc, l) => acc + (l.quizzes ? l.quizzes.length : 0), 0);

    const lessonCards = lessons.map(l => {
      const qCount = l.quizzes ? l.quizzes.length : 0;
      return `
        <div class="lesson-card bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-5 border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between" data-lesson="${l.lesson}">
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="px-2.5 py-0.5 rounded-full text-xs font-black bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                第${l.lesson}課
              </span>
              <span class="text-xs text-slate-500 dark:text-slate-400 font-bold">
                全${qCount}問
              </span>
            </div>
            <h4 class="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
              ${l.lessonTitle}
            </h4>
          </div>

          <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400">
            <span>この課を特訓する</span>
            <span class="group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </div>
      `;
    }).join('');

    this.container.innerHTML = `
      <div class="max-w-4xl mx-auto px-4 py-5 space-y-6 animate-fade-in">
        
        <!-- ヘッダー -->
        <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-4">
          <div class="flex items-center gap-3">
            <div class="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center text-2xl font-bold shadow-md">
              📓
            </div>
            <div>
              <h2 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                練習ノート問題集
                <span class="text-xs px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold">全18課・1,242問</span>
              </h2>
              <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                教材原本（МОНГОЛ ХЭЛНИЙ ДАСГАЛЫН ДЭВТЭР）の全練習問題を完全網羅
              </p>
            </div>
          </div>
          <button type="button" id="btn-back-home" class="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-600 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all cursor-pointer">
            ✕ ホームへ
          </button>
        </div>

        <!-- 出題設定パネル（出題数選択） -->
        <div class="bg-gradient-to-br from-indigo-50/70 to-purple-50/60 dark:from-slate-800 dark:to-slate-800/80 rounded-2xl p-4 sm:p-5 border border-indigo-200 dark:border-slate-700 shadow-xs space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <span>🎯</span> 1回のセッションの出題数を選択
            </span>
            <span class="text-xs text-slate-500 dark:text-slate-400 font-bold">選択中: ${this.state.selectedCount === 'all' ? '全問' : this.state.selectedCount + '問'}</span>
          </div>

          <div class="grid grid-cols-4 gap-2">
            ${[5, 10, 20, 'all'].map(countVal => {
              const isActive = this.state.selectedCount === countVal;
              const label = countVal === 'all' ? '全問' : `${countVal}問`;
              return `
                <button type="button" class="btn-select-count py-2.5 px-3 rounded-xl font-black text-xs sm:text-sm transition-all shadow-2xs active:scale-95 cursor-pointer ${isActive ? 'bg-indigo-600 text-white border-2 border-indigo-600 shadow-md' : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 hover:bg-slate-50'}" data-count="${countVal}">
                  ${label}
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <!-- 全課ランダム総合チャレンジ -->
        <div class="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 rounded-2xl p-5 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="space-y-1 text-center sm:text-left">
            <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-bold">
              <span>⚡</span> 実力診断モード
            </div>
            <h3 class="text-lg font-black">全18課からランダム総合テスト</h3>
            <p class="text-xs text-indigo-100 font-medium">全${totalQuizCount}問の中から選択した出題数で総合実力テストを実施します。</p>
          </div>
          <button type="button" id="btn-start-random-all" class="w-full sm:w-auto px-6 py-3 rounded-xl bg-white text-indigo-900 font-black text-sm shadow-md hover:bg-indigo-50 active:scale-95 transition-all cursor-pointer whitespace-nowrap">
            🚀 総合テストを開始
          </button>
        </div>

        <!-- 課一覧グリッド -->
        <div class="space-y-3">
          <h3 class="font-black text-slate-900 dark:text-white text-base flex items-center gap-2">
            <span>📚</span> 課を選んで集中特訓（全18課）
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            ${lessonCards}
          </div>
        </div>

      </div>
    `;

    // イベントバインド
    const btnHome = this.container.querySelector('#btn-back-home');
    if (btnHome) {
      btnHome.addEventListener('click', () => {
        if (this.onNavigate) this.onNavigate('home');
      });
    }

    // 出題数選択ボタン
    this.container.querySelectorAll('.btn-select-count').forEach(btn => {
      btn.addEventListener('click', () => {
        const c = btn.getAttribute('data-count');
        this.state.selectedCount = c === 'all' ? 'all' : parseInt(c, 10);
        this.renderLessonSelect();
      });
    });

    const btnRandomAll = this.container.querySelector('#btn-start-random-all');
    if (btnRandomAll) {
      btnRandomAll.addEventListener('click', () => {
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
      pool = shuffleArray(pool);
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

    // 出題数制限（5問, 10問, 20問, 全問）
    const targetCount = this.state.selectedCount;
    if (targetCount !== 'all' && typeof targetCount === 'number') {
      if (lessonChoice !== 'all') {
        // 特定の課の場合：ランダム抽出で指定数
        pool = shuffleArray(pool).slice(0, Math.min(targetCount, pool.length));
      } else {
        pool = pool.slice(0, Math.min(targetCount, pool.length));
      }
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
    this.state.currentQuiz = this.state.quizzes[index];
    this.state.userAnswer = '';
    this.state.selectedChoice = null;
    this.state.isAnswered = false;
    this.state.isCorrect = false;

    // 4択選択肢のシャッフル準備（choices または options に両対応）
    const q = this.state.currentQuiz;
    const rawList = q ? (q.choices || q.options) : null;
    if (q && q.exerciseType === 'choice' && Array.isArray(rawList) && rawList.length > 0) {
      q.shuffledChoices = shuffleArray([...rawList]);
    }
  }

  // ==========================================
  // 3. クイズ出題画面（4択 ＆ 記述式両対応）
  // ==========================================
  static renderQuiz() {
    const q = this.state.currentQuiz;
    const idx = this.state.currentIndex;
    const total = this.state.quizzes.length;
    const progress = Math.round(((idx + 1) / total) * 100);

    const isChoice = q.exerciseType === 'choice' && Array.isArray(q.shuffledChoices) && q.shuffledChoices.length > 0;

    let inputAreaHTML = '';

    if (isChoice) {
      // 4択選択肢ボタン
      const choiceButtons = q.shuffledChoices.map((c, cIdx) => {
        let btnClass = "bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:border-indigo-500 hover:bg-indigo-50/50";
        if (this.state.isAnswered) {
          if (c === q.correctAnswer) {
            btnClass = "bg-emerald-50 dark:bg-emerald-950/50 border-2 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold";
          } else if (c === this.state.selectedChoice && !this.state.isCorrect) {
            btnClass = "bg-rose-50 dark:bg-rose-950/50 border-2 border-rose-500 text-rose-900 dark:text-rose-200 line-through";
          } else {
            btnClass = "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-400 opacity-60";
          }
        }

        const labelLetter = String.fromCharCode(65 + cIdx);

        return `
          <button type="button" class="btn-choice-option w-full p-3.5 sm:p-4 rounded-2xl text-left font-bold text-sm sm:text-base flex items-start gap-3 transition-all shadow-xs active:scale-98 cursor-pointer ${btnClass}" data-choice="${c.replace(/"/g, '&quot;')}" ${this.state.isAnswered ? 'disabled' : ''}>
            <span class="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-black text-xs flex items-center justify-center shrink-0">
              ${labelLetter}
            </span>
            <span class="cyrillic-text leading-relaxed flex-1">${c}</span>
          </button>
        `;
      }).join('');

      inputAreaHTML = `
        <div class="space-y-2.5">
          <div class="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
            正しいと思う選択肢を1つ選んでタップしてください:
          </div>
          <div class="grid grid-cols-1 gap-2.5">
            ${choiceButtons}
          </div>
        </div>
      `;
    } else {
      // 記述式入力エリア（PC配列キーボード＆特有文字パレット統合）
      inputAreaHTML = `
        <div class="space-y-3">
          <div class="relative">
            <input type="text" id="input-exercise-answer" 
              class="w-full text-base sm:text-lg p-3.5 rounded-2xl border-2 border-slate-300 dark:border-slate-600 focus:border-indigo-600 focus:outline-hidden text-center font-bold text-slate-900 dark:text-white cyrillic-text bg-white dark:bg-slate-800 shadow-inner" 
              placeholder="キリル文字で解答を入力..." 
              value="${this.state.userAnswer}"
              data-cyrillic="true"
              autocomplete="off" 
              autocapitalize="none"
              spellcheck="false"
              ${this.state.isAnswered ? 'disabled' : ''}>
          </div>

          <!-- PC標準モンゴル語キーボード＆特有文字パレット（刷新版） -->
          ${!this.state.isAnswered ? renderCyrillicInputAssistantHTML('input-exercise-answer', true) : ''}

          ${!this.state.isAnswered ? `
            <div class="pt-2 flex justify-end">
              <button type="button" class="btn-submit-input px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold text-sm shadow-md active:scale-95 transition-all flex items-center gap-2 cursor-pointer">
                <span>回答する（Enter）</span>
                <span>✓</span>
              </button>
            </div>
          ` : ''}
        </div>
      `;
    }

    // 解答後フィードバック・解説エリア
    let feedbackHTML = '';
    if (this.state.isAnswered) {
      feedbackHTML = `
        <div class="animate-fade-in p-4 sm:p-5 rounded-2xl border-2 ${this.state.isCorrect ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100' : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-900 text-rose-950 dark:text-rose-100'} shadow-sm space-y-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-2xl">${this.state.isCorrect ? '🎉' : '❌'}</span>
              <h4 class="font-black text-base sm:text-lg">
                ${this.state.isCorrect ? '見事正解です！' : '惜しい！不正解です'}
              </h4>
            </div>
            <div class="text-xs font-bold px-2 py-0.5 rounded-full ${this.state.isCorrect ? 'bg-emerald-200 text-emerald-900' : 'bg-rose-200 text-rose-900'}">
              ${this.state.isCorrect ? `+10 PTS | +6 XP` : `+0 PTS`}
            </div>
          </div>

          <div class="text-xs sm:text-sm font-medium space-y-1 bg-white/70 dark:bg-slate-800/70 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700">
            <div><strong>あなたの回答:</strong> <span class="font-bold ${this.state.isCorrect ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'}">${this.state.userAnswer || this.state.selectedChoice || '（未入力）'}</span></div>
            <div><strong>正しい解答:</strong> <span class="font-extrabold text-indigo-700 dark:text-indigo-400 cyrillic-text">${q.correctAnswer}</span></div>
          </div>

          <!-- 詳細解説 -->
          <div class="text-xs leading-relaxed text-slate-700 dark:text-slate-300 bg-white/90 dark:bg-slate-800/90 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 whitespace-pre-wrap">
            <div class="font-bold text-slate-900 dark:text-white flex items-center gap-1 mb-1">
              <span>📖</span> 文法・語尾・正解の徹底解説:
            </div>
            ${q.explanation || '文法規則および語尾の接続形式を確認してください。'}
          </div>

          <div class="flex justify-end pt-1">
            <button type="button" class="btn-next-quiz px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs sm:text-sm shadow-md active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer">
              <span>${idx + 1 >= total ? '結果発表を見る' : '次の問題へ'}</span>
              <span>→</span>
            </button>
          </div>
        </div>
      `;
    }

    this.container.innerHTML = `
      <div class="max-w-2xl mx-auto px-4 py-4 space-y-4 animate-fade-in">
        
        <!-- ヘッダー・進捗バー -->
        <div class="space-y-1.5">
          <div class="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
            <span class="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
              <span>第${q.lessonNumber || this.state.selectedLesson}課</span>
              <span>•</span>
              <span>${q.exerciseName || '練習問題'}</span>
            </span>
            <div class="flex items-center gap-3">
              <span>問題 ${idx + 1} / ${total}</span>
              <button type="button" id="btn-quit-session" class="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer">中断</button>
            </div>
          </div>
          <div class="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
            <div class="bg-gradient-to-r from-indigo-500 to-purple-600 h-full transition-all duration-300" style="width: ${progress}%"></div>
          </div>
        </div>

        <!-- スコア・コンボ・XP情報 -->
        <div class="flex items-center justify-between text-xs font-black text-slate-600 dark:text-slate-300 px-1">
          <div class="flex items-center gap-2">
            <span class="text-amber-500">スコア: ${this.state.score} PTS</span>
            <span>|</span>
            <span class="text-emerald-500">+${this.state.xpEarned} XP</span>
          </div>
          ${this.state.combo > 1 ? `
            <span class="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-black animate-bounce">
              🔥 ${this.state.combo} 連続正解！
            </span>
          ` : ''}
        </div>

        <!-- 問題カード -->
        <div class="bg-white dark:bg-slate-800 rounded-3xl p-5 sm:p-7 border-2 border-indigo-100 dark:border-slate-700 shadow-sm space-y-4">
          <div class="text-xs sm:text-sm font-bold text-indigo-700 dark:text-indigo-300 leading-relaxed whitespace-pre-wrap">
            ${q.prompt || '指示に従って正しい解答を入力または選択してください。'}
          </div>

          <div class="text-lg sm:text-2xl font-black text-slate-900 dark:text-white cyrillic-text leading-relaxed tracking-wide">
            ${q.question}
          </div>

          <div class="pt-2">
            ${inputAreaHTML}
          </div>
        </div>

        <!-- フィードバック -->
        ${feedbackHTML}

      </div>
    `;

    this.bindQuizEvents();
  }

  // ==========================================
  // 4. イベントバインド
  // ==========================================
  static bindQuizEvents() {
    const q = this.state.currentQuiz;
    const isChoice = q.exerciseType === 'choice' && Array.isArray(q.shuffledChoices) && q.shuffledChoices.length > 0;

    // 中断ボタン
    const btnQuit = this.container.querySelector('#btn-quit-session');
    if (btnQuit) {
      btnQuit.addEventListener('click', () => {
        if (confirm('練習ノートを中断してメニューに戻りますか？')) {
          this.state.view = 'lesson_select';
          this.renderLessonSelect();
        }
      });
    }

    if (isChoice) {
      // 4択選択イベント
      this.container.querySelectorAll('.btn-choice-option').forEach(btn => {
        btn.addEventListener('click', () => {
          if (this.state.isAnswered) return;
          const choice = btn.getAttribute('data-choice');
          this.state.selectedChoice = choice;
          this.checkChoiceAnswer(choice);
        });
      });
    } else {
      // 記述式入力イベント
      const input = this.container.querySelector('#input-exercise-answer');
      if (input) {
        if (!this.state.isAnswered) {
          input.focus();
        }

        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' && !this.state.isAnswered) {
            e.preventDefault();
            this.state.userAnswer = input.value.trim();
            this.checkInputAnswer(this.state.userAnswer);
          }
        });

        input.addEventListener('input', (e) => {
          this.state.userAnswer = e.target.value;
        });

        // PC標準モンゴル語キーボード＆特有文字パレットのイベントバインド
        bindCyrillicInputAssistant(this.container, '#input-exercise-answer');
      }

      const btnSubmit = this.container.querySelector('.btn-submit-input');
      if (btnSubmit) {
        btnSubmit.addEventListener('click', () => {
          if (this.state.isAnswered) return;
          const val = input ? input.value.trim() : this.state.userAnswer;
          this.state.userAnswer = val;
          this.checkInputAnswer(val);
        });
      }
    }

    // 次へボタン
    const btnNext = this.container.querySelector('.btn-next-quiz');
    if (btnNext) {
      btnNext.addEventListener('click', () => {
        if (this.state.currentIndex + 1 >= this.state.quizzes.length) {
          this.state.view = 'result';
          this.renderResult();
        } else {
          this.initQuiz(this.state.currentIndex + 1);
          this.renderQuiz();
        }
      });
    }
  }

  // ==========================================
  // 5. 判定処理（柔軟な文法・スペル・別表現受容）
  // ==========================================
  static checkChoiceAnswer(choice) {
    const q = this.state.currentQuiz;
    const isCorrect = isFuzzyMatch(choice, q.correctAnswer);
    this.handleAnswerResult(isCorrect, choice);
  }

  static checkInputAnswer(val) {
    const q = this.state.currentQuiz;
    let isCorrect = false;

    // 許容回答一覧との照合（文法・スペルが合っている別表現を完全受容）
    if (q.acceptableAnswers && Array.isArray(q.acceptableAnswers)) {
      isCorrect = q.acceptableAnswers.some(ans => isFuzzyMatch(val, ans));
    }
    if (!isCorrect) {
      isCorrect = isFuzzyMatch(val, q.correctAnswer);
    }

    this.handleAnswerResult(isCorrect, val);
  }

  static handleAnswerResult(isCorrect, answeredVal) {
    this.state.isAnswered = true;
    this.state.isCorrect = isCorrect;

    const q = this.state.currentQuiz;

    if (isCorrect) {
      SoundEffects.playCorrect();
      this.state.combo += 1;
      if (this.state.combo > this.state.maxCombo) {
        this.state.maxCombo = this.state.combo;
      }
      this.state.score += 10;
      this.state.xpEarned += 6;
      GamificationService.addXP(6);
    } else {
      SoundEffects.playWrong();
      this.state.combo = 0;

      // 間違い帳に記録（復習ノートで再特訓可能）
      StorageService.recordMistake({
        type: 'exercise_notebook',
        question: q.question,
        prompt: q.prompt,
        correctAnswer: q.correctAnswer,
        userAnswer: answeredVal,
        explanation: q.explanation,
        lesson: q.lessonNumber
      });
    }

    this.state.results.push({
      quiz: q,
      userAnswer: answeredVal,
      isCorrect: isCorrect
    });

    this.renderQuiz();
  }

  // ==========================================
  // 6. 結果発表画面
  // ==========================================
  static renderResult() {
    const total = this.state.results.length;
    const correctCount = this.state.results.filter(r => r.isCorrect).length;
    const accuracy = total > 0 ? Math.round((correctCount / total) * 100) : 0;

    const listHTML = this.state.results.map((r, i) => `
      <div class="p-3.5 sm:p-4 rounded-xl border ${r.isCorrect ? 'bg-emerald-50/70 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800' : 'bg-rose-50/70 border-rose-200 dark:bg-rose-950/30 dark:border-rose-900'} space-y-1.5 text-xs sm:text-sm">
        <div class="flex items-center justify-between font-bold">
          <span class="text-slate-500">第${i+1}問 (${r.quiz.exerciseName || '練習問題'})</span>
          <span class="${r.isCorrect ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'}">${r.isCorrect ? '✓ 正解' : '✗ 不正解'}</span>
        </div>
        <div class="font-black text-slate-900 dark:text-white cyrillic-text">${r.quiz.question}</div>
        <div class="text-slate-600 dark:text-slate-400">
          あなたの回答: <span class="font-bold">${r.userAnswer || '（未入力）'}</span> ｜ 
          正解: <span class="font-bold text-indigo-700 dark:text-indigo-400 cyrillic-text">${r.quiz.correctAnswer}</span>
        </div>
      </div>
    `).join('');

    this.container.innerHTML = `
      <div class="max-w-xl mx-auto px-4 py-6 space-y-5 animate-fade-in">
        
        <div class="text-center space-y-2">
          <div class="text-4xl animate-bounce">${accuracy >= 80 ? '🏆' : (accuracy >= 50 ? '🌟' : '💪')}</div>
          <h2 class="text-2xl font-black text-slate-900 dark:text-white">練習ノートセッション完了！</h2>
          <p class="text-xs text-slate-500 dark:text-slate-400">お疲れ様でした！練習成果を確認しましょう。</p>
        </div>

        <div class="grid grid-cols-3 gap-3 text-center">
          <div class="p-3.5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
            <div class="text-xs text-slate-500 font-bold">正答率</div>
            <div class="text-xl sm:text-2xl font-black text-indigo-600 dark:text-indigo-400">${accuracy}%</div>
          </div>
          <div class="p-3.5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
            <div class="text-xs text-slate-500 font-bold">正解数</div>
            <div class="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">${correctCount} / ${total}</div>
          </div>
          <div class="p-3.5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
            <div class="text-xs text-slate-500 font-bold">最大コンボ</div>
            <div class="text-xl sm:text-2xl font-black text-amber-500">${this.state.maxCombo}</div>
          </div>
        </div>

        <div class="flex items-center gap-2 pt-2">
          <button type="button" class="btn-retry-session flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm rounded-xl shadow-md active:scale-95 transition-all cursor-pointer">
            🔄 もう一度特訓する
          </button>
          <button type="button" class="btn-back-to-menu flex-1 py-3 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-100 font-black text-sm rounded-xl transition-all cursor-pointer">
            📋 課選択へ戻る
          </button>
        </div>

        <div class="space-y-3 pt-3">
          <h3 class="font-black text-slate-900 dark:text-white text-base flex items-center gap-2">
            <span>📝</span> 解答と全問解説一覧
          </h3>
          <div class="space-y-2.5">
            ${listHTML}
          </div>
        </div>

      </div>
    `;

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
