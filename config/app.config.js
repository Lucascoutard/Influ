/* ===================================================
   CONFIG/APP.CONFIG.JS — Configuration centrale
   =================================================== */

const AppConfig = {

  name: 'Influmatch',
  tagline: 'Smart Collabs. Real Impact.',
  logoSrc: 'public/assets/images/logo.png',

  // Menus par rôle
  menus: {

    // --- Visiteur ---
    guest: {
      links: [
        { label: 'Accueil', href: '#home' },
        {
          label: 'Nos services',
          dropdown: [
            { label: 'Notre méthode', desc: 'Comment on travaille', href: '#solution' },
            { label: 'Pour les marques', desc: 'Gagner du temps', href: '#use-cases' },
            { label: 'Pour les créateurs', desc: 'Respect et protection', href: '#use-cases' },
          ]
        },
        {
          label: 'Pourquoi nous ?',
          dropdown: [
            { label: 'Le constat', desc: 'Le problème qu\'on résout', href: '#problem' },
            { label: 'Avant / Après', desc: 'Le changement concret', href: '#compare' },
            { label: 'Qui sommes-nous', desc: 'James & Lucas', href: '#about' },
          ]
        },
        { label: 'Contact', href: '#contact' },
      ],
      cta: { label: 'Se connecter', href: '#login' }
    },

    // --- User simple ---
    user: {
      links: [
        { label: 'Accueil', href: '#home' },
        { label: 'Mon profil', href: '#profile' },
        { label: 'Découvrir', href: '#discover' },
        { label: 'Contact', href: '#contact' },
      ],
      cta: { label: 'Mon compte', href: '#account' }
    },

    // --- Client ---
    client: {
      links: [
        { label: 'Dashboard', href: '#dashboard' },
        { label: 'Mes collaborations', href: '#collabs' },
        { label: 'Messages', href: '#messages' },
        { label: 'Documents', href: '#documents' },
      ],
      cta: { label: 'Mon compte', href: '#account' }
    },

    // --- Admin ---
    admin: {
      links: [
        { label: 'Dashboard', href: '#admin-dashboard' },
        { label: 'Utilisateurs', href: '#users' },
        { label: 'Collaborations', href: '#all-collabs' },
        { label: 'Messages', href: '#admin-messages' },
        { label: 'Paramètres', href: '#settings' },
      ],
      cta: { label: 'Admin', href: '#admin-account' }
    }
  }
};
