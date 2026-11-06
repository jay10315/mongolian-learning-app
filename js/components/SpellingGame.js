// スペルゲームコンポーネント（満月と星空の文字並び替え ＆ 自力入力 ＆ ペンギンご飯フィーディング）
import { StorageService } from '../services/storage.js';
import { SpeechService } from '../services/speech.js';
import { SoundEffects, shuffleArray, SPECIAL_CYRILLIC_BAR, isCyrillic } from '../utils/helpers.js';
import { PenguinMascot } from './PenguinMascot.js';
import { GamificationService } from '../services/gamification.js';

export class SpellingGameComponent {
  static container = null;
  static onNavigate = null;

  static state = {
    view: 'playing', // 'playing' | 'result'
    mode: 'tile_arrange', // 'tile_arrange' (タイル並び替え) | 'free_type' (完全自力入力)
    category: 'all', // 'all' | 'basic' | 'nature' | 'food' | 'verbs'
    
    questions: [],
    currentIndex: 0,
    currentWord: null,
    targetLetters: [],
    
    // 並び替えモード用
    candidateTiles: [], // { id, char, isUsed }
    placedLetters: [],  // { tileId, char }
    
    // 自力入力モード用
    typedLetters: [],
    
    // スコア・フィーディング
    score: 0,
    combo: 0,
    maxCombo: 0,
    fishFedCount: 0,
    fullness: 0, // 0 - 5 (5で100%フィーバー)
    todayTotalFed: 0,
    
    // ペンギンの状態
    mascotMood: 'idle',
    mascotMessage: 'お腹すいたな〜！正解して美味しいお魚ちょうだい！🐧',
    
    // 状態フラグ
    hasAnswered: false,
    isMistake: false,
    isFeeding: false,
    hintsUsed: 0,
    
    // 履歴
    answeredLog: []
  };

  static render(container, onNavigate) {
    this.container = container;
    this.onNavigate = onNavigate;
    this.initGame();
  }

  // ==========================================
  // ゲームの初期化 ＆ 単語プール選出
  // ==========================================
  static initGame(preserveSettings = false) {
    if (!preserveSettings) {
      this.state.score = 0;
      this.state.combo = 0;
      this.state.maxCombo = 0;
      this.state.fishFedCount = 0;
      this.state.fullness = 0;
      this.state.answeredLog = [];
    }
    
    this.loadTodayFedCount();
    this.prepareQuestions();
    this.state.currentIndex = 0;
    this.state.view = 'playing';
    this.loadCurrentWord();
    this.renderUI();
  }

  static loadTodayFedCount() {
    try {
      const today = new Date().toISOString().slice(0, 10);
      const saved = localStorage.getItem('mongol_spelling_fed_' + today);
      this.state.todayTotalFed = saved ? parseInt(saved, 10) : 0;
    } catch (_) {
      this.state.todayTotalFed = 0;
    }
  }

  static saveTodayFedCount() {
    try {
      const today = new Date().toISOString().slice(0, 10);
      localStorage.setItem('mongol_spelling_fed_' + today, String(this.state.todayTotalFed));
    } catch (_) {}
  }

  static prepareQuestions() {
    const rawVocab = StorageService.getVocabulary();
    // 1単語で記号やスペースを含まない、長さ2〜8文字の純粋なキリル文字単語を抽出
    let pool = rawVocab.filter(w => {
      if (!w.mongolian || !w.japanese) return false;
      const clean = w.mongolian.trim().toLowerCase().replace(/[.,?!/\\~]/g, '');
      if (clean.includes(' ') || clean.includes('-') || clean.includes('(')) return false;
      return clean.length >= 2 && clean.length <= 8 && /^[а-яёөү]+$/i.test(clean);
    });

    // カテゴリ別フィルタ
    if (this.state.category === 'basic') {
      pool = pool.filter(w => w.mongolian.trim().length <= 4);
    } else if (this.state.category === 'nature') {
      const terms = ['морь', 'хонь', 'тэмээ', 'үхэр', 'ямаа', 'нохой', 'чоно', 'уул', 'гол', 'ус', 'тэнгэр', 'сар', 'нар', 'мод', 'цэцэг'];
      pool = pool.filter(w => terms.some(t => w.mongolian.toLowerCase().includes(t)) || (w.category && w.category.includes('自然')));
    } else if (this.state.category === 'food') {
      const terms = ['цай', 'мах', 'талх', 'сүү', 'ус', 'шөл', 'бууз', 'хуушуур', 'алим', 'жимс'];
      pool = pool.filter(w => terms.some(t => w.mongolian.toLowerCase().includes(t)) || (w.category && w.category.includes('食')));
    } else if (this.state.category === 'verbs') {
      pool = pool.filter(w => w.isVerb || w.pos === '動詞' || w.mongolian.endsWith('х'));
    }

    if (pool.length < 5) {
      pool = rawVocab.filter(w => {
        if (!w.mongolian || !w.japanese) return false;
        const clean = w.mongolian.trim().toLowerCase().replace(/[.,?!/\\~]/g, '');
        return clean.length >= 2 && clean.length <= 8 && !clean.includes(' ') && /^[а-яёөү]+$/i.test(clean);
      });
    }

    this.state.questions = shuffleArray([...pool]).slice(0, 10); // 1ラウンド10問
  }

  static loadCurrentWord() {
    if (this.state.currentIndex >= this.state.questions.length) {
      this.showResult();
      return;
    }

    const word = this.state.questions[this.state.currentIndex];
    this.state.currentWord = word;
    const cleanMn = word.mongolian.trim().toLowerCase().replace(/[.,?!/\\~]/g, '');
    this.state.targetLetters = cleanMn.split('');
    this.state.hasAnswered = false;
    this.state.isMistake = false;
    this.state.isFeeding = false;
    this.state.hintsUsed = 0;

    // 並び替え用タイルの生成（正解の文字 ＋ 2〜3個のダミー文字）
    const dummyPool = ['а', 'э', 'и', 'о', 'у', 'ө', 'ү', 'н', 'м', 'р', 'с', 'т', 'л', 'б', 'д', 'г'];
    const dummiesNeeded = Math.min(3, Math.max(2, 8 - this.state.targetLetters.length));
    const availableDummies = dummyPool.filter(c => !this.state.targetLetters.includes(c));
    const chosenDummies = shuffleArray(availableDummies).slice(0, dummiesNeeded);

    const allChars = [...this.state.targetLetters, ...chosenDummies];
    const shuffled = shuffleArray(allChars);

    this.state.candidateTiles = shuffled.map((char, idx) => ({
      id: `tile_${idx}_${char}`,
      char: char,
      isUsed: false
    }));

    this.state.placedLetters = [];
    this.state.typedLetters = [];
    this.state.mascotMood = 'idle';
    this.state.mascotMessage = 'お腹すいたな〜！正解して美味しいお魚ちょうだい！🐧';
  }

  // ==========================================
  // メイン画面の描画
  // ==========================================
  static renderUI() {
    if (!this.container) return;
    if (this.state.view === 'result') {
      this.renderResultUI();
      return;
    }

    const { currentWord, targetLetters, placedLetters, typedLetters, candidateTiles, mode, score, combo, fullness, fishFedCount, todayTotalFed, mascotMood, mascotMessage } = this.state;
    const isArrange = mode === 'tile_arrange';
    const currentLetters = isArrange ? placedLetters.map(p => p.char) : typedLetters;

    this.container.innerHTML = `
      <div class="animate-fade-in max-w-4xl mx-auto px-4 py-4 space-y-4">
        
        <!-- ナビゲーション・ヘッダーバー -->
        <div class="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
          <div class="flex items-center gap-2">
            <button type="button" id="btn-spelling-back" class="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors" title="ホームへ戻る">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
            </button>
            <h2 class="text-base sm:text-lg font-black text-slate-800 flex items-center gap-1.5">
              <span>🌕</span>
              <span>モンゴル語スペルゲーム</span>
            </h2>
          </div>

          <!-- モード切り替えピル -->
          <div class="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button type="button" id="btn-mode-arrange" class="px-3 py-1.5 rounded-lg transition-all ${
              isArrange ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }">
              🔤 候補タイルあり（タップ / キーボード入力）
            </button>
            <button type="button" id="btn-mode-free" class="px-3 py-1.5 rounded-lg transition-all ${
              !isArrange ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }">
              ⌨️ 候補なし自力入力
            </button>
          </div>

          <!-- スコア・ご飯ステータス -->
          <div class="flex items-center gap-2 text-xs">
            <div class="flex items-center gap-1 bg-amber-50 text-amber-900 border border-amber-300 px-2.5 py-1 rounded-full font-black">
              <span>⚡</span>
              <span>${score} pt</span>
              ${combo >= 2 ? `<span class="bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded-full text-[10px] font-bold">${combo}コンボ</span>` : ''}
            </div>
            <div class="flex items-center gap-1 bg-sky-50 text-sky-900 border border-sky-300 px-2.5 py-1 rounded-full font-black" title="本日あげたご飯の数">
              <span>🐟</span>
              <span>× ${fishFedCount}匹</span>
              <span class="text-[10px] text-sky-600 hidden sm:inline">(本日計 ${todayTotalFed})</span>
            </div>
          </div>
        </div>

        <!-- 満月と星空のゲームステージ（添付画像オマージュ） -->
        <div class="relative bg-gradient-to-b from-[#060c18] via-[#0b172a] to-[#041118] rounded-3xl p-5 sm:p-8 border-2 border-amber-400/40 shadow-2xl overflow-hidden min-h-[500px] text-white flex flex-col justify-between">
          
          <!-- 背景：満月（穏やかな黄金の満月） -->
          <div class="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-tr from-amber-300 via-yellow-200 to-amber-400 shadow-[0_0_35px_rgba(251,191,36,0.35)] flex items-center justify-center pointer-events-none opacity-95 border border-yellow-100/80">
            <div class="w-full h-full rounded-full opacity-40 bg-[radial-gradient(circle_at_35%_35%,rgba(217,119,6,0.5),transparent_65%)]"></div>
          </div>

          <!-- 星空パーティクル（CSSドット） -->
          <div class="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#fde047_1px,transparent_1px)] [background-size:24px_24px]"></div>

          <!-- ステージ上部：問題プロンプト -->
          <div class="relative z-10 text-center mt-20 sm:mt-24 mb-4">
            
            <div class="flex items-center justify-center gap-2 mb-2">
              <span class="text-[11px] font-bold text-amber-300 bg-amber-500/20 border border-amber-400/30 px-3 py-0.5 rounded-full shadow-2xs">
                第 ${this.state.currentIndex + 1} / ${this.state.questions.length} 問
              </span>
              <span class="text-[11px] font-bold text-teal-300 bg-teal-500/20 border border-teal-400/30 px-2.5 py-0.5 rounded-full">
                ${currentWord.pos || '単語'}
              </span>
            </div>

            <!-- 日本語の意味（黄金フォント） -->
            <h3 class="text-3xl sm:text-4xl md:text-5xl font-black text-amber-200 tracking-wide drop-shadow-[0_2px_12px_rgba(251,191,36,0.6)]">
              ${currentWord.japanese}
            </h3>

            <!-- ネイティブ発音を聴くボタン -->
            <div class="mt-2.5">
              <button type="button" id="btn-spelling-audio" class="text-xs bg-white/15 hover:bg-white/25 active:scale-95 text-white/95 px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 transition-all border border-white/20 shadow-xs cursor-pointer">
                <span>🔊</span>
                <span>ネイティブ発音を聴く</span>
              </button>
            </div>

            <!-- スロット（文字の入る枠） -->
            <div class="flex items-center justify-center gap-2 sm:gap-3 mt-6 sm:mt-8 flex-wrap">
              ${targetLetters.map((_, idx) => {
                const char = currentLetters[idx] || '';
                const isCurrent = !char && idx === currentLetters.length;
                return `
                  <div class="spelling-slot w-11 h-13 sm:w-13 sm:h-15 rounded-xl flex items-center justify-center text-2xl sm:text-3xl font-black transition-all cursor-pointer ${
                    char 
                      ? 'bg-gradient-to-b from-amber-400 to-amber-500 text-slate-950 border-2 border-yellow-200 shadow-[0_4px_12px_rgba(245,158,11,0.5)] transform scale-105' 
                      : isCurrent 
                        ? 'bg-white/10 border-2 border-amber-300/80 shadow-xs' 
                        : 'bg-white/5 border-2 border-dashed border-white/25 text-transparent'
                  }" data-slot-index="${idx}">
                    ${char || '<span class="text-white/20 text-lg">_</span>'}
                  </div>
                `;
              }).join('')}
            </div>

            ${this.state.isMistake ? `
              <div class="mt-3 text-xs font-bold text-rose-300 bg-rose-950/70 border border-rose-500/50 px-3 py-1 rounded-full inline-block">
                ⚠️ スペルが合っていません。文字をタップまたは⌫で直そう！
              </div>
            ` : ''}
          </div>

          <!-- ステージ下部：入力エリア（並び替えタイル または キーボード） -->
          <div class="relative z-10 space-y-4">
            
            ${isArrange ? `
              <!-- 候補文字タイル（星空に散らばるタイル） -->
              <div class="bg-black/30 backdrop-blur-md p-4 rounded-2xl border border-white/15">
                <div class="text-[11px] text-amber-200/90 font-bold mb-2 flex items-center justify-between">
                  <span>✨ 文字タイルをタップして並べよう:</span>
                  <span class="text-slate-400">${candidateTiles.filter(t => !t.isUsed).length} 文字残り</span>
                </div>

                <div class="flex flex-wrap items-center justify-center gap-2 sm:gap-3 min-h-[56px]" id="candidate-tiles-container">
                  ${candidateTiles.map(tile => `
                    <button type="button" class="spelling-tile w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-2xl font-black transition-all active:scale-90 shadow-md ${
                      tile.isUsed 
                        ? 'opacity-20 pointer-events-none bg-slate-800 text-slate-500 border border-slate-700' 
                        : 'bg-gradient-to-tr from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 border-2 border-yellow-200 hover:shadow-[0_0_15px_rgba(251,191,36,0.6)] hover:-translate-y-0.5 cursor-pointer'
                    }" data-tile-id="${tile.id}" data-char="${tile.char}">
                      ${tile.char}
                    </button>
                  `).join('')}
                </div>

                <!-- アクションボタン（戻す・クリア・シャッフル・ヒント） -->
                <div class="flex items-center justify-center gap-2 sm:gap-3 mt-4 flex-wrap">
                  <button type="button" id="btn-spelling-backspace" class="text-xs px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white/90 font-bold transition-all border border-white/15 cursor-pointer">
                    ⌫ 1文字戻す
                  </button>
                  <button type="button" id="btn-spelling-clear" class="text-xs px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white/90 font-bold transition-all border border-white/15 cursor-pointer">
                    🔄 リセット
                  </button>
                  <button type="button" id="btn-spelling-shuffle" class="text-xs px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white/90 font-bold transition-all border border-white/15 cursor-pointer">
                    🔀 シャッフル
                  </button>
                  <button type="button" id="btn-spelling-hint" class="text-xs px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 active:scale-95 text-amber-200 font-bold transition-all border border-amber-400/30 cursor-pointer">
                    💡 ヒント (1文字開く)
                  </button>
                </div>
                <div class="text-[11px] text-amber-200/70 text-center mt-2.5 font-medium">
                  ⌨️ パソコンのキーボードでも打てます（ローマ字／キリル文字両対応・⌫で1文字戻す）
                </div>
              </div>
            ` : `
              <!-- 完全自力入力モード：キリル文字バー ＆ 入力フィールド -->
              <div class="bg-black/30 backdrop-blur-md p-4 rounded-2xl border border-white/15 space-y-3">
                <div class="text-[11px] text-indigo-200/90 font-bold flex items-center justify-between">
                  <span>⌨️ キーボードで打鍵するか、文字をタップ:</span>
                  <button type="button" id="btn-spelling-free-backspace" class="text-xs px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded-lg font-bold border border-white/15">
                    ⌫ 1文字消去
                  </button>
                </div>

                <!-- 特殊キリル文字クイックバー -->
                <div class="flex flex-wrap items-center justify-center gap-1 sm:gap-1.5 bg-black/40 p-2 rounded-xl border border-white/10">
                  <span class="text-[10px] text-amber-300 font-extrabold mr-1">特有文字:</span>
                  ${SPECIAL_CYRILLIC_BAR.map(c => `
                    <button type="button" class="spelling-quick-char w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-white/10 hover:bg-white/25 active:scale-90 text-white font-black text-sm transition-all border border-white/15" data-char="${c}">
                      ${c}
                    </button>
                  `).join('')}
                </div>

                <!-- 入力サポート用バーチャル文字パレット -->
                <div class="flex flex-wrap items-center justify-center gap-1 sm:gap-1.5">
                  ${['а','б','в','г','д','е','ё','ж','з','и','й','к','л','м','н','о','ө','п','р','с','т','у','ү','ф','х','ц','ч','ш','щ','ъ','ы','ь','э','ю','я'].map(c => `
                    <button type="button" class="spelling-quick-char w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/10 hover:bg-amber-400 hover:text-slate-950 active:scale-90 text-white/90 font-bold text-xs transition-all border border-white/10" data-char="${c}">
                      ${c}
                    </button>
                  `).join('')}
                </div>

                <div class="flex justify-center">
                  <button type="button" id="btn-spelling-submit-free" class="px-6 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-sm shadow-md active:scale-95 transition-all flex items-center gap-1.5">
                    <span>決定 ＆ ペンギンにあげる！</span>
                    <span>🐟</span>
                  </button>
                </div>
              </div>
            `}

            <!-- ペンギンのご飯フィーディングバー（満腹度ゲージ） -->
            <div class="bg-gradient-to-r from-sky-950/80 via-slate-900/80 to-emerald-950/80 backdrop-blur-md p-3.5 rounded-2xl border border-sky-400/30 flex items-center justify-between gap-4">
              
              <!-- 満腹度ゲージ -->
              <div class="flex-1 space-y-1.5">
                <div class="flex items-center justify-between text-xs">
                  <span class="text-sky-200 font-extrabold flex items-center gap-1.5">
                    <span>🥣</span>
                    <span>ペンギンの満腹度</span>
                  </span>
                  <span class="text-amber-300 font-black">
                    ${fullness * 20}% (${fullness}/5匹)
                  </span>
                </div>

                <!-- ゲージバー -->
                <div class="w-full bg-black/40 rounded-full h-3 overflow-hidden p-0.5 border border-sky-500/30">
                  <div class="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-sky-400 via-teal-300 to-amber-300 shadow-xs" style="width: ${fullness * 20}%"></div>
                </div>
              </div>

              <!-- ペンギンマスコットのアバター -->
              <div class="shrink-0 flex items-center justify-center p-1 bg-white/10 rounded-2xl border border-white/20 relative" id="spelling-penguin-avatar">
                ${PenguinMascot.getSvg({ mood: mascotMood, size: 54 })}
                
                ${this.state.isFeeding ? `
                  <!-- お魚マーク -->
                  <div class="absolute -top-2 -left-2 text-xl">
                    🐟
                  </div>
                ` : ''}
              </div>

            </div>

          </div>

        </div>

        <!-- カテゴリ選択フッター -->
        <div class="flex items-center justify-between gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200">
          <div class="flex items-center gap-1.5 font-bold text-slate-700">
            <span>🏷️ 出題ジャンル:</span>
            <select id="spelling-category-select" class="bg-white border border-slate-300 rounded-lg px-2 py-1 font-medium text-slate-800">
              <option value="all" ${this.state.category === 'all' ? 'selected' : ''}>すべての単語</option>
              <option value="basic" ${this.state.category === 'basic' ? 'selected' : ''}>基礎・短め (2〜4文字)</option>
              <option value="nature" ${this.state.category === 'nature' ? 'selected' : ''}>動物・自然</option>
              <option value="food" ${this.state.category === 'food' ? 'selected' : ''}>食べ物・日常</option>
              <option value="verbs" ${this.state.category === 'verbs' ? 'selected' : ''}>動詞</option>
            </select>
          </div>
          <button type="button" id="btn-spelling-skip" class="text-slate-500 hover:text-slate-800 px-2 py-1 rounded-lg font-bold hover:bg-slate-200 transition-colors">
            パスして次へ →
          </button>
        </div>

      </div>
    `;

    this.bindEvents();
  }

  // ==========================================
  // イベントバインド
  // ==========================================
  static bindEvents() {
    if (!this.container) return;

    // 戻るボタン
    const backBtn = this.container.querySelector('#btn-spelling-back');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        if (this.onNavigate) this.onNavigate('home');
      });
    }

    // モード切り替え
    const arrangeBtn = this.container.querySelector('#btn-mode-arrange');
    const freeBtn = this.container.querySelector('#btn-mode-free');
    if (arrangeBtn) {
      arrangeBtn.addEventListener('click', () => {
        if (this.state.mode !== 'tile_arrange') {
          this.state.mode = 'tile_arrange';
          SoundEffects.playCorrect();
          this.loadCurrentWord();
          this.renderUI();
        }
      });
    }
    if (freeBtn) {
      freeBtn.addEventListener('click', () => {
        if (this.state.mode !== 'free_type') {
          this.state.mode = 'free_type';
          SoundEffects.playCorrect();
          this.loadCurrentWord();
          this.renderUI();
        }
      });
    }

    // 音声再生ボタン
    const audioBtn = this.container.querySelector('#btn-spelling-audio');
    if (audioBtn && this.state.currentWord) {
      audioBtn.addEventListener('click', () => {
        SpeechService.speak(this.state.currentWord.mongolian, { rate: 0.9 });
      });
    }

    // カテゴリ選択
    const catSelect = this.container.querySelector('#spelling-category-select');
    if (catSelect) {
      catSelect.addEventListener('change', (e) => {
        this.state.category = e.target.value;
        this.initGame(true);
      });
    }

    // パスボタン
    const skipBtn = this.container.querySelector('#btn-spelling-skip');
    if (skipBtn) {
      skipBtn.addEventListener('click', () => {
        this.nextWord();
      });
    }

    if (this.state.mode === 'tile_arrange') {
      // 候補タイルクリック
      this.container.querySelectorAll('.spelling-tile').forEach(btn => {
        btn.addEventListener('click', () => {
          const tileId = btn.dataset.tileId;
          const char = btn.dataset.char;
          this.onTileClicked(tileId, char);
        });
      });

      // スロットクリック（タップして手元に戻す）
      this.container.querySelectorAll('.spelling-slot').forEach(slot => {
        slot.addEventListener('click', () => {
          const idx = parseInt(slot.dataset.slotIndex, 10);
          this.onSlotClicked(idx);
        });
      });

      // 1文字戻す
      const backspaceBtn = this.container.querySelector('#btn-spelling-backspace');
      if (backspaceBtn) {
        backspaceBtn.addEventListener('click', () => this.popLastPlacedTile());
      }

      // リセット
      const clearBtn = this.container.querySelector('#btn-spelling-clear');
      if (clearBtn) {
        clearBtn.addEventListener('click', () => this.clearPlacedTiles());
      }

      // シャッフル
      const shuffleBtn = this.container.querySelector('#btn-spelling-shuffle');
      if (shuffleBtn) {
        shuffleBtn.addEventListener('click', () => {
          this.state.candidateTiles = shuffleArray([...this.state.candidateTiles]);
          SoundEffects.playTile();
          this.renderUI();
        });
      }

      // ヒント
      const hintBtn = this.container.querySelector('#btn-spelling-hint');
      if (hintBtn) {
        hintBtn.addEventListener('click', () => this.applyHint());
      }
    } else {
      // 自力入力モード：文字パレット
      this.container.querySelectorAll('.spelling-quick-char').forEach(btn => {
        btn.addEventListener('click', () => {
          const char = btn.dataset.char;
          this.onFreeCharTyped(char);
        });
      });

      // 自力入力モード：1文字消去
      const freeBackspace = this.container.querySelector('#btn-spelling-free-backspace');
      if (freeBackspace) {
        freeBackspace.addEventListener('click', () => {
          if (this.state.typedLetters.length > 0) {
            this.state.typedLetters.pop();
            SoundEffects.playTile();
            this.renderUI();
          }
        });
      }

      // 自力入力モード：決定ボタン
      const freeSubmit = this.container.querySelector('#btn-spelling-submit-free');
      if (freeSubmit) {
        freeSubmit.addEventListener('click', () => {
          this.verifyFreeTypeAnswer();
        });
      }
    }

    // キーボード入力サポート（物理キーボード対応）
    this.bindKeyboardInput();
  }

  // ==========================================
  // キーボードイベント（物理キーボード）
  // ==========================================
  static keydownHandler = null;

  static bindKeyboardInput() {
    if (this.keydownHandler) {
      window.removeEventListener('keydown', this.keydownHandler);
    }

    this.keydownHandler = (e) => {
      // 入力フォームやモーダルが開いている時は無効化
      if (e.target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;
      if (this.state.hasAnswered) return;

      if (e.key === 'Backspace') {
        e.preventDefault();
        if (this.state.mode === 'tile_arrange') {
          this.popLastPlacedTile();
        } else {
          if (this.state.typedLetters.length > 0) {
            this.state.typedLetters.pop();
            SoundEffects.playTile();
            this.renderUI();
          }
        }
        return;
      }

      if (e.key === 'Escape' || e.key === 'Delete') {
        e.preventDefault();
        if (this.state.mode === 'tile_arrange') {
          this.clearPlacedTiles();
        } else {
          this.state.typedLetters = [];
          this.renderUI();
        }
        return;
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        if (this.state.mode === 'free_type') {
          this.verifyFreeTypeAnswer();
        } else if (this.state.placedLetters.length === this.state.targetLetters.length) {
          this.checkArrangeAnswer();
        }
        return;
      }

      let keyChar = e.key ? e.key.toLowerCase() : '';
      // Windows 日本語IMEがONの場合、e.code から物理キー名を取得
      if ((keyChar === 'process' || e.isComposing) && e.code && e.code.startsWith('Key')) {
        keyChar = e.code.slice(3).toLowerCase();
      }

      if (this.state.mode === 'tile_arrange') {
        const matchTile = this.resolveKeyToTile(keyChar, e);
        if (matchTile) {
          e.preventDefault();
          this.onTileClicked(matchTile.id, matchTile.char);
        }
      } else {
        if (isCyrillic(keyChar)) {
          this.onFreeCharTyped(keyChar);
        } else {
          const cyr = this.resolveLatinCharToCyrillic(keyChar, e);
          if (cyr) {
            this.onFreeCharTyped(cyr);
          }
        }
      }
    };

    window.addEventListener('keydown', this.keydownHandler);
  }

  /**
   * PCキーボード打鍵文字から未使用の候補タイルを賢く探索
   * （期待文字最優先 ➜ フォネティック発音一致 ➜ 直接キリル一致 ➜ QWERTY物理配列一致）
   */
  static resolveKeyToTile(keyChar, e = null) {
    if (!keyChar) return null;
    keyChar = keyChar.toLowerCase();
    if ((keyChar === 'process' || (e && e.isComposing)) && e && e.code && e.code.startsWith('Key')) {
      keyChar = e.code.slice(3).toLowerCase();
    }

    const unusedTiles = this.state.candidateTiles.filter(t => !t.isUsed);
    if (!unusedTiles.length) return null;

    // 次のスロットで期待されている文字（正解文字を最優先でヒットさせる）
    const nextIdx = this.state.placedLetters.length;
    const expectedChar = this.state.targetLetters[nextIdx] ? this.state.targetLetters[nextIdx].toLowerCase() : null;

    // 1. 直接キリル文字一致
    if (expectedChar) {
      const directExpected = unusedTiles.find(t => t.char.toLowerCase() === keyChar && t.char.toLowerCase() === expectedChar);
      if (directExpected) return directExpected;
    }
    const direct = unusedTiles.find(t => t.char.toLowerCase() === keyChar);
    if (direct) return direct;

    // 2. 発音・ローマ字（フォネティック）マッピング（日本語・英語キーボードの直感入力）
    const PHONETIC_MAP = {
      'a': ['а', 'я'],
      'b': ['б'],
      'v': ['в'],
      'w': ['в'],
      'g': ['г'],
      'd': ['д'],
      'e': ['э', 'е', 'ё'],
      'z': ['з', 'ж'],
      'i': ['и', 'й', 'ы'],
      'j': ['ж', 'й'],
      'k': ['к', 'х'],
      'l': ['л'],
      'm': ['м'],
      'n': ['н'],
      'o': ['о', 'ө'],
      'p': ['п'],
      'r': ['р'],
      's': ['с', 'ш', 'щ', 'ц'],
      't': ['т', 'ц'],
      'u': ['у', 'ү'],
      'f': ['ф'],
      'h': ['х'],
      'x': ['х', 'ч'],
      'c': ['ц', 'ч', 'с'],
      'y': ['й', 'ы', 'я', 'ю', 'у', 'ү'],
      'q': ['й', 'ө', 'ү'],
      '-': ['ь', 'ъ', 'ү'],
      '=': ['ө'],
      "'": ['ь', 'ъ'],
      '"': ['ь', 'ъ']
    };

    const phoneticCandidates = PHONETIC_MAP[keyChar];
    if (phoneticCandidates) {
      // 期待される正解文字に合致する未使用タイルがあれば最優先で選択！
      if (expectedChar && phoneticCandidates.includes(expectedChar)) {
        const expectedMatch = unusedTiles.find(t => t.char.toLowerCase() === expectedChar);
        if (expectedMatch) return expectedMatch;
      }
      for (const c of phoneticCandidates) {
        const pMatch = unusedTiles.find(t => t.char.toLowerCase() === c);
        if (pMatch) return pMatch;
      }
    }

    // 3. QWERTY物理キー配列マッピング (ロシア語/モンゴル語キーボード配列)
    const QWERTY_MAP = {
      'q': 'й', 'w': 'ц', 'e': 'у', 'r': 'к', 't': 'е', 'y': 'н', 'u': 'г', 'i': 'ш', 'o': 'щ', 'p': 'з',
      '[': 'х', '{': 'х', ']': 'ъ', '}': 'ъ',
      'a': 'ф', 's': 'ы', 'd': 'в', 'f': 'а', 'g': 'п', 'h': 'р', 'j': 'о', 'k': 'л', 'l': 'д',
      ';': 'ж', ':': 'ж', "'": 'э', '"': 'э',
      'z': 'я', 'x': 'ч', 'c': 'с', 'v': 'м', 'b': 'и', 'n': 'т', 'm': 'ь',
      '-': 'ү', '=': 'ө'
    };
    if (QWERTY_MAP[keyChar]) {
      const qChar = QWERTY_MAP[keyChar];
      if (expectedChar && qChar === expectedChar) {
        const qExpected = unusedTiles.find(t => t.char.toLowerCase() === expectedChar);
        if (qExpected) return qExpected;
      }
      const qMatch = unusedTiles.find(t => t.char.toLowerCase() === qChar);
      if (qMatch) return qMatch;
    }

    return null;
  }

  static resolveLatinCharToCyrillic(keyChar, e = null) {
    if (!keyChar) return null;
    keyChar = keyChar.toLowerCase();
    if ((keyChar === 'process' || (e && e.isComposing)) && e && e.code && e.code.startsWith('Key')) {
      keyChar = e.code.slice(3).toLowerCase();
    }

    const nextIdx = this.state.typedLetters.length;
    const expectedChar = this.state.targetLetters[nextIdx] ? this.state.targetLetters[nextIdx].toLowerCase() : null;
    const PHONETIC_MAP = {
      'a': ['а', 'я'], 'b': ['б'], 'v': ['в'], 'w': ['в'], 'g': ['г'], 'd': ['д'],
      'e': ['э', 'е', 'ё'], 'z': ['з', 'ж'], 'i': ['и', 'й', 'ы'], 'j': ['ж', 'й'], 'k': ['к', 'х'],
      'l': ['л'], 'm': ['м'], 'n': ['н'], 'o': ['о', 'ө'], 'p': ['п'], 'r': ['р'],
      's': ['с', 'ш'], 't': ['т', 'ц'], 'u': ['у', 'ү'], 'f': ['ф'], 'h': ['х'], 'x': ['х', 'ч'],
      'c': ['ц', 'ч'], 'y': ['й', 'ы', 'я', 'ю'], 'q': ['й', 'ө', 'ү'],
      "'": ['ь'], '-': ['ү'], '=': ['ө']
    };
    const list = PHONETIC_MAP[keyChar];
    if (list) {
      if (expectedChar && list.includes(expectedChar)) return expectedChar;
      return list[0];
    }
    return null;
  }

  // ==========================================
  // タイル並び替えモードのロジック
  // ==========================================
  static onTileClicked(tileId, char) {
    if (this.state.hasAnswered) return;
    if (this.state.placedLetters.length >= this.state.targetLetters.length) return;

    const tile = this.state.candidateTiles.find(t => t.id === tileId);
    if (!tile || tile.isUsed) return;

    tile.isUsed = true;
    this.state.placedLetters.push({ tileId, char });
    SoundEffects.playTile();
    this.state.isMistake = false;

    // 即座に最新のスロット配置を画面に反映
    this.renderUI();

    // 全スロットが埋まったら自動判定
    if (this.state.placedLetters.length === this.state.targetLetters.length) {
      setTimeout(() => {
        this.checkArrangeAnswer();
      }, 120);
    }
  }

  static onSlotClicked(index) {
    if (this.state.hasAnswered) return;
    if (index >= this.state.placedLetters.length) return;

    // タップしたスロットの文字を候補プールに戻す
    const removed = this.state.placedLetters.splice(index, 1)[0];
    if (removed) {
      const tile = this.state.candidateTiles.find(t => t.id === removed.tileId);
      if (tile) tile.isUsed = false;
      SoundEffects.playTile();
      this.state.isMistake = false;
      this.renderUI();
    }
  }

  static popLastPlacedTile() {
    if (this.state.placedLetters.length === 0) return;
    const removed = this.state.placedLetters.pop();
    if (removed) {
      const tile = this.state.candidateTiles.find(t => t.id === removed.tileId);
      if (tile) tile.isUsed = false;
      SoundEffects.playTile();
      this.state.isMistake = false;
      this.renderUI();
    }
  }

  static clearPlacedTiles() {
    this.state.placedLetters.forEach(p => {
      const tile = this.state.candidateTiles.find(t => t.id === p.tileId);
      if (tile) tile.isUsed = false;
    });
    this.state.placedLetters = [];
    this.state.isMistake = false;
    SoundEffects.playTile();
    this.renderUI();
  }

  static applyHint() {
    const nextIdx = this.state.placedLetters.length;
    if (nextIdx >= this.state.targetLetters.length) return;

    const targetChar = this.state.targetLetters[nextIdx];
    const matchTile = this.state.candidateTiles.find(t => !t.isUsed && t.char === targetChar);
    if (matchTile) {
      this.onTileClicked(matchTile.id, matchTile.char);
      this.state.hintsUsed++;
    }
  }

  static checkArrangeAnswer() {
    const formedWord = this.state.placedLetters.map(p => p.char).join('');
    const targetWord = this.state.targetLetters.join('');

    if (formedWord === targetWord) {
      this.onCorrectAnswer();
    } else {
      this.onWrongAnswer();
    }
  }

  // ==========================================
  // 完全自力入力モードのロジック
  // ==========================================
  static onFreeCharTyped(char) {
    if (this.state.hasAnswered) return;
    if (this.state.typedLetters.length >= this.state.targetLetters.length) return;

    this.state.typedLetters.push(char);
    SoundEffects.playTile();
    this.state.isMistake = false;

    // 即座に最新のスロット配置を画面に反映
    this.renderUI();

    // 全スロットが埋まったら即時判定
    if (this.state.typedLetters.length === this.state.targetLetters.length) {
      setTimeout(() => {
        this.verifyFreeTypeAnswer();
      }, 120);
    }
  }

  static verifyFreeTypeAnswer() {
    const formed = this.state.typedLetters.join('');
    const target = this.state.targetLetters.join('');

    if (formed === target) {
      this.onCorrectAnswer();
    } else {
      this.onWrongAnswer();
    }
  }

  // ==========================================
  // 正解時のペンギンご飯フィーディング処理 🐟😋
  // ==========================================
  static onCorrectAnswer() {
    this.state.hasAnswered = true;
    this.state.isMistake = false;
    this.state.combo++;
    if (this.state.combo > this.state.maxCombo) {
      this.state.maxCombo = this.state.combo;
    }

    // スコア加算 (基本10点 + コンボボーナス)
    const pts = 10 + Math.min(this.state.combo * 2, 20);
    this.state.score += pts;
    this.state.fishFedCount++;
    this.state.todayTotalFed++;
    this.saveTodayFedCount();

    // 満腹度加算 (0〜5)
    this.state.fullness++;
    let isFever = false;
    if (this.state.fullness >= 5) {
      isFever = true;
      this.state.fullness = 0; // リセット
      this.state.score += 50;  // 満腹フィーバーボーナス
      try {
        if (typeof GamificationService !== 'undefined' && typeof GamificationService.addXp === 'function') {
          GamificationService.addXp(50);
        }
      } catch (e) {
        console.warn('GamificationService.addXp error:', e);
      }
    } else {
      try {
        if (typeof GamificationService !== 'undefined' && typeof GamificationService.addXp === 'function') {
          GamificationService.addXp(15);
        }
      } catch (e) {
        console.warn('GamificationService.addXp error:', e);
      }
    }

    // マスコットのアニメーションとメッセージ
    this.state.isFeeding = true;
    this.state.mascotMood = isFever ? 'celebrate' : 'happy';
    this.state.mascotMessage = isFever 
      ? '🎉 満腹フィーバー！！ペンギン大満足！ボーナス +50 XP！' 
      : `モグモグ！美味しい！！ амттай байна! 🐟😋 (+${pts} pt)`;

    // 効果音
    try {
      SoundEffects.playCorrect();
      setTimeout(() => {
        SoundEffects.playMunch();
      }, 200);
    } catch (_) {}

    // ネイティブ音声自動再生
    try {
      SpeechService.speak(this.state.currentWord.mongolian, { rate: 0.9 });
    } catch (_) {}

    // 履歴に追加
    this.state.answeredLog.push({
      word: this.state.currentWord,
      isCorrect: true,
      userAnswer: this.state.targetLetters.join('')
    });

    this.renderUI();

    // 1.5秒後に次の問題へ
    setTimeout(() => {
      this.nextWord();
    }, 1500);
  }

  static onWrongAnswer() {
    this.state.isMistake = true;
    this.state.combo = 0;
    this.state.mascotMood = 'sad';
    this.state.mascotMessage = 'うーん、惜しい！文字を直してもう一度！🐧';
    try {
      SoundEffects.playWrong();
    } catch (_) {}
    this.renderUI();
    // 誤答時は最後の文字（誤った文字）を少し待って自動で候補プールへ戻し、スムーズに再入力できるようにする
    setTimeout(() => {
      if (this.state.isMistake && this.state.placedLetters.length > 0) {
        this.popLastPlacedTile();
      }
    }, 450);
  }

  static nextWord() {
    this.state.currentIndex++;
    if (this.state.currentIndex >= this.state.questions.length) {
      this.showResult();
    } else {
      this.loadCurrentWord();
      this.renderUI();
    }
  }

  // ==========================================
  // 結果画面の表示
  // ==========================================
  static showResult() {
    this.state.view = 'result';
    if (this.keydownHandler) {
      window.removeEventListener('keydown', this.keydownHandler);
      this.keydownHandler = null;
    }
    SoundEffects.playLevelUp();
    this.renderResultUI();
  }

  static renderResultUI() {
    if (!this.container) return;
    const { score, fishFedCount, maxCombo, answeredLog, todayTotalFed } = this.state;
    const totalQuestions = this.state.questions.length;
    const correctCount = answeredLog.filter(a => a.isCorrect).length;

    this.container.innerHTML = `
      <div class="animate-fade-in max-w-2xl mx-auto px-4 py-8 space-y-6">
        
        <div class="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border-2 border-amber-400 shadow-2xl text-center space-y-5">
          
          <div class="flex justify-center transform scale-110">
            ${PenguinMascot.getSvg({ mood: 'celebrate', size: 110 })}
          </div>

          <div class="space-y-1">
            <span class="text-xs bg-amber-400 text-slate-950 font-black px-3 py-1 rounded-full uppercase tracking-wider">
              ROUND COMPLETE
            </span>
            <h2 class="text-2xl sm:text-3xl font-black text-amber-200 mt-2">
              ごちそうさまでした！！🐟
            </h2>
            <p class="text-xs text-sky-200">
              ペンギンがお腹いっぱいになって大喜びしています！
            </p>
          </div>

          <!-- 実績サマリーカード -->
          <div class="grid grid-cols-3 gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15">
            <div class="space-y-0.5">
              <div class="text-[10px] text-slate-300 font-bold">あげたお魚</div>
              <div class="text-xl sm:text-2xl font-black text-amber-300 flex items-center justify-center gap-1">
                <span>🐟</span>
                <span>${fishFedCount} 匹</span>
              </div>
            </div>
            <div class="space-y-0.5 border-x border-white/15">
              <div class="text-[10px] text-slate-300 font-bold">獲得スコア</div>
              <div class="text-xl sm:text-2xl font-black text-yellow-300">
                ${score} pt
              </div>
            </div>
            <div class="space-y-0.5">
              <div class="text-[10px] text-slate-300 font-bold">最大コンボ</div>
              <div class="text-xl sm:text-2xl font-black text-orange-400">
                ${maxCombo} 回
              </div>
            </div>
          </div>

          <div class="bg-sky-950/60 p-3 rounded-xl border border-sky-500/30 text-xs text-sky-100 flex items-center justify-between">
            <span>📅 今日の累計給餌数:</span>
            <span class="font-black text-amber-300 text-sm">計 ${todayTotalFed} 匹 🐟</span>
          </div>

          <!-- 今回練習した単語一覧 -->
          <div class="text-left space-y-2 mt-4">
            <h4 class="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <span>📖</span>
              <span>今回登場した単語 (${answeredLog.length}語)</span>
            </h4>
            <div class="max-h-48 overflow-y-auto space-y-1.5 pr-1 no-scrollbar">
              ${answeredLog.map(item => `
                <div class="flex items-center justify-between p-2.5 bg-white/5 rounded-xl border border-white/10 text-xs hover:bg-white/10 transition-colors">
                  <div class="flex items-center gap-2">
                    <button type="button" class="btn-play-logged-word p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white" data-word="${item.word.mongolian}" title="発音を聞く">
                      🔊
                    </button>
                    <div>
                      <div class="font-black text-amber-200 text-sm">${item.word.mongolian}</div>
                      <div class="text-[11px] text-slate-300">${item.word.japanese}</div>
                    </div>
                  </div>
                  <span class="text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/30">
                    完食 🐟
                  </span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- アクションボタン -->
          <div class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
            <button type="button" id="btn-spelling-retry" class="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-sm shadow-md active:scale-95 transition-all">
              🔄 もう1ラウンド遊ぶ！
            </button>
            <button type="button" id="btn-spelling-home" class="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-sm border border-white/20 active:scale-95 transition-all">
              🏠 ホームに戻る
            </button>
          </div>

        </div>

      </div>
    `;

    // ログ内発音ボタン
    this.container.querySelectorAll('.btn-play-logged-word').forEach(btn => {
      btn.addEventListener('click', () => {
        const word = btn.dataset.word;
        SpeechService.speak(word, { rate: 0.9 });
      });
    });

    const retryBtn = this.container.querySelector('#btn-spelling-retry');
    if (retryBtn) {
      retryBtn.addEventListener('click', () => {
        this.initGame(false);
      });
    }

    const homeBtn = this.container.querySelector('#btn-spelling-home');
    if (homeBtn) {
      homeBtn.addEventListener('click', () => {
        if (this.onNavigate) this.onNavigate('home');
      });
    }
  }
}
