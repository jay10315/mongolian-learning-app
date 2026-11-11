// ============================================================
// 総合4択模試データ（Монгол хэлний цогц сорилго / 4-Choice Mock Exam）
// すべてモンゴル語で質問される本格的な4択問題集
// ============================================================

export const MOCK_EXAM_STATIC_QUESTIONS = [
  // ------------------------------------------------------------
  // 1. 語彙・意味・反対語・類義語 (Үгсийн сан / Vocabulary)
  // ------------------------------------------------------------
  {
    id: "mock_v_01",
    category: "vocab",
    categoryLabel: "語彙・意味",
    level: "basic",
    question: "«Сургууль» гэдэг үг ямар утгатай вэ?",
    options: ["学校", "病院", "駅", "図書館"],
    correctAnswer: "学校",
    explanation: "«Сургууль» は「学校」という意味の名詞です。「сур-（学ぶ）」という動詞語幹に接尾辞「-гуул/-гүүль」が付いて派生した単語です。",
    points: "сургууль = 学校、эмнэлэг = 病院、өртөө / буудал = 駅、номын сан = 図書館"
  },
  {
    id: "mock_v_02",
    category: "vocab",
    categoryLabel: "反対語",
    level: "basic",
    question: "«Том» гэдэг үгийн эсрэг утгатай үгийг сонгоно уу.",
    options: ["жижиг", "өндөр", "урт", "хүнд"],
    correctAnswer: "жижиг",
    explanation: "«Том» は「大きい」という意味の形容詞です。その対義語（反対語）は「小さい」を意味する «жижиг» です。",
    points: "том (大きい) ⇄ жижиг (小さい)、өндөр (高い)、урт (長い)、хүнд (重い)"
  },
  {
    id: "mock_v_03",
    category: "vocab",
    categoryLabel: "語彙・意味",
    level: "basic",
    question: "«Ном» гэдэг үгийн утга юу вэ?",
    options: ["本", "ペン", "ノート", "机"],
    correctAnswer: "本",
    explanation: "«Ном» は「本・書籍」という意味です。チベット語・サンスクリット語の法（Dharma）に由来する言葉です。",
    points: "ном = 本、үзэг = ペン、дэвтэр = ノート、ширээ = 机"
  },
  {
    id: "mock_v_04",
    category: "vocab",
    categoryLabel: "類義語",
    level: "standard",
    question: "«Баяртай» гэдэг үгтэй хамгийн ойролцоо утгатай үг аль нь вэ?",
    options: ["Дараа уулзъя", "Баярлалаа", "Сайн байна уу", "Уучлаарай"],
    correctAnswer: "Дараа уулзъя",
    explanation: "«Баяртай» は別れ際の挨拶「さようなら」です。「また会いましょう」を意味する «Дараа уулзъя» と同様のシチュエーションで使われます。",
    points: "баяртай = さようなら、дараа уулзъя = また会いましょう、баярлалаа = ありがとう"
  },
  {
    id: "mock_v_05",
    category: "vocab",
    categoryLabel: "曜日・語彙",
    level: "basic",
    question: "«Нэгдэх өдөр» буюу «даваа гараг» нь ямар гараг вэ?",
    options: ["Даваа гараг (月曜日)", "Мягмар гараг (火曜日)", "Баасан гараг (金曜日)", "Ням гараг (日曜日)"],
    correctAnswer: "Даваа гараг (月曜日)",
    explanation: "モンゴル語の曜日は伝統的なチベット語由来の名（даваа гараг）と、数字を用いた口語表現（нэгдэх өдөр＝第1の日）があり、どちらも「月曜日」を指します。",
    points: "нэгдэх өдөр / даваа гараг = 月曜日、хоёр дахь өдөр / мягмар гараг = 火曜日"
  },
  {
    id: "mock_v_06",
    category: "vocab",
    categoryLabel: "動詞・意味",
    level: "standard",
    question: "«Идэх» гэдэг үйл үг ямар утга илэрхийлдэг вэ?",
    options: ["食べる", "飲む", "見る", "聞く"],
    correctAnswer: "食べる",
    explanation: "«Идэх» は動詞の辞書形で「食べる」を意味します。語幹は «ид-» です。",
    points: "идэх = 食べる、уух = 飲む、үзэх / харах = 見る、сонсох = 聞く"
  },
  {
    id: "mock_v_07",
    category: "vocab",
    categoryLabel: "語彙・反対語",
    level: "standard",
    question: "«Халуун» гэдэг үгийн эсрэг утгатай үг аль нь вэ?",
    options: ["хүйтэн", "дулаан", "хурдан", "хямд"],
    correctAnswer: "хүйтэн",
    explanation: "«Халуун» は「熱い・暑い」という意味です。その反対語は「冷たい・寒い」を表す «хүйтэн» です。",
    points: "халуун (暑い・熱い) ⇄ хүйтэн (寒い・冷たい)、дулаан (暖かい)"
  },
  {
    id: "mock_v_08",
    category: "vocab",
    categoryLabel: "形容詞",
    level: "standard",
    question: "«Амттай» гэдэг үгийн утгыг сонгоно уу.",
    options: ["美味しい", "甘い", "辛い", "苦い"],
    correctAnswer: "美味しい",
    explanation: "«Амттай» は「味（амт）」に有属性接尾辞「-тай」が付いた単語で、「美味しい・味がある」という意味です。",
    points: "амттай = 美味しい、чихэрлэг / чихэртэй = 甘い、халуун ногоотой = 辛い"
  },

  // ------------------------------------------------------------
  // 2. 文法・助詞・格変化 (Хэл зүй, Тийн ялгал / Grammar & Particles)
  // ------------------------------------------------------------
  {
    id: "mock_g_01",
    category: "grammar",
    categoryLabel: "格変化・方向格",
    level: "basic",
    question: "Би маргааш Монгол ___ явна. Цэгийн оронд тохирох нөхцөлийг сонгоно уу.",
    options: ["руу", "аас", "д", "тай"],
    correctAnswer: "руу",
    explanation: "「〜へ向かう」という方向を表すには方向格の後置詞 «руу / рүү» を用います。モンゴルは男性語なので «руу» が正解です。",
    points: "Монгол руу явна = モンゴルへ行く。-аас は起点（〜から）、-д は与位格（〜に・で）"
  },
  {
    id: "mock_g_02",
    category: "grammar",
    categoryLabel: "格助詞・属格",
    level: "standard",
    question: "Энэ бол миний найз___ ном. Цэгийн оронд тохирох属格 (нөхцөл) аль нь вэ?",
    options: ["-ын", "-ий", "-ний", "-ыг"],
    correctAnswer: "-ын",
    explanation: "«найз» は子音で終わる男性語（短母音語幹）であり、属格（〜の）は男性語語尾 «-ын» を接続して «найзын ном（友人の本）» となります。",
    points: "найз + ын = найзын (友人の)。-ыг は対格（〜を）"
  },
  {
    id: "mock_g_03",
    category: "grammar",
    categoryLabel: "過去時制",
    level: "basic",
    question: "Би өчигдөр сонирхолтой кино ___. Цэгийн оронд тохирох үгийн хэлбэрийг сонгоно уу.",
    options: ["үзсэн", "үзнэ", "үзэж байна", "үзэх дуртай"],
    correctAnswer: "үзсэн",
    explanation: "文頭に「昨日（өчигдөр）」という過去を表す時間副詞があるため、過去形語尾 «-сан/-сэн/-сон/-сөн» を用いた «үзсэн（見た）» が適切です。",
    points: "өчигдөр үзсэн = 昨日見た、үзнэ = これから見る（未来・確定）、үзэж байна = 見ている（進行形）"
  },
  {
    id: "mock_g_04",
    category: "grammar",
    categoryLabel: "疑問助詞",
    level: "basic",
    question: "«Энэ таны үзэг мөн ___?» Цэгийн оронд тохирох асуух сул үгийг сонгоно уу.",
    options: ["үү", "уу", "бэ", "вэ"],
    correctAnswer: "үү",
    explanation: "Yes/No疑問文で、直前の語「мөн」が女性母音語（өө/ө）であるため、女性語用の疑問助詞 «үү» を用います。",
    points: "男性語: уу, 女性語: үү。疑問詞疑問文には бэ / вэ を使用"
  },
  {
    id: "mock_g_05",
    category: "grammar",
    categoryLabel: "進行形",
    level: "standard",
    question: "Одоо би ном ___. Цэгийн оронд одоо цагт үргэлжилж буй үйлийг илэрхийлэх хэлбэрийг сонгоно уу.",
    options: ["уншиж байна", "уншсан", "уншина", "уншвал"],
    correctAnswer: "уншиж байна",
    explanation: "「今（одоо）」現在進行している動作を表すため、「動詞語幹 ＋ -ж/-ч байна」の現在進行形を用います。унших の語幹 unsh に -ж байна が接続して «уншиж байна（読んでいる）» となります。",
    points: "уншиж байна = 読んでいる、уншсан = 読んだ、уншина = 読む予定だ"
  },
  {
    id: "mock_g_06",
    category: "grammar",
    categoryLabel: "希望・願望",
    level: "standard",
    question: "Би Монгол хоол идэ___ байна. Хүсэх хэлбэрийн нөхцөл аль нь вエ?",
    options: ["-мээр", "-сан", "-ж", "-дэг"],
    correctAnswer: "-мээр",
    explanation: "「〜したい」という願望を表すには「動詞語幹 ＋ -маар/-мээр/-моор/-мөөр байна」を用います。идэх は女性語なので «идмээр байна» となります。",
    points: "идмээр байна = 食べたい、уншмаар байна = 読みたい"
  },
  {
    id: "mock_g_07",
    category: "grammar",
    categoryLabel: "丁寧な命令・依頼",
    level: "standard",
    question: "«Цай уу___!» гэж зочноо хүндэтгэн урихад тохирох нөхцөл аль нь вэ?",
    options: ["-гаарай", "-сан", "-хгүй", "-ж"],
    correctAnswer: "-гаарай",
    explanation: "「〜してください・どうぞ〜してください」という丁寧な招待・命令・助言を表すには「動詞語幹 ＋ -аарай/-ээрэй/-оорой/-өөрэй (母音語幹には -гаарай/-гээрей)」を用います。уу- には «-гаарай» が付きます。",
    points: "Цай уугаарай! = お茶をどうぞ飲んでください！"
  },
  {
    id: "mock_g_08",
    category: "grammar",
    categoryLabel: "動詞語幹判定",
    level: "standard",
    question: "«Бичих» гэдэг үйл үгийн үндэс (яргаа) нь аль вэ?",
    options: ["бич", "бичих", "бичнэ", "бичсэн"],
    correctAnswer: "бич",
    explanation: "動詞辞書形 «бичих（書く）» から不定詞語尾 «-их» を取り除いた語幹（活用の土台）は «бич-» です。",
    points: "辞書形: бичих ➔ 語幹: бич"
  },

  // ------------------------------------------------------------
  // 3. 会話・シチュエーション応答 (Харилцан яриа / Conversation)
  // ------------------------------------------------------------
  {
    id: "mock_c_01",
    category: "conversation",
    categoryLabel: "挨拶と応答",
    level: "basic",
    question: "Хүн танд «Сайн байна уу?» гэж мэндлэхэд та хэрхэн хариулах вэ?",
    options: ["Сайн, та сайн байна уу?", "Баярлалаа", "Баяртай", "Зүгээр ээ"],
    correctAnswer: "Сайн, та сайн байна уу?",
    explanation: "«Сайн байна уу?»（こんにちは）と挨拶されたら、「Сайн, та сайн байна уу?（元気です、あなたもお元気ですか？）」と返すのが最も標準的で丁寧な挨拶です。",
    points: "Сайн байна уу? ➔ Сайн, та сайн байна уу?（こんにちは ➔ 元気です、あなたはお元気ですか？）"
  },
  {
    id: "mock_c_02",
    category: "conversation",
    categoryLabel: "御礼と返答",
    level: "basic",
    question: "Хэн нэгэн танд «Их баярлалаа!» гэж хэлэхэд та юу гэж хариулах нь зөв бэ?",
    options: ["Зүгээр ээ", "Баяртай", "Сайн байна", "Тийм"],
    correctAnswer: "Зүгээр ээ",
    explanation: "「どうもありがとうございます」とお礼を言われた際の返答としては、「どういたしまして・大丈夫ですよ」を意味する «Зүгээр ээ» が使われます。",
    points: "Баярлалаа ➔ Зүгээр ээ（ありがとう ➔ どういたしまして）"
  },
  {
    id: "mock_c_03",
    category: "conversation",
    categoryLabel: "買い物・価格",
    level: "standard",
    question: "Дэлгүүрт барааны үнэ асуухдаа аль өгүүлбэрийг ашиглах вэ?",
    options: ["Энэ ямар үнэтэй вэ?", "Энэ хаана байдаг вэ?", "Та хэн бэ?", "Цаг хэд болж байна вэ?"],
    correctAnswer: "Энэ ямар үнэтэй вэ?",
    explanation: "「これはいくらですか？」と値段を尋ねる表現は «Энэ ямар үнэтэй вэ?» または «Энэ хэд вэ?» です。",
    points: "ямар үнэтэй вэ? = いくらですか、хаана байдаг вэ? = どこにありますか、цаг хэд болж байна вэ? = 何時ですか"
  },
  {
    id: "mock_c_04",
    category: "conversation",
    categoryLabel: "出身・国籍",
    level: "basic",
    question: "«Та хаанаас ирсэн бэ?» гэсэн асуултад хэрхэн зөв хариулах вэ?",
    options: ["Би Японоос ирсэн.", "Би Монголд явна.", "Би 22 настай.", "Би оюутан байна."],
    correctAnswer: "Би Японоос ирсэн.",
    explanation: "«Хаанаас ирсэн бэ?（どこから来ましたか？）» という質問に対しては、出身国に奪格「-аас/-ээс（〜から）」をつけた «Би Японоос ирсэн（私は日本から来ました）» と答えます。",
    points: "Хаанаас ирсэн бэ? = どこから来ましたか ➔ 〜аас ирсэн = 〜から来ました"
  },
  {
    id: "mock_c_05",
    category: "conversation",
    categoryLabel: "初対面・挨拶",
    level: "basic",
    question: "Анх уулзсан хүнтэй танилцахдаа юу гэж хэлдэг вэ?",
    options: ["Танилцсандаа баяртай байна.", "Маргааш уулзъя.", "Зүгээр ээ.", "Оройн мэнд."],
    correctAnswer: "Танилцсандаа баяртай байна.",
    explanation: "初対面の人と挨拶を交わす際、「お会いできて嬉しいです・はじめまして」の意味で «Танилцсандаа баяртай байна» と言います。",
    points: "Танилцсандаа баяртай байна = はじめまして、お会いできて光栄です"
  },

  // ------------------------------------------------------------
  // 4. 口頭試問・自己紹介読解 (Аман шалгалт / Oral Interview Topics)
  // ------------------------------------------------------------
  {
    id: "mock_i_01",
    category: "interview",
    categoryLabel: "自己紹介・出身",
    level: "basic",
    question: "Кахо Японы ямар хотод төрсөн бэ?",
    options: ["Сайтама мужийн Сока хотод", "Токио хотод", "Осака хотод", "Хоккайдод"],
    correctAnswer: "Сайтама мужийн Сока хотод",
    explanation: "自己紹介（Миний тухай）の本文に「Би Сайтама мужийн Сока хотод төрсөн.（私は埼玉県草加市で生まれました）」と書かれています。",
    points: "Сока хот нь Токио хоттой их ойрхон байдаг（草加市は東京ととても近い）"
  },
  {
    id: "mock_i_02",
    category: "interview",
    categoryLabel: "大学・専門分野",
    level: "standard",
    question: "Кахо их сургуульд ямар чиглэлээр суралцсан бэ?",
    options: ["Криминологи буюу гэмт хэрэг судлал", "Эдийн засаг", "Анагаах ухаан", "Монгол судлал"],
    correctAnswer: "Криминологи буюу гэмт хэрэг судлал",
    explanation: "「Би их сургуульд криминологи буюу гэмт хэргийн тухай сурсан.」とあり、犯罪学（クリミノロジー）を専攻しました。",
    points: "гэмт хэрэг, хүүхдийн хөгжил, нийгмийн олон асуудлыг сонирхдог"
  },
  {
    id: "mock_i_03",
    category: "interview",
    categoryLabel: "派遣先・活動地域",
    level: "standard",
    question: "Кахо Монгол улсад очоод ямар аймагт ажиллах вэ?",
    options: ["Дорнод аймагт", "Хэнтий аймагт", "Сэлэнгэ аймагт", "Өмнөговь аймагт"],
    correctAnswer: "Дорнод аймагт",
    explanation: "「Би Монголд очоод, Дорнод аймгийн Чойбалсан хотод байрлах төвд ажиллана.」とあり、ドルノド県チョイバルサン市で活動します。",
    points: "Дорнод аймаг = ドルノド県（モンゴル東部）"
  },
  {
    id: "mock_i_04",
    category: "interview",
    categoryLabel: "配属先機関",
    level: "advanced",
    question: "Кахо Чойбалсан хотод ямар байгууллагад ажиллах вэ?",
    options: [
      "Хүүхэд, гэр бүлийн хөгжил, хамгааллын төв",
      "Улсын нэгдсэн эмнэлэг",
      "Их сургуулийн номын сан",
      "Цэцэрлэгт хүрээлэн"
    ],
    correctAnswer: "Хүүхэд, гэр бүлийн хөгжил, хамгааллын төв",
    explanation: "「Хүүхэд, гэр бүлийн хөгжил, хамгааллын төвд ажиллана.（子ども・家庭開発保護センターで活動します）」と記載されています。",
    points: "хүүхэд (子ども)、гэр бүл (家族)、хөгжил (開発)、хамгаалал (保護)"
  },
  {
    id: "mock_i_05",
    category: "interview",
    categoryLabel: "家族構成",
    level: "standard",
    question: "Кахогийн гэр бүл хэдэн хүнтэй вэ?",
    options: ["Таван хүнтэй", "Гурван хүнтэй", "Дөрвөн хүнтэй", "Зургаан хүнтэй"],
    correctAnswer: "Таван хүнтэй",
    explanation: "トピック2「Манай гэр бүл」に「Манай гэр бүл таван хүнтэй. Эмээ, аав, ээж, ах, бид тав хамт байдаг.」とあり、5人家族です。",
    points: "таван хүнтэй = 5人家族（祖母、父、母、兄、本人）"
  },
  {
    id: "mock_i_06",
    category: "interview",
    categoryLabel: "家族・ペット",
    level: "standard",
    question: "Аав, ээжийн гэрт байдаг хоёр муурын нэр хэн бэ?",
    options: ["Фүкү, Чаби", "Мий, Моо", "Гүү, Барс", "Широ, Куро"],
    correctAnswer: "Фүкү, Чаби",
    explanation: "「Аав, ээжийн гэрт хоёр хөөрхөн муур байдаг. Муурнуудын нэрийг Фүкү, Чаби гэдэг.」とあり、フクとチャビです。（兄の猫はグー）",
    points: "муур = 猫、Фүкү ба Чаби"
  },
  {
    id: "mock_i_07",
    category: "interview",
    categoryLabel: "出身地・特産品",
    level: "standard",
    question: "Сока хот ямар алдартай амттан/хүнсээрээ алдартай вэ?",
    options: ["Сенбэй (цагаан будааны жигнэмэг)", "Рамен гоймон", "Сүши", "Тэнпүра"],
    correctAnswer: "Сенбэй (цагаан будааны жиグнэмэг)",
    explanation: "トピック3「Төрсөн нутгийнхаа тухай」で「Сока хотод сенбэй буюу Японы цагаан будааны жигнэмэг шиг юм байдаг. Сенбэй маш амттай байдаг.」と述べられています。",
    points: "Сока сенбэй = 草加せんべい（草加市の代表的名物）"
  },
  {
    id: "mock_i_08",
    category: "interview",
    categoryLabel: "訓練所生活・スケジュール",
    level: "standard",
    question: "Нихонмацү сургалтын төвд өглөө хэдэн цагт босдог вэ?",
    options: ["Зургаа хагаст (06:30)", "Долоон цагт (07:00)", "Найман цагт (08:00)", "Таван цагт (05:00)"],
    correctAnswer: "Зургаа хагаст (06:30)",
    explanation: "トピック4「Нихонмацү сургалтын төвийн амьдрал」で「Би өглөө бүр зургаа хагаст босдог.」とあり、毎朝6時半に起床します。",
    points: "зургаа хагас = 6時半（06:30）"
  },

  // ------------------------------------------------------------
  // 5. 文化・生活・地理 (Соёл, Ахуй амьдрал / Culture & Daily Life)
  // ------------------------------------------------------------
  {
    id: "mock_cu_01",
    category: "culture",
    categoryLabel: "首都・地理",
    level: "basic",
    question: "Монгол улсын нийслэл хот аль нь вэ?",
    options: ["Улаанбаатар", "Дархан", "Эрдэнэт", "Чойбалсан"],
    correctAnswer: "Улаанбаатар",
    explanation: "モンゴル国の首都（нийслэл）はウランバートル（Улаанбаатар：赤い英雄の意）です。",
    points: "нийслэл = 首都、Улаанбаатар = ウランバートル"
  },
  {
    id: "mock_cu_02",
    category: "culture",
    categoryLabel: "伝統住居",
    level: "basic",
    question: "Монголчуудын уламжлалт нүүдэлчдийн сууцыг юу гэж нэрлэдэг вэ?",
    options: ["Гэр", "Байшин", "Майхан", "Өртөө"],
    correctAnswer: "Гэр",
    explanation: "モンゴル遊牧民の伝統的な移動式住居は «Гэр（ゲル）» と呼ばれます。",
    points: "гэр = 家・ゲル、нүүдэлчин = 遊牧民"
  },
  {
    id: "mock_cu_03",
    category: "culture",
    categoryLabel: "伝統飲料",
    level: "basic",
    question: "Монголчуудын өдөр тутам уудаг сүүтэй уламжлалт цайг юу гэдэг вэ?",
    options: ["Сүүтэй цай", "Айраг", "Шар айраг", "Жүүс"],
    correctAnswer: "Сүүтэй цай",
    explanation: "モンゴルの伝統的なミルクティーは «Сүүтэй цай（スーテイツァイ）» と呼ばれ、塩や少量のバターを入れて日常的に飲まれます。",
    points: "сүүтэй цай = スーテーツァイ（伝統ミルクティー）、айраг = 馬乳酒"
  },
  {
    id: "mock_cu_04",
    category: "culture",
    categoryLabel: "通貨単位",
    level: "basic",
    question: "Монгол улсын үндэсний мөнгөн тэмдэгт (валют) юу вэ?",
    options: ["Төгрөг", "Иен", "Доллар", "Юань"],
    correctAnswer: "Төгрөг",
    explanation: "モンゴル国の通貨単位は «Төгрөг（トゥグルグ / MNT）» です。",
    points: "төгрөг = トゥグルグ（モンゴル通貨）"
  },
  {
    id: "mock_cu_05",
    category: "culture",
    categoryLabel: "五畜・遊牧文化",
    level: "standard",
    question: "Монголын «Таван хошуу мал»-д аль амьтан хамаарахгүй вэ?",
    options: ["Гахай (豚)", "Морь (馬)", "Тэмээ (ラクダ)", "Хонь (羊)"],
    correctAnswer: "Гахай (豚)",
    explanation: "モンゴル遊牧の五畜（Таван хошуу мал）は「馬（морь）、ラクダ（тэмээ）、牛（үхэр）、羊（хонь）、ヤギ（ямаа）」の5種です。豚（гахай）は含まれません。",
    points: "Таван хошуу мал = 五畜（морь, тэмээ, үхэр, хонь, ямаа）"
  },
  {
    id: "mock_cu_06",
    category: "culture",
    categoryLabel: "伝統の祝祭",
    level: "standard",
    question: "Монголын үндэсний их баяр наадмаар ямар гурван уламжлалт спорт болдог вэ?",
    options: [
      "Бөх барилдах, морь уралдах, сур харвах",
      "Хөлбөмбөг, сагсан бөмбөг, гүйлт",
      "Цана, тэшүүр, бөх",
      "Шатар, даам, морь"
    ],
    correctAnswer: "Бөх барилдах, морь уралдах, сур харвах",
    explanation: "毎年7月に開催されるナーダム（Наадам）祭では、「Эрийн гурван наадам（男の三遊戯）」として相撲（бөх）、競馬（морины уралдаан）、弓術（сур харваа）の3競技が行われます。",
    points: "бөх = モンゴル相撲、морь = 競馬、сур = 弓射"
  }
];

/**
 * 語彙・文法データからモンゴル語質問の4択問題を動的生成するヘルパー
 */
export function generateDynamicMockQuestions(vocabList, count = 20) {
  if (!vocabList || vocabList.length < 4) return [];

  const generated = [];
  const validWords = vocabList.filter(w => w.mongolian && w.japanese && w.mongolian.length >= 2);
  const shuffled = [...validWords].sort(() => 0.5 - Math.random());

  for (let i = 0; i < Math.min(count, shuffled.length); i++) {
    const target = shuffled[i];
    
    // 他の単語から誤答選択肢を3つ選定
    const distractorPool = validWords.filter(w => w.id !== target.id && w.japanese !== target.japanese);
    if (distractorPool.length < 3) continue;

    const chosenDistractors = [...distractorPool].sort(() => 0.5 - Math.random()).slice(0, 3);
    const options = [
      target.japanese,
      chosenDistractors[0].japanese,
      chosenDistractors[1].japanese,
      chosenDistractors[2].japanese
    ].sort(() => 0.5 - Math.random());

    const isVerb = target.pos === '動詞' || target.mongolian.endsWith('х');
    const qText = isVerb
      ? `«${target.dictForm || target.mongolian}» гэдэг үйл үгийн утга аль нь вэ?`
      : `«${target.mongolian}» гэдэг үгийн зөв утгыг сонгоно уу.`;

    generated.push({
      id: `dyn_mock_${target.id || i}`,
      category: "vocab",
      categoryLabel: isVerb ? "動詞・意味" : "単語・意味",
      level: target.level || "standard",
      question: qText,
      options: options,
      correctAnswer: target.japanese,
      explanation: `«${target.dictForm || target.mongolian}» は日本語で「${target.japanese}」という意味です。${target.pronunciation ? '【発音: ' + target.pronunciation + '】' : ''}`,
      points: `正解: ${target.mongolian} = ${target.japanese}`
    });
  }

  return generated;
}

/**
 * 指定された設定に基づいて模試問題を抽出・構成する
 */
export function getMockExamQuestions({ count = 20, category = 'all', level = 'all', vocabList = [] } = {}) {
  let pool = [...MOCK_EXAM_STATIC_QUESTIONS];

  // 動的語彙クイズもプールに追加
  if (vocabList && vocabList.length >= 4) {
    const dynamicQuestions = generateDynamicMockQuestions(vocabList, 30);
    pool = [...pool, ...dynamicQuestions];
  }

  // カテゴリフィルタ
  if (category && category !== 'all') {
    pool = pool.filter(q => q.category === category);
  }

  // レベルフィルタ
  if (level && level !== 'all') {
    pool = pool.filter(q => q.level === level);
  }

  // シャッフル
  pool = pool.sort(() => 0.5 - Math.random());

  // 問題数スライス
  if (count === 'all' || count >= pool.length) {
    return pool;
  }
  return pool.slice(0, parseInt(count, 10) || 20);
}
