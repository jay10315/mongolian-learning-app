import os

def test_result_question_lists():
    with open('js/components/WordTest.js', 'r', encoding='utf-8') as f:
        word_test = f.read()
    assert 'filter-result-btn' in word_test, "filter-result-btn missing in WordTest.js"
    assert 'btn-speak-word-result' in word_test, "btn-speak-word-result missing in WordTest.js"
    assert '⭕ 正解' in word_test, "⭕ 正解 missing in WordTest.js"
    assert 'filteredResults' in word_test, "filteredResults missing in WordTest.js"

    with open('js/components/JapaneseTest.js', 'r', encoding='utf-8') as f:
        ja_test = f.read()
    assert 'filter-ja-result-btn' in ja_test, "filter-ja-result-btn missing in JapaneseTest.js"
    assert 'btn-speak-ja-result' in ja_test, "btn-speak-ja-result missing in JapaneseTest.js"
    assert '⭕ 正解' in ja_test, "⭕ 正解 missing in JapaneseTest.js"

    with open('js/components/GrammarTest.js', 'r', encoding='utf-8') as f:
        gr_test = f.read()
    assert 'filter-grammar-result-btn' in gr_test, "filter-grammar-result-btn missing in GrammarTest.js"
    assert 'btn-speak-grammar-result' in gr_test, "btn-speak-grammar-result missing in GrammarTest.js"
    assert '⭕ 正解' in gr_test, "⭕ 正解 missing in GrammarTest.js"

    with open('js/components/DeclensionTest.js', 'r', encoding='utf-8') as f:
        decl_test = f.read()
    assert 'filter-decl-result-btn' in decl_test, "filter-decl-result-btn missing in DeclensionTest.js"
    assert 'btn-speak-decl-result' in decl_test, "btn-speak-decl-result missing in DeclensionTest.js"
    assert '⭕ 正解' in decl_test, "⭕ 正解 missing in DeclensionTest.js"

    with open('js/components/WordGame.js', 'r', encoding='utf-8') as f:
        game = f.read()
    assert 'correctAnswers' in game, "correctAnswers missing in WordGame.js"
    assert 'filter-wordgame-result-btn' in game, "filter-wordgame-result-btn missing in WordGame.js"
    assert 'btn-speak-game-result' in game, "btn-speak-game-result missing in WordGame.js"
    assert '⭕ 正解' in game, "⭕ 正解 missing in WordGame.js"

    with open('js/components/ReviewNotebook.js', 'r', encoding='utf-8') as f:
        notebook = f.read()
    assert 'renderReviewResult' in notebook, "renderReviewResult missing in ReviewNotebook.js"
    assert 'filter-review-result-btn' in notebook, "filter-review-result-btn missing in ReviewNotebook.js"
    assert 'btn-speak-review-result' in notebook, "btn-speak-review-result missing in ReviewNotebook.js"
    assert '⭕ 克服' in notebook, "⭕ 克服 missing in ReviewNotebook.js"

    with open('bundled.js', 'r', encoding='utf-8') as f:
        bundled = f.read()
    assert 'filter-result-btn' in bundled
    assert 'filter-ja-result-btn' in bundled
    assert 'filter-grammar-result-btn' in bundled
    assert 'filter-decl-result-btn' in bundled
    assert 'filter-wordgame-result-btn' in bundled
    assert 'renderReviewResult' in bundled

    print("All result question list tests passed successfully!")

if __name__ == '__main__':
    test_result_question_lists()
