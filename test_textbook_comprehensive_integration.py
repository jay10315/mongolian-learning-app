import unittest
import json
import re

class TestTextbookComprehensiveIntegration(unittest.TestCase):
    def test_typing_sentences_comprehensive(self):
        with open('js/data/typingSentences.js', 'r', encoding='utf-8') as f:
            content = f.read()

        # Check total typing sentences >= 70
        type_ids = re.findall(r'["\']?id["\']?\s*:\s*["\']type_([a-zA-Z0-9_]+)["\']', content)
        self.assertGreaterEqual(len(type_ids), 70, f"Expected at least 70 typing sentences, found {len(type_ids)}")

        # Check classroom expressions included
        self.assertIn("Ангидаа монголоор яриарай", content)
        self.assertIn("Орж болох уу?", content)
        self.assertIn("Энд суугаарай", content)

        # Check greetings included
        self.assertIn("Сайхан амарсан уу?", content)
        self.assertIn("Сонин сайхан юу байна вэ?", content)

        # Check all lessons represented in ids (type_ls_01 to type_ls_18)
        for i in range(1, 19):
            prefix = f"ls_{i:02d}_"
            self.assertTrue(
                any(tid.startswith(prefix) for tid in type_ids),
                f"Missing lesson typing sentence for lesson {i} ({prefix})"
            )

    def test_roleplay_scenarios_comprehensive(self):
        with open('js/data/roleplayData.js', 'r', encoding='utf-8') as f:
            content = f.read()

        # Check total scenarios >= 30
        scenarios = re.findall(r'["\']?id["\']?\s*:\s*["\']([^"\']+)["\']\s*,\s*["\']?title["\']?\s*:\s*["\']([^"\']+)["\']', content)
        self.assertGreaterEqual(len(scenarios), 30, f"Expected at least 30 roleplay scenarios, found {len(scenarios)}")

        # Check all 18 textbook scenarios exist
        scenario_ids = [s[0] for s in scenarios]
        for i in range(1, 19):
            tb_id = f"tb_conv_{i:02d}"
            self.assertIn(tb_id, scenario_ids, f"Missing textbook roleplay scenario {tb_id}")

        # Check specific dialogue content in tb_conv
        self.assertIn("Зуунмод хот хүртэл", content)
        self.assertIn("Толгой өвдөөд, бас жаахан халуураад байна", content)
        self.assertIn("Галт тэргээр 12 цаг гаруй явна шүү", content)
        self.assertIn("Нийслэл салат", content)

    def test_vocabulary_additions(self):
        with open('js/data/initialVocabulary.js', 'r', encoding='utf-8') as f:
            content = f.read()

        self.assertIn("нийслэл салат", content)
        self.assertIn("өвчин намдаах эм", content)
        self.assertIn("Зуунмод хот", content)

    def test_bundled_js_has_new_content(self):
        with open('bundled.js', 'r', encoding='utf-8') as f:
            js = f.read()

        self.assertIn("tb_conv_01", js)
        self.assertIn("tb_conv_18", js)
        self.assertIn("type_ls_01_1", js)
        self.assertIn("type_ls_18_1", js)

if __name__ == '__main__':
    unittest.main()
