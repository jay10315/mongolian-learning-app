# -*- coding: utf-8 -*-
import os, sys

sys.stdout.reconfigure(encoding='utf-8')
base_dir = r"C:\Users\kkaho\.gemini\antigravity\scratch\mongol-learning-app"

def test_interview_typing_drill():
    print("Testing Interview Master Typing Drill (質問だけ見てタイピング)...")

    # 1. InterviewMaster.js check
    im_path = os.path.join(base_dir, 'js', 'components', 'InterviewMaster.js')
    with open(im_path, 'r', encoding='utf-8') as f:
        im = f.read()

    assert 'Step 3: 質問だけ見てタイピング' in im, "InterviewMaster.js missing Step 3: 質問だけ見てタイピング"
    assert 'Step 4: 4分スピーチ実践' in im, "InterviewMaster.js missing Step 4: 4分スピーチ実践"
    assert 'static renderStep3(topic)' in im, "InterviewMaster.js missing static renderStep3"
    assert 'static renderStep4(topic)' in im, "InterviewMaster.js missing static renderStep4"
    assert 'static handleTypingSubmit(topic)' in im, "InterviewMaster.js missing handleTypingSubmit"
    assert 'static handleTypingNext(topic)' in im, "InterviewMaster.js missing handleTypingNext"
    assert 'interview-typing-input' in im, "InterviewMaster.js missing interview-typing-input"
    assert 'btn-submit-interview-typing' in im, "InterviewMaster.js missing btn-submit-interview-typing"
    assert 'btn-typing-quick-char' in im, "InterviewMaster.js missing btn-typing-quick-char"
    assert 'isFuzzyMatch' in im, "InterviewMaster.js missing isFuzzyMatch"
    assert 'SoundEffects' in im, "InterviewMaster.js missing SoundEffects"

    # 2. Check 4 step tabs exist
    assert 'data-step="1"' in im, "Missing data-step 1"
    assert 'data-step="2"' in im, "Missing data-step 2"
    assert 'data-step="3"' in im, "Missing data-step 3"
    assert 'data-step="4"' in im, "Missing data-step 4"

    # 3. index.html bundled check
    idx_path = os.path.join(base_dir, 'index.html')
    with open(idx_path, 'r', encoding='utf-8') as f:
        idx = f.read()

    assert 'Step 3: 質問だけ見てタイピング' in idx, "index.html missing Step 3: 質問だけ見てタイピング"
    assert 'interview-typing-input' in idx, "index.html missing interview-typing-input"
    assert 'btn-submit-interview-typing' in idx, "index.html missing btn-submit-interview-typing"

    print("ALL INTERVIEW TYPING DRILL TESTS PASSED!")

if __name__ == '__main__':
    test_interview_typing_drill()
