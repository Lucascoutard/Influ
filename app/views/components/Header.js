/* ===================================================
   APP/VIEWS/COMPONENTS/HEADER.JS — Header Component
   =================================================== */

const Header = {

  render() {
    const menu = AppConfig.menus.guest; // Toujours le menu visiteur
    const logoSrc = AppConfig.logoSrc;
    const isLoggedIn = UserModel.isLoggedIn();
    const user = UserModel.getUser();
    const role = UserModel.getRole();
    const initial = user ? (user.firstname || 'U').charAt(0).toUpperCase() : '';
    const showEspace  = isLoggedIn && (role === 'client' || role === 'admin');
    const espaceHref  = role === 'admin' ? '#admin-dashboard' : '#espace';
    const espaceLabel = role === 'admin' ? 'Administration' : 'Mon espace';

    return `
      <div class="scroll-progress" id="scrollProgress"></div>

      <header class="header" id="header">
        <nav class="nav">

          <a href="#home" class="logo">
            <img src="${logoSrc}" alt="${AppConfig.name}" class="logo-img">
          </a>

          <div class="nav-links" id="navLinks">
            ${menu.links.map(link => this._renderLink(link)).join('')}
            ${showEspace ? `<a href="${espaceHref}" class="nav-link nav-link--espace">${espaceLabel}</a>` : ''}
          </div>

          <!-- Avatar discret si connecté, sinon CTA -->
          ${isLoggedIn && user
            ? `<div class="nav-user-avatar desktop" title="${user.firstname} ${user.lastname}">${initial}</div>`
            : `<a href="${menu.cta.href}" class="btn-connect desktop">${menu.cta.label}</a>`
          }

          <button class="menu-toggle" id="menuToggle" aria-label="Ouvrir le menu">
            <span></span><span></span><span></span>
          </button>

        </nav>
      </header>
    `;
  },

  _renderLink(link) {
    if (link.dropdown) {
      return `
        <div class="dropdown-wrapper">
          <a href="#" class="nav-link has-dropdown" onclick="event.preventDefault()">
            ${link.label}
            <svg class="chevron" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"/>
            </svg>
          </a>
          <div class="dropdown">
            ${link.dropdown.map(item => `
              <a href="${item.href}" class="dropdown-item">
                ${item.label}
                ${item.desc ? `<span>${item.desc}</span>` : ''}
              </a>
            `).join('')}
          </div>
        </div>
      `;
    }
    return `<a href="${link.href}" class="nav-link">${link.label}</a>`;
  }
};
