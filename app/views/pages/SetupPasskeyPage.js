/* ===================================================
   APP/VIEWS/PAGES/SETUPPASSKEYPAGE.JS
   Invitation flow — first-time passkey registration
   URL: /?invite=TOKEN#setup-passkey
   =================================================== */

const SetupPasskeyPage = {

  _token: null,
  _user:  null,

  render() {
    this._token = new URLSearchParams(window.location.search).get('invite') || '';
    this._user  = null;
    return `
      ${Header.render()}
      ${MobileNav.render()}

      <section class="auth-section">
        <div class="auth-card">

          <div class="auth-visual">
            <div class="auth-visual-content">
              <h2 class="auth-visual-title">Welcome to <em>Influmatch</em></h2>
              <p class="auth-visual-text">Set up your passkey to securely access your space — no password needed, ever.</p>
              <div class="auth-visual-deco"></div>
            </div>
          </div>

          <div class="auth-form-side" id="setupFormSide">
            <div class="dash-skeleton" style="height:28px;border-radius:6px;margin-bottom:14px"></div>
            <div class="dash-skeleton" style="height:18px;border-radius:6px;width:65%;margin-bottom:32px"></div>
            <div class="dash-skeleton" style="height:50px;border-radius:10px"></div>
          </div>
        </div>
      </section>
    `;
  },

  async afterRender() {
    if (!this._token) {
      this._showError('No invitation token found. Please use the link from your invitation email.');
      return;
    }
    try {
      const res  = await fetch(`api/auth.php?action=validate_invitation&token=${encodeURIComponent(this._token)}`);
      const data = await res.json();
      if (!data.success) {
        this._showError(data.message || 'Invalid or expired invitation. Please contact us.');
        return;
      }
      this._user = data;
      this._showForm();
    } catch (_) {
      this._showError('Connection error. Please try again.');
    }
  },

  _showForm() {
    const side = document.getElementById('setupFormSide');
    if (!side) return;
    const name = this._esc(this._user.firstname || '');
    side.innerHTML = `
      <div class="auth-message" id="setupMsg"></div>

      <div style="margin-bottom:28px">
        <h2 style="font-size:1.35rem;font-weight:800;color:var(--text);margin:0 0 8px">
          Hello, <span style="color:var(--primary)">${name}</span>!
        </h2>
        <p style="font-size:.9rem;color:var(--muted);line-height:1.6;margin:0">
          Your account is ready. Set up a passkey to sign in instantly using Face ID, Touch ID, or Windows Hello.
        </p>
      </div>

      <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:28px">
        <div style="display:flex;align-items:center;gap:10px;font-size:.84rem;color:var(--muted)">
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="1.8"
               stroke-linecap="round" stroke-linejoin="round" style="width:18px;height:18px;flex-shrink:0">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          Phishing-proof — your biometrics never leave your device
        </div>
        <div style="display:flex;align-items:center;gap:10px;font-size:.84rem;color:var(--muted)">
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="1.8"
               stroke-linecap="round" stroke-linejoin="round" style="width:18px;height:18px;flex-shrink:0">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
          </svg>
          One tap to sign in — no password to remember or reset
        </div>
      </div>

      <button class="btn-auth" id="setupBtn" onclick="SetupPasskeyPage.register(this)">
        <span class="btn-auth-text">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
               stroke-linecap="round" stroke-linejoin="round"
               style="width:16px;height:16px;margin-right:6px;vertical-align:-2px">
            <circle cx="8" cy="15" r="4"/>
            <path d="M11.7 11.3L20 3"/>
            <path d="M19 4l2 2"/>
            <path d="M16 7l2 2"/>
          </svg>
          Set up my passkey
        </span>
        <span class="btn-auth-loader"></span>
      </button>
    `;
    document.getElementById('setupMsg').style.display = 'none';
  },

  _showError(msg) {
    const side = document.getElementById('setupFormSide');
    if (!side) return;
    side.innerHTML = `
      <div style="text-align:center;padding:16px 0">
        <div style="width:56px;height:56px;border-radius:14px;background:#fef2f2;
                    display:flex;align-items:center;justify-content:center;margin:0 auto 20px">
          <svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="1.8"
               stroke-linecap="round" stroke-linejoin="round" style="width:26px;height:26px">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <h2 style="font-size:1.2rem;font-weight:800;color:var(--text);margin:0 0 10px">Invalid invitation</h2>
        <p style="font-size:.88rem;color:var(--muted);line-height:1.6;margin:0 0 24px">${msg}</p>
        <a href="#contact" class="btn-auth" style="display:inline-flex;text-decoration:none">Contact us</a>
      </div>
    `;
  },

  async register(btn) {
    if (!window.PublicKeyCredential) {
      this._msg('Passkeys are not supported by your browser. Please contact us for assistance.', 'error');
      return;
    }
    btn.disabled = true;
    btn.classList.add('loading');
    this._msg('', '');

    try {
      // 1. Get creation options (invite flow)
      const beginRes = await fetch('api/webauthn.php?action=register_begin', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ invite_token: this._token }),
      });
      const opts = await beginRes.json();
      if (!beginRes.ok) throw new Error(opts.message || 'Failed to start registration.');

      // 2. Create credential (triggers biometric / PIN)
      opts.challenge = this._fromb64u(opts.challenge);
      opts.user.id   = this._fromb64u(opts.user.id);
      if (opts.excludeCredentials?.length) {
        opts.excludeCredentials = opts.excludeCredentials.map(c => ({ ...c, id: this._fromb64u(c.id) }));
      }

      const cred = await navigator.credentials.create({ publicKey: opts });

      // 3. Send to server
      const finishRes = await fetch('api/webauthn.php?action=register_finish', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id:                this._b64u(new Uint8Array(cred.rawId)),
          rawId:             this._b64u(new Uint8Array(cred.rawId)),
          type:              cred.type,
          clientDataJSON:    this._b64u(new Uint8Array(cred.response.clientDataJSON)),
          attestationObject: this._b64u(new Uint8Array(cred.response.attestationObject)),
          deviceName:        'My passkey',
        }),
      });
      const result = await finishRes.json();
      if (!result.success) throw new Error(result.message || 'Registration failed.');

      // 4. Auto-login
      if (result.autologin && result.user) {
        UserModel._setUser(result.user);
      }

      localStorage.setItem('influmatch_tour_pending', '1');
      this._msg('Passkey set up! Redirecting…', 'success');
      setTimeout(() => {
        history.replaceState(null, '', window.location.pathname);
        Router.navigate('home');
      }, 1000);

    } catch (err) {
      btn.disabled = false;
      btn.classList.remove('loading');
      if (err.name === 'NotAllowedError') {
        this._msg('Setup cancelled. Click the button to try again.', 'error');
      } else {
        this._msg(err.message || 'Setup failed. Please try again.', 'error');
      }
    }
  },

  _msg(text, type) {
    const el = document.getElementById('setupMsg');
    if (!el) return;
    el.textContent   = text;
    el.className     = `auth-message${type ? ' ' + type : ''}`;
    el.style.display = text ? 'block' : 'none';
  },

  _esc(s) {
    return String(s).replace(/[&<>"']/g, c =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
    );
  },
  _b64u(buf) {
    return btoa(String.fromCharCode(...buf))
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  },
  _fromb64u(s) {
    const p = s.length % 4;
    if (p) s += '==='.slice(0, 4 - p);
    return Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));
  },
};
