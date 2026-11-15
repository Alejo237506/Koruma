/* Portada de bienvenida — visualización sensible al cursor y entrada accesible. */
(() => {
  'use strict';
  const portal = document.getElementById('portal');
  const button = document.getElementById('portal-enter');
  if (!portal || !button) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const underlay = [document.querySelector('.site-header'), document.querySelector('main'), document.querySelector('footer')].filter(Boolean);
  underlay.forEach(node => { node.inert = true; });

  // Cada carácter puede desplazarse sutilmente. El texto original permanece legible para lectores de pantalla.
  const lines = Array.from(portal.querySelectorAll('[data-portal-line]'));
  const allLetters = [];
  for (const line of lines) {
    const title = line.textContent.trim();
    line.textContent = '';
    line.setAttribute('aria-hidden', 'true');
    Array.from(title).forEach(char => {
      const span = document.createElement('span');
      span.className = 'char';
      span.textContent = char;
      line.appendChild(span);
      allLetters.push(span);
    });
  }

  const floaters = Array.from(portal.querySelectorAll('[data-portal-float]'));
  let raf = 0;
  let pointerX = 0.65;
  let pointerY = 0.4;
  let active = true;
  const finePointer = window.matchMedia('(pointer: fine)').matches;

  function moveVisuals() {
    raf = 0;
    if (!active || reduced) return;
    portal.style.setProperty('--px', `${(pointerX * 100).toFixed(2)}%`);
    portal.style.setProperty('--py', `${(pointerY * 100).toFixed(2)}%`);
    if (finePointer) {
      floaters.forEach(node => {
        const direction = Number(node.dataset.portalFloat) || 1;
        node.style.setProperty('--float-x', `${((pointerX - .5) * direction * -27).toFixed(1)}px`);
        node.style.setProperty('--float-y', `${((pointerY - .5) * direction * -24).toFixed(1)}px`);
      });
      // Deformación suave concentrada alrededor del cursor, nunca destruye la legibilidad.
      for (const char of allLetters) {
        const box = char.getBoundingClientRect();
        const x = box.left + box.width / 2;
        const y = box.top + box.height / 2;
        const mouseX = pointerX * window.innerWidth;
        const mouseY = pointerY * window.innerHeight;
        const distance = Math.hypot(x - mouseX, y - mouseY);
        const strength = Math.max(0, 1 - distance / 360);
        char.style.transform = strength ? `translate3d(${((x-mouseX)*strength*.025).toFixed(1)}px, ${(-strength*17).toFixed(1)}px, ${(strength*40).toFixed(1)}px) rotate(${strength*2.5}deg)` : '';
      }
    }
  }

  function updatePointer(event) {
    if (!active) return;
    pointerX = Math.min(.99, Math.max(.01, event.clientX / window.innerWidth));
    pointerY = Math.min(.99, Math.max(.01, event.clientY / window.innerHeight));
    if (!raf) raf = requestAnimationFrame(moveVisuals);
  }

  function enter() {
    if (!active) return;
    active = false;
    portal.classList.remove('is-peeking');
    portal.classList.add('is-leaving');
    document.body.classList.remove('portal-open');
    underlay.forEach(node => { node.inert = false; });
    if (raf) cancelAnimationFrame(raf);
    window.scrollTo({ top: 0, behavior: 'auto' });
    const finish = () => {
      if (portal.parentNode) portal.remove();
      if (document.activeElement === button) {
        const title = document.getElementById('hero-title');
        title?.setAttribute('tabindex', '-1');
        title?.focus({ preventScroll: true });
      }
    };
    if (reduced) finish();
    else setTimeout(finish, 1290);
  }

  button.addEventListener('click', enter);
  portal.addEventListener('pointermove', updatePointer, { passive: true });
  portal.addEventListener('pointerdown', event => {
    if (!event.target.closest('button')) portal.classList.add('is-peeking');
    updatePointer(event);
  }, { passive: true });
  const cancelPeek = () => portal.classList.remove('is-peeking');
  portal.addEventListener('pointerup', cancelPeek, { passive: true });
  portal.addEventListener('pointercancel', cancelPeek, { passive: true });
  portal.addEventListener('pointerleave', cancelPeek, { passive: true });

  // La única forma de abrir el sitio es pulsar el botón de entrada.
  // No capturamos wheel, swipe/touchmove ni flechas del teclado.
  // Las imágenes públicas podrían bloquear hotlinks: la demostración tiene sustitutos locales.
  portal.querySelectorAll('img[data-fallback]').forEach(img => {
    img.addEventListener('error', () => {
      if (img.dataset.fallbackUsed) return;
      img.dataset.fallbackUsed = 'true';
      img.src = img.dataset.fallback;
    });
  });
  // Portada sin sonido: pausa video de textura cuando usuario solicita movimiento reducido.
  const ambient = portal.querySelector('.portal-video-texture');
  if (reduced || navigator.connection?.saveData) ambient?.pause();
})();
