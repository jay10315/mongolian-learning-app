// モンゴル語 助詞・語尾使い分けルールマスターデータ
// 与位格（-д/-т: г,р,сの法則）、疑問詞文末（бэ/вэ: н,м,в,лの法則）、Yes/No疑問（уу/үү）、対格、属格、否定詞完全対応

export const suffixRuleCategories = [
  {
    "id": "dative_dt",
    "title": "与位格（-д / -т）の法則",
    "shortRule": "語尾が【г, р, с】なら「-т」！ それ以外は「-д」！",
    "badge": "最重要 ⭐",
    "description": "モンゴル語の与位格（〜に、〜で）は、単語の最後の文字によって「-д」と「-т」を使い分けます。г, р, с （および硬子音）で終わる名詞には「-т」が付き、母音や他の子音には「-д」が付きます。"
  },
  {
    "id": "interrogative_be_ve",
    "title": "疑問詞文末（бэ / вэ）の法則",
    "shortRule": "直前の語尾が【н, м, в, л】なら「бэ」！ それ以外は「вэ」！",
    "badge": "必須 ⭐",
    "description": "疑問詞（хэн, юу, хаана, хэзээ, ямар, хэдなど）を含む疑問文の文末には「бэ」または「вэ」が来ます。直前の語尾が【н, м, в, л】のときは「бэ」、母音やその他の子音のときは「вэ」になります。"
  },
  {
    "id": "yes_no_uu",
    "title": "Yes/No疑問（уу / үү / юу / юү）の法則",
    "shortRule": "男性母音語幹は「уу」、女性母音語幹は「үү」！",
    "badge": "基礎 ⭐",
    "description": "「〜ですか？」と尋ねるYes/No疑問助詞。語幹に男性母音（а, о, у, я）が含まれていれば「уу」、女性母音（э, ө, ү, е）なら「үү」。長母音・二重母音の後は「юу / юү」が使われます。"
  },
  {
    "id": "accusative_yg",
    "title": "対格（-ыг / -ийг / -г）の法則",
    "shortRule": "男性子音「-ыг」、女性子音「-ийг」、母音終わり「-г」！",
    "badge": "格変化 ⭐",
    "description": "動作の目的語「〜を」を表す対格。子音で終わる男性語は「-ыг」、女性語は「-ийг」、母音で終わる単語にはそのまま「-г」が結合します。"
  },
  {
    "id": "genitive_yn",
    "title": "属格（-ын / -ийн / -ний / -ны）の法則",
    "shortRule": "男性子音「-ын」、女性子音「-ийн」、長母音「-ний / -ны」！",
    "badge": "格変化 ⭐",
    "description": "所有や所属「〜の」を表す属格。男性語の子音は「-ын」、女性語の子音は「-ийн」、長母音や二重母音は「-ний / -ны」になります。"
  },
  {
    "id": "negation_bish",
    "title": "否定詞（биш vs үгүй）の法則",
    "shortRule": "名詞・身分否定は「биш」、有無・いいえは「үгүй」！",
    "badge": "会話必須 ⭐",
    "description": "「〜ではありません」と名詞や形容詞を否定するときは「биш」（例: оюутан биш）。「〜がない」「いいえ」と存在や動詞を否定するときは「үгүй / байхгүй」を使います。"
  }
];

export const suffixRuleQuizzes = [
  {
    "id": "sr_dt_1",
    "category": "dative_dt",
    "categoryTitle": "与位格（-д / -т）",
    "prompt": "与位格助詞（〜に／〜で）を正しく付けた形を選んでください",
    "targetWord": "аймаг",
    "targetWordMeaning": "県・アイマグ",
    "endLetter": "г",
    "options": [
      "аймагт",
      "аймагд"
    ],
    "answer": "аймагт",
    "ruleTip": "語尾が【г, р, с】で終わる単語は「-т」が結合します！",
    "explanation": "「аймаг（県）」の語尾は「г」で終わるため、硬子音の規則により「-т」が付き「аймагт（県に／県で）」となります。",
    "exampleSentenceMn": "Би Дархан аймагт амьдардаг.",
    "exampleSentenceJa": "私はダルハン県に住んでいます。"
  },
  {
    "id": "sr_dt_2",
    "category": "dative_dt",
    "categoryTitle": "与位格（-д / -т）",
    "prompt": "与位格助詞（〜に／〜で）を正しく付けた形を選んでください",
    "targetWord": "гэр",
    "targetWordMeaning": "家・ゲル",
    "endLetter": "р",
    "options": [
      "гэрт",
      "гэрд"
    ],
    "answer": "гэрт",
    "ruleTip": "語尾が【г, р, с】で終わる単語は「-т」が結合します！",
    "explanation": "「гэр（家）」の語尾は「р」で終わるため、「-т」が付き「гэрт（家に／家で）」となります。",
    "exampleSentenceMn": "Аав одоо гэртээ байна.",
    "exampleSentenceJa": "お父さんは今家にいます。"
  },
  {
    "id": "sr_dt_3",
    "category": "dative_dt",
    "categoryTitle": "与位格（-д / -т）",
    "prompt": "与位格助詞（〜に／〜で）を正しく付けた形を選んでください",
    "targetWord": "газар",
    "targetWordMeaning": "土地・場所・地面",
    "endLetter": "р",
    "options": [
      "газарт",
      "газард"
    ],
    "answer": "газарт",
    "ruleTip": "語尾が【г, р, с】で終わる単語は「-т」が結合します！",
    "explanation": "「газар（土地）」の語尾は「р」で終わるため、「-т」が付き「газарт（地面に／場所に）」となります。",
    "exampleSentenceMn": "Ном газарт унав.",
    "exampleSentenceJa": "本が地面に落ちました。"
  },
  {
    "id": "sr_dt_4",
    "category": "dative_dt",
    "categoryTitle": "与位格（-д / -т）",
    "prompt": "与位格助詞（〜に／〜で）を正しく付けた形を選んでください",
    "targetWord": "Улаанбаатар",
    "targetWordMeaning": "ウランバートル（首都）",
    "endLetter": "р",
    "options": [
      "Улаанбаатарт",
      "Улаанбаатард"
    ],
    "answer": "Улаанбаатарт",
    "ruleTip": "語尾が【г, р, с】で終わる単語は「-т」が結合します！",
    "explanation": "都市名「Улаанбаатар」の末尾は「р」なので、「-т」が付き「Улаанбаатарт（ウランバートルで／に）」となります。",
    "exampleSentenceMn": "Би Улаанбаатарт сурдаг.",
    "exampleSentenceJa": "私はウランバートルで学んでいます。"
  },
  {
    "id": "sr_dt_5",
    "category": "dative_dt",
    "categoryTitle": "与位格（-д / -т）",
    "prompt": "与位格助詞（〜に／〜で）を正しく付けた形を選んでください",
    "targetWord": "цэцэрлэг",
    "targetWordMeaning": "幼稚園・庭園・公園",
    "endLetter": "г",
    "options": [
      "цэцэрлэгт",
      "цэцэрлэгд"
    ],
    "answer": "цэцэрлэгт",
    "ruleTip": "語尾が【г, р, с】で終わる単語は「-т」が結合します！",
    "explanation": "「цэцэрлэг」の末尾は「г」なので、「-т」が付き「цэцэрлэгт（幼稚園に／公園で）」となります。",
    "exampleSentenceMn": "Хүүхэд цэцэрлэгт явдаг.",
    "exampleSentenceJa": "子供は幼稚園に通っています。"
  },
  {
    "id": "sr_dt_6",
    "category": "dative_dt",
    "categoryTitle": "与位格（-д / -т）",
    "prompt": "与位格助詞（〜に／〜で）を正しく付けた形を選んでください",
    "targetWord": "дэвтэр",
    "targetWordMeaning": "ノート",
    "endLetter": "р",
    "options": [
      "дэвтэрт",
      "дэвтэрд"
    ],
    "answer": "дэвтэрт",
    "ruleTip": "語尾が【г, р, с】で終わる単語は「-т」が結合します！",
    "explanation": "「дэвтэр（ノート）」の語尾は「р」なので、「-т」が付き「дэвтэрт（ノートに）」となります。",
    "exampleSentenceMn": "Үгийг дэвтэрт бичээрэй.",
    "exampleSentenceJa": "単語をノートに書いてください。"
  },
  {
    "id": "sr_dt_7",
    "category": "dative_dt",
    "categoryTitle": "与位格（-д / -т）",
    "prompt": "与位格助詞（〜に／〜で）を正しく付けた形を選んでください",
    "targetWord": "театр",
    "targetWordMeaning": "劇場・シアター",
    "endLetter": "р",
    "options": [
      "театрт",
      "театрд"
    ],
    "answer": "театрт",
    "ruleTip": "外来語でも語尾が【г, р, с】なら「-т」が結合します！",
    "explanation": "「театр（劇場）」の末尾は「р」なので、「-т」が付き「театрт（劇場で）」となります。",
    "exampleSentenceMn": "Бид орой театрт очно.",
    "exampleSentenceJa": "私たちは今夜劇場に行きます。"
  },
  {
    "id": "sr_dt_8",
    "category": "dative_dt",
    "categoryTitle": "与位格（-д / -т）",
    "prompt": "与位格助詞（〜に／〜で）を正しく付けた形を選んでください",
    "targetWord": "ном",
    "targetWordMeaning": "本",
    "endLetter": "м",
    "options": [
      "номд",
      "номт"
    ],
    "answer": "номд",
    "ruleTip": "【г, р, с】以外の子音・母音は「-д」が結合します！",
    "explanation": "「ном（本）」の語尾は「м」なので、「-т」ではなく通常の与位格語尾「-д」が付き「номд（本に）」となります。",
    "exampleSentenceMn": "Энэ номд олон зураг бий.",
    "exampleSentenceJa": "この本にはたくさんの絵があります。"
  },
  {
    "id": "sr_dt_9",
    "category": "dative_dt",
    "categoryTitle": "与位格（-д / -т）",
    "prompt": "与位格助詞（〜に／〜で）を正しく付けた形を選んでください",
    "targetWord": "сум",
    "targetWordMeaning": "郡・ソム",
    "endLetter": "м",
    "options": [
      "сумд",
      "сумт"
    ],
    "answer": "сумд",
    "ruleTip": "【г, р, с】以外の子音・母音は「-д」が結合します！",
    "explanation": "「сум（郡）」の語尾は「м」なので、「-д」が付き「сумд（郡に／郡で）」となります。",
    "exampleSentenceMn": "Бид хөдөөний сумд очсон.",
    "exampleSentenceJa": "私たちは田舎の郡に行きました。"
  },
  {
    "id": "sr_dt_10",
    "category": "dative_dt",
    "categoryTitle": "与位格（-д / -т）",
    "prompt": "与位格助詞（〜に／〜で）を正しく付けた形を選んでください",
    "targetWord": "эмнэлэг",
    "targetWordMeaning": "病院",
    "endLetter": "г",
    "options": [
      "эмнэлэгт",
      "эмнэлэгд"
    ],
    "answer": "эмнэлэгт",
    "ruleTip": "語尾が【г, р, с】で終わる単語は「-т」が結合します！",
    "explanation": "「эмнэлэг（病院）」の末尾は「г」なので、「-т」が付き「эмнэлэгт（病院に／病院で）」となります。",
    "exampleSentenceMn": "Эмээ эмнэлэгт хэвтэж байна.",
    "exampleSentenceJa": "おばあちゃんは病院に入院しています。"
  },
  {
    "id": "sr_dt_11",
    "category": "dative_dt",
    "categoryTitle": "与位格（-д / -т）",
    "prompt": "与位格助詞（〜に／〜で）を正しく付けた形を選んでください",
    "targetWord": "өвөл",
    "targetWordMeaning": "冬",
    "endLetter": "л",
    "options": [
      "өвөлд",
      "өвөлт"
    ],
    "answer": "өвөлд",
    "ruleTip": "語尾「л」は【г, р, с】ではないので「-д」が結合します！",
    "explanation": "「өвөл（冬）」の語尾は「л」なので、「-д」が付き「өвөлд（冬に）」となります。",
    "exampleSentenceMn": "Монголд өвөлдөө их хүйтэн.",
    "exampleSentenceJa": "モンゴルでは冬はとても寒いです。"
  },
  {
    "id": "sr_dt_12",
    "category": "dative_dt",
    "categoryTitle": "与位格（-д / -т）",
    "prompt": "与位格助詞（〜に／〜で）を正しく付けた形を選んでください",
    "targetWord": "автобус",
    "targetWordMeaning": "バス",
    "endLetter": "с",
    "options": [
      "автобуст",
      "автобусд"
    ],
    "answer": "автобуст",
    "ruleTip": "語尾が【г, р, с】で終わる単語は「-т」が結合します！",
    "explanation": "「автобус（バス）」の末尾は「с」なので、「-т」が付き「автобуст（バスに／バスの中で）」となります。",
    "exampleSentenceMn": "Би автобуст суув.",
    "exampleSentenceJa": "私はバスに乗りました。"
  },
  {
    "id": "sr_dt_13",
    "category": "dative_dt",
    "categoryTitle": "与位格（-д / -т）",
    "prompt": "与位格助詞（〜に／〜で）を正しく付けた形を選んでください",
    "targetWord": "дэлгүүр",
    "targetWordMeaning": "店・売店",
    "endLetter": "р",
    "options": [
      "дэлгүүрт",
      "дэлгүүрд"
    ],
    "answer": "дэлгүүрт",
    "ruleTip": "語尾が【г, р, с】で終わる単語は「-т」が結合します！",
    "explanation": "「дэлгүүр（店）」の語尾は「р」なので、「-т」が付き「дэлгүүрт（店に／店で）」となります。",
    "exampleSentenceMn": "Дэлгүүрт олон хүн байна.",
    "exampleSentenceJa": "店にはたくさんの人がいます。"
  },
  {
    "id": "sr_dt_14",
    "category": "dative_dt",
    "categoryTitle": "与位格（-д / -т）",
    "prompt": "与位格助詞（〜に／〜で）を正しく付けた形を選んでください",
    "targetWord": "өрөө",
    "targetWordMeaning": "部屋（長母音終わり）",
    "endLetter": "ө",
    "options": [
      "өрөөнд",
      "өрөөт"
    ],
    "answer": "өрөөнд",
    "ruleTip": "長母音終わりの名詞は接続の「н」を挟んで「-нд」になります！",
    "explanation": "「өрөө（部屋）」のような長母音終わりの単語は、結合子音「н」を介して「-нд」が付き「өрөөнд（部屋に／部屋で）」となります。",
    "exampleSentenceMn": "Манай өрөөнд дулаахан байна.",
    "exampleSentenceJa": "私たちの部屋は暖かいです。"
  },
  {
    "id": "sr_beve_1",
    "category": "interrogative_be_ve",
    "categoryTitle": "疑問詞疑問文（бэ / вэ）",
    "prompt": "空欄に入る正しい疑問助詞（бэ / вэ）を選んでください",
    "targetWord": "хэн",
    "targetWordMeaning": "誰",
    "endLetter": "н",
    "sentencePattern": "Энэ хэн ___?",
    "options": [
      "бэ",
      "вэ"
    ],
    "answer": "бэ",
    "ruleTip": "直前の単語が【н, м, в, л】で終わるなら「бэ」！",
    "explanation": "直前の単語「хэн（誰）」の語尾が『н』で終わるため、『бэ』が接続します。「Энэ хэн бэ?（これは誰ですか？）」となります。",
    "exampleSentenceMn": "Энэ хэн бэ?",
    "exampleSentenceJa": "これは誰ですか？"
  },
  {
    "id": "sr_beve_2",
    "category": "interrogative_be_ve",
    "categoryTitle": "疑問詞疑問文（бэ / вэ）",
    "prompt": "空欄に入る正しい疑問助詞（бэ / вэ）を選んでください",
    "targetWord": "юу",
    "targetWordMeaning": "何（母音終わり）",
    "endLetter": "у",
    "sentencePattern": "Энэ юу ___?",
    "options": [
      "вэ",
      "бэ"
    ],
    "answer": "вэ",
    "ruleTip": "直前が母音や【н, м, в, л】以外なら「вэ」！",
    "explanation": "「юу（何）」は母音『у』で終わるため、【н, м, в, л】ではないので『вэ』が接続します。「Энэ юу вэ?（これは何ですか？）」となります。",
    "exampleSentenceMn": "Энэ юу вэ?",
    "exampleSentenceJa": "これは何ですか？"
  },
  {
    "id": "sr_beve_3",
    "category": "interrogative_be_ve",
    "categoryTitle": "疑問詞疑問文（бэ / вэ）",
    "prompt": "空欄に入る正しい疑問助詞（бэ / вэ）を選んでください",
    "targetWord": "ном",
    "targetWordMeaning": "本（м終わり）",
    "endLetter": "м",
    "sentencePattern": "Энэ ямар ном ___?",
    "options": [
      "бэ",
      "вэ"
    ],
    "answer": "бэ",
    "ruleTip": "直前の単語が【н, м, в, л】で終わるなら「бэ」！",
    "explanation": "直前の単語「ном（本）」が『м』で終わるため、『бэ』が接続します。「Энэ ямар ном бэ?（これはどんな本ですか？）」となります。",
    "exampleSentenceMn": "Энэ ямар ном бэ?",
    "exampleSentenceJa": "これはどんな本ですか？"
  },
  {
    "id": "sr_beve_4",
    "category": "interrogative_be_ve",
    "categoryTitle": "疑問詞疑問文（бэ / вэ）",
    "prompt": "空欄に入る正しい疑問助詞（бэ / вэ）を選んでください",
    "targetWord": "хаана",
    "targetWordMeaning": "どこ（母音終わり）",
    "endLetter": "а",
    "sentencePattern": "Таны гэр хаана ___?",
    "options": [
      "вэ",
      "бэ"
    ],
    "answer": "вэ",
    "ruleTip": "直前が母音なら「вэ」！",
    "explanation": "「хаана（どこ）」の末尾は母音『а』なので、『вэ』が接続します。「Таны гэр хаана вэ?（あなたの家はどこですか？）」となります。",
    "exampleSentenceMn": "Таны гэр хаана вэ?",
    "exampleSentenceJa": "あなたの家はどこですか？"
  },
  {
    "id": "sr_beve_5",
    "category": "interrogative_be_ve",
    "categoryTitle": "疑問詞疑問文（бэ / вэ）",
    "prompt": "空欄に入る正しい疑問助詞（бэ / вэ）を選んでください",
    "targetWord": "хэзээ",
    "targetWordMeaning": "いつ（長母音終わり）",
    "endLetter": "э",
    "sentencePattern": "Та хэзээ ирэх ___?",
    "options": [
      "вэ",
      "бэ"
    ],
    "answer": "вэ",
    "ruleTip": "直前が母音なら「вэ」！",
    "explanation": "「хэзээ（いつ）」や動詞終止形などの直前が母音や【н, м, в, л】以外なら『вэ』になります。",
    "exampleSentenceMn": "Хичээл хэзээ дуусах вэ?",
    "exampleSentenceJa": "授業はいつ終わりますか？"
  },
  {
    "id": "sr_beve_6",
    "category": "interrogative_be_ve",
    "categoryTitle": "疑問詞疑問文（бэ / вэ）",
    "prompt": "空欄に入る正しい疑問助詞（бэ / вэ）を選んでください",
    "targetWord": "хүн",
    "targetWordMeaning": "人（н終わり）",
    "endLetter": "н",
    "sentencePattern": "Тэр ямар хүн ___?",
    "options": [
      "бэ",
      "вэ"
    ],
    "answer": "бэ",
    "ruleTip": "直前の単語が【н, м, в, л】で終わるなら「бэ」！",
    "explanation": "「хүн（人）」は語尾が『н』なので、『бэ』が接続します。「Тэр ямар хүн бэ?（あの人はどんな人ですか？）」となります。",
    "exampleSentenceMn": "Тэр ямар хүн бэ?",
    "exampleSentenceJa": "あの人はどんな人ですか？"
  },
  {
    "id": "sr_beve_7",
    "category": "interrogative_be_ve",
    "categoryTitle": "疑問詞疑問文（бэ / вэ）",
    "prompt": "空欄に入る正しい疑問助詞（бэ / вэ）を選んでください",
    "targetWord": "хэд",
    "targetWordMeaning": "いくら・何個（д終わり）",
    "endLetter": "д",
    "sentencePattern": "Энэ хэд ___?",
    "options": [
      "вэ",
      "бэ"
    ],
    "answer": "вэ",
    "ruleTip": "語尾「д」は【н, м, в, л】ではないので「вэ」！",
    "explanation": "「хэд（いくつ／いくら）」は語尾が『д』であり、【н, м, в, л】ではないため『вэ』が付きます。「Энэ хэд вэ?（これはいくらですか？）」となります。",
    "exampleSentenceMn": "Энэ хэд вэ?",
    "exampleSentenceJa": "これはいくらですか？"
  },
  {
    "id": "sr_beve_8",
    "category": "interrogative_be_ve",
    "categoryTitle": "疑問詞疑問文（бэ / вэ）",
    "prompt": "空欄に入る正しい疑問助詞（бэ / вэ）を選んでください",
    "targetWord": "гал",
    "targetWordMeaning": "火（л終わり）",
    "endLetter": "л",
    "sentencePattern": "Гал тогоонд ямар гал ___?",
    "options": [
      "бэ",
      "вэ"
    ],
    "answer": "бэ",
    "ruleTip": "直前の単語が【н, м, в, л】で終わるなら「бэ」！",
    "explanation": "「гал（火）」は語尾が『л』で終わるため、『бэ』が付きます。",
    "exampleSentenceMn": "Энэ юун гал бэ?",
    "exampleSentenceJa": "これは何の火ですか？"
  },
  {
    "id": "sr_beve_9",
    "category": "interrogative_be_ve",
    "categoryTitle": "疑問詞疑問文（бэ / вэ）",
    "prompt": "空欄に入る正しい疑問助詞（бэ / вэ）を選んでください",
    "targetWord": "сав",
    "targetWordMeaning": "器・容器（в終わり）",
    "endLetter": "в",
    "sentencePattern": "Цүнхэнд юун сав ___?",
    "options": [
      "бэ",
      "вэ"
    ],
    "answer": "бэ",
    "ruleTip": "直前の単語が【н, м, в, л】で終わるなら「бэ」！",
    "explanation": "「сав（容器）」は末尾が『в』なので、【н, м, в, л】の法則により『бэ』が接続します。",
    "exampleSentenceMn": "Энэ юун сав бэ?",
    "exampleSentenceJa": "これは何の入れ物ですか？"
  },
  {
    "id": "sr_beve_10",
    "category": "interrogative_be_ve",
    "categoryTitle": "疑問詞疑問文（бэ / вэ）",
    "prompt": "空欄に入る正しい疑問助詞（бэ / вэ）を選んでください",
    "targetWord": "он",
    "targetWordMeaning": "年（н終わり）",
    "endLetter": "н",
    "sentencePattern": "Одоо хэдэн он ___?",
    "options": [
      "бэ",
      "вэ"
    ],
    "answer": "бэ",
    "ruleTip": "直前の単語が【н, м, в, л】で終わるなら「бэ」！",
    "explanation": "「он（年）」は語尾が『н』なので、『бэ』が付き「Хэдэн он бэ?（何年ですか？）」となります。",
    "exampleSentenceMn": "Одоо хэдэн он бэ?",
    "exampleSentenceJa": "今は西暦何年ですか？"
  },
  {
    "id": "sr_beve_11",
    "category": "interrogative_be_ve",
    "categoryTitle": "疑問詞疑問文（бэ / вэ）",
    "prompt": "空欄に入る正しい疑問助詞（бэ / вэ）を選んでください",
    "targetWord": "утас",
    "targetWordMeaning": "電話（с終わり）",
    "endLetter": "с",
    "sentencePattern": "Энэ хэний утас ___?",
    "options": [
      "вэ",
      "бэ"
    ],
    "answer": "вэ",
    "ruleTip": "語尾「с」は【н, м, в, л】ではないので「вэ」！",
    "explanation": "「утас（電話）」の語尾は『с』なので、【н, м, в, л】ではないため『вэ』が付きます。「Энэ хэний утас вэ?（これは誰の電話ですか？）」となります。",
    "exampleSentenceMn": "Энэ хэний утас вэ?",
    "exampleSentenceJa": "これは誰の電話ですか？"
  },
  {
    "id": "sr_beve_12",
    "category": "interrogative_be_ve",
    "categoryTitle": "疑問詞疑問文（бэ / вэ）",
    "prompt": "空欄に入る正しい疑問助詞（бэ / вэ）を選んでください",
    "targetWord": "ажил",
    "targetWordMeaning": "仕事（л終わり）",
    "endLetter": "л",
    "sentencePattern": "Таны хийдэг юун ажил ___?",
    "options": [
      "бэ",
      "вэ"
    ],
    "answer": "бэ",
    "ruleTip": "直前の単語が【н, м, в, л】で終わるなら「бэ」！",
    "explanation": "「ажил（仕事）」は語尾が『л』で終わるため、『бэ』が付きます。",
    "exampleSentenceMn": "Энэ ямар ажил бэ?",
    "exampleSentenceJa": "これはどんな仕事ですか？"
  },
  {
    "id": "sr_beve_13",
    "category": "interrogative_be_ve",
    "categoryTitle": "疑問詞疑問文（бэ / вэ）",
    "prompt": "空欄に入る正しい疑問助詞（бэ / вэ）を選んでください",
    "targetWord": "өнгө",
    "targetWordMeaning": "色（母音終わり）",
    "endLetter": "ө",
    "sentencePattern": "Энэ ямар өнгө ___?",
    "options": [
      "вэ",
      "бэ"
    ],
    "answer": "вэ",
    "ruleTip": "直前が母音なら「вэ」！",
    "explanation": "「өнгө（色）」は母音『ө』で終わるため、『вэ』が接続します。「Энэ ямар өнгө вэ?（これは何色ですか？）」となります。",
    "exampleSentenceMn": "Энэ ямар өнгө вэ?",
    "exampleSentenceJa": "これは何色ですか？"
  },
  {
    "id": "sr_beve_14",
    "category": "interrogative_be_ve",
    "categoryTitle": "疑問詞疑問文（бэ / вэ）",
    "prompt": "空欄に入る正しい疑問助詞（бэ / вэ）を選んでください",
    "targetWord": "настай",
    "targetWordMeaning": "歳（й終わり）",
    "endLetter": "й",
    "sentencePattern": "Та хэдэн настай ___?",
    "options": [
      "вэ",
      "бэ"
    ],
    "answer": "вэ",
    "ruleTip": "語尾「й」は【н, м, в, л】ではないので「вэ」！",
    "explanation": "「настай（〜歳）」の語尾は半母音『й』であり、【н, м, в, л】ではないため『вэ』が付きます。「Та хэдэн настай вэ?（あなたは何歳ですか？）」となります。",
    "exampleSentenceMn": "Та хэдэн настай вэ?",
    "exampleSentenceJa": "あなたは何歳ですか？"
  },
  {
    "id": "sr_beve_15",
    "category": "interrogative_be_ve",
    "categoryTitle": "疑問詞疑問文（бэ / вэ）",
    "prompt": "空欄に入る正しい疑問助詞（бэ / вэ）を選んでください",
    "targetWord": "багш",
    "targetWordMeaning": "先生（ш終わり）",
    "endLetter": "ш",
    "sentencePattern": "Хэн багш ___?",
    "options": [
      "вэ",
      "бэ"
    ],
    "answer": "вэ",
    "ruleTip": "語尾「ш」は【н, м, в, л】ではないので「вэ」！",
    "explanation": "「багш（先生）」は語尾が『ш』なので、『вэ』が付きます。",
    "exampleSentenceMn": "Энд хэн багш вэ?",
    "exampleSentenceJa": "ここでは誰が先生ですか？"
  },
  {
    "id": "sr_beve_16",
    "category": "interrogative_be_ve",
    "categoryTitle": "疑問詞疑問文（бэ / вэ）",
    "prompt": "空欄に入る正しい疑問助詞（бэ / вэ）を選んでください",
    "targetWord": "юм",
    "targetWordMeaning": "もの・こと（м終わり）",
    "endLetter": "м",
    "sentencePattern": "Энэ юун юм ___?",
    "options": [
      "бэ",
      "вэ"
    ],
    "answer": "бэ",
    "ruleTip": "直前の単語が【н, м, в, л】で終わるなら「бэ」！",
    "explanation": "「юм（もの）」は語尾が『м』なので、『бэ』が接続します。「Энэ юун юм бэ?（これは何のものですか？）」となります。",
    "exampleSentenceMn": "Энэ юун юм бэ?",
    "exampleSentenceJa": "これは何のものですか？"
  },
  {
    "id": "sr_yn_1",
    "category": "yes_no_uu",
    "categoryTitle": "Yes/No疑問（уу / үү）",
    "prompt": "文末に入る正しい疑問助詞（уу / үү）を選んでください",
    "targetWord": "багш",
    "targetWordMeaning": "先生（男性母音 а 語幹）",
    "endLetter": "ш",
    "sentencePattern": "Та багш ___?",
    "options": [
      "уу",
      "үү"
    ],
    "answer": "уу",
    "ruleTip": "男性母音（а, о, у, я）語幹には「уу」！",
    "explanation": "「багш」には男性母音『а』が含まれているため、母音調和により『уу』が接続します。「Та багш уу?（あなたは先生ですか？）」となります。",
    "exampleSentenceMn": "Та багш уу?",
    "exampleSentenceJa": "あなたは先生ですか？"
  },
  {
    "id": "sr_yn_2",
    "category": "yes_no_uu",
    "categoryTitle": "Yes/No疑問（уу / үү）",
    "prompt": "文末に入る正しい疑問助詞（уу / үү）を選んでください",
    "targetWord": "эмч",
    "targetWordMeaning": "医者（女性母音 э 語幹）",
    "endLetter": "ч",
    "sentencePattern": "Та эмч ___?",
    "options": [
      "үү",
      "уу"
    ],
    "answer": "үү",
    "ruleTip": "女性母音（э, ө, ү, е）語幹には「үү」！",
    "explanation": "「эмч（医者）」は女性母音『э』を持つため、母音調和により『үү』が接続します。「Та эмч үү?（あなたはお医者さんですか？）」となります。",
    "exampleSentenceMn": "Та эмч үү?",
    "exampleSentenceJa": "あなたはお医者さんですか？"
  },
  {
    "id": "sr_yn_3",
    "category": "yes_no_uu",
    "categoryTitle": "Yes/No疑問（уу / үү）",
    "prompt": "文末に入る正しい疑問助詞（уу / үү）を選んでください",
    "targetWord": "ном",
    "targetWordMeaning": "本（男性母音 о 語幹）",
    "endLetter": "м",
    "sentencePattern": "Энэ таны ном ___?",
    "options": [
      "уу",
      "үү"
    ],
    "answer": "уу",
    "ruleTip": "男性母音（а, о, у, я）語幹には「уу」！",
    "explanation": "「ном（本）」は男性母音『о』を持つため、『уу』が接続します。「Энэ таны ном уу?（これはあなたの本ですか？）」となります。",
    "exampleSentenceMn": "Энэ таны ном уу?",
    "exampleSentenceJa": "これはあなたの本ですか？"
  },
  {
    "id": "sr_yn_4",
    "category": "yes_no_uu",
    "categoryTitle": "Yes/No疑問（уу / үү）",
    "prompt": "文末に入る正しい疑問助詞（уу / үү）を選んでください",
    "targetWord": "гэр",
    "targetWordMeaning": "ゲル・家（女性母音 э 語幹）",
    "endLetter": "р",
    "sentencePattern": "Энэ танай гэр ___?",
    "options": [
      "үү",
      "уу"
    ],
    "answer": "үү",
    "ruleTip": "女性母音（э, ө, ү, е）語幹には「үү」！",
    "explanation": "「гэр（家）」は女性母音『э』を持つため、『үү』が接続します。「Энэ танай гэр үү?（これはあなたの家ですか？）」となります。",
    "exampleSentenceMn": "Энэ танай гэр үү?",
    "exampleSentenceJa": "これはあなたの家ですか？"
  },
  {
    "id": "sr_yn_5",
    "category": "yes_no_uu",
    "categoryTitle": "Yes/No疑問（уу / үү）",
    "prompt": "文末に入る正しい疑問助詞（уу / үү）を選んでください",
    "targetWord": "оюутан",
    "targetWordMeaning": "大学生（男性母音 о/у 語幹）",
    "endLetter": "н",
    "sentencePattern": "Тэр оюутан ___?",
    "options": [
      "уу",
      "үү"
    ],
    "answer": "уу",
    "ruleTip": "男性母音（а, о, у, я）語幹には「уу」！",
    "explanation": "「оюутан（学生）」は第1音節が男性母音『о』なので男性語幹となり、『уу』が接続します。",
    "exampleSentenceMn": "Тэр оюутан уу?",
    "exampleSentenceJa": "あの人は大学生ですか？"
  },
  {
    "id": "sr_yn_6",
    "category": "yes_no_uu",
    "categoryTitle": "Yes/No疑問（уу / үү）",
    "prompt": "文末に入る正しい疑問助詞（уу / үү）を選んでください",
    "targetWord": "хүүхэд",
    "targetWordMeaning": "子供（女性母音 ү 語幹）",
    "endLetter": "д",
    "sentencePattern": "Энэ танай хүүхэд ___?",
    "options": [
      "үү",
      "уу"
    ],
    "answer": "үү",
    "ruleTip": "女性母音（э, ө, ү, е）語幹には「үү」！",
    "explanation": "「хүүхэд（子供）」は女性母音『үү』を持つため、母音調和により『үү』が接続します。",
    "exampleSentenceMn": "Энэ танай хүүхэд үү?",
    "exampleSentenceJa": "これはあなたのお子さんですか？"
  },
  {
    "id": "sr_yn_7",
    "category": "yes_no_uu",
    "categoryTitle": "Yes/No疑問（уу / үү）",
    "prompt": "文末に入る正しい疑問助詞（уу / үү）を選んでください",
    "targetWord": "ширээ",
    "targetWordMeaning": "机（女性長母音終わり）",
    "endLetter": "э",
    "sentencePattern": "Энэ ширээ ___?",
    "options": [
      "юү",
      "юу",
      "үү",
      "уу"
    ],
    "answer": "юү",
    "ruleTip": "女性長母音・二重母音の後は「юү」！",
    "explanation": "「ширээ（机）」は女性長母音『ээ』で終わるため、滑らかに発音するために『юү』が接続します。「Энэ ширээ юү?」となります。",
    "exampleSentenceMn": "Энэ ширээ юү?",
    "exampleSentenceJa": "これは机ですか？"
  },
  {
    "id": "sr_yn_8",
    "category": "yes_no_uu",
    "categoryTitle": "Yes/No疑問（уу / үү）",
    "prompt": "文末に入る正しい疑問助詞（уу / үү）を選んでください",
    "targetWord": "нохой",
    "targetWordMeaning": "犬（男性二重母音 ой 終わり）",
    "endLetter": "й",
    "sentencePattern": "Энэ танай нохой ___?",
    "options": [
      "юу",
      "юү",
      "уу",
      "үү"
    ],
    "answer": "юу",
    "ruleTip": "男性二重母音・長母音の後は「юу」！",
    "explanation": "「нохой（犬）」は男性二重母音『ой』で終わるため、発音の結合で『юу』が接続します。「Энэ танай нохой юу?」となります。",
    "exampleSentenceMn": "Энэ танай нохой юу?",
    "exampleSentenceJa": "これはあなたの家の犬ですか？"
  },
  {
    "id": "sr_acc_1",
    "category": "accusative_yg",
    "categoryTitle": "対格（-ыг / -ийг / -г）",
    "prompt": "対格助詞（〜を）を正しく付けた形を選んでください",
    "targetWord": "ном",
    "targetWordMeaning": "本（男性子音終わり）",
    "endLetter": "м",
    "options": [
      "номыг",
      "номийг",
      "номг"
    ],
    "answer": "номыг",
    "ruleTip": "男性子音終わりには「-ыг」！",
    "explanation": "「ном」は男性母音『о』を持ち子音『м』で終わるため、対格語尾は『-ыг』となり「номыг（本を）」となります。",
    "exampleSentenceMn": "Би энэ номыг уншив.",
    "exampleSentenceJa": "私はこの本を読みました。"
  },
  {
    "id": "sr_acc_2",
    "category": "accusative_yg",
    "categoryTitle": "対格（-ыг / -ийг / -г）",
    "prompt": "対格助詞（〜を）を正しく付けた形を選んでください",
    "targetWord": "гэр",
    "targetWordMeaning": "家（女性子音終わり）",
    "endLetter": "р",
    "options": [
      "гэрийг",
      "гэрыг",
      "гэрг"
    ],
    "answer": "гэрийг",
    "ruleTip": "女性子音終わりには「-ийг」！",
    "explanation": "「гэр」は女性母音『э』を持ち子音『р』で終わるため、対格語尾は『-ийг』となり「гэрийг（家を）」となります。",
    "exampleSentenceMn": "Бид гэрийг цэвэрлэсэн.",
    "exampleSentenceJa": "私たちは家を掃除しました。"
  },
  {
    "id": "sr_acc_3",
    "category": "accusative_yg",
    "categoryTitle": "対格（-ыг / -ийг / -г）",
    "prompt": "対格助詞（〜を）を正しく付けた形を選んでください",
    "targetWord": "ширээ",
    "targetWordMeaning": "机（母音終わり）",
    "endLetter": "э",
    "options": [
      "ширээг",
      "ширээийг",
      "ширээыг"
    ],
    "answer": "ширээг",
    "ruleTip": "母音終わりには直接「-г」が結合！",
    "explanation": "「ширээ」のように母音で終わる単語の対格は、母音を重ねず直接「-г」が付いて「ширээг（机を）」となります。",
    "exampleSentenceMn": "Ширээг энд тавь.",
    "exampleSentenceJa": "机をここに置いてください。"
  },
  {
    "id": "sr_acc_4",
    "category": "accusative_yg",
    "categoryTitle": "対格（-ыг / -ийг / -г）",
    "prompt": "対格助詞（〜を）を正しく付けた形を選んでください",
    "targetWord": "аав",
    "targetWordMeaning": "父（男性子音終わり）",
    "endLetter": "в",
    "options": [
      "аавыг",
      "аавийг",
      "аавг"
    ],
    "answer": "аавыг",
    "ruleTip": "男性子音終わりには「-ыг」！",
    "explanation": "「аав（父）」は男性語幹なので「-ыг」が付き「аавыг（父を）」となります。",
    "exampleSentenceMn": "Би аавыг хүлээж байна.",
    "exampleSentenceJa": "私は父を待っています。"
  },
  {
    "id": "sr_acc_5",
    "category": "accusative_yg",
    "categoryTitle": "対格（-ыг / -ийг / -г）",
    "prompt": "対格助詞（〜を）を正しく付けた形を選んでください",
    "targetWord": "ээж",
    "targetWordMeaning": "母（女性子音終わり）",
    "endLetter": "ж",
    "options": [
      "ээжийг",
      "ээжыг",
      "ээжг"
    ],
    "answer": "ээжийг",
    "ruleTip": "女性子音終わりには「-ийг」！",
    "explanation": "「ээж（母）」は女性語幹なので「-ийг」が付き「ээжийг（母を）」となります。",
    "exampleSentenceMn": "Би ээжийг баярлуулсан.",
    "exampleSentenceJa": "私は母を喜ばせました。"
  },
  {
    "id": "sr_gen_1",
    "category": "genitive_yn",
    "categoryTitle": "属格（-ын / -ийн）",
    "prompt": "属格助詞（〜の）を正しく付けた形を選んでください",
    "targetWord": "ном",
    "targetWordMeaning": "本（男性子音終わり）",
    "endLetter": "м",
    "options": [
      "номын",
      "номийн",
      "номны"
    ],
    "answer": "номын",
    "ruleTip": "男性子音終わりには「-ын」！",
    "explanation": "「ном」は男性母音『о』を持ち子音終わりなので、属格は『-ын』となり「номын（本の）」となります。",
    "exampleSentenceMn": "Энэ бол номын сан.",
    "exampleSentenceJa": "これは図書館（本の蔵）です。"
  },
  {
    "id": "sr_gen_2",
    "category": "genitive_yn",
    "categoryTitle": "属格（-ын / -ийн）",
    "prompt": "属格助詞（〜の）を正しく付けた形を選んでください",
    "targetWord": "гэр",
    "targetWordMeaning": "家（女性子音終わり）",
    "endLetter": "р",
    "options": [
      "гэрийн",
      "гэрын",
      "гэрний"
    ],
    "answer": "гэрийн",
    "ruleTip": "女性子音終わりには「-ийн」！",
    "explanation": "「гэр」は女性母音『э』を持ち子音終わりなので、属格は『-ийн』となり「гэрийн（家の）」となります。",
    "exampleSentenceMn": "Би гэрийн даалгавраа хийв.",
    "exampleSentenceJa": "私は宿題（家の課題）をしました。"
  },
  {
    "id": "sr_gen_3",
    "category": "genitive_yn",
    "categoryTitle": "属格（-ын / -ийн）",
    "prompt": "属格助詞（〜の）を正しく付けた形を選んでください",
    "targetWord": "ширээ",
    "targetWordMeaning": "机（長母音終わり）",
    "endLetter": "э",
    "options": [
      "ширээний",
      "ширээийн",
      "ширээын"
    ],
    "answer": "ширээний",
    "ruleTip": "長母音・二重母音終わりには「-ний / -ны」！",
    "explanation": "「ширээ」のように長母音で終わる単語には接続の「н」が加わり「-ний」となって「ширээний（机の）」となります。",
    "exampleSentenceMn": "Ширээний бүтээлэг гоё байна.",
    "exampleSentenceJa": "机のクロスが綺麗です。"
  },
  {
    "id": "sr_neg_1",
    "category": "negation_bish",
    "categoryTitle": "否定詞（биш vs үгүй）",
    "prompt": "空欄に入る正しい否定詞（биш / үгүй）を選んでください",
    "targetWord": "биш",
    "targetWordMeaning": "〜ではない（名詞否定）",
    "sentencePattern": "Би оюутан ___.",
    "sentenceMeaning": "私は学生ではありません。",
    "options": [
      "биш",
      "үгүй"
    ],
    "answer": "биш",
    "ruleTip": "「名詞・身分＋ではない」の否定は「биш」！",
    "explanation": "名詞「оюутан（学生）」を否定して「学生ではない」と言うときは『биш』を用います。「Би оюутан биш.」となります。",
    "exampleSentenceMn": "Би оюутан биш, багш.",
    "exampleSentenceJa": "私は学生ではなく、先生です。"
  },
  {
    "id": "sr_neg_2",
    "category": "negation_bish",
    "categoryTitle": "否定詞（биш vs үгүй）",
    "prompt": "空欄に入る正しい否定詞（биш / үгүй）を選んでください",
    "targetWord": "үгүй",
    "targetWordMeaning": "いいえ（返答の否定）",
    "sentencePattern": "___, би тийм зүйл мэдэхгүй.",
    "sentenceMeaning": "いいえ、私はそんなこと知りません。",
    "options": [
      "Үгүй",
      "Биш"
    ],
    "answer": "Үгүй",
    "ruleTip": "「いいえ」と独立して答える返答は「Үгүй」！",
    "explanation": "「はい/いいえ」の「いいえ」として文頭で答えるときは『Үгүй』を用います。「Үгүй, би мэдэхгүй.」となります。",
    "exampleSentenceMn": "Үгүй, би мэдэхгүй.",
    "exampleSentenceJa": "いいえ、私は知りません。"
  },
  {
    "id": "sr_neg_3",
    "category": "negation_bish",
    "categoryTitle": "否定詞（биш vs үгүй）",
    "prompt": "空欄に入る正しい否定詞（биш / үгүй）を選んでください",
    "targetWord": "биш",
    "targetWordMeaning": "〜ではない",
    "sentencePattern": "Энэ миний ном ___.",
    "sentenceMeaning": "これは私の本ではありません。",
    "options": [
      "биш",
      "үгүй"
    ],
    "answer": "биш",
    "ruleTip": "「名詞＋ではない」の否定は「биш」！",
    "explanation": "「миний ном（私の本）」という名詞述語を否定して「〜ではない」と言うときは『биш』を用います。",
    "exampleSentenceMn": "Энэ миний ном биш.",
    "exampleSentenceJa": "これは私の本ではありません。"
  },
  {
    "id": "sr_neg_4",
    "category": "negation_bish",
    "categoryTitle": "否定詞（биш vs үгүй）",
    "prompt": "空欄に入る正しい表現（байхгүй / биш）を選んでください",
    "targetWord": "байхгүй",
    "targetWordMeaning": "ない・いない（存在の否定）",
    "sentencePattern": "Надад одоо мөнгө ___.",
    "sentenceMeaning": "私には今お金がありません。",
    "options": [
      "байхгүй",
      "биш"
    ],
    "answer": "байхгүй",
    "ruleTip": "「（物や人が）存在しない・持っていない」は「байхгүй」！",
    "explanation": "「お金がない」のように存在や所持の否定には動詞 байх の否定形『байхгүй』を用います（биш は「お金というものではない」という意味になってしまいます）。",
    "exampleSentenceMn": "Надад одоо мөнгө байхгүй.",
    "exampleSentenceJa": "私には今お金がありません。"
  }
];

export const suffixRuleData = {
  categories: suffixRuleCategories,
  quizzes: suffixRuleQuizzes
};
