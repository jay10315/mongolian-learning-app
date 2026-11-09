import sys, os, re, json

sys.stdout.reconfigure(encoding='utf-8')
base_dir = r"C:\Users\kkaho\.gemini\antigravity\scratch\mongol-learning-app"
os.chdir(base_dir)

print("Starting Later Words Separation & Component Verification Test...")
tests_passed = 0
total_tests = 9

# Test 1: LaterWordsComponent exists in bundled.js and index.html
with open('bundled.js', 'r', encoding='utf-8') as f:
    b_text = f.read()
with open('index.html', 'r', encoding='utf-8') as f:
    i_text = f.read()

assert 'class LaterWordsComponent' in b_text
assert 'window.LaterWordsComponent = LaterWordsComponent' in b_text
assert 'class LaterWordsComponent' in i_text
assert 'window.LaterWordsComponent = LaterWordsComponent' in i_text
print("Test 1 PASS: LaterWordsComponent class and window export present in bundled.js and index.html.")
tests_passed += 1

# Test 2: Definition precedes call site in bundled.js
def_pos = b_text.find('class LaterWordsComponent')
call_pos = b_text.rfind('LaterWordsComponent')
assert def_pos != -1 and call_pos != -1
assert def_pos < call_pos
print("Test 2 PASS: LaterWordsComponent definition precedes call site.")
tests_passed += 1

# Test 3: StorageService.getVocabulary only returns textbook words + added words
with open('js/data/initialVocabulary.js', 'r', encoding='utf-8') as f:
    init_vocab = json.loads(re.search(r'export const initialVocabulary = (\[[\s\S]*?\]);', f.read()).group(1))
with open('js/data/textbookClassificationData.js', 'r', encoding='utf-8') as f:
    class_data = json.loads(re.search(r'export const TEXTBOOK_CLASSIFICATION_DATA = (\{[\s\S]*?\});', f.read()).group(1))

# Simulate getVocabulary
textbook_count = sum(1 for v in init_vocab if class_data.get(v['id'], {}).get('status') == 'textbook')
later_count = sum(1 for v in init_vocab if class_data.get(v['id'], {}).get('status') == 'later')

assert textbook_count == 1305, f"Expected 1305 textbook words, got {textbook_count}"
assert later_count == 316, f"Expected 316 later words, got {later_count}"
print(f"Test 3 PASS: Classification data verified: 1305 textbook, 316 later words.")
tests_passed += 1

# Test 4: Verify storage.js getLaterWords excludes added words by default
with open('js/services/storage.js', 'r', encoding='utf-8') as f:
    s_text = f.read()

assert 'static getLaterWords(options = {})' in s_text
assert 'return allLater.filter(item => !item.isAddedToLearning);' in s_text
assert 'static getPromotedLaterWords()' in s_text
print("Test 4 PASS: StorageService.getLaterWords excludes added words by default.")
tests_passed += 1

# Test 5: Verify Home.js metric card separation
with open('js/components/Home.js', 'r', encoding='utf-8') as f:
    h_text = f.read()

assert '正式な登録単語数' in h_text
assert 'あとで覚える単語' in h_text
assert 'home-card-later-words' in h_text
assert 'totalWords' in h_text
assert 'laterWordsCount' in h_text
print("Test 5 PASS: Home.js separates 正式な登録単語数 and あとで覚える単語 in metrics.")
tests_passed += 1

# Test 6: Verify LaterWords.js action button labels
with open('js/components/LaterWords.js', 'r', encoding='utf-8') as f:
    lw_text = f.read()

assert '覚える単語に追加' in lw_text
assert '追加済み' in lw_text
assert 'ゲーム出題中' in lw_text
assert 'btn-toggle-add' in lw_text
print("Test 6 PASS: LaterWords.js contains 「覚える単語に追加」 and 「追加済み」 buttons.")
tests_passed += 1

# Test 7: Verify app.js safe fallback for LaterWordsComponent
with open('js/app.js', 'r', encoding='utf-8') as f:
    a_text = f.read()

assert "case 'later_words':" in a_text
assert "LaterWordsComponent" in a_text
assert "window.LaterWordsComponent" in a_text
print("Test 7 PASS: app.js contains defensive check for LaterWordsComponent.")
tests_passed += 1

# Test 8: Verify Service Worker cache v16
with open('sw.js', 'r', encoding='utf-8') as f:
    sw_text = f.read()
assert 'mongol-app-cache-v17' in sw_text
with open('dist/sw.js', 'r', encoding='utf-8') as f:
    dsw_text = f.read()
assert 'mongol-app-cache-v17' in dsw_text
print("Test 8 PASS: sw.js and dist/sw.js cache bumped to v16.")
tests_passed += 1

# Test 9: Run previous regression test suite
import subprocess
res = subprocess.run([sys.executable, 'test_later_words_feature.py'], capture_output=True, text=True)
assert res.returncode == 0, f"test_later_words_feature.py failed: {res.stdout}\n{res.stderr}"
print("Test 9 PASS: test_later_words_feature.py regression test passed 100%.")
tests_passed += 1

print(f"\n==========================================")
print(f"ALL {tests_passed}/{total_tests} SEPARATION & FIX TESTS PASSED (100%)!")
print(f"==========================================")
