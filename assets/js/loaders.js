/* ============================================================
   AChETIQ — Motor de carga dinámica: registro (loaders.js)
   ------------------------------------------------------------
   Versión: 1.0 · Fase 3 — P3.6

   Registro extensible de renderizadores para el patrón
   <elemento data-loader="<nombre>">. El motor que recorre el DOM
   y dispara los fetch vive en assets/js/main.js; este módulo
   expone:

     - registerLoader(nombre, renderFn)   API pública / extensible
     - getLoader(nombre) · hasLoader      lookup
     - isSpecialLoader(nombre)            navbar / footer
     - createElement(tag, opts)           helper DOM seguro
     - safeHref(url)                      sanitiza enlaces
     - renderInlineLoader / renderEmpty / renderError
                                          estados visuales del fetch
     - renderizadores por defecto para los JSON ya presentes:
       gabinetes, recursos, directiva, historia, documentos,
       instituciones. Producen markup BEM conforme al catálogo
       de Fase 1 (§4, §5, §8).

   CASOS ESPECIALES (no atendidos por el motor)
     - data-loader="navbar"  →  assets/js/navbar.js carga el
       partial y la configuración del header; reemplaza el
       placeholder antes de que el motor pueda procesarlo.
     - data-loader="footer"  →  assets/js/footer.js, idem.
   Ambos scripts se cargan en el boilerplate como <script>
   clásicos ANTES del módulo main.js y se auto-inician en
   DOMContentLoaded. El motor reconoce esos dos nombres como
   SPECIAL y no los toca.

   CÓMO REGISTRAR UN LOADER NUEVO DESDE UNA PÁGINA
     Insertá un módulo propio ANTES del main.js del boilerplate;
     los módulos diferidos se evalúan en orden de aparición y el
     motor recién escanea en DOMContentLoaded:

       <script type="module">
         import { registerLoader, createElement, safeHref }
           from '/assets/js/loaders.js';

         registerLoader('miseccion', (container, data) => {
           // container = el nodo <… data-loader="miseccion">.
           // data      = JSON parseado de /data/miseccion.json.
           // El motor ya limpió container; sólo populá su contenido.
           const ul = createElement('ul', { class: 'mi-lista' });
           data.forEach((item) => {
             ul.appendChild(createElement('li', { text: item.nombre }));
           });
           container.appendChild(ul);
         });
       </script>
       <script type="module" src="/assets/js/main.js"></script>

     Para sobrescribir un renderer por defecto (p. ej. agrupar
     `recursos` por año conectado a `.pill-nav`), basta con volver
     a registrar el mismo nombre: la última registración gana.

   REGLAS DE SEGURIDAD (FASE_1 §7.2)
     - Prohibido innerHTML con strings provenientes del JSON.
     - Usar textContent y setAttribute: el DOM API escapa por
       nosotros caracteres especiales (<, >, ", &…).
     - Validar href con safeHref antes de aplicarlo: bloquea
       javascript:, data: y otros schemes peligrosos.

   Sin dependencias externas. ES module nativo, sin transpilación.
   ============================================================ */

'use strict';


/* ─────────────────────────────────────────────────────────────
   1. Registro
   ───────────────────────────────────────────────────────────── */

const registry = new Map();

/* Nombres reservados: ya tienen scripts dedicados que cargan
   partial + JSON y reemplazan el placeholder. El motor los omite
   para no pisarse con ellos. */
const SPECIAL = new Set(['navbar', 'footer']);

export function registerLoader(name, renderFn) {
  if (typeof name !== 'string' || !name.trim()) {
    throw new TypeError('registerLoader: el nombre debe ser un string no vacío');
  }
  if (typeof renderFn !== 'function') {
    throw new TypeError('registerLoader: renderFn debe ser una función');
  }
  registry.set(name.trim(), renderFn);
}

export function getLoader(name) {
  return registry.get(name) || null;
}

export function hasLoader(name) {
  return registry.has(name);
}

export function isSpecialLoader(name) {
  return SPECIAL.has(name);
}


/* ─────────────────────────────────────────────────────────────
   2. Helpers DOM
   ───────────────────────────────────────────────────────────── */

/* Crea un elemento. Todo string proveniente del JSON pasa por
   textContent o setAttribute: el DOM API escapa caracteres
   especiales automáticamente, sin manipulación manual ni regex. */
export function createElement(tag, opts) {
  const o = opts || {};
  const node = document.createElement(tag);
  if (o.class) node.className = String(o.class);
  if (o.text != null) node.textContent = String(o.text);
  if (o.attrs) {
    for (const key of Object.keys(o.attrs)) {
      const v = o.attrs[key];
      if (v != null) node.setAttribute(key, String(v));
    }
  }
  if (o.children) {
    for (const child of o.children) {
      if (child) node.appendChild(child);
    }
  }
  return node;
}

/* Schemes admitidos para href: HTTP/HTTPS y mail/tel para
   contactos; cualquier ruta relativa al sitio (/, ./, ../, #).
   Todo lo demás (javascript:, data:, file:…) se rechaza. */
const SAFE_URL_RE = /^(?:https?:|mailto:|tel:|\/|\.\/|\.\.\/|#)/i;

export function safeHref(url) {
  if (typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  return SAFE_URL_RE.test(trimmed) ? trimmed : null;
}

/* Atributos canónicos para enlaces externos. */
function setExternal(a) {
  a.setAttribute('target', '_blank');
  a.setAttribute('rel', 'noopener noreferrer');
}

/* Devuelve host+path sin protocolo ni barra final, para mostrar
   un texto compacto en el enlace. Cae al string original si la
   entrada no es un URL parseable. */
function prettyUrl(href) {
  try {
    const u = new URL(href);
    return (u.host + u.pathname).replace(/\/+$/, '');
  } catch (_) {
    return String(href);
  }
}


/* ─────────────────────────────────────────────────────────────
   3. Estados visuales del fetch
   ───────────────────────────────────────────────────────────── */

/* Loader inline «Bouncing Dots» (P3.3, variante sin overlay).
   Reutiliza las clases definidas en assets/css/loader.css. El
   atributo .safe-motion conserva la animación bajo
   prefers-reduced-motion (pulso de opacidad). */
export function renderInlineLoader(container, message) {
  container.replaceChildren();
  container.setAttribute('data-loader-state', 'loading');

  const wrap = createElement('div', {
    class: 'loader loader--msg-right',
    attrs: { role: 'status', 'aria-live': 'polite' }
  });
  const dots = createElement('div', { class: 'loader__dots' });
  for (let i = 0; i < 3; i++) {
    dots.appendChild(createElement('span', { class: 'loader__dot safe-motion' }));
  }
  wrap.appendChild(dots);

  const text = (typeof message === 'string' && message) ? message : 'Cargando…';
  wrap.appendChild(createElement('p', { class: 'loader__message', text }));

  container.appendChild(wrap);
}

/* Empty-state (FASE_1 §8.1). Markup conforme al catálogo; el
   estilo definitivo de .empty-state se incorpora en P3.7. */
export function renderEmpty(container, opts) {
  const o = opts || {};
  container.replaceChildren();
  container.setAttribute('data-loader-state', 'empty');

  const block = createElement('div', { class: 'empty-state' });
  block.appendChild(createElement('h3', {
    class: 'empty-state__title',
    text: o.title || 'Aún no hay contenido publicado'
  }));
  block.appendChild(createElement('p', {
    class: 'empty-state__desc',
    text: o.desc || 'Estamos trabajando en esta sección. Pronto encontrarás aquí novedades de la asociación.'
  }));
  container.appendChild(block);
}

/* Mensaje de error accesible. role="alert" lo anuncia a lectores
   de pantalla apenas se inserta. El detalle técnico se loguea en
   consola desde el motor (main.js); el usuario sólo ve el aviso. */
export function renderError(container, opts) {
  const o = opts || {};
  container.replaceChildren();
  container.setAttribute('data-loader-state', 'error');

  const block = createElement('div', {
    class: 'loader-error',
    attrs: { role: 'alert' }
  });
  block.appendChild(createElement('p', {
    class: 'loader-error__message',
    text: o.message || 'No se pudo cargar este bloque. Probá recargar la página.'
  }));
  container.appendChild(block);
}


/* ============================================================
   4. Renderizadores por defecto
   ------------------------------------------------------------
   Producen markup BEM conforme al catálogo (FASE_1 §4-§5). Una
   página puede sobrescribirlos llamando registerLoader('nombre',
   suFn) antes de DOMContentLoaded; la última registración gana.
   ============================================================ */

/* ─── 4.1 gabinetes (FASE_1 §4.2) ──────────────────────────── */

function renderGabinetes(container, data) {
  const list = (Array.isArray(data) ? data.slice() : [])
    .sort((a, b) => (a.orden || 0) - (b.orden || 0));

  const grid = createElement('div', { class: 'grid-cards grid-cards--2' });
  list.forEach((g) => grid.appendChild(buildGabineteCard(g)));
  container.appendChild(grid);
}

function buildGabineteCard(g) {
  const card = createElement('article', { class: 'card card-gabinete' });

  card.appendChild(createElement('h3', {
    class: 'card-gabinete__title',
    text: g.nombre || ''
  }));

  if (g.descripcion_corta) {
    card.appendChild(createElement('p', {
      class: 'card-gabinete__desc',
      text: g.descripcion_corta
    }));
  }

  const href = g.id ? safeHref('/pages/gabinetes/' + String(g.id) + '.html') : null;
  if (href) {
    const footer = createElement('footer', { class: 'card-footer' });
    footer.appendChild(createElement('a', {
      class: 'card-gabinete__link',
      text: 'Conocer más →',
      attrs: { href }
    }));
    card.appendChild(footer);
  }

  return card;
}


/* ─── 4.2 recursos / materias (FASE_1 §4.9) ────────────────── */

const YEAR_LABEL = {
  1: '1.º año', 2: '2.º año', 3: '3.º año', 4: '4.º año', 5: '5.º año'
};

function renderRecursos(container, data) {
  const list = Array.isArray(data) ? data : [];
  const grid = createElement('div', { class: 'grid-cards grid-cards--3' });
  list.forEach((m) => grid.appendChild(buildMateriaCard(m)));
  container.appendChild(grid);
}

function buildMateriaCard(m) {
  const anio = (Number.isInteger(m.anio) && m.anio >= 1 && m.anio <= 5)
    ? m.anio : null;
  const href = m.id
    ? safeHref('/pages/recursos/apuntes.html#' + String(m.id))
    : null;

  const attrs = {};
  if (href) attrs.href = href;
  if (anio) attrs['data-anio'] = anio;

  const card = createElement('a', { class: 'card card-materia', attrs });

  card.appendChild(createElement('div', {
    class: 'card-materia__cover',
    attrs: { 'aria-hidden': 'true' }
  }));

  const body = createElement('div', { class: 'card-materia__body' });
  if (anio) {
    body.appendChild(createElement('p', {
      class: 'card-materia__year caption',
      text: YEAR_LABEL[anio]
    }));
  }
  body.appendChild(createElement('h3', {
    class: 'card-materia__name',
    text: m.nombre || ''
  }));
  card.appendChild(body);

  return card;
}


/* ─── 4.3 directiva (FASE_1 §4.3) ──────────────────────────── */

const SUBGROUP_RANK = { presidencia: 1, titulares: 2, suplentes: 3 };

function renderDirectiva(container, data) {
  const list = (Array.isArray(data) ? data.slice() : []).sort((a, b) => {
    const sa = SUBGROUP_RANK[a.subgrupo] || 99;
    const sb = SUBGROUP_RANK[b.subgrupo] || 99;
    if (sa !== sb) return sa - sb;
    return (a.orden || 0) - (b.orden || 0);
  });

  const grid = createElement('div', { class: 'grid-cards grid-cards--4' });
  list.forEach((p) => grid.appendChild(buildIntegranteCard(p)));
  container.appendChild(grid);
}

function buildIntegranteCard(person) {
  const card = createElement('article', { class: 'card-integrante' });

  const photoBox = createElement('div', { class: 'card-integrante__photo' });
  const fotoUrl = typeof person.foto === 'string' ? safeHref(person.foto) : null;
  if (fotoUrl) {
    photoBox.appendChild(createElement('img', {
      attrs: { src: fotoUrl, alt: '', loading: 'lazy' }
    }));
  } else {
    /* Placeholder con iniciales — spec §4.3, estado sin foto. */
    photoBox.appendChild(createElement('span', {
      class: 'card-integrante__placeholder',
      text: initials(person.nombre || ''),
      attrs: { 'aria-hidden': 'true' }
    }));
  }
  card.appendChild(photoBox);

  card.appendChild(createElement('h3', {
    class: 'card-integrante__name',
    text: person.nombre || ''
  }));
  card.appendChild(createElement('p', {
    class: 'card-integrante__role',
    text: person.cargo || ''
  }));

  return card;
}

function initials(name) {
  return String(name).trim().split(/\s+/).filter(Boolean)
    .slice(0, 2).map((p) => p.charAt(0)).join('').toUpperCase();
}


/* ─── 4.4 historia / timeline (FASE_1 §5.5) ────────────────── */

function renderHistoria(container, data) {
  const list = (Array.isArray(data) ? data.slice() : [])
    .sort((a, b) => yearKey(a.anio) - yearKey(b.anio));

  const ol = createElement('ol', { class: 'timeline' });
  list.forEach((h) => ol.appendChild(buildTimelineEntry(h, false)));

  /* Entrada ghost final — proyecta hacia el futuro sin cerrar
     contenido (FASE_1 §5.5, decisión configurable: aquí se
     renderiza desde el template, no desde el JSON). */
  ol.appendChild(buildTimelineEntry({
    anio: 'Próximamente',
    descripcion: 'La historia de AChETIQ continúa. Los próximos capítulos se escriben hoy.'
  }, true));

  container.appendChild(ol);
}

function yearKey(y) {
  const n = typeof y === 'number' ? y : Number.parseInt(String(y), 10);
  return Number.isFinite(n) ? n : Number.POSITIVE_INFINITY;
}

function buildTimelineEntry(h, ghost) {
  const li = createElement('li', {
    class: 'timeline__entry' + (ghost ? ' timeline__entry--ghost' : '')
  });
  li.appendChild(createElement('div', {
    class: 'timeline__marker' + (ghost ? ' timeline__marker--ghost' : '')
  }));

  const content = createElement('div', { class: 'timeline__content' });
  content.appendChild(createElement('p', {
    class: 'timeline__year',
    text: h.anio == null ? '' : String(h.anio)
  }));
  if (h.titulo && !ghost) {
    content.appendChild(createElement('h3', {
      class: 'timeline__title',
      text: h.titulo
    }));
  }
  if (h.descripcion) {
    content.appendChild(createElement('p', {
      class: 'timeline__desc',
      text: h.descripcion
    }));
  }
  li.appendChild(content);
  return li;
}


/* ─── 4.5 documentos (FASE_1 §5.4) ─────────────────────────── */

function renderDocumentos(container, data) {
  const list = (Array.isArray(data) ? data.slice() : [])
    .sort((a, b) => (a.orden || 0) - (b.orden || 0));

  const grid = createElement('div', { class: 'grid-cards grid-cards--2' });
  list.forEach((d) => grid.appendChild(buildDocumentoCard(d)));
  container.appendChild(grid);
}

function buildDocumentoCard(d) {
  const card = createElement('article', { class: 'card card-documento' });

  const body = createElement('div', { class: 'card-documento__body' });
  body.appendChild(createElement('h3', {
    class: 'card-documento__title',
    text: d.titulo || ''
  }));
  if (d.descripcion) {
    body.appendChild(createElement('p', {
      class: 'card-documento__desc',
      text: d.descripcion
    }));
  }
  const meta = formatDocMeta(d);
  if (meta) {
    body.appendChild(createElement('p', {
      class: 'card-documento__meta caption',
      text: meta
    }));
  }
  card.appendChild(body);

  if (d.archivo) {
    /* `archivo` se guarda como ruta relativa al sitio (ej.
       "docs/Estatuto.pdf"); le anteponemos "/" para volverla
       absoluta y sanitizamos. */
    const href = safeHref('/' + String(d.archivo).replace(/^\/+/, ''));
    if (href) {
      card.appendChild(createElement('a', {
        class: 'card-documento__action btn btn-secondary',
        text: 'Descargar',
        attrs: { href, download: '' }
      }));
    }
  }
  return card;
}

function formatDocMeta(d) {
  const parts = [];
  if (d.tipo) parts.push(String(d.tipo));
  if (typeof d.tamano_kb === 'number') {
    const mb = d.tamano_kb / 1024;
    parts.push(mb >= 1 ? mb.toFixed(2) + ' MB' : d.tamano_kb + ' KB');
  }
  return parts.join(' · ');
}


/* ─── 4.6 instituciones (FASE_1 §4.8) ──────────────────────── */

function renderInstituciones(container, data) {
  const list = (Array.isArray(data) ? data : []).filter(Boolean);
  const grid = createElement('div', { class: 'grid-cards grid-cards--2' });
  list.forEach((inst) => grid.appendChild(buildInstitucionCard(inst)));
  container.appendChild(grid);
}

function buildInstitucionCard(inst) {
  const card = createElement('article', { class: 'card card-institucion' });

  if (inst.logo) {
    const src = safeHref('/' + String(inst.logo).replace(/^\/+/, ''));
    if (src) {
      const alt = 'Logo ' + (inst.nombre_corto || inst.nombre || '');
      card.appendChild(createElement('img', {
        class: 'card-institucion__logo',
        attrs: { src, alt, loading: 'lazy' }
      }));
    }
  }

  card.appendChild(createElement('h3', {
    class: 'card-institucion__name',
    text: inst.nombre || ''
  }));

  const href = safeHref(inst.web);
  if (href) {
    const a = createElement('a', {
      class: 'card-institucion__link',
      text: prettyUrl(inst.web) + ' →',
      attrs: { href }
    });
    setExternal(a);
    card.appendChild(a);
  }

  return card;
}


/* ─── 4.7 Registro de defaults ─────────────────────────────── */

/* Los nombres registrados aquí coinciden con los archivos de
   /data/*.json existentes y con la tabla «Mapeo loader → JSON →
   componente» del catálogo (FASE_1 §10.1).

   No se registra `redes` porque assets/js/footer.js gestiona ya
   internamente data/redes.json al inyectar el footer; tampoco se
   registran `apuntes`, `noticias`, `actividades` ni `galeria`,
   cuyos JSON no existen en v1.0 (los pondrá la página que los
   incorpore vía registerLoader). */

registerLoader('gabinetes',     renderGabinetes);
registerLoader('recursos',      renderRecursos);
registerLoader('directiva',     renderDirectiva);
registerLoader('historia',      renderHistoria);
registerLoader('documentos',    renderDocumentos);
registerLoader('instituciones', renderInstituciones);
