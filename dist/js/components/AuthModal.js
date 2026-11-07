import { CloudSettingsModal } from './CloudSettingsModal.js';
// ユーザー認証モーダル（ログイン・新規登録・復旧コード再設定）
import { AuthService } from '../services/auth.js';
import { SyncService } from '../services/sync.js';

export class AuthModal {
  static modalContainer = null;
  static currentTab = 'login'; // 'login' | 'register' | 'sync' | 'recovery' | 'profile'
  static onAuthChanged = null;

  static show(onAuthChanged) {
    this.onAuthChanged = onAuthChanged;
    const user = AuthService.getCurrentUser();
    this.currentTab = user ? 'profile' : 'login';
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
      this.modalContainer.id = 'auth-modal-root';
      this.modalContainer.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in';
      document.body.appendChild(this.modalContainer);
    }

    const user = AuthService.getCurrentUser();

    this.modalContainer.innerHTML = `
      <div class="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all">
        
        <!-- モーダルヘッダー -->
        <div class="bg-gradient-to-r from-emerald-600 to-teal-700 px-6 py-4 text-white flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-xl">👤</span>
            <h3 class="font-extrabold text-base tracking-wide">
              ${user ? 'アカウント情報・端末同期' : 'アカウント管理'}
            </h3>
          </div>
          <button type="button" id="btn-close-auth-modal" class="text-white/80 hover:text-white text-lg font-bold p-1">
            ✕
          </button>
        </div>

        <div class="p-6">
          ${user ? this.renderProfileView(user) : this.renderAuthTabsView()}
        </div>
      </div>
    `;

    this.bindEvents();
  }

  static renderAuthTabsView() {
    return `
      <!-- タブ切り替え -->
      <div class="flex border-b border-slate-200 mb-5">
        <button type="button" class="tab-btn flex-1 py-2.5 text-xs sm:text-sm font-bold text-center border-b-2 transition-colors ${
          this.currentTab === 'login' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-700'
        }" data-tab="login">
          ログイン
        </button>
        <button type="button" class="tab-btn flex-1 py-2.5 text-xs sm:text-sm font-bold text-center border-b-2 transition-colors ${
          this.currentTab === 'register' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-700'
        }" data-tab="register">
          新規登録
        </button>
        <button type="button" class="tab-btn flex-1 py-2.5 text-xs sm:text-sm font-bold text-center border-b-2 transition-colors ${
          this.currentTab === 'sync' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-700'
        }" data-tab="sync">
          📲 端末同期
        </button>
        <button type="button" class="tab-btn flex-1 py-2.5 text-xs sm:text-sm font-bold text-center border-b-2 transition-colors ${
          this.currentTab === 'recovery' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-700'
        }" data-tab="recovery">
          復旧
        </button>
      </div>

      <!-- エラー・通知表示エリア -->
      <div id="auth-alert-area" class="hidden mb-4 p-3 rounded-xl text-xs font-medium"></div>

      ${this.currentTab === 'login' ? this.renderLoginForm() : ''}
      ${this.currentTab === 'register' ? this.renderRegisterForm() : ''}
      ${this.currentTab === 'sync' ? this.renderSyncView() : ''}
      ${this.currentTab === 'recovery' ? this.renderRecoveryForm() : ''}
    `;
  }

  static renderSyncView() {
    const user = AuthService.getCurrentUser();
    return `
      <div class="space-y-4">
        <div class="p-3 bg-gradient-to-r from-indigo-50 to-emerald-50 border border-indigo-200 rounded-2xl text-xs text-indigo-950 space-y-1.5">
          <div class="font-extrabold flex items-center gap-1.5 text-indigo-900">
            <span>📲</span>
            <span>端末間データ同期（PC ↔ スマホ ↔ タブレット）</span>
          </div>
          <p class="text-[11px] text-slate-600 leading-relaxed">
            PCで学習したアカウントと進捗（XP・レベル・間違いノート・お気に入り）を、この端末に即座に引き継ぎます。
          </p>
        </div>

        <!-- 方法1: 同期コード / URL貼り付け -->
        <div class="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5">
          <label class="block text-xs font-bold text-slate-800 flex items-center justify-between">
            <span>📋 同期コード または 同期URL を貼り付け:</span>
            <span class="text-[10px] text-slate-400">PC側でコピーしたコード</span>
          </label>
          <textarea id="input-sync-code" rows="3" placeholder="PC画面の「端末同期」でコピーした同期URL（http://...login_token=...）または同期コードをここに貼り付けてください" class="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-mono"></textarea>
          <button type="button" id="btn-execute-sync-code" class="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md transition-all active:scale-98 flex items-center justify-center gap-1.5">
            <span>🚀</span>
            <span>データを同期してログインする</span>
          </button>
        </div>

        <!-- 方法2: バックアップJSONファイルの読込 -->
        <div class="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
          <div class="text-xs font-bold text-slate-800 flex items-center justify-between">
            <span>📥 バックアップファイル（JSON）から復元:</span>
          </div>
          <p class="text-[11px] text-slate-500">
            PCからAirDrop、Googleドライブ、メール等で送ったバックアップファイルを選択します。
          </p>
          <label class="w-full py-2 px-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center">
            <span>📁 ファイルを選択して復元 (.json)</span>
            <input type="file" id="input-import-backup-file" accept=".json,application/json" class="hidden">
          </label>
        </div>

        <!-- 方法3: Supabaseクラウド設定 -->
        <div class="p-3.5 bg-sky-50 border border-sky-200 rounded-2xl space-y-2">
          <div class="text-xs font-bold text-sky-900 flex items-center justify-between">
            <span>☁️ Supabase クラウド同期（推奨）:</span>
            <span class="text-[10px] bg-sky-200 text-sky-800 px-2 py-0.5 rounded-full font-bold">自動同期</span>
          </div>
          <p class="text-[11px] text-sky-800">
            無料のSupabaseを使えば、間違えた問題や進捗が全端末で自動同期されます。
          </p>
          <button type="button" id="btn-open-cloud-settings-from-auth" class="w-full py-2 px-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer">
            <span>☁️ クラウド同期・自動診断設定を開く</span>
          </button>
        </div>

        ${user ? `
          <!-- 現在のデータを書き出す（エクスポート） -->
          <div class="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
            <span class="text-slate-500 font-medium">この端末のデータを保存:</span>
            <button type="button" id="btn-export-current-backup" class="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-bold text-xs transition-all flex items-center gap-1">
              <span>💾 バックアップ保存</span>
            </button>
          </div>
        ` : ''}

        <div class="text-center pt-1">
          <button type="button" class="tab-link text-xs text-slate-500 hover:text-slate-800 font-bold" data-tab="login">
            ← ユーザー名とパスワードでログインに戻る
          </button>
        </div>
      </div>
    `;
  }

  static renderLoginForm() {
    const users = AuthService.getLocalUsers();

    return `
      <form id="form-auth-login" class="space-y-4">
        ${users && users.length > 0 ? `
          <div class="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
            <div class="text-[11px] font-bold text-slate-600 mb-1.5 flex items-center justify-between">
              <span>👤 保存済みアカウント</span>
              <span class="text-[10px] text-emerald-600 font-semibold">タップで入力</span>
            </div>
            <div class="flex flex-wrap gap-1.5">
              ${users.map(u => `
                <button type="button" class="btn-quick-fill-user px-2.5 py-1 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 hover:border-emerald-300 rounded-lg text-xs font-semibold transition-all flex items-center gap-1" data-username="${u.displayName || u.username}">
                  <span>👤</span>
                  <span>${u.displayName || u.username}</span>
                </button>
              `).join('')}
            </div>
          </div>
        ` : `
          <div class="p-3 bg-gradient-to-r from-indigo-50 to-sky-50 border border-indigo-200 rounded-xl text-xs text-indigo-950 space-y-2">
            <div class="font-bold flex items-center justify-between">
              <span class="flex items-center gap-1.5">
                <span>📲</span>
                <span>PCのデータと同期する場合</span>
              </span>
              <span class="text-[10px] bg-indigo-200 text-indigo-900 px-2 py-0.5 rounded-full font-bold">1秒連携</span>
            </div>
            <p class="text-[11px] text-indigo-800 leading-relaxed">
              PC画面右上の「📲 端末同期」のQRコードをカメラで読み取るか、同期URLを貼り付けるとパスワード入力不要ですべての学習履歴を引き継げます。
            </p>
            <button type="button" class="tab-link w-full py-1.5 px-3 bg-white hover:bg-indigo-100 text-indigo-700 border border-indigo-300 rounded-lg text-xs font-bold transition-all text-center flex items-center justify-center gap-1" data-tab="sync">
              <span>📋</span>
              <span>同期コード・URLを貼り付けて同期する →</span>
            </button>
          </div>
        `}

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">ユーザー名</label>
          <input type="text" id="input-login-username" required placeholder="例: batbaatar, たろう" autocomplete="username" class="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden">
          <p class="text-[10px] text-slate-400 mt-1">※全角英数字・大文字小文字は自動で統一されます</p>
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">パスワード</label>
          <input type="password" id="input-login-password" required placeholder="6文字以上" autocomplete="current-password" class="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden">
        </div>

        <button type="submit" id="btn-submit-login" class="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all active:scale-98">
          ログインする
        </button>

        <div class="text-center text-xs text-slate-500 pt-1">
          まだアカウントをお持ちでない方は
          <button type="button" class="tab-link text-emerald-600 font-bold hover:underline ml-1" data-tab="register">
            新規登録へ →
          </button>
        </div>

        <p class="text-[11px] text-slate-500 text-center leading-relaxed">
          メールアドレス不要。別のスマホやPCからでも、同じユーザー名とパスワードでログインすれば学習履歴が同期されます。
        </p>
      </form>
    `;
  }

  static renderRegisterForm() {
    return `
      <form id="form-auth-register" class="space-y-4">
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">希望のユーザー名 (英数・日本語・キリル文字)</label>
          <input type="text" id="input-reg-username" required placeholder="例: dorj_2026, たろう" autocomplete="username" class="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden">
          <p class="text-[10px] text-slate-400 mt-1">※2文字以上（英数・日本語・キリル文字対応。全角英数は自動変換されます）</p>
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">パスワード</label>
          <input type="password" id="input-reg-password" required placeholder="6文字以上のパスワード" autocomplete="new-password" class="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden">
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">パスワード確認（再度入力）</label>
          <input type="password" id="input-reg-password-confirm" required placeholder="上記のパスワードをもう一度入力" autocomplete="new-password" class="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden">
        </div>

        <button type="submit" id="btn-submit-register" class="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all active:scale-98">
          アカウントを作成して開始
        </button>

        <div class="text-center text-xs text-slate-500 pt-1">
          既にアカウントをお持ちの方は
          <button type="button" class="tab-link text-emerald-600 font-bold hover:underline ml-1" data-tab="login">
            ログインへ →
          </button>
        </div>

        <div class="bg-amber-50 border border-amber-200 rounded-xl p-3 text-[11px] text-amber-900 leading-relaxed">
          💡 <strong>メールアドレス不要</strong>: 登録完了時に「パスワード復旧コード」を発行します。忘れたときの再設定に使用します。
        </div>
      </form>
    `;
  }

  static renderRecoveryForm() {
    return `
      <form id="form-auth-recovery" class="space-y-3.5">
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">登録ユーザー名</label>
          <input type="text" id="input-rec-username" required placeholder="登録したユーザー名" class="w-full text-xs p-2.5 border border-slate-300 rounded-xl">
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">16桁の復旧コード</label>
          <input type="text" id="input-rec-code" required placeholder="例: MN-XXXX-XXXX-XXXX" class="w-full text-xs p-2.5 border border-slate-300 rounded-xl font-mono uppercase">
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">新しいパスワード</label>
          <input type="password" id="input-rec-new-password" required placeholder="6文字以上の新パスワード" class="w-full text-xs p-2.5 border border-slate-300 rounded-xl">
        </div>

        <button type="submit" id="btn-submit-recovery" class="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all active:scale-98">
          パスワードを再設定する
        </button>
      </form>
    `;
  }

  static renderProfileView(user) {
    const isCloud = SyncService.isCloudConfigured();
    const queueCount = SyncService.getQueue().length;

    const host = typeof window !== 'undefined' && window.location ? (window.location.hostname || '') : '';
    const isLocalhost = host === 'localhost' || host === '127.0.0.1' || !host;
    const protocol = typeof window !== 'undefined' && window.location && window.location.protocol.startsWith('http') ? window.location.protocol : 'http:';
    const pathname = typeof window !== 'undefined' && window.location ? (window.location.pathname || '/') : '/';
    const cleanPath = pathname.endsWith('.html') ? pathname : (pathname.endsWith('/') ? pathname : pathname + '/');
    
    // Vercel等の公開Web環境では絶対に:5173を付けず、window.location.originを使用
    const targetBaseUrl = !isLocalhost && typeof window !== 'undefined' && window.location && window.location.origin
      ? `${window.location.origin}${cleanPath}`
      : `${protocol}//192.168.2.226:${(typeof window !== 'undefined' && window.location && window.location.port) || '5173'}${cleanPath}`;
    const magicLoginUrl = AuthService.createMagicLoginUrl(user, targetBaseUrl);

    return `
      <div class="space-y-5">
        <div class="flex items-center gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
          <div class="w-12 h-12 rounded-full bg-emerald-600 text-white font-bold text-xl flex items-center justify-center">
            ${(user.displayName || user.username).substring(0, 1).toUpperCase()}
          </div>
          <div>
            <div class="text-xs text-slate-500">ログイン中のユーザー</div>
            <div class="text-base font-extrabold text-slate-900">${user.displayName || user.username}</div>
            <div class="text-[11px] text-slate-400 font-mono">ID: ${user.id}</div>
          </div>
        </div>

        <!-- 他端末（タブレット・スマホ）連携 -->
        <div class="p-3.5 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-2">
          <div class="flex items-center justify-between text-xs font-bold text-indigo-900">
            <span class="flex items-center gap-1.5">
              <span>📱</span>
              <span>タブレット・他端末へ連携</span>
            </span>
            <span class="text-[10px] bg-indigo-200 text-indigo-800 px-2 py-0.5 rounded-full font-bold">ワンクリックログイン</span>
          </div>
          <p class="text-[11px] text-indigo-800 leading-relaxed">
            QRコードまたはURLでタブレットを開くと、パスワード入力不要でこのアカウントに自動ログイン＆ペンギンの育成データも連携されます。
          </p>
          <div class="flex gap-2 pt-1">
            <button type="button" id="btn-show-tablet-qr" class="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 shadow-xs active:scale-95 cursor-pointer">
              <span>📷</span>
              <span>QRコードを表示</span>
            </button>
            <button type="button" id="btn-copy-magic-url" data-url="${magicLoginUrl}" class="flex-1 py-2 bg-white hover:bg-indigo-100 text-indigo-700 border border-indigo-300 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 active:scale-95 cursor-pointer">
              <span>🔗</span>
              <span>簡単ログインURLをコピー</span>
            </button>
          </div>
        </div>

        <!-- 同期ステータス -->
        <div class="p-3.5 border rounded-xl ${isCloud ? 'border-emerald-200 bg-emerald-50/50' : 'border-amber-200 bg-amber-50/50'} space-y-2">
          <div class="flex items-center justify-between text-xs font-bold">
            <span class="flex items-center gap-1.5">
              <span>${isCloud ? '🟢 クラウドデータベース接続中' : '⚪ ローカル保存モード'}</span>
            </span>
            <span class="text-[11px] text-slate-500">保留: ${queueCount} 件</span>
          </div>
          <p class="text-[11px] text-slate-600 leading-relaxed">
            ${isCloud ? 'PC・スマートフォン・タブレット間で学習データがリアルタイム同期されています。' : '現在端末内のみに保存されています。「クラウド同期設定」からSupabaseに接続すると自動同期が有効になります。'}
          </p>
          <div class="pt-1 flex gap-2">
            <button type="button" id="btn-force-sync" class="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-all">
              🔄 今すぐ同期
            </button>
          </div>
        </div>

        <button type="button" id="btn-logout" class="w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold rounded-xl text-xs transition-all">
          ログアウト
        </button>
      </div>
    `;
  }

  static showAlert(message, type = 'error', action = null) {
    const alertEl = this.modalContainer.querySelector('#auth-alert-area');
    if (!alertEl) return;
    alertEl.className = `mb-4 p-3 rounded-xl text-xs font-medium space-y-2 ${
      type === 'error' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
    }`;

    let actionHtml = '';
    if (action && action.label) {
      actionHtml = `
        <button type="button" id="btn-alert-action" class="w-full mt-1.5 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition-all shadow-xs text-center cursor-pointer">
          ${action.label}
        </button>
      `;
    }

    alertEl.innerHTML = `<div>${message}</div>${actionHtml}`;
    alertEl.classList.remove('hidden');

    if (action && action.callback) {
      const actionBtn = alertEl.querySelector('#btn-alert-action');
      if (actionBtn) {
        actionBtn.addEventListener('click', (e) => {
          e.preventDefault();
          action.callback();
        });
      }
    }
  }

  static showRecoveryCodeSuccessDialog(recoveryCode, username) {
    this.modalContainer.innerHTML = `
      <div class="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-fade-in">
        <div class="bg-emerald-600 px-6 py-4 text-white flex items-center gap-2">
          <span class="text-2xl">🎉</span>
          <h3 class="font-extrabold text-base">アカウント登録完了</h3>
        </div>
        <div class="p-6 space-y-4">
          <p class="text-xs text-slate-700 leading-relaxed">
            <strong>${username}</strong> さんのアカウントが作成されました。<br>
            メールアドレスを使用しないため、パスワードを忘れた場合の復旧には以下の「<strong>復旧コード</strong>」が必要です。
          </p>

          <div class="p-3 bg-slate-900 rounded-xl text-center space-y-1">
            <div class="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">One-Time Recovery Code</div>
            <div id="recovery-code-display" class="text-base font-mono font-bold text-emerald-400 tracking-wider select-all">${recoveryCode}</div>
          </div>

          <button type="button" id="btn-copy-recovery-code" class="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all border border-slate-200 flex items-center justify-center gap-1.5">
            📋 復旧コードをコピーする
          </button>

          <div class="text-[11px] text-rose-600 font-semibold bg-rose-50 p-2.5 rounded-lg border border-rose-200">
            ⚠️ 注意: このコードは一度しか表示されません。メモ帳などに安全に保管してください。
          </div>

          <button type="button" id="btn-finish-registration" class="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all">
            確認して学習を開始する →
          </button>
        </div>
      </div>
    `;

    const copyBtn = this.modalContainer.querySelector('#btn-copy-recovery-code');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(recoveryCode).then(() => {
          copyBtn.textContent = '✅ コピーしました！';
          setTimeout(() => { copyBtn.textContent = '📋 復旧コードをコピーする'; }, 2500);
        });
      });
    }

    const finishBtn = this.modalContainer.querySelector('#btn-finish-registration');
    if (finishBtn) {
      finishBtn.addEventListener('click', () => {
        this.close();
        if (this.onAuthChanged) this.onAuthChanged(AuthService.getCurrentUser());
      });
    }
  }

  static bindEvents() {
    // 閉じるボタン
    const closeBtn = this.modalContainer.querySelector('#btn-close-auth-modal');
    if (closeBtn) closeBtn.addEventListener('click', () => this.close());

    // タブ切り替え（タブボタン & リンク）
    this.modalContainer.querySelectorAll('.tab-btn, .tab-link').forEach(btn => {
      btn.addEventListener('click', () => {
        this.currentTab = btn.getAttribute('data-tab');
        this.render();
      });
    });

    // 保存済みアカウントクイック入力ボタン
    this.modalContainer.querySelectorAll('.btn-quick-fill-user').forEach(btn => {
      btn.addEventListener('click', () => {
        const username = btn.getAttribute('data-username');
        const loginUserInput = this.modalContainer.querySelector('#input-login-username');
        const loginPwdInput = this.modalContainer.querySelector('#input-login-password');
        if (loginUserInput) {
          loginUserInput.value = username;
        }
        if (loginPwdInput) {
          loginPwdInput.focus();
        }
        const alertEl = this.modalContainer.querySelector('#auth-alert-area');
        if (alertEl) alertEl.classList.add('hidden');
      });
    });

    // --- 同期タブ内のイベント ---
    const executeSyncBtn = this.modalContainer.querySelector('#btn-execute-sync-code');
    if (executeSyncBtn) {
      executeSyncBtn.addEventListener('click', async () => {
        const val = (this.modalContainer.querySelector('#input-sync-code') || {}).value;
        if (!val || !val.trim()) {
          alert('同期コードまたは同期URLを貼り付けてください。');
          return;
        }
        executeSyncBtn.disabled = true;
        executeSyncBtn.textContent = '同期・復元中...';
        const res = AuthService.importBackupData(val.trim());
        if (res.success) {
          AuthService.showLoginSuccessToast(res.user.displayName || res.user.username);
          SyncService.triggerSync();
          this.close();
          if (this.onAuthChanged) this.onAuthChanged(res.user);
          setTimeout(() => window.location.reload(), 300);
        } else {
          executeSyncBtn.disabled = false;
          executeSyncBtn.textContent = 'データを同期してログインする';
          alert('同期に失敗しました: ' + (res.error || '無効なコードです'));
        }
      });
    }

    const fileInput = this.modalContainer.querySelector('#input-import-backup-file');
    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => {
          const content = evt.target.result;
          const res = AuthService.importBackupData(content);
          if (res.success) {
            AuthService.showLoginSuccessToast(res.user.displayName || res.user.username);
            SyncService.triggerSync();
            this.close();
            if (this.onAuthChanged) this.onAuthChanged(res.user);
            setTimeout(() => window.location.reload(), 300);
          } else {
            alert('復元に失敗しました: ' + res.error);
          }
        };
        reader.readAsText(file);
      });
    }

    const exportBtn = this.modalContainer.querySelector('#btn-export-current-backup');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        const jsonStr = AuthService.exportBackupData();
        if (!jsonStr) return;
        const user = AuthService.getCurrentUser();
        const uname = user ? user.username : 'user';
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `mongol_learning_backup_${uname}_${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
      });
    }

    const openCloudBtn = this.modalContainer.querySelector('#btn-open-cloud-settings-from-auth');
    if (openCloudBtn) {
      openCloudBtn.addEventListener('click', () => {
        this.close();
        CloudSettingsModal.show(() => {
          if (this.onAuthChanged) this.onAuthChanged(AuthService.getCurrentUser());
        });
      });
    }

    // ユーザー名入力欄の自動正規化（全角英数→半角、全角スペース除去など）
    ['#input-login-username', '#input-reg-username', '#input-rec-username'].forEach(selector => {
      const input = this.modalContainer.querySelector(selector);
      if (input) {
        input.addEventListener('blur', () => {
          if (input.value) {
            let v = String(input.value).normalize('NFKC');
            v = v.replace(/[ー―－‐]/g, '-').replace(/[＿]/g, '_').trim();
            input.value = v;
          }
        });
      }
    });

    // ログイン送信
    const loginForm = this.modalContainer.querySelector('#form-auth-login');
    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const u = this.modalContainer.querySelector('#input-login-username').value;
        const p = this.modalContainer.querySelector('#input-login-password').value;
        const submitBtn = this.modalContainer.querySelector('#btn-submit-login');
        submitBtn.disabled = true;
        submitBtn.textContent = '認証中...';

        let res = await AuthService.login(u, p);
        // ローカルにアカウントがない場合、Supabase(クラウド)からの自動検索を試行
        if (!res.success && (res.code === 'USER_NOT_FOUND' || res.code === 'NO_USERS_ON_DEVICE')) {
          if (SyncService.isCloudConfigured()) {
            submitBtn.textContent = 'クラウド検索中...';
            const cloudUsers = await SyncService.fetchAccountFromCloud(u);
            if (cloudUsers && cloudUsers.length > 0) {
              res = await AuthService.login(u, p);
            }
          }
        }

        if (res.success) {
          SyncService.triggerSync();
          this.close();
          if (this.onAuthChanged) this.onAuthChanged(res.user);
        } else {
          submitBtn.disabled = false;
          submitBtn.textContent = 'ログインする';
          if (res.code === 'USER_NOT_FOUND' || res.code === 'NO_USERS_ON_DEVICE') {
            const alertEl = this.modalContainer.querySelector('#auth-alert-area');
            if (alertEl) {
              alertEl.className = 'mb-4 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-900 space-y-2.5';
              alertEl.innerHTML = `
                <div class="font-black text-rose-800 flex items-center gap-1.5">
                  <span>⚠️</span>
                  <span>この端末に「${u}」のアカウントがありません</span>
                </div>
                <p class="text-[11px] text-rose-700 leading-relaxed">
                  PCで作成したアカウントと学習データ（XP・ペンギン・間違いノート等）を引き継ぐには、下記のいずれかの方法をお選びください：
                </p>
                <div class="grid grid-cols-1 gap-1.5 pt-1">
                  <button type="button" id="btn-sync-from-pc" class="w-full py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs">
                    <span>📲</span>
                    <span>PCからデータを同期する（QR / 同期コード）</span>
                  </button>
                  <button type="button" id="btn-retry-server-fetch" class="w-full py-2 px-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5">
                    <span>🔄</span>
                    <span>クラウド/サーバーからアカウントを再検索</span>
                  </button>
                  <button type="button" id="btn-quick-create-from-login" class="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5">
                    <span>👉</span>
                    <span>この端末で「${res.inputUsername || u.trim()}」を新規登録する</span>
                  </button>
                </div>
              `;
              alertEl.classList.remove('hidden');

              const syncBtn = alertEl.querySelector('#btn-sync-from-pc');
              if (syncBtn) {
                syncBtn.addEventListener('click', () => {
                  this.currentTab = 'sync';
                  this.render();
                });
              }

              const retryBtn = alertEl.querySelector('#btn-retry-server-fetch');
              if (retryBtn) {
                retryBtn.addEventListener('click', async () => {
                  retryBtn.disabled = true;
                  retryBtn.innerHTML = '<span>⏳</span><span>クラウド/サーバー検索中...</span>';
                  try {
                    let foundAccount = null;
                    const cleanU = AuthService.normalizeUsername(u);

                    // 1. Supabase (クラウドDB) から検索
                    if (SyncService.isCloudConfigured()) {
                      const cloudUsers = await SyncService.fetchAccountFromCloud(cleanU);
                      if (cloudUsers && cloudUsers.length > 0) {
                        foundAccount = cloudUsers[0];
                      }
                    }

                    // 2. ローカルWebサーバー (LAN内) から検索
                    if (!foundAccount) {
                      const serverUsers = await AuthService.fetchServerAccounts();
                      foundAccount = serverUsers.find(x => AuthService.normalizeUsername(x.username) === cleanU);
                      const syncData = await AuthService.fetchServerUserData(cleanU);
                      if (syncData && syncData.account) {
                        foundAccount = syncData.account;
                      }
                    }

                    if (foundAccount) {
                      AuthService.mergeServerUsers([foundAccount]);
                      if (SyncService.isCloudConfigured()) {
                        await SyncService.pullFromCloud(SyncService.getConfig(), foundAccount);
                      }
                      alertEl.className = 'mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 space-y-1';
                      alertEl.innerHTML = `
                        <div class="font-bold flex items-center gap-1">
                          <span>✅</span>
                          <span>クラウド/PC上にアカウント「${foundAccount.displayName || foundAccount.username}」が見つかりました！</span>
                        </div>
                        <p class="text-[11px] text-emerald-800">
                          パスワードを入力してそのまま「ログインする」を押してください。間違えた問題や学習進捗も自動同期されます。
                        </p>
                      `;
                    } else {
                      alert('アカウントが見つかりませんでした。Supabaseクラウド設定を確認するか、PC側で「📲 端末同期」を開いて【同期コードのみコピー】を押してコードを貼り付けてください。');
                      retryBtn.disabled = false;
                      retryBtn.innerHTML = '<span>🔄</span><span>クラウド/サーバーからアカウントを再検索</span>';
                    }
                  } catch (err) {
                    alert('検索エラー: ' + err.message);
                    retryBtn.disabled = false;
                    retryBtn.innerHTML = '<span>🔄</span><span>クラウド/サーバーからアカウントを再検索</span>';
                  }
                });
              }

              const createBtn = alertEl.querySelector('#btn-quick-create-from-login');
              if (createBtn) {
                createBtn.addEventListener('click', () => {
                  this.currentTab = 'register';
                  this.render();
                  const regInput = this.modalContainer.querySelector('#input-reg-username');
                  if (regInput) {
                    regInput.value = res.inputUsername || u.trim();
                    const pwdInput = this.modalContainer.querySelector('#input-reg-password');
                    if (pwdInput) pwdInput.focus();
                  }
                });
              }
            } else {
              this.showAlert(res.error, 'error');
            }
          } else if (res.code === 'PASSWORD_MISMATCH') {
            this.showAlert(res.error, 'error', {
              label: '🔑 復旧コードでパスワードを再設定する',
              callback: () => {
                this.currentTab = 'recovery';
                this.render();
                const recInput = this.modalContainer.querySelector('#input-rec-username');
                if (recInput) {
                  recInput.value = res.matchedUsername || u.trim();
                  const codeInput = this.modalContainer.querySelector('#input-rec-code');
                  if (codeInput) codeInput.focus();
                }
              }
            });
          } else {
            this.showAlert(res.error, 'error');
          }
        }
      });
    }

    // 新規登録送信
    const regForm = this.modalContainer.querySelector('#form-auth-register');
    if (regForm) {
      regForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const u = this.modalContainer.querySelector('#input-reg-username').value;
        const p = this.modalContainer.querySelector('#input-reg-password').value;
        const pConfirm = this.modalContainer.querySelector('#input-reg-password-confirm').value;

        if (p !== pConfirm) {
          this.showAlert('パスワードと確認用パスワードが一致しません。もう一度同じパスワードを入力してください。', 'error');
          return;
        }

        const submitBtn = this.modalContainer.querySelector('#btn-submit-register');
        submitBtn.disabled = true;
        submitBtn.textContent = '作成中...';

        const res = await AuthService.register(u, p);
        if (res.success) {
          this.showRecoveryCodeSuccessDialog(res.recoveryCode, u);
        } else {
          submitBtn.disabled = false;
          submitBtn.textContent = 'アカウントを作成して開始';
          if (res.code === 'USER_EXISTS') {
            this.showAlert(res.error, 'error', {
              label: `👉 「${res.existingUsername || u.trim()}」でログインする`,
              callback: () => {
                this.currentTab = 'login';
                this.render();
                const loginInput = this.modalContainer.querySelector('#input-login-username');
                if (loginInput) {
                  loginInput.value = res.existingUsername || u.trim();
                  const pwdInput = this.modalContainer.querySelector('#input-login-password');
                  if (pwdInput) pwdInput.focus();
                }
              }
            });
          } else {
            this.showAlert(res.error, 'error');
          }
        }
      });
    }

    // 復旧送信
    const recForm = this.modalContainer.querySelector('#form-auth-recovery');
    if (recForm) {
      recForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const u = this.modalContainer.querySelector('#input-rec-username').value;
        const code = this.modalContainer.querySelector('#input-rec-code').value;
        const newP = this.modalContainer.querySelector('#input-rec-new-password').value;

        const res = await AuthService.resetPasswordWithRecoveryCode(u, code, newP);
        if (res.success) {
          alert(`パスワードを再設定しました！新しい復旧コード: ${res.newRecoveryCode}`);
          this.close();
          if (this.onAuthChanged) this.onAuthChanged(res.user);
        } else {
          this.showAlert(res.error, 'error');
        }
      });
    }

    // タブレット・他端末連携
    const showTabletQrBtn = this.modalContainer.querySelector('#btn-show-tablet-qr');
    if (showTabletQrBtn) {
      showTabletQrBtn.addEventListener('click', () => {
        this.close();
        const connectBtn = document.getElementById('btn-device-connect');
        if (connectBtn) {
          connectBtn.click();
        } else if (typeof Navbar !== 'undefined' && Navbar.showTabletConnectModal) {
          Navbar.showTabletConnectModal();
        }
      });
    }

    const copyMagicUrlBtn = this.modalContainer.querySelector('#btn-copy-magic-url');
    if (copyMagicUrlBtn) {
      copyMagicUrlBtn.addEventListener('click', () => {
        const url = copyMagicUrlBtn.getAttribute('data-url');
        if (!url) return;
        navigator.clipboard.writeText(url).then(() => {
          copyMagicUrlBtn.innerHTML = '<span>✅</span><span>URLをコピーしました！</span>';
          copyMagicUrlBtn.classList.add('bg-emerald-50', 'text-emerald-700', 'border-emerald-300');
          setTimeout(() => {
            copyMagicUrlBtn.innerHTML = '<span>🔗</span><span>簡単ログインURLをコピー</span>';
            copyMagicUrlBtn.classList.remove('bg-emerald-50', 'text-emerald-700', 'border-emerald-300');
          }, 2500);
        }).catch(() => {
          prompt('以下のログインURLをコピーしてタブレットに送信してください:', url);
        });
      });
    }

    // 強制同期
    const forceSyncBtn = this.modalContainer.querySelector('#btn-force-sync');
    if (forceSyncBtn) {
      forceSyncBtn.addEventListener('click', async () => {
        forceSyncBtn.textContent = '同期中...';
        await SyncService.triggerSync();
        this.render();
      });
    }

    // ログアウト
    const logoutBtn = this.modalContainer.querySelector('#btn-logout');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        if (confirm('ログアウトしますか？')) {
          AuthService.logout();
          this.close();
          if (this.onAuthChanged) this.onAuthChanged(null);
        }
      });
    }
  }
}
