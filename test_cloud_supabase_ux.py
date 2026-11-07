# -*- coding: utf-8 -*-
import unittest
import os
import re

class TestCloudSupabaseUX(unittest.TestCase):
    def setUp(self):
        self.modal_path = 'js/components/CloudSettingsModal.js'
        self.sync_path = 'js/services/sync.js'
        self.schema_path = 'supabase_schema.sql'
        self.app_path = 'js/app.js'
        self.auth_path = 'js/services/auth.js'
        self.helpers_path = 'js/utils/helpers.js'

    def test_schema_contains_all_tables_including_snapshot(self):
        with open(self.schema_path, encoding='utf-8') as f:
            sql = f.read()
        self.assertIn('user_accounts', sql)
        self.assertIn('user_word_progress', sql)
        self.assertIn('user_mistakes', sql)
        self.assertIn('user_history', sql)
        self.assertIn('user_sync_snapshot', sql)
        self.assertIn('ENABLE ROW LEVEL SECURITY', sql)

    def test_modal_has_sql_copy_and_diagnosis(self):
        with open(self.modal_path, encoding='utf-8') as f:
            code = f.read()
        self.assertIn('btn-copy-schema-sql', code)
        self.assertIn('SUPABASE_SCHEMA_SQL', code)
        self.assertIn('btn-test-connection', code)
        self.assertIn('user_sync_snapshot', code)
        self.assertIn('user_mistakes', code)
        self.assertIn('btn-manual-push', code)
        self.assertIn('btn-manual-pull', code)
        self.assertIn('btn-copy-share-url', code)

    def test_sync_has_universal_snapshot_fallback(self):
        with open(self.sync_path, encoding='utf-8') as f:
            code = f.read()
        self.assertIn('user_sync_snapshot', code)
        self.assertIn('pushAllLocalDataToCloud', code)
        self.assertIn('pullFromCloud', code)

    def test_app_handles_url_params_for_supabase(self):
        with open(self.app_path, encoding='utf-8') as f:
            code = f.read()
        self.assertIn('sb_url', code)
        self.assertIn('sb_key', code)
        self.assertIn('SyncService.saveConfig', code)
        self.assertIn('SyncService.pullFromCloud', code)

    def test_auth_safely_parses_backup_and_token(self):
        with open(self.auth_path, encoding='utf-8') as f:
            code = f.read()
        self.assertIn('importBackupData', code)
        self.assertIn('sb_url', code)
        self.assertIn('processMagicLoginToken', code)

    def test_e_and_shch_keyboard_row2_upper_right(self):
        with open(self.helpers_path, encoding='utf-8') as f:
            code = f.read()
        # Find row2 block up to row3:
        m = re.search(r'row2:\s*\[(.*?)\],\s*row3:', code, re.DOTALL)
        self.assertIsNotNone(m, "row2 array not found in helpers.js")
        row2_str = m.group(1)
        # Check that 'е' and 'щ' are in row2
        self.assertIn("'е'", row2_str)
        self.assertIn("'щ'", row2_str)
        # Check that 'е' comes after 'ъ'
        pos_hard = row2_str.find("'ъ'")
        pos_e = row2_str.find("'е'")
        pos_shch = row2_str.find("'щ'")
        self.assertTrue(pos_hard < pos_e < pos_shch, "е and щ must be placed at the right of ъ in row2")

if __name__ == '__main__':
    unittest.main()
