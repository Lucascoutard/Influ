/* ===================================================
   APP/CONTROLLERS/NAVIGATIONCONTROLLER.JS
   FIXED: routes vs sections + scroll reveal animation
   =================================================== */

const NavigationController = {

  _scrollBound: false,
  _progressBound: false,

  bind() {
    this._bindHeaderScroll();
    this._bindMobileMenu();
    this._bindSmoothScroll();
    this._bindScrollProgress();
    this._bindScrollReveal();
  },

  // Header background on scroll (bind once)
  _bindHeaderScroll() {
    if (this._scrollBound) return;
    this._scrollBound = true;
    window.addEventListener('scroll', () => {
      const header = document.getElementById('header');
      if (header) header.classList.toggle('scrolled', window.scrollY > 20);
    });
  },

  // Scroll progress bar (bind once)
  _bindScrollProgress() {
    if (this._progressBound) return;
    this._progressBound = true;
    window.addEventListener('scroll', () => {
      const bar = document.getElementById('scrollProgress');
      if (!bar) return;
      const scrolled = document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      bar.style.width = height > 0 ? (scrolled / height) * 100 + '%' : '0%';
    });
  },

  // Mobile menu
  _bindMobileMenu() {
    const toggle = document.getElementById('menuToggle');
    const close  = document.getElementById('mobileClose');
    const nav    = document.getElementById('mobileNav');
    if (toggle && nav) {
      toggle.addEventListener('click', () => {
        nav.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    }
    if (close && nav) {
      close.addEventListener('click', () => this.closeMobile());
    }
  },

  closeMobile() {
    const nav = document.getElementById('mobileNav');
    if (nav) {
      nav.classList.remove('open');
      document.body.style.overflow = '';
    }
  },

  // FIXED: smooth scroll only for sections, not page routes
  _bindSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') return;

        const route = href.replace('#', '');

        // Page route → let hash change naturally, Router handles it
        if (Router.isPageRoute(route)) {
          NavigationController.closeMobile();
          return;
        }

        // Section anchor → smooth scroll
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          NavigationController.closeMobile();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  },

  // ============================================
  // SCROLL REVEAL — IntersectionObserver
  // Elements with class .reveal fade in when visible
  // ============================================
  _bindScrollReveal() {
    const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-scale');
    if (!reveals.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -60px 0px'
    });

    reveals.forEach(el => observer.observe(el));
  }
};
