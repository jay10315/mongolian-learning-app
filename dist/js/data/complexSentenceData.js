// ========================================================================
// 複文特化モード（Complex Sentence Mastery Mode）マスターデータ
// 10大カテゴリー（A〜J）/ 同一動詞比較 / 6大問題形式 / 完全ランダム組合せ出題エンジン
// ========================================================================

export const COMPLEX_SENTENCE_CATEGORIES = [
  {
    "id": "cat_reason",
    "code": "A",
    "name": "理由・原因・結果",
    "titleJa": "理由・原因・結果",
    "titleMn": "Учир шалтгаан ба үр дагавар",
    "nameMn": "Учир шалтгаан ба үр дагавар",
    "icon": "💡",
    "description": "「〜なので」「〜だから」「〜のため」「その結果」を表す複文構造。",
    "connectives": [
      {
        "mn": "болохоор",
        "ja": "〜なので（状況・自然な成り行き）",
        "suffix": "-даг/-сан болохоор"
      },
      {
        "mn": "учраас",
        "ja": "〜だから（論理的・一般的な理由）",
        "suffix": "-сан/-х учраас"
      },
      {
        "mn": "тул",
        "ja": "〜のため（客観的・公的な理由）",
        "suffix": "-сан/-х тул"
      },
      {
        "mn": "-снаас болж",
        "ja": "〜したせいで（好ましくない結果の原因）",
        "suffix": "-снаас/-снээс болж"
      },
      {
        "mn": "-аас / -ээс болж",
        "ja": "〜が原因で（名詞奪格＋болж）",
        "suffix": "-аас болж"
      }
    ],
    "coreExample": {
      "mn": "Би өвдсөн болохоор сургуульдаа яваагүй.",
      "ja": "体調を崩したので学校に行きませんでした。"
    }
  },
  {
    "id": "cat_contrast",
    "code": "B",
    "name": "逆接・対比",
    "titleJa": "逆接・対比",
    "titleMn": "Эсрэгцэх ба харьцуулах",
    "nameMn": "Эсрэгцэх ба харьцуулах",
    "icon": "⚖️",
    "description": "「しかし」「でも」「一方で」「それに対して」を表す複文構造。",
    "connectives": [
      {
        "mn": "боловч",
        "ja": "〜であるけれど（形式的・文語的な逆接）",
        "suffix": "-вч / -сан боловч"
      },
      {
        "mn": "гэхдээ",
        "ja": "しかし、でも（日常会話の接続副詞）",
        "suffix": "гэхдээ"
      },
      {
        "mn": "гэвч",
        "ja": "しかしながら（強い逆接・文章語）",
        "suffix": "гэвч"
      },
      {
        "mn": "харин",
        "ja": "それに対して、一方で（対比・転換）",
        "suffix": "харин"
      }
    ],
    "coreExample": {
      "mn": "Би явахыг хүссэн боловч завгүй байсан.",
      "ja": "行きたかったけれど、忙しかったです。"
    }
  },
  {
    "id": "cat_condition",
    "code": "C",
    "name": "条件・仮定",
    "titleJa": "条件・仮定",
    "titleMn": "Болзох утга",
    "nameMn": "Болзох утга",
    "icon": "🌱",
    "description": "「もし〜なら」「〜すれば」を表す複文構造。",
    "connectives": [
      {
        "mn": "-вал / -вэл",
        "ja": "〜すれば（母音・р・в語幹）",
        "suffix": "-вал / -вэл"
      },
      {
        "mn": "-бал / -бэл",
        "ja": "〜すれば（子音語幹）",
        "suffix": "-бал / -бэл"
      },
      {
        "mn": "бол",
        "ja": "〜なら（主題・条件小詞）",
        "suffix": "бол"
      },
      {
        "mn": "-сан бол",
        "ja": "〜していたら（過去の仮定・反事実仮定）",
        "suffix": "-сан бол"
      }
    ],
    "coreExample": {
      "mn": "Бороо орвол би гэртээ байна.",
      "ja": "雨が降ったら家にいます。"
    }
  },
  {
    "id": "cat_sequence",
    "code": "D",
    "name": "動作の連続・順序",
    "titleJa": "動作の連続・順序",
    "titleMn": "Үйлдэл дараалах",
    "nameMn": "Үйлдэл дараалах",
    "icon": "⏳",
    "description": "「〜してから〜する」「〜して、それから〜する」を表す複文構造。",
    "connectives": [
      {
        "mn": "-аад / -ээд / -оод / -өөд",
        "ja": "〜してから（先行動作の完了後次へ）",
        "suffix": "-аад"
      },
      {
        "mn": "-гаад / -гээд",
        "ja": "〜してから（母音終わり動詞）",
        "suffix": "-гаад"
      },
      {
        "mn": "-ж / -ч",
        "ja": "〜して、〜しながら（緊密な連続・付帯動作）",
        "suffix": "-ж / -ч"
      }
    ],
    "coreExample": {
      "mn": "Би хоолоо идээд сургууль руу явсан.",
      "ja": "ご飯を食べてから学校へ行きました。"
    }
  },
  {
    "id": "cat_time",
    "code": "E",
    "name": "時間・状況",
    "titleJa": "時間・状況",
    "titleMn": "Цаг хугацаа ба нөхцөл байдал",
    "nameMn": "Цаг хугацаа ба нөхцөл байдал",
    "icon": "⏰",
    "description": "「〜するとき」「〜したとき」「〜している間」「〜するや否や」を表す複文構造。",
    "connectives": [
      {
        "mn": "-хад / -хэд",
        "ja": "〜する時（主語不一致時）",
        "suffix": "-хад / -хэд"
      },
      {
        "mn": "-хдаа / -хдээ",
        "ja": "〜する時（同一主語時）",
        "suffix": "-хдаа / -хдээ"
      },
      {
        "mn": "-х үед / -сан үед",
        "ja": "〜する時、〜した時（具体的な時・瞬間）",
        "suffix": "-х үед"
      },
      {
        "mn": "-магц / -мэгц",
        "ja": "〜するや否や（直後の即時生起）",
        "suffix": "-магц / -мэгц"
      },
      {
        "mn": "-тал / -тэл",
        "ja": "〜するまで、〜しているうちに（継続・限度）",
        "suffix": "-тал / -тэл"
      }
    ],
    "coreExample": {
      "mn": "Би гэртээ ирэхэд ээж хоол хийж байсан.",
      "ja": "私が家に帰ったとき、母は料理をしていました。"
    }
  },
  {
    "id": "cat_relation",
    "code": "F",
    "name": "前後関係",
    "titleJa": "前後関係",
    "titleMn": "Өмнөх ба дараах харьцаа",
    "nameMn": "Өмнөх ба дараах харьцаа",
    "icon": "🔄",
    "description": "「〜する前に」「〜した後で」を表す複文構造。",
    "connectives": [
      {
        "mn": "-хаас өмнө",
        "ja": "〜する前に（形動詞奪格＋өмнө）",
        "suffix": "-хаас өмнө"
      },
      {
        "mn": "-хын өмнө",
        "ja": "〜する前に（形動詞属格＋өмнө）",
        "suffix": "-хын өмнө"
      },
      {
        "mn": "-сны дараа",
        "ja": "〜した後に（完了形属格＋дараа）",
        "suffix": "-сны дараа"
      },
      {
        "mn": "-сныхаа дараа",
        "ja": "自分が〜した後に（再帰所有＋дараа）",
        "suffix": "-сныхаа дараа"
      }
    ],
    "coreExample": {
      "mn": "Би хоол идсэний дараа ном уншсан.",
      "ja": "食事をした後、本を読みました。"
    }
  },
  {
    "id": "cat_noun_mod",
    "code": "G",
    "name": "動詞による名詞修飾",
    "titleJa": "動詞による名詞修飾",
    "titleMn": "Үйл үгээр нэр үг тодотгох",
    "nameMn": "Үйл үгээр нэр үг тодотгох",
    "icon": "🏷️",
    "description": "「〜した人」「〜する本」「〜が作った料理」などの関係節（連体修飾）構造。",
    "connectives": [
      {
        "mn": "-сан / -сэн / -сон / -сөн",
        "ja": "〜した（完了・過去の連体修飾）",
        "suffix": "-сан + 名詞"
      },
      {
        "mn": "-даг / -дэг / -дог / -дөг",
        "ja": "いつも〜する（習慣・性質の連体修飾）",
        "suffix": "-даг + 名詞"
      },
      {
        "mn": "-х",
        "ja": "〜する、〜すべき（未来・一般的な連体修飾）",
        "suffix": "-х + 名詞"
      }
    ],
    "coreExample": {
      "mn": "Ээжийн хийсэн хоол амттай.",
      "ja": "母が作った料理はおいしいです。"
    }
  },
  {
    "id": "cat_purpose",
    "code": "H",
    "name": "目的・意図",
    "titleJa": "目的・意図",
    "titleMn": "Зорилго ба санаархал",
    "nameMn": "Зорилго ба санаархал",
    "icon": "🎯",
    "description": "「〜するために」「〜しようとして」を表す複文構造。",
    "connectives": [
      {
        "mn": "-хын тулд",
        "ja": "〜するために（本格的・公式な目的）",
        "suffix": "-хын тулд"
      },
      {
        "mn": "-хаар / -хээр",
        "ja": "〜しに（移動動詞直結の日常目的）",
        "suffix": "-хаар / -хээр"
      },
      {
        "mn": "-х гэж",
        "ja": "〜しようと思って、〜するために（意志・引用）",
        "suffix": "-х гэж"
      }
    ],
    "coreExample": {
      "mn": "Би монгол хэл сурахын тулд Монголд ирсэн.",
      "ja": "モンゴル語を勉強するためにモンゴルへ来ました。"
    }
  },
  {
    "id": "cat_quote",
    "code": "I",
    "name": "追加説明・引用・思考",
    "titleJa": "追加説明・引用・思考",
    "titleMn": "Оруулбар ба бодол санаа",
    "nameMn": "Оруулбар ба бодол санаа",
    "icon": "💬",
    "description": "「〜と言った」「〜と思う」「〜ということ」を表す複文構造。",
    "connectives": [
      {
        "mn": "гэж",
        "ja": "〜と（思考・発話の直接・間接引用）",
        "suffix": "гэж"
      },
      {
        "mn": "гэдэг",
        "ja": "〜という（名詞修飾）",
        "suffix": "гэдэг + 名詞"
      },
      {
        "mn": "гэж бодох",
        "ja": "〜と思う",
        "suffix": "гэж бодох"
      },
      {
        "mn": "гэж хэлэх",
        "ja": "〜と言う",
        "suffix": "гэж хэлэх"
      },
      {
        "mn": "гэж асуух",
        "ja": "〜と尋ねる",
        "suffix": "гэж асуух"
      }
    ],
    "coreExample": {
      "mn": "Би маргааш явна гэж бодож байна.",
      "ja": "私は明日行くと思っています。"
    }
  },
  {
    "id": "cat_habit",
    "code": "J",
    "name": "習慣・一般的な関係",
    "titleJa": "習慣・一般的な関係",
    "titleMn": "Хэвшил ба ерөнхий хамаарал",
    "nameMn": "Хэвшил ба ерөнхий хамаарал",
    "icon": "🔁",
    "description": "日常的な習慣（いつも〜する人・場所・こと）を表す複文構造。",
    "connectives": [
      {
        "mn": "-даг хүн",
        "ja": "〜する人（習慣・職業・性質）",
        "suffix": "-даг хүн"
      },
      {
        "mn": "-даг газар",
        "ja": "〜する場所",
        "suffix": "-даг газар"
      },
      {
        "mn": "-даг зүйл",
        "ja": "〜するもの・こと",
        "suffix": "-даг зүйл"
      },
      {
        "mn": "-даггүй",
        "ja": "〜しない（習慣の否定）",
        "suffix": "-даггүй"
      }
    ],
    "coreExample": {
      "mn": "Ном уншдаг хүн ухаантай болно.",
      "ja": "本を読む人は賢くなります。"
    }
  }
];

export const SAME_VERB_COMPARISONS = [
  {
    "verb": "идэх",
    "meaning": "食べる",
    "stem": "ид-",
    "vowelType": "female",
    "forms": [
      {
        "form": "идээд",
        "meaningJa": "食べてから",
        "category": "cat_sequence",
        "suffix": "-ээд",
        "exampleMn": "Би өглөөний цайгаа идээд гарсан.",
        "exampleJa": "私は朝食を食べてから出かけました。"
      },
      {
        "form": "идэхэд",
        "meaningJa": "食べるとき（主語不一致）",
        "category": "cat_time",
        "suffix": "-хэд",
        "exampleMn": "Хүүхдийг хоол идэхэд ээж нь туслав.",
        "exampleJa": "子供が食事をするとき、母親が手伝いました。"
      },
      {
        "form": "идэхдээ",
        "meaningJa": "食べるとき（同一主語）",
        "category": "cat_time",
        "suffix": "-хдээ",
        "exampleMn": "Би хоол идэхдээ утсаа хардаггүй.",
        "exampleJa": "私は食事をするときスマホを見ません。"
      },
      {
        "form": "идсэн",
        "meaningJa": "食べた（完了・連体修飾）",
        "category": "cat_noun_mod",
        "suffix": "-сэн",
        "exampleMn": "Өчигдөр идсэн хоол амттай байсан.",
        "exampleJa": "昨日食べた料理はおいしかったです。"
      },
      {
        "form": "идсэн хүн",
        "meaningJa": "食べた人（連体形修飾）",
        "category": "cat_noun_mod",
        "suffix": "-сэн + хүн",
        "exampleMn": "Энэ бялууг идсэн хүн гар өргөнө үү.",
        "exampleJa": "このケーキを食べた人は手を挙げてください。"
      },
      {
        "form": "идэхээс өмнө",
        "meaningJa": "食べる前に",
        "category": "cat_relation",
        "suffix": "-хээс өмнө",
        "exampleMn": "Хоол идэхээс өмнө гараа угаах хэрэгтэй.",
        "exampleJa": "食事をする前に手を洗わなければなりません。"
      },
      {
        "form": "идсэний дараа",
        "meaningJa": "食べた後に",
        "category": "cat_relation",
        "suffix": "-сний дараа",
        "exampleMn": "Хоол идсэний дараа аяга тавгаа угаав.",
        "exampleJa": "食事をした後、食器を洗いました。"
      },
      {
        "form": "идвэл",
        "meaningJa": "食べれば、食べたら",
        "category": "cat_condition",
        "suffix": "-вэл",
        "exampleMn": "Энэ эм ууж, сайн идвэл хурдан эдгэрнэ.",
        "exampleJa": "この薬を飲んでしっかり食べれば早く治ります。"
      },
      {
        "form": "идэхээр",
        "meaningJa": "食べに（目的）",
        "category": "cat_purpose",
        "suffix": "-хээр",
        "exampleMn": "Бид бууз идэхээр зоогийн газар луу явлаа.",
        "exampleJa": "私たちはボーズを食べにレストランへ行きました。"
      },
      {
        "form": "идэх гэж",
        "meaningJa": "食べようと思って、食べるために",
        "category": "cat_purpose",
        "suffix": "-х гэж",
        "exampleMn": "Би өлсөөд ямар нэг юм идэх гэж дэлгүүр орсон.",
        "exampleJa": "お腹が空いて何か食べようと思って店に入りました。"
      },
      {
        "form": "иддэг",
        "meaningJa": "いつも食べる（習慣）",
        "category": "cat_habit",
        "suffix": "-дэг",
        "exampleMn": "Би өглөө бүр алим иддэг.",
        "exampleJa": "私は毎朝りんごを食べます。"
      },
      {
        "form": "идсэн болохоор",
        "meaningJa": "食べたので（理由）",
        "category": "cat_reason",
        "suffix": "-сэн болохоор",
        "exampleMn": "Би өглөө сайн идсэн болохоор өлсөхгүй байна.",
        "exampleJa": "朝しっかり食べたのでお腹が空いていません。"
      },
      {
        "form": "идэх боловч",
        "meaningJa": "食べるけれど（逆接）",
        "category": "cat_contrast",
        "suffix": "-х боловч",
        "exampleMn": "Хоол сайн идэх боловч таргалдаггүй.",
        "exampleJa": "ご飯をよく食べるけれど太りません。"
      }
    ]
  },
  {
    "verb": "явах",
    "meaning": "行く",
    "stem": "яв-",
    "vowelType": "male",
    "forms": [
      {
        "form": "яваад",
        "meaningJa": "行ってから",
        "category": "cat_sequence",
        "suffix": "-аад",
        "exampleMn": "Би Монголд яваад ирсэн.",
        "exampleJa": "私はモンゴルに行って帰ってきました。"
      },
      {
        "form": "явахдаа",
        "meaningJa": "行く時（同一主語）",
        "category": "cat_time",
        "suffix": "-хдаа",
        "exampleMn": "Би сургууль руу явахдаа найзтайгаа таарсан.",
        "exampleJa": "学校へ行く時に友達と偶然会いました。"
      },
      {
        "form": "явахад",
        "meaningJa": "行く時（主語不一致）",
        "category": "cat_time",
        "suffix": "-хад",
        "exampleMn": "Түүнийг явахад бид үдэн гаргав.",
        "exampleJa": "彼が出発する時、私たちが見送りました。"
      },
      {
        "form": "явсан",
        "meaningJa": "行った（完了・連体修飾）",
        "category": "cat_noun_mod",
        "suffix": "-сан",
        "exampleMn": "Өчигдөр явсан газар сайхан байсан.",
        "exampleJa": "昨日行った場所は素晴らしかったです。"
      },
      {
        "form": "явдаг хүн",
        "meaningJa": "いつも行く人",
        "category": "cat_habit",
        "suffix": "-даг хүн",
        "exampleMn": "Энэ замаар өдөр бүр явдаг хүн байна уу?",
        "exampleJa": "この道を毎日通る（行く）人はいますか？"
      },
      {
        "form": "явахаас өмнө",
        "meaningJa": "行く前に",
        "category": "cat_relation",
        "suffix": "-хаас өмнө",
        "exampleMn": "Гэрээсээ явахаас өмнө гэрлээ унтраагаарай.",
        "exampleJa": "家を出る（行く）前に電気を消してくださいね。"
      },
      {
        "form": "явсны дараа",
        "meaningJa": "行った後に",
        "category": "cat_relation",
        "suffix": "-сны дараа",
        "exampleMn": "Түүнийг явсны дараа бороо орсон.",
        "exampleJa": "彼が行った（出発した）後に雨が降りました。"
      },
      {
        "form": "явбал",
        "meaningJa": "行けば、行ったら",
        "category": "cat_condition",
        "suffix": "-бал",
        "exampleMn": "Хамт явбал илүү сонирхолтой болно.",
        "exampleJa": "一緒に行けばもっと面白くなります。"
      },
      {
        "form": "явах гэж",
        "meaningJa": "行こうと思って",
        "category": "cat_quote",
        "suffix": "-х гэж",
        "exampleMn": "Би маргааш хөдөө явах гэж байна.",
        "exampleJa": "私は明日田舎へ行こうと思っています。"
      },
      {
        "form": "явсан болохоор",
        "meaningJa": "行ったので",
        "category": "cat_reason",
        "suffix": "-сан болохоор",
        "exampleMn": "Би өчигдөр тийшээ явсан болохоор замаа мэднэ.",
        "exampleJa": "昨日そこへ行ったので道を知っています。"
      },
      {
        "form": "явах боловч",
        "meaningJa": "行くけれど",
        "category": "cat_contrast",
        "suffix": "-х боловч",
        "exampleMn": "Очихыг хүсэх боловч завгүй байна.",
        "exampleJa": "行きたいけれど忙しいです。"
      }
    ]
  },
  {
    "verb": "унших",
    "meaning": "読む",
    "stem": "унш-",
    "vowelType": "male",
    "forms": [
      {
        "form": "уншаад",
        "meaningJa": "読んでから",
        "category": "cat_sequence",
        "suffix": "-аад",
        "exampleMn": "Би энэ номыг уншаад маш их зүйл ойлгов.",
        "exampleJa": "私はこの本を読んでから多くのことを理解しました。"
      },
      {
        "form": "уншихад",
        "meaningJa": "読む時",
        "category": "cat_time",
        "suffix": "-хад",
        "exampleMn": "Монгол ном уншихад толь бичиг хэрэгтэй.",
        "exampleJa": "モンゴル語の本を読む時には辞書が必要です。"
      },
      {
        "form": "уншсан",
        "meaningJa": "読んだ（完了）",
        "category": "cat_noun_mod",
        "suffix": "-сан",
        "exampleMn": "Миний уншсан өгүүллэг сэтгэл хөдөлгөм байв.",
        "exampleJa": "私の読んだ短編小説は感動的でした。"
      },
      {
        "form": "уншдаг хүн",
        "meaningJa": "よく読む人",
        "category": "cat_habit",
        "suffix": "-даг хүн",
        "exampleMn": "Ном их уншдаг хүн үгийн баялаг ихтэй.",
        "exampleJa": "本をたくさん読む人は語彙が豊富です。"
      },
      {
        "form": "уншихаас өмнө",
        "meaningJa": "読む前に",
        "category": "cat_relation",
        "suffix": "-хаас өмнө",
        "exampleMn": "Ном уншихаас өмнө гарчигийг харна уу.",
        "exampleJa": "本を読む前に目次を見てください。"
      },
      {
        "form": "уншсаны дараа",
        "meaningJa": "読んだ後に",
        "category": "cat_relation",
        "suffix": "-сны дараа",
        "exampleMn": "Нийтлэлийг уншсаны дараа санал бодлоо хуваалцъя.",
        "exampleJa": "記事を読んだ後に意見を共有しましょう。"
      },
      {
        "form": "уншвал",
        "meaningJa": "読めば",
        "category": "cat_condition",
        "suffix": "-вал",
        "exampleMn": "Энэ номыг уншвал чи заавал ойлгоно.",
        "exampleJa": "この本を読めば君は必ず理解できます。"
      },
      {
        "form": "уншихаар",
        "meaningJa": "読みに",
        "category": "cat_purpose",
        "suffix": "-хаар",
        "exampleMn": "Номын санд ном уншихаар ирлээ.",
        "exampleJa": "図書館に本を読みに来ました。"
      }
    ]
  },
  {
    "verb": "хийх",
    "meaning": "する、作る",
    "stem": "хий-",
    "vowelType": "female",
    "forms": [
      {
        "form": "хийгээд",
        "meaningJa": "してから、作ってから",
        "category": "cat_sequence",
        "suffix": "-гээд",
        "exampleMn": "Даалгавраа хийгээд гадаа тоглосон.",
        "exampleJa": "宿題をしてから外で遊びました。"
      },
      {
        "form": "хийхэд",
        "meaningJa": "する時、作る時",
        "category": "cat_time",
        "suffix": "-хэд",
        "exampleMn": "Хоол хийхэд давс дутав.",
        "exampleJa": "料理を作る時に塩が足りなくなりました。"
      },
      {
        "form": "хийсэн",
        "meaningJa": "した、作った",
        "category": "cat_noun_mod",
        "suffix": "-сэн",
        "exampleMn": "Ээжийн хийсэн хоол хамгийн амттай.",
        "exampleJa": "母が作った料理が一番おいしいです。"
      },
      {
        "form": "хийдэг газар",
        "meaningJa": "いつも作る場所",
        "category": "cat_habit",
        "suffix": "-дэг газар",
        "exampleMn": "Энэ бол монгол гутал хийдэг газар юм.",
        "exampleJa": "ここはモンゴルブーツを作る場所です。"
      },
      {
        "form": "хийхээс өмнө",
        "meaningJa": "する前に",
        "category": "cat_relation",
        "suffix": "-хээс өмнө",
        "exampleMn": "Ажил хийхээс өмнө төлөвлөгөө гаргаарай.",
        "exampleJa": "仕事をする前に計画を立ててください。"
      },
      {
        "form": "хийсний дараа",
        "meaningJa": "した後に",
        "category": "cat_relation",
        "suffix": "-сний дараа",
        "exampleMn": "Дасгал хийсний дараа ус уух сайн.",
        "exampleJa": "運動をした後に水を飲むのは良いことです。"
      },
      {
        "form": "хийвэл",
        "meaningJa": "すれば",
        "category": "cat_condition",
        "suffix": "-вэл",
        "exampleMn": "Хичээлээ сайн хийвэл шалгалтад тэнцэнэ.",
        "exampleJa": "勉強をしっかりすれば試験に合格します。"
      },
      {
        "form": "хийх гэж",
        "meaningJa": "しようと思って",
        "category": "cat_purpose",
        "suffix": "-х гэж",
        "exampleMn": "Би хоол хийх гэж ногоо авлаа.",
        "exampleJa": "料理を作ろうと思って野菜を買いました。"
      }
    ]
  },
  {
    "verb": "үзэх",
    "meaning": "見る、観る",
    "stem": "үз-",
    "vowelType": "female",
    "forms": [
      {
        "form": "үзээд",
        "meaningJa": "見てから",
        "category": "cat_sequence",
        "suffix": "-ээд",
        "exampleMn": "Кино үзээд кофе уухаар явав.",
        "exampleJa": "映画を見てからコーヒーを飲みに行きました。"
      },
      {
        "form": "үзэхэд",
        "meaningJa": "見る時",
        "category": "cat_time",
        "suffix": "-хэд",
        "exampleMn": "Энэ зургийг үзэхэд нутаг санагддаг.",
        "exampleJa": "この写真を見る時、故郷が思い出されます。"
      },
      {
        "form": "үзсэн",
        "meaningJa": "見た",
        "category": "cat_noun_mod",
        "suffix": "-сэн",
        "exampleMn": "Миний үзсэн жүжиг гайхалтай байсан.",
        "exampleJa": "私の見た劇は素晴らしかったです。"
      },
      {
        "form": "үздэг хүн",
        "meaningJa": "よく観る人",
        "category": "cat_habit",
        "suffix": "-дэг хүн",
        "exampleMn": "Кино байнга үздэг хүн олон.",
        "exampleJa": "映画をいつも観る人は多いです。"
      },
      {
        "form": "үзэхээс өмнө",
        "meaningJa": "見る前に",
        "category": "cat_relation",
        "suffix": "-хээс өмнө",
        "exampleMn": "Кино үзэхээс өмнө тасалбараа авсан.",
        "exampleJa": "映画を見る前にチケットを買いました。"
      },
      {
        "form": "үзсэний дараа",
        "meaningJa": "見た後に",
        "category": "cat_relation",
        "suffix": "-сний дараа",
        "exampleMn": "Үзсэний дараа сэтгэгдлээ бичив.",
        "exampleJa": "観た後に感想を書きました。"
      },
      {
        "form": "үзвэл",
        "meaningJa": "見れば",
        "category": "cat_condition",
        "suffix": "-вэл",
        "exampleMn": "Чи үүнийг үзвэл баярлах болно.",
        "exampleJa": "君がこれを見れば喜ぶでしょう。"
      },
      {
        "form": "үзэхээр",
        "meaningJa": "見に",
        "category": "cat_purpose",
        "suffix": "-хээр",
        "exampleMn": "Үзэсгэлэн үзэхээр хот руу явлаа.",
        "exampleJa": "展覧会を見に街へ行きました。"
      }
    ]
  },
  {
    "verb": "ирэх",
    "meaning": "来る",
    "stem": "ир-",
    "vowelType": "female",
    "forms": [
      {
        "form": "ирээд",
        "meaningJa": "来てから",
        "category": "cat_sequence",
        "suffix": "-ээд",
        "exampleMn": "Тэр манайд ирээд цай уусан.",
        "exampleJa": "彼はうちに来てからお茶を飲みました。"
      },
      {
        "form": "ирэхэд",
        "meaningJa": "来る時（主語不一致）",
        "category": "cat_time",
        "suffix": "-хэд",
        "exampleMn": "Намайг гэртээ ирэхэд ээж хоол хийж байв.",
        "exampleJa": "私が家に帰ってきた（来た）時、母は料理をしていました。"
      },
      {
        "form": "ирсэн",
        "meaningJa": "来た",
        "category": "cat_noun_mod",
        "suffix": "-сэн",
        "exampleMn": "Өчигдөр ирсэн зочид өнөөдөр явлаа.",
        "exampleJa": "昨日来たお客様は今日帰られました。"
      },
      {
        "form": "ирдэг хүн",
        "meaningJa": "よく来る人",
        "category": "cat_habit",
        "suffix": "-дэг хүн",
        "exampleMn": "Манай дэлгүүрт байнга ирдэг хүн байна.",
        "exampleJa": "私の店にいつも来る人がいます。"
      },
      {
        "form": "ирэхээс өмнө",
        "meaningJa": "来る前に",
        "category": "cat_relation",
        "suffix": "-хээс өмнө",
        "exampleMn": "Багшийг ирэхээс өмнө самбараа арчив.",
        "exampleJa": "先生が来られる前に黒板を拭きました。"
      },
      {
        "form": "ирсний дараа",
        "meaningJa": "来た後に",
        "category": "cat_relation",
        "suffix": "-сний дараа",
        "exampleMn": "Түүнийг ирсний дараа хурал эхлэв.",
        "exampleJa": "彼が来た後に会議が始まりました。"
      },
      {
        "form": "ирвэл",
        "meaningJa": "来れば",
        "category": "cat_condition",
        "suffix": "-вэл",
        "exampleMn": "Маргааш цагтаа ирвэл бид хамт явна.",
        "exampleJa": "明日時間通りに来れば私たちは一緒に行きます。"
      },
      {
        "form": "ирсэн болохоор",
        "meaningJa": "来たので",
        "category": "cat_reason",
        "suffix": "-сэн болохоор",
        "exampleMn": "Зочин ирсэн болохоор бид гадагш гараагүй.",
        "exampleJa": "来客があった（来た）ので私たちは外出しませんでした。"
      }
    ]
  },
  {
    "verb": "сурах",
    "meaning": "学ぶ、勉強する",
    "stem": "сур-",
    "vowelType": "male",
    "forms": [
      {
        "form": "сураад",
        "meaningJa": "学んでから",
        "category": "cat_sequence",
        "suffix": "-аад",
        "exampleMn": "Би монгол хэл сайн сураад хөтөч хийнэ.",
        "exampleJa": "私はモンゴル語をしっかり学んでからガイドをします。"
      },
      {
        "form": "сурахад",
        "meaningJa": "学ぶ時",
        "category": "cat_time",
        "suffix": "-хад",
        "exampleMn": "Шинэ хэл сурахад тэвчээр шаардагдана.",
        "exampleJa": "新しい言語を学ぶ時には忍耐が必要です。"
      },
      {
        "form": "сурсан",
        "meaningJa": "学んだ",
        "category": "cat_noun_mod",
        "suffix": "-сан",
        "exampleMn": "Сургуульд сурсан мэдлэг амьдралд хэрэгтэй.",
        "exampleJa": "学校で学んだ知識は人生に役立ちます。"
      },
      {
        "form": "сурдаг газар",
        "meaningJa": "学ぶ場所",
        "category": "cat_habit",
        "suffix": "-даг газар",
        "exampleMn": "Энэ бол миний сурдаг сургууль.",
        "exampleJa": "これは私が勉強している学校です。"
      },
      {
        "form": "сурахын тулд",
        "meaningJa": "学ぶために",
        "category": "cat_purpose",
        "suffix": "-хын тулд",
        "exampleMn": "Би монгол хэл сурахын тулд өдөр бүр хичээллэдэг.",
        "exampleJa": "私はモンゴル語を学ぶために毎日勉強しています。"
      },
      {
        "form": "сурвал",
        "meaningJa": "学べば",
        "category": "cat_condition",
        "suffix": "-вал",
        "exampleMn": "Шургуу сурвал үр дүн гарна.",
        "exampleJa": "熱心に学べば成果が出ます。"
      }
    ]
  },
  {
    "verb": "бодох",
    "meaning": "考える、思う",
    "stem": "бод-",
    "vowelType": "male",
    "forms": [
      {
        "form": "бодоод",
        "meaningJa": "考えてから",
        "category": "cat_sequence",
        "suffix": "-оод",
        "exampleMn": "Сайн бодоод шийдвэр гаргаарай.",
        "exampleJa": "よく考えてから決定を下してください。"
      },
      {
        "form": "бодоход",
        "meaningJa": "考えると",
        "category": "cat_time",
        "suffix": "-ход",
        "exampleMn": "Энэ тухай бодоход сэтгэл тайвширдаг.",
        "exampleJa": "このことについて考えると心が安らぎます。"
      },
      {
        "form": "бодсон",
        "meaningJa": "考えた、思った",
        "category": "cat_noun_mod",
        "suffix": "-сон",
        "exampleMn": "Миний бодсон төлөвлөгөө бүтэв.",
        "exampleJa": "私の考えた計画が実現しました。"
      },
      {
        "form": "бодвол",
        "meaningJa": "考えれば",
        "category": "cat_condition",
        "suffix": "-вол",
        "exampleMn": "Алс хэтийг бодвол энэ нь зөв.",
        "exampleJa": "将来を考えればこれが正しいです。"
      },
      {
        "form": "гэж бодох",
        "meaningJa": "〜と思う",
        "category": "cat_quote",
        "suffix": "гэж бодох",
        "exampleMn": "Би маргааш явна гэж бодож байна.",
        "exampleJa": "私は明日行こうと思っています。"
      }
    ]
  },
  {
    "verb": "бичих",
    "meaning": "書く",
    "stem": "бич-",
    "vowelType": "female",
    "forms": [
      {
        "form": "бичээд",
        "meaningJa": "書いてから",
        "category": "cat_sequence",
        "suffix": "-ээд",
        "exampleMn": "Захиа бичээд шуудангаар явууллаа.",
        "exampleJa": "手紙を書いてから郵便で送りました。"
      },
      {
        "form": "бичихэд",
        "meaningJa": "書く時",
        "category": "cat_time",
        "suffix": "-хэд",
        "exampleMn": "Кирилл үсгээр бичихэд дүрмийн дагуу бичнэ.",
        "exampleJa": "キリル文字で書く時は規則に従って書きます。"
      },
      {
        "form": "бичсэн",
        "meaningJa": "書いた",
        "category": "cat_noun_mod",
        "suffix": "-сэн",
        "exampleMn": "Багшийн бичсэн ном маш сонирхолтой.",
        "exampleJa": "先生が書かれた本はとても面白いです。"
      },
      {
        "form": "бичихээс өмнө",
        "meaningJa": "書く前に",
        "category": "cat_relation",
        "suffix": "-хээс өмнө",
        "exampleMn": "Зохион бичлэг бичихээс өмнө сэдвээ сонгоно.",
        "exampleJa": "作文を書く前にテーマを選びます。"
      },
      {
        "form": "бичвэл",
        "meaningJa": "書けば",
        "category": "cat_condition",
        "suffix": "-вэл",
        "exampleMn": "Өдөр бүр тэмдэглэл бичвэл чадвар сайжирна.",
        "exampleJa": "毎日日記を書けば能力が上達します。"
      }
    ]
  },
  {
    "verb": "өгөх",
    "meaning": "与える、あげる、渡す",
    "stem": "өг-",
    "vowelType": "female",
    "forms": [
      {
        "form": "өгөөд",
        "meaningJa": "あげてから、渡してから",
        "category": "cat_sequence",
        "suffix": "-өөд",
        "exampleMn": "Бэлгээ өгөөд баяр хүргэв.",
        "exampleJa": "プレゼントを渡してからお祝いを言いました。"
      },
      {
        "form": "өгөхөд",
        "meaningJa": "あげる時、渡す時",
        "category": "cat_time",
        "suffix": "-хөд",
        "exampleMn": "Мөнгө өгөхөд тэр баярлав.",
        "exampleJa": "お金を渡す（あげる）時、彼は喜びました。"
      },
      {
        "form": "өгсөн",
        "meaningJa": "くれた、あげた",
        "category": "cat_noun_mod",
        "suffix": "-сөн",
        "exampleMn": "Найзынхаа өгсөн дурсгалын зүйл энд байна.",
        "exampleJa": "友達がくれた記念品がここにあります。"
      },
      {
        "form": "өгвөл",
        "meaningJa": "あげれば、渡せば",
        "category": "cat_condition",
        "suffix": "-вөл",
        "exampleMn": "Боломж өгвөл би заавал биелүүлнэ.",
        "exampleJa": "チャンスをくれれば私は必ず達成します。"
      }
    ]
  },
  {
    "verb": "авах",
    "meaning": "取る、買う、もらう",
    "stem": "ав-",
    "vowelType": "male",
    "forms": [
      {
        "form": "аваад",
        "meaningJa": "買ってから、取ってから",
        "category": "cat_sequence",
        "suffix": "-аад",
        "exampleMn": "Номоо аваад хичээлдээ явсан.",
        "exampleJa": "本を取って（買って）から学校に行きました。"
      },
      {
        "form": "авахад",
        "meaningJa": "買う時、取る時",
        "category": "cat_time",
        "suffix": "-хад",
        "exampleMn": "Бараа авахад хямдралтай байв.",
        "exampleJa": "品物を買う時に割引がありました。"
      },
      {
        "form": "авсан",
        "meaningJa": "買った、取った",
        "category": "cat_noun_mod",
        "suffix": "-сан",
        "exampleMn": "Шинээр авсан хувцас надад таалагдсан.",
        "exampleJa": "新しく買った服が気に入りました。"
      },
      {
        "form": "авбал",
        "meaningJa": "買えば、取れば",
        "category": "cat_condition",
        "suffix": "-бал",
        "exampleMn": "Одоо авбал хямдхан байна.",
        "exampleJa": "今買えば安いです。"
      },
      {
        "form": "авахаар",
        "meaningJa": "買いに、取りに",
        "category": "cat_purpose",
        "suffix": "-хаар",
        "exampleMn": "Талх авахаар дэлгүүр явсан.",
        "exampleJa": "パンを買いに店へ行きました。"
      }
    ]
  },
  {
    "verb": "уух",
    "meaning": "飲む",
    "stem": "уу-",
    "vowelType": "male",
    "forms": [
      {
        "form": "уугаад",
        "meaningJa": "飲んでから",
        "category": "cat_sequence",
        "suffix": "-гаад",
        "exampleMn": "Цай уугаад гарцгаая.",
        "exampleJa": "お茶を飲んでから出かけましょう。"
      },
      {
        "form": "уухад",
        "meaningJa": "飲む時",
        "category": "cat_time",
        "suffix": "-хад",
        "exampleMn": "Халуун цай уухад хоолой онгойв.",
        "exampleJa": "温かいお茶を飲む時、喉がすっきりしました。"
      },
      {
        "form": "уусан",
        "meaningJa": "飲んだ",
        "category": "cat_noun_mod",
        "suffix": "-сан",
        "exampleMn": "Өглөө уусан сүү шинэхэн байв.",
        "exampleJa": "朝飲んだ牛乳は新鮮でした。"
      },
      {
        "form": "уудаг хүн",
        "meaningJa": "よく飲む人",
        "category": "cat_habit",
        "suffix": "-даг хүн",
        "exampleMn": "Кофе байнга уудаг хүн их байна.",
        "exampleJa": "コーヒーをいつも飲む人は多いです。"
      },
      {
        "form": "уухаас өмнө",
        "meaningJa": "飲む前に",
        "category": "cat_relation",
        "suffix": "-хаас өмнө",
        "exampleMn": "Эм уухаас өмнө зааврыг уншина уу.",
        "exampleJa": "薬を飲む前に説明書を読んでください。"
      },
      {
        "form": "уувал",
        "meaningJa": "飲めば",
        "category": "cat_condition",
        "suffix": "-вал",
        "exampleMn": "Халуун аньсны шүүс уувал ханиад эдгэнэ.",
        "exampleJa": "温かいコケモモジュースを飲めば風邪が治ります。"
      }
    ]
  }
];

export const CURATED_COMPLEX_QUESTIONS = [
  {
    "id": "cq_a_1",
    "category": "cat_reason",
    "format": 1,
    "difficulty": "beginner",
    "prompt": "Би өвдсөн ___ сургуульдаа яваагүй.",
    "promptJa": "体調を崩した___学校に行きませんでした。",
    "options": [
      "болохоор",
      "гэхдээ",
      "бол",
      "өмнө"
    ],
    "answer": "болохоор",
    "completedSentence": "Би өвдсөн болохоор сургуульдаа яваагүй.",
    "japanese": "体調を崩したので学校に行きませんでした。",
    "clause1": "Би өвдсөн（私は病気になった）",
    "clause2": "сургуульдаа яваагүй（自分の学校に行かなかった）",
    "grammar": "理由接続表現「-сан болохоор（〜したので）」",
    "baseVerb": "өвдөх（病気になる、痛む）",
    "stemAndSuffix": "өвд- + -сөн（過去完了） + болохоор（理由接続詞）",
    "whyCorrect": "前半の「体調を崩したこと」が後半の「学校に行かなかった」直接の自然な理由・原因となっているため「болохоор」が正解です。",
    "otherOptionsExplained": {
      "гэхдээ": "逆接（しかし）となり、「体調を崩したが、学校に行かなかった」と論理矛盾になります。",
      "бол": "条件（〜なら）となり、既に起きた過去の事実に対する条件提示として不適です。",
      "өмнө": "前後関係（〜の前に）となり、文脈の意味が通じなくなります。"
    },
    "parallelExample": "Бороо орсон болохоор бид гарсангүй.（雨が降ったので私たちは外出しませんでした。）",
    "conditions": {
      "subjectRelation": "same",
      "polarity": "pos_neg",
      "tense": "past_past",
      "sentenceType": "statement"
    },
    "whatIfScenarios": {
      "ifDiffSubject": "Түүнийг өвдсөн тул би асарсан.（彼が病気になったので私が看病した [主語不一致時は тул / учраас が自然]）",
      "ifNegative": "Би өвдөөгүй болохоор сургуульдаа явсан.（体調を崩さなかったので学校に行きました。）",
      "ifQuestion": "Чи өвдсөн болохоор сургуульдаа яваагүй юу?（体調を崩したから学校に行かなかったのですか？）",
      "ifTenseChanged": "Би өвдвөл сургуульдаа явахгүй.（体調を崩したら学校に行きません [未来の仮定]）"
    }
  },
  {
    "id": "cq_a_2",
    "category": "cat_reason",
    "format": 2,
    "difficulty": "intermediate",
    "prompt": "Цас их ор___ зам хаагдсан.",
    "promptJa": "雪がたくさん降っ___道路が閉鎖された。（動詞: орох）",
    "options": [
      "сноос болж",
      "соор",
      "ход",
      "вол"
    ],
    "answer": "сноос болж",
    "completedSentence": "Цас их орсноос болж зам хаагдсан.",
    "japanese": "雪がたくさん降ったせいで道路が閉鎖された。",
    "clause1": "Цас их орсон（雪がたくさん降った）",
    "clause2": "зам хаагдсан（道路が閉鎖された）",
    "grammar": "悪因理由「-снаас / -снээс болж（〜したせいで）」",
    "baseVerb": "орох（降る、入る）",
    "stemAndSuffix": "ор- + -сноос（完了形奪格） + болж（〜が原因で）",
    "whyCorrect": "後半が「道路閉鎖」という好ましくないマイナス結果であるため、「〜のせいで」を表す「-снаас болж」が最も的確です。",
    "otherOptionsExplained": {
      "соор": "継続接続形（〜し続けて）となり、結果との因果関係が成立しません。",
      "ход": "時間（降った時）となり、道路が閉鎖された因果の必然性が弱まります。",
      "вол": "仮定（降ったら）となり、過去の確定した道路閉鎖の事実に合いません。"
    },
    "parallelExample": "Шуурга тавьснаас болж онгоц ниссэнгүй.（嵐が起きたせいで飛行機は飛びませんでした。）",
    "conditions": {
      "subjectRelation": "different",
      "polarity": "pos_pos",
      "tense": "past_past",
      "sentenceType": "statement"
    },
    "whatIfScenarios": {
      "ifDiffSubject": "主語は前半が「Цас（雪）」、後半が「Зам（道路）」と元々異なる主語です。",
      "ifNegative": "Цас ороогүй тул зам хаагдсангүй.（雪が降らなかったため道路は閉鎖されませんでした。）",
      "ifQuestion": "Цас орсноос болж зам хаагдсан уу?（雪が降ったせいで道路が閉鎖されたのですか？）",
      "ifTenseChanged": "Цас их орвол зам хаагдана.（雪がたくさん降れば道路が閉鎖されます。）"
    }
  },
  {
    "id": "cq_a_3",
    "category": "cat_reason",
    "format": 4,
    "difficulty": "advanced",
    "prompt": "【日本語】「昨日は忙しかったため、あなたにお電話できませんでした。」\n【モンゴル語】Өчигдөр завгүй байсан ___ тантай утсаар ярьж чадаагүй.",
    "promptJa": "空欄に入る最も公的で丁寧な理由表現を選びなさい。",
    "options": [
      "тул",
      "болохоор",
      "гэхдээ",
      "магадгүй"
    ],
    "answer": "тул",
    "completedSentence": "Өчигдөр завгүй байсан тул тантай утсаар ярьж чадаагүй.",
    "japanese": "昨日は忙しかったため、あなたにお電話できませんでした。",
    "clause1": "Өчигдөр завгүй байсан（昨日は忙しかった）",
    "clause2": "тантай утсаар ярьж чадаагүй（あなたと電話で話せなかった）",
    "grammar": "客観・公的理由接続詞「тул（〜のため）」",
    "baseVerb": "байх（ある、いる）",
    "stemAndSuffix": "бай- + -сан（過去形動詞） + тул（後置詞・接続詞）",
    "whyCorrect": "相手に対する改まった報告や丁寧な手紙・ビジネス連絡では、口語的な「болохоор」より格式ある客観的理由「тул」が最も適切です。",
    "otherOptionsExplained": {
      "болохоор": "日常会話では使えますが、ビジネスでの丁寧さとしては「тул」が第一選択です。",
      "гэхдээ": "逆接（しかし）となり「忙しかったが電話できなかった」と意味が歪みます。",
      "магадгүй": "副詞（おそらく）であり、2つの節を繋ぐ理由接続詞になれません。"
    },
    "parallelExample": "Цаг агаар муудсан тул нислэг хойшлов.（天候が悪化したためフライトは延期されました。）",
    "conditions": {
      "subjectRelation": "same",
      "polarity": "pos_neg",
      "tense": "past_past",
      "sentenceType": "statement"
    },
    "whatIfScenarios": {
      "ifDiffSubject": "Та завгүй байсан тул би өөрөө хийсэн.（あなたが忙しかったため、私が自分で行いました。）",
      "ifNegative": "Завтай байсан тул ярьсан.（時間があったためお話ししました。）",
      "ifQuestion": "Завгүй байсан тул ирж чадаагүй юу?（忙しかったために来られなかったのですか？）",
      "ifTenseChanged": "Маргааш завгүй байх тул ярьж чадахгүй.（明日は多忙なためお電話できません。）"
    }
  },
  {
    "id": "cq_b_1",
    "category": "cat_contrast",
    "format": 1,
    "difficulty": "beginner",
    "prompt": "Би явахыг хүссэн ___ завгүй байсан.",
    "promptJa": "私は行きたかった___忙しかったです。",
    "options": [
      "боловч",
      "болохоор",
      "гэж",
      "учир"
    ],
    "answer": "боловч",
    "completedSentence": "Би явахыг хүссэн боловч завгүй байсан.",
    "japanese": "私は行きたかったけれど、忙しかったです。",
    "clause1": "Би явахыг хүссэн（私は行くことを望んだ）",
    "clause2": "завгүй байсан（暇がなかった・忙しかった）",
    "grammar": "逆接接続表現「-сан боловч（〜したけれど）」",
    "baseVerb": "хүсэх（望む、欲する）",
    "stemAndSuffix": "хүс- + -сэн（過去完了） + боловч（逆接接続詞）",
    "whyCorrect": "「行きたかった」という意向に対して「忙しかった」という相反する事態が対立しているため、逆接の「боловч」が正解です。",
    "otherOptionsExplained": {
      "болохоор": "理由（行きたかったので忙しかった）となり因果関係が不成立です。",
      "гэж": "引用（行きたかったと思って）となり、後半の文章と自然に繋がりません。",
      "учир": "名詞（理由・事情）であり、単独では逆接の複文を形成できません。"
    },
    "parallelExample": "Бороо орсон боловч дулаахан байв.（雨が降ったけれど暖かかったです。）",
    "conditions": {
      "subjectRelation": "same",
      "polarity": "pos_pos",
      "tense": "past_past",
      "sentenceType": "statement"
    },
    "whatIfScenarios": {
      "ifDiffSubject": "Би явахыг хүссэн боловч найз маань завгүй байсан.（私は行きたかったが友達が忙しかった）",
      "ifNegative": "Би явахыг хүсээгүй боловч явсан.（行きたくなかったけれど行きました。）",
      "ifQuestion": "Чи явахыг хүссэн боловч завгүй байсан уу?（君は行きたかったけれど忙しかったの？）",
      "ifTenseChanged": "Явахыг хүсэх боловч очиж чадахгүй нь.（行きたいけれど行けそうにない。）"
    }
  },
  {
    "id": "cq_b_2",
    "category": "cat_contrast",
    "format": 3,
    "difficulty": "intermediate",
    "prompt": "Би монгол хоолонд дуртай, ___ ах маань дургүй.",
    "promptJa": "私はモンゴル料理が好きだ、___兄は嫌いだ。（対比）",
    "options": [
      "харин",
      "учраас",
      "тэгээд",
      "гэхэд"
    ],
    "answer": "харин",
    "completedSentence": "Би монгол хоолонд дуртай, харин ах маань дургүй.",
    "japanese": "私はモンゴル料理が好きですが、それに対して兄は嫌いです。",
    "clause1": "Би монгол хоолонд дуртай（私はモンゴル料理が好きだ）",
    "clause2": "ах маань дургүй（私の兄は嫌いだ）",
    "grammar": "対比接続詞「харин（一方、それに対して）」",
    "baseVerb": "なし（形容詞・述語節対比）",
    "stemAndSuffix": "харин（不変化対比接続副詞）",
    "whyCorrect": "2人の異なる人物（私と兄）の好悪を対比・対照させているため、「それに対して、一方」を意味する「харин」が最も自然です。",
    "otherOptionsExplained": {
      "учраас": "理由（好きだから兄は嫌いだ）となり論理的におかしいです。",
      "тэгээд": "順序（そして、それから）となり、対立する内容を繋げません。",
      "гэхэд": "時間・仮定（〜と言う時に）となり文意が通りません。"
    },
    "parallelExample": "Би цай ууна, харин дүү маань ус ууна.（私がお茶を飲み、一方で弟は水を飲みます。）",
    "conditions": {
      "subjectRelation": "different",
      "polarity": "pos_neg",
      "tense": "pres_pres",
      "sentenceType": "statement"
    },
    "whatIfScenarios": {
      "ifDiffSubject": "主語は前半「Би（私）」、後半「ах（兄）」と対比されています。",
      "ifNegative": "Би дургүй, харин ах дуртай.（私は嫌いだが、逆に兄は好きだ。）",
      "ifQuestion": "Чи дуртай, харин ах чинь дургүй юу?（君は好きで、でもお兄さんは嫌いなの？）",
      "ifTenseChanged": "Би дуртай байсан, харин ах дургүй байсан.（私は好きだったが、兄は嫌いだった。）"
    }
  },
  {
    "id": "cq_c_1",
    "category": "cat_condition",
    "format": 2,
    "difficulty": "beginner",
    "prompt": "Маргааш бороо ор___ би гэртээ байна.",
    "promptJa": "明日雨が降っ___私は家にいます。（動詞: орох）",
    "options": [
      "вол",
      "бол",
      "сон",
      "хоор"
    ],
    "answer": "вол",
    "completedSentence": "Маргааш бороо орвол би гэртээ байна.",
    "japanese": "明日雨が降ったら私は家にいます。",
    "clause1": "Маргааш бороо орвол（明日雨が降ったら）",
    "clause2": "би гэртээ байна（私は家にいます）",
    "grammar": "条件接続語尾「-вал / -вэл / -вол / -вөл（〜すれば、〜したら）」",
    "baseVerb": "орох（降る）",
    "stemAndSuffix": "ор- + -вол（р語幹＋男性母音仮定語尾）",
    "whyCorrect": "語幹末尾が「р」であり、語幹母音が「о」であるため、母音調和と子音規則に従い「-вол」が正解です。",
    "otherOptionsExplained": {
      "бол": "不変化小詞「бол」は動詞の辞書形や名詞の直後に置くもので、語幹「ор-」に直接付加できません。",
      "сон": "過去完了形（降った）となり、明日の仮定条件文になりません。",
      "хоор": "目的（降りに）となり文脈に合いません。"
    },
    "parallelExample": "Цаг гарвал би очно.（時間があれば私はいきます。）",
    "conditions": {
      "subjectRelation": "different",
      "polarity": "pos_pos",
      "tense": "fut_fut",
      "sentenceType": "statement"
    },
    "whatIfScenarios": {
      "ifDiffSubject": "前半は「бороо（雨）」、後半は「би（私）」で主語が異なります。",
      "ifNegative": "Бороо орохгүй бол би гадагш явна.（雨が降らなければ外出します。）",
      "ifQuestion": "Бороо орвол чи гэртээ байх уу?（雨が降ったら君は家にいるの？）",
      "ifTenseChanged": "Бороо орсон бол би гарахгүй байсан.（雨が降っていたら私は出かけなかっただろう [反事実過去]）"
    }
  },
  {
    "id": "cq_c_2",
    "category": "cat_condition",
    "format": 1,
    "difficulty": "intermediate",
    "prompt": "Би өчигдөр эрт унтсан ___ өнөөдөр ядарсангүй.",
    "promptJa": "昨日早く寝てい___、今日は疲れていなかっただろうに。（反事実仮定）",
    "options": [
      "бол",
      "болохоор",
      "учраас",
      "дээр"
    ],
    "answer": "бол",
    "completedSentence": "Би өчигдөр эрт унтсан бол өнөөдөр ядарсангүй.",
    "japanese": "昨日早く寝ていたら、今日は疲れていなかっただろうに。",
    "clause1": "Би өчигдөр эрт унтсан бол（昨日早く寝ていたら）",
    "clause2": "өнөөдөр ядарсангүй（今日は疲れなかったのに）",
    "grammar": "過去の反事実仮定「-сан бол（〜していたならば）」",
    "baseVerb": "унтах（寝る）",
    "stemAndSuffix": "унт- + -сан（過去形動詞） + бол（条件小詞）",
    "whyCorrect": "過去の完了形「-сан」の直後に「бол」を置くことで、「実際にはしなかったが、もし〜していたら」という反事実の仮定を表します。",
    "otherOptionsExplained": {
      "болохоор": "事実の理由（早く寝たので疲れていない）となり、反事実の後悔の意味になりません。",
      "учраас": "客観的理由（寝たから）となり、仮定になりません。",
      "дээр": "助言（寝た方がよい）となり文型が崩れます。"
    },
    "parallelExample": "Хичээлээ хийсэн бол шалгалтад тэнцэх байсан.（勉強していたら試験に受かっていただろうに。）",
    "conditions": {
      "subjectRelation": "same",
      "polarity": "pos_neg",
      "tense": "past_pres",
      "sentenceType": "statement"
    },
    "whatIfScenarios": {
      "ifDiffSubject": "Чи ирсэн бол би баярлах байсан.（君が来てくれていたら私は喜んでいただろうに）",
      "ifNegative": "Оройтоогүй бол хоцрохгүй байсан.（遅くならなかったら遅刻しなかっただろうに）",
      "ifQuestion": "Чи унтсан бол ядрахгүй байх байсан уу?（君は寝ていたら疲れなかったと思う？）",
      "ifTenseChanged": "Одоо унтвал маргааш ядрахгүй.（今寝れば明日は疲れない [未来仮定]）"
    }
  },
  {
    "id": "cq_d_1",
    "category": "cat_sequence",
    "format": 2,
    "difficulty": "beginner",
    "prompt": "Би хоолоо ид___ сургууль руу явсан.",
    "promptJa": "私はご飯を食べ___学校へ行きました。（動詞: идэх）",
    "options": [
      "ээд",
      "хэд",
      "сэн",
      "вэл"
    ],
    "answer": "ээд",
    "completedSentence": "Би хоолоо идээд сургууль руу явсан.",
    "japanese": "私はご飯を食べてから学校へ行きました。",
    "clause1": "Би хоолоо идээд（私はご飯を食べてから）",
    "clause2": "сургууль руу явсан（学校へ行った）",
    "grammar": "動作順序の副動詞「-аад / -ээд / -оод / -өөд（〜してから）」",
    "baseVerb": "идэх（食べる）",
    "stemAndSuffix": "ид- + -ээд（女性母音順序完了語尾）",
    "whyCorrect": "「食べる」という先行動作が完全に完了した後に、次の動作「学校へ行く」へ進むため、順序副動詞「-ээд」が正解です。",
    "otherOptionsExplained": {
      "хэд": "時間副動詞（食べる時）となり、食べ終わった後の順序ではなく同時状況になります。",
      "сэн": "形動詞（食べた）となり、名詞を修飾するか文末終止形になってしまいます。",
      "вэл": "仮定（食べたら）となり、過去の確定した行動順序を表せません。"
    },
    "parallelExample": "Би номоо уншаад унтсан.（私は本を読んでから寝ました。）",
    "conditions": {
      "subjectRelation": "same",
      "polarity": "pos_pos",
      "tense": "past_past",
      "sentenceType": "statement"
    },
    "whatIfScenarios": {
      "ifDiffSubject": "Намайг хоолоо идэхэд тэр гарсан.（私がご飯を食べる時、彼は出かけた [主語不一致では -аад は不可]）",
      "ifNegative": "Би хоолоо идэлгүй сургууль явсан.（私はご飯を食べずに学校へ行きました。）",
      "ifQuestion": "Чи хоолоо идээд сургууль руу явсан уу?（ご飯を食べてから学校に行ったの？）",
      "ifTenseChanged": "Би хоолоо идээд сургууль руу явна.（ご飯を食べてから学校に行きます [未来]）"
    }
  },
  {
    "id": "cq_d_2",
    "category": "cat_sequence",
    "format": 1,
    "difficulty": "intermediate",
    "prompt": "Тэр дуу дуул___ хичээл хийж байна.",
    "promptJa": "彼は歌を歌い___勉強しています。（同時並行・付帯状況）",
    "options": [
      "ж",
      "аад",
      "вал",
      "сан"
    ],
    "answer": "ж",
    "completedSentence": "Тэр дуу дуулж хичээл хийж байна.",
    "japanese": "彼は歌を歌いながら勉強しています。",
    "clause1": "Тэр дуу дуулж（彼は歌を歌い）",
    "clause2": "хичээл хийж байна（勉強している）",
    "grammar": "並列・付帯副動詞「-ж / -ч（〜しながら、〜して）」",
    "baseVerb": "дуулах（歌う）",
    "stemAndSuffix": "дуул- + -ж（並列接続副動詞）",
    "whyCorrect": "「歌う」と「勉強する」という2つの動作が同時に並行して進行しているため、付帯状況を表す「-ж」が正解です。",
    "otherOptionsExplained": {
      "аад": "「歌い終わってから勉強する」という前後の順序になり、同時進行になりません。",
      "вал": "仮定（歌えば勉強する）となり意味が通りません。",
      "сан": "過去形動詞となり、現在進行形「хийж байна」に直接連用できません。"
    },
    "parallelExample": "Бид ярилцаж цай ууцгаав.（私たちは語り合いながらお茶を飲みました。）",
    "conditions": {
      "subjectRelation": "same",
      "polarity": "pos_pos",
      "tense": "pres_pres",
      "sentenceType": "statement"
    },
    "whatIfScenarios": {
      "ifDiffSubject": "Түүнийг дуулахад би сурч байв.（彼が歌う時、私は勉強していた）",
      "ifNegative": "Тэр дуу дуулалгүй хичээл хийж байна.（彼は歌を歌わずに勉強しています。）",
      "ifQuestion": "Тэр дуу дуулж хичээл хийж байна уу?（彼は歌を歌いながら勉強しているのですか？）",
      "ifTenseChanged": "Тэр дуу дуулж хичээл хийх дуртай.（彼は歌いながら勉強するのが好きだ。）"
    }
  },
  {
    "id": "cq_e_1",
    "category": "cat_time",
    "format": 2,
    "difficulty": "beginner",
    "prompt": "Би гэртээ ир___ ээж хоол хийж байсан.",
    "promptJa": "私が家に帰ってきた___母は料理をしていました。（主語不一致・動詞: ирэх）",
    "options": [
      "эхэд",
      "эхдээ",
      "ээд",
      "эвэл"
    ],
    "answer": "эхэд",
    "completedSentence": "Би гэртээ ирэхэд ээж хоол хийж байсан.",
    "japanese": "私が家に帰ってきた時、母は料理をしていました。",
    "clause1": "Би гэртээ ирэхэд（私が家に帰ってきた時）",
    "clause2": "ээж хоол хийж байсан（母は料理をしていた）",
    "grammar": "時間副動詞「-хад / -хэд（〜する時 [主語不一致]）」",
    "baseVerb": "ирэх（来る、帰る）",
    "stemAndSuffix": "ир- + -эхэд（形動詞連体形-х ＋ 与位格-д）",
    "whyCorrect": "節1の主語は「Би（私）」、節2の主語は「ээж（母）」と主語が異なるため、同一主語専用の「-хдээ」ではなく「-хэд」を用います。",
    "otherOptionsExplained": {
      "эхдээ": "主語が同一人物の場合（例: 私が帰った時、私が本を買った）にのみ使えます。",
      "ээд": "同一主語の連続動作（帰ってから母が料理した？）となり意味が不自然です。",
      "эвэл": "仮定（帰れば母は料理していた？）となり過去の描写に合いません。"
    },
    "parallelExample": "Намайг сэрэхэд бороо орж байв.（私が目を覚ました時、雨が降っていました。）",
    "conditions": {
      "subjectRelation": "different",
      "polarity": "pos_pos",
      "tense": "past_past",
      "sentenceType": "statement"
    },
    "whatIfScenarios": {
      "ifDiffSubject": "すでに主語が「Би（私）」と「ээж（母）」で異なるため「-эхэд」が使われています。",
      "ifSameSubject": "Би гэртээ ирэхдээ талх авсан.（私は家に帰る時[自分で]パンを買った [同一主語なら -хдээ]）",
      "ifNegative": "Би ирээгүй байхад ээж хоол хийсэн.（私が帰っていなかった時に母が料理を作った。）",
      "ifQuestion": "Чамайг гэртээ ирэхэд ээж хоол хийж байсан уу?（君が帰った時、お母さんは料理をしていた？）"
    }
  },
  {
    "id": "cq_e_2",
    "category": "cat_time",
    "format": 1,
    "difficulty": "intermediate",
    "prompt": "Тэр танхимд орж ир___ бүгд алга ташив.",
    "promptJa": "彼がホールに入って来る___、全員が拍手した。（〜するや否や・即時生起）",
    "options": [
      "мэгц",
      "хээр",
      "сний",
      "вэл"
    ],
    "answer": "мэгц",
    "completedSentence": "Тэр танхимд орж ирмэгц бүгд алга ташив.",
    "japanese": "彼がホールに入って来るや否や、全員が拍手しました。",
    "clause1": "Тэр танхимд орж ирмэгц（彼がホールに入って来るや否や）",
    "clause2": "бүгд алга ташив（全員が拍手した）",
    "grammar": "即時生起副動詞「-магц / -мэгц / -могц / -мөгц（〜するや否や）」",
    "baseVerb": "ирэх（来る）",
    "stemAndSuffix": "ир- + -мэгц（即時副動詞語尾）",
    "whyCorrect": "「入ってきた瞬間・直後すぐに」次の出来事が生じたことを表すため、「〜するや否や」を意味する「-мэгц」が正解です。",
    "otherOptionsExplained": {
      "хээр": "目的（入って来るために拍手した）となり意味が通りません。",
      "сний": "完了属格単独であり、直後に「дараа」などの後置詞がないと文が成立しません。",
      "вэл": "仮定（入って来れば拍手した）となり、過去の事実の即時描写になりません。"
    },
    "parallelExample": "Хонх дуугармагц хичээл дуусав.（チャイムが鳴るや否や授業が終わりました。）",
    "conditions": {
      "subjectRelation": "different",
      "polarity": "pos_pos",
      "tense": "past_past",
      "sentenceType": "statement"
    },
    "whatIfScenarios": {
      "ifDiffSubject": "前半は「Тэр（彼）」、後半は「бүгд（全員）」で主語が異なります。",
      "ifNegative": "Орж ирэхгүй удтал бид хүлээв.（入って来ない間、私たちは待った）",
      "ifQuestion": "Түүнийг орж ирмэгц бүгд алга ташсан уу?（彼が入って来るや否や皆が拍手したの？）",
      "ifTenseChanged": "Түүнийг орж ирмэгц бүгд алга ташна.（彼が入って来たらすぐに皆拍手するでしょう。）"
    }
  },
  {
    "id": "cq_f_1",
    "category": "cat_relation",
    "format": 3,
    "difficulty": "beginner",
    "prompt": "Би хоол ид___ дараа ном уншсан.",
    "promptJa": "私は食事をし___後、本を読みました。（動詞: идэх）",
    "options": [
      "сний",
      "хээс",
      "ээд",
      "вэл"
    ],
    "answer": "сний",
    "completedSentence": "Би хоол идсэний дараа ном уншсан.",
    "japanese": "私は食事をした後、本を読みました。",
    "clause1": "Би хоол идсэний（私が食事をしたことの）",
    "clause2": "дараа ном уншсан（後で本を読んだ）",
    "grammar": "後続関係「動詞完了形属格 -сний / -сны ＋ дараа（〜した後に）」",
    "baseVerb": "идэх（食べる）",
    "stemAndSuffix": "ид- + -сний（完了形動詞属格） + дараа（後置詞）",
    "whyCorrect": "後置詞「дараа（〜の後に）」は必ず直前の語に属格（-ын/-ийн/-ний）を要求するため、「идсэний」が正解です。",
    "otherOptionsExplained": {
      "хээс": "奪格語尾であり、後置詞「өмнө（前に）」と結びつく形です（*идэхээс дараа は誤用）。",
      "ээд": "副動詞「идээд」単独で「食べた後」を表すため、「дараа」と重ねて使えません。",
      "вэл": "仮定法語尾であり、後置詞「дараа」に直接接続できません。"
    },
    "parallelExample": "Хичээл тарсны дараа бид уулзсан.（放課後[授業が終わった後]、私たちは会いました。）",
    "conditions": {
      "subjectRelation": "same",
      "polarity": "pos_pos",
      "tense": "past_past",
      "sentenceType": "statement"
    },
    "whatIfScenarios": {
      "ifDiffSubject": "Багшийг ярьсны дараа сурагчид асуулт асуув.（先生が話した後に生徒たちが質問した）",
      "ifBefore": "Хоол идэхээс өмнө гараа угаа.（ご飯を食べる前に手を洗いなさい [前の関係]）",
      "ifQuestion": "Чи хоол идсэнийхээ дараа эмээ уусан уу?（ご飯を食べた後に薬を飲んだ？）",
      "ifTenseChanged": "Би хоол идсэнийхээ дараа явна.（ご飯を食べた後に出かけます。）"
    }
  },
  {
    "id": "cq_f_2",
    "category": "cat_relation",
    "format": 1,
    "difficulty": "intermediate",
    "prompt": "Гэрээсээ гарах___ өмнө цонхоо хаагаарай.",
    "promptJa": "家から出る___前に窓を閉めてくださいね。",
    "options": [
      "аас",
      "сны",
      "аад",
      "вал"
    ],
    "answer": "аас",
    "completedSentence": "Гэрээсээ гарахаас өмнө цонхоо хаагаарай.",
    "japanese": "家から出る前に窓を閉めてくださいね。",
    "clause1": "Гэрээсээ гарахаас（家から出ることより）",
    "clause2": "өмнө цонхоо хаагаарай（前に窓を閉めてね）",
    "grammar": "先行関係「動詞形動詞奪格 -хаас / -хээс ＋ өмнө（〜する前に）」",
    "baseVerb": "гарах（出る）",
    "stemAndSuffix": "гар- + -ахаас（形動詞奪格） + өмнө（前置詞・後置詞）",
    "whyCorrect": "「〜する前に」を表す後置詞「өмнө」の前には、未来形動詞の奪格「-хаас / -хээс」が接続するため「-аас」が正解です。",
    "otherOptionsExplained": {
      "сны": "完了属格であり、「дараа（後）」と結びつく形です（*гарсны өмнө とは言わない）。",
      "аад": "副動詞（出てから）となり、「өмнө」と文法的に衝突します。",
      "вал": "仮定法語尾（出れば）であり、後置詞「өмнө」と繋がりません。"
    },
    "parallelExample": "Унтахаас өмнө шүдээ угаах хэрэгтэй.（寝る前に歯を磨く必要があります。）",
    "conditions": {
      "subjectRelation": "same",
      "polarity": "pos_pos",
      "tense": "fut_fut",
      "sentenceType": "statement"
    },
    "whatIfScenarios": {
      "ifDiffSubject": "Багшийг ирэхээс өмнө самбараа цэвэрлэв.（先生が来られる前に黒板を綺麗にした）",
      "ifAfter": "Гэрээсээ гарсны дараа бороо оров.（家を出た後に雨が降った）",
      "ifQuestion": "Гарахаасаа өмнө бүх юмаа шалгасан уу?（出かける前に全部確認した？）",
      "ifNegative": "Оройтохоос өмнө харьцгаая.（遅くならないうちに[前に]帰ろう）"
    }
  },
  {
    "id": "cq_g_1",
    "category": "cat_noun_mod",
    "format": 2,
    "difficulty": "beginner",
    "prompt": "Ээжийн хий___ хоол үргэлж амттай байдаг.",
    "promptJa": "母が作っ___料理はいつも美味しい。（動詞: хийх）",
    "options": [
      "сэн",
      "гээд",
      "вэл",
      "хэд"
    ],
    "answer": "сэн",
    "completedSentence": "Ээжийн хийсэн хоол үргэлж амттай байдаг.",
    "japanese": "母が作った料理はいつも美味しい。",
    "clause1": "Ээжийн хийсэн（母が作った [連体修飾節]）",
    "clause2": "хоол үргэлж амттай байдаг（料理はいつも美味しい）",
    "grammar": "動詞形動詞完了形による名詞修飾「-сан / -сэн / -сон / -сөн + 名詞」",
    "baseVerb": "хийх（作る、する）",
    "stemAndSuffix": "хий- + -сэн（女性母音完了連体形）",
    "whyCorrect": "名詞「хоол（料理）」を直前から連体修飾して「母が作った料理」とするため、完了形動詞「хийсэн」が正解です。",
    "otherOptionsExplained": {
      "гээд": "副動詞（作ってから）となり、直後の名詞「хоол」を修飾できません。",
      "вэл": "仮定副動詞（作れば）となり、名詞を直接修飾できません。",
      "хэд": "時間副動詞（作る時）となり、名詞修飾になれません。"
    },
    "parallelExample": "Миний авсан ном ширээн дээр байна.（私が買った本は机の上にあります。）",
    "conditions": {
      "subjectRelation": "different",
      "polarity": "pos_pos",
      "tense": "habit_past",
      "sentenceType": "statement"
    },
    "whatIfScenarios": {
      "ifSubjectGenitive": "モンゴル語の名詞修飾節では、動作主が属格「Ээжийн（母の）」になるのが鉄則です！",
      "ifHabit": "Ээжийн хийдэг хоол（母がいつも作る料理 [習慣連体形 -дэг]）",
      "ifFuture": "Ээжийн хийх хоол（母がこれから作る料理 [未来連体形 -х]）",
      "ifQuestion": "Ээжийн хийсэн хоол ямар амттай байна вэ?（お母さんの作った料理はどうしてこんなに美味しいの？）"
    }
  },
  {
    "id": "cq_g_2",
    "category": "cat_noun_mod",
    "format": 5,
    "difficulty": "intermediate",
    "prompt": "【モンゴル語】Өчигдөр манайд ирсэн зочид өнөөдөр өглөө нутаг буцлаа.\n【日本語訳として最も正確なものを選びなさい】",
    "promptJa": "完成した複文の意味を正しく捉えている選択肢を選択してください。",
    "options": [
      "昨日うちにやって来たお客様たちは、今朝故郷へ帰られました。",
      "昨日うちに客が来たので、今朝故郷へ帰ることにしました。",
      "昨日うちにお客様が来たら、今朝故郷へ帰る予定です。",
      "お客様が来る前に、私たちは今朝故郷へ帰りました。"
    ],
    "answer": "昨日うちにやって来たお客様たちは、今朝故郷へ帰られました。",
    "completedSentence": "Өчигдөр манайд ирсэн зочид өнөөдөр өглөө нутаг буцлаа.",
    "japanese": "昨日うちにやって来たお客様たちは、今朝故郷へ帰られました。",
    "clause1": "Өчигдөр манайд ирсэн（昨日うちに来た [修飾節]）",
    "clause2": "зочид өнөөдөр өглөө нутаг буцлаа（お客様たちは今朝故郷へ帰った）",
    "grammar": "過去完了形動詞「ирсэн」による名詞「зочид（客たち）」の連体修飾",
    "baseVerb": "ирэх（来る）",
    "stemAndSuffix": "ир- + -сэн（完了連体形） + зочид（名詞複数形）",
    "whyCorrect": "「ирсэн зочид」が「やって来たお客様たち」というひとまとまりの主語句を形成し、それが今朝帰ったという事実を述べているためです。",
    "otherOptionsExplained": {
      "昨日うちに客が来たので、今朝故郷へ帰ることにしました。": "理由構文（-сэн болохоор）と混同しています。",
      "昨日うちにお客様が来たら、今朝故郷へ帰る予定です。": "条件仮定（ирвэл）と混同しています。",
      "お客様が来る前に、私たちは今朝故郷へ帰りました。": "前後関係（ирэхээс өмнө）と混同しています。"
    },
    "parallelExample": "Энд сууж байгаа хүн хэн бэ?（ここに座っている人は誰ですか？）",
    "conditions": {
      "subjectRelation": "same",
      "polarity": "pos_pos",
      "tense": "past_past",
      "sentenceType": "statement"
    },
    "whatIfScenarios": {
      "ifPresent": "Өдөр бүр ирдэг зочид（毎日来る常連客たち [習慣 -дэг]）",
      "ifNegative": "Ирээгүй зочид（来なかった客たち）",
      "ifQuestion": "Өчигдөр ирсэн зочид явсан уу?（昨日来たお客さんは帰られたの？）",
      "ifFuture": "Маргааш ирэх зочид（明日来る予定のお客さんたち）"
    }
  },
  {
    "id": "cq_h_1",
    "category": "cat_purpose",
    "format": 1,
    "difficulty": "beginner",
    "prompt": "Би монгол хэл сурах___ Монголд ирсэн.",
    "promptJa": "私はモンゴル語を勉強する___モンゴルへ来ました。",
    "options": [
      "ын тулд",
      "аад",
      "вал",
      "боловч"
    ],
    "answer": "ын тулд",
    "completedSentence": "Би монгол хэл сурахын тулд Монголд ирсэн.",
    "japanese": "私はモンゴル語を勉強するためにモンゴルへ来ました。",
    "clause1": "Би монгол хэл сурахын（私がモンゴル語を学ぶことの）",
    "clause2": "тулд Монголд ирсэн（ためにモンゴルへ来た）",
    "grammar": "本格的目的表現「形動詞属格 -хын / -хийн ＋ тулд（〜するために）」",
    "baseVerb": "сурах（学ぶ）",
    "stemAndSuffix": "сур- + -ахын（未来形動詞属格） + тулд（目的後置詞）",
    "whyCorrect": "重大な志や目的（モンゴル語を学ぶこと）を達成するために行動したことを表すため、「-хын тулд」が最も相応しいです。",
    "otherOptionsExplained": {
      "аад": "順序（学んでからモンゴルに来た）となり、時系列が逆転して矛盾します。",
      "вал": "仮定（学べばモンゴルに来た）となり、意味をなしません。",
      "боловч": "逆接（学ぶけれどモンゴルに来た）となり、因果と意図が合いません。"
    },
    "parallelExample": "Эрүүл байхын тулд дасгал хийдэг.（健康でいるために運動をします。）",
    "conditions": {
      "subjectRelation": "same",
      "polarity": "pos_pos",
      "tense": "past_past",
      "sentenceType": "statement"
    },
    "whatIfScenarios": {
      "ifMoveShort": "Би монгол хэл сурахаар ирсэн.（日常会話の移動目的「-хаар」も使えます）",
      "ifNegative": "Мартахгүйн тулд тэмдэглэсэн.（忘れないためにメモした [否定の目的]）",
      "ifQuestion": "Чи юу хийхийн тулд Монголд ирсэн бэ?（君は何をするためにモンゴルに来たの？）",
      "ifIntention": "Сурах гэж хичээж байна.（学ぼうと思って努力している）"
    }
  },
  {
    "id": "cq_h_2",
    "category": "cat_purpose",
    "format": 2,
    "difficulty": "intermediate",
    "prompt": "Бид зоогийн газар луу хоол ид___ явлаа.",
    "promptJa": "私たちはレストランへご飯を食べ___行きました。（移動目的・動詞: идэх）",
    "options": [
      "эхээр",
      "эвэл",
      "сэн",
      "эхээс"
    ],
    "answer": "эхээр",
    "completedSentence": "Бид зоогийн газар луу хоол идэхээр явлаа.",
    "japanese": "私たちはレストランへご飯を食べに行きました。",
    "clause1": "Бид зоогийн газар луу хоол идэхээр（私たちがレストランへご飯を食べに）",
    "clause2": "явлаа（行きました）",
    "grammar": "移動動詞直結の目的副動詞「-хаар / -хээр（〜しに）」",
    "baseVerb": "идэх（食べる）",
    "stemAndSuffix": "ид- + -эхээр（形動詞造格）",
    "whyCorrect": "移動動詞「явах（行く）」や「ирэх（来る）」と直結して日常的な目的（〜しに行く/来る）を表すには「-хаар / -хээр」が最も自然です。",
    "otherOptionsExplained": {
      "эвэл": "仮定（食べれば行った）となり意味が通じません。",
      "сэн": "完了形（食べた行った？）となり文法が崩壊します。",
      "эхээс": "奪格（食べることから行った？）となり目的になりません。"
    },
    "parallelExample": "Найзтайгаа уулзахаар гарлаа.（友達と会いに外へ出ました。）",
    "conditions": {
      "subjectRelation": "same",
      "polarity": "pos_pos",
      "tense": "past_past",
      "sentenceType": "statement"
    },
    "whatIfScenarios": {
      "ifFormal": "Хоол идэхийн тулд явав.（硬い文章体目的）",
      "ifNegative": "Мөнгө үрэхгүй гэж гэртээ идсэн.（お金を使わないように家で食べた）",
      "ifQuestion": "Та нар юу хийхээр явж байна вэ?（あなたたちは何をしに行くところですか？）",
      "ifFuture": "Маргааш кино үзэхээр явна.（明日映画を見に行きます。）"
    }
  },
  {
    "id": "cq_i_1",
    "category": "cat_quote",
    "format": 1,
    "difficulty": "beginner",
    "prompt": "Би маргааш явна ___ бодож байна.",
    "promptJa": "私は明日行く___思っています。",
    "options": [
      "гэж",
      "болохоор",
      "гэдэг",
      "хүртэл"
    ],
    "answer": "гэж",
    "completedSentence": "Би маргааш явна гэж бодож байна.",
    "japanese": "私は明日行くと思っています。",
    "clause1": "Би маргааш явна（私は明日行く [引用節]）",
    "clause2": "бодож байна（思っている）",
    "grammar": "引用副動詞「гэж（〜と）」＋ 思考動詞「бодох」",
    "baseVerb": "бодох（思う、考える）",
    "stemAndSuffix": "гэх（言う）の副動詞形「гэж（〜と）」",
    "whyCorrect": "思考内容節「маргааш явна（明日行く）」を後続の動詞「бодож байна（思っている）」に引用として繋ぐため「гэж」が正解です。",
    "otherOptionsExplained": {
      "болохоор": "理由（行くので思っている）となり思考内容になりません。",
      "гэдэг": "連体修飾（〜という名詞）であり、直後に動詞「бодож байна」をとれません。",
      "хүртэл": "限度（行くまで思っている）となり不自然です。"
    },
    "parallelExample": "Тэр ирнэ гэж хэлсэн.（彼は来ると言いました。）",
    "conditions": {
      "subjectRelation": "same",
      "polarity": "pos_pos",
      "tense": "pres_fut",
      "sentenceType": "statement"
    },
    "whatIfScenarios": {
      "ifDiffSubject": "Багш намайг сайн сурч байна гэж хэлэв.（先生は私がよく勉強していると言った）",
      "ifNegative": "Би явахгүй гэж бодож байна.（私は行かないと思っています。）",
      "ifQuestion": "Чи маргааш ирнэ гэж бодож байна уу?（明日来るつもりですか？）",
      "ifNounModifier": "\"Маргааш явна\" гэдэг бодол（「明日行く」という考え [名詞修飾なら гэдэг]）"
    }
  },
  {
    "id": "cq_i_2",
    "category": "cat_quote",
    "format": 3,
    "difficulty": "intermediate",
    "prompt": "Монголчууд цагаан идээ ___ сүү, аарц, тараг зэргийг нэрлэдэг.",
    "promptJa": "モンゴル人は白い食べ物（乳製品）___ミルク、乾燥ヨーグルト、ヨーグルトなどを名付けて呼ぶ。（名詞修飾）",
    "options": [
      "гэдэг",
      "гэж",
      "гэхэд",
      "гэснээс"
    ],
    "answer": "гэдэг",
    "completedSentence": "Монголчууд цагаан идээ гэдэг сүү, аарц, тараг зэргийг нэрлэдэг.",
    "japanese": "モンゴル人は乳製品という名でミルク、アーロール、タラグ等を呼びます。",
    "clause1": "цагаан идээ гэдэг（白い食べ物という）",
    "clause2": "сүү, аарц... нэрлэдэг（〜を呼ぶ）",
    "grammar": "連体形引用接辞「гэдэг（〜という + 名詞）」",
    "baseVerb": "гэх（言う）",
    "stemAndSuffix": "гэ- + -дэг（習慣連体形）",
    "whyCorrect": "「〜という事物・概念」と直後の名詞を修飾する際には、副詞形の「гэж」ではなく連体形の「гэдэг」を用います。",
    "otherOptionsExplained": {
      "гэж": "動詞（言う、思う）を修飾する副詞形であり、名詞の直接修飾には使えません。",
      "гэхэд": "時間・仮定（〜と言う時に）となり構文に合いません。",
      "гэснээс": "話題転換（〜と言えばところで）となり文意が通りません。"
    },
    "parallelExample": "Улаанбаатар гэдэг хотод амьдардаг.（ウランバートルという都市に住んでいます。）",
    "conditions": {
      "subjectRelation": "same",
      "polarity": "pos_pos",
      "tense": "habit_past",
      "sentenceType": "statement"
    },
    "whatIfScenarios": {
      "ifVerb": "\"Цагаан идээ\" гэж нэрлэдэг.（「乳製品」と名付ける [動詞修飾なら гэж]）",
      "ifQuestion": "Цагаан идээ гэдэг нь юу вэ?（乳製品というのは何ですか？）",
      "ifPerson": "Бат гэдэг оюутан（バトという学生）",
      "ifOrigin": "Гэдэг は動詞 гэх の習慣形です。"
    }
  },
  {
    "id": "cq_j_1",
    "category": "cat_habit",
    "format": 2,
    "difficulty": "beginner",
    "prompt": "Өглөө бүр эрт бос___ хүн эрүүл байдаг.",
    "promptJa": "毎朝早く起き___人は健康でいられます。（習慣的性質・動詞: босох）",
    "options": [
      "дог",
      "оод",
      "вол",
      "сон"
    ],
    "answer": "дог",
    "completedSentence": "Өглөө бүр эрт босдог хүн эрүүл байдаг.",
    "japanese": "毎朝早く起きる人は健康でいられます。",
    "clause1": "Өглөө бүр эрт босдог（毎朝早く起きる [習慣連体修飾]）",
    "clause2": "хүн эрүүл байдаг（人は健康でいる）",
    "grammar": "習慣・反復連体形「-даг / -дэг / -дог / -дөг + 名詞」",
    "baseVerb": "босох（起きる、立つ）",
    "stemAndSuffix": "бос- + -дог（男性母音「о」同調習慣語尾）",
    "whyCorrect": "「毎朝（өглөө бүр）」という継続的・恒常的な習慣を表し、名詞「хүн（人）」を修飾するため、習慣形「-дог」が正解です。",
    "otherOptionsExplained": {
      "оод": "順序副動詞（起きてから）となり、名詞「хүн」を直接修飾できません。",
      "вол": "仮定法（起きれば）となり、名詞修飾になりません。",
      "сон": "一度きりの過去完了（起きた人）となり、「毎朝」という普遍的習慣に合いません。"
    },
    "parallelExample": "Монгол хэл заадаг багш нар эелдэг.（モンゴル語を教える先生方は親切です。）",
    "conditions": {
      "subjectRelation": "same",
      "polarity": "pos_pos",
      "tense": "habit_past",
      "sentenceType": "statement"
    },
    "whatIfScenarios": {
      "ifNegative": "Эрт босдоггүй хүн（早く起きない人 [習慣否定]）",
      "ifPlace": "Ажилладаг газар（働いている場所）",
      "ifThing": "Уудаг цай（いつも飲むお茶）",
      "ifQuestion": "Та өглөө эрт босдог уу?（あなたは朝早く起きる習慣がありますか？）"
    }
  },
  {
    "id": "cq_multi_1",
    "category": "cat_reason",
    "format": 6,
    "difficulty": "advanced",
    "prompt": "Бороо ор___ гэртээ үлд___, ном уншиж өдрийг өнгөрөөв.",
    "promptJa": "雨が降っ___家に残___、本を読んで一日を過ごした。（理由 ＋ 連続）",
    "options": [
      "сон тул / ээд",
      "вол / вэл",
      "хоор / хэд",
      "соор / сөн"
    ],
    "answer": "сон тул / ээд",
    "completedSentence": "Бороо орсон тул гэртээ үлдээд, ном уншиж өдрийг өнгөрөөв.",
    "japanese": "雨が降ったため家に残り、そして本を読んで一日を過ごしました。",
    "clause1": "Бороо орсон тул（雨が降ったため [理由節]）",
    "clause2": "гэртээ үлдээд... өнгөрөөв（家に残ってから...過ごした [連続節]）",
    "grammar": "第1節: 理由「-сон тул」 ＋ 第2節: 動作順序「-ээд」",
    "baseVerb": "орох（降る） / үлдэх（残る）",
    "stemAndSuffix": "ор- + -сон тул ＆ үлд- + -ээд",
    "whyCorrect": "空欄1は雨が降った「客観的理由（-сон туル）」、空欄2は「家に残った上で（-ээд）」本を読んだという動作の完了連続を形成するため、この組み合わせが唯一正確です。",
    "otherOptionsExplained": {
      "вол / вэл": "両方とも仮定条件になり、過去の実際の行動記録になりません。",
      "хоор / хэд": "目的と時間になり、文脈の因果と完了順序が成立しません。",
      "соор / сөн": "継続と連体形になり、文末までの動詞述語連用が破綻します。"
    },
    "parallelExample": "Зав гарсан тул хоол хийгээд, найзыгаа урив.（時間ができたため料理を作って、友達を招きました。）",
    "conditions": {
      "subjectRelation": "different",
      "polarity": "pos_pos",
      "tense": "past_past",
      "sentenceType": "statement"
    },
    "whatIfScenarios": {
      "ifNegative": "Бороо ороогүй тул гарч яваад ирсэн.（雨が降らなかったので外出して帰ってきた）",
      "ifCondition": "Бороо орвол гэртээ үлдээд ном уншина.（雨が降ったら家に残って本を読みます [未来]）",
      "ifQuestion": "Бороо орсон тул гэртээ үлдээд ном уншсан уу?（雨が降ったため家に残って本を読んだのですか？）",
      "ifSameSubject": "Би ядарсан тул амарч аваад явлаа.（私は疲れたのでひと休みしてから行きました）"
    }
  },
  {
    "id": "cq_multi_2",
    "category": "cat_condition",
    "format": 6,
    "difficulty": "advanced",
    "prompt": "Цаг гар___ хамт хоол ид___ явбал ямар вэ?",
    "promptJa": "時間ができ___一緒にご飯を食べ___行ったらどうですか？（条件 ＋ 目的）",
    "options": [
      "вал / эхээр",
      "соор / ээд",
      "ход / хэд",
      "сон / сний"
    ],
    "answer": "вал / эхээр",
    "completedSentence": "Цаг гарвал хамт хоол идэхээр явбал ямар вэ?",
    "japanese": "時間ができたら一緒にご飯を食べに行ったらどうですか？",
    "clause1": "Цаг гарвал（時間ができたら [条件節]）",
    "clause2": "хамт хоол идэхээр явбал（一緒にご飯を食べに行ったら [目的＋提案]）",
    "grammar": "第1節: 仮定条件「-вал」 ＋ 第2節: 移動目的「-хээр」",
    "baseVerb": "гарах（できる、出る） / идэх（食べる）",
    "stemAndSuffix": "гар- + -вал ＆ ид- + -эхээр",
    "whyCorrect": "空欄1は「もし時間ができたら（仮定 -вал）」、空欄2は移動動詞「явбал（行ったら）」に直結する目的「食べに（-эхээр）」を表すため、このペアが完全に合致しています。",
    "otherOptionsExplained": {
      "соор / ээд": "継続（でき続けて）と順序になり、提案の仮定文になりません。",
      "ход / хэд": "時間（できる時）となり、「もし〜なら」の仮定ニュアンスが失われます。",
      "сон / сний": "過去形となり、未来の提案「〜したらどう？」と時制衝突を起こします。"
    },
    "parallelExample": "Боломж олдвол кино үзэхээр явъя.（機会があれば映画を見に行こう。）",
    "conditions": {
      "subjectRelation": "different",
      "polarity": "pos_pos",
      "tense": "fut_fut",
      "sentenceType": "question"
    },
    "whatIfScenarios": {
      "ifPast": "Цаг гарсан тул хоол идэхээр явсан.（時間ができたためご飯を食べに行きました）",
      "ifNegative": "Цаг гарахгүй бол очихгүй.（時間ができなければ行きません）",
      "ifSameSubject": "Би завтай болвол хоол хийж өгнө.（私が暇になったら料理を作ってあげます）",
      "ifStatement": "Цаг гарвал хоол идэхээр явна.（時間ができたらご飯を食べに行きます [平叙文]）"
    }
  },
  {
    "id": "cq_fmt4_1",
    "category": "cat_reason",
    "format": 4,
    "difficulty": "intermediate",
    "prompt": "【日本語】「風邪をひいたので、薬を飲んで寝ました。」\n【モンゴル語】Ханиад хүрсэн ___ эм уугаад унтсан.",
    "promptJa": "日本語の「〜ので」に当たる自然なモンゴル語接続表現を選択してください。",
    "options": [
      "болохоор",
      "гэвч",
      "өмнө",
      "хүртэл"
    ],
    "answer": "болохоор",
    "completedSentence": "Ханиад хүрсэн болохоор эм уугаад унтсан.",
    "japanese": "風邪をひいたので、薬を飲んで寝ました。",
    "clause1": "Ханиад хүрсэн（風邪をひいた [理由節]）",
    "clause2": "эм уугаад унтсан（薬を飲んで寝た [主節]）",
    "grammar": "理由接続詞「болохоор（〜ので）」",
    "baseVerb": "хүрэх（ひく、至る）",
    "stemAndSuffix": "хүр- + -сэн（完了） + болохоор",
    "whyCorrect": "「風邪をひいた」ことが薬を飲んで寝た直接の自然な理由・契機となっているため「болохоор」が正解です。",
    "otherOptionsExplained": {
      "гэвч": "逆接（しかし）となり、「風邪をひいたが薬を飲んで寝た」とおかしな意味になります。",
      "өмнө": "前後関係（前に）となり意味が通じません。",
      "хүртэл": "限度（〜まで）となり因果関係を表せません。"
    },
    "parallelExample": "Цас орсон болохоор зам гулгаатай байна.（雪が降ったので道が滑りやすいです。）",
    "conditions": {
      "subjectRelation": "same",
      "polarity": "pos_pos",
      "tense": "past_past",
      "sentenceType": "statement"
    },
    "whatIfScenarios": {
      "ifDifferentSubject": "Дүү ханиад хүрсэн болохоор би эм авахаар гарсан.（妹が風邪をひいたので私が薬を買いに出た）",
      "ifNegative": "Ханиад хүрээгүй болохоор эм уугаагүй.（風邪をひかなかったので薬を飲まなかった）",
      "ifQuestion": "Ханиад хүрсэн болохоор эрт унтсан уу?（風邪をひいたから早く寝たのですか？）"
    }
  },
  {
    "id": "cq_fmt4_2",
    "category": "cat_contrast",
    "format": 4,
    "difficulty": "intermediate",
    "prompt": "【日本語】「私は行きたかったけれど、忙しかったです。」\n【モンゴル語】Би явахыг хүссэн ___ завгүй байсан.",
    "promptJa": "日本語の「〜けれど（逆接）」に当たるモンゴル語接続表現を選択してください。",
    "options": [
      "боловч",
      "учраас",
      "магц",
      "тулд"
    ],
    "answer": "боловч",
    "completedSentence": "Би явахыг хүссэн боловч завгүй байсан.",
    "japanese": "私は行きたかったけれど、忙しかったです。",
    "clause1": "Би явахыг хүссэн（私は行きたかった）",
    "clause2": "завгүй байсан（忙しかった）",
    "grammar": "逆接接続詞「боловч（〜だけれども）」",
    "baseVerb": "хүсэх（望む、〜したい）",
    "stemAndSuffix": "хүс- + -сэн（過去） + боловч",
    "whyCorrect": "前半の願望（行きたかった）と後半の現実（忙しくて行けなかった）が対立・逆接の関係にあるため「боловч」が正解です。",
    "otherOptionsExplained": {
      "учраас": "理由（〜だから）となり、「行きたかったから忙しかった」と不条理な文になります。",
      "магц": "同時性（〜するやいなや）となり意味を成しません。",
      "тулд": "目的（〜するために）となり逆接になりません。"
    },
    "parallelExample": "Бороо орсон боловч бид явган аялалд гарсан.（雨が降ったけれど私たちはハイキングに出かけた。）",
    "conditions": {
      "subjectRelation": "same",
      "polarity": "pos_pos",
      "tense": "past_past",
      "sentenceType": "statement"
    },
    "whatIfScenarios": {
      "ifQuestion": "Явахыг хүссэн боловч завгүй байсан уу?（行きたかったけれど忙しかったのですか？）",
      "ifNegative": "Явахыг хүсээгүй боловч явсан.（行きたくなかったけれど行きました）"
    }
  },
  {
    "id": "cq_fmt5_1",
    "category": "cat_condition",
    "format": 5,
    "difficulty": "beginner",
    "prompt": "【複文】「Бороо орвол би гэртээ байна.」\n下線部「орвол」の文法的な意味として最も適切な日本語を選んでください。",
    "promptJa": "下線部の接続形式「-вал/-вэл」の意味を答えてください。",
    "options": [
      "降ったら（もし降るなら [仮定条件]）",
      "降ったので（降ったから [理由]）",
      "降る前に（降る前の時点で [前後関係]）",
      "降るために（降らせようとして [目的]）"
    ],
    "answer": "降ったら（もし降るなら [仮定条件]）",
    "completedSentence": "Бороо орвол би гэртээ байна.",
    "japanese": "雨が降ったら私は家にいます。",
    "clause1": "Бороо орвол（雨が降ったら）",
    "clause2": "би гэртээ байна（私は家にいます）",
    "grammar": "条件副動詞語尾「-вал / -вэл（〜したら）」",
    "baseVerb": "орох（入る、降る）",
    "stemAndSuffix": "ор-（語幹） + -вол（母音調和男性円唇）",
    "whyCorrect": "「-вал⁴」は未確定の事態を仮定し、「もし〜なら、〜したら」と後続節の条件を設定する条件副動詞です。",
    "otherOptionsExplained": {
      "降ったので": "理由接続（орсон болохоор / орсон тул）の訳です。",
      "降る前に": "時間・前後関係（орохоос өмнө）の訳です。",
      "降るために": "目的表現（орохын тулд）の訳です。"
    },
    "parallelExample": "Маргааш цаг гарвал хамт дэлгүүр явъя.（明日時間ができたら一緒に買い物へ行こう。）",
    "conditions": {
      "subjectRelation": "different",
      "polarity": "pos_pos",
      "tense": "fut_fut",
      "sentenceType": "statement"
    },
    "whatIfScenarios": {
      "ifNegative": "Бороо орохгүй бол би гадагшаа гарна.（雨が降らなければ私は外出します）",
      "ifPast": "Бороо орсон бол гэртээ байх байсан.（雨が降っていたなら家にいたところだった）"
    }
  },
  {
    "id": "cq_fmt5_2",
    "category": "cat_noun_mod",
    "format": 5,
    "difficulty": "intermediate",
    "prompt": "【複文】「Ээжийн хийсэн хоол маш амттай.」\n下線部「хийсэн」の文構造と意味として正しい解説を選んでください。",
    "promptJa": "名詞修飾形「-сан⁴」の働きを正確に選択してください。",
    "options": [
      "母が作った（名詞「хоол（料理）」を修飾する連体形・完了）",
      "母が料理を作ったので（理由を表す接続節）",
      "母が料理を作る前に（前後関係を表す接続節）",
      "母が料理を作るために（目的を表す接続節）"
    ],
    "answer": "母が作った（名詞「хоол（料理）」を修飾する連体形・完了）",
    "completedSentence": "Ээжийн хийсэн хоол маш амттай.",
    "japanese": "母が作った料理はとてもおいしいです。",
    "clause1": "Ээжийн хийсэн（母が作った [連体節]）",
    "clause2": "хоол маш амттай（料理はとてもおいしい [主節]）",
    "grammar": "過去連体形（形動詞）「-сан⁴（〜した）」による名詞修飾",
    "baseVerb": "хийх（作る、する）",
    "stemAndSuffix": "хий- + -сэн",
    "whyCorrect": "名詞「хоол」の直前に位置し、「母が作った〜」と修飾しています。連体節内の主語「Ээж」が属格「Ээжийн」になる点もモンゴル語複文の大きな特徴です。",
    "otherOptionsExplained": {
      "作ったので": "「хийсэн болохоор」の訳です。本問は名詞修飾（連体修飾）です。",
      "作る前に": "「хийхээс өмнө」の訳です。",
      "作るために": "「хиboxын тулд」の訳です。"
    },
    "parallelExample": "Миний уншсан ном сонирхолтой байсан.（私が読んだ本は面白かった。）",
    "conditions": {
      "subjectRelation": "different",
      "polarity": "pos_pos",
      "tense": "past_pres",
      "sentenceType": "statement"
    },
    "whatIfScenarios": {
      "ifHabitual": "Ээжийн хийдэг хоол амттай.（母がいつも作る料理はおいしい [習慣 -даг]）",
      "ifFuture": "Ээжийн хийх хоол амттай байх.（母が作る予定の料理はおいしいだろう [未来 -х]）"
    }
  },
  {
    "id": "cq_fmt6_2",
    "category": "cat_relation",
    "format": 6,
    "difficulty": "advanced",
    "prompt": "【2箇所空欄補充】\nМонголд ир___ дараа монгол хэл сайн сур___ зорилготой байсан.\n（モンゴルに来た後、モンゴル語をしっかり学ぶ目的を持っていた。）",
    "promptJa": "空欄1（〜した後で: -сний дараа）と空欄2（学ぶ目的: 連体形 -х）の正しいペアを選んでください。",
    "options": [
      "сний / х",
      "ээд / сэн",
      "вэл / хээр",
      "хэд / дэг"
    ],
    "answer": "сний / х",
    "completedSentence": "Монголд ирсний дараа монгол хэл сайн сурах зорилготой байсан.",
    "japanese": "モンゴルに来た後、モンゴル語をしっかり学ぶ目的を持っていた。",
    "clause1": "Монголд ирсний дараа（モンゴルに来た後 [前後関係]）",
    "clause2": "монгол хэл сайн сурах зорилготой байсан（モンゴル語をしっかり学ぶ目的を持っていた [名詞修飾＋主節]）",
    "grammar": "第1節: 前後関係「-сний дараа（〜した後で）」 ＋ 第2節: 名詞修飾「-х зорилго（〜する目的）」",
    "baseVerb": "ирэх（来る） / сурах（学ぶ）",
    "stemAndSuffix": "ир- + -сний ＆ сур- + -ах",
    "whyCorrect": "「〜した後で」は完了形動詞の属格形「-сний / -сны дараа」となり、「学ぶ目的」は名詞「зорилго」を未来形動詞「-х」が修飾するため「сний / х」が正解です。",
    "otherOptionsExplained": {
      "ээд / сэн": "副動詞「ирээд」の直後に「дараа」は置けず、また「сурсан зорилго」では時制が矛盾します。",
      "вэл / хээр": "仮定となり、また目的語尾が名詞を修飾できません。",
      "хэд / дэг": "「ирэхэд дараа」という文法結合は存在しません。"
    },
    "parallelExample": "Их сургуульд орсны дараа мэргэжлээрээ ажиллах хүсэлтэй.（大学に入った後、専門で働きたい希望がある。）",
    "conditions": {
      "subjectRelation": "same",
      "polarity": "pos_pos",
      "tense": "past_past",
      "sentenceType": "statement"
    },
    "whatIfScenarios": {
      "ifNegative": "Ирэхээс өмнө сурсан байсан.（来る前に学んでいた）",
      "ifQuestion": "Монголд ирсний дараа юу хийх зорилготой байсан бэ?（モンゴルに来た後どんな目的を持っていたの？）"
    }
  }
];


/**
 * ComplexSentenceCombinator
 * モンゴル語複文の動的ランダム生成エンジン
 * 主語の一致/不一致、肯定/否定の4象限、時制、疑問/平叙の直積バリエーションを生成
 */
export class ComplexSentenceCombinator {
  static CLAUSE_TEMPLATES = [
    {
      theme: "study",
      category: "cat_reason",
      subject1: { same: "Би", diff: "Багш" },
      subject2: { same: "би", diff: "сурагчид" },
      verb1: { stem: "хичээл хий", dict: "хичээл хийх", meaning: "勉強する", vowel: "female" },
      verb2: { stem: "шалгалтад тэнц", dict: "шалгалтад тэнцэх", meaning: "試験に合格する", vowel: "female" },
      patterns: {
        reason_past: {
          mn: "{S1} хичээлээ сайн {V1_REASON}, {S2} шалгалтад {V2_TENSE}.",
          ja: "{S1_JA}勉強をしっかり{V1_REASON_JA}、{S2_JA}試験に{V2_TENSE_JA}。"
        },
        condition_fut: {
          mn: "{S1} хичээлээ сайн {V1_COND}, {S2} шалгалтад {V2_TENSE}.",
          ja: "{S1_JA}勉強をしっかり{V1_COND_JA}、{S2_JA}試験に{V2_TENSE_JA}。"
        },
        sequence_past: {
          mn: "{S1} хичээлээ {V1_SEQ}, {S2} {V2_TENSE}.",
          ja: "{S1_JA}勉強を{V1_SEQ_JA}、{S2_JA}{V2_TENSE_JA}。"
        }
      }
    },
    {
      theme: "weather",
      category: "cat_condition",
      subject1: { same: "Бороо", diff: "Цас" },
      subject2: { same: "бид", diff: "зам" },
      verb1: { stem: "ор", dict: "орох", meaning: "降る", vowel: "male" },
      verb2: { stem: "хаагд", dict: "хаагдах", meaning: "閉鎖される", vowel: "male" },
      patterns: {
        condition_fut: {
          mn: "{S1} их {V1_COND}, {S2} {V2_TENSE}.",
          ja: "{S1_JA}たくさん{V1_COND_JA}、{S2_JA}{V2_TENSE_JA}。"
        },
        reason_past: {
          mn: "{S1} их {V1_REASON}, {S2} {V2_TENSE}.",
          ja: "{S1_JA}たくさん{V1_REASON_JA}、{S2_JA}{V2_TENSE_JA}。"
        }
      }
    },
    {
      theme: "dining",
      category: "cat_sequence",
      subject1: { same: "Би", diff: "Ээж" },
      subject2: { same: "би", diff: "бид" },
      verb1: { stem: "хоол ид", dict: "хоол идэх", meaning: "食事をする", vowel: "female" },
      verb2: { stem: "сургууль руу яв", dict: "сургууль руу явах", meaning: "学校へ行く", vowel: "male" },
      patterns: {
        sequence_past: {
          mn: "{S1} {V1_SEQ}, {S2} {V2_TENSE}.",
          ja: "{S1_JA}{V1_SEQ_JA}、{S2_JA}{V2_TENSE_JA}。"
        },
        time_past: {
          mn: "{S1} {V1_TIME}, {S2} {V2_TENSE}.",
          ja: "{S1_JA}{V1_TIME_JA}、{S2_JA}{V2_TENSE_JA}。"
        }
      }
    },
    {
      theme: "travel",
      category: "cat_purpose",
      subject1: { same: "Би", diff: "Найз" },
      subject2: { same: "би", diff: "бид" },
      verb1: { stem: "Монгол хэл сур", dict: "сурах", meaning: "モンゴル語を学ぶ", vowel: "male" },
      verb2: { stem: "Монголд ир", dict: "ирэх", meaning: "モンゴルへ来る", vowel: "female" },
      patterns: {
        purpose_past: {
          mn: "{S1} {V1_PURPOSE}, {S2} {V2_TENSE}.",
          ja: "{S1_JA}{V1_PURPOSE_JA}、{S2_JA}{V2_TENSE_JA}。"
        }
      }
    }
  ];

  static generateRandomQuestion(options = {}) {
    const templates = this.CLAUSE_TEMPLATES;
    const tmpl = templates[Math.floor(Math.random() * templates.length)];

    const isSameSubject = options.subjectRelation ? (options.subjectRelation === 'same') : (Math.random() < 0.5);
    const s1 = isSameSubject ? tmpl.subject1.same : tmpl.subject1.diff;
    const s2 = isSameSubject ? tmpl.subject2.same : tmpl.subject2.diff;

    const polarities = ['pos_pos', 'pos_neg', 'neg_pos', 'neg_neg'];
    const polarity = options.polarity || polarities[Math.floor(Math.random() * polarities.length)];
    const p1Neg = polarity.startsWith('neg');
    const p2Neg = polarity.endsWith('neg');

    const isQuestion = options.isQuestion !== undefined ? options.isQuestion : (Math.random() < 0.35);
    const tense = options.tense || (Math.random() < 0.6 ? 'past' : 'future');

    const patternKeys = Object.keys(tmpl.patterns);
    const patternKey = patternKeys[Math.floor(Math.random() * patternKeys.length)];

    let correctOption = "";
    let v1BlankOptions = [];
    let whyReason = "";
    let category = tmpl.category;
    let grammarLabel = "";

    if (patternKey.includes('reason')) {
      category = 'cat_reason';
      grammarLabel = '理由接続「болохоор / тул」';
      if (p1Neg) {
        correctOption = tmpl.verb1.vowel === 'male' ? "ороогүй болохоор" : "хийгээгүй болохоор";
        v1BlankOptions = [correctOption, "орвол", "орсон боловч", "орохоос өмнө"];
      } else {
        correctOption = tmpl.verb1.vowel === 'male' ? "орсон болохоор" : "хийсэн болохоор";
        v1BlankOptions = [correctOption, "орвол", "орсон боловч", "орохоос өмнө"];
      }
      whyReason = "前半が後半の事態の生じた直接の理由・原因を表すため「болохоор」が正解です。";
    } else if (patternKey.includes('condition')) {
      category = 'cat_condition';
      grammarLabel = '条件接続「-вал / -вэл」';
      if (p1Neg) {
        correctOption = tmpl.verb1.vowel === 'male' ? "орохгүй бол" : "хийхгүй бол";
        v1BlankOptions = [correctOption, "орсон болохоор", "орсон боловч", "орсноос дараа"];
      } else {
        correctOption = tmpl.verb1.vowel === 'male' ? "орвол" : "хийвэл";
        v1BlankOptions = [correctOption, "орсон болохоор", "орсон боловч", "орсноос дараа"];
      }
      whyReason = "「もし〜ならば」という仮定条件を提示するため仮定語尾が正解です。";
    } else if (patternKey.includes('sequence')) {
      category = 'cat_sequence';
      grammarLabel = '動作順序「-аад / -ээд」';
      correctOption = tmpl.verb1.vowel === 'male' ? "аваад" : "идээд";
      v1BlankOptions = [correctOption, "идэхэд", "идсэн", "идвэл"];
      whyReason = "先行動作が完了してから次の動作へ進む順序完了を表すため「-аад/-ээд」が正解です。";
    } else if (patternKey.includes('time')) {
      category = 'cat_time';
      grammarLabel = isSameSubject ? '時間（同一主語「-хдаа」）' : '時間（主語不一致「-хад」）';
      if (isSameSubject) {
        correctOption = tmpl.verb1.vowel === 'male' ? "явахдаа" : "идэхдээ";
        v1BlankOptions = [correctOption, tmpl.verb1.vowel === 'male' ? "явахад" : "идэхэд", "яваад", "явбал"];
        whyReason = "2つの節の主語が同一人物であるため、再帰語尾を伴う「-хдаа / -хдээ」が正解です。";
      } else {
        correctOption = tmpl.verb1.vowel === 'male' ? "явахад" : "идэхэд";
        v1BlankOptions = [correctOption, tmpl.verb1.vowel === 'male' ? "явахдаа" : "идэхдээ", "яваад", "явбал"];
        whyReason = "主語が異なる節同士の時間の交差を表すため「-хад / -хэд」が正解です。";
      }
    } else {
      category = 'cat_purpose';
      grammarLabel = '目的「-хын тулд」';
      correctOption = tmpl.verb1.vowel === 'male' ? "сурахын тулд" : "хийхийн тулд";
      v1BlankOptions = [correctOption, "сурахад", "сурсны дараа", "сурвал"];
      whyReason = "行為を行う目的・意図（〜するために）を表すため「-хын тулд」が正解です。";
    }

    // シャッフル
    const shuffledOptions = [...v1BlankOptions].sort(() => Math.random() - 0.5);

    // 主節の動詞の時制・否定・疑問語尾
    let v2Final = "";
    if (tense === 'past') {
      v2Final = p2Neg ? "яваагүй" : "явсан";
    } else {
      v2Final = p2Neg ? "явахгүй" : "явна";
    }
    if (isQuestion) {
      v2Final += " уу?";
    } else {
      v2Final += ".";
    }

    const promptSentence = `${s1} ___ , ${s2} ${v2Final}`;
    const completedSent = `${s1} ${correctOption}, ${s2} ${v2Final}`;

    return {
      id: `dyn_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      category: category,
      format: 1,
      difficulty: isSameSubject ? "beginner" : "intermediate",
      isDynamic: true,
      prompt: promptSentence,
      promptJa: `空欄に入る適切な接続形式を選択してください。（主語関係: ${isSameSubject ? '同一主語' : '異なる主語'} / 時制: ${tense === 'past' ? '過去' : '未来'} / 文種: ${isQuestion ? '疑問文' : '平叙文'}）`,
      options: shuffledOptions,
      answer: correctOption,
      completedSentence: completedSent,
      japanese: `【動的生成複文】${completedSent}`,
      clause1: `${s1} ${correctOption}`,
      clause2: `${s2} ${v2Final}`,
      grammar: grammarLabel,
      baseVerb: tmpl.verb1.dict,
      stemAndSuffix: `${tmpl.verb1.stem} + 接続語尾`,
      whyCorrect: whyReason,
      otherOptionsExplained: {
        "その他": "主語の一致・不一致や時制・否定条件に適合しない形式です。"
      },
      parallelExample: `${completedSent}`,
      conditions: {
        subjectRelation: isSameSubject ? "same" : "different",
        polarity: polarity,
        tense: tense,
        sentenceType: isQuestion ? "question" : "statement"
      },
      whatIfScenarios: {
        ifDiffSubject: isSameSubject ? "主語が異なる場合、時間節では -хдаа ではなく -хад に変化します！" : "主語が同じ場合、時間節では -хад ではなく -хдаа を使います！",
        ifNegative: "否定形が入ると、接続語尾の前に「-гүй」が付き、語尾の形も変化します。",
        ifQuestion: isQuestion ? "平叙文にすると文末の уу/үү が取れピリオドになります。" : "疑問文にすると文末に母音調和に応じて уу/үү が付きます。",
        ifTenseChanged: tense === 'past' ? "未来にすると、文末が「-на/-нэ」や「-хгүй」に切り替わります。" : "過去にすると、文末が「-сан/-сэн」や「-аагүй」になります。"
      }
    };
  }
}

if (typeof window !== 'undefined') {
  window.COMPLEX_SENTENCE_CATEGORIES = COMPLEX_SENTENCE_CATEGORIES;
  window.SAME_VERB_COMPARISONS = SAME_VERB_COMPARISONS;
  window.CURATED_COMPLEX_QUESTIONS = CURATED_COMPLEX_QUESTIONS;
  window.ComplexSentenceCombinator = ComplexSentenceCombinator;
}
