// 日常会話・旅行ロールプレイ対話コンポーネント
import { roleplayScenarios } from '../data/roleplayData.js';
import { SpeechService } from '../services/speech.js';
import { SoundEffects } from '../utils/helpers.js';
import { GamificationService } from '../services/gamification.js';

export class RoleplayComponent {
  static state = {
    view: 'select', // 'select' | 'dialogue' | 'result'
    currentScenario: null,
    currentStepIndex: 0,
    selectedOption: null,
    score: 0,
    history: []
  };

  static render(container, onNavigate) {
    this.container = container;
    this.onNavigate = onNavigate;

    if (this.state.view === 'select') {
      this.renderSelect();
    } else if (this.state.view === 'dialogue') {
      this.renderDialogue();
    } else if (this.state.view === 'result') {
      this.renderResult();
    }
  }

  // 1. シナリオ選択画面
  static renderSelect() {
    this.container.innerHTML = `
      <div class="animate-fade-in max-w-3xl mx-auto px-4 py-4 space-y-5">
        <div class="flex items-center justify-between border-b border-slate-200 pb-3">
          <div class="flex items-center gap-2.5">
            <span class="text-2xl p-2 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-xs">🏕️</span>
            <div>
              <h2 class="text-lg font-bold text-slate-800">日常会話・旅行ロールプレイ</h2>
              <p class="text-xs text-slate-500">リアルな場面を想定したモンゴル語対話シミュレーション</p>
            </div>
          </div>
          <button type="button" id="btn-back-home" class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all">
            ✕ ホームへ
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          ${roleplayScenarios.map(sc => `
            <div class="scenario-card bg-white rounded-2xl p-5 border border-slate-200 hover:border-amber-500 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between" data-id="${sc.id}">
              <div>
                <div class="flex items-center justify-between mb-3">
                  <span class="text-3xl">${sc.icon}</span>
                  <span class="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                    全${sc.steps.length}ラリー
                  </span>
                </div>
                <h3 class="text-base font-extrabold text-slate-900 group-hover:text-amber-700 transition-colors">
                  ${sc.title}
                </h3>
                <p class="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  ${sc.description}
                </p>
              </div>
              <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-700">
                <span>会話を始める</span>
                <span class="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    this.container.querySelector('#btn-back-home').addEventListener('click', () => {
      if (this.onNavigate) this.onNavigate('home');
    });

    this.container.querySelectorAll('.scenario-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.dataset.id;
        const sc = roleplayScenarios.find(s => s.id === id);
        if (sc) this.startScenario(sc);
      });
    });
  }

  static startScenario(sc) {
    this.state.currentScenario = sc;
    this.state.currentStepIndex = 0;
    this.state.selectedOption = null;
    this.state.score = 0;
    this.state.history = [];
    this.state.view = 'dialogue';
    this.renderDialogue();
  }

  // 2. 対話実行画面
  static renderDialogue() {
    const sc = this.state.currentScenario;
    const step = sc.steps[this.state.currentStepIndex];
    const total = sc.steps.length;
    const progress = Math.round(((this.state.currentStepIndex + 1) / total) * 100);

    this.container.innerHTML = `
      <div class="animate-fade-in max-w-2xl mx-auto px-4 py-4 space-y-4">
        <!-- ヘッダー -->
        <div class="flex items-center justify-between border-b border-slate-200 pb-2.5">
          <div class="flex items-center gap-2">
            <span class="text-xl">${sc.icon}</span>
            <span class="font-bold text-sm text-slate-800">${sc.title}</span>
            <span class="text-xs text-slate-400">(${this.state.currentStepIndex + 1}/${total})</span>
          </div>
          <button type="button" id="btn-quit-dialogue" class="text-xs text-slate-500 hover:text-slate-800">
            中断する ✕
          </button>
        </div>

        <!-- プログレスバー -->
        <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div class="bg-amber-500 h-full transition-all duration-300" style="width: ${progress}%"></div>
        </div>

        <!-- 場面説明 -->
        <div class="bg-amber-50/80 p-3 rounded-xl border border-amber-200 text-xs text-amber-950 flex items-center gap-2">
          <span>🎬</span>
          <span>${sc.initialPrompt}</span>
        </div>

        <!-- 相手の発言（吹き出し） -->
        <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-2">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-2xl">${sc.character.avatar}</span>
              <span class="font-bold text-xs text-slate-700">${sc.character.name}</span>
            </div>
            <button type="button" id="btn-play-npc" class="text-xs px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold rounded-lg border border-amber-200 flex items-center gap-1">
              <span>🔊</span> 発音を聞く
            </button>
          </div>
          <div class="text-base sm:text-lg font-black text-slate-900 cyrillic-text pt-1">
            ${step.npcText}
          </div>
          <div class="text-xs text-slate-500">
            ${step.npcMeaning}
          </div>
        </div>

        <!-- 選択肢リスト（未回答時） または フィードバック（回答後） -->
        ${!this.state.selectedOption ? `
          <div class="space-y-2.5">
            <div class="text-xs font-bold text-slate-600 flex items-center gap-1">
              <span>💬</span> あなたの返答を選んでください：
            </div>
            ${step.options.map((opt, idx) => `
              <button type="button" class="btn-roleplay-choice w-full text-left p-3.5 rounded-xl border border-slate-200 hover:border-amber-500 hover:bg-amber-50/40 bg-white transition-all space-y-1 group" data-idx="${idx}">
                <div class="font-bold text-sm text-slate-900 cyrillic-text group-hover:text-amber-800">
                  ${opt.text}
                </div>
                <div class="text-xs text-slate-500">
                  ${opt.meaning}
                </div>
              </button>
            `).join('')}
          </div>
        ` : `
          <!-- 回答後フィードバック -->
          <div class="bg-white rounded-2xl p-4 border-2 ${this.state.selectedOption.isBest ? 'border-emerald-400 bg-emerald-50/20' : 'border-amber-400 bg-amber-50/20'} shadow-xs space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs font-black px-2.5 py-0.5 rounded-full ${this.state.selectedOption.isBest ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white'}">
                ${this.state.selectedOption.isBest ? '💮 最高の返答！ (+10点)' : '💡 アドバイス (+7点)'}
              </span>
              <button type="button" id="btn-play-user-choice" class="text-xs px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-lg border border-slate-200 flex items-center gap-1">
                <span>🔊</span> 自分の返答を聞く
              </button>
            </div>
            <div class="font-bold text-sm text-slate-900 cyrillic-text">
              あなた：「${this.state.selectedOption.text}」
            </div>
            <p class="text-xs text-slate-700 leading-relaxed bg-white/80 p-2.5 rounded-lg border border-slate-200">
              ${this.state.selectedOption.feedback}
            </p>
            <button type="button" id="btn-next-step" class="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs shadow-xs transition-all flex items-center justify-center gap-1">
              <span>次の会話へ</span> <span>→</span>
            </button>
          </div>
        `}
      </div>
    `;

    // イベントリスナー
    this.container.querySelector('#btn-quit-dialogue').addEventListener('click', () => {
      this.state.view = 'select';
      this.renderSelect();
    });

    const playNpcBtn = this.container.querySelector('#btn-play-npc');
    if (playNpcBtn) {
      playNpcBtn.addEventListener('click', () => {
        SpeechService.speak(step.npcText);
      });
    }

    if (!this.state.selectedOption) {
      this.container.querySelectorAll('.btn-roleplay-choice').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.dataset.idx, 10);
          const opt = step.options[idx];
          this.state.selectedOption = opt;
          this.state.score += opt.score;
          if (opt.isBest) {
            SoundEffects.playCorrect();
          } else {
            SoundEffects.playWrong();
          }
          this.renderDialogue();
        });
      });
    } else {
      const playUserBtn = this.container.querySelector('#btn-play-user-choice');
      if (playUserBtn) {
        playUserBtn.addEventListener('click', () => {
          SpeechService.speak(this.state.selectedOption.text);
        });
      }

      this.container.querySelector('#btn-next-step').addEventListener('click', () => {
        if (this.state.currentStepIndex + 1 < sc.steps.length) {
          this.state.currentStepIndex++;
          this.state.selectedOption = null;
          this.renderDialogue();
        } else {
          // 終了
          GamificationService.addXp(this.state.score * 2);
          SoundEffects.playLevelUp();
          this.state.view = 'result';
          this.renderResult();
        }
      });
    }
  }

  // 3. 結果画面
  static renderResult() {
    const sc = this.state.currentScenario;
    const maxScore = sc.steps.length * 10;
    const percent = Math.round((this.state.score / maxScore) * 100);

    this.container.innerHTML = `
      <div class="animate-fade-in max-w-md mx-auto px-4 py-8 text-center space-y-5">
        <div class="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center text-4xl shadow-lg">
          🎉
        </div>

        <div class="space-y-1">
          <h2 class="text-xl font-black text-slate-900">${sc.title} 完了！</h2>
          <p class="text-xs text-slate-500">対話シミュレーションのスコア結果</p>
        </div>

        <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
          <div class="text-3xl font-black text-amber-600">
            ${this.state.score} <span class="text-sm font-normal text-slate-400">/ ${maxScore} 点</span>
          </div>
          <div class="text-xs font-bold text-slate-700">
            ${percent >= 90 ? '🌟 会話マスター！遊牧民ともすぐに仲良くなれます！' : percent >= 70 ? '👍 意思疎通バッチリ！堂々と話してみましょう！' : '💪 もう一度練習して、文化に合った表現をマスターしよう！'}
          </div>
          <div class="text-[11px] text-emerald-700 bg-emerald-50 py-1 px-3 rounded-full font-bold inline-block">
            +${this.state.score * 2} XP 獲得！
          </div>
        </div>

        <div class="flex gap-2">
          <button type="button" id="btn-retry-roleplay" class="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-all">
            もう一度挑戦
          </button>
          <button type="button" id="btn-finish-roleplay" class="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs shadow-xs transition-all">
            シナリオ一覧へ
          </button>
        </div>
      </div>
    `;

    this.container.querySelector('#btn-retry-roleplay').addEventListener('click', () => {
      this.startScenario(sc);
    });

    this.container.querySelector('#btn-finish-roleplay').addEventListener('click', () => {
      this.state.view = 'select';
      this.renderSelect();
    });
  }
}
