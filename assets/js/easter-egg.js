/* ============================================================
   AChETIQ — Easter egg de agradecimientos (easter-egg.js)
   ------------------------------------------------------------
   Detalle de marca EXCLUSIVO del Inicio (index.html). Un disco con
   el logo flota abajo a la izquierda, acompaña el scroll como la
   navbar y se FRENA justo antes del footer. Al activarlo, difumina
   la pantalla y abre un <dialog> centrado con los agradecimientos.

   Responsabilidades:
     - Construir el disparador (botón + logo) y el <dialog> nativo,
       e inyectarlos al final de <body>.
     - Seguir el scroll con position:fixed y un transform throttleado
       por requestAnimationFrame que evita que el disco invada el
       footer (sólo transform; nunca propiedades de layout).
     - Poblar el contenido desde data/agradecimientos.json (fetch
       perezoso, con fallback inline si falla).
     - Abrir con showModal() (trampa de foco, fondo inerte y Esc
       gratis) y cerrar con el botón, Esc o click en el backdrop,
       devolviendo el foco al disparador.

   Sin dependencias externas. Mismo patrón que assets/js/footer.js.
   Mejora progresiva: sin JS no aparece nada (el easter egg es un
   extra, no navegación esencial). Auto-inicia en DOMContentLoaded.
   ============================================================ */

(function () {
  'use strict';

  /* Una sola instancia: si el script se evalúa dos veces, no duplica. */
  if (window.__achetiqEgg) return;
  window.__achetiqEgg = true;

  var BASE = window.AChETIQBase || {
    resolve: function (p) { return '/' + String(p).replace(/^(\.?\/)+/, ''); }
  };
  var URL_LOGO = BASE.resolve('assets/img/logo/achetiq-logo.svg');
  var URL_DATA = BASE.resolve('data/agradecimientos.json');

  /* Selector del footer (root real o fallback estático). Lo inyecta
     footer.js de forma asíncrona, así que se busca con pereza. */
  var FOOTER_SEL = '[data-footer-root], .footer, .footer-fallback';
  /* Holgura mínima entre el borde inferior del disco y el footer. */
  var FOOTER_GAP = 16;

  /* Texto de respaldo si el fetch del JSON falla: el easter egg
     sigue funcionando, sin romper la página. */
  var FALLBACK = {
    titulo: 'Gracias',
    parrafos: [
      'Este sitio existe gracias al trabajo de muchas personas que, ' +
      'generación tras generación, sostienen la asociación.'
    ],
    creditos: null,
    eyebrow: null
  };


  /* ─── Helper DOM (mismo que navbar.js / footer.js) ───────── */

  function el(tag, cls, text, attrs) {
    var n = document.createElement(tag);
    if (cls)  n.className = cls;
    if (text != null) n.textContent = String(text);
    if (attrs) for (var k in attrs) {
      if (Object.prototype.hasOwnProperty.call(attrs, k)) {
        n.setAttribute(k, String(attrs[k]));
      }
    }
    return n;
  }


  /* ─── Construcción del markup ────────────────────────────── */

  var trigger, dialog, body, titleEl, eyebrowEl, creditsEl;
  var contentLoaded = false;

  function build() {
    /* Disparador: botón con el logo. El <img> es decorativo
       (alt=""); la etiqueta accesible la lleva el botón. */
    trigger = el('button', 'egg-trigger', null, {
      type: 'button',
      'aria-haspopup': 'dialog',
      'aria-label': 'Ver agradecimientos'
    });
    var logo = el('img', 'egg-trigger__logo', null, {
      src: URL_LOGO, alt: '', width: '28', height: '28', 'aria-hidden': 'true'
    });
    trigger.appendChild(logo);

    /* Diálogo nativo: showModal() aporta trampa de foco, fondo
       inerte y cierre con Esc sin código adicional. */
    dialog = el('dialog', 'egg-dialog', null, {
      'aria-labelledby': 'egg-dialog-title'
    });
    var panel = el('div', 'egg-dialog__panel');

    var close = el('button', 'egg-dialog__close', null, {
      type: 'button', 'aria-label': 'Cerrar'
    });
    close.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"' +
      ' stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"' +
      ' aria-hidden="true" focusable="false"><path d="M18 6 6 18"/>' +
      '<path d="m6 6 12 12"/></svg>';

    eyebrowEl = el('p', 'egg-dialog__eyebrow');
    eyebrowEl.hidden = true;
    titleEl = el('h2', 'egg-dialog__title', null, { id: 'egg-dialog-title' });
    body = el('div', 'egg-dialog__body');
    creditsEl = el('p', 'egg-dialog__credits');
    creditsEl.hidden = true;

    panel.appendChild(close);
    panel.appendChild(eyebrowEl);
    panel.appendChild(titleEl);
    panel.appendChild(body);
    panel.appendChild(creditsEl);
    dialog.appendChild(panel);

    document.body.appendChild(trigger);
    document.body.appendChild(dialog);

    trigger.addEventListener('click', openDialog);
    close.addEventListener('click', closeDialog);
    /* Click en el backdrop (fuera del panel) cierra. El target es el
       propio <dialog> sólo cuando se clickea su zona de fondo. */
    dialog.addEventListener('click', function (ev) {
      if (ev.target === dialog) closeDialog();
    });
    /* Tras el cierre nativo (Esc incluido) devolvemos el foco al
       disparador, por si el navegador no lo restituye. */
    dialog.addEventListener('close', function () {
      if (trigger && document.contains(trigger)) trigger.focus();
    });
  }


  /* ─── Contenido (fetch perezoso + render) ────────────────── */

  function render(data) {
    var d = data && typeof data === 'object' ? data : FALLBACK;

    if (d.eyebrow) {
      eyebrowEl.textContent = d.eyebrow;
      eyebrowEl.hidden = false;
    } else {
      eyebrowEl.hidden = true;
    }

    titleEl.textContent = d.titulo || FALLBACK.titulo;

    body.replaceChildren();
    var parrafos = Array.isArray(d.parrafos) && d.parrafos.length
      ? d.parrafos : FALLBACK.parrafos;
    parrafos.forEach(function (p) {
      body.appendChild(el('p', 'egg-dialog__text', p));
    });

    if (d.creditos) {
      creditsEl.textContent = d.creditos;
      creditsEl.hidden = false;
    } else {
      creditsEl.hidden = true;
    }
  }

  /* Carga el JSON una sola vez. Devuelve una promesa que siempre
     resuelve (con fallback ante error), para no bloquear la apertura. */
  function ensureContent() {
    if (contentLoaded) return Promise.resolve();
    contentLoaded = true;
    return fetch(URL_DATA, { credentials: 'same-origin' })
      .then(function (res) {
        if (!res.ok) throw new Error('agradecimientos: ' + res.status);
        return res.json();
      })
      .then(function (data) { render(data); })
      .catch(function (err) {
        if (window.console && console.error) {
          console.error('[AChETIQ easter-egg]', err);
        }
        render(FALLBACK);
      });
  }


  /* ─── Apertura / cierre ──────────────────────────────────── */

  function openDialog() {
    ensureContent().then(function () {
      if (typeof dialog.showModal === 'function') dialog.showModal();
      else dialog.setAttribute('open', '');
    });
  }

  function closeDialog() {
    if (typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
  }


  /* ─── Seguimiento del scroll (freno antes del footer) ────── */

  var currentShift = 0;
  var ticking = false;
  var footerEl = null;

  function getFooter() {
    if (footerEl && document.contains(footerEl)) return footerEl;
    footerEl = document.querySelector(FOOTER_SEL);
    return footerEl;
  }

  /* Calcula cuánto subir el disco para no pisar el footer, usando
     sólo medidas de getBoundingClientRect y el shift previo (no lee
     el `bottom` resuelto, así el clamp() del CSS no importa). */
  function update() {
    ticking = false;
    if (!trigger) return;

    var triggerBottom = trigger.getBoundingClientRect().bottom;
    /* Posición del borde inferior SIN desplazamiento. */
    var stableBottom = triggerBottom + currentShift;

    var footer = getFooter();
    var footerTop = footer
      ? footer.getBoundingClientRect().top
      : Number.POSITIVE_INFINITY;

    var shift = Math.max(0, stableBottom - footerTop + FOOTER_GAP);
    if (shift !== currentShift) {
      currentShift = shift;
      trigger.style.setProperty('--egg-shift', shift + 'px');
    }
  }

  function onScrollOrResize() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  }


  /* ─── Init ──────────────────────────────────────────────── */

  function init() {
    build();
    /* Prefetch ocioso: el contenido queda listo antes del primer
       click, sin competir con la carga crítica. */
    var idle = window.requestIdleCallback ||
      function (fn) { return window.setTimeout(fn, 1200); };
    idle(function () { ensureContent(); });

    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);
    /* El footer se inyecta async; recalculamos al cargar todo y en
       el próximo frame por si llega después del DOMContentLoaded. */
    window.addEventListener('load', onScrollOrResize);
    window.requestAnimationFrame(update);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
