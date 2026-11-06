import unittest
import os
import re

class TestAllRecentFeedbackFixes(unittest.TestCase):
    def test_no_katakana_lookalikes_in_data_and_components(self):
        """Verify that no stray Katakana lookalikes remain in Cyrillic texts"""
        targets = [
            'js/data/declensionQuizzes.js',
            'js/data/initialVocabulary.js',
            'js/data/interviewTopics.js',
            'js/data/roleplayData.js',
            'js/data/typingSentences.js',
            'js/components/ReferenceGuide.js',
            'js/components/RoleplayTest.js',
            'js/components/InterviewMaster.js',
            'bundled.js'
        ]
        forbidden = [
            'нүднээス', 'Сайн байна уウ', 'юм бエ', 'онゴцоор', 'өчиグдөр', 
            'халууン', 'タрган тавтай', 'ойроルцоо', 'хүスэж', 'үг хэлルэг',
            '-モор', '-ээス', 'авлаア', 'байна вエ'
        ]
        for t in targets:
            if not os.path.exists(t):
                continue
            with open(t, 'r', encoding='utf-8') as f:
                content = f.read()
            for bad in forbidden:
                self.assertNotIn(bad, content, f"Forbidden Katakana string '{bad}' found in {t}")

    def test_interview_uses_native_mongolian(self):
        """Verify criminology is translated to native Mongolian гэмт хэрэг судлал"""
        with open('js/data/interviewTopics.js', 'r', encoding='utf-8') as f:
            content = f.read()
        self.assertIn('Би их сургуульд гэмт хэрэг судлал сурсан.', content)
        self.assertNotIn('Би их сургуульд криминологи сурсан.', content)

    def test_roleplay_test_initial_translation_hidden_and_word_tapping(self):
        """Verify RoleplayTest has showTranslation: false initially and wraps words with renderClickableWordsHTML"""
        with open('js/components/RoleplayTest.js', 'r', encoding='utf-8') as f:
            content = f.read()
        self.assertIn('showTranslation: false', content)
        self.assertIn('renderClickableWordsHTML(step.npcText', content)
        self.assertIn('renderClickableWordsHTML(opt.text', content)
        self.assertIn('btn-toggle-rp-translation', content)
        self.assertIn('showUniversalWordModal', content)
        self.assertIn('StorageService.saveLookedUpWord', content)
        self.assertIn('e.stopPropagation()', content)

    def test_interview_master_initial_translation_hidden_and_word_tapping(self):
        """Verify InterviewMaster has showJapanese = false and wraps words in renderClickableWordsHTML"""
        with open('js/components/InterviewMaster.js', 'r', encoding='utf-8') as f:
            content = f.read()
        self.assertIn('static showJapanese = false;', content)
        self.assertIn('renderClickableWordsHTML(s.mn', content)
        self.assertIn('showUniversalWordModal', content)
        self.assertIn('StorageService.saveLookedUpWord', content)

    def test_home_and_reading_looked_up_words_testing(self):
        """Verify Home.js and ReadingTest.js have test triggers for looked up words"""
        with open('js/components/Home.js', 'r', encoding='utf-8') as f:
            home = f.read()
        self.assertIn('btn-start-looked-up-test', home)
        self.assertIn('data-target="looked_up_words"', home)
        self.assertIn('activeLookedUp', home)

        with open('js/app.js', 'r', encoding='utf-8') as f:
            app = f.read()
        self.assertIn("case 'looked_up_words':", app)
        self.assertIn("filterType = 'looked_up'", app)

        with open('js/components/ReadingTest.js', 'r', encoding='utf-8') as f:
            reading = f.read()
        self.assertIn('btn-test-looked-up-from-reading', reading)

    def test_declension_and_grammar_choices_breakdown(self):
        """Verify 4-choice questions provide renderChoiceExplanationsHTML and hint hiding"""
        with open('js/components/DeclensionTest.js', 'r', encoding='utf-8') as f:
            dec = f.read()
        self.assertIn('renderChoiceExplanationsHTML', dec)
        self.assertIn('btn-toggle-decl-hint', dec)
        self.assertIn('decl-hint-content', dec)

        with open('js/components/GrammarTest.js', 'r', encoding='utf-8') as f:
            gra = f.read()
        self.assertIn('renderChoiceExplanationsHTML', gra)

    def test_storage_sanitizes_declension_quizzes(self):
        """Verify StorageService.getDeclensionQuizzes automatically sanitizes Katakana lookalikes"""
        with open('js/services/storage.js', 'r', encoding='utf-8') as f:
            storage = f.read()
        self.assertIn('.replace(/ス/g, \'с\')', storage)
        self.assertIn('.replace(/ウ/g, \'у\')', storage)

if __name__ == '__main__':
    unittest.main()
