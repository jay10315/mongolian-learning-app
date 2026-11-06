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
DEFAULT_VOICE = 'mn-MN-YesuiNeural'

def get_hash(text):
    clean = text.strip().lower()
    return hashlib.md5(clean.encode('utf-8')).hexdigest()

async def download_one(sem, phrase, idx, total, manifest, voice=DEFAULT_VOICE):
    text = phrase['text']
    h = get_hash(text)
    out_path = os.path.join(CACHE_DIR, f"{h}.mp3")

    if os.path.exists(out_path) and os.path.getsize(out_path) > 500:
        manifest[h] = {
            'text': text,
            'file': f"{h}.mp3",
            'size': os.path.getsize(out_path),
            'label': phrase.get('label', ''),
            'category': phrase.get('category', '')
        }
        return 'cached'

    async with sem:
        for attempt in range(3):
            try:
                communicate = edge_tts.Communicate(text, voice)
                await communicate.save(out_path)
                size = os.path.getsize(out_path)
                manifest[h] = {
                    'text': text,
                    'file': f"{h}.mp3",
                    'size': size,
                    'label': phrase.get('label', ''),
                    'category': phrase.get('category', '')
                }
                if idx % 20 == 0 or idx == total:
                    print(f"[{idx}/{total}] Downloaded: {text[:25]} ({size} bytes)")
                return 'downloaded'
            except Exception as e:
                if attempt == 2:
                    print(f"[{idx}/{total}] Error downloading '{text[:25]}': {e}")
                    return 'error'
                await asyncio.sleep(1.0)

async def main():
    os.makedirs(CACHE_DIR, exist_ok=True)
    phrases_path = os.path.join(APP_DIR, 'audio_phrases.json')
    if not os.path.exists(phrases_path):
        import extract_phrases

    with open(phrases_path, 'r', encoding='utf-8') as f:
        phrases = json.load(f)

    total = len(phrases)
    print(f"==================================================")
    print(f"  モンゴル語音声一括ジェネレーター / ダウンローダー")
    print(f"  全 {total} 件の音声を audio_cache/ に事前生成します")
    print(f"  音声エンジン: Microsoft Edge Neural TTS ({DEFAULT_VOICE})")
    print(f"==================================================")

    manifest = {}
    if os.path.exists(MANIFEST_FILE):
        try:
            with open(MANIFEST_FILE, 'r', encoding='utf-8') as f:
                manifest = json.load(f)
        except Exception:
            manifest = {}

    sem = asyncio.Semaphore(6)
    tasks = [download_one(sem, p, i+1, total, manifest) for i, p in enumerate(phrases)]
    results = await asyncio.gather(*tasks)

    cached_count = sum(1 for r in results if r == 'cached')
    downloaded_count = sum(1 for r in results if r == 'downloaded')
    error_count = sum(1 for r in results if r == 'error')

    with open(MANIFEST_FILE, 'w', encoding='utf-8') as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)

    total_size = sum(m.get('size', 0) for m in manifest.values())
    total_size_mb = total_size / (1024 * 1024)

    print()
    print(f"==================================================")
    print(f"  完了: 既存キャッシュ: {cached_count} 件, 新規生成: {downloaded_count} 件, エラー: {error_count} 件")
    print(f"  合計キャッシュファイル数: {len(manifest)} 件 ({total_size_mb:.2f} MB)")
    print(f"  保存先: {CACHE_DIR}")
    print(f"==================================================")

if __name__ == '__main__':
    asyncio.run(main())
