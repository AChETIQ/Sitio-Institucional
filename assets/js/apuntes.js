/* ============================================================
   AChETIQ - Override del loader «recursos» + filtro por año
   (pages/recursos/apuntes.html)
   ------------------------------------------------------------
   Version: 2.0 · Fase 4 - modelo «carpeta de Drive por materia»

   PROPOSITO
     El renderer por defecto de `recursos` (assets/js/loaders.js
     §4.2) construia cada materia como un <a> hacia una vista
     individual interna. Esa vista se descarto: el modelo de
     apuntes se simplifico a una carpeta institucional de Google
     Drive por materia.

     Cada materia de data/recursos.json lleva ahora un campo
     `drive_url`:
       · Si `drive_url` tiene valor -> la tarjeta es un <a>
         externo que abre la carpeta de Drive en una pestaña
         nueva (target="_blank", rel="noopener noreferrer") con
         etiqueta accesible que advierte que es un enlace externo.
       · Si `drive_url` esta vacio ("") o ausente -> la tarjeta
         es un <article> NO interactivo en variante --placeholder,
         con el estado visible «Carpeta no disponible».

     Ya no existe `data/apuntes.json` ni subpaginas por materia:
     el destino de cada tarjeta es directamente la carpeta externa.

     Ademas, este modulo cablea el filtro por año: `.pill-nav`
     arriba del grid alterna que tarjetas quedan visibles segun el
     boton pulsado, mediante el atributo [hidden] sobre cada tarjeta.

   COMPORTAMIENTO DEL FILTRO (wireframe §4 bloque [5])
     - «Todos» (por defecto): muestra todas las tarjetas.
     - «N° año»: oculta las tarjetas de los demas años.
     - Seleccion unica; el boton activo lleva .is-active y
       aria-pressed="true".

   REGLAS DE SEGURIDAD (FASE_1 §7.2)
     Toda insercion usa textContent via createElement. El
     `drive_url` pasa por safeHref(): solo http/https, rutas
     relativas y anclas; javascript:, data:, file:... se rechazan
     y la tarjeta cae a la variante «no disponible».
   ============================================================ */

'use strict';

import { registerLoader, createElement, safeHref } from './loaders.js';

var YEAR_LABEL = {
  1: '1º año',
  2: '2º año',
  3: '3º año',
  4: '4º año',
  5: '5º año'
};


/* --- Override del renderer de «recursos» -------------------- */

registerLoader('recursos', function (container, data) {
  var list = (Array.isArray(data) ? data.slice() : []).sort(function (a, b) {
    var ya = Number.isInteger(a.anio) ? a.anio : 99;
    var yb = Number.isInteger(b.anio) ? b.anio : 99;
    return ya - yb;
  });

  /* Grid fluido (S2): 41 materias sin cuenta de columnas
     semántica — repeat(auto-fit, minmax(var(--card-min), 1fr))
     decide la densidad según el ancho disponible. */
  var grid = createElement('div', {
    class: 'grid-cards grid-cards--fluid apuntes__grid'
  });

  list.forEach(function (m) {
    grid.appendChild(buildMateriaCard(m));
  });

  container.appendChild(grid);
  wireYearFilter(container);
});


/* Construye la tarjeta de una materia: enlazada (<a> externo) o
   placeholder (<article> no interactivo) segun `drive_url`. */
function buildMateriaCard(m) {
  var anio = (Number.isInteger(m.anio) && m.anio >= 1 && m.anio <= 5)
    ? m.anio : null;

  var rawUrl = (typeof m.drive_url === 'string') ? m.drive_url.trim() : '';
  var href = rawUrl ? safeHref(rawUrl) : null;
  var nombre = m.nombre || '';

  if (href) {
    return buildLinkedCard(m, anio, href, nombre);
  }
  return buildPlaceholderCard(m, anio, nombre);
}


/* Variante A - materia con carpeta de Drive (<a> externo). */
function buildLinkedCard(m, anio, href, nombre) {
  var attrs = {
    href: href,
    target: '_blank',
    rel: 'noopener noreferrer',
    'aria-label': 'Material de ' + nombre +
                  ' en Google Drive (se abre en una pestaña nueva)',
    'data-materia-id': m.id || '',
    'data-estado': 'disponible'
  };
  if (anio) attrs['data-anio'] = anio;

  var card = createElement('a', {
    class: 'card card-materia card-materia--drive',
    attrs: attrs
  });

  card.appendChild(buildCover(m));
  card.appendChild(buildBody(anio, nombre, buildLinkedStatus()));
  return card;
}


/* Variante B - materia sin carpeta todavia (<article>). */
function buildPlaceholderCard(m, anio, nombre) {
  var attrs = {
    'data-materia-id': m.id || '',
    'data-estado': 'sin-material'
  };
  if (anio) attrs['data-anio'] = anio;

  var card = createElement('article', {
    class: 'card card-materia card-materia--placeholder',
    attrs: attrs
  });

  var status = createElement('p', {
    class: 'card-materia__status',
    text: 'Carpeta no disponible'
  });

  card.appendChild(buildCover(m));
  card.appendChild(buildBody(anio, nombre, status));
  return card;
}


/* --- Piezas compartidas de la tarjeta ---------------------- */

function buildCover(m) {
  var cover = createElement('div', {
    class: 'card-materia__cover',
    attrs: { 'aria-hidden': 'true' }
  });

  /* Imagen representativa de la materia (campo `imagen` en
     data/recursos.json). Contrato 16:9 (1280×720): width/height
     explícitos reservan el alto ANTES de cargar (CLS < 0,1 —
     RENDIMIENTO_Presupuesto.md). El color por año del cover queda
     de fondo como fallback mientras carga o si falta la imagen. La
     imagen es decorativa (el nombre va en el <h3>): alt vacío bajo
     el cover ya marcado aria-hidden. La ruta pasa por safeHref(). */
  var rawImg = (m && typeof m.imagen === 'string') ? m.imagen.trim() : '';
  var imgSrc = rawImg ? safeHref(window.AChETIQBase.resolve(rawImg)) : null;
  if (imgSrc) {
    cover.appendChild(createElement('img', {
      attrs: {
        src: imgSrc, alt: '', width: '1280', height: '720',
        loading: 'lazy', decoding: 'async'
      }
    }));
  }
  return cover;
}

function buildBody(anio, nombre, statusNode) {
  var body = createElement('div', { class: 'card-materia__body' });
  if (anio) {
    body.appendChild(createElement('p', {
      class: 'card-materia__year caption',
      text: YEAR_LABEL[anio]
    }));
  }
  body.appendChild(createElement('h3', {
    class: 'card-materia__name',
    text: nombre
  }));
  body.appendChild(statusNode);
  return body;
}

/* Estado de la variante enlazada: afordancia editorial E05 —
   «Acceder al repositorio» en cobalto + flecha (→) que avanza al
   hover/foco de la tarjeta + refuerzo sr-only de pestaña nueva.
   El glifo flecha es decorativo (aria-hidden): el destino externo
   ya lo verbaliza el aria-label del <a> y el refuerzo sr-only. */
function buildLinkedStatus() {
  var status = createElement('p', {
    class: 'card-materia__status card-materia__status--link'
  });
  status.appendChild(createElement('span', {
    class: 'card-materia__cta',
    text: 'Acceder al repositorio'
  }));
  status.appendChild(createElement('span', {
    class: 'card-materia__arrow',
    text: '→',
    attrs: { 'aria-hidden': 'true' }
  }));
  status.appendChild(createElement('span', {
    class: 'sr-only',
    text: ' (se abre en una pestaña nueva)'
  }));
  return status;
}


/* --- Filtro por año (.pill-nav) ---------------------------- */

function wireYearFilter(gridContainer) {
  var grid = gridContainer.querySelector('.apuntes__grid');
  if (!grid) return;

  var nav = document.querySelector('.pill-nav[data-anio-filter]');
  if (!nav) return;

  var pills = nav.querySelectorAll('.pill-nav__pill');
  if (!pills.length) return;

  /* Región viva sr-only que anuncia el resultado del filtro (S4):
     ocultar tarjetas con [hidden] es invisible para un lector de
     pantalla si nadie lo verbaliza. Se inserta vacía en el setup
     (queda registrada en el árbol de accesibilidad) y cada filtro
     escribe el conteo resultante. aria-pressed en la pill ya
     comunica el estado del control; esto comunica el EFECTO. */
  var announcer = createElement('p', {
    class: 'sr-only',
    attrs: { role: 'status', 'aria-live': 'polite', 'aria-atomic': 'true' }
  });
  nav.insertAdjacentElement('afterend', announcer);

  function announce(value, visibles) {
    var label = (value === 'all')
      ? 'Mostrando las ' + visibles + ' materias de todos los años.'
      : 'Mostrando ' + visibles + ' materias de ' + (YEAR_LABEL[value] || value) + '.';
    announcer.textContent = label;
  }

  function setActive(pill) {
    for (var i = 0; i < pills.length; i++) {
      var p = pills[i];
      var on = (p === pill);
      p.classList.toggle('is-active', on);
      p.setAttribute('aria-pressed', on ? 'true' : 'false');
    }
  }

  function applyFilter(value) {
    var cards = grid.querySelectorAll('.card-materia');
    var visibles = 0;
    for (var i = 0; i < cards.length; i++) {
      var card = cards[i];
      var anio = card.getAttribute('data-anio') || '';
      var visible = (value === 'all') || (anio === String(value));
      if (visible) {
        card.removeAttribute('hidden');
        visibles++;
      } else {
        card.setAttribute('hidden', '');
      }
    }
    return visibles;
  }

  nav.addEventListener('click', function (e) {
    var target = e.target;
    while (target && target !== nav && !target.matches('.pill-nav__pill')) {
      target = target.parentNode;
    }
    if (!target || target === nav) return;

    var value = target.getAttribute('data-anio') || 'all';
    setActive(target);
    var visibles = applyFilter(value);
    announce(value, visibles);
  });

  var initial = nav.querySelector('.pill-nav__pill.is-active') || pills[0];
  if (initial) {
    /* El estado inicial no se anuncia: no hubo interacción. */
    applyFilter(initial.getAttribute('data-anio') || 'all');
  }
}
