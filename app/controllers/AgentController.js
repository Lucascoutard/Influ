/* ===================================================
   APP/CONTROLLERS/AGENTCONTROLLER.JS
   AI marketing agent — chat interface with Claude
   =================================================== */

const AgentController = {

  _history: [],   // [{role: 'user'|'assistant', content: string}]
  _loading: false,

  QUICK_ACTIONS: [
    { id: 'analyse',    label: '🔍 Analyze a brand',          msg: 'Analyze this company for me: [brand name]. Sector, positioning, target audience, competitors, recent news — and tell me if it\'s a good fit for an influencer campaign.' },
    { id: 'trigger',    label: '⚡ Prospecting trigger',       msg: 'Find me prospecting trigger events to contact [brand name]: product launch, fundraising, hiring spree, expansion, upcoming event, new CMO…' },
    { id: 'email',      label: '✉️ Outreach email',            msg: 'Write a punchy B2B outreach email to contact [brand name / contact\'s title]. Angle: [trigger event]. Include subject line + full ready-to-send body.' },
    { id: 'sequence',   label: '📨 Multi-touch sequence',      msg: 'Create a 3-email outreach sequence (Day 0 hook, Day 3 value, Day 7 soft follow-up) to approach [brand name] on the topic of [Influmatch angle/offer].' },
    { id: 'script',     label: '🎬 Video script',              msg: 'Write a complete video script for [TikTok / Instagram Reels / YouTube Shorts] lasting [30s / 60s] for [brand name / product]. Include timecodes and visual directions.' },
    { id: 'brief',      label: '📋 Influencer creative brief', msg: 'Write a complete creative brief for an influencer on [platform] for the brand [name]. Include objective, key message, do/don\'t list, and reference examples.' },
    { id: 'prompt',     label: '🎨 AI image prompt',           msg: 'Generate a detailed prompt for Midjourney / DALL·E for a [style] visual suited for [Instagram / LinkedIn / TikTok] for a [sector] brand.' },
    { id: 'linkedin',   label: '💼 LinkedIn message',          msg: 'Write a short, effective LinkedIn prospecting message (max 300 characters) to contact [first name + title] at [brand]. Angle: [trigger event].' },
  ],

  // ================================================================
  //  INIT
  // ================================================================

  init() {
    const el = document.getElementById('agentMessages');
    if (!el) return;

    const input = document.getElementById('agentInput');
    if (input) {
      input.addEventListener('input', () => {
        input.style.height = 'auto';
        input.style.height = Math.min(input.scrollHeight, 140) + 'px';
      });
    }

    if (this._history.length > 0) {
      this._rerenderHistory();
    } else {
      this._appendMsg('assistant', 'Hello 👋 I\'m your Influmatch AI assistant. I can help you analyze a company, find prospecting triggers, write outbound emails or sequences, create video scripts and creative briefs, or answer any question about your campaigns.\n\nUse the shortcuts above, or type your request directly. Type **/clear** to reset the conversation.');
    }

    this._scrollBottom();
    input?.focus();
  },

  // ================================================================
  //  SEND
  // ================================================================

  async send() {
    if (this._loading) return;

    const input = document.getElementById('agentInput');
    if (!input) return;

    const msg = input.value.trim();
    if (!msg) return;

    input.value       = '';
    input.style.height = 'auto';

    // /clear command
    if (msg === '/clear') {
      this.clearHistory();
      return;
    }

    this._appendMsg('user', msg);
    this._showLoading();
    this._setLoading(true);

    try {
      const res  = await fetch('api/agent.php?action=chat', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ message: msg, history: this._history })
      });
      const data = await res.json();

      this._hideLoading();

      if (data.error) {
        this._appendMsg('assistant', `⚠️ ${data.error}`);
      } else {
        this._history.push({ role: 'user',      content: msg });
        this._history.push({ role: 'assistant', content: data.reply });
        this._appendMsg('assistant', data.reply);
      }
    } catch (_) {
      this._hideLoading();
      this._appendMsg('assistant', '⚠️ Network error. Check your connection and try again.');
    }

    this._setLoading(false);
    this._scrollBottom();
    input.focus();
  },

  quickAction(id) {
    const action = this.QUICK_ACTIONS.find(a => a.id === id);
    if (!action) return;
    const input = document.getElementById('agentInput');
    if (input) { input.value = action.msg; input.style.height = 'auto'; input.style.height = Math.min(input.scrollHeight, 140) + 'px'; }
    this.send();
  },

  onKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      this.send();
    }
  },

  clearHistory() {
    this._history = [];
    const el = document.getElementById('agentMessages');
    if (el) el.innerHTML = '';
    this._appendMsg('assistant', 'Conversation reset. How can I help you?');
  },

  // ================================================================
  //  MESSAGES
  // ================================================================

  _appendMsg(role, content) {
    const el = document.getElementById('agentMessages');
    if (!el) return;

    const div = document.createElement('div');
    div.className = `agent-msg agent-msg--${role}`;

    if (role === 'assistant') {
      div.innerHTML = `
        <div class="agent-msg-avatar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
               stroke-linecap="round" stroke-linejoin="round">
            <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/>
          </svg>
        </div>
        <div class="agent-msg-bubble">${this._renderMd(content)}</div>
      `;
    } else {
      div.innerHTML = `<div class="agent-msg-bubble">${this._esc(content).replace(/\n/g, '<br>')}</div>`;
    }

    el.appendChild(div);
    this._scrollBottom();
  },

  _rerenderHistory() {
    const el = document.getElementById('agentMessages');
    if (!el) return;
    el.innerHTML = '';
    for (const m of this._history) {
      this._appendMsg(m.role, m.content);
    }
  },

  _showLoading() {
    const el = document.getElementById('agentMessages');
    if (!el) return;
    const div = document.createElement('div');
    div.id        = 'agentLoading';
    div.className = 'agent-msg agent-msg--assistant';
    div.innerHTML = `
      <div class="agent-msg-avatar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
             stroke-linecap="round" stroke-linejoin="round">
          <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/>
        </svg>
      </div>
      <div class="agent-msg-bubble agent-msg-loading">
        <span></span><span></span><span></span>
      </div>
    `;
    el.appendChild(div);
    this._scrollBottom();
  },

  _hideLoading() {
    document.getElementById('agentLoading')?.remove();
  },

  _setLoading(state) {
    this._loading = state;
    const btn = document.getElementById('agentSendBtn');
    if (btn) btn.disabled = state;
  },

  _scrollBottom() {
    const el = document.getElementById('agentMessages');
    if (el) el.scrollTop = el.scrollHeight;
  },

  // ================================================================
  //  MARKDOWN → HTML (basic)
  // ================================================================

  _renderMd(text) {
    let html = this._esc(text);

    html = html.replace(/^### (.+)$/gm, '<h4 class="agent-md-h">$1</h4>');
    html = html.replace(/^## (.+)$/gm,  '<h3 class="agent-md-h">$1</h3>');

    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g,     '<em>$1</em>');

    html = html.replace(/`([^`]+)`/g, '<code class="agent-md-code">$1</code>');

    html = html.replace(/^[*-] (.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul class="agent-md-list">$1</ul>');

    html = html.replace(/\n\n/g, '</p><p class="agent-md-p">');
    html = '<p class="agent-md-p">' + html + '</p>';

    html = html.replace(/([^>])\n([^<])/g, '$1<br>$2');

    return html;
  },

  _esc(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
};
