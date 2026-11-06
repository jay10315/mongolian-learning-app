import sys, os, glob, re
sys.stdout.reconfigure(encoding='utf-8')

components = [
    'NumberMasterTest.js',
    'DeclensionTest.js',
    'GrammarTest.js',
    'WordTest.js',
    'JapaneseTest.js',
    'ListeningTest.js',
    'ReadingTest.js',
    'WordGame.js',
    'GenreWordMaster.js',
    'WordFamilyQuiz.js',
    'CultureQuiz.js',
    'SpellingGame.js',
    'EtymologyMaster.js',
    'PronunciationTest.js',
    'ShadowingDictationTest.js',
    'TypingTest.js',
    'PenguinExpedition.js',
    'SuffixRuleDojo.js'
]

for c in components:
    p = os.path.join('js/components', c)
    if not os.path.exists(p):
        print(f"NOT FOUND: {c}")
        continue
    content = open(p, encoding='utf-8').read()
    has_record = 'recordMistake' in content
    has_result_review = ('results.map' in content or 'wrongQuestions' in content or 'filteredResults' in content or 'filteredLog' in content or 'mistakes.map' in content or 'history.map' in content or 'result-review' in content or '出題問題' in content or '間違えた問題' in content or '内容理解テスト' in content)
    has_goto_review = ('review_notebook' in content or "onNavigate('review')" in content or '間違いノート' in content)
    print(f"{c:28} | recordMistake: {str(has_record):5} | resultReview: {str(has_result_review):5} | gotoReview: {str(has_goto_review):5}")
