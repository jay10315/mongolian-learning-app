import json

with open('js/data/initialVocabulary.js', 'r', encoding='utf-8') as f:
    text = f.read()

start = text.find('[')
end = text.rfind(']')
data = json.loads(text[start:end+1])

verbs = [item for item in data if '動詞' in (item.get('pos') or '') or (item.get('root') and item.get('root').strip() != '')]

print(f"Total words: {len(data)}, Total verbs found: {len(verbs)}")

sample_verbs = []
for v in verbs[:20]:
    sample_verbs.append({
        'id': v.get('id'),
        'mongolian': v.get('mongolian'),
        'japanese': v.get('japanese'),
        'pos': v.get('pos'),
        'root': v.get('root')
    })

with open('verbs_audit.json', 'w', encoding='utf-8') as f:
    json.dump({'total_verbs': len(verbs), 'samples': sample_verbs}, f, ensure_ascii=False, indent=2)
