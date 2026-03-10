/* ===================================================
   APP/CONTROLLERS/AGENTCONTROLLER.JS
   Agent marketing IA — interface de chat avec Claude
   =================================================== */

const AgentController = {

  _history: [],   // [{role: 'user'|'assistant', content: string}]
  _loading: false,

  QUICK_ACTIONS: [
    { id: 'prompt',     label: '✨ Prompt visuel',   msg: 'Génère un prompt détaillé pour Midjourney pour un visuel Instagram lifestyle beauté & wellness, moderne et épuré.' },
    { id: 'brief',      label: '📋 Brief créatif',   msg: 'Rédige un brief créatif complet pour une campagne d\'influence Instagram autour d\'une marque de cosmétiques naturels. Inclus objectifs, tonalité, contraintes et exemples de visuels.' },
    { id: 'hashtags',   label: '🏷 Hashtags',        msg: 'Propose 20 hashtags optimisés pour une campagne mode Instagram ciblant les 18-30 ans en France. Mix popularité haute, moyenne et niche.' },
    { id: 'calendrier', label: '📅 Calendrier',      msg: 'Crée un calendrier de publication sur 4 semaines pour une campagne d\'influence (3 posts/semaine). Inclus jours, heures, type de contenu et objectif de chaque publication.' },
    { id: 'tendances',  label: '📈 Tendances',       msg: 'Quelles sont les tendances actuelles du marketing d\'influence sur Instagram et TikTok en 2025 ? Donne 5 tendances clés avec des conseils d\'application concrets.' },
  ],

  // ================================================================
  //  INIT
  // ================================================================

  init() {
    const el = document.getElementById('agentMessages');
    if (!el) return;

    // Auto-resize du textarea
    const input = document.getElementById('agentInput');
    if (input) {
      input.addEventListener('input', () => {
        input.style.height = 'auto';
        input.style.height = Math.min(input.scrollHeight, 140) + 'px';
      });
    }

    // Réaffiche l'historique si on revient sur la page
    if (this._history.length > 0) {
      this._rerenderHistory();
    } else {
      this._appendMsg('assistant', 'Bonjour 👋 Je suis votre agent marketing IA. Dites-moi ce dont vous avez besoin : prompts visuels, briefs créatifs, hashtags, stratégies de campagne… ou utilisez un raccourci ci-dessus !');
    }

    this._scrollBottom();
    input?.focus();
  },

  // ================================================================
  //  ENVOI
  // ================================================================

  async send() {
    if (this._loading) return;

    const input = document.getElementById('agentInput');
    if (!input) return;

    const msg = input.value.trim();
    if (!msg) return;

    input.value       = '';
    input.style.height = 'auto';

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
      this._appendMsg('assistant', '⚠️ Erreur réseau. Vérifiez votre connexion et réessayez.');
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
    this._appendMsg('assistant', 'Conversation réinitialisée. Comment puis-je vous aider ?');
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
  //  MARKDOWN → HTML (basique)
  // ================================================================

  _renderMd(text) {
    // Escape HTML d'abord
    let html = this._esc(text);

    // Titres ## et ###
    html = html.replace(/^### (.+)$/gm, '<h4 class="agent-md-h">$1</h4>');
    html = html.replace(/^## (.+)$/gm,  '<h3 class="agent-md-h">$1</h3>');

    // Gras et italique
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g,     '<em>$1</em>');

    // Code inline
    html = html.replace(/`([^`]+)`/g, '<code class="agent-md-code">$1</code>');

    // Listes (- item ou * item)
    html = html.replace(/^[*-] (.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul class="agent-md-list">$1</ul>');

    // Paragraphes : double saut de ligne → séparateur
    html = html.replace(/\n\n/g, '</p><p class="agent-md-p">');
    html = '<p class="agent-md-p">' + html + '</p>';

    // Sauts de ligne simples → <br> (sauf dans les blocs déjà structurés)
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
