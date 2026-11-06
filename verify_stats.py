import re

with open(r'C:\Users\kkaho\.gemini\antigravity\scratch\mongol-learning-app\js\data\initialVocabulary.js', 'r', encoding='utf-8') as f:
    text = f.read()

v_matches = re.findall(r'"id":\s*[\'"]([^\'"]+)[\'"]', text)
print(f"Total vocabulary items in bundle: {len(v_matches)}")

with open(r'C:\Users\kkaho\.gemini\antigravity\scratch\mongol-learning-app\js\data\initialGrammar.js', 'r', encoding='utf-8') as f:
    g_text = f.read()
g_matches = re.findall(r'"id":\s*[\'"]([^\'"]+)[\'"]', g_text)
print(f"Total grammar items in bundle: {len(g_matches)}")

with open(r'C:\Users\kkaho\.gemini\antigravity\scratch\mongol-learning-app\js\data\grammarQuizzes.js', 'r', encoding='utf-8') as f:
    q_text = f.read()
q_matches = re.findall(r'"id":\s*[\'"]([^\'"]+)[\'"]', q_text)
print(f"Total grammar quizzes in bundle: {len(q_matches)}")
