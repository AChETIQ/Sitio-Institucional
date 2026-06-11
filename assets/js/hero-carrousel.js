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

  /* Orden cronológico EXACTO — derivados WebP 1920px generados a
     partir de los originales de assets/img/hero/ (S6 — rendimiento:
     los JPG originales, 0,5–3,7 MB c/u, quedan fuera del peso de
     página). El primer cuadro está precargado desde el <head> de
     index.html con fetchpriority="high" (es el elemento LCP): si se
     cambia aquí, actualizar también ese <link rel="preload">. */
  var HERO_IMAGES = [
    '2014-1920.webp',
    '2015-2-1920.webp',
    '2018-1920.webp',
    '2020-1920.webp',
    '2024-1920.webp'
  ];

  var HOLD_MS = 5000;   /* tiempo visible por imagen */

  var stage = document.querySelector('[data-hero-slideshow]');
  if (!stage || HERO_IMAGES.length === 0) return;

  function setBackground(slide, file) {
    slide.style.backgroundImage = "url('" + HERO_BASE + file + "')";
  }

  /* Construir las capas en orden e inyectarlas en el contenedor.
     Carga programada (S6): sólo el primer cuadro (visible, LCP)
     recibe su background-image de inmediato. Los demás se cargan
     UNO POR DELANTE de la rotación (ver prefetchNext): el cuadro
     i+1 se pide al mostrarse el cuadro i, con HOLD_MS (5 s) de
     margen de descarga. Así el primer render no compite por ancho
     de banda y solo se descarga lo que se llega a ver. */
  var slides = HERO_IMAGES.map(function (file, i) {
    var slide = document.createElement('div');
    slide.className = 'hero__slide';
    if (i === 0) {
      setBackground(slide, file);
      slide.classList.add('hero__slide--active');
    }
    stage.appendChild(slide);
    return slide;
  });

  /* Con una sola imagen no hay nada que rotar. */
  if (slides.length < 2) return;

  /* Movimiento reducido: imagen fija, sin temporizador. Salir antes
     de programar la carga diferida también evita descargar cuadros
     que nunca se mostrarían. */
  var prefersReduced = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  /* Asigna el background del cuadro i si aún no lo tiene (la
     asignación dispara la descarga). Idempotente. */
  function prefetchSlide(i) {
    if (slides[i] && !slides[i].style.backgroundImage) {
      setBackground(slides[i], HERO_IMAGES[i]);
    }
  }

  /* El siguiente cuadro de la rotación se pide con un ciclo entero
     de anticipación. El primero (cuadro 2) espera a window.load
     para no competir con los recursos críticos del primer render. */
  function prefetchNext() {
    prefetchSlide((current + 1) % slides.length);
  }

  if (document.readyState === 'complete') {
    prefetchNext();
  } else {
    window.addEventListener('load', prefetchNext, { once: true });
  }

  var current = 0;
  var timer = null;

  function show(next) {
    slides[current].classList.remove('hero__slide--active');
    slides[next].classList.add('hero__slide--active');
    current = next;
    prefetchNext();
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
