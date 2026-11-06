import json

with open('js/data/initialVocabulary.js', 'r', encoding='utf-8') as f:
    text = f.read()

start = text.find('[')
end = text.rfind(']')
data = json.loads(text[start:end+1])

from apply_vocab_fixes import FIXES

match_count = 0
for d in data:
    if d['id'] in FIXES:
        match_count += 1
        d['japanese'] = FIXES[d['id']]['japanese']

print("Matches found:", match_count)
# check if any in data still has placeholder
placeholder_count = sum(1 for d in data if '（モンゴル語教科書語彙）' in d.get('japanese', ''))
print("Placeholder count in data after update:", placeholder_count)

new_content = f"// JICAモンゴル語教科書 全単語完全網羅データ\nexport const initialVocabulary = {json.dumps(data, ensure_ascii=False, indent=2)};\n"
with open('js/data/initialVocabulary.js', 'w', encoding='utf-8') as f:
    f.write(new_content)

with open('js/data/initialVocabulary.js', 'r', encoding='utf-8') as f:
    text2 = f.read()
print("Placeholder count in file now:", text2.count('（モンゴル語教科書語彙）'))
