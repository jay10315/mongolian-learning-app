// モンゴル語 助詞・語尾使い分けルールマスターデータ
// 与位格（-д/-т: г,р,сの法則）、疑問詞文末（бэ/вэ: н,м,в,лの法則）、Yes/No疑問（уу/үү）、対格、属格、否定詞完全対応

export const suffixRuleCategories = [
  {
    "id": "time_dative_rules",
    "title": "文における月・日の使い方（与位格 -д/-т の要否）",
    "shortRule": "「- сар」「- долоо хоног」「年月日」「- гараг」「頻度」は要る！「- жил」「- хэддэх өдөр」「日常時称」「- дараа/- өмнө」「期間」は助詞不要！",
    "badge": "試験頻出 ⭐",
    "description": "モンゴル語の時間表現では与位格（-д/-т）をつける表現と、助詞をつけてはいけない表現が明確に分かれています。月や曜日（гараг）、年月日は与位格をつけますが、年（жил）や日常時称副詞、期間には助詞をつけません。"
  },
  {
    "id": "hidden_g_n_declension",
    "title": "語末нと隠れг・長母音名詞のг/н・古語隠れн3大分類",
    "shortRule": "歯茎鼻音nは隠れгなし、軟口蓋鼻音ngは-гийн！長母音の人・固有名詞は-гийн、物・場所は-ний！古語隠れнは自然・身体・道具！",
    "badge": "音声学・格変化 ⭐",
    "description": "語末のнの発音（通常のn vs 口の奥のng）による隠れгの出現、長母音終わり名詞の人（г）と物（н）の使い分け、古モンゴル語由来の隠れн名詞3大分類（自然・身体・生活道具）を完全マスター！"
  },
  {
    "id": "noun_maker_uur",
    "title": "道具・場所の名詞を作る語尾（-уур / -үүр）",
    "shortRule": "動詞＋-уур/-үүр ＝ 道具・場所の名詞！（受け身の意味はない）",
    "badge": "語形成 ⭐",
    "description": "動詞の後ろにつくと、動詞が名詞（モノ・道具・場所）に変わります。英語の cook → cooker と同じで、受け身の意味はありません。例: дэлгэх（広げる）＋ -үүр ＝ дэлгүүр（店）、түлхэх（押す）＋ -үүр ＝ түлхүүр（鍵）、хутгах（かき混ぜる）＋ -уур ＝ хутгуур（マドラー）。"
  },
  {
    "id": "causative_passive_diff",
    "title": "使役（-уул/-лга）vs 受け身（-гд）の識別ルール",
    "shortRule": "使役「〜させる」には必ず「л」が入る！受け身「〜される」は「г」と「д」の合体（-гд）！",
    "badge": "態（ボイス）⭐",
    "description": "使役（人に〜させる・〜してもらう）には必ず「л」が入ります（-уул/-үүл, -лга/-лгэ）。一方、受け身（〜される・〜られる）は「г」と「д」の合体（-гд）になります。"
  },

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
  },
{
  "id": "volitive_suffixes",
  "title": "希求・意思形（-я / -ъя / -ье）の法則",
  "shortRule": "男性子音「-ъя/-ъё」、女性子音「-ье」、母音「-я/-ё/-е」！",
  "badge": "活用特訓 🎯",
  "description": "「〜しよう」「〜しましょう」を表す意思・勧誘の語尾。子音で終わる男性語幹には硬音記号「ъ」を挟んで「-ъя / -ъё」、女性語幹には軟音記号「ь」を挟んで「-ье」を接続します。"
},
{
  "id": "converb_j_ch",
  "title": "進行形（-ж / -ч）の法則＆5大例外",
  "shortRule": "原則【р, г, в, л】は「-ч」！ ただし【ир, ор, яв, зур, хар】は「-ж」！",
  "badge": "超頻出 ⚡",
  "description": "現在進行形（-ж/ч байна）の使い分け。原則として語幹が р, г, в, л で終わると「-ч」になりますが、超頻出の5大動詞（ирх, орох, явах, зурах, харах）は例外的に「-ж」を取ります。"
},
{
  "id": "modality_particles",
  "title": "モダリティ終助詞（疑い・推量・義務）",
  "shortRule": "疑い「гэж үү」、確認「биш үү/биз дээ」、想起「билүү」、義務「ёстой」！",
  "badge": "会話ニュアンス 🎭",
  "description": "話し手の気持ち・働きかけを表す終助詞の使い分け。「本当に〜か？」「〜ですよね？」「〜でしたっけ？」「〜すべきだ」「〜かもしれない」などの文脈に合わせた選択特訓です。"
},
{
  "id": "auxiliary_verbs",
  "title": "補助動詞7大構文（сурах, үзэх...）",
  "shortRule": "習得「-ж сурах」、試み「-ж үзэх」、恩恵「-ж өгөх」！",
  "badge": "表現力UP 🤝",
  "description": "動詞の接続形（-ж / -ч）に補助動詞を接続して「〜できるようになる」「〜してみる」「〜してあげる」「〜し始める」「〜し終える」などの豊かなアスペクトを表現します。"
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
  },
{
  "id": "sr_vol_1",
  "category": "volitive_suffixes",
  "categoryTitle": "希求・意思形（-я / -ъя / -ье）",
  "prompt": "「休もう（амрах）」の正しい希求形（意思・勧誘）を選んでください",
  "targetWord": "амрах",
  "targetWordMeaning": "休む（語幹: амар-）",
  "endLetter": "р (男性語子音語幹)",
  "options": [
    "амаръя",
    "амарья",
    "амарна",
    "амарье"
  ],
  "answer": "амаръя",
  "ruleTip": "男性語の子音語幹の後には硬音記号「ъ」を挟んで「-ъя」を接続します！",
  "explanation": "「амрах（休む）」の語幹は「амар-」で男性語の子音語幹です。この場合、硬音記号「ъ」を挟んで「амаръя（休もう）」と表記するのが正しい正書法です。",
  "exampleSentenceMn": "Бүгдээрээ түр амаръя.",
  "exampleSentenceJa": "みんなで少し休みましょう。"
},
{
  "id": "sr_vol_2",
  "category": "volitive_suffixes",
  "categoryTitle": "希求・意思形（-я / -ъя / -ье）",
  "prompt": "「見よう（үзэх）」の正しい希求形（意思・勧誘）を選んでください",
  "targetWord": "үзэх",
  "targetWordMeaning": "見る（語幹: үз-）",
  "endLetter": "з (女性語子音語幹)",
  "options": [
    "үзье",
    "үзъе",
    "үзэе",
    "үзнэ"
  ],
  "answer": "үзье",
  "ruleTip": "女性語の子音語幹の後には軟音記号「ь」を挟んで「-ье」を接続します！",
  "explanation": "「үзэх（見る）」の語幹は「үз-」で女性語の子音語幹です。この場合、軟音記号「ь」を挟んで「үзье（見よう／見てみよう）」となります。",
  "exampleSentenceMn": "Энэ киног үзье.",
  "exampleSentenceJa": "この映画を見ましょう。"
},
{
  "id": "sr_vol_3",
  "category": "volitive_suffixes",
  "categoryTitle": "希求・意思形（-я / -ъя / -ье）",
  "prompt": "「会おう（уулзах）」の正しい希求形（意思・勧誘）を選んでください",
  "targetWord": "уулзах",
  "targetWordMeaning": "会う（語幹: уулз-）",
  "endLetter": "з (男性語子音語幹)",
  "options": [
    "уулзъя",
    "уулзья",
    "уулзъё",
    "уулзье"
  ],
  "answer": "уулзъя",
  "ruleTip": "男性語（у母音）の子音語幹には「-ъя」が接続します！",
  "explanation": "「уулзах（会う）」は男性語で子音語幹（уулз-）のため、硬音記号「ъ」を挟んで「уулзъя（会いましょう）」となります。",
  "exampleSentenceMn": "Маргааш дахин уулзъя.",
  "exampleSentenceJa": "明日また会いましょう。"
},
{
  "id": "sr_vol_4",
  "category": "volitive_suffixes",
  "categoryTitle": "希求・意思形（-я / -ъя / -ье）",
  "prompt": "「食べよう（идэх）」の正しい希求形（意思・勧誘）を選んでください",
  "targetWord": "идэх",
  "targetWordMeaning": "食べる（語幹: ид-）",
  "endLetter": "д (女性語子音語幹)",
  "options": [
    "идье",
    "идъе",
    "идэе",
    "иднэ"
  ],
  "answer": "идье",
  "ruleTip": "女性語子音語幹「ид-」には軟音記号「ь」を挟んで「-ье」が接続します！",
  "explanation": "「идэх（食べる）」は女性語で子音語幹（ид-）のため、「идье（食べましょう）」となります。",
  "exampleSentenceMn": "Халуун бууз идье.",
  "exampleSentenceJa": "温かいボーズを食べましょう。"
},
{
  "id": "sr_vol_5",
  "category": "volitive_suffixes",
  "categoryTitle": "希求・意思形（-я / -ъя / -ье）",
  "prompt": "「話そう（ярих）」の正しい希求形（意思・勧誘）を選んでください",
  "targetWord": "ярих",
  "targetWordMeaning": "話す（語幹: ярь-）",
  "endLetter": "рь (軟音脱落)",
  "options": [
    "яръя",
    "ярья",
    "ярьё",
    "ярьна"
  ],
  "answer": "яръя",
  "ruleTip": "「ярих」の語幹「ярь-」は希求形で「ь」が脱落し硬音記号「ъ」が入って「яръя」となります！",
  "explanation": "「ярих（話す）」は特殊な正書法で、希求形では語幹の「ь」が「ъ」に交代して「яръя（話しましょう）」と綴られます。",
  "exampleSentenceMn": "Монголоор яръя.",
  "exampleSentenceJa": "モンゴル語で話しましょう。"
},
{
  "id": "sr_cjc_1",
  "category": "converb_j_ch",
  "categoryTitle": "進行形（-ж / -ч）の法則＆5大例外",
  "prompt": "動詞「ирэх（来る）」の現在進行形「来ています」の正しい形を選んでください",
  "targetWord": "ирэх",
  "targetWordMeaning": "来る（語幹: ир-）",
  "endLetter": "р (超重要例外！)",
  "options": [
    "ирж байна",
    "ирч байна",
    "ирнэ байна",
    "ирдэг байна"
  ],
  "answer": "ирж байна",
  "ruleTip": "【5大例外動詞】語幹が「р」で終わるのに「-ч」ではなく「-ж」を取ります！",
  "explanation": "「ирэх（来る）」は最頻出の例外動詞です。通常「р」で終わる語幹には「-ч」が付きますが、「ирэх」は例外的に「ирж байна（来ています）」となります（×ирч байна は誤り）。",
  "exampleSentenceMn": "Багш одоо ирж байна.",
  "exampleSentenceJa": "先生が今来ています。"
},
{
  "id": "sr_cjc_2",
  "category": "converb_j_ch",
  "categoryTitle": "進行形（-ж / -ч）の法則＆5大例外",
  "prompt": "動詞「орох（入る・降る）」の現在進行形「降っています」の正しい形を選んでください",
  "targetWord": "орох",
  "targetWordMeaning": "入る・降る（語幹: ор-）",
  "endLetter": "р (超重要例外！)",
  "options": [
    "орж байна",
    "орч байна",
    "орно байна",
    "ордог байна"
  ],
  "answer": "орж байна",
  "ruleTip": "【5大例外動詞】「орох」は「-ч」ではなく「-ж」を取ります！",
  "explanation": "「орох」も語幹末尾が「р」ですが、「-ч」ではなく「-ж」を取る5大例外動詞の一つです。「Бороо орж байна（雨が降っています）」のように使います。",
  "exampleSentenceMn": "Гадаа цас орж байна.",
  "exampleSentenceJa": "外で雪が降っています。"
},
{
  "id": "sr_cjc_3",
  "category": "converb_j_ch",
  "categoryTitle": "進行形（-ж / -ч）の法則＆5大例外",
  "prompt": "動詞「явах（行く）」の現在進行形「行っています」の正しい形を選んでください",
  "targetWord": "явах",
  "targetWordMeaning": "行く（語幹: яв-）",
  "endLetter": "в (超重要例外！)",
  "options": [
    "явж байна",
    "явч байна",
    "явна байна",
    "явдаг байна"
  ],
  "answer": "явж байна",
  "ruleTip": "【5大例外動詞】「явах」は「-ч」ではなく「-ж」を取ります！",
  "explanation": "語幹が「в」で終わる語は原則「-ч」ですが、「явах」は超重要例外で「явж байна（行っています）」となります。",
  "exampleSentenceMn": "Би сургууль руу явж байна.",
  "exampleSentenceJa": "私は学校へ行っているところです。"
},
{
  "id": "sr_cjc_4",
  "category": "converb_j_ch",
  "categoryTitle": "進行形（-ж / -ч）の法則＆5大例外",
  "prompt": "動詞「сурах（学ぶ）」の現在進行形「学んでいます」の正しい形を選んでください",
  "targetWord": "сурах",
  "targetWordMeaning": "学ぶ（語幹: сур-）",
  "endLetter": "р (原則通り)",
  "options": [
    "сурч байна",
    "сурж байна",
    "сурна байна",
    "сурдаг байна"
  ],
  "answer": "сурч байна",
  "ruleTip": "原則ルール: 語幹末尾が「р」で終わる一般動詞には「-ч」が接続します！",
  "explanation": "「сурах（学ぶ）」は例外5動詞（ир, ор, яв, зур, хар）ではない通常の「р」語幹動詞なので、原則通り「сурч байна（学んでいます）」となります。",
  "exampleSentenceMn": "Би монгол хэл сурч байна.",
  "exampleSentenceJa": "私はモンゴル語を学んでいます。"
},
{
  "id": "sr_cjc_5",
  "category": "converb_j_ch",
  "categoryTitle": "進行形（-ж / -ч）の法則＆5大例外",
  "prompt": "動詞「харах（見る）」の現在進行形「見ています」の正しい形を選んでください",
  "targetWord": "харах",
  "targetWordMeaning": "見る（語幹: хар-）",
  "endLetter": "р (超重要例外！)",
  "options": [
    "харж байна",
    "харч байна",
    "харна байна",
    "хардаг байна"
  ],
  "answer": "харж байна",
  "ruleTip": "【5大例外動詞】「харах」は「-ч」ではなく「-ж」を取ります！",
  "explanation": "「харах（見る）」は5大例外動詞の一つで、「р」終わりですが「харж байна（見ています）」となります。",
  "exampleSentenceMn": "Би зурагт харж байна.",
  "exampleSentenceJa": "私はテレビを見ています。"
},
{
  "id": "sr_mod_1",
  "category": "modality_particles",
  "categoryTitle": "モダリティ終助詞（疑い・推量・義務）",
  "prompt": "「彼が来ないんですか？（まさか来ないのですか？）」という疑い・意外を表す表現を選んでください",
  "targetWord": "Тэр ирэхгүй ___ ?",
  "targetWordMeaning": "疑い・意外の反問",
  "endLetter": "疑い構文",
  "options": [
    "гэж үү",
    "биз дээ",
    "билүү",
    "байх аа"
  ],
  "answer": "гэж үү",
  "ruleTip": "強い疑いや意外「本当に〜ですか？まさか〜？」は「гэж үү」を使います！",
  "explanation": "「гэж үү」は話し手の意外感や信じられないという疑いを表す終助詞構文です。「Тэр ирэхгүй гэж үү?」で「彼が来ないなんてことがあるのですか？」という意味になります。",
  "exampleSentenceMn": "Энэ үнэн гэж үү?",
  "exampleSentenceJa": "これが本当ですか（まさか本当なのですか）？"
},
{
  "id": "sr_mod_2",
  "category": "modality_particles",
  "categoryTitle": "モダリティ終助詞（疑い・推量・義務）",
  "prompt": "「彼の名前は何でしたっけ？」と過去の記憶を想起して尋ねる表現を選んでください",
  "targetWord": "Түүний нэр хэн ___ ?",
  "targetWordMeaning": "記憶の想起確認",
  "endLetter": "想起助詞",
  "options": [
    "билээ",
    "биз дээ",
    "гэж үү",
    "ёстой"
  ],
  "answer": "билээ",
  "ruleTip": "一度聞いたのに忘れてしまったことを思い出すときは「билүү / билээ」！",
  "explanation": "「билүү / билээ」は「〜でしたっけ？」と、以前知っていたはずの事柄を確認・想起する際に用いる文末助詞です。",
  "exampleSentenceMn": "Та маргааш явах билүү?",
  "exampleSentenceJa": "明日行かれるんでしたっけ？"
},
{
  "id": "sr_mod_3",
  "category": "modality_particles",
  "categoryTitle": "モダリティ終助詞（疑い・推量・義務）",
  "prompt": "「私たちは時間通りに行くべきです（はずです）」という当然・義務を表す表現を選んでください",
  "targetWord": "Бид цагтаа очих ___ .",
  "targetWordMeaning": "当然・義務",
  "endLetter": "義務表現",
  "options": [
    "ёстой",
    "магадгүй",
    "бололтой",
    "байх аа"
  ],
  "answer": "ёстой",
  "ruleTip": "動詞形動詞「-х」＋「ёстой」で「〜すべきだ、〜のはずだ」を表します！",
  "explanation": "「-х ёстой」は社会的な決まり、道徳、スケジュールなどに基づいて「当然〜すべきだ、〜するはずだ」という義務・当然を表します。",
  "exampleSentenceMn": "Оюутан хичээлдээ суух ёстой.",
  "exampleSentenceJa": "学生は授業に出席すべきです。"
},
{
  "id": "sr_mod_4",
  "category": "modality_particles",
  "categoryTitle": "モダリティ終助詞（疑い・推量・義務）",
  "prompt": "「明日雨が降るかもしれない」という不確実な可能性を表す表現を選んでください",
  "targetWord": "Маргааш бороо орж ___ .",
  "targetWordMeaning": "不確実な推量・可能性",
  "endLetter": "推量助詞",
  "options": [
    "магадгүй",
    "ёстой",
    "биз дээ",
    "билээ"
  ],
  "answer": "магадгүй",
  "ruleTip": "「〜かもしれない」と不確実な可能性を述べる表現は「магадгүй」です！",
  "explanation": "「магадгүй」は確信度が低く、「〜かもしれない」と推測・推量を述べる際に最もよく使われます。",
  "exampleSentenceMn": "Тэр маргааш завгүй байж магадгүй.",
  "exampleSentenceJa": "彼は明日忙しいかもしれません。"
},
{
  "id": "sr_aux_1",
  "category": "auxiliary_verbs",
  "categoryTitle": "補助動詞7大構文",
  "prompt": "「私はモンゴル料理を作れるようになった」の空欄に入る補助動詞を選んでください",
  "targetWord": "Би монгол хоол хийж ___ .",
  "targetWordMeaning": "能力獲得・習得（〜できるようになる）",
  "endLetter": "補助動詞",
  "options": [
    "сурсан",
    "үзсэн",
    "эхэлсэн",
    "өгсөн"
  ],
  "answer": "сурсан",
  "ruleTip": "「V + ж/ч сурах」で「〜できるようになる、〜の仕方を覚える」を表します！",
  "explanation": "「сурах（学ぶ）」を補助動詞として用いると、練習や学習の結果として「〜できるようになる」という能力獲得のニュアンスを表します。",
  "exampleSentenceMn": "Дүү маань дугуй унаж сурсан.",
  "exampleSentenceJa": "弟は自転車に乗れるようになった。"
},
{
  "id": "sr_aux_2",
  "category": "auxiliary_verbs",
  "categoryTitle": "補助動詞7大構文",
  "prompt": "「このデールを着てみよう（試着してみよう）」の空欄に入る補助動詞を選んでください",
  "targetWord": "Энэ дээлийг өмсөж ___ .",
  "targetWordMeaning": "試み（〜してみる）",
  "endLetter": "補助動詞",
  "options": [
    "үзье",
    "суръя",
    "эхэлье",
    "авъя"
  ],
  "answer": "үзье",
  "ruleTip": "「V + ж/ч үзэх」で「〜してみる［試み］」を表します！",
  "explanation": "「үзэх（見る）」は補助動詞として接続すると「試しに〜してみる」という意味になります。希求形「үзье」と合わせて「着てみよう」となります。",
  "exampleSentenceMn": "Энэ хоолыг идэж үзье.",
  "exampleSentenceJa": "この料理を食べてみよう。"
},
{
  "id": "sr_aux_3",
  "category": "auxiliary_verbs",
  "categoryTitle": "補助動詞7大構文",
  "prompt": "「私は友達を手伝ってあげた」の空欄に入る補助動詞を選んでください",
  "targetWord": "Би найздаа тусалж ___ .",
  "targetWordMeaning": "恩恵授与（〜してあげる）",
  "endLetter": "補助動詞",
  "options": [
    "өгсөн",
    "авсан",
    "сурагдсан",
    "дууссан"
  ],
  "answer": "өгсөн",
  "ruleTip": "「V + ж/ч өгөх」で相手のために「〜してあげる」という恩恵授与を表します！",
  "explanation": "「өгөх（与える）」は補助動詞として「相手の利益のために〜してあげる」を表します。「тусалж өгөх」で「手伝ってあげる」となります。",
  "exampleSentenceMn": "Би дүүдээ ном уншиж өгсөн.",
  "exampleSentenceJa": "私は弟に本を読んであげた。"
},

  // ==========================================
  // 【新設】文における月・日の使い方（与位格 -д/-т の要否）
  // ==========================================
  {
    "id": "sr_time_1",
    "category": "time_dative_rules",
    "categoryTitle": "文における月・日の使い方（与位格の要否）",
    "prompt": "「私たちは来月家に帰省します」の空欄に入る正しい形を選んでください",
    "targetWord": "Бид ирэх ___ гэртээ харина.",
    "targetWordMeaning": "来月に（- сар は与位格が必要）",
    "endLetter": "сар",
    "options": [
      "сард",
      "сар",
      "сарын",
      "сараар"
    ],
    "answer": "сард",
    "ruleTip": "「- сар（月）」は与位格「-д」が必要です！（ирэх сард、энэ сард、өнгөрсөн сард）",
    "explanation": "「月（сар）」を表す時間表現（来月、今月、先月）には必ず与位格「-д」をつけます。一方、「年（жил）」には助詞をつけない（ирэх жил）ため、対比して覚えましょう！",
    "exampleSentenceMn": "Бид ирэх сард гэртээ харина.",
    "exampleSentenceJa": "私たちは来月に家に帰省します。"
  },
  {
    "id": "sr_time_2",
    "category": "time_dative_rules",
    "categoryTitle": "文における月・日の使い方（与位格の要否）",
    "prompt": "「皆さんは来年モンゴルに行きますよね」の空欄に入る正しい形を選んでください",
    "targetWord": "Та нар ирэх ___ Монголд очно биз дээ.",
    "targetWordMeaning": "来年（- жил は与位格が不要！）",
    "endLetter": "жил",
    "options": [
      "жил",
      "жилд",
      "жилийн",
      "жилээр"
    ],
    "answer": "жил",
    "ruleTip": "「- жил（年）」は与位格「-д」を使いません！（ирэх жил、энэ жил、өнгөрсөн жил）",
    "explanation": "「年（жил）」を表す時間表現（来年、今年、去年）は与位格助詞を伴わず、そのまま副詞的に用います（× ирэх жилд とは言いません）。※「1年に1回」のような頻度のときのみ「жилд」となります。",
    "exampleSentenceMn": "Та нар ирэх жил Монголд очно биз дээ.",
    "exampleSentenceJa": "皆さんは来年モンゴルに行きますよね。"
  },
  {
    "id": "sr_time_3",
    "category": "time_dative_rules",
    "categoryTitle": "文における月・日の使い方（与位格の要否）",
    "prompt": "「来週の月曜日に試験があります」の空欄に入る正しい形を選んでください",
    "targetWord": "Ирэх долоо хоногийн даваа гараг___ шалгалттай.",
    "targetWordMeaning": "月曜日に（- гараг は与位格が必要）",
    "endLetter": "гараг",
    "options": [
      "гарагт",
      "гараг",
      "гарагаар",
      "гарагтай"
    ],
    "answer": "гарагт",
    "ruleTip": "「- гараг（曜日）」は与位格「-т」が必要です！（даваа гарагт、мягмар гарагт）",
    "explanation": "曜日を「〜曜日に」と表す場合、「гараг」には与位格語尾「-т」（語末がгのため-т）をつけます（даваа гарагт）。一方、「нэгдэх өдөр」のような「- өдөр」で曜日を表す場合は助詞不要です。",
    "exampleSentenceMn": "Ирэх долоо хоногийн даваа гарагт шалгалттай.",
    "exampleSentenceJa": "来週の月曜日に試験があります。"
  },
  {
    "id": "sr_time_4",
    "category": "time_dative_rules",
    "categoryTitle": "文における月・日の使い方（与位格の要否）",
    "prompt": "「モンゴルのツァガーンサル（旧正月）は2月にあります」の空欄に入る正しい形を選んでください",
    "targetWord": "Монголын Цагаан сар 2-р сар___ болно.",
    "targetWordMeaning": "2月に（数字＋сар は与位格が必要）",
    "endLetter": "сар",
    "options":
    [
      "сард",
      "сар",
      "сараас",
      "сартай"
    ],
    "answer": "сард",
    "ruleTip": "数字の月（2-р сарなど）には与位格「-д」をつけます！（2-р сард）",
    "explanation": "具体的な月名を表す「○-р сар」の後に与位格「-д」をつけて「○月に」と表します。例：2-р сард（2月に）、10-р сард（10月に）。",
    "exampleSentenceMn": "Монголын Цагаан сар 2-р сард болно.",
    "exampleSentenceJa": "モンゴルの旧正月は2月にあります。"
  },
  {
    "id": "sr_time_5",
    "category": "time_dative_rules",
    "categoryTitle": "文における月・日の使い方（与位格の要否）",
    "prompt": "「9月1日に新学期が始まります」の空欄に入る正しい形を選んでください",
    "targetWord": "9-р сарын нэгэн___ хичээл эхэлдэг.",
    "targetWordMeaning": "9月1日に（日付特定日は与位格が必要）",
    "endLetter": "нэгэн",
    "options": [
      "нэгэнд",
      "нэгэн",
      "нэгнээс",
      "нэгнээр"
    ],
    "answer": "нэгэнд",
    "ruleTip": "日付特定日（1日など）には与位格「-д」をつけて「〜日に」とします！（нэгэнд）",
    "explanation": "モンゴルでは日付の「1日に」を表す際、数詞「нэг」の隠れн形「нэгэн」に与位格「-д」を接続して「нэгэнд」と表現します。",
    "exampleSentenceMn": "9-р сарын нэгэнд хичээл эхэлдэг.",
    "exampleSentenceJa": "9月1日に新学期が始まります。"
  },
  {
    "id": "sr_time_6",
    "category": "time_dative_rules",
    "categoryTitle": "文における月・日の使い方（与位格の要否）",
    "prompt": "「皆さんはモンゴルで2年間働きます」の空欄に入る正しい形を選んでください",
    "targetWord": "Та нар Монголд 2 ___ ажиллана.",
    "targetWordMeaning": "2年間（期間 хугацаа は助詞不要！）",
    "endLetter": "жил",
    "options": [
      "жил",
      "жилд",
      "жилээр",
      "жилийн"
    ],
    "answer": "жил",
    "ruleTip": "継続期間（2年間、2ヶ月間など）には与位格をつけません！（2 жил、2 сар）",
    "explanation": "「2年間働きます」「2ヶ月間生活します」のように時間の長さを表す「期間（хугацаа）」には助詞をつけず、そのまま「2 жил」「2 сар」と置きます。",
    "exampleSentenceMn": "Та нар Монголд 2 жил ажиллана.",
    "exampleSentenceJa": "皆さんはモンゴルで2年間働きます。"
  },
  {
    "id": "sr_time_7",
    "category": "time_dative_rules",
    "categoryTitle": "文における月・日の使い方（与位格の要否）",
    "prompt": "「ここでは皆さんは1日に3回食事をとります」の空欄に入る正しい形を選んでください",
    "targetWord": "Энд та нар өдөр___ 3 удаа хоол иддэг.",
    "targetWordMeaning": "1日に〜回（頻度・割合は与位格が必要！）",
    "endLetter": "өдөр",
    "options": [
      "өдөрт",
      "өдөр",
      "өдрийн",
      "өдрөөр"
    ],
    "answer": "өдөрт",
    "ruleTip": "頻度・割合を表す「1日に○回、年に○回」には与位格が必要です！（өдөрт、жилд、сард）",
    "explanation": "「1日に3回（өдөрт 3 удаа）」「2年に1回（2 жилд нэг удаа）」「1ヶ月に4回（1 сард 4 удаа）」のように頻度・割合を表す基準単位には必ず与位格（-т/-д）がつきます。",
    "exampleSentenceMn": "Энд та нар өдөрт 3 удаа хоол иддэг.",
    "exampleSentenceJa": "ここでは皆さんは1日に3回食事をとります。"
  },
  {
    "id": "sr_time_8",
    "category": "time_dative_rules",
    "categoryTitle": "文における月・日の使い方（与位格の要否）",
    "prompt": "「皆さんは2年後にモンゴルから帰国します」の空欄に入る正しい形を選んでください",
    "targetWord": "Та нар 2 жилийн дараа___ Монголоос буцаж ирнэ.",
    "targetWordMeaning": "2年後に（- дараа は助詞不要！）",
    "endLetter": "дараа",
    "options": [
      "дараа",
      "дараад",
      "дараагаар",
      "дараа нь"
    ],
    "answer": "дараа",
    "ruleTip": "「〜 дараа（〜後）」「〜 өмнө（〜前）」はそれ自体が副詞的後置詞のため与位格は不要です！",
    "explanation": "「2 жилийн дараа（2年後に）」「1 сарын өмнө（1ヶ月前に）」は、後置詞「дараа」「өмнө」の直後に与位格「-д」をつける必要はありません。",
    "exampleSentenceMn": "Та нар 2 жилийн дараа Монголоос буцаж ирнэ.",
    "exampleSentenceJa": "皆さんは2年後にモンゴルから帰国します。"
  },

  // ==========================================
  // 【新設】道具・場所の名詞を作る語尾（-уур / -үүр）
  // ==========================================
  {
    "id": "sr_uur_1",
    "category": "noun_maker_uur",
    "categoryTitle": "道具・場所の名詞を作る語尾（-уур/-үүр）",
    "prompt": "動詞「広げる（дэлгэх）」に語尾「-үүр」がついた名詞「дэлгүүр」の正しい意味を選んでください",
    "targetWord": "дэлгэх（広げる）＋ -үүр ＝ дэлгүүр",
    "targetWordMeaning": "広げる場所 ＝ 店",
    "endLetter": "-үүр",
    "options": [
      "店（広げて商う場所）",
      "広げられる（受け身）",
      "広げさせる（使役）",
      "広げた（過去）"
    ],
    "answer": "店（広げて商う場所）",
    "ruleTip": "「-уур / -үүр」は動詞から「道具・場所の名詞」を作ります！（受け身ではありません）",
    "explanation": "動詞「дэлгэх（広げる・陳列する）」に名詞化接尾辞「-үүр」がつくと、「品物を広げて並べる場所 ＝ 店（дэлгүүр）」という名詞になります。受け身の意味はありません。",
    "exampleSentenceMn": "Бид дэлгүүр орж хүнс цуглуулсан.",
    "exampleSentenceJa": "私たちは店に行って食料品を買い集めた。"
  },
  {
    "id": "sr_uur_2",
    "category": "noun_maker_uur",
    "categoryTitle": "道具・場所の名詞を作る語尾（-уур/-үүр）",
    "prompt": "動詞「押す（түлхэх）」に語尾「-үүр」がついた名詞「түлхүүр」の正しい意味を選んでください",
    "targetWord": "түлхэх（押す）＋ -үүр ＝ түлхүүр",
    "targetWordMeaning": "押して回す道具 ＝ 鍵",
    "endLetter": "-үүр",
    "options": [
      "鍵（押して開ける道具）",
      "押される（受け身）",
      "押させる（使役）",
      "ドア（名詞）"
    ],
    "answer": "鍵（押して開ける道具）",
    "ruleTip": "英語の cook → cooker（調理器具）と同様に、動作をする「道具」を作ります！",
    "explanation": "「түлхэх（押す）」＋「-үүр」＝「押して錠前を開ける道具 ＝ 鍵（түлхүүр）」となります。",
    "exampleSentenceMn": "Хаалганы түлхүүрээ мартчихаж.",
    "exampleSentenceJa": "ドアの鍵を忘れてしまった。"
  },
  {
    "id": "sr_uur_3",
    "category": "noun_maker_uur",
    "categoryTitle": "道具・場所の名詞を作る語尾（-уур/-үүр）",
    "prompt": "動詞「かき混ぜる（хутгах）」に語尾「-уур」がついた名詞「хутгуур」の正しい意味を選んでください",
    "targetWord": "хутгах（かき混ぜる）＋ -уур ＝ хутгуур",
    "targetWordMeaning": "かき混ぜる道具 ＝ マドラー・へら",
    "endLetter": "-уур",
    "options": [
      "マドラー・かき混ぜべら",
      "混ぜられる（受け身）",
      "混ぜさせる（使役）",
      "スープ（名詞）"
    ],
    "answer": "マドラー・かき混ぜべら",
    "ruleTip": "男性語「хутгах」には男性母音の「-уур」がつき、かき混ぜる道具を表します！",
    "explanation": "「хутгах（かき混ぜる）」に「-уур」がついて「かき混ぜるための道具（マドラー、調理用へら）」となります。",
    "exampleSentenceMn": "Цайгаа хутгуураар хутгаарай.",
    "exampleSentenceJa": "お茶をマドラーでかき混ぜてください。"
  },

  // ==========================================
  // 【新設】使役（-уул/-лга）vs 受け身（-гд）の識別ルール
  // ==========================================
  {
    "id": "sr_caus_pass_1",
    "category": "causative_passive_diff",
    "categoryTitle": "使役（-уул/-лга）vs 受け身（-гд）の識別",
    "prompt": "動詞「行く（явах）」を使役（〜に行かせる）にする正しい形を選んでください",
    "targetWord": "явах（行く）の使役形",
    "targetWordMeaning": "行かせる（使役には必ず「л」が入る！）",
    "endLetter": "-уул-",
    "options": [
      "явуулах",
      "явагдах",
      "явалцах",
      "явчих"
    ],
    "answer": "явуулах",
    "ruleTip": "使役（〜させる）には必ず【л】が入ります！（-уул / -үүл, -лга / -лгэ）",
    "explanation": "「явах（行く）」に使役接尾辞「-уул-」が結合して「явуулах（行かせる、送る）」となります。使役語尾には必ず「л」が含まれるのが最大の識別ポイントです！",
    "exampleSentenceMn": "Багш намайг номын сан руу явуулсан.",
    "exampleSentenceJa": "先生は私を図書館へ行かせた。"
  },
  {
    "id": "sr_caus_pass_2",
    "category": "causative_passive_diff",
    "categoryTitle": "使役（-уул/-лга）vs 受け身（-гд）の識別",
    "prompt": "動詞「決める・解決する（шийдэх）」を受け身（解決される・決定される）にする正しい形を選んでください",
    "targetWord": "шийдэх（決める）の受動形",
    "targetWordMeaning": "解決される（受け身は「г」と「д」の合体！）",
    "endLetter": "-гд-",
    "options": [
      "шийдэгдэх",
      "шийдүүлэх",
      "шийдэлцэх",
      "шийдчих"
    ],
    "answer": "шийдэгдэх",
    "ruleTip": "受け身（〜される）は必ず【г】と【д】の組み合わせ（-гд）になります！",
    "explanation": "「шийдэх（決める・解決する）」に受動接尾辞「-гд-」がついて「шийдэгдэх（解決される・決定される）」となります。※「шийдүүлэх」は「л」が入っているため使役（解決してもらう）です！",
    "exampleSentenceMn": "Энэ асуудал амархан шийдэгдлээ.",
    "exampleSentenceJa": "この問題はあっさりと解決された。"
  },
  {
    "id": "sr_caus_pass_3",
    "category": "causative_passive_diff",
    "categoryTitle": "使役（-уул/-лга）vs 受け身（-гд）の識別",
    "prompt": "「読む（унших）」を使役（読ませる）にする形と、「見る（үзэх）」を受け身（見られる・目撃される）にする形の組み合わせとして正しいものを選んでください",
    "targetWord": "使役 vs 受動の識別公式",
    "targetWordMeaning": "使役＝л、受動＝гд",
    "endLetter": "識別",
    "options": [
      "уншуулах（使役） / үзэгдэх（受動）",
      "уншигдах（受動） / үзүүлэх（受動）",
      "уншуулгах（受動） / үзэгдэх（使役）",
      "уншуулах（受動） / үзэгдэх（使役）"
    ],
    "answer": "уншуулах（使役） / үзэгдэх（受動）",
    "ruleTip": "使役＝必ず「л」が入る（уншуулах）、受動＝「гとд」の合体（үзэгдэх）！",
    "explanation": "「уншуулах」は「л」が入っているので使役（読ませる）、「үзэгдэх」は「гとд（-гд）」の組み合わせなので受け身（見られる・姿を見せる）です。",
    "exampleSentenceMn": "Хүүхдэд ном уншуулах, сайн тал нь үзэгдэх.",
    "exampleSentenceJa": "子どもに本を読ませる、良い面が見受けられる。"
  },

  // ==========================================
  // 【新設】語末нと隠れг・長母音名詞のг/н・古語隠れн3大分類
  // ==========================================
  {
    "id": "sr_hgn_1",
    "category": "hidden_g_n_declension",
    "categoryTitle": "語末нと隠れг・長母音名詞のг/н・古語隠れн",
    "prompt": "「年（он）」の属格（〜の）として正しい形を選んでください（語末нは歯茎鼻音・通常のn）",
    "targetWord": "он（年）の属格",
    "targetWordMeaning": "通常のn ＝ 隠れгは出ない！",
    "endLetter": "н",
    "options": [
      "оны",
      "онгийн",
      "онний",
      "онын"
    ],
    "answer": "оны",
    "ruleTip": "舌先が前歯の裏につく通常のn（он、хүн）は隠れгが出ず「-ы / -ий」がつきます！",
    "explanation": "「он（年）」の語末「н」は歯茎鼻音（通常のn）なので、隠れгは現れず「оны（年の）」となります。「хүн（人）」も同様に「хүний」となります。",
    "exampleSentenceMn": "Шинэ оны баярын мэнд хүргэе!",
    "exampleSentenceJa": "新年のご挨拶を申し上げます！"
  },
  {
    "id": "sr_hgn_2",
    "category": "hidden_g_n_declension",
    "categoryTitle": "語末нと隠れг・長母音名詞のг/н・古語隠れн",
    "prompt": "「建物（байшин）」の属格（〜の）として正しい形を選んでください（語末нは口の奥で鳴る軟口蓋鼻音 ng）",
    "targetWord": "байшин（建物）の属格",
    "targetWordMeaning": "軟口蓋鼻音ng ＝ 隠れгが現れる！",
    "endLetter": "н",
    "options": [
      "байшингийн",
      "байшины",
      "байшинний",
      "байшинын"
    ],
    "answer": "байшингийн",
    "ruleTip": "舌の奥で「ング」と響く軟口蓋鼻音（байшин、сан）は隠れгが現れて「-гийн」になります！",
    "explanation": "「байшин（建物）」や「сан（基金）」の「н」は軟口蓋鼻音（ng）のため、属格語尾がつくと隠れгが出現して「байшингийн」「сангийн」となります。",
    "exampleSentenceMn": "Энэ байшингийн дээвэр цэнхэр өнгөтэй.",
    "exampleSentenceJa": "この建物の屋根は青色です。"
  },
  {
    "id": "sr_hgn_3",
    "category": "hidden_g_n_declension",
    "categoryTitle": "語末нと隠れг・長母音名詞のг/н・古語隠れн",
    "prompt": "長母音で終わる名詞「弟・妹（дүү）」と「机（ширээ）」の属格（〜の）の組み合わせとして正しいものを選んでください",
    "targetWord": "長母音終わりの名詞：人(г) vs 物(н)",
    "targetWordMeaning": "人は-гийн、物は-ний！",
    "endLetter": "長母音",
    "options": [
      "дүүгийн（人＝г） / ширээний（物＝н）",
      "дүүний（人＝н） / ширээгийн（物＝г）",
      "дүүгийн / ширээгийн",
      "дүүний / ширээний"
    ],
    "answer": "дүүгийн（人＝г） / ширээний（物＝н）",
    "ruleTip": "人・親族・固有名詞（дүү, хүү, Токио）は〈г〉！物・場所・概念（ширээ, хөдөө, санаа）は〈н〉！",
    "explanation": "長母音・二重母音終わりの名詞に属格がつく場合、人・親族・固有名詞には「-гийн（дүүгийн、Токиогийн）」が、物・場所・抽象概念には「-ний / -ны（ширээний、хөдөөний）」がつきます！",
    "exampleSentenceMn": "Дүүгийн ширээний дээр ном байна.",
    "exampleSentenceJa": "弟の机の上に本があります。"
  },
  {
    "id": "sr_hgn_4",
    "category": "hidden_g_n_declension",
    "categoryTitle": "語末нと隠れг・長母音名詞のг/н・古語隠れн",
    "prompt": "古モンゴル語由来の隠れн名詞「水（ус）」と「目（нүд）」の属格として正しい形を選んでください",
    "targetWord": "古語隠れн名詞（自然・身体・道具）",
    "targetWordMeaning": "隠れнが現れて -ны / -ний",
    "endLetter": "с / д",
    "options": [
      "усны / нүдний",
      "усын / нүдий",
      "усгийн / нүдгийн",
      "усыг / нүдийг"
    ],
    "answer": "усны / нүдний",
    "ruleTip": "自然・物質（ус, мод, нар）や身体（нүд, чих, шүд）は古語の隠れнが現れて「-ны/-ний」！",
    "explanation": "「ус（水）」「мод（木）」「нүд（目）」「хувцас（服）」などは歴史的に隠れнを持っているため、属格では「усны」「модны」「нүдний」「хувцасны」と「н」が現れます。",
    "exampleSentenceMn": "Цэвэр усны дусал, миний нүдний шил.",
    "exampleSentenceJa": "きれいな水滴、私の眼鏡（目のガラス）。"
  },
];

export const suffixRuleData = {
  categories: suffixRuleCategories,
  quizzes: suffixRuleQuizzes
};
