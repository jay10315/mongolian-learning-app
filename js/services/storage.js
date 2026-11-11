import { WORD_FAMILIES_DATA } from '../data/wordFamiliesData.js';
import { TEXTBOOK_CLASSIFICATION_DATA } from '../data/textbookClassificationData.js';
const DEPRECATED_DUPLICATE_ID_MAP = {
  'v_genre_965': 'v_genre_964', // ананас -> хан боргоцой
  'v_genre_979': 'v_genre_978', // огурцы -> өргөст хэмх
  'v_genre_959': 'v_genre_958', // ший гуа -> тарвас
  'v_genre_956': 'v_genre_955', // банана -> гадил
  'v_genre_923': 'v_genre_922', // диван -> буйдан
  'v_genre_916': 'v_2_10',      // телевизор -> зурагт
  'v_genre_906': 'v_gen_545',   // пиво -> шар айраг
  'v_genre_908': 'v_genre_907', // вино -> дарс
  'v_note_172': 'v_genre_981',  // помидор -> улаан лооль
};

// LocalStorage データ管理・永続化サービス（SRS忘却曲線・クラウド自動同期連携）
import { initialVocabulary } from '../data/initialVocabulary.js';
import { initialGrammar } from '../data/initialGrammar.js';
import { initialGrammarQuizzes } from '../data/grammarQuizzes.js';
import { initialDeclensionQuizzes } from '../data/declensionQuizzes.js';
import { initialIllustrationQuizzes } from '../data/illustrationQuizzes.js';
import { initialListeningQuizzes } from '../data/listeningQuizzes.js';
import { initialReadingQuizzes } from '../data/readingQuizzes.js';
import { initialTypingSentences } from '../data/typingSentences.js';
import { SrsService } from './srs.js';
import { SyncService } from './sync.js';
import { cleanMongolianMojibake } from '../utils/helpers.js';

const STORAGE_KEYS = {
  VOCABULARY: 'mongol_app_vocabulary_v9',
  WORD_PROGRESS: 'mongol_app_word_progress_v1',
  GRAMMAR: 'mongol_app_grammar_v4',
  GRAMMAR_QUIZZES: 'mongol_app_grammar_quizzes_v6',
  DECLENSION_QUIZZES: 'mongol_app_declension_quizzes_v6',
  ILLUSTRATION_QUIZZES: 'mongol_app_illustration_quizzes_v1',
  LISTENING_QUIZZES: 'mongol_app_listening_quizzes_v1',
  READING_QUIZZES: 'mongol_app_reading_quizzes_v1',
  TYPING_SENTENCES: 'mongol_app_typing_sentences_v2',
  CUSTOM_TYPING_SENTENCES: 'mongol_app_custom_typing_sentences_v1',
  LOOKED_UP_WORDS: 'mongol_app_looked_up_words_v1',
  MISTAKES: 'mongol_app_mistakes_v1',
  HISTORY: 'mongol_app_history_v1',
  SETTINGS: 'mongol_app_settings_v1',
  DAILY_STATS: 'mongol_app_daily_stats_v1',
  GAME_STATS: 'mongol_app_game_stats_v1'
};

export class StorageService {
  // 初期データの初期化
  static init() {
    // 744語・48項目・152問・31イラスト問題の最新マスターデータを確実に同期
    try {
      // 古いバージョンのキーがあれば削除して最新化
      ['mongol_app_vocabulary_v1', 'mongol_app_vocabulary_v2', 'mongol_app_vocabulary_v3', 'mongol_app_vocabulary_v4', 'mongol_app_vocabulary_v5', 'mongol_app_vocabulary_v6', 'mongol_app_vocabulary_v7', 'mongol_app_vocabulary_v8'].forEach(k => {
        try { localStorage.removeItem(k); } catch (_) {}
      });
      ['mongol_app_declension_quizzes_v1', 'mongol_app_declension_quizzes_v2', 'mongol_app_declension_quizzes_v3', 'mongol_app_declension_quizzes_v4', 'mongol_app_declension_quizzes_v5'].forEach(k => {
        try { localStorage.removeItem(k); } catch (_) {}
      });
      ['mongol_app_grammar_quizzes_v1', 'mongol_app_grammar_quizzes_v2', 'mongol_app_grammar_quizzes_v3', 'mongol_app_grammar_quizzes_v4', 'mongol_app_grammar_quizzes_v5'].forEach(k => {
        try { localStorage.removeItem(k); } catch (_) {}
      });
      ['mongol_app_typing_sentences_v1'].forEach(k => {
        try { localStorage.removeItem(k); } catch (_) {}
      });

      const storedVocab = localStorage.getItem(STORAGE_KEYS.VOCABULARY);
      if (!storedVocab || storedVocab.includes('Боolгүй') || /第\d+課|JICA|（モンゴル語教科書語彙）/.test(storedVocab) || /[А-Яа-яЁёӨөҮү][ウエゴグンスアルモカトハヘオイロマミムメヤユヨラリレワ]/.test(storedVocab) || /[ウエゴグンスアルモカトハヘオイロマミムメヤユヨラリレワ][А-Яа-яЁёӨөҮү]/.test(storedVocab) || (storedVocab.includes('"v_2_21"') && storedVocab.includes('"mongolian":"байх"')) || (storedVocab.includes('"v_2_21"') && storedVocab.includes('"dictForm":"байх"')) || JSON.parse(storedVocab).length < initialVocabulary.length) {
        this.saveVocabulary(initialVocabulary);
      }
    } catch (e) {
      this.saveVocabulary(initialVocabulary);
    }

    try {
      ['mongol_app_grammar_v1', 'mongol_app_grammar_v2', 'mongol_app_grammar_v3'].forEach(k => {
        try { localStorage.removeItem(k); } catch (_) {}
      });
      const storedGrammar = localStorage.getItem(STORAGE_KEYS.GRAMMAR);
      if (!storedGrammar || JSON.parse(storedGrammar).length < initialGrammar.length) {
        this.saveGrammar(initialGrammar);
      }
    } catch (e) {
      this.saveGrammar(initialGrammar);
    }

    try {
      ['mongol_app_grammar_quizzes_v1', 'mongol_app_grammar_quizzes_v2', 'mongol_app_grammar_quizzes_v3'].forEach(k => {
        try { localStorage.removeItem(k); } catch (_) {}
      });
      const storedQuizzes = localStorage.getItem(STORAGE_KEYS.GRAMMAR_QUIZZES);
      if (!storedQuizzes || storedQuizzes.includes('дутуу = 不足') || JSON.parse(storedQuizzes).length < initialGrammarQuizzes.length) {
        this.saveGrammarQuizzes(initialGrammarQuizzes);
      }
    } catch (e) {
      this.saveGrammarQuizzes(initialGrammarQuizzes);
    }

    try {
      const storedIllus = localStorage.getItem(STORAGE_KEYS.ILLUSTRATION_QUIZZES);
      if (!storedIllus || JSON.parse(storedIllus).length < initialIllustrationQuizzes.length) {
        this.saveIllustrationQuizzes(initialIllustrationQuizzes);
      }
    } catch (e) {
      this.saveIllustrationQuizzes(initialIllustrationQuizzes);
    }

    try {
      const storedDec = localStorage.getItem(STORAGE_KEYS.DECLENSION_QUIZZES);
      if (!storedDec || /-[\u30e2]ор/.test(storedDec) || JSON.parse(storedDec).length < initialDeclensionQuizzes.length) {
        this.saveDeclensionQuizzes(initialDeclensionQuizzes);
      }
    } catch (_) {
      this.saveDeclensionQuizzes(initialDeclensionQuizzes);
    }
    if (!localStorage.getItem(STORAGE_KEYS.WORD_PROGRESS)) {
      localStorage.setItem(STORAGE_KEYS.WORD_PROGRESS, JSON.stringify({}));
    }

    // 既存の間違いノートと調べた単語の文字化け完全サニタイズ（カタカナ混入・ヒント漏れの永久排除）および重複単語の自動整理
    try {
      const rawMistakes = localStorage.getItem(STORAGE_KEYS.MISTAKES);
      if (rawMistakes) {
        let mistakes = JSON.parse(rawMistakes);
        if (Array.isArray(mistakes)) {
          let changed = false;
          const cleaned = mistakes.map(m => {
            const cQ = cleanMongolianMojibake(m.question || '');
            const cP = cleanMongolianMojibake(m.prompt || '');
            const cA = cleanMongolianMojibake(m.correctAnswer || '');
            const cU = cleanMongolianMojibake(m.userAnswer || '');
            const cE = cleanMongolianMojibake(m.explanation || '');
            if (cQ !== m.question || cP !== m.prompt || cA !== m.correctAnswer || cU !== m.userAnswer || cE !== m.explanation) {
              changed = true;
              return { ...m, question: cQ, prompt: cP, correctAnswer: cA, userAnswer: cU, explanation: cE };
            }
            return m;
          });
          const deduplicated = this.deduplicateMistakes(cleaned);
          if (deduplicated.length !== mistakes.length || changed) {
            localStorage.setItem(STORAGE_KEYS.MISTAKES, JSON.stringify(deduplicated));
          }
        }
      }
    } catch (_) {}

    try {
      const rawLookedUp = localStorage.getItem(STORAGE_KEYS.LOOKED_UP_WORDS);
      if (rawLookedUp) {
        const lookedUp = JSON.parse(rawLookedUp);
        if (Array.isArray(lookedUp)) {
          let changed = false;
          const cleaned = lookedUp.map(w => {
            const cRaw = cleanMongolianMojibake(w.rawWord || '');
            const cDict = cleanMongolianMojibake(w.dictForm || '');
            const cMean = cleanMongolianMojibake(w.meaning || '');
            if (cRaw !== w.rawWord || cDict !== w.dictForm || cMean !== w.meaning) {
              changed = true;
              return { ...w, rawWord: cRaw, dictForm: cDict, meaning: cMean };
            }
            return w;
          });
          if (changed) {
            localStorage.setItem(STORAGE_KEYS.LOOKED_UP_WORDS, JSON.stringify(cleaned));
          }
        }
      }
    } catch (_) {}
    if (!localStorage.getItem(STORAGE_KEYS.MISTAKES)) {
      localStorage.setItem(STORAGE_KEYS.MISTAKES, JSON.stringify([]));
    } else {
      // 過去に記録された間違いノートの問題文から「（モンゴル語教科書語彙）」や「⇄ 答え」の漏洩を全自動クリーニング＆補正
      try {
        const storedMistakes = localStorage.getItem(STORAGE_KEYS.MISTAKES);
        if (storedMistakes) {
          const list = JSON.parse(storedMistakes);
          let updated = false;
          const cleanKey = (str) => (str || '').toLowerCase().replace(/[\(\)（）\s.,!?-]/g, '');

          list.forEach(m => {
            let rawQ = (m.question || '').trim();
            let correctAns = (m.correctAnswer || '').trim();
            let explanation = (m.explanation || '').trim();

            // 語彙統一（モードによる語彙不一致・ロシア語借用語等の自動補正）
            if (rawQ.includes('パイナップル') || correctAns === 'ананас' || explanation.includes('ананас')) {
              m.correctAnswer = 'хан боргоцой';
              m.acceptableAnswers = ['хан боргоцой', 'ананас'];
              m.explanation = '正解: パイナップル (辞書形: хан боргоцой (ананас))';
              updated = true;
            }
            if (rawQ.includes('きゅうり') || correctAns === 'огурцы' || explanation.includes('огурцы')) {
              m.correctAnswer = 'өргөст хэмх';
              m.acceptableAnswers = ['өргөст хэмх', 'огурцы'];
              m.explanation = '正解: きゅうり (辞書形: өргөст хэмх (огурцы))';
              updated = true;
            }
            if (rawQ.includes('トマト') || correctAns === 'помидор' || explanation.includes('помидор')) {
              m.correctAnswer = 'улаан лооль';
              m.acceptableAnswers = ['улаан лооль', 'помидор'];
              m.explanation = '正解: トマト (辞書形: улаан лооль (помидор))';
              updated = true;
            }
            if (rawQ.includes('スイカ') || correctAns === 'ший гуа' || explanation.includes('ший гуа')) {
              m.correctAnswer = 'тарвас';
              m.acceptableAnswers = ['тарвас', 'ший гуа'];
              m.explanation = '正解: スイカ (辞書形: тарвас (ший гуа))';
              updated = true;
            }
            if (rawQ.includes('バナナ') || correctAns === 'банана' || explanation.includes('банана')) {
              m.correctAnswer = 'гадил';
              m.acceptableAnswers = ['гадил', 'банана', 'гадил жимс'];
              m.explanation = '正解: バナナ (辞書形: гадил (банана))';
              updated = true;
            }
            if (rawQ.includes('ソファー') || correctAns === 'диван' || explanation.includes('диван')) {
              m.correctAnswer = 'буйдан';
              m.acceptableAnswers = ['буйдан', 'диван'];
              m.explanation = '正解: ソファー (辞書形: буйдан (диван))';
              updated = true;
            }
            if (rawQ.includes('テレビ') || correctAns === 'телевизор' || explanation.includes('телевизор')) {
              m.correctAnswer = 'зурагт';
              m.acceptableAnswers = ['зурагт', 'телевизор'];
              m.explanation = '正解: テレビ (辞書形: зурагт (телевизор))';
              updated = true;
            }
            if (rawQ.includes('ビール') || correctAns === 'пиво' || explanation.includes('пиво')) {
              m.correctAnswer = 'шар айраг';
              m.acceptableAnswers = ['шар айраг', 'пиво', 'пиво(н)'];
              m.explanation = '正解: ビール (辞書形: шар айраг (пиво))';
              updated = true;
            }
            if (rawQ.includes('ワイン') || correctAns === 'вино' || explanation.includes('вино')) {
              m.correctAnswer = 'дарс';
              m.acceptableAnswers = ['дарс', 'вино'];
              m.explanation = '正解: ワイン (辞書形: дарс (вино))';
              updated = true;
            }
            if (correctAns.toLowerCase() === 'болно' || rawQ.includes('いいですよ') || rawQ.includes('大丈夫です')) {
              m.correctAnswer = 'Болно';
              m.acceptableAnswers = ['Болно', 'болно', 'Болно оо', 'болно оо', 'бол', 'болох'];
              m.question = rawQ.replace(/【動詞語幹】|【語幹】/g, '【表現】').replace(/【動詞辞書形】/g, '【表現】');
              m.category = '日常表現・応答';
              m.explanation = '正解: いいですよ、大丈夫です、OK (モンゴル語: Болно)。動詞「болох」由来の日常会話の応答表現です。';
              updated = true;
            }

            const hasParenNoise = rawQ.includes('モンゴル語教科書語彙') || (explanation && explanation.includes('モンゴル語教科書語彙')) || /第\d+課|JICA/.test(rawQ) || /第\d+課|JICA/.test(explanation) || /第\d+課|JICA/.test(m.category || '');
            const hasArrow = /⇄|⇆|↔|<->|->/.test(rawQ);
            const hasBayhIssue = (rawQ.includes('байх') || correctAns.includes('байх')) && (rawQ.includes('ない') || rawQ.includes('いない') || explanation.includes('ない') || explanation.includes('バイフグイ'));

            if (hasParenNoise || hasArrow || hasBayhIssue) {
              rawQ = rawQ.replace(/【第\d+課\s*/g, '【').replace(/[（\(]モンゴル語教科書語彙[）\)]/g, '').replace(/[（\(]JICA訓練所[）\)]/g, '').trim();
              correctAns = correctAns.replace(/[（\(]モンゴル語教科書語彙[）\)]/g, '').replace(/[（\(]JICA訓練所[）\)]/g, '').trim();
              explanation = explanation.replace(/【第\d+課\s*/g, '【').replace(/[（\(]モンゴル語教科書語彙[）\)]/g, '').replace(/[（\(]JICA訓練所[）\)]/g, '').trim();
              if (m.category) {
                m.category = m.category.replace(/^第\d+課\s*/, '').replace('JICA・社会', '社会・生活');
              }
              updated = true;

              if (hasBayhIssue) {
                if (correctAns === 'байх') correctAns = 'байхгүй';
                rawQ = rawQ.replace(/байх(?=[^\u0400-\u04FF]|$)/g, 'байхгүй');
                updated = true;
              }

              const qClean = cleanKey(rawQ);
              const aClean = cleanKey(correctAns);

              // 3段階マッチング（完全一致 -> 日本語一致 -> 最長モンゴル語部分一致）
              let matched = null;
              if (aClean) {
                matched = initialVocabulary.find(w => {
                  const mn = cleanKey(w.mongolian);
                  const df = cleanKey(w.dictForm);
                  const rt = cleanKey(w.root);
                  return aClean === mn || aClean === df || aClean === rt;
                });
              }
              if (!matched && qClean) {
                matched = initialVocabulary.find(w => {
                  const ja = cleanKey(w.japanese);
                  return ja && ja.length >= 2 && qClean.includes(ja);
                });
              }
              if (!matched && qClean) {
                const sortedWords = [...initialVocabulary].sort((a, b) =>
                  ((b.dictForm || b.mongolian || '').length) - ((a.dictForm || a.mongolian || '').length)
                );
                matched = sortedWords.find(w => {
                  const mn = cleanKey(w.mongolian);
                  const df = cleanKey(w.dictForm);
                  return (mn && mn.length >= 3 && qClean.includes(mn)) ||
                         (df && df.length >= 3 && qClean.includes(df));
                });
              }

              if (matched && (!m.type || m.type === 'word')) {
                const isV = matched.isVerb === true || (matched.pos && matched.pos.includes('動詞'));
                const df = matched.dictForm || matched.mongolian;
                const rt = matched.root || df;
                m.type = 'word';
                m.category = matched.category || '単語';
                m.question = `【単語】${matched.japanese}`;
                m.correctAnswer = isV ? (rt || df) : df;
                m.explanation = isV 
                  ? `【動詞】正解(語幹): ${rt} / 辞書形: ${df} / 意味: ${matched.japanese}。${matched.derivation || ''}`
                  : `${matched.japanese} = ${df}。${matched.derivation || ''}`;
                updated = true;
              } else if (hasArrow) {
                const parts = rawQ.split(/⇄|⇆|↔|<->|->/);
                let sideA = parts[0].trim().replace(/^【[^】]+】\s*/, '');
                let sideB = parts[1] ? parts[1].trim() : '';

                const hasCyrA = /[\u0400-\u04FF]/.test(sideA);
                const hasCyrB = /[\u0400-\u04FF]/.test(sideB);

                if (!hasCyrA && hasCyrB) {
                  m.question = `【単語】${sideA}`;
                  m.correctAnswer = sideB;
                } else if (hasCyrA && !hasCyrB) {
                  m.question = `【日本語訳】${sideA} の意味`;
                  m.correctAnswer = sideB;
                } else if (hasCyrA && hasCyrB) {
                  // 両辺キリル文字の場合は単語マスター逆引きで日本語意味を出題
                  const w = initialVocabulary.find(x => cleanKey(x.mongolian) === cleanKey(sideA) || cleanKey(x.dictForm) === cleanKey(sideA));
                  if (w) {
                    m.question = `【単語】${w.japanese}`;
                    m.correctAnswer = w.root || w.dictForm || sideA;
                  } else {
                    m.question = `【単語】${sideA}`;
                  }
                } else {
                  m.question = `【問題】${sideA}`;
                }
                updated = true;
              } else {
                m.question = rawQ;
                m.correctAnswer = correctAns;
                m.explanation = explanation;
              }
            }
          });
          if (updated) {
            localStorage.setItem(STORAGE_KEYS.MISTAKES, JSON.stringify(list));
          }
        }
      } catch (_) {}
    }
    if (!localStorage.getItem(STORAGE_KEYS.HISTORY)) {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      const defaultSettings = {
        dailyGoal: 20,
        soundEffects: true,
        showPronunciation: true,
        useVirtualKeyboard: true,
        theme: 'light'
      };
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(defaultSettings));
    }

    this.updateStreak();

    // 同期サービスの初期化
    SyncService.init();
  }

  // --- SRS忘却曲線進捗管理 ---

  static getAllWordProgress() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WORD_PROGRESS);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      return {};
    }
  }

  static getWordProgress(wordId) {
    const all = this.getAllWordProgress();
    return all[wordId] || SrsService.normalizeProgress({}, wordId);
  }

  static saveWordProgress(prog) {
    const all = this.getAllWordProgress();
    all[prog.wordId] = prog;
    localStorage.setItem(STORAGE_KEYS.WORD_PROGRESS, JSON.stringify(all));
    // クラウド同期キューに追加
    SyncService.enqueueChange('UPDATE_WORD_PROGRESS', prog);
    return prog;
  }

  /**
   * 解答結果をSRS忘却曲線エンジンに反映
   */
  static recordWordAnswer(wordId, isCorrect, difficulty = 'good') {
    const currentProg = this.getWordProgress(wordId);
    const updated = SrsService.processAnswer(currentProg, isCorrect, difficulty);
    const saved = this.saveWordProgress(updated);

    // 3回正解できたら自動で「覚えた（克服）」判定にし、間違えた単語リストから除外
    if (isCorrect) {
      this.resolveMistakesForWord(wordId, null, true);
    } else {
      this.resolveMistakesForWord(wordId, null, false);
    }
    return saved;
  }

  // --- 単語マスターデータ（SRS進捗をマージして提供） ---

  // --- あとで覚える単語の個別追加管理（ゲーム・テスト連携） ---
  static getAddedLaterWordIds() {
    try {
      const data = localStorage.getItem('mongol_app_added_later_words_v1');
      return data ? JSON.parse(data) : [];
    } catch (_) {
      return [];
    }
  }

  // --- 今覚える単語から「後で覚える」へ退避（移動）された単語IDリスト ---
  static getDemotedToLaterWordIds() {
    try {
      const data = localStorage.getItem('mongol_app_demoted_to_later_words_v1');
      return data ? JSON.parse(data) : [];
    } catch (_) {
      return [];
    }
  }

  /**
   * 単語を「あとで覚える単語」へワンタップ移動（全出題から除外・一時保管）
   */
  static moveWordToLater(wordId) {
    if (!wordId) return false;
    let added = this.getAddedLaterWordIds();
    let demoted = this.getDemotedToLaterWordIds();
    let changed = false;

    if (added.includes(wordId)) {
      added = added.filter(id => id !== wordId);
      this.setItem('mongol_app_added_later_words_v1', added);
      changed = true;
    }

    if (!demoted.includes(wordId)) {
      demoted.push(wordId);
      this.setItem('mongol_app_demoted_to_later_words_v1', demoted);
      changed = true;
    }

    if (changed) {
      if (typeof SyncService !== 'undefined' && SyncService.notifyDataChanged) {
        SyncService.notifyDataChanged();
      }
      try {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('mongol_app_added_words_updated', { detail: { wordId, action: 'demote' } }));
          window.dispatchEvent(new CustomEvent('mongol_app_storage_updated'));
        }
      } catch (_) {}
    }
    return true;
  }

  /**
   * 単語を「今覚える単語」へワンタップ移動・追加（全出題対象化）
   */
  static moveWordToActive(wordId) {
    if (!wordId) return false;
    let added = this.getAddedLaterWordIds();
    let demoted = this.getDemotedToLaterWordIds();
    let changed = false;

    if (demoted.includes(wordId)) {
      demoted = demoted.filter(id => id !== wordId);
      this.setItem('mongol_app_demoted_to_later_words_v1', demoted);
      changed = true;
    }

    const classData = (typeof TEXTBOOK_CLASSIFICATION_DATA !== 'undefined' && TEXTBOOK_CLASSIFICATION_DATA[wordId]) || null;
    const isOriginallyLater = classData && classData.status === 'later';
    if (isOriginallyLater && !added.includes(wordId)) {
      added.push(wordId);
      this.setItem('mongol_app_added_later_words_v1', added);
      changed = true;
    }

    if (changed) {
      if (typeof SyncService !== 'undefined' && SyncService.notifyDataChanged) {
        SyncService.notifyDataChanged();
      }
      try {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('mongol_app_added_words_updated', { detail: { wordId, action: 'add' } }));
          window.dispatchEvent(new CustomEvent('mongol_app_storage_updated'));
        }
      } catch (_) {}
    }
    return true;
  }

  static addWordToActiveLearning(wordId) {
    return this.moveWordToActive(wordId);
  }

  static removeWordFromActiveLearning(wordId) {
    return this.moveWordToLater(wordId);
  }

  static isWordAddedToActiveLearning(wordId) {
    const list = this.getAddedLaterWordIds();
    return list.includes(wordId);
  }

  /**
   * 全1439単語（教科書登場単語＋あとで覚える単語）をメタデータ付きで取得
   */
  static getAllVocabulary() {
    let baseList = [];
    try {
      const data = localStorage.getItem(STORAGE_KEYS.VOCABULARY);
      baseList = data ? JSON.parse(data) : initialVocabulary;
      if (baseList.length < initialVocabulary.length) {
        baseList = initialVocabulary;
        this.saveVocabulary(initialVocabulary);
      }
    } catch (e) {
      baseList = initialVocabulary;
    }

    // 語彙統一: 重複・非推奨IDの最新化と重複排除
    if (Array.isArray(baseList)) {
      const seen = new Set();
      baseList = baseList.map(item => {
        if (item && DEPRECATED_DUPLICATE_ID_MAP[item.id]) {
          const targetId = DEPRECATED_DUPLICATE_ID_MAP[item.id];
          const fresh = initialVocabulary.find(v => v.id === targetId);
          if (fresh) return { ...item, ...fresh };
        }
        return item;
      }).filter(item => {
        if (!item || !item.id) return false;
        if (seen.has(item.id)) return false;
        seen.add(item.id);
        return true;
      });
    }

    // 単語ファミリーから追加された語形を語彙リストに統合（全ゲーム連携）
    const addedFamilyIds = this.getAddedFamilyIds ? this.getAddedFamilyIds() : [];
    const addedFamilyFormIds = this.getAddedFamilyFormIds ? this.getAddedFamilyFormIds() : [];
    if (typeof WORD_FAMILIES_DATA !== 'undefined' && (addedFamilyIds.length > 0 || addedFamilyFormIds.length > 0)) {
      const existingIds = new Set(baseList.map(v => v.id));
      const existingMn = new Set(baseList.map(v => (v.mongolian || '').toLowerCase().trim()));
      
      WORD_FAMILIES_DATA.forEach(fam => {
        const isFamAdded = addedFamilyIds.includes(fam.familyId);
        fam.forms.forEach(form => {
          const isFormAdded = isFamAdded || addedFamilyFormIds.includes(form.formId);
          if (isFormAdded && !existingIds.has(form.formId) && !existingMn.has(form.mongolian.toLowerCase().trim())) {
            const formItem = {
              id: form.formId,
              mongolian: form.mongolian,
              japanese: form.japanese,
              pos: fam.pos,
              root: fam.stem,
              dictForm: fam.lemma,
              stem: fam.stem,
              explanation: `${form.role}。${form.ruleDesc}`,
              example: `${form.exampleMn}（${form.exampleJa}）`,
              examples: [{ mn: form.exampleMn, ja: form.exampleJa }],
              textbookStatus: 'textbook',
              textbookStatusLabel: '教科書掲載ファミリー語形',
              isAddedToLearning: true,
              isFamilyForm: true,
              familyId: fam.familyId
            };
            baseList.push(formItem);
            existingIds.add(form.formId);
            existingMn.add(form.mongolian.toLowerCase().trim());
          }
        });
      });
    }

    const progressMap = this.getAllWordProgress();
    const addedSet = new Set(this.getAddedLaterWordIds());
    const demotedSet = new Set(this.getDemotedToLaterWordIds());

    // initialVocabulary の最新解説・成り立ち・格支配情報を常にマージ
    const initMap = {};
    if (typeof initialVocabulary !== 'undefined' && Array.isArray(initialVocabulary)) {
      for (const iv of initialVocabulary) {
        if (iv.id) initMap[iv.id] = iv;
      }
    }

    // 各単語に教材照合分類、動詞語幹、辞書形、現在のSRS進捗と保持率メタデータを付与
    return baseList.map(item => {
      const freshMeta = initMap[item.id] || {};
      const mergedItem = { ...item, ...freshMeta };
      const prog = progressMap[item.id] || { srsLevel: 0, intervalDays: 0, studyCount: 0, correctCount: 0, wrongCount: 0, accuracy: 0 };
      const retentionData = SrsService.calculateRetention(prog);
      const masteryMeta = SrsService.getMasteryMeta(prog.srsLevel);

      const classData = (typeof TEXTBOOK_CLASSIFICATION_DATA !== 'undefined' && TEXTBOOK_CLASSIFICATION_DATA[item.id]) || {
        status: 'textbook',
        statusLabel: '学習済み教材の単語',
        appearanceSources: ['教科書'],
        appearanceDesc: '教科書に登場',
        reason: '',
        isVerb: Boolean(item.isVerb || (item.pos && item.pos.includes('動詞'))),
        stem: item.root || '',
        dictForm: item.dictForm || item.mongolian || ''
      };

      const isAdded = addedSet.has(item.id);
      const isDemoted = demotedSet.has(item.id);
      const isActiveLearning = (classData.status === 'textbook' ? !isDemoted : (isAdded && !isDemoted));

      return {
        ...mergedItem,
        textbookStatus: classData.status,
        textbookStatusLabel: classData.statusLabel,
        appearanceSources: classData.appearanceSources || [],
        appearanceDesc: classData.appearanceDesc || '全教材：未登場',
        laterReason: classData.reason || '',
        isAddedToLearning: isAdded,
        isDemotedToLater: isDemoted,
        isActiveLearning: isActiveLearning,
        stem: classData.stem || item.root || '',
        dictForm: classData.dictForm || item.dictForm || item.mongolian || '',
        srsLevel: prog.srsLevel || 0,
        intervalDays: prog.intervalDays || 0,
        nextReviewDate: prog.nextReviewDate || null,
        lastLearnedAt: prog.lastLearnedAt || null,
        studyCount: prog.studyCount || 0,
        correctCount: prog.correctCount || 0,
        wrongCount: prog.wrongCount || 0,
        accuracy: prog.accuracy || 0,
        retention: retentionData.retention,
        forgettingRisk: retentionData.forgettingRisk,
        isDue: retentionData.isDue,
        masteryLabel: masteryMeta.label,
        masteryBadge: masteryMeta.badge
      };
    });
  }

  /**
   * 既存ゲーム・テストの出題対象単語リストを取得
   * 1. 学習済み教材の単語（教科書・学習ノートに登場した単語）
   * 2. 「覚える単語に追加」したあとで覚える単語
   * @param {Object} options { includeAll: boolean }
   */
  /**
   * 正式な学習対象単語を取得（教科書掲載単語 ＋ 「あとで覚える単語」から正式追加した単語 ＋ ファミリー追加語形）
   * 「あとで覚える単語」に保管されているだけの単語は 100% 除外されます。
   * @param {Object} options { includeAll: boolean }
   */
  static getVocabulary(options = {}) {
    const all = this.getAllVocabulary();
    if (options && options.includeAll) {
      return all;
    }
    // 今覚える単語（教科書掲載単語、または「あとで覚える単語」から正式に追加登録され、後で覚えるへ退避されていない単語）
    // item.textbookStatus === 'textbook' || item.isAddedToLearning (退避分を除く)
    return all.filter(item => item.isActiveLearning);
  }

  /**
   * 「今覚える単語」（現在全ゲーム・テストの出題対象になっている単語リスト）を取得
   */
  static getActiveWords() {
    return this.getVocabulary();
  }

  /**
   * 教科書・学習ノート掲載の基本単語のみ取得
   */
  static getTextbookWords() {
    return this.getAllVocabulary().filter(item => item.textbookStatus === 'textbook');
  }

  /**
   * 「あとで覚える単語」（教材未登場の一時保管単語、および後で覚えるへ退避された単語）を取得
   * 正式追加された単語は「あとで覚える単語」から自動的に消えます。
   * options.includeAdded が true の場合のみ追加済みも含めて全件返却します。
   */
  static getLaterWords(options = {}) {
    const all = this.getAllVocabulary();
    const allLater = all.filter(item => item.textbookStatus === 'later');
    if (options && options.includeAdded) {
      return all.filter(item => item.textbookStatus === 'later' || item.isDemotedToLater);
    }
    // 正式登録済みの単語は「あとで覚える単語」から削除（消える）
    return all.filter(item => !item.isActiveLearning); // return allLater.filter(item => !item.isAddedToLearning);
  }

  /**
   * 「あとで覚える単語」から正式な学習単語へ昇格（追加）された単語一覧を取得
   */
  static getPromotedLaterWords() {
    return this.getAllVocabulary().filter(item => item.textbookStatus === 'later' && Boolean(item.isAddedToLearning));
  }

  /**
   * 今日の忘却曲線復習予定の単語リスト（復習期日が到来している単語）
   */
  static getDueReviewWords() {
    return this.getVocabulary().filter(v => v.srsLevel > 0 && v.isDue);
  }

  /**
   * 忘却リスクが高い単語リスト（保持率40%未満 / 忘却リスク60%以上）
   */
  static getHighRiskWords() {
    const mistakes = this.getMistakes();
    const mistakenWordIds = new Set();
    const clean = (s) => (s || '').toString().toLowerCase().replace(/[\(\)（）\s.,!?:;«»"'\-]/g, '');
    const mistakenAnswers = new Set(mistakes.map(m => clean(m.correctAnswer)).filter(Boolean));
    mistakes.forEach(m => {
      if (m.wordId) mistakenWordIds.add(m.wordId);
    });

    return this.getVocabulary().filter(v => 
      mistakenWordIds.has(v.id) ||
      mistakenAnswers.has(clean(v.mongolian)) ||
      mistakenAnswers.has(clean(v.dictForm)) ||
      (v.srsLevel > 0 && v.forgettingRisk >= 60) || 
      (v.wrongCount > 0 && v.srsLevel < 6)
    );
  }

  static saveVocabulary(items) {
    localStorage.setItem(STORAGE_KEYS.VOCABULARY, JSON.stringify(items));
  }

  static addVocabularyItem(item) {
    const list = this.getVocabulary();
    const newItem = {
      ...item,
      id: item.id || `v_custom_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      wrongCount: item.wrongCount || 0,
      srsLevel: item.srsLevel || 0,
      isMastered: false,
      createdAt: new Date().toISOString()
    };
    list.unshift(newItem);
    this.saveVocabulary(list);
    return newItem;
  }

  static addVocabularyBatch(items) {
    const list = this.getVocabulary();
    const formatted = items.map(item => ({
      ...item,
      id: item.id || `v_custom_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      wrongCount: item.wrongCount || 0,
      srsLevel: item.srsLevel || 0,
      isMastered: false,
      createdAt: new Date().toISOString()
    }));
    const merged = [...formatted, ...list];
    this.saveVocabulary(merged);
    return formatted.length;
  }

  static updateVocabularyItem(updated) {
    const list = this.getVocabulary();
    const idx = list.findIndex(v => v.id === updated.id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updated };
      this.saveVocabulary(list);
      return true;
    }
    return false;
  }

  static deleteVocabularyItem(id) {
    const list = this.getVocabulary().filter(v => v.id !== id);
    this.saveVocabulary(list);
  }

  static resetVocabularyToDefault() {
    this.saveVocabulary(initialVocabulary);
    this.saveGrammar(initialGrammar);
    this.saveGrammarQuizzes(initialGrammarQuizzes);
    this.saveDeclensionQuizzes(initialDeclensionQuizzes);
    localStorage.removeItem(STORAGE_KEYS.WORD_PROGRESS);
    SyncService.triggerSync();
  }

  // --- 文法 ---
  static getGrammar() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.GRAMMAR);
      return data ? JSON.parse(data) : initialGrammar;
    } catch (e) {
      return initialGrammar;
    }
  }

  static saveGrammar(items) {
    localStorage.setItem(STORAGE_KEYS.GRAMMAR, JSON.stringify(items));
  }

  static addGrammarItem(item) {
    const list = this.getGrammar();
    const newItem = {
      ...item,
      id: item.id || `g_custom_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    list.unshift(newItem);
    this.saveGrammar(list);
    return newItem;
  }

  static getGrammarQuizzes() {
    const sanitize = (list) => {
      return (list || []).map(q => {
        let answer = q.answer;
        let tokens = q.tokens;
        let acceptableAnswers = q.acceptableAnswers ? [...q.acceptableAnswers] : [];

        // 算用数字からモンゴル語表記（есөн等）への統一
        if (typeof answer === 'string') {
          if (answer.includes('9 цагт')) {
            answer = answer.replace(/9 цагт/g, 'есөн цагт');
            if (!acceptableAnswers.includes(q.answer)) acceptableAnswers.push(q.answer);
          }
          if (answer.includes('10 дугаар сарын 14-ний')) {
            answer = answer.replace(/10 дугаар сарын 14-ний/g, 'аравдугаар сарын арван дөрөвний');
            if (!acceptableAnswers.includes(q.answer)) acceptableAnswers.push(q.answer);
          }
          if (answer.includes('10 дугаар сарын 15-ны')) {
            answer = answer.replace(/10 дугаар сарын 15-ны/g, 'аравдугаар сарын арван тавны');
            if (!acceptableAnswers.includes(q.answer)) acceptableAnswers.push(q.answer);
          }
        }

        if (Array.isArray(tokens)) {
          tokens = tokens.map(t => {
            if (t === '9') return 'есөн';
            if (t === '10') return 'арав';
            if (t === '14-ний') return 'арван дөрөвний';
            if (t === '15-ны') return 'арван тавны';
            return t;
          });
          if (tokens.includes('арав') && tokens.includes('дугаар')) {
            const idx = tokens.indexOf('арав');
            if (tokens[idx + 1] === 'дугаар') {
              tokens.splice(idx, 2, 'аравдугаар');
            }
          }
        }

        return {
          ...q,
          answer,
          tokens,
          acceptableAnswers
        };
      });
    };

    try {
      const data = localStorage.getItem(STORAGE_KEYS.GRAMMAR_QUIZZES);
      const parsed = data ? JSON.parse(data) : initialGrammarQuizzes;
      return sanitize(parsed);
    } catch (e) {
      return sanitize(initialGrammarQuizzes);
    }
  }

  static saveGrammarQuizzes(items) {
    localStorage.setItem(STORAGE_KEYS.GRAMMAR_QUIZZES, JSON.stringify(items));
  }

  static getDeclensionQuizzes() {
    const sanitize = (list) => {
      const fix = (s) => (typeof s === 'string') ? s.replace(/ス/g, 'с').replace(/ウ/g, 'у').replace(/エ/g, 'э').replace(/タ/g, 'т').replace(/モ/g, 'м').replace(/ア/g, 'а').replace(/オ/g, 'о').replace(/ル/g, 'л').replace(/ン/g, 'н').replace(/グ/g, 'г').replace(/ゴ/g, 'г') : s;
      return list.map(q => ({
        ...q,
        answer: fix(q.answer),
        question: fix(q.question),
        prompt: fix(q.prompt),
        baseWord: fix(q.baseWord),
        baseMeaning: fix(q.baseMeaning),
        explanation: fix(q.explanation),
        rule: fix(q.rule),
        options: Array.isArray(q.options) ? q.options.map(fix) : q.options
      }));
    };
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DECLENSION_QUIZZES);
      const parsed = data ? JSON.parse(data) : null;
      if (parsed && Array.isArray(parsed) && parsed.length >= initialDeclensionQuizzes.length) {
        const clean = sanitize(parsed);
        if (data.includes('ス') || data.includes('ウ') || data.includes('エ')) {
          this.saveDeclensionQuizzes(clean);
        }
        return clean;
      }
      const initialClean = sanitize(initialDeclensionQuizzes);
      this.saveDeclensionQuizzes(initialClean);
      return initialClean;
    } catch (e) {
      return sanitize(initialDeclensionQuizzes);
    }
  }

  static saveDeclensionQuizzes(items) {
    localStorage.setItem(STORAGE_KEYS.DECLENSION_QUIZZES, JSON.stringify(items));
  }

  // --- ビジュアルイラスト問題（SVGインライン・完全オフライン） ---
  static getIllustrationQuizzes() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ILLUSTRATION_QUIZZES);
      return data ? JSON.parse(data) : initialIllustrationQuizzes;
    } catch (e) {
      return initialIllustrationQuizzes;
    }
  }

  static saveIllustrationQuizzes(items) {
    localStorage.setItem(STORAGE_KEYS.ILLUSTRATION_QUIZZES, JSON.stringify(items));
  }

  // --- リスニング問題集（穴埋め・ディクテーション・数字特化） ---
  static getListeningQuizzes() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LISTENING_QUIZZES);
      return data ? JSON.parse(data) : initialListeningQuizzes;
    } catch (e) {
      return initialListeningQuizzes;
    }
  }

  static saveListeningQuizzes(items) {
    localStorage.setItem(STORAGE_KEYS.LISTENING_QUIZZES, JSON.stringify(items));
  }

  // --- 読解問題集（長文読解・段落・文化） ---
  static getReadingQuizzes() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.READING_QUIZZES);
      return data ? JSON.parse(data) : initialReadingQuizzes;
    } catch (e) {
      return initialReadingQuizzes;
    }
  }

  static saveReadingQuizzes(items) {
    localStorage.setItem(STORAGE_KEYS.READING_QUIZZES, JSON.stringify(items));
  }

  // --- タイピング練習例文集 ---
  static getTypingSentences() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TYPING_SENTENCES);
      return data ? JSON.parse(data) : initialTypingSentences;
    } catch (e) {
      return initialTypingSentences;
    }
  }

  static saveTypingSentences(items) {
    localStorage.setItem(STORAGE_KEYS.TYPING_SENTENCES, JSON.stringify(items));
  }

  // --- 自作タイピング文章（マイ登録例文） ---
  static getCustomTypingSentences() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CUSTOM_TYPING_SENTENCES);
      if (data) return JSON.parse(data);
      // 初期の親切なサンプル例文（いつでも編集・削除可能）
      const initialCustom = [
        {
          id: "custom_sample_1",
          level: "自作",
          category: "custom",
          categoryLabel: "マイ登録例文",
          textMn: "Би Монгол улсад хайртай.",
          textJa: "私はモンゴルという国が大好きです。",
          romaji: "bi mongol ulsad khairtai.",
          explanation: "「хайртай」は「愛している、大好き」という重要表現です。",
          glossary: {
            "би": { dictForm: "би", meaning: "私", pos: "代名詞", pron: "ビ" },
            "хайртай": { dictForm: "хайр", meaning: "愛、愛している", pos: "形容詞", pron: "ハイエルタイ" }
          },
          createdAt: new Date().toISOString()
        },
        {
          id: "custom_sample_2",
          level: "自作",
          category: "custom",
          categoryLabel: "マイ登録例文",
          textMn: "Өнөөдөр цаг агаар сайхан байна.",
          textJa: "今日は天気が良いですね。",
          romaji: "onoodor tsag agaar saikhan baina.",
          explanation: "「цаг агаар」で「天気」を表します。",
          glossary: {
            "өнөөдөр": { dictForm: "өнөөдөр", meaning: "今日", pos: "副詞", pron: "オヌードル" },
            "цаг": { dictForm: "цаг", meaning: "時、時間、時計", pos: "名詞", pron: "ツァグ" },
            "байна": { dictForm: "байх", meaning: "ある、いる、〜である", pos: "動詞", pron: "バイナ" }
          },
          createdAt: new Date().toISOString()
        }
      ];
      localStorage.setItem(STORAGE_KEYS.CUSTOM_TYPING_SENTENCES, JSON.stringify(initialCustom));
      return initialCustom;
    } catch (_) {
      return [];
    }
  }

  static saveCustomTypingSentences(items) {
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOM_TYPING_SENTENCES, JSON.stringify(items));
    } catch (_) {}
  }

  static addOrUpdateCustomTypingSentence(sentence) {
    const list = this.getCustomTypingSentences();
    const item = {
      ...sentence,
      id: sentence.id || `custom_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      level: sentence.level || "自作",
      category: "custom",
      categoryLabel: sentence.categoryLabel || "マイ登録例文",
      createdAt: sentence.createdAt || new Date().toISOString()
    };
    const idx = list.findIndex(s => s.id === item.id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...item };
    } else {
      list.unshift(item);
    }
    this.saveCustomTypingSentences(list);
    return item;
  }

  static deleteCustomTypingSentence(id) {
    const list = this.getCustomTypingSentences().filter(s => s.id !== id);
    this.saveCustomTypingSentences(list);
    return list;
  }

  // --- 調べた単語帳（読解テスト・タイピングからの単語タップ保存） ---
  static getLookedUpWords() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LOOKED_UP_WORDS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  static saveLookedUpWord(wordData) {
    if (!wordData || (!wordData.rawWord && !wordData.dictForm)) return null;
    const list = this.getLookedUpWords();
    const cleanKey = (wordData.dictForm || wordData.rawWord || '').trim().toLowerCase();
    const idx = list.findIndex(w => (w.dictForm || w.rawWord || '').trim().toLowerCase() === cleanKey);
    let savedItem = null;

    if (idx !== -1) {
      list[idx].lookupCount = (list[idx].lookupCount || 1) + 1;
      list[idx].lastLookedUpAt = new Date().toISOString();
      if (wordData.meaning && (!list[idx].meaning || list[idx].meaning.includes('推測'))) {
        list[idx].meaning = wordData.meaning;
      }
      if (wordData.passageTitle) list[idx].passageTitle = wordData.passageTitle;
      savedItem = list[idx];
    } else {
      savedItem = {
        id: `lookup_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        rawWord: wordData.rawWord,
        dictForm: wordData.dictForm || wordData.rawWord,
        meaning: wordData.meaning || '意味を確認中',
        pos: wordData.pos || '',
        pron: wordData.pron || '',
        passageTitle: wordData.passageTitle || '',
        lookupCount: 1,
        firstLookedUpAt: new Date().toISOString(),
        lastLookedUpAt: new Date().toISOString()
      };
      list.unshift(savedItem);
    }

    try {
      localStorage.setItem(STORAGE_KEYS.LOOKED_UP_WORDS, JSON.stringify(list));
    } catch (_) {}
    return savedItem;
  }

  static deleteLookedUpWord(id) {
    const list = this.getLookedUpWords().filter(w => w.id !== id);
    try {
      localStorage.setItem(STORAGE_KEYS.LOOKED_UP_WORDS, JSON.stringify(list));
    } catch (_) {}
  }

  static markLookedUpWordResolved(idOrWord, isResolved = true) {
    const list = this.getLookedUpWords();
    const clean = (idOrWord || '').trim().toLowerCase();
    const idx = list.findIndex(w => w.id === idOrWord || (w.dictForm || w.rawWord || '').trim().toLowerCase() === clean);
    if (idx !== -1) {
      list[idx].resolved = isResolved;
      list[idx].isMastered = isResolved;
      try {
        localStorage.setItem(STORAGE_KEYS.LOOKED_UP_WORDS, JSON.stringify(list));
      } catch (_) {}
      return list[idx];
    }
    return null;
  }

  static clearLookedUpWords() {
    try {
      localStorage.setItem(STORAGE_KEYS.LOOKED_UP_WORDS, JSON.stringify([]));
    } catch (_) {}
  }

  static isWordLookedUp(rawWord) {
    if (!rawWord) return false;
    const clean = rawWord.trim().toLowerCase().replace(/[.,!?:;«»"'\(\)\[\]]/g, '');
    const list = this.getLookedUpWords();
    return list.some(w => (w.rawWord || '').toLowerCase() === clean || (w.dictForm || '').toLowerCase() === clean);
  }

  // --- 間違いノート（永続化・アカウント同期対応） ---

  /**
   * 間違い項目の同一単語判定用キーを生成
   * （出題形式の違い、空白、括弧、隠れ-нの違いを吸収して同一単語を1つに特定）
   */
  static getMistakeCanonicalKey(item) {
    if (!item) return '';

    // キリル文字（モンゴル語）の抽出・正規化
    const extractCyrillic = (str) => {
      if (!str) return '';
      let s = str.toString().toLowerCase();
      s = s.replace(/[\(（][нН][\)）]/g, '');
      s = s.replace(/[\(（][^\)）]*[\)）]/g, '');
      return s.replace(/[^\u0400-\u04FF]/g, '');
    };

    // 日本語の抽出・正規化
    const extractJapanese = (str) => {
      if (!str) return '';
      let s = str.toString();
      s = s.replace(/【[^】]*】/g, '');
      s = s.replace(/の意味$/g, '');
      s = s.replace(/[\(（][^\)）]*[\)）]/g, '');
      return s.replace(/[^\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/g, '');
    };

    const cyAns = extractCyrillic(item.correctAnswer);
    const cyQ = extractCyrillic(item.question);
    const cyrillic = cyAns || cyQ;

    const jaQ = extractJapanese(item.question);
    const jaAns = extractJapanese(item.correctAnswer);
    const japanese = jaQ || jaAns;

    // 単語IDがある場合
    if (item.wordId) {
      if (cyrillic) return `w_${cyrillic}`;
      return `wid_${item.wordId}`;
    }

    // キリル文字と日本語の組み合わせ、またはキリル文字単独
    if (cyrillic && japanese) {
      return `pair_${cyrillic}_${japanese}`;
    } else if (cyrillic) {
      return `cy_${cyrillic}`;
    } else if (japanese) {
      return `ja_${japanese}`;
    }

    const rawClean = (s) => (s || '').toString().toLowerCase().replace(/[\s.,!?:;«»"'\-]/g, '');
    return `raw_${rawClean(item.question)}_${rawClean(item.correctAnswer)}`;
  }

  /**
   * 間違いリスト内の重複（同一単語の複数記録）を自動統合・整理する
   * @param {Array} list 間違いリスト
   * @returns {Array} 重複排除・統合済みの間違いリスト
   */
  static deduplicateMistakes(list) {
    if (!Array.isArray(list) || list.length === 0) return [];

    const groups = new Map();
    list.forEach(item => {
      if (!item) return;
      const key = this.getMistakeCanonicalKey(item);
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key).push(item);
    });

    const result = [];
    groups.forEach((items) => {
      if (items.length === 1) {
        result.push(items[0]);
        return;
      }

      // 複数ある場合は最新のものをベースにして統合
      items.sort((a, b) => new Date(b.lastWrongDate || b.created_at || 0) - new Date(a.lastWrongDate || a.created_at || 0));
      const base = { ...items[0] };

      // 誤答回数: 重複している各項目の最大値、または合計（上限50）を反映
      const maxWrong = Math.max(...items.map(it => it.wrongCount || 1));
      const sumWrong = items.reduce((acc, it) => acc + (it.wrongCount || 1), 0);
      base.wrongCount = Math.max(maxWrong, Math.min(sumWrong, 50));

      // 連続正解数: 最大値を反映
      const maxConsecutive = Math.max(...items.map(it => it.consecutiveCorrect || 0));
      base.consecutiveCorrect = maxConsecutive;

      // 克服フラグ: いずれかが克服済み、または連続正解3回以上なら克服済み
      const anyResolved = items.some(it => Boolean(it.resolved));
      base.resolved = Boolean(anyResolved || (base.consecutiveCorrect >= 3));
      if (base.resolved) {
        base.consecutiveCorrect = Math.max(base.consecutiveCorrect, 3);
        base.resolvedAt = base.resolvedAt || items.find(it => it.resolvedAt)?.resolvedAt || new Date().toISOString();
      }

      // wordId: 持っているものがあれば補完
      if (!base.wordId) {
        const itemWithWordId = items.find(it => it.wordId);
        if (itemWithWordId) base.wordId = itemWithWordId.wordId;
      }

      // explanation: より詳しい解説を採用
      const bestExp = items.map(it => it.explanation || '').sort((a, b) => b.length - a.length)[0];
      if (bestExp) base.explanation = bestExp;

      result.push(base);
    });

    // 最新の間違い日時順で並び替え
    result.sort((a, b) => new Date(b.lastWrongDate || b.created_at || 0) - new Date(a.lastWrongDate || a.created_at || 0));
    return result;
  }

  /**
   * 間違いリストの重複を即座に整理・統合して保存する
   */
  static deduplicateMistakesAndSave() {
    const list = this.getMistakes();
    const deduplicated = this.deduplicateMistakes(list);
    localStorage.setItem(STORAGE_KEYS.MISTAKES, JSON.stringify(deduplicated));
    try {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('mongol_app_mistakes_updated'));
        window.dispatchEvent(new CustomEvent('mongol_app_storage_updated'));
      }
    } catch (_) {}
    return deduplicated;
  }

  static getMistakes() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MISTAKES);
      let list = data ? JSON.parse(data) : [];
      let mutated = false;

      // 重複単語の自動整理・統合
      const originalLen = list.length;
      list = this.deduplicateMistakes(list);
      if (list.length !== originalLen) {
        mutated = true;
      }

      list.forEach((m, idx) => {
        if (!m.id) {
          m.id = `m_${idx}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
          mutated = true;
        }
        if (m.consecutiveCorrect === undefined) {
          m.consecutiveCorrect = m.resolved ? 3 : 0;
          mutated = true;
        }
        // 3回正解に達している、もしくは resolved が true なら整合性を保つ
        if ((m.consecutiveCorrect >= 3 || m.resolved) && !m.resolved) {
          m.resolved = true;
          m.consecutiveCorrect = Math.max(m.consecutiveCorrect || 0, 3);
          m.resolvedAt = m.resolvedAt || new Date().toISOString();
          mutated = true;
        }
      });
      if (mutated) {
        localStorage.setItem(STORAGE_KEYS.MISTAKES, JSON.stringify(list));
      }
      return list;
    } catch (e) {
      return [];
    }
  }

  static recordMistake(mistake) {
    if (!mistake) return null;
    const sanitizedMistake = {
      ...mistake,
      question: cleanMongolianMojibake(mistake.question || ''),
      prompt: cleanMongolianMojibake(mistake.prompt || ''),
      correctAnswer: cleanMongolianMojibake(mistake.correctAnswer || ''),
      userAnswer: cleanMongolianMojibake(mistake.userAnswer || ''),
      explanation: cleanMongolianMojibake(mistake.explanation || '')
    };
    let list = this.getMistakes();
    const newKey = this.getMistakeCanonicalKey(sanitizedMistake);

    // 完全一致だけでなく同一単語判定キーで既存の単語を検索し、同一単語の重複発生を防止
    const existingIdx = list.findIndex(m => {
      if (m.question === sanitizedMistake.question && m.correctAnswer === sanitizedMistake.correctAnswer) return true;
      return this.getMistakeCanonicalKey(m) === newKey;
    });
    let itemToSync = null;

    if (existingIdx !== -1) {
      if (!list[existingIdx].id) {
        list[existingIdx].id = `m_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      }
      list[existingIdx].wrongCount = (list[existingIdx].wrongCount || 1) + 1;
      list[existingIdx].lastWrongDate = new Date().toISOString();
      list[existingIdx].userAnswer = mistake.userAnswer;
      list[existingIdx].resolved = false;
      list[existingIdx].consecutiveCorrect = 0; // 再度間違えたら連続正解数をリセット
      if (mistake.wordId) list[existingIdx].wordId = mistake.wordId;
      if (sanitizedMistake.explanation && (!list[existingIdx].explanation || sanitizedMistake.explanation.length > list[existingIdx].explanation.length)) {
        list[existingIdx].explanation = sanitizedMistake.explanation;
      }
      itemToSync = list[existingIdx];
    } else {
      itemToSync = {
        id: `m_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        wordId: mistake.wordId || null,
        ...sanitizedMistake,
        wrongCount: 1,
        consecutiveCorrect: 0,
        lastWrongDate: new Date().toISOString(),
        resolved: false
      };
      list.unshift(itemToSync);
    }
    list = this.deduplicateMistakes(list);
    localStorage.setItem(STORAGE_KEYS.MISTAKES, JSON.stringify(list));

    // クラウドキュー送信
    SyncService.enqueueChange('RECORD_MISTAKE', itemToSync);
    return itemToSync;
  }

  static markMistakeResolved(id, isResolved = true, extra = {}) {
    const list = this.getMistakes();
    const clean = (s) => (s || '').toString().toLowerCase().replace(/[\(\)（）\s.,!?:;«»"'\-]/g, '');
    const cQ = clean(extra?.question);
    const cAns = clean(extra?.correctAnswer);
    const wordId = extra?.wordId;

    let targetIdx = -1;
    if (id) {
      targetIdx = list.findIndex(m => m.id === id);
    }
    if (targetIdx === -1 && cQ && cAns) {
      targetIdx = list.findIndex(m => clean(m.question) === cQ && clean(m.correctAnswer) === cAns);
    }
    if (targetIdx === -1 && wordId) {
      targetIdx = list.findIndex(m => m.wordId === wordId);
    }
    if (targetIdx === -1 && cAns) {
      targetIdx = list.findIndex(m => clean(m.correctAnswer) === cAns);
    }
    if (targetIdx === -1 && cQ) {
      targetIdx = list.findIndex(m => {
        const mq = clean(m.question);
        return mq === cQ || mq.includes(cQ) || cQ.includes(mq);
      });
    }

    if (targetIdx !== -1) {
      list[targetIdx].resolved = isResolved;
      list[targetIdx].resolvedAt = isResolved ? new Date().toISOString() : null;
      list[targetIdx].consecutiveCorrect = isResolved ? 3 : 0;
      localStorage.setItem(STORAGE_KEYS.MISTAKES, JSON.stringify(list));
      SyncService.enqueueChange('RECORD_MISTAKE', list[targetIdx]);
      try {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('mongol_app_mistakes_updated', { detail: { id: list[targetIdx].id, isResolved } }));
          window.dispatchEvent(new CustomEvent('mongol_app_storage_updated'));
        }
      } catch (_) {}
      return list[targetIdx];
    }
    return null;
  }

  /**
   * 間違い問題の回答結果を記録し、3回正解ルールを適用する
   * @param {string|Object} mistakeOrId 間違いIDまたは間違いオブジェクト
   * @param {boolean} isCorrect 正解かどうか
   * @returns {Object|null} 更新された間違いオブジェクト
   */
  static recordMistakeAnswer(mistakeOrId, isCorrect) {
    const list = this.getMistakes();
    if (!list) return null;

    const id = typeof mistakeOrId === 'string' ? mistakeOrId : (mistakeOrId?.id);
    const qText = typeof mistakeOrId === 'object' ? mistakeOrId?.question : '';
    const ansText = typeof mistakeOrId === 'object' ? mistakeOrId?.correctAnswer : '';
    const wordId = typeof mistakeOrId === 'object' ? mistakeOrId?.wordId : '';

    const clean = (s) => (s || '').toString().toLowerCase().replace(/[\(\)（）\s.,!?:;«»"'\-]/g, '');
    const cQ = clean(qText);
    const cAns = clean(ansText);

    let targetIdx = -1;
    if (id) {
      targetIdx = list.findIndex(m => m.id === id);
    }
    if (targetIdx === -1 && cQ && cAns) {
      targetIdx = list.findIndex(m => clean(m.question) === cQ && clean(m.correctAnswer) === cAns);
    }
    if (targetIdx === -1 && wordId) {
      targetIdx = list.findIndex(m => m.wordId === wordId);
    }
    if (targetIdx === -1 && cAns) {
      targetIdx = list.findIndex(m => clean(m.correctAnswer) === cAns);
    }
    if (targetIdx === -1 && cQ) {
      targetIdx = list.findIndex(m => clean(m.question) === cQ);
    }

    let m = null;
    if (targetIdx !== -1) {
      m = list[targetIdx];
    } else if (typeof mistakeOrId === 'object' && mistakeOrId) {
      m = {
        id: id || `m_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        wordId: wordId || null,
        question: qText || '',
        correctAnswer: ansText || '',
        consecutiveCorrect: 0,
        wrongCount: 1,
        resolved: false,
        lastWrongDate: new Date().toISOString()
      };
      list.unshift(m);
    }

    if (m) {
      if (isCorrect) {
        m.consecutiveCorrect = (m.consecutiveCorrect || 0) + 1;
        if (m.consecutiveCorrect >= 3) {
          m.resolved = true;
          m.resolvedAt = new Date().toISOString();
        } else {
          m.resolved = false;
        }
      } else {
        m.consecutiveCorrect = 0;
        m.resolved = false;
        m.wrongCount = (m.wrongCount || 1) + 1;
        m.lastWrongDate = new Date().toISOString();
      }
      localStorage.setItem(STORAGE_KEYS.MISTAKES, JSON.stringify(list));
      SyncService.enqueueChange('RECORD_MISTAKE', m);
      try {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('mongol_app_mistakes_updated', { detail: { id: m.id, isCorrect, resolved: m.resolved, consecutiveCorrect: m.consecutiveCorrect } }));
          window.dispatchEvent(new CustomEvent('mongol_app_storage_updated'));
        }
      } catch (_) {}
      return m;
    }
    return null;
  }

  /**
   * 正解した単語に対して「覚えた」と判定し、該当する間違いノートの記録を克服済みにする（間違えた単語リストから即座に消去）
   * @param {string} wordId 単語ID
   * @param {Object|null} wordObj 単語オブジェクト
   * @param {boolean} isResolved trueで克服済み
   */
  static resolveMistakesForWord(wordId, wordObj = null, isCorrectAnswer = true) {
    if (!wordId && !wordObj) return 0;
    const list = this.getMistakes();
    if (!list || list.length === 0) return 0;

    let targetObj = wordObj;
    if (!targetObj && wordId) {
      try {
        targetObj = this.getAllVocabulary().find(v => v.id === wordId);
      } catch (_) {}
    }

    const clean = (s) => (s || '').toString().toLowerCase().replace(/[\(\)（）\s.,!?:;«»"'\-]/g, '');
    const wMn = clean(targetObj?.mongolian);
    const wDf = clean(targetObj?.dictForm);
    const wRoot = clean(targetObj?.root);
    const wJa = clean(targetObj?.japanese);

    let changedCount = 0;
    list.forEach(m => {
      const mWordId = m.wordId || '';
      const mAns = clean(m.correctAnswer);
      const mQ = clean(m.question);

      const isMatch = (wordId && (m.id === wordId || (mWordId && wordId === mWordId))) ||
        (wMn && (mAns === wMn || mAns.includes(wMn) || mQ.includes(wMn))) ||
        (wDf && (mAns === wDf || mAns.includes(wDf) || mQ.includes(wDf))) ||
        (wRoot && mAns === wRoot) ||
        (wJa && (mAns === wJa || mQ.includes(wJa)));

      if (isMatch) {
        if (isCorrectAnswer) {
          m.consecutiveCorrect = (m.consecutiveCorrect || 0) + 1;
          // 3回正解できたら自動で「覚えた（克服）」判定にし、間違えた単語リストから除外
          if (m.consecutiveCorrect >= 3) {
            m.resolved = true;
            m.resolvedAt = new Date().toISOString();
          } else {
            m.resolved = false;
          }
        } else {
          m.consecutiveCorrect = 0;
          m.resolved = false;
          m.lastWrongDate = new Date().toISOString();
        }
        changedCount++;
        SyncService.enqueueChange('RECORD_MISTAKE', m);
      }
    });

    if (changedCount > 0) {
      localStorage.setItem(STORAGE_KEYS.MISTAKES, JSON.stringify(list));
      try {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('mongol_app_mistakes_updated'));
          window.dispatchEvent(new CustomEvent('mongol_app_storage_updated'));
        }
      } catch (_) {}
    }
    return changedCount;
  }

  /**
   * 文法・格変化・その他の問題で正解した際、問題文または正解から間違いを克服済みにする（覚えたと判定）
   */
  static resolveMistakeByQuestion(questionText, correctAnswer = '', isCorrectAnswer = true) {
    if (!questionText && !correctAnswer) return 0;
    const list = this.getMistakes();
    if (!list || list.length === 0) return 0;

    const clean = (s) => (s || '').toString().toLowerCase().replace(/[\(\)（）\s.,!?:;«»"'\-]/g, '');
    const cQ = clean(questionText);
    const cAns = clean(correctAnswer);

    let changedCount = 0;
    list.forEach(m => {
      const mQ = clean(m.question);
      const mAns = clean(m.correctAnswer);

      const isMatch = (cQ && (mQ === cQ || mQ.includes(cQ) || cQ.includes(mQ))) &&
        (!cAns || mAns === cAns || mAns.includes(cAns) || cAns.includes(mAns));

      if (isMatch) {
        if (isCorrectAnswer) {
          m.consecutiveCorrect = (m.consecutiveCorrect || 0) + 1;
          if (m.consecutiveCorrect >= 3) {
            m.resolved = true;
            m.resolvedAt = new Date().toISOString();
          } else {
            m.resolved = false;
          }
        } else {
          m.consecutiveCorrect = 0;
          m.resolved = false;
          m.lastWrongDate = new Date().toISOString();
        }
        changedCount++;
        SyncService.enqueueChange('RECORD_MISTAKE', m);
      }
    });

    if (changedCount > 0) {
      localStorage.setItem(STORAGE_KEYS.MISTAKES, JSON.stringify(list));
      try {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('mongol_app_mistakes_updated'));
          window.dispatchEvent(new CustomEvent('mongol_app_storage_updated'));
        }
      } catch (_) {}
    }
    return changedCount;
  }

  static getActiveMistakes() {
    return this.getMistakes().filter(m => !m.resolved);
  }

  static removeMistake(id, extra = {}) {
    let list = this.getMistakes();
    const clean = (s) => (s || '').toString().toLowerCase().replace(/[\(\)（）\s.,!?:;«»"'\-]/g, '');
    const cQ = clean(extra?.question);
    const cAns = clean(extra?.correctAnswer);
    const wordId = extra?.wordId;

    if (id) {
      list = list.filter(m => m.id !== id);
    } else if (cQ && cAns) {
      list = list.filter(m => !(clean(m.question) === cQ && clean(m.correctAnswer) === cAns));
    } else if (wordId) {
      list = list.filter(m => m.wordId !== wordId);
    } else if (cAns) {
      list = list.filter(m => clean(m.correctAnswer) !== cAns);
    }
    localStorage.setItem(STORAGE_KEYS.MISTAKES, JSON.stringify(list));
    try {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('mongol_app_mistakes_updated'));
        window.dispatchEvent(new CustomEvent('mongol_app_storage_updated'));
      }
    } catch (_) {}
  }

  static clearResolvedMistakes() {
    const list = this.getMistakes().filter(m => !m.resolved);
    localStorage.setItem(STORAGE_KEYS.MISTAKES, JSON.stringify(list));
  }

  // --- 学習履歴 ---
  static getHistory() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  static recordHistory(entry) {
    const list = this.getHistory();
    const item = {
      id: `h_${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...entry
    };
    list.unshift(item);
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(list));
    this.incrementTodayCount(entry.total);

    // クラウド同期
    SyncService.enqueueChange('RECORD_HISTORY', item);
    return item;
  }

  // --- 日別統計・連続学習日数（ストリーク） ---
  static getDailyStats() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DAILY_STATS);
      return data ? JSON.parse(data) : { streak: 1, lastStudyDate: new Date().toISOString().split('T')[0], todayCount: 0 };
    } catch (e) {
      return { streak: 1, lastStudyDate: new Date().toISOString().split('T')[0], todayCount: 0 };
    }
  }

  static incrementTodayCount(count = 1) {
    const stats = this.getDailyStats();
    const today = new Date().toISOString().split('T')[0];
    if (stats.lastStudyDate !== today) {
      stats.lastStudyDate = today;
      stats.todayCount = 0;
    }
    stats.todayCount += count;
    localStorage.setItem(STORAGE_KEYS.DAILY_STATS, JSON.stringify(stats));
  }

  static updateStreak() {
    const stats = this.getDailyStats();
    const today = new Date().toISOString().split('T')[0];
    const lastDate = stats.lastStudyDate;

    if (!lastDate) {
      stats.streak = 1;
      stats.lastStudyDate = today;
      stats.todayCount = 0;
    } else if (lastDate !== today) {
      const last = new Date(lastDate);
      const now = new Date(today);
      const diffDays = Math.round((now - last) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        stats.streak = (stats.streak || 0) + 1;
        stats.lastStudyDate = today;
        stats.todayCount = 0;
      } else if (diffDays > 1) {
        stats.streak = 1;
        stats.lastStudyDate = today;
        stats.todayCount = 0;
      }
    }
    localStorage.setItem(STORAGE_KEYS.DAILY_STATS, JSON.stringify(stats));
  }

  // --- 設定 ---
  static getSettings() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? JSON.parse(data) : { dailyGoal: 20, soundEffects: true };
    } catch (e) {
      return { dailyGoal: 20, soundEffects: true };
    }
  }

  static saveSettings(settings) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }

  // --- バックアップ（JSON） ---
  static exportAllDataJSON() {
    const payload = {
      version: "2.0",
      exportDate: new Date().toISOString(),
      vocabulary: this.getVocabulary(),
      wordProgress: this.getAllWordProgress(),
      grammar: this.getGrammar(),
      grammarQuizzes: this.getGrammarQuizzes(),
      declensionQuizzes: this.getDeclensionQuizzes(),
      mistakes: this.getMistakes(),
      lookedUpWords: this.getLookedUpWords(),
      listeningQuizzes: this.getListeningQuizzes(),
      readingQuizzes: this.getReadingQuizzes(),
      typingSentences: this.getTypingSentences(),
      customTypingSentences: this.getCustomTypingSentences(),
      history: this.getHistory(),
      settings: this.getSettings(),
      dailyStats: this.getDailyStats(),
      gameStats: this.getGameStats()
    };
    return JSON.stringify(payload, null, 2);
  }

  static importAllDataJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.vocabulary && Array.isArray(parsed.vocabulary)) {
        this.saveVocabulary(parsed.vocabulary);
      }
      if (parsed.wordProgress && typeof parsed.wordProgress === 'object') {
        localStorage.setItem(STORAGE_KEYS.WORD_PROGRESS, JSON.stringify(parsed.wordProgress));
      }
      if (parsed.grammar && Array.isArray(parsed.grammar)) {
        this.saveGrammar(parsed.grammar);
      }
      if (parsed.grammarQuizzes && Array.isArray(parsed.grammarQuizzes)) {
        this.saveGrammarQuizzes(parsed.grammarQuizzes);
      }
      if (parsed.declensionQuizzes && Array.isArray(parsed.declensionQuizzes)) {
        this.saveDeclensionQuizzes(parsed.declensionQuizzes);
      }
      if (parsed.mistakes && Array.isArray(parsed.mistakes)) {
        localStorage.setItem(STORAGE_KEYS.MISTAKES, JSON.stringify(parsed.mistakes));
      }
      if (parsed.lookedUpWords && Array.isArray(parsed.lookedUpWords)) {
        localStorage.setItem(STORAGE_KEYS.LOOKED_UP_WORDS, JSON.stringify(parsed.lookedUpWords));
      }
      if (parsed.listeningQuizzes && Array.isArray(parsed.listeningQuizzes)) {
        this.saveListeningQuizzes(parsed.listeningQuizzes);
      }
      if (parsed.readingQuizzes && Array.isArray(parsed.readingQuizzes)) {
        this.saveReadingQuizzes(parsed.readingQuizzes);
      }
      if (parsed.typingSentences && Array.isArray(parsed.typingSentences)) {
        this.saveTypingSentences(parsed.typingSentences);
      }
      if (parsed.customTypingSentences && Array.isArray(parsed.customTypingSentences)) {
        this.saveCustomTypingSentences(parsed.customTypingSentences);
      }
      if (parsed.history && Array.isArray(parsed.history)) {
        localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(parsed.history));
      }
      if (parsed.settings) {
        this.saveSettings(parsed.settings);
      }
      if (parsed.gameStats && typeof parsed.gameStats === 'object') {
        this.saveGameStats(parsed.gameStats);
      }
      SyncService.triggerSync();
      return { success: true, count: parsed.vocabulary?.length || 0 };
    } catch (err) {
      console.error('Import failed', err);
      return { success: false, error: err.message };
    }
  }

  // --- 単語ゲーム（Game Stats & Achievements） ---
  static getGameStats() {
    const defaultStats = {
      totalXp: 0,
      level: 1,
      currentTitle: 'モンゴル語初心者 🌱',
      totalScore: 0,
      totalCorrect: 0,
      totalWrong: 0,
      maxCombo: 0,
      unlockedTitles: ['モンゴル語初心者 🌱'],
      highScores: {
        speedrun: 0,
        survival: 0,
        combo: 0,
        relax: 0
      },
      bestCombos: {
        speedrun: 0,
        survival: 0,
        combo: 0,
        relax: 0
      },
      totalGamesPlayed: 0,
      totalAnswered: 0,
      unlockedAchievements: ['first_game'],
      gameHistory: []
    };
    try {
      const data = localStorage.getItem(STORAGE_KEYS.GAME_STATS);
      if (!data) return defaultStats;
      const parsed = JSON.parse(data);
      return {
        ...defaultStats,
        ...parsed,
        highScores: { ...defaultStats.highScores, ...(parsed.highScores || {}) },
        bestCombos: { ...defaultStats.bestCombos, ...(parsed.bestCombos || {}) },
        unlockedAchievements: Array.isArray(parsed.unlockedAchievements) ? parsed.unlockedAchievements : ['first_game']
      };
    } catch (_) {
      return defaultStats;
    }
  }

  static saveGameStats(stats) {
    try {
      localStorage.setItem(STORAGE_KEYS.GAME_STATS, JSON.stringify(stats));
      SyncService.triggerSync();
    } catch (e) {
      console.error('Failed to save game stats', e);
    }
  }

  static recordGameResult({ mode, score, maxCombo, correctCount, totalCount, xpEarned }) {
    const stats = this.getGameStats();
    stats.totalGamesPlayed = (stats.totalGamesPlayed || 0) + 1;
    stats.totalCorrect = (stats.totalCorrect || 0) + correctCount;
    stats.totalAnswered = (stats.totalAnswered || 0) + totalCount;
    stats.totalXp = (stats.totalXp || 0) + xpEarned;

    // 自己ベスト更新チェック
    const prevHighScore = stats.highScores[mode] || 0;
    const isNewHighScore = score > prevHighScore;
    if (isNewHighScore) {
      stats.highScores[mode] = score;
    }

    const prevBestCombo = stats.bestCombos[mode] || 0;
    const isNewBestCombo = maxCombo > prevBestCombo;
    if (isNewBestCombo) {
      stats.bestCombos[mode] = maxCombo;
    }

    // レベル計算
    const oldLevel = stats.level || 1;
    let newLevel = 1;
    let remainingXp = stats.totalXp;
    let xpForNext = 150;
    while (remainingXp >= xpForNext && newLevel < 99) {
      remainingXp -= xpForNext;
      newLevel++;
      xpForNext = Math.round(150 * Math.pow(1.15, newLevel - 1));
    }
    const leveledUp = newLevel > oldLevel;
    stats.level = newLevel;

    // 称号決定
    const TITLES = [
      { minLv: 50, title: '草原の覇者 👑' },
      { minLv: 40, title: '伝統の継承者 📜' },
      { minLv: 30, title: 'チンギスの伝令 🐎' },
      { minLv: 25, title: '大草原の語り部 🌾' },
      { minLv: 20, title: 'モンゴル通 🗺️' },
      { minLv: 15, title: 'ウランバートル散策者 🏙️' },
      { minLv: 10, title: '遊牧の旅人 ⛺' },
      { minLv: 5, title: 'ゲル見習い 🪵' },
      { minLv: 1, title: '草原の見習い 🌱' }
    ];
    const matchingTitle = TITLES.find(t => stats.level >= t.minLv) || TITLES[TITLES.length - 1];
    stats.currentTitle = matchingTitle.title;

    // 実績判定
    const newAchievements = [];
    const checkAchievement = (id) => {
      if (!stats.unlockedAchievements.includes(id)) {
        stats.unlockedAchievements.push(id);
        newAchievements.push(id);
      }
    };

    checkAchievement('first_game');
    if (mode === 'speedrun' && correctCount >= 15) checkAchievement('speed_runner');
    if (mode === 'survival' && correctCount >= 20) checkAchievement('survivor');
    if (maxCombo >= 10) checkAchievement('combo_master');
    if (maxCombo >= 25) checkAchievement('combo_god');
    if (totalCount >= 10 && correctCount === totalCount) checkAchievement('perfect_accuracy');
    if (stats.level >= 10) checkAchievement('level_10');
    if (stats.level >= 30) checkAchievement('level_30');
    if (stats.totalCorrect >= 100) checkAchievement('century');
    if (score >= 3000) checkAchievement('score_3000');

    // 履歴追加（最新15件）
    stats.gameHistory.unshift({
      date: new Date().toISOString(),
      mode,
      score,
      maxCombo,
      correctCount,
      totalCount,
      xpEarned,
      isNewHighScore
    });
    if (stats.gameHistory.length > 15) {
      stats.gameHistory = stats.gameHistory.slice(0, 15);
    }

    this.saveGameStats(stats);

    return {
      stats,
      isNewHighScore,
      isNewBestCombo,
      leveledUp,
      oldLevel,
      newLevel,
      newAchievements
    };
  }

  // --- 単語リストのCSV出力 ---
  static exportVocabularyCSV() {
    const list = this.getVocabulary();
    const headers = ["モンゴル語", "日本語", "発音", "語幹", "品詞", "カテゴリー", "習熟度", "復習間隔(日)", "次回復習日", "正答率(%)", "学習回数", "メモ"];
    const rows = list.map(v => [
      `"${(v.mongolian || '').replace(/"/g, '""')}"`,
      `"${(v.japanese || '').replace(/"/g, '""')}"`,
      `"${(v.pronunciation || '').replace(/"/g, '""')}"`,
      `"${(v.root || '').replace(/"/g, '""')}"`,
      `"${(v.pos || '').replace(/"/g, '""')}"`,
      `"${(v.category || '').replace(/"/g, '""')}"`,
      `"${v.srsLevel || 0}"`,
      `"${v.intervalDays || 0}"`,
      `"${v.nextReviewDate || ''}"`,
      `"${v.accuracy || 0}"`,
      `"${v.studyCount || 0}"`,
      `"${(v.note || '').replace(/"/g, '""')}"`
    ]);
    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }


  // =========================================================================
  // 単語ファミリー完全習得・活用形マスター機能 (Word Family Mastery System)
  // =========================================================================

  /**
   * 単語ファミリーの進捗データ（各語形の学習回数・正解数・完全習得状態）を取得
   */
  static getWordFamilyProgress() {
    try {
      const data = localStorage.getItem('mongol_app_word_family_progress_v1');
      return data ? JSON.parse(data) : {};
    } catch (_) {
      return {};
    }
  }

  static saveWordFamilyProgress(progress) {
    this.setItem('mongol_app_word_family_progress_v1', progress || {});
  }

  /**
   * 単語ファミリー全体を一括追加したID一覧を取得
   */
  static getAddedFamilyIds() {
    try {
      const data = localStorage.getItem('mongol_app_added_family_ids_v1');
      return data ? JSON.parse(data) : [];
    } catch (_) {
      return [];
    }
  }

  /**
   * 個別に学習対象へ追加した語形ID一覧を取得
   */
  static getAddedFamilyFormIds() {
    try {
      const data = localStorage.getItem('mongol_app_added_family_form_ids_v1');
      return data ? JSON.parse(data) : [];
    } catch (_) {
      return [];
    }
  }

  static addFamilyToLearning(familyId) {
    if (!familyId) return false;
    const list = this.getAddedFamilyIds();
    if (!list.includes(familyId)) {
      list.push(familyId);
      this.setItem('mongol_app_added_family_ids_v1', list);
      return true;
    }
    return false;
  }

  static removeFamilyFromLearning(familyId) {
    if (!familyId) return false;
    let list = this.getAddedFamilyIds();
    if (list.includes(familyId)) {
      list = list.filter(id => id !== familyId);
      this.setItem('mongol_app_added_family_ids_v1', list);
      return true;
    }
    return false;
  }

  static isFamilyAdded(familyId) {
    const list = this.getAddedFamilyIds();
    return list.includes(familyId);
  }

  static addFormToLearning(formId) {
    if (!formId) return false;
    const list = this.getAddedFamilyFormIds();
    if (!list.includes(formId)) {
      list.push(formId);
      this.setItem('mongol_app_added_family_form_ids_v1', list);
      return true;
    }
    return false;
  }

  static removeFormFromLearning(formId) {
    if (!formId) return false;
    let list = this.getAddedFamilyFormIds();
    if (list.includes(formId)) {
      list = list.filter(id => id !== formId);
      this.setItem('mongol_app_added_family_form_ids_v1', list);
      return true;
    }
    return false;
  }

  static isFormAdded(formId) {
    const list = this.getAddedFamilyFormIds();
    return list.includes(formId);
  }

  /**
   * 単語ファミリーテストの回答結果を記録し、習熟度を更新
   */
  static recordFamilyQuizResult(familyId, formId, isCorrect) {
    if (!formId) return;
    const progress = this.getWordFamilyProgress();
    const cur = progress[formId] || {
      studyCount: 0,
      correctCount: 0,
      wrongCount: 0,
      accuracy: 0,
      mastered: false,
      lastLearnedAt: null
    };

    cur.studyCount = (cur.studyCount || 0) + 1;
    if (isCorrect) {
      cur.correctCount = (cur.correctCount || 0) + 1;
    } else {
      cur.wrongCount = (cur.wrongCount || 0) + 1;
    }
    cur.accuracy = Math.round((cur.correctCount / cur.studyCount) * 100);
    cur.lastLearnedAt = new Date().toISOString();

    // 習得基準: 2回以上正解 かつ 正解率80%以上
    cur.mastered = (cur.correctCount >= 2 && cur.accuracy >= 80);

    progress[formId] = cur;
    this.saveWordFamilyProgress(progress);
    return cur;
  }

  /**
   * 特定ファミリーの完全習得ステータスと各語形進捗を計算
   */
  static getFamilyMasteryStatus(familyId) {
    const family = (typeof WORD_FAMILIES_DATA !== 'undefined' ? WORD_FAMILIES_DATA : []).find(f => f.familyId === familyId);
    if (!family) return { mastered: false, progressPercent: 0, masteredCount: 0, totalCount: 0 };

    const progress = this.getWordFamilyProgress();
    const coreForms = family.forms.filter(f => f.isCore !== false);
    const totalCore = coreForms.length;
    let masteredCore = 0;

    family.forms.forEach(form => {
      const p = progress[form.formId];
      if (p && p.mastered && form.isCore !== false) {
        masteredCore += 1;
      }
    });

    const isMastered = totalCore > 0 && masteredCore === totalCore;
    const progressPercent = totalCore > 0 ? Math.round((masteredCore / totalCore) * 100) : 0;

    return {
      mastered: isMastered,
      progressPercent,
      masteredCount: masteredCore,
      totalCount: totalCore
    };
  }

  /**
   * 全単語ファミリー（習熟度と追加状態をマージした完全オブジェクト）を取得
   */
  static getAllWordFamilies() {
    const rawFamilies = (typeof WORD_FAMILIES_DATA !== 'undefined' ? WORD_FAMILIES_DATA : []);
    const progress = this.getWordFamilyProgress();
    const addedFamilyIds = this.getAddedFamilyIds();
    const addedFormIds = this.getAddedFamilyFormIds();

    return rawFamilies.map(fam => {
      const mastery = this.getFamilyMasteryStatus(fam.familyId);
      const isFamilyAdded = addedFamilyIds.includes(fam.familyId);

      const enrichedForms = fam.forms.map(form => {
        const formProg = progress[form.formId] || {
          studyCount: 0,
          correctCount: 0,
          wrongCount: 0,
          accuracy: 0,
          mastered: false,
          lastLearnedAt: null
        };
        const isFormAdded = addedFormIds.includes(form.formId) || isFamilyAdded;

        return {
          ...form,
          progress: formProg,
          isAdded: isFormAdded
        };
      });

      return {
        ...fam,
        mastered: mastery.mastered,
        masteryPercent: mastery.progressPercent,
        masteredCoreCount: mastery.masteredCount,
        totalCoreCount: mastery.totalCount,
        isAdded: isFamilyAdded,
        forms: enrichedForms
      };
    });
  }

  /**
   * 単語ファミリー全体の集計サマリー（ダッシュボード用）を取得
   */
  static getWordFamilySummary() {
    const families = this.getAllWordFamilies();
    const totalFamilies = families.length;
    const masteredFamilies = families.filter(f => f.mastered).length;

    let totalForms = 0;
    let masteredForms = 0;
    let studiedForms = 0;

    families.forEach(f => {
      f.forms.forEach(form => {
        totalForms += 1;
        if (form.progress && form.progress.mastered) masteredForms += 1;
        if (form.progress && form.progress.studyCount > 0) studiedForms += 1;
      });
    });

    return {
      totalFamilies,
      masteredFamilies,
      totalForms,
      masteredForms,
      studiedForms,
      overallMasteryPercent: totalForms > 0 ? Math.round((masteredForms / totalForms) * 100) : 0
    };
  }

  // --- 汎用 Key-Value ストレージアクセサ (JSON対応 & 安全フォールバック) ---
  static getItem(key, defaultValue = null) {
    try {
      if (typeof localStorage === 'undefined') return defaultValue;
      const data = localStorage.getItem(key);
      if (data === null || data === undefined) return defaultValue;
      try {
        return JSON.parse(data);
      } catch (_) {
        return data;
      }
    } catch (_) {
      return defaultValue;
    }
  }

  static setItem(key, value) {
    try {
      if (typeof localStorage === 'undefined') return;
      const valStr = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, valStr);
      // 学習データの更新をSupabase常時同期サービスへ通知
      if (typeof SyncService !== 'undefined' && SyncService.notifyDataChanged) {
        if (key.includes('mistakes') || key.includes('progress') || key.includes('game_stats') || key.includes('mascot') || key.includes('daily_stats')) {
          SyncService.notifyDataChanged();
        }
      }
    } catch (_) {}
  }
}

if (typeof window !== 'undefined') {
  window.StorageService = StorageService;
}
