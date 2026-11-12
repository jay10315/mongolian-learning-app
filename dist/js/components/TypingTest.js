// モンゴル語タイピング練習コンポーネント
// 1. ランダム出題（公式例文集） ＆ 自作登録文章モード
// 2. 3つの出題形式（モンゴル語打鍵 / 日本語訳打鍵 / 薄地なぞり打ち＆単語即タップ）
// 3. 自作文章でも3つのモードをいつでも自由切り替え可能
// 4. 単語即タップ辞書ポップアップ ＆「調べた単語帳」自動保存 ＆ 一文完了時和訳表示
import { StorageService } from '../services/storage.js';
import { SpeechService } from '../services/speech.js';
import { GamificationService } from '../services/gamification.js';
import { SoundEffects, findWordInDictionary, SPECIAL_CYRILLIC_BAR, MONGOLIAN_CYRILLIC_LETTERS, shuffleArray } from '../utils/helpers.js';

export class TypingTestComponent {
  static container = null;
  static onNavigate = null;
  static keyListener = null;

  static state = {
    view: 'settings', // 'settings' | 'typing' | 'looked_up_words' | 'custom_manager'
    source: 'random', // 'random' (公式例文集からランダム/順次出題) | 'custom' (自分で登録した文章)
    typingMode: 'trace', // 'trace' (薄地なぞり＆単語即タップ) | 'mn' (モンゴル語タイピング) | 'ja' (日本語訳タイピング)
    category: 'all',  // 'all' | 'beginner' | 'daily' | 'culture' | 'proverbs' | 'custom'
    sentences: [],
    currentIndex: 0,
    currentSentence: null,
    typedText: '',
    mistakes: 0,
    totalKeystrokes: 0,
    startTime: null,
    endTime: null,
    sentenceFinished: false,
    showRomaji: false,
    stats: null,
    searchLookupKeyword: '',
    pendingBuffer: '',
    justMistyped: false,
    // 自作文章編集中のデータ
    editingCustomId: null
  };

  static render(container, onNavigate) {
    this.container = container;
    this.onNavigate = onNavigate;

    // キーボードリスナーのクリーンアップ＆再登録
    this.detachKeyListener();

    if (this.state.view === 'typing' && this.state.currentSentence) {
      this.renderTyping();
    } else if (this.state.view === 'custom_manager') {
      this.renderCustomManager();
    } else if (this.state.view === 'looked_up_words') {
      this.renderLookedUpWords();
    } else {
      this.state.view = 'settings';
      this.renderSettings();
    }
  }

  // ==========================================
  // 1. 設定・モード選択画面
  // ==========================================
  static renderSettings() {
    this.detachKeyListener();
    const allSentences = StorageService.getTypingSentences();
    const customSentences = StorageService.getCustomTypingSentences();
    const lookedUpCount = StorageService.getLookedUpWords().length;

    // 3つのタイピング出題形式の定義
    const typingModes = [
      {
        id: 'trace',
        icon: '✨',
        title: '薄地なぞり打ち ＆ 単語即タップ',
        badge: 'おすすめ ⚡ 読解・語彙連携',
        desc: '薄地のモンゴル語をなぞるようにタイピング！わからない単語は即タップで辞書解説 ＆「調べた単語」に自動保存。完了時に和訳が出現。'
      },
      {
        id: 'mn',
        icon: '🇲🇳',
        title: 'モンゴル語タイピング',
        badge: 'キリル文字打鍵',
        desc: '日本語訳を見て、対応するモンゴル語キリル文字を入力する本格タイピング問題。発音ヒントや英字ローマ字入力にも対応。'
      },
      {
        id: 'ja',
        icon: '🇯🇵',
        title: '日本語訳タイピング',
        badge: '和訳・理解度チェック',
        desc: 'モンゴル語の文を読んで（または音声を聴いて）、その日本語訳をタイピングする理解度チェック問題。'
      }
    ];

    // 2つの文章ソース
    const sources = [
      {
        id: 'random',
        icon: '🎲',
        title: 'ランダム・公式例文集',
        badge: `${allSentences.length} 文収録`,
        desc: '初級挨拶・日常会話・伝統文化・ことわざからランダムに多彩な文章を出題。'
      },
      {
        id: 'custom',
        icon: '📝',
        title: '自分で登録した文章（マイ例文）',
        badge: `${customSentences.length} 文登録中`,
        desc: '自分が練習したいオリジナルのモンゴル語文章を自由に登録して練習できるモード。'
      }
    ];

    // カテゴリー集計（ランダムモード時）
    const categories = [
      { id: 'all', label: 'すべて', icon: '🌟', count: allSentences.length },
      { id: 'textbook', label: '教科書例文（全18課）', icon: '📖', count: allSentences.filter(s => s.category === 'textbook').length },
      { id: 'beginner', label: '基本挨拶・自己紹介', icon: '👋', count: allSentences.filter(s => s.category === 'beginner').length },
      { id: 'daily', label: '日常会話・食事', icon: '☕', count: allSentences.filter(s => s.category === 'daily').length },
      { id: 'culture', label: '伝統文化・遊牧・ゲル', icon: '🐎', count: allSentences.filter(s => s.category === 'culture').length },
      { id: 'interview_prep', label: '口述試験・面接スピーチ', icon: '🎙️', count: allSentences.filter(s => s.category === 'interview_prep').length },
      { id: 'classroom', label: '教室・挨拶表現', icon: '🏫', count: allSentences.filter(s => s.category === 'classroom' || s.category === 'greetings').length },
      { id: 'proverbs', label: 'ことわざ・名言', icon: '📜', count: allSentences.filter(s => s.category === 'proverbs').length }
    ];

    this.container.innerHTML = `
      <div class="animate-fade-in max-w-2xl mx-auto px-4 py-4 space-y-6">
        
        <!-- ヘッダー -->
        <div class="bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
          <div class="relative z-10 space-y-2">
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-teal-100">
              <span>⌨️</span> モンゴル語タイピング練習
            </div>
            <h1 class="text-2xl sm:text-3xl font-black tracking-tight">
              タイピングで学ぶモンゴル語
            </h1>
            <p class="text-xs sm:text-sm text-teal-100 leading-relaxed max-w-lg">
              ランダム文章または自作文章で練習！「薄地なぞり打ち」「モンゴル語タイピング」「日本語訳タイピング」の3つのモードをいつでも自由に切り替えられます。
            </p>
          </div>

          <div class="mt-4 pt-3 border-t border-white/20 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div class="flex items-center gap-4">
              <span>📚 収録例文: <strong>${allSentences.length}</strong> 文</span>
              <span>📝 自作マイ例文: <strong>${customSentences.length}</strong> 文</span>
              <span>📌 調べた単語: <strong>${lookedUpCount}</strong> 語</span>
            </div>
            
            <div class="flex items-center gap-2">
              <button type="button" id="btn-goto-custom-manager" class="px-3 py-1.5 bg-amber-400/90 hover:bg-amber-400 text-slate-900 rounded-xl font-black transition-all flex items-center gap-1.5 shadow-xs cursor-pointer">
                <span>📝</span> 自作文章の登録・管理
              </button>
              <button type="button" id="btn-goto-lookup-notebook" class="px-3 py-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-xs rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer">
                <span>📌</span> 調べた単語帳
              </button>
            </div>
          </div>
        </div>

        <!-- 1. 文章ソースの選択（ランダム vs 自分で登録した文章） -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <h2 class="text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
              <span>📚</span> 1. 文章ソースを選択
            </h2>
            <span class="text-xs text-slate-400">どちらの文章で練習するか選択</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            ${sources.map(src => {
              const isSelected = this.state.source === src.id;
              return `
                <button type="button" class="btn-select-source p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected 
                    ? 'border-teal-500 bg-teal-50/90 shadow-sm ring-2 ring-teal-400' 
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }" data-source="${src.id}">
                  <div class="space-y-1">
                    <div class="flex items-center justify-between">
                      <span class="text-xl">${src.icon}</span>
                      <span class="text-xs font-bold px-2 py-0.5 rounded-full ${isSelected ? 'bg-teal-200 text-teal-900' : 'bg-slate-100 text-slate-600'}">
                        ${src.badge}
                      </span>
                    </div>
                    <div class="text-sm font-black text-slate-900">${src.title}</div>
                    <div class="text-xs text-slate-500 leading-relaxed">${src.desc}</div>
                  </div>
                  <div class="mt-3 pt-2 border-t border-slate-100 text-[11px] font-bold ${isSelected ? 'text-teal-700' : 'text-slate-400'}">
                    ${isSelected ? '● 選択中' : '選択する'}
                  </div>
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <!-- 2. タイピング形式の選択（3つの出題モード） -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <h2 class="text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
              <span>🎯</span> 2. タイピング形式を選択（後からいつでも切り替え可能）
            </h2>
          </div>

          <div class="grid grid-cols-1 gap-2.5">
            ${typingModes.map(m => {
              const isSelected = this.state.typingMode === m.id;
              return `
                <button type="button" class="btn-select-mode p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-start justify-between gap-3 ${
                  isSelected 
                    ? 'border-teal-500 bg-teal-50/90 shadow-sm ring-2 ring-teal-400' 
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }" data-mode="${m.id}">
                  <div class="space-y-1 flex-1">
                    <div class="flex items-center gap-2">
                      <span class="text-xl">${m.icon}</span>
                      <span class="text-sm font-black text-slate-900">${m.title}</span>
                      <span class="text-[10px] font-extrabold px-2 py-0.5 rounded-full ${isSelected ? 'bg-teal-200 text-teal-900' : 'bg-slate-100 text-slate-600'}">
                        ${m.badge}
                      </span>
                    </div>
                    <div class="text-xs text-slate-600 leading-relaxed pl-7">${m.desc}</div>
                  </div>
                  <div class="text-xs font-bold shrink-0 mt-1 ${isSelected ? 'text-teal-700' : 'text-slate-400'}">
                    ${isSelected ? '● 選択中' : '選択'}
                  </div>
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <!-- 3. 公式例文のカテゴリー選択（ランダムソース時のみ表示） -->
        ${this.state.source === 'random' ? `
          <div class="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div class="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <span>🏷️</span> 出題カテゴリー
            </div>
            <div class="flex flex-wrap gap-1.5">
              ${categories.map(c => `
                <button type="button" class="btn-select-category px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  this.state.category === c.id 
                    ? 'bg-slate-800 text-white shadow-xs' 
                    : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                }" data-category="${c.id}">
                  <span>${c.icon}</span> ${c.label} (${c.count})
                </button>
              `).join('')}
            </div>
          </div>
        ` : `
          <div class="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-center justify-between text-xs text-amber-900">
            <div>
              <div class="font-extrabold flex items-center gap-1.5">
                <span>📝</span> 登録済みマイ例文から出題します（${customSentences.length}文）
              </div>
              <div class="text-[11px] text-amber-700 mt-0.5">新しい文章を追加・編集したい場合は「自作文章の登録・管理」から行えます。</div>
            </div>
            <button type="button" id="btn-manage-custom-inline" class="px-3 py-1.5 bg-amber-200 hover:bg-amber-300 rounded-xl font-bold shrink-0 transition-colors cursor-pointer">
              管理・追加
            </button>
          </div>
        `}

        <!-- 開始ボタン -->
        <div class="pt-2">
          <button type="button" id="btn-start-typing" class="w-full py-4 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-black text-base rounded-2xl shadow-md hover:shadow-lg transition-all transform active:scale-98 flex items-center justify-center gap-2 cursor-pointer">
            <span>🚀</span> タイピング練習を開始する
          </button>
        </div>

      </div>
    `;

    this.bindSettingsEvents();
  }

  static bindSettingsEvents() {
    // 文章ソース選択（ランダム vs 自作）
    this.container.querySelectorAll('.btn-select-source').forEach(btn => {
      btn.addEventListener('click', () => {
        this.state.source = btn.getAttribute('data-source');
        this.renderSettings();
      });
    });

    // タイピングモード選択（3つの出題形式）
    this.container.querySelectorAll('.btn-select-mode').forEach(btn => {
      btn.addEventListener('click', () => {
        this.state.typingMode = btn.getAttribute('data-mode');
        this.renderSettings();
      });
    });

    // カテゴリー選択
    this.container.querySelectorAll('.btn-select-category').forEach(btn => {
      btn.addEventListener('click', () => {
        this.state.category = btn.getAttribute('data-category');
        this.renderSettings();
      });
    });

    // ローマ字ヒントトグル
    const romajiChk = this.container.querySelector('#chk-show-romaji');
    if (romajiChk) {
      romajiChk.addEventListener('change', (e) => {
        this.state.showRomaji = e.target.checked;
      });
    }

    // 自作文章管理画面へ
    const gotoCustomBtn = this.container.querySelector('#btn-goto-custom-manager');
    if (gotoCustomBtn) {
      gotoCustomBtn.addEventListener('click', () => {
        this.state.view = 'custom_manager';
        this.renderCustomManager();
      });
    }

    const manageCustomInline = this.container.querySelector('#btn-manage-custom-inline');
    if (manageCustomInline) {
      manageCustomInline.addEventListener('click', () => {
        this.state.view = 'custom_manager';
        this.renderCustomManager();
      });
    }

    // 調べた単語帳へ
    const gotoLookupBtn = this.container.querySelector('#btn-goto-lookup-notebook');
    if (gotoLookupBtn) {
      gotoLookupBtn.addEventListener('click', () => {
        this.state.view = 'looked_up_words';
        this.renderLookedUpWords();
      });
    }

    // 開始ボタン
    const startBtn = this.container.querySelector('#btn-start-typing');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        this.startTypingSession();
      });
    }
  }

  // ==========================================
  // 2. 自作文章の登録・管理画面 (`custom_manager`)
  // ==========================================
  static renderCustomManager() {
    this.detachKeyListener();
    const customList = StorageService.getCustomTypingSentences();
    const editingItem = this.state.editingCustomId 
      ? customList.find(s => s.id === this.state.editingCustomId) 
      : null;

    this.container.innerHTML = `
      <div class="animate-fade-in max-w-2xl mx-auto px-4 py-4 space-y-6">
        
        <!-- ナビゲーションバー -->
        <div class="flex items-center justify-between border-b border-slate-200 pb-3">
          <button type="button" id="btn-back-to-settings-from-custom" class="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer">
            <span>←</span> タイピング設定に戻る
          </button>
          
          <span class="text-xs font-extrabold text-amber-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
            登録済みマイ例文: ${customList.length} 件
          </span>
        </div>

        <!-- タイトル -->
        <div>
          <h2 class="text-xl font-black text-slate-800 flex items-center gap-2">
            <span>📝</span> 自作タイピング文章の登録・管理
          </h2>
          <p class="text-xs text-slate-500 mt-1">
            自分がタイピング練習したいオリジナルのモンゴル語文章を追加できます。登録した文章は「薄地なぞり打ち」「モンゴル語打鍵」「日本語訳打鍵」の3つのモードすべてで自由に練習可能です。
          </p>
        </div>

        <!-- 登録・編集フォーム -->
        <div class="bg-white rounded-2xl p-5 border-2 border-amber-300 shadow-sm space-y-4">
          <div class="font-black text-sm text-slate-800 flex items-center justify-between">
            <span class="flex items-center gap-1.5">
              <span>${editingItem ? '✏️' : '➕'}</span>
              <span>${editingItem ? '文章の編集' : '新しい文章を追加する'}</span>
            </span>
            ${editingItem ? `
              <button type="button" id="btn-cancel-custom-edit" class="text-xs text-slate-400 hover:text-slate-600 underline cursor-pointer">
                編集をキャンセル
              </button>
            ` : ''}
          </div>

          <form id="form-custom-sentence" class="space-y-3">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">
                🇲🇳 モンゴル語の文 <span class="text-rose-500">*必須</span>
              </label>
              <input 
                type="text" 
                id="input-custom-mn" 
                value="${editingItem ? editingItem.textMn : ''}"
                placeholder="例: Би Монгол хэл сурч байна." 
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 font-bold text-sm cyrillic-text text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                required
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">
                🇯🇵 日本語訳 <span class="text-rose-500">*必須</span>
              </label>
              <input 
                type="text" 
                id="input-custom-ja" 
                value="${editingItem ? editingItem.textJa : ''}"
                placeholder="例: 私はモンゴル語を勉強しています。" 
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                required
              />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">
                  💡 読み方（ローマ字・任意）
                </label>
                <input 
                  type="text" 
                  id="input-custom-romaji" 
                  value="${editingItem && editingItem.romaji ? editingItem.romaji : ''}"
                  placeholder="例: bi mongol khel surch baina." 
                  class="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">
                  📖 文法・メモ解説（任意）
                </label>
                <input 
                  type="text" 
                  id="input-custom-exp" 
                  value="${editingItem && editingItem.explanation ? editingItem.explanation : ''}"
                  placeholder="例: сурч байна = 勉強している最中" 
                  class="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                />
              </div>
            </div>

            <button type="submit" class="w-full py-3 bg-gradient-to-r from-amber-500 to-teal-600 hover:from-amber-600 hover:to-teal-700 text-white font-black text-xs rounded-xl shadow-md transition-all active:scale-98 cursor-pointer">
              ${editingItem ? '文章を更新する' : 'マイ文章を登録する ＋'}
            </button>
          </form>
        </div>

        <!-- 登録済み文章一覧 -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
              <span>📋</span> 登録済みマイ例文一覧 (${customList.length} 件)
            </h3>

            ${customList.length > 0 ? `
              <button type="button" id="btn-start-all-custom-typing" class="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1">
                <span>🚀</span> この文章集でタイピング開始
              </button>
            ` : ''}
          </div>

          ${customList.length === 0 ? `
            <div class="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-2">
              <div class="text-3xl">📝</div>
              <div class="text-sm font-bold text-slate-700">自作の文章はまだ登録されていません</div>
              <p class="text-xs text-slate-400">上のフォームからモンゴル語と日本語訳を入力して登録してみましょう！</p>
            </div>
          ` : `
            <div class="space-y-2.5">
              ${customList.map(s => `
                <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-all space-y-2.5">
                  <div class="flex items-start justify-between gap-2">
                    <div class="space-y-1">
                      <div class="text-base sm:text-lg font-black text-slate-900 cyrillic-text">
                        ${s.textMn}
                      </div>
                      <div class="text-xs font-bold text-emerald-800">
                        🇯🇵 ${s.textJa}
                      </div>
                                            ${s.explanation ? `<div class="text-[11px] text-slate-500">📝 ${s.explanation}</div>` : ''}
                    </div>

                    <div class="flex items-center gap-1 shrink-0">
                      <button type="button" class="btn-edit-custom p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 text-xs cursor-pointer" data-id="${s.id}" title="編集">
                        ✏️
                      </button>
                      <button type="button" class="btn-delete-custom p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 text-xs cursor-pointer" data-id="${s.id}" title="削除">
                        🗑️
                      </button>
                    </div>
                  </div>

                  <!-- 3つのモードで今すぐ練習するボタン群 -->
                  <div class="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-xs">
                    <span class="text-[10px] text-slate-400 font-bold mr-1">この文で練習:</span>
                    <button type="button" class="btn-practice-custom px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 font-bold text-[11px] cursor-pointer" data-id="${s.id}" data-mode="trace">
                      ✨ 薄地なぞり打ち
                    </button>
                    <button type="button" class="btn-practice-custom px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-[11px] cursor-pointer" data-id="${s.id}" data-mode="mn">
                      🇲🇳 モンゴル語打鍵
                    </button>
                    <button type="button" class="btn-practice-custom px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 font-bold text-[11px] cursor-pointer" data-id="${s.id}" data-mode="ja">
                      🇯🇵 日本語訳打鍵
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          `}

        </div>

      </div>
    `;

    this.bindCustomManagerEvents();
  }

  static bindCustomManagerEvents() {
    const backBtn = this.container.querySelector('#btn-back-to-settings-from-custom');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        this.state.view = 'settings';
        this.state.editingCustomId = null;
        this.renderSettings();
      });
    }

    // フォーム送信
    const form = this.container.querySelector('#form-custom-sentence');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const textMn = this.container.querySelector('#input-custom-mn').value.trim();
        const textJa = this.container.querySelector('#input-custom-ja').value.trim();
        const romaji = this.container.querySelector('#input-custom-romaji').value.trim();
        const exp = this.container.querySelector('#input-custom-exp').value.trim();

        if (!textMn || !textJa) return;

        StorageService.addOrUpdateCustomTypingSentence({
          id: this.state.editingCustomId || null,
          textMn,
          textJa,
          romaji,
          explanation: exp
        });

        this.state.editingCustomId = null;
        this.renderCustomManager();
      });
    }

    // 編集キャンセル
    const cancelBtn = this.container.querySelector('#btn-cancel-custom-edit');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        this.state.editingCustomId = null;
        this.renderCustomManager();
      });
    }

    // 編集ボタン
    this.container.querySelectorAll('.btn-edit-custom').forEach(btn => {
      btn.addEventListener('click', () => {
        this.state.editingCustomId = btn.getAttribute('data-id');
        this.renderCustomManager();
      });
    });

    // 削除ボタン
    this.container.querySelectorAll('.btn-delete-custom').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (confirm('このマイ文章を削除しますか？')) {
          StorageService.deleteCustomTypingSentence(id);
          this.renderCustomManager();
        }
      });
    });

    // 特定の文章・特定モードで練習開始
    this.container.querySelectorAll('.btn-practice-custom').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const mode = btn.getAttribute('data-mode') || 'trace';
        const customList = StorageService.getCustomTypingSentences();
        const targetIdx = customList.findIndex(s => s.id === id);
        if (targetIdx === -1) return;

        this.state.source = 'custom';
        this.state.typingMode = mode;
        this.state.sentences = customList;
        this.state.currentIndex = targetIdx;
        this.initSentence(targetIdx);
        this.state.view = 'typing';
        this.renderTyping();
      });
    });

    // 自作文章集全体でタイピング開始
    const startAllCustomBtn = this.container.querySelector('#btn-start-all-custom-typing');
    if (startAllCustomBtn) {
      startAllCustomBtn.addEventListener('click', () => {
        this.state.source = 'custom';
        this.startTypingSession();
      });
    }
  }

  // ==========================================
  // 3. タイピングセッション開始
  // ==========================================
  static startTypingSession() {
    let list = [];
    if (this.state.source === 'custom') {
      list = StorageService.getCustomTypingSentences();
      if (list.length === 0) {
        alert('自作文章がまだ登録されていません。まずは文章を登録しましょう！');
        this.state.view = 'custom_manager';
        this.renderCustomManager();
        return;
      }
    } else {
      const all = StorageService.getTypingSentences();
      if (this.state.category === 'all') {
        list = shuffleArray([...all]);
      } else {
        list = all.filter(s => s.category === this.state.category);
        if (list.length === 0) list = all;
        list = shuffleArray([...list]);
      }
    }

    this.state.sentences = list;
    this.state.currentIndex = 0;
    this.initSentence(0);
    this.state.view = 'typing';
    this.renderTyping();
  }

  static initSentence(index) {
    if (index >= this.state.sentences.length) {
      index = 0;
    }
    this.state.currentIndex = index;
    this.state.currentSentence = this.state.sentences[index];
    this.state.typedText = '';
    this.state.mistakes = 0;
    this.state.totalKeystrokes = 0;
    this.state.startTime = null;
    this.state.endTime = null;
    this.state.sentenceFinished = false;
    this.state.stats = null;
    this.state.pendingBuffer = '';
    this.state.justMistyped = false;
  }

  // ==========================================
  // 4. タイピング画面の描画（3つのモード完全対応）
  // ==========================================
  static renderTyping() {
    const sentence = this.state.currentSentence;
    if (!sentence) return;

    const total = this.state.sentences.length;
    const currentNum = this.state.currentIndex + 1;
    const lookedUpCount = StorageService.getLookedUpWords().length;

    // 単語ごとのトークン分割（タップ辞書用）
    const renderInteractiveWords = (text) => {
      const tokens = text.split(/([А-Яа-яЁёӨөҮү]+(?:-[А-Яа-яЁёӨөҮү]+)?)/g);
      return tokens.map(token => {
        if (/^[А-Яа-яЁёӨөҮү]+(?:-[А-Яа-яЁёӨөҮү]+)?$/.test(token)) {
          const isLookedUp = StorageService.isWordLookedUp(token);
          return `<span class="clickable-word cursor-pointer px-1 py-0.5 rounded transition-all inline-block ${
            isLookedUp 
              ? 'bg-amber-100/90 text-amber-950 font-black border-b-2 border-amber-400' 
              : 'hover:bg-teal-100 hover:text-teal-900 border-b border-dotted border-slate-300'
          }" data-word="${token}" title="タップして辞書解説を表示">${token}</span>`;
        }
        return token;
      }).join('');
    };

    const mode = this.state.typingMode; // 'trace' | 'mn' | 'ja'
    const isFinished = this.state.sentenceFinished;

    // ターゲット文字列と現在の入力
    let target = sentence.textMn;
    if (mode === 'ja') {
      target = sentence.textJa;
    }
    const typed = this.state.typedText;
    const typedLen = typed.length;
    const targetLen = target.length;

    this.container.innerHTML = `
      <div class="max-w-2xl mx-auto px-4 py-3 space-y-4" id="typing-screen-container">
        
        <!-- ナビゲーションバー -->
        <div class="flex items-center justify-between text-xs font-bold text-slate-500">
          <button type="button" id="btn-back-to-settings" class="flex items-center gap-1 text-slate-600 hover:text-slate-900 p-1 cursor-pointer">
            <span>←</span> 設定に戻る
          </button>

          <div class="flex items-center gap-2">
            <span class="text-xs font-extrabold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
              ${this.state.source === 'custom' ? '📝 マイ例文' : '🎲 例文'} ${currentNum} / ${total}
            </span>

            <button type="button" id="btn-open-lookup-from-typing" class="px-2.5 py-1 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 flex items-center gap-1 cursor-pointer">
              <span>📌 調べた単語</span>
              <span id="badge-typing-lookup" class="font-extrabold">${lookedUpCount}</span>
            </button>
          </div>
        </div>

        <!-- 3つのモード自由切り替えコントロールバー（重要要件） -->
        <div class="bg-slate-100/90 border border-slate-200 p-1.5 rounded-2xl flex items-center justify-between gap-1 shadow-2xs">
          <div class="flex items-center gap-1 overflow-x-auto scrollbar-none flex-1">
            <button type="button" class="btn-switch-typing-mode px-3 py-1.5 rounded-xl font-black text-xs transition-all whitespace-nowrap cursor-pointer ${
              mode === 'trace' 
                ? 'bg-teal-600 text-white shadow-xs' 
                : 'text-slate-600 hover:bg-white'
            }" data-mode="trace">
              ✨ 薄地なぞり打ち＆単語即タップ
            </button>

            <button type="button" class="btn-switch-typing-mode px-3 py-1.5 rounded-xl font-black text-xs transition-all whitespace-nowrap cursor-pointer ${
              mode === 'mn' 
                ? 'bg-teal-600 text-white shadow-xs' 
                : 'text-slate-600 hover:bg-white'
            }" data-mode="mn">
              🇲🇳 モンゴル語打鍵
            </button>

            <button type="button" class="btn-switch-typing-mode px-3 py-1.5 rounded-xl font-black text-xs transition-all whitespace-nowrap cursor-pointer ${
              mode === 'ja' 
                ? 'bg-teal-600 text-white shadow-xs' 
                : 'text-slate-600 hover:bg-white'
            }" data-mode="ja">
              🇯🇵 日本語訳打鍵
            </button>
          </div>

          <div class="flex items-center gap-1 shrink-0 ml-1">
            ${this.state.source === 'custom' ? `
              <button type="button" id="btn-switch-to-custom-manager" class="px-2.5 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl text-xs font-bold transition-all border border-amber-300 cursor-pointer">
                📝 自作管理
              </button>
            ` : ''}
          </div>
        </div>

        <!-- 出題プロンプトカード -->
        <div class="bg-white rounded-2xl p-5 border ${this.state.justMistyped ? 'border-rose-400 ring-2 ring-rose-300' : 'border-slate-200'} shadow-sm space-y-3 relative transition-all">
          
          <div class="flex items-center justify-between border-b border-slate-100 pb-2">
            <div class="flex items-center gap-2">
              <span class="text-[10px] font-extrabold px-2 py-0.5 rounded-full ${mode === 'trace' ? 'bg-teal-100 text-teal-800' : (mode === 'mn' ? 'bg-emerald-100 text-emerald-800' : 'bg-sky-100 text-sky-800')}">
                ${mode === 'trace' ? '✨ 薄地なぞり打ちモード' : (mode === 'mn' ? '🇲🇳 モンゴル語タイピング' : '🇯🇵 日本語訳タイピング')}
              </span>
              <span class="text-xs text-slate-400 font-medium">
                ${sentence.categoryLabel || sentence.level || '例文'}
              </span>
            </div>

            <!-- 音声読み上げボタン -->
            <button type="button" id="btn-speak-sentence" class="px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors" title="音声を聴く">
              <span>🔊</span>
              <span>聴く</span>
            </button>
          </div>

          <!-- 単語即タップ告知バナー -->
          <div class="bg-emerald-50/70 border border-emerald-200 rounded-xl px-3 py-1.5 text-[11px] text-emerald-900 flex items-center justify-between">
            <div class="flex items-center gap-1.5">
              <span>👆</span>
              <span><strong>単語をタップ:</strong> 即座に辞書解説表示 ＆「調べた単語」へ自動保存</span>
            </div>
            <span class="text-slate-400 text-[10px]">自動保存対応</span>
          </div>

          <!-- 出題文表示エリア -->
          ${mode === 'trace' ? `
            <!-- モードC: 薄地なぞり打ち＆単語即タップの原文 -->
            <div class="py-1 text-xl sm:text-2xl font-black cyrillic-text text-slate-800 leading-relaxed tracking-wide select-none">
              ${renderInteractiveWords(sentence.textMn)}
            </div>
          ` : (mode === 'mn' ? `
            <!-- モードA: モンゴル語打鍵（日本語訳を見てモンゴル語を打つ） -->
            <div class="py-1">
              <div class="text-xs text-slate-400 font-bold mb-1">【この日本語をモンゴル語で入力してください】</div>
              <div class="text-lg sm:text-xl font-black text-slate-900 leading-relaxed">
                🇯🇵 「${sentence.textJa}」
              </div>
            </div>
          ` : `
            <!-- モードB: 日本語訳打鍵（モンゴル語を見て日本語訳を打つ） -->
            <div class="py-1">
              <div class="text-xs text-slate-400 font-bold mb-1">【このモンゴル語の和訳を入力してください】</div>
              <div class="text-xl sm:text-2xl font-black cyrillic-text text-slate-900 leading-relaxed select-none">
                ${renderInteractiveWords(sentence.textMn)}
              </div>
            </div>
          `)}

        </div>

        <!-- リアルタイムタイピングディスプレイ -->
        <div id="typing-zone" class="bg-slate-900 rounded-2xl p-5 border-2 border-slate-800 shadow-md text-white space-y-4 relative overflow-hidden cursor-text">
          
          <div class="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
            <span class="flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full ${isFinished ? 'bg-emerald-400' : 'bg-teal-400'}"></span>
              <span>${isFinished ? 'クリア！' : (mode === 'ja' ? '日本語訳を入力中...' : '打鍵待機中...')}</span>
            </span>

            <div class="flex items-center gap-3">
              <span>ミス: <strong id="typing-mistakes-counter" class="text-rose-400">${this.state.mistakes}</strong></span>
              <span>進捗: <strong id="typing-progress-counter" class="text-teal-300 font-mono">${Math.round((typedLen / Math.max(1, targetLen)) * 100)}%</strong></span>
            </div>
          </div>

          <!-- なぞり打ち／タイピング文字ハイライト表示 -->
          ${mode === 'trace' ? `
            <!-- 薄地のモンゴル語をタイピングしてなぞっていく表示 -->
            <div id="typing-char-stream" class="relative font-mono text-xl sm:text-2xl cyrillic-text leading-relaxed tracking-widest break-all min-h-[3.5rem] select-none py-1">
              ${Array.from(target).map((char, idx) => {
                const displayChar = char === ' ' ? '&nbsp;' : char;
                if (idx < typedLen) {
                  // なぞり終えた文字（鮮やかなエメラルド）
                  return `<span class="text-emerald-400 font-black bg-emerald-950/70 rounded px-0.5 border-b border-emerald-400">${displayChar}</span>`;
                } else if (idx === typedLen) {
                  // 現在なぞるべき文字（安定したハイライトカーソル・点滅なし）
                  return `<span class="bg-teal-400 text-slate-950 font-black px-1 rounded underline decoration-2">${displayChar}</span>`;
                } else {
                  // 薄地の文字（透かしのように薄いグレーでなぞり待ち）
                  return `<span class="text-slate-600 opacity-60 font-medium">${displayChar}</span>`;
                }
              }).join('')}
            </div>
          ` : (mode === 'mn' ? `
            <!-- モンゴル語タイピングのハイライト表示 -->
            <div id="typing-char-stream" class="font-mono text-xl sm:text-2xl cyrillic-text leading-relaxed tracking-widest break-all min-h-[3rem] select-none py-1">
              ${Array.from(target).map((char, idx) => {
                const displayChar = char === ' ' ? '&nbsp;' : char;
                if (idx < typedLen) {
                  return `<span class="text-emerald-400 font-bold bg-emerald-950/60 rounded px-0.5">${displayChar}</span>`;
                } else if (idx === typedLen) {
                  return `<span class="bg-teal-400 text-slate-950 font-black px-1 rounded underline decoration-2">${displayChar}</span>`;
                } else {
                  return `<span class="text-slate-500">${displayChar}</span>`;
                }
              }).join('')}
            </div>
          ` : `
            <!-- 日本語訳タイピングの入力ガイド -->
            <div class="space-y-2 py-1">
              <div class="text-xs text-slate-400 font-medium">日本語訳の正解目標:</div>
              <div class="text-base sm:text-lg font-bold text-slate-300 font-sans tracking-wide">
                「${target}」
              </div>
            </div>
          `)}

          <!-- 入力フィールド -->
          <div class="space-y-1">
            <input 
              type="text" 
              id="typing-input-field" 
              class="w-full bg-slate-800/90 border border-slate-700 text-white font-mono text-sm sm:text-base px-3 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-center" 
              placeholder="${isFinished ? '完了しました' : (mode === 'ja' ? 'ここに日本語訳を入力して Enter ⏎' : 'ここをタップしてキーボードで打鍵')}" 
              autocomplete="off" 
              autocorrect="off" 
              autocapitalize="off" 
              spellcheck="false"
              ${isFinished ? 'disabled' : ''}
            />
            ${mode === 'ja' ? `
              <div class="text-[11px] text-slate-400 text-center pt-0.5">
                日本語を入力後、<strong>Enterキー</strong> または完了ボタンを押して回答
              </div>
            ` : ''}
          </div>

          <!-- クイックキリル文字入力バー（モンゴル語入力時） -->
          ${mode !== 'ja' ? `
            <div class="pt-2 border-t border-slate-800 flex items-center gap-1 overflow-x-auto scrollbar-none py-1">
              <span class="text-[10px] text-teal-400 font-bold shrink-0 mr-1">特有文字:</span>
              ${SPECIAL_CYRILLIC_BAR.map(c => `
                <button type="button" class="btn-quick-cyrillic shrink-0 px-2.5 py-1 text-xs font-bold bg-slate-800 hover:bg-teal-600 hover:text-white text-teal-200 rounded-lg border border-slate-700 active:scale-95 transition-all cursor-pointer" data-char="${c}">
                  ${c}
                </button>
              `).join('')}
            </div>
          ` : ''}

        </div>

        <!-- ========================================== -->
        <!-- 一文完了時の和訳表示カード（重要要件） -->
        <!-- ========================================== -->
        ${isFinished ? `
          <div id="sentence-completion-card" class="animate-bounce-in bg-white rounded-3xl p-6 border-2 border-emerald-400 shadow-xl space-y-5">
            
            <!-- クリアタイトル ＆ スコア -->
            <div class="flex items-center justify-between border-b border-emerald-100 pb-3">
              <div class="flex items-center gap-2">
                <span class="text-3xl animate-bounce">🎉</span>
                <div>
                  <h3 class="text-lg font-black text-slate-900">一文タイピング完了！</h3>
                  <p class="text-xs font-bold text-emerald-600">草原の風のように軽やかな打鍵でした！</p>
                </div>
              </div>
              <span class="text-xs font-black px-3 py-1 bg-amber-100 text-amber-900 rounded-full border border-amber-300">
                +${this.state.stats?.xp || 25} XP 獲得
              </span>
            </div>

            <!-- 日本語訳（大見出しで明示） -->
            <div class="bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 rounded-2xl p-4 sm:p-5 border-2 border-emerald-300 shadow-xs space-y-1">
              <div class="text-xs font-extrabold text-emerald-800 flex items-center gap-1.5">
                <span>🇯🇵</span> <span>日本語訳:</span>
              </div>
              <div class="text-lg sm:text-xl font-black text-emerald-950 leading-relaxed">
                「${sentence.textJa}」
              </div>
            </div>

            <!-- 文法・表現解説 -->
            ${sentence.explanation ? `
              <div class="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs text-slate-700 space-y-1.5">
                <div class="font-extrabold text-slate-900 flex items-center gap-1.5">
                  <span>💡</span> 文法・表現のポイント解説:
                </div>
                <div class="leading-relaxed text-[13px]">
                  ${sentence.explanation}
                </div>
              </div>
            ` : ''}

            <!-- 成績統計バッジ群 -->
            <div class="grid grid-cols-3 gap-2 text-center text-xs">
              <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div class="text-[10px] text-slate-400 font-medium">打鍵速度</div>
                <div class="text-base font-black text-teal-700 font-mono mt-0.5">
                  ${this.state.stats?.cpm || 0} <span class="text-[10px] font-normal">文字/分</span>
                </div>
              </div>

              <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div class="text-[10px] text-slate-400 font-medium">正解率</div>
                <div class="text-base font-black text-emerald-700 font-mono mt-0.5">
                  ${this.state.stats?.accuracy || 100}%
                </div>
              </div>

              <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div class="text-[10px] text-slate-400 font-medium">所要時間</div>
                <div class="text-base font-black text-cyan-700 font-mono mt-0.5">
                  ${this.state.stats?.durationSec || 0} <span class="text-[10px] font-normal">秒</span>
                </div>
              </div>
            </div>

            <!-- 単語振り返りチップ群（タップで保存可能） -->
            <div class="space-y-2 pt-1 border-t border-slate-100">
              <div class="text-[11px] font-bold text-slate-500 flex items-center justify-between">
                <span>📚 例文中の単語（タップして辞書・保存）:</span>
                <span class="text-[10px] text-emerald-600">保存済みは黄色</span>
              </div>
              <div class="flex flex-wrap gap-1.5">
                ${Object.entries(sentence.glossary || {}).map(([raw, info]) => {
                  const isSaved = StorageService.isWordLookedUp(raw) || StorageService.isWordLookedUp(info.dictForm);
                  return `
                    <button type="button" class="btn-review-chip px-2.5 py-1 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                      isSaved 
                        ? 'bg-amber-100 text-amber-900 border-amber-300' 
                        : 'bg-slate-100 hover:bg-teal-50 text-slate-800 border-slate-200'
                    }" data-word="${raw}">
                      <span class="cyrillic-text">${raw}</span>
                      <span class="text-[10px] font-normal opacity-80">${info.meaning.split('、')[0]}</span>
                    </button>
                  `;
                }).join('')}
              </div>
            </div>

            <!-- アクションボタン群 -->
            <div class="pt-2 flex flex-col sm:flex-row items-center gap-2">
              <button type="button" id="btn-next-sentence" class="w-full sm:flex-1 py-3.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-black text-sm rounded-2xl shadow-md hover:shadow-lg transition-all transform active:scale-98 flex items-center justify-center gap-2 cursor-pointer">
                <span>次の文章へ進む (Enter ⏎)</span>
              </button>

              <button type="button" id="btn-retry-sentence" class="w-full sm:w-auto px-4 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-2xl border border-slate-200 transition-colors cursor-pointer">
                もう一度練習 🔄
              </button>
            </div>

          </div>
        ` : ''}

        <!-- モーダル挿入用コンテナ -->
        <div id="typing-modal-container"></div>

      </div>
    `;

    this.bindTypingEvents();

    // フォーカス処理
    if (!isFinished) {
      const input = this.container.querySelector('#typing-input-field');
      if (input) {
        input.focus();
      }
      this.attachKeyListener();
    } else {
      const nextBtn = this.container.querySelector('#btn-next-sentence');
      if (nextBtn) {
        nextBtn.focus();
      }
      this.attachCompletionKeyListener();
    }
  }

  // ==========================================
  // 5. イベント登録・キーストローク処理
  // ==========================================
  static bindTypingEvents() {
    // 戻るボタン
    const backBtn = this.container.querySelector('#btn-back-to-settings');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        this.detachKeyListener();
        this.state.view = 'settings';
        this.renderSettings();
      });
    }

    // 3つのモード自由切り替えボタン
    this.container.querySelectorAll('.btn-switch-typing-mode').forEach(btn => {
      btn.addEventListener('click', () => {
        const newMode = btn.getAttribute('data-mode');
        if (newMode !== this.state.typingMode) {
          this.state.typingMode = newMode;
          this.initSentence(this.state.currentIndex);
          this.renderTyping();
        }
      });
    });

    // 自作文章管理画面へのショートカット
    const customMgrBtn = this.container.querySelector('#btn-switch-to-custom-manager');
    if (customMgrBtn) {
      customMgrBtn.addEventListener('click', () => {
        this.detachKeyListener();
        this.state.view = 'custom_manager';
        this.renderCustomManager();
      });
    }

    // 調べた単語帳ボタン
    const lookupBtn = this.container.querySelector('#btn-open-lookup-from-typing');
    if (lookupBtn) {
      lookupBtn.addEventListener('click', () => {
        this.detachKeyListener();
        this.state.view = 'looked_up_words';
        this.renderLookedUpWords();
      });
    }

    // 文の音声読み上げ
    const speakBtn = this.container.querySelector('#btn-speak-sentence');
    if (speakBtn) {
      speakBtn.addEventListener('click', () => {
        if (this.state.currentSentence) {
          SpeechService.speak(this.state.currentSentence.textMn);
        }
      });
    }

    // 単語タップイベント（本文内）
    this.container.querySelectorAll('.clickable-word').forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const rawWord = el.getAttribute('data-word');
        this.handleWordTap(rawWord, this.state.currentSentence);
      });
    });

    // 完了カード内の単語チップ
    this.container.querySelectorAll('.btn-review-chip').forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const rawWord = el.getAttribute('data-word');
        this.handleWordTap(rawWord, this.state.currentSentence);
      });
    });

    // クイックキリル文字ボタン
    this.container.querySelectorAll('.btn-quick-cyrillic').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const char = btn.getAttribute('data-char');
        this.handleKeyInput(char);
      });
    });

    // タイピングインプットフィールドの入力監視
    const input = this.container.querySelector('#typing-input-field');
    if (input) {
      input.addEventListener('input', (e) => {
        const val = e.target.value;
        if (this.state.typingMode === 'ja') {
          // 日本語入力モード: 入力途中の値判定
          this.checkJapaneseInput(val);
        } else {
          // キリル文字 / なぞり打ちモード: 1文字ずつ判定
          if (val) {
            const lastChar = val[val.length - 1];
            this.handleKeyInput(lastChar);
            input.value = '';
          }
        }
      });

      if (this.state.typingMode === 'ja') {
        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            this.checkJapaneseInput(input.value, true);
          }
        });
      }
    }

    // タイピングゾーンクリックでインプットにフォーカス
    const typingZone = this.container.querySelector('#typing-zone');
    if (typingZone && input) {
      typingZone.addEventListener('click', () => {
        input.focus();
      });
    }

    // 次へボタン
    const nextBtn = this.container.querySelector('#btn-next-sentence');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        this.advanceToNextSentence();
      });
    }

    // リトライボタン
    const retryBtn = this.container.querySelector('#btn-retry-sentence');
    if (retryBtn) {
      retryBtn.addEventListener('click', () => {
        this.initSentence(this.state.currentIndex);
        this.renderTyping();
      });
    }
  }

  // ==========================================
  // 6. 日本語タイピング判定（モードB用）
  // ==========================================
  static checkJapaneseInput(val, isSubmit = false) {
    if (this.state.sentenceFinished || !this.state.currentSentence) return;
    if (!this.state.startTime) this.state.startTime = Date.now();
    this.state.totalKeystrokes++;

    const target = this.state.currentSentence.textJa;
    const clean = (str) => (str || '').toLowerCase().replace(/[、。！？\s\(\)「」『』・.,!?]/g, '');
    const cleanInput = clean(val);
    const cleanTarget = clean(target);

    // 完全一致または句読点除外での一致
    if (cleanInput === cleanTarget || (val.trim() === target.trim())) {
      this.state.typedText = target;
      this.onSentenceCompleted();
    } else if (isSubmit) {
      // Enter押下時で不一致の場合
      this.state.mistakes++;
      this.state.justMistyped = true;
      SoundEffects.playWrong();
      const mistakesEl = this.container?.querySelector('#typing-mistakes-counter');
      if (mistakesEl) mistakesEl.textContent = String(this.state.mistakes);
      const zone = this.container?.querySelector('#typing-zone');
      if (zone) {
        zone.classList.add('border-rose-500');
        setTimeout(() => zone.classList.remove('border-rose-500'), 250);
      }
    }
  }

  // ==========================================
  // 6.5. 打鍵ごとのインプレースDOM更新（チラつき・再描画フラッシュ完全抑止）
  // ==========================================
  static updateTypingDisplayInPlace() {
    const streamEl = this.container?.querySelector('#typing-char-stream');
    const progressEl = this.container?.querySelector('#typing-progress-counter');
    const mistakesEl = this.container?.querySelector('#typing-mistakes-counter');
    const inputEl = this.container?.querySelector('#typing-input-field');

    if (!streamEl) {
      this.renderTyping();
      return;
    }

    const sentence = this.state.currentSentence;
    if (!sentence) return;

    const mode = this.state.typingMode;
    let target = mode === 'ja' ? sentence.textJa : sentence.textMn;
    const typed = this.state.typedText;
    const typedLen = typed.length;
    const targetLen = target.length;

    if (progressEl) {
      progressEl.textContent = `${Math.round((typedLen / Math.max(1, targetLen)) * 100)}%`;
    }
    if (mistakesEl) {
      mistakesEl.textContent = String(this.state.mistakes);
    }
    if (inputEl && mode !== 'ja') {
      inputEl.value = '';
    }

    if (mode === 'trace' || mode === 'mn') {
      const html = Array.from(target).map((char, idx) => {
        const displayChar = char === ' ' ? '&nbsp;' : char;
        if (idx < typedLen) {
          return `<span class="text-emerald-400 font-black bg-emerald-950/70 rounded px-0.5 border-b border-emerald-400">${displayChar}</span>`;
        } else if (idx === typedLen) {
          return `<span class="bg-teal-400 text-slate-950 font-black px-1 rounded underline decoration-2">${displayChar}</span>`;
        } else {
          return `<span class="${mode === 'trace' ? 'text-slate-600 opacity-60' : 'text-slate-500'} font-medium">${displayChar}</span>`;
        }
      }).join('');
      streamEl.innerHTML = html;
    }
  }

  // ==========================================
  // 7. キーストローク処理リスナー（キーボード直接入力）
  // ==========================================
  static attachKeyListener() {
    this.detachKeyListener();

    // 日本語モード時はネイティブIMEに任せるためキーボード全体の乗っ取りリスナーは控える
    if (this.state.typingMode === 'ja') return;

    this.keyListener = (e) => {
      // モーダル表示中は処理しない
      if (this.container && this.container.querySelector('#typing-modal-container .fixed')) {
        return;
      }

      // 特殊キーのスキップ
      if (e.key === 'Shift' || e.key === 'Control' || e.key === 'Alt' || e.key === 'Meta' || e.key === 'Tab') {
        return;
      }

      // バックスペース
      if (e.key === 'Backspace') {
        e.preventDefault();
        if (this.state.pendingBuffer) {
          this.state.pendingBuffer = '';
          return;
        }
        if (this.state.typedText.length > 0) {
          this.state.typedText = this.state.typedText.slice(0, -1);
          this.updateTypingDisplayInPlace();
        }
        return;
      }

      // 通常文字入力
      if (e.key.length === 1) {
        e.preventDefault();
        this.handleKeyInput(e.key);
      }
    };

    window.addEventListener('keydown', this.keyListener);
  }

  static attachCompletionKeyListener() {
    this.detachKeyListener();

    this.keyListener = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.advanceToNextSentence();
      }
    };

    window.addEventListener('keydown', this.keyListener);
  }

  static detachKeyListener() {
    if (this.keyListener) {
      window.removeEventListener('keydown', this.keyListener);
      this.keyListener = null;
    }
  }

  // ==========================================
  // 8. 入力文字の判定とマッチング（英字ローマ字・キリル両対応）
  // ==========================================
  static handleKeyInput(pressedChar) {
    if (this.state.sentenceFinished || !this.state.currentSentence) return;

    if (!this.state.startTime) {
      this.state.startTime = Date.now();
    }
    this.state.totalKeystrokes++;

    const target = this.state.currentSentence.textMn;
    const typedLen = this.state.typedText.length;
    if (typedLen >= target.length) return;

    const expectedChar = target[typedLen];

    const isMatch = this.checkCharMatch(pressedChar, expectedChar);

    if (isMatch) {
      // 正解打鍵
      this.state.typedText += expectedChar;
      this.state.pendingBuffer = '';
      this.state.justMistyped = false;

      // 終了判定
      if (this.state.typedText.length === target.length) {
        this.onSentenceCompleted();
        return;
      }
      this.updateTypingDisplayInPlace();
    } else {
      // ミス打鍵
      this.state.mistakes++;
      this.state.justMistyped = true;
      SoundEffects.playWrong();
      this.updateTypingDisplayInPlace();

      // ミス打鍵表示（DOMを再描画せず、枠線のみ一瞬赤くする）
      const typingZone = this.container?.querySelector('#typing-zone');
      if (typingZone) {
        typingZone.classList.add('border-rose-500');
        setTimeout(() => {
          typingZone.classList.remove('border-rose-500');
        }, 200);
      }
    }
  }

  /**
   * 打鍵された文字が期待される文字と合致するか判定
   */
  static checkCharMatch(pressed, expected) {
    // 1. 完全一致または大文字小文字同一
    if (pressed === expected || pressed.toLowerCase() === expected.toLowerCase()) {
      return true;
    }

    // 2. スペース
    if (expected === ' ' && (pressed === ' ' || pressed === 'Space')) {
      return true;
    }

    // 3. 記号の一致
    const punctuation = [',', '.', '!', '?', '-', '"', "'", ':', ';', '(', ')'];
    if (punctuation.includes(expected) && pressed === expected) {
      return true;
    }

    // 4. 英字キーボード（ローマ字入力）対応
    const p = pressed.toLowerCase();
    const expLower = expected.toLowerCase();

    // ローマ字・キリル対応表
    const LATIN_MAP = {
      'а': ['a'],
      'б': ['b'],
      'в': ['v', 'w'],
      'г': ['g'],
      'д': ['d'],
      'е': ['e', 'ye'],
      'ё': ['yo', 'jo'],
      'ж': ['j', 'zh'],
      'з': ['z'],
      'и': ['i'],
      'й': ['i', 'y', 'j'],
      'к': ['k'],
      'л': ['l'],
      'м': ['m'],
      'н': ['n'],
      'о': ['o'],
      'ө': ['o', 'ö'],
      'п': ['p'],
      'р': ['r'],
      'с': ['s', 'c'],
      'т': ['t'],
      'у': ['u'],
      'ү': ['u', 'ü'],
      'ф': ['f'],
      'х': ['h', 'x', 'kh'],
      'ц': ['c', 'ts'],
      'ч': ['ch'],
      'ш': ['sh'],
      'щ': ['shch'],
      'ъ': ["'"],
      'ы': ['y', 'i'],
      'ь': ["'"],
      'ю': ['yu'],
      'я': ['ya'],
      'э': ['e']
    };

    const allowed = LATIN_MAP[expLower];
    if (allowed) {
      if (allowed.includes(p)) {
        return true;
      }
      // 2文字ローマ字の第1キーバッファ処理 (例: y+a = я, k+h = х, t+s = ц, c+h = ч, s+h = ш)
      if (this.state.pendingBuffer) {
        const combo = (this.state.pendingBuffer + p).toLowerCase();
        if (allowed.includes(combo)) {
          this.state.pendingBuffer = '';
          return true;
        }
      } else {
        // 部分一致でバッファに保持 (例: 'y' for 'ya', 'k' for 'kh', 't' for 'ts', 's' for 'sh')
        const startsWithP = allowed.some(seq => seq.length > 1 && seq.startsWith(p));
        if (startsWithP) {
          this.state.pendingBuffer = p;
          return false;
        }
      }
    }

    return false;
  }

  // ==========================================
  // 9. 一文完了時の処理（重要要件）
  // ==========================================
  static onSentenceCompleted() {
    this.detachKeyListener();
    this.state.sentenceFinished = true;
    this.state.endTime = Date.now();

    // 統計計算
    const durationMs = Math.max(1000, this.state.endTime - (this.state.startTime || (this.state.endTime - 2000)));
    const durationSec = (durationMs / 1000).toFixed(1);
    const charCount = this.state.currentSentence.textMn.length;
    const cpm = Math.round((charCount / (durationMs / 60000)));
    const totalKeys = this.state.totalKeystrokes || charCount;
    const accuracy = Math.max(0, Math.min(100, Math.round(((totalKeys - this.state.mistakes) / totalKeys) * 100)));
    const xp = 25 + (accuracy === 100 ? 10 : 0);

    this.state.stats = {
      cpm,
      accuracy,
      durationSec,
      xp
    };

    // 音声効果 & 文全体の音声読み上げ
    SoundEffects.playCorrect();
    SpeechService.speak(this.state.currentSentence.textMn);

    // XP加算
    // XP加算 (堅牢な安全ガード)
    try {
      if (typeof GamificationService !== 'undefined') {
        if (typeof GamificationService.addXP === 'function') {
          GamificationService.addXP(xp, 'タイピング一文完了');
        } else if (typeof GamificationService.addXp === 'function') {
          GamificationService.addXp(xp);
        }
      }
    } catch (e) {
      console.warn('GamificationService.addXP handled gracefully:', e);
    }

    // 画面再描画（一文完了時和訳カードの表示）
    this.renderTyping();
  }

  static advanceToNextSentence() {
    let nextIdx = this.state.currentIndex + 1;
    if (nextIdx >= this.state.sentences.length) {
      nextIdx = 0; // ループして復習
    }
    this.initSentence(nextIdx);
    this.renderTyping();
  }

  // ==========================================
  // 10. 単語即タップ時の辞書解説 ＆ 「調べた単語」自動保存
  // ==========================================
  static handleWordTap(rawWord, sentence) {
    if (!rawWord || !sentence) return;

    // 辞書・形態素検索
    const wordInfo = findWordInDictionary(rawWord, sentence.glossary);
    if (!wordInfo) return;

    // 「調べた単語」として保存
        // StorageService.saveLookedUpWord(...) // 自動保存停止

    // 発音再生
    SpeechService.speak(wordInfo.dictForm || wordInfo.rawWord);

    // バッジ更新
    const badge = this.container.querySelector('#badge-typing-lookup');
    if (badge) {
      badge.textContent = StorageService.getLookedUpWords().length;
    }

    // モーダル表示
    showUniversalWordModal({ wordInfo, passageTitle: `タイピング: ${sentence.categoryLabel || sentence.level || '自作例文'}` });
  }

  static showWordModal(wordInfo, categoryLabel) {
    const modalContainer = this.container.querySelector('#typing-modal-container');
    if (!modalContainer) return;

    modalContainer.innerHTML = `
      <div class="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-3 animate-fade-in">
        <div class="bg-white rounded-2xl w-full max-w-sm p-5 border border-slate-200 shadow-xl space-y-3.5 relative">
          
          <!-- ヘッダー -->
          <div class="flex items-start justify-between">
            <div>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                ${wordInfo.pos || '単語解説'}
              </span>
              <div class="text-xl sm:text-2xl font-black text-slate-900 cyrillic-text mt-1 flex items-center gap-2">
                <span>${wordInfo.rawWord}</span>
                <button type="button" id="btn-modal-speak" class="p-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-700 text-sm cursor-pointer" title="音声を再生">
                  🔊
                </button>
              </div>
              ${wordInfo.pron ? `<div class="text-xs text-slate-400 font-medium">${wordInfo.pron}</div>` : ''}
            </div>

            <button type="button" id="btn-close-modal" class="text-slate-400 hover:text-slate-600 text-lg p-1 cursor-pointer">
              ✕
            </button>
          </div>

          <!-- 辞書形 ＆ 意味 -->
          <div class="space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
            <div class="flex items-center justify-between">
              <span class="text-slate-500 font-medium">📖 辞書形（基本形）:</span>
              <span class="font-extrabold text-slate-900 cyrillic-text text-sm">${wordInfo.dictForm || wordInfo.rawWord}</span>
            </div>

            <div class="pt-1.5 border-t border-slate-200/60">
              <span class="text-slate-500 font-medium">🇯🇵 日本語の意味:</span>
              <div class="text-sm font-black text-emerald-900 mt-0.5">${wordInfo.meaning}</div>
            </div>

            ${wordInfo.derivation ? `
              <div class="pt-1.5 border-t border-slate-200/60 text-slate-600">
                <span class="text-slate-500 font-medium">🌱 文法・語幹構造:</span>
                <div class="mt-0.5 text-[11px] leading-relaxed">${wordInfo.derivation}</div>
              </div>
            ` : ''}
          </div>

          <!-- 保存通知バッジ -->
          <div class="bg-amber-50 border border-amber-300 rounded-xl p-2.5 flex items-center justify-between text-xs text-amber-900">
            <div class="flex items-center gap-1.5 font-bold">
              <span>📌</span>
              <span>「調べた単語帳」に保存しました！</span>
            </div>
            <button type="button" id="btn-goto-words-from-modal" class="text-[11px] font-extrabold text-amber-800 underline cursor-pointer">
              単語帳を見る
            </button>
          </div>

          <button type="button" id="btn-modal-close-action" class="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs cursor-pointer">
            閉じる
          </button>

        </div>
      </div>
    `;

    // イベント
    const close = () => {
      modalContainer.innerHTML = '';
      this.renderTyping();
    };

    const closeBtn = modalContainer.querySelector('#btn-close-modal');
    if (closeBtn) closeBtn.addEventListener('click', close);

    const closeActionBtn = modalContainer.querySelector('#btn-modal-close-action');
    if (closeActionBtn) closeActionBtn.addEventListener('click', close);

    const speakBtn = modalContainer.querySelector('#btn-modal-speak');
    if (speakBtn) {
      speakBtn.addEventListener('click', () => {
        SpeechService.speak(wordInfo.dictForm || wordInfo.rawWord);
      });
    }

    const gotoWordsBtn = modalContainer.querySelector('#btn-goto-words-from-modal');
    if (gotoWordsBtn) {
      gotoWordsBtn.addEventListener('click', () => {
        close();
        this.detachKeyListener();
        this.state.view = 'looked_up_words';
        this.renderLookedUpWords();
      });
    }
  }

  // ==========================================
  // 11. 「調べた単語帳」一覧ビュー
  // ==========================================
  static renderLookedUpWords() {
    this.detachKeyListener();
    const allWords = StorageService.getLookedUpWords();
    const keyword = (this.state.searchLookupKeyword || '').trim().toLowerCase();

    const filteredWords = allWords.filter(item => {
      if (!keyword) return true;
      return (
        (item.rawWord && item.rawWord.toLowerCase().includes(keyword)) ||
        (item.dictForm && item.dictForm.toLowerCase().includes(keyword)) ||
        (item.meaning && item.meaning.toLowerCase().includes(keyword))
      );
    });

    this.container.innerHTML = `
      <div class="animate-fade-in max-w-2xl mx-auto px-4 py-4 space-y-4">
        
        <!-- ナビゲーションバー -->
        <div class="flex items-center justify-between border-b border-slate-200 pb-3">
          <button type="button" id="btn-back-from-lookup" class="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer">
            <span>←</span> タイピングに戻る
          </button>

          <div class="flex items-center gap-2">
            <span class="text-xs font-extrabold text-amber-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
              📌 調べた単語: ${allWords.length} 語
            </span>
            ${allWords.length > 0 ? `
              <button type="button" id="btn-clear-all-lookup" class="text-[11px] text-rose-600 hover:text-rose-800 font-bold cursor-pointer">
                全消去
              </button>
            ` : ''}
          </div>
        </div>

        <!-- タイトル -->
        <div>
          <h2 class="text-xl font-black text-slate-800 flex items-center gap-2">
            <span>📌</span> 調べた単語帳
          </h2>
          <p class="text-xs text-slate-500">
            タイピングや読解テストでタップして調べた単語がここに自動保存されます。
          </p>
        </div>

        <!-- 検索バー -->
        <div>
          <input 
            type="text" 
            id="input-search-lookup" 
            value="${this.state.searchLookupKeyword || ''}"
            placeholder="単語や日本語の意味で検索..."
            class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        <!-- 単語一覧 -->
        ${filteredWords.length === 0 ? `
          <div class="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-3">
            <div class="text-4xl">📖</div>
            <div class="text-sm font-bold text-slate-700">
              ${keyword ? '検索に一致する単語が見つかりませんでした' : 'まだ調べた単語はありません'}
            </div>
            <p class="text-xs text-slate-400 max-w-sm mx-auto">
              タイピングや読解画面でわからない単語をタップすると、ここに自動で保存されます。
            </p>
          </div>
        ` : `
          <div class="space-y-2">
            ${filteredWords.map(w => `
              <div class="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-all flex items-center justify-between gap-3">
                <div class="space-y-0.5 flex-1 min-w-0">
                  <div class="flex items-center gap-2">
                    <span class="font-black text-slate-900 cyrillic-text text-base">${w.dictForm || w.rawWord}</span>
                    ${w.rawWord && w.dictForm && w.rawWord.toLowerCase() !== w.dictForm.toLowerCase() ? `
                      <span class="text-[10px] text-slate-400">（文中: ${w.rawWord}）</span>
                    ` : ''}
                    ${w.pos ? `<span class="text-[9px] font-bold px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">${w.pos}</span>` : ''}
                  </div>
                  
                  <div class="text-xs font-bold text-emerald-800 truncate">
                    ${w.meaning}
                  </div>

                  ${w.passageTitle ? `
                    <div class="text-[10px] text-slate-400 truncate">
                      出処: ${w.passageTitle}
                    </div>
                  ` : ''}
                </div>

                <div class="flex items-center gap-1.5 shrink-0">
                  <button type="button" class="btn-speak-lookup p-2 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs cursor-pointer" data-word="${w.dictForm || w.rawWord}" title="音声を聴く">
                    🔊
                  </button>
                  <button type="button" class="btn-delete-lookup p-2 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 text-xs cursor-pointer" data-id="${w.id}" title="削除">
                    ✕
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        `}

      </div>
    `;

    this.bindLookedUpWordsEvents();
  }

  static bindLookedUpWordsEvents() {
    const backBtn = this.container.querySelector('#btn-back-from-lookup');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        if (this.state.currentSentence) {
          this.state.view = 'typing';
          this.renderTyping();
        } else {
          this.state.view = 'settings';
          this.renderSettings();
        }
      });
    }

    const searchInput = this.container.querySelector('#input-search-lookup');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.state.searchLookupKeyword = e.target.value;
        this.renderLookedUpWords();
      });
    }

    this.container.querySelectorAll('.btn-speak-lookup').forEach(btn => {
      btn.addEventListener('click', () => {
        const word = btn.getAttribute('data-word');
        SpeechService.speak(word);
      });
    });

    this.container.querySelectorAll('.btn-delete-lookup').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        StorageService.deleteLookedUpWord(id);
        this.renderLookedUpWords();
      });
    });

    const clearBtn = this.container.querySelector('#btn-clear-all-lookup');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (confirm('調べた単語帳をすべて消去しますか？')) {
          StorageService.clearLookedUpWords();
          this.renderLookedUpWords();
        }
      });
    }
  }
}
