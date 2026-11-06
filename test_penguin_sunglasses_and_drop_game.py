# -*- coding: utf-8 -*-
"""
test_penguin_sunglasses_and_drop_game.py
Tests for Penguin Sunglasses Mode and HAMARU-style Drop Battle Game
"""
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

def test_sunglasses_mode_and_drop_game():
    base_dir = r"C:\Users\kkaho\.gemini\antigravity\scratch\mongol-learning-app"

    # 1. Check PenguinMascot.js
    with open(os.path.join(base_dir, "js", "components", "PenguinMascot.js"), "r", encoding="utf-8") as f:
        mascot_code = f.read()

    assert "isSunglassesMode" in mascot_code, "isSunglassesMode must be defined"
    assert "setSunglassesMode" in mascot_code, "setSunglassesMode must be defined"
    assert "toggleSunglassesMode" in mascot_code, "toggleSunglassesMode must be defined"
    assert "renderSunglassesEyes" in mascot_code, "renderSunglassesEyes must be defined"
    assert "btn-toggle-sunglasses" in mascot_code, "btn-toggle-sunglasses must exist in room modal"
    assert "サングラスモード" in mascot_code, "サングラスモード label must exist"

    # 2. Check Home.js
    with open(os.path.join(base_dir, "js", "components", "Home.js"), "r", encoding="utf-8") as f:
        home_code = f.read()

    assert "btn-home-toggle-sunglasses" in home_code, "btn-home-toggle-sunglasses must exist in Home.js"
    assert "PenguinMascot.toggleSunglassesMode" in home_code, "toggleSunglassesMode must be called in Home.js"
    assert "ペンギンドロップ" in home_code, "ペンギンドロップ must be mentioned in Home.js"

    # 3. Check WordGame.js
    with open(os.path.join(base_dir, "js", "components", "WordGame.js"), "r", encoding="utf-8") as f:
        game_code = f.read()

    assert "data-mode=\"drop\"" in game_code, "data-mode drop must exist"
    assert "drop-arena" in game_code, "drop-arena must exist"
    assert "drop-target-card" in game_code, "drop-target-card must exist"
    assert "drop-laser-beam" in game_code, "drop-laser-beam must exist"
    assert "drop-penguin-mascot" in game_code, "drop-penguin-mascot must exist"
    assert "playLaserSound" in game_code, "playLaserSound must exist"
    assert "handleDropChoiceAnswer" in game_code, "handleDropChoiceAnswer must exist"
    assert "handleDropCrash" in game_code, "handleDropCrash must exist"
    assert "startDropLoop" in game_code, "startDropLoop must exist"
    assert "FEVER" in game_code, "FEVER mode must exist"

    # 4. Check bundled index.html
    with open(os.path.join(base_dir, "index.html"), "r", encoding="utf-8") as f:
        html = f.read()

    assert "btn-home-toggle-sunglasses" in html, "btn-home-toggle-sunglasses must be in index.html"
    assert "data-mode=\"drop\"" in html, "data-mode drop must be in index.html"
    assert "drop-arena" in html, "drop-arena must be in index.html"
    assert "drop-target-card" in html, "drop-target-card must be in index.html"
    assert "drop-laser-beam" in html, "drop-laser-beam must be in index.html"
    assert "isSunglassesMode" in html, "isSunglassesMode must be in index.html"

    # 5. Verify no penguin speech bubble during tests
    for test_file in ["WordTest.js", "GrammarTest.js", "DeclensionTest.js", "JapaneseTest.js"]:
        with open(os.path.join(base_dir, "js", "components", test_file), "r", encoding="utf-8") as f:
            code = f.read()
        assert "renderBubble" not in code, f"renderBubble must not be in {test_file} during questions"

    print("Penguin sunglasses and drop game tests passed successfully!")

if __name__ == '__main__':
    test_sunglasses_mode_and_drop_game()
