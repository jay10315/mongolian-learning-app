// クラウド同期設定モーダル（Supabase接続・同期状態管理）
import { SyncService } from '../services/sync.js';

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
    const queue = SyncService.getQueue();

    this.modalContainer.innerHTML = `
      <div class="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        
        <div class="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-xl">☁️</span>
            <h3 class="font-extrabold text-base">クラウドデータベース同期設定</h3>
          </div>
          <button type="button" id="btn-close-cloud-modal" class="text-white/70 hover:text-white text-lg font-bold p-1">
            ✕
          </button>
        </div>

        <div class="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          <div class="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 text-xs text-emerald-900 leading-relaxed space-y-1">
            <div class="font-bold flex items-center gap-1">
              <span>🚀</span> 複数端末（スマホ・PC・タブレット）の自動同期
            </div>
            <p>
              Supabase（無料プラン対応）のプロジェクトURLとAPIキーを設定すると、自宅のPCで学習した続きを外出先のスマートフォンでいつでもシームレスに学習できます。
            </p>
          </div>

          <form id="form-cloud-config" class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">
                Supabase Project URL
              </label>
              <input type="url" id="input-supabase-url" value="${currentConfig.supabaseUrl || ''}" placeholder="https://xxxxxxxxxxxx.supabase.co" class="w-full text-xs p-2.5 border border-slate-300 rounded-lg font-mono">
              <p class="text-[10px] text-slate-400 mt-0.5">※ Supabase Dashboard → Settings → API → Project URL</p>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">
                Supabase Anon Public Key
              </label>
              <textarea id="input-supabase-anon-key" rows="2" placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." class="w-full text-xs p-2.5 border border-slate-300 rounded-lg font-mono">${currentConfig.supabaseAnonKey || ''}</textarea>
              <p class="text-[10px] text-slate-400 mt-0.5">※ Supabase Dashboard → Settings → API → Project API keys → anon (public)</p>
            </div>

            <div id="cloud-test-status" class="hidden p-2.5 rounded-lg text-xs font-medium"></div>

            <div class="flex flex-col sm:flex-row gap-2 pt-2">
              <button type="button" id="btn-test-connection" class="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all border border-slate-200">
                🔍 接続テスト
              </button>
              <button type="submit" id="btn-save-cloud-config" class="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-md">
                💾 設定を保存して同期
              </button>
            </div>
          </form>

          <!-- 保留中キューとリセット -->
          <div class="pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span>未送信キュー: <strong class="text-slate-800">${queue.length}</strong> 件</span>
            ${currentConfig.supabaseUrl ? `
              <button type="button" id="btn-clear-cloud-config" class="text-rose-600 hover:text-rose-800 font-semibold underline">
                クラウド連携を解除（ローカル専用に戻す）
              </button>
            ` : ''}
          </div>

          <!-- セットアップガイド -->
          <div class="pt-2 text-[11px] text-slate-500 space-y-1">
            <div class="font-bold text-slate-700">📖 Supabaseの準備方法:</div>
            <ol class="list-decimal list-inside space-y-0.5 text-slate-600">
              <li>supabase.com で無料アカウントを作成し、新しいプロジェクトを作成</li>
              <li>SQL Editorを開き、同梱の <code class="bg-slate-100 px-1 rounded">supabase_schema.sql</code> の内容を実行</li>
              <li>Project Settings → API から URL と anon key をコピーしてここに貼り付け</li>
            </ol>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  static bindEvents() {
    const closeBtn = this.modalContainer.querySelector('#btn-close-cloud-modal');
    if (closeBtn) closeBtn.addEventListener('click', () => this.close());

    const testBtn = this.modalContainer.querySelector('#btn-test-connection');
    const statusEl = this.modalContainer.querySelector('#cloud-test-status');

    if (testBtn) {
      testBtn.addEventListener('click', async () => {
        const url = this.modalContainer.querySelector('#input-supabase-url').value.trim();
        const key = this.modalContainer.querySelector('#input-supabase-anon-key').value.trim();

        if (!url || !key) {
          statusEl.className = 'p-2.5 rounded-lg text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200';
          statusEl.textContent = 'URLとAPIキーを入力してください。';
          statusEl.classList.remove('hidden');
          return;
        }

        testBtn.disabled = true;
        testBtn.textContent = 'テスト中...';

        try {
          const res = await fetch(`${url.replace(/\/+$/, '')}/rest/v1/`, {
            headers: {
              'apikey': key,
              'Authorization': `Bearer ${key}`
            }
          });

          if (res.ok || res.status === 200 || res.status === 404) {
            statusEl.className = 'p-2.5 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200';
            statusEl.textContent = '✅ Supabaseへの接続に成功しました！テーブル同期が可能です。';
          } else {
            throw new Error(`Status: ${res.status} ${res.statusText}`);
          }
        } catch (e) {
          statusEl.className = 'p-2.5 rounded-lg text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200';
          statusEl.textContent = `❌ 接続に失敗しました: ${e.message}`;
        } finally {
          statusEl.classList.remove('hidden');
          testBtn.disabled = false;
          testBtn.textContent = '🔍 接続テスト';
        }
      });
    }

    const form = this.modalContainer.querySelector('#form-cloud-config');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const url = this.modalContainer.querySelector('#input-supabase-url').value.trim();
        const key = this.modalContainer.querySelector('#input-supabase-anon-key').value.trim();

        if (!url || !key) {
          alert('URLとキーを入力してください。');
          return;
        }

        SyncService.saveConfig({ supabaseUrl: url, supabaseAnonKey: key });
        SyncService.triggerSync();
        alert('クラウド同期設定を保存しました！バックグラウンド同期を開始します。');
        this.close();
        if (this.onConfigSaved) this.onConfigSaved();
      });
    }

    const clearBtn = this.modalContainer.querySelector('#btn-clear-cloud-config');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (confirm('クラウド連携を解除してローカル保存モードに戻しますか？')) {
          SyncService.saveConfig(null);
          this.close();
          if (this.onConfigSaved) this.onConfigSaved();
        }
      });
    }
  }
}
