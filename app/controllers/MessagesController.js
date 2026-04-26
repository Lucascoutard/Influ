/* ===================================================
   APP/CONTROLLERS/MESSAGESCONTROLLER.JS
   Real-time messaging - polling every 3s
   =================================================== */

const MessagesController = {

  _activeConvId:      null,
  _pollInterval:      null,
  _lastMsgId:         0,
  _conversations:     [],
  _titleInterval:     null,
  _origTitle:         null,
  _unreadScrolled:    0,
  _pendingFile:       null,
  _pendingFileUrl:    null,
  _readStatus:        {},
  _visibilityHandler: null,

  // ================================================================
  //  RENDER - called from _discussions() in dashboards
  // ================================================================

  renderDiscussions(isAdmin) {
    return `
      <div class="chat-layout" id="chatLayout">

        <!-- Sidebar : liste des conversations -->
        <div class="chat-sidebar">
          <div class="chat-sidebar-header">
            <span class="chat-sidebar-title">${isAdmin ? 'Conversations' : 'My messages'}</span>
            ${isAdmin
              ? `<button class="chat-new-btn" onclick="MessagesController.openCreateGroup()">+ Group</button>`
              : ''}
          </div>
          <div class="chat-conv-list" id="convList">
            <div class="chat-state-msg">Loading...</div>
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
            <div class="chat-placeholder-text">Select a conversation</div>
          </div>
        </div>

      </div>
    `;
  },

  // ================================================================
  //  INIT - called after render (via setTimeout)
  // ================================================================

  async init(isAdmin) {
    this.destroy(); // Clean previous poll if any

    const chip = document.getElementById('sessionChip');
    if (chip) chip.style.display = 'none';

    if (!isAdmin) {
      await this._ensureDefault();
    }

    await this._loadConversations();

    // Demande permission notifications navigateur
    this._requestNotifPermission();

    // Pause polling when tab is hidden
    this._visibilityHandler = () => {
      if (document.hidden) { this._stopPolling(); }
      else                 { this._startPolling(); }
    };
    document.addEventListener('visibilitychange', this._visibilityHandler);

    // Start listening for incoming calls
    CallController.startListening();

    // Auto-open first conversation
    if (this._conversations.length > 0) {
      this.openConversation(this._conversations[0].id);
    }

    // Start polling even with no conversation open (detect new conversations)
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
      const res  = await fetch('api/messages.php?action=conversations', { cache: 'no-store' });
      const data = await res.json();
      this._conversations = data.conversations || [];
      this._renderConvList();
    } catch (_) {
      const el = document.getElementById('convList');
      if (el) el.innerHTML = '<div class="chat-state-msg">Loading error</div>';
    }
  },

  _renderConvList() {
    const list = document.getElementById('convList');
    if (!list) return;

    if (this._conversations.length === 0) {
      list.innerHTML = '<div class="chat-state-msg">No conversation</div>';
      return;
    }

    const me = UserModel.getUser();
    // Pin Influmatch team conversation first
    const convs = [...this._conversations].sort((a, b) => {
      const aPin = this._isInflumatchConv(a, me) ? -1 : 0;
      const bPin = this._isInflumatchConv(b, me) ? -1 : 0;
      return aPin - bPin;
    });
    list.innerHTML = convs.map(conv => {
      const name     = this._convName(conv, me);
      const initials = this._convInitials(conv, me);
      const preview  = this._convPreview(conv);
      const time     = conv.last_at ? this._fmtTime(conv.last_at) : '';
      const active   = conv.id === this._activeConvId;
      const unread   = parseInt(conv.unread_count || 0);
      const pinned   = this._isInflumatchConv(conv, me);

      return `
        <div class="chat-conv-item ${active ? 'active' : ''} ${pinned ? 'chat-conv-item--pinned' : ''}"
             data-id="${conv.id}"
             onclick="MessagesController.openConversation(${conv.id})">
          <div class="chat-conv-avatar">${initials}</div>
          <div class="chat-conv-info">
            <div class="chat-conv-name">${this._esc(name)}${pinned ? ' <span class="chat-conv-pin">PIN</span>' : ''}</div>
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

    const isDirect  = conv && conv.type === 'direct';
    const isGroup   = conv && conv.type === 'group';
    const isAdmin   = me && me.role === 'admin';

    chatMain.innerHTML = `
      <div class="chat-header">
        <button class="chat-back-btn" onclick="MessagesController.closeConversation()" title="Back">
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
        ${isDirect ? `
        <div class="chat-call-actions">
          <button class="chat-call-btn" title="Audio call"
                  onclick="CallController.startCall(${convId}, '${this._esc(name)}', false)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                 stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.22 1.18 2 2 0 012.22 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.56-.56a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/>
            </svg>
          </button>
          <button class="chat-call-btn" title="Video call"
                  onclick="CallController.startCall(${convId}, '${this._esc(name)}', true)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                 stroke-linecap="round" stroke-linejoin="round">
              <polygon points="23 7 16 12 23 17 23 7"/>
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
            </svg>
          </button>
        </div>` : ''}
        ${isGroup && isAdmin ? `
        <div class="chat-call-actions">
          <button class="chat-call-btn" title="Edit group"
                  onclick="MessagesController.openEditGroup(${convId})">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                 stroke-linecap="round" stroke-linejoin="round">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
          <button class="chat-call-btn" title="Delete group"
                  onclick="MessagesController.deleteGroup(${convId})">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                 stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
              <path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
            </svg>
          </button>
        </div>` : ''}
      </div>

      <div class="chat-messages" id="chatMessages">
        <div class="chat-state-msg">Loading...</div>
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
        <label class="chat-attach-btn" title="Attach a file or an image">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
               stroke-linecap="round" stroke-linejoin="round">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/>
          </svg>
          <input type="file" hidden accept="image/jpeg,image/png,image/gif,image/webp,video/mp4,video/webm,video/quicktime,.mov,.avi,application/pdf,.doc,.docx,.txt"
                 onchange="MessagesController.handleFile(this)">
        </label>
        <input type="text" class="chat-input" id="messageInput"
               placeholder="Write a message..."
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
    this._markConversationRead(convId);

    // Mobile: show main panel
    const layout = document.getElementById('chatLayout');
    if (layout) layout.classList.add('conv-open');
  },

  // ================================================================
  //  MESSAGES
  // ================================================================

  async _loadMessages(convId) {
    try {
      const res  = await fetch(`api/messages.php?action=messages&conversation_id=${convId}`, { cache: 'no-store' });
      const data = await res.json();
      const msgs = data.messages || [];

      if (msgs.length > 0) this._lastMsgId = parseInt(msgs[msgs.length - 1].id);
      if (data.read_status) this._readStatus = data.read_status;
      this._renderMessages(msgs);
      this._scrollBottom();
    } catch (_) {
      const el = document.getElementById('chatMessages');
      if (el) el.innerHTML = '<div class="chat-state-msg">Loading error</div>';
    }
  },

  _renderMessages(msgs) {
    const el = document.getElementById('chatMessages');
    if (!el) return;

    if (msgs.length === 0) {
      el.innerHTML = '<div class="chat-state-msg chat-state-msg--empty">No messages yet. Start the conversation!</div>';
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

    // Call event: centered bubble (no sender/receiver wrapper)
    if (msg.type === 'call_event') {
      let parsed = {};
      try { parsed = JSON.parse(msg.content); } catch (_) {}
      const callType = parsed.call_type === 'video' ? 'video' : 'audio';
      const duration = parsed.duration;
      let icon, label, cls;
      if (parsed.status === 'ended') {
        const dur = duration ? ' - ' + this._fmtDuration(duration) : '';
        icon  = 'Call';
        label = `Call ${callType}${dur}`;
        cls   = '';
      } else {
        icon  = 'Missed';
        label = `Call ${callType} missed`;
        cls   = 'chat-call-event--missed';
      }
      return `<div class="chat-call-event ${cls}"><span>${icon}</span><span>${label}</span></div>`;
    }

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

    const editedTag  = msg.edited_at ? `<span class="chat-msg-edited">edited</span>` : '';
    const avatarHtml = msg.avatar
      ? `<img src="${msg.avatar}" class="chat-msg-avatar-sm chat-msg-avatar-img" alt="">`
      : `<div class="chat-msg-avatar-sm">${initial}</div>`;

    const msgActions = mine && msg.type === 'text' ? `
      <div class="chat-msg-actions">
        <button class="chat-msg-action-btn" title="Edit" onclick="MessagesController.startEdit(${msg.id}, this)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </button>
        <button class="chat-msg-action-btn chat-msg-action-btn--delete" title="Delete" onclick="MessagesController.deleteMsg(${msg.id}, this)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
            <path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
          </svg>
        </button>
      </div>` : '';

    if (mine) {
      return `
        <div class="chat-msg chat-msg--sent${grouped ? ' chat-msg--grouped' : ''}" data-sender="${msg.sender_id}" data-id="${msg.id}">
          ${msgActions}
          <div class="chat-bubble">
            ${body}
            <span class="chat-msg-time">${time}${editedTag}</span>
          </div>
        </div>
      `;
    }

    return `
      <div class="chat-msg chat-msg--received${grouped ? ' chat-msg--grouped' : ''}" data-sender="${msg.sender_id}">
        ${grouped
          ? `<div class="chat-msg-avatar-gap"></div>`
          : avatarHtml}
        <div class="chat-msg-body">
          ${grouped ? '' : `<div class="chat-msg-sender">${this._esc(msg.firstname)}</div>`}
          <div class="chat-bubble">
            ${body}
            <span class="chat-msg-time">${time}${editedTag}</span>
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
        this._showBrowserNotif(msg);
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
  //  GROUP MANAGEMENT (admin)
  // ================================================================

  openEditGroup(convId) {
    const conv = this._conversations.find(c => c.id === convId);
    if (!conv) return;

    const overlay = document.createElement('div');
    overlay.id = 'groupEditOverlay';
    overlay.className = 'chat-preview-overlay';
    overlay.innerHTML = `
      <div class="chat-preview-modal" style="max-width:420px">
        <div class="chat-preview-header">
          <span>Edit group</span>
          <button onclick="document.getElementById('groupEditOverlay').remove()">x</button>
        </div>
        <div style="padding:20px;display:flex;flex-direction:column;gap:12px">
          <label style="font-size:.82rem;font-weight:600;color:var(--muted)">Group name</label>
          <input id="groupEditName" class="chat-input" style="border:1px solid var(--border);border-radius:10px;padding:10px 14px;font-size:.9rem"
                 value="${this._esc(conv.name || '')}" placeholder="Group name">
          <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:4px">
            <button class="chat-edit-cancel" onclick="document.getElementById('groupEditOverlay').remove()">Cancel</button>
            <button class="chat-edit-save" onclick="MessagesController._saveEditGroup(${convId})">Save</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    document.getElementById('groupEditName').focus();
  },

  async _saveEditGroup(convId) {
    const name = document.getElementById('groupEditName')?.value.trim();
    if (!name) return;
    try {
      const res  = await fetch('api/messages.php?action=update_group', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ conversation_id: convId, name })
      });
      const data = await res.json();
      if (data.ok || data.conversation) {
        document.getElementById('groupEditOverlay')?.remove();
        await this._loadConversations();
        this.openConversation(convId);
      }
    } catch (_) {}
  },

  async deleteGroup(convId) {
    const conv = this._conversations.find(c => c.id === convId);
    const name = conv?.name || 'this group';
    if (!confirm(`Delete "${name}" et tous ses messages ?`)) return;
    try {
      const res  = await fetch('api/messages.php?action=delete_group', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ conversation_id: convId })
      });
      const data = await res.json();
      if (data.ok) {
        this._activeConvId = null;
        await this._loadConversations();
        document.getElementById('chatMain').innerHTML = `
          <div class="chat-placeholder">
            <div class="chat-placeholder-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"
                   stroke-linecap="round" stroke-linejoin="round">
                <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
              </svg>
            </div>
            <div class="chat-placeholder-text">Group deleted</div>
          </div>`;
      }
    } catch (_) {}
  },

  // ================================================================
  //  EDIT / DELETE
  // ================================================================

  startEdit(msgId, btn) {
    const msgEl = btn.closest('.chat-msg');
    const bubble = msgEl.querySelector('.chat-bubble');
    const textEl = bubble.querySelector('.chat-bubble-text');
    if (!textEl) return;

    const current = textEl.innerText;
    textEl.style.display = 'none';

    const editArea = document.createElement('div');
    editArea.className = 'chat-edit-area';
    editArea.innerHTML = `
      <textarea class="chat-edit-input">${this._esc(current)}</textarea>
      <div class="chat-edit-btns">
        <button class="chat-edit-cancel" onclick="MessagesController._cancelEdit(${msgId})">Cancel</button>
        <button class="chat-edit-save"   onclick="MessagesController._saveEdit(${msgId})">Save</button>
      </div>
    `;
    bubble.insertBefore(editArea, bubble.querySelector('.chat-msg-time'));

    const ta = editArea.querySelector('textarea');
    ta.focus();
    ta.setSelectionRange(ta.value.length, ta.value.length);
    ta.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); this._saveEdit(msgId); }
      if (e.key === 'Escape') this._cancelEdit(msgId);
    });
  },

  _cancelEdit(msgId) {
    const msgEl = document.querySelector(`.chat-msg[data-id="${msgId}"]`);
    if (!msgEl) return;
    msgEl.querySelector('.chat-bubble-text').style.display = '';
    msgEl.querySelector('.chat-edit-area')?.remove();
  },

  async _saveEdit(msgId) {
    const msgEl = document.querySelector(`.chat-msg[data-id="${msgId}"]`);
    if (!msgEl) return;
    const ta = msgEl.querySelector('.chat-edit-input');
    const content = ta?.value.trim();
    if (!content) return;

    try {
      const res  = await fetch('api/messages.php?action=edit', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ message_id: msgId, content })
      });
      const data = await res.json();
      if (data.ok) {
        const textEl = msgEl.querySelector('.chat-bubble-text');
        textEl.innerHTML = this._nl2br(this._esc(content));
        textEl.style.display = '';
        msgEl.querySelector('.chat-edit-area')?.remove();
        // Add edited tag if not present yet
        if (!msgEl.querySelector('.chat-msg-edited')) {
          msgEl.querySelector('.chat-msg-time').insertAdjacentHTML('beforeend', '<span class="chat-msg-edited">edited</span>');
        }
      }
    } catch (_) {}
  },

  async deleteMsg(msgId, btn) {
    if (!confirm('Delete this message?')) return;
    try {
      const res  = await fetch('api/messages.php?action=delete', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ message_id: msgId })
      });
      const data = await res.json();
      if (data.ok) {
        btn.closest('.chat-msg')?.remove();
        this._loadConversations();
      }
    } catch (_) {}
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
          <span class="chat-preview-title">Preview before sending</span>
          <button class="chat-modal-close" onclick="MessagesController._cancelPreview()">x</button>
        </div>
        <div class="chat-preview-body">
          <img src="${this._pendingFileUrl}" class="chat-preview-img" alt="Preview">
          <div class="chat-preview-filename">${this._esc(file.name)}</div>
        </div>
        <div class="chat-modal-footer">
          <button class="chat-modal-cancel" onclick="MessagesController._cancelPreview()">Cancel</button>
          <button class="chat-modal-submit" id="previewSendBtn"
                  onclick="MessagesController._confirmSendImage(this)">Send</button>
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
    btn.textContent = 'Sending...';
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
  //  POLLING - every 3 seconds
  // ================================================================

  _startPolling() {
    this._stopPolling();
    this._pollInterval = setInterval(() => this._poll(), 3000);
  },

  _stopPolling() {
    if (this._pollInterval) { clearInterval(this._pollInterval); this._pollInterval = null; }
  },

  async _poll() {
    // Always refresh list (detects new conversations and previews)
    await this._loadConversations();

    if (!this._activeConvId) return;
    try {
      const res  = await fetch(
        `api/messages.php?action=messages&conversation_id=${this._activeConvId}&after=${this._lastMsgId}`,
        { cache: 'no-store' }
      );
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
      this._markConversationRead(this._activeConvId);
    } catch (_) {}
  },

  async _markConversationRead(convId) {
    if (!convId) return;
    try {
      await fetch('api/messages.php?action=mark_read', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        cache:   'no-store',
        body:    JSON.stringify({ conversation_id: convId }),
      });

      // Sync local unread badges instantly.
      const conv = this._conversations.find(c => parseInt(c.id) === parseInt(convId));
      if (conv) conv.unread_count = 0;
      this._renderConvList();

      // Notify dashboard widgets (sidebar/home cards) to refresh counts.
      window.dispatchEvent(new CustomEvent('influmatch:messages-read'));
    } catch (_) {}
  },

  // ================================================================
  //  ADMIN - Create group
  // ================================================================

  async openCreateGroup() {
    // Fetch all users
    let users = [];
    try {
      const res  = await fetch('api/messages.php?action=users');
      const data = await res.json();
      users = data.users || [];
    } catch (_) {
      alert('Error while loading users');
      return;
    }

    // Build modal
    const overlay = document.createElement('div');
    overlay.className = 'chat-modal-overlay';
    overlay.innerHTML = `
      <div class="chat-modal">
        <div class="chat-modal-header">
          <h3 class="chat-modal-title">New group</h3>
          <button class="chat-modal-close" onclick="this.closest('.chat-modal-overlay').remove()">x</button>
        </div>
        <div class="chat-modal-body">
          <label class="chat-modal-label">Group name</label>
          <input type="text" class="chat-modal-input" id="groupName" placeholder="Example: Summer Campaign 2025">

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
          <button class="chat-modal-cancel" onclick="this.closest('.chat-modal-overlay').remove()">Cancel</button>
          <button class="chat-modal-submit" onclick="MessagesController._submitGroup(this)">Create group</button>
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

    if (!name)            { alert('Please enter a group name'); return; }
    if (!checked.length)  { alert('Select at least one participant'); return; }

    btn.disabled = true;
    btn.textContent = 'Creating...';

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
      btn.textContent = 'Create group';
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
    CallController.stopListening();
    this._stopPolling();
    if (this._visibilityHandler) {
      document.removeEventListener('visibilitychange', this._visibilityHandler);
      this._visibilityHandler = null;
    }
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

    // Remove existing Seen indicator
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
    vu.textContent = 'Seen';
    target.after(vu);
  },

  _isInflumatchConv(conv, me) {
    if (conv.type !== 'direct') return false;
    const others = (conv.participants || []).filter(p => parseInt(p.id) !== me.id);
    return others.length > 0 && others.every(p => p.role === 'admin');
  },

  _convName(conv, me) {
    if (conv.name) return conv.name;
    const others = (conv.participants || []).filter(p => parseInt(p.id) !== me.id);
    if (!others.length) return 'You';
    const admins = others.filter(p => p.role === 'admin');
    if (admins.length > 0 && admins.length === others.length) return 'Influmatch team';
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
    if (admins.length > 0 && conv.type === 'direct') return 'Influmatch - Co-founders';
    if (conv.type === 'group') return `${(conv.participants || []).length} participants`;
    return '';
  },

  _convPreview(conv) {
    if (!conv.last_content) return 'No message';
    if (conv.last_type === 'call_event') {
      let parsed = {};
      try { parsed = JSON.parse(conv.last_content); } catch (_) {}
      return parsed.status === 'missed' ? 'Missed call' : 'Call';
    }
    if (conv.last_type === 'image') return 'Image';
    if (conv.last_type === 'file' && this._isVideoFile(conv.last_content)) return 'Video';
    if (conv.last_type === 'file')  return 'File';
    const t = conv.last_content;
    return t.length > 42 ? t.substring(0, 42) + '...' : t;
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

  _requestNotifPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {});
    }
  },

  _showBrowserNotif(msg) {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    const sender = msg.firstname ? msg.firstname : 'New message';
    const body   = msg.type === 'text'
      ? (msg.content || '').substring(0, 80)
      : msg.type === 'image' ? 'Image' : 'File';
    try {
      const n = new Notification(`Influmatch - ${sender}`, { body, icon: '/public/assets/images/logo.svg', tag: 'influmatch-msg' });
      n.onclick = () => { window.focus(); n.close(); };
      setTimeout(() => n.close(), 5000);
    } catch (_) {}
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

      _note(988, 0,    0.28); // Note 1
      _note(784, 0.18, 0.38); // Note 2 with slight overlap
    } catch (_) {}
  },

  _notifTitle() {
    if (!this._origTitle) this._origTitle = document.title;
    clearInterval(this._titleInterval);
    let on = true;
    this._titleInterval = setInterval(() => {
      document.title = on ? 'New message - Influmatch' : this._origTitle;
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
      return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }
    return d.toLocaleDateString('en-US', { day: '2-digit', month: '2-digit' });
  },

  _fmtDateSep(str) {
    const d   = new Date(str);
    const now = new Date();
    const yesterday = new Date(now); yesterday.setDate(now.getDate() - 1);
    if (d.toDateString() === now.toDateString())       return 'Today';
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return d.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  },

  _fmtSize(bytes) {
    if (!bytes) return '';
    if (bytes < 1024)       return bytes + ' B';
    if (bytes < 1048576)    return Math.round(bytes / 1024) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  },

  _esc(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  },

  _nl2br(str) {
    return str.replace(/\n/g, '<br>');
  },

  _fmtDuration(secs) {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }
};


