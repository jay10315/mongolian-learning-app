import os
import sys
import json
import re

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

APP_DIR = os.path.dirname(os.path.abspath(__file__))

def test_audio_cache_and_batch_features():
    print("Testing audio cache & batch features...")

    # 1. Check audio_cache directory & count
    cache_dir = os.path.join(APP_DIR, 'audio_cache')
    assert os.path.exists(cache_dir), "audio_cache directory must exist"
    mp3_files = [f for f in os.listdir(cache_dir) if f.endswith('.mp3')]
    print(f"Cached mp3 count: {len(mp3_files)}")
    assert len(mp3_files) >= 700, f"Expected at least 700 cached files, got {len(mp3_files)}"

    # 2. Check manifest.json
    manifest_file = os.path.join(cache_dir, 'manifest.json')
    assert os.path.exists(manifest_file), "manifest.json must exist"
    with open(manifest_file, 'r', encoding='utf-8') as f:
        manifest = json.load(f)
    assert len(manifest) >= 700, f"Expected at least 700 items in manifest, got {len(manifest)}"

    # 3. Check audio_phrases.json
    phrases_file = os.path.join(APP_DIR, 'audio_phrases.json')
    assert os.path.exists(phrases_file), "audio_phrases.json must exist"
    with open(phrases_file, 'r', encoding='utf-8') as f:
        phrases = json.load(f)
    assert len(phrases) >= 700, f"Expected at least 700 phrases, got {len(phrases)}"

    # 4. Check SpeechService and AudioStorage in speech.js
    speech_js = os.path.join(APP_DIR, 'js', 'services', 'speech.js')
    with open(speech_js, 'r', encoding='utf-8') as f:
        code = f.read()
    assert 'class AudioStorage' in code, "AudioStorage class must be defined in speech.js"
    assert 'mongol_audio_cache_v1' in code, "IndexedDB DB_NAME mongol_audio_cache_v1 must be defined"
    assert 'batchDownloadAll' in code, "batchDownloadAll method must exist in SpeechService"
    assert 'getCacheStats' in code, "getCacheStats method must exist in SpeechService"
    assert 'clearCache' in code, "clearCache method must exist in SpeechService"
    assert '/api/tts' in code, "/api/tts call must exist in speech.js"

    # 5. Check BatchAudioModal.js
    modal_js = os.path.join(APP_DIR, 'js', 'components', 'BatchAudioModal.js')
    assert os.path.exists(modal_js), "BatchAudioModal.js must exist"
    with open(modal_js, 'r', encoding='utf-8') as f:
        m_code = f.read()
    assert 'class BatchAudioModal' in m_code, "BatchAudioModal class must be defined"
    assert 'btn-audio-start-download' in m_code, "Download start button must be defined"
    assert 'audio-progress-bar' in m_code, "Progress bar must be defined"

    # 6. Check Navbar.js integration
    nav_js = os.path.join(APP_DIR, 'js', 'components', 'Navbar.js')
    with open(nav_js, 'r', encoding='utf-8') as f:
        n_code = f.read()
    assert 'btn-batch-audio-dl' in n_code, "btn-batch-audio-dl must be present in Navbar"
    assert 'BatchAudioModal' in n_code, "BatchAudioModal must be imported/used in Navbar"

    # 7. Check Home.js integration
    home_js = os.path.join(APP_DIR, 'js', 'components', 'Home.js')
    with open(home_js, 'r', encoding='utf-8') as f:
        h_code = f.read()
    assert 'card-batch-audio-dl' in h_code, "card-batch-audio-dl must be present in Home"
    assert 'BatchAudioModal' in h_code, "BatchAudioModal must be imported/used in Home"

    # 8. Check run_app.py audio endpoints
    run_app_file = os.path.join(APP_DIR, 'run_app.py')
    with open(run_app_file, 'r', encoding='utf-8') as f:
        r_code = f.read()
    assert '/api/tts' in r_code, "/api/tts endpoint must be handled in run_app.py"
    assert '/api/audio/status' in r_code, "/api/audio/status endpoint must be handled in run_app.py"
    assert '/api/audio/batch_list' in r_code, "/api/audio/batch_list endpoint must be handled in run_app.py"
    assert "'.mp3': 'audio/mpeg'" in r_code, "'.mp3' MIME type must be registered in run_app.py"

    # 9. Check bundled index.html
    index_html = os.path.join(APP_DIR, 'index.html')
    with open(index_html, 'r', encoding='utf-8') as f:
        idx_code = f.read()
    assert 'class AudioStorage' in idx_code, "AudioStorage must be in index.html"
    assert 'class BatchAudioModal' in idx_code, "BatchAudioModal must be in index.html"
    assert 'btn-batch-audio-dl' in idx_code, "btn-batch-audio-dl must be in index.html"

    print("ALL AUDIO BATCH & OFFLINE CACHE CHECKS PASSED SUCCESSFULLY!")

if __name__ == '__main__':
    test_audio_cache_and_batch_features()
