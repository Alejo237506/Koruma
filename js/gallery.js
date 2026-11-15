/* Carrusel de tarjetas con perspectiva 3D. Compatible con ratón, táctil y teclado. */
(() => {
  const stage = document.querySelector('#gallery-stage');
  if (!stage) return;
  const cards = Array.from(stage.querySelectorAll('.gallery-card'));
  const count = document.querySelector('#current-slide');
  const previous = document.querySelector('#gallery-prev');
  const next = document.querySelector('#gallery-next');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let active = 0;
  let downX = null;

  function render() {
    const compact = window.innerWidth <= 600;
    const offset = compact ? 156 : 290;
    cards.forEach((card, i) => {
      let delta = i - active;
      if (delta > cards.length / 2) delta -= cards.length;
      if (delta < -cards.length / 2) delta += cards.length;
      const distance = Math.abs(delta);
      const isActive = delta === 0;
      card.style.transform = `translate(-50%, -50%) translateX(${delta * offset}px) translateZ(${-distance * (compact ? 125 : 180)}px) rotateY(${-delta * 25}deg) scale(${isActive ? 1 : .83})`;
      card.style.opacity = distance > 2 ? '0' : (isActive ? '1' : '.66');
      card.style.zIndex = String(10 - distance);
      card.style.filter = `brightness(${isActive ? 1 : .57})`;
      card.style.transitionDuration = reduceMotion ? '0s' : '';
      card.classList.toggle('active', isActive);
      card.setAttribute('aria-hidden', String(!isActive));
    });
    count.textContent = String(active + 1).padStart(2,'0');
  }
  function move(step) { active = (active + step + cards.length) % cards.length; render(); }
  next?.addEventListener('click', () => move(1));
  previous?.addEventListener('click', () => move(-1));
  stage.addEventListener('pointerdown', e => { downX = e.clientX; });
  stage.addEventListener('pointerup', e => {
    if (downX === null) return;
    const diff = e.clientX - downX;
    if (Math.abs(diff) > 35) move(diff > 0 ? -1 : 1);
    downX = null;
  });
  stage.addEventListener('pointercancel', () => { downX = null; });
  stage.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') { e.preventDefault(); move(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); move(-1); }
  });
  cards.forEach((card, i) => card.addEventListener('click', () => {
    const diff = i - active; if (diff !== 0) move(diff > 0 ? 1 : -1);
  }));
  window.addEventListener('resize', render, { passive:true });
  render();
})();
