// 文法テストコンポーネント（語順並び替え、格助詞選択、空欄補充、誤り訂正、翻訳）
import { StorageService } from '../services/storage.js';
import { SpeechService } from '../services/speech.js';
import { CyrillicKeyboard } from './CyrillicKeyboard.js';
import { isFuzzyMatch, renderChoiceExplanationsHTML, shuffleArray, SoundEffects, scrollToQuizTop } from '../utils/helpers.js';
import { GamificationService } from '../services/gamification.js';
import { PenguinMascot } from './PenguinMascot.js';

export class GrammarTestComponent {
  static state = {
    view: 'settings', // 'settings' | 'testing' | 'result'
    settings: {
      lessonGroup: 'all', // 'all' | 'handbook' | 'basic' | 'comprehensive'
      type: 'all', // 'all' | 'reorder' | 'choice' | 'fill' | 'translation'
      count: 10
    },
    quizzes: [],
    currentIndex: 0,
    currentQuiz: null,
    userAnswer: '',
    selectedTokens: [], // 語順並び替え用
    availableTokens: [], // 語順並び替えの残りトークン
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

  // --- 1. 設定画面 ---
  static renderSettings() {
    const allQuizzes = StorageService.getGrammarQuizzes();

    this.container.innerHTML = `
      <div class="animate-fade-in max-w-xl mx-auto px-4 py-4 space-y-5">
        <div class="flex items-center justify-between border-b border-slate-200 pb-3">
          <div class="flex items-center gap-2">
            <span class="text-2xl">📐</span>
            <h2 class="text-lg font-bold text-slate-800">文法テストの設定</h2>
          </div>
          <button type="button" id="btn-back-home" class="text-xs text-slate-500 hover:text-slate-800">
            ✕ ホームへ
          </button>
        </div>

        <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          
          <!-- 出題範囲（課グループ） -->
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1.5">出題範囲</label>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <label class="flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer hover:bg-slate-50 ${this.state.settings.lessonGroup === 'all' ? 'border-sky-600 bg-sky-50 text-sky-900 font-bold' : 'border-slate-200'}">
                <input type="radio" name="lessonGroup" value="all" ${this.state.settings.lessonGroup === 'all' ? 'checked' : ''} class="hidden">
                <span>全問（総合 169問）</span>
              </label>

              <label class="flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer hover:bg-slate-50 ${this.state.settings.lessonGroup === 'handbook' ? 'border-sky-600 bg-sky-50 text-sky-900 font-bold' : 'border-slate-200'}">
                <input type="radio" name="lessonGroup" value="handbook" ${this.state.settings.lessonGroup === 'handbook' ? 'checked' : ''} class="hidden">
                <span>重要文法48構造演習</span>
              </label>

              <label class="flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer hover:bg-slate-50 ${this.state.settings.lessonGroup === 'basic' ? 'border-sky-600 bg-sky-50 text-sky-900 font-bold' : 'border-slate-200'}">
                <input type="radio" name="lessonGroup" value="basic" ${this.state.settings.lessonGroup === 'basic' ? 'checked' : ''} class="hidden">
                <span>基礎文法テスト</span>
              </label>

              <label class="flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer hover:bg-slate-50 ${this.state.settings.lessonGroup === 'comprehensive' ? 'border-sky-600 bg-sky-50 text-sky-900 font-bold' : 'border-slate-200'}">
                <input type="radio" name="lessonGroup" value="comprehensive" ${this.state.settings.lessonGroup === 'comprehensive' ? 'checked' : ''} class="hidden">
                <span>総合文法演習</span>
              </label>
            </div>
          </div>

          <!-- 問題タイプ -->
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1.5">問題形式</label>
            <select id="select-quiz-type" class="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium">
              <option value="all" ${this.state.settings.type === 'all' ? 'selected' : ''}>すべての形式（並び替え・選択・空欄・翻訳）</option>
              <option value="reorder" ${this.state.settings.type === 'reorder' ? 'selected' : ''}>語順の並び替え問題</option>
              <option value="fill" ${this.state.settings.type === 'fill' ? 'selected' : ''}>疑問助詞・格語尾の空欄補充</option>
              <option value="choice" ${this.state.settings.type === 'choice' ? 'selected' : ''}>選択問題・誤り訂正</option>
              <option value="translation" ${this.state.settings.type === 'translation' ? 'selected' : ''}>日本語→モンゴル語 翻訳記述</option>
            </select>
          </div>

          <!-- 出題数 -->
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1.5">出題数</label>
            <div class="grid grid-cols-4 gap-2">
              ${[5, 10, 20, 'all'].map(num => `
                <button type="button" class="btn-count py-2 text-xs font-bold rounded-lg border transition-all ${
                  this.state.settings.count === num ? 'bg-sky-600 text-white border-sky-600 shadow-xs' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }" data-count="${num}">
                  ${num === 'all' ? '全問' : `${num}問`}
                </button>
              `).join('')}
            </div>
          </div>

          <button type="button" id="btn-start-grammar" class="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-md transition-all active:scale-98 text-sm mt-2 flex items-center justify-center gap-2">
            <span>🚀</span> 文法テストを開始する
          </button>
        </div>
      </div>
    `;

    this.container.querySelector('#btn-back-home').addEventListener('click', () => {
      if (this.onNavigate) this.onNavigate('home');
    });

    this.container.querySelectorAll('input[name="lessonGroup"]').forEach(r => {
      r.addEventListener('change', (e) => {
        this.state.settings.lessonGroup = e.target.value;
        this.renderSettings();
      });
    });

    this.container.querySelector('#select-quiz-type').addEventListener('change', (e) => {
      this.state.settings.type = e.target.value;
    });

    this.container.querySelectorAll('.btn-count').forEach(btn => {
      btn.addEventListener('click', () => {
        const c = btn.getAttribute('data-count');
        this.state.settings.count = c === 'all' ? 'all' : parseInt(c, 10);
        this.renderSettings();
      });
    });

    this.container.querySelector('#btn-start-grammar').addEventListener('click', () => {
      this.startTest();
    });
  }

  // --- 2. テストの準備 ---
  static startTest() {
    let list = [...StorageService.getGrammarQuizzes()];

    if (this.state.settings.lessonGroup === 'handbook') {
      list = list.filter(q => q.grammarId);
    } else if (this.state.settings.lessonGroup === 'basic') {
      list = list.filter(q => q.lessonGroup === '基礎文法');
    } else if (this.state.settings.lessonGroup === 'comprehensive') {
      list = list.filter(q => q.lessonGroup === '総合文法');
    } else if (this.state.settings.lessonGroup !== 'all') {
      list = list.filter(q => q.lessonGroup === this.state.settings.lessonGroup);
    }

    if (this.state.settings.type !== 'all') {
      list = list.filter(q => q.type === this.state.settings.type);
    }

    if (list.length === 0) {
      alert('条件に一致する文法問題がありません。設定を変更してください。');
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
    scrollToQuizTop(this.container);
    this.state.currentQuiz = q;
    this.state.userAnswer = '';
    this.state.hasAnswered = false;
    this.state.isCorrect = false;

    if (q.type === 'reorder') {
      const sanitized = (q.tokens || []).map(t => {
        if (t === '9') return 'есөн';
        if (t === '10') return 'арав';
        if (t === '14-ний') return 'арван дөрөвний';
        if (t === '15-ны') return 'арван тавны';
        return t;
      });
      this.state.availableTokens = shuffleArray([...sanitized]);
      this.state.selectedTokens = [];
    }

    this.renderTesting();
  }

  // --- 3. テスト実行画面 ---
  static renderTesting() {
    const q = this.state.currentQuiz;
    const idx = this.state.currentIndex;
    const total = this.state.quizzes.length;
    const progressPercent = Math.round(((idx) / total) * 100);

    const typeBadges = {
      reorder: '語順並び替え',
      fill: '空欄補充',
      choice: '選択問題',
      correction: '間違い訂正',
      translation: '文法翻訳'
    };

    this.container.innerHTML = `
      <div class="animate-fade-in max-w-xl mx-auto px-4 py-3 space-y-3">
        
        <!-- プログレスバー ＆ ゲームHUD -->
        <div class="space-y-1.5">
          <div class="flex justify-between items-center text-xs font-bold text-slate-500">
            <span class="flex items-center gap-2">
              <span>文法テスト ${idx + 1} / ${total}</span>
              ${GamificationService.sessionCombo >= 2 ? `
                <span class="px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200 animate-bounce text-[10px]">
                  🔥 ${GamificationService.sessionCombo} COMBO
                </span>
              ` : ''}
            </span>
            <div class="flex items-center gap-3">
              <span class="text-amber-600 font-extrabold">+${this.state.sessionScore || 0} PTS</span>
              <span class="text-sky-600 font-extrabold">+${this.state.sessionXp || 0} XP</span>
              <button type="button" id="btn-quit-grammar" class="text-slate-400 hover:text-slate-700 ml-1">中断</button>
            </div>
          </div>
          <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div class="bg-sky-500 h-full transition-all duration-300" style="width: ${progressPercent}%"></div>
          </div>
        </div>

        <!-- 問題文カード -->
        <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
          <div class="text-xs font-bold text-slate-400 mb-1.5">${q.category || '文法規則'}</div>
          
          <div class="text-lg sm:text-xl font-bold text-slate-800 leading-relaxed cyrillic-text whitespace-pre-line">
            ${q.question}
          </div>

          ${q.hint ? `
            <div class="mt-2 text-center">
              <button type="button" id="btn-toggle-grammar-hint" class="text-xs text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 px-3 py-1 rounded-full font-bold border border-slate-200 transition-all inline-flex items-center gap-1.5 cursor-pointer select-none active:scale-95 shadow-2xs">
                <span>💡</span>
                <span id="grammar-hint-toggle-text">ヒントを見る ▼</span>
              </button>
              <div id="grammar-hint-content" class="hidden mt-2 animate-fade-in text-xs text-sky-700 bg-sky-50 inline-block px-3 py-1.5 rounded-xl font-medium border border-sky-200">
                ヒント: ${q.hint}
              </div>
            </div>
          ` : ''}
        </div>

        <!-- 回答エリア -->
        ${!this.state.hasAnswered ? `
          <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-4">
            
            ${q.type === 'reorder' ? `
              <!-- 語順並び替えUI -->
              <div class="space-y-3">
                <div class="text-xs text-slate-500 font-semibold">単語をタップして正しい順番に並べてください:</div>
                
                <!-- 組み立て中の文 -->
                <div id="reorder-dropzone" class="min-h-14 p-2.5 bg-slate-50 rounded-xl border-2 border-dashed border-sky-300 flex flex-wrap gap-2 items-center">
                  ${this.state.selectedTokens.length === 0 ? `
                    <span class="text-xs text-slate-400">下の単語をタップしてここに入れます</span>
                  ` : this.state.selectedTokens.map((token, i) => {
                    const displayToken = (token === '9' ? 'есөн' : token === '10' ? 'арав' : token === '14-ний' ? 'арван дөрөвний' : token === '15-ны' ? 'арван тавны' : token);
                    return `
                      <button type="button" class="btn-remove-token px-3 py-1.5 bg-sky-600 hover:bg-rose-500 text-white font-bold text-sm rounded-lg shadow-xs active:scale-95 transition-all cyrillic-text" data-index="${i}">
                        ${displayToken} ✕
                      </button>
                    `;
                  }).join('')}
                </div>

                <!-- 選択可能な単語チップ -->
                <div id="reorder-available-tokens" class="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
                  ${this.state.availableTokens.map((token, i) => {
                    const displayToken = (token === '9' ? 'есөн' : token === '10' ? 'арав' : token === '14-ний' ? 'арван дөрөвний' : token === '15-ны' ? 'арван тавны' : token);
                    return `
                      <button type="button" class="btn-add-token px-3 py-1.5 bg-slate-100 hover:bg-sky-100 hover:text-sky-800 text-slate-800 font-bold text-sm rounded-lg border border-slate-200 active:scale-95 transition-all cyrillic-text" data-index="${i}">
                        ${displayToken}
                      </button>
                    `;
                  }).join('')}
                </div>

                <button type="button" id="btn-submit-reorder" class="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-md transition-all active:scale-98 text-sm mt-3 ${this.state.selectedTokens.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}">
                  回答を確定する
                </button>
              </div>
            ` : (q.type === 'choice' || q.type === 'fill' || q.type === 'correction') && q.options ? `
              <!-- 選択肢UI -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                ${q.options.map(opt => `
                  <button type="button" class="btn-grammar-option text-left p-3.5 rounded-xl border border-slate-200 hover:border-sky-500 hover:bg-sky-50 text-slate-800 font-bold text-sm transition-all active:scale-98 flex items-center justify-between cyrillic-text" data-val="${opt}">
                    <span>${opt}</span>
                    <span class="text-xs text-slate-400">選択</span>
                  </button>
                `).join('')}
              </div>
            ` : `
              <!-- 翻訳等の記述UI -->
              <div class="space-y-3">
                <input type="text" id="input-grammar-answer" 
                  class="w-full text-base sm:text-lg p-3 rounded-xl border-2 border-slate-300 focus:border-sky-500 focus:outline-hidden text-center font-bold text-slate-800 cyrillic-text cyrillic-input" 
                  placeholder="モンゴル語（キリル文字）で入力..." 
                  data-cyrillic="true"
                  autofocus autocomplete="off">

                <button type="button" id="btn-submit-grammar-text" class="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-md transition-all active:scale-98 text-sm">
                  回答する（Enter）
                </button>
              </div>
            `}
          </div>
        ` : `
          <!-- 回答後フィードバック・解説 -->
          <div class="animate-fade-in space-y-4">
            <div class="p-5 rounded-2xl border ${this.state.isCorrect ? 'bg-emerald-50 border-emerald-300' : 'bg-rose-50 border-rose-300'} shadow-sm">
              <div class="text-2xl font-bold mb-2 ${this.state.isCorrect ? 'text-emerald-800' : 'text-rose-800'}">
                ${this.state.isCorrect ? '⭕ 正解！' : '❌ 不正解'}
              </div>

              <!-- 正解表示 -->
              <div class="space-y-2 text-xs sm:text-sm">
                <div>
                  <span class="text-slate-500 font-medium">正しい解答: </span>
                  <span class="font-extrabold text-base cyrillic-text text-emerald-800 correct-answer-text">${q.answer}</span>
                </div>

                ${!this.state.isCorrect && this.state.userAnswer ? `
                  <div class="text-rose-700">
                    <span>あなたの回答: </span>
                    <span class="font-semibold line-through">${this.state.userAnswer}</span>
                  </div>
                ` : ''}

                ${(typeof getWordEtymologyHTML === 'function') ? getWordEtymologyHTML(null, q.answer) : ''}
                ${(typeof getWordMnemonicHTML === 'function') ? getWordMnemonicHTML(null, q.answer) : ''}

                <!-- 詳細解説（赤字注意点・格支配など） -->
                <div class="mt-3 p-3.5 bg-white/90 rounded-xl border border-slate-200 text-slate-700 leading-relaxed text-xs sm:text-sm">
                  <div class="font-bold text-sky-800 mb-1">📖 解説・文法規則:</div>
                  <div class="whitespace-pre-line text-slate-800">${this.formatExplanation(q.explanation)}</div>
                </div>
              </div>
            </div>

            ${(typeof renderChoiceExplanationsHTML === 'function' && q.options && q.options.length > 0) ? renderChoiceExplanationsHTML(q.options, {
              expectedAnswer: q.answer,
              userAnswer: this.state.userAnswer,
              title: '選択肢に出た単語・語尾の全解説を見る（タップで開閉）'
            }) : ''}

            <!-- 次へ進むボタン -->
            <button type="button" id="btn-next-grammar" class="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-md transition-all active:scale-98 text-sm flex items-center justify-center gap-1">
              <span>${idx + 1 < total ? '次の問題へ（Enter） →' : '結果を見る 🎉'}</span>
            </button>
          </div>
        `}
      </div>
    `;

    this.bindTestingEvents();
  }

  static formatExplanation(text) {
    if (!text) return '';
    // 🔴 赤字や重要事項のスタイリング
    return text.replace(/🔴([^\n]+)/g, '<span class="text-rose-600 font-bold">🔴 $1</span>');
  }

  // 並び替え問題の部分更新（全画面チカチカ・リロードを完全防止）
  static updateReorderUI() {
    const dropzone = this.container.querySelector('#reorder-dropzone');
    const availableContainer = this.container.querySelector('#reorder-available-tokens');
    const submitBtn = this.container.querySelector('#btn-submit-reorder');

    if (!dropzone || !availableContainer) {
      this.renderTesting();
      return;
    }

    const formatToken = (token) => {
      return (token === '9' ? 'есөн' : token === '10' ? 'арав' : token === '14-ний' ? 'арван дөрөвний' : token === '15-ны' ? 'арван тавны' : token);
    };

    // 1. 組み立て中の文（解答欄ドロップゾーン）の部分更新
    if (this.state.selectedTokens.length === 0) {
      dropzone.innerHTML = `<span class="text-xs text-slate-400">下の単語をタップしてここに入れます</span>`;
    } else {
      dropzone.innerHTML = this.state.selectedTokens.map((token, i) => `
        <button type="button" class="btn-remove-token px-3 py-1.5 bg-sky-600 hover:bg-rose-500 text-white font-bold text-sm rounded-lg shadow-xs active:scale-95 transition-transform cyrillic-text cursor-pointer" data-index="${i}">
          ${formatToken(token)} ✕
        </button>
      `).join('');
    }

    // 2. 選択可能な単語チップの部分更新
    availableContainer.innerHTML = this.state.availableTokens.map((token, i) => `
      <button type="button" class="btn-add-token px-3 py-1.5 bg-slate-100 hover:bg-sky-100 hover:text-sky-800 text-slate-800 font-bold text-sm rounded-lg border border-slate-200 active:scale-95 transition-transform cyrillic-text cursor-pointer" data-index="${i}">
        ${formatToken(token)}
      </button>
    `).join('');

    // 3. 回答確定ボタンの有効/無効クラス切替
    if (submitBtn) {
      if (this.state.selectedTokens.length === 0) {
        submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
      } else {
        submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
      }
    }

    // 4. トークンクリックイベントの再バインド
    this.bindReorderTokenEvents();
  }

  static bindReorderTokenEvents() {
    // 単語チップを追加（解答欄へ送る）
    this.container.querySelectorAll('.btn-add-token').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const index = parseInt(btn.getAttribute('data-index'), 10);
        if (isNaN(index) || index < 0 || index >= this.state.availableTokens.length) return;
        const token = this.state.availableTokens.splice(index, 1)[0];
        this.state.selectedTokens.push(token);
        this.updateReorderUI();
      });
    });

    // 単語チップを戻す（解答欄から外す）
    this.container.querySelectorAll('.btn-remove-token').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const index = parseInt(btn.getAttribute('data-index'), 10);
        if (isNaN(index) || index < 0 || index >= this.state.selectedTokens.length) return;
        const token = this.state.selectedTokens.splice(index, 1)[0];
        this.state.availableTokens.push(token);
        this.updateReorderUI();
      });
    });
  }

  static bindTestingEvents() {
    // ヒントトグル
    const toggleHintBtn = this.container.querySelector('#btn-toggle-grammar-hint');
    const hintContent = this.container.querySelector('#grammar-hint-content');
    const hintToggleText = this.container.querySelector('#grammar-hint-toggle-text');
    if (toggleHintBtn && hintContent) {
      toggleHintBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const isHidden = hintContent.classList.toggle('hidden');
        if (hintToggleText) {
          hintToggleText.textContent = isHidden ? 'ヒントを見る ▼' : 'ヒントを閉じる ▲';
        }
      });
    }

    const quitBtn = this.container.querySelector('#btn-quit-grammar');
    if (quitBtn) {
      quitBtn.addEventListener('click', () => {
        if (confirm('文法テストを中断しますか？')) {
          this.state.view = 'settings';
          this.renderSettings();
        }
      });
    }

    const q = this.state.currentQuiz;

    if (!this.state.hasAnswered) {
      if (q.type === 'reorder') {
        this.bindReorderTokenEvents();

        // 並び替え確定
        const submitReorder = this.container.querySelector('#btn-submit-reorder');
        if (submitReorder) {
          submitReorder.addEventListener('click', () => {
            if (this.state.selectedTokens.length === 0) return;
            const assembled = this.state.selectedTokens.join(' ');
            this.checkAnswer(assembled);
          });
        }
      } else if (q.options) {
        // 選択肢
        this.container.querySelectorAll('.btn-grammar-option').forEach(btn => {
          btn.addEventListener('click', () => {
            const val = btn.getAttribute('data-val');
            this.checkAnswer(val);
          });
        });
      } else {
        // 記述入力
        const input = this.container.querySelector('#input-grammar-answer');
        const submitBtn = this.container.querySelector('#btn-submit-grammar-text');

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
      }
    } else {
      // 回答後（Enterキー誤爆スキップ防止）
      const nextBtn = this.container.querySelector('#btn-next-grammar');
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
    }
  }

  static checkAnswer(userAns) {
    const q = this.state.currentQuiz;
    let isCorrect = false;

    if (q.acceptableAnswers && q.acceptableAnswers.length > 0) {
      isCorrect = q.acceptableAnswers.some(ans => isFuzzyMatch(userAns, ans));
    } else {
      isCorrect = isFuzzyMatch(userAns, q.answer);
    }

    this.state.hasAnswered = true;
    this.state.userAnswer = userAns;
    this.state.isCorrect = isCorrect;

    if (isCorrect) {
      SoundEffects.playCorrect();
      // 正解時に間違いノートの文法問題を克服済みにする（間違えた単語・問題から消去）
      StorageService.resolveMistakeByQuestion(q.question, q.answer);
    } else {
      SoundEffects.playWrong();
      StorageService.recordMistake({
        question: `【文法】${q.question}`,
        userAnswer: userAns || '(未回答)',
        correctAnswer: q.answer,
        type: 'grammar',
        category: q.category || '文法',
        explanation: q.explanation || ''
      });
    }

    // 共通ゲーミフィケーション集計（コンボ・スコア・XP・ペンギンリアクション）
    const feedback = GamificationService.recordAnswer({ isCorrect, testType: 'grammar' });
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
        type: 'grammar',
        total: total,
        correct: correct,
        category: this.state.settings.lessonGroup
      });

      // 共通ゲームセッション完了処理
      const sessionResult = GamificationService.finishSession({
        testType: 'grammar',
        testTitle: '文法テスト',
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
      testType: 'grammar',
      testTitle: '文法テスト',
      correctCount: correct,
      wrongCount: wrong,
      sessionScore: this.state.sessionScore || 0,
      sessionXp: this.state.sessionXp || 0
    });

    this.container.innerHTML = `
      <div class="animate-fade-in max-w-xl mx-auto px-4 py-4 space-y-4">
        
        <!-- ゲームリザルト ＆ Оцон шувууフィードバック -->
        ${GamificationService.renderGameResultCard({
          testTitle: '文法テスト',
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
            <button type="button" id="btn-goto-mistakes-from-grammar" class="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-black rounded-xl text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0">
              <span>間違いノートで特訓</span>
              <span>→</span>
            </button>
          </div>
        ` : ''}

        <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-md text-center space-y-3">
          <div class="flex items-center justify-between text-xs text-slate-500 font-bold px-2">
            <span>文法テスト総評</span>
            <span>正解率: ${percent}% (${correct}/${total}問)</span>
          </div>

          <div class="flex gap-2">
            <button type="button" id="btn-retry-grammar" class="flex-1 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs sm:text-sm transition-all active:scale-98 shadow-xs cursor-pointer">
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
              <button type="button" class="filter-grammar-result-btn px-2.5 py-1 rounded-lg transition-all cursor-pointer ${currentFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs font-black' : 'text-slate-500 hover:text-slate-800'}" data-filter="all">
                すべて (${total})
              </button>
              <button type="button" class="filter-grammar-result-btn px-2.5 py-1 rounded-lg transition-all cursor-pointer ${currentFilter === 'correct' ? 'bg-emerald-600 text-white shadow-2xs font-black' : 'text-slate-500 hover:text-emerald-700'}" data-filter="correct">
                ⭕ 正解 (${correct})
              </button>
              <button type="button" class="filter-grammar-result-btn px-2.5 py-1 rounded-lg transition-all cursor-pointer ${currentFilter === 'wrong' ? 'bg-rose-600 text-white shadow-2xs font-black' : 'text-slate-500 hover:text-rose-700'}" data-filter="wrong">
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
                      <button type="button" class="btn-speak-grammar-result text-slate-400 hover:text-sky-700 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer" data-word="${r.quiz.answer}" title="正解の発音を聞く">
                        🔊
                      </button>
                    ` : ''}
                  </div>
                  <div class="font-bold text-slate-900 text-xs sm:text-sm">${r.quiz.question}</div>
                  <div>正解: <span class="font-bold text-sky-800 cyrillic-text">${r.quiz.answer}</span></div>
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
                    title: '選択肢に出た単語・語尾の全解説を見る（タップで開閉）'
                  }) : ''}
                </div>
              `).join('')}
            </div>
          `}
        </div>
      </div>
    `;

    // フィルターボタンイベント
    this.container.querySelectorAll('.filter-grammar-result-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.state.resultFilter = btn.getAttribute('data-filter');
        this.renderResult();
      });
    });

    // 音声再生
    this.container.querySelectorAll('.btn-speak-grammar-result').forEach(btn => {
      btn.addEventListener('click', () => {
        const word = btn.getAttribute('data-word');
        if (word) SpeechService.speakMongolian(word);
      });
    });

    this.container.querySelector('#btn-retry-grammar').addEventListener('click', () => {
      this.startTest();
    });

    const gotoMistakesBtn = this.container.querySelector('#btn-goto-mistakes-from-grammar');
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
