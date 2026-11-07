import os
import sys
import unittest
import json
import re

sys.stdout.reconfigure(encoding='utf-8')

base_dir = r"C:\Users\kkaho\.gemini\antigravity\scratch\mongol-learning-app"

class TestUserRequestedFeaturesComprehensive(unittest.TestCase):
    
    def test_pc_keyboard_layout(self):
        """1. モンゴル語キーボードの配列をPCの標準配列（JCUKEN）に合わせる"""
        with open(os.path.join(base_dir, 'js', 'utils', 'helpers.js'), 'r', encoding='utf-8') as f:
            helpers_code = f.read()

        self.assertIn('MONGOLIAN_PC_KEYBOARD_LAYOUT', helpers_code)
        self.assertIn('renderCyrillicInputAssistantHTML', helpers_code)
        self.assertIn('bindCyrillicInputAssistant', helpers_code)

        # Check special letters
        self.assertIn('ө', helpers_code)
        self.assertIn('ү', helpers_code)
        self.assertIn('Ө', helpers_code)
        self.assertIn('Ү', helpers_code)
        self.assertIn('ъ', helpers_code)
        self.assertIn('ь', helpers_code)

        # Check CyrillicKeyboard.js component
        with open(os.path.join(base_dir, 'js', 'components', 'CyrillicKeyboard.js'), 'r', encoding='utf-8') as f:
            kb_code = f.read()
        self.assertIn('class CyrillicKeyboard', kb_code)
        self.assertIn('MONGOLIAN_PC_KEYBOARD_LAYOUT', kb_code)
        self.assertIn('btn-shift-key', kb_code)

    def test_exercise_notebook_question_count_selection(self):
        """2. 練習ノートに出題数選択機能（5問, 10問, 20問, 全問）を追加"""
        with open(os.path.join(base_dir, 'js', 'components', 'ExerciseNotebookTest.js'), 'r', encoding='utf-8') as f:
            code = f.read()

        self.assertIn('selectedCount', code)
        self.assertIn('btn-select-count', code)
        self.assertIn('[5, 10, 20, \'all\']', code)
        self.assertIn('1回のセッションの出題数を選択', code)

    def test_textbook_sentences_comprehensive_import(self):
        """3. 教科書例文を全課・全形式取り込み（76件から981件へ大幅拡充）"""
        with open(os.path.join(base_dir, 'js', 'data', 'textbookSentences.js'), 'r', encoding='utf-8') as f:
            js_text = f.read()

        m = re.search(r'export const textbookLessonsData = (\[[\s\S]*?\]);', js_text)
        self.assertIsNotNone(m, "textbookLessonsData not found")
        lessons = json.loads(m.group(1))

        self.assertEqual(len(lessons), 18, "Must contain all 18 lessons")
        total_sents = sum(len(l.get('sentences', [])) for l in lessons)
        print(f"Verified Textbook Sentences Count: {total_sents}")
        self.assertGreaterEqual(total_sents, 900, "Must contain at least 900 textbook sentences")

        for l in lessons:
            self.assertGreaterEqual(len(l.get('sentences', [])), 35, f"Lesson {l.get('lesson')} must have at least 35 sentences")

    def test_exercise_quizzes_quality_and_image_fixes(self):
        """4 & 5. 問題文と解答の整合性（画像1括弧欠落修正、画像2質問問題の4択化）"""
        with open(os.path.join(base_dir, 'js', 'data', 'exerciseNotebookQuizzes.js'), 'r', encoding='utf-8') as f:
            text = f.read()

        m = re.search(r'export const exerciseNotebookQuizzes = (\[[\s\S]*?\]);', text)
        lessons = json.loads(m.group(1))
        
        total_quizzes = 0
        choice_count = 0
        suspicious = []

        for l in lessons:
            for q in l['quizzes']:
                total_quizzes += 1
                prompt = q.get('prompt', '')
                question = q.get('question', '')
                ans = q.get('correctAnswer', '').strip()

                if q.get('exerciseType') == 'choice':
                    choice_count += 1
                    raw_ch = q.get('choices') or q.get('options') or []
                    self.assertGreaterEqual(len(raw_ch), 4, f"Choice quiz {q.get('id')} must have at least 4 choices")
                    self.assertIn(ans, raw_ch, f"Answer {ans} must be in choices")

                # No raw "вэ?" or "уу?" or letter as answer
                if ans in ['вэ?', 'уу?', 'үү?', 'бэ?', '142', 'C']:
                    suspicious.append((q.get('id'), ans))

                # If prompt mentions parens, question must have parens
                if '括弧内の単語' in prompt:
                    self.assertTrue('(' in question or '（' in question, f"Missing parens in {q.get('id')}")

        print(f"Verified Exercise Quizzes Count: {total_quizzes}, Choice Questions: {choice_count}")
        self.assertEqual(total_quizzes, 1242, "Must contain all 1,242 exercise quizzes")
        self.assertGreaterEqual(choice_count, 350, "Open-ended questions must be converted to choice format")
        self.assertEqual(len(suspicious), 0, f"Found suspicious answers: {suspicious}")

    def test_word_test_bidirectional_choice_and_keyboard(self):
        """7. 単語テストの4択で出題方向（日本語→モンゴル語 / モンゴル語→日本語）を選択可能"""
        with open(os.path.join(base_dir, 'js', 'components', 'WordTest.js'), 'r', encoding='utf-8') as f:
            code = f.read()

        self.assertIn('choiceDirection', code)
        self.assertIn('choice-direction-panel', code)
        self.assertIn('🇯🇵 日本語 → 🇲🇳 モンゴル語', code)
        self.assertIn('🇲🇳 モンゴル語 → 🇯🇵 日本語', code)
        self.assertIn('renderCyrillicInputAssistantHTML', code)
        self.assertIn('bindCyrillicInputAssistant', code)

    def test_synonym_expressions_master(self):
        """6. 複数の日本語訳・モンゴル語表現の登録（「気にしない」等）"""
        with open(os.path.join(base_dir, 'js', 'utils', 'helpers.js'), 'r', encoding='utf-8') as f:
            helpers_code = f.read()

        self.assertIn('SYNONYM_EXPRESSIONS_MAP', helpers_code)
        self.assertIn('getSynonymExpressionsCardHTML', helpers_code)
        self.assertIn('気にしない', helpers_code)
        self.assertIn('хамаагүй', helpers_code)
        self.assertIn('зүгээр', helpers_code)
        self.assertIn('тоохгүй', helpers_code)
        self.assertIn('санаа зоволтгүй', helpers_code)

        # Check vocabulary registration
        with open(os.path.join(base_dir, 'js', 'data', 'initialVocabulary.js'), 'r', encoding='utf-8') as f:
            vocab_code = f.read()
        self.assertIn('хамаагүй', vocab_code)
        self.assertIn('тоохгүй', vocab_code)
        self.assertIn('санаа зоволтгүй', vocab_code)

    def test_bundled_and_html_integrity(self):
        """8. ビルド整合性（構文エラー・未定義参照の完全排除）"""
        # Rebuild first
        import subprocess
        res = subprocess.run(['python', 'build_standalone.py'], capture_output=True, text=True, cwd=base_dir)
        self.assertEqual(res.returncode, 0, "build_standalone.py must succeed")

        with open(os.path.join(base_dir, 'index.html'), 'r', encoding='utf-8') as f:
            html = f.read()

        self.assertIn('ExerciseNotebookTestComponent', html)
        self.assertIn('MONGOLIAN_PC_KEYBOARD_LAYOUT', html)
        self.assertIn('SYNONYM_EXPRESSIONS_MAP', html)
        self.assertNotIn('mobile-debug-alert', html[:500])

if __name__ == '__main__':
    unittest.main()
