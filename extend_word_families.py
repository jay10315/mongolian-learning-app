import sys, os, json
sys.stdout.reconfigure(encoding='utf-8')

# Read current families
with open('js/data/wordFamiliesData.js', 'r', encoding='utf-8') as f:
    text = f.read()
start = text.find('[')
end = text.rfind(']')
families = json.loads(text[start:end+1])

additional_families = [
  {
    "familyId": "fam_uzeh",
    "lemma": "үзэх",
    "pos": "動詞",
    "meaning": "見る、観る、試す、体験する",
    "stem": "үз-",
    "vowelHarmonic": "feminine",
    "textbookAppearance": "第3課・第8課・第14課・練習問題集",
    "forms": [
      {"formId": "fam_uzeh_dict", "mongolian": "үзэх", "japanese": "見る、試す", "role": "辞書形", "ruleDesc": "語幹 үз- ＋ -эх", "exampleMn": "Кино үзэх дуртай.", "exampleJa": "映画を見るのが好きです。", "category": "dictionary", "isCore": True},
      {"formId": "fam_uzeh_past_sen", "mongolian": "үзсэн", "japanese": "見た", "role": "過去時制", "ruleDesc": "語幹 үз- ＋ -сэн", "exampleMn": "Би өчигдөр зурагт үзсэн.", "exampleJa": "私は昨日テレビを見ました。", "category": "past", "isCore": True},
      {"formId": "fam_uzeh_past_neg", "mongolian": "үзээгүй", "japanese": "見なかった、見たことがない", "role": "過去否定形", "ruleDesc": "語幹 үз- ＋ -ээгүй", "exampleMn": "Энэ киног үзээгүй.", "exampleJa": "この映画は見ていません（見たことがありません）。", "category": "negative", "isCore": True},
      {"formId": "fam_uzeh_habit", "mongolian": "үздэг", "japanese": "普段見る", "role": "習慣形", "ruleDesc": "語幹 үз- ＋ -дэг", "exampleMn": "Орой мэдээ үздэг.", "exampleJa": "夜ニュースを見ます。", "category": "present_habit", "isCore": True},
      {"formId": "fam_uzeh_prog", "mongolian": "үзэж байна", "japanese": "見ている", "role": "現在進行時制", "ruleDesc": "語幹 үз- ＋ -эж ＋ байна", "exampleMn": "Одоо жүжиг үзэж байна.", "exampleJa": "今お芝居を見ています。", "category": "progressive", "isCore": True},
      {"formId": "fam_uzeh_future", "mongolian": "үзнэ", "japanese": "見ます", "role": "未来時制", "ruleDesc": "語幹 үз- ＋ -нэ", "exampleMn": "Би маргааш кино үзнэ.", "exampleJa": "私は明日映画を見ます。", "category": "future_intent", "isCore": True},
      {"formId": "fam_uzeh_volitive", "mongolian": "үзье", "japanese": "見ましょう", "role": "希求形", "ruleDesc": "語幹 үз- ＋ ь ＋ -е", "exampleMn": "Бүгдээрээ жүжиг үзье.", "exampleJa": "みんなでお芝居を見ましょう。", "category": "future_intent", "isCore": True},
      {"formId": "fam_uzeh_polite_imp", "mongolian": "үзээрэй", "japanese": "見てください", "role": "丁寧な命令形", "ruleDesc": "語幹 үз- ＋ -ээрэй", "exampleMn": "Энэ номыг үзээрэй.", "exampleJa": "この本を見てください（ご覧ください）。", "category": "imperative", "isCore": True},
      {"formId": "fam_uzeh_desiderative", "mongolian": "үзмээр байна", "japanese": "見たい", "role": "願望形", "ruleDesc": "語幹 үз- ＋ -мээр байна", "exampleMn": "Би далай үзмээр байна.", "exampleJa": "私は海を見たいです。", "category": "future_intent", "isCore": True},
      {"formId": "fam_uzeh_causative", "mongolian": "үзүүлэх", "japanese": "見せる、提示する、診察してもらう", "role": "使役動詞形", "ruleDesc": "語幹 үз- ＋ 使役接尾辞 -үүл ＋ -эх", "exampleMn": "Паспортоо үзүүлнэ үү.", "exampleJa": "パスポートをお見せください。", "category": "causative", "isCore": True},
      {"formId": "fam_uzeh_passive", "mongolian": "үзэгдэх", "japanese": "見える、現れる", "role": "受動動詞形", "ruleDesc": "語幹 үз- ＋ -эгд ＋ -эх", "exampleMn": "Уул тод үзэгдэж байна.", "exampleJa": "山がはっきりと見えています。", "category": "passive", "isCore": True},
      {"formId": "fam_uzeh_noun_show", "mongolian": "үзэсгэлэн", "japanese": "展覧会、展示、美しいこと", "role": "派生名詞", "ruleDesc": "語根 үз- ＋ -эсгэлэн", "exampleMn": "Байгаль үзэсгэлэнтэй.", "exampleJa": "自然が美しいです。", "category": "nominal", "isCore": True}
    ]
  },
  {
    "familyId": "fam_sonsoh",
    "lemma": "сонсох",
    "pos": "動詞",
    "meaning": "聞く、耳を傾ける",
    "stem": "сонс-",
    "vowelHarmonic": "masculine",
    "textbookAppearance": "第3課・第6課・第16課・練習問題集",
    "forms": [
      {"formId": "fam_sonsoh_dict", "mongolian": "сонсох", "japanese": "聞く", "role": "辞書形", "ruleDesc": "語幹 сонс- ＋ -ох", "exampleMn": "Хөгжим сонсох дуртай.", "exampleJa": "音楽を聞くのが好きです。", "category": "dictionary", "isCore": True},
      {"formId": "fam_sonsoh_past_son", "mongolian": "сонссон", "japanese": "聞いた", "role": "過去時制", "ruleDesc": "語幹 сонс- ＋ -сон", "exampleMn": "Би монгол дуу сонссон.", "exampleJa": "私はモンゴルの歌を聞きました。", "category": "past", "isCore": True},
      {"formId": "fam_sonsoh_past_neg", "mongolian": "сонсоогүй", "japanese": "聞かなかった", "role": "過去否定形", "ruleDesc": "語幹 сонс- ＋ -оогүй", "exampleMn": "Мэдээ сонсоогүй.", "exampleJa": "ニュースを聞きませんでした。", "category": "negative", "isCore": True},
      {"formId": "fam_sonsoh_habit", "mongolian": "сонсдог", "japanese": "普段聞く", "role": "習慣形", "ruleDesc": "語幹 сонс- ＋ -дог", "exampleMn": "Өглөө бүр радио сонсдог.", "exampleJa": "毎朝ラジオを聞きます。", "category": "present_habit", "isCore": True},
      {"formId": "fam_sonsoh_prog", "mongolian": "сонсож байна", "japanese": "聞いている", "role": "現在進行時制", "ruleDesc": "語幹 сонс- ＋ -ож ＋ байна", "exampleMn": "Багшийн яриаг сонсож байна.", "exampleJa": "先生の話を聞いています。", "category": "progressive", "isCore": True},
      {"formId": "fam_sonsoh_future", "mongolian": "сонсоно", "japanese": "聞きます", "role": "未来時制", "ruleDesc": "語幹 сонс- ＋ -оно", "exampleMn": "Орой хөгжим сонсоно.", "exampleJa": "夜音楽を聞きます。", "category": "future_intent", "isCore": True},
      {"formId": "fam_sonsoh_volitive", "mongolian": "сонсъё", "japanese": "聞きましょう", "role": "希求形", "ruleDesc": "語幹 сонс- ＋ ъ ＋ -ё", "exampleMn": "Хар кофе ууж, хөгжим сонсъё.", "exampleJa": "ブラックコーヒーを飲んで、音楽を聞きましょう。", "category": "future_intent", "isCore": True},
      {"formId": "fam_sonsoh_polite_imp", "mongolian": "сонсоорой", "japanese": "聞いてください", "role": "丁寧な命令形", "ruleDesc": "語幹 сонс- ＋ -оорой", "exampleMn": "Анхааралтай сонсоорой.", "exampleJa": "注意深く聞いてください。", "category": "imperative", "isCore": True},
      {"formId": "fam_sonsoh_desiderative", "mongolian": "сонсмоор байна", "japanese": "聞きたい", "role": "願望形", "ruleDesc": "語幹 сонс- ＋ -моор байна", "exampleMn": "Монгол аялгуу сонсмоор байна.", "exampleJa": "モンゴルの調べ（メロディ）を聞きたいです。", "category": "future_intent", "isCore": True},
      {"formId": "fam_sonsoh_causative", "mongolian": "сонсгох", "japanese": "聞かせる、知らせる", "role": "使役動詞形", "ruleDesc": "語幹 сонс- ＋ -го ＋ -х", "exampleMn": "Сайхан мэдээ сонсгосон.", "exampleJa": "良い知らせを聞かせました。", "category": "causative", "isCore": True},
      {"formId": "fam_sonsoh_passive", "mongolian": "сонсогдох", "japanese": "聞こえる、耳に入る", "role": "受動動詞形", "ruleDesc": "語幹 сонс- ＋ -огд ＋ -ох", "exampleMn": "Дуу хол сонсогдож байна.", "exampleJa": "歌が遠くに聞こえています。", "category": "passive", "isCore": True},
      {"formId": "fam_sonsoh_noun_listener", "mongolian": "сонсогч", "japanese": "聴取者、リスナー", "role": "派生名詞", "ruleDesc": "語根 сонс- ＋ -огч", "exampleMn": "Радиогийн сонсогчид олон.", "exampleJa": "ラジオの聴取者は多いです。", "category": "nominal", "isCore": True}
    ]
  },
  {
    "familyId": "fam_ogoh",
    "lemma": "өгөх",
    "pos": "動詞",
    "meaning": "あげる、与える、くれる、差し上げる",
    "stem": "өг-",
    "vowelHarmonic": "feminine",
    "textbookAppearance": "第3課・第5課・第6課・練習問題集",
    "forms": [
      {"formId": "fam_ogoh_dict", "mongolian": "өгөх", "japanese": "あげる、くれる", "role": "辞書形", "ruleDesc": "語幹 өг- ＋ -өх", "exampleMn": "Найздаа бэлэг өгөх.", "exampleJa": "友達にプレゼントをあげる。", "category": "dictionary", "isCore": True},
      {"formId": "fam_ogoh_past_son", "mongolian": "өгсөн", "japanese": "あげた、くれた", "role": "過去時制", "ruleDesc": "語幹 өг- ＋ -сөн", "exampleMn": "Ээждээ цэцэг өгсөн.", "exampleJa": "母に花をあげました。", "category": "past", "isCore": True},
      {"formId": "fam_ogoh_past_neg", "mongolian": "өгөөгүй", "japanese": "あげなかった、くれなかった", "role": "過去否定形", "ruleDesc": "語幹 өг- ＋ -өөгүй", "exampleMn": "Түүнд ном өгөөгүй.", "exampleJa": "彼に本をあげませんでした。", "category": "negative", "isCore": True},
      {"formId": "fam_ogoh_habit", "mongolian": "өгдөг", "japanese": "普段あげる、くれる", "role": "習慣形", "ruleDesc": "語幹 өг- ＋ -дөг", "exampleMn": "Аав хүүдээ чихэр өгдөг.", "exampleJa": "父は息子にお菓子をあげます。", "category": "present_habit", "isCore": True},
      {"formId": "fam_ogoh_prog", "mongolian": "өгч байна", "japanese": "あげている、渡している", "role": "現在進行時制", "ruleDesc": "語幹 өг- ＋ -ч ＋ байна", "exampleMn": "Оюутан багшид дэвтрээ өгч байна.", "exampleJa": "学生は先生にノートを渡しています。", "category": "progressive", "isCore": True},
      {"formId": "fam_ogoh_future", "mongolian": "өгнө", "japanese": "あげます、くれます", "role": "未来時制", "ruleDesc": "語幹 өг- ＋ -нө", "exampleMn": "Энэ цэцгийг ээжид өгнө.", "exampleJa": "この花を母にあげます。", "category": "future_intent", "isCore": True},
      {"formId": "fam_ogoh_volitive", "mongolian": "өгье", "japanese": "あげましょう", "role": "希求形", "ruleDesc": "語幹 өг- ＋ -ье", "exampleMn": "Улаан лоолийг 13000 төгрөгөөр өгье.", "exampleJa": "トマトを13000トゥグルグでお譲りしましょう。", "category": "future_intent", "isCore": True},
      {"formId": "fam_ogoh_polite_imp", "mongolian": "өгөөрэй", "japanese": "あげてください、ください", "role": "丁寧な命令形", "ruleDesc": "語幹 өг- ＋ -өөрэй", "exampleMn": "Соруул бас өгөөрэй.", "exampleJa": "ストローもください。", "category": "imperative", "isCore": True},
      {"formId": "fam_ogoh_polite_request", "mongolian": "өгнө үү", "japanese": "〜してください、お与えください", "role": "丁寧な依頼表現", "ruleDesc": "өгнө ＋ үү（丁寧な懇願）", "exampleMn": "Надад ундаа өгнө үү.", "exampleJa": "私に飲み物をください（お願いします）。", "category": "imperative", "isCore": True},
      {"formId": "fam_ogoh_passive", "mongolian": "өгөгдөх", "japanese": "与えられる、提示される", "role": "受動動詞形", "ruleDesc": "語幹 өг- ＋ -өгд ＋ -өх", "exampleMn": "Бодлогын нөхцөл өгөгдсөн.", "exampleJa": "問題の条件が与えられました。", "category": "passive", "isCore": True},
      {"formId": "fam_ogoh_noun_data", "mongolian": "өгөгдөл", "japanese": "データ、条件、与えられた数値", "role": "派生名詞", "ruleDesc": "語根 өг- ＋ -өгдөл", "exampleMn": "Энэ дасгалын өгөгдөл байна уу?", "exampleJa": "この練習問題の条件データはありますか？", "category": "nominal", "isCore": True}
    ]
  },
  {
    "familyId": "fam_avah",
    "lemma": "авах",
    "pos": "動詞",
    "meaning": "もらう、買う、取る、引き受ける",
    "stem": "ав-",
    "vowelHarmonic": "masculine",
    "textbookAppearance": "第3課・第4課・第17課・練習問題集",
    "forms": [
      {"formId": "fam_avah_dict", "mongolian": "авах", "japanese": "もらう、買う、取る", "role": "辞書形", "ruleDesc": "語幹 ав- ＋ -ах", "exampleMn": "Өөр ногоо авах уу?", "exampleJa": "他の野菜を買いますか？", "category": "dictionary", "isCore": True},
      {"formId": "fam_avah_past_san", "mongolian": "авсан", "japanese": "もらった、買った、取った", "role": "過去時制", "ruleDesc": "語幹 ав- ＋ -сан", "exampleMn": "Би найзаас ном авсан.", "exampleJa": "私は友達から本をもらいました（買いました）。", "category": "past", "isCore": True},
      {"formId": "fam_avah_past_neg", "mongolian": "аваагүй", "japanese": "買わなかった、もらわなかった", "role": "過去否定形", "ruleDesc": "語幹 ав- ＋ -аагүй", "exampleMn": "Бид тор аваагүй.", "exampleJa": "私たちはレジ袋をもらいませんでした。", "category": "negative", "isCore": True},
      {"formId": "fam_avah_habit", "mongolian": "авдаг", "japanese": "普段買う、もらう", "role": "習慣形", "ruleDesc": "語幹 ав- ＋ -даг", "exampleMn": "Өдөр бүр шинэ талх авдаг.", "exampleJa": "毎日新しいパンを買います。", "category": "present_habit", "isCore": True},
      {"formId": "fam_avah_prog", "mongolian": "авч байна", "japanese": "買っている、受け取っている", "role": "現在進行時制", "ruleDesc": "語幹 ав- ＋ -ч ＋ байна", "exampleMn": "Тэр банкнаас мөнгө авч байна.", "exampleJa": "彼はお金を銀行から引き出しています。", "category": "progressive", "isCore": True},
      {"formId": "fam_avah_future", "mongolian": "авна", "japanese": "買います、もらいます", "role": "未来時制", "ruleDesc": "語幹 ав- ＋ -на", "exampleMn": "Би 5 бууз авна.", "exampleJa": "私はボーズを5個買います（注文します）。", "category": "future_intent", "isCore": True},
      {"formId": "fam_avah_volitive", "mongolian": "авъя", "japanese": "買いましょう、もらいましょう、ください", "role": "希求・注文形", "ruleDesc": "語幹 ав- ＋ ъ ＋ -я", "exampleMn": "Нэг тавгийг авъя.", "exampleJa": "一皿いただきます（ください）。", "category": "future_intent", "isCore": True},
      {"formId": "fam_avah_polite_imp", "mongolian": "аваарай", "japanese": "買ってください、お受け取りください", "role": "丁寧な命令形", "ruleDesc": "語幹 ав- ＋ -аарай", "exampleMn": "Шинэ улаан лооль зарж байна, аваарай.", "exampleJa": "新鮮なトマトを売っています、どうぞ買ってください。", "category": "imperative", "isCore": True},
      {"formId": "fam_avah_desiderative", "mongolian": "авмаар байна", "japanese": "買いたい、欲しい", "role": "願望形", "ruleDesc": "語幹 ав- ＋ -маар байна", "exampleMn": "Тасалбар авмаар байна.", "exampleJa": "チケットを買いたいです。", "category": "future_intent", "isCore": True},
      {"formId": "fam_avah_conditional", "mongolian": "авбал", "japanese": "買えば、もらったら", "role": "仮定形", "ruleDesc": "語幹 ав- ＋ -бал", "exampleMn": "Хэрэв төмс авбал хямдарна.", "exampleJa": "じゃがいもを買うなら安くなります。", "category": "converb", "isCore": True},
      {"formId": "fam_avah_causative_photo", "mongolian": "авхуулах", "japanese": "（写真を）撮ってもらう、取らせる", "role": "使役動詞形", "ruleDesc": "語幹 ав- ＋ -хуул ＋ -ах", "exampleMn": "Бүгдээрээ зургаа авхуулъя.", "exampleJa": "みんなで写真を撮ってもらいましょう。", "category": "causative", "isCore": True},
      {"formId": "fam_avah_compound_take_go", "mongolian": "авч явах", "japanese": "持って行く、連れて行く", "role": "複合動詞", "ruleDesc": "авч（取って）＋ явах（行く）", "exampleMn": "Шүхрээ авч яваарай.", "exampleJa": "傘を持って行ってください。", "category": "nominal", "isCore": True}
    ]
  },
  {
    "familyId": "fam_helekh",
    "lemma": "хэлэх",
    "pos": "動詞",
    "meaning": "言う、述べる、伝える",
    "stem": "хэл-",
    "vowelHarmonic": "feminine",
    "textbookAppearance": "第8課・第14課・練習問題集",
    "forms": [
      {"formId": "fam_helekh_dict", "mongolian": "хэлэх", "japanese": "言う、述べる", "role": "辞書形", "ruleDesc": "語幹 хэл- ＋ -эх", "exampleMn": "Үнэнийг хэлэх сайхан.", "exampleJa": "真実を言うのは良いことです。", "category": "dictionary", "isCore": True},
      {"formId": "fam_helekh_past_sen", "mongolian": "хэлсэн", "japanese": "言った", "role": "過去時制", "ruleDesc": "語幹 хэл- ＋ -сэн", "exampleMn": "Эмч “Сайн амраарай” гэж хэлсэн.", "exampleJa": "医師は「よく休んでください」と言いました。", "category": "past", "isCore": True},
      {"formId": "fam_helekh_habit", "mongolian": "хэлдэг", "japanese": "普段言う、呼ぶ", "role": "習慣形", "ruleDesc": "語幹 хэл- ＋ -дэг", "exampleMn": "Монголоор юу гэж хэлдэг вэ?", "exampleJa": "モンゴル語で何と言いますか？", "category": "present_habit", "isCore": True},
      {"formId": "fam_helekh_polite_imp", "mongolian": "хэлээрэй", "japanese": "言ってください", "role": "丁寧な命令形", "ruleDesc": "語幹 хэл- ＋ -ээрэй", "exampleMn": "Удаан хэлээрэй.", "exampleJa": "ゆっくり言ってください。", "category": "imperative", "isCore": True},
      {"formId": "fam_helekh_noun_language", "mongolian": "хэл", "japanese": "言語、言葉、語", "role": "基礎名詞（同根名詞）", "ruleDesc": "動詞 хэлэх の語根名詞", "exampleMn": "Монгол хэл сурч байна.", "exampleJa": "モンゴル語を学んでいます。", "category": "nominal", "isCore": True},
      {"formId": "fam_helekh_noun_phrase", "mongolian": "хэллэг", "japanese": "表現、言いまわし、語句", "role": "派生名詞", "ruleDesc": "語根 хэл- ＋ -лэг", "exampleMn": "Мэндчилгээний үг хэллэг.", "exampleJa": "挨拶の表現。", "category": "nominal", "isCore": True}
    ]
  },
  {
    "familyId": "fam_asuuh",
    "lemma": "асуух",
    "pos": "動詞",
    "meaning": "尋ねる、質問する",
    "stem": "асуу-",
    "vowelHarmonic": "masculine",
    "textbookAppearance": "第3課・第9課・練習問題集",
    "forms": [
      {"formId": "fam_asuuh_dict", "mongolian": "асуух", "japanese": "尋ねる、質問する", "role": "辞書形", "ruleDesc": "語幹 асуу- ＋ -х", "exampleMn": "Юм асуух дуртай.", "exampleJa": "質問するのが好きです。", "category": "dictionary", "isCore": True},
      {"formId": "fam_asuuh_past_san", "mongolian": "асуусан", "japanese": "尋ねた、質問した", "role": "過去時制", "ruleDesc": "語幹 асуу- ＋ -сан", "exampleMn": "Би багшаас юм асуусан.", "exampleJa": "私は先生に質問しました。", "category": "past", "isCore": True},
      {"formId": "fam_asuuh_polite_imp", "mongolian": "асуугаарай", "japanese": "質問してください、尋ねてください", "role": "丁寧な命令形", "ruleDesc": "語幹 асуу- ＋ -гаарай", "exampleMn": "Мэдэхгүй бол асуугаарай.", "exampleJa": "分からなければ尋ねてください。", "category": "imperative", "isCore": True},
      {"formId": "fam_asuuh_permission", "mongolian": "асууж болох уу", "japanese": "質問してもいいですか", "role": "許可表現", "ruleDesc": "асууж ＋ болох уу", "exampleMn": "Нэг юм асууж болох уу?", "exampleJa": "一つ質問してもいいですか？", "category": "progressive", "isCore": True},
      {"formId": "fam_asuuh_noun_question", "mongolian": "асуулт", "japanese": "質問、問題", "role": "派生名詞", "ruleDesc": "語根 асуу- ＋ -лт", "exampleMn": "Асуулт байна уу?", "exampleJa": "質問はありますか？", "category": "nominal", "isCore": True}
    ]
  },
  {
    "familyId": "fam_tsag",
    "lemma": "цаг",
    "pos": "名詞",
    "meaning": "時間、時刻、時計、〜時",
    "stem": "цаг-",
    "vowelHarmonic": "masculine",
    "textbookAppearance": "第5課・第9課・第11課・練習問題集",
    "forms": [
      {"formId": "fam_tsag_nom", "mongolian": "цаг", "japanese": "時間、時計、時刻（主格）", "role": "主格", "ruleDesc": "基本形", "exampleMn": "Одоо яг 1 цаг болж байна.", "exampleJa": "今ちょうど1時になっています。", "category": "case_nom", "isCore": True},
      {"formId": "fam_tsag_gen", "mongolian": "цагийн", "japanese": "時間の、時計の（属格）", "role": "属格", "ruleDesc": "цаг ＋ -ийн（гの後で-ийн）", "exampleMn": "18 цагийн үед оройн хоол иддэг.", "exampleJa": "18時ごろ夕食を食べます。", "category": "case_gen", "isCore": True},
      {"formId": "fam_tsag_dat", "mongolian": "цагт", "japanese": "時に、時間に（与位格）", "role": "与位格", "ruleDesc": "цаг ＋ -т（гの後で-т）", "exampleMn": "8 цагт хичээл эхэлнэ.", "exampleJa": "8時に授業が始まります。", "category": "case_dat", "isCore": True},
      {"formId": "fam_tsag_acc", "mongolian": "цагийг", "japanese": "時間を（対格）", "role": "対格", "ruleDesc": "цаг ＋ -ийг", "exampleMn": "Цагийг дэмий үрэхгүй.", "exampleJa": "時間を無駄にしません。", "category": "case_acc", "isCore": True},
      {"formId": "fam_tsag_abl", "mongolian": "цагаас", "japanese": "時から（奪格）", "role": "奪格（起点）", "ruleDesc": "цаг ＋ -аас", "exampleMn": "3 цагаас хуралтай.", "exampleJa": "3時から会議があります。", "category": "case_abl", "isCore": True},
      {"formId": "fam_tsag_com", "mongolian": "цагтай", "japanese": "時間がある（共同格）", "role": "共同格", "ruleDesc": "цаг ＋ -тай", "exampleMn": "Танд одоо ярих цагтай юу?", "exampleJa": "あなたには今話す時間がありますか？", "category": "case_com", "isCore": True},
      {"formId": "fam_tsag_weather", "mongolian": "цаг агаар", "japanese": "天気、気象", "role": "複合名詞", "ruleDesc": "цаг（時・季節）＋ агаар（大気・空気）", "exampleMn": "Өнөөдөр цаг агаар сайхан байна.", "exampleJa": "今日は天気がいいですね。", "category": "nominal", "isCore": True},
      {"formId": "fam_tsag_schedule", "mongolian": "цагийн хуваарь", "japanese": "時間割、時刻表、営業時間", "role": "名詞句", "ruleDesc": "цагийн（時間の）＋ хуваарь（割り当て）", "exampleMn": "Банкны цагийн хуваарийг харсан.", "exampleJa": "銀行の営業時間を調べました。", "category": "nominal", "isCore": True}
    ]
  },
  {
    "familyId": "fam_odor",
    "lemma": "өдөр",
    "pos": "名詞",
    "meaning": "日、昼間、日付",
    "stem": "өдөр-",
    "vowelHarmonic": "feminine",
    "textbookAppearance": "第5課・第9課・第12課・練習問題集",
    "forms": [
      {"formId": "fam_odor_nom", "mongolian": "өдөр", "japanese": "日、昼（主格）", "role": "主格", "ruleDesc": "基本形", "exampleMn": "Өнөөдөр сайхан өдөр байна.", "exampleJa": "今日は良い日ですね。", "category": "case_nom", "isCore": True},
      {"formId": "fam_odor_gen", "mongolian": "өдрийн", "japanese": "日の、昼の（属格）", "role": "属格", "ruleDesc": "өдөр ＋ -ийн", "exampleMn": "Өдрийн хоол хамт идье.", "exampleJa": "昼食を一緒に食べましょう。", "category": "case_gen", "isCore": True},
      {"formId": "fam_odor_dat", "mongolian": "өдөрт", "japanese": "日に、昼に（与位格）", "role": "与位格", "ruleDesc": "өдөр ＋ -т（рの後で-т）", "exampleMn": "Наадмын өдөр уулзацгаая.", "exampleJa": "ナーダムの日に会いましょう。", "category": "case_dat", "isCore": True},
      {"formId": "fam_odor_abl", "mongolian": "өдрөөс", "japanese": "日から（奪格）", "role": "奪格", "ruleDesc": "өдөр ＋ -өөс", "exampleMn": "Маргааш өдрөөс эхэлнэ.", "exampleJa": "明日の日中から始まります。", "category": "case_abl", "isCore": True},
      {"formId": "fam_odor_today", "mongolian": "өнөөдөр", "japanese": "今日", "role": "派生時間詞", "ruleDesc": "энэ（この）＋ өдөр（日）が融合", "exampleMn": "Өнөөдөр юу хийх вэ?", "exampleJa": "今日は何をしますか？", "category": "nominal", "isCore": True},
      {"formId": "fam_odor_yesterday", "mongolian": "өчигдөр", "japanese": "昨日", "role": "時間詞", "ruleDesc": "өчигдөр（過去の昨日）", "exampleMn": "Өчигдөр юу хийсэн бэ?", "exampleJa": "昨日は何をしましたか？", "category": "nominal", "isCore": True},
      {"formId": "fam_odor_everyday", "mongolian": "өдөр бүр", "japanese": "毎日、日々", "role": "連語表現", "ruleDesc": "өдөр（日）＋ бүр（毎〜）", "exampleMn": "Та өдөр бүр юу хийдэг вэ?", "exampleJa": "あなたは毎日何をしていますか？", "category": "nominal", "isCore": True},
      {"formId": "fam_odor_allday", "mongolian": "өдөржингөө", "japanese": "一日中、終日", "role": "派生副詞", "ruleDesc": "өдөр ＋ -жин ＋ -гээ", "exampleMn": "Өдөржингөө өрөөндөө байсан.", "exampleJa": "一日中部屋にいました。", "category": "nominal", "isCore": True}
    ]
  },
  {
    "familyId": "fam_hun",
    "lemma": "хүн",
    "pos": "名詞",
    "meaning": "人、人間",
    "stem": "хүн-",
    "vowelHarmonic": "feminine",
    "textbookAppearance": "第1課・第4課・第16課・練習問題集",
    "forms": [
      {"formId": "fam_hun_nom", "mongolian": "хүн", "japanese": "人、人間（主格）", "role": "主格", "ruleDesc": "基本形", "exampleMn": "Би япон хүн.", "exampleJa": "私は日本人です。", "category": "case_nom", "isCore": True},
      {"formId": "fam_hun_gen", "mongolian": "хүний", "japanese": "人の（属格）", "role": "属格", "ruleDesc": "хүн ＋ -ий（нで終わる語）", "exampleMn": "Монгол хүний сэтгэл уудам.", "exampleJa": "モンゴル人の心は広大です。", "category": "case_gen", "isCore": True},
      {"formId": "fam_hun_dat", "mongolian": "хүнд", "japanese": "人に（与位格）", "role": "与位格", "ruleDesc": "хүн ＋ -д", "exampleMn": "Тэр хүнд юм хэлээрэй.", "exampleJa": "あの人に言ってください。", "category": "case_dat", "isCore": True},
      {"formId": "fam_hun_acc", "mongolian": "хүнийг", "japanese": "人を（対格）", "role": "対格", "ruleDesc": "хүн ＋ -ийг", "exampleMn": "Тэр хүнийг хэн гэдэг вэ?", "exampleJa": "あの人を誰と呼びますか？", "category": "case_acc", "isCore": True},
      {"formId": "fam_hun_abl", "mongolian": "хүнээс", "japanese": "人から（奪格）", "role": "奪格", "ruleDesc": "хүн ＋ -ээс", "exampleMn": "Монгол хүнээс асуусан нь дээр.", "exampleJa": "モンゴル人に聞いた方がいいです。", "category": "case_abl", "isCore": True},
      {"formId": "fam_hun_com", "mongolian": "хүнтэй", "japanese": "人と（共同格）", "role": "共同格", "ruleDesc": "хүн ＋ -тэй", "exampleMn": "Тэр хүнтэй уулзана.", "exampleJa": "あの人と会います。", "category": "case_com", "isCore": True},
      {"formId": "fam_hun_dir", "mongolian": "хүн рүү", "japanese": "人へ、人に向かって（方向格）", "role": "方向格", "ruleDesc": "хүн ＋ 方向格助詞 рүү", "exampleMn": "Тэр хүн рүү залгаарай.", "exampleJa": "あの人へ電話をかけてください。", "category": "case_dir", "isCore": True},
      {"formId": "fam_hun_plural_humuuse", "mongolian": "хүмүүс", "japanese": "人々、人たち（複数形）", "role": "複数形", "ruleDesc": "хүн の不規則複数形 хүмүүс", "exampleMn": "Энд олон хүмүүс байна.", "exampleJa": "ここに大勢の人々がいます。", "category": "plural", "isCore": True},
      {"formId": "fam_hun_man", "mongolian": "эрэгтэй хүн", "japanese": "男の人、男性", "role": "複合名詞", "ruleDesc": "эрэгтэй（男性の）＋ хүн", "exampleMn": "Тэр эрэгтэй хүн багш.", "exampleJa": "あの男の人は先生です。", "category": "nominal", "isCore": True},
      {"formId": "fam_hun_woman", "mongolian": "эмэгтэй хүн", "japanese": "女の人、女性", "role": "複合名詞", "ruleDesc": "эмэгтэй（女性の）＋ хүн", "exampleMn": "Тэр эмэгтэй хүн эмч.", "exampleJa": "あの女の人は医師です。", "category": "nominal", "isCore": True}
    ]
  }
]

families.extend(additional_families)
print(f"Total word families now: {len(families)}")
total_forms = sum(len(f['forms']) for f in families)
print(f"Total forms across all families: {total_forms}")

with open('js/data/wordFamiliesData.js', 'w', encoding='utf-8') as f:
    f.write("// 教科書・学習ノート掲載単語の完全習得 単語ファミリーマスターデータ\n")
    f.write("// 各単語の辞書形・語幹・時制・態（使役/受動/相互）・格変化・派生形・例文を網羅\n")
    f.write("export const WORD_FAMILIES_DATA = ")
    json.dump(families, f, ensure_ascii=False, indent=2)
    f.write(";\n")

with open('dist/js/data/wordFamiliesData.js', 'w', encoding='utf-8') as f:
    f.write("// 教科書・学習ノート掲載単語の完全習得 単語ファミリーマスターデータ\n")
    f.write("// 各単語の辞書形・語幹・時制・態（使役/受動/相互）・格変化・派生形・例文を網羅\n")
    f.write("export const WORD_FAMILIES_DATA = ")
    json.dump(families, f, ensure_ascii=False, indent=2)
    f.write(";\n")

print("Successfully written wordFamiliesData.js to js/ and dist/.")
