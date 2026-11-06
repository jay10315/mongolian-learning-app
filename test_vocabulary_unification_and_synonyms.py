# -*- coding: utf-8 -*-
"""
test_vocabulary_unification_and_synonyms.py
Verifies vocabulary standardization and parenthesized synonym display:
1. Standardizes on authentic, commonly used Mongolian words:
   - パイナップル: хан боргоцой (ананас)
   - きゅうり: өргөст хэмх (огурцы)
   - トマト: улаан лооль (помидор)
   - スイカ: тарвас (ший гуа)
   - バナナ: гадил (банана)
   - ソファー: буйдан (диван)
   - テレビ: зурагт (телевизор)
   - ビール: шар айраг (пиво)
   - ワイン: дарс (вино)
2. Alternative expressions displayed in parentheses () during explanation.
3. Both expressions accepted as 100% correct in test evaluation across modes.
4. Duplicate conflicting entries eliminated across wordbook and genre modes.
"""
import sys
import json
import re

sys.stdout.reconfigure(encoding='utf-8')

print("[1] Verifying initialVocabulary.js standardization...")
with open('js/data/initialVocabulary.js', 'r', encoding='utf-8') as f:
    text = f.read()

match = re.search(r'const\s+initialVocabulary\s*=\s*(\[[\s\S]*?\]);', text)
assert match, "initialVocabulary array must exist"
vocab = json.loads(match.group(1))

vocab_by_id = {w.get('id'): w for w in vocab}

# Verify standardized items
pineapple = vocab_by_id.get('v_genre_964')
assert pineapple, "v_genre_964 (pineapple) must exist"
assert pineapple.get('mongolian') == 'хан боргоцой', f"Pineapple must be хан боргоцой, got {pineapple.get('mongolian')}"
assert pineapple.get('altMongolian') == 'ананас', "Pineapple must specify altMongolian: ананас"
assert 'ананас' in pineapple.get('acceptableAnswers', []), "Pineapple acceptableAnswers must include ананас"

cucumber = vocab_by_id.get('v_genre_978')
assert cucumber and cucumber.get('mongolian') == 'өргөст хэмх', "Cucumber must be өргөст хэмх"
assert cucumber.get('altMongolian') == 'огурцы', "Cucumber must specify altMongolian: огурцы"

tomato = vocab_by_id.get('v_genre_981')
assert tomato and tomato.get('mongolian') == 'улаан лооль', "Tomato must be улаан лооль"
assert tomato.get('altMongolian') == 'помидор', "Tomato must specify altMongolian: помидор"

watermelon = vocab_by_id.get('v_genre_958')
assert watermelon and watermelon.get('mongolian') == 'тарвас', "Watermelon must be тарвас"
assert watermelon.get('altMongolian') == 'ший гуа', "Watermelon must specify altMongolian: ший гуа"

banana = vocab_by_id.get('v_genre_955')
assert banana and banana.get('mongolian') == 'гадил', "Banana must be гадил"
assert banana.get('altMongolian') == 'банана', "Banana must specify altMongolian: банана"

sofa = vocab_by_id.get('v_genre_922')
assert sofa and sofa.get('mongolian') == 'буйдан', "Sofa must be буйдан"
assert sofa.get('altMongolian') == 'диван', "Sofa must specify altMongolian: диван"

tv = vocab_by_id.get('v_2_10')
assert tv and tv.get('mongolian') == 'зурагт', "TV must be зурагт"
assert tv.get('altMongolian') == 'телевизор', "TV must specify altMongolian: телевизор"

beer = vocab_by_id.get('v_gen_545')
assert beer and beer.get('mongolian') == 'шар айраг', "Beer must be шар айраг"
assert beer.get('altMongolian') == 'пиво', "Beer must specify altMongolian: пиво"

wine = vocab_by_id.get('v_genre_907')
assert wine and wine.get('mongolian') == 'дарс', "Wine must be дарс"
assert wine.get('altMongolian') == 'вино', "Wine must specify altMongolian: вино"

# Verify duplicate conflicting entries are removed
deprecated_ids = ['v_genre_965', 'v_genre_979', 'v_genre_959', 'v_genre_956', 'v_genre_923', 'v_genre_908', 'v_note_172']
for dep_id in deprecated_ids:
    assert dep_id not in vocab_by_id, f"Deprecated duplicate {dep_id} must not be present in initialVocabulary"

print("  ✓ initialVocabulary.js standardized and cleaned.")

print("[2] Verifying helpers.js synonym mapping & answer evaluation...")
with open('js/utils/helpers.js', 'r', encoding='utf-8') as f:
    helpers_code = f.read()

assert "export const VOCABULARY_SYNONYMS =" in helpers_code, "VOCABULARY_SYNONYMS must be exported"
assert "'хан боргоцой': ['ананас']" in helpers_code, "хан боргоцой synonym must be defined"
assert "'өргөст хэмх': ['огурцы'" in helpers_code, "өргөст хэмх synonym must be defined"
assert "'улаан лооль': ['помидор']" in helpers_code, "улаан лооль synonym must be defined"
assert "getWordSynonyms" in helpers_code, "getWordSynonyms function must exist"
assert "getWordSynonymNote" in helpers_code, "getWordSynonymNote function must exist"

# Test synonym display in renderGrammarExplanationHTML
assert "correct-answer-text" in helpers_code, "correct-answer-text must exist"
assert "altSynNote" in helpers_code, "altSynNote must be checked in renderGrammarExplanationHTML"

print("  ✓ helpers.js synonym mapping verified.")

print("[3] Verifying storage.js migration & mistake notebook sanitization...")
with open('js/services/storage.js', 'r', encoding='utf-8') as f:
    storage_code = f.read()

assert "DEPRECATED_DUPLICATE_ID_MAP" in storage_code, "DEPRECATED_DUPLICATE_ID_MAP must exist in storage.js"
assert "'v_genre_965': 'v_genre_964'" in storage_code, "v_genre_965 must map to v_genre_964"
assert "хан боргоцой (ананас)" in storage_code, "Mistake sanitization must include parenthesized synonym"

print("  ✓ storage.js migration verified.")

print("[4] Verifying ReviewNotebook.js test grading & explanation display...")
with open('js/components/ReviewNotebook.js', 'r', encoding='utf-8') as f:
    review_code = f.read()

assert "getWordSynonyms" in review_code, "ReviewNotebook must import getWordSynonyms"
assert "getWordSynonymNote" in review_code, "ReviewNotebook must import getWordSynonymNote"
assert "getWordSynonyms(item.correctAnswer)" in review_code, "ReviewNotebook must check synonyms of correctAnswer"

print("  ✓ ReviewNotebook.js verified.")

print("[5] Verifying GenreWordMaster.js display of parenthesized synonyms...")
with open('js/components/GenreWordMaster.js', 'r', encoding='utf-8') as f:
    genre_code = f.read()

assert "${w.altMongolian ? ` <span" in genre_code, "GenreWordMaster must display parenthesized altMongolian"

print("  ✓ GenreWordMaster.js verified.")

print("ALL VOCABULARY UNIFICATION AND SYNONYM TESTS PASSED!")
