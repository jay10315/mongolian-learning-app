def test_start_challenge_button():
    with open('js/components/WordGame.js', 'r', encoding='utf-8') as f:
        src = f.read()

    assert 'btn-direct-start-mode' in src, "btn-direct-start-mode missing in WordGame.js"
    assert 'data-mode="speedrun"' in src
    assert 'data-mode="survival"' in src
    assert 'data-mode="combo"' in src
    assert 'data-mode="relax"' in src
    assert 'data-mode="drop"' in src
    assert '挑戦する' in src
    assert 'this.startGame()' in src

    with open('bundled.js', 'r', encoding='utf-8') as f:
        bundled = f.read()

    assert 'btn-direct-start-mode' in bundled, "btn-direct-start-mode missing in bundled.js"

    print("All start challenge button tests passed successfully!")

if __name__ == '__main__':
    test_start_challenge_button()
