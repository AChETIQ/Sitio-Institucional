# Performance pass — AChETIQ (Core Web Vitals on GitHub Pages)

**Pillar:** `03-performance.md` · **Date:** 2026-06-27 · **Stack:** hand-authored
static HTML + vanilla ES-module JS + custom-CSS OKLCH design tokens, served from
GitHub Pages (Brotli/gzip on, no build pipeline). **Baseline:**
[`../baseline/SUMMARY.md`](../baseline/SUMMARY.md) §1.

> **One-line posture:** the four reference pages already passed (Lighthouse Perf
> 96–99, CLS < 0.1, TBT 0), so this pass went after the two real defects the
> baseline flagged and the budget that was never enforced. It **kills the worst
> metric on the site** — `sobre-achetiq` CLS **0.455 → 0.001** (Perf **77 → 97**)
> by reserving space for six fetch-injected regions — **removes 190 KB of gzip
> from every `seguimiento` visit** (transfer **382 → 192 KB**, TBT **110 → 45 ms**)
> by lazy-loading the Excel library on demand, and **adds a byte-budget gate**
> (`perf-budget.mjs`) so neither regresses silently. Nothing that already met
> budget was churned: changes with no provable metric gain were deliberately not
> made, and the reasons are documented.

---

## 1. Method & harness (measure → diagnose → implement → verify → document)

Authoritative measurement is `scripts/perf-matrix.mjs` (Lighthouse 13.4.0,
Chromium 141 headless, **median of 3**, mobile + desktop, served **with gzip** via
`npx serve` — compression-representative of Pages), reproducing the baseline
harness exactly (`CHROME_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome`).
The two pages outside the 4-page matrix (`sobre-achetiq`, `seguimiento`) were
measured with the same Lighthouse invocation, median of 3. CLS reservations were
sized with `scripts/shoot.mjs` (Playwright region heights) and byte weights with
`scripts/perf-budget.mjs` (gzip -9).

**Measurement-noise caveat (governs what is claimed).** This sandbox's lab LCP/FCP
are noisy: the same unchanged home page measured **2.64 s** (baseline) and
**2.91 s** (this run's "before") — a ±0.3 s swing. CLS, TBT, transfer bytes and
the byte budget are deterministic and stable. So every claim below rests on a
**deterministic** metric or a **controlled same-session** before/after; no
sub-0.2 s LCP "win" is asserted, because it could not be proven against that noise
floor (see §5).

---

## 2. Reference-page matrix — before → after (no regression)

Median of 3, gzip, mobile + desktop. Both changes are page-scoped
(`#panel-asociacion` and `seguimiento` only), so the four reference pages are
functionally untouched; this table documents that they did not regress.

**Before**

| Página | Modo | LCP | CLS | TBT | FCP | Transferencia |
|---|---|---|---|---|---|---|
| Inicio | mobile | 2.91 s | 0.000 | 0 ms | 1.66 s | 321 KB |
| Inicio | desktop | 0.80 s | 0.000 | 0 ms | 0.41 s | 474 KB |
| Gabinete (eventos) | mobile | 2.42 s | 0.026 | 0 ms | 1.82 s | 174 KB |
| Gabinete (eventos) | desktop | 0.65 s | 0.007 | 0 ms | 0.45 s | 174 KB |
| Apuntes | mobile | 2.27 s | 0.000 | 0 ms | 1.82 s | 512 KB† |
| Apuntes | desktop | 0.61 s | 0.000 | 0 ms | 0.45 s | 1708 KB† |
| Contacto | mobile | 2.11 s | 0.001 | 0 ms | 1.66 s | 176 KB |
| Contacto | desktop | 0.62 s | 0.003 | 0 ms | 0.46 s | 176 KB |

**After**

| Página | Modo | LCP | CLS | TBT | FCP | Transferencia |
|---|---|---|---|---|---|---|
| Inicio | mobile | 2.71 s | 0.000 | 0 ms | 1.66 s | 321 KB |
| Inicio | desktop | 0.80 s | 0.000 | 0 ms | 0.41 s | 474 KB |
| Gabinete (eventos) | mobile | 2.41 s | 0.026 | 0 ms | 1.81 s | 174 KB |
| Gabinete (eventos) | desktop | 0.65 s | 0.011 | 0 ms | 0.45 s | 174 KB |
| Apuntes | mobile | 2.26 s | 0.000 | 0 ms | 1.81 s | 513 KB† |
| Apuntes | desktop | 0.61 s | 0.000 | 0 ms | 0.45 s | 1708 KB† |
| Contacto | mobile | 2.12 s | 0.001 | 0 ms | 1.66 s | 176 KB |
| Contacto | desktop | 0.61 s | 0.003 | 0 ms | 0.45 s | 176 KB |

† `Apuntes` transfer is dominated by Google-Drive cover images the sandbox blocks
(baseline §1 note); the figure reflects the sandbox, not production, and is not a
target here.

Reading: CLS stays ≤ 0.026 and TBT 0 on every reference page, before and after.
LCP wobbles within the documented noise band (Inicio mobile remains the budget's
sole > 2.5 s exception, §5). **No structural regression.**

---

## 3. Change 1 — `sobre-achetiq` CLS 0.455 → 0.001 (the worst metric on the site)

**Measure.** Baseline flagged `sobre-achetiq` at CLS **0.455 / Perf 76** (single
run) as the top finding, "re-measure with median-of-3 to confirm." Reproduced
here at **CLS 0.455 / Perf 77** — confirmed, deterministic.

**Diagnose.** The page stacks **six** fetch-injected regions inside
`#panel-asociacion`: `historia` (timeline), `mision-vision`, `valores`,
`directiva`, `instituciones`, `documentos`. The `<noscript>` fallbacks inside them
do **not** render when JS is enabled, so each container is ~0 px at first paint,
then its content injects after `fetch` and shoves everything below it down. The
existing `loader.css §RESERVA` reserved floors for `recursos`/`redes`/`gabinetes`
but **never for these six** — so all of them shifted, cumulatively 0.455.

**Implement.** Added height floors in `loader.css §RESERVA`, scoped to
`#panel-asociacion` (a container that exists only on this page, so
`gabinetes.html` — which shares the `directiva` loader — is untouched). Floors
were measured with `shoot.mjs` as a value **≤ the minimum** rendered height across
360/768/1280/1920 px, so a floor never exceeds real content (no upward shift). The
timeline always exceeds one viewport (min 2943 px), so it reserves `100vh/100svh`
and pushes the five regions below it out of the first fold, where their injections
no longer score CLS.

Measured region heights (px) — 360 / 768 / 1280 / 1920, and the floor applied:

| Region | 360 | 768 | 1280 | 1920 | Floor |
|---|---:|---:|---:|---:|---:|
| historia (timeline) | 6753 | 2943 | 4328 | 3725 | `100vh` |
| mision-vision | 988 | 597 | 468 | 440 | 400 px |
| valores | 1469 | 733 | 487 | 460 | 420 px |
| directiva | 4743 | 2510 | 1103 | 1210 | 900 px |
| instituciones | 532 | 262 | 241 | 217 | 190 px |
| documentos | 469 | 241 | 161 | 161 | 140 px |

**Verify.** After the fix, `shoot.mjs` reports **identical** region heights
(6753/988/1469/4743/532/469 at 360 px) — content renders pixel-for-pixel the same;
`min-height` only adds a floor. Lighthouse:

| Métrica | Before | After (median of 3) |
|---|---:|---:|
| CLS | **0.455** | **0.001** |
| Lighthouse Perf | 77 | **97** |
| LCP | 2.40 s | 2.41 s |

The worst metric on the site is gone and the page clears the ≥ 95 bar.

**Trade-off / maintenance.** The floors are content-measured; if the copy in
`data/{historia,directiva,instituciones,documentos}.json` or `site_copy.json`
changes substantially, re-measure with `shoot.mjs` and re-floor (budget §5 rule).
The `historia` 100vh reservation shows the inline loader in a full-screen box until
the timeline lands — the same UX the `recursos` (apuntes) page already uses.

---

## 4. Change 2 — `seguimiento` lazy-loads the Excel library (−190 KB, TBT −59 %)

**Measure.** `perf-budget.mjs` showed `seguimiento.html` shipping **231.9 KB gzip**
of initial JS — an outlier ~6× every other page.

**Diagnose.** `seguimiento.html` eagerly loaded `xlsx-populate.min.js` —
**642 KB raw / 193 KB gzip** — via `<script defer>` on every visit. The library is
only needed when a user clicks *Export → Excel*. `defer` keeps it off the
render-blocking path, but every visitor still pays the ~193 KB download **and**
the JS parse/compile.

**Implement.** Load it on demand. `seguimiento.js` (`ensureXlsxPopulate`) injects
the vendor `<script>` the first time the user exports and caches the promise
(`exportXLSX` now `await`s it). It is a UMD global (`window.XlsxPopulate`), so it
loads via a `<script>` tag — not `import()`; CSP `script-src 'self'` admits the
same-origin file and **no SRI is needed** (identical to the prior self-hosted
setup). `exportXLSX` already read `window.XlsxPopulate` at call time and degraded
gracefully, so the change is small and the failure UX is preserved.

**Verify.**

- Controlled same-session Lighthouse before (eager tag restored) → after (lazy):

| Métrica | Before (eager) | After (lazy) |
|---|---:|---:|
| Initial JS (gzip, deterministic) | 231.9 KB | **41.6 KB** |
| Lighthouse transfer | 382 KB | **192 KB** |
| TBT | 110 ms | **45 ms** |
| Lighthouse Perf | 91 | **98** |
| LCP / CLS | — | 2.26 s / 0.000 |

- Functional end-to-end (Playwright): on page load the library is **absent**
  (`window.XlsxPopulate` undefined, 0 vendor requests); after the Export → Excel
  click, exactly **1** vendor request loads it and a **valid 42 KB `.xlsx`** (ZIP
  magic `PK`) downloads. The export is unchanged for the user.

**Trade-off.** The first export now incurs a one-time ~193 KB download before the
file generates; an `announce('Generando el archivo Excel…')` covers the wait for
screen-reader users. For the > 99 % of visits that never export, the page is
190 KB lighter, parses far less JS, and its TBT more than halves.

---

## 5. Evaluated and deliberately not changed (with reasons)

The guardrails require reverting anything with no provable metric benefit. These
were measured and left alone:

- **Inicio mobile LCP > 2.5 s (budget §4 exception).** The remaining gap is
  FCP-bound (critical path = render-blocking CSS + fonts; FCP ~1.7 s). The only
  real lever is **inlining critical CSS** — but the site's CSP is strict
  (`style-src 'self'`, no `'unsafe-inline'`), so an inline `<style>` would be
  blocked unless `build-csp.mjs` grew a per-block hash and the build order flipped
  (`build:csp` after `build:css`). That crosses into the **out-of-scope security
  pillar (04)** and, more decisively, the target gap (~0.1–0.4 s) sits **below
  this sandbox's LCP noise floor**, so the mandatory verify step could not prove
  it. Documented, not chased — consistent with the budget's own "v3" note.
- **Home page loads `sobre-asociacion.css` (40 KB raw) render-blocking** for a
  small `about-intro` block. Splitting it would trim render-blocking CSS on
  `index`, but (a) the gain is gzip-small and below the LCP noise floor, and
  (b) carving a shared 40 KB sheet is high-regression for an unprovable win and
  adds build complexity. Flagged as the primary future lever for the Inicio LCP
  exception.
- **`easter-egg.js` / `scroll-reveal.js` / `hero-carrousel.js`.** Already `defer`,
  page-scoped, small, and off the critical path; TBT is already 0 everywhere.
  `easter-egg.js` additionally idle-prefetches its data. Converting them to
  dynamic `import()` would add a request/bootstrap for **no** measurable CWV gain,
  so per "revert anything with no metric benefit" they were left as-is.
- **`seguimiento.js` itself (~60 KB).** Confirmed it is requested **only** on
  `seguimiento.html`, shipped `type="module"`. The heavy weight on that page was
  the vendor library, now lazy (§4).

---

## 6. Byte budget (defined, enforced, reconciled)

`scripts/perf-budget.mjs` is a dependency-free gate: per page it sums the gzip
weight of render-blocking CSS (`<link rel=stylesheet>`) and initial JS
(`<script src>` + the `modulepreload` graph), and exits non-zero if a threshold is
exceeded. It runs locally and is intended as a CI gate (pillar 06).

**Thresholds** (reconciled with `RENDIMIENTO_Presupuesto.md` §1):

| Budget | Threshold (gzip) | Source |
|---|---|---|
| Render-blocking CSS / page | ≤ 75 KB | RENDIMIENTO_Presupuesto §1 (CSS total) |
| Initial JS / page | ≤ 50 KB | **new (S03)** — headroom over worst real case |
| Page transfer (Lighthouse) | < 500 KB | RENDIMIENTO_Presupuesto §1 |

**State after this pass** (`node scripts/perf-budget.mjs`):

| Página | CSS gzip | JS gzip | Estado |
|---|---:|---:|---|
| 404.html | 20.3 KB | 13.4 KB | ✅ |
| index.html | 28.6 KB | 33.9 KB | ✅ |
| pages/contacto.html | 17.7 KB | 29.7 KB | ✅ |
| pages/gabinetes/cursos-y-conferencias.html | 17.7 KB | 26.6 KB | ✅ |
| pages/gabinetes/eventos.html | 17.7 KB | 26.6 KB | ✅ |
| pages/gabinetes/prensa-y-difusion.html | 17.7 KB | 26.6 KB | ✅ |
| pages/gabinetes/solidario.html | 17.7 KB | 26.6 KB | ✅ |
| pages/gabinetes.html | 17.7 KB | 27.5 KB | ✅ |
| pages/recursos/apuntes.html | 17.7 KB | 28.8 KB | ✅ |
| pages/recursos/seguimiento.html | 17.7 KB | **41.6 KB** | ✅ (was 231.9 KB) |
| pages/recursos.html | 17.7 KB | 30.4 KB | ✅ |
| pages/sobre-achetiq.html | 28.6 KB | 30.0 KB | ✅ |

Render-blocking CSS bundle: **17.6 KB gzip** (110 KB raw) — the CLS fix added
~0.2 KB. `index`/`sobre-achetiq` show 28.6 KB because they also link
`sobre-asociacion.css` (§5). All pages **well under** budget; the `seguimiento`
outlier is gone.

---

## 7. Guardrails honored

- **No bundler/framework introduced; `npm run build` unbroken** — verified
  (`build:urls → jsonld → csp → css → seo` all green, idempotent: 0 spurious HTML
  changes). The CSS bundle stays a deterministic generated artifact (edited via
  `loader.css` + `build:css`, never by hand).
- **Nothing required for first paint or the LCP element was lazy-loaded** — only
  the on-export Excel library and below-the-fold reservation floors.
- **Trade-offs stated** (critical-CSS-vs-CSP, content-measured floors, first-export
  cost) — §3–§5.
- **Renders identically** — `shoot.mjs` heights unchanged on `sobre-achetiq`;
  `seguimiento` export verified end-to-end.
- **Reversible & measured** — small atomic commits; deterministic or controlled
  before/after verification for every claim.

---

## 8. Reproduce

```bash
npx --yes serve -l 8099 .                                  # gzip, like Pages
export CHROME_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome
node scripts/perf-matrix.mjs http://localhost:8099 after 3 # 4 ref pages
node scripts/perf-budget.mjs                               # byte gate
# CLS reservation heights (Playwright):
node scripts/shoot.mjs http://localhost:8099/pages/sobre-achetiq.html - 360 \
  '[data-loader="historia"],[data-copy="valores"],[data-loader="directiva"]'
```
