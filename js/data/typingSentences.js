// モンゴル語タイピング練習用例文集（初級・日常会話・伝統文化・ことわざ）
// 単語タップ辞書解説 ＆ 調べた単語保存 ＆ 一文完了時和訳表示対応
export const initialTypingSentences = [
  // ==========================================
  // 1. 初級・基本挨拶と自己紹介（10〜30文字）
  // ==========================================
  {
    id: "type_1",
    level: "初級",
    category: "beginner",
    categoryLabel: "基本挨拶・自己紹介",
    textMn: "Сайн байна уу?",
    textJa: "こんにちは、お元気ですか？",
    romaji: "sain baina uu?",
    explanation: "モンゴル語で最も基本の挨拶です。「Сайн（良い）」＋「байна（ある）」＋「уу（ですか）」。",
    glossary: {
      "сайн": { dictForm: "сайн", meaning: "良い、元気な", pos: "形容詞", pron: "サイン" },
      "байна": { dictForm: "байх", meaning: "ある、いる、〜である", pos: "動詞", pron: "バイナ" },
      "уу": { dictForm: "уу", meaning: "〜ですか？（男性母音の疑問助詞）", pos: "助詞", pron: "ウー" }
    }
  },
  {
    id: "type_2",
    level: "初級",
    category: "beginner",
    categoryLabel: "基本挨拶・自己紹介",
    textMn: "Намайг Бат гэдэг.",
    textJa: "私の名前はバトといいます。",
    romaji: "namaig bat gedeg.",
    explanation: "「Намайг ... гэдэг」で「私の名前は〜といいます」という定番の自己紹介表現になります。",
    glossary: {
      "намайг": { dictForm: "би", meaning: "私を（биの対格）", pos: "代名詞", pron: "ナマイグ" },
      "бат": { dictForm: "бат", meaning: "バト（モンゴルの男性名・固有名詞、強固なという意味）", pos: "名詞", pron: "バト" },
      "гэдэг": { dictForm: "гэх", meaning: "〜という、〜と言う", pos: "動詞", pron: "ゲデグ" }
    }
  },
  {
    id: "type_3",
    level: "初級",
    category: "beginner",
    categoryLabel: "基本挨拶・自己紹介",
    textMn: "Би Японоос ирсэн.",
    textJa: "私は日本から来ました。",
    romaji: "bi yaponoos irsen.",
    explanation: "国名「Япон」＋ 奪格「-оос（〜から）」＋「ирсэн（来た）」で出身地を表します。",
    glossary: {
      "би": { dictForm: "би", meaning: "私", pos: "代名詞", pron: "ビ" },
      "японоос": { dictForm: "Япон", meaning: "日本から（奪格）", pos: "固有名詞", pron: "ヤポノース" },
      "ирсэн": { dictForm: "ирэх", meaning: "来た（過去形）", pos: "動詞", pron: "イルセン" }
    }
  },
  {
    id: "type_4",
    level: "初級",
    category: "beginner",
    categoryLabel: "基本挨拶・自己紹介",
    textMn: "Танилцсандаа баяртай байна.",
    textJa: "お会いできて嬉しいです（はじめまして）。",
    romaji: "taniltsandaa bayartai baina.",
    explanation: "初対面の挨拶で使います。「танилцах（知り合う）」＋「баяртай байна（嬉しいです）」。",
    glossary: {
      "танилцсандаа": { dictForm: "танилцах", meaning: "知り合ったことに（過去・再帰）", pos: "動詞", pron: "タニルツァンダー" },
      "баяртай": { dictForm: "баяр", meaning: "喜びのある、嬉しい", pos: "形容詞", pron: "バヤルタイ" }
    }
  },
  {
    id: "type_5",
    level: "初級",
    category: "beginner",
    categoryLabel: "基本挨拶・お礼",
    textMn: "Маш их баярлалаа. Зүгээр ээ.",
    textJa: "どうもありがとうございます。どういたしまして。",
    romaji: "mash ikh bayarlalaa. zugeer ee.",
    explanation: "「Маш их（非常に・とても）」＋「баярлалаа（ありがとう）」。返答は「Зүгээр ээ（気にしないで/どういたしまして）」。",
    glossary: {
      "маш": { dictForm: "маш", meaning: "とても、非常に", pos: "副詞", pron: "マシ" },
      "их": { dictForm: "их", meaning: "多い、大きい", pos: "形容詞", pron: "イフ" },
      "баярлалаа": { dictForm: "баярлах", meaning: "ありがとう、感謝しました", pos: "動詞・表現", pron: "バヤルララー" },
      "зүгээр": { dictForm: "зүгээр", meaning: "大丈夫な、平気な", pos: "形容詞", pron: "ズゲール" }
    }
  },
  {
    id: "type_6",
    level: "初級",
    category: "beginner",
    categoryLabel: "基本挨拶・別れ",
    textMn: "Маргааш дахин уулзъя, баяртай.",
    textJa: "明日また会いましょう、さようなら。",
    romaji: "margaash dakhin uulzya, bayartai.",
    explanation: "「Маргааш（明日）」＋「дахин（再び）」＋「уулзъя（会いましょう）」。",
    glossary: {
      "маргааш": { dictForm: "маргааш", meaning: "明日", pos: "名詞・副詞", pron: "マルガーシ" },
      "дахин": { dictForm: "дахин", meaning: "再び、もう一度", pos: "副詞", pron: "ダヒン" },
      "уулзъя": { dictForm: "уулзах", meaning: "会いましょう（勧誘形）", pos: "動詞", pron: "オールジヤ" },
      "баяртай": { dictForm: "баяртай", meaning: "さようなら", pos: "間投詞", pron: "バヤルタイ" }
    }
  },
  {
    id: "type_7",
    level: "初級",
    category: "beginner",
    categoryLabel: "基本挨拶・夜",
    textMn: "Сайхан амраарай.",
    textJa: "おやすみなさい（ゆっくり休んでください）。",
    romaji: "saikhan amraarai.",
    explanation: "就寝前の挨拶やお別れの一言。「амрах（休む）」の丁寧命令語尾「-аарай」。",
    glossary: {
      "сайхан": { dictForm: "сайхан", meaning: "美しい、素晴らしい、良く", pos: "形容詞", pron: "サイハン" },
      "амраарай": { dictForm: "амрах", meaning: "休んでください（丁寧命令）", pos: "動詞", pron: "アムラーライ" }
    }
  },
  {
    id: "type_8",
    level: "初級",
    category: "beginner",
    categoryLabel: "学生生活",
    textMn: "Би их сургуулийн оюутан.",
    textJa: "私は大学の学生です。",
    romaji: "bi ikh surguuliin oyutan.",
    explanation: "名詞を並べるコピュラ文（AはBです）。動詞は不要です。",
    glossary: {
      "их сургууль": { dictForm: "их сургууль", meaning: "大学", pos: "名詞句", pron: "イフ スルグーリ" },
      "сургуулийн": { dictForm: "сургууль", meaning: "学校の（属格）", pos: "名詞", pron: "スルグーリイン" },
      "оюутан": { dictForm: "оюутан", meaning: "学生、大学生", pos: "名詞", pron: "オユータン" }
    }
  },
  {
    id: "type_9",
    level: "初級",
    category: "beginner",
    categoryLabel: "日常・家族",
    textMn: "Манай гэр бүл дөрвөн гишүүнтэй.",
    textJa: "私の家族は4人家族です。",
    romaji: "manai ger bul dorvon gishuuntei.",
    explanation: "「дөрөв（4）」の連体形「дөрвөн」＋「гишүүнтэй（構成員を持つ）」。",
    glossary: {
      "манай": { dictForm: "бид", meaning: "私たちの、我が家の", pos: "代名詞", pron: "マナイ" },
      "гэр бүл": { dictForm: "гэр бүл", meaning: "家族", pos: "名詞句", pron: "ゲル ブル" },
      "дөрвөн": { dictForm: "дөрөв", meaning: "4の（連体形）", pos: "数詞", pron: "ドルウォン" },
      "гишүүнтэй": { dictForm: "гишүүн", meaning: "メンバーを持つ（共格）", pos: "名詞", pron: "ギシューンテイ" }
    }
  },
  {
    id: "type_10",
    level: "初級",
    category: "beginner",
    categoryLabel: "日常・願望",
    textMn: "Би одоо гэртээ харьмаар байна.",
    textJa: "私は今、家に帰りたいです。",
    romaji: "bi odoo gertee kharmaar baina.",
    explanation: "動詞願望形「語幹 ＋ -маар байна（〜したい）」。自分の家へは「гэртээ（再帰）」。",
    glossary: {
      "одоо": { dictForm: "одоо", meaning: "今、現在", pos: "副詞", pron: "オドー" },
      "гэртээ": { dictForm: "гэр", meaning: "自分の家に（与位・再帰）", pos: "名詞", pron: "ゲルテー" },
      "харьмаар": { dictForm: "харих", meaning: "帰りたい（願望形）", pos: "動詞", pron: "ハルマール" }
    }
  },

  // ==========================================
  // 2. 日常会話・食事・街歩き（25〜50文字）
  // ==========================================
  {
    id: "type_11",
    level: "日常会話",
    category: "daily",
    categoryLabel: "買い物・カフェ",
    textMn: "Нэг аяга кофе таван мянган төгрөг.",
    textJa: "コーヒー1杯は5,000トゥグルグです。",
    romaji: "neg ayaga kofe tavan myangan togrog.",
    explanation: "「5,000」は「таван мянга」。通貨単位「төгрөг」の前では「таван мянган」となります。",
    glossary: {
      "нэг": { dictForm: "нэг", meaning: "1、ひとつの", pos: "数詞", pron: "ネグ" },
      "аяга": { dictForm: "аяга", meaning: "茶碗、カップ、〜杯", pos: "名詞", pron: "アヤガ" },
      "кофе": { dictForm: "кофе", meaning: "コーヒー", pos: "名詞", pron: "コフェ" },
      "таван": { dictForm: "тав", meaning: "5の（連体形）", pos: "数詞", pron: "タワン" },
      "мянган": { dictForm: "мянга", meaning: "千の（連体形）", pos: "数詞", pron: "ミャンガン" },
      "төгрөг": { dictForm: "төгрөг", meaning: "トゥグルグ（モンゴルの通貨単位）", pos: "名詞", pron: "トグログ" }
    }
  },
  {
    id: "type_12",
    level: "日常会話",
    category: "daily",
    categoryLabel: "食事の感想",
    textMn: "Энэ хуушуур маш амттай байна.",
    textJa: "このホーショール（揚げ肉パイ）はとても美味しいです。",
    romaji: "ene khuushuur mash amttai baina.",
    explanation: "モンゴル伝統の揚げ肉料理ホーショールへの感想。「амт（味）」＋「-тай（ある）」。",
    glossary: {
      "энэ": { dictForm: "энэ", meaning: "これ、この", pos: "指示詞", pron: "エネ" },
      "хуушуур": { dictForm: "хуушуур", meaning: "ホーショール（揚げミートパイ）", pos: "名詞", pron: "ホーショール" },
      "амттай": { dictForm: "амт", meaning: "美味しい、味のある", pos: "形容詞", pron: "アムトタイ" }
    }
  },
  {
    id: "type_13",
    level: "日常会話",
    category: "daily",
    categoryLabel: "交通・通学",
    textMn: "Би сургууль руугаа автобусаар явдаг.",
    textJa: "私は学校へバスで行きます（バスを使って通っています）。",
    romaji: "bi surguuli ruugaa avtobusaar yavdag.",
    explanation: "方向格「руугаа（自分の学校へ）」＋ 手段の造格「автобусаар（バスで）」＋ 習慣形「явдаг（通っている）」。",
    glossary: {
      "руугаа": { dictForm: "руу", meaning: "〜のほうへ（方向・再帰）", pos: "後置詞", pron: "ルーガー" },
      "автобусаар": { dictForm: "автобус", meaning: "バスで（造格）", pos: "名詞", pron: "アウトブサール" },
      "явдаг": { dictForm: "явах", meaning: "行く習慣がある（習慣形）", pos: "動詞", pron: "ヤウダグ" }
    }
  },
  {
    id: "type_14",
    level: "日常会話",
    category: "daily",
    categoryLabel: "天気・時候",
    textMn: "Өнөөдөр цаг агаар маш сайхан байна.",
    textJa: "今日の天気はとても素晴らしいですね。",
    romaji: "onoodor tsag agaar mash saikhan baina.",
    explanation: "「цаг агаар（天気・気候）」を用いた毎日の定番の会話表現です。",
    glossary: {
      "өнөөдөр": { dictForm: "өнөөдөр", meaning: "今日", pos: "名詞・副詞", pron: "オノーデル" },
      "цаг агаар": { dictForm: "цаг агаар", meaning: "天気、気候", pos: "名詞句", pron: "ツァグ アガール" }
    }
  },
  {
    id: "type_15",
    level: "日常会話",
    category: "daily",
    categoryLabel: "約束・時間",
    textMn: "Орой долоон цагт төв талбай дээр уулзъя.",
    textJa: "夜7時に中央広場で会いましょう。",
    romaji: "oroi doloon tsagt tov talbai deer uulzya.",
    explanation: "「Орой（夜）」＋「долоон цагт（7時に）」＋「төв талбай дээр（スフバートル広場にて）」。",
    glossary: {
      "орой": { dictForm: "орой", meaning: "夕方、夜", pos: "名詞・副詞", pron: "オロイ" },
      "долоон": { dictForm: "долоо", meaning: "7の（連体形）", pos: "数詞", pron: "ドローン" },
      "цагт": { dictForm: "цаг", meaning: "〜時に（与位格）", pos: "名詞", pron: "ツァグト" },
      "төв": { dictForm: "төв", meaning: "中央の、中心の", pos: "形容詞・名詞", pron: "トウ" },
      "талбай": { dictForm: "талбай", meaning: "広場、敷地", pos: "名詞", pron: "タルバイ" },
      "дээр": { dictForm: "дээр", meaning: "〜の上で、〜にて", pos: "後置詞", pron: "デール" }
    }
  },
  {
    id: "type_16",
    level: "日常会話",
    category: "daily",
    categoryLabel: "マナー・生活習慣",
    textMn: "Гэртээ орохдоо гутал тайлаад орно уу.",
    textJa: "家に入るときは靴を脱いでお入りください。",
    romaji: "gertee orokhdoo gutal tailaad orno uu.",
    explanation: "並列順次「тайлаад（脱いでから）」＋ 丁寧命令・依頼「орно уу（お入りください）」。",
    glossary: {
      "орохдоо": { dictForm: "орох", meaning: "入るときに", pos: "動詞", pron: "オロホドー" },
      "гутал": { dictForm: "гутал", meaning: "靴、ブーツ", pos: "名詞", pron: "ゴタル" },
      "тайлаад": { dictForm: "тайлах", meaning: "脱いで（並列順次）", pos: "動詞", pron: "タイラード" },
      "орно": { dictForm: "орох", meaning: "入る", pos: "動詞", pron: "オルノ" }
    }
  },
  {
    id: "type_17",
    level: "日常会話",
    category: "daily",
    categoryLabel: "語学・学習",
    textMn: "Шинэ үгийг өдөр бүр давтах хэрэгтэй.",
    textJa: "新しい単語を毎日復習する必要があります（復習すべきです）。",
    romaji: "shine ugiig odor bur davtakh kheregtei.",
    explanation: "不定詞「давтах（復習すること）」＋「хэрэгтэй（必要がある）」で義務を表します。",
    glossary: {
      "шинэ": { dictForm: "шинэ", meaning: "新しい", pos: "形容詞", pron: "シネ" },
      "үгийг": { dictForm: "үг", meaning: "単語を、言葉を（対格）", pos: "名詞", pron: "ウギイグ" },
      "өдөр бүр": { dictForm: "өдөр бүр", meaning: "毎日", pos: "副詞句", pron: "オデル ブル" },
      "давтах": { dictForm: "давтах", meaning: "復習する、繰り返す", pos: "動詞", pron: "ダウタハ" },
      "хэрэгтэй": { dictForm: "хэрэг", meaning: "必要がある、重要である", pos: "名詞＋格語尾", pron: "ヘレグテイ" }
    }
  },

  // ==========================================
  // 3. 伝統文化・大自然・ゲル（40〜80文字）
  // ==========================================
  {
    id: "type_18",
    level: "伝統文化",
    category: "culture",
    categoryLabel: "伝統住居・ゲル",
    textMn: "Монгол гэр бол дугуй хэлбэртэй уламжлалт орон сууц юм.",
    textJa: "モンゴルゲルは円形をした伝統的な住居です。",
    romaji: "mongol ger bol dugui khelbertei ulamjlalt oron suuts yum.",
    explanation: "「бол 〜 юм」は強調・定義（〜とは〜である）を表す構文です。",
    glossary: {
      "дугуй": { dictForm: "дугуй", meaning: "丸い、円形の", pos: "形容詞", pron: "ドゴイ" },
      "хэлбэртэй": { dictForm: "хэлбэр", meaning: "形をした（共格）", pos: "名詞", pron: "ヘルベルテイ" },
      "уламжлалт": { dictForm: "уламжлалт", meaning: "伝統的な", pos: "形容詞", pron: "オラムジラルト" },
      "орон сууц": { dictForm: "орон сууц", meaning: "住居、家", pos: "名詞句", pron: "オロン スーツ" }
    }
  },
  {
    id: "type_19",
    level: "伝統文化",
    category: "culture",
    categoryLabel: "大自然・湖",
    textMn: "Хөвсгөл нуурыг Монголын цэнхэр сувд хэмээн нэрлэдэг.",
    textJa: "フブスグル湖はモンゴルの青い真珠と呼ばれています。",
    romaji: "khovsgol nuuriig mongoliin tsenkher suvd khemeen nerledeg.",
    explanation: "「Хөвсгөл нуур」に客体対格「-ыг」が接続し、「〜と呼ぶ」という意味の「хэмээн нэрлэдэг」が続きます。",
    glossary: {
      "нуурыг": { dictForm: "нуур", meaning: "湖を（対格）", pos: "名詞", pron: "ヌーリイグ" },
      "цэнхэр": { dictForm: "цэнхэр", meaning: "青い、水色の", pos: "形容詞", pron: "ツェンヘル" },
      "сувд": { dictForm: "сувд", meaning: "真珠", pos: "名詞", pron: "スウド" },
      "нэрлэдэг": { dictForm: "нэрлэх", meaning: "名付ける、呼ぶ（習慣形）", pos: "動詞", pron: "ネルレデグ" }
    }
  },
  {
    id: "type_20",
    level: "伝統文化",
    category: "culture",
    categoryLabel: "国家大祭ナーダム",
    textMn: "Эрийн гурван наадамд бөх, морь, сур ордог.",
    textJa: "男の三遊（ナーダム）には相撲、競馬、弓射が含まれます。",
    romaji: "eriin gurvan naadamd bokh, mori, sur ordog.",
    explanation: "モンゴル伝統の3大競技「相撲（ブフ）」「競馬（モリ）」「弓射（スル）」。",
    glossary: {
      "эрийн": { dictForm: "эр", meaning: "男の（属格）", pos: "名詞", pron: "エリイン" },
      "бөх": { dictForm: "бөх", meaning: "モンゴル相撲", pos: "名詞", pron: "ボフ" },
      "морь": { dictForm: "морь", meaning: "馬、競馬", pos: "名詞", pron: "モリ" },
      "сур": { dictForm: "сур", meaning: "弓矢、弓射", pos: "名詞", pron: "スル" },
      "ордог": { dictForm: "орох", meaning: "入る、含まれる（習慣形）", pos: "動詞", pron: "オルドグ" }
    }
  },

  // ==========================================
  // 4. モンゴルのことわざ・名言（Proverbs）
  // ==========================================
  {
    id: "type_21",
    level: "ことわざ",
    category: "proverbs",
    categoryLabel: "モンゴルの諺・知恵",
    textMn: "Хүн ахтай, дээл захтай.",
    textJa: "人には年長者がおり、デールには襟がある（目上の人を敬いなさい）。",
    romaji: "khun akhtai, deel zakhtai.",
    explanation: "衣服のデールに襟が欠かせないように、社会には敬うべき先輩・年長者がいるという代表的なことわざです。",
    glossary: {
      "хүн": { dictForm: "хүн", meaning: "人、人間", pos: "名詞", pron: "フン" },
      "ахтай": { dictForm: "ах", meaning: "兄・年長者を持つ（共格）", pos: "名詞", pron: "アフタイ" },
      "дээл": { dictForm: "дээл", meaning: "伝統衣装デール", pos: "名詞", pron: "デール" },
      "захтай": { dictForm: "зах", meaning: "襟を持つ（共格）", pos: "名詞", pron: "ザハタイ" }
    }
  },
  {
    id: "type_22",
    level: "ことわざ",
    category: "proverbs",
    categoryLabel: "モンゴルの諺・知恵",
    textMn: "Мянга сонсохоор нэг үз.",
    textJa: "百聞は一見に如かず（千回聞くよりも一度見よ）。",
    romaji: "myanga sonsokhoor neg uz.",
    explanation: "「мянга（千）」＋「сонсохоор（聞くよりは）」＋「нэг үз（一度見よ）」。実践の尊さを説く名言です。",
    glossary: {
      "мянга": { dictForm: "мянга", meaning: "千、1000", pos: "数詞", pron: "ミャンガ" },
      "сонсохоор": { dictForm: "сонсох", meaning: "聞くよりは（比較造格）", pos: "動詞", pron: "ソンソホール" },
      "үз": { dictForm: "үзэх", meaning: "見よ（命令形）", pos: "動詞", pron: "ウズ" }
    }
  },
  {
    id: "type_23",
    level: "ことわざ",
    category: "proverbs",
    categoryLabel: "モンゴルの諺・知恵",
    textMn: "Дуслыг хураавал далай.",
    textJa: "塵も積もれば山となる（一滴の雫を集めれば大海となる）。",
    romaji: "duslyg khuraaval dalai.",
    explanation: "毎日の小さな学習や努力の積み重ねが大きな成果になることを励ます格言です。",
    glossary: {
      "дуслыг": { dictForm: "дусал", meaning: "雫・滴を（対格）", pos: "名詞", pron: "ドスリイグ" },
      "хураавал": { dictForm: "хураах", meaning: "集めれば（仮定形）", pos: "動詞", pron: "フラーワル" },
      "далай": { dictForm: "далай", meaning: "海、大海、巨大な湖", pos: "名詞", pron: "ダライ" }
    }
  }
];

export const typingSentences = initialTypingSentences;
if (typeof window !== 'undefined') {
  window.typingSentences = initialTypingSentences;
  window.initialTypingSentences = initialTypingSentences;
}

