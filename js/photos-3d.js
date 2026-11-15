/* Fotografías 3D (sin depender de WebGL) — movimiento con cursor, desplazamiento y respiración. */
(() => {
  'use strict';
  const stage = document.querySelector('.hero-photo-stage');
  if (!stage) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer: fine)').matches;
  const frames = [...stage.querySelectorAll('[data-photo-depth]')];
  let targetX = 0, targetY = 0, smoothX = 0, smoothY = 0, frameId;
  let visible = true;
  const observer = new IntersectionObserver(entries => { visible = entries[0]?.isIntersecting ?? true; });
  observer.observe(stage);
  function move(e) {
    if (!fine || reduced) return;
    targetX = (e.clientX / innerWidth - 0.5) * 2;
    targetY = (e.clientY / innerHeight - 0.5) * 2;
  }
  window.addEventListener('pointermove', move, {passive:true});
  function animate() {
    if (!reduced && visible && !document.hidden) {
      smoothX += (targetX - smoothX) * .065;
      smoothY += (targetY - smoothY) * .065;
      const scroll = Math.max(0, Math.min(1, window.scrollY / Math.max(innerHeight, 1)));
      frames.forEach(el => {
        const d = +el.dataset.photoDepth || 1;
        el.style.setProperty('--drift-x', `${(smoothX * 15 * d).toFixed(2)}px`);
        el.style.setProperty('--drift-y', `${(smoothY * 11 * d + scroll * (-38 * d)).toFixed(2)}px`);
        el.style.setProperty('--turn-x', `${(-smoothY * 3.6 * d).toFixed(2)}deg`);
        el.style.setProperty('--turn-y', `${(smoothX * 4.4 * d).toFixed(2)}deg`);
      });
    }
    frameId = requestAnimationFrame(animate);
  }
  if (!reduced) animate();
  window.addEventListener('pagehide', () => { cancelAnimationFrame(frameId); observer.disconnect(); }, {once:true});
})();
