/* ===================================================
   APP/VIEWS/PAGES/HOMEPAGE.JS — Full Homepage Premium
   Structure: Hero → Trust → Problème → Solution →
   Cas → Avant/Après → About → Social Proof → FAQ → CTA → Footer
   =================================================== */

const HomePage = {

  render() {
    return `
      ${Header.render()}
      ${MobileNav.render()}

      <!-- ============ HERO ============ -->
      <section class="hero">
        <div class="hero-card">
          <div class="hero-video-bg">
            <video autoplay muted loop playsinline poster="public/assets/images/hero-poster.jpg">
              <source src="public/assets/videos/hero.mp4" type="video/mp4">
            </video>
            <div class="hero-visual-placeholder"></div>
          </div>
          <div class="hero-content">
            <h1 class="hero-title">
              On connecte les marques aux <em>bons créateurs</em>
            </h1>
            <p class="hero-subtitle">
              Fini les collabs au hasard. Influmatch sélectionne, cadre et sécurise
              chaque collaboration pour des résultats qui comptent.
            </p>
            <div class="hero-actions">
              <a href="#register" class="btn-primary">
                Lancer ma première collab
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6.5 3.5l4.5 4.5-4.5 4.5" stroke="currentColor" stroke-width="1.5"/></svg>
              </a>
              <a href="#problem" class="btn-secondary">Voir comment ça marche</a>
            </div>
            <div class="hero-video-link" onclick="HomePage.openVideoModal()">
              <div class="play-icon">
                <svg viewBox="0 0 16 16"><polygon points="6,3 13,8 6,13" fill="white"/></svg>
              </div>
              Découvrir Influmatch — 2 min
            </div>
          </div>
        </div>
      </section>

      <!-- ============ TRUST STRIP ============ -->
      <section class="trust-strip">
        <p class="trust-label reveal">Platforms & tools powering every collab</p>
        <div class="trust-logos-wrapper">
          <div class="trust-track">

            <!-- Set 1 -->
            <div class="trust-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"/><path d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z"/></svg>
              Instagram
            </div>
            <div class="trust-sep"></div>
            <div class="trust-item trust-item--niche">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/></svg>
              Beauty
            </div>
            <div class="trust-sep"></div>
            <div class="trust-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3"/></svg>
              TikTok
            </div>
            <div class="trust-sep"></div>
            <div class="trust-item trust-item--niche">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/></svg>
              Skincare
            </div>
            <div class="trust-sep"></div>
            <div class="trust-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z"/></svg>
              YouTube
            </div>
            <div class="trust-sep"></div>
            <div class="trust-item trust-item--niche">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/></svg>
              Haircare
            </div>
            <div class="trust-sep"></div>
            <div class="trust-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"/></svg>
              Stripe
            </div>
            <div class="trust-sep"></div>
            <div class="trust-item trust-item--niche">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/></svg>
              Makeup
            </div>
            <div class="trust-sep"></div>
            <div class="trust-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"/></svg>
              PayPal
            </div>
            <div class="trust-sep"></div>
            <div class="trust-item trust-item--niche">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/></svg>
              Lifestyle
            </div>
            <div class="trust-sep"></div>
            <div class="trust-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/></svg>
              DocuSign
            </div>
            <div class="trust-sep"></div>

            <!-- Set 2 — duplicate for seamless loop -->
            <div class="trust-item" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"/><path d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z"/></svg>
              Instagram
            </div>
            <div class="trust-sep" aria-hidden="true"></div>
            <div class="trust-item trust-item--niche" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/></svg>
              Beauty
            </div>
            <div class="trust-sep" aria-hidden="true"></div>
            <div class="trust-item" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3"/></svg>
              TikTok
            </div>
            <div class="trust-sep" aria-hidden="true"></div>
            <div class="trust-item trust-item--niche" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/></svg>
              Skincare
            </div>
            <div class="trust-sep" aria-hidden="true"></div>
            <div class="trust-item" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z"/></svg>
              YouTube
            </div>
            <div class="trust-sep" aria-hidden="true"></div>
            <div class="trust-item trust-item--niche" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/></svg>
              Haircare
            </div>
            <div class="trust-sep" aria-hidden="true"></div>
            <div class="trust-item" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"/></svg>
              Stripe
            </div>
            <div class="trust-sep" aria-hidden="true"></div>
            <div class="trust-item trust-item--niche" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/></svg>
              Makeup
            </div>
            <div class="trust-sep" aria-hidden="true"></div>
            <div class="trust-item" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"/></svg>
              PayPal
            </div>
            <div class="trust-sep" aria-hidden="true"></div>
            <div class="trust-item trust-item--niche" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/></svg>
              Lifestyle
            </div>
            <div class="trust-sep" aria-hidden="true"></div>
            <div class="trust-item" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/></svg>
              DocuSign
            </div>
            <div class="trust-sep" aria-hidden="true"></div>

            <!-- Set 3 — troisième copie pour éliminer le gap sur grands écrans -->
            <div class="trust-item" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"/><path d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z"/></svg>
              Instagram
            </div>
            <div class="trust-sep" aria-hidden="true"></div>
            <div class="trust-item trust-item--niche" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/></svg>
              Beauty
            </div>
            <div class="trust-sep" aria-hidden="true"></div>
            <div class="trust-item" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3"/></svg>
              TikTok
            </div>
            <div class="trust-sep" aria-hidden="true"></div>
            <div class="trust-item trust-item--niche" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/></svg>
              Skincare
            </div>
            <div class="trust-sep" aria-hidden="true"></div>
            <div class="trust-item" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z"/></svg>
              YouTube
            </div>
            <div class="trust-sep" aria-hidden="true"></div>
            <div class="trust-item trust-item--niche" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/></svg>
              Haircare
            </div>
            <div class="trust-sep" aria-hidden="true"></div>
            <div class="trust-item" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"/></svg>
              Stripe
            </div>
            <div class="trust-sep" aria-hidden="true"></div>
            <div class="trust-item trust-item--niche" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/></svg>
              Makeup
            </div>
            <div class="trust-sep" aria-hidden="true"></div>
            <div class="trust-item" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"/></svg>
              PayPal
            </div>
            <div class="trust-sep" aria-hidden="true"></div>
            <div class="trust-item trust-item--niche" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/></svg>
              Lifestyle
            </div>
            <div class="trust-sep" aria-hidden="true"></div>
            <div class="trust-item" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/></svg>
              DocuSign
            </div>
            <div class="trust-sep" aria-hidden="true"></div>

          </div>
        </div>
      </section>

      <!-- ============ 1. PROBLÈME & CONTEXTE ============ -->
      <section class="section-problem" id="problem">
        <div class="container">

          <!-- Heading -->
          <div class="problem-heading-wrap reveal-left">
            <span class="section-label">Le constat</span>
            <h2 class="section-heading">Un marché de $33 milliards.<br>Géré encore dans le <em>chaos.</em></h2>
            <p class="problem-intro-text">
              L'influence est devenue un levier majeur. Mais les pratiques qui entourent les collabs, elles, n'ont pas suivi. Créateurs et marques subissent les mêmes frictions depuis des années — sans que personne n'ait vraiment réglé le problème.
            </p>
          </div>

          <!-- 3 grandes stats animées -->
          <div class="constat-stats reveal">
            <div class="constat-stat">
              <div class="constat-stat-num" id="cntMarket">$33B</div>
              <div class="constat-stat-label">en jeu en 2025 — dans un secteur qui fonctionne encore à l'ancienne.</div>
              <div class="constat-stat-source">Statista &amp; eMarketer, 2025</div>
            </div>
            <div class="constat-stat constat-stat--red">
              <div class="constat-stat-num" id="cnt87">87%</div>
              <div class="constat-stat-label">des créateurs se sont déjà fait avoir sur un paiement.</div>
              <div class="constat-stat-source">Influencer Marketing Hub, 2024</div>
            </div>
            <div class="constat-stat constat-stat--gold">
              <div class="constat-stat-num" id="cnt49">49%</div>
              <div class="constat-stat-label">des marques pilotent leurs collabs à l'aveugle.</div>
              <div class="constat-stat-source">Linqia — State of Influencer Marketing, 2024</div>
            </div>
          </div>

          <p class="problem-bridge reveal">Trois symptômes. Un seul problème.</p>

          <!-- Pain points: numbered editorial list -->
          <div class="problem-pain-list">
            <div class="pain-item reveal">
              <span class="pain-index">01</span>
              <h3 class="pain-heading">Paiements flous</h3>
              <p class="pain-desc">Pas de contrat clair, rémunération en retard ou inexistante. Les créateurs se retrouvent sans protection légale ni recours possible.</p>
            </div>
            <div class="pain-item reveal reveal-delay-1">
              <span class="pain-index">02</span>
              <h3 class="pain-heading">Briefs inexistants</h3>
              <p class="pain-desc">Pas d'attentes claires, pas de livrables définis. La collab part dans tous les sens, tout le monde est frustré et le contenu ne performe pas.</p>
            </div>
            <div class="pain-item reveal reveal-delay-2">
              <span class="pain-index">03</span>
              <h3 class="pain-heading">Zéro suivi</h3>
              <p class="pain-desc">Une fois le contenu posté, plus personne. Pas de reporting, pas de retour qualitatif, pas de relation durable entre la marque et le créateur.</p>
            </div>
          </div>

        </div>
      </section>

      <!-- ============ 2. SOLUTION — CARROUSEL ============ -->
      <section class="section-solution" id="solution">
        <div class="container">

          <!-- Header -->
          <div class="sol-header reveal-left">
            <span class="section-label">Notre réponse</span>
            <h2 class="section-heading">Un accompagnement <em>humain,</em><br>du brief au reporting.</h2>
          </div>

          <!-- Carrousel : image gauche | flèches centre | texte droite -->
          <div class="sol-carousel reveal">

            <!-- Image gauche — peek carousel vertical -->
            <div class="sol-img-wrap">
              <div class="sol-track">
                <div class="sol-img active" data-step="0">
                  <img src="public/assets/images/solution-matching.png" alt="Matching Influmatch">
                  // <div class="sol-placeholder">
                  //   <svg viewBox="0 0 40 40" fill="none"><rect x="4" y="4" width="32" height="32" rx="6" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4 3"/><circle cx="15" cy="16" r="4" stroke="currentColor" stroke-width="1.5"/><path d="M6 34c2-5 5-8 9-8s7 3 9 8M26 20l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  //   <span>Photo / vidéo — Matching</span>
                  // </div>
                </div>
                <div class="sol-img" data-step="1">
                  <img src="public/assets/images/solution-contrat.png" alt="Contrat Influmatch">
                  // <div class="sol-placeholder">
                  //   <svg viewBox="0 0 40 40" fill="none"><rect x="4" y="4" width="32" height="32" rx="6" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4 3"/><circle cx="15" cy="16" r="4" stroke="currentColor" stroke-width="1.5"/><path d="M6 34c2-5 5-8 9-8s7 3 9 8M26 20l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  //   <span>Photo / vidéo — Contrat</span>
                  // </div>
                </div>
                <div class="sol-img" data-step="2">
                  <img src="public/assets/images/solution-suivi.png" alt="Suivi Influmatch">
                  <div class="sol-placeholder">
                    <svg viewBox="0 0 40 40" fill="none"><rect x="4" y="4" width="32" height="32" rx="6" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4 3"/><circle cx="15" cy="16" r="4" stroke="currentColor" stroke-width="1.5"/><path d="M6 34c2-5 5-8 9-8s7 3 9 8M26 20l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    <span>Photo / vidéo — Suivi</span>
                  </div>
                </div>
                <div class="sol-img" data-step="3">
                  <!-- <img src="public/assets/images/solution-outil.jpg" alt="Outil Influmatch"> -->
                  <div class="sol-placeholder">
                    <svg viewBox="0 0 40 40" fill="none"><rect x="4" y="4" width="32" height="32" rx="6" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4 3"/><circle cx="15" cy="16" r="4" stroke="currentColor" stroke-width="1.5"/><path d="M6 34c2-5 5-8 9-8s7 3 9 8M26 20l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    <span>Photo / vidéo — Outil</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Flèches centre -->
            <div class="sol-arrows">
              <button class="sol-arrow" id="solPrev" aria-label="Précédent">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>
              </button>
              <div class="sol-step-counter"><span id="solCurrent">01</span> / 04</div>
              <button class="sol-arrow" id="solNext" aria-label="Suivant">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
              </button>
            </div>

            <!-- Textes droite -->
            <div class="sol-texts" style="position:relative;">
              <div class="sol-dots" id="solDots">
                <div class="sol-dot active" data-step="0"></div>
                <div class="sol-dot" data-step="1"></div>
                <div class="sol-dot" data-step="2"></div>
                <div class="sol-dot" data-step="3"></div>
              </div>
              <div class="sol-text active" data-step="0">
                <h3 class="sol-text-heading">Matching intelligent</h3>
                <div class="sol-text-tags">
                  <span class="sol-tag">Audience</span>
                  <span class="sol-tag">Valeurs</span>
                  <span class="sol-tag">IA</span>
                </div>
                <p class="sol-text-desc">On sélectionne les créateurs alignés avec votre marque : valeurs, audience, esthétique. Pas de vanity metrics, du vrai fit.</p>
              </div>
              <div class="sol-text" data-step="1">
                <h3 class="sol-text-heading">Contrat tripartite</h3>
                <div class="sol-text-tags">
                  <span class="sol-tag">DocuSign</span>
                  <span class="sol-tag">Juridique</span>
                  <span class="sol-tag">Sécurisé</span>
                </div>
                <p class="sol-text-desc">Marque, créateur, Influmatch. Tout est écrit : livrables, droits d'usage, calendrier, paiement. Signé via DocuSign.</p>
              </div>
              <div class="sol-text" data-step="2">
                <h3 class="sol-text-heading">Suivi humain continu</h3>
                <div class="sol-text-tags">
                  <span class="sol-tag">Brief</span>
                  <span class="sol-tag">Reporting</span>
                  <span class="sol-tag">Humain</span>
                </div>
                <p class="sol-text-desc">On est présents à chaque étape — du brief jusqu'après la publication. Reporting, retour qualitatif, et on prépare déjà la suite.</p>
              </div>
              <div class="sol-text" data-step="3">
                <h3 class="sol-text-heading">Outil centralisé</h3>
                <div class="sol-text-tags">
                  <span class="sol-tag">Dashboard</span>
                  <span class="sol-tag">Contrats</span>
                  <span class="sol-tag">Stats</span>
                </div>
                <p class="sol-text-desc">Discussions, contrats, livrables, statistiques : tout au même endroit. Marque et créateur ont chacun leur espace.</p>
              </div>
            </div><!-- /.sol-texts -->

          </div>

        </div>
      </section>

      <!-- ============ 3. DEUX PUBLICS ============ -->
      <section class="section-cases" id="use-cases">
        <div class="container">
          <div class="cases-header reveal">
            <span class="section-label section-label--center">Pour qui ?</span>
            <h2 class="section-heading">Que vous soyez marque ou créateur,<br><em>on vous couvre.</em></h2>
          </div>

          <div class="cases-split">

            <!-- Marques -->
            <div class="cases-col cases-col--brand reveal">
              <div class="cases-col-image">
                <!-- Replace with: <img src="public/assets/images/brand-team.jpg" alt="Marque beauté"> -->
                <div class="cases-col-image-placeholder">
                  <span class="cases-col-image-hint">Photo marque beauté</span>
                </div>
              </div>
              <div class="cases-col-body">
                <span class="cases-col-eyebrow">Pour les marques</span>
                <h3 class="cases-col-heading">Trouvez les créateurs qui <em>vous ressemblent.</em></h3>
                <p class="cases-col-intro">Fini la chasse au bon profil, les briefs au feeling et les paiements sans garantie. On structure tout pour vous.</p>
                <ul class="cases-benefits">
                  <li class="cases-benefit">
                    <span class="cases-benefit-label">Short-list sur-mesure</span>
                    <span class="cases-benefit-desc">Profils vérifiés dès 10k — alignés ton, audience, valeurs</span>
                  </li>
                  <li class="cases-benefit">
                    <span class="cases-benefit-label">Brief structuré & partagé</span>
                    <span class="cases-benefit-desc">Attentes, livrables, droits d'usage, calendrier — tout est écrit</span>
                  </li>
                  <li class="cases-benefit">
                    <span class="cases-benefit-label">Contrat tripartite signé</span>
                    <span class="cases-benefit-desc">DocuSign · Paiements sécurisés via Stripe · Zéro litige</span>
                  </li>
                  <li class="cases-benefit">
                    <span class="cases-benefit-label">Suivi post-publication inclus</span>
                    <span class="cases-benefit-desc">Débrief humain, reporting complet, optimisation pour la suite</span>
                  </li>
                </ul>
                <a href="#register" class="cases-cta cases-cta--brand">
                  Trouver mon créateur
                  <svg viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5"/></svg>
                </a>
              </div>
            </div>

            <!-- Créateurs -->
            <div class="cases-col cases-col--creator reveal reveal-delay-1">
              <div class="cases-col-image">
                <!-- Replace with: <img src="public/assets/images/creator-filming.jpg" alt="Créateur de contenu"> -->
                <div class="cases-col-image-placeholder">
                  <span class="cases-col-image-hint">Photo créateur</span>
                </div>
              </div>
              <div class="cases-col-body">
                <span class="cases-col-eyebrow">Pour les créateurs</span>
                <h3 class="cases-col-heading">Travaillez avec des marques qui vous <em>respectent.</em></h3>
                <p class="cases-col-intro">Des marques sérieuses, des briefs clairs, des paiements garantis. Votre créativité mérite mieux qu'un DM sans suite.</p>
                <ul class="cases-benefits">
                  <li class="cases-benefit">
                    <span class="cases-benefit-label">Rémunération juste & garantie</span>
                    <span class="cases-benefit-desc">Tarifs transparents, paiements traçables, zéro impayé</span>
                  </li>
                  <li class="cases-benefit">
                    <span class="cases-benefit-label">Briefs clairs dès le départ</span>
                    <span class="cases-benefit-desc">Objectifs, livrables, cadre légal — expliqués avant de signer</span>
                  </li>
                  <li class="cases-benefit">
                    <span class="cases-benefit-label">Liberté créative préservée</span>
                    <span class="cases-benefit-desc">On cadre pour vous protéger, pas pour brider votre style</span>
                  </li>
                  <li class="cases-benefit">
                    <span class="cases-benefit-label">Relation durable, pas un one-shot</span>
                    <span class="cases-benefit-desc">On reste en contact après publication — les meilleures collabs se répètent</span>
                  </li>
                </ul>
                <a href="#register" class="cases-cta cases-cta--creator">
                  Rejoindre Influmatch
                  <svg viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5"/></svg>
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      <!-- ============ 4. AVANT / APRÈS INFLUMATCH ============ -->
      <section class="section-compare" id="compare">
        <div class="container">

          <div class="compare-header reveal">
            <span class="section-label section-label--center">Le changement</span>
            <h2 class="section-heading">Avant et après <em>Influmatch.</em></h2>
          </div>

          <div class="compare-tabs reveal reveal-delay-1">
            <button class="compare-tab compare-tab--before active" onclick="HomePage.switchCompare('before')">
              <span class="compare-tab-dot"></span>
              Sans Influmatch
            </button>
            <button class="compare-tab compare-tab--after" onclick="HomePage.switchCompare('after')">
              <span class="compare-tab-dot"></span>
              Avec Influmatch
            </button>
          </div>

          <!-- BEFORE panel -->
          <div class="compare-panel compare-panel--before active" id="compareBefore">
            <div class="compare-scene compare-scene--before">
              <span class="compare-scene-label">Sans Influmatch</span>
              <div class="compare-scene-inner">

                <!-- Card 1 : Contrat manquant -->
                <div class="cs-card cs-card--before">
                  <div class="cs-card-head">
                    <div class="cs-icon cs-icon--warn">
                      <svg viewBox="0 0 24 24"><path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>
                    </div>
                    <div class="cs-head-text">
                      <div class="cs-head-title">Contrat introuvable</div>
                      <div class="cs-head-sub">Aucun document signé</div>
                    </div>
                    <span class="cs-badge cs-badge--danger">Non signé</span>
                  </div>
                  <div class="cs-body">
                    <div class="cs-question">? ? ?</div>
                    <div class="cs-missing">
                      <div class="cs-missing-line"></div>
                      <div class="cs-missing-line cs-missing-line--sm"></div>
                      <div class="cs-missing-line"></div>
                    </div>
                    <div class="cs-chat">
                      <div class="cs-chat-line">
                        <div class="cs-bubble cs-bubble--in">"T'inquiète, on fera ça à l'oral..."</div>
                      </div>
                    </div>
                    <div class="cs-alert">Aucun recours possible sans contrat écrit</div>
                  </div>
                </div>

                <!-- Card 2 : Brief chaos (centre) -->
                <div class="cs-card cs-card--before">
                  <div class="cs-card-head">
                    <div class="cs-icon cs-icon--neutral">
                      <svg viewBox="0 0 24 24"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
                    </div>
                    <div class="cs-head-text">
                      <div class="cs-head-title">Brief — Instagram DM</div>
                      <div class="cs-head-sub">12 messages, 0 livrable clair</div>
                    </div>
                  </div>
                  <div class="cs-body">
                    <div class="cs-chat">
                      <div class="cs-chat-line">
                        <div class="cs-bubble cs-bubble--in">"Ouais bah fais un post sympa sur la crème..."</div>
                      </div>
                      <div class="cs-chat-line cs-chat-line--out">
                        <div class="cs-bubble cs-bubble--out">"C'est quoi exactement les livrables ?"</div>
                      </div>
                      <div class="cs-chat-line">
                        <div class="cs-bubble cs-bubble--in">"Sois créative !"</div>
                      </div>
                      <div class="cs-chat-line cs-chat-line--out">
                        <div class="cs-bubble cs-bubble--out">"Et pour le paiement ?"</div>
                      </div>
                      <div class="cs-chat-line">
                        <div class="cs-bubble cs-bubble--in">"vU"</div>
                      </div>
                      <div class="cs-seen">Lu · sans réponse depuis 5 jours</div>
                    </div>
                  </div>
                </div>

                <!-- Card 3 : Paiement en retard -->
                <div class="cs-card cs-card--before">
                  <div class="cs-card-head">
                    <div class="cs-icon cs-icon--danger">
                      <svg viewBox="0 0 24 24"><path d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"/></svg>
                    </div>
                    <div class="cs-head-text">
                      <div class="cs-head-title">Facture #031</div>
                      <div class="cs-head-sub">Émise le 3 jan · non payée</div>
                    </div>
                    <span class="cs-badge cs-badge--danger">En retard</span>
                  </div>
                  <div class="cs-body">
                    <div class="cs-amount-block">
                      <div class="cs-amount cs-amount--danger">$850</div>
                      <div class="cs-amount-sub">Impayé · 3 semaines de retard</div>
                    </div>
                    <div class="cs-bar"><div class="cs-bar-fill cs-bar-fill--danger"></div></div>
                    <div class="cs-alert">Relances ignorées · aucun contrat = aucun recours</div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <!-- AFTER panel -->
          <div class="compare-panel compare-panel--after" id="compareAfter">
            <div class="compare-scene compare-scene--after">
              <span class="compare-scene-label">Avec Influmatch</span>
              <div class="compare-scene-inner">

                <!-- Card 1 : Contrat signé -->
                <div class="cs-card cs-card--after">
                  <div class="cs-card-head">
                    <div class="cs-icon cs-icon--success">
                      <svg viewBox="0 0 24 24"><path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/></svg>
                    </div>
                    <div class="cs-head-text">
                      <div class="cs-head-title">Contrat tripartite</div>
                      <div class="cs-head-sub">Signé via DocuSign</div>
                    </div>
                    <span class="cs-badge cs-badge--success">Signé ✓</span>
                  </div>
                  <div class="cs-body">
                    <div class="cs-checks">
                      <div class="cs-check">
                        <svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="rgba(34,197,94,.45)" stroke-width="1.5"/><path d="M5 8l2 2.5L11 5.5" stroke="rgba(34,197,94,.85)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        Livrables définis et signés
                      </div>
                      <div class="cs-check">
                        <svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="rgba(34,197,94,.45)" stroke-width="1.5"/><path d="M5 8l2 2.5L11 5.5" stroke="rgba(34,197,94,.85)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        Droits d'usage inclus
                      </div>
                      <div class="cs-check">
                        <svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="rgba(34,197,94,.45)" stroke-width="1.5"/><path d="M5 8l2 2.5L11 5.5" stroke="rgba(34,197,94,.85)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        Calendrier verrouillé
                      </div>
                      <div class="cs-check">
                        <svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="rgba(34,197,94,.45)" stroke-width="1.5"/><path d="M5 8l2 2.5L11 5.5" stroke="rgba(34,197,94,.85)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        Marque · Créateur · Influmatch
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Card 2 : Brief structuré (centre) -->
                <div class="cs-card cs-card--after">
                  <div class="cs-card-head">
                    <div class="cs-icon cs-icon--primary">
                      <svg viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                    </div>
                    <div class="cs-head-text">
                      <div class="cs-head-title">Brief Influmatch</div>
                      <div class="cs-head-sub">Validé · 2 parties</div>
                    </div>
                    <span class="cs-badge cs-badge--primary">En cours</span>
                  </div>
                  <div class="cs-body">
                    <div class="cs-brief">
                      <div class="cs-brief-row">
                        <span class="cs-brief-key">Objectif</span>
                        <span class="cs-brief-val">Notoriété · Skincare routine</span>
                      </div>
                      <div class="cs-brief-row">
                        <span class="cs-brief-key">Livrable</span>
                        <span class="cs-brief-val">1 Reel + 2 Stories</span>
                      </div>
                      <div class="cs-brief-row">
                        <span class="cs-brief-key">Deadline</span>
                        <span class="cs-brief-val">15 mars 2025</span>
                      </div>
                      <div class="cs-brief-row">
                        <span class="cs-brief-key">Mentions</span>
                        <span class="cs-brief-val">#paid · @brand · lien bio</span>
                      </div>
                      <div class="cs-brief-row">
                        <span class="cs-brief-key">Droits</span>
                        <span class="cs-brief-val">Usage 6 mois · réseaux</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Card 3 : Paiement confirmé + métriques -->
                <div class="cs-card cs-card--after">
                  <div class="cs-card-head">
                    <div class="cs-icon cs-icon--success">
                      <svg viewBox="0 0 24 24"><path d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"/></svg>
                    </div>
                    <div class="cs-head-text">
                      <div class="cs-head-title">Paiement sécurisé</div>
                      <div class="cs-head-sub">Via Stripe · Traçable</div>
                    </div>
                    <span class="cs-badge cs-badge--success">Payé ✓</span>
                  </div>
                  <div class="cs-body">
                    <div class="cs-amount-block">
                      <div class="cs-amount cs-amount--success">$850</div>
                      <div class="cs-amount-sub">Virement confirmé · J+3</div>
                    </div>
                    <div class="cs-bar"><div class="cs-bar-fill cs-bar-fill--success"></div></div>
                    <div class="cs-metrics">
                      <span class="cs-metric">24K vues</span>
                      <span class="cs-metric">3.2% ER</span>
                      <span class="cs-metric">+890 followers</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      <!-- ============ 5. PLATFORM TOOL — Espace client ============ -->
      <section class="section-platform" id="platform">
        <div class="container">

          <div class="platform-header reveal">
            <span class="section-label section-label--center">Espace client</span>
            <h2 class="section-heading">Une plateforme pour <em>tout gérer.</em></h2>
            <p class="platform-tagline">Accessible dès votre première collaboration, votre espace centralisé remplace les mails éparpillés, les suivis manuels et les procédures complexes. Tout ce qui compte, au même endroit.</p>
          </div>

          <!-- Platform visual / dashboard mockup -->
          <div class="platform-visual-main reveal reveal-delay-1">
            <div class="platform-visual-placeholder-main">
              <!-- Replace with: <img src="public/assets/images/platform-interface.jpg" alt="Interface Influmatch"> -->
              <div class="pv-ui">
                <div class="pv-sidebar">
                  <div class="pv-sb-dot pv-sb-dot--active"></div>
                  <div class="pv-sb-dot"></div>
                  <div class="pv-sb-dot"></div>
                  <div class="pv-sb-dot"></div>
                  <div class="pv-sb-dot"></div>
                </div>
                <div class="pv-main">
                  <div class="pv-topbar">
                    <div class="pv-tb-title"></div>
                    <div class="pv-spacer"></div>
                    <div class="pv-tb-badge"></div>
                  </div>
                  <div class="pv-content">
                    <div class="pv-card">
                      <div class="pv-card-label"></div>
                      <div class="pv-card-value"></div>
                      <div class="pv-card-sub"></div>
                    </div>
                    <div class="pv-card">
                      <div class="pv-card-label"></div>
                      <div class="pv-card-value"></div>
                      <div class="pv-card-sub"></div>
                    </div>
                    <div class="pv-card">
                      <div class="pv-chat">
                        <div class="pv-bubble pv-bubble--in"></div>
                        <div class="pv-bubble pv-bubble--out"></div>
                        <div class="pv-bubble pv-bubble--in pv-bubble--sm"></div>
                        <div class="pv-bubble pv-bubble--out"></div>
                      </div>
                    </div>
                    <div class="pv-card">
                      <div class="pv-card-label"></div>
                      <div class="pv-card-value"></div>
                      <div class="pv-card-sub"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Feature grid -->
          <div class="platform-features">

            <div class="platform-feature reveal">
              <div class="pf-icon-wrap">
                <svg viewBox="0 0 24 24"><path d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"/></svg>
              </div>
              <h3>Discussions centralisées</h3>
              <p>Toutes vos conversations au même endroit. Adieu les DMs éparpillés entre mail, WhatsApp et Instagram.</p>
            </div>

            <div class="platform-feature reveal reveal-delay-1">
              <div class="pf-icon-wrap">
                <svg viewBox="0 0 24 24"><path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/></svg>
              </div>
              <h3>Contrats &amp; accords</h3>
              <p>Vos contrats signés, archivés et accessibles en un clic. Retrouvez n'importe quel accord en quelques secondes.</p>
            </div>

            <div class="platform-feature reveal reveal-delay-2">
              <div class="pf-icon-wrap">
                <svg viewBox="0 0 24 24"><path d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"/></svg>
              </div>
              <h3>Statistiques &amp; reporting</h3>
              <p>Performances de chaque campagne en temps réel. Des données claires pour prendre de meilleures décisions.</p>
            </div>

            <div class="platform-feature reveal reveal-delay-3">
              <div class="pf-icon-wrap">
                <svg viewBox="0 0 24 24"><path d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/></svg>
              </div>
              <h3>Productivité maximale</h3>
              <p>Workflow simplifié, procédures allégées. Moins d'administration, moins d'erreurs, plus de temps pour l'essentiel.</p>
            </div>

          </div>

        </div>
      </section>

      <!-- ============ 7. ABOUT US ============ -->
      <section class="section-about has-grain" id="about">
        <div class="container">
          <div class="about-layout">
            <div class="about-image reveal-scale">
              <div class="about-portraits">

                <div class="about-portrait">
                  <div class="about-portrait-photo">
                    <!-- Replace: <img src="public/assets/images/james.jpg" alt="James"> -->
                    <div class="about-portrait-placeholder"></div>
                  </div>
                  <div class="about-portrait-name">James</div>
                  <div class="about-portrait-role">Co-fondateur</div>
                </div>

                <div class="about-portrait">
                  <div class="about-portrait-photo">
                    <!-- Replace: <img src="public/assets/images/lucas.jpg" alt="Lucas"> -->
                    <div class="about-portrait-placeholder about-portrait-placeholder--alt"></div>
                  </div>
                  <div class="about-portrait-name">Lucas</div>
                  <div class="about-portrait-role">Co-fondateur</div>
                </div>

              </div>
            </div>
            <div class="about-content reveal reveal-delay-1">
              <span class="section-label section-label--light">Qui sommes-nous</span>
              <h2 class="section-heading section-heading--light">James & Lucas,<br>deux entrepreneurs <em>complémentaires.</em></h2>
              <div class="about-story">
                <p>Tout a commencé pendant un stage — compétences complémentaires, même envie d'entreprendre, même refus du statu quo.</p>
                <p>Un soir, une amie créatrice nous confie ses galères : partenariats peu transparents, collabs mal cadrées, paiements flous. Du côté des marques, même constat.</p>
                <p>On s'est dit : <strong>réparons ça.</strong></p>
                <p>Influmatch, c'est James et Lucas — et une conviction simple : une bonne collab commence par le respect. Des contenus qui performent, des relations qui durent.</p>
              </div>
              <a href="#register" class="btn-primary" style="margin-top:8px">Rejoindre l'aventure</a>
            </div>
          </div>
        </div>
      </section>

      <!-- ============ 6. SOCIAL PROOF ============ -->
      <section class="section-proof" id="proof">
        <div class="container">
          <div class="proof-header reveal">
            <span class="section-label">Ce qu'ils en disent</span>
            <h2 class="section-heading">Ils nous ont <em>fait confiance.</em></h2>
          </div>

          <!-- Featured quote — large centred -->
          <div class="proof-featured-wrap reveal">
            <blockquote class="proof-featured-text">
              J'avais essayé de gérer les collabs moi-même par DM. Un créateur a disparu après le post, sans aucun recours. Avec Influmatch, tout était écrit, signé, suivi. Notre première vraie collab s'est transformée en partenariat régulier.
            </blockquote>
            <div class="proof-attribution">
              <!-- Replace circle with: <img src="public/assets/images/testimonials/sarah-k.jpg" alt="Sarah K." style="width:34px;height:34px;border-radius:50%;object-fit:cover"> -->
              <div class="proof-attr-avatar proof-attr-avatar--1">S</div>
              <div>
                <div class="proof-attr-name">Sarah K.</div>
                <div class="proof-attr-role">Fondatrice, Glow Lab Skincare · New York</div>
              </div>
              <span class="proof-attr-handle">@glowlab.skincare</span>
            </div>
          </div>

          <!-- Secondary duo — asymmetric -->
          <div class="proof-duo">

            <div class="proof-side reveal">
              <blockquote class="proof-side-text">
                Pour la première fois, j'ai reçu un brief qui expliquait exactement ce qu'on attendait — objectifs, livrables, deadline, droits d'usage. Mon paiement est arrivé en J+3. Je refuse désormais toute collab sans ce niveau de cadre.
              </blockquote>
              <div class="proof-attribution">
                <!-- Replace: <img src="public/assets/images/testimonials/maya-w.jpg" alt="Maya W." style="width:34px;height:34px;border-radius:50%;object-fit:cover"> -->
                <div class="proof-attr-avatar proof-attr-avatar--2">M</div>
                <div>
                  <div class="proof-attr-name">Maya W.</div>
                  <div class="proof-attr-role">Créatrice beauté · Instagram · 28K</div>
                </div>
                <span class="proof-attr-handle">@maya.creates</span>
              </div>
            </div>

            <div class="proof-side reveal reveal-delay-1">
              <blockquote class="proof-side-text">
                On avait besoin de 3 créateurs en urgence pour un lancement. Shortlist reçue en 48h, contrats signés en 5 jours. L'un d'eux est devenu un partenaire récurrent. Influmatch est maintenant intégré dans tous nos lancements.
              </blockquote>
              <div class="proof-attribution">
                <!-- Replace: <img src="public/assets/images/testimonials/jessica-t.jpg" alt="Jessica T." style="width:34px;height:34px;border-radius:50%;object-fit:cover"> -->
                <div class="proof-attr-avatar proof-attr-avatar--3">J</div>
                <div>
                  <div class="proof-attr-name">Jessica T.</div>
                  <div class="proof-attr-role">Marketing Manager, Velvet Haircare · Los Angeles</div>
                </div>
                <span class="proof-attr-handle">@velvethaircare</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      <!-- ============ 7. FAQ ============ -->
      <section class="section-faq" id="faq">
        <div class="container container--narrow">
          <div class="faq-header reveal">
            <span class="section-label section-label--center">Questions fréquentes</span>
            <h2 class="section-heading">Tout ce que vous voulez <em>savoir.</em></h2>
          </div>

          <div class="faq-list">
            <div class="faq-item reveal" onclick="HomePage.toggleFaq(this)">
              <div class="faq-question">
                <span>Combien coûte Influmatch ?</span>
                <div class="faq-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg></div>
              </div>
              <div class="faq-answer">
                <p>Notre commission est de 30%, affichée et expliquée. Elle couvre l'accompagnement complet : mise en relation, brief, contrat, coordination, suivi et reporting post-publication. Pas de frais cachés.</p>
              </div>
            </div>

            <div class="faq-item reveal reveal-delay-1" onclick="HomePage.toggleFaq(this)">
              <div class="faq-question">
                <span>Comment sélectionnez-vous les créateurs ?</span>
                <div class="faq-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg></div>
              </div>
              <div class="faq-answer">
                <p>On vérifie l'audience réelle, l'engagement authentique, l'alignement avec les valeurs de la marque. On privilégie les créateurs dès 10k abonnés, proches de leur communauté. Pas de vanity metrics.</p>
              </div>
            </div>

            <div class="faq-item reveal reveal-delay-1" onclick="HomePage.toggleFaq(this)">
              <div class="faq-question">
                <span>Quels types de marques travaillent avec vous ?</span>
                <div class="faq-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg></div>
              </div>
              <div class="faq-answer">
                <p>On travaille avec des marques beauté émergentes aux États-Unis. Skincare, haircare, makeup — des marques qui veulent des collabs authentiques avec des créateurs qui leur ressemblent.</p>
              </div>
            </div>

            <div class="faq-item reveal reveal-delay-2" onclick="HomePage.toggleFaq(this)">
              <div class="faq-question">
                <span>Qu'est-ce que le contrat tripartite ?</span>
                <div class="faq-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg></div>
              </div>
              <div class="faq-answer">
                <p>C'est un contrat signé par la marque, le créateur et Influmatch via DocuSign. Il définit les livrables, les droits d'usage, les mentions légales, le calendrier et le paiement. Tout le monde sait à quoi s'attendre.</p>
              </div>
            </div>

            <div class="faq-item reveal reveal-delay-2" onclick="HomePage.toggleFaq(this)">
              <div class="faq-question">
                <span>Que se passe-t-il après la publication ?</span>
                <div class="faq-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg></div>
              </div>
              <div class="faq-answer">
                <p>On ne disparaît pas. On fait un débrief humain, on partage les retours qualitatifs, on propose des pistes d'optimisation. Si la marque et le créateur le souhaitent, on prépare la collaboration suivante.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ============ 8. CTA FINAL — Éditorial centré ============ -->
      <section class="section-cta-final has-grain" id="cta-final">
        <div class="container">
          <div class="cta-final-inner reveal">
            <span class="section-label section-label--light section-label--center">Prêts à commencer ?</span>
            <div class="cta-final-rule"></div>
            <blockquote class="cta-final-quote">
              "On a commencé ce projet parce qu'on croit qu'une collaboration réussie, ça commence par le respect. Rejoignez-nous, et construisons ensemble quelque chose qui a du sens."
            </blockquote>
            <div class="cta-final-authors">
              <span>James & Lucas</span> — Fondateurs d'Influmatch
            </div>
            <div class="cta-final-actions">
              <a href="#register" class="btn-primary">
                Créer mon compte gratuitement
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6.5 3.5l4.5 4.5-4.5 4.5" stroke="currentColor" stroke-width="1.5"/></svg>
              </a>
              <a href="#contact" class="btn-outline">Nous contacter</a>
            </div>
          </div>
        </div>
      </section>

      <!-- ============ FOOTER ============ -->
      <footer class="footer">
        <div class="container">
          <div class="footer-top">
            <div>
              <img src="${AppConfig.logoSrc}" alt="${AppConfig.name}" class="footer-logo">
              <p class="footer-brand-text">
                Influmatch connecte les marques aux créateurs qui leur ressemblent. Des collaborations cadrées, humaines, et qui performent.
              </p>
            </div>
            <div class="footer-col">
              <h4>Nos services</h4>
              <a href="#solution">Notre méthode</a>
              <a href="#use-cases">Pour les marques</a>
              <a href="#use-cases">Pour les créateurs</a>
            </div>
            <div class="footer-col">
              <h4>Pourquoi nous</h4>
              <a href="#compare">Avant / Après</a>
              <a href="#platform">La plateforme</a>
              <a href="#about">Qui sommes-nous</a>
              <a href="#proof">Témoignages</a>
              <a href="#faq">FAQ</a>
            </div>
            <div class="footer-col">
              <h4>Rejoindre</h4>
              <a href="#login">Se connecter</a>
              <a href="#register">Créer un compte</a>
              <a href="#contact">Contact</a>
            </div>
          </div>
          <div class="footer-bottom">
            <p>&copy; ${new Date().getFullYear()} Influmatch. Tous droits réservés.</p>
            <p>Smart Collabs. Real Impact.</p>
          </div>
        </div>
      </footer>
    `;
  },

  // ---- Avant/Après switcher ----
  switchCompare(state) {
    document.querySelectorAll('.compare-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.compare-panel').forEach(p => p.classList.remove('active'));
    if (state === 'before') {
      document.querySelector('.compare-tab--before').classList.add('active');
      document.getElementById('compareBefore').classList.add('active');
    } else {
      document.querySelector('.compare-tab--after').classList.add('active');
      document.getElementById('compareAfter').classList.add('active');
    }
  },

  // ---- FAQ accordion ----
  toggleFaq(el) {
    const isOpen = el.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) el.classList.add('open');
  },

  // ---- Constat stats : counters au scroll ----
  openVideoModal() {
    const overlay = document.createElement('div');
    overlay.id        = 'heroVideoOverlay';
    overlay.className = 'hvm-overlay';
    overlay.innerHTML = `
      <div class="hvm-modal">
        <button class="hvm-close" id="hvmClose" aria-label="Fermer">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
               stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
        <video class="hvm-video" controls autoplay playsinline
               src="public/assets/videos/hero.mp4">
        </video>
      </div>
    `;
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    // Fade in
    requestAnimationFrame(() => overlay.classList.add('hvm-overlay--in'));

    const close = () => {
      const vid = overlay.querySelector('video');
      if (vid) { vid.pause(); vid.src = ''; }
      overlay.classList.remove('hvm-overlay--in');
      overlay.addEventListener('transitionend', () => {
        overlay.remove();
        document.body.style.overflow = '';
      }, { once: true });
      document.removeEventListener('keydown', onKey);
    };

    const onKey = (e) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
    document.getElementById('hvmClose').addEventListener('click', close);
  },

  initConstatAnimation() {
    const strip = document.querySelector('.constat-stats');
    if (!strip) return;

    const el87     = document.getElementById('cnt87');
    const el49     = document.getElementById('cnt49');
    const elMarket = document.getElementById('cntMarket');

    // Reset à zéro avant l'animation
    if (el87)     el87.textContent     = '0%';
    if (el49)     el49.textContent     = '0%';
    if (elMarket) elMarket.textContent = '$0B';

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        if (elMarket) this._countUpMarket(elMarket, 33,  1100, 100);
        if (el87)     this._countUp(el87,     87, '%',   1400, 250);
        if (el49)     this._countUp(el49,     49, '%',   1200, 400);
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -60px 0px' });

    observer.observe(strip);
  },

  _countUp(el, target, suffix, duration, delay) {
    setTimeout(() => {
      const start = performance.now();
      const tick  = (now) => {
        const p    = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(ease * target) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay);
  },

  // ---- Solution : carousel peek vertical (flèches haut/bas) ----
  initSolutionCarousel() {
    const carousel = document.querySelector('.sol-carousel');
    if (!carousel) return;

    const track   = carousel.querySelector('.sol-track');
    const imgs    = carousel.querySelectorAll('.sol-img');
    const texts   = carousel.querySelectorAll('.sol-text');
    const prev    = document.getElementById('solPrev');
    const next    = document.getElementById('solNext');
    const counter = document.getElementById('solCurrent');
    const dots    = document.querySelectorAll('.sol-dot');
    const total   = texts.length;
    let current   = 0;

    const GAP  = 20;
    const PEEK = 48;
    // Slide height synced avec CSS (420px desktop / 300px mobile)
    const slideH = () => window.innerWidth <= 820 ? 300 : 420;

    const activate = (idx) => {
      current = (idx + total) % total;
      const ty = PEEK - current * (slideH() + GAP);
      track.style.transform = `translateY(${ty}px)`;
      imgs.forEach((im, i)  => im.classList.toggle('active', i === current));
      texts.forEach((t, i)  => t.classList.toggle('active', i === current));
      dots.forEach((d, i)   => d.classList.toggle('active', i === current));
      if (counter) counter.textContent = String(current + 1).padStart(2, '0');
    };

    // Clic sur les dots
    dots.forEach(d => d.addEventListener('click', () => activate(+d.dataset.step)));

    if (prev) prev.addEventListener('click', () => activate(current - 1));
    if (next) next.addEventListener('click', () => activate(current + 1));
    activate(0);
  },

  _countUpMarket(el, target, duration, delay) {
    setTimeout(() => {
      const start = performance.now();
      const tick  = (now) => {
        const p    = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        el.textContent = '$' + Math.round(ease * target) + 'B';
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay);
  }
};
