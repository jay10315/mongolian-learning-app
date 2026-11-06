import json, re

with open(r'C:\Users\kkaho\.gemini\antigravity\scratch\mongol-learning-app\mongolian_grammar_48_corrected.md', 'r', encoding='utf-8') as f:
    text = f.read()

sections = re.split(r'\n## (\d+)\.\s*([^\n]+)', text)

out_lines = []
out_lines.append(f"=== AUDIT OF CORRECTED HANDBOOK (Total sections: {(len(sections)-1)//3}) ===")

for i in range(1, len(sections), 3):
    num = int(sections[i])
    title = sections[i+1].strip()
    body = sections[i+2]
    
    lines = body.splitlines()
    for lidx, line in enumerate(lines):
        mixed = re.findall(r'[\u0400-\u04FF]+[\u30A0-\u30FF]+[\u0400-\u04FF]*|[\u30A0-\u30FF]+[\u0400-\u04FF]+', line)
        if mixed:
            out_lines.append(f"[G{num} {title}] Line {lidx}: Mixed Cyrillic-Katakana words: {mixed}")
            
        if 'үү/үү' in line or 'үү, үү' in line:
            out_lines.append(f"[G{num} {title}] Line {lidx}: Question particle typo found: {line.strip()}")
            
        if 'человек' in line:
            out_lines.append(f"[G{num} {title}] Line {lidx}: Russian word found: {line.strip()}")
            
        if 'Цагаарай' in line:
            out_lines.append(f"[G{num} {title}] Line {lidx}: Nonsense word found: {line.strip()}")

with open(r'C:\Users\kkaho\.gemini\antigravity\scratch\mongol-learning-app\audit_output_corrected.txt', 'w', encoding='utf-8') as f:
    f.write("\n".join(out_lines) + "\n")

print(f"Audit completed with {len(out_lines)-1} issues found.")
