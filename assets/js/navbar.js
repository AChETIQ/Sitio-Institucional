/* ============================================================
   AChETIQ — Navbar (navbar.js)
   Fase 2. Especificación normativa: prompt canónico de la navbar
   (memoria del proyecto, cerrado 2026-05-16) + FASE_1 §1.2 / §10.

   Responsabilidades:
     - fetch del partial y del config; sustitución del placeholder
       <div data-loader="navbar">.
     - Render declarativo de brand, enlaces y submenús a partir
       del JSON (DOM API; sin innerHTML sobre strings del config).
     - Toggle hamburguesa con scroll-lock, acordeón mobile,
       teclado (ArrowDown/Up/Home/End/Esc) en submenús desktop.
     - Fallback estático si cualquier fetch o parseo falla.

   Sin dependencias externas. Auto-inicia en DOMContentLoaded.
   ============================================================ */

(function () {
  'use strict';

  var SEL_PLACEHOLDER = '[data-loader="navbar"]';
  var BASE = window.AChETIQBase || { root: '/', resolve: function (p) { return '/' + String(p).replace(/^(\.?\/)+/, ''); }, rewriteTree: function () {} };
  var URL_PARTIAL = BASE.resolve('partials/navbar.html');
  var URL_CONFIG  = BASE.resolve('data/navbar.json');
  var LOCK_CLASS  = 'navbar-scroll-lock';
  var BP_DESKTOP  = 768;

  /* Chevron Lucide; hard-coded (no proviene del JSON). */
  var CHEVRON_SVG =
    '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"' +
    ' viewBox="0 0 24 24" fill="none" stroke="currentColor"' +
    ' stroke-width="2" stroke-linecap="round" stroke-linejoin="round"' +
    ' aria-hidden="true" focusable="false"><path d="m6 9 6 6 6-6"/></svg>';

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

  function chevron() {
    var s = el('span', 'navbar__chevron', null, { 'aria-hidden': 'true' });
    s.innerHTML = CHEVRON_SVG;
    return s;
  }

  function hasSub(link) {
    return Array.isArray(link.submenu) && link.submenu.length > 0;
  }

  function safeVariant(v) {
    return (typeof v === 'string' && /^[a-z-]+$/.test(v)) ? v : 'ghost';
  }


  /* ─── Render ─────────────────────────────────────────────── */

  function renderBrand(root, brand) {
    if (!brand) return;
    var a = root.querySelector('[data-navbar-brand]');
    var logo = root.querySelector('[data-navbar-logo]');
    var word = root.querySelector('[data-navbar-wordmark]');
    if (a && brand.href) a.setAttribute('href', BASE.resolve(brand.href));
    if (word && brand.label) {
      word.textContent = brand.label;
      if (a) a.setAttribute('aria-label', brand.label);
    }
    if (logo && brand.logo) logo.setAttribute('src', BASE.resolve(brand.logo));
  }

  function renderLists(root, links) {
    var deskList   = root.querySelector('[data-navbar-list]');
    var mobileList = root.querySelector('[data-navbar-panel-list]');
    if (!deskList || !mobileList) return;

    deskList.replaceChildren();
    mobileList.replaceChildren();

    links.forEach(function (link, idx) {
      deskList.appendChild(buildDesktopItem(link, idx));
      mobileList.appendChild(buildMobileItem(link, idx));
    });
  }

  function buildDesktopItem(link, idx) {
    var v = safeVariant(link.variant);
    var li = el('li', 'navbar__item');
    var a  = el('a', 'nav-link nav-link--' + v + ' navbar__label',
                link.label, { href: BASE.resolve(link.href) });

    if (!hasSub(link)) { li.appendChild(a); return li; }

    li.classList.add('navbar__item--has-submenu');
    var subId = 'navbar-submenu-' + idx;
    a.setAttribute('aria-haspopup', 'menu');
    a.setAttribute('aria-expanded', 'false');
    a.setAttribute('aria-controls', subId);
    a.appendChild(chevron());

    var ul = el('ul', 'navbar__submenu', null,
                { role: 'menu', id: subId, 'aria-label': link.label });
    link.submenu.forEach(function (sub) {
      var sli = el('li', null, null, { role: 'none' });
      sli.appendChild(el('a', 'navbar__sublink', sub.label,
                         { href: BASE.resolve(sub.href), role: 'menuitem' }));
      ul.appendChild(sli);
    });

    li.appendChild(a);
    li.appendChild(ul);
    bindDesktopKeys(a, ul);
    return li;
  }

  function buildMobileItem(link, idx) {
    var v = safeVariant(link.variant);
    var li = el('li', 'navbar__panel-item');
    var row = el('div', 'navbar__panel-row');
    var a = el('a',
               'navbar__panel-link' + (v === 'primary' ? ' navbar__panel-link--primary' : ''),
               link.label, { href: BASE.resolve(link.href) });
    row.appendChild(a);

    if (!hasSub(link)) { li.appendChild(row); return li; }

    li.classList.add('navbar__panel-item--has-submenu');
    var subId = 'navbar-panel-submenu-' + idx;
    var btn = el('button', 'navbar__panel-toggle', null, {
      type: 'button',
      'aria-expanded': 'false',
      'aria-controls': subId,
      'aria-label': 'Mostrar opciones de ' + link.label
    });
    btn.appendChild(chevron());
    row.appendChild(btn);

    var ul = el('ul', 'navbar__panel-submenu', null,
                { role: 'menu', id: subId, 'aria-label': link.label });
    link.submenu.forEach(function (sub) {
      var sli = el('li', null, null, { role: 'none' });
      sli.appendChild(el('a', 'navbar__panel-sublink', sub.label,
                         { href: BASE.resolve(sub.href), role: 'menuitem' }));
      ul.appendChild(sli);
    });

    li.appendChild(row);
    li.appendChild(ul);

    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', open ? 'false' : 'true');
      ul.classList.toggle('is-open', !open);
    });
    return li;
  }


  /* ─── Teclado en submenús desktop ────────────────────────── */

  function bindDesktopKeys(trigger, submenu) {
    var items = function () {
      return Array.prototype.slice.call(submenu.querySelectorAll('[role="menuitem"]'));
    };

    trigger.addEventListener('keydown', function (ev) {
      if (ev.key === 'ArrowDown') {
        ev.preventDefault();
        var first = items()[0];
        if (first) first.focus();
      }
    });

    submenu.addEventListener('keydown', function (ev) {
      var list = items();
      var i = list.indexOf(document.activeElement);
      var n = list.length;
      if (ev.key === 'Escape')         { ev.preventDefault(); trigger.focus(); }
      else if (ev.key === 'ArrowDown') { ev.preventDefault(); list[(i + 1) % n].focus(); }
      else if (ev.key === 'ArrowUp')   { ev.preventDefault(); list[(i - 1 + n) % n].focus(); }
      else if (ev.key === 'Home')      { ev.preventDefault(); list[0].focus(); }
      else if (ev.key === 'End')       { ev.preventDefault(); list[n - 1].focus(); }
    });
  }


  /* ─── Panel mobile: open/close ───────────────────────────── */

  function setupMobilePanel(root) {
    var toggle  = root.querySelector('[data-navbar-toggle]');
    var overlay = root.querySelector('[data-navbar-overlay]');
    var panel   = root.querySelector('[data-navbar-panel]');
    if (!toggle || !overlay || !panel) return;

    function open() {
      overlay.hidden = false; panel.hidden = false;
      void panel.offsetWidth;
      overlay.classList.add('is-open');
      panel.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Cerrar menú principal');
      document.body.classList.add(LOCK_CLASS);
      var first = panel.querySelector('a, button');
      if (first) first.focus();
    }

    function close() {
      overlay.classList.remove('is-open');
      panel.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Abrir menú principal');
      document.body.classList.remove(LOCK_CLASS);
      var done = function () {
        if (toggle.getAttribute('aria-expanded') !== 'true') {
          panel.hidden = true; overlay.hidden = true;
        }
        panel.removeEventListener('transitionend', done);
      };
      panel.addEventListener('transitionend', done);
    }

    toggle.addEventListener('click', function () {
      if (toggle.getAttribute('aria-expanded') === 'true') { close(); toggle.focus(); }
      else { open(); }
    });
    overlay.addEventListener('click', close);
    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        ev.preventDefault(); close(); toggle.focus();
      }
    });

    var mq = window.matchMedia('(min-width: ' + BP_DESKTOP + 'px)');
    var onMq = function (e) {
      if (e.matches && toggle.getAttribute('aria-expanded') === 'true') close();
    };
    if (mq.addEventListener) mq.addEventListener('change', onMq);
    else if (mq.addListener) mq.addListener(onMq);
  }


  /* ─── Fallback + inserción del partial ───────────────────── */

  function renderFallback(placeholder) {
    placeholder.replaceChildren();
    var header = el('header', 'navbar-fallback');
    var inner  = el('div', 'navbar-fallback__inner');
    inner.appendChild(el('a', 'navbar-fallback__brand', 'AChETIQ',
                         { href: BASE.resolve('index.html') }));
    header.appendChild(inner);
    placeholder.appendChild(header);
  }

  function insertPartial(placeholder, html) {
    var tpl = document.createElement('template');
    tpl.innerHTML = html.trim();
    var root = tpl.content.firstElementChild;
    if (!root || !root.matches('[data-navbar-root]')) {
      throw new Error('navbar: partial inválido');
    }
    /* Las URLs relativas del partial se resolverían contra la
       URL de la página anfitriona (que puede estar en cualquier
       subcarpeta). Las reescribimos ANTES de inyectar para que
       queden ancladas a la raíz del sitio. */
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
      fetch(URL_CONFIG,  { credentials: 'same-origin' })
    ])
    .then(function (res) {
      if (!res[0].ok) throw new Error('navbar: partial ' + res[0].status);
      if (!res[1].ok) throw new Error('navbar: config '  + res[1].status);
      return Promise.all([res[0].text(), res[1].json()]);
    })
    .then(function (parts) {
      var root = insertPartial(ph, parts[0]);
      var cfg  = parts[1] || {};
      renderBrand(root, cfg.brand);
      renderLists(root, Array.isArray(cfg.links) ? cfg.links : []);
      setupMobilePanel(root);
    })
    .catch(function (err) {
      if (window.console && console.error) console.error('[AChETIQ navbar]', err);
      renderFallback(ph);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
