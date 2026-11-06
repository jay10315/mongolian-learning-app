import json

with open('js/data/declensionQuizzes.js', 'r', encoding='utf-8') as f:
    text = f.read()

start = text.find('[')
end = text.rfind(']')
data = json.loads(text[start:end+1])

verb_quizzes = [q for q in data if q.get('kind') == 'verb']

with open('verb_quizzes_audit.json', 'w', encoding='utf-8') as f:
    json.dump({'count': len(verb_quizzes), 'quizzes': verb_quizzes}, f, ensure_ascii=False, indent=2)

print("Verb quizzes count:", len(verb_quizzes))
