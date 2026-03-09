/* ===================================================
   APP/VIEWS/PAGES/CLIENTDASHBOARD.JS
   Espace client : sidebar fixe + contenu dynamique
   Pages : discussions · contrats · statistiques · compte
   =================================================== */

const ClientDashboard = {

  _page: 'discussions',

  render(page = null) {
    if (page) this._page = page;
    setTimeout(() => ClientDashboard._refreshUnreadBadge(), 300);
    const user   = UserModel.getUser();
    const name   = user ? `${user.firstname} ${user.lastname}` : '';
    const initial = user ? (user.firstname || 'U').charAt(0).toUpperCase() : '';

    return `
      ${this._renderDashHeader(initial, user)}
      ${MobileNav.render()}

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

          <!-- Right side: avatar only -->
          <div class="dash-hdr-right">
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
    if (el) el.innerHTML = this._page_render(page);

    document.querySelectorAll('.dash-nav-item').forEach(item => {
      item.classList.toggle('active', item.dataset.page === page);
    });

    // Clear unread badge when entering discussions
    if (page === 'discussions') ClientDashboard._setBadge('discussions', 0);
  },

  async _refreshUnreadBadge() {
    try {
      const res  = await fetch('api/stats.php');
      const data = await res.json();
      const n    = parseInt(data.messages_unread) || 0;
      ClientDashboard._setBadge('discussions', this._page === 'discussions' ? 0 : n);
    } catch (_) {}
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
      case 'discussions':    return this._discussions();
      case 'collaborations': return this._collaborations();
      case 'contrats':       return this._contrats();
      case 'stats':          return this._stats();
      case 'calendrier':     return this._calendrier();
      case 'compte':         return this._compte();
      default:               return this._discussions();
    }
  },

  // ================================================================
  //  PAGES
  // ================================================================

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
          ${_progress(c.status)}
        </div>
      `;
    }).join('')}</div>`;
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
    return `
      <div class="dash-page-header">
        <h1 class="dash-page-title">Mes statistiques</h1>
        <p class="dash-page-desc">Suivez les performances de vos collaborations en temps réel.</p>
      </div>
      <div class="dash-empty">
        <div class="dash-empty-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"
               stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"/>
          </svg>
        </div>
        <div class="dash-empty-title">Statistiques à venir</div>
        <p class="dash-empty-text">
          Vues, taux d'engagement, portée — les performances de vos campagnes
          s'afficheront ici après votre première collaboration.
        </p>
      </div>
    `;
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

          <div class="dash-field">
            <span class="dash-field-label">Téléphone</span>
            <div class="dash-field-value">${user.phone || '—'}</div>
          </div>
          <div class="dash-field">
            <span class="dash-field-label">Entreprise</span>
            <div class="dash-field-value">${user.company || '—'}</div>
          </div>

          <div class="dash-field dash-field--full">
            <span class="dash-field-label">Statut</span>
            <div style="margin-top:2px">
              <span class="dash-active-badge">Compte actif</span>
            </div>
          </div>

        </div>

        <div class="dash-contact-note">
          Pour modifier vos informations, écrivez-nous à
          <a href="mailto:hello@influmatch.com">hello@influmatch.com</a>.
          Nous mettons à jour votre profil sous 24h.
        </div>
      </div>
    `;
  }

};
