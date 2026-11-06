import json

with open('js/data/initialVocabulary.js', 'r', encoding='utf-8') as f:
    text = f.read()

start = text.find('[')
end = text.rfind(']')
vocab = json.loads(text[start:end+1])

v_hool = next((x for x in vocab if 'хоолоор дайл' in x.get('mongolian', '')), None)
with open('debug_hool_out.json', 'w', encoding='utf-8') as f:
    json.dump(v_hool, f, ensure_ascii=False, indent=2)

print("Saved debug_hool_out.json")
