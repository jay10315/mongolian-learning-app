import os
import re
import sys

def test_word_family_expansion_and_games():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    data_path = os.path.join(base_dir, 'js', 'data', 'wordFamilyData.js')
    comp_path = os.path.join(base_dir, 'js', 'components', 'WordFamilyQuiz.js')
    bundle_path = os.path.join(base_dir, 'bundled.js')

    with open(data_path, 'r', encoding='utf-8') as f:
        data_content = f.read()

    with open(comp_path, 'r', encoding='utf-8') as f:
        comp_content = f.read()

    with open(bundle_path, 'r', encoding='utf-8') as f:
        bundle_content = f.read()

    # 1. Check data expansion
    antonym_matches = re.findall(r'wordA\s*:', data_content)
    assert len(antonym_matches) >= 30, f"Expected >= 30 antonym pairs, found {len(antonym_matches)}"

    synonym_matches = re.findall(r'question\s*:', data_content)
    assert len(synonym_matches) >= 15, f"Expected >= 15 synonym quiz questions, found {len(synonym_matches)}"

    family_matches = re.findall(r'root\s*:', data_content)
    assert len(family_matches) >= 12, f"Expected >= 12 word root families, found {len(family_matches)}"

    # 2. Check component interactive game modes
    assert 'initAntonymGame' in comp_content, "Missing initAntonymGame in WordFamilyQuiz.js"
    assert 'initSynonymGame' in comp_content, "Missing initSynonymGame in WordFamilyQuiz.js"
    assert 'initFamilyGame' in comp_content, "Missing initFamilyGame in WordFamilyQuiz.js"
    assert 'onAntonymCardClick' in comp_content, "Missing onAntonymCardClick in WordFamilyQuiz.js"
    assert 'onSynonymChoice' in comp_content, "Missing onSynonymChoice in WordFamilyQuiz.js"
    assert 'onFamilySuffixChoice' in comp_content, "Missing onFamilySuffixChoice in WordFamilyQuiz.js"

    # 3. Check bundled.js contains both
    assert 'initAntonymGame' in bundle_content, "bundled.js missing initAntonymGame"
    assert 'initSynonymGame' in bundle_content, "bundled.js missing initSynonymGame"
    assert 'initFamilyGame' in bundle_content, "bundled.js missing initFamilyGame"
    assert len(re.findall(r'wordA\s*:', bundle_content)) >= 30, "bundled.js missing full antonym data"

    print(f"[OK] Word Family Expansion Test Passed! ({len(antonym_matches)} antonyms, {len(synonym_matches)} synonyms, {len(family_matches)} root families)")

if __name__ == '__main__':
    test_word_family_expansion_and_games()
