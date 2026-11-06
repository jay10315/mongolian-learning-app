import json, re

with open(r'C:\Users\kkaho\.gemini\antigravity\scratch\mongol-learning-app\all_raw_words.json', 'r', encoding='utf-8') as f:
    raw_words = json.load(f)

clean_words = []
for w in raw_words:
    w = w.strip()
    if not w: continue
    # Must contain at least one Cyrillic character
    if not re.search(r'[\u0400-\u04FF]', w):
        continue
    if w in ('<USER_REQUEST>', '</USER_REQUEST>', 'モンゴル語', '単語も文法も圧倒的に数が足りないよ'):
        continue
    clean_words.append(w)

print(f"Total valid Cyrillic vocabulary items: {len(clean_words)}")
with open(r'C:\Users\kkaho\.gemini\antigravity\scratch\mongol-learning-app\clean_vocab_list.json', 'w', encoding='utf-8') as f:
    json.dump(clean_words, f, ensure_ascii=False, indent=2)
