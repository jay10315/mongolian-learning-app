// サイト共通 ゲーミフィケーション・パートナーシステム
// 全テスト（単語・日本語訳・文法・格変化・単語ゲーム）の進捗・レベル・スコア・Оцон шувууを一元管理

import { StorageService } from './storage.js';
import { PenguinMascot } from '../components/PenguinMascot.js';
import { SoundEffects } from '../utils/helpers.js';

export const TITLES_LIST = [
  { minLevel: 50, title: '草原の覇者 🐎', desc: 'モンゴル語の頂点を極めた真の覇者' },
  { minLevel: 40, title: '伝統の継承者 📜', desc: '深い言語知識と文化を身につけた賢者' },
  { minLevel: 30, title: 'モンゴル語マスター 👑', desc: '日常会話から専門表現まで自在に操る達人' },
  { minLevel: 25, title: '大草原の語り部 🌾', desc: '豊かな語彙と文法で物語を紡ぐ者' },
  { minLevel: 20, title: 'ウランバートル散策者 🏙️', desc: '現地でも堂々とコミュニケーションできる実力者' },
  { minLevel: 15, title: 'モンゴル語チャレンジャー ⚡', desc: '難問も恐れず挑み続ける挑戦者' },
  { minLevel: 10, title: '文法探検家 🧭', desc: '複雑な文法規則を解き明かした探求者' },
  { minLevel: 5,  title: '単語ハンター 🏹', desc: '数多くの基礎単語を射止めた学習者' },
  { minLevel: 1,  title: 'モンゴル語初心者 🌱', desc: '大草原への第一歩を踏み出した学習者' }
];

export class GamificationService {
  // セッション中のリアルタイムコンボ追跡
  static sessionCombo = 0;
  static sessionMaxCombo = 0;

  /**
   * 共通プロフィールの取得
   */
  static getProfile() {
    const stats = StorageService.getGameStats();
    const totalCorrect = stats.totalCorrect || 0;
    const totalWrong = stats.totalWrong || 0;
    const totalAnswered = totalCorrect + totalWrong;
    const overallAccuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

    const level = stats.level || 1;
    const currentTitle = this.getTitleForLevel(level);

    return {
      totalXp: stats.totalXp || 0,
      level: level,
      currentTitle: stats.currentTitle || currentTitle.title,
      totalScore: stats.totalScore || 0,
      totalCorrect: totalCorrect,
      totalWrong: totalWrong,
      totalAnswered: totalAnswered,
      overallAccuracy: overallAccuracy,
      maxCombo: stats.maxCombo || 0,
      unlockedTitles: stats.unlockedTitles || [TITLES_LIST[TITLES_LIST.length - 1].title],
      history: stats.gameHistory || []
    };
  }

  /**
   * レベルに応じた称号情報を取得
   */
  static getTitleForLevel(level) {
    return TITLES_LIST.find(t => level >= t.minLevel) || TITLES_LIST[TITLES_LIST.length - 1];
  }

  /**
   * XPからレベル・次のレベルまでの必要XP進捗を算出
   */
  static getXpProgress(totalXp) {
    let level = 1;
    let accumulatedXp = 0;
    let xpForNext = 150;

    while (totalXp >= accumulatedXp + xpForNext && level < 99) {
      accumulatedXp += xpForNext;
      level++;
      xpForNext = Math.round(150 * Math.pow(1.15, level - 1));
    }

    const currentLevelXp = Math.max(0, totalXp - accumulatedXp);
    const percent = Math.min(100, Math.round((currentLevelXp / xpForNext) * 100));

    return {
      level,
      currentLevelXp,
      xpForNext,
      remainingXp: Math.max(0, xpForNext - currentLevelXp),
      percent
    };
  }

  /**
   * テスト開始時にセッションコンボをリセット
   */
  static resetSessionCombo() {
    this.sessionCombo = 0;
    this.sessionMaxCombo = 0;
  }

  /**
   * 1問回答時の共通ゲーム判定（コンボ加算・獲得スコア/XP計算・ペンギンリアクション）
   */
  static recordAnswer({ isCorrect, testType = 'test' }) {
    if (isCorrect) {
      this.sessionCombo++;
      if (this.sessionCombo > this.sessionMaxCombo) {
        this.sessionMaxCombo = this.sessionCombo;
      }
    } else {
      this.sessionCombo = 0;
    }

    // コンボ倍率（1.0x 〜 最大3.0x）
    let multiplier = 1.0;
    if (this.sessionCombo >= 20) multiplier = 3.0;
    else if (this.sessionCombo >= 15) multiplier = 2.5;
    else if (this.sessionCombo >= 10) multiplier = 2.0;
    else if (this.sessionCombo >= 5) multiplier = 1.5;
    else if (this.sessionCombo >= 3) multiplier = 1.2;

    const scoreGained = isCorrect ? Math.round(100 * multiplier) : 0;
    const xpGained = isCorrect ? Math.round(20 * multiplier) : 0;

    // ペンギンの表情とコメント
    let mood = 'idle';
    let comment = '';

    if (isCorrect) {
      if (this.sessionCombo >= 3) {
        mood = 'combo';
        comment = PenguinMascot.getComment('combo', { combo: this.sessionCombo });
      } else {
        mood = 'happy';
        comment = PenguinMascot.getComment('correct');
      }
    } else {
      mood = 'wrong';
      comment = PenguinMascot.getComment('wrong');
    }

    return {
      isCorrect,
      currentCombo: this.sessionCombo,
      maxCombo: this.sessionMaxCombo,
      multiplier,
      scoreGained,
      xpGained,
      mood,
      comment
    };
  }

  /**
   * テストセッション終了時の集計・プロフィール更新・レベルアップ判定
   */
  static finishSession({
    testType,
    testTitle = 'テスト',
    correctCount = 0,
    wrongCount = 0,
    sessionScore = 0,
    sessionXp = 0
  }) {
    const stats = StorageService.getGameStats();
    const oldLevel = stats.level || 1;
    const oldTotalXp = stats.totalXp || 0;

    // スコア＆XPの加算
    const newTotalXp = oldTotalXp + sessionXp;
    stats.totalXp = newTotalXp;
    stats.totalScore = (stats.totalScore || 0) + sessionScore;
    stats.totalCorrect = (stats.totalCorrect || 0) + correctCount;
    stats.totalWrong = (stats.totalWrong || 0) + wrongCount;
    stats.maxCombo = Math.max(stats.maxCombo || 0, this.sessionMaxCombo);

    // 新レベル計算
    const progress = this.getXpProgress(newTotalXp);
    const newLevel = progress.level;
    const leveledUp = newLevel > oldLevel;
    stats.level = newLevel;

    // ペンギン進化チェック
    const oldStage = PenguinMascot.getStageForLevel(oldLevel);
    const newStage = PenguinMascot.getStageForLevel(newLevel);
    const evolved = leveledUp && (newStage.stage !== oldStage.stage);

    // 新称号チェック
    const currentTitleInfo = this.getTitleForLevel(newLevel);
    stats.currentTitle = currentTitleInfo.title;

    if (!stats.unlockedTitles) {
      stats.unlockedTitles = [TITLES_LIST[TITLES_LIST.length - 1].title];
    }

    let newTitleUnlocked = null;
    if (!stats.unlockedTitles.includes(currentTitleInfo.title)) {
      stats.unlockedTitles.push(currentTitleInfo.title);
      newTitleUnlocked = currentTitleInfo.title;
    }

    // 学習履歴の保存
    if (!stats.gameHistory) stats.gameHistory = [];
    stats.gameHistory.unshift({
      date: new Date().toISOString(),
      testType,
      testTitle,
      correctCount,
      wrongCount,
      score: sessionScore,
      xp: sessionXp,
      maxCombo: this.sessionMaxCombo
    });
    if (stats.gameHistory.length > 25) {
      stats.gameHistory = stats.gameHistory.slice(0, 25);
    }

    StorageService.saveGameStats(stats);

    // リザルト用ペンギンコメントの決定
    const totalQ = correctCount + wrongCount;
    const percent = totalQ > 0 ? Math.round((correctCount / totalQ) * 100) : 0;

    let mascotComment = '';
    let mascotMood = 'happy';

    if (evolved) {
      mascotMood = 'celebrate';
      mascotComment = PenguinMascot.getComment('evolution', { stageName: newStage.name });
    } else if (leveledUp) {
      mascotMood = 'celebrate';
      mascotComment = PenguinMascot.getComment('levelup', { level: newLevel });
    } else if (newTitleUnlocked) {
      mascotMood = 'celebrate';
      mascotComment = PenguinMascot.getComment('title', { title: newTitleUnlocked });
    } else if (percent === 100) {
      mascotMood = 'happy';
      mascotComment = PenguinMascot.getComment('result_perfect');
    } else if (percent >= 70) {
      mascotMood = 'happy';
      mascotComment = PenguinMascot.getComment('result_high');
    } else {
      mascotMood = 'wrong';
      mascotComment = PenguinMascot.getComment('result_encourage');
    }

    return {
      oldLevel,
      newLevel,
      leveledUp,
      evolved,
      oldStage,
      newStage,
      newTitleUnlocked,
      currentTitle: stats.currentTitle,
      totalXp: newTotalXp,
      xpProgress: progress,
      mascotMood,
      mascotComment,
      maxCombo: this.sessionMaxCombo
    };
  }

  /**
   * 全テスト結果画面で利用可能な共通ゲームリザルトUI（HTML）を生成
   */
  static renderGameResultCard({
    testTitle,
    correctCount,
    wrongCount,
    scoreEarned,
    xpEarned,
    maxCombo,
    sessionResult
  }) {
    const total = correctCount + wrongCount;
    const percent = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    const xpProg = sessionResult.xpProgress || this.getXpProgress(sessionResult.totalXp);

    return `
      <!-- ゲームリザルト＆Оцон шувууカード -->
      <div class="bg-gradient-to-br from-white via-sky-50/40 to-emerald-50/40 rounded-3xl p-5 sm:p-6 border border-sky-200/90 shadow-sm space-y-4 animate-fade-in">
        
        <!-- Оцон шувууの激励コメント -->
        <div class="flex items-center gap-3.5 p-3.5 bg-white/95 rounded-2xl border border-sky-100 shadow-2xs">
          <div class="shrink-0 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform" id="btn-result-penguin-room" title="ペンギンのお部屋を開く">
            ${PenguinMascot.getSvg({ mood: sessionResult.mascotMood, level: sessionResult.newLevel, size: 68 })}
          </div>
          <div class="flex-1">
            <div class="flex items-center flex-wrap gap-1.5 mb-1">
              <span class="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
                🐧 ${PenguinMascot.getStageForLevel(sessionResult.newLevel).name}
              </span>
              ${sessionResult.evolved ? `
                <span class="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 animate-bounce shadow-2xs">
                  ✨ ペンギン進化！
                </span>
              ` : (sessionResult.leveledUp ? `
                <span class="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-400 text-slate-900 animate-bounce">
                  🎉 LEVEL UP!
                </span>
              ` : '')}
              ${sessionResult.newTitleUnlocked ? `
                <span class="text-[10px] font-black px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                  👑 新称号獲得!
                </span>
              ` : ''}
            </div>
            <div class="text-xs sm:text-sm font-bold text-slate-800 leading-snug">
              ${sessionResult.mascotComment}
            </div>
          </div>
        </div>

        <!-- 今回の獲得スコア ＆ 獲得XP -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
          <div class="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
            <div class="text-[11px] text-slate-400 font-bold">獲得スコア</div>
            <div class="text-lg sm:text-xl font-black text-amber-600 mt-0.5">
              +${scoreEarned.toLocaleString()} <span class="text-xs font-normal text-slate-400">PTS</span>
            </div>
          </div>

          <div class="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
            <div class="text-[11px] text-slate-400 font-bold">獲得XP</div>
            <div class="text-lg sm:text-xl font-black text-emerald-600 mt-0.5">
              +${xpEarned.toLocaleString()} <span class="text-xs font-normal text-slate-400">XP</span>
            </div>
          </div>

          <div class="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
            <div class="text-[11px] text-slate-400 font-bold">正解 / 不正解</div>
            <div class="text-lg sm:text-xl font-black text-slate-800 mt-0.5">
              <span class="text-emerald-600">${correctCount}</span> / <span class="text-rose-500">${wrongCount}</span>
            </div>
          </div>

          <div class="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
            <div class="text-[11px] text-slate-400 font-bold">最大コンボ</div>
            <div class="text-lg sm:text-xl font-black text-orange-600 mt-0.5">
              ${maxCombo} <span class="text-xs font-normal text-slate-400">連続</span>
            </div>
          </div>
        </div>

        <!-- 累計レベル・XPバー・称号 -->
        <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div class="flex items-center justify-between text-xs">
            <div class="flex items-center gap-2">
              <span class="w-7 h-7 rounded-lg bg-emerald-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                Lv.${xpProg.level}
              </span>
              <span class="font-black text-slate-800">${sessionResult.currentTitle}</span>
            </div>
            <div class="font-bold text-slate-500">
              XP: ${sessionResult.totalXp.toLocaleString()} (${xpProg.percent}%)
            </div>
          </div>

          <!-- XPプログレスバー -->
          <div class="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden p-0.5">
            <div class="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-700" style="width: ${xpProg.percent}%"></div>
          </div>
          <div class="flex justify-between text-[10px] text-slate-400 font-medium">
            <span>現在のレベル XP: ${xpProg.currentLevelXp}</span>
            <span>次のレベルまで: ${xpProg.remainingXp} XP</span>
          </div>
        </div>

      </div>
    `;
  }

  /**
   * レベルアップ・新称号の祝福モーダル演出
   */
  static showCelebrationModal({ newLevel, title, evolved, oldStage, newStage, onContinue }) {
    if (evolved && newStage) {
      PenguinMascot.showEvolutionModal({
        oldStage,
        newStage,
        newLevel,
        onContinue
      });
      return;
    }

    SoundEffects.playLevelUp();

    const modal = document.createElement('div');
    modal.className = "fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in";
    modal.innerHTML = `
      <div class="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl space-y-4 animate-scale-up border-2 border-amber-400 relative overflow-hidden">
        
        <!-- 背景の光彩 -->
        <div class="absolute -top-12 -left-12 w-36 h-36 bg-amber-300/30 rounded-full blur-xl pointer-events-none"></div>
        <div class="absolute -bottom-12 -right-12 w-36 h-36 bg-emerald-300/30 rounded-full blur-xl pointer-events-none"></div>

        <div class="mx-auto flex justify-center pt-2">
          ${PenguinMascot.getSvg('celebrate', 90)}
        </div>

        <div class="space-y-1">
          <div class="text-xs font-black tracking-widest uppercase text-amber-600">LEVEL UP & TITLE UNLOCKED</div>
          <h3 class="text-2xl font-black text-slate-900">レベル ${newLevel} 到達！</h3>
          <p class="text-sm font-extrabold text-emerald-700 mt-0.5">${title}</p>
        </div>

        <div class="bg-amber-50 rounded-2xl p-3.5 border border-amber-200 text-xs text-amber-900 font-bold leading-relaxed">
          🐧 <span class="cyrillic-text font-black">Оцон шувуу</span>：「やったね！モンゴル語がどんどん上達してるよ！この調子で草原の覇者を目指そう！」
        </div>

        <button type="button" id="btn-close-celebration" class="w-full py-3.5 bg-gradient-to-r from-amber-500 via-emerald-600 to-teal-600 hover:from-amber-600 hover:to-teal-700 text-white font-black text-sm rounded-xl shadow-md transition-all active:scale-98">
          次へ進む！
        </button>
      </div>
    `;

    document.body.appendChild(modal);

    const close = () => {
      modal.remove();
      if (onContinue) onContinue();
    };

    modal.querySelector('#btn-close-celebration').addEventListener('click', close);
  }
}
