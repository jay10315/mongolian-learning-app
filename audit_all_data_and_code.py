import os
import sys
import json
import re

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

app_dir = r"C:\Users\kkaho\.gemini\antigravity\scratch\mongol-learning-app"

issues = []

# 1. Check initialVocabulary.js
vocab_path = os.path.join(app_dir, 'js', 'data', 'initialVocabulary.js')
with open(vocab_path, 'r', encoding='utf-8') as f:
    v_content = f.read()

# Extract json inside export const initialVocabulary = [...]
m = re.search(r'export const initialVocabulary\s*=\s*(\[[\s\S]*?\]);\s*$', v_content)
if m:
    try:
        vocab = json.loads(m.group(1))
        print(f"Loaded {len(vocab)} vocabulary items.")
        for idx, item in enumerate(vocab):
            vid = item.get('id', f'idx_{idx}')
            mn = item.get('mongolian', '')
            ja = item.get('japanese', '')
            if not mn:
                issues.append(f"Vocabulary item {vid} has empty mongolian")
            if not ja:
                issues.append(f"Vocabulary item {vid} has empty japanese")
            # check for undefined / null in strings
            for k, val in item.items():
                if val is None or val == 'undefined' or val == 'null':
                    issues.append(f"Vocabulary item {vid} has {k} = {val}")
    except Exception as e:
        issues.append(f"Failed to parse initialVocabulary JSON: {e}")
else:
    issues.append("Could not regex match initialVocabulary")

# 2. Check declensionQuizzes.js
decl_path = os.path.join(app_dir, 'js', 'data', 'declensionQuizzes.js')
with open(decl_path, 'r', encoding='utf-8') as f:
    d_content = f.read()
m_decl = re.search(r'export const DECLENSION_QUIZZES\s*=\s*(\[[\s\S]*?\]);\s*$', d_content)
if m_decl:
    try:
        decl = json.loads(m_decl.group(1))
        print(f"Loaded {len(decl)} declension quizzes.")
        for idx, q in enumerate(decl):
            qid = q.get('id', f'dec_{idx}')
            if not q.get('question'): issues.append(f"Declension {qid} empty question")
            if not q.get('answer'): issues.append(f"Declension {qid} empty answer")
            if not q.get('baseMeaning'): issues.append(f"Declension {qid} empty baseMeaning")
            if q.get('options'):
                if q.get('answer') not in q.get('options'):
                    issues.append(f"Declension {qid}: answer '{q.get('answer')}' not in options {q.get('options')}")
    except Exception as e:
        issues.append(f"Failed to parse declensionQuizzes JSON: {e}")

# 3. Check grammarQuizzes.js
gram_path = os.path.join(app_dir, 'js', 'data', 'grammarQuizzes.js')
with open(gram_path, 'r', encoding='utf-8') as f:
    g_content = f.read()
m_gram = re.search(r'export const GRAMMAR_QUIZZES\s*=\s*(\[[\s\S]*?\]);\s*$', g_content)
if m_gram:
    try:
        gram = json.loads(m_gram.group(1))
        print(f"Loaded {len(gram)} grammar quizzes.")
        for idx, q in enumerate(gram):
            qid = q.get('id', f'gram_{idx}')
            if not q.get('question'): issues.append(f"Grammar {qid} empty question")
            if not q.get('answer'): issues.append(f"Grammar {qid} empty answer")
            if q.get('options'):
                if q.get('answer') not in q.get('options'):
                    issues.append(f"Grammar {qid}: answer '{q.get('answer')}' not in options {q.get('options')}")
    except Exception as e:
        issues.append(f"Failed to parse grammarQuizzes JSON: {e}")

# 4. Check listeningQuizzes.js
list_path = os.path.join(app_dir, 'js', 'data', 'listeningQuizzes.js')
with open(list_path, 'r', encoding='utf-8') as f:
    l_content = f.read()
m_list = re.search(r'export const LISTENING_QUIZZES\s*=\s*(\[[\s\S]*?\]);\s*$', l_content)
if m_list:
    try:
        quizzes = json.loads(m_list.group(1))
        print(f"Loaded {len(quizzes)} listening quizzes.")
        for idx, q in enumerate(quizzes):
            qid = q.get('id', f'list_{idx}')
            if not q.get('audioText'): issues.append(f"Listening {qid} empty audioText")
            if not q.get('answer'): issues.append(f"Listening {qid} empty answer")
            if q.get('options') and q.get('type') == 'blank':
                if q.get('answer') not in q.get('options'):
                    issues.append(f"Listening {qid}: answer '{q.get('answer')}' not in options {q.get('options')}")
    except Exception as e:
        issues.append(f"Failed to parse listeningQuizzes JSON: {e}")

# 5. Check readingQuizzes.js
read_path = os.path.join(app_dir, 'js', 'data', 'readingQuizzes.js')
with open(read_path, 'r', encoding='utf-8') as f:
    r_content = f.read()
m_read = re.search(r'export const READING_PASSAGES\s*=\s*(\[[\s\S]*?\]);\s*$', r_content)
if m_read:
    try:
        passages = json.loads(m_read.group(1))
        print(f"Loaded {len(passages)} reading passages.")
        for idx, p in enumerate(passages):
            pid = p.get('id', f'read_{idx}')
            if not p.get('title'): issues.append(f"Reading {pid} empty title")
            if not p.get('text'): issues.append(f"Reading {pid} empty text")
            if not p.get('translation'): issues.append(f"Reading {pid} empty translation")
            for qidx, q in enumerate(p.get('questions', [])):
                if not q.get('question'): issues.append(f"Reading {pid} Q{qidx} empty question")
                if not q.get('answer'): issues.append(f"Reading {pid} Q{qidx} empty answer")
                if q.get('options') and q.get('answer') not in q.get('options'):
                    issues.append(f"Reading {pid} Q{qidx}: answer '{q.get('answer')}' not in options")
    except Exception as e:
        issues.append(f"Failed to parse readingQuizzes JSON: {e}")

# 6. Check typingSentences.js
type_path = os.path.join(app_dir, 'js', 'data', 'typingSentences.js')
with open(type_path, 'r', encoding='utf-8') as f:
    t_content = f.read()
m_type = re.search(r'export const OFFICIAL_TYPING_SENTENCES\s*=\s*(\[[\s\S]*?\]);\s*$', t_content)
if m_type:
    try:
        sentences = json.loads(m_type.group(1))
        print(f"Loaded {len(sentences)} typing sentences.")
        for idx, s in enumerate(sentences):
            sid = s.get('id', f'type_{idx}')
            if not s.get('textMn'): issues.append(f"Typing {sid} empty textMn")
            if not s.get('textJa'): issues.append(f"Typing {sid} empty textJa")
    except Exception as e:
        issues.append(f"Failed to parse typingSentences JSON: {e}")

print(f"\nAudit complete! Total data issues found: {len(issues)}")
for iss in issues[:30]:
    print(" - " + iss)
