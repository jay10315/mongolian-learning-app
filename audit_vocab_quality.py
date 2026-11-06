import json
import re

with open('js/data/initialVocabulary.js', 'r', encoding='utf-8') as f:
    text = f.read()

start = text.find('[')
end = text.rfind(']')
data = json.loads(text[start:end+1])

issues = []
cyrillic_pattern = re.compile(r'[\u0400-\u04FF]')

for item in data:
    m = item.get('mongolian', '').strip()
    j = item.get('japanese', '').strip()
    p = item.get('pronunciation', '').strip()
    r = item.get('root', '').strip()
    
    # Check if japanese still contains cyrillic letters
    cyrillic_in_ja = cyrillic_pattern.findall(j)
    if cyrillic_in_ja:
        issues.append({'id': item.get('id'), 'type': 'cyrillic_in_japanese', 'mongolian': m, 'japanese': j, 'found': ''.join(set(cyrillic_in_ja))})
    
    # Check if japanese is empty
    if not j:
        issues.append({'id': item.get('id'), 'type': 'empty_japanese', 'mongolian': m})
    
    # Check if pronunciation is empty
    if not p:
        issues.append({'id': item.get('id'), 'type': 'empty_pronunciation', 'mongolian': m})

with open('vocab_quality_issues.json', 'w', encoding='utf-8') as f:
    json.dump({'total_words': len(data), 'issues': issues}, f, ensure_ascii=False, indent=2)

print(f"Total words: {len(data)}, Issues found: {len(issues)}")
