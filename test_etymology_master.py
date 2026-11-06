import unittest
import os
import re

class TestEtymologyMaster(unittest.TestCase):
    def setUp(self):
        self.base_dir = os.path.dirname(os.path.abspath(__file__))
        self.data_path = os.path.join(self.base_dir, 'js', 'data', 'etymologySuffixData.js')
        self.comp_path = os.path.join(self.base_dir, 'js', 'components', 'EtymologyMaster.js')
        self.bundled_path = os.path.join(self.base_dir, 'bundled.js')

    def test_etymology_data_exists_and_valid(self):
        self.assertTrue(os.path.exists(self.data_path))
        with open(self.data_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Check key terms and explanation of ашгүй
        self.assertIn('ашгүй', content)
        self.assertIn('аш', content)
        self.assertIn('unexpected_etymology', content)
        self.assertIn('-тай', content)
        self.assertIn('-ч / -чин', content)
        self.assertIn('-лах', content)
        self.assertIn('etymologyQuizzes', content)

    def test_component_and_routes(self):
        self.assertTrue(os.path.exists(self.comp_path))
        with open(self.comp_path, 'r', encoding='utf-8') as f:
            content = f.read()

        self.assertIn('class EtymologyMasterComponent', content)
        self.assertIn('renderStudyTab', content)
        self.assertIn('renderQuizTab', content)
        self.assertIn('renderCheatSheetTab', content)

    def test_bundled_integration(self):
        with open(self.bundled_path, 'r', encoding='utf-8') as f:
            content = f.read()

        self.assertIn('etymologyCards', content)
        self.assertIn('EtymologyMasterComponent', content)
        self.assertIn('case \'etymology_master\':', content)

if __name__ == '__main__':
    unittest.main()
