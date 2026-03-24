/* ===================================================
   APP/VIEWS/COMPONENTS/COOKIEBANNER.JS
   Bandeau consentement cookies (RGPD + ePrivacy)
   =================================================== */

const CookieBanner = {

  STORAGE_KEY: 'influmatch_cookie_consent',

  init() {
    if (localStorage.getItem(this.STORAGE_KEY)) return; // déjà répondu
    this._render();
  },

  _render() {
    const existing = document.getElementById('cookieBanner');
    if (existing) return;

    const banner = document.createElement('div');
    banner.id        = 'cookieBanner';
    banner.className = 'cookie-banner';
    banner.innerHTML = `
      <div class="cookie-banner-inner">
        <div class="cookie-banner-text">
          <div class="cookie-banner-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"
                 stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            Cookies & Privacy
          </div>
          <p>
            Influmatch only uses session cookies (required for the service to work).
            Our booking tool <strong>Cal.com</strong> may set third-party cookies.
            <a href="#privacy">Learn more</a>
          </p>
        </div>
        <div class="cookie-banner-actions">
          <button class="cookie-btn cookie-btn--refuse" onclick="CookieBanner.refuse()">
            Decline optional
          </button>
          <button class="cookie-btn cookie-btn--accept" onclick="CookieBanner.accept()">
            Accept all
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(banner);

    // Slide in
    requestAnimationFrame(() => {
      requestAnimationFrame(() => banner.classList.add('cookie-banner--visible'));
    });
  },

  accept() {
    localStorage.setItem(this.STORAGE_KEY, 'accepted');
    this._dismiss();
  },

  refuse() {
    localStorage.setItem(this.STORAGE_KEY, 'refused');
    this._dismiss();
  },

  _dismiss() {
    const banner = document.getElementById('cookieBanner');
    if (!banner) return;
    banner.classList.remove('cookie-banner--visible');
    banner.classList.add('cookie-banner--hiding');
    setTimeout(() => banner.remove(), 400);
  },
};
