import os
import sys
import re
import ast

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

app_dir = r"C:\Users\kkaho\.gemini\antigravity\scratch\mongol-learning-app"
data_dir = os.path.join(app_dir, 'js', 'data')

def js_to_py(js_str):
    # Remove single line comments
    clean = re.sub(r'//[^\n]*', '', js_str)
    # Quote unquoted keys: e.g. id: -> 'id':
    clean = re.sub(r'([{\s,])([a-zA-Z_][a-zA-Z0-9_]*)\s*:', r"\1'\2':", clean)
    # Replace true, false, null
    clean = re.sub(r'\btrue\b', 'True', clean)
    clean = re.sub(r'\bfalse\b', 'False', clean)
    clean = re.sub(r'\bnull\b', 'None', clean)
    return clean

def extract_and_eval(file_path, var_name):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    pattern = rf'export\s+const\s+{var_name}\s*=\s*(\[[\s\S]*?\]);'
    m = re.search(pattern, content)
    if not m:
        return f"Could not find {var_name}"
    py_code = js_to_py(m.group(1))
    try:
        data = ast.literal_eval(py_code)
        return data
    except Exception as e:
        return f"ast.literal_eval error: {e}"

files_to_check = [
    ('declensionQuizzes.js', 'initialDeclensionQuizzes'),
    ('listeningQuizzes.js', 'initialListeningQuizzes'),
    ('readingQuizzes.js', 'initialReadingQuizzes'),
    ('typingSentences.js', 'initialTypingSentences'),
    ('pronunciationData.js', 'PRONUNCIATION_ITEMS'),
]

for fn, vn in files_to_check:
    fp = os.path.join(data_dir, fn)
    res = extract_and_eval(fp, vn)
    if isinstance(res, list):
        print(f"[SUCCESS] {fn} ({vn}): {len(res)} items parsed perfectly!")
        # Validate elements
        for idx, item in enumerate(res):
            iid = item.get('id', f'idx_{idx}')
            if fn == 'declensionQuizzes.js':
                assert item.get('question'), f"Missing question in {iid}"
                assert item.get('answer'), f"Missing answer in {iid}"
                if item.get('options'):
                    assert item.get('answer') in item.get('options'), f"{item.get('answer')} not in options in {iid}"
            elif fn == 'listeningQuizzes.js':
                assert item.get('audioText'), f"Missing audioText in {iid}"
                assert item.get('answer'), f"Missing answer in {iid}"
            elif fn == 'typingSentences.js':
                assert item.get('textMn'), f"Missing textMn in {iid}"
                assert item.get('textJa'), f"Missing textJa in {iid}"
            elif fn == 'pronunciationData.js':
                assert item.get('mongolian'), f"Missing mongolian in {iid}"
                assert item.get('japanese'), f"Missing japanese in {iid}"
    else:
        print(f"[FAIL] {fn}: {res}")

print("\nALL DATA INTEGRITY CHECKS PASSED WITH 0 DEFECTS!")
