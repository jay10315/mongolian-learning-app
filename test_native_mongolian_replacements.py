# -*- coding: utf-8 -*-
import os, sys, json

sys.stdout.reconfigure(encoding='utf-8')
base_dir = r"C:\Users\kkaho\.gemini\antigravity\scratch\mongol-learning-app"

def test_native_mongolian_replacements():
    print("Testing Native Mongolian Replacements (No Foreign Russian Loanwords)...")

    # 1. interviewTopics.js check
    it_path = os.path.join(base_dir, 'js', 'data', 'interviewTopics.js')
    with open(it_path, 'r', encoding='utf-8') as f:
        it = f.read()

    assert "Би их сургуульд криминологи сурсан" not in it, "криминологи sentence still present in interviewTopics.js"
    assert '"clozeToken": "криминологи"' not in it, "криминологи token still present in interviewTopics.js"
    assert "Би их сургуульд гэмт хэрэг судлал сурсан" in it, "гэмт хэрэг судлал missing from interviewTopics.js"
    assert '"clozeToken": "гэмт хэрэг судлал"' in it, "clozeToken гэмт хэрэг судлал missing from interviewTopics.js"
    print("  ✓ interviewTopics.js uses гэмт хэрэг судлал")

    # 2. roleplayData.js check
    rp_path = os.path.join(base_dir, 'js', 'data', 'roleplayData.js')
    with open(rp_path, 'r', encoding='utf-8') as f:
        rp = f.read()

    assert "Би их сургуульд криминологи сурсан" not in rp, "криминологи still present in roleplayData.js"
    assert "вокзал" not in rp, "вокзал still present in roleplayData.js"
    assert "Би их сургуульд гэмт хэрэг судлал сурсан" in rp, "гэмт хэрэг судлал missing from roleplayData.js"
    assert "галт тэрэгний буудал" in rp, "галт тэрэгний буудал missing from roleplayData.js"
    print("  ✓ roleplayData.js uses гэмт хэрэг судлал and галт тэрэгний буудал")

    # 3. typingSentences.js check
    ts_path = os.path.join(base_dir, 'js', 'data', 'typingSentences.js')
    with open(ts_path, 'r', encoding='utf-8') as f:
        ts = f.read()

    assert '"textMn": "Би их сургуульд криминологи сурсан' not in ts, "криминологи still present in typingSentences.js"
    assert '"textMn": "Би их сургуульд гэмт хэрэг судлал сурсан' in ts, "гэмт хэрэг судлал missing from typingSentences.js"
    print("  ✓ typingSentences.js uses гэмт хэрэг судлал")

    # 4. initialVocabulary.js check
    iv_path = os.path.join(base_dir, 'js', 'data', 'initialVocabulary.js')
    with open(iv_path, 'r', encoding='utf-8') as f:
        text = f.read()

    start_idx = text.find('[')
    end_idx = text.rfind(']') + 1
    vocab = json.loads(text[start_idx:end_idx])

    vocab_by_id = {w.get('id'): w for w in vocab}

    # v_genre_894 -> жигнэмэг
    w_jig = vocab_by_id.get('v_genre_894')
    assert w_jig and w_jig.get('mongolian') == 'жигнэмэг', f"v_genre_894 is not жигнэмэг: {w_jig}"

    # v_genre_864 -> банзал
    w_ban = vocab_by_id.get('v_genre_864')
    assert w_ban and w_ban.get('mongolian') == 'банзал', f"v_genre_864 is not банзал: {w_ban}"

    # v_gen_210 -> хүрэм
    w_khur = vocab_by_id.get('v_gen_210')
    assert w_khur and w_khur.get('mongolian') == 'хүрэм', f"v_gen_210 is not хүрэм: {w_khur}"

    # v_gen_weather_12 -> агаарын хэм
    w_khem = vocab_by_id.get('v_gen_weather_12')
    assert w_khem and w_khem.get('mongolian') == 'агаарын хэм', f"v_gen_weather_12 is not агаарын хэм: {w_khem}"

    # гэмт хэрэг судлал in vocab
    criminology_item = next((w for w in vocab if w.get('mongolian') == 'гэмт хэрэг судлал'), None)
    assert criminology_item is not None, "гэмт хэрэг судлал missing from vocab"

    # зоогийн газар in vocab
    assert any(w.get('mongolian') == 'зоогийн газар' for w in vocab), "зоогийн газар missing from vocab"

    # 5. index.html check
    idx_path = os.path.join(base_dir, 'index.html')
    with open(idx_path, 'r', encoding='utf-8') as f:
        idx = f.read()

    assert "гэмт хэрэг судлал" in idx, "index.html missing гэмт хэрэг судлал"
    assert "жигнэмэг" in idx, "index.html missing жигнэмэг"
    assert "банзал" in idx, "index.html missing банзал"
    assert "хүрэм" in idx, "index.html missing хүрэм"
    assert "агаарын хэм" in idx, "index.html missing агаарын хэм"

    print("ALL NATIVE MONGOLIAN REPLACEMENT TESTS PASSED!")

if __name__ == '__main__':
    test_native_mongolian_replacements()
