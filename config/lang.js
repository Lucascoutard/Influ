/* ===================================================
   CONFIG/LANG.JS — Gestionnaire de langue
   Détection navigateur + stockage localStorage
   Utilisable sur tout le site pour i18n future
   =================================================== */

const LangManager = {

  STORAGE_KEY: 'influmatch_lang',
  SUPPORTED:   ['fr', 'en'],
  _lang:       'fr',

  init() {
    const stored  = localStorage.getItem(this.STORAGE_KEY);
    if (stored && this.SUPPORTED.includes(stored)) {
      this._lang = stored;
      return;
    }
    // Détection navigateur
    const browser = (navigator.language || navigator.userLanguage || 'fr').toLowerCase();
    this._lang = browser.startsWith('fr') ? 'fr' : 'en';
    localStorage.setItem(this.STORAGE_KEY, this._lang);
  },

  get()       { return this._lang; },
  isFr()      { return this._lang === 'fr'; },
  isEn()      { return this._lang === 'en'; },

  set(lang) {
    if (!this.SUPPORTED.includes(lang)) return;
    this._lang = lang;
    localStorage.setItem(this.STORAGE_KEY, lang);
  },

  // Shorthand: t('Texte FR', 'English text')
  t(fr, en) { return this._lang === 'fr' ? fr : en; },
};
