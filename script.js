/**
 * Plan'Ink Landing Page — script.js
 * Modules : Nav · Billing Toggle · Scroll Reveal · FAQ Accordion
 */

(function () {
  'use strict';

  // ============================================================
  // CONFIG
  // ============================================================
  const PRICING = {
    solo:   { monthly: 19,  annualMonths: 11 }, // 1 mois offert
    studio: { monthly: 39,  annualMonths: 10 }, // 2 mois offerts
  };

  // ============================================================
  // STATE
  // ============================================================
  let isAnnual = false;

  // ============================================================
  // NAV — sticky + burger mobile
  // ============================================================
  function initNav() {
    const nav    = document.getElementById('nav');
    const burger = document.getElementById('nav-burger');
    const mobile = document.getElementById('nav-mobile');

    if (!nav || !burger || !mobile) return;

    // Sticky scroll
    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Burger toggle
    burger.addEventListener('click', () => {
      const open = mobile.classList.toggle('open');
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', String(open));
      mobile.setAttribute('aria-hidden', String(!open));
    });

    // Close mobile nav on link click
    mobile.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobile.classList.remove('open');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        mobile.setAttribute('aria-hidden', 'true');
      });
    });
  }

  // ============================================================
  // BILLING TOGGLE — mensuel / annuel
  // ============================================================
  function initBillingToggle() {
    const toggle    = document.getElementById('billing-toggle');
    const lblM      = document.getElementById('lbl-monthly');
    const lblA      = document.getElementById('lbl-annual');
    const saveBadge = document.getElementById('save-badge');

    if (!toggle) return;

    toggle.addEventListener('click', () => {
      isAnnual = !isAnnual;
      toggle.classList.toggle('annual', isAnnual);
      toggle.setAttribute('aria-pressed', String(isAnnual));
      lblM.classList.toggle('active', !isAnnual);
      lblA.classList.toggle('active',  isAnnual);
      updatePrices();
    });

    updatePrices();
  }

  function updatePrices() {
    const soloAnnualTotal   = PRICING.solo.monthly   * PRICING.solo.annualMonths;
    const studioAnnualTotal = PRICING.studio.monthly * PRICING.studio.annualMonths;

    // Solo
    setElement('price-solo', PRICING.solo.monthly);
    setElement('annual-note-solo', isAnnual
      ? `Facturé ${soloAnnualTotal} € / an — 1 mois offert`
      : '\u00A0'
    );

    // Studio
    setElement('price-studio', PRICING.studio.monthly);
    setElement('annual-note-studio', isAnnual
      ? `Facturé ${studioAnnualTotal} € / an — 2 mois offerts`
      : '\u00A0'
    );
  }

  function setElement(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  // ============================================================
  // SCROLL REVEAL — IntersectionObserver sur [data-reveal]
  // ============================================================
  function initScrollReveal() {
    const targets = document.querySelectorAll('[data-reveal]');
    if (!targets.length) return;

    if (!('IntersectionObserver' in window)) {
      // Fallback : tout visible immédiatement
      targets.forEach(el => el.classList.add('revealed'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    targets.forEach(el => observer.observe(el));
  }

  // ============================================================
  // FAQ ACCORDION
  // ============================================================
  function initFaq() {
    const items = document.querySelectorAll('.faq-item');

    items.forEach(item => {
      const btn = item.querySelector('.faq-q');
      if (!btn) return;

      btn.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');

        // Fermer tous les autres
        items.forEach(other => {
          if (other !== item) {
            other.classList.remove('open');
            const otherBtn = other.querySelector('.faq-q');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          }
        });

        // Toggle courant
        item.classList.toggle('open', !isOpen);
        btn.setAttribute('aria-expanded', String(!isOpen));
      });
    });
  }

  // ============================================================
  // SMOOTH SCROLL — compensation hauteur nav fixe
  // ============================================================
  function initSmoothScroll() {
    const NAV_HEIGHT = 70;

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const href   = anchor.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  }

  // ============================================================
  // HERO TITLE — animation d'entrée staggered
  // ============================================================
  function initHeroAnimation() {
    const lines = document.querySelectorAll('.hero-title .line');

    lines.forEach((line, i) => {
      line.style.transitionDelay = `${i * 120}ms`;
      line.style.transform = 'translateY(100%)';
      line.style.opacity   = '0';
      line.style.transition = 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease';
    });

    // Laisser le DOM se stabiliser
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        lines.forEach(line => {
          line.style.transform = 'translateY(0)';
          line.style.opacity   = '1';
        });
      });
    });
  }

  // ============================================================
  // INIT
  // ============================================================
  function init() {
    initNav();
    initBillingToggle();
    initScrollReveal();
    initFaq();
    initSmoothScroll();
    initHeroAnimation();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
