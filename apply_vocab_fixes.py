# -*- coding: utf-8 -*-
import json
import re

# Comprehensive mapping of all 230 items by id
# (id -> {mongolian, japanese, pronunciation, root, pos, note})
FIXES = {
  "v_gen_63": {
    "mongolian": "Бололгүй яах вэ.",
    "japanese": "もちろんいいですよ、構いませんとも",
    "pronunciation": "ボロルグイ ヤーフ ウェ",
    "root": "",
    "pos": "表現・挨拶",
    "note": "依頼や提案に対して「もちろん構いませんよ」と快諾する定番表現。"
  },
  "v_gen_183": {
    "mongolian": "Зуунмод хот",
    "japanese": "ズウンモド市",
    "pronunciation": "ズウンモド ホト",
    "root": "",
    "pos": "固有名詞",
    "note": "ウランバートルの南約30kmにあるトゥブ（中央）県の県都。"
  },
  "v_gen_291": {
    "mongolian": "өдрийн хоол(н)",
    "japanese": "昼食、お昼ご飯",
    "pronunciation": "オドリーン ホール",
    "root": "",
    "pos": "名詞（隠れн）",
    "note": "өдөр（昼・日）の属格 ＋ хоол（ご飯）。格助詞が付くとнが現れる。"
  },
  "v_gen_292": {
    "mongolian": "өлс(өх)",
    "japanese": "お腹が空く、空腹になる",
    "pronunciation": "オルソホ",
    "root": "өлс",
    "pos": "動詞",
    "note": "語幹: өлс。Би өлсөж байна で「お腹が空いています」。"
  },
  "v_gen_293": {
    "mongolian": "өмс(өх)",
    "japanese": "着る、身につける",
    "pronunciation": "オムソホ",
    "root": "өмс",
    "pos": "動詞",
    "note": "語幹: өмс。服や靴を身につける動詞。"
  },
  "v_gen_294": {
    "mongolian": "өнгө",
    "japanese": "色、カラー",
    "pronunciation": "オンゴ",
    "root": "",
    "pos": "名詞",
    "note": "「何色ですか？」は Ямар өнгөтэй вэ?"
  },
  "v_gen_295": {
    "mongolian": "өнгөр(өх)",
    "japanese": "過ぎる、通過する、経過する",
    "pronunciation": "オンゴロホ",
    "root": "өнгөр",
    "pos": "動詞",
    "note": "語幹: өнгөр。時間や場所が過ぎる。"
  },
  "v_gen_296": {
    "mongolian": "өнгөрсөн долоо хоног",
    "japanese": "先週",
    "pronunciation": "オンゴルソン ドロー ホノグ",
    "root": "",
    "pos": "連語・句",
    "note": "өнгөрсөн（過ぎた）＋ долоо хоног（1週間）。"
  },
  "v_gen_297": {
    "mongolian": "өндөр",
    "japanese": "高い、背が高い",
    "pronunciation": "オンドル",
    "root": "",
    "pos": "形容詞",
    "note": "身長が高い、建物が高い。"
  },
  "v_gen_299": {
    "mongolian": "өөр",
    "japanese": "別の、他の、違う",
    "pronunciation": "オール",
    "root": "",
    "pos": "代名詞・形容詞",
    "note": "Өөр юм байна уу? で「他に何かありますか？」。"
  },
  "v_gen_300": {
    "mongolian": "өөрийгөө танилцуул(ах)",
    "japanese": "自己紹介する",
    "pronunciation": "オーリーゴー タニルツォーラハ",
    "root": "танилцуул",
    "pos": "動詞句",
    "note": "өөрийгөө（自分自身を）＋ танилцуулах（紹介する）。"
  },
  "v_gen_301": {
    "mongolian": "өргөн",
    "japanese": "広い、幅が広い",
    "pronunciation": "オルゴン",
    "root": "",
    "pos": "形容詞",
    "note": "道路や川の幅が広い。"
  },
  "v_gen_302": {
    "mongolian": "өрөө",
    "japanese": "部屋、室",
    "pronunciation": "オロー",
    "root": "",
    "pos": "名詞",
    "note": "миний өрөө（私の部屋）。"
  },
  "v_gen_318": {
    "mongolian": "соёл",
    "japanese": "文化",
    "pronunciation": "ソヨル",
    "root": "",
    "pos": "名詞",
    "note": "Монголын соёл（モンゴルの文化）。"
  },
  "v_gen_319": {
    "mongolian": "соли(х), соль",
    "japanese": "交換する、取り替える、両替する",
    "pronunciation": "ソリホ、ソリ",
    "root": "соль",
    "pos": "動詞",
    "note": "語幹: соль。お金の両替や服の着替えなど。"
  },
  "v_gen_320": {
    "mongolian": "Солонгос",
    "japanese": "韓国、韓国人",
    "pronunciation": "ソロンゴス",
    "root": "",
    "pos": "固有名詞",
    "note": "Солонгос улс（大韓民国）。"
  },
  "v_gen_322": {
    "mongolian": "сонин хачин",
    "japanese": "珍しいこと、変わったこと、近況",
    "pronunciation": "ソニン ハチン",
    "root": "",
    "pos": "連語・句",
    "note": "「何か新しいこと・変わったことはある？」の挨拶。"
  },
  "v_gen_323": {
    "mongolian": "сонирхолтой",
    "japanese": "面白い、興味深い",
    "pronunciation": "ソニルホルトイ",
    "root": "",
    "pos": "形容詞",
    "note": "сонирхол（興味・関心）＋ -той（〜がある）。"
  },
  "v_gen_324": {
    "mongolian": "сонс(ох)",
    "japanese": "聞く、耳を傾ける",
    "pronunciation": "ソンソホ",
    "root": "сонс",
    "pos": "動詞",
    "note": "語幹: сонс。хөгжим сонсох（音楽を聞く）。"
  },
  "v_gen_325": {
    "mongolian": "соруул",
    "japanese": "ストロー、吸い口",
    "pronunciation": "ソルール",
    "root": "",
    "pos": "名詞",
    "note": "飲み物を飲むストロー。"
  },
  "v_gen_326": {
    "mongolian": "спорт",
    "japanese": "スポーツ",
    "pronunciation": "スポルト",
    "root": "",
    "pos": "名詞",
    "note": "外来語。"
  },
  "v_gen_327": {
    "mongolian": "сувилагч",
    "japanese": "看護師、看護婦",
    "pronunciation": "スウィラグチ",
    "root": "",
    "pos": "名詞",
    "note": "сувилах（看病する）＋ -гч（〜する人）。"
  },
  "v_gen_328": {
    "mongolian": "сул өрөө",
    "japanese": "空き部屋、空室",
    "pronunciation": "スル オロー",
    "root": "",
    "pos": "連語・句",
    "note": "сул（空いている）＋ өрөө（部屋）。ホテル等で使う。"
  },
  "v_gen_329": {
    "mongolian": "сул суудал",
    "japanese": "空席、空いている席",
    "pronunciation": "スル スーダル",
    "root": "",
    "pos": "連語・句",
    "note": "сул（空いている）＋ суудал（座席）。バスや飛行機で使う。"
  },
  "v_gen_330": {
    "mongolian": "сум",
    "japanese": "ソム（郡）、矢",
    "pronunciation": "スム",
    "root": "",
    "pos": "名詞",
    "note": "モンゴルの県（аймаг）の下の行政区画。"
  },
  "v_gen_331": {
    "mongolian": "сур(ах)",
    "japanese": "学ぶ、習う、覚える",
    "pronunciation": "スラハ",
    "root": "сур",
    "pos": "動詞",
    "note": "語幹: сур。монгол хэл сурах（モンゴル語を学ぶ）。"
  },
  "v_gen_332": {
    "mongolian": "сурагч",
    "japanese": "生徒、児童（小・中・高校生）",
    "pronunciation": "スラガチ",
    "root": "",
    "pos": "名詞",
    "note": "大学生は оюутан。"
  },
  "v_gen_333": {
    "mongolian": "сурах бичиг",
    "japanese": "教科書、テキスト",
    "pronunciation": "スラハ ビチグ",
    "root": "",
    "pos": "名詞",
    "note": "学習用の書籍。"
  },
  "v_gen_334": {
    "mongolian": "сургалтад суу(х)",
    "japanese": "研修・授業に出席する、受講する",
    "pronunciation": "スルガルタド スーハ",
    "root": "суу",
    "pos": "動詞句",
    "note": "сургалт（研修）＋ 与位格 -ад ＋ суух（座る/受ける）。"
  },
  "v_gen_335": {
    "mongolian": "сургалтгүй үед",
    "japanese": "研修・授業がない時",
    "pronunciation": "スルガルトグイ ウェド",
    "root": "",
    "pos": "連語・句",
    "note": "сургалт（研修）＋ -гүй（ない）＋ үед（時に）。"
  },
  "v_gen_337": {
    "mongolian": "суу(х)",
    "japanese": "座る、住む、（乗り物に）乗る",
    "pronunciation": "スーハ",
    "root": "суу",
    "pos": "動詞",
    "note": "語幹: суу。椅子に座る、町に住む、バスに乗る多義語。"
  },
  "v_gen_338": {
    "mongolian": "сүү",
    "japanese": "牛乳、ミルク",
    "pronunciation": "スー",
    "root": "",
    "pos": "名詞",
    "note": "сүүтэй цай（ミルクティー）。"
  },
  "v_gen_339": {
    "mongolian": "сүүлийн",
    "japanese": "最後の、最近の",
    "pronunciation": "スーリーン",
    "root": "",
    "pos": "形容詞・連体形",
    "note": "сүүл（尾・最後）の属格形。"
  },
  "v_gen_340": {
    "mongolian": "Сүхбаатарын талбай",
    "japanese": "スフバートル広場",
    "pronunciation": "スフバータリーン タルバイ",
    "root": "",
    "pos": "固有名詞",
    "note": "ウランバートル中心部にある政府宮殿前の巨大広場。"
  },
  "v_gen_341": {
    "mongolian": "сэл(эх)",
    "japanese": "泳ぐ",
    "pronunciation": "セレヘ",
    "root": "сэл",
    "pos": "動詞",
    "note": "語幹: сэл。бассейнд сэлэх（プールで泳ぐ）。"
  },
  "v_gen_342": {
    "mongolian": "Сэлэнгэ аймаг",
    "japanese": "セレンゲ県",
    "pronunciation": "セレンゲ アイマグ",
    "root": "",
    "pos": "固有名詞",
    "note": "モンゴル北部、ロシア国境に接する農業が盛んな県。"
  },
  "v_gen_343": {
    "mongolian": "Сэргэлэн сум",
    "japanese": "セルゲレン郡",
    "pronunciation": "セルゲレン スム",
    "root": "",
    "pos": "固有名詞",
    "note": "トゥブ県にある郡。"
  },
  "v_gen_344": {
    "mongolian": "сэрээ",
    "japanese": "フォーク",
    "pronunciation": "セレー",
    "root": "",
    "pos": "名詞",
    "note": "食事に使うフォーク。"
  },
  "v_gen_356": {
    "mongolian": "тамхи тат(ах)",
    "japanese": "タバコを吸う",
    "pronunciation": "タムヒ タタハ",
    "root": "тат",
    "pos": "動詞句",
    "note": "тамхи（煙草）＋ татах（引く・吸う）。"
  },
  "v_gen_357": {
    "mongolian": "тамхины цэг",
    "japanese": "喫煙所、喫煙スペース",
    "pronunciation": "タムヒニー ツェグ",
    "root": "",
    "pos": "連語・句",
    "note": "тамхи（煙草）の属格 ＋ цэг（点・場所）。"
  },
  "v_gen_358": {
    "mongolian": "танилцъя",
    "japanese": "はじめまして、知り合いになりましょう",
    "pronunciation": "タニルツィヤ",
    "root": "танилц",
    "pos": "表現・挨拶",
    "note": "初対面の挨拶で使われる。「知り合いになりましょう」。"
  },
  "v_gen_359": {
    "mongolian": "тасалбар",
    "japanese": "切符、チケット、入場券",
    "pronunciation": "タサルバル",
    "root": "",
    "pos": "名詞",
    "note": "バスや映画のチケット。"
  },
  "v_gen_360": {
    "mongolian": "тахиа",
    "japanese": "鶏、チキン",
    "pronunciation": "タヒヤ",
    "root": "",
    "pos": "名詞",
    "note": "動物のニワトリ、鶏肉。"
  },
  "v_gen_361": {
    "mongolian": "Тийм үү?",
    "japanese": "そうですか？、本当ですか？",
    "pronunciation": "ティームー",
    "root": "",
    "pos": "表現・挨拶",
    "note": "тийм（そうだ）＋ 疑問助詞 үү。"
  },
  "v_gen_362": {
    "mongolian": "тогло(х)",
    "japanese": "遊ぶ、（楽器を）演奏する、（スポーツを）する",
    "pronunciation": "トグロホ",
    "root": "тогло",
    "pos": "動詞",
    "note": "語幹: тогло。子供が遊ぶ、ピアノを弾く、サッカーをする。"
  },
  "v_gen_363": {
    "mongolian": "тоглоом",
    "japanese": "おもちゃ、玩具、ゲーム",
    "pronunciation": "トグローム",
    "root": "",
    "pos": "名詞",
    "note": "子供の玩具、ゲーム。"
  },
  "v_gen_364": {
    "mongolian": "Токио(г)",
    "japanese": "東京",
    "pronunciation": "トキオ",
    "root": "",
    "pos": "固有名詞",
    "note": "日本の首都。対格で Токиог となる。"
  },
  "v_gen_365": {
    "mongolian": "толгой",
    "japanese": "頭、頭部",
    "pronunciation": "トルゴイ",
    "root": "",
    "pos": "名詞",
    "note": "толгой өвдөх で「頭が痛い（頭痛）」。"
  },
  "v_gen_367": {
    "mongolian": "том",
    "japanese": "大きい、大型の",
    "pronunciation": "トム",
    "root": "",
    "pos": "形容詞",
    "note": "対義語は жижиг（小さい）。"
  },
  "v_gen_368": {
    "mongolian": "тор(н), уут(н)",
    "japanese": "ビニール袋、買い物袋、レジ袋",
    "pronunciation": "トル、ウート",
    "root": "",
    "pos": "名詞（隠れн）",
    "note": "スーパーのレジ袋。"
  },
  "v_gen_369": {
    "mongolian": "төв",
    "japanese": "中心、中央、センター",
    "pronunciation": "トブ",
    "root": "",
    "pos": "名詞",
    "note": "хотын төв（市内中心部）。"
  },
  "v_gen_370": {
    "mongolian": "Төв аймаг",
    "japanese": "トゥブ県（中央県）",
    "pronunciation": "トブ アイマグ",
    "root": "",
    "pos": "固有名詞",
    "note": "ウランバートルを取り囲む中央県。"
  },
  "v_gen_371": {
    "mongolian": "төгрөг",
    "japanese": "トゥグルグ（モンゴル通貨単位 MNT）",
    "pronunciation": "トグログ",
    "root": "",
    "pos": "名詞・助数詞",
    "note": "モンゴルの通貨単位（₮）。"
  },
  "v_gen_372": {
    "mongolian": "төгс(өх)",
    "japanese": "卒業する、完了する、終える",
    "pronunciation": "トグソホ",
    "root": "төгс",
    "pos": "動詞",
    "note": "語幹: төгс。их сургууль төгсөх（大学を卒業する）。"
  },
  "v_gen_373": {
    "mongolian": "төл(өх)",
    "japanese": "支払う、払う",
    "pronunciation": "トローホ",
    "root": "төл",
    "pos": "動詞",
    "note": "語幹: төл。мөнгө төлөх（お金を払う）。"
  },
  "v_gen_374": {
    "mongolian": "төмс(н)",
    "japanese": "ジャガイモ",
    "pronunciation": "トムス",
    "root": "",
    "pos": "名詞（隠れн）",
    "note": "モンゴル料理でよく使われる野菜。"
  },
  "v_gen_375": {
    "mongolian": "төр(өх)",
    "japanese": "生まれる、出産する",
    "pronunciation": "トロホ",
    "root": "төр",
    "pos": "動詞",
    "note": "語幹: төр。хүүхэд төрөх（子どもが生まれる）。"
  },
  "v_gen_376": {
    "mongolian": "төрсөн нутаг",
    "japanese": "生まれ故郷、出身地",
    "pronunciation": "トルソン ヌタグ",
    "root": "",
    "pos": "連語・句",
    "note": "төрсөн（生まれた）＋ нутаг（土地・故郷）。"
  },
  "v_gen_377": {
    "mongolian": "төрсөн өдөр",
    "japanese": "誕生日",
    "pronunciation": "トルソン オドル",
    "root": "",
    "pos": "連語・句",
    "note": "Төрсөн өдрийн баяр хүргэе! で「お誕生日おめでとう！」。"
  },
  "v_gen_378": {
    "mongolian": "тухай",
    "japanese": "〜について、〜に関して",
    "pronunciation": "トハイ",
    "root": "",
    "pos": "後置詞",
    "note": "属格支配（〜ын тухай で「〜について」）。"
  },
  "v_gen_379": {
    "mongolian": "түлхүүр",
    "japanese": "鍵、キー",
    "pronunciation": "トルフール",
    "root": "",
    "pos": "名詞",
    "note": "өрөөний түлхүүр（部屋の鍵）。"
  },
  "v_gen_380": {
    "mongolian": "түр ороод гар(ах)",
    "japanese": "ちょっと立ち寄る、一瞬入って出る",
    "pronunciation": "トゥル オロード ガラハ",
    "root": "гар",
    "pos": "動詞句",
    "note": "түр（しばらく/ちょっと）＋ ороод（入って）＋ гарах（出る）。"
  },
  "v_gen_381": {
    "mongolian": "түүхий загас(н)",
    "japanese": "生魚、刺身",
    "pronunciation": "トーフイ ザガス",
    "root": "",
    "pos": "連語・句",
    "note": "түүхий（生の）＋ загас（魚）。"
  },
  "v_gen_382": {
    "mongolian": "тэг(эх)",
    "japanese": "そうする、そのようにする",
    "pronunciation": "テゲヘ",
    "root": "тэг",
    "pos": "動詞",
    "note": "指示代動詞。「そうする」の意味。"
  },
  "v_gen_383": {
    "mongolian": "тэгвэл",
    "japanese": "それなら、そうしたら",
    "pronunciation": "テグウェル",
    "root": "",
    "pos": "接続詞",
    "note": "相手の発言を受けて「それなら〜」。"
  },
  "v_gen_384": {
    "mongolian": "тэгээд",
    "japanese": "そして、それから、それで",
    "pronunciation": "テゲード",
    "root": "",
    "pos": "接続詞",
    "note": "文をつなぐ接続詞。"
  },
  "v_gen_385": {
    "mongolian": "тэмцээн",
    "japanese": "試合、競技会、大会、コンテスト",
    "pronunciation": "テムツェーン",
    "root": "",
    "pos": "名詞",
    "note": "спортын тэмцээн（スポーツ大会）。"
  },
  "v_gen_386": {
    "mongolian": "тэмээ",
    "japanese": "ラクダ（駱駝）",
    "pronunciation": "テメー",
    "root": "",
    "pos": "名詞",
    "note": "モンゴル5大家畜（タヴァン・ホシュー・マル）の1つ。"
  },
  "v_gen_387": {
    "mongolian": "тэнгэр",
    "japanese": "空、天気、天",
    "pronunciation": "テンゲル",
    "root": "",
    "pos": "名詞",
    "note": "Цэлмэг тэнгэр（澄み渡った青空）。"
  },
  "v_gen_400": {
    "mongolian": "уржигдар",
    "japanese": "一昨日（おととい）",
    "pronunciation": "ウルジグダル",
    "root": "",
    "pos": "副詞・名詞",
    "note": "昨日の前日。"
  },
  "v_gen_401": {
    "mongolian": "усан бассейн",
    "japanese": "プール、水泳プール",
    "pronunciation": "ウサン バッセイン",
    "root": "",
    "pos": "名詞",
    "note": "水泳用のプール。"
  },
  "v_gen_402": {
    "mongolian": "усан онгоц(н)",
    "japanese": "船、船舶",
    "pronunciation": "ウサン オンゴツ",
    "root": "",
    "pos": "名詞（隠れн）",
    "note": "ус（水）＋ онгоц（乗り物・飛行機）。"
  },
  "v_gen_403": {
    "mongolian": "усанд ор(ох)",
    "japanese": "お風呂に入る、入浴する、シャワーを浴びる",
    "pronunciation": "ウサンド オロホ",
    "root": "ор",
    "pos": "動詞句",
    "note": "ус（水）の与位格 ＋ орох（入る）。"
  },
  "v_gen_404": {
    "mongolian": "утасны дугаар",
    "japanese": "電話番号",
    "pronunciation": "ウタスニー ドゥガール",
    "root": "",
    "pos": "連語・句",
    "note": "утас（電話）の属格 ＋ дугаар（番号）。"
  },
  "v_gen_405": {
    "mongolian": "утга",
    "japanese": "意味、意義、趣旨",
    "pronunciation": "ウトガ",
    "root": "",
    "pos": "名詞",
    "note": "үгийн утга（単語の意味）。"
  },
  "v_gen_406": {
    "mongolian": "утсаар яри(х), ярь",
    "japanese": "電話で話す、電話をかける",
    "pronunciation": "ウツァール ヤリハ",
    "root": "ярь",
    "pos": "動詞句",
    "note": "утас の造格 ＋ ярих（話す）。"
  },
  "v_gen_407": {
    "mongolian": "уу(х)",
    "japanese": "飲む",
    "pronunciation": "ウーハ",
    "root": "уу",
    "pos": "動詞",
    "note": "語幹: уу。цай уух（お茶を飲む）。"
  },
  "v_gen_408": {
    "mongolian": "уулз(ах)",
    "japanese": "会う",
    "pronunciation": "ウールザハ",
    "root": "уулз",
    "pos": "動詞",
    "note": "語幹: уулз。найзтайгаа уулзах（友達と会う／共格 -тай 支配）。"
  },
  "v_gen_409": {
    "mongolian": "уулзацгаая",
    "japanese": "（皆で）会いましょう",
    "pronunciation": "ウールザツガ―ヤ",
    "root": "уулз",
    "pos": "表現・挨拶",
    "note": "Дараа уулзацгаая で「また会いましょう」。"
  },
  "v_gen_420": {
    "mongolian": "үнэтэй юм аа",
    "japanese": "高いですねえ！",
    "pronunciation": "ウネテイ ユム アー",
    "root": "",
    "pos": "表現・感嘆",
    "note": "買い物で値段の高さに驚くときの感嘆表現。"
  },
  "v_gen_421": {
    "mongolian": "үсчин",
    "japanese": "美容師、理髪師、理容室",
    "pronunciation": "ウスチン",
    "root": "",
    "pos": "名詞",
    "note": "үс（髪）＋ -чин（専門職を表す接尾辞）。"
  },
  "v_gen_422": {
    "mongolian": "үсээ засуул(ах)",
    "japanese": "髪を切ってもらう、散髪する",
    "pronunciation": "ウセー ザスールハ",
    "root": "засуул",
    "pos": "動詞句",
    "note": "үсээ（自分の髪を）＋ засуулах（整えさせる・使役）。"
  },
  "v_gen_423": {
    "mongolian": "үүл(н)",
    "japanese": "雲",
    "pronunciation": "ウール",
    "root": "",
    "pos": "名詞（隠れн）",
    "note": "тэнгэрт үүл байна（空に雲がある）。"
  },
  "v_gen_424": {
    "mongolian": "үхэр",
    "japanese": "牛、ウシ",
    "pronunciation": "ウヘル",
    "root": "",
    "pos": "名詞",
    "note": "モンゴル5大家畜の1つ。牛肉は үхрийн мах。"
  },
  "v_gen_425": {
    "mongolian": "фитнес",
    "japanese": "フィットネス、スポーツジム",
    "pronunciation": "フィトネス",
    "root": "",
    "pos": "名詞",
    "note": "フィットネスクラブ。"
  },
  "v_gen_426": {
    "mongolian": "Франц",
    "japanese": "フランス、フランス人",
    "pronunciation": "フランツ",
    "root": "",
    "pos": "固有名詞",
    "note": "ヨーロッパの国。"
  },
  "v_gen_437": {
    "mongolian": "хайрцаг(н)",
    "japanese": "箱、ボックス",
    "pronunciation": "ハイリツァグ",
    "root": "",
    "pos": "名詞（隠れн）",
    "note": "荷物や小物を入れる箱。"
  },
  "v_gen_438": {
    "mongolian": "халуун",
    "japanese": "熱い、暑い、温かい",
    "pronunciation": "ハルーン",
    "root": "",
    "pos": "形容詞",
    "note": "気温が暑い、飲み物が熱い。"
  },
  "v_gen_439": {
    "mongolian": "халбага",
    "japanese": "スプーン",
    "pronunciation": "ハルバガ",
    "root": "",
    "pos": "名詞",
    "note": "スープや料理をすくうスプーン。"
  },
  "v_gen_440": {
    "mongolian": "халуун рашаан",
    "japanese": "温泉、鉱泉",
    "pronunciation": "ハルーン ラシャーン",
    "root": "",
    "pos": "連語・句",
    "note": "халуун（熱い）＋ рашаан（薬水・鉱泉・温泉）。"
  },
  "v_gen_441": {
    "mongolian": "халуунаа үз(эх)",
    "japanese": "熱を測る、体温を測る",
    "pronunciation": "ハルーナー ウゼヘ",
    "root": "үз",
    "pos": "動詞句",
    "note": "халуунаа（自分の熱を）＋ үзэх（診る・測る）。"
  },
  "v_gen_442": {
    "mongolian": "халуур(ах)",
    "japanese": "熱が出る、発熱する",
    "pronunciation": "ハルールハ",
    "root": "халуур",
    "pos": "動詞",
    "note": "語幹: халуур。風邪等で熱が出る。"
  },
  "v_gen_443": {
    "mongolian": "халууц(ах)",
    "japanese": "暑がる、暑く感じる",
    "pronunciation": "ハルーツァハ",
    "root": "халууц",
    "pos": "動詞",
    "note": "語幹: халууц。夏の暑さで参る。"
  },
  "v_gen_444": {
    "mongolian": "хамгийн",
    "japanese": "最も、一番、最高の",
    "pronunciation": "ハムギーン",
    "root": "",
    "pos": "副詞",
    "note": "最上級を作る。「一番〜」は хамгийн + 形容詞。"
  },
  "v_gen_446": {
    "mongolian": "хана(н)",
    "japanese": "壁",
    "pronunciation": "ハナ",
    "root": "",
    "pos": "名詞（隠れн）",
    "note": "ゲルの壁（ハナ）や建物の壁。"
  },
  "v_gen_447": {
    "mongolian": "ханиад хүр(эх)",
    "japanese": "風邪をひく",
    "pronunciation": "ハニャード フレヘ",
    "root": "хүр",
    "pos": "動詞句",
    "note": "ханиад（風邪）＋ хүрэх（達する・かかる）。"
  },
  "v_gen_448": {
    "mongolian": "хар",
    "japanese": "黒い、黒色",
    "pronunciation": "ハル",
    "root": "",
    "pos": "形容詞",
    "note": "対義語は цагаан（白い）。"
  },
  "v_gen_449": {
    "mongolian": "харагд(ах)",
    "japanese": "見える",
    "pronunciation": "ハラグダハ",
    "root": "харагд",
    "pos": "動詞（受動・可能）",
    "note": "語幹: харагд。харах（見る）の受動形。自然と目に入る。"
  },
  "v_gen_451": {
    "mongolian": "харанхуй",
    "japanese": "暗い、闇",
    "pronunciation": "ハランホイ",
    "root": "",
    "pos": "形容詞",
    "note": "夜や部屋の中が暗い。"
  },
  "v_gen_452": {
    "mongolian": "хари(х)",
    "japanese": "（自分の家・本国へ）帰る",
    "pronunciation": "ハリハ",
    "root": "харь",
    "pos": "動詞",
    "note": "語幹: харь。гэртээ харих（家に帰る）。"
  },
  "v_gen_454": {
    "mongolian": "харин",
    "japanese": "しかし、一方で、逆に",
    "pronunciation": "ハリン",
    "root": "",
    "pos": "接続詞",
    "note": "対比を表す接続詞。"
  },
  "v_gen_455": {
    "mongolian": "харшил хөдлө(х), хөдөл",
    "japanese": "アレルギーが出る、発症する",
    "pronunciation": "ハルシル ホドロホ",
    "root": "хөдөл",
    "pos": "動詞句",
    "note": "харшил（アレルギー）＋ хөдлөх（動く・発症する）。"
  },
  "v_gen_456": {
    "mongolian": "хасах 30 хэм",
    "japanese": "マイナス30度（氷点下30℃）",
    "pronunciation": "ハサハ ゴチン ヘム",
    "root": "",
    "pos": "連語・句",
    "note": "хасах（引く・マイナス）＋ 30 ＋ хэм（度）。"
  },
  "v_gen_457": {
    "mongolian": "хий(х)",
    "japanese": "する、行う、作る、入れる",
    "pronunciation": "ヒーハ",
    "root": "хий",
    "pos": "動詞",
    "note": "語幹: хий。英語の do / make にあたる重要動詞。"
  },
  "v_gen_458": {
    "mongolian": "хичээл",
    "japanese": "授業、レッスン、学習",
    "pronunciation": "ヒチェール",
    "root": "",
    "pos": "名詞",
    "note": "хичээл хийх（勉強する）。"
  },
  "v_gen_459": {
    "mongolian": "хоёрдахь өдөр",
    "japanese": "火曜日（週の2日目）",
    "pronunciation": "ホヨルダヒ オドル",
    "root": "",
    "pos": "連語・名詞",
    "note": "口語でよく使われる火曜日の言い方。"
  },
  "v_gen_460": {
    "mongolian": "хол",
    "japanese": "遠い、遥かな",
    "pronunciation": "ホル",
    "root": "",
    "pos": "形容詞",
    "note": "対義語は ойрхон（近い）。"
  },
  "v_gen_461": {
    "mongolian": "хоног",
    "japanese": "24時間、日（宿泊日数など）",
    "pronunciation": "ホノグ",
    "root": "",
    "pos": "名詞・助数詞",
    "note": "нэг хоног（一昼夜／1泊）。"
  },
  "v_gen_462": {
    "mongolian": "хоно(х)",
    "japanese": "泊まる、宿泊する、夜を明かす",
    "pronunciation": "ホノホ",
    "root": "хоно",
    "pos": "動詞",
    "note": "語幹: хоно。ホテルや遊牧民のゲルに泊まる。"
  },
  "v_gen_463": {
    "mongolian": "хонь(н)",
    "japanese": "羊",
    "pronunciation": "ホニ",
    "root": "",
    "pos": "名詞（隠れн）",
    "note": "モンゴル5大家畜の筆頭。羊肉は хонины мах。"
  },
  "v_gen_465": {
    "mongolian": "хоолны цэс, меню(н)",
    "japanese": "メニュー、献立表",
    "pronunciation": "ホールニー ツェス、メニュー",
    "root": "",
    "pos": "名詞",
    "note": "レストランで注文するときに見るメニュー。"
  },
  "v_gen_466": {
    "mongolian": "хоолой",
    "japanese": "喉、声",
    "pronunciation": "ホーロイ",
    "root": "",
    "pos": "名詞",
    "note": "хоолой өвдөх で「喉が痛い」。"
  },
  "v_gen_467": {
    "mongolian": "хоолойгоо зайл(ах)",
    "japanese": "うがいをする",
    "pronunciation": "ホーロイゴー ザイラハ",
    "root": "зайл",
    "pos": "動詞句",
    "note": "хоолой（喉）＋ -гоо（再帰対格）＋ зайлах（すすぐ）。"
  },
  "v_gen_468": {
    "mongolian": "хоолоор дайл(ах)",
    "japanese": "食事をごちそうする、もてなす",
    "pronunciation": "ホオロール ダイルハ",
    "root": "дайл",
    "pos": "動詞句",
    "note": "хоол（料理）の造格 ＋ дайлах（もてなす・ごちそうする）。"
  },
  "v_gen_469": {
    "mongolian": "хот",
    "japanese": "都市、町、市",
    "pronunciation": "ホト",
    "root": "",
    "pos": "名詞",
    "note": "Улаанбаатар хот（ウランバートル市）。"
  },
  "v_gen_470": {
    "mongolian": "хотын захиргаа",
    "japanese": "市役所、市庁舎",
    "pronunciation": "ホティーン ザヒルガー",
    "root": "",
    "pos": "名詞",
    "note": "都市の行政庁舎。"
  },
  "v_gen_471": {
    "mongolian": "хөгжилтэй",
    "japanese": "楽しい、陽気な、面白い",
    "pronunciation": "ホグジルトイ",
    "root": "",
    "pos": "形容詞",
    "note": "性格が陽気な、雰囲気が楽しい。"
  },
  "v_gen_472": {
    "mongolian": "хөгжим",
    "japanese": "音楽",
    "pronunciation": "ホグジム",
    "root": "",
    "pos": "名詞",
    "note": "хөгжим сонсох（音楽を聞く）。"
  },
  "v_gen_473": {
    "mongolian": "хөдөө(н)",
    "japanese": "田舎、地方、草原",
    "pronunciation": "ホドー",
    "root": "",
    "pos": "名詞（隠れн）",
    "note": "ウランバートル以外の地方・遊牧地帯全般を指す。"
  },
  "v_gen_474": {
    "mongolian": "хөл бөмбөг",
    "japanese": "サッカー",
    "pronunciation": "ホル ボンボグ",
    "root": "",
    "pos": "名詞",
    "note": "хөл（足）＋ бөмбөг（ボール）。"
  },
  "v_gen_475": {
    "mongolian": "хувцас соли(х), соль",
    "japanese": "服を着替える",
    "pronunciation": "フブツァス ソリハ",
    "root": "соль",
    "pos": "動詞句",
    "note": "хувцас（服）＋ солих（変える）。"
  },
  "v_gen_476": {
    "mongolian": "хувцас(н)",
    "japanese": "服、衣服",
    "pronunciation": "フブツァス",
    "root": "",
    "pos": "名詞（隠れн）",
    "note": "着る服全般。"
  },
  "v_gen_477": {
    "mongolian": "худалдагч",
    "japanese": "店員、売り手、販売員",
    "pronunciation": "フダルダグチ",
    "root": "",
    "pos": "名詞",
    "note": "お店の販売員。"
  },
  "v_gen_478": {
    "mongolian": "худалд(ах)",
    "japanese": "売る、販売する",
    "pronunciation": "フダルダハ",
    "root": "худалд",
    "pos": "動詞",
    "note": "語幹: худалд。商品を売る。"
  },
  "v_gen_479": {
    "mongolian": "хурал",
    "japanese": "会議、ミーティング",
    "pronunciation": "フラル",
    "root": "",
    "pos": "名詞",
    "note": "Улсын Их Хурал（国会）。"
  },
  "v_gen_480": {
    "mongolian": "хурдан",
    "japanese": "速い、早く",
    "pronunciation": "フルダン",
    "root": "",
    "pos": "形容詞・副詞",
    "note": "スピードが速い。"
  },
  "v_gen_481": {
    "mongolian": "хурдан эдгээрэй",
    "japanese": "早く良くなってね、お大事に",
    "pronunciation": "フルダン エドゲーレイ",
    "root": "эдгэ",
    "pos": "表現・挨拶",
    "note": "病気の人を見舞う時の定番のお見舞い言葉。"
  },
  "v_gen_482": {
    "mongolian": "хурлын танхим",
    "japanese": "会議室、大会議場",
    "pronunciation": "フルリーン タンヒム",
    "root": "",
    "pos": "名詞",
    "note": "хурал（会議）の属格 ＋ танхим（ホール・室）。"
  },
  "v_gen_483": {
    "mongolian": "хутга(н)",
    "japanese": "ナイフ、包丁",
    "pronunciation": "フタガ",
    "root": "",
    "pos": "名詞（隠れн）",
    "note": "調理や食事に使うナイフ。"
  },
  "v_gen_484": {
    "mongolian": "хуудас",
    "japanese": "ページ、用紙",
    "pronunciation": "フータス",
    "root": "",
    "pos": "名詞",
    "note": "本やノートのページ。"
  },
  "v_gen_485": {
    "mongolian": "хуушуур",
    "japanese": "ホーショール（揚げ肉パイ）",
    "pronunciation": "ホーショール",
    "root": "",
    "pos": "名詞",
    "note": "ナダム祭などで欠かせないモンゴル伝統の平たい揚げミートパイ。"
  },
  "v_gen_486": {
    "mongolian": "хүйтрэ(х), хүйтэр",
    "japanese": "寒くなる、冷え込む",
    "pronunciation": "フイトレヘ",
    "root": "хүйтэр",
    "pos": "動詞",
    "note": "語幹: хүйтэр。気温が下がる。"
  },
  "v_gen_488": {
    "mongolian": "хүлээ(х)",
    "japanese": "待つ",
    "pronunciation": "フレ―ハ",
    "root": "хүлээ",
    "pos": "動詞",
    "note": "語幹: хүлээ。Түр хүлээнэ үү（少々お待ちください）。"
  },
  "v_gen_489": {
    "mongolian": "хүн ам",
    "japanese": "人口",
    "pronunciation": "フン アム",
    "root": "",
    "pos": "名詞",
    "note": "国の人口。"
  },
  "v_gen_490": {
    "mongolian": "хүндрэ(х), хүндэр",
    "japanese": "重症化する、複雑になる、（大便をする）",
    "pronunciation": "フンドレヘ",
    "root": "хүндэр",
    "pos": "動詞",
    "note": "病気が重くなる、事態が難しくなる。"
  },
  "v_gen_491": {
    "mongolian": "хүнс(н)",
    "japanese": "食料品、食品",
    "pronunciation": "フンス",
    "root": "",
    "pos": "名詞（隠れн）",
    "note": "食材、日持ちする食品。"
  },
  "v_gen_492": {
    "mongolian": "хүнсний дэлгүүр",
    "japanese": "食料品店、スーパーマーケット",
    "pronunciation": "フンスニー デレグール",
    "root": "",
    "pos": "名詞",
    "note": "食料品を売るお店。"
  },
  "v_gen_493": {
    "mongolian": "хүртэл",
    "japanese": "〜まで",
    "pronunciation": "フルテル",
    "root": "",
    "pos": "後置詞",
    "note": "時間や場所の到達点を表す（〜から〜まで: -аас ... хүртэл）。"
  },
  "v_gen_494": {
    "mongolian": "хүс(эх)",
    "japanese": "望む、願う、欲する",
    "pronunciation": "フセヘ",
    "root": "хүс",
    "pos": "動詞",
    "note": "語幹: хүс。希望を表す動詞。"
  },
  "v_gen_495": {
    "mongolian": "хүү(г)",
    "japanese": "息子、男の子",
    "pronunciation": "フー",
    "root": "",
    "pos": "名詞（隠れг）",
    "note": "自分の息子、少年。"
  },
  "v_gen_496": {
    "mongolian": "Хүүхдийн баяр",
    "japanese": "子どもの日（6月1日）",
    "pronunciation": "フーヘディーン バヤル",
    "root": "",
    "pos": "祝日・記念日",
    "note": "モンゴルでは国民の祝日で盛大に祝われる。"
  },
  "v_gen_497": {
    "mongolian": "хүүхэд",
    "japanese": "子ども、児童",
    "pronunciation": "フーヘド",
    "root": "",
    "pos": "名詞",
    "note": "単数形（複数形は хүүхдүүд）。"
  },
  "v_gen_498": {
    "mongolian": "хэд",
    "japanese": "いくつ、何（数・時間・年齢）",
    "pronunciation": "ヘド",
    "root": "",
    "pos": "疑問詞",
    "note": "Хэдэн цаг вэ?（何時ですか？）。"
  },
  "v_gen_499": {
    "mongolian": "хэддэх өдөр",
    "japanese": "何曜日（口語）",
    "pronunciation": "ヘッデヒ オドル",
    "root": "",
    "pos": "疑問詞句",
    "note": "曜日を尋ねる日常会話の疑問表現。"
  },
  "v_gen_500": {
    "mongolian": "хэдүүлээ",
    "japanese": "何人で、皆で",
    "pronunciation": "ヘドゥーレー",
    "root": "",
    "pos": "疑問副詞",
    "note": "人数や集まりを表す集合数詞的表現。"
  },
  "v_gen_504": {
    "mongolian": "хэл(эх)",
    "japanese": "言う、話す、伝える",
    "pronunciation": "ヘレヘ",
    "root": "хэл",
    "pos": "動詞",
    "note": "語幹: хэл。何か言葉を口にする。"
  },
  "v_gen_505": {
    "mongolian": "хэм, градус",
    "japanese": "度、気温、度数",
    "pronunciation": "ヘム、グラドゥス",
    "root": "",
    "pos": "名詞・助数詞",
    "note": "気温やアルコール度数を表す。"
  },
  "v_gen_507": {
    "mongolian": "хэр зэрэг",
    "japanese": "どのくらい、どの程度",
    "pronunciation": "ヘル ゼレグ",
    "root": "",
    "pos": "疑問副詞",
    "note": "程度や量を尋ねる表現。"
  },
  "v_gen_508": {
    "mongolian": "хэрэв",
    "japanese": "もしも、もし〜なら",
    "pronunciation": "ヘレブ",
    "root": "",
    "pos": "接続詞",
    "note": "条件節（-вал/-вэл）を導く副詞。"
  },
  "v_gen_509": {
    "mongolian": "хэрэглэ(х)",
    "japanese": "使う、使用する、利用する",
    "pronunciation": "ヘレグレヘ",
    "root": "хэрэглэ",
    "pos": "動詞",
    "note": "語幹: хэрэглэ。道具や言葉を使う。"
  },
  "v_gen_510": {
    "mongolian": "хэрэгтэй",
    "japanese": "必要だ、〜すべきだ",
    "pronunciation": "ヘレグテイ",
    "root": "",
    "pos": "形容詞・述語",
    "note": "хэрэг（必要・用事）＋ -тэй。Надад хэрэгтэй（私には必要だ）。"
  },
  "v_gen_511": {
    "mongolian": "хэцүү",
    "japanese": "難しい、大変な、困難な",
    "pronunciation": "ヘツー",
    "root": "",
    "pos": "形容詞",
    "note": "対義語は амархан（簡単だ）。"
  },
  "v_gen_512": {
    "mongolian": "хямдра(х), хямдар",
    "japanese": "安くなる、値下がりする",
    "pronunciation": "ヒャムドラハ",
    "root": "хямдар",
    "pos": "動詞",
    "note": "語幹: хямдар。セールの値下がり。"
  },
  "v_gen_513": {
    "mongolian": "хямдруул(ах)",
    "japanese": "値引きする、安くする",
    "pronunciation": "ヒャムドルールハ",
    "root": "хямдруул",
    "pos": "動詞",
    "note": "語幹: хямдруул。店員に安くしてもらう時など。"
  },
  "v_gen_514": {
    "mongolian": "хямдхан",
    "japanese": "安い、手頃な",
    "pronunciation": "ヒャムドハン",
    "root": "",
    "pos": "形容詞",
    "note": "対義語は үнэтэй（高い）。"
  },
  "v_gen_515": {
    "mongolian": "Хятад",
    "japanese": "中国、中国人",
    "pronunciation": "ヒャタド",
    "root": "",
    "pos": "固有名詞",
    "note": "モンゴルの南に隣接する国。"
  },
  "v_gen_527": {
    "mongolian": "цайны газар",
    "japanese": "食堂、カフェ、軽食堂",
    "pronunciation": "ツァイニー ガザル",
    "root": "",
    "pos": "名詞",
    "note": "庶民的なモンゴル料理食堂。"
  },
  "v_gen_528": {
    "mongolian": "цанга(х)",
    "japanese": "喉が渇く",
    "pronunciation": "ツァンガハ",
    "root": "цанга",
    "pos": "動詞",
    "note": "語幹: цанга。Би цангаж байна（喉が渇いています）。"
  },
  "v_gen_529": {
    "mongolian": "цас(н)",
    "japanese": "雪",
    "pronunciation": "ツァス",
    "root": "",
    "pos": "名詞（隠れн）",
    "note": "цас орох（雪が降る）。"
  },
  "v_gen_530": {
    "mongolian": "цонх(н)",
    "japanese": "窓",
    "pronunciation": "ツォンホ",
    "root": "",
    "pos": "名詞（隠れн）",
    "note": "цонх онгойлгох（窓を開ける）。"
  },
  "v_gen_532": {
    "mongolian": "цэвэрлэ(х)",
    "japanese": "掃除する、綺麗にする",
    "pronunciation": "ツェウェルレヘ",
    "root": "цэвэрлэ",
    "pos": "動詞",
    "note": "語幹: цэвэрлэ。өрөө цэвэрлэх（部屋を掃除する）。"
  },
  "v_gen_533": {
    "mongolian": "цэвэрхэн",
    "japanese": "清潔な、綺麗な",
    "pronunciation": "ツェウェルヘン",
    "root": "",
    "pos": "形容詞",
    "note": "部屋や街が清潔で綺麗。"
  },
  "v_gen_534": {
    "mongolian": "цэлмэг",
    "japanese": "快晴の、晴れ渡った",
    "pronunciation": "ツェルメグ",
    "root": "",
    "pos": "形容詞",
    "note": "цэлмэг өдөр（快晴の日）。"
  },
  "v_gen_535": {
    "mongolian": "цэцэг",
    "japanese": "花",
    "pronunciation": "ツェツェグ",
    "root": "",
    "pos": "名詞",
    "note": "綺麗な植物の花。"
  },
  "v_gen_536": {
    "mongolian": "цэцэглэ(х)",
    "japanese": "（花が）咲く、開花する",
    "pronunciation": "ツェツェグレヘ",
    "root": "цэцэглэ",
    "pos": "動詞",
    "note": "語幹: цэцэглэ。春に花が咲く。"
  },
  "v_gen_537": {
    "mongolian": "цэцэрлэгт хүрээлэн(г)",
    "japanese": "公園、庭園",
    "pronunciation": "ツェツェルレグト フーレーレン",
    "root": "",
    "pos": "名詞（隠れг）",
    "note": "木々やベンチのある憩いの公園。"
  },
  "v_gen_538": {
    "mongolian": "цээжл(эх)",
    "japanese": "暗記する、覚える",
    "pronunciation": "ツェージレヘ",
    "root": "цээжл",
    "pos": "動詞",
    "note": "語幹: цээжл。цээж（胸・記憶）から派生。単語を暗記する。"
  },
  "v_gen_554": {
    "mongolian": "шөнө",
    "japanese": "夜、夜間",
    "pronunciation": "ショノ",
    "root": "",
    "pos": "名詞",
    "note": "шөнийн 12 цаг（深夜0時）。"
  },
  "v_gen_555": {
    "mongolian": "шууд нислэг",
    "japanese": "直行便",
    "pronunciation": "シュード ニスレグ",
    "root": "",
    "pos": "名詞",
    "note": "乗り継ぎのないフライト。"
  },
  "v_gen_556": {
    "mongolian": "шуудан(г)",
    "japanese": "郵便、郵便局",
    "pronunciation": "シューダン",
    "root": "",
    "pos": "名詞（隠れг）",
    "note": "手紙や小包の郵便。"
  },
  "v_gen_557": {
    "mongolian": "шүд(н)",
    "japanese": "歯",
    "pronunciation": "シュド",
    "root": "",
    "pos": "名詞（隠れн）",
    "note": "шүд угаах（歯を磨く）。"
  },
  "v_gen_558": {
    "mongolian": "шүршүүр",
    "japanese": "シャワー",
    "pronunciation": "シュルシュール",
    "root": "",
    "pos": "名詞",
    "note": "浴室のシャワー設備。"
  },
  "v_gen_560": {
    "mongolian": "шүхэр",
    "japanese": "傘、パラシュート",
    "pronunciation": "シュヘル",
    "root": "",
    "pos": "名詞",
    "note": "雨や雪を防ぐ傘。"
  },
  "v_gen_573": {
    "mongolian": "энэ долоо хоног",
    "japanese": "今週",
    "pronunciation": "エネ ドロー ホノグ",
    "root": "",
    "pos": "連語・副詞句",
    "note": "энэ（この）＋ долоо хоног（1週間）。"
  },
  "v_gen_574": {
    "mongolian": "Эрдэнэт хот",
    "japanese": "エルデネット市",
    "pronunciation": "エルデネト ホト",
    "root": "",
    "pos": "固有名詞",
    "note": "世界有数の銅鉱山を擁するモンゴル第2の都市。"
  },
  "v_gen_575": {
    "mongolian": "эрт",
    "japanese": "早く、早い",
    "pronunciation": "エルト",
    "root": "",
    "pos": "副詞",
    "note": "эрт босох（早起きする）。"
  },
  "v_gen_576": {
    "mongolian": "эрүүл мэнд",
    "japanese": "健康、ヘルス",
    "pronunciation": "エルール メンド",
    "root": "",
    "pos": "名詞",
    "note": "Эрүүл мэндийн яам（保健省）。"
  },
  "v_gen_577": {
    "mongolian": "эрэгтэй",
    "japanese": "男の、男性の",
    "pronunciation": "エレグテイ",
    "root": "",
    "pos": "名詞・形容詞",
    "note": "эрэгтэй хүн（男の人）。"
  },
  "v_gen_578": {
    "mongolian": "эсвэл",
    "japanese": "または、あるいは",
    "pronunciation": "エスウェル",
    "root": "",
    "pos": "接続詞",
    "note": "選択を表す接続詞。"
  },
  "v_gen_579": {
    "mongolian": "эхлэ(х), эхэл",
    "japanese": "始まる、始める",
    "pronunciation": "エフレヘ、エヘル",
    "root": "эхэл",
    "pos": "動詞",
    "note": "語幹: эхэл。хичээл эхлэх（授業が始まる）。"
  },
  "v_gen_580": {
    "mongolian": "эхлээд",
    "japanese": "まず、はじめに",
    "pronunciation": "エフレード",
    "root": "",
    "pos": "副詞",
    "note": "順序を表す副詞。"
  },
  "v_gen_581": {
    "mongolian": "эхнэр",
    "japanese": "妻、奥さん",
    "pronunciation": "エフネル",
    "root": "",
    "pos": "名詞",
    "note": "配偶者の女性。"
  },
  "v_gen_582": {
    "mongolian": "ээж",
    "japanese": "お母さん、母",
    "pronunciation": "エージ",
    "root": "",
    "pos": "名詞",
    "note": "親愛を込めた母親の呼び方。"
  },
  "v_gen_598": {
    "mongolian": "ямар",
    "japanese": "どんな、どのような",
    "pronunciation": "ヤマル",
    "root": "",
    "pos": "疑問詞",
    "note": "性質や種類を尋ねる疑問詞。"
  },
  "v_gen_599": {
    "mongolian": "ямар гараг",
    "japanese": "何曜日（正式・暦）",
    "pronunciation": "ヤマル ガラグ",
    "root": "",
    "pos": "疑問表現",
    "note": "曜日の尋ね方。"
  },
  "v_gen_600": {
    "mongolian": "ямар нэг",
    "japanese": "何かしらの、ある〜",
    "pronunciation": "ヤマル ネグ",
    "root": "",
    "pos": "連体詞",
    "note": "不特定の対象を表す。"
  },
  "v_gen_601": {
    "mongolian": "ямар үнэтэй",
    "japanese": "どのくらいの値段、いくらの価格",
    "pronunciation": "ヤマル ウネテイ",
    "root": "",
    "pos": "疑問表現",
    "note": "価格を尋ねる。"
  },
  "v_gen_602": {
    "mongolian": "янз бүрийн",
    "japanese": "さまざまな、色々な、多種多様な",
    "pronunciation": "ヤンズ ブリーン",
    "root": "",
    "pos": "連体詞",
    "note": "様々な種類の。"
  },
  "v_gen_603": {
    "mongolian": "Япон",
    "japanese": "日本、日本人",
    "pronunciation": "ヤポン",
    "root": "",
    "pos": "固有名詞",
    "note": "Япон улс（日本国）。"
  },
  "v_gen_604": {
    "mongolian": "яри(х), ярь",
    "japanese": "話す、会話する、語る",
    "pronunciation": "ヤリハ、ヤリ",
    "root": "ярь",
    "pos": "動詞",
    "note": "語幹: ярь。монголоор ярих（モンゴル語で話す）。"
  },
  "v_gen_609": {
    "mongolian": "цаас",
    "japanese": "紙",
    "pronunciation": "ツァース",
    "root": "",
    "pos": "名詞",
    "note": "ノートや書類の紙。"
  },
  "v_gen_614": {
    "mongolian": "мөнгө",
    "japanese": "お金、銀",
    "pronunciation": "モンゴ",
    "root": "",
    "pos": "名詞",
    "note": "通貨・銀。"
  },
  "v_gen_619": {
    "mongolian": "оймс",
    "japanese": "靴下、ソックス",
    "pronunciation": "オイムス",
    "root": "",
    "pos": "名詞",
    "note": "足に履く靴下。"
  },
  "v_gen_620": {
    "mongolian": "ус",
    "japanese": "水",
    "pronunciation": "ウス",
    "root": "",
    "pos": "名詞",
    "note": "飲料水、水。"
  },
  "v_gen_622": {
    "mongolian": "цай",
    "japanese": "お茶、スーテーツァイ",
    "pronunciation": "ツァイ",
    "root": "",
    "pos": "名詞",
    "note": "モンゴルの伝統的な塩入りミルクティー。"
  },
  "v_gen_624": {
    "mongolian": "архи",
    "japanese": "ウォッカ、酒",
    "pronunciation": "アルヒ",
    "root": "",
    "pos": "名詞",
    "note": "アルコール度数の高いモンゴルの伝統的酒類。"
  },
  "v_gen_625": {
    "mongolian": "ногоо",
    "japanese": "野菜、緑",
    "pronunciation": "ノゴー",
    "root": "",
    "pos": "名詞",
    "note": "野菜全般。"
  },
  "v_gen_626": {
    "mongolian": "боов",
    "japanese": "ボーブ（モンゴル伝統の揚げ菓子・パン）",
    "pronunciation": "ボーブ",
    "root": "",
    "pos": "名詞",
    "note": "お正月（ツァガーンサル）等で積み上げる伝統菓子。"
  },
  "v_gen_627": {
    "mongolian": "өндөг",
    "japanese": "卵、たまご",
    "pronunciation": "オンドグ",
    "root": "",
    "pos": "名詞",
    "note": "鶏などの卵。"
  },
  "v_gen_628": {
    "mongolian": "будаа",
    "japanese": "米、ご飯、穀物",
    "pronunciation": "ブダー",
    "root": "",
    "pos": "名詞",
    "note": "主食のお米、麦などの穀物。"
  },
  "v_gen_630": {
    "mongolian": "гуанз",
    "japanese": "食堂、軽食堂、大衆食堂",
    "pronunciation": "グアンズ",
    "root": "",
    "pos": "名詞",
    "note": "手頃な価格で食事ができる食堂。"
  },
  "v_gen_631": {
    "mongolian": "морь",
    "japanese": "馬",
    "pronunciation": "モリ",
    "root": "",
    "pos": "名詞",
    "note": "モンゴルのシンボル、5大家畜の1つ。"
  },
  "v_gen_632": {
    "mongolian": "хонь",
    "japanese": "羊",
    "pronunciation": "ホニ",
    "root": "",
    "pos": "名詞",
    "note": "遊牧民の大切な家畜。"
  },
  "v_gen_634": {
    "mongolian": "ямаа",
    "japanese": "山羊、ヤギ",
    "pronunciation": "ヤマ―",
    "root": "",
    "pos": "名詞",
    "note": "カシミヤの原料となる5大家畜の1つ。"
  },
  "v_gen_638": {
    "mongolian": "нохой",
    "japanese": "犬",
    "pronunciation": "ノホイ",
    "root": "",
    "pos": "名詞",
    "note": "番犬（Банхарなど）。Нохой хорь! で「犬を押さえて！」。"
  },
  "v_gen_643": {
    "mongolian": "өчигдөр",
    "japanese": "昨日（きのう）",
    "pronunciation": "オチグドル",
    "root": "",
    "pos": "副詞・名詞",
    "note": "昨日の意味。"
  },
  "v_gen_649": {
    "mongolian": "үдээс өмнө",
    "japanese": "午前、お昼前",
    "pronunciation": "ウデース オムノ",
    "root": "",
    "pos": "連語・副詞句",
    "note": "үд（正午）から өмнө（前）。"
  },
  "v_gen_654": {
    "mongolian": "дөрөвдэхь өдөр",
    "japanese": "木曜日（週の4日目）",
    "pronunciation": "ドロブダヒ オドル",
    "root": "",
    "pos": "連語・名詞",
    "note": "口語表現の木曜日。"
  },
  "v_gen_661": {
    "mongolian": "эрэгтэй хүн",
    "japanese": "男の人、男性",
    "pronunciation": "エレグテイ フン",
    "root": "",
    "pos": "連語・句",
    "note": "男性全般。"
  },
  "v_gen_662": {
    "mongolian": "эмэгтэй хүн",
    "japanese": "女の人、女性",
    "pronunciation": "エメグテイ フン",
    "root": "",
    "pos": "連語・句",
    "note": "女性全般。"
  },
  "v_gen_664": {
    "mongolian": "оюутан",
    "japanese": "大学生、専門学校生",
    "pronunciation": "オユータン",
    "root": "",
    "pos": "名詞",
    "note": "高等教育機関で学ぶ学生。"
  },
  "v_gen_668": {
    "mongolian": "шуудан",
    "japanese": "郵便、郵便局",
    "pronunciation": "シューダン",
    "root": "",
    "pos": "名詞",
    "note": "郵便局・便り。"
  },
  "v_gen_674": {
    "mongolian": "автобус",
    "japanese": "バス",
    "pronunciation": "アフドブス",
    "root": "",
    "pos": "名詞",
    "note": "公共路線バス。"
  },
  "v_gen_675": {
    "mongolian": "галт тэрэг",
    "japanese": "列車、汽車、電車",
    "pronunciation": "ガルト テレグ",
    "root": "",
    "pos": "名詞",
    "note": "галт（火の）＋ тэрэг（車輪・荷車）。モンゴル縦断鉄道。"
  },
  "v_gen_676": {
    "mongolian": "онгоц",
    "japanese": "飛行機、乗り物",
    "pronunciation": "オンゴツ",
    "root": "",
    "pos": "名詞",
    "note": "航空機。"
  },
  "v_gen_677": {
    "mongolian": "Монгол улс",
    "japanese": "モンゴル国",
    "pronunciation": "モンゴル ウルス",
    "root": "",
    "pos": "固有名詞",
    "note": "モンゴル国の正式名称。"
  },
  "v_gen_678": {
    "mongolian": "Япон хэл",
    "japanese": "日本語",
    "pronunciation": "ヤポン ヘル",
    "root": "",
    "pos": "名詞",
    "note": "日本の言語。"
  },
  "v_gen_679": {
    "mongolian": "уул",
    "japanese": "山",
    "pronunciation": "ウール",
    "root": "",
    "pos": "名詞",
    "note": "自然の山、山岳。"
  },
  "v_gen_680": {
    "mongolian": "үүл",
    "japanese": "雲",
    "pronunciation": "ウール",
    "root": "",
    "pos": "名詞",
    "note": "空の雲。"
  },
  "v_gen_681": {
    "mongolian": "цас",
    "japanese": "雪",
    "pronunciation": "ツァス",
    "root": "",
    "pos": "名詞",
    "note": "空から降る雪。"
  },
  "v_gen_683": {
    "mongolian": "халуун",
    "japanese": "熱い、暑い",
    "pronunciation": "ハルーン",
    "root": "",
    "pos": "形容詞",
    "note": "温度・気温が高い。"
  },
  "v_gen_687": {
    "mongolian": "урт",
    "japanese": "長い",
    "pronunciation": "ウルト",
    "root": "",
    "pos": "形容詞",
    "note": "対義語は богино（短い）。"
  },
  "v_gen_688": {
    "mongolian": "богино",
    "japanese": "短い",
    "pronunciation": "ボギノ",
    "root": "",
    "pos": "形容詞",
    "note": "対義語は урт（長い）。"
  },
  "v_gen_691": {
    "mongolian": "сайн",
    "japanese": "良い、元気な、優れている",
    "pronunciation": "サイン",
    "root": "",
    "pos": "形容詞",
    "note": "Сайн байна уу?（こんにちは）の根幹。"
  },
  "v_gen_692": {
    "mongolian": "муу",
    "japanese": "悪い、劣っている、下手な",
    "pronunciation": "ムー",
    "root": "",
    "pos": "形容詞",
    "note": "対義語は сайн（良い）。"
  },
  "v_gen_693": {
    "mongolian": "сайхан",
    "japanese": "美しい、素晴らしい、素敵な",
    "pronunciation": "サイハン",
    "root": "",
    "pos": "形容詞",
    "note": "景色や天気が素晴らしい、美味しい。"
  },
  "v_gen_694": {
    "mongolian": "муухай",
    "japanese": "醜い、ひどい、不快な",
    "pronunciation": "ムーハイ",
    "root": "",
    "pos": "形容詞",
    "note": "対義語は сайхан（美しい）。"
  },
  "v_gen_696": {
    "mongolian": "амархан",
    "japanese": "簡単な、易しい",
    "pronunciation": "アマルハン",
    "root": "",
    "pos": "形容詞",
    "note": "対義語は хэцүү（難しい）。"
  },
  "v_gen_698": {
    "mongolian": "цагаан",
    "japanese": "白い、白色",
    "pronunciation": "ツァガーン",
    "root": "",
    "pos": "形容詞",
    "note": "Цагаан сар（白月・旧正月）。"
  },
  "v_gen_700": {
    "mongolian": "шар",
    "japanese": "黄色い、黄色",
    "pronunciation": "シャル",
    "root": "",
    "pos": "形容詞",
    "note": "色彩の黄色。"
  }
}

# Read existing vocabulary
vocab_path = 'js/data/initialVocabulary.js'
with open(vocab_path, 'r', encoding='utf-8') as f:
    text = f.read()

start = text.find('[')
end = text.rfind(']')
data = json.loads(text[start:end+1])

fixed_count = 0
for item in data:
    item_id = item.get('id')
    if item_id in FIXES:
        fix = FIXES[item_id]
        item['mongolian'] = fix.get('mongolian', item['mongolian'])
        item['japanese'] = fix['japanese']
        if fix.get('pronunciation'):
            item['pronunciation'] = fix['pronunciation']
        if fix.get('root') is not None:
            item['root'] = fix['root']
        if fix.get('pos'):
            item['pos'] = fix['pos']
        if fix.get('note'):
            item['note'] = fix['note']
        fixed_count += 1
    else:
        # Also check if any item still has the bad string
        j = item.get('japanese', '')
        if '（モンゴル語教科書語彙）' in j:
            print("WARNING: Unmapped item with placeholder:", item_id, item['mongolian'])

print(f"Applied fixes to {fixed_count} items!")

# Write back initialVocabulary.js
new_js = f"// JICAモンゴル語教科書 全単語完全網羅データ（全744語・完全日本語訳・語幹・発音付き）\nexport const initialVocabulary = {json.dumps(data, ensure_ascii=False, indent=2)};\n"
with open(vocab_path, 'w', encoding='utf-8') as f:
    f.write(new_js)

print("Saved js/data/initialVocabulary.js successfully!")
