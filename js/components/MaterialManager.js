// 教材管理・テキスト自動解析・CSV/JSONインポートエクスポートコンポーネント
import { StorageService } from '../services/storage.js';
import { TextParserService } from '../services/parser.js';
import { CyrillicKeyboard } from './CyrillicKeyboard.js';
import { SPECIAL_CYRILLIC_BAR } from '../utils/helpers.js';

export class MaterialManagerComponent {
  static state = {
    subTab: 'paste', // 'paste' | 'manual' | 'list' | 'backup'
    parsedPreviewItems: [],
    searchQuery: '',
    selectedCategory: 'all',
    editingItem: null
  };

  static render(container, onNavigate) {
    this.container = container;
    this.onNavigate = onNavigate;
    this.renderView();
  }

  static renderView() {
    this.container.innerHTML = `
      <div class="animate-fade-in max-w-3xl mx-auto px-4 py-4 space-y-5">
        
        <!-- ヘッダー -->
        <div class="flex items-center justify-between border-b border-slate-200 pb-3">
          <div class="flex items-center gap-2">
            <span class="text-2xl">📚</span>
            <div>
              <h2 class="text-lg font-bold text-slate-800">教材の登録・管理</h2>
              <p class="text-xs text-slate-500">テキスト貼り付け自動解析、手動追加、CSV/JSONバックアップ</p>
            </div>
          </div>
          <button type="button" id="btn-back-home" class="text-xs text-slate-500 hover:text-slate-800">
            ✕ ホームへ
          </button>
        </div>

        <!-- サブタブ -->
        <div class="flex border-b border-slate-200 text-xs font-bold gap-1 overflow-x-auto scrollbar-none">
          <button type="button" class="subtab-btn px-4 py-2 rounded-t-lg transition-all ${
            this.state.subTab === 'paste' ? 'bg-white text-emerald-800 border-t-2 border-emerald-600 shadow-2xs' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
          }" data-tab="paste">
            📋 テキスト自動解析
          </button>

          <button type="button" class="subtab-btn px-4 py-2 rounded-t-lg transition-all ${
            this.state.subTab === 'manual' ? 'bg-white text-emerald-800 border-t-2 border-emerald-600 shadow-2xs' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
          }" data-tab="manual">
            ✍️ 手動入力
          </button>

          <button type="button" class="subtab-btn px-4 py-2 rounded-t-lg transition-all ${
            this.state.subTab === 'list' ? 'bg-white text-emerald-800 border-t-2 border-emerald-600 shadow-2xs' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
          }" data-tab="list">
            📖 登録教材一覧 (${StorageService.getVocabulary().length}件)
          </button>

          <button type="button" class="subtab-btn px-4 py-2 rounded-t-lg transition-all ${
            this.state.subTab === 'backup' ? 'bg-white text-emerald-800 border-t-2 border-emerald-600 shadow-2xs' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
          }" data-tab="backup">
            💾 バックアップ・復元
          </button>
        </div>

        <!-- タブコンテンツエリア -->
        <div id="material-tab-content">
          ${this.getTabContentHTML()}
        </div>

      </div>
    `;

    this.bindEvents();
  }

  static getTabContentHTML() {
    if (this.state.subTab === 'paste') return this.getPasteHTML();
    if (this.state.subTab === 'manual') return this.getManualHTML();
    if (this.state.subTab === 'list') return this.getListHTML();
    if (this.state.subTab === 'backup') return this.getBackupHTML();
    return '';
  }

  // --- 1. テキスト自動解析タブ ---
  static getPasteHTML() {
    return `
      <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div>
          <h3 class="text-sm font-bold text-slate-800 mb-1">表形式やテキストを直接貼り付け</h3>
          <p class="text-xs text-slate-500 leading-relaxed">
            Excelからコピーした表（タブ区切り）、CSV、コロン形式（「日本語: 食べる / モンゴル語: идэх / 語幹: ид」）などを自動判別して教材データに変換します。解析結果を画面で修正してから登録できます。
          </p>
        </div>

        <div>
          <textarea id="textarea-paste-input" rows="6" 
            class="w-full text-xs font-mono p-3 rounded-xl border border-slate-300 focus:border-emerald-500 focus:outline-hidden text-slate-800" 
            placeholder="例1:&#10;日本語：食べる&#10;モンゴル語：идэх&#10;語幹：ид&#10;&#10;例2（タブやハイフン区切り）:&#10;学校	сургууль&#10;本	ном"></textarea>
        </div>

        <div class="flex gap-2">
          <button type="button" id="btn-parse-text" class="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-xs transition-all active:scale-95 flex items-center gap-1.5">
            <span>⚡</span> 自動解析を実行
          </button>
          <button type="button" id="btn-load-sample-text" class="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-all">
            サンプル貼り付け
          </button>
        </div>

        <!-- プレビューと修正テーブル -->
        <div id="parse-preview-container" class="${this.state.parsedPreviewItems.length > 0 ? 'block' : 'hidden'} space-y-3 pt-3 border-t border-slate-100">
          <div class="flex items-center justify-between">
            <h4 class="text-xs font-bold text-slate-700">解析プレビュー（${this.state.parsedPreviewItems.length}件）</h4>
            <button type="button" id="btn-commit-batch" class="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-xs shadow-md transition-all active:scale-95">
              ✓ この内容でアプリに一括登録する
            </button>
          </div>

          <div class="overflow-x-auto max-h-72 border border-slate-200 rounded-xl">
            <table class="w-full text-xs text-left">
              <thead class="bg-slate-50 text-slate-600 uppercase border-b border-slate-200 sticky top-0">
                <tr>
                  <th class="p-2">日本語</th>
                  <th class="p-2">モンゴル語</th>
                  <th class="p-2">語幹</th>
                  <th class="p-2">品詞</th>
                  <th class="p-2">メモ</th>
                  <th class="p-2 w-10">操作</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                ${this.state.parsedPreviewItems.map((item, idx) => `
                  <tr class="hover:bg-slate-50">
                    <td class="p-1.5"><input type="text" class="preview-edit-field w-full p-1 border rounded text-xs" data-idx="${idx}" data-field="japanese" value="${item.japanese}"></td>
                    <td class="p-1.5"><input type="text" class="preview-edit-field w-full p-1 border rounded text-xs font-bold cyrillic-text" data-idx="${idx}" data-field="mongolian" value="${item.mongolian}"></td>
                    <td class="p-1.5"><input type="text" class="preview-edit-field w-20 p-1 border rounded text-xs cyrillic-text" data-idx="${idx}" data-field="root" value="${item.root || ''}"></td>
                    <td class="p-1.5"><input type="text" class="preview-edit-field w-16 p-1 border rounded text-xs" data-idx="${idx}" data-field="pos" value="${item.pos || ''}"></td>
                    <td class="p-1.5"><input type="text" class="preview-edit-field w-full p-1 border rounded text-xs" data-idx="${idx}" data-field="note" value="${item.note || ''}"></td>
                    <td class="p-1.5 text-center">
                      <button type="button" class="btn-remove-preview-row text-rose-500 hover:text-rose-700 font-bold" data-idx="${idx}">✕</button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  // --- 2. 手動入力タブ ---
  static getManualHTML() {
    return `
      <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
        <h3 class="text-sm font-bold text-slate-800">単語・表現の手動登録</h3>

        <form id="form-manual-add" class="space-y-3">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">日本語 <span class="text-rose-500">*</span></label>
              <input type="text" id="manual-ja" required placeholder="例: 食べる" class="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:border-emerald-500 focus:outline-hidden">
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">モンゴル語（キリル文字） <span class="text-rose-500">*</span></label>
              <input type="text" id="manual-mn" required placeholder="例: идэх" class="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:border-emerald-500 focus:outline-hidden cyrillic-text cyrillic-input" data-cyrillic="true">
              <!-- クイックバー -->
              <div class="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none mt-1">
                ${SPECIAL_CYRILLIC_BAR.slice(0, 8).map(c => `
                  <button type="button" class="btn-quick-char-manual px-1.5 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-700 rounded border border-slate-200" data-char="${c}">${c}</button>
                `).join('')}
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">語幹（動詞の場合）</label>
              <input type="text" id="manual-root" placeholder="例: ид-" class="w-full text-xs p-2.5 border border-slate-300 rounded-lg cyrillic-text cyrillic-input" data-cyrillic="true">
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">品詞</label>
              <select id="manual-pos" class="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white">
                <option value="動詞">動詞</option>
                <option value="名詞">名詞</option>
                <option value="形容詞">形容詞</option>
                <option value="副詞">副詞</option>
                <option value="代名詞">代名詞</option>
                <option value="助詞">助詞</option>
                <option value="あいさつ">あいさつ・表現</option>
                <option value="名詞句">名詞句 / 動詞句</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">カテゴリー</label>
              <input type="text" id="manual-category" placeholder="例: 自作単語 / 日常会話" class="w-full text-xs p-2.5 border border-slate-300 rounded-lg">
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">例文（モンゴル語）</label>
              <input type="text" id="manual-ex-mn" placeholder="例: Би хоол идсэн." class="w-full text-xs p-2.5 border border-slate-300 rounded-lg cyrillic-text cyrillic-input" data-cyrillic="true">
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">例文の日本語訳</label>
              <input type="text" id="manual-ex-ja" placeholder="例: 私はご飯を食べました。" class="w-full text-xs p-2.5 border border-slate-300 rounded-lg">
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">メモ・注意点（格支配や例外）</label>
            <input type="text" id="manual-note" placeholder="例: 過去形は идсэн。女性母音語尾が接続。" class="w-full text-xs p-2.5 border border-slate-300 rounded-lg">
          </div>

          <button type="submit" class="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md transition-all active:scale-95">
            ＋ 教材に登録する
          </button>
        </form>
      </div>
    `;
  }

  // --- 3. 登録教材一覧タブ ---
  static getListHTML() {
    const vocabList = StorageService.getVocabulary();
    const categories = Array.from(new Set(vocabList.map(v => v.category || 'その他'))).filter(Boolean);

    let displayList = vocabList;
    if (this.state.searchQuery) {
      const q = this.state.searchQuery.toLowerCase();
      displayList = displayList.filter(v => 
        (v.mongolian && v.mongolian.toLowerCase().includes(q)) || 
        (v.japanese && v.japanese.toLowerCase().includes(q)) ||
        (v.root && v.root.toLowerCase().includes(q))
      );
    }
    if (this.state.selectedCategory !== 'all') {
      displayList = displayList.filter(v => v.category === this.state.selectedCategory);
    }

    return `
      <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
        <!-- 検索と絞り込み -->
        <div class="flex flex-col sm:flex-row gap-2">
          <input type="text" id="input-vocab-search" value="${this.state.searchQuery}" placeholder="単語を検索（日本語またはキリル文字）..." class="flex-1 text-xs p-2.5 border border-slate-300 rounded-lg">
          <select id="select-vocab-filter-cat" class="text-xs p-2.5 border border-slate-300 rounded-lg bg-white">
            <option value="all">すべてのカテゴリー (${vocabList.length})</option>
            ${categories.map(c => `<option value="${c}" ${this.state.selectedCategory === c ? 'selected' : ''}>${c}</option>`).join('')}
          </select>
        </div>

        <!-- 一覧テーブル（スマホでは見やすいカード形式） -->
        <div class="divide-y divide-slate-100 max-h-96 overflow-y-auto">
          ${displayList.length === 0 ? `
            <div class="text-center py-8 text-xs text-slate-400">見つかりませんでした。</div>
          ` : displayList.map(item => `
            <div class="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50 px-2 rounded-lg transition-colors">
              <div>
                <div class="flex items-center gap-2">
                  <span class="text-base font-bold text-slate-900 cyrillic-text">${item.mongolian}</span>
                  <span class="text-xs font-semibold text-emerald-800">${item.japanese}</span>
                  ${item.pos ? `<span class="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">${item.pos}</span>` : ''}
                </div>
                <div class="text-[11px] text-slate-500 flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5">
                  ${item.root ? `<span>語幹: <span class="font-semibold cyrillic-text text-slate-700">${item.root}</span></span>` : ''}
                  ${item.pronunciation ? `<span>読み: ${item.pronunciation}</span>` : ''}
                  ${item.category ? `<span class="text-slate-400">${item.category}</span>` : ''}
                </div>
                ${item.note ? `<div class="text-[11px] text-slate-600 mt-0.5">💡 ${item.note}</div>` : ''}
              </div>

              <div class="flex items-center gap-1.5 self-end sm:self-center">
                <button type="button" class="btn-delete-item text-xs text-slate-400 hover:text-rose-600 px-2 py-1 rounded" data-id="${item.id}">
                  削除
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // --- 4. バックアップ・復元タブ ---
  static getBackupHTML() {
    return `
      <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-5">
        <div>
          <h3 class="text-sm font-bold text-slate-800 mb-1">データのバックアップ・復元・共有</h3>
          <p class="text-xs text-slate-500 leading-relaxed">
            教材データ、学習履歴、間違いノートをJSONファイルとして保存したり、スマートフォンとPC間で同じ教材を同期できます。また、単語リストをCSVとして出力してExcelで開くことも可能です。
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          
          <!-- JSONバックアップ -->
          <div class="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
            <h4 class="text-xs font-bold text-slate-800 flex items-center gap-1">
              <span>💾</span> 完全バックアップ (JSON)
            </h4>
            <p class="text-[11px] text-slate-500">
              全単語、文法、間違いノート、学習履歴を丸ごと保存します。
            </p>
            <button type="button" id="btn-export-json" class="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold transition-all active:scale-95">
              JSONファイルをダウンロード
            </button>
          </div>

          <!-- CSVエクスポート -->
          <div class="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
            <h4 class="text-xs font-bold text-slate-800 flex items-center gap-1">
              <span>📊</span> 単語リスト出力 (CSV)
            </h4>
            <p class="text-[11px] text-slate-500">
              登録単語一覧をExcel等で編集できるCSV形式で出力します。
            </p>
            <button type="button" id="btn-export-csv" class="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all active:scale-95">
              CSVファイルをダウンロード
            </button>
          </div>

        </div>

        <!-- JSON復元・インポート -->
        <div class="p-4 rounded-xl border border-sky-200 bg-sky-50/50 space-y-2.5">
          <h4 class="text-xs font-bold text-sky-900 flex items-center gap-1">
            <span>📥</span> バックアップファイルから復元
          </h4>
          <p class="text-[11px] text-sky-800">
            保存したJSONファイルを選択して、教材や履歴を復元・同期します。
          </p>
          <input type="file" id="input-import-file" accept=".json" class="text-xs w-full text-slate-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-sky-600 file:text-white hover:file:bg-sky-700 cursor-pointer">
        </div>

        <!-- 初期データリセット -->
        <div class="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span class="text-slate-500 font-medium">全単語（744語）・全文法（48項目）に同期:</span>
          <button type="button" id="btn-reset-default" class="px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg font-bold border border-rose-200 transition-all">
            最新マスターデータに同期
          </button>
        </div>
      </div>
    `;
  }

  // --- イベントバインド ---
  static bindEvents() {
    const homeBtn = this.container.querySelector('#btn-back-home');
    if (homeBtn) {
      homeBtn.addEventListener('click', () => {
        if (this.onNavigate) this.onNavigate('home');
      });
    }

    // サブタブ切り替え
    this.container.querySelectorAll('.subtab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.state.subTab = btn.getAttribute('data-tab');
        this.renderView();
      });
    });

    if (this.state.subTab === 'paste') {
      const parseBtn = this.container.querySelector('#btn-parse-text');
      const sampleBtn = this.container.querySelector('#btn-load-sample-text');
      const textarea = this.container.querySelector('#textarea-paste-input');
      const commitBtn = this.container.querySelector('#btn-commit-batch');

      if (sampleBtn && textarea) {
        sampleBtn.addEventListener('click', () => {
          textarea.value = `日本語：食べる\nモンゴル語：идэх\n語幹：ид\n品詞：動詞\nメモ：女性母音語尾\n\n日本語：行く\nモンゴル語：явах\n語幹：яв\n品詞：動詞\n\n日本語：学校\nモンゴル語：сургууль\n品詞：名詞`;
        });
      }

      if (parseBtn && textarea) {
        parseBtn.addEventListener('click', () => {
          const raw = textarea.value;
          const parsed = TextParserService.parseText(raw);
          if (parsed.length === 0) {
            alert('解析できる単語データが見つかりませんでした。フォーマットを確認してください。');
            return;
          }
          this.state.parsedPreviewItems = parsed;
          this.renderView();
        });
      }

      if (commitBtn) {
        commitBtn.addEventListener('click', () => {
          if (this.state.parsedPreviewItems.length === 0) return;
          const count = StorageService.addVocabularyBatch(this.state.parsedPreviewItems);
          alert(`${count} 件の教材データを一括登録しました！`);
          this.state.parsedPreviewItems = [];
          this.state.subTab = 'list';
          this.renderView();
        });
      }

      // プレビューのインライン編集反映
      this.container.querySelectorAll('.preview-edit-field').forEach(input => {
        input.addEventListener('input', (e) => {
          const idx = parseInt(input.getAttribute('data-idx'), 10);
          const field = input.getAttribute('data-field');
          if (this.state.parsedPreviewItems[idx]) {
            this.state.parsedPreviewItems[idx][field] = e.target.value;
          }
        });
      });

      // 行削除
      this.container.querySelectorAll('.btn-remove-preview-row').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.getAttribute('data-idx'), 10);
          this.state.parsedPreviewItems.splice(idx, 1);
          this.renderView();
        });
      });
    }

    if (this.state.subTab === 'manual') {
      const form = this.container.querySelector('#form-manual-add');
      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const item = {
            japanese: this.container.querySelector('#manual-ja').value.trim(),
            mongolian: this.container.querySelector('#manual-mn').value.trim(),
            root: this.container.querySelector('#manual-root').value.trim(),
            pos: this.container.querySelector('#manual-pos').value,
            category: this.container.querySelector('#manual-category').value.trim() || '自作登録',
            exampleMn: this.container.querySelector('#manual-ex-mn').value.trim(),
            exampleJa: this.container.querySelector('#manual-ex-ja').value.trim(),
            note: this.container.querySelector('#manual-note').value.trim(),
            priority: '★★★'
          };
          StorageService.addVocabularyItem(item);
          alert('単語を登録しました！');
          form.reset();
        });
      }

      this.container.querySelectorAll('.btn-quick-char-manual').forEach(btn => {
        btn.addEventListener('click', () => {
          const char = btn.getAttribute('data-char');
          const mnInput = this.container.querySelector('#manual-mn');
          if (mnInput) {
            CyrillicKeyboard.setActiveInput(mnInput);
            CyrillicKeyboard.insertChar(char);
          }
        });
      });
    }

    if (this.state.subTab === 'list') {
      const searchInput = this.container.querySelector('#input-vocab-search');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          this.state.searchQuery = e.target.value;
          this.renderView();
        });
      }

      const catFilter = this.container.querySelector('#select-vocab-filter-cat');
      if (catFilter) {
        catFilter.addEventListener('change', (e) => {
          this.state.selectedCategory = e.target.value;
          this.renderView();
        });
      }

      this.container.querySelectorAll('.btn-delete-item').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          if (confirm('この単語を削除しますか？')) {
            StorageService.deleteVocabularyItem(id);
            this.renderView();
          }
        });
      });
    }

    if (this.state.subTab === 'backup') {
      // JSONエクスポート
      const exportJsonBtn = this.container.querySelector('#btn-export-json');
      if (exportJsonBtn) {
        exportJsonBtn.addEventListener('click', () => {
          const jsonStr = StorageService.exportAllDataJSON();
          const blob = new Blob([jsonStr], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `mongol_learning_backup_${new Date().toISOString().split('T')[0]}.json`;
          a.click();
          URL.revokeObjectURL(url);
        });
      }

      // CSVエクスポート
      const exportCsvBtn = this.container.querySelector('#btn-export-csv');
      if (exportCsvBtn) {
        exportCsvBtn.addEventListener('click', () => {
          const csvStr = StorageService.exportVocabularyCSV();
          const bom = new Uint8Array([0xEF, 0xBB, 0xBF]); // Excel UTF-8 BOM
          const blob = new Blob([bom, csvStr], { type: 'text/csv;charset=utf-8;' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `mongol_vocabulary_${new Date().toISOString().split('T')[0]}.csv`;
          a.click();
          URL.revokeObjectURL(url);
        });
      }

      // JSON復元
      const fileInput = this.container.querySelector('#input-import-file');
      if (fileInput) {
        fileInput.addEventListener('change', (e) => {
          const file = e.target.files[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = (evt) => {
            const content = evt.target.result;
            const res = StorageService.importAllDataJSON(content);
            if (res.success) {
              alert(`復元が完了しました！（${res.count}件の単語データを復元）`);
              this.renderView();
            } else {
              alert(`復元エラー: ${res.error}`);
            }
          };
          reader.readAsText(file);
        });
      }

      // 初期リセット
      const resetBtn = this.container.querySelector('#btn-reset-default');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          if (confirm('登録データを標準の初期状態に復元しますか？（自作単語は初期化されます）')) {
            StorageService.resetVocabularyToDefault();
            alert('初期データに復元しました。');
            this.renderView();
          }
        });
      }
    }
  }
}
