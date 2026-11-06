# -*- coding: utf-8 -*-
"""
test_reading_feature.py
Verifies reading comprehension quizzes, interactive word tapping, dictionary lookup,
and "looked-up words" persistence.
"""
import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

print("[1] Verifying readingQuizzes.js data...")
with open('js/data/readingQuizzes.js', 'r', encoding='utf-8') as f:
    quizzes_content = f.read()

assert "initialReadingQuizzes" in quizzes_content, "initialReadingQuizzes must be exported"

passage_titles = re.findall(r'titleMn:\s*"([^"]+)"', quizzes_content)
print(f"  Found {len(passage_titles)} reading passages: {passage_titles}")
assert len(passage_titles) >= 5, f"Expected at least 5 reading passages, got {len(passage_titles)}"

# Verify all passages have questions, glossaries, textMn, textJa
assert "questions:" in quizzes_content, "Must contain comprehension questions"
assert "glossary:" in quizzes_content, "Must contain glossaries"
assert "textMn:" in quizzes_content, "Must contain Mongolian text"
assert "textJa:" in quizzes_content, "Must contain Japanese translation"

print("[2] Verifying findWordInDictionary in helpers.js...")
with open('js/utils/helpers.js', 'r', encoding='utf-8') as f:
    helpers_content = f.read()

assert "export function findWordInDictionary" in helpers_content, "findWordInDictionary must be exported from helpers.js"
assert "nounSuffixes" in helpers_content, "Must support noun suffix stripping"
assert "verbSuffixes" in helpers_content, "Must support verb suffix stripping"

print("[3] Verifying looked-up words methods in storage.js...")
with open('js/services/storage.js', 'r', encoding='utf-8') as f:
    storage_content = f.read()

assert "LOOKED_UP_WORDS:" in storage_content, "STORAGE_KEYS must include LOOKED_UP_WORDS"
assert "getLookedUpWords" in storage_content, "StorageService must have getLookedUpWords"
assert "saveLookedUpWord" in storage_content, "StorageService must have saveLookedUpWord"
assert "deleteLookedUpWord" in storage_content, "StorageService must have deleteLookedUpWord"
assert "isWordLookedUp" in storage_content, "StorageService must have isWordLookedUp"
assert "getReadingQuizzes" in storage_content, "StorageService must have getReadingQuizzes"

print("[4] Verifying ReadingTestComponent in ReadingTest.js...")
with open('js/components/ReadingTest.js', 'r', encoding='utf-8') as f:
    comp_content = f.read()

assert "ReadingTestComponent" in comp_content, "ReadingTestComponent class must exist"
assert "renderList" in comp_content, "Must have renderList"
assert "renderPassage" in comp_content, "Must have renderPassage"
assert "handleWordTap" in comp_content, "Must have handleWordTap"
assert "showWordModal" in comp_content, "Must have showWordModal"
assert "renderLookedUpWords" in comp_content, "Must have renderLookedUpWords (調べた単語帳)"
assert "clickable-word" in comp_content, "Must mark words with clickable-word class"
assert "btn-play-full-audio" in comp_content, "Must provide audio playback for passages"
assert "btn-toggle-translation" in comp_content, "Must provide Japanese translation toggle"

print("[5] Verifying navigation and app wiring...")
with open('js/app.js', 'r', encoding='utf-8') as f:
    app_content = f.read()
assert "ReadingTestComponent" in app_content, "app.js must import ReadingTestComponent"
assert "case 'reading_test':" in app_content, "app.js must route reading_test"

with open('js/components/Navbar.js', 'r', encoding='utf-8') as f:
    navbar_content = f.read()
assert "reading_test" in navbar_content, "Navbar.js must have reading_test tab"

with open('js/components/Home.js', 'r', encoding='utf-8') as f:
    home_content = f.read()
assert 'data-target="reading_test"' in home_content, "Home.js must have reading_test card"

print("[6] Verifying bundled.js in standalone app...")
with open('bundled.js', 'r', encoding='utf-8') as f:
    bundled_content = f.read()

assert "ReadingTestComponent" in bundled_content, "bundled.js must contain ReadingTestComponent"
assert "initialReadingQuizzes" in bundled_content, "bundled.js must contain initialReadingQuizzes"
assert "findWordInDictionary" in bundled_content, "bundled.js must contain findWordInDictionary"

print(">>> ALL TESTS IN test_reading_feature.py PASSED! <<<")
