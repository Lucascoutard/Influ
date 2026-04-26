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

          <!-- Doodles décoratifs -->
          <svg class="doodle doodle-cursor doodle-cursor--tr" aria-hidden="true" viewBox="0 0 24 30" fill="none">
            <path d="M3 3L3 24L9 18L13 27L16.5 25.5L12.5 16.5L20 16.5Z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <svg class="doodle doodle-cursor doodle-cursor--bl" aria-hidden="true" viewBox="0 0 24 30" fill="none">
            <path d="M3 3L3 24L9 18L13 27L16.5 25.5L12.5 16.5L20 16.5Z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="doodle doodle-spark doodle-spark--hero1" aria-hidden="true">✦</span>
          <span class="doodle doodle-spark doodle-spark--hero2" aria-hidden="true">✦</span>

          <div class="hero-video-bg">
            <video autoplay muted loop playsinline poster="public/assets/images/hero-video-poster.png">
              <source src="public/assets/videos/hero.mp4" type="video/mp4">
            </video>
            <div class="hero-visual-placeholder"></div>
          </div>
          <div class="hero-content">
            <h1 class="hero-title">
              We connect brands to the <em>right creators</em>
            </h1>
            <p class="hero-subtitle">
              No more random collabs. Influmatch selects, structures, and secures
              every collaboration for results that matter.
            </p>
            <div class="hero-actions">
              <a href="#contact" class="btn-primary">
                Launch my first collab
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6.5 3.5l4.5 4.5-4.5 4.5" stroke="currentColor" stroke-width="1.5"/></svg>
              </a>
              <a href="#problem" class="btn-secondary">See how it works</a>
            </div>
            <div class="hero-video-link" onclick="HomePage.openVideoModal()">
              <div class="play-icon">
                <svg viewBox="0 0 16 16"><polygon points="6,3 13,8 6,13" fill="white"/></svg>
              </div>
              Discover Influmatch — 2 min
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
            <div class="trust-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z"/></svg>
              YouTube
            </div>
            <div class="trust-sep"></div>
            <div class="trust-item trust-item--niche">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/></svg>
              Skincare
            </div>
            <div class="trust-sep"></div>
            <div class="trust-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"/></svg>
              Stripe
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
            <div class="trust-item" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z"/></svg>
              YouTube
            </div>
            <div class="trust-sep" aria-hidden="true"></div>
            <div class="trust-item trust-item--niche" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/></svg>
              Skincare
            </div>
            <div class="trust-sep" aria-hidden="true"></div>
            <div class="trust-item" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"/></svg>
              Stripe
            </div>
            <div class="trust-sep" aria-hidden="true"></div>
            <div class="trust-item" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/></svg>
              DocuSign
            </div>
            <div class="trust-sep" aria-hidden="true"></div>

            <!-- Set 3 — third copy for seamless loop -->
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
            <div class="trust-item" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z"/></svg>
              YouTube
            </div>
            <div class="trust-sep" aria-hidden="true"></div>
            <div class="trust-item trust-item--niche" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/></svg>
              Skincare
            </div>
            <div class="trust-sep" aria-hidden="true"></div>
            <div class="trust-item" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"/></svg>
              Stripe
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

      <!-- ============ 1. PROBLEM & CONTEXT ============ -->
      <section class="section-problem" id="problem">
        <div class="container">

          <!-- Heading -->
          <div class="problem-heading-wrap reveal-left">
            <span class="section-label">The facts</span>
            <h2 class="section-heading">A $33 billion market. Still run in <em>chaos.</em></h2>
            <p class="problem-intro-text">
              Influencer marketing has become a major growth lever. But the practices around collabs haven't kept up. Creators and brands have been dealing with the same friction for years — and nobody has really fixed the problem.
            </p>
          </div>

          <!-- 3 animated stats -->
          <div class="constat-stats">
            <div class="constat-stat reveal">
              <div class="constat-stat-num" id="cntMarket">$33B</div>
              <div class="constat-stat-label">at stake in 2025 — in an industry that still operates the old way.</div>
              <div class="constat-stat-source">Statista &amp; eMarketer, 2025</div>
            </div>
            <div class="constat-stat constat-stat--red reveal reveal-delay-2">
              <div class="constat-stat-num" id="cnt87">87%</div>
              <div class="constat-stat-label">of creators have already been burned on a payment.</div>
              <div class="constat-stat-source">Influencer Marketing Hub, 2024</div>
            </div>
            <div class="constat-stat constat-stat--gold reveal reveal-delay-4">
              <div class="constat-stat-num" id="cnt49">49%</div>
              <div class="constat-stat-label">of brands run their collabs completely blind.</div>
              <div class="constat-stat-source">Linqia — State of Influencer Marketing, 2024</div>
            </div>
          </div>

          <p class="problem-bridge reveal">Three symptoms. One single problem.</p>

          <!-- Pain points: numbered editorial list -->
          <div class="problem-pain-list">
            <div class="pain-item reveal">
              <span class="pain-index">01</span>
              <h3 class="pain-heading">Unclear payments</h3>
              <p class="pain-desc">No clear contract, late or missing compensation. Creators end up with no legal protection and no recourse.</p>
            </div>
            <div class="pain-item reveal reveal-delay-1">
              <span class="pain-index">02</span>
              <h3 class="pain-heading">Non-existent briefs</h3>
              <p class="pain-desc">No clear expectations, no defined deliverables. The collab goes in all directions, everyone is frustrated, and the content underperforms.</p>
            </div>
            <div class="pain-item reveal reveal-delay-2">
              <span class="pain-index">03</span>
              <h3 class="pain-heading">Zero follow-up</h3>
              <p class="pain-desc">Once the content is posted, silence. No reporting, no qualitative feedback, no lasting relationship between brand and creator.</p>
            </div>
          </div>

        </div>
      </section>

      <!-- ============ 2. SOLUTION — CAROUSEL ============ -->
      <section class="section-solution" id="solution">
        <div class="container">

          <!-- Header -->
          <div class="sol-header reveal-left">
            <span class="section-label">Our answer</span>
            <h2 class="section-heading">A <em>human</em> support system,<br>from brief to reporting.</h2>
          </div>

          <!-- Carousel: image left | arrows center | text right -->
          <div class="sol-carousel reveal">

            <!-- Left image — vertical peek carousel -->
            <div class="sol-img-wrap">
              <div class="sol-track">
                <div class="sol-img active" data-step="0">
                  <img src="public/assets/images/solution-creator-matching.png" alt="Creator matching" loading="lazy">
                  // <div class="sol-placeholder">
                  //   <svg viewBox="0 0 40 40" fill="none"><rect x="4" y="4" width="32" height="32" rx="6" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4 3"/><circle cx="15" cy="16" r="4" stroke="currentColor" stroke-width="1.5"/><path d="M6 34c2-5 5-8 9-8s7 3 9 8M26 20l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  //   <span>Photo / video — Matching</span>
                  // </div>
                </div>
                <div class="sol-img" data-step="1">
                  <img src="public/assets/images/solution-contract-signing.png" alt="Contract signing" loading="lazy">
                  // <div class="sol-placeholder">
                  //   <svg viewBox="0 0 40 40" fill="none"><rect x="4" y="4" width="32" height="32" rx="6" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4 3"/><circle cx="15" cy="16" r="4" stroke="currentColor" stroke-width="1.5"/><path d="M6 34c2-5 5-8 9-8s7 3 9 8M26 20l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  //   <span>Photo / video — Contract</span>
                  // </div>
                </div>
                <div class="sol-img" data-step="2">
                  <img src="public/assets/images/solution-deliverable-tracking.png" alt="Deliverable tracking" loading="lazy">
                  <div class="sol-placeholder">
                    <svg viewBox="0 0 40 40" fill="none"><rect x="4" y="4" width="32" height="32" rx="6" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4 3"/><circle cx="15" cy="16" r="4" stroke="currentColor" stroke-width="1.5"/><path d="M6 34c2-5 5-8 9-8s7 3 9 8M26 20l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    <span>Photo / video — Tracking</span>
                  </div>
                </div>
                <div class="sol-img sol-img--mockup" data-step="3">
                  <div class="sol-mockup-wrap">
                    <div class="platform-mockup">
                      <div class="pv-chrome">
                        <div class="pv-chrome-dots">
                          <span class="pv-chrome-dot"></span>
                          <span class="pv-chrome-dot"></span>
                          <span class="pv-chrome-dot"></span>
                        </div>
                        <div class="pv-chrome-url">
                          <svg viewBox="0 0 12 12" fill="none"><path d="M9 5V4a3 3 0 00-6 0v1M3.5 5h5a1 1 0 011 1v4a1 1 0 01-1 1h-5a1 1 0 01-1-1V6a1 1 0 011-1z" stroke="currentColor" stroke-width="1"/></svg>
                          app.influmatch.io/dashboard
                        </div>
                      </div>
                      <div class="pm-ui">
                        <div class="pm-sidebar">
                          <div class="pm-sb-logo">IM</div>
                          <div class="pm-sb-item pm-sb-item--active">
                            <svg viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.3"/><rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.3"/><rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.3"/><rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.3"/></svg>
                            <span>Dashboard</span>
                          </div>
                          <div class="pm-sb-item">
                            <svg viewBox="0 0 16 16" fill="none"><path d="M2 5h12M2 8h8M2 11h5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
                            <span>Campaigns</span>
                          </div>
                          <div class="pm-sb-item">
                            <svg viewBox="0 0 16 16" fill="none"><path d="M13 4H3a1 1 0 00-1 1v6a1 1 0 001 1h2l2 2 2-2h3a1 1 0 001-1V5a1 1 0 00-1-1z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg>
                            <span>Messages</span>
                          </div>
                          <div class="pm-sb-item">
                            <svg viewBox="0 0 16 16" fill="none"><path d="M4 2h6l3 3v9a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><path d="M10 2v3h3M5.5 8.5h5M5.5 10.5h3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
                            <span>Contracts</span>
                          </div>
                        </div>
                        <div class="pm-main">
                          <div class="pm-topbar">
                            <span class="pm-tb-title">Dashboard</span>
                            <div class="pm-spacer"></div>
                            <span class="pm-tb-btn">+ New collab</span>
                          </div>
                          <div class="pm-stats">
                            <div class="pm-stat"><span class="pm-stat-label">Active campaigns</span><span class="pm-stat-val">3</span></div>
                            <div class="pm-stat"><span class="pm-stat-label">Budget committed</span><span class="pm-stat-val">$4,200</span></div>
                            <div class="pm-stat"><span class="pm-stat-label">Active creators</span><span class="pm-stat-val">8</span></div>
                          </div>
                          <div class="pm-list">
                            <div class="pm-list-head">
                              <span>Creator · Brand</span><span>Status</span><span>Budget</span><span>Deadline</span>
                            </div>
                            <div class="pm-row">
                              <div class="pm-row-creator"><span class="pm-av" style="background:linear-gradient(135deg,#e0b88a,#a87040)">L</span>Lea D. × NovaSkin</div>
                              <span class="pm-status pm-status--green">In progress</span>
                              <span class="pm-val">$850</span>
                              <span class="pm-date">Apr 12</span>
                            </div>
                            <div class="pm-row">
                              <div class="pm-row-creator"><span class="pm-av" style="background:linear-gradient(135deg,#9dcce4,#4a8aa8)">M</span>Marc T. × GlowLab</div>
                              <span class="pm-status pm-status--violet">Brief sent</span>
                              <span class="pm-val">$1,200</span>
                              <span class="pm-date">Apr 28</span>
                            </div>
                            <div class="pm-row pm-row--dim">
                              <div class="pm-row-creator"><span class="pm-av" style="background:linear-gradient(135deg,#c4aadc,#7a50a0)">S</span>Sofia R. × Lumière</div>
                              <span class="pm-status pm-status--rose">Contract signed</span>
                              <span class="pm-val">$2,150</span>
                              <span class="pm-date">May 3</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <!-- Floating badges -->
                    <div class="pv-annotation pv-annotation--1">
                      <div class="pv-ann-dot pv-ann-dot--green"></div>
                      <div><div class="pv-ann-val">D+3</div><div class="pv-ann-lbl">Automatic transfer</div></div>
                    </div>
                    <div class="pv-annotation pv-annotation--2">
                      <div class="pv-ann-dot pv-ann-dot--violet"></div>
                      <div><div class="pv-ann-val">100%</div><div class="pv-ann-lbl">Secured payments</div></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Center arrows -->
            <div class="sol-arrows">
              <button class="sol-arrow" id="solPrev" aria-label="Previous">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>
              </button>
              <div class="sol-step-counter"><span id="solCurrent">01</span> / 04</div>
              <button class="sol-arrow" id="solNext" aria-label="Next">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
              </button>
            </div>

            <!-- Right text panels -->
            <div class="sol-texts" style="position:relative;">
              <div class="sol-dots" id="solDots">
                <div class="sol-dot active" data-step="0"></div>
                <div class="sol-dot" data-step="1"></div>
                <div class="sol-dot" data-step="2"></div>
                <div class="sol-dot" data-step="3"></div>
              </div>
              <div class="sol-text active" data-step="0">
                <h3 class="sol-text-heading">Smart matching</h3>
                <div class="sol-text-tags">
                  <span class="sol-tag">Audience</span>
                  <span class="sol-tag">Values</span>
                  <span class="sol-tag">AI</span>
                </div>
                <p class="sol-text-desc">We select creators aligned with your brand: values, audience, aesthetic. No vanity metrics — real fit.</p>
              </div>
              <div class="sol-text" data-step="1">
                <h3 class="sol-text-heading">Three-party contract</h3>
                <div class="sol-text-tags">
                  <span class="sol-tag">DocuSign</span>
                  <span class="sol-tag">Legal</span>
                  <span class="sol-tag">Secured</span>
                </div>
                <p class="sol-text-desc">Brand, creator, Influmatch. Everything is written: deliverables, usage rights, timeline, payment. Signed via DocuSign.</p>
              </div>
              <div class="sol-text" data-step="2">
                <h3 class="sol-text-heading">Ongoing human support</h3>
                <div class="sol-text-tags">
                  <span class="sol-tag">Brief</span>
                  <span class="sol-tag">Reporting</span>
                  <span class="sol-tag">Human</span>
                </div>
                <p class="sol-text-desc">We're here at every step — from brief through post-publication. Reporting, qualitative feedback, and we're already planning what's next.</p>
              </div>
              <div class="sol-text" data-step="3">
                <h3 class="sol-text-heading">Centralized tool</h3>
                <div class="sol-text-tags">
                  <span class="sol-tag">Dashboard</span>
                  <span class="sol-tag">Contracts</span>
                  <span class="sol-tag">Stats</span>
                </div>
                <p class="sol-text-desc">Conversations, contracts, deliverables, statistics: all in one place. Brands and creators each have their own space.</p>
              </div>
            </div><!-- /.sol-texts -->

          </div>

        </div>
      </section>

      <!-- ============ 3. TWO AUDIENCES ============ -->
      <section class="section-cases" id="use-cases">
        <div class="container">
          <div class="cases-header reveal" style="position:relative">
            <span class="section-label section-label--center">Who is it for?</span>
            <h2 class="section-heading">Whether you're a brand or a creator,<br><em>we've got you covered.</em></h2>
            <svg class="doodle doodle-wave-underline" aria-hidden="true" viewBox="0 0 220 14" fill="none" preserveAspectRatio="none">
              <path d="M0 7 C28 1,56 13,84 7 S140 1,168 7 S196 13,220 7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>

          <div class="cases-split">

            <!-- Brands -->
            <div class="cases-col cases-col--brand reveal-left">

              <div class="cases-col-image reveal-scale">
                <img src="public/assets/images/brand-client-usecase.png" alt="Beauty brand" class="cases-col-img">
                <div class="cases-image-badge">
                  <div class="cases-image-badge-dot"></div>
                  <div>
                    <div class="cases-image-badge-num">Top 3</div>
                    <div class="cases-image-badge-lbl">creators proposed within 48h</div>
                  </div>
                </div>
              </div>

              <div class="cases-col-body">
                <span class="cases-col-eyebrow reveal">For brands</span>
                <h3 class="cases-col-heading reveal">Find the creators who <em>match your identity.</em></h3>
                <p class="cases-col-intro reveal reveal-delay-1">No more hunting for the right profile, gut-feeling briefs, or payments with no guarantee. We structure everything for you.</p>
                <ul class="cases-benefits">
                  <li class="cases-benefit reveal reveal-delay-1">
                    <div class="cases-benefit-header">
                      <svg class="cases-benefit-icon" viewBox="0 0 16 16" fill="none"><circle cx="6.5" cy="6.5" r="4" stroke="currentColor" stroke-width="1.4"/><path d="M10 10l2.5 2.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
                      <span class="cases-benefit-label">Tailored shortlist</span>
                    </div>
                    <span class="cases-benefit-desc">Verified profiles from 10k — aligned in tone, audience, and values</span>
                  </li>
                  <li class="cases-benefit reveal reveal-delay-2">
                    <div class="cases-benefit-header">
                      <svg class="cases-benefit-icon" viewBox="0 0 16 16" fill="none"><path d="M4.5 2h5l3 3v8.5a.5.5 0 01-.5.5h-7a.5.5 0 01-.5-.5v-11a.5.5 0 01.5-.5z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M9.5 2v3h3M6 8.5h4M6 10.5h2.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
                      <span class="cases-benefit-label">Structured & shared brief</span>
                    </div>
                    <span class="cases-benefit-desc">Expectations, deliverables, usage rights, timeline — all in writing</span>
                  </li>
                  <li class="cases-benefit reveal reveal-delay-3">
                    <div class="cases-benefit-header">
                      <svg class="cases-benefit-icon" viewBox="0 0 16 16" fill="none"><path d="M8 2L13 4v4.5C13 11 11 13 8 14 5 13 3 11 3 8.5V4L8 2z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M5.5 8l2 2 3-3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
                      <span class="cases-benefit-label">Signed three-party contract</span>
                    </div>
                    <span class="cases-benefit-desc">DocuSign · Secured payments via Stripe · Zero disputes</span>
                  </li>
                  <li class="cases-benefit reveal reveal-delay-4">
                    <div class="cases-benefit-header">
                      <svg class="cases-benefit-icon" viewBox="0 0 16 16" fill="none"><path d="M2 12L5 8.5l3 2.5 3.5-5.5 2 2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
                      <span class="cases-benefit-label">Post-publication follow-up included</span>
                    </div>
                    <span class="cases-benefit-desc">Human debrief, full reporting, optimization for what comes next</span>
                  </li>
                </ul>
                <a href="#contact" class="cases-cta cases-cta--brand reveal reveal-delay-5">
                  Find my creator
                  <svg viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5"/></svg>
                </a>
              </div>
            </div>

            <!-- Creators -->
            <div class="cases-col cases-col--creator reveal-right reveal-delay-1">

              <div class="cases-col-image reveal-scale reveal-delay-1">
                <img src="public/assets/images/content-creator-usecase.png" alt="Content creator" class="cases-col-img">
                <div class="cases-image-badge">
                  <div class="cases-image-badge-dot"></div>
                  <div>
                    <div class="cases-image-badge-num">100%</div>
                    <div class="cases-image-badge-lbl">traceable & guaranteed payments</div>
                  </div>
                </div>
              </div>

              <div class="cases-col-body">
                <span class="cases-col-eyebrow reveal reveal-delay-1">For creators</span>
                <h3 class="cases-col-heading reveal reveal-delay-1">Work with brands that <em>respect you.</em></h3>
                <p class="cases-col-intro reveal reveal-delay-2">Serious brands, clear briefs, guaranteed payments. Your creativity deserves better than a DM that goes nowhere.</p>
                <ul class="cases-benefits">
                  <li class="cases-benefit reveal reveal-delay-2">
                    <div class="cases-benefit-header">
                      <svg class="cases-benefit-icon" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="5.5" stroke="currentColor" stroke-width="1.4"/><path d="M6.8 9.5c0 .7.5 1.2 1.2 1.2s1.2-.5 1.2-1.2-.5-1.3-1.2-1.3-1.2-.5-1.2-1.2.5-1.2 1.2-1.2 1.2.5 1.2 1.2M8 4.5v1.3M8 10.2v1.3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>
                      <span class="cases-benefit-label">Fair & guaranteed pay</span>
                    </div>
                    <span class="cases-benefit-desc">Transparent rates, traceable payments, zero unpaid invoices</span>
                  </li>
                  <li class="cases-benefit reveal reveal-delay-3">
                    <div class="cases-benefit-header">
                      <svg class="cases-benefit-icon" viewBox="0 0 16 16" fill="none"><rect x="2.5" y="2.5" width="11" height="11" rx="1.5" stroke="currentColor" stroke-width="1.4"/><path d="M5.5 6h5M5.5 8.5h5M5.5 11h3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
                      <span class="cases-benefit-label">Clear briefs from the start</span>
                    </div>
                    <span class="cases-benefit-desc">Goals, deliverables, legal framework — explained before you sign</span>
                  </li>
                  <li class="cases-benefit reveal reveal-delay-4">
                    <div class="cases-benefit-header">
                      <svg class="cases-benefit-icon" viewBox="0 0 16 16" fill="none"><path d="M8 1.5L9.8 6.2 14.5 8l-4.7 1.8L8 14.5 6.2 9.8 1.5 8l4.7-1.8L8 1.5z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg>
                      <span class="cases-benefit-label">Creative freedom preserved</span>
                    </div>
                    <span class="cases-benefit-desc">We set the framework to protect you, not to stifle your style</span>
                  </li>
                  <li class="cases-benefit reveal reveal-delay-5">
                    <div class="cases-benefit-header">
                      <svg class="cases-benefit-icon" viewBox="0 0 16 16" fill="none"><path d="M12.5 4a5.5 5.5 0 11-3.5 9.6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path d="M14.5 2v3.5H11" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
                      <span class="cases-benefit-label">Lasting relationship, not a one-off</span>
                    </div>
                    <span class="cases-benefit-desc">We stay in touch after publication — the best collabs are the ones that repeat</span>
                  </li>
                </ul>
                <a href="#contact" class="cases-cta cases-cta--creator reveal reveal-delay-5">
                  Join Influmatch
                  <svg viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5"/></svg>
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      <!-- ============ 4. BEFORE / AFTER INFLUMATCH ============ -->
      <section class="section-compare" id="compare">
        <div class="container">
          <div class="cmp-layout">

            <!-- Left text block -->
            <div class="cmp-text-block reveal-left">
              <span class="section-label">The change</span>
              <h2 class="section-heading">What it changes,<br><em>concretely.</em></h2>
              <p class="cmp-intro">Three real situations. Before, it was chaos. With Influmatch, every collab is structured, secured, and tracked.</p>
              <svg class="cmp-deco-arrow" viewBox="0 0 90 64" fill="none" aria-hidden="true">
                <path d="M6 6 C 24 6, 48 42, 72 36 C 80 34, 84 26, 86 18" stroke="currentColor" stroke-width="1.5" stroke-dasharray="5 4" stroke-linecap="round"/>
                <path d="M80 12 L86 18 L78 22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>

            <!-- Floating cards on the right -->
            <div class="cmp-cards-block">

              <!-- Decoration -->
              <span class="cmp-sparkle cmp-sparkle--1" aria-hidden="true">✦</span>
              <span class="cmp-sparkle cmp-sparkle--2" aria-hidden="true">✦</span>

              <!-- BEFORE card -->
              <div class="cmp-card cmp-card--before reveal">
                <div class="cmp-card-header">
                  <div class="cmp-card-dot cmp-card-dot--bad"></div>
                  <span class="cmp-card-label">Without Influmatch</span>
                </div>
                <ul class="cmp-card-list">
                  <li class="cmp-li">
                    <div class="cmp-li-icon cmp-li-icon--bad"><svg viewBox="0 0 12 12" fill="none"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></div>
                    <div>
                      <div class="cmp-li-title">"Don't worry, we'll handle it verbally."</div>
                      <div class="cmp-li-sub">No contract · dispute · $0 recovered</div>
                    </div>
                  </li>
                  <li class="cmp-li">
                    <div class="cmp-li-icon cmp-li-icon--bad"><svg viewBox="0 0 12 12" fill="none"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></div>
                    <div>
                      <div class="cmp-li-title">"Just make something cool, be creative!"</div>
                      <div class="cmp-li-sub">Vague brief · 12 back-and-forths · 10 days late</div>
                    </div>
                  </li>
                  <li class="cmp-li">
                    <div class="cmp-li-icon cmp-li-icon--bad"><svg viewBox="0 0 12 12" fill="none"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></div>
                    <div>
                      <div class="cmp-li-title">"Seen" · no reply for 3 weeks.</div>
                      <div class="cmp-li-sub">$850 unpaid · follow-ups ignored · abandoned</div>
                    </div>
                  </li>
                </ul>
              </div>

              <!-- AFTER card -->
              <div class="cmp-card cmp-card--after reveal reveal-delay-2">
                <div class="cmp-card-header">
                  <div class="cmp-card-dot cmp-card-dot--good"></div>
                  <span class="cmp-card-label">With Influmatch</span>
                </div>
                <ul class="cmp-card-list">
                  <li class="cmp-li">
                    <div class="cmp-li-icon cmp-li-icon--good"><svg viewBox="0 0 12 12" fill="none"><path d="M1.5 6l3 3L10.5 2.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
                    <div>
                      <div class="cmp-li-title">Three-party contract signed in 4 min</div>
                      <div class="cmp-li-sub">Deliverables, usage rights, deadlines · Influmatch as guarantor</div>
                    </div>
                  </li>
                  <li class="cmp-li">
                    <div class="cmp-li-icon cmp-li-icon--good"><svg viewBox="0 0 12 12" fill="none"><path d="M1.5 6l3 3L10.5 2.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
                    <div>
                      <div class="cmp-li-title">Structured brief, approved before Day 1</div>
                      <div class="cmp-li-sub">Format, tone, mentions, deadline · 0 ambiguity · 0 revisions</div>
                    </div>
                  </li>
                  <li class="cmp-li">
                    <div class="cmp-li-icon cmp-li-icon--good"><svg viewBox="0 0 12 12" fill="none"><path d="M1.5 6l3 3L10.5 2.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
                    <div>
                      <div class="cmp-li-title">$850 wired automatically on D+3</div>
                      <div class="cmp-li-sub">Held in escrow at signing · released upon approval</div>
                    </div>
                  </li>
                </ul>

                <!-- Floating stat badge -->
                <div class="cmp-stat-badge reveal reveal-delay-3">
                  <div class="cmp-stat-dot"></div>
                  <div>
                    <div class="cmp-stat-num">$850</div>
                    <div class="cmp-stat-lbl">secured on average</div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      <!-- ============ 5. PLATFORM TOOL — Client space ============ -->
      <section class="section-platform" id="platform">
        <div class="container">
          <div class="platform-layout">

            <!-- Left: features -->
            <div class="platform-text reveal-left">
              <span class="section-label">Client space</span>
              <h2 class="section-heading">One platform to <em>manage everything.</em></h2>
              <p class="platform-intro">Available from your very first collab — your dashboard replaces scattered emails, Excel spreadsheets, and manual follow-ups.</p>

              <div class="platform-feat-list">
                <div class="platform-feat">
                  <div class="pf-icon-wrap">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"/></svg>
                  </div>
                  <div>
                    <h4>Real-time campaigns</h4>
                    <p>Progress, deliverables and statuses centralized — from signature to final delivery.</p>
                  </div>
                </div>
                <div class="platform-feat">
                  <div class="pf-icon-wrap">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/></svg>
                  </div>
                  <div>
                    <h4>Secured contracts & payments</h4>
                    <p>Signature via DocuSign, Stripe escrow — released automatically upon approval.</p>
                  </div>
                </div>
                <div class="platform-feat">
                  <div class="pf-icon-wrap">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"/></svg>
                  </div>
                  <div>
                    <h4>Centralized messaging</h4>
                    <p>All your exchanges with creators in one place. No more scattered DMs.</p>
                  </div>
                </div>
                <div class="platform-feat">
                  <div class="pf-icon-wrap">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z"/></svg>
                  </div>
                  <div>
                    <h4>Analytics & reporting</h4>
                    <p>ROI, reach, engagement — full report sent after each publication.</p>
                  </div>
                </div>
              </div>

              <a href="#login" class="btn-primary">Access my space</a>
            </div>

            <!-- Right: dashboard preview -->
            <div class="platform-mockup-wrap reveal-right">
              <img src="public/assets/images/dashboard-platform-preview.webp" alt="Influmatch dashboard preview" class="platform-preview-img" loading="lazy">

              <!-- Floating badge — bottom left -->
              <div class="pv-badge pv-badge--bl reveal reveal-delay-2">
                <span class="pv-badge-dot pv-badge-dot--green"></span>
                <div>
                  <div class="pv-badge-val">D+3</div>
                  <div class="pv-badge-lbl">Automatic transfer</div>
                </div>
              </div>

              <!-- Floating badge — top right -->
              <div class="pv-badge pv-badge--tr reveal reveal-delay-3">
                <span class="pv-badge-dot pv-badge-dot--purple"></span>
                <div>
                  <div class="pv-badge-val">100%</div>
                  <div class="pv-badge-lbl">Secured payments</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <!-- ============ 7. ABOUT US ============ -->
      <section class="section-about has-grain" id="about">
        <div class="container">
          <div class="about-layout">
            <div class="about-image reveal-scale" style="position:relative">
              <span class="doodle doodle-spark doodle-spark--about1" aria-hidden="true">✦</span>
              <span class="doodle doodle-spark doodle-spark--about2" aria-hidden="true">✦</span>
              <svg class="doodle doodle-bracket doodle-bracket--left" aria-hidden="true" viewBox="0 0 16 80" fill="none">
                <path d="M12 4 C6 4, 4 8, 4 14 L4 66 C4 72, 6 76, 12 76" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
              <svg class="doodle doodle-bracket doodle-bracket--right" aria-hidden="true" viewBox="0 0 16 80" fill="none">
                <path d="M4 4 C10 4, 12 8, 12 14 L12 66 C12 72, 10 76, 4 76" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
              <div class="about-portraits">

                <div class="about-portrait">
                  <div class="about-portrait-photo">
                    <img src="public/assets/images/founder-james-flogny.png" alt="James Flogny">
                  </div>
                  <div class="about-portrait-name">James</div>
                  <div class="about-portrait-role">Co-founder</div>
                </div>

                <div class="about-portrait">
                  <div class="about-portrait-photo">
                    <img src="public/assets/images/founder-lucas-coutard.jpg" alt="Lucas Coutard">
                  </div>
                  <div class="about-portrait-name">Lucas</div>
                  <div class="about-portrait-role">Co-founder</div>
                </div>

              </div>
            </div>
            <div class="about-content reveal reveal-delay-1">
              <span class="section-label">Who we are</span>
              <h2 class="section-heading">James & Lucas,<br>two <em>complementary</em> entrepreneurs.</h2>
              <div class="about-story">
                <p>It all started during an internship — complementary skills, the same drive to build something, the same refusal to accept the status quo.</p>
                <p>One evening, a creator friend shared her struggles: opaque partnerships, poorly structured collabs, unclear payments. The same story on the brand side.</p>
                <p>We decided: <strong>let's fix this.</strong></p>
                <p>Influmatch is James and Lucas — and one simple belief: a great collab starts with respect. Content that performs, relationships that last.</p>
              </div>
              <a href="#contact" class="btn-primary" style="margin-top:8px">Join the adventure</a>
            </div>
          </div>
        </div>
      </section>

      <!-- ============ 6. SOCIAL PROOF ============ -->
      <section class="section-proof" id="proof">
        <div class="container">
          <div class="proof-header reveal">
            <span class="section-label section-label--center">What they say</span>
            <h2 class="section-heading" style="text-align:center">They <em>trusted us.</em></h2>
          </div>
        </div>

        <!-- Row 1 → left (3 identical sets) -->
        <div class="proof-marquee-wrap">
          <div class="proof-marquee-track">
            ${['', '', ''].map(() => `
            <div class="proof-card">
              <div class="proof-card-top">
                <div class="proof-card-av"><img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Emma L." loading="lazy"></div>
                <div class="proof-card-meta">
                  <div class="proof-card-name">Emma L.</div>
                  <div class="proof-card-role">Head of Marketing · NovaSkin US</div>
                </div>
                <span class="proof-card-tag proof-card-tag--brand">Brand</span>
              </div>
              <blockquote class="proof-card-quote">"We never did structured collabs before. The three-party contract made it easy to get internal sign-off. First campaign wrapped on time, on budget."</blockquote>
            </div>
            <div class="proof-card">
              <div class="proof-card-top">
                <div class="proof-card-av"><img src="https://randomuser.me/api/portraits/women/29.jpg" alt="Zoe H." loading="lazy"></div>
                <div class="proof-card-meta">
                  <div class="proof-card-name">Zoe H. · @zoehbeauty</div>
                  <div class="proof-card-role">Skincare creator · Instagram 19K</div>
                </div>
                <span class="proof-card-tag proof-card-tag--creator">Creator</span>
              </div>
              <blockquote class="proof-card-quote">"Signed the brief on Monday, got paid on Thursday. No chasing, no back-and-forth. Already referred two creator friends."</blockquote>
            </div>
            <div class="proof-card">
              <div class="proof-card-top">
                <div class="proof-card-av"><img src="https://randomuser.me/api/portraits/women/68.jpg" alt="Rachel M." loading="lazy"></div>
                <div class="proof-card-meta">
                  <div class="proof-card-name">Rachel M.</div>
                  <div class="proof-card-role">Founder · Petite Glow</div>
                </div>
                <span class="proof-card-tag proof-card-tag--brand">Brand</span>
              </div>
              <blockquote class="proof-card-quote">"2 creators matched in 48h who actually fit our aesthetic — not just big numbers. That kind of curation is what we were looking for."</blockquote>
            </div>`).join('')}
          </div>
        </div>

        <!-- Row 2 → right (3 identical sets, reverse direction) -->
        <div class="proof-marquee-wrap">
          <div class="proof-marquee-track proof-marquee-track--reverse">
            ${['', '', ''].map(() => `
            <div class="proof-card">
              <div class="proof-card-top">
                <div class="proof-card-av"><img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Alex N." loading="lazy"></div>
                <div class="proof-card-meta">
                  <div class="proof-card-name">Alex N. · @alexncreates</div>
                  <div class="proof-card-role">Lifestyle creator · TikTok 34K</div>
                </div>
                <span class="proof-card-tag proof-card-tag--creator">Creator</span>
              </div>
              <blockquote class="proof-card-quote">"I actually read the whole contract and understood every line. Usage rights, payment date, revision scope. This is how it should work everywhere."</blockquote>
            </div>
            <div class="proof-card">
              <div class="proof-card-top">
                <div class="proof-card-av"><img src="https://randomuser.me/api/portraits/women/56.jpg" alt="Claire B." loading="lazy"></div>
                <div class="proof-card-meta">
                  <div class="proof-card-name">Claire B.</div>
                  <div class="proof-card-role">Brand Manager · Lumière Beauty</div>
                </div>
                <span class="proof-card-tag proof-card-tag--brand">Brand</span>
              </div>
              <blockquote class="proof-card-quote">"Our legal team used to block every influencer collab. With Influmatch's contract framework, we got sign-off in a day. Game changer internally."</blockquote>
            </div>
            <div class="proof-card">
              <div class="proof-card-top">
                <div class="proof-card-av"><img src="https://randomuser.me/api/portraits/women/63.jpg" alt="Sam F." loading="lazy"></div>
                <div class="proof-card-meta">
                  <div class="proof-card-name">Sam F. · @samfitzbeauty</div>
                  <div class="proof-card-role">Beauty creator · Instagram 27K</div>
                </div>
                <span class="proof-card-tag proof-card-tag--creator">Creator</span>
              </div>
              <blockquote class="proof-card-quote">"The brief was clear, my creative direction was respected, and payment landed before the post even went live. Nothing like anything I'd experienced before."</blockquote>
            </div>`).join('')}
          </div>
        </div>
      </section>

      <!-- ============ 7. FAQ ============ -->
      <section class="section-faq" id="faq">
        <div class="container container--narrow">
          <div class="faq-header reveal">
            <span class="section-label section-label--center">Frequently asked questions</span>
            <h2 class="section-heading">Everything you want <em>to know.</em></h2>
          </div>

          <div class="faq-list">
            <div class="faq-item reveal" onclick="HomePage.toggleFaq(this)">
              <div class="faq-question">
                <span>How does the matching process work?</span>
                <div class="faq-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg></div>
              </div>
              <div class="faq-answer">
                <p>We start by analyzing your brand — your identity, values, aesthetic, and target audience. From there, we identify the creator profile that fits you best. We don't send a list for you to scroll through. We bring you the right person.</p>
              </div>
            </div>

            <div class="faq-item reveal reveal-delay-1" onclick="HomePage.toggleFaq(this)">
              <div class="faq-question">
                <span>How long does it take to find the right creator?</span>
                <div class="faq-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg></div>
              </div>
              <div class="faq-answer">
                <p>Most brands receive their creator proposal within 48 hours of their discovery call. We take the time to understand your brand first — because a well-matched creator from the start saves everyone time down the line.</p>
              </div>
            </div>

            <div class="faq-item reveal reveal-delay-1" onclick="HomePage.toggleFaq(this)">
              <div class="faq-question">
                <span>I'm a creator — how do I join?</span>
                <div class="faq-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg></div>
              </div>
              <div class="faq-answer">
                <p>Reach out via the contact form. We review your profile — authenticity, engagement quality, niche — and get back to you within a few days. We work with creators from 10K followers who have a real relationship with their audience.</p>
              </div>
            </div>

            <div class="faq-item reveal reveal-delay-2" onclick="HomePage.toggleFaq(this)">
              <div class="faq-question">
                <span>What does the contract cover?</span>
                <div class="faq-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg></div>
              </div>
              <div class="faq-answer">
                <p>The three-party contract (brand + creator + Influmatch) is signed digitally via trusted platforms like DocuSign or equivalent. It covers deliverables, posting deadlines, usage rights, revision rounds, and payment terms. Everything is written before anything starts.</p>
              </div>
            </div>

            <div class="faq-item reveal reveal-delay-2" onclick="HomePage.toggleFaq(this)">
              <div class="faq-question">
                <span>When do creators get paid?</span>
                <div class="faq-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg></div>
              </div>
              <div class="faq-answer">
                <p>Payment terms are defined in the contract before the collab begins. No chasing, no uncertainty — the timeline is agreed upfront and enforced by the contract.</p>
              </div>
            </div>

            <div class="faq-item reveal reveal-delay-3" onclick="HomePage.toggleFaq(this)">
              <div class="faq-question">
                <span>What happens after the content goes live?</span>
                <div class="faq-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg></div>
              </div>
              <div class="faq-answer">
                <p>We debrief with both sides — reach, engagement, qualitative feedback. If the collab went well, we can facilitate a follow-up. We're not here for one-off transactions. We're here to build lasting partnerships.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ============ 8. FINAL CTA — Centered editorial ============ -->
      <section class="section-cta-final has-grain" id="cta-final">
        <div class="container">
          <div class="cta-final-inner reveal-blur" style="position:relative">
            <span class="doodle doodle-spark doodle-spark--cta1" aria-hidden="true">✦</span>
            <span class="doodle doodle-spark doodle-spark--cta2" aria-hidden="true">✦</span>
            <span class="doodle doodle-spark doodle-spark--cta3" aria-hidden="true">✦</span>
            <svg class="doodle doodle-circle-sketch" aria-hidden="true" viewBox="0 0 100 60" fill="none">
              <ellipse cx="50" cy="30" rx="44" ry="22" stroke="currentColor" stroke-width="1.4" stroke-dasharray="5 4" stroke-linecap="round"/>
            </svg>
            <span class="section-label section-label--light section-label--center">Ready to get started?</span>
            <div class="cta-final-rule"></div>
            <blockquote class="cta-final-quote">
              "We started this project because we believe a successful collaboration begins with respect. Join us, and let's build something meaningful together."
            </blockquote>
            <div class="cta-final-authors">
              <span>James & Lucas</span> — Founders of Influmatch
            </div>
            <div class="cta-final-actions">
              <a href="#contact" class="btn-primary">
                Book a discovery call
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6.5 3.5l4.5 4.5-4.5 4.5" stroke="currentColor" stroke-width="1.5"/></svg>
              </a>
              <a href="#login" class="btn-outline">Client login</a>
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
                Influmatch connects brands to the creators who match their identity. Structured, human collaborations that perform.
              </p>
            </div>
            <div class="footer-col">
              <h4>Our services</h4>
              <a href="#solution">Our method</a>
              <a href="#use-cases">For brands</a>
              <a href="#use-cases">For creators</a>
            </div>
            <div class="footer-col">
              <h4>Why us</h4>
              <a href="#compare">Before / After</a>
              <a href="#platform">The platform</a>
              <a href="#about">Who we are</a>
              <a href="#proof">Testimonials</a>
              <a href="#faq">FAQ</a>
            </div>
            <div class="footer-col">
              <h4>Get started</h4>
              <a href="#login">Client login</a>
              <a href="#contact">Contact</a>
            </div>
          </div>
          <div class="footer-bottom">
            <p>&copy; ${new Date().getFullYear()} Influmatch. All rights reserved.</p>
            <div class="footer-legal-links">
              <a href="#privacy">Privacy</a>
              <span>·</span>
              <a href="#cgu">Terms</a>
              <span>·</span>
              <a href="#mentions">Legal notice</a>
              <span>·</span>
              <a href="#dmca">DMCA</a>
            </div>
          </div>
        </div>
      </footer>
    `;
  },


  // ---- FAQ accordion ----
  toggleFaq(el) {
    const isOpen = el.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) el.classList.add('open');
  },

  // ---- Constat stats : counters au scroll ----
  openVideoModal() {
    // Supprimer un éventuel overlay résiduel
    const existing = document.getElementById('heroVideoOverlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id        = 'heroVideoOverlay';
    overlay.className = 'hvm-overlay';
    overlay.innerHTML = `
      <div class="hvm-modal">
        <button class="hvm-close" id="hvmClose" aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
               stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
        <div class="hvm-yt-wrap">
          <iframe id="hvmIframe"
            src="https://www.youtube.com/embed/CGSJTje4KvA?rel=0&modestbranding=1"
            allow="autoplay; fullscreen"
            allowfullscreen
            frameborder="0">
          </iframe>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    // Fade in
    requestAnimationFrame(() => overlay.classList.add('hvm-overlay--in'));

    const close = () => {
      const iframe = document.getElementById('hvmIframe');
      if (iframe) iframe.src = '';
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

    // Reset to zero before animation
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

  // ---- Solution : vertical peek carousel (up/down arrows) ----
  initSolutionCarousel() {
    const carousel = document.querySelector('.sol-carousel');
    if (!carousel) return;

    // Kill ALL previous listeners + timer (SPA re-init guard)
    clearInterval(HomePage._solTimer);
    if (HomePage._solAbort) HomePage._solAbort.abort();
    HomePage._solAbort = new AbortController();
    const sig = HomePage._solAbort.signal;

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

    const startAuto = () => {
      clearInterval(HomePage._solTimer);
      HomePage._solTimer = setInterval(() => activate(current + 1), 3000);
    };
    const resetAuto = () => { clearInterval(HomePage._solTimer); startAuto(); };

    // All listeners scoped to this init — aborted on next init
    carousel.addEventListener('mouseenter', () => clearInterval(HomePage._solTimer), { signal: sig });
    carousel.addEventListener('mouseleave', startAuto, { signal: sig });

    dots.forEach(d => d.addEventListener('click', () => { activate(+d.dataset.step); resetAuto(); }, { signal: sig }));
    if (prev) prev.addEventListener('click', () => { activate(current - 1); resetAuto(); }, { signal: sig });
    if (next) next.addEventListener('click', () => { activate(current + 1); resetAuto(); }, { signal: sig });

    activate(0);
    startAuto();
  },

  initCompareSlider() {
    const wrap    = document.getElementById('compareSlider');
    const after   = document.getElementById('csAfterPanel');
    const divider = document.getElementById('csDivider');
    if (!wrap || !after || !divider) return;

    let active  = false;
    let entered = false;

    // Apply position without transition (smooth drag)
    const setPos = (pct) => {
      const v = `inset(0 0 0 ${pct}%)`;
      after.style.clipPath        = v;
      after.style.webkitClipPath  = v;
      divider.style.left          = pct + '%';
    };

    // Initial position: BEFORE fully visible
    setPos(97);

    // Entry animation: sweep to 50% when slider is visible
    const io = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting || entered) return;
      entered = true;
      io.disconnect();
      const easing = 'cubic-bezier(.16,1,.3,1)';
      after.style.transition        = `clip-path 1.1s ${easing}, -webkit-clip-path 1.1s ${easing}`;
      divider.style.transition      = `left 1.1s ${easing}`;
      setTimeout(() => {
        setPos(50);
        setTimeout(() => {
          after.style.transition   = 'none';
          divider.style.transition = 'none';
        }, 1200);
      }, 280);
    }, { threshold: 0.35 });
    io.observe(wrap);

    // Drag
    const onMove = (clientX) => {
      const r   = wrap.getBoundingClientRect();
      const pct = Math.max(4, Math.min(96, ((clientX - r.left) / r.width) * 100));
      after.style.transition   = 'none';
      divider.style.transition = 'none';
      setPos(pct);
    };

    wrap.addEventListener('mousedown', (e) => { active = true; onMove(e.clientX); e.preventDefault(); });
    document.addEventListener('mousemove', (e) => { if (active) onMove(e.clientX); });
    document.addEventListener('mouseup',   ()  => { active = false; });

    wrap.addEventListener('touchstart', (e) => {
      active = true; onMove(e.touches[0].clientX);
    }, { passive: true });
    document.addEventListener('touchmove', (e) => {
      if (!active) return;
      e.preventDefault();
      onMove(e.touches[0].clientX);
    }, { passive: false });
    document.addEventListener('touchend', () => { active = false; });
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
