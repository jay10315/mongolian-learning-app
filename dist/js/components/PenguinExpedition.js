// ペンギン探検隊（モンゴル縦断鉄道すごろく旅 ＆ 全22地域名所図鑑）コンポーネント
import { StorageService } from '../services/storage.js';
import { expeditionDestinations } from '../data/expeditionData.js';
import { railwayStations, railwayIncidents, railwayQuestions } from '../data/railwayData.js';
import { GamificationService } from '../services/gamification.js';
import { SpeechService } from '../services/speech.js';
import { SoundEffects } from '../utils/helpers.js';

export class PenguinExpeditionComponent {
  static state = {
    activeTab: 'railway', // 'railway' (すごろくサバイバル旅) | 'map' (全22地域図鑑)
    selectedDestination: null,
    currentFilter: 'all', // 'all', 'unlocked', 'locked', 'capital', 'north', 'west', 'central', 'gobi', 'east'
    hoveredRegionId: null,

    // 🚂 モンゴル縦断鉄道すごろく状態
    railway: {
      stationIdx: 0, // 0 to 9 (0: スフバートル, 9: ザミンウード)
      tickets: 3,    // 乗車チケット（残機: 最大3）
      maxTickets: 3,
      combo: 0,
      maxCombo: 0,
      totalCorrect: 0,
      totalMistakes: 0,
      totalKm: 0,
      isGoal: false,
      isGameOver: false,
      lastAction: null, // 'correct' | 'wrong' | null
      advanceSteps: 1,
      retreatSteps: 0,
      incident: null,
      stamps: ['sukhbaatar_st'],
      currentQ: null,
      hasAnswered: false,
      selectedChoiceIdx: null,
      usedQIds: []
    }
  };

  static initRailwayGame(reset = false) {
    if (!this.state.railway || reset) {
      this.state.railway = {
        stationIdx: 0,
        tickets: 3,
        maxTickets: 3,
        combo: 0,
        maxCombo: 0,
        totalCorrect: 0,
        totalMistakes: 0,
        totalKm: 0,
        isGoal: false,
        isGameOver: false,
        lastAction: null,
        advanceSteps: 1,
        retreatSteps: 0,
        incident: null,
        stamps: ['sukhbaatar_st'],
        currentQ: null,
        hasAnswered: false,
        selectedChoiceIdx: null,
        usedQIds: []
      };
    }
    this.pickNextQuestion();
  }

  static pickNextQuestion() {
    const rw = this.state.railway;
    let available = railwayQuestions.filter(q => !rw.usedQIds.includes(q.id));
    if (available.length === 0) {
      rw.usedQIds = [];
      available = [...railwayQuestions];
    }
    const randIdx = Math.floor(Math.random() * available.length);
    const selected = available[randIdx];
    rw.usedQIds.push(selected.id);
    rw.currentQ = selected;
    rw.hasAnswered = false;
    rw.selectedChoiceIdx = null;
    rw.lastAction = null;
    rw.incident = null;
  }

  static handleRailwayAnswer(choiceIdx) {
    const rw = this.state.railway;
    if (rw.hasAnswered || rw.isGoal || rw.isGameOver || !rw.currentQ) return;

    rw.hasAnswered = true;
    rw.selectedChoiceIdx = choiceIdx;
    const isCorrect = choiceIdx === rw.currentQ.correctIdx;

    if (isCorrect) {
      try { SoundEffects.playCorrect(); } catch (e) {}
      rw.combo++;
      if (rw.combo > rw.maxCombo) rw.maxCombo = rw.combo;
      rw.totalCorrect++;
      rw.lastAction = 'correct';

      // 3連勝以上でスチームブースト（2駅前進！）
      rw.advanceSteps = rw.combo >= 3 ? 2 : 1;
      rw.retreatSteps = 0;

      const nextStationIdx = Math.min(9, rw.stationIdx + rw.advanceSteps);
      rw.stationIdx = nextStationIdx;
      const currentStation = railwayStations[rw.stationIdx];
      rw.totalKm = currentStation.km;

      if (!rw.stamps.includes(currentStation.id)) {
        rw.stamps.push(currentStation.id);
      }

      // XP付与
      try {
        if (typeof GamificationService.addXp === 'function') {
          GamificationService.addXp(20, 'ペンギン鉄道駅進出');
        } else if (typeof GamificationService.addXP === 'function') {
          GamificationService.addXP(20, 'ペンギン鉄道駅進出');
        }
      } catch (e) {}

      // ゴール判定（第10駅 ザミンウード 1,110km 到着）
      if (rw.stationIdx >= 9) {
        rw.isGoal = true;
        try {
          if (typeof GamificationService.addXp === 'function') {
            GamificationService.addXp(300, 'モンゴル縦断鉄道1,110km全線走破');
          } else if (typeof GamificationService.addXP === 'function') {
            GamificationService.addXP(300, 'モンゴル縦断鉄道1,110km全線走破');
          }
        } catch (e) {}
      }
    } else {
      try { SoundEffects.playWrong(); } catch (e) {}
      rw.combo = 0;
      rw.totalMistakes++;
      rw.lastAction = 'wrong';
      try {
        const q = rw.currentQ;
        if (q) {
          StorageService.recordMistake({
            question: `【鉄道クイズ】${q.prompt}`,
            userAnswer: (q.choices && q.choices[choiceIdx]) ? q.choices[choiceIdx].text : '(未回答)',
            correctAnswer: (q.choices && q.choices[q.correctIdx]) ? q.choices[q.correctIdx].text : '',
            type: 'culture',
            category: 'ペンギン探検鉄道',
            explanation: q.explanation || ''
          });
        }
      } catch (_) {}
      rw.tickets = Math.max(0, rw.tickets - 1);

      // ★重要要件: 「間違えるたびに戻る」（1駅後退！）
      if (rw.stationIdx > 0) {
        rw.stationIdx -= 1;
        rw.retreatSteps = 1;
      } else {
        rw.retreatSteps = 0; // 始発駅未満には戻らない
      }
      const currentStation = railwayStations[rw.stationIdx];
      rw.totalKm = currentStation.km;

      // ランダムトラブル事件の発生
      const randInc = railwayIncidents[Math.floor(Math.random() * railwayIncidents.length)];
      rw.incident = randInc;

      // ゲームオーバー判定（チケット0枚）
      if (rw.tickets <= 0) {
        rw.isGameOver = true;
      }
    }

    this.render(this.container, this.onNavigate);
  }

  static nextRailwayTurn() {
    const rw = this.state.railway;
    if (rw.isGoal || rw.isGameOver) return;
    this.pickNextQuestion();
    this.render(this.container, this.onNavigate);
  }

  static render(container, onNavigate) {
    this.container = container;
    this.onNavigate = onNavigate;

    if (!this.state.railway || !this.state.railway.currentQ) {
      this.initRailwayGame(false);
    }

    const profile = GamificationService.getProfile();
    const currentXp = profile.totalXp;

    this.container.innerHTML = `
      <div class="animate-fadeIn space-y-6 max-w-6xl mx-auto pb-12 font-sans">
        <!-- 最上部ヘッダー ＆ モード切替タブ -->
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-5 rounded-2xl shadow-xs border border-slate-200">
          <div>
            <div class="flex items-center gap-2">
              <span class="text-3xl">🚂</span>
              <h2 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                ペンギン鉄道・モンゴル縦断すごろく探検
              </h2>
            </div>
            <p class="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              北のロシア国境（スフバートル）から南の中国国境（ザミンウード）まで全1,110kmを走破せよ！
            </p>
          </div>

          <!-- モード切替タブ -->
          <div class="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 self-start md:self-auto">
            <button type="button" class="tab-mode-btn px-4 py-2 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
              this.state.activeTab === 'railway'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }" data-tab="railway">
              <span>🚂</span>
              <span>鉄道すごろく（サバイバル旅）</span>
            </button>
            <button type="button" class="tab-mode-btn px-4 py-2 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
              this.state.activeTab === 'map'
                ? 'bg-cyan-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }" data-tab="map">
              <span>🗺️</span>
              <span>モンゴル全土探検地図（全22地域図鑑）</span>
            </button>
          </div>
        </div>

        ${this.state.activeTab === 'railway' ? this.renderRailwayUI(currentXp) : this.renderMapUI(currentXp)}
      </div>
    `;

    this.bindEvents();
  }

  // 🚂 鉄道すごろくUIの描画
  static renderRailwayUI(currentXp) {
    const rw = this.state.railway;
    const currentStation = railwayStations[rw.stationIdx];
    const progressPercent = Math.min(100, Math.round((currentStation.km / 1110) * 100));

    return `
      <!-- サバイバルHUDステータスバー -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white p-4 rounded-2xl shadow-md border border-slate-800">
        <!-- チケット（残機） -->
        <div class="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10 flex flex-col justify-between">
          <div class="text-[11px] font-bold text-slate-300">乗車チケット（残機）</div>
          <div class="text-lg font-black mt-1 flex items-center gap-1">
            ${Array(rw.maxTickets).fill(0).map((_, i) => `
              <span class="${i < rw.tickets ? 'text-amber-400 animate-pulse' : 'opacity-25 grayscale'} text-xl">🎫</span>
            `).join('')}
            <span class="text-xs font-mono ml-1 text-slate-300">(${rw.tickets}/${rw.maxTickets})</span>
          </div>
          <div class="text-[10px] text-amber-200/80 font-bold mt-1">※間違えると1駅後退＆1枚減</div>
        </div>

        <!-- 走破距離 -->
        <div class="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10 flex flex-col justify-between">
          <div class="text-[11px] font-bold text-slate-300">走破距離メーター</div>
          <div class="text-xl font-black font-mono text-cyan-300 mt-0.5">
            ${currentStation.km} <span class="text-xs text-white/70">/ 1,110 km</span>
          </div>
          <div class="w-full bg-white/20 h-1.5 rounded-full overflow-hidden mt-1.5">
            <div class="bg-gradient-to-r from-cyan-400 to-emerald-400 h-full rounded-full transition-all duration-500" style="width: ${progressPercent}%"></div>
          </div>
        </div>

        <!-- コンボストリーク -->
        <div class="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10 flex flex-col justify-between">
          <div class="text-[11px] font-bold text-slate-300">連続正解コンボ</div>
          <div class="flex items-center gap-1.5 mt-0.5">
            <span class="text-xl font-black font-mono text-amber-300">${rw.combo}</span>
            <span class="text-xs text-amber-200 font-bold">連続正解</span>
            ${rw.combo >= 3 ? `<span class="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black animate-bounce">🔥 BOOST!</span>` : ''}
          </div>
          <div class="text-[10px] text-slate-300 font-bold mt-1">
            ${rw.combo >= 3 ? '🔥 2駅一気に超特急前進中！' : '3連続正解で一気に2駅前進！'}
          </div>
        </div>

        <!-- 獲得スタンプ -->
        <div class="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10 flex flex-col justify-between">
          <div class="text-[11px] font-bold text-slate-300">駅スタンプ収集</div>
          <div class="text-xl font-black font-mono text-emerald-300 mt-0.5">
            ${rw.stamps.length} <span class="text-xs text-white/70">/ 10 駅</span>
          </div>
          <div class="text-[10px] text-emerald-200/90 font-bold mt-1">
            最高記録: ${rw.maxCombo} コンボ
          </div>
        </div>
      </div>

      <!-- すごろく線路ボード（10駅レールウェイマップ） -->
      <div class="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-lg">🛤️</span>
            <h3 class="text-sm sm:text-base font-black text-slate-900">
              モンゴル縦断鉄道路線図（全10駅すごろく）
            </h3>
          </div>
          <span class="text-xs font-bold text-slate-500">
            現在地: <strong class="text-sky-700 cyrillic-text font-black">${currentStation.nameMn}</strong>（第${rw.stationIdx + 1}駅）
          </span>
        </div>

        <!-- 線路ステーションスクロールビュー -->
        <div class="overflow-x-auto pb-4 pt-2">
          <div class="min-w-[880px] flex items-center justify-between relative px-6 py-4 bg-slate-50 rounded-2xl border border-slate-200">
            <!-- 鉄道の線路ベースライン -->
            <div class="absolute left-10 right-10 top-1/2 -translate-y-1/2 h-3 bg-slate-300 rounded-full border-y border-slate-400 z-0">
              <div class="h-full bg-gradient-to-r from-amber-500 via-sky-500 to-emerald-500 rounded-full transition-all duration-700" style="width: ${progressPercent}%"></div>
            </div>

            ${railwayStations.map((st, idx) => {
              const isCurrent = idx === rw.stationIdx;
              const isVisited = rw.stamps.includes(st.id);

              return `
                <div class="relative z-10 flex flex-col items-center group cursor-pointer transition-all ${isCurrent ? 'scale-110' : ''}" style="width: 76px;">
                  <!-- 現在位置のペンギン機関車マーカー -->
                  ${isCurrent ? `
                    <div class="absolute -top-11 flex flex-col items-center animate-bounce z-20">
                      <span class="text-2xl filter drop-shadow-md">🚂🐧</span>
                      <span class="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-amber-500 text-white shadow-xs whitespace-nowrap">
                        現在地
                      </span>
                    </div>
                  ` : ''}

                  <!-- 駅ノードサークル -->
                  <div class="w-11 h-11 rounded-full flex items-center justify-center text-lg shadow-sm border-2 transition-all ${
                    isCurrent
                      ? 'bg-amber-400 border-amber-600 ring-4 ring-amber-300 text-slate-950 scale-105'
                      : isVisited
                        ? 'bg-emerald-500 border-emerald-600 text-white'
                        : 'bg-white border-slate-300 text-slate-400'
                  }">
                    ${isVisited && !isCurrent ? '✅' : st.icon}
                  </div>

                  <!-- 駅名 ＆ キロ数 -->
                  <div class="text-center mt-2 space-y-0.5">
                    <div class="text-[11px] font-black cyrillic-text leading-tight ${isCurrent ? 'text-amber-950 font-black' : isVisited ? 'text-emerald-950' : 'text-slate-400'}">
                      ${st.nameMn.replace(' өртөө', '')}
                    </div>
                    <div class="text-[10px] font-bold ${isCurrent ? 'text-amber-700' : 'text-slate-500'}">
                      ${st.nameJa.replace('駅', '')}
                    </div>
                    <div class="text-[9px] font-mono text-slate-400">
                      ${st.km}km
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>

      <!-- チャレンジクイズ ＆ ゲーム進行エリア -->
      ${rw.isGoal ? this.renderGoalVictoryUI() : rw.isGameOver ? this.renderGameOverUI() : this.renderChallengeUI(currentStation)}
    `;
  }

  // 🎯 駅チャレンジクイズの描画
  static renderChallengeUI(currentStation) {
    const rw = this.state.railway;
    const q = rw.currentQ;
    if (!q) return '';

    return `
      <div class="bg-white rounded-2xl border-2 border-sky-600 shadow-md p-5 sm:p-7 space-y-6">
        <!-- 現在停車中の駅バナー -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-200">
          <div>
            <div class="flex items-center gap-2">
              <span class="text-2xl">${currentStation.icon}</span>
              <div>
                <span class="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200">
                  第 ${currentStation.index + 1} 駅 停車中
                </span>
                <h3 class="text-lg sm:text-xl font-black text-slate-900 cyrillic-text mt-0.5">
                  ${currentStation.nameMn} <span class="text-sm font-bold text-slate-600">（${currentStation.nameJa}）</span>
                </h3>
              </div>
            </div>
            <p class="text-xs text-slate-500 mt-1 leading-relaxed">
              📍 ${currentStation.regionJa} ｜ ${currentStation.desc}
            </p>
          </div>

          <div class="flex items-center gap-2 self-start sm:self-auto">
            <span class="text-xs font-bold text-slate-500">駅スタンプ:</span>
            <span class="text-xs font-black px-2.5 py-1 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 flex items-center gap-1 shadow-2xs">
              ${currentStation.stamp}
            </span>
          </div>
        </div>

        <!-- クイズ出題エリア -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <span class="text-xs font-black text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200">
              🏷️ ${q.category} 出発試練
            </span>
            <span class="text-xs font-bold text-slate-400">
              正解で次駅へ進行 ｜ 不正解で<strong>1駅後退</strong>
            </span>
          </div>

          <div class="bg-gradient-to-br from-slate-50 to-sky-50/50 p-6 rounded-2xl border border-slate-200 text-center space-y-3">
            <div class="text-xs sm:text-sm font-bold text-slate-600">
              【問題】${q.prompt}
            </div>

            <!-- 単語・フレーズの強調表示 ＆ 音声ボタン -->
            <div class="flex items-center justify-center gap-3 pt-1">
              <span class="text-2xl sm:text-3xl font-black cyrillic-text text-slate-900 tracking-wide">
                ${q.wordMn}
              </span>
              <button type="button" class="btn-play-audio p-2 rounded-xl bg-white hover:bg-sky-50 border border-slate-200 text-sky-600 shadow-2xs transition-all active:scale-95 cursor-pointer" data-text="${q.wordMn}" title="音声を聴く">
                🔊
              </button>
            </div>

            ${q.caution ? `
              <div class="text-xs font-bold text-amber-700 bg-amber-50 inline-block px-3 py-1 rounded-full border border-amber-200">
                ⚠️ 発音注意: [${q.caution}]
              </div>
            ` : ''}
          </div>

          <!-- 4択選択ボタン群 -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            ${q.choices.map((choice, idx) => {
              let btnClass = 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800 hover:border-sky-400';
              let badge = '';

              if (rw.hasAnswered) {
                if (idx === q.correctIdx) {
                  btnClass = 'bg-emerald-500 border-emerald-600 text-white font-black shadow-md ring-4 ring-emerald-300';
                  badge = '<span class="text-xs ml-1">✔ 正解</span>';
                } else if (idx === rw.selectedChoiceIdx) {
                  btnClass = 'bg-rose-500 border-rose-600 text-white font-black shadow-md ring-4 ring-rose-300';
                  badge = '<span class="text-xs ml-1">✖ 不正解</span>';
                } else {
                  btnClass = 'bg-slate-100 border-slate-200 text-slate-400 opacity-60';
                }
              }

              return `
                <button type="button" class="btn-railway-choice p-4 rounded-xl border-2 transition-all active:scale-98 flex items-center justify-between text-left shadow-xs cursor-pointer ${btnClass}" data-choice-idx="${idx}" ${rw.hasAnswered ? 'disabled' : ''}>
                  <div class="flex items-center gap-2.5">
                    <span class="w-6 h-6 rounded-lg bg-black/10 flex items-center justify-center text-xs font-mono font-bold">
                      ${idx + 1}
                    </span>
                    <span class="text-base font-bold cyrillic-text">${choice}</span>
                  </div>
                  ${badge}
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <!-- 判定フィードバック ＆ 次へのアクションボタン -->
        ${rw.hasAnswered ? `
          <div class="pt-4 border-t border-slate-200 animate-fadeIn">
            ${rw.lastAction === 'correct' ? `
              <!-- 正解フィードバック -->
              <div class="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl space-y-3">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2 text-emerald-800 font-black text-base sm:text-lg">
                    <span>🎉</span>
                    <span>正解！素晴らしい判断です！</span>
                  </div>
                  <span class="text-xs font-black px-2.5 py-1 rounded-full bg-emerald-600 text-white">
                    +20 XP
                  </span>
                </div>
                <p class="text-xs sm:text-sm text-emerald-900 leading-relaxed">
                  ${q.explanation}
                </p>
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
                  <div class="text-xs font-black text-emerald-700 flex items-center gap-1.5">
                    <span>🚂💨</span>
                    <span>
                      ${rw.advanceSteps === 2 ? '🔥 3連勝スチームブースト発動！一気に2駅前進しました！' : '安全確認完了！次の駅へ1駅前進しました！'}
                    </span>
                  </div>
                  <button type="button" id="btn-railway-next" class="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer">
                    <span>次の駅へ出発進行！</span>
                    <span>🚂💨</span>
                  </button>
                </div>
              </div>
            ` : `
              <!-- 不正解（間違えるたびに戻る！）フィードバック -->
              <div class="bg-rose-50 border-2 border-rose-300 p-5 rounded-2xl space-y-3">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2 text-rose-800 font-black text-base sm:text-lg">
                    <span>⚠️</span>
                    <span>残念！不正解…</span>
                  </div>
                  <span class="text-xs font-black px-2.5 py-1 rounded-full bg-rose-600 text-white">
                    チケット -1 🎫
                  </span>
                </div>

                <div class="text-xs sm:text-sm text-rose-900 leading-relaxed">
                  正解は: <strong class="font-black text-rose-950 cyrillic-text">【${q.choices[q.correctIdx]}】</strong><br>
                  ${q.explanation}
                </div>

                <!-- 面白トラブル事件バナー -->
                ${rw.incident ? `
                  <div class="bg-white/80 p-3.5 rounded-xl border border-rose-200 flex items-start gap-3">
                    <span class="text-2xl">${rw.incident.icon}</span>
                    <div class="space-y-0.5">
                      <div class="text-xs font-black text-rose-950">${rw.incident.title}</div>
                      <div class="text-[11px] text-rose-800 leading-snug">${rw.incident.desc}</div>
                    </div>
                  </div>
                ` : ''}

                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
                  <div class="text-xs font-black text-rose-700 flex items-center gap-1.5">
                    <span>🔙</span>
                    <span>
                      ${rw.retreatSteps > 0 ? `【緊急バック】手前の第 ${rw.stationIdx + 1} 駅（${railwayStations[rw.stationIdx].nameJa}）へ1駅後退しました！` : '始発駅のためこれ以上は後退しません。次こそ安全運行を！'}
                    </span>
                  </div>
                  <button type="button" id="btn-railway-next" class="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white font-black shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer">
                    <span>手前の駅へ緊急退避</span>
                    <span>⚠️</span>
                  </button>
                </div>
              </div>
            `}
          </div>
        ` : ''}
      </div>
    `;
  }

  // 🏆 全線走破ゴール画面の描画
  static renderGoalVictoryUI() {
    const rw = this.state.railway;

    return `
      <div class="bg-gradient-to-br from-amber-500 via-yellow-400 to-amber-600 p-1 rounded-3xl shadow-xl animate-fadeIn">
        <div class="bg-white p-6 sm:p-10 rounded-[22px] text-center space-y-6">
          <div class="w-20 h-20 mx-auto rounded-3xl bg-amber-100 text-amber-600 flex items-center justify-center text-4xl shadow-inner animate-bounce">
            🏆
          </div>

          <div class="space-y-2">
            <span class="text-xs font-black tracking-widest text-amber-600 uppercase bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              1,110 km 完全走破達成！
            </span>
            <h3 class="text-2xl sm:text-3xl font-black text-slate-900">
              モンゴル縦断鉄道 走破マスター！
            </h3>
            <p class="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
              北のロシア国境・スフバートル駅から、首都ウランバートルを抜け、南の中国国境・ザミンウード駅まで全1,110kmを駆け抜けました！
            </p>
          </div>

          <!-- 走破リザルトカード -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto">
            <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div class="text-[11px] font-bold text-slate-400">総走破距離</div>
              <div class="text-lg font-black text-slate-800 font-mono">1,110 km</div>
            </div>
            <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div class="text-[11px] font-bold text-slate-400">正解数</div>
              <div class="text-lg font-black text-emerald-600 font-mono">${rw.totalCorrect} 回</div>
            </div>
            <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div class="text-[11px] font-bold text-slate-400">ミス（後退）</div>
              <div class="text-lg font-black text-rose-600 font-mono">${rw.totalMistakes} 回</div>
            </div>
            <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div class="text-[11px] font-bold text-slate-400">獲得XPボーナス</div>
              <div class="text-lg font-black text-amber-600 font-mono">+300 XP</div>
            </div>
          </div>

          <!-- 全駅スタンプ手帳 -->
          <div class="p-4 bg-amber-50/50 rounded-2xl border border-amber-200 text-left space-y-2">
            <div class="text-xs font-black text-amber-900 flex items-center gap-1.5">
              <span>📖</span> 全10駅 記念スタンプ手帳コンプリート！
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
              ${railwayStations.map(st => `
                <div class="p-2 bg-white rounded-xl border border-amber-200 text-center space-y-1">
                  <div class="text-lg">${st.icon}</div>
                  <div class="text-[10px] font-bold text-slate-700 leading-tight">${st.nameJa.replace('駅', '')}</div>
                  <div class="text-[9px] font-mono text-emerald-600 font-bold">STAMP OK</div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- 再挑戦ボタン群 -->
          <div class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button type="button" id="btn-railway-restart" class="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer">
              🔄 もう一度旅に出る（始発から再挑戦）
            </button>
            <button type="button" class="tab-mode-btn w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-black transition-all active:scale-95 cursor-pointer" data-tab="map">
              🗺️ モンゴル全22地域図鑑を見る
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // ⚠️ ゲームオーバー画面の描画
  static renderGameOverUI() {
    const rw = this.state.railway;
    const st = railwayStations[rw.stationIdx];

    return `
      <div class="bg-rose-50 border-2 border-rose-300 p-6 sm:p-10 rounded-3xl text-center space-y-6 animate-fadeIn">
        <div class="w-20 h-20 mx-auto rounded-3xl bg-rose-100 text-rose-600 flex items-center justify-center text-4xl shadow-inner">
          🛑
        </div>

        <div class="space-y-2">
          <span class="text-xs font-black tracking-widest text-rose-600 uppercase bg-rose-100 px-3 py-1 rounded-full border border-rose-300">
            運行休止（ゲームオーバー）
          </span>
          <h3 class="text-2xl sm:text-3xl font-black text-slate-900">
            乗車チケットがなくなりました！
          </h3>
          <p class="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            第 ${rw.stationIdx + 1} 駅（${st.nameJa} / ${st.km} km地点）で運転ストップ！<br>
            間違えるたびに前の駅へ戻される過酷な旅路。準備を整えてリベンジしよう！
          </p>
        </div>

        <div class="flex items-center justify-center gap-4 max-w-md mx-auto p-4 bg-white rounded-2xl border border-rose-200 text-left">
          <div class="text-3xl">🎫</div>
          <div class="space-y-0.5">
            <div class="text-xs font-bold text-slate-700">最終到達記録</div>
            <div class="text-sm font-black text-rose-950">
              第 ${rw.stationIdx + 1} 駅: ${st.nameMn} (${st.km} km)
            </div>
            <div class="text-[11px] text-slate-500">
              正解数: ${rw.totalCorrect}回 ｜ 獲得スタンプ: ${rw.stamps.length}個
            </div>
          </div>
        </div>

        ${rw.totalMistakes > 0 ? `
          <div class="p-3 bg-white border border-rose-200 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-2.5 max-w-md mx-auto text-left shadow-2xs">
            <div class="text-xs text-rose-800 font-bold flex items-center gap-1.5">
              <span>🔥</span>
              <span>間違えた <strong>${rw.totalMistakes}</strong> 問を「間違いノート」に自動保存しました</span>
            </div>
            <button type="button" id="btn-goto-mistakes-from-railway" class="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs shadow-xs transition-all flex items-center gap-1 cursor-pointer shrink-0">
              <span>間違いノートで特訓</span>
              <span>→</span>
            </button>
          </div>
        ` : ''}

        <button type="button" id="btn-railway-restart" class="px-8 py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white font-black shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer">
          🔄 始発駅（スフバートル）から再挑戦する！
        </button>
      </div>
    `;
  }

  // 🗺️ モンゴル全22地域探検地図 ＆ 図鑑UI（既存マップとテスト要件を100%保持）
  static renderMapUI(currentXp) {
    const totalCount = expeditionDestinations.length;
    const unlockedCount = expeditionDestinations.filter(d => currentXp >= d.requiredXp).length;
    const progressPercent = Math.min(100, Math.round((unlockedCount / totalCount) * 100));

    const filteredDestinations = expeditionDestinations.filter(d => {
      const isUnlocked = currentXp >= d.requiredXp;
      if (this.state.currentFilter === 'unlocked') return isUnlocked;
      if (this.state.currentFilter === 'locked') return !isUnlocked;
      if (['capital', 'north', 'west', 'central', 'gobi', 'east'].includes(this.state.currentFilter)) {
        return d.zone === this.state.currentFilter;
      }
      return true;
    });

    return `
      <!-- XP進捗＆開拓ステータスバナー -->
      <div class="bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-700 text-white p-6 rounded-2xl shadow-md space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div class="flex items-center gap-2">
              <span class="text-xs font-black uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
                EXPEDITION MAP
              </span>
              <span class="text-xs font-bold text-cyan-100">
                MONGOLIA EXPEDITION MAP
              </span>
            </div>
            <h3 class="text-xl sm:text-2xl font-black mt-1">
              モンゴル全22地域・名所制覇マップ
            </h3>
            <p class="text-xs sm:text-sm text-cyan-100 mt-0.5">
              学習でXPを獲得するごとに、モンゴルの21アイマグ（県）＋首都特別市の新天地が開拓されます！
            </p>
          </div>

          <div class="bg-white/10 backdrop-blur-xs px-4 py-3 rounded-xl border border-white/20 text-center min-w-[140px]">
            <div class="text-[11px] font-bold text-cyan-100">開拓済み地域</div>
            <div class="text-2xl font-black font-mono">
              ${unlockedCount} <span class="text-xs font-normal">/ ${totalCount}</span>
            </div>
            <div class="text-[10px] text-cyan-200 mt-0.5">${progressPercent}% 開拓</div>
          </div>
        </div>

        <div class="space-y-1.5">
          <div class="flex justify-between text-xs font-bold text-cyan-100">
            <span>全土制覇進捗</span>
            <span>現在: ${currentXp.toLocaleString()} XP</span>
          </div>
          <div class="w-full bg-black/20 h-2.5 rounded-full overflow-hidden p-0.5">
            <div class="bg-gradient-to-r from-amber-300 to-yellow-400 h-full rounded-full transition-all duration-500" style="width: ${progressPercent}%"></div>
          </div>
        </div>
      </div>

      <!-- インタラクティブSVGモンゴル地図カード -->
      <div class="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-lg">🗺️</span>
            <h3 class="text-sm sm:text-base font-black text-slate-900">
              モンゴル全土インタラクティブ地図（タップで名所カード閲覧）
            </h3>
          </div>
          <span class="text-xs text-slate-500 font-bold">
            ${this.state.hoveredRegionId ? `選択中: ${expeditionDestinations.find(d => d.id === this.state.hoveredRegionId)?.nameJa || ''}` : '地域をタップして詳細解説を見る'}
          </span>
        </div>

        <div class="relative bg-slate-900 rounded-xl overflow-hidden p-2 sm:p-4 border border-slate-800">
          ${this.renderSvgMap(currentXp)}
        </div>
      </div>

      <!-- フィルタータブバー -->
        <div class="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs font-bold">
          <button type="button" data-filter="all" class="filter-tab-btn px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            this.state.currentFilter === 'all' ? 'bg-slate-800 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }">
            すべて (22)
          </button>
          <button type="button" data-filter="unlocked" class="filter-tab-btn px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            this.state.currentFilter === 'unlocked' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
          }">
            開拓済み (${unlockedCount})
          </button>
          <button type="button" data-filter="locked" class="filter-tab-btn px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            this.state.currentFilter === 'locked' ? 'bg-slate-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }">
            未開拓 (${totalCount - unlockedCount})
          </button>
          <div class="h-4 w-px bg-slate-300 mx-1"></div>
          <button type="button" data-filter="capital" class="filter-tab-btn px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            this.state.currentFilter === 'capital' ? 'bg-rose-600 text-white shadow-xs' : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
          }">
            首都特別市
          </button>
          <button type="button" data-filter="north" class="filter-tab-btn px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            this.state.currentFilter === 'north' ? 'bg-teal-600 text-white shadow-xs' : 'bg-teal-50 text-teal-800 hover:bg-teal-100'
          }">
            北部
          </button>
          <button type="button" data-filter="west" class="filter-tab-btn px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            this.state.currentFilter === 'west' ? 'bg-cyan-600 text-white shadow-xs' : 'bg-cyan-50 text-cyan-800 hover:bg-cyan-100'
          }">
            西部
          </button>
          <button type="button" data-filter="central" class="filter-tab-btn px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            this.state.currentFilter === 'central' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
          }">
            中央部
          </button>
          <button type="button" data-filter="gobi" class="filter-tab-btn px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            this.state.currentFilter === 'gobi' ? 'bg-amber-600 text-white shadow-xs' : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
          }">
            ゴビ・南部
          </button>
          <button type="button" data-filter="east" class="filter-tab-btn px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            this.state.currentFilter === 'east' ? 'bg-purple-600 text-white shadow-xs' : 'bg-purple-50 text-purple-800 hover:bg-purple-100'
          }">
            東部
          </button>
        </div>

        <!-- 地域カード一覧グリッド -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          ${filteredDestinations.map((dest, i) => {
            const isUnlocked = currentXp >= dest.requiredXp;
            const remainingXp = Math.max(0, dest.requiredXp - currentXp);

            return `
              <div class="dest-card rounded-2xl p-4 sm:p-5 border-2 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between hover:scale-[1.01] shadow-2xs ${
                isUnlocked 
                  ? 'bg-white border-emerald-300 hover:border-emerald-500 hover:shadow-md' 
                  : 'bg-slate-50 border-slate-200 hover:border-slate-300 opacity-85'
              }" data-id="${dest.id}">
                <div>
                  <div class="flex items-center justify-between mb-2.5">
                    <div class="flex items-center gap-2">
                      <span class="text-3xl p-1 rounded-xl shadow-2xs" style="background-color: ${isUnlocked ? dest.color + '22' : '#f1f5f9'};">
                        ${dest.badgeIcon}
                      </span>
                      <div>
                        <span class="text-[10px] font-black px-2 py-0.5 rounded-full ${
                          isUnlocked 
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                            : 'bg-slate-200 text-slate-600'
                        }">
                          ${isUnlocked ? '開拓済み 🚩' : `あと ${remainingXp} XP 🔒`}
                        </span>
                        <div class="text-[10px] text-slate-400 font-bold">${dest.zoneJa}</div>
                      </div>
                    </div>
                    <span class="text-[11px] font-mono font-bold text-slate-400">#${i + 1}</span>
                  </div>

                  <div class="space-y-0.5">
                    <h4 class="text-base font-black text-slate-900 cyrillic-text flex items-center gap-1.5">
                      <span>${dest.nameMn}</span>
                    </h4>
                    <div class="text-xs font-bold text-slate-700">
                      ${dest.nameJa}
                    </div>
                    <div class="text-[11px] text-slate-500">
                      県都: <strong>${dest.capitalMn} (${dest.capitalJa})</strong>
                    </div>
                  </div>

                  <p class="text-xs text-slate-600 mt-2 leading-relaxed line-clamp-2">
                    ${dest.description}
                  </p>
                </div>

                <div class="mt-4 pt-3 border-t ${isUnlocked ? 'border-emerald-100 text-emerald-700' : 'border-slate-200 text-slate-500'} flex items-center justify-between text-xs font-bold">
                  <span>${isUnlocked ? '記念カード・解説を見る 📸' : '詳細解説を見る 📖'}</span>
                  <span>→</span>
                </div>
              </div>
            `;
          }).join('')}
        </div>

      <!-- 名所記念カード・解説モーダル（選択時） -->
      ${this.state.selectedDestination ? this.renderModalHTML(this.state.selectedDestination) : ''}
    `;
  }

  // SVG地図のHTML生成
  static renderSvgMap(currentXp) {
    return `
      <svg viewBox="0 0 960 520" class="w-full h-auto max-h-[500px] select-none font-sans" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="map-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <!-- 背景デコレーション（山脈・方位記号） -->
        <g opacity="0.3">
          <!-- コンパス方位記号 -->
          <g transform="translate(870, 70)">
            <circle cx="0" cy="0" r="28" fill="none" stroke="#64748b" stroke-width="1.5" stroke-dasharray="3,3" />
            <path d="M 0 -24 L 6 0 L 0 -6 L -6 0 Z" fill="#059669" />
            <path d="M 0 24 L 6 0 L 0 6 L -6 0 Z" fill="#64748b" />
            <text x="0" y="-30" font-size="11" font-weight="bold" fill="#059669" text-anchor="middle">N</text>
            <text x="32" y="4" font-size="9" font-weight="bold" fill="#64748b" text-anchor="start">E</text>
            <text x="0" y="38" font-size="9" font-weight="bold" fill="#64748b" text-anchor="middle">S</text>
            <text x="-32" y="4" font-size="9" font-weight="bold" fill="#64748b" text-anchor="end">W</text>
          </g>
          <!-- モンゴル国境輪郭装飾 -->
          <text x="50" y="480" font-size="12" font-weight="bold" fill="#64748b" letter-spacing="2">MONGOLIA EXPEDITION MAP</text>
          <text x="50" y="496" font-size="10" fill="#94a3b8">21 Aimags & Capital Municipality</text>
        </g>

        <!-- 22地域のポリゴンとラベル描画 -->
        ${expeditionDestinations.map(dest => {
          const isUnlocked = currentXp >= dest.requiredXp;
          const pointsStr = dest.polygonPoints.map(pt => pt.join(',')).join(' ');
          const cx = dest.center.x;
          const cy = dest.center.y;
          const shortName = dest.nameMn.replace(' аймаг', '').replace(' хот', '');

          const fillColor = isUnlocked ? dest.color : '#cbd5e1';
          const fillOpacity = isUnlocked ? '0.88' : '0.45';
          const strokeColor = isUnlocked ? '#ffffff' : '#94a3b8';
          const strokeWidth = isUnlocked ? '2.5' : '1.5';
          const strokeDash = isUnlocked ? 'none' : '4,3';

          return `
            <g class="svg-region-group cursor-pointer group" data-region-id="${dest.id}">
              <!-- 地域ポリゴン -->
              <polygon 
                points="${pointsStr}" 
                fill="${fillColor}" 
                fill-opacity="${fillOpacity}" 
                stroke="${strokeColor}" 
                stroke-width="${strokeWidth}" 
                stroke-dasharray="${strokeDash}" 
                stroke-linejoin="round"
                class="transition-all duration-300 group-hover:brightness-110 group-hover:stroke-amber-400 group-hover:stroke-[3.5]"
              />

              <!-- 地域バッジピン（中心点） -->
              <g transform="translate(${cx}, ${cy})">
                <!-- ピン背景円 -->
                <circle 
                  cx="0" 
                  cy="0" 
                  r="${dest.id === 'ulaanbaatar' ? 14 : 12}" 
                  fill="${isUnlocked ? '#ffffff' : '#f1f5f9'}" 
                  stroke="${isUnlocked ? dest.color : '#94a3b8'}" 
                  stroke-width="${isUnlocked ? '2' : '1.5'}" 
                  filter="drop-shadow(0px 2px 3px rgba(0,0,0,0.25))"
                  class="transition-transform group-hover:scale-125"
                />

                <!-- アイコン (未開拓時は鍵アイコン) -->
                <text 
                  x="0" 
                  y="${dest.id === 'ulaanbaatar' ? 4 : 4}" 
                  font-size="${dest.id === 'ulaanbaatar' ? 13 : 11}" 
                  text-anchor="middle"
                  class="pointer-events-none select-none"
                >
                  ${isUnlocked ? dest.badgeIcon : '🔒'}
                </text>

                <!-- 地名ラベル（キリル文字） -->
                <text 
                  x="0" 
                  y="${dest.id === 'ulaanbaatar' ? -18 : (dest.id === 'tov' ? 22 : -16)}" 
                  font-size="${dest.id === 'ulaanbaatar' ? 11 : 9.5}" 
                  font-weight="bold" 
                  fill="${isUnlocked ? '#0f172a' : '#475569'}" 
                  text-anchor="middle"
                  stroke="#ffffff"
                  stroke-width="3"
                  paint-order="stroke fill"
                  class="pointer-events-none select-none transition-all group-hover:fill-amber-600"
                >
                  ${shortName}
                </text>
              </g>
            </g>
          `;
        }).join('')}
      </svg>
    `;
  }

  // イベントバインド
  static bindEvents() {
    // ホームへ戻る
    const backBtn = this.container.querySelector('#btn-back-home');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        if (this.onNavigate) this.onNavigate('home');
      });
    }

    // フィルターボタン
    this.container.querySelectorAll('.filter-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.state.currentFilter = btn.getAttribute('data-filter');
        this.render(this.container, this.onNavigate);
      });
    });

    // カードクリックで解説を開く
    this.container.querySelectorAll('.dest-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.dataset.id;
        this.openRegionModal(id);
      });
    });

    // SVG地図の地域クリックで解説を開く
    this.container.querySelectorAll('.svg-region-group').forEach(group => {
      const id = group.getAttribute('data-region-id');
      const dest = expeditionDestinations.find(d => d.id === id);

      group.addEventListener('click', () => {
        this.openRegionModal(id);
      });

      // ツールチップ表示
      group.addEventListener('mouseenter', (e) => {
        const tooltip = this.container.querySelector('#map-tooltip');
        if (tooltip && dest) {
          const profile = GamificationService.getProfile();
          const isUnlocked = profile.totalXp >= dest.requiredXp;
          tooltip.innerHTML = `
            <div class="font-bold flex items-center gap-1.5">
              <span>${dest.badgeIcon}</span>
              <span>${dest.nameMn}</span>
              <span class="text-[10px] text-amber-300">(${dest.nameJa})</span>
            </div>
            <div class="text-[10px] text-slate-300 mt-0.5">
              県都: ${dest.capitalMn} | ${isUnlocked ? '🚩 開拓済み' : `🔒 あと ${Math.max(0, dest.requiredXp - profile.totalXp)} XP`}
            </div>
            <div class="text-[9px] text-sky-200 mt-0.5">タップで詳細解説を表示 →</div>
          `;
          tooltip.classList.remove('hidden');
        }
      });

      group.addEventListener('mousemove', (e) => {
        const tooltip = this.container.querySelector('#map-tooltip');
        if (tooltip) {
          const rect = this.container.getBoundingClientRect();
          tooltip.style.left = `${e.clientX - rect.left + 12}px`;
          tooltip.style.top = `${e.clientY - rect.top + 12}px`;
        }
      });

      group.addEventListener('mouseleave', () => {
        const tooltip = this.container.querySelector('#map-tooltip');
        if (tooltip) tooltip.classList.add('hidden');
      });
    });

    // モーダルクローズ
    const closeBtn = this.container.querySelector('#btn-close-exp-modal');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.state.selectedDestination = null;
        this.render(this.container, this.onNavigate);
      });
    }

    // 音声再生
    const modalSpeakBtn = this.container.querySelector('#btn-exp-speak');
    if (modalSpeakBtn && this.state.selectedDestination) {
      modalSpeakBtn.addEventListener('click', () => {
        SpeechService.speak(this.state.selectedDestination.nameMn);
      });
    }
  }
  static openRegionModal(id) {
    const dest = expeditionDestinations.find(d => d.id === id);
    if (dest) {
      this.state.selectedDestination = dest;
      SoundEffects.playCorrect();
      this.render(this.container, this.onNavigate);
    }
  }

  // 詳細解説モーダルのHTML生成
  static renderModalHTML(dest) {
    const profile = GamificationService.getProfile();
    const isUnlocked = profile.totalXp >= dest.requiredXp;
    const remainingXp = Math.max(0, dest.requiredXp - profile.totalXp);

    return `
      <div class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fade-in" id="expedition-modal-overlay">
        <div class="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[92vh]">
          
          <!-- カード上部バナー -->
          <div class="bg-gradient-to-r ${dest.postcardColor} p-5 sm:p-6 text-white text-center relative flex-shrink-0">
            <button type="button" id="btn-close-exp-modal" class="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center text-sm font-bold transition-all cursor-pointer">
              ✕
            </button>
            <div class="text-4xl sm:text-5xl mb-1.5 filter drop-shadow-md">${dest.badgeIcon}</div>
            <div class="text-[10px] font-bold text-white/80 font-mono tracking-wider">MONGOLIA EXPEDITION POSTCARD</div>
            <h3 class="text-xl sm:text-2xl font-black cyrillic-text mt-0.5 leading-tight">${dest.nameMn}</h3>
            <div class="text-xs text-white/95 font-medium mt-0.5">${dest.nameJa}</div>
            <div class="mt-2 inline-flex items-center gap-1.5 bg-black/20 px-3 py-0.5 rounded-full text-[11px] font-bold">
              <span>📍 県都: ${dest.capitalMn} (${dest.capitalJa})</span>
              <span>•</span>
              <span>${dest.zoneJa}</span>
            </div>
          </div>

          <!-- カード詳細本文 -->
          <div class="p-5 sm:p-6 space-y-4 overflow-y-auto">
            
            <!-- ステータス ＆ 発音ボタン -->
            <div class="flex items-center justify-between border-b border-slate-100 pb-3 gap-2">
              <span class="text-xs font-bold ${isUnlocked ? 'text-emerald-700 bg-emerald-50 border border-emerald-200' : 'text-slate-600 bg-slate-100 border border-slate-200'} px-2.5 py-1 rounded-full flex items-center gap-1">
                ${isUnlocked ? '🚩 開拓済み（バッジ獲得）' : `🔒 未到達（あと ${remainingXp} XP）`}
              </span>
              <button type="button" id="btn-exp-speak" class="px-3 py-1 bg-sky-50 hover:bg-sky-100 text-sky-800 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-sky-200 transition-all cursor-pointer shadow-2xs">
                <span>🔊</span> 発音を聞く
              </button>
            </div>

            <!-- 解説文 -->
            <div class="space-y-1.5">
              <h5 class="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <span>📜</span> 歴史と自然の解説
              </h5>
              <p class="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
                ${dest.description}
              </p>
            </div>

            <!-- 見どころ ＆ 特産品 -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <!-- 見どころ -->
              <div class="bg-sky-50/70 p-3 rounded-2xl border border-sky-200/80 space-y-1.5">
                <div class="text-xs font-bold text-sky-900 flex items-center gap-1">
                  <span>🏞️</span> 主な見どころ・名所:
                </div>
                <ul class="text-[11px] text-slate-700 space-y-1">
                  ${dest.attractions ? dest.attractions.map(a => `<li class="flex items-start gap-1"><span class="text-sky-500">•</span><span>${a}</span></li>`).join('') : ''}
                </ul>
              </div>

              <!-- 特産品 -->
              <div class="bg-emerald-50/70 p-3 rounded-2xl border border-emerald-200/80 space-y-1.5">
                <div class="text-xs font-bold text-emerald-900 flex items-center gap-1">
                  <span>🎁</span> 特産品・名物・文化:
                </div>
                <ul class="text-[11px] text-slate-700 space-y-1">
                  ${dest.specialties ? dest.specialties.map(s => `<li class="flex items-start gap-1"><span class="text-emerald-500">•</span><span>${s}</span></li>`).join('') : ''}
                </ul>
              </div>
            </div>

            <!-- 探検隊の豆知識（Fun Fact） -->
            <div class="bg-amber-50 p-3.5 rounded-2xl border border-amber-200 text-xs text-amber-950 space-y-1">
              <div class="font-bold flex items-center gap-1.5 text-amber-900">
                <span>💡</span> 探検隊の豆知識（Fun Fact）：
              </div>
              <p class="leading-relaxed text-[11px] sm:text-xs">
                ${dest.funFact}
              </p>
            </div>

            <!-- 獲得記念品 -->
            <div class="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <div class="text-[10px] font-bold text-slate-400">探検記念品（お土産）</div>
                <div class="text-xs font-black text-slate-800">${dest.souvenir}</div>
              </div>
              <div class="text-right">
                <div class="text-[10px] font-bold text-slate-400">必要XP</div>
                <div class="text-xs font-mono font-bold text-emerald-700">${dest.requiredXp} XP</div>
              </div>
            </div>

          </div>

          <!-- モーダルフッター -->
          <div class="p-3 bg-slate-50 border-t border-slate-100 text-center">
            <button type="button" onclick="document.getElementById('btn-close-exp-modal').click()" class="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-all cursor-pointer">
              探検マップに戻る
            </button>
          </div>

        </div>
      </div>
    `;
  }

  // イベントリスナーのバインド
  static bindEvents() {
    if (!this.container) return;

    // タブ切替（鉄道すごろく ⇔ 地図図鑑）
    this.container.querySelectorAll('.tab-mode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        if (tab && tab !== this.state.activeTab) {
          this.state.activeTab = tab;
          this.render(this.container, this.onNavigate);
        }
      });
    });

    // 鉄道すごろく: 選択肢タップ
    this.container.querySelectorAll('.btn-railway-choice').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.choiceIdx, 10);
        this.handleRailwayAnswer(idx);
      });
    });

    // 鉄道すごろく: 次の駅へ進む / 緊急退避ボタン
    const nextBtn = this.container.querySelector('#btn-railway-next');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        this.nextRailwayTurn();
      });
    }

    // 鉄道すごろく: 再挑戦・リスタート
    const gotoMistakesBtn = this.container.querySelector('#btn-goto-mistakes-from-railway');
    if (gotoMistakesBtn) {
      gotoMistakesBtn.addEventListener('click', () => {
        if (this.onNavigate) {
          if (typeof ReviewNotebookComponent !== 'undefined') {
            ReviewNotebookComponent.state.view = 'list';
            ReviewNotebookComponent.state.filterType = 'all';
          }
          this.onNavigate('review');
        }
      });
    }

    const restartBtn = this.container.querySelector('#btn-railway-restart');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        this.initRailwayGame(true);
        this.render(this.container, this.onNavigate);
      });
    }

    // 音声再生ボタン
    this.container.querySelectorAll('.btn-play-audio').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const text = btn.dataset.text;
        if (text) {
          SpeechService.speak(text);
        }
      });
    });

    // 地図フィルターボタン
    this.container.querySelectorAll('.filter-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.state.currentFilter = btn.getAttribute('data-filter');
        this.render(this.container, this.onNavigate);
      });
    });

    // 地域カードクリック ➔ モーダル展開
    this.container.querySelectorAll('.dest-card').forEach(card => {
      card.addEventListener('click', () => {
        const regionId = card.getAttribute('data-id');
        const dest = expeditionDestinations.find(d => d.id === regionId);
        if (dest) {
          this.openRegionModal(dest);
        }
      });
    });

    // SVGマップ上の地域グループクリック
    this.container.querySelectorAll('.svg-region-group').forEach(group => {
      group.addEventListener('click', () => {
        const regionId = group.dataset.regionId;
        const dest = expeditionDestinations.find(d => d.id === regionId);
        if (dest) {
          this.openRegionModal(dest);
        }
      });

      group.addEventListener('mouseenter', () => {
        this.state.hoveredRegionId = group.dataset.regionId;
        group.classList.add('opacity-80', 'filter', 'drop-shadow-lg');
      });

      group.addEventListener('mouseleave', () => {
        this.state.hoveredRegionId = null;
        group.classList.remove('opacity-80', 'filter', 'drop-shadow-lg');
      });
    });

    // モーダル閉じるボタン
    const modalCloseBtn = this.container.querySelector('#btn-close-modal');
    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', () => {
        this.state.selectedDestination = null;
        this.render(this.container, this.onNavigate);
      });
    }

    const modalBackdrop = this.container.querySelector('#modal-backdrop');
    if (modalBackdrop) {
      modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) {
          this.state.selectedDestination = null;
          this.render(this.container, this.onNavigate);
        }
      });
    }
  }
}
