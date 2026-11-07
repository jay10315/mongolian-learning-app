// フラッシュカードコンポーネント（3D反転アニメーション ＆ SRS 4段階評価）
import { StorageService } from '../services/storage.js';
import { SpeechService } from '../services/speech.js';
import { shuffleArray, isVerb, getWordGrammarDetails, isPronunciationCautionWord } from '../utils/helpers.js';

export class FlashcardsComponent {
  static state = {
    category: 'all',
    cards: [],
    currentIndex: 0,
    isFlipped: false,
    stats: {
      again: 0,
      hard: 0,
      good: 0,
      easy: 0
    }
  };

  static render(container, onNavigate) {
    this.container = container;
    this.onNavigate = onNavigate;
    this.initCards();
    this.renderCardView();
  }

  static initCards() {
    let list = StorageService.getVocabulary();
    if (this.state.category !== 'all') {
      list = list.filter(v => v.category === this.state.category);
    }
    this.state.cards = shuffleArray(list);
    this.state.currentIndex = 0;
    this.state.isFlipped = false;
    this.state.stats = { again: 0, hard: 0, good: 0, easy: 0 };
  }

  static renderCardView() {
    const vocabList = StorageService.getVocabulary();
    const categories = Array.from(new Set(vocabList.map(v => v.category || 'その他'))).filter(Boolean);
    const card = this.state.cards[this.state.currentIndex];
    const total = this.state.cards.length;
    const currentNum = this.state.currentIndex + 1;

    if (!card || total === 0) {
      this.container.innerHTML = `
        <div class="animate-fade-in max-w-xl mx-auto px-4 py-8 text-center space-y-4">
          <div class="text-4xl">🃏</div>
          <h2 class="text-lg font-bold text-slate-800">カードが見つかりません</h2>
          <p class="text-xs text-slate-500">カテゴリーを変更するか、単語を登録してください。</p>
          <button type="button" id="btn-back-home" class="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold">
            ホームへ戻る
          </button>
        </div>
      `;
      this.container.querySelector('#btn-back-home').addEventListener('click', () => {
        if (this.onNavigate) this.onNavigate('home');
      });
      return;
    }

    this.container.innerHTML = `
      <div class="animate-fade-in max-w-xl mx-auto px-4 py-3 space-y-4">
        
        <!-- コントロールバー -->
        <div class="flex items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
          <div class="flex items-center gap-1.5">
            <span class="text-xl">🃏</span>
            <select id="select-flash-category" class="text-xs p-1.5 bg-slate-100 border border-slate-200 rounded-lg font-bold text-slate-700">
              <option value="all">全単語 (${vocabList.length}語)</option>
              ${categories.map(c => `<option value="${c}" ${this.state.category === c ? 'selected' : ''}>${c}</option>`).join('')}
            </select>
          </div>

          <div class="flex items-center gap-2">
            <span class="text-xs font-bold text-slate-500">${currentNum} / ${total}</span>
            <button type="button" id="btn-shuffle-cards" class="text-xs px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium" title="シャッフル">
              🔀
            </button>
            <button type="button" id="btn-flash-home" class="text-xs text-slate-400 hover:text-slate-700">
              ✕
            </button>
          </div>
        </div>

        <!-- 3Dフリップカード本体 -->
        <div class="flip-card w-full h-[320px] sm:h-[340px] cursor-pointer ${this.state.isFlipped ? 'flipped' : ''}" id="flashcard-element">
          <div class="flip-card-inner shadow-lg rounded-2xl">
            
            <!-- カードの表（日本語） -->
            <div class="flip-card-front bg-white border-2 border-slate-200 p-6 flex flex-col justify-between select-none">
              <div class="flex justify-between items-start">
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  ${card.pos || '単語'}
                </span>
                <span class="text-xs text-amber-500 font-bold">${card.priority || '★★★'}</span>
              </div>

              <div class="text-center my-auto">
                <div class="mb-3 flex justify-center">
                  ${(typeof getWordIllustrationHTML === 'function') ? getWordIllustrationHTML(card, { size: 'xl' }) : ''}
                </div>
                <div class="text-xs text-slate-400 dark:text-slate-400 mb-1">日本語</div>
                <div class="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
                  ${card.japanese}
                </div>
                ${card.category ? `
                  <div class="text-[11px] text-slate-400 dark:text-slate-400 mt-2">${card.category}</div>
                ` : ''}
              </div>

              <div class="text-center text-xs text-slate-400 font-medium">
                👆 タップしてモンゴル語を確認
              </div>
            </div>

            <!-- カードの裏（モンゴル語・発音・語幹・例文） -->
            <div class="flip-card-back bg-gradient-to-b from-emerald-50/90 to-teal-50 border-2 border-emerald-400 p-6 flex flex-col justify-between text-left select-none overflow-y-auto">
              <div class="flex justify-between items-start border-b border-emerald-200/60 pb-2">
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900">
                  ${card.pos || '単語'}
                </span>
                <button type="button" id="btn-flash-speak" class="text-xs px-2.5 py-1 bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-full font-semibold shadow-2xs inline-flex items-center gap-1">
                  🔊 発音
                </button>
              </div>

              ${(() => {
                const details = getWordGrammarDetails(card);
                return `
                  <div class="my-auto py-2 space-y-2">
                    <div class="flex items-center gap-3">
                      ${(typeof getWordIllustrationHTML === 'function') ? getWordIllustrationHTML(card, { size: 'lg' }) : ''}
                      <div class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white cyrillic-text">
                        ${details.dictForm || card.mongolian}
                      </div>
                    </div>

                    ${(typeof isPronunciationCautionWord === 'function' && isPronunciationCautionWord(card) && card.pronunciation) ? `
                      <div class="text-xs text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded-full inline-block border border-amber-200">
                        ⚠️ 読み注意: ${card.pronunciation}
                      </div>
                    ` : ''}

                    ${details.isVerb ? `
                      <div class="bg-white/80 p-2.5 rounded-lg border border-emerald-200 text-xs space-y-1">
                        <div class="flex items-center justify-between">
                          <span class="text-slate-500">📖 辞書形: <b class="text-slate-900 cyrillic-text">${details.dictForm}</b></span>
                          <span class="text-emerald-700">🌱 語幹: <b class="text-emerald-900 cyrillic-text">${details.root}</b></span>
                        </div>
                        <div class="text-[11px] text-slate-600 pt-1 border-t border-slate-100">
                          🔍 ${details.derivation}
                        </div>
                      </div>
                    ` : (card.root ? `
                      <div class="text-xs text-slate-700">
                        語幹: <span class="font-bold text-emerald-900 cyrillic-text">${card.root}</span>
                      </div>
                    ` : '')}

                    ${card.note ? `
                      <div class="text-[11px] text-slate-600 bg-white/70 p-2 rounded-lg border border-emerald-200/80">
                        💡 ${card.note}
                      </div>
                    ` : ''}

                    ${(typeof getWordEtymologyHTML === 'function') ? getWordEtymologyHTML(card, card.mongolian) : ''}
                    ${(typeof getWordMnemonicHTML === 'function') ? getWordMnemonicHTML(card, card.mongolian) : ''}
                    ${(typeof getSimilarWordDistinctionHTML === 'function') ? getSimilarWordDistinctionHTML(card, card.mongolian) : ''}

                    ${card.exampleMn ? `
                      <div class="text-xs pt-1.5 border-t border-emerald-200/60">
                        <div class="font-bold cyrillic-text text-slate-800">${card.exampleMn}</div>
                        <div class="text-slate-600 text-[11px]">${card.exampleJa}</div>
                      </div>
                    ` : ''}
                  </div>
                `;
              })()}

              <div class="text-center text-[11px] text-slate-400 pt-1 border-t border-emerald-200/60">
                下のボタンで習熟度を記録
              </div>
            </div>

          </div>
        </div>

        <!-- SRS 評価ボタン（4段階） -->
        <div class="bg-white rounded-2xl p-3 border border-slate-200 shadow-xs space-y-2">
          <div class="text-[11px] text-center font-bold text-slate-400">習熟度を選んで次のカードへ</div>
          <div class="grid grid-cols-4 gap-1.5">
            <button type="button" class="btn-srs py-2.5 px-1 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 font-bold text-xs flex flex-col items-center active:scale-95 transition-all" data-rating="again">
              <span class="text-sm">🔄</span>
              <span>もう一度</span>
            </button>

            <button type="button" class="btn-srs py-2.5 px-1 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 font-bold text-xs flex flex-col items-center active:scale-95 transition-all" data-rating="hard">
              <span class="text-sm">🤔</span>
              <span>難しい</span>
            </button>

            <button type="button" class="btn-srs py-2.5 px-1 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-800 font-bold text-xs flex flex-col items-center active:scale-95 transition-all" data-rating="good">
              <span class="text-sm">👍</span>
              <span>覚えた</span>
            </button>

            <button type="button" class="btn-srs py-2.5 px-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold text-xs flex flex-col items-center active:scale-95 transition-all" data-rating="easy">
              <span class="text-sm">⚡</span>
              <span>簡単</span>
            </button>
          </div>
        </div>

      </div>
    `;

    this.bindEvents();
  }

  static bindEvents() {
    const cardEl = this.container.querySelector('#flashcard-element');
    if (cardEl) {
      cardEl.addEventListener('click', (e) => {
        // 音声ボタンクリック時はカード反転させない
        if (e.target.closest('#btn-flash-speak')) return;
        this.state.isFlipped = !this.state.isFlipped;
        cardEl.classList.toggle('flipped', this.state.isFlipped);
      });
    }

    const speakBtn = this.container.querySelector('#btn-flash-speak');
    if (speakBtn) {
      speakBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        speakBtn.classList.add('animate-pulse');
        const card = this.state.cards[this.state.currentIndex];
        const res = SpeechService.speakMongolian(card.mongolian);
        if (res && typeof res.then === 'function') {
          res.then(() => speakBtn.classList.remove('animate-pulse'))
             .catch(() => speakBtn.classList.remove('animate-pulse'));
        } else {
          setTimeout(() => speakBtn.classList.remove('animate-pulse'), 1200);
        }
      });
    }

    // カテゴリー選択
    const catSelect = this.container.querySelector('#select-flash-category');
    if (catSelect) {
      catSelect.addEventListener('change', (e) => {
        this.state.category = e.target.value;
        this.initCards();
        this.renderCardView();
      });
    }

    // シャッフル
    const shuffleBtn = this.container.querySelector('#btn-shuffle-cards');
    if (shuffleBtn) {
      shuffleBtn.addEventListener('click', () => {
        this.state.cards = shuffleArray(this.state.cards);
        this.state.currentIndex = 0;
        this.state.isFlipped = false;
        this.renderCardView();
      });
    }

    // ホーム
    const homeBtn = this.container.querySelector('#btn-flash-home');
    if (homeBtn) {
      homeBtn.addEventListener('click', () => {
        if (this.onNavigate) this.onNavigate('home');
      });
    }

    // SRS評価ボタン
    this.container.querySelectorAll('.btn-srs').forEach(btn => {
      btn.addEventListener('click', () => {
        const rating = btn.getAttribute('data-rating');
        this.rateCard(rating);
      });
    });
  }

  static rateCard(rating) {
    const card = this.state.cards[this.state.currentIndex];
    const isCorrect = (rating === 'good' || rating === 'easy');
    StorageService.recordWordAnswer(card.id, isCorrect, rating);

    if (rating === 'again') {
      this.state.stats.again++;
      // 間違いノートへ（問題文に答えを含めない）
      StorageService.recordMistake({
        question: `【カード】${card.japanese}`,
        userAnswer: '(もう一度)',
        correctAnswer: card.mongolian,
        type: 'flashcard',
        category: card.category || '単語',
        explanation: `${card.japanese} = ${card.mongolian}。${card.note || ''}`
      });
    } else if (rating === 'hard') {
      this.state.stats.hard++;
    } else if (rating === 'good') {
      this.state.stats.good++;
    } else if (rating === 'easy') {
      this.state.stats.easy++;
    }

    // 次のカードへ
    if (this.state.currentIndex + 1 < this.state.cards.length) {
      this.state.currentIndex++;
      this.state.isFlipped = false;
      this.renderCardView();
    } else {
      // 終了
      StorageService.recordHistory({
        type: 'flashcard',
        total: this.state.cards.length,
        correct: this.state.stats.good + this.state.stats.easy,
        category: this.state.category
      });
      alert(`フラッシュカードが1周しました！\n覚えた・簡単: ${this.state.stats.good + this.state.stats.easy} 枚\nもう一度・難しい: ${this.state.stats.again + this.state.stats.hard} 枚`);
      this.state.currentIndex = 0;
      this.state.isFlipped = false;
      this.renderCardView();
    }
  }
}
