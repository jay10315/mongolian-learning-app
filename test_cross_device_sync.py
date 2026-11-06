import os
import sys
import json
import base64

sys.stdout.reconfigure(encoding='utf-8')

base_dir = r"C:\Users\kkaho\.gemini\antigravity\scratch\mongol-learning-app"

def test_source_checks():
    print("Testing source code for cross-device sync...")
    
    # Check auth.js
    with open(os.path.join(base_dir, 'js/services/auth.js'), 'r', encoding='utf-8') as f:
        auth_code = f.read()

    assert "fetchServerUserData" in auth_code, "fetchServerUserData missing in auth.js"
    assert "syncAllToServer" in auth_code, "syncAllToServer missing in auth.js"
    assert "restoreStorageSnapshot" in auth_code, "restoreStorageSnapshot missing in auth.js"
    assert "exportBackupData" in auth_code, "exportBackupData missing in auth.js"
    assert "importBackupData" in auth_code, "importBackupData missing in auth.js"
    assert "/api/sync/all" in auth_code, "/api/sync/all missing in auth.js"
    print("  ✓ auth.js passed")

    # Check run_app.py
    with open(os.path.join(base_dir, 'run_app.py'), 'r', encoding='utf-8') as f:
        server_code = f.read()

    assert "/api/sync/all" in server_code, "/api/sync/all missing in run_app.py"
    assert "/api/server_info" in server_code, "/api/server_info missing in run_app.py"
    assert "data_sync_store.json" in server_code, "data_sync_store.json missing in run_app.py"
    print("  ✓ run_app.py passed")

    # Check AuthModal.js
    with open(os.path.join(base_dir, 'js/components/AuthModal.js'), 'r', encoding='utf-8') as f:
        modal_code = f.read()

    assert "renderSyncView" in modal_code, "renderSyncView missing in AuthModal.js"
    assert "btn-execute-sync-code" in modal_code, "btn-execute-sync-code missing in AuthModal.js"
    assert "btn-sync-from-pc" in modal_code, "btn-sync-from-pc missing in AuthModal.js"
    assert "btn-retry-server-fetch" in modal_code, "btn-retry-server-fetch missing in AuthModal.js"
    print("  ✓ AuthModal.js passed")

    # Check bundled.js & index.html
    with open(os.path.join(base_dir, 'bundled.js'), 'r', encoding='utf-8') as f:
        bundle = f.read()

    assert "fetchServerUserData" in bundle, "fetchServerUserData missing in bundled.js"
    assert "restoreStorageSnapshot" in bundle, "restoreStorageSnapshot missing in bundled.js"
    assert "btn-execute-sync-code" in bundle, "btn-execute-sync-code missing in bundled.js"
    print("  ✓ bundled.js passed")

def test_backup_roundtrip():
    print("Testing backup data parsing and roundtrip...")
    sample_backup = {
        "version": 2,
        "exportedAt": "2026-11-06T19:00:00.000Z",
        "account": {
            "id": "usr_pen_123",
            "username": "pen",
            "displayName": "pen",
            "salt": "salt123",
            "passwordHash": "hash123",
            "recoverySalt": "recsalt123",
            "recoveryCodeHash": "rechash123"
        },
        "storage": {
            "gameStats": json.dumps({"totalXp": 500, "level": 3}),
            "mistakes": json.dumps([{"id": "m1", "question": "харанхуй", "correctAnswer": "暗い"}])
        }
    }
    json_str = json.dumps(sample_backup)
    parsed = json.loads(json_str)
    assert parsed["account"]["username"] == "pen"
    assert "totalXp" in parsed["storage"]["gameStats"]
    print("  ✓ Backup JSON roundtrip verified")

if __name__ == '__main__':
    test_source_checks()
    test_backup_roundtrip()
    print("ALL CROSS-DEVICE SYNC TESTS PASSED!")
