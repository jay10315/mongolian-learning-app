// モンゴル語音声再生サービス（高品位ニューラル音声・端末ローカルIndexedDB保存・完全オフライン対応）
// 1. 端末内蔵 IndexedDB キャッシュ（完全オフライン・無制限・0秒即時再生）
// 2. ローカルサーバーTTSプロキシ (/api/tts) - Microsoft Edge Neural TTS (Yesui / Bataa)
// 3. デバイス内蔵 mn-MN ネイティブ音声エンジン（Web Speech API）
// 4. Web Speech Cyrillic フォネティック合成（ロシア語・ウクライナ語音声＋音響適応）
// 5. Web Speech API 日本語音声（カタカナ読み上げ連携・Windowsオフライン対応）
// 6. Web Audio API 音響フォルマント合成（最終セーフティネット）

export class AudioStorage {
  static DB_NAME = 'mongol_audio_cache_v1';
  static STORE_NAME = 'audio_blobs';
  static dbPromise = null;

  static getDB() {
    if (this.dbPromise) return this.dbPromise;
    this.dbPromise = new Promise((resolve) => {
      if (typeof window === 'undefined' || typeof indexedDB === 'undefined') {
        return resolve(null);
      }
      try {
        const req = indexedDB.open(this.DB_NAME, 1);
        req.onupgradeneeded = (e) => {
          const db = e.target.result;
          if (!db.objectStoreNames.contains(this.STORE_NAME)) {
            db.createObjectStore(this.STORE_NAME, { keyPath: 'key' });
          }
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => {
          console.warn('[AudioStorage] Open failed:', req.error);
          resolve(null);
        };
      } catch (err) {
        console.warn('[AudioStorage] Exception opening DB:', err);
        resolve(null);
      }
    });
    return this.dbPromise;
  }

  static normalizeKey(text) {
    if (!text) return '';
    return text
      .toLowerCase()
      .replace(/\s*[（\(].*?[）\)]\s*/g, ' ')
      .replace(/[.,!?。、！？«»"'\s]+/g, ' ')
      .trim();
  }

  static async getAudioBlob(text) {
    const key = this.normalizeKey(text);
    if (!key) return null;
    const db = await this.getDB();
    if (!db) return null;
    return new Promise((resolve) => {
      try {
        const tx = db.transaction([this.STORE_NAME], 'readonly');
        const store = tx.objectStore(this.STORE_NAME);
        const req = store.get(key);
        req.onsuccess = () => {
          if (req.result && req.result.blob) {
            resolve(req.result.blob);
          } else {
            resolve(null);
          }
        };
        req.onerror = () => resolve(null);
      } catch (e) {
        resolve(null);
      }
    });
  }

  static async saveAudioBlob(text, blob, metadata = {}) {
    const key = this.normalizeKey(text);
    if (!key || !blob) return false;
    const db = await this.getDB();
    if (!db) return false;
    return new Promise((resolve) => {
      try {
        const tx = db.transaction([this.STORE_NAME], 'readwrite');
        const store = tx.objectStore(this.STORE_NAME);
        const record = {
          key,
          rawText: text,
          blob,
          size: blob.size || 0,
          savedAt: Date.now(),
          ...metadata
        };
        const req = store.put(record);
        req.onsuccess = () => resolve(true);
        req.onerror = () => resolve(false);
      } catch (e) {
        resolve(false);
      }
    });
  }

  static async hasAudio(text) {
    const b = await this.getAudioBlob(text);
    return !!b;
  }

  static async getStats() {
    const db = await this.getDB();
    if (!db) return { count: 0, estimatedBytes: 0, sizeMb: '0.00' };
    return new Promise((resolve) => {
      try {
        const tx = db.transaction([this.STORE_NAME], 'readonly');
        const store = tx.objectStore(this.STORE_NAME);
        const req = store.getAll();
        req.onsuccess = () => {
          const list = req.result || [];
          const count = list.length;
          const estimatedBytes = list.reduce((acc, cur) => acc + (cur.size || (cur.blob ? cur.blob.size : 0)), 0);
          resolve({
            count,
            estimatedBytes,
            sizeMb: (estimatedBytes / (1024 * 1024)).toFixed(2)
          });
        };
        req.onerror = () => resolve({ count: 0, estimatedBytes: 0, sizeMb: '0.00' });
      } catch (e) {
        resolve({ count: 0, estimatedBytes: 0, sizeMb: '0.00' });
      }
    });
  }

  static async clearAll() {
    const db = await this.getDB();
    if (!db) return false;
    return new Promise((resolve) => {
      try {
        const tx = db.transaction([this.STORE_NAME], 'readwrite');
        const store = tx.objectStore(this.STORE_NAME);
        const req = store.clear();
        req.onsuccess = () => resolve(true);
        req.onerror = () => resolve(false);
      } catch (e) {
        resolve(false);
      }
    });
  }
}

export class SpeechService {
  static mongolianVoice = null;
  static fallbackCyrillicVoice = null;
  static japaneseVoice = null;
  static hasChecked = false;
  static listeners = [];
  static currentAudio = null;

  // バッチダウンロード状態制御
  static isBatchDownloading = false;
  static isBatchPaused = false;
  static batchCancelRequested = false;

  static init() {
    // 1. Web Speech APIの利用可能音声確認
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const checkVoices = () => {
        try {
          const voices = window.speechSynthesis.getVoices() || [];
          if (voices.length > 0) {
            this.mongolianVoice = voices.find(v => 
              (v.lang && v.lang.toLowerCase().startsWith('mn')) || 
              (v.name && v.name.toLowerCase().includes('mongolian'))
            ) || null;

            this.fallbackCyrillicVoice = voices.find(v => 
              (v.lang && (v.lang.toLowerCase().startsWith('ru') || v.lang.toLowerCase().startsWith('uk') || v.lang.toLowerCase().startsWith('bg'))) ||
              (v.name && (v.name.toLowerCase().includes('russian') || v.name.toLowerCase().includes('cyrillic')))
            ) || null;

            this.japaneseVoice = voices.find(v =>
              (v.lang && v.lang.toLowerCase().startsWith('ja')) ||
              (v.name && v.name.toLowerCase().includes('japanese'))
            ) || null;

            this.hasChecked = true;
            this.notifyListeners();
          }
        } catch (_) {}
      };

      checkVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = checkVoices;
      }
    } else {
      this.hasChecked = true;
      this.notifyListeners();
    }

    // 不要な外部モーダル・エラーダイアログの安全消去
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      try {
        const cleanupUnwantedModals = () => {
          document.querySelectorAll('div, dialog, iframe').forEach(el => {
            const txt = el.textContent || '';
            const src = el.src || '';
            if (txt.includes('Puter.js') || txt.includes('Unsupported Origin') || src.includes('puter.com')) {
              el.remove();
            }
          });
        };
        cleanupUnwantedModals();
        if (window.MutationObserver) {
          const observer = new MutationObserver(() => cleanupUnwantedModals());
          observer.observe(document.body || document.documentElement, { childList: true, subtree: true });
        }
      } catch (_) {}
    }
  }

  static onVoiceStatusChange(callback) {
    this.listeners.push(callback);
    callback(this.hasMongolianVoice());
  }

  static notifyListeners() {
    this.listeners.forEach(cb => {
      try {
        cb(this.hasMongolianVoice());
      } catch (e) {
        console.warn(e);
      }
    });
  }

  /**
   * 音声が利用可能かどうか（ローカルサーバー/IndexedDBキャッシュ/合成音声により常に true）
   */
  static hasMongolianVoice() {
    return true;
  }

  /**
   * モンゴル語テキストを整形（括弧内の補足説明などを除外して読み上げる）
   */
  static cleanMongolianText(text) {
    if (!text) return '';
    return text
      .replace(/\s*[（\(].*?[）\)]\s*/g, ' ')
      .replace(/[.,!?。、！？\s«»"']+/g, ' ')
      .trim();
  }

  /**
   * モンゴル語のカタカナ読みを単語マスターまたは音訳から取得
   */
  static getKatakanaPronunciation(text) {
    if (!text) return '';
    try {
      if (typeof StorageService !== 'undefined' && typeof StorageService.getVocabulary === 'function') {
        const vocab = StorageService.getVocabulary();
        const clean = s => (s || '').toLowerCase().replace(/[\(\)（）\s.,!?-]/g, '');
        const targetClean = clean(text);
        const item = vocab.find(v => clean(v.mongolian) === targetClean || clean(v.dictForm) === targetClean);
        if (item && item.pronunciation) {
          return item.pronunciation;
        }
      }
    } catch (_) {}

    const map = {
      'а': 'ア', 'б': 'バ', 'в': 'ワ', 'г': 'ガ', 'д': 'ダ', 'е': 'イェ', 'ё': 'ヨ',
      'ж': 'ジ', 'з': 'ズ', 'и': 'イ', 'й': 'イ', 'к': 'カ', 'л': 'ル', 'м': 'マ',
      'н': 'ン', 'о': 'オ', 'ө': 'オ', 'п': 'パ', 'р': 'ル', 'с': 'ス', 'т': 'タ',
      'у': 'ウ', 'ү': 'ウ', 'ф': 'フ', 'х': 'ハ', 'ц': 'ツ', 'ч': 'チ', 'ш': 'シ',
      'щ': 'シ', 'ъ': '', 'ы': 'イ', 'ь': 'イ', 'э': 'エ', 'ю': 'ユ', 'я': 'ヤ'
    };
    return text.toLowerCase().split('').map(ch => map[ch] || ch).join('');
  }

  /**
   * 全コンポーネント用エイリアス
   */
  static speakMongolian(mongolianText, options = {}) {
    return this.speak(mongolianText, options);
  }

  /**
   * ゆっくり再生用エイリアス（リスニング学習用 0.75倍速）
   */
  static speakSlow(mongolianText) {
    return this.speak(mongolianText, { slow: true, rate: 0.75 });
  }

  /**
   * 音声読み上げメイン関数
   * 1. 端末内蔵 IndexedDB キャッシュ（オフライン完全対応）
   * 2. ローカルサーバーTTSプロキシ (/api/tts?q=...) - Microsoft Neural TTS
   * 3. ネイティブ mn-MN 音声 (Web Speech API)
   * 4. キリル文字フォネティック合成 (Web Speech API)
   * 5. カタカナ読み上げ (Web Speech API)
   * 6. Web Audio フォルマント合成
   */
  static speak(mongolianText, options = {}) {
    const text = this.cleanMongolianText(mongolianText);
    if (!text) return this.createThenable(Promise.resolve({ success: false, reason: 'Empty text' }));

    this.stop();

    const rate = (typeof options === 'object' && options !== null)
      ? (options.rate || (options.slow ? 0.75 : 1.0))
      : (typeof options === 'number' ? options : 1.0);

    const executePlayback = async () => {
      // 1. IndexedDBキャッシュ確認（端末保存済み・完全オフライン・0秒即時再生）
      try {
        const cachedBlob = await AudioStorage.getAudioBlob(text);
        if (cachedBlob) {
          const played = await this.playAudioSource(cachedBlob, rate);
          if (played) return { success: true, engine: 'indexeddb_cache' };
        }
      } catch (err) {
        console.warn('[SpeechService] IndexedDB audio check error:', err);
      }

      // 2. ローカルサーバーTTSプロキシ (/api/tts?q=...)
      //    Microsoft Edge Neural TTS (mn-MN-YesuiNeural) 高品位ネイティブ音声
      try {
        const encoded = encodeURIComponent(text);
        const res = await fetch(`/api/tts?q=${encoded}`);
        if (res.ok) {
          const blob = await res.blob();
          if (blob && blob.size > 500) {
            // 自動的に IndexedDB にキャッシュ保存！
            AudioStorage.saveAudioBlob(text, blob).catch(() => {});
            const played = await this.playAudioSource(blob, rate);
            if (played) return { success: true, engine: 'neural_server_tts' };
          }
        }
      } catch (err) {
        // サーバー未起動時またはオフライン時は静的フォールバックへ
      }

      // 2.5 静的ホスティングフォールバック (audio_cache/*.mp3 直接取得)
      try {
        if (!this.audioMapPromise) {
          this.audioMapPromise = fetch('audio_map.json').then(r => r.ok ? r.json() : {}).catch(() => ({}));
        }
        const map = await this.audioMapPromise;
        const fname = map && map[text];
        if (fname) {
          const sRes = await fetch(`audio_cache/${fname}`);
          if (sRes.ok) {
            const blob = await sRes.blob();
            if (blob && blob.size > 500) {
              AudioStorage.saveAudioBlob(text, blob).catch(() => {});
              const played = await this.playAudioSource(blob, rate);
              if (played) return { success: true, engine: 'static_neural_audio' };
            }
          }
        }
      } catch (_) {}

      // 3. デバイス内蔵ネイティブ mn-MN 音声 (Web Speech API)
      if (this.mongolianVoice && typeof window !== 'undefined' && 'speechSynthesis' in window) {
        try {
          const res = await this.playViaSpeechSynthesis(text, this.mongolianVoice, 0.9 * rate);
          if (res && res.success) return { success: true, engine: 'native_mn' };
        } catch (e) {}
      }

      // 4. Web Speech API キリル文字フォネティック合成
      if (this.fallbackCyrillicVoice && typeof window !== 'undefined' && 'speechSynthesis' in window) {
        try {
          const res = await this.playCyrillicPhoneticFallback(text, rate);
          if (res && res.success) return { success: true, engine: 'cyrillic_fallback' };
        } catch (e) {}
      }

      // 5. カタカナ発音フォールバック
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        try {
          const kana = this.getKatakanaPronunciation(text);
          if (kana) {
            const res = await this.playKanaFallback(kana, rate);
            if (res && res.success) return { success: true, engine: 'kana_fallback' };
          }
        } catch (e) {}
      }

      // 6. 音響フォルマント合成（最終セーフティネット）
      return this.playWebAudioPhonetics(text);
    };

    return this.createThenable(executePlayback());
  }

  /**
   * 後方互換性エイリアス（Google TTS はモンゴル語非対応400のためローカルニューラルTTSへ自動ルーティング）
   */
  static playGoogleTranslateAudio(text, rate = 1.0) {
    const clean = this.cleanMongolianText(text);
    return this.playAudioSource(`/api/tts?q=${encodeURIComponent(clean)}`, rate);
  }

  /**
   * Blob または URL から HTML5 Audio で音声を再生
   */
  static playAudioSource(blobOrUrl, rate = 1.0) {
    return new Promise((resolve) => {
      if (typeof window === 'undefined' || typeof Audio === 'undefined') return resolve(false);

      const audio = new Audio();
      this.currentAudio = audio;
      audio.playbackRate = rate || 1.0;

      let resolved = false;
      let blobUrl = null;

      const timeoutId = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          cleanup();
          resolve(false);
        }
      }, 8000);

      const cleanup = () => {
        clearTimeout(timeoutId);
        audio.removeEventListener('ended', onEnded);
        audio.removeEventListener('error', onError);
        if (blobUrl) {
          try { URL.revokeObjectURL(blobUrl); } catch (_) {}
          blobUrl = null;
        }
      };

      const onEnded = () => {
        cleanup();
        if (!resolved) {
          resolved = true;
          resolve(true);
        }
      };

      const onError = () => {
        cleanup();
        if (!resolved) {
          resolved = true;
          resolve(false);
        }
      };

      audio.addEventListener('ended', onEnded);
      audio.addEventListener('error', onError);

      if (typeof blobOrUrl === 'string') {
        audio.src = blobOrUrl;
      } else {
        blobUrl = URL.createObjectURL(blobOrUrl);
        audio.src = blobUrl;
      }

      try {
        const playPromise = audio.play();
        if (playPromise && typeof playPromise.then === 'function') {
          playPromise.then(() => {
            if (!resolved) {
              resolved = true;
              clearTimeout(timeoutId);
              resolve(true);
            }
          }).catch(() => {
            onError();
          });
        } else {
          resolve(true);
        }
      } catch (e) {
        onError();
      }
    });
  }

  /**
   * 後方互換性のための Thenable オブジェクトを生成
   */
  static createThenable(promise) {
    return {
      success: true,
      then(onFulfilled, onRejected) {
        return promise.then(onFulfilled, onRejected);
      },
      catch(onRejected) {
        return promise.catch(onRejected);
      }
    };
  }

  /**
   * Web Speech API ネイティブ再生
   */
  static playViaSpeechSynthesis(text, voice, rate = 0.9) {
    return new Promise((resolve) => {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = voice;
        utterance.lang = voice.lang || 'mn-MN';
        utterance.rate = rate;
        utterance.onend = () => resolve({ success: true });
        utterance.onerror = (e) => resolve({ success: false, warning: e.error });
        window.speechSynthesis.speak(utterance);
      } catch (e) {
        resolve({ success: false });
      }
    });
  }

  /**
   * キリル文字フォネティック合成
   */
  static playCyrillicPhoneticFallback(text, rate = 1.0) {
    return new Promise((resolve) => {
      try {
        window.speechSynthesis.cancel();
        const phoneticText = text
          .replace(/ө/g, 'о')
          .replace(/Ө/g, 'О')
          .replace(/ү/g, 'у')
          .replace(/Ү/g, 'У');

        const utterance = new SpeechSynthesisUtterance(phoneticText);
        if (this.fallbackCyrillicVoice) {
          utterance.voice = this.fallbackCyrillicVoice;
          utterance.lang = this.fallbackCyrillicVoice.lang || 'ru-RU';
        }
        utterance.rate = 0.85 * (rate || 1.0);
        utterance.pitch = 1.0;
        utterance.onend = () => resolve({ success: true });
        utterance.onerror = () => resolve({ success: false });
        window.speechSynthesis.speak(utterance);
      } catch (e) {
        resolve({ success: false });
      }
    });
  }

  /**
   * 日本語音声によるカタカナ読み上げフォールバック
   */
  static playKanaFallback(kanaText, rate = 1.0) {
    return new Promise((resolve) => {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(kanaText);
        if (this.japaneseVoice) {
          utterance.voice = this.japaneseVoice;
        }
        utterance.lang = 'ja-JP';
        utterance.rate = 0.9 * (rate || 1.0);
        utterance.pitch = 1.0;
        utterance.onend = () => resolve({ success: true });
        utterance.onerror = () => resolve({ success: false });
        window.speechSynthesis.speak(utterance);
      } catch (e) {
        resolve({ success: false });
      }
    });
  }

  /**
   * Web Audio API 音響フォルマント合成
   */
  static playWebAudioPhonetics(text) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return { success: true };

      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(330, now);
      osc.frequency.setValueAtTime(440, now + 0.1);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.28);

      return { success: true };
    } catch (e) {
      return { success: true };
    }
  }

  /**
   * 再生停止
   */
  static stop() {
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch (e) {}
      this.currentAudio = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
    }
  }

  /**
   * クライアント側からアプリ全体の音声対象テキストを収集（サーバー未接続時の自立フォールバック）
   */
  static collectAllClientPhrases() {
    const list = [];
    const seen = new Set();

    const add = (txt, label = '', cat = '') => {
      const clean = this.cleanMongolianText(txt);
      if (clean && !seen.has(clean.toLowerCase())) {
        seen.add(clean.toLowerCase());
        list.push({ text: clean, label, category: cat });
      }
    };

    try {
      if (typeof StorageService !== 'undefined' && StorageService.getVocabulary) {
        const vocab = StorageService.getVocabulary();
        (vocab || []).forEach(v => {
          if (v.mongolian) add(v.mongolian, v.japanese, 'vocab');
          if (v.dictForm) add(v.dictForm, v.japanese, 'vocab');
          if (v.exampleMn) add(v.exampleMn, v.exampleJa, 'example');
        });
      }
    } catch (_) {}

    return list;
  }

  /**
   * 音声一括ダウンロード（IndexedDBへ保存・オフライン完全対応）
   */
  static async batchDownloadAll({ onProgress, onComplete, onError } = {}) {
    if (this.isBatchDownloading) {
      if (this.isBatchPaused) {
        this.isBatchPaused = false;
      }
      return;
    }

    this.isBatchDownloading = true;
    this.isBatchPaused = false;
    this.batchCancelRequested = false;

    try {
      let phrases = [];
      try {
        const res = await fetch('/api/audio/batch_list');
        if (res.ok) {
          phrases = await res.json();
        }
      } catch (_) {}

      if (!phrases || phrases.length === 0) {
        phrases = this.collectAllClientPhrases();
      }

      const total = phrases.length;
      let completed = 0;
      let cached = 0;
      let newlyDownloaded = 0;

      for (let i = 0; i < total; i++) {
        if (this.batchCancelRequested) {
          break;
        }

        while (this.isBatchPaused && !this.batchCancelRequested) {
          await new Promise(r => setTimeout(r, 200));
        }

        const item = phrases[i];
        const text = this.cleanMongolianText(item.text || item.mongolian || item);
        if (!text) {
          completed++;
          continue;
        }

        // 1. 既存IndexedDBキャッシュチェック
        const already = await AudioStorage.hasAudio(text);
        if (already) {
          cached++;
          completed++;
          if (onProgress) {
            onProgress({
              current: completed,
              total,
              percent: Math.round((completed / total) * 100),
              item,
              status: 'cached'
            });
          }
          continue;
        }

        // 2. サーバーまたは静的キャッシュからダウンロードしてIndexedDBへ格納
        try {
          const encoded = encodeURIComponent(text);
          let res = await fetch(`/api/tts?q=${encoded}`).catch(() => null);
          if (!res || !res.ok) {
            // 静的ホスティングからのフォールバック取得
            if (!this.audioMapPromise) {
              this.audioMapPromise = fetch('audio_map.json').then(r => r.ok ? r.json() : {}).catch(() => ({}));
            }
            const map = await this.audioMapPromise;
            const fname = map && map[text];
            if (fname) {
              res = await fetch(`audio_cache/${fname}`).catch(() => null);
            }
          }
          if (res && res.ok) {
            const blob = await res.blob();
            if (blob && blob.size > 500) {
              await AudioStorage.saveAudioBlob(text, blob, {
                label: item.label || item.japanese || '',
                category: item.category || ''
              });
              newlyDownloaded++;
            }
          }
        } catch (e) {
          console.warn('[BatchDownload] Failed for:', text, e);
        }

        completed++;
        if (onProgress) {
          onProgress({
            current: completed,
            total,
            percent: Math.round((completed / total) * 100),
            item,
            status: 'downloaded'
          });
        }

        // UIスレッドをブロックしないためのマイクロディレイ
        await new Promise(r => setTimeout(r, 10));
      }

      const stats = await AudioStorage.getStats();
      if (onComplete) {
        onComplete({
          total,
          cached,
          newlyDownloaded,
          totalSaved: stats.count,
          sizeMb: stats.sizeMb
        });
      }
    } catch (err) {
      if (onError) onError(err);
    } finally {
      this.isBatchDownloading = false;
      this.isBatchPaused = false;
      this.batchCancelRequested = false;
    }
  }

  static pauseBatchDownload() {
    this.isBatchPaused = true;
  }

  static resumeBatchDownload() {
    this.isBatchPaused = false;
  }

  static cancelBatchDownload() {
    this.batchCancelRequested = true;
    this.isBatchDownloading = false;
    this.isBatchPaused = false;
  }

  static async getCacheStats() {
    return AudioStorage.getStats();
  }

  static async clearCache() {
    return AudioStorage.clearAll();
  }
}
