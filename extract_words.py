import sys, re

with open(r'C:\Users\kkaho\.gemini\antigravity\scratch\mongol-learning-app\raw_vocab.txt', 'r', encoding='utf-8') as f:
    lines = [l.strip() for l in f if l.strip()]

words = []
single_letters = set('АБВГДЕЁЖЗИЙКЛМНОӨПРСТУҮФХЦЧШЩЪЫЬЭЮЯ')

for l in lines:
    if l in ('<USER_REQUEST>', '</USER_REQUEST>', 'モンゴル語', '単語も文法も圧倒的に数が足りないよ') or l.startswith('<'):
        continue
    if len(l) == 1 and l in single_letters:
        continue
    words.append(l)

print(f"Total distinct vocabulary items: {len(words)}")
with open(r'C:\Users\kkaho\.gemini\antigravity\scratch\mongol-learning-app\parsed_vocab_list.txt', 'w', encoding='utf-8') as f:
    for w in words:
        f.write(w + '\n')
