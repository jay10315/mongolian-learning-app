import unittest
import json
import re

class TestInterviewMasterFeature(unittest.TestCase):
    def test_interview_topics_data(self):
        with open('js/data/interviewTopics.js', 'r', encoding='utf-8') as f:
            content = f.read()

        # Check all 13 topics exist
        for i in range(1, 14):
            tid = f"topic_{i:02d}"
            self.assertIn(f'"id": "{tid}"', content, f"Missing topic id {tid}")

        # Check personalized details
        self.assertIn("Кахо", content)
        self.assertIn("криминологи", content)
        self.assertIn("таван хүнтэй", content)
        self.assertIn("ганцаараа амьдардаг", content)
        self.assertIn("сенбэй", content)
        self.assertIn("нарсан мод", content)
        self.assertIn("Нихонмацү сургалтын төв", content)
        self.assertIn("Чойбалсан", content)
        self.assertIn("758", content)
        self.assertIn("1992", content)
        self.assertIn("1974", content)
        self.assertIn("Дархан хот хүртэл", content)
        self.assertIn("нийслэл салат", content)

    def test_component_and_navigation_integration(self):
        # 1. Navbar has interview_prep tab
        with open('js/components/Navbar.js', 'r', encoding='utf-8') as f:
            nav = f.read()
        self.assertIn("interview_prep", nav)
        self.assertIn("口述試験特訓", nav)

        # 2. app.js routes to InterviewMasterComponent
        with open('js/app.js', 'r', encoding='utf-8') as f:
            app = f.read()
        self.assertIn("InterviewMasterComponent", app)
        self.assertIn("case 'interview_prep':", app)

        # 3. Home.js has interview_prep card
        with open('js/components/Home.js', 'r', encoding='utf-8') as f:
            home = f.read()
        self.assertIn('data-target="interview_prep"', home)

        # 4. typingSentences.js has interview_prep sentences
        with open('js/data/typingSentences.js', 'r', encoding='utf-8') as f:
            typing = f.read()
        self.assertIn("interview_prep", typing)
        self.assertIn("type_intv_01_1", typing)
        self.assertIn("type_intv_07_1", typing)

    def test_bundled_js_has_interview_master(self):
        with open('bundled.js', 'r', encoding='utf-8') as f:
            js = f.read()
        self.assertIn("InterviewMasterComponent", js)
        self.assertIn("interviewTopics", js)
        self.assertIn("topic_01", js)
        self.assertIn("topic_13", js)
        self.assertIn("type_intv_01_1", js)

if __name__ == '__main__':
    unittest.main()
