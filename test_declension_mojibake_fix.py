import unittest
import os
import re

class TestDeclensionMojibakeFix(unittest.TestCase):
    def test_no_katakana_su_in_answers(self):
        with open('js/data/declensionQuizzes.js', 'r', encoding='utf-8') as f:
            content = f.read()

        # Specifically check dec_hidden_18
        self.assertIn('answer: "нүднээс"', content, "dec_hidden_18 answer must be Cyrillic нүднээс")
        self.assertNotIn('answer: "нүднээス"', content, "Katakana ス must not be present in answer")

        # Check all answer: "..." in declensionQuizzes.js
        for m in re.finditer(r'answer:\s*"([^"]+)"', content):
            ans = m.group(1)
            self.assertNotIn('ス', ans, f"Answer contains Katakana ス: {ans}")

    def test_bundled_js_declension_fix(self):
        with open('bundled.js', 'r', encoding='utf-8') as f:
            code = f.read()

        self.assertIn('answer: "нүднээс"', code)
        self.assertNotIn('answer: "нүднээス"', code)

if __name__ == '__main__':
    unittest.main()
