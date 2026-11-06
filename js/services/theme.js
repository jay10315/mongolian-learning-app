// テーマ・背景色管理サービス（ワンタップナイトモード ＆ 自由背景色カスタマイズ）
import { StorageService } from './storage.js';

export const THEME_PRESETS = [
  { id: 'light', name: 'デフォルト（ライト）', bg: '#f8fafc', icon: '☀️', isDark: false, desc: '清潔感のある翠緑・白' },
  { id: 'dark', name: 'ナイトモード（ダーク）', bg: '#0f172a', icon: '🌙', isDark: true, desc: '目に優しい深夜スレート' },
  { id: 'sepia', name: '読書セピア（和紙風）', bg: '#f6eedb', icon: '📖', isDark: false, desc: '目が疲れない温かいペーパー' },
  { id: 'forest', name: '草原グリーン（深緑）', bg: '#064e3b', icon: '🌿', isDark: true, desc: '落ち着きのある大草原の緑' },
  { id: 'ocean', name: 'ディープオーシャン（紺碧）', bg: '#0c4a6e', icon: '🌊', isDark: true, desc: '集中力が高まる静かな海' },
  { id: 'lavender', name: 'ラベンダー（薄紫）', bg: '#f5f3ff', icon: '💜', isDark: false, desc: '上品でリラックスできる紫' }
];

export class ThemeService {
  static listeners = [];
  static currentTheme = 'light';
  static customBg = null;

  static init() {
    try {
      const settings = StorageService.getSettings() || {};
      const savedTheme = settings.theme || 'light';
      const savedCustomBg = settings.customBg || null;
      this.applyTheme(savedTheme, savedCustomBg, false);
    } catch (e) {
      console.warn('ThemeService.init error:', e);
    }
  }

  static isColorDark(hex) {
    if (!hex || typeof hex !== 'string' || !hex.startsWith('#')) return false;
    let c = hex.substring(1);
    if (c.length === 3) c = c.split('').map(x => x + x).join('');
    const rgb = parseInt(c, 16);
    if (isNaN(rgb)) return false;
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >>  8) & 0xff;
    const b = (rgb >>  0) & 0xff;
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return luma < 140;
  }

  static applyTheme(themeId = 'light', customBgColor = null, saveToStorage = true) {
    this.currentTheme = themeId;
    this.customBg = customBgColor;

    if (typeof document === 'undefined') return;

    const body = document.body;
    if (!body) return;

    // 既存テーマクラスを除去
    body.classList.remove('theme-dark', 'theme-sepia', 'theme-forest', 'theme-ocean', 'theme-lavender', 'theme-custom');
    body.style.backgroundColor = '';

    if (themeId === 'dark') {
      body.classList.add('theme-dark');
    } else if (themeId === 'sepia') {
      body.classList.add('theme-sepia');
    } else if (themeId === 'forest') {
      body.classList.add('theme-dark', 'theme-forest');
    } else if (themeId === 'ocean') {
      body.classList.add('theme-dark', 'theme-ocean');
    } else if (themeId === 'lavender') {
      body.classList.add('theme-lavender');
    } else if (themeId === 'custom' && customBgColor) {
      body.classList.add('theme-custom');
      body.style.backgroundColor = customBgColor;
      if (this.isColorDark(customBgColor)) {
        body.classList.add('theme-dark');
      }
    }

    // meta theme-colorの更新
    try {
      let metaTheme = document.querySelector('meta[name="theme-color"]');
      if (metaTheme) {
        if (themeId === 'dark') metaTheme.content = '#0f172a';
        else if (themeId === 'sepia') metaTheme.content = '#f6eedb';
        else if (themeId === 'forest') metaTheme.content = '#064e3b';
        else if (themeId === 'ocean') metaTheme.content = '#0c4a6e';
        else if (themeId === 'lavender') metaTheme.content = '#f5f3ff';
        else if (themeId === 'custom' && customBgColor) metaTheme.content = customBgColor;
        else metaTheme.content = '#059669';
      }
    } catch (_) {}

    if (saveToStorage) {
      try {
        const settings = StorageService.getSettings() || {};
        settings.theme = themeId;
        settings.customBg = customBgColor;
        StorageService.saveSettings(settings);
      } catch (e) {
        console.warn('ThemeService saveSettings error:', e);
      }
    }

    // リスナー呼び出し
    this.listeners.forEach(fn => {
      try { fn(themeId, customBgColor); } catch (_) {}
    });
  }

  static toggleNightMode() {
    if (this.isDarkMode()) {
      this.applyTheme('light', null, true);
    } else {
      this.applyTheme('dark', null, true);
    }
  }

  static isDarkMode() {
    if (this.currentTheme === 'dark' || this.currentTheme === 'forest' || this.currentTheme === 'ocean') {
      return true;
    }
    if (this.currentTheme === 'custom' && this.customBg && this.isColorDark(this.customBg)) {
      return true;
    }
    return false;
  }

  static getThemeState() {
    return {
      theme: this.currentTheme,
      customBg: this.customBg,
      isDark: this.isDarkMode()
    };
  }

  static addListener(fn) {
    if (typeof fn === 'function') {
      this.listeners.push(fn);
    }
  }
}
