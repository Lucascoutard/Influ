/* ===================================================
   APP/CONTROLLERS/TOURCONTROLLER.JS
   Onboarding tour — centered modal, dark overlay,
   no auto-navigation.
   =================================================== */

const TourController = {

  _step:  0,
  _steps: [],

  maybeStart() {
    if (!localStorage.getItem('influmatch_tour_pending')) return;
    localStorage.removeItem('influmatch_tour_pending');
    localStorage.removeItem('influmatch_tour_done');

    const role  = UserModel.getRole();
    this._steps = role === 'influencer' ? this._influencerSteps() : this._clientSteps();
    this._step  = 0;
    setTimeout(() => this._show(), 700);
  },

  // ── Steps ─────────────────────────────────────────

  _influencerSteps() {
    return [
      {
        icon:  '👋',
        title: 'Welcome to Influmatch!',
        text:  'We\'re thrilled to have you here. In a few steps, we\'ll show you how your personal space works.',
      },
      {
        icon:  '💬',
        title: 'Your messages',
        text:  'In the <strong>My messages</strong> tab you\'ll find your direct conversation with the Influmatch team. This is where we share briefs, answer your questions, and finalize the details of each campaign together.',
      },
      {
        icon:  '🤝',
        title: 'My collaborations',
        text:  'The <strong>My collaborations</strong> tab lists all your active campaigns. For each one, you can see progress, expected deliverables, and the tasks assigned to you.',
      },
      {
        icon:  '✍️',
        title: 'My contracts',
        text:  'Before starting a campaign, a partnership agreement will be sent for your signature in the <strong>My contracts</strong> tab. Sign it in seconds directly from your space.',
      },
      {
        icon:  '📊',
        title: 'Your dashboard',
        text:  'The home page gives you a quick overview of everything: active collaborations, contracts pending signature, and unread messages — at a glance.',
      },
      {
        icon:  '🚀',
        title: 'You\'re all set!',
        text:  'Your space is ready. The Influmatch team will reach out very soon to kick off your first collaboration. In the meantime, feel free to write to us in <strong>My messages</strong> if you have any questions.',
        last:  true,
      },
    ];
  },

  _clientSteps() {
    return [
      {
        icon:  '👋',
        title: 'Welcome to Influmatch!',
        text:  'Your brand space is ready. Here\'s a quick tour of the key sections to help you find your way.',
      },
      {
        icon:  '💬',
        title: 'Direct messaging',
        text:  'In the <strong>My messages</strong> tab, you have a direct line with James and Lucas. Campaign briefs, creator selection, deliverable feedback — everything happens here.',
      },
      {
        icon:  '🤝',
        title: 'My collaborations',
        text:  'The <strong>My collaborations</strong> tab lets you track the progress of each campaign in real time: status, influencers involved, and expected deliverables.',
      },
      {
        icon:  '📊',
        title: 'Your dashboard',
        text:  'The home page centralizes everything: active campaigns, contracts to approve, and unread messages — all in one glance.',
      },
      {
        icon:  '🚀',
        title: 'Let\'s go!',
        text:  'The Influmatch team will contact you very shortly to launch your first campaign. In the meantime, you can already reach us in <strong>My messages</strong>.',
        last:  true,
      },
    ];
  },

  // ── Engine ────────────────────────────────────────

  _show() {
    this._clear();
    const step = this._steps[this._step];
    if (!step) { this._finish(); return; }

    // Overlay
    const ov = document.createElement('div');
    ov.id = 'tourOverlay';
    ov.className = 'tour-overlay';
    document.body.appendChild(ov);
    requestAnimationFrame(() => requestAnimationFrame(() => ov.classList.add('tour-overlay--in')));

    // Bubble
    const isFirst = this._step === 0;
    const isLast  = !!step.last;

    const bubble = document.createElement('div');
    bubble.id = 'tourBubble';
    bubble.className = 'tour-bubble tour-bubble--center';

    bubble.innerHTML =
      '<div class="tour-bubble-top">' +
        '<div class="tour-dots">' +
          this._steps.map((_, i) =>
            '<div class="tour-dot' +
            (i === this._step ? ' tour-dot--active' : i < this._step ? ' tour-dot--done' : '') +
            '"></div>'
          ).join('') +
        '</div>' +
        '<button class="tour-skip" onclick="TourController._finish()">Skip</button>' +
      '</div>' +
      '<div class="tour-icon">' + (step.icon || '') + '</div>' +
      '<div class="tour-title">' + step.title + '</div>' +
      '<div class="tour-text">'  + step.text  + '</div>' +
      '<div class="tour-footer">' +
        (!isFirst
          ? '<button class="tour-btn tour-btn--ghost" onclick="TourController._prev()">← Back</button>'
          : '<span></span>') +
        '<button class="tour-btn tour-btn--primary" onclick="TourController._next()">' +
          (isLast ? 'Get started!' : 'Next →') +
        '</button>' +
      '</div>';

    document.body.appendChild(bubble);
    requestAnimationFrame(() => requestAnimationFrame(() => bubble.classList.add('tour-bubble--in')));
  },

  // ── Buttons ───────────────────────────────────────

  _next() {
    this._step++;
    if (this._step >= this._steps.length) { this._finish(); return; }
    this._clear();
    this._show();
  },

  _prev() {
    if (this._step <= 0) return;
    this._step--;
    this._clear();
    this._show();
  },

  _finish() {
    localStorage.setItem('influmatch_tour_done', '1');
    this._clear();
  },

  // ── Helpers ───────────────────────────────────────

  _clear() {
    document.getElementById('tourOverlay')?.remove();
    document.getElementById('tourBubble')?.remove();
  },
};
