import json

with open('js/data/initialVocabulary.js', 'r', encoding='utf-8') as f:
    text = f.read()

start = text.find('[')
end = text.rfind(']')
data = json.loads(text[start:end+1])

items_to_fix = []
for item in data:
    j = item.get('japanese', '')
    if '（モンゴル語教科書語彙）' in j or j.strip() == item.get('mongolian', '').strip() or j.strip() == '':
        items_to_fix.append({
            'id': item['id'],
            'mongolian': item['mongolian'],
            'japanese': item['japanese'],
            'root': item.get('root', ''),
            'pos': item.get('pos', ''),
            'pronunciation': item.get('pronunciation', ''),
            'note': item.get('note', '')
        })

with open('items_to_fix.json', 'w', encoding='utf-8') as out:
    json.dump(items_to_fix, out, ensure_ascii=False, indent=2)

print(f"Total items needing translation fix: {len(items_to_fix)}")
