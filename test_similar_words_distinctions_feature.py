import unittest
import re

class TestSimilarWordsDistinctionsFeature(unittest.TestCase):
    def test_helpers_similar_words_distinctions_defined(self):
        with open('js/utils/helpers.js', 'r', encoding='utf-8') as f:
            helpers = f.read()

        self.assertIn('SIMILAR_WORDS_DISTINCTIONS', helpers)
        self.assertIn('getSimilarWordDistinctionHTML', helpers)
        self.assertIn('window.getSimilarWordDistinctionHTML = getSimilarWordDistinctionHTML', helpers)
        self.assertIn('window.SIMILAR_WORDS_DISTINCTIONS = SIMILAR_WORDS_DISTINCTIONS', helpers)
        self.assertIn('similar-word-card', helpers)
        self.assertIn('似ている単語との違い・使い分け', helpers)

        # Check key pairs
        key_words = ['мэдэх', 'ойлгох', 'бодох', 'болох', 'харах', 'харих', 'ус', 'үс', 'сурах', 'суух', 'авах', 'явах', 'их', 'олон', 'сайхан', 'гоё', 'хөөрхөн', 'хууль', 'гэмт хэрэг', 'эрх чөлөө', 'шинエ'.replace('エ', 'э'), 'хуучин', 'хөгшин']
        for kw in key_words:
            self.assertIn(f'"{kw}":', helpers, f"Missing distinction for {kw}")

    def test_helpers_render_grammar_explanation_integration(self):
        with open('js/utils/helpers.js', 'r', encoding='utf-8') as f:
            helpers = f.read()

        self.assertIn('getSimilarWordDistinctionHTML(item, correctAnswer)', helpers)
        self.assertIn('getSimilarWordDistinctionHTML(wordObj, wordObj.mongolian || mn)', helpers)

    def test_genre_word_master_integration(self):
        with open('js/components/GenreWordMaster.js', 'r', encoding='utf-8') as f:
            gm = f.read()

        self.assertIn('getSimilarWordDistinctionHTML(w, w.mongolian)', gm)
        self.assertIn('getSimilarWordDistinctionHTML(currentQuestion, currentQuestion.mongolian)', gm)

    def test_flashcards_integration(self):
        with open('js/components/Flashcards.js', 'r', encoding='utf-8') as f:
            fc = f.read()

        self.assertIn('getSimilarWordDistinctionHTML(card, card.mongolian)', fc)

    def test_bundled_js_has_feature(self):
        with open('bundled.js', 'r', encoding='utf-8') as f:
            bundled = f.read()

        self.assertIn('SIMILAR_WORDS_DISTINCTIONS', bundled)
        self.assertIn('getSimilarWordDistinctionHTML', bundled)
        self.assertIn('似ている単語との違い・使い分け', bundled)

if __name__ == '__main__':
    unittest.main()
