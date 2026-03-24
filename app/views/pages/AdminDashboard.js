/* ===================================================
   APP/VIEWS/PAGES/ADMINDASHBOARD.JS
   Admin space: fixed sidebar + dynamic content
   Pages : overview · discussions · collaborations ·
           contracts · stats · users · agent · account
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
            <div class="dash-nav-section-label">Admin space</div>

            ${this._item('overview', 'Overview',
              `<path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>`
            )}
            ${this._item('discussions', 'Messages',
              `<path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>`
            )}
            ${this._item('collaborations', 'Collaborations',
              `<path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>`
            )}
            ${this._item('contrats', 'Contracts',
              `<path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/>`
            )}
            ${this._item('stats', 'Statistics',
              `<path d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"/>`
            )}

            ${this._item('calendrier', 'Calendar',
              `<path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>`
            )}

            <div class="dash-nav-section-label">Tools</div>

            ${this._item('users', 'User management',
              `<path d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"/>`
            )}
            ${this._item('agent', 'Marketing agent',
              `<path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/>`
            )}

            <div class="dash-nav-section-label">Settings</div>

            ${this._item('compte', 'My account',
              `<path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>`
            )}

            <div class="dash-nav-footer">
              <a href="#home" class="dash-back-link">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"
                     stroke-linecap="round" stroke-linejoin="round">
                  <path d="M19 12H5M12 5l-7 7 7 7"/>
                </svg>
                Back to site
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
        ${isNew ? `<span class="dash-nav-badge">Coming soon</span>` : ''}
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

    // Close mobile sidebar after navigation
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

  // ---- Overview ----
  _overview() {
    setTimeout(() => AdminDashboard._loadOverview(), 0);
    return `
      <div class="dash-page-header">
        <h1 class="dash-page-title">Overview</h1>
        <p class="dash-page-desc">Key metrics for your activity at a glance.</p>
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
          <div class="dash-panel-title">Latest sign-ups</div>
          <div class="dash-panel-loading">Loading…</div>
        </div>
        <div class="dash-overview-panel" id="overviewActivity">
          <div class="dash-panel-title">Latest collaborations</div>
          <div class="dash-panel-loading">Loading…</div>
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
          { val: s.users_active,    label: 'Active users',          color: '#22c55e',        sub: `+${s.new_this_week} this week` },
          { val: s.clients,         label: 'Active clients',         color: 'var(--primary)', sub: `${s.admins} admin${s.admins > 1 ? 's' : ''}` },
          { val: s.collabs_total,   label: 'Total collaborations',   color: '#f59e0b',        sub: `${s.collabs_active} active` },
          { val: s.messages_unread, label: 'Unread messages',        color: '#ef4444',        sub: null },
        ].map(c => `
          <div class="dash-stat-card">
            <div class="dash-stat-num" style="color:${c.color}">${c.val}</div>
            <div class="dash-stat-label">${c.label}</div>
            ${c.sub ? `<div class="dash-stat-sub">${c.sub}</div>` : ''}
          </div>
        `).join('');
      }

      // ── Latest sign-ups ────────────────────────────
      const recentEl = document.getElementById('overviewRecent');
      if (recentEl) {
        const users = data.recent_users || [];
        recentEl.innerHTML = `<div class="dash-panel-title">Latest sign-ups</div>` + (
          users.length === 0
            ? '<div class="dash-panel-empty">No sign-ups yet</div>'
            : users.map(u => {
                const name    = `${u.firstname || ''} ${u.lastname || ''}`.trim() || u.email;
                const initial = (u.firstname || u.email || '?').charAt(0).toUpperCase();
                const date    = new Date(u.created_at).toLocaleDateString('en-GB', { day:'numeric', month:'short' });
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

      // ── Latest collaborations ──────────────────────
      const actEl = document.getElementById('overviewActivity');
      if (actEl) {
        const collabs = data.recent_collabs || [];
        const statusCfg = {
          pending:   { label: 'Pending',   cls: 'collab-s--pending'   },
          active:    { label: 'Active',    cls: 'collab-s--active'    },
          completed: { label: 'Completed', cls: 'collab-s--completed' },
          cancelled: { label: 'Cancelled', cls: 'collab-s--cancelled' },
        };
        actEl.innerHTML = `<div class="dash-panel-title">Latest collaborations</div>` + (
          collabs.length === 0
            ? '<div class="dash-panel-empty">No collaborations yet</div>'
            : collabs.map(c => {
                const brand  = `${c.brand_firstname || ''} ${c.brand_lastname || ''}`.trim() || '';
                const brandLabel = c.brand_company ? `${brand} — ${c.brand_company}` : brand;
                const inf    = `${c.inf_firstname || ''} ${c.inf_lastname || ''}`.trim();
                const sc     = statusCfg[c.status] || statusCfg.pending;
                const date   = new Date(c.created_at).toLocaleDateString('en-GB', { day:'numeric', month:'short' });
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

  // ---- Messages ----
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
        <p class="dash-page-desc">Manage all connections between brands and influencers.</p>
      </div>

      <div class="dash-users-toolbar">
        <div id="collabFilters" class="dash-filter-pills" style="margin-bottom:0;flex:1"></div>
        <button class="dash-create-btn" onclick="AdminDashboard._openCreateCollab()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"
               stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          New collaboration
        </button>
      </div>

      <div id="collabTableWrap" style="margin-top:16px">
        <div class="dash-users-loading">Loading…</div>
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
      if (el) el.innerHTML = '<div class="dash-empty"><div class="dash-empty-title">Loading error</div></div>';
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
        { key:'all',       label:'All'       },
        { key:'pending',   label:'Pending'   },
        { key:'active',    label:'Active'    },
        { key:'completed', label:'Completed' },
        { key:'cancelled', label:'Cancelled' },
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
          <div class="dash-empty-title">No collaborations</div>
          <p class="dash-empty-text">Create your first collaboration by clicking the button.</p>
        </div>`;
      return;
    }

    const statusCfg = {
      pending:   { label:'Pending',   cls:'collab-s--pending'   },
      active:    { label:'Active',    cls:'collab-s--active'    },
      completed: { label:'Completed', cls:'collab-s--completed' },
      cancelled: { label:'Cancelled', cls:'collab-s--cancelled' },
    };

    const rows = list.map(c => {
      const s       = statusCfg[c.status] || statusCfg.pending;
      const brand   = `${c.brand_firstname || ''} ${c.brand_lastname || ''}`.trim();
      const inf     = `${c.inf_firstname || ''} ${c.inf_lastname || ''}`.trim();
      const budget  = c.budget ? `${parseFloat(c.budget).toLocaleString('en-GB')} €` : '—';
      const dates   = c.start_date
        ? `${new Date(c.start_date).toLocaleDateString('en-GB', {day:'numeric',month:'short'})}${c.end_date ? ' → ' + new Date(c.end_date).toLocaleDateString('en-GB', {day:'numeric',month:'short'}) : ''}`
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
              <th>Title</th>
              <th>Brand / Client</th>
              <th>Influencer</th>
              <th>Status</th>
              <th>Budget</th>
              <th>Period</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    `;
  },

  // ---- Collab detail / edit modal ----
  _openCollabDetail(collabId) {
    const c = this._collabsCache.find(x => parseInt(x.id) === collabId);
    if (!c) return;

    const statusCfg = {
      pending:   'Pending',
      active:    'Active',
      completed: 'Completed',
      cancelled: 'Cancelled',
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
              <span class="dash-modal-label">Title</span>
              <input class="dash-modal-input" id="cdTitle" value="${this._escU(c.title)}">
            </div>
            <div class="dash-modal-field">
              <span class="dash-modal-label">Brand / Client</span>
              <div class="dash-modal-val">${this._escU(brand)}</div>
            </div>
            <div class="dash-modal-field">
              <span class="dash-modal-label">Influencer</span>
              <div class="dash-modal-val">${this._escU(inf)}</div>
            </div>
            <div class="dash-modal-field">
              <span class="dash-modal-label">Status</span>
              <select class="dash-modal-input" id="cdStatus">${statusOpts}</select>
            </div>
            <div class="dash-modal-field">
              <span class="dash-modal-label">Budget (€)</span>
              <input class="dash-modal-input" id="cdBudget" type="number" min="0" step="0.01"
                     value="${c.budget || ''}">
            </div>
            <div class="dash-modal-field">
              <span class="dash-modal-label">Start date</span>
              <input class="dash-modal-input" id="cdStart" type="date" value="${c.start_date || ''}">
            </div>
            <div class="dash-modal-field">
              <span class="dash-modal-label">End date</span>
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
          <button class="dash-mfooter-delete" onclick="AdminDashboard._deleteCollab(${c.id})">Delete</button>
          <button class="dash-mfooter-board"
                  onclick="document.getElementById('collabDetailOverlay').remove(); AdminDashboard._openBoardFromCollab(${c.id})">
            📋 Campaign tracking
          </button>
          <button class="dash-mfooter-close"  onclick="document.getElementById('collabDetailOverlay').remove()">Cancel</button>
          <button class="dash-mfooter-submit" id="cdSaveBtn" onclick="AdminDashboard._saveCollab(${c.id}, this)">Save</button>
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
    btn.textContent = 'Saving…';
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
        btn.disabled = false; btn.textContent = 'Save';
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
      errEl.textContent   = 'Network error.';
      errEl.style.display = 'block';
      btn.disabled = false; btn.textContent = 'Save';
    }
  },

  async _deleteCollab(collabId) {
    const c    = this._collabsCache.find(x => parseInt(x.id) === collabId);
    const name = c?.title || `#${collabId}`;
    if (!confirm(`Delete collaboration "${name}"?\nThis action is irreversible.`)) return;

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
        alert(data.message || 'Error.');
      }
    } catch (_) { alert('Network error.'); }
  },

  // ---- Create collab modal ----
  async _openCreateCollab() {
    // Load users for selects
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
          <h3 class="dash-modal-title">New collaboration</h3>
          <button class="dash-modal-close" onclick="document.getElementById('createCollabOverlay').remove()">✕</button>
        </div>
        <div class="dash-modal-body">
          <div class="dash-modal-grid">
            <div class="dash-modal-field dash-modal-field--full">
              <span class="dash-modal-label">Title *</span>
              <input class="dash-modal-input" id="ccTitle" placeholder="E.g.: Summer campaign 2025">
            </div>
            <div class="dash-modal-field">
              <span class="dash-modal-label">Brand / Client *</span>
              <select class="dash-modal-input" id="ccBrand">
                <option value="">Select…</option>
                ${_opt(clients.length ? clients : users.filter(u => parseInt(u.is_active) === 1))}
              </select>
            </div>
            <div class="dash-modal-field">
              <span class="dash-modal-label">Influencer *</span>
              <select class="dash-modal-input" id="ccInfluencer">
                <option value="">Select…</option>
                ${_opt(influencers)}
              </select>
            </div>
            <div class="dash-modal-field">
              <span class="dash-modal-label">Budget (€)</span>
              <input class="dash-modal-input" id="ccBudget" type="number" min="0" step="0.01" placeholder="0.00">
            </div>
            <div class="dash-modal-field">
              <span class="dash-modal-label">Start date</span>
              <input class="dash-modal-input" id="ccStart" type="date">
            </div>
            <div class="dash-modal-field">
              <span class="dash-modal-label">End date</span>
              <input class="dash-modal-input" id="ccEnd" type="date">
            </div>
            <div class="dash-modal-field dash-modal-field--full">
              <span class="dash-modal-label">Description</span>
              <textarea class="dash-modal-input" id="ccDesc" rows="3" style="resize:vertical"
                        placeholder="Brief, objectives, deliverables…"></textarea>
            </div>
          </div>
          <div id="ccError" class="dash-modal-error" style="display:none"></div>
        </div>
        <div class="dash-modal-footer">
          <button class="dash-mfooter-close" onclick="document.getElementById('createCollabOverlay').remove()">Cancel</button>
          <button class="dash-mfooter-submit" onclick="AdminDashboard._submitCreateCollab(this)">Create</button>
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
    if (!title)   { errEl.textContent = 'Title is required.';            errEl.style.display = 'block'; return; }
    if (!brandId) { errEl.textContent = 'Please select a client.';       errEl.style.display = 'block'; return; }
    if (!infId)   { errEl.textContent = 'Please select an influencer.';  errEl.style.display = 'block'; return; }

    btn.disabled    = true;
    btn.textContent = 'Creating…';
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
        btn.disabled = false; btn.textContent = 'Create';
        return;
      }
      document.getElementById('createCollabOverlay')?.remove();
      this._collabsCache.unshift(data.collaboration);
      this._renderCollabs();
    } catch (_) {
      errEl.textContent   = 'Network error.';
      errEl.style.display = 'block';
      btn.disabled = false; btn.textContent = 'Create';
    }
  },

  // ---- Contracts ----
  _contrats() {
    setTimeout(() => AdminDashboard._loadContracts(), 0);
    return `
      <div class="dash-page-header">
        <h1 class="dash-page-title">Contracts</h1>
        <p class="dash-page-desc">Upload and manage PDF contracts to be signed by your clients.</p>
      </div>
      <div class="dash-users-toolbar">
        <div id="contractFilters" class="dash-filter-pills" style="margin-bottom:0;flex:1"></div>
        <button class="dash-create-btn" onclick="AdminDashboard._openUploadContract()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"
               stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          New contract
        </button>
      </div>
      <div id="contractTableWrap" style="margin-top:16px">
        <div class="dash-users-loading">Loading…</div>
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
      if (el) el.innerHTML = '<div class="dash-empty"><div class="dash-empty-title">Loading error</div></div>';
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
        { key:'all',     label:'All'     },
        { key:'pending', label:'Pending' },
        { key:'signed',  label:'Signed'  },
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
          <div class="dash-empty-title">No contracts</div>
          <p class="dash-empty-text">Click "New contract" to upload a PDF to be signed.</p>
        </div>`;
      return;
    }

    const statusCfg = {
      pending:  { label:'Pending',  cls:'contract-s--pending' },
      signed:   { label:'Signed',   cls:'contract-s--signed'  },
      rejected: { label:'Rejected', cls:'contract-s--rejected'},
    };

    const rows = list.map(c => {
      const s       = statusCfg[c.status] || statusCfg.pending;
      const client  = `${c.client_firstname||''} ${c.client_lastname||''}`.trim();
      const collab  = c.collab_title ? this._escU(c.collab_title) : '<span class="dash-tcell-muted">—</span>';
      const date    = new Date(c.created_at).toLocaleDateString('en-GB', {day:'numeric',month:'short',year:'numeric'});
      const email   = c.email_sent
        ? `<span class="contract-email-badge contract-email-badge--sent">✓ Email sent</span>`
        : `<span class="contract-email-badge">Email not sent</span>`;
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
              <a class="dash-icon-btn" title="Download original PDF"
                 href="api/contracts.php?action=download&id=${c.id}&type=unsigned" target="_blank">
                ${dlSvg} PDF
              </a>
              ${c.signed_path ? `
              <a class="dash-icon-btn dash-icon-btn--green" title="Download signed version"
                 href="api/contracts.php?action=download&id=${c.id}&type=signed" target="_blank">
                ${dlSvg} Signed
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
              <th>Title</th><th>Client</th><th>Collaboration</th>
              <th>Status</th><th>Notification</th><th>Date</th><th>Files</th>
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
    const statusCfg = { pending:'Pending', signed:'Signed', rejected:'Rejected' };
    const signed  = c.signed_at ? new Date(c.signed_at).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'}) : '—';

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
              <span class="dash-modal-label">Status</span>
              <div class="dash-modal-val">
                <span class="collab-status contract-s--${c.status}">${statusCfg[c.status]||c.status}</span>
              </div>
            </div>
            ${c.collab_title ? `
            <div class="dash-modal-field dash-modal-field--full">
              <span class="dash-modal-label">Linked collaboration</span>
              <div class="dash-modal-val">${this._escU(c.collab_title)}</div>
            </div>` : ''}
            ${c.description ? `
            <div class="dash-modal-field dash-modal-field--full">
              <span class="dash-modal-label">Description</span>
              <div class="dash-modal-val" style="white-space:pre-wrap">${this._escU(c.description)}</div>
            </div>` : ''}
            <div class="dash-modal-field">
              <span class="dash-modal-label">Signed on</span>
              <div class="dash-modal-val">${signed}</div>
            </div>
            <div class="dash-modal-field">
              <span class="dash-modal-label">Notification email</span>
              <div class="dash-modal-val">${parseInt(c.email_sent) ? '✓ Sent' : 'Not sent'}</div>
            </div>
          </div>
        </div>
        <div class="dash-modal-footer">
          <button class="dash-mfooter-delete" onclick="AdminDashboard._deleteContract(${c.id})">Delete</button>
          <a class="dash-mfooter-submit" style="text-decoration:none;display:inline-flex;align-items:center"
             href="api/contracts.php?action=download&id=${c.id}&type=unsigned" target="_blank">
            Download PDF
          </a>
          ${c.signed_path ? `
          <a class="dash-mfooter-submit" style="text-decoration:none;display:inline-flex;align-items:center;background:#22c55e"
             href="api/contracts.php?action=download&id=${c.id}&type=signed" target="_blank">
            Download signed
          </a>` : ''}
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
  },

  async _deleteContract(contractId) {
    const c = this._contractsCache.find(x => parseInt(x.id) === contractId);
    if (!confirm(`Delete contract "${c?.title||'#'+contractId}"?\nThis action also deletes the PDF files.`)) return;
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
      } else alert(data.message || 'Error.');
    } catch (_) { alert('Network error.'); }
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
          <h3 class="dash-modal-title">New contract</h3>
          <button class="dash-modal-close" onclick="document.getElementById('uploadContractOverlay').remove()">✕</button>
        </div>
        <div class="dash-modal-body">
          <div class="dash-modal-grid">
            <div class="dash-modal-field dash-modal-field--full">
              <span class="dash-modal-label">Title *</span>
              <input class="dash-modal-input" id="ucTitle" placeholder="E.g.: Summer campaign contract 2025">
            </div>
            <div class="dash-modal-field">
              <span class="dash-modal-label">Client *</span>
              <select class="dash-modal-input" id="ucClient">
                <option value="">Select…</option>${_opt(clients)}
              </select>
            </div>
            <div class="dash-modal-field">
              <span class="dash-modal-label">Linked collaboration</span>
              <select class="dash-modal-input" id="ucCollab">
                <option value="">None</option>${_collabOpt}
              </select>
            </div>
            <div class="dash-modal-field dash-modal-field--full">
              <span class="dash-modal-label">PDF file *</span>
              <label class="contract-file-label" id="ucFileLabel">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
                     stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                <span id="ucFileName">Choose a PDF file (max 15 MB)</span>
                <input type="file" id="ucFile" accept=".pdf" style="display:none"
                       onchange="document.getElementById('ucFileName').textContent = this.files[0]?.name || 'No file selected'">
              </label>
            </div>
            <div class="dash-modal-field dash-modal-field--full">
              <span class="dash-modal-label">Description / instructions</span>
              <textarea class="dash-modal-input" id="ucDesc" rows="2"
                        placeholder="Information for the client…" style="resize:vertical"></textarea>
            </div>
          </div>
          <div id="ucError" class="dash-modal-error" style="display:none"></div>
          <p style="font-size:.78rem;color:var(--muted);margin-top:10px">
            ✉️ The client will automatically receive an email notification.
          </p>
        </div>
        <div class="dash-modal-footer">
          <button class="dash-mfooter-close" onclick="document.getElementById('uploadContractOverlay').remove()">Cancel</button>
          <button class="dash-mfooter-submit" onclick="AdminDashboard._submitUploadContract(this)">Send</button>
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

    if (!title)    { errEl.textContent='Title is required.';         errEl.style.display='block'; return; }
    if (!clientId) { errEl.textContent='Please select a client.';    errEl.style.display='block'; return; }
    if (!file)     { errEl.textContent='A PDF file is required.';    errEl.style.display='block'; return; }

    btn.disabled = true; btn.textContent = 'Sending…';

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
        btn.disabled = false; btn.textContent = 'Send';
        return;
      }
      document.getElementById('uploadContractOverlay')?.remove();
      await this._loadContracts();
    } catch (_) {
      errEl.textContent   = 'Network error.';
      errEl.style.display = 'block';
      btn.disabled = false; btn.textContent = 'Send';
    }
  },

  // ---- Statistics ----
  _stats() {
    setTimeout(() => AdminDashboard._loadStats(), 0);
    const _skel = () => `
      <div class="dash-stat-card dash-stat-card--loading">
        <div class="dash-stat-num dash-skeleton"></div>
        <div class="dash-stat-label dash-skeleton" style="width:60%;height:12px"></div>
      </div>`;
    return `
      <div class="dash-page-header">
        <h1 class="dash-page-title">Platform statistics</h1>
        <p class="dash-page-desc">Global overview of users, collaborations and activity.</p>
      </div>

      <div class="stats-section-title">Users</div>
      <div class="dash-stats-grid" id="statsUsersGrid">
        ${[1,2,3,4].map(_skel).join('')}
      </div>

      <div class="stats-section-title" style="margin-top:28px">Collaborations</div>
      <div class="dash-stats-grid" id="statsCollabsGrid">
        ${[1,2,3,4].map(_skel).join('')}
      </div>

      <div class="stats-two-col" style="margin-top:28px">
        <div class="dash-overview-panel" id="statsRecentUsers">
          <div class="dash-panel-title">Latest sign-ups</div>
          <div class="dash-panel-loading">Loading…</div>
        </div>
        <div class="dash-overview-panel" id="statsRecentCollabs">
          <div class="dash-panel-title">Latest collaborations</div>
          <div class="dash-panel-loading">Loading…</div>
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
          { val: s.users_total,    label: 'Accounts created',      color: 'var(--primary)', sub: `${s.users_active} active` },
          { val: s.clients,        label: 'Active clients',         color: '#22c55e',        sub: `${s.admins} admin${s.admins > 1 ? 's' : ''}` },
          { val: s.new_this_week,  label: 'New this week',          color: '#f59e0b',        sub: null },
          { val: s.messages_unread,label: 'Unread messages',        color: '#ef4444',        sub: null },
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
          { val: s.collabs_active,    label: 'In progress',          color: '#22c55e',        sub: null },
          { val: s.collabs_pending,   label: 'Pending',              color: '#f59e0b',        sub: null },
          { val: s.collabs_completed, label: 'Completed',            color: 'var(--muted)',   sub: `${s.collabs_cancelled} cancelled` },
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
        recentUsersEl.innerHTML = `<div class="dash-panel-title">Latest sign-ups</div>` + (
          users.length === 0
            ? '<div class="dash-panel-empty">No sign-ups yet</div>'
            : users.map(u => {
                const name    = `${u.firstname || ''} ${u.lastname || ''}`.trim() || u.email;
                const initial = (u.firstname || u.email || '?').charAt(0).toUpperCase();
                const date    = new Date(u.created_at).toLocaleDateString('en-GB', { day:'numeric', month:'short' });
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
          pending:   { label: 'Pending',   cls: 'collab-s--pending'   },
          active:    { label: 'Active',    cls: 'collab-s--active'    },
          completed: { label: 'Completed', cls: 'collab-s--completed' },
          cancelled: { label: 'Cancelled', cls: 'collab-s--cancelled' },
        };
        recentCollabsEl.innerHTML = `<div class="dash-panel-title">Latest collaborations</div>` + (
          collabs.length === 0
            ? '<div class="dash-panel-empty">No collaborations yet</div>'
            : collabs.map(c => {
                const brand  = `${c.brand_firstname || ''} ${c.brand_lastname || ''}`.trim();
                const inf    = `${c.inf_firstname   || ''} ${c.inf_lastname   || ''}`.trim();
                const sc     = statusCfg[c.status] || statusCfg.pending;
                const date   = new Date(c.created_at).toLocaleDateString('en-GB', { day:'numeric', month:'short' });
                const budget = c.budget ? `${Number(c.budget).toLocaleString('en-GB')} €` : '';
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

  // ---- Calendar ----
  _calendrier() {
    setTimeout(() => CalendarController.init(true), 0);
    return CalendarController.renderCalendar(true);
  },

  // ---- User management ----
  _users() {
    setTimeout(() => AdminDashboard._loadUsers(), 0);
    return `
      <div class="dash-page-header">
        <h1 class="dash-page-title">User management</h1>
        <p class="dash-page-desc">View and manage all accounts registered on the platform.</p>
      </div>

      <div class="dash-users-toolbar">
        <div class="dash-users-search-wrap">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
               stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input type="text" id="usersSearch" class="dash-users-search"
                 placeholder="Search by name or email…"
                 oninput="AdminDashboard._filterUsers(this.value)">
        </div>
        <span id="usersCount" class="dash-users-count"></span>
        <button class="dash-create-btn" onclick="AdminDashboard._openCreateUser()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"
               stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          New account
        </button>
      </div>

      <div id="usersFilters" class="dash-filter-pills"></div>

      <div id="usersTableWrap">
        <div class="dash-users-loading">Loading…</div>
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
      if (el) el.innerHTML = '<div class="dash-empty"><div class="dash-empty-title">Loading error</div></div>';
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
      list = list.filter(u => parseInt(u.is_active) === 0 && parseInt(u.is_invited) === 0);
    } else if (this._usersFilter === 'invited') {
      list = list.filter(u => parseInt(u.is_invited) === 1);
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
      invited:  all.filter(u => parseInt(u.is_invited) === 1).length,
      inactive: all.filter(u => parseInt(u.is_active) === 0 && parseInt(u.is_invited) === 0).length,
    };
    const pills = [
      { key: 'all',      label: 'All'       },
      { key: 'admin',    label: 'Admin'     },
      { key: 'client',   label: 'Client'    },
      { key: 'invited',  label: '⏳ Invited' },
      { key: 'inactive', label: 'Suspended' },
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
    if (count) count.textContent = `${users.length} user${users.length !== 1 ? 's' : ''}`;

    if (users.length === 0) {
      wrap.innerHTML = `
        <div class="dash-empty" style="padding-top:48px">
          <div class="dash-empty-title">No results</div>
          <p class="dash-empty-text">No users match your search.</p>
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
      const name      = `${u.firstname || ''} ${u.lastname || ''}`.trim();
      const initial   = (u.firstname || u.email || '?').charAt(0).toUpperCase();
      const active    = parseInt(u.is_active) === 1;
      const invited   = parseInt(u.is_invited) === 1;
      const pkCount   = parseInt(u.passkey_count) || 0;
      const joined    = u.created_at ? new Date(u.created_at).toLocaleDateString('en-GB') : '—';
      const lastLog   = u.last_login
        ? new Date(u.last_login).toLocaleDateString('en-GB', { day:'2-digit', month:'2-digit', year:'2-digit' })
        : 'Never';

      const statusBadge = invited
        ? `<span class="dash-status-badge dash-status-badge--pending">⏳ Invited</span>`
        : active
          ? `<span class="dash-status-badge dash-status-badge--active">Active</span>`
          : `<span class="dash-status-badge dash-status-badge--inactive">Suspended</span>`;

      const actionBtn = invited
        ? `<button class="dash-toggle-btn dash-toggle-btn--activate"
                   onclick="event.stopPropagation();AdminDashboard._resendInvite(${u.id}, this)">Resend</button>`
        : `<button class="dash-toggle-btn ${active ? 'dash-toggle-btn--suspend' : 'dash-toggle-btn--activate'}"
                   onclick="event.stopPropagation();AdminDashboard._toggleUser(${u.id}, ${active ? 1 : 0}, this)">
             ${active ? 'Suspend' : 'Activate'}
           </button>`;

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
              <option value="influencer" ${u.role === 'influencer' ? 'selected' : ''}>Influencer</option>
              <option value="brand"      ${u.role === 'brand'      ? 'selected' : ''}>Brand</option>
              <option value="admin"      ${u.role === 'admin'      ? 'selected' : ''}>Admin</option>
            </select>
          </td>
          <td>${statusBadge}</td>
          <td class="dash-tcell-muted" style="text-align:center">
            ${pkCount > 0
              ? `<span title="${pkCount} passkey${pkCount > 1 ? 's' : ''}" style="color:var(--primary);font-weight:600">🔑 ${pkCount}</span>`
              : `<span style="color:var(--muted)">—</span>`}
          </td>
          <td class="dash-tcell-muted">${lastLog}</td>
          <td class="dash-tcell-muted">${joined}</td>
          <td onclick="event.stopPropagation()">${actionBtn}</td>
        </tr>
      `;
    }).join('');

    wrap.innerHTML = `
      <div class="dash-table-wrap">
        <table class="dash-table">
          <thead>
            <tr>
              <th class="dash-th-sortable" onclick="AdminDashboard._setUserSort('name')">
                User ${_sortIcon('name')}
              </th>
              <th>Role</th>
              <th>Status</th>
              <th style="text-align:center">Passkeys</th>
              <th class="dash-th-sortable" onclick="AdminDashboard._setUserSort('last_login')">
                Last login ${_sortIcon('last_login')}
              </th>
              <th class="dash-th-sortable" onclick="AdminDashboard._setUserSort('created_at')">
                Joined ${_sortIcon('created_at')}
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
      btn.textContent = currentActive === 1 ? 'Suspend' : 'Activate';
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

  // ---- User detail modal ----
  _openUserDetail(userId) {
    const u = this._usersCache.find(x => parseInt(x.id) === userId);
    if (!u) return;

    const me      = UserModel.getUser();
    const isSelf  = parseInt(u.id) === me?.id;
    const active  = parseInt(u.is_active) === 1;
    const invited = parseInt(u.is_invited) === 1;
    const pkCount = parseInt(u.passkey_count) || 0;
    const name    = `${u.firstname || ''} ${u.lastname || ''}`.trim() || '—';
    const joined  = u.created_at  ? new Date(u.created_at).toLocaleDateString('en-GB',  { day:'numeric', month:'long', year:'numeric' }) : '—';
    const lastLog = u.last_login  ? new Date(u.last_login).toLocaleDateString('en-GB',  { day:'numeric', month:'long', year:'numeric' }) : 'Never';

    const statusBadge = invited
      ? `<span class="dash-status-badge dash-status-badge--pending">⏳ Invitation pending</span>`
      : active
        ? `<span class="dash-status-badge dash-status-badge--active">Active</span>`
        : `<span class="dash-status-badge dash-status-badge--inactive">Suspended</span>`;

    const inviteBanner = invited ? `
      <div style="background:#fffbeb;border:1px solid #fcd34d;border-radius:10px;padding:14px 16px;margin-bottom:16px;display:flex;align-items:center;gap:14px">
        <svg viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="width:22px;height:22px;flex-shrink:0">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
          <polyline points="22,6 12,13 2,6"/>
        </svg>
        <div style="flex:1;min-width:0">
          <div style="font-size:.84rem;font-weight:600;color:#92400e">Invitation not yet accepted</div>
          <div style="font-size:.78rem;color:#a16207;margin-top:2px">The client hasn't set up their passkey yet.</div>
        </div>
        <button id="resendInviteBtn" class="dash-mfooter-submit"
                style="padding:8px 14px;font-size:.82rem;flex-shrink:0"
                onclick="AdminDashboard._resendInvite(${u.id}, this)">
          Resend email
        </button>
      </div>` : '';

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
              ${u.role === 'admin' ? 'Admin' : u.role === 'client' ? 'Client' : u.role}
            </span>
          </div>
          <button class="dash-modal-close" onclick="document.getElementById('userDetailOverlay').remove()">✕</button>
        </div>
        <div class="dash-modal-body">
          ${inviteBanner}
          <div class="dash-modal-grid">
            <div class="dash-modal-field">
              <span class="dash-modal-label">First name</span>
              <span class="dash-modal-val">${this._escU(u.firstname) || '—'}</span>
            </div>
            <div class="dash-modal-field">
              <span class="dash-modal-label">Last name</span>
              <span class="dash-modal-val">${this._escU(u.lastname) || '—'}</span>
            </div>
            <div class="dash-modal-field dash-modal-field--full">
              <span class="dash-modal-label">Email</span>
              <span class="dash-modal-val">${this._escU(u.email) || '—'}</span>
            </div>
            <div class="dash-modal-field">
              <span class="dash-modal-label">Phone</span>
              <span class="dash-modal-val">${this._escU(u.phone) || '—'}</span>
            </div>
            <div class="dash-modal-field">
              <span class="dash-modal-label">Company</span>
              <span class="dash-modal-val">${this._escU(u.company) || '—'}</span>
            </div>
            <div class="dash-modal-field">
              <span class="dash-modal-label">Status</span>
              ${statusBadge}
            </div>
            <div class="dash-modal-field">
              <span class="dash-modal-label">Passkeys</span>
              <span class="dash-modal-val">${pkCount > 0 ? `🔑 ${pkCount} passkey${pkCount > 1 ? 's' : ''}` : 'None yet'}</span>
            </div>
            <div class="dash-modal-field">
              <span class="dash-modal-label">Joined on</span>
              <span class="dash-modal-val">${joined}</span>
            </div>
            <div class="dash-modal-field dash-modal-field--full">
              <span class="dash-modal-label">Last login</span>
              <span class="dash-modal-val">${lastLog}</span>
            </div>
          </div>
        </div>
        <div class="dash-modal-footer">
          <button class="dash-mfooter-close" onclick="document.getElementById('userDetailOverlay').remove()">Close</button>
          ${!isSelf ? `
            <button class="dash-mfooter-delete" onclick="AdminDashboard._deleteUser(${u.id})">
              Delete account
            </button>` : `<span class="dash-modal-self-note">Your own account</span>`}
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
  },

  // ---- Create account modal ----
  _openCreateUser() {
    const overlay = document.createElement('div');
    overlay.className = 'dash-modal-overlay';
    overlay.id        = 'createUserOverlay';
    overlay.innerHTML = `
      <div class="dash-modal">
        <div class="dash-modal-header dash-modal-header--simple">
          <h3 class="dash-modal-title">Invite a new user</h3>
          <button class="dash-modal-close" onclick="document.getElementById('createUserOverlay').remove()">✕</button>
        </div>
        <div class="dash-modal-body">
          <p style="font-size:.83rem;color:var(--muted);margin:0 0 16px;line-height:1.55">
            An invitation email will be sent. The user will set up their own passkey on first login.
          </p>
          <div class="dash-modal-grid">
            <div class="dash-modal-field">
              <span class="dash-modal-label">First name *</span>
              <input class="dash-modal-input" id="cuFirstname" placeholder="John">
            </div>
            <div class="dash-modal-field">
              <span class="dash-modal-label">Last name *</span>
              <input class="dash-modal-input" id="cuLastname" placeholder="Smith">
            </div>
            <div class="dash-modal-field dash-modal-field--full">
              <span class="dash-modal-label">Email *</span>
              <input class="dash-modal-input" id="cuEmail" type="email" placeholder="john@example.com">
            </div>
            <div class="dash-modal-field">
              <span class="dash-modal-label">Phone</span>
              <input class="dash-modal-input" id="cuPhone" placeholder="+1 555 000 0000">
            </div>
            <div class="dash-modal-field">
              <span class="dash-modal-label">Company</span>
              <input class="dash-modal-input" id="cuCompany" placeholder="Company name">
            </div>
            <div class="dash-modal-field dash-modal-field--full">
              <span class="dash-modal-label">Role</span>
              <select class="dash-modal-input" id="cuRole">
                <option value="client" selected>Client</option>
                <option value="influencer">Influencer</option>
                <option value="brand">Brand</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <div id="cuError" class="dash-modal-error" style="display:none"></div>
        </div>
        <div class="dash-modal-footer">
          <button class="dash-mfooter-close" onclick="document.getElementById('createUserOverlay').remove()">Cancel</button>
          <button class="dash-mfooter-submit" id="cuSubmitBtn" onclick="AdminDashboard._submitCreateUser(this)">
            Send invitation
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
    document.getElementById('cuFirstname')?.focus();
  },

  async _submitCreateUser(btn) {
    const get   = id => document.getElementById(id)?.value?.trim() || '';
    const errEl = document.getElementById('cuError');
    errEl.style.display = 'none';

    const payload = {
      firstname: get('cuFirstname'),
      lastname:  get('cuLastname'),
      email:     get('cuEmail'),
      phone:     get('cuPhone'),
      company:   get('cuCompany'),
      role:      get('cuRole'),
    };

    btn.disabled    = true;
    btn.textContent = 'Sending…';
    try {
      const res  = await fetch('api/users.php?action=create', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.success) {
        errEl.textContent   = data.message;
        errEl.style.display = 'block';
        btn.disabled        = false;
        btn.textContent     = 'Send invitation';
        return;
      }
      document.getElementById('createUserOverlay')?.remove();
      this._usersCache.unshift(data.user);
      this._usersSort = { col: 'created_at', dir: 'desc' };
      this._applyFilters();
      this._toast(`Invitation sent to ${payload.email}`);
    } catch (_) {
      errEl.textContent   = 'Network error. Please try again.';
      errEl.style.display = 'block';
      btn.disabled        = false;
      btn.textContent     = 'Send invitation';
    }
  },

  async _resendInvite(userId, btn) {
    btn.disabled    = true;
    btn.textContent = 'Sending…';
    try {
      const res  = await fetch('api/users.php?action=resend_invite', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ user_id: userId }),
      });
      const data = await res.json();
      if (data.success) {
        const u = this._usersCache.find(x => parseInt(x.id) === userId);
        this._toast(`Invitation resent to ${u?.email || 'the user'}`);
        btn.textContent = 'Sent ✓';
        setTimeout(() => { btn.textContent = 'Resend email'; btn.disabled = false; }, 3000);
      } else {
        this._toast(data.message || 'Error sending invitation.', 'error');
        btn.textContent = 'Resend email';
        btn.disabled    = false;
      }
    } catch (_) {
      this._toast('Network error. Please try again.', 'error');
      btn.textContent = 'Resend email';
      btn.disabled    = false;
    }
  },

  // ---- Delete account ----
  async _deleteUser(userId) {
    const u    = this._usersCache.find(x => parseInt(x.id) === userId);
    const name = u ? `${u.firstname} ${u.lastname}`.trim() : `#${userId}`;
    if (!confirm(`Permanently delete the account of ${name}?\nThis action is irreversible.`)) return;

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
        alert(data.message || 'Error while deleting.');
      }
    } catch (_) {
      alert('Network error. Please try again.');
    }
  },

  _escU(str) {
    if (!str) return '';
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  },

  _toast(msg, type = 'success') {
    const existing = document.getElementById('adminToast');
    if (existing) existing.remove();
    const t = document.createElement('div');
    t.id        = 'adminToast';
    t.innerHTML = `
      <span style="flex-shrink:0;font-size:1rem">${type === 'success' ? '✅' : '❌'}</span>
      <span style="font-size:.86rem;font-weight:500">${msg}</span>
    `;
    Object.assign(t.style, {
      position: 'fixed', bottom: '28px', left: '50%', transform: 'translateX(-50%) translateY(12px)',
      background: type === 'success' ? '#f0fdf4' : '#fef2f2',
      color:      type === 'success' ? '#166534' : '#991b1b',
      border:     `1px solid ${type === 'success' ? '#bbf7d0' : '#fecaca'}`,
      borderRadius: '10px', padding: '12px 20px', boxShadow: '0 4px 20px rgba(0,0,0,.12)',
      display: 'flex', alignItems: 'center', gap: '10px',
      zIndex: '9999', opacity: '0', transition: 'opacity .2s, transform .2s',
    });
    document.body.appendChild(t);
    requestAnimationFrame(() => { t.style.opacity = '1'; t.style.transform = 'translateX(-50%) translateY(0)'; });
    setTimeout(() => {
      t.style.opacity = '0'; t.style.transform = 'translateX(-50%) translateY(12px)';
      setTimeout(() => t.remove(), 200);
    }, 4000);
  },

  // ---- Marketing agent (AI) ----
  _agent() {
    setTimeout(() => AgentController.init(), 0);
    const chips = AgentController.QUICK_ACTIONS.map(a =>
      `<button class="agent-chip" onclick="AgentController.quickAction('${a.id}')">${a.label}</button>`
    ).join('');

    return `
      <div class="dash-page-header">
        <h1 class="dash-page-title">Marketing agent</h1>
        <p class="dash-page-desc">Votre assistant IA interne — analyse de marques, prospection outbound, scripts créatifs et assistance quotidienne Influmatch. Tapez <code>/clear</code> pour réinitialiser.</p>
      </div>

      <div class="agent-wrap">
        <div class="agent-chips">${chips}</div>

        <div class="agent-chat-box">
          <div class="agent-messages" id="agentMessages"></div>

          <div class="agent-input-row">
            <textarea id="agentInput" class="agent-input"
                      placeholder="Décrivez votre demande… ou tapez /clear pour réinitialiser" rows="1"
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
            Reset conversation
          </button>
        </div>
      </div>
    `;
  },

  // ---- My account ----
  _compte() {
    const user = UserModel.getUser();
    if (!user) return '';

    return `
      <div class="dash-page-header">
        <h1 class="dash-page-title">My account</h1>
        <p class="dash-page-desc">Your personal information and account status.</p>
      </div>

      <div class="dash-account-wrap">
        <div class="dash-account-grid">

          <div class="dash-field">
            <span class="dash-field-label">First name</span>
            <div class="dash-field-value">${user.firstname || '—'}</div>
          </div>
          <div class="dash-field">
            <span class="dash-field-label">Last name</span>
            <div class="dash-field-value">${user.lastname || '—'}</div>
          </div>

          <div class="dash-field dash-field--full">
            <span class="dash-field-label">Email address</span>
            <div class="dash-field-value">${user.email || '—'}</div>
          </div>

          <div class="dash-field">
            <span class="dash-field-label">Role</span>
            <div class="dash-field-value" style="text-transform:capitalize">${user.role || '—'}</div>
          </div>
          <div class="dash-field">
            <span class="dash-field-label">Status</span>
            <div style="margin-top:2px"><span class="dash-active-badge">Active account</span></div>
          </div>

        </div>

        <!-- Editable information -->
        <div class="dash-account-edit-section" style="margin-top:24px">
          <div class="dash-account-edit-title">Editable information</div>
          <div class="dash-account-edit-grid">
            <input class="dash-edit-input" id="adminEditPhone"   type="tel"  placeholder="Phone"   value="${this._escU(user.phone   || '')}">
            <input class="dash-edit-input" id="adminEditCompany" type="text" placeholder="Company" value="${this._escU(user.company || '')}">
          </div>
          <div id="adminProfileMsg" style="font-size:.82rem;margin-bottom:10px;display:none"></div>
          <button class="dash-save-btn" onclick="AdminDashboard._saveCompte(this)">Save</button>
        </div>

        <!-- Change password -->
        <div class="dash-account-edit-section" style="margin-top:16px">
          <div class="dash-account-edit-title">Change password</div>
          <div class="dash-account-edit-grid" style="grid-template-columns:1fr">
            <input class="dash-edit-input" id="adminPwCurrent" type="password" placeholder="Current password">
            <input class="dash-edit-input" id="adminPwNew"     type="password" placeholder="New password (min. 8 characters)">
            <input class="dash-edit-input" id="adminPwConfirm" type="password" placeholder="Confirm new password">
          </div>
          <div id="adminPwMsg" style="font-size:.82rem;margin-bottom:10px;display:none"></div>
          <button class="dash-save-btn" onclick="AdminDashboard._changePassword(this)">Update</button>
        </div>
      </div>
    `;
  },

  async _saveCompte(btn) {
    const phone   = document.getElementById('adminEditPhone')?.value.trim()   || '';
    const company = document.getElementById('adminEditCompany')?.value.trim() || '';
    const msg     = document.getElementById('adminProfileMsg');

    btn.disabled = true; btn.textContent = 'Saving…';
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
        msg.textContent   = data.message || (data.success ? 'Profile updated.' : 'Error.');
        setTimeout(() => { msg.style.display = 'none'; }, 3000);
      }
      if (data.success) {
        const u = UserModel.getUser();
        if (u) { u.phone = phone; u.company = company; }
      }
    } catch (_) {
      if (msg) { msg.style.display='block'; msg.style.color='#dc2626'; msg.textContent='Network error.'; }
    } finally {
      btn.disabled = false; btn.textContent = 'Save';
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

    if (!current || !newPw || !confirm) return show('Please fill in all fields.', false);
    if (newPw !== confirm)              return show('Passwords do not match.', false);

    btn.disabled = true; btn.textContent = 'Updating…';
    try {
      const res  = await fetch('api/users.php?action=change_password', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ current_password: current, new_password: newPw }),
      });
      const data = await res.json();
      show(data.message || (data.success ? 'Password updated.' : 'Error.'), data.success);
      if (data.success) {
        document.getElementById('adminPwCurrent').value = '';
        document.getElementById('adminPwNew').value     = '';
        document.getElementById('adminPwConfirm').value = '';
        setTimeout(() => { if (msg) msg.style.display = 'none'; }, 3000);
      }
    } catch (_) {
      show('Network error.', false);
    } finally {
      btn.disabled = false; btn.textContent = 'Update';
    }
  }

};
