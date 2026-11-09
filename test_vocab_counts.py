import sys, json, re
sys.stdout.reconfigure(encoding='utf-8')

# Read initialVocabulary
with open('js/data/initialVocabulary.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Parse JSON inside initialVocabulary
m = re.search(r'export const initialVocabulary = (\[[\s\S]*?\]);', text)
if m:
    initialVocabulary = json.loads(m.group(1))
    print("Loaded initialVocabulary:", len(initialVocabulary))

# Read textbookClassificationData
with open('js/data/textbookClassificationData.js', 'r', encoding='utf-8') as f:
    c_text = f.read()

m2 = re.search(r'export const TEXTBOOK_CLASSIFICATION_DATA = (\{[\s\S]*?\});', c_text)
if m2:
    classification = json.loads(m2.group(1))
    print("Loaded classification:", len(classification))

# Simulate StorageService.getAllVocabulary() and getVocabulary()
baseList = initialVocabulary

# Map each item
mapped = []
for item in baseList:
    c_data = classification.get(item['id'], {
        'status': 'textbook',
        'statusLabel': '学習済み教材の単語'
    })
    isAdded = False
    mapped.append({
        **item,
        'textbookStatus': c_data.get('status', 'textbook'),
        'isAddedToLearning': isAdded
    })

# filter for getVocabulary()
learning_vocab = [item for item in mapped if item['textbookStatus'] == 'textbook' or item.get('isAddedToLearning')]
later_vocab = [item for item in mapped if item['textbookStatus'] == 'later' and not item.get('isAddedToLearning')]

print(f"Total base vocabulary: {len(baseList)}")
print(f"Formal learning vocabulary (getVocabulary): {len(learning_vocab)}")
print(f"Later words (getLaterWords): {len(later_vocab)}")
