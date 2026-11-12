// 単語テストコンポーネント
import { StorageService } from '../services/storage.js';
import { SpeechService } from '../services/speech.js';
import { CyrillicKeyboard } from './CyrillicKeyboard.js';
import { isFuzzyMatch, isVerb, getWordGrammarDetails, isWordAnswerMatch, renderGrammarExplanationHTML, renderChoiceExplanationsHTML, renderReviewToggleButtonHTML, bindReviewToggleButtons, shuffleArray, SoundEffects, SPECIAL_CYRILLIC_BAR, isPronunciationCautionWord, renderCyrillicInputAssistantHTML, bindCyrillicInputAssistant, scrollToQuizTop } from '../utils/helpers.js';
import { GamificationService } from '../services/gamification.js';
import { PenguinMascot } from './PenguinMascot.js';

export class WordTestComponent {
  static activeKeyHandler = null;

  static cleanupKeyHandler() {
    if (this.activeKeyHandler) {
      window.removeEventListener('keydown', this.activeKeyHandler);
      this.activeKeyHandler = null;
    }
  }

  static state = {
    view: 'settings', // 'settings' | 'testing' | 'result'
    settings: {
      count: 10,
      mode: 'ja_to_mn', // 'ja_to_mn' | 'mn_to_ja' | 'choice_4' | 'root_input'
      choiceDirection: 'mn_to_ja', // 'ja_to_mn' | 'mn_to_ja'
      category: 'all',
      filter: 'all', // 'all' | 'mistakes_only' | 'unlearned'
      priority: 'all' // 'all' | '★★★' | '★★'
    },
    questions: [],
    currentIndex: 0,
    currentQuestion: null,
    userAnswer: '',
    selectedChoice: null,
    hasAnswered: false,
    isCorrect: false,
    results: [] // 各問の結果
  };

  static render(container, onNavigate, options = null) {
    this.container = container;
    this.onNavigate = onNavigate;

    if (options && options.filter) {
      this.state.settings.filter = options.filter;
      if (options.count) this.state.settings.count = options.count;
      if (options.autoStart) {
        this.startTest();
        return;
      }
    }

    if (this.state.view === 'settings') {
      this.renderSettings();
    } else if (this.state.view === 'testing') {
      this.renderTesting();
    } else if (this.state.view === 'result') {
      this.renderResult();
    }
  }

  // --- 1. テスト設定画面 ---
  static renderSettings() {
    this.cleanupKeyHandler();
    const vocabList = StorageService.getVocabulary();
    const mistakes = StorageService.getMistakes();
    const categories = Array.from(new Set(vocabList.map(v => v.category || 'その他'))).filter(Boolean);

    this.container.innerHTML = `
      <div class="animate-fade-in max-w-xl mx-auto px-4 py-4 space-y-5">
        <div class="flex items-center justify-between border-b border-slate-200 pb-3">
          <div class="flex items-center gap-2">
            <span class="text-2xl">📝</span>
            <h2 class="text-lg font-bold text-slate-800">単語テストの設定</h2>
          </div>
          <button type="button" id="btn-back-home" class="text-xs text-slate-500 hover:text-slate-800">
            ✕ ホームへ
          </button>
        </div>

        <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          
          <!-- 出題形式 -->
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-2">出題形式</label>
            <div class="grid grid-cols-2 gap-2 text-xs">
              <label class="flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer hover:bg-slate-50 ${this.state.settings.mode === 'ja_to_mn' ? 'border-emerald-600 bg-emerald-50/50 text-emerald-900 font-bold' : 'border-slate-200'}">
                <input type="radio" name="mode" value="ja_to_mn" ${this.state.settings.mode === 'ja_to_mn' ? 'checked' : ''} class="hidden">
                <span>🇯🇵 日本語 → 🇲🇳 モンゴル語（記述）</span>
              </label>

              <label class="flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer hover:bg-slate-50 ${this.state.settings.mode === 'mn_to_ja' ? 'border-emerald-600 bg-emerald-50/50 text-emerald-900 font-bold' : 'border-slate-200'}">
                <input type="radio" name="mode" value="mn_to_ja" ${this.state.settings.mode === 'mn_to_ja' ? 'checked' : ''} class="hidden">
                <span>🇲🇳 モンゴル語 → 🇯🇵 日本語（記述）</span>
              </label>

              <label class="flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer hover:bg-slate-50 ${this.state.settings.mode === 'choice_4' ? 'border-emerald-600 bg-emerald-50/50 text-emerald-900 font-bold' : 'border-slate-200'}">
                <input type="radio" name="mode" value="choice_4" ${this.state.settings.mode === 'choice_4' ? 'checked' : ''} class="hidden">
                <span>🎯 4択選択問題（タップで解答）</span>
              </label>
            </div>

            <!-- 4択の出題方向選択（要件7） -->
            <div id="choice-direction-panel" class="${this.state.settings.mode === 'choice_4' ? 'block' : 'hidden'} mt-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1.5 animate-fade-in">
              <span class="text-xs font-bold text-slate-700 dark:text-slate-300 block">🎯 4択問題の出題方向:</span>
              <div class="grid grid-cols-2 gap-2 text-xs">
                <label class="flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-all ${this.state.settings.choiceDirection === 'ja_to_mn' ? 'bg-emerald-600 text-white font-bold border-emerald-600 shadow-xs' : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-600'}">
                  <input type="radio" name="choiceDirection" value="ja_to_mn" ${this.state.settings.choiceDirection === 'ja_to_mn' ? 'checked' : ''} class="hidden">
                  <span>🇯🇵 日本語 → 🇲🇳 モンゴル語</span>
                </label>
                <label class="flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-all ${this.state.settings.choiceDirection === 'mn_to_ja' ? 'bg-emerald-600 text-white font-bold border-emerald-600 shadow-xs' : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-600'}">
                  <input type="radio" name="choiceDirection" value="mn_to_ja" ${this.state.settings.choiceDirection === 'mn_to_ja' ? 'checked' : ''} class="hidden">
                  <span>🇲🇳 モンゴル語 → 🇯🇵 日本語</span>
                </label>
              </div>
            </div>

              <label class="flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer hover:bg-slate-50 ${this.state.settings.mode === 'root_input' ? 'border-emerald-600 bg-emerald-50/50 text-emerald-900 font-bold' : 'border-slate-200'}">
                <input type="radio" name="mode" value="root_input" ${this.state.settings.mode === 'root_input' ? 'checked' : ''} class="hidden">
                <span>🌱 動詞の語幹を答える問題</span>
              </label>

              <label class="flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer hover:bg-slate-50 ${this.state.settings.mode === 'visual' ? 'border-emerald-600 bg-emerald-50/50 text-emerald-900 font-bold' : 'border-slate-200'}">
                <input type="radio" name="mode" value="visual" ${this.state.settings.mode === 'visual' ? 'checked' : ''} class="hidden">
                <span>🖼️ イラスト → 🇲🇳 モンゴル語</span>
              </label>
            </div>
          </div>

          <!-- 出題数（選択式 ＋ 自由入力欄） -->
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label class="text-xs font-bold text-slate-700">出題数</label>
              <div class="flex items-center gap-1 text-xs">
                <span class="text-slate-500 font-medium">自由入力:</span>
                <input type="number" id="input-custom-word-count" min="1" max="999" 
                  class="w-16 px-2 py-1 text-center font-bold text-xs bg-white border ${![5, 10, 20, 'all'].includes(this.state.settings.count) ? 'border-emerald-500 ring-2 ring-emerald-200 text-emerald-800' : 'border-slate-300 text-slate-700'} rounded-lg focus:outline-hidden"
                  placeholder="指定数"
                  value="${![5, 10, 20, 'all'].includes(this.state.settings.count) ? this.state.settings.count : ''}">
                <span class="font-bold text-slate-600">問</span>
              </div>
            </div>
            <div class="grid grid-cols-4 gap-2">
              ${[5, 10, 20, 'all'].map(num => `
                <button type="button" class="btn-count py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                  this.state.settings.count === num ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }" data-count="${num}">
                  ${num === 'all' ? '全問' : `${num}問`}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- カテゴリー絞り込み -->
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1.5">カテゴリー</label>
            <select id="select-category" class="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium">
              <option value="all">すべてのカテゴリー（全${vocabList.length}語）</option>
              ${categories.map(cat => {
                const count = vocabList.filter(v => v.category === cat).length;
                return `<option value="${cat}" ${this.state.settings.category === cat ? 'selected' : ''}>${cat} (${count}語)</option>`;
              }).join('')}
            </select>
          </div>

          <!-- 絞り込み条件（忘却曲線復習・間違えた問題のみなど） -->
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1.5">出題対象</label>
            <select id="select-filter" class="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium">
              <option value="all" ${this.state.settings.filter === 'all' ? 'selected' : ''}>すべての登録単語からランダム</option>
              <option value="srs_due" ${this.state.settings.filter === 'srs_due' ? 'selected' : ''}>
                ⚡ 忘却曲線：本日の復習期日（${StorageService.getDueReviewWords().length}語）
              </option>
              <option value="high_risk" ${this.state.settings.filter === 'high_risk' ? 'selected' : ''}>
                🛡️ 高忘却リスク単語（記憶減衰中: ${StorageService.getHighRiskWords().length}語）
              </option>
              <option value="mistakes_only" ${this.state.settings.filter === 'mistakes_only' ? 'selected' : ''}>
                🔥 間違えた問題のみ（${mistakes.filter(m => !m.resolved).length}件）
              </option>
              <option value="unlearned" ${this.state.settings.filter === 'unlearned' ? 'selected' : ''}>
                🌱 未学習の単語のみ（${vocabList.filter(v => v.srsLevel === 0).length}語）
              </option>
              <option value="priority_top" ${this.state.settings.filter === 'priority_top' ? 'selected' : ''}>
                ★★★ 最重要単語のみ
              </option>
            </select>
          </div>

          <!-- 開始ボタン -->
          <button type="button" id="btn-start-test" class="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all active:scale-98 text-sm mt-2 flex items-center justify-center gap-2">
            <span>🚀</span> テストを開始する
          </button>
        </div>
      </div>
    `;

    // イベント
    this.container.querySelector('#btn-back-home').addEventListener('click', () => {
      if (this.onNavigate) this.onNavigate('home');
    });

    this.container.querySelectorAll('input[name="mode"]').forEach(r => {
      r.addEventListener('change', (e) => {
        this.state.settings.mode = e.target.value;
        this.renderSettings();
      });
    });

    this.container.querySelectorAll('input[name="choiceDirection"]').forEach(r => {
      r.addEventListener('change', (e) => {
        this.state.settings.choiceDirection = e.target.value;
        this.renderSettings();
      });
    });

    this.container.querySelectorAll('.btn-count').forEach(btn => {
      btn.addEventListener('click', () => {
        const c = btn.getAttribute('data-count');
        this.state.settings.count = c === 'all' ? 'all' : parseInt(c, 10);
        this.renderSettings();
      });
    });

    this.container.querySelector('#select-category').addEventListener('change', (e) => {
      this.state.settings.category = e.target.value;
    });

    this.container.querySelector('#select-filter').addEventListener('change', (e) => {
      this.state.settings.filter = e.target.value;
    });

    this.container.querySelector('#btn-start-test').addEventListener('click', () => {
      this.startTest();
    });
  }

  // --- 2. テストの準備と開始 ---
  static startTest() {
    let list = this.state.settings.mode === 'visual'
      ? [...StorageService.getIllustrationQuizzes()]
      : [...StorageService.getVocabulary()];

    // カテゴリー（イラストモード時は除外）
    if (this.state.settings.mode !== 'visual' && this.state.settings.category !== 'all') {
      list = list.filter(v => v.category === this.state.settings.category);
    }

    // 語幹問題の場合は語幹が存在する動詞のみ
    if (this.state.settings.mode === 'root_input') {
      list = list.filter(v => isVerb(v) || (v.root && v.root.trim() !== ''));
    }

    // 絞り込み（イラストモード時は無効）
    if (this.state.settings.mode !== 'visual') {
      if (this.state.settings.filter === 'srs_due') {
        list = list.filter(v => v.srsLevel > 0 && v.isDue);
      } else if (this.state.settings.filter === 'high_risk') {
        let highRisk = StorageService.getHighRiskWords();
        if (highRisk.length === 0) {
          highRisk = [...StorageService.getVocabulary()].filter(v => (v.wrongCount || 0) > 0 || (v.retention !== undefined && v.retention < 80)).slice(0, 20);
        }
        const highRiskIds = new Set(highRisk.map(w => w.id));
        list = list.filter(v => highRiskIds.has(v.id) || (v.srsLevel > 0 && v.forgettingRisk >= 60));
      } else if (this.state.settings.filter === 'mistakes_only') {
        const mistakeList = StorageService.getActiveMistakes();
        const mistakeKeys = new Set();
        mistakeList.forEach(m => {
          if (m.wordId) mistakeKeys.add(m.wordId);
          if (m.correctAnswer) mistakeKeys.add(m.correctAnswer.toLowerCase().trim());
          if (m.question) mistakeKeys.add(m.question.toLowerCase().trim());
        });
        list = list.filter(v => 
          (v.id && mistakeKeys.has(v.id)) ||
          mistakeKeys.has(v.mongolian.toLowerCase().trim()) ||
          mistakeKeys.has((v.dictForm || '').toLowerCase().trim()) ||
          mistakeKeys.has(v.japanese)
        );
      } else if (this.state.settings.filter === 'unlearned') {
        list = list.filter(v => v.srsLevel === 0);
      } else if (this.state.settings.filter === 'priority_top') {
        list = list.filter(v => v.priority === '★★★');
      }
    }

    if (list.length === 0) {
      alert('該当する単語がありません。設定条件を変更してください。');
      return;
    }

    // 一度間違えた単語を忘却曲線の高頻度出題として優先配置
    const mistakeItems = list.filter(v => Boolean((v.wrongCount && v.wrongCount > 0) || v.hasMistake));
    const normalItems = list.filter(v => !Boolean((v.wrongCount && v.wrongCount > 0) || v.hasMistake));
    list = [...shuffleArray(mistakeItems), ...shuffleArray(normalItems)];

    const count = this.state.settings.count === 'all' ? list.length : Math.min(this.state.settings.count, list.length);
    GamificationService.resetSessionCombo();
    this.state.sessionScore = 0;
    this.state.sessionXp = 0;
    this.state.lastGameFeedback = null;
    this.state.sessionResult = null;
    this.state.questions = list.slice(0, count);
    this.state.currentIndex = 0;
    this.state.results = [];
    this.state.resultFilter = 'all';
    this.state.view = 'testing';
    this.loadQuestion(0);
  }

  static loadQuestion(index) {
    this.cleanupKeyHandler();
    this.state.currentIndex = index;
    const q = this.state.questions[index];
    this.state.currentQuestion = q;
    this.state.userAnswer = '';
    this.state.selectedChoice = null;
    this.state.hasAnswered = false;
    this.state.isCorrect = false;

    // 4択選択肢の作成（出題方向両対応：日本語→モンゴル語 / モンゴル語→日本語）
    if (this.state.settings.mode === 'choice_4') {
      const allVocab = StorageService.getVocabulary();
      const isJaToMn = this.state.settings.choiceDirection === 'ja_to_mn';
      
      const qVal = isJaToMn ? (q.dictForm || q.mongolian) : q.japanese;
      const otherVocab = allVocab.filter(v => {
        if (v.id === q.id) return false;
        const vVal = isJaToMn ? (v.dictForm || v.mongolian) : v.japanese;
        return vVal && vVal !== qVal;
      });

      const distractors = shuffleArray(otherVocab).slice(0, 3);
      const rawChoices = [q, ...distractors];
      this.state.choices = shuffleArray(rawChoices);
    }

    this.renderTesting();
    scrollToQuizTop(this.container);
  }

  // --- 3. テスト実行画面 ---
  static renderTesting() {
    const q = this.state.currentQuestion;
    const idx = this.state.currentIndex;
    const total = this.state.questions.length;
    const progressPercent = Math.round(((idx) / total) * 100);
    const mode = this.state.settings.mode;

    const details = getWordGrammarDetails(q);
    const isV = details.isVerb;
    // 動詞の場合：辞書形を答えるか語幹を答えるかをランダム（50%）に決定
    if (isV && !q._verbTargetForm) {
      q._verbTargetForm = Math.random() < 0.5 ? 'dict' : 'root';
    }
    const verbForm = q._verbTargetForm || 'dict';

    let questionPrompt = "";
    let questionMain = "";
    let subHint = "";
    let isCyrillicInput = false;

    if (mode === 'ja_to_mn') {
      if (isV) {
        if (verbForm === 'dict') {
          questionPrompt = "日本語に合う動詞の【辞書形（〜х）】をキリル文字で入力してください";
          questionMain = q.japanese;
          subHint = "【品詞: 動詞】見出し語となる【辞書形（〜х）】を回答（語尾 -ах / -эх 等を含める）";
        } else {
          questionPrompt = "日本語に合う動詞の【語幹】をキリル文字で入力してください";
          questionMain = q.japanese;
          subHint = "【品詞: 動詞】活用の土台となる【語幹】を回答（語尾-ахや括弧は不要）";
        }
      } else {
        questionPrompt = "日本語に合うモンゴル語（キリル文字）を入力してください";
        questionMain = q.japanese;
        subHint = q.pos ? `【品詞: ${q.pos}】` : '';
      }
      isCyrillicInput = true;
    } else if (mode === 'mn_to_ja') {
      if (isV) {
        if (verbForm === 'dict') {
          questionPrompt = "動詞の【辞書形】の意味（日本語）を入力してください";
          questionMain = details.dictForm;
          subHint = "【品詞: 動詞（辞書形）】";
        } else {
          questionPrompt = "動詞の【語幹】の意味（日本語）を入力してください";
          questionMain = `${details.root}-`;
          subHint = `【品詞: 動詞（語幹）】活用の土台（辞書形: ${details.dictForm}）`;
        }
      } else {
        questionPrompt = "モンゴル語の意味（日本語）を入力してください";
        questionMain = details.dictForm;
        subHint = (typeof isPronunciationCautionWord === 'function' && isPronunciationCautionWord(q) && q.pronunciation) ? `⚠️ 読み注意: ${q.pronunciation}` : '';
      }
      isCyrillicInput = false;
    } else if (mode === 'choice_4') {
      const isJaToMn = this.state.settings.choiceDirection === 'ja_to_mn';
      if (isJaToMn) {
        if (isV) {
          if (verbForm === 'dict') {
            questionPrompt = "日本語に合う動詞の【辞書形（〜х）】を選択してください";
            subHint = "【品詞: 動詞】見出し語となる【辞書形（〜х）】を選択";
          } else {
            questionPrompt = "日本語に合う動詞の【語幹】を選択してください";
            subHint = "【品詞: 動詞】活用の土台となる【語幹】を選択";
          }
        } else {
          questionPrompt = "日本語に合う正しいモンゴル語（キリル文字）を選択してください";
          subHint = q.pos ? `【品詞: ${q.pos}】` : '';
        }
        questionMain = q.japanese;
      } else {
        if (isV) {
          if (verbForm === 'dict') {
            questionPrompt = "動詞の【辞書形】に合う正しい日本語訳を選択してください";
            questionMain = `${details.dictForm}（辞書形）`;
          } else {
            questionPrompt = "動詞の【語幹】に合う正しい日本語訳を選択してください";
            questionMain = `${details.root}-（語幹）`;
          }
        } else {
          questionPrompt = "正しい日本語訳を選択してください";
          questionMain = details.dictForm || q.mongolian;
        }
        subHint = (typeof isPronunciationCautionWord === 'function' && isPronunciationCautionWord(q) && q.pronunciation) ? `⚠️ 読み注意: ${q.pronunciation}` : (isV ? `【動詞】語幹: ${details.root}` : '');
      }
    } else if (mode === 'root_input') {
      if (verbForm === 'dict') {
        questionPrompt = "動詞の【辞書形（見出し語）】を答えてください";
        questionMain = `${details.root}（${q.japanese}）（辞書形）`;
        subHint = "※ 不定詞語尾（-ах/-эх等）をつけた辞書形を入力";
      } else {
        questionPrompt = "動詞の【語幹（活用の土台）】を答えてください";
        questionMain = `${details.dictForm}（${q.japanese}）（語幹）`;
        subHint = "※ 不定詞語尾（-ах/-эх等）を除いた語幹を入力（ハイフン-は省略可）";
      }
      isCyrillicInput = true;
    } else if (mode === 'visual') {
      if (isV) {
        if (verbForm === 'dict') {
          questionPrompt = "イラストに合う動詞の【辞書形（〜х）】をキリル文字で入力してください";
        } else {
          questionPrompt = "イラストに合う動詞の【語幹】をキリル文字で入力してください";
        }
      } else {
        questionPrompt = "イラストに合うモンゴル語（キリル文字）を入力してください";
      }
      questionMain = q.svg ? `<div class="w-32 h-32 mx-auto drop-shadow-md select-none">${q.svg}</div>` : q.japanese;
      subHint = q.category ? `【${q.category}】${q.hint ? ' 💡 ' + q.hint : ''}` : '';
      isCyrillicInput = true;
    }

    this.container.innerHTML = `
      <div class="animate-fade-in max-w-xl mx-auto px-4 py-3 space-y-3">
        
        <!-- ヘッダー進捗バー ＆ ゲームHUD -->
        <div class="space-y-1.5">
          <div class="flex justify-between items-center text-xs font-bold text-slate-500">
            <span class="flex items-center gap-2">
              <span>問題 ${idx + 1} / ${total}</span>
              ${GamificationService.sessionCombo >= 2 ? `
                <span class="px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200 animate-bounce text-[10px]">
                  🔥 ${GamificationService.sessionCombo} COMBO
                </span>
              ` : ''}
            </span>
            <div class="flex items-center gap-3">
              <span class="text-amber-600 font-extrabold">+${this.state.sessionScore || 0} PTS</span>
              <span class="text-emerald-600 font-extrabold">+${this.state.sessionXp || 0} XP</span>
              <button type="button" id="btn-quit-test" class="text-slate-400 hover:text-slate-700 ml-1">中断</button>
            </div>
          </div>
          <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div class="bg-emerald-500 h-full transition-all duration-300" style="width: ${progressPercent}%"></div>
          </div>
        </div>

        <!-- 問題カード -->
        <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm text-center relative overflow-hidden">
          <div class="text-xs font-bold text-slate-400 mb-1">${questionPrompt}</div>
          
          <!-- メイン問題文 -->
          <div class="text-2xl sm:text-3xl font-extrabold text-slate-800 my-2 tracking-tight cyrillic-text">
            ${questionMain}
          </div>

          ${subHint ? `
            <div class="mt-2 text-center">
              <button type="button" id="btn-toggle-word-hint" class="text-xs text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 px-3 py-1 rounded-full font-bold border border-slate-200 transition-all inline-flex items-center gap-1.5 cursor-pointer select-none active:scale-95 shadow-2xs">
                <span>💡</span>
                <span id="word-hint-toggle-text">ヒント・読み方を見る ▼</span>
              </button>
              <div id="word-hint-content" class="hidden mt-2 animate-fade-in text-xs text-emerald-800 bg-emerald-50 inline-block px-3 py-1.5 rounded-xl font-medium border border-emerald-200">
                ${subHint}
              </div>
            </div>
          ` : ''}

          <!-- 音声再生ボタン（モンゴル語が問題文の場合） -->
          ${(mode === 'mn_to_ja' || mode === 'choice_4') ? `
            <div class="mt-2">
              <button type="button" id="btn-speak-question" class="text-xs text-emerald-700 bg-slate-100 hover:bg-emerald-100 px-3 py-1 rounded-full font-medium inline-flex items-center gap-1">
                🔊 発音を聞く
              </button>
            </div>
          ` : ''}
        </div>

        <!-- 回答セクション -->
        ${!this.state.hasAnswered ? `
          <!-- 未回答時 -->
          <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
            
            ${mode === 'choice_4' ? `
              <!-- 4択選択肢 -->
              <div class="grid grid-cols-1 gap-2">
                ${this.state.choices.map((choice, i) => {
                  let choiceText = choice.japanese;
                  if (this.state.settings.mode === 'choice_4' && this.state.settings.choiceDirection === 'ja_to_mn') {
                    const cd = getWordGrammarDetails(choice);
                    if (isV && verbForm === 'root') {
                      choiceText = cd.root || cd.dictForm || choice.mongolian;
                    } else {
                      choiceText = cd.dictForm || choice.mongolian;
                    }
                  }
                  return `
                    <button type="button" class="btn-choice text-left p-3.5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 text-slate-800 font-semibold text-sm transition-all active:scale-98 flex items-center justify-between" data-choice-id="${choice.id}">
                      <span><span class="inline-block w-6 text-slate-400 font-normal">${i + 1}.</span> ${choiceText}</span>
                      <span class="text-xs text-slate-400">選択</span>
                    </button>
                  `;
                }).join('')}
              </div>
            ` : `
              <!-- テキスト入力 -->
              <div>
                <input type="text" id="input-word-answer" 
                  class="w-full text-base sm:text-lg p-3 rounded-xl border-2 border-slate-300 focus:border-emerald-500 focus:outline-hidden text-center font-bold text-slate-800 cyrillic-text cyrillic-input" 
                  placeholder="${isCyrillicInput ? (isV ? (verbForm === 'dict' ? '動詞の辞書形（〜х）を入力...' : '動詞の語幹を入力...') : (mode === 'root_input' ? '動詞の語幹を入力...' : 'キリル文字で入力...')) : '日本語で入力...'}" 
                  data-cyrillic="${isCyrillicInput ? 'true' : 'false'}"
                  autofocus autocomplete="off">

                <!-- PC標準モンゴル語配列キーボード＆特有文字パレット（モンゴル語入力時） -->
                ${isCyrillicInput ? `
                  <div class="mt-2">
                    ${renderCyrillicInputAssistantHTML('input-word-answer', true)}
                  </div>
                ` : ''}
              </div>

              <button type="button" id="btn-submit-answer" class="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all active:scale-98 text-sm">
                回答する（Enter）
              </button>
            `}
          </div>
        ` : `
          <!-- 回答後フィードバック -->
          <div class="animate-fade-in space-y-3">
            <div class="p-4 sm:p-5 rounded-2xl border ${this.state.isCorrect ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950' : 'bg-rose-50/90 border-rose-300 text-rose-950'} shadow-sm">
              <div class="flex items-center justify-between mb-2">
                <span class="text-2xl">${this.state.isCorrect ? '⭕ 正解！' : '❌ 不正解'}</span>
                <span class="text-xs font-bold text-slate-500 bg-white/70 px-2 py-0.5 rounded-md">
                  ${isV ? (verbForm === 'dict' ? '動詞【辞書形】問題' : '動詞【語幹】問題') : ''}
                </span>
              </div>

              ${this.state.lastSrsUpdate ? `
                <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-2 ${
                  this.state.isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                }">
                  <span>${this.state.isCorrect ? '📈' : '📉'}</span>
                  <span>習熟度: Lv.${this.state.lastSrsUpdate.srsLevel} (${this.state.isCorrect ? `${this.state.lastSrsUpdate.intervalDays}日後に再復習` : '明日再復習'})</span>
                </div>
              ` : ''}

              <!-- 6項目完全網羅解説カード（辞書形・語幹・意味・過程の明確化） -->
              ${renderGrammarExplanationHTML({
                correctAnswer: (mode === 'mn_to_ja') ? q.japanese : (isV ? (verbForm === 'root' ? details.root : details.dictForm) : details.dictForm),
                userAnswer: this.state.userAnswer,
                isCorrect: this.state.isCorrect,
                item: q,
                pronunciation: q.pronunciation,
                grammarExplanation: q.note,
                isVerbQuestion: isV,
                verbTargetForm: verbForm
              })}

              <!-- 4択の場合：選択肢に出た単語の全解説アコーディオン -->
              ${(typeof renderChoiceExplanationsHTML === 'function' && this.state.choices && this.state.choices.length > 0) ? renderChoiceExplanationsHTML(this.state.choices, {
                expectedAnswer: (mode === 'mn_to_ja' || mode === 'choice_4') ? q.japanese : (q.dictForm || q.mongolian),
                userAnswer: this.state.userAnswer
              }) : ''}

              <!-- 音声再生ボタン -->
              <div class="mt-3 flex gap-2">
                <button type="button" id="btn-speak-feedback" class="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 inline-flex items-center gap-1 shadow-2xs">
                  🔊 発音を聞く
                </button>
              </div>
            </div>

            <!-- 次の問題ボタン -->
            <button type="button" id="btn-next-question" class="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all active:scale-98 text-sm flex items-center justify-center gap-1">
              <span>${idx + 1 < total ? '次の問題へ（Enter） →' : '結果を見る 🎉'}</span>
            </button>
          </div>
        `}
      </div>
    `;

    this.bindTestingEvents();
  }

  static bindTestingEvents() {
    this.cleanupKeyHandler();
    // 中断ボタン
    const quitBtn = this.container.querySelector('#btn-quit-test');
    if (quitBtn) {
      quitBtn.addEventListener('click', () => {
        if (confirm('テストを中断して設定に戻りますか？')) {
          this.state.view = 'settings';
          this.renderSettings();
        }
      });
    }

    // ヒントトグル
    const toggleHintBtn = this.container.querySelector('#btn-toggle-word-hint');
    const hintContent = this.container.querySelector('#word-hint-content');
    const hintToggleText = this.container.querySelector('#word-hint-toggle-text');
    if (toggleHintBtn && hintContent) {
      toggleHintBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const isHidden = hintContent.classList.toggle('hidden');
        if (hintToggleText) {
          hintToggleText.textContent = isHidden ? 'ヒント・読み方を見る ▼' : 'ヒントを閉じる ▲';
        }
      });
    }

    // 音声再生（問題文）
    const speakQBtn = this.container.querySelector('#btn-speak-question');
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

    // 音声再生（解説時）
    this.container.querySelectorAll('.btn-speak-choice-word').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const word = btn.getAttribute('data-word');
        if (word && typeof SpeechService !== 'undefined') {
          SpeechService.speakMongolian(word);
        }
      });
    });

    const speakFBtn = this.container.querySelector('#btn-speak-feedback');
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

    // 未回答時
    if (!this.state.hasAnswered) {
      if (this.state.settings.mode === 'choice_4') {
        // 4択選択
        this.container.querySelectorAll('.btn-choice').forEach(btn => {
          btn.addEventListener('click', () => {
            const chosenId = btn.getAttribute('data-choice-id');
            const chosen = this.state.choices.find(c => c.id === chosenId);
            const cd = getWordGrammarDetails(chosen);
            const isV = getWordGrammarDetails(this.state.currentQuestion).isVerb;
            const verbForm = this.state.currentQuestion._verbTargetForm || 'dict';
            let chosenText = chosen.japanese;
            if (this.state.settings.choiceDirection === 'ja_to_mn') {
              if (isV && verbForm === 'root') {
                chosenText = cd.root || cd.dictForm || chosen.mongolian;
              } else {
                chosenText = cd.dictForm || chosen.mongolian;
              }
            }
            this.submitAnswer(chosenText, chosen.id === this.state.currentQuestion.id);
          });
        });
      } else {
        // 入力フォーム
        const input = this.container.querySelector('#input-word-answer');
        const submitBtn = this.container.querySelector('#btn-submit-answer');

        if (input) {
          input.focus();
          CyrillicKeyboard.setActiveInput(input);
          bindCyrillicInputAssistant(this.container, '#input-word-answer');

          input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.isComposing) {
              e.preventDefault();
              this.checkInputAnswer(input.value);
            }
          });
        }

        if (submitBtn) {
          submitBtn.addEventListener('click', () => {
            if (input) this.checkInputAnswer(input.value);
          });
        }

        // クイック文字タップ
        this.container.querySelectorAll('.btn-quick-char').forEach(btn => {
          btn.addEventListener('click', () => {
            const char = btn.getAttribute('data-char');
            CyrillicKeyboard.insertChar(char);
          });
        });
      }
    } else {
      // 回答後: 次の問題へ（解説カードを確実に読めるよう400msディレイ＆キーハンドラ一元管理）
      const nextBtn = this.container.querySelector('#btn-next-question');
      if (nextBtn) {
        let allowEnterNext = false;
        setTimeout(() => {
          allowEnterNext = true;
          try { nextBtn.focus(); } catch (_) {}
        }, 400);

        const proceedNext = () => {
          this.cleanupKeyHandler();
          this.goNext();
        };

        nextBtn.addEventListener('click', (e) => {
          e.preventDefault();
          proceedNext();
        });

        this.activeKeyHandler = (e) => {
          if (e.key === 'Enter' && !e.isComposing) {
            if (!allowEnterNext) return;
            e.preventDefault();
            e.stopPropagation();
            proceedNext();
          }
        };
        window.addEventListener('keydown', this.activeKeyHandler);
      }
    }
  }

  static checkInputAnswer(val) {
    const q = this.state.currentQuestion;
    const mode = this.state.settings.mode;
    const isCorrect = mode === 'visual'
      ? isWordAnswerMatch(val, q, 'ja_to_mn', { verbTargetForm: q._verbTargetForm })
      : isWordAnswerMatch(val, q, mode, { verbTargetForm: q._verbTargetForm });
    this.submitAnswer(val, isCorrect);
  }

  static submitAnswer(userAnswer, isCorrect) {
    const q = this.state.currentQuestion;
    const mode = this.state.settings.mode;
    const details = getWordGrammarDetails(q);
    const isV = details.isVerb;
    const verbForm = q._verbTargetForm || 'dict';

    let expectedCorrectAnswer = "";
    if (mode === 'mn_to_ja') {
      expectedCorrectAnswer = q.japanese;
    } else if (isV) {
      expectedCorrectAnswer = (verbForm === 'root') ? details.root : details.dictForm;
    } else if (mode === 'visual') {
      expectedCorrectAnswer = q.dictForm || q.mongolian;
    } else {
      expectedCorrectAnswer = details.dictForm;
    }

    this.state.hasAnswered = true;
    this.state.userAnswer = userAnswer;
    this.state.isCorrect = isCorrect;

    // SRS忘却曲線進捗の更新（正解・不正解とも記録）
    const updatedSrs = StorageService.recordWordAnswer(q.id, isCorrect);
    this.state.lastSrsUpdate = updatedSrs;

    // 効果音
    if (isCorrect) {
      SoundEffects.playCorrect();
      // 正解時は該当単語の間違いノート項目を即座に克服カウント（3回正解で克服）、間違えた単語リストから自動消去
      StorageService.resolveMistakesForWord(q.id, q, true);
      if (q.japanese) {
        StorageService.resolveMistakeByQuestion(q.japanese, q.mongolian || details.dictForm || expectedCorrectAnswer, true);
      }
    } else {
      SoundEffects.playWrong();
      // 間違いノートに自動記録（問題文に答えを漏洩させない）
      let mistakeQuestion = "";
      if (mode === 'ja_to_mn') {
        mistakeQuestion = isV ? (verbForm === 'dict' ? `【動詞辞書形】${q.japanese}` : `【動詞語幹】${q.japanese}`) : `【単語】${q.japanese}`;
      } else if (mode === 'mn_to_ja') {
        mistakeQuestion = `【日本語訳】${verbForm === 'root' ? details.root + '-' : details.dictForm} の意味`;
      } else if (mode === 'root_input') {
        mistakeQuestion = verbForm === 'dict' ? `【動詞辞書形】${details.root}（${q.japanese}）` : `【語幹】${details.dictForm}（${q.japanese}）`;
      } else if (mode === 'visual') {
        mistakeQuestion = isV ? (verbForm === 'dict' ? `【イラスト動詞辞書形】${q.japanese}` : `【イラスト動詞語幹】${q.japanese}`) : `【イラスト】${q.japanese}`;
      } else {
        mistakeQuestion = `【単語】${details.dictForm} の意味`;
      }

      StorageService.recordMistake({
        wordId: q.id,
        question: mistakeQuestion,
        userAnswer: userAnswer || '(未入力)',
        correctAnswer: expectedCorrectAnswer,
        type: 'word',
        category: q.category || '単語',
        explanation: isV 
          ? (verbForm === 'dict' 
              ? `【動詞】正解(辞書形): ${details.dictForm} / 語幹: ${details.root} / 意味: ${q.japanese}。${details.derivation}`
              : `【動詞】正解(語幹): ${details.root} / 辞書形: ${details.dictForm} / 意味: ${q.japanese}。${details.derivation}`)
          : `${q.japanese} = ${details.dictForm}。${details.derivation}`
      });
    }

    // 共通ゲーミフィケーション集計（コンボ・スコア・XP・ペンギンリアクション）
    const feedback = GamificationService.recordAnswer({ isCorrect, testType: 'word' });
    this.state.sessionScore = (this.state.sessionScore || 0) + feedback.scoreGained;
    this.state.sessionXp = (this.state.sessionXp || 0) + feedback.xpGained;
    this.state.lastGameFeedback = feedback;

    this.state.results.push({
      question: q,
      userAnswer: userAnswer,
      isCorrect: isCorrect,
      expectedAnswer: expectedCorrectAnswer,
      choices: this.state.choices ? [...this.state.choices] : null
    });

    this.renderTesting();
  }

  static goNext() {
    scrollToQuizTop(this.container);
    if (this.state.currentIndex + 1 < this.state.questions.length) {
      this.loadQuestion(this.state.currentIndex + 1);
    } else {
      // テスト完了・履歴保存
      const total = this.state.questions.length;
      const correct = this.state.results.filter(r => r.isCorrect).length;
      const wrong = total - correct;
      StorageService.recordHistory({
        type: 'word',
        total: total,
        correct: correct,
        category: this.state.settings.category,
        mode: this.state.settings.mode
      });

      // 共通ゲームセッション完了処理
      const sessionResult = GamificationService.finishSession({
        testType: 'word',
        testTitle: '単語テスト',
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

  // --- 4. テスト結果画面 ---
  static renderResult() {
    this.cleanupKeyHandler();
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
      testType: 'word',
      testTitle: '単語テスト',
      correctCount: correct,
      wrongCount: wrong,
      sessionScore: this.state.sessionScore || 0,
      sessionXp: this.state.sessionXp || 0
    });

    this.container.innerHTML = `
      <div class="animate-fade-in max-w-xl mx-auto px-4 py-4 space-y-4">
        
        <!-- ゲームリザルト ＆ Оцон шувууフィードバック -->
        ${GamificationService.renderGameResultCard({
          testTitle: '単語テスト',
          correctCount: correct,
          wrongCount: wrong,
          scoreEarned: this.state.sessionScore || 0,
          xpEarned: this.state.sessionXp || 0,
          maxCombo: sessionRes.maxCombo || 0,
          sessionResult: sessionRes
        })}

        <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-md text-center space-y-3">
          <div class="flex items-center justify-between text-xs text-slate-500 font-bold px-2">
            <span>単語テスト総評</span>
            <span>正解率: ${percent}% (${correct}/${total}問)</span>
          </div>

          <div class="space-y-2">
            <div class="flex gap-2">
              <button type="button" id="btn-retry-test" class="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm transition-all active:scale-98 shadow-xs cursor-pointer flex items-center justify-center gap-1.5">
                <span>🔄</span>
                <span>もう一度解く</span>
              </button>
              <button type="button" id="btn-change-test-settings" class="flex-1 py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold rounded-xl text-xs sm:text-sm transition-all active:scale-98 shadow-xs cursor-pointer flex items-center justify-center gap-1.5">
                <span>⚙️</span>
                <span>問題選択へ戻る</span>
              </button>
            </div>
            <button type="button" id="btn-result-home" class="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-1">
              <span>🏠</span>
              <span>ホームへ戻る</span>
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
              <button type="button" class="filter-result-btn px-2.5 py-1 rounded-lg transition-all cursor-pointer ${currentFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs font-black' : 'text-slate-500 hover:text-slate-800'}" data-filter="all">
                すべて (${total})
              </button>
              <button type="button" class="filter-result-btn px-2.5 py-1 rounded-lg transition-all cursor-pointer ${currentFilter === 'correct' ? 'bg-emerald-600 text-white shadow-2xs font-black' : 'text-slate-500 hover:text-emerald-700'}" data-filter="correct">
                ⭕ 正解 (${correct})
              </button>
              <button type="button" class="filter-result-btn px-2.5 py-1 rounded-lg transition-all cursor-pointer ${currentFilter === 'wrong' ? 'bg-rose-600 text-white shadow-2xs font-black' : 'text-slate-500 hover:text-rose-700'}" data-filter="wrong">
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
                      意味: <span class="font-bold text-emerald-800">${r.question.japanese}</span>
                    </div>
                    ${!r.isCorrect ? `
                      <div class="text-slate-500">
                        あなたの回答: <span class="line-through text-rose-600 font-medium">${r.userAnswer || '(無回答)'}</span>
                        <span class="text-emerald-700 font-bold ml-2">正解: ${r.expectedAnswer || r.question.mongolian}</span>
                      </div>
                    ` : `
                      ${r.userAnswer ? `<div class="text-slate-500">あなたの回答: <span class="text-emerald-700 font-bold">${r.userAnswer}</span> ✅</div>` : ''}
                    `}
                    ${r.question.root ? `<div class="text-[11px] text-slate-400">語幹: ${r.question.root}</div>` : ''}
                  </div>
                  <div class="flex items-center gap-2 shrink-0">
                    ${(typeof renderReviewToggleButtonHTML === 'function') ? renderReviewToggleButtonHTML({ id: r.question.id, wordId: r.question.id, question: (mode === 'mn_to_ja') ? r.question.mongolian : r.question.japanese, correctAnswer: r.expectedAnswer || r.question.mongolian, japanese: r.question.japanese, category: r.question.category, type: 'word' }) : ''}
                    <button type="button" class="btn-speak-word-result text-slate-400 hover:text-emerald-700 p-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer" data-word="${r.question.mongolian}" title="発音を聞く">
                      🔊
                    </button>
                  </div>
                </div>

                <!-- 4択問題の場合の選択肢全解説アコーディオン -->
                ${(typeof renderChoiceExplanationsHTML === 'function' && r.choices && r.choices.length > 0) ? renderChoiceExplanationsHTML(r.choices, {
                  expectedAnswer: r.expectedAnswer || r.question.mongolian,
                  userAnswer: r.userAnswer
                }) : ''}
              `).join('')}
            </div>
          `}
        </div>
      </div>
    `;

    // フィルターボタンイベント
    this.container.querySelectorAll('.filter-result-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.state.resultFilter = btn.getAttribute('data-filter');
        this.renderResult();
      });
    });

    // 音声再生
    bindReviewToggleButtons(this.container);
    this.container.querySelectorAll('.btn-speak-word-result, .btn-speak-choice-word').forEach(btn => {
      btn.addEventListener('click', () => {
        const word = btn.getAttribute('data-word');
        if (word) SpeechService.speakMongolian(word);
      });
    });

    this.container.querySelector('#btn-retry-test').addEventListener('click', () => {
      this.startTest();
    });

    const changeSettingsBtn = this.container.querySelector('#btn-change-test-settings');
    if (changeSettingsBtn) {
      changeSettingsBtn.addEventListener('click', () => {
        this.state.view = 'settings';
        this.renderSettings();
      });
    }

    this.container.querySelector('#btn-result-home').addEventListener('click', () => {
      if (this.onNavigate) this.onNavigate('home');
    });
  }
}
