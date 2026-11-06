import json

with open('items_to_fix.json', 'r', encoding='utf-8') as f:
    items = json.load(f)

print(f"Total items: {len(items)}")
# Dump all item IDs and words
with open('all_230_words.txt', 'w', encoding='utf-8') as out:
    for idx, item in enumerate(items):
        out.write(f"{idx:3d} | ID: {item['id']} | MN: {item['mongolian']} | JA: {item['japanese']}\n")

print("Saved all_230_words.txt")
