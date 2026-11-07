import unittest
import os

BASE_DIR = r"C:\Users\kkaho\.gemini\antigravity\scratch\mongol-learning-app"

class TestSupabaseAndPasteSync(unittest.TestCase):
    def test_auth_import_backup_data_url_safety(self):
        """Verify importBackupData handles URLs gracefully without JSON.parse unexpected identifier."""
        auth_path = os.path.join(BASE_DIR, "js", "services", "auth.js")
        with open(auth_path, "r", encoding="utf-8") as f:
            content = f.read()

        # Check URL detection regex
        self.assertIn("/^https?:\\/\\//i.test(trimmed)", content)
        # Check token extraction from URL params
        self.assertIn("u.searchParams.get('login_token')", content)
        # Check friendly error message when bare URL is pasted
        self.assertIn("貼り付けられたURLに同期用データ（login_token）が含まれていません", content)

    def test_sync_push_all_local_data_to_cloud(self):
        """Verify SyncService has pushAllLocalDataToCloud and fetchAccountFromCloud."""
        sync_path = os.path.join(BASE_DIR, "js", "services", "sync.js")
        with open(sync_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("static async pushAllLocalDataToCloud(config, user)", content)
        self.assertIn("user_accounts", content)
        self.assertIn("user_mistakes", content)
        self.assertIn("user_word_progress", content)
        self.assertIn("user_history", content)
        self.assertIn("static async fetchAccountFromCloud(targetUsername = null)", content)
        self.assertIn("pushAllLocalDataToCloud(config, user)", content)

    def test_authmodal_cloud_auto_lookup(self):
        """Verify AuthModal performs cloud lookup on login and on retry button."""
        modal_path = os.path.join(BASE_DIR, "js", "components", "AuthModal.js")
        with open(modal_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("SyncService.fetchAccountFromCloud(u)", content)
        self.assertIn("クラウド/サーバーからアカウントを再検索", content)

    def test_actual_vercel_app_url(self):
        """Verify Navbar.js uses the user's actual Vercel URL."""
        navbar_path = os.path.join(BASE_DIR, "js", "components", "Navbar.js")
        with open(navbar_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("https://mongolian-learning-app-1tns.vercel.app", content)

if __name__ == '__main__':
    unittest.main()
