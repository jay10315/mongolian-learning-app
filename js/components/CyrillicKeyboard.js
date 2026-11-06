// モンゴル語キリル文字オンスクリーンキーボード＆クイック入力バー
import { SPECIAL_CYRILLIC_BAR, MONGOLIAN_CYRILLIC_LETTERS } from '../utils/helpers.js';

export class CyrillicKeyboard {
  static activeInput = null;
  static isShift = false;
  static isExpanded = false;

  static init() {
    // 画面内の input[type="text"], textarea にフォーカスイベントを設定
    document.addEventListener('focusin', (e) => {
      if (e.target && (e.target.matches('input[data-cyrillic="true"]') || e.target.classList.contains('cyrillic-input'))) {
        this.activeInput = e.target;
        this.showBar();
      }
    });

    this.render();
  }

  static setActiveInput(inputElement) {
    this.activeInput = inputElement;
    this.showBar();
  }

  static render() {
    let container = document.getElementById('cyrillic-keyboard-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'cyrillic-keyboard-container';
      container.className = 'fixed bottom-0 left-0 right-0 z-50 transition-all duration-300 transform translate-y-full';
      document.body.appendChild(container);
    }

    container.innerHTML = `
      <div class="bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-2xl p-2 max-w-3xl mx-auto rounded-t-2xl">
        <!-- クイックバー ＆ コントロール -->
        <div class="flex items-center justify-between gap-1 mb-1.5 px-1">
          <div class="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none flex-1">
            <span class="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md shrink-0 flex items-center gap-1">
              🇲🇳 モンゴル語キリル文字:
            </span>
            ${SPECIAL_CYRILLIC_BAR.map(char => `
              <button type="button" class="cyr-quick-key shrink-0 px-2.5 py-1 text-sm font-semibold bg-slate-100 hover:bg-emerald-100 hover:text-emerald-800 text-slate-800 rounded-lg active:scale-95 transition-all shadow-sm border border-slate-200" data-char="${char}">
                ${char}
              </button>
            `).join('')}
          </div>

          <div class="flex items-center gap-1.5 shrink-0 ml-1">
            <button type="button" id="btn-toggle-full-keyboard" class="text-xs px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-medium transition-colors">
              ${this.isExpanded ? '▼ 閉じる' : '▲ 全キー'}
            </button>
            <button type="button" id="btn-hide-keyboard" class="text-xs p-1 text-slate-400 hover:text-slate-600 rounded-lg">
              ✕
            </button>
          </div>
        </div>

        <!-- フルキーボード（トグル表示） -->
        <div id="full-keyboard-panel" class="${this.isExpanded ? 'block' : 'hidden'} pt-1 border-t border-slate-100">
          <div class="flex justify-end gap-2 mb-1 px-1">
            <button type="button" id="btn-shift-key" class="text-xs px-3 py-1 ${this.isShift ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'} rounded font-semibold transition-colors">
              ⇧ Shift
            </button>
            <button type="button" id="btn-space-key" class="text-xs px-4 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded font-semibold">
              スペース
            </button>
            <button type="button" id="btn-backspace-key" class="text-xs px-3 py-1 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded font-semibold">
              ⌫ 1文字消す
            </button>
          </div>

          <div class="grid grid-cols-11 sm:grid-cols-12 gap-1 p-1 max-h-48 overflow-y-auto">
            ${MONGOLIAN_CYRILLIC_LETTERS.map(item => {
              const displayChar = this.isShift ? item.upper : item.char;
              const isHighlight = item.special ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold' : 'bg-slate-50 text-slate-800 border-slate-200';
              return `
                <button type="button" class="cyr-full-key p-2 text-sm font-medium rounded border hover:bg-emerald-50 active:scale-95 transition-all text-center shadow-xs ${isHighlight}" data-char="${displayChar}">
                  ${displayChar}
                </button>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;

    this.bindEvents(container);
  }

  static bindEvents(container) {
    // クイックキー
    container.querySelectorAll('.cyr-quick-key').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const char = btn.getAttribute('data-char');
        this.insertChar(char);
      });
    });

    // フルキー
    container.querySelectorAll('.cyr-full-key').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const char = btn.getAttribute('data-char');
        this.insertChar(char);
      });
    });

    // フルキーボードトグル
    const toggleBtn = container.querySelector('#btn-toggle-full-keyboard');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        this.isExpanded = !this.isExpanded;
        this.render();
      });
    }

    // 非表示
    const hideBtn = container.querySelector('#btn-hide-keyboard');
    if (hideBtn) {
      hideBtn.addEventListener('click', () => {
        this.hideBar();
      });
    }

    // Shift
    const shiftBtn = container.querySelector('#btn-shift-key');
    if (shiftBtn) {
      shiftBtn.addEventListener('click', () => {
        this.isShift = !this.isShift;
        this.render();
      });
    }

    // スペース
    const spaceBtn = container.querySelector('#btn-space-key');
    if (spaceBtn) {
      spaceBtn.addEventListener('click', () => {
        this.insertChar(' ');
      });
    }

    // Backspace
    const backspaceBtn = container.querySelector('#btn-backspace-key');
    if (backspaceBtn) {
      backspaceBtn.addEventListener('click', () => {
        this.deleteChar();
      });
    }
  }

  static insertChar(char) {
    if (!this.activeInput) {
      // 直近のアクティブなcyrillic inputを探す
      this.activeInput = document.querySelector('input[data-cyrillic="true"]:focus') || 
                         document.querySelector('input[data-cyrillic="true"]');
    }
    if (!this.activeInput) return;

    const input = this.activeInput;
    const start = input.selectionStart || input.value.length;
    const end = input.selectionEnd || input.value.length;
    const text = input.value;

    input.value = text.substring(0, start) + char + text.substring(end);
    input.selectionStart = input.selectionEnd = start + char.length;
    input.focus();

    // inputイベントをディスパッチしてReactやVanillaの状態を更新
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }

  static deleteChar() {
    if (!this.activeInput) return;
    const input = this.activeInput;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const text = input.value;

    if (start === end && start > 0) {
      input.value = text.substring(0, start - 1) + text.substring(end);
      input.selectionStart = input.selectionEnd = start - 1;
    } else if (start !== end) {
      input.value = text.substring(0, start) + text.substring(end);
      input.selectionStart = input.selectionEnd = start;
    }
    input.focus();
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }

  static showBar() {
    const container = document.getElementById('cyrillic-keyboard-container');
    if (container) {
      container.classList.remove('translate-y-full');
      container.classList.add('translate-y-0');
    }
  }

  static hideBar() {
    const container = document.getElementById('cyrillic-keyboard-container');
    if (container) {
      container.classList.add('translate-y-full');
      container.classList.remove('translate-y-0');
    }
  }
}
