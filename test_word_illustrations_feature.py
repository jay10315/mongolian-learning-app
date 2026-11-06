import unittest, re, os

class TestWordIllustrationsFeature(unittest.TestCase):
    def setUp(self):
        self.base_dir = r"C:\Users\kkaho\.gemini\antigravity\scratch\mongol-learning-app"
        with open(os.path.join(self.base_dir, "js", "utils", "helpers.js"), "r", encoding="utf-8") as f:
            self.helpers_js = f.read()
        with open(os.path.join(self.base_dir, "js", "components", "GenreWordMaster.js"), "r", encoding="utf-8") as f:
            self.genre_js = f.read()
        with open(os.path.join(self.base_dir, "js", "components", "ReviewNotebook.js"), "r", encoding="utf-8") as f:
            self.review_js = f.read()
        with open(os.path.join(self.base_dir, "js", "components", "Flashcards.js"), "r", encoding="utf-8") as f:
            self.flash_js = f.read()
        with open(os.path.join(self.base_dir, "js", "components", "InterviewMaster.js"), "r", encoding="utf-8") as f:
            self.interview_js = f.read()
        with open(os.path.join(self.base_dir, "index.html"), "r", encoding="utf-8") as f:
            self.index_html = f.read()

    def test_helpers_illustrations_definitions(self):
        """helpers.js has WORD_ILLUSTRATIONS, getWordIllustration, and getWordIllustrationHTML."""
        self.assertIn("export const WORD_ILLUSTRATIONS", self.helpers_js)
        self.assertIn("export function getWordIllustration", self.helpers_js)
        self.assertIn("export function getWordIllustrationHTML", self.helpers_js)
        self.assertIn("window.WORD_ILLUSTRATIONS", self.helpers_js)
        self.assertIn("window.getWordIllustrationHTML", self.helpers_js)

        # Body parts from user screenshot
        for word in ['гар', 'толгой', 'үс', 'хөмсөг', 'нүд', 'чих', 'тоос сорогч']:
            self.assertIn(f"'{word}'", self.helpers_js, f"Missing illustration for {word}")

    def test_renderGrammarExplanationHTML_includes_illustration(self):
        """renderGrammarExplanationHTML displays illustration next to the correct answer."""
        self.assertIn("getWordIllustrationHTML(item", self.helpers_js)
        self.assertIn("correct-answer-text", self.helpers_js)

    def test_genre_word_master_includes_illustrations(self):
        """GenreWordMaster.js displays illustrations on all wordbook cards and in game."""
        self.assertIn("getWordIllustrationHTML(w", self.genre_js)
        self.assertIn("getWordIllustrationHTML(currentQuestion", self.genre_js)

    def test_review_notebook_contrast_and_illustrations(self):
        """ReviewNotebook.js includes illustrations and fixes dark mode contrast."""
        self.assertIn("getWordIllustrationHTML", self.review_js)
        self.assertIn("dark:bg-rose-950", self.review_js)
        self.assertIn("dark:bg-slate-950", self.review_js)
        self.assertIn("dark:text-emerald-400", self.review_js)

    def test_flashcards_includes_illustrations(self):
        """Flashcards.js renders illustrations on front and back cards."""
        self.assertIn("getWordIllustrationHTML(card, { size: 'xl' })", self.flash_js)
        self.assertIn("getWordIllustrationHTML(card, { size: 'lg' })", self.flash_js)

    def test_interview_master_contrast(self):
        """InterviewMaster.js has high-contrast sentence cards and crystal-clear translation."""
        self.assertIn("dark:text-sky-200", self.interview_js)
        self.assertIn("dark:bg-slate-800", self.interview_js)

    def test_index_html_has_dark_mode_class_and_bundled_illustrations(self):
        """index.html contains darkMode: 'class' and word illustration system."""
        self.assertIn("darkMode: 'class'", self.index_html)
        self.assertIn("WORD_ILLUSTRATIONS", self.index_html)
        self.assertIn("getWordIllustrationHTML", self.index_html)

if __name__ == '__main__':
    unittest.main()
