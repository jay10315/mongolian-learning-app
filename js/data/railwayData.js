// モンゴル縦断鉄道（スフバートル〜ザミンウード 1,110km）すごろく旅データ
export const railwayStations = [
  {
    index: 0,
    id: 'sukhbaatar_st',
    nameMn: 'Сүхбаатар өртөө',
    nameJa: 'スフバートル駅',
    regionJa: 'セレンゲ県（ロシア国境・始発駅）',
    km: 0,
    icon: '🏛️',
    stamp: '🚩 スフバートル国境駅印',
    badgeColor: '#0284c7',
    desc: 'モンゴル縦断鉄道の北の玄関口。セレンゲ川の清流と針葉樹林に抱かれたロシア国境の歴史ある始発駅。'
  },
  {
    index: 1,
    id: 'darkhan_st',
    nameMn: 'Дархан өртөө',
    nameJa: 'ダルハン駅',
    regionJa: 'ダルハン・オール県（第3の都市・製鉄都市）',
    km: 125,
    icon: '🏭',
    stamp: '🛠️ ダルハン製鉄所駅印',
    badgeColor: '#0d9488',
    desc: 'モンゴル第3の近代都市。巨大な製鉄所と活気あふれる大学が集まる工業と学術の中心地。'
  },
  {
    index: 2,
    id: 'dzuunkharaa_st',
    nameMn: 'Зүүнхараа өртөө',
    nameJa: 'ズーンハラー駅',
    regionJa: 'セレンゲ県（ハラー川林業・農業の街）',
    km: 240,
    icon: '🌲',
    stamp: '🌲 ハラー川木立駅印',
    badgeColor: '#16a34a',
    desc: 'ハラー川の豊かな自然に恵まれた林業・製粉の街。爽やかな松林の風が車窓を吹き抜ける。'
  },
  {
    index: 3,
    id: 'baruunkharaa_st',
    nameMn: 'Баруунхараа өртөө',
    nameJa: 'バルーンハラー駅',
    regionJa: 'セレンゲ県（黄金の大穀倉地帯）',
    km: 310,
    icon: '🌾',
    stamp: '🌾 黄金の麦穂駅印',
    badgeColor: '#ca8a04',
    desc: '見渡す限りの広大な小麦畑が広がるモンゴルの大穀倉地帯。秋には大地一面が黄金色に輝く。'
  },
  {
    index: 4,
    id: 'ulaanbaatar_st',
    nameMn: 'Улаанбаатар өртөө',
    nameJa: 'ウランバートル中央駅',
    regionJa: '首都ウランバートル（旅の大拠点）',
    km: 410,
    icon: '🏙️',
    stamp: '🚂 UB中央駅ゴールド印',
    badgeColor: '#e11d48',
    desc: 'モンゴル最大の鉄道ターミナル。国際列車や全国からの旅客が行き交う活気と熱気に満ちた大拠点！'
  },
  {
    index: 5,
    id: 'bagakhangai_st',
    nameMn: 'Багахангай өртөө',
    nameJa: 'バガハンガイ駅',
    regionJa: 'ウランバートル郊外（鉱山鉄道分岐点）',
    km: 520,
    icon: '🔀',
    stamp: '⛏️ バガヌール分岐駅印',
    badgeColor: '#9333ea',
    desc: '露天掘りのバガヌール炭鉱へと延びる支線の分岐駅。ここから徐々にゴビ砂漠の気配が漂い始める。'
  },
  {
    index: 6,
    id: 'choir_st',
    nameMn: 'Чойр өртөө',
    nameJa: 'チョイル駅',
    regionJa: 'ゴビスンベル県（広大な乾燥ステップ）',
    km: 650,
    icon: '🦅',
    stamp: '🦅 ステップの蒼鷹駅印',
    badgeColor: '#4f46e5',
    desc: '果てしないステップ草原と乾燥地帯の境界駅。駅前広場には巨大な宇宙飛行士モニュメントがそびえ立つ。'
  },
  {
    index: 7,
    id: 'sainshand_st',
    nameMn: 'Сайншанд өртөө',
    nameJa: 'サインシャンド駅',
    regionJa: 'ドルノゴビ県（東ゴビ・シャンバラの聖地）',
    km: 880,
    icon: '🐫',
    stamp: '🐪 シャンバラ聖地駅印',
    badgeColor: '#ea580c',
    desc: '東ゴビ砂漠のオアシス都市。詩人高僧ダンザンラブジャーの聖地シャンバラエネルギーに満ちた神秘の街。'
  },
  {
    index: 8,
    id: 'orgon_st',
    nameMn: 'Өргөн өртөө',
    nameJa: 'オルゴン駅',
    regionJa: 'ドルノゴビ県（蛍石鉱山とゴビの荒野）',
    km: 990,
    icon: '💎',
    stamp: '💎 蛍石クリスタル駅印',
    badgeColor: '#0891b2',
    desc: '青白く輝く蛍石が採掘される荒野の駅。地平線の彼方まで広がる赤茶けた大地と低木の風景が圧巻。'
  },
  {
    index: 9,
    id: 'zamiinuud_st',
    nameMn: 'Замын-Үүд өртөө',
    nameJa: 'ザミンウード終着駅',
    regionJa: 'ドルノゴビ県（中国国境・全線走破のゴール！）',
    km: 1110,
    icon: '🏆',
    stamp: '👑 縦断鉄道走破王印',
    badgeColor: '#b45309',
    desc: 'モンゴル縦断鉄道1,110kmの感動の終着駅！中国エレンホトとの国境交易で24時間熱気あふれるシルクロードの要所。'
  }
];

export const railwayIncidents = [
  {
    icon: '🐑',
    title: '羊の大群が線路を横断！',
    desc: '草原から500頭の羊が線路に侵入！急ブレーキをかけて安全確保のため手前の駅までバックしました！'
  },
  {
    icon: '🌪️',
    title: '猛烈なゴビの砂嵐（ウラガン）！',
    desc: '突然の強風と砂嵐で視界ゼロ！安全運行のため、汽笛を鳴らしながら手前の駅へ引き返しました！'
  },
  {
    icon: '🔧',
    title: '機関車の蒸気圧が急上昇！',
    desc: 'ボイラー点検の警報が鳴り響く！大事をとって手前の駅の車庫まで後退してメンテナンス！'
  },
  {
    icon: '🐎',
    title: '野生馬の群れと接触回避！',
    desc: '疾走する馬たちが線路の真横に接近！急停止し、馬が通り過ぎるのを待って手前の駅へ後退！'
  },
  {
    icon: '❄️',
    title: 'セレンゲ川沿いで線路が凍結！',
    desc: '夜間の冷え込みでレールがカチコチに凍結！除雪と安全確認のため手前の駅へバック退避！'
  },
  {
    icon: '🐫',
    title: 'フタコブラクダが線路で日向ぼっこ！',
    desc: 'のんびり座り込んだラクダがびくとも動かない！汽笛を鳴らしつつ手前の駅まで後退しました！'
  },
  {
    icon: '🥛',
    title: '遊牧民のゲルから大歓迎の合図！',
    desc: '「馬乳酒を飲んでいけ！」と手を振る遊牧民につられ停車！気づけば手前の駅まで戻っていました！'
  }
];

export const railwayQuestions = [
  {
    id: 'rq_1',
    category: '鉄道・交通',
    prompt: 'モンゴル語で「列車・電車」は？',
    wordMn: 'галт тэрэг',
    choices: ['галт тэрэг', 'нисэх онгоц', 'машин', 'завь'],
    correctIdx: 0,
    explanation: 'гал（火）＋ тэрэг（車）＝蒸気機関車に由来する言葉です。',
    caution: null
  },
  {
    id: 'rq_2',
    category: '鉄道・交通',
    prompt: 'モンゴル語で「鉄道」は？',
    wordMn: 'төмөр зам',
    choices: ['шороон зам', 'төмөр зам', 'усан зам', 'агаарын зам'],
    correctIdx: 1,
    explanation: 'төмөр（鉄）＋ зам（道）＝鉄の道（鉄道）です。',
    caution: null
  },
  {
    id: 'rq_3',
    category: '駅・施設',
    prompt: 'モンゴル語で「駅・宿駅」を表す伝統的な言葉は？',
    wordMn: 'өртөө',
    choices: ['буудал', 'өртөө', 'нисэх буудал', 'боомт'],
    correctIdx: 1,
    explanation: 'モンゴル帝国時代の駅伝制度「モリン・オルトー」に由来する言葉です。',
    caution: null
  },
  {
    id: 'rq_4',
    category: '駅・施設',
    prompt: 'モンゴル語で「停留所・駅」は？',
    wordMn: 'буудал',
    choices: ['буудал', 'зочид буудал', 'сургууль', 'эмнэлэг'],
    correctIdx: 0,
    explanation: 'буух（降りる）＋ -дал（場所を表す接尾辞）＝降りる場所です。',
    caution: null
  },
  {
    id: 'rq_5',
    category: '乗車券',
    prompt: 'モンゴル語で「切符・チケット」は？',
    wordMn: 'тасалбар',
    choices: ['мөнгө', 'ном', 'тасалбар', 'зураг'],
    correctIdx: 2,
    explanation: 'таслах（切り離す・もぎる）＋ -бар ＝ もぎる券・切符です。',
    caution: null
  },
  {
    id: 'rq_6',
    category: '車内',
    prompt: 'モンゴル語で「座席・席」は？',
    wordMn: 'суудал',
    choices: ['ширээ', 'суудал', 'ор', 'хаалга'],
    correctIdx: 1,
    explanation: 'суух（座る）＋ -дал ＝ 座る場所（座席）です。',
    caution: null
  },
  {
    id: 'rq_7',
    category: '車内',
    prompt: 'モンゴル語で「客車・車両」を表す言葉は？',
    wordMn: 'вагон',
    choices: ['мотор', 'вагон', 'дугуй', 'дээвэр'],
    correctIdx: 1,
    explanation: 'ロシア語由来の外来語で、列車の客車・貨車を指します。',
    caution: null
  },
  {
    id: 'rq_8',
    category: '旅の動詞',
    prompt: '「旅に出る・出発する」を意味する表現は？',
    wordMn: 'замд гарах',
    choices: ['гэртээ харих', 'замд гарах', 'буудалд очих', 'хоол идэх'],
    correctIdx: 1,
    explanation: 'замд（道に）＋ гарах（出る）＝旅路に出発する、という意味です。',
    caution: null
  },
  {
    id: 'rq_9',
    category: '旅の動詞',
    prompt: 'モンゴル語で「（目的地に）到着する・達する」は？',
    wordMn: 'хүрэх',
    choices: ['явахаа болих', 'буух', 'хүрэх', 'алхах'],
    correctIdx: 2,
    explanation: 'хүрэх は「到達する、行き着く」を表す基本動詞です。',
    caution: null
  },
  {
    id: 'rq_10',
    category: '旅の動詞',
    prompt: '列車が「発車する・動き出す」は？',
    wordMn: 'хөдлөх',
    choices: ['зогсох', 'хөдлөх', 'эвдрэх', 'шатах'],
    correctIdx: 1,
    explanation: 'хөдлөх は「動く、動き出す、発車する」を表します。',
    caution: null
  },
  {
    id: 'rq_11',
    category: '人・乗客',
    prompt: 'モンゴル語で「乗客・旅客」は？',
    wordMn: 'зорчигч',
    choices: ['жолооч', 'сурагч', 'малчин', 'зорчигч'],
    correctIdx: 3,
    explanation: 'зорчих（旅する・行き交う）＋ -гч（人）＝旅客・乗客です。',
    caution: null
  },
  {
    id: 'rq_12',
    category: '旅のトラブル',
    prompt: '「（列車に）乗り遅れる・遅刻する」を表す動詞は？',
    wordMn: 'хоцрох',
    choices: ['хурдлах', 'хоцрох', 'түрүүлэх', 'амжих'],
    correctIdx: 1,
    explanation: 'хоцрох は「遅れる、取り残される」を意味します。',
    caution: null
  },
  {
    id: 'rq_13',
    category: '手荷物',
    prompt: 'モンゴル語で「荷物・手荷物」は？',
    wordMn: 'ачаа',
    choices: ['бэлэг', 'ачаа', 'хувцас', 'хоол'],
    correctIdx: 1,
    explanation: 'ачаа は荷物・貨物を指し、手荷物は「ачаа тээш」とも言います。',
    caution: null
  },
  {
    id: 'rq_14',
    category: '方角',
    prompt: 'スフバートル駅がある「北」を意味するモンゴル語は？',
    wordMn: 'хойд',
    choices: ['өмнөд', 'хойд', 'баруун', 'зүүн'],
    correctIdx: 1,
    explanation: 'хойд（北）、өмнөд（南）、баруун（西）、зүүн（東）です。',
    caution: null
  },
  {
    id: 'rq_15',
    category: '方角',
    prompt: 'ザミンウード駅がある「南」を意味するモンゴル語は？',
    wordMn: 'өмнөд',
    choices: ['өмнөд', 'хойд', 'баруун', 'зүүн'],
    correctIdx: 0,
    explanation: 'өмнөд は「南」を意味します（ゴビ砂漠はモンゴル南部に位置）。',
    caution: null
  },
  {
    id: 'rq_16',
    category: '国境',
    prompt: 'モンゴル語で「国境・境界」は？',
    wordMn: 'хил',
    choices: ['гол', 'хил', 'уул', 'нуур'],
    correctIdx: 1,
    explanation: 'хил は国境を意味し、国境警備隊は хилчин と呼ばれます。',
    caution: null
  },
  {
    id: 'rq_17',
    category: '自然・地形',
    prompt: 'セレンゲ川などの「川・河川」を表す言葉は？',
    wordMn: 'гол',
    choices: ['нуур', 'говь', 'гол', 'тал'],
    correctIdx: 2,
    explanation: 'гол は川、大河は мөрөн と呼びます。',
    caution: null
  },
  {
    id: 'rq_18',
    category: '自然・地形',
    prompt: 'モンゴル語で「砂漠・乾燥低木地帯」は？',
    wordMn: 'говь',
    choices: ['ой', 'хөвч', 'говь', 'мөс'],
    correctIdx: 2,
    explanation: 'Говь（ゴビ）はモンゴル南部に広がる独特の乾燥ステップ・砂漠です。',
    caution: null
  },
  {
    id: 'rq_19',
    category: '自然・地形',
    prompt: 'モンゴルを象徴する広大な「草原・平野」は？',
    wordMn: 'тал',
    choices: ['тал', 'уул', 'жалга', 'хад'],
    correctIdx: 0,
    explanation: 'тал は広大な草原・平原を表します。',
    caution: null
  },
  {
    id: 'rq_20',
    category: '機関車',
    prompt: 'モンゴル語で「蒸気機関車」は？',
    wordMn: 'уурын тэрэг',
    choices: ['цахилгаан тэрэг', 'уурын тэрэг', 'морин тэрэг', 'үхэр тэрэг'],
    correctIdx: 1,
    explanation: 'уур（蒸気）＋ -ын（の）＋ тэрэг（車）＝蒸気機関車です。',
    caution: null
  },
  {
    id: 'rq_21',
    category: '旅行会話',
    prompt: '旅立つ人にかける挨拶「良い旅を！」は？',
    wordMn: 'Сайхан аялаарай!',
    choices: ['Баяртай!', 'Сайхан аялаарай!', 'Сайн байна уу?', 'Өглөөний мэнд!'],
    correctIdx: 1,
    explanation: 'сайхан（素晴らしい）＋ аялах（旅する）＋ -аарай（丁寧な勧誘・祈願）です。',
    caution: null
  },
  {
    id: 'rq_22',
    category: '切符売り場',
    prompt: '駅の「切符売り場（窓口）」を表す言葉は？',
    wordMn: 'тасалбар түгээгүүр',
    choices: ['мөнгө солих газар', 'тасалбар түгээгүүр', 'ачаа хадгалах газар', 'цайны газар'],
    correctIdx: 1,
    explanation: 'тасалбар（切符）＋ түгээх（配る・販売する）＋ -гүүр（場所・装置）です。',
    caution: null
  },
  {
    id: 'rq_23',
    category: '旅行会話',
    prompt: '「何時に発車しますか？」を意味するモンゴル語は？',
    wordMn: 'Хэдэн цагт хөдлөх вэ?',
    choices: ['Хаана очих вэ?', 'Хэдэн цагт хөдлөх вэ?', 'Энэ хэд вэ?', 'Та хэн бэ?'],
    correctIdx: 1,
    explanation: 'хэдэн цагт（何時に）＋ хөдлөх（発車する）＋ вэ（疑問助詞）です。',
    caution: null
  },
  {
    id: 'rq_24',
    category: '旅行会話',
    prompt: '「この列車はどこ行きですか？」は？',
    wordMn: 'Энэ галт тэрэг хаашаа явах вэ?',
    choices: ['Энэ хэний цүнх бэ?', 'Энэ галт тэрэг хаашаа явах вэ?', 'Та хаанаас ирсэн бэ?', 'Ямар хоол байна вэ?'],
    correctIdx: 1,
    explanation: 'энэ галт тэрэг（この列車は）＋ хаашаа（どこへ）＋ явах вэ（行きますか）です。',
    caution: null
  },
  {
    id: 'rq_25',
    category: '旅の言葉',
    prompt: 'モンゴル語で「目的地・到着地」は？',
    wordMn: 'хүрэх газар',
    choices: ['явах зам', 'хүрэх газар', 'эхлэх цэг', 'зогсох газар'],
    correctIdx: 1,
    explanation: 'хүрэх（達する・着く）＋ газар（場所）＝目的地です。',
    caution: null
  },
  {
    id: 'rq_26',
    category: '車窓',
    prompt: '列車の旅の醍醐味である「窓」を表すモンゴル語は？',
    wordMn: 'цонх',
    choices: ['хаалга', 'цонх', 'дээвэр', 'шал'],
    correctIdx: 1,
    explanation: 'цонх は窓を意味します。',
    caution: null
  },
  {
    id: 'rq_27',
    category: '車内',
    prompt: '列車の「ドア・扉」は？',
    wordMn: 'хаалга',
    choices: ['хаалга', 'ор', 'ширээ', 'цонх'],
    correctIdx: 0,
    explanation: 'хаалга は扉・出入口を意味します。',
    caution: null
  },
  {
    id: 'rq_28',
    category: '速度',
    prompt: '急行列車のように「速い」を表す形容詞は？',
    wordMn: 'хурдан',
    choices: ['удаан', 'хурдан', 'хүйтэн', 'дулаан'],
    correctIdx: 1,
    explanation: 'хурдан は速い、удаан は遅い・ゆっくり、です。',
    caution: null
  },
  {
    id: 'rq_29',
    category: '速度',
    prompt: 'のんびり旅のように「遅い・ゆっくり」を表す形容詞は？',
    wordMn: 'удаан',
    choices: ['хурдан', 'удаан', 'богино', 'урт'],
    correctIdx: 1,
    explanation: 'удаан は遅い・時間をかける様子を表します。',
    caution: null
  },
  {
    id: 'rq_30',
    category: '動物・線路',
    prompt: '線路によく現れる「羊」はモンゴル語で？',
    wordMn: 'хонь',
    choices: ['ямаа', 'хонь', 'үхэр', 'нохой'],
    correctIdx: 1,
    explanation: 'хонь（羊）はモンゴル五畜の代表格です。',
    caution: null
  },
  {
    id: 'rq_31',
    category: '動物・線路',
    prompt: 'モンゴルの象徴である「馬」は？',
    wordMn: 'морь',
    choices: ['тэмээ', 'сарлаг', 'морь', 'чоно'],
    correctIdx: 2,
    explanation: 'морь は馬を表します（※読み注意: モリ）。',
    caution: 'モリ'
  },
  {
    id: 'rq_32',
    category: '動物・ゴビ',
    prompt: 'ゴビ砂漠の砂漠地帯で出会う「ラクダ」は？',
    wordMn: 'тэмээ',
    choices: ['заан', 'баавгай', 'тэмээ', 'буга'],
    correctIdx: 2,
    explanation: 'тэмээ はフタコブラクダを指します。',
    caution: null
  },
  {
    id: 'rq_33',
    category: '安全運行',
    prompt: '旅の基本である「安全な」を意味する言葉は？',
    wordMn: 'аюулгүй',
    choices: ['аюултай', 'аюулгүй', 'аймшигтай', 'хэцүү'],
    correctIdx: 1,
    explanation: 'аюул（危険）＋ -гүй（のない）＝安全な、無事故の、です。',
    caution: null
  },
  {
    id: 'rq_34',
    category: '鉄道職員',
    prompt: '列車の「車掌・改札係」を表す言葉は？',
    wordMn: 'шалгагч',
    choices: ['тогооч', 'шалгагч', 'эмч', 'багш'],
    correctIdx: 1,
    explanation: 'шалгах（検査する・改札する）＋ -гч（人）＝検札員・車掌です。',
    caution: null
  },
  {
    id: 'rq_35',
    category: '道中',
    prompt: '「旅の途中・道中」を表す表現は？',
    wordMn: 'зам зуур',
    choices: ['гэртээ', 'зам зуур', 'хотод', 'буудалд'],
    correctIdx: 1,
    explanation: 'зам（道）＋ зуур（〜の間・途中）＝道中で、という意味です。',
    caution: null
  },
  {
    id: 'rq_36',
    category: '食堂車',
    prompt: '列車内の「食堂・カフェ」を表す言葉は？',
    wordMn: 'цайны газар',
    choices: ['дэлгүүр', 'цайны газар', 'номын сан', 'банк'],
    correctIdx: 1,
    explanation: 'цай（お茶）＋ -ны（の）＋ газар（場所）＝喫茶・食堂です。',
    caution: null
  },
  {
    id: 'rq_37',
    category: '夜行列車',
    prompt: 'モンゴル語で「夜行列車」は？',
    wordMn: 'шөнийн галт тэрэг',
    choices: ['өдрийн галт тэрэг', 'шөнийн галт тэрэг', 'хурдан галт тэрэг', 'ачааны галт тэрэг'],
    correctIdx: 1,
    explanation: 'шөнө（夜）＋ -ийн（の）＋ галт тэрэг（列車）＝夜行列車です。',
    caution: null
  },
  {
    id: 'rq_38',
    category: '終着駅',
    prompt: 'ザミンウードのような「終着駅・終点」は？',
    wordMn: 'эцсийн буудал',
    choices: ['эхний буудал', 'эцсийн буудал', 'дунд буудал', 'жижиг буудал'],
    correctIdx: 1,
    explanation: 'эцсийн（最後の・究極の）＋ буудал（駅・停留所）＝終着駅です。',
    caution: null
  },
  {
    id: 'rq_39',
    category: '引き返す',
    prompt: '間違えたときに列車が「戻る・引き返す」動詞は？',
    wordMn: 'буцах',
    choices: ['явах', 'нисэх', 'гүйх', 'буцах'],
    correctIdx: 3,
    explanation: 'буцах は「戻る、帰る、引き返す」を意味する重要動詞です。',
    caution: null
  },
  {
    id: 'rq_40',
    category: 'ダルハン駅の知識',
    prompt: 'モンゴル第3の都市ダルハン（Дархан）の名前の本来の意味は？',
    wordMn: 'дархан',
    choices: ['鍛冶職人・聖域', '商人', '遊牧民', '武士'],
    correctIdx: 0,
    explanation: 'дархан は古代から「名匠、鍛冶職人、免税された神聖な特権地」を意味します。',
    caution: null
  },
  {
    id: 'rq_41',
    category: 'サインシャンド駅の知識',
    prompt: '東ゴビの要所「サインシャンド（Сайншанд）」の шанд の意味は？',
    wordMn: 'шанд',
    choices: ['砂漠の小さな泉・水場', '高い山', '深い森', '広い川'],
    correctIdx: 0,
    explanation: 'шанд はゴビ砂漠の浅い砂地に湧く「小さなオアシスの泉」を意味します。',
    caution: null
  },
  {
    id: 'rq_42',
    category: 'ザミンウード駅の知識',
    prompt: '終着駅「ザミンウード（Замын-Үүд）」の名前の意味は？',
    wordMn: 'Замын-Үүд',
    choices: ['道の門・街道の玄関口', '鉄の終点', '砂漠の果て', '南の川'],
    correctIdx: 0,
    explanation: 'зам（道）＋ -ын（の）＋ үүд（扉・門）＝「道の門（シルクロードの玄関口）」です。',
    caution: null
  },
  {
    id: 'rq_43',
    category: '感謝の挨拶',
    prompt: '車掌さんや駅員さんに言う「ありがとう」は？',
    wordMn: 'Баярлалаа',
    choices: ['Уучлаарай', 'Баярлалаа', 'Зүгээр', 'Тийм'],
    correctIdx: 1,
    explanation: 'баярлалаа は「感謝します・ありがとう」の代表的表現です（※読み注意: バイルラー）。',
    caution: 'バイルラー'
  },
  {
    id: 'rq_44',
    category: '線路の距離',
    prompt: 'モンゴル縦断鉄道（スフバートル〜ザミンウード）の総延長は約何km？',
    wordMn: '1,110 km',
    choices: ['500 km', '800 km', '1,110 km', '2,500 km'],
    correctIdx: 2,
    explanation: 'ロシア国境から中国国境まで、モンゴルを南北に貫く全線で約1,110kmあります。',
    caution: null
  },
  {
    id: 'rq_45',
    category: '旅行会話',
    prompt: '「切符を1枚ください」を意味するモンゴル語は？',
    wordMn: 'Нэг тасалбар өгөөч',
    choices: ['Нэг тасалбар өгөөч', 'Цай уумаар байна', 'Улаанбаатар хаана байна?', 'Цаг хэд болж байна?'],
    correctIdx: 0,
    explanation: 'нэг（1つの）＋ тасалбар（切符）＋ өгөөч（ください）です。',
    caution: null
  }
];
