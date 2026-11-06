// スペリングゲームコンポーネント（水色オーシャン・レーザー魚キャッチアクション）
// お魚の中に和訳が書かれて上から降ってくる！落ち切る前にスペルを入力してレーザーで打ち落とすとペンギンが食べる！
// ※打鍵ごとの全画面再描画を完全撤廃し、インプレース部分更新によりチカチカ・点滅を100%防止

import { StorageService } from '../services/storage.js';
import { SpeechService } from '../services/speech.js';
import { SoundEffects, shuffleArray, SPECIAL_CYRILLIC_BAR, isCyrillic } from '../utils/helpers.js';
import { PenguinMascot } from './PenguinMascot.js';
import { GamificationService } from '../services/gamification.js';

export class SpellingGameComponent {
  static container = null;
  static onNavigate = null;
  static keydownHandler = null;
  static fallInterval = null;

  static state = {
    view: 'playing', // 'playing' | 'result'
    mode: 'tile_arrange', // 'tile_arrange' | 'free_type'
    category: 'all',
    
    questions: [],
    currentIndex: 0,
    currentWord: null,
    targetLetters: [],
    
    // タイル並べ替え用
    candidateTiles: [], // { id, char, isUsed }
    placedLetters: [],  // { tileId, char }
    
    // 自力入力用
    typedLetters: [],
    
    // ゲーム進行・満腹度
    score: 0,
    combo: 0,
    maxCombo: 0,
    fishFedCount: 0,
    fullness: 0, // 0 - 5 (5匹で 100% 満腹フィーバー)
    todayTotalFed: 0,
    
    // 魚の落下・レーザーアクション
    fallProgress: 0, // 0% (上) 〜 100% (下・逃げられる)
    fallDurationSec: 15, // 1問あたりの落下秒数
    isLaserShooting: false,
    isFishHit: false,
    isFishCaught: false,
    isFishEscaped: false,
    isPaused: false,
    
    // ペンギンマスコット
    mascotMood: 'idle',
    mascotMessage: 'お魚が落ちてくるよ！急いでスペルを撃ち落とそう！🐟⚡',
    
    // 状態管理
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
  // ゲーム初期化 ＆ 問題選出
  // ==========================================
  static initGame(preserveSettings = false) {
    this.stopFallTimer();
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
    let pool = rawVocab.filter(w => {
      if (!w.mongolian || !w.japanese) return false;
      const clean = w.mongolian.trim().toLowerCase().replace(/[.,?!/\\~]/g, '');
      return clean.length >= 2 && clean.length <= 10 && !clean.includes(' ');
    });

    if (pool.length < 5) {
      pool = rawVocab.filter(w => w.mongolian && w.japanese);
    }

    const shuffled = shuffleArray([...pool]);
    this.state.questions = shuffled.slice(0, 10);
    if (this.state.questions.length === 0) {
      this.state.questions = [
        { mongolian: 'сайн', japanese: '良い、こんにちは', pos: '形容詞' },
        { mongolian: 'ном', japanese: '本', pos: '名詞' },
        { mongolian: 'ус', japanese: '水', pos: '名詞' },
        { mongolian: 'аш', japanese: '利益、恩恵', pos: '名詞' },
        { mongolian: 'морь', japanese: '馬', pos: '名詞' }
      ];
    }
  }

  static loadCurrentWord() {
    this.stopFallTimer();
    const word = this.state.questions[this.state.currentIndex];
    if (!word) {
      this.showResult();
      return;
    }

    this.state.currentWord = word;
    const cleanWord = word.mongolian.trim().toLowerCase().replace(/[.,?!/\\~]/g, '');
    this.state.targetLetters = cleanWord.split('');
    this.state.placedLetters = [];
    this.state.typedLetters = [];
    this.state.hasAnswered = false;
    this.state.isMistake = false;
    this.state.isFeeding = false;
    this.state.isLaserShooting = false;
    this.state.isFishHit = false;
    this.state.isFishCaught = false;
    this.state.isFishEscaped = false;
    this.state.hintsUsed = 0;
    this.state.fallProgress = 0;
    this.state.mascotMood = this.state.combo > 2 ? 'happy' : 'idle';
    this.state.mascotMessage = 'お魚が落ちてくるよ！急いでスペルを撃ち落とそう！🐟⚡';

    // 候補タイルの生成（正解文字 ＋ ダミー文字3〜4文字）
    const dummyPool = ['а', 'э', 'и', 'о', 'у', 'ө', 'ү', 'н', 'м', 'л', 'р', 'с', 'т', 'б', 'в', 'г', 'д', 'х', 'й', 'ж', 'з'];
    const neededDummies = Math.max(3, 10 - this.state.targetLetters.length);
    const chosenDummies = [];
    for (let i = 0; i < neededDummies; i++) {
      const randChar = dummyPool[Math.floor(Math.random() * dummyPool.length)];
      chosenDummies.push(randChar);
    }

    const allChars = [...this.state.targetLetters, ...chosenDummies];
    const shuffledChars = shuffleArray(allChars);

    this.state.candidateTiles = shuffledChars.map((ch, idx) => ({
      id: `tile_${idx}_${ch}`,
      char: ch,
      isUsed: false
    }));

    // 落下タイマー開始
    this.startFallTimer();
  }

  // ==========================================
  // 魚の落下タイマー
  // ==========================================
  static startFallTimer() {
    this.stopFallTimer();
    const durationMs = this.state.fallDurationSec * 1000;
    const stepMs = 60;
    const stepPct = (stepMs / durationMs) * 100;

    this.fallInterval = setInterval(() => {
      if (this.state.isPaused || this.state.hasAnswered || this.state.view !== 'playing') {
        return;
      }

      this.state.fallProgress += stepPct;
      if (this.state.fallProgress >= 100) {
        this.state.fallProgress = 100;
        this.stopFallTimer();
        this.onFishEscaped();
      } else {
        this.updateFishDOM();
      }
    }, stepMs);
  }

  static stopFallTimer() {
    if (this.fallInterval) {
      clearInterval(this.fallInterval);
      this.fallInterval = null;
    }
  }

  static updateFishDOM() {
    const fishEl = this.container?.querySelector('#falling-fish-box');
    const barEl = this.container?.querySelector('#fall-progress-bar');
    if (fishEl) {
      const topPos = 8 + (this.state.fallProgress * 0.60);
      fishEl.style.top = `${topPos}%`;
    }
    if (barEl) {
      const remainPct = Math.max(0, 100 - this.state.fallProgress);
      barEl.style.width = `${remainPct}%`;
      if (remainPct < 25) {
        barEl.className = 'h-full bg-red-500 transition-none';
      } else if (remainPct < 50) {
        barEl.className = 'h-full bg-amber-400 transition-none';
      } else {
        barEl.className = 'h-full bg-emerald-400 transition-none';
      }
    }
  }

  // ==========================================
  // UIレンダリング（全画面再描画：問題切替時やモード切替時のみ）
  // ==========================================
  static renderUI() {
    if (!this.container) return;
    if (this.state.view === 'result') {
      this.renderResultUI();
      return;
    }

    const { currentWord, targetLetters, placedLetters, typedLetters, candidateTiles, mode, score, combo, fullness, fishFedCount, todayTotalFed, mascotMood, mascotMessage, isLaserShooting, isFishHit, isFishCaught, isFishEscaped } = this.state;
    const isArrange = mode === 'tile_arrange';
    const currentLetters = isArrange ? placedLetters.map(p => p.char) : typedLetters;

    // チカチカ防止：最外層の animate-fade-in を完全撤廃
    this.container.innerHTML = `
      <div class="max-w-4xl mx-auto px-3 sm:px-4 py-4 space-y-4">
        
        <!-- ナビゲーション・ヘッダーバー -->
        <div class="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
          <div class="flex items-center gap-2">
            <button type="button" id="btn-spelling-back" class="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors" title="ホームへ戻る">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
            </button>
            <h2 class="text-base sm:text-lg font-black text-slate-800 flex items-center gap-1.5">
              <span>🐟⚡</span>
              <span>モンゴル語スペルシューター</span>
            </h2>
          </div>

          <!-- モード切り替えピル -->
          <div class="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button type="button" id="btn-mode-arrange" class="px-3 py-1.5 rounded-lg ${
              isArrange ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }">
              🔤 候補タイルあり（タップ / 打鍵）
            </button>
            <button type="button" id="btn-mode-free" class="px-3 py-1.5 rounded-lg ${
              !isArrange ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }">
              ⌨️ 候補なし自力入力
            </button>
          </div>

          <!-- スコア・ご飯ステータス -->
          <div class="flex items-center gap-2 text-xs">
            <div id="spelling-score-box" class="flex items-center gap-1 bg-amber-50 text-amber-900 border border-amber-300 px-2.5 py-1 rounded-full font-black">
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

        <!-- 水色オーシャン・ゲームステージ -->
        <div class="relative bg-gradient-to-b from-sky-400 via-cyan-500 to-blue-600 rounded-3xl p-4 sm:p-7 border-2 border-sky-300 shadow-xl overflow-hidden min-h-[520px] text-slate-900 flex flex-col justify-between select-none">
          
          <!-- 水中の気泡エフェクト（CSSドット） -->
          <div class="absolute inset-0 pointer-events-none opacity-30 bg-[radial-gradient(#ffffff_2px,transparent_2px)] [background-size:32px_32px]"></div>
          
          <!-- 海面の揺らめきハイライト -->
          <div class="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-white/30 to-transparent pointer-events-none"></div>

          <!-- 制限時間（落下ゲージ）バー -->
          <div class="relative z-10 w-full max-w-md mx-auto bg-black/25 backdrop-blur-xs rounded-full p-1 border border-white/40 shadow-xs mb-2">
            <div class="flex items-center justify-between text-[11px] font-black text-white px-2 mb-0.5">
              <span class="flex items-center gap-1">⏱️ 落下ゲージ: 落ち切る前に撃ち落とそう！</span>
              <span id="fall-seconds-text">${Math.max(0, Math.ceil(this.state.fallDurationSec * (1 - this.state.fallProgress / 100)))} 秒</span>
            </div>
            <div class="w-full bg-white/20 h-2.5 rounded-full overflow-hidden">
              <div id="fall-progress-bar" class="h-full bg-emerald-400 transition-none" style="width: ${Math.max(0, 100 - this.state.fallProgress)}%;"></div>
            </div>
          </div>

          <!-- レーザー光線エフェクト（正解時に下から魚へビシューン！） -->
          ${isLaserShooting ? `
            <div class="laser-beam absolute left-1/2 bottom-24 -translate-x-1/2 w-3 sm:w-4 bg-gradient-to-t from-cyan-200 via-white to-amber-300 rounded-full shadow-[0_0_25px_#ffffff] z-30 pointer-events-none transition-none" style="height: 60%;"></div>
          ` : ''}

          <!-- 上から降ってくるお魚カプセル（魚の中に和訳！！） -->
          <div id="falling-fish-box" class="absolute left-1/2 -translate-x-1/2 z-20 transition-none flex flex-col items-center" style="top: ${8 + (this.state.fallProgress * 0.60)}%;">
            
            <div class="relative flex items-center justify-center filter drop-shadow-xl ${isFishHit ? 'scale-125 rotate-12' : ''} ${isFishCaught ? 'scale-0 translate-y-32 opacity-0' : ''}">
              
              <!-- お魚ボディ（和訳内蔵） -->
              <div class="relative bg-gradient-to-r from-amber-300 via-orange-400 to-amber-400 text-slate-950 px-5 sm:px-7 py-3 rounded-full border-2 border-white shadow-2xl flex items-center gap-3">
                <div class="absolute -right-3 sm:-right-4 top-1/2 -translate-y-1/2 w-0 h-0 border-y-8 border-y-transparent border-r-12 border-r-orange-400"></div>
                
                <span class="text-2xl sm:text-3xl">🐟</span>
                
                <div class="text-center">
                  <div class="flex items-center justify-center gap-1.5 mb-0.5">
                    <span class="text-[10px] font-black bg-white/90 text-slate-800 px-2 py-0.2 rounded-full border border-orange-200">
                      ${currentWord.pos || '単語'}
                    </span>
                    <span class="text-[10px] font-bold text-white/95 drop-shadow-xs">
                      第 ${this.state.currentIndex + 1} / ${this.state.questions.length} 問
                    </span>
                  </div>
                  <!-- 和訳テキスト -->
                  <h3 class="text-lg sm:text-2xl md:text-3xl font-black text-slate-950 tracking-wide drop-shadow-xs">
                    ${currentWord.japanese}
                  </h3>
                </div>

                <!-- 音声ボタン -->
                <button type="button" id="btn-audio-prompt" class="p-1.5 bg-white/80 hover:bg-white text-orange-950 rounded-full shadow-xs" title="発音を聴く">
                  🔊
                </button>
              </div>

              <!-- 被弾エフェクト -->
              ${isFishHit ? `
                <div class="absolute inset-0 flex items-center justify-center text-3xl font-black text-yellow-200 drop-shadow-[0_0_15px_#fde047] z-30">
                  💥 HIT!!
                </div>
              ` : ''}

              <!-- 逃げられたエフェクト -->
              ${isFishEscaped ? `
                <div class="absolute -top-7 text-xs font-black bg-rose-600 text-white px-3 py-1 rounded-full shadow-lg">
                  ポチャッ… 逃げられた！
                </div>
              ` : ''}
            </div>
          </div>

          <!-- ステージ中央下部：入力文字スロット（レーザー照準器デザイン） -->
          <div class="relative z-10 w-full max-w-2xl mx-auto mt-40 sm:mt-48 mb-2">
            
            <div class="bg-black/30 backdrop-blur-md rounded-2xl p-4 border border-white/30 shadow-lg text-center space-y-3">
              <div class="text-[11px] font-black text-sky-200 tracking-wider flex items-center justify-center gap-1">
                <span>🎯 スペルを入力してレーザーで打ち落とそう！</span>
              </div>

              <!-- 文字スロット（DOM部分更新対応） -->
              <div id="spelling-slots-container" class="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2.5 min-h-[58px]">
                ${targetLetters.map((expectedChar, idx) => {
                  const placed = currentLetters[idx];
                  const hasChar = !!placed;
                  
                  let slotColor = 'bg-white/20 border-white/40 text-white';
                  if (hasChar) {
                    slotColor = 'bg-gradient-to-b from-amber-300 to-yellow-400 border-yellow-200 text-slate-950 font-black shadow-md';
                  }

                  return `
                    <div class="spelling-slot relative w-10 h-12 sm:w-12 sm:h-14 rounded-xl border-2 flex items-center justify-center text-xl sm:text-2xl font-mono ${slotColor} ${
                      isArrange && hasChar ? 'cursor-pointer hover:bg-rose-400 hover:text-white' : ''
                    }" data-index="${idx}" title="${isArrange && hasChar ? 'タップして取り消す' : ''}">
                      <span>${placed || ''}</span>
                      <div class="slot-underline absolute bottom-1 w-4 h-0.5 bg-white/40 rounded-full" style="display: ${hasChar ? 'none' : 'block'};"></div>
                    </div>
                  `;
                }).join('')}
              </div>

              <!-- 入力モード別操作エリア -->
              ${isArrange ? `
                <div class="pt-2 border-t border-white/20 space-y-2.5">
                  <div class="text-xs font-bold text-sky-100 flex items-center justify-between px-1">
                    <span>✨ 文字タイルをタップ（またはキーボード打鍵）:</span>
                    <span id="tiles-remaining-count" class="text-[11px] text-white/80">${candidateTiles.filter(t => !t.isUsed).length} 文字残り</span>
                  </div>

                  <!-- 候補タイル群 -->
                  <div id="candidate-tiles-container" class="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 min-h-[50px]">
                    ${candidateTiles.map(tile => `
                      <button type="button" class="candidate-tile w-10 h-11 sm:w-11 sm:h-12 rounded-xl text-lg sm:text-xl font-black font-mono border-2 ${
                        tile.isUsed 
                          ? 'bg-black/30 border-transparent text-white/20 cursor-not-allowed' 
                          : 'bg-amber-400 hover:bg-amber-300 active:scale-95 border-amber-200 text-slate-950 shadow-md'
                      }" data-tile-id="${tile.id}" data-char="${tile.char}" ${tile.isUsed ? 'disabled' : ''}>
                        ${tile.char}
                      </button>
                    `).join('')}
                  </div>

                  <!-- サブボタン群 -->
                  <div class="flex items-center justify-center gap-2 pt-1">
                    <button type="button" id="btn-backspace" class="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold border border-white/30 flex items-center gap-1">
                      <span>⌫</span> 1文字戻す
                    </button>
                    <button type="button" id="btn-reset-slots" class="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold border border-white/30 flex items-center gap-1">
                      <span>🔄</span> リセット
                    </button>
                    <button type="button" id="btn-shuffle-tiles" class="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold border border-white/30 flex items-center gap-1">
                      <span>🔀</span> シャッフル
                    </button>
                    <button type="button" id="btn-hint" class="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 text-xs font-black shadow-xs flex items-center gap-1">
                      <span>💡</span> ヒント (1文字開く)
                    </button>
                  </div>
                </div>
              ` : `
                <!-- 自力入力モード -->
                <div class="pt-2 border-t border-white/20 space-y-2">
                  <div class="text-xs font-bold text-sky-100">
                    ⌨️ PCキーボードでそのまま打鍵（ローマ字・キリル両対応）または下記バーをタップ
                  </div>
                  <div class="flex flex-wrap justify-center gap-1 max-w-lg mx-auto">
                    ${SPECIAL_CYRILLIC_BAR.map(c => `
                      <button type="button" class="btn-cyr-key px-2.5 py-1 bg-white/20 hover:bg-white/30 text-white font-mono font-bold text-sm rounded-lg border border-white/30" data-char="${c}">
                        ${c}
                      </button>
                    `).join('')}
                    <button type="button" id="btn-free-backspace" class="px-3 py-1 bg-white/20 hover:bg-white/30 text-white text-xs font-bold rounded-lg border border-white/30">
                      ⌫ 戻す
                    </button>
                  </div>
                </div>
              `}
            </div>
          </div>

          <!-- ステージ下部：ペンギンマスコット ＆ 満腹度バー（待機＆食事エリア） -->
          <div class="relative z-10 bg-black/40 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/30 text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
            
            <!-- 満腹度ゲージ (0〜5匹) -->
            <div class="w-full sm:w-1/2 space-y-1">
              <div class="flex items-center justify-between text-xs font-extrabold text-sky-200">
                <span class="flex items-center gap-1">
                  <span>🧭</span> ペンギンの満腹度
                </span>
                <span id="penguin-fullness-text" class="text-amber-300 font-mono text-sm">${fullness * 20}% (${fullness}/5匹)</span>
              </div>
              <div class="w-full bg-white/20 h-3 rounded-full overflow-hidden p-0.5 border border-white/30">
                <div id="penguin-fullness-bar" class="bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-300 h-full rounded-full transition-all duration-300" style="width: ${fullness * 20}%"></div>
              </div>
              <p class="text-[10px] text-white/70">
                5匹食べると【満腹フィーバー】突入！ボーナス +50 XP 獲得！
              </p>
            </div>

            <!-- ペンギンマスコットのアニメーションとメッセージ -->
            <div class="flex items-center gap-3 w-full sm:w-1/2 justify-center sm:justify-end">
              <div class="relative w-14 h-14 shrink-0 flex items-center justify-center">
                <div id="penguin-svg-wrapper" class="${isFishCaught ? 'scale-125' : ''}">
                  ${PenguinMascot.renderSVG(mascotMood, 54)}
                </div>
                ${isFishCaught ? `
                  <div class="absolute -top-3 -right-2 text-lg">😋🐟</div>
                ` : ''}
              </div>
              <div class="text-left">
                <div id="penguin-mascot-msg" class="text-xs font-bold text-amber-200 leading-snug">
                  ${mascotMessage}
                </div>
                <div class="text-[10px] text-sky-200/80 mt-0.5">
                  正解: <strong class="text-white">${targetLetters.join('')}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
    this.bindKeyboardInput();
  }

  // ==========================================
  // チカチカゼロ：スロットとタイルのインプレース部分更新
  // ==========================================
  static updateSlotsAndTilesOnly() {
    if (!this.container) return;
    const { placedLetters, typedLetters, candidateTiles, mode, targetLetters } = this.state;
    const isArrange = mode === 'tile_arrange';
    const currentLetters = isArrange ? placedLetters.map(p => p.char) : typedLetters;

    // 1. スロット文字と外観の部分更新
    const slots = this.container.querySelectorAll('.spelling-slot');
    slots.forEach((slot, idx) => {
      const char = currentLetters[idx] || '';
      const span = slot.querySelector('span');
      if (span) span.textContent = char;

      const underline = slot.querySelector('.slot-underline');
      if (char) {
        slot.className = `spelling-slot relative w-10 h-12 sm:w-12 sm:h-14 rounded-xl border-2 flex items-center justify-center text-xl sm:text-2xl font-mono bg-gradient-to-b from-amber-300 to-yellow-400 border-yellow-200 text-slate-950 font-black shadow-md ${
          isArrange ? 'cursor-pointer hover:bg-rose-400 hover:text-white' : ''
        }`;
        if (underline) underline.style.display = 'none';
      } else {
        slot.className = 'spelling-slot relative w-10 h-12 sm:w-12 sm:h-14 rounded-xl border-2 flex items-center justify-center text-xl sm:text-2xl font-mono bg-white/20 border-white/40 text-white';
        if (underline) underline.style.display = 'block';
      }
    });

    // 2. 候補タイルの使用状態の部分更新
    if (isArrange) {
      const tileBtns = this.container.querySelectorAll('.candidate-tile');
      tileBtns.forEach(btn => {
        const tileId = btn.dataset.tileId;
        const tileData = candidateTiles.find(t => t.id === tileId);
        if (tileData) {
          if (tileData.isUsed) {
            btn.disabled = true;
            btn.className = 'candidate-tile w-10 h-11 sm:w-11 sm:h-12 rounded-xl text-lg sm:text-xl font-black font-mono border-2 bg-black/30 border-transparent text-white/20 cursor-not-allowed';
          } else {
            btn.disabled = false;
            btn.className = 'candidate-tile w-10 h-11 sm:w-11 sm:h-12 rounded-xl text-lg sm:text-xl font-black font-mono border-2 bg-amber-400 hover:bg-amber-300 active:scale-95 border-amber-200 text-slate-950 shadow-md';
          }
        }
      });

      const remainEl = this.container.querySelector('#tiles-remaining-count');
      if (remainEl) {
        remainEl.textContent = `${candidateTiles.filter(t => !t.isUsed).length} 文字残り`;
      }
    }
  }

  // ==========================================
  // イベントリスナー登録
  // ==========================================
  static bindEvents() {
    if (!this.container) return;

    // 戻るボタン
    const btnBack = this.container.querySelector('#btn-spelling-back');
    if (btnBack) {
      btnBack.addEventListener('click', () => {
        this.stopFallTimer();
        if (this.onNavigate) this.onNavigate('home');
      });
    }

    // 音声発音ボタン
    const btnAudio = this.container.querySelector('#btn-audio-prompt');
    if (btnAudio) {
      btnAudio.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.state.currentWord?.mongolian) {
          SpeechService.speak(this.state.currentWord.mongolian, { rate: 0.9 });
        }
      });
    }

    // モード切り替え
    const btnModeArrange = this.container.querySelector('#btn-mode-arrange');
    const btnModeFree = this.container.querySelector('#btn-mode-free');
    if (btnModeArrange) {
      btnModeArrange.addEventListener('click', () => {
        if (this.state.mode !== 'tile_arrange') {
          this.state.mode = 'tile_arrange';
          this.loadCurrentWord();
          this.renderUI();
        }
      });
    }
    if (btnModeFree) {
      btnModeFree.addEventListener('click', () => {
        if (this.state.mode !== 'free_type') {
          this.state.mode = 'free_type';
          this.loadCurrentWord();
          this.renderUI();
        }
      });
    }

    // 候補タイルのクリック
    const tiles = this.container.querySelectorAll('.candidate-tile');
    tiles.forEach(t => {
      t.addEventListener('click', () => {
        const tileId = t.dataset.tileId;
        const ch = t.dataset.char;
        this.onTileClicked(tileId, ch);
      });
    });

    // スロットのクリック（取り消し）
    const slots = this.container.querySelectorAll('.spelling-slot');
    slots.forEach(s => {
      s.addEventListener('click', () => {
        const idx = parseInt(s.dataset.index, 10);
        this.onSlotClicked(idx);
      });
    });

    // 1文字戻す
    const btnBackspace = this.container.querySelector('#btn-backspace');
    if (btnBackspace) {
      btnBackspace.addEventListener('click', () => {
        this.popLastPlacedTile();
      });
    }

    // スロットリセット
    const btnReset = this.container.querySelector('#btn-reset-slots');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        this.clearPlacedTiles();
      });
    }

    // タイルシャッフル
    const btnShuffle = this.container.querySelector('#btn-shuffle-tiles');
    if (btnShuffle) {
      btnShuffle.addEventListener('click', () => {
        this.state.candidateTiles = shuffleArray([...this.state.candidateTiles]);
        this.renderUI();
      });
    }

    // ヒントボタン
    const btnHint = this.container.querySelector('#btn-hint');
    if (btnHint) {
      btnHint.addEventListener('click', () => {
        this.applyHint();
      });
    }

    // 自力入力のキリルバー
    const cyrKeys = this.container.querySelectorAll('.btn-cyr-key');
    cyrKeys.forEach(k => {
      k.addEventListener('click', () => {
        const ch = k.dataset.char;
        this.onFreeCharTyped(ch);
      });
    });

    const btnFreeBackspace = this.container.querySelector('#btn-free-backspace');
    if (btnFreeBackspace) {
      btnFreeBackspace.addEventListener('click', () => {
        if (this.state.typedLetters.length > 0) {
          this.state.typedLetters.pop();
          this.updateSlotsAndTilesOnly();
        }
      });
    }
  }

  // ==========================================
  // キーボード打鍵処理（IME・ローマ字完全サポート）
  // ==========================================
  static bindKeyboardInput() {
    if (this.keydownHandler) {
      window.removeEventListener('keydown', this.keydownHandler);
    }

    this.keydownHandler = (e) => {
      if (this.state.hasAnswered || this.state.view !== 'playing') return;

      if (e.key === 'Backspace') {
        e.preventDefault();
        if (this.state.mode === 'tile_arrange') {
          this.popLastPlacedTile();
        } else {
          if (this.state.typedLetters.length > 0) {
            this.state.typedLetters.pop();
            this.updateSlotsAndTilesOnly();
          }
        }
        return;
      }

      if (e.key === 'Enter') {
        if (this.state.mode === 'free_type') {
          this.verifyFreeTypeAnswer();
        } else {
          this.checkArrangeAnswer();
        }
        return;
      }

      let keyChar = e.key ? e.key.toLowerCase() : '';
      const HIRAGANA_MAP = {
        'あ': 'a', 'い': 'i', 'う': 'u', 'え': 'e', 'お': 'o',
        'か': 'k', 'き': 'k', 'く': 'k', 'け': 'k', 'こ': 'k',
        'さ': 's', 'し': 's', 'す': 's', 'せ': 's', 'そ': 's',
        'た': 't', 'ち': 'ch', 'つ': 'ts', 'て': 't', 'と': 't',
        'な': 'n', 'に': 'n', 'ぬ': 'n', 'ね': 'n', 'の': 'n',
        'は': 'h', 'ひ': 'h', 'ふ': 'f', 'へ': 'h', 'ほ': 'h',
        'ま': 'm', 'み': 'm', 'む': 'm', 'め': 'm', 'も': 'm',
        'や': 'y', 'ゆ': 'y', 'よ': 'y',
        'ら': 'r', 'り': 'r', 'る': 'r', 'れ': 'r', 'ろ': 'r',
        'わ': 'w', 'を': 'o', 'ん': 'n',
        'が': 'g', 'ぎ': 'g', 'ぐ': 'g', 'げ': 'g', 'ご': 'g',
        'ざ': 'z', 'じ': 'j', 'ず': 'z', 'ぜ': 'z', 'ぞ': 'z',
        'だ': 'd', 'ぢ': 'd', 'づ': 'd', 'で': 'd', 'ど': 'd',
        'ば': 'b', 'び': 'b', 'ぶ': 'b', 'べ': 'b', 'ぼ': 'b',
        'ぱ': 'p', 'ぴ': 'p', 'ぷ': 'p', 'ぺ': 'p', 'ぽ': 'p'
      };
      if (HIRAGANA_MAP[keyChar]) {
        keyChar = HIRAGANA_MAP[keyChar];
      }

      if ((keyChar === 'process' || e.isComposing) && e.code) {
        if (e.code.startsWith('Key')) {
          keyChar = e.code.slice(3).toLowerCase();
        } else if (e.code === 'Minus') {
          keyChar = '-';
        } else if (e.code === 'Equal') {
          keyChar = '=';
        } else if (e.code === 'Quote') {
          keyChar = "'";
        } else if (e.code === 'BracketLeft') {
          keyChar = '[';
        } else if (e.code === 'BracketRight') {
          keyChar = ']';
        } else if (e.code === 'Semicolon') {
          keyChar = ';';
        }
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

  static resolveKeyToTile(keyChar, e = null) {
    if (!keyChar) return null;
    keyChar = keyChar.toLowerCase();

    const expectedIndex = this.state.placedLetters.length;
    const expectedChar = this.state.targetLetters[expectedIndex];

    const LATIN_TO_CYR = {
      'a': ['а'], 'b': ['б', 'в'], 'c': ['ц', 'ч', 'с'], 'd': ['д'],
      'e': ['э', 'е', 'ё'], 'f': ['ф'], 'g': ['г'], 'h': ['х', 'г'],
      'i': ['и', 'й', 'ы'], 'j': ['ж', 'й', 'дз'], 'k': ['к', 'х'],
      'l': ['л'], 'm': ['м'], 'n': ['н'], 'o': ['о', 'ө', 'ё'],
      'p': ['п'], 'q': ['к'], 'r': ['р'], 's': ['с', 'ш', 'щ'],
      't': ['т'], 'u': ['у', 'ү'], 'v': ['в'], 'w': ['в'],
      'x': ['х', 'ч'], 'y': ['й', 'ы', 'я', 'ю'], 'z': ['з', 'ж']
    };

    const QWERTY_CYRILLIC_PHYSICAL = {
      'q': 'й', 'w': 'ц', 'e': 'у', 'r': 'к', 't': 'е', 'y': 'н', 'u': 'г', 'i': 'ш', 'o': 'щ', 'p': 'з',
      '[': 'х', ']': 'ъ', 'a': 'ф', 's': 'ы', 'd': 'в', 'f': 'а', 'g': 'п', 'h': 'р', 'j': 'о', 'k': 'л',
      'l': 'д', ';': 'ж', "'": 'э', 'z': 'я', 'x': 'ч', 'c': 'с', 'v': 'м', 'b': 'и', 'n': 'т', 'm': 'ь'
    };

    const availableTiles = this.state.candidateTiles.filter(t => !t.isUsed);
    if (availableTiles.length === 0) return null;

    if (expectedChar) {
      if (keyChar === expectedChar) {
        const direct = availableTiles.find(t => t.char === expectedChar);
        if (direct) return direct;
      }
      const mappedExpected = LATIN_TO_CYR[keyChar] || [];
      if (mappedExpected.includes(expectedChar)) {
        const phonetic = availableTiles.find(t => t.char === expectedChar);
        if (phonetic) return phonetic;
      }
      const qwertyExpected = QWERTY_CYRILLIC_PHYSICAL[keyChar];
      if (qwertyExpected === expectedChar) {
        const qwMatch = availableTiles.find(t => t.char === expectedChar);
        if (qwMatch) return qwMatch;
      }
    }

    const directAny = availableTiles.find(t => t.char === keyChar);
    if (directAny) return directAny;

    const possibleCyrs = LATIN_TO_CYR[keyChar] || [];
    for (const cyr of possibleCyrs) {
      const match = availableTiles.find(t => t.char === cyr);
      if (match) return match;
    }

    const qwertyChar = QWERTY_CYRILLIC_PHYSICAL[keyChar];
    if (qwertyChar) {
      const qwMatch = availableTiles.find(t => t.char === qwertyChar);
      if (qwMatch) return qwMatch;
    }

    return null;
  }

  static resolveLatinCharToCyrillic(latinKey, e = null) {
    if (!latinKey) return null;
    latinKey = latinKey.toLowerCase();

    const expectedIndex = this.state.typedLetters.length;
    const expectedChar = this.state.targetLetters[expectedIndex];

    const LATIN_TO_CYR = {
      'a': ['а'], 'b': ['б', 'в'], 'c': ['ц', 'ч', 'с'], 'd': ['д'],
      'e': ['э', 'е', 'ё'], 'f': ['ф'], 'g': ['г'], 'h': ['х', 'г'],
      'i': ['и', 'й', 'ы'], 'j': ['ж', 'й'], 'k': ['к', 'х'],
      'l': ['л'], 'm': ['м'], 'n': ['н'], 'o': ['о', 'ө', 'ё'],
      'p': ['п'], 'q': ['к'], 'r': ['р'], 's': ['с', 'ш', 'щ'],
      't': ['т'], 'u': ['у', 'ү'], 'v': ['в'], 'w': ['в'],
      'x': ['х', 'ч'], 'y': ['й', 'ы', 'я', 'ю'], 'z': ['з', 'ж']
    };

    const candidates = LATIN_TO_CYR[latinKey] || [];
    if (expectedChar && candidates.includes(expectedChar)) {
      return expectedChar;
    }
    return candidates[0] || null;
  }

  // ==========================================
  // タイル操作と回答判定（部分更新でチカチカゼロ）
  // ==========================================
  static onTileClicked(tileId, char) {
    if (this.state.hasAnswered) return;
    if (this.state.placedLetters.length >= this.state.targetLetters.length) return;

    const tile = this.state.candidateTiles.find(t => t.id === tileId);
    if (!tile || tile.isUsed) return;

    tile.isUsed = true;
    this.state.placedLetters.push({ tileId, char });
    try {
      SoundEffects.playTile();
    } catch (_) {}

    // チカチカ防止：スロットとタイルのみを部分更新
    this.updateSlotsAndTilesOnly();

    if (this.state.placedLetters.length === this.state.targetLetters.length) {
      this.checkArrangeAnswer();
    }
  }

  static onSlotClicked(index) {
    if (this.state.hasAnswered || this.state.mode !== 'tile_arrange') return;
    if (index < 0 || index >= this.state.placedLetters.length) return;

    const removed = this.state.placedLetters.splice(index, 1)[0];
    if (removed) {
      const tile = this.state.candidateTiles.find(t => t.id === removed.tileId);
      if (tile) tile.isUsed = false;
    }
    this.updateSlotsAndTilesOnly();
  }

  static popLastPlacedTile() {
    if (this.state.placedLetters.length === 0) return;
    const removed = this.state.placedLetters.pop();
    if (removed) {
      const tile = this.state.candidateTiles.find(t => t.id === removed.tileId);
      if (tile) tile.isUsed = false;
    }
    this.updateSlotsAndTilesOnly();
  }

  static clearPlacedTiles() {
    this.state.placedLetters = [];
    this.state.candidateTiles.forEach(t => t.isUsed = false);
    this.updateSlotsAndTilesOnly();
  }

  static applyHint() {
    if (this.state.hasAnswered) return;
    const currentLen = this.state.placedLetters.length;
    if (currentLen >= this.state.targetLetters.length) return;

    const nextChar = this.state.targetLetters[currentLen];
    const availableTile = this.state.candidateTiles.find(t => !t.isUsed && t.char === nextChar);

    if (availableTile) {
      this.state.hintsUsed++;
      this.onTileClicked(availableTile.id, availableTile.char);
    }
  }

  static checkArrangeAnswer() {
    const placedStr = this.state.placedLetters.map(p => p.char).join('');
    const targetStr = this.state.targetLetters.join('');

    if (placedStr === targetStr) {
      this.onCorrectAnswer();
    } else {
      this.onWrongAnswer();
    }
  }

  static onFreeCharTyped(char) {
    if (this.state.hasAnswered) return;
    if (this.state.typedLetters.length >= this.state.targetLetters.length) return;

    this.state.typedLetters.push(char);
    try {
      SoundEffects.playTile();
    } catch (_) {}
    this.updateSlotsAndTilesOnly();

    if (this.state.typedLetters.length === this.state.targetLetters.length) {
      this.verifyFreeTypeAnswer();
    }
  }

  static verifyFreeTypeAnswer() {
    const typedStr = this.state.typedLetters.join('');
    const targetStr = this.state.targetLetters.join('');

    if (typedStr === targetStr) {
      this.onCorrectAnswer();
    } else {
      this.onWrongAnswer();
    }
  }

  // ==========================================
  // 正解・誤答・タイムアウト（演出）
  // ==========================================
  static onCorrectAnswer() {
    this.stopFallTimer();
    this.state.hasAnswered = true;
    this.state.isMistake = false;
    this.state.combo++;
    if (this.state.combo > this.state.maxCombo) {
      this.state.maxCombo = this.state.combo;
    }

    // スコア加算
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
      this.state.fullness = 0;
      this.state.score += 50;
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

    // レーザー発射＆魚ヒット演出
    this.state.isLaserShooting = true;
    this.state.isFishHit = true;
    this.state.mascotMood = 'happy';
    this.state.mascotMessage = `⚡ ズキューン！命中！お魚を撃ち落としたよ！ (+${pts} pt)`;

    try {
      SoundEffects.playCorrect();
    } catch (_) {}

    this.renderUI();

    // 400ms後: レーザー終了、魚がペンギンへ落下・捕食
    setTimeout(() => {
      this.state.isLaserShooting = false;
      this.state.isFishHit = false;
      this.state.isFishCaught = true;
      this.state.isFeeding = true;
      this.state.mascotMood = isFever ? 'celebrate' : 'happy';
      this.state.mascotMessage = isFever 
        ? '🎉 満腹フィーバー！！ペンギン大満足！ボーナス +50 XP！' 
        : `モグモグ！美味しい！！ амттай байна! 🐟😋 (+${pts} pt)`;

      try {
        SoundEffects.playMunch();
      } catch (_) {}

      try {
        SpeechService.speak(this.state.currentWord.mongolian, { rate: 0.9 });
      } catch (_) {}

      this.renderUI();

      // 1.5秒後に次の問題へ
      setTimeout(() => {
        this.nextWord();
      }, 1500);
    }, 450);

    // 履歴追加
    this.state.answeredLog.push({
      word: this.state.currentWord,
      isCorrect: true,
      userAnswer: this.state.targetLetters.join('')
    });
  }

  static onWrongAnswer() {
    this.state.isMistake = true;
    this.state.combo = 0;
    this.state.mascotMood = 'sad';
    this.state.mascotMessage = 'うーん、惜しい！文字を直してもう一度！🐧';
    try {
      SoundEffects.playWrong();
    } catch (_) {}
    
    const msgEl = this.container?.querySelector('#penguin-mascot-msg');
    if (msgEl) msgEl.textContent = this.state.mascotMessage;
    const svgEl = this.container?.querySelector('#penguin-svg-wrapper');
    if (svgEl) svgEl.innerHTML = PenguinMascot.renderSVG('sad', 54);

    setTimeout(() => {
      if (this.state.isMistake && this.state.placedLetters.length > 0) {
        this.popLastPlacedTile();
      }
    }, 450);
  }

  static onFishEscaped() {
    this.state.hasAnswered = true;
    this.state.isFishEscaped = true;
    this.state.combo = 0;
    this.state.mascotMood = 'sad';
    const correctWord = this.state.targetLetters.join('');
    this.state.mascotMessage = `ああっ…逃げちゃった！💦 正解は「${correctWord}」だよ！`;

    try {
      SoundEffects.playWrong();
    } catch (_) {}

    this.state.answeredLog.push({
      word: this.state.currentWord,
      isCorrect: false,
      userAnswer: '（時間切れ）'
    });

    this.renderUI();

    // 2秒後に次の問題へ
    setTimeout(() => {
      this.nextWord();
    }, 2000);
  }

  static nextWord() {
    this.state.currentIndex++;
    if (this.state.currentIndex < this.state.questions.length) {
      this.loadCurrentWord();
      this.renderUI();
    } else {
      this.showResult();
    }
  }

  // ==========================================
  // 結果発表画面
  // ==========================================
  static showResult() {
    this.stopFallTimer();
    this.state.view = 'result';
    if (this.keydownHandler) {
      window.removeEventListener('keydown', this.keydownHandler);
      this.keydownHandler = null;
    }
    this.renderResultUI();
  }

  static renderResultUI() {
    if (!this.container) return;
    const { score, fishFedCount, maxCombo, answeredLog } = this.state;
    const totalQ = answeredLog.length;
    const correctCount = answeredLog.filter(l => l.isCorrect).length;
    const accuracy = totalQ > 0 ? Math.round((correctCount / totalQ) * 100) : 0;

    this.container.innerHTML = `
      <div class="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <div class="bg-white rounded-3xl border-2 border-sky-300 p-6 sm:p-8 shadow-xl text-center space-y-5">
          
          <div class="space-y-2">
            <span class="text-5xl">🐟🎉</span>
            <h3 class="text-2xl font-black text-slate-800">スペルシューター 結果発表！</h3>
            <p class="text-xs text-slate-500">お魚を撃ち落としてペンギンにご飯をたくさんあげられました！</p>
          </div>

          <!-- スコア概要 -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div class="bg-sky-50 rounded-2xl p-3 border border-sky-200">
              <div class="text-[10px] font-bold text-sky-600">総合スコア</div>
              <div class="text-2xl font-black text-sky-800">${score} pt</div>
            </div>
            <div class="bg-amber-50 rounded-2xl p-3 border border-amber-200">
              <div class="text-[10px] font-bold text-amber-600">あげたお魚</div>
              <div class="text-2xl font-black text-amber-800">${fishFedCount} 匹</div>
            </div>
            <div class="bg-emerald-50 rounded-2xl p-3 border border-emerald-200">
              <div class="text-[10px] font-bold text-emerald-600">正解率</div>
              <div class="text-2xl font-black text-emerald-800">${accuracy}%</div>
            </div>
            <div class="bg-purple-50 rounded-2xl p-3 border border-purple-200">
              <div class="text-[10px] font-bold text-purple-600">最大コンボ</div>
              <div class="text-2xl font-black text-purple-800">${maxCombo}</div>
            </div>
          </div>

          <!-- マスコットコメント -->
          <div class="bg-gradient-to-r from-sky-100 to-cyan-100 rounded-2xl p-4 flex items-center gap-4 text-left border border-sky-200">
            <div class="w-16 h-16 shrink-0 flex items-center justify-center">
              ${PenguinMascot.renderSVG(accuracy >= 80 ? 'celebrate' : 'happy', 60)}
            </div>
            <div>
              <div class="text-xs font-black text-sky-900">
                ${accuracy >= 80 ? '🌟 すごい腕前！ペンギンも大喜び！' : '👍 ナイスファイト！いっぱいお魚を食べられたよ！'}
              </div>
              <p class="text-xs text-sky-800 mt-0.5 leading-relaxed">
                落ちてくる前に正しくスペルを入力することで、モンゴル語のキリル文字が指と頭にしっかり定着します！
              </p>
            </div>
          </div>

          <!-- 単語レビュー一覧 -->
          <div class="space-y-2 text-left">
            <h4 class="text-xs font-black text-slate-700 uppercase tracking-wider">今回の単語振り返り</h4>
            <div class="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden max-h-56 overflow-y-auto">
              ${answeredLog.map(item => `
                <div class="p-3 bg-slate-50 flex items-center justify-between text-xs">
                  <div class="flex items-center gap-2">
                    <span class="${item.isCorrect ? 'text-emerald-600' : 'text-rose-600'} font-black text-base">
                      ${item.isCorrect ? '✓' : '✗'}
                    </span>
                    <div>
                      <div class="font-bold font-mono text-slate-800 text-sm">${item.word.mongolian}</div>
                      <div class="text-slate-500 text-[11px]">${item.word.japanese}</div>
                    </div>
                  </div>
                  <button type="button" class="btn-review-audio p-1.5 text-slate-400 hover:text-sky-600 rounded-lg transition-all" data-text="${item.word.mongolian}">
                    🔊
                  </button>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- アクションボタン -->
          <div class="flex items-center gap-3 pt-2">
            <button type="button" id="btn-replay" class="flex-1 py-3.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-black text-sm rounded-xl shadow-md transition-all active:scale-98">
              もう一度あそぶ 🔄
            </button>
            <button type="button" id="btn-result-home" class="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-sm rounded-xl transition-all">
              ホームへ戻る 🏠
            </button>
          </div>
        </div>
      </div>
    `;

    const btnReplay = this.container.querySelector('#btn-replay');
    if (btnReplay) {
      btnReplay.addEventListener('click', () => {
        this.initGame(false);
      });
    }

    const btnHome = this.container.querySelector('#btn-result-home');
    if (btnHome) {
      btnHome.addEventListener('click', () => {
        if (this.onNavigate) this.onNavigate('home');
      });
    }

    const audioBtns = this.container.querySelectorAll('.btn-review-audio');
    audioBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const text = btn.dataset.text;
        if (text) SpeechService.speak(text, { rate: 0.9 });
      });
    });
  }
}
