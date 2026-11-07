# -*- coding: utf-8 -*-
import unittest
import re
import os

class TestAllUserRequirements(unittest.TestCase):
    def test_no_placeholder_guess_meaning_in_codebase(self):
        """1. 「文脈から意味を推測してみましょう」「複合語構成要素」などの曖昧な解説の完全撲滅"""
        forbidden_phrases = [
            "文脈から意味を推測",
            "意味を推測してください",
            "複合語構成要素",
            "文脈で活用・結合"
        ]
        for root, dirs, files in os.walk('js'):
            for f in files:
                if f.endswith('.js'):
                    path = os.path.join(root, f)
                    with open(path, 'r', encoding='utf-8') as fp:
                        content = fp.read()
                        for phrase in forbidden_phrases:
                            self.assertNotIn(phrase, content, f"Forbidden placeholder '{phrase}' found in {path}")

    def test_home_and_navbar_menu_spelling_game_replaced(self):
        """2. ホーム画面およびナビバーからスペルゲーム独立カードが削除され、練習ノートに差し替えられていること"""
        with open('js/components/Home.js', 'r', encoding='utf-8') as f:
            home = f.read()
        self.assertNotIn('data-target="spelling_game"', home, "Home.js must not have standalone spelling_game card")
        self.assertIn('data-target="exercise_notebook"', home, "Home.js must have exercise_notebook card")

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

    def test_exercise_notebook_full_quizzes_comprehensive(self):
        """4. 「練習ノート」問題集（全18課・1200問以上）の完全収録と詳細解説"""
        with open('js/data/exerciseNotebookQuizzes.js', 'r', encoding='utf-8') as f:
            eq = f.read()
        self.assertIn("exerciseNotebookQuizzes", eq)
        for i in range(1, 19):
            self.assertIn(f'"lesson": {i}', eq, f"Lesson {i} must exist in exerciseNotebookQuizzes.js")

        # 原本の全問（1200問以上）が収録されていること
        quiz_ids = re.findall(r'"id":\s*"ex_l\d+_q\d+"', eq)
        self.assertGreaterEqual(len(quiz_ids), 1000, f"Must have over 1000 quizzes, found {len(quiz_ids)}")

        # 各問題に正解理由・文法解説が必ず付与されていること
        explanations = re.findall(r'"explanation":\s*"([^"]+)"', eq)
        self.assertGreaterEqual(len(explanations), 1000)

    def test_tul_and_gishuun_meaning_correctly_registered(self):
        """5. тул, гишүүн, ярилцах の正確な辞書登録と意味"""
        with open('js/data/initialVocabulary.js', 'r', encoding='utf-8') as f:
            vocab = f.read()
        self.assertIn('"mongolian": "тул"', vocab)
        self.assertIn("〜ので、〜だから", vocab)
        self.assertIn('"mongolian": "гишүүн"', vocab)
        self.assertIn("メンバー、構成員、会員", vocab)
        self.assertIn('"mongolian": "ярилцах"', vocab)
        self.assertIn("話し合う、語り合う", vocab)

    def test_yariltsana_matches_yariltsakh_not_room(self):
        """6. ярилцана の動詞語幹マッチが ярилцах өрөө に横取りされないこと"""
        with open('js/utils/helpers.js', 'r', encoding='utf-8') as f:
            helpers = f.read()
        self.assertIn("df.includes(' ')", helpers)
        self.assertIn("ярилцах өрөөなどの複合語による誤マッチを完全防止", helpers)

    def test_etymology_rich_card_for_zoolon_togloom_and_zuragtai(self):
        """7. 単語の成り立ち・構成要素の解説改善（зөөлөн тоглоом、зурагтай ном等の詳説）"""
        with open('js/utils/helpers.js', 'r', encoding='utf-8') as f:
            helpers = f.read()
        self.assertIn("RICH_ETYMOLOGY_MAP", helpers)
        self.assertIn("зөөлөн тоглоом", helpers)
        self.assertIn("зурагтай ном", helpers)
        self.assertIn("сайн дурын гишүүн", helpers)
        self.assertIn("絵のある、絵付きの", helpers)

    def test_review_notebook_and_suffix_rule_no_unclear_prompts(self):
        """8. 単語だけぽつんと出て不親切・答え漏洩になるバグの修正"""
        with open('js/components/SuffixRuleDojo.js', 'r', encoding='utf-8') as f:
            srd = f.read()
        self.assertNotIn("question: `【${q.categoryTitle}】${q.sentencePattern || q.targetWord}`", srd)

        with open('js/components/ReviewNotebook.js', 'r', encoding='utf-8') as f:
            rn = f.read()
        self.assertIn("指示に従い、指定の単語に適切な語尾・格変化を付けた形", rn)

if __name__ == '__main__':
    unittest.main()
