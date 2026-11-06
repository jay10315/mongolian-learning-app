import json
import re

with open('js/data/initialVocabulary.js', 'r', encoding='utf-8') as f:
    text = f.read()

start = text.find('[')
end = text.rfind(']')
data = json.loads(text[start:end+1])

def detect_vowel_harmony(word):
    if not word:
        return 'neutral'
    w = word.lower()
    male = bool(re.search(r'[аоуяёю]', w))
    female = bool(re.search(r'[эөүе]', w))
    if male and not female:
        return 'male'
    if female and not male:
        return 'female'
    if male and female:
        m_pos = re.search(r'[аоуяёю]', w).start()
        f_pos = re.search(r'[эөүе]', w).start()
        return 'male' if m_pos < f_pos else 'female'
    return 'neutral'

def build_derivation(dict_form, root, pos, japanese):
    vh = detect_vowel_harmony(root or dict_form)
    vh_str = "男性母音語" if vh == 'male' else ("女性母音語" if vh == 'female' else "中性母音語")
    
    if root == 'амар':
        return f"辞書形「{dict_form}」は、語幹「{root}」に母音で始まる語尾（-ах）が接続した際に短母音「а」が脱落（амр ＋ ах ＝ амрах）した形です。活用の基本となる語幹は「{root}」です（{vh_str}）。"
    elif root == 'амьдар':
        return f"辞書形「{dict_form}」は、語幹「{root}」に母音語尾（-ах）が接続した際に短母音「а」が脱落した形です。活用の基本となる語幹は「{root}」です（{vh_str}）。"
    elif ' ' in dict_form:
        parts = dict_form.split()
        verb_part = parts[-1]
        verb_root = root.split()[-1] if ' ' in root else root
        return f"動詞句「{dict_form}」の主要動詞「{verb_part}」の語幹「{verb_root}」に語尾が接続します。動詞句全体の語幹形は「{root}」です（{vh_str}）。"
    elif dict_form.endswith(('ах', 'эх', 'ох', 'өх', 'их')):
        suffix = dict_form[-2:]
        return f"辞書形「{dict_form}」は、語幹「{root}」に不定詞語尾「-{suffix}」（{vh_str}調和）が接続した基本形です。活用語尾（-на/-нэ, -сан/-сэн, -ж/-ч等）はすべて語幹「{root}」に接続します。"
    elif dict_form.endswith('х'):
        return f"辞書形「{dict_form}」は、長母音・二重母音の語幹「{root}」に語尾「-х」が接続した形です（{vh_str}）。母音で始まる活用語尾の前には隠れ「г」が現れます。"
    else:
        return f"動詞「{dict_form}」の活用の土台となる語幹は「{root}」です（{vh_str}）。"

for item in data:
    id_ = item['id']
    m = item.get('mongolian', '').strip()
    pos = item.get('pos', '').strip()
    r = item.get('root', '').replace('-', '').strip()
    j = item.get('japanese', '').strip()
    
    is_verb = '動詞' in pos or (r != '' and pos not in ['名詞', '名詞句', '代名詞', '数詞', '形容詞', '副詞', '助詞', '後置詞', '挨拶', '挨拶表現'])
    
    if is_verb:
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
        
        item['isVerb'] = True
        item['dictForm'] = dict_form
        item['root'] = root
        item['derivation'] = build_derivation(dict_form, root, pos, j)
    else:
        # Non-verb
        clean = re.sub(r'\s*\([^)]*\)', '', m).strip()
        item['isVerb'] = False
        item['dictForm'] = clean
        item['root'] = ''
        if '(н)' in m:
            item['derivation'] = f"基本形は「{clean}」です。属格（-ны）や造格（-аар）などの格変化時に隠れ-нが現れます。"
        elif '(г)' in m:
            item['derivation'] = f"基本形は「{clean}」です。奪格（-гаас）などの格変化時に隠れ-гが現れます。"
        else:
            item['derivation'] = f"見出し語「{clean}」"

output_js = f"// JICAモンゴル語教科書 全単語完全網羅データ（全744語・辞書形・語幹・形成過程解説付き）\nexport const initialVocabulary = {json.dumps(data, ensure_ascii=False, indent=2)};\n"

with open('js/data/initialVocabulary.js', 'w', encoding='utf-8') as f:
    f.write(output_js)

print("Updated js/data/initialVocabulary.js with dictForm, root, and derivations!")
