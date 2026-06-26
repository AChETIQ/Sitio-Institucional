# Baseline Audit — SUMMARY (AChETIQ)

**Pre-optimization reference for all four pillars.** Captured **2026-06-26 (UTC)** against
the site as it exists at commit `e45823c`. This run **measured only** — no application code
was changed. Every number below is reproducible from the raw outputs committed under
[`raw/`](./raw/) using the commands and tool versions documented here. Where a metric could
**not** be captured, it is listed in [§7 Cannot measure yet](#7-cannot-measure-yet) with the
reason and the prompt that will enable it — **no number is fabricated or estimated**.

---

## 0. Environment & tool versions (pin these for the "after" runs)

| Tool | Version | Notes |
|---|---|---|
| OS / kernel | Linux 6.18.5 x86_64 | sandboxed remote container |
| Node.js | v22.22.2 | |
| npm | 10.9.7 | |
| Chromium | 141.0.7390.37 | `CHROME_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome` |
| Lighthouse | 13.4.0 | `npx --yes lighthouse` |
| `serve` | 14.2.6 | static host, **gzip negotiated** (compression-representative) |
| Playwright | global (`/opt/node22/lib/node_modules`) | drives axe + keyboard probe |
| @axe-core/playwright | ^4.10.2 | **new devDependency** (see §6) |
| linkinator | 7.6.1 | not usable as-run — see §7 |

**Serving:** `npx --yes serve -l 8099 .` (gzip; `Vary: Accept-Encoding`, `Content-Encoding: gzip`
verified on the CSS bundle). For axe + the keyboard probe a `python3 -m http.server 8099` stand-in
was used (compression irrelevant to those tools); the authoritative perf numbers come from the
gzip-`serve` runs.

**Reference pages (6):** `/` · `/pages/gabinetes/eventos.html` · `/pages/recursos/apuntes.html` ·
`/pages/contacto.html` · `/pages/sobre-achetiq.html` · `/pages/recursos/seguimiento.html`.
The `perf-matrix` tool covers the first **4** (the budget's reference set), mobile + desktop,
median-of-3.

> ### ⚠️ Read before trusting any externally-dependent number — sandbox network artifacts
> The execution sandbox **blocks outbound HTTPS** to the external origins this site uses.
> Confirmed blocked (agent proxy answered **403** to CONNECT): `cdnjs.cloudflare.com`,
> `www.google.com`, `drive.google.com`, and the deployed `ingqcautnfrre-lab.github.io` Pages
> origin. Any metric that depends on those origins reflects the **sandbox, not production**:
> the `seguimiento` Best-Practices ding, the `contacto` map render, `apuntes` Drive-image
> transfer bytes, and the live Pages header grade. Each is flagged inline and in §7.

---

## 1. Performance

**Authoritative table** — `node scripts/perf-matrix.mjs http://localhost:8099 baseline 3`
(Lighthouse 13.4.0, median of 3, gzip via `serve`). Raw JSON: [`raw/perf/`](./raw/perf/) (24 files).

| Página | Modo | LCP | CLS | TBT | FCP | Transferencia |
|---|---|---|---|---|---|---|
| Inicio | mobile | **2.64 s** | 0.000 | 0 ms | 1.66 s | 322 KB |
| Inicio | desktop | 0.77 s | 0.000 | 0 ms | 0.41 s | 475 KB |
| Gabinete (eventos) | mobile | 2.27 s | 0.026 | 0 ms | 1.82 s | 187 KB |
| Gabinete (eventos) | desktop | 0.56 s | 0.012 | 0 ms | 0.46 s | 187 KB |
| Apuntes | mobile | 2.27 s | 0.000 | 0 ms | 1.82 s | 526 KB† |
| Apuntes | desktop | 0.54 s | 0.000 | 0 ms | 0.46 s | 1721 KB† |
| Contacto | mobile | 2.27 s | 0.001 | 0 ms | 1.67 s | 189 KB |
| Contacto | desktop | 0.53 s | 0.004 | 0 ms | 0.37 s | 189 KB |

**Lighthouse category scores (single run, mobile preset)** — raw JSON: [`raw/lighthouse/`](./raw/lighthouse/),
summary [`raw/lighthouse/_scores-summary.md`](./raw/lighthouse/_scores-summary.md).

| Page | Perf | LCP | CLS | TBT |
|---|---:|---:|---:|---:|
| / | 96 | 2.72 s | 0.000 | 0 ms |
| /pages/gabinetes/eventos.html | 97 | 2.41 s | 0.026 | 0 ms |
| /pages/recursos/apuntes.html | 97 | 2.26 s | 0.000 | 0 ms |
| /pages/contacto.html | 99 | 2.12 s | 0.001 | 0 ms |
| **/pages/sobre-achetiq.html** | **76** | 2.56 s | **0.455** | 0 ms |
| /pages/recursos/seguimiento.html | 98 | 2.26 s | 0.000 | 51 ms |

**Byte baseline** — [`raw/byte-inventory.md`](./raw/byte-inventory.md):

| Asset | Raw | Gzip |
|---|---:|---:|
| `assets/css/main.bundle.css` (render-blocking) | 110,591 B | 17,805 B |
| `assets/js/seguimiento.js` (largest module) | 60,134 B | 16,055 B |
| `assets/js/loaders.js` | 36,924 B | 11,684 B |
| All 14 JS modules (concatenated) | 195,664 B | 56,688 B |

**Findings (logged for `03-performance.md`, not fixed here):**
- **`sobre-achetiq.html` CLS = 0.455 (Perf 76)** — by far the worst metric in the set; well above
  the 0.1 target. Single-run, mobile; Lighthouse did not isolate culprit nodes, and the page is
  **not** in the median perf-matrix set. **Top perf finding — re-measure with median-of-3 in 03**
  to confirm before treating as definitive.
- **`Inicio` mobile LCP 2.64 s** (perf-matrix) / **2.72 s** (single run) — over the **< 2.5 s**
  target on mobile. The LCP is the hero slideshow background injected by `hero-carrousel.js`.
- Single ~110 KB (17.8 KB gz) **render-blocking** CSS bundle; `seguimiento.js` ~60 KB. No enforced
  byte budget yet (reconcile with `RENDIMIENTO_Presupuesto.md`).
- † **`Apuntes` transfer (526 KB / 1721 KB) is unreliable** — cover images load from Google Drive,
  which the sandbox blocks; these bytes reflect sandbox behavior, not production. Re-measure off-sandbox.

---

## 2. SEO

**Lighthouse SEO = 100 on all 6 pages** (`--only-categories=seo`; captured inside the combined
runs in [`raw/lighthouse/`](./raw/lighthouse/)). **Structural "before" snapshot** —
[`raw/seo-before-snapshot.md`](./raw/seo-before-snapshot.md):

| Feature | Present today |
|---|---|
| `robots.txt` | ❌ **absent** |
| `sitemap.xml` | ❌ **absent** |
| `rel="canonical"` | ❌ **0 / 11 HTML files** |
| JSON-LD (`application/ld+json`) | ❌ **0 / 11 HTML files** |
| `<meta name="robots">` | 1 / 11 (only `404.html` → `noindex,follow`, intentional) |
| `<meta name="description">` | ✅ site-wide |
| Open Graph (`og:*`) | ✅ site-wide (injected by `build-urls.mjs`) |
| Twitter Card | ✅ site-wide |
| `<html lang="es-AR">` | ✅ site-wide |

**Key nuance (why 100 and gaps coexist):** Lighthouse's *scored* SEO audits do **not** penalize a
*missing* canonical tag or an absent `sitemap.xml`/`robots.txt`, so the 100 is real **and** the four
structural gaps are real. This is exactly why the structural snapshot is captured separately.

**Findings (logged for `01-seo.md`):** add `robots.txt`, `sitemap.xml`, per-page `canonical`
(via a `build-urls.mjs`-style injection reading `BASE_URL`), and JSON-LD
`EducationalOrganization`/`Organization`. These are the "before = zero" deltas.

---

## 3. Accessibility

**axe-core (WCAG 2.0/2.1/2.2, levels A + AA) — 0 violations on all 6 pages.** Runner:
[`axe-run.mjs`](./axe-run.mjs); raw per-page JSON + `_summary.json` in [`raw/axe/`](./raw/axe/).

| Page | Critical | Serious | Moderate | Minor | Total rules |
|---|---:|---:|---:|---:|---:|
| / | 0 | 0 | 0 | 0 | **0** |
| /pages/gabinetes/eventos.html | 0 | 0 | 0 | 0 | **0** |
| /pages/recursos/apuntes.html | 0 | 0 | 0 | 0 | **0** |
| /pages/contacto.html | 0 | 0 | 0 | 0 | **0** |
| /pages/sobre-achetiq.html | 0 | 0 | 0 | 0 | **0** |
| /pages/recursos/seguimiento.html | 0 | 0 | 0 | 0 | **0** |

**Lighthouse Accessibility = 100 on all 6 pages** (see [`raw/lighthouse/_scores-summary.md`](./raw/lighthouse/_scores-summary.md)).

**Keyboard pass (semi-automated, Playwright-driven Tab)** — [`raw/keyboard-pass.md`](./raw/keyboard-pass.md),
raw [`raw/axe/keyboard-pass.json`](./raw/axe/keyboard-pass.json):
- ✅ Skip link (`"Saltar al contenido principal"`) is the **first** focus stop on every page.
- ✅ Every probed focus stop shows a **visible focus indicator** (outline / box-shadow).
- ✅ Tab order is logical (skip → logo → nav …).
- Widget code inspection: `navbar.js` and `seguimiento.js` have rich keyboard handling (Escape,
  arrows, focus management); the hero slideshow is correctly decorative (`aria-hidden`, no controls).

**Findings (logged for `02-accessibility.md`, verify-don't-rebuild):**
- **Easter-egg overlay** (`easter-egg.js`): no `Escape`/key handler seen in source — confirm
  focus-trap + Esc-to-close for the modal.
- **`sobre-achetiq.js`** custom widget(s): confirm keyboard operability.
- **Limits:** axe automation covers ~30–50 % of WCAG; a **screen-reader (NVDA/VoiceOver) pass** and
  contrast-vs-OKLCH-tokens re-verification are **not** done here (see §7).

---

## 4. Security

**`npm audit` — 0 vulnerabilities** (`package.json` had zero deps; audited via a temp lockfile —
[`raw/npm-audit.txt`](./raw/npm-audit.txt)). **HTTP headers** — [`raw/headers/local-headers.txt`](./raw/headers/local-headers.txt).
**Read-only inventory** — [`raw/security-inventory.md`](./raw/security-inventory.md).

| Control | Baseline state |
|---|---|
| Content-Security-Policy | ❌ **none** (no `<meta http-equiv>`, no header) on any page |
| Security headers (HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy) | ❌ none on local `serve` |
| `npm audit` | ✅ 0 vulnerabilities (0 npm deps) |
| Subresource Integrity (SRI) | ⚠️ **1 external script without SRI** |
| iframe hardening | ⚠️ 1 iframe **without `sandbox`** |
| innerHTML / injection sinks | ✅ 6 sinks, all assign **static in-code SVG/HTML** (no user/network data) |
| `safeHref()` URL gate | ✅ http/https-only allow-list (`loaders.js:181`) |
| Secrets / auth / analytics | ✅ none (`.env`, auth, trackers all absent) |

**Findings (logged for `04-security.md`):**
- **No CSP.** Add a Pages-compatible `<meta http-equiv="Content-Security-Policy">` subset + a
  portable `_headers` file (Pages cannot set HTTP headers — see §7).
- **`xlsx-populate@1.21.0` from `cdnjs` (seguimiento.html:312) has no `integrity`/`crossorigin`** →
  supply-chain exposure. Add SRI or self-host.
- **Google Maps iframe (contacto.html:182) has no `sandbox`** attribute (it does set `loading`,
  `referrerpolicy`, `title`). Evaluate `sandbox` / CSP `frame-src`.
- `innerHTML` sinks are read-only-safe today but should be **verified, not assumed**, in 04.

---

## 5. Link integrity

linkinator 7.6.1, as-run, is **not usable** on this site (static parser can't run the client-side
base-path resolver → 47,311 false 404s, and crashed `serve` via EMFILE). Details + how to enable:
[`raw/linkinator-NOTE.md`](./raw/linkinator-NOTE.md). In the meantime, first-party link/resource
integrity is asserted from the 6 Lighthouse + 6 axe browser runs (every page and its first-party
resources loaded without 404s; only the sandbox-blocked external origins failed).

---

## 6. Files added by this run

- **`prompts/optimization/baseline/`** — this `SUMMARY.md`, the `axe-run.mjs` runner, and all
  `raw/` outputs (24 perf JSON, 6 Lighthouse JSON, 6 axe JSON + summary, keyboard-pass, byte
  inventory, headers, npm-audit, security inventory, SEO snapshot, linkinator note).
- **`reports/README.md`** — empty sibling for the later passes' "after" numbers.
- **`package.json` + `package-lock.json`** — **one new devDependency, `@axe-core/playwright@^4.10.2`**
  (the a11y harness the repo previously lacked). No runtime/application dependency was added;
  `node_modules/` stays gitignored. **No application code was touched.**

---

## 7. Cannot measure yet

Honest gaps — each with the reason and the prompt/tool that enables it. **No values estimated.**

| Metric / artifact | Why it can't be captured now | Enable via |
|---|---|---|
| **Deployed GitHub Pages header grade** | Sandbox network policy denies the Pages origin (proxy **403** to CONNECT, `ingqcautnfrre-lab.github.io:443`). Raw: [`raw/headers/pages-headers-BLOCKED.txt`](./raw/headers/pages-headers-BLOCKED.txt). | `04-security.md` — `curl -sI` from an unrestricted network or in CI against the live deploy. |
| **Field / real-user INP, LCP, CLS (CrUX)** | No field data source available in-sandbox; lab Lighthouse only. INP needs real interactions. | `06-ci-integration.md` (CrUX/PSI API) or RUM if ever added. |
| **`seguimiento` true Best-Practices score** | Measured 96 only because `cdnjs` (xlsx-populate) is sandbox-blocked → `errors-in-console`. Real prod loads it. | Re-run `lighthouse` off-sandbox; the **SRI gap** is the real action (04). |
| **`apuntes` real transfer bytes** | Cover images served from Google Drive (sandbox-blocked). | Re-measure off-sandbox (03). |
| **`contacto` map render / full transfer** | Google Maps iframe origin blocked in-sandbox. | Re-measure off-sandbox (03/04). |
| **`sobre-achetiq` CLS culprit nodes** | Single run flagged CLS 0.455 but Lighthouse isolated no nodes; page not in median set. | `03-performance.md` — median-of-3 + `scripts/shoot.mjs` region heights. |
| **Screen-reader / AT pass** | No NVDA/VoiceOver in this environment; axe automates only ~30–50 % of WCAG. | `02-accessibility.md` — manual AT pass. |
| **Contrast vs OKLCH tokens** | Not computed in this run (axe found 0 contrast violations, but token-level audit not done). | `02-accessibility.md` — contrast audit vs `tokens.css`. |
| **Broken-link crawl** | linkinator incompatible with client-side base-path resolution (§5). | `06-ci` — browser-mode crawl or crawl the built output. |

---

## 8. How to reproduce / re-run for "after"

```bash
# serve with gzip
npx --yes serve -l 8099 .

# performance (authoritative, median-of-3, 4 reference pages, mobile+desktop)
CHROME_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome \
  node scripts/perf-matrix.mjs http://localhost:8099 after 3

# per-page Lighthouse (perf+seo+a11y+best-practices), 6 pages
CHROME_PATH=… npx --yes lighthouse <url> \
  --only-categories=performance,seo,accessibility,best-practices \
  --output=json --output-path=<out>.json --quiet

# accessibility (axe, 6 pages)
NODE_PATH=/opt/node22/lib/node_modules \
  node prompts/optimization/baseline/axe-run.mjs http://localhost:8099 <outDir>

# security
curl -sI http://localhost:8099/                 # local headers
npm i --package-lock-only && npm audit           # dependency audit
```
