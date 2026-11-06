import os, sys, re

def run_test():
    base_dir = r"C:\Users\kkaho\.gemini\antigravity\scratch\mongol-learning-app"

    def read_f(rel):
        with open(os.path.join(base_dir, rel.replace('/', os.sep)), 'r', encoding='utf-8') as f:
            return f.read()

    # 1. NumberMasterTest.js
    num_txt = read_f('js/components/NumberMasterTest.js')
    assert 'filter-num-result-btn' in num_txt, "NumberMasterTest must have filter buttons"
    assert 'btn-goto-mistakes-from-num' in num_txt, "NumberMasterTest must have mistake drill button"
    assert "onNavigate('review')" in num_txt, "NumberMasterTest must navigate to review notebook"
    assert 'renderChoiceExplanationsHTML' in num_txt, "NumberMasterTest must render 4-choice explanations"

    # 2. WordFamilyQuiz.js
    wf_txt = read_f('js/components/WordFamilyQuiz.js')
    assert 'filter-synonym-res-btn' in wf_txt, "WordFamilyQuiz must have synonym filter buttons"
    assert 'filter-family-res-btn' in wf_txt, "WordFamilyQuiz must have family filter buttons"
    assert 'btn-goto-mistakes-from-synonym' in wf_txt, "WordFamilyQuiz must have synonym mistake drill button"
    assert 'btn-goto-mistakes-from-family' in wf_txt, "WordFamilyQuiz must have family mistake drill button"
    assert 'answeredLog' in wf_txt, "WordFamilyQuiz must track answeredLog"

    # 3. EtymologyMaster.js
    etym_txt = read_f('js/components/EtymologyMaster.js')
    assert 'filter-etym-res-btn' in etym_txt, "EtymologyMaster must have filter buttons"
    assert 'btn-goto-mistakes-from-etym' in etym_txt, "EtymologyMaster must have mistake drill button"
    assert 'results:' in etym_txt or 'results' in etym_txt, "EtymologyMaster must track quiz results"
    assert 'renderChoiceExplanationsHTML' in etym_txt, "EtymologyMaster must render choice explanations"

    # 4. CultureQuiz.js
    cul_txt = read_f('js/components/CultureQuiz.js')
    assert 'filter-culture-res-btn' in cul_txt, "CultureQuiz must have filter buttons"
    assert 'btn-goto-mistakes-from-culture' in cul_txt, "CultureQuiz must have mistake drill button"
    assert 'riddleResults' in cul_txt, "CultureQuiz must track riddle results"

    # 5. ReadingTest.js & SpellingGame.js
    read_txt = read_f('js/components/ReadingTest.js')
    assert 'btn-goto-mistakes-from-reading' in read_txt, "ReadingTest must have mistake drill button"

    spell_txt = read_f('js/components/SpellingGame.js')
    assert 'filter-spelling-btn' in spell_txt, "SpellingGame must have filter buttons"
    assert 'btn-goto-mistakes-from-spelling' in spell_txt, "SpellingGame must have mistake drill button"

    # 6. DeclensionTest.js & GrammarTest.js
    decl_txt = read_f('js/components/DeclensionTest.js')
    assert 'btn-goto-mistakes-from-decl' in decl_txt, "DeclensionTest must have mistake drill button"

    gram_txt = read_f('js/components/GrammarTest.js')
    assert 'btn-goto-mistakes-from-grammar' in gram_txt, "GrammarTest must have mistake drill button"

    # 7. No spoilers in declensionQuizzes.js
    decl_q = read_f('js/data/declensionQuizzes.js')
    assert '隠れн出現' not in decl_q, "No spoiler in targetCase before answering"
    assert '水（男性名詞 / 隠れн）' not in decl_q, "No spoiler in baseMeaning before answering"

    # 8. No spoilers in roleplayData.js
    rp_data = read_f('js/data/roleplayData.js')
    assert '伝統の正しい返し' not in rp_data, "No spoiler in roleplay choice meaning"

    # 9. No Katakana mojibake attached to Cyrillic in index.html
    idx_html = read_f('index.html')
    assert 'өчиグдөр' not in idx_html, "No mojibake өчиグдөр"
    assert 'оюуタン' not in idx_html, "No mojibake оюуタン"
    assert 'халууン' not in idx_html, "No mojibake халууン (with katakana ン)"
    assert 'халуун' in idx_html, "Correct spelling халуун"
    assert 'онгоцоор' in idx_html, "Correct spelling онгоцоор"

    print("ALL MISTAKE REVIEW & SPOILER PREVENTION CHECKS PASSED!")

if __name__ == '__main__':
    run_test()
