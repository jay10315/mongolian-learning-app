// 語源・神接尾辞マスターコンポーネント
// 語根と接尾辞のレゴブロック構造を理解し、語彙を体系的に倍増させる特訓モジュール

import { etymologyCategories, etymologyCards, etymologyQuizzes } from '../data/etymologySuffixData.js';
import { SpeechService } from '../services/speech.js';
import { SoundEffects, shuffleArray } from '../utils/helpers.js';
import { GamificationService } from '../services/gamification.js';

export class EtymologyMasterComponent {
  static container = null;
  static onNavigate = null;

  static state = {
    activeTab: 'study', // 'study' | 'quiz' | 'cheatsheet'
    activeCategory: 'all',
    searchQuery: '',

    // クイズ状態
    quiz: {
      questions: [],
      currentIndex: 0,
      currentQ: null,
      selectedChoiceIndex: null,
      hasAnswered: false,
      score: 0,
      streak: 0,
      isFinished: false
    }
  };

  static render(container, onNavigate) {
    this.container = container;
    this.onNavigate = onNavigate;
    if (!this.state.quiz.questions.length) {
      this.initQuiz();
    }
    this.renderMain();
  }

  static initQuiz() {
    this.state.quiz = {
      questions: shuffleArray([...etymologyQuizzes]),
      currentIndex: 0,
      currentQ: null,
      selectedChoiceIndex: null,
      hasAnswered: false,
      score: 0,
      streak: 0,
      isFinished: false
    };
    if (this.state.quiz.questions.length > 0) {
      this.state.quiz.currentQ = this.state.quiz.questions[0];
    }
  }

  static renderMain() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="animate-fade-in max-w-4xl mx-auto px-3 sm:px-4 py-4 space-y-5">
        <!-- ヘッダー -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-200 pb-3 gap-2">
          <div class="flex items-center gap-3">
            <span class="text-3xl p-2.5 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white shadow-sm">💡</span>
            <div>
              <div class="flex items-center gap-2">
                <h2 class="text-xl font-black text-slate-800">語源・神接尾辞マスター</h2>
                <span class="px-2 py-0.5 rounded-full text-[11px] font-black bg-amber-100 text-amber-800 border border-amber-300">エティモロジー特訓</span>
              </div>
              <p class="text-xs text-slate-500 mt-0.5">「語根＋接尾辞」のレゴ構造を見抜いて、語彙力を10倍に爆発させよう！</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button type="button" id="btn-back-home" class="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all shadow-2xs">
              🏠 ホームへ戻る
            </button>
          </div>
        </div>

        <!-- タブ切り替えボタン -->
        <div class="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl">
          <button type="button" class="tab-btn flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-1.5 ${this.state.activeTab === 'study' ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}" data-tab="study">
            <span>📖</span> 語源・接尾辞 探検図鑑
          </button>
          <button type="button" class="tab-btn flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-1.5 ${this.state.activeTab === 'quiz' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}" data-tab="quiz">
            <span>🎯</span> 語源クイズ特訓
          </button>
          <button type="button" class="tab-btn flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-1.5 ${this.state.activeTab === 'cheatsheet' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}" data-tab="cheatsheet">
            <span>📋</span> 一発早見チートシート
          </button>
        </div>

        <!-- コンテンツ領域 -->
        <div id="etymology-tab-content">
          ${this.renderTabContent()}
        </div>
      </div>
    `;

    this.attachEvents();
  }

  static renderTabContent() {
    if (this.state.activeTab === 'study') {
      return this.renderStudyTab();
    } else if (this.state.activeTab === 'quiz') {
      return this.renderQuizTab();
    } else if (this.state.activeTab === 'cheatsheet') {
      return this.renderCheatSheetTab();
    }
    return '';
  }

  // ==========================================
  // タブ1: 探検図鑑
  // ==========================================
  static renderStudyTab() {
    const query = this.state.searchQuery.toLowerCase().trim();
    const filteredCards = etymologyCards.filter(card => {
      const matchCat = this.state.activeCategory === 'all' || card.categoryId === this.state.activeCategory;
      if (!matchCat) return false;
      if (!query) return true;
      return (
        card.suffix.toLowerCase().includes(query) ||
        card.title.toLowerCase().includes(query) ||
        card.coreExplanation.toLowerCase().includes(query) ||
        card.derivedWord.toLowerCase().includes(query) ||
        card.rootWord.toLowerCase().includes(query)
      );
    });

    return `
      <div class="space-y-4 animate-fade-in">
        <!-- 注目バナー：ашгүй の秘密 -->
        <div class="bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 rounded-2xl p-4 sm:p-5 text-white shadow-sm space-y-2">
          <div class="flex items-center gap-2 text-xs font-black tracking-wide uppercase bg-black/20 px-2.5 py-0.5 rounded-full w-fit">
            <span>💡</span> 語源の目からウロコ法則
          </div>
          <h3 class="text-base sm:text-lg font-black leading-snug">
            「ашгүй」の -гүй は「否定（〜なし）」ではなく、古い副詞化接尾辞！
          </h3>
          <p class="text-xs text-white/90 leading-relaxed">
            「аш（恩恵・利益）」＋「-гүй（〜の状態で）」＝『恵みがある好都合な状態で』→『幸いにも！よかった！助かった！』<br class="hidden sm:inline">
            接尾辞の語源を知ることで、丸暗記の苦痛から解放され、モンゴル語がパズルのように楽しく読めるようになります。
          </p>
        </div>

        <!-- 検索バー ＆ カテゴリフィルター -->
        <div class="space-y-2.5 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <div class="relative">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">🔍</span>
            <input type="text" id="etym-search-input" value="${this.state.searchQuery}" placeholder="接尾辞・単語・意味で検索... (例: -гүй, аш, -ч, 赤)" class="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 transition-all">
          </div>

          <div class="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            <button type="button" class="btn-cat-filter px-3 py-1 rounded-xl text-xs font-black shrink-0 transition-all ${this.state.activeCategory === 'all' ? 'bg-amber-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}" data-cat="all">
              すべて (${etymologyCards.length})
            </button>
            ${etymologyCategories.map(cat => {
              const count = etymologyCards.filter(c => c.categoryId === cat.id).length;
              const isActive = this.state.activeCategory === cat.id;
              return `
                <button type="button" class="btn-cat-filter px-3 py-1 rounded-xl text-xs font-black shrink-0 transition-all ${isActive ? 'bg-amber-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}" data-cat="${cat.id}">
                  ${cat.icon} ${cat.title.split(' ')[1] || cat.title} (${count})
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <!-- カード一覧 -->
        <div class="grid grid-cols-1 gap-4">
          ${filteredCards.length > 0 ? filteredCards.map(card => `
            <div class="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-5 space-y-3.5 hover:border-amber-300 transition-all">
              <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                <div class="flex items-center gap-2">
                  <span class="px-2.5 py-0.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-xs font-black font-mono">
                    ${card.suffix}
                  </span>
                  <h4 class="text-sm sm:text-base font-black text-slate-800">
                    ${card.title}
                  </h4>
                </div>
                <span class="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                  ${card.badge}
                </span>
              </div>

              <!-- レゴブロック組み立てビジュアル -->
              <div class="bg-gradient-to-r from-slate-50 to-amber-50/50 p-3 rounded-xl border border-slate-200/80 flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs font-black">
                <div class="bg-white px-2.5 py-1.5 rounded-lg border border-slate-300 shadow-2xs text-slate-700 flex items-center gap-1">
                  <span class="text-slate-400 font-normal">語根:</span>
                  <span class="text-amber-700 font-bold font-mono">${card.rootWord}</span>
                  <span class="text-[10px] text-slate-500 font-normal">(${card.rootMeaning})</span>
                </div>
                <span class="text-slate-400 font-black text-base">＋</span>
                <div class="bg-amber-500 text-white px-2.5 py-1.5 rounded-lg shadow-2xs flex items-center gap-1">
                  <span class="text-amber-200 font-normal">接尾辞:</span>
                  <span class="font-mono font-bold">${card.suffix.split('（')[0]}</span>
                </div>
                <span class="text-slate-400 font-black text-base">＝</span>
                <div class="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-3 py-1.5 rounded-lg shadow-2xs flex items-center gap-1.5">
                  <span class="font-bold font-mono text-sm">${card.derivedWord}</span>
                  <span class="text-[11px] text-emerald-100 font-medium">(${card.derivedMeaning})</span>
                  <button type="button" class="btn-play-sound ml-1 p-0.5 hover:text-amber-200 transition-all text-xs" data-text="${card.derivedWord}" title="音声再生">
                    🔊
                  </button>
                </div>
              </div>

              <!-- 解説文 -->
              <p class="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium whitespace-pre-line">
                ${card.coreExplanation}
              </p>

              <!-- 対比・実例 -->
              <div class="bg-amber-50/60 rounded-xl p-3 border border-amber-200/80 text-xs text-amber-950 space-y-1">
                <div class="font-black text-amber-900 flex items-center gap-1">
                  <span>💡</span> 一生忘れない秘訣（Secret Tip）:
                </div>
                <div class="font-bold leading-relaxed">
                  ${card.secretTip}
                </div>
              </div>

              <!-- 例文リスト -->
              <div class="space-y-1.5 pt-1">
                <div class="text-[11px] font-black text-slate-500 uppercase tracking-wider">実践例文</div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  ${card.examples.map(ex => `
                    <div class="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs space-y-0.5">
                      <div class="flex items-center justify-between font-bold text-slate-800">
                        <span class="cyrillic-text text-amber-800">${ex.mn}</span>
                        <button type="button" class="btn-play-sound text-slate-400 hover:text-amber-600" data-text="${ex.mn}">🔊</button>
                      </div>
                      <div class="text-slate-600 font-medium">${ex.ja}</div>
                      ${ex.note ? `<div class="text-[10px] text-slate-400">※ ${ex.note}</div>` : ''}
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          `).join('') : `
            <div class="text-center py-12 bg-white rounded-2xl border border-slate-200 text-slate-400 space-y-2">
              <span class="text-3xl">🔍</span>
              <p class="text-sm font-bold">該当する語源・接尾辞が見つかりませんでした</p>
              <button type="button" id="btn-reset-filter" class="px-3 py-1 bg-amber-50 text-amber-700 rounded-lg text-xs font-bold border border-amber-200">
                検索をリセット
              </button>
            </div>
          `}
        </div>
      </div>
    `;
  }

  // ==========================================
  // タブ2: クイズ特訓
  // ==========================================
  static renderQuizTab() {
    const qState = this.state.quiz;
    if (qState.isFinished) {
      return this.renderQuizResult();
    }

    const currentQ = qState.currentQ;
    if (!currentQ) {
      return `<div class="text-center py-8">問題がありません</div>`;
    }

    return `
      <div class="max-w-2xl mx-auto space-y-4 animate-fade-in">
        <!-- 進捗バーとスコア -->
        <div class="flex items-center justify-between text-xs font-bold text-slate-600">
          <div class="flex items-center gap-1.5">
            <span class="px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 font-black">第 ${qState.currentIndex + 1} / ${qState.questions.length} 問</span>
            ${qState.streak > 1 ? `<span class="px-2 py-0.5 rounded-md bg-amber-100 text-amber-700 font-black animate-pulse">🔥 ${qState.streak} 連続正解!</span>` : ''}
          </div>
          <div>スコア: <span class="text-rose-600 font-black text-sm">${qState.score}</span> 点</div>
        </div>

        <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
          <div class="bg-gradient-to-r from-amber-500 to-rose-500 h-full transition-all duration-300" style="width: ${((qState.currentIndex + 1) / qState.questions.length) * 100}%"></div>
        </div>

        <!-- 問題カード -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div class="space-y-2">
            <div class="text-xs font-black text-rose-600 uppercase tracking-wider">QUESTION</div>
            <h3 class="text-base sm:text-lg font-black text-slate-800 leading-snug">
              ${currentQ.question}
            </h3>
            ${currentQ.targetWord ? `
              <div class="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 font-mono font-black text-sm">
                <span>🎯 対象語:</span>
                <span class="text-base text-rose-600">${currentQ.targetWord}</span>
                <button type="button" class="btn-play-sound text-slate-400 hover:text-amber-600" data-text="${currentQ.targetWord}">🔊</button>
              </div>
            ` : ''}
          </div>

          <!-- 選択肢 -->
          <div class="grid grid-cols-1 gap-2.5 pt-2">
            ${currentQ.options.map((opt, idx) => {
              let btnClass = "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800";
              if (qState.hasAnswered) {
                if (idx === currentQ.answer) {
                  btnClass = "bg-emerald-50 border-emerald-500 text-emerald-800 font-black ring-2 ring-emerald-400";
                } else if (idx === qState.selectedChoiceIndex) {
                  btnClass = "bg-rose-50 border-rose-500 text-rose-800 line-through";
                } else {
                  btnClass = "bg-slate-50 border-slate-200 text-slate-400 opacity-60";
                }
              }
              return `
                <button type="button" class="btn-quiz-option w-full p-3.5 rounded-xl border-2 text-left text-xs sm:text-sm font-bold transition-all flex items-center justify-between ${btnClass}" data-idx="${idx}" ${qState.hasAnswered ? 'disabled' : ''}>
                  <span>${opt}</span>
                  ${qState.hasAnswered && idx === currentQ.answer ? '<span class="text-emerald-600 font-black text-base">✓ 正解</span>' : ''}
                  ${qState.hasAnswered && idx === qState.selectedChoiceIndex && idx !== currentQ.answer ? '<span class="text-rose-600 font-black text-base">✗ 不正解</span>' : ''}
                </button>
              `;
            }).join('')}
          </div>

          <!-- 解説（回答後に出現） -->
          ${qState.hasAnswered ? `
            <div class="animate-fade-in p-4 rounded-xl ${qState.selectedChoiceIndex === currentQ.answer ? 'bg-emerald-50 border border-emerald-200 text-emerald-950' : 'bg-rose-50 border border-rose-200 text-rose-950'} space-y-2">
              <div class="font-black text-sm flex items-center gap-1.5">
                <span>${qState.selectedChoiceIndex === currentQ.answer ? '🎉 大正解！' : '💡 ここがポイント！'}</span>
              </div>
              <p class="text-xs sm:text-sm leading-relaxed font-medium">
                ${currentQ.explanation}
              </p>
              <div class="pt-2 flex justify-end">
                <button type="button" id="btn-next-question" class="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-xs transition-all active:scale-98">
                  ${qState.currentIndex + 1 < qState.questions.length ? '次の問題へ進む ➔' : '結果を見る 🏆'}
                </button>
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  static renderQuizResult() {
    const qState = this.state.quiz;
    const accuracy = Math.round((qState.score / (qState.questions.length * 10)) * 100);

    return `
      <div class="max-w-md mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-center space-y-4 animate-scale-up">
        <span class="text-5xl">🏆</span>
        <h3 class="text-xl font-black text-slate-800">特訓完了！</h3>
        <p class="text-xs text-slate-500">語源・神接尾辞クイズを全問やり遂げました！</p>

        <div class="bg-gradient-to-tr from-amber-50 to-rose-50 p-4 rounded-2xl border border-amber-200 space-y-1">
          <div class="text-xs font-bold text-slate-600">あなたのスコア</div>
          <div class="text-3xl font-black text-rose-600">${qState.score} / ${qState.questions.length * 10} 点</div>
          <div class="text-xs font-extrabold text-amber-700">正解率: ${accuracy}%</div>
        </div>

        <div class="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200 text-left font-medium">
          💡 <strong>アドバイス</strong><br>
          接尾辞はモンゴル語の「レゴブロック」です！「-гүй（語源副詞）」「-тай（有格）」「-ч（人）」「-лах（動詞化）」などの基本ルールを意識しながら単語を見ると、新しい語彙に出会った時も直感的に意味が推測できるようになります。
        </div>

        <div class="flex items-center gap-2 pt-2">
          <button type="button" id="btn-retry-quiz" class="flex-1 py-3 bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-white font-black text-xs rounded-xl shadow-xs transition-all">
            もう一度挑戦 🔄
          </button>
          <button type="button" id="btn-switch-study" class="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs rounded-xl transition-all">
            図鑑で復習 📖
          </button>
        </div>
      </div>
    `;
  }

  // ==========================================
  // タブ3: 一発早見チートシート
  // ==========================================
  static renderCheatSheetTab() {
    return `
      <div class="space-y-4 animate-fade-in">
        <div class="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 text-xs text-indigo-950 space-y-1">
          <div class="font-black text-sm flex items-center gap-1.5 text-indigo-900">
            <span>📋</span> 神接尾辞・語源 完全マスター一覧表
          </div>
          <p class="leading-relaxed">
            辞書を引かなくても意味が透けて見える！覚えておくと爆発的に楽になる主要接尾辞と語源の総まとめです。
          </p>
        </div>

        <div class="overflow-x-auto bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <table class="w-full text-left border-collapse text-xs">
            <thead>
              <tr class="bg-slate-100 text-slate-700 border-b border-slate-200 font-black">
                <th class="p-3">分類</th>
                <th class="p-3 font-mono">接尾辞</th>
                <th class="p-3">基本機能・語源</th>
                <th class="p-3">代表例（語根 ➔ 派生語）</th>
                <th class="p-3">覚えるコツ（Secret）</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-slate-700 font-medium">
              <tr class="hover:bg-amber-50/50 transition-all">
                <td class="p-3 font-bold text-amber-700">語源の秘密</td>
                <td class="p-3 font-mono font-black text-slate-900">-гүй (古用副詞)</td>
                <td class="p-3">「〜の状態で」という古い様態副詞形成</td>
                <td class="p-3"><strong class="text-amber-800">аш</strong>（恩恵）➔ <strong class="text-emerald-700">ашгүй</strong>（幸いにも！よかった！）</td>
                <td class="p-3 text-[11px] text-slate-500">否定の「〜なし」と混同注意！恵みがあってラッキー</td>
              </tr>
              <tr class="hover:bg-amber-50/50 transition-all">
                <td class="p-3 font-bold text-indigo-700">方向格</td>
                <td class="p-3 font-mono font-black text-slate-900">-ш / -шаа</td>
                <td class="p-3">古い方向格接辞（〜の方へ向かうベクトル）</td>
                <td class="p-3"><strong>цаана</strong>（あちら）➔ <strong>цааш</strong>（あちらへ）<br><strong>наана</strong>（こちら）➔ <strong>нааш</strong>（こちらへ）</td>
                <td class="p-3 text-[11px] text-slate-500">矢印（➡️）を表す古用接辞</td>
              </tr>
              <tr class="hover:bg-amber-50/50 transition-all">
                <td class="p-3 font-bold text-emerald-700">有格（所有）</td>
                <td class="p-3 font-mono font-black text-slate-900">-тай / -тэй / -той</td>
                <td class="p-3">「〜を持つ、〜味の、〜のある」形容詞化</td>
                <td class="p-3"><strong>давс</strong>（塩）➔ <strong>давстай</strong>（しょっぱい）<br><strong>амт</strong>（味）➔ <strong>амттай</strong>（美味しい）</td>
                <td class="p-3 text-[11px] text-slate-500">-гүй と対義語ペアで語彙2倍増！</td>
              </tr>
              <tr class="hover:bg-amber-50/50 transition-all">
                <td class="p-3 font-bold text-rose-700">否定（無格）</td>
                <td class="p-3 font-mono font-black text-slate-900">-гүй (標準否定)</td>
                <td class="p-3">「〜のない、〜抜きの」否定形容詞化</td>
                <td class="p-3"><strong>давс</strong>（塩）➔ <strong>давсгүй</strong>（味気ない・塩気なし）<br><strong>зав</strong>（暇）➔ <strong>завгүй</strong>（忙しい）</td>
                <td class="p-3 text-[11px] text-slate-500">英語の -less（careless等）と同じ</td>
              </tr>
              <tr class="hover:bg-amber-50/50 transition-all">
                <td class="p-3 font-bold text-blue-700">人・職業</td>
                <td class="p-3 font-mono font-black text-slate-900">-ч / -чин</td>
                <td class="p-3">名詞を扱う「職能者・専門家・人」</td>
                <td class="p-3"><strong>зураг</strong>（絵）➔ <strong>зураач</strong>（画家）<br><strong>дуу</strong>（歌）➔ <strong>дуучин</strong>（歌手）</td>
                <td class="p-3 text-[11px] text-slate-500">英語の -er / -ist に完全一致</td>
              </tr>
              <tr class="hover:bg-amber-50/50 transition-all">
                <td class="p-3 font-bold text-blue-700">行為者</td>
                <td class="p-3 font-mono font-black text-slate-900">-гч / -агч</td>
                <td class="p-3">動詞の動作を行う人（または装置）</td>
                <td class="p-3"><strong>унших</strong>（読む）➔ <strong>уншигч</strong>（読者）<br><strong>хөргөх</strong>（冷やす）➔ <strong>хөргөгч</strong>（冷蔵庫）</td>
                <td class="p-3 text-[11px] text-slate-500">人だけでなく道具・家電にも多用！</td>
              </tr>
              <tr class="hover:bg-amber-50/50 transition-all">
                <td class="p-3 font-bold text-teal-700">万能動詞化</td>
                <td class="p-3 font-mono font-black text-slate-900">-лах / -лэх / -лох / -лөх</td>
                <td class="p-3">名詞を「行う・使う・機能させる」動詞化</td>
                <td class="p-3"><strong>ашиг</strong>（利益）➔ <strong>ашиглах</strong>（利用する）<br><strong>цэвэр</strong>（清潔）➔ <strong>цэвэрлэх</strong>（掃除する）</td>
                <td class="p-3 text-[11px] text-slate-500">新語や外来語もこれで全て動詞化！</td>
              </tr>
              <tr class="hover:bg-amber-50/50 transition-all">
                <td class="p-3 font-bold text-purple-700">名詞化</td>
                <td class="p-3 font-mono font-black text-slate-900">-лт / -лга / -ц</td>
                <td class="p-3">動詞のアクションから結果・制度を抽出</td>
                <td class="p-3"><strong>амрах</strong>（休む）➔ <strong>амралт</strong>（休暇）<br><strong>уулзах</strong>（会う）➔ <strong>уулзалт</strong>（面談・会合）</td>
                <td class="p-3 text-[11px] text-slate-500">英語の -tion / -ment に相当</td>
              </tr>
              <tr class="hover:bg-amber-50/50 transition-all">
                <td class="p-3 font-bold text-pink-700">指小辞</td>
                <td class="p-3 font-mono font-black text-slate-900">-хан / -хэн / -хон</td>
                <td class="p-3">親愛・控えめ・ほんのり・可愛らしさ</td>
                <td class="p-3"><strong>ойр</strong>（近い）➔ <strong>ойрхон</strong>（すぐ間近に）<br><strong>хөөр</strong>（高揚）➔ <strong>хөөрхөн</strong>（可愛い）</td>
                <td class="p-3 text-[11px] text-slate-500">言葉に笑顔とマイルドさを添える</td>
              </tr>
              <tr class="hover:bg-amber-50/50 transition-all">
                <td class="p-3 font-bold text-orange-700">動詞拡張</td>
                <td class="p-3 font-mono font-black text-slate-900">-гдах / -уулах / -лцах</td>
                <td class="p-3">受動・自発 / 使役 / 相互協力</td>
                <td class="p-3"><strong>харах</strong>（見る）➔ <strong>харагдах</strong>（見える）<br><strong>ярих</strong>（話す）➔ <strong>ярилцах</strong>（話し合う）</td>
                <td class="p-3 text-[11px] text-slate-500">動詞の語幹と語尾の間に挟むだけ！</td>
              </tr>
              <tr class="hover:bg-amber-50/50 transition-all">
                <td class="p-3 font-bold text-red-700">重複強調</td>
                <td class="p-3 font-mono font-black text-slate-900">頭音節 ＋ [в / б]</td>
                <td class="p-3">「真っ赤」「真っ青」「真新しい」の超強調</td>
                <td class="p-3"><strong>улаан</strong>（赤）➔ <strong>ув улаан</strong>（真っ赤な）<br><strong>шинэ</strong>（新しい）➔ <strong>шив шинэ</strong>（真新しい）</td>
                <td class="p-3 text-[11px] text-slate-500">日本語の「真っ〜」と同じ語感！</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // ==========================================
  // イベント登録
  // ==========================================
  static attachEvents() {
    if (!this.container) return;

    // ホーム戻る
    const btnHome = this.container.querySelector('#btn-back-home');
    if (btnHome) {
      btnHome.addEventListener('click', () => {
        if (this.onNavigate) this.onNavigate('home');
      });
    }

    // タブ切り替え
    const tabBtns = this.container.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        this.state.activeTab = tab;
        this.renderMain();
      });
    });

    // 音声再生
    const soundBtns = this.container.querySelectorAll('.btn-play-sound');
    soundBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const text = btn.dataset.text;
        if (text) {
          SpeechService.speak(text);
        }
      });
    });

    // 検索入力
    const searchInput = this.container.querySelector('#etym-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.state.searchQuery = e.target.value;
        const contentDiv = this.container.querySelector('#etymology-tab-content');
        if (contentDiv) {
          contentDiv.innerHTML = this.renderTabContent();
          this.attachEvents();
        }
      });
    }

    // カテゴリフィルター
    const catBtns = this.container.querySelectorAll('.btn-cat-filter');
    catBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.state.activeCategory = btn.dataset.cat;
        const contentDiv = this.container.querySelector('#etymology-tab-content');
        if (contentDiv) {
          contentDiv.innerHTML = this.renderTabContent();
          this.attachEvents();
        }
      });
    });

    // リセットボタン
    const btnReset = this.container.querySelector('#btn-reset-filter');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        this.state.searchQuery = '';
        this.state.activeCategory = 'all';
        this.renderMain();
      });
    }

    // クイズ選択肢クリック
    const quizOptions = this.container.querySelectorAll('.btn-quiz-option');
    quizOptions.forEach(btn => {
      btn.addEventListener('click', () => {
        if (this.state.quiz.hasAnswered) return;
        const chosenIdx = parseInt(btn.dataset.idx, 10);
        this.handleQuizAnswer(chosenIdx);
      });
    });

    // クイズ次へ進む
    const btnNext = this.container.querySelector('#btn-next-question');
    if (btnNext) {
      btnNext.addEventListener('click', () => {
        this.handleNextQuestion();
      });
    }

    // クイズリトライ
    const btnRetry = this.container.querySelector('#btn-retry-quiz');
    if (btnRetry) {
      btnRetry.addEventListener('click', () => {
        this.initQuiz();
        this.renderMain();
      });
    }

    // 図鑑へ戻る
    const btnSwitchStudy = this.container.querySelector('#btn-switch-study');
    if (btnSwitchStudy) {
      btnSwitchStudy.addEventListener('click', () => {
        this.state.activeTab = 'study';
        this.renderMain();
      });
    }
  }

  static handleQuizAnswer(choiceIdx) {
    const qState = this.state.quiz;
    const currentQ = qState.currentQ;
    if (!currentQ || qState.hasAnswered) return;

    qState.hasAnswered = true;
    qState.selectedChoiceIndex = choiceIdx;

    const isCorrect = (choiceIdx === currentQ.answer);
    if (isCorrect) {
      SoundEffects.playCorrect();
      qState.score += 10;
      qState.streak += 1;
      try {
        if (typeof GamificationService !== 'undefined' && typeof GamificationService.addXp === 'function') {
          GamificationService.addXp(15);
        }
      } catch (_) {}
    } else {
      SoundEffects.playWrong();
      qState.streak = 0;
    }

    const contentDiv = this.container.querySelector('#etymology-tab-content');
    if (contentDiv) {
      contentDiv.innerHTML = this.renderTabContent();
      this.attachEvents();
    }
  }

  static handleNextQuestion() {
    const qState = this.state.quiz;
    if (qState.currentIndex + 1 < qState.questions.length) {
      qState.currentIndex++;
      qState.currentQ = qState.questions[qState.currentIndex];
      qState.selectedChoiceIndex = null;
      qState.hasAnswered = false;
    } else {
      qState.isFinished = true;
    }

    const contentDiv = this.container.querySelector('#etymology-tab-content');
    if (contentDiv) {
      contentDiv.innerHTML = this.renderTabContent();
      this.attachEvents();
    }
  }
}
