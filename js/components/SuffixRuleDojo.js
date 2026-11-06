// 助詞・語尾使い分けルールマスター道場コンポーネント
// 与位格（-д/-т: г,р,сの法則）、疑問詞文末（бэ/вэ: н,м,в,лの法則）、Yes/No疑問（уу/үү）、対格、属格、否定詞
import { suffixRuleCategories, suffixRuleQuizzes, suffixRuleData } from '../data/suffixRuleData.js';
import { SpeechService } from '../services/speech.js';
import { SoundEffects, shuffleArray } from '../utils/helpers.js';
import { GamificationService } from '../services/gamification.js';
import { StorageService } from '../services/storage.js';

export class SuffixRuleDojoComponent {
  static container = null;
  static onNavigate = null;

  static state = {
    view: 'menu', // 'menu' | 'testing' | 'result' | 'cheatsheet'
    activeCategory: 'all',
    quizzes: [],
    currentIndex: 0,
    currentQuiz: null,
    shuffledOptions: [],
    selectedOption: null,
    hasAnswered: false,
    isCorrect: false,
    score: 0,
    combo: 0,
    maxCombo: 0,
    xpEarned: 0,
    results: [],
    cheatFilter: ''
  };

  static render(container, onNavigate) {
    this.container = container;
    this.onNavigate = onNavigate;

    if (this.state.view === 'menu') {
      this.renderMenu();
    } else if (this.state.view === 'testing') {
      this.renderTesting();
    } else if (this.state.view === 'result') {
      this.renderResult();
    } else if (this.state.view === 'cheatsheet') {
      this.renderCheatSheet();
    }
  }

  // --- 1. メニュー画面（ルール一覧＆スタート） ---
  static renderMenu() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="animate-fade-in max-w-3xl mx-auto px-4 py-4 space-y-5">
        <!-- ヘッダー -->
        <div class="flex items-center justify-between border-b border-slate-200 pb-3">
          <div class="flex items-center gap-2.5">
            <span class="text-2xl p-2 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white shadow-xs">⚡</span>
            <div>
              <h2 class="text-lg font-bold text-slate-800">助詞・語尾ルール特訓道場</h2>
              <p class="text-xs text-slate-500">「г,р,сなら -т」「н,м,в,лなら бэ」など、迷いやすい音韻・語尾の法則を直感でマスター！</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button type="button" id="btn-open-cheatsheet" class="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold transition-all border border-indigo-200 flex items-center gap-1">
              <span>📜</span> 早見表・虎の巻
            </button>
            <button type="button" id="btn-back-home" class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all">
              ✕ ホームへ
            </button>
          </div>
        </div>

        <!-- 注目ルールハイライトバナー -->
        <div class="bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 rounded-2xl p-4 sm:p-5 text-white shadow-sm space-y-2">
          <div class="flex items-center gap-2 text-xs font-black tracking-wide uppercase bg-black/20 px-2.5 py-0.5 rounded-full w-fit">
            <span>🔥</span> モンゴル語の2大鉄板ルール
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div class="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/20">
              <div class="text-xs font-black text-amber-200">① 与位格（〜に／〜で）</div>
              <div class="text-sm font-bold mt-0.5">語尾が <span class="text-amber-300 font-mono font-black text-base">г, р, с</span> ➜ <span class="bg-amber-400 text-slate-900 px-1.5 py-0.2 rounded font-black">-т</span></div>
              <div class="text-[11px] text-white/80 mt-1">аймаг ➜ аймаг<strong class="text-amber-200">т</strong> / гэр ➜ гэр<strong class="text-amber-200">т</strong></div>
            </div>
            <div class="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/20">
              <div class="text-xs font-black text-rose-200">② 疑問詞疑問文（何・誰・どこ）</div>
              <div class="text-sm font-bold mt-0.5">語尾が <span class="text-rose-300 font-mono font-black text-base">н, м, в, л</span> ➜ <span class="bg-rose-400 text-slate-900 px-1.5 py-0.2 rounded font-black">бэ</span></div>
              <div class="text-[11px] text-white/80 mt-1">хэн ➜ хэн <strong class="text-rose-200">бэ</strong> / ном ➜ ном <strong class="text-rose-200">бэ</strong></div>
            </div>
          </div>
        </div>

        <!-- 特訓コース選択 -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-bold text-slate-700">特訓コースを選択</h3>
            <button type="button" class="btn-start-course text-xs font-black text-rose-600 hover:text-rose-700 bg-rose-50 px-3 py-1 rounded-lg border border-rose-200 transition-all hover:bg-rose-100" data-cat="all">
              ⚡ 全ルール総合ランダム特訓（全50問） ➜
            </button>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            ${suffixRuleCategories.map(cat => {
              const count = suffixRuleQuizzes.filter(q => q.category === cat.id).length;
              return `
                <div class="bg-white rounded-xl p-4 border border-slate-200 hover:border-rose-400 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between space-y-3 group">
                  <div class="space-y-1">
                    <div class="flex items-center justify-between">
                      <span class="text-[11px] font-black text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                        ${cat.badge}
                      </span>
                      <span class="text-[11px] font-mono text-slate-400 font-bold">${count} 問</span>
                    </div>
                    <h4 class="text-sm font-black text-slate-800 group-hover:text-rose-600 transition-colors">
                      ${cat.title}
                    </h4>
                    <p class="text-xs font-bold text-amber-700 bg-amber-50/60 p-1.5 rounded-md border border-amber-200/50">
                      💡 ${cat.shortRule}
                    </p>
                    <p class="text-[11px] text-slate-500 line-clamp-2">
                      ${cat.description}
                    </p>
                  </div>

                  <button type="button" class="btn-start-course w-full py-2 bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-bold rounded-lg text-xs shadow-2xs transition-all active:scale-98 flex items-center justify-center gap-1" data-cat="${cat.id}">
                    <span>このルールを特訓する</span> <span>🎯</span>
                  </button>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;

    // イベント
    this.container.querySelector('#btn-back-home').addEventListener('click', () => {
      if (this.onNavigate) this.onNavigate('home');
    });

    this.container.querySelector('#btn-open-cheatsheet').addEventListener('click', () => {
      this.state.view = 'cheatsheet';
      this.renderCheatSheet();
    });

    this.container.querySelectorAll('.btn-start-course').forEach(btn => {
      btn.addEventListener('click', () => {
        const cat = btn.dataset.cat;
        this.startQuiz(cat);
      });
    });
  }

  // --- 2. クイズ開始 ---
  static startQuiz(category = 'all') {
    this.state.activeCategory = category;
    let list = [...suffixRuleQuizzes];
    if (category !== 'all') {
      list = list.filter(q => q.category === category);
    }
    this.state.quizzes = shuffleArray(list);
    this.state.currentIndex = 0;
    this.state.score = 0;
    this.state.combo = 0;
    this.state.maxCombo = 0;
    this.state.xpEarned = 0;
    this.state.results = [];
    this.state.view = 'testing';
    GamificationService.resetSessionCombo();
    this.loadQuestion(0);
  }

  static loadQuestion(index) {
    if (!this.state.quizzes || !this.state.quizzes.length) return;
    this.state.currentIndex = index;
    const q = this.state.quizzes[index];
    this.state.currentQuiz = q;
    this.state.selectedOption = null;
    this.state.hasAnswered = false;
    this.state.isCorrect = false;
    this.state.shuffledOptions = shuffleArray([...q.options]);

    if (this.container) {
      this.renderTesting();
    }
  }

  // --- 3. クイズ実行画面 ---
  static renderTesting() {
    if (!this.container) return;
    const q = this.state.currentQuiz;
    if (!q) {
      this.state.view = 'menu';
      this.renderMenu();
      return;
    }

    const idx = this.state.currentIndex;
    const total = this.state.quizzes.length;
    const progress = Math.round(((idx) / total) * 100);

    this.container.innerHTML = `
      <div class="animate-fade-in max-w-xl mx-auto px-4 py-3 space-y-4">
        <!-- 上部バー -->
        <div class="space-y-1.5">
          <div class="flex items-center justify-between text-xs font-bold text-slate-500">
            <span class="flex items-center gap-2">
              <span class="bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full border border-rose-200">
                ${q.categoryTitle}
              </span>
              <span>第 ${idx + 1} / ${total} 問</span>
              ${this.state.combo >= 2 ? `
                <span class="bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full border border-orange-300 animate-bounce text-[10px]">
                  🔥 ${this.state.combo} COMBO
                </span>
              ` : ''}
            </span>
            <div class="flex items-center gap-3">
              <span class="text-rose-600 font-extrabold">+${this.state.score} PTS</span>
              <button type="button" id="btn-quit-quiz" class="text-slate-400 hover:text-slate-700 ml-1">中断</button>
            </div>
          </div>
          <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div class="bg-gradient-to-r from-rose-500 to-amber-500 h-full transition-all duration-300" style="width: ${progress}%"></div>
          </div>
        </div>

        <!-- 問題カード -->
        <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm text-center relative overflow-hidden space-y-3">
          <div class="text-xs font-bold text-slate-400">
            ${q.prompt}
          </div>

          <!-- メイン単語または文章 -->
          ${q.sentencePattern ? `
            <div class="text-2xl sm:text-3xl font-black text-slate-900 cyrillic-text tracking-tight py-1">
              ${q.sentencePattern.replace('___', `<span class="inline-block px-3 py-0.5 border-b-4 border-rose-500 text-rose-600 bg-rose-50 rounded mx-1">${this.state.hasAnswered ? this.state.selectedOption : '___'}</span>`)}
            </div>
            <div class="text-xs text-slate-500 font-medium">
              意味: <span class="text-slate-700 font-bold">${q.sentenceMeaning || q.exampleSentenceJa}</span>
            </div>
          ` : `
            <div class="text-3xl sm:text-4xl font-black text-slate-900 cyrillic-text tracking-tight py-1">
              ${q.targetWord}
            </div>
            <div class="text-xs text-slate-500 font-medium">
              意味: <span class="text-slate-700 font-bold">${q.targetWordMeaning}</span>
              ${q.endLetter ? ` / 語尾: <span class="font-mono font-black text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">${q.endLetter}</span>` : ''}
            </div>
          `}
        </div>

        <!-- 回答選択ボタンエリア -->
        <div class="grid ${this.state.shuffledOptions.length === 2 ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-4'} gap-2.5">
          ${this.state.shuffledOptions.map((opt, i) => {
            let btnStyle = 'bg-white border-slate-200 hover:border-rose-400 hover:bg-rose-50/50 text-slate-800';
            if (this.state.hasAnswered) {
              if (opt === q.answer) {
                btnStyle = 'bg-emerald-500 text-white border-emerald-600 shadow-sm font-black scale-102';
              } else if (opt === this.state.selectedOption) {
                btnStyle = 'bg-rose-500 text-white border-rose-600 opacity-90 line-through';
              } else {
                btnStyle = 'bg-slate-50 text-slate-400 border-slate-200 opacity-60';
              }
            }

            return `
              <button type="button" class="btn-dojo-opt p-4 rounded-xl border-2 font-black text-base sm:text-lg transition-all active:scale-95 cyrillic-text flex items-center justify-center gap-1.5 ${btnStyle}" data-val="${opt}" ${this.state.hasAnswered ? 'disabled' : ''}>
                <span>${opt}</span>
              </button>
            `;
          }).join('')}
        </div>

        <!-- 回答後フィードバック・ルール解説カード -->
        ${this.state.hasAnswered ? `
          <div class="animate-fade-in bg-white rounded-2xl p-5 border ${this.state.isCorrect ? 'border-emerald-300 bg-emerald-50/30' : 'border-rose-300 bg-rose-50/30'} shadow-sm space-y-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="text-xl">${this.state.isCorrect ? '💮' : '💡'}</span>
                <span class="text-sm font-black ${this.state.isCorrect ? 'text-emerald-800' : 'text-rose-800'}">
                  ${this.state.isCorrect ? '正解！その調子！' : 'おしい！ルールを確認しよう！'}
                </span>
              </div>
              <span class="text-xs font-mono font-bold text-slate-500">
                正解: <strong class="text-emerald-700 cyrillic-text font-black text-sm">${q.answer}</strong>
              </span>
            </div>

            <!-- ルールの要点 -->
            <div class="bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-xs text-amber-900 font-bold">
              ⚡ ${q.ruleTip}
            </div>

            <!-- 解説詳細 -->
            <p class="text-xs text-slate-600 leading-relaxed">
              ${q.explanation}
            </p>

            <!-- 例文音声 -->
            ${q.exampleSentenceMn ? `
              <div class="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between gap-2">
                <div class="space-y-0.5">
                  <div class="text-xs font-bold text-slate-800 cyrillic-text">${q.exampleSentenceMn}</div>
                  <div class="text-[11px] text-slate-500">${q.exampleSentenceJa}</div>
                </div>
                <button type="button" id="btn-play-example" class="px-2.5 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-1">
                  <span>🔊</span> 発音
                </button>
              </div>
            ` : ''}

            <!-- 次へ進むボタン -->
            <button type="button" id="btn-next-quiz" class="w-full py-3 bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-black rounded-xl shadow-md transition-all active:scale-98 text-sm flex items-center justify-center gap-1.5">
              <span>${idx + 1 < total ? '次の問題へ進む' : '結果を見る'}</span> <span>➜</span>
            </button>
          </div>
        ` : ''}
      </div>
    `;

    // イベントバインド
    const quitBtn = this.container.querySelector('#btn-quit-quiz');
    if (quitBtn) {
      quitBtn.addEventListener('click', () => {
        if (confirm('特訓を中断してメニューに戻りますか？')) {
          this.state.view = 'menu';
          this.renderMenu();
        }
      });
    }

    if (!this.state.hasAnswered) {
      this.container.querySelectorAll('.btn-dojo-opt').forEach(btn => {
        btn.addEventListener('click', () => {
          const val = btn.dataset.val;
          this.checkAnswer(val);
        });
      });
    } else {
      const playBtn = this.container.querySelector('#btn-play-example');
      if (playBtn && q.exampleSentenceMn) {
        playBtn.addEventListener('click', () => {
          SpeechService.speak(q.exampleSentenceMn);
        });
      }

      const nextBtn = this.container.querySelector('#btn-next-quiz');
      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          this.goNext();
        });
      }
    }
  }

  static checkAnswer(val) {
    const q = this.state.currentQuiz;
    const isCorrect = (val === q.answer);

    this.state.hasAnswered = true;
    this.state.selectedOption = val;
    this.state.isCorrect = isCorrect;

    if (isCorrect) {
      SoundEffects.playCorrect();
      this.state.combo++;
      if (this.state.combo > this.state.maxCombo) {
        this.state.maxCombo = this.state.combo;
      }
      const scoreGain = 10 + (this.state.combo > 1 ? this.state.combo * 2 : 0);
      this.state.score += scoreGain;
      this.state.xpEarned += 5;
      GamificationService.addXp(5);
    } else {
      SoundEffects.playWrong();
      this.state.combo = 0;
      this.state.xpEarned += 1;
      GamificationService.addXp(1);

      // 間違いノートに記録
      StorageService.recordMistake({
        question: `【${q.categoryTitle}】${q.sentencePattern || q.targetWord}`,
        userAnswer: val,
        correctAnswer: q.answer,
        type: 'grammar',
        category: q.categoryTitle,
        explanation: `${q.ruleTip} - ${q.explanation}`
      });
    }

    this.state.results.push({
      quiz: q,
      userAnswer: val,
      isCorrect: isCorrect
    });

    // 正解音声を自動再生
    if (q.exampleSentenceMn) {
      setTimeout(() => {
        SpeechService.speak(q.exampleSentenceMn);
      }, 200);
    }

    this.renderTesting();
  }

  static goNext() {
    if (this.state.currentIndex + 1 < this.state.quizzes.length) {
      this.loadQuestion(this.state.currentIndex + 1);
    } else {
      this.finishSession();
    }
  }

  // --- 4. 結果画面 ---
  static finishSession() {
    const total = this.state.quizzes.length;
    const correct = this.state.results.filter(r => r.isCorrect).length;
    const wrong = total - correct;

    // 学習履歴保存
    StorageService.recordHistory({
      type: 'suffix_rule',
      total: total,
      correct: correct,
      category: this.state.activeCategory
    });

    GamificationService.finishSession({
      testType: 'grammar',
      testTitle: '助詞・語尾ルール特訓道場',
      correctCount: correct,
      wrongCount: wrong,
      sessionScore: this.state.score,
      sessionXp: this.state.xpEarned
    });

    this.state.view = 'result';
    this.renderResult();
  }

  static renderResult() {
    if (!this.container) return;
    const total = this.state.quizzes.length;
    const correct = this.state.results.filter(r => r.isCorrect).length;
    const percent = total > 0 ? Math.round((correct / total) * 100) : 0;

    this.container.innerHTML = `
      <div class="animate-fade-in max-w-xl mx-auto px-4 py-4 space-y-4">
        <!-- 成績サマリーカード -->
        <div class="bg-gradient-to-br from-rose-500 via-amber-500 to-orange-500 rounded-2xl p-6 text-white text-center shadow-md space-y-2">
          <span class="text-4xl">${percent >= 80 ? '🎉' : '💪'}</span>
          <h2 class="text-xl font-black">特訓完了！</h2>
          <div class="text-4xl font-black tracking-tight my-1">${percent}%</div>
          <p class="text-xs text-white/90 font-medium">正解数: ${correct} / ${total} 問 | 最大コンボ: ${this.state.maxCombo} 連続</p>
          <div class="flex items-center justify-center gap-3 pt-2 text-xs font-bold text-amber-100">
            <span>獲得スコア: +${this.state.score} PTS</span>
            <span>•</span>
            <span>獲得XP: +${this.state.xpEarned} XP</span>
          </div>
        </div>

        <!-- 間違えた問題とルールの復習 -->
        <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
          <h3 class="text-xs font-black text-slate-700 flex items-center justify-between">
            <span>📝 解答結果とルール復習</span>
            <span class="text-[11px] text-slate-400 font-normal">全 ${total} 問</span>
          </h3>

          <div class="space-y-2 max-h-72 overflow-y-auto pr-1">
            ${this.state.results.map((r, i) => `
              <div class="p-3 rounded-xl border ${r.isCorrect ? 'border-slate-100 bg-slate-50/50' : 'border-rose-200 bg-rose-50/40'} text-xs space-y-1">
                <div class="flex items-center justify-between">
                  <span class="font-bold ${r.isCorrect ? 'text-slate-800' : 'text-rose-800'} cyrillic-text">
                    ${r.isCorrect ? '✅' : '❌'} ${r.quiz.sentencePattern || r.quiz.targetWord}
                  </span>
                  <span class="font-mono text-[11px] text-slate-500">
                    回答: <strong class="${r.isCorrect ? 'text-emerald-700' : 'text-rose-700'}">${r.userAnswer}</strong>
                    ${!r.isCorrect ? ` / 正解: <strong class="text-emerald-700">${r.quiz.answer}</strong>` : ''}
                  </span>
                </div>
                <div class="text-[11px] text-slate-600">
                  ⚡ <strong class="text-amber-800">${r.quiz.ruleTip}</strong>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- アクションボタン -->
        <div class="grid grid-cols-2 gap-2.5 pt-1">
          <button type="button" id="btn-retry-course" class="py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-all">
            もう一度挑戦 🔄
          </button>
          <button type="button" id="btn-back-to-menu" class="py-3 bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-bold rounded-xl text-xs transition-all shadow-xs">
            コース選択へ戻る 📋
          </button>
        </div>
      </div>
    `;

    this.container.querySelector('#btn-retry-course').addEventListener('click', () => {
      this.startQuiz(this.state.activeCategory);
    });

    this.container.querySelector('#btn-back-to-menu').addEventListener('click', () => {
      this.state.view = 'menu';
      this.renderMenu();
    });
  }

  // --- 5. 早見表・虎の巻（チートシート）画面 ---
  static renderCheatSheet() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="animate-fade-in max-w-3xl mx-auto px-4 py-4 space-y-5">
        <!-- ヘッダー -->
        <div class="flex items-center justify-between border-b border-slate-200 pb-3">
          <div class="flex items-center gap-2">
            <span class="text-2xl">📜</span>
            <div>
              <h2 class="text-lg font-bold text-slate-800">助詞・語尾ルール早見表（虎の巻）</h2>
              <p class="text-xs text-slate-500">試験や会話で即役立つ、語尾と助詞の結合ルール総まとめ</p>
            </div>
          </div>
          <button type="button" id="btn-close-cheatsheet" class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all">
            ✕ 道場メニューへ
          </button>
        </div>

        <!-- ルール一覧 -->
        <div class="space-y-4">
          ${suffixRuleCategories.map(cat => {
            const list = suffixRuleQuizzes.filter(q => q.category === cat.id);
            return `
              <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3">
                <div class="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div class="flex items-center gap-2">
                    <span class="text-xs font-black text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                      ${cat.badge}
                    </span>
                    <h3 class="text-base font-black text-slate-800">${cat.title}</h3>
                  </div>
                  <button type="button" class="btn-start-course px-2.5 py-1 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-[11px] font-bold shadow-2xs" data-cat="${cat.id}">
                    このルールを特訓 🎯
                  </button>
                </div>

                <div class="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs font-black text-amber-900">
                  ⚡ 公式ルール: ${cat.shortRule}
                </div>

                <p class="text-xs text-slate-600 leading-relaxed">
                  ${cat.description}
                </p>

                <!-- 代表例一覧 -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  ${list.slice(0, 4).map(item => `
                    <div class="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                      <div class="space-y-0.5">
                        <div class="font-bold text-slate-800 cyrillic-text">
                          ${item.sentencePattern ? item.sentencePattern.replace('___', item.answer) : `${item.targetWord} ➜ ${item.answer}`}
                        </div>
                        <div class="text-[11px] text-slate-500">${item.exampleSentenceJa || item.targetWordMeaning}</div>
                      </div>
                      <button type="button" class="btn-speak-cheat p-1 text-slate-400 hover:text-rose-600 transition-colors" data-phrase="${item.exampleSentenceMn || item.answer}">
                        🔊
                      </button>
                    </div>
                  `).join('')}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    this.container.querySelector('#btn-close-cheatsheet').addEventListener('click', () => {
      this.state.view = 'menu';
      this.renderMenu();
    });

    this.container.querySelectorAll('.btn-start-course').forEach(btn => {
      btn.addEventListener('click', () => {
        const cat = btn.dataset.cat;
        this.startQuiz(cat);
      });
    });

    this.container.querySelectorAll('.btn-speak-cheat').forEach(btn => {
      btn.addEventListener('click', () => {
        const phrase = btn.dataset.phrase;
        if (phrase) SpeechService.speak(phrase);
      });
    });
  }
}
