import json

with open('js/data/initialVocabulary.js', 'r', encoding='utf-8') as f:
    text = f.read()

start = text.find('[')
end = text.rfind(']')
data = json.loads(text[start:end+1])

verbs = [x for x in data if x.get('isVerb')]
print("Total words:", len(data))
print("Total verbs:", len(verbs))
print("Sample verb 1:", verbs[0]['mongolian'], "-> dictForm:", verbs[0]['dictForm'], "root:", verbs[0]['root'])
print("Sample verb 2:", verbs[2]['mongolian'], "-> dictForm:", verbs[2]['dictForm'], "root:", verbs[2]['root'])
print("Sample verb 3:", verbs[10]['mongolian'], "-> dictForm:", verbs[10]['dictForm'], "root:", verbs[10]['root'])
