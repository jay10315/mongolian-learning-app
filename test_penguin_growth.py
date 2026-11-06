# -*- coding: utf-8 -*-
import os

base_dir = r"C:\Users\kkaho\.gemini\antigravity\scratch\mongol-learning-app"

def test_penguin_growth_system():
    with open(os.path.join(base_dir, "index.html"), "r", encoding="utf-8") as f:
        html = f.read()

    # 1. Check Stages definition
    assert "PENGUIN_STAGES" in html, "PENGUIN_STAGES must be bundled in index.html"
    stages = ["ヒナペンギン", "みならいペンギン", "ぼうけんペンギン", "語り部ペンギン", "草原の覇者ペンギン"]
    for s in stages:
        assert s in html, f"Stage {s} must be present in index.html"

    # 2. Check Streak Expressions
    assert "STREAK_EXPRESSIONS" in html, "STREAK_EXPRESSIONS must be bundled"
    expressions = ["草原のイケペン", "目配せウインク", "うるうる尊い瞳", "黄金のオーラ"]
    for e in expressions:
        assert e in html, f"Expression {e} must be present in index.html"

    # 3. Check Penguin Room Modal
    assert "showPenguinRoomModal" in html, "showPenguinRoomModal must be present"
    assert "penguin-room-modal" in html, "penguin-room-modal id must be defined"
    assert "ペンギンのお部屋" in html, "Penguin room title must be present"

    # 4. Check Evolution Modal
    assert "showEvolutionModal" in html, "showEvolutionModal must be present"
    assert "PENGUIN EVOLUTION" in html, "Evolution celebration text must be present"

    # 5. Check visual stage elements in SVG
    assert "たまごの殻帽子" in html, "Baby eggshell cap must be in SVG"
    assert "草原のバンダナ" in html, "Bandana must be in SVG"
    assert "青デール" in html or "モンゴル青デール" in html or "青デールと金帯" in html, "Deel must be in SVG"
    assert "馬頭琴" in html, "Morin khuur must be in SVG"
    assert "王者の真紅マント" in html or "真紅マント" in html or "黄金の王冠" in html, "Champion cape/crown must be in SVG"

    # 6. Check interaction buttons in Home, Navbar, WordGame
    assert "home-penguin-room-btn" in html, "Home screen must have penguin room button"
    assert "btn-open-penguin-room" in html, "WordGame must have penguin room button"
    assert "btn-penguin-status" in html, "Navbar must have penguin status pill"

    print("ALL Penguin Growth & Evolution checks PASSED!")

if __name__ == "__main__":
    test_penguin_growth_system()
