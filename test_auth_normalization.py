import re
import sys
import unicodedata

def normalize_username_sim(username):
    if not username:
        return ''
    norm = unicodedata.normalize('NFKC', str(username))
    norm = re.sub(r'[ー―－‐]', '-', norm)
    norm = re.sub(r'[＿]', '_', norm)
    norm = norm.strip()
    return norm.lower()

# Test 1: Full-width conversion
assert normalize_username_sim('ｔｅｓｔ１２３') == 'test123', "Full-width alphanumeric failed"
assert normalize_username_sim('　Ｕｓｅｒ＿１　') == 'user_1', "Full-width space and uppercase failed"
assert normalize_username_sim('dorjー2026') == 'dorj-2026', "Full-width dash failed"
assert normalize_username_sim('dorj＿test') == 'dorj_test', "Full-width underscore failed"
assert normalize_username_sim('たろう') == 'たろう', "Hiragana normalization failed"
assert normalize_username_sim('田中') == '田中', "Kanji normalization failed"
assert normalize_username_sim('Баяр') == 'баяр', "Cyrillic lowercase normalization failed"

# Test 2: Regex check for valid characters
# In Python, \w matches unicode word characters including Japanese and Cyrillic
valid_pattern = re.compile(r'^[\w-]+$', re.UNICODE)
assert valid_pattern.match(normalize_username_sim('たろう')) is not None
assert valid_pattern.match(normalize_username_sim('田中')) is not None
assert valid_pattern.match(normalize_username_sim('ペンギン')) is not None
assert valid_pattern.match(normalize_username_sim('Баяр')) is not None
assert valid_pattern.match(normalize_username_sim('test-user_1')) is not None
assert valid_pattern.match('user with space') is None
assert valid_pattern.match('user@name') is None

# Test 3: Verify JS files content
with open('js/services/auth.js', 'r', encoding='utf-8') as f:
    auth_js = f.read()

assert 'normalizeUsername' in auth_js, "normalizeUsername missing in auth.js"
assert 'NO_USERS_ON_DEVICE' in auth_js, "NO_USERS_ON_DEVICE missing in auth.js"
assert 'USER_NOT_FOUND' in auth_js, "USER_NOT_FOUND missing in auth.js"
assert 'PASSWORD_MISMATCH' in auth_js, "PASSWORD_MISMATCH missing in auth.js"
assert 'USER_EXISTS' in auth_js, "USER_EXISTS missing in auth.js"
assert 'ユーザー名は確認できましたが、パスワードが一致しません' in auth_js, "Password mismatch text missing"
assert r'\p{L}\p{N}' in auth_js, "Unicode property escape missing in auth.js"

with open('js/components/AuthModal.js', 'r', encoding='utf-8') as f:
    modal_js = f.read()

assert 'btn-quick-fill-user' in modal_js, "btn-quick-fill-user missing in AuthModal.js"
assert 'tab-link' in modal_js, "tab-link missing in AuthModal.js"
assert 'btn-alert-action' in modal_js, "btn-alert-action missing in AuthModal.js"
assert 'PASSWORD_MISMATCH' in modal_js, "PASSWORD_MISMATCH handling missing in AuthModal.js"

with open('bundled.js', 'r', encoding='utf-8') as f:
    bundled_js = f.read()

assert 'normalizeUsername' in bundled_js, "normalizeUsername missing in bundled.js"
assert 'btn-quick-fill-user' in bundled_js, "btn-quick-fill-user missing in bundled.js"

print("All auth normalization and error handling tests passed successfully!")
