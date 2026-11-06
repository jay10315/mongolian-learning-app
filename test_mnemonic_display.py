# -*- coding: utf-8 -*-
import json, os, sys

sys.stdout.reconfigure(encoding='utf-8')
base_dir = r"C:\Users\kkaho\.gemini\antigravity\scratch\mongol-learning-app"

def test_mnemonic_display():
    print("Testing Mnemonic (語呂合わせ) Engine & Display Across App...")

    # 1. initialVocabulary.js check
    vocab_path = os.path.join(base_dir, 'js', 'data', 'initialVocabulary.js')
    with open(vocab_path, 'r', encoding='utf-8') as f:
        text = f.read()

    start_idx = text.find('[')
    end_idx = text.rfind(']') + 1
    vocab = json.loads(text[start_idx:end_idx])

    mnemonic_words = [w for w in vocab if w.get('mnemonic')]
    print(f"  ✓ Found {len(mnemonic_words)} vocabulary entries with explicit mnemonic field")
    assert len(mnemonic_words) >= 140, f"Expected at least 140 mnemonic words, found {len(mnemonic_words)}"

    # Specific key words
    sample_mnemonics = {
        'тоос сорогч': '埃',
        'хөл': '掘る',
        'мах': 'マハ',
        'ус': '水',
        'явах': '行か',
        'баярлалаа': 'ありがとう'
    }
    vocab_map = {w.get('mongolian', '').strip().lower(): w for w in vocab}
    for word, keyword in sample_mnemonics.items():
        assert word in vocab_map, f"Word {word} missing from vocab"
        m = vocab_map[word].get('mnemonic', '')
        assert keyword in m, f"Word {word} mnemonic '{m}' does not contain '{keyword}'"
        print(f"  ✓ Verified '{word}': {m}")

    # 2. helpers.js check
    h_path = os.path.join(base_dir, 'js', 'utils', 'helpers.js')
    with open(h_path, 'r', encoding='utf-8') as f:
        h = f.read()

    assert 'export const MNEMONICS_MAP' in h, "helpers.js missing MNEMONICS_MAP"
    assert 'export function getWordMnemonicHTML' in h, "helpers.js missing getWordMnemonicHTML"
    assert 'mnemonic-card' in h, "helpers.js missing mnemonic-card class"
    assert '語呂合わせ・楽しい覚え方' in h, "helpers.js missing mnemonic header"
    assert 'getWordMnemonicHTML(item, correctAnswer)' in h, "helpers.js missing mnemonic call in renderGrammarExplanationHTML"

    # 3. ReviewNotebook.js check
    rn_path = os.path.join(base_dir, 'js', 'components', 'ReviewNotebook.js')
    with open(rn_path, 'r', encoding='utf-8') as f:
        rn = f.read()

    assert 'mnemonicHTML' in rn, "ReviewNotebook.js missing mnemonicHTML fallback"
    assert 'getWordMnemonicHTML' in rn, "ReviewNotebook.js missing getWordMnemonicHTML call"

    # 4. GenreWordMaster.js check
    gwm_path = os.path.join(base_dir, 'js', 'components', 'GenreWordMaster.js')
    with open(gwm_path, 'r', encoding='utf-8') as f:
        gwm = f.read()

    assert 'getWordMnemonicHTML' in gwm, "GenreWordMaster.js missing getWordMnemonicHTML"
    assert 'correct-answer-text' in gwm, "GenreWordMaster.js missing correct-answer-text"

    # 5. GrammarTest.js check
    gt_path = os.path.join(base_dir, 'js', 'components', 'GrammarTest.js')
    with open(gt_path, 'r', encoding='utf-8') as f:
        gt = f.read()

    assert 'getWordMnemonicHTML' in gt, "GrammarTest.js missing getWordMnemonicHTML"
    assert 'correct-answer-text' in gt, "GrammarTest.js missing correct-answer-text"

    # 6. css/styles.css check
    css_path = os.path.join(base_dir, 'css', 'styles.css')
    with open(css_path, 'r', encoding='utf-8') as f:
        css = f.read()

    assert '.mnemonic-card' in css, "styles.css missing .mnemonic-card"
    assert 'body.theme-dark .mnemonic-card' in css, "styles.css missing dark theme mnemonic-card styling"

    # 7. index.html bundled check
    idx_path = os.path.join(base_dir, 'index.html')
    with open(idx_path, 'r', encoding='utf-8') as f:
        idx = f.read()

    assert 'MNEMONICS_MAP' in idx, "index.html missing MNEMONICS_MAP"
    assert 'getWordMnemonicHTML' in idx, "index.html missing getWordMnemonicHTML"
    assert '.mnemonic-card' in idx, "index.html missing .mnemonic-card styles"

    print("ALL MNEMONIC TESTS PASSED SUCCESSFULLY!")

if __name__ == '__main__':
    test_mnemonic_display()
