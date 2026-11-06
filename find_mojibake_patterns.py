import os
import sys
import re

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

app_dir = r"C:\Users\kkaho\.gemini\antigravity\scratch\mongol-learning-app"

# Patterns common in UTF-8 decoded as CP1252 / Latin-1 or SJIS:
# e.g. "ã", "é", "å", "æ", "ç", "è", "ê", "ë" appearing inside Japanese text
# or characters in range \x80-\x9f
mojibake_regex = re.compile(r'[\u0080-\u009F]|Ã[\x80-\xBF]|Â[\x80-\xBF]|[\uFFFD]')

findings = []

for root, dirs, files in os.walk(app_dir):
    if any(x in root for x in ['node_modules', '.git', '__pycache__', 'audio_cache', 'scratch']):
        continue
    for f in files:
        if not f.endswith(('.js', '.html', '.css', '.json', '.py', '.txt', '.md')):
            continue
        p = os.path.join(root, f)
        with open(p, 'r', encoding='utf-8', errors='replace') as fp:
            for lno, line in enumerate(fp, 1):
                m = mojibake_regex.search(line)
                if m:
                    findings.append((p, lno, m.group(0), line.strip()[:100]))

print(f"Total mojibake suspicious patterns: {len(findings)}")
for p, lno, match, text in findings[:50]:
    rel = os.path.relpath(p, app_dir)
    print(f"{rel}:{lno} [matched {repr(match)}] -> {text}")
