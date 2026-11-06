import json

with open('items_to_fix.json', 'r', encoding='utf-8') as f:
    items = json.load(f)

for i in range(0, len(items), 60):
    chunk = items[i:i+60]
    with open(f'chunk_{i//60}.txt', 'w', encoding='utf-8') as out:
        for idx, item in enumerate(chunk):
            out.write(f"{i+idx}: {item['id']} | {item['mongolian']}\n")

print("Created chunks")
