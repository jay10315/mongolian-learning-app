import json

with open('js/data/initialVocabulary.js', 'r', encoding='utf-8') as f:
    text = f.read()

start = text.find('[')
end = text.rfind(']')
vocab = json.loads(text[start:end+1])

v_hool = next((x for x in vocab if 'хоолоор дайл' in x.get('mongolian', '')), None)
print("v_hool found:")
print("id:", v_hool.get('id'))
print("mongolian:", repr(v_hool.get('mongolian')))
print("isVerb:", v_hool.get('isVerb'))
print("dictForm:", repr(v_hool.get('dictForm')))
print("root:", repr(v_hool.get('root')))
print("pos:", repr(v_hool.get('pos')))
