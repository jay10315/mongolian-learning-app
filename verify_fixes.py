import json
import re

with open('js/data/initialVocabulary.js', 'r', encoding='utf-8') as f:
    text = f.read()

count_bad = text.count('（モンゴル語教科書語彙）')

# Check katakana in mongolian field
# Katakana unicode range: \u30A0-\u30FF
start = text.find('[')
end = text.rfind(']')
data = json.loads(text[start:end+1])

katakana_pattern = re.compile(r'[\u30A0-\u30FF]')
katakana_in_mongolian = []

for item in data:
    m = item.get('mongolian', '')
    if katakana_pattern.search(m):
        katakana_in_mongolian.append({'id': item.get('id'), 'mongolian': m, 'japanese': item.get('japanese')})

# Find хоолоор дайл
sample = [item for item in data if 'хоолоор дайл' in item.get('mongolian', '')]

result = {
    'total_words': len(data),
    'bad_placeholder_count': count_bad,
    'katakana_in_mongolian': katakana_in_mongolian,
    'sample_item': sample
}

with open('verify_fixes_result.json', 'w', encoding='utf-8') as f:
    json.dump(result, f, ensure_ascii=False, indent=2)

print("Verification written to verify_fixes_result.json")
