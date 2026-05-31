/* AChETIQ — Revelado de imagen por scroll (scroll-reveal.js)
   ------------------------------------------------------------
   Primitiva reutilizable: revela cualquier [data-scroll-reveal]
   de IZQUIERDA A DERECHA retrayendo un velo (clip-path inset)
   acompañado de un fundido de opacidad, ligado al progreso de
   scroll. Es la adaptación a vanilla JS de la técnica que en
   React se resolvería con framer-motion (useScroll + useTransform);
   el sitio no usa frameworks (stack estático, cero dependencias).

   · Vanilla JS, sin dependencias — coherente con hero-carrousel.js.
   · Progreso equivalente al offset ["start end", "center start"]
     de useScroll: 0 cuando el borde superior del elemento toca el
     fondo del viewport; 1 cuando su centro alcanza el tope. El
     revelado se completa en progress 0.5 (clip-path y opacity
     mapeados sobre [0, 0.5]) → la imagen termina de revelarse
     temprano, apenas la sección entra cómodamente en cuadro.
   · Respeta prefers-reduced-motion: NO arma el efecto; la imagen
     queda estática y completamente visible (estado por defecto
     del CSS). Mismo criterio que hero-carrousel.js.
   · requestAnimationFrame para no recalcular en cada evento de
     scroll.

   Mejora progresiva: el estado por defecto en CSS es REVELADO
   (sin clip, opacidad 1). Este script añade la clase
   .scroll-reveal--armed (estado inicial oculto, definida en
   assets/css/sobre-asociacion.css) SÓLO cuando va a animar, y a
   partir de ahí escribe clip-path/opacity inline. Así, sin JS, si
   el script falla, o bajo movimiento reducido, la imagen siempre
   se ve completa (nunca queda oculta). Como la sección vive bajo
   el hero (fuera del viewport al cargar), no hay parpadeo inicial.

   Marcado esperado (index.html):
     <figure class="about-intro__figure" data-scroll-reveal> … </figure>
   ============================================================ */

(function () {
  'use strict';

  var els = Array.prototype.slice.call(
    document.querySelectorAll('[data-scroll-reveal]')
  );
  if (els.length === 0) return;

  /* Movimiento reducido: no se arma el efecto. El CSS deja la
     imagen revelada y estática por defecto. */
  var prefersReduced = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  /* Progreso (sobre [0,1] del elemento dentro del viewport) en el
     que el revelado se completa. Equivale al tope superior del
     rango [0, REVEAL_END] usado por clip-path y opacity. Cuanto
     más bajo, antes (más arriba en el scroll) termina el revelado. */
  var REVEAL_END = 0.5;

  function clamp01(n) {
    if (n < 0) return 0;
    if (n > 1) return 1;
    return n;
  }

  /* Estado inicial oculto: desde aquí el JS controla clip-path y
     opacidad cuadro a cuadro. */
  els.forEach(function (el) {
    el.classList.add('scroll-reveal--armed');
  });

  var ticking = false;

  function update() {
    ticking = false;
    var vh = window.innerHeight || document.documentElement.clientHeight;

    els.forEach(function (el) {
      var rect = el.getBoundingClientRect();

      /* progress: 0 cuando el tope del elemento está en el fondo
         del viewport (rect.top === vh); 1 cuando su centro llega
         al tope (rect.top === -rect.height / 2). */
      var denom = vh + rect.height / 2;
      var progress = denom > 0 ? clamp01((vh - rect.top) / denom) : 1;

      /* clip-path y opacity mapeados sobre [0, REVEAL_END]. */
      var reveal = clamp01(progress / REVEAL_END);
      var clipValue = 'inset(0 ' + (1 - reveal) * 100 + '% 0 0)';

      el.style.clipPath = clipValue;
      el.style.webkitClipPath = clipValue;   /* WebKit antiguo */
      el.style.opacity = String(reveal);
    });
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(update);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });

  /* Estado inicial acorde a la posición de scroll con la que se
     entró a la página. */
  update();
})();
