# -*- coding: utf-8 -*-
import sys
import os
import re
import json

sys.stdout.reconfigure(encoding='utf-8')

base_dir = r"C:\Users\kkaho\.gemini\antigravity\scratch\mongol-learning-app"

def test_visual_and_fixes():
    with open(os.path.join(base_dir, "index.html"), "r", encoding="utf-8") as f:
        html = f.read()

    with open(os.path.join(base_dir, "bundled.js"), "r", encoding="utf-8") as f:
        bundled = f.read()

    # 1. Puter.js completely absent
    assert "js.puter.com" not in html, "ERROR: js.puter.com found in index.html!"
    assert "js.puter.com" not in bundled, "ERROR: js.puter.com found in bundled.js!"
    assert "cleanupUnwantedModals" in bundled, "ERROR: cleanupUnwantedModals missing!"

    # 2. Illustration quizzes in bundle
    assert "initialIllustrationQuizzes" in html, "ERROR: initialIllustrationQuizzes missing in index.html!"
    assert "vq_ger" in html, "ERROR: vq_ger missing in index.html!"
    assert "vq_morin_khuur" in html, "ERROR: vq_morin_khuur missing in index.html!"
    assert "vq_mori" in html, "ERROR: vq_mori missing in index.html!"
    assert "getIllustrationQuizzes" in bundled, "ERROR: getIllustrationQuizzes missing in bundled.js!"

    # 3. Vocabulary v7 and v_2_21 check
    assert "mongol_app_vocabulary_v7" in bundled, "ERROR: mongol_app_vocabulary_v7 key missing!"
    
    # Check v_2_21 definition
    v21_match = re.search(r'\{\s*"id":\s*"v_2_21"[\s\S]*?\}', html)
    assert v21_match, "ERROR: v_2_21 not found in html!"
    v21_str = v21_match.group(0)
    assert '"mongolian": "байхгүй"' in v21_str, f"ERROR: v_2_21 mongolian not байхгүй: {v21_str}"
    assert '"dictForm": "байхгүй"' in v21_str, f"ERROR: v_2_21 dictForm not байхгүй: {v21_str}"
    assert '"pronunciation": "バイフグイ"' in v21_str, f"ERROR: v_2_21 pronunciation not バイフグイ: {v21_str}"

    # 4. WordGame visual genre support
    assert 'data-genre="visual"' in bundled, "ERROR: data-genre=visual missing in WordGame!"
    assert 'イラスト当て' in bundled, "ERROR: イラスト当て button missing in WordGame!"
    assert 'getGenreShortName' in bundled, "ERROR: getGenreShortName missing in WordGame!"

    # 5. WordTest visual mode support
    assert 'value="visual"' in bundled, "ERROR: value=visual missing in WordTest!"

    # 6. ReviewNotebook spoiler and noise fix simulation on user screenshots
    # User Item 1: 翻訳する、通訳する ⇄ орчуул(ах)
    # User Item 2: хоолоор дайл(ах)（モンゴル語教科書語彙） ⇄ хоолоор дайл(ах)
    
    def simulate_parse_review_item(item_question, item_answer):
        rawQ = item_question.strip()
        correctAns = item_answer.strip()
        cleanRawQ = re.sub(r'[（\(]モンゴル語教科書語彙[）\)]', '', rawQ).strip()
        cleanAns = re.sub(r'[（\(]モンゴル語教科書語彙[）\)]', '', correctAns).strip()

        cleanKey = lambda s: re.sub(r'[\(\)（）\s.,!?-]', '', (s or '').lower())
        qClean = cleanKey(cleanRawQ)
        aClean = cleanKey(cleanAns)

        # load vocab
        v_match = re.search(r'initialVocabulary\s*=\s*(\[[\s\S]*?\]);', html)
        allWords = json.loads(v_match.group(1))

        matchedWord = None
        if aClean:
            for w in allWords:
                if aClean in [cleanKey(w.get('mongolian')), cleanKey(w.get('dictForm')), cleanKey(w.get('root'))]:
                    matchedWord = w
                    break
        if not matchedWord and qClean:
            for w in allWords:
                ja = cleanKey(w.get('japanese'))
                if ja and len(ja) >= 2 and ja in qClean:
                    matchedWord = w
                    break

        promptText = ""
        displayPrefix = ""
        if matchedWord:
            isCyrAns = bool(re.search(r'[\u0400-\u04FF]', cleanAns))
            if isCyrAns:
                displayPrefix = '【単語】'
                promptText = matchedWord['japanese']
            else:
                displayPrefix = '【日本語訳】'
                promptText = matchedWord.get('dictForm') or matchedWord.get('mongolian')
        else:
            if re.search(r'⇄|⇆|↔|<->|->', cleanRawQ):
                parts = re.split(r'⇄|⇆|↔|<->|->', cleanRawQ)
                sideA = parts[0].strip().replace('【単語】', '').strip()
                sideB = parts[1].strip() if len(parts) > 1 else ''
                hasCyrA = bool(re.search(r'[\u0400-\u04FF]', sideA))
                hasCyrB = bool(re.search(r'[\u0400-\u04FF]', sideB))
                if hasCyrA and hasCyrB:
                    w = next((x for x in allWords if cleanKey(x.get('mongolian')) == cleanKey(sideA) or cleanKey(x.get('dictForm')) == cleanKey(sideA)), None)
                    if w:
                        promptText = w['japanese']
                    else:
                        promptText = sideA
                else:
                    promptText = sideA if not hasCyrA else sideB
            else:
                promptText = cleanRawQ

        # safety net
        if re.search(r'⇄|⇆|↔|<->|->', promptText):
            promptText = re.split(r'⇄|⇆|↔|<->|->', promptText)[0].strip()
        promptText = re.sub(r'[（\(]モンゴル語教科書語彙[）\)]', '', promptText).strip()

        return promptText, displayPrefix

    p1, _ = simulate_parse_review_item("【単語】 翻訳する、通訳する ⇄ орчуул(ах)", "орчуул(ах)")
    assert "⇄" not in p1, f"Arrow still in p1: {p1}"
    assert "орчуул" not in p1, f"Answer leaked in p1: {p1}"
    assert "翻訳する、通訳する" in p1, f"Expected Japanese meaning in p1, got: {p1}"

    p2, _ = simulate_parse_review_item("【単語】 хоолоор дайл(ах)（モンゴル語教科書語彙） ⇄ хоолоор дайл(ах)", "хоолоор дайл(ах)")
    assert "⇄" not in p2, f"Arrow still in p2: {p2}"
    assert "モンゴル語教科書語彙" not in p2, f"Noise still in p2: {p2}"
    assert "хоолоор" not in p2, f"Answer leaked in p2: {p2}"
    assert "食事をごちそうする" in p2 or "もてなす" in p2, f"Expected Japanese in p2, got: {p2}"

    print(">>> All Visual Quiz & Fix Assertions PASSED Successfully! <<<")

if __name__ == "__main__":
    test_visual_and_fixes()
