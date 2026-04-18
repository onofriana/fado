/* ============================================================
   ONOFRIANA — main.js
   ============================================================ */

(function () {
  'use strict';

  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function gtag() { window.dataLayer = window.dataLayer || []; window.dataLayer.push(arguments); }

  const CONSENT_KEY = 'onofriana_consent_v1';

  /* YEAR */
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* NAV scroll */
  const nav = $('#nav');
  if (nav) {
    const onScroll = () => {
      if (window.scrollY > 20) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* MOBILE NAV TOGGLE */
  const navToggle = $('#navToggle');
  const navMenu = $('#nav-menu');
  if (navToggle && navMenu) {
    const closeNav = () => {
      navMenu.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Abrir menu');
    };
    const openNav = () => {
      navMenu.classList.add('is-open');
      navToggle.setAttribute('aria-expanded', 'true');
      navToggle.setAttribute('aria-label', 'Fechar menu');
    };
    navToggle.addEventListener('click', () => {
      if (navMenu.classList.contains('is-open')) closeNav(); else openNav();
    });
    $$('a', navMenu).forEach(link => link.addEventListener('click', closeNav));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('is-open')) closeNav();
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 820 && navMenu.classList.contains('is-open')) closeNav();
    });
  }

  /* REVEAL */
  const reveals = $$('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -5% 0px' });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('is-in'));
  }

  /* MODAL */
  const privacyModal = $('#privacyModal');
  let lastFocusedBeforeModal = null;

  function getFocusable(container) {
    return $$(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
      container
    ).filter(el => el.offsetParent !== null || el === document.activeElement);
  }

  function openModal(modal) {
    if (!modal) return;
    lastFocusedBeforeModal = document.activeElement;
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      const focusables = getFocusable(modal);
      if (focusables.length) focusables[0].focus();
    }, 30);
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
    if (lastFocusedBeforeModal && typeof lastFocusedBeforeModal.focus === 'function') {
      lastFocusedBeforeModal.focus();
    }
  }

  if (privacyModal) {
    const openBtn = $('#openPrivacy');
    if (openBtn) openBtn.addEventListener('click', () => openModal(privacyModal));
    const openBtnBanner = $('#openPrivacyFromBanner');
    if (openBtnBanner) openBtnBanner.addEventListener('click', () => openModal(privacyModal));

    $$('[data-close]', privacyModal).forEach(el => {
      el.addEventListener('click', () => closeModal(privacyModal));
    });

    document.addEventListener('keydown', (e) => {
      if (!privacyModal.classList.contains('is-open')) return;
      if (e.key === 'Escape') { closeModal(privacyModal); return; }
      if (e.key === 'Tab') {
        const focusables = getFocusable(privacyModal);
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  /* QUOTE FORM */
  const quoteForm = $('#quoteForm');

  // Privacy link inside the form
  const openPrivacyFromForm = $('#openPrivacyFromForm');
  if (openPrivacyFromForm && privacyModal) {
    openPrivacyFromForm.addEventListener('click', () => openModal(privacyModal));
  }

  // Format CTAs — scroll to form and pre-select format
  $$('.format__cta[data-format]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const format = btn.dataset.format;
      const formatSelect = $('#qf-format');
      if (formatSelect && format) formatSelect.value = format;
      const formSection = $('#orcamento');
      if (formSection) {
        formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(() => {
          const firstInput = formSection.querySelector('input[type="text"]');
          if (firstInput) firstInput.focus();
        }, 600);
      }
    });
  });

  // Form AJAX submission (Formspree)
  if (quoteForm) {
    quoteForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!quoteForm.checkValidity()) { quoteForm.reportValidity(); return; }
      const submitBtn   = quoteForm.querySelector('.quote-form__submit');
      const submitText  = quoteForm.querySelector('.quote-form__submit-text');
      const submitLoad  = quoteForm.querySelector('.quote-form__submit-loading');
      const feedback    = quoteForm.querySelector('.quote-form__feedback');

      submitBtn.disabled  = true;
      submitText.hidden   = true;
      submitLoad.hidden   = false;
      feedback.hidden     = true;

      try {
        const res = await fetch(quoteForm.action, {
          method: 'POST',
          body: new FormData(quoteForm),
          headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
          quoteForm.reset();
          feedback.textContent = 'Pedido enviado. Entraremos em contacto em breve.';
          feedback.className = 'quote-form__feedback quote-form__feedback--success';
          feedback.hidden = false;
          if (typeof gtag !== 'undefined') {
            gtag('event', 'generate_lead', { event_category: 'orcamento' });
          }
        } else {
          throw new Error();
        }
      } catch {
        feedback.textContent = 'Erro ao enviar. Por favor, tente novamente ou contacte-nos em fado@onofriana.pt.';
        feedback.className = 'quote-form__feedback quote-form__feedback--error';
        feedback.hidden = false;
      } finally {
        submitBtn.disabled = false;
        submitText.hidden  = false;
        submitLoad.hidden  = true;
      }
    });
  }

  /* FAB */
  const fab = $('#fab');
  const contactSection = $('#contact');
  const orcamentoSection = $('#orcamento');

  function updateFab() {
    if (!fab) return;
    const scrolled = window.scrollY > window.innerHeight * 0.4;
    let onContact = false;
    if (contactSection) {
      const r = contactSection.getBoundingClientRect();
      onContact = r.top < window.innerHeight * 0.6 && r.bottom > 0;
    }
    let onOrcamento = false;
    if (orcamentoSection) {
      const r = orcamentoSection.getBoundingClientRect();
      onOrcamento = r.top < window.innerHeight * 0.6 && r.bottom > 0;
    }
    const footer = document.querySelector('.footer');
    let onFooter = false;
    if (footer) {
      const r = footer.getBoundingClientRect();
      onFooter = r.top < window.innerHeight * 0.8;
    }
    if (scrolled && !onContact && !onOrcamento && !onFooter) {
      fab.classList.add('is-visible');
      fab.classList.remove('is-hidden');
    } else {
      fab.classList.remove('is-visible');
      fab.classList.add('is-hidden');
    }
  }

  if (fab) {
    window.addEventListener('scroll', updateFab, { passive: true });
    window.addEventListener('resize', updateFab);
    updateFab();
  }

  /* ============================================================
     COOKIE BANNER — inline no rodapé
     ============================================================ */
  const banner = $('#cookieBanner');
  const btnAccept   = $('#cookieAccept');
  const btnReject   = $('#cookieReject');
  const btnSettings = $('#cookieSettings');
  const toggleAnalytics = $('#toggleAnalytics');
  const toggleMarketing = $('#toggleMarketing');
  const footerCookieBtn = $('#openCookieSettings');

  function readConsent() {
    try { return JSON.parse(localStorage.getItem(CONSENT_KEY) || 'null'); }
    catch { return null; }
  }
  function saveConsent(consent) {
    try { localStorage.setItem(CONSENT_KEY, JSON.stringify(consent)); }
    catch {}
  }
  function applyConsentToGtag(consent) {
    const analytics = consent && consent.analytics ? 'granted' : 'denied';
    const marketing = consent && consent.marketing ? 'granted' : 'denied';
    gtag('consent', 'update', {
      'ad_storage':         marketing,
      'ad_user_data':       marketing,
      'ad_personalization': marketing,
      'analytics_storage':  analytics
    });
  }

  function showBanner(withSettings = false) {
    if (!banner) return;
    if (withSettings) banner.classList.add('show-settings');
    banner.hidden = false;
  }

  function hideBanner() {
    if (!banner) return;
    banner.hidden = true;
    banner.classList.remove('show-settings');
  }

  function setToggle(btn, value) {
    if (!btn) return;
    btn.setAttribute('aria-checked', value ? 'true' : 'false');
  }
  function getToggleValue(btn) {
    return btn && btn.getAttribute('aria-checked') === 'true';
  }

  // Mostrar banner só se ainda não consentiu
  const existing = readConsent();
  if (!existing && banner) {
    showBanner(false);
  } else if (existing) {
    // já consentiu — aplicar e refletir nos toggles
    applyConsentToGtag(existing);
    if (toggleAnalytics) setToggle(toggleAnalytics, !!existing.analytics);
    if (toggleMarketing) setToggle(toggleMarketing, !!existing.marketing);
  }

  // Aceitar (tudo, ou os toggles se o painel estiver aberto)
  if (btnAccept) {
    btnAccept.addEventListener('click', () => {
      let consent;
      if (banner && banner.classList.contains('show-settings')) {
        consent = {
          analytics: getToggleValue(toggleAnalytics),
          marketing: getToggleValue(toggleMarketing),
          ts: Date.now()
        };
      } else {
        consent = { analytics: true, marketing: true, ts: Date.now() };
        setToggle(toggleAnalytics, true);
        setToggle(toggleMarketing, true);
      }
      saveConsent(consent);
      applyConsentToGtag(consent);
      hideBanner();
    });
  }

  // Recusar
  if (btnReject) {
    btnReject.addEventListener('click', () => {
      const consent = { analytics: false, marketing: false, ts: Date.now() };
      saveConsent(consent);
      applyConsentToGtag(consent);
      setToggle(toggleAnalytics, false);
      setToggle(toggleMarketing, false);
      hideBanner();
    });
  }

  // Personalizar — abrir/fechar painel
  if (btnSettings) {
    btnSettings.addEventListener('click', () => {
      if (!banner) return;
      banner.classList.toggle('show-settings');
    });
  }

  // Toggles individuais
  [toggleAnalytics, toggleMarketing].forEach(t => {
    if (!t || t.disabled) return;
    t.addEventListener('click', () => {
      setToggle(t, !getToggleValue(t));
    });
  });

  // Reabrir a partir do footer — mostra o banner já com definições abertas
  if (footerCookieBtn) {
    footerCookieBtn.addEventListener('click', () => {
      showBanner(true);
      // scroll suave até ao banner
      if (banner) {
        setTimeout(() => {
          banner.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
    });
  }

})();
