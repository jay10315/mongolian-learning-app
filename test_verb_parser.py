import json
import re

with open('js/data/initialVocabulary.js', 'r', encoding='utf-8') as f:
    text = f.read()

start = text.find('[')
end = text.rfind(']')
data = json.loads(text[start:end+1])

def extract_verb_info(item):
    m = item.get('mongolian', '').strip()
    pos = item.get('pos', '').strip()
    r = item.get('root', '').strip().replace('-', '')
    j = item.get('japanese', '').strip()
    
    is_verb = '動詞' in pos or (r != '' and pos != '名詞' and pos != '名詞句')
    
    # Clean dictionary form
    # If like "амра(х), амар" -> dictionary form is "амрах"
    dict_form = m
    if ',' in dict_form:
        dict_form = dict_form.split(',')[0].strip()
    # Remove parentheses notes like (名詞前: гурван)
    if '(' in dict_form and ')' in dict_form:
        # If pattern like ав(ах) -> авах
        dict_form = re.sub(r'\((\w+)\)', r'\1', dict_form)
        # If pattern like автобус(н) -> автобус (for non-verb)
        # but for verb: ав(ах) -> авах, оро(х) -> орох, дуус(ах) -> дуусах
    
    # Clean root
    clean_root = r
    if is_verb:
        if clean_root:
            clean_root = clean_root.replace('(', '').replace(')', '').strip()
        else:
            # derive root from dict_form
            # usually ends with ах/эх/ох/өх/их/х
            if dict_form.endswith(('ах', 'эх', 'ох', 'өх', 'их')):
                clean_root = dict_form[:-2]
            elif dict_form.endswith('х'):
                clean_root = dict_form[:-1]
            else:
                clean_root = dict_form
    
    return {
        'id': item['id'],
        'raw_mongolian': m,
        'is_verb': is_verb,
        'dict_form': dict_form,
        'root': clean_root if is_verb else '',
        'japanese': j,
        'pos': pos
    }

parsed_verbs = []
for item in data:
    info = extract_verb_info(item)
    if info['is_verb']:
        parsed_verbs.append(info)

with open('parsed_verbs_check.json', 'w', encoding='utf-8') as f:
    json.dump({'verb_count': len(parsed_verbs), 'samples': parsed_verbs[:30]}, f, ensure_ascii=False, indent=2)

print("Parsed verbs count:", len(parsed_verbs))
