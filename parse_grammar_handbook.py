import re, json

with open(r'C:\Users\kkaho\.gemini\antigravity\scratch\mongol-learning-app\mongolian_grammar_48_corrected.md', 'r', encoding='utf-8') as f:
    text = f.read()

sections = re.split(r'\n## (\d+)\.\s*([^\n]+)', text)

grammar_items = []

for i in range(1, len(sections), 3):
    num = int(sections[i])
    title = sections[i+1].strip()
    body = sections[i+2]
    
    # 1. 意味とイメージ
    meaning = ""
    image = ""
    m_match = re.search(r'-\s*\*\*意味\*\*:\s*([^\n]+)', body)
    if m_match:
        meaning = m_match.group(1).strip()
    i_match = re.search(r'-\s*\*\*意味のイメージ\*\*:\s*([^\n]+)', body)
    if i_match:
        image = i_match.group(1).strip()
        
    # 2. 接続テーブル
    rules = {
        "verbStem": "",
        "verbDict": "",
        "nounStem": "",
        "caseRule": "",
        "endingTypes": ""
    }
    t_vstem = re.search(r'\|\s*\*\*動詞語幹につくか\*\*\s*\|\s*([^|]+)\|', body)
    if t_vstem: rules["verbStem"] = t_vstem.group(1).strip()
    t_vdict = re.search(r'\|\s*\*\*動詞辞書形につくか\*\*\s*\|\s*([^|]+)\|', body)
    if t_vdict: rules["verbDict"] = t_vdict.group(1).strip()
    t_nstem = re.search(r'\|\s*\*\*名詞語幹につくか\*\*\s*\|\s*([^|]+)\|', body)
    if t_nstem: rules["nounStem"] = t_nstem.group(1).strip()
    t_case = re.search(r'\|\s*\*\*格支配\*\*\s*\|\s*([^|]+)\|', body)
    if t_case: rules["caseRule"] = t_case.group(1).strip()
    t_end = re.search(r'\|\s*\*\*語尾の種類\*\*\s*\|\s*([^|]+)\|', body)
    if t_end: rules["endingTypes"] = t_end.group(1).strip()
    
    # 3. 語末音別の変化
    phonetics = {}
    ph_keys = [
        ('male', r'-\s*\*\*男性母音で終わる言葉\*\*:\s*([^\n]+)'),
        ('female', r'-\s*\*\*女性母音で終わる言葉\*\*:\s*([^\n]+)'),
        ('diphthong', r'-\s*\*\*二重母音で終わる言葉\*\*:\s*([^\n]+)'),
        ('longVowel', r'-\s*\*\*長母音で終わる言葉\*\*:\s*([^\n]+)'),
        ('consonants7', r'-\s*\*\*(?:7の母音的子音|м, н, л)[^\*]*\*\*:\s*([^\n]+)'),
        ('consonants9', r'-\s*\*\*(?:9の摩擦・閉鎖子音|母音およびその他の子音|в, г, р, с)[^\*]*\*\*:\s*([^\n]+)'),
        ('hiddenG', r'-\s*\*\*隠れг[^\*]*\*\*:\s*([^\n]+)'),
        ('hiddenN', r'-\s*\*\*隠れн[^\*]*\*\*:\s*([^\n]+)'),
        ('assimilation', r'-\s*\*\*同化・例外ルール\*\*:\s*([^\n]+)'),
        ('dropVowel', r'-\s*\*\*脱落母音ルール\*\*:\s*([^\n]+)')
    ]
    for key, pat in ph_keys:
        m = re.search(pat, body)
        phonetics[key] = m.group(1).strip() if m else ""
        
    # 4. 気を付けるポイント
    notes = ""
    note_m = re.search(r'>\s*\[!warning\]\s*📌[^\n]*\n((?:>\s*[^\n]*\n?)+)', body)
    if note_m:
        note_lines = [re.sub(r'^>\s*', '', l) for l in note_m.group(1).splitlines()]
        notes = " ".join([l.strip() for l in note_lines if l.strip()])
        
    # 5. 5歳児向け説明
    forKids = ""
    kids_m = re.search(r'>\s*\[!quote\]\s*👶[^\n]*\n((?:>\s*[^\n]*\n?)+)', body)
    if kids_m:
        kids_lines = [re.sub(r'^>\s*', '', l) for l in kids_m.group(1).splitlines()]
        forKids = " ".join([l.strip() for l in kids_lines if l.strip()])
        
    # 6. 例文
    examples = {
        "affirmative": {"mn": "", "ja": ""},
        "negative": {"mn": "", "ja": ""},
        "interrogative": {"mn": "", "ja": ""},
    }
    
    def parse_ex(line_pattern):
        m = re.search(line_pattern, body)
        if m:
            content = m.group(1).strip()
            sub_m = re.search(r'^(.*?)[（\(](.*?)[）\)]\s*$', content)
            if sub_m:
                return sub_m.group(1).strip(), sub_m.group(2).strip()
            return content, ""
        return "", ""

    mn_aff, ja_aff = parse_ex(r'-\s*\*\*肯定文\*\*:\s*([^\n]+)')
    mn_neg, ja_neg = parse_ex(r'-\s*\*\*否定文\*\*:\s*([^\n]+)')
    mn_q, ja_q = parse_ex(r'-\s*\*\*疑問文\*\*:\s*([^\n]+)')
    
    examples["affirmative"]["mn"] = mn_aff
    examples["affirmative"]["ja"] = ja_aff
    examples["negative"]["mn"] = mn_neg
    examples["negative"]["ja"] = ja_neg
    examples["interrogative"]["mn"] = mn_q
    examples["interrogative"]["ja"] = ja_q

    item = {
        "id": f"g_{num}",
        "num": num,
        "title": title,
        "meaning": meaning,
        "meaningImage": image,
        "rules": rules,
        "phonetics": phonetics,
        "notes": notes,
        "forKids": forKids,
        "examples": examples,
        "exampleMn": mn_aff,
        "exampleJa": ja_aff
    }
    grammar_items.append(item)

print(f"Successfully converted {len(grammar_items)} items from corrected handbook!")

# Write to js/data/initialGrammar.js
output_js = "// モンゴル語文法 全48項目 完全構造解説ハンドブック データ（校正済み完全版）\nexport const initialGrammar = " + json.dumps(grammar_items, ensure_ascii=False, indent=2) + ";\n"

with open(r'C:\Users\kkaho\.gemini\antigravity\scratch\mongol-learning-app\js\data\initialGrammar.js', 'w', encoding='utf-8') as f:
    f.write(output_js)

print("Saved to js/data/initialGrammar.js, size:", len(output_js))
