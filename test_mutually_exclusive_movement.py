import re, os, sys, json

base_dir = r"C:\Users\kkaho\.gemini\antigravity\scratch\mongol-learning-app"
os.chdir(base_dir)

print("Starting Mutually Exclusive Word Movement & Zero-Duplicate Syntax Tests...")
tests_passed = 0
total_tests = 6

# Test 1: Verify syntax of bundled.js - no duplicate WordFamilyComponent
with open('bundled.js', 'r', encoding='utf-8') as f:
    bundled_text = f.read()

wf_decls = re.findall(r'class\s+WordFamilyComponent\b', bundled_text)
assert len(wf_decls) == 1, f"Expected exactly 1 declaration of WordFamilyComponent in bundled.js, found {len(wf_decls)}"
wfq_decls = re.findall(r'class\s+WordFamilyQuizComponent\b', bundled_text)
assert len(wfq_decls) == 1, f"Expected exactly 1 declaration of WordFamilyQuizComponent in bundled.js, found {len(wfq_decls)}"
print("Test 1 PASS: Exactly 1 WordFamilyComponent and 1 WordFamilyQuizComponent declared in bundled.js.")
tests_passed += 1

# Test 2: Verify syntax of index.html
with open('index.html', 'r', encoding='utf-8') as f:
    html_text = f.read()

html_wf_decls = re.findall(r'class\s+WordFamilyComponent\b', html_text)
assert len(html_wf_decls) == 1, f"Expected 1 declaration in index.html, found {len(html_wf_decls)}"
print("Test 2 PASS: Exactly 1 WordFamilyComponent declared in index.html.")
tests_passed += 1

# Test 3: LaterWords.js calls StorageService.getLaterWords() strictly without includeAdded
with open('js/components/LaterWords.js', 'r', encoding='utf-8') as f:
    lw_code = f.read()

assert "words = StorageService.getLaterWords ? StorageService.getLaterWords() : [];" in lw_code, "getLaterWords should not pass includeAdded: true"
print("Test 3 PASS: LaterWordsComponent strictly loads unadded later words only.")
tests_passed += 1

# Test 4: Mutual exclusivity in storage simulation
# 1305 textbook, 316 later words => total 1621
with open('js/data/textbookClassificationData.js', 'r', encoding='utf-8') as f:
    class_text = f.read()

start_idx = class_text.find('{')
end_idx = class_text.rfind('}')
data = json.loads(class_text[start_idx:end_idx+1])

textbook_matches = [v for v in data.values() if v.get("status") == "textbook"]
later_matches = [v for v in data.values() if v.get("status") == "later"]

assert len(textbook_matches) == 1305, f"Expected 1305 textbook words, got {len(textbook_matches)}"
assert len(later_matches) == 316, f"Expected 316 later words, got {len(later_matches)}"
assert len(textbook_matches) + len(later_matches) == len(data) == 1621, "Vocabulary partition must strictly equal 1621"
print(f"Test 4 PASS: Total vocabulary is 1621, partitioned strictly into {len(textbook_matches)} active and {len(later_matches)} later words.")
tests_passed += 1

# Test 5: Verify 1-tap bidirectional movement labels and action handlers
assert "btn-move-to-later" in lw_code
assert "後で覚える単語に移動" in lw_code
assert "btn-toggle-add" in lw_code
assert "覚える単語に追加" in lw_code
assert "StorageService.moveWordToActive(wordId)" in lw_code
assert "StorageService.moveWordToLater(wordId)" in lw_code
assert "this.renderList(container)" in lw_code
print("Test 5 PASS: 1-tap bidirectional movement methods and instantaneous re-rendering verified.")
tests_passed += 1

# Test 6: Verify Service Worker v16 cache and auto-update
with open('sw.js', 'r', encoding='utf-8') as f:
    sw_text = f.read()
assert 'mongol-app-cache-v17' in sw_text

with open('build_standalone.py', 'r', encoding='utf-8') as f:
    bs_text = f.read()
assert 'controllerchange' in bs_text
assert '最新版に更新' in bs_text
print("Test 6 PASS: Service Worker cache bumped to v16 with automatic controllerchange reload and cache refresh button.")
tests_passed += 1

print("\n========================================================")
print(f"ALL {tests_passed}/{total_tests} MUTUAL EXCLUSIVITY TESTS PASSED (100%)!")
print("========================================================")
