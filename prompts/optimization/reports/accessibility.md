# Accessibility pass — AChETIQ (WCAG 2.2 AA, verify-and-close)

**Pillar:** `02-accessibility.md` · **Date:** 2026-06-27 · **Stack:** hand-authored
static HTML + vanilla ES-module JS + custom-CSS OKLCH design tokens, served from
GitHub Pages. **Baseline:** [`../baseline/SUMMARY.md`](../baseline/SUMMARY.md) §3.

> **One-line posture:** the site entered this pass already strong — **0 axe
> critical/serious and Lighthouse Accessibility 100 on all 6 pages** — so the work
> was to close the residual gaps that automation *cannot* see. Three were found and
> fixed: a navbar submenu whose `aria-expanded` **lied** about its open state, a
> countdown timer that **spammed** screen readers once per second, and form-control
> borders below the **WCAG 1.4.11** 3:1 threshold. Everything else (native modal,
> tabs, data table, filter, focus ring, reduced-motion) was **verified and left
> untouched**. axe stays at **0/0** after the changes.

---

## 1. Method & harness (measure → diagnose → implement → verify → document)

Because the baseline already reported **0 axe violations everywhere**, the binding
work lives in the ~50–70 % of WCAG that axe does not automate: keyboard operability,
ARIA truthfulness, screen-reader cadence, real-token contrast, and reduced-motion
completeness. Each was **measured in a real browser**, not asserted.

| Tool | How | Output |
|---|---|---|
| `@axe-core/playwright` ^4.10.2 | WCAG 2.0/2.1/2.2 A+AA tags, 6 pages, before & after | before = [`../baseline/raw/axe/`](../baseline/raw/axe/) · after = [`axe/after/`](./axe/after/) |
| Lighthouse 13.4.0 (`npx`) | `--only-categories=accessibility`, post-fix | scores in §5 |
| Playwright-core + pre-installed Chromium | keyboard/ARIA/contrast/motion probes | [`a11y-checks.mjs`](./a11y-checks.mjs) |

**Dev-dependency note.** This pass relies on the **`@axe-core/playwright`** devDependency
already added by the baseline run (`package.json`); no *new* dependency was introduced.
The axe and behavioural runners use the locally-installed **`playwright-core`** (a
transitive dep) with `executablePath` to the environment's pre-installed Chromium,
because the full `playwright` package is not ESM-resolvable here. `node_modules/` stays
gitignored. Reproduce the manual checks with:

```bash
python3 -m http.server 8099                                   # serve statically
node prompts/optimization/reports/a11y-checks.mjs http://localhost:8099
```

---

## 2. axe before / after (per page, by impact)

Runner: the canonical [`../baseline/axe-run.mjs`](../baseline/axe-run.mjs) pattern
(WCAG tags `wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa`). **Before** = the baseline
capture at [`../baseline/raw/axe/`](../baseline/raw/axe/); **after** (post-fix) committed
under [`axe/after/`](./axe/after/) (per-page violations + pass/inapplicable counts).

| Page | crit | serious | mod | minor | → | crit | serious | mod | minor |
|---|--:|--:|--:|--:|:--:|--:|--:|--:|--:|
| `/` | 0 | 0 | 0 | 0 | → | 0 | 0 | 0 | 0 |
| `/pages/gabinetes/eventos.html` | 0 | 0 | 0 | 0 | → | 0 | 0 | 0 | 0 |
| `/pages/recursos/apuntes.html` | 0 | 0 | 0 | 0 | → | 0 | 0 | 0 | 0 |
| `/pages/contacto.html` | 0 | 0 | 0 | 0 | → | 0 | 0 | 0 | 0 |
| `/pages/sobre-achetiq.html` | 0 | 0 | 0 | 0 | → | 0 | 0 | 0 | 0 |
| `/pages/recursos/seguimiento.html` | 0 | 0 | 0 | 0 | → | 0 | 0 | 0 | 0 |

**0 critical / 0 serious / 0 moderate / 0 minor on every page, before and after** —
the fixes added no new violation. The real defects below are all things axe does not
test, which is exactly why they survived a clean baseline.

---

## 3. Issues found & fixed

### 3.1 Navbar desktop submenu — `aria-expanded` lied (WCAG 4.1.2)

- **Measure.** The desktop submenu opens purely from CSS `:hover` / `:focus-within`
  (`navbar.css` §7). `navbar.js` seeded `aria-expanded="false"` on the trigger at build
  time and **never updated it**. Probe: focus the trigger → `ArrowDown` focuses the first
  `menuitem` and the panel renders (`visibility:visible, opacity≈1, pointer-events:auto`),
  yet the trigger still reported **`aria-expanded="false"`** — a screen reader announces
  "collapsed" over an open menu.
- **Diagnose.** Disclosure state driven by CSS, with no JS mirror → the ARIA state is a
  static lie (violates the guardrail "never leave an ARIA attribute that lies about state").
- **Implement.** `assets/js/navbar.js` → new `bindDesktopExpansion(li, trigger)` mirrors the
  **exact** two CSS conditions: `aria-expanded = (hovered OR focus-within)`, via
  `mouseenter/leave` + `focusin/focusout` (closing only when focus leaves the `<li>`
  entirely). No markup or visual change.
- **Verify.** After `ArrowDown`, `aria-expanded="true"`; on `focusout` of the item, back to
  `"false"`. Native keyboard handling (Arrow/Home/End/Esc, focus return) was already correct
  and was left intact.

### 3.2 Countdown timer — once-per-second SR spam (throttle)

- **Measure.** `.countdown__clock` carried `role="timer"` **+ `aria-live="polite"`** while the
  seconds digit updates every second (probe: `57 → 56 → 55`). A polite live region on a
  per-second mutation = one announcement **per second**, indefinitely.
- **Diagnose.** The live region was attached to the rapidly-ticking visual clock instead of a
  throttled, human-readable summary.
- **Implement.**
  - Markup (`partials/countdown-recursos.html` + `pages/recursos.html`): **removed
    `aria-live="polite"`** from the clock; it keeps `role="timer"` + `aria-label` (readable on
    demand). A maintainer comment in the partial explains *why not to re-add it*.
  - JS (`assets/js/countdown-recursos.js`): inject an `sr-only` `role="status"`
    `aria-live="polite"` region (`[data-countdown-announce]`) updated **only when the minute
    changes**, in natural Spanish — e.g. *"Faltan 12 días, 5 horas y 30 minutos para la
    apertura de Recursos Académicos."*
- **Verify.** Clock `aria-live` is now absent; announcer text is **identical across 3 one-second
  samples** (changes at most once a minute); the visual seconds still tick.

### 3.3 Form-control borders below 1.4.11 (UI contrast) — *user-approved fix*

- **Measure.** The Seguimiento tracker renders real `.form__input` controls (status `<select>`,
  grade/`date` inputs). At rest the boundary was nearly imperceptible: **border vs white cell
  1.52:1**, **border vs fill 1.45:1**, and the near-white fill vs the cell **1.04:1** — no 3:1
  signal identifies the field. axe does not test this.
- **Diagnose.** `.form__input` reused `--color-border` (grafito-300, **1.38:1** — fine as a
  *decorative* card/separator filet, which 1.4.11 exempts, but insufficient for an interactive
  **control boundary**, which 1.4.11 requires at ≥3:1).
- **Implement (token-level, not per-component).** New palette step `--grafito-450` and semantic
  token **`--color-border-interactive`** (`tokens.css`), applied to the **resting** `.form__input`
  border only (`forms.css`). Decorative `--color-border` is untouched; hover (text-faint, 6.1:1),
  invalid (negative, 7.9:1) and focus (accent ring, 7.95:1) states were already compliant;
  `:disabled` keeps the lighter `--color-border-soft` (1.4.11 **exempts inactive components**).
- **Verify.** Re-measured on the live page against the worst-case white cell: **border vs cell
  3.86:1**, **border vs fill 3.69:1** — both clear 3:1 with margin. CSS bundle rebuilt
  (`npm run build:css`). axe still 0/0.
- **Trade-off (approved).** The input border is now a visibly darker neutral (~`#7D828C`),
  concentrated on the Seguimiento tool page. This was confirmed with the maintainer before
  applying; it changes no brand colour and no decorative border.

---

## 4. Keyboard / SR pass — widget checklist

Driven by [`a11y-checks.mjs`](./a11y-checks.mjs) (Tab/Shift-Tab/Enter/Space/Esc/Arrows) +
code inspection. ✅ = verified pass · 🔧 = fixed this pass.

| Widget (file) | Reachable | Operable by keyboard | Focus mgmt | ARIA truthful | Result |
|---|---|---|---|---|---|
| Navbar desktop submenu (`navbar.js`) | ✅ | ✅ Arrow/Home/End/Esc | ✅ Esc → trigger | 🔧 `aria-expanded` now synced | **fixed 3.1** |
| Navbar mobile panel/accordion (`navbar.js`) | ✅ | ✅ toggle + accordion | ✅ trap + restore, Esc, scroll-lock | ✅ `aria-expanded` per toggle | ✅ |
| Easter-egg dialog (`easter-egg.js`) | ✅ | ✅ Enter opens, Esc closes | ✅ native modal trap, restores to trigger | ✅ `aria-modal` + `aria-labelledby` | ✅ (native `<dialog>`) |
| Seguimiento tabs (`seguimiento.js`) | ✅ | ✅ Left/Right/Up/Down roving | ✅ `tabindex` roving | ✅ `role=tab/tablist/tabpanel`, `aria-selected` | ✅ (APG pattern) |
| Seguimiento data table (`seguimiento.js`) | ✅ | ✅ all controls reachable | ✅ | ✅ `<th scope=col/colgroup/row>`, `aria-label` | ✅ (`aria-sort` N/A — not sortable) |
| Apuntes year filter (`apuntes.js`) | ✅ | ✅ native `<button>` | ✅ | ✅ `aria-pressed` + `role=status` count | ✅ |
| Countdown timer (`countdown-recursos.js`) | n/a (output) | n/a | n/a | 🔧 no per-second spam | **fixed 3.2** |
| Sobre-AChETIQ hash panels (`sobre-achetiq.js`) | ✅ | ✅ anchor nav | ✅ | ✅ `aria-current="page"` on active tab | ✅ |
| Hero slideshow (`hero-carrousel.js`) | n/a | n/a | n/a | ✅ decorative (`aria-hidden`) | ✅ |

**Skip link & landmarks:** the skip link (*"Saltar al contenido principal"*) is the first
focus stop on every page and `#main-content` (`tabindex="-1"`) receives focus without a stray
ring (`focus.css` §1). One `<main>`/`<nav>`/`<header>`/`<footer>` per page (baseline keyboard
pass, unchanged).

---

## 5. Contrast — real OKLCH tokens resolved to sRGB by the browser

Tokens were resolved to sRGB **by Chromium** (canvas rasterisation of each `var(--token)` —
exact OKLCH→sRGB as rendered), then scored with the WCAG 2.x formula. Every value matches the
ratios `tokens.css` documents in its own comments (independent confirmation).

**Text (≥ 4.5:1 body / ≥ 3:1 large):**

| Foreground | Background | Ratio | Level |
|---|---|--:|---|
| `--color-text` | `--color-surface` | 16.28:1 | AAA |
| `--color-text-soft` (prose) | `--color-surface` | 8.21:1 | AAA |
| `--color-text-faint` (captions) | `--color-surface` | 5.80:1 | AA |
| `--color-accent` (links) | `--color-surface` | 7.95:1 | AAA |
| `--color-cta-text` | `--color-surface` | 7.78:1 | AAA |
| `--color-negative` | `--color-surface` | 7.52:1 | AAA |
| `--color-positive` | `--color-surface` | 7.13:1 | AAA |
| `--color-warning` | `--color-surface` | 5.25:1 | AA |
| `--color-on-accent` | `--color-accent` (button fill) | 8.39:1 | AAA |
| `--color-on-cta` | `--color-cta` (button fill) | 6.40:1 | AA |
| `--color-on-accent` | `--color-surface-inverse` (footer) | 13.27:1 | AAA |

**UI / non-text (≥ 3:1, WCAG 1.4.11):**

| Pair | Ratio | Verdict |
|---|--:|---|
| Focus ring `--focus-ring-color` vs page | 7.95:1 | PASS (AAA) — and 8.39:1 raised, 13.27:1 footer |
| **Control border `--color-border-interactive` vs white cell** | **3.86:1** | **PASS (was 1.52:1 — fixed 3.3)** |
| **Control border vs field fill `--color-surface-raised`** | **3.69:1** | **PASS (was 1.45:1 — fixed 3.3)** |
| Decorative `--color-border` vs page | 1.38:1 | N/A — cards/separators only, 1.4.11-exempt |

No text or active-UI pair fails AA. The single decorative pair below 3:1 is exempt (it conveys
no state and identifies no control).

---

## 6. Reduced motion (`prefers-reduced-motion: reduce`)

Audited for **completeness**, with the media feature emulated in Chromium:

- **No essential content hidden.** Across `/`, `/pages/sobre-achetiq.html`,
  `/pages/gabinetes/eventos.html`, **0** of the 28 `[data-reveal]`/`.anim-enter` elements are
  stuck at `opacity:0` — the armed states live only under `(prefers-reduced-motion: no-preference)`,
  so under *reduce* everything renders at its final visible state.
- **No auto-motion persists.** The hero slideshow does not advance (it returns before scheduling
  its `setInterval`); `@view-transition { navigation }` is set to `none`; the global
  `main.css` §2 reset neutralises animation/transition durations for `*:not(.safe-motion)`.
- **`.safe-motion` opt-out is justified.** It is used only by transient loaders, and the
  skeleton deliberately swaps its directional *sweep* for a subtle **opacity pulse** under
  *reduce* (no translation/parallax → vestibular-safe). Accepted as-is.

---

## 7. Lighthouse Accessibility (post-fix)

`npx lighthouse --only-categories=accessibility` against the local serve, on the pages touched
this pass (the rest were 100 at baseline and unchanged):

| Page | Score |
|---|--:|
| `/` (navbar, easter-egg) | **100** |
| `/pages/recursos.html` (timer) | **100** |
| `/pages/recursos/apuntes.html` (filter) | **100** |
| `/pages/recursos/seguimiento.html` (table, controls) | **100** |

---

## 8. Acceptance criteria

| Criterion | Status |
|---|---|
| Zero axe **critical** + **serious** on every page (mod/minor documented) | ✅ 0/0/0/0 on all 6, before & after |
| Lighthouse **Accessibility ≥ 95** on reference + nested pages | ✅ 100 measured on every touched page (100 baseline elsewhere) |
| **100 % keyboard operability** — reachable, operable, visible focus, no traps, restored | ✅ §4 (navbar gap fixed; dialog/tabs/menu verified) |
| All text/UI contrast meets AA against the **real tokens** | ✅ §5 (control border raised to ≥3:1) |
| Reduced motion: no animation hides content, no auto-motion persists | ✅ §6 |

---

## 9. Honest limits (carried forward)

- **Manual AT pass.** axe + scripted Playwright probes cover ~30–70 % of WCAG; a human
  **NVDA/VoiceOver/Orca** run on the navbar menu, dialog, tabs and the Seguimiento table is still
  recommended and not possible in this headless environment. The ARIA contracts are now
  *measured* truthful, which is the precondition for a clean AT pass.
- **Live-deploy contrast under real photography.** Hero scrim ratios are derived from the worst
  documented case in `tokens.css`; confirm against the deployed Pages origin once the egress
  block (baseline §7) is lifted.

## 10. Commits (atomic, per issue)

1. `a11y: sync navbar desktop submenu aria-expanded with open state`
2. `a11y: throttle countdown timer screen-reader announcements`
3. `a11y: raise form-control border to WCAG 1.4.11 3:1 (scoped token)`
4. `a11y: add reproducible verification harness + before/after axe + report`
