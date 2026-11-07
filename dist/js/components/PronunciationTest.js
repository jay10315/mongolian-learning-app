// モンゴル語発音特訓モード（高音質ネイティブお手本・マイク録音・音声認識採点・A/B聴き比べ・口形ガイド）
import { SpeechService } from '../services/speech.js';
import { StorageService } from '../services/storage.js';
import { GamificationService } from '../services/gamification.js';
import { PenguinMascot } from './PenguinMascot.js';
import { shuffleArray } from '../utils/helpers.js';
import { PRONUNCIATION_CATEGORIES, PRONUNCIATION_ITEMS, PRONUNCIATION_SOUND_TIPS } from '../data/pronunciationData.js';

export class PronunciationTestComponent {
  static container = null;
  static state = {
    view: 'settings', // 'settings' | 'practicing' | 'result'
    category: 'all',
    count: 10,
    speed: 1.0, // 1.0 または 0.75
    items: [],
    currentIndex: 0,
    currentItem: null,
    isRecording: false,
    recordedBlob: null,
    recordedUrl: null,
    recognizedText: '',
    score: null,
    feedbackComment: '',
    isEvaluating: false,
    results: [],
    sessionScore: 0,
    sessionXp: 0,
    mediaRecorder: null,
    audioChunks: [],
    micPermission: 'prompt', // 'prompt' | 'granted' | 'denied'
    audioContext: null,
    animFrameId: null
  };

  static render(container, onNavigate) {
    this.container = container;
    this.onNavigate = onNavigate;

    if (this.state.view === 'practicing' && this.state.items.length > 0) {
      this.renderPracticing();
    } else if (this.state.view === 'result') {
      this.renderResult();
    } else {
      this.state.view = 'settings';
      this.renderSettings();
    }
  }

  // --- 1. 設定画面 ---
  static renderSettings() {
    this.container.innerHTML = `
      <div class="animate-fade-in max-w-2xl mx-auto px-4 py-4 space-y-4">
        <!-- ヘッダーバナー -->
        <div class="bg-gradient-to-r from-teal-600 via-cyan-600 to-sky-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
          <div class="relative z-10 space-y-2">
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-bold">
              <span>🎙️</span>
              <span>AIマイク採点 ＆ 聴き比べ</span>
            </div>
            <h2 class="text-2xl sm:text-3xl font-black tracking-tight">モンゴル語 発音特訓モード</h2>
            <p class="text-sky-100 text-xs sm:text-sm max-w-lg leading-relaxed">
              お手本ネイティブ音声（Yesui / Bataa Neural）を聞き、マイクで発音！AI採点と波形・録音によるA/B聴き比べで、日本人特有の苦手音（ө, ү, х, л, р）を克服しましょう。
            </p>
          </div>
          <div class="absolute right-4 bottom-2 opacity-15 pointer-events-none select-none text-8xl font-black">
            🎙️
          </div>
        </div>

        <!-- 特長ハイライトカード -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
          <div class="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
            <span class="text-lg">🔊</span>
            <div class="font-extrabold text-slate-800">通常 ＆ 0.75倍速</div>
            <p class="text-slate-500 text-[11px]">聞き取りにくい長母音や巻き舌も、ゆっくり再生で口の動きが分かる。</p>
          </div>
          <div class="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
            <span class="text-lg">🎯</span>
            <div class="font-extrabold text-slate-800">特殊音の口形ガイド</div>
            <p class="text-slate-500 text-[11px]">唇の突き出し方、舌の位置、息の摩擦のコツを日本語で分かりやすく図解。</p>
          </div>
          <div class="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
            <span class="text-lg">🔄</span>
            <div class="font-extrabold text-slate-800">A/B 聴き比べ機能</div>
            <p class="text-slate-500 text-[11px]">自分の録音音声とお手本音声を交互に再生し、客観的に発音をチェック。</p>
          </div>
        </div>

        <!-- 設定パネル -->
        <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
          <!-- カテゴリー選択 -->
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-2">特訓カテゴリーを選択</label>
            <div class="space-y-2">
              <label class="flex items-start gap-3 p-3 rounded-xl border cursor-pointer hover:bg-slate-50 transition-colors ${this.state.category === 'all' ? 'border-teal-600 bg-teal-50/70' : 'border-slate-200'}">
                <input type="radio" name="pronCategory" value="all" ${this.state.category === 'all' ? 'checked' : ''} class="mt-0.5">
                <div>
                  <div class="text-xs font-bold text-slate-800">⚡ すべての特訓（ランダムミックス）</div>
                  <div class="text-[11px] text-slate-500">特殊母音・難関子音・基本挨拶・重要語彙からバランスよく出題</div>
                </div>
              </label>

              ${PRONUNCIATION_CATEGORIES.map(cat => `
                <label class="flex items-start gap-3 p-3 rounded-xl border cursor-pointer hover:bg-slate-50 transition-colors ${this.state.category === cat.id ? 'border-teal-600 bg-teal-50/70' : 'border-slate-200'}">
                  <input type="radio" name="pronCategory" value="${cat.id}" ${this.state.category === cat.id ? 'checked' : ''} class="mt-0.5">
                  <div>
                    <div class="text-xs font-bold text-slate-800">${cat.name}</div>
                    <div class="text-[11px] text-slate-500">${cat.desc}</div>
                  </div>
                </label>
              `).join('')}

              <label class="flex items-start gap-3 p-3 rounded-xl border cursor-pointer hover:bg-slate-50 transition-colors ${this.state.category === 'all_vocab' ? 'border-teal-600 bg-teal-50/70' : 'border-slate-200'}">
                <input type="radio" name="pronCategory" value="all_vocab" ${this.state.category === 'all_vocab' ? 'checked' : ''} class="mt-0.5">
                <div>
                  <div class="text-xs font-bold text-slate-800">📖 全862単語マスターからランダム出題</div>
                  <div class="text-[11px] text-slate-500">学習ノートに登録された全単語の中から発音を練習</div>
                </div>
              </label>
            </div>
          </div>

          <!-- 問題数 -->
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-2">特訓出題数</label>
            <div class="grid grid-cols-4 gap-2">
              ${[5, 10, 15, 20].map(n => `
                <button type="button" class="btn-count py-2 rounded-xl text-xs font-bold border transition-all ${
                  this.state.count === n ? 'bg-teal-600 text-white border-teal-600 shadow-xs' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }" data-count="${n}">
                  ${n} 問
                </button>
              `).join('')}
            </div>
          </div>

          <!-- 再生速度デフォルト -->
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-2">お手本音声の初期再生速度</label>
            <div class="grid grid-cols-2 gap-2 text-xs">
              <label class="flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer hover:bg-slate-50 ${this.state.speed === 1.0 ? 'border-teal-600 bg-teal-50 font-bold text-teal-900' : 'border-slate-200'}">
                <input type="radio" name="pronSpeed" value="1.0" ${this.state.speed === 1.0 ? 'checked' : ''}>
                <span>🔊 通常速度 (1.0x)</span>
              </label>
              <label class="flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer hover:bg-slate-50 ${this.state.speed === 0.75 ? 'border-teal-600 bg-teal-50 font-bold text-teal-900' : 'border-slate-200'}">
                <input type="radio" name="pronSpeed" value="0.75" ${this.state.speed === 0.75 ? 'checked' : ''}>
                <span>🐢 ゆっくり速度 (0.75x)</span>
              </label>
            </div>
          </div>

          <button type="button" id="btn-start-pron-test" class="w-full py-3.5 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-extrabold rounded-2xl shadow-md transition-all active:scale-98 text-sm flex items-center justify-center gap-2 cursor-pointer">
            <span>🎙️</span>
            <span>発音特訓をスタート</span>
          </button>
        </div>
      </div>
    `;

    this.bindSettingsEvents();
  }

  static bindSettingsEvents() {
    const container = this.container;

    // カテゴリー
    container.querySelectorAll('input[name="pronCategory"]').forEach(input => {
      input.addEventListener('change', (e) => {
        this.state.category = e.target.value;
        this.renderSettings();
      });
    });

    // 出題数
    container.querySelectorAll('.btn-count').forEach(btn => {
      btn.addEventListener('click', () => {
        this.state.count = parseInt(btn.getAttribute('data-count'), 10);
        this.renderSettings();
      });
    });

    // 速度
    container.querySelectorAll('input[name="pronSpeed"]').forEach(input => {
      input.addEventListener('change', (e) => {
        this.state.speed = parseFloat(e.target.value);
      });
    });

    // 開始
    container.querySelector('#btn-start-pron-test')?.addEventListener('click', () => {
      this.startTest();
    });
  }

  // --- 2. テストデータ準備 ＆ 開始 ---
  static startTest() {
    let list = [];

    if (this.state.category === 'all_vocab') {
      const vocab = StorageService.getVocabulary();
      list = vocab.map(v => ({
        id: v.id,
        category: 'vocab',
        mongolian: v.mongolian,
        japanese: v.japanese,
        pronunciation: v.pronunciation || '',
        phoneticKey: '',
        hint: `品詞: ${v.pos || '単語'} / ${v.category || '一般語彙'}`
      }));
    } else if (this.state.category === 'all') {
      list = [...PRONUNCIATION_ITEMS];
    } else {
      list = PRONUNCIATION_ITEMS.filter(item => item.category === this.state.category);
    }

    if (!list || list.length === 0) {
      list = [...PRONUNCIATION_ITEMS];
    }

    list = shuffleArray(list);
    const count = Math.min(this.state.count, list.length);
    this.state.items = list.slice(0, count);
    this.state.currentIndex = 0;
    this.state.results = [];
    this.state.sessionScore = 0;
    this.state.sessionXp = 0;
    GamificationService.resetSessionCombo();

    this.loadItem(0);
  }

  static loadItem(index) {
    this.state.currentIndex = index;
    this.state.currentItem = this.state.items[index];
    this.state.isRecording = false;
    this.state.recordedBlob = null;
    this.state.recordedUrl = null;
    this.state.recognizedText = '';
    this.state.score = null;
    this.state.feedbackComment = '';
    this.state.isEvaluating = false;

    this.state.view = 'practicing';
    this.renderPracticing();

    // お手本音声を自動再生
    setTimeout(() => {
      this.playModelAudio();
    }, 400);
  }

  // --- 3. 発音練習・採点画面 ---
  static renderPracticing() {
    const item = this.state.currentItem;
    const idx = this.state.currentIndex;
    const total = this.state.items.length;
    const progressPercent = Math.round(((idx) / total) * 100);
    const soundTip = item.phoneticKey && PRONUNCIATION_SOUND_TIPS[item.phoneticKey];

    this.container.innerHTML = `
      <div class="animate-fade-in max-w-xl mx-auto px-4 py-3 space-y-4">
        
        <!-- プログレスバー ＆ ゲームHUD -->
        <div class="space-y-1.5">
          <div class="flex justify-between items-center text-xs font-bold text-slate-500">
            <span class="flex items-center gap-2">
              <span>🎙️ 発音特訓 ${idx + 1} / ${total}</span>
              ${GamificationService.sessionCombo >= 2 ? `
                <span class="px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200 animate-bounce text-[10px]">
                  🔥 ${GamificationService.sessionCombo} COMBO
                </span>
              ` : ''}
            </span>
            <div class="flex items-center gap-3">
              <span class="text-teal-600 font-extrabold">+${this.state.sessionScore || 0} PTS</span>
              <span class="text-teal-700 font-extrabold">+${this.state.sessionXp || 0} XP</span>
              <button type="button" id="btn-quit-pron" class="text-slate-400 hover:text-slate-700 ml-1 cursor-pointer">中断</button>
            </div>
          </div>
          <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div class="bg-teal-500 h-full transition-all duration-300" style="width: ${progressPercent}%"></div>
          </div>
        </div>

        <!-- お題カード -->
        <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm text-center relative overflow-hidden space-y-3">
          
          <div class="flex items-center justify-between text-xs font-bold text-slate-400 border-b border-slate-100 pb-2">
            <span>発音対象</span>
            <span class="text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full font-bold text-[11px]">${item.hint || 'モンゴル語'}</span>
          </div>

          <!-- モンゴル語キリル文字 -->
          <div class="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight cyrillic-text py-1">
            ${item.mongolian}
          </div>

          <!-- 日本語意味 ＆ カタカナ発音 -->
          <div class="space-y-1">
            <div class="text-sm sm:text-base font-bold text-slate-700">${item.japanese}</div>
            ${item.pronunciation ? `
              <div class="text-xs text-slate-400 font-medium">発音の目安: <span class="font-bold text-slate-600">${item.pronunciation}</span></div>
            ` : ''}
          </div>

          <!-- お手本音声操作ボタン -->
          <div class="flex items-center justify-center gap-2 pt-2">
            <button type="button" id="btn-play-model-normal" class="px-4 py-2 bg-teal-50 hover:bg-teal-100 border border-teal-300 text-teal-800 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer">
              <span>🔊</span>
              <span>お手本 (1.0x)</span>
            </button>
            <button type="button" id="btn-play-model-slow" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer">
              <span>🐢</span>
              <span>ゆっくり (0.75x)</span>
            </button>
            ${item.comparisonPair ? `
              <button type="button" id="btn-play-comparison-pair" class="px-3 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 rounded-xl font-bold text-xs flex items-center gap-1 transition-all active:scale-95 cursor-pointer" title="対比単語を聴く">
                <span>⚖️</span>
                <span>対比: ${item.comparisonPair}</span>
              </button>
            ` : ''}
          </div>
        </div>

        <!-- 口の形・発音のコツ解説カード -->
        ${soundTip ? `
          <div class="bg-gradient-to-r from-teal-50/80 via-white to-sky-50/80 rounded-2xl p-4 border border-teal-200 text-xs text-slate-700 space-y-1.5 shadow-2xs">
            <div class="font-extrabold text-teal-900 flex items-center justify-between">
              <span class="flex items-center gap-1.5">
                <span>💡</span>
                <span>${soundTip.title}</span>
              </span>
              <span class="text-[10px] font-mono px-2 py-0.5 rounded-md bg-teal-100 text-teal-800 font-bold">${soundTip.symbol}</span>
            </div>
            <p class="leading-relaxed text-slate-600">${soundTip.howTo}</p>
            ${soundTip.pitfall ? `
              <div class="text-[11px] text-amber-900 bg-amber-50/80 px-2.5 py-1.5 rounded-lg border border-amber-200 flex items-start gap-1">
                <span>⚠️</span>
                <span><strong>注意点:</strong> ${soundTip.pitfall}</span>
              </div>
            ` : ''}
          </div>
        ` : ''}

        <!-- マイク録音 ＆ 採点コントロールカード -->
        <div class="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4 text-center">
          
          <!-- 録音ボタン -->
          <div class="py-2 flex flex-col items-center justify-center">
            <button type="button" id="btn-toggle-record" class="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex flex-col items-center justify-center shadow-lg transition-all active:scale-95 cursor-pointer select-none ${
              this.state.isRecording 
                ? 'bg-rose-600 hover:bg-rose-700 text-white ring-8 ring-rose-200 animate-pulse' 
                : 'bg-gradient-to-tr from-teal-600 to-cyan-500 hover:from-teal-700 hover:to-cyan-600 text-white ring-4 ring-teal-100'
            }">
              <span class="text-2xl sm:text-3xl">${this.state.isRecording ? '⏹️' : '🎙️'}</span>
              <span class="text-[11px] font-black mt-1">${this.state.isRecording ? '停止する' : '話す'}</span>
            </button>

            <!-- 録音中ガイダンス -->
            <div class="mt-3 text-xs font-bold ${this.state.isRecording ? 'text-rose-600 animate-pulse' : 'text-slate-400'}">
              ${this.state.isRecording 
                ? '🔴 録音中... キリル文字を意識して発音してください' 
                : 'マイクボタンを押して発音してください'}
            </div>

            <!-- 音量波形インジケーター（録音中のみ表示） -->
            <div id="recording-waveform" class="${this.state.isRecording ? 'flex' : 'hidden'} items-center justify-center gap-1.5 mt-2 h-4">
              <span class="w-1.5 bg-rose-500 rounded-full animate-bounce h-2" style="animation-delay: 0.1s"></span>
              <span class="w-1.5 bg-rose-500 rounded-full animate-bounce h-4" style="animation-delay: 0.2s"></span>
              <span class="w-1.5 bg-rose-500 rounded-full animate-bounce h-3" style="animation-delay: 0.3s"></span>
              <span class="w-1.5 bg-rose-500 rounded-full animate-bounce h-5" style="animation-delay: 0.4s"></span>
              <span class="w-1.5 bg-rose-500 rounded-full animate-bounce h-2" style="animation-delay: 0.2s"></span>
            </div>
          </div>

          <!-- 採点結果表示エリア（録音後に展開） -->
          ${this.state.score !== null ? `
            <div class="animate-fade-in p-4 rounded-2xl border ${
              this.state.score >= 85 ? 'bg-emerald-50/90 border-emerald-300' :
              this.state.score >= 70 ? 'bg-teal-50/90 border-teal-300' :
              'bg-amber-50/90 border-amber-300'
            } text-left space-y-3">
              
              <!-- スコアヘッダー -->
              <div class="flex items-center justify-between border-b ${
                this.state.score >= 85 ? 'border-emerald-200' :
                this.state.score >= 70 ? 'border-teal-200' :
                'border-amber-200'
              } pb-2">
                <div class="flex items-center gap-2">
                  <span class="text-2xl">${this.state.score >= 85 ? '🌟' : (this.state.score >= 70 ? '👍' : '💪')}</span>
                  <div>
                    <div class="text-[11px] font-bold text-slate-500">発音スコア</div>
                    <div class="text-xl font-black ${
                      this.state.score >= 85 ? 'text-emerald-700' :
                      this.state.score >= 70 ? 'text-teal-700' :
                      'text-amber-800'
                    }">${this.state.score} 点</div>
                  </div>
                </div>

                <div class="text-right">
                  <div class="text-sm font-extrabold text-amber-500">
                    ${'⭐'.repeat(this.state.score >= 90 ? 3 : (this.state.score >= 70 ? 2 : 1))}
                  </div>
                  <div class="text-[10px] font-bold text-slate-400">
                    ${this.state.score >= 90 ? 'パーフェクト！' : (this.state.score >= 70 ? '合格！' : 'もう一歩！')}
                  </div>
                </div>
              </div>

              <!-- 認識されたテキスト -->
              ${this.state.recognizedText ? `
                <div class="text-xs text-slate-700">
                  <span class="font-bold text-slate-500">AI聞き取り結果: </span>
                  <span class="font-extrabold cyrillic-text text-sm text-slate-900 bg-white/70 px-2 py-0.5 rounded border border-slate-200">
                    ${this.state.recognizedText}
                  </span>
                </div>
              ` : ''}

              <!-- ペンギンの応援コメント -->
              <div class="text-xs font-bold text-slate-700 flex items-start gap-2 bg-white/80 p-2.5 rounded-xl border border-slate-200/60">
                <span class="text-lg shrink-0">🐧</span>
                <span>${this.state.feedbackComment}</span>
              </div>

              <!-- 聴き比べ（A/B再生）バー -->
              <div class="pt-1 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div class="flex items-center gap-1.5">
                  <button type="button" id="btn-play-user-recording" class="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-700 shadow-2xs active:scale-95 cursor-pointer flex items-center gap-1">
                    <span>▶️</span> あなたの発音
                  </button>
                  <button type="button" id="btn-play-ab-compare" class="px-3 py-1.5 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl font-bold shadow-2xs active:scale-95 cursor-pointer flex items-center gap-1">
                    <span>🔄</span> お手本と連続比較
                  </button>
                </div>
                <div id="compare-playing-status" class="text-[11px] font-bold text-teal-700 hidden animate-pulse">
                  再生中...
                </div>
              </div>
            </div>
          ` : ''}

          <!-- マイク非対応または自己評価用バー -->
          ${this.state.recordedBlob && this.state.score === null ? `
            <div class="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-2 text-left">
              <div class="font-bold text-slate-700 flex items-center justify-between">
                <span>🎙️ 録音完了！自分の発音をチェック:</span>
                <button type="button" id="btn-play-user-recording-standalone" class="px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-slate-700 font-bold active:scale-95">
                  ▶️ 録音を再生
                </button>
              </div>
              <p class="text-[11px] text-slate-500">お手本と聴き比べて自己評価を選んでください:</p>
              <div class="grid grid-cols-3 gap-1.5 pt-1">
                <button type="button" class="btn-self-score py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-extrabold rounded-xl text-center active:scale-95" data-val="95">
                  👍 近い (95点)
                </button>
                <button type="button" class="btn-self-score py-2 bg-teal-100 hover:bg-teal-200 text-teal-900 font-extrabold rounded-xl text-center active:scale-95" data-val="80">
                  👌 まあまあ (80点)
                </button>
                <button type="button" class="btn-self-score py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 font-extrabold rounded-xl text-center active:scale-95" data-val="60">
                  🔄 もう一回 (60点)
                </button>
              </div>
            </div>
          ` : ''}

          <!-- 次の問題ボタン -->
          ${this.state.score !== null ? `
            <button type="button" id="btn-next-pron" class="w-full py-3.5 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-extrabold rounded-2xl shadow-md transition-all active:scale-98 text-sm flex items-center justify-center gap-1 cursor-pointer">
              <span>${idx + 1 < total ? '次の単語へ（Enter） →' : '結果を見る 🎉'}</span>
            </button>
          ` : ''}

        </div>
      </div>
    `;

    this.bindPracticingEvents();
  }

  static bindPracticingEvents() {
    const container = this.container;
    const item = this.state.currentItem;

    // 中断
    container.querySelector('#btn-quit-pron')?.addEventListener('click', () => {
      if (confirm('発音特訓を中断しますか？')) {
        this.stopAllAudio();
        this.state.view = 'settings';
        this.renderSettings();
      }
    });

    // お手本再生（通常）
    container.querySelector('#btn-play-model-normal')?.addEventListener('click', () => {
      this.playModelAudio(1.0);
    });

    // お手本再生（ゆっくり）
    container.querySelector('#btn-play-model-slow')?.addEventListener('click', () => {
      this.playModelAudio(0.75);
    });

    // 対比単語再生
    container.querySelector('#btn-play-comparison-pair')?.addEventListener('click', () => {
      if (item.comparisonPair) {
        const clean = item.comparisonPair.split('（')[0].split('(')[0].trim();
        SpeechService.speak(clean);
      }
    });

    // 録音トグル
    const recordBtn = container.querySelector('#btn-toggle-record');
    if (recordBtn) {
      recordBtn.addEventListener('click', () => {
        if (this.state.isRecording) {
          this.stopRecording();
        } else {
          this.startRecording();
        }
      });
    }

    // ユーザー録音再生
    container.querySelector('#btn-play-user-recording')?.addEventListener('click', () => {
      this.playUserAudio();
    });
    container.querySelector('#btn-play-user-recording-standalone')?.addEventListener('click', () => {
      this.playUserAudio();
    });

    // A/B連続比較
    container.querySelector('#btn-play-ab-compare')?.addEventListener('click', () => {
      this.playABComparison();
    });

    // 自己評価
    container.querySelectorAll('.btn-self-score').forEach(btn => {
      btn.addEventListener('click', () => {
        const score = parseInt(btn.getAttribute('data-val'), 10);
        this.evaluateScore(score, '(自己判定)');
      });
    });

    // 次へ
    container.querySelector('#btn-next-pron')?.addEventListener('click', () => {
      this.goNext();
    });

    // キーボード Enter ショートカット
    this.keyHandler = (e) => {
      if (e.key === 'Enter' && this.state.score !== null) {
        e.preventDefault();
        this.goNext();
      }
    };
    window.addEventListener('keydown', this.keyHandler, { once: true });
  }

  // --- 4. 音声・録音制御 ---
  static playModelAudio(rate = 1.0) {
    if (!this.state.currentItem) return;
    const text = this.state.currentItem.mongolian;
    SpeechService.speak(text, { rate: rate || this.state.speed || 1.0 });
  }

  static playUserAudio() {
    if (!this.state.recordedUrl) return;
    const audio = new Audio(this.state.recordedUrl);
    audio.play().catch(e => console.warn(e));
  }

  static async playABComparison() {
    const statusEl = this.container.querySelector('#compare-playing-status');
    if (statusEl) {
      statusEl.textContent = '🔊 お手本を再生中...';
      statusEl.classList.remove('hidden');
    }

    // 1. お手本再生
    await this.playModelAudio(1.0);
    await new Promise(r => setTimeout(r, 600));

    // 2. ユーザー音声再生
    if (statusEl) {
      statusEl.textContent = '🎙️ あなたの発音を再生中...';
    }

    if (this.state.recordedUrl) {
      const audio = new Audio(this.state.recordedUrl);
      audio.onended = () => {
        if (statusEl) statusEl.classList.add('hidden');
      };
      audio.onerror = () => {
        if (statusEl) statusEl.classList.add('hidden');
      };
      audio.play().catch(() => {
        if (statusEl) statusEl.classList.add('hidden');
      });
    } else {
      if (statusEl) statusEl.classList.add('hidden');
    }
  }

  static async startRecording() {
    this.stopAllAudio();
    this.state.audioChunks = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.state.micPermission = 'granted';

      const mediaRecorder = new MediaRecorder(stream);
      this.state.mediaRecorder = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          this.state.audioChunks.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(this.state.audioChunks, { type: 'audio/webm' });
        this.state.recordedBlob = blob;
        if (this.state.recordedUrl) {
          URL.revokeObjectURL(this.state.recordedUrl);
        }
        this.state.recordedUrl = URL.createObjectURL(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      this.state.isRecording = true;
      this.renderPracticing();

      // Web Speech API 音声認識の起動（利用可能な場合）
      this.startSpeechRecognition();

    } catch (err) {
      console.warn('[PronunciationTest] Mic error:', err);
      alert('マイクへのアクセスが許可されていません。ブラウザのアドレスバーにあるマイク設定を有効にしてください。\n（自己評価モードで練習を継続できます）');
      this.state.micPermission = 'denied';
      this.state.isRecording = false;
      this.renderPracticing();
    }
  }

  static stopRecording() {
    if (this.state.mediaRecorder && this.state.mediaRecorder.state !== 'inactive') {
      this.state.mediaRecorder.stop();
    }
    this.state.isRecording = false;

    // 音声認識の停止
    if (this.activeSpeechRecognition) {
      try {
        this.activeSpeechRecognition.stop();
      } catch (_) {}
    }

    // 録音処理後、少し待ってから採点または自己評価へ
    setTimeout(() => {
      if (!this.state.recognizedText && !this.state.score) {
        // 音声認識がタイムアウトまたは未返却の場合は自己評価画面へ
        this.renderPracticing();
      }
    }, 600);
  }

  static startSpeechRecognition() {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      return;
    }

    try {
      const recognition = new SpeechRec();
      this.activeSpeechRecognition = recognition;
      recognition.lang = 'mn-MN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 3;

      recognition.onresult = (event) => {
        if (event.results && event.results[0] && event.results[0][0]) {
          const transcript = event.results[0][0].transcript.trim();
          this.state.recognizedText = transcript;
          this.scorePronunciation(transcript);
        }
      };

      recognition.onerror = (e) => {
        console.warn('[SpeechRec] Error/no-match:', e.error);
      };

      recognition.start();
    } catch (e) {
      console.warn('[SpeechRec] Failed to start:', e);
    }
  }

  // --- 5. 採点アルゴリズム（レーベンシュタイン距離 ＆ 音響類似度） ---
  static scorePronunciation(userTranscript) {
    const target = this.state.currentItem.mongolian;
    const cleanTarget = this.cleanCyrillic(target);
    const cleanUser = this.cleanCyrillic(userTranscript);

    let score = 0;
    if (cleanTarget === cleanUser) {
      score = 100;
    } else {
      const distance = this.levenshtein(cleanTarget, cleanUser);
      const maxLen = Math.max(cleanTarget.length, cleanUser.length, 1);
      const similarity = Math.max(0, 1 - (distance / maxLen));
      score = Math.round(similarity * 100);

      // 部分一致ボーナス
      if (cleanUser.includes(cleanTarget) || cleanTarget.includes(cleanUser)) {
        score = Math.max(score, 85);
      }
    }

    this.evaluateScore(score, userTranscript);
  }

  static evaluateScore(score, transcript) {
    this.state.score = score;
    this.state.recognizedText = transcript;

    let comment = '';
    const item = this.state.currentItem;

    if (score >= 90) {
      comment = 'Маш сайн!（とても素晴らしい！）ネイティブ並みに自然な発音です！草原の風のように美しい！';
    } else if (score >= 75) {
      comment = 'Сайн байна!（良いですね！）しっかり通じる発音です。母音の長さに気をつけるとさらに美しくなります！';
    } else {
      comment = item.hint 
        ? `惜しい！「${item.hint}」を意識して、もう一度ゆっくりお手本を聴いてみよう！` 
        : '惜しい！口の形をしっかり意識して、もう一度お手本を真似してみよう！';
    }
    this.state.feedbackComment = comment;

    // ゲーミフィケーションスコア
    const isCorrect = score >= 75;
    const feedback = GamificationService.recordAnswer({ isCorrect, testType: 'pronunciation' });
    this.state.sessionScore = (this.state.sessionScore || 0) + (score >= 90 ? 100 : (score >= 75 ? 75 : 30));
    this.state.sessionXp = (this.state.sessionXp || 0) + feedback.xpGained;

    // 苦手克服ノートへの自動記録（75点未満の発音不合格時）
    if (!isCorrect && this.state.currentItem) {
      try {
        const item = this.state.currentItem;
        StorageService.recordMistake({
          type: 'pronunciation',
          category: item.category || '発音特訓',
          question: `【発音特訓】${item.mongolian}（${item.japanese || ''}）`,
          prompt: item.mongolian,
          correctAnswer: item.mongolian,
          userAnswer: transcript || '(発音ミス)',
          explanation: `目標: ${item.mongolian}（${item.japanese || ''}）。発音ポイント: ${item.hint || item.phoneticGuide || '口の形とアクセントを意識しましょう。'} (判定スコア: ${score}点)`,
          wrongCount: 1
        });
      } catch (err) {
        console.warn('Pronunciation recordMistake error:', err);
      }
    }

    this.state.results.push({
      item: this.state.currentItem,
      score: score,
      recognizedText: transcript,
      recordedBlob: this.state.recordedBlob
    });

    this.renderPracticing();
  }

  static cleanCyrillic(str) {
    return (str || '')
      .toLowerCase()
      .replace(/[.,!?。、！？«»"'\s\(\)（）-]/g, '')
      .trim();
  }

  static levenshtein(a, b) {
    const matrix = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // 置換
            matrix[i][j - 1] + 1,     // 挿入
            matrix[i - 1][j] + 1      // 削除
          );
        }
      }
    }
    return matrix[b.length][a.length];
  }

  static goNext() {
    this.stopAllAudio();
    if (this.state.currentIndex + 1 < this.state.items.length) {
      this.loadItem(this.state.currentIndex + 1);
    } else {
      this.finishSession();
    }
  }

  static stopAllAudio() {
    SpeechService.stop();
    if (this.activeSpeechRecognition) {
      try { this.activeSpeechRecognition.stop(); } catch (_) {}
    }
    if (this.state.mediaRecorder && this.state.mediaRecorder.state !== 'inactive') {
      try { this.state.mediaRecorder.stop(); } catch (_) {}
    }
    this.state.isRecording = false;
  }

  // --- 6. リザルト画面 ---
  static finishSession() {
    this.state.view = 'result';
    const total = this.state.results.length;
    const avgScore = total > 0 
      ? Math.round(this.state.results.reduce((acc, r) => acc + r.score, 0) / total)
      : 0;

    const correctCount = this.state.results.filter(r => r.score >= 75).length;
    const wrongCount = total - correctCount;

    const sessionRes = GamificationService.finishSession({
      testType: 'pronunciation',
      testTitle: '発音特訓モード',
      correctCount,
      wrongCount,
      sessionScore: this.state.sessionScore,
      sessionXp: this.state.sessionXp
    });

    StorageService.recordHistory({
      type: 'pronunciation',
      total,
      correct: correctCount,
      category: this.state.category
    });

    this.renderResult(avgScore, sessionRes);
  }

  static renderResult(avgScore = 0, sessionRes = {}) {
    const total = this.state.results.length;

    this.container.innerHTML = `
      <div class="animate-fade-in max-w-xl mx-auto px-4 py-4 space-y-4">
        
        <!-- ゲームリザルトカード -->
        ${GamificationService.renderGameResultCard({
          testTitle: 'モンゴル語 発音特訓',
          correctCount: this.state.results.filter(r => r.score >= 75).length,
          wrongCount: this.state.results.filter(r => r.score < 75).length,
          scoreEarned: this.state.sessionScore || 0,
          xpEarned: this.state.sessionXp || 0,
          maxCombo: sessionRes.maxCombo || 0,
          sessionResult: sessionRes
        })}

        <!-- 間違いノート自動保存通知バナー ＆ 直行ボタン -->
        ${this.state.results.some(r => r.score < 75) ? `
          <div class="p-3.5 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs text-left">
            <div class="text-xs text-rose-800 dark:text-rose-200 font-bold flex items-center gap-1.5">
              <span class="text-base">🔥</span>
              <span>合格点に届かなかった <strong>${this.state.results.filter(r => r.score < 75).length}</strong> 単語を「間違いノート」に自動保存しました</span>
            </div>
            <button type="button" id="btn-goto-mistakes-from-pron" class="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-black rounded-xl text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0">
              <span>間違いノートで特訓</span>
              <span>→</span>
            </button>
          </div>
        ` : ''}

        <!-- 発音平均スコアカード -->
        <div class="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm text-center space-y-3">
          <div class="flex items-center justify-between text-xs text-slate-500 font-bold px-2">
            <span>発音平均スコア</span>
            <span class="text-teal-700 font-black text-sm">${avgScore} 点</span>
          </div>

          <div class="text-2xl font-black text-slate-800">
            ${avgScore >= 90 ? '🌟 発音マスター！完璧なネイティブレベル' :
              avgScore >= 75 ? '👍 よく出来ました！十分に通じる発音です' :
              '💪 伸びしろ抜群！練習を重ねれば確実に上手くなります'}
          </div>

          <div class="flex gap-2 pt-2">
            <button type="button" id="btn-retry-pron" class="flex-1 py-3 bg-teal-600 hover:bg-teal-700 text-white font-extrabold rounded-xl text-xs sm:text-sm transition-all active:scale-98 shadow-xs cursor-pointer">
              もう一度特訓する
            </button>
            <button type="button" id="btn-pron-home" class="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs sm:text-sm transition-all cursor-pointer">
              ホームへ戻る
            </button>
          </div>
        </div>

        <!-- 練習した単語一覧・復習 -->
        <div class="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
          <h3 class="text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
            <span>📋</span> 今回練習した発音一覧 (${total}件)
          </h3>

          <div class="space-y-2">
            ${this.state.results.map((r, i) => `
              <div class="p-3 rounded-2xl border ${r.score >= 75 ? 'border-teal-200 bg-teal-50/40' : 'border-amber-200 bg-amber-50/40'} flex items-center justify-between gap-2">
                <div class="space-y-0.5">
                  <div class="flex items-center gap-2">
                    <span class="font-extrabold cyrillic-text text-slate-900">${r.item.mongolian}</span>
                    <span class="text-xs text-slate-500 font-medium">(${r.item.japanese})</span>
                  </div>
                  ${r.recognizedText ? `
                    <div class="text-[11px] text-slate-400">認識: <span class="font-bold text-slate-600">${r.recognizedText}</span></div>
                  ` : ''}
                </div>

                <div class="flex items-center gap-2">
                  <span class="text-xs font-black px-2 py-0.5 rounded-full ${r.score >= 85 ? 'bg-emerald-100 text-emerald-800' : (r.score >= 70 ? 'bg-teal-100 text-teal-800' : 'bg-amber-100 text-amber-800')}">
                    ${r.score}点
                  </span>
                  <button type="button" class="btn-play-list-item p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-teal-700 transition-all cursor-pointer" data-word="${r.item.mongolian}">
                    🔊
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

      </div>
    `;

    this.bindResultEvents();
  }

  static bindResultEvents() {
    const container = this.container;

    container.querySelector('#btn-retry-pron')?.addEventListener('click', () => {
      this.startTest();
    });

    container.querySelector('#btn-pron-home')?.addEventListener('click', () => {
      if (this.onNavigate) this.onNavigate('home');
    });

    container.querySelector('#btn-goto-mistakes-from-pron')?.addEventListener('click', () => {
      if (typeof ReviewNotebookComponent !== 'undefined') {
        ReviewNotebookComponent.state.view = 'list';
        ReviewNotebookComponent.state.filterType = 'all';
      }
      if (this.onNavigate) this.onNavigate('review');
    });

    container.querySelectorAll('.btn-play-list-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const word = btn.getAttribute('data-word');
        if (word) SpeechService.speak(word);
      });
    });
  }
}
