// 最終口述面接・スピーチ特訓コンポーネント（Сүүлийн шалгалт хүртэл бэлдэх сэдвүүд）
// 1〜7の4分スピーチ準備 ＆ 8〜13の実践対話 全13テーマ完全暗記・発話特訓モード
import { SpeechService } from '../services/speech.js';
import { StorageService } from '../services/storage.js';
import { GamificationService } from '../services/gamification.js';
import { interviewTopics, interviewVocabulary } from '../data/interviewTopics.js';
import { isFuzzyMatch, SoundEffects, renderClickableWordsHTML, findWordInDictionary, showUniversalWordModal, renderCyrillicInputAssistantHTML, bindCyrillicInputAssistant, shuffleArray } from '../utils/helpers.js';

export class InterviewMasterComponent {
  static currentTopicIndex = 0;
  static currentStep = 1; // 1: シャドーイング/朗読, 2: 虫食い穴埋め暗記, 3: 4分スピーチ・本番シミュレーション
  static showMongolian = true;
  static showJapanese = false;
  static showRomaji = false;

  static isWordLookedUp(token) {
    try {
      const list = StorageService.getLookedUpWords() || [];
      const clean = (token || '').toLowerCase().replace(/[\(\)\（\）\s.,!?-]/g, '');
      return list.some(w => {
        const raw = (w.rawWord || '').toLowerCase().replace(/[\(\)\（\）\s.,!?-]/g, '');
        const df = (w.dictForm || '').toLowerCase().replace(/[\(\)\（\）\s.,!?-]/g, '');
        return raw === clean || df === clean;
      });
    } catch (_) {
      return false;
    }
  }
  static timerInterval = null;
  static timerSeconds = 0;
  static isTimerRunning = false;
  static revealedSpeech = false;
  static clozeAnswers = {};

  // タイピングモード用状態（質問・お題だけ見て入力する特訓）
  static typingSentenceIndex = 0;
  static typingUserInput = '';
  static typingHasAnswered = false;
  static typingIsCorrect = false;
  static typingShowHint = false;
  static typingCompleted = {};
  static typingMistakes = [];

  // Step 5: 出題単語全問テスト用状態（ここに出てきた単語のみ特訓）
  static vocabQuizIndex = 0;
  static vocabScope = 'current'; // 'current' | 'all'
  static vocabUserInput = '';
  static vocabHasAnswered = false;
  static vocabIsCorrect = false;
  static vocabShowHint = false;
  static vocabMistakes = [];
  static vocabActiveList = [];

  // サブモード: 'speech' (13テーマ別演習) | 'all_vocab' (口頭試験で出てくる単語をすべて覚える)
  static activeSubMode = 'speech';

  // 「口頭試験で出てくる単語をすべて覚える」専用ステート
  static allVocabState = {
    status: 'setup', // 'setup' | 'testing' | 'result' | 'browse_list'
    scope: 'all', // 'all' (全281語) | 'speech' (1-7 170語) | 'dialogue' (8-13 111語) | 'mistakes' | topicId
    testType: 'typing', // 'typing' (キリル文字入力) | 'choice' (4択クイズ)
    questionCount: 20, // 10 | 20 | 30 | 50 | 281
    customCountInput: '',
    order: 'shuffle', // 'shuffle' | 'ordered'
    currentIndex: 0,
    activeQuestions: [],
    userInput: '',
    hasAnswered: false,
    isCorrect: false,
    selectedChoice: null,
    currentChoices: [],
    showHint: false,
    mistakes: [],
    searchQuery: '',
    filterPos: 'all'
  };

  static render(container, onNavigate) {
    this.container = container;
    this.onNavigate = onNavigate;
    
    // 進捗データのロード
    let progressData = {};
    try {
      if (typeof StorageService !== 'undefined' && typeof StorageService.getItem === 'function') {
        progressData = StorageService.getItem('interview_master_progress', {}) || {};
      } else if (typeof localStorage !== 'undefined') {
        progressData = JSON.parse(localStorage.getItem('interview_master_progress') || '{}');
      }
    } catch (_) {
      progressData = {};
    }
    const topic = interviewTopics[this.currentTopicIndex] || interviewTopics[0];
    const isCompleted = progressData[topic.id] === 'mastered';

    const completedCount = Object.values(progressData).filter(v => v === 'mastered').length;
    const progressPercent = Math.round((completedCount / interviewTopics.length) * 100);

    // 「口頭試験で出てくる単語をすべて覚える」専用サブモード表示
    if (this.activeSubMode === 'all_vocab') {
      container.innerHTML = `
        <div class="max-w-4xl mx-auto px-4 py-6">
          ${this.renderTopSubModeTabs()}
          ${this.renderAllVocabContent()}
        </div>
      `;
      this.attachEventListeners(topic);
      return;
    }

    container.innerHTML = `
      <div class="max-w-4xl mx-auto px-4 py-6">
        ${this.renderTopSubModeTabs()}

        <!-- 口頭試験単語すべて覚える 特訓バナー -->
        <div class="bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-cyan-500/15 border-2 border-emerald-500/40 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
          <div class="flex items-center gap-3">
            <span class="text-3xl select-none">📝</span>
            <div>
              <div class="text-[11px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">口頭試験専用 単語特訓</div>
              <div class="text-sm sm:text-base font-black text-slate-900 dark:text-white">「口頭試験で出てくる単語をすべて覚える」モード</div>
              <div class="text-xs text-slate-600 dark:text-slate-300">13テーマ全281語のみを徹底反復（タイピング／4択／全単語一覧）</div>
            </div>
          </div>
          <button
            type="button"
            id="btn-goto-all-vocab-banner"
            class="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap active:scale-95">
            <span>全単語テストを開始する</span>
            <span>→</span>
          </button>
        </div>

        <!-- ヘッダー・進捗バー -->
        <div class="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-6 relative overflow-hidden">
          <div class="absolute -right-6 -bottom-6 text-8xl opacity-15 select-none pointer-events-none">🎙️</div>
          <div class="relative z-10">
            <div class="flex flex-wrap items-center justify-between gap-3 mb-2">
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-xs">
                <span>🎯</span> 最終口述試験・面接スピーチ特訓
              </span>
              <div class="flex items-center gap-2 text-xs text-white/90 font-medium">
                <span>暗記達成度: ${completedCount} / ${interviewTopics.length} テーマ (${progressPercent}%)</span>
              </div>
            </div>
            <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
              Сүүлийн шалгалт特訓
            </h1>
            <p class="text-sm sm:text-base text-white/90 max-w-2xl leading-relaxed">
              1〜7の質問についての4分スピーチ ＆ 8〜13の実践対話を完全攻略。「この文章を覚え、さらには言えるようにする」ための4ステップ（聴く・穴埋め・質問だけタイピング・4分スピーチ実践）集中ドリルです。
            </p>

            <!-- プログレスバー -->
            <div class="w-full bg-white/25 rounded-full h-2.5 mt-4 overflow-hidden">
              <div class="bg-emerald-300 h-2.5 rounded-full transition-all duration-500 shadow-sm" style="width: ${progressPercent}%"></div>
            </div>
          </div>
        </div>

        <!-- テーマ切り替えナビゲーション（13テーマ） -->
        <div class="bg-white rounded-2xl border border-slate-200 p-3 shadow-xs mb-6">
          <div class="text-xs font-semibold text-slate-500 mb-2 px-1 flex items-center justify-between">
            <span>📚 対策テーマを選択（全13テーマ）:</span>
            <span class="text-[11px] text-emerald-600 font-medium">1〜7: 4分スピーチ / 8〜13: 実践対話</span>
          </div>
          <div class="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
            ${interviewTopics.map((t, idx) => {
              const status = progressData[t.id];
              const isActive = idx === this.currentTopicIndex;
              let badgeColor = 'bg-slate-100 text-slate-600 border-slate-200';
              if (status === 'mastered') {
                badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-300';
              }
              if (isActive) {
                badgeColor = 'bg-emerald-600 text-white border-emerald-600 shadow-sm';
              }
              return `
                <button
                  type="button"
                  data-topic-index="${idx}"
                  class="topic-select-btn whitespace-nowrap px-3.5 py-2 rounded-xl border text-xs font-medium transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer ${badgeColor}">
                  <span>${t.icon}</span>
                  <span>${t.number}. ${t.titleJa}</span>
                  ${status === 'mastered' ? '<span>✓</span>' : ''}
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <!-- アクティブテーマの詳細カード -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 mb-6">
          <!-- テーマ見出し ＆ 暗記ステータス -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5 mb-6">
            <div>
              <div class="flex items-center gap-2 mb-1.5">
                <span class="text-2xl">${topic.icon}</span>
                <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold ${topic.category === 'speech' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}">
                  ${topic.categoryLabel}
                </span>
                <span class="text-xs text-slate-500 font-medium">テーマ ${topic.number} / 13</span>
              </div>
              <h2 class="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                ${topic.titleMn}
                <span class="block sm:inline text-base sm:text-lg font-medium text-slate-600 sm:ml-2">
                  (${topic.titleJa})
                </span>
              </h2>
              <p class="text-xs sm:text-sm text-slate-500 mt-1">${topic.description}</p>
            </div>

            <!-- ステータス切替ボタン -->
            <div class="flex items-center gap-2 self-start sm:self-auto flex-shrink-0">
              <button
                type="button"
                id="toggle-mastered-btn"
                class="px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${isCompleted ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'}">
                <span>${isCompleted ? '★' : '☆'}</span>
                <span>${isCompleted ? '暗記完了（言える！）' : '暗記済みにする'}</span>
              </button>
            </div>
          </div>

          <!-- 面接官の問いかけ（提示） -->
          <div class="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 sm:p-5 mb-6 flex items-start gap-3.5">
            <div class="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center text-xl flex-shrink-0 shadow-xs">
              👨‍🏫
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between gap-2 mb-1">
                <span class="text-xs font-bold text-amber-900 tracking-wide uppercase">面接官からの質問（問いかけ）</span>
                <button
                  type="button"
                  id="play-prompt-speech-btn"
                  class="text-xs font-medium text-amber-800 hover:text-amber-950 flex items-center gap-1 cursor-pointer bg-white/70 px-2.5 py-1 rounded-lg border border-amber-200">
                  <span>🔊 質問を聴く</span>
                </button>
              </div>
              <p class="text-base sm:text-lg font-bold text-slate-900 mb-0.5">${topic.examinerPromptMn}</p>
              <p class="text-xs sm:text-sm text-amber-900">${topic.examinerPromptJa}</p>
            </div>
          </div>

          <!-- 4つのステップタブ切り替え（聴く・穴埋め・質問だけタイピング・スピーチ実践） -->
          <div class="flex items-center border-b border-slate-200 mb-6 gap-2 sm:gap-4 overflow-x-auto">
            <button
              type="button"
              data-step="1"
              class="step-tab-btn pb-3 px-2 sm:px-4 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${this.currentStep === 1 ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-800'}">
              <span>🎧 Step 1: 聴く・シャドーイング</span>
            </button>
            <button
              type="button"
              data-step="2"
              class="step-tab-btn pb-3 px-2 sm:px-4 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${this.currentStep === 2 ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-800'}">
              <span>🧩 Step 2: 虫食い穴埋め暗記</span>
            </button>
            <button
              type="button"
              data-step="3"
              class="step-tab-btn pb-3 px-2 sm:px-4 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${this.currentStep === 3 ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-800'}">
              <span>⌨️ Step 3: 質問だけ見てタイピング</span>
            </button>
            <button
              type="button"
              data-step="4"
              class="step-tab-btn pb-3 px-2 sm:px-4 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${this.currentStep === 4 ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-800'}">
              <span>⏱️ Step 4: 4分スピーチ実践</span>
            </button>
            <button
              type="button"
              data-step="5"
              class="step-tab-btn pb-3 px-2 sm:px-4 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${this.currentStep === 5 ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-800'}">
              <span>📝 Step 5: 出題単語テスト</span>
            </button>
          </div>

          <!-- 各ステップのメインコンテンツ -->
          <div id="step-content-area">
            ${this.renderStepContent(topic)}
          </div>
        </div>

        <!-- 学習サポートツール・リンク -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- タイピング練習へのリンク -->
          <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between gap-3 hover:border-emerald-300 transition-all cursor-pointer" id="goto-typing-btn">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl flex-shrink-0">
                ⌨️
              </div>
              <div>
                <h4 class="text-sm font-bold text-slate-800">タイピング練習で文章を指に覚えさせる</h4>
                <p class="text-xs text-slate-500">口述試験例文をキーボードで打ち込んで暗記を加速</p>
              </div>
            </div>
            <span class="text-slate-400 text-lg">→</span>
          </div>

          <!-- 会話ロールプレイへのリンク -->
          <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between gap-3 hover:border-emerald-300 transition-all cursor-pointer" id="goto-roleplay-btn">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center text-xl flex-shrink-0">
                🏕️
              </div>
              <div>
                <h4 class="text-sm font-bold text-slate-800">会話ロールプレイで面接対話を試す</h4>
                <p class="text-xs text-slate-500">NPC面接官と得点付きインタラクティブ模擬面接</p>
              </div>
            </div>
            <span class="text-slate-400 text-lg">→</span>
          </div>
        </div>
      </div>
    `;

    this.attachEventListeners(topic);
  }

  // Step 1: 聴く・シャドーイング・文ごと朗読
  static renderStep1(topic) {
    return `
      <div>
        <!-- コントロールバー: 全文再生 ＆ 表示トグル（夜間モード完全対応） -->
        <div class="interview-control-bar flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800 rounded-2xl p-3 border border-slate-200 dark:border-slate-700 mb-3">
          <div class="flex items-center gap-2">
            <button
              type="button"
              id="play-full-speech-btn"
              class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer">
              <span>▶ 全文通し再生</span>
            </button>
            <button
              type="button"
              id="stop-speech-btn"
              class="px-3 py-2 rounded-xl bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold text-xs border border-slate-200 dark:border-slate-600 transition-all flex items-center gap-1 cursor-pointer">
              <span>⏹ 停止</span>
            </button>
          </div>

          <!-- 表示トグル（キリル文字、和訳、ローマ字） -->
          <div class="flex items-center gap-2 text-xs">
            <label class="flex items-center gap-1 cursor-pointer select-none text-slate-700 dark:text-slate-200 font-medium">
              <input type="checkbox" id="toggle-mn-check" ${this.showMongolian ? 'checked' : ''} class="rounded text-emerald-600 focus:ring-emerald-500">
              <span>キリル文字</span>
            </label>
            <label class="flex items-center gap-1 cursor-pointer select-none text-slate-700 dark:text-slate-200 font-medium ml-2">
              <input type="checkbox" id="toggle-ja-check" ${this.showJapanese ? 'checked' : ''} class="rounded text-emerald-600 focus:ring-emerald-500">
              <span>和訳</span>
            </label>
            <label class="flex items-center gap-1 cursor-pointer select-none text-slate-700 dark:text-slate-200 font-medium ml-2">
              <input type="checkbox" id="toggle-romaji-check" ${this.showRomaji ? 'checked' : ''} class="rounded text-emerald-600 focus:ring-emerald-500">
              <span>ローマ字</span>
            </label>
          </div>
        </div>

        <!-- 単語タップガイド -->
        <div class="text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 mb-4 flex items-center gap-1.5">
          <span>💡</span>
          <span>単語をタップすると辞書解説が表示され、自動で「調べた単語帳」に保存されます。</span>
        </div>

        <!-- センテンス一覧 -->
        <div class="space-y-4 mb-8">
          ${topic.sentences.map((s, sIdx) => {
            return `
              <div class="interview-sentence-card bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-500 rounded-2xl p-4 sm:p-5 transition-all shadow-xs">
                <div class="flex items-start justify-between gap-3 mb-2">
                  <div class="flex items-center gap-2">
                    <span class="sentence-num-badge w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center flex-shrink-0">
                      ${sIdx + 1}
                    </span>
                    ${s.speaker ? `<span class="px-2 py-0.5 rounded-md text-[11px] font-bold ${s.speaker === 'Би' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300' : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'}">${s.speaker}</span>` : ''}
                  </div>
                  <button
                    type="button"
                    data-speech-text="${encodeURIComponent(s.mn)}"
                    class="play-sentence-btn sentence-audio-btn text-xs text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 font-medium flex items-center gap-1 bg-white dark:bg-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-600 shadow-2xs cursor-pointer">
                    <span>🔊 聴く</span>
                  </button>
                </div>

                <!-- モンゴル語文（単語タップ解説＆保存対応） -->
                ${this.showMongolian ? `
                  <p class="sentence-mn-text text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-1.5 leading-relaxed font-sans">
                    ${renderClickableWordsHTML(s.mn, t => this.isWordLookedUp(t))}
                  </p>
                ` : `
                  <p class="text-sm italic text-slate-400 dark:text-slate-500 mb-1">（キリル文字非表示中 - 声に出して言ってみよう！）</p>
                `}

                <!-- ローマ字 -->
                ${this.showRomaji && s.romaji ? `
                  <p class="text-xs text-emerald-700 dark:text-emerald-400 font-mono mb-1.5">${s.romaji}</p>
                ` : ''}

                <!-- 日本語訳（夜間モード高視認性シアン／アイスブルー） -->
                ${this.showJapanese ? `
                  <p class="sentence-ja-text text-xs sm:text-sm text-slate-600 dark:text-sky-200 font-semibold mb-2.5 leading-relaxed">${s.ja}</p>
                ` : `
                  <p class="text-xs italic text-slate-400 dark:text-slate-500 mb-2">（和訳非表示中）</p>
                `}

                <!-- 文法・ポイント解説 -->
                ${s.explanation ? `
                  <div class="sentence-exp-box mt-2 pt-2 border-t border-slate-200/80 dark:border-slate-700 text-[11px] sm:text-xs text-slate-600 dark:text-slate-200 flex items-start gap-1.5 leading-relaxed">
                    <span class="sentence-exp-badge text-emerald-600 dark:text-emerald-400 font-bold shrink-0">💡 解説:</span>
                    <span class="sentence-exp-content">${s.explanation}</span>
                  </div>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>

        <!-- 文法・重要語彙 ＆ スピーチのコツ -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-slate-200">
          <!-- 語彙リスト -->
          <div class="bg-slate-50 rounded-2xl p-4 border border-slate-200">
            <h4 class="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span>📖</span> 重要語彙
            </h4>
            <ul class="space-y-1.5 text-xs">
              ${topic.vocabulary.map(v => `
                <li class="flex items-start justify-between gap-2 border-b border-slate-100 pb-1">
                  <span class="font-bold text-slate-900">${v.mn}</span>
                  <span class="text-slate-600 text-right">${v.ja} <span class="text-[10px] text-slate-400">(${v.note || ''})</span></span>
                </li>
              `).join('')}
            </ul>
          </div>

          <!-- スピーチのコツ -->
          <div class="bg-amber-50/70 rounded-2xl p-4 border border-amber-200">
            <h4 class="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span>💡</span> 口述試験・スピーチ攻略のコツ
            </h4>
            <p class="text-xs text-slate-700 leading-relaxed mb-3">
              ${topic.speechTips}
            </p>
            ${topic.grammarPoints ? `
              <div class="space-y-1">
                ${topic.grammarPoints.map(gp => `
                  <div class="text-[11px] text-amber-950 font-medium">
                    <span class="font-bold">${gp.pattern}:</span> ${gp.explanation}
                  </div>
                `).join('')}
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }

  // Step 2: 虫食い穴埋め暗記ドリル (Cloze Recall)
  static renderStep2(topic) {
    const clozeAnswers = this.clozeAnswers[topic.id] || {};
    let correctCount = 0;

    return `
      <div>
        <div class="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 mb-6 flex items-start justify-between gap-3">
          <div>
            <h3 class="text-sm font-bold text-emerald-900 mb-1">🧩 虫食い穴埋めドリルで暗記をチェック！</h3>
            <p class="text-xs text-emerald-800 leading-relaxed">
              重要キーワードが伏せ字になっています。「答え合わせ」を押すか、ヒントを活用して全文を暗記しましょう。
            </p>
          </div>
          <button
            type="button"
            id="cloze-reset-btn"
            class="px-3 py-1.5 rounded-xl bg-white text-emerald-800 border border-emerald-300 text-xs font-bold shadow-2xs hover:bg-emerald-100/50 cursor-pointer">
            🔄 リセット
          </button>
        </div>

        <div class="space-y-4 mb-6">
          ${topic.sentences.map((s, idx) => {
            const isAnswered = clozeAnswers[idx] === true;
            if (isAnswered) correctCount++;
            const token = s.clozeToken || '';
            const clozeSentence = s.mn.replace(token, `[＿＿${s.clozeHint || '？'}＿＿]`);

            return `
              <div class="bg-white border ${isAnswered ? 'border-emerald-400 bg-emerald-50/20' : 'border-slate-200'} rounded-2xl p-4 sm:p-5 transition-all">
                <div class="flex items-center justify-between gap-2 mb-2 text-xs">
                  <span class="font-bold text-slate-500">第 ${idx + 1} 文</span>
                  <span class="text-xs font-medium text-slate-400">${s.ja}</span>
                </div>

                <!-- 伏せ字文 -->
                <p class="text-base sm:text-lg font-bold text-slate-900 mb-3 leading-relaxed">
                  ${isAnswered ? s.mn : clozeSentence}
                </p>

                <!-- アクションボタン -->
                <div class="flex items-center gap-2">
                  ${!isAnswered ? `
                    <button
                      type="button"
                      data-cloze-idx="${idx}"
                      class="cloze-reveal-btn px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs cursor-pointer">
                      💡 答えを開く（${token}）
                    </button>
                  ` : `
                    <div class="flex items-center gap-2">
                      <span class="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-lg">
                        ✓ 正解開示済み: ${token}
                      </span>
                      <button
                        type="button"
                        data-speech-text="${encodeURIComponent(s.mn)}"
                        class="play-sentence-btn text-xs text-emerald-700 hover:text-emerald-900 font-medium flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-slate-200 shadow-2xs cursor-pointer">
                        <span>🔊 聴く</span>
                      </button>
                    </div>
                  `}
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- 全体暗記完了ボタン -->
        <div class="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex items-center justify-between gap-3">
          <span class="text-xs text-slate-600 font-medium">穴埋め開示: ${correctCount} / ${topic.sentences.length} 文</span>
          <button
            type="button"
            id="cloze-reveal-all-btn"
            class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs shadow-xs cursor-pointer">
            ✨ 全文の答えを一括表示する
          </button>
        </div>
      </div>
    `;
  }

  // Step 3: 質問だけ見てタイピング暗記特訓（面接官の質問＆お題日本語だけを見て入力）
  static renderStep3(topic) {
    const completedMap = this.typingCompleted[topic.id] || {};
    const completedCount = Object.keys(completedMap).length;
    const totalSentences = topic.sentences.length;
    const isAllCompleted = this.typingSentenceIndex >= totalSentences;

    // 全文クリア完了画面
    if (isAllCompleted) {
      return `
        <div class="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl text-center space-y-4 animate-bounce-in">
          <div class="text-6xl mb-1">🎉🏆</div>
          <h3 class="text-xl sm:text-2xl font-black">質問だけ見てタイピング暗記 達成！</h3>
          <p class="text-xs sm:text-sm text-emerald-100 max-w-lg mx-auto leading-relaxed">
            面接官の質問とお題だけを見て、全 ${totalSentences} 文のモンゴル語を自力で打ち切りました！頭と指に文章が深く定着しています。
          </p>
          ${(this.typingMistakes && this.typingMistakes.length > 0) ? `
            <div class="p-4 bg-white/95 dark:bg-slate-900/90 rounded-2xl border border-rose-300 text-left space-y-3 text-slate-800 dark:text-slate-200">
              <div class="flex items-center justify-between">
                <span class="text-xs font-black text-rose-700 flex items-center gap-1.5">
                  <span>🔥</span> タイピングで間違えた文 (${this.typingMistakes.length}件)
                </span>
                <span class="text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-full">間違いノートに保存済</span>
              </div>
              <div class="space-y-2 max-h-48 overflow-y-auto pr-1">
                ${this.typingMistakes.map(m => `
                  <div class="p-2.5 rounded-xl bg-rose-50/70 border border-rose-200 text-xs space-y-1">
                    <div class="font-bold text-slate-700">🇯🇵 ${m.ja}</div>
                    <div class="text-emerald-700 font-bold cyrillic-text">正解: ${m.mn}</div>
                    <div class="text-rose-600">入力: <span class="line-through">${m.user}</span></div>
                    ${m.note ? `<div class="text-[10px] text-slate-500">💡 ${m.note}</div>` : ''}
                  </div>
                `).join('')}
              </div>
              <button type="button" id="btn-goto-mistakes-from-interview" class="w-full py-2 bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-black rounded-xl text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer">
                <span>🔥 間違いノートで復習する →</span>
              </button>
            </div>
          ` : ''}

          <div class="flex flex-wrap items-center justify-center gap-3 pt-3">
            <button
              type="button"
              id="btn-restart-typing-drill"
              class="px-5 py-2.5 rounded-xl bg-white text-slate-900 font-bold text-xs shadow-md hover:bg-slate-100 active:scale-95 transition-all cursor-pointer">
              🔄 最初からもう一度タイピング練習する
            </button>
            <button
              type="button"
              id="btn-goto-step4-speech"
              class="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs shadow-md hover:bg-slate-800 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5">
              <span>⏱️ Step 4: 4分スピーチ実践へ進む →</span>
            </button>
          </div>
        </div>
      `;
    }

    const currentSentence = topic.sentences[this.typingSentenceIndex];

    return `
      <div class="space-y-5 animate-fade-in">
        <!-- 1. 特訓趣旨バナー -->
        <div class="bg-gradient-to-r from-teal-500/10 via-emerald-500/10 to-sky-500/10 border border-teal-300/60 dark:border-teal-700/60 rounded-2xl p-4 flex items-start gap-3">
          <span class="text-2xl select-none">⌨️</span>
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between gap-2 mb-1">
              <h3 class="text-sm font-bold text-teal-950 dark:text-teal-200">
                質問だけ見てタイピング暗記特訓
              </h3>
              <span class="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100/60 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                進捗: ${completedCount} / ${totalSentences} 文
              </span>
            </div>
            <p class="text-xs text-teal-900/90 dark:text-teal-300/90 leading-relaxed">
              モンゴル語の答えを隠し、面接官の質問とお題（日本語）だけを見てモンゴル語を入力します。
            </p>
          </div>
        </div>

        <!-- 2. 文セレクター（数字ピル） -->
        <div class="flex items-center gap-1.5 flex-wrap">
          <span class="text-xs text-slate-500 dark:text-slate-400 font-medium mr-1">文を選択:</span>
          ${topic.sentences.map((_, idx) => {
            const isDone = completedMap[idx] === true;
            const isCurrent = idx === this.typingSentenceIndex;
            return `
              <button
                type="button"
                data-typing-sentence-idx="${idx}"
                class="btn-select-typing-sentence w-8 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${isCurrent ? 'bg-emerald-600 text-white shadow-xs scale-105' : (isDone ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200')}">
                ${isDone && !isCurrent ? '✓' : idx + 1}
              </button>
            `;
          }).join('')}
        </div>

        <!-- 3. 問題カード（お題と入力エリア） -->
        <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
          <!-- 文のヘッダーとお題 -->
          <div>
            <div class="flex items-center justify-between text-xs mb-2">
              <span class="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                <span class="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center text-[11px] font-extrabold">
                  ${this.typingSentenceIndex + 1}
                </span>
                第 ${this.typingSentenceIndex + 1} 文 / 全 ${totalSentences} 文
              </span>
              <button
                type="button"
                id="btn-toggle-typing-hint"
                class="text-xs text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer">
                <span>${this.typingShowHint ? '🙈 ヒントを隠す' : '💡 ヒントを見る'}</span>
              </button>
            </div>

            <!-- お題（日本語のみ） -->
            <div class="p-4 bg-slate-50 dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div class="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                🗣️ この質問に答える内容（日本語）:
              </div>
              <p class="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
                ${currentSentence.ja}
              </p>
            </div>

            <!-- ヒント表示（トグル時） -->
            ${this.typingShowHint ? `
              <div class="mt-2.5 p-3 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-700/60 text-xs space-y-1 animate-fade-in">
                <div class="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1">
                  <span>💡</span> 暗記のヒント:
                </div>
                <div class="text-slate-700 dark:text-slate-300">
                  ・出だしの言葉: <strong class="cyrillic-text font-bold text-amber-900 dark:text-amber-300">${currentSentence.mn.split(' ')[0]}...</strong>
                </div>
                ${currentSentence.clozeToken ? `
                  <div class="text-slate-700 dark:text-slate-300">
                    ・キーワード: <strong class="cyrillic-text font-bold text-amber-900 dark:text-amber-300">${currentSentence.clozeToken}</strong> (${currentSentence.clozeHint || ''})
                  </div>
                ` : ''}
                <div class="text-slate-500 dark:text-slate-400 text-[11px]">
                  ・文字数: 約 ${currentSentence.mn.length} 文字
                </div>
              </div>
            ` : ''}
          </div>

          <!-- タイピング入力ボックス -->
          <div class="space-y-2">
            <div class="flex items-center justify-between text-xs">
              <label for="interview-typing-input" class="font-bold text-slate-700 dark:text-slate-300">
                モンゴル語（キリル文字）で入力:
              </label>
              <span class="text-[11px] text-slate-400">Enterキーまたは判定ボタンで確認</span>
            </div>

            <textarea
              id="interview-typing-input"
              rows="2"
              class="w-full p-3.5 rounded-2xl border-2 ${this.typingHasAnswered ? (this.typingIsCorrect ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-100' : 'border-rose-400 bg-rose-50/20 dark:bg-rose-950/30 text-rose-950 dark:text-rose-100') : 'border-slate-300 dark:border-slate-600 focus:border-emerald-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white'} text-base font-bold cyrillic-text focus:outline-none transition-all resize-none shadow-2xs"
              placeholder="質問・日本語のお題だけを見て、モンゴル語で入力..."
              ${this.typingHasAnswered && this.typingIsCorrect ? 'disabled' : ''}>${this.typingUserInput}</textarea>

            <!-- 特殊キリル文字バー -->
            <div class="flex items-center gap-1.5 flex-wrap pt-0.5">
              <span class="text-[11px] text-slate-400 mr-1">キリル文字入力補助:</span>
              ${['ө', 'ү', 'ё', 'Ө', 'Ү', 'Ё'].map(char => `
                <button
                  type="button"
                  class="btn-typing-quick-char px-2.5 py-1 bg-slate-100 hover:bg-emerald-100 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white font-bold rounded-lg border border-slate-200 dark:border-slate-600 text-xs transition-all active:scale-95 cursor-pointer"
                  data-char="${char}">
                  ${char}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- フィードバック表示（回答後） -->
          ${this.typingHasAnswered ? `
            ${this.typingIsCorrect ? `
              <div class="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700/60 text-emerald-950 dark:text-emerald-200 animate-fade-in space-y-2">
                <div class="flex items-center justify-between">
                  <div class="text-sm sm:text-base font-black flex items-center gap-1.5">
                    <span>🎉</span> 見事正解！正確に頭に入っています！
                  </div>
                  <button
                    type="button"
                    data-speech-text="${encodeURIComponent(currentSentence.mn)}"
                    class="play-sentence-btn text-xs px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-emerald-300 text-emerald-700 dark:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer">
                    <span>🔊 発音を聴く</span>
                  </button>
                </div>
                <div class="text-sm sm:text-base font-extrabold cyrillic-text text-emerald-800 dark:text-emerald-300">
                  ${currentSentence.mn}
                </div>
                ${currentSentence.explanation ? `
                  <div class="text-xs text-slate-600 dark:text-slate-300 pt-1.5 border-t border-emerald-200 dark:border-emerald-800">
                    💡 ${currentSentence.explanation}
                  </div>
                ` : ''}
              </div>
            ` : `
              <div class="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-700/60 text-rose-950 dark:text-rose-200 animate-fade-in space-y-2">
                <div class="flex items-center justify-between">
                  <div class="text-sm sm:text-base font-black flex items-center gap-1.5">
                    <span>❌</span> おしい！正解を確認しましょう
                  </div>
                  <button
                    type="button"
                    data-speech-text="${encodeURIComponent(currentSentence.mn)}"
                    class="play-sentence-btn text-xs px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-rose-300 text-rose-700 dark:text-rose-300 font-bold flex items-center gap-1 cursor-pointer">
                    <span>🔊 正解発音を聴く</span>
                  </button>
                </div>
                <div class="text-xs space-y-1">
                  <div>正解: <strong class="correct-answer-text font-black text-sm cyrillic-text text-emerald-700 dark:text-emerald-300">${currentSentence.mn}</strong></div>
                  <div>あなたの入力: <span class="line-through text-rose-700 dark:text-rose-400 font-semibold">${this.typingUserInput || '（空欄）'}</span></div>
                </div>
                ${currentSentence.explanation ? `
                  <div class="text-xs text-slate-600 dark:text-slate-300 pt-1.5 border-t border-rose-200 dark:border-rose-800">
                    💡 ${currentSentence.explanation}
                  </div>
                ` : ''}
              </div>
            `}
          ` : ''}

          <!-- アクションボタン -->
          <div>
            ${!this.typingHasAnswered ? `
              <button
                type="button"
                id="btn-submit-interview-typing"
                class="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl shadow-md transition-all active:scale-98 text-sm flex items-center justify-center gap-1.5 cursor-pointer">
                <span>判定する（Enter）</span>
              </button>
            ` : `
              ${this.typingIsCorrect ? `
                <button
                  type="button"
                  id="btn-next-interview-typing"
                  class="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl shadow-md transition-all active:scale-98 text-sm flex items-center justify-center gap-1.5 cursor-pointer">
                  <span>${this.typingSentenceIndex + 1 < totalSentences ? '次の文へ進む（Enter） →' : '全問クリア！結果を見る 🎉'}</span>
                </button>
              ` : `
                <div class="flex gap-2">
                  <button
                    type="button"
                    id="btn-retry-interview-typing"
                    class="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl shadow-xs transition-all active:scale-98 text-xs cursor-pointer">
                    🔄 もう一度打つ
                  </button>
                  <button
                    type="button"
                    id="btn-next-interview-typing"
                    class="flex-1 py-3 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-2xl shadow-xs transition-all active:scale-98 text-xs cursor-pointer">
                    ${this.typingSentenceIndex + 1 < totalSentences ? '次の文へ進む →' : '結果を見る 🎉'}
                  </button>
                </div>
              `}
            `}
          </div>

        </div>
      </div>
    `;
  }

  // Step 4: 4分スピーチ実践・面接シミュレーション（言えるようにする）
  static renderStep4(topic) {
    const isRunning = this.isTimerRunning;
    const minutes = Math.floor(this.timerSeconds / 60);
    const seconds = this.timerSeconds % 60;
    const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    const targetMin = Math.floor((topic.targetTimeSeconds || 60) / 60);

    return `
      <div>
        <!-- 4分スピーチタイマー ＆ コントロール -->
        <div class="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-6 sm:p-7 text-white shadow-lg mb-6">
          <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-2">
                ⏱️ 目標時間: 約4分（1〜7問全体で4分程度）
              </span>
              <h3 class="text-lg font-bold">口頭スピーチ・発話タイム測定</h3>
              <p class="text-xs text-slate-300 mt-0.5">
                日本語のガイドだけを見て、声に出してモンゴル語でスピーチしてみましょう！
              </p>
            </div>

            <!-- タイマー表示 ＆ 操作ボタン -->
            <div class="flex items-center gap-3">
              <div class="font-mono text-3xl sm:text-4xl font-extrabold text-emerald-400 bg-black/40 px-4 py-2 rounded-2xl border border-white/10 shadow-inner">
                ${timeFormatted}
              </div>
              <div class="flex flex-col gap-1.5">
                <button
                  type="button"
                  id="timer-start-stop-btn"
                  class="px-4 py-2 rounded-xl font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${isRunning ? 'bg-rose-600 hover:bg-rose-700 text-white' : 'bg-emerald-600 hover:bg-emerald-700 text-white'}">
                  <span>${isRunning ? '⏸ 一時停止' : '▶ スタート'}</span>
                </button>
                <button
                  type="button"
                  id="timer-reset-btn"
                  class="px-4 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-medium text-xs transition-all cursor-pointer">
                  🔄 リセット
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 日本語のアウトラインガイド（モンゴル語は見ずに話す練習） -->
        <div class="bg-amber-50/60 border border-amber-200 rounded-2xl p-5 mb-6">
          <div class="flex items-center justify-between gap-2 mb-3">
            <h4 class="text-sm font-bold text-amber-900 flex items-center gap-1.5">
              <span>🗣️</span> 話す内容のガイド（日本語）
            </h4>
            <span class="text-xs text-amber-700 font-medium">※これを見ながら声に出してスピーチ！</span>
          </div>

          <div class="space-y-2 text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
            ${topic.sentences.map((s, idx) => `
              <div class="flex items-start gap-2 bg-white/80 p-2.5 rounded-xl border border-amber-100">
                <span class="w-5 h-5 rounded-full bg-amber-200 text-amber-900 text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  ${idx + 1}
                </span>
                <span>${s.ja}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- 模範回答オープンボタン -->
        <div class="mb-6 text-center">
          <button
            type="button"
            id="reveal-speech-answer-btn"
            class="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all inline-flex items-center gap-2 cursor-pointer">
            <span>${this.revealedSpeech ? '🙈 模範回答を隠す' : '👀 話し終えたら「模範回答」を開いて答え合わせ'}</span>
          </button>
        </div>

        <!-- 模範回答（答え合わせ領域） -->
        ${this.revealedSpeech ? `
          <div class="bg-white rounded-3xl border-2 border-emerald-500 p-6 sm:p-7 shadow-lg mb-6 animate-fadeIn">
            <div class="flex items-center justify-between gap-3 border-b border-slate-100 pb-3 mb-4">
              <span class="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                ✓ モンゴル語模範回答（正解テキスト ＆ 音声）
              </span>
              <button
                type="button"
                id="play-model-speech-btn"
                class="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer">
                <span>🔊 模範発音を聴く</span>
              </button>
            </div>

            <p class="text-base sm:text-lg font-bold text-slate-900 leading-loose mb-6">
              ${topic.fullTextMn}
            </p>

            <!-- 自己評価 ＆ 合格チェック -->
            <div class="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-center">
              <h5 class="text-xs font-bold text-slate-700 mb-2">今回の発話・スピーチ自己評価:</h5>
              <div class="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                <button
                  type="button"
                  data-eval="perfect"
                  class="eval-btn px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-xs hover:bg-emerald-700 cursor-pointer">
                  ⭐ スラスラ言えた！（暗記完了）
                </button>
                <button
                  type="button"
                  data-eval="good"
                  class="eval-btn px-4 py-2 rounded-xl bg-teal-600 text-white font-bold text-xs shadow-xs hover:bg-teal-700 cursor-pointer">
                  👍 大体言えた（要復習）
                </button>
                <button
                  type="button"
                  data-eval="retry"
                  class="eval-btn px-4 py-2 rounded-xl bg-slate-200 text-slate-700 font-bold text-xs shadow-xs hover:bg-slate-300 cursor-pointer">
                  🔄 もう一度練習
                </button>
              </div>
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }

  // Step 5: 出題単語テスト用の単語リスト初期化
  static initVocabList(topic, forceReset = false) {
    if (this.vocabActiveList && this.vocabActiveList.length > 0 && !forceReset) {
      return this.vocabActiveList;
    }
    let list = [];
    if (this.vocabScope === 'current') {
      list = interviewVocabulary.filter(w => (w.topicIds || []).includes(topic.id));
      if (!list || list.length === 0) {
        list = (topic.vocabulary || []).map((v, i) => {
          const vLow = (v.mn || '').trim().toLowerCase();
          const matchedS = (topic.sentences || []).find(s => s.mn && s.mn.toLowerCase().includes(vLow)) || topic.sentences[0] || {};
          return {
            id: `iv_fallback_${topic.id}_${i}`,
            mongolian: v.mn,
            dictForm: v.mn,
            japanese: v.ja,
            pos: v.pos || '単語',
            pronunciation: v.pron || '',
            topicIds: [topic.id],
            exampleMn: matchedS.mn || '',
            exampleJa: matchedS.ja || ''
          };
        });
      }
    } else {
      list = [...interviewVocabulary];
    }
    this.vocabActiveList = shuffleArray([...list]);
    this.vocabQuizIndex = 0;
    this.vocabUserInput = '';
    this.vocabHasAnswered = false;
    this.vocabIsCorrect = false;
    this.vocabShowHint = false;
    this.vocabMistakes = [];
    return this.vocabActiveList;
  }

  // Step 5: 出題単語特訓テスト メイン画面描画
  static renderStep5(topic) {
    const activeList = this.initVocabList(topic);
    const totalCount = activeList.length;
    const isCompleted = this.vocabQuizIndex >= totalCount;

    const currentTopicWords = interviewVocabulary.filter(w => (w.topicIds || []).includes(topic.id));
    const currentCount = currentTopicWords.length || (topic.vocabulary || []).length;
    const allCount = interviewVocabulary.length;

    // 全問完了結果画面
    if (isCompleted) {
      const correctCount = totalCount - (this.vocabMistakes ? this.vocabMistakes.length : 0);
      const accuracy = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 100;
      return `
        <div class="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl text-center space-y-5 animate-bounce-in">
          <div class="text-6xl mb-1">🎉🏆</div>
          <h3 class="text-xl sm:text-2xl font-black">口頭試験 出題単語テスト 完了！</h3>
          <p class="text-xs sm:text-sm text-emerald-100 max-w-lg mx-auto leading-relaxed">
            ${this.vocabScope === 'current' ? `テーマ「${topic.titleJa}」の出題単語全 ${totalCount} 語` : `口頭試験13テーマの全出題単語 ${totalCount} 語`} のテストを完走しました！
          </p>

          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-md mx-auto">
            <div class="bg-white/15 backdrop-blur-xs rounded-2xl p-3 border border-white/20">
              <div class="text-xs text-emerald-200">問題数</div>
              <div class="text-xl font-black">${totalCount} 問</div>
            </div>
            <div class="bg-white/15 backdrop-blur-xs rounded-2xl p-3 border border-white/20">
              <div class="text-xs text-emerald-200">正解数</div>
              <div class="text-xl font-black text-emerald-300">${correctCount} 問</div>
            </div>
            <div class="col-span-2 sm:col-span-1 bg-white/15 backdrop-blur-xs rounded-2xl p-3 border border-white/20">
              <div class="text-xs text-emerald-200">正解率</div>
              <div class="text-xl font-black">${accuracy}%</div>
            </div>
          </div>

          ${(this.vocabMistakes && this.vocabMistakes.length > 0) ? `
            <div class="p-4 bg-white/95 dark:bg-slate-900/90 rounded-2xl border border-rose-300 text-left space-y-3 text-slate-800 dark:text-slate-200">
              <div class="flex items-center justify-between">
                <span class="text-xs font-black text-rose-700 flex items-center gap-1.5">
                  <span>🔥</span> 間違えた単語 (${this.vocabMistakes.length}件)
                </span>
                <span class="text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-full">間違いノートに保存済</span>
              </div>
              <div class="space-y-2 max-h-48 overflow-y-auto pr-1">
                ${(this.vocabActiveList || []).map(w => {
                const isMistake = (this.vocabMistakes || []).some(m => m.id === w.id);
                return `
                  <li class="p-3 bg-white dark:bg-slate-800/80 rounded-xl border ${isMistake ? 'border-rose-300 dark:border-rose-900 bg-rose-50/30' : 'border-slate-200 dark:border-slate-700'} flex items-center justify-between gap-3 text-xs">
                    <div class="flex items-center gap-2 min-w-0">
                      <span class="text-sm">${isMistake ? '❌' : '⭕'}</span>
                      <div class="min-w-0">
                        <div class="font-black text-slate-900 dark:text-white cyrillic-text truncate">
                          ${w.dictForm || w.mongolian}
                          ${w.pronunciation ? `<span class="text-[11px] font-normal text-slate-500 ml-1.5">[${w.pronunciation}]</span>` : ''}
                        </div>
                        <div class="text-[11px] text-slate-600 dark:text-slate-400 truncate">
                          ${w.japanese}
                        </div>
                      </div>
                    </div>
                    <div class="flex items-center gap-2 shrink-0">
                      ${(typeof renderReviewToggleButtonHTML === 'function') ? renderReviewToggleButtonHTML({ id: w.id, wordId: w.id, question: w.mongolian, correctAnswer: w.japanese, japanese: w.japanese, category: '口頭試験', type: 'oral_vocab' }) : ''}
                      <button type="button" class="btn-speak-iv-word text-slate-400 hover:text-teal-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer" data-word="${w.dictForm || w.mongolian}">
                        🔊
                      </button>
                    </div>
                  </li>
                `;
              }).join('')}
              </div>
              <div class="flex flex-col sm:flex-row gap-2 pt-1">
                <button type="button" id="btn-retry-vocab-mistakes" class="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer">
                  <span>🔄 間違えた ${this.vocabMistakes.length} 語だけ再テスト</span>
                </button>
                <button type="button" id="btn-goto-mistakes-from-vocab" class="flex-1 py-2 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-bold rounded-xl text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer">
                  <span>🔥 ホームの間違いノートへ →</span>
                </button>
              </div>
            </div>
          ` : `
            <div class="p-3 bg-emerald-500/20 border border-emerald-300 rounded-xl text-xs text-emerald-100 font-bold">
              🌟 全問パーフェクト！口頭試験の出題単語を完璧にマスターしました！
            </div>
          `}

          <div class="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              id="btn-restart-vocab-test"
              class="px-5 py-2.5 rounded-xl bg-white text-slate-900 font-bold text-xs shadow-md hover:bg-slate-100 active:scale-95 transition-all cursor-pointer">
              🔄 もう一度最初からテストする
            </button>
          </div>
        </div>
      `;
    }

    const currentWord = activeList[this.vocabQuizIndex];
    if (!currentWord) return '';

    return `
      <div class="space-y-5 animate-fade-in">
        <!-- 上部ヘッダー＆出題範囲切り替え -->
        <div class="bg-gradient-to-r from-teal-500/10 via-emerald-500/10 to-sky-500/10 border border-teal-300/60 dark:border-teal-700/60 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="flex items-center gap-2.5">
            <span class="text-2xl select-none">📝</span>
            <div>
              <h3 class="text-sm font-bold text-teal-950 dark:text-teal-200">
                口頭試験 出題単語特訓テスト
              </h3>
              <p class="text-[11px] text-teal-700 dark:text-teal-400">
                この13テーマに出現する全単語・かつここに出てくる単語のみを徹底反復！
              </p>
            </div>
          </div>

          <!-- スコープ切り替えボタン -->
          <div class="flex items-center gap-1.5 bg-white/80 dark:bg-slate-800 p-1 rounded-xl border border-teal-200/60">
            <button
              type="button"
              id="btn-scope-current"
              class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${this.vocabScope === 'current' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}">
              このテーマ (${currentCount}語)
            </button>
            <button
              type="button"
              id="btn-scope-all"
              class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${this.vocabScope === 'all' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}">
              全13テーマ (${allCount}語)
            </button>
          </div>
        </div>

        <!-- 進捗プログレスバー -->
        <div class="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
          <span>単語 ${this.vocabQuizIndex + 1} / ${totalCount}</span>
          <span>残り ${totalCount - this.vocabQuizIndex} 語</span>
        </div>
        <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden -mt-3">
          <div class="bg-emerald-500 h-2 rounded-full transition-all duration-300" style="width: ${Math.round(((this.vocabQuizIndex + 1) / totalCount) * 100)}%"></div>
        </div>

        <!-- 単語問題カード -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6 text-center">
          <div class="flex flex-wrap items-center justify-center gap-2">
            <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              ${currentWord.pos || '単語'}
            </span>
            <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              口頭試験出題
            </span>
            ${currentWord.isVerb ? '<span class="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">動詞（辞書形）</span>' : ''}
          </div>

          <div>
            <div class="text-xs text-slate-400 font-semibold mb-1">日本語の意味に合うキリル文字を入力</div>
            <h2 class="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              ${currentWord.japanese}
            </h2>
          </div>

          <!-- ヒントトグル -->
          <div>
            <button
              type="button"
              id="btn-toggle-vocab-hint"
              class="text-xs text-emerald-700 hover:text-emerald-900 font-medium inline-flex items-center gap-1 cursor-pointer bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              <span>💡 ${this.vocabShowHint ? 'ヒントを隠す ▲' : '例文ヒントを見る ▼'}</span>
            </button>
            ${this.vocabShowHint ? `
              <div class="mt-3 p-3 rounded-2xl bg-amber-50/80 border border-amber-200 text-left max-w-md mx-auto text-xs space-y-1 animate-fade-in">
                ${currentWord.pronunciation ? `<div class="text-amber-900"><strong>読み方:</strong> ${currentWord.pronunciation}</div>` : ''}
                ${currentWord.exampleJa ? `<div class="text-slate-600"><strong>例文訳:</strong> ${currentWord.exampleJa}</div>` : ''}
              </div>
            ` : ''}
          </div>

          <!-- 回答前入力欄 -->
          ${!this.vocabHasAnswered ? `
            <div class="max-w-md mx-auto space-y-3 pt-2">
              <div class="relative">
                <input
                  type="text"
                  id="interview-vocab-input"
                  class="w-full text-center text-lg sm:text-xl font-bold px-4 py-3.5 rounded-2xl border-2 border-slate-300 focus:border-emerald-500 focus:outline-hidden transition-all shadow-inner cyrillic-text"
                  placeholder="キリル文字で入力..."
                  value="${this.vocabUserInput || ''}"
                  autocomplete="off"
                  autofocus />
              </div>

              <!-- 特殊文字バー & 仮想キーボードアシスタント -->
              <div class="flex justify-center">
                ${renderCyrillicInputAssistantHTML('interview-vocab-input')}
              </div>

              <button
                type="button"
                id="btn-submit-vocab-answer"
                class="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md active:scale-98 transition-all cursor-pointer">
                回答する (Enter)
              </button>
            </div>
          ` : `
            <!-- 回答後フィードバックカード -->
            <div class="max-w-md mx-auto p-5 rounded-2xl border text-left space-y-3 animate-fade-in ${this.vocabIsCorrect ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-rose-50 border-rose-300 text-rose-950'}">
              <div class="flex items-center justify-between">
                <span class="text-sm font-black flex items-center gap-1.5">
                  <span>${this.vocabIsCorrect ? '🎉 正解！' : '❌ 不正解'}</span>
                </span>
                <button
                  type="button"
                  id="btn-speak-vocab-answer"
                  class="text-xs font-bold px-2.5 py-1 rounded-lg border bg-white flex items-center gap-1 cursor-pointer shadow-xs">
                  <span>🔊 発音を聴く</span>
                </button>
              </div>

              <div class="space-y-1">
                <div class="text-xs text-slate-500">正解:</div>
                <div class="text-xl sm:text-2xl font-black cyrillic-text text-emerald-800">
                  ${currentWord.dictForm || currentWord.mongolian}
                  ${currentWord.pronunciation ? `<span class="text-xs font-normal text-slate-600 ml-2">[${currentWord.pronunciation}]</span>` : ''}
                </div>
              </div>

              ${!this.vocabIsCorrect ? `
                <div class="text-xs text-rose-700 pt-1 border-t border-rose-200">
                  あなたの入力: <span class="line-through font-bold">${this.vocabUserInput || '(未入力)'}</span>
                </div>
                <div class="text-[11px] bg-rose-100 text-rose-800 px-2.5 py-1 rounded-lg font-bold">
                  ⚠️ 間違いノートに自動保存しました（ホームでまとめて再復習できます）
                </div>
              ` : ''}

              <!-- 詳しい解説 -->
              ${currentWord.explanation ? `
                <div class="p-3 rounded-xl bg-white/90 dark:bg-slate-800/90 border border-emerald-200 dark:border-emerald-800 text-xs leading-relaxed space-y-1">
                  <div class="font-black text-emerald-800 dark:text-emerald-300 flex items-center gap-1 text-[11px]">
                    <span>💡</span> 詳しい解説・文法ポイント
                  </div>
                  <div class="text-slate-700 dark:text-slate-200">
                    ${currentWord.explanation}
                  </div>
                </div>
              ` : ''}

              <!-- 実用例文 -->
              ${currentWord.exampleMn ? `
                <div class="p-3 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs space-y-1">
                  <div class="font-black text-amber-900 dark:text-amber-300 flex items-center gap-1 text-[11px]">
                    <span>📝</span> 口頭試験での実用例文
                  </div>
                  <div class="font-bold cyrillic-text text-slate-800 dark:text-slate-100 text-sm">
                    ${currentWord.exampleMn}
                  </div>
                  <div class="text-slate-600 dark:text-slate-400">
                    ${currentWord.exampleJa || ''}
                  </div>
                </div>
              ` : ''}

              <button
                type="button"
                id="btn-next-vocab-question"
                class="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-2">
                <span>次の単語へ (Enter) →</span>
              </button>
            </div>
          `}
        </div>
      </div>
    `;
  }

  static renderStepContent(topic) {
    switch (this.currentStep) {
      case 1:
        return this.renderStep1(topic);
      case 2:
        return this.renderStep2(topic);
      case 3:
        return this.renderStep3(topic);
      case 4:
        return this.renderStep4(topic);
      case 5:
        return this.renderStep5(topic);
      default:
        return this.renderStep1(topic);
    }
  }

  static attachEventListeners(topic) {
    const container = this.container;
    if (!container) return;

    // トップサブモード切替タブ
    const tabSpeech = container.querySelector('#tab-submode-speech');
    if (tabSpeech) {
      tabSpeech.addEventListener('click', () => {
        if (this.activeSubMode !== 'speech') {
          this.activeSubMode = 'speech';
          this.render(container, this.onNavigate);
        }
      });
    }

    const tabVocab = container.querySelector('#tab-submode-vocab');
    if (tabVocab) {
      tabVocab.addEventListener('click', () => {
        if (this.activeSubMode !== 'all_vocab') {
          this.activeSubMode = 'all_vocab';
          this.render(container, this.onNavigate);
        }
      });
    }

    const bannerVocabBtn = container.querySelector('#btn-goto-all-vocab-banner');
    if (bannerVocabBtn) {
      bannerVocabBtn.addEventListener('click', () => {
        this.activeSubMode = 'all_vocab';
        this.render(container, this.onNavigate);
      });
    }

    // 「口頭試験で出てくる単語をすべて覚える」モード時は専用イベントをバインドして早期リターン
    if (this.activeSubMode === 'all_vocab') {
      this.attachAllVocabEventListeners(container);
      return;
    }

    // テーマ選択ボタン
    container.querySelectorAll('.topic-select-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.topicIndex, 10);
        if (!isNaN(idx) && idx !== this.currentTopicIndex) {
          this.currentTopicIndex = idx;
          this.revealedSpeech = false;
          this.stopTimer();
          this.typingSentenceIndex = 0;
          this.typingUserInput = '';
          this.typingHasAnswered = false;
          this.typingIsCorrect = false;
          this.typingShowHint = false;
          this.typingMistakes = [];
          this.render(container, this.onNavigate);
        }
      });
    });

    // 暗記完了ステータストグル
    const toggleMasteredBtn = container.querySelector('#toggle-mastered-btn');
    if (toggleMasteredBtn) {
      toggleMasteredBtn.addEventListener('click', () => {
        const progressData = StorageService.getItem('interview_master_progress', {});
        const isMastered = progressData[topic.id] === 'mastered';
        if (isMastered) {
          delete progressData[topic.id];
        } else {
          progressData[topic.id] = 'mastered';
          if (GamificationService && typeof GamificationService.addXp === 'function') {
            GamificationService.addXp(30);
          }
        }
        StorageService.setItem('interview_master_progress', progressData);
        this.render(container, this.onNavigate);
      });
    }

    // 質問音声再生
    const playPromptBtn = container.querySelector('#play-prompt-speech-btn');
    if (playPromptBtn) {
      playPromptBtn.addEventListener('click', () => {
        SpeechService.speak(topic.examinerPromptMn);
      });
    }

    container.querySelectorAll('.btn-play-sub-question').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const text = btn.getAttribute('data-speech');
        if (text) SpeechService.speak(text);
      });
    });

    // ステップタブ切り替え
    container.querySelectorAll('.step-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const step = parseInt(btn.dataset.step, 10);
        if (!isNaN(step) && step !== this.currentStep) {
          this.currentStep = step;
          SpeechService.stop();
          this.render(container, this.onNavigate);
        }
      });
    });

    // Step 1: 全文再生 / 停止
    const playFullBtn = container.querySelector('#play-full-speech-btn');
    if (playFullBtn) {
      playFullBtn.addEventListener('click', () => {
        SpeechService.speak(topic.fullTextMn);
      });
    }
    const stopSpeechBtn = container.querySelector('#stop-speech-btn');
    if (stopSpeechBtn) {
      stopSpeechBtn.addEventListener('click', () => {
        SpeechService.stop();
      });
    }

    // 表示トグルチェックボックス
    const toggleMn = container.querySelector('#toggle-mn-check');
    if (toggleMn) {
      toggleMn.addEventListener('change', (e) => {
        this.showMongolian = e.target.checked;
        this.render(container, this.onNavigate);
      });
    }
    const toggleJa = container.querySelector('#toggle-ja-check');
    if (toggleJa) {
      toggleJa.addEventListener('change', (e) => {
        this.showJapanese = e.target.checked;
        this.render(container, this.onNavigate);
      });
    }
    const toggleRomaji = container.querySelector('#toggle-romaji-check');
    if (toggleRomaji) {
      toggleRomaji.addEventListener('change', (e) => {
        this.showRomaji = e.target.checked;
        this.render(container, this.onNavigate);
      });
    }

    // 単語タップ解説モーダル＆自動保存
    container.querySelectorAll('.clickable-word').forEach(span => {
      span.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        const rawToken = span.dataset.word;
        if (!rawToken) return;

        const info = findWordInDictionary(rawToken);
        const saved = StorageService.saveLookedUpWord({
          rawWord: rawToken,
          dictForm: info.dictForm,
          meaning: info.meaning,
          pos: info.pos,
          passageTitle: `口述試験: ${topic.titleJa || topic.titleMn}`
        });

        span.classList.remove('hover:bg-amber-100', 'border-dotted');
        span.classList.add('bg-amber-100/80', 'border-b-2', 'border-amber-400', 'font-bold', 'text-amber-950');

        try {
          SpeechService.speak(rawToken);
        } catch (_) {}

        showUniversalWordModal({
          wordInfo: info,
          passageTitle: `口述試験: ${topic.titleJa || topic.titleMn}`,
          onNavigate: this.onNavigate
        });
      });
    });

    // 各文の音声再生ボタン
    container.querySelectorAll('.play-sentence-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const txt = decodeURIComponent(btn.dataset.speechText || '');
        if (txt) {
          SpeechService.speak(txt);
        }
      });
    });

    // Step 2: 虫食い開示ボタン
    container.querySelectorAll('.cloze-reveal-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.clozeIdx, 10);
        if (!this.clozeAnswers[topic.id]) {
          this.clozeAnswers[topic.id] = {};
        }
        this.clozeAnswers[topic.id][idx] = true;
        // 単語音声も再生
        const s = topic.sentences[idx];
        if (s) {
          SpeechService.speak(s.clozeToken || s.mn);
        }
        this.render(container, this.onNavigate);
      });
    });

    const clozeResetBtn = container.querySelector('#cloze-reset-btn');
    if (clozeResetBtn) {
      clozeResetBtn.addEventListener('click', () => {
        if (this.clozeAnswers[topic.id]) {
          delete this.clozeAnswers[topic.id];
        }
        this.render(container, this.onNavigate);
      });
    }

    const clozeRevealAllBtn = container.querySelector('#cloze-reveal-all-btn');
    if (clozeRevealAllBtn) {
      clozeRevealAllBtn.addEventListener('click', () => {
        if (!this.clozeAnswers[topic.id]) {
          this.clozeAnswers[topic.id] = {};
        }
        topic.sentences.forEach((_, idx) => {
          this.clozeAnswers[topic.id][idx] = true;
        });
        this.render(container, this.onNavigate);
      });
    }

    // Step 3: タイマースタート/ストップ
    const timerBtn = container.querySelector('#timer-start-stop-btn');
    if (timerBtn) {
      timerBtn.addEventListener('click', () => {
        if (this.isTimerRunning) {
          this.stopTimer();
        } else {
          this.startTimer();
        }
        this.render(container, this.onNavigate);
      });
    }

    const timerResetBtn = container.querySelector('#timer-reset-btn');
    if (timerResetBtn) {
      timerResetBtn.addEventListener('click', () => {
        this.stopTimer();
        this.timerSeconds = 0;
        this.render(container, this.onNavigate);
      });
    }

    // 模範回答オープン
    const revealAnswerBtn = container.querySelector('#reveal-speech-answer-btn');
    if (revealAnswerBtn) {
      revealAnswerBtn.addEventListener('click', () => {
        this.revealedSpeech = !this.revealedSpeech;
        this.render(container, this.onNavigate);
      });
    }

    // 模範回答音声
    const playModelBtn = container.querySelector('#play-model-speech-btn');
    if (playModelBtn) {
      playModelBtn.addEventListener('click', () => {
        SpeechService.speak(topic.fullTextMn);
      });
    }

    // 自己評価ボタン
    container.querySelectorAll('.eval-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const evalType = btn.dataset.eval;
        const progressData = StorageService.getItem('interview_master_progress', {});
        if (evalType === 'perfect') {
          progressData[topic.id] = 'mastered';
          if (GamificationService && typeof GamificationService.addXp === 'function') {
            GamificationService.addXp(50);
          }
        } else if (evalType === 'good') {
          progressData[topic.id] = 'practicing';
          if (GamificationService && typeof GamificationService.addXp === 'function') {
            GamificationService.addXp(20);
          }
        }
        StorageService.setItem('interview_master_progress', progressData);
        alert(evalType === 'perfect' ? '🎉 素晴らしい！暗記完了として記録しました！(+50 XP)' : '👍 よく頑張りました！引き続き特訓しましょう！');
        this.render(container, this.onNavigate);
      });
    });

    // 外部リンク
    const gotoTyping = container.querySelector('#goto-typing-btn');
    if (gotoTyping) {
      gotoTyping.addEventListener('click', () => {
        this.currentStep = 3;
        this.typingSentenceIndex = 0;
        this.typingUserInput = '';
        this.typingHasAnswered = false;
        this.render(container, this.onNavigate);
      });
    }

    const gotoRoleplay = container.querySelector('#goto-roleplay-btn');
    if (gotoRoleplay && this.onNavigate) {
      gotoRoleplay.addEventListener('click', () => {
        this.onNavigate('roleplay');
      });
    }

    const restartTypingBtn = container.querySelector('#btn-restart-typing-drill');
    if (restartTypingBtn) {
      restartTypingBtn.addEventListener('click', () => {
        this.typingSentenceIndex = 0;
        this.typingUserInput = '';
        this.typingHasAnswered = false;
        this.typingIsCorrect = false;
        this.typingShowHint = false;
        this.typingMistakes = [];
        this.render(container, this.onNavigate);
      });
    }

    const gotoStep4Btn = container.querySelector('#btn-goto-step4-speech');
    if (gotoStep4Btn) {
      gotoStep4Btn.addEventListener('click', () => {
        this.currentStep = 4;
        this.render(container, this.onNavigate);
      });
    }

    // --- Step 5: 出題単語テスト イベントリスナー ---
    const vocabInput = container.querySelector('#interview-vocab-input');
    if (vocabInput) {
      vocabInput.addEventListener('input', (e) => {
        this.vocabUserInput = e.target.value;
      });
      vocabInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.handleVocabSubmit(topic);
        }
      });
      bindCyrillicInputAssistant(container, 'interview-vocab-input');
      setTimeout(() => vocabInput.focus(), 50);
    }

    const submitVocabBtn = container.querySelector('#btn-submit-vocab-answer');
    if (submitVocabBtn) {
      submitVocabBtn.addEventListener('click', () => {
        this.handleVocabSubmit(topic);
      });
    }

    const nextVocabBtn = container.querySelector('#btn-next-vocab-question');
    if (nextVocabBtn) {
      nextVocabBtn.addEventListener('click', () => {
        this.handleVocabNext(topic);
      });
      // Enter key for next question
      const enterNextHandler = (e) => {
        if (e.key === 'Enter') {
          window.removeEventListener('keydown', enterNextHandler);
          this.handleVocabNext(topic);
        }
      };
      window.addEventListener('keydown', enterNextHandler, { once: true });
    }

    const speakVocabBtn = container.querySelector('#btn-speak-vocab-answer');
    if (speakVocabBtn) {
      speakVocabBtn.addEventListener('click', () => {
        const activeList = this.vocabActiveList || [];
        const currentWord = activeList[this.vocabQuizIndex];
        if (currentWord) {
          SpeechService.speak(currentWord.dictForm || currentWord.mongolian);
        }
      });
    }

    const toggleVocabHintBtn = container.querySelector('#btn-toggle-vocab-hint');
    if (toggleVocabHintBtn) {
      toggleVocabHintBtn.addEventListener('click', () => {
        this.vocabShowHint = !this.vocabShowHint;
        this.render(container, this.onNavigate);
      });
    }

    const scopeCurrentBtn = container.querySelector('#btn-scope-current');
    if (scopeCurrentBtn) {
      scopeCurrentBtn.addEventListener('click', () => {
        if (this.vocabScope !== 'current') {
          this.vocabScope = 'current';
          this.initVocabList(topic, true);
          this.render(container, this.onNavigate);
        }
      });
    }

    const scopeAllBtn = container.querySelector('#btn-scope-all');
    if (scopeAllBtn) {
      scopeAllBtn.addEventListener('click', () => {
        if (this.vocabScope !== 'all') {
          this.vocabScope = 'all';
          this.initVocabList(topic, true);
          this.render(container, this.onNavigate);
        }
      });
    }

    const restartVocabTestBtn = container.querySelector('#btn-restart-vocab-test');
    if (restartVocabTestBtn) {
      restartVocabTestBtn.addEventListener('click', () => {
        this.initVocabList(topic, true);
        this.render(container, this.onNavigate);
      });
    }

    const retryVocabMistakesBtn = container.querySelector('#btn-retry-vocab-mistakes');
    if (retryVocabMistakesBtn) {
      retryVocabMistakesBtn.addEventListener('click', () => {
        if (this.vocabMistakes && this.vocabMistakes.length > 0) {
          this.vocabActiveList = this.vocabMistakes.map(m => ({
            id: m.id,
            mongolian: m.mn,
            dictForm: m.mn,
            japanese: m.ja,
            pronunciation: m.pron || '',
            pos: '単語'
          }));
          this.vocabQuizIndex = 0;
          this.vocabUserInput = '';
          this.vocabHasAnswered = false;
          this.vocabIsCorrect = false;
          this.vocabMistakes = [];
          this.render(container, this.onNavigate);
        }
      });
    }

    const gotoMistakesFromVocab = container.querySelector('#btn-goto-mistakes-from-vocab');
    if (gotoMistakesFromVocab) {
      gotoMistakesFromVocab.addEventListener('click', () => {
        if (this.onNavigate) this.onNavigate('review');
      });
    }

    const gotoMistakesInterviewBtn = container.querySelector('#btn-goto-mistakes-from-interview');
    if (gotoMistakesInterviewBtn) {
      gotoMistakesInterviewBtn.addEventListener('click', () => {
        if (typeof ReviewNotebookComponent !== 'undefined') {
          ReviewNotebookComponent.state.view = 'list';
          ReviewNotebookComponent.state.filterType = 'all';
        }
        if (this.onNavigate) this.onNavigate('review');
      });
    }
  }

  static handleTypingSubmit(topic) {
    const currentSentence = topic.sentences[this.typingSentenceIndex];
    if (!currentSentence) return;

    const userText = (this.typingUserInput || '').trim();
    const correctText = currentSentence.mn.trim();

    // 句読点・記号・空白無視の柔軟なマッチング判定
    const clean = (s) => (s || '').toLowerCase().replace(/[.,!?！？。、\s\-_'"]/g, '').trim();
    const isCorrect = isFuzzyMatch(userText, correctText) || (clean(userText) === clean(correctText));

    this.typingHasAnswered = true;
    this.typingIsCorrect = isCorrect;

    if (isCorrect) {
      if (!this.typingCompleted[topic.id]) {
        this.typingCompleted[topic.id] = {};
      }
      this.typingCompleted[topic.id][this.typingSentenceIndex] = true;

      // 正解音 & 音声読み上げ & XP加算
      try {
        if (typeof SoundEffects !== 'undefined' && typeof SoundEffects.playCorrect === 'function') {
          SoundEffects.playCorrect();
        }
      } catch (_) {}
      SpeechService.speak(correctText);

      if (typeof GamificationService !== 'undefined' && typeof GamificationService.addXp === 'function') {
        GamificationService.addXp(10);
      }
    } else {
      try {
        if (typeof SoundEffects !== 'undefined' && typeof SoundEffects.playWrong === 'function') {
          SoundEffects.playWrong();
        }
      } catch (_) {}
      try {
        StorageService.recordMistake({
          question: `【口述試験タイピング: ${topic.title}】${currentSentence.ja}`,
          userAnswer: userText || '(未回答)',
          correctAnswer: correctText,
          type: 'typing',
          category: topic.title || '口述試験',
          explanation: `${correctText}（${currentSentence.ja}）。${currentSentence.note || ''}`
        });
      } catch (_) {}
      if (!this.typingMistakes) this.typingMistakes = [];
      this.typingMistakes.push({
        ja: currentSentence.ja,
        mn: correctText,
        user: userText || '(未回答)',
        note: currentSentence.note
      });
    }

    this.render(this.container, this.onNavigate);
  }

  static handleTypingNext(topic) {
    this.typingSentenceIndex++;
    this.typingUserInput = '';
    this.typingHasAnswered = false;
    this.typingIsCorrect = false;
    this.typingShowHint = false;
    this.render(this.container, this.onNavigate);
  }

  static startTimer() {
    this.isTimerRunning = true;
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      this.timerSeconds++;
      const timerDisplay = document.querySelector('#step-content-area .font-mono');
      if (timerDisplay) {
        const minutes = Math.floor(this.timerSeconds / 60);
        const seconds = this.timerSeconds % 60;
        timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
      }
    }, 1000);
  }

  static stopTimer() {
    this.isTimerRunning = false;
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  static handleVocabSubmit(topic) {
    const activeList = this.vocabActiveList || [];
    const currentWord = activeList[this.vocabQuizIndex];
    if (!currentWord) return;

    const userText = (this.vocabUserInput || '').trim();
    const correctText = (currentWord.dictForm || currentWord.mongolian).trim();

    const clean = (s) => (s || '').toLowerCase().replace(/[.,!?！？。、\s\-_'"]/g, '').trim();
    const isCorrect = isFuzzyMatch(userText, correctText) || (clean(userText) === clean(correctText));

    this.vocabHasAnswered = true;
    this.vocabIsCorrect = isCorrect;

    if (isCorrect) {
      try {
        if (typeof SoundEffects !== 'undefined' && typeof SoundEffects.playCorrect === 'function') {
          SoundEffects.playCorrect();
        }
      } catch (_) {}
      try {
        SpeechService.speak(correctText);
      } catch (_) {}
      if (typeof GamificationService !== 'undefined' && typeof GamificationService.addXp === 'function') {
        GamificationService.addXp(10);
      }
    } else {
      try {
        if (typeof SoundEffects !== 'undefined' && typeof SoundEffects.playWrong === 'function') {
          SoundEffects.playWrong();
        }
      } catch (_) {}
      try {
        StorageService.recordMistake({
          wordId: currentWord.id || null,
          question: `【口頭試験単語】${currentWord.japanese}`,
          userAnswer: userText || '(未入力)',
          correctAnswer: correctText,
          type: 'word',
          category: '口頭試験単語',
          explanation: `正解: ${correctText} [${currentWord.pronunciation || ''}] = ${currentWord.japanese} (${currentWord.pos || '単語'})`
        });
      } catch (err) {
        console.warn('StorageService.recordMistake failed:', err);
      }
      if (!this.vocabMistakes) this.vocabMistakes = [];
      this.vocabMistakes.push({
        id: currentWord.id,
        ja: currentWord.japanese,
        mn: correctText,
        user: userText || '(未入力)',
        pron: currentWord.pronunciation
      });
    }

    this.render(this.container, this.onNavigate);
  }

  static handleVocabNext(topic) {
    this.vocabQuizIndex++;
    this.vocabUserInput = '';
    this.vocabHasAnswered = false;
    this.vocabIsCorrect = false;
    this.vocabShowHint = false;
    this.render(this.container, this.onNavigate);
  }

  // =========================================================================
  // 「口頭試験で出てくる単語をすべて覚える」専用機能・UI・ロジック
  // =========================================================================

  // トップ サブモード切替タブ（スピーチ演習 vs 口頭試験単語すべて覚える）
  static renderTopSubModeTabs() {
    return `
      <div class="flex items-center justify-center p-1.5 bg-slate-200/80 dark:bg-slate-800 rounded-2xl mb-6 max-w-xl mx-auto shadow-inner">
        <button
          type="button"
          id="tab-submode-speech"
          class="flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer ${this.activeSubMode === 'speech' ? 'bg-white dark:bg-slate-700 text-emerald-800 dark:text-emerald-300 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}">
          <span>🎙️</span>
          <span>13テーマ演習 (スピーチ・対話)</span>
        </button>
        <button
          type="button"
          id="tab-submode-vocab"
          class="flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer ${this.activeSubMode === 'all_vocab' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}">
          <span>📝</span>
          <span>単語をすべて覚える</span>
          <span class="text-[10px] px-1.5 py-0.5 rounded-full font-black ${this.activeSubMode === 'all_vocab' ? 'bg-white/20 text-white' : 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200'}">281語</span>
        </button>
      </div>
    `;
  }

  // 「口頭試験で出てくる単語をすべて覚える」メインコンテナ描画
  static renderAllVocabContent() {
    return `
      <div class="space-y-6 animate-fade-in">
        <!-- ヒーローヘッダー -->
        <div class="bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div class="absolute -right-6 -bottom-6 text-8xl opacity-15 select-none pointer-events-none">📝</div>
          <div class="relative z-10">
            <div class="flex flex-wrap items-center justify-between gap-3 mb-2">
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-xs">
                <span>✨</span> 口頭試験専用 完全単語マスター
              </span>
              <div class="flex items-center gap-2 text-xs text-white/90 font-medium">
                <span>収録総単語数: 全 281 語</span>
              </div>
            </div>
            <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
              口頭試験で出てくる単語をすべて覚える
            </h1>
            <p class="text-xs sm:text-sm text-emerald-100 max-w-2xl leading-relaxed">
              口頭試験（13テーマ・4分スピーチ＆実践対話）に出現するすべての単語・かつここに出てくる単語のみを完全網羅！キリル文字タイピングまたは4択クイズで、試験本番で即座に出てくる状態まで徹底特訓します。
            </p>

            <div class="grid grid-cols-3 gap-2 sm:gap-3 mt-4 max-w-md text-center">
              <div class="bg-white/10 backdrop-blur-xs rounded-xl p-2.5 border border-white/15">
                <div class="text-[10px] text-emerald-200">全出題単語</div>
                <div class="text-base sm:text-lg font-black">281 語</div>
              </div>
              <div class="bg-white/10 backdrop-blur-xs rounded-xl p-2.5 border border-white/15">
                <div class="text-[10px] text-emerald-200">スピーチ編 (1〜7)</div>
                <div class="text-base sm:text-lg font-black">170 語</div>
              </div>
              <div class="bg-white/10 backdrop-blur-xs rounded-xl p-2.5 border border-white/15">
                <div class="text-[10px] text-emerald-200">実践対話 (8〜13)</div>
                <div class="text-base sm:text-lg font-black">111 語</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 状態に応じた画面切り替え -->
        ${this.allVocabState.status === 'setup' ? this.renderAllVocabSetup() : ''}
        ${this.allVocabState.status === 'testing' ? this.renderAllVocabTesting() : ''}
        ${this.allVocabState.status === 'result' ? this.renderAllVocabResult() : ''}
        ${this.allVocabState.status === 'browse_list' ? this.renderAllVocabBrowseList() : ''}
      </div>
    `;
  }

  // 1. 設定 & スタート画面
  static renderAllVocabSetup() {
    const s = this.allVocabState;
    const allCount = interviewVocabulary.length;
    const speechCount = interviewVocabulary.filter(w => (w.topicIds || []).some(tid => parseInt(tid.replace('topic_', ''), 10) <= 7)).length;
    const dialogueCount = interviewVocabulary.filter(w => (w.topicIds || []).some(tid => parseInt(tid.replace('topic_', ''), 10) >= 8)).length;

    // 間違い単語数の取得
    let mistakeCount = 0;
    try {
      const mistakes = StorageService.getMistakes() || [];
      const ivIds = new Set(interviewVocabulary.map(w => w.id));
      const cleanMn = new Set(interviewVocabulary.map(w => (w.dictForm || w.mongolian || '').toLowerCase().replace(/[^а-яөүёa-z]/g, '')));
      mistakeCount = mistakes.filter(m => {
        if (m.wordId && ivIds.has(m.wordId)) return true;
        const cAns = (m.correctAnswer || '').toLowerCase().replace(/[^а-яөүёa-z]/g, '');
        return cleanMn.has(cAns);
      }).length;
    } catch (_) {}

    return `
      <div class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-md p-6 sm:p-8 space-y-6 animate-fade-in">
        <div>
          <h2 class="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>⚙️</span> テスト条件の設定
          </h2>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
            出題範囲・テスト形式（入力/4択）・問題数を選んでスタートしてください。
          </p>
        </div>

        <!-- ① 出題範囲の選択 -->
        <div>
          <label class="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2.5">
            ① 出題範囲を選択
          </label>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            <button
              type="button"
              data-vocab-scope="all"
              class="vocab-scope-btn p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer ${s.scope === 'all' ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100 shadow-xs' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-700 dark:text-slate-300'}">
              <div class="text-xs font-black flex items-center justify-between">
                <span>🌟 全13テーマの全単語</span>
                <span class="text-[10px] bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 px-2 py-0.5 rounded-full font-bold">推奨</span>
              </div>
              <div class="text-[11px] text-slate-500 dark:text-slate-400 mt-1">口頭試験の全${allCount}語を完全網羅</div>
            </button>

            <button
              type="button"
              data-vocab-scope="speech"
              class="vocab-scope-btn p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer ${s.scope === 'speech' ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100 shadow-xs' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-700 dark:text-slate-300'}">
              <div class="text-xs font-black">🎙️ 4分スピーチ編</div>
              <div class="text-[11px] text-slate-500 dark:text-slate-400 mt-1">テーマ1〜7の単語 (${speechCount}語)</div>
            </button>

            <button
              type="button"
              data-vocab-scope="dialogue"
              class="vocab-scope-btn p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer ${s.scope === 'dialogue' ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100 shadow-xs' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-700 dark:text-slate-300'}">
              <div class="text-xs font-black">💬 実践対話編</div>
              <div class="text-[11px] text-slate-500 dark:text-slate-400 mt-1">テーマ8〜13の単語 (${dialogueCount}語)</div>
            </button>

            <button
              type="button"
              data-vocab-scope="mistakes"
              class="vocab-scope-btn p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer ${s.scope === 'mistakes' ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100 shadow-xs' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-700 dark:text-slate-300'}">
              <div class="text-xs font-black flex items-center justify-between">
                <span>🔥 間違えた単語のみ</span>
                <span class="text-[10px] bg-rose-100 dark:bg-rose-900 text-rose-800 dark:text-rose-200 px-2 py-0.5 rounded-full font-bold">${mistakeCount}件</span>
              </div>
              <div class="text-[11px] text-slate-500 dark:text-slate-400 mt-1">要復習リストから弱点克服</div>
            </button>
          </div>

          <!-- テーマ個別絞り込みセレクト -->
          <div class="mt-3 flex items-center gap-2">
            <span class="text-xs text-slate-500 dark:text-slate-400 font-bold whitespace-nowrap">または特定テーマを指定:</span>
            <select
              id="select-vocab-single-topic"
              class="text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-emerald-500">
              <option value="">-- 指定なし（上記範囲に従う） --</option>
              ${interviewTopics.map(t => {
                const count = interviewVocabulary.filter(w => (w.topicIds || []).includes(t.id)).length;
                const isSelected = s.scope === t.id;
                return `<option value="${t.id}" ${isSelected ? 'selected' : ''}>${t.number}. ${t.titleJa} (${count}語)</option>`;
              }).join('')}
            </select>
          </div>
        </div>

        <!-- ② テスト形式の選択 -->
        <div>
          <label class="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2.5">
            ② テスト形式を選択
          </label>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              data-vocab-type="typing"
              class="vocab-type-btn p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-start gap-3.5 ${s.testType === 'typing' ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100 shadow-xs' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-700 dark:text-slate-300'}">
              <span class="text-3xl">⌨️</span>
              <div>
                <div class="text-sm font-black flex items-center gap-1.5">
                  <span>キリル文字入力（タイピング）</span>
                  <span class="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold">完全暗記向き</span>
                </div>
                <div class="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  日本語の意味を見て正確にキリル文字を入力。特殊文字バー＆PCキーボード配列対応。
                </div>
              </div>
            </button>

            <button
              type="button"
              data-vocab-type="choice"
              class="vocab-type-btn p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-start gap-3.5 ${s.testType === 'choice' ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100 shadow-xs' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-700 dark:text-slate-300'}">
              <span class="text-3xl">🔠</span>
              <div>
                <div class="text-sm font-black flex items-center gap-1.5">
                  <span>4択クイズテスト</span>
                  <span class="text-[10px] bg-teal-600 text-white px-2 py-0.5 rounded-full font-bold">スピード暗記向き</span>
                </div>
                <div class="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  4つの選択肢からサクサク解答。テンポよく何周も回して語彙を即答できるようにする。
                </div>
              </div>
            </button>
          </div>
        </div>

        <!-- ③ 出題数の選択（選択式 ＋ 自由入力） -->
        <div>
          <label class="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2.5">
            ③ 何問解くか選択（または自由入力）
          </label>
          <div class="flex flex-wrap items-center gap-2">
            ${[10, 20, 30, 50, allCount].map(num => {
              const label = num === allCount ? `全問 (${allCount}語)` : `${num}問`;
              const isSelected = !s.customCountInput && s.questionCount === num;
              return `
                <button
                  type="button"
                  data-vocab-count="${num}"
                  class="vocab-count-btn px-4 py-2 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer ${isSelected ? 'border-emerald-500 bg-emerald-500 text-white shadow-xs' : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'}">
                  ${label}
                </button>
              `;
            }).join('')}

            <!-- 自由入力枠 -->
            <div class="flex items-center gap-1.5 ml-1 bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-600">
              <span class="text-xs text-slate-600 dark:text-slate-400 font-bold">自由指定:</span>
              <input
                type="number"
                id="all-vocab-custom-count-input"
                min="1"
                max="${allCount}"
                placeholder="例: 15"
                value="${s.customCountInput || ''}"
                class="w-16 px-2 py-1 text-center text-xs font-bold rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-hidden focus:border-emerald-500" />
              <span class="text-xs text-slate-600 dark:text-slate-400 font-bold">問解く</span>
            </div>
          </div>
        </div>

        <!-- ④ 出題順 -->
        <div>
          <label class="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2.5">
            ④ 出題順
          </label>
          <div class="flex items-center gap-2">
            <button
              type="button"
              data-vocab-order="shuffle"
              class="vocab-order-btn px-4 py-2 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer ${s.order === 'shuffle' ? 'border-emerald-500 bg-emerald-500 text-white shadow-xs' : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'}">
              🔀 ランダム（シャッフル）
            </button>
            <button
              type="button"
              data-vocab-order="ordered"
              class="vocab-order-btn px-4 py-2 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer ${s.order === 'ordered' ? 'border-emerald-500 bg-emerald-500 text-white shadow-xs' : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'}">
              🔢 テーマ順（1→13）
            </button>
          </div>
        </div>

        <!-- アクションボタン -->
        <div class="pt-4 border-t border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row items-center gap-3">
          <button
            type="button"
            id="btn-start-all-vocab-test"
            class="w-full sm:flex-1 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-base shadow-lg hover:shadow-xl active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer">
            <span>🚀</span>
            <span>「口頭試験で出てくる単語」テストを開始する</span>
          </button>
          <button
            type="button"
            id="btn-open-all-vocab-list"
            class="w-full sm:w-auto px-5 py-4 rounded-2xl border-2 border-emerald-500/50 hover:bg-emerald-50 dark:hover:bg-slate-700 text-emerald-800 dark:text-emerald-300 font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap">
            <span>📖</span>
            <span>全281語の一覧・暗記カードを見る</span>
          </button>
        </div>
      </div>
    `;
  }

  // 2. テスト出題中画面（タイピング または 4択）
  static renderAllVocabTesting() {
    const s = this.allVocabState;
    const currentWord = s.activeQuestions[s.currentIndex];
    if (!currentWord) return '';

    const totalCount = s.activeQuestions.length;
    const currentNum = s.currentIndex + 1;
    const progressPercent = Math.round((currentNum / totalCount) * 100);

    // テーマ名の解決
    let topicName = '';
    if (currentWord.topicIds && currentWord.topicIds[0]) {
      const t = interviewTopics.find(it => it.id === currentWord.topicIds[0]);
      if (t) topicName = `テーマ${t.number}: ${t.titleJa}`;
    }

    return `
      <div class="space-y-5 animate-fade-in">
        <!-- 上部コントロール＆進捗バー -->
        <div class="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-bold px-1">
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-black">
              単語 ${currentNum} / ${totalCount}
            </span>
            ${topicName ? `<span class="hidden sm:inline text-slate-400">${topicName}</span>` : ''}
          </div>
          <button
            type="button"
            id="btn-abort-all-vocab-test"
            class="text-xs text-slate-400 hover:text-rose-600 font-bold flex items-center gap-1 cursor-pointer">
            <span>✕ 中断して設定へ</span>
          </button>
        </div>

        <div class="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden -mt-2">
          <div class="bg-gradient-to-r from-emerald-500 to-teal-500 h-2.5 rounded-full transition-all duration-300" style="width: ${progressPercent}%"></div>
        </div>

        <!-- 問題カード -->
        <div class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-md p-6 sm:p-8 space-y-6 text-center">
          <!-- バッジ -->
          <div class="flex flex-wrap items-center justify-center gap-2">
            <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
              ${currentWord.pos || '単語'}
            </span>
            <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-700">
              口頭試験出題
            </span>
            ${currentWord.isVerb ? '<span class="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">動詞（辞書形 ~х）</span>' : ''}
          </div>

          <!-- お題日本語 -->
          <div>
            <div class="text-xs text-slate-400 font-semibold mb-1">
              ${s.testType === 'typing' ? '日本語の意味に合うキリル文字を入力してください' : '日本語の意味に合うモンゴル語を選択してください'}
            </div>
            <h2 class="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              ${currentWord.japanese}
            </h2>
          </div>

          <!-- 例文ヒントトグル -->
          <div>
            <button
              type="button"
              id="btn-toggle-all-vocab-hint"
              class="text-xs text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 font-medium inline-flex items-center gap-1 cursor-pointer bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
              <span>💡 ${s.showHint ? 'ヒントを隠す ▲' : '例文ヒント・読み方を見る ▼'}</span>
            </button>
            ${s.showHint ? `
              <div class="mt-3 p-3.5 rounded-2xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-left max-w-md mx-auto text-xs space-y-1.5 animate-fade-in">
                ${currentWord.pronunciation ? `<div class="text-amber-900 dark:text-amber-200 font-bold">読み方: ${currentWord.pronunciation}</div>` : ''}
                ${currentWord.exampleMn ? `<div class="text-slate-800 dark:text-slate-200 cyrillic-text font-bold">例文: ${currentWord.exampleMn}</div>` : ''}
                ${currentWord.exampleJa ? `<div class="text-slate-600 dark:text-slate-400">訳: ${currentWord.exampleJa}</div>` : ''}
              </div>
            ` : ''}
          </div>

          <!-- 解答エリア（未回答時） -->
          ${!s.hasAnswered ? `
            ${s.testType === 'typing' ? `
              <!-- タイピング入力欄 -->
              <div class="max-w-md mx-auto space-y-3 pt-2">
                <div class="relative">
                  <input
                    type="text"
                    id="all-vocab-typing-input"
                    class="w-full text-center text-lg sm:text-xl font-bold px-4 py-3.5 rounded-2xl border-2 border-slate-300 dark:border-slate-600 focus:border-emerald-500 focus:outline-hidden transition-all shadow-inner cyrillic-text bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    placeholder="キリル文字で入力..."
                    value="${s.userInput || ''}"
                    autocomplete="off"
                    autofocus />
                </div>

                <!-- 特殊文字バー & 仮想キーボードアシスタント -->
                <div class="flex justify-center">
                  ${renderCyrillicInputAssistantHTML('all-vocab-typing-input')}
                </div>

                <button
                  type="button"
                  id="btn-submit-all-vocab-typing"
                  class="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md active:scale-98 transition-all cursor-pointer">
                  回答する (Enter)
                </button>
              </div>
            ` : `
              <!-- 4択選択肢 -->
              <div class="max-w-md mx-auto grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                ${(s.currentChoices || []).map((ch, idx) => `
                  <button
                    type="button"
                    data-choice-index="${idx}"
                    class="btn-all-vocab-choice p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 text-left transition-all font-bold cursor-pointer flex items-center justify-between gap-2 shadow-xs group">
                    <span class="text-base sm:text-lg cyrillic-text text-slate-800 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-300">
                      ${ch.text}
                    </span>
                    <span class="text-xs px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-500 font-mono">
                      ${idx + 1}
                    </span>
                  </button>
                `).join('')}
              </div>
            `}
          ` : `
            <!-- 回答後フィードバックカード -->
            <div class="max-w-md mx-auto p-5 rounded-2xl border text-left space-y-3 animate-fade-in ${s.isCorrect ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-950 dark:text-emerald-100' : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-700 text-rose-950 dark:text-rose-100'}">
              <div class="flex items-center justify-between">
                <span class="text-sm font-black flex items-center gap-1.5">
                  <span>${s.isCorrect ? '🎉 正解！' : '❌ 不正解'}</span>
                </span>
                <button
                  type="button"
                  id="btn-speak-all-vocab-word"
                  class="text-xs font-bold px-2.5 py-1 rounded-lg border bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center gap-1 cursor-pointer shadow-xs">
                  <span>🔊 発音を聴く</span>
                </button>
              </div>

              <div class="space-y-1">
                <div class="text-xs text-slate-500 dark:text-slate-400">正解:</div>
                <div class="text-xl sm:text-2xl font-black cyrillic-text text-emerald-800 dark:text-emerald-300">
                  ${currentWord.dictForm || currentWord.mongolian}
                  ${currentWord.pronunciation ? `<span class="text-xs font-normal text-slate-600 dark:text-slate-400 ml-2">[${currentWord.pronunciation}]</span>` : ''}
                </div>
              </div>

              ${!s.isCorrect ? `
                <div class="text-xs text-rose-700 dark:text-rose-300 pt-1 border-t border-rose-200 dark:border-rose-800">
                  あなたの回答: <span class="line-through font-bold">${s.testType === 'typing' ? (s.userInput || '(未入力)') : ((s.currentChoices[s.selectedChoice] || {}).text || '(未選択)')}</span>
                </div>
                <div class="text-[11px] bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-200 px-2.5 py-1 rounded-lg font-bold">
                  ⚠️ 間違いノートに自動保存しました（ホームでまとめて再復習できます）
                </div>
              ` : ''}

              <!-- 詳しい解説 -->
              ${currentWord.explanation ? `
                <div class="p-3.5 rounded-xl bg-white/90 dark:bg-slate-800/90 border border-emerald-200 dark:border-emerald-700 text-xs leading-relaxed space-y-1">
                  <div class="font-black text-emerald-800 dark:text-emerald-300 flex items-center gap-1 text-[11px]">
                    <span>💡</span> 詳しい解説・文法ポイント
                  </div>
                  <div class="text-slate-700 dark:text-slate-200">
                    ${currentWord.explanation}
                  </div>
                </div>
              ` : ''}

              <!-- 実用例文 -->
              ${currentWord.exampleMn ? `
                <div class="p-3.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs space-y-1">
                  <div class="font-black text-amber-900 dark:text-amber-300 flex items-center gap-1 text-[11px]">
                    <span>📝</span> 口頭試験での実用例文
                  </div>
                  <div class="font-bold cyrillic-text text-slate-800 dark:text-slate-100 text-sm">
                    ${currentWord.exampleMn}
                  </div>
                  <div class="text-slate-600 dark:text-slate-400">
                    ${currentWord.exampleJa || ''}
                  </div>
                </div>
              ` : ''}

              <button
                type="button"
                id="btn-next-all-vocab-question"
                class="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-3">
                <span>次の単語へ (Enter) →</span>
              </button>
            </div>
          `}
        </div>
      </div>
    `;
  }

  // 3. テスト完了結果画面
  static renderAllVocabResult() {
    const s = this.allVocabState;
    const totalCount = s.activeQuestions.length;
    const mistakeCount = (s.mistakes || []).length;
    const correctCount = totalCount - mistakeCount;
    const accuracy = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 100;

    return `
      <div class="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl text-center space-y-6 animate-fade-in">
        <div class="text-6xl mb-1 select-none">🎉🏆</div>
        <div>
          <h2 class="text-2xl sm:text-3xl font-black">口頭試験 出題単語テスト 完了！</h2>
          <p class="text-xs sm:text-sm text-emerald-100 max-w-lg mx-auto leading-relaxed mt-1">
            口頭試験に出現する重要単語 ${totalCount} 語の特訓を完走しました！
          </p>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-md mx-auto">
          <div class="bg-white/15 backdrop-blur-xs rounded-2xl p-3.5 border border-white/20">
            <div class="text-xs text-emerald-200 font-bold">出題数</div>
            <div class="text-xl sm:text-2xl font-black">${totalCount} 問</div>
          </div>
          <div class="bg-white/15 backdrop-blur-xs rounded-2xl p-3.5 border border-white/20">
            <div class="text-xs text-emerald-200 font-bold">正解数</div>
            <div class="text-xl sm:text-2xl font-black text-emerald-300">${correctCount} 問</div>
          </div>
          <div class="col-span-2 sm:col-span-1 bg-white/15 backdrop-blur-xs rounded-2xl p-3.5 border border-white/20">
            <div class="text-xs text-emerald-200 font-bold">正解率</div>
            <div class="text-xl sm:text-2xl font-black">${accuracy}%</div>
          </div>
        </div>

        <!-- 間違えた単語リスト -->
        ${mistakeCount > 0 ? `
          <div class="p-5 bg-white/95 dark:bg-slate-900/95 rounded-2xl border border-rose-300 text-left space-y-3 text-slate-800 dark:text-slate-200 max-w-xl mx-auto shadow-md">
            <div class="flex items-center justify-between">
              <span class="text-xs font-black text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                <span>🔥</span> 間違えた単語 (${mistakeCount}件)
              </span>
              <span class="text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-full">間違いノートに保存済</span>
            </div>
            <div class="space-y-2 max-h-56 overflow-y-auto pr-1">
              ${s.mistakes.map(m => `
                <div class="p-3 rounded-xl bg-rose-50/80 dark:bg-slate-800/80 border border-rose-200 dark:border-rose-900 text-xs space-y-1">
                  <div class="font-bold text-slate-700 dark:text-slate-300">🇯🇵 ${m.japanese}</div>
                  <div class="text-emerald-700 dark:text-emerald-400 font-bold cyrillic-text">正解: ${m.mongolian} ${m.pronunciation ? `[${m.pronunciation}]` : ''}</div>
                  ${m.userAnswer ? `<div class="text-rose-600 dark:text-rose-400 text-[11px]">あなたの回答: <span class="line-through">${m.userAnswer}</span></div>` : ''}
                </div>
              `).join('')}
            </div>
          </div>
        ` : `
          <div class="p-4 bg-white/15 rounded-2xl max-w-md mx-auto text-xs font-bold text-emerald-100">
            🌟 全問パーフェクト！口頭試験の語彙力は完璧です！
          </div>
        `}

        <div class="pt-2 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            id="btn-restart-all-vocab-same"
            class="px-5 py-3 rounded-xl bg-white text-slate-900 font-black text-xs shadow-md hover:bg-slate-100 active:scale-95 transition-all cursor-pointer">
            🔄 もう一度同じ条件でテスト
          </button>
          ${mistakeCount > 0 ? `
            <button
              type="button"
              id="btn-retry-all-vocab-mistakes"
              class="px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs shadow-md active:scale-95 transition-all cursor-pointer">
              🔥 間違えた単語 (${mistakeCount}語) だけ再特訓
            </button>
          ` : ''}
          <button
            type="button"
            id="btn-all-vocab-back-setup"
            class="px-5 py-3 rounded-xl bg-emerald-800/80 hover:bg-emerald-900 text-white font-bold text-xs shadow-md active:scale-95 transition-all cursor-pointer">
            ⚙️ 条件を変えてテスト
          </button>
          <button
            type="button"
            id="btn-all-vocab-back-speech"
            class="px-5 py-3 rounded-xl bg-cyan-900/60 hover:bg-cyan-950 text-white font-bold text-xs border border-white/20 active:scale-95 transition-all cursor-pointer">
            🎙️ 13テーマ演習へ戻る
          </button>
        </div>
      </div>
    `;
  }

  // 4. 全281語の一覧・暗記カード画面
  static renderAllVocabBrowseList() {
    const s = this.allVocabState;
    let list = [...interviewVocabulary];

    // スコープ絞り込み
    if (s.scope === 'speech') {
      list = list.filter(w => (w.topicIds || []).some(tid => parseInt(tid.replace('topic_', ''), 10) <= 7));
    } else if (s.scope === 'dialogue') {
      list = list.filter(w => (w.topicIds || []).some(tid => parseInt(tid.replace('topic_', ''), 10) >= 8));
    } else if (s.scope && s.scope.startsWith('topic_')) {
      list = list.filter(w => (w.topicIds || []).includes(s.scope));
    }

    // 品詞絞り込み
    if (s.filterPos && s.filterPos !== 'all') {
      list = list.filter(w => w.pos === s.filterPos);
    }

    // 検索語絞り込み
    if (s.searchQuery && s.searchQuery.trim()) {
      const q = s.searchQuery.trim().toLowerCase();
      list = list.filter(w => 
        (w.mongolian || '').toLowerCase().includes(q) ||
        (w.dictForm || '').toLowerCase().includes(q) ||
        (w.japanese || '').toLowerCase().includes(q) ||
        (w.pronunciation || '').toLowerCase().includes(q)
      );
    }

    return `
      <div class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-md p-6 sm:p-8 space-y-6 animate-fade-in">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700 pb-4">
          <div>
            <h2 class="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>📖</span> 口頭試験 全出題単語一覧 (${list.length} / ${interviewVocabulary.length}語)
            </h2>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              全281語の音声発音・意味・例文を一覧で確認して暗記できます。
            </p>
          </div>
          <button
            type="button"
            id="btn-close-vocab-browse"
            class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer self-start sm:self-auto">
            ← テスト設定に戻る
          </button>
        </div>

        <!-- 検索バー & 絞り込みタブ -->
        <div class="space-y-3">
          <div class="relative">
            <input
              type="text"
              id="all-vocab-search-input"
              class="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-bold focus:outline-hidden focus:border-emerald-500 transition-all"
              placeholder="🔍 キリル文字・日本語・読み方で瞬時に検索..."
              value="${s.searchQuery || ''}" />
          </div>

          <!-- 品詞フィルター -->
          <div class="flex flex-wrap items-center gap-1.5 text-xs">
            <span class="text-slate-400 font-bold mr-1">品詞:</span>
            ${['all', '動詞', '名詞', '形容詞', '副詞', '挨拶・間投詞'].map(pos => `
              <button
                type="button"
                data-filter-pos="${pos}"
                class="btn-filter-pos px-3 py-1 rounded-lg font-bold border transition-all cursor-pointer ${s.filterPos === pos ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs' : 'bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600'}">
                ${pos === 'all' ? 'すべて' : pos}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- 単語カードグリッド -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto pr-1">
          ${list.length > 0 ? list.map(w => `
            <div class="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 hover:border-emerald-400 dark:hover:border-emerald-600 transition-all space-y-2">
              <div class="flex items-start justify-between gap-2">
                <div>
                  <div class="flex items-center gap-1.5 mb-1">
                    <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                      ${w.pos || '単語'}
                    </span>
                    ${w.isVerb ? '<span class="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">辞書形</span>' : ''}
                  </div>
                  <div class="text-lg font-black cyrillic-text text-slate-900 dark:text-white">
                    ${w.dictForm || w.mongolian}
                  </div>
                </div>
                <button
                  type="button"
                  data-speak-text="${w.dictForm || w.mongolian}"
                  class="btn-speak-single-vocab p-2 rounded-xl bg-white dark:bg-slate-800 text-emerald-600 border border-slate-200 dark:border-slate-700 hover:bg-emerald-50 text-sm shadow-xs cursor-pointer">
                  🔊
                </button>
              </div>

              <div class="text-xs font-bold text-slate-700 dark:text-slate-300">
                🇯🇵 ${w.japanese}
                ${w.pronunciation ? `<span class="text-slate-400 dark:text-slate-500 font-normal ml-1">[${w.pronunciation}]</span>` : ''}
              </div>

              ${w.exampleMn ? `
                <div class="pt-2 border-t border-slate-200/60 dark:border-slate-700 text-[11px] space-y-0.5">
                  <div class="font-bold cyrillic-text text-emerald-800 dark:text-emerald-400">例: ${w.exampleMn}</div>
                  <div class="text-slate-500 dark:text-slate-400">${w.exampleJa || ''}</div>
                </div>
              ` : ''}
            </div>
          `).join('') : `
            <div class="col-span-2 py-12 text-center text-slate-400 text-xs font-bold">
              該当する単語が見つかりませんでした。
            </div>
          `}
        </div>
      </div>
    `;
  }

  // テストの開始処理
  static startAllVocabTest() {
    const s = this.allVocabState;
    let pool = [...interviewVocabulary];

    // スコープ絞り込み
    if (s.scope === 'speech') {
      pool = pool.filter(w => (w.topicIds || []).some(tid => parseInt(tid.replace('topic_', ''), 10) <= 7));
    } else if (s.scope === 'dialogue') {
      pool = pool.filter(w => (w.topicIds || []).some(tid => parseInt(tid.replace('topic_', ''), 10) >= 8));
    } else if (s.scope === 'mistakes') {
      try {
        const mistakes = StorageService.getMistakes() || [];
        const ivIds = new Set(interviewVocabulary.map(w => w.id));
        const cleanMnMap = {};
        interviewVocabulary.forEach(w => {
          cleanMnMap[(w.dictForm || w.mongolian || '').toLowerCase().replace(/[^а-яөүёa-z]/g, '')] = w;
        });
        const matched = [];
        mistakes.forEach(m => {
          if (m.wordId && ivIds.has(m.wordId)) {
            const w = interviewVocabulary.find(x => x.id === m.wordId);
            if (w && !matched.some(x => x.id === w.id)) matched.push(w);
          } else {
            const cAns = (m.correctAnswer || '').toLowerCase().replace(/[^а-яөүёa-z]/g, '');
            if (cleanMnMap[cAns] && !matched.some(x => x.id === cleanMnMap[cAns].id)) {
              matched.push(cleanMnMap[cAns]);
            }
          }
        });
        pool = matched.length > 0 ? matched : [...interviewVocabulary];
      } catch (_) {
        pool = [...interviewVocabulary];
      }
    } else if (s.scope && s.scope.startsWith('topic_')) {
      pool = pool.filter(w => (w.topicIds || []).includes(s.scope));
    }

    if (pool.length === 0) pool = [...interviewVocabulary];

    // 出題数の決定（自由指定入力優先）
    let count = s.questionCount || 20;
    if (s.customCountInput) {
      const parsed = parseInt(s.customCountInput, 10);
      if (!isNaN(parsed) && parsed > 0) {
        count = parsed;
      }
    }
    count = Math.min(count, pool.length);

    // 出題順
    let questions = [...pool];
    if (s.order === 'shuffle') {
      questions = shuffleArray(questions);
    }
    questions = questions.slice(0, count);

    s.activeQuestions = questions;
    s.currentIndex = 0;
    s.userInput = '';
    s.hasAnswered = false;
    s.isCorrect = false;
    s.selectedChoice = null;
    s.showHint = false;
    s.mistakes = [];
    s.status = 'testing';

    // 最初の問題が4択なら選択肢を生成
    if (s.testType === 'choice' && questions[0]) {
      s.currentChoices = this.generateChoicesForWord(questions[0]);
    }
  }

  // 4択選択肢の自動生成（同一品詞優先）
  static generateChoicesForWord(targetWord) {
    const correctText = targetWord.dictForm || targetWord.mongolian;
    const samePosWords = interviewVocabulary.filter(w => 
      (w.dictForm || w.mongolian) !== correctText &&
      w.pos === targetWord.pos
    );
    const otherWords = interviewVocabulary.filter(w => 
      (w.dictForm || w.mongolian) !== correctText &&
      w.pos !== targetWord.pos
    );

    let distractors = shuffleArray([...samePosWords]).slice(0, 3);
    if (distractors.length < 3) {
      const extra = shuffleArray([...otherWords]).slice(0, 3 - distractors.length);
      distractors = distractors.concat(extra);
    }

    const choices = [
      { text: correctText, isCorrect: true, word: targetWord },
      ...distractors.map(d => ({ text: d.dictForm || d.mongolian, isCorrect: false, word: d }))
    ];
    return shuffleArray(choices);
  }

  // タイピング回答判定
  static handleAllVocabTypingSubmit() {
    const s = this.allVocabState;
    const currentWord = s.activeQuestions[s.currentIndex];
    if (!currentWord || s.hasAnswered) return;

    const userText = (s.userInput || '').trim();
    const correctText = (currentWord.dictForm || currentWord.mongolian).trim();

    const clean = (str) => (str || '').toLowerCase().replace(/[.,!?！？。、\s\-_'"]/g, '').trim();
    const isCorrect = isFuzzyMatch(userText, correctText) || (clean(userText) === clean(correctText));

    s.hasAnswered = true;
    s.isCorrect = isCorrect;

    if (isCorrect) {
      try {
        if (typeof SoundEffects !== 'undefined' && typeof SoundEffects.playCorrect === 'function') {
          SoundEffects.playCorrect();
        }
      } catch (_) {}
      try { SpeechService.speak(correctText); } catch (_) {}
      if (typeof GamificationService !== 'undefined' && typeof GamificationService.addXp === 'function') {
        GamificationService.addXp(10);
      }
    } else {
      try {
        if (typeof SoundEffects !== 'undefined' && typeof SoundEffects.playWrong === 'function') {
          SoundEffects.playWrong();
        }
      } catch (_) {}
      try {
        StorageService.recordMistake({
          wordId: currentWord.id || null,
          question: `【口頭試験単語】${currentWord.japanese}`,
          userAnswer: userText || '(未入力)',
          correctAnswer: correctText,
          type: 'word',
          category: '口頭試験単語',
          explanation: `正解: ${correctText} [${currentWord.pronunciation || ''}] = ${currentWord.japanese} (${currentWord.pos || '単語'})。${currentWord.exampleMn ? `例文: ${currentWord.exampleMn}` : ''}`
        });
      } catch (_) {}
      s.mistakes.push({
        id: currentWord.id,
        japanese: currentWord.japanese,
        mongolian: correctText,
        pronunciation: currentWord.pronunciation,
        userAnswer: userText || '(未入力)'
      });
    }

    this.render(this.container, this.onNavigate);
  }

  // 4択回答判定
  static handleAllVocabChoice(choiceIndex) {
    const s = this.allVocabState;
    const currentWord = s.activeQuestions[s.currentIndex];
    if (!currentWord || s.hasAnswered) return;

    const selected = s.currentChoices[choiceIndex];
    if (!selected) return;

    s.selectedChoice = choiceIndex;
    s.hasAnswered = true;
    s.isCorrect = selected.isCorrect;

    const correctText = currentWord.dictForm || currentWord.mongolian;

    if (selected.isCorrect) {
      try {
        if (typeof SoundEffects !== 'undefined' && typeof SoundEffects.playCorrect === 'function') {
          SoundEffects.playCorrect();
        }
      } catch (_) {}
      try { SpeechService.speak(correctText); } catch (_) {}
      if (typeof GamificationService !== 'undefined' && typeof GamificationService.addXp === 'function') {
        GamificationService.addXp(10);
      }
    } else {
      try {
        if (typeof SoundEffects !== 'undefined' && typeof SoundEffects.playWrong === 'function') {
          SoundEffects.playWrong();
        }
      } catch (_) {}
      try {
        StorageService.recordMistake({
          wordId: currentWord.id || null,
          question: `【口頭試験単語】${currentWord.japanese}`,
          userAnswer: selected.text,
          correctAnswer: correctText,
          type: 'word',
          category: '口頭試験単語',
          explanation: `正解: ${correctText} [${currentWord.pronunciation || ''}] = ${currentWord.japanese} (${currentWord.pos || '単語'})。${currentWord.exampleMn ? `例文: ${currentWord.exampleMn}` : ''}`
        });
      } catch (_) {}
      s.mistakes.push({
        id: currentWord.id,
        japanese: currentWord.japanese,
        mongolian: correctText,
        pronunciation: currentWord.pronunciation,
        userAnswer: selected.text
      });
    }

    this.render(this.container, this.onNavigate);
  }

  // 次の問題へ
  static handleAllVocabNext() {
    const s = this.allVocabState;
    s.currentIndex++;
    s.userInput = '';
    s.hasAnswered = false;
    s.isCorrect = false;
    s.selectedChoice = null;
    s.showHint = false;

    if (s.currentIndex >= s.activeQuestions.length) {
      s.status = 'result';
    } else {
      const nextWord = s.activeQuestions[s.currentIndex];
      if (s.testType === 'choice' && nextWord) {
        s.currentChoices = this.generateChoicesForWord(nextWord);
      }
    }
    this.render(this.container, this.onNavigate);
  }

  // 「口頭試験で出てくる単語をすべて覚える」専用イベントリスナーバインド
  static attachAllVocabEventListeners(container) {
    const s = this.allVocabState;

    // スコープ選択ボタン
    container.querySelectorAll('.vocab-scope-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const sc = btn.getAttribute('data-vocab-scope');
        if (sc) {
          s.scope = sc;
          this.render(container, this.onNavigate);
        }
      });
    });

    // 特定テーマセレクト
    const topicSelect = container.querySelector('#select-vocab-single-topic');
    if (topicSelect) {
      topicSelect.addEventListener('change', (e) => {
        if (e.target.value) {
          s.scope = e.target.value;
        } else {
          s.scope = 'all';
        }
        this.render(container, this.onNavigate);
      });
    }

    // テスト形式切り替え
    container.querySelectorAll('.vocab-type-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const t = btn.getAttribute('data-vocab-type');
        if (t) {
          s.testType = t;
          this.render(container, this.onNavigate);
        }
      });
    });

    // 問題数プリセット
    container.querySelectorAll('.vocab-count-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const c = parseInt(btn.getAttribute('data-vocab-count'), 10);
        if (!isNaN(c)) {
          s.questionCount = c;
          s.customCountInput = '';
          this.render(container, this.onNavigate);
        }
      });
    });

    // 自由指定問題数入力
    const customCountInput = container.querySelector('#all-vocab-custom-count-input');
    if (customCountInput) {
      customCountInput.addEventListener('input', (e) => {
        s.customCountInput = e.target.value;
      });
    }

    // 出題順ボタン
    container.querySelectorAll('.vocab-order-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const o = btn.getAttribute('data-vocab-order');
        if (o) {
          s.order = o;
          this.render(container, this.onNavigate);
        }
      });
    });

    // テスト開始ボタン
    const startBtn = container.querySelector('#btn-start-all-vocab-test');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        this.startAllVocabTest();
        this.render(container, this.onNavigate);
      });
    }

    // 全単語一覧表示ボタン
    const openListBtn = container.querySelector('#btn-open-all-vocab-list');
    if (openListBtn) {
      openListBtn.addEventListener('click', () => {
        s.status = 'browse_list';
        this.render(container, this.onNavigate);
      });
    }

    // 全単語一覧閉じるボタン
    const closeBrowseBtn = container.querySelector('#btn-close-vocab-browse');
    if (closeBrowseBtn) {
      closeBrowseBtn.addEventListener('click', () => {
        s.status = 'setup';
        this.render(container, this.onNavigate);
      });
    }

    // 全単語一覧検索
    const searchInput = container.querySelector('#all-vocab-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        s.searchQuery = e.target.value;
        this.render(container, this.onNavigate);
        const refocused = container.querySelector('#all-vocab-search-input');
        if (refocused) {
          refocused.focus();
          refocused.setSelectionRange(refocused.value.length, refocused.value.length);
        }
      });
    }

    // 全単語一覧品詞フィルター
    container.querySelectorAll('.btn-filter-pos').forEach(btn => {
      btn.addEventListener('click', () => {
        const p = btn.getAttribute('data-filter-pos');
        if (p) {
          s.filterPos = p;
          this.render(container, this.onNavigate);
        }
      });
    });

    // 全単語一覧個別発音ボタン
    container.querySelectorAll('.btn-speak-single-vocab').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const text = btn.getAttribute('data-speak-text');
        if (text) SpeechService.speak(text);
      });
    });

    // テスト中断ボタン
    const abortBtn = container.querySelector('#btn-abort-all-vocab-test');
    if (abortBtn) {
      abortBtn.addEventListener('click', () => {
        s.status = 'setup';
        this.render(container, this.onNavigate);
      });
    }

    // ヒントトグル
    const hintBtn = container.querySelector('#btn-toggle-all-vocab-hint');
    if (hintBtn) {
      hintBtn.addEventListener('click', () => {
        s.showHint = !s.showHint;
        this.render(container, this.onNavigate);
      });
    }

    // タイピング入力欄
    const typingInput = container.querySelector('#all-vocab-typing-input');
    if (typingInput) {
      typingInput.addEventListener('input', (e) => {
        s.userInput = e.target.value;
      });
      typingInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.handleAllVocabTypingSubmit();
        }
      });
      bindCyrillicInputAssistant(container, 'all-vocab-typing-input');
      setTimeout(() => typingInput.focus(), 50);
    }

    // タイピング送信ボタン
    const submitTypingBtn = container.querySelector('#btn-submit-all-vocab-typing');
    if (submitTypingBtn) {
      submitTypingBtn.addEventListener('click', () => {
        this.handleAllVocabTypingSubmit();
      });
    }

    // 4択選択肢ボタン
    container.querySelectorAll('.btn-all-vocab-choice').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-choice-index'), 10);
        if (!isNaN(idx)) {
          this.handleAllVocabChoice(idx);
        }
      });
    });

    // 4択キーボードショートカット (1〜4)
    if (s.status === 'testing' && s.testType === 'choice' && !s.hasAnswered) {
      const choiceKeyHandler = (e) => {
        const num = parseInt(e.key, 10);
        if (num >= 1 && num <= 4) {
          window.removeEventListener('keydown', choiceKeyHandler);
          this.handleAllVocabChoice(num - 1);
        }
      };
      window.addEventListener('keydown', choiceKeyHandler, { once: true });
    }

    // 単語発音ボタン
    const speakWordBtn = container.querySelector('#btn-speak-all-vocab-word');
    if (speakWordBtn) {
      speakWordBtn.addEventListener('click', () => {
        const cur = s.activeQuestions[s.currentIndex];
        if (cur) SpeechService.speak(cur.dictForm || cur.mongolian);
      });
    }

    // 次の問題へボタン
    const nextBtn = container.querySelector('#btn-next-all-vocab-question');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        this.handleAllVocabNext();
      });
      const enterHandler = (e) => {
        if (e.key === 'Enter') {
          window.removeEventListener('keydown', enterHandler);
          this.handleAllVocabNext();
        }
      };
      window.addEventListener('keydown', enterHandler, { once: true });
    }

    // 結果画面：もう一度同じ条件で
    const restartSameBtn = container.querySelector('#btn-restart-all-vocab-same');
    if (restartSameBtn) {
      restartSameBtn.addEventListener('click', () => {
        this.startAllVocabTest();
        this.render(container, this.onNavigate);
      });
    }

    // 結果画面：間違えた単語だけ再特訓
    const retryMistakesBtn = container.querySelector('#btn-retry-all-vocab-mistakes');
    if (retryMistakesBtn) {
      retryMistakesBtn.addEventListener('click', () => {
        if (s.mistakes && s.mistakes.length > 0) {
          s.activeQuestions = shuffleArray(s.mistakes.map(m => {
            const found = interviewVocabulary.find(w => w.id === m.id);
            return found || {
              id: m.id,
              mongolian: m.mongolian,
              dictForm: m.mongolian,
              japanese: m.japanese,
              pronunciation: m.pronunciation,
              pos: '単語'
            };
          }));
          s.currentIndex = 0;
          s.userInput = '';
          s.hasAnswered = false;
          s.isCorrect = false;
          s.selectedChoice = null;
          s.showHint = false;
          s.mistakes = [];
          s.status = 'testing';
          if (s.testType === 'choice' && s.activeQuestions[0]) {
            s.currentChoices = this.generateChoicesForWord(s.activeQuestions[0]);
          }
          this.render(container, this.onNavigate);
        }
      });
    }

    // 結果画面：設定へ戻る
    const backSetupBtn = container.querySelector('#btn-all-vocab-back-setup');
    if (backSetupBtn) {
      backSetupBtn.addEventListener('click', () => {
        s.status = 'setup';
        this.render(container, this.onNavigate);
      });
    }

    // 結果画面：スピーチ演習へ戻る
    const backSpeechBtn = container.querySelector('#btn-all-vocab-back-speech');
    if (backSpeechBtn) {
      backSpeechBtn.addEventListener('click', () => {
        this.activeSubMode = 'speech';
        this.render(container, this.onNavigate);
      });
    }
  }

}

if (typeof window !== 'undefined') {
  window.InterviewMasterComponent = InterviewMasterComponent;
}
