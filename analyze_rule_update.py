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
all_tokens = set()
for source, txt in texts.items():
    toks = set(re.findall(r'[а-яёөүА-ЯЁӨҮ]+', txt.lower()))
    all_tokens_by_source[source] = toks
    all_tokens.update(toks)

print(f"Total unique Cyrillic tokens in 5 textbooks: {len(all_tokens)}")

# Load initialVocabulary
with open('js/data/initialVocabulary.js', 'r', encoding='utf-8') as f:
    text = f.read()
start = text.find('[')
end = text.rfind(']')
vocab = json.loads(text[start:end+1])
print(f"Total vocabulary items: {len(vocab)}")

# Load current classification
with open('js/data/textbookClassificationData.js', 'r', encoding='utf-8') as f:
    c_text = f.read()
c_start = c_text.find('{')
c_end = c_text.rfind('}')
current_class = json.loads(c_text[c_start:c_end+1])

# Check how many 'later' words have roots / inflections in the textbooks
promoted = []
suffixes = [
    # Past
    'сан', 'сэн', 'сон', 'сөн', 'лаа', 'лээ', 'лоо', 'лөө', 'жээ', 'чээ', 'в',
    # Habitual
    'даг', 'дэг', 'дог', 'дөг',
    # Future / modal
    'на', 'нэ', 'но', 'нө', 'я', 'е', 'ё', 'аарай', 'ээрэй', 'оорой', 'өөрэй', 'маар', 'мээр', 'моор', 'мөөр',
    # Converb / gerund
    'ж', 'ч', 'аад', 'ээд', 'оод', 'өөд', 'вал', 'вэл', 'вол', 'вөл', 'бал', 'бэл', 'бол', 'бөл', 'хаар', 'хээр', 'хоор', 'хөөр', 'хад', 'хэд', 'ход', 'хөд', 'хдаа', 'хдээ', 'хдоо', 'хдөө',
    # Causative / Passive / Reciprocal
    'уул', 'үүл', 'лга', 'лгэ', 'лго', 'лгө', 'гда', 'гдэ', 'гдо', 'гдө', 'лц', 'лд',
    # Negation
    'аагүй', 'ээгүй', 'оогүй', 'өөгүй', 'хгүй',
    # Noun cases
    'ын', 'ийн', 'ы', 'ий', 'н', 'д', 'т', 'аас', 'ээс', 'оос', 'өөс', 'аар', 'ээр', 'оор', 'өөр', 'тай', 'тэй', 'той', 'руу', 'рүү', 'луу', 'лүү', 'аа', 'ээ', 'оо', 'өө',
    # Plural
    'ууд', 'үүд', 'чууд', 'чүүд', 'нар'
]

for item in vocab:
    wid = item['id']
    curr = current_class.get(wid, {})
    if curr.get('status') == 'textbook':
        continue # already textbook
    
    # It is currently 'later'
    # Check if a root or inflection or related form exists
    word = item['mongolian'].strip().lower()
    root = (item.get('root') or '').strip().lower().rstrip('-')
    
    matched_sources = set()
    found_tokens = []
    
    # Try verb stem
    stems_to_try = set()
    if root and len(root) >= 2:
        stems_to_try.add(root)
    if word.endswith('х') and len(word) >= 3:
        # e.g., сурах -> сур, бичих -> бич / бичи
        stems_to_try.add(word[:-1])
        if word.endswith(('их', 'эх', 'ах', 'ох', 'өх')):
            stems_to_try.add(word[:-2])
    
    # Check tokens starting with any stem followed by a valid suffix
    for s, tok_set in all_tokens_by_source.items():
        for stem in stems_to_try:
            if stem in tok_set:
                matched_sources.add(s)
                found_tokens.append(f"{stem} (語幹)")
            for suff in suffixes:
                cand = stem + suff
                if cand in tok_set:
                    matched_sources.add(s)
                    found_tokens.append(f"{cand} (活用形)")
    
    # Also check noun cases/plural for non-verbs
    if len(word) >= 3:
        for s, tok_set in all_tokens_by_source.items():
            for suff in ['ын', 'ийн', 'ы', 'ий', 'д', 'т', 'аас', 'ээс', 'оос', 'өөс', 'аар', 'ээр', 'оор', 'өөр', 'тай', 'тэй', 'той', 'ууд', 'үүд', 'чууд', 'чүүд']:
                cand = word + suff
                if cand in tok_set:
                    matched_sources.add(s)
                    found_tokens.append(f"{cand} (格変化/複数)")
                # Drop ending vowel then add suffix (e.g. сургууль -> сургуулийн)
                cand2 = word[:-1] + suff
                if cand2 in tok_set:
                    matched_sources.add(s)
                    found_tokens.append(f"{cand2} (格変化)")
    
    if matched_sources:
        promoted.append({
            'id': wid,
            'word': word,
            'japanese': item['japanese'],
            'sources': list(matched_sources),
            'found_samples': list(set(found_tokens))[:3]
        })

print(f"Newly promoted words from 'later' to 'textbook': {len(promoted)}")
for p in promoted[:25]:
    print(f"  {p['id']}: {p['word']} ({p['japanese']}) -> {p['sources']} via {p['found_samples']}")
