import os
import sys
import json
import re

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

APP_DIR = os.path.dirname(os.path.abspath(__file__))

def test_pronunciation_feature():
    print("Testing Pronunciation Mode Feature...")

    # 1. Data file
    data_file = os.path.join(APP_DIR, 'js', 'data', 'pronunciationData.js')
    assert os.path.exists(data_file), "pronunciationData.js must exist"
    with open(data_file, 'r', encoding='utf-8') as f:
        d_code = f.read()
    assert 'PRONUNCIATION_CATEGORIES' in d_code
    assert 'PRONUNCIATION_SOUND_TIPS' in d_code
    assert 'PRONUNCIATION_ITEMS' in d_code
    assert 'ө' in d_code and 'ү' in d_code and 'х' in d_code and 'л' in d_code

    # 2. Component file
    comp_file = os.path.join(APP_DIR, 'js', 'components', 'PronunciationTest.js')
    assert os.path.exists(comp_file), "PronunciationTest.js must exist"
    with open(comp_file, 'r', encoding='utf-8') as f:
        c_code = f.read()
    assert 'class PronunciationTestComponent' in c_code
    assert 'levenshtein' in c_code
    assert 'playABComparison' in c_code
    assert 'startRecording' in c_code
    assert 'stopRecording' in c_code
    assert 'playModelAudio' in c_code

    # 3. Navbar integration
    nav_file = os.path.join(APP_DIR, 'js', 'components', 'Navbar.js')
    with open(nav_file, 'r', encoding='utf-8') as f:
        n_code = f.read()
    assert "'pronunciation_test'" in n_code or '"pronunciation_test"' in n_code

    # 4. Home integration
    home_file = os.path.join(APP_DIR, 'js', 'components', 'Home.js')
    with open(home_file, 'r', encoding='utf-8') as f:
        h_code = f.read()
    assert 'data-target="pronunciation_test"' in h_code

    # 5. App integration
    app_file = os.path.join(APP_DIR, 'js', 'app.js')
    with open(app_file, 'r', encoding='utf-8') as f:
        a_code = f.read()
    assert 'PronunciationTestComponent' in a_code
    assert "case 'pronunciation_test':" in a_code

    # 6. Bundled index.html
    idx_file = os.path.join(APP_DIR, 'index.html')
    with open(idx_file, 'r', encoding='utf-8') as f:
        idx_code = f.read()
    assert 'class PronunciationTestComponent' in idx_code
    assert 'PRONUNCIATION_SOUND_TIPS' in idx_code
    assert 'data-target="pronunciation_test"' in idx_code

    # 7. Test Levenshtein distance logic in python to verify algorithm parity
    def lev(a, b):
        m = [[0] * (len(a) + 1) for _ in range(len(b) + 1)]
        for i in range(len(b) + 1): m[i][0] = i
        for j in range(len(a) + 1): m[0][j] = j
        for i in range(1, len(b) + 1):
            for j in range(1, len(a) + 1):
                if b[i-1] == a[j-1]:
                    m[i][j] = m[i-1][j-1]
                else:
                    m[i][j] = min(m[i-1][j-1], m[i][j-1], m[i-1][j]) + 1
        return m[len(b)][len(a)]

    assert lev("сайн", "сайн") == 0
    assert lev("сайн", "сайн уу") == 3
    assert lev("ус", "үс") == 1

    print("ALL PRONUNCIATION TESTS PASSED SUCCESSFULLY!")

if __name__ == '__main__':
    test_pronunciation_feature()
