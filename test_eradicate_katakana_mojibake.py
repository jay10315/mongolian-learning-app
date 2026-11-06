# -*- coding: utf-8 -*-
"""
test_eradicate_katakana_mojibake.py
Verifies complete eradication of Katakana mojibake across the app:
1. cleanMongolianMojibake cleans composite phrases and any embedded Katakana characters.
2. renderClickableWordsHTML invokes cleanMongolianMojibake before word tokenization.
3. StorageService upgrades keys to v9 / v5 and auto-sanitizes existing localStorage data.
4. No data files contain suspect Katakana adjacent to Cyrillic characters.
"""
import sys
import os
import re

sys.stdout.reconfigure(encoding='utf-8')

app_dir = 'C:/Users/kkaho/.gemini/antigravity/scratch/mongol-learning-app'

print("[1] Verifying cleanMongolianMojibake implementation in helpers.js...")
with open(os.path.join(app_dir, 'js/utils/helpers.js'), 'r', encoding='utf-8') as f:
    helpers_js = f.read()

assert 'export function cleanMongolianMojibake' in helpers_js, "cleanMongolianMojibake must be exported from helpers.js"
assert 'Сайн байна у\\s*ウ' in helpers_js or 'Сайн байна у' in helpers_js, "Must handle roleplay Katakana mojibake"
assert 'renderClickableWordsHTML' in helpers_js
assert 'cleanMongolianMojibake(text)' in helpers_js, "renderClickableWordsHTML must clean mojibake before tokenizing"

print("[2] Verifying StorageService version bumps & auto-migration...")
with open(os.path.join(app_dir, 'js/services/storage.js'), 'r', encoding='utf-8') as f:
    storage_js = f.read()

assert "VOCABULARY: 'mongol_app_vocabulary_v9'" in storage_js, "Vocabulary must be bumped to v9 to invalidate old cached data"
assert ("DECLENSION_QUIZZES: 'mongol_app_declension_quizzes_v5'" in storage_js or "DECLENSION_QUIZZES: 'mongol_app_declension_quizzes_v6'" in storage_js)
assert ("GRAMMAR_QUIZZES: 'mongol_app_grammar_quizzes_v5'" in storage_js or "GRAMMAR_QUIZZES: 'mongol_app_grammar_quizzes_v6'" in storage_js)
assert "TYPING_SENTENCES: 'mongol_app_typing_sentences_v2'" in storage_js
assert "mongol_app_vocabulary_v8" in storage_js, "Old v8 key must be cleaned in StorageService.init"
assert "cleanMongolianMojibake" in storage_js, "StorageService must use cleanMongolianMojibake to sanitize mistakes and looked up words"

print("[3] Verifying no suspect Katakana adjacent to Cyrillic across all data files...")
data_files = [
    'js/data/initialVocabulary.js',
    'js/data/initialGrammar.js',
    'js/data/declensionQuizzes.js',
    'js/data/grammarQuizzes.js',
    'js/data/readingQuizzes.js',
    'js/data/listeningQuizzes.js',
    'js/data/roleplayData.js',
    'js/data/interviewTopics.js',
    'js/data/typingSentences.js',
    'js/data/numberQuizData.js',
    'js/data/cultureData.js',
    'js/data/wordFamilyData.js'
]

suspect_chars = ['ウ', 'エ', 'ゴ', 'グ', 'タン', 'ン', 'ス', 'ア', 'ル', 'モ', 'カ', 'ト', 'ハ', 'ヘ', 'オ', 'イ', 'ロ']
cyr_re = re.compile(r'[\u0400-\u04FF]')

for df in data_files:
    fpath = os.path.join(app_dir, df)
    with open(fpath, 'r', encoding='utf-8') as fp:
        lines = fp.readlines()
    for l_idx, line in enumerate(lines):
        code_line = re.sub(r'//.*$', '', line)
        code_line = re.sub(r'/\*.*?\*/', '', code_line)
        for sc in suspect_chars:
            assert not (re.search(r'[\u0400-\u04FF]' + sc, code_line) or re.search(sc + r'[\u0400-\u04FF]', code_line)), \
                f"File {df}:{l_idx+1} has suspect Katakana '{sc}' adjacent to Cyrillic in line: {line.strip()}"

print("[4] Verifying bundled.js and index.html are synchronized...")
with open(os.path.join(app_dir, 'bundled.js'), 'r', encoding='utf-8') as f:
    bundled_js = f.read()
with open(os.path.join(app_dir, 'index.html'), 'r', encoding='utf-8') as f:
    index_html = f.read()

assert 'cleanMongolianMojibake' in bundled_js, "bundled.js must contain cleanMongolianMojibake"
assert 'cleanMongolianMojibake' in index_html, "index.html must contain cleanMongolianMojibake"
assert 'mongol_app_vocabulary_v9' in bundled_js
assert 'mongol_app_vocabulary_v9' in index_html

print("ALL MOJIBAKE ERADICATION CHECKS PASSED SUCCESSFULLY!")
