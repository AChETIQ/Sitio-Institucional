/* ════════════════════════════════════════════════════════════
   contacto-redes.js — renderer local para data-loader="redes"
   ──────────────────────────────────────────────────────────────
   Extraído del <script type="module"> embebido de pages/contacto.html
   (sec: CSP). Mantenerlo como módulo externo de mismo origen permite
   una Content-Security-Policy con `script-src 'self'` (sin
   'unsafe-inline' ni hashes por página).

   loaders.js NO registra un renderer por defecto para «redes» (lo usa
   internamente footer.js para el bloque de redes del pie). Aquí se
   registra una variante propia para la grilla de tarjetas
   .contact-card del bloque [4]. Al cargarse como módulo con `defer`
   implícito y registrarse en import-time, el motor de main.js lo
   encuentra al escanear el DOM (main.js se importa después).
   ════════════════════════════════════════════════════════════ */
import { registerLoader, createElement, safeHref } from './loaders.js';

/* Lucide icon paths (stroke-based, viewBox 0 0 24 24).
   Versión congelada al snapshot del proyecto; verificada
   contra https://lucide.dev. */
const ICONS = {
  mail: [
    ['rect', { width: '20', height: '16', x: '2', y: '4', rx: '2' }],
    ['path', { d: 'm22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7' }]
  ],
  instagram: [
    ['rect', { width: '20', height: '20', x: '2', y: '2', rx: '5', ry: '5' }],
    ['path', { d: 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z' }],
    ['line', { x1: '17.5', x2: '17.51', y1: '6.5', y2: '6.5' }]
  ],
  linkedin: [
    ['path', { d: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z' }],
    ['rect', { width: '4', height: '12', x: '2', y: '9' }],
    ['circle', { cx: '4', cy: '4', r: '2' }]
  ],
  mapPin: [
    ['path', { d: 'M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0' }],
    ['circle', { cx: '12', cy: '10', r: '3' }]
  ]
};

/* Construye un SVG inline con la clase .contact-card__icon.
   aria-hidden porque el ícono es decorativo: el eyebrow y el
   valor ya proveen el contenido textual del canal. */
function svgIcon(name) {
  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('class', 'contact-card__icon');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '1.5');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  (ICONS[name] || []).forEach(([tag, attrs]) => {
    const node = document.createElementNS(NS, tag);
    for (const k of Object.keys(attrs)) node.setAttribute(k, attrs[k]);
    svg.appendChild(node);
  });
  return svg;
}

function activeCard({ icon, eyebrow, value, href, external }) {
  const safe = safeHref(href);
  if (!safe) return placeholderCard({ icon, eyebrow });
  const attrs = { href: safe };
  if (external) {
    attrs.target = '_blank';
    attrs.rel = 'noopener noreferrer';
  }
  const card = createElement('a', { class: 'contact-card', attrs });
  card.appendChild(svgIcon(icon));
  card.appendChild(createElement('p', { class: 'contact-card__eyebrow', text: eyebrow }));
  card.appendChild(createElement('p', { class: 'contact-card__value', text: value }));
  return card;
}

function placeholderCard({ icon, eyebrow, badge }) {
  const card = createElement('div', {
    class: 'contact-card contact-card--proximamente',
    attrs: { 'aria-disabled': 'true' }
  });
  card.appendChild(svgIcon(icon));
  card.appendChild(createElement('p', { class: 'contact-card__eyebrow', text: eyebrow }));
  card.appendChild(createElement('p', { class: 'contact-card__value', text: '—' }));
  card.appendChild(createElement('span', {
    class: 'contact-card__badge',
    text: badge || 'Próximamente'
  }));
  return card;
}

/* Tarjeta de dirección: visualmente idéntica a una activa,
   pero apunta al sitio institucional de la FRRe (no a Maps;
   el mapa ya está en el bloque [5]). Si web_facultad no está
   disponible en el JSON, se degrada a placeholder no
   interactivo en lugar de romper la grilla. */
function addressCard(data) {
  const valueText = data.direccion_facultad
    || 'Calle French 414, H3506 Resistencia, Chaco';
  return activeCard({
    icon: 'mapPin',
    eyebrow: 'Visitanos',
    value: valueText,
    href: data.web_facultad,
    external: true
  });
}

registerLoader('redes', (container, data) => {
  const grid = createElement('div', {
    class: 'grid-cards grid-cards--4 contact-grid'
  });

  if (data.email) {
    grid.appendChild(activeCard({
      icon: 'mail',
      eyebrow: 'Correo institucional',
      value: data.email,
      href: 'mailto:' + data.email,
      external: false
    }));
  }

  if (data.instagram) {
    grid.appendChild(activeCard({
      icon: 'instagram',
      eyebrow: 'Instagram',
      value: '@achetiq',
      href: data.instagram,
      external: true
    }));
  }

  /* LinkedIn: caso especial del wireframe — tarjeta visible
     con badge "Próximamente" mientras el campo sea null. Se
     activa automáticamente cuando data.linkedin deje de serlo. */
  if (data.linkedin) {
    grid.appendChild(activeCard({
      icon: 'linkedin',
      eyebrow: 'LinkedIn',
      value: 'AChETIQ',
      href: data.linkedin,
      external: true
    }));
  } else {
    grid.appendChild(placeholderCard({
      icon: 'linkedin',
      eyebrow: 'LinkedIn'
    }));
  }

  grid.appendChild(addressCard(data));

  container.appendChild(grid);
});
