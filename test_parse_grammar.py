import sys, re, json

with open(r'C:\Users\kkaho\.gemini\antigravity\brain\9e6c0c7c-54e8-4fea-b32c-15aedb0e9c33\.user_uploaded\media_1793875013665_0e92ff67.md', 'r', encoding='utf-8') as f:
    text = f.read()

# Pattern for ## N. Title
sections = re.split(r'\n## (\d+)\.\s*([^\n]+)', text)
print(f"Matched sections parts: {len(sections)}")
# sections[0] is header
# then (num, title, body) triplets
items = []
for i in range(1, len(sections), 3):
    num = int(sections[i])
    title = sections[i+1].strip()
    body = sections[i+2]
    items.append((num, title, len(body)))

print(f"Parsed {len(items)} grammar items:")
for num, title, length in items:
    print(f"  #{num}: {title} (len: {length})")
