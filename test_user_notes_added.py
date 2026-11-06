import os
import sys
import unittest
import json
import re

sys.stdout.reconfigure(encoding='utf-8')

base_dir = r"C:\Users\kkaho\.gemini\antigravity\scratch\mongol-learning-app"

class TestUserNotesAdded(unittest.TestCase):
    def test_vocabulary_expanded_and_contains_notes_words(self):
        v_path = os.path.join(base_dir, 'js', 'data', 'initialVocabulary.js')
        with open(v_path, 'r', encoding='utf-8') as f:
            content = f.read()
        m = re.search(r'initialVocabulary\s*=\s*(\[[\s\S]*?\]);', content)
        self.assertTrue(m, "initialVocabulary array not found")
        vocab = json.loads(m.group(1))
        
        self.assertGreaterEqual(len(vocab), 860, f"Expected at least 860 words, got {len(vocab)}")
        
        # Check specific curated words
        mn_words = {v.get('dictForm', v['mongolian']) for v in vocab} | {v['mongolian'] for v in vocab}
        must_have = [
            "гар өргөх", "дээс тоглох", "авирах", "сэлэлт", "насанд хүрэх",
            "загас барих", "хөвөн чихэр", "далайн байцаа", "гэр хороолол",
            "ноолуур", "банштай цай", "гурилтай шөл", "үндэсний хувцас",
            "цэцгийн тоосны харшил", "үнэндээ", "биеэ бодоорой", "аюултай",
            "цахилгаан шат", "бэлэн мөнгө", "хөөрхөн"
        ]
        for w in must_have:
            self.assertIn(w, mn_words, f"Expected '{w}' to be present in initialVocabulary")

    def test_roleplay_scenarios_expanded(self):
        r_path = os.path.join(base_dir, 'js', 'data', 'roleplayData.js')
        with open(r_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        scenario_ids = re.findall(r'(?:["\']?id["\']?\s*:\s*["\']([^"\']+)["\'])', content)
        expected_ids = [
            "jica_self_intro", "jica_family", "jica_hometown", "jica_training_center",
            "jica_dornod_assignment", "jica_weekend_plans", "jica_facts_interview",
            "hospital_visit", "store_shopping", "pharmacy_consultation", "hotel_stay", "ticket_office"
        ]
        for s_id in expected_ids:
            self.assertIn(s_id, scenario_ids, f"Expected roleplay scenario '{s_id}' in roleplayData.js")

    def test_reference_guide_contains_new_tabs(self):
        ref_path = os.path.join(base_dir, 'js', 'components', 'ReferenceGuide.js')
        with open(ref_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        self.assertIn('ref-tab-frequency', content)
        self.assertIn('ref-tab-collective', content)
        self.assertIn('ref-tab-conversation', content)
        self.assertIn('байнга', content)
        self.assertIn('хоёулаа', content)
        self.assertIn('Үнэндээ', content)

if __name__ == '__main__':
    unittest.main()
