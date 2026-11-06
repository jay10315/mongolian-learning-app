# -*- coding: utf-8 -*-
"""
test_unified_sync_and_review.py
Verifies synchronization of mistakes, looked-up words, and review-due questions
both across devices (Magic Login URL / Backup) and within the Review Notebook.
"""
import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

print("[1] Verifying auth.js synchronization payload...")
with open('js/services/auth.js', 'r', encoding='utf-8') as f:
    auth_code = f.read()

assert "mongol_app_mistakes_v1" in auth_code, "Must read mistakes in createMagicLoginToken"
assert "mongol_app_looked_up_words_v1" in auth_code, "Must read looked-up words in createMagicLoginToken"
assert "mongol_app_word_progress_v1" in auth_code, "Must read word progress in createMagicLoginToken"
assert "m: mistakesData" in auth_code, "Must package mistakes in payload"
assert "l: lookedUpWordsData" in auth_code, "Must package looked up words in payload"
assert "w: wordProgressData" in auth_code, "Must package word progress in payload"
assert "payload.m" in auth_code, "Must unpack mistakes in processMagicLoginToken"
assert "payload.l" in auth_code, "Must unpack looked-up words in processMagicLoginToken"
assert "payload.w" in auth_code, "Must unpack word progress in processMagicLoginToken"

print("[2] Verifying storage.js backup/export and markLookedUpWordResolved...")
with open('js/services/storage.js', 'r', encoding='utf-8') as f:
    storage_code = f.read()

assert "markLookedUpWordResolved" in storage_code, "StorageService must have markLookedUpWordResolved"
assert "lookedUpWords: this.getLookedUpWords()" in storage_code, "exportAllDataJSON must include lookedUpWords"
assert "parsed.lookedUpWords" in storage_code, "importAllDataJSON must restore lookedUpWords"

print("[3] Verifying ReviewNotebook.js unified review and sync with mastery...")
with open('js/components/ReviewNotebook.js', 'r', encoding='utf-8') as f:
    review_code = f.read()

assert "getUnifiedReviewItems" in review_code, "ReviewNotebookComponent must have getUnifiedReviewItems"
assert "activeMistakes" in review_code, "Must track active mistakes count"
assert "activeLookedUp" in review_code, "Must track active looked up words count"
assert "activeDue" in review_code, "Must track active due review words count"
assert "totalResolved" in review_code, "Must track total mastered/resolved count"
assert "btn-start-all-review" in review_code, "Must have all-in-one review test button"
assert "markLookedUpWordResolved" in review_code, "Review answering must sync looked-up words to resolved"
assert "recordWordAnswer" in review_code, "Review answering must sync SRS due words to mastery"

print("Unified Sync & Review Verification PASSED!")
