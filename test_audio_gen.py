import os
import sys
import json
import hashlib
import asyncio
import edge_tts

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')


APP_DIR = os.path.dirname(os.path.abspath(__file__))
CACHE_DIR = os.path.join(APP_DIR, 'audio_cache')
MANIFEST_FILE = os.path.join(CACHE_DIR, 'manifest.json')
VOICE = 'mn-MN-YesuiNeural'

def get_hash(text):
    clean = text.strip().lower()
    return hashlib.md5(clean.encode('utf-8')).hexdigest()

async def generate_single(sem, phrase, idx, total):
    text = phrase['text']
    h = get_hash(text)
    out_path = os.path.join(CACHE_DIR, f"{h}.mp3")

    if os.path.exists(out_path) and os.path.getsize(out_path) > 500:
        return {'text': text, 'hash': h, 'status': 'cached', 'size': os.path.getsize(out_path)}

    async with sem:
        for attempt in range(3):
            try:
                communicate = edge_tts.Communicate(text, VOICE)
                await communicate.save(out_path)
                size = os.path.getsize(out_path)
                return {'text': text, 'hash': h, 'status': 'downloaded', 'size': size}
            except Exception as e:
                if attempt == 2:
                    print(f"[{idx}/{total}] Failed: {text} ({e})")
                    return {'text': text, 'hash': h, 'status': 'error', 'error': str(e)}
                await asyncio.sleep(1.0)

async def test_batch():
    os.makedirs(CACHE_DIR, exist_ok=True)
    phrases_path = os.path.join(APP_DIR, 'audio_phrases.json')
    with open(phrases_path, 'r', encoding='utf-8') as f:
        all_phrases = json.load(f)

    test_sample = all_phrases[:5]
    sem = asyncio.Semaphore(3)
    tasks = [generate_single(sem, p, i+1, len(test_sample)) for i, p in enumerate(test_sample)]
    results = await asyncio.gather(*tasks)

    for r in results:
        print(f"Result: {r['text']} -> {r.get('hash')}.mp3 ({r['status']}, {r.get('size', 0)} bytes)")

if __name__ == '__main__':
    asyncio.run(test_batch())
