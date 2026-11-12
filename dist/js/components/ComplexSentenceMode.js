// ========================================================================
// 複文特化モード（Complex Sentence Mastery Mode）コンポーネント
// 接続表現・動詞副動詞・節構造・名詞修飾・条件変化を完全制御
// ========================================================================

import { StorageService } from '../services/storage.js';
import { SpeechService } from '../services/speech.js';
import { GamificationService } from '../services/gamification.js';
import { shuffleArray, SoundEffects, renderCyrillicInputAssistantHTML, bindCyrillicInputAssistant, isFuzzyMatch } from '../utils/helpers.js';
import { 
  COMPLEX_SENTENCE_CATEGORIES, 
  SAME_VERB_COMPARISONS, 
  CURATED_COMPLEX_QUESTIONS, 
  ComplexSentenceCombinator 
} from '../data/complexSentenceData.js';

export class ComplexSentenceComponent {
  static container = null;
  static onNavigate = null;
  static activeKeyHandler = null;

  // --- 状態管理 ---
  static state = {
    view: 'settings', // 'settings' | 'quiz' | 'random_matrix' | 'same_verb' | 'analytics' | 'mistakes' | 'result'
    settings: {
      answerMode: 'choice', // 'choice' (選択式) | 'input' (記述式)
      count: 10, // 5 | 10 | 20 | 30 | 50 | 'all' | <number>
      customCount: 15,
      difficulty: 'all', // 'all' | 'beginner' | 'intermediate' | 'advanced'
      categories: ['all'], // ['all'] または カテゴリーID配列
      conditionShuffling: true, // 主語同異・極性・時制などの多様化
      includeGenerated: true // 動的生成問題をブレンド
    },
    // クイズ実行時
    questions: [],
    currentIndex: 0,
    currentQuestion: null,
    userAnswer: '',
    selectedChoice: null,
    hasAnswered: false,
    isCorrect: false,
    activeWhatIfTab: 'diff_subject',
    selectedVerbId: 'verb_idekh',
    sessionScore: 0,
    sessionXp: 0,
    results: [], // 各問の履歴 { q, userAnswer, isCorrect, isInput }
    userStats: {
      totalAnswered: 0,
      totalCorrect: 0,
      byCategory: {},
      byCondition: {
        same_subject: { total: 0, correct: 0 },
        diff_subject: { total: 0, correct: 0 },
        past_tense: { total: 0, correct: 0 },
        negative: { total: 0, correct: 0 },
        question_form: { total: 0, correct: 0 }
      },
      mistakeIds: []
    }
  };

  // --- ヘルパー：安全なカテゴリー情報取得（undefined を完全に排除） ---
  static getCategory(catId) {
    if (!catId) {
      return { id: 'unknown', code: 'A', name: '複文構文', titleJa: '複文構文', nameMn: 'Нийлмэл өгүүлбэр', icon: '🔗' };
    }
    const found = COMPLEX_SENTENCE_CATEGORIES.find(c => c.id === catId);
    if (found) {
      return {
        ...found,
        titleJa: found.titleJa || found.name || '複文構文',
        name: found.name || found.titleJa || '複文構文',
        icon: found.icon || '🔗'
      };
    }
    return { id: catId, code: '?', name: '複文構文', titleJa: '複文構文', nameMn: 'Нийлмэл өгүүлбэр', icon: '🔗' };
  }

  static getCategoryName(catId) {
    const cat = this.getCategory(catId);
    return cat.titleJa || cat.name || '複文構文';
  }

  static getDifficultyBadge(diff) {
    switch (diff) {
      case 'beginner': return '<span class="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[11px] font-bold">★☆☆ 初級</span>';
      case 'intermediate': return '<span class="text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-[11px] font-bold">★★☆ 中級</span>';
      case 'advanced': return '<span class="text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded text-[11px] font-bold">★★★ 上級</span>';
      default: return '<span class="text-slate-700 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded text-[11px] font-bold">★☆☆ 標準</span>';
    }
  }

  // --- 初期化 ---
  static init(container, onNavigate) {
    this.container = container;
    this.onNavigate = onNavigate;
    this.loadStats();
    this.state.view = 'settings';
    this.render();
  }

  // --- 統計読み書き ---
  static loadStats() {
    const saved = StorageService.getItem('complex_sentence_stats');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.state.userStats = { ...this.state.userStats, ...parsed };
      } catch (e) {
        console.error('Failed to parse complex_sentence_stats:', e);
      }
    }
  }

  static saveStats() {
    StorageService.setItem('complex_sentence_stats', JSON.stringify(this.state.userStats));
  }

  // --- テスト開始（問題プールの抽出とシャッフル） ---
  static startQuiz() {
    const { count, customCount, difficulty, categories, includeGenerated, conditionShuffling } = this.state.settings;
    
    let pool = [...CURATED_COMPLEX_QUESTIONS];

    // カテゴリー絞り込み
    if (!categories.includes('all') && categories.length > 0) {
      pool = pool.filter(q => categories.includes(q.category));
    }

    // 難易度絞り込み
    if (difficulty !== 'all') {
      pool = pool.filter(q => q.difficulty === difficulty);
    }

    // 動的生成問題のブレンド
    if (includeGenerated && typeof ComplexSentenceCombinator !== 'undefined') {
      try {
        const generatedPool = ComplexSentenceCombinator.generateQuestions({
          category: categories.includes('all') ? 'all' : categories[0],
          difficulty: difficulty,
          count: 15
        });
        if (Array.isArray(generatedPool) && generatedPool.length > 0) {
          pool = pool.concat(generatedPool);
        }
      } catch (err) {
        console.warn('Dynamic questions generation skipped:', err);
      }
    }

    // プールが空の場合はフォールバック
    if (pool.length === 0) {
      pool = [...CURATED_COMPLEX_QUESTIONS];
    }

    // シャッフル
    pool = shuffleArray(pool);

    // 条件シャッフル適用
    if (conditionShuffling) {
      pool = pool.map(q => {
        // 必要に応じてWhat-Ifや派生形をブレンドする余地
        return q;
      });
    }

    // 出題数の決定
    let targetCount = count;
    if (count === 'all') {
      targetCount = pool.length;
    } else if (count === 'custom') {
      targetCount = Math.max(1, Math.min(pool.length, parseInt(customCount, 10) || 10));
    } else {
      targetCount = Math.min(pool.length, parseInt(count, 10) || 10);
    }

    this.state.questions = pool.slice(0, targetCount);
    this.state.currentIndex = 0;
    this.state.sessionScore = 0;
    this.state.sessionXp = 0;
    this.state.results = [];
    this.state.view = 'quiz';
    this.loadCurrentQuestion();
    this.render();
  }

  static loadCurrentQuestion() {
    this.state.hasAnswered = false;
    this.state.selectedChoice = null;
    this.state.userAnswer = '';
    this.state.isCorrect = false;
    this.state.activeWhatIfTab = 'diff_subject';
    this.cleanupKeyHandler();

    if (this.state.questions.length > 0 && this.state.currentIndex < this.state.questions.length) {
      const q = this.state.questions[this.state.currentIndex];
      // データの完全性ガード
      q.categoryName = this.getCategoryName(q.category);
      this.state.currentQuestion = q;
      this.setupKeyHandler();
    } else {
      this.state.currentQuestion = null;
    }
  }

  // --- キーボード操作 ---
  static cleanupKeyHandler() {
    if (this.activeKeyHandler) {
      window.removeEventListener('keydown', this.activeKeyHandler);
      this.activeKeyHandler = null;
    }
  }

  static setupKeyHandler() {
    this.cleanupKeyHandler();
    this.activeKeyHandler = (e) => {
      // 記述式でinputにフォーカスがある時はショートカット無効
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) {
        if (e.key === 'Enter' && !this.state.hasAnswered) {
          e.preventDefault();
          this.handleAnswer(this.state.userAnswer);
        }
        return;
      }

      if (!this.state.hasAnswered) {
        if (this.state.settings.answerMode === 'choice') {
          const keyMap = { '1': 0, '2': 1, '3': 2, '4': 3, 'a': 0, 'b': 1, 'c': 2, 'd': 3, 'A': 0, 'B': 1, 'C': 2, 'D': 3 };
          if (e.key in keyMap && this.state.currentQuestion) {
            const idx = keyMap[e.key];
            if (this.state.currentQuestion.options && this.state.currentQuestion.options[idx]) {
              e.preventDefault();
              this.handleAnswer(this.state.currentQuestion.options[idx]);
            }
          }
        }
      } else {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.nextQuestion();
        }
      }
    };
    window.addEventListener('keydown', this.activeKeyHandler);
  }

  // --- メイン描画 ---
  static render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="animate-fade-in max-w-4xl mx-auto px-3 sm:px-4 py-4 space-y-4">
        
        <!-- ヘッダーバナー -->
        <div class="bg-gradient-to-r from-teal-800 via-emerald-700 to-cyan-800 rounded-2xl p-4 sm:p-5 text-white shadow-md relative overflow-hidden">
          <div class="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative z-10">
            <div class="flex items-center gap-3">
              <span class="text-3xl sm:text-4xl">🔗</span>
              <div>
                <div class="flex items-center gap-2">
                  <h1 class="text-lg sm:text-xl font-black tracking-tight">複文特化マスター</h1>
                  <span class="bg-amber-400 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">完全攻略</span>
                </div>
                <p class="text-xs text-teal-100 mt-0.5">接続表現・動詞副動詞・複文構造・名詞修飾・条件変化を完全制覇</p>
              </div>
            </div>
            <div class="flex items-center gap-2 w-full sm:w-auto justify-end">
              ${this.state.view !== 'settings' ? `
                <button type="button" id="btn-back-settings" class="bg-white/15 hover:bg-white/25 active:scale-95 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer backdrop-blur-xs">
                  <span>⚙️</span> 設定に戻る
                </button>
              ` : ''}
              <button type="button" id="btn-back-home" class="bg-white/15 hover:bg-white/25 active:scale-95 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer backdrop-blur-xs">
                <span>✕</span> ホームへ戻る
              </button>
            </div>
          </div>

          <!-- サブナビゲーションタブ -->
          <div class="flex items-center gap-1.5 overflow-x-auto pt-3 border-t border-teal-600/50 mt-3 scrollbar-none text-xs">
            <button type="button" class="btn-sub-tab px-3 py-1 rounded-lg font-bold transition cursor-pointer whitespace-nowrap ${this.state.view === 'settings' || this.state.view === 'quiz' || this.state.view === 'result' ? 'bg-white text-teal-900 shadow-2xs font-black' : 'text-teal-100 hover:bg-white/10'}" data-view="settings">
              🎯 複文クイズ
            </button>
            <button type="button" class="btn-sub-tab px-3 py-1 rounded-lg font-bold transition cursor-pointer whitespace-nowrap ${this.state.view === 'random_matrix' ? 'bg-white text-teal-900 shadow-2xs font-black' : 'text-teal-100 hover:bg-white/10'}" data-view="random_matrix">
              🎲 ランダム組合せ出題
            </button>
            <button type="button" class="btn-sub-tab px-3 py-1 rounded-lg font-bold transition cursor-pointer whitespace-nowrap ${this.state.view === 'same_verb' ? 'bg-white text-teal-900 shadow-2xs font-black' : 'text-teal-100 hover:bg-white/10'}" data-view="same_verb">
              🔄 同一動詞比較マスター
            </button>
            <button type="button" class="btn-sub-tab px-3 py-1 rounded-lg font-bold transition cursor-pointer whitespace-nowrap ${this.state.view === 'analytics' ? 'bg-white text-teal-900 shadow-2xs font-black' : 'text-teal-100 hover:bg-white/10'}" data-view="analytics">
              📊 弱点分析レーダー
            </button>
            <button type="button" class="btn-sub-tab px-3 py-1 rounded-lg font-bold transition cursor-pointer whitespace-nowrap ${this.state.view === 'mistakes' ? 'bg-white text-teal-900 shadow-2xs font-black' : 'text-teal-100 hover:bg-white/10'}" data-view="mistakes">
              🔥 苦手複文復習 (${this.state.userStats.mistakeIds ? this.state.userStats.mistakeIds.length : 0})
            </button>
          </div>
        </div>

        <!-- メインコンテンツ表示切替 -->
        <div id="cs-subview-container">
          ${this.renderActiveSubView()}
        </div>

      </div>
    `;

    this.bindEvents();
  }

  // --- サブビュー分岐 ---
  static renderActiveSubView() {
    switch (this.state.view) {
      case 'settings':
        return this.renderSettingsView();
      case 'quiz':
        return this.renderQuizView();
      case 'result':
        return this.renderResultView();
      case 'random_matrix':
        return this.renderRandomMatrixView();
      case 'same_verb':
        return this.renderSameVerbView();
      case 'analytics':
        return this.renderAnalyticsView();
      case 'mistakes':
        return this.renderMistakesView();
      default:
        return this.renderSettingsView();
    }
  }

  // ========================================================================
  // 1. テスト前設定画面（Settings View）
  // ========================================================================
  static renderSettingsView() {
    const s = this.state.settings;
    const allSelected = s.categories.includes('all');

    return `
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-6 animate-fade-in">

        <div class="border-b border-slate-100 pb-3 flex items-center justify-between">
          <div>
            <h2 class="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <span>⚙️</span> 学習条件の設定
            </h2>
            <p class="text-xs text-slate-500 mt-0.5">回答形式・問題数・出題範囲を選択して学習を開始します</p>
          </div>
          <span class="text-[11px] font-bold text-teal-700 bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-full">
            厳選問題 ${CURATED_COMPLEX_QUESTIONS.length} 問 収録
          </span>
        </div>

        <!-- A. 回答形式の選択 -->
        <div class="space-y-2.5">
          <label class="block text-xs font-black text-slate-800 flex items-center gap-2">
            <span class="w-5 h-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-[10px] font-black">A</span>
            回答形式を選択
          </label>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button type="button" class="btn-setting-mode text-left p-3.5 rounded-xl border-2 transition-all cursor-pointer ${s.answerMode === 'choice' ? 'border-teal-600 bg-teal-50/50 text-teal-950 shadow-2xs' : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'}" data-mode="choice">
              <div class="flex items-center justify-between mb-1">
                <span class="font-black text-sm flex items-center gap-1.5">
                  <span>🔘</span> ① 選択式（4択クイズ）
                </span>
                ${s.answerMode === 'choice' ? '<span class="text-teal-600 text-sm font-black">✓ 選択中</span>' : ''}
              </div>
              <p class="text-[11px] text-slate-600 leading-relaxed">
                空欄に入る正しい接続表現・語尾を4択から選びます。紛らわしい文法形式のひっかけに強くなります。
              </p>
            </button>

            <button type="button" class="btn-setting-mode text-left p-3.5 rounded-xl border-2 transition-all cursor-pointer ${s.answerMode === 'input' ? 'border-teal-600 bg-teal-50/50 text-teal-950 shadow-2xs' : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'}" data-mode="input">
              <div class="flex items-center justify-between mb-1">
                <span class="font-black text-sm flex items-center gap-1.5">
                  <span>✍️</span> ② 記述式（キリル文字入力）
                </span>
                ${s.answerMode === 'input' ? '<span class="text-teal-600 text-sm font-black">✓ 選択中</span>' : ''}
              </div>
              <p class="text-[11px] text-slate-600 leading-relaxed">
                空欄の接続語尾を自分で直接入力します。キリルキーボードアシスタント対応で活用力を極めます。
              </p>
            </button>
          </div>
        </div>

        <!-- B. 問題数の選択 -->
        <div class="space-y-2.5">
          <label class="block text-xs font-black text-slate-800 flex items-center gap-2">
            <span class="w-5 h-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-[10px] font-black">B</span>
            出題数を選択
          </label>
          <div class="flex flex-wrap items-center gap-2">
            ${[5, 10, 20, 30, 50].map(cnt => `
              <button type="button" class="btn-setting-count px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${s.count === cnt ? 'bg-teal-600 text-white shadow-2xs font-black' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}" data-count="${cnt}">
                ${cnt} 問 ${cnt === 10 ? '<span class="text-[10px] text-amber-200">★推奨</span>' : ''}
              </button>
            `).join('')}
            <button type="button" class="btn-setting-count px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${s.count === 'all' ? 'bg-teal-600 text-white shadow-2xs font-black' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}" data-count="all">
              全問題 (${CURATED_COMPLEX_QUESTIONS.length}問)
            </button>
            <div class="flex items-center gap-1 bg-slate-50 border border-slate-200 px-2 py-1 rounded-xl text-xs">
              <span class="text-slate-500 text-[11px]">指定:</span>
              <input type="number" id="input-custom-count" min="1" max="100" value="${s.customCount || 15}" class="w-12 text-center font-bold bg-white border border-slate-300 rounded px-1 py-0.5 text-xs text-slate-900" />
              <button type="button" id="btn-apply-custom-count" class="px-2 py-0.5 rounded bg-slate-200 hover:bg-slate-300 text-slate-800 text-[11px] font-bold cursor-pointer">
                適用
              </button>
            </div>
          </div>
        </div>

        <!-- C. 難易度の選択 -->
        <div class="space-y-2.5">
          <label class="block text-xs font-black text-slate-800 flex items-center gap-2">
            <span class="w-5 h-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-[10px] font-black">C</span>
            難易度を選択
          </label>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
            ${[
              { id: 'all', label: '全難易度（ランダム）', desc: '初級〜上級ミックス' },
              { id: 'beginner', label: '★☆☆ 初級', desc: '基本副動詞 -аад / -ж' },
              { id: 'intermediate', label: '★★☆ 中級', desc: '理由・条件・時間節' },
              { id: 'advanced', label: '★★★ 上級', desc: '名詞修飾・反事実・複文' }
            ].map(diff => `
              <button type="button" class="btn-setting-diff p-2.5 rounded-xl border text-left transition cursor-pointer ${s.difficulty === diff.id ? 'border-teal-600 bg-teal-50/50 text-teal-950 font-black shadow-2xs' : 'border-slate-200 hover:bg-slate-50 text-slate-700'}" data-diff="${diff.id}">
                <div class="text-xs font-bold">${diff.label}</div>
                <div class="text-[10px] text-slate-500 mt-0.5">${diff.desc}</div>
              </button>
            `).join('')}
          </div>
        </div>

        <!-- D. 出題範囲の選択（複数選択・全選択対応） -->
        <div class="space-y-2.5">
          <div class="flex items-center justify-between">
            <label class="block text-xs font-black text-slate-800 flex items-center gap-2">
              <span class="w-5 h-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-[10px] font-black">D</span>
              出題カテゴリーの選択（複数選択可能）
            </label>
            <div class="flex gap-2">
              <button type="button" id="btn-select-all-cats" class="text-[11px] font-bold text-teal-700 hover:text-teal-900 underline cursor-pointer">
                全カテゴリー選択
              </button>
            </div>
          </div>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <button type="button" class="btn-toggle-cat p-2.5 rounded-xl border text-left transition flex items-center justify-between cursor-pointer ${allSelected ? 'border-teal-600 bg-teal-600 text-white font-black shadow-2xs' : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'}" data-cat="all">
              <span class="flex items-center gap-2">
                <span>🌐</span> 全10カテゴリーから総合出題
              </span>
              <span class="text-[11px] font-bold">${allSelected ? '✓ 選択中' : '選択'}</span>
            </button>

            ${COMPLEX_SENTENCE_CATEGORIES.map(c => {
              const isSelected = !allSelected && s.categories.includes(c.id);
              const catTitle = c.titleJa || c.name || '複文構文';
              return `
                <button type="button" class="btn-toggle-cat p-2 rounded-xl border text-left transition flex items-center justify-between cursor-pointer ${isSelected ? 'border-teal-600 bg-teal-50 text-teal-950 font-black shadow-2xs' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}" data-cat="${c.id}">
                  <div class="flex items-center gap-2 min-w-0 pr-1">
                    <span class="text-base shrink-0">${c.icon || '🔗'}</span>
                    <div class="truncate">
                      <div class="font-bold truncate">${c.code}. ${catTitle}</div>
                      <div class="text-[10px] text-slate-400 truncate">${c.description || ''}</div>
                    </div>
                  </div>
                  <span class="text-[10px] font-bold shrink-0 ${isSelected ? 'text-teal-600 font-black' : 'text-slate-400'}">${isSelected ? '✓ 選択' : '＋追加'}</span>
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <!-- E. ランダム出題・多様化設定 -->
        <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
          <div class="font-black text-slate-800 flex items-center gap-2">
            <span>🎲</span> ランダム出題・条件多様化オプション
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
            <label class="flex items-center gap-2 cursor-pointer bg-white p-2 rounded-lg border border-slate-200 hover:bg-slate-50">
              <input type="checkbox" id="chk-condition-shuffling" class="accent-teal-600 rounded" ${s.conditionShuffling ? 'checked' : ''} />
              <span class="font-bold text-[11px]">主語同一/不一致・肯定否定・時制の多様化</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer bg-white p-2 rounded-lg border border-slate-200 hover:bg-slate-50">
              <input type="checkbox" id="chk-include-generated" class="accent-teal-600 rounded" ${s.includeGenerated ? 'checked' : ''} />
              <span class="font-bold text-[11px]">動的ランダム生成問題も混合出題（無限演習）</span>
            </label>
          </div>
        </div>

        <!-- F. 学習開始ボタン -->
        <div class="pt-2 text-center">
          <button type="button" id="btn-start-complex-quiz" class="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 active:scale-98 text-white font-black text-base px-10 py-3.5 rounded-2xl shadow-md transition-all cursor-pointer">
            <span>🚀</span> 複文マスター学習を開始する →
          </button>
        </div>

      </div>
    `;
  }

  // ========================================================================
  // 2. クイズ実行画面（Quiz View）
  // ========================================================================
  static renderQuizView() {
    const q = this.state.currentQuestion;
    if (!q) {
      return `
        <div class="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-4">
          <p class="text-sm text-slate-600">問題の読み込みに失敗しました。</p>
          <button type="button" class="btn-to-settings bg-teal-600 text-white font-bold px-4 py-2 rounded-xl text-xs">
            設定に戻る
          </button>
        </div>
      `;
    }

    const currentNum = this.state.currentIndex + 1;
    const totalQ = this.state.questions.length;
    const progressPercent = Math.round((currentNum / totalQ) * 100);
    const catName = this.getCategoryName(q.category);
    const catObj = this.getCategory(q.category);
    const isInputMode = this.state.settings.answerMode === 'input';

    return `
      <div class="space-y-4 animate-fade-in">

        <!-- ステータスバー -->
        <div class="bg-white px-4 py-3 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-2 text-xs">
          <div class="flex items-center gap-2">
            <span class="font-black text-teal-800 text-sm">第 ${currentNum} / ${totalQ} 問</span>
            <span class="text-slate-300">|</span>
            <span class="px-2 py-0.5 rounded font-bold ${isInputMode ? 'bg-purple-100 text-purple-800' : 'bg-teal-100 text-teal-800'} text-[11px]">
              ${isInputMode ? '✍️ 記述式' : '🔘 選択式'}
            </span>
            <span class="text-slate-300 hidden sm:inline">|</span>
            <span class="hidden sm:inline font-bold text-slate-700">
              ${catObj.icon || '🔗'} ${catName}
            </span>
          </div>

          <div class="flex items-center gap-3">
            <div class="w-24 sm:w-32 bg-slate-100 rounded-full h-2 overflow-hidden">
              <div class="bg-teal-600 h-2 rounded-full transition-all duration-300" style="width: ${progressPercent}%;"></div>
            </div>
            <button type="button" class="btn-to-settings text-slate-500 hover:text-slate-800 font-bold text-[11px] underline cursor-pointer">
              ⚙️ 設定変更
            </button>
          </div>
        </div>

        <!-- 問題カード -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-7 space-y-5">
          
          <!-- カテゴリー・難易度ヘッダー -->
          <div class="flex items-center justify-between text-xs border-b border-slate-100 pb-3">
            <span class="inline-flex items-center gap-1.5 font-black text-teal-900 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full text-xs">
              <span>${catObj.icon || '🔗'}</span> ${catName}
            </span>
            <div class="flex items-center gap-2">
              ${this.getDifficultyBadge(q.difficulty)}
              ${q.conditions && q.conditions.subjectRelation === 'same' ? '<span class="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold">主語同一</span>' : ''}
              ${q.conditions && q.conditions.subjectRelation === 'different' ? '<span class="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">主語不一致</span>' : ''}
            </div>
          </div>

          <!-- 問題文本体 -->
          <div class="space-y-2 text-center py-2">
            <div class="text-lg sm:text-2xl font-black text-slate-900 leading-relaxed tracking-wide font-sans">
              ${this.formatPromptWithBlank(q.prompt || '')}
            </div>
            <div class="text-xs sm:text-sm text-slate-500 font-medium">
              ${q.promptJa || q.japanese || ''}
            </div>
          </div>

          <!-- 回答入力／選択肢エリア -->
          ${!this.state.hasAnswered ? (
            isInputMode ? this.renderInputForm(q) : this.renderChoiceButtons(q)
          ) : ''}

          <!-- 回答後解説カード -->
          ${this.state.hasAnswered ? this.renderExplanationCard(q) : ''}

        </div>

      </div>
    `;
  }

  // --- 空欄表示ハイライト ---
  static formatPromptWithBlank(prompt) {
    if (!prompt) return '';
    return prompt.replace(/_{2,}/g, '<span class="inline-block mx-1 px-3 py-0.5 rounded-lg bg-teal-100/80 border-2 border-dashed border-teal-500 text-teal-900 font-mono font-bold text-sm sm:text-base">____</span>');
  }

  // --- 選択式ボタン群 ---
  static renderChoiceButtons(q) {
    const options = q.options || [];
    const labels = ['A', 'B', 'C', 'D'];

    return `
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        ${options.map((opt, i) => `
          <button type="button" class="btn-cs-choice group p-3.5 sm:p-4 rounded-xl border-2 border-slate-200 hover:border-teal-500 hover:bg-teal-50/40 text-left transition-all active:scale-98 flex items-center justify-between cursor-pointer" data-choice="${opt}">
            <div class="flex items-center gap-3">
              <span class="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-teal-600 group-hover:text-white text-slate-700 font-black text-xs flex items-center justify-center transition">
                ${labels[i] || (i + 1)}
              </span>
              <span class="text-base sm:text-lg font-bold text-slate-800 font-mono">
                ${opt}
              </span>
            </div>
            <span class="text-slate-300 group-hover:text-teal-600 text-xs font-bold transition">選択 →</span>
          </button>
        `).join('')}
      </div>
    `;
  }

  // --- 記述式フォーム ---
  static renderInputForm(q) {
    return `
      <div class="space-y-4 pt-2">
        <div class="max-w-md mx-auto space-y-3">
          <div class="relative">
            <input type="text" id="cs-input-answer" placeholder="空欄に入るモンゴル語（接続語尾など）を入力..." class="w-full text-center text-lg sm:text-xl font-bold font-mono px-4 py-3 rounded-xl border-2 border-teal-500 focus:outline-hidden focus:ring-4 focus:ring-teal-100 bg-white text-slate-900" autofocus autocomplete="off" />
          </div>
          <div class="text-center">
            <button type="button" id="btn-submit-cs-input" class="w-full bg-teal-600 hover:bg-teal-700 text-white font-black text-sm py-3 rounded-xl shadow transition active:scale-98 cursor-pointer">
              回答する (Enter)
            </button>
          </div>
        </div>

        <!-- オンスクリーンキリルキーボードアシスタント -->
        <div class="pt-2">
          ${renderCyrillicInputAssistantHTML()}
        </div>
      </div>
    `;
  }

  // --- 解説カード ---
  static renderExplanationCard(q) {
    const isCorrect = this.state.isCorrect;
    const catName = this.getCategoryName(q.category);

    return `
      <div class="space-y-4 animate-fade-in border-t border-slate-100 pt-5">
        
        <!-- 正誤判定ヘッダー -->
        <div class="p-4 rounded-xl border flex items-center justify-between ${isCorrect ? 'bg-emerald-50 border-emerald-200 text-emerald-950' : 'bg-rose-50 border-rose-200 text-rose-950'}">
          <div class="flex items-center gap-3">
            <span class="text-2xl">${isCorrect ? '⭕' : '❌'}</span>
            <div>
              <div class="font-black text-base">${isCorrect ? '正解です！' : '不正解'}</div>
              <div class="text-xs ${isCorrect ? 'text-emerald-800' : 'text-rose-800'} mt-0.5">
                正解: <strong class="font-mono text-sm underline">${q.answer || ''}</strong>
                ${!isCorrect && this.state.userAnswer ? `（あなたの回答: <span class="font-mono">${this.state.userAnswer}</span>）` : ''}
              </div>
            </div>
          </div>
          <button type="button" id="btn-next-question" class="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-black text-xs px-5 py-2.5 rounded-xl shadow transition active:scale-95 flex items-center gap-1.5 cursor-pointer">
            <span>次へ進む</span> <span>→</span>
          </button>
        </div>

        <!-- 完全な完成文・日本語訳 -->
        <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5 text-xs">
          <div class="text-slate-500 font-bold text-[10px] uppercase tracking-wider">完成した複文</div>
          <div class="text-sm sm:text-base font-black text-slate-900 font-sans flex items-center gap-2">
            <span>${q.completedSentence || q.prompt || ''}</span>
            <button type="button" class="btn-play-audio text-teal-600 hover:text-teal-800 text-sm cursor-pointer" data-text="${q.completedSentence || ''}" title="音声を聴く">
              🔊
            </button>
          </div>
          <div class="text-xs text-slate-600 font-medium">
            ${q.japanese || q.promptJa || ''}
          </div>
        </div>

        <!-- なぜそれが正解か・なぜ間違いか -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div class="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-1">
            <div class="font-black text-emerald-950 flex items-center gap-1.5">
              <span>💡</span> なぜ「${q.answer || ''}」が正解なのか
            </div>
            <p class="text-slate-700 leading-relaxed text-[11px]">
              ${q.whyCorrect || '文脈における節と節の論理的関係（理由、条件、連続など）に最も適した接続形式です。'}
            </p>
          </div>

          <div class="p-3 bg-amber-50/60 border border-amber-200 rounded-xl space-y-1">
            <div class="font-black text-amber-950 flex items-center gap-1.5">
              <span>⚠️</span> 他の選択肢が間違いの理由
            </div>
            <div class="space-y-1 text-slate-700 text-[11px] leading-relaxed">
              ${q.otherOptionsExplained ? Object.entries(q.otherOptionsExplained).map(([opt, exp]) => `
                <div>・<strong class="font-mono">${opt}</strong>: ${exp}</div>
              `).join('') : '他の選択肢は時制、主語の一致不一致、または逆の意味を表すため不適です。'}
            </div>
          </div>
        </div>

        <!-- 構造分析（語幹＋接辞、節の分解） -->
        <div class="bg-white p-3.5 rounded-xl border border-slate-200 text-xs space-y-2">
          <div class="font-black text-slate-800 flex items-center gap-1.5">
            <span>🧩</span> 複文構造の分解分析
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
            <div class="bg-slate-50 p-2 rounded-lg border border-slate-200">
              <span class="text-slate-500 font-bold block text-[10px]">従属節（前半）</span>
              <span class="font-bold text-slate-900">${q.clause1 || '—'}</span>
            </div>
            <div class="bg-slate-50 p-2 rounded-lg border border-slate-200">
              <span class="text-slate-500 font-bold block text-[10px]">主節（後半）</span>
              <span class="font-bold text-slate-900">${q.clause2 || '—'}</span>
            </div>
            <div class="bg-slate-50 p-2 rounded-lg border border-slate-200">
              <span class="text-slate-500 font-bold block text-[10px]">語幹 ＋ 接続語尾</span>
              <span class="font-mono text-teal-800 font-bold">${q.stemAndSuffix || q.grammar || '—'}</span>
            </div>
          </div>
        </div>

        <!-- What-If 仮想変形タブ -->
        ${q.whatIfScenarios ? `
          <div class="bg-indigo-50/60 p-3.5 rounded-xl border border-indigo-200 text-xs space-y-2">
            <div class="flex items-center justify-between">
              <span class="font-black text-indigo-950 flex items-center gap-1.5">
                <span>🔮</span> 条件が変わるとどう変化する？（What-If比較）
              </span>
              <div class="flex gap-1 text-[10px]">
                <button type="button" class="btn-whatif-tab px-2 py-0.5 rounded font-bold transition cursor-pointer ${this.state.activeWhatIfTab === 'diff_subject' ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-800 border'}" data-tab="diff_subject">主語が別</button>
                <button type="button" class="btn-whatif-tab px-2 py-0.5 rounded font-bold transition cursor-pointer ${this.state.activeWhatIfTab === 'negative' ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-800 border'}" data-tab="negative">否定文</button>
                <button type="button" class="btn-whatif-tab px-2 py-0.5 rounded font-bold transition cursor-pointer ${this.state.activeWhatIfTab === 'question' ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-800 border'}" data-tab="question">疑問文</button>
              </div>
            </div>
            <div id="whatif-content-area" class="text-[11px] text-slate-800 font-medium">
              ${this.getWhatIfContent(q, this.state.activeWhatIfTab)}
            </div>
          </div>
        ` : ''}

      </div>
    `;
  }

  static getWhatIfContent(q, tab) {
    if (!q.whatIfScenarios) return '変形例はありません。';
    if (tab === 'diff_subject') return q.whatIfScenarios.ifDiffSubject || '主語が異なる場合、接続形式や主語の格（属格・対格）が変わることがあります。';
    if (tab === 'negative') return q.whatIfScenarios.ifNegative || '否定にする場合、否定接辞 -гүй や -сангүй が付加されます。';
    if (tab === 'question') return q.whatIfScenarios.ifQuestion || '疑問文にする場合、疑問小詞 уу/үү/бэ が文末に接続します。';
    return '';
  }

  // ========================================================================
  // 3. テスト結果画面（Result View）
  // ========================================================================
  static renderResultView() {
    const total = this.state.results.length;
    const correctCount = this.state.results.filter(r => r.isCorrect).length;
    const rate = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    const isInputMode = this.state.settings.answerMode === 'input';

    return `
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6 text-center animate-fade-in">
        
        <div class="space-y-2">
          <div class="text-4xl sm:text-5xl">🎉</div>
          <h2 class="text-xl sm:text-2xl font-black text-slate-900">複文マスター学習 完了！</h2>
          <p class="text-xs text-slate-500">お疲れ様でした！今回の学習結果です</p>
        </div>

        <!-- スコアカード -->
        <div class="grid grid-cols-3 gap-3 max-w-md mx-auto">
          <div class="bg-slate-50 border border-slate-200 p-3 rounded-xl">
            <span class="text-[10px] text-slate-500 font-bold block">正答率</span>
            <span class="text-xl sm:text-2xl font-black text-teal-700">${rate}%</span>
          </div>
          <div class="bg-slate-50 border border-slate-200 p-3 rounded-xl">
            <span class="text-[10px] text-slate-500 font-bold block">正解数</span>
            <span class="text-xl sm:text-2xl font-black text-emerald-700">${correctCount} / ${total}</span>
          </div>
          <div class="bg-slate-50 border border-slate-200 p-3 rounded-xl">
            <span class="text-[10px] text-slate-500 font-bold block">回答形式</span>
            <span class="text-sm sm:text-base font-black text-slate-800">${isInputMode ? '✍️ 記述式' : '🔘 選択式'}</span>
          </div>
        </div>

        <!-- 解答履歴リスト -->
        <div class="text-left space-y-2 max-w-lg mx-auto pt-2">
          <div class="font-black text-xs text-slate-800">各問の振り返り:</div>
          <div class="max-h-60 overflow-y-auto space-y-1.5 pr-1 text-xs">
            ${this.state.results.map((r, i) => `
              <div class="p-2.5 rounded-lg border flex items-center justify-between ${r.isCorrect ? 'bg-emerald-50/50 border-emerald-200' : 'bg-rose-50/50 border-rose-200'}">
                <div class="flex items-center gap-2">
                  <span class="font-bold">${r.isCorrect ? '⭕' : '❌'}</span>
                  <span class="font-bold text-slate-800">問${i + 1}.</span>
                  <span class="truncate max-w-[200px] sm:max-w-xs text-[11px] text-slate-600">${r.q.completedSentence || r.q.prompt}</span>
                </div>
                <span class="font-mono font-bold text-teal-800 text-[11px] shrink-0">${r.q.answer}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- アクションボタン群 -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <button type="button" id="btn-restart-same" class="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-black text-xs px-6 py-3 rounded-xl shadow cursor-pointer">
            🔄 同じ条件でもう一度解く
          </button>
          <button type="button" class="btn-to-settings w-full sm:w-auto bg-slate-800 hover:bg-slate-900 active:scale-95 text-white font-black text-xs px-6 py-3 rounded-xl shadow cursor-pointer">
            ⚙️ 設定を変更する
          </button>
          <button type="button" id="btn-result-home" class="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-bold text-xs px-6 py-3 rounded-xl cursor-pointer">
            🏠 ホームへ戻る
          </button>
        </div>

      </div>
    `;
  }

  // ========================================================================
  // 4. その他のサブビュー（ランダム組合せ、同一動詞比較、弱点分析、苦手復習）
  // ========================================================================
  static renderRandomMatrixView() {
    return `
      <div class="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 animate-fade-in text-xs">
        <div class="border-b pb-2 flex items-center justify-between">
          <h3 class="font-black text-sm text-slate-900 flex items-center gap-2">
            <span>🎲</span> 完全ランダム複文生成マトリクス
          </h3>
          <button type="button" id="btn-generate-matrix-q" class="bg-teal-600 text-white font-bold px-3 py-1.5 rounded-lg active:scale-95 cursor-pointer">
            新しい問題を生成 🎲
          </button>
        </div>
        <p class="text-slate-600 leading-relaxed">
          主語の一致/不一致、肯定/否定、時制（過去・現在・未来）、文型（疑問・平叙）をランダムに組み合わせて問題を無限生成します。
        </p>
        <div id="random-matrix-target" class="pt-2">
          ${this.renderQuizView()}
        </div>
      </div>
    `;
  }

  static renderSameVerbView() {
    const list = SAME_VERB_COMPARISONS || [];
    const selected = list.find(v => v.id === this.state.selectedVerbId) || list[0];

    return `
      <div class="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 animate-fade-in text-xs">
        <div class="border-b pb-2">
          <h3 class="font-black text-sm text-slate-900 flex items-center gap-2">
            <span>🔄</span> 同一動詞比較マスター
          </h3>
          <p class="text-slate-500 mt-0.5">同じ1つの動詞が、接続語尾の違いによってどのように意味を変えるかを対比学習します</p>
        </div>

        <div class="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          ${list.map(v => `
            <button type="button" class="btn-select-verb px-3 py-1.5 rounded-xl font-bold transition cursor-pointer whitespace-nowrap ${this.state.selectedVerbId === v.id ? 'bg-teal-600 text-white shadow-2xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}" data-verbid="${v.id}">
              ${v.verb}（${v.meaning}）
            </button>
          `).join('')}
        </div>

        ${selected ? `
          <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div class="flex items-center justify-between border-b border-slate-200 pb-2">
              <span class="font-black text-base text-teal-900">${selected.verb} <span class="text-xs font-normal text-slate-500">(${selected.meaning})</span></span>
              <span class="text-[11px] text-slate-500">語幹: <code class="font-mono font-bold">${selected.stem}</code></span>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              ${(selected.forms || []).map(f => `
                <div class="p-2.5 bg-white rounded-lg border border-slate-200 space-y-1">
                  <div class="flex items-center justify-between">
                    <span class="font-mono font-bold text-teal-800 text-sm">${f.form}</span>
                    <span class="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">${this.getCategoryName(f.category)}</span>
                  </div>
                  <div class="text-[11px] text-slate-700 font-bold">${f.sentence}</div>
                  <div class="text-[10px] text-slate-500">${f.japanese}</div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }

  static renderAnalyticsView() {
    const stats = this.state.userStats;
    const total = stats.totalAnswered || 0;
    const correct = stats.totalCorrect || 0;
    const rate = total > 0 ? Math.round((correct / total) * 100) : 0;

    return `
      <div class="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 animate-fade-in text-xs">
        <div class="border-b pb-2">
          <h3 class="font-black text-sm text-slate-900 flex items-center gap-2">
            <span>📊</span> 複文弱点分析レーダー
          </h3>
          <p class="text-slate-500 mt-0.5">あなたの複文理解度とカテゴリー別の強み・弱点を分析します</p>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
          <div class="bg-slate-50 p-3 rounded-xl border">
            <span class="text-[10px] text-slate-500 block font-bold">総回答数</span>
            <span class="text-lg font-black text-slate-800">${total}</span>
          </div>
          <div class="bg-slate-50 p-3 rounded-xl border">
            <span class="text-[10px] text-slate-500 block font-bold">総正答数</span>
            <span class="text-lg font-black text-emerald-700">${correct}</span>
          </div>
          <div class="bg-slate-50 p-3 rounded-xl border">
            <span class="text-[10px] text-slate-500 block font-bold">総合正答率</span>
            <span class="text-lg font-black text-teal-700">${rate}%</span>
          </div>
          <div class="bg-slate-50 p-3 rounded-xl border">
            <span class="text-[10px] text-slate-500 block font-bold">要復習項目</span>
            <span class="text-lg font-black text-rose-700">${stats.mistakeIds ? stats.mistakeIds.length : 0}</span>
          </div>
        </div>

        <!-- カテゴリー別内訳 -->
        <div class="space-y-2 pt-2">
          <div class="font-black text-slate-800">カテゴリー別習熟度:</div>
          <div class="space-y-1.5">
            ${COMPLEX_SENTENCE_CATEGORIES.map(c => {
              const catTitle = c.titleJa || c.name || '複文構文';
              const s = (stats.byCategory && stats.byCategory[c.id]) || { total: 0, correct: 0 };
              const r = s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
              return `
                <div class="p-2 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span>${c.icon || '🔗'}</span>
                    <span class="font-bold text-slate-800">${catTitle}</span>
                  </div>
                  <div class="flex items-center gap-3">
                    <span class="text-[10px] text-slate-500">${s.correct}/${s.total}問</span>
                    <div class="w-16 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div class="bg-teal-600 h-1.5 rounded-full" style="width: ${r}%;"></div>
                    </div>
                    <span class="font-mono font-bold w-8 text-right ${r >= 70 ? 'text-emerald-700' : 'text-slate-700'}">${r}%</span>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;
  }

  static renderMistakesView() {
    const mistakeIds = this.state.userStats.mistakeIds || [];
    const mistakes = CURATED_COMPLEX_QUESTIONS.filter(q => mistakeIds.includes(q.id));

    return `
      <div class="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 animate-fade-in text-xs">
        <div class="border-b pb-2 flex items-center justify-between">
          <div>
            <h3 class="font-black text-sm text-slate-900 flex items-center gap-2">
              <span>🔥</span> 苦手複文の集中特訓
            </h3>
            <p class="text-slate-500 mt-0.5">過去に間違えた複文問題 (${mistakes.length} 問)</p>
          </div>
          ${mistakes.length > 0 ? `
            <button type="button" id="btn-start-mistakes-quiz" class="bg-rose-600 hover:bg-rose-700 text-white font-bold px-3 py-1.5 rounded-lg active:scale-95 cursor-pointer">
              この${mistakes.length}問を特訓する →
            </button>
          ` : ''}
        </div>

        ${mistakes.length === 0 ? `
          <div class="text-center py-8 text-slate-500">
            <span class="text-3xl block mb-2">✨</span>
            現在、復習対象の間違い問題はありません！完璧です。
          </div>
        ` : `
          <div class="space-y-2">
            ${mistakes.map(m => `
              <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div class="flex items-center justify-between">
                  <span class="font-bold text-teal-800">${this.getCategoryName(m.category)}</span>
                  <span class="font-mono font-bold text-slate-900">正解: ${m.answer}</span>
                </div>
                <div class="font-black text-slate-900 text-sm">${m.completedSentence || m.prompt}</div>
                <div class="text-slate-600 text-[11px]">${m.japanese || m.promptJa}</div>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    `;
  }

  // ========================================================================
  // 5. イベントバインド
  // ========================================================================
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

    // 設定画面へ戻るボタン群
    const backSettingsBtn = this.container.querySelector('#btn-back-settings');
    if (backSettingsBtn) {
      backSettingsBtn.addEventListener('click', () => {
        this.cleanupKeyHandler();
        this.state.view = 'settings';
        this.render();
      });
    }
    this.container.querySelectorAll('.btn-to-settings').forEach(btn => {
      btn.addEventListener('click', () => {
        this.cleanupKeyHandler();
        this.state.view = 'settings';
        this.render();
      });
    });

    // サブタブ切り替え
    this.container.querySelectorAll('.btn-sub-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        this.cleanupKeyHandler();
        const v = btn.dataset.view;
        this.state.view = v;
        if (v === 'quiz') {
          this.state.view = 'settings';
        } else if (v === 'random_matrix') {
          this.startQuiz();
          this.state.view = 'random_matrix';
        }
        this.render();
      });
    });

    // --- 設定画面のイベント ---
    if (this.state.view === 'settings') {
      // 回答形式
      this.container.querySelectorAll('.btn-setting-mode').forEach(btn => {
        btn.addEventListener('click', () => {
          this.state.settings.answerMode = btn.dataset.mode;
          this.render();
        });
      });

      // 出題数
      this.container.querySelectorAll('.btn-setting-count').forEach(btn => {
        btn.addEventListener('click', () => {
          const c = btn.dataset.count;
          this.state.settings.count = c === 'all' ? 'all' : parseInt(c, 10);
          this.render();
        });
      });

      // 指定問題数
      const btnApplyCustom = this.container.querySelector('#btn-apply-custom-count');
      if (btnApplyCustom) {
        btnApplyCustom.addEventListener('click', () => {
          const inp = this.container.querySelector('#input-custom-count');
          if (inp && inp.value) {
            const v = parseInt(inp.value, 10);
            if (v > 0) {
              this.state.settings.count = 'custom';
              this.state.settings.customCount = v;
              this.render();
            }
          }
        });
      }

      // 難易度
      this.container.querySelectorAll('.btn-setting-diff').forEach(btn => {
        btn.addEventListener('click', () => {
          this.state.settings.difficulty = btn.dataset.diff;
          this.render();
        });
      });

      // カテゴリー選択
      const btnSelectAll = this.container.querySelector('#btn-select-all-cats');
      if (btnSelectAll) {
        btnSelectAll.addEventListener('click', () => {
          this.state.settings.categories = ['all'];
          this.render();
        });
      }

      this.container.querySelectorAll('.btn-toggle-cat').forEach(btn => {
        btn.addEventListener('click', () => {
          const cat = btn.dataset.cat;
          if (cat === 'all') {
            this.state.settings.categories = ['all'];
          } else {
            let cur = this.state.settings.categories.filter(c => c !== 'all');
            if (cur.includes(cat)) {
              cur = cur.filter(c => c !== cat);
              if (cur.length === 0) cur = ['all'];
            } else {
              cur.push(cat);
            }
            this.state.settings.categories = cur;
          }
          this.render();
        });
      });

      // オプションチェックボックス
      const chkCondition = this.container.querySelector('#chk-condition-shuffling');
      if (chkCondition) {
        chkCondition.addEventListener('change', (e) => {
          this.state.settings.conditionShuffling = e.target.checked;
        });
      }
      const chkGenerated = this.container.querySelector('#chk-include-generated');
      if (chkGenerated) {
        chkGenerated.addEventListener('change', (e) => {
          this.state.settings.includeGenerated = e.target.checked;
        });
      }

      // クイズ開始ボタン
      const btnStart = this.container.querySelector('#btn-start-complex-quiz');
      if (btnStart) {
        btnStart.addEventListener('click', () => {
          this.startQuiz();
        });
      }
    }

    // --- クイズ画面のイベント ---
    if (this.state.view === 'quiz' || this.state.view === 'random_matrix') {
      // 選択式クリック
      this.container.querySelectorAll('.btn-cs-choice').forEach(btn => {
        btn.addEventListener('click', () => {
          if (this.state.hasAnswered) return;
          this.handleAnswer(btn.dataset.choice);
        });
      });

      // 記述式フォーム
      const inputEl = this.container.querySelector('#cs-input-answer');
      const submitBtn = this.container.querySelector('#btn-submit-cs-input');
      if (inputEl && submitBtn) {
        // キリルキーボードアシスタント連動
        bindCyrillicInputAssistant(this.container, inputEl);

        submitBtn.addEventListener('click', () => {
          if (this.state.hasAnswered) return;
          this.handleAnswer(inputEl.value);
        });
      }

      // 音声再生
      this.container.querySelectorAll('.btn-play-audio').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const t = btn.dataset.text;
          if (t && typeof SpeechService !== 'undefined') {
            SpeechService.speak(t);
          }
        });
      });

      // What-If タブ切り替え
      this.container.querySelectorAll('.btn-whatif-tab').forEach(btn => {
        btn.addEventListener('click', () => {
          this.state.activeWhatIfTab = btn.dataset.tab;
          const area = this.container.querySelector('#whatif-content-area');
          if (area && this.state.currentQuestion) {
            area.innerHTML = this.getWhatIfContent(this.state.currentQuestion, btn.dataset.tab);
          }
          this.container.querySelectorAll('.btn-whatif-tab').forEach(b => {
            b.className = (b === btn)
              ? 'btn-whatif-tab px-2 py-0.5 rounded font-bold transition cursor-pointer bg-indigo-600 text-white'
              : 'btn-whatif-tab px-2 py-0.5 rounded font-bold transition cursor-pointer bg-white text-indigo-800 border';
          });
        });
      });

      // 次へボタン
      const nextBtn = this.container.querySelector('#btn-next-question');
      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          this.nextQuestion();
        });
      }
    }

    // --- 結果画面のイベント ---
    if (this.state.view === 'result') {
      const btnRestartSame = this.container.querySelector('#btn-restart-same');
      if (btnRestartSame) {
        btnRestartSame.addEventListener('click', () => {
          this.startQuiz();
        });
      }
      const btnResultHome = this.container.querySelector('#btn-result-home');
      if (btnResultHome) {
        btnResultHome.addEventListener('click', () => {
          this.cleanupKeyHandler();
          if (this.onNavigate) this.onNavigate('home');
        });
      }
    }

    // --- 同一動詞比較タブ ---
    if (this.state.view === 'same_verb') {
      this.container.querySelectorAll('.btn-select-verb').forEach(btn => {
        btn.addEventListener('click', () => {
          this.state.selectedVerbId = btn.dataset.verbid;
          this.render();
        });
      });
    }

    // --- 苦手特訓スタート ---
    const btnStartMistakes = this.container.querySelector('#btn-start-mistakes-quiz');
    if (btnStartMistakes) {
      btnStartMistakes.addEventListener('click', () => {
        const mistakeIds = this.state.userStats.mistakeIds || [];
        const mistakes = CURATED_COMPLEX_QUESTIONS.filter(q => mistakeIds.includes(q.id));
        if (mistakes.length > 0) {
          this.state.questions = shuffleArray(mistakes);
          this.state.currentIndex = 0;
          this.state.results = [];
          this.state.view = 'quiz';
          this.loadCurrentQuestion();
          this.render();
        }
      });
    }

    // ランダム問題再生成
    const btnGenMatrix = this.container.querySelector('#btn-generate-matrix-q');
    if (btnGenMatrix) {
      btnGenMatrix.addEventListener('click', () => {
        this.startQuiz();
        this.state.view = 'random_matrix';
        this.render();
      });
    }
  }

  // ========================================================================
  // 6. 解答判定と結果更新
  // ========================================================================
  static handleAnswer(answer) {
    if (this.state.hasAnswered) return;
    const q = this.state.currentQuestion;
    if (!q) return;

    this.state.hasAnswered = true;
    this.state.userAnswer = (answer || '').trim();

    // 正誤判定
    const expected = (q.answer || '').trim();
    let isCorrect = false;

    if (this.state.settings.answerMode === 'input') {
      // 記述式：柔軟なファジー判定（トリム、小文字、記号除去、isFuzzyMatch）
      const normInput = this.normalizeAnswer(this.state.userAnswer);
      const normExpected = this.normalizeAnswer(expected);
      isCorrect = normInput === normExpected || isFuzzyMatch(this.state.userAnswer, expected);
      if (!isCorrect && q.alternativeAnswers && Array.isArray(q.alternativeAnswers)) {
        isCorrect = q.alternativeAnswers.some(alt => this.normalizeAnswer(alt) === normInput);
      }
    } else {
      // 選択式：完全一致
      isCorrect = this.state.userAnswer === expected;
    }

    this.state.isCorrect = isCorrect;

    // 音効
    if (typeof SoundEffects !== 'undefined') {
      if (isCorrect) SoundEffects.playCorrect();
      else SoundEffects.playIncorrect();
    }

    // スコア＆統計更新
    const stats = this.state.userStats;
    stats.totalAnswered += 1;
    if (isCorrect) {
      stats.totalCorrect += 1;
      this.state.sessionScore += 10;
      this.state.sessionXp += 15;
      if (typeof GamificationService !== 'undefined') {
        GamificationService.addXp(15);
      }
      // 間違いリストから削除
      if (stats.mistakeIds) {
        stats.mistakeIds = stats.mistakeIds.filter(id => id !== q.id);
      }
    } else {
      // 間違いリストに追加
      if (!stats.mistakeIds) stats.mistakeIds = [];
      if (!stats.mistakeIds.includes(q.id)) {
        stats.mistakeIds.push(q.id);
      }
    }

    // カテゴリー統計
    if (q.category) {
      if (!stats.byCategory[q.category]) {
        stats.byCategory[q.category] = { total: 0, correct: 0 };
      }
      stats.byCategory[q.category].total += 1;
      if (isCorrect) stats.byCategory[q.category].correct += 1;
    }

    this.saveStats();

    // 履歴記録
    this.state.results.push({
      q: q,
      userAnswer: this.state.userAnswer,
      isCorrect: isCorrect,
      isInput: this.state.settings.answerMode === 'input'
    });

    this.render();
  }

  static normalizeAnswer(str) {
    if (!str) return '';
    return str.toLowerCase().replace(/[\s\.\,\!\?\-—_]/g, '');
  }

  // --- 次の問題へ ---
  static nextQuestion() {
    this.cleanupKeyHandler();
    this.state.currentIndex += 1;
    if (this.state.currentIndex >= this.state.questions.length) {
      this.state.view = 'result';
      this.render();
    } else {
      this.loadCurrentQuestion();
      this.render();
    }
  }
}

// グローバル参照
if (typeof window !== 'undefined') {
  window.ComplexSentenceComponent = ComplexSentenceComponent;
}
