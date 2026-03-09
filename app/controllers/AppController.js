/* ===================================================
   APP/CONTROLLERS/APPCONTROLLER.JS — Main Controller
   =================================================== */

const AppController = {

  async init() {
    // Vérifie si l'utilisateur a une session PHP active
    await UserModel.checkSession();
    this.renderCurrentPage();

    // Re-render quand le state user change (login/logout)
    UserModel.onChange(() => this.renderCurrentPage());
  },

  renderCurrentPage() {
    const app = document.getElementById('app');
    const route = Router.getCurrentRoute();
    const isLoggedIn = UserModel.isLoggedIn();
    const role = UserModel.getRole();

    // Stop any active messaging session before re-rendering
    if (window.MessagesController) MessagesController.destroy();

    // Clear
    app.innerHTML = '';

    switch (route) {

      // ---- Auth ----
      case 'login':
        if (isLoggedIn) { Router.navigate('home'); return; }
        app.innerHTML = AuthPage.render('login');
        break;

      case 'register':
        if (isLoggedIn) { Router.navigate('home'); return; }
        app.innerHTML = AuthPage.render('register');
        break;

      case 'logout':
        UserModel.logout();
        Router.navigate('home');
        return;

      // ---- Contact ----
      case 'contact':
        app.innerHTML = ContactPage.render();
        break;

      // ---- Espace client ----
      case 'espace':
        if (!isLoggedIn) { Router.navigate('login'); return; }
        if (role !== 'client' && role !== 'admin') { Router.navigate('home'); return; }
        app.innerHTML = ClientDashboard.render();
        break;

      // ---- Dashboards (à implémenter) ----
      case 'dashboard':
        if (!isLoggedIn) { Router.navigate('login'); return; }
        app.innerHTML = HomePage.render(); // fallback
        break;

      case 'admin-dashboard':
        if (!isLoggedIn || role !== 'admin') { Router.navigate('login'); return; }
        app.innerHTML = AdminDashboard.render();
        break;

      // ---- Home ----
      case 'home':
      default:
        app.innerHTML = HomePage.render();
        break;
    }

    // Session chip — persiste entre les pages
    this._renderSessionChip();

    // Bind interactions après le render
    NavigationController.bind();

    // Scroll top à chaque changement de page
    window.scrollTo({ top: 0 });
  },

  // ---- Session chip flottant (bottom-right) ----
  _renderSessionChip() {
    const isLoggedIn = UserModel.isLoggedIn();
    const user = UserModel.getUser();
    const existing = document.getElementById('sessionChip');

    if (!isLoggedIn || !user) {
      if (existing) existing.remove();
      return;
    }

    // Déjà affiché — pas besoin de re-créer (évite replay animation)
    if (existing) return;

    const initial  = (user.firstname || 'U').charAt(0).toUpperCase();
    const prenom   = user.firstname || 'vous';

    const chip = document.createElement('div');
    chip.id        = 'sessionChip';
    chip.className = 'session-chip';
    chip.innerHTML = `
      <div class="sc-avatar">${initial}</div>
      <div class="sc-text">
        <div class="sc-greeting">Bonjour, ${prenom}</div>
        <div class="sc-status">Compte actif</div>
      </div>
      <a href="#logout" class="sc-logout" title="Se déconnecter">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
      </a>
    `;
    document.body.appendChild(chip);
  }
};
