// 類義語・対義語・語根ファミリー 総合マスターデータ
export const wordFamilyData = {
  // ========================================================
  // 1. 対義語（反意語ペア）マスターリスト (32組)
  // ========================================================
  antonyms: [
    {
      id: "ant_1",
      wordA: "том",
      meaningA: "大きい",
      wordB: "жижиг",
      meaningB: "小さい",
      exampleA: "том байшин (大きい家)",
      exampleB: "жижиг нохой (小さい犬)",
      category: "大きさ・形状"
    },
    {
      id: "ant_2",
      wordA: "хурдан",
      meaningA: "速い",
      wordB: "удаан",
      meaningB: "遅い",
      exampleA: "хурдан морь (速い馬)",
      exampleB: "удаан машин (遅い車)",
      category: "速度"
    },
    {
      id: "ant_3",
      wordA: "халуун",
      meaningA: "熱い・暑い",
      wordB: "хүйтэн",
      meaningB: "冷たい・寒い",
      exampleA: "халуун цай (熱いお茶)",
      exampleB: "хүйтэн ус (冷たい水)",
      category: "温度・気候"
    },
    {
      id: "ant_4",
      wordA: "өндөр",
      meaningA: "高い",
      wordB: "намхан",
      meaningB: "低い",
      exampleA: "өндөр уул (高い山)",
      exampleB: "намхан байшин (低い建物)",
      category: "大きさ・形状"
    },
    {
      id: "ant_5",
      wordA: "үнэтэй",
      meaningA: "高い・高価な",
      wordB: "хямд",
      meaningB: "安い",
      exampleA: "үнэтэй дээл (高価なデール)",
      exampleB: "хямд жимс (安い果物)",
      category: "価値・価格"
    },
    {
      id: "ant_6",
      wordA: "хүнд",
      meaningA: "重い",
      wordB: "хөнгөн",
      meaningB: "軽い",
      exampleA: "хүнд ачаа (重い荷物)",
      exampleB: "хөнгөн цүнх (軽いカバン)",
      category: "重量"
    },
    {
      id: "ant_7",
      wordA: "шинэ",
      meaningA: "新しい",
      wordB: "хуучин",
      meaningB: "古い",
      exampleA: "шинэ ном (新しい本)",
      exampleB: "хуучин машин (古い車)",
      category: "状態"
    },
    {
      id: "ant_8",
      wordA: "баярлах",
      meaningA: "喜ぶ",
      wordB: "гуниглах",
      meaningB: "悲しむ",
      exampleA: "Маш их баярлав. (とても喜んだ)",
      exampleB: "битгий гунигла (悲しまないで)",
      category: "感情・動作"
    },
    {
      id: "ant_9",
      wordA: "урт",
      meaningA: "長い",
      wordB: "богино",
      meaningB: "短い",
      exampleA: "урт зам (長い道)",
      exampleB: "богино үс (短い髪)",
      category: "大きさ・形状"
    },
    {
      id: "ant_10",
      wordA: "өргөн",
      meaningA: "広い",
      wordB: "нарийн",
      meaningB: "狭い・細い",
      exampleA: "өргөн гудамж (広い通り)",
      exampleB: "нарийн зам (細い道)",
      category: "空間・幅"
    },
    {
      id: "ant_11",
      wordA: "зузаан",
      meaningA: "分厚い",
      wordB: "нимгэн",
      meaningB: "薄い",
      exampleA: "зузаан ном (厚い本)",
      exampleB: "нимгэн цаас (薄い紙)",
      category: "厚さ"
    },
    {
      id: "ant_12",
      wordA: "дулаан",
      meaningA: "暖かい",
      wordB: "сэрүүн",
      meaningB: "涼しい",
      exampleA: "дулаан хувцас (暖かい服)",
      exampleB: "сэрүүн салхи (涼しい風)",
      category: "温度・気候"
    },
    {
      id: "ant_13",
      wordA: "сайн",
      meaningA: "良い",
      wordB: "муу",
      meaningB: "悪い",
      exampleA: "сайн хүн (良い人)",
      exampleB: "муу цаг агаар (悪い天気)",
      category: "評価・性質"
    },
    {
      id: "ant_14",
      wordA: "цэвэрхэн",
      meaningA: "綺麗な・清潔な",
      wordB: "бохир",
      meaningB: "汚れた",
      exampleA: "цэвэрхэн өрөө (綺麗な部屋)",
      exampleB: "бохир гар (汚れた手)",
      category: "清潔さ"
    },
    {
      id: "ant_15",
      wordA: "баян",
      meaningA: "裕福な・富裕な",
      wordB: "ядуу",
      meaningB: "貧しい",
      exampleA: "баян айл (裕福な家庭)",
      exampleB: "ядуу амьдрал (貧しい暮らし)",
      category: "社会・経済"
    },
    {
      id: "ant_16",
      wordA: "хэцүү",
      meaningA: "難しい・困難な",
      wordB: "амархан",
      meaningB: "簡単な・易しい",
      exampleA: "хэцүү даалгавар (難しい課題)",
      exampleB: "амархан асуулт (簡単な問題)",
      category: "難易度"
    },
    {
      id: "ant_17",
      wordA: "хүчтэй",
      meaningA: "強い",
      wordB: "сул",
      meaningB: "弱い",
      exampleA: "хүчтэй салхи (強い風)",
      exampleB: "сул дорой (弱々しい)",
      category: "力・強さ"
    },
    {
      id: "ant_18",
      wordA: "зөөлөн",
      meaningA: "柔らかい",
      wordB: "хатуу",
      meaningB: "硬い",
      exampleA: "зөөлөн ор (柔らかいベッド)",
      exampleB: "хатуу мод (硬い木)",
      category: "感触・触感"
    },
    {
      id: "ant_19",
      wordA: "тод",
      meaningA: "鮮やかな・明るい",
      wordB: "бүдэг",
      meaningB: "薄暗い・かすかな",
      exampleA: "тод өнгө (鮮やかな色)",
      exampleB: "бүдэг гэрэл (かすかな光)",
      category: "視覚・明暗"
    },
    {
      id: "ant_20",
      wordA: "явах",
      meaningA: "行く",
      wordB: "ирэх",
      meaningB: "来る",
      exampleA: "сургууль руу явах (学校へ行く)",
      exampleB: "гэртээ ирэх (家に帰ってくる)",
      category: "移動・動詞"
    },
    {
      id: "ant_21",
      wordA: "өгөх",
      meaningA: "与える・あげる",
      wordB: "авах",
      meaningB: "もらう・取る",
      exampleA: "бэлэг өгөх (プレゼントをあげる)",
      exampleB: "бэлэг авах (プレゼントをもらう)",
      category: "授受・動詞"
    },
    {
      id: "ant_22",
      wordA: "худалдах",
      meaningA: "売る",
      wordB: "худалдаж авах",
      meaningB: "買う",
      exampleA: "морь худалдах (馬を売る)",
      exampleB: "талх худалдаж авах (パンを買う)",
      category: "商業・売買"
    },
    {
      id: "ant_23",
      wordA: "нээх",
      meaningA: "開ける",
      wordB: "хаах",
      meaningB: "閉める",
      exampleA: "хаалга нээх (ドアを開ける)",
      exampleB: "цонх хаах (窓を閉める)",
      category: "動作"
    },
    {
      id: "ant_24",
      wordA: "эхлэх",
      meaningA: "始まる・始める",
      wordB: "дуусах",
      meaningB: "終わる・終える",
      exampleA: "хичээл эхлэх (授業が始まる)",
      exampleB: "ажил дуусах (仕事が終わる)",
      category: "時間・開始終了"
    },
    {
      id: "ant_25",
      wordA: "асуух",
      meaningA: "尋ねる・質問する",
      wordB: "хариулах",
      meaningB: "答える",
      exampleA: "багшаас асуух (先生に尋ねる)",
      exampleB: "асуултад хариулах (質問に答える)",
      category: "会話・発話"
    },
    {
      id: "ant_26",
      wordA: "орох",
      meaningA: "入る",
      wordB: "гарах",
      meaningB: "出る",
      exampleA: "гэрт орох (ゲルに入る)",
      exampleB: "гадагш гарах (外へ出る)",
      category: "出入・移動"
    },
    {
      id: "ant_27",
      wordA: "босох",
      meaningA: "起きる・立つ",
      wordB: "суух",
      meaningB: "座る",
      exampleA: "эрт босох (早起きする)",
      exampleB: "сандал дээр суух (椅子に座る)",
      category: "姿勢・動作"
    },
    {
      id: "ant_28",
      wordA: "инээх",
      meaningA: "笑う",
      wordB: "уйлах",
      meaningB: "泣く",
      exampleA: "баяртайгаар инээх (嬉しそうに笑う)",
      exampleB: "чимээгүй уйлах (静かに泣く)",
      category: "感情・表情"
    },
    {
      id: "ant_29",
      wordA: "үнэн",
      meaningA: "真実・本当",
      wordB: "худал",
      meaningB: "嘘・偽り",
      exampleA: "үнэн үг (本当の言葉)",
      exampleB: "худал ярих (嘘をつく)",
      category: "真偽"
    },
    {
      id: "ant_30",
      wordA: "амтат",
      meaningA: "甘い・美味しい",
      wordB: "гашуун",
      meaningB: "苦い",
      exampleA: "амтат жимс (甘い果物)",
      exampleB: "гашуун эм (苦い薬)",
      category: "味覚"
    },
    {
      id: "ant_31",
      wordA: "тод",
      meaningA: "はっきりした",
      wordB: "бүрхэг",
      meaningB: "曇った・曖昧な",
      exampleA: "тод дурсамж (鮮明な記憶)",
      exampleB: "бүрхэг өдөр (曇りの日)",
      category: "状態・天候"
    },
    {
      id: "ant_32",
      wordA: "гэрэлтэй",
      meaningA: "明るい",
      wordB: "харанхуй",
      meaningB: "暗い",
      exampleA: "гэрэлтэй өрөө (明るい部屋)",
      exampleB: "харанхуй шөнө (暗い夜)",
      category: "明暗"
    }
  ],

  // ========================================================
  // 2. 類義語（ニュアンス・使い分け）マスターリスト (16組)
  // ========================================================
  synonyms: [
    {
      id: "syn_1",
      title: "「美しい・素晴らしい」の使い分け",
      words: [
        { word: "сайхан", meaning: "心地よい美しさ、穏やかで素晴らしい（心・自然・性格）" },
        { word: "хөөрхөн", meaning: "可愛らしい、愛嬌がある（子ども・動物・小物）" },
        { word: "гоё", meaning: "華やかで綺麗、おしゃれ、スタイリッシュ（服装・デザイン）" }
      ],
      nuance: "сайхан は心や広大な自然の美しさに使い、хөөрхөн は子犬や子どもなど愛くるしいものに使い、гоё は身なりや装飾品のおしゃれさに使います。",
      question: "広大な大草原や、心の優しい人に出会った時、一番ぴったりの褒め言葉は？",
      options: ["сайхан", "хөөрхөн", "гоё"],
      correctIndex: 0,
      explanation: "雄大な自然や人の内面の美しさ、心地よさには『сайхан』が最適です。"
    },
    {
      id: "syn_2",
      title: "「仕事・労働」の使い分け",
      words: [
        { word: "ажил", meaning: "一般的な仕事、作業、タスク、職業" },
        { word: "хөдөлмөр", meaning: "肉体的・勤労的な労働、骨折り、努力" },
        { word: "алба", meaning: "公務、官公庁の勤務、課せられた義務" }
      ],
      nuance: "日常会話で「仕事に行く」と言う時は ажил を使います。хөдөлмөр は額に汗する労働や努力、алба は公的な職務を指します。",
      question: "毎朝『会社や職場へ仕事に行ってきます！』と言う時の最も一般的な単語は？",
      options: ["алба", "ажил", "хөдөлмөр"],
      correctIndex: 1,
      explanation: "日常会話で職場や毎日の仕事に行く時は『ажилдаа явах (仕事に行く)』と言います。"
    },
    {
      id: "syn_3",
      title: "「別れの挨拶（またね）」の使い分け",
      words: [
        { word: "баяртай", meaning: "さようなら（最も標準的で誰にでも使える）" },
        { word: "дараа уулзъя", meaning: "また会いましょう（近いうちにまた会う親しい間柄）" },
        { word: "маргааш уулзъя", meaning: "また明日会いましょう（翌日会う約束がある時）" }
      ],
      nuance: "баяртай はいつでも使える万能の別れの言葉ですが、親しい友達と翌日また学校や職場で会う時は『маргааш уулзъя』『дараа уулзъя』を使うと親密さが増します。",
      question: "明日学校でまた会うクラスメートに『また明日ね！』と伝えるのに最も自然な表現は？",
      options: ["маргааш уулзъя", "баяртай", "сайн сууж байгаарай"],
      correctIndex: 0,
      explanation: "『маргааш (明日)』＋『уулзъя (会いましょう)』で『また明日ね！』という意味になります。"
    },
    {
      id: "syn_4",
      title: "「食事・食べ物」の使い分け",
      words: [
        { word: "хоол", meaning: "日常の料理、食事全般（温かいメイン料理）" },
        { word: "идээ", meaning: "もてなしの伝統食、白い食べ物（乳製品）や供物" },
        { word: "хүнс", meaning: "食料品、食材、ストック食糧（スーパーで買うもの）" }
      ],
      nuance: "「お昼ご飯を食べる」は хоол идэх です。идээ は遊牧民が客人に振る舞うアーロールなどの乳製品や正月のもてなしを指し、хүнс は食材・食料品の総称です。",
      question: "スーパーマーケットで今週分の『食材・食料品』をまとめ買いする時の言葉は？",
      options: ["хоол", "хүнс", "идээ"],
      correctIndex: 1,
      explanation: "食料品・食材そのものは『хүнс』(хүнсний дэлгүүр = 食料品店) と言います。"
    },
    {
      id: "syn_5",
      title: "「友人・仲間」の使い分け",
      words: [
        { word: "найз", meaning: "友達、一般的な友人" },
        { word: "нөхөр", meaning: "親しい仲間、同志、夫（配偶者）" },
        { word: "анд", meaning: "固い絆で結ばれた無二の親友（義兄弟の契り）" }
      ],
      nuance: "найз は最も一般的な「友達」です。нөхөр は仲間や夫を意味し、анд は歴史的にもチンギス・ハーンとジャムカのように特別な誓いを交わした盟友を指します。",
      question: "学校や職場で親しくなったごく一般的な『友達』を呼ぶ時の単語は？",
      options: ["анд", "найз", "нөхөр"],
      correctIndex: 1,
      explanation: "日常会話で『友達』を表す標準的な言葉は『найз』です。"
    },
    {
      id: "syn_6",
      title: "「話す・言う・語る」の使い分け",
      words: [
        { word: "хэлэх", meaning: "言う、単発の言葉を発する、伝える" },
        { word: "ярих", meaning: "話す、会話する、物語る、おしゃべりする" },
        { word: "өгүүлэх", meaning: "述べる、物語を語り聞かせる（文学的・丁寧）" }
      ],
      nuance: "「名前を言う」は нэрээ хэлэх ですが、「モンゴル語で会話する」は монголоор ярих となります。ярих は双方向の会話やおしゃべりに使います。",
      question: "友達同士でカフェで楽しく『おしゃべりする / 会話する』時の動詞は？",
      options: ["хэлэх", "ярих", "өгүүлэх"],
      correctIndex: 1,
      explanation: "双方向の会話やおしゃべりは『ярих』を使います。"
    },
    {
      id: "syn_7",
      title: "「知る」の使い分け（知識 vs 面識）",
      words: [
        { word: "мэдэх", meaning: "知識・事実として知っている、理解している" },
        { word: "таних", meaning: "人と面識がある、見知っている、見分ける" }
      ],
      nuance: "ニュースや事実は мэдэх で知りますが、「あの人の顔を知っている・友人として知っている」という人に対する面識は таних を使います。",
      question: "『私はバトさんのことを（人として面識があり）よく知っています』と言う時の動詞は？",
      options: ["мэднэ", "танина", "санана"],
      correctIndex: 1,
      explanation: "人と面識がある時は『таних』(Би Батыг сайн танина) を使います。"
    },
    {
      id: "syn_8",
      title: "「住まい」の使い分け（建物 vs 我が家）",
      words: [
        { word: "гэр", meaning: "我が家、家庭、伝統のゲル（心のよりどころ）" },
        { word: "байшин", meaning: "建造物、ビル、家屋、コンクリート住宅" }
      ],
      nuance: "マンションやアパートに住んでいても「家に帰る」と言う時は гэртээ харих と言います。байшин は純粋に物理的な建造物を指します。",
      question: "仕事が終わって『自分の愛する我が家に帰る』と言う時に使う単語は？",
      options: ["байшиндаа харих", "гэртээ харих", "өрөөндөө харих"],
      correctIndex: 1,
      explanation: "住居の形式がアパートであっても、家庭・我が家に帰る時は『гэртээ харих』と言います。"
    },
    {
      id: "syn_9",
      title: "「多い」の使い分け（量・程度 vs 個数）",
      words: [
        { word: "их", meaning: "量・程度が多い、大変な、大きな" },
        { word: "олон", meaning: "数が多い、たくさんの（数えられる人や物）" }
      ],
      nuance: "時間や雨、気持ちなど数えられない量は их (их бороо = 大雨, их цаг = たくさんの時間)、羊や人など個数を数えられるものは олон (олон хонь = たくさんの羊) を使います。",
      question: "草原に『たくさんの羊（数えられる動物）』がいる時に使う形容詞は？",
      options: ["их хонь", "олон хонь", "том хонь"],
      correctIndex: 1,
      explanation: "羊など数えられる名詞の数が多い時は『олон хонь』と言います。"
    },
    {
      id: "syn_10",
      title: "「少ない」の使い分け（量 vs 個数）",
      words: [
        { word: "бага", meaning: "量が少ない、小さい、幼い" },
        { word: "цөөн", meaning: "数がわずかな、少数の（数えられるもの）" }
      ],
      nuance: "水やお金など量は бага ус (少量の水)、参加者や本の冊数など個数が少ない時は цөөн хүн (少数の人) を使います。",
      question: "会議に集まった『参加者の人数（数えられる人）が少ない』時の表現は？",
      options: ["бага хүн", "цөөн хүн", "жижиг хүн"],
      correctIndex: 1,
      explanation: "人数や冊数など可算名詞の数が少ない時は『цөөн』を使います。"
    },
    {
      id: "syn_11",
      title: "「考える・思う・思い出す」の使い分け",
      words: [
        { word: "бодох", meaning: "頭で考える、思案する、思考する" },
        { word: "санах", meaning: "思い出す、懐かしむ、故郷を恋しく思う" }
      ],
      nuance: "算数の問題を解いたり意見を持つ時は бодох ですが、昔のことや家族を思い出して恋しく思う時は санах を使います（ヌタガ サナハ = 望郷）。",
      question: "遠く離れた草原の故郷や家族を『恋しく思い出す』時に使う動詞は？",
      options: ["бодох", "санах", "үзэх"],
      correctIndex: 1,
      explanation: "懐かしく思い出す・恋しく思う時は『санах』を使います。"
    },
    {
      id: "syn_12",
      title: "「速い」の使い分け（スピード vs 迅速さ）",
      words: [
        { word: "хурдан", meaning: "走行速度が速い、足が速い（物理的スピード）" },
        { word: "түргэн", meaning: "迅速な、早急な、テキパキと素早い" }
      ],
      nuance: "競走馬や新幹線が速いのは хурдан морь です。救急車や応急手当、急用で急ぐ時は түргэн тусламж (迅速救護/救急車) のように түргэн を使います。",
      question: "モンゴル語で『救急車』を指す言葉『迅速な救護』に使われる単語は？",
      options: ["хурдан тусламж", "түргэн тусламж", "их тусламж"],
      correctIndex: 1,
      explanation: "緊急の迅速な対応には『түргэн』が使われ、救急車は『түргэн тусламж』と呼ばれます。"
    },
    {
      id: "syn_13",
      title: "「助ける・支援する」の使い分け",
      words: [
        { word: "туслах", meaning: "直接手を貸して手伝う、助ける（荷物を持つ等）" },
        { word: "дэмжих", meaning: "精神的・経済的に支援する、後押しする、賛同する" }
      ],
      nuance: "目の前で困っている人に手を差し伸べる時は туслах です。プロジェクトや方針、友人の夢を応援・支持する時は дэмжих を使います。",
      question: "重い荷物を持っているおばあさんに『手伝いましょうか？』と声をかける時の動詞は？",
      options: ["дэмжих үү?", "туслах уу?", "өгөх үү?"],
      correctIndex: 1,
      explanation: "直接手を貸す手伝いは『туслах (助ける)』を使います。"
    },
    {
      id: "syn_14",
      title: "「飲む」の使い分け（日常語 vs 敬意・もてなし）",
      words: [
        { word: "уух", meaning: "飲む（日常表現）" },
        { word: "зооглох", meaning: "召し上がる、お召し上がりになる（もてなし・敬語）" }
      ],
      nuance: "ゲルの主人が大切なお客様にスーテイツァイを勧める時は「Цайгаа зооглоорой (お茶をお召し上がりください)」と上品な зооглох を使います。",
      question: "ゲルを訪れた大切なお客様に『どうぞお茶をお召し上がりください』と丁寧に勧める言葉は？",
      options: ["Цайгаа уугаарай", "Цайгаа зооглоорой", "Цайгаа аваарай"],
      correctIndex: 1,
      explanation: "おもてなしの場で『召し上がる』という敬意を込める時は『зооглох』を使います。"
    },
    {
      id: "syn_15",
      title: "「正しい・本当」の使い分け",
      words: [
        { word: "үнэн", meaning: "真実、嘘偽りのない客観的事実" },
        { word: "зөв", meaning: "正しい、道徳的・規則に適している、正解" }
      ],
      nuance: "「嘘か本当か」は үнэн ですが、「テストの答えが正解か」「人の行いが正しいか」は зөв を使います。",
      question: "クイズで『あなたの答えは正解です！』と言う時の言葉は？",
      options: ["Үнэн хариулт", "Зөв хариулт", "Сайн хариулт"],
      correctIndex: 1,
      explanation: "正解・的確であることは『зөв (正しい)』を使います。"
    },
    {
      id: "syn_16",
      title: "「質問する・尋ねる」の使い分け",
      words: [
        { word: "асуух", meaning: "尋ねる、質問する、疑問を聞く" },
        { word: "лавлах", meaning: "確認する、問い合わせる、詳細を念押しする" }
      ],
      nuance: "分からないことを質問するのは асуух です。予約の確認や案内所で詳細を確かめる時は лавлах を使います。",
      question: "分からない単語の意味を先生に『質問する』時の一般的な動詞は？",
      options: ["лавлах", "асуух", "ярих"],
      correctIndex: 1,
      explanation: "疑問を質問することは『асуух』を使います。"
    }
  ],

  // ========================================================
  // 3. 語根ファミリー（派生語ツリー）マスターリスト (14語根)
  // ========================================================
  wordFamilies: [
    {
      id: "fam_uz",
      root: "үз-",
      meaning: "見る、体験する",
      pos: "動詞語幹",
      derivatives: [
        { word: "үзэх", meaning: "見る・観る", suffix: "-эх (動詞原形)", note: "最も基本的な動詞" },
        { word: "үзэгч", meaning: "観客・視聴者", suffix: "-эгч (動作を行う人)", note: "映画やコンサートの観客" },
        { word: "үзэсгэлэн", meaning: "展覧会・美しいもの", suffix: "-эсгэлэн (名詞化)", note: "美術展や女性の美称" },
        { word: "үзэгдэх", meaning: "見える・現れる", suffix: "-эгдэх (受動・可能)", note: "星や山が視界に見えること" },
        { word: "үзүүлбэр", meaning: "ショー・出し物・演技", suffix: "-үүлбэр (使役名詞)", note: "サーカスや舞台の演目" },
        { word: "үзэл", meaning: "見解・思想・主義", suffix: "-эл (名詞化)", note: "物事の見方や信念" }
      ]
    },
    {
      id: "fam_yav",
      root: "яв-",
      meaning: "行く、歩む、動く",
      pos: "動詞語幹",
      derivatives: [
        { word: "явах", meaning: "行く・歩く", suffix: "-ах (動詞原形)", note: "移動の基本動詞" },
        { word: "явдал", meaning: "出来事・事件・行い", suffix: "-дал (名詞化)", note: "日常のハプニングや行状" },
        { word: "явуулах", meaning: "行かせる・送る", suffix: "-уулах (使役動詞)", note: "郵便を送る、人を派遣する" },
        { word: "явуулга", meaning: "工作・策動・送り出し", suffix: "-улга (行為名詞)", note: "組織的な働きかけ" },
        { word: "явган", meaning: "徒歩の・歩き", suffix: "-ган (様態形容詞)", note: "歩いて移動する状態" },
        { word: "явагч", meaning: "歩行者・通行人", suffix: "-агч (行為者)", note: "道を歩く人" }
      ]
    },
    {
      id: "fam_khi",
      root: "хий-",
      meaning: "する、作る、成す",
      pos: "動詞語幹",
      derivatives: [
        { word: "хийх", meaning: "する・作る", suffix: "-х (動詞原形)", note: "日常のアクション全般" },
        { word: "хичээл", meaning: "授業・勉学・努力", suffix: "-чээл (勤勉・行為名詞)", note: "語幹 хий- に -чээл が付いて「自らを励むこと」＝授業・勉学" },
        { word: "хийц", meaning: "細工・作り・仕立て", suffix: "-ц (出来栄え名詞)", note: "革や銀細工の作り" },
        { word: "хийгдэх", meaning: "行われる・作られる", suffix: "-гдэх (受身動詞)", note: "イベントや製品が作られる" },
        { word: "хийлгэх", meaning: "させる・作らせる", suffix: "-лгэх (使役動詞)", note: "服を仕立ててもらう時など" },
        { word: "хиймэл", meaning: "人工の・作られた", suffix: "-мэл (受動属性形容詞)", note: "人工知能や人工甘味料" },
        { word: "хийсвэр", meaning: "抽象的な・観念的な", suffix: "-свэр (抽象属性形容詞)", note: "形のない概念" }
      ]
    },
    {
      id: "fam_nom",
      root: "ном",
      meaning: "本、経典、教え",
      pos: "名詞語幹",
      derivatives: [
        { word: "ном", meaning: "本・書籍", suffix: "（基本語幹）", note: "読書の基本" },
        { word: "номлох", meaning: "説教する・教えを説く", suffix: "-лох (動詞化)", note: "教義や道理を説く" },
        { word: "номлогч", meaning: "説教師・伝道者", suffix: "-логч (人名詞)", note: "教えを広める人" },
        { word: "номлол", meaning: "教義・説教・ドクトリン", suffix: "-лол (名詞化)", note: "体系的な教え" },
        { word: "номын сан", meaning: "図書館・図書室", suffix: "-ын сан (属格＋宝庫・集積)", note: "本が集まる場所" },
        { word: "номын санч", meaning: "司書・図書館員", suffix: "-ын санч (属格＋職業人)", note: "図書館で働く人" },
        { word: "номхон", meaning: "おとなしい・従順な", suffix: "-хон (性格形容詞)", note: "教えを守る温和な性質" }
      ]
    },
    {
      id: "fam_ger",
      root: "гэр",
      meaning: "家、家庭、住居",
      pos: "名詞語幹",
      derivatives: [
        { word: "гэр", meaning: "ゲル・我が家", suffix: "（基本語幹）", note: "遊牧民の円形天幕" },
        { word: "гэрлэх", meaning: "結婚する", suffix: "-лэх (動詞化：家庭を持つ)", note: "共に家を築くこと" },
        { word: "гэр бүл", meaning: "家族・家庭", suffix: "-бүл (一門・家族集団)", note: "家庭を共にする家族" },
        { word: "гэрийн", meaning: "家庭の・室内の", suffix: "-ийн (属格・形容詞化)", note: "家畜や宿題など" },
        { word: "гэртээ", meaning: "自宅に（自分の家へ）", suffix: "-тээ (与位格再帰)", note: "我が家に帰る" }
      ]
    },
    {
      id: "fam_khel",
      root: "хэл-",
      meaning: "言葉、言う、舌",
      pos: "名詞・動詞根",
      derivatives: [
        { word: "хэл", meaning: "言語・言葉・舌", suffix: "（基本語幹）", note: "モンゴル語（Монгол хэл）" },
        { word: "хэлэх", meaning: "言う・告げる", suffix: "-эх (動詞原形)", note: "言葉を発すること" },
        { word: "хэллэг", meaning: "表現・言い回し・語法", suffix: "-лэг (名詞化)", note: "日常の慣用表現" },
        { word: "хэлц", meaning: "成句・イディオム", suffix: "-ц (結合名詞)", note: "決まり文句" },
        { word: "хэлэлцэх", meaning: "話し合う・協議する", suffix: "-элцэх (相互動詞)", note: "互いに意見を出し合う" },
        { word: "хэлэлцүүлэг", meaning: "討論・ディスカッション", suffix: "-элцүүлэг (相互使役名詞)", note: "互いに意見を交わすこと" },
        { word: "хэлэлцээр", meaning: "協定・合意・条約", suffix: "-элцээр (結果名詞)", note: "話し合いの結果" },
        { word: "хэлмэрч", meaning: "通訳者", suffix: "-мэрч (専門職業)", note: "異なる言語を仲介する人" },
        { word: "хэлгүй", meaning: "口がきけない・言葉を持たない", suffix: "-гүй (欠如形容詞)", note: "発話できない状態" }
      ]
    },
    {
      id: "fam_bich",
      root: "бич-",
      meaning: "書く、記す",
      pos: "動詞語幹",
      derivatives: [
        { word: "бичих", meaning: "書く・筆記する", suffix: "-их (動詞原形)", note: "文字を書く基本動詞" },
        { word: "бичиг", meaning: "文書・文字・手紙", suffix: "-иг (結果名詞)", note: "公文書や文字" },
        { word: "бичигч", meaning: "書記・筆記者", suffix: "-игч (行為者)", note: "記録を取る人" },
        { word: "бичлэг", meaning: "記録・録音・録画・動画", suffix: "-лэг (成果名詞)", note: "音声や映像のレコーディング" },
        { word: "бичвэр", meaning: "文章・テキスト", suffix: "-вэр (産物名詞)", note: "執筆された本文" },
        { word: "бичүүлэх", meaning: "書かせる・代筆してもらう", suffix: "-үүлэх (使役動詞)", note: "人に文章を書かせる" }
      ]
    },
    {
      id: "fam_unsh",
      root: "унш-",
      meaning: "読む、唱える",
      pos: "動詞語幹",
      derivatives: [
        { word: "унших", meaning: "読む・読書する", suffix: "-их (動詞原形)", note: "文字を目で追って理解する" },
        { word: "уншигч", meaning: "読者", suffix: "-игч (人名詞)", note: "本や新聞を読む人" },
        { word: "уншлага", meaning: "読書・朗読", suffix: "-лага (行為名詞)", note: "朗読会や読書の時間" },
        { word: "уншуулах", meaning: "読ませる", suffix: "-уулах (使役動詞)", note: "生徒に本を読ませる" },
        { word: "уншигдах", meaning: "読まれる", suffix: "-игдах (受動動詞)", note: "世界中で読まれている" }
      ]
    },
    {
      id: "fam_med",
      root: "мэд-",
      meaning: "知る、感じる、認識する",
      pos: "動詞語幹",
      derivatives: [
        { word: "мэдэх", meaning: "知る・分かる", suffix: "-эх (動詞原形)", note: "知識として知ること" },
        { word: "мэдлэг", meaning: "知識・学識", suffix: "-лэг (蓄積名詞)", note: "学習によって得た知識" },
        { word: "мэдлэгтэй", meaning: "知識がある・博学な", suffix: "-тэй (具備形容詞)", note: "教養ある人物" },
        { word: "мэдлэггүй", meaning: "知識がない・無知の", suffix: "-гүй (欠如形容詞)", note: "知識の不足" },
        { word: "мэдэгдэх", meaning: "知らせる・明らかになる", suffix: "-гдэх (使役受動)", note: "公式に発表すること" },
        { word: "мэдэгдэл", meaning: "声明・通知・アナウンス", suffix: "-дэл (公的名詞)", note: "政府や機関の声明" },
        { word: "мэдрэх", meaning: "感じる・知覚する", suffix: "-рэх (感覚動詞)", note: "五感で感じ取ること" },
        { word: "мэдрэмж", meaning: "感覚・感受性・センス", suffix: "-рэмж (感覚名詞)", note: "美意識や第六感" }
      ]
    },
    {
      id: "fam_sur",
      root: "сур-",
      meaning: "学ぶ、習う、慣れる",
      pos: "動詞語幹",
      derivatives: [
        { word: "сурах", meaning: "学ぶ・習得する", suffix: "-ах (動詞原形)", note: "知識や技術を身につける" },
        { word: "сурагч", meaning: "生徒・学習者", suffix: "-агч (学習者)", note: "学校で学ぶ子供たち" },
        { word: "сургах", meaning: "教える・訓練する", suffix: "-гах (使役他動詞)", note: "人に知識を授ける" },
        { word: "сургагч", meaning: "指導者・トレーナー", suffix: "-гч (指導者)", note: "研修のコーチ" },
        { word: "сургалт", meaning: "研修・教育プログラム", suffix: "-лт (過程名詞)", note: "企業研修やセミナー" },
        { word: "суралцах", meaning: "共に学ぶ・学習する", suffix: "-лцах (共同動詞)", note: "大学で専攻を学ぶ" },
        { word: "сургууль", meaning: "学校・学園", suffix: "-гууль (機関名詞)", note: "教育機関の総称" }
      ]
    },
    {
      id: "fam_am",
      root: "амь-",
      meaning: "命、息、生命",
      pos: "名詞語幹",
      derivatives: [
        { word: "амь", meaning: "命・生命", suffix: "（基本語幹）", note: "かけがえのない命" },
        { word: "амьд", meaning: "生きている・生きた", suffix: "-д (状態形容詞)", note: "生命活動があること" },
        { word: "амьдрах", meaning: "生きる・生活する・暮らす", suffix: "-драх (動詞化)", note: "日々を暮らすこと" },
        { word: "амьдрал", meaning: "人生・生活・命の営み", suffix: "-драл (名詞化)", note: "日々の営みや一生" },
        { word: "амьтан", meaning: "動物・生き物", suffix: "-тан (所有・具備者)", note: "命あるすべての生き物" },
        { word: "амьсгал", meaning: "息・呼吸", suffix: "-сгал (生理名詞)", note: "深く息を吸う" },
        { word: "амьсгалах", meaning: "呼吸する・息をする", suffix: "-ах (動詞化)", note: "新鮮な空気を吸う" },
        { word: "амьгүй", meaning: "命がない・無生物の", suffix: "-гүй (欠如形容詞)", note: "生命を宿さない物体" },
        { word: "амьтай", meaning: "命がある・生き生きした", suffix: "-тай (具備形容詞)", note: "生命感にあふれる" }
      ]
    },
    {
      id: "fam_ajil",
      root: "ажил-",
      meaning: "仕事、機能、働く",
      pos: "名詞・動詞根",
      derivatives: [
        { word: "ажил", meaning: "仕事・タスク・職業", suffix: "（基本語幹）", note: "日々の務め" },
        { word: "ажиллах", meaning: "働く・機能する・作動する", suffix: "-лах (動詞化)", note: "会社で働く、機械が動く" },
        { word: "ажилчин", meaning: "労働者・ワーカー", suffix: "-чин (従事者)", note: "工場などで働く人" },
        { word: "ажилтан", meaning: "従業員・スタッフ・職員", suffix: "-тан (従事者)", note: "オフィスの社員" },
        { word: "ажиллагаа", meaning: "活動・オペレーション・作戦", suffix: "-лагаа (大規模行為)", note: "軍事作戦や救助活動" },
        { word: "ажилгүй", meaning: "仕事がない・無職の", suffix: "-гүй (欠如形容詞)", note: "失業状態の" },
        { word: "ажилгүйдэл", meaning: "失業・無職状態", suffix: "-гүйдэл (否定状態名詞)", note: "仕事がない社会状態" }
      ]
    },
    {
      id: "fam_av",
      root: "ав-",
      meaning: "取る、受け取る、買う",
      pos: "動詞語幹",
      derivatives: [
        { word: "авах", meaning: "取る・買う・もらう", suffix: "-ах (動詞原形)", note: "自分のものにする基本動詞" },
        { word: "авалт", meaning: "受取・取得・買入", suffix: "-алт (行為名詞)", note: "品物を受け取ること" },
        { word: "авагч", meaning: "受取人・バイヤー", suffix: "-агч (受動・受取人)", note: "荷物を受け取る人" },
        { word: "авлага", meaning: "債権・受け取るべきお金", suffix: "-лага (権利名詞)", note: "売掛金や未収金" },
        { word: "авуулах", meaning: "取らせる・買わせる", suffix: "-уулах (使役動詞)", note: "人に買わせること" }
      ]
    },
    {
      id: "fam_og",
      root: "өг-",
      meaning: "与える、渡す、贈る",
      pos: "動詞語幹",
      derivatives: [
        { word: "өгөх", meaning: "あげる・手渡す・贈る", suffix: "-өх (動詞原形)", note: "人に差し出す基本動詞" },
        { word: "өгөгч", meaning: "提供者・ドナー", suffix: "-гч (行為者)", note: "寄付やデータを提供する人" },
        { word: "өглөг", meaning: "施し・寄付・チャリティ", suffix: "-лөг (行為名詞)", note: "困っている人に与えるもの" },
        { word: "өгөөмөр", meaning: "寛大な・気前が良い", suffix: "-өөмөр (性格形容詞)", note: "出し惜しみしない温かい心" },
        { word: "өгөгдөл", meaning: "データ・与件・情報", suffix: "-гдөл (所与名詞)", note: "ITや数学のデータ" },
        { word: "өгөөж", meaning: "恵み・実り・リターン", suffix: "-өөж (結果名詞)", note: "大地の恵みや投資の成果" },
        { word: "өгүүлбэр", meaning: "文・センテンス", suffix: "-үүлбэр (使役・名詞化)", note: "語幹 өг-（与える・伝える）に -үүлбэр が付いて「意味を伝達する文章単位」＝文" }
      ]
    },
    {
      id: "fam_tsever",
      root: "цэвэр",
      meaning: "清潔、きれい",
      pos: "形容詞語幹",
      derivatives: [
        { word: "цэвэрлэх", meaning: "掃除する・きれいにする", suffix: "-лэх (動詞化)", note: "ゴミや汚れを取り除く" },
        { word: "цэвэрлэгээ", meaning: "掃除・清掃", suffix: "-лэгээ (行為名詞)", note: "部屋や街の大掃除" },
        { word: "цэвэрлэгч", meaning: "清掃員・クリーナー", suffix: "-лэгч (人・器具名詞)", note: "清掃担当者や洗剤" },
        { word: "цэвэрхэн", meaning: "小奇麗な・すっきりした", suffix: "-хэн (好意・程度形容詞)", note: "身なりが整っている" },
        { word: "цэвэршүүлэх", meaning: "浄化する・精製する", suffix: "-шүүлэх (浄化使役)", note: "水や空気をきれいにする" },
        { word: "цэвэршилт", meaning: "浄化・純化", suffix: "-шилт (過程名詞)", note: "不純物が抜けて澄む過程" }
      ]
    },
    {
      id: "fam_bokhir",
      root: "бохир",
      meaning: "汚い、不潔",
      pos: "形容詞語幹",
      derivatives: [
        { word: "бохирдох", meaning: "汚れる・濁る", suffix: "-дох (動詞化)", note: "服や環境が汚れる" },
        { word: "бохирдуулах", meaning: "汚す・汚染する", suffix: "-дуулах (使役動詞)", note: "大気や水源を汚染する" },
        { word: "бохирдол", meaning: "汚染・汚れ", suffix: "-дол (状態名詞)", note: "環境汚染やスモッグ" },
        { word: "бохирдсон", meaning: "汚染された・汚れた", suffix: "-сон (状態形容詞)", note: "汚れてしまった水や空気" }
      ]
    },
    {
      id: "fam_sain",
      root: "сайн",
      meaning: "良い、善、親愛",
      pos: "形容詞語幹",
      derivatives: [
        { word: "сайхан", meaning: "美しい・素晴らしい", suffix: "-хан (親愛・美称)", note: "心や景色が素晴らしい" },
        { word: "сайжрах", meaning: "良くなる・向上する", suffix: "-жрах (向上動詞)", note: "体調や天気が回復する" },
        { word: "сайжруулах", meaning: "改善する・改良する", suffix: "-руулах (使役動詞)", note: "品質を高める" },
        { word: "сайжруулалт", meaning: "改善・アップグレード", suffix: "-лалт (名詞化)", note: "サービスや製品の改良" }
      ]
    },
    {
      id: "fam_muu",
      root: "муу",
      meaning: "悪い、劣悪",
      pos: "形容詞語幹",
      derivatives: [
        { word: "муудах", meaning: "悪くなる・腐る", suffix: "-дах (動詞化)", note: "人間関係や食品が損なわれる" },
        { word: "муутгах", meaning: "悪化させる", suffix: "-тгах (使役動詞)", note: "状況をさらに悪くする" },
        { word: "муудалт", meaning: "悪化・劣化", suffix: "-далт (名詞化)", note: "経済や健康の悪化" },
        { word: "муулах", meaning: "悪く言う・非難する", suffix: "-лах (他動詞化)", note: "人の悪口を言う" },
        { word: "муухай", meaning: "醜い・不快な・嫌な", suffix: "-хай (否定感情形容詞)", note: "見た目や気分が悪い" }
      ]
    },
    {
      id: "fam_khurd",
      root: "хурд",
      meaning: "速さ、速度",
      pos: "名詞語幹",
      derivatives: [
        { word: "хурдан", meaning: "速い・スピーディーな", suffix: "-ан (形容詞化)", note: "足が速い、新幹線が速い" },
        { word: "хурдлах", meaning: "速く進む・急ぐ", suffix: "-лах (動詞化)", note: "急いで移動する" },
        { word: "хурдасгах", meaning: "加速する・速める", suffix: "-сгах (使役動詞)", note: "速度を上げる" },
        { word: "хурдасгал", meaning: "加速度", suffix: "-гал (物理名詞)", note: "スピードの増加" },
        { word: "хурдтай", meaning: "速度がある・高速の", suffix: "-тай (具備形容詞)", note: "スピード感のある" }
      ]
    },
    {
      id: "fam_udaan",
      root: "удаан",
      meaning: "遅い、長い時間",
      pos: "形容詞語幹",
      derivatives: [
        { word: "удах", meaning: "時間がかかる・長引く", suffix: "-х (動詞化)", note: "時間が長くかかること" },
        { word: "удаашрах", meaning: "遅くなる・減速する", suffix: "-шрах (減速動詞)", note: "進行スピードが落ちる" },
        { word: "удаашруулах", meaning: "遅らせる・延期する", suffix: "-руулах (使役動詞)", note: "計画の実行を遅らせる" },
        { word: "удаашрал", meaning: "減速・遅延", suffix: "-л (名詞化)", note: "経済や運行の遅れ" }
      ]
    },
    {
      id: "fam_ondor",
      root: "өндөр",
      meaning: "高い、高さ",
      pos: "形容詞語幹",
      derivatives: [
        { word: "өндөрлөг", meaning: "高地・高原・高い場所", suffix: "-лөг (空間名詞)", note: "標高の高い高原地帯" },
        { word: "өндөрсөх", meaning: "高くなる・増大する", suffix: "-сөх (上昇動詞)", note: "背や山が高くなる" },
        { word: "өндөрсгөх", meaning: "高くする・引き上げる", suffix: "-сгөх (使役動詞)", note: "堤防や基準を上げる" },
        { word: "өндөржилт", meaning: "高度化・水準向上", suffix: "-жилт (名詞化)", note: "レベルの向上" }
      ]
    },
    {
      id: "fam_baga",
      root: "бага",
      meaning: "少ない、小さい",
      pos: "形容詞語幹",
      derivatives: [
        { word: "багасах", meaning: "減る・小さくなる", suffix: "-сах (減少動詞)", note: "水かさや費用が減る" },
        { word: "багасгах", meaning: "減らす・削減する", suffix: "-сгах (使役動詞)", note: "支出や負担を減らす" },
        { word: "багасгал", meaning: "減少・削減", suffix: "-гал (名詞化)", note: "コストカット" },
        { word: "багахан", meaning: "ほんの少し・わずかな", suffix: "-хан (親愛・程度)", note: "控えめな少なさ" }
      ]
    },
    {
      id: "fam_ikh",
      root: "их",
      meaning: "多い、大きい",
      pos: "形容詞語幹",
      derivatives: [
        { word: "ихсэх", meaning: "増える・多くなる", suffix: "-сэх (増大動詞)", note: "人口や雨量が増える" },
        { word: "ихэсгэх", meaning: "増やす・拡大する", suffix: "-сгэх (使役動詞)", note: "生産量や音量を上げる" },
        { word: "ихэнх", meaning: "大部分・大半", suffix: "-энх (集合名詞)", note: "大半の人々" }
      ]
    },
    {
      id: "fam_shine",
      root: "шинэ",
      meaning: "新しい",
      pos: "形容詞語幹",
      derivatives: [
        { word: "шинэчлэх", meaning: "更新する・改革する", suffix: "-члэх (刷新動詞)", note: "制度や部屋を一新する" },
        { word: "шинэчлэл", meaning: "改革・イノベーション", suffix: "-члэл (改革名詞)", note: "社会改革や刷新" },
        { word: "шинэчлэгч", meaning: "改革者・イノベーター", suffix: "-члэгч (人名詞)", note: "新しい風を吹き込む人" },
        { word: "шинэлэг", meaning: "斬新な・新しい感覚の", suffix: "-лэг (属性形容詞)", note: "革新的なアイデア" },
        { word: "шинэхэн", meaning: "できたての・新鮮な", suffix: "-хэн (新鮮形容詞)", note: "焼きたてパンや新着情報" }
      ]
    },
    {
      id: "fam_khair",
      root: "хайр",
      meaning: "愛、いつくしみ",
      pos: "名詞語幹",
      derivatives: [
        { word: "хайрлах", meaning: "愛する・大切にする", suffix: "-лах (動詞化)", note: "家族やペットを愛する" },
        { word: "хайртай", meaning: "愛している・好きな", suffix: "-тай (所有形容詞)", note: "大切な人への愛情" },
        { word: "хайргүй", meaning: "愛がない・嫌いな", suffix: "-гүй (欠如形容詞)", note: "無関心で冷淡な" },
        { word: "хайрлал", meaning: "愛情・いつくしみ", suffix: "-лал (名詞化)", note: "深い慈愛" },
        { word: "хайрлуулах", meaning: "愛される", suffix: "-луулах (受身動詞)", note: "周囲から大切に思われる" }
      ]
    },
    {
      id: "fam_ai",
      root: "ай-",
      meaning: "恐れる、怖がる",
      pos: "動詞語幹",
      derivatives: [
        { word: "айх", meaning: "怖がる・恐れる", suffix: "-х (動詞原形)", note: "危険やお化けを怖がる" },
        { word: "айдас", meaning: "恐怖・不安", suffix: "-дас (感情名詞)", note: "胸に湧き上がる恐れ" },
        { word: "аймшиг", meaning: "恐ろしさ・ホラー", suffix: "-мшиг (強度名詞)", note: "ゾッとする戦慄" },
        { word: "аймшигтай", meaning: "恐ろしい・凄まじい", suffix: "-тай (形容詞化)", note: "怖い体験や大事故" },
        { word: "аймхай", meaning: "臆病な・怖がりな", suffix: "-мхай (性格形容詞)", note: "小心者の性格" },
        { word: "айлгах", meaning: "怖がらせる・脅かす", suffix: "-лгах (使役動詞)", note: "驚かせて怖がらせる" }
      ]
    },
    {
      id: "fam_itge",
      root: "итгэ-",
      meaning: "信じる、信頼する",
      pos: "動詞語幹",
      derivatives: [
        { word: "итгэх", meaning: "信じる", suffix: "-х (動詞原形)", note: "相手の誠実さを信じる" },
        { word: "итгэл", meaning: "信頼・信念・自信", suffix: "-л (抽象名詞)", note: "未来への希望や確信" },
        { word: "итгэлтэй", meaning: "自信がある・確信した", suffix: "-тэй (形容詞化)", note: "成功を確信している" },
        { word: "итгэлгүй", meaning: "自信がない・疑わしい", suffix: "-гүй (欠如形容詞)", note: "不安で信じられない" },
        { word: "итгэлцэл", meaning: "相互信頼", suffix: "-лцэл (相互名詞)", note: "人と人との絆" },
        { word: "итгэмжлэл", meaning: "委任状・信任", suffix: "-мжлэл (信任名詞)", note: "代理権を与える信任状" }
      ]
    },
    {
      id: "fam_bayar",
      root: "баяр",
      meaning: "喜び、祝祭",
      pos: "名詞語幹",
      derivatives: [
        { word: "баярлах", meaning: "喜ぶ・感謝する", suffix: "-лах (動詞化)", note: "プレゼントに喜ぶ" },
        { word: "баяртай", meaning: "嬉しい・さようなら", suffix: "-тай (形容詞化)", note: "喜びとともに別れる挨拶" },
        { word: "баярлуулах", meaning: "喜ばせる", suffix: "-луулах (使役動詞)", note: "人を笑顔にする" },
        { word: "баясгалан", meaning: "歓喜・幸福", suffix: "-сгалан (歓喜名詞)", note: "あふれる幸せ" }
      ]
    },
    {
      id: "fam_gomd",
      root: "гомд-",
      meaning: "傷つく、不満を持つ",
      pos: "動詞語幹",
      derivatives: [
        { word: "гомдох", meaning: "傷つく・恨む", suffix: "-ох (動詞原形)", note: "裏切られて悲しむ" },
        { word: "гомдол", meaning: "苦情・不服・クレーム", suffix: "-ол (不満名詞)", note: "不服を申し立てる書類" },
        { word: "гомдоллох", meaning: "不満を言う・訴える", suffix: "-лох (動詞化)", note: "行政や裁判所に訴える" },
        { word: "гомдоох", meaning: "傷つける・悲しませる", suffix: "-оох (使役動詞)", note: "人の思いやりを踏みにじる" }
      ]
    },
    {
      id: "fam_zov",
      root: "зов-",
      meaning: "苦しむ、悩む",
      pos: "動詞語幹",
      derivatives: [
        { word: "зовох", meaning: "苦しむ・悩む", suffix: "-ох (動詞原形)", note: "心身の痛みに耐える" },
        { word: "зовлон", meaning: "苦しみ・苦難・受難", suffix: "-лон (苦難名詞)", note: "人生の険しい試練" },
        { word: "зовлонтой", meaning: "苦しい・大変な", suffix: "-той (形容詞化)", note: "つらい生活環境" },
        { word: "зовоох", meaning: "苦しめる・悩ませる", suffix: "-оох (使役動詞)", note: "心配をかける" }
      ]
    },
    {
      id: "fam_taivan",
      root: "тайван",
      meaning: "穏やか、平穏",
      pos: "形容詞語幹",
      derivatives: [
        { word: "тайвшрах", meaning: "落ち着く・安らぐ", suffix: "-шрах (沈静動詞)", note: "呼吸を整えてリラックス" },
        { word: "тайвшруулах", meaning: "落ち着かせる・慰める", suffix: "-руулах (使役動詞)", note: "泣く子供をあやす" },
        { word: "тайвшрал", meaning: "安堵・安心感", suffix: "-л (名詞化)", note: "心が休まること" }
      ]
    },
    {
      id: "fam_bakharkh",
      root: "бахарх-",
      meaning: "誇る、敬服する",
      pos: "動詞語幹",
      derivatives: [
        { word: "бахархах", meaning: "誇りに思う", suffix: "-ах (動詞原形)", note: "仲間の健闘を誇る" },
        { word: "бахархал", meaning: "誇り・自負", suffix: "-ал (名詞化)", note: "胸を張れる功績" },
        { word: "бахархалтай", meaning: "誇らしい・堂々たる", suffix: "-тай (形容詞化)", note: "栄光に満ちた勝利" }
      ]
    },
    {
      id: "fam_erkh",
      root: "эрх",
      meaning: "権利、権能、自由",
      pos: "名詞語幹",
      derivatives: [
        { word: "эрхтэй", meaning: "権利がある", suffix: "-тэй (形容詞化)", note: "発言権を持つ" },
        { word: "эрхгүй", meaning: "権利がない・思わず", suffix: "-гүй (欠如形容詞)", note: "資格がない／思わず涙が出る" },
        { word: "эрхлэх", meaning: "司る・担当する／甘える", suffix: "-лэх (動詞化)", note: "事業を営む／親に甘える" },
        { word: "эрхлүүлэх", meaning: "甘やかす", suffix: "-лүүлэх (使役動詞)", note: "子どもを溺愛する" }
      ]
    },
    {
      id: "fam_khus",
      root: "хүс-",
      meaning: "欲する、望む",
      pos: "動詞語幹",
      derivatives: [
        { word: "хүсэх", meaning: "望む・願う", suffix: "-эх (動詞原形)", note: "未来の成功を願う" },
        { word: "хүсэл", meaning: "願い・望み・欲望", suffix: "-эл (願望名詞)", note: "心からの夢" },
        { word: "хүсэлт", meaning: "申請・リクエスト", suffix: "-лт (要求名詞)", note: "休暇申請や要望書" },
        { word: "хүсэлтэй", meaning: "〜したい・意欲がある", suffix: "-тэй (形容詞化)", note: "学びたい意欲を持つ" }
      ]
    },
    {
      id: "fam_ir",
      root: "ир-",
      meaning: "来る、至る",
      pos: "動詞語幹",
      derivatives: [
        { word: "ирэх", meaning: "来る・到着する", suffix: "-эх (動詞原形)", note: "目的地にやってくる" },
        { word: "ирээдүй", meaning: "未来・将来", suffix: "-ээдүй (未来名詞)", note: "これから訪れる時代" },
        { word: "ирц", meaning: "出席・出席率", suffix: "-ц (出席名詞)", note: "学校や職場の出欠" },
        { word: "ирүүлэх", meaning: "来させる・提出させる", suffix: "-үүлэх (使役動詞)", note: "書類をオフィスに届ける" }
      ]
    },
    {
      id: "fam_or",
      root: "ор-",
      meaning: "入る、降る",
      pos: "動詞語幹",
      derivatives: [
        { word: "орох", meaning: "入る・（雨雪が）降る", suffix: "-ох (動詞原形)", note: "部屋に入る、雨が降る" },
        { word: "оруулах", meaning: "入れる・含める・引用する", suffix: "-уулах (使役動詞)", note: "メンバーに加える" },
        { word: "оролцох", meaning: "参加する・関与する", suffix: "-лцох (相互動詞)", note: "大会に出場する" },
        { word: "оролцоо", meaning: "参加・コミットメント", suffix: "-цоо (参加名詞)", note: "市民の社会参加" },
        { word: "оролцогч", meaning: "参加者・出場者", suffix: "-цогч (人名詞)", note: "セミナーの受講者" }
      ]
    },
    {
      id: "fam_gar_v",
      root: "гар-",
      meaning: "出る、生じる、現れる",
      pos: "動詞語幹",
      derivatives: [
        { word: "гарах", meaning: "出る・昇る・離れる", suffix: "-ах (動詞原形)", note: "部屋を出る、太陽が昇る" },
        { word: "гаргах", meaning: "出す・生み出す", suffix: "-гах (使役動詞)", note: "アイデアや結論を出す" },
        { word: "гаралт", meaning: "出力・アウトプット・出口", suffix: "-лт (名詞化)", note: "工場からの製品出荷" },
        { word: "гарал", meaning: "出自・起源・ルーツ", suffix: "-л (起源名詞)", note: "家系や言葉の成り立ち" }
      ]
    },
    {
      id: "fam_gar_n",
      root: "гар",
      meaning: "手、腕、手作業",
      pos: "名詞語幹",
      derivatives: [
        { word: "гартай", meaning: "手がある・器用な", suffix: "-тай (具備形容詞)", note: "細工に長けた手先" },
        { word: "гарын", meaning: "手の・手元の", suffix: "-ын (属格形容詞)", note: "手のひら・手作業" },
        { word: "гар урлал", meaning: "手工芸・伝統工芸", suffix: "-урлал (工芸名詞)", note: "職人が手で編む革細工" },
        { word: "гар урлаач", meaning: "手工芸職人", suffix: "-урлаач (職人名詞)", note: "手作業の職人" }
      ]
    },
    {
      id: "fam_bari",
      root: "барь-",
      meaning: "持つ、掴む、建てる",
      pos: "動詞語幹",
      derivatives: [
        { word: "барих", meaning: "持つ・捕まえる・建てる", suffix: "-их (動詞原形)", note: "手で握る、家を建設する" },
        { word: "барилга", meaning: "建物・建築物", suffix: "-илга (建築名詞)", note: "ビルや住宅" },
        { word: "барилгачин", meaning: "建設作業員・大工", suffix: "-чин (職業名詞)", note: "家を建てる職人" },
        { word: "баримт", meaning: "証拠・資料・公的文書", suffix: "-имт (具備名詞)", note: "事実を証明する記録" },
        { word: "баримтлах", meaning: "遵守する・従う", suffix: "-лах (動詞化)", note: "法規やマニュアルを守る" }
      ]
    },
    {
      id: "fam_sons",
      root: "сонс-",
      meaning: "聞く、聴く",
      pos: "動詞語幹",
      derivatives: [
        { word: "сонсох", meaning: "聞く・聴取する", suffix: "-ох (動詞原形)", note: "音楽や講義を聴く" },
        { word: "сонсгол", meaning: "聴覚・ヒアリング能力", suffix: "-гол (感覚名詞)", note: "耳の聞こえ" },
        { word: "сонсогдох", meaning: "聞こえる", suffix: "-гдох (受動・可能)", note: "遠くから鐘の音が聞こえる" },
        { word: "сонсогч", meaning: "聴衆・リスナー", suffix: "-гч (人名詞)", note: "ラジオの聴取者" },
        { word: "сонсуулах", meaning: "聞かせる", suffix: "-уулах (使役動詞)", note: "新曲を友人に聞かせる" }
      ]
    },
    {
      id: "fam_bolovs",
      root: "боловс-",
      meaning: "成熟する、加工する",
      pos: "動詞語幹",
      derivatives: [
        { word: "боловсрох", meaning: "成熟する・教育を受ける", suffix: "-рох (動詞原形)", note: "人格や学術が深まる" },
        { word: "боловсрол", meaning: "教育・教養", suffix: "-рол (教育名詞)", note: "学校での教育" },
        { word: "боловсролтой", meaning: "教育を受けた・教養ある", suffix: "-той (形容詞化)", note: "教養豊かな人物" },
        { word: "боловсруулах", meaning: "加工する・策定する", suffix: "-руулах (使役動詞)", note: "データや素材を処理する" },
        { word: "боловсруулалт", meaning: "加工・プロセシング", suffix: "-лалт (名詞化)", note: "鉱物や食品の加工" },
        { word: "боловсронгуй", meaning: "洗練された・高度な", suffix: "-ронгуй (高度形容詞)", note: "完成度の高い仕組み" }
      ]
    },
    {
      id: "fam_oil",
      root: "ойл-",
      meaning: "理解する、わかる",
      pos: "動詞語幹",
      derivatives: [
        { word: "ойлгох", meaning: "理解する・意味を掴む", suffix: "-гох (動詞原形)", note: "理由や概念を理解する" },
        { word: "ойлголт", meaning: "概念・理解・観念", suffix: "-лт (概念名詞)", note: "基本的な捉え方" },
        { word: "ойлгомжтой", meaning: "分かりやすい・明快な", suffix: "-мжтой (容易形容詞)", note: "クリアな解説" },
        { word: "ойлгомжгүй", meaning: "分かりにくい・難解な", suffix: "-мжгүй (難解形容詞)", note: "複雑な文章" },
        { word: "ойлголцох", meaning: "相互理解する", suffix: "-лцох (相互動詞)", note: "腹を割って話し合う" },
        { word: "ойлголцол", meaning: "意思疎通・合意", suffix: "-лцол (相互名詞)", note: "お互いの納得" }
      ]
    },
    {
      id: "fam_san",
      root: "сан-",
      meaning: "思う、記憶する、思い出す",
      pos: "動詞語幹",
      derivatives: [
        { word: "санах", meaning: "思い出す・恋しく思う", suffix: "-ах (動詞原形)", note: "昔の出来事を思い出す" },
        { word: "санаа", meaning: "考え・アイデア・意図", suffix: "-аа (思考名詞)", note: "心に浮かぶひらめき" },
        { word: "санаатай", meaning: "故意の・意図的な", suffix: "-тай (意図形容詞)", note: "意図を持って行うこと" },
        { word: "санаагүй", meaning: "思いがけない・悪気のない", suffix: "-гүй (過失形容詞)", note: "無意識の行動" },
        { word: "санамсаргүй", meaning: "偶然の・ふとした", suffix: "-мсаргүй (偶然副詞)", note: "予期せぬ出会い" },
        { word: "сануулах", meaning: "思い出させる・注意する", suffix: "-уулах (使役動詞)", note: "約束をリマインドする" },
        { word: "сануулга", meaning: "注意・警告・リマインダー", suffix: "-улга (警告名詞)", note: "事前のお報せ" }
      ]
    },
    {
      id: "fam_asuu",
      root: "асуу-",
      meaning: "尋ねる、問う",
      pos: "動詞語幹",
      derivatives: [
        { word: "асуух", meaning: "質問する・尋ねる", suffix: "-х (動詞原形)", note: "先生に質問する" },
        { word: "асуулт", meaning: "質問・設問・クエスチョン", suffix: "-лт (質問名詞)", note: "試験の問題" },
        { word: "асуугч", meaning: "質問者・インタビュアー", suffix: "-гч (人名詞)", note: "問いを発する人" },
        { word: "асуумж", meaning: "アンケート・設問票", suffix: "-мж (調査名詞)", note: "市場調査アンケート" }
      ]
    },
    {
      id: "fam_khari",
      root: "хари-",
      meaning: "返す、答える、戻る",
      pos: "動詞語幹",
      derivatives: [
        { word: "хариу", meaning: "答え・返信・リアクション", suffix: "-у (返答名詞)", note: "手紙や電話の返答" },
        { word: "хариулах", meaning: "答える・返信する", suffix: "-лах (動詞化)", note: "質問に答える" },
        { word: "хариулт", meaning: "回答・アンサー", suffix: "-лт (回答名詞)", note: "正解の回答" },
        { word: "хариуцлага", meaning: "責任・責務", suffix: "-цлага (責任名詞)", note: "重い責任を果たす" },
        { word: "хариуцлагатай", meaning: "責任感のある", suffix: "-тай (形容詞化)", note: "信頼できる社会人" },
        { word: "хариуцлагагүй", meaning: "無責任な", suffix: "-гүй (欠如形容詞)", note: "義務を怠る態度" },
        { word: "хариуцагч", meaning: "担当者・責任者", suffix: "-цагч (人名詞)", note: "窓口担当者" }
      ]
    },
    {
      id: "fam_zokhi",
      root: "зохи-",
      meaning: "適う、調和する、創作する",
      pos: "動詞語幹",
      derivatives: [
        { word: "зохиох", meaning: "創作する・執筆する", suffix: "-ох (創作動詞)", note: "小説や歌を作る" },
        { word: "зохиол", meaning: "作品・小説・文学", suffix: "-ол (作品名詞)", note: "文学作品" },
        { word: "зохиолч", meaning: "作家・著者", suffix: "-олч (職業名詞)", note: "物語を書く作家" },
        { word: "зохиомж", meaning: "構成・プロット・構想", suffix: "-омж (構成名詞)", note: "映画や小説の展開" }
      ]
    },
    {
      id: "fam_khog",
      root: "хөг",
      meaning: "調律、音律、向上・発揚",
      pos: "名詞語幹",
      derivatives: [
        { word: "хөгжих", meaning: "発展する・進歩する", suffix: "-жих (発展動詞)", note: "都市や文明が栄える" },
        { word: "хөгжил", meaning: "発展・進化・進歩", suffix: "-жил (成長名詞)", note: "社会の発展" },
        { word: "хөгжүүлэх", meaning: "発展させる・開発する", suffix: "-жүүлэх (使役動詞)", note: "ソフトウェアを開発する" },
        { word: "хөгжүүлэгч", meaning: "開発者・エンジニア", suffix: "-жүүлэгч (人名詞)", note: "技術開発を行う人" },
        { word: "хөгжүүлэлт", meaning: "開発・ディベロップメント", suffix: "-жүүлэлт (名詞化)", note: "新機能の開発" },
        { word: "хөгжим", meaning: "音楽・楽器", suffix: "-жим (器具名詞)", note: "心地よいメロディ" },
        { word: "хөгжимчин", meaning: "音楽家・演奏家", suffix: "-чин (職業名詞)", note: "ステージで演奏する人" }
      ]
    },
    {
      id: "fam_butee",
      root: "бүтээ-",
      meaning: "作り出す、成就させる",
      pos: "動詞語幹",
      derivatives: [
        { word: "бүтээх", meaning: "作り出す・創造する", suffix: "-х (動詞原形)", note: "新たな価値を創出する" },
        { word: "бүтээл", meaning: "作品・成果・業績", suffix: "-л (成果名詞)", note: "渾身の力作" },
        { word: "бүтээгч", meaning: "創作者・クリエイター", suffix: "-гч (創作者)", note: "コンテンツを生み出す人" },
        { word: "бүтээлч", meaning: "創造的な・クリエイティブな", suffix: "-лч (属性形容詞)", note: "独創的な発想力" },
        { word: "бүтээмж", meaning: "生産性・効率", suffix: "-мж (能率名詞)", note: "仕事のパフォーマンス" }
      ]
    },
    {
      id: "fam_tolov",
      root: "төлөв",
      meaning: "状態、計画、兆候",
      pos: "名詞語幹",
      derivatives: [
        { word: "төлөвлөх", meaning: "計画する・予定を立てる", suffix: "-лөх (動詞化)", note: "旅行の予定を立てる" },
        { word: "төлөвлөгөө", meaning: "計画・プラン", suffix: "-лөгөө (計画名詞)", note: "事業計画" },
        { word: "төлөвлөгч", meaning: "計画者・プランナー", suffix: "-лөгч (人名詞)", note: "企画担当者" },
        { word: "төлөвлөлт", meaning: "企画・プランニング", suffix: "-лөлт (名詞化)", note: "都市計画" },
        { word: "төлөвших", meaning: "成熟する・人格形成される", suffix: "-ших (成長動詞)", note: "大人として成熟する" },
        { word: "төлөвшил", meaning: "人格形成・成熟", suffix: "-шил (成熟名詞)", note: "立派な品格" }
      ]
    },
    {
      id: "fam_us",
      root: "ус",
      meaning: "水",
      pos: "名詞語幹",
      derivatives: [
        { word: "услах", meaning: "水をやる・灌水する", suffix: "-лах (動詞化)", note: "植木や畑に散水する" },
        { word: "усалгаа", meaning: "灌水・水やり", suffix: "-лгаа (行為名詞)", note: "農地への給水" },
        { word: "усалгаатай", meaning: "灌漑設備のある", suffix: "-тай (具備形容詞)", note: "水路の整った美田" },
        { word: "усгүй", meaning: "水がない・乾燥した", suffix: "-гүй (欠如形容詞)", note: "水不足の土地" },
        { word: "усан", meaning: "水の・水上の", suffix: "-ан (連体形容詞)", note: "水上の船" },
        { word: "усжуулах", meaning: "灌漑する・給水する", suffix: "-жуулах (使役動詞)", note: "砂漠に緑を戻す灌漑" }
      ]
    },
    {
      id: "fam_gal",
      root: "гал",
      meaning: "火、炎、熱意",
      pos: "名詞語幹",
      derivatives: [
        { word: "галлах", meaning: "火を起こす・ストーブを焚く", suffix: "-лах (動詞化)", note: "薪で火を焚く" },
        { word: "галлагаа", meaning: "暖房・火の管理", suffix: "-лгаа (行為名詞)", note: "冬の暖房管理" },
        { word: "галтай", meaning: "火がある・情熱的な", suffix: "-тай (形容詞化)", note: "情熱に燃える若者" },
        { word: "галгүй", meaning: "火がない・冷えた", suffix: "-гүй (欠如形容詞)", note: "暖房が切れた部屋" },
        { word: "галын", meaning: "火の・火災の", suffix: "-ын (属格形容詞)", note: "火災予防" }
      ]
    },
    {
      id: "fam_nar",
      root: "нар",
      meaning: "太陽、日光",
      pos: "名詞語幹",
      derivatives: [
        { word: "нарлаг", meaning: "日当たりの良い・晴天の", suffix: "-лаг (日照形容詞)", note: "陽の光が降り注ぐ" },
        { word: "нарлах", meaning: "日光浴をする", suffix: "-лах (動詞化)", note: "草原で日差しを浴びる" },
        { word: "нарны", meaning: "太陽の・ソーラー", suffix: "-ны (属格形容詞)", note: "太陽光発電" }
      ]
    },
    {
      id: "fam_odor",
      root: "өдөр",
      meaning: "日、昼",
      pos: "名詞語幹",
      derivatives: [
        { word: "өдөрлөг", meaning: "催し・イベント・集い", suffix: "-лөг (催事名詞)", note: "文化祭や交流フェス" },
        { word: "өдөржин", meaning: "一日中・終日", suffix: "-жин (時間副詞)", note: "朝から晩まで" },
        { word: "өдрийн", meaning: "日中の・昼の", suffix: "-ийн (属格形容詞)", note: "昼休みのランチ" }
      ]
    },
    {
      id: "fam_shono",
      root: "шөнө",
      meaning: "夜、深夜",
      pos: "名詞語幹",
      derivatives: [
        { word: "шөнөжин", meaning: "一晩中・夜通し", suffix: "-жин (時間副詞)", note: "夜を徹して語り合う" },
        { word: "шөнийн", meaning: "夜の・夜間の", suffix: "-ийн (属格形容詞)", note: "深夜の静寂" }
      ]
    },
    {
      id: "fam_khool",
      root: "хоол",
      meaning: "食事、食べ物",
      pos: "名詞語幹",
      derivatives: [
        { word: "хооллох", meaning: "食事をとる・ご飯を食べる", suffix: "-лох (動詞化)", note: "家族団らんで食事する" },
        { word: "хооллолт", meaning: "栄養摂取・食生活", suffix: "-лт (名詞化)", note: "バランスの良い食生活" },
        { word: "хоолтой", meaning: "食事がある", suffix: "-тай (形容詞化)", note: "ご飯が用意されている" },
        { word: "хоолгүй", meaning: "食べ物がない・空腹の", suffix: "-гүй (欠如形容詞)", note: "お腹をすかせた状態" }
      ]
    },
    {
      id: "fam_bie",
      root: "бие",
      meaning: "身体、個体、自分自身",
      pos: "名詞語幹",
      derivatives: [
        { word: "бие даалт", meaning: "個人課題・自主制作", suffix: "-лт (課題名詞)", note: "自分の力で解く宿題" },
        { word: "бие даасан", meaning: "自立した・独立した", suffix: "-сан (形容詞化)", note: "人に頼らず立つ大人" },
        { word: "бие даагч", meaning: "自立者・無所属候補", suffix: "-гч (人名詞)", note: "自活する人" },
        { word: "биеийн", meaning: "身体の・肉体の", suffix: "-ийн (属格形容詞)", note: "健康診断" }
      ]
    },
    {
      id: "fam_nud",
      root: "нүд",
      meaning: "目、瞳",
      pos: "名詞語幹",
      derivatives: [
        { word: "нүдлэх", meaning: "目に留める・覚える・注視する", suffix: "-лэх (動詞化)", note: "顔や形を目で覚える" },
        { word: "нүдтэй", meaning: "目がある・審美眼のある", suffix: "-тэй (形容詞化)", note: "良い物を見抜く力がある" },
        { word: "нүдгүй", meaning: "目がない・盲目の", suffix: "-гүй (欠如形容詞)", note: "視力のない" },
        { word: "нүдний", meaning: "目の・アイ", suffix: "-ний (属格形容詞)", note: "目の健康や眼鏡" }
      ]
    },
    {
      id: "fam_khund",
      root: "хүнд",
      meaning: "重い、困難な、尊重",
      pos: "形容詞語幹",
      derivatives: [
        { word: "хүндрэх", meaning: "難しくなる・深刻化する", suffix: "-рэх (悪化動詞)", note: "事態や病状がこじれる" },
        { word: "хүндрүүлэх", meaning: "難しくする・悪化させる", suffix: "-рүүлэх (使役動詞)", note: "問題を複雑にする" },
        { word: "хүндрэл", meaning: "困難・障害・トラブル", suffix: "-рэл (困難名詞)", note: "立ちはだかる壁" },
        { word: "хүндэтгэх", meaning: "尊敬する・重んじる", suffix: "-этгэх (敬意動詞)", note: "年長者や恩師を敬う" },
        { word: "хүндэтгэл", meaning: "敬意・リスペクト", suffix: "-этгэл (敬意名詞)", note: "心からの敬意" }
      ]
    },
    {
      id: "fam_khun",
      root: "хүн",
      meaning: "人、人間",
      pos: "名詞語幹",
      derivatives: [
        { word: "хүнлэг", meaning: "人間らしい・思いやりのある", suffix: "-лэг (性質形容詞)", note: "他者を労わる人道的な心" },
        { word: "хүмүүжил", meaning: "しつけ・人格形成・教養", suffix: "-жил (人格形成名詞)", note: "古形 хүмүүн に由来する家庭でのしつけ" },
        { word: "хүмүүжүүлэх", meaning: "育てる・教育する", suffix: "-жүүлэх (使役動詞)", note: "立派な大人へと育てる" },
        { word: "хүмүүжүүлэгч", meaning: "養育者・保育指導員", suffix: "-жүүлэгч (人名詞)", note: "子どもの心を育む先生" }
      ]
    },
    {
      id: "fam_mal",
      root: "мал",
      meaning: "家畜、五畜",
      pos: "名詞語幹",
      derivatives: [
        { word: "маллах", meaning: "家畜を飼う・放牧する", suffix: "-лах (動詞化)", note: "大草原で家畜の世話をする" },
        { word: "малчин", meaning: "牧畜民・遊牧民", suffix: "-чин (職業名詞)", note: "五畜と共に暮らす人々" },
        { word: "малчид", meaning: "牧畜民たち", suffix: "-чид (複数職業)", note: "遊牧コミュニティ" },
        { word: "маллагаа", meaning: "飼育・放牧管理", suffix: "-лагаа (管理名詞)", note: "冬越えの家畜管理" },
        { word: "малжих", meaning: "家畜を所有するようになる", suffix: "-жих (所有動詞)", note: "家畜が増えて豊かになる" },
        { word: "малжуулах", meaning: "家畜を持たせる・支援する", suffix: "-жуулах (使役動詞)", note: "若い牧民に家畜を譲る" }
      ]
    },
    {
      id: "fam_mori",
      root: "морь",
      meaning: "馬、愛馬",
      pos: "名詞語幹",
      derivatives: [
        { word: "морьтой", meaning: "馬に乗った・馬を持つ", suffix: "-той (形容詞化)", note: "愛馬を所有している" },
        { word: "морьгүй", meaning: "馬がない・徒歩の", suffix: "-гүй (欠如形容詞)", note: "乗る馬がいない" },
        { word: "морьчин", meaning: "騎手・馬飼い", suffix: "-чин (職業名詞)", note: "ナーダム競馬の乗り手" },
        { word: "морьд", meaning: "馬たち・駿馬の群れ", suffix: "-д (複数名詞)", note: "草原を駆け抜ける馬群" }
      ]
    },
    {
      id: "fam_khodol",
      root: "хөдөл-",
      meaning: "動く、出発する",
      pos: "動詞語幹",
      derivatives: [
        { word: "хөдлөх", meaning: "動く・出発する", suffix: "-өх (動詞原形)", note: "列車や車が動き出す" },
        { word: "хөдөлгөх", meaning: "動かす", suffix: "-гөх (使役動詞)", note: "重い荷物を移動させる" },
        { word: "хөдөлгөөн", meaning: "動き・運動・交通", suffix: "-гөөн (動作名詞)", note: "身体の動き、街の交通量" },
        { word: "хөдөлгөөнтэй", meaning: "活発な・よく動く", suffix: "-тэй (形容詞化)", note: "元気に跳ね回る子ども" },
        { word: "хөдөлгөөнгүй", meaning: "静止した・動かない", suffix: "-гүй (欠如形容詞)", note: "ピタッと静止する" },
        { word: "хөдөлмөр", meaning: "労働・勤労", suffix: "-мөр (古典名詞)", note: "社会を支える日々の労働" },
        { word: "хөдөлмөрлөх", meaning: "労働する・働く", suffix: "-лөх (動詞化)", note: "誠実に汗を流す" },
        { word: "хөдөлмөрч", meaning: "勤勉な・働き者", suffix: "-ч (属性形容詞)", note: "一生懸命働く人" },
        { word: "хөдөлгүүр", meaning: "エンジン・モーター", suffix: "-гүүр (器具名詞)", note: "車や飛行機の動力機関" }
      ]
    },
    {
      id: "fam_khar",
      root: "хар-",
      meaning: "見る、眺める",
      pos: "動詞語幹",
      derivatives: [
        { word: "харах", meaning: "見る・眺める", suffix: "-ах (動詞原形)", note: "遠くの地平線を見る" },
        { word: "харуулах", meaning: "見せる・提示する", suffix: "-уулах (使役動詞)", note: "写真や証拠を見せる" },
        { word: "харагдах", meaning: "見える・現れる", suffix: "-агдах (受動・可能)", note: "青空に山並みが見える" },
        { word: "хараа", meaning: "視力・視界", suffix: "-аа (感覚名詞)", note: "目の良さ" },
        { word: "харуул", meaning: "見張り・守衛・歩哨", suffix: "-уул (人名詞)", note: "周囲を警戒して見守る人" }
      ]
    }
  ]
};
