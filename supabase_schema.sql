-- ====================================================================
-- モンゴル語学習ノート (Монгол хэл) クラウドデータベース スキーマ
-- Supabase (PostgreSQL) 向けマイグレーション・テーブル定義
-- ※ SQL Editor に貼り付けて「Run」を実行するだけで完了します
-- ====================================================================

-- 1. ユーザーアカウント（ユーザー名＋パスワードハッシュ＋ワンタイム復旧コード）
CREATE TABLE IF NOT EXISTS public.user_accounts (
  id TEXT PRIMARY KEY,
  username VARCHAR(64) UNIQUE NOT NULL,
  display_name TEXT,
  salt TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  recovery_salt TEXT NOT NULL,
  recovery_code_hash TEXT NOT NULL,
  recovery_used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_user_accounts_username_lower 
ON public.user_accounts (LOWER(username));

-- 2. 単語SRS忘却曲線進捗テーブル（単語ごとの習熟度・次回復習日・正誤回数）
CREATE TABLE IF NOT EXISTS public.user_word_progress (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  word_id TEXT NOT NULL,
  srs_level INT DEFAULT 0,
  interval_days INT DEFAULT 0,
  next_review_date DATE,
  last_learned_at TIMESTAMPTZ,
  study_count INT DEFAULT 0,
  correct_count INT DEFAULT 0,
  wrong_count INT DEFAULT 0,
  accuracy INT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_user_word UNIQUE(user_id, word_id)
);

CREATE INDEX IF NOT EXISTS idx_word_progress_user_due 
ON public.user_word_progress (user_id, next_review_date);

-- 3. 間違いノート（苦手問題の永続保存・別端末同期）
CREATE TABLE IF NOT EXISTS public.user_mistakes (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  question TEXT NOT NULL,
  correct_answer TEXT NOT NULL,
  user_answer TEXT,
  type VARCHAR(32) DEFAULT 'word',
  category VARCHAR(64) DEFAULT '単語',
  explanation TEXT,
  wrong_count INT DEFAULT 1,
  last_wrong_date TIMESTAMPTZ DEFAULT NOW(),
  resolved BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_mistakes_user 
ON public.user_mistakes (user_id, resolved);

-- 4. 学習履歴テーブル
CREATE TABLE IF NOT EXISTS public.user_history (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  type VARCHAR(32) DEFAULT 'word',
  total INT DEFAULT 0,
  correct INT DEFAULT 0,
  category VARCHAR(64),
  mode VARCHAR(32),
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_history_user 
ON public.user_history (user_id, timestamp DESC);

-- 5. 万能同期スナップショット（全学習データまるごと即時同期フォールバック）
CREATE TABLE IF NOT EXISTS public.user_sync_snapshot (
  user_id TEXT PRIMARY KEY,
  username TEXT NOT NULL,
  payload JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Row Level Security (RLS) の有効化と誰でも安全にアクセスできる許可ポリシー
ALTER TABLE public.user_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_word_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_mistakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sync_snapshot ENABLE ROW LEVEL SECURITY;

-- 既存ポリシーの安全なリセット＆再作成
DROP POLICY IF EXISTS "Allow anon read/write word_progress" ON public.user_word_progress;
CREATE POLICY "Allow anon read/write word_progress" ON public.user_word_progress FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon read/write mistakes" ON public.user_mistakes;
CREATE POLICY "Allow anon read/write mistakes" ON public.user_mistakes FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon read/write history" ON public.user_history;
CREATE POLICY "Allow anon read/write history" ON public.user_history FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon read/write user_accounts" ON public.user_accounts;
CREATE POLICY "Allow anon read/write user_accounts" ON public.user_accounts FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon read/write sync_snapshot" ON public.user_sync_snapshot;
CREATE POLICY "Allow anon read/write sync_snapshot" ON public.user_sync_snapshot FOR ALL USING (true) WITH CHECK (true);
