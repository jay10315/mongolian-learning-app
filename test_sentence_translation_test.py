import os, sys

def run_test():
    base_dir = r"C:\Users\kkaho\.gemini\antigravity\scratch\mongol-learning-app"

    def read_f(rel):
        with open(os.path.join(base_dir, rel.replace('/', os.sep)), 'r', encoding='utf-8') as f:
            return f.read()

    # 1. SentenceTranslationTest.js
    st_txt = read_f('js/components/SentenceTranslationTest.js')
    assert 'class SentenceTranslationTestComponent' in st_txt, "SentenceTranslationTestComponent must be defined"
    assert 'ja_to_mn' in st_txt and 'mn_to_ja' in st_txt, "Must support both translation directions"
    assert 'btn-insert-char' in st_txt, "Must have Cyrillic character insertion buttons"
    assert 'btn-toggle-sentence-hint' in st_txt, "Must have collapsible hint to prevent spoilers"
    assert 'btn-override-correct' in st_txt, "Must have self-override button for Japanese translation phrasing"
    assert 'btn-goto-mistakes-from-sentence' in st_txt, "Must have direct drill button for mistakes"
    assert 'filter-sentence-res-btn' in st_txt, "Must have filter buttons in results"
    assert 'StorageService.recordMistake' in st_txt, "Must record mistakes"
    assert 'SpeechService.speak' in st_txt, "Must have speech pronunciation playback"

    # 2. app.js
    app_txt = read_f('js/app.js')
    assert "case 'sentence_test':" in app_txt, "app.js must route sentence_test"
    assert 'SentenceTranslationTestComponent' in app_txt, "app.js must import SentenceTranslationTestComponent"

    # 3. Home.js
    home_txt = read_f('js/components/Home.js')
    assert 'data-target="sentence_test"' in home_txt, "Home.js must have sentence_test card"
    assert '文章入力テストモード' in home_txt, "Home.js card must have correct title"

    # 4. Navbar.js
    nav_txt = read_f('js/components/Navbar.js')
    assert "'sentence_test'" in nav_txt, "Navbar.js must have sentence_test tab"

    # 5. bundled.js & index.html
    bundled_txt = read_f('bundled.js')
    assert 'class SentenceTranslationTestComponent' in bundled_txt, "bundled.js must bundle SentenceTranslationTestComponent"
    assert 'data-target="sentence_test"' in bundled_txt, "bundled.js must bundle sentence_test card"

    print("ALL SENTENCE TRANSLATION TEST CHECKS PASSED!")

if __name__ == '__main__':
    run_test()
