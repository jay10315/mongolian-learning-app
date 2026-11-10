// 格変化・動詞活用専用テストコンポーネント
import { StorageService } from '../services/storage.js';
import { SpeechService } from '../services/speech.js';
import { CyrillicKeyboard } from './CyrillicKeyboard.js';
import { isFuzzyMatch, renderChoiceExplanationsHTML, getWordGrammarDetails, renderGrammarExplanationHTML, shuffleArray, SoundEffects, SPECIAL_CYRILLIC_BAR, scrollToQuizTop } from '../utils/helpers.js';
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
      if (!this.state.currentQuiz && this.state.quizzes && this.state.quizzes.length > 0) {
        this.loadQuiz(this.state.currentIndex || 0);
      } else if (!this.state.quizzes || !this.state.quizzes.length) {
        this.startTest();
      } else {
        this.renderTesting();
      }
    } else if (this.state.view === 'result') {
      this.renderResult();
    }
  }

  static startWithCategory(category = 'hidden_n_g') {
    this.state.settings.category = category;
    this.state.settings.count = 'all';
    this.state.view = 'testing';
    if (!this.container) {
      const mainContainer = document.getElementById('main-content');
      if (mainContainer) this.container = mainContainer;
    }
    this.startTest();
  }

  // --- 1. 設定画面 ---
  static renderSettings() {
    if (!this.container) return;
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

            <!-- 語尾道場への導線バナー -->
            <div class="mt-3 bg-gradient-to-r from-rose-50 to-amber-50 p-3 rounded-xl border border-rose-200 flex items-center justify-between text-xs">
              <div class="space-y-0.5">
                <span class="font-bold text-rose-900">⚡ 「г,р,сは -т」「н,м,в,лは бэ」などの語尾ルールを練習したい方へ</span>
                <p class="text-[11px] text-slate-500">直感反射で解く「助詞・語尾ルール特訓道場」もおすすめ！</p>
              </div>
              <button type="button" id="btn-goto-suffix-dojo" class="px-2.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold shrink-0 shadow-2xs">
                語尾道場へ ➜
              </button>
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

    const dojoBtn = this.container.querySelector('#btn-goto-suffix-dojo');
    if (dojoBtn) {
      dojoBtn.addEventListener('click', () => {
        if (this.onNavigate) this.onNavigate('suffix_dojo');
      });
    }
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
    if (!this.state.quizzes || !this.state.quizzes.length) return;
    this.state.currentIndex = index;
    scrollToQuizTop(this.container);
    const q = this.state.quizzes[index];
    this.state.currentQuiz = q;
    this.state.userAnswer = '';
    this.state.hasAnswered = false;
    this.state.isCorrect = false;

    // 選択肢のシャッフル
    if (q && q.options) {
      this.state.shuffledOptions = shuffleArray([...q.options]);
    }

    if (this.container) {
      this.renderTesting();
    }
  }

  // --- 3. テスト実行中 ---
  static renderTesting() {
    if (!this.container) return;
    const q = this.state.currentQuiz;
    if (!q) {
      if (this.state.quizzes && this.state.quizzes.length) {
        this.loadQuiz(this.state.currentIndex || 0);
      } else {
        this.renderSettings();
      }
      return;
    }
    const idx = this.state.currentIndex;
    const total = this.state.quizzes.length;
    const progressPercent = Math.round(((idx) / total) * 100);
    const isNoun = q.kind === 'noun' || q.kind === 'hidden_n_g' || q.type === 'declension' || !!q.targetCase;

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
              <span class="text-[10px] px-2 py-0.5 rounded-full ${isNoun ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800' : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'} border font-bold">
                ${isNoun ? `🏛 名詞格変化: ${q.targetCase || '格変化'}` : `🔄 動詞活用: ${q.targetForm || q.targetCase || '活用'}`}
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

          <!-- ヒントトグルボタン（他テストと同様にタップするまで隠す・ネタバレ防止） -->
          <div class="mt-2 text-center">
            <button type="button" id="btn-toggle-decl-hint" class="text-xs text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-200 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 px-3 py-1 rounded-full font-bold border border-slate-200 dark:border-slate-700 transition-all inline-flex items-center gap-1.5 cursor-pointer select-none active:scale-95 shadow-2xs">
              <span>💡</span>
              <span id="decl-hint-toggle-text">ヒントを見る ▼</span>
            </button>
            <div id="decl-hint-content" class="hidden mt-2 animate-fade-in text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/90 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-medium space-y-1 inline-block text-left max-w-sm">
              <div>基本形: <span class="font-bold text-slate-800 dark:text-slate-100 cyrillic-text">${q.baseWord}</span>（${q.baseMeaning}）</div>
              ${q.root ? `<div>語幹: <span class="font-bold text-emerald-700 dark:text-emerald-400 cyrillic-text">${q.root}</span></div>` : ''}
              ${q.rule ? `<div class="text-amber-800 dark:text-amber-300 font-bold">ルール: ${q.rule}</div>` : ''}
            </div>
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

                <!-- PC標準モンゴル語配列キーボード＆特有文字パレット -->
                <div class="mt-2">
                  ${renderCyrillicInputAssistantHTML('input-decl-answer', true)}
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
            <div class="p-5 rounded-2xl border ${this.state.isCorrect ? 'bg-emerald-50/90 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100' : 'bg-rose-50/90 dark:bg-rose-950/50 border-rose-300 dark:border-rose-800 text-rose-950 dark:text-rose-100'} shadow-sm">
              <div class="flex items-center justify-between mb-2">
                <div class="text-2xl font-bold ${this.state.isCorrect ? 'text-emerald-800 dark:text-emerald-300' : 'text-rose-800 dark:text-rose-300'}">
                  ${this.state.isCorrect ? '⭕ 正解！' : '❌ 不正解'}
                </div>
                ${(!this.state.isCorrect && this.state.settings.inputMode === 'text') ? `
                  <button type="button" id="btn-override-decl-correct" class="px-3 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700 text-xs font-black hover:bg-amber-200 transition-all cursor-pointer flex items-center gap-1" title="入力の表記ゆれや軽微なタイポの場合は正解に変更できます">
                    <span>⭕</span> <span>正解にする (表記ゆれ)</span>
                  </button>
                ` : ''}
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
                  pos: '動詞',
                  isVerb: true,
                  derivation: `語幹「${cleanRoot}」に活用語尾が接続し、${q.targetForm || '活用形'}「${q.answer}」が形成されます。`
                } : {
                  dictForm: q.baseWord,
                  baseWord: q.baseWord,
                  root: '',
                  meaning: q.baseMeaning,
                  baseMeaning: q.baseMeaning,
                  japanese: q.baseMeaning,
                  pos: '名詞',
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

            ${(typeof renderChoiceExplanationsHTML === 'function' && q.options && q.options.length > 0) ? renderChoiceExplanationsHTML(q.options, {
              expectedAnswer: q.answer,
              userAnswer: this.state.userAnswer,
              title: '選択肢に出た単語・格変化の全解説を見る（タップで開閉）'
            }) : ''}

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

    // ヒントトグルボタン（タップするまで隠す）
    const toggleHintBtn = this.container.querySelector('#btn-toggle-decl-hint');
    const hintContent = this.container.querySelector('#decl-hint-content');
    const hintToggleText = this.container.querySelector('#decl-hint-toggle-text');
    if (toggleHintBtn && hintContent) {
      toggleHintBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const isHidden = hintContent.classList.toggle('hidden');
        if (hintToggleText) {
          hintToggleText.textContent = isHidden ? 'ヒントを見る ▼' : 'ヒントを閉じる ▲';
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
          bindCyrillicInputAssistant(this.container, '#input-decl-answer');
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
        let allowEnterNext = false;
        setTimeout(() => {
          allowEnterNext = true;
          try { nextBtn.focus(); } catch (_) {}
        }, 350);

        nextBtn.addEventListener('click', (e) => {
          if (!allowEnterNext) {
            e.preventDefault();
            return;
          }
          this.goNext();
        });

        const keyHandler = (e) => {
          if (e.key === 'Enter') {
            if (!allowEnterNext) return;
            window.removeEventListener('keydown', keyHandler);
            this.goNext();
          }
        };
        window.addEventListener('keydown', keyHandler);
      }

      // 自己正解化ボタン（表記ゆれ・タイポ）
      const overrideBtn = this.container.querySelector('#btn-override-decl-correct');
      if (overrideBtn) {
        overrideBtn.addEventListener('click', () => {
          this.state.isCorrect = true;
          this.state.sessionScore = (this.state.sessionScore || 0) + 10;
          this.state.sessionXp = (this.state.sessionXp || 0) + 15;
          SoundEffects.playCorrect();
          if (this.state.results && this.state.results.length > 0) {
            this.state.results[this.state.results.length - 1].isCorrect = true;
          }
          try {
            const q = this.state.currentQuiz;
            const qTitle = `【${q.kind === 'noun' ? '格変化' : '動詞活用'}】${q.question}`;
            const mistakes = StorageService.getMistakes().filter(m => m.question !== qTitle);
            localStorage.setItem('mongol_mistakes', JSON.stringify(mistakes));
          } catch (_) {}
          this.renderTesting();
        });
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
      // 正解時に間違いノートの格変化・活用問題を克服済みにする（間違えた単語・問題から消去）
      StorageService.resolveMistakeByQuestion(q.question, q.answer);
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
    scrollToQuizTop(this.container);
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
    if (!this.container) return;
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

        ${wrong > 0 ? `
          <!-- 間違いノート自動保存通知バナー ＆ 直行ボタン -->
          <div class="p-3.5 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
            <div class="text-xs text-rose-800 dark:text-rose-200 font-bold flex items-center gap-1.5 text-center sm:text-left">
              <span class="text-base">🔥</span>
              <span>間違えた <strong>${wrong}</strong> 問を「間違いノート」に自動保存しました</span>
            </div>
            <button type="button" id="btn-goto-mistakes-from-decl" class="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-black rounded-xl text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0">
              <span>間違いノートで特訓</span>
              <span>→</span>
            </button>
          </div>
        ` : ''}

        <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-md text-center space-y-3">
          <div class="flex items-center justify-between text-xs text-slate-500 font-bold px-2">
            <span>活用・格変化テスト総評</span>
            <span>正解率: ${percent}% (${correct}/${total}問)</span>
          </div>

          <div class="space-y-2">
            <div class="flex gap-2">
              <button type="button" id="btn-retry-declension" class="flex-1 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs sm:text-sm transition-all active:scale-98 shadow-xs cursor-pointer flex items-center justify-center gap-1.5">
                <span>🔄</span>
                <span>もう一度解く</span>
              </button>
              <button type="button" id="btn-change-declension-settings" class="flex-1 py-3 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 font-bold rounded-xl text-xs sm:text-sm transition-all active:scale-98 shadow-xs cursor-pointer flex items-center justify-center gap-1.5">
                <span>⚙️</span>
                <span>問題選択へ戻る</span>
              </button>
            </div>
            <button type="button" id="btn-result-home" class="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-1">
              <span>🏠</span>
              <span>ホームへ戻る</span>
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
                  ${(typeof renderChoiceExplanationsHTML === 'function' && r.quiz.options && r.quiz.options.length > 0) ? renderChoiceExplanationsHTML(r.quiz.options, {
                    expectedAnswer: r.quiz.answer,
                    userAnswer: r.userAnswer,
                    title: '選択肢に出た単語・格変化の全解説を見る（タップで開閉）'
                  }) : ''}
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

    const changeDeclensionSettingsBtn = this.container.querySelector('#btn-change-declension-settings');
    if (changeDeclensionSettingsBtn) {
      changeDeclensionSettingsBtn.addEventListener('click', () => {
        this.state.view = 'settings';
        this.renderSettings();
      });
    }

    const gotoMistakesBtn = this.container.querySelector('#btn-goto-mistakes-from-decl');
    if (gotoMistakesBtn) {
      gotoMistakesBtn.addEventListener('click', () => {
        if (this.onNavigate) {
          if (typeof ReviewNotebookComponent !== 'undefined') {
            ReviewNotebookComponent.state.view = 'list';
            ReviewNotebookComponent.state.filterType = 'all';
          }
          this.onNavigate('review');
        }
      });
    }

    this.container.querySelector('#btn-result-home').addEventListener('click', () => {
      if (this.onNavigate) this.onNavigate('home');
    });
  }
}
