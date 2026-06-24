/* ============================================================
   AChETIQ — Motor de carga dinámica: arranque global (main.js)
   ------------------------------------------------------------
   Versión: 1.0 · Fase 3 — P3.6

   Punto de entrada del JavaScript del sitio (módulo ES, sin
   transpilación). Se carga al final del <body> del boilerplate
   como <script type="module" src="./assets/js/main.js"> (ajustar
   el prefijo relativo según la profundidad de la página).

   Responsabilidades:
     1. En DOMContentLoaded, recorrer todos los [data-loader].
     2. Para cada uno, derivar el nombre del recurso y obtener el
        renderizador registrado en loaders.js. Loaders especiales
        (navbar, footer) se omiten: sus scripts dedicados los
        gestionan antes de que el motor se ejecute.
     3. Mostrar un loader inline (P3.3) mientras está el fetch.
     4. Al resolver: vaciar el placeholder y delegar al renderer
        del catálogo. Si la respuesta es un array vacío, mostrar
        el componente empty-state (FASE_1 §8.1). Si el fetch o el
        renderer fallan, mostrar un mensaje accesible y loguear el
        detalle en consola, sin romper el resto de la página.

   Sin dependencias externas. Idempotente: si por algún motivo el
   módulo se evalúa más de una vez (importación cruzada, hot
   reload, tests), init() sólo escanea una vez.

   PUNTOS DE EXTENSIÓN
     - Para que una página registre su propio renderer, ver el
       comentario de encabezado de loaders.js, sección «CÓMO
       REGISTRAR UN LOADER NUEVO DESDE UNA PÁGINA».
     - Si una página quiere disparar el motor manualmente (p. ej.
       tras inyectar HTML dinámico que contiene nuevos
       [data-loader]), puede importar y llamar processNode() para
       un nodo específico, o run() para volver a escanear el DOM.
   ============================================================ */

'use strict';

import {
  getLoader,
  hasLoader,
  isSpecialLoader,
  getSkeleton,
  hasSkeleton,
  renderInlineLoader,
  renderEmpty,
  renderError
} from './loaders.js';

const BASE = window.AChETIQBase || {
  root: '/',
  resolve: (p) => '/' + String(p).replace(/^(\.?\/)+/, '')
};
const DATA_BASE = BASE.root + 'data/';

/* Acotamos los nombres a kebab-case ASCII para evitar pedir URLs
   construidas con datos no validados (defensa en profundidad,
   aunque el nombre proviene de markup propio). */
const NAME_RE = /^[a-z][a-z0-9-]*$/;

let started = false;

/* ── DEV PREVIEW (QA/UI) · TEMPORARY ────────────────────────────
   El dev panel enlaza las páginas con ?preview=loading para auditar
   la pantalla de carga (esqueletos). En ese modo el motor pinta el
   estado de carga de cada región y NO dispara el fetch: las
   siluetas quedan congeladas, sin que lleguen las fotos ni el texto
   reales. Eliminar junto con el dev panel cuando termine el testing. */
const PREVIEW_LOADING = (function () {
  try {
    return new URLSearchParams(window.location.search).get('preview') === 'loading';
  } catch (_) {
    return false;
  }
})();

/* Pinta el estado de carga de una región: esqueleto registrado si
   existe, o el loader inline «Bouncing Dots» como fallback. */
function renderLoading(node, name) {
  if (hasSkeleton(name)) {
    getSkeleton(name)(node);
  } else {
    renderInlineLoader(node, 'Cargando…');
  }
}


/* ─── API pública del motor ────────────────────────────────── */

/* Escanea el documento y procesa cada [data-loader] pendiente.
   Idempotente: la segunda llamada es no-op. */
export function run() {
  if (started) return;
  started = true;
  const nodes = document.querySelectorAll('[data-loader]');
  nodes.forEach(processNode);
}

/* Procesa un nodo individual. Útil para markup inyectado después
   del arranque (no recorre el DOM completo). */
export function processNode(node) {
  if (!(node instanceof Element)) return;

  /* Si el nodo ya fue procesado, no repetir el ciclo (evita
     re-fetch al re-escanear). El estado «loading» también cuenta:
     significa que hay un fetch en vuelo. */
  if (node.hasAttribute('data-loader-state')) return;

  const name = (node.getAttribute('data-loader') || '').trim();
  if (!name) return;

  /* navbar y footer tienen sus propios scripts (navbar.js,
     footer.js) que cargan partial + JSON y reemplazan el
     placeholder. El motor los ignora. */
  if (isSpecialLoader(name)) return;

  if (!NAME_RE.test(name)) {
    console.error('[AChETIQ loaders] Nombre de loader inválido:', name, node);
    renderError(node, { message: 'No se pudo cargar este bloque.' });
    return;
  }

  if (!hasLoader(name)) {
    console.error(
      '[AChETIQ loaders] No hay renderizador registrado para "' + name +
      '". Importá registerLoader desde assets/js/loaders.js en un módulo' +
      ' anterior a main.js y registralo.', node
    );
    renderError(node, { message: 'No se pudo cargar este bloque.' });
    return;
  }

  renderLoading(node, name);

  /* Modo preview (QA/UI): congelamos la pantalla de carga sin pedir
     los datos. La región queda en estado «loading» indefinidamente. */
  if (PREVIEW_LOADING) return;

  const url = DATA_BASE + name + '.json';
  fetch(url, { credentials: 'same-origin' })
    .then((res) => {
      if (!res.ok) {
        throw new Error('HTTP ' + res.status + ' al solicitar ' + res.url);
      }
      return res.json();
    })
    .then((data) => applyRender(node, name, data))
    .catch((err) => {
      console.error('[AChETIQ loaders] Falló la carga de "' + name + '":', err);
      renderError(node, {
        message: 'No se pudo cargar este bloque. Probá recargar la página.'
      });
    });
}


/* ─── Aplicación del renderer ──────────────────────────────── */

function applyRender(node, name, data) {
  /* Política de anuncios (S4): la llegada del contenido real NO se
     anuncia — replaceChildren() retira el loader (región viva) y el
     contenido entra sin aria-live, evitando que un lector de
     pantalla reciba el render completo como ráfaga. Solo los
     estados terminales excepcionales hablan: empty (role=status,
     polite) y error (role=alert). */

  /* Empty-state: array sin elementos, objeto sin claves, o nulo. */
  if (isEmpty(data)) {
    renderEmpty(node);
    return;
  }

  /* Aislamos al renderer del motor: cualquier excepción en su
     interior se traduce a estado de error, sin propagarse al
     resto de los [data-loader] que se procesan en paralelo. */
  try {
    node.replaceChildren();
    node.removeAttribute('data-loader-state');
    const renderer = getLoader(name);
    renderer(node, data);
    node.setAttribute('data-loader-state', 'ready');
  } catch (err) {
    console.error(
      '[AChETIQ loaders] El renderer de "' + name + '" lanzó una excepción:', err
    );
    renderError(node, {
      message: 'Hubo un problema al mostrar este bloque.'
    });
  }
}

function isEmpty(data) {
  if (data == null) return true;
  if (Array.isArray(data)) return data.length === 0;
  if (typeof data === 'object') return Object.keys(data).length === 0;
  return false;
}


/* ─── Arranque ─────────────────────────────────────────────── */

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', run, { once: true });
} else {
  run();
}
