// クラウド同期設定モーダル（Supabase接続・診断・自動設定QR・手動Push/Pull）
import { SyncService } from '../services/sync.js';
import { AuthService } from '../services/auth.js';
import { QRCodeGenerator, QRErrorCorrectLevel } from '../utils/qrcode.js';

export const SUPABASE_SCHEMA_SQL = '-- ====================================================================\n-- モンゴル語学習ノート (Монгол хэл) クラウドデータベース スキーマ\n-- Supabase (PostgreSQL) 向けマイグレーション・テーブル定義\n-- ※ SQL Editor に貼り付けて「Run」を実行するだけで完了します\n-- ====================================================================\n\n-- 1. ユーザーアカウント（ユーザー名＋パスワードハッシュ＋ワンタイム復旧コード）\nCREATE TABLE IF NOT EXISTS public.user_accounts (\n  id TEXT PRIMARY KEY,\n  username VARCHAR(64) UNIQUE NOT NULL,\n  display_name TEXT,\n  salt TEXT NOT NULL,\n  password_hash TEXT NOT NULL,\n  recovery_salt TEXT NOT NULL,\n  recovery_code_hash TEXT NOT NULL,\n  recovery_used BOOLEAN DEFAULT FALSE,\n  created_at TIMESTAMPTZ DEFAULT NOW(),\n  last_login_at TIMESTAMPTZ DEFAULT NOW()\n);\n\nCREATE UNIQUE INDEX IF NOT EXISTS idx_user_accounts_username_lower \nON public.user_accounts (LOWER(username));\n\n-- 2. 単語SRS忘却曲線進捗テーブル（単語ごとの習熟度・次回復習日・正誤回数）\nCREATE TABLE IF NOT EXISTS public.user_word_progress (\n  id BIGSERIAL PRIMARY KEY,\n  user_id TEXT NOT NULL,\n  word_id TEXT NOT NULL,\n  srs_level INT DEFAULT 0,\n  interval_days INT DEFAULT 0,\n  next_review_date DATE,\n  last_learned_at TIMESTAMPTZ,\n  study_count INT DEFAULT 0,\n  correct_count INT DEFAULT 0,\n  wrong_count INT DEFAULT 0,\n  accuracy INT DEFAULT 0,\n  updated_at TIMESTAMPTZ DEFAULT NOW(),\n  CONSTRAINT uq_user_word UNIQUE(user_id, word_id)\n);\n\nCREATE INDEX IF NOT EXISTS idx_word_progress_user_due \nON public.user_word_progress (user_id, next_review_date);\n\n-- 3. 間違いノート（苦手問題の永続保存・別端末同期）\nCREATE TABLE IF NOT EXISTS public.user_mistakes (\n  id TEXT PRIMARY KEY,\n  user_id TEXT NOT NULL,\n  question TEXT NOT NULL,\n  correct_answer TEXT NOT NULL,\n  user_answer TEXT,\n  type VARCHAR(32) DEFAULT \'word\',\n  category VARCHAR(64) DEFAULT \'単語\',\n  explanation TEXT,\n  wrong_count INT DEFAULT 1,\n  last_wrong_date TIMESTAMPTZ DEFAULT NOW(),\n  resolved BOOLEAN DEFAULT FALSE,\n  updated_at TIMESTAMPTZ DEFAULT NOW()\n);\n\nCREATE INDEX IF NOT EXISTS idx_user_mistakes_user \nON public.user_mistakes (user_id, resolved);\n\n-- 4. 学習履歴テーブル\nCREATE TABLE IF NOT EXISTS public.user_history (\n  id TEXT PRIMARY KEY,\n  user_id TEXT NOT NULL,\n  type VARCHAR(32) DEFAULT \'word\',\n  total INT DEFAULT 0,\n  correct INT DEFAULT 0,\n  category VARCHAR(64),\n  mode VARCHAR(32),\n  timestamp TIMESTAMPTZ DEFAULT NOW()\n);\n\nCREATE INDEX IF NOT EXISTS idx_user_history_user \nON public.user_history (user_id, timestamp DESC);\n\n-- 5. 万能同期スナップショット（全学習データまるごと即時同期フォールバック）\nCREATE TABLE IF NOT EXISTS public.user_sync_snapshot (\n  user_id TEXT PRIMARY KEY,\n  username TEXT NOT NULL,\n  payload JSONB NOT NULL,\n  updated_at TIMESTAMPTZ DEFAULT NOW()\n);\n\n-- 6. Row Level Security (RLS) の有効化と誰でも安全にアクセスできる許可ポリシー\nALTER TABLE public.user_accounts ENABLE ROW LEVEL SECURITY;\nALTER TABLE public.user_word_progress ENABLE ROW LEVEL SECURITY;\nALTER TABLE public.user_mistakes ENABLE ROW LEVEL SECURITY;\nALTER TABLE public.user_history ENABLE ROW LEVEL SECURITY;\nALTER TABLE public.user_sync_snapshot ENABLE ROW LEVEL SECURITY;\n\n-- 既存ポリシーの安全なリセット＆再作成\nDROP POLICY IF EXISTS "Allow anon read/write word_progress" ON public.user_word_progress;\nCREATE POLICY "Allow anon read/write word_progress" ON public.user_word_progress FOR ALL USING (true) WITH CHECK (true);\n\nDROP POLICY IF EXISTS "Allow anon read/write mistakes" ON public.user_mistakes;\nCREATE POLICY "Allow anon read/write mistakes" ON public.user_mistakes FOR ALL USING (true) WITH CHECK (true);\n\nDROP POLICY IF EXISTS "Allow anon read/write history" ON public.user_history;\nCREATE POLICY "Allow anon read/write history" ON public.user_history FOR ALL USING (true) WITH CHECK (true);\n\nDROP POLICY IF EXISTS "Allow anon read/write user_accounts" ON public.user_accounts;\nCREATE POLICY "Allow anon read/write user_accounts" ON public.user_accounts FOR ALL USING (true) WITH CHECK (true);\n\nDROP POLICY IF EXISTS "Allow anon read/write sync_snapshot" ON public.user_sync_snapshot;\nCREATE POLICY "Allow anon read/write sync_snapshot" ON public.user_sync_snapshot FOR ALL USING (true) WITH CHECK (true);\n';

export class CloudSettingsModal {
  static modalContainer = null;
  static onConfigSaved = null;

  static show(onConfigSaved) {
    this.onConfigSaved = onConfigSaved;
    this.render();
  }

  static close() {
    if (this.modalContainer && this.modalContainer.parentNode) {
      this.modalContainer.parentNode.removeChild(this.modalContainer);
      this.modalContainer = null;
    }
  }

  static render() {
    if (!this.modalContainer) {
      this.modalContainer = document.createElement('div');
      this.modalContainer.id = 'cloud-settings-modal-root';
      this.modalContainer.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in';
      document.body.appendChild(this.modalContainer);
    }

    const currentConfig = SyncService.getConfig() || {};
    const user = (typeof AuthService !== 'undefined' && AuthService.getCurrentUser) ? AuthService.getCurrentUser() : null;
    const queue = SyncService.getQueue ? SyncService.getQueue() : [];

    // ローカルデータの集計
    let mistakeCount = 0;
    try {
      const mistakes = JSON.parse(localStorage.getItem('mongol_app_mistakes_v1') || '[]');
      mistakeCount = Array.isArray(mistakes) ? mistakes.length : 0;
    } catch (_) {}

    let progressCount = 0;
    try {
      const prog = JSON.parse(localStorage.getItem('mongol_app_srs_progress_v1') || '{}');
      progressCount = Object.keys(prog).length;
    } catch (_) {}

    // スマホ連携用URLの構築
    const vercelBase = 'https://mongolian-learning-app-1tns.vercel.app';
    let shareUrl = '';
    let qrSvg = '';
    if (currentConfig.supabaseUrl && currentConfig.supabaseAnonKey) {
      const params = new URLSearchParams();
      params.set('sb_url', currentConfig.supabaseUrl);
      params.set('sb_key', currentConfig.supabaseAnonKey);
      if (user) {
        params.set('u', user.username || 'pen');
        params.set('auto_sync', '1');
      }
      shareUrl = `${vercelBase}/?${params.toString()}`;
      try {
        qrSvg = QRCodeGenerator.generateSvg(shareUrl, {
          size: 190,
          errorCorrectionLevel: QRErrorCorrectLevel.M,
          margin: 2
        });
      } catch (e) {
        console.warn('QR code generation failed:', e);
      }
    }

    this.modalContainer.innerHTML = `
      <div class="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        <!-- ヘッダー -->
        <div class="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 px-6 py-4 text-white flex items-center justify-between shrink-0">
          <div class="flex items-center gap-2.5">
            <span class="text-2xl">☁️</span>
            <div>
              <h3 class="font-black text-base tracking-wide">Supabase クラウド同期</h3>
              <p class="text-[11px] text-slate-300">間違えた問題・進捗・ペンギンを全端末で同期</p>
            </div>
          </div>
          <button type="button" id="btn-close-cloud-modal" class="text-white/70 hover:text-white text-xl font-bold p-1 cursor-pointer">
            ✕
          </button>
        </div>

        <!-- スクロールエリア -->
        <div class="p-5 sm:p-6 space-y-5 overflow-y-auto">
          
          <!-- 現在のステータスバナー -->
          <div class="p-3.5 rounded-xl border flex items-center justify-between text-xs ${
            currentConfig.supabaseUrl ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-amber-50 border-amber-200 text-amber-900'
          }">
            <div class="space-y-0.5">
              <div class="font-bold flex items-center gap-1.5">
                <span>${currentConfig.supabaseUrl ? '🟢' : '🟡'}</span>
                <span>${currentConfig.supabaseUrl ? 'Supabase設定済み' : 'クラウド未設定（ローカル保存中）'}</span>
              </div>
              <div class="text-[11px] opacity-80">
                ローカル保存状況: 間違えた問題 <strong>${mistakeCount}</strong> 件 / 単語進捗 <strong>${progressCount}</strong> 件
              </div>
            </div>
            ${user ? `<span class="bg-white/80 px-2 py-1 rounded-md text-[10px] font-bold border border-slate-200">ユーザー: ${user.displayName || user.username}</span>` : ''}
          </div>

          <!-- 手順1: SQLコピー案内（超重要ステップ） -->
          <div class="bg-indigo-50 border-2 border-indigo-200 rounded-2xl p-4 space-y-2.5">
            <div class="flex items-center justify-between">
              <span class="text-xs font-black text-indigo-950 flex items-center gap-1.5">
                <span class="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">1</span>
                <span>Supabaseにテーブルを自動作成（初回のみ）</span>
              </span>
              <span class="text-[10px] bg-indigo-200 text-indigo-900 px-2 py-0.5 rounded-full font-bold">必須</span>
            </div>
            <p class="text-xs text-indigo-900 leading-relaxed">
              Supabaseの管理画面左メニュー「<strong>SQL Editor</strong>」を開き、下のボタンでコピーしたSQLを貼り付けて「<strong>Run ▶</strong>」を押してください。間違えた問題や進捗を保存する全テーブルが一発で完成します。
            </p>
            <div class="flex gap-2">
              <button type="button" id="btn-copy-schema-sql" class="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer">
                <span>📋</span>
                <span id="btn-copy-schema-text">Supabase用SQLを1クリックコピー</span>
              </button>
              <button type="button" id="btn-toggle-sql-preview" class="py-2 px-3 bg-white hover:bg-indigo-100 text-indigo-800 text-xs font-bold rounded-xl border border-indigo-300 transition-colors cursor-pointer">
                SQLを見る
              </button>
            </div>
            <div id="sql-preview-box" class="hidden mt-2">
              <textarea readonly class="w-full h-32 p-2 text-[10px] font-mono bg-slate-900 text-emerald-400 rounded-lg border border-slate-700 focus:outline-hidden resize-none">${SUPABASE_SCHEMA_SQL}</textarea>
            </div>
          </div>

          <!-- 手順2: 接続設定フォーム -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs font-black text-slate-800 flex items-center gap-1.5">
                <span class="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[10px]">2</span>
                <span>SupabaseのURLとAPIキーを入力</span>
              </span>
            </div>

            <form id="form-cloud-config" class="space-y-3">
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">
                  Project URL <span class="text-rose-500">*</span>
                </label>
                <input type="url" id="input-supabase-url" value="${currentConfig.supabaseUrl || ''}" placeholder="https://xxxxxxxxxxxx.supabase.co" class="w-full text-xs p-2.5 border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-hidden">
                <p class="text-[10px] text-slate-400 mt-0.5">※ Supabase Dashboard → Settings → API → Project URL</p>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">
                  API Key (anon / public) <span class="text-rose-500">*</span>
                </label>
                <textarea id="input-supabase-anon-key" rows="2" placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." class="w-full text-xs p-2.5 border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-hidden">${currentConfig.supabaseAnonKey || ''}</textarea>
                <p class="text-[10px] text-slate-400 mt-0.5">※ Supabase Dashboard → Settings → API → Project API keys → anon (public)</p>
              </div>

              <div id="cloud-test-status" class="hidden p-3 rounded-xl text-xs font-medium leading-relaxed"></div>

              <div class="flex flex-col sm:flex-row gap-2 pt-1">
                <button type="button" id="btn-test-connection" class="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all border border-slate-300 flex items-center justify-center gap-1.5 cursor-pointer">
                  <span>🔍</span>
                  <span id="test-btn-text">接続＆テーブル自動診断</span>
                </button>
                <button type="submit" id="btn-save-cloud-config" class="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer">
                  <span>💾</span>
                  <span id="save-btn-text">設定を保存して今すぐ同期</span>
                </button>
              </div>
            </form>
          </div>

          <!-- 手順3: 今すぐ手動同期（Push / Pull） -->
          ${currentConfig.supabaseUrl ? `
            <div class="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-xs font-black text-slate-800 flex items-center gap-1.5">
                  <span class="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[10px]">3</span>
                  <span>即時データ同期（手動）</span>
                </span>
              </div>
              <p class="text-xs text-slate-600">
                学習後に確実にクラウドへ保存したい時や、他端末で学習した最新データを今すぐ取り込みたい時に押してください。
              </p>
              <div class="flex flex-col sm:flex-row gap-2">
                <button type="button" id="btn-manual-push" class="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer">
                  <span>☁️</span>
                  <span>今すぐクラウドへ全保存 (Push)</span>
                </button>
                <button type="button" id="btn-manual-pull" class="flex-1 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer">
                  <span>📲</span>
                  <span>クラウドから最新を受信 (Pull)</span>
                </button>
              </div>
              <div id="manual-sync-result" class="hidden p-2.5 rounded-xl text-xs font-semibold"></div>
            </div>
          ` : ''}

          <!-- 手順4: スマホへSupabase設定を共有（QRコード & URL） -->
          ${currentConfig.supabaseUrl ? `
            <div class="bg-amber-50/60 border border-amber-200 rounded-2xl p-4 space-y-3 text-center">
              <div class="text-left flex items-center justify-between">
                <span class="text-xs font-black text-amber-950 flex items-center gap-1.5">
                  <span class="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px]">4</span>
                  <span>スマホへSupabase設定を送る（手入力不要！）</span>
                </span>
                <span class="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full font-bold">1秒連携</span>
              </div>
              <p class="text-xs text-amber-900 text-left leading-relaxed">
                スマートフォンで長いURLやAPIキーを入力する必要はありません！<br>
                下のQRコードをスマートフォンのカメラで読み取るだけで、Supabase設定とアカウントが自動でセットされ、即座に同期が始まります。
              </p>

              <div class="inline-block p-3 bg-white rounded-2xl border-2 border-amber-200 shadow-sm mx-auto">
                <div class="w-48 h-48 mx-auto flex items-center justify-center overflow-hidden">
                  ${qrSvg || '<div class="text-xs text-rose-500">QRコードの生成に失敗しました</div>'}
                </div>
              </div>

              <div class="flex gap-2 max-w-md mx-auto">
                <input type="text" readonly value="${shareUrl}" class="flex-1 text-[11px] px-2.5 py-1.5 border border-amber-300 rounded-lg bg-white font-mono text-slate-600 truncate">
                <button type="button" id="btn-copy-share-url" class="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg shrink-0 cursor-pointer">
                  URLコピー
                </button>
              </div>
            </div>
          ` : ''}

          <!-- バックアップファイルでの確実な保存・復元 -->
          <div class="border-t border-slate-200 pt-3 space-y-2">
            <div class="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>💾 完全オフライン・JSONファイル保存:</span>
              <span class="text-[10px] text-slate-400">Supabaseなしでも100%確実</span>
            </div>
            <div class="flex gap-2">
              <button type="button" id="btn-download-backup-json" class="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold border border-slate-300 transition-colors flex items-center justify-center gap-1 cursor-pointer">
                <span>💾</span>
                <span>バックアップ保存 (.json)</span>
              </button>
              <label class="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold border border-slate-300 transition-colors flex items-center justify-center gap-1 cursor-pointer text-center">
                <span>📂</span>
                <span>ファイルから復元</span>
                <input type="file" id="input-restore-backup-file" accept=".json,application/json" class="hidden">
              </label>
            </div>
          </div>

          <!-- 設定リセット -->
          ${currentConfig.supabaseUrl ? `
            <div class="pt-2 text-center">
              <button type="button" id="btn-clear-cloud-config" class="text-xs text-rose-600 hover:text-rose-800 font-bold underline cursor-pointer">
                クラウド連携を解除（ローカル専用に戻す）
              </button>
            </div>
          ` : ''}

        </div>
      </div>
    `;

    this.bindEvents(currentConfig);
  }

  static bindEvents(currentConfig) {
    // 閉じる
    const closeBtn = this.modalContainer.querySelector('#btn-close-cloud-modal');
    if (closeBtn) closeBtn.addEventListener('click', () => this.close());

    // SQLコピーボタン
    const copySqlBtn = this.modalContainer.querySelector('#btn-copy-schema-sql');
    const copySqlText = this.modalContainer.querySelector('#btn-copy-schema-text');
    if (copySqlBtn) {
      copySqlBtn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(SUPABASE_SCHEMA_SQL);
          copySqlText.textContent = '✅ コピー完了！SupabaseのSQL Editorに貼り付けてRunを押してください';
          copySqlBtn.classList.remove('bg-indigo-600', 'hover:bg-indigo-700');
          copySqlBtn.classList.add('bg-emerald-600', 'hover:bg-emerald-700');
          setTimeout(() => {
            copySqlText.textContent = 'Supabase用SQLを1クリックコピー';
            copySqlBtn.classList.remove('bg-emerald-600', 'hover:bg-emerald-700');
            copySqlBtn.classList.add('bg-indigo-600', 'hover:bg-indigo-700');
          }, 4000);
        } catch (err) {
          alert('クリップボードへのコピーに失敗しました。「SQLを見る」から手動でコピーしてください。');
        }
      });
    }

    // SQLプレビュー切替
    const toggleSqlBtn = this.modalContainer.querySelector('#btn-toggle-sql-preview');
    const sqlPreviewBox = this.modalContainer.querySelector('#sql-preview-box');
    if (toggleSqlBtn && sqlPreviewBox) {
      toggleSqlBtn.addEventListener('click', () => {
        sqlPreviewBox.classList.toggle('hidden');
      });
    }

    // 接続＆テーブル自動診断
    const testBtn = this.modalContainer.querySelector('#btn-test-connection');
    const testStatusEl = this.modalContainer.querySelector('#cloud-test-status');
    const testBtnText = this.modalContainer.querySelector('#test-btn-text');

    if (testBtn) {
      testBtn.addEventListener('click', async () => {
        const url = (this.modalContainer.querySelector('#input-supabase-url').value || '').trim();
        const key = (this.modalContainer.querySelector('#input-supabase-anon-key').value || '').trim();

        if (!url || !key) {
          testStatusEl.className = 'p-3 rounded-xl text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200';
          testStatusEl.textContent = '⚠️ URLとAPIキーを入力してください。';
          testStatusEl.classList.remove('hidden');
          return;
        }

        testBtn.disabled = true;
        if (testBtnText) testBtnText.textContent = '診断中...';

        try {
          const cleanUrl = url.replace(/\/+$/, '');
          const headers = {
            'apikey': key,
            'Authorization': `Bearer ${key}`
          };

          // 1. ルートエンドポイントへの疎通チェック
          const rootRes = await fetch(`${cleanUrl}/rest/v1/`, { headers });
          if (!rootRes.ok && rootRes.status !== 404 && rootRes.status !== 200) {
            throw new Error(`Supabaseへの認証に失敗しました (Status: ${rootRes.status} ${rootRes.statusText})。URLとAPIキーを再確認してください。`);
          }

          // 2. テーブルの存在チェック (user_sync_snapshot, user_mistakes, user_word_progress)
          const tablesToCheck = ['user_sync_snapshot', 'user_mistakes', 'user_word_progress', 'user_accounts'];
          const missingTables = [];

          for (const tbl of tablesToCheck) {
            try {
              const r = await fetch(`${cleanUrl}/rest/v1/${tbl}?limit=1`, { headers });
              if (r.status === 404 || r.status === 400) {
                const txt = await r.text();
                if (txt.includes('does not exist') || r.status === 404) {
                  missingTables.push(tbl);
                }
              }
            } catch (_) {}
          }

          if (missingTables.length > 0) {
            testStatusEl.className = 'p-3 rounded-xl text-xs font-semibold bg-amber-50 text-amber-950 border-2 border-amber-300 space-y-1.5';
            testStatusEl.innerHTML = `
              <div class="font-extrabold text-amber-900 flex items-center gap-1 text-sm">
                <span>⚠️</span> 接続は成功しましたが、テーブルが作成されていません！
              </div>
              <div class="text-[11px] text-amber-900">
                未検出テーブル: <code class="bg-amber-100 px-1 py-0.5 rounded font-mono font-bold">${missingTables.join(', ')}</code>
              </div>
              <div class="text-xs text-amber-950 font-bold bg-white/80 p-2 rounded-lg border border-amber-200">
                👉 上の【📋 Supabase用SQLを1クリックコピー】ボタンを押し、Supabase画面左の「SQL Editor」に貼り付けて「Run」を実行してください。
              </div>
            `;
          } else {
            testStatusEl.className = 'p-3 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-900 border-2 border-emerald-400 space-y-1';
            testStatusEl.innerHTML = `
              <div class="flex items-center gap-1.5 text-sm">
                <span>✅</span> 完璧です！Supabase接続＆全テーブル準備完了！
              </div>
              <div class="text-[11px] text-emerald-800 font-medium">
                間違えた問題・学習進捗・ペンギン育成状況を100%確実にクラウド同期できます。
              </div>
            `;
          }
        } catch (e) {
          testStatusEl.className = 'p-3 rounded-xl text-xs font-bold bg-rose-50 text-rose-800 border-2 border-rose-300';
          testStatusEl.textContent = `❌ 接続失敗: ${e.message}`;
        } finally {
          testStatusEl.classList.remove('hidden');
          testBtn.disabled = false;
          if (testBtnText) testBtnText.textContent = '接続＆テーブル自動診断';
        }
      });
    }

    // 設定保存
    const form = this.modalContainer.querySelector('#form-cloud-config');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const url = (this.modalContainer.querySelector('#input-supabase-url').value || '').trim();
        const key = (this.modalContainer.querySelector('#input-supabase-anon-key').value || '').trim();
        const saveBtn = this.modalContainer.querySelector('#btn-save-cloud-config');
        const saveBtnText = this.modalContainer.querySelector('#save-btn-text');

        if (!url || !key) {
          alert('URLとキーを入力してください。');
          return;
        }

        if (saveBtn) {
          saveBtn.disabled = true;
          if (saveBtnText) saveBtnText.textContent = 'クラウド同期中...';
        }

        const newConfig = { supabaseUrl: url, supabaseAnonKey: key };
        SyncService.saveConfig(newConfig);

        const user = (typeof AuthService !== 'undefined' && AuthService.getCurrentUser) ? AuthService.getCurrentUser() : null;
        if (user) {
          await SyncService.pushAllLocalDataToCloud(newConfig, user);
          await SyncService.pullFromCloud(newConfig, user);
        } else {
          await SyncService.fetchAccountFromCloud();
        }

        alert('✅ クラウド設定を保存し、間違えた問題・学習進捗をSupabaseと同期しました！');
        this.render();
        if (this.onConfigSaved) this.onConfigSaved();
      });
    }

    // 手動 Push
    const pushBtn = this.modalContainer.querySelector('#btn-manual-push');
    const manualResultEl = this.modalContainer.querySelector('#manual-sync-result');
    if (pushBtn) {
      pushBtn.addEventListener('click', async () => {
        const user = (typeof AuthService !== 'undefined' && AuthService.getCurrentUser) ? AuthService.getCurrentUser() : null;
        if (!user) {
          alert('クラウドへ保存するには、まず右上のログインからユーザー名を入力してログインしてください。');
          return;
        }
        pushBtn.disabled = true;
        pushBtn.textContent = '☁️ クラウドへ保存中...';

        try {
          const config = SyncService.getConfig();
          await SyncService.pushAllLocalDataToCloud(config, user);
          
          let mistakeCount = 0;
          try {
            mistakeCount = JSON.parse(localStorage.getItem('mongol_app_mistakes_v1') || '[]').length;
          } catch (_) {}

          if (manualResultEl) {
            manualResultEl.className = 'p-2.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-900 border border-emerald-300';
            manualResultEl.textContent = `✅ クラウド保存完了！ 間違えた問題: ${mistakeCount}件、学習進捗、ペンギン育成データをSupabaseに保存しました。`;
            manualResultEl.classList.remove('hidden');
          }
        } catch (e) {
          if (manualResultEl) {
            manualResultEl.className = 'p-2.5 rounded-xl text-xs font-bold bg-rose-50 text-rose-800 border border-rose-300';
            manualResultEl.textContent = `❌ 保存失敗: ${e.message}`;
            manualResultEl.classList.remove('hidden');
          }
        } finally {
          pushBtn.disabled = false;
          pushBtn.textContent = '☁️ 今すぐクラウドへ全保存 (Push)';
        }
      });
    }

    // 手動 Pull
    const pullBtn = this.modalContainer.querySelector('#btn-manual-pull');
    if (pullBtn) {
      pullBtn.addEventListener('click', async () => {
        const user = (typeof AuthService !== 'undefined' && AuthService.getCurrentUser) ? AuthService.getCurrentUser() : null;
        if (!user) {
          alert('クラウドから受信するには、まずログインしてください。');
          return;
        }
        pullBtn.disabled = true;
        pullBtn.textContent = '📲 クラウドから受信中...';

        try {
          const config = SyncService.getConfig();
          await SyncService.pullFromCloud(config, user);

          let mistakeCount = 0;
          try {
            mistakeCount = JSON.parse(localStorage.getItem('mongol_app_mistakes_v1') || '[]').length;
          } catch (_) {}

          if (manualResultEl) {
            manualResultEl.className = 'p-2.5 rounded-xl text-xs font-bold bg-sky-50 text-sky-900 border border-sky-300';
            manualResultEl.textContent = `✅ クラウド受信完了！ 最新の間違えた問題: ${mistakeCount}件、学習進捗を反映しました。`;
            manualResultEl.classList.remove('hidden');
          }
          setTimeout(() => window.location.reload(), 1200);
        } catch (e) {
          if (manualResultEl) {
            manualResultEl.className = 'p-2.5 rounded-xl text-xs font-bold bg-rose-50 text-rose-800 border border-rose-300';
            manualResultEl.textContent = `❌ 受信失敗: ${e.message}`;
            manualResultEl.classList.remove('hidden');
          }
        } finally {
          pullBtn.disabled = false;
          pullBtn.textContent = '📲 クラウドから最新を受信 (Pull)';
        }
      });
    }

    // URLコピー
    const copyUrlBtn = this.modalContainer.querySelector('#btn-copy-share-url');
    if (copyUrlBtn) {
      copyUrlBtn.addEventListener('click', async () => {
        const input = copyUrlBtn.previousElementSibling;
        if (input && input.value) {
          try {
            await navigator.clipboard.writeText(input.value);
            copyUrlBtn.textContent = 'コピー完了！';
            copyUrlBtn.classList.replace('bg-amber-600', 'bg-emerald-600');
            setTimeout(() => {
              copyUrlBtn.textContent = 'URLコピー';
              copyUrlBtn.classList.replace('bg-emerald-600', 'bg-amber-600');
            }, 2000);
          } catch (_) {
            alert('URLをコピーできませんでした。');
          }
        }
      });
    }

    // バックアップJSONダウンロード
    const dlBackupBtn = this.modalContainer.querySelector('#btn-download-backup-json');
    if (dlBackupBtn) {
      dlBackupBtn.addEventListener('click', () => {
        if (typeof AuthService !== 'undefined' && AuthService.exportBackupData) {
          AuthService.exportBackupData();
        } else {
          alert('バックアップ機能の呼び出しに失敗しました。');
        }
      });
    }

    // バックアップJSON復元
    const fileInput = this.modalContainer.querySelector('#input-restore-backup-file');
    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => {
          try {
            const content = evt.target.result;
            const res = AuthService.importBackupData(content);
            if (res.success) {
              alert('✅ バックアップから全学習データを復元しました！');
              window.location.reload();
            } else {
              alert('復元失敗: ' + (res.error || '不明なエラー'));
            }
          } catch (err) {
            alert('ファイルの読み込みに失敗しました: ' + err.message);
          }
        };
        reader.readAsText(file);
      });
    }

    // 設定クリア
    const clearBtn = this.modalContainer.querySelector('#btn-clear-cloud-config');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (confirm('クラウド連携を解除してローカル保存モードに戻しますか？')) {
          SyncService.saveConfig(null);
          this.render();
          if (this.onConfigSaved) this.onConfigSaved();
        }
      });
    }
  }
}
