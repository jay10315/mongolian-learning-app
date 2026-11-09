import sys, os, re, json, fitz
sys.stdout.reconfigure(encoding='utf-8')

artifact_dir = r"C:\Users\kkaho\.gemini\antigravity\brain\9e6c0c7c-54e8-4fea-b32c-15aedb0e9c33\.user_uploaded"

texts = {}
for fname, label in [
    ('media_1793875013665_0e92ff67.md', '文法ハンドブック'),
    ('media_1793953043183_89fc24ca.txt', '学習ノート（メモ）'),
    ('media_1794042190197_e64c4979.txt', '練習問題集（問題集テキスト）'),
    ('media_1794042223998_3232f955.txt', 'JICA教科書（教科書テキスト）')
]:
    p = os.path.join(artifact_dir, fname)
    with open(p, 'r', encoding='utf-8', errors='ignore') as f:
        texts[label] = f.read()

pdf_p = os.path.join(artifact_dir, 'media_1793865503110_6a9ac1f8.pdf')
doc = fitz.open(pdf_p)
pdf_text = ''
for page in doc:
    pdf_text += page.get_text() + '\n'
texts['教科書（PDF）'] = pdf_text

all_tokens_by_source = {}
for source, txt in texts.items():
    toks = set(re.findall(r'[а-яёөүА-ЯЁӨҮ]+', txt.lower()))
    all_tokens_by_source[source] = toks

# Load initialVocabulary
with open('js/data/initialVocabulary.js', 'r', encoding='utf-8') as f:
    text = f.read()
start = text.find('[')
end = text.rfind(']')
vocab = json.loads(text[start:end+1])

# Load current classification
with open('js/data/textbookClassificationData.js', 'r', encoding='utf-8') as f:
    c_text = f.read()
c_start = c_text.find('{')
c_end = c_text.rfind('}')
classification_data = json.loads(c_text[c_start:c_end+1])

VERB_INFLECTIONS = [
    'сан', 'сэн', 'сон', 'сөн', 'лаа', 'лээ', 'лоо', 'лөө', 'жээ', 'чээ', 'в',
    'даг', 'дэг', 'дог', 'дөг',
    'на', 'нэ', 'но', 'нө', 'я', 'е', 'ё', 'аарай', 'ээрэй', 'оорой', 'өөрэй',
    'маар', 'мээр', 'моор', 'мөөр', 'аач', 'ээч', 'ооч', 'өөч',
    'ж', 'ч', 'аад', 'ээд', 'оод', 'өөд', 'вал', 'вэл', 'вол', 'вөл', 'бал', 'бэл', 'бол', 'бөл',
    'хаар', 'хээр', 'хоор', 'хөөр', 'хад', 'хэд', 'ход', 'хөд', 'хдаа', 'хдээ', 'хдоо', 'хдөө',
    'уул', 'үүл', 'лга', 'лгэ', 'лго', 'лгө', 'гда', 'гдэ', 'гдо', 'гдө', 'лц', 'лцах', 'лцэх',
    'аагүй', 'ээгүй', 'оогүй', 'өөгүй', 'хгүй'
]

NOUN_CASES = [
    'ын', 'ийн', 'ы', 'ий', 'н', 'д', 'т', 'аас', 'ээс', 'оос', 'өөс',
    'аар', 'ээр', 'оор', 'өөр', 'тай', 'тэй', 'той', 'руу', 'рүү', 'луу', 'лүү',
    'аа', 'ээ', 'оо', 'өө', 'ууд', 'үүд', 'чууд', 'чүүд', 'нар'
]

# Blacklist false positive stem matches (words with coincidental homonyms)
EXCLUDE_FALSE_MATCHES = {
    'v_gen_law_crime_6',   # шүүх (裁判) vs шүү (助詞), шүүгээ (棚)
    'v_gen_law_crime_11',  # эрх (権利) vs эрүүл (健康)
    'v_req_act_6',         # тоох (気にする) vs тоо (数字)
    'v_note_137',          # хийц vs хийд (寺)
    'v_note_140',          # гол ач холボгдол vs гол (川)
    'v_note_127'           # хаа нэг тийшээ vs хаах (閉める)
}

def clean_word(w):
    return re.sub(r'[\(\)\.\,\s\d]+', '', w).strip().lower()

promoted_count = 0

for item in vocab:
    wid = item['id']
    curr = classification_data.get(wid, {})
    if curr.get('status') == 'textbook':
        continue
    
    if wid in EXCLUDE_FALSE_MATCHES:
        continue
    
    raw_word = item['mongolian'].strip()
    is_verb = item.get('isVerb') or item.get('pos') == '動詞' or (raw_word.endswith(('х', 'х)')) and len(raw_word) >= 3)
    
    matched_sources = set()
    match_evidence = []
    
    if is_verb:
        clean_v = clean_word(raw_word)
        stems = set()
        if clean_v.endswith('х'):
            base = clean_v[:-1]
            stems.add(base)
            if base.endswith(('а', 'э', 'о', 'ө', 'и')):
                stems.add(base[:-1])
        explicit_root = (item.get('root') or '').strip().rstrip('-').lower()
        if explicit_root:
            stems.add(explicit_root)
        
        valid_stems = [s for s in stems if len(s) >= 2]
        
        for s, tok_set in all_tokens_by_source.items():
            for stem in valid_stems:
                if len(stem) >= 3 and stem in tok_set:
                    matched_sources.add(s)
                    match_evidence.append(f"語幹 '{stem}'")
                for infl in VERB_INFLECTIONS:
                    form = stem + infl
                    if form in tok_set:
                        matched_sources.add(s)
                        match_evidence.append(f"活用形 '{form}'")
                    if stem.endswith(('ч', 'ж', 'ш', 'г', 'р', 'л', 'в', 'д', 'т', 'с')):
                        for conn in ['а', 'э', 'о', 'ө', 'и', 'у', 'ү']:
                            form2 = stem + conn + infl
                            if form2 in tok_set:
                                matched_sources.add(s)
                                match_evidence.append(f"活用形 '{form2}'")
    else:
        clean_n = clean_word(raw_word)
        if len(clean_n) >= 3:
            for s, tok_set in all_tokens_by_source.items():
                for case_suf in NOUN_CASES:
                    form = clean_n + case_suf
                    if form in tok_set:
                        matched_sources.add(s)
                        match_evidence.append(f"格変化/複数 '{form}'")
                    if clean_n.endswith(('ь', 'и', 'а', 'э', 'о', 'ө')):
                        form2 = clean_n[:-1] + case_suf
                        if form2 in tok_set:
                            matched_sources.add(s)
                            match_evidence.append(f"格変化 '{form2}'")
    
    if matched_sources:
        promoted_count += 1
        src_list = sorted(list(matched_sources))
        ev_sample = sorted(list(set(match_evidence)))[:3]
        desc = f"{', '.join(src_list)} に関連語・活用形（{', '.join(ev_sample)}）が登場"
        
        classification_data[wid] = {
            "status": "textbook",
            "statusLabel": "学習済み教材の単語",
            "appearanceSources": src_list,
            "appearanceDesc": desc,
            "reason": "教材内に同じ語根を持つ活用形・派生形・関連語が登場",
            "isVerb": bool(is_verb),
            "stem": item.get('root', ''),
            "dictForm": item.get('dictForm', raw_word)
        }

print(f"Successfully promoted {promoted_count} words to 'textbook' status based on root/inflection matching.")

# Recount
tb_count = sum(1 for v in classification_data.values() if v.get('status') == 'textbook')
lt_count = sum(1 for v in classification_data.values() if v.get('status') == 'later')
print(f"New total: Textbook={tb_count}, Later={lt_count}, Sum={tb_count + lt_count}")

# Save updated classification data
header = """// 教科書・学習ノート照合による単語分類マスターデータ
// 自動生成: JICA教科書・練習問題集・文法ハンドブック・学習ノートの全5教材と完全照合済み
// 語根・活用形・派生形ルール適用版（同じ語根の活用形が教材に登場している場合も「教材登場単語」として分類）
export const TEXTBOOK_CLASSIFICATION_DATA = """

output_path = "js/data/textbookClassificationData.js"
with open(output_path, "w", encoding="utf-8") as f:
    f.write(header)
    json.dump(classification_data, f, ensure_ascii=False, indent=2)
    f.write(";\n")

# Also write to dist/
dist_path = "dist/js/data/textbookClassificationData.js"
with open(dist_path, "w", encoding="utf-8") as f:
    f.write(header)
    json.dump(classification_data, f, ensure_ascii=False, indent=2)
    f.write(";\n")

print("Updated textbookClassificationData.js in both js/ and dist/.")
