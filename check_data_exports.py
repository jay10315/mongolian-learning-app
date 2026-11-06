import os, sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

app_dir = r'C:\Users\kkaho\.gemini\antigravity\scratch\mongol-learning-app\js\data'
for f in os.listdir(app_dir):
    p = os.path.join(app_dir, f)
    with open(p, 'r', encoding='utf-8') as fp:
        lines = [fp.readline() for _ in range(5)]
    first_few = " ".join([l.strip() for l in lines])
    print(f"{f}: {first_few[:90]}")
