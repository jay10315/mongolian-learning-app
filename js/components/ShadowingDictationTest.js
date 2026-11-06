// シャドーイング ＆ ディクテーション（聞き取り書き取り）コンポーネント
import { typingSentences } from '../data/typingSentences.js';
import { SpeechService } from '../services/speech.js';
import { CyrillicKeyboard } from './CyrillicKeyboard.js';
import { SoundEffects, SPECIAL_CYRILLIC_BAR } from '../utils/helpers.js';
import { GamificationService } from '../services/gamification.js';

export class ShadowingDictationComponent {
  static state = {
    mode: 'dictation', // 'dictation' | 'shadowing'
    sentences: [],
    currentIndex: 0,
    currentSentence: null,
    userInput: '',
    isChecked: false,
    score: 0,
    accuracy: 0
  };

  static render(container, onNavigate) {
    this.container = container;
    this.onNavigate = onNavigate;

    if (!this.state.currentSentence) {
      this.state.sentences = [...typingSentences];
      this.loadSentence(0);
    }

    const s = this.state.currentSentence;
    const idx = this.state.currentIndex;
    const total = this.state.sentences.length;

    this.container.innerHTML = `
      <div class="animate-fade-in max-w-2xl mx-auto px-4 py-4 space-y-4">
        <!-- ヘッダー -->
        <div class="flex items-center justify-between border-b border-slate-200 pb-3">
          <div class="flex items-center gap-2.5">
            <span class="text-2xl p-2 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-xs">🎙️</span>
            <div>
              <h2 class="text-lg font-bold text-slate-800">シャドーイング ＆ ディクテーション</h2>
              <p class="text-xs text-slate-500">ネイティブ音声を聴いて発音練習 ＆ 耳で聞き取りキリル文字書き取り</p>
            </div>
          </div>
          <button type="button" id="btn-back-home" class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all">
            ✕ ホームへ
          </button>
        </div>

        <!-- モード切り替えタブ -->
        <div class="flex gap-2 border-b border-slate-200 pb-2">
          <button type="button" class="btn-submode px-4 py-2 rounded-xl text-xs font-black transition-all ${
            this.state.mode === 'dictation' ? 'bg-purple-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }" data-mode="dictation">
            ✍️ ディクテーション（耳で聴いて入力）
          </button>
          <button type="button" class="btn-submode px-4 py-2 rounded-xl text-xs font-black transition-all ${
            this.state.mode === 'shadowing' ? 'bg-purple-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }" data-mode="shadowing">
            🗣️ シャドーイング（声に出して追唱）
          </button>
        </div>

        <!-- メイン学習カード -->
        <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
              文 ${idx + 1} / ${total}
            </span>
            <div class="flex gap-2">
              <button type="button" id="btn-play-normal" class="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-1">
                <span>🔊</span> 通常速
              </button>
              <button type="button" id="btn-play-slow" class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1">
                <span>🐢</span> 0.75x ゆっくり
              </button>
            </div>
          </div>

          <!-- 日本語の文意 -->
          <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center">
            <div class="text-[11px] font-bold text-slate-400 mb-0.5">日本語訳</div>
            <div class="text-sm sm:text-base font-bold text-slate-800">
              ${s.japanese}
            </div>
          </div>

          ${this.state.mode === 'shadowing' ? `
            <!-- シャドーイングモード: テキスト表示と音読プロンプト -->
            <div class="p-5 rounded-2xl bg-purple-50/50 border border-purple-200 text-center space-y-3">
              <div class="text-lg sm:text-xl font-black text-slate-900 cyrillic-text">
                ${s.mongolian}
              </div>
              <div class="text-xs text-purple-800 font-medium">
                💡 音声のすぐ後ろにピッタリくっついて、リズムとイントネーションを真似しながら声に出してみましょう！
              </div>
            </div>
          ` : `
            <!-- ディクテーションモード: 入力エリア -->
            <div class="space-y-2">
              <label class="block text-xs font-bold text-slate-700">
                聴こえたモンゴル語を一文まるごと入力してください：
              </label>
              <input type="text" id="dictation-input" value="${this.state.userInput}" placeholder="ここに入力..." class="w-full text-base sm:text-lg p-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-600 cyrillic-text bg-white" ${this.state.isChecked ? 'readonly' : ''}>
              
              <!-- 特有キリル文字ボタンバー -->
              <div class="flex flex-wrap items-center gap-1 pt-1">
                <span class="text-[10px] text-slate-400 font-bold mr-1">特有文字:</span>
                ${['ө', 'ү', 'Ө', 'Ү', 'ь', 'ъ', 'э', 'ы', 'я', 'ё', 'ю'].map(ch => `
                  <button type="button" class="btn-char-input px-2 py-1 bg-slate-100 hover:bg-purple-100 active:bg-purple-200 text-slate-800 rounded font-bold text-xs border border-slate-200" data-char="${ch}">
                    ${ch}
                  </button>
                `).join('')}
              </div>
            </div>
          `}

          <!-- 回答採点結果表示 -->
          ${this.state.isChecked && this.state.mode === 'dictation' ? `
            <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-xs font-black ${this.state.accuracy >= 90 ? 'text-emerald-700' : 'text-amber-700'}">
                  一致度: ${this.state.accuracy}% ${this.state.accuracy >= 90 ? '💮 素晴らしい聞き取り！' : '💡 おしい！'}
                </span>
                <span class="text-xs text-slate-400 font-mono">正解の文：</span>
              </div>
              <div class="text-base font-black text-slate-900 cyrillic-text">
                ${s.mongolian}
              </div>
            </div>
          ` : ''}

          <!-- アクションボタン -->
          <div class="pt-2">
            ${this.state.mode === 'dictation' && !this.state.isChecked ? `
              <button type="button" id="btn-check-dictation" class="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-md transition-all active:scale-98 text-sm">
                書き取りを判定する 🎯
              </button>
            ` : `
              <button type="button" id="btn-next-sentence" class="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-md transition-all active:scale-98 text-sm flex items-center justify-center gap-1">
                <span>次の文へ進む</span> <span>→</span>
              </button>
            `}
          </div>
        </div>
      </div>
    `;

    // イベントリスナー
    this.container.querySelector('#btn-back-home').addEventListener('click', () => {
      if (this.onNavigate) this.onNavigate('home');
    });

    this.container.querySelectorAll('.btn-submode').forEach(btn => {
      btn.addEventListener('click', () => {
        this.state.mode = btn.dataset.mode;
        this.state.isChecked = false;
        this.render(this.container, this.onNavigate);
      });
    });

    this.container.querySelector('#btn-play-normal').addEventListener('click', () => {
      SpeechService.speak(s.mongolian);
    });

    this.container.querySelector('#btn-play-slow').addEventListener('click', () => {
      SpeechService.speakSlow(s.mongolian);
    });

    // キリル特有文字クリック
    const inputEl = this.container.querySelector('#dictation-input');
    if (inputEl) {
      inputEl.addEventListener('input', (e) => {
        this.state.userInput = e.target.value;
      });

      this.container.querySelectorAll('.btn-char-input').forEach(b => {
        b.addEventListener('click', () => {
          const ch = b.dataset.char;
          const pos = inputEl.selectionStart || inputEl.value.length;
          const val = inputEl.value;
          inputEl.value = val.slice(0, pos) + ch + val.slice(pos);
          this.state.userInput = inputEl.value;
          inputEl.focus();
        });
      });
    }

    // 判定ボタン
    const checkBtn = this.container.querySelector('#btn-check-dictation');
    if (checkBtn) {
      checkBtn.addEventListener('click', () => {
        const cleanA = (this.state.userInput || '').trim().toLowerCase().replace(/[.,!?:;«»"'\s]/g, '');
        const cleanB = (s.mongolian || '').trim().toLowerCase().replace(/[.,!?:;«»"'\s]/g, '');
        
        let matches = 0;
        const maxLen = Math.max(cleanA.length, cleanB.length);
        for (let i = 0; i < Math.min(cleanA.length, cleanB.length); i++) {
          if (cleanA[i] === cleanB[i]) matches++;
        }
        const acc = maxLen > 0 ? Math.round((matches / maxLen) * 100) : 0;
        this.state.accuracy = acc;
        this.state.isChecked = true;
        if (acc >= 85) {
          SoundEffects.playCorrect();
          GamificationService.addXp(10);
        } else {
          SoundEffects.playWrong();
          GamificationService.addXp(3);
        }
        this.render(this.container, this.onNavigate);
      });
    }

    // 次へボタン
    const nextBtn = this.container.querySelector('#btn-next-sentence');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const nextIdx = (this.state.currentIndex + 1) % this.state.sentences.length;
        this.loadSentence(nextIdx);
        this.render(this.container, this.onNavigate);
      });
    }
  }

  static loadSentence(index) {
    this.state.currentIndex = index;
    this.state.currentSentence = this.state.sentences[index];
    this.state.userInput = '';
    this.state.isChecked = false;
    this.state.accuracy = 0;
  }
}
