# -*- coding: utf-8 -*-
import json
import re
import os

base_dir = r"C:\Users\kkaho\.gemini\antigravity\scratch\mongol-learning-app"

def test_word_game_integration():
    with open(os.path.join(base_dir, "index.html"), "r", encoding="utf-8") as f:
        html = f.read()

    # 1. Check if WordGameComponent is defined and in HTML
    assert "class WordGameComponent" in html, "WordGameComponent must be bundled in index.html"
    assert "case 'word_game':" in html, "word_game route must be present in app.js"
    assert "data-target=\"word_game\"" in html, "Home screen must have a card leading to word_game"
    assert "data-tab=\"word_game\"" in html or "'word_game'" in html, "Navbar must include word_game"

    # 2. Check 4 Game Modes
    modes = ['speedrun', 'survival', 'combo', 'relax']
    for m in modes:
        assert f"data-mode=\"{m}\"" in html, f"Game mode {m} must be selectable"

    # 3. Check Gamification & XP & Achievements
    assert "recordGameResult" in html, "StorageService must have recordGameResult"
    assert "getGameStats" in html, "StorageService must have getGameStats"
    assert "unlockedAchievements" in html, "StorageService must track achievements"
    assert "草原の覇者" in html, "High level titles must be defined"
    assert "草原の見習い" in html, "Initial title must be defined"

    # 4. Check HUD & Gameplay elements
    assert "btn-game-choice" in html, "4-choice buttons must exist"
    assert "game-text-input" in html, "Text input option must exist"
    assert "btn-speak-game-word" in html, "TTS pronunciation button must exist"
    assert "calculateRank" in html, "Rank evaluation (S/A/B/C) must exist"
    assert "btn-save-all-mistakes" in html, "Mistake notebook save option must exist"

    print("All Word Game unit & integration checks PASSED!")

if __name__ == "__main__":
    test_word_game_integration()
