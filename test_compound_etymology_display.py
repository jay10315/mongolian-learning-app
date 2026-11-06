# -*- coding: utf-8 -*-
import json, os, sys, re

sys.stdout.reconfigure(encoding='utf-8')
base_dir = r"C:\Users\kkaho\.gemini\antigravity\scratch\mongol-learning-app"

def test_compound_etymology():
    print("Testing Compound & Derived Word Etymology Breakdown Engine...")

    # 1. initialVocabulary.js check
    vocab_path = os.path.join(base_dir, 'js', 'data', 'initialVocabulary.js')
    with open(vocab_path, 'r', encoding='utf-8') as f:
        text = f.read()

    start_idx = text.find('[')
    end_idx = text.rfind(']') + 1
    vocab = json.loads(text[start_idx:end_idx])

    by_mn = {w.get('mongolian', '').strip().lower(): w for w in vocab}

    test_words = [
        ('тоос сорогч', '掃除機'),
        ('толь бичиг', '辞書'),
        ('галт тэрэг', '列車'),
        ('хөлийн өсгий', 'かかと'),
        ('эрх чөлөө', '自由')
    ]

    for mn, ja_part in test_words:
        assert mn.lower() in by_mn, f"Word {mn} missing from initialVocabulary.js"
        item = by_mn[mn.lower()]
        deriv = item.get('derivation', '')
        assert '＋' in deriv or '+' in deriv, f"Compound {mn} missing + breakdown: {deriv}"
        print(f"  ✓ Word '{mn}' has breakdown: {deriv[:60]}...")

    # 2. helpers.js check
    h_path = os.path.join(base_dir, 'js', 'utils', 'helpers.js')
    with open(h_path, 'r', encoding='utf-8') as f:
        h = f.read()

    assert 'export function getWordEtymologyHTML' in h, "helpers.js missing getWordEtymologyHTML"
    assert 'etymology-breakdown-card' in h, "helpers.js missing etymology-breakdown-card"
    assert '単語の成り立ち・構成' in h, "helpers.js missing etymology label"

    # 3. ReviewNotebook.js check
    rn_path = os.path.join(base_dir, 'js', 'components', 'ReviewNotebook.js')
    with open(rn_path, 'r', encoding='utf-8') as f:
        rn = f.read()

    assert 'renderGrammarExplanationHTML' in rn, "ReviewNotebook.js missing renderGrammarExplanationHTML"
    assert 'getWordEtymologyHTML' in rn, "ReviewNotebook.js missing getWordEtymologyHTML"
    # Ensure it's not restricted to parsed.isVerb only
    assert 'if (matchedWord)' in rn, "ReviewNotebook.js should render full explanation for all matched words, not just verbs"

    # 4. css/styles.css check
    css_path = os.path.join(base_dir, 'css', 'styles.css')
    with open(css_path, 'r', encoding='utf-8') as f:
        css = f.read()

    assert '.etymology-breakdown-card' in css, "styles.css missing .etymology-breakdown-card"

    print("ALL COMPOUND ETYMOLOGY TESTS PASSED!")

if __name__ == '__main__':
    test_compound_etymology()
