# Security pass — AChETIQ (OWASP lens on a static GitHub Pages site)

**Pillar:** `04-security.md` · **Date:** 2026-06-27 · **Stack:** hand-authored static
HTML + vanilla ES-module JS + custom-CSS design tokens, served from GitHub Pages
(no server runtime). **Baseline:** `../baseline/raw/security-inventory.md`.

> **One-line posture:** every page now ships an enforced, strict
> `<meta>` Content-Security-Policy (no `unsafe-*`, no third-party script origin),
> the one CDN dependency is self-hosted, the XSS invariant is verified and
> codified, the Maps iframe is sandboxed, there are zero known vulnerabilities and
> zero secrets — and every limit GitHub Pages imposes is documented, not hidden.

---

## 1. What GitHub Pages can and cannot enforce (the honest header reality)

GitHub Pages serves a **fixed** response-header set and lets us set **none** of our
own. Measured intent: `curl -sI https://ingqcautnfrre-lab.github.io/achetiq-lab/`
is **blocked from this environment** by the org egress policy (HTTP 403 on the
CONNECT tunnel — see `../baseline/raw/headers/pages-headers-BLOCKED.txt`); this is a
*measurement gap*, not a site finding. What is structurally true regardless:

| Mechanism | On GitHub Pages | Where we use it |
|---|---|---|
| CSP via `<meta http-equiv>` | ✅ works (subset) | **Enforced now** — every page |
| CSP `frame-ancestors` | ❌ ignored in `<meta>` (header-only) | portable `_headers` (later) |
| CSP `report-uri`/`report-to`, document `sandbox` | ❌ header-only | n/a |
| HSTS, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` | ❌ cannot be set at all | portable `_headers` (later) |

So the work splits cleanly into **enforced now** (the `<meta>` CSP) and **enforced
later** (the portable header file, inert until a header-capable host/proxy fronts
the site). The two are never conflated below.

---

## 2. Enforced now — the `<meta>` Content-Security-Policy

Source of truth: the `CSP` constant in [`scripts/build-csp.mjs`](../../../scripts/build-csp.mjs),
injected idempotently into every page (incl. `404.html`) and the boilerplate
template, **right after the viewport meta** so it governs everything below it
(a `<meta>` CSP only applies to what follows it). Wired into `npm run build`.

```
default-src 'self';
base-uri 'self';
object-src 'none';
script-src 'self';
style-src 'self';
img-src 'self';
font-src 'self';
connect-src 'self';
frame-src https://www.google.com;
form-action 'self';
upgrade-insecure-requests
```

### Per-directive justification

| Directive | Value | Why this, and why not looser |
|---|---|---|
| `default-src` | `'self'` | Restrictive fallback for anything not named below. |
| `base-uri` | `'self'` | Blocks `<base>`-tag hijacking of all relative URLs. |
| `object-src` | `'none'` | No `<object>/<embed>/<applet>`; kills a legacy plugin XSS vector. |
| `script-src` | `'self'` | All JS is same-origin ES modules / classic scripts. **No `'unsafe-inline'`** (the one inline module — contacto's redes renderer — was extracted to `assets/js/contacto-redes.js`). **No `'unsafe-eval'`** (the former cdnjs lib is self-hosted and its only `eval`/`Function` paths are unreachable in browsers — *verified*, §6). `<script type="application/ld+json">` blocks are **data**, exempt from `script-src`. |
| `style-src` | `'self'` | **No `'unsafe-inline'`**: the inline `<style>` (contacto) moved to `assets/css/contacto.css`; the four `style="--index:N"` attributes became `nth-child` rules; the dev-preview panel (the bulk of inline styles) was removed. JS sets only CSSOM properties (`el.style.setProperty`), which CSP does not gate. |
| `img-src` | `'self'` | All images are same-origin WebP/PNG/SVG. **No `data:`** — the site uses none (grep-confirmed), so it is omitted rather than carried "just in case". |
| `font-src` | `'self'` | WOFF2 are self-hosted (no Google Fonts/CDN). |
| `connect-src` | `'self'` | Every `fetch` (partials, JSON, the .xlsx template) is same-origin; no external XHR/WebSocket/EventSource. |
| `frame-src` | `https://www.google.com` | The single third-party frame: the Maps embed on `contacto.html`. Scoped to exactly that origin. |
| `form-action` | `'self'` | No external form posts (the site has no active `<form>`). |
| `upgrade-insecure-requests` | — | Passive defense: upgrades any stray `http://` subresource to `https://`. The site is already 100% https/self, so it is a no-op safety net. |

**`unsafe-*` directives used:** none. **Documented trade-offs:** none required — every
potential relaxation was avoided by fixing the page instead (the prompt's stated
preference). `frame-ancestors` is intentionally **omitted** from the `<meta>`
(ignored there, and including it only emits an inert console warning); it lives in
the portable header config with a real value.

---

## 3. Enforced later — portable header config

[`/_headers`](../../../_headers) (Netlify / Cloudflare-Pages format) +
[`docs/security-headers.md`](../../../docs/security-headers.md) carry the **full**
posture the site cannot have on Pages:

```
Content-Security-Policy: …; frame-ancestors 'none'; …   (full meta CSP + frame-ancestors)
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), browsing-topics=(), payment=(), usb=()
Cross-Origin-Opener-Policy: same-origin
```

**This file is inert on GitHub Pages** (Pages ignores it and serves it as a plain
static file). It activates only behind a header-capable host: Cloudflare/Netlify
Pages read `_headers` natively; a Cloudflare CDN over Pages uses the Transform-Rule
snippet in the doc. The header CSP differs from the live `<meta>` CSP by exactly one
directive — `frame-ancestors 'none'` — which a `<meta>` cannot carry; the doc states
they must be kept in sync.

**Expected scan grade once proxied:** **A / A+** on securityheaders.com and a high
Mozilla Observatory score. That grade **cannot be captured from here** — the
deployed `*.github.io` origin is unreachable from the agent/CI network (egress 403).
Capture it from an unrestricted network after a proxy is in place.

---

## 4. Supply chain (OWASP A06/A08) — the one third-party script, removed

`pages/recursos/seguimiento.html` loaded `xlsx-populate@1.21.0` from **cdnjs with no
SRI** — a real supply-chain exposure (a compromised CDN could inject arbitrary
script). It was the **only** external `<script src>` on the site.

**Fix: self-hosted**, the project's existing convention for third-party assets (its
fonts are self-hosted "for privacy, performance and zero third-party deps"). The
authentic, version-pinned `browser/xlsx-populate.min.js` was taken from the **npm
registry** (`npm pack xlsx-populate@1.21.0` — the same artifact cdnjs mirrors) and
vendored to [`assets/js/vendor/`](../../../assets/js/vendor/) with provenance +
hashes recorded in its README:

- SHA-384 (SRI): `sha384-YnsK3VaaV54M5EcU58Pt9SdJqzL0iZpQzQAcav+18Kgn5tbwk16y/3g6FpT2d83h`
- SHA-256: `33aa41e75cffc90385888e3541526efd1bc30846f84b85f875e9ced122c14b86`

Result: **no external script origin remains anywhere**, CSP stays `script-src 'self'`
with no CDN allowlist and no per-page exception, and **SRI is moot** (same-origin).
The library still exposes `window.XlsxPopulate`, so `seguimiento.js` is unchanged.
(A `.gitignore` override was needed so the file is committed despite the Jekyll
`vendor/` rule.)

**SRI elsewhere:** not applicable — every other asset (CSS, JS, fonts, images) is
self-hosted. Confirmed.

---

## 5. XSS / DOM-injection audit (verified, then codified)

`grep -rnE '\.innerHTML|insertAdjacentHTML|outerHTML|document.write'` → **6 sites**,
all classified and confirmed safe — none receives `data/*.json` or any
network/user data:

| Site | Assigns | Verdict |
|---|---|---|
| `navbar.js:53` | `CHEVRON_SVG` (static const) | static SVG — safe |
| `navbar.js:305` | `partials/navbar.html` into `<template>` | same-origin static fragment — safe |
| `footer.js:103`, `:112` | `ICON_SVG_* + ICON_PATHS[name]` (static) | static SVG — safe |
| `footer.js:237` | `partials/footer.html` into `<template>` | same-origin static fragment — safe |
| `easter-egg.js:101` | literal SVG string | static SVG — safe |

The JSON renderers (`loaders.js`, `seguimiento.js`, `apuntes.js`) build DOM with
`createElement` + `textContent` + `setAttribute` — the DOM API escapes for us.
`safeHref()` (`loaders.js:181`) allows only `http/https`, `mailto/tel` and relative
paths, rejecting `javascript:`/`data:`/`file:`; it gates **every** data-derived href
(11 call sites verified: gabinetes, apuntes covers, directiva photos, documentos,
instituciones, contacto cards).

To keep the invariant from rotting, the convention is now **codified at the source**:
the `loaders.js` security block was expanded into an explicit XSS rule, and each of
the 6 sinks carries a `// XSS-sink OK:` note stating why it is safe.

---

## 6. iframe hardening

`contacto.html` Maps embed now carries a minimal **`sandbox`** and a tightened
**`referrerpolicy`**:

```html
<iframe … src="https://www.google.com/maps?…&output=embed"
  loading="lazy"
  sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
  referrerpolicy="strict-origin-when-cross-origin"
  allow="fullscreen"></iframe>
```

The sandbox grants only what a Google Maps embed needs (scripts, same-origin to
google.com, and opening the "view in Maps" link in a new tab) — **no**
`allow-top-navigation`, `allow-forms`, or `allow-downloads`. `referrerpolicy` now
sends only the origin cross-origin and nothing on downgrade. CSP `frame-src` already
pins the frame to `https://www.google.com`.

> ⚠️ **Live-check needed:** `google.com` is unreachable from this environment
> (egress 403), so the embed could not be rendered here to confirm the sandbox set
> is sufficient. Verify visually on the deploy; if the tiles fail to load, the most
> likely missing token is `allow-same-origin` (already included).

**External links:** every `target="_blank"` across the site already carries
`rel="noopener noreferrer"` (static markup and the JS link builders) — re-verified, no
gaps.

---

## 7. Secrets / env / analytics

`grep -rn 'NEXT_PUBLIC\|process.env\|API_KEY\|secret\|token'` and `ls -a` for
`.env*` → **none**. No auth flow, no analytics/tracking, no public config that leaks
anything. The Maps embed uses the keyless `?output=embed` URL (no API key). Recorded
as clean.

---

## 8. Dependency posture (honest note)

`npm audit` (prod and incl. dev) → **`found 0 vulnerabilities`**. Correction to the
baseline note: the tree is **no longer empty** — a prior pass added one devDependency
(`@axe-core/playwright`, plus a `package-lock.json`). It is **dev-only** (never
shipped to users) and currently clean. The runtime/shipped dependency tree remains
**zero** third-party packages. Re-run with `npm audit` (or `npx osv-scanner .` if
runtime deps are ever added).

---

## 9. Verification evidence (Measure → Diagnose → Implement → Verify → Document)

A `<meta>` cannot deliver `Content-Security-Policy-Report-Only`, so report-only was
reproduced locally: a Node static server emits the **published** policy as a real
`Content-Security-Policy-Report-Only` header and headless Chromium
([`scripts/verify-csp.mjs`](../../../scripts/verify-csp.mjs)) drives every page,
collecting `securitypolicyviolation` events.

| Check | Result |
|---|---|
| Report-only, all 12 pages | **0 violations** |
| Enforced `<meta>` (production-equivalent serve), all 12 pages | **0 violations** |
| navbar / footer / loaders inject under enforcement | ✅ every page |
| `contacto` redes renderer (external module) under `script-src 'self'` | ✅ 4 cards render |
| `seguimiento` Excel export round-trip (`fromDataAsync`→`outputAsync`) under `script-src 'self'` | ✅ **OK, no `eval` violation** (42 KB workbook produced) |

Re-runnable: `CHROME_PATH=/path/to/chrome node scripts/verify-csp.mjs` (PASS, exit 0).
Not yet verifiable from here (network-blocked, tracked): the live Maps embed render
and the deployed header-scan grade.

---

## 10. Acceptance criteria

- [x] Working **`<meta>` CSP** on every page that does **not** break rendering, the
  Maps embed allowance, fonts, or any widget — **no undocumented `unsafe-*`** (none used at all).
- [x] Portable **full-header** config committed, documented as **inert on Pages** with
  where-to-apply and the A/A+ expectation once proxied.
- [x] XSS audit: **zero** `innerHTML`-style sinks fed by untrusted/JSON data; `safeHref`
  covers all data-driven hrefs; convention codified.
- [x] Maps iframe **sandboxed + referrer-limited**; all external links `noopener noreferrer`.
- [x] Dependency posture: **zero high/critical** vulns, with the honest note that the
  shipped tree is empty and one dev-only dep exists.
- [ ] *Deferred (network-blocked, not a code gap):* live Maps-embed render check and
  live header-scan grade — capture from an unrestricted network / the deploy.

---

## 11. Commits (atomic)

```
sec: de-inline pages for a strict CSP
sec: self-host xlsx-populate, drop the cdnjs third-party origin
sec: enforce site-wide CSP via <meta> + harden Maps iframe
sec: portable header config for a future proxy/CDN
sec: codify the XSS-sink convention at the source
sec: add report-only CSP verification harness (CI-ready)
```

**Out of scope (other pillars):** SEO (`01`), a11y (`02`), perf (`03`), CI wiring
(`06`) — `verify-csp.mjs` is built to drop straight into the `06` gate. No build/server
dependency was introduced; `npm run build` passes.
