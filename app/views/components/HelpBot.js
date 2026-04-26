/* ===================================================
   APP/VIEWS/COMPONENTS/HELPBOT.JS
   FAQ chatbot and assistant
   =================================================== */

const HelpBot = {

  _el: null,
  _bubbleTimer: null,
  _chatHistory: [],
  _activeTab: 'faq',

  _faq: [
    {
      id: 'start',
      label: 'Getting started',
      icon: `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2L12.5 7.5H18l-4.5 3.5 1.5 5.5L10 13l-5 3.5 1.5-5.5L2 7.5h5.5L10 2z"/></svg>`,
      questions: [
        { q: 'How does Influmatch work?', a: 'Influmatch connects brands with the right content creators. You describe your campaign, we select matching profiles, then we structure and secure the whole collaboration from brief to final delivery.' },
        { q: 'How do I create an account?', a: 'Click <strong>Sign in</strong> in the top-right corner, then <strong>Create account</strong>. Fill in your details and confirm your email. Your workspace is ready right away.' },
        { q: 'Is Influmatch free?', a: 'Platform access is included from your first collaboration. For a plan adapted to your volume, email us at <a href="mailto:contact@influmatchagency.com" class="hb-inline-link">contact@influmatchagency.com</a>.' },
        { q: 'How do I launch my first collaboration?', a: 'Sign in, click <strong>New collaboration</strong> in your dashboard, fill out the brief (goal, budget, format), and our team will send profile suggestions within 48 hours.' }
      ]
    },
    {
      id: 'account',
      label: 'My account',
      icon: `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="7" r="4"/><path d="M2 17c0-4 3.6-7 8-7s8 3 8 7"/></svg>`,
      questions: [
        { q: 'How do I edit my profile?', a: 'In your dashboard go to <strong>My account</strong> and update your name, email, photo, and social links. Changes are saved instantly.' },
        { q: 'How do I change my sign-in method?', a: 'Influmatch uses <strong>passkeys</strong> (Face ID / fingerprint) for secure sign-in. To add a new device, open <strong>My account</strong> then <strong>Security</strong>.' },
        { q: 'How do I delete my account?', a: 'In <strong>My account</strong>, scroll down and click <strong>Delete my account</strong>. This action is irreversible. Your data will be deleted within 30 days according to GDPR rules.' },
        { q: 'How do I export my data?', a: 'Open <strong>My account</strong>, go to <strong>Privacy</strong>, then <strong>Export my data</strong>. You will receive a JSON export by email.' }
      ]
    },
    {
      id: 'collabs',
      label: 'Collaborations',
      icon: `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M7 9l-5 3 5 3"/><path d="M13 9l5 3-5 3"/><line x1="10" y1="4" x2="10" y2="16"/></svg>`,
      questions: [
        { q: 'How do I track collaboration progress?', a: 'From your dashboard, open the relevant collaboration. You will see real-time status, deliverables, message history, and each validated step.' },
        { q: 'Can I edit an ongoing collaboration?', a: 'Yes, within contract limits. Open the collaboration and click <strong>Edit</strong>. Major changes like budget or deadlines require agreement from both sides.' },
        { q: 'What if a creator does not reply?', a: 'Follow up through the built-in collaboration chat. If there is still no reply after 48 hours, contact us at <a href="mailto:contact@influmatchagency.com" class="hb-inline-link">contact@influmatchagency.com</a> and we will step in quickly.' },
        { q: 'How do I cancel a collaboration?', a: 'Write to <a href="mailto:contact@influmatchagency.com" class="hb-inline-link">contact@influmatchagency.com</a> with the collaboration details. Cancellation depends on progress and contract terms.' }
      ]
    },
    {
      id: 'contracts',
      label: 'Contracts & Payments',
      icon: `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="12" height="16" rx="2"/><path d="M7 7h6M7 10h6M7 13h4"/></svg>`,
      questions: [
        { q: 'How does the Influmatch contract work?', a: 'Each collaboration is framed by an electronically signed contract generated from your brief. It covers deliverables, deadlines, usage rights, and payment terms.' },
        { q: 'When am I billed?', a: 'Billing follows the milestones defined in your contract (at signature, delivery, or split payments). You receive a detailed invoice at each step by email.' },
        { q: 'How do I handle a dispute?', a: 'From your dashboard: <strong>Collaborations</strong> -> <strong>Report an issue</strong>. You can also email us at <a href="mailto:contact@influmatchagency.com" class="hb-inline-link">contact@influmatchagency.com</a>. Our mediation team responds within one business day.' },
        { q: 'Which payment methods are accepted?', a: 'We accept SEPA bank transfers and cards via our secure payment partner. For specific billing questions, contact <a href="mailto:contact@influmatchagency.com" class="hb-inline-link">contact@influmatchagency.com</a>.' }
      ]
    },
    {
      id: 'tech',
      label: 'Technical support',
      icon: `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="10" r="8"/><path d="M10 6v4l3 3"/></svg>`,
      questions: [
        { q: 'I cannot sign in', a: 'Make sure you are using the same device used during registration. If the issue persists, click <strong>Other method</strong> on the sign-in page. Still blocked? Contact <a href="mailto:contact@influmatchagency.com" class="hb-inline-link">contact@influmatchagency.com</a>.' },
        { q: 'The page is not loading properly', a: 'Clear browser cache (Ctrl+Shift+R on Windows, Cmd+Shift+R on Mac). If needed, try another browser. If it still fails, contact <a href="mailto:contact@influmatchagency.com" class="hb-inline-link">contact@influmatchagency.com</a>.' },
        { q: 'I am not receiving emails', a: 'Check your <strong>Spam/Junk</strong> folder and add our address to your contacts. If it persists, email <a href="mailto:contact@influmatchagency.com" class="hb-inline-link">contact@influmatchagency.com</a> so we can verify your address.' },
        { q: 'How do I contact support?', a: 'Email us at <a href="mailto:contact@influmatchagency.com" class="hb-inline-link">contact@influmatchagency.com</a>. You can also use the <a href="#contact" class="hb-inline-link">Contact</a> form or ask directly in this assistant.' }
      ]
    }
  ],

  _autoReplies: [
    { keywords: ['how', 'influmatch', 'platform', 'what is'], catId: 'start', idx: 0 },
    { keywords: ['create account', 'sign up', 'register', 'new account'], catId: 'start', idx: 1 },
    { keywords: ['free', 'pricing', 'plan', 'subscription', 'price'], catId: 'start', idx: 2 },
    { keywords: ['launch', 'start', 'first collaboration', 'new collaboration'], catId: 'start', idx: 3 },
    { keywords: ['profile', 'edit profile', 'update profile'], catId: 'account', idx: 0 },
    { keywords: ['passkey', 'sign in method', 'face id', 'fingerprint'], catId: 'account', idx: 1 },
    { keywords: ['delete account', 'close account', 'remove account'], catId: 'account', idx: 2 },
    { keywords: ['export data', 'privacy', 'gdpr', 'my data'], catId: 'account', idx: 3 },
    { keywords: ['track', 'progress', 'status', 'where is my collab'], catId: 'collabs', idx: 0 },
    { keywords: ['edit collaboration', 'change brief', 'update collaboration'], catId: 'collabs', idx: 1 },
    { keywords: ['no reply', 'creator not responding', 'silent creator'], catId: 'collabs', idx: 2 },
    { keywords: ['cancel collaboration', 'cancel collab', 'stop collaboration'], catId: 'collabs', idx: 3 },
    { keywords: ['contract', 'agreement', 'signature'], catId: 'contracts', idx: 0 },
    { keywords: ['billing', 'invoice', 'when billed', 'payment schedule'], catId: 'contracts', idx: 1 },
    { keywords: ['dispute', 'issue', 'conflict', 'mediation'], catId: 'contracts', idx: 2 },
    { keywords: ['payment method', 'sepa', 'card', 'bank transfer'], catId: 'contracts', idx: 3 },
    { keywords: ['sign in', 'cannot login', 'login issue'], catId: 'tech', idx: 0 },
    { keywords: ['not loading', 'loading issue', 'bug', 'error', 'blank page'], catId: 'tech', idx: 1 },
    { keywords: ['not receiving emails', 'email not received', 'spam'], catId: 'tech', idx: 2 },
    { keywords: ['support', 'contact', 'human help'], catId: 'tech', idx: 3 },
  ],

  init() {
    if (document.getElementById('helpbot')) return;
    this._chatHistory = [];
    this._activeTab = 'faq';
    this._aiLoading = false;
    this._mount();
    this._bindEvents();
    this._scheduleBubble();
  },

  destroy() {
    const el = document.getElementById('helpbot');
    if (el) el.remove();
    if (this._bubbleTimer) clearTimeout(this._bubbleTimer);
    this._el = null;
  },

  _botVideo() {
    return `<video class="hb-bot-video" autoplay loop muted playsinline>
      <source src="public/assets/videos/chatbot.mp4" type="video/mp4">
    </video>`;
  },

  _mount() {
    const el = document.createElement('div');
    el.id = 'helpbot';
    el.innerHTML = `
      <div class="hb-bubble" id="hbBubble">
        <div class="hb-bubble-avatar">${this._botVideo()}</div>
        <div class="hb-bubble-content">
          <div class="hb-bubble-name">Influmatch</div>
          <div class="hb-bubble-msg">Need help? 👋</div>
        </div>
        <button class="hb-bubble-close" id="hbBubbleClose" aria-label="Close">
          <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M2 2l8 8M10 2l-8 8"/></svg>
        </button>
      </div>

      <div class="hb-trigger-wrap">
        <span class="hb-trigger-ring"></span>
        <span class="hb-trigger-ring hb-trigger-ring--delay"></span>
        <button class="hb-trigger" id="hbTrigger" aria-label="Help" aria-expanded="false">
          <span class="hb-trigger-robot">${this._botVideo()}</span>
          <span class="hb-trigger-close" style="display:none">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </span>
        </button>
      </div>

      <div class="hb-panel" id="hbPanel" aria-hidden="true">
        <div class="hb-header">
          <div class="hb-header-icon">${this._botVideo()}</div>
          <div class="hb-header-info">
            <div class="hb-header-name">Influmatch Assistant</div>
            <div class="hb-header-tag">Powered by AI</div>
            <div class="hb-header-status"><span class="hb-dot"></span>Online · Instant replies</div>
          </div>
        </div>

        <div class="hb-tabs" id="hbTabs">
          <button class="hb-tab hb-tab--active" data-tab="faq">
            <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="9" cy="9" r="7"/><path d="M9 8v5M9 6h.01"/></svg>
            FAQ
          </button>
          <button class="hb-tab" data-tab="chat">
            <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M15 11a2 2 0 01-2 2H5l-3 3V4a2 2 0 012-2h9a2 2 0 012 2v7z"/></svg>
            Assistant
          </button>
        </div>

        <div class="hb-body" id="hbBody">
          ${this._renderHome()}
        </div>

        <div class="hb-chat-input-wrap" id="hbChatInputWrap" style="display:none">
          <input type="text" class="hb-chat-input" id="hbChatInput" placeholder="Ask me anything..." maxlength="500" autocomplete="off"/>
          <button class="hb-chat-send" id="hbChatSend" aria-label="Send">
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2L2 9l7 2 2 7 7-16z"/></svg>
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(el);
    this._el = el;
  },

  _renderHome() {
    return `
      <div class="hb-screen">
        <div class="hb-welcome-banner">
          <p>👋 <strong>Hello!</strong> How can we help you today? Browse the categories below or switch to the <strong>Assistant</strong> tab to chat directly.</p>
        </div>
        <p class="hb-section-label">Categories</p>
        <div class="hb-cats">
          ${this._faq.map(cat => `
            <button class="hb-cat" data-cat="${cat.id}">
              <span class="hb-cat-icon">${cat.icon}</span>
              <span class="hb-cat-label">${cat.label}</span>
              <svg class="hb-cat-arrow" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 4l4 4-4 4"/></svg>
            </button>
          `).join('')}
        </div>
      </div>
    `;
  },

  _renderCategory(catId) {
    const cat = this._faq.find(c => c.id === catId);
    if (!cat) return '';
    return `
      <div class="hb-screen">
        <button class="hb-back" data-target="home">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M10 4L6 8l4 4"/></svg>
          Back
        </button>
        <p class="hb-section-label" style="margin-top:4px">${cat.label}</p>
        <div class="hb-questions">
          ${cat.questions.map((item, i) => `
            <button class="hb-question" data-cat="${catId}" data-idx="${i}">
              <span class="hb-question-text">${item.q}</span>
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 4l4 4-4 4"/></svg>
            </button>
          `).join('')}
        </div>
      </div>
    `;
  },

  _renderAnswer(catId, idx) {
    const cat = this._faq.find(c => c.id === catId);
    if (!cat) return '';
    const item = cat.questions[idx];
    if (!item) return '';
    return `
      <div class="hb-screen">
        <button class="hb-back" data-target="cat" data-cat="${catId}">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M10 4L6 8l4 4"/></svg>
          ${cat.label}
        </button>
        <div class="hb-answer-card">
          <div class="hb-answer-q">${item.q}</div>
          <div class="hb-answer-a">${item.a}</div>
        </div>
        <div class="hb-answer-vote">
          <span class="hb-vote-label" id="hbVoteLabel">Was this answer helpful?</span>
          <div class="hb-vote-btns" id="hbVoteBtns">
            <button class="hb-vote hb-vote--yes">Yes</button>
            <button class="hb-vote hb-vote--no">No</button>
          </div>
        </div>
        <button class="hb-other-q" data-target="home">Another question?</button>
      </div>
    `;
  },

  _renderChat() {
    if (!this._chatHistory.length) {
      return `
        <div class="hb-screen hb-chat-screen" id="hbChatScreen">
          <div class="hb-chat-messages" id="hbChatMessages">
            <div class="hb-msg hb-msg--bot">
              <div class="hb-msg-avatar">${this._botVideo()}</div>
              <div class="hb-msg-bubble">Hello! I'm the Influmatch AI assistant. Ask me anything about our service, how collaborations work, pricing, contracts, or how to get started. I'm here to help.</div>
            </div>
          </div>
        </div>
      `;
    }

    const msgs = this._chatHistory.map(m => {
      if (m.role === 'user') {
        return `<div class="hb-msg hb-msg--user"><div class="hb-msg-bubble">${this._escapeHtml(m.text)}</div></div>`;
      }
      return `<div class="hb-msg hb-msg--bot"><div class="hb-msg-avatar">${this._botVideo()}</div><div class="hb-msg-bubble">${m.text}</div></div>`;
    }).join('');

    return `
      <div class="hb-screen hb-chat-screen" id="hbChatScreen">
        <div class="hb-chat-messages" id="hbChatMessages">${msgs}</div>
      </div>
    `;
  },

  _escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  },

  _matchKeyword(text, kw) {
    if (kw.includes(' ')) return text.includes(kw);
    return new RegExp('(?:^|[^a-z])' + kw + '(?:[^a-z]|$)').test(text);
  },

  _findAnswer(text) {
    const lower = text.toLowerCase();
    let best = null;
    let bestScore = 0;

    for (const rule of this._autoReplies) {
      const score = rule.keywords.filter(k => this._matchKeyword(lower, k)).length;
      if (score > bestScore) {
        bestScore = score;
        best = rule;
      }
    }

    if (best && bestScore > 0) {
      const cat = this._faq.find(c => c.id === best.catId);
      const item = cat?.questions[best.idx];
      if (item) return item.a;
    }

    return `I could not find a precise answer. Please contact <a href="mailto:contact@influmatchagency.com" class="hb-inline-link">contact@influmatchagency.com</a> and our team will reply quickly.`;
  },

  async _sendMessage() {
    if (this._aiLoading) return;
    const input = document.getElementById('hbChatInput');
    const text = (input?.value || '').trim();
    if (!text) return;

    // Build history in the format the API expects
    const apiHistory = this._chatHistory.map(m => ({
      role: m.role === 'bot' ? 'assistant' : 'user',
      content: m.text,
    }));

    this._chatHistory.push({ role: 'user', text });
    input.value = '';
    input.disabled = true;
    this._aiLoading = true;

    const messages = document.getElementById('hbChatMessages');
    if (messages) {
      const userDiv = document.createElement('div');
      userDiv.className = 'hb-msg hb-msg--user hb-msg--new';
      userDiv.innerHTML = `<div class="hb-msg-bubble">${this._escapeHtml(text)}</div>`;
      messages.appendChild(userDiv);
    }

    // Show typing indicator
    let typingDiv = null;
    if (messages) {
      typingDiv = document.createElement('div');
      typingDiv.className = 'hb-msg hb-msg--bot hb-msg--typing';
      typingDiv.innerHTML = `<div class="hb-msg-avatar">${this._botVideo()}</div><div class="hb-msg-bubble"><span class="hb-typing-dot"></span><span class="hb-typing-dot"></span><span class="hb-typing-dot"></span></div>`;
      messages.appendChild(typingDiv);
      messages.scrollTop = messages.scrollHeight;
    }

    let answer = '';
    try {
      const res = await fetch('api/helpbot.php?action=chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history: apiHistory }),
      });
      const data = await res.json();
      if (data.error) {
        answer = `<em>${this._escapeHtml(data.error)}</em>`;
      } else {
        answer = this._formatAiReply(data.reply || '');
      }
    } catch {
      answer = `<em>Network error. Please check your connection and try again.</em>`;
    }

    this._chatHistory.push({ role: 'bot', text: answer });
    this._aiLoading = false;
    if (input) input.disabled = false;

    if (typingDiv) typingDiv.remove();
    if (messages) {
      const botDiv = document.createElement('div');
      botDiv.className = 'hb-msg hb-msg--bot hb-msg--new';
      botDiv.innerHTML = `<div class="hb-msg-avatar">${this._botVideo()}</div><div class="hb-msg-bubble">${answer}</div>`;
      messages.appendChild(botDiv);
      messages.scrollTop = messages.scrollHeight;
    }
    if (input) input.focus();
  },

  _formatAiReply(raw) {
    // Process line-by-line — no pre-escape (AI output, not user input)
    const lines = raw.split('\n');
    let html = '';
    let inList = false;

    const applyInline = str => str
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');

    for (const rawLine of lines) {
      const line = rawLine.trimEnd();
      const isBullet  = /^[-*•]\s+(.+)/.exec(line);
      const isNumeric = /^\d+\.\s+(.+)/.exec(line);

      if (isBullet || isNumeric) {
        if (!inList) { html += '<ul>'; inList = true; }
        html += `<li>${applyInline(isBullet ? isBullet[1] : isNumeric[1])}</li>`;
      } else {
        if (inList) { html += '</ul>'; inList = false; }
        const trimmed = line.trim();
        if (trimmed === '') {
          if (html && !html.endsWith('<br>')) html += '<br>';
        } else {
          html += `<p>${applyInline(trimmed)}</p>`;
        }
      }
    }
    if (inList) html += '</ul>';
    return html;
  },

  _switchTab(tab) {
    this._activeTab = tab;
    const tabs = document.querySelectorAll('.hb-tab');
    tabs.forEach(t => t.classList.toggle('hb-tab--active', t.dataset.tab === tab));

    const inputWrap = document.getElementById('hbChatInputWrap');
    const body = document.getElementById('hbBody');

    if (tab === 'faq') {
      if (inputWrap) inputWrap.style.display = 'none';
      body.innerHTML = this._renderHome();
    } else {
      if (inputWrap) inputWrap.style.display = 'flex';
      body.innerHTML = this._renderChat();
      const messages = document.getElementById('hbChatMessages');
      if (messages) messages.scrollTop = messages.scrollHeight;
    }
  },

  _bindEvents() {
    const trigger = document.getElementById('hbTrigger');
    const bubble = document.getElementById('hbBubble');
    const bubbleClose = document.getElementById('hbBubbleClose');
    const body = document.getElementById('hbBody');
    const chatSend = document.getElementById('hbChatSend');
    const chatInput = document.getElementById('hbChatInput');
    const tabs = document.getElementById('hbTabs');

    trigger.addEventListener('click', () => this._togglePanel());

    bubbleClose.addEventListener('click', e => {
      e.stopPropagation();
      bubble.classList.remove('hb-bubble--visible');
    });
    bubble.addEventListener('click', () => this._togglePanel());

    document.addEventListener('click', e => {
      if (!this._el.contains(e.target)) this._closePanel();
    });

    tabs.addEventListener('click', e => {
      const tab = e.target.closest('.hb-tab');
      if (tab) this._switchTab(tab.dataset.tab);
    });

    chatSend.addEventListener('click', () => this._sendMessage());
    chatInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this._sendMessage();
      }
    });

    body.addEventListener('click', e => {
      const vote = e.target.closest('.hb-vote');
      const question = e.target.closest('.hb-question');
      const back = e.target.closest('[data-target]');
      const cat = e.target.closest('[data-cat]');

      if (vote) {
        this._handleVote(vote);
        return;
      }
      if (question) {
        this._navigate('answer', question.dataset.cat, parseInt(question.dataset.idx, 10));
        return;
      }
      if (back) {
        const t = back.dataset.target;
        if (t === 'home') this._navigate('home');
        else if (t === 'cat') this._navigate('cat', back.dataset.cat);
        return;
      }
      if (cat) this._navigate('cat', cat.dataset.cat);
    });
  },

  _navigate(screen, catId, idx) {
    const body = document.getElementById('hbBody');
    let html = '';
    if (screen === 'home') html = this._renderHome();
    if (screen === 'cat') html = this._renderCategory(catId);
    if (screen === 'answer') html = this._renderAnswer(catId, idx);

    body.classList.add('hb-body--exit');
    setTimeout(() => {
      body.innerHTML = html;
      body.classList.remove('hb-body--exit');
      body.classList.add('hb-body--enter');
      setTimeout(() => body.classList.remove('hb-body--enter'), 300);
    }, 140);
  },

  _handleVote(btn) {
    const btns = btn.closest('#hbVoteBtns');
    const label = document.getElementById('hbVoteLabel');
    const isYes = btn.classList.contains('hb-vote--yes');
    if (label) label.textContent = isYes ? 'Thanks, glad I could help!' : 'Thanks for your feedback.';
    if (btns) btns.remove();
  },

  _togglePanel() {
    const panel = document.getElementById('hbPanel');
    panel.classList.contains('hb-panel--open') ? this._closePanel() : this._openPanel();
  },

  _openPanel() {
    const panel   = document.getElementById('hbPanel');
    const trigger = document.getElementById('hbTrigger');
    const bubble  = document.getElementById('hbBubble');
    const wrap    = trigger?.closest('.hb-trigger-wrap');
    bubble.classList.remove('hb-bubble--visible');
    panel.classList.add('hb-panel--open');
    panel.setAttribute('aria-hidden', 'false');
    trigger.setAttribute('aria-expanded', 'true');
    trigger.querySelector('.hb-trigger-robot').style.display = 'none';
    trigger.querySelector('.hb-trigger-close').style.display = 'flex';
    if (wrap) wrap.querySelectorAll('.hb-trigger-ring').forEach(r => r.style.animationPlayState = 'paused');
  },

  _closePanel() {
    const panel   = document.getElementById('hbPanel');
    const trigger = document.getElementById('hbTrigger');
    const wrap    = trigger?.closest('.hb-trigger-wrap');
    if (!panel) return;
    panel.classList.remove('hb-panel--open');
    panel.setAttribute('aria-hidden', 'true');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.querySelector('.hb-trigger-robot').style.display = 'flex';
    trigger.querySelector('.hb-trigger-close').style.display = 'none';
    if (wrap) wrap.querySelectorAll('.hb-trigger-ring').forEach(r => r.style.animationPlayState = 'running');
  },

  _scheduleBubble() {
    if (this._bubbleTimer) clearTimeout(this._bubbleTimer);
    this._bubbleTimer = setTimeout(() => {
      const bubble = document.getElementById('hbBubble');
      const panel = document.getElementById('hbPanel');
      if (bubble && panel && !panel.classList.contains('hb-panel--open')) {
        bubble.classList.add('hb-bubble--visible');
        setTimeout(() => bubble.classList.remove('hb-bubble--visible'), 7000);
      }
    }, 4000);
  }
};
