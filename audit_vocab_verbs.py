import json
import re

with open('js/data/initialVocabulary.js', 'r', encoding='utf-8') as f:
    text = f.read()

start = text.find('[')
end = text.rfind(']')
data = json.loads(text[start:end+1])

parentheses_items = []
verbs_without_root = []
all_verbs = []

for item in data:
    m = item.get('mongolian', '')
    pos = item.get('pos', '')
    root = item.get('root', '')
    
    if '(' in m or ')' in m:
        parentheses_items.append({
            'id': item.get('id'),
            'mongolian': m,
            'pos': pos,
            'root': root,
            'japanese': item.get('japanese')
        })
    
    is_verb = '動詞' in pos or (root and root.strip() != '')
    if is_verb:
        all_verbs.append(item)
        if not root or root.strip() == '':
            verbs_without_root.append({
                'id': item.get('id'),
                'mongolian': m,
                'pos': pos,
                'japanese': item.get('japanese')
            })

report = {
    'total_words': len(data),
    'total_with_parentheses': len(parentheses_items),
    'total_verbs': len(all_verbs),
    'verbs_without_root_count': len(verbs_without_root),
    'verbs_without_root_samples': verbs_without_root[:20],
    'parentheses_samples': parentheses_items[:20]
}

with open('vocab_verbs_audit.json', 'w', encoding='utf-8') as f:
    json.dump(report, f, ensure_ascii=False, indent=2)

print("Report saved to vocab_verbs_audit.json")
