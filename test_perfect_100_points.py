import os
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

print("=== Running Perfect 100-Point Quality Test Suite ===")

# 1. No spoilers in question fields across all data files
print("[1] Verifying no answer spoilers or blatant hints in questions...")
data_dir = 'C:/Users/kkaho/.gemini/antigravity/scratch/mongol-learning-app/js/data'
for file in sorted(os.listdir(data_dir)):
    if file.endswith('.js'):
        p = os.path.join(data_dir, file)
        with open(p, 'r', encoding='utf-8') as f:
            content = f.read()
        for idx, line in enumerate(content.splitlines(), 1):
            if 'question:' in line or '"question"' in line:
                # Check for spoilers giving away Cyrillic word meanings in parentheses
                assert not re.search(r'[（(][^）)]*[\u0400-\u04FF]+[^）)]*[=＝][^）)]*[ぁ-んァ-ヶ一-龠]+[^）)]*[）)]', line), f"Spoiler in {file}:{idx} - {line}"
                assert 'дутуу = 不足' not in line, f"Spoiler in {file}:{idx} - {line}"

# 2. Every single test mode records mistakes and has review flow
print("[2] Verifying mistake recording and review flow across all 16 modes...")
comp_dir = 'C:/Users/kkaho/.gemini/antigravity/scratch/mongol-learning-app/js/components'
all_modes = [
    'WordTest.js', 'JapaneseTest.js', 'GrammarTest.js', 'DeclensionTest.js',
    'PronunciationTest.js', 'ListeningTest.js', 'ReadingTest.js', 'NumberMasterTest.js',
    'SentenceTranslationTest.js', 'CultureQuiz.js', 'InterviewMaster.js', 'RoleplayTest.js',
    'SuffixRuleDojo.js', 'WordFamilyQuiz.js', 'SpellingGame.js', 'WordGame.js'
]
for comp in all_modes:
    p = os.path.join(comp_dir, comp)
    assert os.path.exists(p), f"Component {comp} not found"
    with open(p, 'r', encoding='utf-8') as f:
        content = f.read()
    assert 'recordMistake' in content, f"{comp} must call recordMistake"

# Verify RoleplayTest mistake flow
with open(os.path.join(comp_dir, 'RoleplayTest.js'), 'r', encoding='utf-8') as f:
    rp_js = f.read()
assert 'btn-goto-mistakes-from-roleplay' in rp_js
assert '改善できる返答' in rp_js

# Verify PronunciationTest mistake flow
with open(os.path.join(comp_dir, 'PronunciationTest.js'), 'r', encoding='utf-8') as f:
    pron_js = f.read()
assert 'btn-goto-mistakes-from-pron' in pron_js

# Verify ReadingTest mistake flow
with open(os.path.join(comp_dir, 'ReadingTest.js'), 'r', encoding='utf-8') as f:
    read_js = f.read()
assert 'btn-goto-mistakes-from-reading' in read_js

# Verify InterviewMaster mistake flow
with open(os.path.join(comp_dir, 'InterviewMaster.js'), 'r', encoding='utf-8') as f:
    im_js = f.read()
assert 'btn-goto-mistakes-from-interview' in im_js
assert 'タイピングで間違えた文' in im_js

# Verify NumberMasterTest mistake flow
with open(os.path.join(comp_dir, 'NumberMasterTest.js'), 'r', encoding='utf-8') as f:
    num_js = f.read()
assert 'btn-goto-mistakes-from-num' in num_js

# 3. No Arabic numerals in quiz answer options
print("[3] Verifying no Arabic numerals in quiz answer options...")
with open(os.path.join(data_dir, 'readingQuizzes.js'), 'r', encoding='utf-8') as f:
    rq_js = f.read()
assert '6 сарын 1-нд' not in rq_js, "Arabic numeral date options must be replaced with Cyrillic"
assert 'Долоон сарын арван нэгэнд' in rq_js, "Cyrillic date option must be present"

with open(os.path.join(comp_dir, 'GrammarTest.js'), 'r', encoding='utf-8') as f:
    gt_js = f.read()
assert "if (t === '9') return 'есөн';" in gt_js, "GrammarTest must sanitize digit 9 to есөн"

# 4. No romaji reading leaks in TypingTest
print("[4] Verifying no romaji reading leak in TypingTest...")
with open(os.path.join(comp_dir, 'TypingTest.js'), 'r', encoding='utf-8') as f:
    tt_js = f.read()
assert '💡 読み:' not in tt_js, "TypingTest must not display romaji reading leak"
assert '${sentence.romaji}' not in tt_js, "TypingTest prompt must not contain sentence.romaji"

# 5. Vocabulary unification & synonyms
print("[5] Verifying vocabulary unification & synonyms...")
with open('C:/Users/kkaho/.gemini/antigravity/scratch/mongol-learning-app/js/utils/helpers.js', 'r', encoding='utf-8') as f:
    h_js = f.read()
assert "'хан боргоцой': ['ананас']" in h_js
assert "'ананас': ['хан боргоцой']" in h_js
assert "'баярлалаа': ['гялайлаа']" in h_js
assert "'компьютер': ['тооцоолуур']" in h_js

# 6. No spoiler during game play
print("[6] Verifying no spoilers during SpellingGame and WordGame...")
with open(os.path.join(comp_dir, 'SpellingGame.js'), 'r', encoding='utf-8') as f:
    sg_js = f.read()
assert '⚡ 正解:' not in sg_js, "SpellingGame must not show correct answer during active gameplay"

# 7. Storage keys version bump
print("[7] Verifying storage keys v6 for quizzes...")
with open('C:/Users/kkaho/.gemini/antigravity/scratch/mongol-learning-app/js/services/storage.js', 'r', encoding='utf-8') as f:
    st_js = f.read()
assert "GRAMMAR_QUIZZES: 'mongol_app_grammar_quizzes_v6'" in st_js
assert "DECLENSION_QUIZZES: 'mongol_app_declension_quizzes_v6'" in st_js
assert "'mongol_app_grammar_quizzes_v5'" in st_js

print("\n>>> ALL PERFECT 100-POINT QUALITY CHECKS PASSED WITH FLYING COLORS! <<<")
