import json

with open(r'C:\Users\kkaho\.gemini\antigravity\scratch\mongol-learning-app\all_raw_words.json', 'r', encoding='utf-8') as f:
    raw_words = json.load(f)

# Let's inspect words starting from Ж onwards
print(f"Total words: {len(raw_words)}")
letters = {}
for w in raw_words:
    first = w[0].upper()
    if first not in letters:
        letters[first] = []
    letters[first].append(w)

for let, wlist in sorted(letters.items()):
    print(f"Letter {let}: {len(wlist)} words. First 3: {wlist[:3]}")
