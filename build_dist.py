import os, shutil, sys

sys.stdout.reconfigure(encoding='utf-8')
base_dir = r"C:\Users\kkaho\.gemini\antigravity\scratch\mongol-learning-app"
os.chdir(base_dir)

dist_dir = os.path.join(base_dir, 'dist')
os.makedirs(dist_dir, exist_ok=True)

files_to_copy = [
    'index.html',
    'bundled.js',
    'sw.js',
    'manifest.json',
    'icon-192.svg',
    'icon-512.svg',
    'apple-touch-icon.png',
    'favicon.ico',
    'robots.txt',
    'audio_map.json',
    'audio_phrases.json'
]

for f in files_to_copy:
    src = os.path.join(base_dir, f)
    dst = os.path.join(dist_dir, f)
    if os.path.exists(src):
        shutil.copy2(src, dst)
        print(f"Copied {f} -> dist/")

for folder in ['css', 'js', 'data']:
    src_f = os.path.join(base_dir, folder)
    dst_f = os.path.join(dist_dir, folder)
    if os.path.exists(src_f):
        shutil.copytree(src_f, dst_f, dirs_exist_ok=True)
        print(f"Copied folder {folder} -> dist/")

print("dist build completed successfully!")
