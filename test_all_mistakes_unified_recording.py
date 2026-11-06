# test_all_mistakes_unified_recording.py
"""
Unit test verifying unified mistake recording and review across all non-vocabulary and vocabulary tests:
- GenreWordMaster
- WordGame
- ReadingTest
- WordFamilyQuiz
- CultureQuiz
- NumberMasterTest
- InterviewMaster
- SpellingGame
- EtymologyMaster
- PenguinExpedition
- GrammarTest & DeclensionTest
- ReviewNotebook parsing, filtering, and review testing
"""
import unittest
import os
import re

class TestAllMistakesUnifiedRecording(unittest.TestCase):
    def setUp(self):
        self.base_dir = os.path.dirname(os.path.abspath(__file__))

    def _read_file(self, rel_path):
        with open(os.path.join(self.base_dir, rel_path), 'r', encoding='utf-8') as f:
            return f.read()

    def test_genre_word_master_records_mistakes(self):
        content = self._read_file('js/components/GenreWordMaster.js')
        self.assertIn('StorageService.recordMistake', content, "GenreWordMaster must call StorageService.recordMistake on wrong answers")
        self.assertIn("type: 'word'", content)

    def test_word_game_auto_records_mistakes(self):
        content = self._read_file('js/components/WordGame.js')
        # Check that processAnswer automatically records mistakes
        self.assertIn('processAnswer(isCorrect, userText)', content)
        self.assertIn("type: 'grammar'", content)
        self.assertIn("StorageService.recordMistake", content)

    def test_reading_test_records_mistakes(self):
        content = self._read_file('js/components/ReadingTest.js')
        self.assertIn('StorageService.recordMistake', content, "ReadingTest must call StorageService.recordMistake on incorrect answers")
        self.assertIn("type: 'reading'", content)

    def test_word_family_quiz_records_mistakes(self):
        content = self._read_file('js/components/WordFamilyQuiz.js')
        self.assertIn('StorageService.recordMistake', content, "WordFamilyQuiz must call StorageService.recordMistake on wrong choices")
        self.assertIn("type: 'word_family'", content)

    def test_culture_quiz_records_mistakes(self):
        content = self._read_file('js/components/CultureQuiz.js')
        self.assertIn('StorageService.recordMistake', content, "CultureQuiz must record mistakes for riddles")
        self.assertIn("type: 'culture'", content)

    def test_number_master_records_mistakes(self):
        content = self._read_file('js/components/NumberMasterTest.js')
        self.assertIn('StorageService.recordMistake', content, "NumberMasterTest must record mistakes on wrong answers")

    def test_interview_master_records_mistakes(self):
        content = self._read_file('js/components/InterviewMaster.js')
        self.assertIn('StorageService.recordMistake', content, "InterviewMaster must record typing test mistakes")
        self.assertIn("type: 'typing'", content)

    def test_spelling_game_records_mistakes(self):
        content = self._read_file('js/components/SpellingGame.js')
        self.assertIn('StorageService.recordMistake', content, "SpellingGame must record escaped fish or mistakes")

    def test_etymology_master_records_mistakes(self):
        content = self._read_file('js/components/EtymologyMaster.js')
        self.assertIn('StorageService.recordMistake', content, "EtymologyMaster must record quiz mistakes")

    def test_penguin_expedition_records_mistakes(self):
        content = self._read_file('js/components/PenguinExpedition.js')
        self.assertIn('StorageService.recordMistake', content, "PenguinExpedition must record railway quiz mistakes")

    def test_storage_service_safeguards_non_word_types(self):
        content = self._read_file('js/services/storage.js')
        self.assertIn("(!m.type || m.type === 'word')", content, "StorageService must safeguard non-word question types from being overwritten as words")

    def test_review_notebook_filters_and_parsing(self):
        content = self._read_file('js/components/ReviewNotebook.js')
        # Check for expanded category filters in review notebook
        self.assertIn("activeGrammar", content)
        self.assertIn("activeDeclension", content)
        self.assertIn("activeReading", content)
        self.assertIn("activeListening", content)
        self.assertIn("activeWordFamily", content)
        self.assertIn("activeCulture", content)
        self.assertIn("activeTyping", content)

        # Check that parseReviewItem preserves non-word questions
        self.assertIn("isExplicitNonWord", content)
        self.assertIn("matchedWord && !isExplicitNonWord", content)

        # Check checkReviewAnswer handles explicit non-words
        self.assertIn("if (isExplicitNonWord)", content)

if __name__ == '__main__':
    unittest.main()
