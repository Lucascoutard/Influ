/* ===================================================
   CONFIG/APP.CONFIG.JS — Configuration centrale
   =================================================== */

const AppConfig = {

  name: 'Influmatch',
  tagline: 'Smart Collabs. Real Impact.',
  logoSrc: 'public/assets/images/logo.png',

  // Menus par rôle
  menus: {

    // --- Guest ---
    guest: {
      links: [
        { label: 'Home', href: '#home' },
        {
          label: 'Our services',
          dropdown: [
            { label: 'Our method', desc: 'How we work', href: '#solution' },
            { label: 'For brands', desc: 'Save time', href: '#use-cases' },
            { label: 'For creators', desc: 'Respect & protection', href: '#use-cases' },
          ]
        },
        {
          label: 'Why us?',
          dropdown: [
            { label: 'The problem', desc: 'What we solve', href: '#problem' },
            { label: 'Before / After', desc: 'The concrete change', href: '#compare' },
            { label: 'Who we are', desc: 'James & Lucas', href: '#about' },
          ]
        },
        { label: 'Contact', href: '#contact' },
      ],
      cta: { label: 'Log in', href: '#login' }
    },

    // --- Brand ---
    brand: {
      links: [
        { label: 'Dashboard', href: '#espace' },
        { label: 'My collaborations', href: '#collabs' },
        { label: 'Messages', href: '#messages' },
      ],
      cta: { label: 'My space', href: '#espace' }
    },

    // --- Influencer ---
    influencer: {
      links: [
        { label: 'Dashboard', href: '#espace' },
        { label: 'My collaborations', href: '#collabs' },
        { label: 'Messages', href: '#messages' },
      ],
      cta: { label: 'My space', href: '#espace' }
    },

    // --- Admin ---
    admin: {
      links: [
        { label: 'Dashboard', href: '#admin-dashboard' },
        { label: 'Users', href: '#users' },
        { label: 'Collaborations', href: '#all-collabs' },
        { label: 'Messages', href: '#admin-messages' },
        { label: 'Settings', href: '#settings' },
      ],
      cta: { label: 'Admin', href: '#admin-account' }
    }
  }
};
