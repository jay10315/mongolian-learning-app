// ========================================================================
// 複文特化モード（ComplexSentenceMode.js）
// モンゴル語の接続表現・動詞活用・節構造・名詞修飾完全攻略コンポーネント
// 4択空欄補充形式（並べ替えなし） / 10項目詳細解説 / 条件変化What-If / 同一動詞比較 / 弱点マトリックス
// ========================================================================

import { COMPLEX_SENTENCE_CATEGORIES, SAME_VERB_COMPARISONS, CURATED_COMPLEX_QUESTIONS, ComplexSentenceCombinator } from '../data/complexSentenceData.js';
import { StorageService } from '../services/storage.js';
import { SpeechService } from '../services/speech.js';
import { SoundEffects } from '../utils/helpers.js';
import { GamificationService } from '../services/gamification.js';

export class ComplexSentenceComponent {
  static container = null;
  static onNavigate = null;

  static state = {
    view: 'quiz', // 'quiz' | 'random_matrix' | 'same_verb' | 'analytics' | 'mistakes'
    categoryFilter: 'all',
    difficultyFilter: 'all',
    formatFilter: 'all',
    questions: [],
    currentIndex: 0,
    currentQuestion: null,
    hasAnswered: false,
    selectedChoice: null,
    isCorrect: false,
    activeWhatIfTab: 'diff_subject',
    selectedVerbId: 'verb_idekh',
    sessionScore: 0,
    sessionXp: 0,
    userStats: {
      totalAnswered: 0,
      totalCorrect: 0,
      byCategory: {},
      byCondition: {
        same_subject: { total: 0, correct: 0 },
        diff_subject: { total: 0, correct: 0 },
        polarity_pos: { total: 0, correct: 0 },
        polarity_neg: { total: 0, correct: 0 },
        tense_past: { total: 0, correct: 0 },
        tense_future: { total: 0, correct: 0 },
        type_statement: { total: 0, correct: 0 },
        type_question: { total: 0, correct: 0 }
      }
    }
  };

  static keyHandler = null;

  static init(container, onNavigate) {
    this.container = container;
    this.onNavigate = onNavigate;
    this.loadStats();
    this.initQuestions();
    this.render();
  }

  static loadStats() {
    try {
      const saved = localStorage.getItem('mongol_complex_sentence_stats');
      if (saved) {
        const parsed = JSON.parse(saved);
        this.state.userStats = { ...this.state.userStats, ...parsed };
      }
    } catch (_) {}
  }

  static saveStats() {
    try {
      localStorage.setItem('mongol_complex_sentence_stats', JSON.stringify(this.state.userStats));
    } catch (_) {}
  }

  static initQuestions() {
    let list = [...CURATED_COMPLEX_QUESTIONS];
    if (this.state.categoryFilter !== 'all') {
      list = list.filter(q => q.category === this.state.categoryFilter);
    }
    if (this.state.difficultyFilter !== 'all') {
      list = list.filter(q => q.difficulty === this.state.difficultyFilter);
    }
    if (this.state.formatFilter !== 'all') {
      const fmtNum = parseInt(this.state.formatFilter, 10);
      list = list.filter(q => q.format === fmtNum);
    }
    if (list.length === 0) {
      list = [...CURATED_COMPLEX_QUESTIONS];
    }
    // シャッフル
    this.state.questions = [...list].sort(() => Math.random() - 0.5);
    this.state.currentIndex = 0;
    this.loadCurrentQuestion();
  }

  static loadCurrentQuestion() {
    this.cleanupKeyHandler();
    this.state.hasAnswered = false;
    this.state.selectedChoice = null;
    this.state.isCorrect = false;

    if (this.state.view === 'random_matrix') {
      this.state.currentQuestion = ComplexSentenceCombinator.generateRandomQuestion({
        subjectRelation: this.state.matrixSubjectFilter || null,
        polarity: this.state.matrixPolarityFilter || null,
        tense: this.state.matrixTenseFilter || null
      });
    } else {
      if (this.state.questions.length === 0) {
        this.initQuestions();
      }
      this.state.currentQuestion = this.state.questions[this.state.currentIndex] || this.state.questions[0];
    }
    this.setupKeyHandler();
  }

  static cleanupKeyHandler() {
    if (this.keyHandler) {
      window.removeEventListener('keydown', this.keyHandler);
      this.keyHandler = null;
    }
  }

  static setupKeyHandler() {
    this.keyHandler = (e) => {
      // 入力フォーム等フォーカス時は無効
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

      if (!this.state.hasAnswered) {
        if (['1', '2', '3', '4'].includes(e.key)) {
          const idx = parseInt(e.key, 10) - 1;
          const q = this.state.currentQuestion;
          if (q && q.options && q.options[idx]) {
            e.preventDefault();
            this.handleAnswer(q.options[idx]);
          }
        }
      } else {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.nextQuestion();
        }
      }
    };
    window.addEventListener('keydown', this.keyHandler);
  }

  // --- メインレンダラー ---
  static render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="animate-fade-in max-w-4xl mx-auto px-4 py-4 space-y-4">
        
        <!-- ヘッダーバナー -->
        <div class="bg-gradient-to-r from-teal-700 via-emerald-600 to-cyan-700 rounded-2xl p-4 sm:p-5 text-white shadow-md relative overflow-hidden">
          <div class="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative z-10">
            <div class="flex items-center gap-3">
              <span class="text-3xl sm:text-4xl">🔗</span>
              <div>
                <div class="flex items-center gap-2">
                  <h1 class="text-lg sm:text-xl font-black tracking-wide">複文特化マスター</h1>
                  <span class="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-400 text-teal-950 shadow-2xs">完全攻略</span>
                </div>
                <p class="text-xs text-teal-100 mt-0.5">接続表現・動詞副動詞・複文構造・名詞修飾・条件変化を完全制覇</p>
              </div>
            </div>

            <div class="flex items-center gap-2 self-end sm:self-auto">
              <button type="button" id="btn-back-home" class="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all cursor-pointer">
                ✕ ホームへ戻る
              </button>
            </div>
          </div>

          <!-- メインナビゲーションタブ (5モード) -->
          <div class="flex items-center gap-1.5 mt-4 overflow-x-auto pb-1 scrollbar-none text-xs font-bold">
            <button type="button" class="btn-sub-tab px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${this.state.view === 'quiz' ? 'bg-white text-teal-900 shadow-xs' : 'bg-white/15 text-white hover:bg-white/25'}" data-view="quiz">
              🎯 複文クイズ (4択演習)
            </button>
            <button type="button" class="btn-sub-tab px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${this.state.view === 'random_matrix' ? 'bg-white text-teal-900 shadow-xs' : 'bg-white/15 text-white hover:bg-white/25'}" data-view="random_matrix">
              🎲 ランダム組合せ出題
            </button>
            <button type="button" class="btn-sub-tab px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${this.state.view === 'same_verb' ? 'bg-white text-teal-900 shadow-xs' : 'bg-white/15 text-white hover:bg-white/25'}" data-view="same_verb">
              🔄 同一動詞比較マスター
            </button>
            <button type="button" class="btn-sub-tab px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${this.state.view === 'analytics' ? 'bg-white text-teal-900 shadow-xs' : 'bg-white/15 text-white hover:bg-white/25'}" data-view="analytics">
              📊 弱点分析レーダー
            </button>
            <button type="button" class="btn-sub-tab px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${this.state.view === 'mistakes' ? 'bg-white text-teal-900 shadow-xs' : 'bg-white/15 text-white hover:bg-white/25'}" data-view="mistakes">
              🔥 苦手複文復習
            </button>
          </div>
        </div>

        <!-- サブビュー切り替え表示 -->
        <div id="subview-container">
          ${this.renderActiveSubView()}
        </div>

      </div>
    `;

    this.bindEvents();
  }

  static renderActiveSubView() {
    switch (this.state.view) {
      case 'quiz':
        return this.renderQuizView();
      case 'random_matrix':
        return this.renderRandomMatrixView();
      case 'same_verb':
        return this.renderSameVerbView();
      case 'analytics':
        return this.renderAnalyticsView();
      case 'mistakes':
        return this.renderMistakesView();
      default:
        return this.renderQuizView();
    }
  }

  // --- 1. 複文クイズビュー (4択空欄補充・並べ替えなし) ---
  static renderQuizView() {
    const q = this.state.currentQuestion;
    if (!q) return '<div class="text-center py-10 text-slate-400">問題データを読み込み中...</div>';

    const catObj = COMPLEX_SENTENCE_CATEGORIES.find(c => c.id === q.category);
    const catLabel = catObj ? catObj.titleJa : '複文構文';
    const totalQ = this.state.questions.length;
    const currentNum = this.state.currentIndex + 1;

    return `
      <div class="space-y-4">
        
        <!-- フィルターバー -->
        <div class="bg-white rounded-2xl p-3 border border-slate-200 shadow-2xs space-y-2.5">
          <div class="flex items-center justify-between text-xs font-bold text-slate-700">
            <span class="flex items-center gap-1.5">
              <span>🏷️</span> カテゴリー絞り込み:
            </span>
            <span class="text-[11px] text-teal-600 font-extrabold">第 ${currentNum} / ${totalQ} 問</span>
          </div>

          <div class="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px] font-bold">
            <button type="button" class="btn-cat-filter px-2.5 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap ${this.state.categoryFilter === 'all' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}" data-cat="all">
              全10カテゴリー
            </button>
            ${COMPLEX_SENTENCE_CATEGORIES.map(c => `
              <button type="button" class="btn-cat-filter px-2.5 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap ${this.state.categoryFilter === c.id ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}" data-cat="${c.id}">
                ${c.icon} ${c.titleJa}
              </button>
            `).join('')}
          </div>

          <!-- 難易度 & 設問形式フィルター -->
          <div class="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100 text-xs">
            <div class="flex items-center gap-1">
              <span class="text-slate-400 text-[10px]">難易度:</span>
              ${['all', 'beginner', 'intermediate', 'advanced'].map(d => `
                <button type="button" class="btn-diff-filter text-[10px] font-bold px-2 py-0.5 rounded-md ${this.state.difficultyFilter === d ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'}" data-diff="${d}">
                  ${d === 'all' ? '全難易度' : d === 'beginner' ? '初級' : d === 'intermediate' ? '中級' : '上級'}
                </button>
              `).join('')}
            </div>

            <div class="flex items-center gap-1">
              <span class="text-slate-400 text-[10px]">形式:</span>
              <select id="select-format-filter" class="text-[10px] font-bold bg-slate-100 border border-slate-200 rounded-md px-1.5 py-0.5">
                <option value="all" ${this.state.formatFilter === 'all' ? 'selected' : ''}>全6形式</option>
                <option value="1" ${this.state.formatFilter === '1' ? 'selected' : ''}>① 接続表現選択</option>
                <option value="2" ${this.state.formatFilter === '2' ? 'selected' : ''}>② 動詞活用選択</option>
                <option value="3" ${this.state.formatFilter === '3' ? 'selected' : ''}>③ 空欄補充</option>
                <option value="4" ${this.state.formatFilter === '4' ? 'selected' : ''}>④ 日→モンゴル語</option>
                <option value="5" ${this.state.formatFilter === '5' ? 'selected' : ''}>⑤ モンゴル語→日</option>
                <option value="6" ${this.state.formatFilter === '6' ? 'selected' : ''}>⑥ 2箇所複数文法</option>
              </select>
            </div>
          </div>
        </div>

        <!-- 問題出題カード（並べ替えは一切行わず、4択選択式） -->
        <div class="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
          
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-xs font-black px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800">
                ${catLabel}
              </span>
              <span class="text-xs px-2 py-0.5 rounded-full ${q.difficulty === 'beginner' ? 'bg-emerald-100 text-emerald-800' : q.difficulty === 'intermediate' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'} font-bold">
                ${q.difficulty === 'beginner' ? '★☆☆ 初級' : q.difficulty === 'intermediate' ? '★★☆ 中級' : '★★★ 上級'}
              </span>
            </div>
            <span class="text-[11px] text-slate-400 font-bold">空欄に入る正しい形式を選択</span>
          </div>

          <!-- 設問文 -->
          <div class="space-y-1.5 text-center py-2">
            <div class="text-lg sm:text-2xl font-black text-slate-900 cyrillic-text leading-relaxed whitespace-pre-line select-text">
              ${q.prompt}
            </div>
            ${q.promptJa ? `
              <div class="text-xs sm:text-sm font-semibold text-slate-500">
                ${q.promptJa}
              </div>
            ` : ''}
          </div>

          <!-- 4つの選択肢ボタン（並べ替え禁止・クリック選択） -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
            ${q.options.map((opt, idx) => {
              const letter = ['A', 'B', 'C', 'D'][idx] || (idx + 1);
              let btnClass = "border-slate-200 bg-white hover:bg-teal-50 hover:border-teal-400 text-slate-800";
              let badgeClass = "bg-slate-100 text-slate-700";

              if (this.state.hasAnswered) {
                if (opt === q.answer) {
                  btnClass = "border-emerald-500 bg-emerald-50 text-emerald-950 font-black ring-2 ring-emerald-300";
                  badgeClass = "bg-emerald-600 text-white";
                } else if (opt === this.state.selectedChoice && !this.state.isCorrect) {
                  btnClass = "border-rose-400 bg-rose-50 text-rose-950 font-bold";
                  badgeClass = "bg-rose-600 text-white";
                } else {
                  btnClass = "border-slate-100 bg-slate-50 text-slate-400 opacity-60";
                }
              }

              return `
                <button type="button" class="btn-complex-choice w-full p-3.5 sm:p-4 rounded-xl border-2 text-left transition-all flex items-center gap-3 select-none cursor-pointer active:scale-98 shadow-2xs ${btnClass}" data-choice="${opt}" ${this.state.hasAnswered ? 'disabled' : ''}>
                  <span class="w-7 h-7 rounded-lg font-black text-xs flex items-center justify-center shrink-0 transition-colors ${badgeClass}">
                    ${letter}
                  </span>
                  <span class="text-sm sm:text-base font-bold cyrillic-text leading-snug">
                    ${opt}
                  </span>
                </button>
              `;
            }).join('')}
          </div>

        </div>

        <!-- 回答後の10項目超詳細解説 ＆ What-If条件変化カード -->
        ${this.state.hasAnswered ? this.renderExplanationCard(q) : ''}

      </div>
    `;
  }

  // --- 10項目詳細解説 ＆ 条件変化What-Ifカード ---
  static renderExplanationCard(q) {
    const isCorrect = this.state.isCorrect;
    const whatIf = q.whatIfScenarios || {};
    const activeTab = this.state.activeWhatIfTab;

    return `
      <div class="animate-fade-in space-y-4">
        
        <!-- 正誤判定バナー -->
        <div class="p-4 sm:p-5 rounded-2xl border ${isCorrect ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-rose-50 border-rose-300 text-rose-950'} shadow-sm">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-2xl">${isCorrect ? '🎉 正解！' : '❌ 不正解...'}</span>
              <span class="text-xs px-2.5 py-0.5 rounded-full ${isCorrect ? 'bg-emerald-600 text-white font-bold' : 'bg-rose-600 text-white font-bold'}">
                ${isCorrect ? '+15 XP 獲得！' : '弱点ノートに保存されました'}
              </span>
            </div>
            <button type="button" id="btn-next-complex-q" class="px-5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-black text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-1.5">
              <span>次の問題へ (Enter)</span>
              <span>→</span>
            </button>
          </div>
        </div>

        <!-- 10項目詳細解説カード -->
        <div class="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4 text-xs sm:text-sm leading-relaxed">
          
          <!-- ① 正解 & 完成文 -->
          <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
            <div class="text-[11px] font-bold text-slate-400">① 完成した正しい複文:</div>
            <div class="text-base sm:text-xl font-black text-slate-900 cyrillic-text flex items-center justify-between gap-2">
              <span>${q.completedSentence || q.prompt.replace(/___/g, `<strong class="text-emerald-700 underline">${q.answer}</strong>`)}</span>
              <button type="button" class="btn-speak-sentence p-2 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 text-sm cursor-pointer shrink-0" data-text="${q.completedSentence || q.answer}" title="音声を聴く">
                🔊
              </button>
            </div>
            <div class="text-xs font-bold text-emerald-800 pt-1">
              🇯🇵 日本語訳: ${q.japanese || ''}
            </div>
          </div>

          <!-- 各節の構造分解 (Clause 1 / Clause 2) -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div class="bg-teal-50/60 border border-teal-200 p-3 rounded-xl">
              <span class="text-[10px] font-extrabold text-teal-800 block mb-0.5">🔹 前半節 (従属節 / 条件・理由・順序):</span>
              <div class="font-bold text-slate-800 cyrillic-text">${q.clause1 || '—'}</div>
            </div>
            <div class="bg-cyan-50/60 border border-cyan-200 p-3 rounded-xl">
              <span class="text-[10px] font-extrabold text-cyan-800 block mb-0.5">🔸 後半節 (主節 / 帰結・行動・結果):</span>
              <div class="font-bold text-slate-800 cyrillic-text">${q.clause2 || '—'}</div>
            </div>
          </div>

          <!-- 文法・語幹・なぜその形か -->
          <div class="space-y-2 text-xs">
            <div class="flex items-start gap-2">
              <span class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold shrink-0">使用文法</span>
              <span class="font-extrabold text-teal-900">${q.grammar || ''}</span>
            </div>
            ${q.baseVerb ? `
              <div class="flex items-start gap-2">
                <span class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold shrink-0">動詞基本形</span>
                <span class="font-bold text-slate-800 cyrillic-text">${q.baseVerb}</span>
              </div>
            ` : ''}
            ${q.stemAndSuffix ? `
              <div class="flex items-start gap-2">
                <span class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold shrink-0">語幹と語尾</span>
                <span class="font-bold text-slate-800 cyrillic-text">${q.stemAndSuffix}</span>
              </div>
            ` : ''}
            <div class="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-emerald-950 font-medium">
              💡 <strong>なぜこの形になるのか:</strong><br>
              ${q.whyCorrect || ''}
            </div>
          </div>

          <!-- 他の選択肢との違い -->
          ${q.otherOptionsExplained ? `
            <div class="space-y-1.5 pt-1 border-t border-slate-100 text-xs">
              <div class="font-extrabold text-slate-700">⚠️ 他の選択肢が誤りの理由:</div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                ${Object.entries(q.otherOptionsExplained).map(([optKey, reason]) => `
                  <div class="p-2 bg-slate-50 border border-slate-200 rounded-lg">
                    <span class="font-black text-rose-700 cyrillic-text">× ${optKey}</span>:
                    <span class="text-slate-600">${reason}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- 同文法の別例文 -->
          ${q.parallelExample ? `
            <div class="p-3 bg-sky-50 border border-sky-200 rounded-xl text-xs space-y-1">
              <div class="text-[10px] font-bold text-sky-800">📖 同じ文法形式を使った別の例文:</div>
              <div class="font-bold text-slate-800 cyrillic-text flex items-center justify-between">
                <span>${q.parallelExample}</span>
                <button type="button" class="btn-speak-sentence text-xs text-sky-700 hover:text-sky-900 cursor-pointer" data-text="${q.parallelExample}">🔊</button>
              </div>
            </div>
          ` : ''}

          <!-- 【核心機能】条件変化の比較解説 (What-If Scenarios) -->
          <div class="border-t border-slate-200 pt-3 space-y-2">
            <div class="flex items-center gap-1.5 text-xs font-black text-slate-800">
              <span>🔮</span>
              <span>条件変化の比較マスター（もし条件が変わったらどうなる？）:</span>
            </div>

            <!-- What-If タブ切り替え -->
            <div class="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] font-bold">
              <button type="button" class="btn-whatif-tab px-2.5 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap ${activeTab === 'diff_subject' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600'}" data-wtab="diff_subject">
                主語が違ったら？
              </button>
              <button type="button" class="btn-whatif-tab px-2.5 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap ${activeTab === 'negative' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600'}" data-wtab="negative">
                否定にしたら？
              </button>
              <button type="button" class="btn-whatif-tab px-2.5 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap ${activeTab === 'question' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600'}" data-wtab="question">
                疑問文にしたら？
              </button>
              <button type="button" class="btn-whatif-tab px-2.5 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap ${activeTab === 'tense' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600'}" data-wtab="tense">
                時制を変えたら？
              </button>
            </div>

            <div class="p-3.5 bg-amber-50/80 border border-amber-300 rounded-xl text-xs text-amber-950 font-medium leading-relaxed">
              ${this.getWhatIfContent(q, activeTab)}
            </div>
          </div>

        </div>

      </div>
    `;
  }

  static getWhatIfContent(q, tab) {
    const s = q.whatIfScenarios || {};
    switch (tab) {
      case 'diff_subject':
        return s.ifDifferentSubject || s.ifDiffSubject || s.ifSameSubject || "【主語の一致・不一致】モンゴル語では同一主語の場合に再帰形（-аад, -хдаа）を用い、主語が異なる場合は（-хад, -вал, 属格主語）へと文法構造が切り替わります。";
      case 'negative':
        return s.ifNegative || "【否定形への変化】接続節に否定が入る場合、「-аагүй болохоор」「-хгүй бол」のように否定小辞・否定過去形が先行し語尾が接続します。";
      case 'question':
        return s.ifQuestion || "【疑問文への変化】主節をYes/No疑問文にする際は母音調和に応じて文末に「уу / үү」が付き、疑問詞疑問文のときは「бэ / вэ」が付きます。";
      case 'tense':
        return s.ifTenseChanged || s.ifPast || s.ifFuture || "【時制変化】過去への切り替え時は主節動詞が「-сан⁴」や「-лаа⁴」に変わり、未来・確信時は「-на⁴」や「-х болно」へ変化します。";
      default:
        return "各条件に応じた文法変化を確認できます。";
    }
  }

  // --- 2. ランダム組合せ出題モード (条件マトリックス) ---
  static renderRandomMatrixView() {
    const q = this.state.currentQuestion;

    return `
      <div class="space-y-4">
        
        <!-- 条件コントロールパネル -->
        <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3 text-xs">
          <div class="flex items-center justify-between">
            <div class="font-black text-slate-800 flex items-center gap-1.5">
              <span>🎲</span> 完全ランダム条件組合せジェネレーター
            </div>
            <button type="button" id="btn-reroll-matrix" class="px-3 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-extrabold cursor-pointer transition-all">
              🔄 新しい条件で出題
            </button>
          </div>

          <p class="text-[11px] text-slate-500">
            主語関係（同一主語／別主語）、極性（肯定・否定の4象限）、時制、文種を自在に掛け合わせて問題を自動生成します。
          </p>

          <!-- 条件バッジ一覧 -->
          ${q && q.conditions ? `
            <div class="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-md bg-teal-100 text-teal-800">
                主語: ${q.conditions.subjectRelation === 'same' ? '同一主語 (Same)' : '異なる主語 (Different)'}
              </span>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-md bg-cyan-100 text-cyan-800">
                極性: ${q.conditions.polarity || 'pos_pos'}
              </span>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-100 text-purple-800">
                時制: ${q.conditions.tense || 'past'}
              </span>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                文種: ${q.conditions.sentenceType === 'question' ? '疑問文' : '平叙文'}
              </span>
            </div>
          ` : ''}
        </div>

        <!-- 問題表示カード (クイズビューと共通の4択UI) -->
        ${this.renderQuizView()}

      </div>
    `;
  }

  // --- 3. 同一動詞比較マスター (10+活用一括比較) ---
  static renderSameVerbView() {
    const selectedVerb = SAME_VERB_COMPARISONS.find(v => v.id === this.state.selectedVerbId) || SAME_VERB_COMPARISONS[0];

    return `
      <div class="space-y-4">
        
        <!-- 動詞セレクター -->
        <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-2.5">
          <div class="flex items-center justify-between text-xs font-bold text-slate-800">
            <span class="flex items-center gap-1.5">
              <span>📚</span> 学習対象の動詞を選択（全12動詞）:
            </span>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 text-xs">
            ${SAME_VERB_COMPARISONS.map(v => `
              <button type="button" class="btn-select-verb p-2.5 rounded-xl border-2 transition-all cursor-pointer text-center ${v.id === this.state.selectedVerbId ? 'border-teal-600 bg-teal-50 text-teal-950 font-black' : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold'}" data-vid="${v.id}">
                <div class="cyrillic-text font-black text-sm">${v.verb}</div>
                <div class="text-[10px] text-slate-400 mt-0.5">${v.meaning}</div>
              </button>
            `).join('')}
          </div>
        </div>

        <!-- 選択中動詞の活用比較一覧カード -->
        <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <div class="flex items-center gap-2">
                <span class="text-xl sm:text-2xl font-black text-slate-900 cyrillic-text">${selectedVerb.verb}</span>
                <span class="text-xs font-bold text-slate-500">（${selectedVerb.meaning}）</span>
                <button type="button" class="btn-speak-sentence p-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs cursor-pointer" data-text="${selectedVerb.verb}">🔊</button>
              </div>
              <div class="text-[11px] text-slate-400 mt-0.5">語幹: <span class="font-bold text-slate-700 cyrillic-text">${selectedVerb.stem}</span> / 母音調和: ${selectedVerb.vowelHarmony}母音</div>
            </div>
            <button type="button" id="btn-drill-this-verb" class="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-extrabold cursor-pointer transition-all shadow-xs">
              ⚡ この動詞で特訓
            </button>
          </div>

          <!-- 10+活用形グリッドカード -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            ${selectedVerb.forms.map((f, idx) => `
              <div class="bg-slate-50/80 hover:bg-teal-50/40 p-3.5 rounded-xl border border-slate-200 hover:border-teal-300 transition-all space-y-1.5">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-1.5">
                    <span class="w-5 h-5 rounded-md bg-teal-100 text-teal-800 font-extrabold text-[10px] flex items-center justify-center">
                      ${idx + 1}
                    </span>
                    <span class="text-xs font-black text-slate-700">${f.category}</span>
                  </div>
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600">
                    語尾: ${f.suffix}
                  </span>
                </div>

                <div class="flex items-center justify-between">
                  <div class="text-base font-black text-teal-950 cyrillic-text">
                    ${f.form}
                  </div>
                  <button type="button" class="btn-speak-sentence text-xs text-teal-700 hover:text-teal-900 cursor-pointer" data-text="${f.form}">🔊</button>
                </div>
                <div class="text-xs text-slate-600 font-medium">
                  意味: <strong>${f.meaning}</strong>
                </div>

                <div class="pt-1 border-t border-slate-200/60 text-[11px] space-y-0.5">
                  <div class="font-bold text-slate-800 cyrillic-text">${f.exampleMn}</div>
                  <div class="text-slate-500">${f.exampleJa}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

      </div>
    `;
  }

  // --- 4. 弱点分析レーダー & 条件別正答率 ---
  static renderAnalyticsView() {
    const stats = this.state.userStats;
    const cond = stats.byCondition;

    const calcRate = (c, t) => t > 0 ? Math.round((c / t) * 100) : 0;

    return `
      <div class="space-y-4">
        
        <!-- サマリー統計カード -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
          <div class="bg-white border border-slate-200 p-3 rounded-xl shadow-2xs">
            <div class="text-[10px] text-slate-400 font-bold">総回答数</div>
            <div class="text-xl font-black text-slate-800 mt-0.5">${stats.totalAnswered} 問</div>
          </div>
          <div class="bg-white border border-slate-200 p-3 rounded-xl shadow-2xs">
            <div class="text-[10px] text-emerald-600 font-bold">正解数</div>
            <div class="text-xl font-black text-emerald-800 mt-0.5">${stats.totalCorrect} 問</div>
          </div>
          <div class="bg-white border border-slate-200 p-3 rounded-xl shadow-2xs">
            <div class="text-[10px] text-teal-600 font-bold">総合正答率</div>
            <div class="text-xl font-black text-teal-800 mt-0.5">${calcRate(stats.totalCorrect, stats.totalAnswered)}%</div>
          </div>
          <div class="bg-white border border-slate-200 p-3 rounded-xl shadow-2xs">
            <div class="text-[10px] text-amber-600 font-bold">獲得XP</div>
            <div class="text-xl font-black text-amber-800 mt-0.5">${this.state.sessionXp} XP</div>
          </div>
        </div>

        <!-- 4大条件別 正答率比較マトリックス -->
        <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div class="font-black text-slate-800 text-sm flex items-center gap-1.5">
            <span>⚖️</span> 条件別・弱点発見マトリックス（どこで間違えやすいか？）
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            
            <!-- ① 主語の一致・不一致 -->
            <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div class="font-extrabold text-slate-700">1. 主語の関係</div>
              <div class="space-y-1.5">
                <div>
                  <div class="flex justify-between text-[11px] mb-0.5 font-bold">
                    <span>同一主語 (Same)</span>
                    <span>${calcRate(cond.same_subject.correct, cond.same_subject.total)}% (${cond.same_subject.correct}/${cond.same_subject.total})</span>
                  </div>
                  <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div class="bg-teal-500 h-full" style="width: ${calcRate(cond.same_subject.correct, cond.same_subject.total)}%"></div>
                  </div>
                </div>
                <div>
                  <div class="flex justify-between text-[11px] mb-0.5 font-bold">
                    <span>異なる主語 (Different)</span>
                    <span>${calcRate(cond.diff_subject.correct, cond.diff_subject.total)}% (${cond.diff_subject.correct}/${cond.diff_subject.total})</span>
                  </div>
                  <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div class="bg-amber-500 h-full" style="width: ${calcRate(cond.diff_subject.correct, cond.diff_subject.total)}%"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- ② 肯定 vs 否定 -->
            <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div class="font-extrabold text-slate-700">2. 極性（肯定・否定）</div>
              <div class="space-y-1.5">
                <div>
                  <div class="flex justify-between text-[11px] mb-0.5 font-bold">
                    <span>肯定文 (Positive)</span>
                    <span>${calcRate(cond.polarity_pos.correct, cond.polarity_pos.total)}% (${cond.polarity_pos.correct}/${cond.polarity_pos.total})</span>
                  </div>
                  <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div class="bg-emerald-500 h-full" style="width: ${calcRate(cond.polarity_pos.correct, cond.polarity_pos.total)}%"></div>
                  </div>
                </div>
                <div>
                  <div class="flex justify-between text-[11px] mb-0.5 font-bold">
                    <span>否定文 (Negative)</span>
                    <span>${calcRate(cond.polarity_neg.correct, cond.polarity_neg.total)}% (${cond.polarity_neg.correct}/${cond.polarity_neg.total})</span>
                  </div>
                  <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div class="bg-rose-500 h-full" style="width: ${calcRate(cond.polarity_neg.correct, cond.polarity_neg.total)}%"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- ③ 時制 (過去 vs 未来) -->
            <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div class="font-extrabold text-slate-700">3. 時制</div>
              <div class="space-y-1.5">
                <div>
                  <div class="flex justify-between text-[11px] mb-0.5 font-bold">
                    <span>過去時制 (Past)</span>
                    <span>${calcRate(cond.tense_past.correct, cond.tense_past.total)}% (${cond.tense_past.correct}/${cond.tense_past.total})</span>
                  </div>
                  <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div class="bg-cyan-500 h-full" style="width: ${calcRate(cond.tense_past.correct, cond.tense_past.total)}%"></div>
                  </div>
                </div>
                <div>
                  <div class="flex justify-between text-[11px] mb-0.5 font-bold">
                    <span>未来・現在 (Future/Pres)</span>
                    <span>${calcRate(cond.tense_future.correct, cond.tense_future.total)}% (${cond.tense_future.correct}/${cond.tense_future.total})</span>
                  </div>
                  <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div class="bg-indigo-500 h-full" style="width: ${calcRate(cond.tense_future.correct, cond.tense_future.total)}%"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- ④ 文種 (平叙 vs 疑問) -->
            <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div class="font-extrabold text-slate-700">4. 文種</div>
              <div class="space-y-1.5">
                <div>
                  <div class="flex justify-between text-[11px] mb-0.5 font-bold">
                    <span>平叙文 (Statement)</span>
                    <span>${calcRate(cond.type_statement.correct, cond.type_statement.total)}% (${cond.type_statement.correct}/${cond.type_statement.total})</span>
                  </div>
                  <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div class="bg-blue-500 h-full" style="width: ${calcRate(cond.type_statement.correct, cond.type_statement.total)}%"></div>
                  </div>
                </div>
                <div>
                  <div class="flex justify-between text-[11px] mb-0.5 font-bold">
                    <span>疑問文 (Question)</span>
                    <span>${calcRate(cond.type_question.correct, cond.type_question.total)}% (${cond.type_question.correct}/${cond.type_question.total})</span>
                  </div>
                  <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div class="bg-purple-500 h-full" style="width: ${calcRate(cond.type_question.correct, cond.type_question.total)}%"></div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- 10カテゴリー別 進捗グリッド -->
        <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
          <div class="font-black text-slate-800 text-sm">
            📑 全10カテゴリー別・習熟度
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            ${COMPLEX_SENTENCE_CATEGORIES.map(c => {
              const catStat = stats.byCategory[c.id] || { total: 0, correct: 0 };
              const rate = calcRate(catStat.correct, catStat.total);
              return `
                <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span class="text-base">${c.icon}</span>
                    <div>
                      <div class="font-bold text-slate-800">${c.titleJa}</div>
                      <div class="text-[10px] text-slate-400">${c.titleMn}</div>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="font-black text-teal-900">${rate}%</div>
                    <div class="text-[10px] text-slate-400">${catStat.correct}/${catStat.total}問</div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

      </div>
    `;
  }

  // --- 5. 苦手復習ビュー ---
  static renderMistakesView() {
    const mistakes = StorageService.getMistakes().filter(m => m.type === 'complex_sentence' && !m.resolved);

    if (mistakes.length === 0) {
      return `
        <div class="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm text-center space-y-3">
          <span class="text-4xl">🎉</span>
          <h3 class="text-base font-black text-slate-800">苦手な複文問題はありません！</h3>
          <p class="text-xs text-slate-500">複文クイズで間違えた問題は自動でここに蓄積され、克服特訓ができます。</p>
          <button type="button" class="btn-sub-tab px-4 py-2 rounded-xl bg-teal-600 text-white font-bold text-xs cursor-pointer shadow-xs" data-view="quiz">
            複文クイズに挑戦する →
          </button>
        </div>
      `;
    }

    return `
      <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
        <div class="flex items-center justify-between">
          <div class="font-black text-slate-800 text-sm flex items-center gap-1.5">
            <span>🔥</span> 間違えた複文問題 (${mistakes.length} 問)
          </div>
          <button type="button" id="btn-start-complex-mistakes" class="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs cursor-pointer shadow-xs">
            間違えた問題だけを再特訓 →
          </button>
        </div>

        <div class="space-y-2">
          ${mistakes.map(m => `
            <div class="p-3 bg-rose-50/60 rounded-xl border border-rose-200 space-y-1 text-xs">
              <div class="font-bold text-slate-900 cyrillic-text">${m.question || m.prompt}</div>
              <div class="text-[11px] text-emerald-800 font-extrabold">正解: ${m.correctAnswer}</div>
              ${m.explanation ? `<div class="text-[10px] text-slate-600 bg-white p-2 rounded-lg border border-slate-200 leading-relaxed">${m.explanation}</div>` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // --- イベントバインド ---
  static bindEvents() {
    if (!this.container) return;

    // ホームへ戻る
    const backBtn = this.container.querySelector('#btn-back-home');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        this.cleanupKeyHandler();
        if (this.onNavigate) this.onNavigate('home');
      });
    }

    // サブタブ切り替え
    this.container.querySelectorAll('.btn-sub-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        this.cleanupKeyHandler();
        const v = btn.dataset.view;
        this.state.view = v;
        if (v === 'quiz') {
          this.initQuestions();
        } else if (v === 'random_matrix') {
          this.loadCurrentQuestion();
        }
        this.render();
      });
    });

    // カテゴリーフィルター
    this.container.querySelectorAll('.btn-cat-filter').forEach(btn => {
      btn.addEventListener('click', () => {
        this.state.categoryFilter = btn.dataset.cat;
        this.initQuestions();
        this.render();
      });
    });

    // 難易度フィルター
    this.container.querySelectorAll('.btn-diff-filter').forEach(btn => {
      btn.addEventListener('click', () => {
        this.state.difficultyFilter = btn.dataset.diff;
        this.initQuestions();
        this.render();
      });
    });

    // 形式フィルター
    const fmtSelect = this.container.querySelector('#select-format-filter');
    if (fmtSelect) {
      fmtSelect.addEventListener('change', (e) => {
        this.state.formatFilter = e.target.value;
        this.initQuestions();
        this.render();
      });
    }

    // 選択肢クリック
    this.container.querySelectorAll('.btn-complex-choice').forEach(btn => {
      btn.addEventListener('click', () => {
        if (this.state.hasAnswered) return;
        const choice = btn.dataset.choice;
        this.handleAnswer(choice);
      });
    });

    // 音声再生
    this.container.querySelectorAll('.btn-speak-sentence').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const text = btn.dataset.text;
        if (text) {
          SpeechService.speak(text);
        }
      });
    });

    // What-If タブ切り替え
    this.container.querySelectorAll('.btn-whatif-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        this.state.activeWhatIfTab = btn.dataset.wtab;
        this.render();
      });
    });

    // 次の問題へ
    const nextBtn = this.container.querySelector('#btn-next-complex-q');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        this.nextQuestion();
      });
    }

    // ランダムマトリックス リロール
    const rerollBtn = this.container.querySelector('#btn-reroll-matrix');
    if (rerollBtn) {
      rerollBtn.addEventListener('click', () => {
        this.loadCurrentQuestion();
        this.render();
      });
    }

    // 動詞選択
    this.container.querySelectorAll('.btn-select-verb').forEach(btn => {
      btn.addEventListener('click', () => {
        this.state.selectedVerbId = btn.dataset.vid;
        this.render();
      });
    });

    // 動詞特訓ボタン
    const drillVerbBtn = this.container.querySelector('#btn-drill-this-verb');
    if (drillVerbBtn) {
      drillVerbBtn.addEventListener('click', () => {
        this.state.view = 'quiz';
        this.initQuestions();
        this.render();
      });
    }

    // 苦手問題だけを特訓
    const startMistakesBtn = this.container.querySelector('#btn-start-complex-mistakes');
    if (startMistakesBtn) {
      startMistakesBtn.addEventListener('click', () => {
        const mistakes = StorageService.getMistakes().filter(m => m.type === 'complex_sentence' && !m.resolved);
        if (mistakes.length > 0) {
          this.state.questions = mistakes.map(m => ({
            id: m.id,
            category: m.category || 'cat_reason',
            prompt: m.question,
            promptJa: m.japanese || '',
            options: m.options || [m.correctAnswer],
            answer: m.correctAnswer,
            explanation: m.explanation,
            whyCorrect: m.explanation,
            completedSentence: m.question.replace(/___/g, m.correctAnswer),
            difficulty: 'intermediate'
          }));
          this.state.currentIndex = 0;
          this.state.view = 'quiz';
          this.loadCurrentQuestion();
          this.render();
        }
      });
    }
  }

  // --- 回答処理 ---
  static handleAnswer(choice) {
    const q = this.state.currentQuestion;
    if (!q || this.state.hasAnswered) return;

    this.state.hasAnswered = true;
    this.state.selectedChoice = choice;
    const isCorrect = choice.trim() === q.answer.trim();
    this.state.isCorrect = isCorrect;

    // 統計更新
    const stats = this.state.userStats;
    stats.totalAnswered += 1;
    if (isCorrect) stats.totalCorrect += 1;

    // カテゴリー統計
    if (q.category) {
      if (!stats.byCategory[q.category]) {
        stats.byCategory[q.category] = { total: 0, correct: 0 };
      }
      stats.byCategory[q.category].total += 1;
      if (isCorrect) stats.byCategory[q.category].correct += 1;
    }

    // 条件別統計
    if (q.conditions) {
      const cond = stats.byCondition;
      if (q.conditions.subjectRelation === 'same') {
        cond.same_subject.total += 1;
        if (isCorrect) cond.same_subject.correct += 1;
      } else {
        cond.diff_subject.total += 1;
        if (isCorrect) cond.diff_subject.correct += 1;
      }

      if (q.conditions.polarity && q.conditions.polarity.includes('neg')) {
        cond.polarity_neg.total += 1;
        if (isCorrect) cond.polarity_neg.correct += 1;
      } else {
        cond.polarity_pos.total += 1;
        if (isCorrect) cond.polarity_pos.correct += 1;
      }

      if (q.conditions.tense && q.conditions.tense.includes('past')) {
        cond.tense_past.total += 1;
        if (isCorrect) cond.tense_past.correct += 1;
      } else {
        cond.tense_future.total += 1;
        if (isCorrect) cond.tense_future.correct += 1;
      }

      if (q.conditions.sentenceType === 'question') {
        cond.type_question.total += 1;
        if (isCorrect) cond.type_question.correct += 1;
      } else {
        cond.type_statement.total += 1;
        if (isCorrect) cond.type_statement.correct += 1;
      }
    }

    this.saveStats();

    if (isCorrect) {
      SoundEffects.playCorrect();
      GamificationService.addXp(15, 'complex_sentence');
      this.state.sessionXp += 15;
      this.state.sessionScore += 10;
      // 克服できた場合は間違いノートを解決
      StorageService.resolveMistakeByQuestion(q.prompt, q.answer);
    } else {
      SoundEffects.playIncorrect();
      // 不正解時は間違いノートに完全記録
      StorageService.recordMistake({
        id: q.id,
        type: 'complex_sentence',
        question: q.prompt,
        correctAnswer: q.answer,
        userAnswer: choice,
        category: q.category,
        explanation: `${q.whyCorrect || ''}\n【完成文】: ${q.completedSentence || ''}\n【日本語訳】: ${q.japanese || ''}`,
        options: q.options || [],
        japanese: q.japanese || ''
      });
    }

    this.render();
  }

  static nextQuestion() {
    if (this.state.view === 'random_matrix') {
      this.loadCurrentQuestion();
    } else {
      if (this.state.currentIndex + 1 < this.state.questions.length) {
        this.state.currentIndex += 1;
      } else {
        this.state.currentIndex = 0;
      }
      this.loadCurrentQuestion();
    }
    this.render();
  }
}

if (typeof window !== 'undefined') {
  window.ComplexSentenceComponent = ComplexSentenceComponent;
}
