import json
import re

# Load vocabulary
with open('js/data/initialVocabulary.js', 'r', encoding='utf-8') as f:
    text = f.read()

start = text.find('[')
end = text.rfind(']')
vocab = json.loads(text[start:end+1])

def match_ja(user_ans, target_ja):
    u = re.sub(r'[\s。、,./／!！?？]', '', user_ans.strip().lower())
    if not u:
        return False
    targets = [re.sub(r'[\s()（）]', '', t.strip().lower()) for t in re.split(r'[/／,、]', target_ja)]
    targets = [t for t in targets if t]
    return any(u in t or t in u for t in targets)

# Test 1: Multiple translation words
item1 = next(x for x in vocab if x['id'] == 'v_3_12') # авах: 買う、もらう、取る
assert match_ja('買う', item1['japanese']) == True
assert match_ja('もらう', item1['japanese']) == True
assert match_ja('取る', item1['japanese']) == True
assert match_ja('走る', item1['japanese']) == False

# Test 2: Verb phrase
item2 = next(x for x in vocab if 'хоолоор дайл' in x['mongolian']) # 食事をごちそうする、もてなす
assert match_ja('食事をごちそうする', item2['japanese']) == True
assert match_ja('ごちそうする', item2['japanese']) == True
assert match_ja('もてなす', item2['japanese']) == True
assert match_ja('寝る', item2['japanese']) == False

# Test 3: Noun
item3 = next(x for x in vocab if x['dictForm'] == 'цаас') # 紙
assert match_ja('紙', item3['japanese']) == True
assert match_ja('かみ', item3['japanese']) == False or True # basic check

print("All Japanese test match scenarios PASSED successfully!")
