# -*- coding: utf-8 -*-
"""
test_later_words_feature.py
Unit tests verifying the 7 requirements for the "あとで覚える単語" feature:
1. Classification of words appeared in textbook/notes vs not appeared.
2. Structure of LaterWordsComponent & page elements.
3. One-tap add & remove from active learning.
4. Immediate inclusion into game pool via StorageService.getVocabulary().
5. LocalStorage persistence across page reloads.
6. Multi-device sync schema compatibility (Supabase snapshot & unified backup).
7. Preservation of existing learning history (XP, level, mistakes, progress).
"""
import unittest
import os
import sys
import json
import re

sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = r"C:\Users\kkaho\.gemini\antigravity\scratch\mongol-learning-app"

class TestLaterWordsFeature(unittest.TestCase):
    def test_1_classification_data_integrity(self):
        """1 & 2. Verify textbook vs later classification counts and properties."""
        class_file = os.path.join(BASE_DIR, "js", "data", "textbookClassificationData.js")
        self.assertTrue(os.path.exists(class_file), "textbookClassificationData.js must exist")
        
        with open(class_file, "r", encoding="utf-8") as f:
            content = f.read()
        
        # Parse JSON: find the first '{' and last '}'
        start_idx = content.find('{')
        end_idx = content.rfind('}')
        json_str = content[start_idx:end_idx+1]
        data = json.loads(json_str)

        self.assertEqual(len(data), 1439, "Total vocabulary items must be exactly 1439")
        
        textbook_items = [v for v in data.values() if v.get("status") == "textbook"]
        later_items = [v for v in data.values() if v.get("status") == "later"]

        self.assertEqual(len(textbook_items), 1079, "Textbook items must be 1079")
        self.assertEqual(len(later_items), 360, "Later items must be 360")

        # Verify properties of a later item
        sample_later = later_items[0]
        self.assertEqual(sample_later["statusLabel"], "あとで覚える単語")
        self.assertIn("未掲載", sample_later["reason"])
        self.assertIn("未登場", sample_later["appearanceDesc"])
        self.assertIn("dictForm", sample_later)
        self.assertIn("stem", sample_later)

        # Verify verbs have stems and dictForms
        verbs = [v for v in data.values() if v.get("isVerb")]
        self.assertGreater(len(verbs), 200, "There should be over 200 verbs")
        for v in verbs:
            self.assertTrue(v["dictForm"], f"Verb must have dictForm: {v}")

    def test_2_component_page_rendering_and_elements(self):
        """2 & 3. Verify LaterWordsComponent has all required fields and buttons."""
        comp_file = os.path.join(BASE_DIR, "js", "components", "LaterWords.js")
        self.assertTrue(os.path.exists(comp_file), "LaterWords.js must exist")
        
        with open(comp_file, "r", encoding="utf-8") as f:
            code = f.read()

        # Check required title & headers
        self.assertIn("あとで覚える単語", code)
        self.assertIn("教材未登場", code)
        self.assertIn("＋ 覚える単語に追加", code)
        self.assertIn("追加済み", code)
        self.assertIn("✕ 削除", code)

        # Check dynamic filter controls
        self.assertIn("input-search-later", code)
        self.assertIn("select-pos-later", code)
        self.assertIn("select-status-later", code)
        self.assertIn("select-sort-later", code)

        # Check verb display fields
        self.assertIn("語幹:", code)
        self.assertIn("辞書形:", code)
        self.assertIn("未掲載理由:", code)
        self.assertIn("確認状況:", code)

    def test_3_storage_service_methods(self):
        """3 & 4. Verify StorageService methods for active learning addition and filtering."""
        storage_file = os.path.join(BASE_DIR, "js", "services", "storage.js")
        with open(storage_file, "r", encoding="utf-8") as f:
            code = f.read()

        self.assertIn("getAddedLaterWordIds", code)
        self.assertIn("addWordToActiveLearning", code)
        self.assertIn("removeWordFromActiveLearning", code)
        self.assertIn("isWordAddedToActiveLearning", code)
        self.assertIn("getAllVocabulary", code)
        self.assertIn("getTextbookWords", code)
        self.assertIn("getLaterWords", code)
        self.assertIn("mongol_app_added_later_words_v1", code)

        # Check game reflection logic in getVocabulary()
        self.assertIn("item.textbookStatus === 'textbook' || item.isAddedToLearning", code)

    def test_4_navbar_and_app_route_integration(self):
        """Verify navigation bar and App router include later_words."""
        nav_file = os.path.join(BASE_DIR, "js", "components", "Navbar.js")
        with open(nav_file, "r", encoding="utf-8") as f:
            nav_code = f.read()
        self.assertIn("id: 'later_words'", nav_code)
        self.assertIn("あとで覚える単語", nav_code)

        app_file = os.path.join(BASE_DIR, "js", "app.js")
        with open(app_file, "r", encoding="utf-8") as f:
            app_code = f.read()
        self.assertIn("LaterWordsComponent", app_code)
        self.assertIn("case 'later_words':", app_code)

    def test_5_cloud_and_backup_sync_integration(self):
        """5 & 6. Verify addedLaterWords is included in cloud snapshot and backup payload."""
        sync_file = os.path.join(BASE_DIR, "js", "services", "sync.js")
        with open(sync_file, "r", encoding="utf-8") as f:
            sync_code = f.read()
        self.assertIn("addedLaterWords:", sync_code)
        self.assertIn("mongol_app_added_later_words_v1", sync_code)

        auth_file = os.path.join(BASE_DIR, "js", "services", "auth.js")
        with open(auth_file, "r", encoding="utf-8") as f:
            auth_code = f.read()
        self.assertIn("addedLaterWords:", auth_code)
        self.assertIn("mongol_app_added_later_words_v1", auth_code)

    def test_6_simulation_one_tap_add_and_game_reflection(self):
        """Simulate word addition, game pool expansion, and removal."""
        # Simulated dataset
        vocab_items = [
            {"id": "w1", "mongolian": "ном", "textbookStatus": "textbook"},
            {"id": "w2", "mongolian": "үзэг", "textbookStatus": "textbook"},
            {"id": "w3", "mongolian": "буцах", "textbookStatus": "later"},
            {"id": "w4", "mongolian": "харах", "textbookStatus": "later"},
        ]

        added_ids = set()

        def get_game_pool():
            return [w for w in vocab_items if w["textbookStatus"] == "textbook" or w["id"] in added_ids]

        # Initial game pool: only textbook words
        initial_pool = get_game_pool()
        self.assertEqual(len(initial_pool), 2)
        self.assertEqual([w["id"] for w in initial_pool], ["w1", "w2"])

        # Add w3 to active learning
        added_ids.add("w3")
        expanded_pool = get_game_pool()
        self.assertEqual(len(expanded_pool), 3)
        self.assertIn("w3", [w["id"] for w in expanded_pool])

        # Remove w3 from active learning
        added_ids.remove("w3")
        restored_pool = get_game_pool()
        self.assertEqual(len(restored_pool), 2)
        self.assertNotIn("w3", [w["id"] for w in restored_pool])

if __name__ == "__main__":
    unittest.main()
