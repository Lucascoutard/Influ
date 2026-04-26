/* ===================================================
   APP/MODELS/USERMODEL.JS — User State + API
   =================================================== */

const UserModel = {

  _state: {
    isLoggedIn: false,
    role: 'guest',  // 'guest' | 'user' | 'client' | 'admin'
    user: null,
  },

  // Getters
  getRole()    { return this._state.role; },
  isLoggedIn() { return this._state.isLoggedIn; },
  getUser()    { return this._state.user; },

  getMenu() {
    return AppConfig.menus[this._state.role] || AppConfig.menus.guest;
  },

  // ---- API: Register ----
  async register(formData) {
    try {
      const res = await fetch('api/auth.php?action=register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success && data.user) this._setUser(data.user);
      return data;
    } catch (err) {
      return { success: false, message: 'Network error. Check your connection and try again.' };
    }
  },

  // ---- API: Login ----
  async login(email, password) {
    try {
      const res = await fetch('api/auth.php?action=login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success && data.user) this._setUser(data.user);
      return data;
    } catch (err) {
      return { success: false, message: 'Network error. Check your connection and try again.' };
    }
  },

  // ---- API: Logout ----
  async logout() {
    try {
      await fetch('api/auth.php?action=logout', { method: 'POST' });
    } catch (e) { /* silent */ }
    this._state.isLoggedIn = false;
    this._state.role = 'guest';
    this._state.user = null;
    this._notify();
  },

  // ---- API: Check session (called on boot) ----
  async checkSession() {
    try {
      const res = await fetch('api/auth.php?action=me');
      const data = await res.json();
      if (data.success && data.user) {
        this._setUser(data.user);
        return true;
      }
    } catch (e) {
      // API unavailable — offline mode
    }
    return false;
  },

  // ---- Internal ----
  _setUser(user) {
    this._state.isLoggedIn = true;
    this._state.role = user.role || 'user';
    this._state.user = user;
    this._notify();
  },

  _listeners: [],
  onChange(fn) { this._listeners.push(fn); },
  _notify()   { this._listeners.forEach(fn => fn(this._state)); },
};
