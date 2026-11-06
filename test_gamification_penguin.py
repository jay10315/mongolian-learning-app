# -*- coding: utf-8 -*-
import xml.etree.ElementTree as ET
import os

base_dir = r"C:\Users\kkaho\.gemini\antigravity\scratch\mongol-learning-app"

def test_mascot_and_gamification():
    with open(os.path.join(base_dir, "index.html"), "r", encoding="utf-8") as f:
        html = f.read()

    # 1. Mascot class and components
    assert "class PenguinMascot" in html, "PenguinMascot must be in index.html"
    assert "class GamificationService" in html, "GamificationService must be in index.html"
    assert "Монгол малгай" in html or "penguin-mascot" in html, "Mongolian penguin hat / mascot must be defined"

    # 2. Site-wide progress integration
    assert "btn-penguin-status" in html, "Navbar must include penguin level indicator"
    assert "Оцон шувуу" in html, "Penguin Cyrillic text (Оцон шувуу) must be present"
    assert "ペンギン相棒" not in html, "Obsolete 'ペンギン相棒' must be removed"
    assert "renderGameResultCard" in html, "Unified result card must be bundled"

    # 3. Check integration in all 4 tests
    tests_names = ["WordTestComponent", "JapaneseTestComponent", "GrammarTestComponent", "DeclensionTestComponent"]
    for t in tests_names:
        assert t in html, f"{t} must be bundled in index.html"

    # 4. Check Titles
    titles = ["モンゴル語初心者", "単語ハンター", "文法探検家", "モンゴル語チャレンジャー", "モンゴル語マスター", "草原の覇者"]
    for title in titles:
        assert title in html, f"Title {title} must be defined in gamification titles"

    # 5. Check level up and celebration
    assert "showCelebrationModal" in html, "Level up celebration modal must be bundled"
    assert "LEVEL UP" in html, "Level up banner text must be present"

    print("Penguin Mascot & Unified Gamification checks PASSED!")

if __name__ == "__main__":
    test_mascot_and_gamification()
