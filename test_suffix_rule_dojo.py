import unittest
import os
import re

class TestSuffixRuleDojo(unittest.TestCase):
    def setUp(self):
        self.base_dir = os.path.dirname(os.path.abspath(__file__))

    def test_suffix_data_integrity(self):
        data_p = os.path.join(self.base_dir, 'js', 'data', 'suffixRuleData.js')
        self.assertTrue(os.path.exists(data_p), "Missing suffixRuleData.js")
        with open(data_p, 'r', encoding='utf-8') as f:
            content = f.read()

        # Check categories
        self.assertIn('"id": "dative_dt"', content)
        self.assertIn('"id": "interrogative_be_ve"', content)
        self.assertIn('"id": "yes_no_uu"', content)
        self.assertIn('"id": "accusative_yg"', content)
        self.assertIn('"id": "genitive_yn"', content)
        self.assertIn('"id": "negation_bish"', content)

        # Check total questions >= 40
        quiz_ids = re.findall(r'"id":\s*"(sr_\w+)"', content)
        self.assertGreaterEqual(len(quiz_ids), 40, f"Expected >= 40 quizzes, got {len(quiz_ids)}")

        # Check specific linguistic rules:
        # 1. dative г,р,с -> -т
        self.assertIn('"targetWord": "аймаг"', content)
        self.assertIn('"answer": "аймагт"', content)
        self.assertIn('"targetWord": "гэр"', content)
        self.assertIn('"answer": "гэрт"', content)
        self.assertIn('"targetWord": "газар"', content)
        self.assertIn('"answer": "газарт"', content)
        self.assertIn('"targetWord": "ном"', content)
        self.assertIn('"answer": "номд"', content)

        # 2. interrogative н,м,в,л -> бэ vs others -> вэ
        self.assertIn('"targetWord": "хэн"', content)
        self.assertIn('"sentencePattern": "Энэ хэн ___?"', content)
        self.assertIn('"answer": "бэ"', content)
        self.assertIn('"sentencePattern": "Энэ ямар ном ___?"', content)
        self.assertIn('"sentencePattern": "Энэ юу ___?"', content)
        self.assertIn('"answer": "вэ"', content)
        self.assertIn('"sentencePattern": "Таны гэр хаана ___?"', content)

    def test_component_methods_and_safety(self):
        comp_p = os.path.join(self.base_dir, 'js', 'components', 'SuffixRuleDojo.js')
        self.assertTrue(os.path.exists(comp_p), "Missing SuffixRuleDojo.js")
        with open(comp_p, 'r', encoding='utf-8') as f:
            content = f.read()

        for method in ['render', 'renderMenu', 'startQuiz', 'loadQuestion', 'renderTesting', 'checkAnswer', 'goNext', 'finishSession', 'renderResult', 'renderCheatSheet']:
            self.assertIn(f'static {method}', content, f"Missing method {method} in SuffixRuleDojo.js")

        self.assertIn('if (!this.container) return;', content, "Missing container safety check")

    def test_routing_and_navigation(self):
        app_p = os.path.join(self.base_dir, 'js', 'app.js')
        with open(app_p, 'r', encoding='utf-8') as f:
            app_code = f.read()
        self.assertIn("case 'suffix_dojo':", app_code)
        self.assertIn("SuffixRuleDojoComponent.render", app_code)

        navbar_p = os.path.join(self.base_dir, 'js', 'components', 'Navbar.js')
        with open(navbar_p, 'r', encoding='utf-8') as f:
            nav_code = f.read()
        self.assertIn("id: 'suffix_dojo'", nav_code)

        home_p = os.path.join(self.base_dir, 'js', 'components', 'Home.js')
        with open(home_p, 'r', encoding='utf-8') as f:
            home_code = f.read()
        self.assertIn('data-target="suffix_dojo"', home_code)
        self.assertIn('助詞・語尾ルール特訓道場', home_code)

    def test_bundled_app(self):
        bundle_p = os.path.join(self.base_dir, 'bundled.js')
        with open(bundle_p, 'r', encoding='utf-8') as f:
            bundle_code = f.read()
        self.assertIn('SuffixRuleDojoComponent', bundle_code)
        self.assertIn('suffixRuleCategories', bundle_code)
        self.assertIn('аймагт', bundle_code)

        index_p = os.path.join(self.base_dir, 'index.html')
        with open(index_p, 'r', encoding='utf-8') as f:
            html = f.read()
        self.assertIn('data-target="suffix_dojo"', html)
        self.assertIn("case 'suffix_dojo':", html)

if __name__ == '__main__':
    unittest.main()
