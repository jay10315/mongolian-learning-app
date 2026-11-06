# -*- coding: utf-8 -*-
import sys
import os

sys.stdout.reconfigure(encoding='utf-8')

base_dir = r"C:\Users\kkaho\.gemini\antigravity\scratch\mongol-learning-app"

def test_collapsible_hints():
    with open(os.path.join(base_dir, "bundled.js"), "r", encoding="utf-8") as f:
        code = f.read()

    # 1. WordGame toggle
    assert "btn-toggle-game-hint" in code, "WordGame must have btn-toggle-game-hint"
    assert "game-hint-content" in code, "WordGame must have game-hint-content"
    assert 'class="hidden mt-2 animate-fade-in"' in code or 'id="game-hint-content" class="hidden' in code, "WordGame hint must be hidden by default"

    # 2. WordTest toggle
    assert "btn-toggle-word-hint" in code, "WordTest must have btn-toggle-word-hint"
    assert "word-hint-content" in code, "WordTest must have word-hint-content"
    assert 'id="word-hint-content" class="hidden' in code, "WordTest hint must be hidden by default"

    # 3. JapaneseTest toggle
    assert "btn-toggle-ja-hint" in code, "JapaneseTest must have btn-toggle-ja-hint"
    assert "ja-hint-content" in code, "JapaneseTest must have ja-hint-content"
    assert 'id="ja-hint-content" class="hidden' in code, "JapaneseTest hint must be hidden by default"

    # 4. ReviewNotebook toggle
    assert "btn-toggle-review-hint" in code, "ReviewNotebook must have btn-toggle-review-hint"
    assert "review-hint-content" in code, "ReviewNotebook must have review-hint-content"
    assert 'id="review-hint-content" class="hidden' in code, "ReviewNotebook hint must be hidden by default"

    # 5. GrammarTest toggle
    assert "btn-toggle-grammar-hint" in code, "GrammarTest must have btn-toggle-grammar-hint"
    assert "grammar-hint-content" in code, "GrammarTest must have grammar-hint-content"
    assert 'id="grammar-hint-content" class="hidden' in code, "GrammarTest hint must be hidden by default"

    print(">>> Collapsible Hints Tests: ALL PASSED SUCCESSFULLY! <<<")

if __name__ == "__main__":
    test_collapsible_hints()
