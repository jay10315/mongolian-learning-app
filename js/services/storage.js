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

const STORAGE_KEYS = {
  VOCABULARY: 'mongol_app_vocabulary_v8',
  WORD_PROGRESS: 'mongol_app_word_progress_v1',
  GRAMMAR: 'mongol_app_grammar_v4',
  GRAMMAR_QUIZZES: 'mongol_app_grammar_quizzes_v4',
  DECLENSION_QUIZZES: 'mongol_app_declension_quizzes_v4',
  ILLUSTRATION_QUIZZES: 'mongol_app_illustration_quizzes_v1',
  LISTENING_QUIZZES: 'mongol_app_listening_quizzes_v1',
  READING_QUIZZES: 'mongol_app_reading_quizzes_v1',
  TYPING_SENTENCES: 'mongol_app_typing_sentences_v1',
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
      const storedVocab = localStorage.getItem(STORAGE_KEYS.VOCABULARY);
      // 古いバージョンのキーがあれば削除して最新化
      ['mongol_app_vocabulary_v1', 'mongol_app_vocabulary_v2', 'mongol_app_vocabulary_v3', 'mongol_app_vocabulary_v4', 'mongol_app_vocabulary_v5', 'mongol_app_vocabulary_v6', 'mongol_app_vocabulary_v7'].forEach(k => {
        try { localStorage.removeItem(k); } catch (_) {}
      });

      if (!storedVocab || storedVocab.includes('Боolгүй') || /第\d+課|JICA|（モンゴル語教科書語彙）/.test(storedVocab) || (storedVocab.includes('"v_2_21"') && storedVocab.includes('"mongolian":"байх"')) || (storedVocab.includes('"v_2_21"') && storedVocab.includes('"dictForm":"байх"')) || JSON.parse(storedVocab).length < initialVocabulary.length) {
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
      if (!storedQuizzes || JSON.parse(storedQuizzes).length < initialGrammarQuizzes.length) {
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

    if (!localStorage.getItem(STORAGE_KEYS.DECLENSION_QUIZZES)) {
      this.saveDeclensionQuizzes(initialDeclensionQuizzes);
    }
    if (!localStorage.getItem(STORAGE_KEYS.WORD_PROGRESS)) {
      localStorage.setItem(STORAGE_KEYS.WORD_PROGRESS, JSON.stringify({}));
    }
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

              if (matched) {
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
    return this.saveWordProgress(updated);
  }

  // --- 単語マスターデータ（SRS進捗をマージして提供） ---

  static getVocabulary() {
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

    const progressMap = this.getAllWordProgress();

    // initialVocabulary の最新解説・成り立ち・格支配情報を常にマージ
    const initMap = {};
    if (typeof initialVocabulary !== 'undefined' && Array.isArray(initialVocabulary)) {
      for (const iv of initialVocabulary) {
        if (iv.id) initMap[iv.id] = iv;
      }
    }

    // 各単語に現在のSRS進捗と保持率メタデータを付与
    return baseList.map(item => {
      const freshMeta = initMap[item.id] || {};
      const mergedItem = { ...item, ...freshMeta };
      const prog = progressMap[item.id] || { srsLevel: 0, intervalDays: 0, studyCount: 0, correctCount: 0, wrongCount: 0, accuracy: 0 };
      const retentionData = SrsService.calculateRetention(prog);
      const masteryMeta = SrsService.getMasteryMeta(prog.srsLevel);

      return {
        ...mergedItem,
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
   * 今日の忘却曲線復習予定の単語リスト（復習期日が到来している単語）
   */
  static getDueReviewWords() {
    return this.getVocabulary().filter(v => v.srsLevel > 0 && v.isDue);
  }

  /**
   * 忘却リスクが高い単語リスト（保持率40%未満 / 忘却リスク60%以上）
   */
  static getHighRiskWords() {
    return this.getVocabulary().filter(v => v.srsLevel > 0 && v.forgettingRisk >= 60);
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
    try {
      const data = localStorage.getItem(STORAGE_KEYS.GRAMMAR_QUIZZES);
      return data ? JSON.parse(data) : initialGrammarQuizzes;
    } catch (e) {
      return initialGrammarQuizzes;
    }
  }

  static saveGrammarQuizzes(items) {
    localStorage.setItem(STORAGE_KEYS.GRAMMAR_QUIZZES, JSON.stringify(items));
  }

  static getDeclensionQuizzes() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DECLENSION_QUIZZES);
      const parsed = data ? JSON.parse(data) : null;
      if (parsed && Array.isArray(parsed) && parsed.length >= initialDeclensionQuizzes.length) {
        return parsed;
      }
      this.saveDeclensionQuizzes(initialDeclensionQuizzes);
      return initialDeclensionQuizzes;
    } catch (e) {
      return initialDeclensionQuizzes;
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
  static getMistakes() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MISTAKES);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  static recordMistake(mistake) {
    const list = this.getMistakes();
    const existingIdx = list.findIndex(m => m.question === mistake.question && m.correctAnswer === mistake.correctAnswer);
    let itemToSync = null;

    if (existingIdx !== -1) {
      list[existingIdx].wrongCount = (list[existingIdx].wrongCount || 1) + 1;
      list[existingIdx].lastWrongDate = new Date().toISOString();
      list[existingIdx].userAnswer = mistake.userAnswer;
      list[existingIdx].resolved = false;
      itemToSync = list[existingIdx];
    } else {
      itemToSync = {
        id: `m_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        ...mistake,
        wrongCount: 1,
        lastWrongDate: new Date().toISOString(),
        resolved: false
      };
      list.unshift(itemToSync);
    }
    localStorage.setItem(STORAGE_KEYS.MISTAKES, JSON.stringify(list));

    // クラウドキュー送信
    SyncService.enqueueChange('RECORD_MISTAKE', itemToSync);
    return itemToSync;
  }

  static markMistakeResolved(id, isResolved = true) {
    const list = this.getMistakes();
    const idx = list.findIndex(m => m.id === id);
    if (idx !== -1) {
      list[idx].resolved = isResolved;
      localStorage.setItem(STORAGE_KEYS.MISTAKES, JSON.stringify(list));
      SyncService.enqueueChange('RECORD_MISTAKE', list[idx]);
    }
  }

  static removeMistake(id) {
    const list = this.getMistakes().filter(m => m.id !== id);
    localStorage.setItem(STORAGE_KEYS.MISTAKES, JSON.stringify(list));
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
    } catch (_) {}
  }
}

if (typeof window !== 'undefined') {
  window.StorageService = StorageService;
}
