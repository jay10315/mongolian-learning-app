import sys, json, re
sys.stdout.reconfigure(encoding='utf-8')

with open('js/data/initialVocabulary.js', 'r', encoding='utf-8') as f:
    text = f.read()

m = re.search(r'export const initialVocabulary = (\[[\s\S]*?\]);', text)
initialVocabulary = json.loads(m.group(1))

with open('js/data/textbookClassificationData.js', 'r', encoding='utf-8') as f:
    c_text = f.read()

m2 = re.search(r'export const TEXTBOOK_CLASSIFICATION_DATA = (\{[\s\S]*?\});', c_text)
classification = json.loads(m2.group(1))

missing = []
textbook_items = []
later_items = []

for item in initialVocabulary:
    item_id = item['id']
    if item_id in classification:
        status = classification[item_id]['status']
        if status == 'textbook':
            textbook_items.append(item)
        elif status == 'later':
            later_items.append(item)
    else:
        missing.append(item)

print(f"Total initialVocabulary: {len(initialVocabulary)}")
print(f"Classified as textbook: {len(textbook_items)}")
print(f"Classified as later: {len(later_items)}")
print(f"Missing from classification: {len(missing)}")
