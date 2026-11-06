import re, json

with open(r'C:\Users\kkaho\.gemini\antigravity\brain\9e6c0c7c-54e8-4fea-b32c-15aedb0e9c33\.user_uploaded\media_1793875013665_0e92ff67.md', 'r', encoding='utf-8') as f:
    text = f.read()

sections = re.split(r'\n## (\d+)\.\s*([^\n]+)', text)

audit_report = []

for i in range(1, len(sections), 3):
    num = int(sections[i])
    title = sections[i+1].strip()
    body = sections[i+2]
    
    sec_data = {
        "num": num,
        "title": title,
        "raw_body": body
    }
    audit_report.append(sec_data)

with open(r'C:\Users\kkaho\.gemini\antigravity\scratch\mongol-learning-app\raw_grammar_sections.json', 'w', encoding='utf-8') as f:
    json.dump(audit_report, f, ensure_ascii=False, indent=2)

print(f"Dumped {len(audit_report)} sections to JSON for audit.")
