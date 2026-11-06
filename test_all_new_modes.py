import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

base_dir = r"C:\Users\kkaho\.gemini\antigravity\scratch\mongol-learning-app"

def test_new_modes():
    print("Testing new modes and components...")

    # 1. Check data files exist and have non-empty content
    data_files = [
        'js/data/roleplayData.js',
        'js/data/numberQuizData.js',
        'js/data/cultureData.js',
        'js/data/wordFamilyData.js',
        'js/data/expeditionData.js'
    ]
    for df in data_files:
        p = os.path.join(base_dir, df.replace('/', os.sep))
        assert os.path.exists(p), f"Missing data file: {df}"
        with open(p, 'r', encoding='utf-8') as f:
            c = f.read()
            assert len(c) > 200, f"Data file {df} too short"
    print("  [OK] All 5 data files exist and non-empty")

    # 2. Check component files exist
    comp_files = [
        'js/components/RoleplayTest.js',
        'js/components/NumberMasterTest.js',
        'js/components/ShadowingDictationTest.js',
        'js/components/CultureQuiz.js',
        'js/components/WordFamilyQuiz.js',
        'js/components/PenguinExpedition.js'
    ]
    for cf in comp_files:
        p = os.path.join(base_dir, cf.replace('/', os.sep))
        assert os.path.exists(p), f"Missing component file: {cf}"
        with open(p, 'r', encoding='utf-8') as f:
            c = f.read()
            assert 'class ' in c, f"Component file {cf} missing class declaration"
            assert 'render(' in c, f"Component file {cf} missing render method"
    print("  [OK] All 6 component classes exist and implement render()")

    # 3. Check bundled.js contains all 6 components and data
    bundled_p = os.path.join(base_dir, 'bundled.js')
    with open(bundled_p, 'r', encoding='utf-8') as f:
        bundled = f.read()

    expected_symbols = [
        'roleplayScenarios',
        'numberQuizzes',
        'cultureData',
        'wordFamilyData',
        'expeditionDestinations',
        'RoleplayComponent',
        'NumberMasterComponent',
        'ShadowingDictationComponent',
        'CultureQuiz',
        'WordFamilyQuiz',
        'PenguinExpeditionComponent'
    ]
    for sym in expected_symbols:
        assert sym in bundled, f"Missing symbol {sym} in bundled.js"
    print("  [OK] bundled.js contains all new symbols")

    # 4. Check index.html contains the cards and router cases
    index_p = os.path.join(base_dir, 'index.html')
    with open(index_p, 'r', encoding='utf-8') as f:
        html = f.read()

    router_cases = [
        "case 'roleplay':",
        "case 'number_master':",
        "case 'shadowing_dictation':",
        "case 'culture':",
        "case 'word_family':",
        "case 'expedition':"
    ]
    for rc in router_cases:
        assert rc in html, f"Missing router case {rc} in index.html"
    print("  [OK] index.html router covers all 6 new modes")

    # 5. Check Home cards for all 6 modes exist
    cards = [
        'data-target="roleplay"',
        'data-target="number_master"',
        'data-target="shadowing_dictation"',
        'data-target="culture"',
        'data-target="word_family"',
        'data-target="expedition"'
    ]
    for card in cards:
        assert card in html, f"Missing home card {card} in index.html"
    print("  [OK] index.html Home cards cover all 6 new modes")

    # 6. Check SoundEffects proxy and fallback robustness
    assert 'class SoundEffectsBase' in html, "Missing SoundEffectsBase in index.html"
    assert 'new Proxy(SoundEffectsBase' in html, "Missing SoundEffects proxy in index.html"
    assert 'window.SoundEffects = SoundEffects;' in html, "Missing window.SoundEffects assignment"
    print("  [OK] SoundEffects Proxy and fallback are active and globally exported")

    # 7. Check Shadowing & Dictation sentence binding safety
    assert 'const typingSentences = initialTypingSentences;' in bundled, "typingSentences not defined in bundled.js"
    assert 's.mongolian || s.textMn' in bundled, "Missing fallback normalization for textMn in ShadowingDictationComponent"
    print("  [OK] Shadowing & Dictation sentences and fallback normalization verified")

    print("All new mode tests passed successfully!")

if __name__ == '__main__':
    test_new_modes()
