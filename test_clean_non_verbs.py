import json
import re

with open('js/data/initialVocabulary.js', 'r', encoding='utf-8') as f:
    text = f.read()

start = text.find('[')
end = text.rfind(']')
data = json.loads(text[start:end+1])

def clean_non_verb(m):
    # If e.g. "автобус(н)" -> "автобус"
    # If e.g. "номын сан(г)" -> "номын сан"
    # If e.g. "гурав (名詞前: гурван)" -> "гурав"
    s = re.sub(r'\s*\([^)]*\)', '', m)
    return s.strip()

non_verbs_with_parens = []
for item in data:
    m = item['mongolian']
    pos = item.get('pos', '')
    if ('(' in m or ')' in m) and '動詞' not in pos:
        clean = clean_non_verb(m)
        non_verbs_with_parens.append({
            'id': item['id'],
            'raw': m,
            'clean': clean,
            'japanese': item['japanese'],
            'pos': pos
        })

with open('non_verbs_cleaned.json', 'w', encoding='utf-8') as f:
    json.dump({'count': len(non_verbs_with_parens), 'items': non_verbs_with_parens}, f, ensure_ascii=False, indent=2)

print("Non-verbs with parens count:", len(non_verbs_with_parens))
