import json

vocab_path = 'js/data/initialVocabulary.js'
with open(vocab_path, 'r', encoding='utf-8') as f:
    text = f.read()

start = text.find('[')
end = text.rfind(']')
data = json.loads(text[start:end+1])

cleaned = 0
for item in data:
    ex_ja = item.get('exampleJa', '')
    if '（モンゴル語教科書語彙）' in ex_ja:
        # If it was just "[word]（モンゴル語教科書語彙）。" or similar
        item['exampleJa'] = f"{item['japanese']}。"
        cleaned += 1

print(f"Cleaned exampleJa in {cleaned} items.")

new_js = f"// JICAモンゴル語教科書 全単語完全網羅データ（全744語・完全日本語訳・語幹・発音付き）\nexport const initialVocabulary = {json.dumps(data, ensure_ascii=False, indent=2)};\n"
with open(vocab_path, 'w', encoding='utf-8') as f:
    f.write(new_js)

print("Saved js/data/initialVocabulary.js successfully!")
