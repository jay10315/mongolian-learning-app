// あとで覚える単語専用コンポーネント
// 教科書・学習ノートに未掲載の語彙を分類・管理・ワンタップでゲーム・テストに追加/削除
import { StorageService } from '../services/storage.js';
import { SpeechService } from '../services/speech.js';
import { SoundEffects } from '../utils/helpers.js';

export class LaterWordsComponent {
  static searchTerm = '';
  static selectedPos = 'all';
  static selectedStatus = 'unadded'; // 'all' | 'unadded' | 'added'
  static sortOrder = 'default';  // 'default' | 'ja_asc' | 'mn_asc' | 'pos' | 'status'

  static render(container, onNavigate) {
    if (!container) return;

    // includeAdded: true で全件取得して統計計算
    const allLaterWordsTotal = StorageService.getLaterWords ? StorageService.getLaterWords({ includeAdded: true }) : [];
    const unaddedLaterWords = StorageService.getLaterWords ? StorageService.getLaterWords() : [];
    const textbookWords = StorageService.getTextbookWords ? StorageService.getTextbookWords() : [];
    const promotedWords = StorageService.getPromotedLaterWords ? StorageService.getPromotedLaterWords() : [];
    const addedCount = promotedWords.length;
    const unaddedCount = unaddedLaterWords.length;
    const formalLearningCount = StorageService.getVocabulary ? StorageService.getVocabulary().length : (textbookWords.length + addedCount);

    container.innerHTML = `
      <div class="animate-fade-in space-y-6 max-w-5xl mx-auto px-4 py-4 sm:py-6">
        
        <!-- ヘッダーバナー -->
        <div class="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 rounded-3xl p-5 sm:p-7 text-white shadow-lg relative overflow-hidden">
          <div class="absolute -right-10 -bottom-10 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

          <div class="relative z-10 space-y-3">
            <div class="flex flex-wrap items-center justify-between gap-3">
              <div class="flex items-center gap-3">
                <span class="text-3xl sm:text-4xl">⏳</span>
                <div>
                  <h2 class="text-xl sm:text-2xl font-black tracking-wide leading-tight flex items-center gap-2">
                    あとで覚える単語
                    <span class="text-[11px] font-bold bg-white/20 text-white px-2.5 py-0.5 rounded-full border border-white/30">
                      教材未登場の語彙
                    </span>
                  </h2>
                  <p class="text-xs sm:text-sm text-amber-100 mt-0.5">
                    教科書・練習問題集・文法ハンドブック・学習ノートと照合し、辞書形での登場実績が確認されなかった単語を分類
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
                <div class="text-[10px] text-amber-200 font-bold">📚 正式な登録単語数</div>
                <div class="text-lg font-black mt-0.5 text-white" id="stat-formal-count">${formalLearningCount}<span class="text-xs font-normal ml-0.5">語</span></div>
                <div class="text-[10px] text-emerald-300 font-semibold">全ゲーム・テスト出題</div>
              </div>

              <div class="bg-black/20 backdrop-blur-xs rounded-2xl p-2.5 border border-white/15">
                <div class="text-[10px] text-amber-200 font-bold">⏳ あとで覚える単語</div>
                <div class="text-lg font-black mt-0.5 text-white" id="stat-unadded-count">${unaddedCount}<span class="text-xs font-normal ml-0.5">語</span></div>
                <div class="text-[10px] text-amber-200 opacity-90">一時保管（出題除外）</div>
              </div>

              <div class="bg-black/20 backdrop-blur-xs rounded-2xl p-2.5 border border-white/15">
                <div class="text-[10px] text-amber-200 font-bold">🎯 ゲームに追加済み</div>
                <div class="text-lg font-black mt-0.5 text-emerald-300" id="stat-added-count">${addedCount}<span class="text-xs font-normal ml-0.5">語</span></div>
                <div class="text-[10px] text-amber-100 opacity-90">あとで覚えるから昇格</div>
              </div>

              <div class="bg-black/20 backdrop-blur-xs rounded-2xl p-2.5 border border-white/15">
                <div class="text-[10px] text-amber-200 font-bold">📖 教科書掲載基本語</div>
                <div class="text-lg font-black mt-0.5 text-white">${textbookWords.length}<span class="text-xs font-normal ml-0.5">語</span></div>
                <div class="text-[10px] text-amber-100 opacity-80">教材で確認済み</div>
              </div>
            </div>

            <!-- 説明ガイド -->
            <div class="text-[11px] sm:text-xs bg-amber-900/40 rounded-xl p-2.5 border border-amber-400/30 text-amber-100 leading-relaxed">
              💡 各単語の<strong>「＋ 覚える単語に追加」</strong>を押すと、単語ゲーム・単語テスト・日本語訳テスト・リスニング・読解・タイピングなど<strong>すべての既存ゲームの出題対象に即座に追加</strong>されます。追加後は何度でも削除・再追加できます。
            </div>
          </div>
        </div>

        <!-- コントロールバー（検索・フィルター・並び替え） -->
        <div class="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div class="grid grid-cols-1 sm:grid-cols-12 gap-3">
            
            <!-- 検索窓 -->
            <div class="sm:col-span-5 relative">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
              <input type="text" id="input-search-later" placeholder="モンゴル語・日本語で検索..." value="${this.searchTerm}" class="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-hidden focus:border-amber-500 text-slate-800 dark:text-slate-100 font-medium">
            </div>

            <!-- 品詞フィルター -->
            <div class="sm:col-span-3">
              <select id="select-pos-later" class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-hidden focus:border-amber-500 text-slate-800 dark:text-slate-100 font-bold">
                <option value="all">品詞: すべて</option>
                <option value="verb" ${this.selectedPos === 'verb' ? 'selected' : ''}>動詞のみ</option>
                <option value="noun" ${this.selectedPos === 'noun' ? 'selected' : ''}>名詞のみ</option>
                <option value="adj" ${this.selectedPos === 'adj' ? 'selected' : ''}>形容詞のみ</option>
                <option value="adv" ${this.selectedPos === 'adv' ? 'selected' : ''}>副詞のみ</option>
                <option value="other" ${this.selectedPos === 'other' ? 'selected' : ''}>あいさつ・その他</option>
              </select>
            </div>

            <!-- 追加状態フィルター -->
            <div class="sm:col-span-2">
              <select id="select-status-later" class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-hidden focus:border-amber-500 text-slate-800 dark:text-slate-100 font-bold">
                <option value="all">状態: すべて</option>
                <option value="unadded" ${this.selectedStatus === 'unadded' ? 'selected' : ''}>未追加のみ</option>
                <option value="added" ${this.selectedStatus === 'added' ? 'selected' : ''}>追加済みのみ</option>
              </select>
            </div>

            <!-- 並び替え -->
            <div class="sm:col-span-2">
              <select id="select-sort-later" class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-hidden focus:border-amber-500 text-slate-800 dark:text-slate-100 font-bold">
                <option value="default" ${this.sortOrder === 'default' ? 'selected' : ''}>並び順: 標準</option>
                <option value="ja_asc" ${this.sortOrder === 'ja_asc' ? 'selected' : ''}>日本語（五十音）</option>
                <option value="mn_asc" ${this.sortOrder === 'mn_asc' ? 'selected' : ''}>モンゴル語（ABC）</option>
                <option value="pos" ${this.sortOrder === 'pos' ? 'selected' : ''}>品詞順</option>
                <option value="status" ${this.sortOrder === 'status' ? 'selected' : ''}>追加済み優先</option>
              </select>
            </div>

          </div>

          <!-- 件数表示 -->
          <div class="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
            <span id="label-filtered-count">表示中: 読み込み中...</span>
            <span class="text-[11px]">※追加した単語は自動で全端末にクラウド同期されます</span>
          </div>
        </div>

        <!-- 単語カード一覧コンテナ -->
        <div id="later-words-list" class="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          <!-- 動的レンダリング -->
        </div>

      </div>
    `;

    // イベントバインド
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

    // 「すべて」または「追加済みのみ」選択時は追加済みも含めて取得
    const includeAdded = (this.selectedStatus === 'all' || this.selectedStatus === 'added');
    let words = StorageService.getLaterWords ? StorageService.getLaterWords({ includeAdded }) : [];

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

    // 3. 追加状態フィルター
    if (this.selectedStatus !== 'all') {
      if (this.selectedStatus === 'added') {
        words = words.filter(w => w.isAddedToLearning);
      } else if (this.selectedStatus === 'unadded') {
        words = words.filter(w => !w.isAddedToLearning);
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
    }

    if (countLabel) {
      const totalTarget = (this.selectedStatus === 'added') ? StorageService.getPromotedLaterWords().length : (this.selectedStatus === 'unadded' ? StorageService.getLaterWords().length : StorageService.getLaterWords({ includeAdded: true }).length);
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
      const isAdded = Boolean(w.isAddedToLearning);
      const isVerb = Boolean(w.isVerb || (w.pos && w.pos.includes('動詞')));

      return `
        <div class="bg-white dark:bg-slate-900 rounded-2xl p-4 border transition-all ${
          isAdded 
            ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50/20 dark:bg-emerald-950/20 shadow-xs' 
            : 'border-slate-200 dark:border-slate-800 hover:border-amber-300 shadow-2xs'
        } flex flex-col justify-between space-y-3">
          
          <div class="space-y-2">
            <!-- 単語ヘッダー: モンゴル語 ＆ 発音ボタン ＆ 品詞バッジ -->
            <div class="flex items-start justify-between gap-2">
              <div class="flex items-center gap-2">
                <span class="cyrillic-text font-black text-lg sm:text-xl text-slate-900 dark:text-white leading-tight">
                  ${w.mongolian}
                </span>
                <button type="button" class="btn-play-audio text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 p-1 rounded-lg transition-colors cursor-pointer text-base" data-word="${w.mongolian}" title="音声を聴く">
                  🔊
                </button>
              </div>

              <div class="flex items-center gap-1.5 shrink-0">
                <span class="px-2 py-0.5 rounded-md text-[11px] font-bold ${
                  isVerb ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-200' :
                  (w.pos && w.pos.includes('形容詞')) ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200' :
                  'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }">
                  ${w.pos || '単語'}
                </span>

                ${isAdded ? `
                  <span class="px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 flex items-center gap-1">
                    <span>✓</span><span>出題中</span>
                  </span>
                ` : ''}
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

            <!-- 理由 ＆ 教材確認状況カード -->
            <div class="bg-amber-50/60 dark:bg-amber-950/30 rounded-xl p-2.5 border border-amber-200/80 dark:border-amber-900/50 text-[11px] space-y-1.5">
              <div class="flex items-center gap-1 font-bold text-amber-900 dark:text-amber-200">
                <span>⚠️</span>
                <span>未掲載理由:</span>
              </div>
              <p class="text-amber-800 dark:text-amber-300/90 leading-tight">
                ${w.laterReason || '教科書・練習問題集・学習ノートに未掲載（辞書形での登場実績なし）'}
              </p>
              <div class="pt-1 border-t border-amber-200/60 dark:border-amber-900/40 text-[10px] text-amber-900/80 dark:text-amber-300/70 flex items-center gap-1">
                <span class="font-bold">確認状況:</span>
                <span>全5教材 照合済み（未登場）</span>
              </div>
            </div>
          </div>

          <!-- アクションボタンエリア -->
          <div class="pt-2 border-t border-slate-100 dark:border-slate-800">
            ${isAdded ? `
              <div class="flex items-center gap-2">
                <button type="button" class="btn-toggle-add flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer" data-id="${w.id}" data-action="remove">
                  <span>✓</span>
                  <span>追加済み（ゲーム出題中）</span>
                </button>
                <button type="button" class="btn-toggle-add py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950 dark:hover:bg-rose-900 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800 font-bold text-xs transition-all cursor-pointer" data-id="${w.id}" data-action="remove" title="ゲーム出題から除外">
                  <span>✕ 削除</span>
                </button>
              </div>
            ` : `
              <button type="button" class="btn-toggle-add w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-98 cursor-pointer" data-id="${w.id}" data-action="add">
                <span>＋</span>
                <span>覚える単語に追加</span>
              </button>
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

    // 追加・削除ボタンのイベント
    listContainer.querySelectorAll('.btn-toggle-add').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const wordId = btn.dataset.id;
        const action = btn.dataset.action;
        const targetWord = words.find(w => w.id === wordId) || StorageService.getAllVocabulary().find(w => w.id === wordId);

        if (action === 'add') {
          StorageService.addWordToActiveLearning(wordId);
          if (typeof SoundEffects !== 'undefined' && SoundEffects.playSuccess) {
            SoundEffects.playSuccess();
          }
          this.showToast(`「${targetWord ? targetWord.mongolian : '単語'}」を覚える単語に追加しました！登録単語数に反映され、全ゲームに出題されます。`);
        } else {
          StorageService.removeWordFromActiveLearning(wordId);
          if (typeof SoundEffects !== 'undefined' && SoundEffects.playClick) {
            SoundEffects.playClick();
          }
          this.showToast(`「${targetWord ? targetWord.mongolian : '単語'}」を出題対象から外し、「あとで覚える単語」に戻しました。`);
        }

        // バナーの統計カウントを即時更新
        this.updateHeaderStats(container);
        this.renderList(container);
      });
    });
  }

  static updateHeaderStats(container) {
    const allLater = StorageService.getLaterWords();
    const textbook = StorageService.getTextbookWords();
    const addedCount = allLater.filter(w => w.isAddedToLearning).length;
    const activeTestCount = textbook.length + addedCount;

    const statAdded = container.querySelector('#stat-added-count');
    if (statAdded) statAdded.innerHTML = `${addedCount}<span class="text-xs font-normal ml-0.5">語</span>`;

    const statTotal = container.querySelector('#stat-total-test-count');
    if (statTotal) statTotal.innerHTML = `${activeTestCount}<span class="text-xs font-normal ml-0.5">語</span>`;
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
