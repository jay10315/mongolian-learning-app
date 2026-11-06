import webbrowser
import http.server
import socketserver
import socket
import os
import sys
import json
import urllib.parse
import hashlib
import re
import asyncio

try:
    import edge_tts
except ImportError:
    edge_tts = None

sys.stdout.reconfigure(encoding='utf-8')

PORT = 5173
ACCOUNTS_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data_accounts.json')
CACHE_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'audio_cache')
PHRASES_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'audio_phrases.json')
DEFAULT_VOICE = 'mn-MN-YesuiNeural'

os.makedirs(CACHE_DIR, exist_ok=True)

def clean_mn_text(text):
    if not text:
        return ''
    t = re.sub(r'\s*[（\(].*?[）\)]\s*', ' ', text)
    t = re.sub(r'[.,!?。、！？«»"\'\s]+', ' ', t).strip()
    return t

def get_audio_hash(text):
    clean = clean_mn_text(text).lower()
    return hashlib.md5(clean.encode('utf-8')).hexdigest()

def synthesize_audio_sync(text, out_path, voice=DEFAULT_VOICE):
    if not edge_tts:
        return False
    async def _do():
        communicate = edge_tts.Communicate(text, voice)
        await communicate.save(out_path)
    try:
        asyncio.run(_do())
        return os.path.exists(out_path) and os.path.getsize(out_path) > 500
    except Exception as e:
        print(f"[TTS Error] {text} ({e})")
        return False


def load_accounts():
    if not os.path.exists(ACCOUNTS_FILE):
        return []
    try:
        with open(ACCOUNTS_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
            return data if isinstance(data, list) else []
    except Exception:
        return []

def save_accounts(accounts):
    try:
        with open(ACCOUNTS_FILE, 'w', encoding='utf-8') as f:
            json.dump(accounts, f, ensure_ascii=False, indent=2)
    except Exception as e:
        print(f"Error saving accounts: {e}")

def normalize_u(u):
    return str(u or '').strip().lower()

# このスクリプトがあるディレクトリに移動
os.chdir(os.path.dirname(os.path.abspath(__file__)))

def get_local_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(('8.8.8.8', 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return '192.168.2.226'

class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Accept')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path == '/api/accounts':
            accounts = load_accounts()
            body = json.dumps(accounts, ensure_ascii=False).encode('utf-8')
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Content-Length', str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return

        if parsed.path == '/api/tts':
            qs = urllib.parse.parse_qs(parsed.query)
            q = qs.get('q', [''])[0].strip()
            voice = qs.get('voice', [DEFAULT_VOICE])[0].strip() or DEFAULT_VOICE

            if not q:
                self.send_response(400)
                body = json.dumps({'error': 'Missing q parameter'}).encode('utf-8')
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.send_header('Content-Length', str(len(body)))
                self.end_headers()
                self.wfile.write(body)
                return

            clean = clean_mn_text(q)
            h = hashlib.md5(clean.lower().encode('utf-8')).hexdigest()
            file_path = os.path.join(CACHE_DIR, f"{h}.mp3")

            # 既存キャッシュ確認
            if not (os.path.exists(file_path) and os.path.getsize(file_path) > 500):
                # なければオンデマンド生成
                success = synthesize_audio_sync(clean, file_path, voice)
                if not success:
                    self.send_response(500)
                    body = json.dumps({'error': 'Failed to synthesize audio', 'text': clean}).encode('utf-8')
                    self.send_header('Content-Type', 'application/json; charset=utf-8')
                    self.send_header('Content-Length', str(len(body)))
                    self.end_headers()
                    self.wfile.write(body)
                    return

            try:
                with open(file_path, 'rb') as f:
                    audio_data = f.read()
                self.send_response(200)
                self.send_header('Content-Type', 'audio/mpeg')
                self.send_header('Content-Length', str(len(audio_data)))
                self.send_header('Cache-Control', 'public, max-age=31536000, immutable')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(audio_data)
                return
            except Exception as e:
                self.send_response(500)
                body = json.dumps({'error': str(e)}).encode('utf-8')
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.send_header('Content-Length', str(len(body)))
                self.end_headers()
                self.wfile.write(body)
                return

        if parsed.path == '/api/audio/status':
            files = [f for f in os.listdir(CACHE_DIR) if f.endswith('.mp3')]
            total_size = sum(os.path.getsize(os.path.join(CACHE_DIR, f)) for f in files)
            status_data = {
                'status': 'ok',
                'cached_count': len(files),
                'cache_size_bytes': total_size,
                'cache_size_mb': round(total_size / (1024 * 1024), 2),
                'voice': DEFAULT_VOICE
            }
            body = json.dumps(status_data, ensure_ascii=False).encode('utf-8')
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Content-Length', str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return

        if parsed.path == '/api/audio/batch_list':
            if os.path.exists(PHRASES_FILE):
                try:
                    with open(PHRASES_FILE, 'r', encoding='utf-8') as f:
                        data = json.load(f)
                    body = json.dumps(data, ensure_ascii=False).encode('utf-8')
                    self.send_response(200)
                    self.send_header('Content-Type', 'application/json; charset=utf-8')
                    self.send_header('Content-Length', str(len(body)))
                    self.end_headers()
                    self.wfile.write(body)
                    return
                except Exception:
                    pass
            self.send_response(200)
            body = json.dumps([], ensure_ascii=False).encode('utf-8')
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Content-Length', str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return

        super().do_GET()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path == '/api/accounts/sync':
            try:
                content_length = int(self.headers.get('Content-Length', 0))
                post_data = self.rfile.read(content_length)
                payload = json.loads(post_data.decode('utf-8'))

                accounts = load_accounts()
                items = payload if isinstance(payload, list) else [payload]
                for item in items:
                    if not item or not isinstance(item, dict) or not item.get('username'):
                        continue
                    clean_u = normalize_u(item['username'])
                    idx = next((i for i, acc in enumerate(accounts) if normalize_u(acc.get('username')) == clean_u), -1)
                    if idx >= 0:
                        accounts[idx].update(item)
                    else:
                        accounts.append(item)
                save_accounts(accounts)

                resp = json.dumps({'status': 'ok', 'count': len(accounts)}).encode('utf-8')
                self.send_response(200)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.send_header('Content-Length', str(len(resp)))
                self.end_headers()
                self.wfile.write(resp)
            except Exception as e:
                self.send_response(500)
                err_resp = json.dumps({'status': 'error', 'message': str(e)}).encode('utf-8')
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.send_header('Content-Length', str(len(err_resp)))
                self.end_headers()
                self.wfile.write(err_resp)
            return
        self.send_response(404)
        self.end_headers()

Handler = NoCacheHandler
Handler.extensions_map.update({
    '.js': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.json': 'application/json; charset=utf-8',
    '.html': 'text/html; charset=utf-8',
    '.mp3': 'audio/mpeg',
})

class ThreadingTCPServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    daemon_threads = True
    allow_reuse_address = True

def main():
    global PORT
    local_ip = get_local_ip()

    print("=" * 66)
    print("  Монгол хэл ｜ モンゴル語学習ノート（Webサーバー起動中）")
    print("=" * 66)
    print()
    print("  💻 【このPCで開く場合】")
    print(f"     http://localhost:{PORT}")
    print()
    print("  📱 【タブレット・スマホ（iPad / Android / iPhone）で開く場合】")
    print(f"     http://{local_ip}:{PORT}")
    print()
    print(f"     ※ タブレットをこのPCと同じWi-Fiに接続し、SafariやChromeに")
    print(f"       「 http://{local_ip}:{PORT} 」と入力してください。")
    print("=" * 66)
    print("終了するには Ctrl+C を押してください。\n")

    # ブラウザを自動で開く
    try:
        webbrowser.open(f"http://localhost:{PORT}")
    except Exception as e:
        print("Could not auto-launch browser:", e)

    try:
        with ThreadingTCPServer(("0.0.0.0", PORT), Handler) as httpd:
            httpd.serve_forever()
    except OSError:
        PORT = 8080
        print(f"\n※ ポート5173が使用中のため、ポート {PORT} で起動します:")
        print(f"  PC: http://localhost:{PORT}")
        print(f"  タブレット: http://{local_ip}:{PORT}\n")
        try:
            webbrowser.open(f"http://localhost:{PORT}")
            with ThreadingTCPServer(("0.0.0.0", PORT), Handler) as httpd:
                httpd.serve_forever()
        except Exception as err:
            print("Server error:", err)
    except KeyboardInterrupt:
        print("\nサーバーを停止しました。")
        sys.exit(0)

if __name__ == '__main__':
    main()
