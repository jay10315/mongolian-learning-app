import json, sys

with open(r'C:\Users\kkaho\.gemini\antigravity\scratch\mongol-learning-app\clean_vocab_list.json', 'r', encoding='utf-8') as f:
    words = json.load(f)

# Group by letter
groups = {}
for w in words:
    char = w[0].upper()
    groups.setdefault(char, []).append(w)

for k in sorted(groups.keys()):
    sys.stdout.buffer.write(f"=== Letter {k} ({len(groups[k])} words) ===\n".encode('utf-8'))
    for item in groups[k][:10]:
        sys.stdout.buffer.write(f"  {item}\n".encode('utf-8'))
