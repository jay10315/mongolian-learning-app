import json, sys

with open(r'C:\Users\kkaho\.gemini\antigravity\scratch\mongol-learning-app\raw_grammar_sections.json', 'r', encoding='utf-8') as f:
    sections = json.load(f)

def write_group(start, end, filename):
    with open(filename, 'w', encoding='utf-8') as out:
        for s in sections:
            if start <= s['num'] <= end:
                out.write(f"========================================\n")
                out.write(f"ITEM {s['num']}: {s['title']}\n")
                out.write(f"========================================\n")
                out.write(s['raw_body'].strip() + "\n\n")

write_group(1, 10, r'C:\Users\kkaho\.gemini\antigravity\scratch\mongol-learning-app\group_1_10.txt')
write_group(11, 20, r'C:\Users\kkaho\.gemini\antigravity\scratch\mongol-learning-app\group_11_20.txt')
write_group(21, 30, r'C:\Users\kkaho\.gemini\antigravity\scratch\mongol-learning-app\group_21_30.txt')
write_group(31, 40, r'C:\Users\kkaho\.gemini\antigravity\scratch\mongol-learning-app\group_31_40.txt')
write_group(41, 48, r'C:\Users\kkaho\.gemini\antigravity\scratch\mongol-learning-app\group_41_48.txt')

print("Written groups 1-10, 11-20, 21-30, 31-40, 41-48")
