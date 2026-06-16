/* ============================================================
   AChETIQ — Página «Sobre AChETIQ»: identidad institucional
   ------------------------------------------------------------
   Versión: 1.0 · Fase 3

   Renderiza dinámicamente los bloques de Misión/Visión [5] y
   Valores institucionales [6] de pages/sobre-achetiq.html a partir
   de data/site_copy.json, que actúa como ÚNICA fuente de verdad
   del contenido institucional aprobado por la comisión directiva.

   ¿Por qué un módulo dedicado y no el motor genérico de
   [data-loader] (assets/js/main.js)? Aquel deriva la URL del
   recurso como data/<nombre>.json con <nombre> en kebab-case y
   asocia un contenedor a un único JSON. Aquí, en cambio, dos
   secciones distintas se nutren de un mismo archivo cuyo nombre
   lleva guion bajo (site_copy.json), de modo que el patrón
   genérico no aplica. Se reutilizan, eso sí, los helpers y estados
   visuales de loaders.js (createElement, renderInlineLoader,
   renderEmpty, renderError) para no duplicar lógica ni el modelo
   de seguridad.

   CONTENEDORES OBJETIVO (atributo data-copy, NO data-loader, para
   que el motor genérico de main.js no los procese):
     · [data-copy="mision-vision"]  → sección .mission-vision
     · [data-copy="valores"]        → grid .grid-cards--3

   SEGURIDAD (FASE_1 §7.2): nada de innerHTML con datos del JSON.
   El texto entra por textContent (createElement) y los SVG se
   arman con createElementNS + setAttribute sobre un catálogo fijo
   de íconos definido aquí: la geometría NO proviene del JSON, que
   sólo referencia cada ícono por nombre (campo `icono`).

   Sin dependencias externas. ES module nativo, sin transpilación.
   ============================================================ */

'use strict';

import {
  createElement,
  markEnter,
  renderInlineLoader,
  renderEmpty,
  renderError
} from './loaders.js';

/* Fallback alineado con main.js por si el script clásico loader.js
   no hubiera expuesto window.AChETIQBase (ej. inlining manual). */
const BASE = window.AChETIQBase || {
  resolve: (p) => '/' + String(p).replace(/^(\.?\/)+/, '')
};

const DATA_URL = BASE.resolve('data/site_copy.json');

const SVG_NS = 'http://www.w3.org/2000/svg';


/* ─────────────────────────────────────────────────────────────
   Catálogo de íconos Lucide
   ─────────────────────────────────────────────────────────────
   Cada ícono es una lista de [tag, atributos] que se materializa
   como hijos de un <svg> 24×24 con trazo de 1.5 (convención del
   set Lucide ya presente en el resto del sitio). Las rutas son
   estáticas y viven aquí, no en el JSON: el contenido sólo elige
   el ícono por nombre.
   ───────────────────────────────────────────────────────────── */

const ICONS = {
  /* Misión */
  'target': [
    ['circle', { cx: 12, cy: 12, r: 10 }],
    ['circle', { cx: 12, cy: 12, r: 6 }],
    ['circle', { cx: 12, cy: 12, r: 2 }]
  ],
  /* Visión */
  'telescope': [
    ['path', { d: 'm10.065 12.493-6.18 1.318a.934.934 0 0 1-1.108-.702l-.537-2.15a1.07 1.07 0 0 1 .691-1.265l13.504-4.44' }],
    ['path', { d: 'm13.56 11.747 4.332-.924' }],
    ['path', { d: 'm16 21-3.105-6.21' }],
    ['path', { d: 'M16.485 5.94a2 2 0 0 1 1.455-2.425l1.09-.272a1 1 0 0 1 1.212.727l1.515 6.06a1 1 0 0 1-.727 1.213l-1.09.272a2 2 0 0 1-2.425-1.455z' }],
    ['path', { d: 'm6.158 8.633 1.114 4.456' }],
    ['path', { d: 'm8 21 3.105-6.21' }],
    ['circle', { cx: 12, cy: 13, r: 2 }]
  ],
  /* Valores */
  'flask-conical': [
    ['path', { d: 'M14 2v6a2 2 0 0 0 .245.96l5.51 10.08A2 2 0 0 1 18 22H6a2 2 0 0 1-1.755-2.96l5.51-10.08A2 2 0 0 0 10 8V2' }],
    ['path', { d: 'M6.453 15h11.094' }],
    ['path', { d: 'M8.5 2h7' }]
  ],
  'arrow-up-right': [
    ['path', { d: 'M7 7h10v10' }],
    ['path', { d: 'M7 17 17 7' }]
  ],
  'users-round': [
    ['path', { d: 'M18 21a8 8 0 0 0-16 0' }],
    ['circle', { cx: 10, cy: 8, r: 5 }],
    ['path', { d: 'M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3' }]
  ],
  'link-2': [
    ['path', { d: 'M9 17H7A5 5 0 0 1 7 7h2' }],
    ['path', { d: 'M15 7h2a5 5 0 1 1 0 10h-2' }],
    ['line', { x1: 8, x2: 16, y1: 12, y2: 12 }]
  ],
  'sprout': [
    ['path', { d: 'M7 20h10' }],
    ['path', { d: 'M10 20c5.5-2.5.8-6.4 3-10' }],
    ['path', { d: 'M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z' }],
    ['path', { d: 'M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z' }]
  ],
  'heart-handshake': [
    ['path', { d: 'M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z' }],
    ['path', { d: 'M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08v0c.82.82 2.13.85 3 .07l2.07-1.9a2.82 2.82 0 0 1 3.79 0l2.96 2.66' }],
    ['path', { d: 'm18 15-2-2' }],
    ['path', { d: 'm15 18-2-2' }]
  ]
};

/* Construye un <svg> Lucide a partir del catálogo. Devuelve null
   si el nombre no existe: el bloque se renderiza sin ícono, sin
   romper el resto del contenido. */
function buildIcon(name, className) {
  const defs = ICONS[name];
  if (!defs) return null;

  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '1.5');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  svg.setAttribute('aria-hidden', 'true');
  if (className) svg.setAttribute('class', className);

  defs.forEach(([tag, attrs]) => {
    const el = document.createElementNS(SVG_NS, tag);
    Object.keys(attrs).forEach((k) => el.setAttribute(k, String(attrs[k])));
    svg.appendChild(el);
  });

  return svg;
}


/* ─────────────────────────────────────────────────────────────
   Misión y Visión (catálogo §2.4 .mission-vision)
   ─────────────────────────────────────────────────────────────
   Orden de presentación: Misión y luego Visión, sin jerarquía
   entre sí (FASE_1 §2.4). Cada clave del JSON mapea a su ícono.
   ───────────────────────────────────────────────────────────── */

const MV_ORDER = [
  { key: 'mision', icon: 'target' },
  { key: 'vision', icon: 'telescope' }
];

function buildMvColumn(item, iconName) {
  const col = createElement('article', { class: 'mission-vision__col' });

  /* Jerarquía del PNG objetivo: ícono en placa suave sobre un
     título en Instrument Serif (no el eyebrow mono original). */
  const iconBox = createElement('span', { class: 'mission-vision__icon-box' });
  const icon = buildIcon(iconName, 'mission-vision__icon');
  if (icon) iconBox.appendChild(icon);
  col.appendChild(iconBox);

  col.appendChild(createElement('h3', {
    class: 'mission-vision__title',
    text: item.label || ''
  }));

  col.appendChild(createElement('p', {
    class: 'mission-vision__prose',
    text: item.texto || ''
  }));

  return col;
}

function renderMisionVision(container, data) {
  const cols = MV_ORDER
    .map(({ key, icon }) => ({ item: data && data[key], icon }))
    .filter(({ item }) => item && item.texto);

  if (cols.length === 0) {
    renderEmpty(container);
    return;
  }

  container.replaceChildren();
  container.removeAttribute('data-loader-state');
  cols.forEach(({ item, icon }, i) => container.appendChild(markEnter(buildMvColumn(item, icon), i)));
  container.setAttribute('data-loader-state', 'ready');
}


/* ─────────────────────────────────────────────────────────────
   Valores institucionales (catálogo §4.7 .card--valor)
   ───────────────────────────────────────────────────────────── */

function buildValorCard(v) {
  const card = createElement('article', { class: 'card card--valor' });

  const iconBox = createElement('div', { class: 'card--valor__icon' });
  const icon = buildIcon(v.icono);
  if (icon) iconBox.appendChild(icon);
  card.appendChild(iconBox);

  card.appendChild(createElement('h3', {
    class: 'card--valor__title',
    text: v.nombre || ''
  }));
  card.appendChild(createElement('p', {
    class: 'card--valor__desc',
    text: v.descripcion || ''
  }));

  return card;
}

function renderValores(container, data) {
  const list = Array.isArray(data) ? data.filter(Boolean) : [];

  if (list.length === 0) {
    renderEmpty(container);
    return;
  }

  container.replaceChildren();
  container.removeAttribute('data-loader-state');
  list.forEach((v, i) => container.appendChild(markEnter(buildValorCard(v), i)));
  container.setAttribute('data-loader-state', 'ready');
}


/* ─────────────────────────────────────────────────────────────
   Paneles «Asociación / Galería» enrutados por hash
   ─────────────────────────────────────────────────────────────
   La página no expone un selector propio: la navegación entre los
   dos paneles la provee el desplegable «Sobre AChETIQ» del navbar
   (…#asociacion · …#galeria). El hash de la URL es la ÚNICA fuente
   de verdad: al cargar y en cada `hashchange` se muestra el panel
   que le corresponde y se oculta el otro con el atributo nativo
   [hidden].

   Mapa hash → panel:
     #galeria                       → Galería
     (vacío) · #asociacion · otro    → Asociación (vista por defecto)

   Independiente del fetch de contenido: la Galería es markup
   estático, así que el enrutado funciona aunque falle la red.
   ───────────────────────────────────────────────────────────── */

const PANEL_DEFAULT = 'asociacion';
const PANEL_NAMES = ['asociacion', 'galeria'];

/* Traduce el hash actual a un nombre de panel válido; cae al panel
   por defecto ante un hash vacío o desconocido. */
function panelFromHash() {
  const name = (window.location.hash || '').replace(/^#/, '').toLowerCase();
  return PANEL_NAMES.indexOf(name) !== -1 ? name : PANEL_DEFAULT;
}

function initPanels() {
  const panels = Array.prototype.slice.call(
    document.querySelectorAll('[data-about-panel]')
  );
  if (panels.length === 0) return;

  /* Muestra el panel objetivo y oculta el resto con [hidden]. */
  function activate(name) {
    const target = PANEL_NAMES.indexOf(name) !== -1 ? name : PANEL_DEFAULT;
    panels.forEach((panel) => {
      panel.hidden = panel.getAttribute('data-about-panel') !== target;
    });
  }

  window.addEventListener('hashchange', () => activate(panelFromHash()));

  /* Estado inicial según el hash con el que se entró a la página. */
  activate(panelFromHash());
}


/* ─────────────────────────────────────────────────────────────
   Arranque
   ─────────────────────────────────────────────────────────────
   Un único fetch de site_copy.json alimenta ambas secciones. Cada
   render se aísla en su propio try/catch para que un fallo en un
   bloque no impida pintar el otro (mismo criterio que main.js).
   ───────────────────────────────────────────────────────────── */

function init() {
  const mvNode = document.querySelector('[data-copy="mision-vision"]');
  const valoresNode = document.querySelector('[data-copy="valores"]');
  if (!mvNode && !valoresNode) return;

  if (mvNode) renderInlineLoader(mvNode, 'Cargando…');
  if (valoresNode) renderInlineLoader(valoresNode, 'Cargando…');

  fetch(DATA_URL, { credentials: 'same-origin' })
    .then((res) => {
      if (!res.ok) throw new Error('HTTP ' + res.status + ' al solicitar ' + res.url);
      return res.json();
    })
    .then((data) => {
      if (mvNode) {
        try {
          renderMisionVision(mvNode, data && data.mision_vision);
        } catch (err) {
          console.error('[AChETIQ sobre] El render de Misión/Visión lanzó una excepción:', err);
          renderError(mvNode, { message: 'Hubo un problema al mostrar este bloque.' });
        }
      }
      if (valoresNode) {
        try {
          renderValores(valoresNode, data && data.valores);
        } catch (err) {
          console.error('[AChETIQ sobre] El render de Valores lanzó una excepción:', err);
          renderError(valoresNode, { message: 'Hubo un problema al mostrar este bloque.' });
        }
      }
    })
    .catch((err) => {
      console.error('[AChETIQ sobre] Falló la carga de site_copy.json:', err);
      const message = 'No se pudo cargar este bloque. Probá recargar la página.';
      if (mvNode) renderError(mvNode, { message });
      if (valoresNode) renderError(valoresNode, { message });
    });
}

/* Arranque conjunto: el enrutado de paneles (markup estático) se
   inicializa junto al render de contenido dinámico. Cada uno es
   autónomo. */
function boot() {
  initPanels();
  init();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
