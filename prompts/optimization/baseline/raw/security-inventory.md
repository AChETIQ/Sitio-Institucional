# Security inventory — baseline (read-only snapshot)

Generated 2026-06-26T22:40:39Z. No code changed. Findings are **logged for 04-security.md**, not fixed here.

## 1. Content-Security-Policy

- **No CSP anywhere.** No `<meta http-equiv="Content-Security-Policy">` in any HTML
  file, and the static host sets no CSP header.
  Grep: `grep -rl 'Content-Security-Policy' --include='*.html'` → 0 files.

## 2. External origins referenced in HTML

| Origin | Count | Purpose |
|---|---:|---|
| https://ingqcautnfrre-lab.github.io | 37 | Self (BASE_URL in og/twitter/canonical-to-be) |
| https://drive.google.com | 15 | Apuntes file links (user-supplied, via safeHref) |
| https://www.google.com | 2 | Maps embed + Maps search link (contacto.html) |
| https://docs.google.com | 1 | Document link |
| https://cdnjs.cloudflare.com | 1 | **xlsx-populate@1.21.0 script (seguimiento.html)** |
| https://lucide.dev | 1 | Icon-license attribution comment (not a request) |

## 3. Third-party scripts (Subresource Integrity / SRI)

- **1 external script, NO SRI:**
  ```html
312:  <script defer src="https://cdnjs.cloudflare.com/ajax/libs/xlsx-populate/1.21.0/xlsx-populate.min.js"></script>
  ```
  Loaded with `defer` but **no `integrity`/`crossorigin`** attributes → supply-chain
  exposure if cdnjs is compromised. **Finding for 04-security.md** (add SRI or self-host).
- No other external `<script src>` in the site.

## 4. innerHTML / HTML-injection sinks (JS)

`grep -rnE '\.innerHTML\s*=|insertAdjacentHTML|outerHTML\s*=|document.write' assets/js/`:
```
assets/js/easter-egg.js:101:    close.innerHTML =
assets/js/navbar.js:53:    s.innerHTML = CHEVRON_SVG;
assets/js/navbar.js:305:    tpl.innerHTML = html.trim();
assets/js/footer.js:103:    if (path) span.innerHTML = ICON_SVG_OPEN + path + ICON_SVG_CLOSE;
assets/js/footer.js:112:    wrap.innerHTML = ICON_SVG_OPEN + path + ICON_SVG_CLOSE;
assets/js/footer.js:237:    tpl.innerHTML = html.trim();
```

Read-only assessment (NOT a fix): each sink above assigns **static, in-code SVG/HTML
constants** (CHEVRON_SVG, ICON_SVG_*, `<template>` trim of literal markup) — no user
or network data flows into these. `safeHref()` (loaders.js:181) gates user URLs to
http/https only; `sanitizeEstado/Record` (seguimiento.js) validates parsed state.
To be **verified, not assumed**, in 04-security.md.

## 5. iframes

- 1 iframe (contacto.html:182) — Google Maps embed:
```html
        <iframe
          class="map-figure__frame"
          src="https://www.google.com/maps?q=Calle%20French%20414%2C%20Resistencia%2C%20Chaco&output=embed"
          title="Mapa de la Facultad Regional Resistencia (UTN), Calle French 414, Resistencia, Chaco"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          allow="fullscreen"></iframe>
        <figcaption class="map-figure__caption">
```
  Has `loading=lazy`, `referrerpolicy`, `title`. **No `sandbox` attribute** → finding
  for 04-security.md (evaluate `sandbox="allow-scripts allow-same-origin ..."` or CSP frame-src).

## 6. Secrets / auth / analytics

- No `.env`, no auth flow, no analytics/tracking scripts. `grep` for env files: 0 found.
