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
    this._initWordSplit();
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
  },

  // ============================================
  // WORD-SPLIT REVEAL — kinetic typography
  // Applies to .section-heading and .hero-title
  // Each word slides up from below its overflow:hidden container
  // ============================================
  _initWordSplit() {
    const heroTitle     = document.querySelector('.hero-title');
    const scrollHeadings = document.querySelectorAll('.section-heading');
    if (!heroTitle && !scrollHeadings.length) return;

    // ── Split all targets ─────────────────────────────────────
    if (heroTitle) {
      let i = 0;
      this._splitNode(heroTitle, () => i++, 75);
    }
    scrollHeadings.forEach(el => {
      let i = 0;
      this._splitNode(el, () => i++, 60);
    });

    // ── Hero title: reveal immediately (no scroll trigger) ────
    if (heroTitle) {
      requestAnimationFrame(() => {
        heroTitle.style.opacity = '1';
        requestAnimationFrame(() => heroTitle.classList.add('anim-in'));
      });
    }

    // ── Section headings: reveal on scroll ───────────────────
    if (scrollHeadings.length) {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('anim-in');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

      scrollHeadings.forEach(el => {
        // Already in viewport on page load (e.g. very tall screens)
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.9) {
          setTimeout(() => el.classList.add('anim-in'), 80);
        } else {
          obs.observe(el);
        }
      });
    }
  },

  // Recursively split text nodes into .sw-outer/.sw-inner word spans
  _splitNode(node, nextIdx, staggerMs) {
    const children = [...node.childNodes];
    node.innerHTML = '';
    children.forEach(child => {
      if (child.nodeType === Node.TEXT_NODE) {
        child.textContent.split(/(\s+)/).forEach(tok => {
          if (!tok || /^\s+$/.test(tok)) {
            node.appendChild(document.createTextNode(tok));
          } else {
            node.appendChild(this._wrapWord(tok, nextIdx() * staggerMs));
          }
        });
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        const clone = child.cloneNode(false);
        node.appendChild(clone);
        this._splitNode(clone, nextIdx, staggerMs);
      }
    });
  },

  _wrapWord(text, delayMs) {
    const outer = document.createElement('span');
    outer.className = 'sw-outer';
    const inner = document.createElement('span');
    inner.className = 'sw-inner';
    inner.style.transitionDelay = `${delayMs}ms`;
    inner.textContent = text;
    outer.appendChild(inner);
    return outer;
  }
};
