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
    
    # Analyze ending
    if root == 'амар':
        return f"辞書形「{dict_form}」は、語幹「{root}」に母音で始まる語尾（-ах）が接続した際に短母音「а」が脱落した形（амр ＋ ах）です。活用の基本となる語幹は「{root}」です（{vh_str}）。"
    elif root == 'амьдар':
        return f"辞書形「{dict_form}」は、語幹「{root}」に母音語尾（-ах）が接続した際に短母音「а」が脱落した形です。活用の基本となる語幹は「{root}」です（{vh_str}）。"
    elif ' ' in dict_form:
        parts = dict_form.split()
        verb_part = parts[-1]
        verb_root = root.split()[-1] if ' ' in root else root
        return f"連語・動詞句「{dict_form}」の主要動詞「{verb_part}」の語幹「{verb_root}」に語尾が接続します。動詞句全体の語幹形は「{root}」です（{vh_str}）。"
    elif dict_form.endswith(('ах', 'эх', 'ох', 'өх', 'их')):
        suffix = dict_form[-2:]
        return f"辞書形「{dict_form}」は、語幹「{root}」に不定詞語尾「-{suffix}」（{vh_str}調和）が接続した基本形です。活用語尾（-на/-нэ, -сан/-сэн, -ж/-ч等）はすべて語幹「{root}」に接続します。"
    elif dict_form.endswith('х'):
        return f"辞書形「{dict_form}」は、長母音・二重母音の語幹「{root}」に語尾「-х」が接続した形です（{vh_str}）。母音で始まる活用語尾の前には隠れ「г」が現れます。"
    else:
        return f"動詞「{dict_form}」の活用の土台となる語幹は「{root}」です（{vh_str}）。"

sample_derivations = []
for item in data[:60]:
    pos = item.get('pos', '')
    r = item.get('root', '').replace('-', '').strip()
    m = item.get('mongolian', '').strip()
    j = item.get('japanese', '').strip()
    is_verb = '動詞' in pos or (r != '' and pos not in ['名詞', '名詞句', '代名詞', '数詞', '形容詞', '副詞', '助詞', '後置詞'])
    if is_verb:
        dict_form = m
        if ',' in dict_form:
            dict_form = dict_form.split(',')[0].strip()
        dict_form = re.sub(r'\((\w+)\)', r'\1', dict_form)
        if not r:
            if dict_form.endswith(('ах', 'эх', 'ох', 'өх', 'их')):
                r = dict_form[:-2]
            elif dict_form.endswith('х'):
                r = dict_form[:-1]
            else:
                r = dict_form
        deriv = build_derivation(dict_form, r, pos, j)
        sample_derivations.append({
            'dictForm': dict_form,
            'root': r,
            'japanese': j,
            'derivation': deriv
        })

with open('derivations_sample.json', 'w', encoding='utf-8') as f:
    json.dump(sample_derivations, f, ensure_ascii=False, indent=2)

print("Saved derivations_sample.json, count:", len(sample_derivations))
