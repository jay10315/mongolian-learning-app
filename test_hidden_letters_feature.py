# -*- coding: utf-8 -*-
import unittest
import os
import re

class TestHiddenLettersFeature(unittest.TestCase):
    def setUp(self):
        self.app_dir = os.path.dirname(os.path.abspath(__file__))

    def test_declension_quizzes_contains_hidden_letters(self):
        declension_path = os.path.join(self.app_dir, 'js', 'data', 'declensionQuizzes.js')
        with open(declension_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Check for hidden letters
        hidden_ids = re.findall(r'id:\s*"(dec_hidden_\d+)"', content)
        self.assertGreaterEqual(len(hidden_ids), 32, f"Expected at least 32 hidden quizzes, got {len(hidden_ids)}")

        # Verify key target words exist
        for word in ['мод', 'ус', 'хүү', 'дүү', 'байшин', 'нар', 'сар', 'гар', 'хөл', 'нүд', 'шүд', 'хэл', 'нэр', 'цонх', 'өдөр', 'газар', 'зам', 'мах', 'гал', 'сүү', 'толгой', 'өвс']:
            self.assertIn(f'baseWord: "{word}"', content, f"Missing baseWord: {word}")

    def test_reference_guide_contains_exception_section(self):
        ref_path = os.path.join(self.app_dir, 'js', 'components', 'ReferenceGuide.js')
        with open(ref_path, 'r', encoding='utf-8') as f:
            content = f.read()

        self.assertIn('hidden-letters-guide-section', content)
        self.assertIn('btn-ref-start-hidden-test', content)
        self.assertIn('ref-tab-hidden-n', content)
        self.assertIn('ref-tab-hidden-g', content)
        self.assertIn('ref-tab-dropping-vowel', content)
        self.assertIn('ref-tab-compare', content)
        self.assertIn('btn-ref-speak', content)

    def test_home_contains_hidden_letters_card(self):
        home_path = os.path.join(self.app_dir, 'js', 'components', 'Home.js')
        with open(home_path, 'r', encoding='utf-8') as f:
            content = f.read()

        self.assertIn('home-card-hidden-letters', content)
        self.assertIn('DeclensionTestComponent.startWithCategory', content)

    def test_declension_component_supports_hidden_category(self):
        declension_comp = os.path.join(self.app_dir, 'js', 'components', 'DeclensionTest.js')
        with open(declension_comp, 'r', encoding='utf-8') as f:
            content = f.read()

        self.assertIn('value="hidden_n_g"', content)
        self.assertIn('startWithCategory', content)
        self.assertIn('if (!this.container) return;', content)
        self.assertIn('if (this.container) {\n      this.renderTesting();', content)

    def test_reference_guide_bindings(self):
        ref_path = os.path.join(self.app_dir, 'js', 'components', 'ReferenceGuide.js')
        with open(ref_path, 'r', encoding='utf-8') as f:
            content = f.read()
        self.assertIn("querySelector('#btn-ref-start-hidden-test')", content)
        self.assertIn("querySelectorAll('.btn-ref-subtab')", content)
        self.assertIn("querySelectorAll('.btn-ref-speak')", content)

    def test_bundled_js_and_index_html(self):
        for fname in ['bundled.js', 'index.html']:
            path = os.path.join(self.app_dir, fname)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()

            self.assertIn('dec_hidden_1', content, f"{fname} missing dec_hidden_1")
            self.assertIn('hidden-letters-guide-section', content, f"{fname} missing hidden section")
            self.assertIn('home-card-hidden-letters', content, f"{fname} missing home card")

if __name__ == '__main__':
    unittest.main()
