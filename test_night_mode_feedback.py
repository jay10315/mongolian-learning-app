# -*- coding: utf-8 -*-
import os, sys

sys.stdout.reconfigure(encoding='utf-8')
base_dir = r"C:\Users\kkaho\.gemini\antigravity\scratch\mongol-learning-app"

def test_night_mode_feedback():
    print("Testing Night Mode Feedback & Correct Answer Styling...")
    css_path = os.path.join(base_dir, 'css', 'styles.css')
    with open(css_path, 'r', encoding='utf-8') as f:
        css = f.read()

    assert 'body.theme-dark .correct-answer-text' in css, "Missing correct-answer-text dark styling"
    assert '#34d399' in css, "Missing #34d399 vibrant emerald for answers in night mode"
    assert 'body.theme-dark [class*="bg-rose-50"]' in css, "Missing dark background for incorrect feedback card"
    assert 'body.theme-dark [class*="bg-emerald-50"]' in css, "Missing dark background for correct feedback card"
    assert 'body.theme-dark [class*="bg-white/"]' in css, "Missing dark background for explanation box"

    rn_path = os.path.join(base_dir, 'js', 'components', 'ReviewNotebook.js')
    with open(rn_path, 'r', encoding='utf-8') as f:
        rn = f.read()
    assert 'correct-answer-text' in rn, "ReviewNotebook.js missing correct-answer-text class"

    h_path = os.path.join(base_dir, 'js', 'utils', 'helpers.js')
    with open(h_path, 'r', encoding='utf-8') as f:
        h = f.read()
    assert 'correct-answer-text' in h, "helpers.js missing correct-answer-text class"

    print("  ✓ All night mode feedback rules and answer styling verified!")

if __name__ == '__main__':
    test_night_mode_feedback()
    print("NIGHT MODE FEEDBACK TEST PASSED!")
