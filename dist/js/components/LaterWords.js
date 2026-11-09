// 今覚える単語 ＆ あとで覚える単語 総合管理コンポーネント
// 今覚える単語の一覧表示・ワンタップで後で覚えるへ移動、および後で覚える単語からワンタップで今覚えるへ追加
import { StorageService } from '../services/storage.js';
import { SpeechService } from '../services/speech.js';
import { SoundEffects } from '../utils/helpers.js';

export class LaterWordsComponent {
  static currentMode = 'later'; // 'active' (今覚える単語) | 'later' (あとで覚える単語)
  static searchTerm = '';
  static selectedPos = 'all';
  static selectedStatus = 'all'; // 'all' | 'unlearned' | 'learning' | 'retaining' | 'mastered' (active) / 'unadded' | 'added' (later)
  static sortOrder = 'default';  // 'default' | 'ja_asc' | 'mn_asc' | 'pos' | 'srs'

  static render(container, onNavigate, options = {}) {
    if (!container) return;

    if (options && options.mode) {
      this.currentMode = options.mode;
    }

    const activeWords = StorageService.getActiveWords ? StorageService.getActiveWords() : StorageService.getVocabulary();
    const laterWords = StorageService.getLaterWords ? StorageService.getLaterWords() : [];
    const textbookWords = StorageService.getTextbookWords ? StorageService.getTextbookWords() : [];
    const promotedWords = StorageService.getPromotedLaterWords ? StorageService.getPromotedLaterWords() : [];
    const demotedIds = StorageService.getDemotedToLaterWordIds ? StorageService.getDemotedToLaterWordIds() : [];

    const activeCount = activeWords.length;
    const laterCount = laterWords.length;
    const promotedCount = promotedWords.length;
    const textbookCount = textbookWords.length;

    const isActiveMode = (this.currentMode === 'active');

    container.innerHTML = `
      <div class="animate-fade-in space-y-5 max-w-5xl mx-auto px-4 py-4 sm:py-6">
        
        <!-- モード切替タブ（今覚える単語 ↔ あとで覚える単語） -->
        <div class="flex items-center justify-center p-1.5 bg-slate-200/80 dark:bg-slate-800 rounded-2xl max-w-lg mx-auto shadow-inner">
          <button type="button" id="tab-mode-active" class="flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
            isActiveMode 
              ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-sm' 
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }">
            <span class="text-base">📚</span>
            <span>今覚える単語</span>
            <span class="text-[11px] py-0.5 px-2 rounded-full font-bold ${
              isActiveMode ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300' : 'bg-slate-300/60 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
            }">${activeCount}語</span>
          </button>
          
          <button type="button" id="tab-mode-later" class="flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
            !isActiveMode 
              ? 'bg-white dark:bg-slate-900 text-amber-700 dark:text-amber-400 shadow-sm' 
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }">
            <span class="text-base">⏳</span>
            <span>あとで覚える単語</span>
            <span class="text-[11px] py-0.5 px-2 rounded-full font-bold ${
              !isActiveMode ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300' : 'bg-slate-300/60 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
            }">${laterCount}語</span>
          </button>
        </div>

        <!-- ヘッダーバナー -->
        <div class="rounded-3xl p-5 sm:p-7 text-white shadow-lg relative overflow-hidden transition-all ${
          isActiveMode
            ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700'
            : 'bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700'
        }">
          <div class="absolute -right-10 -bottom-10 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

          <div class="relative z-10 space-y-3">
            <div class="flex flex-wrap items-center justify-between gap-3">
              <div class="flex items-center gap-3">
                <span class="text-3xl sm:text-4xl">${isActiveMode ? '📚' : '⏳'}</span>
                <div>
                  <h2 class="text-xl sm:text-2xl font-black tracking-wide leading-tight flex items-center gap-2">
                    ${isActiveMode ? '今覚える単語' : 'あとで覚える単語'}
                    <span class="text-[11px] font-bold bg-white/20 text-white px-2.5 py-0.5 rounded-full border border-white/30">
                      ${isActiveMode ? '正式な登録単語数（全ゲーム出題中）' : '教材未登場の一時保管'}
                    </span>
                  </h2>
                  <p class="text-xs sm:text-sm text-white/90 mt-0.5">
                    ${isActiveMode 
                      ? '現在アプリの単語ゲーム・単語テスト・日本語訳テスト・シャドーイング・忘却曲線に出題されている単語です。' 
                      : '教科書・練習問題集・文法ハンドブック・学習ノートと照合し、将来学習するための一時保管単語です。'}
                  </p>
                </div>
              </div>

              <!-- ホームへ戻るボタン -->
              <button type="button" id="btn-back-home" class="px-3.5 py-2 bg-white/15 hover:bg-white/25 border border-white/30 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer">
                <span>🏠</span>
                <span>ホームへ</span>
              </button>
            </div>

            <!-- 統計バッジ -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
              <div class="bg-black/20 backdrop-blur-xs rounded-2xl p-2.5 border border-white/15">
                <div class="text-[10px] text-white/80 font-bold">📚 正式な登録単語数</div>
                <div class="text-lg font-black mt-0.5 text-white" id="stat-formal-count">${activeCount}<span class="text-xs font-normal ml-0.5">語</span></div>
                <div class="text-[10px] text-emerald-300 font-semibold">全ゲーム・テスト出題</div>
              </div>

              <div class="bg-black/20 backdrop-blur-xs rounded-2xl p-2.5 border border-white/15">
                <div class="text-[10px] text-white/80 font-bold">⏳ あとで覚える単語</div>
                <div class="text-lg font-black mt-0.5 text-white" id="stat-unadded-count">${laterCount}<span class="text-xs font-normal ml-0.5">語</span></div>
                <div class="text-[10px] text-amber-200 opacity-90">一時保管（出題除外）</div>
              </div>

              <div class="bg-black/20 backdrop-blur-xs rounded-2xl p-2.5 border border-white/15">
                <div class="text-[10px] text-white/80 font-bold">🎯 ゲームに追加済み</div>
                <div class="text-lg font-black mt-0.5 text-emerald-300" id="stat-added-count">${promotedCount}<span class="text-xs font-normal ml-0.5">語</span></div>
                <div class="text-[10px] text-white/90">あとで覚えるから昇格</div>
              </div>

              <div class="bg-black/20 backdrop-blur-xs rounded-2xl p-2.5 border border-white/15">
                <div class="text-[10px] text-white/80 font-bold">📖 教科書掲載基本語</div>
                <div class="text-lg font-black mt-0.5 text-white">${textbookCount}<span class="text-xs font-normal ml-0.5">語</span></div>
                <div class="text-[10px] text-white/80">教材で確認済み</div>
              </div>
            </div>

            <!-- 説明ガイド -->
            <div class="text-[11px] sm:text-xs rounded-xl p-2.5 border text-white/95 leading-relaxed ${
              isActiveMode ? 'bg-emerald-900/40 border-emerald-400/30' : 'bg-amber-900/40 border-amber-400/30'
            }">
              ${isActiveMode 
                ? '💡 各単語の<strong>「⏳ 後で覚える単語に移動」</strong>を押すと、ワンタップで出題対象から外して「あとで覚える単語」へ移動できます。いつでも再追加できます。' 
                : '💡 各単語の<strong>「＋ 覚える単語に追加」</strong>を押すと、ワンタップで<strong>すべての既存ゲーム・テストの出題対象に追加</strong>されます。追加後は何度でも削除・再追加できます。'}
            </div>
          </div>
        </div>

        <!-- コントロールバー（検索・フィルター・並び替え） -->
        <div class="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div class="grid grid-cols-1 sm:grid-cols-12 gap-3">
            
            <!-- 検索窓 -->
            <div class="sm:col-span-5 relative">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
              <input type="text" id="input-search-later" placeholder="モンゴル語・日本語で検索..." value="${this.searchTerm}" class="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-hidden focus:border-emerald-500 text-slate-800 dark:text-slate-100 font-medium">
            </div>

            <!-- 品詞フィルター -->
            <div class="sm:col-span-3">
              <select id="select-pos-later" class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-hidden focus:border-emerald-500 text-slate-800 dark:text-slate-100 font-bold">
                <option value="all">品詞: すべて</option>
                <option value="verb" ${this.selectedPos === 'verb' ? 'selected' : ''}>動詞のみ</option>
                <option value="noun" ${this.selectedPos === 'noun' ? 'selected' : ''}>名詞のみ</option>
                <option value="adj" ${this.selectedPos === 'adj' ? 'selected' : ''}>形容詞のみ</option>
                <option value="adv" ${this.selectedPos === 'adv' ? 'selected' : ''}>副詞のみ</option>
                <option value="other" ${this.selectedPos === 'other' ? 'selected' : ''}>あいさつ・その他</option>
              </select>
            </div>

            <!-- 状態フィルター -->
            <div class="sm:col-span-2">
              <select id="select-status-later" class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-hidden focus:border-emerald-500 text-slate-800 dark:text-slate-100 font-bold">
                ${isActiveMode ? `
                  <option value="all" ${this.selectedStatus === 'all' ? 'selected' : ''}>習熟度: すべて</option>
                  <option value="unlearned" ${this.selectedStatus === 'unlearned' ? 'selected' : ''}>未学習 (Lv0)</option>
                  <option value="learning" ${this.selectedStatus === 'learning' ? 'selected' : ''}>初見 (Lv1-2)</option>
                  <option value="retaining" ${this.selectedStatus === 'retaining' ? 'selected' : ''}>定着中 (Lv3-5)</option>
                  <option value="mastered" ${this.selectedStatus === 'mastered' ? 'selected' : ''}>習得済 (Lv6+)</option>
                ` : `
                  <option value="all" ${this.selectedStatus === 'all' ? 'selected' : ''}>分類: すべて</option>
                  <option value="unlisted" ${this.selectedStatus === 'unlisted' ? 'selected' : ''}>教材未登場のみ</option>
                  <option value="demoted" ${this.selectedStatus === 'demoted' ? 'selected' : ''}>今覚えるから移動のみ</option>
                `}
              </select>
            </div>

            <!-- 並び替え -->
            <div class="sm:col-span-2">
              <select id="select-sort-later" class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-hidden focus:border-emerald-500 text-slate-800 dark:text-slate-100 font-bold">
                <option value="default" ${this.sortOrder === 'default' ? 'selected' : ''}>並び順: 標準</option>
                <option value="ja_asc" ${this.sortOrder === 'ja_asc' ? 'selected' : ''}>日本語（五十音）</option>
                <option value="mn_asc" ${this.sortOrder === 'mn_asc' ? 'selected' : ''}>モンゴル語（ABC）</option>
                <option value="pos" ${this.sortOrder === 'pos' ? 'selected' : ''}>品詞順</option>
                ${isActiveMode ? `
                  <option value="srs" ${this.sortOrder === 'srs' ? 'selected' : ''}>習熟度順</option>
                  <option value="risk" ${this.sortOrder === 'risk' ? 'selected' : ''}>忘却リスク順</option>
                ` : `
                  <option value="status" ${this.sortOrder === 'status' ? 'selected' : ''}>追加済み優先</option>
                `}
              </select>
            </div>

          </div>

          <!-- 件数表示 -->
          <div class="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
            <span id="label-filtered-count">表示中: 読み込み中...</span>
            <span class="text-[11px]">※ボタンを1回タップするだけで即座に分類が移動します</span>
          </div>
        </div>

        <!-- 単語カード一覧コンテナ -->
        <div id="later-words-list" class="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          <!-- 動的レンダリング -->
        </div>

      </div>
    `;

    // イベントバインド
    const tabActiveBtn = container.querySelector('#tab-mode-active');
    if (tabActiveBtn) {
      tabActiveBtn.addEventListener('click', () => {
        this.currentMode = 'active';
        this.selectedStatus = 'all';
        this.render(container, onNavigate);
      });
    }

    const tabLaterBtn = container.querySelector('#tab-mode-later');
    if (tabLaterBtn) {
      tabLaterBtn.addEventListener('click', () => {
        this.currentMode = 'later';
        this.selectedStatus = 'all';
        this.render(container, onNavigate);
      });
    }

    const backBtn = container.querySelector('#btn-back-home');
    if (backBtn && onNavigate) {
      backBtn.addEventListener('click', () => onNavigate('home'));
    }

    const searchInput = container.querySelector('#input-search-later');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchTerm = e.target.value;
        this.renderList(container);
      });
    }

    const posSelect = container.querySelector('#select-pos-later');
    if (posSelect) {
      posSelect.addEventListener('change', (e) => {
        this.selectedPos = e.target.value;
        this.renderList(container);
      });
    }

    const statusSelect = container.querySelector('#select-status-later');
    if (statusSelect) {
      statusSelect.addEventListener('change', (e) => {
        this.selectedStatus = e.target.value;
        this.renderList(container);
      });
    }

    const sortSelect = container.querySelector('#select-sort-later');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.sortOrder = e.target.value;
        this.renderList(container);
      });
    }

    this.renderList(container);
  }

  static renderList(container) {
    const listContainer = container.querySelector('#later-words-list');
    const countLabel = container.querySelector('#label-filtered-count');
    if (!listContainer) return;

    const isActiveMode = (this.currentMode === 'active');
    let words = [];

    if (isActiveMode) {
      words = StorageService.getActiveWords ? StorageService.getActiveWords() : StorageService.getVocabulary();
    } else {
      // あとで覚える単語は「今覚える単語」に追加されたらこの一覧からは即座に消去（完全分離）
      words = StorageService.getLaterWords ? StorageService.getLaterWords() : [];
    }

    // 1. 検索フィルター
    if (this.searchTerm && this.searchTerm.trim()) {
      const q = this.searchTerm.trim().toLowerCase();
      words = words.filter(w => 
        (w.mongolian && w.mongolian.toLowerCase().includes(q)) ||
        (w.japanese && w.japanese.toLowerCase().includes(q)) ||
        (w.dictForm && w.dictForm.toLowerCase().includes(q)) ||
        (w.stem && w.stem.toLowerCase().includes(q)) ||
        (w.pos && w.pos.toLowerCase().includes(q))
      );
    }

    // 2. 品詞フィルター
    if (this.selectedPos !== 'all') {
      words = words.filter(w => {
        const p = w.pos || '';
        if (this.selectedPos === 'verb') return w.isVerb || p.includes('動詞');
        if (this.selectedPos === 'noun') return p.includes('名詞');
        if (this.selectedPos === 'adj') return p.includes('形容詞');
        if (this.selectedPos === 'adv') return p.includes('副詞');
        if (this.selectedPos === 'other') return !p.includes('動詞') && !p.includes('名詞') && !p.includes('形容詞') && !p.includes('副詞');
        return true;
      });
    }

    // 3. 状態フィルター
    if (this.selectedStatus !== 'all') {
      if (isActiveMode) {
        if (this.selectedStatus === 'unlearned') words = words.filter(w => (w.srsLevel || 0) === 0);
        else if (this.selectedStatus === 'learning') words = words.filter(w => (w.srsLevel || 0) >= 1 && (w.srsLevel || 0) <= 2);
        else if (this.selectedStatus === 'retaining') words = words.filter(w => (w.srsLevel || 0) >= 3 && (w.srsLevel || 0) <= 5);
        else if (this.selectedStatus === 'mastered') words = words.filter(w => (w.srsLevel || 0) >= 6);
      } else {
        if (this.selectedStatus === 'demoted') words = words.filter(w => w.isDemotedToLater);
        else if (this.selectedStatus === 'unlisted') words = words.filter(w => !w.isDemotedToLater && w.textbookStatus === 'later');
        else if (this.selectedStatus === 'unadded') words = words.filter(w => !w.isActiveLearning);
      }
    }

    // 4. 並び替え
    if (this.sortOrder === 'ja_asc') {
      words.sort((a, b) => (a.japanese || '').localeCompare(b.japanese || '', 'ja'));
    } else if (this.sortOrder === 'mn_asc') {
      words.sort((a, b) => (a.mongolian || '').localeCompare(b.mongolian || ''));
    } else if (this.sortOrder === 'pos') {
      words.sort((a, b) => (a.pos || '').localeCompare(b.pos || ''));
    } else if (this.sortOrder === 'status') {
      words.sort((a, b) => (b.isAddedToLearning ? 1 : 0) - (a.isAddedToLearning ? 1 : 0));
    } else if (this.sortOrder === 'srs') {
      words.sort((a, b) => (b.srsLevel || 0) - (a.srsLevel || 0));
    } else if (this.sortOrder === 'risk') {
      words.sort((a, b) => (b.forgettingRisk || 0) - (a.forgettingRisk || 0));
    }

    if (countLabel) {
      const totalTarget = isActiveMode 
        ? (StorageService.getActiveWords ? StorageService.getActiveWords().length : 0) 
        : (StorageService.getLaterWords ? StorageService.getLaterWords().length : 0);
      countLabel.textContent = `表示中: ${words.length}件 / 全${totalTarget}件`;
    }

    if (words.length === 0) {
      listContainer.className = 'col-span-full py-12 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800';
      listContainer.innerHTML = `
        <div class="text-4xl mb-2">🔍</div>
        <p class="font-bold text-sm text-slate-600 dark:text-slate-300">条件に一致する単語が見つかりませんでした</p>
        <p class="text-xs text-slate-400 mt-1">検索キーワードやフィルターを変更してください</p>
      `;
      return;
    }

    listContainer.className = 'grid grid-cols-1 md:grid-cols-2 gap-3.5';
    listContainer.innerHTML = words.map(w => {
      const isVerb = Boolean(w.isVerb || (w.pos && w.pos.includes('動詞')));
      const isAdded = Boolean(w.isAddedToLearning);
      const isDemoted = Boolean(w.isDemotedToLater);
      const srsLevel = w.srsLevel || 0;

      return `
        <div class="bg-white dark:bg-slate-900 rounded-2xl p-4 border transition-all ${
          isActiveMode
            ? 'border-slate-200 dark:border-slate-800 hover:border-emerald-300 shadow-2xs'
            : (isAdded 
                ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50/20 dark:bg-emerald-950/20 shadow-xs' 
                : 'border-slate-200 dark:border-slate-800 hover:border-amber-300 shadow-2xs')
        } flex flex-col justify-between space-y-3">
          
          <div class="space-y-2">
            <!-- 単語ヘッダー: モンゴル語 ＆ 発音ボタン ＆ バッジ群 -->
            <div class="flex items-start justify-between gap-2">
              <div class="flex items-center gap-2">
                <span class="cyrillic-text font-black text-lg sm:text-xl text-slate-900 dark:text-white leading-tight">
                  ${w.mongolian}
                </span>
                <button type="button" class="btn-play-audio text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 p-1 rounded-lg transition-colors cursor-pointer text-base" data-word="${w.mongolian}" title="音声を聴く">
                  🔊
                </button>
              </div>

              <div class="flex flex-wrap items-center justify-end gap-1.5 shrink-0">
                <span class="px-2 py-0.5 rounded-md text-[11px] font-bold ${
                  isVerb ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-200' :
                  (w.pos && w.pos.includes('形容詞')) ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200' :
                  'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }">
                  ${w.pos || '単語'}
                </span>

                ${isActiveMode ? `
                  <span class="px-2 py-0.5 rounded-md text-[10px] font-black ${
                    srsLevel >= 6 ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                    srsLevel >= 3 ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                    srsLevel >= 1 ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                    'bg-slate-100 text-slate-600'
                  }">
                    Lv.${srsLevel} ${w.masteryLabel || '未学習'}
                  </span>
                ` : (isAdded ? `
                  <span class="px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 flex items-center gap-1">
                    <span>✓</span><span>出題中</span>
                  </span>
                ` : '')}
              </div>
            </div>

            <!-- 日本語訳 -->
            <div class="text-sm font-black text-slate-800 dark:text-slate-100">
              ${w.japanese}
            </div>

            <!-- 動詞情報（語幹と辞書形） -->
            ${isVerb ? `
              <div class="bg-indigo-50/70 dark:bg-indigo-950/40 rounded-xl p-2.5 border border-indigo-100 dark:border-indigo-900/50 text-xs space-y-1">
                <div class="font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1 text-[11px]">
                  <span>⚡</span><span>動詞情報:</span>
                </div>
                <div class="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span class="text-slate-400">語幹:</span>
                    <strong class="cyrillic-text font-black text-indigo-950 dark:text-indigo-100 ml-1">${w.stem || '-'}</strong>
                  </div>
                  <div>
                    <span class="text-slate-400">辞書形:</span>
                    <strong class="cyrillic-text font-black text-indigo-950 dark:text-indigo-100 ml-1">${w.dictForm || w.mongolian}</strong>
                  </div>
                </div>
              </div>
            ` : ''}

            <!-- 例文（あれば表示） -->
            ${w.exampleMn ? `
              <div class="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-2 text-xs space-y-0.5 border border-slate-100 dark:border-slate-800">
                <div class="cyrillic-text text-slate-700 dark:text-slate-300 font-semibold text-[11px]">${w.exampleMn}</div>
                <div class="text-slate-500 dark:text-slate-400 text-[10px]">${w.exampleJa || ''}</div>
              </div>
            ` : ''}

            <!-- 未掲載理由（あとで覚える単語の場合） -->
            ${!isActiveMode ? `
              <div class="text-[11px] text-slate-500 dark:text-slate-400 bg-amber-50/60 dark:bg-amber-950/30 p-2 rounded-xl border border-amber-100 dark:border-amber-900/40">
                <span class="text-slate-400 font-bold">未掲載理由:</span>
                <span class="text-amber-800 dark:text-amber-300 font-medium ml-1">${w.laterReason || '全教材：未登場（一時保管）'}</span>
              </div>
            ` : ''}

            <!-- 登場教材・確認状況 -->
            <div class="bg-slate-50/80 dark:bg-slate-800/40 rounded-xl p-2 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
              <span class="text-slate-400">確認状況:</span>
              <span class="font-bold ${w.textbookStatus === 'textbook' ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'}">
                ${w.textbookStatus === 'textbook' ? '📖 教科書・学習ノート・Eラーニング登場' : '⏳ 教材未掲載（一時保管）'}
              </span>
            </div>
          </div>

          <!-- アクションボタンエリア -->
          <div class="pt-2 border-t border-slate-100 dark:border-slate-800">
            ${isActiveMode ? `
              <!-- 今覚える単語 → 後で覚える単語へワンタップ移動 -->
              <button type="button" class="btn-move-to-later w-full py-2.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/50 dark:hover:bg-amber-900/70 border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200 font-black text-xs transition-all flex items-center justify-center gap-1.5 shadow-2xs active:scale-98 cursor-pointer" data-id="${w.id}">
                <span>⏳</span>
                <span>後で覚える単語に移動</span>
              </button>
            ` : `
              <!-- 覚える単語に追加（押すと今覚える単語へ移動し、この一覧からは即座に消去） -->
              <button type="button" class="btn-toggle-add w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-98 cursor-pointer" data-id="${w.id}" data-action="add">
                <span>＋</span>
                <span>覚える単語に追加</span>
              </button>
              <!-- 追加済み（ゲーム出題中）の場合は「今覚える単語」へ即座に移動します。移動後は「今覚える単語」からいつでも✕ 削除・後で覚えるへ戻せます -->
            `}
          </div>

        </div>
      `;
    }).join('');

    // 音声再生ボタンのイベント
    listContainer.querySelectorAll('.btn-play-audio').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const word = btn.dataset.word;
        if (word && typeof SpeechService !== 'undefined') {
          SpeechService.speak(word);
        }
      });
    });

    // 「後で覚える単語に移動」ボタンのイベント
    listContainer.querySelectorAll('.btn-move-to-later').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const wordId = btn.dataset.id;
        const targetWord = words.find(w => w.id === wordId) || StorageService.getAllVocabulary().find(w => w.id === wordId);

        StorageService.moveWordToLater(wordId);
        if (typeof SoundEffects !== 'undefined' && SoundEffects.playClick) {
          SoundEffects.playClick();
        }
        this.showToast(`「${targetWord ? targetWord.mongolian : '単語'}」を後で覚える単語に移動しました（全ゲーム・出題から除外）`);

        this.updateHeaderStats(container);
        this.renderList(container);
      });
    });

    // 「覚える単語に追加」/「削除」ボタンのイベント
    listContainer.querySelectorAll('.btn-toggle-add').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const wordId = btn.dataset.id;
        const action = btn.dataset.action;
        const targetWord = words.find(w => w.id === wordId) || StorageService.getAllVocabulary().find(w => w.id === wordId);

        if (action === 'add') {
          StorageService.moveWordToActive(wordId);
          if (typeof SoundEffects !== 'undefined' && SoundEffects.playSuccess) {
            SoundEffects.playSuccess();
          }
          this.showToast(`「${targetWord ? targetWord.mongolian : '単語'}」を覚える単語に追加しました！全ゲーム・テストに出題されます。`);
        } else {
          StorageService.moveWordToLater(wordId);
          if (typeof SoundEffects !== 'undefined' && SoundEffects.playClick) {
            SoundEffects.playClick();
          }
          this.showToast(`「${targetWord ? targetWord.mongolian : '単語'}」を出題対象から外し、「あとで覚える単語」に戻しました。`);
        }

        this.updateHeaderStats(container);
        this.renderList(container);
      });
    });
  }

  static updateHeaderStats(container) {
    const activeWords = StorageService.getActiveWords ? StorageService.getActiveWords() : StorageService.getVocabulary();
    const laterWords = StorageService.getLaterWords ? StorageService.getLaterWords() : [];
    const promotedWords = StorageService.getPromotedLaterWords ? StorageService.getPromotedLaterWords() : [];

    const activeCount = activeWords.length;
    const laterCount = laterWords.length;
    const promotedCount = promotedWords.length;

    const statFormal = container.querySelector('#stat-formal-count');
    if (statFormal) statFormal.innerHTML = `${activeCount}<span class="text-xs font-normal ml-0.5">語</span>`;

    const statUnadded = container.querySelector('#stat-unadded-count');
    if (statUnadded) statUnadded.innerHTML = `${laterCount}<span class="text-xs font-normal ml-0.5">語</span>`;

    const statAdded = container.querySelector('#stat-added-count');
    if (statAdded) statAdded.innerHTML = `${promotedCount}<span class="text-xs font-normal ml-0.5">語</span>`;

    const tabActiveBadge = container.querySelector('#tab-mode-active span:last-child');
    if (tabActiveBadge) tabActiveBadge.textContent = `${activeCount}語`;

    const tabLaterBadge = container.querySelector('#tab-mode-later span:last-child');
    if (tabLaterBadge) tabLaterBadge.textContent = `${laterCount}語`;
  }

  static showToast(message) {
    let toast = document.getElementById('later-words-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'later-words-toast';
      document.body.appendChild(toast);
    }
    toast.className = 'fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-white px-4 py-2.5 rounded-2xl shadow-xl text-xs font-bold border border-slate-700 flex items-center gap-2 animate-fade-in';
    toast.innerHTML = `<span>🎯</span><span>${message}</span>`;
    setTimeout(() => {
      if (toast && toast.parentElement) {
        toast.style.transition = 'opacity 0.4s ease';
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 400);
      }
    }, 2800);
  }
}

if (typeof window !== 'undefined') {
  window.LaterWordsComponent = LaterWordsComponent;
}
