/* ============================================================
   AChETIQ — Footer (footer.js)
   Fase 2. Especificación: FASE_1_Catalogo_Componentes.md §1.3.

   Responsabilidades:
     - fetch del partial y del JSON de redes; sustitución del
       placeholder <div data-loader="footer">.
     - Render declarativo de los items de contacto (email,
       dirección, web facultad) y de los iconos de redes
       sociales solo para los canales con valor no nulo.
     - Inserción del año dinámico (Date.getFullYear()) en el
       aviso legal inferior.
     - Fallback estático si cualquier fetch o parseo falla.

   Sin dependencias externas. Mismo patrón que assets/js/navbar.js.
   Auto-inicia en DOMContentLoaded.
   ============================================================ */

(function () {
  'use strict';

  var SEL_PLACEHOLDER = '[data-loader="footer"]';
  var BASE = window.AChETIQBase || { root: '/', resolve: function (p) { return '/' + String(p).replace(/^(\.?\/)+/, ''); }, rewriteTree: function () {} };
  var URL_PARTIAL = BASE.resolve('partials/footer.html');
  var URL_REDES   = BASE.resolve('data/redes.json');


  /* ─── Iconos Lucide (24×24, currentColor) ────────────────── */

  var ICON_SVG_OPEN =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"' +
    ' stroke="currentColor" stroke-width="1.5" stroke-linecap="round"' +
    ' stroke-linejoin="round" aria-hidden="true" focusable="false">';
  var ICON_SVG_CLOSE = '</svg>';

  var ICON_PATHS = {
    mail:
      '<rect width="20" height="16" x="2" y="4" rx="2"/>' +
      '<path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    'map-pin':
      '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0' +
      'C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/>' +
      '<circle cx="12" cy="10" r="3"/>',
    globe:
      '<circle cx="12" cy="12" r="10"/>' +
      '<path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>' +
      '<path d="M2 12h20"/>',
    instagram:
      '<rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>' +
      '<path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>' +
      '<line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>',
    facebook:
      '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
    linkedin:
      '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>' +
      '<rect width="4" height="12" x="2" y="9"/>' +
      '<circle cx="4" cy="4" r="2"/>',
    youtube:
      '<path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0' +
      ' 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4' +
      ' 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/>' +
      '<path d="m10 15 5-3-5-3z"/>',
    twitter:
      '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    whatsapp:
      '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>'
  };

  /* Etiquetas accesibles de cada canal social (sr-only en el <a>). */
  var SOCIAL_LABELS = {
    instagram: 'Instagram',
    facebook:  'Facebook',
    whatsapp:  'WhatsApp',
    linkedin:  'LinkedIn',
    youtube:   'YouTube',
    twitter:   'Twitter / X'
  };

  /* Orden de render de iconos sociales (estable, independiente
     del orden de claves del JSON). */
  var SOCIAL_ORDER = [
    'instagram', 'facebook', 'whatsapp', 'linkedin', 'youtube', 'twitter'
  ];


  /* ─── Helpers DOM ────────────────────────────────────────── */

  function el(tag, cls, text, attrs) {
    var n = document.createElement(tag);
    if (cls)  n.className = cls;
    if (text != null) n.textContent = String(text);
    if (attrs) for (var k in attrs) {
      if (Object.prototype.hasOwnProperty.call(attrs, k)) {
        n.setAttribute(k, String(attrs[k]));
      }
    }
    return n;
  }

  function icon(name) {
    var span = el('span', 'footer__contact-icon', null, { 'aria-hidden': 'true' });
    var path = ICON_PATHS[name];
    if (path) span.innerHTML = ICON_SVG_OPEN + path + ICON_SVG_CLOSE;
    return span;
  }

  function socialSvg(name) {
    var path = ICON_PATHS[name];
    if (!path) return null;
    var wrap = document.createElement('span');
    wrap.setAttribute('aria-hidden', 'true');
    wrap.innerHTML = ICON_SVG_OPEN + path + ICON_SVG_CLOSE;
    var svg = wrap.firstChild;
    return svg;
  }

  /* Atributos estándar para todo enlace externo. */
  function setExternal(a) {
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
  }


  /* ─── Render: contacto ───────────────────────────────────── */

  function contactItem(iconName, label, value, opts) {
    /* opts: { href, external, asLink } */
    opts = opts || {};
    var li = el('li', 'footer__contact-item');
    li.appendChild(icon(iconName));

    var body = el('div', 'footer__contact-body');
    body.appendChild(el('span', 'footer__contact-label', label));

    if (opts.href) {
      var a = el('a', 'footer__contact-link', value, { href: opts.href });
      if (opts.external) setExternal(a);
      body.appendChild(a);
    } else {
      body.appendChild(el('p', 'footer__contact-value', value));
    }

    li.appendChild(body);
    return li;
  }

  function renderContact(root, redes) {
    var list = root.querySelector('[data-footer-contact]');
    if (!list) return;
    list.replaceChildren();

    if (redes.email) {
      list.appendChild(contactItem(
        'mail', 'Correo institucional', redes.email,
        { href: 'mailto:' + redes.email }
      ));
    }

    if (redes.direccion_facultad) {
      list.appendChild(contactItem(
        'map-pin', 'Sede — UTN FRRe', redes.direccion_facultad
      ));
    }

    if (redes.web_facultad) {
      list.appendChild(contactItem(
        'globe', 'Sitio de la facultad', prettyUrl(redes.web_facultad),
        { href: redes.web_facultad, external: true }
      ));
    }
  }

  /* Devuelve el host del URL sin protocolo ni barra final, para
     mostrar un texto compacto en el enlace. Cae al string original
     si el constructor URL falla (entrada inválida). */
  function prettyUrl(href) {
    try {
      var u = new URL(href);
      return (u.host + u.pathname).replace(/\/$/, '');
    } catch (e) {
      return href;
    }
  }


  /* ─── Render: redes sociales ─────────────────────────────── */

  function renderSocial(root, redes) {
    var list = root.querySelector('[data-footer-social]');
    if (!list) return;
    list.replaceChildren();

    SOCIAL_ORDER.forEach(function (key) {
      var url = redes[key];
      if (!url) return;

      var svg = socialSvg(key);
      if (!svg) return;

      var li = el('li', 'footer__social-item');
      var a  = el('a', 'footer__social-link', null, {
        href: url,
        'aria-label': SOCIAL_LABELS[key] || key
      });
      setExternal(a);
      a.appendChild(svg);
      li.appendChild(a);
      list.appendChild(li);
    });
  }


  /* ─── Render: año dinámico ───────────────────────────────── */

  function renderYear(root) {
    var span = root.querySelector('[data-footer-year]');
    if (span) span.textContent = String(new Date().getFullYear());
  }


  /* ─── Fallback + inserción del partial ───────────────────── */

  function renderFallback(placeholder) {
    placeholder.replaceChildren();
    var footer = el('footer', 'footer-fallback', null, { role: 'contentinfo' });
    var inner  = el('div', 'footer-fallback__inner');
    inner.appendChild(el('p', null,
      '© ' + new Date().getFullYear() +
      ' Asociación Chaqueña de Estudiantes Tecnológicos de Ingeniería Química · UTN FRRe'
    ));
    footer.appendChild(inner);
    placeholder.appendChild(footer);
  }

  function insertPartial(placeholder, html) {
    var tpl = document.createElement('template');
    tpl.innerHTML = html.trim();
    var root = tpl.content.firstElementChild;
    if (!root || !root.matches('[data-footer-root]')) {
      throw new Error('footer: partial inválido');
    }
    /* Reescribe href/src del partial antes de inyectarlo: las
       rutas relativas del markup quedarían atadas a la URL de la
       página anfitriona, no a la raíz del sitio. */
    BASE.rewriteTree(root);
    placeholder.replaceWith(root);
    return root;
  }


  /* ─── Init ──────────────────────────────────────────────── */

  function init() {
    var ph = document.querySelector(SEL_PLACEHOLDER);
    if (!ph) return;

    Promise.all([
      fetch(URL_PARTIAL, { credentials: 'same-origin' }),
      fetch(URL_REDES,   { credentials: 'same-origin' })
    ])
    .then(function (res) {
      if (!res[0].ok) throw new Error('footer: partial ' + res[0].status);
      if (!res[1].ok) throw new Error('footer: redes '   + res[1].status);
      return Promise.all([res[0].text(), res[1].json()]);
    })
    .then(function (parts) {
      var root  = insertPartial(ph, parts[0]);
      var redes = parts[1] || {};
      renderContact(root, redes);
      renderSocial(root, redes);
      renderYear(root);
    })
    .catch(function (err) {
      if (window.console && console.error) console.error('[AChETIQ footer]', err);
      try { renderFallback(ph); } catch (e) { /* placeholder ya removido */ }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
