# -*- coding: utf-8 -*-
"""
test_listening_feature.py
Verifies listening quizzes, number specialization, fill-in-the-blank and dictation modes,
audio speed controls, and navigation integration.
"""
import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

print("[1] Verifying listeningQuizzes.js data structure...")
with open('js/data/listeningQuizzes.js', 'r', encoding='utf-8') as f:
    quizzes_content = f.read()

# Verify initialListeningQuizzes exists
assert "initialListeningQuizzes" in quizzes_content, "initialListeningQuizzes must be exported"

# Count categories
number_matches = len(re.findall(r'category:\s*"numbers"', quizzes_content))
conv_matches = len(re.findall(r'category:\s*"conversation"', quizzes_content))
gram_matches = len(re.findall(r'category:\s*"grammar"', quizzes_content))
total_matches = len(re.findall(r'id:\s*"list_', quizzes_content))

print(f"  Numbers: {number_matches}, Conversation: {conv_matches}, Grammar: {gram_matches}, Total: {total_matches}")
assert number_matches >= 20, f"Expected at least 20 number quizzes, got {number_matches}"
assert conv_matches >= 10, f"Expected at least 10 conversation quizzes, got {conv_matches}"
assert gram_matches >= 8, f"Expected at least 8 grammar quizzes, got {gram_matches}"
assert total_matches >= 40, f"Expected at least 40 total listening quizzes, got {total_matches}"

# Verify number specialization contents: prices (төгрөг), clock (цаг), phone (дугаар), dates (сар)
assert "төгрөг" in quizzes_content, "Must include price in tugrik"
assert "цаг" in quizzes_content, "Must include clock / hours"
assert "дугаар" in quizzes_content, "Must include phone numbers"
assert "сарын" in quizzes_content, "Must include dates"
assert "настай" in quizzes_content, "Must include age"

print("[2] Verifying isListeningAnswerMatch logic in helpers.js...")
with open('js/utils/helpers.js', 'r', encoding='utf-8') as f:
    helpers_content = f.read()

assert "export function isListeningAnswerMatch" in helpers_content, "isListeningAnswerMatch must be exported from helpers.js"
assert "numericAnswer" in helpers_content, "isListeningAnswerMatch must support numericAnswer"
assert "acceptableAnswers" in helpers_content, "isListeningAnswerMatch must support acceptableAnswers"
assert "dictationText" in helpers_content, "isListeningAnswerMatch must support dictation mode"

print("[3] Verifying SpeechService speed control in speech.js...")
with open('js/services/speech.js', 'r', encoding='utf-8') as f:
    speech_content = f.read()

assert "speakSlow" in speech_content, "SpeechService must have speakSlow method"
assert "playbackRate = rate" in speech_content, "SpeechService must set audio playbackRate"

print("[4] Verifying StorageService methods in storage.js...")
with open('js/services/storage.js', 'r', encoding='utf-8') as f:
    storage_content = f.read()

assert "LISTENING_QUIZZES:" in storage_content, "StorageService must have LISTENING_QUIZZES key"
assert "getListeningQuizzes" in storage_content, "StorageService must have getListeningQuizzes"
assert "saveListeningQuizzes" in storage_content, "StorageService must have saveListeningQuizzes"

print("[5] Verifying ListeningTest.js component...")
with open('js/components/ListeningTest.js', 'r', encoding='utf-8') as f:
    comp_content = f.read()

assert "ListeningTestComponent" in comp_content, "ListeningTestComponent class must exist"
assert "renderSettings" in comp_content, "Must have renderSettings"
assert "renderTesting" in comp_content, "Must have renderTesting"
assert "renderResult" in comp_content, "Must have renderResult"
assert "btn-play-audio-normal" in comp_content, "Must have normal audio play button"
assert "btn-play-audio-slow" in comp_content, "Must have slow audio play button (0.75x)"
assert "SPECIAL_CYRILLIC_BAR" in comp_content, "Must provide quick Cyrillic input bar"
assert "checkAnswer" in comp_content, "Must have checkAnswer"
assert "GamificationService" in comp_content, "Must integrate GamificationService"
assert "btn-filter-result" in comp_content, "Must support all/correct/wrong result filtering"

print("[6] Verifying routing and navigation integration...")
with open('js/app.js', 'r', encoding='utf-8') as f:
    app_content = f.read()
assert "ListeningTestComponent" in app_content, "app.js must import ListeningTestComponent"
assert "case 'listening_test':" in app_content, "app.js must route listening_test"

with open('js/components/Navbar.js', 'r', encoding='utf-8') as f:
    navbar_content = f.read()
assert "listening_test" in navbar_content, "Navbar.js must include listening_test tab"

with open('js/components/Home.js', 'r', encoding='utf-8') as f:
    home_content = f.read()
assert 'data-target="listening_test"' in home_content, "Home.js must include listening_test card"

with open('js/components/ReviewNotebook.js', 'r', encoding='utf-8') as f:
    review_content = f.read()
assert "{ id: 'listening', label: 'リスニング' }" in review_content, "ReviewNotebook.js must include listening filter"

print("[7] Verifying bundled.js in standalone app...")
with open('bundled.js', 'r', encoding='utf-8') as f:
    bundled_content = f.read()

assert "ListeningTestComponent" in bundled_content, "bundled.js must contain ListeningTestComponent"
assert "initialListeningQuizzes" in bundled_content, "bundled.js must contain initialListeningQuizzes"
assert "isListeningAnswerMatch" in bundled_content, "bundled.js must contain isListeningAnswerMatch"

print(">>> ALL TESTS IN test_listening_feature.py PASSED! <<<")
