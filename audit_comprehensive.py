import os
import sys
import json
import re

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

app_dir = r"C:\Users\kkaho\.gemini\antigravity\scratch\mongol-learning-app"
data_dir = os.path.join(app_dir, 'js', 'data')

issues = []

def parse_js_array(content, var_name):
    pattern = rf'export\s+const\s+{var_name}\s*=\s*(\[[\s\S]*?\]);'
    m = re.search(pattern, content)
    if not m:
        return None
    raw_json = m.group(1)
    # Remove single line comments
    raw_json = re.sub(r'//[^\n]*', '', raw_json)
    # Remove trailing commas
    raw_json = re.sub(r',\s*([\]}])', r'\1', raw_json)
    try:
        return json.loads(raw_json)
    except Exception as e:
        # try relaxed parsing
        return f"JSON parse error: {e}"

# 1. initialVocabulary
with open(os.path.join(data_dir, 'initialVocabulary.js'), 'r', encoding='utf-8') as f:
    vocab = parse_js_array(f.read(), 'initialVocabulary')
if isinstance(vocab, list):
    print(f"[OK] initialVocabulary: {len(vocab)} items")
    for v in vocab:
        if not v.get('mongolian'): issues.append(f"Empty mongolian in {v.get('id')}")
        if not v.get('japanese'): issues.append(f"Empty japanese in {v.get('id')}")
else:
    issues.append(f"initialVocabulary failed: {vocab}")

# 2. declensionQuizzes
with open(os.path.join(data_dir, 'declensionQuizzes.js'), 'r', encoding='utf-8') as f:
    decl = parse_js_array(f.read(), 'initialDeclensionQuizzes')
if isinstance(decl, list):
    print(f"[OK] initialDeclensionQuizzes: {len(decl)} items")
    for q in decl:
        if not q.get('question'): issues.append(f"Declension {q.get('id')} empty question")
        if not q.get('answer'): issues.append(f"Declension {q.get('id')} empty answer")
        if q.get('options') and q.get('answer') not in q.get('options'):
            issues.append(f"Declension {q.get('id')} answer '{q.get('answer')}' not in options")
else:
    issues.append(f"declensionQuizzes failed: {decl}")

# 3. grammarQuizzes
with open(os.path.join(data_dir, 'grammarQuizzes.js'), 'r', encoding='utf-8') as f:
    gram = parse_js_array(f.read(), 'initialGrammarQuizzes')
if isinstance(gram, list):
    print(f"[OK] initialGrammarQuizzes: {len(gram)} items")
    for q in gram:
        if not q.get('question'): issues.append(f"Grammar {q.get('id')} empty question")
        if not q.get('answer'): issues.append(f"Grammar {q.get('id')} empty answer")
        if q.get('options') and q.get('answer') not in q.get('options'):
            issues.append(f"Grammar {q.get('id')} answer '{q.get('answer')}' not in options")
else:
    issues.append(f"grammarQuizzes failed: {gram}")

# 4. listeningQuizzes
with open(os.path.join(data_dir, 'listeningQuizzes.js'), 'r', encoding='utf-8') as f:
    list_q = parse_js_array(f.read(), 'initialListeningQuizzes')
if isinstance(list_q, list):
    print(f"[OK] initialListeningQuizzes: {len(list_q)} items")
    for q in list_q:
        if not q.get('audioText'): issues.append(f"Listening {q.get('id')} empty audioText")
        if not q.get('answer'): issues.append(f"Listening {q.get('id')} empty answer")
        if q.get('type') == 'blank' and q.get('options'):
            if q.get('answer') not in q.get('options'):
                issues.append(f"Listening {q.get('id')} answer '{q.get('answer')}' not in options")
else:
    issues.append(f"listeningQuizzes failed: {list_q}")

# 5. readingQuizzes
with open(os.path.join(data_dir, 'readingQuizzes.js'), 'r', encoding='utf-8') as f:
    read_p = parse_js_array(f.read(), 'initialReadingQuizzes')
if isinstance(read_p, list):
    print(f"[OK] initialReadingQuizzes: {len(read_p)} items")
    for p in read_p:
        if not p.get('text'): issues.append(f"Reading {p.get('id')} empty text")
        for q in p.get('questions', []):
            if not q.get('answer'): issues.append(f"Reading {p.get('id')} empty answer")
            if q.get('options') and q.get('answer') not in q.get('options'):
                issues.append(f"Reading {p.get('id')} answer '{q.get('answer')}' not in options")
else:
    issues.append(f"readingQuizzes failed: {read_p}")

# 6. typingSentences
with open(os.path.join(data_dir, 'typingSentences.js'), 'r', encoding='utf-8') as f:
    typing_s = parse_js_array(f.read(), 'initialTypingSentences')
if isinstance(typing_s, list):
    print(f"[OK] initialTypingSentences: {len(typing_s)} items")
    for s in typing_s:
        if not s.get('textMn'): issues.append(f"Typing {s.get('id')} empty textMn")
        if not s.get('textJa'): issues.append(f"Typing {s.get('id')} empty textJa")
else:
    issues.append(f"typingSentences failed: {typing_s}")

# 7. pronunciationData
with open(os.path.join(data_dir, 'pronunciationData.js'), 'r', encoding='utf-8') as f:
    pron = parse_js_array(f.read(), 'PRONUNCIATION_ITEMS')
if isinstance(pron, list):
    print(f"[OK] PRONUNCIATION_ITEMS: {len(pron)} items")
    for p in pron:
        if not p.get('mongolian'): issues.append(f"Pronunciation {p.get('id')} empty mongolian")
        if not p.get('japanese'): issues.append(f"Pronunciation {p.get('id')} empty japanese")
else:
    issues.append(f"pronunciationData failed: {pron}")

print(f"\n==========================================")
print(f"Total data & logic issues found: {len(issues)}")
for i in issues:
    print(" - " + i)
print(f"==========================================")
