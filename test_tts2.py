import urllib.request
import urllib.parse

word = "сайн"
encoded = urllib.parse.quote(word)
length = len(word)

tests = [
    ("Google webapp", f"https://translate.google.com/translate_tts?ie=UTF-8&q={encoded}&tl=mn&total=1&idx=0&textlen={length}&client=webapp&prev=input"),
    ("Google dict-chrome", f"https://translate.google.com/translate_tts?ie=UTF-8&q={encoded}&tl=mn&client=dict-chrome-ex"),
    ("Lingva instance 1", f"https://lingva.ml/api/v1/audio/mn/{encoded}"),
    ("Lingva instance 2", f"https://translate.plausibility.cloud/api/v1/audio/mn/{encoded}"),
    ("Forvo Mongolian", f"https://forvo.com/word/{encoded}/"),
]

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Referer': 'https://translate.google.com/'
}

for name, url in tests:
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=5) as resp:
            data = resp.read()
            print(f"[{name}] SUCCESS! Type: {resp.headers.get('Content-Type')}, Bytes: {len(data)}")
    except Exception as e:
        print(f"[{name}] Failed: {e}")
