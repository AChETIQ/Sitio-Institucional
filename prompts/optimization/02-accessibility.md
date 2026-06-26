# 02 — Accessibility Pass (AChETIQ, WCAG 2.2 AA)

> Paste everything below the line into Claude Code at the repo root. Self-contained.
> Read `00-index.md` first. This site already has solid a11y foundations — your job is
> to **verify and close residual gaps**, not rebuild.

---

You are a senior accessibility engineer. Bring this static site to a **verifiable
WCAG 2.2 Level AA** standard across every page and every interactive widget.

## 1. Objective
**Zero axe-core critical/serious violations**, **Lighthouse Accessibility ≥ 95** on
all pages, and **full keyboard operability** of every interactive control — measured,
not asserted.

## 2. Scope
**In scope:** all `*.html` pages + `partials/_boilerplate.html`; the custom JS widgets
`assets/js/navbar.js` (dropdown/accordion), `assets/js/sobre-achetiq.js` (tab/panel),
`assets/js/countdown-recursos.js` (`role="timer"`), `assets/js/easter-egg.js` (dialog),
`assets/js/apuntes.js` (filter), `assets/js/seguimiento.js` (data table); the CSS
`assets/css/focus.css`, `assets/css/motion.css`, `assets/css/forms.css`, and the OKLCH
palette in `tokens.css`.
**Out of scope:** SEO (`01`), perf (`03`), visual redesign, and re-theming the palette
(you may flag a token whose contrast fails, but do not redesign the brand).

## 3. Preconditions (measure first)
1. Confirm the a11y baseline exists (`05-baseline-audit.md`). If axe results are missing, run the baseline a11y audit first.
2. Install the audit harness against the **already-present Playwright** (`scripts/shoot.mjs` proves chromium works): `npm i -D @axe-core/playwright playwright` (or run via `npx`). Record that this dev-dependency is being added (the repo currently has zero deps — note it in the report and in `06`).
3. Run axe on each page (serve statically first) and record **every** violation with its impact level and the SC it maps to.
4. Do a manual keyboard pass (Tab/Shift-Tab/Enter/Space/Esc/Arrows) on each widget and write down what breaks (focus traps, lost focus, unreachable controls, invisible focus).
5. Extract the actual rendered colors from `tokens.css` semantic tokens for contrast math (foreground/background pairs in real use).

## 4. Methodology (mandatory loop)
**Measure → Diagnose → Implement → Verify → Document.** Per violation: capture the axe
rule + SC (Measure), find the root cause in markup/CSS/JS (Diagnose), apply the minimal
fix preferring **native semantics over ARIA** (Implement), re-run axe + repeat the
keyboard pass (Verify), log before/after (Document).

## 5. Stack-specific guidance
- **Landmarks & skip link:** the skip link (`Saltar al contenido principal`) and
  `#main-content` exist — verify the target is focusable and that one `<main>`, `<nav>`,
  `<header>`, `<footer>` structure holds on every page.
- **Custom widgets (no shadcn — these are hand-rolled):**
  - *Navbar* (`navbar.js`): verify `aria-expanded`/`aria-controls`/`aria-haspopup`,
    Arrow/Home/End/Esc handling, focus return to the trigger on close, and that the
    mobile accordion is operable and not a focus trap.
  - *Tabs* (`sobre-achetiq.js`): if it behaves as tabs, apply the APG tabs pattern
    (`role="tablist"/"tab"/"tabpanel"`, `aria-selected`, roving tabindex). If it is
    just hash navigation, ensure `aria-current` and correct focus on panel change.
  - *Dialog* (`easter-egg.js`): verify `role="dialog"`/`aria-modal`, focus trap **while
    open**, Esc to close, focus restoration, and an accessible name.
  - *Timer* (`countdown-recursos.js`): `role="timer"` + `aria-live="polite"` already
    present — verify it does not spam SR output every second (throttle announcements).
  - *Data table* (`seguimiento.js`): real `<table>` semantics — `<th scope>`, caption,
    and keyboard-reachable controls; sortable headers need `aria-sort`.
  - *Filter* (`apuntes.js`): controls must be real `<button>`/`<select>` with labels and
    an `aria-live` region announcing result counts.
- **Focus visible:** `focus.css` uses `:focus-visible` with a documented contrast ring —
  verify the ring is visible on **every** interactive element against both light and
  dark surfaces, and that `tabindex="-1"` programmatic targets don't show a stray ring
  (WCAG 2.4.7, and 2.4.11 Focus Not Obscured by the sticky navbar — check scroll-padding).
- **Reduced motion (replaces the framer-motion requirement):** `motion.css` +
  `matchMedia('(prefers-reduced-motion: reduce)')` guards in `hero-carrousel.js`,
  `scroll-reveal.js`, `loaders.js` already exist. **Audit for completeness**: enable
  "reduce" and confirm *no* essential content is hidden behind an animation and *every*
  transition/`@view-transition`/carousel auto-advance is neutralized.
- **Forms:** `contacto.html` has no `<form>` (contact is mailto/social). If any input
  exists elsewhere, every control needs a programmatic label, `aria-invalid` on error,
  and errors tied via `aria-describedby`.
- **Contrast:** compute ratios for every text/background and UI/border pair from the
  real OKLCH tokens. Body text ≥ 4.5:1; large text & UI ≥ 3:1. Flag any token pair that
  fails and propose a token-level fix (do not patch per-component).
- **Language & SR-only:** confirm `lang="es-AR"`, that `.sr-only` content is correct
  Spanish, and that icon-only buttons have `aria-label`.

## 6. Tooling
- `@axe-core/playwright` driven by the existing chromium (model the runner on `scripts/shoot.mjs`); save JSON per page.
- `npx --yes lighthouse … --only-categories=accessibility`.
- Manual: keyboard-only pass + a screen-reader smoke test (VoiceOver/NVDA/Orca) on navbar, dialog, tabs, table.
- Contrast: a programmatic checker over token pairs (e.g. `npx --yes wcag-contrast` or a small script reading `tokens.css`).

## 7. Acceptance criteria
- **Zero** axe **critical** and **serious** violations on every page (moderate/minor documented with rationale).
- Lighthouse **Accessibility ≥ 95** on all 4 reference pages + 2 nested pages.
- **100% keyboard operability**: every control reachable, operable, with visible focus, no traps, focus restored after dialogs/menus.
- All text/UI contrast meets the AA thresholds against the real tokens.
- With `prefers-reduced-motion: reduce`, no animation hides content and no auto-motion persists.

## 8. Output expectations
Small, atomic commits scoped per widget/issue (e.g. "a11y: trap focus in easter-egg
dialog", "a11y: aria-sort on seguimiento table headers"). Report at
`prompts/optimization/reports/accessibility.md` with a per-page axe before/after count,
a keyboard-pass checklist, and the contrast table. Note the newly added dev-dependency.

## 9. Guardrails
- Prefer **native HTML semantics**; add ARIA only where native is insufficient, and
  never leave an ARIA attribute that lies about state.
- Do **not** alter visible design or copy beyond what a11y strictly requires; if a
  contrast fix changes a brand color, **state the trade-off** and get it confirmed.
- Do **not** regress the existing reduced-motion behavior or remove working ARIA.
- Keep changes incremental; re-run axe after each so a fix never introduces a new
  violation. Do not refactor a whole widget when a targeted fix suffices.
