/* ===================================================
   APP/VIEWS/PAGES/ADMINDASHBOARD.JS
   Espace admin : sidebar fixe + contenu dynamique
   Pages : overview · discussions · collaborations ·
           contrats · stats · users · agent · compte
   =================================================== */

const AdminDashboard = {

  _page: 'overview',

  render(page = null) {
    if (page) {
      this._page = page;
    } else {
      this._page = localStorage.getItem('adminPage') || 'overview';
    }
    const user    = UserModel.getUser();
    const name    = user ? `${user.firstname} ${user.lastname}` : '';
    const initial = user ? (user.firstname || 'U').charAt(0).toUpperCase() : '';

    return `
      ${this._renderDashHeader(initial, user)}
      ${MobileNav.render()}

      <div class="dash-sidebar-overlay" id="dashSidebarOverlay"
           onclick="AdminDashboard._toggleSidebar()"></div>

      <div class="dashboard-layout">

        <!-- ====== SIDEBAR ====== -->
        <aside class="dash-sidebar">

          <div class="dash-user-card">
            <div class="dash-user-initial">${initial}</div>
            <div class="dash-user-details">
              <div class="dash-user-name">${name}</div>
              <span class="dash-user-badge dash-user-badge--admin">Admin</span>
            </div>
          </div>

          <nav class="dash-nav">
            <div class="dash-nav-section-label">Espace admin</div>

            ${this._item('overview', 'Vue d\'ensemble',
              `<path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>`
            )}
            ${this._item('discussions', 'Discussions',
              `<path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>`
            )}
            ${this._item('collaborations', 'Collaborations',
              `<path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>`
            )}
            ${this._item('contrats', 'Contrats',
              `<path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/>`
            )}
            ${this._item('stats', 'Statistiques',
              `<path d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"/>`
            )}

            ${this._item('calendrier', 'Calendrier',
              `<path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>`
            )}

            <div class="dash-nav-section-label">Outils</div>

            ${this._item('users', 'Gestion utilisateurs',
              `<path d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"/>`
            )}
            ${this._item('agent', 'Agent marketing',
              `<path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/>`
            )}

            <div class="dash-nav-section-label">Paramètres</div>

            ${this._item('compte', 'Mon compte',
              `<path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>`
            )}

            <div class="dash-nav-footer">
              <a href="#home" class="dash-back-link">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"
                     stroke-linecap="round" stroke-linejoin="round">
                  <path d="M19 12H5M12 5l-7 7 7 7"/>
                </svg>
                Retour au site
              </a>
            </div>

          </nav>
        </aside>

        <!-- ====== CONTENT ====== -->
        <main class="dash-content" id="dashContent">
          ${this._page_render(this._page)}
        </main>

      </div>
    `;
  },

  // ---- Dashboard minimal header ----
  _renderDashHeader(initial, user) {
    const logoSrc = AppConfig.logoSrc;
    const name    = user ? `${user.firstname} ${user.lastname}` : '';

    return `
      <div class="scroll-progress" id="scrollProgress"></div>
      <header class="header dash-header" id="header">
        <nav class="nav">
          <a href="#home" class="logo">
            <img src="${logoSrc}" alt="${AppConfig.name}" class="logo-img">
          </a>
          <div class="dash-hdr-right">
            <button class="dash-hdr-hamburger" onclick="AdminDashboard._toggleSidebar()" aria-label="Menu">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                   stroke-linecap="round" stroke-linejoin="round">
                <line x1="3" y1="6"  x2="21" y2="6"/>
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
            <div class="dash-hdr-avatar" title="${name}">${initial}</div>
          </div>
        </nav>
      </header>
    `;
  },

  // ---- Sidebar item helper ----
  _item(page, label, svgPath, isNew = false) {
    const active = this._page === page;
    return `
      <div class="dash-nav-item ${active ? 'active' : ''}"
           data-page="${page}"
           onclick="AdminDashboard.switchPage('${page}')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"
             stroke-linecap="round" stroke-linejoin="round">
          ${svgPath}
        </svg>
        ${label}
        ${isNew ? `<span class="dash-nav-badge">Bientôt</span>` : ''}
      </div>
    `;
  },

  // ---- Switch page ----
  switchPage(page) {
    if (this._page === 'discussions') MessagesController.destroy();

    this._page = page;
    localStorage.setItem('adminPage', page);

    const el = document.getElementById('dashContent');
    if (el) {
      el.classList.remove('dash-content--in');
      void el.offsetWidth;
      el.innerHTML = this._page_render(page);
      el.classList.add('dash-content--in');
    }

    document.querySelectorAll('.dash-nav-item').forEach(item => {
      item.classList.toggle('active', item.dataset.page === page);
    });

    // Fermer la sidebar mobile après navigation
    const sidebar = document.querySelector('.dash-sidebar');
    const overlay = document.getElementById('dashSidebarOverlay');
    if (sidebar) sidebar.classList.remove('dash-sidebar--open');
    if (overlay) overlay.classList.remove('active');
  },

  _toggleSidebar() {
    const sidebar = document.querySelector('.dash-sidebar');
    const overlay = document.getElementById('dashSidebarOverlay');
    if (!sidebar) return;
    const open = sidebar.classList.toggle('dash-sidebar--open');
    if (overlay) overlay.classList.toggle('active', open);
  },

  // ---- Page router ----
  _page_render(page) {
    switch (page) {
      case 'overview':       return this._overview();
      case 'discussions':    return this._discussions();
      case 'collaborations': return this._collaborations();
      case 'contrats':       return this._contrats();
      case 'stats':          return this._stats();
      case 'calendrier':     return this._calendrier();
      case 'users':          return this._users();
      case 'agent':          return this._agent();
      case 'compte':         return this._compte();
      default:               return this._overview();
    }
  },

  // ================================================================
  //  PAGES
  // ================================================================

  // ---- Vue d'ensemble ----
  _overview() {
    setTimeout(() => AdminDashboard._loadOverview(), 0);
    return `
      <div class="dash-page-header">
        <h1 class="dash-page-title">Vue d'ensemble</h1>
        <p class="dash-page-desc">Les indicateurs clés de votre activité en un coup d'œil.</p>
      </div>

      <div class="dash-stats-grid" id="overviewStats">
        ${[1,2,3,4].map(() => `
          <div class="dash-stat-card dash-stat-card--loading">
            <div class="dash-stat-num dash-skeleton"></div>
            <div class="dash-stat-label dash-skeleton" style="width:60%;height:12px"></div>
          </div>
        `).join('')}
      </div>

      <div class="dash-overview-row">
        <div class="dash-overview-panel" id="overviewRecent">
          <div class="dash-panel-title">Derniers inscrits</div>
          <div class="dash-panel-loading">Chargement…</div>
        </div>
        <div class="dash-overview-panel" id="overviewActivity">
          <div class="dash-panel-title">Dernières collaborations</div>
          <div class="dash-panel-loading">Chargement…</div>
        </div>
      </div>
    `;
  },

  async _loadOverview() {
    try {
      const res  = await fetch('api/stats.php');
      const data = await res.json();
      if (!data.success) return;
      const s = data.stats;

      // ── Stat cards ──────────────────────────────────
      const statsEl = document.getElementById('overviewStats');
      if (statsEl) {
        statsEl.innerHTML = [
          { val: s.users_active,    label: 'Utilisateurs actifs',    color: '#22c55e',        sub: `+${s.new_this_week} cette semaine` },
          { val: s.clients,         label: 'Clients actifs',         color: 'var(--primary)', sub: `${s.admins} admin${s.admins > 1 ? 's' : ''}` },
          { val: s.collabs_total,   label: 'Collaborations totales', color: '#f59e0b',        sub: `${s.collabs_active} active${s.collabs_active > 1 ? 's' : ''}` },
          { val: s.messages_unread, label: 'Messages non lus',       color: '#ef4444',        sub: null },
        ].map(c => `
          <div class="dash-stat-card">
            <div class="dash-stat-num" style="color:${c.color}">${c.val}</div>
            <div class="dash-stat-label">${c.label}</div>
            ${c.sub ? `<div class="dash-stat-sub">${c.sub}</div>` : ''}
          </div>
        `).join('');
      }

      // ── Derniers inscrits ────────────────────────────
      const recentEl = document.getElementById('overviewRecent');
      if (recentEl) {
        const users = data.recent_users || [];
        recentEl.innerHTML = `<div class="dash-panel-title">Derniers inscrits</div>` + (
          users.length === 0
            ? '<div class="dash-panel-empty">Aucun inscrit</div>'
            : users.map(u => {
                const name    = `${u.firstname || ''} ${u.lastname || ''}`.trim() || u.email;
                const initial = (u.firstname || u.email || '?').charAt(0).toUpperCase();
                const date    = new Date(u.created_at).toLocaleDateString('fr-FR', { day:'numeric', month:'short' });
                return `
                  <div class="dash-recent-row">
                    <div class="dash-recent-avatar">${initial}</div>
                    <div class="dash-recent-info">
                      <div class="dash-recent-name">${this._escU(name)}</div>
                      <div class="dash-recent-meta">${this._escU(u.email)}</div>
                    </div>
                    <div class="dash-recent-right">
                      <span class="dash-role-select dash-role-select--${u.role}" style="cursor:default;pointer-events:none">
                        ${u.role === 'admin' ? 'Admin' : u.role === 'client' ? 'Client' : 'User'}
                      </span>
                      <span class="dash-recent-date">${date}</span>
                    </div>
                  </div>
                `;
              }).join('')
        );
      }

      // ── Dernières collaborations ──────────────────────
      const actEl = document.getElementById('overviewActivity');
      if (actEl) {
        const collabs = data.recent_collabs || [];
        const statusCfg = {
          pending:   { label: 'En attente', cls: 'collab-s--pending'   },
          active:    { label: 'Active',     cls: 'collab-s--active'    },
          completed: { label: 'Terminée',   cls: 'collab-s--completed' },
          cancelled: { label: 'Annulée',    cls: 'collab-s--cancelled' },
        };
        actEl.innerHTML = `<div class="dash-panel-title">Dernières collaborations</div>` + (
          collabs.length === 0
            ? '<div class="dash-panel-empty">Aucune collaboration</div>'
            : collabs.map(c => {
                const brand  = `${c.brand_firstname || ''} ${c.brand_lastname || ''}`.trim() || '';
                const brandLabel = c.brand_company ? `${brand} — ${c.brand_company}` : brand;
                const inf    = `${c.inf_firstname || ''} ${c.inf_lastname || ''}`.trim();
                const sc     = statusCfg[c.status] || statusCfg.pending;
                const date   = new Date(c.created_at).toLocaleDateString('fr-FR', { day:'numeric', month:'short' });
                return `
                  <div class="dash-recent-row" style="cursor:pointer"
                       onclick="AdminDashboard.switchPage('collaborations')">
                    <div class="dash-recent-avatar" style="background:var(--primary-light);color:var(--primary);font-size:.8rem">
                      ${(c.title || '?').charAt(0).toUpperCase()}
                    </div>
                    <div class="dash-recent-info">
                      <div class="dash-recent-name">${AdminDashboard._escU(c.title)}</div>
                      <div class="dash-recent-meta">${AdminDashboard._escU(brandLabel)} → ${AdminDashboard._escU(inf)}</div>
                    </div>
                    <div class="dash-recent-right">
                      <span class="collab-status ${sc.cls}" style="cursor:default">${sc.label}</span>
                      <span class="dash-recent-date">${date}</span>
                    </div>
                  </div>
                `;
              }).join('')
        );
      }
    } catch (_) {}
  },

  _statCard(value, label, color) {
    return `
      <div class="dash-stat-card">
        <div class="dash-stat-num" style="color:${color}">${value}</div>
        <div class="dash-stat-label">${label}</div>
      </div>
    `;
  },

  // ---- Discussions ----
  _discussions() {
    setTimeout(() => MessagesController.init(true), 0);
    return MessagesController.renderDiscussions(true);
  },

  // ---- Collaborations ----
  _collaborations() {
    setTimeout(() => AdminDashboard._loadCollabs(), 0);
    return `
      <div class="dash-page-header">
        <h1 class="dash-page-title">Collaborations</h1>
        <p class="dash-page-desc">Gérez toutes les mises en relation entre marques et influenceurs.</p>
      </div>

      <div class="dash-users-toolbar">
        <div id="collabFilters" class="dash-filter-pills" style="margin-bottom:0;flex:1"></div>
        <button class="dash-create-btn" onclick="AdminDashboard._openCreateCollab()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"
               stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Nouvelle collaboration
        </button>
      </div>

      <div id="collabTableWrap" style="margin-top:16px">
        <div class="dash-users-loading">Chargement…</div>
      </div>
    `;
  },

  _collabsCache:  [],
  _collabsFilter: 'all',

  async _loadCollabs() {
    try {
      const res  = await fetch('api/collaborations.php?action=list');
      const data = await res.json();
      this._collabsCache  = data.collaborations || [];
      this._collabsFilter = 'all';
      this._renderCollabs();
    } catch (_) {
      const el = document.getElementById('collabTableWrap');
      if (el) el.innerHTML = '<div class="dash-empty"><div class="dash-empty-title">Erreur de chargement</div></div>';
    }
  },

  _setCollabFilter(filter) {
    this._collabsFilter = filter;
    this._renderCollabs();
  },

  _renderCollabs() {
    // ── Filter pills ─────────────────────────────────
    const pillEl = document.getElementById('collabFilters');
    if (pillEl) {
      const all = this._collabsCache;
      const c   = {
        all:       all.length,
        pending:   all.filter(x => x.status === 'pending').length,
        active:    all.filter(x => x.status === 'active').length,
        completed: all.filter(x => x.status === 'completed').length,
        cancelled: all.filter(x => x.status === 'cancelled').length,
      };
      const pills = [
        { key:'all',       label:'Toutes'    },
        { key:'pending',   label:'En attente'},
        { key:'active',    label:'Actives'   },
        { key:'completed', label:'Terminées' },
        { key:'cancelled', label:'Annulées'  },
      ];
      pillEl.innerHTML = pills.map(p => `
        <button class="dash-filter-pill ${this._collabsFilter === p.key ? 'active' : ''}"
                onclick="AdminDashboard._setCollabFilter('${p.key}')">
          ${p.label} <span class="dash-filter-count">${c[p.key]}</span>
        </button>
      `).join('');
    }

    // ── Table ────────────────────────────────────────
    const wrap = document.getElementById('collabTableWrap');
    if (!wrap) return;

    let list = this._collabsCache;
    if (this._collabsFilter !== 'all') list = list.filter(x => x.status === this._collabsFilter);

    if (list.length === 0) {
      wrap.innerHTML = `
        <div class="dash-empty" style="padding-top:48px">
          <div class="dash-empty-title">Aucune collaboration</div>
          <p class="dash-empty-text">Créez votre première collaboration en cliquant sur le bouton.</p>
        </div>`;
      return;
    }

    const statusCfg = {
      pending:   { label:'En attente', cls:'collab-s--pending'   },
      active:    { label:'Active',     cls:'collab-s--active'    },
      completed: { label:'Terminée',   cls:'collab-s--completed' },
      cancelled: { label:'Annulée',    cls:'collab-s--cancelled' },
    };

    const rows = list.map(c => {
      const s       = statusCfg[c.status] || statusCfg.pending;
      const brand   = `${c.brand_firstname || ''} ${c.brand_lastname || ''}`.trim();
      const inf     = `${c.inf_firstname || ''} ${c.inf_lastname || ''}`.trim();
      const budget  = c.budget ? `${parseFloat(c.budget).toLocaleString('fr-FR')} €` : '—';
      const dates   = c.start_date
        ? `${new Date(c.start_date).toLocaleDateString('fr-FR', {day:'numeric',month:'short'})}${c.end_date ? ' → ' + new Date(c.end_date).toLocaleDateString('fr-FR', {day:'numeric',month:'short'}) : ''}`
        : '—';
      return `
        <tr class="dash-tr-clickable" onclick="AdminDashboard._openCollabDetail(${c.id})">
          <td><div class="dash-urow-name" style="font-size:.9rem">${this._escU(c.title)}</div></td>
          <td>
            <div class="dash-urow-name" style="font-size:.85rem">${this._escU(brand || c.brand_email)}</div>
            ${c.brand_company ? `<div class="dash-urow-email">${this._escU(c.brand_company)}</div>` : ''}
          </td>
          <td>
            <div class="dash-urow-name" style="font-size:.85rem">${this._escU(inf || c.inf_email)}</div>
            <div class="dash-urow-email">${this._escU(c.inf_email)}</div>
          </td>
          <td><span class="collab-status ${s.cls}">${s.label}</span></td>
          <td class="dash-tcell-muted">${budget}</td>
          <td class="dash-tcell-muted">${dates}</td>
        </tr>
      `;
    }).join('');

    wrap.innerHTML = `
      <div class="dash-table-wrap">
        <table class="dash-table">
          <thead>
            <tr>
              <th>Titre</th>
              <th>Marque / Client</th>
              <th>Influenceur</th>
              <th>Statut</th>
              <th>Budget</th>
              <th>Période</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    `;
  },

  // ---- Modale détail / édition collab ----
  _openCollabDetail(collabId) {
    const c = this._collabsCache.find(x => parseInt(x.id) === collabId);
    if (!c) return;

    const statusCfg = {
      pending:   'En attente',
      active:    'Active',
      completed: 'Terminée',
      cancelled: 'Annulée',
    };
    const statusOpts = Object.entries(statusCfg).map(([k,v]) =>
      `<option value="${k}" ${c.status === k ? 'selected' : ''}>${v}</option>`
    ).join('');

    const brand = `${c.brand_firstname || ''} ${c.brand_lastname || ''}`.trim() || c.brand_email;
    const inf   = `${c.inf_firstname   || ''} ${c.inf_lastname   || ''}`.trim() || c.inf_email;

    const overlay = document.createElement('div');
    overlay.className = 'dash-modal-overlay';
    overlay.id        = 'collabDetailOverlay';
    overlay.innerHTML = `
      <div class="dash-modal" style="max-width:580px">
        <div class="dash-modal-header dash-modal-header--simple">
          <h3 class="dash-modal-title">${this._escU(c.title)}</h3>
          <button class="dash-modal-close" onclick="document.getElementById('collabDetailOverlay').remove()">✕</button>
        </div>
        <div class="dash-modal-body">
          <div class="dash-modal-grid">
            <div class="dash-modal-field dash-modal-field--full">
              <span class="dash-modal-label">Titre</span>
              <input class="dash-modal-input" id="cdTitle" value="${this._escU(c.title)}">
            </div>
            <div class="dash-modal-field">
              <span class="dash-modal-label">Marque / Client</span>
              <div class="dash-modal-val">${this._escU(brand)}</div>
            </div>
            <div class="dash-modal-field">
              <span class="dash-modal-label">Influenceur</span>
              <div class="dash-modal-val">${this._escU(inf)}</div>
            </div>
            <div class="dash-modal-field">
              <span class="dash-modal-label">Statut</span>
              <select class="dash-modal-input" id="cdStatus">${statusOpts}</select>
            </div>
            <div class="dash-modal-field">
              <span class="dash-modal-label">Budget (€)</span>
              <input class="dash-modal-input" id="cdBudget" type="number" min="0" step="0.01"
                     value="${c.budget || ''}">
            </div>
            <div class="dash-modal-field">
              <span class="dash-modal-label">Date de début</span>
              <input class="dash-modal-input" id="cdStart" type="date" value="${c.start_date || ''}">
            </div>
            <div class="dash-modal-field">
              <span class="dash-modal-label">Date de fin</span>
              <input class="dash-modal-input" id="cdEnd" type="date" value="${c.end_date || ''}">
            </div>
            <div class="dash-modal-field dash-modal-field--full">
              <span class="dash-modal-label">Description</span>
              <textarea class="dash-modal-input" id="cdDesc" rows="3"
                        style="resize:vertical">${this._escU(c.description || '')}</textarea>
            </div>
          </div>
          <div id="cdError" class="dash-modal-error" style="display:none"></div>
        </div>
        <div class="dash-modal-footer">
          <button class="dash-mfooter-delete" onclick="AdminDashboard._deleteCollab(${c.id})">Supprimer</button>
          <button class="dash-mfooter-board"
                  onclick="document.getElementById('collabDetailOverlay').remove(); AdminDashboard._openBoardFromCollab(${c.id})">
            📋 Suivi campagne
          </button>
          <button class="dash-mfooter-close"  onclick="document.getElementById('collabDetailOverlay').remove()">Annuler</button>
          <button class="dash-mfooter-submit" id="cdSaveBtn" onclick="AdminDashboard._saveCollab(${c.id}, this)">Enregistrer</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
  },

  _openBoardFromCollab(collabId) {
    const c = this._collabsCache.find(x => parseInt(x.id) === collabId);
    if (!c) return;
    TaskBoardController.open(collabId, c);
  },

  async _saveCollab(collabId, btn) {
    const get   = id => document.getElementById(id)?.value?.trim() || '';
    const errEl = document.getElementById('cdError');
    errEl.style.display = 'none';

    btn.disabled    = true;
    btn.textContent = 'Enregistrement…';
    try {
      const res  = await fetch('api/collaborations.php?action=update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id:          collabId,
          title:       get('cdTitle'),
          status:      get('cdStatus'),
          budget:      get('cdBudget'),
          start_date:  get('cdStart'),
          end_date:    get('cdEnd'),
          description: get('cdDesc'),
        })
      });
      const data = await res.json();
      if (!data.success) {
        errEl.textContent   = data.message;
        errEl.style.display = 'block';
        btn.disabled = false; btn.textContent = 'Enregistrer';
        return;
      }
      // Update cache
      const idx = this._collabsCache.findIndex(x => parseInt(x.id) === collabId);
      if (idx !== -1) {
        this._collabsCache[idx] = {
          ...this._collabsCache[idx],
          title:       get('cdTitle'),
          status:      get('cdStatus'),
          budget:      get('cdBudget') || null,
          start_date:  get('cdStart')  || null,
          end_date:    get('cdEnd')    || null,
          description: get('cdDesc'),
        };
      }
      document.getElementById('collabDetailOverlay')?.remove();
      this._renderCollabs();
    } catch (_) {
      errEl.textContent   = 'Erreur réseau.';
      errEl.style.display = 'block';
      btn.disabled = false; btn.textContent = 'Enregistrer';
    }
  },

  async _deleteCollab(collabId) {
    const c    = this._collabsCache.find(x => parseInt(x.id) === collabId);
    const name = c?.title || `#${collabId}`;
    if (!confirm(`Supprimer la collaboration "${name}" ?\nCette action est irréversible.`)) return;

    document.getElementById('collabDetailOverlay')?.remove();
    try {
      const res  = await fetch('api/collaborations.php?action=delete', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: collabId })
      });
      const data = await res.json();
      if (data.success) {
        this._collabsCache = this._collabsCache.filter(x => parseInt(x.id) !== collabId);
        this._renderCollabs();
      } else {
        alert(data.message || 'Erreur.');
      }
    } catch (_) { alert('Erreur réseau.'); }
  },

  // ---- Modale créer collab ----
  async _openCreateCollab() {
    // Charger les users pour les selects
    let users = [];
    try {
      const res  = await fetch('api/users.php?action=list');
      const data = await res.json();
      users = data.users || [];
    } catch (_) {}

    const clients     = users.filter(u => u.role === 'client'  && parseInt(u.is_active) === 1);
    const influencers = users.filter(u => u.role !== 'admin'   && parseInt(u.is_active) === 1);

    const _opt = (arr) => arr.map(u => {
      const name = `${u.firstname || ''} ${u.lastname || ''}`.trim() || u.email;
      return `<option value="${u.id}">${this._escU(name)}${u.company ? ' — ' + this._escU(u.company) : ''}</option>`;
    }).join('');

    const overlay = document.createElement('div');
    overlay.className = 'dash-modal-overlay';
    overlay.id        = 'createCollabOverlay';
    overlay.innerHTML = `
      <div class="dash-modal" style="max-width:580px">
        <div class="dash-modal-header dash-modal-header--simple">
          <h3 class="dash-modal-title">Nouvelle collaboration</h3>
          <button class="dash-modal-close" onclick="document.getElementById('createCollabOverlay').remove()">✕</button>
        </div>
        <div class="dash-modal-body">
          <div class="dash-modal-grid">
            <div class="dash-modal-field dash-modal-field--full">
              <span class="dash-modal-label">Titre *</span>
              <input class="dash-modal-input" id="ccTitle" placeholder="Ex : Campagne été 2025">
            </div>
            <div class="dash-modal-field">
              <span class="dash-modal-label">Marque / Client *</span>
              <select class="dash-modal-input" id="ccBrand">
                <option value="">Sélectionner…</option>
                ${_opt(clients.length ? clients : users.filter(u => parseInt(u.is_active) === 1))}
              </select>
            </div>
            <div class="dash-modal-field">
              <span class="dash-modal-label">Influenceur *</span>
              <select class="dash-modal-input" id="ccInfluencer">
                <option value="">Sélectionner…</option>
                ${_opt(influencers)}
              </select>
            </div>
            <div class="dash-modal-field">
              <span class="dash-modal-label">Budget (€)</span>
              <input class="dash-modal-input" id="ccBudget" type="number" min="0" step="0.01" placeholder="0.00">
            </div>
            <div class="dash-modal-field">
              <span class="dash-modal-label">Date de début</span>
              <input class="dash-modal-input" id="ccStart" type="date">
            </div>
            <div class="dash-modal-field">
              <span class="dash-modal-label">Date de fin</span>
              <input class="dash-modal-input" id="ccEnd" type="date">
            </div>
            <div class="dash-modal-field dash-modal-field--full">
              <span class="dash-modal-label">Description</span>
              <textarea class="dash-modal-input" id="ccDesc" rows="3" style="resize:vertical"
                        placeholder="Brief, objectifs, livrables…"></textarea>
            </div>
          </div>
          <div id="ccError" class="dash-modal-error" style="display:none"></div>
        </div>
        <div class="dash-modal-footer">
          <button class="dash-mfooter-close" onclick="document.getElementById('createCollabOverlay').remove()">Annuler</button>
          <button class="dash-mfooter-submit" onclick="AdminDashboard._submitCreateCollab(this)">Créer</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
    document.getElementById('ccTitle')?.focus();
  },

  async _submitCreateCollab(btn) {
    const get   = id => document.getElementById(id)?.value?.trim() || '';
    const errEl = document.getElementById('ccError');
    errEl.style.display = 'none';

    const title    = get('ccTitle');
    const brandId  = get('ccBrand');
    const infId    = get('ccInfluencer');
    if (!title)   { errEl.textContent = 'Le titre est requis.';            errEl.style.display = 'block'; return; }
    if (!brandId) { errEl.textContent = 'Sélectionnez un client.';         errEl.style.display = 'block'; return; }
    if (!infId)   { errEl.textContent = 'Sélectionnez un influenceur.';    errEl.style.display = 'block'; return; }

    btn.disabled    = true;
    btn.textContent = 'Création…';
    try {
      const res  = await fetch('api/collaborations.php?action=create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          brand_id:      parseInt(brandId),
          influencer_id: parseInt(infId),
          budget:        get('ccBudget'),
          start_date:    get('ccStart'),
          end_date:      get('ccEnd'),
          description:   get('ccDesc'),
        })
      });
      const data = await res.json();
      if (!data.success) {
        errEl.textContent   = data.message;
        errEl.style.display = 'block';
        btn.disabled = false; btn.textContent = 'Créer';
        return;
      }
      document.getElementById('createCollabOverlay')?.remove();
      this._collabsCache.unshift(data.collaboration);
      this._renderCollabs();
    } catch (_) {
      errEl.textContent   = 'Erreur réseau.';
      errEl.style.display = 'block';
      btn.disabled = false; btn.textContent = 'Créer';
    }
  },

  // ---- Contrats ----
  _contrats() {
    setTimeout(() => AdminDashboard._loadContracts(), 0);
    return `
      <div class="dash-page-header">
        <h1 class="dash-page-title">Contrats</h1>
        <p class="dash-page-desc">Uploadez et gérez les contrats PDF à faire signer par vos clients.</p>
      </div>
      <div class="dash-users-toolbar">
        <div id="contractFilters" class="dash-filter-pills" style="margin-bottom:0;flex:1"></div>
        <button class="dash-create-btn" onclick="AdminDashboard._openUploadContract()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"
               stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Nouveau contrat
        </button>
      </div>
      <div id="contractTableWrap" style="margin-top:16px">
        <div class="dash-users-loading">Chargement…</div>
      </div>
    `;
  },

  _contractsCache:  [],
  _contractsFilter: 'all',

  async _loadContracts() {
    try {
      const res  = await fetch('api/contracts.php?action=list');
      const data = await res.json();
      this._contractsCache  = data.contracts || [];
      this._contractsFilter = 'all';
      this._renderContracts();
    } catch (_) {
      const el = document.getElementById('contractTableWrap');
      if (el) el.innerHTML = '<div class="dash-empty"><div class="dash-empty-title">Erreur de chargement</div></div>';
    }
  },

  _setContractFilter(f) {
    this._contractsFilter = f;
    this._renderContracts();
  },

  _renderContracts() {
    const all = this._contractsCache;

    // Pills
    const pillEl = document.getElementById('contractFilters');
    if (pillEl) {
      const c = {
        all:     all.length,
        pending: all.filter(x => x.status === 'pending').length,
        signed:  all.filter(x => x.status === 'signed').length,
      };
      const pills = [
        { key:'all',     label:'Tous'        },
        { key:'pending', label:'En attente'  },
        { key:'signed',  label:'Signés'      },
      ];
      pillEl.innerHTML = pills.map(p => `
        <button class="dash-filter-pill ${this._contractsFilter===p.key?'active':''}"
                onclick="AdminDashboard._setContractFilter('${p.key}')">
          ${p.label} <span class="dash-filter-count">${c[p.key]}</span>
        </button>
      `).join('');
    }

    const wrap = document.getElementById('contractTableWrap');
    if (!wrap) return;

    let list = all;
    if (this._contractsFilter !== 'all') list = all.filter(x => x.status === this._contractsFilter);

    if (list.length === 0) {
      wrap.innerHTML = `
        <div class="dash-empty" style="padding-top:48px">
          <div class="dash-empty-title">Aucun contrat</div>
          <p class="dash-empty-text">Cliquez sur "Nouveau contrat" pour uploader un PDF à faire signer.</p>
        </div>`;
      return;
    }

    const statusCfg = {
      pending:  { label:'En attente', cls:'contract-s--pending' },
      signed:   { label:'Signé',      cls:'contract-s--signed'  },
      rejected: { label:'Rejeté',     cls:'contract-s--rejected'},
    };

    const rows = list.map(c => {
      const s       = statusCfg[c.status] || statusCfg.pending;
      const client  = `${c.client_firstname||''} ${c.client_lastname||''}`.trim();
      const collab  = c.collab_title ? this._escU(c.collab_title) : '<span class="dash-tcell-muted">—</span>';
      const date    = new Date(c.created_at).toLocaleDateString('fr-FR', {day:'numeric',month:'short',year:'numeric'});
      const email   = c.email_sent
        ? `<span class="contract-email-badge contract-email-badge--sent">✓ Email envoyé</span>`
        : `<span class="contract-email-badge">Email non envoyé</span>`;
      const dlSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
        stroke-linecap="round" stroke-linejoin="round" style="width:13px;height:13px">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
        <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
      </svg>`;
      return `
        <tr class="dash-tr-clickable" onclick="AdminDashboard._openContractDetail(${c.id})">
          <td><div class="dash-urow-name" style="font-size:.9rem">${this._escU(c.title)}</div></td>
          <td>
            <div class="dash-urow-name" style="font-size:.85rem">${this._escU(client)}</div>
            ${c.client_company ? `<div class="dash-urow-email">${this._escU(c.client_company)}</div>` : ''}
          </td>
          <td>${collab}</td>
          <td><span class="collab-status ${s.cls}">${s.label}</span></td>
          <td>${email}</td>
          <td class="dash-tcell-muted">${date}</td>
          <td onclick="event.stopPropagation()">
            <div style="display:flex;gap:6px;align-items:center">
              <a class="dash-icon-btn" title="Télécharger PDF original"
                 href="api/contracts.php?action=download&id=${c.id}&type=unsigned" target="_blank">
                ${dlSvg} PDF
              </a>
              ${c.signed_path ? `
              <a class="dash-icon-btn dash-icon-btn--green" title="Télécharger version signée"
                 href="api/contracts.php?action=download&id=${c.id}&type=signed" target="_blank">
                ${dlSvg} Signé
              </a>` : ''}
            </div>
          </td>
        </tr>
      `;
    }).join('');

    wrap.innerHTML = `
      <div class="dash-table-wrap">
        <table class="dash-table">
          <thead>
            <tr>
              <th>Titre</th><th>Client</th><th>Collaboration</th>
              <th>Statut</th><th>Notification</th><th>Date</th><th>Fichiers</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    `;
  },

  _openContractDetail(contractId) {
    const c = this._contractsCache.find(x => parseInt(x.id) === contractId);
    if (!c) return;

    const client  = `${c.client_firstname||''} ${c.client_lastname||''}`.trim();
    const statusCfg = { pending:'En attente', signed:'Signé', rejected:'Rejeté' };
    const signed  = c.signed_at ? new Date(c.signed_at).toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'}) : '—';

    const overlay = document.createElement('div');
    overlay.className = 'dash-modal-overlay';
    overlay.id = 'contractDetailOverlay';
    overlay.innerHTML = `
      <div class="dash-modal" style="max-width:520px">
        <div class="dash-modal-header dash-modal-header--simple">
          <h3 class="dash-modal-title">${this._escU(c.title)}</h3>
          <button class="dash-modal-close" onclick="document.getElementById('contractDetailOverlay').remove()">✕</button>
        </div>
        <div class="dash-modal-body">
          <div class="dash-modal-grid">
            <div class="dash-modal-field">
              <span class="dash-modal-label">Client</span>
              <div class="dash-modal-val">${this._escU(client)}</div>
            </div>
            <div class="dash-modal-field">
              <span class="dash-modal-label">Statut</span>
              <div class="dash-modal-val">
                <span class="collab-status contract-s--${c.status}">${statusCfg[c.status]||c.status}</span>
              </div>
            </div>
            ${c.collab_title ? `
            <div class="dash-modal-field dash-modal-field--full">
              <span class="dash-modal-label">Collaboration liée</span>
              <div class="dash-modal-val">${this._escU(c.collab_title)}</div>
            </div>` : ''}
            ${c.description ? `
            <div class="dash-modal-field dash-modal-field--full">
              <span class="dash-modal-label">Description</span>
              <div class="dash-modal-val" style="white-space:pre-wrap">${this._escU(c.description)}</div>
            </div>` : ''}
            <div class="dash-modal-field">
              <span class="dash-modal-label">Signé le</span>
              <div class="dash-modal-val">${signed}</div>
            </div>
            <div class="dash-modal-field">
              <span class="dash-modal-label">Email notif</span>
              <div class="dash-modal-val">${parseInt(c.email_sent) ? '✓ Envoyé' : 'Non envoyé'}</div>
            </div>
          </div>
        </div>
        <div class="dash-modal-footer">
          <button class="dash-mfooter-delete" onclick="AdminDashboard._deleteContract(${c.id})">Supprimer</button>
          <a class="dash-mfooter-submit" style="text-decoration:none;display:inline-flex;align-items:center"
             href="api/contracts.php?action=download&id=${c.id}&type=unsigned" target="_blank">
            Télécharger PDF
          </a>
          ${c.signed_path ? `
          <a class="dash-mfooter-submit" style="text-decoration:none;display:inline-flex;align-items:center;background:#22c55e"
             href="api/contracts.php?action=download&id=${c.id}&type=signed" target="_blank">
            Télécharger signé
          </a>` : ''}
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
  },

  async _deleteContract(contractId) {
    const c = this._contractsCache.find(x => parseInt(x.id) === contractId);
    if (!confirm(`Supprimer le contrat "${c?.title||'#'+contractId}" ?\nCette action supprime aussi les fichiers PDF.`)) return;
    document.getElementById('contractDetailOverlay')?.remove();
    try {
      const res  = await fetch('api/contracts.php?action=delete', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({id: contractId})
      });
      const data = await res.json();
      if (data.success) {
        this._contractsCache = this._contractsCache.filter(x => parseInt(x.id) !== contractId);
        this._renderContracts();
      } else alert(data.message || 'Erreur.');
    } catch (_) { alert('Erreur réseau.'); }
  },

  async _openUploadContract() {
    let users = [];
    let collabs = [];
    try {
      const [uRes, cRes] = await Promise.all([
        fetch('api/users.php?action=list'),
        fetch('api/collaborations.php?action=list'),
      ]);
      users   = (await uRes.json()).users    || [];
      collabs = (await cRes.json()).collaborations || [];
    } catch (_) {}

    const clients = users.filter(u => u.role === 'client' && parseInt(u.is_active) === 1);
    const _opt = arr => arr.map(u => {
      const n = `${u.firstname||''} ${u.lastname||''}`.trim() || u.email;
      return `<option value="${u.id}">${this._escU(n)}${u.company?' — '+this._escU(u.company):''}</option>`;
    }).join('');
    const _collabOpt = collabs.map(c => `<option value="${c.id}">${this._escU(c.title)}</option>`).join('');

    const overlay = document.createElement('div');
    overlay.className = 'dash-modal-overlay';
    overlay.id = 'uploadContractOverlay';
    overlay.innerHTML = `
      <div class="dash-modal" style="max-width:520px">
        <div class="dash-modal-header dash-modal-header--simple">
          <h3 class="dash-modal-title">Nouveau contrat</h3>
          <button class="dash-modal-close" onclick="document.getElementById('uploadContractOverlay').remove()">✕</button>
        </div>
        <div class="dash-modal-body">
          <div class="dash-modal-grid">
            <div class="dash-modal-field dash-modal-field--full">
              <span class="dash-modal-label">Titre *</span>
              <input class="dash-modal-input" id="ucTitle" placeholder="Ex : Contrat campagne été 2025">
            </div>
            <div class="dash-modal-field">
              <span class="dash-modal-label">Client *</span>
              <select class="dash-modal-input" id="ucClient">
                <option value="">Sélectionner…</option>${_opt(clients)}
              </select>
            </div>
            <div class="dash-modal-field">
              <span class="dash-modal-label">Collaboration liée</span>
              <select class="dash-modal-input" id="ucCollab">
                <option value="">Aucune</option>${_collabOpt}
              </select>
            </div>
            <div class="dash-modal-field dash-modal-field--full">
              <span class="dash-modal-label">Fichier PDF *</span>
              <label class="contract-file-label" id="ucFileLabel">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
                     stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                <span id="ucFileName">Choisir un fichier PDF (max 15 Mo)</span>
                <input type="file" id="ucFile" accept=".pdf" style="display:none"
                       onchange="document.getElementById('ucFileName').textContent = this.files[0]?.name || 'Aucun fichier'">
              </label>
            </div>
            <div class="dash-modal-field dash-modal-field--full">
              <span class="dash-modal-label">Description / instructions</span>
              <textarea class="dash-modal-input" id="ucDesc" rows="2"
                        placeholder="Informations pour le client…" style="resize:vertical"></textarea>
            </div>
          </div>
          <div id="ucError" class="dash-modal-error" style="display:none"></div>
          <p style="font-size:.78rem;color:var(--muted);margin-top:10px">
            ✉️ Le client recevra automatiquement un email de notification.
          </p>
        </div>
        <div class="dash-modal-footer">
          <button class="dash-mfooter-close" onclick="document.getElementById('uploadContractOverlay').remove()">Annuler</button>
          <button class="dash-mfooter-submit" onclick="AdminDashboard._submitUploadContract(this)">Envoyer</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
    document.getElementById('ucTitle')?.focus();
  },

  async _submitUploadContract(btn) {
    const errEl = document.getElementById('ucError');
    errEl.style.display = 'none';

    const title    = document.getElementById('ucTitle')?.value?.trim() || '';
    const clientId = document.getElementById('ucClient')?.value        || '';
    const collabId = document.getElementById('ucCollab')?.value        || '';
    const desc     = document.getElementById('ucDesc')?.value?.trim()  || '';
    const file     = document.getElementById('ucFile')?.files[0];

    if (!title)    { errEl.textContent='Le titre est requis.';    errEl.style.display='block'; return; }
    if (!clientId) { errEl.textContent='Sélectionnez un client.'; errEl.style.display='block'; return; }
    if (!file)     { errEl.textContent='Un fichier PDF est requis.'; errEl.style.display='block'; return; }

    btn.disabled = true; btn.textContent = 'Envoi…';

    const fd = new FormData();
    fd.append('title',       title);
    fd.append('client_id',   clientId);
    fd.append('collab_id',   collabId);
    fd.append('description', desc);
    fd.append('file',        file);

    try {
      const res  = await fetch('api/contracts.php?action=upload', { method:'POST', body:fd });
      const data = await res.json();
      if (!data.success) {
        errEl.textContent   = data.message;
        errEl.style.display = 'block';
        btn.disabled = false; btn.textContent = 'Envoyer';
        return;
      }
      document.getElementById('uploadContractOverlay')?.remove();
      await this._loadContracts();
    } catch (_) {
      errEl.textContent   = 'Erreur réseau.';
      errEl.style.display = 'block';
      btn.disabled = false; btn.textContent = 'Envoyer';
    }
  },

  // ---- Statistiques ----
  _stats() {
    setTimeout(() => AdminDashboard._loadStats(), 0);
    const _skel = () => `
      <div class="dash-stat-card dash-stat-card--loading">
        <div class="dash-stat-num dash-skeleton"></div>
        <div class="dash-stat-label dash-skeleton" style="width:60%;height:12px"></div>
      </div>`;
    return `
      <div class="dash-page-header">
        <h1 class="dash-page-title">Statistiques plateforme</h1>
        <p class="dash-page-desc">Vue globale des utilisateurs, collaborations et activités.</p>
      </div>

      <div class="stats-section-title">Utilisateurs</div>
      <div class="dash-stats-grid" id="statsUsersGrid">
        ${[1,2,3,4].map(_skel).join('')}
      </div>

      <div class="stats-section-title" style="margin-top:28px">Collaborations</div>
      <div class="dash-stats-grid" id="statsCollabsGrid">
        ${[1,2,3,4].map(_skel).join('')}
      </div>

      <div class="stats-two-col" style="margin-top:28px">
        <div class="dash-overview-panel" id="statsRecentUsers">
          <div class="dash-panel-title">Derniers inscrits</div>
          <div class="dash-panel-loading">Chargement…</div>
        </div>
        <div class="dash-overview-panel" id="statsRecentCollabs">
          <div class="dash-panel-title">Dernières collaborations</div>
          <div class="dash-panel-loading">Chargement…</div>
        </div>
      </div>
    `;
  },

  async _loadStats() {
    try {
      const res  = await fetch('api/stats.php');
      const data = await res.json();
      if (!data.success) return;
      const s = data.stats;

      // ── Users KPIs ─────────────────────────────────
      const usersGrid = document.getElementById('statsUsersGrid');
      if (usersGrid) {
        usersGrid.innerHTML = [
          { val: s.users_total,    label: 'Comptes créés',         color: 'var(--primary)', sub: `${s.users_active} actifs` },
          { val: s.clients,        label: 'Clients actifs',         color: '#22c55e',        sub: `${s.admins} admin${s.admins > 1 ? 's' : ''}` },
          { val: s.new_this_week,  label: 'Nouveaux cette semaine', color: '#f59e0b',        sub: null },
          { val: s.messages_unread,label: 'Messages non lus',       color: '#ef4444',        sub: null },
        ].map(c => `
          <div class="dash-stat-card">
            <div class="dash-stat-num" style="color:${c.color}">${c.val}</div>
            <div class="dash-stat-label">${c.label}</div>
            ${c.sub ? `<div class="dash-stat-sub">${c.sub}</div>` : ''}
          </div>
        `).join('');
      }

      // ── Collabs KPIs ───────────────────────────────
      const collabsGrid = document.getElementById('statsCollabsGrid');
      if (collabsGrid) {
        collabsGrid.innerHTML = [
          { val: s.collabs_total,     label: 'Total collaborations', color: 'var(--primary)', sub: null },
          { val: s.collabs_active,    label: 'En cours',             color: '#22c55e',        sub: null },
          { val: s.collabs_pending,   label: 'En attente',           color: '#f59e0b',        sub: null },
          { val: s.collabs_completed, label: 'Terminées',            color: 'var(--muted)',   sub: `${s.collabs_cancelled} annulée${s.collabs_cancelled > 1 ? 's' : ''}` },
        ].map(c => `
          <div class="dash-stat-card">
            <div class="dash-stat-num" style="color:${c.color}">${c.val}</div>
            <div class="dash-stat-label">${c.label}</div>
            ${c.sub ? `<div class="dash-stat-sub">${c.sub}</div>` : ''}
          </div>
        `).join('');
      }

      // ── Recent users ───────────────────────────────
      const recentUsersEl = document.getElementById('statsRecentUsers');
      if (recentUsersEl) {
        const users = data.recent_users || [];
        recentUsersEl.innerHTML = `<div class="dash-panel-title">Derniers inscrits</div>` + (
          users.length === 0
            ? '<div class="dash-panel-empty">Aucun inscrit</div>'
            : users.map(u => {
                const name    = `${u.firstname || ''} ${u.lastname || ''}`.trim() || u.email;
                const initial = (u.firstname || u.email || '?').charAt(0).toUpperCase();
                const date    = new Date(u.created_at).toLocaleDateString('fr-FR', { day:'numeric', month:'short' });
                return `
                  <div class="dash-recent-row">
                    <div class="dash-recent-avatar">${initial}</div>
                    <div class="dash-recent-info">
                      <div class="dash-recent-name">${AdminDashboard._escU(name)}</div>
                      <div class="dash-recent-meta">${AdminDashboard._escU(u.email)}</div>
                    </div>
                    <div class="dash-recent-right">
                      <span class="dash-role-select dash-role-select--${u.role}" style="cursor:default;pointer-events:none">
                        ${u.role === 'admin' ? 'Admin' : u.role === 'client' ? 'Client' : 'User'}
                      </span>
                      <span class="dash-recent-date">${date}</span>
                    </div>
                  </div>
                `;
              }).join('')
        );
      }

      // ── Recent collabs ─────────────────────────────
      const recentCollabsEl = document.getElementById('statsRecentCollabs');
      if (recentCollabsEl) {
        const collabs = data.recent_collabs || [];
        const statusCfg = {
          pending:   { label: 'En attente', cls: 'collab-s--pending'   },
          active:    { label: 'Active',     cls: 'collab-s--active'    },
          completed: { label: 'Terminée',   cls: 'collab-s--completed' },
          cancelled: { label: 'Annulée',    cls: 'collab-s--cancelled' },
        };
        recentCollabsEl.innerHTML = `<div class="dash-panel-title">Dernières collaborations</div>` + (
          collabs.length === 0
            ? '<div class="dash-panel-empty">Aucune collaboration</div>'
            : collabs.map(c => {
                const brand  = `${c.brand_firstname || ''} ${c.brand_lastname || ''}`.trim();
                const inf    = `${c.inf_firstname   || ''} ${c.inf_lastname   || ''}`.trim();
                const sc     = statusCfg[c.status] || statusCfg.pending;
                const date   = new Date(c.created_at).toLocaleDateString('fr-FR', { day:'numeric', month:'short' });
                const budget = c.budget ? `${Number(c.budget).toLocaleString('fr-FR')} €` : '';
                return `
                  <div class="dash-recent-row">
                    <div class="dash-recent-avatar" style="background:var(--primary-light);color:var(--primary);font-size:.8rem">
                      ${(c.title || '?').charAt(0).toUpperCase()}
                    </div>
                    <div class="dash-recent-info">
                      <div class="dash-recent-name">${AdminDashboard._escU(c.title)}</div>
                      <div class="dash-recent-meta">${AdminDashboard._escU(brand)} → ${AdminDashboard._escU(inf)}${budget ? ' · ' + budget : ''}</div>
                    </div>
                    <div class="dash-recent-right">
                      <span class="collab-status ${sc.cls}" style="cursor:default">${sc.label}</span>
                      <span class="dash-recent-date">${date}</span>
                    </div>
                  </div>
                `;
              }).join('')
        );
      }
    } catch (_) {}
  },

  // ---- Calendrier ----
  _calendrier() {
    setTimeout(() => CalendarController.init(true), 0);
    return CalendarController.renderCalendar(true);
  },

  // ---- Gestion utilisateurs ----
  _users() {
    setTimeout(() => AdminDashboard._loadUsers(), 0);
    return `
      <div class="dash-page-header">
        <h1 class="dash-page-title">Gestion des utilisateurs</h1>
        <p class="dash-page-desc">Consultez et gérez tous les comptes inscrits sur la plateforme.</p>
      </div>

      <div class="dash-users-toolbar">
        <div class="dash-users-search-wrap">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
               stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input type="text" id="usersSearch" class="dash-users-search"
                 placeholder="Rechercher par nom ou e-mail…"
                 oninput="AdminDashboard._filterUsers(this.value)">
        </div>
        <span id="usersCount" class="dash-users-count"></span>
        <button class="dash-create-btn" onclick="AdminDashboard._openCreateUser()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"
               stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Nouveau compte
        </button>
      </div>

      <div id="usersFilters" class="dash-filter-pills"></div>

      <div id="usersTableWrap">
        <div class="dash-users-loading">Chargement…</div>
      </div>
    `;
  },

  _usersCache:  [],
  _usersFilter: 'all',
  _usersSort:   { col: 'name', dir: 'asc' },
  _usersQuery:  '',

  async _loadUsers() {
    try {
      const res  = await fetch('api/users.php?action=list');
      const data = await res.json();
      this._usersCache  = data.users || [];
      this._usersFilter = 'all';
      this._usersQuery  = '';
      this._usersSort   = { col: 'name', dir: 'asc' };
      this._applyFilters();
    } catch (_) {
      const el = document.getElementById('usersTableWrap');
      if (el) el.innerHTML = '<div class="dash-empty"><div class="dash-empty-title">Erreur de chargement</div></div>';
    }
  },

  _filterUsers(q) {
    this._usersQuery = q.trim();
    this._applyFilters();
  },

  _setUserFilter(filter) {
    this._usersFilter = filter;
    this._applyFilters();
  },

  _setUserSort(col) {
    if (this._usersSort.col === col) {
      this._usersSort.dir = this._usersSort.dir === 'asc' ? 'desc' : 'asc';
    } else {
      this._usersSort = { col, dir: col === 'created_at' || col === 'last_login' ? 'desc' : 'asc' };
    }
    this._applyFilters();
  },

  _applyFilters() {
    const q = this._usersQuery.toLowerCase();
    let list = this._usersCache;

    if (q) {
      list = list.filter(u =>
        `${u.firstname} ${u.lastname}`.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q));
    }

    if (this._usersFilter === 'inactive') {
      list = list.filter(u => parseInt(u.is_active) === 0);
    } else if (this._usersFilter !== 'all') {
      list = list.filter(u => u.role === this._usersFilter);
    }

    const { col, dir } = this._usersSort;
    list = [...list].sort((a, b) => {
      let va, vb;
      if (col === 'name') {
        va = `${a.firstname || ''} ${a.lastname || ''}`.trim().toLowerCase();
        vb = `${b.firstname || ''} ${b.lastname || ''}`.trim().toLowerCase();
      } else {
        va = a[col] || '';
        vb = b[col] || '';
      }
      const cmp = va < vb ? -1 : va > vb ? 1 : 0;
      return dir === 'asc' ? cmp : -cmp;
    });

    this._renderFilterPills();
    this._renderUsersTable(list, q);
  },

  _renderFilterPills() {
    const el = document.getElementById('usersFilters');
    if (!el) return;
    const all = this._usersCache;
    const counts = {
      all:      all.length,
      admin:    all.filter(u => u.role === 'admin').length,
      client:   all.filter(u => u.role === 'client').length,
      user:     all.filter(u => u.role === 'user').length,
      inactive: all.filter(u => parseInt(u.is_active) === 0).length,
    };
    const pills = [
      { key: 'all',      label: 'Tous'       },
      { key: 'admin',    label: 'Admin'       },
      { key: 'client',   label: 'Client'      },
      { key: 'user',     label: 'Utilisateur' },
      { key: 'inactive', label: 'Suspendu'    },
    ];
    el.innerHTML = pills.map(p => `
      <button class="dash-filter-pill ${this._usersFilter === p.key ? 'active' : ''}"
              onclick="AdminDashboard._setUserFilter('${p.key}')">
        ${p.label}
        <span class="dash-filter-count">${counts[p.key]}</span>
      </button>
    `).join('');
  },

  _renderUsersTable(users, highlight = '') {
    const wrap  = document.getElementById('usersTableWrap');
    const count = document.getElementById('usersCount');
    if (!wrap) return;
    if (count) count.textContent = `${users.length} utilisateur${users.length !== 1 ? 's' : ''}`;

    if (users.length === 0) {
      wrap.innerHTML = `
        <div class="dash-empty" style="padding-top:48px">
          <div class="dash-empty-title">Aucun résultat</div>
          <p class="dash-empty-text">Aucun utilisateur ne correspond à votre recherche.</p>
        </div>`;
      return;
    }

    const _hl = (str) => {
      if (!highlight || !str) return this._escU(str);
      return this._escU(str).replace(
        new RegExp(highlight.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'), 'gi'),
        m => `<mark>${m}</mark>`
      );
    };

    const { col, dir } = this._usersSort;
    const _sortIcon = (c) => {
      if (col !== c) return '<span class="dash-sort-icon">↕</span>';
      return `<span class="dash-sort-icon active">${dir === 'asc' ? '↑' : '↓'}</span>`;
    };

    const rows = users.map(u => {
      const name    = `${u.firstname || ''} ${u.lastname || ''}`.trim();
      const initial = (u.firstname || u.email || '?').charAt(0).toUpperCase();
      const active  = parseInt(u.is_active) === 1;
      const joined  = u.created_at ? new Date(u.created_at).toLocaleDateString('fr-FR') : '—';
      const lastLog = u.last_login
        ? new Date(u.last_login).toLocaleDateString('fr-FR', { day:'2-digit', month:'2-digit', year:'2-digit' })
        : 'Jamais';

      return `
        <tr data-uid="${u.id}" class="dash-tr-clickable"
            onclick="AdminDashboard._openUserDetail(${u.id})">
          <td>
            <div class="dash-urow">
              <div class="dash-urow-avatar">${initial}</div>
              <div>
                <div class="dash-urow-name">${_hl(name) || '—'}</div>
                <div class="dash-urow-email">${_hl(u.email)}</div>
              </div>
            </div>
          </td>
          <td onclick="event.stopPropagation()">
            <select class="dash-role-select dash-role-select--${u.role}"
                    onchange="AdminDashboard._changeRole(${u.id}, this.value, this)">
              <option value="client"     ${u.role === 'client'     ? 'selected' : ''}>Client</option>
              <option value="influencer" ${u.role === 'influencer' ? 'selected' : ''}>Influenceur</option>
              <option value="brand"      ${u.role === 'brand'      ? 'selected' : ''}>Marque</option>
              <option value="admin"      ${u.role === 'admin'      ? 'selected' : ''}>Admin</option>
              <option value="user"       ${u.role === 'user'       ? 'selected' : ''}>Utilisateur</option>
            </select>
          </td>
          <td>
            <span class="dash-status-badge ${active ? 'dash-status-badge--active' : 'dash-status-badge--inactive'}">
              ${active ? 'Actif' : 'Suspendu'}
            </span>
          </td>
          <td class="dash-tcell-muted">${lastLog}</td>
          <td class="dash-tcell-muted">${joined}</td>
          <td onclick="event.stopPropagation()">
            <button class="dash-toggle-btn ${active ? 'dash-toggle-btn--suspend' : 'dash-toggle-btn--activate'}"
                    onclick="AdminDashboard._toggleUser(${u.id}, ${active ? 1 : 0}, this)">
              ${active ? 'Suspendre' : 'Activer'}
            </button>
          </td>
        </tr>
      `;
    }).join('');

    wrap.innerHTML = `
      <div class="dash-table-wrap">
        <table class="dash-table">
          <thead>
            <tr>
              <th class="dash-th-sortable" onclick="AdminDashboard._setUserSort('name')">
                Utilisateur ${_sortIcon('name')}
              </th>
              <th>Rôle</th>
              <th>Statut</th>
              <th class="dash-th-sortable" onclick="AdminDashboard._setUserSort('last_login')">
                Dernière connexion ${_sortIcon('last_login')}
              </th>
              <th class="dash-th-sortable" onclick="AdminDashboard._setUserSort('created_at')">
                Inscrit le ${_sortIcon('created_at')}
              </th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    `;
  },

  async _toggleUser(userId, currentActive, btn) {
    btn.disabled    = true;
    btn.textContent = '…';
    try {
      await fetch('api/users.php?action=toggle', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId })
      });
      const u = this._usersCache.find(x => parseInt(x.id) === userId);
      if (u) u.is_active = currentActive === 1 ? 0 : 1;
      this._applyFilters();
    } catch (_) {
      btn.disabled    = false;
      btn.textContent = currentActive === 1 ? 'Suspendre' : 'Activer';
    }
  },

  async _changeRole(userId, newRole, select) {
    select.disabled = true;
    try {
      await fetch('api/users.php?action=role', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, role: newRole })
      });
      const u = this._usersCache.find(x => parseInt(x.id) === userId);
      if (u) u.role = newRole;
      select.className = `dash-role-select dash-role-select--${newRole}`;
      this._renderFilterPills();
    } catch (_) {}
    select.disabled = false;
  },

  // ---- Modale détail utilisateur ----
  _openUserDetail(userId) {
    const u = this._usersCache.find(x => parseInt(x.id) === userId);
    if (!u) return;

    const me     = UserModel.getUser();
    const isSelf = parseInt(u.id) === me?.id;
    const active = parseInt(u.is_active) === 1;
    const name   = `${u.firstname || ''} ${u.lastname || ''}`.trim() || '—';
    const joined = u.created_at ? new Date(u.created_at).toLocaleDateString('fr-FR', { day:'numeric', month:'long', year:'numeric' }) : '—';
    const lastLog = u.last_login ? new Date(u.last_login).toLocaleDateString('fr-FR', { day:'numeric', month:'long', year:'numeric' }) : 'Jamais';

    const overlay = document.createElement('div');
    overlay.className = 'dash-modal-overlay';
    overlay.id        = 'userDetailOverlay';
    overlay.innerHTML = `
      <div class="dash-modal">
        <div class="dash-modal-header">
          <div class="dash-modal-avatar">${(u.firstname || '?').charAt(0).toUpperCase()}</div>
          <div>
            <div class="dash-modal-name">${this._escU(name)}</div>
            <span class="dash-role-select dash-role-select--${u.role}" style="cursor:default;pointer-events:none">
              ${u.role === 'admin' ? 'Admin' : u.role === 'client' ? 'Client' : 'Utilisateur'}
            </span>
          </div>
          <button class="dash-modal-close" onclick="document.getElementById('userDetailOverlay').remove()">✕</button>
        </div>
        <div class="dash-modal-body">
          <div class="dash-modal-grid">
            <div class="dash-modal-field">
              <span class="dash-modal-label">Prénom</span>
              <span class="dash-modal-val">${this._escU(u.firstname) || '—'}</span>
            </div>
            <div class="dash-modal-field">
              <span class="dash-modal-label">Nom</span>
              <span class="dash-modal-val">${this._escU(u.lastname) || '—'}</span>
            </div>
            <div class="dash-modal-field dash-modal-field--full">
              <span class="dash-modal-label">E-mail</span>
              <span class="dash-modal-val">${this._escU(u.email) || '—'}</span>
            </div>
            <div class="dash-modal-field">
              <span class="dash-modal-label">Téléphone</span>
              <span class="dash-modal-val">${this._escU(u.phone) || '—'}</span>
            </div>
            <div class="dash-modal-field">
              <span class="dash-modal-label">Entreprise</span>
              <span class="dash-modal-val">${this._escU(u.company) || '—'}</span>
            </div>
            <div class="dash-modal-field">
              <span class="dash-modal-label">Statut</span>
              <span class="dash-status-badge ${active ? 'dash-status-badge--active' : 'dash-status-badge--inactive'}">
                ${active ? 'Actif' : 'Suspendu'}
              </span>
            </div>
            <div class="dash-modal-field">
              <span class="dash-modal-label">Inscrit le</span>
              <span class="dash-modal-val">${joined}</span>
            </div>
            <div class="dash-modal-field dash-modal-field--full">
              <span class="dash-modal-label">Dernière connexion</span>
              <span class="dash-modal-val">${lastLog}</span>
            </div>
          </div>
        </div>
        <div class="dash-modal-footer">
          <button class="dash-mfooter-close" onclick="document.getElementById('userDetailOverlay').remove()">Fermer</button>
          ${!isSelf ? `
            <button class="dash-mfooter-delete" onclick="AdminDashboard._deleteUser(${u.id})">
              Supprimer le compte
            </button>` : `<span class="dash-modal-self-note">Votre propre compte</span>`}
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
  },

  // ---- Modale créer un compte ----
  _openCreateUser() {
    const overlay = document.createElement('div');
    overlay.className = 'dash-modal-overlay';
    overlay.id        = 'createUserOverlay';
    overlay.innerHTML = `
      <div class="dash-modal">
        <div class="dash-modal-header dash-modal-header--simple">
          <h3 class="dash-modal-title">Nouveau compte</h3>
          <button class="dash-modal-close" onclick="document.getElementById('createUserOverlay').remove()">✕</button>
        </div>
        <div class="dash-modal-body">
          <div class="dash-modal-grid">
            <div class="dash-modal-field">
              <span class="dash-modal-label">Prénom *</span>
              <input class="dash-modal-input" id="cuFirstname" placeholder="Jean">
            </div>
            <div class="dash-modal-field">
              <span class="dash-modal-label">Nom *</span>
              <input class="dash-modal-input" id="cuLastname" placeholder="Dupont">
            </div>
            <div class="dash-modal-field dash-modal-field--full">
              <span class="dash-modal-label">E-mail *</span>
              <input class="dash-modal-input" id="cuEmail" type="email" placeholder="jean@exemple.com">
            </div>
            <div class="dash-modal-field dash-modal-field--full">
              <span class="dash-modal-label">Mot de passe * (min. 8 caractères)</span>
              <input class="dash-modal-input" id="cuPassword" type="password" placeholder="••••••••">
            </div>
            <div class="dash-modal-field">
              <span class="dash-modal-label">Téléphone</span>
              <input class="dash-modal-input" id="cuPhone" placeholder="+33 6 00 00 00 00">
            </div>
            <div class="dash-modal-field">
              <span class="dash-modal-label">Entreprise</span>
              <input class="dash-modal-input" id="cuCompany" placeholder="Nom de l'entreprise">
            </div>
            <div class="dash-modal-field">
              <span class="dash-modal-label">Rôle</span>
              <select class="dash-modal-input" id="cuRole">
                <option value="influencer">Influenceur</option>
                <option value="brand">Marque (client)</option>
                <option value="client" selected>Client (générique)</option>
                <option value="user">Utilisateur</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <div id="cuError" class="dash-modal-error" style="display:none"></div>
        </div>
        <div class="dash-modal-footer">
          <button class="dash-mfooter-close" onclick="document.getElementById('createUserOverlay').remove()">Annuler</button>
          <button class="dash-mfooter-submit" id="cuSubmitBtn" onclick="AdminDashboard._submitCreateUser(this)">
            Créer le compte
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
    document.getElementById('cuFirstname')?.focus();
  },

  async _submitCreateUser(btn) {
    const get = id => document.getElementById(id)?.value?.trim() || '';
    const errEl = document.getElementById('cuError');
    errEl.style.display = 'none';

    const payload = {
      firstname: get('cuFirstname'),
      lastname:  get('cuLastname'),
      email:     get('cuEmail'),
      password:  get('cuPassword'),
      phone:     get('cuPhone'),
      company:   get('cuCompany'),
      role:      get('cuRole'),
    };

    btn.disabled    = true;
    btn.textContent = 'Création…';
    try {
      const res  = await fetch('api/users.php?action=create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!data.success) {
        errEl.textContent    = data.message;
        errEl.style.display  = 'block';
        btn.disabled         = false;
        btn.textContent      = 'Créer le compte';
        return;
      }
      document.getElementById('createUserOverlay')?.remove();
      this._usersCache.unshift(data.user);
      this._usersSort = { col: 'name', dir: 'asc' };
      this._applyFilters();
    } catch (_) {
      errEl.textContent   = 'Erreur réseau. Réessayez.';
      errEl.style.display = 'block';
      btn.disabled        = false;
      btn.textContent     = 'Créer le compte';
    }
  },

  // ---- Supprimer un compte ----
  async _deleteUser(userId) {
    const u    = this._usersCache.find(x => parseInt(x.id) === userId);
    const name = u ? `${u.firstname} ${u.lastname}`.trim() : `#${userId}`;
    if (!confirm(`Supprimer définitivement le compte de ${name} ?\nCette action est irréversible.`)) return;

    document.getElementById('userDetailOverlay')?.remove();
    try {
      const res  = await fetch('api/users.php?action=delete', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId })
      });
      const data = await res.json();
      if (data.success) {
        this._usersCache = this._usersCache.filter(x => parseInt(x.id) !== userId);
        this._applyFilters();
      } else {
        alert(data.message || 'Erreur lors de la suppression.');
      }
    } catch (_) {
      alert('Erreur réseau. Réessayez.');
    }
  },

  _escU(str) {
    if (!str) return '';
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  },

  // ---- Agent marketing (IA) ----
  _agent() {
    setTimeout(() => AgentController.init(), 0);
    const chips = AgentController.QUICK_ACTIONS.map(a =>
      `<button class="agent-chip" onclick="AgentController.quickAction('${a.id}')">${a.label}</button>`
    ).join('');

    return `
      <div class="dash-page-header">
        <h1 class="dash-page-title">Agent marketing</h1>
        <p class="dash-page-desc">Votre assistant IA privé — prompts, briefs créatifs et stratégies de campagne.</p>
      </div>

      <div class="agent-wrap">
        <div class="agent-chips">${chips}</div>

        <div class="agent-chat-box">
          <div class="agent-messages" id="agentMessages"></div>

          <div class="agent-input-row">
            <textarea id="agentInput" class="agent-input"
                      placeholder="Décrivez votre demande…" rows="1"
                      onkeydown="AgentController.onKeyDown(event)"></textarea>
            <button id="agentSendBtn" class="agent-send-btn" onclick="AgentController.send()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"
                   stroke-linecap="round" stroke-linejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
        </div>

        <div class="agent-footer">
          <button class="agent-clear-btn" onclick="AgentController.clearHistory()">
            Réinitialiser la conversation
          </button>
        </div>
      </div>
    `;
  },

  // ---- Mon compte ----
  _compte() {
    const user = UserModel.getUser();
    if (!user) return '';

    return `
      <div class="dash-page-header">
        <h1 class="dash-page-title">Mon compte</h1>
        <p class="dash-page-desc">Vos informations personnelles et statut de compte.</p>
      </div>

      <div class="dash-account-wrap">
        <div class="dash-account-grid">

          <div class="dash-field">
            <span class="dash-field-label">Prénom</span>
            <div class="dash-field-value">${user.firstname || '—'}</div>
          </div>
          <div class="dash-field">
            <span class="dash-field-label">Nom</span>
            <div class="dash-field-value">${user.lastname || '—'}</div>
          </div>

          <div class="dash-field dash-field--full">
            <span class="dash-field-label">Adresse e-mail</span>
            <div class="dash-field-value">${user.email || '—'}</div>
          </div>

          <div class="dash-field">
            <span class="dash-field-label">Rôle</span>
            <div class="dash-field-value" style="text-transform:capitalize">${user.role || '—'}</div>
          </div>
          <div class="dash-field">
            <span class="dash-field-label">Statut</span>
            <div style="margin-top:2px"><span class="dash-active-badge">Compte actif</span></div>
          </div>

        </div>

        <!-- Informations modifiables -->
        <div class="dash-account-edit-section" style="margin-top:24px">
          <div class="dash-account-edit-title">Informations modifiables</div>
          <div class="dash-account-edit-grid">
            <input class="dash-edit-input" id="adminEditPhone"   type="tel"  placeholder="Téléphone"  value="${this._escU(user.phone   || '')}">
            <input class="dash-edit-input" id="adminEditCompany" type="text" placeholder="Entreprise" value="${this._escU(user.company || '')}">
          </div>
          <div id="adminProfileMsg" style="font-size:.82rem;margin-bottom:10px;display:none"></div>
          <button class="dash-save-btn" onclick="AdminDashboard._saveCompte(this)">Enregistrer</button>
        </div>

        <!-- Changement de mot de passe -->
        <div class="dash-account-edit-section" style="margin-top:16px">
          <div class="dash-account-edit-title">Changer le mot de passe</div>
          <div class="dash-account-edit-grid" style="grid-template-columns:1fr">
            <input class="dash-edit-input" id="adminPwCurrent" type="password" placeholder="Mot de passe actuel">
            <input class="dash-edit-input" id="adminPwNew"     type="password" placeholder="Nouveau mot de passe (8 car. min.)">
            <input class="dash-edit-input" id="adminPwConfirm" type="password" placeholder="Confirmer le nouveau mot de passe">
          </div>
          <div id="adminPwMsg" style="font-size:.82rem;margin-bottom:10px;display:none"></div>
          <button class="dash-save-btn" onclick="AdminDashboard._changePassword(this)">Mettre à jour</button>
        </div>
      </div>
    `;
  },

  async _saveCompte(btn) {
    const phone   = document.getElementById('adminEditPhone')?.value.trim()   || '';
    const company = document.getElementById('adminEditCompany')?.value.trim() || '';
    const msg     = document.getElementById('adminProfileMsg');

    btn.disabled = true; btn.textContent = 'Enregistrement…';
    try {
      const res  = await fetch('api/users.php?action=update_profile', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ phone, company }),
      });
      const data = await res.json();
      if (msg) {
        msg.style.display = 'block';
        msg.style.color   = data.success ? '#16a34a' : '#dc2626';
        msg.textContent   = data.message || (data.success ? 'Profil mis à jour.' : 'Erreur.');
        setTimeout(() => { msg.style.display = 'none'; }, 3000);
      }
      if (data.success) {
        const u = UserModel.getUser();
        if (u) { u.phone = phone; u.company = company; }
      }
    } catch (_) {
      if (msg) { msg.style.display='block'; msg.style.color='#dc2626'; msg.textContent='Erreur réseau.'; }
    } finally {
      btn.disabled = false; btn.textContent = 'Enregistrer';
    }
  },

  async _changePassword(btn) {
    const current = document.getElementById('adminPwCurrent')?.value || '';
    const newPw   = document.getElementById('adminPwNew')?.value     || '';
    const confirm = document.getElementById('adminPwConfirm')?.value || '';
    const msg     = document.getElementById('adminPwMsg');

    const show = (text, ok) => {
      if (!msg) return;
      msg.style.display = 'block';
      msg.style.color   = ok ? '#16a34a' : '#dc2626';
      msg.textContent   = text;
    };

    if (!current || !newPw || !confirm) return show('Remplissez tous les champs.', false);
    if (newPw !== confirm)              return show('Les mots de passe ne correspondent pas.', false);

    btn.disabled = true; btn.textContent = 'Mise à jour…';
    try {
      const res  = await fetch('api/users.php?action=change_password', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ current_password: current, new_password: newPw }),
      });
      const data = await res.json();
      show(data.message || (data.success ? 'Mot de passe mis à jour.' : 'Erreur.'), data.success);
      if (data.success) {
        document.getElementById('adminPwCurrent').value = '';
        document.getElementById('adminPwNew').value     = '';
        document.getElementById('adminPwConfirm').value = '';
        setTimeout(() => { if (msg) msg.style.display = 'none'; }, 3000);
      }
    } catch (_) {
      show('Erreur réseau.', false);
    } finally {
      btn.disabled = false; btn.textContent = 'Mettre à jour';
    }
  }

};
