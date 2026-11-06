import json
import re

with open('js/data/initialVocabulary.js', 'r', encoding='utf-8') as f:
    text = f.read()

start = text.find('[')
end = text.rfind(']')
data = json.loads(text[start:end+1])

def process_item(item):
    m = item.get('mongolian', '').strip()
    pos = item.get('pos', '').strip()
    r = item.get('root', '').strip()
    j = item.get('japanese', '').strip()
    
    # Is verb?
    is_verb = '動詞' in pos or (r != '' and pos not in ['名詞', '名詞句', '代名詞', '数詞', '形容詞', '副詞', '助詞', '後置詞', '間投詞', '挨拶', '挨拶表現'])
    
    # 1. Dictionary Form (辞書形)
    dict_form = m
    if ',' in dict_form:
        dict_form = dict_form.split(',')[0].strip()
    
    if '(' in dict_form and ')' in dict_form:
        if is_verb:
            # ав(ах) -> авах, дуус(ах) -> дуусах, оро(х) -> орох
            dict_form = re.sub(r'\((\w+)\)', r'\1', dict_form)
        else:
            # автобус(н) -> автобус, номын сан(г) -> номын сан, гурав (名詞前: гурван) -> гурав
            dict_form = re.sub(r'\s*\([^)]*\)', '', dict_form).strip()
    
    # 2. Verb Root (語幹)
    clean_root = ''
    if is_verb:
        # If r is given and valid
        if r and '(' not in r and ')' not in r:
            clean_root = r.replace('-', '').strip()
        else:
            # Special exceptions
            if m.startswith('амра(х)') or m == 'амрах':
                clean_root = 'амар'
            elif m.startswith('амьдра(х)') or m == 'амьдрах':
                clean_root = 'амьдар'
            elif dict_form.endswith(('ах', 'эх', 'ох', 'өх', 'их')):
                clean_root = dict_form[:-2]
            elif dict_form.endswith('х'):
                clean_root = dict_form[:-1]
            else:
                clean_root = dict_form
    else:
        # non-verb should not have a verb root
        clean_root = ''
        
    return {
        'id': item['id'],
        'mongolian': m,
        'dictForm': dict_form,
        'root': clean_root,
        'is_verb': is_verb,
        'pos': pos,
        'japanese': j
    }

processed = [process_item(x) for x in data]
verbs = [p for p in processed if p['is_verb']]
non_verbs_with_parens = [p for p in processed if not p['is_verb'] and ('(' in p['mongolian'] or ')' in p['mongolian'])]

print(f"Total processed: {len(processed)}, Verbs: {len(verbs)}, Non-verbs with parens: {len(non_verbs_with_parens)}")

with open('processed_audit.json', 'w', encoding='utf-8') as f:
    json.dump({
        'verbs_count': len(verbs),
        'verb_samples': verbs[:25],
        'non_verb_samples': non_verbs_with_parens[:25]
    }, f, ensure_ascii=False, indent=2)
