import unittest, os

class TestPdfGrammarSupplement(unittest.TestCase):
    def setUp(self):
        self.base_dir = r"C:\Users\kkaho\.gemini\antigravity\scratch\mongol-learning-app"
        with open(os.path.join(self.base_dir, 'js', 'components', 'ReferenceGuide.js'), 'r', encoding='utf-8') as f:
            self.ref_content = f.read()
        with open(os.path.join(self.base_dir, 'js', 'data', 'suffixRuleData.js'), 'r', encoding='utf-8') as f:
            self.suffix_content = f.read()
        with open(os.path.join(self.base_dir, 'bundled.js'), 'r', encoding='utf-8') as f:
            self.bundle_content = f.read()

    def test_reference_guide_new_subtabs_exist(self):
        """ReferenceGuideにPDF 35ページから抽出した全8大文法サブタブが含まれていること"""
        subtabs = [
            'ref-tab-modality',          # モダリティ終助詞12選
            'ref-tab-volitive',          # 希求形・意思形（-я⁴/-ъя⁴/-ье）
            'ref-tab-converb-j-ch',      # 進行形（-ж/-ч）原則と5大例外
            'ref-tab-auxiliary-verbs',   # 補助動詞7大構文
            'ref-tab-plural',            # 複数形（-ууд²/-нар/-д/-с/-чууд²）
            'ref-tab-reflexive',         # 再帰所有（-аа⁴）＆人称関係助詞
            'ref-tab-interrogative',     # 疑問詞全格変化マトリクス
            'ref-tab-dative-locative'    # 与位格（-д/-т）接続＆隠れ-н
        ]
        for st in subtabs:
            self.assertIn(st, self.ref_content, f"Subtab {st} not found in ReferenceGuide.js")

    def test_modality_12_particles_explained(self):
        """モダリティ12大表現がReferenceGuideとbundled.jsに明記されていること"""
        modality_keys = [
            'гэж үү', 'биш үү', 'биз дээ', 'билүү', 'болов уу',
            'байх аа', 'ёстой', 'магадгүй', 'бололтой', 'мөн', 'гэнэ ээ', 'юм шиг байна'
        ]
        for key in modality_keys:
            self.assertIn(key, self.ref_content, f"Modality particle {key} not found in ReferenceGuide.js")

    def test_converb_5_exceptions_explained(self):
        """進行形-ж/-чの5大例外動詞（ирж, орж, явж, зурж, харж）が明記されていること"""
        exceptions = ['ирж байна', 'орж байна', 'явж байна', 'зурж байна', 'харж байна']
        for exc in exceptions:
            self.assertIn(exc, self.ref_content, f"Converb exception {exc} not found in ReferenceGuide.js")

    def test_volitive_hard_soft_sign_rules(self):
        """希求形でъ/ьを挟む正書法（амаръя, үзье, яръя等）が記載されていること"""
        volitives = ['амаръя', 'үзье', 'яръя', 'уулзъя', 'идье']
        for v in volitives:
            self.assertIn(v, self.ref_content, f"Volitive form {v} not found in ReferenceGuide.js")

    def test_suffix_rule_dojo_categories_expanded(self):
        """SuffixRuleDojoに新カテゴリ（希求形、進行形例外、モダリティ、補助動詞）が追加されていること"""
        new_cats = ['volitive_suffixes', 'converb_j_ch', 'modality_particles', 'auxiliary_verbs']
        for c in new_cats:
            self.assertIn(c, self.suffix_content, f"Suffix category {c} not found in suffixRuleData.js")

    def test_error_free_shadowing_and_gamification(self):
        """ShadowingDictationTestでtypingSentencesがReferenceErrorにならない安全ガードがあること"""
        with open(os.path.join(self.base_dir, 'js', 'components', 'ShadowingDictationTest.js'), 'r', encoding='utf-8') as f:
            shadow_text = f.read()
        self.assertIn('window.typingSentences', shadow_text)
        with open(os.path.join(self.base_dir, 'js', 'services', 'gamification.js'), 'r', encoding='utf-8') as f:
            gam_text = f.read()
        self.assertIn('window.GamificationService = GamificationService', gam_text)

if __name__ == '__main__':
    unittest.main()
