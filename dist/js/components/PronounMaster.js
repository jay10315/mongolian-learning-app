// ============================================================
// モンゴル語 人称代名詞マスター特訓コンポーネント (PronounMaster)
// 文頭の独立人称代名詞（全7格） ＆ 文中の人称所属小詞 ＆ 再帰語尾 ＆ 文末助詞
// ============================================================

import { PRONOUN_CATEGORIES, PRONOUN_TABLES, pronounQuizzes } from '../data/pronounData.js';
import { SpeechService } from '../services/speech.js';
import { SoundEffects, shuffleArray, scrollToQuizTop, renderClickableWordsHTML, showUniversalWordModal, findWordInDictionary, renderReviewToggleButtonHTML, bindReviewToggleButtons } from '../utils/helpers.js';
import { GamificationService } from '../services/gamification.js';
import { StorageService } from '../services/storage.js';

export class PronounMasterComponent {
  static container = null;
  static onNavigate = null;
  static keydownHandler = null;

  static state = {
    view: 'menu', // 'menu' | 'testing' | 'result' | 'cheatsheet'
    activeCategory: 'all',
    questionCount: 10,
    customCountInput: '10',
    quizzes: [],
    currentIndex: 0,
    currentQuiz: null,
    shuffledOptions: [],
    selectedOption: null,
    hasAnswered: false,
    isCorrect: false,
    isHintRevealed: false,
    score: 0,
    combo: 0,
    maxCombo: 0,
    xpEarned: 0,
    results: [],
    activeCheatTab: 'independent' // 'independent' | 'enclitic' | 'reflexive' | 'predicate' | 'rules'
  };

  static render(container, onNavigate) {
    this.container = container;
    this.onNavigate = onNavigate;

    // キーボードショートカットの登録
    if (!this.keydownHandler) {
      this.keydownHandler = (e) => this.handleKeyDown(e);
      window.addEventListener('keydown', this.keydownHandler);
    }

    if (this.state.view === 'menu') {
      this.renderMenu();
    } else if (this.state.view === 'testing') {
      this.renderTesting();
    } else if (this.state.view === 'result') {
      this.renderResult();
    } else if (this.state.view === 'cheatsheet') {
      this.renderCheatsheet();
    }
  }

  // ============================================================
  // 1. メニュー画面 (Menu View)
  // ============================================================
  static renderMenu() {
    const totalAllCount = pronounQuizzes.length;

    // カテゴリごとの問題数カウント
    const categoryCounts = {};
    pronounQuizzes.forEach(q => {
      categoryCounts[q.category] = (categoryCounts[q.category] || 0) + 1;
    });

    const activeCatData = PRONOUN_CATEGORIES.find(c => c.id === this.state.activeCategory) || PRONOUN_CATEGORIES[0];
    const availableCount = this.state.activeCategory === 'all'
      ? totalAllCount
      : (categoryCounts[this.state.activeCategory] || 0);

    // 最大問題数の調整
    let count = Math.min(this.state.questionCount, availableCount);
    if (count <= 0 && availableCount > 0) count = Math.min(10, availableCount);

    this.container.innerHTML = `
      <div class="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
        
        <!-- ヘッダー -->
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-bold mb-2">
              <span>👤 Хүний төлөөний нэр</span>
              <span>•</span>
              <span>文頭 ＆ 文中 ＆ 文末 完全マスター</span>
            </div>
            <h1 class="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
              <span>人称代名詞マスター特訓</span>
            </h1>
            <p class="text-sm text-slate-600 dark:text-slate-400 mt-1">
              文頭の独立代名詞（全7格）から、文中に着ける人称所属小詞（-маань, -чинь等）、再帰語尾まで完全攻略！
            </p>
          </div>
          
          <div class="flex items-center gap-3 w-full md:w-auto">
            <button type="button" id="btn-open-cheatsheet" class="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-sm shadow-sm transition-all transform hover:-translate-y-0.5 cursor-pointer">
              <span>📖 人称・活用 早見表</span>
            </button>
            <button type="button" id="btn-back-home" class="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm transition cursor-pointer">
              ホーム
            </button>
          </div>
        </div>

        <!-- 特訓カテゴリ選択 -->
        <div>
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <span>🎯 特訓カテゴリを選択</span>
            </h2>
            <span class="text-xs text-slate-500">収録問題: 全${totalAllCount}問</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${PRONOUN_CATEGORIES.map(cat => {
              const isSelected = this.state.activeCategory === cat.id;
              const qCount = cat.id === 'all' ? totalAllCount : (categoryCounts[cat.id] || 0);
              return `
                <div class="cat-card p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/30 shadow-md ring-2 ring-blue-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 bg-white dark:bg-slate-900'
                }" data-cat="${cat.id}">
                  <div>
                    <div class="flex items-center justify-between mb-2">
                      <div class="flex items-center gap-2.5">
                        <span class="text-2xl">${cat.icon}</span>
                        <h3 class="font-black text-slate-900 dark:text-white text-base">${cat.title}</h3>
                      </div>
                      <span class="text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }">
                        ${qCount}問
                      </span>
                    </div>
                    <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-1">
                      ${cat.description}
                    </p>
                  </div>
                  <div class="mt-4 flex items-center justify-between text-xs font-bold ${
                    isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'
                  }">
                    <span>${isSelected ? '● 選択中' : '選択する'}</span>
                    <span>➔</span>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- 出題問題数セレクター（選択式 ＋ 自由入力欄） -->
        <div class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="font-bold text-slate-800 dark:text-slate-200 text-sm flex items-center gap-2">
              <span>⚙️ 出題問題数を設定</span>
              <span class="text-xs font-normal text-slate-500">（選択可能: 1〜${availableCount}問）</span>
            </h3>
            <span class="text-xs font-black px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
              現在の設定: ${count}問
            </span>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <!-- プリセットボタン -->
            ${[5, 10, 20, 50].filter(n => n <= availableCount).map(n => `
              <button type="button" class="btn-count-preset px-4 py-2 rounded-xl font-bold text-sm transition cursor-pointer ${
                count === n && this.state.customCountInput === String(n)
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
              }" data-count="${n}">
                ${n}問
              </button>
            `).join('')}

            ${availableCount > 0 ? `
              <button type="button" class="btn-count-preset px-4 py-2 rounded-xl font-bold text-sm transition cursor-pointer ${
                count === availableCount && this.state.customCountInput === String(availableCount)
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
              }" data-count="${availableCount}">
                全問 (${availableCount}問)
              </button>
            ` : ''}

            <!-- 自由入力ボックス（ユーザー指定の調節機能） -->
            <div class="flex items-center gap-2 ml-auto">
              <span class="text-xs text-slate-500 font-bold">自由入力:</span>
              <div class="flex items-center border border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800 focus-within:ring-2 focus-within:ring-blue-500">
                <button type="button" id="btn-count-minus" class="px-2.5 py-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 font-bold cursor-pointer">-</button>
                <input type="number" id="input-custom-count" min="1" max="${availableCount}" value="${count}" class="w-16 text-center bg-transparent py-1.5 font-bold text-sm text-slate-800 dark:text-slate-100 focus:outline-none" />
                <button type="button" id="btn-count-plus" class="px-2.5 py-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 font-bold cursor-pointer">+</button>
              </div>
              <span class="text-xs text-slate-500">問</span>
            </div>
          </div>
        </div>

        <!-- 特訓開始ボタン -->
        <div>
          <button type="button" id="btn-start-testing" class="w-full py-5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 text-white font-black text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-3">
            <span>🚀 人称代名詞特訓を開始する (${count}問)</span>
            <span class="text-xs font-bold px-2.5 py-1 rounded-full bg-white/20 text-white">XPボーナスあり ⭐</span>
          </button>
        </div>

      </div>
    `;

    // イベントリスナー紐付け
    this.container.querySelectorAll('.cat-card').forEach(card => {
      card.addEventListener('click', () => {
        const cat = card.getAttribute('data-cat');
        this.state.activeCategory = cat;
        this.renderMenu();
      });
    });

    this.container.querySelectorAll('.btn-count-preset').forEach(btn => {
      btn.addEventListener('click', () => {
        const val = parseInt(btn.getAttribute('data-count'), 10);
        this.state.questionCount = val;
        this.state.customCountInput = String(val);
        this.renderMenu();
      });
    });

    const inputCount = this.container.querySelector('#input-custom-count');
    if (inputCount) {
      inputCount.addEventListener('change', (e) => {
        let val = parseInt(e.target.value, 10);
        if (isNaN(val) || val < 1) val = 1;
        if (val > availableCount) val = availableCount;
        this.state.questionCount = val;
        this.state.customCountInput = String(val);
        this.renderMenu();
      });
    }

    const btnMinus = this.container.querySelector('#btn-count-minus');
    if (btnMinus) {
      btnMinus.addEventListener('click', () => {
        let val = Math.max(1, (this.state.questionCount || 10) - 1);
        this.state.questionCount = val;
        this.state.customCountInput = String(val);
        this.renderMenu();
      });
    }

    const btnPlus = this.container.querySelector('#btn-count-plus');
    if (btnPlus) {
      btnPlus.addEventListener('click', () => {
        let val = Math.min(availableCount, (this.state.questionCount || 10) + 1);
        this.state.questionCount = val;
        this.state.customCountInput = String(val);
        this.renderMenu();
      });
    }

    const btnStart = this.container.querySelector('#btn-start-testing');
    if (btnStart) {
      btnStart.addEventListener('click', () => this.startTesting());
    }

    const btnCheatsheet = this.container.querySelector('#btn-open-cheatsheet');
    if (btnCheatsheet) {
      btnCheatsheet.addEventListener('click', () => {
        this.state.view = 'cheatsheet';
        this.renderCheatsheet();
      });
    }

    const btnBack = this.container.querySelector('#btn-back-home');
    if (btnBack) {
      btnBack.addEventListener('click', () => {
        if (this.onNavigate) this.onNavigate('home');
      });
    }
  }

  // ============================================================
  // 2. 特訓開始処理 (Start Testing)
  // ============================================================
  static startTesting() {
    let pool = [];
    if (this.state.activeCategory === 'all') {
      pool = [...pronounQuizzes];
    } else {
      pool = pronounQuizzes.filter(q => q.category === this.state.activeCategory);
    }

    if (!pool || pool.length === 0) {
      pool = [...pronounQuizzes];
    }

    const shuffled = shuffleArray([...pool]);
    const selectedCount = Math.min(this.state.questionCount || 10, shuffled.length);
    const selectedQuizzes = shuffled.slice(0, selectedCount);

    this.state.view = 'testing';
    this.state.quizzes = selectedQuizzes;
    this.state.currentIndex = 0;
    this.state.score = 0;
    this.state.combo = 0;
    this.state.maxCombo = 0;
    this.state.xpEarned = 0;
    this.state.results = [];
    this.prepareCurrentQuestion();
    this.renderTesting();
  }

  static prepareCurrentQuestion() {
    const q = this.state.quizzes[this.state.currentIndex];
    this.state.currentQuiz = q;
    this.state.shuffledOptions = shuffleArray([...q.options]);
    this.state.selectedOption = null;
    this.state.hasAnswered = false;
    this.state.isCorrect = false;
    this.state.isHintRevealed = false;
  }

  // ============================================================
  // 3. テスト実施画面 (Testing View)
  // ============================================================
  static renderTesting() {
    const q = this.state.currentQuiz;
    if (!q) return;

    const total = this.state.quizzes.length;
    const currentNum = this.state.currentIndex + 1;
    const progressPercent = Math.round((currentNum / total) * 100);

    // 位置バッジのテキストと配色
    let posBadgeColor = 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 border-blue-200 dark:border-blue-800';
    let posBadgeIcon = '🔵';
    let posBadgeText = '文頭につける独立代名詞';

    if (q.positionType === 'medial') {
      posBadgeColor = 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      posBadgeIcon = '🟣';
      posBadgeText = '文中に着ける人称小詞（名詞直後）';
    } else if (q.positionType === 'final') {
      posBadgeColor = 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      posBadgeIcon = '🟢';
      posBadgeText = '文末につける述語人称助詞';
    } else if (q.positionType === 'contrast') {
      posBadgeColor = 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      posBadgeIcon = '🟡';
      posBadgeText = '文頭 vs 文中の使い分け対比';
    }

    this.container.innerHTML = `
      <div class="max-w-3xl mx-auto px-4 py-6 space-y-6 animate-fadeIn">
        
        <!-- ナビ・プログレス -->
        <div class="flex items-center justify-between gap-4">
          <button type="button" id="btn-quit-test" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold transition cursor-pointer">
            <span>✕ 中断</span>
          </button>
          
          <div class="flex-1 mx-2">
            <div class="flex items-center justify-between text-xs font-bold text-slate-500 mb-1">
              <span>進捗: 第 ${currentNum} / ${total} 問</span>
              <span>${progressPercent}%</span>
            </div>
            <div class="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div class="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-300" style="width: ${progressPercent}%;"></div>
            </div>
          </div>

          <div class="flex items-center gap-2">
            ${this.state.combo > 1 ? `
              <span class="px-2.5 py-1 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-300 text-xs font-black animate-pulse flex items-center gap-1">
                <span>🔥</span>
                <span>${this.state.combo}連続!</span>
              </span>
            ` : ''}
            <button type="button" id="btn-view-quick-sheet" class="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 text-amber-700 dark:text-amber-300 text-xs font-bold transition cursor-pointer">
              📖 早見表
            </button>
          </div>
        </div>

        <!-- 問題カード -->
        <div class="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          
          <!-- バッジ群 -->
          <div class="flex flex-wrap items-center gap-2">
            <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${posBadgeColor}">
              <span>${posBadgeIcon}</span>
              <span>${posBadgeText}</span>
            </span>
            ${q.person ? `
              <span class="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold">
                ${q.person}
              </span>
            ` : ''}
            ${q.case ? `
              <span class="px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 text-xs font-bold border border-indigo-200 dark:border-indigo-800">
                ${q.case}
              </span>
            ` : ''}
          </div>

          <!-- 問題文（モンゴル語） ＆ 単語タップで意味表示 -->
          <div class="space-y-3">
            <div class="flex items-start justify-between gap-3">
              <div class="text-xl md:text-2xl font-black text-slate-900 dark:text-white leading-relaxed cyrillic-text">
                ${renderClickableWordsHTML(q.question, t => StorageService.isWordLookedUp(t))}
              </div>
              <button type="button" id="btn-speak-question" class="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-slate-600 dark:text-slate-300 hover:text-blue-600 transition cursor-pointer shrink-0" title="音声を聴く">
                🔊
              </button>
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400">
              💡 単語をタップすると辞書で意味を確認できます
            </p>
          </div>

          <!-- 日本語の文脈・設問指示（ヒントを見るを押さない限り見えないように隠す） -->
          <div class="space-y-2">
            <button type="button" id="btn-toggle-pronoun-hint" class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 transition-all cursor-pointer shadow-2xs active:scale-95">
              <span>💡</span>
              <span id="pronoun-hint-toggle-text">${(this.state.isHintRevealed || this.state.hasAnswered) ? 'ヒント（日本語の意味）を閉じる ▲' : 'ヒントを見る ▼'}</span>
            </button>

            <div id="pronoun-hint-container" class="${(this.state.isHintRevealed || this.state.hasAnswered) ? '' : 'hidden'} p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300 font-medium transition-all animate-fade-in">
              <span class="font-bold text-slate-900 dark:text-slate-100 mr-2">🇯🇵 日本語の意味:</span>
              <span>${q.questionJa}</span>
            </div>
          </div>

          <!-- 4択選択肢 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            ${this.state.shuffledOptions.map((opt, i) => {
              const isSelected = this.state.selectedOption === opt;
              const isCorrectOpt = opt === q.answer;
              let btnClass = "border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 text-slate-800 dark:text-slate-200";

              if (this.state.hasAnswered) {
                if (isCorrectOpt) {
                  btnClass = "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 font-black ring-2 ring-emerald-500/30";
                } else if (isSelected && !isCorrectOpt) {
                  btnClass = "border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200 font-bold ring-2 ring-rose-500/30";
                } else {
                  btnClass = "opacity-40 border-slate-200 dark:border-slate-800 text-slate-400";
                }
              }

              return `
                <button type="button" class="btn-option p-4 rounded-2xl border-2 text-left font-bold text-base transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-between ${btnClass}" data-opt="${opt}" ${this.state.hasAnswered ? 'disabled' : ''}>
                  <div class="flex items-center gap-3">
                    <span class="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center text-xs font-black">
                      ${i + 1}
                    </span>
                    <span class="cyrillic-text text-lg">${opt}</span>
                  </div>
                  ${this.state.hasAnswered && isCorrectOpt ? `
                    <span class="text-emerald-600 dark:text-emerald-400 font-black text-sm">✓ 正解</span>
                  ` : ''}
                  ${this.state.hasAnswered && isSelected && !isCorrectOpt ? `
                    <span class="text-rose-600 dark:text-rose-400 font-black text-sm">✗ 不正解</span>
                  ` : ''}
                </button>
              `;
            }).join('')}
          </div>

          <!-- 回答後の超詳細解説エリア (毎回必ず表示) -->
          ${this.state.hasAnswered ? `
            <div class="p-6 rounded-2xl border-2 animate-fadeIn space-y-5 ${
              this.state.isCorrect
                ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                : 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800'
            }">
              
              <!-- 正誤バッジ & 正解単語読み上げ -->
              <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b ${
                this.state.isCorrect ? 'border-emerald-200 dark:border-emerald-800' : 'border-rose-200 dark:border-rose-800'
              }">
                <div class="flex items-center gap-3">
                  <span class="text-2xl">${this.state.isCorrect ? '🎉' : '⚠️'}</span>
                  <div>
                    <h4 class="font-black text-lg ${this.state.isCorrect ? 'text-emerald-800 dark:text-emerald-200' : 'text-rose-800 dark:text-rose-200'}">
                      ${this.state.isCorrect ? '正解です！素晴らしい！' : 'おしい！正解はこちらです'}
                    </h4>
                    <div class="flex items-center gap-2 mt-0.5">
                      <span class="text-xl font-black cyrillic-text text-slate-900 dark:text-white">${q.answer}</span>
                      <span class="text-xs font-bold text-slate-500">[${q.pronunciation}]</span>
                    </div>
                  </div>
                </div>

                <button type="button" id="btn-speak-answer" class="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer">
                  <span>🔊</span>
                  <span>発音を聴く</span>
                </button>
              </div>

              <!-- ① 【文頭 vs 文中の配置ルール】 -->
              <div class="space-y-1.5">
                <div class="flex items-center gap-2 text-xs font-black text-indigo-700 dark:text-indigo-300">
                  <span>📍</span>
                  <span>【文頭・文中の配置ルール】</span>
                </div>
                <p class="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium bg-white/70 dark:bg-slate-900/60 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800">
                  ${q.positionRule}
                </p>
              </div>

              <!-- ② 【文法解説・格の根拠】 -->
              <div class="space-y-1.5">
                <div class="flex items-center gap-2 text-xs font-black text-blue-700 dark:text-blue-300">
                  <span>📌</span>
                  <span>【文法解説・なぜこの形になるのか】</span>
                </div>
                <p class="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-white/70 dark:bg-slate-900/60 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800">
                  ${q.explanation}
                </p>
              </div>

              <!-- ③ 【関連する活用表ミニカード】 -->
              ${q.table ? `
                <div class="space-y-1.5">
                  <div class="flex items-center gap-2 text-xs font-black text-amber-700 dark:text-amber-300">
                    <span>📊</span>
                    <span>【関連する代名詞・格変化一覧】</span>
                  </div>
                  <div class="text-xs text-slate-800 dark:text-slate-200 font-bold bg-amber-50/80 dark:bg-amber-950/40 p-3 rounded-xl border border-amber-200 dark:border-amber-800 leading-relaxed cyrillic-text">
                    ${q.table}
                  </div>
                </div>
              ` : ''}

              <!-- 次へボタン -->
              <div class="pt-2">
                <button type="button" id="btn-next-question" class="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-base shadow-md hover:shadow-lg transition cursor-pointer flex items-center justify-center gap-2">
                  <span>${currentNum < total ? '次の問題へ進む (Enter) ➔' : '結果を見る 🏆 ➔'}</span>
                </button>
              </div>

            </div>
          ` : ''}

        </div>

      </div>
    `;

    // イベントリスナー
    const btnQuit = this.container.querySelector('#btn-quit-test');
    if (btnQuit) {
      btnQuit.addEventListener('click', () => {
        if (confirm('特訓を中断してメニューに戻りますか？')) {
          this.state.view = 'menu';
          this.renderMenu();
        }
      });
    }

    const btnQuickSheet = this.container.querySelector('#btn-view-quick-sheet');
    if (btnQuickSheet) {
      btnQuickSheet.addEventListener('click', () => {
        this.state.view = 'cheatsheet';
        this.renderCheatsheet();
      });
    }

    const btnSpeakQ = this.container.querySelector('#btn-speak-question');
    if (btnSpeakQ) {
      btnSpeakQ.addEventListener('click', () => {
        const clean = q.question.replace(/_{2,}|\[\s*\]/g, q.answer || '');
        SpeechService.speak(clean);
      });
    }

    const btnSpeakAns = this.container.querySelector('#btn-speak-answer');
    if (btnSpeakAns) {
      btnSpeakAns.addEventListener('click', () => {
        SpeechService.speak(q.answer);
      });
    }

    // 4択選択肢クリック
    this.container.querySelectorAll('.btn-option').forEach(btn => {
      btn.addEventListener('click', () => {
        if (this.state.hasAnswered) return;
        const chosen = btn.getAttribute('data-opt');
        this.handleAnswer(chosen);
      });
    });

    // ヒントトグルボタン（押すまで日本語の意味を隠す）
    const btnToggleHint = this.container.querySelector('#btn-toggle-pronoun-hint');
    const hintBox = this.container.querySelector('#pronoun-hint-container');
    const hintText = this.container.querySelector('#pronoun-hint-toggle-text');
    if (btnToggleHint && hintBox) {
      btnToggleHint.addEventListener('click', () => {
        const isCurrentlyHidden = hintBox.classList.contains('hidden');
        if (isCurrentlyHidden) {
          hintBox.classList.remove('hidden');
          this.state.isHintRevealed = true;
          if (hintText) hintText.textContent = 'ヒント（日本語の意味）を閉じる ▲';
        } else {
          hintBox.classList.add('hidden');
          this.state.isHintRevealed = false;
          if (hintText) hintText.textContent = 'ヒントを見る ▼';
        }
      });
    }

    const btnNext = this.container.querySelector('#btn-next-question');
    if (btnNext) {
      btnNext.addEventListener('click', () => this.nextQuestion());
    }

    // 単語タップで意味表示 ＆ ホームの「調べた単語」に自動保存
    this.container.querySelectorAll('.clickable-word').forEach(span => {
      span.addEventListener('click', (e) => {
        e.stopPropagation();
        const rawWord = span.getAttribute('data-word');
        if (!rawWord) return;
        const wordInfo = findWordInDictionary(rawWord);
        try {
          StorageService.saveLookedUpWord({
            rawWord: wordInfo.rawWord || rawWord,
            dictForm: wordInfo.dictForm,
            ja: wordInfo.ja,
            pos: wordInfo.pos,
            pron: wordInfo.pron,
            passageTitle: `人称代名詞特訓 (${q.categoryLabel})`
          });
        } catch (_) {}
        try {
          SpeechService.speak(wordInfo.dictForm || wordInfo.rawWord);
        } catch (_) {}
        showUniversalWordModal({
          wordInfo,
          passageTitle: `人称代名詞特訓 (${q.categoryLabel})`,
          onAddResolved: () => {}
        });
      });
    });
  }

  // 回答処理
  static handleAnswer(chosen) {
    const q = this.state.currentQuiz;
    if (!q || this.state.hasAnswered) return;

    this.state.selectedOption = chosen;
    this.state.hasAnswered = true;
    const isCorrect = (chosen === q.answer);
    this.state.isCorrect = isCorrect;

    if (isCorrect) {
      this.state.score += 1;
      this.state.combo += 1;
      if (this.state.combo > this.state.maxCombo) {
        this.state.maxCombo = this.state.combo;
      }
      const xp = 15 + Math.min(this.state.combo * 2, 20);
      this.state.xpEarned += xp;
      try {
        GamificationService.addXp(xp, `人称代名詞正解: ${q.answer}`);
        SoundEffects.playCorrect();
      } catch (_) {}
      try {
        StorageService.recordHistory('pronoun_master', q.id, true);
        StorageService.recordMistakeAnswer(q.id, true);
      } catch (_) {}
    } else {
      this.state.combo = 0;
      try {
        SoundEffects.playIncorrect();
      } catch (_) {}
      // 復習ノート・忘却曲線に自動記録
      try {
        StorageService.recordMistake({
          id: `mistake_${q.id}_${Date.now()}`,
          quizId: q.id,
          type: 'pronoun',
          question: q.question,
          prompt: q.questionJa,
          correctAnswer: q.answer,
          userAnswer: chosen,
          options: q.options,
          explanation: `${q.positionRule}\n${q.explanation}`,
          category: q.categoryLabel || '人称代名詞',
          date: new Date().toISOString()
        });
        StorageService.recordHistory('pronoun_master', q.id, false);
      } catch (_) {}
    }

    this.state.results.push({
      quiz: q,
      chosen,
      isCorrect
    });

    this.renderTesting();
    scrollToQuizTop();
  }

  // 次の問題へ
  static nextQuestion() {
    if (this.state.currentIndex + 1 < this.state.quizzes.length) {
      this.state.currentIndex += 1;
      this.prepareCurrentQuestion();
      this.renderTesting();
      scrollToQuizTop();
    } else {
      this.finishTesting();
    }
  }

  // キーボード操作ハンドラ
  static handleKeyDown(e) {
    if (this.state.view !== 'testing') return;

    // 回答前: 1, 2, 3, 4 で選択
    if (!this.state.hasAnswered) {
      if (['1', '2', '3', '4'].includes(e.key)) {
        const idx = parseInt(e.key, 10) - 1;
        if (this.state.shuffledOptions && this.state.shuffledOptions[idx]) {
          this.handleAnswer(this.state.shuffledOptions[idx]);
        }
      }
    } else {
      // 回答後: Enterで次へ
      if (e.key === 'Enter') {
        e.preventDefault();
        this.nextQuestion();
      }
    }
  }

  // ============================================================
  // 4. 結果発表画面 (Result View)
  // ============================================================
  static finishTesting() {
    this.state.view = 'result';
    this.renderResult();
  }

  static renderResult() {
    const total = this.state.quizzes.length;
    const score = this.state.score;
    const percent = total > 0 ? Math.round((score / total) * 100) : 0;
    const mistakes = this.state.results.filter(r => !r.isCorrect);

    let feedback = "すばらしい！人称代名詞と所属小詞を完全にマスターしています！🎉";
    let badgeColor = "from-emerald-500 to-teal-600";
    if (percent < 60) {
      feedback = "文頭の独立形と文中の所属小詞の区別をもう一度早見表でチェックしてみましょう！💪";
      badgeColor = "from-amber-500 to-orange-600";
    } else if (percent < 85) {
      feedback = "よくできました！間違えた問題を中心に復習して満点を目指しましょう！✨";
      badgeColor = "from-blue-500 to-indigo-600";
    }

    this.container.innerHTML = `
      <div class="max-w-3xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
        
        <!-- スコアカード -->
        <div class="p-8 rounded-3xl bg-gradient-to-br ${badgeColor} text-white shadow-xl text-center space-y-4">
          <span class="text-4xl">🏆</span>
          <h2 class="text-3xl font-black">人称代名詞特訓 完了！</h2>
          <p class="text-sm text-white/90 font-medium max-w-md mx-auto">
            ${feedback}
          </p>

          <div class="grid grid-cols-3 gap-3 max-w-md mx-auto pt-4 border-t border-white/20">
            <div>
              <div class="text-3xl font-black">${score} / ${total}</div>
              <div class="text-xs text-white/80">正解数</div>
            </div>
            <div>
              <div class="text-3xl font-black">${percent}%</div>
              <div class="text-xs text-white/80">正答率</div>
            </div>
            <div>
              <div class="text-3xl font-black">+${this.state.xpEarned}</div>
              <div class="text-xs text-white/80">獲得XP</div>
            </div>
          </div>
        </div>

        <!-- アクションボタン -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button type="button" id="btn-retry-all" class="py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow transition cursor-pointer text-center">
            🔄 もう一度挑戦
          </button>
          ${mistakes.length > 0 ? `
            <button type="button" id="btn-retry-mistakes" class="py-3.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow transition cursor-pointer text-center">
              ⚠️ 誤答のみ再特訓 (${mistakes.length}問)
            </button>
          ` : ''}
          <button type="button" id="btn-result-to-menu" class="py-3.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm transition cursor-pointer text-center">
            メニューに戻る
          </button>
        </div>

        <!-- 復習セクション -->
        ${mistakes.length > 0 ? `
          <div class="space-y-4">
            <h3 class="font-black text-slate-900 dark:text-white text-lg flex items-center gap-2">
              <span>📝 要復習問題一覧 (${mistakes.length}問)</span>
              <span class="text-xs font-normal text-slate-500">※要復習・忘却曲線リストに保存済み</span>
            </h3>

            <div class="space-y-3">
              ${mistakes.map((m, idx) => `
                <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/50 shadow-sm space-y-3">
                  <div class="flex items-center justify-between text-xs font-bold text-slate-500">
                    <span class="px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300">
                      第${idx + 1}問 • ${m.quiz.categoryLabel}
                    </span>
                    <span>正解: <strong class="cyrillic-text text-emerald-600 dark:text-emerald-400 font-black">${m.quiz.answer}</strong></span>
                  </div>

                  <div class="text-base font-bold text-slate-800 dark:text-slate-100 cyrillic-text">
                    ${m.quiz.question}
                  </div>
                  <div class="text-xs text-slate-600 dark:text-slate-400">
                    訳: ${m.quiz.questionJa}
                  </div>

                  <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-700 dark:text-slate-300 leading-relaxed border border-slate-200/80 dark:border-slate-800">
                    <strong class="text-indigo-600 dark:text-indigo-400 font-bold">解説:</strong> ${m.quiz.positionRule} ${m.quiz.explanation}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

      </div>
    `;

    bindReviewToggleButtons(this.container);
    const btnRetry = this.container.querySelector('#btn-retry-all');
    if (btnRetry) {
      btnRetry.addEventListener('click', () => this.startTesting());
    }

    const btnRetryMis = this.container.querySelector('#btn-retry-mistakes');
    if (btnRetryMis) {
      btnRetryMis.addEventListener('click', () => {
        this.state.quizzes = mistakes.map(m => m.quiz);
        this.state.currentIndex = 0;
        this.state.score = 0;
        this.state.combo = 0;
        this.state.results = [];
        this.state.view = 'testing';
        this.prepareCurrentQuestion();
        this.renderTesting();
      });
    }

    const btnMenu = this.container.querySelector('#btn-result-to-menu');
    if (btnMenu) {
      btnMenu.addEventListener('click', () => {
        this.state.view = 'menu';
        this.renderMenu();
      });
    }
  }

  // ============================================================
  // 5. 人称代名詞・所属小詞 早見表 (Cheatsheet View)
  // ============================================================
  static renderCheatsheet() {
    const activeTab = this.state.activeCheatTab || 'independent';

    this.container.innerHTML = `
      <div class="max-w-4xl mx-auto px-4 py-8 space-y-6 animate-fadeIn">
        
        <!-- ヘッダー -->
        <div class="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div class="flex items-center gap-3">
            <span class="text-3xl">📖</span>
            <div>
              <h2 class="text-2xl font-black text-slate-900 dark:text-white">人称代名詞・所属小詞 完全早見表</h2>
              <p class="text-xs text-slate-500">文頭の独立形（全7格） ＆ 文中の所属小詞 ＆ 再帰語尾</p>
            </div>
          </div>

          <button type="button" id="btn-close-cheatsheet" class="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow transition cursor-pointer">
            特訓メニューへ戻る
          </button>
        </div>

        <!-- タブナビゲーション -->
        <div class="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
          <button type="button" class="tab-btn px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'independent' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300'
          }" data-tab="independent">
            ① 独立人称代名詞 (7格変化)
          </button>
          <button type="button" class="tab-btn px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'enclitic' ? 'bg-purple-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300'
          }" data-tab="enclitic">
            ② 文中人称所属小詞 (-маань, -чинь等)
          </button>
          <button type="button" class="tab-btn px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'reflexive' ? 'bg-amber-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300'
          }" data-tab="reflexive">
            ③ 再帰所属語尾 (自分の〜)
          </button>
          <button type="button" class="tab-btn px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'predicate' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300'
          }" data-tab="predicate">
            ④ 述語人称助詞 (би, чи, бид, та)
          </button>
          <button type="button" class="tab-btn px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'rules' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300'
          }" data-tab="rules">
            ⑤ 文頭 vs 文中 配置ルール総まとめ
          </button>
        </div>

        <!-- タブコンテンツ -->
        <div class="space-y-6">
          ${activeTab === 'independent' ? this.renderIndependentTableHTML() : ''}
          ${activeTab === 'enclitic' ? this.renderEncliticTableHTML() : ''}
          ${activeTab === 'reflexive' ? this.renderReflexiveTableHTML() : ''}
          ${activeTab === 'predicate' ? this.renderPredicateTableHTML() : ''}
          ${activeTab === 'rules' ? this.renderPositionRulesHTML() : ''}
        </div>

      </div>
    `;

    this.container.querySelector('#btn-close-cheatsheet').addEventListener('click', () => {
      this.state.view = 'menu';
      this.renderMenu();
    });

    this.container.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.state.activeCheatTab = btn.getAttribute('data-tab');
        this.renderCheatsheet();
      });
    });

    // 表内の音声ボタン
    this.container.querySelectorAll('.btn-speak-cell').forEach(btn => {
      btn.addEventListener('click', () => {
        const word = btn.getAttribute('data-word');
        if (word) SpeechService.speak(word);
      });
    });
  }

  // 早見表サブレンダラー①: 独立代名詞7格
  static renderIndependentTableHTML() {
    const list = PRONOUN_TABLES.independent || [];
    return `
      <div class="space-y-4">
        <div class="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
          <strong>💡 独立人称代名詞の特徴:</strong> 主に文頭や主語・目的語として独立して使われます。モンゴル語では各人称ごとに7つの格（主格・属格・対格・与位置格・奪格・造格・共同格）へ規則的・不規則に変化します。
        </div>

        <div class="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900">
          <table class="w-full text-xs text-left border-collapse min-w-[700px]">
            <thead>
              <tr class="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                <th class="p-3">人称</th>
                <th class="p-3">主格 (〜は)</th>
                <th class="p-3">属格 (〜の)</th>
                <th class="p-3">対格 (〜を)</th>
                <th class="p-3">与位置格 (〜に)</th>
                <th class="p-3">奪格 (〜から)</th>
                <th class="p-3">造格 (〜で)</th>
                <th class="p-3">共同格 (〜と)</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              ${list.map(row => `
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="p-3 font-bold text-slate-900 dark:text-slate-100">
                    <div>${row.person}</div>
                    <div class="text-[10px] text-slate-500 font-normal">(${row.meaning})</div>
                  </td>
                  <td class="p-3">
                    <span class="cyrillic-text font-bold text-blue-600 dark:text-blue-400 text-sm">${row.forms.nominative.mn}</span>
                    <div class="text-[10px] text-slate-400">[${row.forms.nominative.pron}]</div>
                  </td>
                  <td class="p-3">
                    <span class="cyrillic-text font-bold text-indigo-600 dark:text-indigo-400">${row.forms.genitive.mn}</span>
                    <div class="text-[10px] text-slate-400">[${row.forms.genitive.pron}]</div>
                  </td>
                  <td class="p-3">
                    <span class="cyrillic-text font-bold text-emerald-600 dark:text-emerald-400">${row.forms.accusative.mn}</span>
                    <div class="text-[10px] text-slate-400">[${row.forms.accusative.pron}]</div>
                  </td>
                  <td class="p-3">
                    <span class="cyrillic-text font-bold text-amber-600 dark:text-amber-400">${row.forms.dative.mn}</span>
                    <div class="text-[10px] text-slate-400">[${row.forms.dative.pron}]</div>
                  </td>
                  <td class="p-3">
                    <span class="cyrillic-text font-bold text-rose-600 dark:text-rose-400">${row.forms.ablative.mn}</span>
                    <div class="text-[10px] text-slate-400">[${row.forms.ablative.pron}]</div>
                  </td>
                  <td class="p-3">
                    <span class="cyrillic-text font-bold text-teal-600 dark:text-teal-400">${row.forms.instrumental.mn}</span>
                    <div class="text-[10px] text-slate-400">[${row.forms.instrumental.pron}]</div>
                  </td>
                  <td class="p-3">
                    <span class="cyrillic-text font-bold text-purple-600 dark:text-purple-400">${row.forms.comitative.mn}</span>
                    <div class="text-[10px] text-slate-400">[${row.forms.comitative.pron}]</div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // 早見表サブレンダラー②: 文中人称所属小詞
  static renderEncliticTableHTML() {
    const list = PRONOUN_TABLES.enclitics || [];
    return `
      <div class="space-y-4">
        <div class="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-xs text-purple-800 dark:text-purple-300 leading-relaxed">
          <strong>💡 文中人称所属小詞の特徴:</strong> 名詞の直後（語末）にくっつき、「私の〜」「君の〜」「彼の〜」を表します。文頭に単独で置くことはできません。文頭の属格（Миний, Чиний）と併用して感情を強調することも可能です。
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${list.map(e => `
            <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div class="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <div class="flex items-center gap-2">
                  <span class="text-xl font-black cyrillic-text text-purple-600 dark:text-purple-400">${e.form}</span>
                  <span class="text-xs text-slate-400 font-bold">[${e.pron}]</span>
                </div>
                <span class="px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-xs font-bold">
                  ${e.person}
                </span>
              </div>
              <div class="text-sm font-bold text-slate-800 dark:text-slate-100">${e.meaning}</div>
              <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">${e.usage}</p>
              
              <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-1">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold cyrillic-text text-slate-800 dark:text-slate-100">${e.exampleMn}</span>
                  <button type="button" class="btn-speak-cell text-xs text-slate-400 hover:text-blue-600 cursor-pointer" data-word="${e.exampleMn}">🔊</button>
                </div>
                <div class="text-[11px] text-slate-500 font-medium">訳: ${e.exampleJa}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // 早見表サブレンダラー③: 再帰所属語尾
  static renderReflexiveTableHTML() {
    const list = PRONOUN_TABLES.reflexiveSuffixes || [];
    return `
      <div class="space-y-4">
        <div class="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
          <strong>💡 再帰所属語尾（自分の〜）の特徴:</strong> 主語自身が所有する名詞の末尾に着けます。母音調和により -аа / -ээ / -оо / -өө または -гаа / -гээ が選択されます。第三者の所有を表す「-нь」との違いが試験最頻出ポイントです！
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${list.map(r => `
            <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div class="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span class="text-lg font-black cyrillic-text text-amber-600 dark:text-amber-400">${r.form}</span>
                <span class="text-xs font-bold text-slate-500">${r.condition}</span>
              </div>
              <div class="text-sm font-bold text-slate-800 dark:text-slate-100">${r.meaning}</div>
              
              <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-1">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold cyrillic-text text-slate-800 dark:text-slate-100">${r.exampleMn}</span>
                  <button type="button" class="btn-speak-cell text-xs text-slate-400 hover:text-blue-600 cursor-pointer" data-word="${r.exampleMn}">🔊</button>
                </div>
                <div class="text-[11px] text-slate-500 font-medium">訳: ${r.exampleJa}</div>
              </div>
            </div>
          `).join('')}
        </div>

        <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-indigo-200 dark:border-indigo-900 shadow-sm space-y-2">
          <h4 class="font-bold text-sm text-indigo-700 dark:text-indigo-300">⚡ 最重要比較: 自分（再帰語尾） vs 他人（3人称小詞 -нь）</h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
            <div class="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800">
              <div class="font-black cyrillic-text text-indigo-700 dark:text-indigo-300 text-sm">Тэр номоо авсан.</div>
              <div class="text-slate-600 dark:text-slate-400 mt-1">彼は【自分の】本を取った（再帰所属）</div>
            </div>
            <div class="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800">
              <div class="font-black cyrillic-text text-purple-700 dark:text-purple-300 text-sm">Тэр номыг нь авсан.</div>
              <div class="text-slate-600 dark:text-slate-400 mt-1">彼は【彼の（誰か別の人の）】本を取った（3人称小詞）</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // 早見表サブレンダラー④: 述語人称助詞
  static renderPredicateTableHTML() {
    const list = PRONOUN_TABLES.predicateParticles || [];
    return `
      <div class="space-y-4">
        <div class="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed">
          <strong>💡 述語人称助詞（文末助詞）の特徴:</strong> 名詞述語などの文末に添えて、主語の人称（私・君・私たち・あなた）を明確に強調します。
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${list.map(p => `
            <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div class="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span class="text-xl font-black cyrillic-text text-emerald-600 dark:text-emerald-400">... ${p.particle}</span>
                <span class="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">${p.person}</span>
              </div>
              <div class="text-sm font-bold text-slate-800 dark:text-slate-100">${p.meaning}</div>
              
              <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-1">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold cyrillic-text text-slate-800 dark:text-slate-100">${p.exampleMn}</span>
                  <button type="button" class="btn-speak-cell text-xs text-slate-400 hover:text-blue-600 cursor-pointer" data-word="${p.exampleMn}">🔊</button>
                </div>
                <div class="text-[11px] text-slate-500 font-medium">訳: ${p.exampleJa}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // 早見表サブレンダラー⑤: 文頭 vs 文中の配置ルール総まとめ
  static renderPositionRulesHTML() {
    return `
      <div class="space-y-5">
        <div class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 class="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>🎯 文頭 vs 文中の位置ルール決定版</span>
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div class="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 space-y-2">
              <div class="font-black text-blue-700 dark:text-blue-300 text-sm flex items-center gap-1.5">
                <span>🔵</span>
                <span>【文頭につけるもの】独立人称代名詞</span>
              </div>
              <ul class="space-y-1.5 text-slate-700 dark:text-slate-300 leading-relaxed list-disc list-inside">
                <li>主格（<strong>Би, Чи, Та, Тэр, Бид, Тэд</strong>）: 文全体の主語「〜は」となる。</li>
                <li>文頭の属格（<strong>Миний, Чиний, Таны, Түүний</strong>）: 後続の名詞を修飾する。</li>
                <li>文頭の目的語（<strong>Намайг, Чамайг, Түүнийг</strong>）: 動詞の目的語「〜を」。</li>
                <li>文頭の与格（<strong>Надад, Чамд, Танд</strong>）: 「私に〜がある（所有）」など。</li>
              </ul>
            </div>

            <div class="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 space-y-2">
              <div class="font-black text-purple-700 dark:text-purple-300 text-sm flex items-center gap-1.5">
                <span>🟣</span>
                <span>【文中に着けるもの】人称小詞・再帰語尾</span>
              </div>
              <ul class="space-y-1.5 text-slate-700 dark:text-slate-300 leading-relaxed list-disc list-inside">
                <li>人称小詞（<strong>-маань, -минь, -чинь, -тань, -нь</strong>）: <strong>名詞の直後</strong>に後置して「〜の」を表す。文頭単独配置は絶対不可！</li>
                <li>再帰所属語尾（<strong>-аа / -ээ / -оо / -өө</strong>）: 主語自身の所有物であることを名詞の末尾に示す。</li>
                <li>併用表現（<strong>Миний ээж маань</strong>）: 文頭属格＋文中所属小詞で親愛・敬愛を強調。</li>
              </ul>
            </div>
          </div>

          <div class="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-1">
            <strong class="text-slate-900 dark:text-white">判定のコツ:</strong>
            <p>空欄が文頭にあり後ろに名詞が続いているなら ➔ 独立属格（Миний, Таны等）</p>
            <p>空欄が名詞（Ээж, Нэр, Хоолой）の直後にくっついているなら ➔ 人称小詞（-маань, -чинь, -нь等）</p>
          </div>
        </div>
      </div>
    `;
  }
}
