/* ============================================================
   AChETIQ — Motor de carga dinámica: arranque global (main.js)
   ------------------------------------------------------------
   Versión: 1.0 · Fase 3 — P3.6

   Punto de entrada del JavaScript del sitio (módulo ES, sin
   transpilación). Se carga al final del <body> del boilerplate
   como <script type="module" src="/assets/js/main.js">.

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
  renderInlineLoader,
  renderEmpty,
  renderError
} from './loaders.js';

const DATA_BASE = '/data/';

/* Acotamos los nombres a kebab-case ASCII para evitar pedir URLs
   construidas con datos no validados (defensa en profundidad,
   aunque el nombre proviene de markup propio). */
const NAME_RE = /^[a-z][a-z0-9-]*$/;

let started = false;


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
      '". Importá registerLoader desde /assets/js/loaders.js en un módulo' +
      ' anterior a main.js y registralo.', node
    );
    renderError(node, { message: 'No se pudo cargar este bloque.' });
    return;
  }

  renderInlineLoader(node, 'Cargando…');

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
