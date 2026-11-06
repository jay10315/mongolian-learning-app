import re

with open(r'C:\Users\kkaho\.gemini\antigravity\scratch\mongol-learning-app\index.html', 'r', encoding='utf-8') as f:
    html = f.read()

scripts = re.findall(r'<script.*?>([\s\S]*?)</script>', html)
script = scripts[-1]

with open(r'C:\Users\kkaho\.gemini\antigravity\scratch\mongol-learning-app\bundled.js', 'w', encoding='utf-8') as f:
    f.write(script)

print("Saved bundled.js, length:", len(script))
