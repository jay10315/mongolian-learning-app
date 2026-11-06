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
      <!-- 1. 正解表示 -->
      <div class="flex items-center flex-wrap gap-2">
        <span class="text-slate-500 font-medium">正解: </span>
        <span class="font-extrabold text-base cyrillic-text text-emerald-800 correct-answer-text">${correctAnswer}</span>
        ${pron && isPronunciationCautionWord(item || { mongolian: correctAnswer, pronunciation: pron }) ? `<span class="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md text-xs font-bold border border-amber-200 ml-1">⚠️ 読み注意: ${pron}</span>` : ''}
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
