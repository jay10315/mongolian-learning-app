// モンゴル語発音特訓データ（特殊母音・難関子音・最小対比・日常表現）
export const PRONUNCIATION_CATEGORIES = [
  { id: 'vowels_minimal', name: '🎯 特殊母音対比（ө vs ү / о vs у）', desc: '日本人が最も混同しやすい母音のペアを集中特訓' },
  { id: 'consonants_special', name: '⚡ 難関子音（х / л / р / ц / ч）', desc: '喉を鳴らすх、側面摩擦л、巻き舌р、破擦音ц・ч' },
  { id: 'greetings', name: '💬 基本挨拶・重要フレーズ', desc: '自然なイントネーションと流暢さを身につける挨拶' },
  { id: 'numbers', name: '🔢 数字・金額の発音', desc: '長母音・二重母音の抑揚が重要な数詞の正しい発音' },
  { id: 'vocab_high', name: '🌟 最重要単語（★★★）', desc: '頻出必須単語の発音完全マスター' }
];

export const PRONUNCIATION_SOUND_TIPS = {
  'ө': {
    symbol: '[ɵ] / [o]',
    title: '特殊母音 ө（男性母音・中舌半狭母音）',
    howTo: '口を「エ」の形にやや縦に開きながら、喉の奥で「オ」と発音します。日本語の「オ」のように唇をすぼめず、平らに保つのがコツです。',
    pitfall: '日本語の「オ」で発音すると「о」と区別がつかなくなります。'
  },
  'ү': {
    symbol: '[ʊ] / [u]',
    title: '特殊母音 ү（女性母音・狭母音）',
    howTo: '唇をストローをくわえるように強く前に突き出し、すぼめて「ウ」と発音します。',
    pitfall: '日本語の「ウ」は唇をすぼめない平たい音（非円唇）なので、意識して唇を丸く前に突き出しましょう。'
  },
  'х': {
    symbol: '[x]（無声軟口蓋摩擦音）',
    title: '摩擦音 х',
    howTo: 'うがいをするときや、寒いときに手に「ハーッ」と息を吹きかけるように、喉の奥（軟口蓋）を息で激しくこすり合わせます。',
    pitfall: '日本語の「ハ行」のように息を素通りさせず、しっかり喉で摩擦を起こします。'
  },
  'л': {
    symbol: '[ɮ]（有声歯茎側面摩擦音）',
    title: '側面摩擦音 л',
    howTo: '舌先を上前歯の付け根の歯茎にペタッと押し当て、舌の両脇から息を強く押し出すようにして発音します。わずかに「ズ」や「ス」の混ざった独特の音になります。',
    pitfall: '日本語の「ラ行」のように舌先を弾いてはいけません。英語の L よりも息の摩擦が強いのが特徴です。'
  },
  'р': {
    symbol: '[r]（歯茎ふるえ音・巻き舌）',
    title: '巻き舌音 р ＆ 語頭での発音ルール',
    howTo: '舌先を上前歯の裏の歯茎に当て、息の勢いで舌先を「ルルルッ」と細かく震わせます。語尾では軽く息が抜ける無声化が起こることもあります。\n\n💡【語頭の「р」の重要発音ルール】\n・ルール: 語頭に「р」が来る場合、直前に弱い母音（主に直後の母音に引かれた「а」や「э」などの音）を伴うように発音します。\n・理由: 本来のモンゴル語（固有語）では語頭に「р」が立たないため、ロシア語などからの外来語（例：радио [ラジオ]、Орос [ロシア] ※口語でРから始まる場合など）を発音する際、巻き舌の準備として前に母音が挿入されます。',
    pitfall: '日本語のラ行のような1回だけのタップではなく、舌をリラックスさせて振動させます。語頭の「р」は直前に母音を添えて発音するのが自然なネイティブ発音です。'
  },
  'ц': {
    symbol: '[ts]（無声歯茎破擦音）',
    title: '破擦音 ц',
    howTo: '日本語の「ツ」の子音です。母音が a, o, u, e でも「ツァ」「ツォ」「ツゥ」「ツェ」と鋭く破擦させます。',
    pitfall: 'サ行やタ行になまらないよう、舌先を歯茎につけてから鋭く離します。'
  },
  'ч': {
    symbol: '[tʃ]（無声後部歯茎破擦音）',
    title: '破擦音 ч',
    howTo: '日本語の「チ」の子音です。「チャ」「チョ」「チュ」「チェ」のように息を前歯の後ろで破裂させます。',
    pitfall: '息を鋭く出すのが特徴です。'
  }
};

export const PRONUNCIATION_ITEMS = [
  // 1. 特殊母音対比
  {
    id: 'pr_v_1',
    category: 'vowels_minimal',
    mongolian: 'ус',
    japanese: '水',
    pronunciation: 'オス（短く奥で）',
    phoneticKey: 'у',
    hint: '「у」は喉の奥の「オ」寄りのウ。唇をあまり突き出さない男性母音。',
    comparisonPair: 'үс（髪）'
  },
  {
    id: 'pr_v_2',
    category: 'vowels_minimal',
    mongolian: 'үс',
    japanese: '髪の毛',
    pronunciation: 'ウス（唇を強くすぼめて）',
    phoneticKey: 'ү',
    hint: '「ү」は唇を前に強く突き出す女性母音。「ус（水）」と口の形が決定的に違います。',
    comparisonPair: 'ус（水）'
  },
  {
    id: 'pr_v_3',
    category: 'vowels_minimal',
    mongolian: 'өдөр',
    japanese: '日、昼間',
    pronunciation: 'オドル（口を平たく開けて）',
    phoneticKey: 'ө',
    hint: '「ө」は口を「エ」の形にして「オ」と言うイメージ。唇を丸めません。',
    comparisonPair: 'үдэш（夕方）'
  },
  {
    id: 'pr_v_4',
    category: 'vowels_minimal',
    mongolian: 'үдэш',
    japanese: '夕方、晩',
    pronunciation: 'ウデシ（唇をすぼめて）',
    phoneticKey: 'ү',
    hint: '「ү」は唇をきゅっと尖らせる女性母音。「өдөр」のөと口の開き方を比較しましょう。',
    comparisonPair: 'өдөр（日）'
  },
  {
    id: 'pr_v_5',
    category: 'vowels_minimal',
    mongolian: 'морь',
    japanese: '馬',
    pronunciation: 'モリ（ьで直前の子音が少し柔らかくなる）',
    phoneticKey: 'о',
    hint: '「о」は男性母音のオ。末尾の軟音記号「ь」で「ル」がイ段寄りに柔らかくなります。',
    comparisonPair: 'мөр（肩／小道）'
  },
  {
    id: 'pr_v_6',
    category: 'vowels_minimal',
    mongolian: 'мөр',
    japanese: '肩、足跡・小道',
    pronunciation: 'モル（өの音・口を平たく）',
    phoneticKey: 'ө',
    hint: '「ө」なので唇を丸めず「エ」の口で「オ」。「морь（馬）」との音の響きの違いに注目。',
    comparisonPair: 'морь（馬）'
  },

  // 2. 難関子音
  {
    id: 'pr_c_1',
    category: 'consonants_special',
    mongolian: 'хана',
    japanese: '壁',
    pronunciation: 'ハナ（喉の奥で息を擦る）',
    phoneticKey: 'х',
    hint: '冒頭の「х」は喉の奥をこする無声軟口蓋摩擦音。ため息の「ハ」より激しく摩擦させます。'
  },
  {
    id: 'pr_c_2',
    category: 'consonants_special',
    mongolian: 'хөл',
    japanese: '足',
    pronunciation: 'ホル（喉のх ＋ 口を平たくө ＋ 側面のл）',
    phoneticKey: 'х',
    hint: '3つの難関要素（хの喉摩擦、өの平たいオ、лの舌の両脇からの息）が揃った重要単語！'
  },
  {
    id: 'pr_c_3',
    category: 'consonants_special',
    mongolian: 'гар',
    japanese: '手',
    pronunciation: 'ガル（巻き舌のр）',
    phoneticKey: 'р',
    hint: '語尾の「р」は舌先を歯茎で細かく震わせる巻き舌音です。'
  },
  {
    id: 'pr_c_4',
    category: 'consonants_special',
    mongolian: 'цас',
    japanese: '雪',
    pronunciation: 'ツァス（鋭くツァ）',
    phoneticKey: 'ц',
    hint: '「ц」は「ツ」の子音。母音「а」が続いても「サス」ではなく鋭く「ツァス」と発音します。'
  },
  {
    id: 'pr_c_5',
    category: 'consonants_special',
    mongolian: 'цай',
    japanese: 'お茶（ミルクティー）',
    pronunciation: 'ツァイ',
    phoneticKey: 'ц',
    hint: '破擦音「ц」と二重母音「ай」の組み合わせ。しっかり破擦させて「ツァイ」と発音。'
  },
  {
    id: 'pr_c_6',
    category: 'consonants_special',
    mongolian: 'жаргал',
    japanese: '幸福、喜び',
    pronunciation: 'ジャルガル',
    phoneticKey: 'ж',
    hint: '「ж」は舌をやや後ろに引いた有声摩擦音。語中の「р」の巻き舌と末尾の「л」の側面摩擦に注目。'
  },

  // 3. 基本挨拶
  {
    id: 'pr_g_1',
    category: 'greetings',
    mongolian: 'Сайн байна уу?',
    japanese: 'こんにちは（お元気ですか？）',
    pronunciation: 'サイン バイン ノー？',
    phoneticKey: 'у',
    hint: '最も重要な挨拶。語尾の「уу」は長母音で少しイントネーションを上げて親しみを持たせます。'
  },
  {
    id: 'pr_g_2',
    category: 'greetings',
    mongolian: 'Баярлалаа.',
    japanese: 'ありがとうございます。',
    pronunciation: 'バヤルララー。',
    phoneticKey: 'л',
    hint: '「л」が重なり（-рл-）、語尾「-аа」がしっかり伸びます。心を込めて滑らかに。'
  },
  {
    id: 'pr_g_3',
    category: 'greetings',
    mongolian: 'Баяртай.',
    japanese: 'さようなら。',
    pronunciation: 'バヤルタイ。',
    phoneticKey: 'р',
    hint: '「-р-」で舌先を軽く震わせ、二重母音「-ай」を綺麗に閉じます。'
  },
  {
    id: 'pr_g_4',
    category: 'greetings',
    mongolian: 'Танилцъя.',
    japanese: 'はじめまして。（知り合いましょう）',
    pronunciation: 'タニルツィヤ。',
    phoneticKey: 'ц',
    hint: '硬音記号「ъ」により直前の「ц」と「я」が明確に分離して発音されます。'
  },
  {
    id: 'pr_g_5',
    category: 'greetings',
    mongolian: 'Зүгээр ээ.',
    japanese: 'どういたしまして。（大丈夫ですよ）',
    pronunciation: 'ズゲール エー。',
    phoneticKey: 'ү',
    hint: '「ү」で唇を突き出し、長母音「-ээ」を豊かに伸ばします。'
  },

  // 4. 数字・金額
  {
    id: 'pr_n_1',
    category: 'numbers',
    mongolian: 'нэг',
    japanese: '1（数字の1）',
    pronunciation: 'ネグ',
    phoneticKey: 'э',
    hint: '語尾の「г」は日本語の「グ」のように母音を残さず、子音で軽く止めます。'
  },
  {
    id: 'pr_n_2',
    category: 'numbers',
    mongolian: 'хоёр',
    japanese: '2（数字の2）',
    pronunciation: 'ホヨル',
    phoneticKey: 'х',
    hint: '冒頭の「х」で息を擦り、「-ёр」で巻き舌。二重母音のような滑らかな移行。'
  },
  {
    id: 'pr_n_3',
    category: 'numbers',
    mongolian: 'гурав',
    japanese: '3（数字の3）',
    pronunciation: 'グラウ / グラヴ',
    phoneticKey: 'р',
    hint: '「в」は母音の後で英語の w のように弱まり、「グラウ」に近い響きになります。'
  },
  {
    id: 'pr_n_4',
    category: 'numbers',
    mongolian: 'дөрөв',
    japanese: '4（数字の4）',
    pronunciation: 'ドロヴ（өの連続）',
    phoneticKey: 'ө',
    hint: '「ө」が2回連続します！唇を平らに保ちながら「ドロヴ」。'
  },
  {
    id: 'pr_n_5',
    category: 'numbers',
    mongolian: 'тав',
    japanese: '5（数字の5）',
    pronunciation: 'タウ / タヴ',
    phoneticKey: 'а',
    hint: '短く歯切れよく「タウ」。'
  },
  {
    id: 'pr_n_6',
    category: 'numbers',
    mongolian: 'арван мянга',
    japanese: '10,000（1万トゥグルグなど）',
    pronunciation: 'アルワン ミャンガ',
    phoneticKey: 'н',
    hint: '「арван」の隠れ-нと「мянга」の語頭の口蓋化「мя」をリズミカルに発音。'
  },

  // 5. 最重要単語
  {
    id: 'pr_w_1',
    category: 'vocab_high',
    mongolian: 'би',
    japanese: '私（1人称代名詞）',
    pronunciation: 'ビ',
    phoneticKey: 'и',
    hint: '短く自然に発音します。中性母音です。'
  },
  {
    id: 'pr_w_2',
    category: 'vocab_high',
    mongolian: 'та',
    japanese: 'あなた（敬称）',
    pronunciation: 'タ',
    phoneticKey: 'а',
    hint: '男性母音のクリアな「タ」。'
  },
  {
    id: 'pr_w_3',
    category: 'vocab_high',
    mongolian: 'ном',
    japanese: '本',
    pronunciation: 'ノム',
    phoneticKey: 'о',
    hint: '「о」なので日本語の「オ」よりも口を大きく縦に開けます。'
  },
  {
    id: 'pr_w_4',
    category: 'vocab_high',
    mongolian: 'багш',
    japanese: '先生、教師',
    pronunciation: 'バグシ',
    phoneticKey: 'ш',
    hint: '語尾の「ш」は日本語の「シ」よりも息を広く前に吐き出す後部歯茎摩擦音。'
  },
  {
    id: 'pr_w_5',
    category: 'vocab_high',
    mongolian: 'сургууль',
    japanese: '学校',
    pronunciation: 'スルグーリ',
    phoneticKey: 'у',
    hint: '「уу」の長母音をしっかり伸ばし、末尾の「ль」で柔らかく軟音化。'
  }
];
