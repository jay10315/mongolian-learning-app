import os

index_path = r"C:\Users\kkaho\.gemini\antigravity\scratch\mongol-learning-app\index.html"
bundled_path = r"C:\Users\kkaho\.gemini\antigravity\scratch\mongol-learning-app\bundled.js"

with open(index_path, 'r', encoding='utf-8') as f:
    index_content = f.read()

# 1. Ensure <head> and entire HTML does not load puter.js
assert 'src="https://js.puter.com' not in index_content, "ERROR: puter script tag found in index.html!"
assert 'js.puter.com' not in index_content, "ERROR: js.puter.com CDN URL found in index.html!"

with open(bundled_path, 'r', encoding='utf-8') as f:
    bundled_content = f.read()

# 2. Ensure bundled.js does not contain puter CDN
assert 'js.puter.com' not in bundled_content, "ERROR: js.puter.com found in bundled.js!"
assert 'cleanupUnwantedModals' in bundled_content, "ERROR: cleanupUnwantedModals missing in bundled.js!"

print("Origin Safety Tests: ALL PASSED (100% Puter-free, 0 origin conflicts)!")
