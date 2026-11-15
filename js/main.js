/* Quinta Amaranto — interacciones generales. JS nativo, sin compilación. */
(() => {
  'use strict';
  const $ = (sel, scope = document) => scope.querySelector(sel);
  const $$ = (sel, scope = document) => Array.from(scope.querySelectorAll(sel));
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


  const header = $('.site-header');
  const toggle = $('.menu-toggle');
  const mobileMenu = $('.mobile-menu');
  const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 35);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive:true });
  toggle?.addEventListener('click', () => {
    const isOpen = document.body.classList.toggle('menu-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
  });
  $$('a', mobileMenu).forEach(link => link.addEventListener('click', () => {
    document.body.classList.remove('menu-open');
    toggle?.setAttribute('aria-expanded', 'false');
    toggle?.setAttribute('aria-label', 'Abrir menú');
  }));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') { document.body.classList.remove('menu-open'); toggle?.setAttribute('aria-expanded','false'); }
  });

  $('#year').textContent = new Date().getFullYear();
  const revealItems = $$('.reveal');
  if ('IntersectionObserver' in window && !reduced) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('in-view'); observer.unobserve(entry.target); }
      });
    }, { threshold: .10, rootMargin:'0px 0px -25px 0px' });
    revealItems.forEach(item => observer.observe(item));
  } else { revealItems.forEach(item => item.classList.add('in-view')); }

  // Imágenes del recinto: si el servidor de origen bloquea hotlinks, muestra fotografía de muestra.
  $$('img[data-fallback]').forEach(img => {
    img.addEventListener('error', () => {
      if (!img.dataset.fallbackUsed) {
        img.dataset.fallbackUsed = 'true';
        img.src = img.dataset.fallback;
      } else if (img.dataset.fallbackUsed !== 'local') {
        img.dataset.fallbackUsed = 'local';
        img.src = img.alt.toLowerCase().includes('montaje') || img.alt.toLowerCase().includes('mesas') || img.alt.toLowerCase().includes('recepción') ? 'assets/img/celebracion-demo.svg' : 'assets/img/jardin-demo.svg';
      }
    });
  });

  if (!reduced && window.matchMedia('(pointer: fine)').matches) {
    const glow = $('.cursor-glow');
    window.addEventListener('pointermove', e => {
      if (glow) { glow.style.opacity = '1'; glow.style.left = e.clientX + 'px'; glow.style.top = e.clientY + 'px'; }
    }, { passive:true });
    $$('.magnetic').forEach(el => {
      el.addEventListener('pointermove', e => {
        const rect = el.getBoundingClientRect();
        const dx = (e.clientX - rect.left - rect.width / 2) * .12;
        const dy = (e.clientY - rect.top - rect.height / 2) * .12;
        el.style.transform = `translate(${dx}px, ${dy}px)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
    $$('[data-tilt]').forEach(el => {
      el.addEventListener('pointermove', e => {
        if (el.classList.contains('floating-photo')) return;
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5;
        const y = (e.clientY - r.top) / r.height - .5;
        el.style.transform = `rotateX(${-y*2.5}deg) rotateY(${x*3.5}deg)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
  }

  // Parallax suave; se recalcula con requestAnimationFrame, no en cada pixel de scroll.
  const parallaxes = $$('[data-parallax]');
  let ticking = false;
  const updateParallax = () => {
    if (!reduced && window.innerWidth > 930) parallaxes.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const amount = Number(el.dataset.parallax) || 0;
      el.style.transform = `translateY(${(window.innerHeight/2 - rect.top - rect.height/2) * amount}px)`;
    });
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(updateParallax); ticking = true; }
  }, { passive:true });

  // Respeto por ahorro de datos / accesibilidad.
  const heroVideo = $('.hero-video');
  if (reduced || navigator.connection?.saveData) { const secondVideo = $('.statement-video'); secondVideo?.pause(); }
  if (heroVideo && (reduced || navigator.connection?.saveData)) heroVideo.pause();
  if ('IntersectionObserver' in window && heroVideo) {
    const videoObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => entry.isIntersecting && !reduced ? heroVideo.play().catch(() => {}) : heroVideo.pause());
    });
    videoObserver.observe(heroVideo);
  }
})();
