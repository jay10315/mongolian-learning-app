import json
import re

with open('js/data/initialVocabulary.js', 'r', encoding='utf-8') as f:
    text = f.read()

start = text.find('[')
end = text.rfind(']')
data = json.loads(text[start:end+1])

from test_derivations import detect_vowel_harmony, build_derivation

all_verbs_derivations = []
for item in data:
    pos = item.get('pos', '')
    r = item.get('root', '').replace('-', '').strip()
    m = item.get('mongolian', '').strip()
    j = item.get('japanese', '').strip()
    is_verb = '動詞' in pos or (r != '' and pos not in ['名詞', '名詞句', '代名詞', '数詞', '形容詞', '副詞', '助詞', '後置詞', '挨拶', '挨拶表現'])
    if is_verb:
        dict_form = m
        if ',' in dict_form:
            dict_form = dict_form.split(',')[0].strip()
        dict_form = re.sub(r'\((\w+)\)', r'\1', dict_form)
        
        # Exceptions
        if m.startswith('амра(х)') or m == 'амрах':
            r = 'амар'
        elif m.startswith('амьдра(х)') or m == 'амьдрах':
            r = 'амьдар'
        elif not r or '(' in r or ')' in r:
            if dict_form.endswith(('ах', 'эх', 'ох', 'өх', 'их')):
                r = dict_form[:-2]
            elif dict_form.endswith('х'):
                r = dict_form[:-1]
            else:
                r = dict_form
        
        deriv = build_derivation(dict_form, r, pos, j)
        all_verbs_derivations.append({
            'id': item['id'],
            'dictForm': dict_form,
            'root': r,
            'japanese': j,
            'derivation': deriv
        })

with open('all_verbs_derivations.json', 'w', encoding='utf-8') as f:
    json.dump({'count': len(all_verbs_derivations), 'samples': all_verbs_derivations[:15]}, f, ensure_ascii=False, indent=2)

print("Saved all_verbs_derivations.json, count:", len(all_verbs_derivations))
