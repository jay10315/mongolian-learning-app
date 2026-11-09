import sys, os, json
sys.stdout.reconfigure(encoding='utf-8')

families = [
  {
    "familyId": "fam_surah",
    "lemma": "сурах",
    "pos": "動詞",
    "meaning": "学ぶ、習う、勉強する",
    "stem": "сур-",
    "vowelHarmonic": "masculine",
    "textbookAppearance": "第9課・第10課・練習問題集",
    "forms": [
      {
        "formId": "fam_surah_dict",
        "mongolian": "сурах",
        "japanese": "学ぶ、習う",
        "role": "辞書形（原形・名詞形）",
        "ruleDesc": "動詞語幹 сур- ＋ 辞書形語尾 -ах",
        "exampleMn": "Монгол хэл сурах нь сонирхолтой.",
        "exampleJa": "モンゴル語を学ぶことは面白いです。",
        "category": "dictionary",
        "isCore": True
      },
      {
        "formId": "fam_surah_stem",
        "mongolian": "сур",
        "japanese": "学べ、習え（語幹・命令）",
        "role": "語幹・直接命令形",
        "ruleDesc": "用言の語根そのもの。親しい相手への直接命令",
        "exampleMn": "Шинэ үгээ сайн сур!",
        "exampleJa": "新しい単語をしっかり学べ！",
        "category": "imperative",
        "isCore": False
      },
      {
        "formId": "fam_surah_past_san",
        "mongolian": "сурсан",
        "japanese": "学んだ、習った",
        "role": "過去時制（既定・完了）",
        "ruleDesc": "動詞語幹 сур- ＋ 過去語尾 -сан（男性母音）",
        "exampleMn": "Би их сургуульд монгол хэл сурсан.",
        "exampleJa": "私は大学でモンゴル語を学びました。",
        "category": "past",
        "isCore": True
      },
      {
        "formId": "fam_surah_past_laa",
        "mongolian": "сурлаа",
        "japanese": "学びました（体験過去）",
        "role": "過去終止形（身近な過去・報告）",
        "ruleDesc": "動詞語幹 сур- ＋ 終止過去語尾 -лаа",
        "exampleMn": "Би өнөөдөр олон шинэ үг сурлаа.",
        "exampleJa": "私は今日たくさんの新しい単語を学びました。",
        "category": "past",
        "isCore": True
      },
      {
        "formId": "fam_surah_past_neg",
        "mongolian": "сураагүй",
        "japanese": "学ばなかった、習わなかった",
        "role": "過去否定形",
        "ruleDesc": "動詞語幹 сур- ＋ 過去否定語尾 -аагүй",
        "exampleMn": "Тэр үед би орос хэл сураагүй.",
        "exampleJa": "その時私はロシア語を学びませんでした。",
        "category": "negative",
        "isCore": True
      },
      {
        "formId": "fam_surah_habit",
        "mongolian": "сурдаг",
        "japanese": "普段学ぶ、勉強する",
        "role": "習慣形（反復・日常的動作）",
        "ruleDesc": "動詞語幹 сур- ＋ 習慣語尾 -даг（第6課）",
        "exampleMn": "Манай дүү дунд сургуульд сурдаг.",
        "exampleJa": "私の弟は中学校で学んでいます（通っています）。",
        "category": "present_habit",
        "isCore": True
      },
      {
        "formId": "fam_surah_habit_neg",
        "mongolian": "сурдаггүй",
        "japanese": "普段学ばない",
        "role": "習慣否定形",
        "ruleDesc": "動詞語幹 сур- ＋ 習慣否定語尾 -даггүй",
        "exampleMn": "Тэр амралтын өдөр хичээл сурдаггүй.",
        "exampleJa": "彼は休日に勉強しません。",
        "category": "negative",
        "isCore": False
      },
      {
        "formId": "fam_surah_prog",
        "mongolian": "сурч байна",
        "japanese": "学んでいる、勉強中である",
        "role": "現在進行時制（継続・進行）",
        "ruleDesc": "動詞語幹 сур- ＋ 副動詞 -ч ＋ байна（第10課）",
        "exampleMn": "Би одоо монгол хэл идэвхтэй сурч байна.",
        "exampleJa": "私は今モンゴル語を熱心に学んでいます。",
        "category": "progressive",
        "isCore": True
      },
      {
        "formId": "fam_surah_future",
        "mongolian": "сурна",
        "japanese": "学びます、勉強するつもりだ",
        "role": "未来時制・意志形",
        "ruleDesc": "動詞語幹 сур- ＋ 未来語尾 -на（第5課）",
        "exampleMn": "Би маргааш шинэ дүрмийг сурна.",
        "exampleJa": "私は明日新しい文法を学びます。",
        "category": "future_intent",
        "isCore": True
      },
      {
        "formId": "fam_surah_volitive",
        "mongolian": "суръя",
        "japanese": "学びましょう、勉強しよう",
        "role": "希求・意志・勧誘形",
        "ruleDesc": "動詞語幹 сур- ＋ 硬音符 ъ ＋ 希求語尾 -я（第15課）",
        "exampleMn": "Бүгдээрээ монгол дуу суръя.",
        "exampleJa": "みんなでモンゴルの歌を学びましょう。",
        "category": "future_intent",
        "isCore": True
      },
      {
        "formId": "fam_surah_polite_imp",
        "mongolian": "сураарай",
        "japanese": "学んでください、勉強しなさい",
        "role": "助言・丁寧な命令形",
        "ruleDesc": "動詞語幹 сур- ＋ 丁寧命令語尾 -аарай（第6課）",
        "exampleMn": "Та монгол хэлийг сайн сураарай.",
        "exampleJa": "モンゴル語をしっかり学んでください。",
        "category": "imperative",
        "isCore": True
      },
      {
        "formId": "fam_surah_prohibitive",
        "mongolian": "битгий сураарай",
        "japanese": "学ばないでください",
        "role": "禁止命令形",
        "ruleDesc": "禁止前置詞 битгий ＋ -аарай",
        "exampleMn": "Буруу үгийг битгий сураарай.",
        "exampleJa": "間違った単語を学ばないでください。",
        "category": "negative",
        "isCore": False
      },
      {
        "formId": "fam_surah_desiderative",
        "mongolian": "сурмаар байна",
        "japanese": "学びたい、習いたい",
        "role": "願望形",
        "ruleDesc": "動詞語幹 сур- ＋ 願望語尾 -маар байна（第13課）",
        "exampleMn": "Би морин хуур тоглож сурмаар байна.",
        "exampleJa": "私は馬頭琴の弾き方を習いたいです。",
        "category": "future_intent",
        "isCore": True
      },
      {
        "formId": "fam_surah_potential",
        "mongolian": "сурч чадна",
        "japanese": "学ぶことができる、習得できる",
        "role": "可能表現",
        "ruleDesc": "動詞語幹 сур- ＋ 副動詞 -ч ＋ чадна（第10課）",
        "exampleMn": "Та шаргуу хичээвэл сурч чадна.",
        "exampleJa": "熱心に努力すれば学ぶことができます。",
        "category": "progressive",
        "isCore": True
      },
      {
        "formId": "fam_surah_conditional",
        "mongolian": "сурвал",
        "japanese": "学べば、習うなら",
        "role": "仮定・条件形",
        "ruleDesc": "動詞語幹 сур- ＋ 条件語尾 -вал（第14課）",
        "exampleMn": "Дүрмийг сайн сурвал ярьж чадна.",
        "exampleJa": "文法をしっかり学べば話せるようになります。",
        "category": "converb",
        "isCore": True
      },
      {
        "formId": "fam_surah_successive",
        "mongolian": "сураад",
        "japanese": "学んで、習ってから",
        "role": "並列・先行完了形",
        "ruleDesc": "動詞語幹 сур- ＋ 並列語尾 -аад（第15課）",
        "exampleMn": "Тэр үг сураад шалгалт өгсөн.",
        "exampleJa": "彼は単語を学んでから試験を受けました。",
        "category": "converb",
        "isCore": True
      },
      {
        "formId": "fam_surah_purpose",
        "mongolian": "сурахаар",
        "japanese": "学ぶために、習いに",
        "role": "目的表現",
        "ruleDesc": "動詞語幹 сур- ＋ 目的語尾 -хаар（第9課）",
        "exampleMn": "Япон хэл сурахаар Японд ирсэн.",
        "exampleJa": "日本語を学ぶために日本に来ました。",
        "category": "converb",
        "isCore": True
      },
      {
        "formId": "fam_surah_temporal",
        "mongolian": "сурахад",
        "japanese": "学ぶとき、習う際に",
        "role": "時間連用節",
        "ruleDesc": "動詞語幹 сур- ＋ 連用節語尾 -хад（第8課）",
        "exampleMn": "Монгол хэл сурахад толь бичиг хэрэгтэй.",
        "exampleJa": "モンゴル語を学ぶとき辞書が必要です。",
        "category": "converb",
        "isCore": False
      },
      {
        "formId": "fam_surah_causative",
        "mongolian": "сургах",
        "japanese": "教える、学ばせる、訓練する",
        "role": "使役動詞形",
        "ruleDesc": "語幹 сур- ＋ 使役接尾辞 -га ＋ 辞書形語尾 -х",
        "exampleMn": "Багш оюутнуудад эрдэм сургадаг.",
        "exampleJa": "先生は学生たちに学問を教えます（学ばせます）。",
        "category": "causative",
        "isCore": True
      },
      {
        "formId": "fam_surah_passive",
        "mongolian": "сурагдах",
        "japanese": "学ばれる、習得される",
        "role": "受動（受け身）動詞形",
        "ruleDesc": "語幹 сур- ＋ 連結母音 -а- ＋ 受動接尾辞 -гда ＋ -х",
        "exampleMn": "Монгол хэл олон хүнд сурагдаж байна.",
        "exampleJa": "モンゴル語は大勢の人々に学ばれています。",
        "category": "passive",
        "isCore": True
      },
      {
        "formId": "fam_surah_reciprocal",
        "mongolian": "суралцах",
        "japanese": "互いに学び合う、留学する・就学する",
        "role": "相互・協同動詞形",
        "ruleDesc": "語幹 сур- ＋ 相互接尾辞 -лц ＋ -ах",
        "exampleMn": "Бид хамтдаа суралцаж байна.",
        "exampleJa": "私たちは一緒に学び合っています（就学しています）。",
        "category": "reciprocal",
        "isCore": True
      },
      {
        "formId": "fam_surah_noun_student",
        "mongolian": "сурагч",
        "japanese": "生徒、児童",
        "role": "派生名詞（行為者・人称）",
        "ruleDesc": "語根 сур- ＋ 行為者接尾辞 -агч",
        "exampleMn": "Тэр дунд сургуулийн сурагч.",
        "exampleJa": "彼は中学校の生徒です。",
        "category": "nominal",
        "isCore": True
      },
      {
        "formId": "fam_surah_noun_training",
        "mongolian": "сургалт",
        "japanese": "講習、講座、訓練",
        "role": "派生名詞（事象・行為名詞）",
        "ruleDesc": "使役語幹 сурга- ＋ 抽象名詞接尾辞 -лт",
        "exampleMn": "Сургалтын төвд сургалт эхэлсэн.",
        "exampleJa": "訓練所で研修が始まりました。",
        "category": "nominal",
        "isCore": True
      },
      {
        "formId": "fam_surah_noun_textbook",
        "mongolian": "сурах бичиг",
        "japanese": "教科書、テキスト",
        "role": "名詞句（形動詞 ＋ 名詞）",
        "ruleDesc": "сурах（学ぶための）＋ бичиг（文書・書物）",
        "exampleMn": "Ширээн дээр сурах бичиг байна.",
        "exampleJa": "机の上に教科書があります。",
        "category": "nominal",
        "isCore": True
      }
    ]
  },
  {
    "familyId": "fam_bichih",
    "lemma": "бичих",
    "pos": "動詞",
    "meaning": "書く、記述する",
    "stem": "бич-",
    "vowelHarmonic": "feminine",
    "textbookAppearance": "第3課・第7課・練習問題集",
    "forms": [
      {
        "formId": "fam_bichih_dict",
        "mongolian": "бичих",
        "japanese": "書く",
        "role": "辞書形",
        "ruleDesc": "語幹 бич- ＋ 辞書形語尾 -их",
        "exampleMn": "Үгийг зөв бичих хэрэгтэй.",
        "exampleJa": "単語を正しく書く必要があります。",
        "category": "dictionary",
        "isCore": True
      },
      {
        "formId": "fam_bichih_past_sen",
        "mongolian": "бичсэн",
        "japanese": "書いた",
        "role": "過去時制（完了）",
        "ruleDesc": "語幹 бич- ＋ 過去語尾 -сэн（女性母音）",
        "exampleMn": "Оюутан шинэ үг бичсэн.",
        "exampleJa": "学生は新しい単語を書きました。",
        "category": "past",
        "isCore": True
      },
      {
        "formId": "fam_bichih_past_lee",
        "mongolian": "бичлээ",
        "japanese": "書きました",
        "role": "過去終止形",
        "ruleDesc": "語幹 бич- ＋ 過去終止語尾 -лээ",
        "exampleMn": "Би дэвтэртээ бичлээ.",
        "exampleJa": "私はノートに書きました。",
        "category": "past",
        "isCore": True
      },
      {
        "formId": "fam_bichih_past_neg",
        "mongolian": "бичээгүй",
        "japanese": "書かなかった",
        "role": "過去否定形",
        "ruleDesc": "語幹 бич- ＋ 過去否定語尾 -ээгүй",
        "exampleMn": "Би өчигдөр захиа бичээгүй.",
        "exampleJa": "私は昨日手紙を書きませんでした。",
        "category": "negative",
        "isCore": True
      },
      {
        "formId": "fam_bichih_habit",
        "mongolian": "бичдэг",
        "japanese": "普段書く",
        "role": "習慣形",
        "ruleDesc": "語幹 бич- ＋ 習慣語尾 -дэг",
        "exampleMn": "Тэр өдөр бүр өдрийн тэмдэглэл бичдэг.",
        "exampleJa": "彼は毎日日記を書いています。",
        "category": "present_habit",
        "isCore": True
      },
      {
        "formId": "fam_bichih_prog",
        "mongolian": "бичиж байна",
        "japanese": "書いている",
        "role": "現在進行時制",
        "ruleDesc": "語幹 бич- ＋ -иж ＋ байна",
        "exampleMn": "Оюутан самбарт үг бичиж байна.",
        "exampleJa": "学生は黒板に単語を書いています。",
        "category": "progressive",
        "isCore": True
      },
      {
        "formId": "fam_bichih_future",
        "mongolian": "бичнэ",
        "japanese": "書きます",
        "role": "未来時制・意志形",
        "ruleDesc": "語幹 бич- ＋ 未来語尾 -нэ",
        "exampleMn": "Би маргааш захиа бичнэ.",
        "exampleJa": "私は明日手紙を書きます。",
        "category": "future_intent",
        "isCore": True
      },
      {
        "formId": "fam_bichih_volitive",
        "mongolian": "бичье",
        "japanese": "書きましょう",
        "role": "希求・勧誘形",
        "ruleDesc": "語幹 бич- ＋ 軟音符 ь ＋ 希求語尾 -е",
        "exampleMn": "Бүгдээрээ дасгалаа бичье.",
        "exampleJa": "みんなで練習問題を書きましょう。",
        "category": "future_intent",
        "isCore": True
      },
      {
        "formId": "fam_bichih_polite_imp",
        "mongolian": "бичээрэй",
        "japanese": "書いてください",
        "role": "丁寧な命令形",
        "ruleDesc": "語幹 бич- ＋ -ээрэй",
        "exampleMn": "Дэвтэр дээрээ тод бичээрэй.",
        "exampleJa": "ノートにはっきりと書いてください。",
        "category": "imperative",
        "isCore": True
      },
      {
        "formId": "fam_bichih_desiderative",
        "mongolian": "бичмээр байна",
        "japanese": "書きたい",
        "role": "願望形",
        "ruleDesc": "語幹 бич- ＋ -мээр байна",
        "exampleMn": "Ээждээ захиа бичмээр байна.",
        "exampleJa": "母に手紙を書きたいです。",
        "category": "future_intent",
        "isCore": True
      },
      {
        "formId": "fam_bichih_potential",
        "mongolian": "бичиж чадна",
        "japanese": "書くことができる",
        "role": "可能表現",
        "ruleDesc": "語幹 бич- ＋ -иж ＋ чадна",
        "exampleMn": "Монгол үсгээр бичиж чадна.",
        "exampleJa": "モンゴル文字（キリル文字）で書くことができます。",
        "category": "progressive",
        "isCore": True
      },
      {
        "formId": "fam_bichih_conditional",
        "mongolian": "бичвэл",
        "japanese": "書けば、書いたら",
        "role": "仮定形",
        "ruleDesc": "語幹 бич- ＋ -вэл",
        "exampleMn": "Цаасан дээр бичвэл амархан мартахгүй.",
        "exampleJa": "紙に書けば簡単に忘れません。",
        "category": "converb",
        "isCore": True
      },
      {
        "formId": "fam_bichih_successive",
        "mongolian": "бичээд",
        "japanese": "書いて",
        "role": "並列形",
        "ruleDesc": "語幹 бич- ＋ -ээд",
        "exampleMn": "Хаягаа бичээд дугтуйд хийсэн.",
        "exampleJa": "住所を書いて封筒に入れました。",
        "category": "converb",
        "isCore": True
      },
      {
        "formId": "fam_bichih_causative",
        "mongolian": "бичүүлэх",
        "japanese": "書かせる",
        "role": "使役動詞形",
        "ruleDesc": "語幹 бич- ＋ 使役接尾辞 -үүл ＋ -эх",
        "exampleMn": "Багш сурагчдаар өгүүлбэр бичүүлсэн.",
        "exampleJa": "先生は生徒たちに文章を書かせました。",
        "category": "causative",
        "isCore": True
      },
      {
        "formId": "fam_bichih_passive",
        "mongolian": "бичигдэх",
        "japanese": "書かれる、記される",
        "role": "受動動詞形",
        "ruleDesc": "語幹 бич- ＋ 受動接尾辞 -гд ＋ -эх",
        "exampleMn": "Нэр нь самбарт бичигдсэн.",
        "exampleJa": "名前が黒板に書かれました。",
        "category": "passive",
        "isCore": True
      },
      {
        "formId": "fam_bichih_reciprocal",
        "mongolian": "бичилцэх",
        "japanese": "互いに手紙を書き交わす、文通する",
        "role": "相互動詞形",
        "ruleDesc": "語幹 бич- ＋ 相互接尾辞 -лц ＋ -эх",
        "exampleMn": "Хоёр найз байнга захиа бичилцдэг.",
        "exampleJa": "2人の友達はいつも手紙を書き交わしています。",
        "category": "reciprocal",
        "isCore": True
      },
      {
        "formId": "fam_bichih_noun_letter",
        "mongolian": "бичиг",
        "japanese": "文書、文字、手紙",
        "role": "派生名詞",
        "ruleDesc": "語根 бич- ＋ 名詞化接尾辞 -иг",
        "exampleMn": "Монгол бичиг их гоё харагддаг.",
        "exampleJa": "モンゴル文字はとても美しく見えます。",
        "category": "nominal",
        "isCore": True
      },
      {
        "formId": "fam_bichih_noun_text",
        "mongolian": "бичвэр",
        "japanese": "テキスト、記述文、文章",
        "role": "派生名詞",
        "ruleDesc": "語根 бич- ＋ 成果名詞接尾辞 -вэр",
        "exampleMn": "Бичвэрийн утгыг ойлгов уу?",
        "exampleJa": "テキストの内容を理解しましたか？",
        "category": "nominal",
        "isCore": True
      },
      {
        "formId": "fam_bichih_noun_dict",
        "mongolian": "толь бичиг",
        "japanese": "辞書、辞典",
        "role": "名詞句（鏡 ＋ 書物）",
        "ruleDesc": "толь（鏡）＋ бичиг（書物）＝ 辞書",
        "exampleMn": "Надад япон монгол толь бичиг байгаа.",
        "exampleJa": "私は日蒙辞書を持っています。",
        "category": "nominal",
        "isCore": True
      }
    ]
  },
  {
    "familyId": "fam_unshih",
    "lemma": "унших",
    "pos": "動詞",
    "meaning": "読む、読書する",
    "stem": "унш-",
    "vowelHarmonic": "masculine",
    "textbookAppearance": "第3課・第8課・練習問題集",
    "forms": [
      {"formId": "fam_unshih_dict", "mongolian": "унших", "japanese": "読む", "role": "辞書形", "ruleDesc": "語幹 унш- ＋ -их", "exampleMn": "Ном унших дуртай.", "exampleJa": "本を読むのが好きです。", "category": "dictionary", "isCore": True},
      {"formId": "fam_unshih_past_san", "mongolian": "уншсан", "japanese": "読んだ", "role": "過去時制", "ruleDesc": "語幹 унш- ＋ -сан", "exampleMn": "Би сонирхолтой ном уншсан.", "exampleJa": "私は面白い本を読みました。", "category": "past", "isCore": True},
      {"formId": "fam_unshih_past_neg", "mongolian": "уншаагүй", "japanese": "読まなかった", "role": "過去否定形", "ruleDesc": "語幹 унш- ＋ -аагүй", "exampleMn": "Тэр сонинг уншаагүй.", "exampleJa": "彼はその新聞を読みませんでした。", "category": "negative", "isCore": True},
      {"formId": "fam_unshih_habit", "mongolian": "уншдаг", "japanese": "普段読む", "role": "習慣形", "ruleDesc": "語幹 унш- ＋ -даг", "exampleMn": "Орой бүр ном уншдаг.", "exampleJa": "毎晩本を読みます。", "category": "present_habit", "isCore": True},
      {"formId": "fam_unshih_prog", "mongolian": "уншиж байна", "japanese": "読んでいる", "role": "現在進行時制", "ruleDesc": "語幹 унш- ＋ -иж ＋ байна", "exampleMn": "Оюутан сэтгүүл уншиж байна.", "exampleJa": "学生は雑誌を読んでいます。", "category": "progressive", "isCore": True},
      {"formId": "fam_unshih_future", "mongolian": "уншина", "japanese": "読みます", "role": "未来時制", "ruleDesc": "語幹 унш- ＋ -ина", "exampleMn": "Би маргааш энэ номыг уншина.", "exampleJa": "私は明日この本を読みます。", "category": "future_intent", "isCore": True},
      {"formId": "fam_unshih_volitive", "mongolian": "уншья", "japanese": "読みましょう", "role": "希求形", "ruleDesc": "語幹 унш- ＋ ь ＋ -я", "exampleMn": "Энэ текстийг чанга уншья.", "exampleJa": "この文章を声に出して読みましょう。", "category": "future_intent", "isCore": True},
      {"formId": "fam_unshih_polite_imp", "mongolian": "уншаарай", "japanese": "読んでください", "role": "丁寧な命令形", "ruleDesc": "語幹 унш- ＋ -аарай", "exampleMn": "Дасгалын өгүүлбэрийг уншаарай.", "exampleJa": "練習問題の文を読んでください。", "category": "imperative", "isCore": True},
      {"formId": "fam_unshih_desiderative", "mongolian": "уншмаар байна", "japanese": "読みたい", "role": "願望形", "ruleDesc": "語幹 унш- ＋ -маар байна", "exampleMn": "Монгол үлгэр уншмаар байна.", "exampleJa": "モンゴルの民話を読みたいです。", "category": "future_intent", "isCore": True},
      {"formId": "fam_unshih_causative", "mongolian": "уншуулах", "japanese": "読ませる", "role": "使役動詞形", "ruleDesc": "語幹 унш- ＋ -уул ＋ -ах", "exampleMn": "Багш оюутнаар ном уншуулсан.", "exampleJa": "先生は学生に本を読ませました。", "category": "causative", "isCore": True},
      {"formId": "fam_unshih_passive", "mongolian": "уншигдах", "japanese": "読まれる", "role": "受動動詞形", "ruleDesc": "語幹 унш- ＋ -игд ＋ -эх", "exampleMn": "Энэ ном олон хүнд уншигдсан.", "exampleJa": "この本は大勢の人に読まれました。", "category": "passive", "isCore": True},
      {"formId": "fam_unshih_noun_reader", "mongolian": "уншигч", "japanese": "読者", "role": "派生名詞", "ruleDesc": "語根 унш- ＋ -игч", "exampleMn": "Номын санд уншигчид олон байна.", "exampleJa": "図書館には読者が大勢います。", "category": "nominal", "isCore": True},
      {"formId": "fam_unshih_noun_reading", "mongolian": "уншлага", "japanese": "読書、リーディング", "role": "派生名詞", "ruleDesc": "語根 унш- ＋ -лага", "exampleMn": "Уншлагын дасгал хийцгээе.", "exampleJa": "リーディングの練習をしましょう。", "category": "nominal", "isCore": True}
    ]
  },
  {
    "familyId": "fam_yarih",
    "lemma": "ярих",
    "pos": "動詞",
    "meaning": "話す、喋る",
    "stem": "ярь- / яри-",
    "vowelHarmonic": "masculine",
    "textbookAppearance": "第3課・第8課・第10課・練習問題集",
    "forms": [
      {"formId": "fam_yarih_dict", "mongolian": "ярих", "japanese": "話す", "role": "辞書形", "ruleDesc": "語幹 яри- ＋ -х", "exampleMn": "Монголоор ярих дуртай.", "exampleJa": "モンゴル語で話すのが好きです。", "category": "dictionary", "isCore": True},
      {"formId": "fam_yarih_past_san", "mongolian": "ярьсан", "japanese": "話した", "role": "過去時制", "ruleDesc": "語幹 ярь- ＋ -сан", "exampleMn": "Багш Монголын тухай ярьсан.", "exampleJa": "先生はモンゴルについて話しました。", "category": "past", "isCore": True},
      {"formId": "fam_yarih_past_neg", "mongolian": "яриагүй", "japanese": "話さなかった", "role": "過去否定形", "ruleDesc": "語幹 яри- ＋ -аагүй", "exampleMn": "Би түүнтэй яриагүй.", "exampleJa": "私は彼と話しませんでした。", "category": "negative", "isCore": True},
      {"formId": "fam_yarih_habit", "mongolian": "ярьдаг", "japanese": "普段話す", "role": "習慣形", "ruleDesc": "語幹 ярь- ＋ -даг", "exampleMn": "Тэр монголоор сайн ярьдаг.", "exampleJa": "彼はモンゴル語で上手に話します。", "category": "present_habit", "isCore": True},
      {"formId": "fam_yarih_prog", "mongolian": "ярьж байна", "japanese": "話している", "role": "現在進行時制", "ruleDesc": "語幹 ярь- ＋ -ж ＋ байна", "exampleMn": "Тэд утсаар ярьж байна.", "exampleJa": "彼らは電話で話しています。", "category": "progressive", "isCore": True},
      {"formId": "fam_yarih_future", "mongolian": "ярина", "japanese": "話します", "role": "未来時制", "ruleDesc": "語幹 яри- ＋ -на", "exampleMn": "Би маргааш багштай ярина.", "exampleJa": "私は明日先生と話します。", "category": "future_intent", "isCore": True},
      {"formId": "fam_yarih_volitive", "mongolian": "ярья", "japanese": "話しましょう", "role": "希求形", "ruleDesc": "語幹 ярь- ＋ -я", "exampleMn": "Монгол хэлээр чөлөөтэй ярья.", "exampleJa": "モンゴル語で自由に話しましょう。", "category": "future_intent", "isCore": True},
      {"formId": "fam_yarih_polite_imp", "mongolian": "яриарай", "japanese": "話してください", "role": "丁寧な命令形", "ruleDesc": "語幹 яри- ＋ -аарай", "exampleMn": "Ангидаа монголоор яриарай.", "exampleJa": "教室ではモンゴル語で話してください。", "category": "imperative", "isCore": True},
      {"formId": "fam_yarih_potential", "mongolian": "ярьж чадна", "japanese": "話すことができる", "role": "可能表現", "ruleDesc": "語幹 ярь- ＋ -ж ＋ чадна", "exampleMn": "Тэр 3 хэлээр ярьж чадна.", "exampleJa": "彼は3ヶ国語で話すことができます。", "category": "progressive", "isCore": True},
      {"formId": "fam_yarih_reciprocal", "mongolian": "ярилцах", "japanese": "話し合う、対談する", "role": "相互動詞形", "ruleDesc": "語幹 яри- ＋ -лц ＋ -ах", "exampleMn": "Асуудлын тухай ярилцъя.", "exampleJa": "問題について話し合いましょう。", "category": "reciprocal", "isCore": True},
      {"formId": "fam_yarih_noun_conversation", "mongolian": "яриа", "japanese": "会話、おしゃべり、話", "role": "派生名詞", "ruleDesc": "語根 яри- ＋ -аа", "exampleMn": "Түүний яриа их сонирхолтой.", "exampleJa": "彼の話はとても面白いです。", "category": "nominal", "isCore": True},
      {"formId": "fam_yarih_noun_dialogue", "mongolian": "харилцан яриа", "japanese": "対話、会話練習", "role": "名詞句", "ruleDesc": "харилцан（互いに）＋ яриа（会話）", "exampleMn": "Харилцан яриаг уншаарай.", "exampleJa": "会話文を読んでください。", "category": "nominal", "isCore": True}
    ]
  },
  {
    "familyId": "fam_hiih",
    "lemma": "хийх",
    "pos": "動詞",
    "meaning": "する、作る、入れる、しまう",
    "stem": "хий-",
    "vowelHarmonic": "feminine",
    "textbookAppearance": "第3課・第5課・第6課・練習問題集",
    "forms": [
      {"formId": "fam_hiih_dict", "mongolian": "хийх", "japanese": "する、作る、入れる", "role": "辞書形", "ruleDesc": "語幹 хий- ＋ -х", "exampleMn": "Өнөөдөр юу хийх вэ?", "exampleJa": "今日は何をしますか？", "category": "dictionary", "isCore": True},
      {"formId": "fam_hiih_past_sen", "mongolian": "хийсэн", "japanese": "した、作った、入れた", "role": "過去時制", "ruleDesc": "語幹 хий- ＋ -сэн", "exampleMn": "Би өчигдөр хоол хийсэн.", "exampleJa": "私は昨日料理を作りました。", "category": "past", "isCore": True},
      {"formId": "fam_hiih_past_neg", "mongolian": "хийгээгүй", "japanese": "しなかった、作らなかった", "role": "過去否定形", "ruleDesc": "語幹 хий- ＋ -гээгүй", "exampleMn": "Гэрийн даалгавраа хийгээгүй.", "exampleJa": "宿題をしませんでした。", "category": "negative", "isCore": True},
      {"formId": "fam_hiih_habit", "mongolian": "хийдэг", "japanese": "普段する、作る", "role": "習慣形", "ruleDesc": "語幹 хий- ＋ -дэг", "exampleMn": "Би өдөр бүр дасгал хийдэг.", "exampleJa": "私は毎日運動をしています。", "category": "present_habit", "isCore": True},
      {"formId": "fam_hiih_prog", "mongolian": "хийж байна", "japanese": "している、作っている", "role": "現在進行時制", "ruleDesc": "語幹 хий- ＋ -ж ＋ байна", "exampleMn": "Одоо өдрийн хоол хийж байна.", "exampleJa": "今昼食を作っています。", "category": "progressive", "isCore": True},
      {"formId": "fam_hiih_future", "mongolian": "хийнэ", "japanese": "します、作ります", "role": "未来時制", "ruleDesc": "語幹 хий- ＋ -нэ", "exampleMn": "Би маргааш ажил хийнэ.", "exampleJa": "私は明日仕事をします。", "category": "future_intent", "isCore": True},
      {"formId": "fam_hiih_volitive", "mongolian": "хиье", "japanese": "しましょう、作ろう", "role": "希求形", "ruleDesc": "語幹 хий- ＋ -е", "exampleMn": "Дасгал хөдөлгөөн сайн хийе.", "exampleJa": "よく運動をしましょう。", "category": "future_intent", "isCore": True},
      {"formId": "fam_hiih_polite_imp", "mongolian": "хийгээрэй", "japanese": "してください、入れてください", "role": "丁寧な命令形", "ruleDesc": "語幹 хий- ＋ -гээрэй", "exampleMn": "Хайрцганд хийгээрэй.", "exampleJa": "箱にしまってください。", "category": "imperative", "isCore": True},
      {"formId": "fam_hiih_desiderative", "mongolian": "хиймээр байна", "japanese": "したい、作りたい", "role": "願望形", "ruleDesc": "語幹 хий- ＋ -мээр байна", "exampleMn": "Монгол хоол хиймээр байна.", "exampleJa": "モンゴル料理を作りたいです。", "category": "future_intent", "isCore": True},
      {"formId": "fam_hiih_potential", "mongolian": "хийж чадна", "japanese": "できる、作ることができる", "role": "可能表現", "ruleDesc": "語幹 хий- ＋ -ж ＋ чадна", "exampleMn": "Би япон хоол хийж чадна.", "exampleJa": "私は日本料理を作ることができます。", "category": "progressive", "isCore": True},
      {"formId": "fam_hiih_causative", "mongolian": "хийлгэх", "japanese": "させる、作らせる", "role": "使役動詞形", "ruleDesc": "語幹 хий- ＋ -лг ＋ -эх", "exampleMn": "Дээл оёдолчноор хийлгэсэн.", "exampleJa": "デールを仕立て屋に作らせました。", "category": "causative", "isCore": True},
      {"formId": "fam_hiih_passive", "mongolian": "хийгдэх", "japanese": "行われる、作られる", "role": "受動動詞形", "ruleDesc": "語幹 хий- ＋ -гд ＋ -эх", "exampleMn": "Энэ ширээ модоор хийгдсэн.", "exampleJa": "この机は木で作られました。", "category": "passive", "isCore": True}
    ]
  },
  {
    "familyId": "fam_ideh",
    "lemma": "идэх",
    "pos": "動詞",
    "meaning": "食べる",
    "stem": "ид-",
    "vowelHarmonic": "feminine",
    "textbookAppearance": "第3課・第5課・第18課・練習問題集",
    "forms": [
      {"formId": "fam_ideh_dict", "mongolian": "идэх", "japanese": "食べる", "role": "辞書形", "ruleDesc": "語幹 ид- ＋ -эх", "exampleMn": "Хоол идэх цаг боллоо.", "exampleJa": "ご飯を食べる時間になりました。", "category": "dictionary", "isCore": True},
      {"formId": "fam_ideh_past_sen", "mongolian": "идсэн", "japanese": "食べた", "role": "過去時制", "ruleDesc": "語幹 ид- ＋ -сэн", "exampleMn": "Амттай монгол хоол идсэн.", "exampleJa": "美味しいモンゴル料理を食べました。", "category": "past", "isCore": True},
      {"formId": "fam_ideh_past_neg", "mongolian": "идээгүй", "japanese": "食べなかった", "role": "過去否定形", "ruleDesc": "語幹 ид- ＋ -ээгүй", "exampleMn": "Өглөөний хоол идээгүй.", "exampleJa": "朝食を食べませんでした。", "category": "negative", "isCore": True},
      {"formId": "fam_ideh_habit", "mongolian": "иддэг", "japanese": "普段食べる", "role": "習慣形", "ruleDesc": "語幹 ид- ＋ -дэг", "exampleMn": "Тэр өдөр бүр алим иддэг.", "exampleJa": "彼は毎日りんごを食べます。", "category": "present_habit", "isCore": True},
      {"formId": "fam_ideh_prog", "mongolian": "идэж байна", "japanese": "食べている", "role": "現在進行時制", "ruleDesc": "語幹 ид- ＋ -эж ＋ байна", "exampleMn": "Тэд бууз идэж байна.", "exampleJa": "彼らはボーズ（蒸し餃子）を食べています。", "category": "progressive", "isCore": True},
      {"formId": "fam_ideh_future", "mongolian": "иднэ", "japanese": "食べます", "role": "未来時制", "ruleDesc": "語幹 ид- ＋ -нэ", "exampleMn": "Би өнөөдөр япон хоол иднэ.", "exampleJa": "私は今日日本料理を食べます。", "category": "future_intent", "isCore": True},
      {"formId": "fam_ideh_volitive", "mongolian": "идье", "japanese": "食べましょう", "role": "希求形", "ruleDesc": "語幹 ид- ＋ ь ＋ -е", "exampleMn": "Ямар нэг юм идье.", "exampleJa": "何か食べましょう。", "category": "future_intent", "isCore": True},
      {"formId": "fam_ideh_polite_imp", "mongolian": "идээрэй", "japanese": "食べてください", "role": "丁寧な命令形", "ruleDesc": "語幹 ид- ＋ -ээрэй", "exampleMn": "Чи энэ жигнэмэг идээрэй.", "exampleJa": "このクッキーを食べてください。", "category": "imperative", "isCore": True},
      {"formId": "fam_ideh_desiderative", "mongolian": "идмээр байна", "japanese": "食べたい", "role": "願望形", "ruleDesc": "語幹 ид- ＋ -мээр байна", "exampleMn": "Өнөөдөр зайрмаг идмээр байна.", "exampleJa": "今日アイスクリームが食べたいです。", "category": "future_intent", "isCore": True},
      {"formId": "fam_ideh_potential", "mongolian": "идэж чадна", "japanese": "食べることができる", "role": "可能表現", "ruleDesc": "語幹 ид- ＋ -эж ＋ чадна", "exampleMn": "Би хонины мах идэж чадна.", "exampleJa": "私は羊の肉を食べることができます。", "category": "progressive", "isCore": True},
      {"formId": "fam_ideh_causative", "mongolian": "идүүлэх", "japanese": "食べさせる", "role": "使役動詞形", "ruleDesc": "語幹 ид- ＋ -үүл ＋ -эх", "exampleMn": "Ээж хүүхдэд бантан идүүлсэн.", "exampleJa": "母は子供にお粥を食べさせました。", "category": "causative", "isCore": True},
      {"formId": "fam_ideh_noun_dairy", "mongolian": "цагаан идээ", "japanese": "乳製品（伝統的な白い食べ物）", "role": "派生名詞句", "ruleDesc": "цагаан（白い）＋ идээ（食物）", "exampleMn": "Цагаан идээ их амттай.", "exampleJa": "乳製品はとても美味しいです。", "category": "nominal", "isCore": True}
    ]
  },
  {
    "familyId": "fam_uuh",
    "lemma": "уух",
    "pos": "動詞",
    "meaning": "飲む",
    "stem": "уу-",
    "vowelHarmonic": "masculine",
    "textbookAppearance": "第3課・第5課・第18課・練習問題集",
    "forms": [
      {"formId": "fam_uuh_dict", "mongolian": "уух", "japanese": "飲む", "role": "辞書形", "ruleDesc": "語幹 уу- ＋ -х", "exampleMn": "Цай уух дуртай юу?", "exampleJa": "お茶を飲むのが好きですか？", "category": "dictionary", "isCore": True},
      {"formId": "fam_uuh_past_san", "mongolian": "уусан", "japanese": "飲んだ", "role": "過去時制", "ruleDesc": "語幹 уу- ＋ -сан", "exampleMn": "Бид цайны газарт кофе уусан.", "exampleJa": "私たちは喫茶店でコーヒーを飲みました。", "category": "past", "isCore": True},
      {"formId": "fam_uuh_past_neg", "mongolian": "уугаагүй", "japanese": "飲まなかった", "role": "過去否定形", "ruleDesc": "語幹 уу- ＋ -гаагүй", "exampleMn": "Хүйтэн цай уугаагүй.", "exampleJa": "冷たいお茶を飲みませんでした。", "category": "negative", "isCore": True},
      {"formId": "fam_uuh_habit", "mongolian": "уудаг", "japanese": "普段飲む", "role": "習慣形", "ruleDesc": "語幹 уу- ＋ -даг", "exampleMn": "Монгол хүн сүүтэй цай уудаг.", "exampleJa": "モンゴル人はミルクティーを飲みます。", "category": "present_habit", "isCore": True},
      {"formId": "fam_uuh_prog", "mongolian": "ууж байна", "japanese": "飲んでいる", "role": "現在進行時制", "ruleDesc": "語幹 уу- ＋ -ж ＋ байна", "exampleMn": "Оюутан кофе ууж байна.", "exampleJa": "学生はコーヒーを飲んでいます。", "category": "progressive", "isCore": True},
      {"formId": "fam_uuh_future", "mongolian": "ууна", "japanese": "飲みます", "role": "未来時制", "ruleDesc": "語幹 уу- ＋ -на", "exampleMn": "Би ус ууна.", "exampleJa": "私は水を飲みます。", "category": "future_intent", "isCore": True},
      {"formId": "fam_uuh_volitive", "mongolian": "ууя", "japanese": "飲みましょう", "role": "希求形", "ruleDesc": "語幹 уу- ＋ -я", "exampleMn": "Бүгдээрээ цай ууя.", "exampleJa": "みんなでお茶を飲みましょう。", "category": "future_intent", "isCore": True},
      {"formId": "fam_uuh_polite_imp", "mongolian": "уугаарай", "japanese": "飲んでください", "role": "丁寧な命令形", "ruleDesc": "語幹 уу- ＋ -гаарай", "exampleMn": "Эмээ уугаарай.", "exampleJa": "薬を飲んでください。", "category": "imperative", "isCore": True},
      {"formId": "fam_uuh_desiderative", "mongolian": "уумаар байна", "japanese": "飲みたい", "role": "願望形", "ruleDesc": "語幹 уу- ＋ -маар байна", "exampleMn": "Халуун цай уумаар байна.", "exampleJa": "熱いお茶が飲みたいです。", "category": "future_intent", "isCore": True},
      {"formId": "fam_uuh_causative", "mongolian": "уулгах", "japanese": "飲ませる", "role": "使役動詞形", "ruleDesc": "語幹 уу- ＋ -лга ＋ -х", "exampleMn": "Хүүхдэд сүү уулгасан.", "exampleJa": "子供に牛乳を飲ませました。", "category": "causative", "isCore": True},
      {"formId": "fam_uuh_noun_drink", "mongolian": "ундаа", "japanese": "飲み物、清涼飲料水", "role": "派生名詞", "ruleDesc": "語根 уу- ＋ 名詞化接尾辞 -ндаа", "exampleMn": "Калпис ундаа өгнө үү.", "exampleJa": "カルピスウォーターをください。", "category": "nominal", "isCore": True}
    ]
  },
  {
    "familyId": "fam_yavah",
    "lemma": "явах",
    "pos": "動詞",
    "meaning": "行く、出発する、進む",
    "stem": "яв-",
    "vowelHarmonic": "masculine",
    "textbookAppearance": "第5課・第8課・第12課・練習問題集",
    "forms": [
      {"formId": "fam_yavah_dict", "mongolian": "явах", "japanese": "行く", "role": "辞書形", "ruleDesc": "語幹 яв- ＋ -ах", "exampleMn": "Яаж явах вэ?", "exampleJa": "どうやって行きますか？", "category": "dictionary", "isCore": True},
      {"formId": "fam_yavah_past_san", "mongolian": "явсан", "japanese": "行った", "role": "過去時制", "ruleDesc": "語幹 яв- ＋ -сан", "exampleMn": "Бид зочид буудал руу явсан.", "exampleJa": "私たちはホテルへ行きました。", "category": "past", "isCore": True},
      {"formId": "fam_yavah_past_neg", "mongolian": "яваагүй", "japanese": "行かなかった", "role": "過去否定形", "ruleDesc": "語幹 яв- ＋ -аагүй", "exampleMn": "Хаашаа ч яваагүй.", "exampleJa": "どこへも行きませんでした。", "category": "negative", "isCore": True},
      {"formId": "fam_yavah_habit", "mongolian": "явдаг", "japanese": "普段行く、通う", "role": "習慣形", "ruleDesc": "語幹 яв- ＋ -даг", "exampleMn": "Тэр хүүхэд өдөр бүр сургууль явдаг.", "exampleJa": "その子は毎日学校に通っています。", "category": "present_habit", "isCore": True},
      {"formId": "fam_yavah_prog", "mongolian": "явж байна", "japanese": "行っている、向かっている", "role": "現在進行時制", "ruleDesc": "語幹 яв- ＋ -ж ＋ байна", "exampleMn": "Одоо номын сан руу явж байна.", "exampleJa": "今図書館に向かっています。", "category": "progressive", "isCore": True},
      {"formId": "fam_yavah_future", "mongolian": "явна", "japanese": "行きます", "role": "未来時制", "ruleDesc": "語幹 яв- ＋ -на", "exampleMn": "Бид Монгол руу онгоцоор явна.", "exampleJa": "私たちはモンゴルへ飛行機で行きます。", "category": "future_intent", "isCore": True},
      {"formId": "fam_yavah_volitive", "mongolian": "явъя", "japanese": "行きましょう", "role": "希求形", "ruleDesc": "語幹 яв- ＋ ъ ＋ -я", "exampleMn": "Хотын захиргаа хүртэл явган явъя.", "exampleJa": "市役所まで歩いて行きましょう。", "category": "future_intent", "isCore": True},
      {"formId": "fam_yavah_polite_imp", "mongolian": "яваарай", "japanese": "行ってください", "role": "丁寧な命令形", "ruleDesc": "語幹 яв- ＋ -аарай", "exampleMn": "Ийшээ яваарай.", "exampleJa": "こちらへ進んでください（お進みください）。", "category": "imperative", "isCore": True},
      {"formId": "fam_yavah_desiderative", "mongolian": "явмаар байна", "japanese": "行きたい", "role": "願望形", "ruleDesc": "語幹 яв- ＋ -маар байна", "exampleMn": "Сэргэлэн сум руу явмаар байна.", "exampleJa": "セルゲレン村に行きたいです。", "category": "future_intent", "isCore": True},
      {"formId": "fam_yavah_conditional", "mongolian": "явбал", "japanese": "行けば、行くなら", "role": "仮定形", "ruleDesc": "語幹 яв- ＋ -бал（вの後で-бал）", "exampleMn": "Зах руу явбал хямдхан.", "exampleJa": "市場に行けば安いです。", "category": "converb", "isCore": True},
      {"formId": "fam_yavah_successive", "mongolian": "яваад", "japanese": "行って", "role": "並列形", "ruleDesc": "語幹 яв- ＋ -аад", "exampleMn": "Төв шуудан руу яваад ирлээ.", "exampleJa": "中央郵便局へ行って来ました。", "category": "converb", "isCore": True},
      {"formId": "fam_yavah_causative_send", "mongolian": "явуулах", "japanese": "送る、行かせる", "role": "使役動詞形（小包・手紙を送る）", "ruleDesc": "語幹 яв- ＋ 使役接尾辞 -уул ＋ -ах", "exampleMn": "Япон руу илгээмж явуулна.", "exampleJa": "日本へ小包を送ります。", "category": "causative", "isCore": True},
      {"formId": "fam_yavah_noun_walk", "mongolian": "явган явах", "japanese": "歩いて行く、徒歩で行く", "role": "派生表現", "ruleDesc": "явган（徒歩の）＋ явах（行く）", "exampleMn": "Сургууль руугаа явган явсан.", "exampleJa": "学校へ歩いて行きました。", "category": "nominal", "isCore": True}
    ]
  },
  {
    "familyId": "fam_ireh",
    "lemma": "ирэх",
    "pos": "動詞",
    "meaning": "来る、到着する",
    "stem": "ир-",
    "vowelHarmonic": "feminine",
    "textbookAppearance": "第3課・第8課・第12課・練習問題集",
    "forms": [
      {"formId": "fam_ireh_dict", "mongolian": "ирэх", "japanese": "来る", "role": "辞書形", "ruleDesc": "語幹 ир- ＋ -эх", "exampleMn": "Цагтаа ирэх хэрэгтэй.", "exampleJa": "時間通りに来る必要があります。", "category": "dictionary", "isCore": True},
      {"formId": "fam_ireh_past_sen", "mongolian": "ирсэн", "japanese": "来た", "role": "過去時制", "ruleDesc": "語幹 ир- ＋ -сэн", "exampleMn": "Би Токиогоос ирсэн.", "exampleJa": "私は東京から来ました。", "category": "past", "isCore": True},
      {"formId": "fam_ireh_past_neg", "mongolian": "ирээгүй", "japanese": "来なかった、休んだ", "role": "過去否定形", "ruleDesc": "語幹 ир- ＋ -ээгүй", "exampleMn": "Өчигдөр ажилдаа ирээгүй.", "exampleJa": "昨日仕事に来ませんでした（休みました）。", "category": "negative", "isCore": True},
      {"formId": "fam_ireh_habit", "mongolian": "ирдэг", "japanese": "普段来る", "role": "習慣形", "ruleDesc": "語幹 ир- ＋ -дэг", "exampleMn": "Оюутан өглөө бүр эрт ирдэг.", "exampleJa": "学生は毎朝早く来ます。", "category": "present_habit", "isCore": True},
      {"formId": "fam_ireh_prog", "mongolian": "ирж байна", "japanese": "来ている、やって来ている", "role": "現在進行時制", "ruleDesc": "語幹 ир- ＋ -ж ＋ байна", "exampleMn": "Автобус одоо ирж байна.", "exampleJa": "バスが今来ています。", "category": "progressive", "isCore": True},
      {"formId": "fam_ireh_future", "mongolian": "ирнэ", "japanese": "来ます", "role": "未来時制", "ruleDesc": "語幹 ир- ＋ -нэ", "exampleMn": "Найз маань маргааш ирнэ.", "exampleJa": "友達は明日来ます。", "category": "future_intent", "isCore": True},
      {"formId": "fam_ireh_volitive", "mongolian": "ирье", "japanese": "来ましょう", "role": "希求形", "ruleDesc": "語幹 ир- ＋ -е", "exampleMn": "Би маргааш 9 цагт ирье.", "exampleJa": "私は明日9時に来ましょう。", "category": "future_intent", "isCore": True},
      {"formId": "fam_ireh_polite_imp", "mongolian": "ирээрэй", "japanese": "来てください", "role": "丁寧な命令形", "ruleDesc": "語幹 ир- ＋ -ээрэй", "exampleMn": "Манай гэрт заавал ирээрэй.", "exampleJa": "私の家にぜひ来てください。", "category": "imperative", "isCore": True},
      {"formId": "fam_ireh_desiderative", "mongolian": "ирмээр байна", "japanese": "来たい", "role": "願望形", "ruleDesc": "語幹 ир- ＋ -мээр байна", "exampleMn": "Дахиад энд ирмээр байна.", "exampleJa": "またここに来たいです。", "category": "future_intent", "isCore": True},
      {"formId": "fam_ireh_conditional", "mongolian": "ирвэл", "japanese": "来れば、来たら", "role": "仮定形", "ruleDesc": "語幹 ир- ＋ -вэл", "exampleMn": "Бат ирвэл надад хэлээрэй.", "exampleJa": "バトさんが来たら私に言ってください。", "category": "converb", "isCore": True},
      {"formId": "fam_ireh_successive", "mongolian": "ирээд", "japanese": "来て", "role": "並列形", "ruleDesc": "語幹 ир- ＋ -ээд", "exampleMn": "Энд ирээд 2 жил болсон.", "exampleJa": "ここに来て2年経ちました。", "category": "converb", "isCore": True},
      {"formId": "fam_ireh_future_participle", "mongolian": "ирэх", "japanese": "来る、次の、来〜", "role": "形動詞（連体修飾）", "ruleDesc": "ирэх долоо хоног（来週）などの連体修飾", "exampleMn": "Ирэх долоо хоногт очно.", "exampleJa": "来週行きます。", "category": "nominal", "isCore": True},
      {"formId": "fam_ireh_noun_future", "mongolian": "ирээдүй", "japanese": "未来、将来", "role": "派生名詞", "ruleDesc": "語幹 ир- ＋ 派生名詞接尾辞 -ээдүй", "exampleMn": "Бидний ирээдүй гэрэлтэй.", "exampleJa": "私たちの未来は明るいです。", "category": "nominal", "isCore": True}
    ]
  },
  {
    "familyId": "fam_ajillah",
    "lemma": "ажиллах",
    "pos": "動詞",
    "meaning": "働く、勤務する",
    "stem": "ажилла-",
    "vowelHarmonic": "masculine",
    "textbookAppearance": "第3課・第7課・第12課・練習問題集",
    "forms": [
      {"formId": "fam_ajillah_dict", "mongolian": "ажиллах", "japanese": "働く、勤務する", "role": "辞書形", "ruleDesc": "語幹 ажилла- ＋ -х", "exampleMn": "Эмнэлэгт ажиллах хүсэлтэй.", "exampleJa": "病院で働きたい希望があります。", "category": "dictionary", "isCore": True},
      {"formId": "fam_ajillah_past_san", "mongolian": "ажилласан", "japanese": "働いた", "role": "過去時制", "ruleDesc": "語幹 ажилла- ＋ -сан", "exampleMn": "Би 3 жил ажилласан.", "exampleJa": "私は3年間働きました。", "category": "past", "isCore": True},
      {"formId": "fam_ajillah_habit", "mongolian": "ажилладаг", "japanese": "普段働く、勤務している", "role": "習慣形", "ruleDesc": "語幹 ажилла- ＋ -даг", "exampleMn": "Аав үйлдвэрт ажилладаг.", "exampleJa": "父は工場で働いています。", "category": "present_habit", "isCore": True},
      {"formId": "fam_ajillah_prog", "mongolian": "ажиллаж байна", "japanese": "働いている", "role": "現在進行時制", "ruleDesc": "語幹 ажилла- ＋ -ж ＋ байна", "exampleMn": "Одоо эмнэлэгт ажиллаж байна.", "exampleJa": "今病院で働いています。", "category": "progressive", "isCore": True},
      {"formId": "fam_ajillah_future", "mongolian": "ажиллана", "japanese": "働きます", "role": "未来時制", "ruleDesc": "語幹 ажилла- ＋ -на", "exampleMn": "Би Монголд 2 жил ажиллана.", "exampleJa": "私はモンゴルで2年間働きます。", "category": "future_intent", "isCore": True},
      {"formId": "fam_ajillah_volitive", "mongolian": "ажиллая", "japanese": "働きましょう", "role": "希求形", "ruleDesc": "語幹 ажилла- ＋ -я", "exampleMn": "Идэвхтэй ажиллая.", "exampleJa": "活発に働きましょう。", "category": "future_intent", "isCore": True},
      {"formId": "fam_ajillah_noun_job", "mongolian": "ажил", "japanese": "仕事、用事", "role": "基礎名詞（語根）", "ruleDesc": "名詞 ажил から動詞 ажиллах が派生", "exampleMn": "Ажил хийсэн.", "exampleJa": "仕事をしました。", "category": "nominal", "isCore": True},
      {"formId": "fam_ajillah_noun_staff", "mongolian": "ажилтан", "japanese": "職員、社員", "role": "派生名詞", "ruleDesc": "ажил ＋ 接尾辞 -тан", "exampleMn": "Би энэ сургуулийн ажилтан.", "exampleJa": "私はこの学校の職員です。", "category": "nominal", "isCore": True},
      {"formId": "fam_ajillah_noun_worker", "mongolian": "ажилчин", "japanese": "労働者、作業員", "role": "派生名詞", "ruleDesc": "ажил ＋ 接尾辞 -чин", "exampleMn": "Үйлдвэрийн ажилчид сайн ажилладаг.", "exampleJa": "工場の作業員たちはよく働きます。", "category": "nominal", "isCore": True},
      {"formId": "fam_ajillah_adj_busy", "mongolian": "ажилтай", "japanese": "仕事がある、用事がある", "role": "派生形容詞", "ruleDesc": "ажил ＋ 所有接尾辞 -тай", "exampleMn": "Маргааш ч бас ажилтай.", "exampleJa": "明日も用事（仕事）があります。", "category": "adjectival", "isCore": True}
    ]
  },
  {
    "familyId": "fam_suragch_school",
    "lemma": "сургууль",
    "pos": "名詞",
    "meaning": "学校",
    "stem": "сургууль-",
    "vowelHarmonic": "masculine",
    "textbookAppearance": "第4課・第7課・第12課・練習問題集",
    "forms": [
      {"formId": "fam_school_nom", "mongolian": "сургууль", "japanese": "学校（主格）", "role": "主格（基本形）", "ruleDesc": "名詞の辞書形・基本形", "exampleMn": "Энэ манай сургууль.", "exampleJa": "これは私たちの学校です。", "category": "case_nom", "isCore": True},
      {"formId": "fam_school_gen", "mongolian": "сургуулийн", "japanese": "学校の（属格）", "role": "属格（〜の）", "ruleDesc": "сургууль ＋ 属格語尾 -ийн", "exampleMn": "Энэ сургуулийн байшин.", "exampleJa": "これは学校の建物です。", "category": "case_gen", "isCore": True},
      {"formId": "fam_school_dat", "mongolian": "сургуульд", "japanese": "学校に、学校で（与位格）", "role": "与位格（〜に、〜で）", "ruleDesc": "сургууль ＋ 与位格語尾 -д", "exampleMn": "Охин дүү сургуульд сурдаг.", "exampleJa": "妹は学校に通っています。", "category": "case_dat", "isCore": True},
      {"formId": "fam_school_acc", "mongolian": "сургуулийг", "japanese": "学校を（対格）", "role": "対格（〜を）", "ruleDesc": "сургууль ＋ 対格語尾 -ийг", "exampleMn": "Тэр сургуулийг төгссөн.", "exampleJa": "彼は学校を卒業しました。", "category": "case_acc", "isCore": True},
      {"formId": "fam_school_abl", "mongolian": "сургуулиас", "japanese": "学校から（奪格）", "role": "奪格（〜から）", "ruleDesc": "сургууль ＋ 奪格語尾 -иас", "exampleMn": "Дүү сургуулиас ирсэн.", "exampleJa": "弟は学校から帰って来ました。", "category": "case_abl", "isCore": True},
      {"formId": "fam_school_ins", "mongolian": "сургуулиар", "japanese": "学校で、学校を通して（造格）", "role": "造格（〜で、〜によって）", "ruleDesc": "сургууль ＋ 造格語尾 -иар", "exampleMn": "Сургуулиар орсон.", "exampleJa": "学校に立ち寄りました。", "category": "case_ins", "isCore": True},
      {"formId": "fam_school_com", "mongolian": "сургуультай", "japanese": "学校がある、学校と（共同格）", "role": "共同格（〜と、所持）", "ruleDesc": "сургууль ＋ 共同格語尾 -тай", "exampleMn": "Энэ сум том сургуультай.", "exampleJa": "この村には大きな学校があります。", "category": "case_com", "isCore": True},
      {"formId": "fam_school_dir", "mongolian": "сургууль руу", "japanese": "学校へ、学校に向かって（方向格）", "role": "方向格（〜へ）", "ruleDesc": "сургууль ＋ 方向格助詞 руу", "exampleMn": "Тэр сургууль руу явсан.", "exampleJa": "彼は学校へ向かいました。", "category": "case_dir", "isCore": True},
      {"formId": "fam_school_refl", "mongolian": "сургуулиа", "japanese": "自分の学校を（再帰所有格）", "role": "再帰所有格（自分の〜）", "ruleDesc": "сургууль ＋ 再帰所有語尾 -иа", "exampleMn": "Би сургуулиа сайн төгсөнө.", "exampleJa": "私は（自分の）学校を立派に卒業します。", "category": "case_refl", "isCore": True},
      {"formId": "fam_school_plural", "mongolian": "сургуулиуд", "japanese": "複数の学校（複数形）", "role": "複数形", "ruleDesc": "сургууль ＋ 複数語尾 -иуд", "exampleMn": "Хотод олон сургуулиуд байна.", "exampleJa": "市内には多くの学校があります。", "category": "plural", "isCore": True},
      {"formId": "fam_school_elem", "mongolian": "бага сургууль", "japanese": "小学校", "role": "複合名詞", "ruleDesc": "бага（小さい・初等の）＋ сургууль", "exampleMn": "Бага сургуулийн 4-р анги.", "exampleJa": "小学校の4年生。", "category": "nominal", "isCore": True},
      {"formId": "fam_school_mid", "mongolian": "дунд сургууль", "japanese": "中学校・中等学校", "role": "複合名詞", "ruleDesc": "дунд（中等の）＋ сургууль", "exampleMn": "Дунд сургуульд япон хэл заадаг.", "exampleJa": "中学校で日本語を教えています。", "category": "nominal", "isCore": True},
      {"formId": "fam_school_univ", "mongolian": "их сургууль", "japanese": "大学", "role": "複合名詞", "ruleDesc": "их（大きい・高等）＋ сургууль", "exampleMn": "Их сургууль төгссөн.", "exampleJa": "大学を卒業しました。", "category": "nominal", "isCore": True}
    ]
  },
  {
    "familyId": "fam_ger",
    "lemma": "гэр",
    "pos": "名詞",
    "meaning": "家、ゲル",
    "stem": "гэр-",
    "vowelHarmonic": "feminine",
    "textbookAppearance": "第3課・第5課・第7課・練習問題集",
    "forms": [
      {"formId": "fam_ger_nom", "mongolian": "гэр", "japanese": "家、ゲル（主格）", "role": "主格", "ruleDesc": "基本形", "exampleMn": "Энэ манай гэр.", "exampleJa": "これは私の家（ゲル）です。", "category": "case_nom", "isCore": True},
      {"formId": "fam_ger_gen", "mongolian": "гэрийн", "japanese": "家の（属格）", "role": "属格", "ruleDesc": "гэр ＋ -ийн", "exampleMn": "Гэрийн ойрхон дэлгүүр байна.", "exampleJa": "家の近くに店があります。", "category": "case_gen", "isCore": True},
      {"formId": "fam_ger_dat", "mongolian": "гэрт", "japanese": "家に、家で（与位格）", "role": "与位格", "ruleDesc": "гэр ＋ -т（рの後で-т）", "exampleMn": "Аав гэрт амардаг.", "exampleJa": "父は家で休みます。", "category": "case_dat", "isCore": True},
      {"formId": "fam_ger_acc", "mongolian": "гэрийг", "japanese": "家を（対格）", "role": "対格", "ruleDesc": "гэр ＋ -ийг", "exampleMn": "Тэр гэрийг цэвэрлэсэн.", "exampleJa": "彼は家を掃除しました。", "category": "case_acc", "isCore": True},
      {"formId": "fam_ger_abl", "mongolian": "гэрээс", "japanese": "家から（奪格）", "role": "奪格", "ruleDesc": "гэр ＋ -ээс", "exampleMn": "Тэр хүн гэрээс гарсан.", "exampleJa": "あの人は家を出ました。", "category": "case_abl", "isCore": True},
      {"formId": "fam_ger_ins", "mongolian": "гэрээр", "japanese": "家で、ゲルで（造格）", "role": "造格", "ruleDesc": "гэр ＋ -ээр", "exampleMn": "Айлын гэрээр орсон.", "exampleJa": "よその家（ゲル）に立ち寄りました。", "category": "case_ins", "isCore": True},
      {"formId": "fam_ger_com", "mongolian": "гэртэй", "japanese": "家がある、ゲルを持つ（共同格）", "role": "共同格", "ruleDesc": "гэр ＋ -тэй", "exampleMn": "Тэд сайхан гэртэй.", "exampleJa": "彼らは素敵な家を持っています。", "category": "case_com", "isCore": True},
      {"formId": "fam_ger_dir", "mongolian": "гэр лүү", "japanese": "家へ（方向格）", "role": "方向格", "ruleDesc": "гэр ＋ 方向格助詞 лүү（рの後で-луу/лүү）", "exampleMn": "Гэр лүүгээ харилаа.", "exampleJa": "家へ帰りました。", "category": "case_dir", "isCore": True},
      {"formId": "fam_ger_refl_acc", "mongolian": "гэрээ", "japanese": "自分の家を（再帰所有格）", "role": "再帰所有格", "ruleDesc": "гэр ＋ 再帰所有語尾 -ээ", "exampleMn": "Хааяа гэрээ санадаг.", "exampleJa": "時々（自分の）家が恋しくなります（ホームシックになります）。", "category": "case_refl", "isCore": True},
      {"formId": "fam_ger_refl_dat", "mongolian": "гэртээ", "japanese": "自分の家に（与位格再帰所有）", "role": "与位格再帰所有格", "ruleDesc": "гэр ＋ -т ＋ -ээ", "exampleMn": "Би гэртээ харилаа.", "exampleJa": "私は（自分の）家に帰りました。", "category": "case_refl", "isCore": True},
      {"formId": "fam_ger_family", "mongolian": "гэр бүл", "japanese": "家族", "role": "複合名詞", "ruleDesc": "гэр（家）＋ бүл（構成員）", "exampleMn": "Манай гэр бүл тавуулаа.", "exampleJa": "私の家族は5人です。", "category": "nominal", "isCore": True},
      {"formId": "fam_ger_marry", "mongolian": "гэрлэх", "japanese": "結婚する", "role": "派生動詞", "ruleDesc": "гэр ＋ 接尾辞 -лэ ＋ -х（家を構える）", "exampleMn": "Миний ах гэрлэсэн.", "exampleJa": "私の兄は結婚しました。", "category": "nominal", "isCore": True},
      {"formId": "fam_ger_housework", "mongolian": "гэрийн ажил", "japanese": "家事", "role": "名詞句", "ruleDesc": "гэрийн（家の）＋ ажил（仕事）", "exampleMn": "Ээж гэрийн ажилтай.", "exampleJa": "母は家事をしています。", "category": "nominal", "isCore": True}
    ]
  }
]

print(f"Total word families defined: {len(families)}")
total_forms = sum(len(f['forms']) for f in families)
print(f"Total inflected/derived word forms: {total_forms}")

out_path = "js/data/wordFamiliesData.js"
with open(out_path, "w", encoding="utf-8") as f:
    f.write("// 教科書・学習ノート掲載単語の完全習得 単語ファミリーマスターデータ\n")
    f.write("// 各単語の辞書形・語幹・時制・態（使役/受動/相互）・格変化・派生形・例文を網羅\n")
    f.write("export const WORD_FAMILIES_DATA = ")
    json.dump(families, f, ensure_ascii=False, indent=2)
    f.write(";\n")

# Also copy to dist/
dist_path = "dist/js/data/wordFamiliesData.js"
with open(dist_path, "w", encoding="utf-8") as f:
    f.write("// 教科書・学習ノート掲載単語の完全習得 単語ファミリーマスターデータ\n")
    f.write("// 各単語の辞書形・語幹・時制・態（使役/受動/相互）・格変化・派生形・例文を網羅\n")
    f.write("export const WORD_FAMILIES_DATA = ")
    json.dump(families, f, ensure_ascii=False, indent=2)
    f.write(";\n")

print("Created wordFamiliesData.js in both js/ and dist/.")
