import unittest
import json
import re

class TestNoJicaOrLessonNotations(unittest.TestCase):
    def test_bundled_js_has_no_displayed_jica_or_lesson_numbers(self):
        with open('bundled.js', 'r', encoding='utf-8') as f:
            js = f.read()

        # No 第X課 should exist in bundled.js
        lesson_matches = re.findall(r'第\d+課|第[一二三四五六七八九十]+課|第何課', js)
        self.assertEqual(lesson_matches, [], f"Found lesson numbers in bundled.js: {lesson_matches}")

        # Any JICA occurrences should ONLY be in sanitization / regex cleaning routines
        jica_occurrences = []
        for line_num, line in enumerate(js.splitlines(), 1):
            if 'JICA' in line:
                # Must be a sanitizer line or comment
                is_sanitizer = ('replace(' in line or 'test(' in line or '//' in line)
                self.assertTrue(
                    is_sanitizer,
                    f"Line {line_num} contains un-sanitized JICA reference: {line.strip()}"
                )

    def test_vocabulary_has_no_jica_or_lesson_categories(self):
        with open('js/data/initialVocabulary.js', 'r', encoding='utf-8') as f:
            content = f.read()

        self.assertNotIn('JICA', content, "initialVocabulary.js must not contain 'JICA'")
        self.assertNotIn('JICA・社会', content)
        self.assertNotIn('二本松訓練所（JICA訓練所）', content)
        lesson_matches = re.findall(r'第\d+課', content)
        self.assertEqual(lesson_matches, [], f"initialVocabulary.js must not contain 第X課: {lesson_matches}")

    def test_grammar_quizzes_have_no_lesson_prefix(self):
        with open('js/data/grammarQuizzes.js', 'r', encoding='utf-8') as f:
            content = f.read()

        lesson_matches = re.findall(r'第\d+課', content)
        self.assertEqual(lesson_matches, [], f"grammarQuizzes.js must not contain 第X課: {lesson_matches}")
        self.assertNotIn('JICA', content)

    def test_reference_guide_has_no_lesson_numbers_or_jica_title(self):
        with open('js/components/ReferenceGuide.js', 'r', encoding='utf-8') as f:
            content = f.read()

        self.assertNotIn('JICA', content, "ReferenceGuide.js must not contain 'JICA'")
        lesson_matches = re.findall(r'第\d+課', content)
        self.assertEqual(lesson_matches, [], f"ReferenceGuide.js must not contain 第X課: {lesson_matches}")
        self.assertNotIn('学ぶ課', content, "ReferenceGuide.js table column should not be '学ぶ課'")

    def test_navbar_has_no_jica_textbook(self):
        with open('js/components/Navbar.js', 'r', encoding='utf-8') as f:
            content = f.read()

        self.assertNotIn('JICA', content, "Navbar.js must not contain 'JICA'")
        self.assertNotIn('JICA教科書', content)

    def test_wordgame_has_no_textbook_48_lessons(self):
        with open('js/components/WordGame.js', 'r', encoding='utf-8') as f:
            content = f.read()

        self.assertNotIn('教科書全48課', content)
        self.assertNotIn('JICA', content)

    def test_material_manager_has_no_jica_reference(self):
        with open('js/components/MaterialManager.js', 'r', encoding='utf-8') as f:
            content = f.read()

        self.assertNotIn('JICA', content, "MaterialManager.js must not contain 'JICA'")

if __name__ == '__main__':
    unittest.main()
