import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

base_dir = r"C:\Users\kkaho\.gemini\antigravity\scratch\mongol-learning-app"

def test_spelling_game():
    print("Testing Spelling Game Feature...")

    # 1. Component file exists
    comp_path = os.path.join(base_dir, 'js', 'components', 'SpellingGame.js')
    assert os.path.exists(comp_path), "SpellingGame.js does not exist"
    with open(comp_path, 'r', encoding='utf-8') as f:
        comp_content = f.read()

    assert 'class SpellingGameComponent' in comp_content, "Missing class SpellingGameComponent"
    assert 'tile_arrange' in comp_content, "Missing tile_arrange mode"
    assert 'free_type' in comp_content, "Missing free_type mode"
    assert 'onCorrectAnswer' in comp_content, "Missing onCorrectAnswer"
    assert 'onWrongAnswer' in comp_content, "Missing onWrongAnswer"
    assert 'fishFedCount' in comp_content, "Missing fish feeding mechanics"
    assert 'fullness' in comp_content, "Missing fullness gauge"
    assert 'resolveKeyToTile' in comp_content, "Missing resolveKeyToTile for keyboard support"
    assert 'resolveLatinCharToCyrillic' in comp_content, "Missing resolveLatinCharToCyrillic"
    assert 'animate-pulse' not in comp_content, "Flashing animate-pulse should be removed from SpellingGame"
    print("  [OK] SpellingGameComponent implementation verified")

    # 2. Check bundled.js
    bundled_path = os.path.join(base_dir, 'bundled.js')
    with open(bundled_path, 'r', encoding='utf-8') as f:
        bundled = f.read()

    assert 'class SpellingGameComponent' in bundled, "Missing class SpellingGameComponent in bundled.js"
    assert 'case \'spelling_game\':' in bundled, "Missing case 'spelling_game' in bundled.js"
    assert 'playMunch' in bundled, "Missing playMunch sound effect in bundled.js"
    assert 'playTile' in bundled, "Missing playTile sound effect in bundled.js"
    print("  [OK] bundled.js contains SpellingGameComponent and sound effects")

    # 3. Check index.html
    html_path = os.path.join(base_dir, 'index.html')
    with open(html_path, 'r', encoding='utf-8') as f:
        html = f.read()

    assert 'case \'spelling_game\':' in html, "Missing case 'spelling_game' in index.html"
    assert 'data-target="spelling_game"' in html, "Missing data-target='spelling_game' in Home card"
    assert '満月のスペルゲーム' in html, "Missing Home card title in index.html"
    assert 'スペルゲーム' in html, "Missing Navbar item in index.html"
    print("  [OK] index.html includes router case and Home card")

    print("All Spelling Game tests passed successfully!")

if __name__ == '__main__':
    test_spelling_game()
