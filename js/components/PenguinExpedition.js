// ペンギン探検隊（モンゴル名所めぐり旅・コレクション）コンポーネント
import { expeditionDestinations } from '../data/expeditionData.js';
import { GamificationService } from '../services/gamification.js';
import { SpeechService } from '../services/speech.js';
import { PenguinMascot } from './PenguinMascot.js';
import { SoundEffects } from '../utils/helpers.js';

export class PenguinExpeditionComponent {
  static state = {
    selectedDestination: null
  };

  static render(container, onNavigate) {
    this.container = container;
    this.onNavigate = onNavigate;
    const profile = GamificationService.getProfile();
    const currentXp = profile.totalXp;

    const unlockedCount = expeditionDestinations.filter(d => currentXp >= d.requiredXp).length;

    this.container.innerHTML = `
      <div class="animate-fade-in max-w-4xl mx-auto px-4 py-4 space-y-5">
        <!-- ヘッダー -->
        <div class="flex items-center justify-between border-b border-slate-200 pb-3">
          <div class="flex items-center gap-2.5">
            <span class="text-2xl p-2 rounded-xl bg-gradient-to-tr from-sky-500 to-emerald-500 text-white shadow-xs">🗺️</span>
            <div>
              <h2 class="text-lg font-bold text-slate-800">ペンギン探検隊（モンゴル名所めぐり）</h2>
              <p class="text-xs text-slate-500">学習XPを貯めてモンゴルの絶景と名所を旅しよう！</p>
            </div>
          </div>
          <button type="button" id="btn-back-home" class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all">
            ✕ ホームへ
          </button>
        </div>

        <!-- 旅の進捗ステータス -->
        <div class="bg-gradient-to-r from-sky-600 to-indigo-600 rounded-3xl p-5 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-xs">
              🐧
            </div>
            <div>
              <div class="text-xs font-bold text-sky-200">探検隊の冒険記録</div>
              <h3 class="text-lg font-black">
                7大名所中 <span class="text-amber-300 text-xl">${unlockedCount}</span> ヶ所を開拓！
              </h3>
            </div>
          </div>
          <div class="text-right sm:text-left bg-black/20 backdrop-blur-xs px-4 py-2 rounded-2xl border border-white/20 text-xs">
            <span class="text-sky-200">現在の累計XP：</span>
            <strong class="text-amber-300 text-sm font-black">${currentXp.toLocaleString()} XP</strong>
          </div>
        </div>

        <!-- 名所グリッド一覧 -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          ${expeditionDestinations.map((dest, i) => {
            const isUnlocked = currentXp >= dest.requiredXp;
            const remainingXp = dest.requiredXp - currentXp;

            return `
              <div class="dest-card rounded-2xl p-5 border-2 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                isUnlocked 
                  ? 'bg-white border-sky-300 hover:border-sky-500 hover:shadow-md' 
                  : 'bg-slate-50 border-slate-200 opacity-75'
              }" data-id="${dest.id}">
                <div>
                  <div class="flex items-center justify-between mb-3">
                    <span class="text-3xl">${dest.badgeIcon}</span>
                    <span class="text-[10px] font-black px-2 py-0.5 rounded-full ${
                      isUnlocked 
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                        : 'bg-slate-200 text-slate-600'
                    }">
                      ${isUnlocked ? '開拓済み 🚩' : `あと ${remainingXp} XP 🔒`}
                    </span>
                  </div>

                  <div class="space-y-1">
                    <div class="text-xs font-bold text-slate-400 font-mono">Stage ${i + 1}</div>
                    <h4 class="text-base font-black text-slate-900 cyrillic-text">
                      ${dest.nameMn}
                    </h4>
                    <div class="text-xs font-bold text-slate-700">
                      ${dest.nameJa}
                    </div>
                  </div>

                  <p class="text-xs text-slate-500 mt-2 leading-relaxed line-clamp-2">
                    ${dest.description}
                  </p>
                </div>

                <div class="mt-4 pt-3 border-t ${isUnlocked ? 'border-sky-100 text-sky-700' : 'border-slate-200 text-slate-400'} flex items-center justify-between text-xs font-bold">
                  <span>${isUnlocked ? '名所記念カードを見る 📸' : '未到達'}</span>
                  <span>${isUnlocked ? '→' : '🔒'}</span>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- 名所記念カードモーダル（選択時） -->
        ${this.state.selectedDestination ? this.renderModalHTML(this.state.selectedDestination) : ''}
      </div>
    `;

    this.container.querySelector('#btn-back-home').addEventListener('click', () => {
      if (this.onNavigate) this.onNavigate('home');
    });

    this.container.querySelectorAll('.dest-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.dataset.id;
        const dest = expeditionDestinations.find(d => d.id === id);
        if (dest) {
          this.state.selectedDestination = dest;
          SoundEffects.playCorrect();
          this.render(this.container, this.onNavigate);
        }
      });
    });

    // モーダルイベント
    const closeBtn = this.container.querySelector('#btn-close-exp-modal');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.state.selectedDestination = null;
        this.render(this.container, this.onNavigate);
      });
    }

    const modalSpeakBtn = this.container.querySelector('#btn-exp-speak');
    if (modalSpeakBtn) {
      modalSpeakBtn.addEventListener('click', () => {
        SpeechService.speak(this.state.selectedDestination.nameMn);
      });
    }
  }

  static renderModalHTML(dest) {
    const profile = GamificationService.getProfile();
    const isUnlocked = profile.totalXp >= dest.requiredXp;

    return `
      <div class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
        <div class="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col space-y-0">
          
          <!-- カード上部バナー -->
          <div class="bg-gradient-to-r ${dest.postcardColor} p-6 text-white text-center relative">
            <button type="button" id="btn-close-exp-modal" class="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center text-sm font-bold transition-all">
              ✕
            </button>
            <div class="text-5xl mb-2">${dest.badgeIcon}</div>
            <div class="text-xs font-bold text-white/80 font-mono tracking-wider">MONGOLIA EXPEDITION POSTCARD</div>
            <h3 class="text-xl font-black cyrillic-text mt-1">${dest.nameMn}</h3>
            <div class="text-xs text-white/90 font-medium">${dest.nameJa}</div>
          </div>

          <!-- カード詳細本文 -->
          <div class="p-6 space-y-4">
            <div class="flex items-center justify-between border-b border-slate-100 pb-3">
              <div class="text-xs font-bold text-slate-500">
                獲得記念品：<span class="text-slate-900">${dest.souvenir}</span>
              </div>
              <button type="button" id="btn-exp-speak" class="px-3 py-1 bg-sky-50 hover:bg-sky-100 text-sky-800 rounded-lg text-xs font-bold flex items-center gap-1 border border-sky-200">
                <span>🔊</span> 発音を聞く
              </button>
            </div>

            <p class="text-xs text-slate-700 leading-relaxed">
              ${dest.description}
            </p>

            <div class="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs text-amber-950 space-y-1">
              <div class="font-bold flex items-center gap-1 text-amber-900">
                <span>💡</span> 探検隊の豆知識（Fun Fact）：
              </div>
              <p class="leading-relaxed">
                ${dest.funFact}
              </p>
            </div>

            <div class="text-center pt-2">
              <span class="text-[11px] font-bold ${isUnlocked ? 'text-emerald-700 bg-emerald-50' : 'text-slate-500 bg-slate-100'} px-3 py-1 rounded-full">
                ${isUnlocked ? '🎖️ 開拓バッジ コレクション済み' : `🔒 必要XP: ${dest.requiredXp} XP`}
              </span>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
