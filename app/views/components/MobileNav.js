/* ===================================================
   APP/VIEWS/COMPONENTS/MOBILENAV.JS — Mobile Nav Overlay
   =================================================== */

const MobileNav = {

  render() {
    const menu = UserModel.getMenu();
    const isLoggedIn = UserModel.isLoggedIn();

    const allLinks = [];
    menu.links.forEach(link => {
      if (link.dropdown) {
        link.dropdown.forEach(item => allLinks.push(item));
      } else {
        allLinks.push(link);
      }
    });

    return `
      <div class="mobile-nav" id="mobileNav">
        <button class="mobile-close" id="mobileClose" aria-label="Close menu">&times;</button>
        ${allLinks.map(l => `
          <a href="${l.href}" class="mobile-nav-link" onclick="NavigationController.closeMobile()">${l.label}</a>
        `).join('')}
        ${isLoggedIn
          ? `<a href="#logout" class="btn-connect" onclick="NavigationController.closeMobile()">Log out</a>`
          : (menu.cta ? `<a href="${menu.cta.href}" class="btn-connect" onclick="NavigationController.closeMobile()">${menu.cta.label}</a>` : '')
        }
      </div>
    `;
  }
};
