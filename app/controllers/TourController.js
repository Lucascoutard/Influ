/* ===================================================
   APP/CONTROLLERS/TOURCONTROLLER.JS
   Onboarding tour — modal centré, overlay sombre,
   pas de navigation automatique.
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

  // ── Étapes ───────────────────────────────────────────────

  _influencerSteps() {
    return [
      {
        icon:  '👋',
        title: 'Bienvenue sur Influmatch !',
        text:  'On est ravis de t\'avoir avec nous. En quelques étapes, on te montre comment fonctionne ton espace personnel.',
      },
      {
        icon:  '💬',
        title: 'Tes messages',
        text:  'Dans l\'onglet <strong>Mes messages</strong> tu retrouves ta conversation directe avec l\'équipe Influmatch. C\'est ici qu\'on te partage les briefs, qu\'on répond à tes questions et qu\'on valide ensemble les détails de chaque campagne.',
      },
      {
        icon:  '🤝',
        title: 'Mes collaborations',
        text:  'L\'onglet <strong>Mes collaborations</strong> liste toutes tes campagnes en cours. Pour chacune, tu vois son avancement, les livrables attendus et les tâches que la marque t\'a assignées.',
      },
      {
        icon:  '✍️',
        title: 'Mes contrats',
        text:  'Avant de démarrer une campagne, un contrat de partenariat t\'est envoyé pour signature dans l\'onglet <strong>Mes contrats</strong>. Signe-le en quelques secondes directement depuis ton espace.',
      },
      {
        icon:  '📊',
        title: 'Ton tableau de bord',
        text:  'La page d\'accueil te donne une vue rapide sur tout : collaborations actives, contrats en attente de signature et messages non lus. Un coup d\'œil suffit pour savoir où en sont tes campagnes.',
      },
      {
        icon:  '🚀',
        title: 'C\'est parti !',
        text:  'Ton espace est prêt. L\'équipe Influmatch revient vers toi très vite pour démarrer ta première collaboration. En attendant, n\'hésite pas à écrire dans <strong>Mes messages</strong> si tu as la moindre question.',
        last:  true,
      },
    ];
  },

  _clientSteps() {
    return [
      {
        icon:  '👋',
        title: 'Bienvenue sur Influmatch !',
        text:  'Votre espace marque est prêt. Voici un rapide tour des sections clés pour vous repérer facilement.',
      },
      {
        icon:  '💬',
        title: 'Messagerie directe',
        text:  'Dans l\'onglet <strong>Mes messages</strong>, vous avez une ligne directe avec James et Lucas. Brief de campagne, sélection d\'influenceurs, retours sur les livrables — tout se passe ici.',
      },
      {
        icon:  '🤝',
        title: 'Mes collaborations',
        text:  'L\'onglet <strong>Mes collaborations</strong> vous permet de suivre l\'avancement de chaque campagne en temps réel : statut, influenceurs impliqués et livrables attendus.',
      },
      {
        icon:  '📊',
        title: 'Votre tableau de bord',
        text:  'La page d\'accueil centralise l\'essentiel : campagnes actives, contrats à valider et messages non lus. Tout en un seul coup d\'œil.',
      },
      {
        icon:  '🚀',
        title: 'C\'est parti !',
        text:  'L\'équipe Influmatch prend contact avec vous très rapidement pour lancer votre première campagne. D\'ici là, vous pouvez déjà nous écrire dans <strong>Mes messages</strong>.',
        last:  true,
      },
    ];
  },

  // ── Moteur ───────────────────────────────────────────────

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

    // Bulle
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
        '<button class="tour-skip" onclick="TourController._finish()">Passer</button>' +
      '</div>' +
      '<div class="tour-icon">' + (step.icon || '') + '</div>' +
      '<div class="tour-title">' + step.title + '</div>' +
      '<div class="tour-text">'  + step.text  + '</div>' +
      '<div class="tour-footer">' +
        (!isFirst
          ? '<button class="tour-btn tour-btn--ghost" onclick="TourController._prev()">← Retour</button>'
          : '<span></span>') +
        '<button class="tour-btn tour-btn--primary" onclick="TourController._next()">' +
          (isLast ? 'Commencer !' : 'Suivant →') +
        '</button>' +
      '</div>';

    document.body.appendChild(bubble);
    requestAnimationFrame(() => requestAnimationFrame(() => bubble.classList.add('tour-bubble--in')));
  },

  // ── Boutons ──────────────────────────────────────────────

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

  // ── Helpers ──────────────────────────────────────────────

  _clear() {
    document.getElementById('tourOverlay')?.remove();
    document.getElementById('tourBubble')?.remove();
  },
};
