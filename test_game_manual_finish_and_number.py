# -*- coding: utf-8 -*-
import sys
import os

sys.stdout.reconfigure(encoding='utf-8')

base_dir = r"C:\Users\kkaho\.gemini\antigravity\scratch\mongol-learning-app"

def test_manual_finish_and_question_number():
    with open(os.path.join(base_dir, "index.html"), "r", encoding="utf-8") as f:
        html = f.read()

    # 1. Question number tracking
    assert "const questionNumber = this.state.totalAnswered + 1;" in html, "questionNumber calculation must be present"
    assert "第 <span class=\"text-sm font-black text-emerald-700\">${questionNumber}</span> 問" in html, "Question counter must be in HUD"
    assert "第 <span class=\"text-emerald-700 text-sm font-black\">${questionNumber}</span> 問目" in html, "Question counter must be in card header"

    # 2. Manual finish buttons in non-speedrun modes
    assert "id=\"btn-finish-game\"" in html, "Top manual finish button must be in HTML"
    assert "id=\"btn-bottom-finish-game\"" in html, "Bottom manual finish button must be in HTML"
    assert "this.state.mode !== 'speedrun'" in html, "Manual finish button must be conditional for non-speedrun modes"

    # 3. Handler and events
    assert "handleManualFinish" in html, "handleManualFinish handler must be defined"
    assert "this.endGame('manual')" in html, "endGame('manual') must be called upon manual finish"

    print("Word Game Manual Finish & Question Number checks: ALL PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    test_manual_finish_and_question_number()
