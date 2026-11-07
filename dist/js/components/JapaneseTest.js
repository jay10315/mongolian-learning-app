// 日本語訳専用テストコンポーネント（モンゴル語 → 日本語 記述・4択テスト）
import { StorageService } from '../services/storage.js';
import { SpeechService } from '../services/speech.js';
import { isWordAnswerMatch, getWordGrammarDetails, renderGrammarExplanationHTML, shuffleArray, SoundEffects, isPronunciationCautionWord } from '../utils/helpers.js';
import { GamificationService } from '../services/gamification.js';
import { PenguinMascot } from './PenguinMascot.js';

export class JapaneseTestComponent {
  static state = {
    view: 'settings', // 'settings' | 'testing' | 'result'
    settings: {
      mode: 'text', // 'text' (記述) | 'choice_4' (4択)
      count: 10,
      category: 'all',
      filter: 'all' // 'all' | 'srs_due' | 'high_risk' | 'mistakes_only' | 'unlearned' | 'verbs_only' | 'nouns_only'
    },
    questions: [],
    currentIndex: 0,
    currentQuestion: null,
    choices: [],
    userAnswer: '',
    hasAnswered: false,
    isCorrect: false,
    lastSrsUpdate: null,
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

  // --- 1. 設定画面 ---
  static renderSettings() {
    const vocabList = StorageService.getVocabulary();
    const categories = Array.from(new Set(vocabList.map(v => v.category || 'その他'))).filter(Boolean);

    this.container.innerHTML = `
      <div class="animate-fade-in max-w-xl mx-auto px-4 py-4 space-y-5">
        <div class="flex items-center justify-between border-b border-slate-200 pb-3">
          <div class="flex items-center gap-2">
            <span class="text-2xl">🇯🇵</span>
            <div>
              <h2 class="text-lg font-bold text-slate-800">日本語訳テストの設定</h2>
              <p class="text-xs text-slate-500">モンゴル語を見て、日本語の意味・訳を答えるテスト</p>
            </div>
          </div>
          <button type="button" id="btn-back-home" class="text-xs text-slate-500 hover:text-slate-800">
            ✕ ホームへ
          </button>
        </div>

        <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          
          <!-- 出題形式 -->
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-2">回答形式</label>
            <div class="grid grid-cols-2 gap-2 text-xs">
              <label class="flex items-center gap-2 p-3 rounded-xl border cursor-pointer hover:bg-slate-50 ${this.state.settings.mode === 'text' ? 'border-rose-600 bg-rose-50/50 text-rose-900 font-bold' : 'border-slate-200'}">
                <input type="radio" name="ja-mode" value="text" ${this.state.settings.mode === 'text' ? 'checked' : ''} class="hidden">
                <div class="text-left">
                  <div class="text-sm">✍️ 記述テスト</div>
                  <div class="text-[11px] text-slate-500 font-normal">日本語の意味を入力</div>
                </div>
              </label>

              <label class="flex items-center gap-2 p-3 rounded-xl border cursor-pointer hover:bg-slate-50 ${this.state.settings.mode === 'choice_4' ? 'border-rose-600 bg-rose-50/50 text-rose-900 font-bold' : 'border-slate-200'}">
                <input type="radio" name="ja-mode" value="choice_4" ${this.state.settings.mode === 'choice_4' ? 'checked' : ''} class="hidden">
                <div class="text-left">
                  <div class="text-sm">🎯 4択選択テスト</div>
                  <div class="text-[11px] text-slate-500 font-normal">4つの訳からタップ</div>
                </div>
              </label>
            </div>
          </div>

          <!-- 出題数 -->
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1.5">出題数</label>
            <div class="grid grid-cols-4 gap-2">
              ${[5, 10, 20, 'all'].map(num => `
                <button type="button" class="btn-ja-count py-2 text-xs font-bold rounded-lg border transition-all ${
                  this.state.settings.count === num ? 'bg-rose-600 text-white border-rose-600 shadow-xs' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }" data-count="${num}">
                  ${num === 'all' ? '全問' : `${num}問`}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- カテゴリー絞り込み -->
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1.5">課・カテゴリー</label>
            <select id="select-ja-category" class="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium">
              <option value="all">すべてのカテゴリー（全${vocabList.length}語）</option>
              ${categories.map(cat => `
                <option value="${cat}" ${this.state.settings.category === cat ? 'selected' : ''}>${cat}</option>
              `).join('')}
            </select>
          </div>

          <!-- 学習状態フィルター -->
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1.5">出題条件の絞り込み</label>
            <select id="select-ja-filter" class="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium">
              <option value="all" ${this.state.settings.filter === 'all' ? 'selected' : ''}>すべての単語からランダム出題</option>
              <option value="srs_due" ${this.state.settings.filter === 'srs_due' ? 'selected' : ''}>⚡ 忘却曲線の復習期日（今日復習すべき語）</option>
              <option value="high_risk" ${this.state.settings.filter === 'high_risk' ? 'selected' : ''}>⚠️ 忘却リスク高（記憶が薄れかけている語）</option>
              <option value="mistakes_only" ${this.state.settings.filter === 'mistakes_only' ? 'selected' : ''}>🔥 間違えた単語（苦手克服）</option>
              <option value="verbs_only" ${this.state.settings.filter === 'verbs_only' ? 'selected' : ''}>🌱 動詞のみに絞り込み</option>
              <option value="nouns_only" ${this.state.settings.filter === 'nouns_only' ? 'selected' : ''}>🏛 名詞のみに絞り込み</option>
              <option value="unlearned" ${this.state.settings.filter === 'unlearned' ? 'selected' : ''}>✨ 未学習の単語のみ</option>
            </select>
          </div>

          <button type="button" id="btn-start-ja-test" class="w-full py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-md transition-all active:scale-98 text-sm mt-3 flex items-center justify-center gap-2">
            <span>🚀</span> 日本語訳テストを開始する
          </button>
        </div>
      </div>
    `;

    this.container.querySelector('#btn-back-home').addEventListener('click', () => {
      if (this.onNavigate) this.onNavigate('home');
    });

    this.container.querySelectorAll('input[name="ja-mode"]').forEach(r => {
      r.addEventListener('change', (e) => {
        this.state.settings.mode = e.target.value;
        this.renderSettings();
      });
    });

    this.container.querySelectorAll('.btn-ja-count').forEach(btn => {
      btn.addEventListener('click', () => {
        const c = btn.getAttribute('data-count');
        this.state.settings.count = c === 'all' ? 'all' : parseInt(c, 10);
        this.renderSettings();
      });
    });

    this.container.querySelector('#select-ja-category').addEventListener('change', (e) => {
      this.state.settings.category = e.target.value;
    });

    this.container.querySelector('#select-ja-filter').addEventListener('change', (e) => {
      this.state.settings.filter = e.target.value;
    });

    this.container.querySelector('#btn-start-ja-test').addEventListener('click', () => {
      this.startTest();
    });
  }

  // --- 2. 開始処理 ---
  static startTest() {
    let list = [...StorageService.getVocabulary()];

    if (this.state.settings.category !== 'all') {
      list = list.filter(v => v.category === this.state.settings.category);
    }

    if (this.state.settings.filter === 'srs_due') {
      list = list.filter(v => v.srsLevel > 0 && v.isDue);
    } else if (this.state.settings.filter === 'high_risk') {
      list = list.filter(v => v.srsLevel > 0 && v.forgettingRisk >= 60);
    } else if (this.state.settings.filter === 'mistakes_only') {
      const mistakeList = StorageService.getMistakes().filter(m => !m.resolved);
      const mistakeWords = new Set(mistakeList.map(m => m.correctAnswer.toLowerCase()));
      list = list.filter(v => mistakeWords.has(v.mongolian.toLowerCase()) || mistakeWords.has(v.japanese) || (v.root && mistakeWords.has(v.root.toLowerCase())));
    } else if (this.state.settings.filter === 'verbs_only') {
      list = list.filter(v => v.isVerb || (v.pos && v.pos.includes('動詞')));
    } else if (this.state.settings.filter === 'nouns_only') {
      list = list.filter(v => v.pos && v.pos.includes('名詞'));
    } else if (this.state.settings.filter === 'unlearned') {
      list = list.filter(v => v.srsLevel === 0);
    }

    if (list.length === 0) {
      alert('条件に一致する単語がありません。設定条件を変更してください。');
      return;
    }

    list = shuffleArray(list);
    GamificationService.resetSessionCombo();
    this.state.sessionScore = 0;
    this.state.sessionXp = 0;
    this.state.lastGameFeedback = null;
    this.state.sessionResult = null;

    const count = this.state.settings.count === 'all' ? list.length : Math.min(this.state.settings.count, list.length);
    this.state.questions = list.slice(0, count);
    this.state.currentIndex = 0;
    this.state.results = [];
    this.state.resultFilter = 'all';
    this.state.view = 'testing';
    this.loadQuestion(0);
  }

  static loadQuestion(index) {
    this.state.currentIndex = index;
    const q = this.state.questions[index];
    this.state.currentQuestion = q;
    this.state.userAnswer = '';
    this.state.hasAnswered = false;
    this.state.isCorrect = false;

    // 4択選択肢の作成
    if (this.state.settings.mode === 'choice_4') {
      const allVocab = StorageService.getVocabulary();
      const otherVocab = allVocab.filter(v => v.id !== q.id && v.japanese !== q.japanese);
      const distractors = shuffleArray(otherVocab).slice(0, 3);
      this.state.choices = shuffleArray([q, ...distractors]);
    }

    this.renderTesting();
  }

  // --- 3. テスト実行画面 ---
  static renderTesting() {
    const q = this.state.currentQuestion;
    const idx = this.state.currentIndex;
    const total = this.state.questions.length;
    const progressPercent = Math.round((idx / total) * 100);
    const mode = this.state.settings.mode;
    const details = getWordGrammarDetails(q);
    const isV = details.isVerb;

    this.container.innerHTML = `
      <div class="animate-fade-in max-w-xl mx-auto px-4 py-3 space-y-3">
        
        <!-- 進捗ヘッダー ＆ ゲームHUD -->
        <div class="space-y-1.5">
          <div class="flex justify-between items-center text-xs font-bold text-slate-500">
            <span class="flex items-center gap-2">
              <span>🇯🇵 日本語訳テスト</span>
              <span class="text-rose-600 font-extrabold">${idx + 1} / ${total}</span>
              ${GamificationService.sessionCombo >= 2 ? `
                <span class="px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200 animate-bounce text-[10px]">
                  🔥 ${GamificationService.sessionCombo} COMBO
                </span>
              ` : ''}
            </span>
            <div class="flex items-center gap-3">
              <span class="text-amber-600 font-extrabold">+${this.state.sessionScore || 0} PTS</span>
              <span class="text-emerald-600 font-extrabold">+${this.state.sessionXp || 0} XP</span>
              <button type="button" id="btn-quit-ja-test" class="text-slate-400 hover:text-slate-700 ml-1">中断</button>
            </div>
          </div>
          <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div class="bg-rose-500 h-full transition-all duration-300" style="width: ${progressPercent}%"></div>
          </div>
        </div>

        <!-- 問題カード（モンゴル語表示） -->
        <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm text-center relative overflow-hidden space-y-2">
          <div class="text-xs font-bold text-slate-400">
            モンゴル語を見て【日本語訳（意味）】を答えてください
          </div>

          <!-- モンゴル語メイン表記（辞書形） -->
          <div class="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight cyrillic-text pt-1">
            ${details.dictForm || q.mongolian}
          </div>

          <!-- 品詞 ＆ 語幹ヒント（タップで展開） -->
          <div class="pt-1 text-center">
            <button type="button" id="btn-toggle-ja-hint" class="text-xs text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 px-3 py-1 rounded-full font-bold border border-slate-200 transition-all inline-flex items-center gap-1.5 cursor-pointer select-none active:scale-95 shadow-2xs">
              <span>💡</span>
              <span id="ja-hint-toggle-text">ヒント・品詞を見る ▼</span>
            </button>
            <div id="ja-hint-content" class="hidden mt-2 animate-fade-in flex flex-wrap items-center justify-center gap-1.5">
              <span class="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
                【品詞: ${q.pos || '単語'}】
              </span>
              ${isV && details.root ? `
                <span class="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                  🌱 語幹: <span class="cyrillic-text">${details.root}</span>
                </span>
              ` : ''}
              ${(typeof isPronunciationCautionWord === 'function' && isPronunciationCautionWord(q) && q.pronunciation) ? `
                <span class="text-xs text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full font-bold border border-amber-200">
                  ⚠️ 読み注意: ${q.pronunciation}
                </span>
              ` : ''}
            </div>
          </div>

          <!-- 音声再生ボタン -->
          <div class="pt-2">
            <button type="button" id="btn-speak-ja-question" class="text-xs text-rose-700 bg-rose-50 hover:bg-rose-100 px-3.5 py-1.5 rounded-full font-bold inline-flex items-center gap-1.5 transition-all shadow-2xs">
              🔊 ネイティブ発音を聞く
            </button>
          </div>
        </div>

        <!-- 解答セクション -->
        ${!this.state.hasAnswered ? `
          <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
            
            ${mode === 'choice_4' ? `
              <!-- 4択選択ボタン群 -->
              <div class="grid grid-cols-1 gap-2">
                ${this.state.choices.map((choice, i) => `
                  <button type="button" class="btn-ja-choice text-left p-3.5 rounded-xl border border-slate-200 hover:border-rose-500 hover:bg-rose-50/50 text-slate-800 font-semibold text-sm transition-all active:scale-98 flex items-center justify-between" data-choice-id="${choice.id}">
                    <span>
                      <span class="inline-block w-6 text-slate-400 font-normal">${i + 1}.</span>
                      ${choice.japanese}
                    </span>
                    <span class="text-xs text-slate-400 font-normal">選択</span>
                  </button>
                `).join('')}
              </div>
            ` : `
              <!-- 日本語 記述入力フォーム -->
              <div class="space-y-2">
                <input type="text" id="input-ja-answer" 
                  class="w-full text-base sm:text-lg p-3.5 rounded-xl border-2 border-slate-300 focus:border-rose-500 focus:outline-hidden text-center font-bold text-slate-800" 
                  placeholder="日本語の意味を入力..." 
                  autofocus autocomplete="off">

                <button type="button" id="btn-submit-ja-answer" class="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-md transition-all active:scale-98 text-sm">
                  回答する（Enter）
                </button>
              </div>
            `}
          </div>
        ` : `
          <!-- 回答後フィードバック・解説 -->
          <div class="animate-fade-in space-y-3">
            <div class="p-4 sm:p-5 rounded-2xl border ${this.state.isCorrect ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950' : 'bg-rose-50/90 border-rose-300 text-rose-950'} shadow-sm">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-2xl">${this.state.isCorrect ? '⭕ 正解！' : '❌ 不正解'}</span>
              </div>

              ${this.state.lastSrsUpdate ? `
                <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-2 ${
                  this.state.isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                }">
                  <span>${this.state.isCorrect ? '📈' : '📉'}</span>
                  <span>習熟度: Lv.${this.state.lastSrsUpdate.srsLevel} (${this.state.isCorrect ? `${this.state.lastSrsUpdate.intervalDays}日後に再復習` : '明日再復習'})</span>
                </div>
              ` : ''}

              <!-- 6項目完全網羅解説カード（正解・語幹・辞書形・意味・文法・過程） -->
              ${renderGrammarExplanationHTML({
                correctAnswer: q.japanese,
                userAnswer: this.state.userAnswer,
                isCorrect: this.state.isCorrect,
                item: q,
                pronunciation: q.pronunciation,
                grammarExplanation: q.note,
                isVerbQuestion: isV
              })}

              <!-- 4択の場合：選択肢に出た単語の全解説アコーディオン -->
              ${(typeof renderChoiceExplanationsHTML === 'function' && this.state.choices && this.state.choices.length > 0) ? renderChoiceExplanationsHTML(this.state.choices, {
                expectedAnswer: q.japanese,
                userAnswer: this.state.userAnswer
              }) : ''}

              <!-- 音声再生ボタン -->
              <div class="mt-3 flex gap-2">
                <button type="button" id="btn-speak-ja-feedback" class="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 inline-flex items-center gap-1 shadow-2xs">
                  🔊 もう一度聞く
                </button>
              </div>
            </div>

            <!-- 次の問題へボタン -->
            <button type="button" id="btn-next-ja-question" class="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-md transition-all active:scale-98 text-sm flex items-center justify-center gap-1">
              <span>${idx + 1 < total ? '次の問題へ（Enter） →' : '結果を見る 🎉'}</span>
            </button>
          </div>
        `}
      </div>
    `;

    this.bindTestingEvents();
  }

  static bindTestingEvents() {
    // 中断
    const quitBtn = this.container.querySelector('#btn-quit-ja-test');
    if (quitBtn) {
      quitBtn.addEventListener('click', () => {
        if (confirm('テストを中断して設定画面に戻りますか？')) {
          this.state.view = 'settings';
          this.renderSettings();
        }
      });
    }

    // ヒントトグル
    const toggleHintBtn = this.container.querySelector('#btn-toggle-ja-hint');
    const hintContent = this.container.querySelector('#ja-hint-content');
    const hintToggleText = this.container.querySelector('#ja-hint-toggle-text');
    if (toggleHintBtn && hintContent) {
      toggleHintBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const isHidden = hintContent.classList.toggle('hidden');
        if (hintToggleText) {
          hintToggleText.textContent = isHidden ? 'ヒント・品詞を見る ▼' : 'ヒントを閉じる ▲';
        }
      });
    }

    // 音声再生（問題）
    const speakQBtn = this.container.querySelector('#btn-speak-ja-question');
    if (speakQBtn) {
      speakQBtn.addEventListener('click', () => {
        speakQBtn.classList.add('animate-pulse');
        const res = SpeechService.speakMongolian(this.state.currentQuestion.mongolian);
        if (res && typeof res.then === 'function') {
          res.then(() => speakQBtn.classList.remove('animate-pulse'))
             .catch(() => speakQBtn.classList.remove('animate-pulse'));
        } else {
          setTimeout(() => speakQBtn.classList.remove('animate-pulse'), 1200);
        }
      });
    }

    // 音声再生（解説）
    this.container.querySelectorAll('.btn-speak-choice-word').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const word = btn.getAttribute('data-word');
        if (word && typeof SpeechService !== 'undefined') {
          SpeechService.speakMongolian(word);
        }
      });
    });

    const speakFBtn = this.container.querySelector('#btn-speak-ja-feedback');
    if (speakFBtn) {
      speakFBtn.addEventListener('click', () => {
        speakFBtn.classList.add('animate-pulse');
        const res = SpeechService.speakMongolian(this.state.currentQuestion.mongolian);
        if (res && typeof res.then === 'function') {
          res.then(() => speakFBtn.classList.remove('animate-pulse'))
             .catch(() => speakFBtn.classList.remove('animate-pulse'));
        } else {
          setTimeout(() => speakFBtn.classList.remove('animate-pulse'), 1200);
        }
      });
    }

    if (!this.state.hasAnswered) {
      if (this.state.settings.mode === 'choice_4') {
        this.container.querySelectorAll('.btn-ja-choice').forEach(btn => {
          btn.addEventListener('click', () => {
            const chosenId = btn.getAttribute('data-choice-id');
            const chosen = this.state.choices.find(c => c.id === chosenId);
            this.submitAnswer(chosen.japanese, chosen.id === this.state.currentQuestion.id);
          });
        });
      } else {
        const input = this.container.querySelector('#input-ja-answer');
        const submitBtn = this.container.querySelector('#btn-submit-ja-answer');

        if (input) {
          input.focus();
          input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              this.checkAnswer(input.value);
            }
          });
        }

        if (submitBtn) {
          submitBtn.addEventListener('click', () => {
            if (input) this.checkAnswer(input.value);
          });
        }
      }
    } else {
      const nextBtn = this.container.querySelector('#btn-next-ja-question');
      if (nextBtn) {
        nextBtn.focus();
        nextBtn.addEventListener('click', () => {
          this.goNext();
        });

        const keyHandler = (e) => {
          if (e.key === 'Enter') {
            window.removeEventListener('keydown', keyHandler);
            this.goNext();
          }
        };
        window.addEventListener('keydown', keyHandler);
      }
    }
  }

  static checkAnswer(val) {
    const q = this.state.currentQuestion;
    const isCorrect = isWordAnswerMatch(val, q, 'mn_to_ja');
    this.submitAnswer(val, isCorrect);
  }

  static submitAnswer(userAnswer, isCorrect) {
    const q = this.state.currentQuestion;
    const details = getWordGrammarDetails(q);
    const isV = details.isVerb;

    this.state.hasAnswered = true;
    this.state.userAnswer = userAnswer;
    this.state.isCorrect = isCorrect;

    // SRS忘却曲線進捗の更新
    const updatedSrs = StorageService.recordWordAnswer(q.id, isCorrect);
    this.state.lastSrsUpdate = updatedSrs;

    // 効果音
    if (isCorrect) {
      SoundEffects.playCorrect();
    } else {
      SoundEffects.playWrong();
      // 間違いノートに記録
      StorageService.recordMistake({
        question: `【日本語訳】${details.dictForm || q.mongolian} の意味`,
        userAnswer: userAnswer || '(未入力)',
        correctAnswer: q.japanese,
        type: 'word',
        category: q.category || '単語',
        explanation: isV
          ? `【動詞】正解: ${q.japanese} / 辞書形: ${details.dictForm} / 語幹: ${details.root}。${details.derivation}`
          : `${details.dictForm} = ${q.japanese}。${details.derivation}`
      });
    }

    // 共通ゲーミフィケーション集計（コンボ・スコア・XP・ペンギンリアクション）
    const feedback = GamificationService.recordAnswer({ isCorrect, testType: 'japanese_translation' });
    this.state.sessionScore = (this.state.sessionScore || 0) + feedback.scoreGained;
    this.state.sessionXp = (this.state.sessionXp || 0) + feedback.xpGained;
    this.state.lastGameFeedback = feedback;

    this.state.results.push({
      question: q,
      userAnswer,
      isCorrect,
      expectedAnswer: q.japanese,
      choices: this.state.choices ? [...this.state.choices] : null
    });

    this.renderTesting();
  }

  static goNext() {
    if (this.state.currentIndex + 1 < this.state.questions.length) {
      this.loadQuestion(this.state.currentIndex + 1);
    } else {
      const total = this.state.questions.length;
      const correct = this.state.results.filter(r => r.isCorrect).length;
      const wrong = total - correct;

      // 共通ゲームセッション完了処理
      const sessionResult = GamificationService.finishSession({
        testType: 'japanese_translation',
        testTitle: '日本語訳テスト',
        correctCount: correct,
        wrongCount: wrong,
        sessionScore: this.state.sessionScore || 0,
        sessionXp: this.state.sessionXp || 0
      });
      this.state.sessionResult = sessionResult;

      this.state.view = 'result';
      this.renderResult();

      // レベルアップ・ペンギン進化・新称号の祝福モーダル
      if (sessionResult.leveledUp || sessionResult.newTitleUnlocked || sessionResult.evolved) {
        setTimeout(() => {
          GamificationService.showCelebrationModal({
            newLevel: sessionResult.newLevel,
            title: sessionResult.currentTitle,
            evolved: sessionResult.evolved,
            oldStage: sessionResult.oldStage,
            newStage: sessionResult.newStage
          });
        }, 250);
      }
    }
  }

  // --- 4. 結果画面 ---
  static renderResult() {
    const total = this.state.questions.length;
    const correct = this.state.results.filter(r => r.isCorrect).length;
    const wrong = total - correct;
    const percent = total > 0 ? Math.round((correct / total) * 100) : 0;
    const currentFilter = this.state.resultFilter || 'all';

    const filteredResults = this.state.results.filter(r => {
      if (currentFilter === 'correct') return r.isCorrect;
      if (currentFilter === 'wrong') return !r.isCorrect;
      return true;
    });

    const sessionRes = this.state.sessionResult || GamificationService.finishSession({
      testType: 'japanese_translation',
      testTitle: '日本語訳テスト',
      correctCount: correct,
      wrongCount: wrong,
      sessionScore: this.state.sessionScore || 0,
      sessionXp: this.state.sessionXp || 0
    });

    this.container.innerHTML = `
      <div class="animate-fade-in max-w-xl mx-auto px-4 py-4 space-y-4">
        
        <!-- ゲームリザルト ＆ Оцон шувууフィードバック -->
        ${GamificationService.renderGameResultCard({
          testTitle: '日本語訳テスト',
          correctCount: correct,
          wrongCount: wrong,
          scoreEarned: this.state.sessionScore || 0,
          xpEarned: this.state.sessionXp || 0,
          maxCombo: sessionRes.maxCombo || 0,
          sessionResult: sessionRes
        })}

        <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-md text-center space-y-3">
          <div class="flex items-center justify-between text-xs text-slate-500 font-bold px-2">
            <span>日本語訳テスト総評</span>
            <span>正解率: ${percent}% (${correct}/${total}問)</span>
          </div>

          <div class="flex gap-2">
            <button type="button" id="btn-retry-ja-test" class="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs sm:text-sm transition-all active:scale-98 shadow-xs cursor-pointer">
              もう一度解く
            </button>
            <button type="button" id="btn-ja-result-home" class="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs sm:text-sm transition-all cursor-pointer">
              ホームへ戻る
            </button>
          </div>
        </div>

        <!-- 出題問題の一覧・復習（正解・不正解フィルター切り替え） -->
        <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
            <h3 class="text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
              <span>📋</span> 出題問題の一覧・復習 (${total}問)
            </h3>
            <div class="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold self-start sm:self-auto">
              <button type="button" class="filter-ja-result-btn px-2.5 py-1 rounded-lg transition-all cursor-pointer ${currentFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs font-black' : 'text-slate-500 hover:text-slate-800'}" data-filter="all">
                すべて (${total})
              </button>
              <button type="button" class="filter-ja-result-btn px-2.5 py-1 rounded-lg transition-all cursor-pointer ${currentFilter === 'correct' ? 'bg-emerald-600 text-white shadow-2xs font-black' : 'text-slate-500 hover:text-emerald-700'}" data-filter="correct">
                ⭕ 正解 (${correct})
              </button>
              <button type="button" class="filter-ja-result-btn px-2.5 py-1 rounded-lg transition-all cursor-pointer ${currentFilter === 'wrong' ? 'bg-rose-600 text-white shadow-2xs font-black' : 'text-slate-500 hover:text-rose-700'}" data-filter="wrong">
                ❌ 不正解 (${wrong})
              </button>
            </div>
          </div>

          ${filteredResults.length === 0 ? `
            <div class="text-center py-6 text-xs text-slate-400">
              該当する問題はありません。
            </div>
          ` : `
            <div class="divide-y divide-slate-100 max-h-96 overflow-y-auto pr-1">
              ${filteredResults.map(r => `
                <div class="py-3 flex items-start justify-between gap-3 text-xs">
                  <div class="space-y-1 flex-1">
                    <div class="flex items-center gap-2">
                      <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${r.isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}">
                        ${r.isCorrect ? '⭕ 正解' : '❌ 不正解'}
                      </span>
                      <span class="font-extrabold text-slate-900 text-sm cyrillic-text">${r.question.dictForm || r.question.mongolian}</span>
                      ${(typeof isPronunciationCautionWord === 'function' && isPronunciationCautionWord(r.question) && r.question.pronunciation) ? `<span class="text-amber-700 font-bold text-xs ml-1">⚠️ [${r.question.pronunciation}]</span>` : ''}
                    </div>
                    <div class="text-slate-700 font-medium">
                      日本語訳: <span class="font-bold text-rose-800">${r.question.japanese}</span>
                    </div>
                    ${!r.isCorrect ? `
                      <div class="text-slate-500">
                        あなたの回答: <span class="line-through text-rose-600 font-medium">${r.userAnswer || '(無回答)'}</span>
                        <span class="text-emerald-700 font-bold ml-2">正解: ${r.expectedAnswer || r.question.japanese}</span>
                      </div>
                    ` : `
                      ${r.userAnswer ? `<div class="text-slate-500">あなたの回答: <span class="text-emerald-700 font-bold">${r.userAnswer}</span> ✅</div>` : ''}
                    `}
                    ${r.question.root ? `<div class="text-[11px] text-slate-400">語幹: ${r.question.root}</div>` : ''}
                  </div>
                  <button type="button" class="btn-speak-ja-result text-slate-400 hover:text-emerald-700 p-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer shrink-0" data-word="${r.question.mongolian}" title="発音を聞く">
                    🔊
                  </button>
                </div>

                <!-- 4択問題の場合の選択肢全解説アコーディオン -->
                ${(typeof renderChoiceExplanationsHTML === 'function' && r.choices && r.choices.length > 0) ? renderChoiceExplanationsHTML(r.choices, {
                  expectedAnswer: r.expectedAnswer || r.question.japanese,
                  userAnswer: r.userAnswer
                }) : ''}
              `).join('')}
            </div>
          `}
        </div>
      </div>
    `;

    // フィルターボタンイベント
    this.container.querySelectorAll('.filter-ja-result-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.state.resultFilter = btn.getAttribute('data-filter');
        this.renderResult();
      });
    });

    // 音声再生
    this.container.querySelectorAll('.btn-speak-ja-result, .btn-speak-choice-word').forEach(btn => {
      btn.addEventListener('click', () => {
        const word = btn.getAttribute('data-word');
        if (word) SpeechService.speakMongolian(word);
      });
    });

    this.container.querySelector('#btn-retry-ja-test').addEventListener('click', () => {
      this.startTest();
    });

    this.container.querySelector('#btn-ja-result-home').addEventListener('click', () => {
      if (this.onNavigate) this.onNavigate('home');
    });
  }
}
