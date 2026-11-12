// ============================================================
// モンゴル語 指示代名詞・場所＆時間後置詞マスター特訓コンポーネント (SpatialPostpositionMaster)
// 豊富なインラインSVGイラスト図解・4択特訓・詳細解説・音声・図解リファレンスシート
// ============================================================

import { SPATIAL_CATEGORIES, SPATIAL_SVGS, SPATIAL_ITEMS, spatialQuizzes } from '../data/spatialPostpositionData.js';
import { SpeechService } from '../services/speech.js';
import { SoundEffects, shuffleArray, scrollToQuizTop, renderClickableWordsHTML, renderChoiceExplanationsHTML, renderReviewToggleButtonHTML, bindReviewToggleButtons } from '../utils/helpers.js';
import { GamificationService } from '../services/gamification.js';
import { StorageService } from '../services/storage.js';
import { PenguinMascot } from './PenguinMascot.js';

export class SpatialPostpositionMasterComponent {
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
    score: 0,
    combo: 0,
    maxCombo: 0,
    xpEarned: 0,
    results: [],
    activeCheatTab: 'all', // 'all' | 'spatial' | 'demonstrative' | 'temporal'
    cheatSearch: ''
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
    const totalAllCount = spatialQuizzes.length;

    // カテゴリごとの問題数カウント
    const categoryCounts = {};
    spatialQuizzes.forEach(q => {
      categoryCounts[q.category] = (categoryCounts[q.category] || 0) + 1;
    });

    const activeCatData = SPATIAL_CATEGORIES.find(c => c.id === this.state.activeCategory) || SPATIAL_CATEGORIES[0];

    this.container.innerHTML = `
      <div class="animate-fade-in max-w-4xl mx-auto px-4 py-5 space-y-6">
        
        <!-- ヘッダーナビゲーション -->
        <div class="flex items-center justify-between border-b border-slate-200 pb-3">
          <div class="flex items-center gap-2.5">
            <span class="text-3xl">🧭</span>
            <div>
              <h2 class="text-xl font-black text-slate-900 tracking-tight">指示詞・場所・時間マスター</h2>
              <p class="text-xs text-slate-500 font-bold">かわいいイラスト図解で指示代名詞＆空間・時間後置詞を完全攻略！</p>
            </div>
          </div>
          <button id="btn-back-home" class="px-3.5 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all flex items-center gap-1">
            <span>🏠</span>
            <span>ホームへ</span>
          </button>
        </div>

        <!-- ヒーロー紹介バナー -->
        <div class="bg-gradient-to-br from-indigo-600 via-sky-600 to-teal-600 rounded-2xl p-5 text-white shadow-md relative overflow-hidden">
          <div class="relative z-10 space-y-2">
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-0.5 rounded-full text-2xs font-black uppercase tracking-wider bg-white/20 backdrop-blur-xs text-white border border-white/30">
                🎨 イラスト特化モード (全${totalAllCount}問)
              </span>
              <span class="px-2.5 py-0.5 rounded-full text-2xs font-black bg-amber-400 text-amber-950">
                ⭐ 毎回詳しい解説付き
              </span>
            </div>
            <h3 class="text-lg sm:text-xl font-black tracking-tight">
              「これ・あれ・ここ・あそこ」＆「上・下・中・前・後・間・〜まで」
            </h3>
            <p class="text-xs text-sky-100 max-w-2xl leading-relaxed">
              日本語とモンゴル語で対応関係が混乱しやすい指示代名詞（энэ / тэр / энд / тэнд / наашаа / цаашаа）と、
              位置・空間・時間を表す必須後置詞（дээр / доор / дотор / өмнө / хойно / хооронд / дунд / хүртэл / турш）を、
              かわいいペンギンのイラスト図解付きで直感的に覚えられる特訓モードです。
            </p>
            
            <div class="pt-2 flex flex-wrap gap-2.5">
              <button id="btn-open-cheatsheet-hero" class="px-4 py-2 bg-white text-indigo-700 hover:bg-indigo-50 font-black rounded-xl text-xs shadow-sm transition-all flex items-center gap-1.5 hover:scale-105">
                <span>📖</span>
                <span>イラスト図解シートを見る (${SPATIAL_ITEMS.length}項目)</span>
              </button>
              <button id="btn-quick-start-all" class="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-amber-950 font-black rounded-xl text-xs shadow-sm transition-all flex items-center gap-1.5 hover:scale-105">
                <span>⚡</span>
                <span>すぐ始める (ランダム10問)</span>
              </button>
            </div>
          </div>
        </div>

        <!-- クイック特訓カード (4分野) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          ${SPATIAL_CATEGORIES.map(cat => {
            const count = cat.id === 'all' ? totalAllCount : (categoryCounts[cat.id] || 0);
            const isSelected = this.state.activeCategory === cat.id;
            return `
              <div class="btn-category-card cursor-pointer p-4 rounded-xl border-2 transition-all flex flex-col justify-between ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/70 shadow-sm ring-2 ring-indigo-500/20'
                  : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50/80 shadow-2xs'
              }" data-cat="${cat.id}">
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-2xl">${cat.icon}</span>
                    <span class="text-xs font-black px-2 py-0.5 rounded-full ${
                      isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                    }">
                      ${count}問
                    </span>
                  </div>
                  <h4 class="font-black text-sm text-slate-800">${cat.name}</h4>
                  <p class="text-2xs text-slate-500 mt-1 leading-normal line-clamp-2">${cat.desc}</p>
                </div>
                <div class="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-2xs font-bold ${
                  isSelected ? 'text-indigo-600' : 'text-slate-400'
                }">
                  <span>${isSelected ? '選択中' : '選択する'}</span>
                  <span>→</span>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- 出題設定パネル -->
        <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-5">
          <div class="flex items-center gap-2 border-b border-slate-100 pb-3">
            <span class="text-lg">⚙️</span>
            <h3 class="font-black text-sm text-slate-800">出題オプション</h3>
          </div>

          <!-- 問題数選択 -->
          <div>
            <label class="block text-xs font-black text-slate-700 mb-2">出題数を選択</label>
            <div class="grid grid-cols-2 sm:grid-cols-5 gap-2">
              ${[5, 10, 20, 'all', 'custom'].map(cnt => {
                let label = cnt === 'all' ? `全問 (${this.getMaxQuestionsForActiveCategory()}問)` : cnt === 'custom' ? 'カスタム指定' : `${cnt}問`;
                const isSelected = (cnt === 'all' && this.state.questionCount === 'all') ||
                                   (cnt === 'custom' && this.state.questionCount === 'custom') ||
                                   (this.state.questionCount === cnt);
                return `
                  <button type="button" class="btn-question-count py-2.5 px-3 rounded-xl border-2 font-bold text-xs transition-all ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-2xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }" data-count="${cnt}">
                    ${label}
                  </button>
                `;
              }).join('')}
            </div>

            <!-- カスタム問題数入力欄 -->
            <div id="custom-count-wrapper" class="${this.state.questionCount === 'custom' ? '' : 'hidden'} mt-3 flex items-center gap-2">
              <span class="text-xs text-slate-500 font-bold">問題数を指定:</span>
              <input type="number" id="input-custom-count" min="1" max="${totalAllCount}" value="${this.state.customCountInput}" class="w-20 px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-bold text-center focus:ring-2 focus:ring-indigo-500 focus:outline-hidden" />
              <span class="text-xs text-slate-500 font-bold">問 (最大 ${totalAllCount}問)</span>
            </div>
          </div>

          <!-- スタートボタン -->
          <div class="pt-2">
            <button id="btn-start-quiz" class="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-700 hover:to-sky-700 text-white font-black text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98">
              <span>🚀</span>
              <span>特訓を開始する (「${activeCatData.name}」)</span>
            </button>
          </div>
        </div>

        <!-- 3分野の早見イラスト紹介バナー -->
        <div class="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-lg">👀</span>
              <h4 class="text-xs font-black text-slate-800">マスターできるイラスト図解の例</h4>
            </div>
            <button id="btn-open-cheatsheet-bottom" class="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1">
              <span>全${SPATIAL_ITEMS.length}項目の図解シートを開く</span>
              <span>→</span>
            </button>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            ${[
              { key: 'box_on', label: 'дээр (上)', cat: '空間' },
              { key: 'box_under', label: 'доор (下)', cat: '空間' },
              { key: 'point_this', label: 'энэ (これ)', cat: '指示詞' },
              { key: 'time_before', label: 'өмнө (前)', cat: '時間' }
            ].map(item => `
              <div class="bg-white rounded-xl border border-slate-200 p-2.5 flex flex-col items-center text-center shadow-2xs hover:shadow-xs transition-all">
                <div class="w-full h-20 sm:h-24 flex items-center justify-center overflow-hidden rounded-lg">
                  ${SPATIAL_SVGS[item.key] || ''}
                </div>
                <div class="mt-2">
                  <span class="text-2xs font-black px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600">${item.cat}</span>
                  <div class="text-xs font-black text-slate-800 mt-0.5">${item.label}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

      </div>
    `;

    // イベントリスナー設定
    this.container.querySelector('#btn-back-home').addEventListener('click', () => {
      if (this.onNavigate) this.onNavigate('home');
    });

    const openCheatsheet = () => {
      this.state.view = 'cheatsheet';
      this.renderCheatsheet();
    };

    const heroCheatBtn = this.container.querySelector('#btn-open-cheatsheet-hero');
    if (heroCheatBtn) heroCheatBtn.addEventListener('click', openCheatsheet);

    const bottomCheatBtn = this.container.querySelector('#btn-open-cheatsheet-bottom');
    if (bottomCheatBtn) bottomCheatBtn.addEventListener('click', openCheatsheet);

    this.container.querySelector('#btn-quick-start-all').addEventListener('click', () => {
      this.startQuiz('all', 10);
    });

    // カテゴリカード選択
    this.container.querySelectorAll('.btn-category-card').forEach(card => {
      card.addEventListener('click', () => {
        this.state.activeCategory = card.dataset.cat;
        this.renderMenu();
      });
    });

    // 問題数選択ボタン
    this.container.querySelectorAll('.btn-question-count').forEach(btn => {
      btn.addEventListener('click', () => {
        const cnt = btn.dataset.count;
        if (cnt === 'all') {
          this.state.questionCount = 'all';
        } else if (cnt === 'custom') {
          this.state.questionCount = 'custom';
        } else {
          this.state.questionCount = parseInt(cnt, 10);
        }
        this.renderMenu();
      });
    });

    // カスタム問題数入力
    const customInput = this.container.querySelector('#input-custom-count');
    if (customInput) {
      customInput.addEventListener('input', (e) => {
        this.state.customCountInput = e.target.value;
      });
    }

    // スタートボタン
    this.container.querySelector('#btn-start-quiz').addEventListener('click', () => {
      let count = this.state.questionCount;
      if (count === 'custom') {
        const val = parseInt(this.state.customCountInput, 10);
        count = isNaN(val) || val < 1 ? 10 : val;
      }
      this.startQuiz(this.state.activeCategory, count);
    });
  }

  static getMaxQuestionsForActiveCategory() {
    if (this.state.activeCategory === 'all') {
      return spatialQuizzes.length;
    }
    return spatialQuizzes.filter(q => q.category === this.state.activeCategory).length;
  }

  // ============================================================
  // 2. クイズ開始処理 (Start Quiz)
  // ============================================================
  static startQuiz(category = 'all', count = 10, customList = null) {
    let pool = [];
    if (customList && customList.length > 0) {
      pool = customList;
    } else if (category === 'all') {
      pool = [...spatialQuizzes];
    } else {
      pool = spatialQuizzes.filter(q => q.category === category);
    }

    if (pool.length === 0) {
      alert('選択したカテゴリの問題がありません。');
      return;
    }

    // シャッフル
    const shuffled = shuffleArray([...pool]);

    let finalCount = pool.length;
    if (count !== 'all') {
      finalCount = Math.min(parseInt(count, 10) || 10, shuffled.length);
    }

    this.state.quizzes = shuffled.slice(0, finalCount);
    this.state.currentIndex = 0;
    this.state.score = 0;
    this.state.combo = 0;
    this.state.maxCombo = 0;
    this.state.xpEarned = 0;
    this.state.results = [];
    this.state.view = 'testing';

    this.prepareQuestion();
    this.renderTesting();
  }

  static prepareQuestion() {
    const quiz = this.state.quizzes[this.state.currentIndex];
    this.state.currentQuiz = quiz;
    this.state.shuffledOptions = shuffleArray([...quiz.options]);
    this.state.selectedOption = null;
    this.state.hasAnswered = false;
    this.state.isCorrect = false;
  }

  // ============================================================
  // 3. テスト画面 (Testing View)
  // ============================================================
  static renderTesting() {
    scrollToQuizTop(this.container);

    const quiz = this.state.currentQuiz;
    const total = this.state.quizzes.length;
    const current = this.state.currentIndex + 1;
    const progressPercent = Math.round((current / total) * 100);

    // カテゴリバッジ
    let catBadge = '';
    if (quiz.category === 'spatial') {
      catBadge = '<span class="px-2 py-0.5 rounded-full text-2xs font-black bg-blue-100 text-blue-700">📍 空間・場所の後置詞</span>';
    } else if (quiz.category === 'demonstrative') {
      catBadge = '<span class="px-2 py-0.5 rounded-full text-2xs font-black bg-purple-100 text-purple-700">👉 指示代名詞・方向詞</span>';
    } else if (quiz.category === 'temporal') {
      catBadge = '<span class="px-2 py-0.5 rounded-full text-2xs font-black bg-emerald-100 text-emerald-700">⏰ 時間の後置詞</span>';
    }

    // SVGイラスト
    const svgCode = SPATIAL_SVGS[quiz.svgKey] || `
      <div class="w-full h-full flex items-center justify-center bg-slate-100 rounded-xl text-4xl">
        🧭
      </div>
    `;

    // 穴埋め文（空白は強調表示）
    const highlightedPrompt = quiz.prompt.replace(
      '___',
      '<span class="inline-block px-3 py-0.5 mx-1 border-b-2 border-indigo-600 bg-indigo-50 text-indigo-700 font-black rounded-sm min-w-16 text-center">？</span>'
    );

    this.container.innerHTML = `
      <div class="animate-fade-in max-w-2xl mx-auto px-4 py-4 space-y-4">
        
        <!-- トップバー (進行バー・コンボ・中断) -->
        <div class="space-y-2">
          <div class="flex items-center justify-between text-xs font-bold text-slate-500">
            <button id="btn-abort-test" class="text-slate-400 hover:text-slate-600 flex items-center gap-1 transition-colors">
              <span>✕</span>
              <span>終了</span>
            </button>
            <div class="flex items-center gap-3">
              <span class="text-slate-700 font-black">第 ${current} 問 / 全 ${total} 問</span>
              ${
                this.state.combo >= 2
                  ? `<span class="px-2 py-0.5 rounded-full text-2xs font-black bg-amber-100 text-amber-800 animate-pulse">🔥 ${this.state.combo} 連続正解！</span>`
                  : ''
              }
              <span class="text-indigo-600 font-black">+${this.state.xpEarned} XP</span>
            </div>
          </div>
          <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div class="bg-gradient-to-r from-indigo-500 to-sky-500 h-2 rounded-full transition-all duration-300" style="width: ${progressPercent}%"></div>
          </div>
        </div>

        <!-- イラスト表示カード -->
        <div class="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col items-center space-y-3">
          <div class="flex items-center justify-between w-full">
            <div>${catBadge}</div>
            <button id="btn-speak-prompt" class="px-2.5 py-1 text-xs font-bold text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 rounded-lg transition-all flex items-center gap-1">
              <span>🔊</span>
              <span>音声</span>
            </button>
          </div>

          <!-- メインSVGグラフィックイラスト -->
          <div class="w-full max-w-sm h-44 sm:h-52 rounded-xl overflow-hidden flex items-center justify-center p-1 bg-slate-50/50">
            ${svgCode}
          </div>

          <!-- モンゴル語問題文 -->
          <div class="w-full text-center space-y-1.5 pt-1">
            <div class="text-base sm:text-lg font-black text-slate-900 tracking-wide leading-relaxed">
              ${highlightedPrompt}
            </div>
            <div class="text-xs sm:text-sm font-bold text-slate-500">
              ${quiz.promptJa}
            </div>
          </div>
        </div>

        <!-- 選択肢ボタン (4択) -->
        <div id="spatial-options-container" class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          ${this.state.shuffledOptions.map((opt, idx) => {
            let btnStyle = 'border-slate-200 bg-white hover:border-indigo-400 hover:bg-indigo-50/50 text-slate-800';
            let icon = `<span class="w-6 h-6 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-center">${idx + 1}</span>`;

            if (this.state.hasAnswered) {
              if (opt === quiz.answer) {
                btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-black ring-2 ring-emerald-400/40 shadow-xs';
                icon = '<span class="w-6 h-6 rounded-lg bg-emerald-500 text-white text-xs font-bold flex items-center justify-center">✓</span>';
              } else if (opt === this.state.selectedOption) {
                btnStyle = 'border-rose-400 bg-rose-50 text-rose-900 line-through';
                icon = '<span class="w-6 h-6 rounded-lg bg-rose-500 text-white text-xs font-bold flex items-center justify-center">✕</span>';
              } else {
                btnStyle = 'border-slate-200 bg-slate-50 text-slate-400 opacity-60';
              }
            }

            return `
              <button type="button" class="btn-spatial-option w-full py-3 px-4 rounded-xl border-2 font-black text-sm text-left transition-all flex items-center gap-3 ${btnStyle}" data-option="${opt}" ${
                this.state.hasAnswered ? 'disabled' : ''
              }>
                ${icon}
                <span class="flex-1 text-base font-bold">${opt}</span>
              </button>
            `;
          }).join('')}
        </div>

        <!-- 回答後の詳細解説エリア（WordTest / GrammarTest と完全統一） -->
        <div id="spatial-explanation-area" class="${this.state.hasAnswered ? '' : 'hidden'} animate-fade-in space-y-3.5">
          <div class="p-4 sm:p-5 rounded-2xl border ${
            this.state.isCorrect
              ? 'bg-emerald-50/95 border-emerald-300 text-emerald-950'
              : 'bg-rose-50/95 border-rose-300 text-rose-950'
          } shadow-sm space-y-3.5">
            
            <div class="flex items-center justify-between border-b ${
              this.state.isCorrect ? 'border-emerald-200' : 'border-rose-200'
            } pb-3">
              <div class="flex items-center gap-2.5">
                <span class="text-2xl">${this.state.isCorrect ? '⭕' : '❌'}</span>
                <div>
                  <h4 class="font-black text-base">
                    ${this.state.isCorrect ? '正解です！' : '不正解'}
                  </h4>
                  <div class="text-xs font-bold ${this.state.isCorrect ? 'text-emerald-800' : 'text-rose-800'}">
                    正解: <span class="font-black text-base cyrillic-text">${quiz.answer}</span>
                    ${(() => {
                      const itemInfo = SPATIAL_ITEMS.find(it => it.word === quiz.answer);
                      return itemInfo ? `<span class="text-slate-600 font-normal ml-1.5">[${itemInfo.pronunciation}] ${itemInfo.japanese}</span>` : '';
                    })()}
                  </div>
                </div>
              </div>

              <!-- 音声再生ボタン -->
              <button type="button" id="btn-speak-answer" class="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 inline-flex items-center gap-1 shadow-2xs cursor-pointer">
                <span>🔊</span> 発音を聞く
              </button>
            </div>

            ${!this.state.isCorrect && this.state.selectedOption ? `
              <div class="text-xs text-rose-700 bg-rose-100/70 p-2.5 rounded-xl border border-rose-200 font-bold">
                あなたの回答: <span class="line-through">${this.state.selectedOption}</span>
              </div>
            ` : ''}

            <!-- 接続ルール解説 -->
            ${(() => {
              const itemInfo = SPATIAL_ITEMS.find(it => it.word === quiz.answer);
              return itemInfo && itemInfo.caseRequirement ? `
                <div class="bg-white/90 rounded-xl p-3 border border-slate-200/80 text-xs space-y-1">
                  <div class="font-bold text-indigo-900 flex items-center gap-1">
                    <span>📐</span> 文法接続ルール:
                  </div>
                  <div class="font-black text-slate-800">
                    ${itemInfo.caseRequirement}
                  </div>
                </div>
              ` : '';
            })()}

            <!-- 詳しい解説文 -->
            <div class="text-xs font-medium leading-relaxed whitespace-pre-line text-slate-800 bg-white/80 rounded-xl p-3.5 border border-slate-200/60">
              ${quiz.explanation}
            </div>

            <!-- 4択の選択肢全解説アコーディオン（WordTest / GrammarTest と完全統一） -->
            ${(typeof renderChoiceExplanationsHTML === 'function') ? renderChoiceExplanationsHTML(this.state.shuffledOptions, {
              expectedAnswer: quiz.answer,
              userAnswer: this.state.selectedOption
            }) : ''}

            <!-- 次の問題へボタン (Enter対応) -->
            <div class="pt-1">
              <button type="button" id="btn-next-question" class="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl shadow-md transition-all active:scale-98 text-sm flex items-center justify-center gap-1.5 cursor-pointer">
                <span>${current < total ? '次の問題へ（Enter） →' : '結果を見る 🎉'}</span>
              </button>
            </div>

          </div>
        </div>

      </div>
    `;

    // （問題中の単語タップ辞書モーダルは他モードと統一のため除去）

    // 中断ボタン
    this.container.querySelector('#btn-abort-test').addEventListener('click', () => {
      if (confirm('特訓を中断してメニューに戻りますか？')) {
        this.state.view = 'menu';
        this.renderMenu();
      }
    });

    // 問題文音声再生
    const speakPromptBtn = this.container.querySelector('#btn-speak-prompt');
    if (speakPromptBtn) {
      speakPromptBtn.addEventListener('click', () => {
        // ___ を正解単語に置き換えて自然に再生
        const cleanText = quiz.prompt.replace('___', quiz.answer);
        SpeechService.speak(cleanText);
      });
    }

    // 選択肢クリック
    this.container.querySelectorAll('.btn-spatial-option').forEach(btn => {
      btn.addEventListener('click', () => {
        if (this.state.hasAnswered) return;
        this.handleAnswer(btn.dataset.option);
      });
    });

    // 正解音声再生
    const speakAnsBtn = this.container.querySelector('#btn-speak-answer');
    if (speakAnsBtn) {
      speakAnsBtn.addEventListener('click', () => {
        SpeechService.speak(quiz.answer);
      });
    }

    // 次へボタン
    const nextBtn = this.container.querySelector('#btn-next-question');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        this.goToNext();
      });
    }
  }

  // ============================================================
  // 4. 回答処理 (Answer Handler)
  // ============================================================
  static handleAnswer(selectedOption) {
    if (this.state.hasAnswered) return;

    const quiz = this.state.currentQuiz;
    const isCorrect = selectedOption === quiz.answer;

    this.state.hasAnswered = true;
    this.state.selectedOption = selectedOption;
    this.state.isCorrect = isCorrect;

    if (isCorrect) {
      SoundEffects.playCorrect();
      this.state.score += 1;
      this.state.combo += 1;
      if (this.state.combo > this.state.maxCombo) {
        this.state.maxCombo = this.state.combo;
      }
      const earned = 15 + Math.min(this.state.combo * 2, 10);
      this.state.xpEarned += earned;
      try {
        GamificationService.addXp(earned, 'spatial_master');
      } catch (_) {}
    } else {
      SoundEffects.playIncorrect();
      this.state.combo = 0;
      // 苦手ノート・ミスリストへの記録
      try {
        StorageService.recordMistake({
          id: quiz.id,
          type: 'spatial_postposition',
          mongolian: quiz.answer,
          japanese: quiz.promptJa,
          question: quiz.prompt,
          category: quiz.category,
          date: new Date().toISOString()
        });
      } catch (_) {}
    }

    this.state.results.push({
      quiz: quiz,
      userAnswer: selectedOption,
      isCorrect: isCorrect
    });

    // 画面再描画（解説を表示）
    this.renderTesting();
  }

  static goToNext() {
    this.state.currentIndex += 1;
    if (this.state.currentIndex < this.state.quizzes.length) {
      this.prepareQuestion();
      this.renderTesting();
    } else {
      this.state.view = 'result';
      this.renderResult();
    }
  }

  // ============================================================
  // 5. 結果画面 (Result View)
  // ============================================================
  static renderResult() {
    scrollToQuizTop(this.container);

    const total = this.state.quizzes.length;
    const score = this.state.score;
    const accuracy = Math.round((score / total) * 100);
    const mistakes = this.state.results.filter(r => !r.isCorrect);

    let mood = 'idle';
    let comment = '';
    if (accuracy === 100) {
      mood = 'celebrate';
      comment = '完璧です！全問正解！指示代名詞と空間・時間後置詞を完全に使いこなせています！🎉';
    } else if (accuracy >= 80) {
      mood = 'happy';
      comment = '素晴らしい成績です！位置関係や時間表現の感覚がしっかり身についています！✨';
    } else if (accuracy >= 60) {
      mood = 'nod';
      comment = 'よく頑張りました！間違えた項目をイラスト図解シートで復習して完璧にしましょう！💪';
    } else {
      mood = 'study';
      comment = '伸びしろがたくさんあります！イラスト図解を見ながらもう一度挑戦してみましょう！';
    }

    const penguinSvg = PenguinMascot.renderSVG ? PenguinMascot.renderSVG(mood, 110) : '';

    this.container.innerHTML = `
      <div class="animate-fade-in max-w-2xl mx-auto px-4 py-6 space-y-6">
        
        <!-- 結果サマリーカード -->
        <div class="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm text-center space-y-4">
          
          <!-- ペンギンマスコット -->
          <div class="w-28 h-28 mx-auto flex items-center justify-center">
            ${penguinSvg}
          </div>

          <div class="space-y-1">
            <span class="text-xs font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              特訓完了！
            </span>
            <h3 class="text-2xl font-black text-slate-900 mt-2">
              ${score} / ${total} 問正解 (${accuracy}%)
            </h3>
            <p class="text-xs font-bold text-slate-600 max-w-md mx-auto pt-1">
              ${comment}
            </p>
          </div>

          <!-- スコア・XPバッジ -->
          <div class="grid grid-cols-3 gap-2.5 pt-2 max-w-sm mx-auto">
            <div class="bg-slate-50 rounded-xl p-2.5 border border-slate-100">
              <div class="text-2xs font-bold text-slate-500">正解数</div>
              <div class="text-base font-black text-slate-800">${score} <span class="text-xs font-normal">/ ${total}</span></div>
            </div>
            <div class="bg-amber-50 rounded-xl p-2.5 border border-amber-100">
              <div class="text-2xs font-bold text-amber-700">最大コンボ</div>
              <div class="text-base font-black text-amber-800">${this.state.maxCombo} 連続</div>
            </div>
            <div class="bg-indigo-50 rounded-xl p-2.5 border border-indigo-100">
              <div class="text-2xs font-bold text-indigo-700">獲得XP</div>
              <div class="text-base font-black text-indigo-800">+${this.state.xpEarned}</div>
            </div>
          </div>

          <!-- アクションボタン -->
          <div class="pt-3 flex flex-wrap gap-2.5 justify-center">
            <button id="btn-retry-all" class="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 active:scale-98">
              <span>🔄</span>
              <span>もう一度挑戦</span>
            </button>
            ${
              mistakes.length > 0
                ? `
                <button id="btn-retry-mistakes" class="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 active:scale-98">
                  <span>❌</span>
                  <span>間違えた${mistakes.length}問だけ復習</span>
                </button>
              `
                : ''
            }
            <button id="btn-result-cheatsheet" class="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs rounded-xl transition-all flex items-center gap-1.5">
              <span>📖</span>
              <span>イラスト図解シートを見る</span>
            </button>
            <button id="btn-result-home" class="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs rounded-xl transition-all flex items-center gap-1.5">
              <span>🏠</span>
              <span>ホームへ</span>
            </button>
          </div>
        </div>

        <!-- 振り返りリスト -->
        <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <div class="flex items-center gap-2">
              <span class="text-lg">📋</span>
              <h4 class="font-black text-sm text-slate-800">問題の振り返り</h4>
            </div>
            <div class="flex items-center gap-1 text-xs">
              <button id="filter-all-results" class="px-2.5 py-1 rounded-lg font-bold bg-indigo-600 text-white text-2xs">すべて (${total})</button>
              ${
                mistakes.length > 0
                  ? `<button id="filter-mistakes-results" class="px-2.5 py-1 rounded-lg font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 text-2xs">ミスのみ (${mistakes.length})</button>`
                  : ''
              }
            </div>
          </div>

          <div id="results-list-container" class="space-y-3">
            ${this.renderResultListItems(this.state.results)}
          </div>
        </div>

      </div>
    `;

    this.container.querySelector('#btn-retry-all').addEventListener('click', () => {
      this.startQuiz(this.state.activeCategory, this.state.quizzes.length);
    });

    const retryMistakesBtn = this.container.querySelector('#btn-retry-mistakes');
    if (retryMistakesBtn) {
      retryMistakesBtn.addEventListener('click', () => {
        const mistakeQuizzes = mistakes.map(m => m.quiz);
        this.startQuiz('all', mistakeQuizzes.length, mistakeQuizzes);
      });
    }

    this.container.querySelector('#btn-result-cheatsheet').addEventListener('click', () => {
      this.state.view = 'cheatsheet';
      this.renderCheatsheet();
    });

    this.container.querySelector('#btn-result-home').addEventListener('click', () => {
      if (this.onNavigate) this.onNavigate('home');
    });

    const filterAll = this.container.querySelector('#filter-all-results');
    const filterMis = this.container.querySelector('#filter-mistakes-results');

    if (filterAll) {
      filterAll.addEventListener('click', () => {
        filterAll.className = 'px-2.5 py-1 rounded-lg font-bold bg-indigo-600 text-white text-2xs';
        if (filterMis) filterMis.className = 'px-2.5 py-1 rounded-lg font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 text-2xs';
        this.container.querySelector('#results-list-container').innerHTML = this.renderResultListItems(this.state.results);
        this.attachResultListEvents();
      });
    }

    if (filterMis) {
      filterMis.addEventListener('click', () => {
        filterMis.className = 'px-2.5 py-1 rounded-lg font-bold bg-rose-600 text-white text-2xs';
        if (filterAll) filterAll.className = 'px-2.5 py-1 rounded-lg font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 text-2xs';
        this.container.querySelector('#results-list-container').innerHTML = this.renderResultListItems(mistakes);
        this.attachResultListEvents();
      });
    }

    this.attachResultListEvents();
  }

  static renderResultListItems(list) {
    if (list.length === 0) {
      return '<div class="text-center py-6 text-xs text-slate-400">該当する問題はありません。</div>';
    }

    return list.map((item, idx) => {
      const q = item.quiz;
      const svgThumb = SPATIAL_SVGS[q.svgKey] || '🧭';
      return `
        <div class="p-3 rounded-xl border ${
          item.isCorrect ? 'border-slate-200 bg-white' : 'border-rose-200 bg-rose-50/40'
        } space-y-2">
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-start gap-2.5 flex-1">
              <span class="text-sm font-black ${item.isCorrect ? 'text-emerald-600' : 'text-rose-600'}">
                ${item.isCorrect ? '✓' : '✕'}
              </span>
              <div class="space-y-1 flex-1">
                <div class="text-xs font-black text-slate-800 leading-snug">
                  ${q.prompt.replace('___', `【${q.answer}】`)}
                </div>
                <div class="text-2xs text-slate-500 font-bold">
                  ${q.promptJa}
                </div>
              </div>
            </div>

            <!-- SVGサムネイル -->
            <div class="w-14 h-12 flex-shrink-0 rounded-lg overflow-hidden border border-slate-100 bg-slate-50">
              ${svgThumb}
            </div>
          </div>

          <div class="pt-1.5 border-t border-slate-100 flex items-center justify-between text-2xs">
            <div class="flex items-center gap-2">
              <span class="font-bold text-slate-500">あなたの回答:</span>
              <span class="font-black ${item.isCorrect ? 'text-emerald-700' : 'text-rose-700 line-through'}">
                ${item.userAnswer}
              </span>
              ${
                !item.isCorrect
                  ? `<span class="font-bold text-slate-500 ml-1">正解:</span> <span class="font-black text-emerald-700">${q.answer}</span>`
                  : ''
              }
            </div>

            <div class="flex items-center gap-2">
              ${(typeof renderReviewToggleButtonHTML === 'function') ? renderReviewToggleButtonHTML({ id: q.id, question: q.prompt, correctAnswer: q.answer, japanese: q.promptJa, category: q.category, type: 'spatial_postposition' }) : ''}
              <button type="button" class="btn-speak-result-item text-slate-400 hover:text-indigo-600 font-bold flex items-center gap-1 p-1 rounded-lg hover:bg-slate-100 cursor-pointer" data-phrase="${q.prompt.replace('___', q.answer)}" title="発音を聞く">
                <span>🔊</span>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  static attachResultListEvents() {
    bindReviewToggleButtons(this.container);
    this.container.querySelectorAll('.btn-speak-result-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const phrase = btn.dataset.phrase;
        if (phrase) SpeechService.speak(phrase);
      });
    });
  }

  // ============================================================
  // 6. イラスト図解シート (Cheatsheet View)
  // ============================================================
  static renderCheatsheet() {
    scrollToQuizTop(this.container);

    const activeTab = this.state.activeCheatTab;
    const query = (this.state.cheatSearch || '').toLowerCase().trim();

    // フィルタリング
    const filteredItems = SPATIAL_ITEMS.filter(item => {
      const matchTab = activeTab === 'all' || item.category === activeTab;
      const matchSearch =
        !query ||
        item.word.toLowerCase().includes(query) ||
        item.japanese.toLowerCase().includes(query) ||
        item.pronunciation.toLowerCase().includes(query) ||
        item.summary.toLowerCase().includes(query);
      return matchTab && matchSearch;
    });

    this.container.innerHTML = `
      <div class="animate-fade-in max-w-4xl mx-auto px-4 py-5 space-y-6">
        
        <!-- ヘッダー -->
        <div class="flex items-center justify-between border-b border-slate-200 pb-3">
          <div class="flex items-center gap-2.5">
            <span class="text-3xl">🎨</span>
            <div>
              <h2 class="text-xl font-black text-slate-900 tracking-tight">イラスト図解シート</h2>
              <p class="text-xs text-slate-500 font-bold">全${SPATIAL_ITEMS.length}項目の空間・指示詞・時間表現をビジュアル解説！</p>
            </div>
          </div>
          <button id="btn-close-cheatsheet" class="px-3.5 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-all flex items-center gap-1">
            <span>←</span>
            <span>メニューに戻る</span>
          </button>
        </div>

        <!-- サブタブ ＆ 検索バー -->
        <div class="space-y-3">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <div class="flex items-center gap-1.5 overflow-x-auto pb-1">
              ${[
                { id: 'all', label: 'すべて (35)' },
                { id: 'spatial', label: '📍 空間・場所 (15)' },
                { id: 'demonstrative', label: '👉 指示詞・方向 (12)' },
                { id: 'temporal', label: '⏰ 時間表現 (8)' }
              ].map(t => `
                <button type="button" class="btn-cheat-subtab px-3.5 py-1.5 rounded-lg text-xs font-black transition-all ${
                  activeTab === t.id
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }" data-tab="${t.id}">
                  ${t.label}
                </button>
              `).join('')}
            </div>

            <!-- 検索インプット -->
            <div class="relative w-full sm:w-64">
              <input type="text" id="input-cheat-search" placeholder="単語・日本語で検索..." value="${this.state.cheatSearch}" class="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden" />
              <span class="absolute left-2.5 top-2 text-xs text-slate-400">🔍</span>
            </div>
          </div>
        </div>

        <!-- カード一覧グリッド -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          ${filteredItems.map(item => {
            const svgCode = SPATIAL_SVGS[item.svgKey] || '🧭';
            return `
              <div class="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-3 group">
                
                <!-- SVGイラストヘッダー -->
                <div>
                  <div class="w-full h-36 rounded-xl overflow-hidden bg-slate-50 p-1 flex items-center justify-center border border-slate-100 group-hover:scale-102 transition-transform">
                    ${svgCode}
                  </div>

                  <!-- 見出し・読み・音声 -->
                  <div class="mt-3 flex items-start justify-between">
                    <div>
                      <div class="flex items-center gap-2">
                        <span class="text-lg font-black text-slate-900 cyrillic-text">${item.word}</span>
                        <span class="text-2xs font-bold text-slate-400">[${item.pronunciation}]</span>
                      </div>
                      <div class="text-xs font-black text-indigo-700 mt-0.5">
                        ${item.japanese}
                      </div>
                    </div>

                    <button class="btn-cheat-speak w-8 h-8 rounded-lg bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 text-xs font-bold flex items-center justify-center transition-all shadow-2xs" data-word="${item.word}">
                      🔊
                    </button>
                  </div>

                  <!-- 接続ルール -->
                  <div class="mt-2.5 px-2.5 py-1.5 bg-slate-50 rounded-lg border border-slate-100 text-2xs space-y-0.5">
                    <span class="font-bold text-slate-500">接続ルール:</span>
                    <span class="font-black text-slate-800">${item.caseRequirement}</span>
                  </div>

                  <!-- 意味・要点 -->
                  <p class="text-2xs text-slate-600 mt-2 leading-relaxed">
                    ${item.explanation}
                  </p>
                </div>

                <!-- 例文エリア -->
                <div class="pt-2 border-t border-slate-100 space-y-1">
                  <div class="text-2xs font-bold text-slate-800 leading-snug cyrillic-text">
                    ${item.example}
                  </div>
                  <div class="text-2xs text-slate-500">
                    ${item.exampleJa}
                  </div>
                </div>

              </div>
            `;
          }).join('')}
        </div>

      </div>
    `;

    // メニューに戻る
    this.container.querySelector('#btn-close-cheatsheet').addEventListener('click', () => {
      this.state.view = 'menu';
      this.renderMenu();
    });

    // サブタブ切り替え
    this.container.querySelectorAll('.btn-cheat-subtab').forEach(btn => {
      btn.addEventListener('click', () => {
        this.state.activeCheatTab = btn.dataset.tab;
        this.renderCheatsheet();
      });
    });

    // 検索入力
    const searchInput = this.container.querySelector('#input-cheat-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.state.cheatSearch = e.target.value;
        this.renderCheatsheet();
      });
    }

    // 音声再生
    this.container.querySelectorAll('.btn-cheat-speak').forEach(btn => {
      btn.addEventListener('click', () => {
        const word = btn.dataset.word;
        if (word) SpeechService.speak(word);
      });
    });
  }

  // ============================================================
  // 7. キーボードショートカット (Keyboard Controls)
  // ============================================================
  static handleKeyDown(e) {
    if (this.state.view !== 'testing') return;

    // 1-4キーで選択
    if (!this.state.hasAnswered) {
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= this.state.shuffledOptions.length) {
        e.preventDefault();
        this.handleAnswer(this.state.shuffledOptions[num - 1]);
        return;
      }
    }

    // Enterキーで次へ
    if (this.state.hasAnswered && e.key === 'Enter') {
      e.preventDefault();
      this.goToNext();
      return;
    }

    // VキーまたはSpaceキーで音声再生
    if (e.key === 'v' || e.key === 'V') {
      if (this.state.currentQuiz) {
        e.preventDefault();
        SpeechService.speak(this.state.currentQuiz.answer);
      }
    }
  }

  static cleanupKeyHandler() {
    if (this.keydownHandler) {
      window.removeEventListener('keydown', this.keydownHandler);
      this.keydownHandler = null;
    }
  }
}
