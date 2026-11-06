import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

base_dir = r"C:\Users\kkaho\.gemini\antigravity\scratch\mongol-learning-app"
bundled_path = os.path.join(base_dir, 'bundled.js')

with open(bundled_path, 'r', encoding='utf-8') as f:
    bundled = f.read()

# Verify isWordAnswerMatch includes the tea and acceptableAnswers checks
assert 'acceptableAnswers' in bundled, "Missing acceptableAnswers check in bundled.js"
assert 'сүүтэйцай' in bundled, "Missing сүүтэйцай synonym check in bundled.js"

print("Tea and synonym matching checks passed in bundled.js!")
