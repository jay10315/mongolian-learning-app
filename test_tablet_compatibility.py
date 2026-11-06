import unittest
import os

class TestTabletCompatibility(unittest.TestCase):
    def setUp(self):
        with open('index.html', 'r', encoding='utf-8') as f:
            self.html = f.read()
        with open('bundled.js', 'r', encoding='utf-8') as f:
            self.js = f.read()

    def test_tablet_connect_button_and_modal(self):
        self.assertIn('btn-device-connect', self.js)
        self.assertIn('showTabletConnectModal', self.js)
        self.assertIn('192.168.2.226', self.js)
        self.assertIn('tablet-connect-modal', self.js)

    def test_safe_serviceworker_in_app(self):
        self.assertIn('const isSecure =', self.js)
        self.assertIn('if (!isSecure) return;', self.js)

    def test_head_script_safe_try_catch(self):
        self.assertIn('window.addEventListener(\'error\'', self.html)
        self.assertIn('mobile-debug-alert', self.html)

if __name__ == '__main__':
    unittest.main()
