# -*- coding: utf-8 -*-
import json, os, sys

sys.stdout.reconfigure(encoding='utf-8')
base_dir = r"C:\Users\kkaho\.gemini\antigravity\scratch\mongol-learning-app"

def test_user_requested_expressions():
    print("Testing User-Requested Vocabulary & Expressions...")
    vocab_path = os.path.join(base_dir, 'js', 'data', 'initialVocabulary.js')
    with open(vocab_path, 'r', encoding='utf-8') as f:
        text = f.read()

    start_idx = text.find('[')
    end_idx = text.rfind(']') + 1
    vocab = json.loads(text[start_idx:end_idx])

    by_mn = {w.get('mongolian', '').strip().lower(): w for w in vocab}

    expected_words = [
        # 1. 知識・理解・推量
        ('мэдэх', '知る', True),
        ('мэдэхгүй', '知らない', True),
        ('ойлгох', '分かる', True),
        ('ойлгохгүй', '分からない', True),
        ('ойлголоо', '分かった', True),
        ('Аан, ойлголоо', 'なるほど', False),
        ('магадгүй', '多分', False),
        ('бололтой', 'おそらく', True),
        ('байхаа', 'はず', True),
        ('-х байхаа', 'はず', False),
        ('-х байх', 'だろう', False),
        ('лав', 'きっと', False),
        ('гэж бодож байна', 'だと思う', True),
        ('бодох', '思う', True),
        # 2. 程度・評価・状態
        ('итгэл', '自信', False),
        ('итгэлгүй', '自信がない', False),
        ('итгэлгүй байна', '確信がない', False),
        ('ойролцоогоор', 'だいたい', False),
        ('ойролцоо', '近い', False),
        ('дунд', '中', False),
        ('дунд зэрэг', '中くらい', False),
        ('зэрэг', '程度', False),
        ('энгийн', '普通', False),
        ('ерөнхийдөө', '基本的に', False),
        ('ерөнхий', '一般的', False),
        ('дажгүй', 'まぁまぁ', False),
        ('гайхалтай', 'すごい', False),
        ('үнэхээр мундаг', '本当にすごい', False),
        ('үнэхээр', '本当に', False),
        ('зүгээр', '普通に', False),
        ('зүгээр л', 'ただ', False),
        # 3. 意思・選択・行動
        ('аль', 'どちら', False),
        ('аль нь ч болно', 'どっちでもいい', False),
        ('юу', '何', False),
        ('юу ч болно', 'なんでもいい', False),
        ('болох', 'なる', True),
        ('тоох', '気にする', True),
        ('тоохгүй', '気にしない', True),
        ('хийх', 'する', True),
        ('хийгээд үзэх', 'やってみる', True),
        ('хийгээд үзнэ', 'やってみます', True),
        ('үзэх', '試す', True),
        ('хичээх', '努力する', True),
        ('хичээнэ', '頑張ります', True),
        # 4. 会話でよく使う反応
        ('үнэн шүү', '確かに', False),
        ('тийм шүү', 'その通り', False),
        ('аан, тийм байна', 'なるほど', False),
        ('тийм юм байна', 'そうなんですね', False),
        ('аан, тийм үү?', 'そうなの', False),
        ('ёстой', '本当に', False),
        ('баярлалаа', 'ありがとうございます', False),
        ('маш их баярлалаа', '本当にありがとうございます', False),
        # 5. 追加の語根・関連語
        ('шүүгээ', '棚', False),
        ('цангалаа', '渇いた', True),
        ('цангах', '渇く', True),
        ('дасгал', '練習', False),
        ('харьяат', '所属する人', False),
        ('харьяалал', '所属', False),
        ('толь бичиг', '辞書', False),
        ('мөрөөдөл', '夢', False),
        ('мөрөөдөх', '夢見る', True),
        ('эрх чөлөө', '自由', False)
    ]

    for mn, ja_sub, is_v in expected_words:
        assert mn.lower() in by_mn, f"Word {mn} missing from initialVocabulary.js"
        item = by_mn[mn.lower()]
        assert ja_sub in item['japanese'], f"Word {mn} meaning mismatch: {item['japanese']}"
        if is_v:
            assert item.get('dictForm'), f"Verb {mn} missing dictForm"
            assert item.get('root'), f"Verb {mn} missing root"
            assert '-' in item.get('root'), f"Verb root should end with hyphen: {item.get('root')}"

    print(f"  ✓ All {len(expected_words)} vocabulary entries verified with dictForm & root")

    # Word family check
    wf_path = os.path.join(base_dir, 'js', 'data', 'wordFamilyData.js')
    with open(wf_path, 'r', encoding='utf-8') as f:
        wf_text = f.read()

    new_root_checks = [
        'fam_oilgo', 'fam_bod', 'fam_bol', 'fam_bai',
        'fam_khichee', 'fam_morood', 'fam_kharyaa', 'fam_tsang'
    ]
    for fid in new_root_checks:
        assert fid in wf_text, f"Root family {fid} missing from wordFamilyData.js"

    print("  ✓ All 8 newly expanded root families verified in wordFamilyData.js")

if __name__ == '__main__':
    test_user_requested_expressions()
    print("ALL USER REQUESTED EXPRESSIONS TESTS PASSED!")
