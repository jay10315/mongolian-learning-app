import os, re

base_dir = r"C:\Users\kkaho\.gemini\antigravity\scratch\mongol-learning-app"

def read_f(rel):
    with open(os.path.join(base_dir, rel.replace('/', os.sep)), 'r', encoding='utf-8') as f:
        return f.read()

# 読み込むファイル順序（依存関係順）
files_order = [
    'js/utils/helpers.js',
    'js/data/initialVocabulary.js',
    'js/data/initialGrammar.js',
    'js/data/grammarQuizzes.js',
    'js/data/declensionQuizzes.js',
    'js/data/illustrationQuizzes.js',
    'js/data/listeningQuizzes.js',
    'js/data/readingQuizzes.js',
    'js/data/typingSentences.js',
    'js/data/pronunciationData.js',
    'js/data/roleplayData.js',
    'js/data/numberQuizData.js',
    'js/data/cultureData.js',
    'js/data/wordFamilyData.js',
    'js/data/expeditionData.js',
    'js/services/srs.js',
    'js/services/auth.js',
    'js/services/sync.js',
    'js/services/storage.js',
    'js/services/speech.js',
    'js/services/parser.js',
    'js/components/PenguinMascot.js',
    'js/services/gamification.js',
    'js/components/CyrillicKeyboard.js',
    'js/components/AuthModal.js',
    'js/components/CloudSettingsModal.js',
    'js/components/BatchAudioModal.js',
    'js/components/Navbar.js',
    'js/components/Home.js',
    'js/components/WordGame.js',
    'js/components/WordTest.js',
    'js/components/JapaneseTest.js',
    'js/components/GrammarTest.js',
    'js/components/DeclensionTest.js',
    'js/components/ListeningTest.js',
    'js/components/ReadingTest.js',
    'js/components/TypingTest.js',
    'js/components/PronunciationTest.js',
    'js/components/RoleplayTest.js',
    'js/components/NumberMasterTest.js',
    'js/components/ShadowingDictationTest.js',
    'js/components/CultureQuiz.js',
    'js/components/WordFamilyQuiz.js',
    'js/components/PenguinExpedition.js',
    'js/components/Flashcards.js',
    'js/components/ReviewNotebook.js',
    'js/components/MaterialManager.js',
    'js/components/ReferenceGuide.js',
    'js/app.js'
]

combined_js = []

for rel in files_order:
    code = read_f(rel)
    # import 文を除去
    code = re.sub(r'import\s+[\s\S]*?from\s+[\'"][^\'"]+[\'"];?', '', code)
    # export default または export const / export class / export function から export を除去
    code = re.sub(r'export\s+(default\s+)?(const|let|var|class|function)\s+', r'\2 ', code)
    code = re.sub(r'export\s*\{[\s\S]*?\};?', '', code)
    combined_js.append(f"// === {rel} ===\n" + code)

all_js = "\n\n".join(combined_js)

css_content = read_f('css/styles.css')

html_template = f"""<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <meta name="theme-color" content="#059669">
  <meta name="description" content="モンゴル語の単語・文法・格変化・活用を効率よく学べるWebアプリ">
  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
  <meta http-equiv="Pragma" content="no-cache">
  <meta http-equiv="Expires" content="0">
  
  <script>
    // タブレットやスマホでのエラー発生時に画面上に診断情報を表示（手動で閉じられるUI）
    window.addEventListener('error', function(e) {{
      var msg = e.message || (e.error && e.error.message) || String(e);
      console.error('Mobile Global Error:', msg);
      if (document.body && !document.getElementById('mobile-debug-alert')) {{
        var d = document.createElement('div');
        d.id = 'mobile-debug-alert';
        d.style.cssText = 'position:fixed;bottom:0;left:0;right:0;background:#fee2e2;color:#991b1b;padding:10px 14px;font-size:12px;z-index:999999;border-top:2px solid #ef4444;font-family:sans-serif;word-break:break-all;display:flex;align-items:center;justify-content:space-between;box-shadow:0 -4px 12px rgba(0,0,0,0.15);';
        d.innerHTML = '<span style="flex:1;margin-right:8px;"><strong>⚠️ エラー検知:</strong> ' + String(msg).replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</span><button onclick="this.parentElement.remove()" style="background:#ef4444;color:white;border:none;border-radius:6px;padding:4px 10px;cursor:pointer;font-size:11px;font-weight:bold;white-space:nowrap;">✕ 閉じる</button>';
        document.body.appendChild(d);
      }}
    }});

    // 完全オフライン・圏外対応 PWA Service Worker 登録
    try {{
      var isSecureEnv = typeof window !== 'undefined' && (
        window.location.protocol === 'https:' ||
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1'
      );
      if (isSecureEnv && 'serviceWorker' in navigator) {{
        window.addEventListener('load', function() {{
          navigator.serviceWorker.register('./sw.js').then(function(reg) {{
            console.log('[PWA] ServiceWorker registered:', reg.scope);
          }}).catch(function(err) {{
            console.warn('[PWA] ServiceWorker registration warning:', err);
          }});
        }});
      }} else if (!isSecureEnv && 'serviceWorker' in navigator && navigator.serviceWorker.getRegistrations) {{
        // 非HTTPS LAN環境（192.168.x.x）ではSecurityError防止のため解除
        navigator.serviceWorker.getRegistrations().then(function(regs) {{
          if (regs) {{
            for (var i = 0; i < regs.length; i++) {{
              try {{ regs[i].unregister(); }} catch (_) {{}}
            }}
          }}
        }}).catch(function() {{}});
      }}
    }} catch (_) {{}}
  </script>
  
  <!-- iOS PWA対応 -->
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="default">
  <meta name="apple-mobile-web-app-title" content="モンゴル語ノート">
  <link rel="apple-touch-icon" href="./icon-192.svg">
  
  <link rel="manifest" href="./manifest.json">
  <title>Монгол хэл｜モンゴル語学習ノート</title>

  <!-- Tailwind CSS CDN（オンライン時） -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    if (typeof tailwind !== 'undefined') {{
      tailwind.config = {{
        theme: {{
          extend: {{
            colors: {{
              brand: {{
                50: '#ecfdf5',
                100: '#d1fae5',
                500: '#10b981',
                600: '#059669',
                700: '#047857',
              }}
            }}
          }}
        }}
      }}
    }}
  </script>

  <!-- アプリ独自スタイル（オフライン・ローカルでも完全動作） -->
  <style>
{css_content}
  </style>
</head>
<body class="bg-slate-50 text-slate-800 min-h-screen flex flex-col antialiased selection:bg-emerald-100 selection:text-emerald-900">

  <!-- ヘッダーコンテナ -->
  <div id="app-header"></div>

  <!-- メインコンテンツ領域 -->
  <main id="main-content" class="flex-1 w-full pb-16 md:pb-8"></main>

  <!-- スマホ用ボトム固定ナビゲーション -->
  <div id="mobile-bottom-nav"></div>

  <!-- アプリケーション本体スクリプト（完全自立型・CORS制限ゼロ） -->
  <script>
{all_js}
  </script>
</body>
</html>
"""

output_path = os.path.join(base_dir, "index.html")
with open(output_path, 'w', encoding='utf-8') as f:
    f.write(html_template)

print("index.html bundled successfully, size:", os.path.getsize(output_path))
