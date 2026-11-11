# -*- coding: utf-8 -*-
"""
Full canonical updater for js/data/interviewTopics.js
Ensures:
1. All 13 topics strictly use the user's verbatim Mongolian text and structure.
2. Full text and sentence breakdown are exact without omitting anything.
3. Topic 7 includes the 7 sub-questions from the examiner prompt.
4. interviewVocabulary is perfectly matched so every word has its genuine example sentence from the user's text.
"""
import json, re, sys
sys.path.insert(0, 'scripts')
from canonical_topic_data import TOPIC_DATA

# Read current file to preserve guideline, grammarPoints, speechTips
with open('js/data/interviewTopics.js', 'r', encoding='utf-8') as f:
    orig_text = f.read()

# Parse existing topics to get grammarPoints, speechTips
start = orig_text.find('export const interviewTopics = [')
end = orig_text.find('\nexport const interviewVocabulary = [')
topics_raw = orig_text[start + len('export const interviewTopics = '):end].strip()
last_bracket = topics_raw.rfind(']')
old_topics = json.loads(topics_raw[:last_bracket+1])
old_by_id = {t['id']: t for t in old_topics}

# Parse existing vocab
pos = orig_text.find('export const interviewVocabulary = [')
vocab_raw = orig_text[pos + len('export const interviewVocabulary = '):].strip()
if vocab_raw.endswith(';'):
    vocab_raw = vocab_raw[:-1].strip()
old_vocab = json.loads(vocab_raw)
old_vocab_by_word = {v['mongolian'].strip().lower(): v for v in old_vocab}

# Subquestions for topic 7 from examiner sheet
TOPIC_7_SUBQUESTIONS = [
    {"mn": "ЖАЙКА ямар байгууллага вэ?", "ja": "JICAはどんな組織ですか？"},
    {"mn": "ЖАЙКА хэдэн онд байгуулагдсан бэ?", "ja": "JICAは何年に設立されましたか？"},
    {"mn": "ЖАЙКА ямар мэргэжилтэй сайн дурын гишүүдийг гадаад руу явуулдаг вэ?", "ja": "JICAはどんな専門職のボランティアを海外へ派遣していますか？"},
    {"mn": "Та яагаад ЖАЙКА-ийн сайн дурын гишүүн болмоор байгаа вэ?", "ja": "あなたはどうしてJICA海外協力隊員になりたいのですか？"},
    {"mn": "Монголд хэдэн оноос ЖАЙКА-ийн сайн дурын гишүүд ажиллаж эхэлсэн бэ?", "ja": "モンゴルでは何年からJICAボランティアが活動し始めましたか？"},
    {"mn": "Одоо хүртэл хэд орчим сайн дурын гишүүн Монголд ажиллаж байгаа вэ?", "ja": "これまで何人くらいのボランティアがモンゴルで活動していますか？"},
    {"mn": "Та ЖАЙКА-ийн тухай юу гэж боддог вэ?", "ja": "あなたはJICAについてどう思いますか？"}
]

# Build new interviewTopics array
final_topics = []

for c_topic in TOPIC_DATA:
    tid = c_topic['id']
    old_t = old_by_id.get(tid, {})
    
    # Construct fullTextMn and fullTextJa
    if c_topic.get('category') == 'roleplay':
        full_lines_mn = [f"{s['speaker']}： {s['mn']}" for s in c_topic['sentences']]
        full_lines_ja = [f"{s['speaker']}： {s['ja']}" for s in c_topic['sentences']]
        full_text_mn = "\n".join(full_lines_mn)
        full_text_ja = " ".join([s['ja'] for s in c_topic['sentences']])
    else:
        full_text_mn = "\n".join([s['mn'] for s in c_topic['sentences']])
        full_text_ja = "".join([s['ja'] for s in c_topic['sentences']])
    
    # Topic vocabulary summary
    topic_vocab_list = []
    for s in c_topic['sentences']:
        token = s.get('clozeToken', '')
        if token and len(token) > 1:
            clean_token = re.sub(r'[\(\)（）\-\s]+', '', token)
            topic_vocab_list.append({
                "mn": clean_token,
                "ja": s.get('clozeHint', ''),
                "pos": "語彙",
                "pron": ""
            })
    
    t_obj = {
        "id": tid,
        "number": c_topic['number'],
        "category": c_topic['category'],
        "categoryLabel": c_topic['categoryLabel'],
        "icon": c_topic['icon'],
        "title": c_topic['title'],
        "titleJa": c_topic['titleJa'],
        "titleMn": c_topic['titleMn'],
        "description": c_topic['description'],
        "examinerPromptMn": c_topic['examinerPromptMn'],
        "examinerPromptJa": c_topic['examinerPromptJa'],
        "targetTimeSeconds": c_topic['targetTimeSeconds'],
        "fullTextMn": full_text_mn,
        "fullTextJa": full_text_ja,
        "sentences": c_topic['sentences'],
        "grammarPoints": old_t.get('grammarPoints', []),
        "speechTips": old_t.get('speechTips', []),
        "vocabulary": topic_vocab_list
    }
    
    if tid == "topic_07":
        t_obj["subQuestions"] = TOPIC_7_SUBQUESTIONS
        
    final_topics.append(t_obj)

print(f"Prepared {len(final_topics)} canonical topics.")

# Collect all content sentences
all_sentences = []
for t in final_topics:
    for s in t['sentences']:
        all_sentences.append({
            'topicId': t['id'],
            'mn': s['mn'],
            'ja': s['ja'],
            'speaker': s.get('speaker')
        })

# Map words to sentences
final_vocab = []
seen_words = set()

def find_sentence_for_word(w_mn, root, preferred_topic_id=None):
    w_low = w_mn.strip().lower()
    root_low = root.strip().lower() if root else ""
    
    if preferred_topic_id:
        for s in all_sentences:
            if s['topicId'] == preferred_topic_id:
                s_low = s['mn'].lower()
                if w_low in s_low or (root_low and len(root_low) >= 3 and root_low in s_low) or (w_low.endswith('х') and len(w_low) > 3 and w_low[:-1] in s_low):
                    return s
    for s in all_sentences:
        s_low = s['mn'].lower()
        if w_low in s_low or (root_low and len(root_low) >= 3 and root_low in s_low) or (w_low.endswith('х') and len(w_low) > 3 and w_low[:-1] in s_low):
            return s
    return None

for v in old_vocab:
    w = v['mongolian'].strip()
    w_key = w.lower()
    root = v.get('root', '')
    pref_topic = v.get('topicIds', [None])[0]
    
    matched_s = find_sentence_for_word(w, root, pref_topic)
    if matched_s:
        v_copy = dict(v)
        v_copy['topicIds'] = [matched_s['topicId']]
        v_copy['exampleMn'] = matched_s['mn']
        v_copy['exampleJa'] = matched_s['ja']
        final_vocab.append(v_copy)
        seen_words.add(w_key)

print(f"Matched {len(final_vocab)} existing vocab words to canonical sentences.")

NEW_WORDS_CANONICAL = [
    # Topic 7
    {
        "mongolian": "байгуулагдах", "dictForm": "байгуулагдах", "japanese": "設立される、創立される",
        "pos": "動詞", "pronunciation": "バイグーラグダハ", "root": "байгуулагд", "isVerb": True,
        "topicIds": ["topic_07"],
        "exampleMn": "ЖАЙКА нь 1974 онд байгуулагдсан урт түүхтэй байгууллага.",
        "exampleJa": "JICAは1974年に設立された長い歴史を持つ機構です。",
        "explanation": "【動詞】байгуулагдах ＝ 「設立される」。動詞 байгуулах（設立する）に受動接尾辞 -гд- が付いた受動態です。"
    },
    {
        "mongolian": "сайн дурын ажил", "dictForm": "сайн дурын ажил", "japanese": "ボランティア事業、自発的活動",
        "pos": "名詞", "pronunciation": "サイン ドルィン アジル", "root": "сайн дур", "isVerb": False,
        "topicIds": ["topic_07"],
        "exampleMn": "Cайн дурын ажил 1965 онд эхэлсэн. 12-р сард  5 сайн дурын гишүүн Лаос руу явсан. Одоо сайн дурын гишүүн 74 улсад ажиллаж байна.",
        "exampleJa": "ボランティア事業は1965年に始まりました。12月に5名の青年海外協力隊員がラオスへ赴きました。現在ボランティア隊員は74カ国で活動しています。",
        "explanation": "【名詞】сайн дурын ажил ＝ 「ボランティア事業」。сайн дур（善意、自発的意志）の属格＋ажил（仕事）。"
    },
    {
        "mongolian": "Лаос", "dictForm": "Лаос", "japanese": "ラオス（国名）",
        "pos": "名詞", "pronunciation": "ラオス", "root": "Лаос", "isVerb": False,
        "topicIds": ["topic_07"],
        "exampleMn": "Cайн дурын ажил 1965 онд эхэлсэн. 12-р сард  5 сайн дурын гишүүн Лаос руу явсан. Одоо сайн дурын гишүүн 74 улсад ажиллаж байна.",
        "exampleJa": "ボランティア事業は1965年に始まりました。12月に5名の青年海外協力隊員がラオスへ赴きました。現在ボランティア隊員は74カ国で活動しています。",
        "explanation": "【固有名詞】1965年12月、日本の青年海外協力隊が最初に派遣された東南アジアの国です。"
    },
    {
        "mongolian": "орчим", "dictForm": "орчим", "japanese": "約、およそ、〜前後",
        "pos": "後置詞", "pronunciation": "オルチム", "root": "орчим", "isVerb": False,
        "topicIds": ["topic_07"],
        "exampleMn": "Монгол улсад ЖАЙКА-ийн сайн дурын гишүүд 1992 оны дөрөвдүгээр сараас эхлэн анх ирж ажилласан түүхтэй. Монгол Улсад одоо хүртэл 600 орчим ЖАЙКА-ийн сайн дурын гишүүн очсон. Одоо ч 21 сайн дурын гишүүн ажиллаж байна.",
        "exampleJa": "モンゴル国には1992年4月からJICAボランティア隊員が初めて派遣され活動を始めた歴史があります。モンゴル国にはこれまで約600名のJICA隊員が赴任しました。現在も21名の隊員が活動しています。",
        "explanation": "【後置詞】数詞の後ろに付いて「約〜、〜前後」を表します（例：600 орчим ＝ 約600人）。"
    },
    {
        "mongolian": "ахлах сургууль", "dictForm": "ахлах сургууль", "japanese": "高等学校、高校",
        "pos": "名詞", "pronunciation": "アフラク スルグーリ", "root": "ахлах", "isVerb": False,
        "topicIds": ["topic_07"],
        "exampleMn": "Миний ахлах сургуулийн багш өмнө нь ЖАЙКА-ийн сайн дурын гишүүн байсан.Тэр надад олон сонирхолтой юмны тухай ярьж өгсөн. Би тэр яриаг сонирхоод, сайн дурын гишүүн болъё гэж бодсон.",
        "exampleJa": "私の高校の先生はかつてJICA海外協力隊員でした。その先生が私にたくさんの興味深いお話をしてくれました。私はその話に関心を持ち、ボランティア隊員になろうと決意しました。",
        "explanation": "【名詞】高等学校（高校）。ахлах（年上の、上級の）＋сургууль（学校）。"
    },
    {
        "mongolian": "яриа", "dictForm": "яриа", "japanese": "話、お話、会話",
        "pos": "名詞", "pronunciation": "ヤリャー", "root": "ярь", "isVerb": False,
        "topicIds": ["topic_07"],
        "exampleMn": "Миний ахлах сургуулийн багш өмнө нь ЖАЙКА-ийн сайн дурын гишүүн байсан.Тэр надад олон сонирхолтой юмны тухай ярьж өгсөн. Би тэр яриаг сонирхоод, сайн дурын гишүүн болъё гэж бодсон.",
        "exampleJa": "私の高校の先生はかつてJICA海外協力隊員でした。その先生が私にたくさんの興味深いお話をしてくれました。私はその話に関心を持ち、ボランティア隊員になろうと決意しました。",
        "explanation": "【名詞】話、語り、会話。動詞 ярих（話す）の名詞形です。"
    },
    {
        "mongolian": "болох", "dictForm": "болох", "japanese": "〜になる、成る、できる",
        "pos": "動詞", "pronunciation": "ボロホ", "root": "бол", "isVerb": True,
        "topicIds": ["topic_07"],
        "exampleMn": "Миний ахлах сургуулийн багш өмнө нь ЖАЙКА-ийн сайн дурын гишүүн байсан.Тэр надад олон сонирхолтой юмны тухай ярьж өгсөн. Би тэр яриаг сонирхоод, сайн дурын гишүүн болъё гэж бодсон.",
        "exampleJa": "私の高校の先生はかつてJICA海外協力隊員でした。その先生が私にたくさんの興味深いお話をしてくれました。私はその話に関心を持ち、ボランティア隊員になろうと決意しました。",
        "explanation": "【動詞】「〜になる」。意志形「болъё」（〜になろう）の形で決意を述べるときに使われます。"
    },
    {
        "mongolian": "сонсох", "dictForm": "сонсох", "japanese": "聞く、耳にする",
        "pos": "動詞", "pronunciation": "ソンソホ", "root": "сонс", "isVerb": True,
        "topicIds": ["topic_07"],
        "exampleMn": "Би шинэ улсын соёл сурах дуртай. Монгол хүмүүстэй хамт амьдарч, тэднээс олон юмны тухай сонсмоор байна.",
        "exampleJa": "私は新しい国の文化を学ぶのが好きです。モンゴルの人々と共に暮らし、彼らからたくさんのことを聞きたいです。",
        "explanation": "【動詞】聞く。願望形「сонсмоор байна」（聞きたい）の形で話を聞いて学びたい気持ちを表します。"
    },
    {
        "mongolian": "нотолгоо", "dictForm": "нотолгоо", "japanese": "証拠、証明、あかし",
        "pos": "名詞", "pronunciation": "ノトルゴー", "root": "нотол", "isVerb": False,
        "topicIds": ["topic_07"],
        "exampleMn": "Үүний нотолгоо нь Зүүн Японд том газар хөдлөлт болоход олон улсны хүмүүс ЖАЙКАд “Дандаа маш их баярлалаа, Хичээгээрэй” гэсэн захидал илгээсэн гэж сонссон.",
        "exampleJa": "その証拠に、東日本大震災が起きた際、世界各国の多くの人々からJICAに『いつも本当にありがとう、頑張って』という手紙が寄せられたと聞きました。",
        "explanation": "【名詞】「証拠、証明」。「Үүний нотолгоо нь」（その証拠には）はスピーチで具体例を導入する洗練された表現です。"
    },
    {
        "mongolian": "газар хөдлөлт", "dictForm": "газар хөдлөлт", "japanese": "地震",
        "pos": "名詞", "pronunciation": "ガザル フドロルト", "root": "хөдлөх", "isVerb": False,
        "topicIds": ["topic_07"],
        "exampleMn": "Үүний нотолгоо нь Зүүн Японд том газар хөдлөлт болоход олон улсны хүмүүс ЖАЙКАд “Дандаа маш их баярлалаа, Хичээгээрэй” гэсэн захидал илгээсэн гэж сонссон.",
        "exampleJa": "その証拠に、東日本大震災が起きた際、世界各国の多くの人々からJICAに『いつも本当にありがとう、頑張って』という手紙が寄せられたと聞きました。",
        "explanation": "【名詞】地震。газар（大地）＋хөдлөлт（揺れ、動き）。Зүүн Японд том газар хөдлөлт で東日本大震災を指します。"
    },
    {
        "mongolian": "захидал", "dictForm": "захидал", "japanese": "手紙、書簡",
        "pos": "名詞", "pronunciation": "ザヒダル", "root": "захи", "isVerb": False,
        "topicIds": ["topic_07"],
        "exampleMn": "Үүний нотолгоо нь Зүүн Японд том газар хөдлөлт болоход олон улсны хүмүүс ЖАЙКАд “Дандаа маш их баярлалаа, Хичээгээрэй” гэсэн захидал илгээсэн гэж сонссон.",
        "exampleJa": "その証拠に、東日本大震災が起きた際、世界各国の多くの人々からJICAに『いつも本当にありがとう、頑張って』という手紙が寄せられたと聞きました。",
        "explanation": "【名詞】手紙。захидал илгээх で手紙を送る・寄せる。"
    },
    {
        "mongolian": "илгээх", "dictForm": "илгээх", "japanese": "送る、送付する、発送する",
        "pos": "動詞", "pronunciation": "イルゲーヘ", "root": "илгээ", "isVerb": True,
        "topicIds": ["topic_07"],
        "exampleMn": "Үүний нотолгоо нь Зүүн Японд том газар хөдлөлт болоход олон улсны хүмүүс ЖАЙКАд “Дандаа маш их баярлалаа, Хичээгээрэй” гэсэн захидал илгээсэн гэж сонссон.",
        "exampleJa": "その証拠に、東日本大震災が起きた際、世界各国の多くの人々からJICAに『いつも本当にありがとう、頑張って』という手紙が寄せられたと聞きました。",
        "explanation": "【動詞】送る、発送する。過去形は илгээсэн。"
    },
    {
        "mongolian": "чухал", "dictForm": "чухал", "japanese": "重要な、大切な",
        "pos": "形容詞", "pronunciation": "チョハル", "root": "чухал", "isVerb": False,
        "topicIds": ["topic_07"],
        "exampleMn": "Миний бодлоор ЖАЙКА нь Японы олон улсын хамтын ажиллагаанд маш чухал байгууллага юм.",
        "exampleJa": "私の考えでは、JICAは日本の国際協力において極めて重要な機構です。",
        "explanation": "【形容詞】重要な、肝心な。「маш чухал」で極めて重要。"
    },

    # Topic 8
    {
        "mongolian": "градус", "dictForm": "градус", "japanese": "度（温度・体温の単位）",
        "pos": "名詞", "pronunciation": "グラドゥス", "root": "градус", "isVerb": False,
        "topicIds": ["topic_08"],
        "exampleMn": "Тийм ээ, өглөө халуунаа үзэхэд, 38 градус  байсан.",
        "exampleJa": "はい、今朝熱を測ったら38度ありました。",
        "explanation": "【名詞】温度・角度の単位（ロシア語借用語）。38 градус で38度。"
    },
    {
        "mongolian": "нээх", "dictForm": "нээх", "japanese": "開ける、開く",
        "pos": "動詞", "pronunciation": "ネーヘ", "root": "нээ", "isVerb": True,
        "topicIds": ["topic_08"],
        "exampleMn": "Ойлголоо. За, амаа том нээгээрэй. Хоолой чинь жаахан улаан гэж бодож байна.",
        "exampleJa": "分かりました。はい、お口を大きく開けてください。喉が少し赤くなっているようですね。",
        "explanation": "【動詞】開ける。「амаа том нээгээрэй」でお口を大きく開けてください。"
    },
    {
        "mongolian": "улаан", "dictForm": "улаан", "japanese": "赤い、赤色の",
        "pos": "形容詞", "pronunciation": "ウラーン", "root": "улаан", "isVerb": False,
        "topicIds": ["topic_08"],
        "exampleMn": "Ойлголоо. За, амаа том нээгээрэй. Хоолой чинь жаахан улаан гэж бодож байна.",
        "exampleJa": "分かりました。はい、お口を大きく開けてください。喉が少し赤くなっているようですね。",
        "explanation": "【形容詞】赤色。「жаахан улаан」で少し赤い（喉の炎症）。"
    },
    {
        "mongolian": "амрах", "dictForm": "амрах", "japanese": "休む、休養する",
        "pos": "動詞", "pronunciation": "アムラホ", "root": "амар", "isVerb": True,
        "topicIds": ["topic_08"],
        "exampleMn": "Энэ эмийг хоолны дараа өдөрт гурван удаа усаар уугаарай. Сайн амраарай.",
        "exampleJa": "この薬を食後に1日3回、お水で飲んでください。お大事に、しっかり休んでくださいね。",
        "explanation": "【動詞】休む。「Сайн амраарай」でお大事に（しっかり休んでください）。"
    },

    # Topic 9
    {
        "mongolian": "өндөг", "dictForm": "өндөг", "japanese": "卵、たまご",
        "pos": "名詞", "pronunciation": "オンドグ", "root": "өндөг", "isVerb": False,
        "topicIds": ["topic_09"],
        "exampleMn": "Тийм ээ, байна. Өндөг авах уу?",
        "exampleJa": "はい、あります。卵を買われますか？",
        "explanation": "【名詞】卵。"
    },
    {
        "mongolian": "ногоо", "dictForm": "ногоо", "japanese": "野菜",
        "pos": "名詞", "pronunciation": "ノゴー", "root": "ногоо", "isVerb": False,
        "topicIds": ["topic_09"],
        "exampleMn": "Тийм ээ, байна. Та ямар ногоо авах вэ?",
        "exampleJa": "はい、あります。どんな野菜をお求めですか？",
        "explanation": "【名詞】野菜。"
    },
    {
        "mongolian": "улаан лооль", "dictForm": "улаан лооль", "japanese": "トマト",
        "pos": "名詞", "pronunciation": "ウラーン ローリ", "root": "лооль", "isVerb": False,
        "topicIds": ["topic_09"],
        "exampleMn": "Жижиг улаан лооль байна уу?",
        "exampleJa": "プチトマト（ミニトマト）はありますか？",
        "explanation": "【名詞】トマト。жижиг улаан лооль でミニトマト。"
    },
    {
        "mongolian": "ширхэг", "dictForm": "ширхэг", "japanese": "個、つ（助数詞）",
        "pos": "名詞", "pronunciation": "シルヘグ", "root": "ширхэг", "isVerb": False,
        "topicIds": ["topic_09"],
        "exampleMn": "За, нэг ширхэг  авъя.",
        "exampleJa": "では、1つください。",
        "explanation": "【助数詞・名詞】個、ピース。「нэг ширхэг」で1個。"
    },
    {
        "mongolian": "төгрөг", "dictForm": "төгрөг", "japanese": "トゥグルグ（通貨単位）",
        "pos": "名詞", "pronunciation": "トグログ", "root": "төгрөг", "isVerb": False,
        "topicIds": ["topic_09"],
        "exampleMn": "Тийм ээ, байна. Нэг сүү 3,000 төгрөг.",
        "exampleJa": "はい、あります。牛乳1パック3,000トゥグルグです。",
        "explanation": "【名詞】モンゴル国の法定通貨単位。"
    },
    {
        "mongolian": "нийт", "dictForm": "нийт", "japanese": "合計、全部で、全体",
        "pos": "名詞", "pronunciation": "ニート", "root": "нийт", "isVerb": False,
        "topicIds": ["topic_09"],
        "exampleMn": "Үгүй, баярлалаа. Нийт хэдэн төгрөг вэ?",
        "exampleJa": "いいえ、結構です。合計でいくらですか？",
        "explanation": "【名詞・副詞】合計、総計。「Нийт хэдэн төгрөг вэ?」で合計いくらですか。"
    },
    {
        "mongolian": "бололгүй яах вэ", "dictForm": "бололгүй яах вэ", "japanese": "もちろんですとも、構いませんとも",
        "pos": "慣用句", "pronunciation": "ボロルグイ ヤーハ ウェ", "root": "болох", "isVerb": False,
        "topicIds": ["topic_09"],
        "exampleMn": "Бололгүй яах вэ. Картаар төлж болно.",
        "exampleJa": "もちろんですとも。カードでお支払いいただけます。",
        "explanation": "【慣用表現】「当然ですよ」「もちろん可能ですとも」という強い快諾表現。"
    },
    {
        "mongolian": "дахин", "dictForm": "дахин", "japanese": "再び、また",
        "pos": "副詞", "pronunciation": "ダヒン", "root": "дахин", "isVerb": False,
        "topicIds": ["topic_09"],
        "exampleMn": "За, баярлалаа. Дахин ирээрэй!",
        "exampleJa": "はい、ありがとうございました。またお越しください！",
        "explanation": "【副詞】再び、また。「Дахин ирээрэй」でまた来てください。"
    },

    # Topic 10
    {
        "mongolian": "хэрэгтэй", "dictForm": "хэрэгтэй", "japanese": "必要である、要る",
        "pos": "形容詞", "pronunciation": "ヘレグテイ", "root": "хэрэг", "isVerb": False,
        "topicIds": ["topic_10"],
        "exampleMn": "Сайн байна уу? Танд ямар эм хэрэгтэй вэ?",
        "exampleJa": "いらっしゃいませ。どのようなお薬が必要ですか？",
        "explanation": "【形容詞】必要である。「Танд юу/ямар эм хэрэгтэй вэ?」でお薬は何が必要ですか。"
    },
    {
        "mongolian": "хурдан эдгээрэй", "dictForm": "хурдан эдгээрэй", "japanese": "お大事に、早く良くなってください",
        "pos": "挨拶", "pronunciation": "フルダン エドゲーレイ", "root": "эдгэр", "isVerb": False,
        "topicIds": ["topic_10"],
        "exampleMn": "Баярлалаа. Хурдан эдгээрэй!",
        "exampleJa": "ありがとうございます。お大事に、早く良くなってくださいね！",
        "explanation": "【挨拶】薬局や病院で別れ際に使われる定番の温かい励まし挨拶です。"
    },

    # Topic 11
    {
        "mongolian": "зочид буудлын ажилтан", "dictForm": "зочид буудлын ажилтан", "japanese": "ホテルの従業員、フロント係",
        "pos": "名詞", "pronunciation": "ゾチド ブードリン アジルタン", "root": "ажилтан", "isVerb": False,
        "topicIds": ["topic_11"],
        "exampleMn": "Сайн байна уу? Танд юу хэрэгтэй вэ?",
        "exampleJa": "いらっしゃいませ。ご用件をお伺いします。",
        "explanation": "【名詞】ホテルの従業員・受付係。"
    },
    {
        "mongolian": "хонох", "dictForm": "хонох", "japanese": "宿泊する、泊まる、夜を明かす",
        "pos": "動詞", "pronunciation": "ホノホ", "root": "хон", "isVerb": True,
        "topicIds": ["topic_11"],
        "exampleMn": "Сайн байна уу? Би нэг хономоор байна. Нэг ортой өрөө байна уу?",
        "exampleJa": "こんにちは。1泊したいのですが。シングルの部屋はありますか？",
        "explanation": "【動詞】宿泊する。「хономоор байна」で泊まりたい。"
    },
    {
        "mongolian": "нэг ортой өрөө", "dictForm": "нэг ортой өрөө", "japanese": "シングルベッドの部屋、シングルルーム",
        "pos": "名詞", "pronunciation": "ネグ オルトイ オロー", "root": "өрөө", "isVerb": False,
        "topicIds": ["topic_11"],
        "exampleMn": "Сайн байна уу? Би нэг хономоор байна. Нэг ортой өрөө байна уу?",
        "exampleJa": "こんにちは。1泊したいのですが。シングルの部屋はありますか？",
        "explanation": "【名詞】シングルルーム。ор（ベッド）＋-той（〜のある）＋өрөө（部屋）。"
    },
    {
        "mongolian": "хоног", "dictForm": "хоног", "japanese": "泊、一昼夜（24時間）",
        "pos": "名詞", "pronunciation": "ホノグ", "root": "хоног", "isVerb": False,
        "topicIds": ["topic_11"],
        "exampleMn": "За, баярлалаа. Нэг хоног нь хэдэн төгрөг вэ?",
        "exampleJa": "ありがとうございます。1泊いくらですか？",
        "explanation": "【名詞】一昼夜、1日（24時間）。「Нэг хоног нь」で1泊は。"
    },
    {
        "mongolian": "үнэгүй", "dictForm": "үнэгүй", "japanese": "無料の、タダの",
        "pos": "形容詞", "pronunciation": "ウネグイ", "root": "үнэ", "isVerb": False,
        "topicIds": ["topic_11"],
        "exampleMn": "Тийм ээ, өглөөний цай үнэгүй.",
        "exampleJa": "はい、朝食は無料です。",
        "explanation": "【形容詞】無料の。үнэ（価格）＋-гүй（〜のない）。"
    },
    {
        "mongolian": "түр", "dictForm": "түр", "japanese": "少々、しばらく、少しの間",
        "pos": "副詞", "pronunciation": "トゥル", "root": "түр", "isVerb": False,
        "topicIds": ["topic_11"],
        "exampleMn": "Уучлаарай, одоо өрөө бэлэн биш байна. Та түр хүлээгээрэй.",
        "exampleJa": "申し訳ありません、現在お部屋の準備ができておりません。少々お待ちください。",
        "explanation": "【副詞】少々、しばらく。「түр хүлээгээрэй」で少々お待ちください。"
    },
    {
        "mongolian": "асуудалгүй", "dictForm": "асуудалгүй", "japanese": "問題ありません、大丈夫です",
        "pos": "形容詞", "pronunciation": "アスーダルグイ", "root": "асуудал", "isVerb": False,
        "topicIds": ["topic_11"],
        "exampleMn": "За, асуудалгүй. Би картаар төлж болох уу?",
        "exampleJa": "はい、問題ありません。カードで支払えますか？",
        "explanation": "【形容詞】問題ない。асуудал（問題）＋-гүй（〜のない）。"
    },
    {
        "mongolian": "түлхүүр", "dictForm": "түлхүүр", "japanese": "鍵、キー",
        "pos": "名詞", "pronunciation": "トゥルフーる", "root": "түлхүүр", "isVerb": False,
        "topicIds": ["topic_11"],
        "exampleMn": "Баярлалаа. Энэ таны өрөөний түлхүүр. Таны өрөө 110-р өрөө. Сайхан амраарай",
        "exampleJa": "ありがとうございます。こちらがお部屋の鍵です。お部屋は110号室です。ごゆっくりお過ごしください。",
        "explanation": "【名詞】鍵。「өрөөний түлхүүр」で部屋の鍵。"
    },

    # Topic 12
    {
        "mongolian": "хэдүүлээ", "dictForm": "хэдүүлээ", "japanese": "何名様、何人で",
        "pos": "代名詞", "pronunciation": "ヘドゥーレー", "root": "хэд", "isVerb": False,
        "topicIds": ["topic_12"],
        "exampleMn": "Сайн байна уу? Хэдүүлээ вэ?",
        "exampleJa": "いらっしゃいませ。何名様ですか？",
        "explanation": "【集合数詞・疑問代名詞】「何名様ですか」という飲食店での定番の入店確認。"
    },
    {
        "mongolian": "ширээ", "dictForm": "ширээ", "japanese": "テーブル、机",
        "pos": "名詞", "pronunciation": "シレー", "root": "ширээ", "isVerb": False,
        "topicIds": ["topic_12"],
        "exampleMn": "За, энэ ширээнд суугаарай.",
        "exampleJa": "では、こちらのテーブルへお掛けください。",
        "explanation": "【名詞】テーブル。「энэ ширээнд суугаарай」でこちらの席にお掛けください。"
    },
    {
        "mongolian": "хоолны цэс", "dictForm": "хоолны цэс", "japanese": "メニュー、献立表",
        "pos": "名詞", "pronunciation": "ホールニ ツェス", "root": "цэс", "isVerb": False,
        "topicIds": ["topic_12"],
        "exampleMn": "Баярлалаа. Хоолны цэс авч болох уу?",
        "exampleJa": "ありがとうございます。メニューをいただけますか？",
        "explanation": "【名詞】メニュー。хоолны（料理の）＋цэс（リスト、目録）。"
    },
    {
        "mongolian": "хуушуур", "dictForm": "хуушуур", "japanese": "ホーショール（揚げ肉パイ）",
        "pos": "名詞", "pronunciation": "ホーショール", "root": "хуушуур", "isVerb": False,
        "topicIds": ["topic_12"],
        "exampleMn": "Манай бууз, хуушуур, нэртэй байдаг.",
        "exampleJa": "当店のボーズやホーショールが有名でございます。",
        "explanation": "【名詞】薄い小麦粉生地にひき肉を包んで平らに揚げ焼きにしたモンゴル代表料理。"
    },
    {
        "mongolian": "салат", "dictForm": "салат", "japanese": "サラダ",
        "pos": "名詞", "pronunciation": "サラト", "root": "салат", "isVerb": False,
        "topicIds": ["topic_12"],
        "exampleMn": "За. Та салат ч бас идэх үү?",
        "exampleJa": "かしこまりました。サラダも召し上がりますか？",
        "explanation": "【名詞】サラダ。Өндөгний салат で卵サラダ。"
    },
    {
        "mongolian": "сүүтэй цай", "dictForm": "сүүтэй цай", "japanese": "スーテイチャイ（伝統ミルクティー）",
        "pos": "名詞", "pronunciation": "スーテイ ツァイ", "root": "цай", "isVerb": False,
        "topicIds": ["topic_12"],
        "exampleMn": "Сүүтэй цай уумаар байна. Нэг сүүтэй цай авъя.",
        "exampleJa": "スーテイチャイ（ミルクティー）が飲みたいです。ミルクティーを1杯ください。",
        "explanation": "【名詞】モンゴルの伝統的な塩入りミルクティー。"
    },
    {
        "mongolian": "хооллох", "dictForm": "хооллох", "japanese": "食事をする、召し上がる",
        "pos": "動詞", "pronunciation": "ホールロホ", "root": "хоол", "isVerb": True,
        "topicIds": ["topic_12"],
        "exampleMn": "Таны хоол бэлэн боллоо. Сайхан хооллоорой!",
        "exampleJa": "お料理をお持ちしました（ご用意できました）。どうぞ美味しくお召し上がりください！",
        "explanation": "【動詞】食事する。「Сайхан хооллоорой!」で美味しく召し上がれ。"
    },
    {
        "mongolian": "дахиад", "dictForm": "дахиад", "japanese": "もう一度、さらに、おかわり",
        "pos": "副詞", "pronunciation": "ダヒアード", "root": "дахин", "isVerb": False,
        "topicIds": ["topic_12"],
        "exampleMn": "баяртай байна. Дахиад цай авах уу?",
        "exampleJa": "お気に召して嬉しいです。お茶のおかわりはいかがですか？",
        "explanation": "【副詞】再び、もう一つ。「Дахиад цай авах уу?」でお茶をおかわりしますか。"
    },
    {
        "mongolian": "бэлэн мөнгө", "dictForm": "бэлэн мөнгө", "japanese": "現金、キャッシュ",
        "pos": "名詞", "pronunciation": "ベレン モンゴ", "root": "мөнгө", "isVerb": False,
        "topicIds": ["topic_12"],
        "exampleMn": "Та картаар төлөх үү, бэлэн мөнгөөр төлөх үү?",
        "exampleJa": "カードでお支払いですか、現金でお支払いですか？",
        "explanation": "【名詞】現金。бэлэн（用意された）＋мөнгө（お金）。造格は бэлэн мөнгөөр（現金で）。"
    },

    # Topic 13
    {
        "mongolian": "кассчин", "dictForm": "кассчин", "japanese": "出納係、窓口係、レジ係",
        "pos": "名詞", "pronunciation": "カスチン", "root": "касс", "isVerb": False,
        "topicIds": ["topic_13"],
        "exampleMn": "Сайн байна уу? Танд яасан бэ?",
        "exampleJa": "いらっしゃいませ。どのようなご用件でしょうか？",
        "explanation": "【名詞】切符売り場の窓口係・出納係。"
    },
    {
        "mongolian": "зорчигч", "dictForm": "зорчигч", "japanese": "乗客、旅客、旅行者",
        "pos": "名詞", "pronunciation": "ゾルチグチ", "root": "зорчих", "isVerb": False,
        "topicIds": ["topic_13"],
        "exampleMn": "Сайн ,сайн байна уу? Би Чойбалсан руу явмаар байна. Тасалбар байна уу?",
        "exampleJa": "こんにちは。チョイバルサンへ行きたいのですが、切符はありますか？",
        "explanation": "【名詞】乗客。動詞 зорчих（旅する、旅行する）＋-гч（〜する人）。"
    },
    {
        "mongolian": "тасалбар", "dictForm": "тасалбар", "japanese": "切符、乗車券、チケット",
        "pos": "名詞", "pronunciation": "タサルバル", "root": "таслах", "isVerb": False,
        "topicIds": ["topic_13"],
        "exampleMn": "Сайн ,сайн байна уу? Би Чойбалсан руу явмаар байна. Тасалбар байна уу?",
        "exampleJa": "こんにちは。チョイバルサンへ行きたいのですが、切符はありますか？",
        "explanation": "【名詞】切符、チケット。動詞 таслах（切り離す）から派生。"
    },
    {
        "mongolian": "маргааш", "dictForm": "маргааш", "japanese": "明日、あす",
        "pos": "名詞", "pronunciation": "マルガーシ", "root": "маргааш", "isVerb": False,
        "topicIds": ["topic_13"],
        "exampleMn": "Би маргааш явна.",
        "exampleJa": "明日出発します。",
        "explanation": "【副詞・名詞】明日。「Би маргааш явна」で明日行きます。"
    },
    {
        "mongolian": "автобус", "dictForm": "автобус", "japanese": "バス",
        "pos": "名詞", "pronunciation": "アフトブス", "root": "автобус", "isVerb": False,
        "topicIds": ["topic_13"],
        "exampleMn": "Тийм ээ, өглөө 8:00 цагт автобус байна.",
        "exampleJa": "はい、朝8時のバスがございます。",
        "explanation": "【名詞】バス。「автобусанд суух」でバスに乗る。"
    },
    {
        "mongolian": "автобусны буудал", "dictForm": "автобусны буудал", "japanese": "バス停、バスターミナル、乗り場",
        "pos": "名詞", "pronunciation": "アフトブスニ ブーダル", "root": "буудал", "isVerb": False,
        "topicIds": ["topic_13"],
        "exampleMn": "Та автобусны буудлаас сууна.",
        "exampleJa": "バスターミナル（乗り場）からご乗車ください。",
        "explanation": "【名詞】バス停留所・バスターミナル。автобусны（バスの）＋буудал（停留所、宿）。"
    },
    {
        "mongolian": "болгоомжтой яваарай", "dictForm": "болгоомжтой яваарай", "japanese": "お気をつけて行ってらっしゃい",
        "pos": "挨拶", "pronunciation": "ボルゴームジトイ ヤヴァーライ", "root": "болгоомж", "isVerb": False,
        "topicIds": ["topic_13"],
        "exampleMn": "За, таны тасалбар. Болгоомжтой яваарай.",
        "exampleJa": "はい、こちらが切符です。お気をつけて行ってらっしゃいませ。",
        "explanation": "【挨拶】出発する相手を送り出す際の心温まる決まり文句。"
    }
]

for nw in NEW_WORDS_CANONICAL:
    w_key = nw['mongolian'].strip().lower()
    if w_key not in seen_words:
        final_vocab.append(nw)
        seen_words.add(w_key)

# Re-number all IDs cleanly: iv_001, iv_002, ...
for idx, v in enumerate(final_vocab, 1):
    v['id'] = f"iv_{idx:03d}"

print(f"Final aligned vocabulary count: {len(final_vocab)}")

# Generate JS code
topics_json_str = json.dumps(final_topics, ensure_ascii=False, indent=2)
vocab_json_str = json.dumps(final_vocab, ensure_ascii=False, indent=2)

output_code = f"""// ============================================================
// 口述試験・スピーチ特訓用 13テーマ完全マスターデータ
// 【公式課題】Сүүлийн шалгалт хүртэл бэлдэх сэдвүүд
// ============================================================

export const ORAL_EXAM_GUIDELINE = {{
  mainTitleMn: "Сүүлийн шалгалт хүртэл бэлдэх сэдвүүд",
  mainTitleJa: "最終試験までに準備するテーマ",
  instructionMn: "Дараах сэдвүүдээр бичиж, ярьж сурцгаая. 1-ээс 7 хүртэлх асуултын тухай 4 минут орчим ярих бэлтгэл хийгээрэй.",
  instructionJa: "次の内容について書いて、話す練習をしましょう。1から7までの質問について約4分間話す準備をしてください。"
}};

// 口述試験・スピーチ特訓用 13テーマ完全マスターデータ
// 1〜7: 4分スピーチ準備 ＆ 8〜13: 実践ロールプレイ対話
// 全13テーマの完全スクリプト、対訳、文区切り、穴埋め、文法解説

export const interviewTopics = {topics_json_str};

// 口頭試験に出現する全単語専用の完全単語集（ここに出てきた単語のみ）
export const interviewVocabulary = {vocab_json_str};
"""

with open('js/data/interviewTopics.js', 'w', encoding='utf-8') as f:
    f.write(output_code)

print("Updated js/data/interviewTopics.js successfully!")
