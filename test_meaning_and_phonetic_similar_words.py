# -*- coding: utf-8 -*-
import unittest
import os
import re

BASE_DIR = r"C:\Users\kkaho\.gemini\antigravity\scratch\mongol-learning-app"

class TestMeaningAndPhoneticSimilarWords(unittest.TestCase):
    def setUp(self):
        self.helpers_path = os.path.join(BASE_DIR, "js", "utils", "helpers.js")
        with open(self.helpers_path, "r", encoding="utf-8") as f:
            self.helpers_code = f.read()

    def test_on_and_jil_in_distinctions(self):
        """Verify он and жил exist with both meaning and phonetic distinctions."""
        self.assertIn('"он": {', self.helpers_code)
        self.assertIn('"жил": {', self.helpers_code)
        self.assertIn('meaningSimilar', self.helpers_code)
        self.assertIn('phoneticSimilar', self.helpers_code)
        self.assertIn('он と жил の使い分け', self.helpers_code)

    def test_other_essential_distinctions(self):
        """Verify other essential distinctions like өдөр vs хоног, том vs их, etc."""
        self.assertIn('"өдөр": {', self.helpers_code)
        self.assertIn('"хоног": {', self.helpers_code)
        self.assertIn('"цаг": {', self.helpers_code)
        self.assertIn('"том": {', self.helpers_code)
        self.assertIn('"хурдан": {', self.helpers_code)
        self.assertIn('"хүйтэн": {', self.helpers_code)
        self.assertIn('"дулаан": {', self.helpers_code)
        self.assertIn('"найз": {', self.helpers_code)

    def test_get_similar_word_html_structure(self):
        """Verify getSimilarWordDistinctionHTML produces dual section for meaning and phonetic similarity."""
        self.assertIn("意味が似ている単語（類義語・使い分け）", self.helpers_code)
        self.assertIn("綴り・発音が似ている単語（音の混同注意）", self.helpers_code)
        self.assertIn("あなたの回答", self.helpers_code)
        self.assertIn("userComparisonHTML", self.helpers_code)

    def test_render_grammar_passes_user_answer(self):
        """Verify renderGrammarExplanationHTML passes userAnswer to getSimilarWordDistinctionHTML."""
        self.assertIn("getSimilarWordDistinctionHTML(item, correctAnswer, { userAnswer })", self.helpers_code)

if __name__ == '__main__':
    unittest.main()
