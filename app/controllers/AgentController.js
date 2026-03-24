/* ===================================================
   APP/CONTROLLERS/AGENTCONTROLLER.JS
   Agent marketing IA — interface de chat avec Claude
   =================================================== */

const AgentController = {

  _history: [],   // [{role: 'user'|'assistant', content: string}]
  _loading: false,

  QUICK_ACTIONS: [
    { id: 'analyse',    label: '🔍 Analyser une marque',     msg: 'Analyse cette entreprise pour moi : [nom de la marque]. Secteur, positionnement, cible, concurrents, actualité récente, et dis-moi si c\'est une bonne cible pour une campagne d\'influence.' },
    { id: 'trigger',    label: '⚡ Levier de prospection',   msg: 'Trouve-moi des leviers de prospection (trigger events) pour contacter [nom de la marque] : lancement produit, levée de fonds, recrutement, expansion, événement à venir, nouveau CMO...' },
    { id: 'email',      label: '✉️ Email de prospection',    msg: 'Rédige un email de prospection B2B percutant pour contacter [nom de la marque / poste du contact]. Angle : [trigger event]. Inclus objet + corps complet prêt à envoyer.' },
    { id: 'sequence',   label: '📨 Séquence multi-touch',    msg: 'Crée une séquence de 3 emails de prospection (J+0 accroche, J+3 valeur, J+7 relance douce) pour approcher [nom de la marque] sur le sujet [angle/offre Influmatch].' },
    { id: 'script',     label: '🎬 Script vidéo',            msg: 'Rédige un script vidéo complet pour [TikTok / Instagram Reels / YouTube Shorts] d\'une durée de [30s / 60s] pour [nom de la marque / produit]. Inclus timecodes et directions visuelles.' },
    { id: 'brief',      label: '📋 Brief créatif influenceur', msg: 'Rédige un brief créatif complet pour un influenceur sur [plateforme] pour la marque [nom]. Inclus objectif, message clé, do/don\'t, et exemples de références.' },
    { id: 'prompt',     label: '🎨 Prompt image IA',         msg: 'Génère un prompt détaillé pour Midjourney / DALL·E pour un visuel [style] adapté à [Instagram / LinkedIn / TikTok] pour une marque [secteur].' },
    { id: 'linkedin',   label: '💼 Message LinkedIn',        msg: 'Rédige un message LinkedIn de prospection court et efficace (max 300 caractères) pour contacter [prénom + poste] chez [marque]. Angle : [trigger event].' },
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
      this._appendMsg('assistant', 'Bonjour 👋 Je suis votre assistant IA Influmatch. Je peux vous aider à analyser une entreprise, trouver un levier de prospection, rédiger un email ou une séquence outbound, créer des scripts vidéo et briefs créatifs, ou répondre à toute question sur vos campagnes.\n\nUtilisez les raccourcis ci-dessus, ou tapez directement votre demande. Tapez **/clear** pour réinitialiser la conversation.');
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
