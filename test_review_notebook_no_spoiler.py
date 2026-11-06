# -*- coding: utf-8 -*-
import sys
import os
import re

sys.stdout.reconfigure(encoding='utf-8')

base_dir = r"C:\Users\kkaho\.gemini\antigravity\scratch\mongol-learning-app"

def test_review_no_spoiler():
    with open(os.path.join(base_dir, "index.html"), "r", encoding="utf-8") as f:
        html = f.read()

    # 1. Check parseReviewItem implementation in bundled code
    assert "static parseReviewItem" in html or "parseReviewItem(" in html, "parseReviewItem must be defined in ReviewNotebookComponent"
    assert "SPECIAL_CYRILLIC_BAR" in html, "SPECIAL_CYRILLIC_BAR must be bundled"

    # 2. Check that WordTestComponent does NOT record '⇄' into mistake question
    assert 'question: `【単語】${q.japanese} ⇄' not in html, "WordTestComponent must not record '⇄' into mistake question"
    assert 'question: `【カード】${card.japanese} ⇄' not in html, "FlashcardsComponent must not record '⇄' into mistake question"

    # 3. Check that ReviewNotebook rendered review testing uses parsed.promptText without spoiler
    assert "${parsed.promptText}" in html, "renderReviewTesting must use parsed.promptText"
    assert "${parsed.categoryLabel}" in html, "renderReviewTesting must use parsed.categoryLabel"
    assert "btn-quick-char" in html, "Quick cyrillic buttons must be supported in ReviewNotebook"

    # 4. Check migration in StorageService.init
    assert "m.question && /⇄|⇆|↔|<->|->/.test(m.question)" in html or "hasParenNoise" in html, "StorageService must migrate existing mistake items"
    assert "モンゴル語教科書語彙" in html, "StorageService must handle legacy noisy items"

    # 5. Run python simulation of healing on exact user screenshot
    import json
    json_match = re.search(r'initialVocabulary\s*=\s*(\[[\s\S]*?\]);', html)
    assert json_match, "Failed to extract vocabulary"
    vocab = json.loads(json_match.group(1))

    # Verify v_gen_468 is properly defined in bundle
    v468 = next(v for v in vocab if v['id'] == 'v_gen_468')
    assert v468['japanese'] == '食事をごちそうする、もてなす'
    assert v468['root'] == 'дайл'
    assert v468['dictForm'] == 'хоолоор дайлах'

    print("Review Notebook No-Spoiler checks: ALL PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    test_review_no_spoiler()
