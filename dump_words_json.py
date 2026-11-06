import json, sys

with open(r'C:\Users\kkaho\.gemini\antigravity\scratch\mongol-learning-app\parsed_vocab_list.txt', 'r', encoding='utf-8') as f:
    words = [l.strip() for l in f if l.strip()]

# Let's save as JSON
with open(r'C:\Users\kkaho\.gemini\antigravity\scratch\mongol-learning-app\all_raw_words.json', 'w', encoding='utf-8') as f:
    json.dump(words, f, ensure_ascii=False, indent=2)

print(f"Total raw words saved to JSON: {len(words)}")
