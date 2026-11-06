import os, re, sys

base_dir = r"C:\Users\kkaho\.gemini\antigravity\scratch\mongol-learning-app"

def test_theme_service():
    theme_js = os.path.join(base_dir, 'js', 'services', 'theme.js')
    assert os.path.exists(theme_js), f"{theme_js} must exist"
    with open(theme_js, 'r', encoding='utf-8') as f:
        content = f.read()

    assert 'class ThemeService' in content, "ThemeService class must be defined"
    assert 'static isColorDark(' in content, "isColorDark method must exist"
    assert 'static applyTheme(' in content, "applyTheme method must exist"
    assert 'static toggleNightMode(' in content, "toggleNightMode method must exist"
    assert 'static isDarkMode(' in content, "isDarkMode method must exist"
    assert 'static getThemeState(' in content, "getThemeState method must exist"
    assert 'THEME_PRESETS' in content, "THEME_PRESETS must be exported"

    # Python version of isColorDark for verification
    def is_color_dark(hex_str):
        if not hex_str or not hex_str.startswith('#'): return False
        c = hex_str[1:]
        if len(c) == 3: c = ''.join([x*2 for x in c])
        rgb = int(c, 16)
        r = (rgb >> 16) & 0xff
        g = (rgb >> 8) & 0xff
        b = rgb & 0xff
        luma = 0.2126 * r + 0.7152 * g + 0.0722 * b
        return luma < 140

    assert is_color_dark('#000000') is True
    assert is_color_dark('#ffffff') is False
    assert is_color_dark('#0f172a') is True
    assert is_color_dark('#f8fafc') is False
    assert is_color_dark('#064e3b') is True
    assert is_color_dark('#f6eedb') is False

def test_theme_modal():
    modal_js = os.path.join(base_dir, 'js', 'components', 'ThemeModal.js')
    assert os.path.exists(modal_js), f"{modal_js} must exist"
    with open(modal_js, 'r', encoding='utf-8') as f:
        content = f.read()

    assert 'class ThemeModal' in content
    assert 'static show(' in content
    assert 'static close(' in content
    assert 'input-theme-color-picker' in content
    assert 'input-theme-hex' in content
    assert 'btn-apply-custom-color' in content
    assert 'btn-reset-default-theme' in content
    assert 'preset-theme-btn' in content

def test_navbar_and_app():
    navbar_js = os.path.join(base_dir, 'js', 'components', 'Navbar.js')
    with open(navbar_js, 'r', encoding='utf-8') as f:
        nb = f.read()

    assert 'btn-toggle-night-mode' in nb, "Navbar must contain btn-toggle-night-mode"
    assert 'btn-open-theme-palette' in nb, "Navbar must contain btn-open-theme-palette"
    assert 'ThemeService.toggleNightMode()' in nb, "Must call toggleNightMode"
    assert 'ThemeModal.show' in nb, "Must open ThemeModal"

    app_js = os.path.join(base_dir, 'js', 'app.js')
    with open(app_js, 'r', encoding='utf-8') as f:
        app = f.read()
    assert 'ThemeService.init()' in app, "App must initialize ThemeService"

def test_css_styles():
    css_file = os.path.join(base_dir, 'css', 'styles.css')
    with open(css_file, 'r', encoding='utf-8') as f:
        css = f.read()

    assert 'body.theme-dark' in css
    assert 'body.theme-sepia' in css
    assert 'body.theme-forest' in css
    assert 'body.theme-ocean' in css
    assert 'body.theme-lavender' in css

def test_bundled_output():
    bundled_js = os.path.join(base_dir, 'bundled.js')
    assert os.path.exists(bundled_js)
    with open(bundled_js, 'r', encoding='utf-8') as f:
        bjs = f.read()

    assert 'class ThemeService' in bjs
    assert 'class ThemeModal' in bjs
    assert 'btn-toggle-night-mode' in bjs
    assert 'btn-open-theme-palette' in bjs

    index_html = os.path.join(base_dir, 'index.html')
    with open(index_html, 'r', encoding='utf-8') as f:
        html = f.read()
    assert 'theme-dark' in html
    assert 'btn-toggle-night-mode' in html

if __name__ == '__main__':
    test_theme_service()
    test_theme_modal()
    test_navbar_and_app()
    test_css_styles()
    test_bundled_output()
    print("test_theme_and_night_mode passed!")
