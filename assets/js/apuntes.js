/* ============================================================
   AChETIQ — Override del loader «recursos» + filtro por año
   (pages/recursos/apuntes.html)
   ------------------------------------------------------------
   Versión: 1.0 · Fase 3 — P3.11

   PROPÓSITO
     El renderer por defecto de `recursos` (assets/js/loaders.js
     §4.2) construye cada materia como un <a> clickeable hacia
     una vista individual `pages/recurso.html?id=…`. Esa vista
     no existe en v1.0 — su modelo se cierra en Fase 4 (P4.6).

     Mientras tanto, esta página renderiza cada materia como un
     <article> NO interactivo con un estado «Sin apuntes aún»
     visible. El color placeholder por año (P3.7) se mantiene
     vía atributo data-anio.

     Además, este módulo cablea el filtro por año:
     `.pill-nav` arriba del grid alterna qué tarjetas quedan
     visibles según el botón pulsado, mediante el atributo
     [hidden] sobre cada <article>.

   COMPORTAMIENTO DEL FILTRO (wireframe §4 bloque [5])
     - «Todos» (estado por defecto): muestra todas las tarjetas.
     - «N° año»: oculta las tarjetas de los demás años (no
       reordena el grid in-place; sólo cambia visibilidad).
     - Selección única (un sólo pill activo a la vez); el botón
       activo lleva la clase `.is-active` y `aria-pressed="true"`.

   USO
     Incluir ANTES de main.js en el boilerplate de la página:
       <script type="module" src="../../assets/js/apuntes.js"></script>
       <script type="module" src="../../assets/js/main.js"></script>

     Y dejar en el HTML:
       <nav class="pill-nav" data-anio-filter aria-label="Filtrar por año">
         <button class="pill-nav__pill is-active"
                 data-anio="all" aria-pressed="true">Todos</button>
         <button class="pill-nav__pill"
                 data-anio="1" aria-pressed="false">1.º año</button>
         …
       </nav>
       <div class="grid-cards grid-cards--3" data-loader="recursos"></div>

   REGLAS DE SEGURIDAD (FASE_1 §7.2)
     Toda inserción usa textContent vía createElement. Nada
     proveniente del JSON se interpola como HTML.
   ============================================================ */

'use strict';

import { registerLoader, createElement } from './loaders.js';

var YEAR_LABEL = {
  1: '1.º año',
  2: '2.º año',
  3: '3.º año',
  4: '4.º año',
  5: '5.º año'
};


/* ─── Override del renderer de «recursos» ──────────────────── */

registerLoader('recursos', function (container, data) {
  var list = (Array.isArray(data) ? data.slice() : []).sort(function (a, b) {
    var ya = Number.isInteger(a.anio) ? a.anio : 99;
    var yb = Number.isInteger(b.anio) ? b.anio : 99;
    return ya - yb;
  });

  var grid = createElement('div', {
    class: 'grid-cards grid-cards--3 apuntes__grid'
  });

  list.forEach(function (m) {
    grid.appendChild(buildMateriaCard(m));
  });

  container.appendChild(grid);

  /* Una vez pintadas las tarjetas, activar el filtro de pills.
     Si la página no incluye un .pill-nav[data-anio-filter] el
     wiring es no-op. */
  wireYearFilter(container);
});


/* Construye una tarjeta de materia en estado «Sin apuntes aún»:
   <article> no interactivo, con cover coloreado por año
   (data-anio), nombre y línea de status. Cuando P4.6 defina la
   vista individual de materia, este renderer se actualiza para
   conmutar a <a href="…"> si la materia tiene material disponible
   y mantener el estado actual cuando no lo tenga. */
function buildMateriaCard(m) {
  var anio = (Number.isInteger(m.anio) && m.anio >= 1 && m.anio <= 5)
    ? m.anio : null;

  var attrs = {};
  if (anio) attrs['data-anio'] = anio;
  attrs['data-materia-id'] = m.id || '';
  attrs['data-estado'] = 'sin-apuntes';

  var card = createElement('article', {
    class: 'card card-materia card-materia--placeholder',
    attrs: attrs
  });

  card.appendChild(createElement('div', {
    class: 'card-materia__cover',
    attrs: { 'aria-hidden': 'true' }
  }));

  var body = createElement('div', { class: 'card-materia__body' });
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
  body.appendChild(createElement('p', {
    class: 'card-materia__status',
    text: 'Sin apuntes aún'
  }));
  card.appendChild(body);

  return card;
}


/* ─── Filtro por año (.pill-nav) ───────────────────────────── */

/* Conecta los botones del .pill-nav[data-anio-filter] al grid
   contenedor (el `.apuntes__grid` recién creado dentro de
   `container`). Selección única (un sólo pill activo a la vez)
   y persistencia local en el atributo data-anio del pill activo
   — sin storage, recarga limpia el filtro. */
function wireYearFilter(gridContainer) {
  var grid = gridContainer.querySelector('.apuntes__grid');
  if (!grid) return;

  var nav = document.querySelector('.pill-nav[data-anio-filter]');
  if (!nav) return;

  var pills = nav.querySelectorAll('.pill-nav__pill');
  if (!pills.length) return;

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
    for (var i = 0; i < cards.length; i++) {
      var card = cards[i];
      var anio = card.getAttribute('data-anio') || '';
      var visible = (value === 'all') || (anio === String(value));
      if (visible) {
        card.removeAttribute('hidden');
      } else {
        card.setAttribute('hidden', '');
      }
    }
  }

  nav.addEventListener('click', function (e) {
    var target = e.target;
    while (target && target !== nav && !target.matches('.pill-nav__pill')) {
      target = target.parentNode;
    }
    if (!target || target === nav) return;

    var value = target.getAttribute('data-anio') || 'all';
    setActive(target);
    applyFilter(value);
  });

  /* Estado inicial: respeta el pill marcado .is-active en el HTML
     (por defecto «Todos»). */
  var initial = nav.querySelector('.pill-nav__pill.is-active') || pills[0];
  if (initial) {
    applyFilter(initial.getAttribute('data-anio') || 'all');
  }
}
