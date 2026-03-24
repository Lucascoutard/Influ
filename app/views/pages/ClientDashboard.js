/* ===================================================
   APP/VIEWS/PAGES/CLIENTDASHBOARD.JS
   Client space: fixed sidebar + dynamic content
   Pages: messages · contracts · statistics · account
   =================================================== */

const ClientDashboard = {

  _page: 'accueil',

  render(page = null) {
    if (page) this._page = page;
    setTimeout(() => ClientDashboard._refreshUnreadBadge(),   300);
    setTimeout(() => ClientDashboard._refreshContractBadge(), 400);
    setTimeout(() => TourController.maybeStart(), 800);
    const user   = UserModel.getUser();
    const name   = user ? `${user.firstname} ${user.lastname}` : '';
    const initial = user ? (user.firstname || 'U').charAt(0).toUpperCase() : '';

    return `
      ${this._renderDashHeader(initial, user)}
      ${MobileNav.render()}

      <div class="dash-sidebar-overlay" id="dashSidebarOverlay"
           onclick="ClientDashboard._toggleSidebar()"></div>

      <div class="dashboard-layout">

        <!-- ====== SIDEBAR ====== -->
        <aside class="dash-sidebar">

          <div class="dash-user-card">
            <div class="dash-user-initial">${initial}</div>
            <div class="dash-user-details">
              <div class="dash-user-name">${name}</div>
              <span class="dash-user-badge">${user && user.role === 'influencer' ? 'Influencer' : 'Brand'}</span>
            </div>
          </div>

          <nav class="dash-nav">
            <div class="dash-nav-section-label">My space</div>

            ${this._item('accueil', 'Home',
              `<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>`
            )}
            ${this._item('discussions', 'My messages',
              `<path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>`
            )}
            ${this._item('collaborations', 'My collaborations',
              `<path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>`
            )}
            ${this._item('contrats', 'My contracts',
              `<path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/>`
            )}
            ${this._item('stats', 'My statistics',
              `<path d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"/>`
            )}
            ${this._item('calendrier', 'Calendar',
              `<path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>`
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

  // ---- Dashboard minimal header (replaces regular Header) ----
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

          <!-- Right side: hamburger (mobile) + avatar -->
          <div class="dash-hdr-right">
            <button class="dash-hdr-hamburger" onclick="ClientDashboard._toggleSidebar()" aria-label="Menu">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                   stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 12h18M3 6h18M3 18h18"/>
              </svg>
            </button>
            <div class="dash-hdr-avatar" title="${name}">${initial}</div>
          </div>

        </nav>
      </header>
    `;
  },

  // ---- Sidebar item helper ----
  _item(page, label, svgPath) {
    const active = this._page === page;
    return `
      <div class="dash-nav-item ${active ? 'active' : ''}"
           id="navItem_${page}"
           data-page="${page}"
           onclick="ClientDashboard.switchPage('${page}')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"
             stroke-linecap="round" stroke-linejoin="round">
          ${svgPath}
        </svg>
        ${label}
        <span class="dash-nav-badge" id="navBadge_${page}" style="display:none"></span>
      </div>
    `;
  },

  // ---- Switch page (called from sidebar clicks) ----
  switchPage(page) {
    // Stop messaging if leaving discussions
    if (this._page === 'discussions') MessagesController.destroy();

    this._page = page;

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

    if (page === 'discussions') ClientDashboard._setBadge('discussions', 0);
    if (page === 'contrats')    ClientDashboard._setBadge('contrats', 0);

    // Close mobile sidebar after navigation
    const sidebar = document.querySelector('.dash-sidebar');
    const overlay = document.getElementById('dashSidebarOverlay');
    if (sidebar) sidebar.classList.remove('dash-sidebar--open');
    if (overlay) overlay.classList.remove('active');
  },

  async _refreshUnreadBadge() {
    try {
      const res   = await fetch('api/messages.php?action=conversations');
      const data  = await res.json();
      const convs = data.conversations || [];
      const n     = convs.reduce((sum, c) => sum + (parseInt(c.unread_count) || 0), 0);
      ClientDashboard._setBadge('discussions', this._page === 'discussions' ? 0 : n);
    } catch (_) {}
  },

  async _refreshContractBadge() {
    try {
      const res  = await fetch('api/contracts.php?action=my_contracts');
      const data = await res.json();
      const n    = (data.contracts || []).filter(c => c.status === 'pending').length;
      ClientDashboard._setBadge('contrats', this._page === 'contrats' ? 0 : n);
    } catch (_) {}
  },

  _toggleSidebar() {
    const sidebar = document.querySelector('.dash-sidebar');
    const overlay = document.getElementById('dashSidebarOverlay');
    const isOpen  = sidebar?.classList.toggle('dash-sidebar--open');
    if (overlay) overlay.classList.toggle('active', isOpen);
  },

  _setBadge(page, count) {
    const badge = document.getElementById(`navBadge_${page}`);
    if (!badge) return;
    if (count > 0) {
      badge.textContent = count > 99 ? '99+' : count;
      badge.style.display = '';
    } else {
      badge.style.display = 'none';
    }
  },

  // ---- Page router ----
  _page_render(page) {
    switch (page) {
      case 'accueil':        return this._accueil();
      case 'discussions':    return this._discussions();
      case 'collaborations': return this._collaborations();
      case 'contrats':       return this._contrats();
      case 'stats':          return this._stats();
      case 'calendrier':     return this._calendrier();
      case 'compte':         return this._compte();
      default:               return this._accueil();
    }
  },

  // ================================================================
  //  PAGES
  // ================================================================

  // ---- Home ----
  _accueil() {
    const user      = UserModel.getUser();
    const firstname = user ? user.firstname : '';
    const hour      = new Date().getHours();
    const greeting  = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    const today     = new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' });
    const todayStr  = today.charAt(0).toUpperCase() + today.slice(1);
    setTimeout(() => ClientDashboard._loadAccueil(), 0);

    const sk = `
      <div class="ac-kpi ac-kpi--loading">
        <div class="ac-kpi-top">
          <div class="dash-skeleton" style="width:40px;height:40px;border-radius:10px"></div>
        </div>
        <div class="dash-skeleton" style="height:28px;width:40px;margin-bottom:7px;border-radius:6px"></div>
        <div class="dash-skeleton" style="height:11px;width:75%;border-radius:4px"></div>
      </div>`;

    const arrowSvg = `<svg class="ac-kpi-caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`;

    return `
      <div class="ac-hero">
        <div class="ac-hero-glow"></div>
        <div class="ac-hero-content">
          <div class="ac-hero-left">
            <div class="ac-greeting">${greeting}, <strong>${firstname}</strong> 👋</div>
            <div class="ac-date">${todayStr}</div>
          </div>
          <div class="ac-hero-actions">
            <button class="ac-action-btn" onclick="ClientDashboard.switchPage('collaborations')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              Collabs
            </button>
            <button class="ac-action-btn" onclick="ClientDashboard.switchPage('contrats')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/>
              </svg>
              Contracts
            </button>
            <button class="ac-action-btn" onclick="ClientDashboard.switchPage('discussions')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
              </svg>
              Messages
            </button>
          </div>
        </div>
      </div>

      <div class="ac-kpis" id="accueilKpis">${sk}${sk}${sk}</div>
      <div id="accueilTodo"></div>
      <div id="accueilBody"></div>
    `;
  },

  async _loadAccueil() {
    const esc = s => String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    const arrowSvg = `<svg class="ac-kpi-caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`;

    try {
      const [collabsRes, contractsRes, convRes, tasksRes] = await Promise.all([
        fetch('api/collaborations.php?action=my_collabs'),
        fetch('api/contracts.php?action=my_contracts'),
        fetch('api/messages.php?action=conversations'),
        fetch('api/tasks.php?action=my_tasks'),
      ]);
      const collabsData   = await collabsRes.json();
      const contractsData = await contractsRes.json();
      const convData      = await convRes.json();
      const tasksData     = await tasksRes.json();

      const collabs   = collabsData.collaborations || [];
      const contracts = contractsData.contracts    || [];
      const convs     = convData.conversations     || [];
      const tasks     = tasksData.tasks            || [];

      const activeCollabs    = collabs.filter(c => c.status === 'active').length;
      const pendingContracts = contracts.filter(c => c.status === 'pending').length;
      const unreadMsgs       = convs.reduce((sum, c) => sum + (parseInt(c.unread_count) || 0), 0);

      // ── KPI cards ─────────────────────────────────────────────
      const kpisEl = document.getElementById('accueilKpis');
      if (kpisEl) {
        kpisEl.innerHTML = `
          <div class="ac-kpi" onclick="ClientDashboard.switchPage('collaborations')">
            <div class="ac-kpi-top">
              <div class="ac-kpi-icon ac-kpi-icon--purple">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </div>
              ${arrowSvg}
            </div>
            <div class="ac-kpi-num">${activeCollabs}</div>
            <div class="ac-kpi-label">Active collaboration${activeCollabs !== 1 ? 's' : ''}</div>
          </div>

          <div class="ac-kpi" onclick="ClientDashboard.switchPage('contrats')">
            <div class="ac-kpi-top">
              <div class="ac-kpi-icon ${pendingContracts > 0 ? 'ac-kpi-icon--amber' : 'ac-kpi-icon--purple'}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/>
                </svg>
              </div>
              ${arrowSvg}
            </div>
            <div class="ac-kpi-num ${pendingContracts > 0 ? 'ac-kpi-num--alert' : ''}">${pendingContracts}</div>
            <div class="ac-kpi-label">Contract${pendingContracts !== 1 ? 's' : ''} to sign</div>
          </div>

          <div class="ac-kpi" onclick="ClientDashboard.switchPage('discussions')">
            <div class="ac-kpi-top">
              <div class="ac-kpi-icon ${unreadMsgs > 0 ? 'ac-kpi-icon--red' : 'ac-kpi-icon--purple'}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                </svg>
              </div>
              ${arrowSvg}
            </div>
            <div class="ac-kpi-num ${unreadMsgs > 0 ? 'ac-kpi-num--urgent' : ''}">${unreadMsgs}</div>
            <div class="ac-kpi-label">Unread message${unreadMsgs !== 1 ? 's' : ''}</div>
          </div>
        `;
      }

      // ── To-do block ───────────────────────────────────────────
      const todoEl = document.getElementById('accueilTodo');
      if (todoEl) {
        const isInfluencer = UserModel.getRole() === 'influencer';
        if (tasks.length > 0) {
          const statusLabel = { todo: 'A faire', in_progress: 'En cours' };
          const statusCls   = { todo: 'todo-s--todo', in_progress: 'todo-s--progress' };
          todoEl.innerHTML = `
            <div class="ac-todo-block">
              <div class="ac-todo-header">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="width:16px;height:16px;color:var(--primary)"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
                <span>To-do <span class="ac-todo-count">${tasks.length}</span></span>
              </div>
              <div class="ac-todo-list">
                ${tasks.map(t => {
                  const due    = t.due_date ? new Date(t.due_date) : null;
                  const isLate = due && due < new Date();
                  const dueStr = due ? due.toLocaleDateString('fr-FR', { day:'numeric', month:'short' }) : null;
                  const cls    = statusCls[t.status] || 'todo-s--todo';
                  const lbl    = statusLabel[t.status] || t.status;
                  return '<div class="ac-todo-item" onclick="ClientDashboard.switchPage(\'collaborations\')">'
                    + '<div class="ac-todo-dot ' + cls + '"></div>'
                    + '<div class="ac-todo-info">'
                    +   '<div class="ac-todo-title">' + esc(t.title) + '</div>'
                    +   '<div class="ac-todo-meta">' + esc(t.collab_title) + (t.platform ? ' &middot; ' + esc(t.platform) : '') + '</div>'
                    + '</div>'
                    + '<div class="ac-todo-right">'
                    +   (dueStr ? '<span class="ac-todo-due' + (isLate ? ' ac-todo-due--late' : '') + '">' + dueStr + '</span>' : '')
                    +   '<span class="ac-todo-status">' + lbl + '</span>'
                    + '</div>'
                    + '</div>';
                }).join('')}
              </div>
            </div>
          `;
        } else if (isInfluencer) {
          todoEl.innerHTML = `
            <div class="ac-todo-block ac-todo-block--empty">
              <div class="ac-todo-header">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="width:16px;height:16px;color:var(--primary)"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
                <span>To-do</span>
              </div>
              <div class="ac-todo-empty">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="width:28px;height:28px;color:var(--muted)"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
                <p>Aucune tâche en attente — l'équipe Influmatch t'en assignera bientôt.</p>
              </div>
            </div>
          `;
        } else {
          todoEl.innerHTML = '';
        }
      }

      const bodyEl = document.getElementById('accueilBody');
      if (!bodyEl) return;

      let html = '';

      // ── Contract alert ─────────────────────────────────────────
      if (pendingContracts > 0) {
        html += `
          <div class="ac-alert">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            </svg>
            <div class="ac-alert-text">
              <strong>${pendingContracts} contract${pendingContracts > 1 ? 's' : ''} pending signature.</strong>
              Sign them as soon as possible to unlock your collaboration.
            </div>
            <button class="ac-alert-btn" onclick="ClientDashboard.switchPage('contrats')">View</button>
          </div>
        `;
      }

      // ── Collabs + messages (2 columns) ───────────────────────
      const me  = UserModel.getUser();
      const uid = me ? parseInt(me.id) : 0;
      const statusCfg = {
        pending:   { label: 'Pending',   cls: 'collab-s--pending'   },
        active:    { label: 'Active',    cls: 'collab-s--active'    },
        completed: { label: 'Completed', cls: 'collab-s--completed' },
        cancelled: { label: 'Cancelled', cls: 'collab-s--cancelled' },
      };

      // Collab column
      let collabHtml = '';
      if (collabs.length > 0) {
        const recent = collabs.slice(0, 4);
        collabHtml = `
          <div>
            <div class="ac-section-head">
              <span class="ac-section-label">Recent collaborations</span>
              ${collabs.length > 4 ? `<button class="ac-section-link" onclick="ClientDashboard.switchPage('collaborations')">All →</button>` : ''}
            </div>
            <div class="ac-collab-list">
              ${recent.map(c => {
                const sc      = statusCfg[c.status] || statusCfg.pending;
                const amBrand = parseInt(c.brand_id) === uid;
                const other   = amBrand
                  ? (`${c.inf_firstname||''} ${c.inf_lastname||''}`.trim() || c.inf_email || '?')
                  : (`${c.brand_firstname||''} ${c.brand_lastname||''}`.trim() + (c.brand_company ? ` — ${c.brand_company}` : ''));
                const initial = (c.title || '?').charAt(0).toUpperCase();
                const budget  = c.budget ? `${Number(c.budget).toLocaleString('en-US')} €` : null;
                const date    = c.created_at
                  ? new Date(c.created_at).toLocaleDateString('en-US', { day:'numeric', month:'short', year:'numeric' })
                  : null;
                return `
                  <div class="ac-collab-card" onclick="ClientDashboard.switchPage('collaborations')">
                    <div class="ac-cc-header">
                      <div class="ac-cc-avatar">${initial}</div>
                      <div class="ac-cc-info">
                        <div class="ac-cc-title">${esc(c.title)}</div>
                        <div class="ac-cc-partner">${esc(other)}</div>
                      </div>
                      <span class="collab-status ${sc.cls}">${sc.label}</span>
                    </div>
                    <div class="ac-cc-footer">
                      <div class="ac-cc-budget ${budget ? '' : 'ac-cc-budget--none'}">${budget || 'Budget not defined'}</div>
                      ${date ? `<div class="ac-cc-date">Created on ${date}</div>` : ''}
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        `;
      } else {
        collabHtml = `
          <div class="ac-empty">
            <div class="ac-empty-emoji">✨</div>
            <div class="ac-empty-title">Your journey starts here</div>
            <p class="ac-empty-desc">Your first Influmatch collaboration will appear here. Our team is here to support you every step of the way.</p>
            <button class="ac-empty-cta" onclick="ClientDashboard.switchPage('discussions')">Contact the team →</button>
          </div>
        `;
      }

      // Messages column
      const topConvs = convs.slice(0, 4);
      let msgHtml = '';
      if (topConvs.length > 0) {
        const fmtTime = str => {
          if (!str) return '';
          const d = new Date(str), now = new Date();
          return d.toDateString() === now.toDateString()
            ? d.toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit' })
            : d.toLocaleDateString('en-US', { day:'2-digit', month:'2-digit' });
        };
        const fmtPreview = conv => {
          if (!conv.last_content) return 'No messages';
          if (conv.last_type === 'call_event') {
            let parsed = {};
            try { parsed = JSON.parse(conv.last_content); } catch (_) {}
            return parsed.status === 'missed' ? '📵 Missed call' : '📞 Call';
          }
          if (conv.last_type === 'image') return '📷 Image';
          if (conv.last_type === 'file')  return '📎 File';
          const t = conv.last_content;
          return t.length > 36 ? t.slice(0, 36) + '…' : t;
        };
        const convName = conv => {
          if (conv.name) return conv.name;
          const others = (conv.participants || []).filter(p => parseInt(p.id) !== uid);
          const admins = others.filter(p => p.role === 'admin');
          if (admins.length && admins.length === others.length) return 'Influmatch Team';
          if (others.length === 1) return `${others[0].firstname} ${others[0].lastname}`;
          return others.map(p => p.firstname).join(', ');
        };
        const convInitials = conv => {
          const n = convName(conv);
          return n === 'Influmatch Team' ? 'IM' : (n || '?').charAt(0).toUpperCase();
        };

        msgHtml = `
          <div>
            <div class="ac-section-head">
              <span class="ac-section-label">Messages</span>
              <button class="ac-section-link" onclick="ClientDashboard.switchPage('discussions')">All →</button>
            </div>
            <div class="ac-msg-card">
              <div class="ac-msg-list">
                ${topConvs.map(conv => {
                  const unread = parseInt(conv.unread_count || 0);
                  return `
                    <div class="ac-msg-row" onclick="ClientDashboard.switchPage('discussions')">
                      <div class="ac-msg-avatar">${convInitials(conv)}</div>
                      <div class="ac-msg-info">
                        <div class="ac-msg-name">${esc(convName(conv))}</div>
                        <div class="ac-msg-preview ${unread ? 'ac-msg-preview--unread' : ''}">${esc(fmtPreview(conv))}</div>
                      </div>
                      <div class="ac-msg-meta">
                        <div class="ac-msg-time">${fmtTime(conv.last_at)}</div>
                        ${unread ? `<div class="ac-msg-badge">${unread > 9 ? '9+' : unread}</div>` : ''}
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          </div>
        `;
      }

      html += `<div class="ac-body ${topConvs.length ? '' : 'ac-body--full'}">${collabHtml}${msgHtml}</div>`;
      bodyEl.innerHTML = html;

    } catch (err) {
      console.error('[Home]', err);
      const bodyEl = document.getElementById('accueilBody');
      if (bodyEl) bodyEl.innerHTML = '<div style="color:var(--muted);font-size:.85rem;padding:24px 0">Loading error.</div>';
    }
  },

  // ---- My messages ----
  _discussions() {
    setTimeout(() => MessagesController.init(false), 0);
    return MessagesController.renderDiscussions(false);
  },

  // ---- My collaborations ----
  _collaborations() {
    setTimeout(() => ClientDashboard._loadClientCollabs(), 0);
    const skCard = `
      <div class="ccc-card" style="padding:22px 24px">
        <div class="dash-skeleton" style="height:16px;width:52%;border-radius:6px;margin-bottom:14px"></div>
        <div class="dash-skeleton" style="height:12px;width:36%;border-radius:6px;margin-bottom:10px"></div>
        <div class="dash-skeleton" style="height:10px;width:68%;border-radius:6px"></div>
      </div>`;
    return `
      <div class="dash-page-header">
        <h1 class="dash-page-title">My collaborations</h1>
        <p class="dash-page-desc">Track the progress of your campaigns and the influencers involved.</p>
      </div>
      <div class="ccc-stats-row" id="cccStatsRow">
        ${[1,2,3,4].map(() => `
          <div class="ccc-stat">
            <div class="dash-skeleton" style="height:30px;width:38px;border-radius:6px;margin-bottom:8px"></div>
            <div class="dash-skeleton" style="height:11px;width:75%;border-radius:4px"></div>
          </div>
        `).join('')}
      </div>
      <div id="cccFilters" class="dash-filter-pills" style="margin:20px 0 0"></div>
      <div id="cccGrid" style="margin-top:16px">${skCard}${skCard}</div>
    `;
  },

  _ccCache:  [],
  _ccFilter: 'all',

  _setClientCollabFilter(f) {
    this._ccFilter = f;
    this._renderCCC();
  },

  async _loadClientCollabs() {
    try {
      const res  = await fetch('api/collaborations.php?action=my_collabs');
      const data = await res.json();
      if (!data.success) {
        const g = document.getElementById('cccGrid');
        if (g) g.innerHTML = `<div class="dash-empty"><div class="dash-empty-title">Error</div><p class="dash-empty-text">${data.message || ''}</p></div>`;
        return;
      }
      this._ccCache  = data.collaborations || [];
      this._ccFilter = 'all';
      this._renderCCC();
    } catch (_) {
      const g = document.getElementById('cccGrid');
      if (g) g.innerHTML = `<div class="dash-empty"><div class="dash-empty-title">Network error</div></div>`;
    }
  },

  _renderCCC() {
    const all = this._ccCache;
    const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    const me  = UserModel.getUser();
    const uid = me ? parseInt(me.id) : 0;

    // ── Stats ──────────────────────────────────────────
    const statsEl = document.getElementById('cccStatsRow');
    if (statsEl) {
      const stats = [
        { val: all.length,                                    label: 'Total',     color: 'var(--primary)' },
        { val: all.filter(c => c.status==='pending').length,  label: 'Pending',   color: '#f59e0b'        },
        { val: all.filter(c => c.status==='active').length,   label: 'Active',    color: '#22c55e'        },
        { val: all.filter(c => c.status==='completed').length,label: 'Completed', color: '#3b82f6'        },
      ];
      statsEl.innerHTML = stats.map(s => `
        <div class="ccc-stat">
          <div class="ccc-stat-num" style="color:${s.color}">${s.val}</div>
          <div class="ccc-stat-label">${s.label}</div>
        </div>
      `).join('');
    }

    // ── Filter pills ───────────────────────────────────
    const filtersEl = document.getElementById('cccFilters');
    if (filtersEl) {
      const pills = [
        { key:'all',       label:'All',       n: all.length },
        { key:'pending',   label:'Pending',   n: all.filter(c=>c.status==='pending').length },
        { key:'active',    label:'Active',    n: all.filter(c=>c.status==='active').length },
        { key:'completed', label:'Completed', n: all.filter(c=>c.status==='completed').length },
        { key:'cancelled', label:'Cancelled', n: all.filter(c=>c.status==='cancelled').length },
      ].filter(p => p.key==='all' || p.n > 0);
      filtersEl.innerHTML = pills.map(p => `
        <button class="dash-filter-pill ${this._ccFilter===p.key?'active':''}"
                onclick="ClientDashboard._setClientCollabFilter('${p.key}')">
          ${p.label} <span class="dash-filter-count">${p.n}</span>
        </button>
      `).join('');
    }

    // ── Cards ──────────────────────────────────────────
    const gridEl = document.getElementById('cccGrid');
    if (!gridEl) return;

    const list = this._ccFilter==='all' ? all : all.filter(c=>c.status===this._ccFilter);

    if (all.length === 0) {
      gridEl.innerHTML = `
        <div class="dash-empty" style="padding-top:40px">
          <div class="dash-empty-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"
                 stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
          </div>
          <div class="dash-empty-title">No ongoing collaborations</div>
          <p class="dash-empty-text">Once your first campaign is launched, you will find the progress of each collaboration here.</p>
        </div>`;
      return;
    }

    if (list.length === 0) {
      gridEl.innerHTML = `<div class="dash-empty" style="padding-top:32px"><div class="dash-empty-title">No collaborations in this category</div></div>`;
      return;
    }

    const statusCfg = {
      pending:   { label:'Pending',   cls:'collab-s--pending',   step:1 },
      active:    { label:'Active',    cls:'collab-s--active',    step:2 },
      completed: { label:'Completed', cls:'collab-s--completed', step:3 },
      cancelled: { label:'Cancelled', cls:'collab-s--cancelled', step:-1 },
    };

    const _progress = status => {
      if (status === 'cancelled') return `<div class="ccc-card-footer ccc-card-footer--cancelled">Collaboration cancelled</div>`;
      const steps = [
        { key:'pending',   label:'Pending'   },
        { key:'active',    label:'Active'    },
        { key:'completed', label:'Completed' },
      ];
      const cur = statusCfg[status]?.step ?? 1;
      const html = steps.map((s, i) => {
        const n    = i + 1;
        const done = n < cur;
        const act  = n === cur;
        return `
          <div class="ccc-step ${done?'ccc-step--done':act?'ccc-step--active':''}">
            <div class="ccc-step-dot"></div>
            <div class="ccc-step-label">${s.label}</div>
          </div>
          ${i < steps.length-1 ? `<div class="ccc-step-line ${done?'ccc-step-line--done':''}"></div>` : ''}
        `;
      }).join('');
      return `<div class="ccc-card-footer"><div class="ccc-progress">${html}</div></div>`;
    };

    gridEl.innerHTML = `<div class="ccc-cards-list">${list.map(c => {
      const sc       = statusCfg[c.status] || statusCfg.pending;
      const amBrand  = parseInt(c.brand_id) === uid;
      const other    = amBrand
        ? (`${c.inf_firstname||''} ${c.inf_lastname||''}`.trim() || c.inf_email)
        : (`${c.brand_firstname||''} ${c.brand_lastname||''}`.trim() + (c.brand_company ? ` — ${c.brand_company}` : ''));
      const otherRole = amBrand ? 'Influencer' : 'Brand';
      const initial   = (other||'?').charAt(0).toUpperCase();
      const budget    = c.budget ? `${parseFloat(c.budget).toLocaleString('en-US')} €` : null;
      const fmt       = d => new Date(d).toLocaleDateString('en-US',{day:'numeric',month:'short',year:'numeric'});
      const dateStr   = c.start_date ? fmt(c.start_date) + (c.end_date ? ' → ' + fmt(c.end_date) : '') : null;

      const hasLongDesc = (c.description || '').length > 120;
      return `
        <div class="ccc-card ccc-card--${c.status}">
          <div class="ccc-card-body">

            <!-- Title row -->
            <div class="ccc-card-head">
              <div class="ccc-card-title">${esc(c.title)}</div>
              <div class="ccc-card-head-right">
                <span class="collab-status ${sc.cls}">${sc.label}</span>
                <button class="ccc-board-icon-btn"
                        onclick="ClientDashboard._openBoardFromCollab(${c.id})"
                        title="View campaign tracking">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"
                       stroke-linecap="round" stroke-linejoin="round">
                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>
                  </svg>
                  View tracking
                </button>
              </div>
            </div>

            <!-- Person + meta row -->
            <div class="ccc-card-row">
              <div class="ccc-avatar">${initial}</div>
              <div class="ccc-info">
                <div class="ccc-role">${otherRole}</div>
                <div class="ccc-name">${esc(other)}</div>
              </div>
              <div class="ccc-chips">
                ${budget  ? `<span class="ccc-chip ccc-chip--budget">${budget}</span>`  : ''}
                ${dateStr ? `<span class="ccc-chip ccc-chip--date">${dateStr}</span>` : ''}
              </div>
            </div>

            ${c.description ? `
              <div>
                <p class="ccc-card-desc" id="cccDesc_${c.id}">${esc(c.description)}</p>
                ${hasLongDesc ? `<button class="ccc-desc-toggle" id="cccToggle_${c.id}"
                  onclick="ClientDashboard._toggleDesc('${c.id}', this)">See more</button>` : ''}
              </div>` : ''}

          </div>
          ${_progress(c.status)}
        </div>
      `;
    }).join('')}</div>`;
  },

  _openBoardFromCollab(collabId) {
    const c = this._ccCache.find(x => parseInt(x.id) === collabId);
    if (!c) return;
    TaskBoardController.open(collabId, c);
  },

  // ---- My contracts ----
  _contrats() {
    setTimeout(() => ClientDashboard._loadClientContracts(), 0);
    return `
      <div class="dash-page-header">
        <h1 class="dash-page-title">My contracts</h1>
        <p class="dash-page-desc">Download and sign your official contracts.</p>
      </div>
      <div id="clientContractsWrap">
        <div class="ccc-cards-list">
          ${[1,2].map(() => `
            <div class="ccc-card" style="padding:22px 24px">
              <div class="dash-skeleton" style="height:16px;width:50%;border-radius:6px;margin-bottom:14px"></div>
              <div class="dash-skeleton" style="height:12px;width:35%;border-radius:6px;margin-bottom:10px"></div>
              <div class="dash-skeleton" style="height:10px;width:65%;border-radius:6px"></div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  async _loadClientContracts() {
    const wrap = document.getElementById('clientContractsWrap');
    if (!wrap) return;
    try {
      const res  = await fetch('api/contracts.php?action=my_contracts');
      const data = await res.json();
      if (!data.success) {
        wrap.innerHTML = `<div class="dash-empty"><div class="dash-empty-title">Error</div><p class="dash-empty-text">${data.message||''}</p></div>`;
        return;
      }
      const list = data.contracts || [];

      if (list.length === 0) {
        wrap.innerHTML = `
          <div class="dash-empty">
            <div class="dash-empty-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"
                   stroke-linecap="round" stroke-linejoin="round">
                <path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/>
              </svg>
            </div>
            <div class="dash-empty-title">No contracts available</div>
            <p class="dash-empty-text">When a contract is sent to you, it will appear here for signing.</p>
          </div>`;
        return;
      }

      const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
      const statusCfg = {
        pending:  { label:'To sign',  cls:'contract-s--pending',  icon:'⏳' },
        signed:   { label:'Signed',   cls:'contract-s--signed',   icon:'✅' },
        rejected: { label:'Rejected', cls:'contract-s--rejected', icon:'❌' },
      };

      const cards = list.map(c => {
        const s    = statusCfg[c.status] || statusCfg.pending;
        const date = new Date(c.created_at).toLocaleDateString('en-US',{day:'numeric',month:'long',year:'numeric'});
        const signedDate = c.signed_at
          ? new Date(c.signed_at).toLocaleDateString('en-US',{day:'numeric',month:'long',year:'numeric'})
          : null;

        const signSection = c.status === 'pending' ? `
          <div class="contract-sign-zone" id="signZone_${c.id}">
            <p class="contract-sign-info">
              Download the contract, sign it, then upload the signed version below.
            </p>
            <div class="contract-sign-actions">
              <a class="contract-btn contract-btn--download"
                 href="api/contracts.php?action=download&id=${c.id}&type=unsigned" target="_blank">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
                     stroke-linecap="round" stroke-linejoin="round" style="width:15px;height:15px">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Download the contract
              </a>
              <label class="contract-btn contract-btn--upload" id="signLabel_${c.id}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
                     stroke-linecap="round" stroke-linejoin="round" style="width:15px;height:15px">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                <span id="signFileName_${c.id}">Upload signed contract</span>
                <input type="file" accept=".pdf" style="display:none"
                       onchange="ClientDashboard._onSignFileChange(${c.id}, this)">
              </label>
            </div>
            <div id="signError_${c.id}" style="color:#ef4444;font-size:.8rem;margin-top:8px;display:none"></div>
          </div>
        ` : c.status === 'signed' ? `
          <div style="display:flex;gap:10px;margin-top:14px;flex-wrap:wrap">
            <a class="contract-btn contract-btn--download"
               href="api/contracts.php?action=download&id=${c.id}&type=unsigned" target="_blank">
              Download the original
            </a>
            <a class="contract-btn contract-btn--signed"
               href="api/contracts.php?action=download&id=${c.id}&type=signed" target="_blank">
              Download the signed version
            </a>
          </div>
        ` : '';

        return `
          <div class="ccc-card ccc-card--${c.status === 'signed' ? 'completed' : c.status === 'rejected' ? 'cancelled' : 'pending'}">
            <div class="ccc-card-body">
              <div class="ccc-card-head">
                <div class="ccc-card-title">${esc(c.title)}</div>
                <span class="collab-status ${s.cls}">${s.icon} ${s.label}</span>
              </div>
              <div class="ccc-card-row">
                <div class="ccc-info">
                  <div class="ccc-role">Document</div>
                  <div class="ccc-name">Received on ${date}${signedDate?' · Signed on '+signedDate:''}</div>
                </div>
                ${c.collab_title ? `<span class="ccc-chip ccc-chip--date">${esc(c.collab_title)}</span>` : ''}
              </div>
              ${c.description ? `<p class="ccc-card-desc">${esc(c.description)}</p>` : ''}
              ${signSection}
            </div>
          </div>
        `;
      }).join('');

      wrap.innerHTML = `<div class="ccc-cards-list">${cards}</div>`;
    } catch (_) {
      if (wrap) wrap.innerHTML = `<div class="dash-empty"><div class="dash-empty-title">Network error</div></div>`;
    }
  },

  _pendingSignInput: null,

  _onSignFileChange(contractId, input) {
    const file = input.files[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      const errEl = document.getElementById(`signError_${contractId}`);
      if (errEl) { errEl.textContent = 'Only PDF files are accepted.'; errEl.style.display = 'block'; }
      return;
    }
    ClientDashboard._pendingSignInput = input;
    ClientDashboard._showSignConfirm(contractId, file);
  },

  _showSignConfirm(contractId, file) {
    document.getElementById('signConfirmOverlay')?.remove();
    const overlay = document.createElement('div');
    overlay.className = 'dash-modal-overlay';
    overlay.id = 'signConfirmOverlay';
    overlay.innerHTML = `
      <div class="dash-modal" style="max-width:440px">
        <div class="dash-modal-header dash-modal-header--simple">
          <h3 class="dash-modal-title">Confirm signature</h3>
          <button class="dash-modal-close" onclick="document.getElementById('signConfirmOverlay').remove()">✕</button>
        </div>
        <div class="dash-modal-body">
          <p style="color:#555;margin:0 0 16px;line-height:1.6">
            You are about to submit your signed version.
            <strong>This action is irreversible.</strong>
          </p>
          <div style="background:#f5f4f1;border-radius:10px;padding:12px 16px;display:flex;align-items:center;gap:10px">
            <svg viewBox="0 0 24 24" fill="none" stroke="#7c3aed" stroke-width="1.8"
                 stroke-linecap="round" stroke-linejoin="round" style="width:22px;height:22px;flex-shrink:0">
              <path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/>
            </svg>
            <span style="font-size:.88rem;color:#333;font-weight:500;word-break:break-all">${String(file.name).replace(/&/g,'&amp;').replace(/</g,'&lt;')}</span>
          </div>
        </div>
        <div class="dash-modal-footer">
          <button class="dash-mfooter-close" onclick="document.getElementById('signConfirmOverlay').remove()">Cancel</button>
          <button class="dash-mfooter-submit" id="signConfirmBtn"
                  onclick="ClientDashboard._submitSignContract(${contractId}, this)">
            Confirm signature
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
  },

  async _submitSignContract(contractId, btn) {
    const fileInput = ClientDashboard._pendingSignInput;
    const errEl     = document.getElementById(`signError_${contractId}`);
    if (errEl) errEl.style.display = 'none';

    const file = fileInput?.files?.[0];
    if (!file) return;

    if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }

    const fd = new FormData();
    fd.append('id',   contractId);
    fd.append('file', file);

    try {
      const res  = await fetch('api/contracts.php?action=sign', { method:'POST', body:fd });
      const data = await res.json();
      document.getElementById('signConfirmOverlay')?.remove();
      if (!data.success) {
        if (errEl) { errEl.textContent = data.message || 'Error.'; errEl.style.display = 'block'; }
        return;
      }
      ClientDashboard._showToast('Contract signed and sent successfully!');
      ClientDashboard._loadClientContracts();
    } catch (_) {
      document.getElementById('signConfirmOverlay')?.remove();
      if (errEl) { errEl.textContent = 'Network error.'; errEl.style.display = 'block'; }
    }
  },

  _showToast(message, type = 'success') {
    document.getElementById('dashToast')?.remove();
    const t = document.createElement('div');
    t.id = 'dashToast';
    t.className = `dash-toast dash-toast--${type}`;
    t.textContent = message;
    document.body.appendChild(t);
    requestAnimationFrame(() => t.classList.add('dash-toast--show'));
    setTimeout(() => {
      t.classList.remove('dash-toast--show');
      setTimeout(() => t.remove(), 350);
    }, 3500);
  },

  _toggleDesc(id, btn) {
    const p = document.getElementById(`cccDesc_${id}`);
    if (!p) return;
    const expanded = p.classList.toggle('ccc-card-desc--expanded');
    btn.textContent = expanded ? 'See less' : 'See more';
  },

  // ---- My statistics ----
  _stats() {
    setTimeout(() => ClientDashboard._loadStats(), 0);
    const sk = `<div class="ccc-stat"><div class="dash-skeleton" style="height:30px;width:38px;border-radius:6px;margin-bottom:8px"></div><div class="dash-skeleton" style="height:11px;width:75%;border-radius:4px"></div></div>`;
    return `
      <div class="dash-page-header">
        <h1 class="dash-page-title">My statistics</h1>
        <p class="dash-page-desc">Overview of your campaigns.</p>
      </div>
      <div class="ccc-stats-row" id="statsKpiRow">${[1,2,3,4].map(() => sk).join('')}</div>
      <div id="statsBody" style="margin-top:28px"></div>
    `;
  },

  async _loadStats() {
    const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    try {
      const res  = await fetch('api/collaborations.php?action=my_collabs');
      const data = await res.json();
      const all  = data.collaborations || [];

      const kpiEl = document.getElementById('statsKpiRow');
      if (kpiEl) {
        const budgetTotal = all.reduce((sum, c) => sum + (parseFloat(c.budget) || 0), 0);
        const kpis = [
          { val: all.length,                                      label: 'Total',        color: 'var(--primary)' },
          { val: all.filter(c => c.status === 'active').length,   label: 'Active',       color: '#22c55e'        },
          { val: all.filter(c => c.status === 'completed').length,label: 'Completed',    color: '#3b82f6'        },
          { val: budgetTotal > 0 ? budgetTotal.toLocaleString('en-US') + ' €' : '—', label: 'Total budget', color: '#d97706' },
        ];
        kpiEl.innerHTML = kpis.map(k => `
          <div class="ccc-stat">
            <div class="ccc-stat-num" style="color:${k.color}">${k.val}</div>
            <div class="ccc-stat-label">${k.label}</div>
          </div>
        `).join('');
      }

      const bodyEl = document.getElementById('statsBody');
      if (!bodyEl) return;

      if (all.length === 0) {
        bodyEl.innerHTML = `
          <div class="dash-empty">
            <div class="dash-empty-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"
                   stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"/>
              </svg>
            </div>
            <div class="dash-empty-title">No data available</div>
            <p class="dash-empty-text">Your statistics will appear here after your first collaboration.</p>
          </div>`;
        return;
      }

      const me  = UserModel.getUser();
      const uid = me ? parseInt(me.id) : 0;
      const statusGroups = [
        { key: 'active',    label: 'Active',    color: '#22c55e', cls: 'collab-s--active'    },
        { key: 'pending',   label: 'Pending',   color: '#f59e0b', cls: 'collab-s--pending'   },
        { key: 'completed', label: 'Completed', color: '#3b82f6', cls: 'collab-s--completed' },
        { key: 'cancelled', label: 'Cancelled', color: '#9ca3af', cls: 'collab-s--cancelled' },
      ].filter(g => all.some(c => c.status === g.key));

      const fmt = d => new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

      bodyEl.innerHTML = statusGroups.map(g => {
        const group = all.filter(c => c.status === g.key);
        return `
          <div class="stats-group">
            <div class="stats-group-header">
              <span class="stats-group-dot" style="background:${g.color}"></span>
              <span class="stats-group-label">${g.label}</span>
              <span class="stats-group-count">${group.length}</span>
            </div>
            <div class="stats-collab-list">
              ${group.map(c => {
                const amBrand = parseInt(c.brand_id) === uid;
                const other   = amBrand
                  ? (`${c.inf_firstname || ''} ${c.inf_lastname || ''}`.trim() || c.inf_email)
                  : (`${c.brand_firstname || ''} ${c.brand_lastname || ''}`.trim() + (c.brand_company ? ` — ${c.brand_company}` : ''));
                const initial  = (other || '?').charAt(0).toUpperCase();
                const budget   = c.budget ? `${parseFloat(c.budget).toLocaleString('en-US')} €` : null;
                const dateStr  = c.start_date ? fmt(c.start_date) + (c.end_date ? ' → ' + fmt(c.end_date) : '') : null;
                return `
                  <div class="stats-collab-row">
                    <div class="ccc-avatar" style="width:32px;height:32px;font-size:.8rem;flex-shrink:0">${initial}</div>
                    <div style="flex:1;min-width:0">
                      <div class="accueil-collab-title">${esc(c.title)}</div>
                      <div class="accueil-collab-sub">${esc(other)}</div>
                    </div>
                    <div style="display:flex;gap:8px;align-items:center;flex-shrink:0">
                      ${budget  ? `<span class="ccc-chip ccc-chip--budget">${budget}</span>` : ''}
                      ${dateStr ? `<span class="ccc-chip ccc-chip--date">${dateStr}</span>` : ''}
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        `;
      }).join('');
    } catch (_) {
      const bodyEl = document.getElementById('statsBody');
      if (bodyEl) bodyEl.innerHTML = `<div class="dash-empty"><div class="dash-empty-title">Loading error</div></div>`;
    }
  },

  // ---- Calendar ----
  _calendrier() {
    setTimeout(() => CalendarController.init(false), 0);
    return CalendarController.renderCalendar(false);
  },

  // ---- My account ----
  _compte(tab = 'profil') {
    const user = UserModel.getUser();
    if (!user) return '';
    ClientDashboard._compteTab = tab;
    setTimeout(() => ClientDashboard._compteAfterRender(), 0);

    const initial  = (user.firstname || 'U').charAt(0).toUpperCase();
    const joinDate = user.created_at
      ? new Date(user.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
      : null;
    const avatarUrl = user.avatar || null;
    const avatarHtml = avatarUrl
      ? `<img src="${avatarUrl}" alt="avatar" class="stt-avatar-img">`
      : `<span class="stt-avatar-initial">${initial}</span>`;

    const tabs = [
      { id: 'profil',   label: 'Profile',         icon: `<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>` },
      { id: 'securite', label: 'Security',         icon: `<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>` },
      { id: 'collabs',  label: 'Collaborations',   icon: `<path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>` },
    ];

    return `
      <div class="stt-layout">

        <!-- ══ SETTINGS SIDEBAR ══ -->
        <aside class="stt-sidebar">
          <!-- Avatar -->
          <div class="stt-profile-block">
            <div class="stt-avatar-wrap" onclick="document.getElementById('avatarInput').click()" title="Change photo">
              ${avatarHtml}
              <div class="stt-avatar-overlay">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
              </div>
              <input type="file" id="avatarInput" accept="image/*" style="display:none"
                     onchange="ClientDashboard._uploadAvatar(this)">
            </div>
            <div class="stt-profile-name">${user.firstname || ''} ${user.lastname || ''}</div>
            <div class="stt-profile-email">${user.email || ''}</div>
            ${joinDate ? `<div class="stt-profile-join">Member since ${joinDate}</div>` : ''}
          </div>

          <!-- Nav tabs -->
          <nav class="stt-nav">
            ${tabs.map(t => `
              <button class="stt-nav-item ${tab === t.id ? 'active' : ''}"
                      onclick="ClientDashboard._switchCompteTab('${t.id}')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"
                     stroke-linecap="round" stroke-linejoin="round">
                  ${t.icon}
                </svg>
                ${t.label}
              </button>
            `).join('')}
          </nav>
        </aside>

        <!-- ══ TAB CONTENT ══ -->
        <div class="stt-content" id="sttContent">
          ${ClientDashboard._compteTabContent(tab, user)}
        </div>

      </div>
    `;
  },

  _compteTabContent(tab, user) {
    user = user || UserModel.getUser();
    if (!user) return '';

    if (tab === 'profil') {
      const isBrand      = !user.role || user.role === 'brand' || user.role === 'client';
      const isInfluencer = user.role === 'influencer';
      return `
      <div class="stt-section-title">Personal information</div>
      <div class="stt-section-desc">Edit your profile information visible to the Influmatch team.</div>

      <div class="stt-card">
        <div id="compteMsg" class="cpt-msg" style="display:none"></div>
        <div class="stt-form-grid">
          <div class="stt-field">
            <label>First name</label>
            <input type="text" id="compteFirstname" value="${user.firstname || ''}" placeholder="First name">
          </div>
          <div class="stt-field">
            <label>Last name</label>
            <input type="text" id="compteLastname" value="${user.lastname || ''}" placeholder="Last name">
          </div>
          <div class="stt-field stt-field--full">
            <label>Email address</label>
            <input type="email" id="compteEmail" value="${user.email || ''}" placeholder="email@example.com">
          </div>
          <div class="stt-field">
            <label>Phone <span class="stt-optional">optional</span></label>
            <input type="tel" id="comptePhone" value="${user.phone || ''}" placeholder="+1 555 123 4567">
          </div>

          ${isBrand ? `
          <div class="stt-field">
            <label>Company <span class="stt-optional">optional</span></label>
            <input type="text" id="compteCompany" value="${user.company || ''}" placeholder="Your company name">
          </div>
          ` : ''}

          ${isInfluencer ? `
          <div class="stt-field stt-field--full">
            <div class="stt-social-title">Social networks</div>
          </div>
          <div class="stt-field">
            <label>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px;display:inline;margin-right:4px"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              Instagram <span class="stt-optional">optional</span>
            </label>
            <input type="text" id="compteInstagram" value="${user.instagram || ''}" placeholder="@myaccount">
          </div>
          <div class="stt-field">
            <label>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px;display:inline;margin-right:4px"><path d="M9 12a4 4 0 104 4V4a5 5 0 005 5"/></svg>
              TikTok <span class="stt-optional">optional</span>
            </label>
            <input type="text" id="compteTiktok" value="${user.tiktok || ''}" placeholder="@myaccount">
          </div>
          <div class="stt-field">
            <label>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px;display:inline;margin-right:4px"><path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.95C5.12 20 12 20 12 20s6.88 0 8.59-.47a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>
              YouTube <span class="stt-optional">optional</span>
            </label>
            <input type="text" id="compteYoutube" value="${user.youtube || ''}" placeholder="@mychannel">
          </div>
          ` : ''}
        </div>
        <div class="stt-card-foot">
          <button class="stt-btn" id="cptSaveBtn" onclick="ClientDashboard._saveCompte(this)">
            Save
          </button>
        </div>
      </div>

      <div class="stt-section-title" style="margin-top:32px">Profile photo</div>
      <div class="stt-section-desc">Accepted formats: JPG, PNG, WebP — 5 MB max.</div>

      <div class="stt-card stt-card--avatar">
        <div class="stt-avatar-preview" onclick="document.getElementById('avatarInput2').click()">
          ${user.avatar
            ? `<img src="${user.avatar}" alt="avatar">`
            : `<span>${(user.firstname || 'U').charAt(0).toUpperCase()}</span>`}
          <div class="stt-avatar-preview-overlay">Edit</div>
          <input type="file" id="avatarInput2" accept="image/*" style="display:none"
                 onchange="ClientDashboard._uploadAvatar(this)">
        </div>
        <div class="stt-avatar-info">
          <div class="stt-avatar-hint">Click on the photo to change it</div>
          ${user.avatar ? `<button class="stt-btn stt-btn--danger-outline" onclick="ClientDashboard._deleteAvatar()">Delete photo</button>` : ''}
        </div>
      </div>
    `;
    }

    if (tab === 'securite') return `
      <div class="stt-section-title">Passkeys</div>
      <div class="stt-section-desc">Sign in with Face ID, Touch ID, or Windows Hello — no password needed.</div>
      <div class="stt-card" id="passkeysCard">
        <div id="passkeysList"><div class="dash-skeleton" style="height:44px;border-radius:8px"></div></div>
        <div class="stt-card-foot">
          <button class="stt-btn" id="addPasskeyBtn" onclick="ClientDashboard._addPasskey(this)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="width:15px;height:15px;margin-right:6px;vertical-align:-2px">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
            Add a passkey
          </button>
          <span id="addPasskeyMsg" style="font-size:.82rem;margin-left:12px"></span>
        </div>
      </div>

      <div class="stt-section-title" style="margin-top:32px">Sessions</div>
      <div class="stt-section-desc">Information about your current connection.</div>
      <div class="stt-card stt-card--info">
        <div class="stt-info-row">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          <div>
            <div class="stt-info-label">Active session</div>
            <div class="stt-info-value">Logged in on this device</div>
          </div>
        </div>
      </div>

      <div class="stt-section-title" style="margin-top:32px">My data (GDPR / CCPA)</div>
      <div class="stt-section-desc">Download a copy of all your personal data (Art. 20 GDPR — right to data portability).</div>
      <div class="stt-card">
        <div class="stt-form-grid" style="grid-template-columns:1fr;gap:8px">
          <p style="font-size:.82rem;color:var(--muted);margin:0">The JSON file contains: profile, collaborations, sent messages, campaign tasks.</p>
        </div>
        <div class="stt-card-foot">
          <button class="stt-btn" id="exportDataBtn" onclick="ClientDashboard._exportData(this)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="width:15px;height:15px;margin-right:6px;vertical-align:-2px">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Download my data
          </button>
        </div>
      </div>

      <div class="stt-section-title" style="margin-top:32px;color:#dc2626">Danger zone</div>
      <div class="stt-section-desc">Deletion is <strong>irreversible</strong>. All your data will be erased (Art. 17 GDPR).</div>
      <div class="stt-card" style="border-color:#fecaca">
        <div id="deleteAccountMsg" class="cpt-msg" style="display:none"></div>
        <div class="stt-form-grid">
          <div class="stt-field stt-field--full">
            <label>Type <strong>DELETE</strong> to confirm</label>
            <input type="text" id="deleteAccountConfirm" placeholder="DELETE" autocomplete="off">
          </div>
        </div>
        <div class="stt-card-foot" style="justify-content:flex-start">
          <button class="stt-btn stt-btn--danger-outline" id="deleteAccountBtn"
                  onclick="ClientDashboard._deleteAccount(this)">
            Permanently delete my account
          </button>
        </div>
      </div>
    `;

    if (tab === 'collabs') return `
      <div class="stt-section-title">Collaboration history</div>
      <div class="stt-section-desc">All your past and ongoing collaborations.</div>
      <div id="compteHistorique">
        <div class="cpt-history-loading">
          <div class="dash-skeleton" style="height:60px;border-radius:10px;margin-bottom:8px"></div>
          <div class="dash-skeleton" style="height:60px;border-radius:10px;margin-bottom:8px"></div>
          <div class="dash-skeleton" style="height:60px;border-radius:10px"></div>
        </div>
      </div>
    `;

    return '';
  },

  _compteAfterRender() {
    const tab = ClientDashboard._compteTab || 'profil';
    if (tab === 'collabs')  ClientDashboard._loadCompteHistory();
    if (tab === 'securite') ClientDashboard._loadPasskeys();
  },

  _switchCompteTab(tab) {
    ClientDashboard._compteTab = tab;
    // Update active buttons
    document.querySelectorAll('.stt-nav-item').forEach(b => {
      b.classList.toggle('active', b.textContent.trim().toLowerCase().startsWith(tab === 'securite' ? 'sec' : tab === 'collabs' ? 'col' : 'pro'));
    });
    const content = document.getElementById('sttContent');
    if (content) {
      content.style.opacity = '0';
      content.style.transform = 'translateY(6px)';
      setTimeout(() => {
        content.innerHTML = ClientDashboard._compteTabContent(tab);
        content.style.transition = 'opacity .18s ease, transform .18s ease';
        content.style.opacity = '1';
        content.style.transform = 'translateY(0)';
        if (tab === 'collabs')  ClientDashboard._loadCompteHistory();
        if (tab === 'securite') ClientDashboard._loadPasskeys();
      }, 120);
    }
  },

  async _uploadAvatar(input) {
    const file = input.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    // Immediate preview
    const reader = new FileReader();
    reader.onload = e => {
      document.querySelectorAll('.stt-avatar-wrap img, .stt-avatar-preview img').forEach(img => { img.src = e.target.result; });
      document.querySelectorAll('.stt-avatar-wrap .stt-avatar-initial, .stt-avatar-preview span').forEach(el => el.remove());
      // Sidebar avatar
      const sidebarAvatar = document.querySelector('.dash-hdr-avatar');
      if (sidebarAvatar) sidebarAvatar.style.backgroundImage = `url(${e.target.result})`;
    };
    reader.readAsDataURL(file);

    try {
      const res  = await fetch('api/users.php?action=upload_avatar', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) {
        const user = UserModel.getUser();
        if (user) user.avatar = data.avatar;
        ClientDashboard._showToast('Profile photo updated.');
        // Update all sidebar avatars
        const sidebarAv = document.querySelector('.stt-avatar-wrap');
        if (sidebarAv) {
          sidebarAv.querySelector('.stt-avatar-initial')?.remove();
          let img = sidebarAv.querySelector('img');
          if (!img) { img = document.createElement('img'); img.className = 'stt-avatar-img'; sidebarAv.prepend(img); }
          img.src = data.avatar;
        }
      } else {
        ClientDashboard._showToast(data.message || 'Upload error.', 'error');
      }
    } catch (_) {
      ClientDashboard._showToast('Network error.', 'error');
    }
  },

  async _deleteAvatar() {
    try {
      const res  = await fetch('api/users.php?action=delete_avatar', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        const user = UserModel.getUser();
        if (user) user.avatar = null;
        ClientDashboard._showToast('Photo deleted.');
        ClientDashboard._switchCompteTab('profil');
      }
    } catch (_) {
      ClientDashboard._showToast('Network error.', 'error');
    }
  },

  async _deleteAccount(btn) {
    const confirm_text = document.getElementById('deleteAccountConfirm')?.value?.trim();
    const msgEl        = document.getElementById('deleteAccountMsg');
    const show = (txt, type) => {
      msgEl.textContent   = txt;
      msgEl.className     = `cpt-msg cpt-msg--${type}`;
      msgEl.style.display = 'block';
    };

    if (confirm_text !== 'DELETE') {
      show('Please type DELETE in the field to confirm.', 'error');
      return;
    }

    btn.disabled    = true;
    btn.textContent = 'Deleting…';

    try {
      const res  = await fetch('api/users.php?action=delete_account', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({}),
      });
      const data = await res.json();
      if (!data.success) {
        show(data.message || 'Error.', 'error');
        btn.disabled    = false;
        btn.textContent = 'Permanently delete my account';
        return;
      }
      UserModel.logout();
      Router.navigate('home');
    } catch (_) {
      show('Network error.', 'error');
      btn.disabled    = false;
      btn.textContent = 'Permanently delete my account';
    }
  },

  async _exportData(btn) {
    btn.disabled    = true;
    btn.textContent = 'Preparing…';
    try {
      const res  = await fetch('api/users.php?action=export_data');
      if (!res.ok) throw new Error('Server error');
      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = 'influmatch-my-data-' + new Date().toISOString().slice(0, 10) + '.json';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (_) {
      alert('An error occurred during export.');
    }
    btn.disabled    = false;
    btn.innerHTML   = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="width:15px;height:15px;margin-right:6px;vertical-align:-2px"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>Download my data`;
  },

  // ── Passkey helpers (mirrors AuthPage) ───────────────────
  _b64u(buf) {
    return btoa(String.fromCharCode(...new Uint8Array(buf instanceof ArrayBuffer ? buf : buf.buffer)))
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  },
  _fromb64u(str) {
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    while (str.length % 4) str += '=';
    return Uint8Array.from(atob(str), c => c.charCodeAt(0)).buffer;
  },

  async _loadPasskeys() {
    const el = document.getElementById('passkeysList');
    if (!el) return;
    const data = await fetch('api/webauthn.php?action=list', { credentials: 'include' }).then(r => r.json());
    if (!data.success || !data.passkeys.length) {
      el.innerHTML = '<p style="font-size:.85rem;color:var(--muted);margin:0">No passkeys registered yet.</p>';
      return;
    }
    el.innerHTML = data.passkeys.map(pk => `
      <div class="passkey-row" id="pk-${pk.id}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" style="width:18px;height:18px;flex-shrink:0;color:var(--primary)">
          <path d="M12 2C9.24 2 7 4.24 7 7c0 2.31 1.57 4.26 3.73 4.84L9 21h2l.5-2H13l.5 2h2l-1.73-9.16C15.43 11.26 17 9.31 17 7c0-2.76-2.24-5-5-5z"/>
          <circle cx="12" cy="7" r="2"/>
        </svg>
        <div style="flex:1;min-width:0">
          <div style="font-size:.88rem;font-weight:500">${pk.device_name}</div>
          <div style="font-size:.78rem;color:var(--muted)">Added ${new Date(pk.created_at).toLocaleDateString()}${pk.last_used_at ? ' · Last used ' + new Date(pk.last_used_at).toLocaleDateString() : ''}</div>
        </div>
        <button class="stt-btn stt-btn--danger-outline" style="padding:4px 10px;font-size:.78rem" onclick="ClientDashboard._removePasskey(${pk.id})">Remove</button>
      </div>
    `).join('');
  },

  async _addPasskey(btn) {
    if (!window.PublicKeyCredential) {
      document.getElementById('addPasskeyMsg').textContent = 'Passkeys not supported by your browser.';
      return;
    }
    const msg = document.getElementById('addPasskeyMsg');
    btn.disabled = true; btn.innerHTML = 'Waiting for biometric…';
    msg.textContent = '';

    try {
      const opts = await fetch('api/webauthn.php?action=register_begin', {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      }).then(r => r.json());

      const cred = await navigator.credentials.create({
        publicKey: {
          ...opts,
          challenge:          this._fromb64u(opts.challenge),
          user:               { ...opts.user, id: this._fromb64u(opts.user.id) },
          excludeCredentials: (opts.excludeCredentials || []).map(c => ({ ...c, id: this._fromb64u(c.id) })),
        },
      });

      const name = prompt('Name this passkey (e.g. "MacBook", "iPhone"):', 'My passkey') || 'My passkey';

      const result = await fetch('api/webauthn.php?action=register_finish', {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientDataJSON:    this._b64u(cred.response.clientDataJSON),
          attestationObject: this._b64u(cred.response.attestationObject),
          deviceName:        name,
        }),
      }).then(r => r.json());

      if (result.success) {
        msg.style.color = 'var(--success, #16a34a)';
        msg.textContent = '✓ Passkey added!';
        await this._loadPasskeys();
      } else {
        msg.style.color = '#dc2626'; msg.textContent = result.message;
      }
    } catch (err) {
      if (err.name !== 'NotAllowedError') {
        msg.style.color = '#dc2626'; msg.textContent = err.message;
      }
    }
    btn.disabled = false;
    btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="width:15px;height:15px;margin-right:6px;vertical-align:-2px"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>Add a passkey`;
  },

  async _removePasskey(id) {
    if (!confirm('Remove this passkey? You will no longer be able to use it to sign in.')) return;
    const res = await fetch('api/webauthn.php?action=remove', {
      method: 'POST', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    }).then(r => r.json());
    if (res.success) {
      document.getElementById('pk-' + id)?.remove();
      await this._loadPasskeys();
    }
  },

  async _loadCompteHistory() {
    const el = document.getElementById('compteHistorique');
    if (!el) return;
    const esc = s => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const statusCfg = {
      pending:   { label: 'Pending',   cls: 'collab-s--pending'   },
      active:    { label: 'Active',    cls: 'collab-s--active'    },
      completed: { label: 'Completed', cls: 'collab-s--completed' },
      cancelled: { label: 'Cancelled', cls: 'collab-s--cancelled' },
    };
    try {
      const res  = await fetch('api/collaborations.php?action=my_collabs');
      const data = await res.json();
      const collabs = data.collaborations || [];
      const me  = UserModel.getUser();
      const uid = me ? parseInt(me.id) : 0;

      if (collabs.length === 0) {
        el.innerHTML = `<div class="stt-card stt-empty">No collaborations yet.</div>`;
        return;
      }

      el.innerHTML = `
        <div class="stt-card" style="padding:0;overflow:hidden">
          ${collabs.map((c, i) => {
            const sc      = statusCfg[c.status] || statusCfg.pending;
            const amBrand = parseInt(c.brand_id) === uid;
            const other   = amBrand
              ? (`${c.inf_firstname || ''} ${c.inf_lastname || ''}`.trim() || c.inf_email || '?')
              : (`${c.brand_firstname || ''} ${c.brand_lastname || ''}`.trim() + (c.brand_company ? ` — ${esc(c.brand_company)}` : ''));
            const budget  = c.budget ? `${Number(c.budget).toLocaleString('en-US')} €` : null;
            const date    = c.created_at
              ? new Date(c.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
              : null;

            return `
              <div class="stt-collab-row ${i < collabs.length - 1 ? 'stt-collab-row--sep' : ''}">
                <div class="stt-collab-icon">${(c.title || '?').charAt(0).toUpperCase()}</div>
                <div class="stt-collab-body">
                  <div class="stt-collab-title">${esc(c.title)}</div>
                  <div class="stt-collab-with">${esc(other)}</div>
                </div>
                <div class="stt-collab-meta">
                  <span class="collab-status ${sc.cls}">${sc.label}</span>
                  ${budget ? `<span class="stt-collab-budget">${budget}</span>` : ''}
                  ${date   ? `<span class="stt-collab-date">${date}</span>` : ''}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    } catch (_) {
      el.innerHTML = `<div class="stt-card stt-empty">Error while loading.</div>`;
    }
  },

  async _saveCompte(btn) {
    const user      = UserModel.getUser();
    const role      = user?.role || 'brand';
    const firstname = document.getElementById('compteFirstname')?.value?.trim() || '';
    const lastname  = document.getElementById('compteLastname')?.value?.trim()  || '';
    const email     = document.getElementById('compteEmail')?.value?.trim()     || '';
    const phone     = document.getElementById('comptePhone')?.value?.trim()     || '';
    const company   = role === 'influencer' ? '' : (document.getElementById('compteCompany')?.value?.trim()   || '');
    const instagram = role === 'influencer' ? (document.getElementById('compteInstagram')?.value?.trim() || '') : '';
    const tiktok    = role === 'influencer' ? (document.getElementById('compteTiktok')?.value?.trim()    || '') : '';
    const youtube   = role === 'influencer' ? (document.getElementById('compteYoutube')?.value?.trim()   || '') : '';
    const msgEl     = document.getElementById('compteMsg');

    btn.disabled    = true;
    btn.textContent = 'Saving…';

    try {
      const res  = await fetch('api/users.php?action=update_profile', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ firstname, lastname, email, phone, company, instagram, tiktok, youtube }),
      });
      const data = await res.json();

      if (data.success) {
        const user = UserModel.getUser();
        if (user) { user.firstname = data.user.firstname; user.lastname = data.user.lastname; user.email = data.user.email; user.phone = data.user.phone; user.company = data.user.company; user.instagram = data.user.instagram; user.tiktok = data.user.tiktok; user.youtube = data.user.youtube; }
        const fullName = `${data.user.firstname} ${data.user.lastname}`;
        const initial  = data.user.firstname.charAt(0).toUpperCase();
        const nameEl   = document.querySelector('.dash-user-name');
        const sttName  = document.querySelector('.stt-profile-name');
        const sttEmail = document.querySelector('.stt-profile-email');
        const hdrAv    = document.querySelector('.dash-hdr-avatar');
        if (nameEl)   nameEl.textContent   = fullName;
        if (sttName)  sttName.textContent  = fullName;
        if (sttEmail) sttEmail.textContent = data.user.email;
        if (hdrAv && !hdrAv.style.backgroundImage) hdrAv.textContent = initial;
        if (msgEl) { msgEl.style.display = ''; msgEl.className = 'cpt-msg cpt-msg--success'; msgEl.textContent = 'Changes saved.'; }
        ClientDashboard._showToast('Profile updated.');
      } else {
        if (msgEl) { msgEl.style.display = ''; msgEl.className = 'cpt-msg cpt-msg--error'; msgEl.textContent = data.message || 'An error occurred.'; }
      }
    } catch (_) {
      if (msgEl) { msgEl.style.display = ''; msgEl.className = 'cpt-msg cpt-msg--error'; msgEl.textContent = 'Network error.'; }
    } finally {
      btn.disabled    = false;
      btn.textContent = 'Save';
    }
  },

  async _savePassword(btn) {
    const current = document.getElementById('cptPwdCurrent')?.value || '';
    const newPwd  = document.getElementById('cptPwdNew')?.value     || '';
    const confirm = document.getElementById('cptPwdConfirm')?.value || '';
    const msgEl   = document.getElementById('pwdMsg');

    if (newPwd !== confirm) {
      if (msgEl) { msgEl.style.display = ''; msgEl.className = 'cpt-msg cpt-msg--error'; msgEl.textContent = 'Passwords do not match.'; }
      return;
    }

    if (newPwd.length < 8) {
      if (msgEl) { msgEl.style.display = ''; msgEl.className = 'cpt-msg cpt-msg--error'; msgEl.textContent = 'Minimum 8 characters.'; }
      return;
    }

    btn.disabled    = true;
    btn.textContent = 'Updating…';

    try {
      const res  = await fetch('api/users.php?action=change_password', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ current_password: current, new_password: newPwd }),
      });
      const data = await res.json();

      if (data.success) {
        document.getElementById('cptPwdCurrent').value = '';
        document.getElementById('cptPwdNew').value     = '';
        document.getElementById('cptPwdConfirm').value = '';
        if (msgEl) { msgEl.style.display = ''; msgEl.className = 'cpt-msg cpt-msg--success'; msgEl.textContent = 'Password updated.'; }
        ClientDashboard._showToast('Password changed.');
      } else {
        if (msgEl) { msgEl.style.display = ''; msgEl.className = 'cpt-msg cpt-msg--error'; msgEl.textContent = data.message || 'Error.'; }
      }
    } catch (_) {
      if (msgEl) { msgEl.style.display = ''; msgEl.className = 'cpt-msg cpt-msg--error'; msgEl.textContent = 'Network error.'; }
    } finally {
      btn.disabled    = false;
      btn.textContent = 'Change password';
    }
  }

};
