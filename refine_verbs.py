import json
import re

with open('js/data/initialVocabulary.js', 'r', encoding='utf-8') as f:
    text = f.read()

start = text.find('[')
end = text.rfind(']')
data = json.loads(text[start:end+1])

def refine_verb(item):
    id_ = item['id']
    m = item.get('mongolian', '').strip()
    pos = item.get('pos', '').strip()
    r = item.get('root', '').replace('-', '').strip()
    j = item.get('japanese', '').strip()
    
    is_verb = '動詞' in pos or (r != '' and pos not in ['名詞', '名詞句', '代名詞', '数詞', '形容詞', '副詞', '助詞', '後置詞', '挨拶', '挨拶表現'])
    
    if not is_verb:
        # Clean non-verb
        clean = re.sub(r'\s*\([^)]*\)', '', m).strip()
        return {
            'id': id_,
            'is_verb': False,
            'dictForm': clean,
            'root': '',
            'mongolian': m,
            'japanese': j,
            'pos': pos
        }
        
    # Is verb
    # Special dictionary forms
    if id_ == 'v_2_20' or m == 'байна':
        dict_form = 'байх'
        root = 'бай'
    elif id_ == 'v_2_21' or m == 'байхгүй':
        dict_form = 'байх'
        root = 'бай'
    elif id_ == 'v_13_2' or m == 'болохгүй':
        dict_form = 'болох'
        root = 'бол'
    elif id_ == 'v_gen_64' or m == 'болчихлоо':
        dict_form = 'болох'
        root = 'бол'
    elif m.startswith('амра(х)') or m == 'амрах':
        dict_form = 'амрах'
        root = 'амар'
    elif m.startswith('амьдра(х)') or m == 'амьдрах':
        dict_form = 'амьдрах'
        root = 'амьдар'
    else:
        # Ав(ах) -> авах
        dict_form = m
        if ',' in dict_form:
            dict_form = dict_form.split(',')[0].strip()
        dict_form = re.sub(r'\((\w+)\)', r'\1', dict_form)
        
        if r and '(' not in r and ')' not in r:
            root = r
        else:
            if dict_form.endswith(('ах', 'эх', 'ох', 'өх', 'их')):
                root = dict_form[:-2]
            elif dict_form.endswith('х'):
                root = dict_form[:-1]
            else:
                root = dict_form
                
    return {
        'id': id_,
        'is_verb': True,
        'dictForm': dict_form,
        'root': root,
        'mongolian': m,
        'japanese': j,
        'pos': pos
    }

refined = [refine_verb(x) for x in data]
verbs = [x for x in refined if x['is_verb']]

with open('refined_verbs.json', 'w', encoding='utf-8') as f:
    json.dump({'count': len(verbs), 'verbs': verbs}, f, ensure_ascii=False, indent=2)

print("Refined verbs:", len(verbs))
