/* AChETIQ — Slideshow de fondo del hero (hero-carrousel.js)
   ------------------------------------------------------------
   Cross-fade (desvanecido) entre fotografías institucionales a
   pantalla completa sobre el bloque .hero de index.html.

   · Vanilla JS, sin dependencias — coherente con el stack del sitio.
   · Orden cronológico EXACTO definido en HERO_IMAGES.
   · 5 s visible por imagen; cross-fade de --transition-hero (~1 s,
     definido en CSS sobre .hero__slide).
   · Loop infinito: tras 2024.JPG vuelve a 2014.JPG.
   · Respeta prefers-reduced-motion: muestra sólo la primera imagen.
   · Pausa cuando la pestaña no está visible.

   BEM: contenedor [data-hero-slideshow] (.hero__slideshow);
        cada capa .hero__slide; activa .hero__slide--active.
   ============================================================ */

(function () {
  'use strict';

  /* Directorio de imágenes, relativo a index.html. */
  var HERO_BASE = 'assets/img/hero/';

  /* Orden cronológico EXACTO — extensiones .JPG en mayúsculas. */
  var HERO_IMAGES = [
    '2014.JPG',
    '2015-1.JPG',
    '2015-2.JPG',
    '2018.JPG',
    '2024.JPG'
  ];

  var HOLD_MS = 5000;   /* tiempo visible por imagen */

  var stage = document.querySelector('[data-hero-slideshow]');
  if (!stage || HERO_IMAGES.length === 0) return;

  /* Construir las capas en orden e inyectarlas en el contenedor. */
  var slides = HERO_IMAGES.map(function (file, i) {
    var slide = document.createElement('div');
    slide.className = 'hero__slide';
    slide.style.backgroundImage = "url('" + HERO_BASE + file + "')";
    if (i === 0) slide.classList.add('hero__slide--active');
    stage.appendChild(slide);
    return slide;
  });

  /* Con una sola imagen no hay nada que rotar. */
  if (slides.length < 2) return;

  /* Movimiento reducido: imagen fija, sin temporizador. */
  var prefersReduced = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  var current = 0;
  var timer = null;

  function show(next) {
    slides[current].classList.remove('hero__slide--active');
    slides[next].classList.add('hero__slide--active');
    current = next;
  }

  function advance() {
    show((current + 1) % slides.length);   /* loop infinito */
  }

  function start() {
    if (!timer) timer = window.setInterval(advance, HOLD_MS);
  }

  function stop() {
    if (timer) { window.clearInterval(timer); timer = null; }
  }

  /* Pausar/reanudar según visibilidad de la pestaña. */
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stop();
    else start();
  });

  start();
})();
