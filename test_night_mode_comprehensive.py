# -*- coding: utf-8 -*-
import os, sys

sys.stdout.reconfigure(encoding='utf-8')
base_dir = r"C:\Users\kkaho\.gemini\antigravity\scratch\mongol-learning-app"

def test_night_mode_comprehensive():
    print("Testing Comprehensive Night Mode Styling & Contrast...")

    css_path = os.path.join(base_dir, 'css', 'styles.css')
    with open(css_path, 'r', encoding='utf-8') as f:
        css = f.read()

    # 1. Check card elevation & translucent white elimination
    assert 'body.theme-dark [class*="bg-slate-50"]' in css, "Missing [class*='bg-slate-50'] dark override"
    assert 'body.theme-dark [class*="bg-white"]' in css, "Missing [class*='bg-white'] dark override"
    assert '#1e293b' in css, "Missing #1e293b solid card elevation in dark theme"

    # 2. Check Japanese text contrast
    assert 'body.theme-dark .sentence-ja-text' in css, "Missing .sentence-ja-text in css"
    assert '#bae6fd' in css, "Missing #bae6fd luminous cyan for Japanese text"

    # 3. Check explanation contrast
    assert 'body.theme-dark .sentence-exp-box' in css, "Missing .sentence-exp-box in css"
    assert 'body.theme-dark .sentence-exp-badge' in css, "Missing .sentence-exp-badge in css"

    # 4. Check audio & number badges
    assert 'body.theme-dark .sentence-audio-btn' in css, "Missing .sentence-audio-btn in css"
    assert 'body.theme-dark .sentence-num-badge' in css, "Missing .sentence-num-badge in css"

    # 5. Check InterviewMaster.js
    im_path = os.path.join(base_dir, 'js', 'components', 'InterviewMaster.js')
    with open(im_path, 'r', encoding='utf-8') as f:
        im = f.read()

    assert 'interview-sentence-card' in im, "InterviewMaster.js missing interview-sentence-card"
    assert 'sentence-ja-text' in im, "InterviewMaster.js missing sentence-ja-text"
    assert 'sentence-mn-text' in im, "InterviewMaster.js missing sentence-mn-text"
    assert 'sentence-exp-box' in im, "InterviewMaster.js missing sentence-exp-box"
    assert 'sentence-audio-btn' in im, "InterviewMaster.js missing sentence-audio-btn"
    assert 'sentence-num-badge' in im, "InterviewMaster.js missing sentence-num-badge"

    # 6. Check index.html bundle
    idx_path = os.path.join(base_dir, 'index.html')
    with open(idx_path, 'r', encoding='utf-8') as f:
        idx = f.read()

    assert 'interview-sentence-card' in idx, "index.html missing interview-sentence-card"
    assert '#bae6fd' in idx, "index.html missing #bae6fd"
    assert '.sentence-ja-text' in idx, "index.html missing .sentence-ja-text"

    print("ALL COMPREHENSIVE NIGHT MODE TESTS PASSED!")

if __name__ == '__main__':
    test_night_mode_comprehensive()
