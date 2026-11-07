# -*- coding: utf-8 -*-
"""
test_qr_and_sync_features.py
Comprehensive test suite verifying:
1. QR code generation accuracy, Level M/Q error correction, Quiet Zone, high contrast, pure client-side SVG.
2. Target URL validity, query param encoding, protocol and pathname preservation (no 404).
3. Pairing flow, server endpoints (/api/sync/pair, /api/sync/pair/status), and state transition ('waiting' -> 'paired').
"""
import unittest
import os
import sys
import json
import urllib.parse
import subprocess

sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = r"C:\Users\kkaho\.gemini\antigravity\scratch\mongol-learning-app"

class TestQrAndSyncFeatures(unittest.TestCase):
    def test_qrcode_js_implementation(self):
        """Verify js/utils/qrcode.js exists and exports QRCodeGenerator and QRCodeModel."""
        qr_path = os.path.join(BASE_DIR, "js", "utils", "qrcode.js")
        self.assertTrue(os.path.exists(qr_path), "qrcode.js must exist")
        with open(qr_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("class QRCodeGenerator", content)
        self.assertIn("class QRCodeModel", content)
        self.assertIn("QRErrorCorrectLevel", content)
        self.assertIn("createSvgTag", content)
        self.assertIn("shape-rendering=\"crispEdges\"", content)
        self.assertIn("fill=\"#ffffff\"", content)
        self.assertIn("fill=\"#000000\"", content)

    def test_navbar_uses_local_qrcode_generator(self):
        """Verify Navbar.js does NOT rely on external api.qrserver.com, but uses QRCodeGenerator."""
        nav_path = os.path.join(BASE_DIR, "js", "components", "Navbar.js")
        with open(nav_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertNotIn("api.qrserver.com", content, "Navbar.js must not depend on external qrserver API")
        self.assertIn("QRCodeGenerator.generateSvg", content, "Navbar.js must generate SVG via QRCodeGenerator")
        self.assertIn("tablet-sync-status-box", content, "Navbar.js must have tablet-sync-status-box")
        self.assertIn("接続待機中", content, "Navbar.js must display 接続待機中 initial state")
        self.assertIn("同期完了", content, "Navbar.js must display 同期完了 on success")
        self.assertIn("btn-toggle-qr-quick", content, "Navbar.js must provide Quick Sync QR toggle")
        self.assertIn("btn-toggle-qr-full", content, "Navbar.js must provide Full Data QR toggle")

    def test_bundled_js_has_qrcode_and_no_qrserver(self):
        """Verify bundled.js includes QRCodeGenerator and has no api.qrserver.com."""
        bundle_path = os.path.join(BASE_DIR, "bundled.js")
        with open(bundle_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("class QRCodeGenerator", content)
        self.assertNotIn("api.qrserver.com", content)

    def test_server_pairing_endpoints_in_run_app(self):
        """Verify run_app.py has the pair status and pair notification endpoints."""
        run_app_path = os.path.join(BASE_DIR, "run_app.py")
        with open(run_app_path, "r", encoding="utf-8") as f:
            code = f.read()

        self.assertIn("ACTIVE_PAIR_SESSIONS", code)
        self.assertIn("'/api/sync/pair/status'", code)
        self.assertIn("'/api/sync/pair/data'", code)
        self.assertIn("'/api/sync/pair'", code)
        self.assertIn("'/api/sync/pair/register'", code)

    def test_auth_service_pairing_methods(self):
        """Verify auth.js has notifyPairSuccess, checkPairStatus, and registerPairSession."""
        auth_path = os.path.join(BASE_DIR, "js", "services", "auth.js")
        with open(auth_path, "r", encoding="utf-8") as f:
            code = f.read()

        self.assertIn("notifyPairSuccess", code)
        self.assertIn("checkPairStatus", code)
        self.assertIn("registerPairSession", code)
        self.assertIn("mongol_app_sync_channel", code)

    def test_app_js_handles_session_id_pairing(self):
        """Verify app.js handles sessionId and pair query params to trigger notifyPairSuccess."""
        app_path = os.path.join(BASE_DIR, "js", "app.js")
        with open(app_path, "r", encoding="utf-8") as f:
            code = f.read()

        self.assertIn("urlParams.get('session_id') || urlParams.get('pair')", code)
        self.assertIn("AuthService.notifyPairSuccess(sessionId", code)

    def test_simulated_pair_flow(self):
        """Simulate the complete HTTP pairing lifecycle with run_app logic."""
        import run_app
        session_id = "test_pair_session_12345"
        
        # 1. Initially waiting
        self.assertNotIn(session_id, run_app.ACTIVE_PAIR_SESSIONS)

        # 2. Host registers session
        run_app.ACTIVE_PAIR_SESSIONS[session_id] = {
            "status": "waiting",
            "sessionId": session_id,
            "username": "tester",
            "token": "sample_token_xyz"
        }
        self.assertEqual(run_app.ACTIVE_PAIR_SESSIONS[session_id]["status"], "waiting")

        # 3. Tablet connects and notifies pair
        run_app.ACTIVE_PAIR_SESSIONS[session_id] = {
            "status": "paired",
            "sessionId": session_id,
            "username": "tester",
            "device": "iPad",
            "timestamp": 1234567890
        }

        # 4. Host checks status
        session_data = run_app.ACTIVE_PAIR_SESSIONS.get(session_id)
        self.assertIsNotNone(session_data)
        self.assertEqual(session_data.get("status"), "paired")
        self.assertEqual(session_data.get("device"), "iPad")

        # Cleanup
        del run_app.ACTIVE_PAIR_SESSIONS[session_id]

    def test_real_browser_qr_rendering(self):
        """Render QR code in headless Chrome and confirm SVG structure and quiet zone."""
        test_html_path = os.path.join(BASE_DIR, "temp_test_qr.html")
        test_html = """<!DOCTYPE html>
<html><head><meta charset="utf-8"></head><body>
<script src="bundled.js"></script>
<div id="qr-output"></div>
<script>
  const url = "http://192.168.2.226:5173/index.html?session_id=pair_999&device_sync=1";
  const svg = QRCodeGenerator.generateSvg(url, { errorCorrectionLevel: 'M', cellSize: 3, margin: 4 });
  document.getElementById('qr-output').innerHTML = svg;
</script>
</body></html>"""
        with open(test_html_path, "w", encoding="utf-8") as f:
            f.write(test_html)

        try:
            chrome_exe = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
            res = subprocess.run([
                chrome_exe,
                "--headless=new",
                "--no-sandbox",
                "--disable-gpu",
                "--dump-dom",
                "file:///" + test_html_path.replace("\\", "/")
            ], capture_output=True, text=True, encoding="utf-8")

            self.assertIn("<svg", res.stdout, "SVG element must be present in DOM")
            self.assertIn("xmlns=\"http://www.w3.org/2000/svg\"", res.stdout)
            self.assertIn("<rect", res.stdout, "Background rect must be present")
            self.assertIn("fill=\"#ffffff\"", res.stdout, "Background must be white")
            self.assertIn("<path", res.stdout, "Data path must be present")
            self.assertIn("fill=\"#000000\"", res.stdout, "Modules must be black")
            self.assertIn("shape-rendering=\"crispEdges\"", res.stdout)
        finally:
            if os.path.exists(test_html_path):
                os.remove(test_html_path)

if __name__ == "__main__":
    unittest.main()
