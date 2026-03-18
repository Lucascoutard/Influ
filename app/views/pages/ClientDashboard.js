/* ===================================================
   APP/VIEWS/PAGES/CLIENTDASHBOARD.JS
   Espace client : sidebar fixe + contenu dynamique
   Pages : discussions · contrats · statistiques · compte
   =================================================== */

const ClientDashboard = {

  _page: 'accueil',

  render(page = null) {
    if (page) this._page = page;
    setTimeout(() => ClientDashboard._refreshUnreadBadge(),   300);
    setTimeout(() => ClientDashboard._refreshContractBadge(), 400);
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
              <span class="dash-user-badge">Client</span>
            </div>
          </div>

          <nav class="dash-nav">
            <div class="dash-nav-section-label">Mon espace</div>

            ${this._item('accueil', 'Accueil',
              `<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>`
            )}
            ${this._item('discussions', 'Mes discussions',
              `<path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>`
            )}
            ${this._item('collaborations', 'Mes collaborations',
              `<path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>`
            )}
            ${this._item('contrats', 'Mes contrats',
              `<path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/>`
            )}
            ${this._item('stats', 'Mes statistiques',
              `<path d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"/>`
            )}
            ${this._item('calendrier', 'Calendrier',
              `<path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>`
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

    // Fermer la sidebar mobile après navigation
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

  // ---- Accueil ----
  _accueil() {
    const user      = UserModel.getUser();
    const firstname = user ? user.firstname : '';
    const hour      = new Date().getHours();
    const greeting  = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir';
    const today     = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
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
              Contrats
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
      <div id="accueilBody"></div>
    `;
  },

  async _loadAccueil() {
    const esc = s => String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    const arrowSvg = `<svg class="ac-kpi-caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`;

    try {
      const [collabsRes, contractsRes, convRes] = await Promise.all([
        fetch('api/collaborations.php?action=my_collabs'),
        fetch('api/contracts.php?action=my_contracts'),
        fetch('api/messages.php?action=conversations'),
      ]);
      const collabsData   = await collabsRes.json();
      const contractsData = await contractsRes.json();
      const convData      = await convRes.json();

      const collabs   = collabsData.collaborations || [];
      const contracts = contractsData.contracts    || [];
      const convs     = convData.conversations     || [];

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
            <div class="ac-kpi-label">Collaboration${activeCollabs !== 1 ? 's' : ''} active${activeCollabs !== 1 ? 's' : ''}</div>
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
            <div class="ac-kpi-label">Contrat${pendingContracts !== 1 ? 's' : ''} à signer</div>
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
            <div class="ac-kpi-label">Message${unreadMsgs !== 1 ? 's' : ''} non lu${unreadMsgs !== 1 ? 's' : ''}</div>
          </div>
        `;
      }

      const bodyEl = document.getElementById('accueilBody');
      if (!bodyEl) return;

      let html = '';

      // ── Alert contrats ─────────────────────────────────────────
      if (pendingContracts > 0) {
        html += `
          <div class="ac-alert">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            </svg>
            <div class="ac-alert-text">
              <strong>${pendingContracts} contrat${pendingContracts > 1 ? 's' : ''} en attente de signature.</strong>
              Signez-les dès que possible pour débloquer votre collaboration.
            </div>
            <button class="ac-alert-btn" onclick="ClientDashboard.switchPage('contrats')">Voir</button>
          </div>
        `;
      }

      // ── Collabs + messages (2 colonnes) ───────────────────────
      const me  = UserModel.getUser();
      const uid = me ? parseInt(me.id) : 0;
      const statusCfg = {
        pending:   { label: 'En attente', cls: 'collab-s--pending'   },
        active:    { label: 'Active',     cls: 'collab-s--active'    },
        completed: { label: 'Terminée',   cls: 'collab-s--completed' },
        cancelled: { label: 'Annulée',    cls: 'collab-s--cancelled' },
      };

      // Collab column
      let collabHtml = '';
      if (collabs.length > 0) {
        const recent = collabs.slice(0, 4);
        collabHtml = `
          <div>
            <div class="ac-section-head">
              <span class="ac-section-label">Collaborations récentes</span>
              ${collabs.length > 4 ? `<button class="ac-section-link" onclick="ClientDashboard.switchPage('collaborations')">Toutes →</button>` : ''}
            </div>
            <div class="ac-collab-list">
              ${recent.map(c => {
                const sc      = statusCfg[c.status] || statusCfg.pending;
                const amBrand = parseInt(c.brand_id) === uid;
                const other   = amBrand
                  ? (`${c.inf_firstname||''} ${c.inf_lastname||''}`.trim() || c.inf_email || '?')
                  : (`${c.brand_firstname||''} ${c.brand_lastname||''}`.trim() + (c.brand_company ? ` — ${c.brand_company}` : ''));
                const initial = (c.title || '?').charAt(0).toUpperCase();
                const budget  = c.budget ? `${Number(c.budget).toLocaleString('fr-FR')} €` : null;
                const date    = c.created_at
                  ? new Date(c.created_at).toLocaleDateString('fr-FR', { day:'numeric', month:'short', year:'numeric' })
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
                      <div class="ac-cc-budget ${budget ? '' : 'ac-cc-budget--none'}">${budget || 'Budget non défini'}</div>
                      ${date ? `<div class="ac-cc-date">Créée le ${date}</div>` : ''}
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
            <div class="ac-empty-title">Votre aventure commence ici</div>
            <p class="ac-empty-desc">Votre première collaboration Influmatch apparaîtra ici. Notre équipe est là pour vous accompagner de A à Z.</p>
            <button class="ac-empty-cta" onclick="ClientDashboard.switchPage('discussions')">Contacter l'équipe →</button>
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
            ? d.toLocaleTimeString('fr-FR', { hour:'2-digit', minute:'2-digit' })
            : d.toLocaleDateString('fr-FR', { day:'2-digit', month:'2-digit' });
        };
        const fmtPreview = conv => {
          if (!conv.last_content) return 'Aucun message';
          if (conv.last_type === 'image') return '📷 Image';
          if (conv.last_type === 'file')  return '📎 Fichier';
          const t = conv.last_content;
          return t.length > 36 ? t.slice(0, 36) + '…' : t;
        };
        const convName = conv => {
          if (conv.name) return conv.name;
          const others = (conv.participants || []).filter(p => parseInt(p.id) !== uid);
          const admins = others.filter(p => p.role === 'admin');
          if (admins.length && admins.length === others.length) return 'Équipe Influmatch';
          if (others.length === 1) return `${others[0].firstname} ${others[0].lastname}`;
          return others.map(p => p.firstname).join(', ');
        };
        const convInitials = conv => {
          const n = convName(conv);
          return n === 'Équipe Influmatch' ? 'IM' : (n || '?').charAt(0).toUpperCase();
        };

        msgHtml = `
          <div>
            <div class="ac-section-head">
              <span class="ac-section-label">Discussions</span>
              <button class="ac-section-link" onclick="ClientDashboard.switchPage('discussions')">Toutes →</button>
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

    } catch (_) {
      const bodyEl = document.getElementById('accueilBody');
      if (bodyEl) bodyEl.innerHTML = '<div style="color:var(--muted);font-size:.85rem;padding:24px 0">Erreur de chargement.</div>';
    }
  },

  // ---- Mes discussions ----
  _discussions() {
    setTimeout(() => MessagesController.init(false), 0);
    return MessagesController.renderDiscussions(false);
  },

  // ---- Mes collaborations ----
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
        <h1 class="dash-page-title">Mes collaborations</h1>
        <p class="dash-page-desc">Suivez l'avancement de vos campagnes et des influenceurs qui y participent.</p>
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
        if (g) g.innerHTML = `<div class="dash-empty"><div class="dash-empty-title">Erreur</div><p class="dash-empty-text">${data.message || ''}</p></div>`;
        return;
      }
      this._ccCache  = data.collaborations || [];
      this._ccFilter = 'all';
      this._renderCCC();
    } catch (_) {
      const g = document.getElementById('cccGrid');
      if (g) g.innerHTML = `<div class="dash-empty"><div class="dash-empty-title">Erreur réseau</div></div>`;
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
        { val: all.length,                                    label: 'Total',      color: 'var(--primary)' },
        { val: all.filter(c => c.status==='pending').length,  label: 'En attente', color: '#f59e0b'        },
        { val: all.filter(c => c.status==='active').length,   label: 'Actives',    color: '#22c55e'        },
        { val: all.filter(c => c.status==='completed').length,label: 'Terminées',  color: '#3b82f6'        },
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
        { key:'all',       label:'Toutes',     n: all.length },
        { key:'pending',   label:'En attente', n: all.filter(c=>c.status==='pending').length },
        { key:'active',    label:'Actives',    n: all.filter(c=>c.status==='active').length },
        { key:'completed', label:'Terminées',  n: all.filter(c=>c.status==='completed').length },
        { key:'cancelled', label:'Annulées',   n: all.filter(c=>c.status==='cancelled').length },
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
          <div class="dash-empty-title">Aucune collaboration en cours</div>
          <p class="dash-empty-text">Une fois votre première campagne lancée, vous retrouverez ici l'avancement de chaque collaboration.</p>
        </div>`;
      return;
    }

    if (list.length === 0) {
      gridEl.innerHTML = `<div class="dash-empty" style="padding-top:32px"><div class="dash-empty-title">Aucune collaboration dans cette catégorie</div></div>`;
      return;
    }

    const statusCfg = {
      pending:   { label:'En attente', cls:'collab-s--pending',   step:1 },
      active:    { label:'Active',     cls:'collab-s--active',    step:2 },
      completed: { label:'Terminée',   cls:'collab-s--completed', step:3 },
      cancelled: { label:'Annulée',    cls:'collab-s--cancelled', step:-1 },
    };

    const _progress = status => {
      if (status === 'cancelled') return `<div class="ccc-card-footer ccc-card-footer--cancelled">Collaboration annulée</div>`;
      const steps = [
        { key:'pending',   label:'En attente' },
        { key:'active',    label:'Active'     },
        { key:'completed', label:'Terminée'   },
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
      const otherRole = amBrand ? 'Influenceur' : 'Marque';
      const initial   = (other||'?').charAt(0).toUpperCase();
      const budget    = c.budget ? `${parseFloat(c.budget).toLocaleString('fr-FR')} €` : null;
      const fmt       = d => new Date(d).toLocaleDateString('fr-FR',{day:'numeric',month:'short',year:'numeric'});
      const dateStr   = c.start_date ? fmt(c.start_date) + (c.end_date ? ' → ' + fmt(c.end_date) : '') : null;

      const hasLongDesc = (c.description || '').length > 120;
      return `
        <div class="ccc-card ccc-card--${c.status}">
          <div class="ccc-card-body">
            <div class="ccc-card-head">
              <div class="ccc-card-title">${esc(c.title)}</div>
              <span class="collab-status ${sc.cls}">${sc.label}</span>
            </div>
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
                  onclick="ClientDashboard._toggleDesc('${c.id}', this)">Voir plus</button>` : ''}
              </div>` : ''}
          </div>
          <div class="ccc-card-board-row">
            <button class="ccc-board-btn"
                    onclick="ClientDashboard._openBoardFromCollab(${c.id})">
              📋 Voir le suivi de campagne
            </button>
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

  // ---- Mes contrats ----
  _contrats() {
    setTimeout(() => ClientDashboard._loadClientContracts(), 0);
    return `
      <div class="dash-page-header">
        <h1 class="dash-page-title">Mes contrats</h1>
        <p class="dash-page-desc">Téléchargez et signez vos contrats officiels.</p>
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
        wrap.innerHTML = `<div class="dash-empty"><div class="dash-empty-title">Erreur</div><p class="dash-empty-text">${data.message||''}</p></div>`;
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
            <div class="dash-empty-title">Aucun contrat disponible</div>
            <p class="dash-empty-text">Lorsqu'un contrat vous sera transmis, il apparaîtra ici pour signature.</p>
          </div>`;
        return;
      }

      const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
      const statusCfg = {
        pending:  { label:'À signer',   cls:'contract-s--pending',  icon:'⏳' },
        signed:   { label:'Signé',      cls:'contract-s--signed',   icon:'✅' },
        rejected: { label:'Rejeté',     cls:'contract-s--rejected', icon:'❌' },
      };

      const cards = list.map(c => {
        const s    = statusCfg[c.status] || statusCfg.pending;
        const date = new Date(c.created_at).toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'});
        const signedDate = c.signed_at
          ? new Date(c.signed_at).toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'})
          : null;

        const signSection = c.status === 'pending' ? `
          <div class="contract-sign-zone" id="signZone_${c.id}">
            <p class="contract-sign-info">
              Téléchargez le contrat, signez-le, puis déposez la version signée ci-dessous.
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
                Télécharger le contrat
              </a>
              <label class="contract-btn contract-btn--upload" id="signLabel_${c.id}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
                     stroke-linecap="round" stroke-linejoin="round" style="width:15px;height:15px">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                <span id="signFileName_${c.id}">Déposer le contrat signé</span>
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
              Télécharger l'original
            </a>
            <a class="contract-btn contract-btn--signed"
               href="api/contracts.php?action=download&id=${c.id}&type=signed" target="_blank">
              Télécharger la version signée
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
                  <div class="ccc-name">Reçu le ${date}${signedDate?' · Signé le '+signedDate:''}</div>
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
      if (wrap) wrap.innerHTML = `<div class="dash-empty"><div class="dash-empty-title">Erreur réseau</div></div>`;
    }
  },

  _pendingSignInput: null,

  _onSignFileChange(contractId, input) {
    const file = input.files[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      const errEl = document.getElementById(`signError_${contractId}`);
      if (errEl) { errEl.textContent = 'Seuls les fichiers PDF sont acceptés.'; errEl.style.display = 'block'; }
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
          <h3 class="dash-modal-title">Confirmer la signature</h3>
          <button class="dash-modal-close" onclick="document.getElementById('signConfirmOverlay').remove()">✕</button>
        </div>
        <div class="dash-modal-body">
          <p style="color:#555;margin:0 0 16px;line-height:1.6">
            Vous êtes sur le point de soumettre votre version signée.
            <strong>Cette action est irréversible.</strong>
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
          <button class="dash-mfooter-close" onclick="document.getElementById('signConfirmOverlay').remove()">Annuler</button>
          <button class="dash-mfooter-submit" id="signConfirmBtn"
                  onclick="ClientDashboard._submitSignContract(${contractId}, this)">
            Confirmer la signature
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

    if (btn) { btn.disabled = true; btn.textContent = 'Envoi…'; }

    const fd = new FormData();
    fd.append('id',   contractId);
    fd.append('file', file);

    try {
      const res  = await fetch('api/contracts.php?action=sign', { method:'POST', body:fd });
      const data = await res.json();
      document.getElementById('signConfirmOverlay')?.remove();
      if (!data.success) {
        if (errEl) { errEl.textContent = data.message || 'Erreur.'; errEl.style.display = 'block'; }
        return;
      }
      ClientDashboard._showToast('Contrat signé et envoyé avec succès !');
      ClientDashboard._loadClientContracts();
    } catch (_) {
      document.getElementById('signConfirmOverlay')?.remove();
      if (errEl) { errEl.textContent = 'Erreur réseau.'; errEl.style.display = 'block'; }
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
    btn.textContent = expanded ? 'Voir moins' : 'Voir plus';
  },

  // ---- Mes statistiques ----
  _stats() {
    setTimeout(() => ClientDashboard._loadStats(), 0);
    const sk = `<div class="ccc-stat"><div class="dash-skeleton" style="height:30px;width:38px;border-radius:6px;margin-bottom:8px"></div><div class="dash-skeleton" style="height:11px;width:75%;border-radius:4px"></div></div>`;
    return `
      <div class="dash-page-header">
        <h1 class="dash-page-title">Mes statistiques</h1>
        <p class="dash-page-desc">Vue d'ensemble de vos campagnes.</p>
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
          { val: all.length,                                      label: 'Total',       color: 'var(--primary)' },
          { val: all.filter(c => c.status === 'active').length,   label: 'Actives',     color: '#22c55e'        },
          { val: all.filter(c => c.status === 'completed').length,label: 'Terminées',   color: '#3b82f6'        },
          { val: budgetTotal > 0 ? budgetTotal.toLocaleString('fr-FR') + ' €' : '—', label: 'Budget total', color: '#d97706' },
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
            <div class="dash-empty-title">Aucune donnée disponible</div>
            <p class="dash-empty-text">Vos statistiques s'afficheront ici après votre première collaboration.</p>
          </div>`;
        return;
      }

      const me  = UserModel.getUser();
      const uid = me ? parseInt(me.id) : 0;
      const statusGroups = [
        { key: 'active',    label: 'Actives',     color: '#22c55e', cls: 'collab-s--active'    },
        { key: 'pending',   label: 'En attente',  color: '#f59e0b', cls: 'collab-s--pending'   },
        { key: 'completed', label: 'Terminées',   color: '#3b82f6', cls: 'collab-s--completed' },
        { key: 'cancelled', label: 'Annulées',    color: '#9ca3af', cls: 'collab-s--cancelled' },
      ].filter(g => all.some(c => c.status === g.key));

      const fmt = d => new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });

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
                const budget   = c.budget ? `${parseFloat(c.budget).toLocaleString('fr-FR')} €` : null;
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
      if (bodyEl) bodyEl.innerHTML = `<div class="dash-empty"><div class="dash-empty-title">Erreur de chargement</div></div>`;
    }
  },

  // ---- Calendrier ----
  _calendrier() {
    setTimeout(() => CalendarController.init(false), 0);
    return CalendarController.renderCalendar(false);
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
          <div class="dash-field dash-field--full">
            <span class="dash-field-label">Statut</span>
            <div style="margin-top:2px"><span class="dash-active-badge">Compte actif</span></div>
          </div>
        </div>

        <div class="dash-account-edit-section">
          <div class="dash-account-edit-title">Informations modifiables</div>
          <div class="dash-account-edit-grid">
            <div class="dash-field">
              <span class="dash-field-label">Téléphone</span>
              <input type="tel" id="comptePhone" class="dash-edit-input"
                     placeholder="Ex : +33 6 12 34 56 78"
                     value="${user.phone || ''}">
            </div>
            <div class="dash-field">
              <span class="dash-field-label">Entreprise</span>
              <input type="text" id="compteCompany" class="dash-edit-input"
                     placeholder="Nom de votre entreprise"
                     value="${user.company || ''}">
            </div>
          </div>
          <div id="compteMsg" style="display:none;margin-bottom:12px;font-size:.84rem"></div>
          <button class="dash-save-btn" onclick="ClientDashboard._saveCompte(this)">Enregistrer</button>
        </div>
      </div>
    `;
  },

  async _saveCompte(btn) {
    const phone   = document.getElementById('comptePhone')?.value?.trim()   || '';
    const company = document.getElementById('compteCompany')?.value?.trim() || '';
    const msgEl   = document.getElementById('compteMsg');

    btn.disabled    = true;
    btn.textContent = 'Enregistrement…';

    try {
      const res  = await fetch('api/users.php?action=update_profile', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ phone, company }),
      });
      const data = await res.json();

      if (data.success) {
        const user = UserModel.getUser();
        if (user) { user.phone = phone; user.company = company; }
        if (msgEl) { msgEl.style.display = ''; msgEl.style.color = '#166534'; msgEl.textContent = 'Modifications enregistrées.'; }
        ClientDashboard._showToast('Profil mis à jour.');
      } else {
        if (msgEl) { msgEl.style.display = ''; msgEl.style.color = '#991b1b'; msgEl.textContent = data.message || 'Une erreur est survenue.'; }
      }
    } catch (_) {
      if (msgEl) { msgEl.style.display = ''; msgEl.style.color = '#991b1b'; msgEl.textContent = 'Erreur réseau.'; }
    } finally {
      btn.disabled    = false;
      btn.textContent = 'Enregistrer';
    }
  }

};
