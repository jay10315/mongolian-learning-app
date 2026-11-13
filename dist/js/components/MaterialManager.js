// 教材管理・テキスト自動解析・CSV/JSONインポートエクスポートコンポーネント
import { StorageService } from '../services/storage.js';
import { TextParserService } from '../services/parser.js';
import { CyrillicKeyboard } from './CyrillicKeyboard.js';
import { SPECIAL_CYRILLIC_BAR } from '../utils/helpers.js';

// AI登録プロンプト用固定テンプレート
export const AI_WORD_IMPORT_PROMPT = `あなたはモンゴル語学習教材の単語データ作成アシスタントです。

私が送るモンゴル語の教材画像や文章を確認し、登場する単語や表現を抽出してください。

以下のルールを必ず守ってください。

あなたはモンゴル語教育の専門家であり、単語帳データの作成アシスタントです。

私が送るモンゴル語/日本語の単語、文章、教科書の写真、文法リストなどを分析し、学習アプリに登録できる形式に整理してください。

【出力ルール】

1. 必ず以下の形式で出力してください。

日本語: 食べる / モンゴル語: идэх / 語幹: ид

2. 動詞の場合
- 辞書形を記載する。
- 語幹を正確に抽出する。
- 不規則な活用や語幹変化があれば補足する。

3. 名詞の場合
- 日本語の意味とモンゴル語の辞書形を記載する。
- 必要に応じて複数の意味を区別する。

4. 形容詞・副詞の場合
- 基本形を記載する。
- 品詞に応じた正確な日本語訳をつける。

5. 文法表現・助詞・語尾の場合
- 単独の単語と混同しない。
- 文法的な意味と機能を日本語で記載する。
- 必要なら接続条件や例外も補足する。

6. 活用形しか提示されていない場合
- 元の辞書形を特定する。
- 元の語形と活用形を区別する。
- 確実に特定できない場合は推測で補わない。

7. 重複した単語は統合する。ただし、意味や品詞が異なる場合は別々に登録する。

8. 誤字やスペルミスを発見した場合は、正しい形に修正する。ただし、元の形も確認できるようにする。

【重要】
- 出力は必ず1単語につき1行。
- Excelにそのまま貼り付けられる形式にする。
- 説明文や見出しはデータ部分に混ぜない。
- 不明な情報を勝手に作らない。
- モンゴル語の綴り、語幹、意味を厳密に確認する。

【出力形式】
日本語: ○○ / モンゴル語: ○○ / 語幹: ○○

語幹が存在しない品詞は「語幹: なし」としてください。

最後に登録した単語数と、確認が必要な項目を別途報告してください。`;

export class MaterialManagerComponent {
  static state = {
    subTab: 'paste', // 'paste' | 'manual' | 'list' | 'backup'
    parsedPreviewItems: [],
    searchQuery: '',
    selectedCategory: 'all',
    selectedTargetFilter: 'all', // 'all' | 'now' | 'urgent' | 'later'
    defaultBatchTarget: 'now', // 'now' | 'urgent' | 'later' (一括登録時の登録先)
    editingItem: null,
    aiPromptExpanded: true // AIプロンプトエリアの開閉状態
  };

  static render(container, onNavigate) {
    this.container = container;
    this.onNavigate = onNavigate;
    this.renderView();
  }

  static renderView() {
    this.container.innerHTML = `
      <div class="animate-fade-in max-w-4xl mx-auto px-3 sm:px-4 py-4 space-y-5">
        
        <!-- ヘッダー -->
        <div class="flex items-center justify-between border-b border-slate-200 pb-3">
          <div class="flex items-center gap-2">
            <span class="text-2xl">📚</span>
            <div>
              <h2 class="text-base sm:text-lg font-bold text-slate-800">教材の登録・管理</h2>
              <p class="text-xs text-slate-500">登録先（今覚える / すぐ覚える / あとで覚える）の選択、AIプロンプト作成、一括解析</p>
            </div>
          </div>
          <button type="button" id="btn-back-home" class="text-xs font-bold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition active:scale-95 cursor-pointer">
            ✕ ホームへ戻る
          </button>
        </div>

        <!-- 🤖 AIで単語登録用データを作成（常時表示エリア） -->
        <div class="bg-gradient-to-r from-teal-50 via-emerald-50 to-cyan-50 border border-teal-200 rounded-2xl p-4 shadow-2xs space-y-3">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-teal-200/60 pb-2.5">
            <div class="flex items-center gap-2">
              <span class="text-xl">🤖</span>
              <div>
                <h3 class="text-xs sm:text-sm font-black text-teal-950 flex items-center gap-1.5">
                  AIで単語登録用データを作成
                  <span class="text-[10px] bg-teal-600 text-white font-bold px-1.5 py-0.5 rounded">ChatGPT / Claude対応</span>
                </h3>
                <p class="text-[11px] text-teal-800 mt-0.5">
                  教材の写真やテキストをAIに渡す際、以下の指示文をコピーして貼り付けると、アプリにそのまま貼り付けられる形式で単語を抽出してくれます。
                </p>
              </div>
            </div>
            <div class="flex items-center gap-2 shrink-0">
              <button type="button" id="btn-copy-ai-prompt" class="bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-black text-xs px-3.5 py-2 rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer">
                <span id="copy-ai-prompt-icon">📋</span>
                <span id="copy-ai-prompt-text">プロンプトをコピー</span>
              </button>
              <button type="button" id="btn-toggle-ai-prompt" class="text-xs font-bold text-teal-800 hover:text-teal-950 bg-white/80 border border-teal-300 px-2.5 py-2 rounded-xl transition cursor-pointer">
                ${this.state.aiPromptExpanded ? '▲ たたむ' : '▼ 表示する'}
              </button>
            </div>
          </div>

          <!-- アコーディオン本体 -->
          <div id="ai-prompt-content" class="${this.state.aiPromptExpanded ? 'block' : 'hidden'} space-y-2">
            <div class="relative">
              <textarea id="textarea-ai-prompt-readonly" readonly rows="8" class="w-full text-[11px] font-mono leading-relaxed bg-white/90 border border-teal-200 rounded-xl p-3 text-slate-800 focus:outline-hidden select-all resize-y shadow-inner">${AI_WORD_IMPORT_PROMPT}</textarea>
            </div>
            <div class="flex items-center justify-between text-[11px] text-teal-800 font-medium">
              <span>💡 出力された結果（日本語: ○○ / モンゴル語: ○○ / 語幹: ○○）を下記の「テキスト自動解析」に貼り付けてください。</span>
              <span class="text-teal-600 font-bold hidden sm:inline">クリックで全選択可能</span>
            </div>
          </div>
        </div>

        <!-- サブタブ -->
        <div class="flex border-b border-slate-200 text-xs font-bold gap-1 overflow-x-auto scrollbar-none">
          <button type="button" class="subtab-btn px-4 py-2 rounded-t-lg transition-all cursor-pointer ${
            this.state.subTab === 'paste' ? 'bg-white text-emerald-800 border-t-2 border-emerald-600 shadow-2xs font-black' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
          }" data-tab="paste">
            📋 テキスト自動解析・一括登録
          </button>

          <button type="button" class="subtab-btn px-4 py-2 rounded-t-lg transition-all cursor-pointer ${
            this.state.subTab === 'manual' ? 'bg-white text-emerald-800 border-t-2 border-emerald-600 shadow-2xs font-black' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
          }" data-tab="manual">
            ✍️ 単語を手動登録
          </button>

          <button type="button" class="subtab-btn px-4 py-2 rounded-t-lg transition-all cursor-pointer ${
            this.state.subTab === 'list' ? 'bg-white text-emerald-800 border-t-2 border-emerald-600 shadow-2xs font-black' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
          }" data-tab="list">
            📖 登録済み単語一覧・登録先変更
          </button>

          <button type="button" class="subtab-btn px-4 py-2 rounded-t-lg transition-all cursor-pointer ${
            this.state.subTab === 'backup' ? 'bg-white text-emerald-800 border-t-2 border-emerald-600 shadow-2xs font-black' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
          }" data-tab="backup">
            💾 CSV/JSON バックアップ
          </button>
        </div>

        <!-- タブコンテンツ -->
        <div id="tab-content-container">
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

  // ========================================================================
  // 1. テキスト自動解析タブ（一括登録先の選択付き）
  // ========================================================================
  static getPasteHTML() {
    const curTarget = this.state.defaultBatchTarget || 'now';

    return `
      <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div>
          <h3 class="text-sm font-bold text-slate-800 mb-1">表形式やテキストを直接貼り付け</h3>
          <p class="text-xs text-slate-500 leading-relaxed">
            Excelからコピーした表（タブ区切り）、CSV、コロン形式（「日本語: 食べる / モンゴル語: идэх / 語幹: ид」）などを自動判別して教材データに変換します。
          </p>
        </div>

        <div>
          <textarea id="textarea-paste-input" rows="6" 
            class="w-full text-xs font-mono p-3 rounded-xl border border-slate-300 focus:border-emerald-500 focus:outline-hidden text-slate-800" 
            placeholder="例1:&#10;日本語: 食べる / モンゴル語: идэх / 語幹: ид&#10;&#10;例2（タブやハイフン区切り）:&#10;学校	сургууль&#10;本	ном"></textarea>
        </div>

        <div class="flex flex-wrap gap-2 items-center">
          <button type="button" id="btn-parse-text" class="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-xs transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer">
            <span>⚡</span> 自動解析を実行
          </button>
          <button type="button" id="btn-load-sample-text" class="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-all cursor-pointer">
            サンプル貼り付け
          </button>
        </div>

        <!-- プレビューと修正テーブル -->
        ${this.state.parsedPreviewItems.length > 0 ? `
          <div class="space-y-4 pt-3 border-t border-slate-200 animate-fade-in">
            
            <!-- 一括登録先の選択バー -->
            <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-xs font-black text-slate-800 flex items-center gap-1.5">
                  <span>🎯</span> 一括登録先の選択（初期設定：今覚える単語）
                </span>
                <span class="text-xs font-bold text-emerald-700">解析成功: ${this.state.parsedPreviewItems.length} 件</span>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <label class="flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition ${curTarget === 'now' ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold shadow-2xs' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'}">
                  <input type="radio" name="batch-target-choice" value="now" class="accent-emerald-600" ${curTarget === 'now' ? 'checked' : ''}>
                  <div>
                    <div class="font-bold flex items-center gap-1"><span>📚</span> 今覚える単語</div>
                    <div class="text-[10px] text-slate-500">通常の学習・復習対象</div>
                  </div>
                </label>

                <label class="flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition ${curTarget === 'urgent' ? 'bg-amber-50 border-amber-500 text-amber-950 font-bold shadow-2xs' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'}">
                  <input type="radio" name="batch-target-choice" value="urgent" class="accent-amber-600" ${curTarget === 'urgent' ? 'checked' : ''}>
                  <div>
                    <div class="font-bold flex items-center gap-1"><span>⚡</span> すぐ覚える単語</div>
                    <div class="text-[10px] text-slate-500">集中モード最優先枠</div>
                  </div>
                </label>

                <label class="flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition ${curTarget === 'later' ? 'bg-slate-200 border-slate-400 text-slate-900 font-bold shadow-2xs' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'}">
                  <input type="radio" name="batch-target-choice" value="later" class="accent-slate-600" ${curTarget === 'later' ? 'checked' : ''}>
                  <div>
                    <div class="font-bold flex items-center gap-1"><span>⏳</span> あとで覚える単語</div>
                    <div class="text-[10px] text-slate-500">今はまだ学習しない</div>
                  </div>
                </label>
              </div>
            </div>

            <div class="flex items-center justify-between">
              <span class="text-xs text-slate-500">各行の登録先を個別に変更することもできます</span>
              <button type="button" id="btn-commit-batch" class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-xs shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-1.5">
                <span>✓</span> この内容でアプリに一括登録する
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
                    <th class="p-2 w-28">登録先</th>
                    <th class="p-2 w-10">操作</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  ${this.state.parsedPreviewItems.map((item, idx) => {
                    const rowTarget = item.learningTarget || curTarget;
                    return `
                      <tr class="hover:bg-slate-50">
                        <td class="p-1.5"><input type="text" class="preview-edit-field w-full p-1 border rounded text-xs" data-idx="${idx}" data-field="japanese" value="${item.japanese}"></td>
                        <td class="p-1.5"><input type="text" class="preview-edit-field w-full p-1 border rounded text-xs font-mono" data-idx="${idx}" data-field="mongolian" value="${item.mongolian}"></td>
                        <td class="p-1.5"><input type="text" class="preview-edit-field w-full p-1 border rounded text-xs font-mono" data-idx="${idx}" data-field="root" value="${item.root || ''}"></td>
                        <td class="p-1.5"><input type="text" class="preview-edit-field w-full p-1 border rounded text-xs" data-idx="${idx}" data-field="pos" value="${item.pos || ''}"></td>
                        <td class="p-1.5">
                          <select class="preview-target-select w-full p-1 border rounded text-[11px] font-bold ${rowTarget === 'urgent' ? 'bg-amber-50 text-amber-900 border-amber-300' : (rowTarget === 'later' ? 'bg-slate-100 text-slate-700' : 'bg-emerald-50 text-emerald-900 border-emerald-300')}" data-idx="${idx}">
                            <option value="now" ${rowTarget === 'now' ? 'selected' : ''}>今覚える</option>
                            <option value="urgent" ${rowTarget === 'urgent' ? 'selected' : ''}>⚡すぐ覚える</option>
                            <option value="later" ${rowTarget === 'later' ? 'selected' : ''}>⏳あとで</option>
                          </select>
                        </td>
                        <td class="p-1.5 text-center">
                          <button type="button" class="btn-remove-preview-row text-rose-500 hover:text-rose-700 font-bold text-xs cursor-pointer" data-idx="${idx}">✕</button>
                        </td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>

          </div>
        ` : ''}

      </div>
    `;
  }

  // ========================================================================
  // 2. 単語手動登録タブ（登録先3種類選択付き）
  // ========================================================================
  static getManualHTML() {
    return `
      <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
        <h3 class="text-sm font-bold text-slate-800">単語・表現の手動登録</h3>

        <form id="form-manual-add" class="space-y-4">
          
          <!-- 🎯 登録先3種類の選択（初期値：今覚える単語） -->
          <div class="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5">
            <label class="block text-xs font-black text-slate-800 flex items-center gap-1.5">
              <span>🎯</span> 登録先を選択してください <span class="text-rose-500">*</span>
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <label class="flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer bg-white border-slate-200 hover:border-emerald-500">
                <input type="radio" name="manual-target" value="now" checked class="accent-emerald-600">
                <div>
                  <div class="font-bold flex items-center gap-1 text-slate-900"><span>📚</span> 今覚える単語</div>
                  <div class="text-[10px] text-slate-500">通常の学習・復習対象</div>
                </div>
              </label>

              <label class="flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer bg-white border-slate-200 hover:border-amber-500">
                <input type="radio" name="manual-target" value="urgent" class="accent-amber-600">
                <div>
                  <div class="font-bold flex items-center gap-1 text-slate-900"><span>⚡</span> すぐ覚える単語</div>
                  <div class="text-[10px] text-slate-500">集中モード最優先枠</div>
                </div>
              </label>

              <label class="flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer bg-white border-slate-200 hover:border-slate-400">
                <input type="radio" name="manual-target" value="later" class="accent-slate-600">
                <div>
                  <div class="font-bold flex items-center gap-1 text-slate-900"><span>⏳</span> あとで覚える単語</div>
                  <div class="text-[10px] text-slate-500">今はまだ学習しない</div>
                </div>
              </label>
            </div>
          </div>

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
                  <button type="button" class="btn-quick-char-manual px-1.5 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-700 rounded border border-slate-200 cursor-pointer" data-char="${c}">${c}</button>
                `).join('')}
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">語幹（動詞の場合）</label>
              <input type="text" id="manual-root" placeholder="例: ид" class="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:border-emerald-500 focus:outline-hidden">
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">品詞</label>
              <select id="manual-pos" class="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:border-emerald-500 focus:outline-hidden bg-white">
                <option value="動詞">動詞</option>
                <option value="名詞" selected>名詞</option>
                <option value="形容詞">形容詞</option>
                <option value="副詞">副詞</option>
                <option value="数詞">数詞</option>
                <option value="代名詞">代名詞</option>
                <option value="後置詞">後置詞</option>
                <option value="接続詞">接続詞</option>
                <option value="感動詞">感動詞</option>
                <option value="その他">その他</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">カテゴリー / ジャンル</label>
              <input type="text" id="manual-cat" placeholder="例: 食べ物" class="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:border-emerald-500 focus:outline-hidden">
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">解説・文法メモ・例文</label>
            <input type="text" id="manual-note" placeholder="例: 不規則動詞、女性母音" class="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:border-emerald-500 focus:outline-hidden">
          </div>

          <button type="submit" class="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-xs shadow-xs transition-all active:scale-98 cursor-pointer">
            登録する
          </button>
        </form>
      </div>
    `;
  }

  // ========================================================================
  // 3. 登録済み単語一覧タブ（登録先バッジ・切り替え・フィルター付き）
  // ========================================================================
  static getListHTML() {
    const vocabList = StorageService.getAllVocabulary();
    const categories = Array.from(new Set(vocabList.map(v => v.category || 'その他'))).filter(Boolean);

    let displayList = vocabList;

    // 検索フィルター
    if (this.state.searchQuery) {
      const q = this.state.searchQuery.toLowerCase();
      displayList = displayList.filter(v => 
        (v.mongolian && v.mongolian.toLowerCase().includes(q)) || 
        (v.japanese && v.japanese.toLowerCase().includes(q)) ||
        (v.root && v.root.toLowerCase().includes(q))
      );
    }

    // カテゴリーフィルター
    if (this.state.selectedCategory !== 'all') {
      displayList = displayList.filter(v => v.category === this.state.selectedCategory);
    }

    // 登録先フィルター
    if (this.state.selectedTargetFilter !== 'all') {
      displayList = displayList.filter(v => v.learningTarget === this.state.selectedTargetFilter);
    }

    // 各登録先の単語数
    const countNow = vocabList.filter(v => v.learningTarget === 'now').length;
    const countUrgent = vocabList.filter(v => v.learningTarget === 'urgent').length;
    const countLater = vocabList.filter(v => v.learningTarget === 'later').length;

    return `
      <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
        
        <!-- 登録数概要バッジ -->
        <div class="grid grid-cols-3 gap-2 text-xs">
          <div class="p-2.5 rounded-xl border bg-emerald-50/60 border-emerald-200 flex items-center justify-between">
            <span class="font-bold text-emerald-950 flex items-center gap-1"><span>📚</span> 今覚える</span>
            <span class="font-black text-emerald-800 font-mono text-sm">${countNow} 語</span>
          </div>
          <div class="p-2.5 rounded-xl border bg-amber-50/60 border-amber-200 flex items-center justify-between">
            <span class="font-bold text-amber-950 flex items-center gap-1"><span>⚡</span> すぐ覚える</span>
            <span class="font-black text-amber-800 font-mono text-sm">${countUrgent} 語</span>
          </div>
          <div class="p-2.5 rounded-xl border bg-slate-50 border-slate-200 flex items-center justify-between">
            <span class="font-bold text-slate-800 flex items-center gap-1"><span>⏳</span> あとで覚える</span>
            <span class="font-black text-slate-700 font-mono text-sm">${countLater} 語</span>
          </div>
        </div>

        <!-- 検索と絞り込み -->
        <div class="flex flex-col sm:flex-row gap-2">
          <input type="text" id="input-vocab-search" value="${this.state.searchQuery}" placeholder="単語を検索（日本語またはキリル文字）..." class="flex-1 text-xs p-2.5 border border-slate-300 rounded-lg">
          
          <select id="select-vocab-filter-target" class="text-xs p-2.5 border border-slate-300 rounded-lg bg-white font-bold text-slate-800">
            <option value="all" ${this.state.selectedTargetFilter === 'all' ? 'selected' : ''}>すべての登録先 (${vocabList.length})</option>
            <option value="now" ${this.state.selectedTargetFilter === 'now' ? 'selected' : ''}>📚 今覚える単語 (${countNow})</option>
            <option value="urgent" ${this.state.selectedTargetFilter === 'urgent' ? 'selected' : ''}>⚡ すぐ覚える単語 (${countUrgent})</option>
            <option value="later" ${this.state.selectedTargetFilter === 'later' ? 'selected' : ''}>⏳ あとで覚える単語 (${countLater})</option>
          </select>

          <select id="select-vocab-filter-cat" class="text-xs p-2.5 border border-slate-300 rounded-lg bg-white text-slate-700">
            <option value="all">すべてのカテゴリー</option>
            ${categories.map(c => `
              <option value="${c}" ${this.state.selectedCategory === c ? 'selected' : ''}>${c}</option>
            `).join('')}
          </select>
        </div>

        <!-- 一覧テーブル -->
        <div class="overflow-x-auto max-h-96 border border-slate-200 rounded-xl">
          <table class="w-full text-xs text-left">
            <thead class="bg-slate-50 text-slate-600 uppercase border-b border-slate-200 sticky top-0">
              <tr>
                <th class="p-2.5">登録先・変更</th>
                <th class="p-2.5">モンゴル語</th>
                <th class="p-2.5">日本語</th>
                <th class="p-2.5">語幹</th>
                <th class="p-2.5">品詞</th>
                <th class="p-2.5 text-center">操作</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              ${displayList.length === 0 ? `
                <tr>
                  <td colspan="6" class="p-4 text-center text-slate-400">該当する単語はありません</td>
                </tr>
              ` : displayList.map(item => {
                const target = item.learningTarget || (item.textbookStatus === 'later' ? 'later' : 'now');
                return `
                  <tr class="hover:bg-slate-50">
                    <td class="p-2">
                      <select class="select-change-target text-[11px] font-bold p-1 rounded border cursor-pointer ${
                        target === 'urgent' ? 'bg-amber-100 text-amber-900 border-amber-300' :
                        target === 'later' ? 'bg-slate-100 text-slate-700 border-slate-300' :
                        'bg-emerald-100 text-emerald-900 border-emerald-300'
                      }" data-wordid="${item.id}">
                        <option value="now" ${target === 'now' ? 'selected' : ''}>📚 今覚える</option>
                        <option value="urgent" ${target === 'urgent' ? 'selected' : ''}>⚡ すぐ覚える</option>
                        <option value="later" ${target === 'later' ? 'selected' : ''}>⏳ あとで覚える</option>
                      </select>
                    </td>
                    <td class="p-2 font-mono font-bold text-slate-900">${item.mongolian || ''}</td>
                    <td class="p-2 text-slate-700">${item.japanese || ''}</td>
                    <td class="p-2 font-mono text-slate-500">${item.root || item.stem || '—'}</td>
                    <td class="p-2 text-slate-500">${item.pos || '—'}</td>
                    <td class="p-2 text-center">
                      <button type="button" class="btn-delete-item text-rose-500 hover:text-rose-700 font-bold cursor-pointer" data-id="${item.id}" title="削除">
                        🗑️
                      </button>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>

        <div class="text-[11px] text-slate-400 flex items-center justify-between">
          <span>表示中: ${displayList.length} 件 / 全 ${vocabList.length} 語</span>
          <span>登録先を切り替えると即座に各学習枠に反映されます</span>
        </div>

      </div>
    `;
  }

  // ========================================================================
  // 4. バックアップタブ
  // ========================================================================
  static getBackupHTML() {
    return `
      <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div>
          <h3 class="text-sm font-bold text-slate-800 mb-1">データのバックアップ・復元</h3>
          <p class="text-xs text-slate-500">登録した単語データをCSVやJSONでエクスポートして保存できます。</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div class="p-4 border border-slate-200 rounded-xl space-y-2">
            <h4 class="text-xs font-bold text-slate-700">CSV形式でエクスポート</h4>
            <p class="text-[11px] text-slate-500">Excelやスプレッドシートで開いて編集できる形式です。</p>
            <button type="button" id="btn-export-csv" class="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg text-xs transition cursor-pointer">
              📄 CSVをダウンロード
            </button>
          </div>

          <div class="p-4 border border-slate-200 rounded-xl space-y-2">
            <h4 class="text-xs font-bold text-slate-700">JSON形式でエクスポート</h4>
            <p class="text-[11px] text-slate-500">学習進捗を含めた完全バックアップファイルです。</p>
            <button type="button" id="btn-export-json" class="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg text-xs transition cursor-pointer">
              📦 JSONをダウンロード
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // ========================================================================
  // 5. イベントバインド
  // ========================================================================
  static bindEvents() {
    const homeBtn = this.container.querySelector('#btn-back-home');
    if (homeBtn) {
      homeBtn.addEventListener('click', () => {
        if (this.onNavigate) this.onNavigate('home');
      });
    }

    // AIプロンプトのコピー機能
    const copyPromptBtn = this.container.querySelector('#btn-copy-ai-prompt');
    if (copyPromptBtn) {
      copyPromptBtn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(AI_WORD_IMPORT_PROMPT);
          const iconSpan = this.container.querySelector('#copy-ai-prompt-icon');
          const textSpan = this.container.querySelector('#copy-ai-prompt-text');
          if (iconSpan) iconSpan.textContent = '✓';
          if (textSpan) textSpan.textContent = 'コピーしました！';
          copyPromptBtn.classList.remove('bg-teal-600', 'hover:bg-teal-700');
          copyPromptBtn.classList.add('bg-emerald-700');

          setTimeout(() => {
            if (iconSpan) iconSpan.textContent = '📋';
            if (textSpan) textSpan.textContent = 'プロンプトをコピー';
            copyPromptBtn.classList.remove('bg-emerald-700');
            copyPromptBtn.classList.add('bg-teal-600', 'hover:bg-teal-700');
          }, 2000);
        } catch (err) {
          // フォールバック
          const ta = this.container.querySelector('#textarea-ai-prompt-readonly');
          if (ta) {
            ta.select();
            document.execCommand('copy');
            alert('プロンプトをクリップボードにコピーしました！');
          }
        }
      });
    }

    // AIプロンプトの開閉トグル
    const togglePromptBtn = this.container.querySelector('#btn-toggle-ai-prompt');
    if (togglePromptBtn) {
      togglePromptBtn.addEventListener('click', () => {
        this.state.aiPromptExpanded = !this.state.aiPromptExpanded;
        const content = this.container.querySelector('#ai-prompt-content');
        if (content) {
          if (this.state.aiPromptExpanded) {
            content.classList.remove('hidden');
            togglePromptBtn.textContent = '▲ たたむ';
          } else {
            content.classList.add('hidden');
            togglePromptBtn.textContent = '▼ 表示する';
          }
        }
      });
    }

    // サブタブ切り替え
    this.container.querySelectorAll('.subtab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.state.subTab = btn.getAttribute('data-tab');
        this.renderView();
      });
    });

    // --- 自動解析タブの処理 ---
    if (this.state.subTab === 'paste') {
      const parseBtn = this.container.querySelector('#btn-parse-text');
      const sampleBtn = this.container.querySelector('#btn-load-sample-text');
      const textarea = this.container.querySelector('#textarea-paste-input');
      const commitBtn = this.container.querySelector('#btn-commit-batch');

      if (sampleBtn && textarea) {
        sampleBtn.addEventListener('click', () => {
          textarea.value = `日本語: 食べる / モンゴル語: идэх / 語幹: ид\n日本語: 行く / モンゴル語: явах / 語幹: яв\n日本語: 学校 / モンゴル語: сургууль / 語幹: なし\n日本語: 本 / モンゴル語: ном / 語幹: なし`;
        });
      }

      if (parseBtn && textarea) {
        parseBtn.addEventListener('click', () => {
          const raw = textarea.value;
          const parsed = TextParserService.parseRawText(raw);
          if (parsed.length === 0) {
            alert('有効な単語データを抽出できませんでした。テキストの形式をご確認ください。');
            return;
          }
          // 初期ターゲットを一括設定
          this.state.parsedPreviewItems = parsed.map(item => ({
            ...item,
            learningTarget: this.state.defaultBatchTarget || 'now'
          }));
          this.renderView();
        });
      }

      // 一括登録先ラジオボタンの変更
      this.container.querySelectorAll('input[name="batch-target-choice"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
          this.state.defaultBatchTarget = e.target.value;
          // プレビューの全行に反映
          this.state.parsedPreviewItems.forEach(item => {
            item.learningTarget = e.target.value;
          });
          this.renderView();
        });
      });

      // 行ごとの登録先個別セレクト
      this.container.querySelectorAll('.preview-target-select').forEach(sel => {
        sel.addEventListener('change', (e) => {
          const idx = parseInt(sel.getAttribute('data-idx'), 10);
          if (this.state.parsedPreviewItems[idx]) {
            this.state.parsedPreviewItems[idx].learningTarget = e.target.value;
          }
        });
      });

      // プレビューの行削除
      this.container.querySelectorAll('.btn-remove-preview-row').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.getAttribute('data-idx'), 10);
          this.state.parsedPreviewItems.splice(idx, 1);
          this.renderView();
        });
      });

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

      // 一括コミットボタン
      if (commitBtn) {
        commitBtn.addEventListener('click', () => {
          if (this.state.parsedPreviewItems.length === 0) return;
          const count = StorageService.addVocabularyBatch(
            this.state.parsedPreviewItems,
            this.state.defaultBatchTarget || 'now'
          );
          alert(`${count} 件の単語データを一括登録しました！`);
          this.state.parsedPreviewItems = [];
          this.state.subTab = 'list';
          this.renderView();
        });
      }
    }

    // --- 手動登録タブの処理 ---
    if (this.state.subTab === 'manual') {
      const manualForm = this.container.querySelector('#form-manual-add');
      if (manualForm) {
        // キリル文字クイックバー
        this.container.querySelectorAll('.btn-quick-char-manual').forEach(btn => {
          btn.addEventListener('click', () => {
            const char = btn.getAttribute('data-char');
            const input = this.container.querySelector('#manual-mn');
            if (input) {
              input.value += char;
              input.focus();
            }
          });
        });

        manualForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const ja = this.container.querySelector('#manual-ja').value.trim();
          const mn = this.container.querySelector('#manual-mn').value.trim();
          const root = this.container.querySelector('#manual-root').value.trim();
          const pos = this.container.querySelector('#manual-pos').value;
          const cat = this.container.querySelector('#manual-cat').value.trim();
          const note = this.container.querySelector('#manual-note').value.trim();

          // 登録先の取得（初期選択：now）
          const targetRadio = this.container.querySelector('input[name="manual-target"]:checked');
          const target = targetRadio ? targetRadio.value : 'now';

          if (!ja || !mn) {
            alert('日本語とモンゴル語は必須です。');
            return;
          }

          const newItem = {
            japanese: ja,
            mongolian: mn,
            root: root || (pos === '動詞' ? mn.replace(/х$/, '') : ''),
            pos: pos,
            category: cat || '教材登録',
            notes: note,
            explanation: note,
            learningTarget: target
          };

          StorageService.addVocabularyItem(newItem, target);
          alert(`「${mn}（${ja}）」を登録しました！`);
          manualForm.reset();
          this.state.subTab = 'list';
          this.renderView();
        });
      }
    }

    // --- 一覧タブの処理 ---
    if (this.state.subTab === 'list') {
      // 検索入力
      const searchInput = this.container.querySelector('#input-vocab-search');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          this.state.searchQuery = e.target.value;
          this.renderView();
        });
      }

      // 登録先フィルター
      const targetFilterSelect = this.container.querySelector('#select-vocab-filter-target');
      if (targetFilterSelect) {
        targetFilterSelect.addEventListener('change', (e) => {
          this.state.selectedTargetFilter = e.target.value;
          this.renderView();
        });
      }

      // カテゴリーフィルター
      const catSelect = this.container.querySelector('#select-vocab-filter-cat');
      if (catSelect) {
        catSelect.addEventListener('change', (e) => {
          this.state.selectedCategory = e.target.value;
          this.renderView();
        });
      }

      // 単語ごとの登録先変更（ドロップダウン）
      this.container.querySelectorAll('.select-change-target').forEach(sel => {
        sel.addEventListener('change', (e) => {
          const wordId = sel.getAttribute('data-wordid');
          const newTarget = e.target.value;
          if (wordId && newTarget) {
            StorageService.setWordLearningTarget(wordId, newTarget);
            this.renderView();
          }
        });
      });

      // 単語削除
      this.container.querySelectorAll('.btn-delete-item').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          if (id && confirm('この単語を削除しますか？')) {
            StorageService.deleteVocabularyItem(id);
            this.renderView();
          }
        });
      });
    }

    // --- バックアップタブの処理 ---
    if (this.state.subTab === 'backup') {
      const csvBtn = this.container.querySelector('#btn-export-csv');
      if (csvBtn) {
        csvBtn.addEventListener('click', () => {
          StorageService.exportVocabularyCSV();
        });
      }

      const jsonBtn = this.container.querySelector('#btn-export-json');
      if (jsonBtn) {
        jsonBtn.addEventListener('click', () => {
          const data = {
            vocabulary: StorageService.getAllVocabulary(),
            urgentWordIds: StorageService.getUrgentWordIds ? StorageService.getUrgentWordIds() : [],
            exportedAt: new Date().toISOString()
          };
          const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `mongol_app_backup_${new Date().toISOString().slice(0, 10)}.json`;
          a.click();
          URL.revokeObjectURL(url);
        });
      }
    }
  }
}
