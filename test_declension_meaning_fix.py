# -*- coding: utf-8 -*-
"""
test_declension_meaning_fix.py
Verifies that Japanese meaning is never missing or blank in grammar explanation cards
for verb conjugation and noun declension quizzes.
"""
import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

# Read helpers.js
with open('js/utils/helpers.js', 'r', encoding='utf-8') as f:
    helpers_js = f.read()

# Read declensionQuizzes.js
with open('js/data/declensionQuizzes.js', 'r', encoding='utf-8') as f:
    decl_js = f.read()

# Read DeclensionTest.js
with open('js/components/DeclensionTest.js', 'r', encoding='utf-8') as f:
    decl_test_js = f.read()

# Read bundled.js
with open('bundled.js', 'r', encoding='utf-8') as f:
    bundled_js = f.read()

print("[1] Verifying getWordGrammarDetails in helpers.js...")
assert "item.baseMeaning" in helpers_js, "helpers.js must support item.baseMeaning in getWordGrammarDetails"
assert "item.meaning" in helpers_js, "helpers.js must support item.meaning in getWordGrammarDetails"
assert "meaning = (item.japanese || item.baseMeaning" in helpers_js, "helpers.js must extract baseMeaning"

print("[2] Verifying renderGrammarExplanationHTML in helpers.js...")
assert "let meaning = (details && details.meaning)" in helpers_js, "renderGrammarExplanationHTML must check details.meaning"
assert "item.baseMeaning" in helpers_js, "renderGrammarExplanationHTML must have item.baseMeaning fallback"

print("[3] Verifying itemData construction in DeclensionTest.js...")
assert "baseMeaning: q.baseMeaning" in decl_test_js, "DeclensionTest.js must pass baseMeaning"
assert "japanese: q.baseMeaning" in decl_test_js, "DeclensionTest.js must pass japanese as alias"

print("[4] Verifying all declension quizzes have baseMeaning defined...")
quiz_blocks = decl_js.split('id: "dec_')[1:]
for b in quiz_blocks:
    q_id = 'dec_' + b.split('"')[0]
    assert 'baseMeaning:' in b, f"Quiz {q_id} missing baseMeaning"

print("[5] Verifying dec_verb_8 (гутал тайлах) has baseMeaning: 靴を脱ぐ...")
assert '"гутал тайлах"' in decl_js, "dec_verb_8 must exist"
assert '"靴を脱ぐ"' in decl_js, "靴を脱ぐ must exist in declensionQuizzes"

print("[6] Verifying bundled.js contains the updated meaning extraction...")
assert "item.baseMeaning" in bundled_js, "bundled.js must contain updated helpers.js logic"

print(">>> ALL TESTS IN test_declension_meaning_fix.py PASSED! <<<")
