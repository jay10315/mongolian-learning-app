// 背景色・テーマカスタマイズモーダル
import { ThemeService, THEME_PRESETS } from '../services/theme.js';

export class ThemeModal {
  static modalEl = null;

  static show(onUpdate) {
    this.close();

    const currentState = ThemeService.getThemeState();
    const currentTheme = currentState.theme;
    const currentCustomBg = currentState.customBg || '#f8fafc';

    // クイックパレット用の追加おすすめカラー
    const quickColors = [
      { hex: '#f8fafc', name: '標準スレート' },
      { hex: '#ffffff', name: 'ピュアホワイト' },
      { hex: '#f6eedb', name: '読書セピア' },
      { hex: '#e6f4ea', name: 'ペールミント' },
      { hex: '#e8f0fe', name: 'ソフトスカイ' },
      { hex: '#fef7e0', name: 'ウォームクリーム' },
      { hex: '#fce8e6', name: 'さくらピンク' },
      { hex: '#f5f3ff', name: 'ラベンダー' },
      { hex: '#0f172a', name: 'ミッドナイト' },
      { hex: '#18181b', name: '漆黒ジンク' },
      { hex: '#064e3b', name: '深緑フォレスト' },
      { hex: '#0c4a6e', name: '紺碧オーシャン' },
      { hex: '#1e1b4b', name: 'インディゴナイト' },
      { hex: '#262626', name: 'ダークニュートラル' },
      { hex: '#000000', name: 'AMOLEDブラック' }
    ];

    const modal = document.createElement('div');
    modal.id = 'theme-modal-overlay';
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in';

    modal.innerHTML = `
      <div class="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
        <!-- ヘッダー -->
        <div class="px-6 py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <span class="text-2xl">🎨</span>
            <div>
              <h3 class="font-extrabold text-base leading-tight">テーマ ＆ 背景色カスタマイズ</h3>
              <p class="text-emerald-100 text-[11px] font-medium">お好みの背景色やダークモードで快適に学習できます</p>
            </div>
          </div>
          <button type="button" id="btn-close-theme-modal" class="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer text-lg font-bold">
            ✕
          </button>
        </div>

        <!-- 本文 -->
        <div class="p-6 space-y-6 overflow-y-auto">

          <!-- 1. プリセットテーマ -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <h4 class="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <span>🌟</span> 定番おすすめテーマ
              </h4>
              <span class="text-[11px] text-slate-400">タップで即時変更</span>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5" id="theme-preset-list">
              ${THEME_PRESETS.map(preset => {
                const isSelected = currentTheme === preset.id;
                return `
                  <button type="button" data-preset-id="${preset.id}" class="preset-theme-btn p-3 rounded-2xl border text-left transition-all flex flex-col gap-1.5 cursor-pointer hover:scale-[1.02] shadow-2xs relative ${
                    isSelected ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/30' : 'border-slate-200 hover:border-slate-300 bg-white'
                  }">
                    <div class="flex items-center justify-between w-full">
                      <span class="text-xl">${preset.icon}</span>
                      <span class="w-5 h-5 rounded-full border border-slate-300 shadow-2xs inline-block" style="background-color: ${preset.bg};"></span>
                    </div>
                    <div class="font-bold text-xs text-slate-800 leading-tight">${preset.name}</div>
                    <div class="text-[10px] text-slate-400 line-clamp-1">${preset.desc}</div>
                    ${isSelected ? '<span class="absolute top-2 right-2 text-emerald-600 font-black text-xs">✓</span>' : ''}
                  </button>
                `;
              }).join('')}
            </div>
          </div>

          <!-- 2. 自由な背景色の選択 -->
          <div class="space-y-3 pt-3 border-t border-slate-100">
            <div class="flex items-center justify-between">
              <h4 class="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <span>🖌️</span> 自由な背景色（カラーピッカー）
              </h4>
              <span class="text-[11px] text-slate-400">どんな色でもOK</span>
            </div>

            <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <div class="flex items-center gap-3">
                <div class="relative w-12 h-12 rounded-xl overflow-hidden shadow-inner border border-slate-300 flex-shrink-0 cursor-pointer">
                  <input type="color" id="input-theme-color-picker" value="${currentCustomBg}" class="absolute -top-4 -left-4 w-20 h-20 cursor-pointer border-0 p-0">
                </div>
                <div class="flex-1">
                  <div class="text-xs font-bold text-slate-700">カラーコード入力 / 選択</div>
                  <div class="flex items-center gap-2 mt-1">
                    <input type="text" id="input-theme-hex" value="${currentCustomBg}" placeholder="#ffffff" maxlength="7" class="w-28 px-2.5 py-1 text-xs font-mono border border-slate-300 rounded-lg uppercase font-bold focus:ring-1 focus:ring-emerald-500">
                    <button type="button" id="btn-apply-custom-color" class="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-all shadow-2xs cursor-pointer">
                      背景に適用
                    </button>
                  </div>
                </div>
              </div>

              <!-- クイックパレット一覧 -->
              <div class="space-y-1.5 pt-2">
                <div class="text-[11px] text-slate-500 font-bold">人気の背景色パレット:</div>
                <div class="flex flex-wrap gap-2">
                  ${quickColors.map(c => `
                    <button type="button" data-hex="${c.hex}" title="${c.name} (${c.hex})" class="quick-color-btn w-7 h-7 rounded-lg border border-slate-300 shadow-2xs hover:scale-110 transition-transform cursor-pointer flex items-center justify-center relative" style="background-color: ${c.hex};">
                      ${currentCustomBg.toLowerCase() === c.hex.toLowerCase() ? '<span class="text-[10px] font-black" style="color: ' + (ThemeService.isColorDark(c.hex) ? '#ffffff' : '#000000') + '">✓</span>' : ''}
                    </button>
                  `).join('')}
                </div>
              </div>
            </div>
          </div>

          <!-- 3. デフォルトへの復帰 -->
          <div class="pt-2 flex items-center justify-between text-xs">
            <button type="button" id="btn-reset-default-theme" class="text-slate-500 hover:text-slate-800 underline cursor-pointer font-medium">
              ↺ デフォルト配色に戻す
            </button>
            <button type="button" id="btn-theme-modal-done" class="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold transition-all shadow-sm cursor-pointer">
              完了
            </button>
          </div>

        </div>
      </div>
    `;

    document.body.appendChild(modal);
    this.modalEl = modal;

    // イベントバインド
    const closeBtn = modal.querySelector('#btn-close-theme-modal');
    if (closeBtn) closeBtn.addEventListener('click', () => this.close());

    const doneBtn = modal.querySelector('#btn-theme-modal-done');
    if (doneBtn) doneBtn.addEventListener('click', () => this.close());

    modal.addEventListener('click', (e) => {
      if (e.target === modal) this.close();
    });

    // プリセットボタン
    modal.querySelectorAll('.preset-theme-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const presetId = btn.getAttribute('data-preset-id');
        ThemeService.applyTheme(presetId, null, true);
        this.show(onUpdate); // 再描画して選択枠を更新
        if (onUpdate) onUpdate();
      });
    });

    // カラーピッカー & Hex 入力
    const colorPicker = modal.querySelector('#input-theme-color-picker');
    const hexInput = modal.querySelector('#input-theme-hex');
    const applyBtn = modal.querySelector('#btn-apply-custom-color');

    if (colorPicker && hexInput) {
      colorPicker.addEventListener('input', (e) => {
        hexInput.value = e.target.value;
        ThemeService.applyTheme('custom', e.target.value, true);
        if (onUpdate) onUpdate();
      });

      if (applyBtn) {
        applyBtn.addEventListener('click', () => {
          let val = hexInput.value.trim();
          if (!val.startsWith('#')) val = '#' + val;
          if (/^#[0-9A-Fa-f]{6}$/.test(val) || /^#[0-9A-Fa-f]{3}$/.test(val)) {
            ThemeService.applyTheme('custom', val, true);
            this.show(onUpdate);
            if (onUpdate) onUpdate();
          } else {
            alert('有効なカラーコード（例: #ffffff, #0f172a）を入力してください。');
          }
        });
      }
    }

    // クイックカラーボタン
    modal.querySelectorAll('.quick-color-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const hex = btn.getAttribute('data-hex');
        if (hex) {
          ThemeService.applyTheme('custom', hex, true);
          this.show(onUpdate);
          if (onUpdate) onUpdate();
        }
      });
    });

    // リセットボタン
    const resetBtn = modal.querySelector('#btn-reset-default-theme');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        ThemeService.applyTheme('light', null, true);
        this.show(onUpdate);
        if (onUpdate) onUpdate();
      });
    }
  }

  static close() {
    if (this.modalEl && this.modalEl.parentElement) {
      this.modalEl.parentElement.removeChild(this.modalEl);
      this.modalEl = null;
    }
    const existing = document.getElementById('theme-modal-overlay');
    if (existing && existing.parentElement) {
      existing.parentElement.removeChild(existing);
    }
  }
}
