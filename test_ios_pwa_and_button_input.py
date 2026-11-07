import unittest
import os
import json

BASE_DIR = r"C:\Users\kkaho\.gemini\antigravity\scratch\mongol-learning-app"

class TestIosPwaAndButtonInput(unittest.TestCase):
    def test_vercel_build_configuration(self):
        """Verify package.json and vercel.json configure a zero-error build with build.js."""
        pkg_path = os.path.join(BASE_DIR, "package.json")
        with open(pkg_path, "r", encoding="utf-8") as f:
            pkg = json.load(f)
        self.assertEqual(pkg.get("scripts", {}).get("build"), "node build.js")

        build_js_path = os.path.join(BASE_DIR, "build.js")
        self.assertTrue(os.path.exists(build_js_path))
        with open(build_js_path, "r", encoding="utf-8") as f:
            bjs = f.read()
        self.assertIn("dist", bjs)
        self.assertIn("process.exit(0)", bjs)

        vercel_json_path = os.path.join(BASE_DIR, "vercel.json")
        with open(vercel_json_path, "r", encoding="utf-8") as f:
            vjson = json.load(f)
        self.assertEqual(vjson.get("buildCommand"), "node build.js")
        self.assertEqual(vjson.get("outputDirectory"), "dist")

    def test_apple_touch_icon_and_manifest(self):
        """Verify apple-touch-icon.png exists and is referenced in index.html and manifest.json."""
        icon_path = os.path.join(BASE_DIR, "apple-touch-icon.png")
        self.assertTrue(os.path.exists(icon_path))
        self.assertGreater(os.path.getsize(icon_path), 500)

        index_path = os.path.join(BASE_DIR, "index.html")
        with open(index_path, "r", encoding="utf-8") as f:
            html = f.read()
        self.assertIn('rel="apple-touch-icon"', html)
        self.assertIn('href="./apple-touch-icon.png"', html)
        self.assertIn("rawMsg === 'Script error.'", html)

        manifest_path = os.path.join(BASE_DIR, "manifest.json")
        with open(manifest_path, "r", encoding="utf-8") as f:
            manifest = json.load(f)
        icons = manifest.get("icons", [])
        srcs = [i.get("src") for i in icons]
        self.assertIn("./apple-touch-icon.png", srcs)

    def test_button_input_robustness(self):
        """Verify helpers.js and CyrillicKeyboard.js have robust input resolution and focus preservation."""
        helpers_path = os.path.join(BASE_DIR, "js", "utils", "helpers.js")
        with open(helpers_path, "r", encoding="utf-8") as f:
            helpers = f.read()
        self.assertIn("window.__lastActiveCyrillicInput", helpers)
        self.assertIn("pointerdown", helpers)
        self.assertIn("resolveTargetInput", helpers)

        kb_path = os.path.join(BASE_DIR, "js", "components", "CyrillicKeyboard.js")
        with open(kb_path, "r", encoding="utf-8") as f:
            kb = f.read()
        self.assertIn("resolveInput()", kb)
        self.assertIn("window.__lastActiveCyrillicInput", kb)

if __name__ == '__main__':
    unittest.main()
