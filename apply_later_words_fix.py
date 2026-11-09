import sys, os, re

sys.stdout.reconfigure(encoding='utf-8')
base_dir = r"C:\Users\kkaho\.gemini\antigravity\scratch\mongol-learning-app"
os.chdir(base_dir)

print("Starting LaterWordsComponent and Word Separation patch...")

# ===========================================================================
# 1. Patch js/services/storage.js
# ===========================================================================
storage_p = 'js/services/storage.js'
with open(storage_p, 'r', encoding='utf-8') as f:
    storage_code = f.read()

# Update getVocabulary, getTextbookWords, getLaterWords, getPromotedLaterWords
old_methods_block = """  static getVocabulary(options = {}) {
    const all = this.getAllVocabulary();
    if (options && options.includeAll) {
      return all;
    }
    return all.filter(item => item.textbookStatus === 'textbook' || item.isAddedToLearning);
  }

  /**
   * 教科書・学習ノートに登場した単語のみ取得 (1,079語)
   */
  static getTextbookWords() {
    return this.getAllVocabulary().filter(item => item.textbookStatus === 'textbook');
  }

  /**
   * 教科書・学習ノートに未登場の単語（あとで覚える単語）のみ取得 (360語)
   */
  static getLaterWords() {
    return this.getAllVocabulary().filter(item => item.textbookStatus === 'later');
  }"""

new_methods_block = """  /**
   * 正式な学習対象単語を取得（教科書掲載単語 ＋ 「あとで覚える単語」から正式追加した単語 ＋ ファミリー追加語形）
   * 「あとで覚える単語」に保管されているだけの単語は 100% 除外されます。
   * @param {Object} options { includeAll: boolean }
   */
  static getVocabulary(options = {}) {
    const all = this.getAllVocabulary();
    if (options && options.includeAll) {
      return all;
    }
    // 教科書・練習ノート掲載単語、または「あとで覚える単語」から正式に追加登録された単語のみ
    return all.filter(item => item.textbookStatus === 'textbook' || Boolean(item.isAddedToLearning));
  }

  /**
   * 教科書・学習ノート掲載の基本単語のみ取得 (1,113語)
   */
  static getTextbookWords() {
    return this.getAllVocabulary().filter(item => item.textbookStatus === 'textbook');
  }

  /**
   * 「あとで覚える単語」（教材未登場の一時保管単語）を取得
   * 正式追加された単語は「あとで覚える単語」から自動的に消えます。
   * options.includeAdded が true の場合のみ追加済みも含めて全件返却します。
   */
  static getLaterWords(options = {}) {
    const allLater = this.getAllVocabulary().filter(item => item.textbookStatus === 'later');
    if (options && options.includeAdded) {
      return allLater;
    }
    // 正式登録済みの単語は「あとで覚える単語」から削除（消える）
    return allLater.filter(item => !item.isAddedToLearning);
  }

  /**
   * 「あとで覚える単語」から正式な学習単語へ昇格（追加）された単語一覧を取得
   */
  static getPromotedLaterWords() {
    return this.getAllVocabulary().filter(item => item.textbookStatus === 'later' && Boolean(item.isAddedToLearning));
  }"""

if old_methods_block in storage_code:
    storage_code = storage_code.replace(old_methods_block, new_methods_block)
    print("Updated getVocabulary and getLaterWords in storage.js")
else:
    print("Old methods block not matched exactly, checking individual replacements...")
    if "static getPromotedLaterWords" not in storage_code:
        # replace getLaterWords
        storage_code = re.sub(
            r'static getLaterWords\(\)\s*\{[\s\S]*?return this\.getAllVocabulary\(\)\.filter\(item => item\.textbookStatus === [\'"]later[\'"]\);\s*\}',
            """static getLaterWords(options = {}) {
    const allLater = this.getAllVocabulary().filter(item => item.textbookStatus === 'later');
    if (options && options.includeAdded) return allLater;
    return allLater.filter(item => !item.isAddedToLearning);
  }

  static getPromotedLaterWords() {
    return this.getAllVocabulary().filter(item => item.textbookStatus === 'later' && Boolean(item.isAddedToLearning));
  }""",
            storage_code
        )
        print("Replaced getLaterWords with options and added getPromotedLaterWords")

with open(storage_p, 'w', encoding='utf-8') as f:
    f.write(storage_code)

# ===========================================================================
# 2. Patch js/components/Home.js
# ===========================================================================
home_p = 'js/components/Home.js'
with open(home_p, 'r', encoding='utf-8') as f:
    home_code = f.read()

# In Home.js render: calculate laterWordsCount and promotedWords
old_home_init = """    const dailyStats = StorageService.getDailyStats();
    const settings = StorageService.getSettings();
    const currentUser = AuthService.getCurrentUser();

    // SRS忘却曲線データ
    const dueWords = StorageService.getDueReviewWords();
    const highRiskWords = StorageService.getHighRiskWords();
    const studiedWords = vocabList.filter(v => v.srsLevel > 0);
    const unlearnedWords = vocabList.filter(v => v.srsLevel === 0);

    // 習熟度別集計
    const masteredWords = vocabList.filter(v => v.srsLevel >= 6);      // 習得済 (Lv.6+)
    const stableWords = vocabList.filter(v => v.srsLevel >= 3 && v.srsLevel < 6); // 定着中 (Lv.3-5)
    const beginnerWords = vocabList.filter(v => v.srsLevel >= 1 && v.srsLevel < 3); // 初見 (Lv.1-2)

    // 統計計算
    const totalWords = vocabList.length;"""

new_home_init = """    const dailyStats = StorageService.getDailyStats();
    const settings = StorageService.getSettings();
    const currentUser = AuthService.getCurrentUser();

    // 「あとで覚える単語」を正式学習単語から完全に分離
    const unaddedLaterWords = StorageService.getLaterWords ? StorageService.getLaterWords() : [];
    const promotedLaterWords = StorageService.getPromotedLaterWords ? StorageService.getPromotedLaterWords() : [];
    const laterWordsCount = unaddedLaterWords.length;

    // SRS忘却曲線データ（正式登録単語のみを対象に集計・あとで覚える単語は完全除外）
    const dueWords = StorageService.getDueReviewWords();
    const highRiskWords = StorageService.getHighRiskWords();
    const studiedWords = vocabList.filter(v => v.srsLevel > 0);
    const unlearnedWords = vocabList.filter(v => v.srsLevel === 0);

    // 習熟度別集計（正式登録単語のみ）
    const masteredWords = vocabList.filter(v => v.srsLevel >= 6);      // 習得済 (Lv.6+)
    const stableWords = vocabList.filter(v => v.srsLevel >= 3 && v.srsLevel < 6); // 定着中 (Lv.3-5)
    const beginnerWords = vocabList.filter(v => v.srsLevel >= 1 && v.srsLevel < 3); // 初見 (Lv.1-2)

    // 統計計算: 正式な登録単語数（教科書掲載単語 ＋ 追加登録単語）
    const totalWords = vocabList.length;"""

if old_home_init in home_code:
    home_code = home_code.replace(old_home_init, new_home_init)
    print("Patched stats initialization in Home.js")

# In Home.js: Update 4-card grid to 5-card grid separating 登録単語数 and あとで覚える単語
old_cards_block = """          <!-- 4分割 主要指標カード -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <div class="text-[11px] text-slate-500">登録単語数</div>
              <div class="text-lg font-extrabold text-slate-900">${totalWords} <span class="text-xs font-normal text-slate-400">語</span></div>
            </div>
            <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <div class="text-[11px] text-slate-500">登録文法数</div>
              <div class="text-lg font-extrabold text-slate-900">${totalGrammar} <span class="text-xs font-normal text-slate-400">課</span></div>
            </div>
            <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <div class="text-[11px] text-slate-500">累計正答率</div>
              <div class="text-lg font-extrabold text-slate-900">${overallAccuracy}% <span class="text-xs font-normal text-slate-400">(${totalCorrect}/${totalAnswered})</span></div>
            </div>
            <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <div class="text-[11px] text-slate-500">学習継続日数</div>
              <div class="text-lg font-extrabold text-slate-900">${streakDays} <span class="text-xs font-normal text-slate-400">日連続</span></div>
            </div>
          </div>"""

new_cards_block = """          <!-- 主要指標カード（正式登録単語数と「あとで覚える単語」を完全に分離） -->
          <div class="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3 pt-2">
            <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col justify-between">
              <div>
                <div class="text-[11px] text-slate-500 font-bold">正式な登録単語数</div>
                <div class="text-base sm:text-lg font-black text-slate-900 mt-0.5">${totalWords} <span class="text-xs font-normal text-slate-400">語</span></div>
              </div>
              <div class="text-[10px] text-emerald-600 font-bold mt-1">✓ 全ゲーム出題対象</div>
            </div>

            <div class="p-3 bg-amber-50/80 hover:bg-amber-100/70 border border-amber-200 rounded-xl flex flex-col justify-between cursor-pointer transition-all group shadow-2xs" id="home-card-later-words" title="タップして「あとで覚える単語」画面へ">
              <div>
                <div class="text-[11px] text-amber-900 font-bold flex items-center justify-between">
                  <span>あとで覚える単語</span>
                  <span class="text-[10px] text-amber-600 group-hover:translate-x-0.5 transition-transform">→</span>
                </div>
                <div class="text-base sm:text-lg font-black text-amber-700 mt-0.5">${laterWordsCount} <span class="text-xs font-normal text-amber-600/70">語</span></div>
              </div>
              <div class="text-[10px] text-amber-800 font-semibold mt-1">⏳ 保管中（出題除外）</div>
            </div>

            <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col justify-between">
              <div>
                <div class="text-[11px] text-slate-500 font-bold">登録文法数</div>
                <div class="text-base sm:text-lg font-black text-slate-900 mt-0.5">${totalGrammar} <span class="text-xs font-normal text-slate-400">課</span></div>
              </div>
              <div class="text-[10px] text-slate-400 font-medium mt-1">体系的文法レッスン</div>
            </div>

            <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col justify-between">
              <div>
                <div class="text-[11px] text-slate-500 font-bold">累計正答率</div>
                <div class="text-base sm:text-lg font-black text-slate-900 mt-0.5">${overallAccuracy}%</div>
              </div>
              <div class="text-[10px] text-slate-400 font-medium mt-1">${totalCorrect} / ${totalAnswered} 問正答</div>
            </div>

            <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col justify-between col-span-2 sm:col-span-1">
              <div>
                <div class="text-[11px] text-slate-500 font-bold">学習継続日数</div>
                <div class="text-base sm:text-lg font-black text-slate-900 mt-0.5">${streakDays} <span class="text-xs font-normal text-slate-400">日連続</span></div>
              </div>
              <div class="text-[10px] text-orange-500 font-bold mt-1">🔥 継続中</div>
            </div>
          </div>"""

if old_cards_block in home_code:
    home_code = home_code.replace(old_cards_block, new_cards_block)
    print("Patched 5-card metric grid in Home.js")

# Bind event for home-card-later-words
later_card_event = """    // 「あとで覚える単語」カードから直接遷移
    const laterCard = container.querySelector('#home-card-later-words');
    if (laterCard && onNavigate) {
      laterCard.addEventListener('click', () => onNavigate('later_words'));
    }"""

if "home-card-later-words" in home_code and "laterCard.addEventListener" not in home_code:
    home_code = home_code.replace(
        "const penguinRoomBtn = container.querySelector('#home-penguin-room-btn');",
        later_card_event + "\n\n    const penguinRoomBtn = container.querySelector('#home-penguin-room-btn');"
    )
    print("Bound event for home-card-later-words in Home.js")

with open(home_p, 'w', encoding='utf-8') as f:
    f.write(home_code)

# ===========================================================================
# 3. Patch js/components/LaterWords.js
# ===========================================================================
later_words_p = 'js/components/LaterWords.js'
with open(later_words_p, 'r', encoding='utf-8') as f:
    lw_code = f.read()

# 1. Ensure window.LaterWordsComponent is set
window_export = """
if (typeof window !== 'undefined') {
  window.LaterWordsComponent = LaterWordsComponent;
}
"""
if "window.LaterWordsComponent = LaterWordsComponent" not in lw_code:
    lw_code += window_export
    print("Added window.LaterWordsComponent export to LaterWords.js")

# 2. Update default selectedStatus to 'unadded' (so added words disappear from later list)
lw_code = lw_code.replace("static selectedStatus = 'all';", "static selectedStatus = 'unadded';")

# 3. In LaterWords.render: update stats and counts
old_lw_stats = """    const allLaterWords = StorageService.getLaterWords();
    const textbookWords = StorageService.getTextbookWords();
    const addedCount = allLaterWords.filter(w => w.isAddedToLearning).length;
    const activeTestCount = textbookWords.length + addedCount;"""

new_lw_stats = """    // includeAdded: true で全件取得して統計計算
    const allLaterWordsTotal = StorageService.getLaterWords ? StorageService.getLaterWords({ includeAdded: true }) : [];
    const unaddedLaterWords = StorageService.getLaterWords ? StorageService.getLaterWords() : [];
    const textbookWords = StorageService.getTextbookWords ? StorageService.getTextbookWords() : [];
    const promotedWords = StorageService.getPromotedLaterWords ? StorageService.getPromotedLaterWords() : [];
    const addedCount = promotedWords.length;
    const unaddedCount = unaddedLaterWords.length;
    const formalLearningCount = StorageService.getVocabulary ? StorageService.getVocabulary().length : (textbookWords.length + addedCount);"""

if old_lw_stats in lw_code:
    lw_code = lw_code.replace(old_lw_stats, new_lw_stats)
    print("Patched stats computation in LaterWords.render")

# 4. In LaterWords.render: update stat badges HTML
old_lw_badges = """              <div class="bg-black/20 backdrop-blur-xs rounded-2xl p-2.5 border border-white/15">
                <div class="text-[10px] text-amber-200 font-bold">📚 学習済み教材の単語</div>
                <div class="text-lg font-black mt-0.5 text-white">${textbookWords.length}<span class="text-xs font-normal ml-0.5">語</span></div>
                <div class="text-[10px] text-amber-100 opacity-80">常時出題対象</div>
              </div>

              <div class="bg-black/20 backdrop-blur-xs rounded-2xl p-2.5 border border-white/15">
                <div class="text-[10px] text-amber-200 font-bold">⏳ あとで覚える単語</div>
                <div class="text-lg font-black mt-0.5 text-white">${allLaterWords.length}<span class="text-xs font-normal ml-0.5">語</span></div>
                <div class="text-[10px] text-amber-100 opacity-80">教材未登場</div>
              </div>

              <div class="bg-black/20 backdrop-blur-xs rounded-2xl p-2.5 border border-white/15">
                <div class="text-[10px] text-amber-200 font-bold">🎯 ゲームに追加済み</div>
                <div class="text-lg font-black mt-0.5 text-emerald-300" id="stat-added-count">${addedCount}<span class="text-xs font-normal ml-0.5">語</span></div>
                <div class="text-[10px] text-amber-100 opacity-80">ワンタップで追加</div>
              </div>

              <div class="bg-black/20 backdrop-blur-xs rounded-2xl p-2.5 border border-white/15">
                <div class="text-[10px] text-amber-200 font-bold">🎮 現在のテスト出題総数</div>
                <div class="text-lg font-black mt-0.5 text-white" id="stat-total-test-count">${activeTestCount}<span class="text-xs font-normal ml-0.5">語</span></div>
                <div class="text-[10px] text-amber-100 opacity-80">全ゲーム・テストに反映</div>
              </div>"""

new_lw_badges = """              <div class="bg-black/20 backdrop-blur-xs rounded-2xl p-2.5 border border-white/15">
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
              </div>"""

if old_lw_badges in lw_code:
    lw_code = lw_code.replace(old_lw_badges, new_lw_badges)
    print("Patched badge counters in LaterWords.render")

# 5. In LaterWords.renderList: dynamically get words based on selectedStatus
old_render_list_header = """  static renderList(container) {
    const listContainer = container.querySelector('#later-words-list');
    const countLabel = container.querySelector('#label-filtered-count');
    if (!listContainer) return;

    let words = StorageService.getLaterWords();"""

new_render_list_header = """  static renderList(container) {
    const listContainer = container.querySelector('#later-words-list');
    const countLabel = container.querySelector('#label-filtered-count');
    if (!listContainer) return;

    // 「すべて」または「追加済みのみ」選択時は追加済みも含めて取得
    const includeAdded = (this.selectedStatus === 'all' || this.selectedStatus === 'added');
    let words = StorageService.getLaterWords ? StorageService.getLaterWords({ includeAdded }) : [];"""

if old_render_list_header in lw_code:
    lw_code = lw_code.replace(old_render_list_header, new_render_list_header)
    print("Patched renderList header in LaterWords.js")

# Fix countLabel in LaterWords.js
lw_code = re.sub(
    r'countLabel\.textContent\s*=\s*`表示中:\s*\$\{words\.length\}件\s*/\s*全\d+件`;',
    "const totalTarget = (this.selectedStatus === 'added') ? StorageService.getPromotedLaterWords().length : (this.selectedStatus === 'unadded' ? StorageService.getLaterWords().length : StorageService.getLaterWords({ includeAdded: true }).length);\n      countLabel.textContent = `表示中: ${words.length}件 / 全${totalTarget}件`;",
    lw_code
)

# 6. In updateHeaderStats: update correctly
old_update_header = """  static updateHeaderStats(container) {
    const allLater = StorageService.getLaterWords();
    const textbook = StorageService.getTextbookWords();
    const addedCount = allLater.filter(w => w.isAddedToLearning).length;
    const activeTestCount = textbook.length + addedCount;

    const statAdded = container.querySelector('#stat-added-count');
    const statTotal = container.querySelector('#stat-total-test-count');
    if (statAdded) statAdded.innerHTML = `${addedCount}<span class="text-xs font-normal ml-0.5">語</span>`;
    if (statTotal) statTotal.innerHTML = `${activeTestCount}<span class="text-xs font-normal ml-0.5">語</span>`;
  }"""

new_update_header = """  static updateHeaderStats(container) {
    const unaddedCount = StorageService.getLaterWords ? StorageService.getLaterWords().length : 0;
    const promotedWords = StorageService.getPromotedLaterWords ? StorageService.getPromotedLaterWords() : [];
    const formalCount = StorageService.getVocabulary ? StorageService.getVocabulary().length : 0;

    const statFormal = container.querySelector('#stat-formal-count');
    const statUnadded = container.querySelector('#stat-unadded-count');
    const statAdded = container.querySelector('#stat-added-count');

    if (statFormal) statFormal.innerHTML = `${formalCount}<span class="text-xs font-normal ml-0.5">語</span>`;
    if (statUnadded) statUnadded.innerHTML = `${unaddedCount}<span class="text-xs font-normal ml-0.5">語</span>`;
    if (statAdded) statAdded.innerHTML = `${promotedWords.length}<span class="text-xs font-normal ml-0.5">語</span>`;
  }"""

if old_update_header in lw_code:
    lw_code = lw_code.replace(old_update_header, new_update_header)
    print("Patched updateHeaderStats in LaterWords.js")

# In btn-toggle-add: update action text and toast
old_add_toast = """this.showToast(`「${targetWord ? targetWord.mongolian : '単語'}」を覚える単語に追加しました！全ゲームに出題されます。`);"""
new_add_toast = """this.showToast(`「${targetWord ? targetWord.mongolian : '単語'}」を覚える単語に追加しました！登録単語数に反映され、全ゲームに出題されます。`);"""
if old_add_toast in lw_code:
    lw_code = lw_code.replace(old_add_toast, new_add_toast)

old_remove_toast = """this.showToast(`「${targetWord ? targetWord.mongolian : '単語'}」を出題対象から外しました。`);"""
new_remove_toast = """this.showToast(`「${targetWord ? targetWord.mongolian : '単語'}」を出題対象から外し、「あとで覚える単語」に戻しました。`);"""
if old_remove_toast in lw_code:
    lw_code = lw_code.replace(old_remove_toast, new_remove_toast)

with open(later_words_p, 'w', encoding='utf-8') as f:
    f.write(lw_code)

# ===========================================================================
# 4. Patch js/app.js (safe LaterWordsComponent render)
# ===========================================================================
app_p = 'js/app.js'
with open(app_p, 'r', encoding='utf-8') as f:
    app_code = f.read()

old_app_case = """      case 'later_words':
        LaterWordsComponent.render(mainContainer, onNavigate);
        break;"""

new_app_case = """      case 'later_words':
        {
          const Comp = (typeof LaterWordsComponent !== 'undefined' && LaterWordsComponent) ||
                       (typeof window !== 'undefined' && window.LaterWordsComponent);
          if (Comp && typeof Comp.render === 'function') {
            Comp.render(mainContainer, onNavigate);
          } else {
            console.error('[App] LaterWordsComponent is not defined on render');
          }
        }
        break;"""

if old_app_case in app_code:
    app_code = app_code.replace(old_app_case, new_app_case)
    print("Patched case 'later_words' in app.js with defensive fallback")
    with open(app_p, 'w', encoding='utf-8') as f:
        f.write(app_code)

# ===========================================================================
# 5. Bump Service Worker cache to v12
# ===========================================================================
for sw_p in ['sw.js', 'dist/sw.js']:
    if os.path.exists(sw_p):
        with open(sw_p, 'r', encoding='utf-8') as f:
            sw_text = f.read()
        sw_text = sw_text.replace('mongol-app-cache-v11', 'mongol-app-cache-v12')
        sw_text = sw_text.replace('mongol-app-cache-v10', 'mongol-app-cache-v12')
        with open(sw_p, 'w', encoding='utf-8') as f:
            f.write(sw_text)
        print(f"Bumped cache to v12 in {sw_p}")

print("All patches applied successfully!")
