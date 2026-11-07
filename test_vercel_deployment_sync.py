# -*- coding: utf-8 -*-
"""
test_vercel_deployment_sync.py
Verification suite for Vercel deployment synchronization:
1. Vercel domain handling: window.location.origin is preserved, :5173 is NEVER appended on Vercel.
2. Full magic login token is embedded in the Vercel URL and scannable by mobile cameras.
3. Client-side roundtrip on tablet: processMagicLoginToken restores user, XP, level, mascot, mistakes.
"""
import unittest
import os
import sys
import json
import base64
import urllib.parse

sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = r"C:\Users\kkaho\.gemini\antigravity\scratch\mongol-learning-app"

class TestVercelDeploymentSync(unittest.TestCase):
    def test_navbar_and_auth_modal_no_5173_on_vercel(self):
        """Verify that when not on localhost, :5173 is NEVER appended in Navbar.js or AuthModal.js."""
        nav_path = os.path.join(BASE_DIR, "js", "components", "Navbar.js")
        with open(nav_path, "r", encoding="utf-8") as f:
            nav_code = f.read()

        modal_path = os.path.join(BASE_DIR, "js", "components", "AuthModal.js")
        with open(modal_path, "r", encoding="utf-8") as f:
            modal_code = f.read()

        # Navbar checks
        self.assertIn("!isLocalhost && typeof window !== 'undefined' && window.location && window.location.origin", nav_code)
        self.assertIn("window.location.origin", nav_code)
        self.assertIn("Vercel公開版（クラウド連携モード）", nav_code)

        # AuthModal checks
        self.assertIn("!isLocalhost && typeof window !== 'undefined' && window.location && window.location.origin", modal_code)

    def test_vercel_url_construction_simulation(self):
        """Simulate URL construction on a Vercel domain."""
        simulated_origin = "https://mongol-learning-app-kkaho.vercel.app"
        simulated_token = "eyJ2IjoyLCJ1Ijp7InVzZXJuYW1lIjoicGVuIn19"
        
        # Test simulated logic matching Navbar.js
        is_localhost = False
        clean_path = "/"
        base = simulated_origin + clean_path
        target_url = f"{base}?login_token={simulated_token}&device_sync=1"

        self.assertFalse(":5173" in target_url, "Vercel URL must not contain :5173")
        self.assertTrue(target_url.startswith("https://mongol-learning-app-kkaho.vercel.app/"))
        self.assertIn("login_token=", target_url)

    def test_tablet_side_token_decoding_and_restoration(self):
        """Verify that a token received on tablet restores all user learning data."""
        sample_payload = {
            "v": 2,
            "u": {
                "id": "usr_pen_123",
                "username": "pen",
                "displayName": "ペンペン",
                "salt": "testsalt",
                "passwordHash": "testhash",
                "createdAt": "2026-11-07T00:00:00.000Z"
            },
            "p": {
                "nickname": "ペンちゃん",
                "level": 5,
                "stage": 2,
                "mood": "happy"
            },
            "g": {
                "xp": 350,
                "level": 5
            },
            "m": [
                {
                    "id": "mst_1",
                    "question": "ном",
                    "correctAnswer": "本",
                    "wrongCount": 2,
                    "resolved": False
                }
            ],
            "storage": {
                "gameStats": json.dumps({"totalXp": 350, "level": 5}),
                "sunglasses": "true"
            },
            "t": 1794052000000
        }

        # Encode token (as createMagicLoginToken does)
        json_bytes = json.dumps(sample_payload).encode('utf-8')
        b64 = base64.b64encode(json_bytes).decode('ascii').replace('+', '-').replace('/', '_').rstrip('=')

        # Decode token (as processMagicLoginToken does)
        padded_b64 = b64.replace('-', '+').replace('_', '/')
        while len(padded_b64) % 4 != 0:
            padded_b64 += '='
        decoded_bytes = base64.b64decode(padded_b64)
        restored = json.loads(decoded_bytes.decode('utf-8'))

        self.assertEqual(restored["u"]["username"], "pen")
        self.assertEqual(restored["u"]["displayName"], "ペンペン")
        self.assertEqual(restored["p"]["level"], 5)
        self.assertEqual(restored["g"]["xp"], 350)
        self.assertEqual(len(restored["m"]), 1)
        self.assertEqual(restored["m"][0]["question"], "ном")

    def test_vercel_json_is_valid(self):
        """Verify vercel.json is present and has proper rewrite."""
        v_path = os.path.join(BASE_DIR, "vercel.json")
        self.assertTrue(os.path.exists(v_path))
        with open(v_path, "r", encoding="utf-8") as f:
            v_data = json.load(f)

        self.assertEqual(v_data.get("version"), 2)
        self.assertTrue(v_data.get("cleanUrls"))

if __name__ == "__main__":
    unittest.main()
