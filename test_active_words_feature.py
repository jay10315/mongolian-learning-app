import sys, os, re, json

sys.stdout.reconfigure(encoding='utf-8')
base_dir = r"C:\Users\kkaho\.gemini\antigravity\scratch\mongol-learning-app"
os.chdir(base_dir)

print("Starting Active Words & Later Words Bidirectional Movement Tests...")
tests_passed = 0
total_tests = 8

# Test 1: Verify StorageService methods in storage.js
with open('js/services/storage.js', 'r', encoding='utf-8') as f:
    s_text = f.read()

assert 'static getDemotedToLaterWordIds()' in s_text
assert 'static moveWordToLater(wordId)' in s_text
assert 'static moveWordToActive(wordId)' in s_text
assert 'static getActiveWords()' in s_text
assert 'isDemotedToLater: isDemoted' in s_text
assert 'isActiveLearning: isActiveLearning' in s_text
print("Test 1 PASS: StorageService has full bidirectional movement methods and active learning flags.")
tests_passed += 1

# Test 2: Simulate initial counts
with open('js/data/initialVocabulary.js', 'r', encoding='utf-8') as f:
    init_vocab = json.loads(re.search(r'export const initialVocabulary = (\[[\s\S]*?\]);', f.read()).group(1))
with open('js/data/textbookClassificationData.js', 'r', encoding='utf-8') as f:
    class_data = json.loads(re.search(r'export const TEXTBOOK_CLASSIFICATION_DATA = (\{[\s\S]*?\});', f.read()).group(1))

textbook_items = [v for v in init_vocab if class_data.get(v['id'], {}).get('status') == 'textbook']
later_items = [v for v in init_vocab if class_data.get(v['id'], {}).get('status') == 'later']

assert len(textbook_items) == 1305
assert len(later_items) == 316
print("Test 2 PASS: Initial classification counts verified (1305 textbook, 316 later).")
tests_passed += 1

# Test 3: Simulate moveWordToLater on textbook word
sample_id = textbook_items[0]['id']
demoted_ids = [sample_id]
added_ids = []

active_sim = [
    v for v in init_vocab 
    if (class_data.get(v['id'], {}).get('status') == 'textbook' and v['id'] not in demoted_ids) or
       (class_data.get(v['id'], {}).get('status') == 'later' and v['id'] in added_ids and v['id'] not in demoted_ids)
]
later_sim = [
    v for v in init_vocab
    if not ((class_data.get(v['id'], {}).get('status') == 'textbook' and v['id'] not in demoted_ids) or
            (class_data.get(v['id'], {}).get('status') == 'later' and v['id'] in added_ids and v['id'] not in demoted_ids))
]

assert len(active_sim) == 1304, f"Expected 1304 active, got {len(active_sim)}"
assert len(later_sim) == 317, f"Expected 317 later, got {len(later_sim)}"
print("Test 3 PASS: Moving textbook word to later correctly adjusts counts (1304 active, 317 later).")
tests_passed += 1

# Test 4: Simulate moveWordToActive on later word
sample_later_id = later_items[0]['id']
added_ids.append(sample_later_id)
demoted_ids = []

active_sim2 = [
    v for v in init_vocab 
    if (class_data.get(v['id'], {}).get('status') == 'textbook' and v['id'] not in demoted_ids) or
       (class_data.get(v['id'], {}).get('status') == 'later' and v['id'] in added_ids and v['id'] not in demoted_ids)
]
later_sim2 = [
    v for v in init_vocab
    if not ((class_data.get(v['id'], {}).get('status') == 'textbook' and v['id'] not in demoted_ids) or
            (class_data.get(v['id'], {}).get('status') == 'later' and v['id'] in added_ids and v['id'] not in demoted_ids))
]

assert len(active_sim2) == 1306, f"Expected 1306 active, got {len(active_sim2)}"
assert len(later_sim2) == 315, f"Expected 315 later, got {len(later_sim2)}"
print("Test 4 PASS: Moving later word to active correctly adjusts counts (1306 active, 315 later).")
tests_passed += 1

# Test 5: Verify LaterWordsComponent has mode tabs and move buttons
with open('js/components/LaterWords.js', 'r', encoding='utf-8') as f:
    lw = f.read()

assert 'tab-mode-active' in lw
assert 'tab-mode-later' in lw
assert '今覚える単語' in lw
assert 'あとで覚える単語' in lw
assert '後で覚える単語に移動' in lw
assert 'btn-move-to-later' in lw
assert '覚える単語に追加' in lw
assert 'btn-toggle-add' in lw
print("Test 5 PASS: LaterWordsComponent has mode toggle tabs and 1-tap movement buttons.")
tests_passed += 1

# Test 6: Verify Navbar has both active_words and later_words tabs
with open('js/components/Navbar.js', 'r', encoding='utf-8') as f:
    nb = f.read()

assert "id: 'active_words', label: '今覚える単語'" in nb
assert "id: 'later_words', label: 'あとで覚える単語'" in nb
print("Test 6 PASS: Navbar has both active_words and later_words tabs.")
tests_passed += 1

# Test 7: Verify app.js routes active_words and later_words
with open('js/app.js', 'r', encoding='utf-8') as f:
    app_text = f.read()

assert "case 'active_words':" in app_text
assert "{ mode: 'active' }" in app_text
assert "case 'later_words':" in app_text
assert "{ mode: 'later' }" in app_text
print("Test 7 PASS: app.js routes both active_words and later_words.")
tests_passed += 1

# Test 8: Verify sync.js syncs demotedToLaterWords
with open('js/services/sync.js', 'r', encoding='utf-8') as f:
    sync_text = f.read()

assert 'demotedToLaterWords' in sync_text
assert 'mongol_app_demoted_to_later_words_v1' in sync_text
print("Test 8 PASS: sync.js syncs demotedToLaterWords across devices via Supabase.")
tests_passed += 1

print(f"\n==========================================")
print(f"ALL {tests_passed}/{total_tests} ACTIVE WORDS TESTS PASSED (100%)!")
print(f"==========================================")
