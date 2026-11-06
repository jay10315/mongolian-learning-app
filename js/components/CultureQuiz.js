// モンゴル文化・ことわざ（Зүйр үг）＆ 伝統なぞなぞ（Оньсого）コンポーネント
import { cultureData } from '../data/cultureData.js';
import { SpeechService } from '../services/speech.js';
import { SoundEffects } from '../utils/helpers.js';
import { GamificationService } from '../services/gamification.js';

export class CultureComponent {
  static state = {
    tab: 'proverbs', // 'proverbs' | 'riddles'
    currentRiddleIndex: 0,
    selectedRiddleAnswer: null,
    riddleScore: 0
  };

  static render(container, onNavigate) {
    this.container = container;
    this.onNavigate = onNavigate;

    this.container.innerHTML = `
      <div class="animate-fade-in max-w-3xl mx-auto px-4 py-4 space-y-5">
        <!-- ヘッダー -->
        <div class="flex items-center justify-between border-b border-slate-200 pb-3">
          <div class="flex items-center gap-2.5">
            <span class="text-2xl p-2 rounded-xl bg-gradient-to-tr from-amber-600 to-yellow-500 text-white shadow-xs">🐴</span>
            <div>
              <h2 class="text-lg font-bold text-slate-800">モンゴルのことわざ ＆ 伝統なぞなぞ</h2>
              <p class="text-xs text-slate-500">遊牧民の知恵・自然観・比喩表現を学ぶカルチャーモード</p>
            </div>
          </div>
          <button type="button" id="btn-back-home" class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all">
            ✕ ホームへ
          </button>
        </div>

        <!-- タブ切り替え -->
        <div class="flex gap-2 border-b border-slate-200 pb-2">
          <button type="button" class="btn-culture-tab px-4 py-2 rounded-xl text-xs font-black transition-all ${
            this.state.tab === 'proverbs' ? 'bg-amber-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }" data-tab="proverbs">
            📜 ことわざ（Зүйр үг）一覧 ＆ 音声
          </button>
          <button type="button" class="btn-culture-tab px-4 py-2 rounded-xl text-xs font-black transition-all ${
            this.state.tab === 'riddles' ? 'bg-amber-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }" data-tab="riddles">
            🧩 伝統なぞなぞ（Оньсого）クイズ
          </button>
        </div>

        ${this.state.tab === 'proverbs' ? this.renderProverbsHTML() : this.renderRiddlesHTML()}
      </div>
    `;

    // イベントリスナー
    this.container.querySelector('#btn-back-home').addEventListener('click', () => {
      if (this.onNavigate) this.onNavigate('home');
    });

    this.container.querySelectorAll('.btn-culture-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        this.state.tab = btn.dataset.tab;
        this.render(this.container, this.onNavigate);
      });
    });

    // ことわざ音声再生
    this.container.querySelectorAll('.btn-prov-audio').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        SpeechService.speak(btn.dataset.text);
      });
    });

    // なぞなぞ回答
    this.container.querySelectorAll('.btn-riddle-opt').forEach(btn => {
      btn.addEventListener('click', () => {
        const val = btn.dataset.val;
        const currentRiddle = cultureData.riddles[this.state.currentRiddleIndex];
        const isOk = val === currentRiddle.answer;
        this.state.selectedRiddleAnswer = val;
        if (isOk) {
          this.state.riddleScore++;
          SoundEffects.playCorrect();
          GamificationService.addXp(10);
        } else {
          SoundEffects.playWrong();
        }
        this.render(this.container, this.onNavigate);
      });
    });

    const nextRiddleBtn = this.container.querySelector('#btn-next-riddle');
    if (nextRiddleBtn) {
      nextRiddleBtn.addEventListener('click', () => {
        this.state.currentRiddleIndex = (this.state.currentRiddleIndex + 1) % cultureData.riddles.length;
        this.state.selectedRiddleAnswer = null;
        this.render(this.container, this.onNavigate);
      });
    }
  }

  static renderProverbsHTML() {
    return `
      <div class="space-y-4">
        <div class="bg-amber-50 p-3.5 rounded-xl border border-amber-200 text-xs text-amber-950">
          💡 モンゴル人は会話の中でことわざ（Зүйр үг）を巧みに引用して物事を例えるのが大好きです。知っておくと会話が何倍も盛り上がります！
        </div>

        <div class="grid grid-cols-1 gap-3.5">
          ${cultureData.proverbs.map(p => `
            <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
              <div class="flex items-start justify-between gap-3">
                <div class="space-y-1">
                  <div class="text-base sm:text-lg font-black text-slate-900 cyrillic-text">
                    ${p.mongolian}
                  </div>
                  <div class="text-[11px] text-slate-400 font-medium">
                    ${p.pronunciation}
                  </div>
                </div>
                <button type="button" class="btn-prov-audio text-xs px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg border border-amber-200 font-bold shrink-0 flex items-center gap-1 shadow-2xs" data-text="${p.mongolian}">
                  <span>🔊</span> 発音
                </button>
              </div>

              <div class="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1 text-xs">
                <div class="text-slate-700">
                  <strong class="text-amber-800">直訳：</strong> ${p.literalJa}
                </div>
                <div class="text-slate-900 font-bold">
                  <strong class="text-emerald-700">日本語の相当句：</strong> ${p.japaneseMeaning}
                </div>
              </div>

              <p class="text-[11px] text-slate-500 leading-relaxed bg-amber-50/40 p-2.5 rounded-lg border border-amber-100">
                📌 <strong>文化的背景：</strong> ${p.culturalContext}
              </p>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  static renderRiddlesHTML() {
    const idx = this.state.currentRiddleIndex;
    const r = cultureData.riddles[idx];
    const total = cultureData.riddles.length;

    return `
      <div class="space-y-4">
        <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4 text-center">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              なぞなぞ ${idx + 1} / ${total}
            </span>
            <span class="text-xs font-bold text-slate-400">
              スコア: ${this.state.riddleScore} 点
            </span>
          </div>

          <!-- なぞなぞの詩 -->
          <div class="space-y-1.5 py-2">
            <div class="text-lg sm:text-xl font-black text-slate-900 cyrillic-text">
              ${r.riddleMn}
            </div>
            <div class="text-sm font-bold text-amber-900">
              「${r.riddleJa}」
            </div>
          </div>

          <!-- 4択選択肢 -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
            ${r.options.map(opt => {
              let style = 'bg-white border-slate-200 hover:border-amber-500 text-slate-900';
              if (this.state.selectedRiddleAnswer) {
                if (opt === r.answer) {
                  style = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-black ring-2 ring-emerald-300';
                } else if (opt === this.state.selectedRiddleAnswer) {
                  style = 'bg-rose-50 border-rose-400 text-rose-900';
                } else {
                  style = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                }
              }
              return `
                <button type="button" class="btn-riddle-opt p-3.5 rounded-xl border text-xs sm:text-sm font-bold transition-all ${style}" data-val="${opt}" ${this.state.selectedRiddleAnswer ? 'disabled' : ''}>
                  ${opt}
                </button>
              `;
            }).join('')}
          </div>

          <!-- 回答後解説 -->
          ${this.state.selectedRiddleAnswer ? `
            <div class="bg-amber-50/80 p-4 rounded-xl border border-amber-200 text-left space-y-2 mt-3 animate-fade-in">
              <div class="font-bold text-xs text-amber-900 flex items-center gap-1.5">
                <span>💡</span> 遊牧民のなぞなぞ解説：
              </div>
              <p class="text-xs text-slate-700 leading-relaxed">
                ${r.explanation}
              </p>
              <button type="button" id="btn-next-riddle" class="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs shadow-xs transition-all mt-2">
                次のなぞなぞへ →
              </button>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }
}
