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
,
{
  "id": "type_cls_01",
  "level": "教室表現",
  "category": "classroom",
  "categoryLabel": "教室でのモンゴル語（Ангидаа монголоор яриарай）",
  "textMn": "Ангидаа монголоор яриарай.",
  "textJa": "教室でモンゴル語を話してください。",
  "romaji": "Angidaa mongoloor yariarai.",
  "explanation": "「ангидаа（教室で: 再帰与位格）」＋「монголоор（モンゴル語で: 造格）」＋「яриарай（話してください: 丁寧命令）」。授業の基本ルールです。",
  "glossary": {
    "ангидаа": {
      "dictForm": "анги",
      "meaning": "自分の教室で",
      "pos": "名詞+格助詞",
      "pron": "アンギダー"
    },
    "монголоор": {
      "dictForm": "монгол",
      "meaning": "モンゴル語で",
      "pos": "名詞+格助詞",
      "pron": "モンゴロール"
    },
    "яриарай": {
      "dictForm": "ярих",
      "meaning": "話してください",
      "pos": "動詞",
      "pron": "ヤリャーライ"
    }
  }
},
{
  "id": "type_cls_02",
  "level": "教室表現",
  "category": "classroom",
  "categoryLabel": "教室でのモンゴル語（Ангидаа монголоор яриарай）",
  "textMn": "Орж болох уу? За, ороорой.",
  "textJa": "入ってもいいですか？ はい、どうぞ入ってください。",
  "romaji": "Orj bolokh uu? Za, oroorei.",
  "explanation": "「-ж болох уу?（〜してもいいですか？許可求め）」に対して、「За, ороорой.（はい、入ってください: 丁寧命令）」と答えます。",
  "glossary": {
    "орж": {
      "dictForm": "орох",
      "meaning": "入って",
      "pos": "動詞接続形",
      "pron": "オルジ"
    },
    "болох уу": {
      "dictForm": "болох",
      "meaning": "いいですか",
      "pos": "助動詞",
      "pron": "ボロホ ウー"
    },
    "ороорой": {
      "dictForm": "орох",
      "meaning": "お入りください",
      "pos": "動詞丁寧命令",
      "pron": "オローロイ"
    }
  }
},
{
  "id": "type_cls_03",
  "level": "教室表現",
  "category": "classroom",
  "categoryLabel": "教室でのモンゴル語（Ангидаа монголоор яриарай）",
  "textMn": "Энд суугаарай. Удаан хэлээрэй.",
  "textJa": "ここに座ってください。ゆっくり言ってください。",
  "romaji": "End suugaarai. Udaan kheleerei.",
  "explanation": "「энд（ここに）」＋「суугаарай（座ってください）」、「удаан（ゆっくり）」＋「хэлээрэй（言ってください）」。",
  "glossary": {
    "энд": {
      "dictForm": "энд",
      "meaning": "ここに",
      "pos": "指示副詞",
      "pron": "エンド"
    },
    "суугаарай": {
      "dictForm": "суух",
      "meaning": "座ってください",
      "pos": "動詞丁寧命令",
      "pron": "スーガーライ"
    },
    "удаан": {
      "dictForm": "удаан",
      "meaning": "ゆっくり、遅く",
      "pos": "副詞",
      "pron": "オダーン"
    },
    "хэлээрэй": {
      "dictForm": "хэлэх",
      "meaning": "言ってください",
      "pos": "動詞丁寧命令",
      "pron": "ヘレーレイ"
    }
  }
},
{
  "id": "type_cls_04",
  "level": "教室表現",
  "category": "classroom",
  "categoryLabel": "教室でのモンゴル語（Ангидаа монголоор яриарай）",
  "textMn": "Дахиад хэлээрэй. Хариулаарай.",
  "textJa": "もう一度言ってください。答えてください。",
  "romaji": "Dakhiad kheleerei. Khariulaarai.",
  "explanation": "「дахиад（再び、もう一度）」＋「хэлээрэй（言ってください）」、「хариулаарай（答えてください）」。聞き取れなかったときの頻出フレーズです。",
  "glossary": {
    "дахиад": {
      "dictForm": "дахиад",
      "meaning": "もう一度、再び",
      "pos": "副詞",
      "pron": "ダヒャード"
    },
    "хариулаарай": {
      "dictForm": "хариулах",
      "meaning": "答えてください",
      "pos": "動詞丁寧命令",
      "pron": "ハリュウラーライ"
    }
  }
},
{
  "id": "type_cls_05",
  "level": "教室表現",
  "category": "classroom",
  "categoryLabel": "教室でのモンゴル語（Ангидаа монголоор яриарай）",
  "textMn": "Шинэ үгээ сайн цээжлээрэй.",
  "textJa": "新しい単語をしっかり覚えてください。",
  "romaji": "Shine ugee sain tseejleerei.",
  "explanation": "「шинэ（新しい）」＋「үгээ（自分の単語を: 再帰対格）」＋「сайн（よく）」＋「цээжлээрэй（暗記してください）」。",
  "glossary": {
    "шинэ": {
      "dictForm": "шинэ",
      "meaning": "新しい",
      "pos": "形容詞",
      "pron": "シネ"
    },
    "үгээ": {
      "dictForm": "үг",
      "meaning": "単語を",
      "pos": "名詞再帰対格",
      "pron": "ウゲー"
    },
    "цээжлээрэй": {
      "dictForm": "цээжлэх",
      "meaning": "覚えてください",
      "pos": "動詞丁寧命令",
      "pron": "ツェージレーレイ"
    }
  }
},
{
  "id": "type_cls_06",
  "level": "教室表現",
  "category": "classroom",
  "categoryLabel": "教室でのモンゴル語（Ангидаа монголоор яриарай）",
  "textMn": "Түр амраарай. Жаахан хүлээгээрэй.",
  "textJa": "少し休んでください。ちょっと待ってください。",
  "romaji": "Tur amraarai. Jaakhan khuleegeerei.",
  "explanation": "「түр（少しの間）」＋「амраарай（休んでください）」、「жаахан（少し）」＋「хүлээгээрэй（待ってください）」。",
  "glossary": {
    "түр": {
      "dictForm": "түр",
      "meaning": "少しの間",
      "pos": "副詞",
      "pron": "トゥル"
    },
    "амраарай": {
      "dictForm": "амрах",
      "meaning": "休んでください",
      "pos": "動詞丁寧命令",
      "pron": "アムラーライ"
    },
    "жаахан": {
      "dictForm": "жаахан",
      "meaning": "ちょっと、少し",
      "pos": "副詞",
      "pron": "ジャーハン"
    },
    "хүлээгээрэй": {
      "dictForm": "хүлээх",
      "meaning": "待ってください",
      "pos": "動詞丁寧命令",
      "pron": "フレージェーレイ"
    }
  }
},
{
  "id": "type_cls_07",
  "level": "教室表現",
  "category": "classroom",
  "categoryLabel": "教室でのモンゴル語（Ангидаа монголоор яриарай）",
  "textMn": "Энэ зөв үү? Тийм ээ, зөв.",
  "textJa": "これは合っていますか？ はい、合っています。",
  "romaji": "Ene zov uu? Tiim ee, zov.",
  "explanation": "「зөв（正しい、合っている）」に対するYes/No疑問「зөв үү?」と肯定の返答「Тийм ээ, зөв.」。不正解の場合は「Үгүй, буруу.（いいえ、間違いです）」。",
  "glossary": {
    "энэ": {
      "dictForm": "энэ",
      "meaning": "これ",
      "pos": "指示代名詞",
      "pron": "エネ"
    },
    "зөв": {
      "dictForm": "зөв",
      "meaning": "正しい、正解",
      "pos": "形容詞",
      "pron": "ゾブ"
    },
    "Тийм ээ": {
      "dictForm": "тийм",
      "meaning": "はい、そうです",
      "pos": "感嘆詞",
      "pron": "ティーメー"
    }
  }
},
{
  "id": "type_cls_08",
  "level": "教室表現",
  "category": "classroom",
  "categoryLabel": "教室でのモンゴル語（Ангидаа монголоор яриарай）",
  "textMn": "Ойлгосон уу? Ойлгосон.",
  "textJa": "分かりましたか？ 分かりました。",
  "romaji": "Oilgoson uu? Oilgoson.",
  "explanation": "「ойлгох（理解する）」の過去時制「ойлгосон（分かりました）」。分からなかったときは「Ойлгохгүй байна.（分かりません）」と答えます。",
  "glossary": {
    "ойлгосон": {
      "dictForm": "ойлгох",
      "meaning": "分かった、理解した",
      "pos": "動詞過去形",
      "pron": "オイルゴソン"
    }
  }
},
{
  "id": "type_cls_09",
  "level": "教室表現",
  "category": "classroom",
  "categoryLabel": "教室でのモンゴル語（Ангидаа монголоор яриарай）",
  "textMn": "Асуулт байна уу? Байна.",
  "textJa": "質問はありますか？ あります。",
  "romaji": "Asuult baina uu? Baina.",
  "explanation": "「асуулт（質問）」＋「байна уу?（ありますか？）」。ない場合は「Үгүй, байхгүй.（いいえ、ありません）」と答えます。",
  "glossary": {
    "асуулт": {
      "dictForm": "асуулт",
      "meaning": "質問",
      "pos": "名詞",
      "pron": "アスールト"
    },
    "байна": {
      "dictForm": "байх",
      "meaning": "あります、います",
      "pos": "存在動詞",
      "pron": "バイン"
    }
  }
},
{
  "id": "type_cls_10",
  "level": "教室表現",
  "category": "classroom",
  "categoryLabel": "教室でのモンゴル語（Ангидаа монголоор яриарай）",
  "textMn": "Үүнийг монголоор юу гэдэг вэ?",
  "textJa": "これはモンゴル語で何と言いますか？",
  "romaji": "Uuniig mongoloor yuu gedeg ve?",
  "explanation": "「үүнийг（これを: 対格）」＋「монголоор（モンゴル語で）」＋「юу гэдэг вэ?（何と言いますか？）」。現地で単語を尋ねる最強のフレーズです。",
  "glossary": {
    "үүнийг": {
      "dictForm": "энэ",
      "meaning": "これを",
      "pos": "指示代名詞対格",
      "pron": "ウーニーグ"
    },
    "юу гэдэг вэ": {
      "dictForm": "гэх",
      "meaning": "何と言うか",
      "pos": "疑問表現",
      "pron": "ユー ゲデグ ベ"
    }
  }
},
{
  "id": "type_grt_01",
  "level": "挨拶表現",
  "category": "greetings",
  "categoryLabel": "日常の挨拶（Мэндчилгээний үг хэллэг）",
  "textMn": "Сайн байна уу? Сайн, сайн байна уу?",
  "textJa": "こんにちは（お元気ですか）。元気です、お元気ですか。",
  "romaji": "Sain baina uu? Sain, sain baina uu?",
  "explanation": "モンゴル語で最も基本かつ重要な挨拶です。「元気ですか？」と尋ねられたら「元気です、お元気ですか？」と繰り返して返します。",
  "glossary": {
    "сайн": {
      "dictForm": "сайн",
      "meaning": "良い、元気な",
      "pos": "形容詞",
      "pron": "サイン"
    },
    "байна": {
      "dictForm": "байх",
      "meaning": "あります、います",
      "pos": "助動詞",
      "pron": "バイン"
    }
  }
},
{
  "id": "type_grt_02",
  "level": "挨拶表現",
  "category": "greetings",
  "categoryLabel": "日常の挨拶（Мэндчилгээний үг хэллэг）",
  "textMn": "Сонин сайхан юу байна вэ? Юмгүй тайван.",
  "textJa": "最近どうですか（変わりありませんか）？ 相変わらずです（平穏です）。",
  "romaji": "Sonin saikhan yuu baina ve? Yumgui taivan.",
  "explanation": "「сонин（ニュース・珍しいこと）」＋「сайхан（良いこと）」を尋ねる日常会話の決まり文句。返答は「Юмгүй тайван.（特に変わりなく平穏です）」が定番です。",
  "glossary": {
    "сонин": {
      "dictForm": "сонин",
      "meaning": "珍しいこと、ニュース",
      "pos": "名詞",
      "pron": "ソニン"
    },
    "юмгүй": {
      "dictForm": "юм",
      "meaning": "何もない",
      "pos": "名詞+否定",
      "pron": "ユムグイ"
    },
    "тайван": {
      "dictForm": "тайван",
      "meaning": "平穏な、静かな",
      "pos": "形容詞",
      "pron": "タイワン"
    }
  }
},
{
  "id": "type_grt_03",
  "level": "挨拶表現",
  "category": "greetings",
  "categoryLabel": "日常の挨拶（Мэндчилгээний үг хэллэг）",
  "textMn": "Сайхан амарсан уу? Сайхан амарсан.",
  "textJa": "よく休みましたか？ よく休みました。",
  "romaji": "Saikhan amarsan uu? Saikhan amarsan.",
  "explanation": "朝の挨拶や週末明けの定番表現。「сайхан（良く）」＋「амарсан уу?（休みましたか？）」。",
  "glossary": {
    "сайхан": {
      "dictForm": "сайхан",
      "meaning": "美しい、良い、良く",
      "pos": "形容詞/副詞",
      "pron": "サイハン"
    },
    "амарсан": {
      "dictForm": "амрах",
      "meaning": "休んだ",
      "pos": "動詞過去形",
      "pron": "アマルサン"
    }
  }
},
{
  "id": "type_grt_04",
  "level": "挨拶表現",
  "category": "greetings",
  "categoryLabel": "日常の挨拶（Мэндчилгээний үг хэллэг）",
  "textMn": "Маш их баярлалаа. Зүгээр, зүгээр.",
  "textJa": "どうもありがとうございます。 どういたしまして。",
  "romaji": "Mash ikh bayarlalaa. Zugeer, zugeer.",
  "explanation": "「маш их（非常に大いに）」＋「баярлалаа（ありがとう）」とお礼を述べられたら、「Зүгээр, зүгээр.（気にしないで、どういたしまして）」と答えます。",
  "glossary": {
    "маш": {
      "dictForm": "маш",
      "meaning": "非常に、とても",
      "pos": "副詞",
      "pron": "マシ"
    },
    "баярлалаа": {
      "dictForm": "баярлах",
      "meaning": "ありがとう",
      "pos": "動詞過去形",
      "pron": "バヤルララー"
    },
    "зүгээр": {
      "dictForm": "зүгээр",
      "meaning": "大丈夫、平気",
      "pos": "形容詞/副詞",
      "pron": "ズゲール"
    }
  }
},
{
  "id": "type_grt_05",
  "level": "挨拶表現",
  "category": "greetings",
  "categoryLabel": "日常の挨拶（Мэндчилгээний үг хэллэг）",
  "textMn": "Уучлаарай. Зүгээр ээ, зүгээр.",
  "textJa": "すみません（ごめんなさい）。 大丈夫ですよ、平気です。",
  "romaji": "Uuchlaarai. Zugeer ee, zugeer.",
  "explanation": "謝罪や呼びかけの「Уучлаарай（すみません）」に対して、相手を安心させる返答が「Зүгээр ээ（平気です）」です。",
  "glossary": {
    "уучлаарай": {
      "dictForm": "уучлах",
      "meaning": "許してください、すみません",
      "pos": "動詞丁寧命令",
      "pron": "オーチラーライ"
    }
  }
},
{
  "id": "type_grt_06",
  "level": "挨拶表現",
  "category": "greetings",
  "categoryLabel": "日常の挨拶（Мэндчилгээний үг хэллэг）",
  "textMn": "Сайхан амраарай. Баяртай.",
  "textJa": "お休みなさい（良い休息を）。 さようなら。",
  "romaji": "Saikhan amraarai. Bayartai.",
  "explanation": "夜別れるときの挨拶「Сайхан амраарай（よく休んでね）」と別れの挨拶「Баяртай（さようなら）」。",
  "glossary": {
    "амраарай": {
      "dictForm": "амрах",
      "meaning": "休んでください",
      "pos": "動詞丁寧命令",
      "pron": "アムラーライ"
    },
    "баяртай": {
      "dictForm": "баяр",
      "meaning": "喜びと共に、さようなら",
      "pos": "共同格・挨拶",
      "pron": "バヤルタイ"
    }
  }
},
{
  "id": "type_grt_07",
  "level": "挨拶表現",
  "category": "greetings",
  "categoryLabel": "日常の挨拶（Мэндчилгээний үг хэллэг）",
  "textMn": "Дараа уулзъя. Маргааш уулзъя.",
  "textJa": "また会いましょう。 明日会いましょう。",
  "romaji": "Daraa uulzya. Margaash uulzya.",
  "explanation": "「дараа（後で）」＋「уулзъя（会いましょう: 希求形）」、「маргааш（明日）」＋「уулзъя（会いましょう）」。親しい人との別れ際によく使われます。",
  "glossary": {
    "дараа": {
      "dictForm": "дараа",
      "meaning": "後で",
      "pos": "副詞",
      "pron": "ダラー"
    },
    "маргааш": {
      "dictForm": "маргааш",
      "meaning": "明日",
      "pos": "副詞",
      "pron": "マルガーシ"
    },
    "уулзъя": {
      "dictForm": "уулзах",
      "meaning": "会いましょう",
      "pos": "動詞希求形",
      "pron": "オールズヤ"
    }
  }
},
{
  "id": "type_ls_01_1",
  "level": "初級・基礎",
  "category": "lesson_basics",
  "categoryLabel": "挨拶・自己紹介・コピュラ文",
  "textMn": "Миний нэр Золбоо. Би багш биш, оюутан.",
  "textJa": "私の名前はゾルボーです。私は先生ではなく学生です。",
  "romaji": "Minii ner Zolboo. Bi bagsh bish, oyutan.",
  "explanation": "「Миний нэр 〜（私の名前は〜）」、肯定コピュラ文「Би 〜（私は〜です）」、否定コピュラ文「〜 биш（〜ではありません）」。",
  "glossary": {
    "миний": {
      "dictForm": "би",
      "meaning": "私の",
      "pos": "人称代名詞属格",
      "pron": "ミニー"
    },
    "нэр": {
      "dictForm": "нэр",
      "meaning": "名前",
      "pos": "名詞",
      "pron": "ネル"
    },
    "биш": {
      "dictForm": "биш",
      "meaning": "〜ではない",
      "pos": "否定詞",
      "pron": "ビシ"
    },
    "оюутан": {
      "dictForm": "оюутан",
      "meaning": "学生",
      "pos": "名詞",
      "pron": "オユータン"
    }
  }
},
{
  "id": "type_ls_01_2",
  "level": "初級・基礎",
  "category": "lesson_basics",
  "categoryLabel": "挨拶・自己紹介・コピュラ文",
  "textMn": "Таны нэр хэн бэ? Сайхан танилцлаа.",
  "textJa": "あなたのお名前は何ですか？ お会いできて嬉しいです。",
  "romaji": "Tany ner khen be? Saikhan taniltslaa.",
  "explanation": "疑問詞「хэн（誰）」のある疑問文なので文末は「бэ」。初対面の定番「Сайхан танилцлаа.（お会いできて嬉しいです）」。",
  "glossary": {
    "таны": {
      "dictForm": "та",
      "meaning": "あなたの",
      "pos": "人称代名詞属格",
      "pron": "タニー"
    },
    "хэн": {
      "dictForm": "хэн",
      "meaning": "誰",
      "pos": "疑問詞",
      "pron": "ヘン"
    },
    "танилцлаа": {
      "dictForm": "танилцах",
      "meaning": "知り合いました",
      "pos": "動詞過去形",
      "pron": "タニルツラー"
    }
  }
},
{
  "id": "type_ls_02_1",
  "level": "初級・基礎",
  "category": "lesson_basics",
  "categoryLabel": "教室の持ち物と存在文",
  "textMn": "Энэ юу вэ? Энэ сонин биш, сэтгүүл.",
  "textJa": "これは何ですか？ これは新聞ではなく雑誌です。",
  "romaji": "Ene yuu ve? Ene sonin bish, setguul.",
  "explanation": "指示代名詞「энэ（これ）」＋疑問詞「юу（何）」＋「вэ」。否定詞「биш」で「新聞ではなく雑誌」と訂正します。",
  "glossary": {
    "энэ": {
      "dictForm": "энэ",
      "meaning": "これ",
      "pos": "指示代名詞",
      "pron": "エネ"
    },
    "сонин": {
      "dictForm": "сонин",
      "meaning": "新聞",
      "pos": "名詞",
      "pron": "ソニン"
    },
    "сэтгүүл": {
      "dictForm": "сэтгүүл",
      "meaning": "雑誌",
      "pos": "名詞",
      "pron": "セトゥグール"
    }
  }
},
{
  "id": "type_ls_02_2",
  "level": "初級・基礎",
  "category": "lesson_basics",
  "categoryLabel": "教室の持ち物と存在文",
  "textMn": "Энд хоёр самбар, дөрвөн сандал байна.",
  "textJa": "ここに2つの黒板と4脚の椅子があります。",
  "romaji": "End khoyor sambar, dorvon sandal baina.",
  "explanation": "場所の指示詞「энд（ここに）」＋数詞＋名詞＋存在動詞「байна（あります）」。数詞の後ろの名詞は単数形になります。",
  "glossary": {
    "хоёр": {
      "dictForm": "хоёр",
      "meaning": "2つの",
      "pos": "数詞",
      "pron": "ホヨル"
    },
    "самбар": {
      "dictForm": "самбар",
      "meaning": "黒板",
      "pos": "名詞",
      "pron": "サンバル"
    },
    "дөрвөн": {
      "dictForm": "дөрөв",
      "meaning": "4つの",
      "pos": "数詞（交代語幹）",
      "pron": "ドルウォン"
    },
    "сандал": {
      "dictForm": "сандал",
      "meaning": "椅子",
      "pos": "名詞",
      "pron": "サンダル"
    }
  }
},
{
  "id": "type_ls_03_1",
  "level": "初級・基礎",
  "category": "lesson_basics",
  "categoryLabel": "自己紹介・年齢・過去時制",
  "textMn": "Би хорин зургаан настай. Токиогоос ирсэн.",
  "textJa": "私は26歳です。東京から来ました。",
  "romaji": "Bi khorin zurgaan nastai. Tokiogoos irsen.",
  "explanation": "「〜настай（〜歳です）」、奪格「-оос（〜から）」＋動詞過去時制「ирсэн（来ました）」。自己紹介の最重要構文です。",
  "glossary": {
    "настай": {
      "dictForm": "нас",
      "meaning": "〜歳の",
      "pos": "名詞+接尾辞",
      "pron": "ナスタイ"
    },
    "Токиогоос": {
      "dictForm": "Токио",
      "meaning": "東京から",
      "pos": "固有名詞奪格",
      "pron": "トキオゴース"
    },
    "ирсэн": {
      "dictForm": "ирэх",
      "meaning": "来た",
      "pos": "動詞過去形",
      "pron": "イルセン"
    }
  }
},
{
  "id": "type_ls_03_2",
  "level": "初級・基礎",
  "category": "lesson_basics",
  "categoryLabel": "自己紹介・年齢・過去時制",
  "textMn": "Би ЖАЙКА-ийн сайн дурын гишүүн.",
  "textJa": "私は海外協力隊のボランティア隊員です。",
  "romaji": "Bi JAIKA-iin sain duryn gishuun.",
  "explanation": "「сайн дурын гишүүн（ボランティア隊員）」。派遣先で自己紹介する際の最重要フレーズです。",
  "glossary": {
    "сайн дурын": {
      "dictForm": "сайн дур",
      "meaning": "自発的な、ボランティアの",
      "pos": "名詞句属格",
      "pron": "サイン ドゥリーン"
    },
    "гишүүн": {
      "dictForm": "гишүүн",
      "meaning": "隊員、会員、メンバー",
      "pos": "名詞",
      "pron": "ギシューン"
    }
  }
},
{
  "id": "type_ls_04_1",
  "level": "初級・基礎",
  "category": "lesson_basics",
  "categoryLabel": "所属（属格）と位置関係の後置詞",
  "textMn": "Ширээн дээр япон хэлний сурах бичиг байна.",
  "textJa": "机の上に日本語の教科書があります。",
  "romaji": "Shireen deer yapon khelnii surakh bichig baina.",
  "explanation": "位置後置詞「дээр（〜の上に）」、言語の属格「япон хэлний（日本語の）」＋「сурах бичиг（教科書）」。",
  "glossary": {
    "ширээн дээр": {
      "dictForm": "ширээ",
      "meaning": "机の上に",
      "pos": "後置詞句",
      "pron": "シレーン デール"
    },
    "хэлний": {
      "dictForm": "хэл",
      "meaning": "言語の",
      "pos": "名詞属格",
      "pron": "ヘルニー"
    },
    "сурах бичиг": {
      "dictForm": "сурах бичиг",
      "meaning": "教科書",
      "pos": "名詞句",
      "pron": "スラホ ビチグ"
    }
  }
},
{
  "id": "type_ls_04_2",
  "level": "初級・基礎",
  "category": "lesson_basics",
  "categoryLabel": "所属（属格）と位置関係の後置詞",
  "textMn": "Энэ түлхүүр минийх, тэр компьютер ч бас таных.",
  "textJa": "この鍵は私のものです。あのパソコンもあなたのものです。",
  "romaji": "Ene tulkhuur miniikh, ter kompyuter ch bas tanykh.",
  "explanation": "所属・所有を表す代名詞接尾辞「-х」: 「минийх（私のもの）」「таных（あなたのもの）」、「ч бас（〜もまた）」。",
  "glossary": {
    "түлхүүр": {
      "dictForm": "түлхүүр",
      "meaning": "鍵、キー",
      "pos": "名詞",
      "pron": "トゥルフール"
    },
    "минийх": {
      "dictForm": "миний",
      "meaning": "私のもの",
      "pos": "所有代名詞",
      "pron": "ミニーヒ"
    },
    "таных": {
      "dictForm": "таны",
      "meaning": "あなたのもの",
      "pos": "所有代名詞",
      "pron": "タニーヒ"
    }
  }
},
{
  "id": "type_ls_05_1",
  "level": "日常会話",
  "category": "daily_actions",
  "categoryLabel": "予定・未来時制・共同格",
  "textMn": "Ажлын хамтрагчтай хамт өдрийн хоол иднэ.",
  "textJa": "カウンターパートと一緒に昼食を食べます。",
  "romaji": "Ajlyn khamtragchtai khamt odriin khool idne.",
  "explanation": "共同格「-тай хамт（〜と一緒に）」＋「өдрийн хоол（昼食）」＋未来時制「иднэ（食べます）」。",
  "glossary": {
    "хамтрагчтай": {
      "dictForm": "хамтрагч",
      "meaning": "パートナーと",
      "pos": "名詞共同格",
      "pron": "ハムトラグチタイ"
    },
    "хамт": {
      "dictForm": "хамт",
      "meaning": "一緒に",
      "pos": "後置詞",
      "pron": "ハムト"
    },
    "иднэ": {
      "dictForm": "идэх",
      "meaning": "食べます",
      "pos": "動詞未来形",
      "pron": "イドネ"
    }
  }
},
{
  "id": "type_ls_05_2",
  "level": "日常会話",
  "category": "daily_actions",
  "categoryLabel": "予定・未来時制・共同格",
  "textMn": "Би хурлын танхимд очно. Тэнд хуралтай.",
  "textJa": "私は会議室に行きます。そこで会議があります。",
  "romaji": "Bi khurlyn tankhimd ochno. Tend khuraltai.",
  "explanation": "与位格「-д（〜に）」＋未来形「очно（行きます）」、「хуралтай（会議がある: 共同格）」。",
  "glossary": {
    "танхимд": {
      "dictForm": "танхим",
      "meaning": "室・ホールに",
      "pos": "名詞与位格",
      "pron": "タンヒムド"
    },
    "очно": {
      "dictForm": "очих",
      "meaning": "行きます",
      "pos": "動詞未来形",
      "pron": "オチノ"
    },
    "хуралтай": {
      "dictForm": "хурал",
      "meaning": "会議がある",
      "pos": "名詞共同格",
      "pron": "フラルタイ"
    }
  }
},
{
  "id": "type_ls_06_1",
  "level": "日常会話",
  "category": "daily_actions",
  "categoryLabel": "習慣動詞と丁寧な命令表現",
  "textMn": "Оюутан өглөө бүр ангид эрт ирдэг.",
  "textJa": "学生は毎朝教室に早く来ます。",
  "romaji": "Oyutan ogloo bur angid ert irdeg.",
  "explanation": "習慣を表す動詞形「-даг⁴」: 「өглөө бүр（毎朝）」＋「эрт（早く）」＋「ирдэг（来ます: 習慣）」。",
  "glossary": {
    "өглөө бүр": {
      "dictForm": "өглөө бүр",
      "meaning": "毎朝",
      "pos": "副詞句",
      "pron": "オグロー ブル"
    },
    "эрт": {
      "dictForm": "эрт",
      "meaning": "早く",
      "pos": "副詞",
      "pron": "エルト"
    },
    "ирдэг": {
      "dictForm": "ирэх",
      "meaning": "普段来る",
      "pos": "動詞習慣形",
      "pron": "イルデグ"
    }
  }
},
{
  "id": "type_ls_06_2",
  "level": "日常会話",
  "category": "daily_actions",
  "categoryLabel": "習慣動詞と丁寧な命令表現",
  "textMn": "Хоолны өмнө гар угаагаарай. Цаас хайрцганд хийгээрэй.",
  "textJa": "食事の前に手を洗ってください。紙を箱にしまってください。",
  "romaji": "Khoolny omno gar ugaagaarai. Tsaas khairtsgand khiigeerei.",
  "explanation": "丁寧な指示・命令「-аарай⁴」: 「угаагаарай（洗ってください: 隠れг出現）」、「хийгээрэй（入れてください）」。",
  "glossary": {
    "өмнө": {
      "dictForm": "өмнө",
      "meaning": "前に",
      "pos": "後置詞",
      "pron": "オムノ"
    },
    "угаагаарай": {
      "dictForm": "угаах",
      "meaning": "洗ってください",
      "pos": "動詞丁寧命令",
      "pron": "オガーガーライ"
    },
    "хайрцганд": {
      "dictForm": "хайрцаг",
      "meaning": "箱に",
      "pos": "名詞与位格",
      "pron": "ハイリツガンド"
    }
  }
},
{
  "id": "type_ls_07_1",
  "level": "初級・文法",
  "category": "grammar_patterns",
  "categoryLabel": "対格と集合数詞（〜人で）",
  "textMn": "Бид тэр зузаан дэвтрийг хэрэглэдэг.",
  "textJa": "私たちはあの厚いノートを使います。",
  "romaji": "Bid ter zuzaan devtriig khereglegedeg.",
  "explanation": "動作の目的語を表す対格「дэвтрийг（ノートを: 母音脱落＋-ийг）」＋習慣動詞「хэрэглэдэг（使います）」。",
  "glossary": {
    "зузаан": {
      "dictForm": "зузаан",
      "meaning": "厚い",
      "pos": "形容詞",
      "pron": "ズザーン"
    },
    "дэвтрийг": {
      "dictForm": "дэвтэр",
      "meaning": "ノートを",
      "pos": "名詞対格",
      "pron": "デフトリイグ"
    },
    "хэрэглэдэг": {
      "dictForm": "хэрэглэх",
      "meaning": "使う",
      "pos": "動詞習慣形",
      "pron": "ヘレグレデグ"
    }
  }
},
{
  "id": "type_ls_07_2",
  "level": "初級・文法",
  "category": "grammar_patterns",
  "categoryLabel": "対格と集合数詞（〜人で）",
  "textMn": "Бид Монголд арвуулаа очно, бүгдээрээ ажиллана.",
  "textJa": "私たちは10人でモンゴルに行きます。みんなで働きます。",
  "romaji": "Bid Mongold arvuulaa ochno, bugdeeree ajillana.",
  "explanation": "集合数詞「арвуулаа（10人で: -уулаа²）」、「бүгдээрээ（みんなで）」。",
  "glossary": {
    "арвуулаа": {
      "dictForm": "арав",
      "meaning": "10人で",
      "pos": "集合数詞",
      "pron": "アルウォーラー"
    },
    "бүгдээрээ": {
      "dictForm": "бүгд",
      "meaning": "みんなで",
      "pos": "副詞句",
      "pron": "ブグデーレー"
    },
    "ажиллана": {
      "dictForm": "ажиллах",
      "meaning": "働きます",
      "pos": "動詞未来形",
      "pron": "アジッラナ"
    }
  }
},
{
  "id": "type_ls_08_1",
  "level": "初級・文法",
  "category": "grammar_patterns",
  "categoryLabel": "方向格（へ）と連用節（〜するとき）",
  "textMn": "Цагаан сарын өмнө төрсөн нутаг руу явна.",
  "textJa": "お正月の前に故郷へ帰ります。",
  "romaji": "Tsagaan saryn omno torson nutag ruu yavna.",
  "explanation": "方向格「төрсөн нутаг руу（故郷へ: 名詞と離して書く）」＋「явна（行きます）」。",
  "glossary": {
    "Цагаан сар": {
      "dictForm": "Цагаан сар",
      "meaning": "ツァガーンサル、旧正月",
      "pos": "固有名詞",
      "pron": "ツァガーン サル"
    },
    "төрсөн нутаг": {
      "dictForm": "төрсөн нутаг",
      "meaning": "故郷、生まれ故郷",
      "pos": "名詞句",
      "pron": "トルソン ヌタグ"
    },
    "руу": {
      "dictForm": "руу",
      "meaning": "〜へ（方向格）",
      "pos": "格助詞",
      "pron": "ロー"
    }
  }
},
{
  "id": "type_ls_08_2",
  "level": "初級・文法",
  "category": "grammar_patterns",
  "categoryLabel": "方向格（へ）と連用節（〜するとき）",
  "textMn": "Би Монгол руу явахдаа, дулаан дээл өмсөнө.",
  "textJa": "私はモンゴルへ行くとき、暖かいデールを着ます。",
  "romaji": "Bi Mongol ruu yavakhdaa, dulaan deel omsono.",
  "explanation": "時点を表す連用節「-хдаа⁴（〜するとき）」: 「явахдаа（行くとき）」＋「өмсөнө（着ます）」。",
  "glossary": {
    "явахдаа": {
      "dictForm": "явах",
      "meaning": "行くとき",
      "pos": "動詞連用形",
      "pron": "ヤワハダー"
    },
    "дээл": {
      "dictForm": "дээл",
      "meaning": "デール（民族服）",
      "pos": "名詞",
      "pron": "デール"
    },
    "өмсөнө": {
      "dictForm": "өмсөх",
      "meaning": "着ます",
      "pos": "動詞未来形",
      "pron": "オムソノ"
    }
  }
},
{
  "id": "type_ls_09_1",
  "level": "訓練所・日課",
  "category": "routine_schedule",
  "categoryLabel": "時刻・時間の表現と再帰所有（自分の〜）",
  "textMn": "Найман цаг дөчин таван минутаас арван таван цаг хүртэл хичээлтэй байдаг.",
  "textJa": "8時45分から15時まで授業があります。",
  "romaji": "Naiman tsag dochin tavan minutaas arvan tavan tsag khurtel khicheeltei baidag.",
  "explanation": "時間的起点「-аас」と終点「хүртэл（〜まで）」の組み合わせ。「хичээлтэй байдаг（授業がある）」。",
  "glossary": {
    "минутаас": {
      "dictForm": "минут",
      "meaning": "分から",
      "pos": "名詞奪格",
      "pron": "ミヌタース"
    },
    "хүртэл": {
      "dictForm": "хүртэл",
      "meaning": "〜まで",
      "pos": "後置詞",
      "pron": "フルテル"
    },
    "хичээлтэй": {
      "dictForm": "хичээл",
      "meaning": "授業がある",
      "pos": "名詞共同格",
      "pron": "ヒチェールテイ"
    }
  }
},
{
  "id": "type_ls_09_2",
  "level": "訓練所・日課",
  "category": "routine_schedule",
  "categoryLabel": "時刻・時間の表現と再帰所有（自分の〜）",
  "textMn": "Сургалтгүй үед өрөөндөө хичээлээ давтдаг.",
  "textJa": "講座がない時は自分の部屋で復習をします。",
  "romaji": "Surgaltgui uyed oroondoo khicheelee davtdag.",
  "explanation": "否定接尾辞「-гүй（〜のない）」＋「үед（〜の時に）」、再帰与位格「өрөөндөө（自分の部屋で）」、再帰対格「хичээлээ（自分の勉強を）」。",
  "glossary": {
    "сургалтгүй": {
      "dictForm": "сургалт",
      "meaning": "訓練・講座のない",
      "pos": "形容詞",
      "pron": "スルガルトグイ"
    },
    "өрөөндөө": {
      "dictForm": "өрөө",
      "meaning": "自分の部屋で",
      "pos": "名詞再帰与位格",
      "pron": "オローンドー"
    },
    "давтдаг": {
      "dictForm": "давтах",
      "meaning": "復習する",
      "pos": "動詞習慣形",
      "pron": "ダフタダグ"
    }
  }
},
{
  "id": "type_ls_10_1",
  "level": "日常会話",
  "category": "conversations",
  "categoryLabel": "進行時制と可能動詞（〜できる）",
  "textMn": "Та монголоор уншиж ч бас бичиж ч чадах уу?",
  "textJa": "あなたはモンゴル語を読むことも書くこともできますか？",
  "romaji": "Ta mongoloor unshij ch bas bichij ch chadakh uu?",
  "explanation": "並列「-ж ч бас（〜もまた）」＋可能動詞「чадах уу?（できますか？）」。",
  "glossary": {
    "уншиж": {
      "dictForm": "унших",
      "meaning": "読んで",
      "pos": "動詞接続形",
      "pron": "ウンシジ"
    },
    "бичиж": {
      "dictForm": "бичих",
      "meaning": "書いて",
      "pos": "動詞接続形",
      "pron": "ビチジ"
    },
    "чадах уу": {
      "dictForm": "чадах",
      "meaning": "できますか",
      "pos": "助動詞",
      "pron": "チャダホ ウー"
    }
  }
},
{
  "id": "type_ls_10_2",
  "level": "日常会話",
  "category": "conversations",
  "categoryLabel": "進行時制と可能動詞（〜できる）",
  "textMn": "Би дунд сургуульд япон хэл зааж байна.",
  "textJa": "私は中学校で日本語を教えています。",
  "romaji": "Bi dund surguulid yapon khel zaaj baina.",
  "explanation": "「дунд сургууль（中学校）」＋「зааж байна（教えています: 現在進行形）」。隊員の活動紹介の定番です。",
  "glossary": {
    "дунд сургуульд": {
      "dictForm": "дунд сургууль",
      "meaning": "中学校で",
      "pos": "名詞句与位格",
      "pron": "ドゥンド スルグーリド"
    },
    "зааж байна": {
      "dictForm": "заах",
      "meaning": "教えている",
      "pos": "現在進行形",
      "pron": "ザージ バイン"
    }
  }
},
{
  "id": "type_ls_11_1",
  "level": "気候・暮らし",
  "category": "weather_seasons",
  "categoryLabel": "天気・四季・好き嫌い・推量",
  "textMn": "Өнөөдөр тэнгэр сайхан, цэлмэг байна шүү.",
  "textJa": "今日は空が澄み渡って良い天気ですね。",
  "romaji": "Onoodor tenger saikhan, tselmeg baina shuu.",
  "explanation": "「тэнгэр（空・天気）」＋「цэлмэг（晴れた、澄んだ）」＋強調終助詞「шүү（〜ですね）」。",
  "glossary": {
    "өнөөдөр": {
      "dictForm": "өнөөдөр",
      "meaning": "今日",
      "pos": "副詞",
      "pron": "オノーデル"
    },
    "тэнгэр": {
      "dictForm": "тэнгэр",
      "meaning": "空、天",
      "pos": "名詞",
      "pron": "テンゲル"
    },
    "цэлмэг": {
      "dictForm": "цэлмэг",
      "meaning": "晴れている、澄んだ",
      "pos": "形容詞",
      "pron": "ツェルメグ"
    }
  }
},
{
  "id": "type_ls_11_2",
  "level": "気候・暮らし",
  "category": "weather_seasons",
  "categoryLabel": "天気・四季・好き嫌い・推量",
  "textMn": "Маргааш тэнгэр муухайрч, бороо орж магадгүй.",
  "textJa": "明日は天気が崩れて、雨が降るかもしれません。",
  "romaji": "Margaash tenger muukhairch, boroo orj magadgui.",
  "explanation": "可能性・推量「-ж/ч магадгүй（〜かもしれない）」: 「муухайрах（悪化する）」、「бороо орох（雨が降る）」。",
  "glossary": {
    "муухайрч": {
      "dictForm": "муухайрах",
      "meaning": "悪くなって",
      "pos": "動詞接続形",
      "pron": "モーハイリチ"
    },
    "бороо орж": {
      "dictForm": "бороо орох",
      "meaning": "雨が降って",
      "pos": "動詞句接続形",
      "pron": "ボロー オルジ"
    },
    "магадгүй": {
      "dictForm": "магадгүй",
      "meaning": "かもしれない",
      "pos": "推量助詞",
      "pron": "マゲドグイ"
    }
  }
},
{
  "id": "type_ls_12_1",
  "level": "出張・移動",
  "category": "travel_logistics",
  "categoryLabel": "序数詞・日付・手段（造格）",
  "textMn": "Галт тэргээр арван хоёр цаг гаруй явна шүү.",
  "textJa": "列車で12時間以上かかりますよ。",
  "romaji": "Galt tergeer arvan khoyor tsag garui yavna shuu.",
  "explanation": "交通手段の造格「галт тэргээр（列車で）」＋数量の超過「гаруй（〜以上、あまり）」。",
  "glossary": {
    "галт тэргээр": {
      "dictForm": "галт тэрэг",
      "meaning": "列車で",
      "pos": "名詞造格",
      "pron": "ガルト テルゲール"
    },
    "гаруй": {
      "dictForm": "гаруй",
      "meaning": "以上、余り",
      "pos": "接尾副詞",
      "pron": "ガルイ"
    }
  }
},
{
  "id": "type_ls_12_2",
  "level": "出張・移動",
  "category": "travel_logistics",
  "categoryLabel": "序数詞・日付・手段（造格）",
  "textMn": "Долдугаар сарын арван нэгэнд Наадам эхэлнэ, уулзацгаая.",
  "textJa": "7月11日にナーダム祭りが始まります。みんなで会いましょう。",
  "romaji": "Doldugaar saryn arvan negend Naadam ekhelne, uulzatsgaaya.",
  "explanation": "日付「7-р сарын 11-д（7月11日に）」＋全員の意思勧誘「уулзацгаая（みんなで会いましょう: -цгаа⁴＋-я）」。",
  "glossary": {
    "Наадам": {
      "dictForm": "Наадам",
      "meaning": "ナーダム祭り",
      "pos": "固有名詞",
      "pron": "ナーダム"
    },
    "эхэлнэ": {
      "dictForm": "эхлэх",
      "meaning": "始まります",
      "pos": "動詞未来形",
      "pron": "エヘルネ"
    },
    "уулзацгаая": {
      "dictForm": "уулзах",
      "meaning": "みんなで会おう",
      "pos": "動詞共同希求形",
      "pron": "オールザツガーヤ"
    }
  }
},
{
  "id": "type_ls_13_1",
  "level": "移動・手配",
  "category": "travel_logistics",
  "categoryLabel": "願望（-маар байна）と許可・禁止",
  "textMn": "Зуунмод хот хүртэл явах нэг тасалбар авмаар байна.",
  "textJa": "ゾーンモド市まで行く切符を1枚買いたいです。",
  "romaji": "Zuunmod khot khurtel yavakh neg tasalbar avmaar baina.",
  "explanation": "願望の表現「-маар байна（〜したい）」: 「авмаар байна（買いたいです、取りたいです）」。",
  "glossary": {
    "Зуунмод": {
      "dictForm": "Зуунмод",
      "meaning": "ゾーンモド（トゥヴ県都）",
      "pos": "固有名詞",
      "pron": "ゾーンモド"
    },
    "тасалбар": {
      "dictForm": "тасалбар",
      "meaning": "切符、チケット",
      "pos": "名詞",
      "pron": "タサルバル"
    },
    "авмаар байна": {
      "dictForm": "авах",
      "meaning": "買いたい",
      "pos": "願望構文",
      "pron": "アウマール バイン"
    }
  }
},
{
  "id": "type_ls_13_2",
  "level": "移動・手配",
  "category": "travel_logistics",
  "categoryLabel": "願望（-маар байна）と許可・禁止",
  "textMn": "Эндээс такси захиалж болох уу? Болно оо.",
  "textJa": "ここでタクシーを予約できますか？ できますよ。",
  "romaji": "Endees taksi zakhialj bolokh uu? Bolno oo.",
  "explanation": "許可・可能の伺い「-ж болох уу?（〜できますか？）」と肯定の受諾「Болно оо.（いいですよ、できます）」。",
  "glossary": {
    "эндээс": {
      "dictForm": "энд",
      "meaning": "ここから",
      "pos": "指示副詞奪格",
      "pron": "エンデース"
    },
    "захиалж": {
      "dictForm": "захиалах",
      "meaning": "予約して",
      "pos": "動詞接続形",
      "pron": "ザヒャールジ"
    },
    "болно": {
      "dictForm": "болох",
      "meaning": "できます、かまわない",
      "pos": "助動詞",
      "pron": "ボルノ"
    }
  }
},
{
  "id": "type_ls_14_1",
  "level": "宿泊・ホテル",
  "category": "travel_logistics",
  "categoryLabel": "仮定（-вал）と義務（-хгүй бол болохгүй）",
  "textMn": "Нэг хоновол, дөчин таван мянган төгрөг. Паспортоо үзүүлнэ үү.",
  "textJa": "一泊するなら45,000トゥグルグです。パスポートをお見せください。",
  "romaji": "Neg khonovol, dochin tavan myangan togrog. Pasportoo uzuulne uu.",
  "explanation": "仮定形「-вол（〜するなら）」＋丁寧な依頼「-нэ үү（〜してください）」。",
  "glossary": {
    "хоновол": {
      "dictForm": "хонох",
      "meaning": "泊まるなら",
      "pos": "動詞仮定形",
      "pron": "ホノウォル"
    },
    "паспортоо": {
      "dictForm": "паспорт",
      "meaning": "自分の旅券を",
      "pos": "名詞再帰対格",
      "pron": "パスポルトー"
    },
    "үзүүлнэ үү": {
      "dictForm": "үзүүлэх",
      "meaning": "見せてください",
      "pos": "丁寧依頼",
      "pron": "ウズールネ ウー"
    }
  }
},
{
  "id": "type_ls_14_2",
  "level": "宿泊・ホテル",
  "category": "travel_logistics",
  "categoryLabel": "仮定（-вал）と義務（-хгүй бол болохгүй）",
  "textMn": "Үг сайн цээжилбэл, монголоор ярьж сурна.",
  "textJa": "単語をしっかり覚えれば、モンゴル語で話せるようになります。",
  "romaji": "Ug sain tseejilbel, mongoloor yarij surna.",
  "explanation": "子音語幹の仮定「-бэл」: 「цээжилбэл（覚えれば）」＋能力獲得の補助動詞「ярьж сурна（話せるようになる）」。",
  "glossary": {
    "цээжилбэл": {
      "dictForm": "цээжлэх",
      "meaning": "暗記すれば",
      "pos": "動詞仮定形",
      "pron": "ツェージルベル"
    },
    "ярьж сурна": {
      "dictForm": "сурах",
      "meaning": "話せるようになる",
      "pos": "補助動詞構文",
      "pron": "ヤリジ スルナ"
    }
  }
},
{
  "id": "type_ls_14_3",
  "level": "衛生・生活",
  "category": "health_safety",
  "categoryLabel": "仮定（-вал）と義務（-хгүй бол болохгүй）",
  "textMn": "Гэртээ орохдоо гараа угааж, хоолойгоо зайлахгүй бол болохгүй.",
  "textJa": "家に帰ったら手を洗い、うがいをしなければなりません。",
  "romaji": "Gertee orokhdoo garaa ugaaj, khooloigoo zailakhgui bol bolokhgui.",
  "explanation": "時点「орохдоо（帰ったとき）」＋義務「-хгүй бол болохгүй（〜しなければならない）」。現地生活の最重要衛生ルールです。",
  "glossary": {
    "гараа": {
      "dictForm": "гар",
      "meaning": "自分の手を",
      "pos": "名詞再帰対格",
      "pron": "ガラー"
    },
    "хоолойгоо": {
      "dictForm": "хоолой",
      "meaning": "自分の喉を",
      "pos": "名詞再帰対格",
      "pron": "ホーロイゴー"
    },
    "зайлахгүй бол болохгүй": {
      "dictForm": "зайлах",
      "meaning": "ゆすがなければならない",
      "pos": "義務構文",
      "pron": "ザイラフグイ ボル ボロフグイ"
    }
  }
},
{
  "id": "type_ls_15_1",
  "level": "医療・健康",
  "category": "health_safety",
  "categoryLabel": "体調・病気・病院・並列（-аад）",
  "textMn": "Толгой өвдөөд, бас жаахан халуураад байна.",
  "textJa": "頭が痛くて、少し熱もあります。",
  "romaji": "Tolgoi ovdood, bas jaakhan khaluuraad baina.",
  "explanation": "並列複文「-аад⁴（〜して、〜くて）」: 「өвдөөд（痛くて）」＋「халуураад байна（熱が出ている）」。",
  "glossary": {
    "толгой": {
      "dictForm": "толгой",
      "meaning": "頭",
      "pos": "名詞",
      "pron": "トルゴイ"
    },
    "өвдөөд": {
      "dictForm": "өвдөх",
      "meaning": "痛んで",
      "pos": "動詞接続形",
      "pron": "オウドード"
    },
    "халуураад байна": {
      "dictForm": "халуурах",
      "meaning": "熱が出ている",
      "pos": "現在進行形",
      "pron": "ハルーラード バイン"
    }
  }
},
{
  "id": "type_ls_15_2",
  "level": "医療・健康",
  "category": "health_safety",
  "categoryLabel": "体調・病気・病院・並列（-аад）",
  "textMn": "Даараад, ханиад хүрсэн байна. Эмийн сангаас эм аваарай.",
  "textJa": "冷えて風邪をひいてしまいましたね。薬局で薬をもらってください。",
  "romaji": "Daaraad, khaniad khursen baina. Emiin sangaas em avaarai.",
  "explanation": "理由「даараад（冷えて）」＋「ханиад хүрсэн（風邪をひいた）」＋「эмийн сангаас（薬局から）」＋丁寧命令「аваарай（手に入れてください）」。",
  "glossary": {
    "даараад": {
      "dictForm": "даарах",
      "meaning": "冷えて、凍えて",
      "pos": "動詞接続形",
      "pron": "ダーラード"
    },
    "ханиад хүрсэн": {
      "dictForm": "ханиад хүрэх",
      "meaning": "風邪をひいた",
      "pos": "慣用句過去形",
      "pron": "ハニヤド フルセン"
    },
    "эмийн сангаас": {
      "dictForm": "эмийн сан",
      "meaning": "薬局から",
      "pos": "名詞奪格",
      "pron": "エミーン サンガース"
    }
  }
},
{
  "id": "type_ls_16_1",
  "level": "日常会話",
  "category": "conversations",
  "categoryLabel": "理由（учраас / болохоор）と複数形",
  "textMn": "Ханиадны эм уусан учраас өнөөдөр бие сайн байна.",
  "textJa": "風邪薬を飲んだので、今日は体調が良いです。",
  "romaji": "Khaniadny em uusan uchraas onoodor bie sain baina.",
  "explanation": "理由・原因を表す接続詞「учраас（〜ので、〜から）」: 「эм уусан учраас（薬を飲んだので）」＋「бие сайн байна（元気です）」。",
  "glossary": {
    "ханиадны": {
      "dictForm": "ханиад",
      "meaning": "風邪の",
      "pos": "名詞属格",
      "pron": "ハニャドニー"
    },
    "учраас": {
      "dictForm": "учраас",
      "meaning": "〜だから、〜ので",
      "pos": "接続詞",
      "pron": "オチラース"
    },
    "бие": {
      "dictForm": "бие",
      "meaning": "体、体調",
      "pos": "名詞",
      "pron": "ビエ"
    }
  }
},
{
  "id": "type_ls_16_2",
  "level": "日常会話",
  "category": "conversations",
  "categoryLabel": "理由（учраас / болохоор）と複数形",
  "textMn": "Маргааш өглөө эрт гарах учраас одоо унтъя.",
  "textJa": "明日の朝早く出かけるので、もう寝ましょう。",
  "romaji": "Margaash ogloo ert garakh uchraas odoo untya.",
  "explanation": "理由「гарах учраас（出発するので）」＋希求形「унтъя（寝よう、寝ましょう）」。",
  "glossary": {
    "гарах": {
      "dictForm": "гарах",
      "meaning": "出る、出発する",
      "pos": "動詞形動詞",
      "pron": "ガラホ"
    },
    "одоо": {
      "dictForm": "одоо",
      "meaning": "今、もう",
      "pos": "副詞",
      "pron": "オドー"
    },
    "унтъя": {
      "dictForm": "унтах",
      "meaning": "寝ましょう",
      "pos": "動詞希求形",
      "pron": "ウンタヤ"
    }
  }
},
{
  "id": "type_ls_17_1",
  "level": "買い物・市場",
  "category": "shopping_dining",
  "categoryLabel": "買い物・助言（-сан нь дээр）と終助詞",
  "textMn": "Ув улаан, шинэ улаан лооль зарж байна, аваарай.",
  "textJa": "真っ赤で新鮮なトマトを売っていますよ、買っていって！",
  "romaji": "Uv ulaan, shine ulaan looli zarj baina, avaarai.",
  "explanation": "強調形容詞「ув улаан（真っ赤な）」＋「зарж байна（売っています）」＋呼び込み「аваарай（買ってください）」。",
  "glossary": {
    "ув улаан": {
      "dictForm": "улаан",
      "meaning": "真っ赤な",
      "pos": "強調形容詞",
      "pron": "ウヴ ウラーン"
    },
    "улаан лооль": {
      "dictForm": "улаан лооль",
      "meaning": "トマト",
      "pos": "名詞句",
      "pron": "ウラーン ローリ"
    },
    "зарж байна": {
      "dictForm": "зарах",
      "meaning": "売っている",
      "pos": "現在進行形",
      "pron": "ザルジ バイン"
    }
  }
},
{
  "id": "type_ls_17_2",
  "level": "買い物・市場",
  "category": "shopping_dining",
  "categoryLabel": "買い物・助言（-сан нь дээр）と終助詞",
  "textMn": "Яасан үнэтэй юм бэ. Жаахан хямдруулбал, авмаар байна.",
  "textJa": "なんて高いんでしょう。少し安くしてくれるなら買いたいです。",
  "romaji": "Yaasan unetei yum be. Jaakhan khyamdruulbal, avmaar baina.",
  "explanation": "感嘆疑問「Яасан 〜 юм бэ（なんて〜なんだ）」＋仮定「хямдруулбал（値引きしてくれるなら）」＋願望「авмаар байна（買いたいです）」。",
  "glossary": {
    "үнэтэй": {
      "dictForm": "үнэ",
      "meaning": "値段が高い",
      "pos": "形容詞",
      "pron": "ウネテイ"
    },
    "хямдруулбал": {
      "dictForm": "хямдруулах",
      "meaning": "安くしてくれるなら",
      "pos": "動詞仮定形",
      "pron": "ヒャムドロールベル"
    }
  }
},
{
  "id": "type_ls_18_1",
  "level": "食事・食堂",
  "category": "shopping_dining",
  "categoryLabel": "レストラン注文・過去終止形・様態（шиг）",
  "textMn": "Би цангаад байна. Ямар нэг юм идье, би өлсөөд байна.",
  "textJa": "喉が渇きました。何か食べましょう、お腹が空きました。",
  "romaji": "Bi tsangaad baina. Yamar neg yum idye, bi olsood baina.",
  "explanation": "「цангаад байна（喉が渇いている）」＋不定代名詞「ямар нэг юм（何か）」＋希求「идье（食べよう）」＋「өлсөөд байна（お腹が空いている）」。",
  "glossary": {
    "цангаад": {
      "dictForm": "цангах",
      "meaning": "喉が渇いて",
      "pos": "動詞接続形",
      "pron": "ツァンガード"
    },
    "өлсөөд": {
      "dictForm": "өлсөх",
      "meaning": "お腹が空いて",
      "pos": "動詞接続形",
      "pron": "オルソード"
    }
  }
},
{
  "id": "type_ls_18_2",
  "level": "食事・食堂",
  "category": "shopping_dining",
  "categoryLabel": "レストラン注文・過去終止形・様態（шиг）",
  "textMn": "Би таван бууз авна. Төмсний салат нэг тавгийг авъя.",
  "textJa": "ボーズを5個ください。ポテトサラダを一皿ください。",
  "romaji": "Bi tavan buuz avna. Tomsnii salat neg tavgiig avya.",
  "explanation": "レストランでの注文「〜 авна / авъя（〜をください）」、助数詞「нэг таваг（一皿）」の対格「тавгийг」。",
  "glossary": {
    "бууз": {
      "dictForm": "бууз",
      "meaning": "ボーズ（蒸し餃子）",
      "pos": "名詞",
      "pron": "ボーズ"
    },
    "төмсний": {
      "dictForm": "төмс",
      "meaning": "じゃがいもの",
      "pos": "名詞属格",
      "pron": "トムスニー"
    },
    "тавгийг": {
      "dictForm": "таваг",
      "meaning": "皿を",
      "pos": "名詞対格",
      "pron": "タウギイグ"
    }
  }
},
{
  "id": "type_ls_18_3",
  "level": "食事・食堂",
  "category": "shopping_dining",
  "categoryLabel": "レストラン注文・過去終止形・様態（шиг）",
  "textMn": "Айраг шиг амттай болохоор уух дуртай болсон.",
  "textJa": "馬乳酒のような味がするので飲むのが好きになりました。",
  "romaji": "Airag shig amttai bolokhoor uukh durtai bolson.",
  "explanation": "類似・様態「шиг（〜のような）」＋理由「болохоор（〜なので）」＋「уух дуртай болсон（飲むのが好きになった）」。",
  "glossary": {
    "айраг": {
      "dictForm": "айраг",
      "meaning": "アイラグ（馬乳酒）",
      "pos": "名詞",
      "pron": "アイラグ"
    },
    "шиг": {
      "dictForm": "шиг",
      "meaning": "〜のような（様態後置詞）",
      "pos": "後置詞",
      "pron": "シグ"
    },
    "дуртай болсон": {
      "dictForm": "болох",
      "meaning": "好きになった",
      "pos": "慣用句過去形",
      "pron": "ドゥルタイ ボルソン"
    }
  }
}
,
{
  "id": "type_intv_01_1",
  "level": "口述試験対策",
  "category": "interview_prep",
  "categoryLabel": "口述試験: 自己紹介（Өөрийнхөө тухай）",
  "textMn": "Намайг Кахо гэдэг. Би хорин хоёр настай. Би Японоос ирсэн.",
  "textJa": "私の名前はカホです。22歳です。日本から来ました。",
  "romaji": "Namaig Kaho gedeg. Bi khorin khoyor nastai. Bi Yaponoos irsen.",
  "explanation": "口頭試験・面接の冒頭で名乗る最重要フレーズ。「Намайг 〜 гэдэг」「22 настай」「Японоос ирсэн」。",
  "glossary": {
    "намайг": {
      "dictForm": "би",
      "meaning": "私を",
      "pos": "代名詞対格",
      "pron": "ナマイグ"
    },
    "гэдэг": {
      "dictForm": "гэх",
      "meaning": "〜という",
      "pos": "動詞習慣形",
      "pron": "ゲデグ"
    },
    "настай": {
      "dictForm": "нас",
      "meaning": "〜歳の",
      "pos": "名詞+接尾辞",
      "pron": "ナスタイ"
    }
  }
},
{
  "id": "type_intv_01_2",
  "level": "口述試験対策",
  "category": "interview_prep",
  "categoryLabel": "口述試験: 自己紹介（Өөрийнхөө тухай）",
  "textMn": "Би их сургуульд гэмт хэрэг судлал сурсан. Нийгмийн асуудлыг сонирхдог.",
  "textJa": "大学で犯罪学を学びました。社会問題に関心があります。",
  "romaji": "Bi ikh surguulid gemt khereg sudlal sursan. Niigmiin asuudlyg sonirkhdog.",
  "explanation": "専攻分野「гэмт хэрэг судлал（犯罪学：固有モンゴル語）」と関心「нийгмийн асуудлыг сонирхдог（社会問題に興味がある）」。",
  "glossary": {
    "сурсан": {
      "dictForm": "сурах",
      "meaning": "学んだ",
      "pos": "動詞過去形",
      "pron": "スルサン"
    },
    "сонирхдог": {
      "dictForm": "сонирхох",
      "meaning": "興味がある",
      "pos": "動詞習慣形",
      "pron": "ソニルホドグ"
    }
  }
},
{
  "id": "type_intv_02_1",
  "level": "口述試験対策",
  "category": "interview_prep",
  "categoryLabel": "口述試験: 家族（Гэр бүлийнхээ тухай）",
  "textMn": "Манай гэр бүл таван хүнтэй. Эмээ, аав, ээж, ах, би байдаг.",
  "textJa": "私の家族は5人です。祖母、父、母、兄、私がいます。",
  "romaji": "Manai ger bul tavan khuntei. Emee, aav, eej, akh, bi baidag.",
  "explanation": "家族構成を述べる基本構文。「таван хүнтэй（5人家族）」＋家族メンバー。",
  "glossary": {
    "хүнтэй": {
      "dictForm": "хүн",
      "meaning": "〜人いる",
      "pos": "名詞共同格",
      "pron": "フンテイ"
    },
    "эмээ": {
      "dictForm": "эмээ",
      "meaning": "祖母",
      "pos": "名詞",
      "pron": "エメー"
    }
  }
},
{
  "id": "type_intv_02_2",
  "level": "口述試験対策",
  "category": "interview_prep",
  "categoryLabel": "口述試験: 家族（Гэр бүлийнхээ тухай）",
  "textMn": "Миний ах ганцаараа амьдардаг. Би ахтайгаа дотно.",
  "textJa": "私の兄は一人暮らしをしています。私は兄と仲が良いです。",
  "romaji": "Minii akh gantsaaraa amidardag. Bi akhtaigaa dotno.",
  "explanation": "「ганцаараа амьдардаг（一人で暮らしている）」＋「дотно（親しい、仲が良い）」。",
  "glossary": {
    "ганцаараа": {
      "dictForm": "ганцаараа",
      "meaning": "一人で",
      "pos": "副詞",
      "pron": "ガンツァーラー"
    },
    "дотно": {
      "dictForm": "дотно",
      "meaning": "仲が良い、親密な",
      "pos": "形容詞",
      "pron": "ドトノ"
    }
  }
},
{
  "id": "type_intv_03_1",
  "level": "口述試験対策",
  "category": "interview_prep",
  "categoryLabel": "口述試験: 故郷（Төрсөн нутгийнхаа тухай）",
  "textMn": "Сока хот сенбэй гэдэг япон будааны жигнэмгээрээ алдартай.",
  "textJa": "草加市は「せんべい」という日本の米菓で有名です。",
  "romaji": "Soka khot senbei gedeg yapon budaany jignemgeeree aldartai.",
  "explanation": "名物を述べる構文。「жигнэмгээрээ алдартай（お菓子で有名である）」。",
  "glossary": {
    "алдартай": {
      "dictForm": "алдар",
      "meaning": "有名な",
      "pos": "形容詞",
      "pron": "アルダルタイ"
    }
  }
},
{
  "id": "type_intv_04_1",
  "level": "口述試験対策",
  "category": "interview_prep",
  "categoryLabel": "口述試験: 訓練所生活（Нихонмацү）",
  "textMn": "Өдөр бүр өглөө зургаан цаг хагасд босдог. Найман цаг дөчин таван минутад хичээл эхэлдэг.",
  "textJa": "毎朝6時半に起きます。8時45分に授業が始まります。",
  "romaji": "Odor bur ogloo zurgaan tsag khagasd bosdog. Naiman tsag dochin tavan minutad khicheel ekheldeg.",
  "explanation": "訓練所の一日の時間割を述べる習慣動詞文。「босдог（起きる）」「эхэлдэг（始まる）」。",
  "glossary": {
    "босдог": {
      "dictForm": "босох",
      "meaning": "起きる",
      "pos": "動詞習慣形",
      "pron": "ボスドグ"
    },
    "эхэлдэг": {
      "dictForm": "эхлэх",
      "meaning": "始まる",
      "pos": "動詞習慣形",
      "pron": "エヘルデグ"
    }
  }
},
{
  "id": "type_intv_05_1",
  "level": "口述試験対策",
  "category": "interview_prep",
  "categoryLabel": "口述試験: モンゴルでの仕事（Хийх ажил）",
  "textMn": "Би Дорнод аймгийн Чойбалсан хотод ажиллах гэж байна.",
  "textJa": "私はドルノド県のチョイバルサン市で活動する予定です。",
  "romaji": "Bi Dornod aimgiin Choibalsan khotod ajillakh gej baina.",
  "explanation": "配属先と近接未来「-х гэж байна（〜する予定です）」。",
  "glossary": {
    "Дорнод": {
      "dictForm": "Дорнод",
      "meaning": "ドルノド（東部県）",
      "pos": "固有名詞",
      "pron": "ドルノド"
    },
    "Чойбалсан": {
      "dictForm": "Чойбалсан",
      "meaning": "チョイバルサン（ドルノド県都）",
      "pos": "固有名詞",
      "pron": "チョイバルサン"
    }
  }
},
{
  "id": "type_intv_05_2",
  "level": "口述試験対策",
  "category": "interview_prep",
  "categoryLabel": "口述試験: モンゴルでの仕事（Хийх ажил）",
  "textMn": "Миний ажил хүүхэд, залуучуудын хөгжилд туслах юм.",
  "textJa": "私の仕事は子どもや青少年の成長・発達を支援することです。",
  "romaji": "Minii ajil khuukhed, zaluuchuudyn khogjild tuslakh yum.",
  "explanation": "職種（青少年活動）のミッションを述べる表現。「хөгжилд туслах（成長を支援する）」。",
  "glossary": {
    "хөгжил": {
      "dictForm": "хөгжил",
      "meaning": "成長、発達",
      "pos": "名詞",
      "pron": "ホグジル"
    },
    "туслах": {
      "dictForm": "туслах",
      "meaning": "助ける、支援する",
      "pos": "動詞形動詞",
      "pron": "スラホ"
    }
  }
},
{
  "id": "type_intv_06_1",
  "level": "口述試験対策",
  "category": "interview_prep",
  "categoryLabel": "口述試験: 休日にしたいこと（Амралтын өдөр）",
  "textMn": "Би бууз, хуушуур хийж, морь унаж үзмээр байна.",
  "textJa": "ボーズやホーショールを作り、馬に乗ってみたいです。",
  "romaji": "Bi buuz, khuushuur khiij, mori unaj uzmeer baina.",
  "explanation": "休日の願望構文。「морь унаж үзмээр байна（馬に乗ってみたい）」。",
  "glossary": {
    "унаж": {
      "dictForm": "унах",
      "meaning": "乗って",
      "pos": "動詞接続形",
      "pron": "オナジ"
    },
    "үзмээр байна": {
      "dictForm": "үзэх",
      "meaning": "〜してみたい",
      "pos": "願望構文",
      "pron": "ウズメール バイン"
    }
  }
},
{
  "id": "type_intv_07_1",
  "level": "口述試験対策",
  "category": "interview_prep",
  "categoryLabel": "口述試験: 協力隊（ЖАЙКА-ийн тухай）",
  "textMn": "ЖАЙКА 1974 онд байгуулагдсан. 1992 оноос Монголд ажиллаж эхэлсэн.",
  "textJa": "海外協力隊（ЖАЙКА）は1974年に設立され、1992年からモンゴルで活動を始めました。",
  "romaji": "JAIKA 1974 ond baiguulagdsan. 1992 onoos Mongold ajillaj ekhelsen.",
  "explanation": "ЖАЙКА（海外協力隊）の歴史的事実の数値。「1974 онд байгуулагдсан」「1992 оноос эхэлсэн」。",
  "glossary": {
    "байгуулагдсан": {
      "dictForm": "байгуулагдах",
      "meaning": "設立された",
      "pos": "動詞受動過去形",
      "pron": "バイグーラグドサン"
    }
  }
},
{
  "id": "type_intv_07_2",
  "level": "口述試験対策",
  "category": "interview_prep",
  "categoryLabel": "口述試験: 協力隊（ЖАЙКА-ийн тухай）",
  "textMn": "2024 оны тавдугаар сарын эцсээр нийт 758 сайн дурын гишүүн Монголд ажиллаж байсан.",
  "textJa": "2024年5月末時点で累計758人の隊員がモンゴルで活動しました。",
  "romaji": "2024 ony tavdugaar saryn etsseer niit 758 sain duryn gishuun Mongold ajillaj baisan.",
  "explanation": "「нийт 758 сайн дурын гишүүн（累計758名のボランティア隊員）」。",
  "glossary": {
    "нийт": {
      "dictForm": "нийт",
      "meaning": "合計、全体、累計",
      "pos": "副詞",
      "pron": "ニート"
    }
  }
},
{
  "id": "type_intv_08_1",
  "level": "口述試験対策",
  "category": "interview_prep",
  "categoryLabel": "口述試験: 病院（Эмнэлэгт）",
  "textMn": "Миний толгой өвдөж байна. Өчигдрөөс эхэлж өвдсөн.",
  "textJa": "私の頭が痛いです。昨日から痛み始めました。",
  "romaji": "Minii tolgoi ovdoj baina. Ochigdroos ekhelj ovdson.",
  "explanation": "病院での症状説明。「өчигдрөөс（昨日から）」＋「өвдөж байна（痛んでいます）」。",
  "glossary": {
    "толгой": {
      "dictForm": "толгой",
      "meaning": "頭",
      "pos": "名詞",
      "pron": "トルゴイ"
    },
    "өвдөж": {
      "dictForm": "өвдөх",
      "meaning": "痛んで",
      "pos": "動詞接続形",
      "pron": "オウドジ"
    }
  }
},
{
  "id": "type_intv_09_1",
  "level": "口述試験対策",
  "category": "interview_prep",
  "categoryLabel": "口述試験: お店で買い物（Дэлгүүрт）",
  "textMn": "Арай хямдхан зүйл байна уу? За, үүнийг авъя.",
  "textJa": "もう少し安いものはありますか？ では、これをください。",
  "romaji": "Arai khyamdkhan zuil baina uu? Za, uuniig avya.",
  "explanation": "「арай хямдхан（もう少し安い）」＋「үүнийг авъя（これを買います）」。",
  "glossary": {
    "хямдхан": {
      "dictForm": "хямд",
      "meaning": "安い",
      "pos": "形容詞",
      "pron": "ヒャムドハン"
    },
    "авъя": {
      "dictForm": "авах",
      "meaning": "買おう、ください",
      "pos": "動詞希求形",
      "pron": "アウヤ"
    }
  }
},
{
  "id": "type_intv_10_1",
  "level": "口述試験対策",
  "category": "interview_prep",
  "categoryLabel": "口述試験: 薬局（Эмийн санд）",
  "textMn": "Толгойны эм байна уу? Өдөрт гурван удаа хоолны дараа уугаарай.",
  "textJa": "頭痛薬はありますか？ 1日3回、食後に飲んでください。",
  "romaji": "Tolgoiny em baina uu? Odort gurvan udaa khoolny daraa uugaarai.",
  "explanation": "薬局での用法確認。「өдөрт гурван удаа（1日3回）」「хоолны дараа（食後）」。",
  "glossary": {
    "өдөрт": {
      "dictForm": "өдөр",
      "meaning": "1日に",
      "pos": "名詞与位格",
      "pron": "オドルト"
    },
    "удаа": {
      "dictForm": "удаа",
      "meaning": "回、度",
      "pos": "名詞",
      "pron": "オダー"
    }
  }
},
{
  "id": "type_intv_11_1",
  "level": "口述試験対策",
  "category": "interview_prep",
  "categoryLabel": "口述試験: ホテル宿泊（Зочид буудалд）",
  "textMn": "Сул өрөө байна уу? Нэг хоногт хэдэн төгрөг вэ?",
  "textJa": "空き部屋はありますか？ 1泊いくらですか？",
  "romaji": "Sul oroo baina uu? Neg khonogt kheden togrog ve?",
  "explanation": "ホテルでの空室と料金の確認。「сул өрөө（空き部屋）」「нэг хоногт（1泊で）」。",
  "glossary": {
    "сул": {
      "dictForm": "сул",
      "meaning": "空いている",
      "pos": "形容詞",
      "pron": "スル"
    },
    "хоногт": {
      "dictForm": "хоног",
      "meaning": "泊に、一昼夜に",
      "pos": "名詞与位格",
      "pron": "ホノグト"
    }
  }
},
{
  "id": "type_intv_12_1",
  "level": "口述試験対策",
  "category": "interview_prep",
  "categoryLabel": "口述試験: レストラン注文（Ресторанд）",
  "textMn": "Таван бууз, нэг таваг нийслэл салат авъя. Сүүтэй цай ууна.",
  "textJa": "ボーズを5個、首都サラダを一皿ください。ミルクティーを飲みます。",
  "romaji": "Tavan buuz, neg tavag niislel salat avya. Suutei tsai uuna.",
  "explanation": "レストランでの注文。「нийслэл салат（ポテトサラダ）」「сүүтэй цай（ミルクティー）」。",
  "glossary": {
    "нийслэл": {
      "dictForm": "нийслэл",
      "meaning": "首都",
      "pos": "名詞",
      "pron": "ニースレル"
    },
    "сүүтэй": {
      "dictForm": "сүү",
      "meaning": "ミルク入りの",
      "pos": "名詞共同格",
      "pron": "スーテイ"
    }
  }
},
{
  "id": "type_intv_13_1",
  "level": "口述試験対策",
  "category": "interview_prep",
  "categoryLabel": "口述試験: 切符売り場（Тасалбар авах газар）",
  "textMn": "Дархан хот хүртэл галт тэрэгний нэг тасалбар авмаар байна.",
  "textJa": "ダルハン市までの列車切符を1枚買いたいです。",
  "romaji": "Darkhan khot khurtel galt teregnii neg tasalbar avmaar baina.",
  "explanation": "窓口での切符購入願望。「хүртэл（〜まで）」＋「галт тэрэгний тасалбар（列車切符）」。",
  "glossary": {
    "галт тэрэг": {
      "dictForm": "галт тэрэг",
      "meaning": "列車",
      "pos": "名詞句",
      "pron": "ガルト テルグ"
    },
    "тасалбар": {
      "dictForm": "тасалбар",
      "meaning": "切符",
      "pos": "名詞",
      "pron": "タサルバル"
    }
  }
}
,
  // --- 教科書例文（全18課）---
  {
    "id": "tb_type_l1_tb_1_1",
    "level": "第1課",
    "category": "textbook",
    "categoryLabel": "教科書例文（第1課）",
    "lesson": 1,
    "lessonTitle": "第１課 挨拶（Мэндчилгээ）",
    "textMn": "Сайн байна уу?",
    "textJa": "こんにちは。（お元気ですか。）",
    "romaji": "",
    "source": "教科書 第１課 挨拶（Мэндчилгээ）",
    "explanation": "モンゴル語で最も一般的な挨拶表現。文字通りには「良いですか？（お元気ですか）」の意味です。初対面でも親しい間柄でも幅広く使われます。"
  },
  {
    "id": "tb_type_l1_tb_1_2",
    "level": "第1課",
    "category": "textbook",
    "categoryLabel": "教科書例文（第1課）",
    "lesson": 1,
    "lessonTitle": "第１課 挨拶（Мэндчилгээ）",
    "textMn": "Сайн, сайн байна уу?",
    "textJa": "元気です、こんにちは。（お元気ですか。）",
    "romaji": "",
    "source": "教科書 第１課 挨拶（Мэндчилгээ）",
    "explanation": "「Сайн байна уу?」に対する標準的な返答。「Сайн（良い、元気）」と答えた上で、相手に対しても「お元気ですか」と問い返します。"
  },
  {
    "id": "tb_type_l1_tb_1_3",
    "level": "第1課",
    "category": "textbook",
    "categoryLabel": "教科書例文（第1課）",
    "lesson": 1,
    "lessonTitle": "第１課 挨拶（Мэндчилгээ）",
    "textMn": "Танилцсандаа баяртай байна.",
    "textJa": "お会い出来て嬉しいです。（お知り合いになれて光栄です。）",
    "romaji": "",
    "source": "教科書 第１課 挨拶（Мэндчилгээ）",
    "explanation": "初対面の挨拶。「танилцах（知り合う）」＋既定過去・形動詞語尾「-сан」＋与位格「-д」＋再帰所有語尾「-аа」＋「баяртай байна（嬉しいです）」という文構造です。"
  },
  {
    "id": "tb_type_l1_tb_1_4",
    "level": "第1課",
    "category": "textbook",
    "categoryLabel": "教科書例文（第1課）",
    "lesson": 1,
    "lessonTitle": "第１課 挨拶（Мэндчилгээ）",
    "textMn": "Сайхан танилцлаа.",
    "textJa": "お会い出来て良かったです。（初めまして。）",
    "romaji": "",
    "source": "教科書 第１課 挨拶（Мэндчилгээ）",
    "explanation": "「сайхан（美しく、素晴らしく）」＋動詞「танилцах（知り合う）」の終止形過去「-лаа」。「良い出会いができました」という丁寧な初対面の挨拶です。"
  },
  {
    "id": "tb_type_l1_tb_1_5",
    "level": "第1課",
    "category": "textbook",
    "categoryLabel": "教科書例文（第1課）",
    "lesson": 1,
    "lessonTitle": "第１課 挨拶（Мэндчилгээ）",
    "textMn": "Би япон хүн. Таны нэр хэн бэ?",
    "textJa": "私は日本人です。あなたのお名前は何ですか。",
    "romaji": "",
    "source": "教科書 第１課 挨拶（Мэндчилгээ）",
    "explanation": "コピュラ文（AはBである）は「Би япон хүн（主語＋述語名詞）」を並べるだけです。疑問詞「хэн（誰）」を伴う疑問文には疑問助詞「бэ」を用います。"
  },
  {
    "id": "tb_type_l1_tb_1_6",
    "level": "第1課",
    "category": "textbook",
    "categoryLabel": "教科書例文（第1課）",
    "lesson": 1,
    "lessonTitle": "第１課 挨拶（Мэндчилгээ）",
    "textMn": "Золбоо: Сайн байна уу? Такэши: Сайн, сайн байна уу? Золбоо: Миний нэр Золбоо. Би багш биш, оюутан. Таны нэр хэн бэ? Такэши: Миний нэр Такэши. Би япон хүн.",
    "textJa": "ゾルボー: こんにちは。 たけし: 元気です、こんにちは。 ゾルボー: 私の名前はゾルボーです。私は先生ではなく学生です。あなたのお名前は何ですか？ たけし: 私の名前はたけしです。私は日本人です。",
    "romaji": "",
    "source": "教科書 第１課 挨拶（Мэндчилгээ）",
    "explanation": "第1課の基本会話。自己紹介、コピュラ文の肯定文・否定文（〜 биш）、疑問詞疑問文（〜 хэн бэ?）を網羅した実践的な対話です。"
  },
  {
    "id": "tb_type_l1_tb_1_7",
    "level": "第1課",
    "category": "textbook",
    "categoryLabel": "教科書例文（第1課）",
    "lesson": 1,
    "lessonTitle": "第１課 挨拶（Мэндчилгээ）",
    "textMn": "Сайн байцгаана уу? Миний нэр Такэши. Би 26 настай. Би Японоос ирсэн. Би багш биш, оюутан. Монголд ирсэндээ маш их баяртай байна. Сайхан танилцлаа.",
    "textJa": "皆さんこんにちは。私の名前はたけしです。26歳です。日本から来ました。先生ではなく学生です。モンゴルに来られて大変嬉しいです。お会い出来て光栄です。",
    "romaji": "",
    "source": "教科書 第１課 挨拶（Мэндчилгээ）",
    "explanation": "第1課の表現を組み合わせた自己紹介スピーチ。複数人への挨拶「Сайн байцгаана уу?」、年齢表現、奪格「Японоос（日本から）」を含みます。"
  },
  {
    "id": "tb_type_l2_tb_2_1",
    "level": "第2課",
    "category": "textbook",
    "categoryLabel": "教科書例文（第2課）",
    "lesson": 2,
    "lessonTitle": "第２課 これは何ですか（Энэ юу вэ?）",
    "textMn": "Энэ юу вэ?",
    "textJa": "これは何ですか。",
    "romaji": "",
    "source": "教科書 第２課 これは何ですか（Энэ юу вэ?）",
    "explanation": "指示代名詞「энэ（これ）」＋疑問代名詞「юу（何）」＋疑問助詞「вэ」。「юу」は鼻音（н, м, в）で終わらないため、疑問助詞「вэ」が付きます。"
  },
  {
    "id": "tb_type_l2_tb_2_2",
    "level": "第2課",
    "category": "textbook",
    "categoryLabel": "教科書例文（第2課）",
    "lesson": 2,
    "lessonTitle": "第２課 これは何ですか（Энэ юу вэ?）",
    "textMn": "Энэ сонин, тэр ном.",
    "textJa": "これは新聞で、それは本です。",
    "romaji": "",
    "source": "教科書 第２課 これは何ですか（Энэ юу вэ?）",
    "explanation": "近称指示代名詞「энэ（これ）」と中称指示代名詞「тэр（それ・あれ）」の対比。コピュラ動詞を使わずに名詞を並べるだけで文が成立します。"
  },
  {
    "id": "tb_type_l2_tb_2_3",
    "level": "第2課",
    "category": "textbook",
    "categoryLabel": "教科書例文（第2課）",
    "lesson": 2,
    "lessonTitle": "第２課 これは何ですか（Энэ юу вэ?）",
    "textMn": "Энд самбар байна уу? Тийм ээ, байна.",
    "textJa": "ここに黒板はありますか。はい、あります。",
    "romaji": "",
    "source": "教科書 第２課 これは何ですか（Энэ юу вэ?）",
    "explanation": "存在文の疑問形。「энд（ここに）」＋主語＋存在動詞「байна（ある・いる）」＋疑問助詞「уу」。Yes/No疑問文には「уу/үү」が付きます（байнаの末尾は短母音語幹のためуу）。"
  },
  {
    "id": "tb_type_l2_tb_2_4",
    "level": "第2課",
    "category": "textbook",
    "categoryLabel": "教科書例文（第2課）",
    "lesson": 2,
    "lessonTitle": "第２課 これは何ですか（Энэ юу вэ?）",
    "textMn": "Золбоо: Энэ юу вэ? Такэши: Энэ толь бичиг. Золбоо: Тэр дэвтэр үү? Такэши: Үгүй ээ, энэ дэвтэр биш, ном.",
    "textJa": "ゾルボー: これは辞書ですか？ たけし: これは辞書です。 ゾルボー: それはノートですか？ たけし: いいえ、これはノートではなく本です。",
    "romaji": "",
    "source": "教科書 第２課 これは何ですか（Энэ юу вэ?）",
    "explanation": "「толь бичиг（辞書）」や「дэвтэр（ノート）」を用いた会話。女性語「дэвтэр」に対するYes/No疑問助詞「үү」の接続と、否定「〜 биш」の応答です。"
  },
  {
    "id": "tb_type_l2_tb_2_5",
    "level": "第2課",
    "category": "textbook",
    "categoryLabel": "教科書例文（第2課）",
    "lesson": 2,
    "lessonTitle": "第２課 これは何ですか（Энэ юу вэ?）",
    "textMn": "Манай ангид хоёр том самбар, олон ширээ, сандал байна. Энд толь бичиг, дэвтэр, харандаа байгаа. Тэнд зурагт, компьютер байна уу? Тийм ээ, бүгд байна.",
    "textJa": "私たちの教室には2つの大きな黒板、たくさんの机、椅子があります。ここに辞書、ノート、鉛筆があります。あそこにテレビやパソコンはありますか？はい、すべてあります。",
    "romaji": "",
    "source": "教科書 第２課 これは何ですか（Энэ юу вэ?）",
    "explanation": "教室内の物と設備を説明する長文。「манай（私たちの）」、「хоёр（2つの）」、「олон（たくさんの）」、「бүгд（すべて）」という数量・状態語を含みます。"
  },
  {
    "id": "tb_type_l3_tb_3_1",
    "level": "第3課",
    "category": "textbook",
    "categoryLabel": "教科書例文（第3課）",
    "lesson": 3,
    "lessonTitle": "第３課 私はボランティアです（Би сайн дурын ажилтан）",
    "textMn": "Би Японы Токио хотоос ирсэн.",
    "textJa": "私は日本の東京市から来ました。",
    "romaji": "",
    "source": "教科書 第３課 私はボランティアです（Би сайн дурын ажилтан）",
    "explanation": "出身を表す起点奪格「-оос4」。男性長母音・二重母音の語幹「хот（都市）」に奪格助詞「-оос」が接続して「хотоос（〜から）」となります。「ирсэн」は動詞「ирэх（来る）」の既定過去形。"
  },
  {
    "id": "tb_type_l3_tb_3_2",
    "level": "第3課",
    "category": "textbook",
    "categoryLabel": "教科書例文（第3課）",
    "lesson": 3,
    "lessonTitle": "第３課 私はボランティアです（Би сайн дурын ажилтан）",
    "textMn": "Би хорин зургаан настай. Та хэдэн настай вэ?",
    "textJa": "私は26歳です。あなたは何歳ですか。",
    "romaji": "",
    "source": "教科書 第３課 私はボランティアです（Би сайн дурын ажилтан）",
    "explanation": "年齢の表現。「хорин зургаа（26）」＋「-н（隠れン）」＋「настай（歳である）」。疑問詞「хэдэн（いくつかの・何人の）」を用いた年齢の質問には「вэ」が付きます。"
  },
  {
    "id": "tb_type_l3_tb_3_3",
    "level": "第3課",
    "category": "textbook",
    "categoryLabel": "教科書例文（第3課）",
    "lesson": 3,
    "lessonTitle": "第３課 私はボランティアです（Би сайн дурын ажилтан）",
    "textMn": "Болд: Та хаанаас ирсэн бэ? Такэши: Би Японоос ирсэн. Болд: Та хэзээ Монголд ирсэн бэ? Такэши: Би өнгөрсөн долоо хоногт ирсэн.",
    "textJa": "ボルド: あなたはどこから来ましたか？ たけし: 私は日本から来ました。 ボルド: いつモンゴルに来ましたか？ たけし: 先週来ました。",
    "romaji": "",
    "source": "教科書 第３課 私はボランティアです（Би сайн дурын ажилтан）",
    "explanation": "疑問詞「хаанаас（どこから）」、「хэзээ（いつ）」を用いた過去の来訪に関する対話。「өнгөрсөн долоо хоногт（先週に）」という時を表す与位格副詞句がポイントです。"
  },
  {
    "id": "tb_type_l3_tb_3_4",
    "level": "第3課",
    "category": "textbook",
    "categoryLabel": "教科書例文（第3課）",
    "lesson": 3,
    "lessonTitle": "第３課 私はボランティアです（Би сайн дурын ажилтан）",
    "textMn": "Сайн байна уу? Намайг Такэши гэдэг. Би Японоос ирсэн сайн дурын гишүүн. Би 26 настай. Монголын уламжлалт соёл, түүхийг судлахаар ирсэн. Монгол хэл их сонирхолтой байна.",
    "textJa": "こんにちは。私の名前はたけしと言います。日本から来たボランティア隊員です。26歳です。モンゴルの伝統文化と歴史を研究するために来ました。モンゴル語は大変面白いです。",
    "romaji": "",
    "source": "教科書 第３課 私はボランティアです（Би сайн дурын ажилтан）",
    "explanation": "派遣隊員の自己紹介文。「Намайг ... гэдэг（私を〜という）」、「судлахаар（研究するために：目的の造格）」、「сонирхолтой（興味深い）」などの重要語彙を含みます。"
  },
  {
    "id": "tb_type_l4_tb_4_1",
    "level": "第4課",
    "category": "textbook",
    "categoryLabel": "教科書例文（第4課）",
    "lesson": 4,
    "lessonTitle": "第４課 私は日本語の先生です（Би япон хэлний багш）",
    "textMn": "Би сургуулийн япон хэлний багш.",
    "textJa": "私は学校の日本語の先生です。",
    "romaji": "",
    "source": "教科書 第４課 私は日本語の先生です（Би япон хэлний багш）",
    "explanation": "名詞属格（所有格）の重なり。「сургууль（学校）」の属格「сургуулийн（学校の）」＋「япон хэл（日本語）」の属格「япон хэлний（日本語の）」＋「багш（先生）」。"
  },
  {
    "id": "tb_type_l4_tb_4_2",
    "level": "第4課",
    "category": "textbook",
    "categoryLabel": "教科書例文（第4課）",
    "lesson": 4,
    "lessonTitle": "第４課 私は日本語の先生です（Би япон хэлний багш）",
    "textMn": "Ном ширээн дээр байна. Цүнх сандал доор байна.",
    "textJa": "本は机の上にあります。鞄は椅子の下にあります。",
    "romaji": "",
    "source": "教科書 第４課 私は日本語の先生です（Би япон хэлний багш）",
    "explanation": "位置を表す後置詞句。「дээр（上に）」、「доор（下に）」。「ширээ（机）」に与位格・奪格が接続する形（ширээн дээр）で位置を示します。"
  },
  {
    "id": "tb_type_l4_tb_4_3",
    "level": "第4課",
    "category": "textbook",
    "categoryLabel": "教科書例文（第4課）",
    "lesson": 4,
    "lessonTitle": "第４課 私は日本語の先生です（Би япон хэлний багш）",
    "textMn": "Сувдаа: Та япон хүн үү? Такэши: Тийм ээ, би япон хүн. Таны ном хаана байна вэ? Сувдаа: Миний ном ширээн дээр байна.",
    "textJa": "スヴダー: あなたは日本人ですか？ たけし: はい、日本人です。あなたの本はどこにありますか？ スヴダー: 私の本は机の上にあります。",
    "romaji": "",
    "source": "教科書 第４課 私は日本語の先生です（Би япон хэлний багш）",
    "explanation": "相手の身元確認と、物の位置を尋ねる会話。名詞「хүн」への疑問助詞「үү」、疑問詞「хаана（どこ）」＋「вэ」の使い分けが身につきます。"
  },
  {
    "id": "tb_type_l4_tb_4_4",
    "level": "第4課",
    "category": "textbook",
    "categoryLabel": "教科書例文（第4課）",
    "lesson": 4,
    "lessonTitle": "第４課 私は日本語の先生です（Би япон хэлний багш）",
    "textMn": "Манай багшийн өрөө хоёрдугаар давхарт байдаг. Өрөөний цонхны дэргэд том ширээ байгаа. Ширээн дээр толь бичиг, сурах бичиг, олон дэвтэр байна. Компьютер ширээний баруун талд байрладаг.",
    "textJa": "私たちの職員室は2階にあります。部屋の窓のそばに大きな机があります。机の上には辞書、教科書、たくさんのノートがあります。パソコンは机の右側に置かれています。",
    "romaji": "",
    "source": "教科書 第４課 私は日本語の先生です（Би япон хэлний багш）",
    "explanation": "部屋の配置や位置関係を詳細に描写する文章。「давхарт（階に）」、「дэргэд（そばに）」、「баруун талд（右側に）」などの空間方位表現を学びます。"
  },
  {
    "id": "tb_type_l5_tb_5_1",
    "level": "第5課",
    "category": "textbook",
    "categoryLabel": "教科書例文（第5課）",
    "lesson": 5,
    "lessonTitle": "第５課 今日は何をしますか（Өнөөдөр юу хийх вэ?）",
    "textMn": "Би өнөөдөр найзтайгаа хамт кино үзнэ.",
    "textJa": "私は今日友達と一緒に映画を見ます。",
    "romaji": "",
    "source": "教科書 第５課 今日は何をしますか（Өнөөдөр юу хийх вэ?）",
    "explanation": "動詞未来形「-на4」と共同格「-той4」＋再帰所有「-гаа」。「үзэх（見る）」の男性語幹「үз-」に女性母音未来語尾「-нэ」が付き「үзнэ」となります。"
  },
  {
    "id": "tb_type_l5_tb_5_2",
    "level": "第5課",
    "category": "textbook",
    "categoryLabel": "教科書例文（第5課）",
    "lesson": 5,
    "lessonTitle": "第５課 今日は何をしますか（Өнөөдөр юу хийх вэ?）",
    "textMn": "Чи маргааш номын санд очно уу? Үгүй, очихгүй.",
    "textJa": "君は明日図書館に行きますか？いいえ、行きません。",
    "romaji": "",
    "source": "教科書 第５課 今日は何をしますか（Өнөөдөр юу хийх вэ?）",
    "explanation": "動詞未来疑問文と否定文。「очих（行く）」＋「-но уу」（男性母音語）で「行きますか？」、否定は形動詞形「очих」＋「-гүй」で「行かない」となります。"
  },
  {
    "id": "tb_type_l5_tb_5_3",
    "level": "第5課",
    "category": "textbook",
    "categoryLabel": "教科書例文（第5課）",
    "lesson": 5,
    "lessonTitle": "第５課 今日は何をしますか（Өнөөдөр юу хийх вэ?）",
    "textMn": "Юми: Баяр аа, чи өнөөдөр юу хийх вэ? Баяр: Ажлын хамтрагчтайгаа хамт өдрийн хоол иднэ. Юми: Хаана идэх вэ? Баяр: Монгол зоогийн газарт иднэ.",
    "textJa": "ユミ: バヤル、今日何をするの？ バヤル: 同僚と一緒に昼ご飯を食べるよ。 ユミ: どこで食べるの？ バヤル: モンゴル料理レストランで食べるよ。",
    "romaji": "",
    "source": "教科書 第５課 今日は何をしますか（Өнөөдөр юу хийх вэ?）",
    "explanation": "親しい間柄での予定を尋ねる日常対話。呼格「Баяр аа」、目的格・与位格の場所「зоогийн газарт（レストランで）」の使い方が明確です。"
  },
  {
    "id": "tb_type_l5_tb_5_4",
    "level": "第5課",
    "category": "textbook",
    "categoryLabel": "教科書例文（第5課）",
    "lesson": 5,
    "lessonTitle": "第５課 今日は何をしますか（Өнөөдөр юу хийх вэ?）",
    "textMn": "Өнөөдөр хагас сайн өдөр тул би өглөө эрт босно. Дараа нь зах руу явж шинэ ногоо, мах авна. Өдөр гэртээ амттай хоол хийнэ. Орой найзуудтайгаа уулзаж ярилцана.",
    "textJa": "今日は土曜日なので、私は朝早く起きます。その後、市場へ行って新鮮な野菜とお肉を買います。昼は家で美味しい料理を作ります。夜は友達と会っておしゃべりをします。",
    "romaji": "",
    "source": "教科書 第５課 今日は何をしますか（Өнөөдөр юу хийх вэ?）",
    "explanation": "休日のスケジュールを描いた一連の行動文。「хагас сайн өдөр（土曜日）」、「эрт босох（早起きする）」、「зах руу（市場へ）」など生活必須表現が満載です。"
  },
  {
    "id": "tb_type_l6_tb_6_1",
    "level": "第6課",
    "category": "textbook",
    "categoryLabel": "教科書例文（第6課）",
    "lesson": 6,
    "lessonTitle": "第６課 教室に大きい黒板があります（Ангид том самбар байна）",
    "textMn": "Багш аа, самбар дээр бичсэн үгийг сайн хараарай.",
    "textJa": "先生、黒板に書かれた言葉をよく見てください。",
    "romaji": "",
    "source": "教科書 第６課 教室に大きい黒板があります（Ангид том самбар байна）",
    "explanation": "丁寧な助言・依頼・命令の語尾「-аарай4」。「харах（見る）」の語幹「хар-」に男性母音語尾「-аарай」が接続し「хараарай（見てくださいね）」となります。"
  },
  {
    "id": "tb_type_l6_tb_6_2",
    "level": "第6課",
    "category": "textbook",
    "categoryLabel": "教科書例文（第6課）",
    "lesson": 6,
    "lessonTitle": "第６課 教室に大きい黒板があります（Ангид том самбар байна）",
    "textMn": "Оюутнууд өдөр бүр шинэ үг цээжилдэг.",
    "textJa": "学生たちは毎日新しい単語を暗記します。",
    "romaji": "",
    "source": "教科書 第６課 教室に大きい黒板があります（Ангид том самбар байна）",
    "explanation": "習慣・反復を表す動詞形動詞語尾「-даг4」。「цээжлэх（暗記する）」の語幹「цээжил-」に女性母音語尾「-дэг」が付き「цээжилдэг（暗記する習慣がある）」となります。"
  },
  {
    "id": "tb_type_l6_tb_6_3",
    "level": "第6課",
    "category": "textbook",
    "categoryLabel": "教科書例文（第6課）",
    "lesson": 6,
    "lessonTitle": "第６課 教室に大きい黒板があります（Ангид том самбар байна）",
    "textMn": "Багш: Энэ манай анги. Энд том самбар, олон ширээ сандал байгаа. Зориг: Тэр юу вэ, багш аа? Багш: Тэр бол номын шүүгээ. Та нар номоо энд тавиарай.",
    "textJa": "先生: これが私たちの教室です。ここに大きな黒板、たくさんの机と椅子があります。 ゾリグ: あれは何ですか、先生？ 先生: あれは本棚です。皆さんは本をここに置いてくださいね。",
    "romaji": "",
    "source": "教科書 第６課 教室に大きい黒板があります（Ангид том самбар байна）",
    "explanation": "教室内のルールと設備の説明。強意の繋ぎ言葉「бол（〜は）」や依頼語尾「тавиарай（置いてください）」を学習します。"
  },
  {
    "id": "tb_type_l6_tb_6_4",
    "level": "第6課",
    "category": "textbook",
    "categoryLabel": "教科書例文（第6課）",
    "lesson": 6,
    "lessonTitle": "第６課 教室に大きい黒板があります（Ангид том самбар байна）",
    "textMn": "Манай сургуулийн хичээлийн анги танхим маш саруулхан, цэвэрхэн байдаг. Самбарын урд багшийн ширээ, хойно нь оюутнуудын суудал байрлана. Оюутан бүр хичээлдээ анхааралтай суудаг.",
    "textJa": "私たちの学校の教室はとても明るく清潔です。黒板の前には先生の机、後ろには学生の席が配置されています。どの学生も授業に熱心に出席します。",
    "romaji": "",
    "source": "教科書 第６課 教室に大きい黒板があります（Ангид том самбар байна）",
    "explanation": "学習環境を表現する描写文。「саруулхан（明るく広々とした）」、「анхааралтай（注意深く、熱心に）」などの形容詞・副詞表現が豊富です。"
  },
  {
    "id": "tb_type_l7_tb_7_1",
    "level": "第7課",
    "category": "textbook",
    "categoryLabel": "教科書例文（第7課）",
    "lesson": 7,
    "lessonTitle": "第７課 私の家族（Манай гэр бүл）",
    "textMn": "Манай гэр бүл тавуулаа.",
    "textJa": "私たちの家族は5人家族です。",
    "romaji": "",
    "source": "教科書 第７課 私の家族（Манай гэр бүл）",
    "explanation": "集合数詞語尾「-уул2/-үүл2」。「тав（5）」に集合数詞語尾「-уул」と再帰所有「-аа」が付き、「тавуулаа（5人揃って、5人で）」という意味を表します。"
  },
  {
    "id": "tb_type_l7_tb_7_2",
    "level": "第7課",
    "category": "textbook",
    "categoryLabel": "教科書例文（第7課）",
    "lesson": 7,
    "lessonTitle": "第７課 私の家族（Манай гэр бүл）",
    "textMn": "Би дүүгээ дагуулаад цэцэрлэгт хүрээлэн явсан.",
    "textJa": "私は弟（妹）を連れて公園に行きました。",
    "romaji": "",
    "source": "教科書 第７課 私の家族（Манай гэр бүл）",
    "explanation": "目的格（対格）＋再帰所有語尾「-гээ」。「дүү（年下の兄弟姉妹）」に対格再帰所有が付き「自分の弟/妹を」となります。「дагуулаад」は動詞接続語尾「-аад」で「連れて」の意。"
  },
  {
    "id": "tb_type_l7_tb_7_3",
    "level": "第7課",
    "category": "textbook",
    "categoryLabel": "教科書例文（第7課）",
    "lesson": 7,
    "lessonTitle": "第７課 私の家族（Манай гэр бүл）",
    "textMn": "Такэши: Зориг оо, энэ зургийг хар даа. Энэ манай аав, ээж хоёр. Зориг: Аав чинь ямар ажил хийдэг вэ? Такэши: Манай аав инженер, ээж минь багш.",
    "textJa": "たけし: ゾリグ、この写真を見てよ。これが僕の父と母の二人だよ。 ゾリグ: お父さんはどんな仕事をしているの？ たけし: 僕の父はエンジニアで、母は教師だよ。",
    "romaji": "",
    "source": "教科書 第７課 私の家族（Манай гэр бүл）",
    "explanation": "写真を見せながら家族の職業を紹介する対話。「аав чинь（君のお父さん）」という相手所有語尾「-чинь」と「ээж минь（私の母）」の対比がポイントです。"
  },
  {
    "id": "tb_type_l7_tb_7_4",
    "level": "第7課",
    "category": "textbook",
    "categoryLabel": "教科書例文（第7課）",
    "lesson": 7,
    "lessonTitle": "第７課 私の家族（Манай гэр бүл）",
    "textMn": "Манай ам бүл дөрвүүлээ. Аав, ээж, ах бид дөрөв хамтдаа амьдардаг. Аав компанид ажилладаг бөгөөд ээж эмнэлэгт эмч хийдэг. Амралтын өдрүүдэд бид бүгдээрээ хөдөө явж агаарт гардаг.",
    "textJa": "我が家は4人家族です。父、母、兄、私の4人で一緒に暮らしています。父は会社に勤めており、母は病院で医師をしています。週末には私たちはみんなで田舎へ出かけて外の空気を吸います。",
    "romaji": "",
    "source": "教科書 第７課 私の家族（Манай гэр бүл）",
    "explanation": "家族構成と週末の過ごし方を語る文章。「ам бүл（家族人員）」、「бөгөөд（〜であり、かつ）」、「агаарт гарах（ピクニックに行く、戸外に出る）」という自然なモンゴル語表現です。"
  },
  {
    "id": "tb_type_l8_tb_8_1",
    "level": "第8課",
    "category": "textbook",
    "categoryLabel": "教科書例文（第8課）",
    "lesson": 8,
    "lessonTitle": "第８課 ウランバートルから遠いなあ（Улаанбаатараас хол юм аа）",
    "textMn": "Улаанбаатараас Дархан хот хүртэл хэр зэрэг хол вэ?",
    "textJa": "ウランバートルからダルハン市まではどれくらい遠いですか。",
    "romaji": "",
    "source": "教科書 第８課 ウランバートルから遠いなあ（Улаанбаатараас хол юм аа）",
    "explanation": "起点「-аас4（〜から）」と到達点「хүртэл（〜まで）」の呼応。「хэр зэрэг（どれほど）」は程度・距離を尋ねる疑問連語です。"
  },
  {
    "id": "tb_type_l8_tb_8_2",
    "level": "第8課",
    "category": "textbook",
    "categoryLabel": "教科書例文（第8課）",
    "lesson": 8,
    "lessonTitle": "第８課 ウランバートルから遠いなあ（Улаанбаатараас хол юм аа）",
    "textMn": "Галт тэргээр явах нь автобуснаас илүү тав тухтай.",
    "textJa": "列車で行くのはバスより快適です。",
    "romaji": "",
    "source": "教科書 第８課 ウランバートルから遠いなあ（Улаанбаатараас хол юм аа）",
    "explanation": "比較構文。比較対象の名詞に奪格「-наас4」を付け、「илүү（より〜、もっと）」を伴って優劣を比較します。「галт тэргээр（列車で：手段の造格）」。"
  },
  {
    "id": "tb_type_l8_tb_8_3",
    "level": "第8課",
    "category": "textbook",
    "categoryLabel": "教科書例文（第8課）",
    "lesson": 8,
    "lessonTitle": "第８課 ウランバートルから遠いなあ（Улаанбаатараас хол юм аа）",
    "textMn": "Такэши: Юми, чи Эрдэнэт хот руу явна гэсэн үү? Юми: Тийм ээ. Эрдэнэт хот эндээс хэр хол вэ? Такэши: Машинаар зургаан цаг орчим явдаг юм билээ.",
    "textJa": "たけし: ユミ、エルデネト市に行くって言ってたよね？ ユミ: そうなの。エルデネト市はここからどれくらい遠いの？ たけし: 車で6時間くらいかかるそうだよ。",
    "romaji": "",
    "source": "教科書 第８課 ウランバートルから遠いなあ（Улаанбаатараас хол юм аа）",
    "explanation": "間接話法「〜 гэсэн үү（〜と言ったのか）」と伝聞・間接確認「〜 юм билээ（〜だそうだ、〜だったよ）」を含んだ実用的な移動の会話です。"
  },
  {
    "id": "tb_type_l8_tb_8_4",
    "level": "第8課",
    "category": "textbook",
    "categoryLabel": "教科書例文（第8課）",
    "lesson": 8,
    "lessonTitle": "第８課 ウランバートルから遠いなあ（Улаанбаатараас хол юм аа）",
    "textMn": "Монгол орон уудам уужим нутаг дэвсгэртэй тул хотуудын хоорондох зай их хол байдаг. Улаанбаатараас хөдөө орон нутаг руу онгоц, галт тэрэг, эсвэл хот хоорондын автобусаар зорчдог. Зам зуурын байгаль үнэхээр үзэсгэлэнтэй.",
    "textJa": "モンゴル国は広大な国土を持つため、都市間の距離が非常に遠いです。ウランバートルから地方へは飛行機、列車、または長距離バスで移動します。道中の自然は実に美しいです。",
    "romaji": "",
    "source": "教科書 第８課 ウランバートルから遠いなあ（Улаанбаатараас хол юм аа）",
    "explanation": "モンゴルの地理的特徴と交通事情を述べる長文。「уудам уужим（広々とした）」、「хоорондох зай（間の距離）」、「зам зуурын（道中の）」などの語彙力を高めます。"
  },
  {
    "id": "tb_type_l9_tb_9_1",
    "level": "第9課",
    "category": "textbook",
    "categoryLabel": "教科書例文（第9課）",
    "lesson": 9,
    "lessonTitle": "第９課 あなたは毎日何をしていますか（Та өдөр бүр юу хийдэг вэ?）",
    "textMn": "Би өглөө бүр долоон цагт босдог.",
    "textJa": "私は毎朝7時に起きます。",
    "romaji": "",
    "source": "教科書 第９課 あなたは毎日何をしていますか（Та өдөр бүр юу хийдэг вэ?）",
    "explanation": "時間・時刻を表す与位格「-т/-д」と習慣形動詞語尾「-даг4」。「долоон цаг（7時）」に「-т」が接続して「7時に」となり、日常習慣を表します。"
  },
  {
    "id": "tb_type_l9_tb_9_2",
    "level": "第9課",
    "category": "textbook",
    "categoryLabel": "教科書例文（第9課）",
    "lesson": 9,
    "lessonTitle": "第９課 あなたは毎日何をしていますか（Та өдөр бүр юу хийдэг вэ?）",
    "textMn": "Би ихэвчлэн автобусаар явдаг, харин заримдаа алхдаг.",
    "textJa": "私はたいていバスで行きますが、時には歩きます。",
    "romaji": "",
    "source": "教科書 第９課 あなたは毎日何をしていますか（Та өдөр бүр юу хийдэг вэ?）",
    "explanation": "頻度副詞「ихэвчлэн（たいてい、普通は）」と「заримдаа（時々）」。対比の接続詞「харин（一方で、しかし）」で対比させています。"
  },
  {
    "id": "tb_type_l9_tb_9_3",
    "level": "第9課",
    "category": "textbook",
    "categoryLabel": "教科書例文（第9課）",
    "lesson": 9,
    "lessonTitle": "第９課 あなたは毎日何をしていますか（Та өдөр бүр юу хийдэг вэ?）",
    "textMn": "Зориг: Такэши, чи өдөр бүр юу хийдэг вэ? Такэши: Би өглөө монгол хэлээ давтаад, өдөр нь хичээлдээ суудаг. Зориг: Орой нь чөлөөт цагаараа яадаг вэ? Такэши: Заал авч сагс тоглодог.",
    "textJa": "ゾリグ: たけし、毎日何をしているの？ たけし: 朝はモンゴル語を復習して、昼は授業に出席しているよ。 ゾリグ: 夜の自由時間はどうしてる？ たけし: 体育館を取ってバスケをしているよ。",
    "romaji": "",
    "source": "教科書 第９課 あなたは毎日何をしていますか（Та өдөр бүр юу хийдэг вэ?）",
    "explanation": "1日の過ごし方を質問・回答する対話。前行動接続「давтаад（復習してから）」や「заал авах（体育館を借りる）」といった現地生活ならではの慣用表現です。"
  },
  {
    "id": "tb_type_l9_tb_9_4",
    "level": "第9課",
    "category": "textbook",
    "categoryLabel": "教科書例文（第9課）",
    "lesson": 9,
    "lessonTitle": "第９課 あなたは毎日何をしていますか（Та өдөр бүр юу хийдэг вэ?）",
    "textMn": "Миний ажлын өдөр маш завгүй өнгөрдөг. Өглөөний цайгаа уугаад найман цаг хагаст гэрээсээ гарна. Ажил дээрээ очиж оройн зургаан цаг хүртэл ажилладаг. Орой гэртээ ирээд ном уншиж амардаг.",
    "textJa": "私の平日はとても忙しく過ぎていきます。朝食を食べてから8時半に家を出ます。職場に行って夕方6時まで働きます。夜は家に帰って本を読んで休みます。",
    "romaji": "",
    "source": "教科書 第９課 あなたは毎日何をしていますか（Та өдөр бүр юу хийдэг вэ?）",
    "explanation": "典型的な社会人の1日のルーティン。「өглөөний цай（朝食）」、「завгүй（忙しい）」、「гэрээсээ гарах（家を出る）」など頻出語句が詰まっています。"
  },
  {
    "id": "tb_type_l10_tb_10_1",
    "level": "第10課",
    "category": "textbook",
    "categoryLabel": "教科書例文（第10課）",
    "lesson": 10,
    "lessonTitle": "第１０課 私はモンゴル語ができます（Би монгол хэлээр ярьж чадна）",
    "textMn": "Би монгол хэлээр бага зэрэг ярьж чадна.",
    "textJa": "私はモンゴル語で少し話すことができます。",
    "romaji": "",
    "source": "教科書 第１０課 私はモンゴル語ができます（Би монгол хэлээр ярьж чадна）",
    "explanation": "言語の手段を表す造格「-аар4」＋動詞可能表現「-ж/ч чадах」。「ярих（話す）」の接続形「ярьж」に助動詞「чадна（できる）」が接続します。「бага зэрэг（少し）」。"
  },
  {
    "id": "tb_type_l10_tb_10_2",
    "level": "第10課",
    "category": "textbook",
    "categoryLabel": "教科書例文（第10課）",
    "lesson": 10,
    "lessonTitle": "第１０課 私はモンゴル語ができます（Би монгол хэлээр ярьж чадна）",
    "textMn": "Та морь унаж чадах уу? Үгүй ээ, би морь унаж чадахгүй.",
    "textJa": "あなたは馬に乗ることができますか？いいえ、私は馬に乗れません。",
    "romaji": "",
    "source": "教科書 第１０課 私はモンゴル語ができます（Би монгол хэлээр ярьж чадна）",
    "explanation": "可能表現の疑問形と否定形。「чадах уу（できますか）」と「чадахгүй（できません）」。動詞「унах（乗る）」の接続形「унаж」に続きます。"
  },
  {
    "id": "tb_type_l10_tb_10_3",
    "level": "第10課",
    "category": "textbook",
    "categoryLabel": "教科書例文（第10課）",
    "lesson": 10,
    "lessonTitle": "第１０課 私はモンゴル語ができます（Би монгол хэлээр ярьж чадна）",
    "textMn": "Зорчигч: Сайн байна уу? Та монголоор ярьдаг уу? Такэши: Тийм ээ, би монголоор бага зэрэг ярьж чадна. Гэхдээ хурдан яривал сайн ойлгохгүй. Зорчигч: Та их сайн ярьж байна шүү.",
    "textJa": "乗客: こんにちは。モンゴル語を話されますか？ たけし: はい、少し話せます。でも早く話されるとよく理解できません。 乗客: とても上手に話されていますよ！",
    "romaji": "",
    "source": "教科書 第１０課 私はモンゴル語ができます（Би монгол хэлээр ярьж чадна）",
    "explanation": "旅行中や街中で話しかけられた時の対話。「хурдан яривал（早く話したら：仮定語尾-вал）」、「ойлгохгүй（理解できない）」、「шүү（〜だよ：念押し）」を習得します。"
  },
  {
    "id": "tb_type_l10_tb_10_4",
    "level": "第10課",
    "category": "textbook",
    "categoryLabel": "教科書例文（第10課）",
    "lesson": 10,
    "lessonTitle": "第１０課 私はモンゴル語ができます（Би монгол хэлээр ярьж чадна）",
    "textMn": "Би багаасаа гадаад хэл сурах дуртай байсан. Одоо би англи хэлээр чөлөөтэй ярьдаг бөгөөд монгол хэлийг хичээнгүйлэн сурч байна. Ирээдүйд монголчуудтай төрөлх хэлээр нь ойлголцохыг хүсдэг.",
    "textJa": "私は子供の頃から外国語を学ぶのが好きでした。今私は英語を流暢に話すことができ、モンゴル語を一生懸命学んでいます。将来的にはモンゴルの人々と母国語で理解し合いたいと望んでいます。",
    "romaji": "",
    "source": "教科書 第１０課 私はモンゴル語ができます（Би монгол хэлээр ярьж чадна）",
    "explanation": "語学学習の動機と目標を語るスピーチ文。「багаасаа（幼い頃から）」、「чөлөөтэй（自由に、流暢に）」、「төрөлх хэл（母国語）」、「ойлголцох（分かり合う）」を含みます。"
  },
  {
    "id": "tb_type_l11_tb_11_1",
    "level": "第11課",
    "category": "textbook",
    "categoryLabel": "教科書例文（第11課）",
    "lesson": 11,
    "lessonTitle": "第１１課 今日は天気がいいです（Өнөөдөр цаг агаар сайхан байна）",
    "textMn": "Өнөөдөр тэнгэр цэлмэг, нартай байна.",
    "textJa": "今日は空が澄み渡り、晴れています。",
    "romaji": "",
    "source": "教科書 第１１課 今日は天気がいいです（Өнөөдөр цаг агаар сайхан байна）",
    "explanation": "天候の描写。「тэнгэр（空）」、「цэлмэг（雲ひとつない快晴）」、「нартай（太陽が出ている・日差しがある：нар + -тай）」。"
  },
  {
    "id": "tb_type_l11_tb_11_2",
    "level": "第11課",
    "category": "textbook",
    "categoryLabel": "教科書例文（第11課）",
    "lesson": 11,
    "lessonTitle": "第１１課 今日は天気がいいです（Өнөөдөр цаг агаар сайхан байна）",
    "textMn": "Маргааш цас орж, хүйтрэх төлөвтэй байна.",
    "textJa": "明日は雪が降り、冷え込む見込みです。",
    "romaji": "",
    "source": "教科書 第１１課 今日は天気がいいです（Өнөөдөр цаг агаар сайхан байна）",
    "explanation": "気象予報の推量表現。「цас орох（雪が降る）」の接続形「орж」＋「хүйтрэх（寒くなる）」＋「төлөвтэй байна（〜の傾向・見込みである）」。「цаг агаарын мэдээ（天気予報）」で頻出。"
  },
  {
    "id": "tb_type_l11_tb_11_3",
    "level": "第11課",
    "category": "textbook",
    "categoryLabel": "教科書例文（第11課）",
    "lesson": 11,
    "lessonTitle": "第１１課 今日は天気がいいです（Өнөөдөр цаг агаар сайхан байна）",
    "textMn": "Зориг: Өнөөдөр цаг агаар сайхан байна шүү. Такэши: Тийм байна. Маргааш хэдэн градус байх бол? Зориг: Цаг агаарын мэдээгээр хасах таван градус гэнэ.",
    "textJa": "ゾリグ: 今日はいい天気だね。 たけし: 本当ですね。明日は何度くらいになるでしょうか？ ゾリグ: 天気予報によるとマイナス5度だそうだよ。",
    "romaji": "",
    "source": "教科書 第１１課 今日は天気がいいです（Өнөөдөр цаг агаар сайхан байна）",
    "explanation": "気温と天気を話題にする日常会話。「хэдэн градус（何度）」、「хасах（マイナス）」、「гэнэ（〜だそうだ：伝聞助動詞）」の自然な使われ方を学びます。"
  },
  {
    "id": "tb_type_l11_tb_11_4",
    "level": "第11課",
    "category": "textbook",
    "categoryLabel": "教科書例文（第11課）",
    "lesson": 11,
    "lessonTitle": "第１１課 今日は天気がいいです（Өнөөдөр цаг агаар сайхан байна）",
    "textMn": "Монголын өвөл маш хүйтэн боловч тэнгэр нь үргэлж цэлмэг, хөх өнгөтэй байдаг. Өвлийн улиралд температур хасах гуч, дөчин градус хүрдэг тул зузаан дулаан хувцас, үслэг малгай, бээлий зайлшгүй шаардлагатай.",
    "textJa": "モンゴルの冬は極めて寒いですが、空は常に晴れ渡り、青く澄んでいます。冬の季節には気温がマイナス30度、40度に達するため、分厚い防寒着、毛皮の帽子、手袋が不可欠です。",
    "romaji": "",
    "source": "教科書 第１１課 今日は天気がいいです（Өнөөдөр цаг агаар сайхан байна）",
    "explanation": "モンゴルの気候の特徴と冬の備えを説明する文章。「боловч（〜であるけれども）」、「зузаан дулаан（分厚く暖かい）」、「зайлшгүй（必須の）」などの高度な語彙を習得します。"
  },
  {
    "id": "tb_type_l12_tb_12_1",
    "level": "第12課",
    "category": "textbook",
    "categoryLabel": "教科書例文（第12課）",
    "lesson": 12,
    "lessonTitle": "第１２課 来週セレンゲ県に行きます（Ирэх долоо хоногт Сэлэнгэ аймаг явна）",
    "textMn": "Бид ирэх долоо хоногийн мягмар гарагт хөдөө явна.",
    "textJa": "私たちは来週の火曜日に地方へ出発します。",
    "romaji": "",
    "source": "教科書 第１２課 来週セレンゲ県に行きます（Ирэх долоо хоногт Сэлэнгэ аймаг явна）",
    "explanation": "曜日と移動の表現。「ирэх долоо хоног（来週）」＋属格「-ийн」＋「мягмар гарагт（火曜日に：与位格）」＋「хөдөө явах（地方へ行く）」。"
  },
  {
    "id": "tb_type_l12_tb_12_2",
    "level": "第12課",
    "category": "textbook",
    "categoryLabel": "教科書例文（第12課）",
    "lesson": 12,
    "lessonTitle": "第１２課 来週セレンゲ県に行きます（Ирэх долоо хоногт Сэлэнгэ аймаг явна）",
    "textMn": "Та хэдэн хоногоор томилолтоор явах вэ?",
    "textJa": "あなたは何日間の予定で出張に行きますか。",
    "romaji": "",
    "source": "教科書 第１２課 来週セレンゲ県に行きます（Ирэх долоо хоногт Сэлэнгэ аймаг явна）",
    "explanation": "期間を表す造格「-оор4」。「хэдэн хоногоор（何日間の予定で）」＋「томилолтоор（出張で：名詞томилолт + 造格）」。"
  },
  {
    "id": "tb_type_l12_tb_12_3",
    "level": "第12課",
    "category": "textbook",
    "categoryLabel": "教科書例文（第12課）",
    "lesson": 12,
    "lessonTitle": "第１２課 来週セレンゲ県に行きます（Ирэх долоо хоногт Сэлэнгэ аймаг явна）",
    "textMn": "Зориг: Такэши, чи Сэлэнгэ аймагт очих бил үү? Хэзээ явах вэ? Такэши: Тийм ээ, ирэх сарын аравдаар явна. Зориг: Юугаар явах вэ? Такэши: Галт тэргээр явна.",
    "textJa": "ゾリグ: たけし、セレンゲ県に行くんだったよね？いつ行くの？ たけし: そう、来月の10日頃に行くよ。 ゾリグ: 何で行くの？ たけし: 列車で行くよ。",
    "romaji": "",
    "source": "教科書 第１２課 来週セレンゲ県に行きます（Ирэх долоо хоногт Сэлэнгэ аймаг явна）",
    "explanation": "過去の予定の確認「〜 бил үү（〜だったっけ）」とおおよその日付「аравдаар（10日頃に）」、移動手段「юугаар（何で）」を用いた会話です。"
  },
  {
    "id": "tb_type_l12_tb_12_4",
    "level": "第12課",
    "category": "textbook",
    "categoryLabel": "教科書例文（第12課）",
    "lesson": 12,
    "lessonTitle": "第１２課 来週セレンゲ県に行きます（Ирэх долоо хоногт Сэлэнгэ аймаг явна）",
    "textMn": "Би ирэх сард Дархан болон Сэлэнгэ аймаг руу ажлын томилолтоор явна. Тэнд очоод орон нутгийн сургуулиудтай танилцаж, япон хэл заах арга зүйн сургалт явуулахаар төлөвлөж байна. Энэ бол миний анхны хөдөөгийн томилолт юм.",
    "textJa": "私は来月ダルハンおよびセレンゲ県へ仕事の出張に行きます。現地に到着したら地方の学校を視察し、日本語教授法の研修を実施するよう計画しています。これは私の初めての地方出張です。",
    "romaji": "",
    "source": "教科書 第１２課 来週セレンゲ県に行きます（Ирэх долоо хоногт Сэлэнгэ аймаг явна）",
    "explanation": "業務出張の目的と計画を記述した文章。「болон（および）」、「очоод（到着してから）」、「төлөвлөж байна（計画している）」などの公的ビジネス語彙を含みます。"
  },
  {
    "id": "tb_type_l13_tb_13_1",
    "level": "第13課",
    "category": "textbook",
    "categoryLabel": "教科書例文（第13課）",
    "lesson": 13,
    "lessonTitle": "第１３課 ここでタクシーを予約してもいいですか（Энд такси захиалж болох уу?）",
    "textMn": "Энд түр хүлээж болох уу?",
    "textJa": "ここで少し待ってもいいですか。",
    "romaji": "",
    "source": "教科書 第１３課 ここでタクシーを予約してもいいですか（Энд такси захиалж болох уу?）",
    "explanation": "許可を求める構文「動詞接続形 -ж/ч + болох уу」。「хүлээх（待つ）」の語幹「хүлээ-」に「-ж」が接続し「хүлээж болох уу（待ってもよろしいですか）」となります。「түр（少しの間）」。"
  },
  {
    "id": "tb_type_l13_tb_13_2",
    "level": "第13課",
    "category": "textbook",
    "categoryLabel": "教科書例文（第13課）",
    "lesson": 13,
    "lessonTitle": "第１３課 ここでタクシーを予約してもいいですか（Энд такси захиалж болох уу?）",
    "textMn": "Би хотын төв рүү явмаар байна. Зам зааж өгөөч.",
    "textJa": "私は市内中心部へ行きたいです。道を教えてください。",
    "romaji": "",
    "source": "教科書 第１３課 ここでタクシーを予約してもいいですか（Энд такси захиалж болох уу?）",
    "explanation": "願望語尾「-маар4 байна（〜したい）」と親愛な依頼語尾「-аач4」。「зааж өгөх（教えてあげる・案内する）」に「-өөч」が付き「зааж өгөөч（教えてください）」となります。"
  },
  {
    "id": "tb_type_l13_tb_13_3",
    "level": "第13課",
    "category": "textbook",
    "categoryLabel": "教科書例文（第13課）",
    "lesson": 13,
    "lessonTitle": "第１３課 ここでタクシーを予約してもいいですか（Энд такси захиалж болох уу?）",
    "textMn": "Юми: Төв аймаг руу явмаар байна. Эндээс яаж явах вэ? Ажилтан: Та хот хоорондын такси барьж болно. Би танд такси дуудаж өгөх үү? Юми: Тэгвэл их сайн байна. Баярлалаа.",
    "textJa": "ユミ: トゥブ県に行きたいのですが。ここからどうやって行けばいいですか？ 係員: 都市間タクシーを捕まえることができますよ。私がタクシーをお呼びしましょうか？ ユミ: そうしていただけると大変助かります。ありがとうございます。",
    "romaji": "",
    "source": "教科書 第１３課 ここでタクシーを予約してもいいですか（Энд такси захиалж болох уу?）",
    "explanation": "交通手段の相談と親切な申し出に対する応答。「дуchangeж өгөх үү（〜してあげましょうか）」、「Тэгвэл их сайн байна（そうなら大変良いです）」など実践的な表現です。"
  },
  {
    "id": "tb_type_l13_tb_13_4",
    "level": "第13課",
    "category": "textbook",
    "categoryLabel": "教科書例文（第13課）",
    "lesson": 13,
    "lessonTitle": "第１３課 ここでタクシーを予約してもいいですか（Энд такси захиалж болох уу?）",
    "textMn": "Монголд такси барихын тулд замын хажууд зогсоод гараа өргөдөг. Хувийн машинтай хүмүүс ч зогсож үйлчилдэг бөгөөд нэг километрийн үнэ нь тодорхой тогтсон байдаг. Суухаасаа өмнө очих газраа тодорхой хэлэх хэрэгтэй.",
    "textJa": "モンゴルでタクシーを拾うためには、道端に立って手を挙げます。自家用車の一般人も停まって乗せてくれ、1キロあたりの料金は明確に決まっています。乗り込む前に行き先をはっきりと伝える必要があります。",
    "romaji": "",
    "source": "教科書 第１３課 ここでタクシーを予約してもいいですか（Энд такси захиалж болох уу?）",
    "explanation": "モンゴル特有の「流しの白タク文化」を説明した長文。「гараа өргөх（手を挙げる）」、「тодорхой（明確に）」、「суухаасаа өмнө（乗る前に）」など役立つ文化・習慣表現です。"
  },
  {
    "id": "tb_type_l14_tb_14_1",
    "level": "第14課",
    "category": "textbook",
    "categoryLabel": "教科書例文（第14課）",
    "lesson": 14,
    "lessonTitle": "第１４課 ホテルに泊まります（Зочид буудалд бууна）",
    "textMn": "Нэг хоногийн үнэ нь ямар үнэтэй вэ?",
    "textJa": "1泊の料金はいくらですか。",
    "romaji": "",
    "source": "教科書 第１４課 ホテルに泊まります（Зочид буудалд бууна）",
    "explanation": "宿泊料金の質問。「нэг хоног（丸1日、一泊）」＋属格「-ийн」＋「үнэ（値段）」＋代名詞所有「нь」＋「ямар үнэтэй вэ（どんな値段ですか）」。"
  },
  {
    "id": "tb_type_l14_tb_14_2",
    "level": "第14課",
    "category": "textbook",
    "categoryLabel": "教科書例文（第14課）",
    "lesson": 14,
    "lessonTitle": "第１４課 ホテルに泊まります（Зочид буудалд бууна）",
    "textMn": "Өрөөнд интернет, халуун ус байгаа юу? Тийм, байгаа.",
    "textJa": "部屋にインターネットとお湯はありますか？はい、あります。",
    "romaji": "",
    "source": "教科書 第１４課 ホテルに泊まります（Зочид буудалд бууна）",
    "explanation": "ホテルの設備を確認する表現。存在文「байгаа юу（あるのか）」。「халуун ус（お湯）」はモンゴルの冬期・地方宿泊で最重要の確認項目です。"
  },
  {
    "id": "tb_type_l14_tb_14_3",
    "level": "第14課",
    "category": "textbook",
    "categoryLabel": "教科書例文（第14課）",
    "lesson": 14,
    "lessonTitle": "第１４課 ホテルに泊まります（Зочид буудалд бууна）",
    "textMn": "Юми: Сайн байна уу? Сул өрөө байгаа юу? Рецепшн: Сайн байна уу? Тийм ээ, нэг ортой өрөө сул байна. Юми: Өглөөний цай багтсан уу? Рецепшн: Тийм ээ, өглөөний цай үнэдээ орсон.",
    "textJa": "ユミ: こんにちは。空き部屋はありますか？ フロント: こんにちは。はい、シングルルームに空きがございます。 ユミ: 朝食は含まれていますか？ フロント: はい、朝食は料金に含まれております。",
    "romaji": "",
    "source": "教科書 第１４課 ホテルに泊まります（Зочид буудалд бууна）",
    "explanation": "ホテルのフロントでのチェックイン手続き。「нэг ортой өрөө（シングルルーム）」、「багтсан（含まれた）」、「үнэдээ орсон（料金に入っている）」の実践対話です。"
  },
  {
    "id": "tb_type_l14_tb_14_4",
    "level": "第14課",
    "category": "textbook",
    "categoryLabel": "教科書例文（第14課）",
    "lesson": 14,
    "lessonTitle": "第１４課 ホテルに泊まります（Зочид буудалд бууна）",
    "textMn": "Бид хөдөө аялахдаа жуулчны баазад хоёр хоносон. Уламжлалт гэр сууцанд амарч, өглөө нь нар мандахыг харсан. Гэр дотор зуух галладаг тул маш дулаахан, тохилог байсан. Байгалийн үзэсгэлэн үнэхээр гайхалтай байлаа.",
    "textJa": "私たちは地方を旅行した際、ツーリストキャンプに2泊しました。伝統的なゲル住居に滞在し、朝は日の出を眺めました。ゲルの中では薪ストーブを焚くため、とても暖かく快適でした。大自然の美しさは本当に素晴らしかったです。",
    "romaji": "",
    "source": "教科書 第１４課 ホテルに泊まります（Зочид буудалд бууна）",
    "explanation": "ツーリストキャンプ（ゲルの宿）体験記。「жуулчны бааз（ツーリストキャンプ）」、「зуух галлах（ストーブを焚く）」、「тохилог（居心地が良い）」などの旅行表現です。"
  },
  {
    "id": "tb_type_l15_tb_15_1",
    "level": "第15課",
    "category": "textbook",
    "categoryLabel": "教科書例文（第15課）",
    "lesson": 15,
    "lessonTitle": "第１５課 病院に行きました（Эмнэлэгт очсон）",
    "textMn": "Миний толгой өвдөж, халуурч байна.",
    "textJa": "私は頭が痛くて、熱があります。",
    "romaji": "",
    "source": "教科書 第１５課 病院に行きました（Эмнэлэгт очсон）",
    "explanation": "体の不調の訴え。「өвдөх（痛む）」の接続形「өвдөж」＋「халуурах（熱が出る）」＋進行形「-ж байна」。「толгой өвдөх（頭痛がする）」は最重要医療表現。"
  },
  {
    "id": "tb_type_l15_tb_15_2",
    "level": "第15課",
    "category": "textbook",
    "categoryLabel": "教科書例文（第15課）",
    "lesson": 15,
    "lessonTitle": "第１５課 病院に行きました（Эмнэлэгт очсон）",
    "textMn": "Энэ эмийг өдөрт гурван удаа хоолны дараа уугаарай.",
    "textJa": "この薬を1日3回、食後に飲んでください。",
    "romaji": "",
    "source": "教科書 第１５課 病院に行きました（Эмнэлэгт очсон）",
    "explanation": "服薬指導の表現。「өдөрт гурван удаа（1日に3回）」＋「хоолны дараа（食後に）」＋「уугаарай（飲んでくださいね：уух + -гаарай）」。（モンゴル語では薬を「飲む」のも動詞「уух」を用います）。"
  },
  {
    "id": "tb_type_l15_tb_15_3",
    "level": "第15課",
    "category": "textbook",
    "categoryLabel": "教科書例文（第15課）",
    "lesson": 15,
    "lessonTitle": "第１５課 病院に行きました（Эмнэлэгт очсон）",
    "textMn": "Эмч: Сайн байна уу? Бие тань яасан бэ? Такэши: Өчигдөр оройноос эхлээд хоолой өвдөж, ханиалгаад байна. Эмч: Амаа ангайгаад хэлээ гарга даа. Ханиад хүрсэн байна.",
    "textJa": "医師: こんにちは。お体の具合はどうされましたか？ たけし: 昨晩から喉が痛くて、咳が出続けています。 医師: 口を開けて舌を出してください。風邪を引いていますね。",
    "romaji": "",
    "source": "教科書 第１５課 病院に行きました（Эмнэлэгт очсон）",
    "explanation": "診察室での医師と患者のリアルな問診。「бие тань яасан бэ（どうされましたか）」、「хоолой өвдөх（喉が痛い）」、「ханиад хүрэх（風邪を引く）」を学びます。"
  },
  {
    "id": "tb_type_l15_tb_15_4",
    "level": "第15課",
    "category": "textbook",
    "categoryLabel": "教科書例文（第15課）",
    "lesson": 15,
    "lessonTitle": "第１５課 病院に行きました（Эмнэлэгт очсон）",
    "textMn": "Монголын хуурай, хүйтэн цаг агаараас болоод өвлийн улиралд хүмүүс амархан ханиад хүрдэг. Ханиад хүрсэн үед чацарганы халуун шүүс ууж, адууны чанасан махны шөл уух нь биед маш сайн эмчилгээ болдог гэж монголчууд ярьдаг.",
    "textJa": "モンゴルの乾燥した寒い気候のせいで、冬の時期には人々は簡単に風邪を引いてしまいます。風邪を引いた時には、熱いサジー（シーバックソーン）ジュースを飲み、煮込んだ馬肉のスープを飲むことが体に大変良い民間療法になるとモンゴルの人々は語ります。",
    "romaji": "",
    "source": "教科書 第１５課 病院に行きました（Эмнэлэгт очсон）",
    "explanation": "モンゴルの伝統的な風邪の民間療法を語る文化長文。「чацаргана（サジー）」、「шөл（スープ）」、「эмчилгээ（治療）」などの重要語彙を含みます。"
  },
  {
    "id": "tb_type_l16_tb_16_1",
    "level": "第16課",
    "category": "textbook",
    "categoryLabel": "教科書例文（第16課）",
    "lesson": 16,
    "lessonTitle": "第１６課 昨日何をしましたか（Өчигдөр юу хийсэн бэ?）",
    "textMn": "Өчигдөр би номын санд сууж даалгавраа хийсэн.",
    "textJa": "昨日私は図書館に座って（こもって）宿題をしました。",
    "romaji": "",
    "source": "教科書 第１６課 昨日何をしましたか（Өчигдөр юу хийсэн бэ?）",
    "explanation": "過去の行動順序。並列接続語尾「-ж」で「сууж（座って・滞在して）」＋「даалгавраа хийсэн（自分の宿題をした：既定過去形-сан）」と繋げます。"
  },
  {
    "id": "tb_type_l16_tb_16_2",
    "level": "第16課",
    "category": "textbook",
    "categoryLabel": "教科書例文（第16課）",
    "lesson": 16,
    "lessonTitle": "第１６課 昨日何をしましたか（Өчигдөр юу хийсэн бэ?）",
    "textMn": "Хичээл тараад шууд гэртээ харьсан уу?",
    "textJa": "学校が終わってから、まっすぐ家に帰りましたか。",
    "romaji": "",
    "source": "教科書 第１６課 昨日何をしましたか（Өчигдөр юу хийсэн бэ?）",
    "explanation": "前行動接続語尾「-аад4」。「хичээл тарах（授業・学校が終わる）」に「-аад」が付き「終わったあとで」という順序関係を明確にします。「шууд（直接、まっすぐ）」。"
  },
  {
    "id": "tb_type_l16_tb_16_3",
    "level": "第16課",
    "category": "textbook",
    "categoryLabel": "教科書例文（第16課）",
    "lesson": 16,
    "lessonTitle": "第１６課 昨日何をしましたか（Өчигдөр юу хийсэн бэ?）",
    "textMn": "Багш: Такэши, өчигдөр чи яагаад хичээлдээ ирээгүй вэ? Такэши: Уучлаарай, багш аа. Гэнэт халуураад эмнэлэг явсан юм. Багш: Одоо бие чинь дээрдэв үү? Такэши: Тийм ээ, эм уугаад зүгээр болсон.",
    "textJa": "先生: たけし、昨日はどうして授業に来なかったのですか？ たけし: すみません先生。急に熱が出て病院に行ったのです。 先生: 今は体調は良くなりましたか？ たけし: はい、薬を飲んで大丈夫になりました。",
    "romaji": "",
    "source": "教科書 第１６課 昨日何をしましたか（Өчигдөр юу хийсэн бэ?）",
    "explanation": "欠席の理由を説明する対話。「яагаад ... вэ（なぜ〜なのか）」、「гэнэт（急に）」、「дээрдэх（良くなる、快方に向かう）」を身につけます。"
  },
  {
    "id": "tb_type_l16_tb_16_4",
    "level": "第16課",
    "category": "textbook",
    "categoryLabel": "教科書例文（第16課）",
    "lesson": 16,
    "lessonTitle": "第１６課 昨日何をしましたか（Өчигдөр юу хийсэн бэ?）",
    "textMn": "Өнгөрсөн ням гарагт би монгол найзынхаа гэрт зочилсон. Найзын маань ээж амттай бууз, сүүтэй цайгаар дайлсан. Бид олон сайхан сэдвээр ярилцаж, хамтдаа дуу дуулж, үдшийг маш зугаатай өнгөрүүлсэн.",
    "textJa": "先週の日曜日、私はモンゴルの友人の家を訪ねました。友人の母が美味しいボーズとスーテイチャイ（ミルクティー）でごちそうしてくれました。私たちはたくさんの素敵な話題で語り合い、一緒に歌を歌い、夜を大変楽しく過ごしました。",
    "romaji": "",
    "source": "教科書 第１６課 昨日何をしましたか（Өчигдөр юу хийсэн бэ?）",
    "explanation": "モンゴルの家庭訪問体験記。「зочлох（客として訪問する）」、「дайлах（もてなす）」、「өнгөрүүлэх（時間を過ごす）」という温かい交流の文です。"
  },
  {
    "id": "tb_type_l17_tb_17_1",
    "level": "第17課",
    "category": "textbook",
    "categoryLabel": "教科書例文（第17課）",
    "lesson": 17,
    "lessonTitle": "第１７課 野菜を買いましょう（Ногоо авцгаая）",
    "textMn": "Зах орж төмс, лууван авцгаая.",
    "textJa": "市場へ行ってジャガイモとニンジンを買いましょう。",
    "romaji": "",
    "source": "教科書 第１７課 野菜を買いましょう（Ногоо авцгаая）",
    "explanation": "複数人への勧誘語尾「-цгаая4」。「авах（取る・買う）」の語幹「ав-」に男性母音語尾「-цгаая」が接続し「みんなで買いましょう」となります。「төмс（ジャガイモ）」、「лууван（ニンジン）」。"
  },
  {
    "id": "tb_type_l17_tb_17_2",
    "level": "第17課",
    "category": "textbook",
    "categoryLabel": "教科書例文（第17課）",
    "lesson": 17,
    "lessonTitle": "第１７課 野菜を買いましょう（Ногоо авцгаая）",
    "textMn": "Энэ алим нэг килограмм нь хэдэн төгрөг вэ?",
    "textJa": "このリンゴは1キログラムでいくら（何トゥグルグ）ですか。",
    "romaji": "",
    "source": "教科書 第１７課 野菜を買いましょう（Ногоо авцгаая）",
    "explanation": "市場での値段の尋ね方。「нэг килограмм нь（1キロあたりは）」＋「хэдэн төгрөг вэ（何トゥグルグですか）」。モンゴルの通貨単位はトゥグルグ（төгрөг）です。"
  },
  {
    "id": "tb_type_l17_tb_17_3",
    "level": "第17課",
    "category": "textbook",
    "categoryLabel": "教科書例文（第17課）",
    "lesson": 17,
    "lessonTitle": "第１７課 野菜を買いましょう（Ногоо авцгаая）",
    "textMn": "Юми: Худалдагч аа, энэ мах шинэ үү? Худалдагч: Дөнгөж сая ирсэн, маш шинэ үхрийн мах байна. Хоёр килограммыг авбал хямдруулж өгнө шүү. Юми: Тэгвэл хоёр килограммыг авъя.",
    "textJa": "ユミ: 店員さん、このお肉は新鮮ですか？ 店員: たった今届いたばかりの、とても新鮮な牛肉ですよ。2キロ買ってくれたら安くまけてあげますよ！ ユミ: じゃあ2キロ買います。",
    "romaji": "",
    "source": "教科書 第１７課 野菜を買いましょう（Ногоо авцгаая）",
    "explanation": "市場（ザハ）での活気ある値段交渉対話。「дөнгөж сая（たった今）」、「хямдруулж өгөх（安く割り引いてあげる）」、「авъя（買います・いただきます：意志語尾-я）」を学びます。"
  },
  {
    "id": "tb_type_l17_tb_17_4",
    "level": "第17課",
    "category": "textbook",
    "categoryLabel": "教科書例文（第17課）",
    "lesson": 17,
    "lessonTitle": "第１７課 野菜を買いましょう（Ногоо авцгаая）",
    "textMn": "Бид амралтын өдрөөр Нарантуул зах дээр очсон. Тэнд хоол хүнс, өвлийн дулаан дээл, гутал, гэр ахуйн бараа зэрэг бүх төрлийн зүйлсийг зарж байв. Захын уур амьсгал маш амьд, олон хүний хөлд дарагдсан байлаа.",
    "textJa": "私たちは休日にナラントール市場へ行きました。そこでは食料品、冬の暖かいデール（民族衣装）、ブーツ、家庭用品などあらゆる種類の品物が売られていました。市場の活気は大変生き生きとしており、大勢の人で賑わっていました。",
    "romaji": "",
    "source": "教科書 第１７課 野菜を買いましょう（Ногоо авцгаая）",
    "explanation": "ウランバートル最大の市場ナラントールザハのルポ文。「бүх төрлийн（全種類の）」、「уур амьсгал（雰囲気）」、「хөлд дарагдах（人波で賑わう）」を習得します。"
  },
  {
    "id": "tb_type_l18_tb_18_1",
    "level": "第18課",
    "category": "textbook",
    "categoryLabel": "教科書例文（第18課）",
    "lesson": 18,
    "lessonTitle": "第１８課 お腹がすいています（Өлсөж байна）",
    "textMn": "Би их өлсөж байна. Амттай монгол хоол идье.",
    "textJa": "私はとてもお腹が空いています。美味しいモンゴル料理を食べましょう。",
    "romaji": "",
    "source": "教科書 第１８課 お腹がすいています（Өлсөж байна）",
    "explanation": "生理状態の進行形「өлсөх（お腹が空く）」＋「-ж байна」＝「空いている」。意志・勧誘「идье（食べよう：идэх + -е）」。"
  },
  {
    "id": "tb_type_l18_tb_18_2",
    "level": "第18課",
    "category": "textbook",
    "categoryLabel": "教科書例文（第18課）",
    "lesson": 18,
    "lessonTitle": "第１８課 お腹がすいています（Өлсөж байна）",
    "textMn": "Зөөгч өө, цэсээ өгөөч. Бас халуун цай авъя.",
    "textJa": "ウェイターさん、メニューをください。それと温かいお茶をお願いします。",
    "romaji": "",
    "source": "教科書 第１８課 お腹がすいています（Өлсөж байна）",
    "explanation": "レストランでの注文。「цэс（メニュー）」＋再帰所有「-ээ」＋丁寧な依頼「өгөөч（ください）」。「авъя（〜をいただきます・お願いします）」。"
  },
  {
    "id": "tb_type_l18_tb_18_3",
    "level": "第18課",
    "category": "textbook",
    "categoryLabel": "教科書例文（第18課）",
    "lesson": 18,
    "lessonTitle": "第１８課 お腹がすいています（Өлсөж байна）",
    "textMn": "Хироки: Та юу захиалах вэ? Такэши: Би хуушуур, бас ногоотой шөл захиалмаар байна. Хироки: Уух юм юу авах вэ? Такэши: Сүүтэй цай захиалъя. Зөөгч өө, захиалга авъя!",
    "textJa": "ヒロキ: 何を注文しますか？ たけし: 僕はホーショールと野菜スープを注文したいです。 ヒロキ: 飲み物は何にしますか？ たけし: スーテイチャイにしましょう。すみません、注文をお願いします！",
    "romaji": "",
    "source": "教科書 第１８課 お腹がすいています（Өлсөж байна）",
    "explanation": "飲食店での注文の流れ。「захиалах（注文する）」、「захиалга авах（注文を取る）」、「хуушуур（ホーショール：羊肉の揚げパイ）」という必修定番表現です。"
  },
  {
    "id": "tb_type_l18_tb_18_4",
    "level": "第18課",
    "category": "textbook",
    "categoryLabel": "教科書例文（第18課）",
    "lesson": 18,
    "lessonTitle": "第１８課 お腹がすいています（Өлсөж байна）",
    "textMn": "Монгол хоолны газар ороод цуйван, хуушуур, бууз зэрэг уламжлалт хоолыг захиалж идлээ. Махны амт маш баялаг, порц нь их тул бид бүгдээрээ цадталаа идсэн. Монголчуудын зочломтгой зан чанар, амттай хоол сэтгэлд их хоногшин үлдсэн.",
    "textJa": "モンゴル料理店に入り、ツォイワン（焼きうどん風料理）、ホーショール、ボーズなどの伝統料理を注文して食べました。肉の旨味が大変濃厚で、ボリュームも多いため、私たちは全員お腹いっぱいになるまで食べました。モンゴルの人々の温かいもてなしと美味しい料理が深く心に残りました。",
    "romaji": "",
    "source": "教科書 第１８課 お腹がすいています（Өлсөж байна）",
    "explanation": "モンゴル伝統料理の食レポ文。「цадталаа（満腹になるまで）」、「зочломтгой（もてなし好きな）」、「хоногшин үлдэх（心に深く残る）」などの豊かな情緒表現です。"
  }
];

export const typingSentences = initialTypingSentences;
if (typeof window !== 'undefined') {
  window.typingSentences = initialTypingSentences;
  window.initialTypingSentences = initialTypingSentences;
}

