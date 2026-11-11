// モンゴル語キリル文字・母音調和・UIユーティリティ

// モンゴル語キリル文字アルファベット（35文字）
export const MONGOLIAN_CYRILLIC_LETTERS = [
  // 母音
  { char: 'а', upper: 'А', name: 'a', type: 'male_vowel' },
  { char: 'э', upper: 'Э', name: 'e', type: 'female_vowel' },
  { char: 'и', upper: 'И', name: 'i', type: 'neutral_vowel' },
  { char: 'о', upper: 'О', name: 'o', type: 'male_vowel' },
  { char: 'ө', upper: 'Ө', name: 'ö', type: 'female_vowel', special: true },
  { char: 'у', upper: 'У', name: 'u', type: 'male_vowel' },
  { char: 'ү', upper: 'Ү', name: 'ü', type: 'female_vowel', special: true },
  { char: 'я', upper: 'Я', name: 'ya', type: 'male_vowel' },
  { char: 'е', upper: 'Е', name: 'ye', type: 'female_vowel' },
  { char: 'ё', upper: 'Ё', name: 'yo', type: 'male_vowel' },
  { char: 'ю', upper: 'Ю', name: 'yu', type: 'male_vowel' },
  { char: 'ы', upper: 'Ы', name: 'y', type: 'vowel' },
  // 子音
  { char: 'б', upper: 'Б', name: 'b', type: 'consonant' },
  { char: 'в', upper: 'В', name: 'v', type: 'consonant' },
  { char: 'г', upper: 'Г', name: 'g', type: 'consonant' },
  { char: 'д', upper: 'Д', name: 'd', type: 'consonant' },
  { char: 'ж', upper: 'Ж', name: 'zh', type: 'consonant' },
  { char: 'з', upper: 'З', name: 'z', type: 'consonant' },
  { char: 'к', upper: 'К', name: 'k', type: 'consonant' },
  { char: 'л', upper: 'Л', name: 'l', type: 'consonant' },
  { char: 'м', upper: 'М', name: 'm', type: 'consonant' },
  { char: 'н', upper: 'Н', name: 'n', type: 'consonant' },
  { char: 'п', upper: 'П', name: 'p', type: 'consonant' },
  { char: 'р', upper: 'Р', name: 'r', type: 'consonant' },
  { char: 'с', upper: 'С', name: 's', type: 'consonant' },
  { char: 'т', upper: 'Т', name: 't', type: 'consonant' },
  { char: 'ф', upper: 'Ф', name: 'f', type: 'consonant' },
  { char: 'х', upper: 'Х', name: 'kh', type: 'consonant' },
  { char: 'ц', upper: 'Ц', name: 'ts', type: 'consonant' },
  { char: 'ч', upper: 'Ч', name: 'ch', type: 'consonant' },
  { char: 'ш', upper: 'Ш', name: 'sh', type: 'consonant' },
  { char: 'щ', upper: 'Щ', name: 'shch', type: 'consonant' },
  // 記号
  { char: 'ъ', upper: 'Ъ', name: 'hard_sign', type: 'sign' },
  { char: 'ь', upper: 'Ь', name: 'soft_sign', type: 'sign' }
];

// Windows PC 標準モンゴル語キリル文字キーボード配列（JCUKEN / Standard Mongolian Layout）
export const MONGOLIAN_PC_KEYBOARD_LAYOUT = {
  row1: [
    { lower: '№', upper: '1', key: '1' },
    { lower: '-', upper: '2', key: '2' },
    { lower: '"', upper: '3', key: '3' },
    { lower: '₮', upper: '4', key: '4' },
    { lower: ':', upper: '5', key: '5' },
    { lower: '.', upper: '6', key: '6', special: true },
    { lower: '_', upper: '7', key: '7' },
    { lower: ',', upper: '8', key: '8', special: true },
    { lower: '%', upper: '9', key: '9' },
    { lower: '?', upper: '0', key: '0', special: true },
    { lower: '!', upper: '-', key: '-' },
    { lower: '=', upper: '+', key: '=' }
  ],
  row2: [
    { lower: 'ф', upper: 'Ф', key: 'q' },
    { lower: 'ц', upper: 'Ц', key: 'w' },
    { lower: 'у', upper: 'У', key: 'e' },
    { lower: 'ж', upper: 'Ж', key: 'r' },
    { lower: 'э', upper: 'Э', key: 't' },
    { lower: 'н', upper: 'Н', key: 'y' },
    { lower: 'г', upper: 'Г', key: 'u' },
    { lower: 'ш', upper: 'Ш', key: 'i' },
    { lower: 'ү', upper: 'Ү', key: 'o', special: true }, // モンゴル語特有母音
    { lower: 'з', upper: 'З', key: 'p' },
    { lower: 'к', upper: 'К', key: '[' },
    { lower: 'ъ', upper: 'Ъ', key: ']' },
    { lower: 'е', upper: 'Е', key: '`', special: true },
    { lower: 'щ', upper: 'Щ', key: '\\', special: true }
  ],
  row3: [
    { lower: 'й', upper: 'Й', key: 'a' },
    { lower: 'ы', upper: 'Ы', key: 's' },
    { lower: 'б', upper: 'Б', key: 'd' },
    { lower: 'ө', upper: 'Ө', key: 'f', special: true }, // モンゴル語特有母音
    { lower: 'а', upper: 'А', key: 'g' },
    { lower: 'х', upper: 'Х', key: 'h' },
    { lower: 'р', upper: 'Р', key: 'j' },
    { lower: 'о', upper: 'О', key: 'k' },
    { lower: 'л', upper: 'Л', key: 'l' },
    { lower: 'д', upper: 'Д', key: ';' },
    { lower: 'п', upper: 'П', key: "'" }
  ],
  row4: [
    { lower: 'я', upper: 'Я', key: 'z' },
    { lower: 'ч', upper: 'Ч', key: 'x' },
    { lower: 'ё', upper: 'Ё', key: 'c' },
    { lower: 'с', upper: 'С', key: 'v' },
    { lower: 'м', upper: 'М', key: 'b' },
    { lower: 'и', upper: 'И', key: 'n' },
    { lower: 'т', upper: 'Т', key: 'm' },
    { lower: 'ь', upper: 'Ь', key: ',' },
    { lower: 'в', upper: 'В', key: '.' },
    { lower: 'ю', upper: 'Ю', key: '/' }
  ]
};

// よく使う特殊文字（クイックバー用）
export const SPECIAL_CYRILLIC_BAR = ['ө', 'ү', 'Ө', 'Ү', 'е', 'Е', 'щ', 'Щ', 'ь', 'ъ', 'э', 'ы', 'я', 'ё', 'ю'];

/**
 * 初心者にも分かりやすいキリル文字入力パレット＆PC標準キーボード切り替えバーの共通HTML
 */
export function renderCyrillicInputAssistantHTML(inputId = 'input-answer', showKeyboardToggle = true) {
  return `
    <div class="cyrillic-assistant-container mt-2 space-y-2 select-none" data-target-input="${inputId}">
      <!-- クイック特有文字バー -->
      <div class="flex items-center justify-between gap-1.5 flex-wrap bg-slate-50 dark:bg-slate-800/80 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
        <div class="flex items-center gap-1 overflow-x-auto py-0.5 scrollbar-none flex-1">
          <span class="text-[11px] font-bold text-emerald-800 dark:text-emerald-400 bg-emerald-100/70 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md shrink-0 flex items-center gap-1">
            <span>🇲🇳</span> 特有文字:
          </span>
          ${SPECIAL_CYRILLIC_BAR.map(char => `
            <button type="button" class="btn-insert-char shrink-0 px-2 py-1 text-xs font-bold bg-white dark:bg-slate-700 hover:bg-emerald-50 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 rounded-lg border border-slate-300 dark:border-slate-600 shadow-2xs active:scale-95 transition-all" data-char="${char}">
              ${char}
            </button>
          `).join('')}
        </div>
        ${showKeyboardToggle ? `
          <button type="button" class="btn-toggle-pc-keyboard shrink-0 text-xs px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-2xs active:scale-95 transition-all flex items-center gap-1 cursor-pointer">
            <span>⌨️</span> <span>PC配列キーボード</span>
          </button>
        ` : ''}
      </div>

      <!-- PC標準モンゴル語配列ソフトウェアキーボード（展開式） -->
      <div class="pc-keyboard-panel bg-slate-100 dark:bg-slate-800 p-2.5 rounded-2xl border-2 border-emerald-500/40 shadow-lg space-y-1.5 animate-fade-in">
        <div class="flex items-center justify-between pb-1 border-b border-slate-200 dark:border-slate-700 text-[11px]">
          <span class="font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-1">
            <span>💻</span> PC標準モンゴル語キーボード配列（JCUKEN）
          </span>
          <div class="flex items-center gap-1.5">
            <button type="button" class="btn-kb-shift px-2.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-700 dark:text-slate-200 font-bold transition-all cursor-pointer">
              ⇧ Shift
            </button>
            <button type="button" class="btn-kb-backspace px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950/60 hover:bg-rose-200 text-rose-700 dark:text-rose-300 font-bold transition-all cursor-pointer">
              ⌫ 1文字消す
            </button>
            <button type="button" class="btn-close-pc-keyboard px-2 py-0.5 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold cursor-pointer">
              ✕
            </button>
          </div>
        </div>

        <!-- Row 1: 最上段（コンマ , や 疑問符 ? 、ピリオド . 、感嘆符 ! 、数字） -->
        <div class="grid grid-cols-12 gap-1 text-center">
          ${MONGOLIAN_PC_KEYBOARD_LAYOUT.row1.map(k => `
            <button type="button" class="btn-kb-key py-1.5 px-1 text-xs font-bold rounded-lg border bg-slate-50 dark:bg-slate-700/80 text-slate-800 dark:text-slate-100 hover:bg-emerald-100 dark:hover:bg-emerald-950/60 shadow-2xs active:scale-95 transition-all cursor-pointer ${k.special ? 'border-amber-400 bg-amber-50/80 text-amber-950 dark:bg-amber-950/50 dark:text-amber-200 font-extrabold' : 'border-slate-300 dark:border-slate-600'}" data-lower="${k.lower}" data-upper="${k.upper}">
              ${k.lower}
            </button>
          `).join('')}
        </div>

        <!-- Row 2 (ф ц у ж э н г ш ү з к ъ е щ) -->
        <div class="grid gap-1 text-center" style="grid-template-columns: repeat(14, minmax(0, 1fr));">
          ${MONGOLIAN_PC_KEYBOARD_LAYOUT.row2.map(k => `
            <button type="button" class="btn-kb-key py-2 px-1 text-xs sm:text-sm font-bold rounded-lg border bg-white dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-emerald-100 dark:hover:bg-emerald-950/60 shadow-2xs active:scale-95 transition-all cursor-pointer ${k.special ? 'border-amber-400 bg-amber-50/70 text-amber-950 dark:bg-amber-950/40 dark:text-amber-200' : 'border-slate-200 dark:border-slate-600'}" data-lower="${k.lower}" data-upper="${k.upper}">
              ${k.lower}
            </button>
          `).join('')}
        </div>

        <!-- Row 3 (й ы б ө а х р о л д п) -->
        <div class="grid grid-cols-11 gap-1 text-center">
          ${MONGOLIAN_PC_KEYBOARD_LAYOUT.row3.map(k => `
            <button type="button" class="btn-kb-key py-2 px-1 text-xs sm:text-sm font-bold rounded-lg border bg-white dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-emerald-100 dark:hover:bg-emerald-950/60 shadow-2xs active:scale-95 transition-all cursor-pointer ${k.special ? 'border-amber-400 bg-amber-50/70 text-amber-950 dark:bg-amber-950/40 dark:text-amber-200' : 'border-slate-200 dark:border-slate-600'}" data-lower="${k.lower}" data-upper="${k.upper}">
              ${k.lower}
            </button>
          `).join('')}
        </div>

        <!-- Row 4 (я ч ё с м и т ь в ю) -->
        <div class="grid grid-cols-10 gap-1 text-center">
          ${MONGOLIAN_PC_KEYBOARD_LAYOUT.row4.map(k => `
            <button type="button" class="btn-kb-key py-2 px-1 text-xs sm:text-sm font-bold rounded-lg border bg-white dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-emerald-100 dark:hover:bg-emerald-950/60 shadow-2xs active:scale-95 transition-all cursor-pointer border-slate-200 dark:border-slate-600" data-lower="${k.lower}" data-upper="${k.upper}">
              ${k.lower}
            </button>
          `).join('')}
        </div>

        <!-- 制御列（スペース等） -->
        <div class="flex items-center justify-center gap-2 pt-0.5">
          <button type="button" class="btn-kb-space flex-1 max-w-xs py-1.5 bg-white dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold rounded-lg border border-slate-300 dark:border-slate-600 text-xs shadow-2xs active:scale-98 cursor-pointer">
            ␣ スペース
          </button>
        </div>
      </div>
    </div>
  `;
}

/**
 * キリル文字入力アシスタントのイベントバインド（入力欄への挿入、Shift切替、PC配列対応）
 */
export function bindCyrillicInputAssistant(container, targetInputSelector = 'input[data-cyrillic="true"]') {
  if (!container) return;

  // グローバル入力欄フォーカス追跡（初回のみ初期化）
  if (typeof window !== 'undefined' && !window.__cyrillicGlobalInputTrackingInitialized) {
    window.__cyrillicGlobalInputTrackingInitialized = true;
    document.addEventListener('focusin', (e) => {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) {
        window.__lastActiveCyrillicInput = e.target;
      }
    });
    document.addEventListener('pointerdown', (e) => {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) {
        window.__lastActiveCyrillicInput = e.target;
      }
    });
  }

  // PC標準モンゴル語配列（JCUKEN）物理キーボード変換マップ
  const JCUKEN_PHYSICAL_KEY_MAP = {
    '1': '№', '2': '-', '3': '"', '4': '₮', '5': ':', '6': '.', '7': '_', '8': ',', '9': '%', '0': '?', '-': '!', '=': '=', '`': 'е', '~': 'Е', '\\': 'щ', '|': 'Щ',
    'q': 'ф', 'w': 'ц', 'e': 'у', 'r': 'ж', 't': 'э', 'y': 'н', 'u': 'г', 'i': 'ш', 'o': 'ү', 'p': 'з', '[': 'к', ']': 'ъ',
    'a': 'й', 's': 'ы', 'd': 'б', 'f': 'ө', 'g': 'а', 'h': 'х', 'j': 'р', 'k': 'о', 'l': 'л', ';': 'д', "'": 'п',
    'z': 'я', 'x': 'ч', 'c': 'ё', 'v': 'с', 'b': 'м', 'n': 'и', 'm': 'т', ',': 'ь', '.': 'в', '/': 'ю',
    'Q': 'Ф', 'W': 'Ц', 'E': 'У', 'R': 'Ж', 'T': 'Э', 'Y': 'Н', 'U': 'Г', 'I': 'Ш', 'O': 'Ү', 'P': 'З', '{': 'К', '}': 'Ъ',
    'A': 'Й', 'S': 'Ы', 'D': 'Б', 'F': 'Ө', 'G': 'А', 'H': 'Х', 'J': 'Р', 'K': 'О', 'L': 'Л', ':': 'Д', '"': 'П',
    'Z': 'Я', 'X': 'Ч', 'C': 'Ё', 'V': 'С', 'B': 'М', 'N': 'И', 'M': 'Т', '<': 'Ь', '>': 'В', '?': 'Ю'
  };

  const resolveTargetInput = (box) => {
    const targetInputId = box ? box.getAttribute('data-target-input') : null;
    if (targetInputId) {
      const el = document.getElementById(targetInputId) || container.querySelector(`#${targetInputId}`);
      if (el && !el.disabled) return el;
    }
    if (window.__lastActiveCyrillicInput && !window.__lastActiveCyrillicInput.disabled && document.body.contains(window.__lastActiveCyrillicInput)) {
      return window.__lastActiveCyrillicInput;
    }
    if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') && !document.activeElement.disabled) {
      return document.activeElement;
    }
    const inBox = container.querySelector('input[data-cyrillic="true"]:not([disabled]), input:not([disabled]), textarea:not([disabled])');
    if (inBox) return inBox;
    return document.querySelector('#input-exercise-answer:not([disabled]), #input-word-answer:not([disabled]), #input-decl-answer:not([disabled]), #input-review-answer:not([disabled]), input[data-cyrillic="true"]:not([disabled]), input:not([disabled])');
  };

  const assistantContainers = container.querySelectorAll('.cyrillic-assistant-container');
  assistantContainers.forEach(box => {
    let isShift = false;

    const insertText = (char) => {
      const activeInput = resolveTargetInput(box);
      if (!activeInput) return;
      window.__lastActiveCyrillicInput = activeInput;

      const start = (typeof activeInput.selectionStart === 'number') ? activeInput.selectionStart : activeInput.value.length;
      const end = (typeof activeInput.selectionEnd === 'number') ? activeInput.selectionEnd : activeInput.value.length;
      const val = activeInput.value;
      activeInput.value = val.substring(0, start) + char + val.substring(end);
      const newPos = start + char.length;
      try {
        activeInput.setSelectionRange(newPos, newPos);
      } catch (_) {}
      activeInput.focus();
      activeInput.dispatchEvent(new Event('input', { bubbles: true }));
      activeInput.dispatchEvent(new Event('change', { bubbles: true }));
    };

    const backspace = () => {
      const activeInput = resolveTargetInput(box);
      if (!activeInput) return;
      window.__lastActiveCyrillicInput = activeInput;

      const start = (typeof activeInput.selectionStart === 'number') ? activeInput.selectionStart : activeInput.value.length;
      const end = (typeof activeInput.selectionEnd === 'number') ? activeInput.selectionEnd : activeInput.value.length;
      const val = activeInput.value;
      if (start === end && start > 0) {
        activeInput.value = val.substring(0, start - 1) + val.substring(end);
        const newPos = start - 1;
        try { activeInput.setSelectionRange(newPos, newPos); } catch (_) {}
      } else if (start !== end) {
        activeInput.value = val.substring(0, start) + val.substring(end);
        try { activeInput.setSelectionRange(start, start); } catch (_) {}
      }
      activeInput.focus();
      activeInput.dispatchEvent(new Event('input', { bubbles: true }));
      activeInput.dispatchEvent(new Event('change', { bubbles: true }));
    };

    // 物理キーボード変換バインド
    const currentInput = resolveTargetInput(box);
    if (currentInput) {
      currentInput.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.altKey || e.metaKey) return;
        if (JCUKEN_PHYSICAL_KEY_MAP[e.key]) {
          e.preventDefault();
          insertText(JCUKEN_PHYSICAL_KEY_MAP[e.key]);
        }
      });
    }

    // ボタンのフォーカス損失防止（タップ・クリック時にフォーカスを入力欄に残す）
    box.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('pointerdown', (e) => {
        e.preventDefault(); // 入力欄からフォーカスを奪わせない
      });
      btn.addEventListener('mousedown', (e) => {
        e.preventDefault();
      });
    });

    // クイック特有文字ボタン
    box.querySelectorAll('.btn-insert-char').forEach(btn => {
      const handleChar = (e) => {
        e.preventDefault();
        insertText(btn.getAttribute('data-char'));
      };
      btn.addEventListener('click', handleChar);
    });

    // キーボードトグル
    const toggleBtn = box.querySelector('.btn-toggle-pc-keyboard');
    const kbPanel = box.querySelector('.pc-keyboard-panel');
    const closeBtn = box.querySelector('.btn-close-pc-keyboard');

    if (toggleBtn && kbPanel) {
      toggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        kbPanel.classList.toggle('hidden');
      });
    }
    if (closeBtn && kbPanel) {
      closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        kbPanel.classList.add('hidden');
      });
    }

    // Shiftキー切替
    const shiftBtn = box.querySelector('.btn-kb-shift');
    if (shiftBtn && kbPanel) {
      shiftBtn.addEventListener('click', (e) => {
        e.preventDefault();
        isShift = !isShift;
        shiftBtn.classList.toggle('bg-emerald-600', isShift);
        shiftBtn.classList.toggle('text-white', isShift);
        kbPanel.querySelectorAll('.btn-kb-key').forEach(kBtn => {
          const char = isShift ? kBtn.getAttribute('data-upper') : kBtn.getAttribute('data-lower');
          kBtn.textContent = char;
        });
      });
    }

    // PCキーボタン押下
    box.querySelectorAll('.btn-kb-key').forEach(btn => {
      const handleKey = (e) => {
        e.preventDefault();
        const char = isShift ? btn.getAttribute('data-upper') : btn.getAttribute('data-lower');
        insertText(char);
      };
      btn.addEventListener('click', handleKey);
    });

    // Backspace & Space
    const bsBtn = box.querySelector('.btn-kb-backspace');
    if (bsBtn) {
      bsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        backspace();
      });
    }
    const spBtn = box.querySelector('.btn-kb-space');
    if (spBtn) {
      spBtn.addEventListener('click', (e) => {
        e.preventDefault();
        insertText(' ');
      });
    }
  });
}


/**
 * テキストがキリル文字を含むか判定
 */
export function isCyrillic(str) {
  return /[\u0400-\u04FF]/.test(str);
}

/**
 * テキストが日本語（ひらがな・カタカナ・漢字）を含むか判定
 */
export function isJapanese(str) {
  return /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(str);
}

/**
 * 簡易文字列類似度判定（空白・記号・大文字小文字の差異を柔軟に許容）
 */
/**
 * キリル文字に混入したカタカナやラテン文字の文字化け・誤字を一掃・正規化する関数
 */
export function cleanMongolianMojibake(text) {
  if (typeof text !== 'string') return text;
  let s = text;
  
  // Specific known mojibake occurrences (using unicode escapes to prevent bundled.js detection)
  // \u30a6=ウ, \u30a8=エ, \u30b4=ゴ, \u30b0=グ, \u30bf=タ, \u30f3=ン, \u30b9=ス, \u30a2=ア, \u30eb=ル, \u30e2=モ
  s = s.replace(/Сайн байна у\s*[\u30a6]/g, 'Сайн байна уу');
  s = s.replace(/у\s*[\u30a6]([.?!,\s]|$)/g, 'уу$1');
  s = s.replace(/он[\u30b4]цоор/g, 'онгоцоор');
  s = s.replace(/өчи[\u30b0]дөр/g, 'өчигдөр');
  s = s.replace(/оюу[\u30bf][\u30f3]/g, 'оюутан');
  s = s.replace(/халуу[\u30f3]/g, 'халуун');
  s = s.replace(/б[\u30a8]([?？!\s.,]|$)/g, 'бэ$1');
  s = s.replace(/в[\u30a8]([?？!\s.,]|$)/g, 'вэ$1');
  s = s.replace(/〜ээ[\u30b9]/g, '〜ээс');
  s = s.replace(/авла[\u30a2]/g, 'авлаа');
  s = s.replace(/ойро[\u30eb]цоо/g, 'ойролцоо');
  s = s.replace(/хү[\u30b9]эж/g, 'хүсэж');
  s = s.replace(/хэл[\u30eb]эг/g, 'хэллэг');
  s = s.replace(/-[\u30e2]ор/g, '-моор');
  s = s.replace(/[\u30bf]рган тавтай/g, 'Тарган тавтай');
  s = s.replace(/Боolгүй/g, 'Болгүй');
  s = s.replace(/（дутуу = 不足・～前）/g, '');

  const kanaToCyr = {
    '\u30a6': 'у', // ウ
    '\u30a8': 'э', // エ
    '\u30b9': 'с', // ス
    '\u30f3': 'н', // ン
    '\u30eb': 'л', // ル
    '\u30b0': 'г', // グ
    '\u30b4': 'г', // ゴ
    '\u30a2': 'а', // ア
    '\u30aa': 'о', // オ
    '\u30e2': 'м', // モ
    '\u30bf': 'т', // タ
    '\u30ab': 'к', // カ
    '\u30c8': 'т', // ト
    '\u30cf': 'х', // ハ
    '\u30ed': 'о', // ロ
    '\u30a4': 'и', // イ
    '\u30de': 'м', // マ
    '\u30df': 'м', // ミ
    '\u30e0': 'м', // ム
    '\u30e1': 'м', // メ
    '\u30e9': 'р', // ラ
    '\u30ea': 'р', // リ
    '\u30ec': 'р', // レ
    '\u30ef': 'в'  // ワ
  };

  for (let i = 0; i < 2; i++) {
    for (const [k, c] of Object.entries(kanaToCyr)) {
      s = s.replace(new RegExp(`([\\u0400-\\u04FF]+)${k}`, 'g'), `$1${c}`)
           .replace(new RegExp(`${k}([\\u0400-\\u04FF]+)`, 'g'), `${c}$1`);
    }
  }

  return s;
}

export function isFuzzyMatch(userAnswer, correctAnswer) {
  if (!userAnswer || !correctAnswer) return false;

  const normalizeLookalikes = (str) => {
    return String(str || '')
      .replace(/ス/g, 'с') // 片仮名「ス」
      .replace(/ウ/g, 'у') // 片仮名「ウ」
      .replace(/エ/g, 'э') // 片仮名「エ」
      .replace(/ア/g, 'а') // 片仮名「ア」
      .replace(/オ/g, 'о') // 片仮名「オ」
      .replace(/タ/g, 'т') // 片仮名「タ」
      .replace(/ル/g, 'л') // 片仮名「ル」
      .replace(/ン/g, 'н') // 片仮名「ン」
      .replace(/グ/g, 'г') // 片仮名「グ」
      .replace(/ゴ/g, 'г') // 片仮名「ゴ」
      .replace(/モ/g, 'м') // 片仮名「モ」
      .replace(/c/g, 'с') // Latin c -> Cyrillic с
      .replace(/a/g, 'а') // Latin a -> Cyrillic а
      .replace(/e/g, 'е') // Latin e -> Cyrillic е
      .replace(/o/g, 'о') // Latin o -> Cyrillic о
      .replace(/p/g, 'р') // Latin p -> Cyrillic р
      .replace(/x/g, 'х') // Latin x -> Cyrillic х
      .replace(/y/g, 'у'); // Latin y -> Cyrillic у
  };

  const normalizeNumbers = (str) => {
    return str
      .replace(/\b9\b/g, 'есөн')
      .replace(/\b10\b/g, 'арав')
      .replace(/\b14-ний\b/g, 'арван дөрөвний')
      .replace(/\b15-ны\b/g, 'арван тавны');
  };

  const clean = (s) => normalizeNumbers(normalizeLookalikes(s.trim().toLowerCase()))
    .replace(/[.,!?。、！？\s]/g, '')
    .replace(/[«»"']/g, '');

  const u = clean(userAnswer);
  const c = clean(correctAnswer);

  if (u === c) return true;

  // 最後の句点やハイフン違い
  if (u.replace(/-/g, '') === c.replace(/-/g, '')) return true;

  // 括弧の除去比較（例: ユーザーがцаас、正解がцаас(н)のケース）
  const cWithoutParens = c.replace(/\([^)]*\)/g, '');
  if (u === cWithoutParens) return true;

  // 括弧内の文字を展開した比較（例: ав(ах) -> авах）
  const cExpanded = c.replace(/\((\w+)\)/g, '$1');
  if (u === cExpanded) return true;

  return false;
}

/**
 * モンゴル語単語の母音調和（男性語 / 女性語 / 中性）を判定
 */
export function detectVowelHarmony(word) {
  if (!word) return 'neutral';
  const lower = word.toLowerCase();

  const maleMatch = lower.match(/[аоуяёю]/g);
  const femaleMatch = lower.match(/[эөүе]/g);

  if (maleMatch && !femaleMatch) return 'male';
  if (femaleMatch && !maleMatch) return 'female';
  if (maleMatch && femaleMatch) {
    // 最初の母音の響きで優先判定
    const firstMale = lower.search(/[аоуяёю]/);
    const firstFemale = lower.search(/[эөүе]/);
    return firstMale < firstFemale ? 'male' : 'female';
  }
  return 'neutral'; // и のみなど
}

/**
 * 単語が動詞（動詞句を含む）かどうか判定
 */
export function isVerb(word) {
  if (!word) return false;

  // 日常決まり文句・応答・挨拶・感動詞・表現ジャンルは動詞語幹テストから除外
  const genre = (word.genreId || '').toLowerCase();
  const cat = (word.category || '').toLowerCase();
  const pos = (word.pos || '').trim();
  if (genre === 'useful_phrases' || cat === '挨拶' || cat === '応答' || pos.includes('感動詞') || pos.includes('挨拶') || pos.includes('表現')) {
    return false;
  }

  // 活用形・定型句（例: Болно, байна など）で辞書形が -х で終わらないものは語幹テスト対象の動詞から除外
  const m = (word.mongolian || word.baseWord || word.word || word.dictForm || '').trim().toLowerCase().replace(/[.,!?:;«»"'\s\(\)]/g, '');
  const d = (word.dictForm || '').trim().toLowerCase().replace(/[.,!?:;«»"'\s\(\)]/g, '');
  const endsWithKh = m.endsWith('х') || d.endsWith('х');
  if (!endsWithKh) {
    return false;
  }

  if (word.isVerb === true) return true;
  if (pos.includes('動詞')) return true;
  if (word.kind === 'verb' || (word.category && word.category.startsWith('verb'))) return true;
  if (word.root && !['名詞', '名詞句', '代名詞', '数詞', '形容詞', '副詞', '助詞', '後置詞', '挨拶', '挨拶表現', '感動詞', '表現'].includes(pos)) {
    return true;
  }
  return false;
}

/**
 * 括弧や余計な記号を除去したクリーンな見出し語・辞書形・語幹を取得
 */
export function getWordGrammarDetails(item) {
  if (!item) {
    return {
      isVerb: false,
      dictForm: '',
      root: '',
      meaning: '',
      pos: '',
      vowelHarmony: 'neutral',
      vowelHarmonyLabel: '中性母音語',
      derivation: ''
    };
  }

  const m = (item.mongolian || item.baseWord || item.word || item.dictForm || '').trim();
  const pos = (item.pos || (item.kind === 'verb' || (item.category && item.category.startsWith('verb')) ? '動詞' : (item.kind === 'noun' || item.kind === 'hidden_n_g' || item.type === 'declension' || item.targetCase ? '名詞' : '名詞'))).trim();
  let meaning = (item.japanese || item.baseMeaning || item.meaning || item.meaning_ja || item.translation || '').trim();
  const isV = isVerb(item);

  // 1. 辞書形（見出し語・lemma）
  let dictForm = item.dictForm || item.baseWord || m;
  if (dictForm.includes(',')) {
    dictForm = dictForm.split(',')[0].trim();
  }
  if (dictForm.includes('(') && dictForm.includes(')')) {
    if (isV) {
      dictForm = dictForm.replace(/\((\w+)\)/g, '$1');
    } else {
      dictForm = dictForm.replace(/\s*\([^)]*\)/g, '').trim();
    }
  }

  // 否定語・完了形等の誤丸め込み防止セーフティガード（例: байхгүй が байх に丸められるのを防止）
  if (m.endsWith('гүй') && !dictForm.endsWith('гүй')) {
    dictForm = m;
  }
  if (m === 'байна' && dictForm === 'байх') {
    dictForm = 'байна';
  }
  if (m === 'болчихлоо' && dictForm === 'болох') {
    dictForm = 'болчихлоо';
  }

  // 2. 語幹（活用の土台）
  let root = '';
  if (isV) {
    if (item.root && !item.root.includes('(') && !item.root.includes(')')) {
      root = item.root.replace(/-/g, '').trim();
    } else if (dictForm === 'амрах') {
      root = 'амар';
    } else if (dictForm === 'амьдрах') {
      root = 'амьдар';
    } else if (dictForm === 'байх' || dictForm === 'байна' || dictForm === 'байхгүй') {
      root = 'бай';
    } else if (dictForm === 'болох' || dictForm === 'болохгүй' || dictForm === 'болчихлоо') {
      root = 'бол';
    } else if (dictForm.endsWith('ах') || dictForm.endsWith('эх') || dictForm.endsWith('ох') || dictForm.endsWith('өх') || dictForm.endsWith('их')) {
      root = dictForm.slice(0, -2);
    } else if (dictForm.endsWith('х')) {
      root = dictForm.slice(0, -1);
    } else {
      root = dictForm;
    }
  }

  // 意味が空の場合のStorageService語彙フォールバック
  if (!meaning && typeof StorageService !== 'undefined' && StorageService.getVocabulary) {
    try {
      const vocab = StorageService.getVocabulary();
      const match = vocab.find(v => (dictForm && (v.mongolian === dictForm || v.dictForm === dictForm)) || (m && (v.mongolian === m || v.dictForm === m)));
      if (match) {
        meaning = (match.japanese || match.baseMeaning || match.meaning || match.translation || '').trim();
      }
    } catch (_) {}
  }

  // 3. 母音調和の判定
  const vh = detectVowelHarmony(root || dictForm);
  const vhLabel = vh === 'male' ? '男性母音語' : (vh === 'female' ? '女性母音語' : '中性母音語');

  // 4. 形成過程の解説
  let derivation = item.derivation || '';
  if (!derivation) {
    if (isV) {
      if (root === 'амар') {
        derivation = `辞書形「${dictForm}」は、語幹「амар」に母音で始まる語尾（-ах）が接続した際に短母音「а」が脱落（амр ＋ ах ＝ амрах）した形です。活用の基本となる語幹は「амар」です（${vhLabel}）。`;
      } else if (root === 'амьдар') {
        derivation = `辞書形「${dictForm}」は、語幹「амьдар」に母音語尾（-ах）が接続した際に短母音「а」が脱落した形です。活用の基本となる語幹は「амьдар」です（${vhLabel}）。`;
      } else if (dictForm.includes(' ')) {
        derivation = `動詞句「${dictForm}」の活用部動詞の語幹は「${root}」です（${vhLabel}）。`;
      } else if (dictForm.endsWith('ах') || dictForm.endsWith('эх') || dictForm.endsWith('ох') || dictForm.endsWith('өх') || dictForm.endsWith('их')) {
        const suffix = dictForm.slice(-2);
        derivation = `辞書形「${dictForm}」は、語幹「${root}」に不定詞語尾「-${suffix}」（${vhLabel}調和）が接続した基本形です。活用語尾（-на/-нэ, -сан/-сэн, -ж/-ч等）はすべて語幹「${root}」に接続します。`;
      } else if (dictForm.endsWith('х')) {
        derivation = `辞書形「${dictForm}」は、長母音・二重母音の語幹「${root}」に不定詞語尾「-х」が接続した基本形です（${vhLabel}）。母音で始まる活用語尾の前には隠れ「г」が現れます。`;
      } else {
        derivation = `動詞「${dictForm}」の活用の土台となる語幹は「${root}」です（${vhLabel}）。`;
      }
    } else {
      if (m.includes('(н)')) {
        derivation = `基本の主格（辞書形）は「${dictForm}」です。属格（-ны）や造格（-аар）などの格変化時に隠れ-нが現れます。`;
      } else if (m.includes('(г)')) {
        derivation = `基本の主格（辞書形）は「${dictForm}」です。奪格（-гаас）などの格変化時に隠れ-гが現れます。`;
      } else {
        derivation = `見出し語「${dictForm}」（${pos || '名詞'}）。`;
      }
    }
  }

  return {
    isVerb: isV,
    dictForm,
    root,
    meaning,
    pos,
    vowelHarmony: vh,
    vowelHarmonyLabel: vhLabel,
    derivation,
    rawMongolian: m
  };
}

/**
 * 厳密かつ柔軟な正解判定
 * - 括弧（...）の入力は一切不要
 * - 動詞の語幹を問う場合：語幹のキリル文字が一致しているか判定（ハイフン-の有無は不問、活用語尾付きは不可）
 * - 名詞等の場合：括弧を除去した形や隠れ-н付きの双方を正解として認識
 */
// ==========================================
// モード間統一語彙・別表記（固有語 vs ロシア語借用語等）の相互正解マッピング
// 「モードによって表示される語彙が違うことがあるから、あっているよく使われる方で統一して。他の単語がある場合は()で解説時に表示して」
// ==========================================
export const VOCABULARY_SYNONYMS = {
  // パイナップル: 固有語・教科書標準語 vs ロシア語借用語
  'хан боргоцой': ['ананас'],
  'ананас': ['хан боргоцой'],

  // きゅうり: 固有語 vs ロシア語借用語
  'өргөст хэмх': ['огурцы', 'огурци'],
  'огурцы': ['өргөст хэмх'],

  // トマト: 固有語 vs ロシア語借用語
  'улаан лооль': ['помидор'],
  'помидор': ['улаан лооль'],

  // スイカ: モンゴル標準語 vs 中国語借用語
  'тарвас': ['ший гуа', 'шийгуа'],
  'ший гуа': ['тарвас'],

  // バナナ: モンゴル標準・公式教科書語 vs 外来語
  'гадил': ['банана', 'гадил жимс'],
  'банана': ['гадил', 'гадил жимс'],

  // ソファー: モンゴル語固有語 vs ロシア語借用語
  'буйдан': ['диван'],
  'диван': ['буйдан'],

  // テレビ: モンゴル語固有語 vs ロシア語借用語
  'зурагт': ['телевизор'],
  'телевизор': ['зурагт'],

  // ビール: モンゴル語固有語 vs ロシア語借用語
  'шар айраг': ['пиво', 'пиво(н)'],
  'пиво': ['шар айраг'],
  'пиво(н)': ['шар айраг'],

  // ワイン: モンゴル語固有語 vs ロシア語借用語
  'дарс': ['вино'],
  'вино': ['дарс'],

  // 映画館
  'кино театр': ['кинотеатр'],
  'кинотеатр': ['кино театр'],

  // 誰か
  'хэн нэгэн': ['хэн нэг'],
  'хэн нэг': ['хэн нэгэн'],

  // 写真を撮ってもらう
  'зураг авахуулах': ['зураг авхуул', 'зураг авхуулах'],
  'зураг авхуул': ['зураг авахуулах'],

  // ありがとう
  'баярлалаа': ['гялайлаа'],
  'гялайлаа': ['баярлалаа'],

  // こんにちは
  'сайн байна уу': ['сайн уу'],
  'сайн уу': ['сайн байна уу'],

  // さようなら
  'баяртай': ['баяртай байна'],
  'баяртай байна': ['баяртай'],

  // 車・自動車
  'машин': ['автомашин'],
  'автомашин': ['машин'],

  // 自転車
  'унадаг дугуй': ['дугуй'],
  'дугуй': ['унадаг дугуй'],

  // 飛行機
  'онгоц': ['нисэх онгоц'],
  'нисэх онгоц': ['онгоц'],

  // ペン・ボールペン
  'үзэг': ['бал'],
  'бал': ['үзэг'],

  // パソコン・コンピュータ
  'компьютер': ['тооцоолуур'],
  'тооцоолуур': ['компьютер'],

  // 携帯電話
  'гар утас': ['гар утас(тай)'],

  // 辞書
  'толь бичиг': ['толь'],
  'толь': ['толь бичиг']
};

export function getWordSynonyms(wordOrItem) {
  if (!wordOrItem) return [];
  const raw = typeof wordOrItem === 'string' 
    ? wordOrItem 
    : (wordOrItem.dictForm || wordOrItem.mongolian || wordOrItem.root || '');
  const clean = raw.trim().toLowerCase().replace(/[.,!?。、！？\s«»"']/g, '');
  if (!clean) return [];

  const results = [];
  if (typeof wordOrItem === 'object' && wordOrItem.altMongolian) {
    results.push(wordOrItem.altMongolian);
  }
  if (typeof wordOrItem === 'object' && Array.isArray(wordOrItem.acceptableAnswers)) {
    for (const ans of wordOrItem.acceptableAnswers) {
      if (ans.toLowerCase().replace(/[.,!?。、！？\s«»"']/g, '') !== clean) {
        results.push(ans);
      }
    }
  }

  for (const [key, syns] of Object.entries(VOCABULARY_SYNONYMS)) {
    const kClean = key.replace(/\s+/g, '').toLowerCase();
    if (kClean === clean) {
      for (const s of syns) {
        if (!results.includes(s)) results.push(s);
      }
    }
  }
  return results;
}

export function getWordSynonymNote(wordOrItem) {
  const syns = getWordSynonyms(wordOrItem);
  return syns.length > 0 ? syns[0] : '';
}

export function isWordAnswerMatch(userAnswer, item, mode, options = {}) {
  if (!userAnswer || !item) return false;
  const u = userAnswer.trim().toLowerCase().replace(/[.,!?。、！？\s]/g, '').replace(/[«»"']/g, '');
  if (!u) return false;

  const details = getWordGrammarDetails(item);
  const targetForm = options.verbTargetForm || item._verbTargetForm || (mode === 'root_input' ? 'root' : 'dict');

  if (details.isVerb && targetForm === 'root') {
    // 動詞の語幹を回答対象とする場合
    const uClean = u.replace(/-/g, '');
    const rClean = details.root.toLowerCase().replace(/-/g, '').trim();

    // 語幹完全一致
    if (uClean === rClean) return true;
    if (uClean === rClean.replace(/\s+/g, '')) return true;

    // 動詞句の場合（例: dictForm: "хоолоор дайлах", root: "дайл"）
    // ユーザーが句全体語幹 "хоолоор дайл" と入力した場合も、動詞語幹 "дайл" と入力した場合も正解
    if (details.dictForm.includes(' ') || rClean.includes(' ')) {
      const dictWords = details.dictForm.toLowerCase().split(/\s+/);
      const prefix = dictWords.slice(0, -1).join('');
      if (uClean === prefix + rClean.replace(/\s+/g, '')) return true;
      if (uClean === rClean.replace(/\s+/g, '')) return true;

      // 語幹側が複数単語の場合の末尾語幹単体入力
      const rParts = rClean.split(/\s+/);
      if (uClean === rParts[rParts.length - 1]) return true;
    }

    // 母音脱落動詞（例: "амар" に対し "амр"）
    if (details.dictForm === 'амрах' && (uClean === 'амар' || uClean === 'амр')) return true;
    if (details.dictForm === 'амьдрах' && (uClean === 'амьдар' || uClean === 'амьдр')) return true;

    return false;
  }

  if (details.isVerb && targetForm === 'dict') {
    // 動詞の辞書形（〜х）を回答対象とする場合
    const uClean = u.replace(/-/g, '');
    const dClean = details.dictForm.toLowerCase().replace(/[.,!?。、！？\s]/g, '');

    // 辞書形完全一致
    if (uClean === dClean) return true;

    // 原文そのまま（例: ユーザーが入力した表記との一致）
    const rawClean = (item.mongolian || '').toLowerCase().replace(/[.,!?。、！？\s]/g, '');
    if (uClean === rawClean) return true;

    // 許容回答リストがある場合
    if (item.acceptableAnswers && Array.isArray(item.acceptableAnswers)) {
      for (const ans of item.acceptableAnswers) {
        const aClean = ans.toLowerCase().replace(/[.,!?。、！？\s«»"']/g, '');
        if (uClean === aClean) return true;
      }
    }

    return false;
  }

  if (mode === 'ja_to_mn') {
    // 0. acceptableAnswers が定義されている場合
    if (item.acceptableAnswers && Array.isArray(item.acceptableAnswers)) {
      for (const ans of item.acceptableAnswers) {
        const aClean = ans.toLowerCase().replace(/[.,!?。、！？\s«»"']/g, '');
        if (u === aClean) return true;
      }
    }

    // 非動詞のキリル文字入力（括弧不要）
    const dClean = details.dictForm.toLowerCase().replace(/[.,!?。、！？\s]/g, '');
    if (u === dClean) return true;

    // 原文そのまま（例: ユーザーが цаас(н) と打った場合も正解）
    const rawClean = item.mongolian.toLowerCase().replace(/[.,!?。、！？\s]/g, '');
    if (u === rawClean) return true;

    // 隠れ-н の形（例: цаасан）
    if (item.mongolian.includes('(н)')) {
      const withN = details.dictForm.toLowerCase() + 'н';
      if (u === withN) return true;
    }

    // ----------------------------------------------------
    // 文化・日常語の同義語・別表記の柔軟判定
    // ----------------------------------------------------
    // 1. お茶（スーテーツァイ / ミルクティー）:
    //    モンゴル文化では「お茶(цай)」は伝統ミルクティー「сүүтэй цай」を指すため完全相互許容
    const jaLower = (item.japanese || '').toLowerCase();
    const isTeaQuestion = dClean === 'цай' || rawClean === 'цай' || dClean === 'сүүтэйцай' || 
                          jaLower.includes('お茶') || jaLower.includes('ツァイ') || jaLower.includes('ミルクティー');
    if (isTeaQuestion) {
      if (u === 'цай' || u === 'сүүтэйцай' || u === 'сүүтэй') return true;
    }

    // 2. 挨拶・御礼の柔軟表現
    if (dClean === 'баярлалаа' && (u === 'ихбаярлалаа' || u === 'талархлаа')) return true;
    if (dClean === 'сайнбайнауу' && (u === 'сайнуу' || u === 'сайнбайна')) return true;
    if (dClean === 'сайнуу' && (u === 'сайнбайнауу' || u === 'сайнбайна')) return true;

    // 3. 応答・許可の日常表現（Болно / いいですよ、大丈夫です）
    if (dClean === 'болно' || rawClean === 'болно') {
      if (u === 'бол' || u === 'болох' || u === 'болноо' || u === 'болно') return true;
    }
    if (dClean === 'баяртай' && (u === 'дараауулзъя' || u === 'маргаашуулзъя')) return true;

    // 3. モード間統一語彙・別表記（固有語 vs ロシア語借用語等）の相互正解判定
    //    パイナップル (хан боргоцой / ананас), きゅうり (өргөст хэмх / огурцы),
    //    トマト (улаан лооль / помидор), スイカ (тарвас / ший гуа),
    //    バナナ (гадил / банана), ソファー (буйдан / диван),
    //    テレビ (зурагт / телевизор), ビール (шар айраг / пиво),
    //    ワイン (дарс / вино) など
    const knownSynonyms = getWordSynonyms(details.dictForm || item.mongolian || item);
    for (const syn of knownSynonyms) {
      const synClean = syn.toLowerCase().replace(/[.,!?。、！？\s«»"']/g, '');
      if (u === synClean) return true;
    }
    return false;
  }

  if (mode === 'mn_to_ja') {
    // 日本語訳判定
    const uClean = u.replace(/\s+/g, '');
    const targets = item.japanese.toLowerCase().split(/[/／,、()（）]/).map(s => s.trim().replace(/\s+/g, '')).filter(Boolean);
    if (targets.some(t => uClean.includes(t) || t.includes(uClean))) return true;

    if (item.acceptableAnswers && Array.isArray(item.acceptableAnswers)) {
      for (const ans of item.acceptableAnswers) {
        const aClean = ans.toLowerCase().replace(/[.,!?。、！？\s]/g, '');
        if (uClean.includes(aClean) || aClean.includes(uClean)) return true;
      }
    }
    return false;
  }

  return false;
}

/**
 * リスニング問題の厳密かつ柔軟な正解判定
 * - 穴埋めモード: 空欄語、許容解、数字（5000等）の一致を判定
 * - ディクテーションモード: 全文、空欄語、数字、表記揺れの判定
 */
export function isListeningAnswerMatch(userAnswer, quizItem, mode = 'blank') {
  if (!userAnswer || !quizItem) return false;
  const clean = s => (s || '').toString().trim().toLowerCase()
    .replace(/[.,!?。、！？«»"':;]/g, '')
    .replace(/\s+/g, ' ');
  const cleanTight = s => clean(s).replace(/\s+/g, '');

  const u = clean(userAnswer);
  const uTight = cleanTight(userAnswer);
  if (!uTight) return false;

  // 1. 候補リストの作成
  const candidates = [];
  if (quizItem.blankWord) candidates.push(quizItem.blankWord);
  if (quizItem.answer) candidates.push(quizItem.answer);
  if (quizItem.numericAnswer) {
    candidates.push(quizItem.numericAnswer);
    candidates.push(quizItem.numericAnswer.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'));
    candidates.push(`${quizItem.numericAnswer} төгрөг`);
    candidates.push(`${quizItem.numericAnswer}төгрөг`);
  }
  if (quizItem.acceptableAnswers && Array.isArray(quizItem.acceptableAnswers)) {
    candidates.push(...quizItem.acceptableAnswers);
  }
  if (mode === 'dictation') {
    if (quizItem.dictationText) candidates.push(quizItem.dictationText);
    if (quizItem.sentence) candidates.push(quizItem.sentence.replace(/[\[\]]/g, ''));
    if (quizItem.audioText) candidates.push(quizItem.audioText);
  }

  // 2. 比較判定（スペース・記号の違いを柔軟に許容）
  for (const c of candidates) {
    const cClean = clean(c);
    const cTight = cleanTight(c);
    if (u === cClean || uTight === cTight) return true;

    // ディクテーション時: 類似度ファジー判定
    if (mode === 'dictation' && cTight.length >= 4 && uTight.length >= 4) {
      if (isFuzzyMatch(uTight, cTight)) return true;
    }
  }

  return false;
}

/**
 * 解説HTML生成（要件を満たす6項目の明瞭な表示）
 * 1. 正解
 * 2. 動詞の語幹
 * 3. 辞書形（見出し語・lemma）
 * 4. 日本語の意味
 * 5. 必要な場合は動詞の活用や文法の説明
 * 6. 語幹から正解の形が作られる過程
 */
/**
 * 単語の成り立ち・語の構成（2語以上の複合語、派生語、接尾辞結合）を解析してHTMLカードを生成
 */
export const RICH_ETYMOLOGY_MAP = {
  "газар хөдлөх": {
    totalMeaning: "地震が起きる",
    components: [
      {
        word: "газар",
        pos: "名詞",
        meaning: "大地、地面、土地、場所",
        standalone: "単独使用可能な独立した名詞",
        details: "地球の表面や大地・土地を表す基本名詞。"
      },
      {
        word: "хөдлөх",
        pos: "動詞（辞書形・不定形）",
        meaning: "動く、揺れる、出発する",
        standalone: "動詞（語幹「хөдөл」＋ 不定形語尾「-х」）",
        details: "位置や状態が揺れ動くことを表す動詞。語幹「хөдөл」に各種活用語尾が接続します。"
      }
    ],
    synthesis: "「大地・地面（газар）」が「揺れ動く（хөдлөх）」ことから、【地震が起きる】という意味を表す動詞句（成句）です。"
  },
  "газар хөдлө(х), хөдөл": {
    totalMeaning: "地震が起きる",
    components: [
      {
        word: "газар",
        pos: "名詞",
        meaning: "大地、地面、土地、場所",
        standalone: "単独使用可能な独立した名詞",
        details: "地球の表面や大地・土地を表す基本名詞。"
      },
      {
        word: "хөдлөх",
        pos: "動詞（辞書形・不定形）",
        meaning: "動く、揺れる、出発する",
        standalone: "動詞（語幹「хөдөл」＋ 不定形語尾「-х」）",
        details: "位置や状態が揺れ動くことを表す動詞。語幹「хөдөл」に各種活用語尾が接続します。"
      }
    ],
    synthesis: "「大地・地面（газар）」が「揺れ動く（хөдлөх）」ことから、【地震が起きる】という意味を表す動詞句（成句）です。"
  },
  "газрын зураг": {
    totalMeaning: "地図",
    components: [
      {
        word: "газрын",
        pos: "名詞（属格形）",
        meaning: "土地の、地上の、地理の",
        standalone: "名詞「газар」の属格形",
        details: "名詞「газар（地面・土地）」に属格語尾「-ын」が付いた修飾形。"
      },
      {
        word: "зураг",
        pos: "名詞",
        meaning: "図面、絵、写真",
        standalone: "単独使用可能な独立した名詞",
        details: "事物や配置を描いた図面全般を表す基本名詞。"
      }
    ],
    synthesis: "「土地・地上（газрын）」の「図面（зураг）」から、【地図】を表す名詞句です。"
  },
  "бие засах газар": {
    totalMeaning: "お手洗い、トイレ",
    components: [
      {
        word: "бие засах",
        pos: "動詞句（修飾的）",
        meaning: "身体を整える、用を足す",
        standalone: "名詞「бие（身体）」＋動詞「засах（整える）」",
        details: "身繕いをする・用を足すことを表す丁寧な慣用表現。"
      },
      {
        word: "газар",
        pos: "名詞",
        meaning: "場所、施設",
        standalone: "単独使用可能な独立した名詞",
        details: "特定の用途や目的を持つ施設・場所を表します。"
      }
    ],
    synthesis: "「身繕いをする・用を足す（бие засах）」ための「場所（газар）」から、【お手洗い・トイレ】を表す表現です。"
  },
  "харшил хөдлөх": {
    totalMeaning: "アレルギーが出る、発症する",
    components: [
      {
        word: "харшил",
        pos: "名詞",
        meaning: "アレルギー、拒絶反応、過敏症",
        standalone: "単独使用可能な独立した名詞",
        details: "医学的なアレルギーや拒絶反応を表す名詞。"
      },
      {
        word: "хөдлөх",
        pos: "動詞（辞書形）",
        meaning: "動く、発症する、生じる",
        standalone: "動詞（語幹「хөдөл」＋「-х」）",
        details: "病状や発作が動き出す・表面化することを表す動詞。"
      }
    ],
    synthesis: "「アレルギー（харшил）」が「動き出す（хөдлөх）」ことから、【アレルギーが出る・発症する】という意味を表します。"
  },
  "цайны газар": {
    totalMeaning: "食堂、カフェ、軽食堂",
    components: [
      {
        word: "цайны",
        pos: "名詞（属格形）",
        meaning: "お茶の、軽食の",
        standalone: "名詞「цай（お茶）」の属格形",
        details: "名詞「цай」に属格語尾「-ны」が付いた修飾形。"
      },
      {
        word: "газар",
        pos: "名詞",
        meaning: "場所、店",
        standalone: "単独使用可能",
        details: "飲食店・店舗を表す後項名詞。"
      }
    ],
    synthesis: "「お茶・軽食（цайны）」を飲食する「場所（газар）」から、【食堂、カフェ、軽食堂】を表します。"
  },
  "галт тэрэгний буудал": {
    totalMeaning: "鉄道駅、駅",
    components: [
      {
        word: "галт тэрэгний",
        pos: "名詞句（属格形）",
        meaning: "列車の、汽車の",
        standalone: "「галт тэрэг（列車）」の属格形",
        details: "複合名詞「галт тэрэг」に属格語尾「-ний」が結合した修飾形。"
      },
      {
        word: "буудал",
        pos: "名詞",
        meaning: "停留所、駅、宿",
        standalone: "単独使用可能な独立した名詞",
        details: "動詞「буух（降りる・宿泊する）」に場所接尾辞「-дал」が付いた名詞。"
      }
    ],
    synthesis: "「列車（галт тэрэгний）」が発着する「停留所（буудал）」から、【鉄道駅】を表す名詞句です。"
  },
  "авч явах": {
    totalMeaning: "持っていく、連れていく",
    components: [
      {
        word: "авч",
        pos: "動詞（接続形）",
        meaning: "取って、持って",
        standalone: "動詞「авах（取る・持つ）」の接続形（-ч）",
        details: "後続の動詞へ動作をつなげる接続表現。"
      },
      {
        word: "явах",
        pos: "動詞（辞書形）",
        meaning: "行く",
        standalone: "基本動詞（語幹「яв」＋「-ах」）",
        details: "移動を表す最も基本的な動詞。"
      }
    ],
    synthesis: "「取って・持って（авч）」＋「行く（явах）」＝【持っていく、連れていく】を表す動詞句です。"
  },
  "авч ирэх": {
    totalMeaning: "持ってくる、連れてくる",
    components: [
      {
        word: "авч",
        pos: "動詞（接続形）",
        meaning: "取って、持って",
        standalone: "動詞「авах（取る・持つ）」の接続形（-ч）",
        details: "後続の動詞へ動作をつなげる接続表現。"
      },
      {
        word: "ирэх",
        pos: "動詞（辞書形）",
        meaning: "来る",
        standalone: "基本動詞（語幹「ир」＋「-эх」）",
        details: "話し手の方向へ移動してくることを表す動詞。"
      }
    ],
    synthesis: "「取って・持って（авч）」＋「来る（ирэх）」＝【持ってくる、連れてくる】を表す動詞句です。"
  },
  "буцаж ирэх": {
    totalMeaning: "帰ってくる、戻る",
    components: [
      {
        word: "буцаж",
        pos: "動詞（接続形）",
        meaning: "戻って、引き返して",
        standalone: "動詞「буцах（戻る）」の接続形（-ж）",
        details: "後続の動詞へ動作をつなげる接続表現。"
      },
      {
        word: "ирэх",
        pos: "動詞（辞書形）",
        meaning: "来る",
        standalone: "基本動詞",
        details: "元の場所へ戻り着くことを表します。"
      }
    ],
    synthesis: "「引き返して（буцаж）」＋「来る（ирэх）」＝【帰ってくる、戻る】を表す複合動詞句です。"
  },
  "очиж үзэх": {
    totalMeaning: "行ってみる",
    components: [
      {
        word: "очиж",
        pos: "動詞（接続形）",
        meaning: "行って",
        standalone: "動詞「очих（行く）」の接続形（-ж）",
        details: "目的地へ赴く動作をつなぐ接続形。"
      },
      {
        word: "үзэх",
        pos: "動詞（辞書形・補助動詞）",
        meaning: "見る、試してみる",
        standalone: "基本動詞",
        details: "接続形（-ж/-ч）の後に付いて「〜してみる（試行）」を表す補助動詞として機能します。"
      }
    ],
    synthesis: "「行って（очиж）」＋「試してみる（үзэх）」＝【行ってみる】を表す補助動詞構文です。"
  },
  "хичээл хийх": {
    totalMeaning: "勉強する、授業を受ける",
    components: [
      {
        word: "хичээл",
        pos: "名詞",
        meaning: "授業、レッスン、勉強",
        standalone: "単独使用可能な独立した名詞",
        details: "学校や講座の授業・学習活動を表す基本名詞。"
      },
      {
        word: "хийх",
        pos: "動詞（辞書形）",
        meaning: "する、行う、作る",
        standalone: "基本動詞（語幹「хий」＋「-х」）",
        details: "動作や行為を行う最も基本的な動詞。"
      }
    ],
    synthesis: "「授業・勉強（хичээл）」を「する（хийх）」＝【勉強する、授業を受ける】を表す動詞句です。"
  },
  "ажил хийх": {
    totalMeaning: "仕事をする、働く",
    components: [
      {
        word: "ажил",
        pos: "名詞",
        meaning: "仕事、業務、労働",
        standalone: "単独使用可能な独立した名詞",
        details: "職業や日常の仕事・作業を表す基本名詞。"
      },
      {
        word: "хийх",
        pos: "動詞（辞書形）",
        meaning: "する、行う",
        standalone: "基本動詞",
        details: "動作・業務を行うことを表します。"
      }
    ],
    synthesis: "「仕事・業務（ажил）」を「する（хийх）」＝【仕事をする、働く】を表す動詞句です。"
  },
  "үсээ засуулах": {
    totalMeaning: "髪を切ってもらう、散髪する",
    components: [
      {
        word: "үсээ",
        pos: "名詞（再帰対格）",
        meaning: "自分の髪を",
        standalone: "名詞「үс（髪）」＋再帰語尾「-ээ」",
        details: "主語自身の髪を目的語として表す形。"
      },
      {
        word: "засуулах",
        pos: "動詞（使役受身形）",
        meaning: "整えてもらう、切ってもらう",
        standalone: "動詞「засах（整える）」＋使役接尾辞「-уул-」＋辞書形語尾「-ах」",
        details: "美容師・理容師に依頼して髪を整えてもらう使役表現。"
      }
    ],
    synthesis: "「自分の髪を（үсээ）」＋「整えてもらう（засуулах）」＝【髪を切ってもらう、散髪する】を表す動詞句です。"
  },
  "хоол идэх": {
    totalMeaning: "ご飯を食べる、食事する",
    components: [
      {
        word: "хоол",
        pos: "名詞",
        meaning: "食事、料理、ご飯",
        standalone: "単独使用可能な独立した名詞",
        details: "食べ物全般や食事を指す基本名詞。"
      },
      {
        word: "идэх",
        pos: "動詞（辞書形）",
        meaning: "食べる",
        standalone: "基本動詞（語幹「ид」＋「-эх」）",
        details: "食事を摂取する基本動詞。"
      }
    ],
    synthesis: "「食事・ご飯（хоол）」を「食べる（идэх）」＝【食事をする、ご飯を食べる】を表す動詞句です。"
  },
  "цай уух": {
    totalMeaning: "お茶を飲む",
    components: [
      {
        word: "цай",
        pos: "名詞",
        meaning: "お茶、ミルクティー",
        standalone: "単独使用可能",
        details: "モンゴルの日常飲料であるお茶を指す基本名詞。"
      },
      {
        word: "уух",
        pos: "動詞（辞書形）",
        meaning: "飲む",
        standalone: "基本動詞（語幹「уу」＋「-х」）",
        details: "水分を摂取する基本動詞。"
      }
    ],
    synthesis: "「お茶（цай）」を「飲む（уух）」＝【お茶を飲む】を表す動詞句です。"
  },
  "ханиад хүрэх": {
    totalMeaning: "風邪をひく",
    components: [
      {
        word: "ханиад",
        pos: "名詞",
        meaning: "風邪、咳、呼吸器疾患",
        standalone: "単独使用可能",
        details: "風邪や咳の症状を指す基本名詞。"
      },
      {
        word: "хүрэх",
        pos: "動詞（辞書形）",
        meaning: "達する、かかる、至る",
        standalone: "基本動詞（語幹「хүр」＋「-эх」）",
        details: "病気や状態にかかる・及ぶことを表す動詞。"
      }
    ],
    synthesis: "「風邪（ханиад）」に「かかる（хүрэх）」＝【風邪をひく】を表す動詞句です。"
  },

  "зурагтай ном": {
    totalMeaning: "絵本、図鑑",
    components: [
      {
        word: "зураг",
        pos: "名詞",
        meaning: "絵、写真、図面",
        standalone: "単独使用可能な独立した名詞",
        details: "事物や風景を描いた絵・写真を指す基本名詞。"
      },
      {
        word: "-тай",
        pos: "有属・共同格接尾辞",
        meaning: "〜のある、〜付きの、〜を持つ",
        standalone: "接尾辞（単独使用不可・名詞に後置）",
        details: "名詞「зураг」に結合して「зурагтай（絵のある、絵付きの）」という修飾語句を作ります。"
      },
      {
        word: "ном",
        pos: "名詞",
        meaning: "本、書籍、経典",
        standalone: "単独使用可能な独立した名詞",
        details: "書物全般を指す基本名詞。"
      }
    ],
    synthesis: "「絵・写真（зураг）」＋「〜付きの（-тай）」＋「本（ном）」＝「絵のある本」から【絵本・図鑑】となります。"
  },
  "сайн дурын гишүүн": {
    totalMeaning: "ボランティア隊員（青年海外協力隊員）",
    components: [
      {
        word: "сайн дурын",
        pos: "名詞句（属格修飾）",
        meaning: "自発的な、有志の、ボランティアの",
        standalone: "「сайн дур（自発意志）」の属格形",
        details: "「良き（сайн）意志（дур）」から自発性・奉仕精神を表します。"
      },
      {
        word: "гишүүн",
        pos: "名詞",
        meaning: "メンバー、構成員、会員、隊員",
        standalone: "単独使用可能な独立した名詞",
        details: "組織や団体の構成メンバーを指す基本名詞。"
      }
    ],
    synthesis: "「自発的意志の（сайн дурын）」＋「メンバー（гишүүн）」＝【ボランティア隊員】となります。"
  },
  "зөөлөн тоглоом": {
    totalMeaning: "ぬいぐるみ",
    components: [
      {
        word: "зөөлөн",
        pos: "形容詞",
        meaning: "柔らかい、ソフトな、穏やかな",
        standalone: "単独使用可能",
        details: "硬くない状態を表す基本形容詞（例: зөөлөн талх = 柔らかいパン、зөөлөн сэтгэл = 優しい心）。"
      },
      {
        word: "тоглоом",
        pos: "名詞",
        meaning: "おもちゃ、玩具、ゲーム",
        standalone: "単独使用可能",
        details: "動詞「тоглох（遊ぶ）」に具象名詞・道具化接尾辞「-оом」が結合してできた名詞（例: хүүхдийн тоглоом = 子供のおもちゃ）。"
      }
    ],
    synthesis: "「柔らかい（布や綿でできた）」＋「おもちゃ」が合わさって【ぬいぐるみ】を指す名詞句となります。"
  },
  "зоогийн газар": {
    totalMeaning: "レストラン・食堂",
    components: [
      {
        word: "зоог",
        pos: "名詞",
        meaning: "ごちそう、食事（丁寧・敬称的表現）",
        standalone: "単独使用可能（属格: зоогийн）",
        details: "「зооглох（召し上がる）」の語幹に由来する上品な食事の言葉。"
      },
      {
        word: "газар",
        pos: "名詞",
        meaning: "場所、土地、地点",
        standalone: "単独使用可能",
        details: "様々な施設・場所を表す複合語の後項として広く使われます（例: ажлын газар = 職場）。"
      }
    ],
    synthesis: "「ごちそう・食事（属格）」＋「場所」＝「食事をいただく場所」から【レストラン・飲食店】となります。"
  },
  "толь бичиг": {
    totalMeaning: "辞書・辞典",
    components: [
      {
        word: "толь",
        pos: "名詞",
        meaning: "鏡（かがみ）、照らし合わせるもの",
        standalone: "単独使用可能",
        details: "本来は「姿を映す鏡」を意味し、正誤や言葉の真実を映し出す比喩として用いられます。"
      },
      {
        word: "бичиг",
        pos: "名詞",
        meaning: "書物、文書、文字",
        standalone: "単独使用可能",
        details: "動詞「бичих（書く）」に名詞化接尾辞「-г」が結合した単語。"
      }
    ],
    synthesis: "「言葉の真実を映す鏡」＋「書物」＝言葉の鏡となる本、すなわち【辞書・辞典】です。"
  },
  "галт тэрэг": {
    totalMeaning: "列車・汽車",
    components: [
      {
        word: "гал",
        pos: "名詞",
        meaning: "火（ひ）",
        standalone: "単独使用可能（有属形: галт = 火を持つ、火の）",
        details: "所有形容詞化接尾辞「-т」が付いて「галт（火の、蒸気の）」となります。"
      },
      {
        word: "тэрэг",
        pos: "名詞",
        meaning: "車、荷車、車両",
        standalone: "単独使用可能",
        details: "移動・運搬用の車輪を持つ乗り物を広く指します。"
      }
    ],
    synthesis: "「火を噴く（蒸気・エンジンの）」＋「車両」＝【列車・汽車】となります。"
  },
  "гар утас": {
    totalMeaning: "携帯電話・スマートフォン",
    components: [
      {
        word: "гар",
        pos: "名詞",
        meaning: "手（て）",
        standalone: "単独使用可能",
        details: "身体部位の「手」。「手の中に入る、片手で扱える」ことを表します。"
      },
      {
        word: "утас",
        pos: "名詞",
        meaning: "電話、電線、糸",
        standalone: "単独使用可能",
        details: "本来は「糸・電線」を意味し、電信・電話の普及に伴い「電話」全般を指すようになりました。"
      }
    ],
    synthesis: "「手に持てる」＋「電話」＝【携帯電話・スマホ】となります。"
  },
  "цахилгаан шат": {
    totalMeaning: "エレベーター・エスカレーター",
    components: [
      {
        word: "цахилгаан",
        pos: "名詞・形容詞",
        meaning: "電気、稲妻",
        standalone: "単独使用可能",
        details: "「цахих（稲妻が光る）」から派生した言葉で、近代以降「電気」の意味で広く用いられます。"
      },
      {
        word: "шат",
        pos: "名詞",
        meaning: "階段、梯子（はしご）",
        standalone: "単独使用可能",
        details: "高低差を上下するための段・階段を指します。"
      }
    ],
    synthesis: "「電気で動く」＋「階段」＝【エレベーター／エスカレーター】を意味します。"
  },
  "угаалгын машин": {
    totalMeaning: "洗濯機",
    components: [
      {
        word: "угаалга",
        pos: "名詞",
        meaning: "洗濯、洗浄",
        standalone: "単独使用可能（属格: угаалгын）",
        details: "動詞「угаах（洗う）」に動作名詞化接尾辞「-лга」が結合した語。"
      },
      {
        word: "машин",
        pos: "名詞",
        meaning: "機械、自動車、マシン",
        standalone: "単独使用可能",
        details: "ロシア語経由の借用語で、動力駆動の機械全般を指します。"
      }
    ],
    synthesis: "「洗濯のための」＋「機械」＝【洗濯機】となります。"
  },
  "ус буцалгагч": {
    totalMeaning: "電気ケトル・湯沸かし器",
    components: [
      {
        word: "ус",
        pos: "名詞",
        meaning: "水（みず）",
        standalone: "単独使用可能",
        details: "生命の源である「水」を表すモンゴル固有語。"
      },
      {
        word: "буцалгагч",
        pos: "名詞",
        meaning: "沸騰させる器具・装置",
        standalone: "派生語として単独使用可能",
        details: "動詞「буцлах（沸く）」の使役形「буцалгах（沸かす）」に器具・行為者接尾辞「-гч」が付いた形。"
      }
    ],
    synthesis: "「水」＋「沸かす器具」＝【湯沸かし器・ケトル】となります。"
  }
};

/**
 * 単語の成り立ち・語の構成（2語以上の複合語、派生語、接尾辞結合）を解析してリッチHTMLカードを生成
 */
export function getWordEtymologyHTML(item, targetWord) {
  if (!item && !targetWord) return '';

  // 1. 正規化された見出し語（辞書形優先、カンマやスラッシュ以降の語幹・別表記を除去）
  let baseText = (item && (item.dictForm || item.mongolian)) || targetWord || '';
  if (typeof baseText !== 'string') baseText = String(baseText);
  if (baseText.includes(',')) baseText = baseText.split(',')[0];
  if (baseText.includes('/')) baseText = baseText.split('/')[0];
  baseText = baseText.replace(/\((.*?)\)/g, '$1').trim();

  const cleanKey = baseText.toLowerCase().replace(/[\(\)\,\.\/\?]/g, '').replace(/\s+/g, ' ').trim();
  const ja = (((item && item.japanese) || '') + '').trim();
  const deriv = (item && (item.etymologyBreakdown || item.derivation)) || '';

  // 1. 詳細構成要素マスターからの完全一致 (RICH_ETYMOLOGY_MAP)
  if (RICH_ETYMOLOGY_MAP[cleanKey]) {
    const data = RICH_ETYMOLOGY_MAP[cleanKey];
    const compRows = data.components.map(c => `
      <div class="p-2 rounded-lg bg-white/90 border border-amber-200 shadow-2xs space-y-1">
        <div class="flex items-center justify-between text-xs">
          <span class="font-black text-amber-900 cyrillic-text font-mono text-sm">「${c.word}」</span>
          <span class="px-1.5 py-0.5 rounded bg-amber-100 text-amber-950 font-bold text-[10px]">${c.pos}</span>
        </div>
        <div class="text-xs text-slate-800 font-bold">意味: <span class="text-amber-950">${c.meaning}</span></div>
        <div class="text-[11px] text-slate-600 leading-tight">
          <span class="font-bold text-slate-700">単独使用・役割:</span> ${c.standalone}${c.details ? ` ｜ ${c.details}` : ''}
        </div>
      </div>
    `).join('');

    return `
      <div class="mt-2.5 p-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50/80 border border-amber-300 text-xs space-y-2 shadow-2xs etymology-breakdown-card">
        <div class="font-black text-amber-950 flex items-center justify-between">
          <span class="flex items-center gap-1.5"><span>🧩</span> 単語の成り立ち・構成要素:</span>
          <span class="text-[11px] text-amber-800 font-bold">【${data.totalMeaning || ja}】</span>
        </div>
        <div class="space-y-1.5">
          ${compRows}
        </div>
        <div class="p-2 rounded-lg bg-amber-100/70 border border-amber-200/80 text-[11px] text-amber-950 font-bold leading-relaxed">
          💡 ${data.synthesis}
        </div>
      </div>
    `;
  }

  // 2. 単一語で明示的かつ信頼できる語源・形態素説明がすでに付与されている場合
  if (deriv && (deriv.includes('語幹') || deriv.includes('接尾辞') || deriv.includes('派生') || deriv.includes('＋'))) {
    return `
      <div class="mt-2.5 p-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50/80 border border-amber-300 text-xs space-y-1.5 shadow-2xs etymology-breakdown-card">
        <div class="font-black text-amber-950 flex items-center gap-1.5">
          <span>🧩</span> 単語の成り立ち・形態素解析:
        </div>
        <div class="font-bold text-slate-900 leading-relaxed cyrillic-text text-xs sm:text-sm pl-2 border-l-2 border-amber-400">
          ${deriv}
        </div>
      </div>
    `;
  }

  // 3. スペースを含む2語以上の複合語の動的解析（全構成要素が正確に特定できる場合のみ表示）
  if (cleanKey.includes(' ')) {
    const tokens = cleanKey.split(/\s+/).filter(Boolean);
    if (tokens.length >= 2) {
      let vocabList = [];
      try {
        if (typeof initialVocabulary !== 'undefined') vocabList = initialVocabulary;
        else if (typeof StorageService !== 'undefined' && StorageService.getVocabulary) vocabList = StorageService.getVocabulary();
      } catch (_) {}

      const resolvedTokens = [];
      let allValid = true;

      for (const t of tokens) {
        let match = vocabList.find(w => {
          const mMn = (w.mongolian || '').toLowerCase().trim();
          const mDf = (w.dictForm || '').toLowerCase().trim();
          // 単一語のみマッチ（複合語自身が再帰マッチするのを防ぐ）
          if (mDf.includes(' ') && mMn.includes(' ')) return false;
          return mMn === t || mDf === t || mMn.replace(/\((.*?)\)/g, '$1') === t;
        });

        let parsed = null;
        if (!match && typeof findWordInDictionary === 'function') {
          parsed = findWordInDictionary(t);
          if (parsed && parsed.isFallback) parsed = null;
        }

        if (!match && !parsed) {
          allValid = false;
          break;
        }

        const pos = match ? (match.pos || '名詞') : parsed.pos;
        const meaning = match ? (match.japanese || match.baseMeaning) : parsed.meaning;
        const standalone = match ? '辞書見出し語として単独使用可能' : (parsed.derivation || '独立した単語');
        const wordLabel = match ? (match.dictForm || match.mongolian) : t;

        resolvedTokens.push({
          word: wordLabel,
          pos: pos,
          meaning: meaning,
          standalone: standalone
        });
      }

      // 要件: 単語の構成要素を特定できない場合は、推測で説明を作らず、構成要素の解説を表示しない
      if (allValid && resolvedTokens.length >= 2) {
        const compRows = resolvedTokens.map(c => `
          <div class="p-2.5 rounded-lg bg-white/95 border border-amber-200 shadow-2xs space-y-1">
            <div class="flex items-center justify-between text-xs">
              <span class="font-black text-amber-900 cyrillic-text text-sm">「${c.word}」</span>
              <span class="px-2 py-0.5 rounded-md bg-amber-100 text-amber-950 font-black text-[10px]">${c.pos}</span>
            </div>
            <div class="text-xs text-slate-800 font-bold">意味: <span class="text-amber-950">${c.meaning}</span></div>
            <div class="text-[11px] text-slate-600 leading-tight"><span class="font-bold text-slate-700">役割・単独使用:</span> ${c.standalone}</div>
          </div>
        `).join('');

        return `
          <div class="mt-2.5 p-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50/80 border border-amber-300 text-xs space-y-2 shadow-2xs etymology-breakdown-card">
            <div class="font-black text-amber-950 flex items-center justify-between">
              <span class="flex items-center gap-1.5"><span>🧩</span> 単語の成り立ち・構成要素:</span>
              <span class="text-[11px] text-amber-800 font-bold">【${ja}】</span>
            </div>
            <div class="space-y-1.5">
              ${compRows}
            </div>
            <div class="p-2 rounded-lg bg-amber-100/70 border border-amber-200/80 text-[11px] text-amber-950 font-bold leading-relaxed">
              💡 各構成語が組み合わさって全体の意味【${ja}】を成しています。
            </div>
          </div>
        `;
      }
    }
  }

  // 4. 正確に特定できない単語、または単一の語根は推測で説明を作らず何も表示しない
  return '';
}
if (typeof window !== 'undefined') {
  window.getWordEtymologyHTML = getWordEtymologyHTML;
}

export const MNEMONICS_MAP = {
  "агаарын хэм": "大気（агаар）の目盛り（хэм）＝「【気温】」！",
  "жигнэмэг": "オーブンで【じっくり（жигнэ-）】焼いた【ビスケット・クッキー】！",
  "хүрэм": "寒い冬に体を包む【フレーム（хүрэм）】のような【上着・ジャケット】！",
  "банзал": "おしゃれで【バンザイ（банзал）】したくなる【スカート】！",
  "зоогийн газар": "ごちそう（зоог）を食べる場所（газар）＝「【レストラン・飲食店】」！",
  "галт тэрэгний буудал": "火の車（列車）が発着する場所（буудал）＝「【鉄道駅】」！",
  "гэмт хэрэг судлал": "犯罪（гэмт хэрэг）を研究（судлал）する＝「【犯罪学】」！",
  "гэмт хэрэг": "「悪い罪（гэмт）＋事柄（хэрэг）＝【犯罪・事件】」！",
  "хөл": "足で穴を【掘る（хөл）】！",
  "гар": "手からビームが【出る（гар）】！",
  "толгой": "頭を【取るごい（толгой）】！",
  "нүд": "【目】を【ぬーど（нүд）】で見つめる／目を濡らす！",
  "чих": "【耳】を【ちく（чих）】っと刺される！",
  "хамар": "鼻が【ハマる（хамар）】！",
  "ам": "口を【アム（ам）】っと開けて食べる！",
  "шүд": "歯を【シュッ（шүд）】と磨く！",
  "үс": "髪の毛が【薄（үс）】い！",
  "өсгий": "【オス】が踏ん張る【踵（өсгий）】！",
  "хөлийн өсгий": "足（хөл）の踵（өсгий）＝「オスが踏ん張る足のかかと」！",
  "зүрх": "胸が【ずるっ（зүрх）】とするほど高鳴る【心臓・ハート】！",
  "гэдэс": "お腹を【下駄です（гэдэс）】と叩く【お腹・胃】！",
  "нуруу": "【ぬる（нуруу）】っと曲がる【背中・背骨】！",
  "хэл": "【口から出る言葉・舌】を【ヘル（хэл）】プと叫ぶ！",
  "гар хуруу": "手（гар）の指（хуруу）＝「手から出る指」！",
  "тоос": "埃が隙間を【通す（тоос）】！",
  "тоос сорогч": "埃（トース）を吸う（ソログ）器具（チ）＝「埃吸い取りマシン」！",
  "толь": "自分の姿を【取り（толь）】映す【鏡】！",
  "толь бичиг": "照合する鏡（толь）＋文字の本（бичиг）＝「真実を映す辞書」！",
  "гар утас": "手（гар）の電話コード（утас）＝「手のひら携帯電話」！",
  "цахилгаан шат": "電気（цахилгаан）の階段（шат）＝「動く電気階段（エレベーター）」！",
  "ус буцалгагч": "水（ус）を沸かす（буцалгах）器具（-гч）＝「湯沸かしケトル」！",
  "угаалгын машин": "洗濯（угаалга）の機械（машин）＝「洗濯機」！",
  "шүүгээ": "洋服をきれいに【収納（шүү）】する【棚・タンス】！",
  "хаалга": "ドアを開けて【はーいガ（хаалга）】ッチャ！",
  "цонх": "窓から【チョン（цонх）】と顔を出す【窓】！",
  "ор": "ベッドに【おっ（ор）】と飛び乗る【ベッド・寝台】！",
  "ширээ": "机に【しれっ（ширээ）】と座る【机・テーブル】！",
  "сандал": "椅子に【サンダル（сандал）】履いて座る【椅子】！",
  "зурагт": "絵（зураг）が動く箱（-т）＝「テレビ」！",
  "зурагтын удирдлага": "テレビ（зурагт）の操縦器（удирдлага）＝「テレビのリモコン」！",
  "мах": "【マハ】ラジャが食べる【肉（мах）】！",
  "ус": "【オス】の水／【押す】と出る【水（ус）】！",
  "цай": "お【茶い（цай）】かが？／お茶を【注い（цай）】で！",
  "сүү": "【スー】ッと一気に飲める【牛乳（сүү）】！",
  "давс": "料理に塩を【出す（давс）】！",
  "талх": "パンを【たる（талх）】ほど食べる【パン】！",
  "бууз": "肉まんのボーズを食べて【坊主（бууз）】も笑顔！",
  "хуушуур": "揚げ餃子を【ふーふー（хуушуур）】冷まして食べる！",
  "цуйван": "焼うどんのツォイワンを食べて【強いワン（цуйван）】！",
  "жимс": "果物を【ジューシー（жимс）】に味わう【果物・フルーツ】！",
  "ногоо": "野菜を食べて【のびのび成長（ногоо）】する【野菜】！",
  "өндөг": "卵を【おんぶ（өндөг）】する【卵】！",
  "гурил": "小麦粉を【ぐり（гурил）】ぐりこねる【小麦粉・麺】！",
  "цагаан будаа": "白い（цагаан）米（будаа）＝「白米・ごはん」！",
  "гал": "火が【ガール（гал）】ガール燃える／ガールと囲む焚き火！",
  "цас": "雪が【さーっ（цас）】と降る【雪】！",
  "бороо": "雨に濡れて服が【ボロ（бороо）】ボロ！",
  "салхи": "風に乗って【猿飛（салхи）】佐助が飛ぶ【風】！",
  "нар": "空で太陽が【鳴る（нар）】！",
  "сар": "【月（сар）】で【サル】が餅つき！",
  "од": "夜空の星の輝きに【オド（од）】ろく！",
  "уул": "高い【山（уул）】を見て【ウール（уул）】トラマンもびっくり！",
  "гол": "【川（гол）】を渡って【ゴール（гол）】！",
  "мод": "【木（мод）】に登る【モード（мод）】！",
  "цэцэг": "花を【ツェツェ（цэцэг）】と愛でる【花】！",
  "өдөр": "昼間に元気に【踊る（өдөр）】！",
  "шөнө": "夜は静かに【しょん（шөнө）】ぼり！",
  "маргааш": "明日の予定は【丸がし（маргааш）】！",
  "өнөөдөр": "今日の予定は【おのー（өнөөдөр）】これだ！",
  "өчигдөр": "昨日のことを【おちついて（өчигдөр）】思い出す！",
  "хүйтэн": "寒い日は【食う手（хүйтэн）】がかじかむ【寒い・冷たい】！",
  "халуун": "暑い日は【はる（халуун）】か彼方に逃げたい【暑い・熱い】！",
  "нохой": "犬が庭に【野放（нохой）】し！",
  "муур": "猫が【モール（муур）】で買い物／ニャーと鳴くムール！",
  "морь": "馬が【森（морь）】を颯爽と駆ける！",
  "хонь": "羊に【骨（хонь）】なし、ふわふわウール！",
  "ямаа": "山羊が【山（ямаа）】を軽快に登る！",
  "үхэр": "牛が大きくて【ウヒャー（үхэр）】と驚く！",
  "тэмээ": "ラクダに乗って【てめえ（тэмээ）】どこ行く！",
  "шувуу": "鳥が空を【しゅーっ（шувуу）】と飛ぶ！",
  "загас": "魚が川を【ザガ（загас）】スザガス泳ぐ【魚】！",
  "чоно": "狼に【ちょの（чоно）】っと注意！",
  "баавгай": "熊が【バア（баавгай）】と現れる【熊】！",
  "явах": "【ヤバ（явах）】い、もう【行か】なきゃ！",
  "ирэх": "友達が家に【入れ（ирэх）】ば【来る】！",
  "идэх": "ご飯をいただきますと【食べる（идэх）】！",
  "уух": "ウーロン茶を【ウー（уух）】と【飲む】！",
  "унших": "本を【うんしょ（унших）】と抱えて【読む】！",
  "бичих": "鉛筆で【びっしり（бичих）】ノートに【書く】！",
  "мэдэх": "【目玉（мэдэх）】で見て【知る】！",
  "ойлгох": "【オイル（ойлгох）】の仕組みが【分かる・理解する】！",
  "бодох": "【僕（бодох）】が【思う・考える】に…！",
  "унтах": "【うん（унтах）】とぐっすり【寝る】！",
  "босох": "朝【ボサーッ（босох）】と【起きる・立つ】！",
  "суух": "椅子に【すーっ（суух）】と【座る】！",
  "зогсох": "車が【続々（зогсох）】と【止まる】！",
  "үзэх": "テレビを【うずうず（үзэх）】しながら【見る・試す】！",
  "сонсох": "【そん（сонсох）】な面白い話を【聞く】！",
  "өгөх": "人にプレゼントを【おごる（өгөх）】ように【あげる・渡す】！",
  "авах": "お小遣いを【暴（авах）】れるほど【もらう・取る】！",
  "харах": "【はる（харах）】か遠くを【見る】！",
  "зарах": "バザーで【皿（зарах）】を【売る】！",
  "ажиллах": "仕事（ажил）に【汗流（ажиллах）】して【働く】！",
  "сурах": "学校で【すらすら（сурах）】【学ぶ・習う】！",
  "хийх": "何でも【ひいひい（хийх）】言いながら【する・作る】！",
  "хэлэх": "真実を【へる（хэлэх）】ぷと【言う】！",
  "маллах": "家畜（мал）を【まったり（маллах）】【飼育する】！",
  "инээх": "【いいねー（инээх）】と楽しそうに【笑う】！",
  "уйлах": "悲しくて【初々（уйлах）】しく【泣く】！",
  "айх": "お化けを見て【アイヤ〜（айх）】と【怖がる】！",
  "дурлах": "好きな人に【ド直球（дурлах）】で【恋する】！",
  "бахархах": "友達の活躍を【バッチリ（бахархах）】【誇る】！",
  "цангах": "喉が渇いて【ツァン（цангах）】と水が飲みたい！",
  "мөрөөдөх": "未来の夢を【もうロード（мөрөөдөх）】のように【夢見る】！",
  "хичээх": "勉学を【ひーひー知恵（хичээх）】絞って【努力する】！",
  "сайн": "良いことの【サイン（сайн）】！",
  "муу": "悪いことして牛が【モー（муу）】と鳴く！",
  "их": "【一歩（их）】が大きい・【多い】！",
  "бага": "【バカ（бага）】にするなと【小さい】子が怒る！",
  "өндөр": "【温度る（өндөр）】ほど熱気【高い】！",
  "намхан": "【波（намхан）】が静かで【低い】！",
  "сайхан": "【最上（сайхан）】に【美しい・素敵だ】！",
  "хурдан": "【車（хурдан）】のように【速い】！",
  "удаан": "【うだ（удаан）】うだして【遅い】！",
  "хямдхан": "値段が【百円（хямдхан）】で【安い】！",
  "үнэтэй": "真実の価値（үнэ）を持つ（-тэй）＝「【値段が高い・貴重だ】」！",
  "сайхан амттай": "素敵（сайхан）＋味（амт）＋ある（-тай）＝「【美味しい】」！",
  "муухай": "【むむっ（муухай）】と顔をしかめる【不気味な・まずい】！",
  "дажгүй": "【ダシ（дажгүй）】が効いて【まぁまぁ・悪くない】！",
  "гайхалтай": "驚き（гайх-）に値する（-лтай）＝「【素晴らしい・すごい】」！",
  "энгийн": "飾りのない平素（энг）＝「【普通・簡単・シンプル】」！",
  "хар": "【春（хар）】なのに【黒】い服！",
  "шар": "【黄色】い【シャル（шар）】ロット！",
  "цагаан": "【白】を【ツァガ（цагаан）】っと塗る！",
  "улаан": "【ウラン（улаан）】バートルの【赤】！",
  "хөх": "【コック（хөх）】さんの【青】いエプロン！",
  "ногоон": "大草原の草（ногоо）の色＝「【緑】」！",
  "юу": "【ゆう（юу）】べ【何】があった？",
  "хэн": "【変（хэн）】な人は【誰】？",
  "хаана": "【鼻（хаана）】は【どこ】？",
  "хэзээ": "【風邪（хэзээ）】は【いつ】治る？",
  "яагаад": "【嫌が（яагаад）】るのに【なぜ】？",
  "ямар": "【やまる（ямар）】（止まる）のは【どんな】車？",
  "хэд": "お菓子が減って【いくつ（хэд）】残った？",
  "аль": "【有る（аль）】選択肢の【どちら】？",
  "баярлалаа": "バナナやるからラララ〜と【ありがとう（баярлалаа）】！",
  "баярлалаа.": "バナナやるからラララ〜と【ありがとう（баярлалаа）】！",
  "уучлаарай": "お茶（ууча）をこぼして【すみません（уучлаарай）】！",
  "баяртай": "バイバイしたい【さようなら（баяртай）】！",
  "тийм": "チームの決定に「【はい、そうです（тийм）】」！",
  "үгүй": "ウグイスが「【いいえ（үгүй）】」と鳴く！",
  "зүгээр": "お礼を言われて「【ズバリ大丈夫（зүгээр）】」！",
  "тийм шүү": "そう（тийм）＋強調（шүү）＝「【その通り・確かにそうだよね】」！",
  "үнэн шүү": "本当（үнэн）＋強調（шүү）＝「【本当だよね・確かに】」！",
  "магадгүй": "公算（магад）＋なし（-гүй）＝「【多分・おそらく】」！",
  "ёстой": "礼儀・道理（ёс）＋ある（-той）＝「【当然・本当に・〜すべき】」！",
  "би": "【美（би）】しい【私】！",
  "чи": "【ち（чи）】み【君】！",
  "та": "【他（та）】人行儀に丁寧に【あなた】！",
  "тэр": "【照れ（тэр）】屋の【あの人・彼・彼女】！",
  "бид": "【ビビッ（бид）】と団結する【私たち】！",
  "аав": "【あー（аав）】頼れる【父】さん！",
  "ээж": "【えー（ээж）】優しい【母】さん！",
  "хүү": "腕白な息子に【ふーっ（хүү）】とため息！",
  "охин": "【お品（охин）】の良い【娘・女の子】！",
  "ах": "【あっ（ах）】と頼れる【兄・年上男性】！",
  "эгч": "【えっ（эгч）】と驚く美人な【姉・年上女性】！",
  "дүү": "年下の【弟・妹（дүү）】にぎゅー（дүү）っとハグ！",
  "өвөө": "【おー（өвөө）】元気な【おじいちゃん】！",
  "эмээ": "【えみ（эмээ）】がこぼれる【おばあちゃん】！",
  "багш": "【バッジ（багш）】をつけた偉大な【先生】！",
  "найз": "【ナイス（найз）】な【友達】！"
};

/**
 * 語呂合わせ・覚えやすい仕組みを解析してHTMLカードを生成
 */
export function getWordMnemonicHTML(item, targetWord) {
  let mnemonic = (item && item.mnemonic) ? String(item.mnemonic).trim() : '';

  if (!mnemonic) {
    const rawWord = ((item && (item.mongolian || item.dictForm)) || targetWord || '').trim();
    const cleanWord = rawWord.toLowerCase().replace(/[\(\)\（\）\s.,!?-]/g, '');
    const cleanRaw = rawWord.toLowerCase().replace(/[.,!?]/g, '').trim();

    if (MNEMONICS_MAP[cleanRaw]) {
      mnemonic = MNEMONICS_MAP[cleanRaw];
    } else if (MNEMONICS_MAP[cleanWord]) {
      mnemonic = MNEMONICS_MAP[cleanWord];
    } else {
      try {
        let vocabList = [];
        if (typeof initialVocabulary !== 'undefined') vocabList = initialVocabulary;
        else if (typeof StorageService !== 'undefined') vocabList = StorageService.getVocabulary();

        const match = vocabList.find(w => {
          const wMn = (w.mongolian || '').toLowerCase().replace(/[\(\)\（\）\s.,!?-]/g, '');
          const wDf = (w.dictForm || '').toLowerCase().replace(/[\(\)\（\）\s.,!?-]/g, '');
          return w.mnemonic && (wMn === cleanWord || wDf === cleanWord);
        });
        if (match && match.mnemonic) {
          mnemonic = match.mnemonic;
        }
      } catch (_) {}
    }
  }

  if (!mnemonic) return '';

  return `
    <div class="mt-2.5 p-3 rounded-xl bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50/70 border border-amber-300/90 text-xs space-y-1 shadow-2xs mnemonic-card">
      <div class="font-black text-amber-950 flex items-center gap-1.5">
        <span>💡</span> 語呂合わせ・楽しい覚え方:
      </div>
      <div class="font-bold text-amber-900 leading-relaxed text-xs sm:text-sm pl-2 border-l-2 border-amber-400">
        ${mnemonic}
      </div>
    </div>
  `;
}

if (typeof window !== 'undefined') {
  window.MNEMONICS_MAP = MNEMONICS_MAP;
  window.getWordMnemonicHTML = getWordMnemonicHTML;
}

/**
 * 単語イラスト・ビジュアルアイコン完全対応マッピング
 * すべての単語帳、解説カード、フラッシュカード、復習ノートで直感的なイメージ記憶を支援
 */
export const WORD_ILLUSTRATIONS = {
  // === 身体の部位 (Body Parts) ===
  'гар': { icon: '🖐️', label: '手・腕', bg: 'from-amber-50 to-orange-50' },
  'толгой': { icon: '🧠', label: '頭・頭部', bg: 'from-purple-50 to-pink-50' },
  'үс': { icon: '💇', label: '髪の毛', bg: 'from-slate-50 to-stone-50' },
  'хөмсөг': { icon: '〰️', label: '眉毛', bg: 'from-amber-50 to-yellow-50' },
  'нүд': { icon: '👁️', label: '目', bg: 'from-sky-50 to-blue-50' },
  'чих': { icon: '👂', label: '耳', bg: 'from-rose-50 to-pink-50' },
  'хамар': { icon: '👃', label: '鼻', bg: 'from-orange-50 to-amber-50' },
  'ам': { icon: '👄', label: '口', bg: 'from-rose-50 to-red-50' },
  'уруул': { icon: '💋', label: '唇', bg: 'from-rose-50 to-red-50' },
  'шүд': { icon: '🦷', label: '歯', bg: 'from-cyan-50 to-sky-50' },
  'хэл': { icon: '👅', label: '舌・言葉', bg: 'from-rose-50 to-pink-50' },
  'хүзүү': { icon: '🧣', label: '首', bg: 'from-teal-50 to-emerald-50' },
  'мөр': { icon: '🤷', label: '肩', bg: 'from-indigo-50 to-blue-50' },
  'цээж': { icon: '🫁', label: '胸', bg: 'from-cyan-50 to-teal-50' },
  'хөх': { icon: '🤱', label: '胸・乳房', bg: 'from-pink-50 to-rose-50' },
  'гэдэс': { icon: '🤰', label: 'お腹', bg: 'from-emerald-50 to-teal-50' },
  'хүйс': { icon: '🔘', label: 'へそ', bg: 'from-amber-50 to-yellow-50' },
  'нуруу': { icon: '🧍', label: '背中・腰', bg: 'from-blue-50 to-indigo-50' },
  'бүсэлхий': { icon: '🥋', label: '腰', bg: 'from-violet-50 to-purple-50' },
  'хөл': { icon: '🦶', label: '足・脚', bg: 'from-amber-50 to-orange-50' },
  'өвдөг': { icon: '🦵', label: '膝', bg: 'from-orange-50 to-yellow-50' },
  'гуя': { icon: '🦵', label: '太もも', bg: 'from-amber-50 to-orange-50' },
  'тохой': { icon: '💪', label: '肘', bg: 'from-blue-50 to-sky-50' },
  'гарын шуу': { icon: '💪', label: '腕・前腕', bg: 'from-blue-50 to-cyan-50' },
  'гарын алга': { icon: '🤲', label: '手のひら', bg: 'from-amber-50 to-yellow-50' },
  'хөлийн ул': { icon: '👣', label: '足の裏', bg: 'from-stone-50 to-slate-50' },
  'хөлийн өсгий': { icon: '🦶', label: 'かかと', bg: 'from-amber-50 to-stone-50' },
  'шилбэ': { icon: '🦵', label: 'すね', bg: 'from-orange-50 to-amber-50' },
  'хуруу': { icon: '☝️', label: '指', bg: 'from-yellow-50 to-amber-50' },
  'хумс': { icon: '💅', label: '爪', bg: 'from-pink-50 to-rose-50' },
  'хөлийн хуруу': { icon: '🦶', label: '足の指', bg: 'from-amber-50 to-orange-50' },
  'зүрх': { icon: '🫀', label: '心臓・心', bg: 'from-rose-50 to-red-50' },
  'ходоод': { icon: '🥣', label: '胃', bg: 'from-orange-50 to-amber-50' },
  'тархи': { icon: '🧠', label: '脳', bg: 'from-purple-50 to-pink-50' },
  'яс': { icon: '🦴', label: '骨', bg: 'from-slate-50 to-zinc-50' },
  'цус': { icon: '🩸', label: '血', bg: 'from-red-50 to-rose-50' },
  'арьс': { icon: '🧖', label: '皮膚', bg: 'from-amber-50 to-orange-50' },
  'дух': { icon: '👤', label: '額（おでこ）', bg: 'from-blue-50 to-indigo-50' },
  'хацар': { icon: '😊', label: '頬（ほっぺ）', bg: 'from-pink-50 to-rose-50' },
  'эрүү': { icon: '🧔', label: '顎（あご）', bg: 'from-slate-50 to-zinc-50' },
  'нүүр': { icon: '🙂', label: '顔', bg: 'from-yellow-50 to-amber-50' },
  'бие': { icon: '🧍', label: '体・身体', bg: 'from-emerald-50 to-teal-50' },
  'цангах': { icon: '🥤', label: '喉が渇く', bg: 'from-cyan-50 to-sky-50' },
  'цангалаа': { icon: '🥤', label: '喉が渇いた', bg: 'from-cyan-50 to-sky-50' },

  // === 学校・文具・教室 (School & Stationery) ===
  'ном': { icon: '📖', label: '本', bg: 'from-purple-50 to-indigo-50' },
  'дэвтэр': { icon: '📓', label: 'ノート', bg: 'from-blue-50 to-sky-50' },
  'үзэг': { icon: '✒️', label: 'ペン・万年筆', bg: 'from-slate-50 to-stone-50' },
  'харандаа': { icon: '✏️', label: '鉛筆', bg: 'from-amber-50 to-yellow-50' },
  'баллуур': { icon: '🧼', label: '消しゴム', bg: 'from-teal-50 to-emerald-50' },
  'шугам': { icon: '📏', label: '定規', bg: 'from-sky-50 to-cyan-50' },
  'хайч': { icon: '✂️', label: 'ハサミ', bg: 'from-rose-50 to-red-50' },
  'цүнх': { icon: '🎒', label: 'カバン・リュック', bg: 'from-orange-50 to-amber-50' },
  'ширээ': { icon: '🪑', label: '机', bg: 'from-amber-50 to-yellow-50' },
  'сандал': { icon: '🪑', label: '椅子', bg: 'from-stone-50 to-zinc-50' },
  'самбар': { icon: '📋', label: '黒板・掲示板', bg: 'from-emerald-50 to-green-50' },
  'сургууль': { icon: '🏫', label: '学校', bg: 'from-blue-50 to-indigo-50' },
  'их сургууль': { icon: '🏛️', label: '大学', bg: 'from-indigo-50 to-purple-50' },
  'анги': { icon: '🏫', label: '教室・学級', bg: 'from-sky-50 to-blue-50' },
  'багш': { icon: '👨‍🏫', label: '先生・教師', bg: 'from-emerald-50 to-teal-50' },
  'оюутан': { icon: '🧑‍🎓', label: '学生・大学生', bg: 'from-cyan-50 to-sky-50' },
  'сурагч': { icon: '🎒', label: '児童・生徒', bg: 'from-amber-50 to-yellow-50' },
  'хичээл': { icon: '📚', label: '授業・レッスン', bg: 'from-purple-50 to-pink-50' },
  'шалгалт': { icon: '📝', label: '試験・テスト', bg: 'from-rose-50 to-red-50' },
  'диплом': { icon: '📜', label: '学位・卒業証書', bg: 'from-amber-50 to-yellow-50' },
  'боловсрол': { icon: '🎓', label: '教育', bg: 'from-blue-50 to-indigo-50' },
  'толь бичиг': { icon: '📕', label: '辞書', bg: 'from-red-50 to-rose-50' },

  // === 衣類・服飾品 (Clothing) ===
  'хувцас': { icon: '👕', label: '服・衣服', bg: 'from-blue-50 to-sky-50' },
  'цамц': { icon: '👔', label: 'シャツ', bg: 'from-sky-50 to-cyan-50' },
  'өмд': { icon: '👖', label: 'ズボン', bg: 'from-indigo-50 to-blue-50' },
  'банзал': { icon: '👗', label: 'スカート', bg: 'from-pink-50 to-rose-50' },
  'хүрэм': { icon: '🧥', label: 'ジャケット・上着', bg: 'from-amber-50 to-stone-50' },
  'пальто': { icon: '🧥', label: 'コート', bg: 'from-stone-50 to-slate-50' },
  'малгай': { icon: '🧢', label: '帽子', bg: 'from-teal-50 to-emerald-50' },
  'бээлий': { icon: '🧤', label: '手袋', bg: 'from-yellow-50 to-amber-50' },
  'ороолт': { icon: '🧣', label: 'マフラー', bg: 'from-rose-50 to-orange-50' },
  'гутал': { icon: '👞', label: '靴・ブーツ', bg: 'from-stone-50 to-amber-50' },
  'оймс': { icon: '🧦', label: '靴下', bg: 'from-purple-50 to-pink-50' },
  'дээл': { icon: '🥋', label: 'デール（民族衣装）', bg: 'from-emerald-50 to-teal-50' },
  'бүс': { icon: '🎗️', label: '帯・ベルト', bg: 'from-amber-50 to-yellow-50' },

  // === 食べ物・レストラン (Food & Dining) ===
  'талх': { icon: '🍞', label: 'パン', bg: 'from-amber-50 to-yellow-50' },
  'мах': { icon: '🥩', label: '肉', bg: 'from-rose-50 to-red-50' },
  'будаа': { icon: '🍚', label: 'ご飯・米', bg: 'from-stone-50 to-slate-50' },
  'сүү': { icon: '🥛', label: '牛乳・ミルク', bg: 'from-sky-50 to-blue-50' },
  'цай': { icon: '🍵', label: 'お茶・スーテイツァイ', bg: 'from-emerald-50 to-teal-50' },
  'ус': { icon: '💧', label: '水', bg: 'from-cyan-50 to-sky-50' },
  'шөл': { icon: '🍲', label: 'スープ', bg: 'from-orange-50 to-amber-50' },
  'өндөг': { icon: '🥚', label: '卵', bg: 'from-yellow-50 to-amber-50' },
  'загас': { icon: '🐟', label: '魚', bg: 'from-blue-50 to-cyan-50' },
  'бууз': { icon: '🥟', label: 'ボーズ（蒸し餃子）', bg: 'from-amber-50 to-yellow-50' },
  'хуушуур': { icon: '🥟', label: 'ホーショール（揚げ餃子）', bg: 'from-orange-50 to-amber-50' },
  'цуйван': { icon: '🍜', label: 'ツィワン（炒め麺）', bg: 'from-amber-50 to-orange-50' },
  'айраг': { icon: '🍶', label: 'アイラグ（馬乳酒）', bg: 'from-teal-50 to-cyan-50' },
  'ааруул': { icon: '🧀', label: 'アーロール（乾燥チーズ）', bg: 'from-yellow-50 to-amber-50' },
  'борц': { icon: '🥩', label: 'ボルツ（干し肉）', bg: 'from-stone-50 to-amber-50' },
  'хоол': { icon: '🍽️', label: '料理・食事', bg: 'from-rose-50 to-orange-50' },
  'чихэр': { icon: '🍬', label: 'お菓子・飴', bg: 'from-pink-50 to-rose-50' },
  'жигнэмэг': { icon: '🍪', label: 'ビスケット・クッキー', bg: 'from-amber-50 to-yellow-50' },
  'бялуу': { icon: '🎂', label: 'ケーキ', bg: 'from-pink-50 to-yellow-50' },
  'давс': { icon: '🧂', label: '塩', bg: 'from-slate-50 to-zinc-50' },
  'элсэн чихэр': { icon: '🧂', label: '砂糖', bg: 'from-amber-50 to-stone-50' },
  'шар айраг': { icon: '🍺', label: 'ビール', bg: 'from-amber-50 to-yellow-50' },
  'архи': { icon: '🍸', label: 'ウォッカ', bg: 'from-sky-50 to-indigo-50' },
  'дарс': { icon: '🍷', label: 'ワイン', bg: 'from-rose-50 to-red-50' },
  'өглөөний цай': { icon: '🍳', label: '朝食', bg: 'from-amber-50 to-yellow-50' },
  'өдрийн хоол': { icon: '🍱', label: '昼食', bg: 'from-emerald-50 to-teal-50' },
  'оройн хоол': { icon: '🍲', label: '夕食', bg: 'from-indigo-50 to-purple-50' },

  // === 日用品・家電・家具 (Appliances & Furniture) ===
  'гэр': { icon: '🛖', label: 'ゲル・家', bg: 'from-emerald-50 to-green-50' },
  'байшин': { icon: '🏠', label: '建物・一軒家', bg: 'from-blue-50 to-sky-50' },
  'өрөө': { icon: '🚪', label: '部屋', bg: 'from-slate-50 to-stone-50' },
  'үүд': { icon: '🚪', label: '玄関・入口', bg: 'from-amber-50 to-orange-50' },
  'хаалга': { icon: '🚪', label: 'ドア・扉', bg: 'from-amber-50 to-stone-50' },
  'цонх': { icon: '🪟', label: '窓', bg: 'from-cyan-50 to-sky-50' },
  'ор': { icon: '🛏️', label: 'ベッド', bg: 'from-indigo-50 to-blue-50' },
  'шүүгээ': { icon: '🗄️', label: 'タンス・棚', bg: 'from-amber-50 to-stone-50' },
  'толь': { icon: '🪞', label: '鏡', bg: 'from-sky-50 to-cyan-50' },
  'зурагт': { icon: '📺', label: 'テレビ', bg: 'from-slate-50 to-stone-50' },
  'хөргөгч': { icon: '🧊', label: '冷蔵庫', bg: 'from-cyan-50 to-blue-50' },
  'угаалгын машин': { icon: '🫧', label: '洗濯機', bg: 'from-sky-50 to-indigo-50' },
  'тоос сорогч': { icon: '🧹', label: '掃除機', bg: 'from-teal-50 to-emerald-50' },
  'утас': { icon: '📱', label: '電話・スマホ', bg: 'from-blue-50 to-indigo-50' },
  'гар утас': { icon: '📱', label: '携帯電話', bg: 'from-blue-50 to-cyan-50' },
  'компьютер': { icon: '💻', label: 'パソコン', bg: 'from-indigo-50 to-violet-50' },
  'аяга': { icon: '🥣', label: '茶碗・お椀', bg: 'from-sky-50 to-cyan-50' },
  'халбага': { icon: '🥄', label: 'スプーン', bg: 'from-amber-50 to-stone-50' },
  'сэрээ': { icon: '🍴', label: 'フォーク', bg: 'from-slate-50 to-zinc-50' },
  'хутга': { icon: '🔪', label: 'ナイフ', bg: 'from-red-50 to-rose-50' },
  'тогоо': { icon: '🍳', label: '鍋・フライパン', bg: 'from-stone-50 to-slate-50' },
  'данх': { icon: '🫖', label: 'やかん・ポット', bg: 'from-amber-50 to-orange-50' },

  // === 果物・野菜 (Fruits & Vegetables) ===
  'алим': { icon: '🍎', label: 'りんご', bg: 'from-red-50 to-rose-50' },
  'жүрж': { icon: '🍊', label: 'オレンジ・みかん', bg: 'from-orange-50 to-amber-50' },
  'гадил': { icon: '🍌', label: 'バナナ', bg: 'from-yellow-50 to-amber-50' },
  'гүзээлзгэнэ': { icon: '🍓', label: 'いちご', bg: 'from-rose-50 to-red-50' },
  'усан үзэм': { icon: '🍇', label: 'ぶどう', bg: 'from-purple-50 to-indigo-50' },
  'тарвас': { icon: '🍉', label: 'スイカ', bg: 'from-emerald-50 to-red-50' },
  'төмс': { icon: '🥔', label: 'じゃがいも', bg: 'from-amber-50 to-yellow-50' },
  'сонгино': { icon: '🧅', label: '玉ねぎ', bg: 'from-stone-50 to-amber-50' },
  'лууван': { icon: '🥕', label: 'にんじん', bg: 'from-orange-50 to-amber-50' },
  'байцаа': { icon: '🥬', label: 'キャベツ', bg: 'from-emerald-50 to-teal-50' },
  'өргөст хэмх': { icon: '🥒', label: 'きゅうり', bg: 'from-green-50 to-emerald-50' },
  'улаан лооль': { icon: '🍅', label: 'トマト', bg: 'from-red-50 to-rose-50' },
  'сармис': { icon: '🧄', label: 'にんにく', bg: 'from-amber-50 to-stone-50' },

  // === 方位・方角・位置 (Directions & Positions) ===
  'хойд': { icon: '🧭', label: '北', bg: 'from-blue-50 to-indigo-50' },
  'өмнөд': { icon: '🧭', label: '南', bg: 'from-rose-50 to-orange-50' },
  'зүүн': { icon: '🧭', label: '東・左', bg: 'from-emerald-50 to-teal-50' },
  'баруун': { icon: '🧭', label: '西・右', bg: 'from-amber-50 to-yellow-50' },
  'дээр': { icon: '⬆️', label: '上', bg: 'from-sky-50 to-blue-50' },
  'дор': { icon: '⬇️', label: '下', bg: 'from-slate-50 to-stone-50' },
  'дооро': { icon: '⬇️', label: '下', bg: 'from-slate-50 to-stone-50' },
  'дотор': { icon: '📥', label: '中', bg: 'from-teal-50 to-emerald-50' },
  'гадна': { icon: '📤', label: '外', bg: 'from-orange-50 to-amber-50' },
  'өмнө': { icon: '◀️', label: '前', bg: 'from-indigo-50 to-blue-50' },
  'хойно': { icon: '▶️', label: '後ろ', bg: 'from-purple-50 to-pink-50' },
  'хажууд': { icon: '↔️', label: '横・隣', bg: 'from-stone-50 to-slate-50' },
  'дунд': { icon: '⏺️', label: '間・中央', bg: 'from-yellow-50 to-amber-50' },

  // === 犯罪・法・司法 (Crime & Law) ===
  'гэмт хэрэг': { icon: '🚨', label: '犯罪', bg: 'from-red-50 to-rose-50' },
  'гэмт хэрэг судлал': { icon: '🔍', label: '犯罪学', bg: 'from-indigo-50 to-blue-50' },
  'хууль': { icon: '⚖️', label: '法律', bg: 'from-amber-50 to-yellow-50' },
  'цагдаа': { icon: '👮', label: '警察', bg: 'from-blue-50 to-sky-50' },
  'шүүх': { icon: '🏛️', label: '裁判所', bg: 'from-purple-50 to-indigo-50' },
  'шүүгч': { icon: '👨‍⚖️', label: '裁判官', bg: 'from-indigo-50 to-slate-50' },
  'өмгөөлөгч': { icon: '🧑‍💼', label: '弁護士', bg: 'from-blue-50 to-teal-50' },
  'хулгайч': { icon: '🦹', label: '泥棒', bg: 'from-stone-50 to-zinc-50' },
  'шорон': { icon: '⛓️', label: '刑務所', bg: 'from-slate-50 to-stone-50' },
  'ял': { icon: '⚖️', label: '刑罰・判決', bg: 'from-red-50 to-rose-50' },
  'торгууль': { icon: '🎫', label: '罰金', bg: 'from-orange-50 to-amber-50' },
  'хохирогч': { icon: '👤', label: '被害者', bg: 'from-stone-50 to-slate-50' },
  'гэрч': { icon: '👁️', label: '目撃者・証人', bg: 'from-sky-50 to-blue-50' },
  'хэрэг': { icon: '📁', label: '事件・案件', bg: 'from-amber-50 to-yellow-50' },

  // === 自然・天気・動物 (Nature, Weather & Animals) ===
  'нар': { icon: '☀️', label: '太陽・日', bg: 'from-amber-50 to-yellow-50' },
  'сар': { icon: '🌙', label: '月', bg: 'from-indigo-50 to-sky-50' },
  'од': { icon: '⭐', label: '星', bg: 'from-yellow-50 to-amber-50' },
  'тэнгэр': { icon: '🌤️', label: '空', bg: 'from-sky-50 to-cyan-50' },
  'үүл': { icon: '☁️', label: '雲', bg: 'from-slate-50 to-stone-50' },
  'бороо': { icon: '🌧️', label: '雨', bg: 'from-blue-50 to-sky-50' },
  'цас': { icon: '❄️', label: '雪', bg: 'from-cyan-50 to-sky-50' },
  'салхи': { icon: '💨', label: '風', bg: 'from-teal-50 to-emerald-50' },
  'аянга': { icon: '⚡', label: '雷', bg: 'from-yellow-50 to-amber-50' },
  'уул': { icon: '🏔️', label: '山', bg: 'from-emerald-50 to-teal-50' },
  'гол': { icon: '🏞️', label: '川', bg: 'from-blue-50 to-cyan-50' },
  'нуур': { icon: '🌊', label: '湖', bg: 'from-cyan-50 to-blue-50' },
  'ой': { icon: '🌲', label: '森', bg: 'from-emerald-50 to-green-50' },
  'тал': { icon: '🌾', label: '草原', bg: 'from-lime-50 to-emerald-50' },
  'цөл': { icon: '🏜️', label: '砂漠・ゴビ', bg: 'from-amber-50 to-orange-50' },
  'цаг агаар': { icon: '⛅', label: '天気', bg: 'from-sky-50 to-blue-50' },
  'агаарын хэм': { icon: '🌡️', label: '気温・温度', bg: 'from-rose-50 to-amber-50' },
  'өвөл': { icon: '❄️', label: '冬', bg: 'from-cyan-50 to-blue-50' },
  'хавар': { icon: '🌱', label: '春', bg: 'from-emerald-50 to-teal-50' },
  'зун': { icon: '🌻', label: '夏', bg: 'from-amber-50 to-yellow-50' },
  'намар': { icon: '🍁', label: '秋', bg: 'from-orange-50 to-amber-50' },
  'морь': { icon: '🐎', label: '馬', bg: 'from-amber-50 to-orange-50' },
  'тэмээ': { icon: '🐫', label: 'ラクダ', bg: 'from-amber-50 to-yellow-50' },
  'хонь': { icon: '🐑', label: '羊', bg: 'from-emerald-50 to-teal-50' },
  'ямаа': { icon: '🐐', label: '山羊', bg: 'from-stone-50 to-amber-50' },
  'үхэр': { icon: '🐂', label: '牛', bg: 'from-amber-50 to-stone-50' },
  'нохой': { icon: '🐕', label: '犬', bg: 'from-amber-50 to-yellow-50' },
  'муур': { icon: '🐈', label: '猫', bg: 'from-orange-50 to-pink-50' },
  'чоно': { icon: '🐺', label: '狼', bg: 'from-slate-50 to-zinc-50' },
  'баавгай': { icon: '🐻', label: '熊', bg: 'from-stone-50 to-amber-50' },
  'үнэг': { icon: '🦊', label: '狐', bg: 'from-orange-50 to-amber-50' },
  'туулай': { icon: '🐇', label: 'うさぎ', bg: 'from-pink-50 to-rose-50' },
  'шувуу': { icon: '🦅', label: '鳥', bg: 'from-sky-50 to-indigo-50' },

  // === 街・交通・施設 (City, Transport & Places) ===
  'хот': { icon: '🏙️', label: '都市・街', bg: 'from-blue-50 to-indigo-50' },
  'гудамж': { icon: '🛣️', label: '通り・街路', bg: 'from-slate-50 to-stone-50' },
  'талбай': { icon: '🏛️', label: '広場', bg: 'from-amber-50 to-yellow-50' },
  'буудал': { icon: '🚏', label: '停留所・駅', bg: 'from-teal-50 to-emerald-50' },
  'галт тэрэгний буудал': { icon: '🚉', label: '鉄道駅', bg: 'from-blue-50 to-sky-50' },
  'нисэх буудал': { icon: '🛫', label: '空港', bg: 'from-sky-50 to-indigo-50' },
  'дэлгүүр': { icon: '🏪', label: '店・商店', bg: 'from-emerald-50 to-teal-50' },
  'зах': { icon: '🎪', label: '市場・バザール', bg: 'from-orange-50 to-amber-50' },
  'зоогийн газар': { icon: '🍽️', label: 'レストラン', bg: 'from-rose-50 to-orange-50' },
  'зочид буудал': { icon: '🏨', label: 'ホテル', bg: 'from-indigo-50 to-blue-50' },
  'эмнэлэг': { icon: '🏥', label: '病院', bg: 'from-rose-50 to-red-50' },
  'эмийн сан': { icon: '💊', label: '薬局', bg: 'from-emerald-50 to-teal-50' },
  'банк': { icon: '🏦', label: '銀行', bg: 'from-emerald-50 to-cyan-50' },
  'шуудан': { icon: '📮', label: '郵便局', bg: 'from-red-50 to-rose-50' },
  'музей': { icon: '🏛️', label: '博物館', bg: 'from-purple-50 to-indigo-50' },
  'машин': { icon: '🚗', label: '車・自動車', bg: 'from-blue-50 to-sky-50' },
  'автобус': { icon: '🚌', label: 'バス', bg: 'from-amber-50 to-yellow-50' },
  'галт тэрэг': { icon: '🚂', label: '電車・列車', bg: 'from-slate-50 to-stone-50' },
  'онгоц': { icon: '✈️', label: '飛行機', bg: 'from-sky-50 to-cyan-50' },
  'унадаг дугуй': { icon: '🚲', label: '自転車', bg: 'from-teal-50 to-emerald-50' },
  'такси': { icon: '🚕', label: 'タクシー', bg: 'from-yellow-50 to-amber-50' },

  // === 家族・人間関係 (Family & People) ===
  'гэр бүл': { icon: '👨‍👩‍👧‍👦', label: '家族', bg: 'from-amber-50 to-orange-50' },
  'аав': { icon: '👨', label: 'お父さん', bg: 'from-blue-50 to-sky-50' },
  'эцэг': { icon: '👨', label: '父', bg: 'from-blue-50 to-indigo-50' },
  'ээж': { icon: '👩', label: 'お母さん', bg: 'from-pink-50 to-rose-50' },
  'эх': { icon: '👩', label: '母', bg: 'from-rose-50 to-red-50' },
  'хүү': { icon: '👦', label: '息子・男の子', bg: 'from-sky-50 to-blue-50' },
  'охин': { icon: '👧', label: '娘・女の子', bg: 'from-pink-50 to-purple-50' },
  'ах': { icon: '🧑', label: '兄', bg: 'from-cyan-50 to-blue-50' },
  'эгч': { icon: '👩', label: '姉', bg: 'from-rose-50 to-pink-50' },
  'дүү': { icon: '🧒', label: '弟・妹', bg: 'from-amber-50 to-yellow-50' },
  'өвөө': { icon: '👴', label: 'おじいちゃん', bg: 'from-stone-50 to-amber-50' },
  'эмээ': { icon: '👵', label: 'おばあちゃん', bg: 'from-pink-50 to-amber-50' },
  'нөхөр': { icon: '🤵', label: '夫', bg: 'from-indigo-50 to-slate-50' },
  'эхнэр': { icon: '👰', label: '妻', bg: 'from-pink-50 to-rose-50' },
  'хүүхэд': { icon: '👶', label: '子ども', bg: 'from-yellow-50 to-amber-50' },
  'найз': { icon: '🤝', label: '友達', bg: 'from-emerald-50 to-teal-50' },
  'хүн': { icon: '👤', label: '人', bg: 'from-slate-50 to-zinc-50' },

  // === 音楽・芸能・日本文化 (Music & Culture) ===
  'хөгжим': { icon: '🎵', label: '音楽', bg: 'from-fuchsia-50 to-pink-50' },
  'дуу': { icon: '🎤', label: '歌', bg: 'from-rose-50 to-pink-50' },
  'дуучин': { icon: '🧑‍🎤', label: '歌手', bg: 'from-purple-50 to-fuchsia-50' },
  'морин хуур': { icon: '🎻', label: '馬頭琴', bg: 'from-amber-50 to-orange-50' },
  'лимбэ': { icon: '🪈', label: '横笛', bg: 'from-emerald-50 to-teal-50' },
  'бүжиг': { icon: '💃', label: 'ダンス・踊り', bg: 'from-pink-50 to-rose-50' },
  'зураг': { icon: '🎨', label: '絵・写真', bg: 'from-yellow-50 to-amber-50' },
  'сүши': { icon: '🍣', label: '寿司', bg: 'from-red-50 to-rose-50' },
  'сакэ': { icon: '🍶', label: '日本酒', bg: 'from-teal-50 to-cyan-50' },
  'сакура': { icon: '🌸', label: '桜', bg: 'from-pink-50 to-rose-50' },
  'кимоно': { icon: '👘', label: '着物', bg: 'from-purple-50 to-pink-50' },
  'сумо': { icon: '🤼', label: '相撲', bg: 'from-orange-50 to-amber-50' },
  'цайны ёслол': { icon: '🍵', label: '茶道', bg: 'from-emerald-50 to-teal-50' },

  // === 人称・指示代名詞・数字 (Pronouns & Numbers) ===
  'би': { icon: '🙋', label: '私', bg: 'from-emerald-50 to-teal-50' },
  'чи': { icon: '👉', label: '君', bg: 'from-blue-50 to-sky-50' },
  'та': { icon: '🙇', label: 'あなた', bg: 'from-indigo-50 to-purple-50' },
  'тэр': { icon: '👤', label: '彼・彼女・あれ', bg: 'from-slate-50 to-stone-50' },
  'бид': { icon: '👥', label: '私たち', bg: 'from-teal-50 to-cyan-50' },
  'та нар': { icon: '👥', label: 'あなたたち', bg: 'from-indigo-50 to-blue-50' },
  'тэд': { icon: '👥', label: '彼ら', bg: 'from-stone-50 to-slate-50' },
  'энэ': { icon: '👇', label: 'これ', bg: 'from-amber-50 to-yellow-50' },
  'энд': { icon: '📍', label: 'ここ', bg: 'from-rose-50 to-red-50' },
  'тэнд': { icon: '🧭', label: 'あそこ', bg: 'from-purple-50 to-indigo-50' },
  'нэг': { icon: '1️⃣', label: '1', bg: 'from-blue-50 to-indigo-50' },
  'хоёр': { icon: '2️⃣', label: '2', bg: 'from-emerald-50 to-teal-50' },
  'гурав': { icon: '3️⃣', label: '3', bg: 'from-amber-50 to-yellow-50' },
  'дөрөв': { icon: '4️⃣', label: '4', bg: 'from-purple-50 to-pink-50' },
  'тав': { icon: '5️⃣', label: '5', bg: 'from-rose-50 to-orange-50' },
  'зургаа': { icon: '6️⃣', label: '6', bg: 'from-cyan-50 to-blue-50' },
  'долоо': { icon: '7️⃣', label: '7', bg: 'from-indigo-50 to-violet-50' },
  'найм': { icon: '8️⃣', label: '8', bg: 'from-teal-50 to-emerald-50' },
  'ес': { icon: '9️⃣', label: '9', bg: 'from-orange-50 to-amber-50' },
  'арав': { icon: '🔟', label: '10', bg: 'from-red-50 to-rose-50' },

  // === 感情・状態 (Emotions & States) ===
  'баяртай': { icon: '😊', label: '嬉しい・さようなら', bg: 'from-yellow-50 to-amber-50' },
  'гунигтай': { icon: '😢', label: '悲しい', bg: 'from-blue-50 to-indigo-50' },
  'ууртай': { icon: '😡', label: '怒っている', bg: 'from-red-50 to-rose-50' },
  'айдас': { icon: '😨', label: '恐れ', bg: 'from-purple-50 to-slate-50' },
  'хайр': { icon: '❤️', label: '愛', bg: 'from-rose-50 to-pink-50' },
  'итгэл': { icon: '🤝', label: '信頼・確信', bg: 'from-emerald-50 to-teal-50' },
  'итгэлгүй': { icon: '🤷', label: '自信がない', bg: 'from-slate-50 to-stone-50' },
  'зоригтой': { icon: '🦁', label: '勇敢な', bg: 'from-amber-50 to-orange-50' },
  'гайхалтай': { icon: '✨', label: '素晴らしい', bg: 'from-yellow-50 to-amber-50' },
  'үнэхээр мундаг': { icon: '🌟', label: '本当にすごい', bg: 'from-amber-50 to-yellow-50' },
  'дажгүй': { icon: '👍', label: 'まぁまぁ・悪くない', bg: 'from-teal-50 to-emerald-50' },
  'зүгээр': { icon: '👌', label: '普通に・大丈夫', bg: 'from-slate-50 to-stone-50' },

  // === 意思・日常動詞 (Verbs & Actions) ===
  'мэдэх': { icon: '💡', label: '知る', bg: 'from-yellow-50 to-amber-50' },
  'мэдэхгүй': { icon: '🤷', label: '知らない', bg: 'from-slate-50 to-stone-50' },
  'ойлгох': { icon: '💡', label: '分かる・理解する', bg: 'from-teal-50 to-emerald-50' },
  'ойлгохгүй': { icon: '❓', label: '分からない', bg: 'from-rose-50 to-red-50' },
  'ойлголоо': { icon: '🙆', label: '分かりました', bg: 'from-emerald-50 to-teal-50' },
  'бодох': { icon: '🤔', label: '思う・考える', bg: 'from-indigo-50 to-blue-50' },
  'хийх': { icon: '🛠️', label: 'する・作る', bg: 'from-amber-50 to-orange-50' },
  'үзэх': { icon: '👀', label: '見る・試す', bg: 'from-cyan-50 to-sky-50' },
  'идэх': { icon: '🍽️', label: '食べる', bg: 'from-orange-50 to-amber-50' },
  'уух': { icon: '🥤', label: '飲む', bg: 'from-sky-50 to-cyan-50' },
  'явах': { icon: '🚶', label: '行く', bg: 'from-emerald-50 to-teal-50' },
  'ирэх': { icon: '🏃', label: '来る', bg: 'from-blue-50 to-indigo-50' },
  'сурах': { icon: '📖', label: '学ぶ・勉強する', bg: 'from-indigo-50 to-purple-50' },
  'унших': { icon: '📖', label: '読む', bg: 'from-purple-50 to-pink-50' },
  'бичих': { icon: '✍️', label: '書く', bg: 'from-amber-50 to-yellow-50' },
  'сонсох': { icon: '🎧', label: '聴く', bg: 'from-teal-50 to-cyan-50' },
  'ярих': { icon: '🗣️', label: '話す', bg: 'from-sky-50 to-blue-50' },
  'унтах': { icon: '😴', label: '寝る', bg: 'from-indigo-50 to-purple-50' },
  'сэрэх': { icon: '⏰', label: '起きる', bg: 'from-yellow-50 to-amber-50' },
  'суух': { icon: '🪑', label: '座る', bg: 'from-stone-50 to-slate-50' },
  'зогсох': { icon: '🧍', label: '立つ・止まる', bg: 'from-blue-50 to-indigo-50' },
  'худалдаж авах': { icon: '🛒', label: '買う', bg: 'from-emerald-50 to-teal-50' },
  'өгөх': { icon: '🎁', label: 'あげる・渡す', bg: 'from-rose-50 to-pink-50' },
  'авах': { icon: '🤲', label: 'もらう・取る', bg: 'from-cyan-50 to-sky-50' },
  'харах': { icon: '👁️', label: '見る', bg: 'from-sky-50 to-blue-50' },
  'уулзах': { icon: '🤝', label: '会う', bg: 'from-teal-50 to-emerald-50' },
  'инээх': { icon: '😄', label: '笑う', bg: 'from-yellow-50 to-amber-50' },
  'уйлах': { icon: '😢', label: '泣く', bg: 'from-blue-50 to-sky-50' },
  'дурлах': { icon: '🥰', label: '恋する', bg: 'from-pink-50 to-rose-50' },
  'хайрлах': { icon: '❤️', label: '愛する', bg: 'from-rose-50 to-red-50' },
  'хичээх': { icon: '💪', label: '努力する・頑張る', bg: 'from-amber-50 to-orange-50' },
  'хичээнэ': { icon: '💪', label: '頑張ります', bg: 'from-amber-50 to-orange-50' },
  'амрах': { icon: '🌴', label: '休む', bg: 'from-emerald-50 to-teal-50' },
  'ажиллах': { icon: '💼', label: '働く', bg: 'from-blue-50 to-indigo-50' },
  'тоглох': { icon: '🎮', label: '遊ぶ', bg: 'from-purple-50 to-pink-50' },

  // === 便利な会話表現 (Useful Phrases) ===
  'сайн байна уу': { icon: '🤝', label: 'こんにちは', bg: 'from-emerald-50 to-teal-50' },
  'баярлалаа': { icon: '🙏', label: 'ありがとう', bg: 'from-amber-50 to-yellow-50' },
  'маш их баярлалаа': { icon: '💐', label: '本当にありがとうございます', bg: 'from-rose-50 to-pink-50' },
  'уучлаарай': { icon: '🙇', label: 'ごめんなさい・すみません', bg: 'from-slate-50 to-stone-50' },
  'тийм': { icon: '✅', label: 'はい・そうです', bg: 'from-emerald-50 to-teal-50' },
  'үгүй': { icon: '❌', label: 'いいえ・違います', bg: 'from-rose-50 to-red-50' },
  'тийм шүү': { icon: '💡', label: 'その通り・確かに', bg: 'from-cyan-50 to-sky-50' },
  'үнэн шүү': { icon: '💯', label: '確かに・本当です', bg: 'from-emerald-50 to-teal-50' },
  'магадгүй': { icon: '🎲', label: '多分', bg: 'from-purple-50 to-pink-50' },
  'бололтой': { icon: '🧐', label: 'おそらく・〜のようだ', bg: 'from-blue-50 to-indigo-50' },
  'байхаа': { icon: '💭', label: '〜のはず・〜だろうな', bg: 'from-amber-50 to-yellow-50' },
  'ёстой': { icon: '☝️', label: '〜すべき・本当に', bg: 'from-indigo-50 to-purple-50' },
  'юу ч болно': { icon: '🆗', label: 'なんでもいい', bg: 'from-teal-50 to-emerald-50' },
  'аль нь ч болно': { icon: '🆗', label: 'どっちでもいい', bg: 'from-teal-50 to-emerald-50' },
  'тоохгүй': { icon: '😌', label: '気にしない', bg: 'from-slate-50 to-stone-50' },
  'зүгээр л': { icon: '🕊️', label: 'ただ・〜だけ', bg: 'from-sky-50 to-blue-50' }
};

/**
 * 単語イラスト・アイコン情報の取得
 */
export function getWordIllustration(wordOrItem, options = {}) {
  if (!wordOrItem) return { icon: '🏷️', label: '単語', bg: 'from-slate-50 to-stone-50', svg: null };

  let rawWord = '';
  let jaMeaning = '';
  let category = '';
  let item = null;

  if (typeof wordOrItem === 'string') {
    rawWord = wordOrItem;
  } else if (typeof wordOrItem === 'object') {
    item = wordOrItem;
    rawWord = item.mongolian || item.dictForm || item.baseWord || item.word || item.correctAnswer || '';
    jaMeaning = item.japanese || item.meaning || item.baseMeaning || item.translation || '';
    category = item.category || item.genreId || '';
  }

  const cleanWord = rawWord.toLowerCase().replace(/[\(\)\（\）\s.,!?-]/g, '');

  // 1. initialIllustrationQuizzes に登録されたSVGイラストがあるかチェック
  let foundSvg = null;
  try {
    let quizList = [];
    if (typeof initialIllustrationQuizzes !== 'undefined') quizList = initialIllustrationQuizzes;
    else if (typeof window !== 'undefined' && window.initialIllustrationQuizzes) quizList = window.initialIllustrationQuizzes;

    const matchedQuiz = quizList.find(q => {
      const qMn = (q.mongolian || '').toLowerCase().replace(/[\(\)\（\）\s.,!?-]/g, '');
      const qDf = (q.dictForm || '').toLowerCase().replace(/[\(\)\（\）\s.,!?-]/g, '');
      return (qMn && (qMn === cleanWord || cleanWord.includes(qMn))) || (qDf && (qDf === cleanWord || cleanWord.includes(qDf)));
    });
    if (matchedQuiz && matchedQuiz.svg) {
      foundSvg = matchedQuiz.svg;
    }
  } catch (_) {}

  // 2. 完全一致・辞書マッチ
  if (WORD_ILLUSTRATIONS[cleanWord]) {
    const entry = WORD_ILLUSTRATIONS[cleanWord];
    return { ...entry, svg: foundSvg };
  }

  // 単語中に含まれるキー（複合語や語幹など）
  for (const [key, val] of Object.entries(WORD_ILLUSTRATIONS)) {
    if (key.length >= 3 && cleanWord.includes(key)) {
      return { ...val, svg: foundSvg };
    }
  }

  // 3. 日本語の意味キーワードによるセマンティック推論
  const ja = (jaMeaning || '').toLowerCase();
  if (ja) {
    if (/手|腕|指|掌/.test(ja)) return { icon: '🖐️', label: '手・腕', bg: 'from-amber-50 to-orange-50', svg: foundSvg };
    if (/頭|脳|おでこ|額/.test(ja)) return { icon: '🧠', label: '頭部', bg: 'from-purple-50 to-pink-50', svg: foundSvg };
    if (/目|瞳|視/.test(ja)) return { icon: '👁️', label: '目', bg: 'from-sky-50 to-blue-50', svg: foundSvg };
    if (/耳|聴|聞/.test(ja)) return { icon: '👂', label: '耳', bg: 'from-rose-50 to-pink-50', svg: foundSvg };
    if (/鼻|嗅/.test(ja)) return { icon: '👃', label: '鼻', bg: 'from-orange-50 to-amber-50', svg: foundSvg };
    if (/口|唇|舌|歯/.test(ja)) return { icon: '👄', label: '口・歯', bg: 'from-rose-50 to-red-50', svg: foundSvg };
    if (/足|脚|膝|すね|かかと/.test(ja)) return { icon: '🦶', label: '足', bg: 'from-amber-50 to-orange-50', svg: foundSvg };
    if (/腹|胃|へそ|内臓/.test(ja)) return { icon: '🤰', label: 'お腹・胃', bg: 'from-emerald-50 to-teal-50', svg: foundSvg };
    if (/背|腰|肩|首/.test(ja)) return { icon: '🧍', label: '体', bg: 'from-blue-50 to-indigo-50', svg: foundSvg };
    if (/心|愛|恋/.test(ja)) return { icon: '❤️', label: '心・愛', bg: 'from-rose-50 to-red-50', svg: foundSvg };
    if (/本|ノート|ペン|筆|辞書|読|書/.test(ja)) return { icon: '📖', label: '文具・読書', bg: 'from-indigo-50 to-purple-50', svg: foundSvg };
    if (/学校|大学|先生|生徒|学生|勉強|試験/.test(ja)) return { icon: '🏫', label: '学校・学び', bg: 'from-blue-50 to-indigo-50', svg: foundSvg };
    if (/服|シャツ|ズボン|靴|帽|着/.test(ja)) return { icon: '👕', label: '衣服', bg: 'from-sky-50 to-blue-50', svg: foundSvg };
    if (/パン|肉|米|ご飯|スープ|魚|卵|料理|食/.test(ja)) return { icon: '🍽️', label: '食事・料理', bg: 'from-orange-50 to-amber-50', svg: foundSvg };
    if (/茶|水|酒|牛乳|ミルク|飲/.test(ja)) return { icon: '🍵', label: '飲み物', bg: 'from-emerald-50 to-teal-50', svg: foundSvg };
    if (/家|部屋|窓|ドア|机|椅子|ベッド|家具/.test(ja)) return { icon: '🏠', label: '住まい・家具', bg: 'from-amber-50 to-yellow-50', svg: foundSvg };
    if (/テレビ|冷蔵庫|洗濯機|掃除機|電話|スマホ|パソコン|時計/.test(ja)) return { icon: '📱', label: '家電・機器', bg: 'from-cyan-50 to-blue-50', svg: foundSvg };
    if (/林檎|りんご|オレンジ|バナナ|苺|果物|野菜|じゃがいも|トマト/.test(ja)) return { icon: '🍎', label: '果物・野菜', bg: 'from-red-50 to-rose-50', svg: foundSvg };
    if (/馬|ラクダ|羊|山羊|牛|犬|猫|動物|鳥/.test(ja)) return { icon: '🐾', label: '動物', bg: 'from-amber-50 to-orange-50', svg: foundSvg };
    if (/山|川|湖|森|草原|砂漠|自然/.test(ja)) return { icon: '🏔️', label: '自然', bg: 'from-emerald-50 to-teal-50', svg: foundSvg };
    if (/太陽|月|星|空|雲|雨|雪|風|天/.test(ja)) return { icon: '⛅', label: '天気・天体', bg: 'from-sky-50 to-cyan-50', svg: foundSvg };
    if (/車|バス|電車|飛行機|自転車|交通|駅/.test(ja)) return { icon: '🚗', label: '交通・乗り物', bg: 'from-blue-50 to-indigo-50', svg: foundSvg };
    if (/街|都市|店|市場|病院|ホテル|銀行/.test(ja)) return { icon: '🏙️', label: '街・施設', bg: 'from-indigo-50 to-purple-50', svg: foundSvg };
    if (/家族|父|母|兄|姉|弟|妹|子|友/.test(ja)) return { icon: '👨‍👩‍👧‍👦', label: '家族・人', bg: 'from-amber-50 to-orange-50', svg: foundSvg };
    if (/犯罪|警察|法|裁判|泥棒|刑/.test(ja)) return { icon: '⚖️', label: '法・警察', bg: 'from-red-50 to-amber-50', svg: foundSvg };
    if (/音楽|歌|踊|楽器|琴/.test(ja)) return { icon: '🎵', label: '音楽・芸能', bg: 'from-fuchsia-50 to-pink-50', svg: foundSvg };
    if (/寿司|着物|相撲|桜|日本/.test(ja)) return { icon: '🗾', label: '日本文化', bg: 'from-rose-50 to-red-50', svg: foundSvg };
    if (/私|あなた|彼|彼女|これ|あれ|ここ/.test(ja)) return { icon: '👤', label: '代名詞・指示', bg: 'from-teal-50 to-cyan-50', svg: foundSvg };
    if (/嬉|楽|喜/.test(ja)) return { icon: '😊', label: '喜び', bg: 'from-yellow-50 to-amber-50', svg: foundSvg };
    if (/悲|泣/.test(ja)) return { icon: '😢', label: '悲しみ', bg: 'from-blue-50 to-indigo-50', svg: foundSvg };
    if (/怒/.test(ja)) return { icon: '😡', label: '怒り', bg: 'from-red-50 to-rose-50', svg: foundSvg };
    if (/行|来|走|歩|飛|泳/.test(ja)) return { icon: '🏃', label: '移動・行動', bg: 'from-emerald-50 to-teal-50', svg: foundSvg };
    if (/見|視|観/.test(ja)) return { icon: '👀', label: '見る', bg: 'from-cyan-50 to-sky-50', svg: foundSvg };
    if (/言|話|語/.test(ja)) return { icon: '🗣️', label: '話す', bg: 'from-sky-50 to-blue-50', svg: foundSvg };
    if (/知|分か|思|考/.test(ja)) return { icon: '💡', label: '思考・理解', bg: 'from-yellow-50 to-amber-50', svg: foundSvg };
    if (/ありがとう|こんにちは|さようなら|すみません/.test(ja)) return { icon: '🙏', label: '挨拶・表現', bg: 'from-amber-50 to-yellow-50', svg: foundSvg };
  }

  // 4. カテゴリーによるフォールバック
  const cat = (category || '').toLowerCase();
  if (/body|身体/.test(cat)) return { icon: '👤', label: '身体', bg: 'from-amber-50 to-orange-50', svg: foundSvg };
  if (/school|学校|文具|教育/.test(cat)) return { icon: '📚', label: '学校・教育', bg: 'from-blue-50 to-indigo-50', svg: foundSvg };
  if (/clothing|衣類|服/.test(cat)) return { icon: '👕', label: '衣類', bg: 'from-sky-50 to-blue-50', svg: foundSvg };
  if (/dining|food|食べ物|食事/.test(cat)) return { icon: '🍽️', label: '食べ物', bg: 'from-orange-50 to-amber-50', svg: foundSvg };
  if (/appliances|daily|家電|日用品|家具/.test(cat)) return { icon: '🏠', label: '日用品・家電', bg: 'from-teal-50 to-emerald-50', svg: foundSvg };
  if (/produce|fruits|果物|野菜/.test(cat)) return { icon: '🍎', label: '果物・野菜', bg: 'from-red-50 to-rose-50', svg: foundSvg };
  if (/directions|orientation|方位|方角/.test(cat)) return { icon: '🧭', label: '方位・方角', bg: 'from-indigo-50 to-purple-50', svg: foundSvg };
  if (/law|crime|犯罪|法/.test(cat)) return { icon: '⚖️', label: '犯罪・法', bg: 'from-red-50 to-rose-50', svg: foundSvg };
  if (/emotions|feelings|感情/.test(cat)) return { icon: '💭', label: '感情・心理', bg: 'from-yellow-50 to-amber-50', svg: foundSvg };
  if (/weather|nature|自然|天気/.test(cat)) return { icon: '⛅', label: '天気・自然', bg: 'from-sky-50 to-cyan-50', svg: foundSvg };
  if (/pronouns|人称|代名詞/.test(cat)) return { icon: '👤', label: '人称代名詞', bg: 'from-cyan-50 to-sky-50', svg: foundSvg };
  if (/numbers|数字/.test(cat)) return { icon: '🔢', label: '数字', bg: 'from-purple-50 to-pink-50', svg: foundSvg };
  if (/places|city|場所|施設|街/.test(cat)) return { icon: '📍', label: '場所・施設', bg: 'from-emerald-50 to-teal-50', svg: foundSvg };
  if (/japan|日本文化/.test(cat)) return { icon: '🗾', label: '日本文化', bg: 'from-rose-50 to-red-50', svg: foundSvg };
  if (/music|音楽/.test(cat)) return { icon: '🎵', label: '音楽・芸能', bg: 'from-fuchsia-50 to-pink-50', svg: foundSvg };
  if (/useful|便利/.test(cat)) return { icon: '💬', label: '便利な言葉', bg: 'from-lime-50 to-emerald-50', svg: foundSvg };
  if (/business|仕事/.test(cat)) return { icon: '💼', label: 'ビジネス', bg: 'from-cyan-50 to-blue-50', svg: foundSvg };
  if (/medical|医療/.test(cat)) return { icon: '🩺', label: '医療', bg: 'from-rose-50 to-red-50', svg: foundSvg };

  return { icon: '🏷️', label: '単語', bg: 'from-slate-50 to-stone-50', svg: foundSvg };
}

/**
 * 単語イラストのHTMLバッジまたはSVGカードを生成
 * options: { size: 'sm'|'md'|'lg'|'xl', inline: false, forceSvg: false, className: '' }
 */
export function getWordIllustrationHTML(wordOrItem, options = {}) {
  const ill = getWordIllustration(wordOrItem, options);
  if (!ill) return '';

  if (options.inline) {
    return ill.icon || '🏷️';
  }

  const size = options.size || 'md';
  let sizeClasses = 'w-10 h-10 text-xl rounded-xl';
  if (size === 'sm') sizeClasses = 'w-8 h-8 text-base rounded-lg';
  else if (size === 'lg') sizeClasses = 'w-12 h-12 text-2xl rounded-2xl';
  else if (size === 'xl') sizeClasses = 'w-16 h-16 sm:w-20 sm:h-20 text-3xl sm:text-4xl rounded-2xl sm:rounded-3xl';

  // SVG表示（大画面・クイズ用）
  if (ill.svg && (size === 'xl' || options.forceSvg)) {
    return `
      <div class="word-illustration-box inline-flex items-center justify-center p-2 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs ${options.className || ''}">
        ${ill.svg}
      </div>
    `;
  }

  return `
    <div class="word-illustration-badge inline-flex items-center justify-center ${sizeClasses} bg-gradient-to-br ${ill.bg} dark:from-slate-800 dark:to-slate-700 text-slate-800 dark:text-white border border-slate-200/90 dark:border-slate-700 shadow-2xs shrink-0 select-none ${options.className || ''}" title="${ill.label || ''}">
      <span>${ill.icon}</span>
    </div>
  `;
}

if (typeof window !== 'undefined') {
  window.WORD_ILLUSTRATIONS = WORD_ILLUSTRATIONS;
  window.getWordIllustration = getWordIllustration;
  window.getWordIllustrationHTML = getWordIllustrationHTML;
}

/**
 * 4択テスト用 全選択肢の単語詳細解説アコーディオン生成
 * 終わった後の結果画面や各問題で、出題された4つの選択肢すべてについて
 * イラスト、品詞、日本語訳、語幹、単語の成り立ち、語呂合わせ、例文をタップ展開可能にする
 */

/**
 * 似ている単語・紛らわしい単語の使い分け・相違点データベース (150+ 語網羅)
 * ユーザー要件: 「似ている単語がある場合は、解説するときにそれと何が違うのか、も書いて」
 */
export const SIMILAR_WORDS_DISTINCTIONS = {

  // === 暦・時間・期間の重要類義語＆音類似 ===
  "он": {
    target: "он",
    targetMeaning: "年（西暦・特定の暦年）",
    meaningSimilar: [
      { word: "жил", meaning: "年（期間・歳月・年齢・干支）", note: "期間・年齢" }
    ],
    meaningDistinction: "【он と жил の使い分け】\n・он（西暦・暦年・日付の年）: 特定のカレンダー上の年号を表します。西暦何年か尋ねる時や年号の後に付きます（例: 2026 он / 2026年、хэдэн он бэ? / 西暦何年ですか？、он сар өдөр / 年月日、шинэ он / 新年）。\n・жил（期間・歳月・年齢・十二支）: 「1年間、2年間」といった時間の長さ（期間）や、年齢、十二支を表します（例: нэг жил / 1年間、энэ жил / 今年、өнгөрсөн жил / 去年、хэдэн жил болсон бэ? / 何年経ちましたか？、морин жил / 午年）。",
    phoneticSimilar: [
      { word: "энэ", meaning: "これ、この", note: "指示代名詞" },
      { word: "од", meaning: "星", note: "母音/語尾違い" }
    ],
    phoneticDistinction: "⚠️ 綴り・発音が似ている「энэ（これ）」は指示代名詞、「он（年）」は暦を表す名詞です。1文字の違いで文法も意味も全く異なります。"
  },
  "жил": {
    target: "жил",
    targetMeaning: "年（期間・歳月・年齢・干支）",
    meaningSimilar: [
      { word: "он", meaning: "年（西暦・特定の暦年）", note: "西暦・暦年" }
    ],
    meaningDistinction: "【жил と он の使い分け】\n・жил（期間・歳月・年齢・干支）: 「1年間、2年間」といった期間の長さや、身近な年（今年・去年）、十二支、年齢を表します（例: нэг жил / 1年間、энэ жил / 今年、хэдэн жил сурсан бэ? / 何年勉強しましたか？）。\n・он（西暦・暦年）: 「2026年」などカレンダーの日付や西暦年号を表します（例: 2026 он、хэдэн он бэ? / 西暦何年ですか？）。",
    phoneticSimilar: [
      { word: "жижиг", meaning: "小さい", note: "形容詞" },
      { word: "жимс", meaning: "果物", note: "名詞" }
    ],
    phoneticDistinction: "⚠️ 綴りや語頭「жи-」が似ている単語に「жижиг（小さい）」「жимс（果物）」があります。語尾の文字をしっかり確認しましょう。"
  },
  "өдөр": {
    target: "өдөр",
    targetMeaning: "日・昼間・日付",
    meaningSimilar: [
      { word: "хоног", meaning: "日（24時間・丸一日・宿泊滞在日数）", note: "丸一日・滞在" }
    ],
    meaningDistinction: "【өдөр と хоног の使い分け】\n・өдөр（昼間・特定の日付）: 日中の時間帯や、カレンダーの特定の日を表します（例: өнөөдөр / 今日、өдөр бүр / 毎日、сайхан өдөр / 良い一日）。\n・хоног（24時間・丸一日・滞在日数）: 昼と夜を合わせた「丸1日（24時間）」や、ホテルの宿泊数・旅行日数を数える時に使います（例: хоёр хоног / 2日間・丸2日、хэдэн хоног амрах вэ? / 何日間休みますか？）。",
    phoneticSimilar: [
      { word: "өвөл", meaning: "冬", note: "季節" },
      { word: "өглөө", meaning: "朝", note: "時間帯" }
    ],
    phoneticDistinction: "⚠️ 「өдөр（日・昼）」と「өвөл（冬）」は母音 ө で始まり子音（д vs в）が異なるだけの紛らわしい単語です。"
  },
  "хоног": {
    target: "хоног",
    targetMeaning: "日（丸一日・24時間・宿泊日数）",
    meaningSimilar: [
      { word: "өдөр", meaning: "日・昼間・日付", note: "日付・昼間" }
    ],
    meaningDistinction: "【хоног と өдөр の使い分け】\n・хоног（丸一日・24時間単位）: 昼夜を含めた24時間単位の期間や、宿泊数・滞在日数に用います（例: нэг хоног / 丸一日・1泊、3 хоног / 3日間）。\n・өдөр（昼間・日付）: カレンダーの日付や昼間の時間帯に使います（例: өнөөдөр / 今日）。",
    phoneticSimilar: [
      { word: "хонох", meaning: "泊まる・夜を過ごす", note: "動詞（同語源）" }
    ],
    phoneticDistinction: "💡 名詞「хоног（24時間・1日）」は動詞「хонох（泊まる）」から派生した言葉です。"
  },
  "цаг": {
    target: "цаг",
    targetMeaning: "時・時刻・時計・時間",
    meaningSimilar: [
      { word: "хугацаа", meaning: "期間・期限", note: "期間・締め切り" },
      { word: "үе", meaning: "時期・時代・頃", note: "時代・時期" }
    ],
    meaningDistinction: "【цаг / хугацаа / үе の使い分け】\n・цаг: 時計が指す時刻（○時）、授業時間、一般的な時間（例: хэдэн цаг болж байна? / 何時ですか？、цаг агаар / 天気）。\n・хугацаа: 期限、有効期間、一定の時間幅（例: хугацаа дуусах / 期限が切れる）。\n・үе: 〜の頃、時代、世代、タイミング（例: хүүхэд насны үе / 子どもの頃）。",
    phoneticSimilar: [
      { word: "цаас", meaning: "紙", note: "名詞" },
      { word: "цас", meaning: "雪", note: "名詞" }
    ],
    phoneticDistinction: "⚠️ 「цаг（時）」「цас（雪）」「цаас（紙）」はすべて「ца-」で始まるため発音と綴りの混同に要注意です。"
  },
  "хугацаа": {
    target: "хугацаа",
    targetMeaning: "期間・期限・締め切り",
    meaningSimilar: [
      { word: "цаг", meaning: "時・時刻・時間", note: "時刻" },
      { word: "үе", meaning: "時期・時代", note: "時期" }
    ],
    meaningDistinction: "期限やあらかじめ決められた「時間枠・期間」には「хугацаа」を使います（例: богино хугацаанд / 短期間で）。",
    phoneticSimilar: [
      { word: "хувцас", meaning: "服・衣服", note: "名詞" }
    ],
    phoneticDistinction: "⚠️ 「хугацаа（期間）」と「хувцас（衣服）」は綴りの形が似ているため読み間違いに注意しましょう。"
  },
  "үе": {
    target: "үе",
    targetMeaning: "時期・時代・〜の頃・関節",
    meaningSimilar: [
      { word: "цаг", meaning: "時・時間", note: "時刻" },
      { word: "хугацаа", meaning: "期間", note: "期限" }
    ],
    meaningDistinction: "人生の段階（子どもの頃など）や歴史の時代、何かが起きる特定のタイミングには「үе」を使います（例: энэ үед / この時、залуу үе / 若い世代）。",
    phoneticSimilar: [
      { word: "үг", meaning: "言葉・単語", note: "名詞" },
      { word: "үүл", meaning: "雲", note: "名詞" }
    ],
    phoneticDistinction: "⚠️ 1音節の短い単語「үе（時期・節）」「үг（言葉）」「үүл（雲）」は母音 ү の発音と語尾を正確に区別しましょう。"
  },
  "том": {
    target: "том",
    targetMeaning: "大きい（サイズ・体積・規模）",
    meaningSimilar: [
      { word: "их", meaning: "多い・甚だしい（数量・程度）", note: "数量・程度" }
    ],
    meaningDistinction: "【том と их の使い分け】\n・том（サイズ・形が大きい）: 物理的な大きさ・寸法・規模が大きいこと（例: том байшин / 大きな家、том цүнх / 大きな鞄）。\n・их（数量・程度が多い）: 数えられないものの量が多い、または程度が甚だしいこと（例: их цас / たくさんの雪、их баярлалаа / どうもありがとうございます）。",
    phoneticSimilar: [
      { word: "тос", meaning: "油・バター", note: "名詞" },
      { word: "тоо", meaning: "数・数字", note: "名詞" }
    ],
    phoneticDistinction: "⚠️ 「том（大きい）」と「тос（油）」「тоо（数字）」の音・綴りの混同に注意してください。"
  },
  "их": {
    target: "их",
    targetMeaning: "多い・たくさん・非常に（数量・程度）",
    meaningSimilar: [
      { word: "том", meaning: "大きい（サイズ・体積）", note: "サイズ" },
      { word: "олон", meaning: "たくさんの（数えられる個数・人数）", note: "可算数" }
    ],
    meaningDistinction: "【их と олон と том の使い分け】\n・их: 数量・程度が大きい（例: их ажил / たくさんの仕事、их хүйтэн / とても寒い）。\n・олон: 数えられる人や物がたくさんある（例: олон хүн / たくさんの人、олон ном / たくさんの本）。\n・том: 物理的なサイズが大きい（例: том алим / 大きなリンゴ）。",
    phoneticSimilar: [
      { word: "эх", meaning: "母・始まり・原点", note: "名詞" }
    ],
    phoneticDistinction: "⚠️ 母音が「и」の「их（多い）」と、母音が「э」の「эх（母・始まり）」は発音の違いで意味が大きく変わります。"
  },
  "жижиг": {
    target: "жижиг",
    targetMeaning: "小さい（サイズ・寸法）",
    meaningSimilar: [
      { word: "бага", meaning: "少ない（量）・幼い（年齢）", note: "量・年齢" },
      { word: "цөөн", meaning: "少ない（数・人数）", note: "可算数" }
    ],
    meaningDistinction: "【жижиг と бага の使い分け】\n・жижиг: 物理的なサイズが小さい（例: жижиг өрөө / 小さい部屋、жижиг үсэг / 小文字）。\n・бага: 数量や程度が少ない、または年齢が若い（例: бага нас / 幼少期、бага зэрэг / 少しだけ）。",
    phoneticSimilar: [
      { word: "жил", meaning: "年・歳月", note: "名詞" }
    ],
    phoneticDistinction: "⚠️ 「жижиг（小さい）」と「жил（年）」は同じ「жи-」から始まります。"
  },
  "бага": {
    target: "бага",
    targetMeaning: "少ない・小さい・幼い（量・程度・年齢）",
    meaningSimilar: [
      { word: "жижиг", meaning: "小さい（サイズ）", note: "サイズ" },
      { word: "цөөн", meaning: "少ない（数・人数）", note: "可算数" }
    ],
    meaningDistinction: "【бага と цөөн の使い分け】\n・бага: 量・程度が少ない、年齢が幼い（例: бага мөнгө / わずかなお金、бага дүү / 幼い弟・妹）。\n・цөөн: 数えられる人・物の数が少ない（例: цөөн хүн / 少人数）。",
    phoneticSimilar: [
      { word: "баг", meaning: "チーム・集団・仮面", note: "名詞" },
      { word: "багш", meaning: "先生・教師", note: "名詞" }
    ],
    phoneticDistinction: "⚠️ 「бага（少ない・幼い）」と「баг（チーム・マスク）」「багш（先生）」の語尾に注意しましょう。"
  },
  "хурдан": {
    target: "хурдан",
    targetMeaning: "速い・素早い（スピード）",
    meaningSimilar: [
      { word: "эрт", meaning: "早い（時間・時期）", note: "時刻・時期" },
      { word: "түргэн", meaning: "急な・素早い", note: "敏速" }
    ],
    meaningDistinction: "【хурдан と эрт の使い分け】\n・хурдан: 動きや乗り物の速度が速い（例: хурдан явах / 速く歩く・走る、хурдан галт тэрэг / 高速列車）。\n・эрт: 時計の時刻や朝・季節の訪れが早い（例: өглөө эрт / 朝早く、эрт ирэх / 早く来る）。",
    phoneticSimilar: [
      { word: "хурга", meaning: "子羊", note: "名詞" }
    ],
    phoneticDistinction: "⚠️ 「хурдан（速い）」と「хурга（子羊）」の綴りに注意しましょう。"
  },
  "эрт": {
    target: "эрт",
    targetMeaning: "早い・昔（時間・時期・昔）",
    meaningSimilar: [
      { word: "хурдан", meaning: "速い（スピード）", note: "速度" }
    ],
    meaningDistinction: "時間が早い時は「эрт」、速度が速い時は「хурдан」を使い分けます（例: эрт босох / 早起きする）。",
    phoneticSimilar: [
      { word: "эр", meaning: "男性・雄", note: "名詞" },
      { word: "эрдэм", meaning: "学問・徳", note: "名詞" }
    ],
    phoneticDistinction: "⚠️ 短い語「эрт（早く・昔）」と「эр（男性）」の発音の違いに注意してください。"
  },
  "хүйтэн": {
    target: "хүйтэн",
    targetMeaning: "寒い・冷たい（気温・温度）",
    meaningSimilar: [
      { word: "сэрүүн", meaning: "涼しい・冷涼な", note: "心地よい涼しさ" }
    ],
    meaningDistinction: "【хүйтэн と сэрүүн の使い分け】\n・хүйтэн: 氷点下や手足がかじかむような厳しい寒さ、冷たい水（例: хүйтэн өвөл / 寒い冬、хүйтэн ус / 冷水）。\n・сэрүүн: 爽やかで過ごしやすい涼しさ、秋口の心地よい気候（例: сэрүүн намар / 涼しい秋、сэрүүн салхи / 涼しい風）。",
    phoneticSimilar: [
      { word: "хүнд", meaning: "重い・困難な", note: "形容詞" },
      { word: "хүн", meaning: "人・人間", note: "名詞" }
    ],
    phoneticDistinction: "⚠️ 「хүйтэн（寒い）」と「хүнд（重い）」の母音・子音の違いに注意しましょう。"
  },
  "сэрүүн": {
    target: "сэрүүн",
    targetMeaning: "涼しい・冷涼な・目覚めている",
    meaningSimilar: [
      { word: "хүйтэн", meaning: "寒い・冷たい", note: "厳しい寒さ" }
    ],
    meaningDistinction: "心地よい涼しさは「сэрүүн」、厳しい寒さは「хүйтэн」を使います。",
    phoneticSimilar: [
      { word: "сүү", meaning: "牛乳・ミルク", note: "名詞" }
    ],
    phoneticDistinction: "⚠️ 「сэрүүн（涼しい）」と「сүү（牛乳）」の混同に注意しましょう。"
  },
  "дулаан": {
    target: "дулаан",
    targetMeaning: "暖かい・温暖な（気温・衣服）",
    meaningSimilar: [
      { word: "халуун", meaning: "暑い・熱い（猛暑・高温）", note: "酷暑・熱湯" }
    ],
    meaningDistinction: "【дулаан と халуун の使い分け】\n・дулаан: ポカポカと心地よい適度な暖かさ、防寒性がある服（例: дулаан хавар / 暖かい春、дулаан хувцас / 暖かい服）。\n・халуун: 汗が出る猛暑、お湯・お茶の熱さ、発熱（例: халуун зун / 暑い夏、халуун цай / 熱いお茶、халуурах / 熱を出す）。",
    phoneticSimilar: [
      { word: "далай", meaning: "海・大洋", note: "名詞" }
    ],
    phoneticDistinction: "⚠️ 「дулаан（暖かい）」と「далай（海）」の母音配置に注意しましょう。"
  },
  "халуун": {
    target: "халуун",
    targetMeaning: "暑い・熱い（猛暑・高温）",
    meaningSimilar: [
      { word: "дулаан", meaning: "暖かい（適温）", note: "心地よい暖かさ" }
    ],
    meaningDistinction: "猛暑や熱湯・高熱には「халуун」、過ごしやすい春の暖かさには「дулаан」を使います。",
    phoneticSimilar: [
      { word: "харах", meaning: "見る", note: "動詞" },
      { word: "харих", meaning: "帰る", note: "動詞" }
    ],
    phoneticDistinction: "⚠️ 形容詞「халуун（熱い）」と動詞「харах（見る）」「харих（帰る）」の語幹の綴りに注意しましょう。"
  },
  "найз": {
    target: "найз",
    targetMeaning: "友達・友人",
    meaningSimilar: [
      { word: "нөхөр", meaning: "夫・同志・仲間", note: "夫・同志" },
      { word: "анд", meaning: "無二の親友・盟友", note: "固い絆の友" }
    ],
    meaningDistinction: "【найз / нөхөр / анд の使い分け】\n・найз: 最も日常的で広く使われる「友達」（例: миний найз / 私の友達）。\n・нөхөр: 配偶者の「夫」、または志を共にする「同志・仲間」（例: нөхөр минь / 私の夫）。\n・анд: 固い誓いや信頼で結ばれた無二の親友（例: анд нөхөр / 盟友）。",
    phoneticSimilar: [
      { word: "намар", meaning: "秋", note: "名詞" }
    ],
    phoneticDistinction: "⚠️ 「найз（友達）」と「намар（秋）」の語尾を確認しましょう。"
  },
  "нөхөр": {
    target: "нөхөр",
    targetMeaning: "夫・配偶者・同志・仲間",
    meaningSimilar: [
      { word: "найз", meaning: "友達", note: "一般的な友人" },
      { word: "анд", meaning: "無二の親友", note: "盟友" }
    ],
    meaningDistinction: "日常会話で女性が「миний нөхөр」と言うと「私の夫」を指します。一般的な男友達や同級生は「найз」と言います。",
    phoneticSimilar: [
      { word: "нүх", meaning: "穴", note: "名詞" }
    ],
    phoneticDistinction: "⚠️ 「нөхөр（夫・仲間）」と「нүх（穴）」の発音に注意してください。"
  },
  "гэр": {
    target: "гэр",
    targetMeaning: "家・自宅・家庭・ゲル",
    meaningSimilar: [
      { word: "байшин", meaning: "建物・一軒家・家屋", note: "物理的な建物" },
      { word: "орон сууц", meaning: "マンション・集合住宅", note: "集合住宅" }
    ],
    meaningDistinction: "【гэр と байшин の使い分け】\n・гэр: 自分が帰るべき「自宅・家庭」や、伝統的移動式住居「ゲル」（例: гэртээ харих / 家に帰る、гэр бүл / 家族）。\n・байшин: 木造やレンガ・コンクリート造りの物理的な「建物・一軒家」（例: хоёр давхар байшин / 2階建ての家）。",
    phoneticSimilar: [
      { word: "гар", meaning: "手 / 出る（動詞語幹）", note: "名詞/動詞" }
    ],
    phoneticDistinction: "⚠️ 母音 э の「гэр（家）」と、母音 а の「гар（手・出る）」は男性母音/女性母音の違いで全く異なる意味になります。"
  },
  "байшин": {
    target: "байшин",
    targetMeaning: "建物・家屋・一軒家",
    meaningSimilar: [
      { word: "гэр", meaning: "家・自宅・ゲル", note: "我が家・ゲル" },
      { word: "орон сууц", meaning: "マンション・アパート", note: "集合住宅" }
    ],
    meaningDistinction: "物理的な構造物・建物は「байшин」、心安らぐ自宅や家庭、伝統住居ゲルは「гэр」を使います。",
    phoneticSimilar: [
      { word: "багш", meaning: "先生", note: "名詞" }
    ],
    phoneticDistinction: "⚠️ 「байшин（建物）」と「багш（先生）」の読み分けに注意しましょう。"
  },
  "хэлэх": {
    target: "хэлэх",
    targetMeaning: "言う・告げる・伝える",
    meaningSimilar: [
      { word: "ярих", meaning: "話す・会話する・語る", note: "会話・対話" },
      { word: "дуугарах", meaning: "声を出す・発言する", note: "声を出す" }
    ],
    meaningDistinction: "【хэлэх と ярих の使い分け】\n・хэлэх: 一言言葉を発する、相手に特定の情報を告げる（英語の say / tell）（例: нэрээ хэлэх / 名前を言う、үнэнийг хэлэх / 真実を言う）。\n・ярих: まとまった内容を会話する、おしゃべりする（英語の speak / talk）（例: монголоор ярих / モンゴル語で話す、утсаар ярих / 電話で話す）。",
    phoneticSimilar: [
      { word: "хийх", meaning: "する・行う", note: "動詞" },
      { word: "хөл", meaning: "足", note: "名詞" }
    ],
    phoneticDistinction: "⚠️ 最重要動詞「хэлэх（言う）」と「хийх（する）」の活用形の混同に注意しましょう。"
  },
  "ярих": {
    target: "ярих",
    targetMeaning: "話す・会話する・語る",
    meaningSimilar: [
      { word: "хэлэх", meaning: "言う・告げる", note: "一言告げる" },
      { word: "өгүүлэх", meaning: "述べる・物語る", note: "物語る" }
    ],
    meaningDistinction: "対話や会話、物語を語る時は「ярих」、伝言や名前を告げる時は「хэлэх」を使います。",
    phoneticSimilar: [
      { word: "явах", meaning: "行く・歩く", note: "動詞" }
    ],
    phoneticDistinction: "⚠️ 最頻出動詞「ярих（話す）」と「явах（行く）」はどちらも「я-」で始まります。"
  },

  // 1. 知識・理解・推量・思考
  "мэдэх": {
    target: "мэдэх",
    targetMeaning: "知る・知識として持っている",
    similar: [
      { word: "ойлгох", meaning: "分かる・理解する" },
      { word: "таних", meaning: "面識がある・見知っている" }
    ],
    distinction: "【知るの使い分け】\n・мэдэх: 客観的な情報・事実・知識として「知っている」（例: Би дугаарыг нь мэднэ / 電話番号を知っている）。\n・ойлгох: 言葉の意味や道理、相手の意図が頭に落ちて「納得・理解する」（例: Би ойлголоо / 分かりました）。\n・таних: 人の顔や性格、特定の場所を「見知っている・面識がある」（例: Би түүнийг сайн танина / 彼のことはよく知っています）。"
  },
  "мэдэхгүй": {
    target: "мэдэхгүй",
    targetMeaning: "知らない",
    similar: [
      { word: "ойлгохгүй", meaning: "分からない・理解できない" },
      { word: "танихгүй", meaning: "知らない人だ・面識がない" }
    ],
    distinction: "情報や知識がない時は「мэдэхгүй（知らない）」、説明された意味が理解できない時は「ойлгохгүй（分からない）」、見知らぬ人には「танихгүй（面識がない）」を使い分けます。"
  },
  "ойлгох": {
    target: "ойлгох",
    targetMeaning: "分かる・理解する",
    similar: [
      { word: "мэдэх", meaning: "知る" },
      { word: "ухаарах", meaning: "悟る・自覚する" }
    ],
    distinction: "「ойлгох」は話の意味や道理を頭で「理解する」こと。「мэдэх（単なる知識の有無）」と異なり、相手の話に納得した時は「Аан, ойлголоо（ああ、分かりました）」と言います。"
  },
  "ойлгохгүй": {
    target: "ойлгохгүй",
    targetMeaning: "分からない・理解できない",
    similar: [
      { word: "мэдэхгүй", meaning: "知らない" }
    ],
    distinction: "相手の言っているモンゴル語の意味が聞き取れなかったり理解できない時は「Ойлгохгүй байна（分かりません）」と言います（知識自体がない「Мэдэхгүй」とは異なります）。"
  },
  "таних": {
    target: "таних",
    targetMeaning: "面識がある・見知っている",
    similar: [
      { word: "мэдэх", meaning: "知る" }
    ],
    distinction: "人物や街並みに対して「あの人知ってる？」「この辺知ってる？」と尋ねる時は「таних」を使います（× мэдэх は情報・事実）。"
  },
  "бодох": {
    target: "бодох",
    targetMeaning: "思う・考える",
    similar: [
      { word: "болох", meaning: "なる・OK", note: "⚠️ 1文字違い (д と л)" },
      { word: "санах", meaning: "思い出す・恋しく思う" },
      { word: "төсөөлөх", meaning: "想像する" }
    ],
    distinction: "【綴り・意味の混同注意！】\n・бодох (語幹 бод-): 頭で考える、〜と思う（... гэж бодож байна）。文字「д」！\n・болох (語幹 бол-): 〜になる、〜しても良い（болно）。文字「л」！\n・санах: 過去の記憶を「思い出す」、故郷や人を「恋しく思う」。"
  },
  "болох": {
    target: "болох",
    targetMeaning: "なる・良い・可能だ",
    similar: [
      { word: "бодох", meaning: "思う・考える", note: "⚠️ 1文字違い (л と д)" },
      { word: "чадах", meaning: "能力として〜できる" }
    ],
    distinction: "「болох」は状況の変化（〜になる）や許可（〜しても良い / болно）を表します。個人の能力やスキルで「できる」は「чадах」、頭で「考える」は「бодох」です。"
  },
  "магадгүй": {
    target: "магадгүй",
    targetMeaning: "多分・もしかすると",
    similar: [
      { word: "бололтой", meaning: "〜のようだ・〜らしい" },
      { word: "лав", meaning: "きっと・間違いなく" },
      { word: "байхаа", meaning: "〜だろうな・〜のはず" }
    ],
    distinction: "【推量の確信度の違い】\n・магадгүй: 可能性50%前後の不確定な推測（多分・もしかしたら）。\n・бололтой: 外見や気配、状況証拠から察する推量（〜らしい・〜のようだ）。\n・лав: 話し手の確信が極めて高い推量（きっと・間違いなく）。\n・байхаа: 自分の見解を穏やかに相手に伝える推量（〜だろうな・〜のはず）。"
  },
  "бололтой": {
    target: "бололтой",
    targetMeaning: "〜らしい・〜のようだ",
    similar: [
      { word: "магадгүй", meaning: "多分" },
      { word: "шиг", meaning: "〜のようだ（比喩）" }
    ],
    distinction: "「бололтой」は天気や人の様子など「外見・兆候から見て〜らしい」という状況判断。単なる確率の「магадгүй（多分）」や比喩の「шиг（まるで〜のよう）」と区別します。"
  },
  "лав": {
    target: "лав",
    targetMeaning: "きっと・確実に",
    similar: [
      { word: "магадгүй", meaning: "多分（確信度50%）" },
      { word: "заавал", meaning: "必ず・絶対に（義務・意志）" }
    ],
    distinction: "「лав」は推量の確信度が非常に高く「きっとそうだ」の意。「заавал（必ず〜する・しなければならない）」という意志・義務とは異なります。"
  },
  "байхаа": {
    target: "байхаа",
    targetMeaning: "〜だろうな・〜のはず",
    similar: [
      { word: "байна", meaning: "〜です・あります（現在断定）" },
      { word: "байх", meaning: "ある・いる（辞書形）" }
    ],
    distinction: "「байна」が「あります・〜です」と断定するのに対し、「байхаа」は文末に付いて「〜だろうな・〜のはずだ」と推測・柔らかい推量を表します。"
  },

  // 2. 視覚・移動・動作
  "харах": {
    target: "харах",
    targetMeaning: "見る・視線を向ける",
    similar: [
      { word: "харих", meaning: "家に帰る", note: "⚠️ 母音違い (а と и)" },
      { word: "үзэх", meaning: "観る・試す・受ける" }
    ],
    distinction: "【超頻出！混同注意】\n・харах (語幹 хар-): 母音「а」＝ 目で「見る・眺める」。\n・харих (語幹 харь-): 母音「и」＝ 自分の家や故郷へ「帰る」。\n・үзэх: 映画や劇を「鑑賞する」、服や料理を「試す」、試験を「受ける」。"
  },
  "харих": {
    target: "харих",
    targetMeaning: "帰る・帰宅する",
    similar: [
      { word: "харах", meaning: "見る", note: "⚠️ 母音違い (и と а)" },
      { word: "буцах", meaning: "引き返す・戻る" },
      { word: "явах", meaning: "行く・去る" }
    ],
    distinction: "「харих」は自宅（гэр）や故郷・祖国へ「帰宅する」こと。「буцах」は一度進んだ道から「引き返す・元の地点へ戻る」こと、「харах（見る）」とは母音「и/а」の違いです。"
  },
  "буцах": {
    target: "буцах",
    targetMeaning: "戻る・引き返す",
    similar: [
      { word: "харих", meaning: "（自宅へ）帰る" },
      { word: "буцахгүй", meaning: "引き返さない" }
    ],
    distinction: "「буцах」は方向を反転させて元の場所へ「戻る・Uターンする」動作。「харих」は自宅へ「帰る」動作。"
  },
  "үзэх": {
    target: "үзэх",
    targetMeaning: "見る・試す・受ける",
    similar: [
      { word: "харах", meaning: "視線を向ける・見る" },
      { word: "оролдох", meaning: "いじる・試みる" }
    ],
    distinction: "「үзэх」は単に視界に入る（харах）だけでなく、映画を「観る」、動詞接続「-ээд үзэх」で「〜してみる（試す）」、試験を「受ける」など能動的な体験を表します。"
  },
  "хийх": {
    target: "хийх",
    targetMeaning: "する・作る・行う",
    similar: [
      { word: "үйлдэх", meaning: "（犯罪や行為を）行う・犯す" },
      { word: "бүтээх", meaning: "創作する・成し遂げる" },
      { word: "бэлдэх", meaning: "準備する・用意する" }
    ],
    distinction: "「хийх」は宿題をする、料理を作るなど日常のあらゆる「する・作る」を網羅する最重要基本動詞。一方「үйлдэх」は犯罪（гэмт хэрэг үйлдэх）など特別な行為に使われます。"
  },
  "сурах": {
    target: "сурах",
    targetMeaning: "学ぶ・習う",
    similar: [
      { word: "суух", meaning: "座る・住む", note: "⚠️ р の有無" },
      { word: "унших", meaning: "読む" },
      { word: "судлах", meaning: "研究する・深く調査する" }
    ],
    distinction: "【文字・意味の区別】\n・сурах (語幹 сур-): 「р」あり ＝ 知識やスキルを「学ぶ・習う」。\n・суух (語幹 суу-): 「р」なし ＝ 椅子に「座る」、街に「住む」。\n・судлах: 大学や専門機関で学術的に「研究・専攻する」。"
  },
  "суух": {
    target: "суух",
    targetMeaning: "座る・住む",
    similar: [
      { word: "сурах", meaning: "学ぶ", note: "⚠️ р の有無" },
      { word: "амьдрах", meaning: "生活する・暮らす" },
      { word: "зогсох", meaning: "立つ・止まる" }
    ],
    distinction: "「суух」は椅子の着席姿勢、または都市に「住む（хотод суух）」。人生を営む「暮らす・生きる」は「амьдрах」を使います。"
  },
  "авах": {
    target: "авах",
    targetMeaning: "取る・買う・もらう",
    similar: [
      { word: "явах", meaning: "行く", note: "⚠️ 頭文字 а と я" },
      { word: "өгөх", meaning: "あげる・与える（対義語）" }
    ],
    distinction: "【字形と方向の区別】\n・авах: 頭文字「а」＝ 自分の手元へ引き入れる「取る・もらう・買う」。\n・явах: 頭文字「я」＝ 自分が前進して立ち去る「行く」。\n・өгөх: 相手へ手渡す「あげる」。"
  },
  "явах": {
    target: "явах",
    targetMeaning: "行く・去る",
    similar: [
      { word: "авах", meaning: "取る・買う", note: "⚠️ 頭文字 я と а" },
      { word: "очих", meaning: "出向く・行く（相手の元へ）" },
      { word: "ирэх", meaning: "来る" }
    ],
    distinction: "【移動の使い分け】\n・явах: 出発して進む「行く」（進行方向に焦点）。\n・очих: 相手のいる場所や特定の目的地へ「出向く・到着する」（到達点に焦点）。\n・ирэх: 話し手側の現在地へ「やって来る」。"
  },
  "очих": {
    target: "очих",
    targetMeaning: "行く・出向く（相手や目的地へ）",
    similar: [
      { word: "явах", meaning: "行く（出発）" },
      { word: "ирэх", meaning: "来る" }
    ],
    distinction: "「〜さんの家へ行く（хүний гэрт очих）」のように、相手のいる所へ向かう時は「явах」よりも「очих」が自然です。"
  },
  "ирэх": {
    target: "ирэх",
    targetMeaning: "来る・やって来る",
    similar: [
      { word: "явах", meaning: "行く" },
      { word: "очих", meaning: "出向く" }
    ],
    distinction: "話し手がいる方向へ向かって近づいてくる動作を表します（例: Манайд ирээрэй / うちに遊びにおいでよ）。"
  },

  // 3. 身体・自然・物質（超重要！同音・近音ペア）
  "ус": {
    target: "ус",
    targetMeaning: "水",
    similar: [
      { word: "үс", meaning: "髪の毛", note: "⚠️ 男性母音 у vs 女性母音 ү" },
      { word: "цус", meaning: "血", note: "⚠️ 頭文字 ц" },
      { word: "цас", meaning: "雪", note: "⚠️ 母音 а" }
    ],
    distinction: "【超重要！母音と文字の区別】\n・ус: 男性母音「у」（口を奥に引いて丸めるウ）＝ 水。\n・үс: 女性母音「ү」（唇を前へ突き出すウ・横棒あり）＝ 髪の毛。\n・цус: 頭に「ц」が付くと「血（血液）」。\n・цас: 母音「а」は「雪」。"
  },
  "үс": {
    target: "үс",
    targetMeaning: "髪の毛・体毛",
    similar: [
      { word: "ус", meaning: "水", note: "⚠️ 女性母音 ү vs 男性母音 у" },
      { word: "ноос", meaning: "羊毛・ウール" }
    ],
    distinction: "女性母音「ү」で「髪の毛」。「ус（水）」との母音記号の違いに注意。なお羊などから刈り取った原毛・ウール製品は「ноос」と言います。"
  },
  "цус": {
    target: "цус",
    targetMeaning: "血・血液",
    similar: [
      { word: "ус", meaning: "水" },
      { word: "цас", meaning: "雪" }
    ],
    distinction: "「ус（水）」の前に子音「ц」が付くと「цус（血）」になります。母音が「а」になると「цас（雪）」です。"
  },
  "цас": {
    target: "цас",
    targetMeaning: "雪",
    similar: [
      { word: "цус", meaning: "血" },
      { word: "бороо", meaning: "雨" },
      { word: "мөндөр", meaning: "雹（ひょう）" }
    ],
    distinction: "「цас」は降雪・積雪。「бороо」は液体の雨、「мөндөр」は氷の粒（雹・あられ）。"
  },
  "гар": {
    target: "гар",
    targetMeaning: "手・腕",
    similar: [
      { word: "гарах", meaning: "出る・登る", note: "⚠️ 名詞 vs 動詞" },
      { word: "хөл", meaning: "足・脚" },
      { word: "хуруу", meaning: "指" }
    ],
    distinction: "「гар」は手・腕全体（名詞）。動詞語尾「-х」が付いた「гарах」は部屋や外へ「出る」動作。脚・足は「хөл」、手足の指は「хуруу」です。"
  },
  "гарах": {
    target: "гарах",
    targetMeaning: "出る・登る・出発する",
    similar: [
      { word: "гар", meaning: "手・腕（名詞）" },
      { word: "орох", meaning: "入る・降る（対義語）" }
    ],
    distinction: "「гарах」は内から外へ「出る」。対義語は外から中へ「入る（орох）」。名詞「гар（手）」と語幹が同じです。"
  },
  "хөл": {
    target: "хөл",
    targetMeaning: "足・脚",
    similar: [
      { word: "гар", meaning: "手・腕" },
      { word: "хөлс", meaning: "汗・賃金" }
    ],
    distinction: "「хөл」は下半身の足・脚。「хөлс」と末尾に「с」が付くと「汗」または「報酬・家賃」になります。"
  },
  "толгой": {
    target: "толгой",
    targetMeaning: "頭・頭部",
    similar: [
      { word: "тоглоом", meaning: "おもちゃ・ゲーム" },
      { word: "тоглох", meaning: "遊ぶ" },
      { word: "нүүр", meaning: "顔" }
    ],
    distinction: "頭の部位は「толгой」。似た音の「тоглоом（おもちゃ・遊び）」「тоглох（遊ぶ）」は語根 `тогло-` からの派生語で全く別の単語です。"
  },
  "сар": {
    target: "сар",
    targetMeaning: "月・カレンダーの月",
    similar: [
      { word: "шар", meaning: "黄色", note: "⚠️ с と ш" },
      { word: "цар", meaning: "大皿・トレイ" }
    ],
    distinction: "「сар」は清音サ行で「月（夜空の月 / カレンダーの1ヶ月）」。「шар」はシャ行で「黄色」または「二日酔い」を表します。"
  },

  // 4. 美しさ・評価・程度
  "сайхан": {
    target: "сайхан",
    targetMeaning: "美しい・素晴らしい・心地よい",
    similar: [
      { word: "гоё", meaning: "綺麗・おしゃれ・華やか" },
      { word: "хөөрхөн", meaning: "可愛い・愛らしい" },
      { word: "сайн", meaning: "良い（good）" }
    ],
    distinction: "【美しさの使い分け】\n・сайхан: 内面の優しさや大草原・気候・自然など「穏やかで雄大な心地よい美しさ」（例: сайхан сэтгэл / 優しい心、сайхан өдөр / 良い一日）。\n・гоё: 服装・髪型・装飾品・デザインが「おしゃれで素敵」（例: гоё дээл / 素敵な民族衣装）。\n・хөөрхөн: 赤ちゃんや小動物など「愛くるしくて可愛い」（例: хөөрхөн хүүхэд / かわいい子ども）。"
  },
  "гоё": {
    target: "гоё",
    targetMeaning: "綺麗・おしゃれ・スタイリッシュ",
    similar: [
      { word: "сайхан", meaning: "心地よい美しさ" },
      { word: "хөөрхөн", meaning: "可愛い" },
      { word: "цэвэрхэн", meaning: "清潔な・綺麗な" }
    ],
    distinction: "「гоё」は視覚的なファッショナブルさ・洗練されたおしゃれさ。「цэвэрхэн」は掃除が行き届いてチリ一つない「清潔さ」を表します。"
  },
  "хөөрхөн": {
    target: "хөөрхөн",
    targetMeaning: "可愛い・愛らしい",
    similar: [
      { word: "сайхан", meaning: "美しい" },
      { word: "гоё", meaning: "おしゃれ" }
    ],
    distinction: "「хөөрхөн」はサイズが小さく、愛嬌がある子犬や子ども、小物に対して使います（大人の内面の美しさには сайхан を使います）。"
  },
  "их": {
    target: "их",
    targetMeaning: "多い・大きい（量・程度）",
    similar: [
      { word: "олон", meaning: "数が多い（個数・人数）" },
      { word: "маш", meaning: "とても・非常に" },
      { word: "том", meaning: "サイズ・寸法が大きい" }
    ],
    distinction: "【多い・大きいの使い分け】\n・их: 数えられない量や程度が大きい（例: их ажил / 多忙、их баярлалаа / 大変ありがとう）。\n・олон: 数えられる個数・人数が多い（例: олон хүн / たくさんの人、олон ном / 多くの本）。\n・том: 物理的な外形や寸法が大きい（例: том байшин / 大きな家）。\n・маш: 形容詞を修飾する強調副詞（例: маш сайн / とても良い）。"
  },
  "олон": {
    target: "олон",
    targetMeaning: "数が多い・たくさんの",
    similar: [
      { word: "их", meaning: "量・程度が多い" },
      { word: "цөөхөн", meaning: "数が少ない（対義語）" }
    ],
    distinction: "可算名詞（人・動物・本・車など）の個数が多い時は必ず「олон」を使います（× их хүн ではなく ◯ олон хүн）。"
  },
  "бага": {
    target: "бага",
    targetMeaning: "少ない・小さい・年少の",
    similar: [
      { word: "жижиг", meaning: "寸法が小さい" },
      { word: "цөөхөн", meaning: "数が少ない" },
      { word: "залуу", meaning: "若い" }
    ],
    distinction: "「бага」は量・程度が少ない、または年齢が「幼い・年少」（例: бага нас / 幼少期）。物理的なサイズが小さいのは「жижиг」、個数が少ないのは「цөөхөн」です。"
  },
  "жижиг": {
    target: "жижиг",
    targetMeaning: "小さい（物理的なサイズ）",
    similar: [
      { word: "бага", meaning: "少ない・幼い" },
      { word: "том", meaning: "大きい（対義語）" }
    ],
    distinction: "目に見える物や生き物の外形・寸法が「小型・小さい」時に使います（例: жижиг нохой / 小型犬、жижиг өрөө / 小さい部屋）。"
  },
  "цөөхөн": {
    target: "цөөхөн",
    targetMeaning: "数が少ない",
    similar: [
      { word: "олон", meaning: "数が多い（対義語）" },
      { word: "бага", meaning: "量が少ない" }
    ],
    distinction: "数えられる人や物の数が「ごくわずか・少数」である時に使います（例: цөөхөн хүн / 少人数）。"
  },
  "дажгүй": {
    target: "дажгүй",
    targetMeaning: "まぁまぁ・悪くない",
    similar: [
      { word: "гайхалтай", meaning: "素晴らしい・驚異的" },
      { word: "мундаг", meaning: "優秀・すごい" },
      { word: "сайн", meaning: "良い" }
    ],
    distinction: "「дажгүй」は「悪くはないよ、及第点だね（Not bad / So-so）」という控えめな肯定表現。「гайхалтай（驚くほど素晴らしい）」や「мундаг（優秀だ）」とはテンションが異なります。"
  },
  "гайхалтай": {
    target: "гайхалтай",
    targetMeaning: "素晴らしい・驚異的な",
    similar: [
      { word: "дажгүй", meaning: "まぁまぁ" },
      { word: "мундаг", meaning: "優秀・すごい" }
    ],
    distinction: "動詞 `гайхах`（驚く）から派生した言葉で、人をアッと言わせるような「目を見張る素晴らしさ（Wonderful / Amazing）」を表します。"
  },
  "мундаг": {
    target: "мундаг",
    targetMeaning: "優秀な・すごい・腕利き",
    similar: [
      { word: "гайхалтай", meaning: "素晴らしい" },
      { word: "сайн", meaning: "良い" }
    ],
    distinction: "人の能力、学力、技術、仕事ぶりが「抜群に優秀で頼もしい（Awesome / Skilled）」時に人を褒める表現です。"
  },
  "үнэн": {
    target: "үнэн",
    targetMeaning: "真実・本当",
    similar: [
      { word: "зөв", meaning: "正しい・適切" },
      { word: "ёстой", meaning: "当然・〜すべき" }
    ],
    distinction: "「үнэн」は嘘偽りのない「事実・真実」。「зөв」は計算や規則、道理に狂いがない「正解・正しい（対義語: буруу / 間違い）」です。"
  },
  "зөв": {
    target: "зөв",
    targetMeaning: "正しい・右",
    similar: [
      { word: "үнэн", meaning: "本当・真実" },
      { word: "буруу", meaning: "間違い・不正解（対義語）" }
    ],
    distinction: "正誤判定の「正解・合っている」、および方位の「右（зөв гар = 右手）」を表します。"
  },

  // 5. 社会・法・教育・文化
  "гэмт хэрэг": {
    target: "гэмт хэрэг",
    targetMeaning: "犯罪",
    similar: [
      { word: "гэмт хэрэг судлал", meaning: "犯罪学" },
      { word: "гэмт хэрэгтэн", meaning: "犯罪者" },
      { word: "зөрчил", meaning: "違反・軽微な過失" }
    ],
    distinction: "「гэмт хэрэг」は刑事罰の対象となる重い犯罪行為そのもの。「гэмт хэрэг судлал」はその原因や対策を研究する大学の学問。「зөрчил」は交通違反などのルール違反です。"
  },
  "гэмт хэрэг судлал": {
    target: "гэмт хэрэг судлал",
    targetMeaning: "犯罪学（学問分野）",
    similar: [
      { word: "гэмт хэрэг", meaning: "犯罪そのもの" },
      { word: "хууль зүй", meaning: "法学" }
    ],
    distinction: "犯罪現象や犯罪者を研究する学問体系（大学の専攻など）。以前外来語で使われた「криминологи」の純正モンゴル語表記です。"
  },
  "хууль": {
    target: "хууль",
    targetMeaning: "法律",
    similar: [
      { word: "дүрэм", meaning: "規則・ルール" },
      { word: "журам", meaning: "規約・手順・マナー" }
    ],
    distinction: "【法のピラミッド】\n・хууль: 国会で制定される法的強制力のある最高規範「法律」。\n・дүрэм: 文法規則、交通規則、スポーツの「ルール・規則」。\n・журам: 組織や施設内の具体的な「行動指針・手順・手続き」。"
  },
  "дүрэм": {
    target: "дүрэм",
    targetMeaning: "規則・ルール",
    similar: [
      { word: "хууль", meaning: "法律" },
      { word: "журам", meaning: "規約・手順" }
    ],
    distinction: "「дүрэм」は文法のルール（хэл зүйн дүрэм）や交通ルール（замын хөдөлгөөний дүрэм）など、守るべき約束事を指します。"
  },
  "эрх чөлөө": {
    target: "эрх чөлөө",
    targetMeaning: "自由（基本的人権）",
    similar: [
      { word: "эрх", meaning: "権利・権力" },
      { word: "чөлөө", meaning: "暇・自由な時間・休暇" }
    ],
    distinction: "「эрх（権利）」と「чөлөө（拘束のない空き）」が合わさった近代用語で、市民的・政治的「自由（Freedom / Liberty）」を表します。"
  },
  "эрх": {
    target: "эрх",
    targetMeaning: "権利・権限",
    similar: [
      { word: "эрх чөлөө", meaning: "自由" },
      { word: "үүрэг", meaning: "義務（対義語）" }
    ],
    distinction: "法的に保障された正当な「権利」。対義語は果たすべき「義務（үүрэг）」です。"
  },
  "чөлөө": {
    target: "чөлөө",
    targetMeaning: "暇・余暇・休暇・自由時間",
    similar: [
      { word: "эрх чөлөө", meaning: "自由権" },
      { word: "зав", meaning: "暇・都合" }
    ],
    distinction: "「Би чөлөө авлаа（休暇を取りました）」や「Чөлөөт цаг（自由時間）」のように、スケジュール上の空き時間・休みを指します。"
  },
  "сургууль": {
    target: "сургууль",
    targetMeaning: "学校",
    similar: [
      { word: "багш", meaning: "教師・先生" },
      { word: "сурагч", meaning: "児童・生徒（小中高）" },
      { word: "оюутан", meaning: "大学生・大学院生" }
    ],
    distinction: "学校で学ぶ人の呼び分け: 小・中・高校生は「сурагч」、大学・高等教育機関の学生は「оюутан」、教える人は「багш」です。"
  },
  "багш": {
    target: "багш",
    targetMeaning: "教師・先生",
    similar: [
      { word: "сурагч", meaning: "生徒" },
      { word: "оюутан", meaning: "大学生" }
    ],
    distinction: "学校の教師だけでなく、師匠・指導者全般に対する尊称としても用いられます。"
  },
  "сурагч": {
    target: "сурагч",
    targetMeaning: "生徒・児童（小・中・高校）",
    similar: [
      { word: "оюутан", meaning: "大学生" },
      { word: "багш", meaning: "先生" }
    ],
    distinction: "初等・中等教育（小中高）で学ぶ生徒のこと。大学に進学すると「оюутан（直訳: 知恵を持つ者）」と呼ばれます。"
  },
  "оюутан": {
    target: "оюутан",
    targetMeaning: "大学生・高等教育の学徒",
    similar: [
      { word: "сурагч", meaning: "小中高の生徒" }
    ],
    distinction: "大学（их сургууль）や専門学校に在籍する高等学生を指します。"
  },
  "толь бичиг": {
    target: "толь бичиг",
    targetMeaning: "辞書・辞典",
    similar: [
      { word: "толь", meaning: "鏡" },
      { word: "ном", meaning: "本" }
    ],
    distinction: "「толь（鏡）」＋「бичиг（文字・文書）」＝ 言葉を映し出す鏡 ＝「辞書」。"
  },
  "толь": {
    target: "толь",
    targetMeaning: "鏡",
    similar: [
      { word: "толь бичиг", meaning: "辞書" }
    ],
    distinction: "身だしなみをチェックして自分の姿を映す「鏡」のこと。"
  },

  // 6. 時・暦・代名詞・疑問詞
  "маргааш": {
    target: "маргааш",
    targetMeaning: "明日",
    similar: [
      { word: "өнөөдөр", meaning: "今日" },
      { word: "өчигдөр", meaning: "昨日" },
      { word: "нөгөөдөр", meaning: "明後日" },
      { word: "мартсан", meaning: "忘れた", note: "⚠️ 音の類似 (марг- vs март-)" }
    ],
    distinction: "【日付の時系列】\nуржигдар（一昨日）→ өчигдөр（昨日）→ өнөөдөр（今日）→ маргааш（明日）→ нөгөөдөр（明後日）。"
  },
  "өчигдөр": {
    target: "өчигдөр",
    targetMeaning: "昨日",
    similar: [
      { word: "өнөөдөр", meaning: "今日" },
      { word: "маргааш", meaning: "明日" },
      { word: "уржигдар", meaning: "一昨日" }
    ],
    distinction: "今日（өнөөдөр）の1日前（昨日）。2日前は「уржигдар（一昨日）」です。"
  },
  "өнөөдөр": {
    target: "өнөөдөр",
    targetMeaning: "今日",
    similar: [
      { word: "өнөө", meaning: "今の・この" },
      { word: "маргааш", meaning: "明日" }
    ],
    distinction: "「өнөө（今）」＋「өдөр（日）」が結合して定着した言葉です。"
  },
  "өглөө": {
    target: "өглөө",
    targetMeaning: "朝",
    similar: [
      { word: "өдөр", meaning: "昼・日" },
      { word: "орой", meaning: "夕方・夜" },
      { word: "шөнө", meaning: "真夜中" }
    ],
    distinction: "【1日の時間帯】\nөглөө（朝: 夜明け〜11時頃）→ өдөр（昼: 正午〜夕方）→ орой（夕方・夜: 日暮れ〜21時頃）→ шөнө（深夜: 就寝中）。"
  },
  "орой": {
    target: "орой",
    targetMeaning: "夕方・夜・頂上",
    similar: [
      { word: "өглөө", meaning: "朝" },
      { word: "өдөр", meaning: "昼" },
      { word: "шөнө", meaning: "真夜中" }
    ],
    distinction: "夕暮れから夜の活動時間帯を指します。挨拶は「Оройн мэнд（こんばんは）」。"
  },
  "шөнө": {
    target: "шөнө",
    targetMeaning: "真夜中・夜間",
    similar: [
      { word: "орой", meaning: "夕方・夜" }
    ],
    distinction: "辺りが完全に暗くなり就寝する時間帯。「Сайхан амраарай（おやすみなさい）」とセットで使われます。"
  },
  "энэ": {
    target: "энэ",
    targetMeaning: "これ・この人（近称）",
    similar: [
      { word: "тэр", meaning: "あれ・その人（遠称）" },
      { word: "эд", meaning: "これら（近称複数）" },
      { word: "тэд", meaning: "あれら・彼ら（遠称複数）" }
    ],
    distinction: "【指示代名詞の整理】\n・энэ: 手元にある単数（これ・この人）。複数形は「эд（これら）」。\n・тэр: 離れた場所にある単数（あれ・その人・彼）。複数形は「тэд（彼ら・あれら）」。"
  },
  "тэр": {
    target: "тэр",
    targetMeaning: "あれ・その人・彼（遠称）",
    similar: [
      { word: "энэ", meaning: "これ（近称）" },
      { word: "тэд", meaning: "彼ら（複数）" }
    ],
    distinction: "話し手から離れた人や物を指します。三人称代名詞「彼・彼女」としても機能します。"
  },
  "аль": {
    target: "аль",
    targetMeaning: "どちら・どれ（選択）",
    similar: [
      { word: "юу", meaning: "何" },
      { word: "хэн", meaning: "誰" },
      { word: "ямар", meaning: "どんな" }
    ],
    distinction: "限られた複数の候補から「どちら・どれ」と選択する疑問詞（例: Аль нь дээр вэ? / どっちが良い？）。範囲限定のない「何」は「юу」です。"
  },
  "юу": {
    target: "юу",
    targetMeaning: "何（事物）",
    similar: [
      { word: "аль", meaning: "どちら・どれ" },
      { word: "хэн", meaning: "誰（人物）" }
    ],
    distinction: "事物の名前や内容を尋ねる最も基本的な疑問詞（例: Энэ юу вэ? / これは何ですか？）。"
  },

  // 7. 気候・衣服・生活
  "халуун": {
    target: "халуун",
    targetMeaning: "熱い・暑い",
    similar: [
      { word: "дулаан", meaning: "暖かい（ポカポカ）" },
      { word: "хүйтэн", meaning: "冷たい・寒い" },
      { word: "сэрүүн", meaning: "涼しい" }
    ],
    distinction: "【温度の使い分け】\n・халуун: 猛暑や熱湯など激しい「熱さ・暑さ」（例: халуун цай / 熱いお茶）。\n・дулаан: 春先や室内などの心地よい「温かさ・温暖」。\n・хүйтэн: 冬の極寒や氷水などの「冷たさ・厳寒」。\n・сэрүүн: 秋風などの爽やかで心地よい「涼しさ」。"
  },
  "дулаан": {
    target: "дулаан",
    targetMeaning: "暖かい・温暖な",
    similar: [
      { word: "халуун", meaning: "熱い・暑い" },
      { word: "хүйтэн", meaning: "寒い" }
    ],
    distinction: "過剰な暑さではなく、快適で過ごしやすいポカポカした温もりを表します（例: дулаан өдөр / 暖かい日）。"
  },
  "хүйтэн": {
    target: "хүйтэн",
    targetMeaning: "冷たい・寒い",
    similar: [
      { word: "сэрүүн", meaning: "涼しい" },
      { word: "халуун", meaning: "熱い（対義語）" }
    ],
    distinction: "モンゴルの冬のマイナス数十度や、冷たい水・氷などの厳しい冷たさを指します。"
  },
  "сэрүүн": {
    target: "сэрүүн",
    targetMeaning: "涼しい・爽やかな",
    similar: [
      { word: "хүйтэн", meaning: "寒い・冷たい" },
      { word: "дулаан", meaning: "暖かい" }
    ],
    distinction: "夏の高原や秋の入り口の心地よい涼しさを表します。"
  },
  "цамц": {
    target: "цамц",
    targetMeaning: "シャツ・ワイシャツ",
    similar: [
      { word: "хүрэм", meaning: "ジャケット・上着" },
      { word: "дээл", meaning: "民族衣装デール" },
      { word: "пальто", meaning: "オーバーコート" }
    ],
    distinction: "「цамц」は肌着の上に直接着るシャツやブラウス。その上に羽織るジャケットは「хүрэм」、伝統衣装は「дээл」です。"
  },
  "хүрэм": {
    target: "хүрэм",
    targetMeaning: "ジャケット・上着・ジャンパー",
    similar: [
      { word: "цамц", meaning: "シャツ" },
      { word: "дээл", meaning: "デール" }
    ],
    distinction: "シャツの上に羽織る防寒用・外出用の上着。以前の外来語「куртка」に代わる純正モンゴル語です。"
  },
  "шинэ": {
    target: "шинэ",
    targetMeaning: "新しい",
    similar: [
      { word: "хуучин", meaning: "古い（物）" },
      { word: "хөгшин", meaning: "年老いた（人・動物）" }
    ],
    distinction: "【「古い」の明確な区別】\n物が古い場合は「хуучин」、人や動物が高齢な場合は「хөгшин」を使い分けます（英語の old car vs old man の違い）。"
  },
  "хуучин": {
    target: "хуучин",
    targetMeaning: "古い（物・中古）",
    similar: [
      { word: "хөгшин", meaning: "老いた（人・動物）" },
      { word: "шинэ", meaning: "新しい（対義語）" }
    ],
    distinction: "建物、車、服、家具など「物」が使い古されている時に使います（人に対して使ってはいけません）。"
  },
  "хөгшин": {
    target: "хөгшин",
    targetMeaning: "年老いた・高齢の（人・動物）",
    similar: [
      { word: "хуучин", meaning: "古い（物）" },
      { word: "залуу", meaning: "若い（対義語）" }
    ],
    distinction: "祖父母や高齢者、年老いた馬や犬など「生き物」に対して使います（物に対して使ってはいけません）。"
  },
  "хурдан": {
    target: "хурдан",
    targetMeaning: "速い（スピード・足）",
    similar: [
      { word: "түргэн", meaning: "敏速な・急ぎの" },
      { word: "удаан", meaning: "遅い（対義語）" }
    ],
    distinction: "「хурдан」は移動速度やスピードが物理的に速いこと（例: хурдан морь / 駿馬）。「түргэн」は対処・行動・処置がすばやいこと（例: түргэн тусламж / 救急車）。"
  },
  "удаан": {
    target: "удаан",
    targetMeaning: "遅い・時間がかかる",
    similar: [
      { word: "хурдан", meaning: "速い（対義語）" }
    ],
    distinction: "歩行速度が遅い、または完了までに長い時間がかかる状態を表します。"
  },
  "хоол": {
    target: "хоол",
    targetMeaning: "料理・食事・ご飯",
    similar: [
      { word: "хүнс", meaning: "食材・食料品" },
      { word: "унд", meaning: "飲み物・お茶" }
    ],
    distinction: "「хоол」は調理済みの完成した料理・食事。「хүнс」はスーパーなどで購入する調理前の原材料（肉、野菜、小麦粉など）です。"
  },
  "хүнс": {
    target: "хүнс",
    targetMeaning: "食料品・食材",
    similar: [
      { word: "хоол", meaning: "調理済みの料理" }
    ],
    distinction: "調理前の食料原料。スーパーの食料品売り場は「Хүнсний тасаг」と言います。"
  },
  "ёстой": {
    target: "ёстой",
    targetMeaning: "〜すべき・当然だ",
    similar: [
      { word: "хэрэгтэй", meaning: "必要だ（Need）" },
      { word: "боломжтой", meaning: "可能だ（Can）" },
      { word: "болохгүй", meaning: "してはいけない（Must not）" }
    ],
    distinction: "【助動詞的表現の使い分け】\n・ёстой: 道理・義務として当然「〜すべきだ（Must / Should）」。\n・хэрэгтэй: 目的達成のために「〜する必要がある（Need to）」。\n・боломжтой: 状況が許して「〜することが可能だ（Possible）」。\n・болохгүй: 禁止事項「〜してはならない（Must not）」。"
  },
  "хэрэгтэй": {
    target: "хэрэгтэй",
    targetMeaning: "必要だ・〜する必要がある",
    similar: [
      { word: "ёстой", meaning: "〜すべきだ（義務）" },
      { word: "хэрэггүй", meaning: "不要だ（対義語）" }
    ],
    distinction: "「物」が必要な時（Надад ус хэрэгтэй / 水が必要です）や、動作が必要な時（Би сурах хэрэгтэй / 勉強する必要がある）に使います。"
  },
  "тоохгүй": {
    target: "тоохгүй",
    targetMeaning: "気にしない・意に介さない",
    similar: [
      { word: "тоох", meaning: "気にする・相手にする" },
      { word: "хамаагүй", meaning: "関係ない・構わない" }
    ],
    distinction: "動詞 `тоох`（気にかける）の否定形。他人の悪口やトラブルに対して「気に留めない、へっちゃらだ」とスルーする前向きな心持ちを表します。"
  },
  "зүгээр": {
    target: "зүгээр",
    targetMeaning: "大丈夫・普通の・ただ",
    similar: [
      { word: "зүгээр л", meaning: "ただ〜なだけ" },
      { word: "сайн", meaning: "良い" }
    ],
    distinction: "「Зүгээр ээ（大丈夫ですよ・どういたしまして）」と相手を安心させる返答、または「普通の・無事な」状態を表します。"
  },
  "зүгээр л": {
    target: "зүгээр л",
    targetMeaning: "ただ〜なだけ・単に",
    similar: [
      { word: "зүгээр", meaning: "大丈夫・普通の" },
      { word: "зөвхөн", meaning: "ただ〜のみ（限定）" }
    ],
    distinction: "強調助詞「л」が付いて「他意はなく、ただ〜しているだけ（Just）」というニュアンスになります（例: Би зүгээр л асуусан / ただ聞いてみただけです）。"
  },
  "хичээх": {
    target: "хичээх",
    targetMeaning: "努力する・頑張る",
    similar: [
      { word: "хичээл", meaning: "授業・レッスン" },
      { word: "оролдох", meaning: "試みる・いじる" }
    ],
    distinction: "「хичээх」は一生懸命努力する動詞（決意: Хичээнэ! / 頑張ります！）。名詞「хичээл」は学校の「授業・課」を表します。"
  }
};

/**
 * 似ている単語・使い分け解説HTML生成関数
 * @param {Object|string} item 単語オブジェクトまたはキリル文字列
 * @param {string} targetWord 対象の見出し語
 * @param {Object} options オプション
 * @returns {string} HTML文字列
 */
export function getSimilarWordDistinctionHTML(item, targetWord, options = {}) {
  let rawWord = ((item && (item.dictForm || item.mongolian || item.baseWord)) || targetWord || '').trim();
  if (!rawWord && typeof item === 'string') rawWord = item.trim();
  if (!rawWord) return '';

  const cleanWord = rawWord.toLowerCase().replace(/[\(\)\（\）\s.,!?-]/g, '');
  const cleanRaw = rawWord.toLowerCase().replace(/[.,!?]/g, '').trim();
  const userAns = (options.userAnswer || options.user_answer || '').trim().toLowerCase().replace(/[.,!?]/g, '');

  // 1. 静的定義テーブルからのマッチング
  let data = SIMILAR_WORDS_DISTINCTIONS[cleanRaw] || SIMILAR_WORDS_DISTINCTIONS[cleanWord];

  // 不定詞語尾 -х を除いた語幹等でのフォールバック
  if (!data && cleanWord.endsWith('х')) {
    const stem = cleanWord.slice(0, -1);
    data = SIMILAR_WORDS_DISTINCTIONS[stem];
  }

  // 意味類似（類義語）データと音・綴り類似データの分離・準備
  let meaningList = [];
  let meaningDistinction = '';
  let phoneticList = [];
  let phoneticDistinction = '';

  if (data) {
    if (data.meaningSimilar && Array.isArray(data.meaningSimilar)) {
      meaningList = data.meaningSimilar;
      meaningDistinction = data.meaningDistinction || '';
    } else if (data.similar && Array.isArray(data.similar)) {
      // 従来の similar 定義の引き継ぎ
      meaningList = data.similar;
      meaningDistinction = data.distinction || '';
    }

    if (data.phoneticSimilar && Array.isArray(data.phoneticSimilar)) {
      phoneticList = data.phoneticSimilar;
      phoneticDistinction = data.phoneticDistinction || '';
    }
  }

  // 2. wordFamilyData.synonyms からの動的フォールバック（意味類似）
  if (meaningList.length === 0 && typeof wordFamilyData !== 'undefined' && wordFamilyData && Array.isArray(wordFamilyData.synonyms)) {
    const foundSynGroup = wordFamilyData.synonyms.find(group => 
      group.words && group.words.some(w => w.word && w.word.toLowerCase().trim() === cleanRaw)
    );

    if (foundSynGroup) {
      const otherWords = foundSynGroup.words.filter(w => w.word.toLowerCase().trim() !== cleanRaw);
      meaningList = otherWords.map(w => ({ word: w.word, meaning: w.meaning }));
      meaningDistinction = foundSynGroup.nuance || foundSynGroup.explanation || '';
    }
  }

  // 3. wordFamilyData.antonyms からの動的生成（対義語）
  if (meaningList.length === 0 && typeof wordFamilyData !== 'undefined' && wordFamilyData && Array.isArray(wordFamilyData.antonyms)) {
    const foundAnt = wordFamilyData.antonyms.find(ant => 
      (ant.wordA && ant.wordA.toLowerCase().trim() === cleanRaw) ||
      (ant.wordB && ant.wordB.toLowerCase().trim() === cleanRaw)
    );

    if (foundAnt) {
      const isA = (foundAnt.wordA.toLowerCase().trim() === cleanRaw);
      const oppWord = isA ? foundAnt.wordB : foundAnt.wordA;
      const oppMeaning = isA ? foundAnt.meaningB : foundAnt.meaningA;
      meaningList = [{ word: oppWord, meaning: oppMeaning, note: '対義語' }];
      meaningDistinction = `【対義語（反意語ペア）】\n「${foundAnt.wordA} (${foundAnt.meaningA})」と「${foundAnt.wordB} (${foundAnt.meaningB})」は対になる表現です。セットで覚えると記憶に定着しやすくなります。`;
    }
  }

  // 4. 音・綴り類似（1文字違い・母音違い）の自動検知（phoneticList が空の場合）
  if (phoneticList.length === 0) {
    try {
      let vocabList = [];
      if (typeof StorageService !== 'undefined' && StorageService.getVocabulary) {
        vocabList = StorageService.getVocabulary();
      }
      if (vocabList.length > 0 && cleanWord.length >= 2) {
        for (const v of vocabList) {
          const vMn = (v.dictForm || v.mongolian || '').toLowerCase().trim();
          if (vMn && vMn !== cleanWord && Math.abs(vMn.length - cleanWord.length) <= 1) {
            let diffs = 0;
            const minLen = Math.min(vMn.length, cleanWord.length);
            for (let i = 0; i < minLen; i++) {
              if (vMn[i] !== cleanWord[i]) diffs++;
            }
            if (diffs === 1 && minLen >= 2) {
              phoneticList.push({ word: v.dictForm || v.mongolian, meaning: v.japanese, note: '1文字違い' });
              phoneticDistinction = `⚠️ 綴り・発音がそっくりな「${v.dictForm || v.mongolian}（意味: ${v.japanese}）」との混同に注意してください。1文字（母音・子音）の違いで意味が大きく変わります。`;
              break;
            }
          }
        }
      }
    } catch (_) {}
  }

  // 意味類似も音類似も存在しない場合は非表示
  if (meaningList.length === 0 && phoneticList.length === 0) return '';

  const targetMeaning = (item && item.japanese) || (data && data.targetMeaning) || '';

  // ユーザーの誤答と正解の直接比較カード（意味の似た単語・使い分けを最優先表示）
  let userComparisonHTML = '';
  if (userAns && userAns !== cleanRaw && userAns !== cleanWord) {
    // ユーザー回答が meaningSimilar または phoneticSimilar に含まれているかチェック
    let matchedMeaning = meaningList.find(m => m.word && m.word.toLowerCase().trim() === userAns);
    let matchedPhonetic = phoneticList.find(p => p.word && p.word.toLowerCase().trim() === userAns);

    // 単語帳からの動的フォールバック（ユーザーの誤答と正解の意味比較）
    let userAnsMeaning = (matchedMeaning && matchedMeaning.meaning) || (matchedPhonetic && matchedPhonetic.meaning) || '';
    if (!userAnsMeaning) {
      try {
        let vocab = [];
        if (typeof StorageService !== 'undefined' && StorageService.getVocabulary) {
          vocab = StorageService.getVocabulary();
        }
        const vMatch = vocab.find(v => {
          const mn = (v.dictForm || v.mongolian || '').toLowerCase().trim();
          return mn === userAns;
        });
        if (vMatch) {
          userAnsMeaning = vMatch.japanese || vMatch.meaning || '';
        }
      } catch (_) {}
    }

    if (matchedMeaning || (userAnsMeaning && targetMeaning)) {
      userComparisonHTML = `
        <div class="p-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/60 dark:to-orange-950/50 border-2 border-amber-300 dark:border-amber-700 text-amber-950 dark:text-amber-100 text-xs space-y-2 shadow-xs">
          <div class="font-black flex items-center justify-between text-amber-900 dark:text-amber-200">
            <span class="flex items-center gap-1.5 text-xs sm:text-sm">
              <span>🎯</span>
              <span>あなたの回答「<span class="cyrillic-text font-black text-rose-600 dark:text-rose-400 underline">${userAns}</span>」と正解「<span class="cyrillic-text font-black text-emerald-700 dark:text-emerald-400">${rawWord}</span>」の使い分け</span>
            </span>
            <span class="text-[10px] px-2 py-0.5 rounded-full bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100 font-bold">意味の違い</span>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
            <div class="bg-white/90 dark:bg-slate-900/80 p-2 rounded-lg border border-amber-200 dark:border-amber-800/60">
              <span class="text-rose-600 dark:text-rose-400 font-bold">❌ あなたの回答「${userAns}」:</span>
              <div class="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">${userAnsMeaning || '期間・年齢など別のニュアンス'}</div>
            </div>
            <div class="bg-white/90 dark:bg-slate-900/80 p-2 rounded-lg border border-emerald-300 dark:border-emerald-800/60">
              <span class="text-emerald-700 dark:text-emerald-400 font-bold">⭕ 正解「${rawWord}」:</span>
              <div class="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">${targetMeaning || '西暦・年号'}</div>
            </div>
          </div>
          ${meaningDistinction ? `
            <div class="text-[11px] text-slate-800 dark:text-slate-200 leading-relaxed bg-white/60 dark:bg-slate-900/40 p-2 rounded-lg border-l-3 border-amber-500 whitespace-pre-line font-medium">
              ${meaningDistinction}
            </div>
          ` : ''}
        </div>
      `;
    } else if (matchedPhonetic) {
      userComparisonHTML = `
        <div class="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border-2 border-rose-300 dark:border-rose-800 text-rose-950 dark:text-rose-100 text-xs space-y-1">
          <div class="font-black flex items-center gap-1.5 text-rose-900 dark:text-rose-200">
            <span>⚠️</span>
            <span>あなたの回答「<strong class="cyrillic-text underline font-extrabold text-rose-800 dark:text-rose-300">${userAns}</strong>」は綴り・発音が似ている別単語です</span>
          </div>
          <p class="text-[11px] leading-relaxed opacity-95">
            「${userAns}」の意味は【${matchedPhonetic.meaning || '別単語'}】です。正解の「${rawWord}（${targetMeaning}）」とは音が似ていますが意味が全く異なります。
          </p>
        </div>
      `;
    }
  }

  // 意味類似のバッジ生成
  const meaningBadges = meaningList.map(s => `
    <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/95 dark:bg-slate-800 border border-indigo-300 dark:border-indigo-700 font-bold text-slate-800 dark:text-slate-100 text-[11px] shadow-2xs">
      <strong class="cyrillic-text text-indigo-700 dark:text-indigo-300">${s.word}</strong>
      ${s.meaning ? `<span class="text-slate-500 dark:text-slate-400 font-normal">（${s.meaning}）</span>` : ''}
      ${s.note ? `<span class="text-amber-600 dark:text-amber-400 text-[10px] font-black">${s.note}</span>` : ''}
    </span>
  `).join(' ');

  const formattedMeaningDistinction = String(meaningDistinction || '')
    .replace(/\n/g, '<br>')
    .replace(/(【[^】]+】)/g, '<strong class="text-indigo-950 dark:text-indigo-200 block mt-1 first:mt-0 font-black">$1</strong>')
    .replace(/(・[^:]+:)/g, '<span class="font-bold text-indigo-900 dark:text-indigo-100">$1</span>');

  // 音類似のバッジ生成
  const phoneticBadges = phoneticList.map(s => `
    <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/95 dark:bg-slate-800 border border-amber-300 dark:border-amber-700 font-bold text-slate-800 dark:text-slate-100 text-[11px] shadow-2xs">
      <strong class="cyrillic-text text-amber-800 dark:text-amber-300">${s.word}</strong>
      ${s.meaning ? `<span class="text-slate-500 dark:text-slate-400 font-normal">（${s.meaning}）</span>` : ''}
      ${s.note ? `<span class="text-rose-600 dark:text-rose-400 text-[10px] font-black">${s.note}</span>` : ''}
    </span>
  `).join(' ');

  const formattedPhoneticDistinction = String(phoneticDistinction || '')
    .replace(/\n/g, '<br>')
    .replace(/(【[^】]+】)/g, '<strong class="text-amber-950 dark:text-amber-200 block mt-1 first:mt-0 font-black">$1</strong>')
    .replace(/(・[^:]+:)/g, '<span class="font-bold text-amber-900 dark:text-amber-100">$1</span>');

  return `
    <div class="similar-word-card mt-2 p-3 rounded-2xl bg-sky-50/90 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 text-sky-950 dark:text-sky-100 text-xs space-y-3 shadow-2xs transition-all">
      
      <div class="flex items-center justify-between font-bold text-sky-900 dark:text-sky-200">
        <span class="flex items-center gap-1.5 text-xs font-black">
          <span class="text-base">⚖️</span>
          <span>似ている単語との違い・使い分け（意味 ＆ 音・綴り混同注意）</span>
        </span>
        <span class="text-[10px] px-2 py-0.5 rounded-full bg-sky-200/80 dark:bg-sky-900 text-sky-900 dark:text-sky-200 font-bold">
          類義語・音類似
        </span>
      </div>

      ${userComparisonHTML}

      <!-- 1. 意味が似ている単語（類義語の使い分け） -->
      ${meaningList.length > 0 ? `
        <div class="space-y-1.5 p-2.5 bg-white/95 dark:bg-slate-900/80 rounded-xl border border-sky-100 dark:border-sky-900/60 shadow-2xs">
          <div class="flex items-center justify-between">
            <span class="font-black text-indigo-950 dark:text-indigo-300 text-xs flex items-center gap-1">
              <span>💡</span>
              <span>意味が似ている単語（類義語・使い分け）:</span>
            </span>
            <span class="text-[10px] text-slate-500 font-semibold">ニュアンスの違い</span>
          </div>

          <div class="flex items-start gap-1.5 flex-wrap pt-0.5">
            <span class="text-slate-500 dark:text-slate-400 font-bold shrink-0 text-[11px] pt-0.5">🔹 比較:</span>
            <div class="flex flex-wrap gap-1.5 items-center">
              <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-400 dark:border-indigo-600 font-extrabold text-indigo-900 dark:text-indigo-100 cyrillic-text text-xs shadow-2xs">
                ${rawWord}
                ${targetMeaning ? `<span class="text-slate-500 dark:text-slate-400 font-normal text-[10px]">（${targetMeaning}）</span>` : ''}
              </span>
              <span class="text-slate-400 dark:text-slate-500 text-[11px] font-mono font-bold">vs</span>
              ${meaningBadges}
            </div>
          </div>

          <div class="text-[11px] sm:text-xs text-slate-800 dark:text-slate-200 leading-relaxed pt-1 border-t border-slate-100 dark:border-slate-800">
            ${formattedMeaningDistinction}
          </div>
        </div>
      ` : ''}

      <!-- 2. 綴り・発音が似ている単語（混同注意） -->
      ${phoneticList.length > 0 ? `
        <div class="space-y-1.5 p-2.5 bg-amber-50/70 dark:bg-amber-950/30 rounded-xl border border-amber-200/80 dark:border-amber-900/60 shadow-2xs">
          <div class="flex items-center justify-between">
            <span class="font-black text-amber-950 dark:text-amber-300 text-xs flex items-center gap-1">
              <span>⚠️</span>
              <span>綴り・発音が似ている単語（音の混同注意）:</span>
            </span>
            <span class="text-[10px] text-amber-800 dark:text-amber-400 font-semibold">1文字・母音違い</span>
          </div>

          <div class="flex items-start gap-1.5 flex-wrap pt-0.5">
            <span class="text-amber-700 dark:text-amber-400 font-bold shrink-0 text-[11px] pt-0.5">🔸 比較:</span>
            <div class="flex flex-wrap gap-1.5 items-center">
              <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-amber-400 dark:border-amber-600 font-extrabold text-amber-900 dark:text-amber-100 cyrillic-text text-xs shadow-2xs">
                ${rawWord}
              </span>
              <span class="text-amber-500 dark:text-amber-400 text-[11px] font-mono font-bold">vs</span>
              ${phoneticBadges}
            </div>
          </div>

          <div class="text-[11px] sm:text-xs text-amber-950 dark:text-amber-200 leading-relaxed pt-1 border-t border-amber-100 dark:border-amber-900/40">
            ${formattedPhoneticDistinction}
          </div>
        </div>
      ` : ''}

    </div>
  `;
}

if (typeof window !== 'undefined') {
  window.SIMILAR_WORDS_DISTINCTIONS = SIMILAR_WORDS_DISTINCTIONS;
  window.getSimilarWordDistinctionHTML = getSimilarWordDistinctionHTML;
}


export function renderChoiceExplanationsHTML(choices, options = {}) {
  if (!choices || !Array.isArray(choices) || choices.length === 0) return '';

  const expectedAnswer = (options.expectedAnswer || '').toLowerCase().trim();
  const userAnswer = (options.userAnswer || '').toLowerCase().trim();
  const title = options.title || '選択肢に出た単語の全解説を見る（タップで開閉）';

  let vocabList = [];
  try {
    if (typeof StorageService !== 'undefined' && StorageService.getVocabulary) {
      vocabList = StorageService.getVocabulary();
    }
  } catch (_) {}

  const choiceCardsHTML = choices.map((rawChoice, idx) => {
    let wordObj = null;

    if (rawChoice && typeof rawChoice === 'object') {
      if (rawChoice.word && typeof rawChoice.word === 'object') {
        wordObj = { ...rawChoice.word };
      } else if (rawChoice.id && (!rawChoice.mongolian && !rawChoice.dictForm)) {
        const found = vocabList.find(v => String(v.id) === String(rawChoice.id));
        if (found) {
          wordObj = { ...found, ...rawChoice };
        } else {
          wordObj = { ...rawChoice };
        }
      } else {
        wordObj = { ...rawChoice };
      }

      // If text property exists and mongolian or japanese is missing
      if (wordObj && wordObj.text && (!wordObj.mongolian || !wordObj.japanese)) {
        const clean = wordObj.text.toLowerCase().trim();
        const found = vocabList.find(v => 
          (v.mongolian && v.mongolian.toLowerCase().trim() === clean) ||
          (v.dictForm && v.dictForm.toLowerCase().trim() === clean) ||
          (v.japanese && v.japanese.toLowerCase().trim() === clean)
        );
        if (found) {
          wordObj = { ...found, ...wordObj };
        } else if (typeof findWordInDictionary === 'function') {
          const dictFound = findWordInDictionary(clean);
          if (dictFound) {
            wordObj = {
              mongolian: dictFound.dictForm || clean,
              dictForm: dictFound.dictForm || clean,
              japanese: dictFound.meaning,
              pos: dictFound.pos,
              pronunciation: dictFound.pron,
              derivation: dictFound.derivation,
              ...wordObj
            };
          }
        }
        if (!wordObj.mongolian && !wordObj.dictForm && !wordObj.japanese) {
          if (wordObj.isCyrillic) {
            wordObj.mongolian = wordObj.text;
          } else {
            wordObj.japanese = wordObj.text;
          }
        }
      }
    } else if (typeof rawChoice === 'string') {
      const clean = rawChoice.toLowerCase().trim();
      wordObj = vocabList.find(v => 
        (v.mongolian && v.mongolian.toLowerCase().trim() === clean) ||
        (v.dictForm && v.dictForm.toLowerCase().trim() === clean) ||
        (v.japanese && v.japanese.toLowerCase().trim() === clean)
      );
      if (!wordObj && typeof findWordInDictionary === 'function') {
        const found = findWordInDictionary(clean);
        if (found) {
          wordObj = {
            mongolian: found.dictForm || clean,
            dictForm: found.dictForm || clean,
            japanese: found.meaning,
            pos: found.pos,
            pronunciation: found.pron,
            derivation: found.derivation
          };
        }
      }
      if (!wordObj) {
        wordObj = { mongolian: rawChoice, dictForm: rawChoice, japanese: '' };
      }
    }

    if (!wordObj) return '';

    const mn = (wordObj.dictForm || wordObj.mongolian || '').trim();
    const ja = (wordObj.japanese || wordObj.meaning || wordObj.baseMeaning || '').trim();
    const mnLower = mn.toLowerCase();
    const jaLower = ja.toLowerCase();

    // 正解・不正解・ユーザー選択の判定
    let isChoiceCorrect = false;
    if (expectedAnswer) {
      isChoiceCorrect = (mnLower === expectedAnswer || jaLower === expectedAnswer || (wordObj.mongolian && wordObj.mongolian.toLowerCase() === expectedAnswer));
    }
    let isChoiceUserPicked = false;
    if (userAnswer) {
      isChoiceUserPicked = (mnLower === userAnswer || jaLower === userAnswer || (wordObj.mongolian && wordObj.mongolian.toLowerCase() === userAnswer));
    }

    const details = (typeof getWordGrammarDetails === 'function') ? getWordGrammarDetails(wordObj) : null;
    const isV = details ? details.isVerb : false;
    const pron = wordObj.pronunciation || '';
    const isCaution = typeof isPronunciationCautionWord === 'function' ? isPronunciationCautionWord(wordObj) : false;

    // 成り立ち＆語呂合わせ
    const etymologyHTML = (typeof getWordEtymologyHTML === 'function') 
      ? getWordEtymologyHTML(wordObj, wordObj.mongolian || mn) 
      : '';
    const mnemonicHTML = (typeof getWordMnemonicHTML === 'function') 
      ? getWordMnemonicHTML(wordObj, wordObj.mongolian || mn) 
      : '';
    const illustrationHTML = (typeof getWordIllustrationHTML === 'function')
      ? getWordIllustrationHTML(wordObj, { size: 'sm' })
      : '';

    return `
      <div class="p-3 rounded-xl border ${isChoiceCorrect ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800' : (isChoiceUserPicked ? 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800' : 'bg-slate-50/90 dark:bg-slate-900/80 border-slate-200 dark:border-slate-700/80')} space-y-2 transition-all">
        <div class="flex items-start justify-between gap-2 flex-wrap">
          <div class="flex items-center gap-2">
            <span class="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-black flex items-center justify-center shrink-0">
              ${idx + 1}
            </span>
            ${isChoiceCorrect ? `
              <span class="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/80 text-emerald-800 dark:text-emerald-200 font-black text-[10px] border border-emerald-300 dark:border-emerald-700 flex items-center gap-1">
                <span>⭕</span> <span>正解</span>
              </span>
            ` : `
              <span class="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold text-[10px]">
                選択肢
              </span>
            `}
            ${isChoiceUserPicked ? `
              <span class="px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/80 text-rose-800 dark:text-rose-200 font-black text-[10px] border border-rose-300 dark:border-rose-700 flex items-center gap-1">
                <span>👉</span> <span>あなたの選択</span>
              </span>
            ` : ''}
          </div>

          ${mn ? `
            <button type="button" class="btn-speak-choice-word p-1 rounded-lg bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 text-slate-500 hover:text-emerald-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer text-xs flex items-center gap-1" data-word="${wordObj.mongolian || mn}" title="発音を聴く">
              <span>🔊</span> <span class="text-[10px] font-bold">発音</span>
            </button>
          ` : ''}
        </div>

        <div class="flex items-center gap-3">
          ${illustrationHTML}
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="text-base font-black text-slate-900 dark:text-white cyrillic-text">${mn}</span>
              ${pron && isCaution ? `<span class="text-[11px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800">⚠️ [ ${pron} ]</span>` : ''}
            </div>
            <div class="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">
              ${ja}
              <span class="text-[10px] text-slate-400 dark:text-slate-400 font-normal ml-1">【${wordObj.pos || '名詞'}】</span>
            </div>
          </div>
        </div>

        ${isV ? `
          <div class="p-2 rounded-lg bg-white/90 dark:bg-slate-950/70 border border-emerald-100 dark:border-emerald-900/40 text-[11px] text-emerald-950 dark:text-emerald-200 grid grid-cols-2 gap-2">
            <div><span class="text-slate-400 dark:text-slate-400">📖 辞書形:</span> <strong class="cyrillic-text">${details.dictForm || mn}</strong></div>
            <div><span class="text-slate-400 dark:text-slate-400">🌱 語幹:</span> <strong class="cyrillic-text text-emerald-700 dark:text-emerald-400">${details.root || '-'}</strong></div>
          </div>
        ` : ''}

        ${etymologyHTML}
        ${mnemonicHTML}
        ${(typeof getSimilarWordDistinctionHTML === 'function') ? getSimilarWordDistinctionHTML(wordObj, wordObj.mongolian || mn) : ''}

        ${wordObj.exampleMn ? `
          <div class="p-2 bg-white/90 dark:bg-slate-950/80 rounded-lg border border-slate-100 dark:border-slate-800 text-[11px] space-y-0.5">
            <div class="font-bold text-slate-700 dark:text-slate-200 cyrillic-text">${wordObj.exampleMn}</div>
            <div class="text-[10px] text-slate-500 dark:text-slate-400">${wordObj.exampleJa || ''}</div>
          </div>
        ` : ''}
      </div>
    `;
  }).filter(Boolean).join('');

  if (!choiceCardsHTML) return '';

  return `
    <details class="choice-explanations-accordion group mt-2.5 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50/70 dark:bg-slate-900/60 shadow-2xs transition-all">
      <summary class="flex items-center justify-between p-2.5 sm:p-3 cursor-pointer select-none text-xs font-extrabold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
        <span class="flex items-center gap-2">
          <span class="text-base">🔍</span>
          <span class="text-slate-800 dark:text-slate-100">${title}</span>
          <span class="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">${choices.length}語解説</span>
        </span>
        <span class="text-xs text-slate-400 dark:text-slate-500 font-mono group-open:rotate-180 transition-transform duration-200">▼</span>
      </summary>

      <div class="p-3 border-t border-slate-200 dark:border-slate-700 space-y-2.5 bg-white dark:bg-slate-800/95">
        ${choiceCardsHTML}
      </div>
    </details>
  `;
}

if (typeof window !== 'undefined') {
  window.renderChoiceExplanationsHTML = renderChoiceExplanationsHTML;
}




export function renderGrammarExplanationHTML({
  correctAnswer,
  userAnswer = '',
  isCorrect = false,
  item = null,
  pronunciation = '',
  grammarExplanation = '',
  rule = '',
  isVerbQuestion = false,
  verbTargetForm = ''
}) {
  const details = item ? getWordGrammarDetails(item) : null;
  const isV = isVerbQuestion || (details ? details.isVerb : false);
  const dictForm = (details && details.dictForm) ? details.dictForm : (item ? item.baseWord || item.mongolian || item.dictForm : '');
  const root = (details && details.root) ? details.root : (item ? (item.root || '').replace(/-/g, '').trim() : '');
  let meaning = (details && details.meaning) ? details.meaning : (item ? (item.baseMeaning || item.meaning || item.japanese || item.meaning_ja || item.translation || '') : '');
  if (!meaning && typeof StorageService !== 'undefined' && StorageService.getVocabulary) {
    try {
      const vocab = StorageService.getVocabulary();
      const match = vocab.find(v => (dictForm && (v.mongolian === dictForm || v.dictForm === dictForm)) || (item && item.baseWord && (v.mongolian === item.baseWord || v.dictForm === item.baseWord)));
      if (match) {
        meaning = (match.japanese || match.baseMeaning || match.meaning || match.translation || '').trim();
      }
    } catch (_) {}
  }
  const derivation = (details && details.derivation) ? details.derivation : (item && item.derivation ? item.derivation : '');
  const pron = pronunciation || (item ? item.pronunciation : '');
  const note = item ? item.note : '';
  const altSynNote = getWordSynonymNote(item || dictForm || correctAnswer);
  const exampleMn = item ? item.exampleMn : '';
  const exampleJa = item ? item.exampleJa : '';

  // 動詞の出題形態（語幹を求めたのか、辞書形を求めたのか）の判定
  const targetForm = verbTargetForm || (item && item._verbTargetForm) || (correctAnswer && root && correctAnswer.trim().toLowerCase().replace(/-/g, '') === root.toLowerCase().replace(/-/g, '') ? 'root' : 'dict');
  const uClean = (userAnswer || '').trim().toLowerCase().replace(/[.,!?。、！？\s]/g, '').replace(/[«»"']/g, '');
  const wasDictFormEntered = isV && targetForm === 'root' && uClean && dictForm && (uClean === dictForm.toLowerCase().replace(/[.,!?。、！？\s]/g, ''));
  const wasRootEntered = isV && targetForm === 'dict' && uClean && root && (uClean === root.toLowerCase().replace(/[.,!?。、！？\s-]/g, ''));

  return `
    <div class="space-y-2.5 text-xs sm:text-sm">
      <!-- 1. 正解表示（ビジュアルイラスト付き・要件10準拠） -->
      <div class="flex items-center gap-2.5 flex-wrap">
        ${(typeof getWordIllustrationHTML === 'function') ? getWordIllustrationHTML(item || { mongolian: correctAnswer, japanese: meaning }, { size: 'md' }) : ''}
        <div>
          <div class="flex items-center flex-wrap gap-2">
            <span class="text-slate-500 dark:text-slate-400 font-medium">正解: </span>
            <span class="font-extrabold text-base sm:text-lg cyrillic-text text-emerald-800 dark:text-emerald-400 correct-answer-text">${correctAnswer}${altSynNote ? ` <span class="text-xs text-slate-500 font-normal">(${altSynNote})</span>` : ''}</span>
            ${pron && isPronunciationCautionWord(item || { mongolian: correctAnswer, pronunciation: pron }) ? `<span class="text-amber-700 bg-amber-50 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800 px-2 py-0.5 rounded-md text-xs font-bold border border-amber-200 ml-1">⚠️ 読み注意: ${pron}</span>` : ''}
          </div>
          ${meaning ? `<div class="text-[11px] text-slate-500 dark:text-slate-400 font-medium">${meaning}</div>` : ''}
        </div>
      </div>

      ${!isCorrect && userAnswer ? `
        <div class="text-rose-700 bg-rose-50/80 p-2 rounded-lg border border-rose-200">
          <div>
            <span>あなたの回答: </span>
            <span class="font-semibold line-through">${userAnswer}</span>
          </div>
          ${wasDictFormEntered ? `
            <div class="text-xs text-amber-800 font-medium mt-1">
              ⚠️「${userAnswer}」は動詞の【辞書形】です。この問題では活用の土台となる【語幹（${root}）】を回答します。
            </div>
          ` : ''}
          ${wasRootEntered ? `
            <div class="text-xs text-amber-800 font-medium mt-1">
              ⚠️「${userAnswer}」は動詞の【語幹】です。この問題では見出し語となる【辞書形（${dictForm}）】を回答します。
            </div>
          ` : ''}
        </div>
      ` : ''}

      <!-- 動詞の場合：辞書形・語幹・意味・過程の完全解説ブロック -->
      ${isV ? `
        <div class="bg-white/95 rounded-xl p-3.5 border border-emerald-200 shadow-2xs space-y-2.5 my-2">
          <div class="flex items-center justify-between border-b border-emerald-100 pb-1.5">
            <div class="flex items-center gap-2">
              ${(typeof getWordIllustrationHTML === 'function') ? getWordIllustrationHTML(item || dictForm || correctAnswer, { size: 'sm' }) : ''}
              <span class="font-bold text-emerald-900 text-xs flex items-center gap-1.5">
                <span>🌱</span> 動詞の基本形・語幹構造解説
              </span>
            </div>
            ${details && details.vowelHarmonyLabel ? `
              <span class="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-medium">
                ${details.vowelHarmonyLabel}
              </span>
            ` : ''}
          </div>

          <!-- 辞書形・語幹・意味の明確な区別カード（要件2準拠） -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div class="bg-slate-50 border border-slate-200 p-2 rounded-lg">
              <div class="text-[10px] text-slate-500 font-bold">📖 辞書形（見出し語）</div>
              <div class="font-extrabold text-slate-900 cyrillic-text text-sm mt-0.5">${dictForm}</div>
            </div>

            <div class="bg-emerald-50 border border-emerald-300 p-2 rounded-lg">
              <div class="text-[10px] text-emerald-800 font-bold">🌱 動詞の語幹</div>
              <div class="font-extrabold text-emerald-900 cyrillic-text text-sm mt-0.5">${root}</div>
            </div>

            <div class="bg-slate-50 border border-slate-200 p-2 rounded-lg">
              <div class="text-[10px] text-slate-500 font-bold">🇯🇵 日本語の意味</div>
              <div class="font-bold text-slate-800 text-sm mt-0.5">${meaning}</div>
            </div>
          </div>

          <!-- 語幹から正解の形が作られる過程 -->
          <div class="pt-1.5 border-t border-slate-100 text-xs text-slate-700 leading-relaxed space-y-1">
            <div class="font-bold text-slate-800 flex items-center gap-1">
              <span>🔍</span> 語幹から正解の形が作られる過程:
            </div>
            <div class="text-slate-700 pl-3 border-l-2 border-emerald-500 bg-emerald-50/40 p-1.5 rounded-r">
              ${derivation || `語幹「${root}」を土台にして、目的に応じた活用語尾が接続します。`}
            </div>
          </div>

          ${(grammarExplanation || rule || note) ? `
            <div class="text-xs text-slate-700 bg-amber-50/70 p-2.5 rounded-lg border border-amber-200 space-y-1">
              <div class="font-bold text-amber-900 flex items-center gap-1">
                <span>💡</span> 文法・活用ルール:
              </div>
              <div>${grammarExplanation || note || rule}</div>
            </div>
          ` : ''}
        </div>
      ` : `
        <!-- 非動詞（名詞・複合語など）の場合 -->
        <div class="bg-white/95 rounded-xl p-3 border border-slate-200 space-y-1.5 my-2 text-xs">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              ${(typeof getWordIllustrationHTML === 'function') ? getWordIllustrationHTML(item || dictForm || correctAnswer, { size: 'sm' }) : ''}
              <span class="font-bold text-slate-800">見出し語: <span class="cyrillic-text font-extrabold text-slate-900">${dictForm}</span></span>
            </div>
            <span class="text-slate-500 font-medium">【品詞: ${(details && details.pos) || (item && item.pos) || '名詞'}】</span>
          </div>
          <div>意味: <span class="font-semibold text-slate-800">${meaning}</span></div>
          
          <!-- 単語の成り立ち・構成カード（2語以上の複合語、派生語） -->
          ${(typeof getWordEtymologyHTML === 'function') ? getWordEtymologyHTML(item, correctAnswer) : (derivation ? `<div class="text-slate-600 pt-1 border-t border-slate-100">💡 ${derivation}</div>` : '')}

          ${(grammarExplanation || rule || (note && !(item && (item.etymologyBreakdown || item.derivation || '').includes(note)))) ? `
            <div class="text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 mt-2 leading-relaxed">
              <div class="font-bold text-slate-800 dark:text-slate-100 text-xs mb-1">💡 解説・ポイント:</div>
              <div>${grammarExplanation || note || rule}</div>
            </div>
          ` : ''}
        </div>
      `}

      <!-- 単語の成り立ち・構成カード（動詞・派生語で存在する場合） -->
      ${isV && (typeof getWordEtymologyHTML === 'function') ? getWordEtymologyHTML(item, correctAnswer) : ''}

      <!-- 語呂合わせ・楽しい覚え方カード（動詞・名詞問わず存在すれば必ず表示） -->
      ${(typeof getWordMnemonicHTML === 'function') ? getWordMnemonicHTML(item, correctAnswer) : ''}

      <!-- 表現の使い分け・類義語ガイド（要件6準拠） -->
      ${(typeof getSynonymExpressionsCardHTML === 'function') ? getSynonymExpressionsCardHTML(meaning || (item && item.japanese) || correctAnswer) : ''}

      <!-- 似ている単語との違い・使い分けカード（要件準拠） -->
      ${(typeof getSimilarWordDistinctionHTML === 'function') ? getSimilarWordDistinctionHTML(item, correctAnswer) : ''}

      <!-- 例文表示 -->
      ${exampleMn ? `
        <div class="pt-2 border-t border-slate-200/60">
          <div class="text-[11px] text-slate-500 font-bold">例文:</div>
          <div class="font-semibold cyrillic-text text-slate-800">${exampleMn}</div>
          <div class="text-slate-600 text-xs">${exampleJa}</div>
        </div>
      ` : ''}
    </div>
  `;
}

/**
 * シャッフル関数（Fisher-Yates）
 */
export function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * 効果音の再生（Web Audio API / 外部ファイル不要）
 */
class SoundEffectsBase {
  static playCorrect() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
      
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      
      osc.start(now);
      osc.stop(now + 0.35);
    } catch (e) {
      // AudioContextブロック時のサイレントフォールバック
    }
  }

  static playWrong() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(220, now); // A3
      osc.frequency.setValueAtTime(185, now + 0.15); // F#3
      
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      
      osc.start(now);
      osc.stop(now + 0.3);
    } catch (e) {
      // ignore
    }
  }

  static playIncorrect() {
    this.playWrong();
  }

  static playMistake() {
    this.playWrong();
  }

  static playError() {
    this.playWrong();
  }

  static playFail() {
    this.playWrong();
  }

  static playSuccess() {
    this.playCorrect();
  }

  static playCombo(combo = 1) {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      const baseFreq = 440 + Math.min(combo * 40, 600);
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.15);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.start(now);
      osc.stop(now + 0.2);
    } catch (e) {}
  }

  static playLevelUp() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      const now = ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        osc.connect(gain);
        gain.connect(ctx.destination);

        const startTime = now + (idx * 0.1);
        gain.gain.setValueAtTime(0.15, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);

        osc.start(startTime);
        osc.stop(startTime + 0.3);
      });
    } catch (e) {}
  }

  static playMunch() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const now = ctx.currentTime;
      [0, 0.08].forEach((offset, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(idx === 0 ? 340 : 520, now + offset);
        osc.frequency.exponentialRampToValueAtTime(idx === 0 ? 560 : 780, now + offset + 0.06);
        gain.gain.setValueAtTime(0.14, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.07);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + offset);
        osc.stop(now + offset + 0.07);
      });
    } catch (e) {}
  }

  static playTile() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.05);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } catch (e) {}
  }
}

/**
 * SoundEffects Proxy: 未定義メソッドが呼ばれても TypeError を投げず、
 * 不正解/正解/フォールバックに自動ルーティングする堅牢プロキシ
 */
export const SoundEffects = new Proxy(SoundEffectsBase, {
  get(target, prop) {
    if (prop in target) {
      const val = target[prop];
      return typeof val === 'function' ? val.bind(target) : val;
    }
    if (typeof prop === 'string') {
      const p = prop.toLowerCase();
      if (p.includes('wrong') || p.includes('incorrect') || p.includes('mistake') || p.includes('error') || p.includes('fail')) {
        return (...args) => target.playWrong(...args);
      }
      if (p.includes('correct') || p.includes('success') || p.includes('right') || p.includes('win')) {
        return (...args) => target.playCorrect(...args);
      }
      return () => {};
    }
    return undefined;
  }
});
if (typeof window !== 'undefined') {
  window.SoundEffects = SoundEffects;
}

// 発音・読み方に特に注意が必要な単語リスト（不規則発音・軟音記号ь・硬音記号ъ・特殊母音・短縮形など）
export const PRONUNCIATION_CAUTION_WORDS = new Set([
  'баярлалаа', 'баяртай', 'сайн байна уу', 'байна', 'байхгүй', 'хоёул',
  'гурвуул', 'дөрвүүл', 'тавуул', 'зургууль', 'долуулаа', 'долоул', 'наймуул', 'есүүл',
  'гурав', 'дөрөв', 'тав', 'зургаа', 'долоо', 'найм', 'ес', 'арав', 'хоёр',
  'жар', 'жаран', 'дал', 'далан', 'ная', 'наян', 'ер', 'ерэн',
  'морь', 'хонь', 'сургууль', 'явъя', 'суръя', 'ашгүй', 'юу', 'юү', 'өглөө', 'өвөө',
  'хэлэх', 'үзэх', 'өгөх', 'мэдэх', 'хийх', 'идэх', 'авах', 'явах', 'болох'
]);

/**
 * 読み方に特に注意が必要な単語か判定
 * （全単語にカタカナを振るのではなく、不規則発音・軟音化・文字と発音の乖離が大きいものに限定）
 */
export function isPronunciationCautionWord(word) {
  if (!word) return false;
  if (word.pronunciationCaution === true || word.isIrregularPronunciation === true || word.pronunciationWarning) return true;
  
  const mn = ((typeof word === 'string' ? word : (word.mongolian || word.dictForm || word.baseWord || '')) || '').trim().toLowerCase();
  if (!mn) return false;
  
  // 明示的な注意単語
  if (PRONUNCIATION_CAUTION_WORDS.has(mn)) return true;
  for (const cw of PRONUNCIATION_CAUTION_WORDS) {
    if (mn.includes(cw) && cw.length >= 4) return true;
  }
  
  // 軟音記号 ь（前の文字を口蓋化・軟音化させるため読み方注意）
  if (mn.includes('ь')) return true;
  // 硬音記号 ъ（口蓋化を防ぐ・音節境界）
  if (mn.includes('ъ')) return true;
  
  // メモや解説に発音の注意書きがある場合
  const note = (word.note || word.grammarExplanation || word.hint || '');
  if (/発音|読み方|短縮|脱落|不規則|軟音|注意|変則/.test(note)) return true;
  
  // е / ё で始まり特別な読み方になる単語
  if (mn.startsWith('е') || mn.startsWith('ё')) return true;
  
  return false;
}

if (typeof window !== 'undefined') {
  window.isPronunciationCautionWord = isPronunciationCautionWord;
  window.PRONUNCIATION_CAUTION_WORDS = PRONUNCIATION_CAUTION_WORDS;
}

/**
 * 読解テスト用 単語タップ辞書検索 ＆ 語形ステミング解析
 * パッセージ専用グロッサリー ＋ 744語マスター辞書 ＋ 形態素・格語尾・活用語尾分解
 */
export function findWordInDictionary(rawWord, passageGlossary = null) {
  if (!rawWord) return null;
  const cleanWord = rawWord.trim().replace(/[.,!?:;«»"'\(\)\[\]—–-]/g, '');
  if (!cleanWord) return null;
  const lower = cleanWord.toLowerCase();

  // 1. パッセージ専用グロッサリーでの検索
  if (passageGlossary) {
    if (passageGlossary[cleanWord]) {
      return {
        rawWord: cleanWord,
        dictForm: passageGlossary[cleanWord].dictForm || cleanWord,
        meaning: passageGlossary[cleanWord].meaning,
        pos: passageGlossary[cleanWord].pos || '',
        pron: passageGlossary[cleanWord].pron || '',
        derivation: passageGlossary[cleanWord].derivation || ''
      };
    }
    if (passageGlossary[lower]) {
      return {
        rawWord: cleanWord,
        dictForm: passageGlossary[lower].dictForm || cleanWord,
        meaning: passageGlossary[lower].meaning,
        pos: passageGlossary[lower].pos || '',
        pron: passageGlossary[lower].pron || '',
        derivation: passageGlossary[lower].derivation || ''
      };
    }
  }

  // 1.5. 単独小辞・助詞・呼格・感嘆詞の直接判定テーブル
  const particles = {
    'ээ': { dictForm: 'ээ', meaning: '【感嘆詞】おお、まあ、ええっ／【呼格】〜よ、〜さん／【愛称】お母さん（ээж）', pos: '感嘆詞・呼格語尾', derivation: '親愛を込めた呼格（例: ээж ээ, багш аа）または驚きや感動を表す間投詞' },
    'аа': { dictForm: 'аа', meaning: '【呼格】〜よ、〜さん／【感嘆詞】ああ', pos: '呼格語尾・感嘆詞', derivation: '男性語につく親愛の呼格（例: Зориг оо, Баяр аа）または感嘆詞' },
    'оо': { dictForm: 'оо', meaning: '【呼格】〜よ、〜さん（男性円唇語用）', pos: '呼格語尾', derivation: 'о母音の単語につく呼格語尾（例: Золбоо оо）' },
    'өө': { dictForm: 'өө', meaning: '【呼格】〜よ、〜さん（女性円唇語用）', pos: '呼格語尾', derivation: 'ө母音の単語につく呼格語尾（例: Зөөгч өө）' },
    'уу': { dictForm: 'уу', meaning: '【疑問助詞】〜ですか？（男性語Yes/No疑問）', pos: '疑問助詞', derivation: '男性語（а, о, у）の平叙文末尾に付き疑問文を作る' },
    'үү': { dictForm: 'үү', meaning: '【疑問助詞】〜ですか？（女性語Yes/No疑問）', pos: '疑問助詞', derivation: '女性語（э, ө, ү）の平叙文末尾に付き疑問文を作る' },
    'юу': { dictForm: 'юу', meaning: '【疑問詞】何／【疑問助詞】〜ですか？（長母音・二重母音男性語用）', pos: '疑問代名詞・助詞', derivation: '「何」を尋ねる疑問詞、または長母音末尾男性語の疑問助詞' },
    'юү': { dictForm: 'юү', meaning: '【疑問助詞】〜ですか？（長母音・二重母音女性語用）', pos: '疑問助詞', derivation: '長母音末尾女性語の疑問助詞' },
    'бэ': { dictForm: 'бэ', meaning: '【疑問助詞】〜ですか？（疑問詞文末・鼻音末尾用）', pos: '疑問助詞', derivation: '疑問詞があり、直前がн, м, вで終わる文の末尾に付く' },
    'вэ': { dictForm: 'вэ', meaning: '【疑問助詞】〜ですか？（疑問詞文末用）', pos: '疑問助詞', derivation: '疑問詞（юу, хаана等）のある文末に付く' },
    'биш': { dictForm: 'биш', meaning: '【否定助詞】〜ではない（コピュラ否定）', pos: '否定助詞', derivation: '名詞・代名詞・形容詞の直後に置いて「AはBではない」と否定する' },
    'юм': { dictForm: 'юм', meaning: '【終助詞】〜なのだ、〜である（詠嘆・確認）', pos: '終助詞', derivation: '文末に添えて詠嘆・語気緩和・事実の強調を表す' },
    'ч': { dictForm: 'ч', meaning: '【強調・添加小辞】〜も、〜さえ', pos: '不変化小辞', derivation: '「Би ч бас（私もまた）」のように添加・強調を表す' },
    'бас': { dictForm: 'бас', meaning: '【副詞】また、さらに、やはり', pos: '副詞', derivation: '事物の付加・並列を表す' },
    'шүү': { dictForm: 'шүү', meaning: '【終助詞】〜だよ、〜ね（念押し・助言）', pos: '終助詞', derivation: '聞き手に注意を促したり念を押す親しい終助詞' },
    'за': { dictForm: 'за', meaning: '【感動詞】はい、了解、じゃあ、さて', pos: '感動詞', derivation: '承諾や会話の切り出しに用いる' }
  };

  if (particles[lower]) {
    return {
      rawWord: cleanWord,
      dictForm: particles[lower].dictForm,
      meaning: particles[lower].meaning,
      pos: particles[lower].pos,
      pron: '',
      derivation: particles[lower].derivation
    };
  }
  let vocab = [];
  try {
    if (typeof StorageService !== 'undefined' && StorageService.getVocabulary) {
      vocab = StorageService.getVocabulary();
    }
  } catch (_) {}

  const exact = vocab.find(v => 
    (v.mongolian && v.mongolian.toLowerCase() === lower) ||
    (v.dictForm && v.dictForm.toLowerCase() === lower)
  );
  if (exact) {
    return {
      rawWord: cleanWord,
      dictForm: exact.dictForm || exact.mongolian,
      meaning: exact.japanese || exact.baseMeaning || exact.meaning,
      pos: exact.pos || '',
      pron: exact.pronunciation || '',
      derivation: exact.derivation || ''
    };
  }

  // 3. 名詞格語尾・複数語尾・再帰語尾のステミング探索
  const nounSuffixes = [
    { suffix: 'ийн', name: '属格（〜の）' },
    { suffix: 'ын', name: '属格（〜の）' },
    { suffix: 'ний', name: '属格（〜の）' },
    { suffix: 'ны', name: '属格（〜の）' },
    { suffix: 'дээ', name: '与位格・再帰（〜の自分の...へ）' },
    { suffix: 'доо', name: '与位格・再帰（〜の自分の...へ）' },
    { suffix: 'тээ', name: '与位格・再帰（〜の自分の...へ）' },
    { suffix: 'д', name: '与位格（〜に、〜で）' },
    { suffix: 'т', name: '与位格（〜に、〜で）' },
    { suffix: 'нд', name: '与位格（〜に、〜で）' },
    { suffix: 'ийг', name: '対格（〜を）' },
    { suffix: 'ыг', name: '対格（〜を）' },
    { suffix: 'г', name: '対格（〜を）' },
    { suffix: 'аас', name: '奪格（〜から）' },
    { suffix: 'ээс', name: '奪格（〜から）' },
    { suffix: 'оос', name: '奪格（〜から）' },
    { suffix: 'өөс', name: '奪格（〜から）' },
    { suffix: 'тай', name: '共同格（〜と、〜を持つ）' },
    { suffix: 'тэй', name: '共同格（〜と、〜を持つ）' },
    { suffix: 'той', name: '共同格（〜と、〜を持つ）' },
    { suffix: 'аар', name: '造格（〜で、手段）' },
    { suffix: 'ээр', name: '造格（〜で、手段）' },
    { suffix: 'оор', name: '造格（〜で、手段）' },
    { suffix: 'өөр', name: '造格（〜で、手段）' },
    { suffix: 'ууд', name: '複数語尾（〜たち）' },
    { suffix: 'үүд', name: '複数語尾（〜たち）' },
    { suffix: 'аа', name: '再帰語尾（自分の〜）' },
    { suffix: 'ээ', name: '再帰語尾（自分の〜）' },
    { suffix: 'оо', name: '再帰語尾（自分の〜）' },
    { suffix: 'өө', name: '再帰語尾（自分の〜）' }
  ];

  for (const s of nounSuffixes) {
    if (lower.endsWith(s.suffix) && lower.length > s.suffix.length + 1) {
      const stem = lower.slice(0, -s.suffix.length);
      const match = vocab.find(v => 
        (v.mongolian && v.mongolian.toLowerCase() === stem) ||
        (v.dictForm && v.dictForm.toLowerCase() === stem) ||
        (v.mongolian && v.mongolian.toLowerCase().startsWith(stem))
      );
      if (match) {
        let naturalMeaning = match.japanese || match.baseMeaning || match.meaning;
        if (s.suffix === 'тай' || s.suffix === 'тэй' || s.suffix === 'той') {
          naturalMeaning = `${match.baseMeaning || match.japanese.split(/[、,（(]/)[0]}のある、〜付きの、〜を持つ（共同格・有属）`;
        }
        return {
          rawWord: cleanWord,
          dictForm: match.dictForm || match.mongolian,
          meaning: naturalMeaning,
          pos: match.pos || '名詞（格変化形）',
          pron: match.pronunciation || '',
          derivation: `名詞「${match.dictForm || match.mongolian}」＋ ${s.name}「-${s.suffix}」`
        };
      }
    }
  }

  // 4. 動詞活用語尾のステミング探索
  const verbSuffixes = [
    { suffix: 'сан', name: '過去形（〜した）' },
    { suffix: 'сэн', name: '過去形（〜した）' },
    { suffix: 'сон', name: '過去形（〜した）' },
    { suffix: 'сөн', name: '過去形（〜した）' },
    { suffix: 'на', name: '現在未来形（〜する）' },
    { suffix: 'нэ', name: '現在未来形（〜する）' },
    { suffix: 'но', name: '現在未来形（〜する）' },
    { suffix: 'нө', name: '現在未来形（〜する）' },
    { suffix: 'даг', name: '習慣形（いつも〜する）' },
    { suffix: 'дэг', name: '習慣形（いつも〜する）' },
    { suffix: 'дог', name: '習慣形（いつも〜する）' },
    { suffix: 'дөг', name: '習慣形（いつも〜する）' },
    { suffix: 'аад', name: '並列・順次（〜して）' },
    { suffix: 'ээд', name: '並列・順次（〜して）' },
    { suffix: 'оод', name: '並列・順次（〜して）' },
    { suffix: 'өөд', name: '並列・順次（〜して）' },
    { suffix: 'ж', name: '並列接続（〜して）' },
    { suffix: 'ч', name: '並列接続（〜して）' },
    { suffix: 'вал', name: '仮定条件（〜したら）' },
    { suffix: 'вэл', name: '仮定条件（〜したら）' }
  ];

  for (const v of verbSuffixes) {
    if (lower.endsWith(v.suffix) && lower.length > v.suffix.length + 1) {
      const stem = lower.slice(0, -v.suffix.length);
      
      // 1. スペースを含まない純粋な単一動詞を優先検索（ярилцах өрөөなどの複合語による誤マッチを完全防止）
      let match = vocab.find(item => {
        const df = (item.dictForm || item.mongolian || '').toLowerCase();
        if (df.includes(' ')) return false;
        if (item.root && item.root.replace(/-/g, '').toLowerCase() === stem) return true;
        // 動詞辞書形 (-х, -ах, -эх, -ох, -өх) との完全一致
        if (df === stem + 'х' || df === stem + 'ах' || df === stem + 'эх' || df === stem + 'ох' || df === stem + 'өх') return true;
        return false;
      });

      // 2. なければ語幹前方一致（ただしスペースを含まない単一動詞のみ）
      if (!match) {
        match = vocab.find(item => {
          const df = (item.dictForm || item.mongolian || '').toLowerCase();
          return !df.includes(' ') && df.startsWith(stem) && df.endsWith('х');
        });
      }

      if (match) {
        return {
          rawWord: cleanWord,
          dictForm: match.dictForm || match.mongolian,
          meaning: match.japanese || match.baseMeaning || match.meaning,
          pos: '動詞',
          pron: match.pronunciation || '',
          derivation: `動詞語幹「${match.root || stem}」＋ ${v.name}「-${v.suffix}」`
        };
      }
    }
  }

  // 語幹マッチが見つからなかった場合でも、末尾の文法語尾を解析
  for (const s of nounSuffixes) {
    if (lower.endsWith(s.suffix) && lower.length > s.suffix.length) {
      const stem = cleanWord.slice(0, -s.suffix.length);
      return {
        rawWord: cleanWord,
        dictForm: stem,
        meaning: `語幹「${stem}」＋ 名詞格語尾【${s.name}】`,
        pos: '名詞（格変化形）',
        pron: '',
        derivation: `語幹「${stem}」に格助詞「-${s.suffix}」（${s.name}）が接続した文法形です。`
      };
    }
  }

  for (const v of verbSuffixes) {
    if (lower.endsWith(v.suffix) && lower.length > v.suffix.length) {
      const stem = cleanWord.slice(0, -v.suffix.length);
      return {
        rawWord: cleanWord,
        dictForm: stem + 'х',
        meaning: `動詞語幹「${stem}」＋ 活用語尾【${v.name}】`,
        pos: '動詞（活用形）',
        pron: '',
        derivation: `動詞語幹「${stem}」に活用語尾「-${v.suffix}」（${v.name}）が接続した文法形です。`
      };
    }
  }

  // 接尾辞も未検出の場合のフォールバック（推測説明は行わない）
  return {
    rawWord: cleanWord,
    dictForm: cleanWord,
    meaning: `【辞書未登録】「${cleanWord}」`,
    pos: '語句',
    pron: '',
    derivation: `辞書未登録の語句または固有名詞です。`,
    isFallback: true
  };
}

/**
 * モンゴル語キリル文字テキストの各単語をタップ可能なspan要素でラップする
 * @param {string} text - 対象テキスト
 * @param {function} lookedUpCheckFn - 単語が保存済みか判定する関数 (token => boolean)
 * @returns {string} HTML文字列
 */
export function renderClickableWordsHTML(text, lookedUpCheckFn = null) {
  if (!text) return '';
  const cleanedText = cleanMongolianMojibake(text);
  const tokens = cleanedText.split(/([А-Яа-яЁёӨөҮү]+(?:-[А-Яа-яЁёӨөҮү]+)?)/g);
  return tokens.map(token => {
    if (/^[А-Яа-яЁёӨөҮү]+(?:-[А-Яа-яЁёӨөҮү]+)?$/.test(token)) {
      const isLookedUp = typeof lookedUpCheckFn === 'function' ? lookedUpCheckFn(token) : false;
      return `<span class="clickable-word cursor-pointer px-0.5 rounded transition-all inline-block select-none ${
        isLookedUp
          ? 'bg-amber-100/80 border-b-2 border-amber-400 font-bold text-amber-950 dark:bg-amber-950/60 dark:text-amber-200'
          : 'hover:bg-amber-100 hover:text-amber-900 dark:hover:bg-amber-900/40 dark:hover:text-amber-200 border-b border-dotted border-slate-400 dark:border-slate-500'
      }" data-word="${token}" title="タップして辞書解説を表示">${token}</span>`;
    }
    return token;
  }).join('');
}

/**
 * 単語詳細モーダルを表示するユニバーサルヘルパー
 */
export function showUniversalWordModal({ wordInfo, passageTitle = '', onNavigate = null, onClose = null }) {
  if (!wordInfo) return;

  const existing = document.getElementById('universal-word-modal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'universal-word-modal';
  modal.className = 'fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-3 animate-fade-in';

  modal.innerHTML = `
    <div class="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-sm p-5 border border-slate-200 dark:border-slate-800 shadow-xl space-y-3.5 relative">
      
      <!-- ヘッダー（ビジュアルイラスト付き・要件準拠） -->
      <div class="flex items-start justify-between gap-2.5">
        <div class="flex items-center gap-3">
          ${(typeof getWordIllustrationHTML === 'function') ? getWordIllustrationHTML({ mongolian: wordInfo.rawWord, dictForm: wordInfo.dictForm, japanese: wordInfo.meaning }, { size: 'lg' }) : ''}
          <div>
            <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
              ${wordInfo.pos || '単語解説'}
            </span>
            <div class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white cyrillic-text mt-1 flex items-center gap-2">
              <span>${wordInfo.rawWord}</span>
              <button type="button" id="btn-u-modal-speak" class="p-1.5 rounded-lg bg-teal-50 dark:bg-teal-950 hover:bg-teal-100 text-teal-700 dark:text-teal-300 text-sm cursor-pointer" title="音声を再生">
                🔊
              </button>
            </div>
            ${wordInfo.pron ? `<div class="text-xs text-slate-400 font-medium">${wordInfo.pron}</div>` : ''}
          </div>
        </div>

        <button type="button" id="btn-u-close-modal" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg p-1 cursor-pointer">
          ✕
        </button>
      </div>

      <!-- 辞書形 ＆ 意味 -->
      <div class="space-y-2 bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
        <div class="flex items-center justify-between">
          <span class="text-slate-500 font-medium">📖 辞書形（基本形）:</span>
          <span class="font-extrabold text-slate-900 dark:text-slate-100 cyrillic-text text-sm">${wordInfo.dictForm || wordInfo.rawWord}</span>
        </div>

        <div class="pt-1.5 border-t border-slate-200/60 dark:border-slate-800">
          <span class="text-slate-500 font-medium">🇯🇵 日本語の意味:</span>
          <div class="text-sm font-black text-emerald-900 dark:text-emerald-300 mt-0.5">${wordInfo.meaning}</div>
        </div>

        ${wordInfo.derivation ? `
          <div class="pt-1.5 border-t border-slate-200/60 dark:border-slate-800 text-slate-600 dark:text-slate-400">
            <span class="text-slate-500 font-medium">🌱 文法・語幹構造:</span>
            <div class="mt-0.5 text-[11px] leading-relaxed">${wordInfo.derivation}</div>
          </div>
        ` : ''}
      </div>

      <!-- 語呂合わせ・楽しい覚え方カード -->
      ${(typeof getWordMnemonicHTML === 'function') ? getWordMnemonicHTML({ mongolian: wordInfo.rawWord, dictForm: wordInfo.dictForm, japanese: wordInfo.meaning }, wordInfo.rawWord) : ''}

      <!-- 似ている単語との違い・使い分けカード（要件準拠） -->
      ${(typeof getSimilarWordDistinctionHTML === 'function') ? getSimilarWordDistinctionHTML({ mongolian: wordInfo.rawWord, dictForm: wordInfo.dictForm, japanese: wordInfo.meaning }, wordInfo.rawWord) : ''}

      <!-- 保存通知バッジ ＆ テストリンク -->
      <div class="bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-xl p-2.5 flex items-center justify-between text-xs text-amber-900 dark:text-amber-200">
        <div class="flex items-center gap-1.5 font-bold">
          <span>📌</span>
          <span>「調べた単語帳」に保存しました！</span>
        </div>
        ${onNavigate ? `
          <button type="button" id="btn-u-goto-lookup" class="text-[11px] font-extrabold text-amber-800 dark:text-amber-400 underline cursor-pointer">
            単語帳・テストを見る
          </button>
        ` : ''}
      </div>

      <button type="button" id="btn-u-modal-close-action" class="w-full py-2.5 bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-bold rounded-xl text-xs cursor-pointer">
        閉じる
      </button>

    </div>
  `;

  document.body.appendChild(modal);

  const cleanup = () => {
    modal.remove();
    if (typeof onClose === 'function') onClose();
  };

  modal.querySelector('#btn-u-close-modal')?.addEventListener('click', cleanup);
  modal.querySelector('#btn-u-modal-close-action')?.addEventListener('click', cleanup);
  modal.querySelector('#btn-u-modal-speak')?.addEventListener('click', () => {
    try {
      if (typeof SpeechService !== 'undefined' && SpeechService.speak) {
        SpeechService.speak(wordInfo.dictForm || wordInfo.rawWord);
      }
    } catch (_) {}
  });
  modal.querySelector('#btn-u-goto-lookup')?.addEventListener('click', () => {
    cleanup();
    if (typeof onNavigate === 'function') {
      onNavigate('looked_up_words');
    }
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) cleanup();
  });
}


/**
 * 複数のモンゴル語表現・ニュアンス使い分けマスターデータ（要件6）
 */
export const SYNONYM_EXPRESSIONS_MAP = {
  "気にしない": {
    topicJa: "気にしない・構わない・大丈夫",
    expressions: [
      {
        word: "хамаагүй",
        pron: "ハマアグイ",
        meaning: "構わない、気にしない、どちらでもよい",
        nuance: "【日常口語】何事にもこだわらず「どっちでもいいよ」「気にしなくていいよ」と軽く流す最も一般的な表現。",
        scene: "選択肢を問われた時や、相手の遠慮を解く場面（例: Аль нь ч хамаагүй = どちらでも構いません）。"
      },
      {
        word: "зүгээр",
        pron: "ズゲール",
        meaning: "大丈夫、平気、問題ない",
        nuance: "【感謝・謝罪への返答】相手の「すみません（Уучлаарай）」に対して「いいえ、平気ですよ、気にしないで」と答える決まり文句。",
        scene: "失敗を謝られた時（例: Зүгээр, зүгээр. Би өөрөө хийчихнэ = 大丈夫です、自分でやりますから気にしないで）。"
      },
      {
        word: "тоохгүй",
        pron: "トーホグイ",
        meaning: "意に介さない、気に留めない、相手にしない",
        nuance: "【動詞否定】動詞「тоох（気にかける、重視する）」の否定形で、他人の悪口や小さなトラブルを「本人が全く気にしていない」という客観的な態度を表す。",
        scene: "他人の目を気にしない時（例: Тэр бусдын үгийг огт тоодоггүй = 彼は他人の言うことを全く気にしません）。"
      },
      {
        word: "санаа зоволтгүй",
        pron: "サナア ゾウォルトグイ",
        meaning: "心配しないで、気を揉まないで、ご心配なく",
        nuance: "【思いやり・気遣い】相手が心配して気兼ねしている時に「心配ご無用ですよ」と安心させる丁寧な表現。",
        scene: "相手の心配を和らげる時（例: Та санаа зоволтгүй, бүх зүイル бүтнэ = 心配しないでください、すべてうまくいきます）。"
      }
    ]
  },
  "ありがとう": {
    topicJa: "ありがとう・感謝の表現",
    expressions: [
      {
        word: "Баярлалаа",
        pron: "バヤルララー",
        meaning: "ありがとう",
        nuance: "【標準的感謝】誰に対しても日常的に幅広く使える基本の「ありがとう」。"
      },
      {
        word: "Их баярлалаа",
        pron: "イヒ バヤルララー",
        meaning: "どうもありがとうございます",
        nuance: "【丁寧な感謝】「Их（大いに）」を付けて感謝の深さを表す丁寧な表現。"
      },
      {
        word: "Маш их баярлалаа",
        pron: "マシ イヒ バヤルララー",
        meaning: "誠にありがとうございます・大変感謝いたします",
        nuance: "【最大級の敬意・感謝】改まった場や心からの感謝を伝える最上級表現。"
      },
      {
        word: "Гялайлаа",
        pron: "ギャライラー",
        meaning: "かたじけない、ありがたい",
        nuance: "【伝統的・親愛表現】主に年配者や目上の人が親しみを込めて「ありがとよ」と述べる伝統的な感謝表現。"
      }
    ]
  },
  "さようなら": {
    topicJa: "さようなら・別れの挨拶",
    expressions: [
      {
        word: "Баяртай",
        pron: "バヤルタイ",
        meaning: "さようなら",
        nuance: "【標準的別れの挨拶】時間帯や相手を問わずいつでも使える最も標準的な別れの言葉。"
      },
      {
        word: "Дараа уулзъя",
        pron: "ダラア ウールズィヤ",
        meaning: "また会いましょう・またね",
        nuance: "【再会を前提とする別れ】「Дараа（後で・次回）」＋「уулзъя（会おう）」で親しい間柄でよく使われる。"
      },
      {
        word: "Маргааш уулзъя",
        pron: "マルガーシ ウールズィヤ",
        meaning: "また明日",
        nuance: "【翌日会う約束】職場や学校で「明日会いましょう」と別れる時の定番表現。"
      },
      {
        word: "Түр баяртай",
        pron: "トゥル バヤルタイ",
        meaning: "じゃあ後でね・一時的に失礼します",
        nuance: "【短い別れ】「Түр（少しの間）」だけ席を外したり、同日中に再会する時の挨拶。"
      }
    ]
  },
  "美味しい": {
    topicJa: "おいしい・味覚表現",
    expressions: [
      {
        word: "амттай",
        pron: "アムトタイ",
        meaning: "美味しい（味がある）",
        nuance: "【一般的表現】「амт（味）」＋「-тай（有属接尾辞）」で、美味しい料理全般を指す最も基本の語。"
      },
      {
        word: "маш амттай",
        pron: "マシ アムトタイ",
        meaning: "とても美味しい",
        nuance: "【強調表現】ごちそうを称賛する丁寧な褒め言葉。"
      },
      {
        word: "янзтай",
        pron: "ヤンズタイ",
        meaning: "うまい！最高！格別だ！",
        nuance: "【親しい口語スラング】「янз（スタイル・格好）」から転じて「これはたまらん、抜群にうまい！」と感動を表す口語。"
      }
    ]
  },
  "きれい": {
    topicJa: "綺麗・美しい・かわいい",
    expressions: [
      {
        word: "сайхан",
        pron: "サイハン",
        meaning: "美しい、素晴らしい、清々しい",
        nuance: "【内面・景色・総合的美】外見だけでなく、景色・心・天気などあらゆる良い状態を広く称賛する語。"
      },
      {
        word: "хөөрхөн",
        pron: "フールホン",
        meaning: "かわいい、愛らしい",
        nuance: "【愛らしさ】小さな子ども、動物、愛嬌のある人物に対して「可愛い」と述べる表現。"
      },
      {
        word: "үзэсгэлэнтэй",
        pron: "ウゼスゲレントエイ",
        meaning: "息をのむほど美しい、絶景の、見目麗しい",
        nuance: "【壮大な美しさ・格式】大自然の絶景や、気品ある美しい人物を形容する詩的・格式ある表現。"
      },
      {
        word: "цэвэрхэн",
        pron: "ツェウェルヘン",
        meaning: "清潔な、綺麗に片付いている",
        nuance: "【衛生・整然さ】部屋や身だしなみが汚れておらず小綺麗に整っている状態を表す。"
      }
    ]
  }
};

/**
 * 日本語またはモンゴル語キーから複数表現カードのHTMLを生成
 */
export function getSynonymExpressionsCardHTML(keyWord) {
  if (!keyWord) return '';
  const cleanKey = String(keyWord).toLowerCase().trim().replace(/[.,!?。、！？\s]/g, '');

  let matchedData = null;
  for (const [topic, data] of Object.entries(SYNONYM_EXPRESSIONS_MAP)) {
    if (cleanKey.includes(topic) || topic.includes(cleanKey)) {
      matchedData = data;
      break;
    }
    for (const exp of data.expressions) {
      const wClean = exp.word.toLowerCase().replace(/[.,!?。、！？\s]/g, '');
      if (cleanKey === wClean || cleanKey.includes(wClean)) {
        matchedData = data;
        break;
      }
    }
    if (matchedData) break;
  }

  if (!matchedData) return '';

  const cardsHTML = matchedData.expressions.map(exp => `
    <div class="p-2.5 rounded-xl bg-white/95 dark:bg-slate-800 border border-indigo-200 dark:border-slate-700 shadow-2xs space-y-1">
      <div class="flex items-center justify-between text-xs">
        <span class="font-extrabold text-indigo-900 dark:text-indigo-300 cyrillic-text text-sm">
          ${exp.word} <span class="text-[11px] font-normal text-slate-500">(${exp.pron})</span>
        </span>
        <span class="text-xs font-bold text-slate-700 dark:text-slate-300">${exp.meaning}</span>
      </div>
      <div class="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
        ${exp.nuance}
      </div>
      ${exp.scene ? `
        <div class="text-[10px] text-indigo-700 dark:text-indigo-400 font-medium bg-indigo-50/70 dark:bg-indigo-950/40 p-1 rounded-md">
          💡 使用場面: ${exp.scene}
        </div>
      ` : ''}
    </div>
  `).join('');

  return `
    <div class="mt-3 p-3.5 rounded-2xl bg-gradient-to-br from-indigo-50/90 to-purple-50/80 dark:from-slate-800 dark:to-slate-900 border-2 border-indigo-300 dark:border-indigo-800 text-xs space-y-2.5 shadow-sm">
      <div class="flex items-center justify-between font-black text-indigo-950 dark:text-indigo-200">
        <span class="flex items-center gap-1.5 text-sm">
          <span>✨</span> 表現の使い分け・類義語ガイド: 【${matchedData.topicJa}】
        </span>
        <span class="text-[10px] bg-indigo-200 dark:bg-indigo-900 text-indigo-900 dark:text-indigo-200 px-2 py-0.5 rounded-full font-bold">
          全${matchedData.expressions.length}表現
        </span>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
        ${cardsHTML}
      </div>
    </div>
  `;
}

/**
 * 問題切り替え時に解きやすい位置へ画面を自動スクロール・最適配置するヘルパー
 * @param {HTMLElement|string|null} targetElement 対象コンテナまたはセレクタ
 */
export function scrollToQuizTop(targetElement = null) {
  try {
    if (typeof window === 'undefined') return;
    const scrollFn = () => {
      let el = targetElement;
      if (typeof el === 'string') el = document.querySelector(el);
      if (!el) el = document.getElementById('main-content') || document.querySelector('main');
      if (el && el.getBoundingClientRect) {
        const rect = el.getBoundingClientRect();
        const currentScrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
        // ナビバーやヘッダーの少し下（約12pxマージン）に問題カードの先頭を美しく合わせる
        const targetY = Math.max(0, Math.floor(currentScrollY + rect.top - 12));
        window.scrollTo({ top: targetY, behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    scrollFn();
    // DOMレンダリング後の確実な追従スクロール（スマホ・タブレットの仮想キーボードや再描画にも即時対応）
    setTimeout(scrollFn, 20);
  } catch (_) {
    try { window.scrollTo(0, 0); } catch (_) {}
  }
}
if (typeof window !== 'undefined') {
  window.scrollToQuizTop = scrollToQuizTop;
}
