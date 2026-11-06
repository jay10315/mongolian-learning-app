import os
import re

APP_DIR = os.path.dirname(os.path.abspath(__file__))

def test_pronunciation_caution_display():
    helpers_file = os.path.join(APP_DIR, 'js', 'utils', 'helpers.js')
    with open(helpers_file, 'r', encoding='utf-8') as f:
        helpers_code = f.read()

    assert 'export function isPronunciationCautionWord' in helpers_code, "isPronunciationCautionWord must be exported in helpers.js"
    assert 'PRONUNCIATION_CAUTION_WORDS' in helpers_code, "PRONUNCIATION_CAUTION_WORDS must exist in helpers.js"
    assert 'window.isPronunciationCautionWord = isPronunciationCautionWord' in helpers_code, "Must attach to window"

    genre_file = os.path.join(APP_DIR, 'js', 'components', 'GenreWordMaster.js')
    with open(genre_file, 'r', encoding='utf-8') as f:
        genre_code = f.read()

    assert 'isPronunciationCautionWord' in genre_code, "GenreWordMaster must import/use isPronunciationCautionWord"
    # Ensure choice button subText does NOT unconditionally append pronunciation
    assert "subText: isMnToJa ? '' : `[${w.pronunciation || ''}]`" not in genre_code, "Must not unconditionally show Katakana in quiz choices"

    jp_file = os.path.join(APP_DIR, 'js', 'components', 'JapaneseTest.js')
    with open(jp_file, 'r', encoding='utf-8') as f:
        jp_code = f.read()
    assert 'isPronunciationCautionWord' in jp_code, "JapaneseTest must use isPronunciationCautionWord"

    wt_file = os.path.join(APP_DIR, 'js', 'components', 'WordTest.js')
    with open(wt_file, 'r', encoding='utf-8') as f:
        wt_code = f.read()
    assert 'isPronunciationCautionWord' in wt_code, "WordTest must use isPronunciationCautionWord"

    print("[PASS] test_pronunciation_caution_display passed successfully!")

if __name__ == '__main__':
    test_pronunciation_caution_display()
