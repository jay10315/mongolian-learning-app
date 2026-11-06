import urllib.request
import urllib.parse
import json

word = "сайн"
encoded = urllib.parse.quote(word)

tests = [
    ("Google gtx", f"https://translate.google.com/translate_tts?ie=UTF-8&tl=mn&client=gtx&q={encoded}"),
    ("Google tw-ob", f"https://translate.google.com/translate_tts?ie=UTF-8&tl=mn&client=tw-ob&q={encoded}"),
    ("SoundofText", "https://api.soundoftext.com/sounds"),
    ("Dict Naver", f"https://dict.naver.com/api/tts/mn?text={encoded}"),
]

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Referer': 'https://translate.google.com/'
}

for name, url in tests[:2]:
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=5) as resp:
            data = resp.read()
            print(f"[{name}] SUCCESS! Type: {resp.headers.get('Content-Type')}, Bytes: {len(data)}")
    except Exception as e:
        print(f"[{name}] Failed: {e}")

# Test SoundofText API (which proxies Google TTS legally and freely)
try:
    req_body = json.dumps({"engine": "Google", "data": {"text": word, "voice": "mn-MN"}}).encode('utf-8')
    req = urllib.request.Request(
        "https://api.soundoftext.com/sounds",
        data=req_body,
        headers={"Content-Type": "application/json", "User-Agent": "Mozilla/5.0"}
    )
    with urllib.request.urlopen(req, timeout=5) as resp:
        res = json.loads(resp.read().decode('utf-8'))
        print(f"[SoundofText POST] SUCCESS: {res}")
        sound_id = res.get('id')
        if sound_id:
            # check status
            status_url = f"https://api.soundoftext.com/sounds/{sound_id}"
            import time
            time.sleep(1)
            with urllib.request.urlopen(urllib.request.Request(status_url, headers={"User-Agent": "Mozilla/5.0"})) as s_resp:
                s_res = json.loads(s_resp.read().decode('utf-8'))
                print(f"[SoundofText Status]: {s_res}")
except Exception as e:
    print(f"[SoundofText] Failed: {e}")
