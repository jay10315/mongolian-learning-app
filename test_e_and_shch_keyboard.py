import unittest
import os

BASE_DIR = r"C:\Users\kkaho\.gemini\antigravity\scratch\mongol-learning-app"

class TestEAndShchKeyboard(unittest.TestCase):
    def test_helpers_contains_e_and_shch(self):
        """Verify helpers.js keyboard layout and special bar contain 'е', 'Е', 'щ', 'Щ'."""
        helpers_path = os.path.join(BASE_DIR, "js", "utils", "helpers.js")
        with open(helpers_path, "r", encoding="utf-8") as f:
            content = f.read()

        # Check row2 has щ and е at the upper right
        self.assertIn("{ lower: 'щ', upper: 'Щ'", content)
        self.assertIn("{ lower: 'е', upper: 'Е'", content)
        # Check SPECIAL_CYRILLIC_BAR has е, Е, щ, Щ
        self.assertIn("'е', 'Е', 'щ', 'Щ'", content)
        # Check physical key map has щ and е
        self.assertIn("'щ'", content)
        self.assertIn("'е'", content)

    def test_cyrillic_keyboard_contains_e_and_shch(self):
        """Verify CyrillicKeyboard.js grid renders row2 with 14 cols (including е and щ) and row3 with 11 cols."""
        kb_path = os.path.join(BASE_DIR, "js", "components", "CyrillicKeyboard.js")
        with open(kb_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("Row 2 (ф ц у ж э н г ш ү з к ъ е щ)", content)
        self.assertIn("repeat(14, minmax(0, 1fr))", content)
        self.assertIn("grid-cols-11", content)

if __name__ == '__main__':
    unittest.main()
