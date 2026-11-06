// ユーザー名・パスワード認証サービス（Web Crypto API暗号化・復旧コード対応）
// メールアドレス・Googleアカウント一切不要の独立した認証システム

export class AuthService {
  static SESSION_KEY = 'mongol_app_auth_session_v1';
  static LOCAL_USERS_KEY = 'mongol_app_local_users_v1';

  // --- 暗号化ユーティリティ（Web Crypto API） ---

  /**
   * ランダムなソルトを生成 (hex)
   */
  static generateSalt(bytes = 16) {
    const array = new Uint8Array(bytes);
    window.crypto.getRandomValues(array);
    return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * PBKDF2-SHA256 でパスワードを安全にハッシュ化
   */
  static async hashPassword(password, saltHex) {
    const enc = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      enc.encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveBits', 'deriveKey']
    );

    // ソルトをUint8Arrayに変換
    const saltBytes = new Uint8Array(saltHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));

    const derivedKey = await window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: saltBytes,
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt']
    );

    const exported = await window.crypto.subtle.exportKey('raw', derivedKey);
    return Array.from(new Uint8Array(exported)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * 16桁のワンタイム復旧コードを生成 (例: MN-8F2A-99B1-C4E2)
   */
  static generateRecoveryCode() {
    const array = new Uint8Array(6);
    window.crypto.getRandomValues(array);
    const hex = Array.from(array).map(b => b.toString(16).toUpperCase().padStart(2, '0')).join('');
    return `MN-${hex.substring(0, 4)}-${hex.substring(4, 8)}-${hex.substring(8, 12)}`;
  }

  /**
   * 復旧コードのハッシュを計算
   */
  static async hashRecoveryCode(code, saltHex) {
    const cleanCode = code.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    return this.hashPassword(cleanCode, saltHex);
  }

  // --- ユーザー名正規化 ---

  /**
   * ユーザー名の正規化
   * 1. 全角英数字・互換文字の半角化 (Unicode NFKC)
   * 2. 全角ダッシュ・ハイフン・長音（ー―－‐）および全角アンダースコア（＿）の半角統一
   * 3. 全角スペース（\u3000）および前後の空白除去
   * 4. 小文字化（英字）
   */
  static normalizeUsername(username) {
    if (!username) return '';
    let norm = String(username).normalize('NFKC');
    norm = norm.replace(/[ー―－‐]/g, '-').replace(/[＿]/g, '_');
    norm = norm.trim();
    return norm.toLowerCase();
  }

  // --- ローカルユーザー管理 ---

  static getLocalUsers() {
    try {
      const data = localStorage.getItem(this.LOCAL_USERS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  static saveLocalUsers(users) {
    localStorage.setItem(this.LOCAL_USERS_KEY, JSON.stringify(users));
  }

  // --- 現在のセッション ---

  static getCurrentUser() {
    try {
      const data = localStorage.getItem(this.SESSION_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  static setSession(user) {
    const sessionData = {
      id: user.id,
      username: this.normalizeUsername(user.username),
      displayName: user.displayName || user.username,
      loggedInAt: new Date().toISOString()
    };
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionData));
    return sessionData;
  }

  static logout() {
    localStorage.removeItem(this.SESSION_KEY);
  }

  // --- アカウント新規登録 ---

  /**
   * ユーザー名とパスワードによる登録（メール不要・Google不要）
   */
  static async register(username, password) {
    const rawUsername = (username || '').trim();
    const cleanUsername = this.normalizeUsername(rawUsername);

    if (!cleanUsername || cleanUsername.length < 2) {
      return { success: false, error: 'ユーザー名は2文字以上で入力してください。', code: 'TOO_SHORT' };
    }

    // 英数字、日本語（漢字・ひらがな・カタカナ）、キリル文字、ハイフン、アンダースコアを許可
    if (!/^[\p{L}\p{N}_-]+$/u.test(cleanUsername)) {
      return {
        success: false,
        error: 'ユーザー名には文字（半角英数・日本語・キリル文字）、ハイフン、アンダースコアが使用できます。記号やスペースは使えません。',
        code: 'INVALID_CHARS'
      };
    }

    if (!password || password.length < 6) {
      return { success: false, error: 'パスワードは6文字以上で入力してください。', code: 'PASSWORD_TOO_SHORT' };
    }

    // 重複チェック（正規化後の文字列で比較）
    const users = this.getLocalUsers();
    const existing = users.find(u => this.normalizeUsername(u.username) === cleanUsername);
    if (existing) {
      const display = existing.displayName || existing.username;
      return {
        success: false,
        error: `ユーザー名「${display}」は既に登録されています。「ログイン」タブからログインしてください。`,
        code: 'USER_EXISTS',
        existingUsername: display
      };
    }

    // パスワードと復旧コードのハッシュ化
    const salt = this.generateSalt();
    const passwordHash = await this.hashPassword(password, salt);
    const recoveryCode = this.generateRecoveryCode();
    const recoverySalt = this.generateSalt();
    const recoveryCodeHash = await this.hashRecoveryCode(recoveryCode, recoverySalt);

    const newUser = {
      id: `usr_${Date.now()}_${this.generateSalt(4)}`,
      username: cleanUsername,
      displayName: rawUsername,
      salt: salt,
      passwordHash: passwordHash,
      recoverySalt: recoverySalt,
      recoveryCodeHash: recoveryCodeHash,
      recoveryUsed: false,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    };

    users.push(newUser);
    this.saveLocalUsers(users);

    // 自動ログイン
    const session = this.setSession(newUser);
    this.syncUserToServer(newUser);

    return {
      success: true,
      user: session,
      recoveryCode: recoveryCode
    };
  }

  // --- ログイン ---

  /**
   * ユーザー名とパスワードによるログイン
   */
  static async login(username, password) {
    const rawUsername = (username || '').trim();
    const cleanUsername = this.normalizeUsername(rawUsername);

    if (!cleanUsername || !password) {
      return { success: false, error: 'ユーザー名とパスワードを入力してください。', code: 'MISSING_FIELDS' };
    }

    let users = this.getLocalUsers();
    let user = users.find(u => this.normalizeUsername(u.username) === cleanUsername);

    // 端末内に該当アカウントが存在しない場合、Webサーバー（LAN内）からアカウント一覧の自動同期を試みる
    if (!user) {
      try {
        const serverUsers = await this.fetchServerAccounts();
        if (serverUsers && serverUsers.length > 0) {
          this.mergeServerUsers(serverUsers);
          users = this.getLocalUsers();
          user = users.find(u => this.normalizeUsername(u.username) === cleanUsername);
        }
      } catch (_) {}
    }

    // 端末内に保存されているアカウントが1件もない場合
    if (!user) {
      if (!users || users.length === 0) {
        return {
          success: false,
          error: `この端末・ブラウザには登録されたアカウントがありません。PC画面の「📱 タブレット連携」QRコードを読み取ってワンタップログインするか、「新規登録」タブから「${rawUsername}」のアカウントを作成してください。`,
          code: 'NO_USERS_ON_DEVICE',
          inputUsername: rawUsername
        };
      }
      const knownUsers = users.map(u => u.displayName || u.username);
      return {
        success: false,
        error: `ユーザー名「${rawUsername}」のアカウントが見つかりません。PC側の「📱 タブレット連携」QRコードを読み取ってログインするか、スペルをお確かめください。`,
        code: 'USER_NOT_FOUND',
        inputUsername: rawUsername,
        registeredUsers: knownUsers
      };
    }

    const testHash = await this.hashPassword(password, user.salt);
    if (testHash !== user.passwordHash) {
      return {
        success: false,
        error: 'ユーザー名は確認できましたが、パスワードが一致しません。入力内容をお確かめいただくか、復旧コードをお試しください。',
        code: 'PASSWORD_MISMATCH',
        matchedUsername: user.displayName || user.username
      };
    }

    user.lastLoginAt = new Date().toISOString();
    this.saveLocalUsers(users);

    const session = this.setSession(user);
    this.syncUserToServer(user);
    return { success: true, user: session };
  }

  // --- パスワード復旧（ワンタイム復旧コード） ---

  /**
   * 復旧コードによるパスワード再設定
   */
  static async resetPasswordWithRecoveryCode(username, recoveryCode, newPassword) {
    const rawUsername = (username || '').trim();
    const cleanUsername = this.normalizeUsername(rawUsername);

    if (!cleanUsername || !recoveryCode || !newPassword) {
      return { success: false, error: 'すべての項目を入力してください。', code: 'MISSING_FIELDS' };
    }
    if (newPassword.length < 6) {
      return { success: false, error: '新しいパスワードは6文字以上で入力してください。', code: 'PASSWORD_TOO_SHORT' };
    }

    const users = this.getLocalUsers();
    const user = users.find(u => this.normalizeUsername(u.username) === cleanUsername);

    if (!user) {
      return { success: false, error: `ユーザー名「${rawUsername}」が見つかりません。`, code: 'USER_NOT_FOUND' };
    }

    if (user.recoveryUsed) {
      return { success: false, error: 'この復旧コードは既に使用済みです。', code: 'CODE_ALREADY_USED' };
    }

    const testRecoveryHash = await this.hashRecoveryCode(recoveryCode, user.recoverySalt);
    if (testRecoveryHash !== user.recoveryCodeHash) {
      return {
        success: false,
        error: '復旧コードが正しくありません。ハイフンを含めて正確に入力してください（例: MN-XXXX-XXXX-XXXX）。',
        code: 'INVALID_CODE'
      };
    }

    // 新しいパスワードをハッシュ化
    const newSalt = this.generateSalt();
    user.salt = newSalt;
    user.passwordHash = await this.hashPassword(newPassword, newSalt);

    // 新しい復旧コードを発行
    const newRecoveryCode = this.generateRecoveryCode();
    const newRecoverySalt = this.generateSalt();
    user.recoverySalt = newRecoverySalt;
    user.recoveryCodeHash = await this.hashRecoveryCode(newRecoveryCode, newRecoverySalt);
    user.recoveryUsed = false;
    user.lastLoginAt = new Date().toISOString();

    this.saveLocalUsers(users);
    const session = this.setSession(user);
    this.syncUserToServer(user);

    return {
      success: true,
      user: session,
      newRecoveryCode: newRecoveryCode
    };
  }

  // --- サーバー（LAN）連携アカウント同期 ---

  static async fetchServerAccounts() {
    if (typeof window === 'undefined' || !window.fetch) return [];
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const res = await fetch('/api/accounts', {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        return await res.json();
      }
    } catch (_) {}
    return [];
  }

  static async syncUserToServer(user) {
    if (typeof window === 'undefined' || !window.fetch || !user) return;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      await fetch('/api/accounts/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
    } catch (_) {}
  }

  static mergeServerUsers(serverUsers) {
    if (!Array.isArray(serverUsers)) return;
    const localUsers = this.getLocalUsers();
    let updated = false;

    serverUsers.forEach(su => {
      if (!su || !su.username) return;
      const clean = this.normalizeUsername(su.username);
      const idx = localUsers.findIndex(u => this.normalizeUsername(u.username) === clean);
      if (idx >= 0) {
        // 既存ユーザーの更新（最終ログイン時刻など）
        localUsers[idx] = { ...localUsers[idx], ...su };
        updated = true;
      } else {
        localUsers.push(su);
        updated = true;
      }
    });

    if (updated) {
      this.saveLocalUsers(localUsers);
    }
  }

  // --- 他端末（タブレット・スマホ）用ワンクリック URL 自動ログイン（Magic Login Token） ---

  /**
   * 現在のアカウント情報と学習ステータスからワンクリックログインURL用のトークンを生成
   */
  static createMagicLoginToken(user) {
    if (!user) return null;
    const cleanUsername = this.normalizeUsername(user.username);
    const users = this.getLocalUsers();
    const fullUser = users.find(u => this.normalizeUsername(u.username) === cleanUsername) || user;

    let mascotData = null;
    let gamificationData = null;
    let mistakesData = null;
    let lookedUpWordsData = null;
    let wordProgressData = null;
    try {
      mascotData = localStorage.getItem('mongol_app_penguin_mascot_v1');
      gamificationData = localStorage.getItem('mongol_app_gamification_v2');
      mistakesData = localStorage.getItem('mongol_app_mistakes_v1');
      lookedUpWordsData = localStorage.getItem('mongol_app_looked_up_words_v1');
      wordProgressData = localStorage.getItem('mongol_app_word_progress_v1');
    } catch (_) {}

    const payload = {
      v: 1,
      u: {
        id: fullUser.id,
        username: fullUser.username,
        displayName: fullUser.displayName || fullUser.username,
        salt: fullUser.salt || '',
        passwordHash: fullUser.passwordHash || '',
        recoverySalt: fullUser.recoverySalt || '',
        recoveryCodeHash: fullUser.recoveryCodeHash || '',
        createdAt: fullUser.createdAt || new Date().toISOString()
      },
      p: mascotData ? JSON.parse(mascotData) : null,
      g: gamificationData ? JSON.parse(gamificationData) : null,
      m: mistakesData ? JSON.parse(mistakesData) : null,
      l: lookedUpWordsData ? JSON.parse(lookedUpWordsData) : null,
      w: wordProgressData ? JSON.parse(wordProgressData) : null,
      t: Date.now()
    };

    try {
      const jsonStr = JSON.stringify(payload);
      const bytes = new TextEncoder().encode(jsonStr);
      let binary = '';
      for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return btoa(binary)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
    } catch (e) {
      console.error('[AuthService] createMagicLoginToken error:', e);
      return null;
    }
  }

  /**
   * 指定ベースURLとアカウントからワンクリックログインURLを生成
   */
  static createMagicLoginUrl(user, baseUrl) {
    const token = this.createMagicLoginToken(user);
    if (!token) return baseUrl;
    const separator = baseUrl.includes('?') ? '&' : '?';
    return `${baseUrl}${separator}login_token=${token}`;
  }

  /**
   * ワンクリックログインURLのトークンを解析してアカウントを登録・自動ログイン
   */
  static processMagicLoginToken(token) {
    if (!token) return { success: false, error: 'Empty token' };
    try {
      let base64 = token.replace(/-/g, '+').replace(/_/g, '/');
      while (base64.length % 4) {
        base64 += '=';
      }
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const jsonStr = new TextDecoder().decode(bytes);
      const payload = JSON.parse(jsonStr);

      if (!payload || !payload.u || !payload.u.username) {
        return { success: false, error: '無効なログイントークンです。' };
      }

      const u = payload.u;
      const cleanUsername = this.normalizeUsername(u.username);

      // ローカルユーザーリストに保存・更新
      const users = this.getLocalUsers();
      const existingIdx = users.findIndex(x => this.normalizeUsername(x.username) === cleanUsername);
      const userRecord = {
        id: u.id || `usr_${Date.now()}`,
        username: cleanUsername,
        displayName: u.displayName || u.username,
        salt: u.salt || '',
        passwordHash: u.passwordHash || '',
        recoverySalt: u.recoverySalt || '',
        recoveryCodeHash: u.recoveryCodeHash || '',
        recoveryUsed: false,
        createdAt: u.createdAt || new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      };

      if (existingIdx >= 0) {
        users[existingIdx] = { ...users[existingIdx], ...userRecord };
      } else {
        users.push(userRecord);
      }
      this.saveLocalUsers(users);

      // アクティブセッション確立
      const session = this.setSession(userRecord);

      // 学習データ・ペンギン進捗の引き継ぎ
      if (payload.p) {
        try {
          localStorage.setItem('mongol_app_penguin_mascot_v1', JSON.stringify(payload.p));
        } catch (_) {}
      }
      if (payload.g) {
        try {
          const curG = localStorage.getItem('mongol_app_gamification_v2');
          if (!curG || (payload.g.xp && (!JSON.parse(curG).xp || payload.g.xp > JSON.parse(curG).xp))) {
            localStorage.setItem('mongol_app_gamification_v2', JSON.stringify(payload.g));
          }
        } catch (_) {}
      }

      // 間違えた問題（間違いノート）の引き継ぎ・マージ
      if (payload.m && Array.isArray(payload.m)) {
        try {
          const curMistakes = JSON.parse(localStorage.getItem('mongol_app_mistakes_v1') || '[]');
          payload.m.forEach(newItem => {
            const idx = curMistakes.findIndex(x => x.id === newItem.id || (x.question === newItem.question && x.correctAnswer === newItem.correctAnswer));
            if (idx >= 0) {
              curMistakes[idx] = { ...curMistakes[idx], ...newItem };
            } else {
              curMistakes.push(newItem);
            }
          });
          localStorage.setItem('mongol_app_mistakes_v1', JSON.stringify(curMistakes));
        } catch (_) {}
      }

      // 調べた単語帳の引き継ぎ・マージ
      if (payload.l && Array.isArray(payload.l)) {
        try {
          const curLookedUp = JSON.parse(localStorage.getItem('mongol_app_looked_up_words_v1') || '[]');
          payload.l.forEach(newItem => {
            const cleanKey = (newItem.dictForm || newItem.rawWord || '').trim().toLowerCase();
            const idx = curLookedUp.findIndex(x => (x.dictForm || x.rawWord || '').trim().toLowerCase() === cleanKey);
            if (idx >= 0) {
              curLookedUp[idx] = { ...curLookedUp[idx], ...newItem };
            } else {
              curLookedUp.push(newItem);
            }
          });
          localStorage.setItem('mongol_app_looked_up_words_v1', JSON.stringify(curLookedUp));
        } catch (_) {}
      }

      // SRS復習進捗（振り返るべき単語）の引き継ぎ・マージ
      if (payload.w && typeof payload.w === 'object') {
        try {
          const curProg = JSON.parse(localStorage.getItem('mongol_app_word_progress_v1') || '{}');
          Object.keys(payload.w).forEach(wId => {
            const incoming = payload.w[wId];
            const existing = curProg[wId];
            if (!existing || (incoming.srsLevel || 0) >= (existing.srsLevel || 0)) {
              curProg[wId] = { ...(existing || {}), ...incoming };
            }
          });
          localStorage.setItem('mongol_app_word_progress_v1', JSON.stringify(curProg));
        } catch (_) {}
      }

      return { success: true, user: session };
    } catch (e) {
      console.error('[AuthService] processMagicLoginToken error:', e);
      return { success: false, error: 'トークン形式が無効です。' };
    }
  }

  /**
   * 他端末ログイン成功時のトースト通知バナー
   */
  static showLoginSuccessToast(username) {
    let toast = document.getElementById('magic-login-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'magic-login-toast';
      document.body.appendChild(toast);
    }

    toast.className = "fixed top-4 left-1/2 -translate-x-1/2 z-[99999] max-w-sm w-11/12 bg-gradient-to-r from-emerald-600 to-teal-700 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-fade-in border border-emerald-400";
    toast.innerHTML = `
      <span class="text-2xl animate-bounce">🐧</span>
      <div class="flex-1 min-w-0">
        <div class="text-xs font-bold leading-tight">ログイン完了！</div>
        <div class="text-[11px] opacity-90 truncate">「${username}」のアカウントを連携しました</div>
      </div>
      <button type="button" class="text-white/80 hover:text-white font-bold p-1 text-sm" onclick="this.parentElement.remove()">✕</button>
    `;

    setTimeout(() => {
      if (toast && toast.parentElement) {
        toast.style.transition = 'opacity 0.5s ease';
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 500);
      }
    }, 4500);
  }
}
