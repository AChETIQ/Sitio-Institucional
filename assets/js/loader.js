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

   Además expone window.AChETIQBase con la URL raíz del sitio
   calculada en tiempo de ejecución a partir de la ubicación de
   este propio script. Esto hace que todo el JS sea independiente
   del host (raíz de dominio, subpath de GitHub Pages, file://).
   ============================================================ */

(function () {
  'use strict';

  /* Calcula la URL base del sitio a partir del src absoluto de
     este script (.../assets/js/loader.js[?ver][#hash]). Se ejecuta
     una sola vez al cargar el archivo. Fallback a '/' si el src
     no se puede leer (ej. inlining manual). */
  function computeRoot() {
    var src = (document.currentScript && document.currentScript.src) || '';
    var m = src.match(/^(.*\/)assets\/js\/[^/]+(?:[?#].*)?$/);
    return m ? m[1] : '/';
  }

  var ROOT = computeRoot();

  /* Devuelve true si val es una URL que NO debe reescribirse:
     esquema absoluto (http:, https:, mailto:, tel:, data:…),
     protocolo-relativa (//host) o fragmento (#anchor).
     Una ruta tipo "/foo" o "./foo" SÍ se reescribe, porque la
     convención del proyecto es expresar todo lo interno relativo
     a la raíz del sitio. Para apuntar a un recurso externo
     usar siempre un URL absoluto con esquema. */
  function isExternal(val) {
    if (!val) return true;
    if (/^[a-z][a-z0-9+.\-]*:/i.test(val)) return true;
    if (val.indexOf('//') === 0) return true;
    if (val.charAt(0) === '#') return true;
    return false;
  }

  /* Une ROOT con una ruta del proyecto. Pasa sin tocar cualquier
     URL externa (isExternal). Para las internas, normaliza los
     prefijos "/" y "./" y antepone ROOT. Idempotente: aplicada
     dos veces sobre el mismo valor devuelve el mismo resultado
     (la salida ya queda como URL absoluta con esquema). */
  function resolve(path) {
    var p = String(path == null ? '' : path);
    if (isExternal(p)) return p;
    return ROOT + p.replace(/^(\.?\/)+/, '');
  }

  /* Recorre un nodo (Element o DocumentFragment) y reescribe los
     atributos href y src cuyo valor sea relativo, anteponiendo
     ROOT. Pensado para los partials inyectados por fetch (navbar,
     footer): al hacer el rewrite ANTES de insertarlos en el DOM
     anfitrión, sus URLs quedan ancladas a la raíz del sitio en
     vez de resolverse contra la URL de la página actual. */
  function rewriteTree(node) {
    if (!node || !node.querySelectorAll) return;
    var candidates = Array.prototype.slice.call(
      node.querySelectorAll('[href], [src]')
    );
    if (node.hasAttribute &&
        (node.hasAttribute('href') || node.hasAttribute('src'))) {
      candidates.unshift(node);
    }
    for (var i = 0; i < candidates.length; i++) {
      var n = candidates[i];
      var attr = n.hasAttribute('href') ? 'href' : 'src';
      var val = n.getAttribute(attr);
      var next = resolve(val);
      if (next !== val) n.setAttribute(attr, next);
    }
  }

  window.AChETIQBase = {
    root: ROOT,
    resolve: resolve,
    rewriteTree: rewriteTree
  };
})();


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
