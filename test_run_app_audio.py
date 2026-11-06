import os
import sys
import json
import urllib.request
import threading
import time

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

import run_app

def run_server():
    server = run_app.ThreadingTCPServer(('127.0.0.1', 5174), run_app.Handler)
    server.serve_forever()

t = threading.Thread(target=run_server, daemon=True)
t.start()
time.sleep(1)

try:
    # 1. Test /api/audio/status
    with urllib.request.urlopen('http://127.0.0.1:5174/api/audio/status') as res:
        status = json.loads(res.read().decode('utf-8'))
        print("Status test:", status)

    # 2. Test /api/audio/batch_list
    with urllib.request.urlopen('http://127.0.0.1:5174/api/audio/batch_list') as res:
        batch_list = json.loads(res.read().decode('utf-8'))
        print("Batch list count:", len(batch_list))

    # 3. Test /api/tts?q=сайн
    q = urllib.parse.quote('сайн')
    with urllib.request.urlopen(f'http://127.0.0.1:5174/api/tts?q={q}') as res:
        data = res.read()
        print(f"TTS fetch test: {len(data)} bytes, Content-Type: {res.headers.get('Content-Type')}")

    print("ALL RUN_APP AUDIO API TESTS PASSED!")
except Exception as e:
    print("Test failed:", e)
    sys.exit(1)
