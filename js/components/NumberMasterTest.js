// 数字・金額・時刻・日付スピードマスターコンポーネント
import { numberQuizzes } from '../data/numberQuizData.js';
import { SpeechService } from '../services/speech.js';
import { SoundEffects, shuffleArray } from '../utils/helpers.js';
import { GamificationService } from '../services/gamification.js';

export class NumberMasterComponent {
  static state = {
    view: 'settings', // 'settings' | 'testing' | 'result'
    category: 'all',
    quizzes: [],
    currentIndex: 0,
    currentQuiz: null,
    shuffledOptions: [],
    selectedOption: null,
    isCorrect: false,
    score: 0,
    results: []
  };

  static render(container, onNavigate) {
    this.container = container;
    this.onNavigate = onNavigate;

    if (this.state.view === 'settings') {
      this.renderSettings();
    } else if (this.state.view === 'testing') {
      this.renderTesting();
    } else if (this.state.view === 'result') {
      this.renderResult();
    }
  }

  // 1. 設定画面
  static renderSettings() {
    this.container.innerHTML = `
      <div class="animate-fade-in max-w-xl mx-auto px-4 py-4 space-y-5">
        <div class="flex items-center justify-between border-b border-slate-200 pb-3">
          <div class="flex items-center gap-2.5">
            <span class="text-2xl p-2 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white shadow-xs">🔢</span>
            <div>
              <h2 class="text-lg font-bold text-slate-800">数字・金額・時間スピードマスター</h2>
              <p class="text-xs text-slate-500">接続形（гурван）、トゥグルグ（₮）、時刻、曜日特訓</p>
            </div>
          </div>
          <button type="button" id="btn-back-home" class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all">
            ✕ ホームへ
          </button>
        </div>

        <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-2">特訓カテゴリーを選択</label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              ${[
                { id: 'all', label: '⚡ すべての数字問題', desc: '全ジャンルからランダム出題' },
                { id: 'connecting', label: '🔗 名詞接続形 (гурван)', desc: '名詞の前に付くときの変化特訓' },
                { id: 'currency', label: '💰 金額・トゥグルグ (₮)', desc: '買い物・万・億・桁数の計算' },
                { id: 'time', label: '⏰ 時刻・時計の読み方', desc: '〜時半、〜時〜分前' },
                { id: 'date', label: '📅 日付・曜日・月日', desc: '曜日名、ナショナルデー等' }
              ].map(cat => `
                <label class="flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer hover:bg-slate-50 transition-all ${
                  this.state.category === cat.id ? 'border-cyan-600 bg-cyan-50/60 font-bold text-cyan-950 shadow-2xs' : 'border-slate-200 text-slate-700'
                }">
                  <input type="radio" name="numCat" value="${cat.id}" ${this.state.category === cat.id ? 'checked' : ''} class="hidden">
                  <div>
                    <div>${cat.label}</div>
                    <div class="text-[11px] font-normal text-slate-500 mt-0.5">${cat.desc}</div>
                  </div>
                </label>
              `).join('')}
            </div>
          </div>

          <button type="button" id="btn-start-number-quiz" class="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold rounded-xl shadow-md transition-all active:scale-98 text-sm flex items-center justify-center gap-2">
            <span>⚡</span> スピード特訓を開始する
          </button>
        </div>
      </div>
    `;

    this.container.querySelector('#btn-back-home').addEventListener('click', () => {
      if (this.onNavigate) this.onNavigate('home');
    });

    this.container.querySelectorAll('input[name="numCat"]').forEach(r => {
      r.addEventListener('change', (e) => {
        this.state.category = e.target.value;
        this.renderSettings();
      });
    });

    this.container.querySelector('#btn-start-number-quiz').addEventListener('click', () => {
      this.startQuiz();
    });
  }

  static startQuiz() {
    let list = [...numberQuizzes];
    if (this.state.category !== 'all') {
      list = list.filter(q => q.category === this.state.category);
    }
    this.state.quizzes = shuffleArray(list);
    this.state.currentIndex = 0;
    this.state.score = 0;
    this.state.results = [];
    this.state.view = 'testing';
    this.loadQuiz(0);
  }

  static loadQuiz(index) {
    this.state.currentIndex = index;
    const q = this.state.quizzes[index];
    this.state.currentQuiz = q;
    this.state.shuffledOptions = shuffleArray([...q.options]);
    this.state.selectedOption = null;
    this.state.isCorrect = false;
    this.renderTesting();
  }

  // 2. 出題画面
  static renderTesting() {
    const q = this.state.currentQuiz;
    const idx = this.state.currentIndex;
    const total = this.state.quizzes.length;
    const progress = Math.round(((idx) / total) * 100);

    this.container.innerHTML = `
      <div class="animate-fade-in max-w-xl mx-auto px-4 py-4 space-y-4">
        <!-- 上部ヘッダー -->
        <div class="flex items-center justify-between border-b border-slate-200 pb-2.5">
          <div class="flex items-center gap-2">
            <span class="text-xl">🔢</span>
            <span class="font-bold text-xs text-slate-500">問題 ${idx + 1} / ${total}</span>
          </div>
          <button type="button" id="btn-quit-number" class="text-xs text-slate-500 hover:text-slate-800">
            中断する ✕
          </button>
        </div>

        <!-- プログレスバー -->
        <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div class="bg-cyan-600 h-full transition-all duration-300" style="width: ${progress}%"></div>
        </div>

        <!-- 問題カード -->
        <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2 text-center">
          <div class="text-xs font-bold text-cyan-700 bg-cyan-50 px-2.5 py-0.5 rounded-full inline-block">
            ${q.category === 'connecting' ? '名詞接続形' : q.category === 'currency' ? '金額（トゥグルグ）' : q.category === 'time' ? '時刻・時計' : '日付・カレンダー'}
          </div>
          <h3 class="text-base sm:text-lg font-black text-slate-900 leading-snug">
            ${q.question}
          </h3>
        </div>

        <!-- 4択選択肢 -->
        <div class="grid grid-cols-1 gap-2.5">
          ${this.state.shuffledOptions.map((opt, i) => {
            let style = 'bg-white border-slate-200 hover:border-cyan-500 hover:bg-cyan-50/30 text-slate-900';
            if (this.state.selectedOption) {
              if (opt === q.answer) {
                style = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-black ring-2 ring-emerald-300';
              } else if (opt === this.state.selectedOption) {
                style = 'bg-rose-50 border-rose-400 text-rose-900';
              } else {
                style = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
              }
            }
            return `
              <button type="button" class="btn-num-choice p-3.5 rounded-xl border text-left text-sm font-bold cyrillic-text transition-all flex items-center justify-between ${style}" data-val="${opt}" ${this.state.selectedOption ? 'disabled' : ''}>
                <span>${opt}</span>
                <button type="button" class="btn-opt-speak text-xs text-slate-400 hover:text-cyan-700 p-1" data-word="${opt}" title="発音を聞く">🔊</button>
              </button>
            `;
          }).join('')}
        </div>

        <!-- 回答後の解説・次へボタン -->
        ${this.state.selectedOption ? `
          <div class="bg-white rounded-2xl p-4 border-2 ${this.state.isCorrect ? 'border-emerald-400 bg-emerald-50/20' : 'border-rose-400 bg-rose-50/20'} shadow-xs space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs font-black px-2.5 py-0.5 rounded-full ${this.state.isCorrect ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'}">
                ${this.state.isCorrect ? '💮 正解！' : '❌ 不正解...'}
              </span>
              <button type="button" id="btn-play-answer-audio" class="text-xs px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-lg border border-slate-200 flex items-center gap-1">
                <span>🔊</span> 正解の発音
              </button>
            </div>
            <p class="text-xs text-slate-700 leading-relaxed bg-white/80 p-2.5 rounded-lg border border-slate-200">
              ${q.explanation}
            </p>
            <div class="text-[11px] font-bold text-slate-500">
              📌 ポイント: ${q.rule}
            </div>
            <button type="button" id="btn-next-num-quiz" class="w-full py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl text-xs shadow-xs transition-all flex items-center justify-center gap-1">
              <span>次の問題へ</span> <span>→</span>
            </button>
          </div>
        ` : ''}
      </div>
    `;

    this.container.querySelector('#btn-quit-number').addEventListener('click', () => {
      this.state.view = 'settings';
      this.renderSettings();
    });

    // 選択肢読み上げ
    this.container.querySelectorAll('.btn-opt-speak').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        SpeechService.speak(btn.dataset.word);
      });
    });

    if (!this.state.selectedOption) {
      this.container.querySelectorAll('.btn-num-choice').forEach(btn => {
        btn.addEventListener('click', () => {
          const val = btn.dataset.val;
          const isOk = val === q.answer;
          this.state.selectedOption = val;
          this.state.isCorrect = isOk;
          if (isOk) {
            this.state.score++;
            SoundEffects.playCorrect();
          } else {
            SoundEffects.playWrong();
          }
          this.state.results.push({ quiz: q, userAns: val, isOk });
          this.renderTesting();
        });
      });
    } else {
      const playAnsBtn = this.container.querySelector('#btn-play-answer-audio');
      if (playAnsBtn) {
        playAnsBtn.addEventListener('click', () => {
          SpeechService.speak(q.answer);
        });
      }

      this.container.querySelector('#btn-next-num-quiz').addEventListener('click', () => {
        if (this.state.currentIndex + 1 < this.state.quizzes.length) {
          this.loadQuiz(this.state.currentIndex + 1);
        } else {
          GamificationService.addXp(this.state.score * 5);
          SoundEffects.playLevelUp();
          this.state.view = 'result';
          this.renderResult();
        }
      });
    }
  }

  // 3. 結果画面
  static renderResult() {
    const total = this.state.quizzes.length;
    const score = this.state.score;
    const percent = Math.round((score / total) * 100);

    this.container.innerHTML = `
      <div class="animate-fade-in max-w-md mx-auto px-4 py-8 text-center space-y-5">
        <div class="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white flex items-center justify-center text-4xl shadow-lg">
          🔢
        </div>

        <div class="space-y-1">
          <h2 class="text-xl font-black text-slate-900">数字マスター特訓 終了！</h2>
          <p class="text-xs text-slate-500">接続形・金額・時刻・日付のテスト結果</p>
        </div>

        <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
          <div class="text-3xl font-black text-cyan-600">
            ${score} <span class="text-sm font-normal text-slate-400">/ ${total} 問正解 (${percent}%)</span>
          </div>
          <div class="text-xs font-bold text-slate-700">
            ${percent >= 90 ? '🌟 完璧な計算力！モンゴルの買い物も時間管理もバッチリ！' : percent >= 70 ? '👍 よく出来ました！接続形（-н）も身についています！' : '💪 間違えたルールを復習して、もう一度スピード特訓しよう！'}
          </div>
          <div class="text-[11px] text-emerald-700 bg-emerald-50 py-1 px-3 rounded-full font-bold inline-block">
            +${score * 5} XP 獲得！
          </div>
        </div>

        <div class="flex gap-2">
          <button type="button" id="btn-retry-num" class="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-all">
            もう一度挑戦
          </button>
          <button type="button" id="btn-finish-num" class="flex-1 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl text-xs shadow-xs transition-all">
            カテゴリー選択へ
          </button>
        </div>
      </div>
    `;

    this.container.querySelector('#btn-retry-num').addEventListener('click', () => {
      this.startQuiz();
    });

    this.container.querySelector('#btn-finish-num').addEventListener('click', () => {
      this.state.view = 'settings';
      this.renderSettings();
    });
  }
}
