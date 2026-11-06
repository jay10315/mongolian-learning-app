// 数字・金額・時刻・日付スピードマスターコンポーネント
import { StorageService } from '../services/storage.js';
import { numberQuizzes } from '../data/numberQuizData.js';
import { SpeechService } from '../services/speech.js';
import { SoundEffects, shuffleArray, renderChoiceExplanationsHTML } from '../utils/helpers.js';
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
        <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
          <div class="flex items-center gap-2.5">
            <span class="text-2xl p-2 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white shadow-xs">🔢</span>
            <div>
              <h2 class="text-lg font-bold text-slate-800 dark:text-white">数字・金額・時間スピードマスター</h2>
              <p class="text-xs text-slate-500 dark:text-slate-400">接続形（гурван）、トゥグルグ（₮）、時刻、曜日特訓</p>
            </div>
          </div>
          <button type="button" id="btn-back-home" class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-bold transition-all cursor-pointer">
            ✕ ホームへ
          </button>
        </div>

        <div class="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-2">特訓カテゴリーを選択</label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              ${[
                { id: 'all', label: '⚡ すべての数字問題', desc: '全ジャンルからランダム出題' },
                { id: 'connecting', label: '🔗 名詞接続形 (гурван)', desc: '名詞の前に付くときの変化特訓' },
                { id: 'currency', label: '💰 金額・トゥグルグ (₮)', desc: '買い物・万・億・桁数の計算' },
                { id: 'time', label: '⏰ 時刻・時計の読み方', desc: '〜時半、〜時〜分前' },
                { id: 'date', label: '📅 日付・曜日・月日', desc: '曜日名、ナショナルデー等' }
              ].map(cat => `
                <label class="flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-all ${
                  this.state.category === cat.id ? 'border-cyan-600 bg-cyan-50/60 dark:bg-cyan-950/40 font-bold text-cyan-950 dark:text-cyan-200 shadow-2xs' : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }">
                  <input type="radio" name="numCat" value="${cat.id}" ${this.state.category === cat.id ? 'checked' : ''} class="hidden">
                  <div>
                    <div>${cat.label}</div>
                    <div class="text-[11px] font-normal text-slate-500 dark:text-slate-400 mt-0.5">${cat.desc}</div>
                  </div>
                </label>
              `).join('')}
            </div>
          </div>

          <button type="button" id="btn-start-number-quiz" class="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold rounded-xl shadow-md transition-all active:scale-98 text-sm flex items-center justify-center gap-2 cursor-pointer">
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
        <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2.5">
          <div class="flex items-center gap-2">
            <span class="text-xl">🔢</span>
            <span class="font-bold text-xs text-slate-500 dark:text-slate-400">問題 ${idx + 1} / ${total}</span>
          </div>
          <button type="button" id="btn-quit-number" class="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer">
            中断する ✕
          </button>
        </div>

        <!-- プログレスバー -->
        <div class="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
          <div class="bg-cyan-600 h-full transition-all duration-300" style="width: ${progress}%"></div>
        </div>

        <!-- 問題カード（ネタバレなし・シンプル出題） -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs space-y-2 text-center">
          <div class="text-xs font-bold text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/60 px-2.5 py-0.5 rounded-full inline-block">
            ${q.category === 'connecting' ? '名詞接続形' : q.category === 'currency' ? '金額（トゥグルグ）' : q.category === 'time' ? '時刻・時計' : '日付・カレンダー'}
          </div>
          <h3 class="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-snug">
            ${q.question}
          </h3>
        </div>

        <!-- 4択選択肢 -->
        <div class="grid grid-cols-1 gap-2.5">
          ${this.state.shuffledOptions.map((opt, i) => {
            let style = 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-cyan-500 hover:bg-cyan-50/30 dark:hover:bg-slate-700/60 text-slate-900 dark:text-white';
            if (this.state.selectedOption) {
              if (opt === q.answer) {
                style = 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-black ring-2 ring-emerald-300';
              } else if (opt === this.state.selectedOption) {
                style = 'bg-rose-50 dark:bg-rose-950/60 border-rose-400 text-rose-900 dark:text-rose-200';
              } else {
                style = 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 opacity-60';
              }
            }
            return `
              <button type="button" class="btn-num-choice p-3.5 rounded-xl border text-left text-sm font-bold cyrillic-text transition-all flex items-center justify-between cursor-pointer ${style}" data-val="${opt}" ${this.state.selectedOption ? 'disabled' : ''}>
                <span>${opt}</span>
                <span class="btn-opt-speak text-xs text-slate-400 hover:text-cyan-700 p-1 cursor-pointer" data-word="${opt}" title="発音を聞く">🔊</span>
              </button>
            `;
          }).join('')}
        </div>

        <!-- 回答後の解説・次へボタン（解き終わった後にルールや語彙の詳細を解説） -->
        ${this.state.selectedOption ? `
          <div class="bg-white dark:bg-slate-800 rounded-2xl p-4 border-2 ${this.state.isCorrect ? 'border-emerald-400 bg-emerald-50/20 dark:bg-emerald-950/30' : 'border-rose-400 bg-rose-50/20 dark:bg-rose-950/30'} shadow-xs space-y-3 animate-fade-in">
            <div class="flex items-center justify-between">
              <span class="text-xs font-black px-2.5 py-0.5 rounded-full ${this.state.isCorrect ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'}">
                ${this.state.isCorrect ? '💮 正解！' : '❌ 不正解...'}
              </span>
              <button type="button" id="btn-play-answer-audio" class="text-xs px-2.5 py-1 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold rounded-lg border border-slate-200 dark:border-slate-600 flex items-center gap-1 cursor-pointer">
                <span>🔊</span> 正解の発音
              </button>
            </div>
            
            <p class="text-xs text-slate-700 dark:text-slate-200 leading-relaxed bg-white/80 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
              ${q.explanation}
            </p>
            
            <div class="text-[11px] font-bold text-slate-500 dark:text-slate-400">
              📌 ポイント: ${q.rule}
            </div>

            <!-- 選択肢全解説（各選択肢の単語・表現の解説をタップで確認） -->
            ${(typeof renderChoiceExplanationsHTML === 'function' && q.options && q.options.length > 0) ? renderChoiceExplanationsHTML(q.options, {
              expectedAnswer: q.answer,
              userAnswer: this.state.selectedOption,
              title: '選択肢に出た単語・表現の全解説を見る（タップで開閉）'
            }) : ''}

            <button type="button" id="btn-next-num-quiz" class="w-full py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl text-xs shadow-xs transition-all flex items-center justify-center gap-1 cursor-pointer">
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
            try {
              StorageService.recordMistake({
                question: `【数字特訓】${q.question}`,
                userAnswer: val || '(未回答)',
                correctAnswer: q.answer,
                type: 'word',
                category: '数字・数詞',
                explanation: `${q.question} → 正解: ${q.answer}。${q.explanation || ''}`
              });
            } catch (_) {}
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
          try {
            if (typeof GamificationService !== 'undefined' && typeof GamificationService.addXp === 'function') {
              GamificationService.addXp(this.state.score * 5);
            }
          } catch (e) {
            console.warn('GamificationService.addXp error:', e);
          }
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
      <div class="animate-fade-in max-w-xl mx-auto px-4 py-8 space-y-5">
        <div class="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white flex items-center justify-center text-4xl shadow-lg">
          🔢
        </div>

        <div class="space-y-1 text-center">
          <h2 class="text-xl font-black text-slate-900 dark:text-white">数字マスター特訓 終了！</h2>
          <p class="text-xs text-slate-500 dark:text-slate-400">接続形・金額・時刻・日付のテスト結果</p>
        </div>

        <div class="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3 text-center">
          <div class="text-3xl font-black text-cyan-600 dark:text-cyan-400">
            ${score} <span class="text-sm font-normal text-slate-400">/ ${total} 問正解 (${percent}%)</span>
          </div>
          <div class="text-xs font-bold text-slate-700 dark:text-slate-200">
            ${percent >= 90 ? '🌟 完璧な計算力！モンゴルの買い物も時間管理もバッチリ！' : percent >= 70 ? '👍 よく出来ました！接続形（-н）も身についています！' : '💪 間違えたルールを復習して、もう一度スピード特訓しよう！'}
          </div>
          <div class="text-[11px] text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 py-1 px-3 rounded-full font-bold inline-block">
            +${score * 5} XP 獲得！
          </div>
        </div>

        <!-- 出題問題の一覧・復習 ＆ 選択肢解説 -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3 text-left">
          <h3 class="text-sm font-extrabold text-slate-800 dark:text-white flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-700">
            <span>📋</span> 出題問題の復習 (${total}問)
          </h3>
          <div class="divide-y divide-slate-100 dark:divide-slate-700 max-h-96 overflow-y-auto pr-1 space-y-2">
            ${this.state.results.map((r, i) => `
              <div class="py-3 space-y-1.5 text-xs">
                <div class="flex items-center justify-between gap-2">
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${r.isOk ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300' : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'}">
                    ${r.isOk ? '⭕ 正解' : '❌ 不正解'}
                  </span>
                  <button type="button" class="btn-opt-speak text-slate-400 hover:text-cyan-700 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer" data-word="${r.quiz.answer}" title="正解の発音を聞く">
                    🔊
                  </button>
                </div>
                <div class="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">${i + 1}. ${r.quiz.question}</div>
                <div>正解: <span class="font-bold text-cyan-800 dark:text-cyan-300 cyrillic-text">${r.quiz.answer}</span></div>
                ${!r.isOk ? `
                  <div class="text-slate-500 dark:text-slate-400">
                    あなたの回答: <span class="line-through text-rose-600 dark:text-rose-400 font-medium">${r.userAns || '(無回答)'}</span>
                  </div>
                ` : `
                  <div class="text-slate-500 dark:text-slate-400">あなたの回答: <span class="text-emerald-700 dark:text-emerald-400 font-bold">${r.userAns}</span> ✅</div>
                `}
                <div class="text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl text-[11px] leading-relaxed">
                  ${r.quiz.explanation}
                </div>
                ${(typeof renderChoiceExplanationsHTML === 'function' && r.quiz.options && r.quiz.options.length > 0) ? renderChoiceExplanationsHTML(r.quiz.options, {
                  expectedAnswer: r.quiz.answer,
                  userAnswer: r.userAns,
                  title: '選択肢に出た単語・表現の全解説を見る（タップで開閉）'
                }) : ''}
              </div>
            `).join('')}
          </div>
        </div>

        <div class="flex gap-2">
          <button type="button" id="btn-retry-num" class="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold rounded-xl text-xs transition-all cursor-pointer">
            もう一度挑戦
          </button>
          <button type="button" id="btn-finish-num" class="flex-1 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl text-xs shadow-xs transition-all cursor-pointer">
            カテゴリー選択へ
          </button>
        </div>
      </div>
    `;

    this.container.querySelectorAll('.btn-opt-speak').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        SpeechService.speak(btn.dataset.word);
      });
    });

    this.container.querySelector('#btn-retry-num').addEventListener('click', () => {
      this.startQuiz();
    });

    this.container.querySelector('#btn-finish-num').addEventListener('click', () => {
      this.state.view = 'settings';
      this.renderSettings();
    });
  }
}
