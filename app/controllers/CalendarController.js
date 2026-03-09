/* ===================================================
   APP/CONTROLLERS/CALENDARCONTROLLER.JS
   Google Calendar–style monthly view
   =================================================== */

const CalendarController = {

  _year:    null,
  _month:   null,   // 0-indexed (0 = Jan)
  _events:  [],
  _isAdmin: false,
  _clients: [],

  // ================================================================
  //  RENDER — synchrone, retourne le HTML du squelette
  // ================================================================

  renderCalendar(isAdmin) {
    this._isAdmin = isAdmin;
    return `
      <div class="dash-page-header">
        <div>
          <h1 class="dash-page-title">Calendrier</h1>
          <p class="dash-page-desc">Vos appels et événements planifiés.</p>
        </div>
        ${isAdmin
          ? `<button class="btn btn--primary btn--sm" onclick="CalendarController.openCreateModal()">+ Ajouter</button>`
          : ''}
      </div>

      <div class="cal-card">
        <div class="cal-header">
          <button class="cal-nav-btn" onclick="CalendarController.prevMonth()" title="Mois précédent">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                 stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <span class="cal-month-label" id="calMonthLabel">Chargement…</span>
          <button class="cal-nav-btn" onclick="CalendarController.nextMonth()" title="Mois suivant">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                 stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>

        <div class="cal-days-header">
          ${['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'].map(d =>
            `<div class="cal-day-name">${d}</div>`
          ).join('')}
        </div>

        <div class="cal-grid" id="calGrid">
          <div class="cal-grid-loading">Chargement…</div>
        </div>
      </div>
    `;
  },

  // ================================================================
  //  INIT — async, charge les données après le render
  // ================================================================

  async init(isAdmin) {
    this._isAdmin = isAdmin;
    const now     = new Date();
    this._year    = now.getFullYear();
    this._month   = now.getMonth();

    const [eventsOk] = await Promise.all([
      this._loadEvents(),
      isAdmin ? this._loadClients() : Promise.resolve()
    ]);
  },

  // ================================================================
  //  NAVIGATION
  // ================================================================

  prevMonth() {
    this._month--;
    if (this._month < 0) { this._month = 11; this._year--; }
    this._loadEvents();
  },

  nextMonth() {
    this._month++;
    if (this._month > 11) { this._month = 0; this._year++; }
    this._loadEvents();
  },

  // ================================================================
  //  DATA
  // ================================================================

  async _loadEvents() {
    try {
      const res  = await fetch(`api/calendar.php?action=list&year=${this._year}&month=${this._month + 1}`);
      const data = await res.json();
      this._events = data.events || [];
      this._renderGrid();
    } catch (_) {
      const g = document.getElementById('calGrid');
      if (g) g.innerHTML = '<div class="cal-grid-loading">Erreur de chargement</div>';
    }
  },

  async _loadClients() {
    try {
      const res  = await fetch('api/messages.php?action=users');
      const data = await res.json();
      this._clients = (data.users || []).filter(u => u.role === 'client');
    } catch (_) {}
  },

  // ================================================================
  //  RENDER GRID
  // ================================================================

  _renderGrid() {
    const label = document.getElementById('calMonthLabel');
    if (label) {
      const d = new Date(this._year, this._month, 1);
      const s = d.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
      label.textContent = s.charAt(0).toUpperCase() + s.slice(1);
    }

    const grid = document.getElementById('calGrid');
    if (!grid) return;

    const today  = new Date();
    const todayY = today.getFullYear();
    const todayM = today.getMonth();
    const todayD = today.getDate();
    const evMap  = this._buildEventMap();
    const days   = this._getDaysGrid(this._year, this._month);

    grid.innerHTML = days.map(d => {
      if (!d) return `<div class="cal-cell cal-cell--filler"></div>`;

      const isToday = d.getFullYear() === todayY && d.getMonth() === todayM && d.getDate() === todayD;
      const isPast  = d < new Date(todayY, todayM, todayD);
      const key     = this._dateKey(d);
      const evs     = evMap[key] || [];
      const clickFn = this._isAdmin ? `CalendarController.openCreateModal('${key}')` : '';

      return `
        <div class="cal-cell ${isToday ? 'cal-cell--today' : ''} ${isPast ? 'cal-cell--past' : ''} ${this._isAdmin ? 'cal-cell--clickable' : ''}"
             ${this._isAdmin ? `onclick="${clickFn}"` : ''}>
          <span class="cal-cell-num ${isToday ? 'cal-cell-num--today' : ''}">${d.getDate()}</span>
          <div class="cal-cell-events">
            ${evs.slice(0, 3).map(ev => `
              <div class="cal-event cal-event--${ev.type}"
                   onclick="event.stopPropagation(); CalendarController.openEventModal(${ev.id})">
                ${ev.start_at && !ev.start_at.endsWith('00:00:00')
                  ? `<span class="cal-event-time">${this._fmtTime(ev.start_at)}</span>`
                  : ''}
                <span class="cal-event-label">${this._esc(ev.title)}</span>
              </div>
            `).join('')}
            ${evs.length > 3 ? `<div class="cal-event-more">+${evs.length - 3} autre${evs.length - 3 > 1 ? 's' : ''}</div>` : ''}
          </div>
        </div>
      `;
    }).join('');
  },

  // ================================================================
  //  MODALS — Créer un événement
  // ================================================================

  openCreateModal(date = '') {
    document.getElementById('calModalOverlay')?.remove();

    const clientOptions = this._clients.map(c =>
      `<option value="${c.id}">${this._esc(c.firstname)} ${this._esc(c.lastname)}</option>`
    ).join('');

    const overlay = document.createElement('div');
    overlay.className = 'cal-modal-overlay';
    overlay.id = 'calModalOverlay';
    overlay.innerHTML = `
      <div class="cal-modal">
        <div class="cal-modal-header">
          <h3 class="cal-modal-title">Nouvel événement</h3>
          <button class="cal-modal-close" onclick="document.getElementById('calModalOverlay').remove()">✕</button>
        </div>
        <div class="cal-modal-body">

          <div class="cal-form-row">
            <label class="cal-form-label">Titre *</label>
            <input type="text" class="cal-form-input" id="calTitle"
                   placeholder="Ex : Appel stratégie Q2" autocomplete="off">
          </div>

          <div class="cal-form-2col">
            <div class="cal-form-row">
              <label class="cal-form-label">Type</label>
              <select class="cal-form-input" id="calType">
                <option value="call">📞 Appel</option>
                <option value="meeting">👥 Réunion</option>
                <option value="demo">🖥️ Démo</option>
                <option value="other">📌 Autre</option>
              </select>
            </div>
            <div class="cal-form-row">
              <label class="cal-form-label">Client</label>
              <select class="cal-form-input" id="calClient">
                <option value="">— Aucun —</option>
                ${clientOptions}
              </select>
            </div>
          </div>

          <div class="cal-form-2col">
            <div class="cal-form-row">
              <label class="cal-form-label">Date *</label>
              <input type="date" class="cal-form-input" id="calDate" value="${date}">
            </div>
            <div class="cal-form-row">
              <label class="cal-form-label">Heure début</label>
              <input type="time" class="cal-form-input" id="calTimeStart">
            </div>
          </div>

          <div class="cal-form-2col">
            <div class="cal-form-row">
              <label class="cal-form-label">Heure fin</label>
              <input type="time" class="cal-form-input" id="calTimeEnd">
            </div>
            <div class="cal-form-row">
              <label class="cal-form-label">Lieu / lien</label>
              <input type="text" class="cal-form-input" id="calLocation"
                     placeholder="Google Meet, Bureau…">
            </div>
          </div>

          <div class="cal-form-row">
            <label class="cal-form-label">Description</label>
            <textarea class="cal-form-input cal-form-textarea" id="calDesc"
                      placeholder="Ordre du jour, notes…"></textarea>
          </div>

        </div>
        <div class="cal-modal-footer">
          <button class="cal-btn-cancel" onclick="document.getElementById('calModalOverlay').remove()">Annuler</button>
          <button class="cal-btn-submit" id="calSubmitBtn"
                  onclick="CalendarController.submitCreate(this)">Créer</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    document.getElementById('calTitle')?.focus();
  },

  async submitCreate(btn) {
    const title     = document.getElementById('calTitle')?.value.trim();
    const type      = document.getElementById('calType')?.value;
    const date      = document.getElementById('calDate')?.value;
    const timeStart = document.getElementById('calTimeStart')?.value;
    const timeEnd   = document.getElementById('calTimeEnd')?.value;
    const location  = document.getElementById('calLocation')?.value.trim();
    const desc      = document.getElementById('calDesc')?.value.trim();
    const clientId  = document.getElementById('calClient')?.value;

    if (!title) { document.getElementById('calTitle')?.focus(); return; }
    if (!date)  { document.getElementById('calDate')?.focus();  return; }

    const startAt = timeStart ? `${date} ${timeStart}:00` : `${date} 00:00:00`;
    const endAt   = timeEnd   ? `${date} ${timeEnd}:00`   : null;

    btn.disabled    = true;
    btn.textContent = 'Création…';

    try {
      const res  = await fetch('api/calendar.php?action=create', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          title, type, start_at: startAt, end_at: endAt,
          location: location || null,
          description: desc || null,
          client_id: clientId || null
        })
      });
      const data = await res.json();
      if (data.id) {
        document.getElementById('calModalOverlay')?.remove();
        await this._loadEvents();
      } else {
        alert(data.error || 'Erreur lors de la création');
        btn.disabled    = false;
        btn.textContent = 'Créer';
      }
    } catch (_) {
      btn.disabled    = false;
      btn.textContent = 'Créer';
    }
  },

  // ================================================================
  //  MODALS — Voir un événement
  // ================================================================

  openEventModal(id) {
    document.getElementById('calEventOverlay')?.remove();

    const ev = this._events.find(e => parseInt(e.id) === parseInt(id));
    if (!ev) return;

    const typeLabels = { call: '📞 Appel', meeting: '👥 Réunion', demo: '🖥️ Démo', other: '📌 Autre' };
    const typeLabel  = typeLabels[ev.type] || ev.type;
    const startFmt   = this._fmtDateTimeFull(ev.start_at);
    const endFmt     = ev.end_at && !ev.end_at.endsWith('00:00:00')
                       ? ' → ' + this._fmtTime(ev.end_at) : '';

    const overlay = document.createElement('div');
    overlay.className = 'cal-modal-overlay';
    overlay.id = 'calEventOverlay';
    overlay.innerHTML = `
      <div class="cal-modal cal-modal--view">
        <div class="cal-modal-header">
          <span class="cal-type-badge cal-type-badge--${ev.type}">${typeLabel}</span>
          <button class="cal-modal-close" onclick="document.getElementById('calEventOverlay').remove()">✕</button>
        </div>
        <div class="cal-modal-body">
          <h2 class="cal-event-view-title">${this._esc(ev.title)}</h2>

          <div class="cal-event-view-meta">
            <div class="cal-event-view-row">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"
                   stroke-linecap="round" stroke-linejoin="round" width="16" height="16">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8"  y1="2" x2="8"  y2="6"/>
                <line x1="3"  y1="10" x2="21" y2="10"/>
              </svg>
              <span>${startFmt}${endFmt}</span>
            </div>
            ${ev.location ? `
            <div class="cal-event-view-row">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"
                   stroke-linecap="round" stroke-linejoin="round" width="16" height="16">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <span>${this._esc(ev.location)}</span>
            </div>` : ''}
            ${ev.client_name && ev.client_name.trim() ? `
            <div class="cal-event-view-row">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"
                   stroke-linecap="round" stroke-linejoin="round" width="16" height="16">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <span>${this._esc(ev.client_name)}</span>
            </div>` : ''}
          </div>

          ${ev.description ? `
          <p class="cal-event-view-desc">${this._nl2br(this._esc(ev.description))}</p>` : ''}
        </div>

        <div class="cal-modal-footer">
          ${this._isAdmin
            ? `<button class="cal-btn-danger" onclick="CalendarController.deleteEvent(${ev.id}, this)">Supprimer</button>`
            : ''}
          <button class="cal-btn-cancel" onclick="document.getElementById('calEventOverlay').remove()">Fermer</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
  },

  async deleteEvent(id, btn) {
    if (!confirm('Supprimer cet événement ?')) return;
    btn.disabled    = true;
    btn.textContent = 'Suppression…';
    try {
      const res  = await fetch(`api/calendar.php?action=delete&id=${id}`);
      const data = await res.json();
      if (data.ok) {
        document.getElementById('calEventOverlay')?.remove();
        await this._loadEvents();
      } else {
        alert(data.error || 'Erreur');
        btn.disabled    = false;
        btn.textContent = 'Supprimer';
      }
    } catch (_) {
      btn.disabled    = false;
      btn.textContent = 'Supprimer';
    }
  },

  // ================================================================
  //  HELPERS
  // ================================================================

  _getDaysGrid(year, month) {
    const first  = new Date(year, month, 1);
    const last   = new Date(year, month + 1, 0);
    // Mon=0 … Sun=6
    let startDow = first.getDay();
    startDow     = startDow === 0 ? 6 : startDow - 1;

    const cells = [];
    for (let i = 0; i < startDow; i++) cells.push(null);
    for (let d = 1; d <= last.getDate(); d++) cells.push(new Date(year, month, d));
    // Pad to 6 rows × 7 cols = 42
    while (cells.length < 42) cells.push(null);
    return cells;
  },

  _buildEventMap() {
    const map = {};
    for (const ev of this._events) {
      const key = ev.start_at.substring(0, 10);
      if (!map[key]) map[key] = [];
      map[key].push(ev);
    }
    return map;
  },

  _dateKey(d) {
    return d.getFullYear() + '-' +
      String(d.getMonth() + 1).padStart(2, '0') + '-' +
      String(d.getDate()).padStart(2, '0');
  },

  _fmtTime(str) {
    const d = new Date(str.replace(' ', 'T'));
    return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  },

  _fmtDateTimeFull(str) {
    const d = new Date(str.replace(' ', 'T'));
    const date = d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const isAllDay = str.endsWith('00:00:00');
    if (isAllDay) return date.charAt(0).toUpperCase() + date.slice(1);
    const time = d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    return (date.charAt(0).toUpperCase() + date.slice(1)) + ' à ' + time;
  },

  _esc(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  },

  _nl2br(str) {
    return str.replace(/\n/g, '<br>');
  }
};
