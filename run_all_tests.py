import subprocess, sys, time, os

base_dir = os.path.dirname(os.path.abspath(__file__))

tests = [
    'test_origin_safety.py',
    'test_spelling_corrections.py',
    'test_review_notebook_no_spoiler.py',
    'test_game_manual_finish_and_number.py',
    'test_game_genres.py',
    'test_gamification_penguin.py',
    'test_penguin_growth.py',
    'test_verb_stem_requirements.py',
    'test_app_scenarios.py',
    'test_derivations.py',
    'test_japanese_test.py',
    'test_clean_non_verbs.py',
    'test_visual_and_fixes.py',
    'test_speech_verify.py',
    'test_collapsible_hints.py',
    'test_auth_normalization.py',
    'test_result_question_lists.py',
    'test_start_challenge_button.py',
    'test_no_jica_or_lesson_notations.py',
    'test_tablet_compatibility.py',
    'test_magic_login_and_multi_device.py',
    'test_penguin_sunglasses_and_drop_game.py',
    'test_declension_meaning_fix.py',
    'test_listening_feature.py',
    'test_reading_feature.py',
    'test_typing_feature.py',
    'test_unified_sync_and_review.py',
    'test_audio_batch_feature.py',
    'test_pronunciation_feature.py',
    'test_hidden_letters_feature.py',
    'test_all_new_modes.py',
    'test_spelling_game_feature.py',
    'test_synonym_tea_match.py',
    'test_word_family_games.py',
    'test_suffix_rule_dojo.py',
    'test_theme_and_night_mode.py',
    'test_expedition_map_all_aimags.py',
    'test_user_notes_added.py',
    'test_pdf_grammar_supplement.py',
    'test_textbook_comprehensive_integration.py',
    'test_interview_master_feature.py',
    'test_genre_vocab_and_mode.py',
    'test_cross_device_sync.py',
    'test_etymology_master.py',
    'test_pronunciation_caution_display.py',
    'test_railway_sugoroku_feature.py',
    'test_user_requested_expressions.py',
    'test_night_mode_feedback.py',
    'test_compound_etymology_display.py',
    'test_mnemonic_display.py',
    'test_night_mode_comprehensive.py',
    'test_native_mongolian_replacements.py',
    'test_interview_typing_drill.py',
    'test_word_illustrations_feature.py',
    'test_choice_explanations_feature.py',
    'test_similar_words_distinctions_feature.py',
    'test_declension_mojibake_fix.py',
    'test_all_mistakes_unified_recording.py',
    'test_all_recent_feedback_fixes.py',
    'test_all_tests_mistakes_review.py',
    'test_sentence_translation_test.py',
    'test_six_image_issues.py'
]

for t in tests:
    t0 = time.time()
    res = subprocess.run([sys.executable, os.path.join(base_dir, t)], capture_output=True, text=True, encoding='utf-8', cwd=base_dir)
    dt = time.time() - t0
    if res.returncode == 0:
        print(f"[PASS] {t} ({dt:.2f}s)", flush=True)
    else:
        print(f"[FAIL] {t} ({dt:.2f}s)", flush=True)
        print(res.stdout, flush=True)
        print(res.stderr, flush=True)
        sys.exit(1)

print("\n>>> ALL TESTS COMPLETED SUCCESSFULLY! <<<", flush=True)
