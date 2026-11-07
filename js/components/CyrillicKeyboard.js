// モンゴル語キリル文字オンスクリーンキーボード（Windows PC標準JCUKEN配列完全準拠）
import { MONGOLIAN_PC_KEYBOARD_LAYOUT } from '../utils/helpers.js';

export class CyrillicKeyboard {
  static activeInput = null;
  static isShift = false;
  static isVisible = false;

  static init() {
    // 画面内の input[type="text"], textarea にフォーカスイベントを設定
    document.addEventListener('focusin', (e) => {
      if (e.target && (e.target.matches('input[data-cyrillic="true"]') || e.target.classList.contains('cyrillic-input'))) {
        this.activeInput = e.target;
      }
    });

    this.render();
  }

  static setActiveInput(inputElement) {
    this.activeInput = inputElement;
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
      <div class="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t-2 border-emerald-500 shadow-2xl p-2.5 max-w-3xl mx-auto rounded-t-2xl">
        <!-- ヘッダー＆コントロール -->
        <div class="flex items-center justify-between gap-2 mb-2 px-1">
          <div class="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-400">
            <span>💻</span>
            <span>Windows標準 モンゴル語キーボード配列（JCUKEN）</span>
          </div>

          <div class="flex items-center gap-1.5 shrink-0">
            <button type="button" id="btn-shift-key" class="text-xs px-3 py-1 ${this.isShift ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'} rounded-lg font-bold transition-colors cursor-pointer">
              ⇧ Shift
            </button>
            <button type="button" id="btn-backspace-key" class="text-xs px-2.5 py-1 bg-rose-100 dark:bg-rose-950/60 hover:bg-rose-200 text-rose-700 dark:text-rose-300 rounded-lg font-bold transition-colors cursor-pointer">
              ⌫ 消す
            </button>
            <button type="button" id="btn-hide-keyboard" class="text-xs p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer">
              ✕ 閉じる
            </button>
          </div>
        </div>

        <!-- PC標準モンゴル語キーボード（Row 2 〜 Row 4） -->
        <div class="space-y-1.5 text-center">
          <!-- Row 2 (ф ц у ж э н г ш ү з к ъ щ) -->
          <div class="grid gap-1" style="grid-template-columns: repeat(13, minmax(0, 1fr));">
            ${MONGOLIAN_PC_KEYBOARD_LAYOUT.row2.map(k => `
              <button type="button" class="cyr-pc-key py-2 text-xs sm:text-sm font-bold rounded-lg border bg-white dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-emerald-100 dark:hover:bg-emerald-950/60 shadow-2xs active:scale-95 transition-all cursor-pointer ${k.special ? 'border-amber-400 bg-amber-50/70 text-amber-950 dark:bg-amber-950/40 dark:text-amber-200' : 'border-slate-200 dark:border-slate-700'}" data-char="${this.isShift ? k.upper : k.lower}">
                ${this.isShift ? k.upper : k.lower}
              </button>
            `).join('')}
          </div>

          <!-- Row 3 (й ы б ө а х р о л д п) -->
          <div class="grid grid-cols-11 gap-1">
            ${MONGOLIAN_PC_KEYBOARD_LAYOUT.row3.map(k => `
              <button type="button" class="cyr-pc-key py-2 text-xs sm:text-sm font-bold rounded-lg border bg-white dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-emerald-100 dark:hover:bg-emerald-950/60 shadow-2xs active:scale-95 transition-all cursor-pointer ${k.special ? 'border-amber-400 bg-amber-50/70 text-amber-950 dark:bg-amber-950/40 dark:text-amber-200' : 'border-slate-200 dark:border-slate-700'}" data-char="${this.isShift ? k.upper : k.lower}">
                ${this.isShift ? k.upper : k.lower}
              </button>
            `).join('')}
          </div>

          <!-- Row 4 (я ч ё е с м и т ь в ю) -->
          <div class="grid grid-cols-11 gap-1">
            ${MONGOLIAN_PC_KEYBOARD_LAYOUT.row4.map(k => `
              <button type="button" class="cyr-pc-key py-2 text-xs sm:text-sm font-bold rounded-lg border bg-white dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-emerald-100 dark:hover:bg-emerald-950/60 shadow-2xs active:scale-95 transition-all cursor-pointer border-slate-200 dark:border-slate-700" data-char="${this.isShift ? k.upper : k.lower}">
                ${this.isShift ? k.upper : k.lower}
              </button>
            `).join('')}
          </div>

          <!-- 最下段（スペース） -->
          <div class="flex items-center justify-center gap-2 pt-1">
            <button type="button" id="btn-space-key" class="flex-1 max-w-sm py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-lg border border-slate-300 dark:border-slate-600 text-xs shadow-2xs active:scale-98 cursor-pointer">
              ␣ スペース
            </button>
          </div>
        </div>
      </div>
    `;

    this.bindEvents(container);
  }

  static bindEvents(container) {
    // 各キー押下
    container.querySelectorAll('.cyr-pc-key').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const char = btn.getAttribute('data-char');
        this.insertChar(char);
      });
    });

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

  static resolveInput() {
    if (this.activeInput && !this.activeInput.disabled && document.body.contains(this.activeInput)) {
      return this.activeInput;
    }
    if (typeof window !== 'undefined' && window.__lastActiveCyrillicInput && !window.__lastActiveCyrillicInput.disabled && document.body.contains(window.__lastActiveCyrillicInput)) {
      return window.__lastActiveCyrillicInput;
    }
    if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') && !document.activeElement.disabled) {
      return document.activeElement;
    }
    return document.querySelector('#input-exercise-answer:not([disabled]), #input-word-answer:not([disabled]), #input-decl-answer:not([disabled]), #input-review-answer:not([disabled]), input[data-cyrillic="true"]:not([disabled]), input:not([disabled])');
  }

  static insertChar(char) {
    const input = this.resolveInput();
    if (!input) return;
    this.activeInput = input;
    if (typeof window !== 'undefined') window.__lastActiveCyrillicInput = input;

    const start = (typeof input.selectionStart === 'number') ? input.selectionStart : input.value.length;
    const end = (typeof input.selectionEnd === 'number') ? input.selectionEnd : input.value.length;
    const text = input.value;

    input.value = text.substring(0, start) + char + text.substring(end);
    const newPos = start + char.length;
    try { input.setSelectionRange(newPos, newPos); } catch (_) {}
    input.focus();
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }

  static deleteChar() {
    const input = this.resolveInput();
    if (!input) return;
    this.activeInput = input;
    if (typeof window !== 'undefined') window.__lastActiveCyrillicInput = input;

    const start = (typeof input.selectionStart === 'number') ? input.selectionStart : input.value.length;
    const end = (typeof input.selectionEnd === 'number') ? input.selectionEnd : input.value.length;
    const text = input.value;

    if (start === end && start > 0) {
      input.value = text.substring(0, start - 1) + text.substring(end);
      const newPos = start - 1;
      try { input.setSelectionRange(newPos, newPos); } catch (_) {}
    } else if (start !== end) {
      input.value = text.substring(0, start) + text.substring(end);
      try { input.setSelectionRange(start, start); } catch (_) {}
    }
    input.focus();
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }

  static showBar() {
    const container = document.getElementById('cyrillic-keyboard-container');
    if (container) {
      container.classList.remove('translate-y-full');
      container.classList.add('translate-y-0');
      this.isVisible = true;
    }
  }

  static hideBar() {
    const container = document.getElementById('cyrillic-keyboard-container');
    if (container) {
      container.classList.add('translate-y-full');
      container.classList.remove('translate-y-0');
      this.isVisible = false;
    }
  }
}
