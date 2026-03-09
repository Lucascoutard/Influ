/* ===================================================
   APP/VIEWS/PAGES/AUTHPAGE.JS — Login & Register
   Même DA que le hero : dark card + form blanc
   =================================================== */

const AuthPage = {

  render(mode = 'login') {
    const isLogin = mode === 'login';

    return `
      ${Header.render()}
      ${MobileNav.render()}

      <section class="auth-section">
        <div class="auth-card">

          <!-- Panneau visuel gauche -->
          <div class="auth-visual">
            <div class="auth-visual-content">
              <h2 class="auth-visual-title">
                ${isLogin
                  ? 'Ravis de vous <em>retrouver</em>'
                  : 'Rejoignez l\'aventure <em>Influmatch</em>'
                }
              </h2>
              <p class="auth-visual-text">
                ${isLogin
                  ? 'Connectez-vous pour accéder à votre espace et gérer vos collaborations.'
                  : 'Créez votre compte et commencez à collaborer avec les meilleurs créateurs et marques.'
                }
              </p>
              <div class="auth-visual-deco"></div>
            </div>
          </div>

          <!-- Formulaire droite -->
          <div class="auth-form-side">

            <div class="auth-tabs">
              <button class="auth-tab ${isLogin ? 'active' : ''}" onclick="Router.navigate('login')">Connexion</button>
              <button class="auth-tab ${!isLogin ? 'active' : ''}" onclick="Router.navigate('register')">Créer un compte</button>
            </div>

            <div class="auth-message" id="authMessage"></div>

            ${isLogin ? this._renderLoginForm() : this._renderRegisterForm()}

          </div>
        </div>
      </section>
    `;
  },

  _renderLoginForm() {
    return `
      <form class="auth-form" id="loginForm" onsubmit="AuthPage.handleLogin(event)">
        <div class="form-group">
          <label for="loginEmail">Email</label>
          <input type="email" id="loginEmail" required placeholder="votre@email.com" autocomplete="email">
        </div>
        <div class="form-group">
          <label for="loginPassword">Mot de passe</label>
          <div class="password-wrapper">
            <input type="password" id="loginPassword" required placeholder="••••••••" autocomplete="current-password" minlength="8">
            <button type="button" class="password-toggle" onclick="AuthPage.togglePwd('loginPassword')" aria-label="Voir">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            </button>
          </div>
        </div>
        <button type="submit" class="btn-auth" id="loginBtn">
          <span class="btn-auth-text">Se connecter</span>
          <span class="btn-auth-loader"></span>
        </button>
        <p class="auth-switch">Pas encore de compte ? <a href="#register">Créer un compte</a></p>
      </form>
    `;
  },

  _renderRegisterForm() {
    return `
      <form class="auth-form" id="registerForm" onsubmit="AuthPage.handleRegister(event)">
        <div class="form-row">
          <div class="form-group">
            <label for="regFirstname">Prénom</label>
            <input type="text" id="regFirstname" required placeholder="Jean">
          </div>
          <div class="form-group">
            <label for="regLastname">Nom</label>
            <input type="text" id="regLastname" required placeholder="Dupont">
          </div>
        </div>
        <div class="form-group">
          <label for="regEmail">Email</label>
          <input type="email" id="regEmail" required placeholder="votre@email.com" autocomplete="email">
        </div>
        <div class="form-group">
          <label for="regPhone">Téléphone <span class="optional">(optionnel)</span></label>
          <input type="tel" id="regPhone" placeholder="+33 6 12 34 56 78">
        </div>
        <div class="form-group">
          <label for="regCompany">Entreprise <span class="optional">(optionnel)</span></label>
          <input type="text" id="regCompany" placeholder="Ma Marque SAS">
        </div>
        <div class="form-group">
          <label for="regPassword">Mot de passe</label>
          <div class="password-wrapper">
            <input type="password" id="regPassword" required placeholder="Min. 8 caractères" autocomplete="new-password" minlength="8">
            <button type="button" class="password-toggle" onclick="AuthPage.togglePwd('regPassword')" aria-label="Voir">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            </button>
          </div>
        </div>
        <div class="form-group">
          <label for="regPasswordConfirm">Confirmer le mot de passe</label>
          <div class="password-wrapper">
            <input type="password" id="regPasswordConfirm" required placeholder="••••••••" autocomplete="new-password" minlength="8">
            <button type="button" class="password-toggle" onclick="AuthPage.togglePwd('regPasswordConfirm')" aria-label="Voir">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            </button>
          </div>
        </div>
        <button type="submit" class="btn-auth" id="registerBtn">
          <span class="btn-auth-text">Créer mon compte</span>
          <span class="btn-auth-loader"></span>
        </button>
        <p class="auth-switch">Déjà un compte ? <a href="#login">Se connecter</a></p>
      </form>
    `;
  },

  // ---- Handlers ----

  async handleLogin(e) {
    e.preventDefault();
    const btn = document.getElementById('loginBtn');
    this._setLoading(btn, true);
    this._clearMsg();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const result = await UserModel.login(email, password);

    this._setLoading(btn, false);

    if (result.success) {
      this._showMsg('Connexion réussie ! Redirection...', 'success');
      setTimeout(() => Router.navigate('home'), 600);
    } else {
      this._showMsg(result.message, 'error');
    }
  },

  async handleRegister(e) {
    e.preventDefault();
    const btn = document.getElementById('registerBtn');
    this._setLoading(btn, true);
    this._clearMsg();

    const pw = document.getElementById('regPassword').value;
    const pwConfirm = document.getElementById('regPasswordConfirm').value;

    if (pw !== pwConfirm) {
      this._showMsg('Les mots de passe ne correspondent pas.', 'error');
      this._setLoading(btn, false);
      return;
    }

    const result = await UserModel.register({
      firstname: document.getElementById('regFirstname').value,
      lastname:  document.getElementById('regLastname').value,
      email:     document.getElementById('regEmail').value,
      phone:     document.getElementById('regPhone').value,
      company:   document.getElementById('regCompany').value,
      password:  pw,
    });

    this._setLoading(btn, false);

    if (result.success) {
      this._showMsg('Compte créé ! Redirection...', 'success');
      setTimeout(() => Router.navigate('home'), 600);
    } else {
      this._showMsg(result.message, 'error');
    }
  },

  // ---- Helpers ----

  togglePwd(id) {
    const input = document.getElementById(id);
    input.type = input.type === 'password' ? 'text' : 'password';
  },

  _showMsg(text, type) {
    const el = document.getElementById('authMessage');
    if (el) { el.textContent = text; el.className = 'auth-message ' + type; }
  },

  _clearMsg() {
    const el = document.getElementById('authMessage');
    if (el) { el.textContent = ''; el.className = 'auth-message'; }
  },

  _setLoading(btn, on) {
    if (!btn) return;
    btn.disabled = on;
    btn.classList.toggle('loading', on);
  }
};
