// 最終口述面接・スピーチ特訓コンポーネント（Сүүлийн шалгалт хүртэл бэлдэх сэдвүүд）
// 1〜7の4分スピーチ準備 ＆ 8〜13の実践対話 全13テーマ完全暗記・発話特訓モード
import { SpeechService } from '../services/speech.js';
import { StorageService } from '../services/storage.js';
import { GamificationService } from '../services/gamification.js';
import { interviewTopics } from '../data/interviewTopics.js';

export class InterviewMasterComponent {
  static currentTopicIndex = 0;
  static currentStep = 1; // 1: シャドーイング/朗読, 2: 虫食い穴埋め暗記, 3: 4分スピーチ・本番シミュレーション
  static showMongolian = true;
  static showJapanese = true;
  static showRomaji = false;
  static timerInterval = null;
  static timerSeconds = 0;
  static isTimerRunning = false;
  static revealedSpeech = false;
  static clozeAnswers = {};

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

    container.innerHTML = `
      <div class="max-w-4xl mx-auto px-4 py-6">
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
              1〜7の質問についての4分スピーチ ＆ 8〜13の実践対話を完全攻略。「この文章を覚え、さらには言えるようにする」ための3ステップ集中ドリルです。
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

          <!-- 3つのステップタブ切り替え -->
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
              <span>⏱️ Step 3: 4分スピーチ実践</span>
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
        <!-- コントロールバー: 全文再生 ＆ 表示トグル -->
        <div class="interview-control-bar flex flex-wrap items-center justify-between gap-3 bg-slate-50 rounded-2xl p-3 border border-slate-200 mb-5">
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
              class="px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs border border-slate-200 transition-all flex items-center gap-1 cursor-pointer">
              <span>⏹ 停止</span>
            </button>
          </div>

          <!-- 表示トグル（キリル文字、和訳、ローマ字） -->
          <div class="flex items-center gap-2 text-xs">
            <label class="flex items-center gap-1 cursor-pointer select-none text-slate-700 font-medium">
              <input type="checkbox" id="toggle-mn-check" ${this.showMongolian ? 'checked' : ''} class="rounded text-emerald-600 focus:ring-emerald-500">
              <span>キリル文字</span>
            </label>
            <label class="flex items-center gap-1 cursor-pointer select-none text-slate-700 font-medium ml-2">
              <input type="checkbox" id="toggle-ja-check" ${this.showJapanese ? 'checked' : ''} class="rounded text-emerald-600 focus:ring-emerald-500">
              <span>和訳</span>
            </label>
            <label class="flex items-center gap-1 cursor-pointer select-none text-slate-700 font-medium ml-2">
              <input type="checkbox" id="toggle-romaji-check" ${this.showRomaji ? 'checked' : ''} class="rounded text-emerald-600 focus:ring-emerald-500">
              <span>ローマ字</span>
            </label>
          </div>
        </div>

        <!-- センテンス一覧 -->
        <div class="space-y-4 mb-8">
          ${topic.sentences.map((s, sIdx) => {
            return `
              <div class="interview-sentence-card bg-slate-50/70 border border-slate-200 hover:border-emerald-300 rounded-2xl p-4 sm:p-5 transition-all">
                <div class="flex items-start justify-between gap-3 mb-2">
                  <div class="flex items-center gap-2">
                    <span class="sentence-num-badge w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                      ${sIdx + 1}
                    </span>
                    ${s.speaker ? `<span class="px-2 py-0.5 rounded-md text-[11px] font-bold ${s.speaker === 'Би' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-800'}">${s.speaker}</span>` : ''}
                  </div>
                  <button
                    type="button"
                    data-speech-text="${encodeURIComponent(s.mn)}"
                    class="play-sentence-btn sentence-audio-btn text-xs text-emerald-700 hover:text-emerald-900 font-medium flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs cursor-pointer">
                    <span>🔊 聴く</span>
                  </button>
                </div>

                <!-- モンゴル語文 -->
                ${this.showMongolian ? `
                  <p class="sentence-mn-text text-base sm:text-lg font-bold text-slate-900 mb-1 leading-relaxed">
                    ${s.mn}
                  </p>
                ` : `
                  <p class="text-sm italic text-slate-400 mb-1">（キリル文字非表示中 - 声に出して言ってみよう！）</p>
                `}

                <!-- ローマ字 -->
                ${this.showRomaji && s.romaji ? `
                  <p class="text-xs text-emerald-800/80 font-mono mb-1">${s.romaji}</p>
                ` : ''}

                <!-- 日本語訳 -->
                ${this.showJapanese ? `
                  <p class="sentence-ja-text text-xs sm:text-sm text-slate-600 mb-2">${s.ja}</p>
                ` : `
                  <p class="text-xs italic text-slate-400 mb-2">（和訳非表示中）</p>
                `}

                <!-- 文法・ポイント解説 -->
                ${s.explanation ? `
                  <div class="sentence-exp-box mt-2 pt-2 border-t border-slate-200/80 text-[11px] sm:text-xs text-slate-500 flex items-start gap-1.5">
                    <span class="sentence-exp-badge text-emerald-600 font-bold">💡 解説:</span>
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

  // Step 3: 4分スピーチ実践・面接シミュレーション（言えるようにする）
  static renderStep3(topic) {
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

  static renderStepContent(topic) {
    switch (this.currentStep) {
      case 1:
        return this.renderStep1(topic);
      case 2:
        return this.renderStep2(topic);
      case 3:
        return this.renderStep3(topic);
      default:
        return this.renderStep1(topic);
    }
  }

  static attachEventListeners(topic) {
    const container = this.container;
    if (!container) return;

    // テーマ選択ボタン
    container.querySelectorAll('.topic-select-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.topicIndex, 10);
        if (!isNaN(idx) && idx !== this.currentTopicIndex) {
          this.currentTopicIndex = idx;
          this.revealedSpeech = false;
          this.stopTimer();
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
    if (gotoTyping && this.onNavigate) {
      gotoTyping.addEventListener('click', () => {
        this.onNavigate('typing_test');
      });
    }

    const gotoRoleplay = container.querySelector('#goto-roleplay-btn');
    if (gotoRoleplay && this.onNavigate) {
      gotoRoleplay.addEventListener('click', () => {
        this.onNavigate('roleplay');
      });
    }
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
}

if (typeof window !== 'undefined') {
  window.InterviewMasterComponent = InterviewMasterComponent;
}
