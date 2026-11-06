// 格変化・動詞活用専用テストコンポーネント
import { StorageService } from '../services/storage.js';
import { SpeechService } from '../services/speech.js';
import { CyrillicKeyboard } from './CyrillicKeyboard.js';
import { isFuzzyMatch, getWordGrammarDetails, renderGrammarExplanationHTML, shuffleArray, SoundEffects, SPECIAL_CYRILLIC_BAR } from '../utils/helpers.js';
import { GamificationService } from '../services/gamification.js';
import { PenguinMascot } from './PenguinMascot.js';

export class DeclensionTestComponent {
  static state = {
    view: 'settings', // 'settings' | 'testing' | 'result'
    settings: {
      category: 'all', // 'all' | 'noun' | 'verb'
      inputMode: 'choice', // 'choice' | 'text'
      count: 10
    },
    quizzes: [],
    currentIndex: 0,
    currentQuiz: null,
    userAnswer: '',
    hasAnswered: false,
    isCorrect: false,
    results: []
  };

  static render(container, onNavigate) {
    this.container = container;
    this.onNavigate = onNavigate;

    if (this.state.view === 'settings') {
      this.renderSettings();
    } else if (this.state.view === 'testing') {
      this.renderTesting();
    } else if (this.state.view === 'result') {
      this.renderResult();
    }
  }

  static startWithCategory(category = 'hidden_n_g') {
    this.state.settings.category = category;
    this.state.settings.count = 'all';
    this.startTest();
  }

  // --- 1. 設定画面 ---
  static renderSettings() {
    this.container.innerHTML = `
      <div class="animate-fade-in max-w-xl mx-auto px-4 py-4 space-y-5">
        <div class="flex items-center justify-between border-b border-slate-200 pb-3">
          <div class="flex items-center gap-2">
            <span class="text-2xl">⚡</span>
            <h2 class="text-lg font-bold text-slate-800">格変化・動詞活用テスト</h2>
          </div>
          <button type="button" id="btn-back-home" class="text-xs text-slate-500 hover:text-slate-800">
            ✕ ホームへ
          </button>
        </div>

        <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          
          <!-- テスト対象 -->
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1.5">学習カテゴリー</label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <label class="flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer hover:bg-slate-50 ${this.state.settings.category === 'hidden_n_g' ? 'border-amber-600 bg-amber-50 text-amber-900 font-bold shadow-2xs' : 'border-slate-200'}">
                <input type="radio" name="declensionCategory" value="hidden_n_g" ${this.state.settings.category === 'hidden_n_g' ? 'checked' : ''} class="hidden">
                <span>🌟 隠れн・隠れг特化（32問）</span>
              </label>

              <label class="flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer hover:bg-slate-50 ${this.state.settings.category === 'all' ? 'border-amber-600 bg-amber-50 text-amber-900 font-bold' : 'border-slate-200'}">
                <input type="radio" name="declensionCategory" value="all" ${this.state.settings.category === 'all' ? 'checked' : ''} class="hidden">
                <span>⚡ すべて（全48問）</span>
              </label>

              <label class="flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer hover:bg-slate-50 ${this.state.settings.category === 'noun' ? 'border-amber-600 bg-amber-50 text-amber-900 font-bold' : 'border-slate-200'}">
                <input type="radio" name="declensionCategory" value="noun" ${this.state.settings.category === 'noun' ? 'checked' : ''} class="hidden">
                <span>🏛 名詞の7格変化</span>
              </label>

              <label class="flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer hover:bg-slate-50 ${this.state.settings.category === 'verb' ? 'border-amber-600 bg-amber-50 text-amber-900 font-bold' : 'border-slate-200'}">
                <input type="radio" name="declensionCategory" value="verb" ${this.state.settings.category === 'verb' ? 'checked' : ''} class="hidden">
                <span>🔄 動詞の活用ドリル</span>
              </label>
            </div>
          </div>

          <!-- 解答方式 -->
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1.5">回答方式</label>
            <div class="grid grid-cols-2 gap-2 text-xs">
              <label class="flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer hover:bg-slate-50 ${this.state.settings.inputMode === 'choice' ? 'border-amber-600 bg-amber-50 text-amber-900 font-bold' : 'border-slate-200'}">
                <input type="radio" name="inputMode" value="choice" ${this.state.settings.inputMode === 'choice' ? 'checked' : ''} class="hidden">
                <span>🎯 選択式（4択）</span>
              </label>

              <label class="flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer hover:bg-slate-50 ${this.state.settings.inputMode === 'text' ? 'border-amber-600 bg-amber-50 text-amber-900 font-bold' : 'border-slate-200'}">
                <input type="radio" name="inputMode" value="text" ${this.state.settings.inputMode === 'text' ? 'checked' : ''} class="hidden">
                <span>✍️ キリル文字記述式</span>
              </label>
            </div>
          </div>

          <!-- 出題数 -->
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1.5">出題数</label>
            <div class="grid grid-cols-4 gap-2">
              ${[5, 10, 20, 'all'].map(num => `
                <button type="button" class="btn-count py-2 text-xs font-bold rounded-lg border transition-all ${
                  this.state.settings.count === num ? 'bg-amber-600 text-white border-amber-600 shadow-xs' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }" data-count="${num}">
                  ${num === 'all' ? '全問' : `${num}問`}
                </button>
              `).join('')}
            </div>
          </div>

          <button type="button" id="btn-start-declension" class="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-md transition-all active:scale-98 text-sm mt-2 flex items-center justify-center gap-2">
            <span>⚡</span> 特化テストを開始する
          </button>
        </div>
      </div>
    `;

    this.container.querySelector('#btn-back-home').addEventListener('click', () => {
      if (this.onNavigate) this.onNavigate('home');
    });

    this.container.querySelectorAll('input[name="declensionCategory"]').forEach(r => {
      r.addEventListener('change', (e) => {
        this.state.settings.category = e.target.value;
        this.renderSettings();
      });
    });

    this.container.querySelectorAll('input[name="inputMode"]').forEach(r => {
      r.addEventListener('change', (e) => {
        this.state.settings.inputMode = e.target.value;
        this.renderSettings();
      });
    });

    this.container.querySelectorAll('.btn-count').forEach(btn => {
      btn.addEventListener('click', () => {
        const c = btn.getAttribute('data-count');
        this.state.settings.count = c === 'all' ? 'all' : parseInt(c, 10);
        this.renderSettings();
      });
    });

    this.container.querySelector('#btn-start-declension').addEventListener('click', () => {
      this.startTest();
    });
  }

  // --- 2. 開始 ---
  static startTest() {
    let list = [...StorageService.getDeclensionQuizzes()];

    if (this.state.settings.category !== 'all') {
      list = list.filter(q => q.kind === this.state.settings.category);
    }

    if (list.length === 0) {
      alert('問題がありません。');
      return;
    }

    list = shuffleArray(list);
    GamificationService.resetSessionCombo();
    this.state.sessionScore = 0;
    this.state.sessionXp = 0;
    this.state.lastGameFeedback = null;
    this.state.sessionResult = null;

    const count = this.state.settings.count === 'all' ? list.length : Math.min(this.state.settings.count, list.length);
    this.state.quizzes = list.slice(0, count);
    this.state.currentIndex = 0;
    this.state.results = [];
    this.state.resultFilter = 'all';
    this.state.view = 'testing';
    this.loadQuiz(0);
  }

  static loadQuiz(index) {
    this.state.currentIndex = index;
    const q = this.state.quizzes[index];
    this.state.currentQuiz = q;
    this.state.userAnswer = '';
    this.state.hasAnswered = false;
    this.state.isCorrect = false;

    // 選択肢のシャッフル
    if (q.options) {
      this.state.shuffledOptions = shuffleArray([...q.options]);
    }

    this.renderTesting();
  }

  // --- 3. テスト実行中 ---
  static renderTesting() {
    const q = this.state.currentQuiz;
    const idx = this.state.currentIndex;
    const total = this.state.quizzes.length;
    const progressPercent = Math.round(((idx) / total) * 100);
    const isNoun = q.kind === 'noun';

    this.container.innerHTML = `
      <div class="animate-fade-in max-w-xl mx-auto px-4 py-3 space-y-3">
        
        <!-- プログレスバー ＆ ゲームHUD -->
        <div class="space-y-1.5">
          <div class="flex justify-between items-center text-xs font-bold text-slate-500">
            <span class="flex items-center gap-2">
              <span>活用・格変化 ${idx + 1} / ${total}</span>
              ${GamificationService.sessionCombo >= 2 ? `
                <span class="px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200 animate-bounce text-[10px]">
                  🔥 ${GamificationService.sessionCombo} COMBO
                </span>
              ` : ''}
              <span class="text-[10px] px-2 py-0.5 rounded-full ${isNoun ? 'bg-sky-50 text-sky-700 border-sky-200' : 'bg-amber-50 text-amber-700 border-amber-200'} border">
                ${isNoun ? `🏛 名詞: ${q.targetCase}` : `🔄 動詞活用: ${q.targetForm}`}
              </span>
            </span>
            <div class="flex items-center gap-3">
              <span class="text-amber-600 font-extrabold">+${this.state.sessionScore || 0} PTS</span>
              <span class="text-amber-700 font-extrabold">+${this.state.sessionXp || 0} XP</span>
              <button type="button" id="btn-quit-declension" class="text-slate-400 hover:text-slate-700 ml-1">中断</button>
            </div>
          </div>
          <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div class="bg-amber-500 h-full transition-all duration-300" style="width: ${progressPercent}%"></div>
          </div>
        </div>

        <!-- 問題カード -->
        <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm text-center relative overflow-hidden">
          <div class="text-xs font-bold text-slate-400 mb-1">${q.prompt}</div>
          
          <div class="text-2xl sm:text-3xl font-extrabold text-slate-800 my-2 tracking-tight cyrillic-text">
            ${q.question}
          </div>

          <div class="text-xs text-slate-500 font-medium">
            基本形: <span class="font-bold text-slate-700 cyrillic-text">${q.baseWord}</span>（${q.baseMeaning}）
            ${q.root ? ` / 語幹: <span class="font-bold text-emerald-700 cyrillic-text">${q.root}</span>` : ''}
          </div>
        </div>

        <!-- 回答エリア -->
        ${!this.state.hasAnswered ? `
          <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
            ${this.state.settings.inputMode === 'choice' && this.state.shuffledOptions ? `
              <!-- 4択選択 -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                ${this.state.shuffledOptions.map((opt, i) => `
                  <button type="button" class="btn-decl-choice text-left p-3.5 rounded-xl border border-slate-200 hover:border-amber-500 hover:bg-amber-50/50 text-slate-800 font-bold text-sm transition-all active:scale-98 flex items-center justify-between cyrillic-text" data-val="${opt}">
                    <span><span class="inline-block w-5 text-slate-400 font-normal">${i + 1}.</span> ${opt}</span>
                    <span class="text-xs text-slate-400">選択</span>
                  </button>
                `).join('')}
              </div>
            ` : `
              <!-- 記述入力 -->
              <div class="space-y-2">
                <input type="text" id="input-decl-answer" 
                  class="w-full text-base sm:text-lg p-3 rounded-xl border-2 border-slate-300 focus:border-amber-500 focus:outline-hidden text-center font-bold text-slate-800 cyrillic-text cyrillic-input" 
                  placeholder="変化した形を入力..." 
                  data-cyrillic="true"
                  autofocus autocomplete="off">

                <!-- キリル文字クイックバー -->
                <div class="flex items-center gap-1 overflow-x-auto py-1.5 scrollbar-none">
                  <span class="text-[11px] text-slate-400 shrink-0">タップで入力:</span>
                  ${SPECIAL_CYRILLIC_BAR.map(c => `
                    <button type="button" class="btn-quick-char px-2 py-1 text-xs font-bold bg-slate-100 hover:bg-amber-100 text-slate-700 rounded border border-slate-200 shrink-0" data-char="${c}">
                      ${c}
                    </button>
                  `).join('')}
                </div>

                <button type="button" id="btn-submit-decl-text" class="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-md transition-all active:scale-98 text-sm mt-2">
                  回答する（Enter）
                </button>
              </div>
            `}
          </div>
        ` : `
          <!-- 回答後フィードバック・解説 -->
          <div class="animate-fade-in space-y-4">
            <div class="p-5 rounded-2xl border ${this.state.isCorrect ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950' : 'bg-rose-50/90 border-rose-300 text-rose-950'} shadow-sm">
              <div class="text-2xl font-bold mb-2 ${this.state.isCorrect ? 'text-emerald-800' : 'text-rose-800'}">
                ${this.state.isCorrect ? '⭕ 正解！' : '❌ 不正解'}
              </div>

              <!-- 6項目完全網羅解説カード（辞書形・語幹・意味・過程の明確化） -->
              ${(() => {
                const cleanRoot = q.root ? q.root.replace(/-/g, '').trim() : '';
                const itemData = q.kind === 'verb' ? {
                  dictForm: q.baseWord,
                  baseWord: q.baseWord,
                  root: cleanRoot,
                  meaning: q.baseMeaning,
                  baseMeaning: q.baseMeaning,
                  japanese: q.baseMeaning,
                  isVerb: true,
                  derivation: `語幹「${cleanRoot}」に活用語尾が接続し、${q.targetForm || '活用形'}「${q.answer}」が形成されます。`
                } : {
                  dictForm: q.baseWord,
                  baseWord: q.baseWord,
                  root: '',
                  meaning: q.baseMeaning,
                  baseMeaning: q.baseMeaning,
                  japanese: q.baseMeaning,
                  isVerb: false,
                  derivation: `${q.targetCase || '格変化'}: 「${q.baseWord}」に格語尾が接続して「${q.answer}」となります。`
                };
                return renderGrammarExplanationHTML({
                  correctAnswer: q.answer,
                  userAnswer: this.state.userAnswer,
                  isCorrect: this.state.isCorrect,
                  item: itemData,
                  grammarExplanation: q.explanation,
                  rule: q.rule,
                  isVerbQuestion: q.kind === 'verb'
                });
              })()}
            </div>

            <button type="button" id="btn-next-declension" class="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-md transition-all active:scale-98 text-sm flex items-center justify-center gap-1">
              <span>${idx + 1 < total ? '次の問題へ（Enter） →' : '結果を見る 🎉'}</span>
            </button>
          </div>
        `}
      </div>
    `;

    this.bindTestingEvents();
  }

  static bindTestingEvents() {
    const quitBtn = this.container.querySelector('#btn-quit-declension');
    if (quitBtn) {
      quitBtn.addEventListener('click', () => {
        if (confirm('テストを中断しますか？')) {
          this.state.view = 'settings';
          this.renderSettings();
        }
      });
    }

    if (!this.state.hasAnswered) {
      if (this.state.settings.inputMode === 'choice') {
        this.container.querySelectorAll('.btn-decl-choice').forEach(btn => {
          btn.addEventListener('click', () => {
            const val = btn.getAttribute('data-val');
            this.checkAnswer(val);
          });
        });
      } else {
        const input = this.container.querySelector('#input-decl-answer');
        const submitBtn = this.container.querySelector('#btn-submit-decl-text');

        if (input) {
          input.focus();
          CyrillicKeyboard.setActiveInput(input);
          input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              this.checkAnswer(input.value);
            }
          });
        }

        if (submitBtn) {
          submitBtn.addEventListener('click', () => {
            if (input) this.checkAnswer(input.value);
          });
        }

        this.container.querySelectorAll('.btn-quick-char').forEach(btn => {
          btn.addEventListener('click', () => {
            const char = btn.getAttribute('data-char');
            CyrillicKeyboard.insertChar(char);
          });
        });
      }
    } else {
      const nextBtn = this.container.querySelector('#btn-next-declension');
      if (nextBtn) {
        nextBtn.focus();
        nextBtn.addEventListener('click', () => {
          this.goNext();
        });

        const keyHandler = (e) => {
          if (e.key === 'Enter') {
            window.removeEventListener('keydown', keyHandler);
            this.goNext();
          }
        };
        window.addEventListener('keydown', keyHandler);
      }
    }
  }

  static checkAnswer(userAns) {
    const q = this.state.currentQuiz;
    const isCorrect = isFuzzyMatch(userAns, q.answer);

    this.state.hasAnswered = true;
    this.state.userAnswer = userAns;
    this.state.isCorrect = isCorrect;

    if (isCorrect) {
      SoundEffects.playCorrect();
    } else {
      SoundEffects.playWrong();
      StorageService.recordMistake({
        question: `【${q.kind === 'noun' ? '格変化' : '動詞活用'}】${q.question}`,
        userAnswer: userAns || '(未回答)',
        correctAnswer: q.answer,
        type: 'declension',
        category: q.kind === 'noun' ? q.targetCase : q.targetForm,
        explanation: `${q.explanation} (${q.rule || ''})`
      });
    }

    // 共通ゲーミフィケーション集計（コンボ・スコア・XP・ペンギンリアクション）
    const feedback = GamificationService.recordAnswer({ isCorrect, testType: 'declension' });
    this.state.sessionScore = (this.state.sessionScore || 0) + feedback.scoreGained;
    this.state.sessionXp = (this.state.sessionXp || 0) + feedback.xpGained;
    this.state.lastGameFeedback = feedback;

    this.state.results.push({
      quiz: q,
      userAnswer: userAns,
      isCorrect: isCorrect
    });

    this.renderTesting();
  }

  static goNext() {
    if (this.state.currentIndex + 1 < this.state.quizzes.length) {
      this.loadQuiz(this.state.currentIndex + 1);
    } else {
      const total = this.state.quizzes.length;
      const correct = this.state.results.filter(r => r.isCorrect).length;
      const wrong = total - correct;
      StorageService.recordHistory({
        type: 'declension',
        total: total,
        correct: correct,
        category: this.state.settings.category
      });

      // 共通ゲームセッション完了処理
      const sessionResult = GamificationService.finishSession({
        testType: 'declension',
        testTitle: '活用・格変化テスト',
        correctCount: correct,
        wrongCount: wrong,
        sessionScore: this.state.sessionScore || 0,
        sessionXp: this.state.sessionXp || 0
      });
      this.state.sessionResult = sessionResult;

      this.state.view = 'result';
      this.renderResult();

      // レベルアップ・ペンギン進化・新称号の祝福モーダル
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

  // --- 4. 結果画面 ---
  static renderResult() {
    const total = this.state.quizzes.length;
    const correct = this.state.results.filter(r => r.isCorrect).length;
    const wrong = total - correct;
    const percent = total > 0 ? Math.round((correct / total) * 100) : 0;
    const currentFilter = this.state.resultFilter || 'all';

    const filteredResults = this.state.results.filter(r => {
      if (currentFilter === 'correct') return r.isCorrect;
      if (currentFilter === 'wrong') return !r.isCorrect;
      return true;
    });

    const sessionRes = this.state.sessionResult || GamificationService.finishSession({
      testType: 'declension',
      testTitle: '活用・格変化テスト',
      correctCount: correct,
      wrongCount: wrong,
      sessionScore: this.state.sessionScore || 0,
      sessionXp: this.state.sessionXp || 0
    });

    this.container.innerHTML = `
      <div class="animate-fade-in max-w-xl mx-auto px-4 py-4 space-y-4">
        
        <!-- ゲームリザルト ＆ Оцон шувууフィードバック -->
        ${GamificationService.renderGameResultCard({
          testTitle: '活用・格変化テスト',
          correctCount: correct,
          wrongCount: wrong,
          scoreEarned: this.state.sessionScore || 0,
          xpEarned: this.state.sessionXp || 0,
          maxCombo: sessionRes.maxCombo || 0,
          sessionResult: sessionRes
        })}

        <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-md text-center space-y-3">
          <div class="flex items-center justify-between text-xs text-slate-500 font-bold px-2">
            <span>活用・格変化テスト総評</span>
            <span>正解率: ${percent}% (${correct}/${total}問)</span>
          </div>

          <div class="flex gap-2">
            <button type="button" id="btn-retry-declension" class="flex-1 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs sm:text-sm transition-all active:scale-98 shadow-xs cursor-pointer">
              もう一度解く
            </button>
            <button type="button" id="btn-result-home" class="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs sm:text-sm transition-all cursor-pointer">
              ホームへ戻る
            </button>
          </div>
        </div>

        <!-- 出題問題の一覧・復習（正解・不正解フィルター切り替え） -->
        <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
            <h3 class="text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
              <span>📋</span> 出題問題の一覧・復習 (${total}問)
            </h3>
            <div class="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold self-start sm:self-auto">
              <button type="button" class="filter-decl-result-btn px-2.5 py-1 rounded-lg transition-all cursor-pointer ${currentFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs font-black' : 'text-slate-500 hover:text-slate-800'}" data-filter="all">
                すべて (${total})
              </button>
              <button type="button" class="filter-decl-result-btn px-2.5 py-1 rounded-lg transition-all cursor-pointer ${currentFilter === 'correct' ? 'bg-emerald-600 text-white shadow-2xs font-black' : 'text-slate-500 hover:text-emerald-700'}" data-filter="correct">
                ⭕ 正解 (${correct})
              </button>
              <button type="button" class="filter-decl-result-btn px-2.5 py-1 rounded-lg transition-all cursor-pointer ${currentFilter === 'wrong' ? 'bg-rose-600 text-white shadow-2xs font-black' : 'text-slate-500 hover:text-rose-700'}" data-filter="wrong">
                ❌ 不正解 (${wrong})
              </button>
            </div>
          </div>

          ${filteredResults.length === 0 ? `
            <div class="text-center py-6 text-xs text-slate-400">
              該当する問題はありません。
            </div>
          ` : `
            <div class="divide-y divide-slate-100 max-h-96 overflow-y-auto pr-1">
              ${filteredResults.map(r => `
                <div class="py-3 space-y-1.5 text-xs">
                  <div class="flex items-center justify-between gap-2">
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${r.isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}">
                      ${r.isCorrect ? '⭕ 正解' : '❌ 不正解'}
                    </span>
                    ${/[\u0400-\u04FF]/.test(r.quiz.answer) ? `
                      <button type="button" class="btn-speak-decl-result text-slate-400 hover:text-amber-700 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer" data-word="${r.quiz.answer}" title="正解の発音を聞く">
                        🔊
                      </button>
                    ` : ''}
                  </div>
                  <div class="font-bold text-slate-900 text-xs sm:text-sm">${r.quiz.question}</div>
                  <div>正解: <span class="font-bold text-amber-800 cyrillic-text">${r.quiz.answer}</span></div>
                  ${!r.isCorrect ? `
                    <div class="text-slate-500">
                      あなたの回答: <span class="line-through text-rose-600 font-medium">${r.userAnswer || '(無回答)'}</span>
                    </div>
                  ` : `
                    ${r.userAnswer ? `<div class="text-slate-500">あなたの回答: <span class="text-emerald-700 font-bold">${r.userAnswer}</span> ✅</div>` : ''}
                  `}
                  ${r.quiz.explanation ? `<div class="text-slate-600 bg-slate-50 p-2 rounded-xl text-[11px] leading-relaxed">${r.quiz.explanation}</div>` : ''}
                </div>
              `).join('')}
            </div>
          `}
        </div>
      </div>
    `;

    // フィルターボタンイベント
    this.container.querySelectorAll('.filter-decl-result-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.state.resultFilter = btn.getAttribute('data-filter');
        this.renderResult();
      });
    });

    // 音声再生
    this.container.querySelectorAll('.btn-speak-decl-result').forEach(btn => {
      btn.addEventListener('click', () => {
        const word = btn.getAttribute('data-word');
        if (word) SpeechService.speakMongolian(word);
      });
    });

    this.container.querySelector('#btn-retry-declension').addEventListener('click', () => {
      this.startTest();
    });

    this.container.querySelector('#btn-result-home').addEventListener('click', () => {
      if (this.onNavigate) this.onNavigate('home');
    });
  }
}
