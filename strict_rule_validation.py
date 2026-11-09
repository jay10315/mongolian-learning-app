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
current_class = json.loads(c_text[c_start:c_end+1])

# Suffix sets for strict morphological matching
VERB_INFLECTIONS = [
    # Past
    'сан', 'сэн', 'сон', 'сөн', 'лаа', 'лээ', 'лоо', 'лөө', 'жээ', 'чээ', 'в', 'лаач', 'лээч',
    # Habitual
    'даг', 'дэг', 'дог', 'дөг',
    # Future / modal / imperative
    'на', 'нэ', 'но', 'нө', 'я', 'е', 'ё', 'аарай', 'ээрэй', 'оорой', 'өөрэй',
    'маар', 'мээр', 'моор', 'мөөр', 'аач', 'ээч', 'ооч', 'өөч', 'гтун', 'гтүн',
    # Converb / gerund
    'ж', 'ч', 'аад', 'ээд', 'оод', 'өөд', 'вал', 'вэл', 'вол', 'вөл', 'бал', 'бэл', 'бол', 'бөл',
    'хаар', 'хээр', 'хоор', 'хөөр', 'хад', 'хэд', 'ход', 'хөд', 'хдаа', 'хдээ', 'хдоо', 'хдөө',
    # Causative / Passive / Reciprocal
    'уул', 'үүл', 'лга', 'лгэ', 'лго', 'лгө', 'гда', 'гдэ', 'гдо', 'гдө', 'лц', 'лцах', 'лцэх',
    # Negation
    'аагүй', 'ээгүй', 'оогүй', 'өөгүй', 'хгүй'
]

NOUN_CASES = [
    'ын', 'ийн', 'ы', 'ий', 'н', 'д', 'т', 'аас', 'ээс', 'оос', 'өөс',
    'аар', 'ээр', 'оор', 'өөр', 'тай', 'тэй', 'той', 'руу', 'рүү', 'луу', 'лүү',
    'аа', 'ээ', 'оо', 'өө', 'ууд', 'үүд', 'чууд', 'чүүд', 'нар'
]

def clean_word(w):
    return re.sub(r'[\(\)\.\,\s\d]+', '', w).strip().lower()

promoted = []

for item in vocab:
    wid = item['id']
    curr = current_class.get(wid, {})
    if curr.get('status') == 'textbook':
        continue # Already marked textbook
    
    raw_word = item['mongolian'].strip()
    is_verb = item.get('isVerb') or item.get('pos') == '動詞' or (raw_word.endswith(('х', 'х)')) and len(raw_word) >= 3)
    
    matched_sources = set()
    match_evidence = []
    
    if is_verb:
        # Determine strict verb stem
        # e.g., сурах -> сур, бичих -> бич, ярих -> ярь/яри, тэмдэглэх -> тэмдэглэ, буцах -> буц
        clean_v = clean_word(raw_word)
        stems = set()
        
        # from dict form: strip ending 'х'
        if clean_v.endswith('х'):
            base = clean_v[:-1]
            stems.add(base)
            # drop connecting vowel if any (e.g. сурах -> сур, бичих -> бич)
            if base.endswith(('а', 'э', 'о', 'ө', 'и')):
                stems.add(base[:-1])
        
        explicit_root = (item.get('root') or '').strip().rstrip('-').lower()
        if explicit_root:
            stems.add(explicit_root)
        
        # Stems must be meaningful (at least 2 letters, prefer 3+)
        valid_stems = [s for s in stems if len(s) >= 2]
        
        for s, tok_set in all_tokens_by_source.items():
            for stem in valid_stems:
                # 1. Stem appears standalone (e.g. imperative: ид!, сур!)
                if len(stem) >= 3 and stem in tok_set:
                    matched_sources.add(s)
                    match_evidence.append(f"語幹 '{stem}'")
                
                # 2. Stem + inflection appears
                for infl in VERB_INFLECTIONS:
                    form = stem + infl
                    if form in tok_set:
                        matched_sources.add(s)
                        match_evidence.append(f"活用形 '{form}'")
                    # With connecting vowel: e.g. бич + и + х -> бичсэн
                    if stem.endswith(('ч', 'ж', 'ш', 'г', 'р', 'л', 'в', 'д', 'т', 'с')):
                        for conn in ['а', 'э', 'о', 'ө', 'и', 'у', 'ү']:
                            form2 = stem + conn + infl
                            if form2 in tok_set:
                                matched_sources.add(s)
                                match_evidence.append(f"活用形 '{form2}'")
    else:
        # Strict noun/adjective inflection matching
        clean_n = clean_word(raw_word)
        if len(clean_n) >= 3:
            for s, tok_set in all_tokens_by_source.items():
                for case_suf in NOUN_CASES:
                    # direct attach
                    form = clean_n + case_suf
                    if form in tok_set:
                        matched_sources.add(s)
                        match_evidence.append(f"格変化/複数 '{form}'")
                    # drop fleeting vowel at end
                    if clean_n.endswith(('ь', 'и', 'а', 'э', 'о', 'ө')):
                        form2 = clean_n[:-1] + case_suf
                        if form2 in tok_set:
                            matched_sources.add(s)
                            match_evidence.append(f"格変化 '{form2}'")
    
    if matched_sources:
        promoted.append({
            'id': wid,
            'word': raw_word,
            'japanese': item['japanese'],
            'isVerb': is_verb,
            'sources': sorted(list(matched_sources)),
            'evidence': sorted(list(set(match_evidence)))[:4]
        })

print(f"Strictly validated promoted words: {len(promoted)}")
for p in promoted[:35]:
    v_tag = '[動詞]' if p['isVerb'] else '[名詞等]'
    print(f"  {p['id']}: {p['word']} {v_tag} ({p['japanese']})")
    print(f"     根拠: {', '.join(p['evidence'])} in {p['sources']}")
