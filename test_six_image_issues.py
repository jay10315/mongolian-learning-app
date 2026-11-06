import re

def test_six_image_issues():
    with open('js/utils/helpers.js', 'r', encoding='utf-8') as f:
        helpers_js = f.read()

    with open('js/components/GenreWordMaster.js', 'r', encoding='utf-8') as f:
        genre_js = f.read()

    with open('js/components/DeclensionTest.js', 'r', encoding='utf-8') as f:
        decl_js = f.read()

    with open('js/data/roleplayData.js', 'r', encoding='utf-8') as f:
        roleplay_js = f.read()

    with open('js/data/numberQuizData.js', 'r', encoding='utf-8') as f:
        num_data_js = f.read()

    with open('js/components/NumberMasterTest.js', 'r', encoding='utf-8') as f:
        num_test_js = f.read()

    with open('index.html', 'r', encoding='utf-8') as f:
        index_html = f.read()

    # Image 1: GenreWordMaster illustrations
    assert 'getWordIllustrationHTML' in genre_js, "GenreWordMaster must import getWordIllustrationHTML"
    assert 'getWordIllustrationHTML(w' in genre_js, "GenreWordMaster must render getWordIllustrationHTML on word cards"

    # Image 2: DeclensionTest header badge fallback
    assert '動詞活用: undefined' not in decl_js, "DeclensionTest must not display 動詞活用: undefined"
    assert 'q.targetForm || q.targetCase ||' in decl_js, "DeclensionTest header badge must have safe fallback"

    # Image 3: DeclensionTest pos and override button
    assert 'btn-override-decl-correct' in decl_js, "DeclensionTest must have self-override button"
    assert "pos: '名詞'" in decl_js, "DeclensionTest must supply pos: '名詞' for noun questions"
    assert "【品詞: ${(details && details.pos) || (item && item.pos) || '名詞'}】" in helpers_js, "helpers.js must safely format pos badge"

    # Image 4: Roleplay data no spoiler, no mojibake
    assert '（伝統の正しい返し）' not in roleplay_js, "Roleplay must not contain spoiler (伝統の正しい返し)"
    assert 'Сайн байна уУ' not in roleplay_js, "Roleplay must not contain Katakana mojibake уУ"
    assert 'Сайн байна уウ' not in roleplay_js, "Roleplay must not contain Katakana mojibake уウ"

    # Image 5: NumberQuiz data no spoiler in question
    match = re.search(r'id:\s*[\'"]num_time_2[\'"].*?question:\s*[\'"]([^\'"]+)[\'"]', num_data_js, re.DOTALL)
    assert match, "num_time_2 must exist"
    assert 'дутуу' not in match.group(1), f"num_time_2 question must not have spoiler: {match.group(1)}"

    # Image 6: NumberMasterTest result screen
    assert 'btn-goto-mistakes-from-num' in num_test_js, "NumberMasterTest must have direct button to mistake notebook"
    assert 'filter-num-result-btn' in num_test_js, "NumberMasterTest must have filter buttons for mistakes"
    assert '出題問題の復習' in num_test_js, "NumberMasterTest must have review list"

    print("test_six_image_issues: ALL 6 CHECKS PASSED!")

if __name__ == '__main__':
    test_six_image_issues()
