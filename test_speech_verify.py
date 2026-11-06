with open('bundled.js', 'r', encoding='utf-8') as f:
    code = f.read()

assert 'class SpeechService' in code
assert 'speakMongolian(' in code
assert 'static speak(' in code
assert 'cleanMongolianText' in code
assert 'createThenable' in code
assert 'playGoogleTranslateAudio' in code
assert 'playViaSpeechSynthesis' in code
assert 'playCyrillicPhoneticFallback' in code
assert 'playKanaFallback' in code
assert 'playWebAudioPhonetics' in code
assert 'js.puter.com' not in code

print("[PASS] SpeechService multi-tier audio architecture and speakMongolian alias verified!")
