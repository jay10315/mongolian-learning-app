// モンゴル語音声一括ダウンロードモーダル（IndexedDBローカル保存・完全オフライン対応）
import { SpeechService, AudioStorage } from '../services/speech.js';

export class BatchAudioModal {
  static modalEl = null;
  static isRunning = false;

  static async show() {
    this.close();

    const stats = await SpeechService.getCacheStats();
    let serverStatus = null;
    try {
      const res = await fetch('/api/audio/status');
      if (res.ok) {
        serverStatus = await res.json();
      }
    } catch (_) {}

    const totalTarget = serverStatus ? serverStatus.cached_count : 838;
    const currentCached = stats.count || 0;
    const percent = Math.min(100, Math.round((currentCached / (totalTarget || 1)) * 100));

    const modal = document.createElement('div');
    modal.id = 'batch-audio-modal-overlay';
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in';

    modal.innerHTML = `
      <div class="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
        <!-- ヘッダー -->
        <div class="px-6 py-4 bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 text-white flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <span class="text-2xl">📥</span>
            <div>
              <h3 class="font-extrabold text-base leading-tight">モンゴル語音声一括ダウンロード</h3>
              <p class="text-sky-100 text-[11px] font-medium">端末に全音声を保存して、完全オフライン再生を実現</p>
            </div>
          </div>
          <button type="button" id="btn-close-audio-modal" class="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer text-lg">
            ✕
          </button>
        </div>

        <!-- 本文 -->
        <div class="p-6 space-y-4 overflow-y-auto">
          <!-- 特長説明 -->
          <div class="bg-sky-50 border border-sky-100 rounded-2xl p-3.5 text-xs text-sky-950 space-y-1">
            <div class="font-bold flex items-center gap-1.5 text-sky-900">
              <span>💡</span> 一括ダウンロードのメリット:
            </div>
            <ul class="list-disc list-inside space-y-0.5 text-slate-700 pl-1">
              <li>全 862 単語 ＋ 文法・リスニング・タイピングの全音声を端末内蔵ストレージ（IndexedDB）に完全保存。</li>
              <li>一度保存すれば、<strong>ネット接続なし（飛行機・オフライン）でも0秒即時再生</strong>！</li>
              <li>Microsoft Edge Neural TTS（Yesui / Bataa）の最高品位ネイティブ発音。</li>
            </ul>
          </div>

          <!-- 保存ステータスカード -->
          <div class="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
            <div class="flex items-center justify-between text-xs font-bold text-slate-600">
              <span>端末保存進捗</span>
              <span id="audio-stats-counter" class="text-sm font-extrabold text-sky-700">${currentCached} / ${totalTarget} 件 (${percent}%)</span>
            </div>

            <!-- プログレスバー -->
            <div class="w-full bg-slate-200 h-3 rounded-full overflow-hidden p-0.5 shadow-inner">
              <div id="audio-progress-bar" class="bg-gradient-to-r from-sky-500 to-emerald-500 h-full rounded-full transition-all duration-200" style="width: ${percent}%"></div>
            </div>

            <div class="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
              <span>保存容量: <strong id="audio-stats-size" class="text-slate-700 font-bold">${stats.sizeMb} MB</strong></span>
              <span>音声品質: <strong class="text-slate-700 font-bold">24kHz Neural</strong></span>
              <span>状態: <span id="audio-server-badge" class="px-2 py-0.5 rounded-full ${serverStatus ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'} font-bold text-[10px]">${serverStatus ? 'サーバー接続中 🟢' : 'スタンドアロン 🟡'}</span></span>
            </div>
          </div>

          <!-- 現在処理中アイテム表示エリア -->
          <div id="audio-current-ticker" class="text-xs p-3 bg-slate-100 rounded-xl border border-slate-200 text-slate-600 font-mono truncate hidden">
            <span class="inline-block animate-spin mr-1.5">⏳</span>
            <span id="audio-current-label">準備中...</span>
          </div>

          <!-- 完了メッセージバナー -->
          <div id="audio-complete-banner" class="${currentCached >= totalTarget && totalTarget > 0 ? '' : 'hidden'} bg-emerald-50 border border-emerald-300 rounded-2xl p-3.5 text-xs text-emerald-950 flex items-start gap-2.5">
            <span class="text-xl shrink-0">🎉</span>
            <div class="space-y-0.5">
              <div class="font-extrabold text-emerald-900">すべての音声が保存されています！</div>
              <p class="text-emerald-800 text-[11px]">端末内に全音声データが保持されているため、オフラインでもいつでも全単語・例文が快適に再生できます。</p>
            </div>
          </div>

          <!-- 試し聞きテストボタン -->
          <div class="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
            <span class="text-slate-600 font-medium">発音サンプル（Сайн байна уу?）:</span>
            <button type="button" id="btn-audio-test-sample" class="px-3 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg font-bold text-slate-700 flex items-center gap-1 shadow-2xs active:scale-95 transition-all cursor-pointer">
              <span>🔊</span> 再生テスト
            </button>
          </div>
        </div>

        <!-- フッター操作バー -->
        <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
          <button type="button" id="btn-audio-clear-cache" class="text-xs text-rose-600 hover:text-rose-800 font-bold px-2 py-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer">
            🗑 キャッシュ全消去
          </button>

          <div class="flex items-center gap-2 ml-auto">
            <button type="button" id="btn-audio-pause" class="hidden px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs sm:text-sm transition-all active:scale-95 cursor-pointer">
              一時停止
            </button>
            <button type="button" id="btn-audio-start-download" class="px-5 py-2.5 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white font-extrabold rounded-xl text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer">
              <span>📥</span> <span id="btn-audio-start-label">${currentCached >= totalTarget && totalTarget > 0 ? '再同期・更新' : '一括ダウンロード開始'}</span>
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    this.modalEl = modal;
    this.bindEvents(totalTarget);
  }

  static close() {
    if (this.modalEl) {
      this.modalEl.remove();
      this.modalEl = null;
    }
  }

  static bindEvents(totalTarget) {
    const modal = this.modalEl;
    if (!modal) return;

    // 閉じる
    modal.querySelector('#btn-close-audio-modal')?.addEventListener('click', () => {
      this.close();
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) this.close();
    });

    // テスト再生
    modal.querySelector('#btn-audio-test-sample')?.addEventListener('click', () => {
      SpeechService.speak('Сайн байна уу? Танилцъя.');
    });

    // キャッシュ全消去
    modal.querySelector('#btn-audio-clear-cache')?.addEventListener('click', async () => {
      if (confirm('端末内の音声キャッシュをすべて消去しますか？\n消去後も再度一括ダウンロードが可能です。')) {
        await SpeechService.clearCache();
        const stats = await SpeechService.getCacheStats();
        const counter = modal.querySelector('#audio-stats-counter');
        const bar = modal.querySelector('#audio-progress-bar');
        const size = modal.querySelector('#audio-stats-size');
        const completeBanner = modal.querySelector('#audio-complete-banner');
        if (counter) counter.textContent = `0 / ${totalTarget} 件 (0%)`;
        if (bar) bar.style.width = '0%';
        if (size) size.textContent = `${stats.sizeMb} MB`;
        if (completeBanner) completeBanner.classList.add('hidden');
        const startLabel = modal.querySelector('#btn-audio-start-label');
        if (startLabel) startLabel.textContent = '一括ダウンロード開始';
        alert('音声キャッシュを消去しました。');
      }
    });

    // 一括ダウンロード開始 / 一時停止
    const startBtn = modal.querySelector('#btn-audio-start-download');
    const pauseBtn = modal.querySelector('#btn-audio-pause');
    const ticker = modal.querySelector('#audio-current-ticker');
    const tickerLabel = modal.querySelector('#audio-current-label');
    const progressBar = modal.querySelector('#audio-progress-bar');
    const counterEl = modal.querySelector('#audio-stats-counter');
    const sizeEl = modal.querySelector('#audio-stats-size');
    const completeBanner = modal.querySelector('#audio-complete-banner');

    if (startBtn) {
      startBtn.addEventListener('click', () => {
        if (SpeechService.isBatchDownloading) {
          return;
        }

        ticker?.classList.remove('hidden');
        pauseBtn?.classList.remove('hidden');
        startBtn.classList.add('opacity-50', 'pointer-events-none');
        if (completeBanner) completeBanner.classList.add('hidden');

        SpeechService.batchDownloadAll({
          onProgress: ({ current, total, percent, item, status }) => {
            if (progressBar) progressBar.style.width = `${percent}%`;
            if (counterEl) counterEl.textContent = `${current} / ${total} 件 (${percent}%)`;
            if (tickerLabel) {
              const label = item.label || item.japanese || '';
              tickerLabel.textContent = `[${current}/${total}] ${item.text || item.mongolian || item} ${label ? `(${label})` : ''}`;
            }
          },
          onComplete: async (result) => {
            ticker?.classList.add('hidden');
            pauseBtn?.classList.add('hidden');
            startBtn.classList.remove('opacity-50', 'pointer-events-none');
            const startLabel = modal.querySelector('#btn-audio-start-label');
            if (startLabel) startLabel.textContent = '再同期・更新';

            const finalStats = await SpeechService.getCacheStats();
            if (counterEl) counterEl.textContent = `${result.total} / ${result.total} 件 (100%)`;
            if (progressBar) progressBar.style.width = '100%';
            if (sizeEl) sizeEl.textContent = `${finalStats.sizeMb} MB`;
            if (completeBanner) completeBanner.classList.remove('hidden');
          },
          onError: (err) => {
            ticker?.classList.add('hidden');
            pauseBtn?.classList.add('hidden');
            startBtn.classList.remove('opacity-50', 'pointer-events-none');
            alert(`ダウンロード中にエラーが発生しました: ${err.message || err}`);
          }
        });
      });
    }

    if (pauseBtn) {
      pauseBtn.addEventListener('click', () => {
        if (SpeechService.isBatchPaused) {
          SpeechService.resumeBatchDownload();
          pauseBtn.textContent = '一時停止';
        } else {
          SpeechService.pauseBatchDownload();
          pauseBtn.textContent = '再開';
        }
      });
    }
  }
}
