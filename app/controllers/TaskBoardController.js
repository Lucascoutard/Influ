/* ===================================================
   APP/CONTROLLERS/TASKBOARDCONTROLLER.JS
   Campaign task board — Monday.com style
   Roles: admin (full), influencer (edit), brand (validate)
   =================================================== */

const TaskBoardController = {

  _collabId:    null,
  _collabTitle: '',
  _collabData:  null,   // { brand_id, influencer_id, ... }
  _tasks:       [],
  _userRole:    'readonly', // 'admin' | 'influencer' | 'brand' | 'readonly'
  _filter:      { platform: '', search: '' },
  _dragTaskId:  null,

  COLUMNS: [
    { key: 'todo',        label: 'To do',       color: '#64748b', bg: '#f8fafc' },
    { key: 'in_progress', label: 'In progress',  color: '#f59e0b', bg: '#fffbeb' },
    { key: 'done',        label: 'Done',         color: '#22c55e', bg: '#f0fdf4' },
    { key: 'validated',   label: 'Validated ✓',  color: '#6366f1', bg: '#eef2ff' },
  ],

  PLATFORMS:     ['Instagram', 'TikTok', 'YouTube', 'LinkedIn', 'Twitter/X', 'Podcast', 'Blog', 'Other'],
  CONTENT_TYPES: ['Reel', 'Photo', 'Story', 'Video', 'Post', 'Short', 'Article', 'Other'],

  // ── Permissions ─────────────────────────────────
  _detectRole(collab) {
    const me = UserModel.getUser();
    if (!me) return 'readonly';
    if (me.role === 'admin') return 'admin';
    const myId = parseInt(me.id);
    if (parseInt(collab.influencer_id) === myId) return 'influencer';
    if (parseInt(collab.brand_id)      === myId) return 'brand';
    return 'readonly';
  },

  _canCreate()           { return this._userRole === 'admin'; },
  _canEdit()             { return this._userRole === 'admin'; },
  _canDelete()           { return this._userRole === 'admin'; },
  _canMove()             { return ['admin', 'influencer'].includes(this._userRole); },
  _canMoveTo(task, to)   {
    if (this._userRole === 'admin')      return true;
    if (this._userRole === 'influencer') return to !== 'validated';
    if (this._userRole === 'brand')      return (task.status === 'done'      && to === 'validated')
                                              || (task.status === 'validated' && to === 'done');
    return false;
  },

  _showStatusControls() { return this._canMove(); },

  _esc: s => String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'),

  // ================================================================
  //  OPEN
  // ================================================================

  open(collabId, collabData) {
    this._collabId    = collabId;
    this._collabTitle = collabData.title || '';
    this._collabData  = collabData;
    this._userRole    = this._detectRole(collabData);
    this._filter      = { platform: '', search: '' };
    this._tasks       = [];

    document.getElementById('taskBoardOverlay')?.remove();

    const overlay = document.createElement('div');
    overlay.className = 'tb-overlay';
    overlay.id        = 'taskBoardOverlay';
    overlay.innerHTML = this._renderShell();
    document.body.appendChild(overlay);
    overlay.addEventListener('click', e => { if (e.target === overlay) this.close(); });

    this._loadTasks();
  },

  close() {
    document.getElementById('taskBoardOverlay')?.remove();
  },

  // ================================================================
  //  SHELL
  // ================================================================

  _renderShell() {
    const roleLabel = { admin: 'Admin', influencer: 'Influencer', brand: 'Brand', readonly: 'Read only' };
    const roleColor = { admin: '#6366f1', influencer: '#22c55e', brand: '#f59e0b', readonly: '#94a3b8' };
    const r = this._userRole;

    const platforms = ['', ...this.PLATFORMS].map(p =>
      `<option value="${p}">${p || 'All platforms'}</option>`
    ).join('');

    return `
      <div class="tb-modal">

        <!-- ── Header ── -->
        <div class="tb-header">
          <div class="tb-header-left">
            <div class="tb-header-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"
                   stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>
              </svg>
            </div>
            <div>
              <div class="tb-header-title">${this._esc(this._collabTitle)}</div>
              <div class="tb-header-sub">Campaign tracker</div>
            </div>
          </div>
          <div class="tb-header-right">
            <span class="tb-role-badge" style="background:${roleColor[r]}20;color:${roleColor[r]};border-color:${roleColor[r]}40">
              ${roleLabel[r] || r}
            </span>
            ${this._canCreate() ? `
              <button class="tb-add-btn" onclick="TaskBoardController._openTaskForm(null)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"
                     stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
                New task
              </button>
            ` : ''}
            <button class="tb-close-btn" onclick="TaskBoardController.close()">✕</button>
          </div>
        </div>

        <!-- ── Toolbar ── -->
        <div class="tb-toolbar">
          <div class="tb-search-wrap">
            <svg class="tb-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input class="tb-search" id="tbSearch" placeholder="Search tasks…"
                   oninput="TaskBoardController._onFilter()">
          </div>
          <select class="tb-filter-select" id="tbPlatformFilter"
                  onchange="TaskBoardController._onFilter()">
            ${platforms}
          </select>
          <div id="tbProgressWrap" class="tb-progress-inline"></div>
        </div>

        <!-- ── Board ── -->
        <div class="tb-body" id="tbBody">
          <div class="tb-loading">
            <div class="tb-loading-dots"><span></span><span></span><span></span></div>
            Loading board…
          </div>
        </div>
      </div>
    `;
  },

  // ================================================================
  //  LOAD
  // ================================================================

  async _loadTasks() {
    try {
      const res  = await fetch(`api/tasks.php?action=list&collab_id=${this._collabId}`);
      const data = await res.json();
      if (!data.success) {
        const b = document.getElementById('tbBody');
        if (b) b.innerHTML = `<div class="tb-error">⚠ ${this._esc(data.message || 'Unknown error')}</div>`;
        return;
      }
      this._tasks = data.tasks || [];
      this._renderBoard();
    } catch (_) {
      const b = document.getElementById('tbBody');
      if (b) b.innerHTML = `<div class="tb-error">⚠ Network error.</div>`;
    }
  },

  // ================================================================
  //  FILTER
  // ================================================================

  _onFilter() {
    this._filter.search   = document.getElementById('tbSearch')?.value?.toLowerCase() || '';
    this._filter.platform = document.getElementById('tbPlatformFilter')?.value || '';
    this._renderBoard();
  },

  _filteredTasks() {
    return this._tasks.filter(t => {
      if (this._filter.platform && (t.platform || '') !== this._filter.platform) return false;
      if (this._filter.search) {
        const hay = `${t.title} ${t.notes || ''} ${t.platform || ''} ${t.content_type || ''}`.toLowerCase();
        if (!hay.includes(this._filter.search)) return false;
      }
      return true;
    });
  },

  // ================================================================
  //  BOARD RENDER
  // ================================================================

  _renderBoard() {
    const body = document.getElementById('tbBody');
    if (!body) return;

    const all     = this._tasks;
    const visible = this._filteredTasks();

    // Progress bar
    const total = all.length;
    const done  = all.filter(t => t.status === 'done' || t.status === 'validated').length;
    const pct   = total > 0 ? Math.round((done / total) * 100) : 0;
    const prog  = document.getElementById('tbProgressWrap');
    if (prog) {
      prog.innerHTML = total > 0 ? `
        <div class="tb-progress-inline-bar">
          <div class="tb-progress-inline-fill" style="width:${pct}%"></div>
        </div>
        <span class="tb-progress-inline-label">${done}/${total} completed (${pct}%)</span>
      ` : `<span class="tb-progress-inline-label" style="color:var(--text-muted)">No tasks</span>`;
    }

    // Columns
    const cols = this.COLUMNS.map(col => {
      const tasks = visible.filter(t => t.status === col.key);
      const allN  = all.filter(t => t.status === col.key).length;
      const cards = tasks.length === 0
        ? `<div class="tb-col-empty">
             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
                  stroke-linecap="round" stroke-linejoin="round" style="width:24px;height:24px;opacity:.3">
               <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
             </svg>
             <span>${this._filter.search || this._filter.platform ? 'No results' : 'Empty'}</span>
           </div>`
        : tasks.map(t => this._renderCard(t)).join('');

      return `
        <div class="tb-col">
          <div class="tb-col-header" style="--col-color:${col.color}">
            <div class="tb-col-header-left">
              <span class="tb-col-dot" style="background:${col.color}"></span>
              <span class="tb-col-title">${col.label}</span>
              <span class="tb-col-count">${allN}</span>
            </div>
            ${this._canCreate() ? `
              <button class="tb-col-add-btn" title="Add to this column"
                      onclick="TaskBoardController._openTaskForm(null, '${col.key}')">+</button>
            ` : ''}
          </div>
          <div class="tb-col-tasks" id="tbCol_${col.key}"
               ondragover="TaskBoardController._onDragOver(event,'${col.key}')"
               ondragleave="TaskBoardController._onDragLeave(event)"
               ondrop="TaskBoardController._onDrop(event,'${col.key}')">
            ${cards}
          </div>
        </div>
      `;
    }).join('');

    body.innerHTML = `<div class="tb-board">${cols}</div>`;
  },

  // ================================================================
  //  CARD
  // ================================================================

  _renderCard(t) {
    const today   = new Date(); today.setHours(0,0,0,0);
    const due     = t.due_date ? new Date(t.due_date) : null;
    const overdue = due && due < today && t.status !== 'done' && t.status !== 'validated';
    const dueFmt  = due ? due.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) : null;

    const platformColors = {
      Instagram: { bg: '#fce7f3', text: '#be185d' },
      TikTok:    { bg: '#f0fdf4', text: '#15803d' },
      YouTube:   { bg: '#fef2f2', text: '#b91c1c' },
      LinkedIn:  { bg: '#eff6ff', text: '#1d4ed8' },
      'Twitter/X': { bg: '#f8fafc', text: '#0f172a' },
      Podcast:   { bg: '#faf5ff', text: '#7c3aed' },
      Blog:      { bg: '#fffbeb', text: '#92400e' },
    };
    const pc = platformColors[t.platform] || { bg: '#f1f5f9', text: '#475569' };

    const validateBtn = this._userRole === 'brand' && t.status === 'done' ? `
      <button class="tb-validate-btn" onclick="TaskBoardController._moveTask(${t.id}, 'validated')">
        ✓ Approve
      </button>
    ` : '';
    const unvalidateBtn = this._userRole === 'brand' && t.status === 'validated' ? `
      <button class="tb-unvalidate-btn" onclick="TaskBoardController._moveTask(${t.id}, 'done')">
        ↩ Unapprove
      </button>
    ` : '';

    let actionHtml = '';
    if (this._canMove()) {
      const opts = this.COLUMNS.map(c => `
        <option value="${c.key}"
                ${t.status === c.key ? 'selected' : ''}
                ${t.status !== c.key && !this._canMoveTo(t, c.key) ? 'disabled' : ''}>
          ${c.label}
        </option>`).join('');
      actionHtml = `
        <div class="tb-card-status-row">
          <select class="tb-status-select" onchange="TaskBoardController._moveTask(${t.id}, this.value)">
            ${opts}
          </select>
        </div>`;
    } else if (validateBtn || unvalidateBtn) {
      actionHtml = `<div class="tb-card-move">${validateBtn}${unvalidateBtn}</div>`;
    }

    const draggable = this._canMove()
      ? `draggable="true" ondragstart="TaskBoardController._onDragStart(event,${t.id})" ondragend="TaskBoardController._onDragEnd(event)"`
      : '';

    return `
      <div class="tb-card ${overdue ? 'tb-card--overdue' : ''} ${t.status === 'validated' ? 'tb-card--validated' : ''}"
           data-id="${t.id}" ${draggable}>

        <!-- Top row: title + actions -->
        <div class="tb-card-top">
          <div class="tb-card-title" onclick="TaskBoardController._openTaskDetail(${t.id})">${this._esc(t.title)}</div>
          <div class="tb-card-actions">
            ${this._canEdit() ? `
              <button class="tb-card-btn" title="Edit" onclick="TaskBoardController._openTaskForm(${t.id})">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                     stroke-linecap="round" stroke-linejoin="round" style="width:13px;height:13px">
                  <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
              </button>
            ` : ''}
            ${this._canDelete() ? `
              <button class="tb-card-btn tb-card-btn--del" title="Delete"
                      onclick="TaskBoardController._deleteTask(${t.id})">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                     stroke-linecap="round" stroke-linejoin="round" style="width:13px;height:13px">
                  <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </button>
            ` : ''}
          </div>
        </div>

        <!-- Platform + type chips -->
        ${t.platform || t.content_type ? `
          <div class="tb-card-chips">
            ${t.platform ? `<span class="tb-chip-platform" style="background:${pc.bg};color:${pc.text}">${this._esc(t.platform)}</span>` : ''}
            ${t.content_type ? `<span class="tb-chip-type">${this._esc(t.content_type)}</span>` : ''}
          </div>
        ` : ''}

        <!-- Notes (2 lines max) -->
        ${t.notes ? `<div class="tb-card-notes">${this._esc(t.notes)}</div>` : ''}

        <!-- Footer: due date + url -->
        ${dueFmt || t.published_url ? `
          <div class="tb-card-footer">
            ${dueFmt ? `
              <span class="tb-card-due ${overdue ? 'tb-card-due--late' : ''}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                     stroke-linecap="round" stroke-linejoin="round" style="width:11px;height:11px">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                ${dueFmt}${overdue ? ' · Overdue' : ''}
              </span>` : ''}
            ${t.published_url ? `
              <a class="tb-card-url" href="${this._esc(t.published_url)}" target="_blank" rel="noopener">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                     stroke-linecap="round" stroke-linejoin="round" style="width:11px;height:11px">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                  <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
                View content
              </a>` : ''}
          </div>
        ` : ''}

        <!-- Status / validate actions -->
        ${actionHtml}
      </div>
    `;
  },

  // ================================================================
  //  DRAG & DROP
  // ================================================================

  _onDragStart(e, taskId) {
    this._dragTaskId = taskId;
    e.dataTransfer.effectAllowed = 'move';
    e.currentTarget.classList.add('tb-card--dragging');
  },

  _onDragEnd(e) {
    e.currentTarget.classList.remove('tb-card--dragging');
    document.querySelectorAll('.tb-col-tasks--drag-over').forEach(c => c.classList.remove('tb-col-tasks--drag-over'));
  },

  _onDragOver(e, colKey) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    const col = document.getElementById(`tbCol_${colKey}`);
    if (col) col.classList.add('tb-col-tasks--drag-over');
  },

  _onDragLeave(e) {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      e.currentTarget.classList.remove('tb-col-tasks--drag-over');
    }
  },

  _onDrop(e, colKey) {
    e.preventDefault();
    document.querySelectorAll('.tb-col-tasks--drag-over').forEach(c => c.classList.remove('tb-col-tasks--drag-over'));
    const taskId = this._dragTaskId;
    this._dragTaskId = null;
    if (!taskId) return;
    const task = this._tasks.find(t => parseInt(t.id) === taskId);
    if (!task || task.status === colKey) return;
    if (!this._canMoveTo(task, colKey)) return;
    this._moveTask(taskId, colKey);
  },

  // ================================================================
  //  DETAIL (read-only for brand)
  // ================================================================

  _openTaskDetail(taskId) {
    const t = this._tasks.find(x => parseInt(x.id) === taskId);
    if (!t) return;

    if (this._canEdit()) { this._openTaskForm(taskId); return; }

    const due    = t.due_date ? new Date(t.due_date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : null;
    const colCfg = this.COLUMNS.find(c => c.key === t.status) || this.COLUMNS[0];

    document.getElementById('tbDetailOverlay')?.remove();
    const ov = document.createElement('div');
    ov.className = 'tb-form-overlay'; ov.id = 'tbDetailOverlay';
    ov.innerHTML = `
      <div class="tb-form-modal">
        <div class="tb-form-header">
          <h3 class="tb-form-title">${this._esc(t.title)}</h3>
          <button class="tb-close-btn" onclick="document.getElementById('tbDetailOverlay').remove()">✕</button>
        </div>
        <div class="tb-form-body" style="gap:10px">
          <div class="tb-detail-row"><span class="tb-detail-label">Status</span>
            <span class="tb-detail-badge" style="background:${colCfg.color}20;color:${colCfg.color}">${colCfg.label}</span></div>
          ${t.platform ? `<div class="tb-detail-row"><span class="tb-detail-label">Platform</span><span>${this._esc(t.platform)}</span></div>` : ''}
          ${t.content_type ? `<div class="tb-detail-row"><span class="tb-detail-label">Type</span><span>${this._esc(t.content_type)}</span></div>` : ''}
          ${due ? `<div class="tb-detail-row"><span class="tb-detail-label">Due date</span><span>${due}</span></div>` : ''}
          ${t.published_url ? `<div class="tb-detail-row"><span class="tb-detail-label">Published content</span>
            <a href="${this._esc(t.published_url)}" target="_blank" rel="noopener" class="tb-card-url" style="font-size:.85rem">${this._esc(t.published_url)}</a></div>` : ''}
          ${t.notes ? `<div class="tb-detail-notes">${this._esc(t.notes)}</div>` : ''}
        </div>
        ${this._userRole === 'brand' && t.status === 'done' ? `
          <div class="tb-form-footer">
            <button class="tb-form-cancel" onclick="document.getElementById('tbDetailOverlay').remove()">Close</button>
            <button class="tb-validate-btn-lg"
                    onclick="document.getElementById('tbDetailOverlay').remove(); TaskBoardController._moveTask(${t.id}, 'validated')">
              ✓ Approve this task
            </button>
          </div>
        ` : `
          <div class="tb-form-footer">
            <button class="tb-form-cancel" onclick="document.getElementById('tbDetailOverlay').remove()">Close</button>
          </div>
        `}
      </div>
    `;
    document.body.appendChild(ov);
    ov.addEventListener('click', e => { if (e.target === ov) ov.remove(); });
  },

  // ================================================================
  //  ADD / EDIT FORM
  // ================================================================

  _openTaskForm(taskIdOrNull, defaultStatus = 'todo') {
    const isEdit = taskIdOrNull !== null;
    const t      = isEdit ? this._tasks.find(x => parseInt(x.id) === taskIdOrNull) : null;
    if (isEdit && !t) return;

    document.getElementById('tbFormOverlay')?.remove();

    const statusOpts = this.COLUMNS
      .filter(c => isEdit || this._canMoveTo({ status: defaultStatus }, c.key) || c.key === defaultStatus)
      .map(c => `<option value="${c.key}" ${(t?.status || defaultStatus) === c.key ? 'selected' : ''}>${c.label}</option>`)
      .join('');

    const platformOpts = ['', ...this.PLATFORMS].map(p =>
      `<option value="${p}" ${(t?.platform || '') === p ? 'selected' : ''}>${p || '— Platform —'}</option>`
    ).join('');

    const typeOpts = ['', ...this.CONTENT_TYPES].map(p =>
      `<option value="${p}" ${(t?.content_type || '') === p ? 'selected' : ''}>${p || '— Content type —'}</option>`
    ).join('');

    const ov = document.createElement('div');
    ov.className = 'tb-form-overlay'; ov.id = 'tbFormOverlay';
    ov.innerHTML = `
      <div class="tb-form-modal">
        <div class="tb-form-header">
          <h3 class="tb-form-title">${isEdit ? 'Edit task' : 'New task'}</h3>
          <button class="tb-close-btn" onclick="document.getElementById('tbFormOverlay').remove()">✕</button>
        </div>
        <div class="tb-form-body">
          <div class="tb-form-field tb-form-field--full">
            <label class="tb-form-label">Title *</label>
            <input class="tb-form-input" id="tbfTitle" placeholder="e.g. Unboxing reel for product X"
                   value="${this._esc(t?.title || '')}">
          </div>
          <div class="tb-form-row">
            <div class="tb-form-field">
              <label class="tb-form-label">Platform</label>
              <select class="tb-form-input" id="tbfPlatform">${platformOpts}</select>
            </div>
            <div class="tb-form-field">
              <label class="tb-form-label">Content type</label>
              <select class="tb-form-input" id="tbfType">${typeOpts}</select>
            </div>
          </div>
          <div class="tb-form-row">
            <div class="tb-form-field">
              <label class="tb-form-label">Column</label>
              <select class="tb-form-input" id="tbfStatus">${statusOpts}</select>
            </div>
            <div class="tb-form-field">
              <label class="tb-form-label">Due date</label>
              <input class="tb-form-input" id="tbfDue" type="date" value="${this._esc(t?.due_date || '')}">
            </div>
          </div>
          <div class="tb-form-field tb-form-field--full">
            <label class="tb-form-label">Published content URL</label>
            <input class="tb-form-input" id="tbfUrl" type="url"
                   placeholder="https://www.instagram.com/p/…"
                   value="${this._esc(t?.published_url || '')}">
          </div>
          <div class="tb-form-field tb-form-field--full">
            <label class="tb-form-label">Notes / Brief</label>
            <textarea class="tb-form-input" id="tbfNotes" rows="3"
                      placeholder="Instructions, constraints, remarks…">${this._esc(t?.notes || '')}</textarea>
          </div>
          <div id="tbfError" class="tb-form-error" style="display:none"></div>
        </div>
        <div class="tb-form-footer">
          <button class="tb-form-cancel" onclick="document.getElementById('tbFormOverlay').remove()">Cancel</button>
          <button class="tb-form-submit" id="tbfSubmit"
                  onclick="TaskBoardController._submitForm(${isEdit ? taskIdOrNull : 'null'}, this)">
            ${isEdit ? 'Save' : 'Create task'}
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(ov);
    ov.addEventListener('click', e => { if (e.target === ov) ov.remove(); });
    document.getElementById('tbfTitle')?.focus();
  },

  async _submitForm(taskId, btn) {
    const get    = id => document.getElementById(id)?.value?.trim() || '';
    const errEl  = document.getElementById('tbfError');
    const title  = get('tbfTitle');

    if (!title) {
      errEl.textContent = 'Title is required.'; errEl.style.display = 'block'; return;
    }
    errEl.style.display = 'none';
    btn.disabled = true; btn.textContent = 'Saving…';

    const isEdit = taskId !== null;
    const body   = {
      collab_id:    this._collabId,
      title,
      platform:      get('tbfPlatform'),
      content_type:  get('tbfType'),
      status:        get('tbfStatus'),
      due_date:      get('tbfDue'),
      published_url: get('tbfUrl'),
      notes:         get('tbfNotes'),
    };
    if (isEdit) body.id = taskId;

    try {
      const res  = await fetch(`api/tasks.php?action=${isEdit ? 'update' : 'create'}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!data.success) {
        errEl.textContent = data.message || 'Error.'; errEl.style.display = 'block';
        btn.disabled = false; btn.textContent = isEdit ? 'Save' : 'Create task';
        return;
      }

      document.getElementById('tbFormOverlay')?.remove();

      if (isEdit) {
        const idx = this._tasks.findIndex(t => parseInt(t.id) === taskId);
        if (idx !== -1) Object.assign(this._tasks[idx], {
          title: body.title, platform: body.platform || null,
          content_type: body.content_type || null, status: body.status,
          due_date: body.due_date || null, published_url: body.published_url || null,
          notes: body.notes || null,
        });
      } else {
        this._tasks.push(data.task);
      }
      this._renderBoard();
    } catch (_) {
      errEl.textContent = 'Network error.'; errEl.style.display = 'block';
      btn.disabled = false; btn.textContent = isEdit ? 'Save' : 'Create task';
    }
  },

  // ================================================================
  //  MOVE
  // ================================================================

  async _moveTask(taskId, newStatus) {
    const idx = this._tasks.findIndex(t => parseInt(t.id) === taskId);
    if (idx === -1) return;
    const old = this._tasks[idx].status;
    this._tasks[idx].status = newStatus;
    this._renderBoard();

    try {
      const res  = await fetch('api/tasks.php?action=update', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: taskId, status: newStatus }),
      });
      const data = await res.json();
      if (!data.success) { this._tasks[idx].status = old; this._renderBoard(); }
    } catch (_) {
      this._tasks[idx].status = old; this._renderBoard();
    }
  },

  // ================================================================
  //  DELETE
  // ================================================================

  async _deleteTask(taskId) {
    if (!confirm('Permanently delete this task?')) return;
    try {
      const res  = await fetch('api/tasks.php?action=delete', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: taskId }),
      });
      const data = await res.json();
      if (data.success) { this._tasks = this._tasks.filter(t => parseInt(t.id) !== taskId); this._renderBoard(); }
    } catch (_) {}
  },
};
