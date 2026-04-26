/* ===================================================
   APP/VIEWS/PAGES/AUTHPAGE.JS — Login (passkey only)
   =================================================== */

const AuthPage = {

  render() {
    return `
      ${Header.render()}
      ${MobileNav.render()}

      <section class="auth-section">
        <div class="auth-card">

          <div class="auth-visual">
            <div class="auth-visual-content">
              <h2 class="auth-visual-title">Great to see you <em>again</em></h2>
              <p class="auth-visual-text">Sign in to access your space and manage your collaborations.</p>
              <div class="auth-visual-deco"></div>
            </div>
          </div>

          <div class="auth-form-side">
            <div class="auth-message" id="authMessage"></div>

            <div class="form-group" style="margin-bottom:16px">
              <label for="loginEmail">Email address</label>
              <input type="email" id="loginEmail" placeholder="your@email.com"
                     autocomplete="email webauthn"
                     onkeydown="if(event.key==='Enter') AuthPage.handlePasskeyAuth()">
            </div>

            <button type="button" class="btn-passkey" id="passkeyBtn"
                    onclick="AuthPage.handlePasskeyAuth()">
              <svg class="btn-passkey-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="8" cy="15" r="4"/>
                <path d="M11.7 11.3L20 3"/>
                <path d="M19 4l2 2"/>
                <path d="M16 7l2 2"/>
              </svg>
              <span id="passkeyBtnText">Sign in with passkey</span>
              <span class="btn-auth-loader" id="passkeyLoader" style="display:none"></span>
            </button>

            <p class="auth-switch" style="margin-top:20px">
              Access by invitation only. <a href="#contact">Contact us</a>
            </p>
          </div>
        </div>
      </section>
    `;
  },

  // ── Passkey helpers ──────────────────────────────────────
  _b64u(buf) {
    return btoa(String.fromCharCode(...new Uint8Array(buf instanceof ArrayBuffer ? buf : buf.buffer)))
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  },
  _fromb64u(str) {
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    while (str.length % 4) str += '=';
    return Uint8Array.from(atob(str), c => c.charCodeAt(0)).buffer;
  },

  async handlePasskeyAuth() {
    if (!window.PublicKeyCredential) {
      this._showMsg('Passkeys are not supported by your browser. Please update your browser or contact us.', 'error');
      return;
    }
    const email  = document.getElementById('loginEmail')?.value?.trim() || '';
    const btn    = document.getElementById('passkeyBtn');
    const loader = document.getElementById('passkeyLoader');
    const text   = document.getElementById('passkeyBtnText');
    btn.disabled = true;
    text.textContent = 'Waiting…';
    loader.style.display = '';
    this._clearMsg();

    try {
      // 1. Get challenge
      const opts = await fetch('api/webauthn.php?action=auth_begin', {
        method:      'POST',
        headers:     { 'Content-Type': 'application/json' },
        credentials: 'include',
        body:        JSON.stringify({ email }),
      }).then(r => r.json());

      if (!opts.challenge) {
        this._showMsg(opts.message || opts.error || 'No passkey found for this account.', 'error');
        return;
      }

      // 2. Biometric / PIN prompt
      const assertion = await navigator.credentials.get({
        publicKey: {
          challenge:        this._fromb64u(opts.challenge),
          rpId:             opts.rpId,
          userVerification: opts.userVerification,
          timeout:          opts.timeout,
          allowCredentials: (opts.allowCredentials || []).map(c => ({ ...c, id: this._fromb64u(c.id) })),
        },
      });

      // 3. Verify on server
      const result = await fetch('api/webauthn.php?action=auth_finish', {
        method:      'POST',
        headers:     { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          id:                assertion.id,
          clientDataJSON:    this._b64u(assertion.response.clientDataJSON),
          authenticatorData: this._b64u(assertion.response.authenticatorData),
          signature:         this._b64u(assertion.response.signature),
        }),
      }).then(r => r.json());

      if (result.success) {
        UserModel._setUser(result.user);
        this._showMsg('Signed in! Redirecting…', 'success');
        setTimeout(() => Router.navigate('home'), 600);
      } else {
        this._showMsg(result.message || 'Authentication failed.', 'error');
      }
    } catch (err) {
      if (err.name !== 'NotAllowedError') {
        this._showMsg('Passkey error: ' + err.message, 'error');
      }
    } finally {
      btn.disabled = false;
      text.textContent = 'Sign in with passkey';
      loader.style.display = 'none';
    }
  },

  _showMsg(text, type) {
    const el = document.getElementById('authMessage');
    if (el) { el.textContent = text; el.className = 'auth-message ' + type; }
  },
  _clearMsg() {
    const el = document.getElementById('authMessage');
    if (el) { el.textContent = ''; el.className = 'auth-message'; }
  },
};
