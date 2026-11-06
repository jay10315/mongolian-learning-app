// ホーム画面コンポーネント（SRS忘却曲線タスク・習熟度分布・今日やるべきこと一目瞭然UI）
import { StorageService } from '../services/storage.js';
import { AuthService } from '../services/auth.js';
import { SyncService } from '../services/sync.js';
import { GamificationService } from '../services/gamification.js';
import { PenguinMascot } from './PenguinMascot.js';
import { BatchAudioModal } from './BatchAudioModal.js';

export class HomeComponent {
  static render(container, onNavigate) {
    const vocabList = StorageService.getVocabulary();
    const grammarList = StorageService.getGrammar();
    const historyList = StorageService.getHistory();
    const mistakes = StorageService.getMistakes();
    const activeMistakes = mistakes.filter(m => !m.resolved);
    const dailyStats = StorageService.getDailyStats();
    const settings = StorageService.getSettings();
    const currentUser = AuthService.getCurrentUser();

    // SRS忘却曲線データ
    const dueWords = StorageService.getDueReviewWords();
    const highRiskWords = StorageService.getHighRiskWords();
    const studiedWords = vocabList.filter(v => v.srsLevel > 0);
    const unlearnedWords = vocabList.filter(v => v.srsLevel === 0);

    // 習熟度別集計
    const masteredWords = vocabList.filter(v => v.srsLevel >= 6);      // 習得済 (Lv.6+)
    const stableWords = vocabList.filter(v => v.srsLevel >= 3 && v.srsLevel < 6); // 定着中 (Lv.3-5)
    const beginnerWords = vocabList.filter(v => v.srsLevel >= 1 && v.srsLevel < 3); // 初見 (Lv.1-2)

    // 統計計算
    const totalWords = vocabList.length;
    const totalGrammar = grammarList.length;
    const totalAnswered = historyList.reduce((acc, h) => acc + (h.total || 0), 0);
    const totalCorrect = historyList.reduce((acc, h) => acc + (h.correct || 0), 0);
    const overallAccuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
    const streakDays = dailyStats.streak || 1;
    const todayGoal = settings.dailyGoal || 20;
    const todayCount = dailyStats.todayCount || 0;
    const todayProgress = Math.min(100, Math.round((todayCount / todayGoal) * 100));

    // 共通ゲーミフィケーション・プロフィールデータ
    const profile = GamificationService.getProfile();
    const xpProg = GamificationService.getXpProgress(profile.totalXp);

    container.innerHTML = `
      <div class="animate-fade-in space-y-6 max-w-5xl mx-auto px-4 py-4 sm:py-6">
        
        <!-- Оцон шувуу ＆ レベル・XPステータスカード -->
        <div class="bg-gradient-to-r from-sky-600 via-teal-600 to-emerald-700 rounded-3xl p-5 sm:p-6 text-white shadow-lg relative overflow-hidden">
          <div class="absolute -right-8 -bottom-8 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

          <div class="relative z-10 flex flex-col md:flex-row items-center justify-between gap-5">
            
            <!-- ペンギンマスコットと歓迎メッセージ -->
            <div class="flex items-center gap-4 w-full md:w-auto">
              <div id="home-penguin-room-btn" class="shrink-0 flex items-center justify-center bg-white/15 backdrop-blur-md p-2 rounded-2xl border border-white/20 shadow-md cursor-pointer hover:scale-105 active:scale-95 transition-all group" title="タップしてペンギンのお部屋（育成・着せ替え）へ">
                ${PenguinMascot.getSvg({ mood: 'welcome', level: profile.level, streakDays, size: 76 })}
              </div>
              <div class="space-y-1">
                <div class="flex items-center gap-2">
                  <span class="text-xs bg-amber-400 text-slate-900 font-black px-2.5 py-0.5 rounded-full shadow-2xs">
                    Lv.${profile.level}
                  </span>
                  <span class="text-xs font-bold text-sky-100">${profile.currentTitle}</span>
                  <span class="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">
                    ${PenguinMascot.getStageForLevel(profile.level).name}
                  </span>
                </div>
                <h2 class="text-lg sm:text-xl font-black tracking-tight leading-tight flex flex-wrap items-center gap-2">
                  <span>Сайн байна уу!</span>
                  <button type="button" id="btn-open-penguin-room-pill" class="text-[10px] bg-white/20 hover:bg-white/30 text-white px-2.5 py-1 rounded-full font-bold transition-all cursor-pointer">
                    お部屋 🏠
                  </button>
                  <button type="button" id="btn-home-toggle-sunglasses" class="text-sm ${PenguinMascot.isSunglassesMode() ? 'bg-amber-400 text-slate-950 font-black shadow-xs ring-2 ring-amber-300' : 'bg-white/20 hover:bg-white/30 text-white/90 font-bold'} px-2 py-0.5 rounded-full transition-all flex items-center justify-center cursor-pointer" title="サングラス (${PenguinMascot.isSunglassesMode() ? 'ON' : 'OFF'})">
                    <span>🕶️</span>
                  </button>
                </h2>
                <div class="bg-white/15 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-white/20 text-xs text-white/95 font-bold">
                  🐧 <span class="cyrillic-text font-black">Оцон шувуу</span>：「今日も一緒にモンゴル語を学ぼう！少しずつの積み重ねが大事だよ！」
                </div>
              </div>
            </div>

            <!-- 全体ゲーム進捗（XPバー・累計スコア・最大コンボ） -->
            <div class="bg-black/20 backdrop-blur-md rounded-2xl p-4 border border-white/15 w-full md:w-80 shrink-0 space-y-2.5">
              <div class="flex justify-between items-center text-xs">
                <span class="text-sky-100 font-extrabold flex items-center gap-1">
                  <span>⚡</span> 累計XP
                </span>
                <span class="font-black text-amber-300 text-sm">
                  ${profile.totalXp.toLocaleString()} <span class="text-xs font-normal text-sky-100">XP</span>
                </span>
              </div>

              <!-- XPプログレスバー -->
              <div class="w-full bg-white/20 rounded-full h-3 overflow-hidden p-0.5">
                <div class="bg-gradient-to-r from-amber-300 to-yellow-400 h-full rounded-full transition-all duration-700 shadow-xs" style="width: ${xpProg.percent}%"></div>
              </div>
              <div class="flex justify-between text-[11px] text-sky-100 font-medium">
                <span>次のLvまで: ${xpProg.remainingXp} XP</span>
                <span>進捗: ${xpProg.percent}%</span>
              </div>

              <!-- サブメトリクス -->
              <div class="grid grid-cols-3 gap-2 pt-1 border-t border-white/10 text-center text-[10px]">
                <div>
                  <div class="text-sky-200">累計スコア</div>
                  <div class="font-black text-xs text-white">${profile.totalScore.toLocaleString()}</div>
                </div>
                <div>
                  <div class="text-sky-200">最大コンボ</div>
                  <div class="font-black text-xs text-orange-300">🔥 ${profile.maxCombo}</div>
                </div>
                <div>
                  <div class="text-sky-200">正解率</div>
                  <div class="font-black text-xs text-emerald-300">${profile.overallAccuracy}%</div>
                </div>
              </div>

            </div>

          </div>
        </div>

        <!-- 今日の目標バナー -->
        <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  🔥 連続学習 ${streakDays} 日目達成中！
                </span>
                ${currentUser ? `
                  <span class="text-xs text-slate-500 font-medium">
                    👤 ${currentUser.displayName || currentUser.username}
                  </span>
                ` : ''}
              </div>
              <h3 class="text-base font-extrabold text-slate-800">
                本日の学習目標: ${todayGoal} 問
              </h3>
            </div>

            <!-- 目標進捗バー -->
            <div class="w-full sm:w-64 space-y-1">
              <div class="flex justify-between text-xs font-bold text-slate-600">
                <span>進捗: ${todayCount} / ${todayGoal} 問</span>
                <span class="text-emerald-600 font-extrabold">${todayProgress}%</span>
              </div>
              <div class="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div class="bg-emerald-500 h-full rounded-full transition-all duration-500" style="width: ${todayProgress}%"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- 1. 今日やるべきこと（最優先アクションエリア） -->
        <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-sm sm:text-base font-extrabold text-slate-800 flex items-center gap-2">
              <span>🎯</span> 今日の学習タスク
            </h3>
            <span class="text-xs text-slate-400 font-medium">忘却曲線 ＆ 弱点分析</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            
            <!-- タスク1: 忘却曲線 今日の復習期日 -->
            <div class="p-4 rounded-xl border ${dueWords.length > 0 ? 'border-emerald-300 bg-emerald-50/60' : 'border-slate-200 bg-slate-50'} flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between mb-1.5">
                  <span class="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <span>⚡</span> 忘却曲線 復習予定
                  </span>
                  <span class="text-xs font-extrabold px-2 py-0.5 rounded-full ${dueWords.length > 0 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'}">
                    ${dueWords.length} 語
                  </span>
                </div>
                <p class="text-xs text-slate-500 leading-relaxed">
                  ${dueWords.length > 0 ? '今日復習すべき単語があります。適切なタイミングで解くことで長期記憶に移行します。' : '本日の期日単語はありません。記憶は良好に維持されています。'}
                </p>
              </div>
              <button type="button" id="btn-start-srs-review" class="mt-3 w-full py-2.5 ${dueWords.length > 0 ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs' : 'bg-slate-200 text-slate-400 cursor-not-allowed'} font-bold rounded-lg text-xs transition-all active:scale-98" ${dueWords.length === 0 ? 'disabled' : ''}>
                ${dueWords.length > 0 ? `復習を開始する (${dueWords.length}語) →` : '完了済み'}
              </button>
            </div>

            <!-- タスク2: 記憶減衰中（高忘却リスク単語） -->
            <div class="p-4 rounded-xl border ${highRiskWords.length > 0 ? 'border-amber-300 bg-amber-50/60' : 'border-slate-200 bg-slate-50'} flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between mb-1.5">
                  <span class="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <span>🛡️</span> 忘却リスクが高い単語
                  </span>
                  <span class="text-xs font-extrabold px-2 py-0.5 rounded-full ${highRiskWords.length > 0 ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-600'}">
                    ${highRiskWords.length} 語
                  </span>
                </div>
                <p class="text-xs text-slate-500 leading-relaxed">
                  ${highRiskWords.length > 0 ? '記憶保持率が60%未満に低下している単語です。忘れる前に再復習しましょう。' : '高リスクな単語はありません。'}
                </p>
              </div>
              <button type="button" id="btn-start-high-risk-review" class="mt-3 w-full py-2.5 ${highRiskWords.length > 0 ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs' : 'bg-slate-200 text-slate-400 cursor-not-allowed'} font-bold rounded-lg text-xs transition-all active:scale-98" ${highRiskWords.length === 0 ? 'disabled' : ''}>
                ${highRiskWords.length > 0 ? `高リスク単語を特訓 (${highRiskWords.length}語) →` : 'リスクなし'}
              </button>
            </div>

            <!-- タスク3: 間違いノート（弱点問題） -->
            <div class="p-4 rounded-xl border ${activeMistakes.length > 0 ? 'border-rose-300 bg-rose-50/60' : 'border-slate-200 bg-slate-50'} flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between mb-1.5">
                  <span class="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <span>🔥</span> 間違いノート（弱点）
                  </span>
                  <span class="text-xs font-extrabold px-2 py-0.5 rounded-full ${activeMistakes.length > 0 ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-600'}">
                    ${activeMistakes.length} 問
                  </span>
                </div>
                <p class="text-xs text-slate-500 leading-relaxed">
                  ${activeMistakes.length > 0 ? 'テストで不正解だった問題が記録されています。弱点を克服するまで繰り返し練習できます。' : '未克服の間違い問題はありません！'}
                </p>
              </div>
              <button type="button" id="btn-start-mistake-review" class="mt-3 w-full py-2.5 ${activeMistakes.length > 0 ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs' : 'bg-slate-200 text-slate-400 cursor-not-allowed'} font-bold rounded-lg text-xs transition-all active:scale-98" ${activeMistakes.length === 0 ? 'disabled' : ''}>
                ${activeMistakes.length > 0 ? `弱点を克服する (${activeMistakes.length}問) →` : '苦手なし'}
              </button>
            </div>

          </div>
        </div>

        <!-- 2. 習熟度分布 ＆ 学習統計 -->
        <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-sm sm:text-base font-extrabold text-slate-800 flex items-center gap-2">
              <span>📊</span> 学習状況 ＆ 習熟度分布
            </h3>
            <span class="text-xs font-bold text-emerald-700">全${totalWords}語中 ${studiedWords.length}語学習済</span>
          </div>

          <!-- 習熟度プログレスバー -->
          <div class="space-y-1.5">
            <div class="h-3 w-full bg-slate-100 rounded-full flex overflow-hidden">
              <div class="bg-purple-500 h-full transition-all" style="width: ${(masteredWords.length / totalWords) * 100}%" title="習得済: ${masteredWords.length}語"></div>
              <div class="bg-emerald-500 h-full transition-all" style="width: ${(stableWords.length / totalWords) * 100}%" title="定着中: ${stableWords.length}語"></div>
              <div class="bg-amber-400 h-full transition-all" style="width: ${(beginnerWords.length / totalWords) * 100}%" title="初見: ${beginnerWords.length}語"></div>
            </div>
            
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] pt-1">
              <div class="flex items-center gap-1.5">
                <span class="w-2.5 h-2.5 rounded-full bg-purple-500 shrink-0"></span>
                <span class="text-slate-600 font-medium">習得済 (Lv.6+):</span>
                <strong class="text-slate-900">${masteredWords.length}</strong>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
                <span class="text-slate-600 font-medium">定着中 (Lv.3-5):</span>
                <strong class="text-slate-900">${stableWords.length}</strong>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0"></span>
                <span class="text-slate-600 font-medium">初見 (Lv.1-2):</span>
                <strong class="text-slate-900">${beginnerWords.length}</strong>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="w-2.5 h-2.5 rounded-full bg-slate-300 shrink-0"></span>
                <span class="text-slate-600 font-medium">未学習:</span>
                <strong class="text-slate-900">${unlearnedWords.length}</strong>
              </div>
            </div>
          </div>

          <!-- 4分割 主要指標カード -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <div class="text-[11px] text-slate-500">登録単語数</div>
              <div class="text-lg font-extrabold text-slate-900">${totalWords} <span class="text-xs font-normal text-slate-400">語</span></div>
            </div>
            <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <div class="text-[11px] text-slate-500">登録文法数</div>
              <div class="text-lg font-extrabold text-slate-900">${totalGrammar} <span class="text-xs font-normal text-slate-400">課</span></div>
            </div>
            <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <div class="text-[11px] text-slate-500">累計正答率</div>
              <div class="text-lg font-extrabold text-slate-900">${overallAccuracy}% <span class="text-xs font-normal text-slate-400">(${totalCorrect}/${totalAnswered})</span></div>
            </div>
            <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <div class="text-[11px] text-slate-500">学習継続日数</div>
              <div class="text-lg font-extrabold text-slate-900">${streakDays} <span class="text-xs font-normal text-slate-400">日連続</span></div>
            </div>
          </div>
        </div>

        <!-- 3. 学習メニューを選ぶ グリッド -->
        <div>
          <h3 class="text-base font-extrabold text-slate-800 mb-3 flex items-center gap-2">
            <span>🚀</span> 学習メニューを選ぶ
          </h3>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            
            <!-- 単語ゲーム（新機能・スピードラン/サバイバル/コンボ/リラックス） -->
            <div class="bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-indigo-500/10 rounded-xl p-5 border-2 border-amber-400 hover:border-amber-500 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between" data-target="word_game">
              <div>
                <div class="flex items-center justify-between mb-3">
                  <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center text-xl font-bold shadow-xs">
                    🎮
                  </div>
                  <span class="text-xs font-black px-2 py-0.5 rounded-full bg-amber-500 text-white shadow-2xs">
                    新・ペンギンドロップ ⚡ 5モード
                  </span>
                </div>
                <h4 class="text-base font-black text-slate-900 group-hover:text-amber-700 transition-colors flex items-center gap-1.5">
                  学習バトル（ゲーム）
                </h4>
                <p class="text-xs text-slate-600 mt-1">
                  HAMARU風の落下単語シューティング「ペンギンドロップ」やスピードラン、サバイバルで爽快に単語をマスター！
                </p>
              </div>
              <div class="mt-4 pt-3 border-t border-amber-200/60 flex items-center justify-between text-xs font-black text-amber-700">
                <span>ゲームをプレイ</span>
                <span class="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>

            <!-- 単語テスト -->
            <div class="bg-white rounded-xl p-5 border border-slate-200 hover:border-emerald-500 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between" data-target="word_test">
              <div>
                <div class="flex items-center justify-between mb-3">
                  <div class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xl font-bold">
                    📝
                  </div>
                  <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    全${totalWords}語対応
                  </span>
                </div>
                <h4 class="text-base font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">
                  単語テスト
                </h4>
                <p class="text-xs text-slate-500 mt-1">
                  日→モン、モン→日、4択問題、語幹当て問題など多彩な形式で単語を定着。
                </p>
              </div>
              <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
                <span>テストを開始</span>
                <span class="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>

            <!-- 日本語訳テスト（モンゴル語を見て日本語の意味を答えるテスト） -->
            <div class="bg-white rounded-xl p-5 border border-slate-200 hover:border-rose-500 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between" data-target="japanese_test">
              <div>
                <div class="flex items-center justify-between mb-3">
                  <div class="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center text-xl font-bold">
                    🇯🇵
                  </div>
                  <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                    全${totalWords}語・記述＆4択
                  </span>
                </div>
                <h4 class="text-base font-bold text-slate-800 group-hover:text-rose-700 transition-colors">
                  日本語訳テスト
                </h4>
                <p class="text-xs text-slate-500 mt-1">
                  モンゴル語の単語や発音から、正しい日本語訳（意味）を答えるテスト。記述式と4択選択に対応。
                </p>
              </div>
              <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-rose-700">
                <span>テストを開始</span>
                <span class="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>

            <!-- 文法テスト -->
            <div class="bg-white rounded-xl p-5 border border-slate-200 hover:border-sky-500 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between" data-target="grammar_test">
              <div>
                <div class="flex items-center justify-between mb-3">
                  <div class="w-10 h-10 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center text-xl font-bold">
                    📐
                  </div>
                  <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                    全${totalGrammar}課収録
                  </span>
                </div>
                <h4 class="text-base font-bold text-slate-800 group-hover:text-sky-700 transition-colors">
                  文法テスト
                </h4>
                <p class="text-xs text-slate-500 mt-1">
                  語順並び替え、疑問助詞、助詞使い分け、空欄補充、誤り訂正。
                </p>
              </div>
              <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-sky-700">
                <span>テストを開始</span>
                <span class="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>

            <!-- 格変化・動詞活用テスト -->
            <div class="bg-white rounded-xl p-5 border border-slate-200 hover:border-amber-500 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between" data-target="declension_test">
              <div>
                <div class="flex items-center justify-between mb-3">
                  <div class="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-xl font-bold">
                    ⚡
                  </div>
                  <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                    重要特化
                  </span>
                </div>
                <h4 class="text-base font-bold text-slate-800 group-hover:text-amber-700 transition-colors">
                  格変化・動詞活用テスト
                </h4>
                <p class="text-xs text-slate-500 mt-1">
                  名詞7格（主格・属格・与位格・対格・奪格・造格・共格）と動詞活用集中ドリル。
                </p>
              </div>
              <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-700">
                <span>ドリルを開始</span>
                <span class="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>

            <!-- リスニング問題（新機能・穴埋め/ディクテーション/数字特化） -->
            <div class="bg-gradient-to-br from-teal-500/10 via-cyan-500/5 to-sky-500/10 rounded-xl p-5 border-2 border-teal-400 hover:border-teal-500 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between" data-target="listening_test">
              <div>
                <div class="flex items-center justify-between mb-3">
                  <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-500 text-white flex items-center justify-center text-xl font-bold shadow-xs">
                    🎧
                  </div>
                  <span class="text-xs font-black px-2 py-0.5 rounded-full bg-teal-600 text-white shadow-2xs">
                    新登場 ⚡ 音声特化
                  </span>
                </div>
                <h4 class="text-base font-black text-slate-900 group-hover:text-teal-700 transition-colors flex items-center gap-1.5">
                  リスニング問題
                </h4>
                <p class="text-xs text-slate-600 mt-1">
                  ネイティブ音声を聞き取り！難関の数字・金額・時刻から日常会話まで、穴埋め＆ディクテーションで徹底耳慣らし。
                </p>
              </div>
              <div class="mt-4 pt-3 border-t border-teal-200/60 flex items-center justify-between text-xs font-black text-teal-700">
                <span>リスニングを開始</span>
                <span class="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>

            <!-- 読解テスト（新機能・単語タップ辞書＆調べた単語帳） -->
            <div class="bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-cyan-500/10 rounded-xl p-5 border-2 border-emerald-400 hover:border-emerald-500 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between" data-target="reading_test">
              <div>
                <div class="flex items-center justify-between mb-3">
                  <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center text-xl font-bold shadow-xs">
                    📖
                  </div>
                  <span class="text-xs font-black px-2 py-0.5 rounded-full bg-emerald-600 text-white shadow-2xs">
                    新登場 ⚡ 単語タップ辞書
                  </span>
                </div>
                <h4 class="text-base font-black text-slate-900 group-hover:text-emerald-700 transition-colors flex items-center gap-1.5">
                  読解テスト ＆ 単語帳
                </h4>
                <p class="text-xs text-slate-600 mt-1">
                  物語や文化の記事を長文読解！わからない単語はタップ即解説 ＆ 「調べた単語」に自動保存して後から復習。
                </p>
              </div>
              <div class="mt-4 pt-3 border-t border-emerald-200/60 flex items-center justify-between text-xs font-black text-emerald-700">
                <span>読解を開始</span>
                <span class="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>

            <!-- タイピング練習（単語タップ辞書・即時和訳） -->
            <div class="bg-gradient-to-br from-teal-500/10 via-cyan-500/5 to-emerald-500/10 rounded-xl p-5 border-2 border-teal-400 hover:border-teal-500 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between" data-target="typing_test">
              <div>
                <div class="flex items-center justify-between mb-3">
                  <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-teal-600 text-white flex items-center justify-center text-xl font-bold shadow-xs">
                    ⌨️
                  </div>
                  <span class="text-xs font-black px-2 py-0.5 rounded-full bg-teal-600 text-white shadow-2xs">
                    新登場 ⚡ 和訳即時表示
                  </span>
                </div>
                <h4 class="text-base font-black text-slate-900 group-hover:text-teal-700 transition-colors flex items-center gap-1.5">
                  タイピング練習
                </h4>
                <p class="text-xs text-slate-600 mt-1">
                  キリル文字を打ちながらフレーズ体得！単語タップで辞書＆「調べた単語」保存。一文終えると即座に和訳と解説が出現！
                </p>
              </div>
              <div class="mt-4 pt-3 border-t border-teal-200/60 flex items-center justify-between text-xs font-black text-teal-700">
                <span>タイピングを開始</span>
                <span class="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>

            <!-- 発音特訓モード（新機能・マイク採点＆聴き比べ＆口形ガイド） -->
            <div class="bg-gradient-to-br from-cyan-500/15 via-teal-500/10 to-sky-500/15 rounded-xl p-5 border-2 border-cyan-500 hover:border-cyan-600 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between" data-target="pronunciation_test">
              <div>
                <div class="flex items-center justify-between mb-3">
                  <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-cyan-500 text-white flex items-center justify-center text-xl font-bold shadow-xs">
                    🎙️
                  </div>
                  <span class="text-xs font-black px-2 py-0.5 rounded-full bg-cyan-700 text-white shadow-2xs">
                    新登場 ⚡ AIマイク採点
                  </span>
                </div>
                <h4 class="text-base font-black text-slate-900 group-hover:text-cyan-700 transition-colors flex items-center gap-1.5">
                  発音特訓モード
                </h4>
                <p class="text-xs text-slate-600 mt-1">
                  お手本を聞いてマイクで発音！AIスコア採点・苦手音（ө, ү, х, л, р）の口形図解ガイド＆自分の声とお手本のA/B聴き比べ！
                </p>
              </div>
              <div class="mt-4 pt-3 border-t border-cyan-200/60 flex items-center justify-between text-xs font-black text-cyan-800">
                <span>発音特訓を開始</span>
                <span class="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>

            <!-- フラッシュカード -->
            <div class="bg-white rounded-xl p-5 border border-slate-200 hover:border-teal-500 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between" data-target="flashcards">
              <div>
                <div class="flex items-center justify-between mb-3">
                  <div class="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center text-xl font-bold">
                    🃏
                  </div>
                  <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                    カード学習
                  </span>
                </div>
                <h4 class="text-base font-bold text-slate-800 group-hover:text-teal-700 transition-colors">
                  フラッシュカード
                </h4>
                <p class="text-xs text-slate-500 mt-1">
                  カードをめくって発音・語幹を確認。覚えた/もう一度でSRSレベルを更新。
                </p>
              </div>
              <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-teal-700">
                <span>カードをめくる</span>
                <span class="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>

            <!-- 間違い復習ノート -->
            <div class="bg-white rounded-xl p-5 border border-slate-200 hover:border-rose-500 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between" data-target="review">
              <div>
                <div class="flex items-center justify-between mb-3">
                  <div class="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center text-xl font-bold">
                    🔥
                  </div>
                  <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                    ${activeMistakes.length}問要復習
                  </span>
                </div>
                <h4 class="text-base font-bold text-slate-800 group-hover:text-rose-700 transition-colors">
                  間違いノート
                </h4>
                <p class="text-xs text-slate-500 mt-1">
                  過去に間違えた問題だけを抽出し、克服するまで何度でも集中復習。
                </p>
              </div>
              <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-rose-700">
                <span>弱点を復習</span>
                <span class="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>

            <!-- 教材登録・データ管理 -->
            <div class="bg-white rounded-xl p-5 border border-slate-200 hover:border-indigo-500 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between" data-target="materials">
              <div>
                <div class="flex items-center justify-between mb-3">
                  <div class="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center text-xl font-bold">
                    📚
                  </div>
                  <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                    インポート対応
                  </span>
                </div>
                <h4 class="text-base font-bold text-slate-800 group-hover:text-indigo-700 transition-colors">
                  教材登録・管理
                </h4>
                <p class="text-xs text-slate-500 mt-1">
                  自作単語・CSV/JSONインポート、バックアップ、マスターデータ同期。
                </p>
              </div>
              <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-700">
                <span>教材を管理</span>
                <span class="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>

            <!-- 音声一括ダウンロード（完全オフライン対応） -->
            <div class="bg-gradient-to-br from-sky-500/10 via-blue-500/5 to-indigo-500/10 rounded-xl p-5 border-2 border-sky-400 hover:border-sky-500 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between" id="card-batch-audio-dl">
              <div>
                <div class="flex items-center justify-between mb-3">
                  <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white flex items-center justify-center text-xl font-bold shadow-xs">
                    📥
                  </div>
                  <span class="text-xs font-black px-2 py-0.5 rounded-full bg-sky-600 text-white shadow-2xs">
                    完全オフライン対応
                  </span>
                </div>
                <h4 class="text-base font-black text-slate-900 group-hover:text-sky-700 transition-colors flex items-center gap-1.5">
                  音声一括ダウンロード
                </h4>
                <p class="text-xs text-slate-600 mt-1">
                  全単語・例文のネイティブ音声を端末（IndexedDB）に一括保存。ネット接続なしでも0秒即時再生！
                </p>
              </div>
              <div class="mt-4 pt-3 border-t border-sky-200/60 flex items-center justify-between text-xs font-black text-sky-700">
                <span>音声ダウンロード管理</span>
                <span class="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    `;

    // イベントバインド
    container.querySelectorAll('[data-target]').forEach(card => {
      card.addEventListener('click', () => {
        const target = card.getAttribute('data-target');
        if (onNavigate) onNavigate(target);
      });
    });

    // 忘却曲線復習ボタン
    const srsBtn = container.querySelector('#btn-start-srs-review');
    if (srsBtn && dueWords.length > 0) {
      srsBtn.addEventListener('click', () => {
        if (onNavigate) onNavigate('word_test');
      });
    }

    // 高リスク復習ボタン
    const riskBtn = container.querySelector('#btn-start-high-risk-review');
    if (riskBtn && highRiskWords.length > 0) {
      riskBtn.addEventListener('click', () => {
        if (onNavigate) onNavigate('word_test');
      });
    }

    // 間違い復習ボタン
    const mistakeBtn = container.querySelector('#btn-start-mistake-review');
    if (mistakeBtn && activeMistakes.length > 0) {
      mistakeBtn.addEventListener('click', () => {
        if (onNavigate) onNavigate('review');
      });
    }

    // 音声一括ダウンロードカード
    const batchAudioCard = container.querySelector('#card-batch-audio-dl');
    if (batchAudioCard) {
      batchAudioCard.addEventListener('click', () => {
        BatchAudioModal.show();
      });
    }

    // ホーム画面サングラス切り替えボタン
    const homeSunglassBtn = container.querySelector('#btn-home-toggle-sunglasses');
    if (homeSunglassBtn) {
      homeSunglassBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        PenguinMascot.toggleSunglassesMode();
        SoundEffects.playCorrect();
        this.render(container, onNavigate);
      });
    }

    // ペンギンのお部屋モーダル
    const openRoom = () => {
      PenguinMascot.showPenguinRoomModal(onNavigate);
    };
    const roomBtn = container.querySelector('#home-penguin-room-btn');
    if (roomBtn) roomBtn.addEventListener('click', openRoom);
    const roomPill = container.querySelector('#btn-open-penguin-room-pill');
    if (roomPill) roomPill.addEventListener('click', openRoom);
  }
}
