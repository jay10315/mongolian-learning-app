# -*- coding: utf-8 -*-
"""
test_typing_feature.py
Verifies Mongolian Cyrillic typing mode:
1. Random sentence mode vs Custom registered sentence mode
2. 3 typing styles:
   - Mode 1: Mongolian typing (type_mn)
   - Mode 2: Japanese translation typing (type_ja)
   - Mode 3: Faint trace typing with instant word tapping & saving (trace_mn)
3. Free mode switching on any sentence (including custom sentences)
4. Word tapping dictionary lookup & instant saving to looked-up words notebook
5. Immediate Japanese translation card reveal on sentence completion
"""
import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

print("[1] Verifying typingSentences.js data...")
with open('js/data/typingSentences.js', 'r', encoding='utf-8') as f:
    sentences_content = f.read()

assert "initialTypingSentences" in sentences_content, "initialTypingSentences must be exported"

sentence_ids = re.findall(r'id:\s*"([^"]+)"', sentences_content)
print(f"  Found {len(sentence_ids)} typing practice sentences.")
assert len(sentence_ids) >= 20, f"Expected at least 20 typing sentences, found {len(sentence_ids)}"

# Verify categories
assert '"beginner"' in sentences_content, "Must have beginner category"
assert '"daily"' in sentences_content, "Must have daily conversation category"
assert '"culture"' in sentences_content, "Must have traditional culture category"
assert '"proverbs"' in sentences_content, "Must have proverbs category"

# Verify all sentences have textMn, textJa, romaji, explanation, and glossary
assert "textMn:" in sentences_content, "Sentences must have Mongolian text"
assert "textJa:" in sentences_content, "Sentences must have Japanese translation"
assert "romaji:" in sentences_content, "Sentences must have Romaji phonetic guide"
assert "explanation:" in sentences_content, "Sentences must have grammar/cultural explanation"
assert "glossary:" in sentences_content, "Sentences must have glossary entries"

print("[2] Verifying typing methods in storage.js...")
with open('js/services/storage.js', 'r', encoding='utf-8') as f:
    storage_content = f.read()

assert "TYPING_SENTENCES:" in storage_content, "STORAGE_KEYS must include TYPING_SENTENCES"
assert "CUSTOM_TYPING_SENTENCES:" in storage_content, "STORAGE_KEYS must include CUSTOM_TYPING_SENTENCES"
assert "getTypingSentences" in storage_content, "StorageService must have getTypingSentences"
assert "saveTypingSentences" in storage_content, "StorageService must have saveTypingSentences"
assert "getCustomTypingSentences" in storage_content, "StorageService must have getCustomTypingSentences"
assert "saveCustomTypingSentences" in storage_content, "StorageService must have saveCustomTypingSentences"
assert "addOrUpdateCustomTypingSentence" in storage_content, "StorageService must have addOrUpdateCustomTypingSentence"
assert "deleteCustomTypingSentence" in storage_content, "StorageService must have deleteCustomTypingSentence"
assert "saveLookedUpWord" in storage_content, "StorageService must have saveLookedUpWord"
assert "getLookedUpWords" in storage_content, "StorageService must have getLookedUpWords"
assert "isWordLookedUp" in storage_content, "StorageService must have isWordLookedUp"

print("[3] Verifying TypingTestComponent in TypingTest.js...")
with open('js/components/TypingTest.js', 'r', encoding='utf-8') as f:
    comp_content = f.read()

assert "TypingTestComponent" in comp_content, "TypingTestComponent class must exist"
assert "renderSettings" in comp_content, "Must have renderSettings"
assert "renderTyping" in comp_content, "Must have renderTyping"
assert "renderCustomManager" in comp_content, "Must have renderCustomManager for custom sentences"
assert "handleWordTap" in comp_content, "Must have handleWordTap for dictionary lookup"
assert "showWordModal" in comp_content, "Must have showWordModal for word explanation"
assert "renderLookedUpWords" in comp_content, "Must have renderLookedUpWords for saved words"
assert "clickable-word" in comp_content, "Words must be clickable"
assert "checkCharMatch" in comp_content, "Must check keystroke matches"
assert "checkJapaneseInput" in comp_content, "Must support Japanese translation typing check"
assert "onSentenceCompleted" in comp_content, "Must handle sentence completion"

# User requirement 1: "ランダムな文章がでるものと、自分で登録した文章で出来るモードの二つを作って"
assert "btn-select-source" in comp_content, "Must provide source selection (random vs custom)"
assert "StorageService.getCustomTypingSentences()" in comp_content, "Must load custom sentences"
assert "StorageService.addOrUpdateCustomTypingSentence" in comp_content, "Must allow adding/updating custom sentences"
assert "StorageService.deleteCustomTypingSentence" in comp_content, "Must allow deleting custom sentences"

# User requirement 2: 3 modes:
# a) モンゴル語をタイピングする問題
# b) 日本語訳をタイピングするもの
# c) 薄地のモンゴル語をタイピングしてなぞっていき、わからない単語を則タップで見れ調べた単語として保存されるもの
assert "薄地なぞり打ち" in comp_content, "Must implement faint trace typing mode"
assert "モンゴル語タイピング" in comp_content or "モンゴル語打鍵" in comp_content, "Must implement Mongolian typing mode"
assert "日本語訳タイピング" in comp_content or "日本語訳打鍵" in comp_content, "Must implement Japanese typing mode"

# User requirement 3: "自分で登録した文章に関しては、その三つのモードを好きに切り替えられるようにしてほしい"
assert "btn-switch-typing-mode" in comp_content, "Must provide instant mode switching pills"

# User requirement 4: "一文終えたらその和訳が出るようにもしてほしい"
assert "sentence-completion-card" in comp_content, "Must render sentence completion card"
assert "sentence.textJa" in comp_content, "Must display Japanese translation on completion"
assert "日本語訳" in comp_content, "Must clearly label Japanese translation"
assert "btn-next-sentence" in comp_content, "Must allow advancing to next sentence"

# User requirement 5: "わからない単語はタップしたら解説が出て、調べた単語として保存されるように"
assert "saveLookedUpWord" in comp_content, "Must save tapped words to looked up notebook"
assert "findWordInDictionary" in comp_content, "Must look up word meaning & grammar structure"
assert "badge-typing-lookup" in comp_content, "Must show looked up words badge count"

print("[4] Verifying App & Navigation Integration...")
with open('js/app.js', 'r', encoding='utf-8') as f:
    app_content = f.read()
assert "TypingTestComponent" in app_content, "app.js must import TypingTestComponent"
assert "case 'typing_test':" in app_content, "app.js must route typing_test"

with open('js/components/Navbar.js', 'r', encoding='utf-8') as f:
    nav_content = f.read()
assert "typing_test" in nav_content, "Navbar.js must include typing_test tab"

with open('js/components/Home.js', 'r', encoding='utf-8') as f:
    home_content = f.read()
assert 'data-target="typing_test"' in home_content, "Home.js must include typing_test card"

with open('build_standalone.py', 'r', encoding='utf-8') as f:
    build_content = f.read()
assert "'js/data/typingSentences.js'" in build_content, "build_standalone.py must include typingSentences.js"
assert "'js/components/TypingTest.js'" in build_content, "build_standalone.py must include TypingTest.js"

print("Typing Feature Verification PASSED!")
