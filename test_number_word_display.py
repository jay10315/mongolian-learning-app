import re

def test_number_word_display():
    with open('js/data/grammarQuizzes.js', 'r', encoding='utf-8') as f:
        gq_js = f.read()

    with open('js/data/initialGrammar.js', 'r', encoding='utf-8') as f:
        ig_js = f.read()

    with open('js/components/GrammarTest.js', 'r', encoding='utf-8') as f:
        gt_js = f.read()

    with open('js/services/storage.js', 'r', encoding='utf-8') as f:
        storage_js = f.read()

    with open('index.html', 'r', encoding='utf-8') as f:
        index_html = f.read()

    # 1. grammarQuizzes.js
    assert '"есөн"' in gq_js, "grammarQuizzes tokens must use есөн instead of 9"
    assert '"9"' not in gq_js, "grammarQuizzes tokens must not contain '9'"
    assert 'Хичээл есөн цагт эхэлнэ.' in gq_js, "grammarQuizzes answer must use есөн цагт"
    assert 'Өнөөдөр аравдугаар сарын арван дөрөвний өдөр.' in gq_js, "grammarQuizzes answer must use Mongolian month and day"

    # 2. initialGrammar.js
    assert 'Хичээл есөн цагт эхэлнэ.' in ig_js, "initialGrammar must use есөн цагт"
    assert 'Хичээл 9 цагт эхэлнэ.' not in ig_js, "initialGrammar must not contain 9 цагт"

    # 3. GrammarTest.js
    assert 'displayToken' in gt_js, "GrammarTest must compute displayToken for Mongolian numbers"
    assert "token === '9' ? 'есөн'" in gt_js, "GrammarTest must convert 9 to есөн in dropzone and tokens"

    # 4. StorageService.js
    assert 'есөн цагт' in storage_js, "StorageService must sanitize 9 цагт to есөн цагт"

    # 5. index.html
    assert 'Хичээл есөн цагт эхэлнэ.' in index_html, "index.html must contain updated Mongolian answer"
    assert '"есөн"' in index_html, "index.html must contain token есөн"

    print("test_number_word_display: ALL CHECKS PASSED!")

if __name__ == '__main__':
    test_number_word_display()
