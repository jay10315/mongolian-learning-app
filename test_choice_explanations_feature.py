import re
import unittest

class TestChoiceExplanationsFeature(unittest.TestCase):
    def test_helpers_render_choice_explanations(self):
        with open('js/utils/helpers.js', 'r', encoding='utf-8') as f:
            helpers = f.read()

        self.assertIn('function renderChoiceExplanationsHTML', helpers)
        self.assertIn('window.renderChoiceExplanationsHTML = renderChoiceExplanationsHTML', helpers)
        self.assertIn('choice-explanations-accordion', helpers)
        self.assertIn('btn-speak-choice-word', helpers)
        self.assertIn('getWordIllustrationHTML', helpers)
        self.assertIn('getWordEtymologyHTML', helpers)
        self.assertIn('getWordMnemonicHTML', helpers)

    def test_word_test_integration(self):
        with open('js/components/WordTest.js', 'r', encoding='utf-8') as f:
            wt = f.read()

        self.assertIn('choices: this.state.choices ? [...this.state.choices] : null', wt)
        self.assertIn('renderChoiceExplanationsHTML(r.choices', wt)
        self.assertIn('renderChoiceExplanationsHTML(this.state.choices', wt)
        self.assertIn('.btn-speak-choice-word', wt)

    def test_japanese_test_integration(self):
        with open('js/components/JapaneseTest.js', 'r', encoding='utf-8') as f:
            jt = f.read()

        self.assertIn('choices: this.state.choices ? [...this.state.choices] : null', jt)
        self.assertIn('renderChoiceExplanationsHTML(r.choices', jt)
        self.assertIn('renderChoiceExplanationsHTML(this.state.choices', jt)
        self.assertIn('.btn-speak-choice-word', jt)

    def test_genre_word_master_integration(self):
        with open('js/components/GenreWordMaster.js', 'r', encoding='utf-8') as f:
            gm = f.read()

        self.assertIn('this.state.gameResults = [];', gm)
        self.assertIn('this.state.gameResults.push({', gm)
        self.assertIn('renderChoiceExplanationsHTML(gameChoices.map', gm)
        self.assertIn('renderChoiceExplanationsHTML(res.choices', gm)
        self.assertIn('出題問題と選択肢の全解説', gm)
        self.assertIn('.btn-speak-choice-word', gm)

    def test_word_game_integration(self):
        with open('js/components/WordGame.js', 'r', encoding='utf-8') as f:
            wg = f.read()

        self.assertIn('choices: this.state.choices ? [...this.state.choices] : null', wg)
        self.assertIn('renderChoiceExplanationsHTML(m.choices', wg)
        self.assertIn('.btn-speak-choice-word', wg)

if __name__ == '__main__':
    unittest.main()
