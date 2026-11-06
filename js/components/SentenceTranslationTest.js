// 文章入力テスト（和訳・モンゴル語訳 双方向文翻訳特訓コンポーネント）
// 1. 翻訳方向選択（日本語 ➔ モンゴル語訳 / モンゴル語 ➔ 日本語訳）
// 2. 出題数＆ジャンル選択（全1,400+文から多彩に出題）
// 3. キリル文字アシストパレット（ө, ү, ь, ъ, щ 等を1タップ挿入）
// 4. 音声読み上げ（通常速＆ゆっくり0.8x）、折りたたみヒント（ネタバレ防止）
// 5. 柔軟なファジー判定 ＆ 和訳表現ゆれ自己正解化ボタン
// 6. 間違いの自動記録 ＆ 終了後全問復習一覧 ＆ 間違いノート直行連携

import { StorageService } from '../services/storage.js';
import { SpeechService } from '../services/speech.js';
import { GamificationService } from '../services/gamification.js';
import { PenguinMascot } from './PenguinMascot.js';
import { CyrillicKeyboard } from './CyrillicKeyboard.js';
import { SoundEffects, shuffleArray, isFuzzyMatch, SPECIAL_CYRILLIC_BAR } from '../utils/helpers.js';
import { initialTypingSentences } from '../data/typingSentences.js';
import { initialVocabulary } from '../data/initialVocabulary.js';

export class SentenceTranslationTestComponent {
  static container = null;
  static onNavigate = null;

  static state = {
    view: 'settings', // 'settings' | 'testing' | 'result'
    settings: {
      direction: 'ja_to_mn', // 'ja_to_mn' (日本語 ➔ モンゴル語訳) | 'mn_to_ja' (モンゴル語 ➔ 日本語訳)
      count: 10, // 5 | 10 | 20 | 'all'
      category: 'all' // 'all' | 'greetings' | 'daily' | 'food_travel' | 'grammar_expressions' | 'culture_nature'
    },
    quizzes: [],
    currentIndex: 0,
    currentQuiz: null,
    userInput: '',
    hasAnswered: false,
    isCorrect: false,
    showHint: false,
    results: [],
    resultFilter: 'all',
    sessionScore: 0,
    sessionXp: 0,
    sessionCombo: 0,
    maxCombo: 0,
    isCyrillicShift: false
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

  // ==========================================
  // 文章データベースのロード＆集約
  // ==========================================
  static getAllSentences() {
    const list = [];
    const seen = new Set();

    // 1. initialTypingSentences から抽出
    if (typeof initialTypingSentences !== 'undefined' && Array.isArray(initialTypingSentences)) {
      initialTypingSentences.forEach(s => {
        if (!s.textMn || !s.textJa) return;
        const key = s.textMn.trim();
        if (seen.has(key)) return;
        seen.add(key);

        list.push({
          id: s.id || `type_${list.length}`,
          textMn: s.textMn.trim(),
          textJa: s.textJa.trim(),
          category: s.category || 'daily',
          categoryLabel: s.categoryLabel || '日常会話',
          explanation: s.explanation || '',
          level: s.level || '初級',
          source: 'typing_sentences'
        });
      });
    }

    // 2. initialVocabulary の例文から抽出
    let vocabList = [];
    try {
      if (typeof StorageService !== 'undefined' && StorageService.getVocabulary) {
        vocabList = StorageService.getVocabulary();
      } else if (typeof initialVocabulary !== 'undefined') {
        vocabList = initialVocabulary;
      }
    } catch (_) {
      if (typeof initialVocabulary !== 'undefined') vocabList = initialVocabulary;
    }

    vocabList.forEach((w, idx) => {
      if (w.exampleMn && w.exampleJa) {
        const mn = w.exampleMn.trim();
        const ja = w.exampleJa.trim();
        if (mn.length < 3 || ja.length < 2) return;
        if (seen.has(mn)) return;
        seen.add(mn);

        list.push({
          id: `vocab_ex_${idx}`,
          textMn: mn,
          textJa: ja,
          category: w.category || 'daily',
          categoryLabel: w.category || '基本例文',
          explanation: `単語「${w.mongolian}」（${w.japanese}）を用いた実践例文です。${w.note ? `【メモ】${w.note}` : ''}`,
          level: (w.priority && w.priority.length >= 3) ? '初級' : '中級',
          source: 'vocabulary_examples'
        });
      }
    });

    // 3. ユーザー登録カスタム文章
    try {
      if (typeof StorageService !== 'undefined' && StorageService.getCustomTypingSentences) {
        const custom = StorageService.getCustomTypingSentences() || [];
        custom.forEach(c => {
          if (!c.textMn || !c.textJa) return;
          const key = c.textMn.trim();
          if (seen.has(key)) return;
          seen.add(key);

          list.push({
            id: c.id || `custom_${list.length}`,
            textMn: c.textMn.trim(),
            textJa: c.textJa.trim(),
            category: 'custom',
            categoryLabel: 'マイ登録文章',
            explanation: c.explanation || '登録されたオリジナル文章です。',
            level: 'カスタム',
            source: 'custom'
          });
        });
      }
    } catch (_) {}

    return list;
  }

  // カテゴリーの分類ヘルパー
  static categorizeSentence(s) {
    const cat = (s.category || '').toLowerCase();
    const lbl = (s.categoryLabel || '').toLowerCase();
    const ja = (s.textJa || '').toLowerCase();

    if (cat === 'custom') return 'custom';
    if (anyMatch([cat, lbl, ja], ['挨拶', '自己紹介', '名前', '初めまして', 'こんにちは', 'ありがとう', 'さようなら', 'お元気', 'お願い'])) {
      return 'greetings';
    }
    if (anyMatch([cat, lbl, ja], ['食', '料理', '飲', 'カフェ', 'レストラン', '買', '店', '旅', '交通', 'ホテル', '駅', '空港', '肉', '茶', '円', 'トゥグルグ', '注文'])) {
      return 'food_travel';
    }
    if (anyMatch([cat, lbl, ja], ['文法', '語尾', '格', '動詞', '形容詞', '学習', '勉強', '学校', '宿題', '本', '辞書', '先生', '生徒', '大学', '試験'])) {
      return 'grammar_expressions';
    }
    if (anyMatch([cat, lbl, ja], ['文化', '諺', 'ことわざ', '自然', '天気', 'ナーダム', 'ゲル', '遊牧', '馬', '草原', '歴史', '伝統', 'モンゴル人', '砂漠', '湖'])) {
      return 'culture_nature';
    }
    return 'daily';

    function anyMatch(targets, keywords) {
      return targets.some(t => keywords.some(k => t.includes(k)));
    }
  }

  // ==========================================
  // 1. 設定画面
  // ==========================================
  static renderSettings() {
    if (!this.container) return;
    const all = this.getAllSentences();
    const direction = this.state.settings.direction;
    const count = this.state.settings.count;
    const activeCategory = this.state.settings.category;

    const categories = [
      { id: 'all', label: 'すべて', icon: '🌟', desc: `全ジャンルからランダム出題（${all.length}文収録）` },
      { id: 'greetings', label: '基本挨拶・自己紹介', icon: '👋', desc: '出会い・御礼・別れ・定番の自己紹介表現' },
      { id: 'daily', label: '日常生活・会話', icon: '☕', desc: '家事・家族・約束・予定・身近なやり取り' },
      { id: 'food_travel', label: '食事・買い物・旅行', icon: '🍽️', desc: 'レストラン注文・価格交渉・交通機関・宿泊' },
      { id: 'grammar_expressions', label: '文法・重要表現・学習', icon: '📐', desc: '格変化・助動詞・複文・学校や職場の文' },
      { id: 'culture_nature', label: '文化・自然・ことわざ', icon: '🐎', desc: '草原・遊牧生活・ゲル・ナーダム・伝統の知恵' }
    ];

    this.container.innerHTML = `
      <div class="animate-fade-in max-w-2xl mx-auto px-4 py-6 space-y-6">
        
        <!-- ヘッダー -->
        <div class="bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 rounded-3xl p-6 text-white shadow-lg space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs bg-white/20 backdrop-blur-md px-3 py-1 rounded-full font-black uppercase tracking-wider">
              SENTENCE TRANSLATION TEST
            </span>
            <button type="button" id="btn-back-home" class="text-xs text-white/80 hover:text-white px-2.5 py-1 rounded-lg bg-black/10 hover:bg-black/20 transition-all cursor-pointer">
              ✕ ホームへ
            </button>
          </div>
          <h2 class="text-2xl sm:text-3xl font-black flex items-center gap-2">
            <span>✍️</span> 文章入力テストモード
          </h2>
          <p class="text-xs sm:text-sm text-teal-50 leading-relaxed font-medium">
            文章をキーボードで入力して本格的な翻訳力を鍛えるテスト！「モンゴル語に訳す」か「日本語訳にする」かを選んで挑戦しよう。
          </p>
        </div>

        <!-- 1. 翻訳方向の選択（最重要要件） -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl p-5 border-2 border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
          <div class="flex items-center justify-between">
            <label class="block text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <span>🔄</span> 翻訳方向を選んでください（必須）
            </label>
            <span class="text-[11px] font-bold text-teal-600 dark:text-teal-400">ワンタップ切替</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <!-- 選択肢A: 日本語 ➔ モンゴル語訳 -->
            <label class="direction-card p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
              direction === 'ja_to_mn'
                ? 'border-teal-500 bg-teal-50/70 dark:bg-teal-950/40 ring-2 ring-teal-400/40 shadow-xs'
                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 bg-white dark:bg-slate-800/80'
            }">
              <div class="flex items-start justify-between gap-2">
                <div class="flex items-center gap-2">
                  <span class="text-2xl">🇲🇳</span>
                  <div>
                    <div class="font-black text-slate-900 dark:text-white text-sm">
                      日本語 ➔ モンゴル語訳
                    </div>
                    <span class="text-[10px] font-black px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200">
                      キリル文字タイピング
                    </span>
                  </div>
                </div>
                <input type="radio" name="directionOption" value="ja_to_mn" ${direction === 'ja_to_mn' ? 'checked' : ''} class="w-4 h-4 text-teal-600">
              </div>
              <p class="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                日本語の文章を見て、対応するモンゴル語文章をキリル文字で入力！特殊文字パレット（ө, ү, ь, ъ）完備。
              </p>
            </label>

            <!-- 選択肢B: モンゴル語 ➔ 日本語訳 -->
            <label class="direction-card p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
              direction === 'mn_to_ja'
                ? 'border-cyan-500 bg-cyan-50/70 dark:bg-cyan-950/40 ring-2 ring-cyan-400/40 shadow-xs'
                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 bg-white dark:bg-slate-800/80'
            }">
              <div class="flex items-start justify-between gap-2">
                <div class="flex items-center gap-2">
                  <span class="text-2xl">🇯🇵</span>
                  <div>
                    <div class="font-black text-slate-900 dark:text-white text-sm">
                      モンゴル語 ➔ 日本語訳
                    </div>
                    <span class="text-[10px] font-black px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-900 text-cyan-800 dark:text-cyan-200">
                      和訳・意味入力
                    </span>
                  </div>
                </div>
                <input type="radio" name="directionOption" value="mn_to_ja" ${direction === 'mn_to_ja' ? 'checked' : ''} class="w-4 h-4 text-cyan-600">
              </div>
              <p class="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                モンゴル語の文章（ネイティブ音声付き）を読んで・聴いて、その日本語訳を入力！表現のゆれも柔軟に判定。
              </p>
            </label>
          </div>
        </div>

        <!-- 2. 出題数＆カテゴリーの選択 -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
          
          <!-- 出題数 -->
          <div>
            <label class="block text-xs font-black text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
              <span>🔢</span> 出題問題数
            </label>
            <div class="grid grid-cols-4 gap-2 text-xs">
              ${[5, 10, 20, 'all'].map(cnt => `
                <button type="button" class="btn-select-count py-2.5 rounded-xl border font-black transition-all cursor-pointer ${
                  String(count) === String(cnt)
                    ? 'border-teal-600 bg-teal-600 text-white shadow-2xs'
                    : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                }" data-count="${cnt}">
                  ${cnt === 'all' ? '全問' : `${cnt} 問`}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- カテゴリー -->
          <div>
            <label class="block text-xs font-black text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
              <span>🏷️</span> 出題カテゴリー
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              ${categories.map(c => `
                <button type="button" class="btn-select-category text-left p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-2.5 ${
                  activeCategory === c.id
                    ? 'border-teal-500 bg-teal-50/70 dark:bg-teal-950/40 text-teal-950 dark:text-teal-200 font-black shadow-2xs'
                    : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                }" data-category="${c.id}">
                  <span class="text-xl shrink-0">${c.icon}</span>
                  <div class="min-w-0">
                    <div class="font-bold truncate">${c.label}</div>
                    <div class="text-[10px] text-slate-400 dark:text-slate-500 truncate">${c.desc}</div>
                  </div>
                </button>
              `).join('')}
            </div>
          </div>

        </div>

        <!-- スタートボタン -->
        <button type="button" id="btn-start-sentence-test" class="w-full py-4 bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white font-black rounded-2xl shadow-md transition-all active:scale-98 text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer">
          <span>🚀</span>
          <span>文章入力テストを開始する (${count === 'all' ? '全問' : `${count}問`})</span>
          <span>→</span>
        </button>

      </div>
    `;

    // イベントバインド
    this.container.querySelector('#btn-back-home').addEventListener('click', () => {
      if (this.onNavigate) this.onNavigate('home');
    });

    this.container.querySelectorAll('input[name="directionOption"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.state.settings.direction = e.target.value;
        this.renderSettings();
      });
    });

    this.container.querySelectorAll('.btn-select-count').forEach(btn => {
      btn.addEventListener('click', () => {
        const c = btn.getAttribute('data-count');
        this.state.settings.count = c === 'all' ? 'all' : parseInt(c, 10);
        this.renderSettings();
      });
    });

    this.container.querySelectorAll('.btn-select-category').forEach(btn => {
      btn.addEventListener('click', () => {
        this.state.settings.category = btn.getAttribute('data-category');
        this.renderSettings();
      });
    });

    this.container.querySelector('#btn-start-sentence-test').addEventListener('click', () => {
      this.startTest();
    });
  }

  // ==========================================
  // テストの開始処理
  // ==========================================
  static startTest() {
    const all = this.getAllSentences();
    const cat = this.state.settings.category;

    let filtered = all;
    if (cat !== 'all') {
      filtered = all.filter(s => this.categorizeSentence(s) === cat);
      if (filtered.length === 0) filtered = all;
    }

    const shuffled = shuffleArray([...filtered]);
    const count = this.state.settings.count === 'all' ? shuffled.length : Math.min(this.state.settings.count, shuffled.length);
    const selected = shuffled.slice(0, count);

    this.state.quizzes = selected;
    this.state.currentIndex = 0;
    this.state.currentQuiz = selected[0] || null;
    this.state.userInput = '';
    this.state.hasAnswered = false;
    this.state.isCorrect = false;
    this.state.showHint = false;
    this.state.results = [];
    this.state.sessionScore = 0;
    this.state.sessionXp = 0;
    this.state.sessionCombo = 0;
    this.state.maxCombo = 0;
    this.state.view = 'testing';

    this.renderTesting();
  }

  static loadQuiz(idx) {
    if (idx < 0 || idx >= this.state.quizzes.length) {
      this.finishTest();
      return;
    }
    this.state.currentIndex = idx;
    this.state.currentQuiz = this.state.quizzes[idx];
    this.state.userInput = '';
    this.state.hasAnswered = false;
    this.state.isCorrect = false;
    this.state.showHint = false;
    this.renderTesting();
  }

  // ==========================================
  // 2. テスト実施画面
  // ==========================================
  static renderTesting() {
    if (!this.container) return;
    const q = this.state.currentQuiz;
    if (!q) {
      this.finishTest();
      return;
    }

    const idx = this.state.currentIndex;
    const total = this.state.quizzes.length;
    const progress = Math.round(((idx) / total) * 100);
    const isJaToMn = this.state.settings.direction === 'ja_to_mn';

    const promptText = isJaToMn ? q.textJa : q.textMn;
    const targetText = isJaToMn ? q.textMn : q.textJa;

    // キリル文字パレットの文字リスト
    const cyrillicLetters = this.state.isCyrillicShift
      ? ['Ө', 'Ү', 'Ь', 'Ъ', 'Щ', 'Ё', 'Ы', 'Э', 'Ц', 'Ж', 'Х']
      : ['ө', 'ү', 'ь', 'ъ', 'щ', 'ё', 'ы', 'э', 'ц', 'ж', 'х'];

    this.container.innerHTML = `
      <div class="animate-fade-in max-w-xl mx-auto px-4 py-4 space-y-4">
        
        <!-- プログレス ＆ HUD -->
        <div class="space-y-1.5">
          <div class="flex justify-between items-center text-xs font-bold text-slate-500">
            <span class="flex items-center gap-2">
              <span>文章入力 ${idx + 1} / ${total}</span>
              ${this.state.sessionCombo >= 2 ? `
                <span class="px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200 animate-bounce text-[10px]">
                  🔥 ${this.state.sessionCombo} COMBO
                </span>
              ` : ''}
              <span class="text-[10px] px-2 py-0.5 rounded-full font-bold ${
                isJaToMn ? 'bg-teal-100 text-teal-800 border border-teal-200' : 'bg-cyan-100 text-cyan-800 border border-cyan-200'
              }">
                ${isJaToMn ? '🇲🇳 日本語 ➔ モンゴル語訳' : '🇯🇵 モンゴル語 ➔ 日本語訳'}
              </span>
            </span>
            <div class="flex items-center gap-3">
              <span class="text-amber-600 font-extrabold">+${this.state.sessionScore} PTS</span>
              <span class="text-amber-700 font-extrabold">+${this.state.sessionXp} XP</span>
              <button type="button" id="btn-quit-test" class="text-slate-400 hover:text-slate-700 ml-1 cursor-pointer">中断</button>
            </div>
          </div>
          <div class="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
            <div class="bg-gradient-to-r from-teal-500 to-cyan-500 h-full transition-all duration-300" style="width: ${progress}%"></div>
          </div>
        </div>

        <!-- 問題プロンプトカード -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
          
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
              ${isJaToMn ? '以下の日本語をモンゴル語に訳してください' : '以下のモンゴル語を日本語に訳してください'}
            </span>
            <span class="text-[11px] font-bold text-slate-400">
              ${q.categoryLabel || '文翻訳'}
            </span>
          </div>

          <!-- プロンプト文 -->
          <div class="py-2 text-center space-y-2">
            <div class="text-lg sm:text-2xl font-black text-slate-900 dark:text-white leading-relaxed ${!isJaToMn ? 'cyrillic-text font-sans' : ''}">
              ${promptText}
            </div>

            <!-- モンゴル語プロンプト時の音声再生ボタン -->
            ${!isJaToMn ? `
              <div class="flex items-center justify-center gap-2 pt-1">
                <button type="button" id="btn-play-prompt-audio" class="px-3 py-1.5 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 hover:bg-cyan-100 text-cyan-800 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs">
                  <span>🔊</span> <span>音声を聞く</span>
                </button>
                <button type="button" id="btn-play-prompt-slow" class="px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 text-slate-600 dark:text-slate-300 border border-slate-200 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer">
                  <span>🐢</span> <span>ゆっくり</span>
                </button>
              </div>
            ` : ''}
          </div>

          <!-- 折りたたみヒント（ネタバレ防止：デフォルト非表示） -->
          <div class="pt-1 border-t border-slate-100 dark:border-slate-700/80">
            <button type="button" id="btn-toggle-sentence-hint" class="text-[11px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 border border-amber-200 dark:border-amber-800 px-3 py-1.5 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5">
              <span>💡 ヒントを見る</span>
              <span class="text-[10px] text-amber-500">${this.state.showHint ? '▲ 閉じる' : '▼ タップで表示'}</span>
            </button>
            ${this.state.showHint ? `
              <div class="mt-2 text-xs text-slate-600 dark:text-slate-300 bg-amber-50/50 dark:bg-slate-900/80 p-3 rounded-xl border border-amber-200 dark:border-slate-700 animate-fade-in space-y-1">
                <div class="font-bold text-amber-900 dark:text-amber-300">💡 キーワード＆構文ヒント:</div>
                <div class="text-[11px] leading-relaxed">${q.explanation || '文法構造や単語の意味を思い出して入力してみましょう。'}</div>
              </div>
            ` : ''}
          </div>

        </div>

        <!-- 入力エリア -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
          
          <div class="flex items-center justify-between">
            <label class="block text-xs font-black text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <span>✍️</span> あなたの回答を入力：
            </label>
            <span class="text-[10px] text-slate-400">Enterキーで回答送信</span>
          </div>

          <!-- モンゴル語入力時のキリル文字クイックパレット -->
          ${isJaToMn ? `
            <div class="p-2 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1.5">
              <div class="flex items-center justify-between text-[10px] text-slate-500 font-bold px-1">
                <span>特殊キリル文字パレット (タップで入力挿入):</span>
                <button type="button" id="btn-toggle-cyrillic-shift" class="text-teal-700 dark:text-teal-400 hover:underline cursor-pointer">
                  ${this.state.isCyrillicShift ? '小文字にする' : '大文字にする (Shift)'}
                </button>
              </div>
              <div class="flex flex-wrap gap-1.5">
                ${cyrillicLetters.map(ch => `
                  <button type="button" class="btn-insert-char w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-black font-sans text-sm hover:bg-teal-50 hover:border-teal-400 active:scale-95 transition-all shadow-2xs cursor-pointer" data-char="${ch}">
                    ${ch}
                  </button>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- テキスト入力ボックス -->
          <div>
            <textarea
              id="sentence-input-field"
              rows="3"
              class="w-full p-3.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium text-sm sm:text-base focus:border-teal-500 focus:outline-hidden transition-all shadow-2xs leading-relaxed ${isJaToMn ? 'cyrillic-text font-sans' : ''}"
              placeholder="${isJaToMn ? 'モンゴル語の文章を入力してください（例: Би япон хүн.）...' : '日本語訳を入力してください（例: 私は日本人です。）...'}"
              ${this.state.hasAnswered ? 'readonly' : ''}
            >${this.state.userInput}</textarea>
          </div>

          <!-- アクションボタン（未回答時） -->
          ${!this.state.hasAnswered ? `
            <div class="flex gap-2 pt-1">
              <button type="button" id="btn-clear-input" class="px-4 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 font-bold rounded-xl text-xs transition-all cursor-pointer">
                クリア
              </button>
              <button type="button" id="btn-submit-sentence" class="flex-1 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-black rounded-xl text-xs sm:text-sm shadow-md transition-all active:scale-98 flex items-center justify-center gap-1.5 cursor-pointer">
                <span>✓ 回答を送信する</span>
                <span class="text-xs text-teal-200 font-normal hidden sm:inline">(Enter)</span>
              </button>
            </div>
          ` : ''}

        </div>

        <!-- 回答後フィードバックカード -->
        ${this.state.hasAnswered ? `
          <div class="animate-fade-in bg-white dark:bg-slate-800 rounded-2xl p-5 border-2 ${
            this.state.isCorrect ? 'border-emerald-400 bg-emerald-50/20 dark:bg-emerald-950/20' : 'border-rose-400 bg-rose-50/20 dark:bg-rose-950/20'
          } shadow-md space-y-4 text-left">
            
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="text-2xl">${this.state.isCorrect ? '⭕' : '❌'}</span>
                <span class="text-sm font-black ${this.state.isCorrect ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'}">
                  ${this.state.isCorrect ? '正解です！素晴らしい！' : '不正解'}
                </span>
              </div>

              <!-- 和訳モード時の「表現のゆれ」自己正解化ボタン -->
              ${(!this.state.isCorrect && !isJaToMn) ? `
                <button type="button" id="btn-override-correct" class="px-3 py-1 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700 text-[11px] font-black hover:bg-amber-200 transition-all cursor-pointer" title="意味が合っている場合は正解に変更できます">
                  ⭕ 正解にする (表現のゆれ)
                </button>
              ` : ''}
            </div>

            <!-- 正解 ＆ あなたの入力 -->
            <div class="space-y-2 text-xs">
              <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <div class="text-[11px] font-bold text-slate-500 flex items-center justify-between">
                  <span>正解の文章:</span>
                  <button type="button" id="btn-play-answer-audio" class="text-teal-600 dark:text-teal-400 hover:text-teal-800 font-bold flex items-center gap-1 cursor-pointer">
                    <span>🔊</span> <span>発音を聞く</span>
                  </button>
                </div>
                <div class="text-base font-black text-slate-900 dark:text-white leading-relaxed ${isJaToMn ? 'cyrillic-text font-sans' : ''}">
                  ${targetText}
                </div>
                <div class="text-[11px] text-slate-500 font-medium">
                  🇯🇵 ${isJaToMn ? q.textJa : q.textMn}
                </div>
              </div>

              <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <div class="text-[11px] font-bold text-slate-500">あなたの回答:</div>
                <div class="text-sm font-bold leading-relaxed ${
                  this.state.isCorrect
                    ? 'text-emerald-700 dark:text-emerald-400'
                    : 'line-through text-rose-600 dark:text-rose-400'
                } ${isJaToMn ? 'cyrillic-text font-sans' : ''}">
                  ${this.state.userInput || '(無回答)'}
                </div>
              </div>
            </div>

            <!-- 解説 -->
            ${q.explanation ? `
              <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 leading-relaxed space-y-1">
                <div class="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                  <span>💡</span> 文法・単語の解説:
                </div>
                <div class="text-[11px]">${q.explanation}</div>
              </div>
            ` : ''}

            <!-- 次の問題へボタン -->
            <button type="button" id="btn-next-sentence" class="w-full py-3.5 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-black rounded-xl text-xs sm:text-sm shadow-md transition-all active:scale-98 flex items-center justify-center gap-1.5 cursor-pointer">
              <span>次の問題へ</span>
              <span>→ (Enter)</span>
            </button>

          </div>
        ` : ''}

      </div>
    `;

    // イベントバインド
    this.bindTestingEvents(q);
  }

  static bindTestingEvents(q) {
    const inputField = this.container.querySelector('#sentence-input-field');

    // フォーカス
    if (inputField && !this.state.hasAnswered) {
      inputField.focus();
    }

    // 中断ボタン
    this.container.querySelector('#btn-quit-test').addEventListener('click', () => {
      this.state.view = 'settings';
      this.renderSettings();
    });

    // ヒント開閉
    const hintBtn = this.container.querySelector('#btn-toggle-sentence-hint');
    if (hintBtn) {
      hintBtn.addEventListener('click', () => {
        this.state.showHint = !this.state.showHint;
        this.renderTesting();
      });
    }

    // 音声再生（プロンプト）
    const audioBtn = this.container.querySelector('#btn-play-prompt-audio');
    if (audioBtn) {
      audioBtn.addEventListener('click', () => {
        SpeechService.speak(q.textMn, { rate: 0.95 });
      });
    }

    const slowAudioBtn = this.container.querySelector('#btn-play-prompt-slow');
    if (slowAudioBtn) {
      slowAudioBtn.addEventListener('click', () => {
        SpeechService.speak(q.textMn, { rate: 0.75 });
      });
    }

    // キリル文字パレット挿入
    this.container.querySelectorAll('.btn-insert-char').forEach(btn => {
      btn.addEventListener('click', () => {
        const char = btn.getAttribute('data-char');
        if (inputField && char) {
          const start = inputField.selectionStart || inputField.value.length;
          const end = inputField.selectionEnd || inputField.value.length;
          const val = inputField.value;
          inputField.value = val.substring(0, start) + char + val.substring(end);
          inputField.selectionStart = inputField.selectionEnd = start + char.length;
          inputField.focus();
          this.state.userInput = inputField.value;
        }
      });
    });

    // Shiftトグル
    const shiftBtn = this.container.querySelector('#btn-toggle-cyrillic-shift');
    if (shiftBtn) {
      shiftBtn.addEventListener('click', () => {
        this.state.isCyrillicShift = !this.state.isCyrillicShift;
        if (inputField) this.state.userInput = inputField.value;
        this.renderTesting();
      });
    }

    // クリアボタン
    const clearBtn = this.container.querySelector('#btn-clear-input');
    if (clearBtn && inputField) {
      clearBtn.addEventListener('click', () => {
        inputField.value = '';
        this.state.userInput = '';
        inputField.focus();
      });
    }

    // 回答提出ロジック
    const submitBtn = this.container.querySelector('#btn-submit-sentence');
    const submitAction = () => {
      if (this.state.hasAnswered) return;
      const val = inputField ? inputField.value : this.state.userInput;
      this.evaluateAnswer(val);
    };

    if (submitBtn) {
      submitBtn.addEventListener('click', submitAction);
    }

    // キーボードショートカット (Enter)
    if (inputField && !this.state.hasAnswered) {
      inputField.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          submitAction();
        }
      });
    }

    // 回答後イベント
    if (this.state.hasAnswered) {
      const playAnsBtn = this.container.querySelector('#btn-play-answer-audio');
      if (playAnsBtn) {
        playAnsBtn.addEventListener('click', () => {
          SpeechService.speak(q.textMn, { rate: 0.95 });
        });
      }

      // 自己正解化ボタン
      const overrideBtn = this.container.querySelector('#btn-override-correct');
      if (overrideBtn) {
        overrideBtn.addEventListener('click', () => {
          this.state.isCorrect = true;
          this.state.sessionScore += 20;
          this.state.sessionXp += 25;
          this.state.sessionCombo++;
          if (this.state.sessionCombo > this.state.maxCombo) {
            this.state.maxCombo = this.state.sessionCombo;
          }
          if (this.state.results.length > 0) {
            this.state.results[this.state.results.length - 1].isCorrect = true;
          }
          SoundEffects.playCorrect();
          this.renderTesting();
        });
      }

      const nextBtn = this.container.querySelector('#btn-next-sentence');
      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          this.loadQuiz(this.state.currentIndex + 1);
        });
      }

      // 次の問題へEnterキーショートカット
      const onKeyNext = (e) => {
        if (e.key === 'Enter') {
          window.removeEventListener('keydown', onKeyNext);
          this.loadQuiz(this.state.currentIndex + 1);
        }
      };
      window.addEventListener('keydown', onKeyNext, { once: true });
    }
  }

  // ==========================================
  // 回答評価ロジック
  // ==========================================
  static evaluateAnswer(rawInput) {
    const q = this.state.currentQuiz;
    if (!q) return;

    const isJaToMn = this.state.settings.direction === 'ja_to_mn';
    const target = isJaToMn ? q.textMn : q.textJa;
    const input = (rawInput || '').trim();

    this.state.userInput = input;
    this.state.hasAnswered = true;

    let isCorrect = false;

    if (isJaToMn) {
      // モンゴル語入力判定（キリル文字の正規化・表記ゆれ対応）
      isCorrect = isFuzzyMatch(input, target);
      if (!isCorrect) {
        // 句点・ハイフン・空白のゆれを許容
        const cleanU = this.normalizeSentence(input);
        const cleanT = this.normalizeSentence(target);
        isCorrect = cleanU === cleanT;
      }
    } else {
      // 日本語訳判定（意味の近似・句読点ゆれ対応）
      const cleanU = input.replace(/[.,!?。、！？\s]/g, '').toLowerCase();
      const cleanT = target.replace(/[.,!?。、！？\s]/g, '').toLowerCase();
      isCorrect = (cleanU === cleanT) || (cleanU.length >= 3 && cleanT.includes(cleanU)) || (cleanT.length >= 3 && cleanU.includes(cleanT));
    }

    this.state.isCorrect = isCorrect;

    if (isCorrect) {
      SoundEffects.playCorrect();
      this.state.sessionScore += 20;
      this.state.sessionXp += 25;
      this.state.sessionCombo++;
      if (this.state.sessionCombo > this.state.maxCombo) {
        this.state.maxCombo = this.state.sessionCombo;
      }
      try {
        if (typeof GamificationService !== 'undefined' && typeof GamificationService.addXp === 'function') {
          GamificationService.addXp(25);
        }
      } catch (_) {}
    } else {
      SoundEffects.playWrong();
      this.state.sessionCombo = 0;

      // ★重要要件: 不正解を確実に StorageService.recordMistake に保存
      try {
        const directionLabel = isJaToMn ? 'モンゴル語訳' : '日本語訳';
        StorageService.recordMistake({
          question: `【文章入力・${directionLabel}】${isJaToMn ? q.textJa : q.textMn}`,
          userAnswer: input || '(無回答)',
          correctAnswer: target,
          options: [],
          type: 'sentence_translation',
          category: '文章入力テスト',
          explanation: `${isJaToMn ? q.textJa : q.textMn} ➔ 正解: ${target}。${q.explanation || ''}`
        });
      } catch (e) {
        console.warn('recordMistake error:', e);
      }
    }

    this.state.results.push({
      quiz: q,
      userInput: input,
      target,
      isCorrect
    });

    this.renderTesting();
  }

  static normalizeSentence(str) {
    return String(str || '')
      .toLowerCase()
      .replace(/ス/g, 'с')
      .replace(/ウ/g, 'у')
      .replace(/エ/g, 'э')
      .replace(/ア/g, 'а')
      .replace(/c/g, 'с')
      .replace(/a/g, 'а')
      .replace(/e/g, 'е')
      .replace(/o/g, 'о')
      .replace(/p/g, 'р')
      .replace(/x/g, 'х')
      .replace(/y/g, 'у')
      .replace(/[.,!?。、！？«»"'\-\s]/g, '');
  }

  static finishTest() {
    SoundEffects.playLevelUp();
    this.state.view = 'result';
    this.renderResult();
  }

  // ==========================================
  // 3. 結果画面（全問復習一覧・フィルター・間違いノート特訓ボタン）
  // ==========================================
  static renderResult() {
    if (!this.container) return;
    const total = this.state.quizzes.length;
    const correctCount = this.state.results.filter(r => r.isCorrect).length;
    const wrongCount = total - correctCount;
    const accuracy = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    const isJaToMn = this.state.settings.direction === 'ja_to_mn';
    const currentFilter = this.state.resultFilter || 'all';

    const filteredResults = this.state.results.filter(r => {
      if (currentFilter === 'correct') return r.isCorrect;
      if (currentFilter === 'wrong') return !r.isCorrect;
      return true;
    });

    this.container.innerHTML = `
      <div class="animate-fade-in max-w-xl mx-auto px-4 py-8 space-y-5">
        
        <!-- アイコン ＆ 祝杯タイトル -->
        <div class="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-teal-600 via-cyan-600 to-blue-600 text-white flex items-center justify-center text-4xl shadow-lg">
          ✍️
        </div>

        <div class="space-y-1 text-center">
          <h2 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">文章入力テスト 終了！</h2>
          <p class="text-xs text-slate-500 dark:text-slate-400">
            ${isJaToMn ? '🇲🇳 日本語 ➔ モンゴル語訳 テスト結果' : '🇯🇵 モンゴル語 ➔ 日本語訳 テスト結果'}
          </p>
        </div>

        <!-- スコアカード -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3 text-center">
          <div class="text-3xl font-black text-teal-600 dark:text-teal-400">
            ${correctCount} <span class="text-sm font-normal text-slate-400">/ ${total} 問正解 (${accuracy}%)</span>
          </div>
          <div class="text-xs font-bold text-slate-700 dark:text-slate-200">
            ${accuracy >= 90 ? '🌟 完璧な翻訳スピード！文章構成力が身についています！' : accuracy >= 70 ? '👍 よく出来ました！文法パターンをしっかり把握できています！' : '💪 間違えた文章を復習して、もう一度スピード特訓しよう！'}
          </div>
          <div class="flex items-center justify-center gap-2 pt-1 text-[11px] font-bold">
            <span class="text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 py-1 px-3 rounded-full">
              +${this.state.sessionXp} XP 獲得！
            </span>
            <span class="text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 py-1 px-3 rounded-full">
              最大 ${this.state.maxCombo} コンボ！
            </span>
          </div>
        </div>

        <!-- 間違いノート自動保存通知バナー ＆ 直行ボタン -->
        ${wrongCount > 0 ? `
          <div class="p-3.5 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs text-left">
            <div class="text-xs text-rose-800 dark:text-rose-200 font-bold flex items-center gap-1.5">
              <span class="text-base">🔥</span>
              <span>間違えた <strong>${wrongCount}</strong> 問を「間違いノート」に自動保存しました</span>
            </div>
            <button type="button" id="btn-goto-mistakes-from-sentence" class="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-black rounded-xl text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0">
              <span>間違いノートで特訓</span>
              <span>→</span>
            </button>
          </div>
        ` : ''}

        <!-- 出題問題の一覧・復習（正解・不正解フィルター切り替え対応） -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3 text-left">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-700">
            <h3 class="text-sm font-extrabold text-slate-800 dark:text-white flex items-center gap-1.5">
              <span>📋</span> 出題問題の一覧・復習 (${total}問)
            </h3>
            <div class="flex items-center gap-1 bg-slate-100 dark:bg-slate-700 p-1 rounded-xl text-xs font-bold self-start sm:self-auto">
              <button type="button" class="filter-sentence-res-btn px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                currentFilter === 'all' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-2xs font-black' : 'text-slate-500 hover:text-slate-800'
              }" data-filter="all">
                すべて (${total})
              </button>
              <button type="button" class="filter-sentence-res-btn px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                currentFilter === 'correct' ? 'bg-emerald-600 text-white shadow-2xs font-black' : 'text-slate-500 hover:text-emerald-700'
              }" data-filter="correct">
                ⭕ 正解 (${correctCount})
              </button>
              <button type="button" class="filter-sentence-res-btn px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                currentFilter === 'wrong' ? 'bg-rose-600 text-white shadow-2xs font-black' : 'text-slate-500 hover:text-rose-700'
              }" data-filter="wrong">
                ❌ 不正解 (${wrongCount})
              </button>
            </div>
          </div>

          ${filteredResults.length === 0 ? `
            <div class="text-center py-6 text-xs text-slate-400">
              該当する問題はありません。
            </div>
          ` : `
            <div class="divide-y divide-slate-100 dark:divide-slate-700 max-h-96 overflow-y-auto pr-1 space-y-3">
              ${filteredResults.map((r, i) => `
                <div class="py-3 space-y-1.5 text-xs">
                  <div class="flex items-center justify-between gap-2">
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      r.isCorrect ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    }">
                      ${r.isCorrect ? '⭕ 正解' : '❌ 不正解'}
                    </span>
                    <button type="button" class="btn-sentence-audio-res text-slate-400 hover:text-teal-600 p-1 rounded-lg transition-colors cursor-pointer" data-text="${r.quiz.textMn}" title="発音を聞く">
                      🔊
                    </button>
                  </div>

                  <!-- 設問 -->
                  <div class="font-black text-slate-900 dark:text-white text-xs sm:text-sm">
                    Q. ${isJaToMn ? r.quiz.textJa : r.quiz.textMn}
                  </div>

                  <!-- 正解 -->
                  <div class="font-bold text-slate-700 dark:text-slate-300">
                    正解: <span class="text-emerald-700 dark:text-emerald-400 font-black ${isJaToMn ? 'cyrillic-text' : ''}">${r.target}</span>
                  </div>

                  <!-- ユーザー回答 -->
                  ${!r.isCorrect ? `
                    <div class="text-slate-500 dark:text-slate-400">
                      あなたの回答: <span class="line-through text-rose-600 dark:text-rose-400 font-medium ${isJaToMn ? 'cyrillic-text' : ''}">${r.userInput || '(無回答)'}</span>
                    </div>
                  ` : `
                    <div class="text-slate-500 dark:text-slate-400">
                      あなたの回答: <span class="text-emerald-700 dark:text-emerald-400 font-bold ${isJaToMn ? 'cyrillic-text' : ''}">${r.userInput}</span> ✅
                    </div>
                  `}

                  <!-- 解説 -->
                  ${r.quiz.explanation ? `
                    <div class="text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl text-[11px] leading-relaxed">
                      💡 ${r.quiz.explanation}
                    </div>
                  ` : ''}
                </div>
              `).join('')}
            </div>
          `}
        </div>

        <!-- フッターアクションボタン -->
        <div class="flex flex-col sm:flex-row gap-2 pt-2">
          <button type="button" id="btn-retry-sentence-test" class="flex-1 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-black rounded-xl text-xs transition-all cursor-pointer shadow-xs">
            もう一度挑戦 🔄
          </button>
          <button type="button" id="btn-change-sentence-settings" class="flex-1 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl text-xs transition-all cursor-pointer">
            翻訳方向・設定を変更 ⚙️
          </button>
          <button type="button" id="btn-sentence-home" class="flex-1 py-3 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs transition-all cursor-pointer">
            ホームへ戻る 🏠
          </button>
        </div>

      </div>
    `;

    // イベントバインド
    this.container.querySelectorAll('.filter-sentence-res-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.state.resultFilter = btn.dataset.filter;
        this.renderResult();
      });
    });

    this.container.querySelectorAll('.btn-sentence-audio-res').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const text = btn.getAttribute('data-text');
        if (text) SpeechService.speak(text, { rate: 0.95 });
      });
    });

    const gotoMistakesBtn = this.container.querySelector('#btn-goto-mistakes-from-sentence');
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

    this.container.querySelector('#btn-retry-sentence-test').addEventListener('click', () => {
      this.startTest();
    });

    this.container.querySelector('#btn-change-sentence-settings').addEventListener('click', () => {
      this.state.view = 'settings';
      this.renderSettings();
    });

    this.container.querySelector('#btn-sentence-home').addEventListener('click', () => {
      if (this.onNavigate) this.onNavigate('home');
    });
  }
}

if (typeof window !== 'undefined') {
  window.SentenceTranslationTestComponent = SentenceTranslationTestComponent;
}
