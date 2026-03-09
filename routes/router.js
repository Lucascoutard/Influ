/* ===================================================
   ROUTES/ROUTER.JS — Simple Hash Router (FIXED)
   =================================================== */

const Router = {

  // Routes = pages (changent la vue entière)
  // Sections = ancres dans une page (scroll smooth)
  _pageRoutes: ['home', 'login', 'register', 'contact', 'logout', 'espace', 'dashboard', 'admin-dashboard', 'profile', 'account', 'settings', 'users', 'collabs', 'messages', 'documents', 'all-collabs', 'admin-messages', 'discover', 'admin-account'],

  getCurrentRoute() {
    const hash = window.location.hash.replace('#', '').replace('/', '');
    return hash || 'home';
  },

  navigate(route) {
    window.location.hash = route;
  },

  // Vérifie si un hash est une route (page) ou une section (ancre)
  isPageRoute(hash) {
    const clean = hash.replace('#', '').replace('/', '');
    return this._pageRoutes.includes(clean);
  },

  init() {
    window.addEventListener('hashchange', () => {
      const route = this.getCurrentRoute();
      // Ne re-render que si c'est une route de page
      if (this.isPageRoute(route)) {
        AppController.renderCurrentPage();
      }
    });
  }
};
