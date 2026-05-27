/* ============================================================
   AChETIQ — Override del loader «gabinetes» para páginas de
   detalle (pages/gabinetes/<slug>.html)
   ------------------------------------------------------------
   Versión: 1.0 · Fase 2 — Desarrollo front-end
   Fundamento: assets/js/loaders.js (sección «CÓMO REGISTRAR UN
               LOADER NUEVO DESDE UNA PÁGINA») · FASE_1 §3.1.

   PROPÓSITO
     El renderer por defecto del loader `gabinetes` (loaders.js
     §4.1) produce la grilla de cuatro tarjetas del hub. En las
     páginas de detalle no queremos esa grilla, sino renderizar
     un único campo (`historia`, eventualmente otros) del gabinete
     correspondiente.

     Este módulo re-registra el loader `gabinetes` con una
     implementación que:
       1. Lee el `id` del gabinete del atributo
          `data-gabinete-id` del contenedor.
       2. Lee el campo a renderizar del atributo
          `data-gabinete-field` (por defecto: `historia`).
       3. Filtra el JSON, busca el gabinete por `id` y renderiza
          el campo como prosa (.prose) o, si está vacío, como
          empty-state estándar (states.css §8.1).

     El override es estrictamente local a la página que importa
     este módulo: no afecta al hub `pages/gabinetes.html`, que
     no lo carga.

   USO
     Incluir ANTES de main.js en el boilerplate de la página:
       <script type="module" src="../../assets/js/gabinete-detalle.js"></script>
       <script type="module" src="../../assets/js/main.js"></script>

     Y marcar el contenedor objetivo con:
       <div data-loader="gabinetes"
            data-gabinete-id="<slug>"
            data-gabinete-field="historia"></div>

   REGLAS DE SEGURIDAD
     Toda inserción usa textContent vía createElement; no se hace
     innerHTML con strings provenientes del JSON.
   ============================================================ */

'use strict';

import {
  registerLoader,
  createElement,
  renderEmpty
} from './loaders.js';

registerLoader('gabinetes', function (container, data) {
  var id = container.getAttribute('data-gabinete-id') || '';
  var field = container.getAttribute('data-gabinete-field') || 'historia';

  var list = Array.isArray(data) ? data : [];
  var cabinet = null;
  for (var i = 0; i < list.length; i++) {
    if (list[i] && list[i].id === id) {
      cabinet = list[i];
      break;
    }
  }

  if (!cabinet) {
    renderEmpty(container, {
      title: 'Gabinete no encontrado',
      desc: 'No fue posible localizar este gabinete en data/gabinetes.json.'
    });
    return;
  }

  var value = cabinet[field];
  if (typeof value !== 'string' || !value.trim()) {
    renderEmpty(container, {
      title: 'Contenido pendiente',
      desc: 'Esta sección será aportada por la comisión directiva.'
    });
    return;
  }

  /* Renderiza el texto como prosa. Si en el futuro el campo
     `historia` contiene saltos de párrafo (dos retornos), cada
     bloque se vuelca como un <p> independiente. */
  var prose = createElement('article', { class: 'prose' });
  var paragraphs = value.trim().split(/\n{2,}/);
  for (var j = 0; j < paragraphs.length; j++) {
    var text = paragraphs[j].trim();
    if (text) prose.appendChild(createElement('p', { text: text }));
  }
  container.appendChild(prose);
});
