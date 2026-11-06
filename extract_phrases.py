import os
import re
import json

app_dir = os.path.dirname(os.path.abspath(__file__))
unique_texts = {}

def add_phrase(text, label='', category=''):
    if not text:
        return
    # Clean text
    clean = re.sub(r'\s*[（\(].*?[）\)]\s*', ' ', text)
    clean = re.sub(r'[.,!?。、！？«»"\'\s]+', ' ', clean).strip()
    if clean and len(clean) >= 1:
        if clean not in unique_texts:
            unique_texts[clean] = {
                'text': clean,
                'raw': text,
                'label': label,
                'category': category
            }

# 1. Vocabulary
vocab_file = os.path.join(app_dir, 'js', 'data', 'initialVocabulary.js')
if os.path.exists(vocab_file):
    with open(vocab_file, 'r', encoding='utf-8') as f:
        content = f.read()
    # Extract entries
    for m in re.finditer(r'\{[^{}]*?"mongolian"\s*:\s*"([^"]+)"[^{}]*?\}', content):
        entry_str = m.group(0)
        mn = m.group(1)
        ja_m = re.search(r'"japanese"\s*:\s*"([^"]+)"', entry_str)
        ja = ja_m.group(1) if ja_m else ''
        add_phrase(mn, label=ja, category='vocab')

        ex_mn_m = re.search(r'"exampleMn"\s*:\s*"([^"]+)"', entry_str)
        ex_ja_m = re.search(r'"exampleJa"\s*:\s*"([^"]+)"', entry_str)
        if ex_mn_m:
            add_phrase(ex_mn_m.group(1), label=ex_ja_m.group(1) if ex_ja_m else '', category='example')

# 2. Declension
decl_file = os.path.join(app_dir, 'js', 'data', 'declensionQuizzes.js')
if os.path.exists(decl_file):
    with open(decl_file, 'r', encoding='utf-8') as f:
        content = f.read()
    for m in re.finditer(r'"answer"\s*:\s*"([^"]+)"', content):
        add_phrase(m.group(1), category='declension')
    for m in re.finditer(r'"baseWord"\s*:\s*"([^"]+)"', content):
        add_phrase(m.group(1), category='declension')

# 3. Listening
list_file = os.path.join(app_dir, 'js', 'data', 'listeningQuizzes.js')
if os.path.exists(list_file):
    with open(list_file, 'r', encoding='utf-8') as f:
        content = f.read()
    for m in re.finditer(r'"audioText"\s*:\s*"([^"]+)"', content):
        add_phrase(m.group(1), category='listening')
    for m in re.finditer(r'"sentence"\s*:\s*"([^"]+)"', content):
        clean_s = re.sub(r'\[.*?\]', '', m.group(1))
        add_phrase(clean_s, category='listening')

# 4. Typing
typing_file = os.path.join(app_dir, 'js', 'data', 'typingSentences.js')
if os.path.exists(typing_file):
    with open(typing_file, 'r', encoding='utf-8') as f:
        content = f.read()
    for m in re.finditer(r'"textMn"\s*:\s*"([^"]+)"', content):
        add_phrase(m.group(1), category='typing')

# 5. Reading
reading_file = os.path.join(app_dir, 'js', 'data', 'readingQuizzes.js')
if os.path.exists(reading_file):
    with open(reading_file, 'r', encoding='utf-8') as f:
        content = f.read()
    for m in re.finditer(r'"text"\s*:\s*"([^"]+)"', content):
        add_phrase(m.group(1), category='reading')

items = list(unique_texts.values())
out_path = os.path.join(app_dir, 'audio_phrases.json')
with open(out_path, 'w', encoding='utf-8') as f:
    json.dump(items, f, ensure_ascii=False, indent=2)

print(f"Total unique phrases extracted: {len(items)}")
print(f"Saved to {out_path}")
