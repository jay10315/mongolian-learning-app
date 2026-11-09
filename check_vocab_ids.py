import sys, re
sys.stdout.reconfigure(encoding='utf-8')

with open('js/data/initialVocabulary.js', 'r', encoding='utf-8') as f:
    text = f.read()

ids = re.findall(r'id:\s*[\'"]([^\'"]+)[\'"]', text)
print("Total IDs in initialVocabulary:", len(ids))
print("Sample IDs:", ids[:10])

with open('js/data/textbookClassificationData.js', 'r', encoding='utf-8') as f:
    c_text = f.read()

c_ids = re.findall(r'"(v_[^"]+)":\s*\{', c_text)
print("Total IDs in textbookClassificationData:", len(c_ids))
print("Sample c_ids:", c_ids[:10])

missing_in_c = set(ids) - set(c_ids)
print("IDs in initialVocabulary but missing in textbookClassificationData:", len(missing_in_c))
if missing_in_c:
    print("Sample missing:", list(missing_in_c)[:5])
