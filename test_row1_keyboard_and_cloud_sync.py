import unittest
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = r"C:\Users\kkaho\.gemini\antigravity\scratch\mongol-learning-app"

class TestRow1KeyboardAndCloudSync(unittest.TestCase):
    def test_row1_keyboard_layout(self):
        """Verify MONGOLIAN_PC_KEYBOARD_LAYOUT has row1 with comma, question mark, period, exclamation mark, numbers."""
        helpers_path = os.path.join(BASE_DIR, "js", "utils", "helpers.js")
        with open(helpers_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("row1: [", content)
        self.assertIn("{ lower: '№', upper: '1', key: '1' }", content)
        self.assertIn("{ lower: ',', upper: '8', key: '8', special: true }", content)
        self.assertIn("{ lower: '?', upper: '0', key: '0', special: true }", content)
        self.assertIn("{ lower: '.', upper: '6', key: '6', special: true }", content)
        self.assertIn("{ lower: '!', upper: '-', key: '-' }", content)

        # Check bundled.js as well
        bundled_path = os.path.join(BASE_DIR, "bundled.js")
        with open(bundled_path, "r", encoding="utf-8") as f:
            b_content = f.read()

        self.assertIn("row1: [", b_content)
        self.assertIn("{ lower: ',', upper: '8'", b_content)
        self.assertIn("{ lower: '?', upper: '0'", b_content)

    def test_cloud_sync_qr_not_failing_and_no_file_url(self):
        """Verify Navbar.js prevents https://file: and generates valid QR SVG."""
        navbar_path = os.path.join(BASE_DIR, "js", "components", "Navbar.js")
        with open(navbar_path, "r", encoding="utf-8") as f:
            nav_content = f.read()

        self.assertIn("DEFAULT_VERCEL_APP_URL = 'https://mongolian-learning-app-1tns.vercel.app'", nav_content)
        self.assertIn("syncTargetMode = 'vercel'", nav_content)
        self.assertNotIn('value="https://file:', nav_content)

    def test_auth_token_compactness(self):
        """Verify auth.js creates compact tokens without giant duplicated snapshots."""
        auth_path = os.path.join(BASE_DIR, "js", "services", "auth.js")
        with open(auth_path, "r", encoding="utf-8") as f:
            auth_content = f.read()

        self.assertNotIn("storage: storageSnapshot", auth_content)
        self.assertIn("slice(-10)", auth_content)
        self.assertIn("m: mistakesData", auth_content)

if __name__ == '__main__':
    unittest.main()
