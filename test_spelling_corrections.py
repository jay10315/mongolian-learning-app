import json, os

app_dir = r"C:\Users\kkaho\.gemini\antigravity\scratch\mongol-learning-app"
vocab_path = os.path.join(app_dir, "js", "data", "initialVocabulary.js")

with open(vocab_path, "r", encoding="utf-8") as f:
    text = f.read()

v_json = json.loads(text[text.index('['):text.rindex(']')+1])
vocab_map = {w['id']: w for w in v_json}

# 1. Test v_2_21 (байхгүй)
v21 = vocab_map['v_2_21']
assert v21['mongolian'] == 'байхгүй', f"Expected байхгүй, got {v21['mongolian']}"
assert v21['dictForm'] == 'байхгүй', f"Expected dictForm байхгүй, got {v21['dictForm']}"
assert v21['japanese'] == 'ない、いない', f"Expected ない、いない, got {v21['japanese']}"
assert v21['pronunciation'] == 'バイフグイ', f"Expected バイフグイ, got {v21['pronunciation']}"

# 2. Test v_13_2 (болохгүй)
v13_2 = vocab_map['v_13_2']
assert v13_2['mongolian'] == 'болохгүй', f"Expected болохгүй, got {v13_2['mongolian']}"
assert v13_2['dictForm'] == 'болохгүй', f"Expected dictForm болохгүй, got {v13_2['dictForm']}"

# 3. Test v_gen_64 (болчихлоо)
v64 = vocab_map['v_gen_64']
assert v64['mongolian'] == 'болчихлоо', f"Expected болчихлоо, got {v64['mongolian']}"
assert v64['dictForm'] == 'болчихлоо', f"Expected dictForm болчихлоо, got {v64['dictForm']}"

# 4. Test v_2_20 (байна)
v20 = vocab_map['v_2_20']
assert v20['mongolian'] == 'байна', f"Expected байна, got {v20['mongolian']}"
assert v20['dictForm'] == 'байна', f"Expected dictForm байна, got {v20['dictForm']}"
assert v20['pronunciation'] == 'バイン', f"Expected pronunciation バイン, got {v20['pronunciation']}"

# 5. Test v_num_3 - v_num_10
nums = [('v_num_3', 'гурав'), ('v_num_4', 'дөрөв'), ('v_num_5', 'тав'),
        ('v_num_6', 'зургаа'), ('v_num_7', 'долоо'), ('v_num_8', 'найм'),
        ('v_num_9', 'ес'), ('v_num_10', 'арав')]
for nid, expected_m in nums:
    item = vocab_map[nid]
    assert item['mongolian'] == expected_m, f"Expected clean {expected_m}, got {item['mongolian']}"
    assert '名詞前' not in item['mongolian'], f"Japanese text still in mongolian: {item['mongolian']}"
    assert '名詞の前' in item['note'], f"Note missing info: {item['note']}"

print("All spelling and dictionary form assertions PASSED successfully!")
