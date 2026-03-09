/* ===================================================
   APP/CONTROLLERS/MESSAGESCONTROLLER.JS
   Messagerie temps réel — polling 3s
   =================================================== */

const MessagesController = {

  _activeConvId:    null,
  _pollInterval:    null,
  _lastMsgId:       0,
  _conversations:   [],
  _titleInterval:   null,
  _origTitle:       null,
  _unreadScrolled:  0,
  _pendingFile:     null,
  _pendingFileUrl:  null,
  _readStatus:      {},

  // ================================================================
  //  RENDER — appelé depuis _discussions() dans les dashboards
  // ================================================================

  renderDiscussions(isAdmin) {
    return `
      <div class="chat-layout" id="chatLayout">

        <!-- Sidebar : liste des conversations -->
        <div class="chat-sidebar">
          <div class="chat-sidebar-header">
            <span class="chat-sidebar-title">${isAdmin ? 'Discussions' : 'Mes messages'}</span>
            ${isAdmin
              ? `<button class="chat-new-btn" onclick="MessagesController.openCreateGroup()">+ Groupe</button>`
              : ''}
          </div>
          <div class="chat-conv-list" id="convList">
            <div class="chat-state-msg">Chargement…</div>
          </div>
        </div>

        <!-- Zone principale -->
        <div class="chat-main" id="chatMain">
          <div class="chat-placeholder">
            <div class="chat-placeholder-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"
                   stroke-linecap="round" stroke-linejoin="round">
                <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
              </svg>
            </div>
            <div class="chat-placeholder-text">Sélectionnez une conversation</div>
          </div>
        </div>

      </div>
    `;
  },

  // ================================================================
  //  INIT — appelé après le render (via setTimeout)
  // ================================================================

  async init(isAdmin) {
    this.destroy(); // Nettoie un éventuel poll précédent

    const chip = document.getElementById('sessionChip');
    if (chip) chip.style.display = 'none';

    if (!isAdmin) {
      await this._ensureDefault();
    }

    await this._loadConversations();

    // Auto-ouvre la première conversation
    if (this._conversations.length > 0) {
      this.openConversation(this._conversations[0].id);
    }

    // Démarre le polling même sans conversation ouverte (détecte les nouvelles convs)
    this._startPolling();
  },

  // ================================================================
  //  CONVERSATIONS
  // ================================================================

  async _ensureDefault() {
    try { await fetch('api/messages.php?action=ensure_default'); } catch (_) {}
  },

  async _loadConversations() {
    try {
      const res  = await fetch('api/messages.php?action=conversations');
      const data = await res.json();
      this._conversations = data.conversations || [];
      this._renderConvList();
    } catch (_) {
      const el = document.getElementById('convList');
      if (el) el.innerHTML = '<div class="chat-state-msg">Erreur de chargement</div>';
    }
  },

  _renderConvList() {
    const list = document.getElementById('convList');
    if (!list) return;

    if (this._conversations.length === 0) {
      list.innerHTML = '<div class="chat-state-msg">Aucune conversation</div>';
      return;
    }

    const me = UserModel.getUser();
    list.innerHTML = this._conversations.map(conv => {
      const name     = this._convName(conv, me);
      const initials = this._convInitials(conv, me);
      const preview  = this._convPreview(conv);
      const time     = conv.last_at ? this._fmtTime(conv.last_at) : '';
      const active   = conv.id === this._activeConvId;
      const unread   = parseInt(conv.unread_count || 0);

      return `
        <div class="chat-conv-item ${active ? 'active' : ''}"
             data-id="${conv.id}"
             onclick="MessagesController.openConversation(${conv.id})">
          <div class="chat-conv-avatar">${initials}</div>
          <div class="chat-conv-info">
            <div class="chat-conv-name">${this._esc(name)}</div>
            <div class="chat-conv-preview ${unread ? 'chat-conv-preview--unread' : ''}">${this._esc(preview)}</div>
          </div>
          <div class="chat-conv-meta">
            ${time ? `<div class="chat-conv-time">${time}</div>` : ''}
            ${unread ? `<div class="chat-conv-badge">${unread > 99 ? '99+' : unread}</div>` : ''}
          </div>
        </div>
      `;
    }).join('');
  },

  // ================================================================
  //  OPEN CONVERSATION
  // ================================================================

  async openConversation(convId) {
    this._activeConvId = convId;
    this._lastMsgId    = 0;
    this._readStatus   = {};

    // Highlight sidebar item
    document.querySelectorAll('.chat-conv-item').forEach(el => {
      el.classList.toggle('active', parseInt(el.dataset.id) === convId);
    });

    const me   = UserModel.getUser();
    const conv = this._conversations.find(c => c.id === convId);
    const name = conv ? this._convName(conv, me) : '';
    const init = conv ? this._convInitials(conv, me) : '?';
    const sub  = conv ? this._convSubtitle(conv, me) : '';

    const chatMain = document.getElementById('chatMain');
    if (!chatMain) return;

    chatMain.innerHTML = `
      <div class="chat-header">
        <button class="chat-back-btn" onclick="MessagesController.closeConversation()" title="Retour">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"
               stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <div class="chat-header-avatar">${init}</div>
        <div class="chat-header-info">
          <div class="chat-header-name">${this._esc(name)}</div>
          ${sub ? `<div class="chat-header-sub">${this._esc(sub)}</div>` : ''}
        </div>
      </div>

      <div class="chat-messages" id="chatMessages">
        <div class="chat-state-msg">Chargement…</div>
      </div>

      <button id="chatScrollBtn" class="chat-scroll-btn" style="display:none"
              onclick="MessagesController._scrollToBottom()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
             stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
        <span id="chatScrollCount" class="chat-scroll-count"></span>
      </button>

      <div class="chat-input-area">
        <label class="chat-attach-btn" title="Joindre un fichier ou une image">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
               stroke-linecap="round" stroke-linejoin="round">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/>
          </svg>
          <input type="file" hidden accept="image/jpeg,image/png,image/gif,image/webp,video/mp4,video/webm,video/quicktime,.mov,.avi,application/pdf,.doc,.docx,.txt"
                 onchange="MessagesController.handleFile(this)">
        </label>
        <input type="text" class="chat-input" id="messageInput"
               placeholder="Écrire un message…"
               onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();MessagesController.sendMessage();}">
        <button class="chat-send-btn" onclick="MessagesController.sendMessage()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"
               stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>
    `;

    const msgsEl = document.getElementById('chatMessages');
    if (msgsEl) msgsEl.addEventListener('scroll', () => this._onScroll(), { passive: true });

    await this._loadMessages(convId);
    this._startPolling();
    fetch(`api/messages.php?action=mark_read&conversation_id=${convId}`).catch(() => {});

    // Mobile: show main panel
    const layout = document.getElementById('chatLayout');
    if (layout) layout.classList.add('conv-open');
  },

  // ================================================================
  //  MESSAGES
  // ================================================================

  async _loadMessages(convId) {
    try {
      const res  = await fetch(`api/messages.php?action=messages&conversation_id=${convId}`);
      const data = await res.json();
      const msgs = data.messages || [];

      if (msgs.length > 0) this._lastMsgId = parseInt(msgs[msgs.length - 1].id);
      if (data.read_status) this._readStatus = data.read_status;
      this._renderMessages(msgs);
      this._scrollBottom();
    } catch (_) {
      const el = document.getElementById('chatMessages');
      if (el) el.innerHTML = '<div class="chat-state-msg">Erreur de chargement</div>';
    }
  },

  _renderMessages(msgs) {
    const el = document.getElementById('chatMessages');
    if (!el) return;

    if (msgs.length === 0) {
      el.innerHTML = '<div class="chat-state-msg chat-state-msg--empty">Aucun message. Commencez la conversation !</div>';
      return;
    }

    const me = UserModel.getUser();
    let html = '';
    let prevMsg = null;
    let prevDay = null;

    for (const msg of msgs) {
      const day = msg.created_at.substring(0, 10);
      if (day !== prevDay) {
        html += `<div class="chat-date-sep"><span>${this._fmtDateSep(msg.created_at)}</span></div>`;
        prevDay = day;
      }
      const grouped = prevMsg && parseInt(prevMsg.sender_id) === parseInt(msg.sender_id) && day === prevDay;
      html += this._bubble(msg, me, grouped);
      prevMsg = msg;
    }
    el.innerHTML = html;
    this._updateSeenIndicator();
  },

  _bubble(msg, me, grouped = false) {
    const mine    = parseInt(msg.sender_id) === me.id;
    const time    = this._fmtTime(msg.created_at);
    const initial = (msg.firstname || '?').charAt(0).toUpperCase();

    let body = '';
    if (msg.type === 'text') {
      body = `<div class="chat-bubble-text">${this._nl2br(this._esc(msg.content))}</div>`;
    } else if (msg.type === 'image') {
      body = `<img src="${msg.file_path}" alt="${this._esc(msg.file_name)}" class="chat-bubble-image"
                   onclick="window.open('${msg.file_path}','_blank')">`;
    } else if (this._isVideoFile(msg.file_name)) {
      body = `
        <video controls class="chat-bubble-video" preload="metadata">
          <source src="${msg.file_path}">
        </video>
        <div class="chat-bubble-video-name">${this._esc(msg.file_name)}</div>
      `;
    } else {
      body = `
        <a href="${msg.file_path}" target="_blank" class="chat-bubble-file">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
               stroke-linecap="round" stroke-linejoin="round">
            <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z"/>
            <polyline points="13 2 13 9 20 9"/>
          </svg>
          <span>
            <strong>${this._esc(msg.file_name)}</strong>
            <small>${this._fmtSize(msg.file_size)}</small>
          </span>
        </a>
      `;
    }

    if (mine) {
      return `
        <div class="chat-msg chat-msg--sent${grouped ? ' chat-msg--grouped' : ''}" data-sender="${msg.sender_id}" data-id="${msg.id}">
          <div class="chat-bubble">
            ${body}
            <span class="chat-msg-time">${time}</span>
          </div>
        </div>
      `;
    }

    return `
      <div class="chat-msg chat-msg--received${grouped ? ' chat-msg--grouped' : ''}" data-sender="${msg.sender_id}">
        ${grouped
          ? `<div class="chat-msg-avatar-gap"></div>`
          : `<div class="chat-msg-avatar-sm">${initial}</div>`}
        <div class="chat-msg-body">
          ${grouped ? '' : `<div class="chat-msg-sender">${this._esc(msg.firstname)}</div>`}
          <div class="chat-bubble">
            ${body}
            <span class="chat-msg-time">${time}</span>
          </div>
        </div>
      </div>
    `;
  },

  _appendMsg(msg) {
    const el = document.getElementById('chatMessages');
    if (!el) return;
    el.querySelector('.chat-state-msg')?.remove();

    const wasAtBottom = this._isAtBottom();
    const lastEl      = el.querySelector('.chat-msg:last-child');
    const grouped     = lastEl && parseInt(lastEl.dataset.sender) === parseInt(msg.sender_id);

    const me     = UserModel.getUser();
    const isMine = parseInt(msg.sender_id) === me.id;
    const div    = document.createElement('div');
    div.innerHTML = this._bubble(msg, me, grouped);
    el.appendChild(div.firstElementChild);

    if (!isMine) {
      if (document.hidden || !document.hasFocus()) {
        this._playNotifSound();
        this._notifTitle();
      }
      if (!wasAtBottom) {
        this._unreadScrolled++;
        this._updateScrollBtn();
        return;
      }
    }

    this._scrollBottom();
  },

  // ================================================================
  //  SEND
  // ================================================================

  async sendMessage() {
    const input = document.getElementById('messageInput');
    if (!input || !this._activeConvId) return;

    const content = input.value.trim();
    if (!content) return;

    input.value    = '';
    input.disabled = true;

    try {
      const res  = await fetch('api/messages.php?action=send', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ conversation_id: this._activeConvId, content })
      });
      const data = await res.json();
      if (data.message) {
        this._appendMsg(data.message);
        this._lastMsgId = parseInt(data.message.id);
        this._scrollBottom();
        this._loadConversations(); // Refresh preview
      }
    } catch (_) {
      input.value = content;
    } finally {
      input.disabled = false;
      input.focus();
    }
  },

  // ================================================================
  //  FILE UPLOAD
  // ================================================================

  async handleFile(input) {
    if (!input.files.length || !this._activeConvId) return;
    const file = input.files[0];
    input.value = '';

    const imgTypes   = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const videoTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska'];
    if (imgTypes.includes(file.type)) {
      this._showImagePreview(file);
    } else if (videoTypes.includes(file.type) || this._isVideoFile(file.name)) {
      await this._doUpload(file);
    } else {
      await this._doUpload(file);
    }
  },

  _showImagePreview(file) {
    this._pendingFile    = file;
    this._pendingFileUrl = URL.createObjectURL(file);

    const overlay = document.createElement('div');
    overlay.id        = 'chatPreviewOverlay';
    overlay.className = 'chat-preview-overlay';
    overlay.innerHTML = `
      <div class="chat-preview-modal">
        <div class="chat-preview-header">
          <span class="chat-preview-title">Aperçu avant envoi</span>
          <button class="chat-modal-close" onclick="MessagesController._cancelPreview()">✕</button>
        </div>
        <div class="chat-preview-body">
          <img src="${this._pendingFileUrl}" class="chat-preview-img" alt="Aperçu">
          <div class="chat-preview-filename">${this._esc(file.name)}</div>
        </div>
        <div class="chat-modal-footer">
          <button class="chat-modal-cancel" onclick="MessagesController._cancelPreview()">Annuler</button>
          <button class="chat-modal-submit" id="previewSendBtn"
                  onclick="MessagesController._confirmSendImage(this)">Envoyer</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
  },

  _cancelPreview() {
    if (this._pendingFileUrl) URL.revokeObjectURL(this._pendingFileUrl);
    this._pendingFile    = null;
    this._pendingFileUrl = null;
    document.getElementById('chatPreviewOverlay')?.remove();
  },

  async _confirmSendImage(btn) {
    const file = this._pendingFile;
    if (!file) return;
    btn.disabled    = true;
    btn.textContent = 'Envoi…';
    const f = file;
    this._cancelPreview();
    await this._doUpload(f);
  },

  async _doUpload(file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('conversation_id', this._activeConvId);
    try {
      const res  = await fetch('api/messages.php?action=upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.message) {
        this._appendMsg(data.message);
        this._lastMsgId = parseInt(data.message.id);
        this._scrollBottom();
      } else if (data.error) {
        alert(data.error);
      }
    } catch (_) {}
  },

  // ================================================================
  //  POLLING — toutes les 3 secondes
  // ================================================================

  _startPolling() {
    this._stopPolling();
    this._pollInterval = setInterval(() => this._poll(), 3000);
  },

  _stopPolling() {
    if (this._pollInterval) { clearInterval(this._pollInterval); this._pollInterval = null; }
  },

  async _poll() {
    // Rafraîchit toujours la liste (détecte nouvelles convs et previews)
    await this._loadConversations();

    if (!this._activeConvId) return;
    try {
      const res  = await fetch(`api/messages.php?action=messages&conversation_id=${this._activeConvId}&after=${this._lastMsgId}`);
      const data = await res.json();

      // Update seen indicator (read_status may change even without new messages)
      if (data.read_status) {
        this._readStatus = data.read_status;
        this._updateSeenIndicator();
      }

      const msgs = (data.messages || []).filter(m => parseInt(m.id) > this._lastMsgId);
      if (msgs.length === 0) return;

      const me = UserModel.getUser();
      msgs.forEach(msg => {
        if (parseInt(msg.sender_id) !== me.id) this._appendMsg(msg);
      });
      this._lastMsgId = parseInt(msgs[msgs.length - 1].id);
      this._scrollBottom();

      // Mark conversation as read since user is actively viewing it
      fetch(`api/messages.php?action=mark_read&conversation_id=${this._activeConvId}`).catch(() => {});
    } catch (_) {}
  },

  // ================================================================
  //  ADMIN — Créer un groupe
  // ================================================================

  async openCreateGroup() {
    // Fetch all users
    let users = [];
    try {
      const res  = await fetch('api/messages.php?action=users');
      const data = await res.json();
      users = data.users || [];
    } catch (_) {
      alert('Erreur lors du chargement des utilisateurs');
      return;
    }

    // Build modal
    const overlay = document.createElement('div');
    overlay.className = 'chat-modal-overlay';
    overlay.innerHTML = `
      <div class="chat-modal">
        <div class="chat-modal-header">
          <h3 class="chat-modal-title">Nouveau groupe</h3>
          <button class="chat-modal-close" onclick="this.closest('.chat-modal-overlay').remove()">✕</button>
        </div>
        <div class="chat-modal-body">
          <label class="chat-modal-label">Nom du groupe</label>
          <input type="text" class="chat-modal-input" id="groupName" placeholder="Ex : Campagne Été 2025">

          <label class="chat-modal-label" style="margin-top:18px">Participants</label>
          <div class="chat-modal-users">
            ${users.map(u => `
              <label class="chat-modal-user">
                <input type="checkbox" value="${u.id}">
                <span class="chat-modal-user-name">${this._esc(u.firstname)} ${this._esc(u.lastname)}</span>
                <span class="chat-modal-user-role">${u.role}</span>
              </label>
            `).join('')}
          </div>
        </div>
        <div class="chat-modal-footer">
          <button class="chat-modal-cancel" onclick="this.closest('.chat-modal-overlay').remove()">Annuler</button>
          <button class="chat-modal-submit" onclick="MessagesController._submitGroup(this)">Créer le groupe</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    document.getElementById('groupName')?.focus();
  },

  async _submitGroup(btn) {
    const overlay  = btn.closest('.chat-modal-overlay');
    const name     = document.getElementById('groupName')?.value.trim();
    const checked  = [...overlay.querySelectorAll('input[type=checkbox]:checked')].map(el => parseInt(el.value));

    if (!name)            { alert('Veuillez saisir un nom de groupe'); return; }
    if (!checked.length)  { alert('Sélectionnez au moins un participant'); return; }

    btn.disabled = true;
    btn.textContent = 'Création…';

    try {
      const res  = await fetch('api/messages.php?action=create_group', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name, participants: checked })
      });
      const data = await res.json();
      overlay.remove();

      if (data.conversation_id) {
        await this._loadConversations();
        this.openConversation(data.conversation_id);
      }
    } catch (_) {
      btn.disabled = false;
      btn.textContent = 'Créer le groupe';
    }
  },

  // ================================================================
  //  CLEANUP
  // ================================================================

  closeConversation() {
    const layout = document.getElementById('chatLayout');
    if (layout) layout.classList.remove('conv-open');
  },

  destroy() {
    this._stopPolling();
    clearInterval(this._titleInterval);
    this._titleInterval = null;
    if (this._origTitle) { document.title = this._origTitle; this._origTitle = null; }
    this._cancelPreview();
    this._activeConvId   = null;
    this._lastMsgId      = 0;
    this._conversations  = [];
    this._unreadScrolled = 0;
    this._readStatus     = {};

    const chip = document.getElementById('sessionChip');
    if (chip) chip.style.display = '';
  },

  // ================================================================
  //  HELPERS
  // ================================================================

  _isVideoFile(filename) {
    return /\.(mp4|webm|mov|avi|mkv)$/i.test(filename || '');
  },

  _updateSeenIndicator() {
    const el = document.getElementById('chatMessages');
    if (!el) return;

    // Remove existing Vu indicator
    el.querySelector('.chat-seen-vu')?.remove();

    // Max read msg id across all other participants
    const readValues = Object.values(this._readStatus).map(Number);
    if (!readValues.length) return;
    const maxRead = Math.max(...readValues);
    if (maxRead === 0) return;

    // Find last sent message with id <= maxRead
    const sentEls = [...el.querySelectorAll('.chat-msg--sent[data-id]')];
    let target = null;
    for (const s of sentEls) {
      if (parseInt(s.dataset.id) <= maxRead) target = s;
    }
    if (!target) return;

    const vu = document.createElement('div');
    vu.className = 'chat-seen-vu';
    vu.textContent = 'Vu';
    target.after(vu);
  },

  _convName(conv, me) {
    if (conv.name) return conv.name;
    const others = (conv.participants || []).filter(p => parseInt(p.id) !== me.id);
    if (!others.length) return 'Vous';
    const admins = others.filter(p => p.role === 'admin');
    if (admins.length > 0 && admins.length === others.length) return 'Équipe Influmatch';
    if (others.length === 1) return `${others[0].firstname} ${others[0].lastname}`;
    return others.map(p => p.firstname).join(', ');
  },

  _convInitials(conv, me) {
    if (conv.name) return conv.name.charAt(0).toUpperCase();
    const others = (conv.participants || []).filter(p => parseInt(p.id) !== me.id);
    const admins = others.filter(p => p.role === 'admin');
    if (admins.length > 0 && admins.length === others.length) return 'IM';
    if (!others.length) return 'V';
    return (others[0].firstname || '?').charAt(0).toUpperCase();
  },

  _convSubtitle(conv, me) {
    if (!conv) return '';
    const others = (conv.participants || []).filter(p => parseInt(p.id) !== me.id);
    const admins = others.filter(p => p.role === 'admin');
    if (admins.length > 0 && conv.type === 'direct') return 'Influmatch · Co-fondateurs';
    if (conv.type === 'group') return `${(conv.participants || []).length} participants`;
    return '';
  },

  _convPreview(conv) {
    if (!conv.last_content) return 'Aucun message';
    if (conv.last_type === 'image') return '📷 Image';
    if (conv.last_type === 'file' && this._isVideoFile(conv.last_content)) return '🎥 Vidéo';
    if (conv.last_type === 'file')  return '📎 Fichier';
    const t = conv.last_content;
    return t.length > 42 ? t.substring(0, 42) + '…' : t;
  },

  _scrollBottom() {
    const el = document.getElementById('chatMessages');
    if (el) el.scrollTop = el.scrollHeight;
    this._unreadScrolled = 0;
    this._updateScrollBtn();
  },

  _scrollToBottom() {
    this._unreadScrolled = 0;
    this._updateScrollBtn();
    this._scrollBottom();
  },

  _isAtBottom() {
    const el = document.getElementById('chatMessages');
    if (!el) return true;
    return el.scrollHeight - el.scrollTop - el.clientHeight < 80;
  },

  _updateScrollBtn() {
    const btn   = document.getElementById('chatScrollBtn');
    const badge = document.getElementById('chatScrollCount');
    if (!btn) return;
    const n = this._unreadScrolled;
    btn.style.display = n > 0 ? 'flex' : 'none';
    if (badge) badge.textContent = n > 0 ? (n > 99 ? '99+' : n) : '';
  },

  _onScroll() {
    if (this._isAtBottom()) {
      this._unreadScrolled = 0;
      this._updateScrollBtn();
    }
  },

  _playNotifSound() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const t   = ctx.currentTime;

      const _note = (freq, start, dur) => {
        const osc  = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type            = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, t + start);
        gain.gain.linearRampToValueAtTime(0.22, t + start + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.001, t + start + dur);
        osc.start(t + start);
        osc.stop(t + start + dur);
      };

      _note(988, 0,    0.28); // Si5 — première frappe
      _note(784, 0.18, 0.38); // Sol5 — deuxième frappe (légère superposition)
    } catch (_) {}
  },

  _notifTitle() {
    if (!this._origTitle) this._origTitle = document.title;
    clearInterval(this._titleInterval);
    let on = true;
    this._titleInterval = setInterval(() => {
      document.title = on ? '💬 Nouveau message — Influmatch' : this._origTitle;
      on = !on;
    }, 1000);
    const restore = () => {
      clearInterval(this._titleInterval);
      this._titleInterval = null;
      document.title = this._origTitle;
      window.removeEventListener('focus', restore);
    };
    window.addEventListener('focus', restore);
  },

  _fmtTime(str) {
    const d   = new Date(str);
    const now = new Date();
    if (d.toDateString() === now.toDateString()) {
      return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    }
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
  },

  _fmtDateSep(str) {
    const d   = new Date(str);
    const now = new Date();
    const yesterday = new Date(now); yesterday.setDate(now.getDate() - 1);
    if (d.toDateString() === now.toDateString())       return 'Aujourd\'hui';
    if (d.toDateString() === yesterday.toDateString()) return 'Hier';
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  },

  _fmtSize(bytes) {
    if (!bytes) return '';
    if (bytes < 1024)       return bytes + ' o';
    if (bytes < 1048576)    return Math.round(bytes / 1024) + ' Ko';
    return (bytes / 1048576).toFixed(1) + ' Mo';
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
