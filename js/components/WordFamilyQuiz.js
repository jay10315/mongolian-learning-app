// 類義語・対義語・語根ファミリーコンポーネント
import { wordFamilyData } from '../data/wordFamilyData.js';
import { SpeechService } from '../services/speech.js';
import { SoundEffects } from '../utils/helpers.js';
import { GamificationService } from '../services/gamification.js';

export class WordFamilyComponent {
  static state = {
    tab: 'antonyms', // 'antonyms' | 'synonyms' | 'families'
    quizIndex: 0,
    selectedAnswer: null,
    score: 0
  };

  static render(container, onNavigate) {
    this.container = container;
    this.onNavigate = onNavigate;

    this.container.innerHTML = `
      <div class="animate-fade-in max-w-3xl mx-auto px-4 py-4 space-y-5">
        <!-- ヘッダー -->
        <div class="flex items-center justify-between border-b border-slate-200 pb-3">
          <div class="flex items-center gap-2.5">
            <span class="text-2xl p-2 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-xs">🌳</span>
            <div>
              <h2 class="text-lg font-bold text-slate-800">類義語・対義語・語根ファミリー</h2>
              <p class="text-xs text-slate-500">1つの語根から芋づる式に語彙を3倍増やすネットワーク学習</p>
            </div>
          </div>
          <button type="button" id="btn-back-home" class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all">
            ✕ ホームへ
          </button>
        </div>

        <!-- タブ切り替え -->
        <div class="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
          <button type="button" class="btn-wf-tab px-4 py-2 rounded-xl text-xs font-black transition-all ${
            this.state.tab === 'antonyms' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }" data-tab="antonyms">
            🔄 対義語ペア（Эсрэг утга）
          </button>
          <button type="button" class="btn-wf-tab px-4 py-2 rounded-xl text-xs font-black transition-all ${
            this.state.tab === 'synonyms' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }" data-tab="synonyms">
            🤝 類義語＆ニュアンス（Ойролцоо утга）
          </button>
          <button type="button" class="btn-wf-tab px-4 py-2 rounded-xl text-xs font-black transition-all ${
            this.state.tab === 'families' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }" data-tab="families">
            🌳 語根ツリー（同一語根の派生語）
          </button>
        </div>

        ${this.state.tab === 'antonyms' ? this.renderAntonymsHTML() : this.state.tab === 'synonyms' ? this.renderSynonymsHTML() : this.renderFamiliesHTML()}
      </div>
    `;

    this.container.querySelector('#btn-back-home').addEventListener('click', () => {
      if (this.onNavigate) this.onNavigate('home');
    });

    this.container.querySelectorAll('.btn-wf-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        this.state.tab = btn.dataset.tab;
        this.render(this.container, this.onNavigate);
      });
    });

    this.container.querySelectorAll('.btn-wf-speak').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        SpeechService.speak(btn.dataset.word);
      });
    });
  }

  // 1. 対義語
  static renderAntonymsHTML() {
    return `
      <div class="space-y-3">
        <div class="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-xs text-emerald-950">
          💡 対義語（反対の意味の単語）をペアで覚えると、記憶の定着率が2倍以上高まります！
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          ${wordFamilyData.antonyms.map(pair => `
            <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-2.5">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <button type="button" class="btn-wf-speak text-xs text-emerald-600 hover:text-emerald-800" data-word="${pair.wordA}">🔊</button>
                  <span class="text-base font-black text-slate-900 cyrillic-text">${pair.wordA}</span>
                  <span class="text-xs text-slate-500">(${pair.meaningA})</span>
                </div>
                <span class="text-xs font-bold text-slate-400">⇔</span>
                <div class="flex items-center gap-2">
                  <span class="text-base font-black text-slate-900 cyrillic-text">${pair.wordB}</span>
                  <span class="text-xs text-slate-500">(${pair.meaningB})</span>
                  <button type="button" class="btn-wf-speak text-xs text-emerald-600 hover:text-emerald-800" data-word="${pair.wordB}">🔊</button>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-2 text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg">
                <div>・${pair.exampleA}</div>
                <div>・${pair.exampleB}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // 2. 類義語
  static renderSynonymsHTML() {
    return `
      <div class="space-y-3">
        <div class="bg-teal-50 p-3 rounded-xl border border-teal-200 text-xs text-teal-950">
          💡 似た意味の言葉の「微妙なニュアンスの違い」を知ることで、自然で豊かなモンゴル語が話せるようになります。
        </div>

        <div class="grid grid-cols-1 gap-3">
          ${wordFamilyData.synonyms.map(syn => `
            <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
              <div class="flex flex-wrap items-center gap-4">
                <div class="flex items-center gap-1.5">
                  <button type="button" class="btn-wf-speak text-xs text-teal-600 hover:text-teal-800" data-word="${syn.wordA}">🔊</button>
                  <span class="text-lg font-black text-slate-900 cyrillic-text">${syn.wordA}</span>
                  <span class="text-xs font-bold text-slate-500">【${syn.meaningA}】</span>
                </div>
                <span class="text-xs font-bold text-teal-600">≒ 近い意味 ≒</span>
                <div class="flex items-center gap-1.5">
                  <button type="button" class="btn-wf-speak text-xs text-teal-600 hover:text-teal-800" data-word="${syn.wordB}">🔊</button>
                  <span class="text-lg font-black text-slate-900 cyrillic-text">${syn.wordB}</span>
                  <span class="text-xs font-bold text-slate-500">【${syn.meaningB}】</span>
                </div>
              </div>
              <div class="p-3 bg-teal-50/50 rounded-xl border border-teal-100 text-xs text-slate-700 leading-relaxed">
                📌 <strong>使い分けのコツ：</strong> ${syn.nuance}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // 3. 語根ツリー
  static renderFamiliesHTML() {
    return `
      <div class="space-y-4">
        <div class="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-xs text-emerald-950">
          💡 モンゴル語は「語根（根っこの単語）」に接尾辞をくっつけて新しい単語を作る言語です。語根を知れば、初めて見る単語の意味も推測できるようになります！
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          ${wordFamilyData.families.map(fam => `
            <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
              <div class="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div class="flex items-center gap-2">
                  <span class="text-lg">🌱</span>
                  <div>
                    <span class="text-xs font-bold text-emerald-700">語根：</span>
                    <strong class="text-base font-black text-slate-900 cyrillic-text">${fam.root}</strong>
                  </div>
                </div>
                <span class="text-xs font-bold text-slate-500">意味：${fam.rootMeaning}</span>
              </div>

              <!-- 派生語リスト -->
              <div class="space-y-2">
                ${fam.derivations.map(d => `
                  <div class="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-emerald-50/40 rounded-xl border border-slate-100 transition-colors">
                    <div class="flex items-center gap-1.5">
                      <button type="button" class="btn-wf-speak text-xs text-slate-400 hover:text-emerald-700" data-word="${d.word}">🔊</button>
                      <span class="font-bold text-sm text-slate-900 cyrillic-text">${d.word}</span>
                    </div>
                    <span class="text-xs text-slate-600">${d.meaning}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
}
