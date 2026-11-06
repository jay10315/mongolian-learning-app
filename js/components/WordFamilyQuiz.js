// 類義語・対義語・語根ファミリー 総合ゲーム＆学習コンポーネント
import { StorageService } from '../services/storage.js';
import { wordFamilyData } from '../data/wordFamilyData.js';
import { SpeechService } from '../services/speech.js';
import { SoundEffects, shuffleArray } from '../utils/helpers.js';
import { GamificationService } from '../services/gamification.js';
import { PenguinMascot } from './PenguinMascot.js';

export class WordFamilyComponent {
  static container = null;
  static onNavigate = null;

  static state = {
    activeTab: 'game_antonym', // 'game_antonym' | 'game_synonym' | 'game_family' | 'study_cards'
    
    // 対義語マッチングゲーム用ステート
    antonymGame: {
      pairs: [],
      cards: [], // { id, pairId, text, subText, isSelected, isMatched }
      selectedCardId: null,
      matchedCount: 0,
      totalPairs: 5,
      combo: 0,
      startTime: null,
      isCleared: false,
      clearSeconds: 0
    },

    // 類義語ニュアンスクイズ用ステート
    synonymGame: {
      questions: [],
      currentIndex: 0,
      currentQ: null,
      hasAnswered: false,
      selectedChoiceIndex: null,
      score: 0,
      streak: 0,
      isFinished: false
    },

    // 語根ファミリービルドクイズ用ステート
    familyGame: {
      quizzes: [],
      currentIndex: 0,
      currentQuiz: null,
      hasAnswered: false,
      selectedSuffix: null,
      score: 0,
      isFinished: false
    },

    // 図鑑・学習用タブステート
    studyTab: 'antonyms', // 'antonyms' | 'synonyms' | 'families'
    studyFilter: 'all',
    searchQuery: ''
  };

  static render(container, onNavigate) {
    this.container = container;
    this.onNavigate = onNavigate;
    this.initGames();
    this.renderMain();
  }

  // ==========================================
  // ゲームの初期化
  // ==========================================
  static initGames() {
    this.initAntonymGame();
    this.initSynonymGame();
    this.initFamilyGame();
  }

  // 1. 対義語マッチングゲーム初期化
  static initAntonymGame() {
    const all = wordFamilyData.antonyms;
    const chosenPairs = shuffleArray([...all]).slice(0, 5); // 1ラウンド5組（10枚）
    const cards = [];

    chosenPairs.forEach((pair, pIdx) => {
      // カードA
      cards.push({
        id: `c_${pIdx}_A`,
        pairId: pair.id,
        text: pair.wordA,
        subText: pair.meaningA,
        example: pair.exampleA,
        isSelected: false,
        isMatched: false
      });
      // カードB
      cards.push({
        id: `c_${pIdx}_B`,
        pairId: pair.id,
        text: pair.wordB,
        subText: pair.meaningB,
        example: pair.exampleB,
        isSelected: false,
        isMatched: false
      });
    });

    this.state.antonymGame = {
      pairs: chosenPairs,
      cards: shuffleArray(cards),
      selectedCardId: null,
      matchedCount: 0,
      totalPairs: chosenPairs.length,
      combo: 0,
      startTime: Date.now(),
      isCleared: false,
      clearSeconds: 0
    };
  }

  // 2. 類義語クイズ初期化
  static initSynonymGame() {
    const list = shuffleArray([...wordFamilyData.synonyms]);
    this.state.synonymGame = {
      questions: list,
      currentIndex: 0,
      currentQ: list[0] || null,
      hasAnswered: false,
      selectedChoiceIndex: null,
      score: 0,
      streak: 0,
      isFinished: false
    };
  }

  // 3. 語根ファミリービルドクイズ初期化
  static initFamilyGame() {
    // 語根ファミリーから派生語クイズプールを作成
    const quizzes = [];
    wordFamilyData.wordFamilies.forEach(fam => {
      fam.derivatives.forEach(drv => {
        // 接尾辞が '-' で始まらないもの（基本語幹そのもの等）はビルドクイズから除外
        if (!drv.suffix || !drv.suffix.trim().startsWith('-')) return;
        const cleanRoot = fam.root.replace(/-/g, '').trim().toLowerCase();
        if (drv.word.trim().toLowerCase() === cleanRoot) return;

        // ダミー接尾辞を他から集める
        const dummyPool = ['-эх', '-ах', '-эгч', '-агч', '-эсгэлэн', '-дал', '-лэг', '-лт', '-уулах', '-гдэх', '-хон', '-лал', '-лэл', '-хөн', '-үүлбэр'];
        const correctSuffix = drv.suffix.trim().split(/\s+/)[0];
        const dists = dummyPool.filter(s => s !== correctSuffix);
        const options = shuffleArray([correctSuffix, ...shuffleArray(dists).slice(0, 3)]);

        quizzes.push({
          family: fam,
          root: fam.root,
          rootMeaning: fam.meaning,
          targetWord: drv.word,
          targetMeaning: drv.meaning,
          correctSuffix: correctSuffix,
          fullSuffixDesc: drv.suffix,
          note: drv.note,
          options: options
        });
      });
    });

    const shuffled = shuffleArray(quizzes).slice(0, 8); // 1ラウンド8問
    this.state.familyGame = {
      quizzes: shuffled,
      currentIndex: 0,
      currentQuiz: shuffled[0] || null,
      hasAnswered: false,
      selectedSuffix: null,
      score: 0,
      isFinished: false
    };
  }

  // ==========================================
  // メイン画面レンダリング
  // ==========================================
  static renderMain() {
    if (!this.container) return;
    const { activeTab } = this.state;

    this.container.innerHTML = `
      <div class="animate-fade-in max-w-4xl mx-auto px-4 py-4 space-y-4">
        
        <!-- ヘッダーバー -->
        <div class="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-2">
            <button type="button" id="btn-wf-back" class="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer" title="ホームへ戻る">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
            </button>
            <div>
              <h2 class="text-base sm:text-lg font-black text-slate-800 flex items-center gap-1.5">
                <span>🌳</span>
                <span>類義語・対義語・語根ゲーム</span>
              </h2>
              <p class="text-[11px] text-slate-500 font-medium">反対語ペア・ニュアンス使い分け・語根派生パズルで語彙倍増！</p>
            </div>
          </div>

          <!-- ナビゲーションタブ（ゲーム3種 ＋ 図鑑） -->
          <div class="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold flex-wrap gap-1">
            <button type="button" class="tab-btn px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'game_antonym' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }" data-tab="game_antonym">
              ⚡ 対義語マッチ
            </button>
            <button type="button" class="tab-btn px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'game_synonym' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }" data-tab="game_synonym">
              🎯 類義語クイズ
            </button>
            <button type="button" class="tab-btn px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'game_family' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }" data-tab="game_family">
              🌳 語根ビルド
            </button>
            <button type="button" class="tab-btn px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'study_cards' ? 'bg-slate-800 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }" data-tab="study_cards">
              📖 図鑑・一覧
            </button>
          </div>
        </div>

        <!-- アクティブコンテンツ領域 -->
        <div id="wf-content-area">
          ${this.renderActiveContent()}
        </div>

      </div>
    `;

    this.bindMainEvents();
  }

  static renderActiveContent() {
    switch (this.state.activeTab) {
      case 'game_antonym':
        return this.renderAntonymGameUI();
      case 'game_synonym':
        return this.renderSynonymGameUI();
      case 'game_family':
        return this.renderFamilyGameUI();
      case 'study_cards':
        return this.renderStudyUI();
      default:
        return this.renderAntonymGameUI();
    }
  }

  // ==========================================
  // ゲーム①：対義語スピードマッチング UI ＆ ロジック
  // ==========================================
  static renderAntonymGameUI() {
    const { cards, pairs, matchedCount, totalPairs, combo, isCleared, clearSeconds } = this.state.antonymGame;

    if (isCleared) {
      return `
        <div class="bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-6 sm:p-8 text-white text-center shadow-xl space-y-4 animate-scale-up">
          <div class="flex justify-center transform scale-110">
            ${PenguinMascot.getSvg({ mood: 'celebrate', size: 100 })}
          </div>
          <div class="space-y-1">
            <span class="text-xs bg-white/20 text-white font-black px-3 py-1 rounded-full uppercase">ALL PAIRS MATCHED!</span>
            <h3 class="text-2xl sm:text-3xl font-black text-yellow-100">対義語全ペア制覇！！✨</h3>
            <p class="text-xs text-amber-100">クリアタイム: <span class="font-black text-sm">${clearSeconds} 秒</span> ｜ 獲得: +35 XP</p>
          </div>

          <!-- 今回のペア振り返り -->
          <div class="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-left border border-white/20 max-w-md mx-auto space-y-2">
            <div class="text-xs font-black text-amber-200 uppercase tracking-wider">今回マッチングした対義語ペア（復習）:</div>
            <div class="divide-y divide-white/10 text-xs">
              ${(pairs || []).map(p => `
                <div class="py-1.5 flex items-center justify-between">
                  <div>
                    <span class="font-black cyrillic-text text-white">${p.wordA}</span>
                    <span class="text-[10px] text-amber-100 ml-1">(${p.meaningA})</span>
                  </div>
                  <span class="text-amber-200 text-xs px-1.5">↔</span>
                  <div class="text-right">
                    <span class="font-black cyrillic-text text-white">${p.wordB}</span>
                    <span class="text-[10px] text-amber-100 ml-1">(${p.meaningB})</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
          <div class="pt-2 flex justify-center gap-3">
            <button type="button" id="btn-antonym-replay" class="px-6 py-2.5 rounded-xl bg-white text-slate-900 font-black text-sm shadow-md active:scale-95 transition-all">
              🔄 もう1ラウンド遊ぶ
            </button>
          </div>
        </div>
      `;
    }

    return `
      <div class="space-y-4">
        <!-- ゲーム情報バー -->
        <div class="bg-gradient-to-r from-amber-50 to-orange-50 p-3.5 rounded-2xl border border-amber-200/80 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-xl">⚡</span>
            <div>
              <div class="text-xs font-black text-amber-950">対義語スピードマッチング</div>
              <div class="text-[11px] text-amber-800 font-medium">対になる「反対語カード」を2枚タップ！正解するとその場で捲れて和訳が出現するよ！</div>
            </div>
          </div>
          <div class="flex items-center gap-2 text-xs">
            <span class="px-2.5 py-1 rounded-full bg-white font-black text-amber-900 border border-amber-300 shadow-2xs">
              残り: ${totalPairs - matchedCount} / ${totalPairs} ペア
            </span>
            ${combo >= 2 ? `<span class="px-2 py-0.5 rounded-full bg-amber-500 text-white font-black text-[10px] animate-pulse">${combo} コンボ！</span>` : ''}
          </div>
        </div>

        <!-- カードグリッド（10枚） -->
        <div class="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3">
          ${cards.map(card => `
            <button type="button" class="antonym-card p-3 sm:p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center text-center shadow-xs min-h-[96px] ${
              card.isMatched
                ? 'bg-emerald-50 border-emerald-400 text-emerald-950 shadow-xs ring-2 ring-emerald-300/60 scale-100 cursor-pointer hover:bg-emerald-100/70'
                : card.isSelected
                  ? 'bg-amber-400 border-amber-500 text-slate-950 shadow-md ring-4 ring-amber-300/50 scale-102 cursor-pointer'
                  : 'bg-white hover:bg-amber-50/50 border-slate-200 hover:border-amber-400 text-slate-800 cursor-pointer active:scale-95'
            }" data-card-id="${card.id}" title="${card.isMatched ? 'タップで音声を再生' : ''}">
              ${card.isMatched ? `
                <div class="animate-fadeIn flex flex-col items-center justify-center space-y-1 w-full">
                  <span class="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-0.5">
                    <span>✔</span> 成立
                  </span>
                  <span class="text-base sm:text-lg font-black cyrillic-text leading-tight text-emerald-950">${card.text}</span>
                  <span class="text-xs sm:text-sm font-bold text-emerald-700 leading-tight">${card.subText}</span>
                </div>
              ` : `
                <span class="text-base sm:text-xl font-black cyrillic-text leading-snug">${card.text}</span>
              `}
            </button>
          `).join('')}
        </div>
      </div>
    `;
  }

  static onAntonymCardClick(cardId) {
    const { antonymGame } = this.state;
    if (antonymGame.isCleared) return;

    const clickedCard = antonymGame.cards.find(c => c.id === cardId);
    if (!clickedCard) return;

    // 既に正解・捲れたカードをタップした時は発音を再生
    if (clickedCard.isMatched) {
      SpeechService.speak(clickedCard.text, { rate: 0.9 });
      return;
    }

    // 音声発音
    SpeechService.speak(clickedCard.text, { rate: 0.9 });
    SoundEffects.playTile();

    if (!antonymGame.selectedCardId) {
      // 1枚目選択
      antonymGame.selectedCardId = cardId;
      clickedCard.isSelected = true;
      this.renderMain();
      return;
    }

    if (antonymGame.selectedCardId === cardId) {
      // 同じカードを再タップで選択解除
      clickedCard.isSelected = false;
      antonymGame.selectedCardId = null;
      this.renderMain();
      return;
    }

    // 2枚目選択 -> マッチ判定
    const firstCard = antonymGame.cards.find(c => c.id === antonymGame.selectedCardId);
    clickedCard.isSelected = true;
    this.renderMain();

    if (firstCard && firstCard.pairId === clickedCard.pairId) {
      // 正解！ペア成立
      SoundEffects.playCorrect();
      antonymGame.combo++;
      antonymGame.matchedCount++;
      try {
      if (typeof GamificationService !== 'undefined' && typeof GamificationService.addXp === 'function') {
        GamificationService.addXp(10);
      }
    } catch (e) {
      console.warn('GamificationService.addXp error:', e);
    }

      setTimeout(() => {
        firstCard.isMatched = true;
        firstCard.isSelected = false;
        clickedCard.isMatched = true;
        clickedCard.isSelected = false;
        antonymGame.selectedCardId = null;

        if (antonymGame.matchedCount >= antonymGame.totalPairs) {
          // 全ペア成立後、最後のカードが捲れた状態を見せてからクリア画面へ移行
          this.renderMain();
          setTimeout(() => {
            antonymGame.isCleared = true;
            antonymGame.clearSeconds = Math.round((Date.now() - antonymGame.startTime) / 1000);
            try {
              if (typeof GamificationService !== 'undefined' && typeof GamificationService.addXp === 'function') {
                GamificationService.addXp(35);
              }
            } catch (e) {
              console.warn('GamificationService.addXp error:', e);
            }
            SoundEffects.playLevelUp();
            this.renderMain();
          }, 850);
        } else {
          this.renderMain();
        }
      }, 350);

    } else {
      // 不正解
      SoundEffects.playWrong();
      antonymGame.combo = 0;
      setTimeout(() => {
        if (firstCard) firstCard.isSelected = false;
        if (clickedCard) clickedCard.isSelected = false;
        antonymGame.selectedCardId = null;
        this.renderMain();
      }, 700);
    }
  }

  // ==========================================
  // ゲーム②：類義語シチュエーションクイズ UI ＆ ロジック
  // ==========================================
  static renderSynonymGameUI() {
    const { questions, currentIndex, currentQ, hasAnswered, selectedChoiceIndex, score, streak, isFinished } = this.state.synonymGame;

    if (isFinished || !currentQ) {
      return `
        <div class="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 rounded-3xl p-6 sm:p-8 text-white text-center shadow-xl space-y-4 animate-scale-up">
          <div class="flex justify-center transform scale-110">
            ${PenguinMascot.getSvg({ mood: 'celebrate', size: 100 })}
          </div>
          <div class="space-y-1">
            <span class="text-xs bg-white/20 text-white font-black px-3 py-1 rounded-full uppercase">ROUND COMPLETE</span>
            <h3 class="text-2xl sm:text-3xl font-black text-indigo-100">類義語ニュアンスマスター！🎯</h3>
            <p class="text-xs text-indigo-200">スコア: <span class="font-black text-amber-300 text-sm">${score} pt</span> ｜ 正解数: ${score / 15} / ${questions.length} 問</p>
          </div>
          <div class="pt-2 flex justify-center gap-3">
            <button type="button" id="btn-synonym-replay" class="px-6 py-2.5 rounded-xl bg-white text-slate-900 font-black text-sm shadow-md active:scale-95 transition-all">
              🔄 もう1ラウンド挑戦
            </button>
          </div>
        </div>
      `;
    }

    return `
      <div class="space-y-4">
        <!-- 進行度ヘッダー -->
        <div class="bg-indigo-50 p-3.5 rounded-2xl border border-indigo-200 flex items-center justify-between text-xs">
          <div class="flex items-center gap-2">
            <span class="text-lg">🎯</span>
            <div>
              <div class="font-black text-indigo-950">類義語シチュエーション使い分けクイズ</div>
              <div class="text-[11px] text-indigo-700 font-medium">文脈や場面に最もふさわしい単語を選ぼう！</div>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-1 rounded-full bg-white font-black text-indigo-900 border border-indigo-300">
              第 ${currentIndex + 1} / ${questions.length} 問
            </span>
            <span class="px-2.5 py-1 rounded-full bg-indigo-600 text-white font-black">
              ${score} pt
            </span>
          </div>
        </div>

        <!-- 問題カード -->
        <div class="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-4 text-center">
          
          <div class="inline-block px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-black">
            テーマ: ${currentQ.title}
          </div>

          <h3 class="text-lg sm:text-xl font-black text-slate-800 max-w-xl mx-auto leading-snug">
            Q. ${currentQ.question}
          </h3>

          <!-- 3択選択肢 -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            ${currentQ.options.map((opt, idx) => {
              let btnClass = "bg-slate-50 hover:bg-indigo-50/50 border-slate-200 hover:border-indigo-400 text-slate-800";
              if (hasAnswered) {
                if (idx === currentQ.correctIndex) {
                  btnClass = "bg-emerald-500 border-emerald-600 text-white font-black shadow-md scale-102";
                } else if (idx === selectedChoiceIndex) {
                  btnClass = "bg-rose-500 border-rose-600 text-white font-bold animate-shake";
                } else {
                  btnClass = "bg-slate-50 border-slate-200 text-slate-400 opacity-60";
                }
              }
              return `
                <button type="button" class="synonym-choice-btn p-4 rounded-2xl border-2 font-black text-base sm:text-lg cyrillic-text transition-all active:scale-95 shadow-xs cursor-pointer ${btnClass}" data-choice-idx="${idx}" ${hasAnswered ? 'disabled' : ''}>
                  ${opt}
                </button>
              `;
            }).join('')}
          </div>

          <!-- 回答後解説パネル -->
          ${hasAnswered ? `
            <div class="mt-4 p-4 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 text-left space-y-2 animate-fade-in text-xs">
              <div class="font-bold text-indigo-900 flex items-center gap-1.5 text-sm">
                <span>💡</span>
                <span>解説 ＆ ニュアンス使い分け</span>
              </div>
              <p class="text-slate-700 leading-relaxed font-medium">
                ${currentQ.explanation}
              </p>
              <div class="border-t border-indigo-200/60 pt-2 space-y-1">
                ${currentQ.words.map(w => `
                  <div class="flex items-center gap-2">
                    <button type="button" class="btn-play-word-audio text-indigo-600 hover:text-indigo-800 font-bold" data-word="${w.word}">🔊</button>
                    <span class="font-extrabold text-indigo-950 cyrillic-text">${w.word}</span>:
                    <span class="text-slate-600">${w.meaning}</span>
                  </div>
                `).join('')}
              </div>
              <div class="pt-2 text-right">
                <button type="button" id="btn-synonym-next" class="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-md active:scale-95 transition-all">
                  次の問題へ →
                </button>
              </div>
            </div>
          ` : ''}

        </div>
      </div>
    `;
  }

  static onSynonymChoice(idx) {
    const { synonymGame } = this.state;
    if (synonymGame.hasAnswered || !synonymGame.currentQ) return;

    synonymGame.hasAnswered = true;
    synonymGame.selectedChoiceIndex = idx;
    const isCorrect = idx === synonymGame.currentQ.correctIndex;

    const chosenWord = synonymGame.currentQ.options[idx];
    if (chosenWord) SpeechService.speak(chosenWord, { rate: 0.9 });

    if (isCorrect) {
      SoundEffects.playCorrect();
      synonymGame.score += 15;
      synonymGame.streak++;
      try {
      if (typeof GamificationService !== 'undefined' && typeof GamificationService.addXp === 'function') {
        GamificationService.addXp(15);
      }
    } catch (e) {
      console.warn('GamificationService.addXp error:', e);
    }
    } else {
      SoundEffects.playWrong();
      synonymGame.streak = 0;
      try {
        const targetQ = synonymGame.currentQ;
        const correctWord = targetQ.correctWord || (targetQ.options && targetQ.options[targetQ.correctIndex]);
        StorageService.recordMistake({
          question: `【類義語】${targetQ.targetWordJa ? `${targetQ.targetWordJa}（${targetQ.targetWord}）の類義語` : `${targetQ.targetWord} の類義語`}`,
          userAnswer: chosenWord || '(未選択)',
          correctAnswer: correctWord,
          type: 'word_family',
          category: '類義語・語根',
          explanation: targetQ.explanation || ''
        });
      } catch (_) {}
    }

    this.renderMain();
  }

  static nextSynonymQuestion() {
    const { synonymGame } = this.state;
    synonymGame.currentIndex++;
    if (synonymGame.currentIndex >= synonymGame.questions.length) {
      synonymGame.isFinished = true;
      SoundEffects.playLevelUp();
    } else {
      synonymGame.currentQ = synonymGame.questions[synonymGame.currentIndex];
      synonymGame.hasAnswered = false;
      synonymGame.selectedChoiceIndex = null;
    }
    this.renderMain();
  }

  // ==========================================
  // ゲーム③：語根ファミリービルドクイズ UI ＆ ロジック
  // ==========================================
  static renderFamilyGameUI() {
    const { quizzes, currentIndex, currentQuiz, hasAnswered, selectedSuffix, score, isFinished } = this.state.familyGame;

    if (isFinished || !currentQuiz) {
      return `
        <div class="bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-800 rounded-3xl p-6 sm:p-8 text-white text-center shadow-xl space-y-4 animate-scale-up">
          <div class="flex justify-center transform scale-110">
            ${PenguinMascot.getSvg({ mood: 'celebrate', size: 100 })}
          </div>
          <div class="space-y-1">
            <span class="text-xs bg-white/20 text-white font-black px-3 py-1 rounded-full uppercase">ROOT BUILDER FINISHED</span>
            <h3 class="text-2xl sm:text-3xl font-black text-emerald-100">語根ビルドマスター！！🌳</h3>
            <p class="text-xs text-emerald-200">スコア: <span class="font-black text-yellow-300 text-sm">${score} pt</span> ｜ 獲得: +30 XP</p>
          </div>
          <div class="pt-2 flex justify-center gap-3">
            <button type="button" id="btn-family-replay" class="px-6 py-2.5 rounded-xl bg-white text-slate-900 font-black text-sm shadow-md active:scale-95 transition-all">
              🔄 もう1ラウンド遊ぶ
            </button>
          </div>
        </div>
      `;
    }

    return `
      <div class="space-y-4">
        <!-- 進行度ヘッダー -->
        <div class="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-200 flex items-center justify-between text-xs">
          <div class="flex items-center gap-2">
            <span class="text-lg">🌳</span>
            <div>
              <div class="font-black text-emerald-950">語根ファミリー・パーツ組み立てパズル</div>
              <div class="text-[11px] text-emerald-700 font-medium">語根にぴったりの接尾辞を組み合わせて単語を作ろう！</div>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-1 rounded-full bg-white font-black text-emerald-900 border border-emerald-300">
              第 ${currentIndex + 1} / ${quizzes.length} 問
            </span>
            <span class="px-2.5 py-1 rounded-full bg-emerald-600 text-white font-black">
              ${score} pt
            </span>
          </div>
        </div>

        <!-- 組み立てステージカード -->
        <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm text-center space-y-5">
          
          <div class="space-y-1">
            <span class="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
              お題の日本語
            </span>
            <h3 class="text-2xl sm:text-3xl font-black text-slate-900">
              「${currentQuiz.targetMeaning}」
            </h3>
          </div>

          <!-- 語根 ＋ スロット -->
          <div class="flex items-center justify-center gap-2 sm:gap-3 py-3">
            <div class="px-4 py-3 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white font-black text-2xl sm:text-3xl cyrillic-text shadow-md">
              ${currentQuiz.root}
              <span class="block text-[10px] text-emerald-200 font-normal">(${currentQuiz.rootMeaning})</span>
            </div>
            <span class="text-2xl font-black text-slate-400">＋</span>
            <div class="w-24 sm:w-28 h-16 rounded-2xl border-2 border-dashed flex items-center justify-center text-xl sm:text-2xl font-black cyrillic-text transition-all ${
              hasAnswered
                ? 'bg-amber-100 border-amber-400 text-amber-900'
                : 'bg-slate-50 border-slate-300 text-slate-400 animate-pulse'
            }">
              ${hasAnswered ? currentQuiz.correctSuffix : '?'}
            </div>
            <span class="text-2xl font-black text-slate-400">＝</span>
            <div class="px-4 py-3 rounded-2xl border-2 font-black text-xl sm:text-2xl cyrillic-text transition-all ${
              hasAnswered
                ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-md'
                : 'bg-slate-50 border-slate-200 text-slate-400'
            }">
              ${hasAnswered ? currentQuiz.targetWord : '？？？'}
            </div>
          </div>

          <!-- 接尾辞の選択肢タイル (4択) -->
          <div class="space-y-2">
            <div class="text-xs font-bold text-slate-500">正しいパーツ（接尾辞）をタップ:</div>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-lg mx-auto">
              ${currentQuiz.options.map(opt => {
                let btnStyle = "bg-slate-50 hover:bg-emerald-50/50 border-slate-200 hover:border-emerald-400 text-slate-800";
                if (hasAnswered) {
                  if (opt === currentQuiz.correctSuffix) {
                    btnStyle = "bg-emerald-500 border-emerald-600 text-white font-black shadow-md scale-102";
                  } else if (opt === selectedSuffix) {
                    btnStyle = "bg-rose-500 border-rose-600 text-white font-bold animate-shake";
                  } else {
                    btnStyle = "bg-slate-50 border-slate-200 text-slate-400 opacity-60";
                  }
                }
                return `
                  <button type="button" class="family-suffix-btn p-3.5 rounded-2xl border-2 font-black text-lg cyrillic-text transition-all active:scale-95 shadow-xs cursor-pointer ${btnStyle}" data-suffix="${opt}" ${hasAnswered ? 'disabled' : ''}>
                    ${opt}
                  </button>
                `;
              }).join('')}
            </div>
          </div>

          <!-- 回答後解説 -->
          ${hasAnswered ? `
            <div class="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-left space-y-1.5 animate-fade-in text-xs">
              <div class="font-black text-emerald-950 text-sm flex items-center justify-between">
                <span>🎉 完成！「${currentQuiz.targetWord}」</span>
                <button type="button" class="btn-play-word-audio text-emerald-700 hover:text-emerald-900 font-bold" data-word="${currentQuiz.targetWord}">🔊 発音を聞く</button>
              </div>
              <p class="text-slate-700 font-medium">
                接尾辞: <span class="font-bold text-emerald-800">${currentQuiz.fullSuffixDesc}</span>
              </p>
              <p class="text-slate-600">
                メモ: ${currentQuiz.note}
              </p>
              <div class="pt-2 text-right">
                <button type="button" id="btn-family-next" class="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md active:scale-95 transition-all">
                  次の語根へ →
                </button>
              </div>
            </div>
          ` : ''}

        </div>
      </div>
    `;
  }

  static onFamilySuffixChoice(suffix) {
    const { familyGame } = this.state;
    if (familyGame.hasAnswered || !familyGame.currentQuiz) return;

    familyGame.hasAnswered = true;
    familyGame.selectedSuffix = suffix;
    const isCorrect = suffix === familyGame.currentQuiz.correctSuffix;

    SpeechService.speak(familyGame.currentQuiz.targetWord, { rate: 0.9 });

    if (isCorrect) {
      SoundEffects.playCorrect();
      familyGame.score += 15;
      try {
      if (typeof GamificationService !== 'undefined' && typeof GamificationService.addXp === 'function') {
        GamificationService.addXp(15);
      }
    } catch (e) {
      console.warn('GamificationService.addXp error:', e);
    }
    } else {
      SoundEffects.playWrong();
      try {
        const curQuiz = familyGame.currentQuiz;
        StorageService.recordMistake({
          question: `【語根派生】${curQuiz.root} + [接尾辞] → 「${curQuiz.meaningJa}」`,
          userAnswer: suffix || '(未選択)',
          correctAnswer: curQuiz.correctSuffix,
          type: 'word_family',
          category: '語根・派生語',
          explanation: `${curQuiz.root} + ${curQuiz.correctSuffix} = ${curQuiz.targetWord}（${curQuiz.meaningJa}）。${curQuiz.explanation || ''}`
        });
      } catch (_) {}
    }

    this.renderMain();
  }

  static nextFamilyQuiz() {
    const { familyGame } = this.state;
    familyGame.currentIndex++;
    if (familyGame.currentIndex >= familyGame.quizzes.length) {
      familyGame.isFinished = true;
      SoundEffects.playLevelUp();
    } else {
      familyGame.currentQuiz = familyGame.quizzes[familyGame.currentIndex];
      familyGame.hasAnswered = false;
      familyGame.selectedSuffix = null;
    }
    this.renderMain();
  }

  // ==========================================
  // 図鑑・一覧閲覧モード UI
  // ==========================================
  static renderStudyUI() {
    const { studyTab, searchQuery } = this.state;
    const qLower = (searchQuery || '').toLowerCase().trim();

    return `
      <div class="space-y-4">
        <!-- 検索バー ＆ サブタブ切り替え -->
        <div class="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button type="button" class="study-subtab px-3 py-1.5 rounded-lg transition-all ${
              studyTab === 'antonyms' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }" data-subtab="antonyms">
              対義語 (${wordFamilyData.antonyms.length})
            </button>
            <button type="button" class="study-subtab px-3 py-1.5 rounded-lg transition-all ${
              studyTab === 'synonyms' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }" data-subtab="synonyms">
              類義語 (${wordFamilyData.synonyms.length})
            </button>
            <button type="button" class="study-subtab px-3 py-1.5 rounded-lg transition-all ${
              studyTab === 'families' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }" data-subtab="families">
              語根ファミリー (${wordFamilyData.wordFamilies.length})
            </button>
          </div>

          <div class="relative flex-1 min-w-[200px] max-w-xs">
            <input type="text" id="input-wf-search" placeholder="単語や日本語で検索..." value="${searchQuery}" class="w-full text-xs px-3 py-2 pl-8 rounded-xl bg-slate-50 border border-slate-200 focus:border-emerald-500 outline-hidden font-medium">
            <span class="absolute left-2.5 top-2.5 text-slate-400 text-xs">🔍</span>
          </div>
        </div>

        <!-- 一覧コンテンツ -->
        <div class="space-y-3">
          ${studyTab === 'antonyms' ? this.renderAntonymsList(qLower) : ''}
          ${studyTab === 'synonyms' ? this.renderSynonymsList(qLower) : ''}
          ${studyTab === 'families' ? this.renderFamiliesList(qLower) : ''}
        </div>
      </div>
    `;
  }

  static renderAntonymsList(query) {
    const list = wordFamilyData.antonyms.filter(a => {
      if (!query) return true;
      return a.wordA.toLowerCase().includes(query) || 
             a.wordB.toLowerCase().includes(query) || 
             a.meaningA.includes(query) || 
             a.meaningB.includes(query);
    });

    return `
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        ${list.map(a => `
          <div class="bg-white p-4 rounded-2xl border border-slate-200 hover:border-amber-400 shadow-2xs hover:shadow-sm transition-all space-y-2">
            <div class="flex items-center justify-between text-[11px] text-amber-700 font-bold bg-amber-50 px-2.5 py-0.5 rounded-full">
              <span>反意語ペア</span>
              <span>${a.category || ''}</span>
            </div>
            <div class="grid grid-cols-2 gap-2 text-center items-center py-1">
              <div class="space-y-0.5 bg-slate-50 p-2.5 rounded-xl">
                <div class="text-base font-black text-slate-900 cyrillic-text">${a.wordA}</div>
                <div class="text-xs font-bold text-slate-600">${a.meaningA}</div>
                <button type="button" class="btn-play-word-audio text-xs text-amber-600 hover:text-amber-800" data-word="${a.wordA}">🔊</button>
              </div>
              <div class="space-y-0.5 bg-slate-50 p-2.5 rounded-xl">
                <div class="text-base font-black text-slate-900 cyrillic-text">${a.wordB}</div>
                <div class="text-xs font-bold text-slate-600">${a.meaningB}</div>
                <button type="button" class="btn-play-word-audio text-xs text-amber-600 hover:text-amber-800" data-word="${a.wordB}">🔊</button>
              </div>
            </div>
            <div class="text-[11px] text-slate-500 space-y-0.5 pt-1 border-t border-slate-100">
              <div>・${a.exampleA}</div>
              <div>・${a.exampleB}</div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  static renderSynonymsList(query) {
    const list = wordFamilyData.synonyms.filter(s => {
      if (!query) return true;
      return s.title.includes(query) || s.nuance.includes(query) || s.words.some(w => w.word.toLowerCase().includes(query) || w.meaning.includes(query));
    });

    return `
      <div class="space-y-3">
        ${list.map(s => `
          <div class="bg-white p-5 rounded-2xl border border-slate-200 hover:border-indigo-400 shadow-2xs hover:shadow-sm transition-all space-y-3">
            <div class="font-black text-indigo-950 text-sm flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
              <span>${s.title}</span>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
              ${s.words.map(w => `
                <div class="p-3 rounded-xl bg-slate-50 space-y-1">
                  <div class="flex items-center justify-between">
                    <span class="font-extrabold text-slate-900 cyrillic-text text-sm">${w.word}</span>
                    <button type="button" class="btn-play-word-audio text-xs text-indigo-600" data-word="${w.word}">🔊</button>
                  </div>
                  <div class="text-[11px] text-slate-600 font-medium">${w.meaning}</div>
                </div>
              `).join('')}
            </div>
            <div class="text-xs text-slate-600 bg-indigo-50/60 p-3 rounded-xl border border-indigo-100 leading-relaxed">
              💡 <span class="font-bold text-indigo-900">使い分けポイント:</span> ${s.nuance}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  static renderFamiliesList(query) {
    const list = wordFamilyData.wordFamilies.filter(fam => {
      if (!query) return true;
      return fam.root.toLowerCase().includes(query) || fam.meaning.includes(query) || fam.derivatives.some(d => d.word.toLowerCase().includes(query) || d.meaning.includes(query));
    });

    return `
      <div class="space-y-3">
        ${list.map(fam => `
          <div class="bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-400 shadow-2xs hover:shadow-sm transition-all space-y-3">
            <div class="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div class="flex items-center gap-2">
                <span class="px-3 py-1 rounded-xl bg-emerald-600 text-white font-black text-lg cyrillic-text shadow-2xs">
                  ${fam.root}
                </span>
                <div>
                  <div class="font-black text-slate-800 text-sm">${fam.meaning}</div>
                  <div class="text-[10px] text-slate-400 font-bold">${fam.pos}</div>
                </div>
              </div>
              <span class="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full font-bold">
                ${fam.derivatives.length} 個の派生語
              </span>
            </div>

            <!-- 派生語ツリーグリッド -->
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-1">
              ${fam.derivatives.map(d => `
                <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <div class="flex items-center justify-between">
                    <span class="font-black text-slate-900 cyrillic-text text-sm">${d.word}</span>
                    <button type="button" class="btn-play-word-audio text-xs text-emerald-600" data-word="${d.word}">🔊</button>
                  </div>
                  <div class="text-xs font-bold text-emerald-800">${d.meaning}</div>
                  <div class="text-[10px] text-slate-400 font-medium">${d.suffix}</div>
                  <div class="text-[10px] text-slate-500">${d.note}</div>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // ==========================================
  // イベントバインド
  // ==========================================
  static bindMainEvents() {
    if (!this.container) return;

    // 戻るボタン
    const backBtn = this.container.querySelector('#btn-wf-back');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        if (this.onNavigate) this.onNavigate('home');
      });
    }

    // メインタブ切り替え
    this.container.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.state.activeTab = btn.dataset.tab;
        SoundEffects.playCorrect();
        this.renderMain();
      });
    });

    // 音声再生ボタン
    this.container.querySelectorAll('.btn-play-word-audio').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const word = btn.dataset.word;
        SpeechService.speak(word, { rate: 0.9 });
      });
    });

    // ゲーム①のイベント
    if (this.state.activeTab === 'game_antonym') {
      this.container.querySelectorAll('.antonym-card').forEach(card => {
        card.addEventListener('click', () => {
          this.onAntonymCardClick(card.dataset.cardId);
        });
      });

      const replayBtn = this.container.querySelector('#btn-antonym-replay');
      if (replayBtn) {
        replayBtn.addEventListener('click', () => {
          this.initAntonymGame();
          SoundEffects.playCorrect();
          this.renderMain();
        });
      }
    }

    // ゲーム②のイベント
    if (this.state.activeTab === 'game_synonym') {
      this.container.querySelectorAll('.synonym-choice-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.dataset.choiceIdx, 10);
          this.onSynonymChoice(idx);
        });
      });

      const nextBtn = this.container.querySelector('#btn-synonym-next');
      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          this.nextSynonymQuestion();
        });
      }

      const replayBtn = this.container.querySelector('#btn-synonym-replay');
      if (replayBtn) {
        replayBtn.addEventListener('click', () => {
          this.initSynonymGame();
          SoundEffects.playCorrect();
          this.renderMain();
        });
      }
    }

    // ゲーム③のイベント
    if (this.state.activeTab === 'game_family') {
      this.container.querySelectorAll('.family-suffix-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const suffix = btn.dataset.suffix;
          this.onFamilySuffixChoice(suffix);
        });
      });

      const nextBtn = this.container.querySelector('#btn-family-next');
      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          this.nextFamilyQuiz();
        });
      }

      const replayBtn = this.container.querySelector('#btn-family-replay');
      if (replayBtn) {
        replayBtn.addEventListener('click', () => {
          this.initFamilyGame();
          SoundEffects.playCorrect();
          this.renderMain();
        });
      }
    }

    // 図鑑タブのイベント
    if (this.state.activeTab === 'study_cards') {
      this.container.querySelectorAll('.study-subtab').forEach(btn => {
        btn.addEventListener('click', () => {
          this.state.studyTab = btn.dataset.subtab;
          SoundEffects.playTile();
          this.renderMain();
        });
      });

      const searchInput = this.container.querySelector('#input-wf-search');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          this.state.searchQuery = e.target.value;
          const content = this.container.querySelector('#wf-content-area');
          if (content) {
            content.innerHTML = this.renderActiveContent();
            // 再バインド
            this.container.querySelectorAll('.btn-play-word-audio').forEach(btn => {
              btn.addEventListener('click', (ev) => {
                ev.stopPropagation();
                SpeechService.speak(btn.dataset.word, { rate: 0.9 });
              });
            });
          }
        });
      }
    }
  }
}
