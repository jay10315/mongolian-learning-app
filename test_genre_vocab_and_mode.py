import json
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

def test_genre_vocab():
    print("Testing Genre Vocabulary integration...")
    with open('js/data/initialVocabulary.js', 'r', encoding='utf-8') as f:
        text = f.read()

    start_idx = text.find('[')
    end_idx = text.rfind(']') + 1
    vocab = json.loads(text[start_idx:end_idx])

    assert len(vocab) >= 1100, f"Expected >= 1100 words, got {len(vocab)}"

    expected_genres = ['body', 'school', 'clothing', 'dining', 'appliances', 'produce', 'directions']
    counts = {}
    for w in vocab:
        gid = w.get('genreId')
        if gid:
            counts[gid] = counts.get(gid, 0) + 1
            assert w.get('mongolian'), f"Word missing mongolian: {w}"
            assert w.get('japanese'), f"Word missing japanese: {w}"
            assert w.get('pronunciation'), f"Word missing pronunciation: {w}"
            assert w.get('pos'), f"Word missing pos: {w}"

    for g in expected_genres:
        assert g in counts, f"Missing genre {g}"
        assert counts[g] >= 15, f"Genre {g} has only {counts[g]} words"
        print(f"  ✓ Genre '{g}': {counts[g]} words verified")

    total_genre_words = sum(counts.values())
    print(f"  ✓ Total genre-tagged words: {total_genre_words}")

def test_component_and_bundle():
    print("Testing GenreWordMaster component and bundled.js...")
    assert os.path.exists('js/components/GenreWordMaster.js'), "GenreWordMaster.js not found!"

    with open('bundled.js', 'r', encoding='utf-8') as f:
        bundle = f.read()

    assert 'class GenreWordMasterComponent' in bundle, "GenreWordMasterComponent missing in bundled.js"
    assert 'window.GenreWordMasterComponent = GenreWordMasterComponent' in bundle, "GenreWordMasterComponent window exposure missing"
    assert "genre_master" in bundle, "genre_master route missing in bundled.js"
    assert "static addXP(amount" in bundle, "GamificationService.addXP alias missing in bundled.js"
    assert "HIRAGANA_MAP" in bundle, "HIRAGANA_MAP IME fix missing in SpellingGame"

    print("  ✓ GenreWordMasterComponent bundled successfully")
    print("  ✓ Navigation route & Gamification alias verified")

if __name__ == '__main__':
    test_genre_vocab()
    test_component_and_bundle()
    print("ALL GENRE VOCAB & MODE TESTS PASSED!")
