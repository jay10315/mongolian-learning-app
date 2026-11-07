# -*- coding: utf-8 -*-
import unittest
import re
import os

class TestAllUserRequirements(unittest.TestCase):
    def test_no_placeholder_guess_meaning_in_codebase(self):
        """1. 「文脈から意味を推測してみましょう」などの曖昧な解説の完全撲滅"""
        forbidden_phrases = [
            "文脈から意味を推測",
            "文脈から意味を考えて",
            "意味を推測してみましょう"
        ]
        for root, dirs, files in os.walk('js'):
            for f in files:
                if f.endswith('.js'):
                    path = os.path.join(root, f)
                    with open(path, 'r', encoding='utf-8') as fp:
                        content = fp.read()
                        for phrase in forbidden_phrases:
                            self.assertNotIn(phrase, content, f"Forbidden placeholder '{phrase}' found in {path}")

    def test_spelling_game_not_standalone_tab_and_in_word_game(self):
        """2. スペルゲーム単独モードの削除と単語ゲーム内への統合"""
        with open('js/components/Navbar.js', 'r', encoding='utf-8') as f:
            nav = f.read()
        self.assertNotIn("{ id: 'spelling_game'", nav, "Navbar must not have standalone spelling_game tab")
        self.assertIn("{ id: 'exercise_notebook'", nav, "Navbar must have exercise_notebook tab")

        # 単語ゲーム（WordGame.js）内にスペルゲーム（お魚スペルシューター）が存在すること
        with open('js/components/WordGame.js', 'r', encoding='utf-8') as f:
            wg = f.read()
        self.assertIn("お魚スペルシューター", wg, "WordGame must contain spelling game entry")
        self.assertIn("data-mode=\"spelling\"", wg, "WordGame must have button to launch spelling game")

    def test_textbook_typing_sentences_available(self):
        """3. タイピング練習に教科書例文（全18課）が追加されていること"""
        with open('js/data/textbookSentences.js', 'r', encoding='utf-8') as f:
            tb = f.read()
        self.assertIn("textbookLessonsData", tb)
        for i in range(1, 19):
            self.assertIn(f'"lesson": {i}', tb, f"Lesson {i} must exist in textbookSentences.js")

        with open('js/data/typingSentences.js', 'r', encoding='utf-8') as f:
            ts = f.read()
        self.assertIn("教科書例文（全18課）", ts)

        with open('js/components/TypingTest.js', 'r', encoding='utf-8') as f:
            tt = f.read()
        self.assertIn("{ id: 'textbook'", tt, "TypingTest must have textbook category option")

    def test_exercise_notebook_quizzes_comprehensive(self):
        """4. 「練習ノート」問題集（全18課）の収録と詳細解説"""
        with open('js/data/exerciseNotebookQuizzes.js', 'r', encoding='utf-8') as f:
            eq = f.read()
        self.assertIn("exerciseNotebookQuizzes", eq)
        for i in range(1, 19):
            self.assertIn(f'"lesson": {i}', eq, f"Lesson {i} must exist in exerciseNotebookQuizzes.js")

        # 各問題に正解理由・文法解説が必ず付与されていること
        explanations = re.findall(r'"explanation":\s*"([^"]+)"', eq)
        self.assertGreaterEqual(len(explanations), 36, "Must have comprehensive explanations for all quizzes")
        for expl in explanations:
            self.assertGreater(len(expl), 20, "Explanation must be detailed and substantial")
            self.assertTrue(
                "文法" in expl or "正解理由" in expl or "接続" in expl or "語尾" in expl or "母音調和" in expl,
                f"Explanation must explain grammar or reasons: {expl[:50]}"
            )

    def test_etymology_rich_card_for_zoolon_togloom(self):
        """6. 単語の成り立ち・構成要素の解説改善（зөөлөн тоглоом等の詳説）"""
        with open('js/utils/helpers.js', 'r', encoding='utf-8') as f:
            helpers = f.read()
        self.assertIn("RICH_ETYMOLOGY_MAP", helpers)
        self.assertIn("зөөлөн тоглоом", helpers)
        self.assertIn("柔らかい、ソフトな", helpers)
        self.assertIn("単独使用可能", helpers)
        self.assertIn("тоглох", helpers)

    def test_review_notebook_and_suffix_rule_no_unclear_prompts(self):
        """5. 単語だけぽつんと出て不親切・答え漏洩になるバグの修正"""
        with open('js/components/SuffixRuleDojo.js', 'r', encoding='utf-8') as f:
            srd = f.read()
        self.assertNotIn("question: `【${q.categoryTitle}】${q.sentencePattern || q.targetWord}`", srd,
                         "SuffixRuleDojo must record meaningful prompt instead of bare targetWord")

        with open('js/components/ReviewNotebook.js', 'r', encoding='utf-8') as f:
            rn = f.read()
        self.assertIn("指示に従い、指定の単語に適切な語尾・格変化を付けた形", rn,
                      "ReviewNotebook must give explicit instruction when question has no blank")

if __name__ == '__main__':
    unittest.main()
