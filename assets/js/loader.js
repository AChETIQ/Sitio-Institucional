/* ============================================================
   AChETIQ — Loader global: control del overlay (loader.js)
   ------------------------------------------------------------
   Versión: 1.0 · Fase 2 — Desarrollo front-end

   Helper mínimo y sin dependencias para mostrar/ocultar el
   overlay de carga global. La animación de los puntos es 100 %
   CSS (loader.css): este archivo NO anima nada — solo alterna la
   visibilidad del overlay y el bloqueo de scroll del documento.

   Uso:
     AChETIQLoader.show();   // muestra el overlay y bloquea scroll
     AChETIQLoader.hide();   // oculta el overlay y restaura scroll

   Requiere en el documento un overlay con id="global-loader"
   (ver markup canónico del overlay).
   ============================================================ */

(function () {
  'use strict';

  var OVERLAY_ID = 'global-loader';
  var SCROLL_LOCK_CLASS = 'loader-scroll-lock';

  function getOverlay() {
    return document.getElementById(OVERLAY_ID);
  }

  function show() {
    var overlay = getOverlay();
    if (!overlay) return;
    overlay.hidden = false;
    document.body.classList.add(SCROLL_LOCK_CLASS);
  }

  function hide() {
    var overlay = getOverlay();
    if (!overlay) return;
    overlay.hidden = true;
    document.body.classList.remove(SCROLL_LOCK_CLASS);
  }

  /* API pública — punto de enganche para la lógica de carga real. */
  window.AChETIQLoader = {
    show: show,
    hide: hide
  };
})();
