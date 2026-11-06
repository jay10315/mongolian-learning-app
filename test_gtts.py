import urllib.request
import urllib.parse

# Let's test different query params for Google Translate TTS
queries = [
    # standard format
    "https://translate.google.com/translate_tts?ie=UTF-8&q=%D1%81%D0%B0%D0%B9%D0%BD&tl=mn&total=1&idx=0&textlen=4&tk=123456.123456&client=t&prev=input",
    # gtx with user agent
    "https://translate.googleapis.com/translate_tts?ie=UTF-8&q=%D1%81%D0%B0%D0%B9%D0%BD&tl=mn&client=gtx",
    "https://translate.google.com.vn/translate_tts?ie=UTF-8&q=%D1%81%D0%B0%D0%B9%D0%BD&tl=mn&client=tw-ob",
    # speechify / dict / googleapi
    "https://texttospeech.googleapis.com/v1/text:synthesize",
]

for url in queries[:3]:
    try:
        req = urllib.request.Request(url, headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        })
        with urllib.request.urlopen(req, timeout=5) as resp:
            print("URL:", url)
            print("SUCCESS:", resp.status, resp.headers.get('Content-Type'), len(resp.read()))
    except Exception as e:
        print("URL:", url, "FAILED:", e)
