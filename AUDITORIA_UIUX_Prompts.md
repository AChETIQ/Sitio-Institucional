# AUDITORÍA UI/UX — Prompts de ejecución para Claude Code

> Seis prompts autocontenidos, uno por dominio del frontend, para ejecutar en **sesiones aisladas de Claude Code** según la hoja de ruta de `AUDITORIA_UIUX_Plan.md`. Copiar el prompt completo (desde «You are a senior…» hasta el final de su bloque) en una sesión nueva. **Respetar el orden S1 → S6**: cada sesión asume fusionadas las anteriores.
>
> Los prompts están redactados en inglés por decisión de la directiva; el sitio y sus commits permanecen en español.

---

## Sesión 1 — Typography & Color Systems

```text
You are a senior design engineer performing a foundational redesign of the typography and color systems of a production static website. You have a bold-redesign mandate: you may propose a new palette and new typographic treatment — the goal is a distinctive, enterprise-grade visual identity, not a cosmetic refresh. Everything you produce must remain framework-free.

## Repository context
- Static site, Spanish (es-AR), deployed to GitHub Pages. Stack is non-negotiable: semantic HTML5, pure CSS with design tokens + BEM, vanilla ES-module JS. No frameworks, no preprocessors, no static-site generators, no CDNs.
- `tokens.css` (repo root, ~548 lines) is the single source of truth for all visual values. Hard project rule: no hex colors or font names anywhere outside it (sole legacy exception: a local level palette in `assets/css/seguimiento.css`).
- 18 BEM stylesheets under `assets/css/`, loaded via `@import` chain in `assets/css/main.css`. Fonts are self-hosted woff2 in `assets/fonts/`.
- Pages: `index.html`, `pages/sobre-achetiq.html`, `pages/gabinetes.html`, `pages/gabinetes/*.html` (4), `pages/recursos.html`, `pages/recursos/apuntes.html`, `pages/recursos/seguimiento.html`, `pages/contacto.html`, `404.html`.
- Content is injected at runtime by a data-loader engine (`assets/js/main.js`, `assets/js/loaders.js`) from `data/*.json` — do not modify this engine or any JSON content.
- Design system documentation lives in `FASE_1_Catalogo_Componentes.md` and `INSTRUCCION_PROYECTO.md` (read both before designing).

## Current state (verified findings)
- Current palette "Océano & Areia": warm cream background `#F5F2EC`, deep blue primary `#0D3B66`, terracotta CTA `#C8551C`. Functional but conservative.
- Type scale is absolute px (no rem, no clamp()): `--text-display` 48px down to `--text-eyebrow` 10.5px. The 48px H1 does not scale down on 360–414px phones.
- Fonts: Instrument Serif 400 (+italic) for display, Geist for body — but Geist is only loaded at weight 400, so the `--weight-medium: 500` token renders as browser-synthesized faux weight. `--font-mono: 'Geist Mono'` has NO font file at all and silently falls back to Courier New.
- No dark mode. Contrast ratios are documented in tokens.css comments (keep this practice).

## Tasks
1. Analyze: read `tokens.css`, `assets/css/main.css` (@font-face + base styles), `FASE_1_Catalogo_Componentes.md`, and skim all 18 stylesheets to map every consumer of color and type tokens.
2. Propose: write a concise design rationale (this becomes the top of your PR description) covering: chosen palette with semantic roles, typeface strategy (keep/replace Instrument Serif + Geist — your call, justify it), fluid type scale, and migration impact. Then implement it in the same session.
3. Rebuild the color system in `tokens.css` with a three-layer architecture: primitives (raw scale, defined in OKLCH with sRGB hex fallbacks) → semantic tokens (`--color-surface`, `--color-text`, `--color-accent`, …) → component aliases where needed. Document the WCAG contrast ratio of every text/background pair in comments, as the current file does. All combinations must meet WCAG 2.2 AA; body text should target AAA.
4. Rebuild the type scale as fluid: rem-based with `clamp()` (e.g., display ≈ clamp(2rem, 5vw + 1rem, 3.5rem)), a modular ratio of your choice, and a 1rem minimum for body text. Keep tokens for line-height and letter-spacing tiers.
5. Fix the font-loading defects: self-host real woff2 files for every weight you use (no synthesized weights), and either self-host a real mono font or remove the mono token and its consumers. Subset/woff2 only, `font-display: swap` preserved.
6. Migrate all 18 stylesheets in `assets/css/` plus `tokens.css` component rules to the new tokens. Zero orphan hex values or px font sizes outside tokens when you finish (grep to prove it). The `seguimiento.css` local palette must be either migrated into the new system or re-derived from the new primitives — do not leave stale hexes.
7. Add prose measure: body text blocks capped at a readable measure (~65ch) via a token.
8. Update `FASE_1_Catalogo_Componentes.md` sections for tokens/typography/color to reflect the new system.

## Hard constraints / out of scope
- Do NOT touch: JS files, JSON data, HTML structure (beyond `<link>`/`<style>` references if strictly needed), Spanish copy, focus styles (a later accessibility session owns those), motion/easing tokens (a later animation session owns those), media-query breakpoints structure (a later responsive session owns layout).
- Keep BEM naming and the existing file organization. Keep `prefers-reduced-motion` handling untouched.

## Verification & deliverables
- Serve locally (`python3 -m http.server 8000` from repo root) and visually verify every page listed above at 375px and 1280px widths.
- `grep -rn "#[0-9a-fA-F]\{3,8\}" assets/css/ | grep -v tokens` style checks must come back clean (document the commands you ran).
- Commit in Spanish imperative style (e.g., «Rediseñar sistema de tokens de tipografía y color»), on a new branch `design/s1-tipografia-color`, and open a PR whose description starts with your design rationale from task 2.
```

---

## Sesión 2 — Component Hierarchy & Layout

```text
You are a senior design engineer auditing and refactoring the component hierarchy and layout system of a production static website. The foundational typography/color redesign (session S1) has already been merged: `tokens.css` is the single source of truth and is up to date — consume it, never bypass it. Your goal is an enterprise-grade sense of structure: clear visual hierarchy, consistent rhythm, and purposeful density.

## Repository context
- Static site, Spanish (es-AR), GitHub Pages. Non-negotiable stack: semantic HTML5, pure CSS with design tokens + BEM, vanilla ES-module JS. No frameworks, no preprocessors, no CDNs.
- `tokens.css` (repo root) defines all colors, type, spacing (4px scale), radii, z-index. No hardcoded visual values outside it.
- 18 BEM stylesheets under `assets/css/` (notably `cards.css`, `lists.css`, `headers.css`, `navbar.css`, `footer.css`, `cta.css`, `sobre-asociacion.css`), imported by `assets/css/main.css`.
- Pages: `index.html`, `pages/sobre-achetiq.html`, `pages/gabinetes.html`, `pages/gabinetes/*.html` (4 detail pages), `pages/recursos.html`, `pages/recursos/apuntes.html`, `pages/recursos/seguimiento.html`, `pages/contacto.html`, `404.html`.
- Content is rendered by a data-loader engine (`assets/js/main.js` scans `[data-loader]`, `assets/js/loaders.js` holds renderers using safe `createElement`/`safeHref` helpers — never `innerHTML` on data). You may adjust the DOM structure a renderer emits, but not the engine, the security helpers, or `data/*.json` schemas.
- Component spec: `FASE_1_Catalogo_Componentes.md` (23+ components in 11 categories). It documents breadcrumbs that were designed but never deployed.

## Current state (verified findings)
- 7+ card variants (`.card-gabinete`, `.card-integrante`, `.card-materia`, …) share a `.card` base; grids via `.grid-cards--2/3/4`. Consistent but flat: no elevation system, uniform visual weight, weak hierarchy between primary and secondary content.
- Section rhythm relies on a single `--section-gap` (64px); inner spacing varies ad hoc per component.
- Breadcrumbs are specified in the catalog but absent from all detail pages (`pages/gabinetes/*.html`, `pages/recursos/*.html`).
- No depth/shadow tokens exist. Radius tokens exist (4/6/10/14/999).
- Hero, page-header, and section-title patterns live in `headers.css` and `sobre-asociacion.css` with some duplication.

## Tasks
1. Analyze: read `FASE_1_Catalogo_Componentes.md`, then audit every page against it. Produce a reconciliation table (component spec'd vs implemented vs drifted) — include it in your PR description together with your design decisions.
2. Design and tokenize an elevation system in `tokens.css` (e.g., `--shadow-1..4` plus a border-based "flat elevation" alternative consistent with the S1 palette) and apply it deliberately: interactive cards get hover elevation; static panels stay flat.
3. Establish vertical rhythm: a documented spacing contract (section padding, header-to-content gap, card internal padding) built on the existing 4px-scale tokens, applied consistently across `headers.css`, `cards.css`, `lists.css`, `cta.css`, and `sobre-asociacion.css`. Deduplicate the header patterns shared by `headers.css` and `sobre-asociacion.css`.
4. Strengthen hierarchy on the homepage and hub pages: one clear primary action per viewport, secondary actions visually subordinate (use the S1 semantic tokens; do not invent colors).
5. Implement and deploy breadcrumbs per the catalog spec on all detail pages (`pages/gabinetes/*.html`, `pages/recursos/apuntes.html`, `pages/recursos/seguimiento.html`), with proper `<nav aria-label>` + `<ol>` markup, BEM classes in `assets/css/nav-secondary.css`.
6. Modernize the grid layer where it pays off: use `gap`, `grid-template-columns: repeat(auto-fit, minmax(...))` for card grids where fixed counts aren't semantically required, and CSS subgrid for aligning card internals (title/body/footer rows) with a graceful fallback.
7. Apply the prose measure token from S1 to all long-form text blocks if any page still lacks it.
8. Update `FASE_1_Catalogo_Componentes.md`: new elevation tokens, spacing contract, breadcrumb status, any component you changed.

## Hard constraints / out of scope
- Do NOT touch: color/type token values (S1 owns them — extend only with shadow/spacing aliases), media-query breakpoints and per-viewport behavior (session S3 owns responsive), focus styles and ARIA beyond the breadcrumb nav semantics (session S4 owns a11y), transitions/animations beyond moving existing values to tokens (session S5 owns motion), the data-loader engine and JSON files, Spanish copy.
- Keep BEM naming, file organization, and the `@import` list in `main.css` (performance session S6 owns loading strategy).

## Verification & deliverables
- Serve locally (`python3 -m http.server 8000`) and review every page at 375px and 1280px; confirm breadcrumbs render on all detail pages and grids align with subgrid fallback (test by toggling subgrid off in DevTools).
- Confirm zero new hardcoded visual values: grep for hex/px additions outside `tokens.css`.
- Commit in Spanish imperative style (e.g., «Refinar jerarquía de componentes y desplegar breadcrumbs»), branch `design/s2-componentes-layout`, PR description starting with the reconciliation table and design rationale.
```

---

## Sesión 3 — Responsive Behavior

```text
You are a senior design engineer auditing and upgrading the responsive behavior of a production static website. Sessions S1 (fluid type/color tokens) and S2 (component hierarchy, elevation, breadcrumbs) are already merged — build on their tokens and components. Your goal: every page feels intentionally designed at every width from 360px to 1480px+, with no breakage and no wasted space.

## Repository context
- Static site, Spanish (es-AR), GitHub Pages. Non-negotiable stack: semantic HTML5, pure CSS tokens + BEM, vanilla JS. No frameworks, no preprocessors, no CDNs.
- `tokens.css` (repo root): single source of truth (fluid type via clamp(), 4px spacing scale, breakpoint reference values 640/768/1024/1280/1480).
- 18 BEM stylesheets in `assets/css/` imported by `assets/css/main.css`. Approach is mobile-first (`@media (min-width: …)`).
- Pages: `index.html`, `pages/sobre-achetiq.html`, `pages/gabinetes.html`, `pages/gabinetes/*.html` (4), `pages/recursos.html`, `pages/recursos/apuntes.html`, `pages/recursos/seguimiento.html`, `pages/contacto.html`, `404.html`.
- Content injected by a data-loader engine (`assets/js/main.js`, `assets/js/loaders.js`) from `data/*.json` — do not modify the engine or data.

## Current state (verified findings)
- 768px is the workhorse breakpoint (used in 11 files); 640 and 1024 appear occasionally; 1280 and 1480 are defined as reference but almost unused — wide screens get a capped 1480px container with no layout enrichment.
- Layout jumps abruptly (1 column → 2/3 columns); tablet-landscape (~1024px) lacks dedicated refinement.
- Spacing is static per breakpoint; page padding tokens switch values via media queries instead of scaling fluidly.
- No `@media print` styles anywhere.
- Card grids are viewport-driven; a card in a narrow sidebar-like context would not adapt (no container queries).

## Tasks
1. Analyze: build a responsive audit matrix — every page × {360, 640, 768, 1024, 1280, 1480} — by serving locally and inspecting each cell. Record breakages, abrupt jumps, and wasted space. Include the matrix and your decisions in the PR description.
2. Convert card grids to container queries: give grid containers `container-type: inline-size` and size cards by container width (`@container` rules) so components adapt to their context, not the viewport. Keep a sensible viewport-based fallback for browsers without support (progressive enhancement — the current media queries can remain as fallback).
3. Make spacing fluid: replace per-breakpoint jumps of `--page-padding-x/y`, `--section-gap`, and grid gaps with `clamp()` expressions in `tokens.css`, so rhythm scales continuously.
4. Exploit wide screens: at 1280/1480px introduce deliberate enrichments where content justifies it (e.g., wider hero composition, 4-column resource grids, generous whitespace) instead of just stretching the 1024px layout.
5. Refine tablet landscape (~1024px): verify nav, card grids, and the seguimiento tool feel designed, not interpolated.
6. Add `@media print` styles (new `assets/css/print.css`, added to the import chain): hide nav/footer/CTA/loaders, black-on-white text, expanded link URLs for external resource links, page-break control on cards and headings.
7. Audit the navbar's responsive transition (hamburger ↔ desktop) for intermediate widths; fix any awkward middle state in `assets/css/navbar.css` (visual/layout only).
8. Update `FASE_1_Catalogo_Componentes.md` with the container-query strategy and the breakpoint usage contract.

## Hard constraints / out of scope
- Do NOT touch: color/type token values (S1), elevation/spacing-contract semantics from S2 (you may make their values fluid, not redefine their roles), focus styles/ARIA (S4), animations/transitions (S5), asset loading and the @import chain except for adding print.css (S6 owns performance), JS engine and JSON data, Spanish copy.
- Mobile-first only; never introduce `max-width`-first overrides except inside `@media print`.

## Verification & deliverables
- Serve locally (`python3 -m http.server 8000`); verify the full matrix again after changes — every page at all six widths, plus a print preview (browser print dialog) of `index.html`, one gabinete detail, and `pages/recursos/apuntes.html`.
- Test container-query fallback by emulating an older browser (disable CQ support in DevTools or reason through the fallback CSS and document it).
- Commit in Spanish imperative style (e.g., «Mejorar comportamiento responsive con container queries y espaciado fluido»), branch `design/s3-responsive`, PR description starting with the audit matrix.
```

---

## Sesión 4 — Accessibility (WCAG 2.2 AA)

```text
You are a senior accessibility engineer performing a WCAG 2.2 AA audit and remediation pass on a production static website. Sessions S1–S3 (tokens, components, responsive) are merged; the visual system is stable. Your job: make the site demonstrably conformant and pleasant to use with keyboard, screen reader, and assistive preferences — without visual regressions.

## Repository context
- Static site, Spanish (es-AR), GitHub Pages. Non-negotiable stack: semantic HTML5, pure CSS tokens + BEM, vanilla ES-module JS. No frameworks, no CDNs.
- `tokens.css` (repo root): single source of truth; WCAG contrast ratios are documented per token pair in comments — keep that practice for anything you add.
- 18 BEM stylesheets in `assets/css/`; pages: `index.html`, `pages/sobre-achetiq.html`, `pages/gabinetes.html`, `pages/gabinetes/*.html` (4), `pages/recursos.html`, `pages/recursos/apuntes.html`, `pages/recursos/seguimiento.html`, `pages/contacto.html`, `404.html`.
- Dynamic content: `assets/js/main.js` (data-loader engine: fetches `data/*.json`, shows loader → renders → or error/empty state), `assets/js/loaders.js` (renderers; safe `createElement`/`safeHref` helpers — never use `innerHTML` on data). Navbar/footer are injected partials (`assets/js/navbar.js`, `assets/js/footer.js` + `partials/*.html`). You MAY edit JS for ARIA/focus behavior; do not change the engine's architecture or the security helpers' contracts.
- A global `prefers-reduced-motion` reset with a `.safe-motion` escape hatch exists in `assets/css/main.css` — preserve it.

## Current state (verified findings)
- Good foundation: skip links on all pages, semantic landmarks, `aria-expanded/controls` on the hamburger, arrow-key + Home/End/Esc navigation in navbar submenus (`assets/js/navbar.js`), `aria-live="polite"` on loaders, `aria-pressed` on the apuntes year filter pills.
- Defects: skip-link targets are inconsistent (`#contenido` on `index.html` vs `#main-content` elsewhere). `:focus-visible` styling is not centralized and unverified across buttons, links, pills, form fields. Dynamically inserted error messages from the data-loader are not guaranteed to be announced (`role="alert"`/`aria-live` at insertion time). The contact form (`pages/contacto.html`, `assets/css/forms.css`) is a stub with no validation/error pattern. Mobile nav panel Esc/focus-return behavior needs verification.

## Tasks
1. Analyze: run a full audit — keyboard-only walkthrough of every page (tab order, focus visibility, Esc behavior, focus return), landmark/heading structure review, and an automated pass (axe-core via npx or Lighthouse a11y category) on all 9 pages. Summarize findings in a table for the PR description.
2. Unify skip links: same target id (`#main-content`) and identical markup on every page; ensure the target is focusable (`tabindex="-1"` if needed).
3. Build a centralized focus system: a tokens-based `:focus-visible` treatment (visible 2px+ outline with offset, AA contrast against every surface it can appear on) defined once (new `assets/css/focus.css` or a clearly-marked section in `main.css`) and remove scattered per-component focus rules. Cover: links, buttons, pills, nav items, form controls, skip links, cards if they are link-wrapped.
4. Fix dynamic announcements: error and empty states inserted by `assets/js/main.js`/`loaders.js` must use `role="alert"` (errors) or be inserted into an existing `aria-live` region (status updates); verify the loader→content swap is announced sanely and doesn't spam.
5. Harden the mobile nav: Esc closes the panel and returns focus to the hamburger; focus is trapped inside the open panel; `aria-expanded` state stays in sync (extend `assets/js/navbar.js`).
6. Target sizes: ensure all interactive targets meet 24×24 CSS px minimum (WCAG 2.2), aiming for 44×44 on primary controls; fix offenders via padding, not magic numbers — extend spacing tokens if needed.
7. Forms groundwork: in `assets/css/forms.css` + `pages/contacto.html`, implement the accessible pattern for the future form: visible `<label>`s, `aria-describedby` hint/error wiring, error summary pattern, `:user-invalid` styling with non-color error indication. No backend integration — markup/CSS/JS pattern only.
8. Verify contrast of every text/surface pair introduced since S1 (including focus outlines and the seguimiento tool palette) and document ratios in `tokens.css` comments.
9. Update `FASE_1_Catalogo_Componentes.md` (states, focus, forms sections) with the new patterns.

## Hard constraints / out of scope
- Do NOT touch: palette/type scale values (raise a finding in the PR if a pair fails contrast rather than changing tokens unilaterally — exception: focus outline tokens are yours), layout/breakpoints (S3), animations beyond focus transitions (S5), asset loading (S6), JSON content, Spanish copy (you may add Spanish `aria-label`s — keep them in formal es-AR register).
- Never remove existing ARIA that is correct; never add ARIA where native semantics suffice.

## Verification & deliverables
- Re-run the automated audit (axe/Lighthouse) on all 9 pages — zero serious/critical issues — and do a final keyboard-only pass of: full navbar (desktop + mobile emulation), apuntes filter, seguimiento tool, contact form pattern, 404 page.
- Serve locally with `python3 -m http.server 8000`.
- Commit in Spanish imperative style (e.g., «Centralizar sistema de foco y corregir accesibilidad WCAG 2.2 AA»), branch `design/s4-accesibilidad`, PR description starting with the before/after audit table.
```

---

## Sesión 5 — Animations & Micro-interactions

```text
You are a senior motion-design engineer adding a purposeful, restrained motion system to a production static website. Sessions S1–S4 are merged: tokens, components, responsive behavior, and accessibility (including a centralized focus system) are stable. Your goal: motion that communicates state and hierarchy — never decoration for its own sake — at enterprise-grade polish.

## Repository context
- Static site, Spanish (es-AR), GitHub Pages. Non-negotiable stack: semantic HTML5, pure CSS tokens + BEM, vanilla ES-module JS. No frameworks, no animation libraries, no CDNs.
- `tokens.css` (repo root): single source of truth. It already has duration tokens (`--transition-fast/normal/slow` ≈ 150/250/400ms, `--transition-hero` 1000ms). There are NO easing tokens yet — you will own them.
- Existing motion: ~10 @keyframes across `assets/css/loader.css` (bouncing dots + reduced-motion fade variant), `assets/css/states.css` (skeleton pulse), `assets/css/error-404.css` (entrance + float), `assets/css/countdown-recursos.css`. A scroll-reveal system exists in `assets/js/scroll-reveal.js` (IntersectionObserver, `data-scroll-reveal` attribute). A hero slideshow cross-fades in `assets/js/hero-carrousel.js`.
- CRITICAL invariant: `assets/css/main.css` contains a global `prefers-reduced-motion: reduce` reset (neutralizes all animation/transitions) with a `.safe-motion` class as the only escape hatch for accessible alternatives. Every animation you add must behave correctly under this reset; preserve the mechanism exactly.
- Pages: `index.html`, `pages/sobre-achetiq.html`, `pages/gabinetes.html`, `pages/gabinetes/*.html` (4), `pages/recursos.html`, `pages/recursos/apuntes.html`, `pages/recursos/seguimiento.html`, `pages/contacto.html`, `404.html`.
- Content is injected by a data-loader engine (`assets/js/main.js`, `assets/js/loaders.js`) — you may hook transitions around its loader→content swap, but do not change its architecture or the `createElement`/`safeHref` security helpers.

## Current state (verified findings)
- Hover feedback is limited to basic color/border transitions; cards and buttons lack press states and refined hover choreography.
- No easing vocabulary: everything uses default/linear-ish timing; durations exist as tokens but easing is ad hoc.
- The loader→content swap is an abrupt replacement (no enter transition for rendered content).
- Page-to-page navigation has no transition treatment (full reloads, static site).
- Scroll-reveal exists but is used sparsely and uniformly (single fade-in, no stagger).

## Tasks
1. Analyze: inventory every existing animation/transition (file, trigger, duration, easing, reduced-motion behavior) into a table for the PR description, and define your motion principles (what moves, why, how far, how long).
2. Tokenize the motion system in `tokens.css`: easing tokens (`--ease-out`, `--ease-in-out`, `--ease-emphasized` e.g. cubic-bezier(0.2, 0, 0, 1), `--ease-spring`-like via linear() with a documented fallback) and a duration ramp consistent with the existing tokens. Migrate all existing transitions/keyframes to use them.
3. Micro-interactions on interactive components (CSS-only where possible): buttons (hover lift/press compression ≤2px, using the S2 elevation tokens), cards (hover elevation + subtle image scale within overflow:hidden), nav links (underline/indicator transitions), pills (selection transitions). Subtle and fast (≤ --transition-normal); transform/opacity only — never animate layout properties.
4. Choreograph content entry: when the data-loader swaps loader → rendered content, fade/translate the content in (one class added by JS, animated in CSS, with stagger via `--index` custom property on grid children set during render in `assets/js/loaders.js`).
5. Upgrade scroll-reveal: add stagger support and a translate distance token to `assets/js/scroll-reveal.js` + CSS; apply it deliberately to homepage and hub-page sections (avoid revealing above-the-fold content).
6. Cross-document View Transitions as progressive enhancement: add `@view-transition { navigation: auto; }` plus tasteful `::view-transition-*` rules (e.g., persistent navbar, soft root cross-fade ≤250ms); verify it degrades to instant navigation in non-supporting browsers and is disabled under reduced motion.
7. Ensure every new animation respects the global reduced-motion reset (or provides an accessible `.safe-motion` alternative as `loader.css` does); nothing may flash, loop indefinitely (except existing loaders), or exceed ~500ms for UI feedback.
8. Update `FASE_1_Catalogo_Componentes.md` with the motion principles, tokens, and per-component motion specs.

## Hard constraints / out of scope
- Do NOT touch: palette/type/spacing/elevation token values (consume them), layout and breakpoints (S3), focus outline styling (S4 owns it — you may add a transition to its appearance only), asset loading/@import chain (S6), JSON data, Spanish copy.
- No JS-driven animation loops (no requestAnimationFrame choreography); CSS transitions/animations + class toggles only. No new libraries.

## Verification & deliverables
- Serve locally (`python3 -m http.server 8000`); test every page normally AND with reduced motion emulated (DevTools rendering panel) — under reduced motion the site must be fully usable with no broken intermediate states.
- Verify View Transitions in a Chromium browser and graceful degradation in one without support (or with the flag disabled).
- Check that no animation runs on properties other than transform/opacity/filter (grep your additions).
- Commit in Spanish imperative style (e.g., «Incorporar sistema de movimiento y microinteracciones»), branch `design/s5-animaciones`, PR description starting with the motion inventory and principles.
```

---

## Sesión 6 — Performance & Asset Delivery

```text
You are a senior web-performance engineer establishing a performance baseline and optimizing asset delivery for a production static website. Sessions S1–S5 are merged: the redesigned UI (fluid tokens, components, responsive, a11y, motion) is final. Your job: measure it, make it fast, and leave a performance budget in place — without altering the visual result.

## Repository context
- Static site, Spanish (es-AR), deployed to GitHub Pages (no server config, no headers control, no build-time bundlers beyond what already exists: `package.json` has a single `node scripts/build-urls.mjs` step). Non-negotiable stack: semantic HTML5, pure CSS tokens + BEM, vanilla ES-module JS. No frameworks, no CDNs.
- CSS: `tokens.css` at repo root + 18 stylesheets in `assets/css/`, currently loaded as one `<link>` to `assets/css/main.css` which pulls a chain of ~14 `@import url(...)` statements — a serialized, render-blocking download waterfall.
- Fonts: self-hosted woff2 in `assets/fonts/` with `font-display: swap` (@font-face in `assets/css/main.css`).
- JS: ES modules in `assets/js/` — a data-loader engine (`main.js`) fetches `data/*.json` per `[data-loader]` region after DOMContentLoaded; navbar/footer are fetched partials (`partials/*.html` + their JSON). This means above-the-fold chrome (navbar) depends on runtime fetches.
- Pages: `index.html`, `pages/sobre-achetiq.html`, `pages/gabinetes.html`, `pages/gabinetes/*.html` (4), `pages/recursos.html`, `pages/recursos/apuntes.html`, `pages/recursos/seguimiento.html`, `pages/contacto.html`, `404.html`. Homepage has a hero image slideshow (`assets/js/hero-carrousel.js`).
- Hard rule: do not change the data-loader architecture, the partial-injection design, or the `createElement`/`safeHref` security helpers. You optimize scheduling and payloads, not the architecture.

## Current state (verified findings)
- No documented performance baseline (no Lighthouse runs, no budget).
- The `@import` chain in `main.css` serializes CSS discovery (each import discovered only after the parent downloads).
- Images: lazy-loading, `fetchpriority`, and explicit width/height attributes are not applied systematically; hero slideshow preloads images via JS without priority hints, and layout-shift risk from late-injected navbar/footer/content is unmeasured.
- Fonts are woff2 + swap (good) but there is no preload of critical fonts and no `size-adjust`-matched fallback metrics, so swap causes visible reflow (CLS).
- JSON fetch waterfall: navbar partial + navbar.json + per-page data fetches all start after HTML parse; no resource hints.

## Tasks
1. Baseline first: run Lighthouse (mobile + desktop; `npx lighthouse` against a local server, throttling defaults) on `index.html`, one gabinete detail, `pages/recursos/apuntes.html`, and `pages/contacto.html`. Record LCP, CLS, INP/TBT, transfer size per page in a table — this goes at the top of your PR description as the "before" column.
2. Kill the CSS waterfall: replace the `@import` chain with one of (a) explicit ordered `<link rel="stylesheet">` tags generated into all pages, or (b) a tiny build-time concatenation step added to the existing `npm run build` (`scripts/` already exists, a new `scripts/build-css.mjs` following the style of `build-urls.mjs` is acceptable since `package.json` already defines a build). Choose, justify in the PR, and keep the 18-file modular source structure for development either way.
3. Font loading: `<link rel="preload" as="font" crossorigin>` for the 1–2 fonts used above the fold; add `size-adjust`/`ascent-override` fallback metrics to each @font-face fallback stack so the swap is visually quiet (measure CLS before/after).
4. Image strategy: explicit `width`/`height` (or `aspect-ratio` in CSS) on every `<img>` and image-emitting renderer in `assets/js/loaders.js`; `loading="lazy"` + `decoding="async"` on below-the-fold images; `fetchpriority="high"` on the LCP hero image and eager-load only the first slideshow frame; convert oversized raster assets in `assets/img/` to appropriately-sized WebP where quality allows (keep originals out of the page weight).
5. Tame the fetch waterfall: add `<link rel="preload" as="fetch" crossorigin>` (or modulepreload where apt) for the critical path (navbar partial + `data/navbar.json`) so chrome renders earlier; reserve space for injected navbar/footer via CSS min-height to eliminate their CLS contribution.
6. JS scheduling: verify all scripts are `type="module"` (deferred by default) and nothing blocks parsing; mark the countdown/seguimiento page-specific scripts so they load only on their pages (they already are page-scoped — verify, don't restructure).
7. Define the performance budget and document it in a new `RENDIMIENTO_Presupuesto.md` (Spanish): targets LCP < 2.5s (mobile, throttled), CLS < 0.1, total CSS < 75KB, per-page transfer < 500KB; include the measurement commands so the budget is re-checkable.
8. Re-run the full Lighthouse matrix from task 1 — the "after" column. Every metric must improve or hold; explain any that don't.

## Hard constraints / out of scope
- Zero visual regressions: pixel-identical rendering is the goal (compare screenshots before/after at 375px and 1280px for the four audited pages).
- Do NOT touch: token values, component CSS rules (only how CSS/fonts/images are delivered), motion system (S5), focus/a11y behavior (S4), JSON schemas, Spanish copy. No service workers (GitHub Pages cache pitfalls; out of scope v1), no third-party services, no CDNs.

## Verification & deliverables
- Before/after Lighthouse table (mobile + desktop) for the four pages; before/after screenshots proving no visual change; the budget doc.
- `npm run build` (if you added a CSS build step) must succeed and its output must be committed or generated deterministically — document which.
- Commit in Spanish imperative style (e.g., «Optimizar entrega de activos y establecer presupuesto de rendimiento»), branch `design/s6-rendimiento`, PR description starting with the before/after metrics table.
```

---

## Uso

1. Ejecutar las sesiones **en orden estricto S1 → S6**, una rama y un pull request por sesión, fusionando antes de iniciar la siguiente.
2. Cada PR debe abrir con el resumen de decisiones de diseño que el propio prompt exige: esa es la instancia de revisión de la directiva (adaptación autorizada del ciclo de dos rondas de `INSTRUCCION_PROYECTO.md` §5.2).
3. Si una sesión detecta un problema fuera de su dominio, debe **registrarlo en el PR como hallazgo**, no resolverlo: el dominio correspondiente lo absorbe en su propia sesión.
