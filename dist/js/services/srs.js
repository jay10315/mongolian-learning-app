// 間隔反復学習（Spaced Repetition System / 忘却曲線）エンジン
// SuperMemo SM-2 および FSRS (Free Spaced Repetition Scheduler) の原理に基づく実装

export class SrsService {
  // 復習間隔テーブル（日数）: レベル0(未学習)〜レベル8+(完全習得)
  static INTERVALS = [0, 1, 3, 7, 14, 30, 60, 90, 180];

  // 習熟度ラベル定義
  static MASTERY_LEVELS = [
    { level: 0, label: '未学習', color: 'slate', badge: 'bg-slate-100 text-slate-600 border-slate-200' },
    { level: 1, label: '初見 (Lv.1)', color: 'amber', badge: 'bg-amber-50 text-amber-700 border-amber-200' },
    { level: 2, label: '基礎定着 (Lv.2)', color: 'amber', badge: 'bg-amber-100 text-amber-800 border-amber-300' },
    { level: 3, label: '定着中 (Lv.3)', color: 'sky', badge: 'bg-sky-50 text-sky-700 border-sky-200' },
    { level: 4, label: '記憶安定 (Lv.4)', color: 'sky', badge: 'bg-sky-100 text-sky-800 border-sky-300' },
    { level: 5, label: '長期記憶 (Lv.5)', color: 'emerald', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { level: 6, label: '習得済 (Lv.6)', color: 'emerald', badge: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    { level: 7, label: 'マスター (Lv.7)', color: 'purple', badge: 'bg-purple-100 text-purple-800 border-purple-300' }
  ];

  /**
   * 単語のSRS進捗データを初期化または正規化
   */
  static normalizeProgress(prog = {}, wordId = '') {
    return {
      wordId: prog.wordId || wordId,
      srsLevel: typeof prog.srsLevel === 'number' ? prog.srsLevel : 0,
      intervalDays: typeof prog.intervalDays === 'number' ? prog.intervalDays : 0,
      nextReviewDate: prog.nextReviewDate || null, // 'YYYY-MM-DD'
      lastLearnedAt: prog.lastLearnedAt || null,   // ISO string
      studyCount: prog.studyCount || 0,
      correctCount: prog.correctCount || 0,
      wrongCount: prog.wrongCount || 0,
      accuracy: typeof prog.accuracy === 'number' ? prog.accuracy : 0,
      updatedAt: prog.updatedAt || new Date().toISOString()
    };
  }

  /**
   * 今日の日付文字列 (YYYY-MM-DD)
   */
  static getTodayString() {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * 日付に日数を加算した YYYY-MM-DD 文字列を取得
   */
  static addDays(dateStr, days) {
    const base = dateStr ? new Date(dateStr) : new Date();
    base.setDate(base.getDate() + days);
    const year = base.getFullYear();
    const month = String(base.getMonth() + 1).padStart(2, '0');
    const day = String(base.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * 忘却リスク（0%〜100%）および記憶保持率（0%〜100%）を計算
   * エビングハウスの忘却曲線近似式: R = e^(-t / S)
   */
  static calculateRetention(prog) {
    if (!prog || !prog.lastLearnedAt || prog.srsLevel === 0) {
      return { retention: 0, forgettingRisk: 100, isDue: true };
    }

    const last = new Date(prog.lastLearnedAt).getTime();
    const now = Date.now();
    const diffDays = Math.max(0, (now - last) / (1000 * 60 * 60 * 24));
    const interval = Math.max(1, prog.intervalDays || 1);

    // 安定度 S に基づく保持率 R
    const r = Math.exp(-diffDays / (interval * 1.15));
    const retention = Math.max(0, Math.min(100, Math.round(r * 100)));
    const forgettingRisk = Math.max(0, Math.min(100, 100 - retention));

    const today = this.getTodayString();
    const isDue = Boolean(prog.nextReviewDate && prog.nextReviewDate <= today);

    return { retention, forgettingRisk, isDue, diffDays: Math.round(diffDays) };
  }

  /**
   * 解答結果に基づいてSRS進捗を更新
   * @param {Object} currentProg 既存の進捗データ
   * @param {boolean} isCorrect 正解したかどうか
   * @param {string} difficulty 'easy' | 'good' | 'hard' (デフォルト: good)
   */
  static processAnswer(currentProg, isCorrect, difficulty = 'good') {
    const prog = this.normalizeProgress(currentProg);
    const today = this.getTodayString();
    const nowIso = new Date().toISOString();

    prog.studyCount += 1;
    prog.lastLearnedAt = nowIso;
    prog.updatedAt = nowIso;

    if (isCorrect) {
      prog.correctCount += 1;

      // 初回学習
      if (prog.srsLevel === 0) {
        prog.srsLevel = 1;
        prog.intervalDays = 1;
      } else {
        // レベル上昇
        prog.srsLevel = Math.min(8, prog.srsLevel + 1);

        // 間隔計算
        let multiplier = 2.1;
        if (difficulty === 'easy') multiplier = 2.6;
        if (difficulty === 'hard') multiplier = 1.4;

        if (prog.srsLevel < this.INTERVALS.length) {
          prog.intervalDays = this.INTERVALS[prog.srsLevel];
        } else {
          prog.intervalDays = Math.round((prog.intervalDays || 60) * multiplier);
        }
      }

      prog.nextReviewDate = this.addDays(today, prog.intervalDays);
    } else {
      // 不正解の場合
      prog.wrongCount += 1;
      // レベル低下（これまでの学習歴を全滅させず半分に戻す）
      prog.srsLevel = Math.max(1, Math.floor(prog.srsLevel / 2));
      prog.intervalDays = 1; // 明日または直後に即時再復習
      prog.nextReviewDate = today; // 今日〜明日の復習対象
    }

    const total = prog.correctCount + prog.wrongCount;
    prog.accuracy = total > 0 ? Math.round((prog.correctCount / total) * 100) : 0;

    return prog;
  }

  /**
   * 習熟度メタデータを取得
   */
  static getMasteryMeta(srsLevel = 0) {
    const idx = Math.min(this.MASTERY_LEVELS.length - 1, Math.max(0, srsLevel));
    return this.MASTERY_LEVELS[idx];
  }

  /**
   * 復習予定単語の判定
   */
  static isDueForReview(prog) {
    if (!prog || prog.srsLevel === 0) return false;
    const today = this.getTodayString();
    return Boolean(prog.nextReviewDate && prog.nextReviewDate <= today);
  }

  /**
   * 高忘却リスク単語の判定（忘却リスク >= 60%）
   */
  static isHighRisk(prog) {
    if (!prog || prog.srsLevel === 0) return false;
    const stat = this.calculateRetention(prog);
    return stat.forgettingRisk >= 60;
  }
}
