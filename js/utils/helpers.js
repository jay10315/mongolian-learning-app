// モンゴル語キリル文字・母音調和・UIユーティリティ

// モンゴル語キリル文字アルファベット（35文字）
export const MONGOLIAN_CYRILLIC_LETTERS = [
  // 母音
  { char: 'а', upper: 'А', name: 'a', type: 'male_vowel' },
  { char: 'э', upper: 'Э', name: 'e', type: 'female_vowel' },
  { char: 'и', upper: 'И', name: 'i', type: 'neutral_vowel' },
  { char: 'о', upper: 'О', name: 'o', type: 'male_vowel' },
  { char: 'ө', upper: 'Ө', name: 'ö', type: 'female_vowel', special: true },
  { char: 'у', upper: 'У', name: 'u', type: 'male_vowel' },
  { char: 'ү', upper: 'Ү', name: 'ü', type: 'female_vowel', special: true },
  { char: 'я', upper: 'Я', name: 'ya', type: 'male_vowel' },
  { char: 'е', upper: 'Е', name: 'ye', type: 'female_vowel' },
  { char: 'ё', upper: 'Ё', name: 'yo', type: 'male_vowel' },
  { char: 'ю', upper: 'Ю', name: 'yu', type: 'male_vowel' },
  { char: 'ы', upper: 'Ы', name: 'y', type: 'vowel' },
  // 子音
  { char: 'б', upper: 'Б', name: 'b', type: 'consonant' },
  { char: 'в', upper: 'В', name: 'v', type: 'consonant' },
  { char: 'г', upper: 'Г', name: 'g', type: 'consonant' },
  { char: 'д', upper: 'Д', name: 'd', type: 'consonant' },
  { char: 'ж', upper: 'Ж', name: 'zh', type: 'consonant' },
  { char: 'з', upper: 'З', name: 'z', type: 'consonant' },
  { char: 'к', upper: 'К', name: 'k', type: 'consonant' },
  { char: 'л', upper: 'Л', name: 'l', type: 'consonant' },
  { char: 'м', upper: 'М', name: 'm', type: 'consonant' },
  { char: 'н', upper: 'Н', name: 'n', type: 'consonant' },
  { char: 'п', upper: 'П', name: 'p', type: 'consonant' },
  { char: 'р', upper: 'Р', name: 'r', type: 'consonant' },
  { char: 'с', upper: 'С', name: 's', type: 'consonant' },
  { char: 'т', upper: 'Т', name: 't', type: 'consonant' },
  { char: 'ф', upper: 'Ф', name: 'f', type: 'consonant' },
  { char: 'х', upper: 'Х', name: 'kh', type: 'consonant' },
  { char: 'ц', upper: 'Ц', name: 'ts', type: 'consonant' },
  { char: 'ч', upper: 'Ч', name: 'ch', type: 'consonant' },
  { char: 'ш', upper: 'Ш', name: 'sh', type: 'consonant' },
  { char: 'щ', upper: 'Щ', name: 'shch', type: 'consonant' },
  // 記号
  { char: 'ъ', upper: 'Ъ', name: 'hard_sign', type: 'sign' },
  { char: 'ь', upper: 'Ь', name: 'soft_sign', type: 'sign' }
];

// よく使う特殊文字（クイックバー用）
export const SPECIAL_CYRILLIC_BAR = ['ө', 'ү', 'Ө', 'Ү', 'ь', 'ъ', 'э', 'ы', 'я', 'ё', 'ю'];

/**
 * テキストがキリル文字を含むか判定
 */
export function isCyrillic(str) {
  return /[\u0400-\u04FF]/.test(str);
}

/**
 * テキストが日本語（ひらがな・カタカナ・漢字）を含むか判定
 */
export function isJapanese(str) {
  return /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(str);
}

/**
 * 簡易文字列類似度判定（空白・記号・大文字小文字の差異を柔軟に許容）
 */
export function isFuzzyMatch(userAnswer, correctAnswer) {
  if (!userAnswer || !correctAnswer) return false;

  const clean = (s) => s.trim().toLowerCase()
    .replace(/[.,!?。、！？\s]/g, '')
    .replace(/[«»"']/g, '');

  const u = clean(userAnswer);
  const c = clean(correctAnswer);

  if (u === c) return true;

  // 最後の句点やハイフン違い
  if (u.replace(/-/g, '') === c.replace(/-/g, '')) return true;

  // 括弧の除去比較（例: ユーザーがцаас、正解がцаас(н)のケース）
  const cWithoutParens = c.replace(/\([^)]*\)/g, '');
  if (u === cWithoutParens) return true;

  // 括弧内の文字を展開した比較（例: ав(ах) -> авах）
  const cExpanded = c.replace(/\((\w+)\)/g, '$1');
  if (u === cExpanded) return true;

  return false;
}

/**
 * モンゴル語単語の母音調和（男性語 / 女性語 / 中性）を判定
 */
export function detectVowelHarmony(word) {
  if (!word) return 'neutral';
  const lower = word.toLowerCase();

  const maleMatch = lower.match(/[аоуяёю]/g);
  const femaleMatch = lower.match(/[эөүе]/g);

  if (maleMatch && !femaleMatch) return 'male';
  if (femaleMatch && !maleMatch) return 'female';
  if (maleMatch && femaleMatch) {
    // 最初の母音の響きで優先判定
    const firstMale = lower.search(/[аоуяёю]/);
    const firstFemale = lower.search(/[эөүе]/);
    return firstMale < firstFemale ? 'male' : 'female';
  }
  return 'neutral'; // и のみなど
}

/**
 * 単語が動詞（動詞句を含む）かどうか判定
 */
export function isVerb(word) {
  if (!word) return false;
  if (word.isVerb === true) return true;
  const pos = (word.pos || '').trim();
  const root = (word.root || '').trim();
  if (pos.includes('動詞')) return true;
  if (word.kind === 'verb' || (word.category && word.category.startsWith('verb'))) return true;
  if (root && !['名詞', '名詞句', '代名詞', '数詞', '形容詞', '副詞', '助詞', '後置詞', '挨拶', '挨拶表現'].includes(pos)) {
    return true;
  }
  return false;
}

/**
 * 括弧や余計な記号を除去したクリーンな見出し語・辞書形・語幹を取得
 */
export function getWordGrammarDetails(item) {
  if (!item) {
    return {
      isVerb: false,
      dictForm: '',
      root: '',
      meaning: '',
      pos: '',
      vowelHarmony: 'neutral',
      vowelHarmonyLabel: '中性母音語',
      derivation: ''
    };
  }

  const m = (item.mongolian || item.baseWord || item.word || item.dictForm || '').trim();
  const pos = (item.pos || (item.kind === 'verb' || (item.category && item.category.startsWith('verb')) ? '動詞' : (item.kind === 'noun' ? '名詞' : ''))).trim();
  let meaning = (item.japanese || item.baseMeaning || item.meaning || item.meaning_ja || item.translation || '').trim();
  const isV = isVerb(item);

  // 1. 辞書形（見出し語・lemma）
  let dictForm = item.dictForm || item.baseWord || m;
  if (dictForm.includes(',')) {
    dictForm = dictForm.split(',')[0].trim();
  }
  if (dictForm.includes('(') && dictForm.includes(')')) {
    if (isV) {
      dictForm = dictForm.replace(/\((\w+)\)/g, '$1');
    } else {
      dictForm = dictForm.replace(/\s*\([^)]*\)/g, '').trim();
    }
  }

  // 否定語・完了形等の誤丸め込み防止セーフティガード（例: байхгүй が байх に丸められるのを防止）
  if (m.endsWith('гүй') && !dictForm.endsWith('гүй')) {
    dictForm = m;
  }
  if (m === 'байна' && dictForm === 'байх') {
    dictForm = 'байна';
  }
  if (m === 'болчихлоо' && dictForm === 'болох') {
    dictForm = 'болчихлоо';
  }

  // 2. 語幹（活用の土台）
  let root = '';
  if (isV) {
    if (item.root && !item.root.includes('(') && !item.root.includes(')')) {
      root = item.root.replace(/-/g, '').trim();
    } else if (dictForm === 'амрах') {
      root = 'амар';
    } else if (dictForm === 'амьдрах') {
      root = 'амьдар';
    } else if (dictForm === 'байх' || dictForm === 'байна' || dictForm === 'байхгүй') {
      root = 'бай';
    } else if (dictForm === 'болох' || dictForm === 'болохгүй' || dictForm === 'болчихлоо') {
      root = 'бол';
    } else if (dictForm.endsWith('ах') || dictForm.endsWith('эх') || dictForm.endsWith('ох') || dictForm.endsWith('өх') || dictForm.endsWith('их')) {
      root = dictForm.slice(0, -2);
    } else if (dictForm.endsWith('х')) {
      root = dictForm.slice(0, -1);
    } else {
      root = dictForm;
    }
  }

  // 意味が空の場合のStorageService語彙フォールバック
  if (!meaning && typeof StorageService !== 'undefined' && StorageService.getVocabulary) {
    try {
      const vocab = StorageService.getVocabulary();
      const match = vocab.find(v => (dictForm && (v.mongolian === dictForm || v.dictForm === dictForm)) || (m && (v.mongolian === m || v.dictForm === m)));
      if (match) {
        meaning = (match.japanese || match.baseMeaning || match.meaning || match.translation || '').trim();
      }
    } catch (_) {}
  }

  // 3. 母音調和の判定
  const vh = detectVowelHarmony(root || dictForm);
  const vhLabel = vh === 'male' ? '男性母音語' : (vh === 'female' ? '女性母音語' : '中性母音語');

  // 4. 形成過程の解説
  let derivation = item.derivation || '';
  if (!derivation) {
    if (isV) {
      if (root === 'амар') {
        derivation = `辞書形「${dictForm}」は、語幹「амар」に母音で始まる語尾（-ах）が接続した際に短母音「а」が脱落（амр ＋ ах ＝ амрах）した形です。活用の基本となる語幹は「амар」です（${vhLabel}）。`;
      } else if (root === 'амьдар') {
        derivation = `辞書形「${dictForm}」は、語幹「амьдар」に母音語尾（-ах）が接続した際に短母音「а」が脱落した形です。活用の基本となる語幹は「амьдар」です（${vhLabel}）。`;
      } else if (dictForm.includes(' ')) {
        derivation = `動詞句「${dictForm}」の活用部動詞の語幹は「${root}」です（${vhLabel}）。`;
      } else if (dictForm.endsWith('ах') || dictForm.endsWith('эх') || dictForm.endsWith('ох') || dictForm.endsWith('өх') || dictForm.endsWith('их')) {
        const suffix = dictForm.slice(-2);
        derivation = `辞書形「${dictForm}」は、語幹「${root}」に不定詞語尾「-${suffix}」（${vhLabel}調和）が接続した基本形です。活用語尾（-на/-нэ, -сан/-сэн, -ж/-ч等）はすべて語幹「${root}」に接続します。`;
      } else if (dictForm.endsWith('х')) {
        derivation = `辞書形「${dictForm}」は、長母音・二重母音の語幹「${root}」に不定詞語尾「-х」が接続した基本形です（${vhLabel}）。母音で始まる活用語尾の前には隠れ「г」が現れます。`;
      } else {
        derivation = `動詞「${dictForm}」の活用の土台となる語幹は「${root}」です（${vhLabel}）。`;
      }
    } else {
      if (m.includes('(н)')) {
        derivation = `基本の主格（辞書形）は「${dictForm}」です。属格（-ны）や造格（-аар）などの格変化時に隠れ-нが現れます。`;
      } else if (m.includes('(г)')) {
        derivation = `基本の主格（辞書形）は「${dictForm}」です。奪格（-гаас）などの格変化時に隠れ-гが現れます。`;
      } else {
        derivation = `見出し語「${dictForm}」（${pos || '名詞'}）。`;
      }
    }
  }

  return {
    isVerb: isV,
    dictForm,
    root,
    meaning,
    pos,
    vowelHarmony: vh,
    vowelHarmonyLabel: vhLabel,
    derivation,
    rawMongolian: m
  };
}

/**
 * 厳密かつ柔軟な正解判定
 * - 括弧（...）の入力は一切不要
 * - 動詞の語幹を問う場合：語幹のキリル文字が一致しているか判定（ハイフン-の有無は不問、活用語尾付きは不可）
 * - 名詞等の場合：括弧を除去した形や隠れ-н付きの双方を正解として認識
 */
export function isWordAnswerMatch(userAnswer, item, mode) {
  if (!userAnswer || !item) return false;
  const u = userAnswer.trim().toLowerCase().replace(/[.,!?。、！？\s]/g, '').replace(/[«»"']/g, '');
  if (!u) return false;

  const details = getWordGrammarDetails(item);

  if (mode === 'root_input' || (mode === 'ja_to_mn' && details.isVerb)) {
    // 動詞の語幹を回答対象とする場合
    const uClean = u.replace(/-/g, '');
    const rClean = details.root.toLowerCase().replace(/-/g, '').trim();

    // 語幹完全一致
    if (uClean === rClean) return true;
    if (uClean === rClean.replace(/\s+/g, '')) return true;

    // 動詞句の場合（例: dictForm: "хоолоор дайлах", root: "дайл"）
    // ユーザーが句全体語幹 "хоолоор дайл" と入力した場合も、動詞語幹 "дайл" と入力した場合も正解
    if (details.dictForm.includes(' ') || rClean.includes(' ')) {
      const dictWords = details.dictForm.toLowerCase().split(/\s+/);
      const prefix = dictWords.slice(0, -1).join('');
      if (uClean === prefix + rClean.replace(/\s+/g, '')) return true;
      if (uClean === rClean.replace(/\s+/g, '')) return true;

      // 語幹側が複数単語の場合の末尾語幹単体入力
      const rParts = rClean.split(/\s+/);
      if (uClean === rParts[rParts.length - 1]) return true;
    }

    // 母音脱落動詞（例: "амар" に対し "амр"）
    if (details.dictForm === 'амрах' && (uClean === 'амар' || uClean === 'амр')) return true;
    if (details.dictForm === 'амьдрах' && (uClean === 'амьдар' || uClean === 'амьдр')) return true;

    return false;
  }

  if (mode === 'ja_to_mn') {
    // 0. acceptableAnswers が定義されている場合
    if (item.acceptableAnswers && Array.isArray(item.acceptableAnswers)) {
      for (const ans of item.acceptableAnswers) {
        const aClean = ans.toLowerCase().replace(/[.,!?。、！？\s«»"']/g, '');
        if (u === aClean) return true;
      }
    }

    // 非動詞のキリル文字入力（括弧不要）
    const dClean = details.dictForm.toLowerCase().replace(/[.,!?。、！？\s]/g, '');
    if (u === dClean) return true;

    // 原文そのまま（例: ユーザーが цаас(н) と打った場合も正解）
    const rawClean = item.mongolian.toLowerCase().replace(/[.,!?。、！？\s]/g, '');
    if (u === rawClean) return true;

    // 隠れ-н の形（例: цаасан）
    if (item.mongolian.includes('(н)')) {
      const withN = details.dictForm.toLowerCase() + 'н';
      if (u === withN) return true;
    }

    // ----------------------------------------------------
    // 文化・日常語の同義語・別表記の柔軟判定
    // ----------------------------------------------------
    // 1. お茶（スーテーツァイ / ミルクティー）:
    //    モンゴル文化では「お茶(цай)」は伝統ミルクティー「сүүтэй цай」を指すため完全相互許容
    const jaLower = (item.japanese || '').toLowerCase();
    const isTeaQuestion = dClean === 'цай' || rawClean === 'цай' || dClean === 'сүүтэйцай' || 
                          jaLower.includes('お茶') || jaLower.includes('ツァイ') || jaLower.includes('ミルクティー');
    if (isTeaQuestion) {
      if (u === 'цай' || u === 'сүүтэйцай' || u === 'сүүтэй') return true;
    }

    // 2. 挨拶・御礼の柔軟表現
    if (dClean === 'баярлалаа' && (u === 'ихбаярлалаа' || u === 'талархлаа')) return true;
    if (dClean === 'сайнбайнауу' && (u === 'сайнуу' || u === 'сайнбайна')) return true;
    if (dClean === 'сайнуу' && (u === 'сайнбайнауウ' || u === 'сайнбайна')) return true;
    if (dClean === 'баяртай' && (u === 'дараауулзъя' || u === 'маргаашуулзъя')) return true;

    return false;
  }

  if (mode === 'mn_to_ja') {
    // 日本語訳判定
    const uClean = u.replace(/\s+/g, '');
    const targets = item.japanese.toLowerCase().split(/[/／,、()（）]/).map(s => s.trim().replace(/\s+/g, '')).filter(Boolean);
    if (targets.some(t => uClean.includes(t) || t.includes(uClean))) return true;

    if (item.acceptableAnswers && Array.isArray(item.acceptableAnswers)) {
      for (const ans of item.acceptableAnswers) {
        const aClean = ans.toLowerCase().replace(/[.,!?。、！？\s]/g, '');
        if (uClean.includes(aClean) || aClean.includes(uClean)) return true;
      }
    }
    return false;
  }

  return false;
}

/**
 * リスニング問題の厳密かつ柔軟な正解判定
 * - 穴埋めモード: 空欄語、許容解、数字（5000等）の一致を判定
 * - ディクテーションモード: 全文、空欄語、数字、表記揺れの判定
 */
export function isListeningAnswerMatch(userAnswer, quizItem, mode = 'blank') {
  if (!userAnswer || !quizItem) return false;
  const clean = s => (s || '').toString().trim().toLowerCase()
    .replace(/[.,!?。、！？«»"':;]/g, '')
    .replace(/\s+/g, ' ');
  const cleanTight = s => clean(s).replace(/\s+/g, '');

  const u = clean(userAnswer);
  const uTight = cleanTight(userAnswer);
  if (!uTight) return false;

  // 1. 候補リストの作成
  const candidates = [];
  if (quizItem.blankWord) candidates.push(quizItem.blankWord);
  if (quizItem.answer) candidates.push(quizItem.answer);
  if (quizItem.numericAnswer) {
    candidates.push(quizItem.numericAnswer);
    candidates.push(quizItem.numericAnswer.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'));
    candidates.push(`${quizItem.numericAnswer} төгрөг`);
    candidates.push(`${quizItem.numericAnswer}төгрөг`);
  }
  if (quizItem.acceptableAnswers && Array.isArray(quizItem.acceptableAnswers)) {
    candidates.push(...quizItem.acceptableAnswers);
  }
  if (mode === 'dictation') {
    if (quizItem.dictationText) candidates.push(quizItem.dictationText);
    if (quizItem.sentence) candidates.push(quizItem.sentence.replace(/[\[\]]/g, ''));
    if (quizItem.audioText) candidates.push(quizItem.audioText);
  }

  // 2. 比較判定（スペース・記号の違いを柔軟に許容）
  for (const c of candidates) {
    const cClean = clean(c);
    const cTight = cleanTight(c);
    if (u === cClean || uTight === cTight) return true;

    // ディクテーション時: 類似度ファジー判定
    if (mode === 'dictation' && cTight.length >= 4 && uTight.length >= 4) {
      if (isFuzzyMatch(uTight, cTight)) return true;
    }
  }

  return false;
}

/**
 * 解説HTML生成（要件を満たす6項目の明瞭な表示）
 * 1. 正解
 * 2. 動詞の語幹
 * 3. 辞書形（見出し語・lemma）
 * 4. 日本語の意味
 * 5. 必要な場合は動詞の活用や文法の説明
 * 6. 語幹から正解の形が作られる過程
 */
/**
 * 単語の成り立ち・語の構成（2語以上の複合語、派生語、接尾辞結合）を解析してHTMLカードを生成
 */
export function getWordEtymologyHTML(item, targetWord) {
  if (!item && !targetWord) return '';

  const mn = ((item && (item.mongolian || item.dictForm)) || targetWord || '').trim();
  const ja = ((item && item.japanese) || '').trim();
  const deriv = (item && (item.etymologyBreakdown || item.derivation)) || '';
  const note = (item && item.note) || '';

  let breakdown = '';

  // 1. 明示的な分解式（「＋」または「+」を含む場合）
  if (deriv && (deriv.includes('＋') || deriv.includes('+') || deriv.includes('＝') || deriv.includes('='))) {
    breakdown = deriv;
  } else if (note && (note.includes('＋') || note.includes('+') || note.includes('構成:'))) {
    breakdown = note;
  } else if (deriv && (deriv.includes('語幹') || deriv.includes('接尾辞') || deriv.includes('派生'))) {
    breakdown = deriv;
  }

  // 2. スペースを含む複合語（一語以上で成り立っている単語）の動的補完
  if (!breakdown && mn.includes(' ')) {
    const tokens = mn.replace(/[\(\)\,\.\/\?]/g, ' ').split(/\s+/).filter(Boolean);
    if (tokens.length >= 2) {
      // initialVocabulary または内部辞書からトークンを検索
      let vocabList = [];
      try {
        if (typeof initialVocabulary !== 'undefined') vocabList = initialVocabulary;
        else if (typeof StorageService !== 'undefined') vocabList = StorageService.getVocabulary();
      } catch (_) {}

      const parts = tokens.map(t => {
        const cleanT = t.toLowerCase();
        let meaning = '';
        if (vocabList && vocabList.length > 0) {
          const match = vocabList.find(w => (w.mongolian || '').toLowerCase() === cleanT || (w.dictForm || '').toLowerCase() === cleanT);
          if (match && match.japanese) {
            meaning = match.japanese.split(/[、,（(]/)[0].trim();
          }
        }
        return meaning ? `「${t}（${meaning}）」` : `「${t}」`;
      });

      breakdown = parts.join(' ＋ ') + (ja ? ` ＝ 【${ja}】` : '');
    }
  }

  if (!breakdown) return '';

  return `
    <div class="mt-2.5 p-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50/70 border border-amber-300/80 text-xs space-y-1.5 shadow-2xs etymology-breakdown-card">
      <div class="font-black text-amber-950 flex items-center gap-1.5">
        <span>🧩</span> 単語の成り立ち・構成:
      </div>
      <div class="font-bold text-slate-900 leading-relaxed cyrillic-text text-xs sm:text-sm pl-2 border-l-2 border-amber-400">
        ${breakdown}
      </div>
    </div>
  `;
}

if (typeof window !== 'undefined') {
  window.getWordEtymologyHTML = getWordEtymologyHTML;
}

export const MNEMONICS_MAP = {
  "агаарын хэм": "大気（агаар）の目盛り（хэм）＝「【気温】」！",
  "жигнэмэг": "オーブンで【じっくり（жигнэ-）】焼いた【ビスケット・クッキー】！",
  "хүрэм": "寒い冬に体を包む【フレーム（хүрэм）】のような【上着・ジャケット】！",
  "банзал": "おしゃれで【バンザイ（банзал）】したくなる【スカート】！",
  "зоогийн газар": "ごちそう（зоог）を食べる場所（газар）＝「【レストラン・飲食店】」！",
  "галт тэрэгний буудал": "火の車（列車）が発着する場所（буудал）＝「【鉄道駅】」！",
  "гэмт хэрэг судлал": "犯罪（гэмт хэрэг）を研究（судлал）する＝「【犯罪学】」！",
  "гэмт хэрэг": "「悪い罪（гэмт）＋事柄（хэрэг）＝【犯罪・事件】」！",
  "хөл": "足で穴を【掘る（хөл）】！",
  "гар": "手からビームが【出る（гар）】！",
  "толгой": "頭を【取るごい（толгой）】！",
  "нүд": "【目】を【ぬーど（нүд）】で見つめる／目を濡らす！",
  "чих": "【耳】を【ちく（чих）】っと刺される！",
  "хамар": "鼻が【ハマる（хамар）】！",
  "ам": "口を【アム（ам）】っと開けて食べる！",
  "шүд": "歯を【シュッ（шүд）】と磨く！",
  "үс": "髪の毛が【薄（үс）】い！",
  "өсгий": "【オス】が踏ん張る【踵（өсгий）】！",
  "хөлийн өсгий": "足（хөл）の踵（өсгий）＝「オスが踏ん張る足のかかと」！",
  "зүрх": "胸が【ずるっ（зүрх）】とするほど高鳴る【心臓・ハート】！",
  "гэдэс": "お腹を【下駄です（гэдэс）】と叩く【お腹・胃】！",
  "нуруу": "【ぬる（нуруу）】っと曲がる【背中・背骨】！",
  "хэл": "【口から出る言葉・舌】を【ヘル（хэл）】プと叫ぶ！",
  "гар хуруу": "手（гар）の指（хуруу）＝「手から出る指」！",
  "тоос": "埃が隙間を【通す（тоос）】！",
  "тоос сорогч": "埃（トース）を吸う（ソログ）器具（チ）＝「埃吸い取りマシン」！",
  "толь": "自分の姿を【取り（толь）】映す【鏡】！",
  "толь бичиг": "照合する鏡（толь）＋文字の本（бичиг）＝「真実を映す辞書」！",
  "гар утас": "手（гар）の電話コード（утас）＝「手のひら携帯電話」！",
  "цахилгаан шат": "電気（цахилгаан）の階段（шат）＝「動く電気階段（エレベーター）」！",
  "ус буцалгагч": "水（ус）を沸かす（буцалгах）器具（-гч）＝「湯沸かしケトル」！",
  "угаалгын машин": "洗濯（угаалга）の機械（машин）＝「洗濯機」！",
  "шүүгээ": "洋服をきれいに【収納（шүү）】する【棚・タンス】！",
  "хаалга": "ドアを開けて【はーいガ（хаалга）】ッチャ！",
  "цонх": "窓から【チョン（цонх）】と顔を出す【窓】！",
  "ор": "ベッドに【おっ（ор）】と飛び乗る【ベッド・寝台】！",
  "ширээ": "机に【しれっ（ширээ）】と座る【机・テーブル】！",
  "сандал": "椅子に【サンダル（сандал）】履いて座る【椅子】！",
  "зурагт": "絵（зураг）が動く箱（-т）＝「テレビ」！",
  "зурагтын удирдлага": "テレビ（зурагт）の操縦器（удирдлага）＝「テレビのリモコン」！",
  "мах": "【マハ】ラジャが食べる【肉（мах）】！",
  "ус": "【オス】の水／【押す】と出る【水（ус）】！",
  "цай": "お【茶い（цай）】かが？／お茶を【注い（цай）】で！",
  "сүү": "【スー】ッと一気に飲める【牛乳（сүү）】！",
  "давс": "料理に塩を【出す（давс）】！",
  "талх": "パンを【たる（талх）】ほど食べる【パン】！",
  "бууз": "肉まんのボーズを食べて【坊主（бууз）】も笑顔！",
  "хуушуур": "揚げ餃子を【ふーふー（хуушуур）】冷まして食べる！",
  "цуйван": "焼うどんのツォイワンを食べて【強いワン（цуйван）】！",
  "жимс": "果物を【ジューシー（жимс）】に味わう【果物・フルーツ】！",
  "ногоо": "野菜を食べて【のびのび成長（ногоо）】する【野菜】！",
  "өндөг": "卵を【おんぶ（өндөг）】する【卵】！",
  "гурил": "小麦粉を【ぐり（гурил）】ぐりこねる【小麦粉・麺】！",
  "цагаан будаа": "白い（цагаан）米（будаа）＝「白米・ごはん」！",
  "гал": "火が【ガール（гал）】ガール燃える／ガールと囲む焚き火！",
  "цас": "雪が【さーっ（цас）】と降る【雪】！",
  "бороо": "雨に濡れて服が【ボロ（бороо）】ボロ！",
  "салхи": "風に乗って【猿飛（салхи）】佐助が飛ぶ【風】！",
  "нар": "空で太陽が【鳴る（нар）】！",
  "сар": "【月（сар）】で【サル】が餅つき！",
  "од": "夜空の星の輝きに【オド（од）】ろく！",
  "уул": "高い【山（уул）】を見て【ウール（уул）】トラマンもびっくり！",
  "гол": "【川（гол）】を渡って【ゴール（гол）】！",
  "мод": "【木（мод）】に登る【モード（мод）】！",
  "цэцэг": "花を【ツェツェ（цэцэг）】と愛でる【花】！",
  "өдөр": "昼間に元気に【踊る（өдөр）】！",
  "шөнө": "夜は静かに【しょん（шөнө）】ぼり！",
  "маргааш": "明日の予定は【丸がし（маргааш）】！",
  "өнөөдөр": "今日の予定は【おのー（өнөөдөр）】これだ！",
  "өчигдөр": "昨日のことを【おちついて（өчигдөр）】思い出す！",
  "хүйтэн": "寒い日は【食う手（хүйтэн）】がかじかむ【寒い・冷たい】！",
  "халуун": "暑い日は【はる（халуун）】か彼方に逃げたい【暑い・熱い】！",
  "нохой": "犬が庭に【野放（нохой）】し！",
  "муур": "猫が【モール（муур）】で買い物／ニャーと鳴くムール！",
  "морь": "馬が【森（морь）】を颯爽と駆ける！",
  "хонь": "羊に【骨（хонь）】なし、ふわふわウール！",
  "ямаа": "山羊が【山（ямаа）】を軽快に登る！",
  "үхэр": "牛が大きくて【ウヒャー（үхэр）】と驚く！",
  "тэмээ": "ラクダに乗って【てめえ（тэмээ）】どこ行く！",
  "шувуу": "鳥が空を【しゅーっ（шувуу）】と飛ぶ！",
  "загас": "魚が川を【ザガ（загас）】スザガス泳ぐ【魚】！",
  "чоно": "狼に【ちょの（чоно）】っと注意！",
  "баавгай": "熊が【バア（баавгай）】と現れる【熊】！",
  "явах": "【ヤバ（явах）】い、もう【行か】なきゃ！",
  "ирэх": "友達が家に【入れ（ирэх）】ば【来る】！",
  "идэх": "ご飯をいただきますと【食べる（идэх）】！",
  "уух": "ウーロン茶を【ウー（уух）】と【飲む】！",
  "унших": "本を【うんしょ（унших）】と抱えて【読む】！",
  "бичих": "鉛筆で【びっしり（бичих）】ノートに【書く】！",
  "мэдэх": "【目玉（мэдэх）】で見て【知る】！",
  "ойлгох": "【オイル（ойлгох）】の仕組みが【分かる・理解する】！",
  "бодох": "【僕（бодох）】が【思う・考える】に…！",
  "унтах": "【うん（унтах）】とぐっすり【寝る】！",
  "босох": "朝【ボサーッ（босох）】と【起きる・立つ】！",
  "суух": "椅子に【すーっ（суух）】と【座る】！",
  "зогсох": "車が【続々（зогсох）】と【止まる】！",
  "үзэх": "テレビを【うずうず（үзэх）】しながら【見る・試す】！",
  "сонсох": "【そん（сонсох）】な面白い話を【聞く】！",
  "өгөх": "人にプレゼントを【おごる（өгөх）】ように【あげる・渡す】！",
  "авах": "お小遣いを【暴（авах）】れるほど【もらう・取る】！",
  "харах": "【はる（харах）】か遠くを【見る】！",
  "зарах": "バザーで【皿（зарах）】を【売る】！",
  "ажиллах": "仕事（ажил）に【汗流（ажиллах）】して【働く】！",
  "сурах": "学校で【すらすら（сурах）】【学ぶ・習う】！",
  "хийх": "何でも【ひいひい（хийх）】言いながら【する・作る】！",
  "хэлэх": "真実を【へる（хэлэх）】ぷと【言う】！",
  "маллах": "家畜（мал）を【まったり（маллах）】【飼育する】！",
  "инээх": "【いいねー（инээх）】と楽しそうに【笑う】！",
  "уйлах": "悲しくて【初々（уйлах）】しく【泣く】！",
  "айх": "お化けを見て【アイヤ〜（айх）】と【怖がる】！",
  "дурлах": "好きな人に【ド直球（дурлах）】で【恋する】！",
  "бахархах": "友達の活躍を【バッチリ（бахархах）】【誇る】！",
  "цангах": "喉が渇いて【ツァン（цангах）】と水が飲みたい！",
  "мөрөөдөх": "未来の夢を【もうロード（мөрөөдөх）】のように【夢見る】！",
  "хичээх": "勉学を【ひーひー知恵（хичээх）】絞って【努力する】！",
  "сайн": "良いことの【サイン（сайн）】！",
  "муу": "悪いことして牛が【モー（муу）】と鳴く！",
  "их": "【一歩（их）】が大きい・【多い】！",
  "бага": "【バカ（бага）】にするなと【小さい】子が怒る！",
  "өндөр": "【温度る（өндөр）】ほど熱気【高い】！",
  "намхан": "【波（намхан）】が静かで【低い】！",
  "сайхан": "【最上（сайхан）】に【美しい・素敵だ】！",
  "хурдан": "【車（хурдан）】のように【速い】！",
  "удаан": "【うだ（удаан）】うだして【遅い】！",
  "хямдхан": "値段が【百円（хямдхан）】で【安い】！",
  "үнэтэй": "真実の価値（үнэ）を持つ（-тэй）＝「【値段が高い・貴重だ】」！",
  "сайхан амттай": "素敵（сайхан）＋味（амт）＋ある（-тай）＝「【美味しい】」！",
  "муухай": "【むむっ（муухай）】と顔をしかめる【不気味な・まずい】！",
  "дажгүй": "【ダシ（дажгүй）】が効いて【まぁまぁ・悪くない】！",
  "гайхалтай": "驚き（гайх-）に値する（-лтай）＝「【素晴らしい・すごい】」！",
  "энгийн": "飾りのない平素（энг）＝「【普通・簡単・シンプル】」！",
  "хар": "【春（хар）】なのに【黒】い服！",
  "шар": "【黄色】い【シャル（шар）】ロット！",
  "цагаан": "【白】を【ツァガ（цагаан）】っと塗る！",
  "улаан": "【ウラン（улаан）】バートルの【赤】！",
  "хөх": "【コック（хөх）】さんの【青】いエプロン！",
  "ногоон": "大草原の草（ногоо）の色＝「【緑】」！",
  "юу": "【ゆう（юу）】べ【何】があった？",
  "хэн": "【変（хэн）】な人は【誰】？",
  "хаана": "【鼻（хаана）】は【どこ】？",
  "хэзээ": "【風邪（хэзээ）】は【いつ】治る？",
  "яагаад": "【嫌が（яагаад）】るのに【なぜ】？",
  "ямар": "【やまる（ямар）】（止まる）のは【どんな】車？",
  "хэд": "お菓子が減って【いくつ（хэд）】残った？",
  "аль": "【有る（аль）】選択肢の【どちら】？",
  "баярлалаа": "バナナやるからラララ〜と【ありがとう（баярлалаа）】！",
  "баярлалаа.": "バナナやるからラララ〜と【ありがとう（баярлалаа）】！",
  "уучлаарай": "お茶（ууча）をこぼして【すみません（уучлаарай）】！",
  "баяртай": "バイバイしたい【さようなら（баяртай）】！",
  "тийм": "チームの決定に「【はい、そうです（тийм）】」！",
  "үгүй": "ウグイスが「【いいえ（үгүй）】」と鳴く！",
  "зүгээр": "お礼を言われて「【ズバリ大丈夫（зүгээр）】」！",
  "тийм шүү": "そう（тийм）＋強調（шүү）＝「【その通り・確かにそうだよね】」！",
  "үнэн шүү": "本当（үнэн）＋強調（шүү）＝「【本当だよね・確かに】」！",
  "магадгүй": "公算（магад）＋なし（-гүй）＝「【多分・おそらく】」！",
  "ёстой": "礼儀・道理（ёс）＋ある（-той）＝「【当然・本当に・〜すべき】」！",
  "би": "【美（би）】しい【私】！",
  "чи": "【ち（чи）】み【君】！",
  "та": "【他（та）】人行儀に丁寧に【あなた】！",
  "тэр": "【照れ（тэр）】屋の【あの人・彼・彼女】！",
  "бид": "【ビビッ（бид）】と団結する【私たち】！",
  "аав": "【あー（аав）】頼れる【父】さん！",
  "ээж": "【えー（ээж）】優しい【母】さん！",
  "хүү": "腕白な息子に【ふーっ（хүү）】とため息！",
  "охин": "【お品（охин）】の良い【娘・女の子】！",
  "ах": "【あっ（ах）】と頼れる【兄・年上男性】！",
  "эгч": "【えっ（эгч）】と驚く美人な【姉・年上女性】！",
  "дүү": "年下の【弟・妹（дүү）】にぎゅー（дүү）っとハグ！",
  "өвөө": "【おー（өвөө）】元気な【おじいちゃん】！",
  "эмээ": "【えみ（эмээ）】がこぼれる【おばあちゃん】！",
  "багш": "【バッジ（багш）】をつけた偉大な【先生】！",
  "найз": "【ナイス（найз）】な【友達】！"
};

/**
 * 語呂合わせ・覚えやすい仕組みを解析してHTMLカードを生成
 */
export function getWordMnemonicHTML(item, targetWord) {
  let mnemonic = (item && item.mnemonic) ? String(item.mnemonic).trim() : '';

  if (!mnemonic) {
    const rawWord = ((item && (item.mongolian || item.dictForm)) || targetWord || '').trim();
    const cleanWord = rawWord.toLowerCase().replace(/[\(\)\（\）\s.,!?-]/g, '');
    const cleanRaw = rawWord.toLowerCase().replace(/[.,!?]/g, '').trim();

    if (MNEMONICS_MAP[cleanRaw]) {
      mnemonic = MNEMONICS_MAP[cleanRaw];
    } else if (MNEMONICS_MAP[cleanWord]) {
      mnemonic = MNEMONICS_MAP[cleanWord];
    } else {
      try {
        let vocabList = [];
        if (typeof initialVocabulary !== 'undefined') vocabList = initialVocabulary;
        else if (typeof StorageService !== 'undefined') vocabList = StorageService.getVocabulary();

        const match = vocabList.find(w => {
          const wMn = (w.mongolian || '').toLowerCase().replace(/[\(\)\（\）\s.,!?-]/g, '');
          const wDf = (w.dictForm || '').toLowerCase().replace(/[\(\)\（\）\s.,!?-]/g, '');
          return w.mnemonic && (wMn === cleanWord || wDf === cleanWord);
        });
        if (match && match.mnemonic) {
          mnemonic = match.mnemonic;
        }
      } catch (_) {}
    }
  }

  if (!mnemonic) return '';

  return `
    <div class="mt-2.5 p-3 rounded-xl bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50/70 border border-amber-300/90 text-xs space-y-1 shadow-2xs mnemonic-card">
      <div class="font-black text-amber-950 flex items-center gap-1.5">
        <span>💡</span> 語呂合わせ・楽しい覚え方:
      </div>
      <div class="font-bold text-amber-900 leading-relaxed text-xs sm:text-sm pl-2 border-l-2 border-amber-400">
        ${mnemonic}
      </div>
    </div>
  `;
}

if (typeof window !== 'undefined') {
  window.MNEMONICS_MAP = MNEMONICS_MAP;
  window.getWordMnemonicHTML = getWordMnemonicHTML;
}

/**
 * 単語イラスト・ビジュアルアイコン完全対応マッピング
 * すべての単語帳、解説カード、フラッシュカード、復習ノートで直感的なイメージ記憶を支援
 */
export const WORD_ILLUSTRATIONS = {
  // === 身体の部位 (Body Parts) ===
  'гар': { icon: '🖐️', label: '手・腕', bg: 'from-amber-50 to-orange-50' },
  'толгой': { icon: '🧠', label: '頭・頭部', bg: 'from-purple-50 to-pink-50' },
  'үс': { icon: '💇', label: '髪の毛', bg: 'from-slate-50 to-stone-50' },
  'хөмсөг': { icon: '〰️', label: '眉毛', bg: 'from-amber-50 to-yellow-50' },
  'нүд': { icon: '👁️', label: '目', bg: 'from-sky-50 to-blue-50' },
  'чих': { icon: '👂', label: '耳', bg: 'from-rose-50 to-pink-50' },
  'хамар': { icon: '👃', label: '鼻', bg: 'from-orange-50 to-amber-50' },
  'ам': { icon: '👄', label: '口', bg: 'from-rose-50 to-red-50' },
  'уруул': { icon: '💋', label: '唇', bg: 'from-rose-50 to-red-50' },
  'шүд': { icon: '🦷', label: '歯', bg: 'from-cyan-50 to-sky-50' },
  'хэл': { icon: '👅', label: '舌・言葉', bg: 'from-rose-50 to-pink-50' },
  'хүзүү': { icon: '🧣', label: '首', bg: 'from-teal-50 to-emerald-50' },
  'мөр': { icon: '🤷', label: '肩', bg: 'from-indigo-50 to-blue-50' },
  'цээж': { icon: '🫁', label: '胸', bg: 'from-cyan-50 to-teal-50' },
  'хөх': { icon: '🤱', label: '胸・乳房', bg: 'from-pink-50 to-rose-50' },
  'гэдэс': { icon: '🤰', label: 'お腹', bg: 'from-emerald-50 to-teal-50' },
  'хүйс': { icon: '🔘', label: 'へそ', bg: 'from-amber-50 to-yellow-50' },
  'нуруу': { icon: '🧍', label: '背中・腰', bg: 'from-blue-50 to-indigo-50' },
  'бүсэлхий': { icon: '🥋', label: '腰', bg: 'from-violet-50 to-purple-50' },
  'хөл': { icon: '🦶', label: '足・脚', bg: 'from-amber-50 to-orange-50' },
  'өвдөг': { icon: '🦵', label: '膝', bg: 'from-orange-50 to-yellow-50' },
  'гуя': { icon: '🦵', label: '太もも', bg: 'from-amber-50 to-orange-50' },
  'тохой': { icon: '💪', label: '肘', bg: 'from-blue-50 to-sky-50' },
  'гарын шуу': { icon: '💪', label: '腕・前腕', bg: 'from-blue-50 to-cyan-50' },
  'гарын алга': { icon: '🤲', label: '手のひら', bg: 'from-amber-50 to-yellow-50' },
  'хөлийн ул': { icon: '👣', label: '足の裏', bg: 'from-stone-50 to-slate-50' },
  'хөлийн өсгий': { icon: '🦶', label: 'かかと', bg: 'from-amber-50 to-stone-50' },
  'шилбэ': { icon: '🦵', label: 'すね', bg: 'from-orange-50 to-amber-50' },
  'хуруу': { icon: '☝️', label: '指', bg: 'from-yellow-50 to-amber-50' },
  'хумс': { icon: '💅', label: '爪', bg: 'from-pink-50 to-rose-50' },
  'хөлийн хуруу': { icon: '🦶', label: '足の指', bg: 'from-amber-50 to-orange-50' },
  'зүрх': { icon: '🫀', label: '心臓・心', bg: 'from-rose-50 to-red-50' },
  'ходоод': { icon: '🥣', label: '胃', bg: 'from-orange-50 to-amber-50' },
  'тархи': { icon: '🧠', label: '脳', bg: 'from-purple-50 to-pink-50' },
  'яс': { icon: '🦴', label: '骨', bg: 'from-slate-50 to-zinc-50' },
  'цус': { icon: '🩸', label: '血', bg: 'from-red-50 to-rose-50' },
  'арьс': { icon: '🧖', label: '皮膚', bg: 'from-amber-50 to-orange-50' },
  'дух': { icon: '👤', label: '額（おでこ）', bg: 'from-blue-50 to-indigo-50' },
  'хацар': { icon: '😊', label: '頬（ほっぺ）', bg: 'from-pink-50 to-rose-50' },
  'эрүү': { icon: '🧔', label: '顎（あご）', bg: 'from-slate-50 to-zinc-50' },
  'нүүр': { icon: '🙂', label: '顔', bg: 'from-yellow-50 to-amber-50' },
  'бие': { icon: '🧍', label: '体・身体', bg: 'from-emerald-50 to-teal-50' },
  'цангах': { icon: '🥤', label: '喉が渇く', bg: 'from-cyan-50 to-sky-50' },
  'цангалаа': { icon: '🥤', label: '喉が渇いた', bg: 'from-cyan-50 to-sky-50' },

  // === 学校・文具・教室 (School & Stationery) ===
  'ном': { icon: '📖', label: '本', bg: 'from-purple-50 to-indigo-50' },
  'дэвтэр': { icon: '📓', label: 'ノート', bg: 'from-blue-50 to-sky-50' },
  'үзэг': { icon: '✒️', label: 'ペン・万年筆', bg: 'from-slate-50 to-stone-50' },
  'харандаа': { icon: '✏️', label: '鉛筆', bg: 'from-amber-50 to-yellow-50' },
  'баллуур': { icon: '🧼', label: '消しゴム', bg: 'from-teal-50 to-emerald-50' },
  'шугам': { icon: '📏', label: '定規', bg: 'from-sky-50 to-cyan-50' },
  'хайч': { icon: '✂️', label: 'ハサミ', bg: 'from-rose-50 to-red-50' },
  'цүнх': { icon: '🎒', label: 'カバン・リュック', bg: 'from-orange-50 to-amber-50' },
  'ширээ': { icon: '🪑', label: '机', bg: 'from-amber-50 to-yellow-50' },
  'сандал': { icon: '🪑', label: '椅子', bg: 'from-stone-50 to-zinc-50' },
  'самбар': { icon: '📋', label: '黒板・掲示板', bg: 'from-emerald-50 to-green-50' },
  'сургууль': { icon: '🏫', label: '学校', bg: 'from-blue-50 to-indigo-50' },
  'их сургууль': { icon: '🏛️', label: '大学', bg: 'from-indigo-50 to-purple-50' },
  'анги': { icon: '🏫', label: '教室・学級', bg: 'from-sky-50 to-blue-50' },
  'багш': { icon: '👨‍🏫', label: '先生・教師', bg: 'from-emerald-50 to-teal-50' },
  'оюутан': { icon: '🧑‍🎓', label: '学生・大学生', bg: 'from-cyan-50 to-sky-50' },
  'сурагч': { icon: '🎒', label: '児童・生徒', bg: 'from-amber-50 to-yellow-50' },
  'хичээл': { icon: '📚', label: '授業・レッスン', bg: 'from-purple-50 to-pink-50' },
  'шалгалт': { icon: '📝', label: '試験・テスト', bg: 'from-rose-50 to-red-50' },
  'диплом': { icon: '📜', label: '学位・卒業証書', bg: 'from-amber-50 to-yellow-50' },
  'боловсрол': { icon: '🎓', label: '教育', bg: 'from-blue-50 to-indigo-50' },
  'толь бичиг': { icon: '📕', label: '辞書', bg: 'from-red-50 to-rose-50' },

  // === 衣類・服飾品 (Clothing) ===
  'хувцас': { icon: '👕', label: '服・衣服', bg: 'from-blue-50 to-sky-50' },
  'цамц': { icon: '👔', label: 'シャツ', bg: 'from-sky-50 to-cyan-50' },
  'өмд': { icon: '👖', label: 'ズボン', bg: 'from-indigo-50 to-blue-50' },
  'банзал': { icon: '👗', label: 'スカート', bg: 'from-pink-50 to-rose-50' },
  'хүрэм': { icon: '🧥', label: 'ジャケット・上着', bg: 'from-amber-50 to-stone-50' },
  'пальто': { icon: '🧥', label: 'コート', bg: 'from-stone-50 to-slate-50' },
  'малгай': { icon: '🧢', label: '帽子', bg: 'from-teal-50 to-emerald-50' },
  'бээлий': { icon: '🧤', label: '手袋', bg: 'from-yellow-50 to-amber-50' },
  'ороолт': { icon: '🧣', label: 'マフラー', bg: 'from-rose-50 to-orange-50' },
  'гутал': { icon: '👞', label: '靴・ブーツ', bg: 'from-stone-50 to-amber-50' },
  'оймс': { icon: '🧦', label: '靴下', bg: 'from-purple-50 to-pink-50' },
  'дээл': { icon: '🥋', label: 'デール（民族衣装）', bg: 'from-emerald-50 to-teal-50' },
  'бүс': { icon: '🎗️', label: '帯・ベルト', bg: 'from-amber-50 to-yellow-50' },

  // === 食べ物・レストラン (Food & Dining) ===
  'талх': { icon: '🍞', label: 'パン', bg: 'from-amber-50 to-yellow-50' },
  'мах': { icon: '🥩', label: '肉', bg: 'from-rose-50 to-red-50' },
  'будаа': { icon: '🍚', label: 'ご飯・米', bg: 'from-stone-50 to-slate-50' },
  'сүү': { icon: '🥛', label: '牛乳・ミルク', bg: 'from-sky-50 to-blue-50' },
  'цай': { icon: '🍵', label: 'お茶・スーテイツァイ', bg: 'from-emerald-50 to-teal-50' },
  'ус': { icon: '💧', label: '水', bg: 'from-cyan-50 to-sky-50' },
  'шөл': { icon: '🍲', label: 'スープ', bg: 'from-orange-50 to-amber-50' },
  'өндөг': { icon: '🥚', label: '卵', bg: 'from-yellow-50 to-amber-50' },
  'загас': { icon: '🐟', label: '魚', bg: 'from-blue-50 to-cyan-50' },
  'бууз': { icon: '🥟', label: 'ボーズ（蒸し餃子）', bg: 'from-amber-50 to-yellow-50' },
  'хуушуур': { icon: '🥟', label: 'ホーショール（揚げ餃子）', bg: 'from-orange-50 to-amber-50' },
  'цуйван': { icon: '🍜', label: 'ツィワン（炒め麺）', bg: 'from-amber-50 to-orange-50' },
  'айраг': { icon: '🍶', label: 'アイラグ（馬乳酒）', bg: 'from-teal-50 to-cyan-50' },
  'ааруул': { icon: '🧀', label: 'アーロール（乾燥チーズ）', bg: 'from-yellow-50 to-amber-50' },
  'борц': { icon: '🥩', label: 'ボルツ（干し肉）', bg: 'from-stone-50 to-amber-50' },
  'хоол': { icon: '🍽️', label: '料理・食事', bg: 'from-rose-50 to-orange-50' },
  'чихэр': { icon: '🍬', label: 'お菓子・飴', bg: 'from-pink-50 to-rose-50' },
  'жигнэмэг': { icon: '🍪', label: 'ビスケット・クッキー', bg: 'from-amber-50 to-yellow-50' },
  'бялуу': { icon: '🎂', label: 'ケーキ', bg: 'from-pink-50 to-yellow-50' },
  'давс': { icon: '🧂', label: '塩', bg: 'from-slate-50 to-zinc-50' },
  'элсэн чихэр': { icon: '🧂', label: '砂糖', bg: 'from-amber-50 to-stone-50' },
  'шар айраг': { icon: '🍺', label: 'ビール', bg: 'from-amber-50 to-yellow-50' },
  'архи': { icon: '🍸', label: 'ウォッカ', bg: 'from-sky-50 to-indigo-50' },
  'дарс': { icon: '🍷', label: 'ワイン', bg: 'from-rose-50 to-red-50' },
  'өглөөний цай': { icon: '🍳', label: '朝食', bg: 'from-amber-50 to-yellow-50' },
  'өдрийн хоол': { icon: '🍱', label: '昼食', bg: 'from-emerald-50 to-teal-50' },
  'оройн хоол': { icon: '🍲', label: '夕食', bg: 'from-indigo-50 to-purple-50' },

  // === 日用品・家電・家具 (Appliances & Furniture) ===
  'гэр': { icon: '🛖', label: 'ゲル・家', bg: 'from-emerald-50 to-green-50' },
  'байшин': { icon: '🏠', label: '建物・一軒家', bg: 'from-blue-50 to-sky-50' },
  'өрөө': { icon: '🚪', label: '部屋', bg: 'from-slate-50 to-stone-50' },
  'үүд': { icon: '🚪', label: '玄関・入口', bg: 'from-amber-50 to-orange-50' },
  'хаалга': { icon: '🚪', label: 'ドア・扉', bg: 'from-amber-50 to-stone-50' },
  'цонх': { icon: '🪟', label: '窓', bg: 'from-cyan-50 to-sky-50' },
  'ор': { icon: '🛏️', label: 'ベッド', bg: 'from-indigo-50 to-blue-50' },
  'шүүгээ': { icon: '🗄️', label: 'タンス・棚', bg: 'from-amber-50 to-stone-50' },
  'толь': { icon: '🪞', label: '鏡', bg: 'from-sky-50 to-cyan-50' },
  'зурагт': { icon: '📺', label: 'テレビ', bg: 'from-slate-50 to-stone-50' },
  'хөргөгч': { icon: '🧊', label: '冷蔵庫', bg: 'from-cyan-50 to-blue-50' },
  'угаалгын машин': { icon: '🫧', label: '洗濯機', bg: 'from-sky-50 to-indigo-50' },
  'тоос сорогч': { icon: '🧹', label: '掃除機', bg: 'from-teal-50 to-emerald-50' },
  'утас': { icon: '📱', label: '電話・スマホ', bg: 'from-blue-50 to-indigo-50' },
  'гар утас': { icon: '📱', label: '携帯電話', bg: 'from-blue-50 to-cyan-50' },
  'компьютер': { icon: '💻', label: 'パソコン', bg: 'from-indigo-50 to-violet-50' },
  'аяга': { icon: '🥣', label: '茶碗・お椀', bg: 'from-sky-50 to-cyan-50' },
  'халбага': { icon: '🥄', label: 'スプーン', bg: 'from-amber-50 to-stone-50' },
  'сэрээ': { icon: '🍴', label: 'フォーク', bg: 'from-slate-50 to-zinc-50' },
  'хутга': { icon: '🔪', label: 'ナイフ', bg: 'from-red-50 to-rose-50' },
  'тогоо': { icon: '🍳', label: '鍋・フライパン', bg: 'from-stone-50 to-slate-50' },
  'данх': { icon: '🫖', label: 'やかん・ポット', bg: 'from-amber-50 to-orange-50' },

  // === 果物・野菜 (Fruits & Vegetables) ===
  'алим': { icon: '🍎', label: 'りんご', bg: 'from-red-50 to-rose-50' },
  'жүрж': { icon: '🍊', label: 'オレンジ・みかん', bg: 'from-orange-50 to-amber-50' },
  'гадил': { icon: '🍌', label: 'バナナ', bg: 'from-yellow-50 to-amber-50' },
  'гүзээлзгэнэ': { icon: '🍓', label: 'いちご', bg: 'from-rose-50 to-red-50' },
  'усан үзэм': { icon: '🍇', label: 'ぶどう', bg: 'from-purple-50 to-indigo-50' },
  'тарвас': { icon: '🍉', label: 'スイカ', bg: 'from-emerald-50 to-red-50' },
  'төмс': { icon: '🥔', label: 'じゃがいも', bg: 'from-amber-50 to-yellow-50' },
  'сонгино': { icon: '🧅', label: '玉ねぎ', bg: 'from-stone-50 to-amber-50' },
  'лууван': { icon: '🥕', label: 'にんじん', bg: 'from-orange-50 to-amber-50' },
  'байцаа': { icon: '🥬', label: 'キャベツ', bg: 'from-emerald-50 to-teal-50' },
  'өргөст хэмх': { icon: '🥒', label: 'きゅうり', bg: 'from-green-50 to-emerald-50' },
  'улаан лооль': { icon: '🍅', label: 'トマト', bg: 'from-red-50 to-rose-50' },
  'сармис': { icon: '🧄', label: 'にんにく', bg: 'from-amber-50 to-stone-50' },

  // === 方位・方角・位置 (Directions & Positions) ===
  'хойд': { icon: '🧭', label: '北', bg: 'from-blue-50 to-indigo-50' },
  'өмнөд': { icon: '🧭', label: '南', bg: 'from-rose-50 to-orange-50' },
  'зүүн': { icon: '🧭', label: '東・左', bg: 'from-emerald-50 to-teal-50' },
  'баруун': { icon: '🧭', label: '西・右', bg: 'from-amber-50 to-yellow-50' },
  'дээр': { icon: '⬆️', label: '上', bg: 'from-sky-50 to-blue-50' },
  'дор': { icon: '⬇️', label: '下', bg: 'from-slate-50 to-stone-50' },
  'дооро': { icon: '⬇️', label: '下', bg: 'from-slate-50 to-stone-50' },
  'дотор': { icon: '📥', label: '中', bg: 'from-teal-50 to-emerald-50' },
  'гадна': { icon: '📤', label: '外', bg: 'from-orange-50 to-amber-50' },
  'өмнө': { icon: '◀️', label: '前', bg: 'from-indigo-50 to-blue-50' },
  'хойно': { icon: '▶️', label: '後ろ', bg: 'from-purple-50 to-pink-50' },
  'хажууд': { icon: '↔️', label: '横・隣', bg: 'from-stone-50 to-slate-50' },
  'дунд': { icon: '⏺️', label: '間・中央', bg: 'from-yellow-50 to-amber-50' },

  // === 犯罪・法・司法 (Crime & Law) ===
  'гэмт хэрэг': { icon: '🚨', label: '犯罪', bg: 'from-red-50 to-rose-50' },
  'гэмт хэрэг судлал': { icon: '🔍', label: '犯罪学', bg: 'from-indigo-50 to-blue-50' },
  'хууль': { icon: '⚖️', label: '法律', bg: 'from-amber-50 to-yellow-50' },
  'цагдаа': { icon: '👮', label: '警察', bg: 'from-blue-50 to-sky-50' },
  'шүүх': { icon: '🏛️', label: '裁判所', bg: 'from-purple-50 to-indigo-50' },
  'шүүгч': { icon: '👨‍⚖️', label: '裁判官', bg: 'from-indigo-50 to-slate-50' },
  'өмгөөлөгч': { icon: '🧑‍💼', label: '弁護士', bg: 'from-blue-50 to-teal-50' },
  'хулгайч': { icon: '🦹', label: '泥棒', bg: 'from-stone-50 to-zinc-50' },
  'шорон': { icon: '⛓️', label: '刑務所', bg: 'from-slate-50 to-stone-50' },
  'ял': { icon: '⚖️', label: '刑罰・判決', bg: 'from-red-50 to-rose-50' },
  'торгууль': { icon: '🎫', label: '罰金', bg: 'from-orange-50 to-amber-50' },
  'хохирогч': { icon: '👤', label: '被害者', bg: 'from-stone-50 to-slate-50' },
  'гэрч': { icon: '👁️', label: '目撃者・証人', bg: 'from-sky-50 to-blue-50' },
  'хэрэг': { icon: '📁', label: '事件・案件', bg: 'from-amber-50 to-yellow-50' },

  // === 自然・天気・動物 (Nature, Weather & Animals) ===
  'нар': { icon: '☀️', label: '太陽・日', bg: 'from-amber-50 to-yellow-50' },
  'сар': { icon: '🌙', label: '月', bg: 'from-indigo-50 to-sky-50' },
  'од': { icon: '⭐', label: '星', bg: 'from-yellow-50 to-amber-50' },
  'тэнгэр': { icon: '🌤️', label: '空', bg: 'from-sky-50 to-cyan-50' },
  'үүл': { icon: '☁️', label: '雲', bg: 'from-slate-50 to-stone-50' },
  'бороо': { icon: '🌧️', label: '雨', bg: 'from-blue-50 to-sky-50' },
  'цас': { icon: '❄️', label: '雪', bg: 'from-cyan-50 to-sky-50' },
  'салхи': { icon: '💨', label: '風', bg: 'from-teal-50 to-emerald-50' },
  'аянга': { icon: '⚡', label: '雷', bg: 'from-yellow-50 to-amber-50' },
  'уул': { icon: '🏔️', label: '山', bg: 'from-emerald-50 to-teal-50' },
  'гол': { icon: '🏞️', label: '川', bg: 'from-blue-50 to-cyan-50' },
  'нуур': { icon: '🌊', label: '湖', bg: 'from-cyan-50 to-blue-50' },
  'ой': { icon: '🌲', label: '森', bg: 'from-emerald-50 to-green-50' },
  'тал': { icon: '🌾', label: '草原', bg: 'from-lime-50 to-emerald-50' },
  'цөл': { icon: '🏜️', label: '砂漠・ゴビ', bg: 'from-amber-50 to-orange-50' },
  'цаг агаар': { icon: '⛅', label: '天気', bg: 'from-sky-50 to-blue-50' },
  'агаарын хэм': { icon: '🌡️', label: '気温・温度', bg: 'from-rose-50 to-amber-50' },
  'өвөл': { icon: '❄️', label: '冬', bg: 'from-cyan-50 to-blue-50' },
  'хавар': { icon: '🌱', label: '春', bg: 'from-emerald-50 to-teal-50' },
  'зун': { icon: '🌻', label: '夏', bg: 'from-amber-50 to-yellow-50' },
  'намар': { icon: '🍁', label: '秋', bg: 'from-orange-50 to-amber-50' },
  'морь': { icon: '🐎', label: '馬', bg: 'from-amber-50 to-orange-50' },
  'тэмээ': { icon: '🐫', label: 'ラクダ', bg: 'from-amber-50 to-yellow-50' },
  'хонь': { icon: '🐑', label: '羊', bg: 'from-emerald-50 to-teal-50' },
  'ямаа': { icon: '🐐', label: '山羊', bg: 'from-stone-50 to-amber-50' },
  'үхэр': { icon: '🐂', label: '牛', bg: 'from-amber-50 to-stone-50' },
  'нохой': { icon: '🐕', label: '犬', bg: 'from-amber-50 to-yellow-50' },
  'муур': { icon: '🐈', label: '猫', bg: 'from-orange-50 to-pink-50' },
  'чоно': { icon: '🐺', label: '狼', bg: 'from-slate-50 to-zinc-50' },
  'баавгай': { icon: '🐻', label: '熊', bg: 'from-stone-50 to-amber-50' },
  'үнэг': { icon: '🦊', label: '狐', bg: 'from-orange-50 to-amber-50' },
  'туулай': { icon: '🐇', label: 'うさぎ', bg: 'from-pink-50 to-rose-50' },
  'шувуу': { icon: '🦅', label: '鳥', bg: 'from-sky-50 to-indigo-50' },

  // === 街・交通・施設 (City, Transport & Places) ===
  'хот': { icon: '🏙️', label: '都市・街', bg: 'from-blue-50 to-indigo-50' },
  'гудамж': { icon: '🛣️', label: '通り・街路', bg: 'from-slate-50 to-stone-50' },
  'талбай': { icon: '🏛️', label: '広場', bg: 'from-amber-50 to-yellow-50' },
  'буудал': { icon: '🚏', label: '停留所・駅', bg: 'from-teal-50 to-emerald-50' },
  'галт тэрэгний буудал': { icon: '🚉', label: '鉄道駅', bg: 'from-blue-50 to-sky-50' },
  'нисэх буудал': { icon: '🛫', label: '空港', bg: 'from-sky-50 to-indigo-50' },
  'дэлгүүр': { icon: '🏪', label: '店・商店', bg: 'from-emerald-50 to-teal-50' },
  'зах': { icon: '🎪', label: '市場・バザール', bg: 'from-orange-50 to-amber-50' },
  'зоогийн газар': { icon: '🍽️', label: 'レストラン', bg: 'from-rose-50 to-orange-50' },
  'зочид буудал': { icon: '🏨', label: 'ホテル', bg: 'from-indigo-50 to-blue-50' },
  'эмнэлэг': { icon: '🏥', label: '病院', bg: 'from-rose-50 to-red-50' },
  'эмийн сан': { icon: '💊', label: '薬局', bg: 'from-emerald-50 to-teal-50' },
  'банк': { icon: '🏦', label: '銀行', bg: 'from-emerald-50 to-cyan-50' },
  'шуудан': { icon: '📮', label: '郵便局', bg: 'from-red-50 to-rose-50' },
  'музей': { icon: '🏛️', label: '博物館', bg: 'from-purple-50 to-indigo-50' },
  'машин': { icon: '🚗', label: '車・自動車', bg: 'from-blue-50 to-sky-50' },
  'автобус': { icon: '🚌', label: 'バス', bg: 'from-amber-50 to-yellow-50' },
  'галт тэрэг': { icon: '🚂', label: '電車・列車', bg: 'from-slate-50 to-stone-50' },
  'онгоц': { icon: '✈️', label: '飛行機', bg: 'from-sky-50 to-cyan-50' },
  'унадаг дугуй': { icon: '🚲', label: '自転車', bg: 'from-teal-50 to-emerald-50' },
  'такси': { icon: '🚕', label: 'タクシー', bg: 'from-yellow-50 to-amber-50' },

  // === 家族・人間関係 (Family & People) ===
  'гэр бүл': { icon: '👨‍👩‍👧‍👦', label: '家族', bg: 'from-amber-50 to-orange-50' },
  'аав': { icon: '👨', label: 'お父さん', bg: 'from-blue-50 to-sky-50' },
  'эцэг': { icon: '👨', label: '父', bg: 'from-blue-50 to-indigo-50' },
  'ээж': { icon: '👩', label: 'お母さん', bg: 'from-pink-50 to-rose-50' },
  'эх': { icon: '👩', label: '母', bg: 'from-rose-50 to-red-50' },
  'хүү': { icon: '👦', label: '息子・男の子', bg: 'from-sky-50 to-blue-50' },
  'охин': { icon: '👧', label: '娘・女の子', bg: 'from-pink-50 to-purple-50' },
  'ах': { icon: '🧑', label: '兄', bg: 'from-cyan-50 to-blue-50' },
  'эгч': { icon: '👩', label: '姉', bg: 'from-rose-50 to-pink-50' },
  'дүү': { icon: '🧒', label: '弟・妹', bg: 'from-amber-50 to-yellow-50' },
  'өвөө': { icon: '👴', label: 'おじいちゃん', bg: 'from-stone-50 to-amber-50' },
  'эмээ': { icon: '👵', label: 'おばあちゃん', bg: 'from-pink-50 to-amber-50' },
  'нөхөр': { icon: '🤵', label: '夫', bg: 'from-indigo-50 to-slate-50' },
  'эхнэр': { icon: '👰', label: '妻', bg: 'from-pink-50 to-rose-50' },
  'хүүхэд': { icon: '👶', label: '子ども', bg: 'from-yellow-50 to-amber-50' },
  'найз': { icon: '🤝', label: '友達', bg: 'from-emerald-50 to-teal-50' },
  'хүн': { icon: '👤', label: '人', bg: 'from-slate-50 to-zinc-50' },

  // === 音楽・芸能・日本文化 (Music & Culture) ===
  'хөгжим': { icon: '🎵', label: '音楽', bg: 'from-fuchsia-50 to-pink-50' },
  'дуу': { icon: '🎤', label: '歌', bg: 'from-rose-50 to-pink-50' },
  'дуучин': { icon: '🧑‍🎤', label: '歌手', bg: 'from-purple-50 to-fuchsia-50' },
  'морин хуур': { icon: '🎻', label: '馬頭琴', bg: 'from-amber-50 to-orange-50' },
  'лимбэ': { icon: '🪈', label: '横笛', bg: 'from-emerald-50 to-teal-50' },
  'бүжиг': { icon: '💃', label: 'ダンス・踊り', bg: 'from-pink-50 to-rose-50' },
  'зураг': { icon: '🎨', label: '絵・写真', bg: 'from-yellow-50 to-amber-50' },
  'сүши': { icon: '🍣', label: '寿司', bg: 'from-red-50 to-rose-50' },
  'сакэ': { icon: '🍶', label: '日本酒', bg: 'from-teal-50 to-cyan-50' },
  'сакура': { icon: '🌸', label: '桜', bg: 'from-pink-50 to-rose-50' },
  'кимоно': { icon: '👘', label: '着物', bg: 'from-purple-50 to-pink-50' },
  'сумо': { icon: '🤼', label: '相撲', bg: 'from-orange-50 to-amber-50' },
  'цайны ёслол': { icon: '🍵', label: '茶道', bg: 'from-emerald-50 to-teal-50' },

  // === 人称・指示代名詞・数字 (Pronouns & Numbers) ===
  'би': { icon: '🙋', label: '私', bg: 'from-emerald-50 to-teal-50' },
  'чи': { icon: '👉', label: '君', bg: 'from-blue-50 to-sky-50' },
  'та': { icon: '🙇', label: 'あなた', bg: 'from-indigo-50 to-purple-50' },
  'тэр': { icon: '👤', label: '彼・彼女・あれ', bg: 'from-slate-50 to-stone-50' },
  'бид': { icon: '👥', label: '私たち', bg: 'from-teal-50 to-cyan-50' },
  'та нар': { icon: '👥', label: 'あなたたち', bg: 'from-indigo-50 to-blue-50' },
  'тэд': { icon: '👥', label: '彼ら', bg: 'from-stone-50 to-slate-50' },
  'энэ': { icon: '👇', label: 'これ', bg: 'from-amber-50 to-yellow-50' },
  'энд': { icon: '📍', label: 'ここ', bg: 'from-rose-50 to-red-50' },
  'тэнд': { icon: '🧭', label: 'あそこ', bg: 'from-purple-50 to-indigo-50' },
  'нэг': { icon: '1️⃣', label: '1', bg: 'from-blue-50 to-indigo-50' },
  'хоёр': { icon: '2️⃣', label: '2', bg: 'from-emerald-50 to-teal-50' },
  'гурав': { icon: '3️⃣', label: '3', bg: 'from-amber-50 to-yellow-50' },
  'дөрөв': { icon: '4️⃣', label: '4', bg: 'from-purple-50 to-pink-50' },
  'тав': { icon: '5️⃣', label: '5', bg: 'from-rose-50 to-orange-50' },
  'зургаа': { icon: '6️⃣', label: '6', bg: 'from-cyan-50 to-blue-50' },
  'долоо': { icon: '7️⃣', label: '7', bg: 'from-indigo-50 to-violet-50' },
  'найм': { icon: '8️⃣', label: '8', bg: 'from-teal-50 to-emerald-50' },
  'ес': { icon: '9️⃣', label: '9', bg: 'from-orange-50 to-amber-50' },
  'арав': { icon: '🔟', label: '10', bg: 'from-red-50 to-rose-50' },

  // === 感情・状態 (Emotions & States) ===
  'баяртай': { icon: '😊', label: '嬉しい・さようなら', bg: 'from-yellow-50 to-amber-50' },
  'гунигтай': { icon: '😢', label: '悲しい', bg: 'from-blue-50 to-indigo-50' },
  'ууртай': { icon: '😡', label: '怒っている', bg: 'from-red-50 to-rose-50' },
  'айдас': { icon: '😨', label: '恐れ', bg: 'from-purple-50 to-slate-50' },
  'хайр': { icon: '❤️', label: '愛', bg: 'from-rose-50 to-pink-50' },
  'итгэл': { icon: '🤝', label: '信頼・確信', bg: 'from-emerald-50 to-teal-50' },
  'итгэлгүй': { icon: '🤷', label: '自信がない', bg: 'from-slate-50 to-stone-50' },
  'зоригтой': { icon: '🦁', label: '勇敢な', bg: 'from-amber-50 to-orange-50' },
  'гайхалтай': { icon: '✨', label: '素晴らしい', bg: 'from-yellow-50 to-amber-50' },
  'үнэхээр мундаг': { icon: '🌟', label: '本当にすごい', bg: 'from-amber-50 to-yellow-50' },
  'дажгүй': { icon: '👍', label: 'まぁまぁ・悪くない', bg: 'from-teal-50 to-emerald-50' },
  'зүгээр': { icon: '👌', label: '普通に・大丈夫', bg: 'from-slate-50 to-stone-50' },

  // === 意思・日常動詞 (Verbs & Actions) ===
  'мэдэх': { icon: '💡', label: '知る', bg: 'from-yellow-50 to-amber-50' },
  'мэдэхгүй': { icon: '🤷', label: '知らない', bg: 'from-slate-50 to-stone-50' },
  'ойлгох': { icon: '💡', label: '分かる・理解する', bg: 'from-teal-50 to-emerald-50' },
  'ойлгохгүй': { icon: '❓', label: '分からない', bg: 'from-rose-50 to-red-50' },
  'ойлголоо': { icon: '🙆', label: '分かりました', bg: 'from-emerald-50 to-teal-50' },
  'бодох': { icon: '🤔', label: '思う・考える', bg: 'from-indigo-50 to-blue-50' },
  'хийх': { icon: '🛠️', label: 'する・作る', bg: 'from-amber-50 to-orange-50' },
  'үзэх': { icon: '👀', label: '見る・試す', bg: 'from-cyan-50 to-sky-50' },
  'идэх': { icon: '🍽️', label: '食べる', bg: 'from-orange-50 to-amber-50' },
  'уух': { icon: '🥤', label: '飲む', bg: 'from-sky-50 to-cyan-50' },
  'явах': { icon: '🚶', label: '行く', bg: 'from-emerald-50 to-teal-50' },
  'ирэх': { icon: '🏃', label: '来る', bg: 'from-blue-50 to-indigo-50' },
  'сурах': { icon: '📖', label: '学ぶ・勉強する', bg: 'from-indigo-50 to-purple-50' },
  'унших': { icon: '📖', label: '読む', bg: 'from-purple-50 to-pink-50' },
  'бичих': { icon: '✍️', label: '書く', bg: 'from-amber-50 to-yellow-50' },
  'сонсох': { icon: '🎧', label: '聴く', bg: 'from-teal-50 to-cyan-50' },
  'ярих': { icon: '🗣️', label: '話す', bg: 'from-sky-50 to-blue-50' },
  'унтах': { icon: '😴', label: '寝る', bg: 'from-indigo-50 to-purple-50' },
  'сэрэх': { icon: '⏰', label: '起きる', bg: 'from-yellow-50 to-amber-50' },
  'суух': { icon: '🪑', label: '座る', bg: 'from-stone-50 to-slate-50' },
  'зогсох': { icon: '🧍', label: '立つ・止まる', bg: 'from-blue-50 to-indigo-50' },
  'худалдаж авах': { icon: '🛒', label: '買う', bg: 'from-emerald-50 to-teal-50' },
  'өгөх': { icon: '🎁', label: 'あげる・渡す', bg: 'from-rose-50 to-pink-50' },
  'авах': { icon: '🤲', label: 'もらう・取る', bg: 'from-cyan-50 to-sky-50' },
  'харах': { icon: '👁️', label: '見る', bg: 'from-sky-50 to-blue-50' },
  'уулзах': { icon: '🤝', label: '会う', bg: 'from-teal-50 to-emerald-50' },
  'инээх': { icon: '😄', label: '笑う', bg: 'from-yellow-50 to-amber-50' },
  'уйлах': { icon: '😢', label: '泣く', bg: 'from-blue-50 to-sky-50' },
  'дурлах': { icon: '🥰', label: '恋する', bg: 'from-pink-50 to-rose-50' },
  'хайрлах': { icon: '❤️', label: '愛する', bg: 'from-rose-50 to-red-50' },
  'хичээх': { icon: '💪', label: '努力する・頑張る', bg: 'from-amber-50 to-orange-50' },
  'хичээнэ': { icon: '💪', label: '頑張ります', bg: 'from-amber-50 to-orange-50' },
  'амрах': { icon: '🌴', label: '休む', bg: 'from-emerald-50 to-teal-50' },
  'ажиллах': { icon: '💼', label: '働く', bg: 'from-blue-50 to-indigo-50' },
  'тоглох': { icon: '🎮', label: '遊ぶ', bg: 'from-purple-50 to-pink-50' },

  // === 便利な会話表現 (Useful Phrases) ===
  'сайн байна уу': { icon: '🤝', label: 'こんにちは', bg: 'from-emerald-50 to-teal-50' },
  'баярлалаа': { icon: '🙏', label: 'ありがとう', bg: 'from-amber-50 to-yellow-50' },
  'маш их баярлалаа': { icon: '💐', label: '本当にありがとうございます', bg: 'from-rose-50 to-pink-50' },
  'уучлаарай': { icon: '🙇', label: 'ごめんなさい・すみません', bg: 'from-slate-50 to-stone-50' },
  'тийм': { icon: '✅', label: 'はい・そうです', bg: 'from-emerald-50 to-teal-50' },
  'үгүй': { icon: '❌', label: 'いいえ・違います', bg: 'from-rose-50 to-red-50' },
  'тийм шүү': { icon: '💡', label: 'その通り・確かに', bg: 'from-cyan-50 to-sky-50' },
  'үнэн шүү': { icon: '💯', label: '確かに・本当です', bg: 'from-emerald-50 to-teal-50' },
  'магадгүй': { icon: '🎲', label: '多分', bg: 'from-purple-50 to-pink-50' },
  'бололтой': { icon: '🧐', label: 'おそらく・〜のようだ', bg: 'from-blue-50 to-indigo-50' },
  'байхаа': { icon: '💭', label: '〜のはず・〜だろうな', bg: 'from-amber-50 to-yellow-50' },
  'ёстой': { icon: '☝️', label: '〜すべき・本当に', bg: 'from-indigo-50 to-purple-50' },
  'юу ч болно': { icon: '🆗', label: 'なんでもいい', bg: 'from-teal-50 to-emerald-50' },
  'аль нь ч болно': { icon: '🆗', label: 'どっちでもいい', bg: 'from-teal-50 to-emerald-50' },
  'тоохгүй': { icon: '😌', label: '気にしない', bg: 'from-slate-50 to-stone-50' },
  'зүгээр л': { icon: '🕊️', label: 'ただ・〜だけ', bg: 'from-sky-50 to-blue-50' }
};

/**
 * 単語イラスト・アイコン情報の取得
 */
export function getWordIllustration(wordOrItem, options = {}) {
  if (!wordOrItem) return { icon: '🏷️', label: '単語', bg: 'from-slate-50 to-stone-50', svg: null };

  let rawWord = '';
  let jaMeaning = '';
  let category = '';
  let item = null;

  if (typeof wordOrItem === 'string') {
    rawWord = wordOrItem;
  } else if (typeof wordOrItem === 'object') {
    item = wordOrItem;
    rawWord = item.mongolian || item.dictForm || item.baseWord || item.word || item.correctAnswer || '';
    jaMeaning = item.japanese || item.meaning || item.baseMeaning || item.translation || '';
    category = item.category || item.genreId || '';
  }

  const cleanWord = rawWord.toLowerCase().replace(/[\(\)\（\）\s.,!?-]/g, '');

  // 1. initialIllustrationQuizzes に登録されたSVGイラストがあるかチェック
  let foundSvg = null;
  try {
    let quizList = [];
    if (typeof initialIllustrationQuizzes !== 'undefined') quizList = initialIllustrationQuizzes;
    else if (typeof window !== 'undefined' && window.initialIllustrationQuizzes) quizList = window.initialIllustrationQuizzes;

    const matchedQuiz = quizList.find(q => {
      const qMn = (q.mongolian || '').toLowerCase().replace(/[\(\)\（\）\s.,!?-]/g, '');
      const qDf = (q.dictForm || '').toLowerCase().replace(/[\(\)\（\）\s.,!?-]/g, '');
      return (qMn && (qMn === cleanWord || cleanWord.includes(qMn))) || (qDf && (qDf === cleanWord || cleanWord.includes(qDf)));
    });
    if (matchedQuiz && matchedQuiz.svg) {
      foundSvg = matchedQuiz.svg;
    }
  } catch (_) {}

  // 2. 完全一致・辞書マッチ
  if (WORD_ILLUSTRATIONS[cleanWord]) {
    const entry = WORD_ILLUSTRATIONS[cleanWord];
    return { ...entry, svg: foundSvg };
  }

  // 単語中に含まれるキー（複合語や語幹など）
  for (const [key, val] of Object.entries(WORD_ILLUSTRATIONS)) {
    if (key.length >= 3 && cleanWord.includes(key)) {
      return { ...val, svg: foundSvg };
    }
  }

  // 3. 日本語の意味キーワードによるセマンティック推論
  const ja = (jaMeaning || '').toLowerCase();
  if (ja) {
    if (/手|腕|指|掌/.test(ja)) return { icon: '🖐️', label: '手・腕', bg: 'from-amber-50 to-orange-50', svg: foundSvg };
    if (/頭|脳|おでこ|額/.test(ja)) return { icon: '🧠', label: '頭部', bg: 'from-purple-50 to-pink-50', svg: foundSvg };
    if (/目|瞳|視/.test(ja)) return { icon: '👁️', label: '目', bg: 'from-sky-50 to-blue-50', svg: foundSvg };
    if (/耳|聴|聞/.test(ja)) return { icon: '👂', label: '耳', bg: 'from-rose-50 to-pink-50', svg: foundSvg };
    if (/鼻|嗅/.test(ja)) return { icon: '👃', label: '鼻', bg: 'from-orange-50 to-amber-50', svg: foundSvg };
    if (/口|唇|舌|歯/.test(ja)) return { icon: '👄', label: '口・歯', bg: 'from-rose-50 to-red-50', svg: foundSvg };
    if (/足|脚|膝|すね|かかと/.test(ja)) return { icon: '🦶', label: '足', bg: 'from-amber-50 to-orange-50', svg: foundSvg };
    if (/腹|胃|へそ|内臓/.test(ja)) return { icon: '🤰', label: 'お腹・胃', bg: 'from-emerald-50 to-teal-50', svg: foundSvg };
    if (/背|腰|肩|首/.test(ja)) return { icon: '🧍', label: '体', bg: 'from-blue-50 to-indigo-50', svg: foundSvg };
    if (/心|愛|恋/.test(ja)) return { icon: '❤️', label: '心・愛', bg: 'from-rose-50 to-red-50', svg: foundSvg };
    if (/本|ノート|ペン|筆|辞書|読|書/.test(ja)) return { icon: '📖', label: '文具・読書', bg: 'from-indigo-50 to-purple-50', svg: foundSvg };
    if (/学校|大学|先生|生徒|学生|勉強|試験/.test(ja)) return { icon: '🏫', label: '学校・学び', bg: 'from-blue-50 to-indigo-50', svg: foundSvg };
    if (/服|シャツ|ズボン|靴|帽|着/.test(ja)) return { icon: '👕', label: '衣服', bg: 'from-sky-50 to-blue-50', svg: foundSvg };
    if (/パン|肉|米|ご飯|スープ|魚|卵|料理|食/.test(ja)) return { icon: '🍽️', label: '食事・料理', bg: 'from-orange-50 to-amber-50', svg: foundSvg };
    if (/茶|水|酒|牛乳|ミルク|飲/.test(ja)) return { icon: '🍵', label: '飲み物', bg: 'from-emerald-50 to-teal-50', svg: foundSvg };
    if (/家|部屋|窓|ドア|机|椅子|ベッド|家具/.test(ja)) return { icon: '🏠', label: '住まい・家具', bg: 'from-amber-50 to-yellow-50', svg: foundSvg };
    if (/テレビ|冷蔵庫|洗濯機|掃除機|電話|スマホ|パソコン|時計/.test(ja)) return { icon: '📱', label: '家電・機器', bg: 'from-cyan-50 to-blue-50', svg: foundSvg };
    if (/林檎|りんご|オレンジ|バナナ|苺|果物|野菜|じゃがいも|トマト/.test(ja)) return { icon: '🍎', label: '果物・野菜', bg: 'from-red-50 to-rose-50', svg: foundSvg };
    if (/馬|ラクダ|羊|山羊|牛|犬|猫|動物|鳥/.test(ja)) return { icon: '🐾', label: '動物', bg: 'from-amber-50 to-orange-50', svg: foundSvg };
    if (/山|川|湖|森|草原|砂漠|自然/.test(ja)) return { icon: '🏔️', label: '自然', bg: 'from-emerald-50 to-teal-50', svg: foundSvg };
    if (/太陽|月|星|空|雲|雨|雪|風|天/.test(ja)) return { icon: '⛅', label: '天気・天体', bg: 'from-sky-50 to-cyan-50', svg: foundSvg };
    if (/車|バス|電車|飛行機|自転車|交通|駅/.test(ja)) return { icon: '🚗', label: '交通・乗り物', bg: 'from-blue-50 to-indigo-50', svg: foundSvg };
    if (/街|都市|店|市場|病院|ホテル|銀行/.test(ja)) return { icon: '🏙️', label: '街・施設', bg: 'from-indigo-50 to-purple-50', svg: foundSvg };
    if (/家族|父|母|兄|姉|弟|妹|子|友/.test(ja)) return { icon: '👨‍👩‍👧‍👦', label: '家族・人', bg: 'from-amber-50 to-orange-50', svg: foundSvg };
    if (/犯罪|警察|法|裁判|泥棒|刑/.test(ja)) return { icon: '⚖️', label: '法・警察', bg: 'from-red-50 to-amber-50', svg: foundSvg };
    if (/音楽|歌|踊|楽器|琴/.test(ja)) return { icon: '🎵', label: '音楽・芸能', bg: 'from-fuchsia-50 to-pink-50', svg: foundSvg };
    if (/寿司|着物|相撲|桜|日本/.test(ja)) return { icon: '🗾', label: '日本文化', bg: 'from-rose-50 to-red-50', svg: foundSvg };
    if (/私|あなた|彼|彼女|これ|あれ|ここ/.test(ja)) return { icon: '👤', label: '代名詞・指示', bg: 'from-teal-50 to-cyan-50', svg: foundSvg };
    if (/嬉|楽|喜/.test(ja)) return { icon: '😊', label: '喜び', bg: 'from-yellow-50 to-amber-50', svg: foundSvg };
    if (/悲|泣/.test(ja)) return { icon: '😢', label: '悲しみ', bg: 'from-blue-50 to-indigo-50', svg: foundSvg };
    if (/怒/.test(ja)) return { icon: '😡', label: '怒り', bg: 'from-red-50 to-rose-50', svg: foundSvg };
    if (/行|来|走|歩|飛|泳/.test(ja)) return { icon: '🏃', label: '移動・行動', bg: 'from-emerald-50 to-teal-50', svg: foundSvg };
    if (/見|視|観/.test(ja)) return { icon: '👀', label: '見る', bg: 'from-cyan-50 to-sky-50', svg: foundSvg };
    if (/言|話|語/.test(ja)) return { icon: '🗣️', label: '話す', bg: 'from-sky-50 to-blue-50', svg: foundSvg };
    if (/知|分か|思|考/.test(ja)) return { icon: '💡', label: '思考・理解', bg: 'from-yellow-50 to-amber-50', svg: foundSvg };
    if (/ありがとう|こんにちは|さようなら|すみません/.test(ja)) return { icon: '🙏', label: '挨拶・表現', bg: 'from-amber-50 to-yellow-50', svg: foundSvg };
  }

  // 4. カテゴリーによるフォールバック
  const cat = (category || '').toLowerCase();
  if (/body|身体/.test(cat)) return { icon: '👤', label: '身体', bg: 'from-amber-50 to-orange-50', svg: foundSvg };
  if (/school|学校|文具|教育/.test(cat)) return { icon: '📚', label: '学校・教育', bg: 'from-blue-50 to-indigo-50', svg: foundSvg };
  if (/clothing|衣類|服/.test(cat)) return { icon: '👕', label: '衣類', bg: 'from-sky-50 to-blue-50', svg: foundSvg };
  if (/dining|food|食べ物|食事/.test(cat)) return { icon: '🍽️', label: '食べ物', bg: 'from-orange-50 to-amber-50', svg: foundSvg };
  if (/appliances|daily|家電|日用品|家具/.test(cat)) return { icon: '🏠', label: '日用品・家電', bg: 'from-teal-50 to-emerald-50', svg: foundSvg };
  if (/produce|fruits|果物|野菜/.test(cat)) return { icon: '🍎', label: '果物・野菜', bg: 'from-red-50 to-rose-50', svg: foundSvg };
  if (/directions|orientation|方位|方角/.test(cat)) return { icon: '🧭', label: '方位・方角', bg: 'from-indigo-50 to-purple-50', svg: foundSvg };
  if (/law|crime|犯罪|法/.test(cat)) return { icon: '⚖️', label: '犯罪・法', bg: 'from-red-50 to-rose-50', svg: foundSvg };
  if (/emotions|feelings|感情/.test(cat)) return { icon: '💭', label: '感情・心理', bg: 'from-yellow-50 to-amber-50', svg: foundSvg };
  if (/weather|nature|自然|天気/.test(cat)) return { icon: '⛅', label: '天気・自然', bg: 'from-sky-50 to-cyan-50', svg: foundSvg };
  if (/pronouns|人称|代名詞/.test(cat)) return { icon: '👤', label: '人称代名詞', bg: 'from-cyan-50 to-sky-50', svg: foundSvg };
  if (/numbers|数字/.test(cat)) return { icon: '🔢', label: '数字', bg: 'from-purple-50 to-pink-50', svg: foundSvg };
  if (/places|city|場所|施設|街/.test(cat)) return { icon: '📍', label: '場所・施設', bg: 'from-emerald-50 to-teal-50', svg: foundSvg };
  if (/japan|日本文化/.test(cat)) return { icon: '🗾', label: '日本文化', bg: 'from-rose-50 to-red-50', svg: foundSvg };
  if (/music|音楽/.test(cat)) return { icon: '🎵', label: '音楽・芸能', bg: 'from-fuchsia-50 to-pink-50', svg: foundSvg };
  if (/useful|便利/.test(cat)) return { icon: '💬', label: '便利な言葉', bg: 'from-lime-50 to-emerald-50', svg: foundSvg };
  if (/business|仕事/.test(cat)) return { icon: '💼', label: 'ビジネス', bg: 'from-cyan-50 to-blue-50', svg: foundSvg };
  if (/medical|医療/.test(cat)) return { icon: '🩺', label: '医療', bg: 'from-rose-50 to-red-50', svg: foundSvg };

  return { icon: '🏷️', label: '単語', bg: 'from-slate-50 to-stone-50', svg: foundSvg };
}

/**
 * 単語イラストのHTMLバッジまたはSVGカードを生成
 * options: { size: 'sm'|'md'|'lg'|'xl', inline: false, forceSvg: false, className: '' }
 */
export function getWordIllustrationHTML(wordOrItem, options = {}) {
  const ill = getWordIllustration(wordOrItem, options);
  if (!ill) return '';

  if (options.inline) {
    return ill.icon || '🏷️';
  }

  const size = options.size || 'md';
  let sizeClasses = 'w-10 h-10 text-xl rounded-xl';
  if (size === 'sm') sizeClasses = 'w-8 h-8 text-base rounded-lg';
  else if (size === 'lg') sizeClasses = 'w-12 h-12 text-2xl rounded-2xl';
  else if (size === 'xl') sizeClasses = 'w-16 h-16 sm:w-20 sm:h-20 text-3xl sm:text-4xl rounded-2xl sm:rounded-3xl';

  // SVG表示（大画面・クイズ用）
  if (ill.svg && (size === 'xl' || options.forceSvg)) {
    return `
      <div class="word-illustration-box inline-flex items-center justify-center p-2 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs ${options.className || ''}">
        ${ill.svg}
      </div>
    `;
  }

  return `
    <div class="word-illustration-badge inline-flex items-center justify-center ${sizeClasses} bg-gradient-to-br ${ill.bg} dark:from-slate-800 dark:to-slate-700 text-slate-800 dark:text-white border border-slate-200/90 dark:border-slate-700 shadow-2xs shrink-0 select-none ${options.className || ''}" title="${ill.label || ''}">
      <span>${ill.icon}</span>
    </div>
  `;
}

if (typeof window !== 'undefined') {
  window.WORD_ILLUSTRATIONS = WORD_ILLUSTRATIONS;
  window.getWordIllustration = getWordIllustration;
  window.getWordIllustrationHTML = getWordIllustrationHTML;
}

/**
 * 4択テスト用 全選択肢の単語詳細解説アコーディオン生成
 * 終わった後の結果画面や各問題で、出題された4つの選択肢すべてについて
 * イラスト、品詞、日本語訳、語幹、単語の成り立ち、語呂合わせ、例文をタップ展開可能にする
 */
export function renderChoiceExplanationsHTML(choices, options = {}) {
  if (!choices || !Array.isArray(choices) || choices.length === 0) return '';

  const expectedAnswer = (options.expectedAnswer || '').toLowerCase().trim();
  const userAnswer = (options.userAnswer || '').toLowerCase().trim();
  const title = options.title || '選択肢に出た単語の全解説を見る（タップで開閉）';

  let vocabList = [];
  try {
    if (typeof StorageService !== 'undefined' && StorageService.getVocabulary) {
      vocabList = StorageService.getVocabulary();
    }
  } catch (_) {}

  const choiceCardsHTML = choices.map((rawChoice, idx) => {
    let wordObj = null;

    if (rawChoice && typeof rawChoice === 'object') {
      if (rawChoice.word && typeof rawChoice.word === 'object') {
        wordObj = { ...rawChoice.word };
      } else if (rawChoice.id && (!rawChoice.mongolian && !rawChoice.dictForm)) {
        const found = vocabList.find(v => String(v.id) === String(rawChoice.id));
        if (found) {
          wordObj = { ...found, ...rawChoice };
        } else {
          wordObj = { ...rawChoice };
        }
      } else {
        wordObj = { ...rawChoice };
      }

      // If text property exists and mongolian or japanese is missing
      if (wordObj && wordObj.text && (!wordObj.mongolian || !wordObj.japanese)) {
        const clean = wordObj.text.toLowerCase().trim();
        const found = vocabList.find(v => 
          (v.mongolian && v.mongolian.toLowerCase().trim() === clean) ||
          (v.dictForm && v.dictForm.toLowerCase().trim() === clean) ||
          (v.japanese && v.japanese.toLowerCase().trim() === clean)
        );
        if (found) {
          wordObj = { ...found, ...wordObj };
        } else if (typeof findWordInDictionary === 'function') {
          const dictFound = findWordInDictionary(clean);
          if (dictFound) {
            wordObj = {
              mongolian: dictFound.dictForm || clean,
              dictForm: dictFound.dictForm || clean,
              japanese: dictFound.meaning,
              pos: dictFound.pos,
              pronunciation: dictFound.pron,
              derivation: dictFound.derivation,
              ...wordObj
            };
          }
        }
        if (!wordObj.mongolian && !wordObj.dictForm && !wordObj.japanese) {
          if (wordObj.isCyrillic) {
            wordObj.mongolian = wordObj.text;
          } else {
            wordObj.japanese = wordObj.text;
          }
        }
      }
    } else if (typeof rawChoice === 'string') {
      const clean = rawChoice.toLowerCase().trim();
      wordObj = vocabList.find(v => 
        (v.mongolian && v.mongolian.toLowerCase().trim() === clean) ||
        (v.dictForm && v.dictForm.toLowerCase().trim() === clean) ||
        (v.japanese && v.japanese.toLowerCase().trim() === clean)
      );
      if (!wordObj && typeof findWordInDictionary === 'function') {
        const found = findWordInDictionary(clean);
        if (found) {
          wordObj = {
            mongolian: found.dictForm || clean,
            dictForm: found.dictForm || clean,
            japanese: found.meaning,
            pos: found.pos,
            pronunciation: found.pron,
            derivation: found.derivation
          };
        }
      }
      if (!wordObj) {
        wordObj = { mongolian: rawChoice, dictForm: rawChoice, japanese: '' };
      }
    }

    if (!wordObj) return '';

    const mn = (wordObj.dictForm || wordObj.mongolian || '').trim();
    const ja = (wordObj.japanese || wordObj.meaning || wordObj.baseMeaning || '').trim();
    const mnLower = mn.toLowerCase();
    const jaLower = ja.toLowerCase();

    // 正解・不正解・ユーザー選択の判定
    let isChoiceCorrect = false;
    if (expectedAnswer) {
      isChoiceCorrect = (mnLower === expectedAnswer || jaLower === expectedAnswer || (wordObj.mongolian && wordObj.mongolian.toLowerCase() === expectedAnswer));
    }
    let isChoiceUserPicked = false;
    if (userAnswer) {
      isChoiceUserPicked = (mnLower === userAnswer || jaLower === userAnswer || (wordObj.mongolian && wordObj.mongolian.toLowerCase() === userAnswer));
    }

    const details = (typeof getWordGrammarDetails === 'function') ? getWordGrammarDetails(wordObj) : null;
    const isV = details ? details.isVerb : false;
    const pron = wordObj.pronunciation || '';
    const isCaution = typeof isPronunciationCautionWord === 'function' ? isPronunciationCautionWord(wordObj) : false;

    // 成り立ち＆語呂合わせ
    const etymologyHTML = (typeof getWordEtymologyHTML === 'function') 
      ? getWordEtymologyHTML(wordObj, wordObj.mongolian || mn) 
      : '';
    const mnemonicHTML = (typeof getWordMnemonicHTML === 'function') 
      ? getWordMnemonicHTML(wordObj, wordObj.mongolian || mn) 
      : '';
    const illustrationHTML = (typeof getWordIllustrationHTML === 'function')
      ? getWordIllustrationHTML(wordObj, { size: 'sm' })
      : '';

    return `
      <div class="p-3 rounded-xl border ${isChoiceCorrect ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800' : (isChoiceUserPicked ? 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800' : 'bg-slate-50/90 dark:bg-slate-900/80 border-slate-200 dark:border-slate-700/80')} space-y-2 transition-all">
        <div class="flex items-start justify-between gap-2 flex-wrap">
          <div class="flex items-center gap-2">
            <span class="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-black flex items-center justify-center shrink-0">
              ${idx + 1}
            </span>
            ${isChoiceCorrect ? `
              <span class="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/80 text-emerald-800 dark:text-emerald-200 font-black text-[10px] border border-emerald-300 dark:border-emerald-700 flex items-center gap-1">
                <span>⭕</span> <span>正解</span>
              </span>
            ` : `
              <span class="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold text-[10px]">
                選択肢
              </span>
            `}
            ${isChoiceUserPicked ? `
              <span class="px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/80 text-rose-800 dark:text-rose-200 font-black text-[10px] border border-rose-300 dark:border-rose-700 flex items-center gap-1">
                <span>👉</span> <span>あなたの選択</span>
              </span>
            ` : ''}
          </div>

          ${mn ? `
            <button type="button" class="btn-speak-choice-word p-1 rounded-lg bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 text-slate-500 hover:text-emerald-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer text-xs flex items-center gap-1" data-word="${wordObj.mongolian || mn}" title="発音を聴く">
              <span>🔊</span> <span class="text-[10px] font-bold">発音</span>
            </button>
          ` : ''}
        </div>

        <div class="flex items-center gap-3">
          ${illustrationHTML}
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="text-base font-black text-slate-900 dark:text-white cyrillic-text">${mn}</span>
              ${pron && isCaution ? `<span class="text-[11px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800">⚠️ [ ${pron} ]</span>` : ''}
            </div>
            <div class="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">
              ${ja}
              <span class="text-[10px] text-slate-400 dark:text-slate-400 font-normal ml-1">【${wordObj.pos || '名詞'}】</span>
            </div>
          </div>
        </div>

        ${isV ? `
          <div class="p-2 rounded-lg bg-white/90 dark:bg-slate-950/70 border border-emerald-100 dark:border-emerald-900/40 text-[11px] text-emerald-950 dark:text-emerald-200 grid grid-cols-2 gap-2">
            <div><span class="text-slate-400 dark:text-slate-400">📖 辞書形:</span> <strong class="cyrillic-text">${details.dictForm || mn}</strong></div>
            <div><span class="text-slate-400 dark:text-slate-400">🌱 語幹:</span> <strong class="cyrillic-text text-emerald-700 dark:text-emerald-400">${details.root || '-'}</strong></div>
          </div>
        ` : ''}

        ${etymologyHTML}
        ${mnemonicHTML}

        ${wordObj.exampleMn ? `
          <div class="p-2 bg-white/90 dark:bg-slate-950/80 rounded-lg border border-slate-100 dark:border-slate-800 text-[11px] space-y-0.5">
            <div class="font-bold text-slate-700 dark:text-slate-200 cyrillic-text">${wordObj.exampleMn}</div>
            <div class="text-[10px] text-slate-500 dark:text-slate-400">${wordObj.exampleJa || ''}</div>
          </div>
        ` : ''}
      </div>
    `;
  }).filter(Boolean).join('');

  if (!choiceCardsHTML) return '';

  return `
    <details class="choice-explanations-accordion group mt-2.5 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50/70 dark:bg-slate-900/60 shadow-2xs transition-all">
      <summary class="flex items-center justify-between p-2.5 sm:p-3 cursor-pointer select-none text-xs font-extrabold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
        <span class="flex items-center gap-2">
          <span class="text-base">🔍</span>
          <span class="text-slate-800 dark:text-slate-100">${title}</span>
          <span class="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">${choices.length}語解説</span>
        </span>
        <span class="text-xs text-slate-400 dark:text-slate-500 font-mono group-open:rotate-180 transition-transform duration-200">▼</span>
      </summary>

      <div class="p-3 border-t border-slate-200 dark:border-slate-700 space-y-2.5 bg-white dark:bg-slate-800/95">
        ${choiceCardsHTML}
      </div>
    </details>
  `;
}

if (typeof window !== 'undefined') {
  window.renderChoiceExplanationsHTML = renderChoiceExplanationsHTML;
}




export function renderGrammarExplanationHTML({
  correctAnswer,
  userAnswer = '',
  isCorrect = false,
  item = null,
  pronunciation = '',
  grammarExplanation = '',
  rule = '',
  isVerbQuestion = false
}) {
  const details = item ? getWordGrammarDetails(item) : null;
  const isV = isVerbQuestion || (details ? details.isVerb : false);
  const dictForm = (details && details.dictForm) ? details.dictForm : (item ? item.baseWord || item.mongolian || item.dictForm : '');
  const root = (details && details.root) ? details.root : (item ? (item.root || '').replace(/-/g, '').trim() : '');
  let meaning = (details && details.meaning) ? details.meaning : (item ? (item.baseMeaning || item.meaning || item.japanese || item.meaning_ja || item.translation || '') : '');
  if (!meaning && typeof StorageService !== 'undefined' && StorageService.getVocabulary) {
    try {
      const vocab = StorageService.getVocabulary();
      const match = vocab.find(v => (dictForm && (v.mongolian === dictForm || v.dictForm === dictForm)) || (item && item.baseWord && (v.mongolian === item.baseWord || v.dictForm === item.baseWord)));
      if (match) {
        meaning = (match.japanese || match.baseMeaning || match.meaning || match.translation || '').trim();
      }
    } catch (_) {}
  }
  const derivation = (details && details.derivation) ? details.derivation : (item && item.derivation ? item.derivation : '');
  const pron = pronunciation || (item ? item.pronunciation : '');
  const note = item ? item.note : '';
  const exampleMn = item ? item.exampleMn : '';
  const exampleJa = item ? item.exampleJa : '';

  // ユーザーが誤って辞書形を入力したかの判定
  const wasDictFormEntered = isV && userAnswer && dictForm && (userAnswer.trim().toLowerCase() === dictForm.toLowerCase());

  return `
    <div class="space-y-2.5 text-xs sm:text-sm">
      <!-- 1. 正解表示（ビジュアルイラスト付き・要件10準拠） -->
      <div class="flex items-center gap-2.5 flex-wrap">
        ${(typeof getWordIllustrationHTML === 'function') ? getWordIllustrationHTML(item || { mongolian: correctAnswer, japanese: meaning }, { size: 'md' }) : ''}
        <div>
          <div class="flex items-center flex-wrap gap-2">
            <span class="text-slate-500 dark:text-slate-400 font-medium">正解: </span>
            <span class="font-extrabold text-base sm:text-lg cyrillic-text text-emerald-800 dark:text-emerald-400 correct-answer-text">${correctAnswer}</span>
            ${pron && isPronunciationCautionWord(item || { mongolian: correctAnswer, pronunciation: pron }) ? `<span class="text-amber-700 bg-amber-50 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800 px-2 py-0.5 rounded-md text-xs font-bold border border-amber-200 ml-1">⚠️ 読み注意: ${pron}</span>` : ''}
          </div>
          ${meaning ? `<div class="text-[11px] text-slate-500 dark:text-slate-400 font-medium">${meaning}</div>` : ''}
        </div>
      </div>

      ${!isCorrect && userAnswer ? `
        <div class="text-rose-700 bg-rose-50/80 p-2 rounded-lg border border-rose-200">
          <div>
            <span>あなたの回答: </span>
            <span class="font-semibold line-through">${userAnswer}</span>
          </div>
          ${wasDictFormEntered ? `
            <div class="text-xs text-amber-800 font-medium mt-1">
              ⚠️「${userAnswer}」は動詞の【辞書形】です。テストでは活用の土台となる【語幹（${root}）】を回答します。
            </div>
          ` : ''}
        </div>
      ` : ''}

      <!-- 動詞の場合：辞書形・語幹・意味・過程の完全解説ブロック -->
      ${isV ? `
        <div class="bg-white/95 rounded-xl p-3.5 border border-emerald-200 shadow-2xs space-y-2.5 my-2">
          <div class="flex items-center justify-between border-b border-emerald-100 pb-1.5">
            <span class="font-bold text-emerald-900 text-xs flex items-center gap-1.5">
              <span>🌱</span> 動詞の基本形・語幹構造解説
            </span>
            ${details && details.vowelHarmonyLabel ? `
              <span class="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-medium">
                ${details.vowelHarmonyLabel}
              </span>
            ` : ''}
          </div>

          <!-- 辞書形・語幹・意味の明確な区別カード（要件2準拠） -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div class="bg-slate-50 border border-slate-200 p-2 rounded-lg">
              <div class="text-[10px] text-slate-500 font-bold">📖 辞書形（見出し語）</div>
              <div class="font-extrabold text-slate-900 cyrillic-text text-sm mt-0.5">${dictForm}</div>
            </div>

            <div class="bg-emerald-50 border border-emerald-300 p-2 rounded-lg">
              <div class="text-[10px] text-emerald-800 font-bold">🌱 動詞の語幹</div>
              <div class="font-extrabold text-emerald-900 cyrillic-text text-sm mt-0.5">${root}</div>
            </div>

            <div class="bg-slate-50 border border-slate-200 p-2 rounded-lg">
              <div class="text-[10px] text-slate-500 font-bold">🇯🇵 日本語の意味</div>
              <div class="font-bold text-slate-800 text-sm mt-0.5">${meaning}</div>
            </div>
          </div>

          <!-- 語幹から正解の形が作られる過程 -->
          <div class="pt-1.5 border-t border-slate-100 text-xs text-slate-700 leading-relaxed space-y-1">
            <div class="font-bold text-slate-800 flex items-center gap-1">
              <span>🔍</span> 語幹から正解の形が作られる過程:
            </div>
            <div class="text-slate-700 pl-3 border-l-2 border-emerald-500 bg-emerald-50/40 p-1.5 rounded-r">
              ${derivation || `語幹「${root}」を土台にして、目的に応じた活用語尾が接続します。`}
            </div>
          </div>

          ${(grammarExplanation || rule || note) ? `
            <div class="text-xs text-slate-700 bg-amber-50/70 p-2.5 rounded-lg border border-amber-200 space-y-1">
              <div class="font-bold text-amber-900 flex items-center gap-1">
                <span>💡</span> 文法・活用ルール:
              </div>
              <div>${grammarExplanation || note || rule}</div>
            </div>
          ` : ''}
        </div>
      ` : `
        <!-- 非動詞（名詞・複合語など）の場合 -->
        <div class="bg-white/95 rounded-xl p-3 border border-slate-200 space-y-1.5 my-2 text-xs">
          <div class="flex items-center justify-between">
            <span class="font-bold text-slate-800">見出し語: <span class="cyrillic-text font-extrabold text-slate-900">${dictForm}</span></span>
            <span class="text-slate-500 font-medium">【品詞: ${details ? details.pos : (item ? item.pos : '名詞')}】</span>
          </div>
          <div>意味: <span class="font-semibold text-slate-800">${meaning}</span></div>
          
          <!-- 単語の成り立ち・構成カード（2語以上の複合語、派生語） -->
          ${(typeof getWordEtymologyHTML === 'function') ? getWordEtymologyHTML(item, correctAnswer) : (derivation ? `<div class="text-slate-600 pt-1 border-t border-slate-100">💡 ${derivation}</div>` : '')}

          ${(grammarExplanation || rule || note) && !(item && (item.etymologyBreakdown || item.derivation || '').includes(note)) ? `
            <div class="text-slate-700 bg-slate-50 p-2 rounded border border-slate-200 mt-1">
              ${grammarExplanation || note || rule}
            </div>
          ` : ''}
        </div>
      `}

      <!-- 単語の成り立ち・構成カード（動詞・派生語で存在する場合） -->
      ${parsed.isVerb && (typeof getWordEtymologyHTML === 'function') ? getWordEtymologyHTML(item, correctAnswer) : ''}

      <!-- 語呂合わせ・楽しい覚え方カード（動詞・名詞問わず存在すれば必ず表示） -->
      ${(typeof getWordMnemonicHTML === 'function') ? getWordMnemonicHTML(item, correctAnswer) : ''}

      <!-- 例文表示 -->
      ${exampleMn ? `
        <div class="pt-2 border-t border-slate-200/60">
          <div class="text-[11px] text-slate-500 font-bold">例文:</div>
          <div class="font-semibold cyrillic-text text-slate-800">${exampleMn}</div>
          <div class="text-slate-600 text-xs">${exampleJa}</div>
        </div>
      ` : ''}
    </div>
  `;
}

/**
 * シャッフル関数（Fisher-Yates）
 */
export function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * 効果音の再生（Web Audio API / 外部ファイル不要）
 */
class SoundEffectsBase {
  static playCorrect() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
      
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      
      osc.start(now);
      osc.stop(now + 0.35);
    } catch (e) {
      // AudioContextブロック時のサイレントフォールバック
    }
  }

  static playWrong() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(220, now); // A3
      osc.frequency.setValueAtTime(185, now + 0.15); // F#3
      
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      
      osc.start(now);
      osc.stop(now + 0.3);
    } catch (e) {
      // ignore
    }
  }

  static playIncorrect() {
    this.playWrong();
  }

  static playMistake() {
    this.playWrong();
  }

  static playError() {
    this.playWrong();
  }

  static playFail() {
    this.playWrong();
  }

  static playSuccess() {
    this.playCorrect();
  }

  static playCombo(combo = 1) {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      const baseFreq = 440 + Math.min(combo * 40, 600);
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.15);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.start(now);
      osc.stop(now + 0.2);
    } catch (e) {}
  }

  static playLevelUp() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      const now = ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        osc.connect(gain);
        gain.connect(ctx.destination);

        const startTime = now + (idx * 0.1);
        gain.gain.setValueAtTime(0.15, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);

        osc.start(startTime);
        osc.stop(startTime + 0.3);
      });
    } catch (e) {}
  }

  static playMunch() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const now = ctx.currentTime;
      [0, 0.08].forEach((offset, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(idx === 0 ? 340 : 520, now + offset);
        osc.frequency.exponentialRampToValueAtTime(idx === 0 ? 560 : 780, now + offset + 0.06);
        gain.gain.setValueAtTime(0.14, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.07);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + offset);
        osc.stop(now + offset + 0.07);
      });
    } catch (e) {}
  }

  static playTile() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.05);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } catch (e) {}
  }
}

/**
 * SoundEffects Proxy: 未定義メソッドが呼ばれても TypeError を投げず、
 * 不正解/正解/フォールバックに自動ルーティングする堅牢プロキシ
 */
export const SoundEffects = new Proxy(SoundEffectsBase, {
  get(target, prop) {
    if (prop in target) {
      const val = target[prop];
      return typeof val === 'function' ? val.bind(target) : val;
    }
    if (typeof prop === 'string') {
      const p = prop.toLowerCase();
      if (p.includes('wrong') || p.includes('incorrect') || p.includes('mistake') || p.includes('error') || p.includes('fail')) {
        return (...args) => target.playWrong(...args);
      }
      if (p.includes('correct') || p.includes('success') || p.includes('right') || p.includes('win')) {
        return (...args) => target.playCorrect(...args);
      }
      return () => {};
    }
    return undefined;
  }
});
if (typeof window !== 'undefined') {
  window.SoundEffects = SoundEffects;
}

// 発音・読み方に特に注意が必要な単語リスト（不規則発音・軟音記号ь・硬音記号ъ・特殊母音・短縮形など）
export const PRONUNCIATION_CAUTION_WORDS = new Set([
  'баярлалаа', 'баяртай', 'сайн байна уу', 'байна', 'байхгүй', 'хоёул',
  'гурвуул', 'дөрвүүл', 'тавуул', 'зургууль', 'долуулаа', 'долоул', 'наймуул', 'есүүл',
  'гурав', 'дөрөв', 'тав', 'зургаа', 'долоо', 'найм', 'ес', 'арав', 'хоёр',
  'жар', 'жаран', 'дал', 'далан', 'ная', 'наян', 'ер', 'ерэн',
  'морь', 'хонь', 'сургууль', 'явъя', 'суръя', 'ашгүй', 'юу', 'юү', 'өглөө', 'өвөө',
  'хэлэх', 'үзэх', 'өгөх', 'мэдэх', 'хийх', 'идэх', 'авах', 'явах', 'болох'
]);

/**
 * 読み方に特に注意が必要な単語か判定
 * （全単語にカタカナを振るのではなく、不規則発音・軟音化・文字と発音の乖離が大きいものに限定）
 */
export function isPronunciationCautionWord(word) {
  if (!word) return false;
  if (word.pronunciationCaution === true || word.isIrregularPronunciation === true || word.pronunciationWarning) return true;
  
  const mn = ((typeof word === 'string' ? word : (word.mongolian || word.dictForm || word.baseWord || '')) || '').trim().toLowerCase();
  if (!mn) return false;
  
  // 明示的な注意単語
  if (PRONUNCIATION_CAUTION_WORDS.has(mn)) return true;
  for (const cw of PRONUNCIATION_CAUTION_WORDS) {
    if (mn.includes(cw) && cw.length >= 4) return true;
  }
  
  // 軟音記号 ь（前の文字を口蓋化・軟音化させるため読み方注意）
  if (mn.includes('ь')) return true;
  // 硬音記号 ъ（口蓋化を防ぐ・音節境界）
  if (mn.includes('ъ')) return true;
  
  // メモや解説に発音の注意書きがある場合
  const note = (word.note || word.grammarExplanation || word.hint || '');
  if (/発音|読み方|短縮|脱落|不規則|軟音|注意|変則/.test(note)) return true;
  
  // е / ё で始まり特別な読み方になる単語
  if (mn.startsWith('е') || mn.startsWith('ё')) return true;
  
  return false;
}

if (typeof window !== 'undefined') {
  window.isPronunciationCautionWord = isPronunciationCautionWord;
  window.PRONUNCIATION_CAUTION_WORDS = PRONUNCIATION_CAUTION_WORDS;
}

/**
 * 読解テスト用 単語タップ辞書検索 ＆ 語形ステミング解析
 * パッセージ専用グロッサリー ＋ 744語マスター辞書 ＋ 形態素・格語尾・活用語尾分解
 */
export function findWordInDictionary(rawWord, passageGlossary = null) {
  if (!rawWord) return null;
  const cleanWord = rawWord.trim().replace(/[.,!?:;«»"'\(\)\[\]—–-]/g, '');
  if (!cleanWord) return null;
  const lower = cleanWord.toLowerCase();

  // 1. パッセージ専用グロッサリーでの検索
  if (passageGlossary) {
    if (passageGlossary[cleanWord]) {
      return {
        rawWord: cleanWord,
        dictForm: passageGlossary[cleanWord].dictForm || cleanWord,
        meaning: passageGlossary[cleanWord].meaning,
        pos: passageGlossary[cleanWord].pos || '',
        pron: passageGlossary[cleanWord].pron || '',
        derivation: passageGlossary[cleanWord].derivation || ''
      };
    }
    if (passageGlossary[lower]) {
      return {
        rawWord: cleanWord,
        dictForm: passageGlossary[lower].dictForm || cleanWord,
        meaning: passageGlossary[lower].meaning,
        pos: passageGlossary[lower].pos || '',
        pron: passageGlossary[lower].pron || '',
        derivation: passageGlossary[lower].derivation || ''
      };
    }
  }

  // 2. 単語マスターからの完全一致探索
  let vocab = [];
  try {
    if (typeof StorageService !== 'undefined' && StorageService.getVocabulary) {
      vocab = StorageService.getVocabulary();
    }
  } catch (_) {}

  const exact = vocab.find(v => 
    (v.mongolian && v.mongolian.toLowerCase() === lower) ||
    (v.dictForm && v.dictForm.toLowerCase() === lower)
  );
  if (exact) {
    return {
      rawWord: cleanWord,
      dictForm: exact.dictForm || exact.mongolian,
      meaning: exact.japanese || exact.baseMeaning || exact.meaning,
      pos: exact.pos || '',
      pron: exact.pronunciation || '',
      derivation: exact.derivation || ''
    };
  }

  // 3. 名詞格語尾・複数語尾・再帰語尾のステミング探索
  const nounSuffixes = [
    { suffix: 'ийн', name: '属格（〜の）' },
    { suffix: 'ын', name: '属格（〜の）' },
    { suffix: 'ний', name: '属格（〜の）' },
    { suffix: 'ны', name: '属格（〜の）' },
    { suffix: 'дээ', name: '与位格・再帰（〜の自分の...へ）' },
    { suffix: 'доо', name: '与位格・再帰（〜の自分の...へ）' },
    { suffix: 'тээ', name: '与位格・再帰（〜の自分の...へ）' },
    { suffix: 'д', name: '与位格（〜に、〜で）' },
    { suffix: 'т', name: '与位格（〜に、〜で）' },
    { suffix: 'нд', name: '与位格（〜に、〜で）' },
    { suffix: 'ийг', name: '対格（〜を）' },
    { suffix: 'ыг', name: '対格（〜を）' },
    { suffix: 'г', name: '対格（〜を）' },
    { suffix: 'аас', name: '奪格（〜から）' },
    { suffix: 'ээс', name: '奪格（〜から）' },
    { suffix: 'оос', name: '奪格（〜から）' },
    { suffix: 'өөс', name: '奪格（〜から）' },
    { suffix: 'тай', name: '共同格（〜と、〜を持つ）' },
    { suffix: 'тэй', name: '共同格（〜と、〜を持つ）' },
    { suffix: 'той', name: '共同格（〜と、〜を持つ）' },
    { suffix: 'аар', name: '造格（〜で、手段）' },
    { suffix: 'ээр', name: '造格（〜で、手段）' },
    { suffix: 'оор', name: '造格（〜で、手段）' },
    { suffix: 'өөр', name: '造格（〜で、手段）' },
    { suffix: 'ууд', name: '複数語尾（〜たち）' },
    { suffix: 'үүд', name: '複数語尾（〜たち）' },
    { suffix: 'аа', name: '再帰語尾（自分の〜）' },
    { suffix: 'ээ', name: '再帰語尾（自分の〜）' },
    { suffix: 'оо', name: '再帰語尾（自分の〜）' },
    { suffix: 'өө', name: '再帰語尾（自分の〜）' }
  ];

  for (const s of nounSuffixes) {
    if (lower.endsWith(s.suffix) && lower.length > s.suffix.length + 1) {
      const stem = lower.slice(0, -s.suffix.length);
      const match = vocab.find(v => 
        (v.mongolian && v.mongolian.toLowerCase() === stem) ||
        (v.dictForm && v.dictForm.toLowerCase() === stem) ||
        (v.mongolian && v.mongolian.toLowerCase().startsWith(stem))
      );
      if (match) {
        return {
          rawWord: cleanWord,
          dictForm: match.dictForm || match.mongolian,
          meaning: match.japanese || match.baseMeaning || match.meaning,
          pos: match.pos || '名詞',
          pron: match.pronunciation || '',
          derivation: `語幹「${match.dictForm || match.mongolian}」＋ ${s.name}「-${s.suffix}」`
        };
      }
    }
  }

  // 4. 動詞活用語尾のステミング探索
  const verbSuffixes = [
    { suffix: 'сан', name: '過去形（〜した）' },
    { suffix: 'сэн', name: '過去形（〜した）' },
    { suffix: 'сон', name: '過去形（〜した）' },
    { suffix: 'сөн', name: '過去形（〜した）' },
    { suffix: 'на', name: '現在未来形（〜する）' },
    { suffix: 'нэ', name: '現在未来形（〜する）' },
    { suffix: 'но', name: '現在未来形（〜する）' },
    { suffix: 'нө', name: '現在未来形（〜する）' },
    { suffix: 'даг', name: '習慣形（いつも〜する）' },
    { suffix: 'дэг', name: '習慣形（いつも〜する）' },
    { suffix: 'дог', name: '習慣形（いつも〜する）' },
    { suffix: 'дөг', name: '習慣形（いつも〜する）' },
    { suffix: 'аад', name: '並列・順次（〜して）' },
    { suffix: 'ээд', name: '並列・順次（〜して）' },
    { suffix: 'оод', name: '並列・順次（〜して）' },
    { suffix: 'өөд', name: '並列・順次（〜して）' },
    { suffix: 'ж', name: '並列接続（〜して）' },
    { suffix: 'ч', name: '並列接続（〜して）' },
    { suffix: 'вал', name: '仮定条件（〜したら）' },
    { suffix: 'вэл', name: '仮定条件（〜したら）' }
  ];

  for (const v of verbSuffixes) {
    if (lower.endsWith(v.suffix) && lower.length > v.suffix.length + 1) {
      const stem = lower.slice(0, -v.suffix.length);
      const match = vocab.find(item => 
        (item.root && item.root.replace(/-/g, '').toLowerCase() === stem) ||
        (item.dictForm && item.dictForm.toLowerCase().startsWith(stem))
      );
      if (match) {
        return {
          rawWord: cleanWord,
          dictForm: match.dictForm || match.mongolian,
          meaning: match.japanese || match.baseMeaning || match.meaning,
          pos: '動詞',
          pron: match.pronunciation || '',
          derivation: `動詞語幹「${match.root || stem}」＋ ${v.name}「-${v.suffix}」`
        };
      }
    }
  }

  // 見つからなかった場合のフォールバック（音訳のみ生成）
  return {
    rawWord: cleanWord,
    dictForm: cleanWord,
    meaning: '文脈から意味を推測してみましょう',
    pos: '語句',
    pron: '',
    derivation: ''
  };
}
