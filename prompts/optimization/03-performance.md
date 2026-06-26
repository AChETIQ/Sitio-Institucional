# 03 — Performance Pass (AChETIQ, Core Web Vitals on GitHub Pages)

> Paste everything below the line into Claude Code at the repo root. Self-contained.
> Read `00-index.md` first. Reconcile every target with `RENDIMIENTO_Presupuesto.md`.

---

You are a senior runtime-performance engineer. Improve this static site's **Core Web
Vitals** and enforce a **byte budget**, without a bundler and without changing the
GitHub-Pages delivery model.

## 1. Objective
**Lighthouse Performance ≥ 95 (mobile)** on the 4 reference pages, with **LCP < 2.5 s**,
**INP < 200 ms**, **CLS < 0.1**, and a **defined, enforced JS + CSS byte budget** — each
gain proven by a `perf-matrix.mjs` before/after delta.

## 2. Scope
**In scope:** `assets/css/` (the ~110 KB `main.bundle.css` + its 25 source sheets and
`scripts/build-css.mjs`), `assets/js/*.js` (load strategy + heavy modules, esp.
`seguimiento.js` ~60 KB), image markup in the HTML, font preloads, and the Google Maps
`<iframe>` on `contacto.html`.
**Out of scope:** SEO (`01`), a11y (`02`), security headers (`04`), visual redesign, and
moving off GitHub Pages. **Note:** GitHub Pages already serves Brotli/gzip — measure with
compression on; do not add a build step that re-compresses.

## 3. Preconditions (measure first)
1. Confirm the perf baseline exists (`05-baseline-audit.md`). If not, run it first.
2. Capture the lab matrix (median of ≥ 2 runs, both form factors):
   ```
   npx --yes serve -l 8099 .        # or python3 -m http.server 8099
   CHROME_PATH=$(which chromium || which chrome) node scripts/perf-matrix.mjs http://localhost:8099 before 3
   ```
   Save the Markdown table as the "before".
3. Record current weights: `du -b assets/css/main.bundle.css`, per-file `assets/js/*.js`
   sizes, and the LCP element per page (from the Lighthouse JSON `largest-contentful-paint` trace).
4. Read `scripts/build-css.mjs` so any CSS-splitting change stays compatible with the bundling step.

## 4. Methodology (mandatory loop)
**Measure → Diagnose → Implement → Verify → Document.** Per change: identify the failing
metric and its cause from the Lighthouse trace (Measure/Diagnose), apply the smallest
fix (Implement), re-run `perf-matrix.mjs` with the same `runs` count (Verify), and append
the before/after row (Document). A change that does not move a metric gets reverted.

## 5. Stack-specific guidance
- **CSS critical path (biggest lever):** the single ~110 KB render-blocking
  `main.bundle.css` likely contains far more than any one page needs. Options, in order
  of preference: (a) extract **critical/above-the-fold CSS** inline in `<head>` and load
  the rest non-blocking (`media="print"`/`onload` swap or `rel="preload" as="style"`);
  (b) split the bundle per page-type so each page ships only its sheets; (c) prune unused
  rules. Implement via `build-css.mjs` so it stays a deterministic build artifact — do
  **not** hand-edit `main.bundle.css`.
- **JS (no bundler — reason in ES modules):** `seguimiento.js` (~60 KB) loads on a
  single page; confirm it is **only** requested there and ship it `defer`/`type=module`.
  Move heavy/below-the-fold widgets (easter-egg, carousel, scroll-reveal) to
  **conditional/lazy** loading via dynamic `import()` on interaction or
  `IntersectionObserver`, keeping them off the critical path. Verify `modulepreload` is
  used only for genuinely critical modules (`main.js`, `loaders.js`).
- **Images (replaces `next/image`):** the hero already uses WebP + `srcset`/`sizes` +
  `fetchpriority="high"` preload; below-the-fold images use `loading="lazy"` +
  explicit `width`/`height`. **Audit for:** the LCP image having `fetchpriority="high"`
  and **no** `loading="lazy"`; every `<img>` (incl. JSON-rendered ones via
  `loaders.js`) having intrinsic dimensions to keep CLS < 0.1; correct `sizes` so mobile
  doesn't fetch the 1920w variant.
- **Fonts (replaces `next/font`):** self-hosted WOFF2 with `font-display:swap` and
  fallback metric overrides already exist. Verify only the **fonts needed above the
  fold** are preloaded with `fetchpriority="high"` (currently Fraunces display + Hanken
  body), that subsets are Latin-only, and that fallback `size-adjust` keeps CLS at ~0.
- **Third-party:** the Google Maps `<iframe>` is `loading="lazy"` — confirm it is fully
  below the fold and consider a click-to-load facade so it never touches LCP/INP on
  `contacto.html`. There is no analytics/GTM to defer.
- **INP:** profile the heaviest interactions (navbar open, seguimiento table sort/filter,
  apuntes filter). Break up long tasks, debounce input handlers, and avoid layout
  thrash in `seguimiento.js`.

## 6. Tooling
- `node scripts/perf-matrix.mjs <baseURL> <label> <runs>` — primary CWV/transfer measurement (Lighthouse, mobile+desktop, median).
- `npx --yes lighthouse … --only-categories=performance` for single-page deep dives + traces.
- `scripts/shoot.mjs` for CLS region-height verification of injected content.
- Coverage for unused CSS/JS: Chrome DevTools Coverage tab, or `npx --yes lighthouse` "unused-css-rules"/"unused-javascript" audits.
- Byte accounting: `du -b` / a small node script over `assets/{css,js}`.

## 7. Acceptance criteria
- Lighthouse **Performance ≥ 95 (mobile)** on all 4 reference pages.
- **LCP < 2.5 s**, **CLS < 0.1** (lab) on all 4; **INP < 200 ms** for the profiled interactions.
- Defined **byte budget** (e.g. critical CSS ≤ X KB, per-page JS ≤ Y KB) documented and **not exceeded**; reconciled with `RENDIMIENTO_Presupuesto.md`.
- Render-blocking CSS reduced vs. baseline (state the KB delta); no metric regressed elsewhere.

## 8. Output expectations
Small, atomic commits ("perf: inline critical CSS for home", "perf: lazy-load
easter-egg module"). Report at `prompts/optimization/reports/performance.md` with the
full `perf-matrix.mjs` before/after table, the byte-budget table, and per-change
rationale. No mass refactor of working modules.

## 9. Guardrails
- **Do not** introduce a bundler/framework or break `npm run build` (`build:css` + `build:urls`); CSS output must stay a deterministic artifact.
- **Do not** lazy-load anything required for first paint or for the LCP element.
- **State trade-offs** explicitly (e.g. critical-CSS inlining increases HTML size and
  must be regenerated on style changes; per-page CSS split adds build complexity).
- Verify every page still renders identically (use `scripts/shoot.mjs` screenshots) —
  a faster page that looks broken fails the pass.
- Keep changes reversible and measured; revert anything with no metric benefit.
