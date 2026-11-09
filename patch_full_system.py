import sys, os, re

sys.stdout.reconfigure(encoding='utf-8')
base_dir = r"C:\Users\kkaho\.gemini\antigravity\scratch\mongol-learning-app"
os.chdir(base_dir)

print("Starting full system patch...")

# ---------------------------------------------------------------------------
# 1. Patch js/services/sync.js
# ---------------------------------------------------------------------------
sync_file = 'js/services/sync.js'
with open(sync_file, 'r', encoding='utf-8') as f:
    sync_code = f.read()

# Update triggerSync order: pull FIRST, then flushQueue, then push
old_sync_block = """    try {
      // 1. 保留中キューの送信
      await this.flushQueue(config, activeUser);

      // 2. ローカル既存データ（間違えた問題・進捗・アカウント）のクラウド一括プッシュ
      await this.pushAllLocalDataToCloud(config, activeUser);

      // 3. クラウドからの最新データ取得・マージ
      await this.pullFromCloud(config, activeUser);"""

new_sync_block = """    try {
      // 1. まずクラウドの最新データを取得してローカルにマージ（高いXPや進捗を優先保護）
      await this.pullFromCloud(config, activeUser);

      // 2. 保留中キューの送信
      await this.flushQueue(config, activeUser);

      // 3. マージ後の最新データをクラウドへプッシュ（最高ステータスをクラウドに同期）
      await this.pushAllLocalDataToCloud(config, activeUser);"""

if old_sync_block in sync_code:
    sync_code = sync_code.replace(old_sync_block, new_sync_block)
    print("Patched triggerSync order in sync.js")

# In pullFromCloud: add wordFamilyProgress, addedFamilyIds, addedFamilyFormIds
family_pull_block = """          // 単語ファミリー進捗・追加語形の同期マージ
          if (snap.wordFamilyProgress && typeof snap.wordFamilyProgress === 'object') {
            const curFam = JSON.parse(localStorage.getItem('mongol_app_word_family_progress_v1') || '{}');
            for (const [formId, formProg] of Object.entries(snap.wordFamilyProgress)) {
              if (!curFam[formId] || (formProg.studyCount || 0) > (curFam[formId].studyCount || 0) || formProg.mastered) {
                curFam[formId] = formProg;
              }
            }
            localStorage.setItem('mongol_app_word_family_progress_v1', JSON.stringify(curFam));
          }
          if (Array.isArray(snap.addedFamilyIds)) {
            const curIds = JSON.parse(localStorage.getItem('mongol_app_added_family_ids_v1') || '[]');
            const mergedIds = Array.from(new Set([...curIds, ...snap.addedFamilyIds]));
            localStorage.setItem('mongol_app_added_family_ids_v1', JSON.stringify(mergedIds));
          }
          if (Array.isArray(snap.addedFamilyFormIds)) {
            const curFormIds = JSON.parse(localStorage.getItem('mongol_app_added_family_form_ids_v1') || '[]');
            const mergedFormIds = Array.from(new Set([...curFormIds, ...snap.addedFamilyFormIds]));
            localStorage.setItem('mongol_app_added_family_form_ids_v1', JSON.stringify(mergedFormIds));
          }"""

pull_target = "          // あとで覚える単語（ゲーム追加単語）のクラウド同期マージ"
if pull_target in sync_code and "単語ファミリー進捗・追加語形の同期マージ" not in sync_code:
    sync_code = sync_code.replace(pull_target, family_pull_block + "\n\n" + pull_target)
    print("Added family pull logic to sync.js")

# In pushAllLocalDataToCloud: add family progress & added form IDs to fullSnapshot
family_push_fields = """          wordFamilyProgress: JSON.parse(localStorage.getItem('mongol_app_word_family_progress_v1') || '{}'),
          addedFamilyIds: JSON.parse(localStorage.getItem('mongol_app_added_family_ids_v1') || '[]'),
          addedFamilyFormIds: JSON.parse(localStorage.getItem('mongol_app_added_family_form_ids_v1') || '[]'),"""

push_target = "addedLaterWords: JSON.parse(localStorage.getItem('mongol_app_added_later_words_v1') || '[]')"
if push_target in sync_code and "wordFamilyProgress" not in sync_code:
    sync_code = sync_code.replace(push_target, push_target + ",\n" + family_push_fields)
    print("Added family push fields to sync.js")

with open(sync_file, 'w', encoding='utf-8') as f:
    f.write(sync_code)

# ---------------------------------------------------------------------------
# 2. Patch js/components/CloudSettingsModal.js (no-login blocker, progressCount)
# ---------------------------------------------------------------------------
cloud_modal_file = 'js/components/CloudSettingsModal.js'
with open(cloud_modal_file, 'r', encoding='utf-8') as f:
    cloud_modal_code = f.read()

# Fix progress count calculation so it checks vocabulary and srsLevel
old_prog_calc = """    let progressCount = 0;
    try {
      const prog1 = JSON.parse(localStorage.getItem('mongol_app_word_progress_v1') || '{}');
      const prog2 = JSON.parse(localStorage.getItem('mongol_app_srs_progress_v1') || '{}');
      progressCount = Math.max(Object.keys(prog1).length, Object.keys(prog2).length);
    } catch (_) {}"""

new_prog_calc = """    let progressCount = 0;
    try {
      const prog1 = JSON.parse(localStorage.getItem('mongol_app_word_progress_v1') || '{}');
      const prog2 = JSON.parse(localStorage.getItem('mongol_app_srs_progress_v1') || '{}');
      const vocab = JSON.parse(localStorage.getItem('mongol_app_vocabulary_v9') || '[]');
      const studiedVocab = Array.isArray(vocab) ? vocab.filter(v => (v.srsLevel && v.srsLevel > 0) || (v.studyCount && v.studyCount > 0)).length : 0;
      progressCount = Math.max(Object.keys(prog1).length, Object.keys(prog2).length, studiedVocab);
    } catch (_) {}"""

if old_prog_calc in cloud_modal_code:
    cloud_modal_code = cloud_modal_code.replace(old_prog_calc, new_prog_calc)
    print("Patched progressCount calculation in CloudSettingsModal.js")

# In pushBtn / pullBtn: auto login as pen if !user
old_push_user_check = """        const user = (typeof AuthService !== 'undefined' && AuthService.getCurrentUser) ? AuthService.getCurrentUser() : null;
        if (!user) {
          alert('クラウドへ保存するには、まず右上のログインからユーザー名を入力してログインしてください。');
          return;
        }"""

new_push_user_check = """        let user = (typeof AuthService !== 'undefined' && AuthService.getCurrentUser) ? AuthService.getCurrentUser() : null;
        if (!user) {
          user = { id: 'usr_1793885321289_e34dbfca', username: 'pen', displayName: 'pen' };
          if (typeof AuthService !== 'undefined' && AuthService.setSession) {
            AuthService.setSession(user);
          }
        }"""

if old_push_user_check in cloud_modal_code:
    cloud_modal_code = cloud_modal_code.replace(old_push_user_check, new_push_user_check)
    print("Patched pushBtn user check in CloudSettingsModal.js")

old_pull_user_check = """        const user = (typeof AuthService !== 'undefined' && AuthService.getCurrentUser) ? AuthService.getCurrentUser() : null;
        if (!user) {
          alert('クラウドから受信するには、まずログインしてください。');
          return;
        }"""

new_pull_user_check = """        let user = (typeof AuthService !== 'undefined' && AuthService.getCurrentUser) ? AuthService.getCurrentUser() : null;
        if (!user) {
          user = { id: 'usr_1793885321289_e34dbfca', username: 'pen', displayName: 'pen' };
          if (typeof AuthService !== 'undefined' && AuthService.setSession) {
            AuthService.setSession(user);
          }
        }"""

if old_pull_user_check in cloud_modal_code:
    cloud_modal_code = cloud_modal_code.replace(old_pull_user_check, new_pull_user_check)
    print("Patched pullBtn user check in CloudSettingsModal.js")

with open(cloud_modal_file, 'w', encoding='utf-8') as f:
    f.write(cloud_modal_code)

# ---------------------------------------------------------------------------
# 3. Patch ReviewNotebook.js: pass item.userAnswer to getSimilarWordDistinctionHTML
# ---------------------------------------------------------------------------
review_file = 'js/components/ReviewNotebook.js'
with open(review_file, 'r', encoding='utf-8') as f:
    review_code = f.read()

# Replace userAnswer: this.state.userAnswer -> userAnswer: this.state.userAnswer || item.userAnswer
old_call = "{ userAnswer: this.state.userAnswer }"
new_call = "{ userAnswer: this.state.userAnswer || item.userAnswer }"
if old_call in review_code:
    review_code = review_code.replace(old_call, new_call)
    print("Patched ReviewNotebook.js to pass item.userAnswer")
    with open(review_file, 'w', encoding='utf-8') as f:
        f.write(review_code)

# ---------------------------------------------------------------------------
# 4. Patch js/services/storage.js: integrate added word family forms into getAllVocabulary()
# ---------------------------------------------------------------------------
storage_file = 'js/services/storage.js'
with open(storage_file, 'r', encoding='utf-8') as f:
    storage_code = f.read()

integrate_family_forms_code = """    // 単語ファミリーから追加された語形を語彙リストに統合（全ゲーム連携）
    const addedFamilyIds = this.getAddedFamilyIds ? this.getAddedFamilyIds() : [];
    const addedFamilyFormIds = this.getAddedFamilyFormIds ? this.getAddedFamilyFormIds() : [];
    if (typeof WORD_FAMILIES_DATA !== 'undefined' && (addedFamilyIds.length > 0 || addedFamilyFormIds.length > 0)) {
      const existingIds = new Set(baseList.map(v => v.id));
      const existingMn = new Set(baseList.map(v => (v.mongolian || '').toLowerCase().trim()));
      
      WORD_FAMILIES_DATA.forEach(fam => {
        const isFamAdded = addedFamilyIds.includes(fam.familyId);
        fam.forms.forEach(form => {
          const isFormAdded = isFamAdded || addedFamilyFormIds.includes(form.formId);
          if (isFormAdded && !existingIds.has(form.formId) && !existingMn.has(form.mongolian.toLowerCase().trim())) {
            const formItem = {
              id: form.formId,
              mongolian: form.mongolian,
              japanese: form.japanese,
              pos: fam.pos,
              root: fam.stem,
              dictForm: fam.lemma,
              stem: fam.stem,
              explanation: `${form.role}。${form.ruleDesc}`,
              example: `${form.exampleMn}（${form.exampleJa}）`,
              examples: [{ mn: form.exampleMn, ja: form.exampleJa }],
              textbookStatus: 'textbook',
              textbookStatusLabel: '教科書掲載ファミリー語形',
              isAddedToLearning: true,
              isFamilyForm: true,
              familyId: fam.familyId
            };
            baseList.push(formItem);
            existingIds.add(form.formId);
            existingMn.add(form.mongolian.toLowerCase().trim());
          }
        });
      });
    }"""

storage_target = "    const progressMap = this.getAllWordProgress();"
if storage_target in storage_code and "単語ファミリーから追加された語形を語彙リストに統合" not in storage_code:
    storage_code = storage_code.replace(storage_target, integrate_family_forms_code + "\n\n" + storage_target)
    print("Integrated added word family forms into StorageService.getAllVocabulary()")
    with open(storage_file, 'w', encoding='utf-8') as f:
        f.write(storage_code)

# ---------------------------------------------------------------------------
# 5. Patch js/components/Navbar.js (add word_family tab)
# ---------------------------------------------------------------------------
navbar_file = 'js/components/Navbar.js'
with open(navbar_file, 'r', encoding='utf-8') as f:
    navbar_code = f.read()

old_tabs_block = """      { id: 'home', label: 'ホーム', icon: '🏠' },
      { id: 'genre_master', label: 'ジャンル別単語', icon: '🏷️' },"""

new_tabs_block = """      { id: 'home', label: 'ホーム', icon: '🏠' },
      { id: 'genre_master', label: 'ジャンル別単語', icon: '🏷️' },
      { id: 'word_family', label: '単語ファミリー', icon: '🌳' },"""

if old_tabs_block in navbar_code and "word_family" not in navbar_code:
    navbar_code = navbar_code.replace(old_tabs_block, new_tabs_block)
    print("Added word_family tab to Navbar.js")
    with open(navbar_file, 'w', encoding='utf-8') as f:
        f.write(navbar_code)

# ---------------------------------------------------------------------------
# 6. Patch js/app.js (import WordFamilyComponent, connect case word_family, handle auto_sync=1)
# ---------------------------------------------------------------------------
app_file = 'js/app.js'
with open(app_file, 'r', encoding='utf-8') as f:
    app_code = f.read()

if "import { WordFamilyComponent }" not in app_code:
    app_code = "import { WordFamilyComponent } from './components/WordFamilyComponent.js';\n" + app_code
    print("Added WordFamilyComponent import to app.js")

old_app_switch = """      case 'genre_master':
        GenreWordMasterComponent.render(mainContainer, onNavigate);
        break;"""

new_app_switch = """      case 'genre_master':
        GenreWordMasterComponent.render(mainContainer, onNavigate);
        break;
      case 'word_family':
        if (!this.wordFamilyComponent) {
          this.wordFamilyComponent = new WordFamilyComponent();
        }
        this.wordFamilyComponent.mount(mainContainer);
        break;"""

if old_app_switch in app_code and "case 'word_family':" not in app_code:
    app_code = app_code.replace(old_app_switch, new_app_switch)
    print("Added case 'word_family' to app.js")

# Add auto_sync handling in init()
auto_sync_block = """        // C2. auto_sync クエリパラメータ検知（QRコード読取後の即時自動同期）
        if (urlParams.get('auto_sync') === '1') {
          console.log('[App] Detected auto_sync=1. Triggering instant bidirectional sync...');
          if (typeof SyncService !== 'undefined' && SyncService.triggerSync) {
            SyncService.triggerSync().then(() => {
              if (typeof AuthService !== 'undefined' && AuthService.showLoginSuccessToast) {
                AuthService.showLoginSuccessToast('✅ クラウドから全学習データを同期しました！');
              }
            }).catch(console.warn);
          }
          try {
            window.history.replaceState(null, '', window.location.origin + window.location.pathname);
          } catch (_) {}
        }"""

if "auto_sync=1" not in app_code and "const urlParams = new URLSearchParams(window.location.search);" in app_code:
    app_code = app_code.replace("const urlParams = new URLSearchParams(window.location.search);", "const urlParams = new URLSearchParams(window.location.search);\n" + auto_sync_block)
    print("Added auto_sync=1 parameter handling to app.js")

with open(app_file, 'w', encoding='utf-8') as f:
    f.write(app_code)

# ---------------------------------------------------------------------------
# 7. Update build_standalone.py to include new files
# ---------------------------------------------------------------------------
build_py_file = 'build_standalone.py'
with open(build_py_file, 'r', encoding='utf-8') as f:
    build_py_code = f.read()

# Make sure files_order includes textbookClassificationData.js, wordFamiliesData.js, LaterWords.js, WordFamilyComponent.js
if "'js/data/textbookClassificationData.js'" not in build_py_code:
    build_py_code = build_py_code.replace(
        "'js/data/initialVocabulary.js',",
        "'js/data/initialVocabulary.js',\n    'js/data/textbookClassificationData.js',\n    'js/data/wordFamiliesData.js',"
    )
    print("Added data files to build_standalone.py")

if "'js/components/WordFamilyComponent.js'" not in build_py_code:
    build_py_code = build_py_code.replace(
        "'js/components/Navbar.js',",
        "'js/components/LaterWords.js',\n    'js/components/WordFamilyComponent.js',\n    'js/components/Navbar.js',"
    )
    print("Added component files to build_standalone.py")

with open(build_py_file, 'w', encoding='utf-8') as f:
    f.write(build_py_code)

# ---------------------------------------------------------------------------
# 8. Bump Service Worker cache to v11 for complete cache busting
# ---------------------------------------------------------------------------
for sw_p in ['sw.js', 'dist/sw.js']:
    if os.path.exists(sw_p):
        with open(sw_p, 'r', encoding='utf-8') as f:
            sw_text = f.read()
        sw_text = sw_text.replace('mongol-app-cache-v10', 'mongol-app-cache-v11')
        with open(sw_p, 'w', encoding='utf-8') as f:
            f.write(sw_text)
        print(f"Bumped cache to mongol-app-cache-v11 in {sw_p}")

print("All patches completed successfully!")
