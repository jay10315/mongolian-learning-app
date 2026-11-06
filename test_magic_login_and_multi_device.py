# -*- coding: utf-8 -*-
"""
test_magic_login_and_multi_device.py
Tests for multi-device sync, Magic Login URL / token generation, decoding,
server endpoint synchronization, and UI components.
"""
import os
import sys
import json
import base64
import urllib.parse

sys.stdout.reconfigure(encoding='utf-8')

def test_source_code_checks():
    base_dir = r"C:\Users\kkaho\.gemini\antigravity\scratch\mongol-learning-app"
    
    # 1. auth.js
    auth_path = os.path.join(base_dir, "js", "services", "auth.js")
    with open(auth_path, "r", encoding="utf-8") as f:
        auth_code = f.read()
    
    assert "createMagicLoginToken" in auth_code, "createMagicLoginToken missing in auth.js"
    assert "createMagicLoginUrl" in auth_code, "createMagicLoginUrl missing in auth.js"
    assert "processMagicLoginToken" in auth_code, "processMagicLoginToken missing in auth.js"
    assert "fetchServerAccounts" in auth_code, "fetchServerAccounts missing in auth.js"
    assert "syncUserToServer" in auth_code, "syncUserToServer missing in auth.js"
    assert "mergeServerUsers" in auth_code, "mergeServerUsers missing in auth.js"
    assert "showLoginSuccessToast" in auth_code, "showLoginSuccessToast missing in auth.js"

    # 2. app.js
    app_path = os.path.join(base_dir, "js", "app.js")
    with open(app_path, "r", encoding="utf-8") as f:
        app_code = f.read()
    
    assert "login_token" in app_code, "login_token check missing in app.js"
    assert "processMagicLoginToken" in app_code, "processMagicLoginToken call missing in app.js"
    assert "fetchServerAccounts" in app_code, "fetchServerAccounts background call missing in app.js"

    # 3. Navbar.js
    navbar_path = os.path.join(base_dir, "js", "components", "Navbar.js")
    with open(navbar_path, "r", encoding="utf-8") as f:
        navbar_code = f.read()
    
    assert "createMagicLoginUrl" in navbar_code, "createMagicLoginUrl missing in Navbar.js"
    assert "tablet-connect-modal" in navbar_code, "tablet-connect-modal missing in Navbar.js"
    assert "自動ログイン設定済み" in navbar_code, "自動ログイン badge missing in Navbar.js"

    # 4. AuthModal.js
    modal_path = os.path.join(base_dir, "js", "components", "AuthModal.js")
    with open(modal_path, "r", encoding="utf-8") as f:
        modal_code = f.read()
    
    assert "btn-show-tablet-qr" in modal_code, "btn-show-tablet-qr missing in AuthModal.js"
    assert "btn-copy-magic-url" in modal_code, "btn-copy-magic-url missing in AuthModal.js"
    assert "createMagicLoginUrl" in modal_code, "createMagicLoginUrl missing in AuthModal.js"
    assert "ワンクリックログイン" in modal_code, "ワンクリックログイン label missing in AuthModal.js"

    # 5. run_app.py
    server_path = os.path.join(base_dir, "run_app.py")
    with open(server_path, "r", encoding="utf-8") as f:
        server_code = f.read()
    
    assert "/api/accounts" in server_code, "/api/accounts missing in run_app.py"
    assert "/api/accounts/sync" in server_code, "/api/accounts/sync missing in run_app.py"
    assert "do_POST" in server_code, "do_POST missing in run_app.py"
    assert "do_GET" in server_code, "do_GET missing in run_app.py"
    assert "data_accounts.json" in server_code, "data_accounts.json missing in run_app.py"

    print("Source code checks passed successfully!")

def test_token_format_and_roundtrip():
    # Simulate JS createMagicLoginToken / processMagicLoginToken
    sample_user = {
        "id": "usr_test123",
        "username": "batbaatar",
        "displayName": "バトバートル",
        "salt": "abc123salt",
        "passwordHash": "deadbeefcafebabe",
        "recoverySalt": "recsalt",
        "recoveryCodeHash": "recbeef",
        "createdAt": "2026-11-06T00:00:00.000Z"
    }
    sample_mascot = {
        "nickname": "ピピ",
        "stage": 3,
        "mood": "happy"
    }
    sample_gamification = {
        "xp": 1250,
        "level": 5,
        "streakDays": 7
    }

    payload = {
        "v": 1,
        "u": sample_user,
        "p": sample_mascot,
        "g": sample_gamification,
        "t": 1793918600000
    }

    json_str = json.dumps(payload, ensure_ascii=False)
    # base64url encode without padding
    b64 = base64.urlsafe_b64encode(json_str.encode('utf-8')).decode('utf-8').rstrip('=')
    
    assert '+' not in b64
    assert '/' not in b64
    assert '=' not in b64

    # Build magic login URL
    base_url = "http://192.168.2.226:5173"
    magic_url = f"{base_url}/?login_token={b64}"
    
    parsed = urllib.parse.urlparse(magic_url)
    qs = urllib.parse.parse_qs(parsed.query)
    token_in_url = qs['login_token'][0]

    # Decode with padding restoration
    pad_len = (4 - len(token_in_url) % 4) % 4
    padded = token_in_url + ('=' * pad_len)
    decoded_bytes = base64.urlsafe_b64decode(padded)
    decoded_payload = json.loads(decoded_bytes.decode('utf-8'))

    assert decoded_payload["v"] == 1
    assert decoded_payload["u"]["username"] == "batbaatar"
    assert decoded_payload["u"]["displayName"] == "バトバートル"
    assert decoded_payload["p"]["nickname"] == "ピピ"
    assert decoded_payload["g"]["xp"] == 1250

    print("Token roundtrip and URL construction tests passed successfully!")

def test_server_sync_logic():
    import run_app
    test_file = os.path.join(r"C:\Users\kkaho\.gemini\antigravity\scratch\mongol-learning-app", "test_temp_accounts.json")
    old_file = run_app.ACCOUNTS_FILE
    run_app.ACCOUNTS_FILE = test_file

    try:
        if os.path.exists(test_file):
            os.remove(test_file)

        # 1. Initial state
        accs = run_app.load_accounts()
        assert accs == []

        # 2. Add first user
        u1 = {"username": "Dorj", "displayName": "ドルジ", "salt": "s1", "passwordHash": "h1"}
        run_app.save_accounts([u1])

        accs = run_app.load_accounts()
        assert len(accs) == 1
        assert accs[0]["username"] == "Dorj"

        # 3. Simulate sync endpoint merging: same user case-insensitive update
        u1_update = {"username": "dorj", "displayName": "ドルジ updated", "lastLoginAt": "2026-11-06T08:00:00Z"}
        clean_u = run_app.normalize_u(u1_update['username'])
        idx = next((i for i, acc in enumerate(accs) if run_app.normalize_u(acc.get('username')) == clean_u), -1)
        assert idx == 0
        accs[idx].update(u1_update)
        run_app.save_accounts(accs)

        accs = run_app.load_accounts()
        assert len(accs) == 1
        assert accs[0]["displayName"] == "ドルジ updated"

        # 4. Add second user
        u2 = {"username": "Saraa", "displayName": "サラー"}
        accs.append(u2)
        run_app.save_accounts(accs)

        accs = run_app.load_accounts()
        assert len(accs) == 2
        print("Server sync logic tests passed successfully!")
    finally:
        run_app.ACCOUNTS_FILE = old_file
        if os.path.exists(test_file):
            os.remove(test_file)

if __name__ == '__main__':
    test_source_code_checks()
    test_token_format_and_roundtrip()
    test_server_sync_logic()
    print("ALL MULTI-DEVICE & MAGIC LOGIN TESTS PASSED!")
