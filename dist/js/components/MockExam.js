// ============================================================
// 総合4択模試コンポーネント（MockExamComponent）
// すべてモンゴル語で質問される本格的な総合模試モード
// ============================================================

import { StorageService } from '../services/storage.js';
import { SpeechService } from '../services/speech.js';
import { SoundEffects, isFuzzyMatch, scrollToQuizTop } from '../utils/helpers.js';
import { MOCK_EXAM_STATIC_QUESTIONS, getMockExamQuestions } from '../data/mockExamData.js';

export class MockExamComponent {
  constructor(container, onNavigate) {
    this.container = container;
    this.onNavigate = onNavigate;

    this.state = {
      view: 'start', // 'start' | 'testing' | 'result'
      config: {
        count: 20,
        category: 'all',
        level: 'all'
      },
      questions: [],
      currentIndex: 0,
      currentQuestion: null,
      hasAnswered: false,
      userChoice: null,
      isCorrect: false,
      results: [],
      activeKeyHandler: null
    };
  }

  render() {
    this.cleanupKeyHandler();
    if (this.state.view === 'start') {
      this.renderStart();
    } else if (this.state.view === 'testing') {
      this.renderTesting();
    } else if (this.state.view === 'result') {
      this.renderResult();
    }
  }

  cleanupKeyHandler() {
    if (this.state.activeKeyHandler) {
      window.removeEventListener('keydown', this.state.activeKeyHandler);
      this.state.activeKeyHandler = null;
    }
  }

  // ------------------------------------------------------------
  // 1. スタート画面（問題数・ジャンル・難易度の設定）
  // ------------------------------------------------------------
  renderStart() {
    const allMistakes = StorageService.getMistakes();
    const mockMistakes = allMistakes.filter(m => m.type === 'mock_exam' && !m.resolved);

    this.container.innerHTML = `
      <div class="animate-fade-in max-w-2xl mx-auto px-4 py-6 space-y-6">
        
        <!-- ヘッダーカード -->
        <div class="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
          <div class="absolute -right-8 -bottom-8 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
          <div class="relative z-10 space-y-2">
            <div class="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-amber-200">
              <span>📝</span>
              <span>Монгол хэлний цогц сорилго</span>
            </div>
            <h1 class="text-2xl sm:text-3xl font-black tracking-tight">総合4択模試モード</h1>
            <p class="text-xs sm:text-sm text-indigo-100 leading-relaxed font-medium">
              すべての設問が<strong>モンゴル語（キリル文字）</strong>で出題される本格的な4択模擬試験です。<br>
              語彙・文法・会話・自己紹介読解・文化の全分野から出題され、回答後は詳しい解説で復習できます。
            </p>
          </div>
        </div>

        <!-- 設定フォームカード -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-5">
          
          <!-- 問題数選択 -->
          <div>
            <label class="block text-xs font-black text-slate-700 dark:text-slate-300 mb-2">
              📊 出題する問題数
            </label>
            <div class="grid grid-cols-2 sm:grid-cols-5 gap-2">
              ${[
                { label: '10問', val: 10, sub: 'サクッと' },
                { label: '20問', val: 20, sub: '標準・推奨' },
                { label: '30問', val: 30, sub: 'しっかり' },
                { label: '50問', val: 50, sub: '本格模試' },
                { label: '全問', val: 'all', sub: '限界挑戦' }
              ].map(opt => `
                <button type="button" class="btn-select-count p-2.5 rounded-xl border-2 text-center transition-all cursor-pointer select-none ${
                  this.state.config.count === opt.val
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 font-black shadow-xs'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                }" data-count="${opt.val}">
                  <div class="text-sm font-bold">${opt.label}</div>
                  <div class="text-[10px] text-slate-400 font-medium">${opt.sub}</div>
                </button>
              `).join('')}
            </div>
          </div>

          <!-- 分野・カテゴリ選択 -->
          <div>
            <label class="block text-xs font-black text-slate-700 dark:text-slate-300 mb-2">
              🎯 出題分野
            </label>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
              ${[
                { label: '総合ランダム', val: 'all', desc: '全分野からバランスよく' },
                { label: '語彙・意味', val: 'vocab', desc: '単語・反対語・類義語' },
                { label: '文法・助詞', val: 'grammar', desc: '格変化・時制・語幹' },
                { label: '会話・挨拶', val: 'conversation', desc: '日常会話・状況応答' },
                { label: '口頭試問・読解', val: 'interview', desc: '自己紹介13テーマ読解' },
                { label: '文化・生活', val: 'culture', desc: '五畜・首都・習慣' }
              ].map(cat => `
                <button type="button" class="btn-select-category p-2.5 rounded-xl border-2 text-left transition-all cursor-pointer select-none ${
                  this.state.config.category === cat.val
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 font-bold shadow-xs'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                }" data-category="${cat.val}">
                  <div class="text-xs font-bold">${cat.label}</div>
                  <div class="text-[10px] text-slate-400">${cat.desc}</div>
                </button>
              `).join('')}
            </div>
          </div>

          <!-- 難易度選択 -->
          <div>
            <label class="block text-xs font-black text-slate-700 dark:text-slate-300 mb-2">
              ⭐ 難易度
            </label>
            <div class="grid grid-cols-3 gap-2">
              ${[
                { label: 'すべて', val: 'all' },
                { label: '初級 (Basic)', val: 'basic' },
                { label: '標準 (Standard)', val: 'standard' }
              ].map(lvl => `
                <button type="button" class="btn-select-level p-2 rounded-xl border-2 text-center text-xs font-bold transition-all cursor-pointer select-none ${
                  this.state.config.level === lvl.val
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                }" data-level="${lvl.val}">
                  ${lvl.label}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- 特徴案内 -->
          <div class="bg-indigo-50/70 dark:bg-indigo-950/30 p-3.5 rounded-xl border border-indigo-100 dark:border-indigo-900/40 space-y-1 text-xs text-indigo-900 dark:text-indigo-200">
            <div class="font-bold flex items-center gap-1.5">
              <span>💡</span> 模試モードの特徴
            </div>
            <ul class="list-disc list-inside space-y-0.5 text-[11px] text-indigo-800 dark:text-indigo-300">
              <li>問題文はすべてモンゴル語で提示され、実際の試験感覚で取り組めます。</li>
              <li>間違えた問題は<strong>4択の選択肢を保持したまま「間違いノート」に自動保存</strong>されます。</li>
              <li>忘却曲線（SRS）にも4択問題として組み込まれ、定期的に復習できます。</li>
              <li>回答後は正誤にかかわらず、質問文の日本語訳と詳しい根拠解説が表示されます。</li>
            </ul>
          </div>

          <!-- 開始ボタン -->
          <button type="button" id="btn-start-mock-exam" class="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black rounded-2xl shadow-lg transition-all active:scale-98 text-base flex items-center justify-center gap-2 cursor-pointer">
            <span>🚀</span>
            <span>模試を開始する (${this.state.config.count === 'all' ? '全問' : this.state.config.count + '問'}) →</span>
          </button>

          ${mockMistakes.length > 0 ? `
            <button type="button" id="btn-start-mock-mistakes" class="w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-200 font-bold rounded-xl border border-rose-200 dark:border-rose-800 text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer">
              <span>🔥</span>
              <span>間違えた模試問題だけを4択で再特訓 (${mockMistakes.length}問)</span>
            </button>
          ` : ''}

        </div>

      </div>
    `;

    // イベントバインド
    this.container.querySelectorAll('.btn-select-count').forEach(btn => {
      btn.addEventListener('click', () => {
        const c = btn.getAttribute('data-count');
        this.state.config.count = c === 'all' ? 'all' : parseInt(c, 10);
        this.renderStart();
      });
    });

    this.container.querySelectorAll('.btn-select-category').forEach(btn => {
      btn.addEventListener('click', () => {
        this.state.config.category = btn.getAttribute('data-category');
        this.renderStart();
      });
    });

    this.container.querySelectorAll('.btn-select-level').forEach(btn => {
      btn.addEventListener('click', () => {
        this.state.config.level = btn.getAttribute('data-level');
        this.renderStart();
      });
    });

    const startBtn = this.container.querySelector('#btn-start-mock-exam');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        this.startExam();
      });
    }

    const mistakesBtn = this.container.querySelector('#btn-start-mock-mistakes');
    if (mistakesBtn) {
      mistakesBtn.addEventListener('click', () => {
        this.startMistakesOnly();
      });
    }
  }

  // ------------------------------------------------------------
  // 模試開始処理
  // ------------------------------------------------------------
  startExam() {
    const vocab = StorageService.getVocabulary();
    const questions = getMockExamQuestions({
      count: this.state.config.count,
      category: this.state.config.category,
      level: this.state.config.level,
      vocabList: vocab
    });

    if (!questions || questions.length === 0) {
      alert('該当する模試問題がありませんでした。条件を変更してください。');
      return;
    }

    this.state.questions = questions;
    this.state.currentIndex = 0;
    this.state.currentQuestion = questions[0];
    this.state.hasAnswered = false;
    this.state.userChoice = null;
    this.state.isCorrect = false;
    this.state.results = [];
    this.state.view = 'testing';
    this.renderTesting();
  }

  startMistakesOnly() {
    const allMistakes = StorageService.getMistakes();
    const mockMistakes = allMistakes.filter(m => m.type === 'mock_exam' && !m.resolved && m.options && m.options.length >= 2);

    if (mockMistakes.length === 0) {
      alert('現在、未克服の模試間違い問題はありません！');
      return;
    }

    this.state.questions = mockMistakes.map(m => ({
      id: m.id,
      category: m.category || 'vocab',
      categoryLabel: '間違い再特訓',
      question: m.question,
      options: m.options,
      correctAnswer: m.correctAnswer,
      explanation: m.explanation || '間違えた問題の再復習です。',
      isFromMistakes: true
    }));

    this.state.currentIndex = 0;
    this.state.currentQuestion = this.state.questions[0];
    this.state.hasAnswered = false;
    this.state.userChoice = null;
    this.state.isCorrect = false;
    this.state.results = [];
    this.state.view = 'testing';
    this.renderTesting();
  }

  // ------------------------------------------------------------
  // 2. 試験実施画面
  // ------------------------------------------------------------
  renderTesting() {
    this.cleanupKeyHandler();
    const q = this.state.currentQuestion;
    const idx = this.state.currentIndex;
    const total = this.state.questions.length;
    const progressPercent = Math.round(((idx) / total) * 100);

    const categoryBadge = q.categoryLabel || '総合問題';

    this.container.innerHTML = `
      <div class="animate-fade-in max-w-xl mx-auto px-4 py-3 space-y-4">
        
        <!-- プログレスバー＆中断ボタン -->
        <div class="space-y-1.5">
          <div class="flex justify-between items-center text-xs font-bold text-slate-500">
            <span class="flex items-center gap-1.5">
              <span class="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[11px] font-black">第 ${idx + 1} / ${total} 問</span>
              <span class="text-slate-400">|</span>
              <span class="text-indigo-600 font-bold">${categoryBadge}</span>
            </span>
            <button type="button" id="btn-quit-mock-test" class="text-slate-400 hover:text-slate-700 cursor-pointer">
              中断・終了
            </button>
          </div>
          <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div class="bg-gradient-to-r from-indigo-500 to-purple-600 h-full transition-all duration-300" style="width: ${progressPercent}%"></div>
          </div>
        </div>

        <!-- モンゴル語問題文カード -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm text-center relative overflow-hidden">
          
          <div class="flex items-center justify-center gap-2 mb-3">
            <span class="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              モンゴル語の設問
            </span>
            <button type="button" id="btn-mock-speech" class="w-7 h-7 rounded-full bg-slate-100 hover:bg-indigo-100 text-slate-600 hover:text-indigo-700 flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95" title="音声を聴く">
              <span>🔊</span>
            </button>
          </div>

          <!-- 設問テキスト（大きく明瞭なキリル文字） -->
          <div class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white cyrillic-text leading-relaxed tracking-tight py-2">
            ${q.question}
          </div>

          <div class="text-xs text-slate-400 font-medium mt-1">
            正しいと思う選択肢（A〜D）を1つ選んでください
          </div>
        </div>

        <!-- 4つの選択肢エリア -->
        <div class="grid grid-cols-1 gap-2.5 pt-1">
          ${q.options.map((opt, oIdx) => {
            const letter = ['A', 'B', 'C', 'D'][oIdx] || (oIdx + 1);
            let btnStyle = 'border-slate-200 hover:border-indigo-400 bg-white hover:bg-indigo-50/50 text-slate-800';
            let badgeStyle = 'bg-slate-100 text-slate-600 group-hover:bg-indigo-600 group-hover:text-white';
            let iconMark = '';

            if (this.state.hasAnswered) {
              const isCorrectOpt = isFuzzyMatch(opt, q.correctAnswer);
              const isUserChoice = isFuzzyMatch(opt, this.state.userChoice);

              if (isCorrectOpt) {
                btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-300 font-black';
                badgeStyle = 'bg-emerald-600 text-white';
                iconMark = '<span class="text-emerald-600 font-black ml-auto">✓ 正解</span>';
              } else if (isUserChoice) {
                btnStyle = 'border-rose-400 bg-rose-50 text-rose-950 font-bold';
                badgeStyle = 'bg-rose-600 text-white';
                iconMark = '<span class="text-rose-600 font-black ml-auto">✕ あなたの回答</span>';
              } else {
                btnStyle = 'border-slate-200 opacity-60 bg-white text-slate-500';
                badgeStyle = 'bg-slate-100 text-slate-400';
              }
            }

            return `
              <button type="button" class="btn-mock-choice w-full p-4 rounded-xl border-2 ${btnStyle} text-left transition-all flex items-center gap-3.5 select-none ${!this.state.hasAnswered ? 'cursor-pointer active:scale-98 hover:shadow-xs group' : 'cursor-default'}" data-choice="${opt}" ${this.state.hasAnswered ? 'disabled' : ''}>
                <span class="w-8 h-8 rounded-lg ${badgeStyle} font-black text-sm flex items-center justify-center shrink-0 transition-colors">
                  ${letter}
                </span>
                <span class="text-sm sm:text-base font-bold leading-snug cyrillic-text">
                  ${opt}
                </span>
                ${iconMark}
              </button>
            `;
          }).join('')}
        </div>

        <!-- 回答後の詳細解説カード（正誤に関わらず必ず展開） -->
        ${this.state.hasAnswered ? `
          <div class="animate-fade-in space-y-3 pt-2">
            
            <!-- 正誤バナー -->
            <div class="p-3.5 rounded-2xl border ${
              this.state.isCorrect
                ? 'bg-emerald-100 border-emerald-400 text-emerald-950'
                : 'bg-rose-100 border-rose-300 text-rose-950'
            } flex items-center justify-between gap-3 shadow-2xs">
              <div class="flex items-center gap-2">
                <span class="text-2xl">${this.state.isCorrect ? '🎉' : '⚠️'}</span>
                <div>
                  <div class="text-base font-black">
                    ${this.state.isCorrect ? '正解です！（Зөв байна!）' : '不正解です（Буруу байна）'}
                  </div>
                  <div class="text-xs font-medium">
                    ${this.state.isCorrect ? '見事に正解を選びました！' : '間違えた問題は4択のまま間違いノートに自動保存されました。'}
                  </div>
                </div>
              </div>
              <div class="text-xs font-black px-2.5 py-1 rounded-full ${this.state.isCorrect ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'} shrink-0">
                ${this.state.isCorrect ? '+1 点' : '復習対象'}
              </div>
            </div>

            <!-- 解説カード -->
            <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3 text-xs">
              
              <!-- 設問の日本語訳 -->
              <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div class="text-[11px] font-black text-slate-500 mb-1 flex items-center gap-1">
                  <span>🇯🇵</span> 設問の日本語の意味
                </div>
                <div class="text-sm font-bold text-slate-800">
                  ${q.question}
                </div>
              </div>

              <!-- 正解のポイントと根拠 -->
              <div class="space-y-1">
                <div class="font-black text-slate-700 flex items-center gap-1 text-xs">
                  <span>💡</span> 正解の根拠・解説
                </div>
                <div class="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 text-indigo-950 text-xs sm:text-sm leading-relaxed">
                  ${q.explanation || '正解と各選択肢の違いをしっかり確認しましょう。'}
                </div>
              </div>

              ${q.points ? `
                <div class="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-950 text-xs font-medium">
                  📌 <strong>重要ポイント:</strong> ${q.points}
                </div>
              ` : ''}
            </div>

            <!-- 次へ進むボタン -->
            <button type="button" id="btn-next-mock-question" class="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black rounded-2xl shadow-md transition-all active:scale-98 text-base flex items-center justify-center gap-2 cursor-pointer">
              <span>${idx + 1 < total ? '次の問題へ進む (Enter) →' : '模試の結果を見る 🏆 →'}</span>
            </button>

          </div>
        ` : ''}

      </div>
    `;

    // イベントバインド
    const quitBtn = this.container.querySelector('#btn-quit-mock-test');
    if (quitBtn) {
      quitBtn.addEventListener('click', () => {
        if (confirm('模試を中断してスタート画面に戻りますか？')) {
          this.state.view = 'start';
          this.render();
        }
      });
    }

    // 音声読み上げボタン
    const speechBtn = this.container.querySelector('#btn-mock-speech');
    if (speechBtn) {
      speechBtn.addEventListener('click', () => {
        SpeechService.speak(q.question);
      });
    }

    if (!this.state.hasAnswered) {
      const choiceBtns = this.container.querySelectorAll('.btn-mock-choice');
      choiceBtns.forEach((btn, cIdx) => {
        btn.addEventListener('click', () => {
          const choice = btn.getAttribute('data-choice');
          this.submitAnswer(choice);
        });
      });

      // キーボードショートカット（1, 2, 3, 4 または A, B, C, D）
      this.state.activeKeyHandler = (e) => {
        const key = e.key.toUpperCase();
        const map = { '1': 0, '2': 1, '3': 2, '4': 3, 'A': 0, 'B': 1, 'C': 2, 'D': 3 };
        if (map[key] !== undefined && choiceBtns[map[key]]) {
          e.preventDefault();
          choiceBtns[map[key]].click();
        }
      };
      window.addEventListener('keydown', this.state.activeKeyHandler);
    } else {
      const nextBtn = this.container.querySelector('#btn-next-mock-question');
      if (nextBtn) {
        let allowEnter = false;
        setTimeout(() => { allowEnter = true; }, 400);

        nextBtn.addEventListener('click', () => {
          this.nextQuestion();
        });

        this.state.activeKeyHandler = (e) => {
          if (e.key === 'Enter') {
            if (!allowEnter) return;
            e.preventDefault();
            nextBtn.click();
          }
        };
        window.addEventListener('keydown', this.state.activeKeyHandler);
      }
    }
  }

  // ------------------------------------------------------------
  // 回答判定処理
  // ------------------------------------------------------------
  submitAnswer(choice) {
    const q = this.state.currentQuestion;
    const isCorrect = isFuzzyMatch(choice, q.correctAnswer);

    this.state.hasAnswered = true;
    this.state.userChoice = choice;
    this.state.isCorrect = isCorrect;

    this.state.results.push({
      question: q,
      userChoice: choice,
      isCorrect: isCorrect
    });

    if (isCorrect) {
      SoundEffects.playCorrect();
      // もし間違いノートからの再特訓だった場合は克服処理
      if (q.isFromMistakes) {
        StorageService.recordMistakeAnswer(q, true);
      }
    } else {
      SoundEffects.playWrong();
      // 間違いノートへ「4択選択肢 options」を保持したまま収納！
      StorageService.recordMistake({
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        userAnswer: choice,
        type: 'mock_exam',
        category: q.categoryLabel || '4択模試',
        explanation: `${q.explanation || ''} 【ポイント】${q.points || ''}`
      });
    }

    scrollToQuizTop(this.container);
    this.renderTesting();
  }

  nextQuestion() {
    this.cleanupKeyHandler();
    scrollToQuizTop(this.container);
    if (this.state.currentIndex + 1 < this.state.questions.length) {
      this.state.currentIndex += 1;
      this.state.currentQuestion = this.state.questions[this.state.currentIndex];
      this.state.hasAnswered = false;
      this.state.userChoice = null;
      this.state.isCorrect = false;
      this.renderTesting();
    } else {
      this.state.view = 'result';
      this.renderResult();
    }
  }

  // ------------------------------------------------------------
  // 3. 結果発表画面
  // ------------------------------------------------------------
  renderResult() {
    this.cleanupKeyHandler();
    const results = this.state.results;
    const total = results.length;
    const correctCount = results.filter(r => r.isCorrect).length;
    const wrongCount = total - correctCount;
    const score = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    const isPassed = score >= 80;

    // 学習履歴に記録
    StorageService.recordHistory({
      type: 'mock_exam',
      category: '総合4択模試',
      total: total,
      correct: correctCount,
      score: score
    });

    this.container.innerHTML = `
      <div class="animate-fade-in max-w-xl mx-auto px-4 py-6 space-y-6">
        
        <!-- 結果サマリーカード -->
        <div class="bg-gradient-to-r ${isPassed ? 'from-emerald-600 to-teal-600' : 'from-indigo-600 to-purple-600'} rounded-3xl p-6 text-white text-center shadow-lg relative overflow-hidden">
          <div class="space-y-2">
            <div class="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-xs font-bold">
              <span>${isPassed ? '🎉 模試合格' : '📝 模試完了'}</span>
            </div>
            <div class="text-5xl sm:text-6xl font-black tracking-tight my-2">
              ${score}<span class="text-2xl font-bold">点</span>
            </div>
            <p class="text-sm font-bold text-white/90">
              ${isPassed ? '素晴らしいスコアです！合格基準（80点）を達成しました！' : 'お疲れ様でした！間違えた問題を復習して次回80点以上を目指しましょう！'}
            </p>
          </div>

          <!-- スコア詳細バッジ -->
          <div class="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-white/20 text-xs">
            <div>
              <div class="text-white/70">出題数</div>
              <div class="text-lg font-black">${total}問</div>
            </div>
            <div>
              <div class="text-emerald-200">正解</div>
              <div class="text-lg font-black text-emerald-100">${correctCount}問</div>
            </div>
            <div>
              <div class="text-rose-200">不正解</div>
              <div class="text-lg font-black text-rose-100">${wrongCount}問</div>
            </div>
          </div>
        </div>

        <!-- アクションボタン -->
        <div class="space-y-2.5">
          ${wrongCount > 0 ? `
            <button type="button" id="btn-retry-mock-mistakes" class="w-full py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-xl shadow-md transition-all active:scale-98 text-sm flex items-center justify-center gap-2 cursor-pointer">
              <span>🔥</span>
              <span>間違えた問題（${wrongCount}問）を4択のまま再特訓する</span>
            </button>
          ` : ''}

          <button type="button" id="btn-restart-mock" class="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-sm transition-all active:scale-98 text-sm flex items-center justify-center gap-2 cursor-pointer">
            <span>🔄</span>
            <span>別の設定で模試を受ける</span>
          </button>

          <button type="button" id="btn-back-home" class="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all active:scale-98 text-sm flex items-center justify-center gap-2 cursor-pointer">
            <span>🏠</span>
            <span>ホームに戻る</span>
          </button>
        </div>

        <!-- 全問題の振り返りリスト -->
        <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
          <h3 class="text-sm font-black text-slate-800 flex items-center gap-1.5">
            <span>📋</span> 解答一覧と詳細解説
          </h3>

          <div class="space-y-3">
            ${results.map((r, rIdx) => `
              <div class="p-3.5 rounded-xl border ${r.isCorrect ? 'border-emerald-200 bg-emerald-50/20' : 'border-rose-200 bg-rose-50/20'} space-y-2 text-xs">
                <div class="flex items-start justify-between gap-2">
                  <div class="flex items-center gap-1.5">
                    <span class="w-5 h-5 rounded-full ${r.isCorrect ? 'bg-emerald-600' : 'bg-rose-600'} text-white text-[10px] font-black flex items-center justify-center">
                      ${r.isCorrect ? '✓' : '✕'}
                    </span>
                    <span class="font-bold text-slate-800 cyrillic-text">第 ${rIdx + 1} 問: ${r.question.question}</span>
                  </div>
                  <span class="text-[10px] px-2 py-0.5 rounded-full ${r.isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'} font-bold shrink-0">
                    ${r.isCorrect ? '正解' : '不正解'}
                  </span>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] pt-1">
                  <div>正解: <strong class="text-emerald-700 font-bold">${r.question.correctAnswer}</strong></div>
                  <div>あなたの回答: <strong class="${r.isCorrect ? 'text-emerald-700' : 'text-rose-700'} font-bold">${r.userChoice}</strong></div>
                </div>

                <div class="p-2 bg-white rounded-lg border border-slate-200 text-[11px] text-slate-600 leading-relaxed">
                  ${r.question.explanation}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

      </div>
    `;

    // イベントバインド
    const retryMistakesBtn = this.container.querySelector('#btn-retry-mock-mistakes');
    if (retryMistakesBtn) {
      retryMistakesBtn.addEventListener('click', () => {
        const wrongQuestions = results.filter(r => !r.isCorrect).map(r => r.question);
        this.state.questions = wrongQuestions;
        this.state.currentIndex = 0;
        this.state.currentQuestion = wrongQuestions[0];
        this.state.hasAnswered = false;
        this.state.userChoice = null;
        this.state.isCorrect = false;
        this.state.results = [];
        this.state.view = 'testing';
        this.renderTesting();
      });
    }

    const restartBtn = this.container.querySelector('#btn-restart-mock');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        this.state.view = 'start';
        this.render();
      });
    }

    const backHomeBtn = this.container.querySelector('#btn-back-home');
    if (backHomeBtn) {
      backHomeBtn.addEventListener('click', () => {
        if (this.onNavigate) this.onNavigate('home');
      });
    }
  }
}
