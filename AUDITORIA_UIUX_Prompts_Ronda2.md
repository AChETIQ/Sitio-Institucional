# AUDITORÍA UI/UX — Ronda 2 — Prompts de ejecución para Claude Code

> Catálogo de **15 prompts autocontenidos de pulido residual**, producto de la auditoría componente-por-componente del 2026-06-11 (posterior a la fusión de las sesiones S1–S6 de `AUDITORIA_UIUX_Plan.md`). El sistema ya es ~100 % token-driven; estos prompts atacan los huecos verificados restantes, no rehacen nada.
>
> Cada prompt se copia completo en una sesión de ejecución. Salvo dependencia indicada, son independientes entre sí. **Orden sugerido:** T1 → S1 → M3 (productores de tokens) y luego cualquier orden; X1/X2 son independientes.
>
> Los prompts están redactados en inglés (convención de la Ronda 1); el sitio, sus comentarios CSS y sus commits permanecen en español.
>
> **Reglas transversales (incluidas en cada prompt):** `assets/css/main.bundle.css` es un artefacto generado — tras tocar CSS fuente se regenera con `npm run build:css` y se commitea junto con las fuentes. Commits convencionales con descripción en español. Push directo a la rama `claude/vigilant-clarke-3impt6`. **Prohibido abrir Pull Requests.**

## Hallazgos descartados durante la auditoría (no ejecutar)

La auditoría verificó y **descartó** estas sospechas; quedan registradas para no repetir trabajo:

- El vocabulario de hover de tarjetas ya es consistente: `.card-gabinete` (cards.css:34), `.card-institucion` (:398), `.card-materia` (:463) y `a.contact-card` (:596) comparten borde + `translateY(var(--elevation-lift))` + `var(--elevation-hover)`, con transiciones declaradas en reposo.
- `.footer__bottom` ya tiene `border-top: 1px solid var(--footer-rule)` (footer.css:298); `.footer__logo` ya está fijado a 40 px (footer.css:121).
- El CSS del timeline existe y está completo (lists.css:352–460).
- Que `index.html` cargue `sobre-asociacion.css` aparte es intencional (hoja por página, fuera del bundle).
- El `<style>` inline de `contacto.html` está documentado como estilos locales mínimos intencionales.
- No existe `transition: all` en el código; el sistema de foco, los ratios de contraste y las migas de pan están verificados y sanos.
- Flecha custom de `<select>`: `forms.css:92` quita `appearance` a los selects, pero no existe ningún `<select>` en el markup — diferir hasta que se introduzca uno.
- `letter-spacing` de `.btn` (0.02em, tokens.css:921) y el radio de 1 px de las barras del hamburger (navbar.css:365): intencionales e imperceptibles — dejar.
- Paginación / acordeón: sin consumidor actual — no construir especulativamente.

---

## Pilar 1 — Tipografía y legibilidad

### PROMPT T1 — Tokenizar métricas de subrayado y sombra de texto del hero

```text
You are a senior design engineer polishing a production static website (Spanish es-AR, GitHub Pages; semantic HTML5 + pure CSS with design tokens/BEM + vanilla ES-module JS; no frameworks, no preprocessors, no CDNs). `tokens.css` at the repo root is the single source of truth for visual values; `assets/css/main.bundle.css` is a GENERATED artifact — never edit it by hand. All CSS comments are written in Spanish, matching each file's existing style. Work directly on branch `claude/vigilant-clarke-3impt6`.

Task:
1. In `tokens.css`, in the radii/transitions region (~lines 647–777), add two tokens with Spanish doc comments:
   - `--underline-offset: 2px;`
   - `--text-shadow-media: 0 4px 16px color-mix(in srgb, var(--color-text) 60%, transparent), 0 2px 4px color-mix(in srgb, var(--color-text) 80%, transparent);`
2. Replace the hardcoded `text-underline-offset` values with `var(--underline-offset)` in: `assets/css/cards.css:554`, `assets/css/footer.css` (~line 189), `assets/css/forms.css:231`, and `assets/css/error-404.css` (~line 174). If any of these uses 3px instead of 2px, keep its current value via a documented local override rather than changing the rendered result.
3. Replace the duplicated two-layer `text-shadow` blocks at `assets/css/headers.css:114–116` and `:129–131` with `text-shadow: var(--text-shadow-media);`.

Verification: run `npm run build:css`; serve locally (`python3 -m http.server 8000`) and confirm zero visual change on index.html (hero) and the footer/forms links.

Commit the source files AND the regenerated `assets/css/main.bundle.css` with message `refactor(tokens): tokenizar offset de subrayado y sombra de texto sobre media`, then push with `git push -u origin claude/vigilant-clarke-3impt6`. Do NOT create a pull request.
```

### PROMPT T2 — Control de huérfanas en prosa

```text
You are a senior design engineer polishing a production static website (Spanish es-AR, GitHub Pages; pure CSS with design tokens/BEM; `tokens.css` is the single source of truth; `assets/css/main.bundle.css` is GENERATED — regenerate with `npm run build:css`, never hand-edit). CSS comments in Spanish. Work directly on branch `claude/vigilant-clarke-3impt6`.

Task: in `assets/css/main.css`, in the global typography section (near the body/heading baseline rules), add:

    p, li, figcaption, dd { text-wrap: pretty; }

with a Spanish comment noting (a) it is progressive enhancement — browsers without support ignore it — and (b) headings already use `text-wrap: balance` in `headers.css`, so this rule deliberately targets prose only.

Verification: run `npm run build:css`; serve locally and spot-check long paragraphs on `pages/sobre-achetiq.html` at 360px and 1280px — last lines should avoid single-word orphans where the engine supports it.

Commit sources + regenerated bundle with message `feat(typography): controlar huérfanas en prosa con text-wrap pretty`, then `git push -u origin claude/vigilant-clarke-3impt6`. Do NOT create a pull request.
```

### PROMPT T3 — Selección de texto con marca

```text
You are a senior design engineer polishing a production static website (Spanish es-AR; pure CSS with design tokens/BEM; `tokens.css` at repo root is the single source of truth; `assets/css/main.bundle.css` is GENERATED — regenerate with `npm run build:css`). CSS comments in Spanish, following the file's practice of documenting WCAG contrast ratios for every text/background pair. Work directly on branch `claude/vigilant-clarke-3impt6`.

Task: in `tokens.css`, after the global element baseline (the `body`/`a` rules, ~lines 800–880), add branded text-selection styling:

    ::selection { background: var(--patina-100); color: var(--arena-950); }
    .footer ::selection, .cta-final ::selection, .hero ::selection { background: var(--patina-300); color: var(--patina-950); }

(--patina-100 = #CFEAF2, --arena-950 = #1C1914, --patina-300 = #81BCCD, --patina-950 = #072229.) Compute the actual contrast ratio of both pairs and state them in the Spanish comment, matching the documentation style used throughout tokens.css.

Verification: run `npm run build:css`; serve locally and select text on a light section, on the footer, and on the hero of index.html — selection must be clearly legible in all three contexts.

Commit sources + regenerated bundle with message `feat(color): marcar la selección de texto con la paleta pátina`, then `git push -u origin claude/vigilant-clarke-3impt6`. Do NOT create a pull request.
```

### PROMPT T4 — Imponer medida de lectura en bloques de prosa largos

```text
You are a senior design engineer polishing a production static website (Spanish es-AR; semantic HTML5 + pure CSS with design tokens/BEM). The reading-measure constraint `max-width: var(--measure-prose)` (65ch) currently exists only contextually: `.prose` in `assets/css/text.css:23` and `.page-header__lead` in `assets/css/headers.css:225`. Work directly on branch `claude/vigilant-clarke-3impt6`.

Task: audit `pages/sobre-achetiq.html`, the four `pages/gabinetes/*.html` detail pages, and `pages/recursos.html` for paragraph runs NOT constrained to the prose measure. For each unconstrained long-form block, apply the existing `.prose` class in the HTML (preferred — do not write new CSS). Do NOT touch cards, captions, list items inside components, or single-line text. Note that content injected by `assets/js/loaders.js` renderers may need the class on the container in the HTML, not on the injected nodes — do not modify the JS engine.

Verification: serve locally at 1480px viewport and confirm no body paragraph in the audited pages exceeds ~65ch; confirm zero layout regressions on cards and grids. No CSS changed, so no bundle rebuild is needed.

List the blocks changed (page + section) in the commit body. Commit with message `fix(typography): limitar medida de lectura a 65ch en bloques de prosa largos`, then `git push -u origin claude/vigilant-clarke-3impt6`. Do NOT create a pull request.
```

---

## Pilar 2 — Espaciado y layout

### PROMPT S1 — Centralizar el ritmo vertical de secciones

```text
You are a senior design engineer polishing a production static website (Spanish es-AR; pure CSS with design tokens/BEM; `tokens.css` is the single source of truth; `assets/css/main.bundle.css` is GENERATED — regenerate with `npm run build:css`). CSS comments in Spanish. Work directly on branch `claude/vigilant-clarke-3impt6`.

Several components carry their own literal vertical padding clamps that encode the same two rhythm tiers. Centralize them:

1. In `tokens.css` (fluid layout section, ~lines 673–682) add, with Spanish comments:
   - `--section-pad-y: clamp(48px, 42.86px + 1.43vw, 64px);`  (standard section breathing)
   - `--section-pad-y-lg: clamp(64px, 53.71px + 2.86vw, 96px);`  (hero-grade breathing)
2. Consume them, replacing ONLY the vertical component of each literal clamp (keep the distinct horizontal clamps untouched):
   - `assets/css/cta.css:53` — `.cta-final` vertical padding → `var(--section-pad-y)`
   - `assets/css/footer.css` (~line 68) — footer vertical padding → `var(--section-pad-y)`
   - `assets/css/headers.css:47` — hero vertical padding → `var(--section-pad-y-lg)`
   - `assets/css/countdown-recursos.css` — the countdown panel's vertical padding clamp → `var(--section-pad-y)`

Verification: run `npm run build:css`; in devtools, confirm computed vertical padding is IDENTICAL to before at 360px, 768px and 1480px on index.html (hero + cta-final), the footer, and pages/recursos.html (countdown).

Commit sources + regenerated bundle with message `refactor(tokens): centralizar ritmo vertical de secciones en alias de padding`, then `git push -u origin claude/vigilant-clarke-3impt6`. Do NOT create a pull request.
```

### PROMPT S2 — Compensar la navbar sticky en destinos de anclas

```text
You are a senior design engineer polishing a production static website (Spanish es-AR; pure CSS with design tokens/BEM; `assets/css/main.bundle.css` is GENERATED — regenerate with `npm run build:css`). CSS comments in Spanish. Work directly on branch `claude/vigilant-clarke-3impt6`.

The navbar is sticky (`--navbar-height: 56px`) and the site uses hash navigation (`#asociacion` / `#galeria` panels on `pages/sobre-achetiq.html`), but no `scroll-margin-top` exists anywhere in the CSS, so anchored targets can land underneath the fixed bar.

Task: in `assets/css/main.css` (global reset section), add:

    [id] { scroll-margin-top: calc(var(--navbar-height) + var(--space-4)); }

with a Spanish comment explaining the sticky-navbar compensation and that it covers current hash panels and any future heading anchors.

Verification: run `npm run build:css`; serve locally, navigate directly to `pages/sobre-achetiq.html#galeria` and via in-page hash links — the target must be fully visible below the navbar. Also confirm `html { scroll-behavior: smooth }` (tokens.css:798) still respects the reduced-motion override in main.css:240–253.

Commit sources + regenerated bundle with message `fix(layout): compensar navbar sticky en destinos de anclas con scroll-margin-top`, then `git push -u origin claude/vigilant-clarke-3impt6`. Do NOT create a pull request.
```

### PROMPT S3 — Nombrar los números mágicos restantes

```text
You are a senior design engineer polishing a production static website (Spanish es-AR; pure CSS with design tokens/BEM; `assets/css/main.bundle.css` is GENERATED — regenerate with `npm run build:css`). CSS comments in Spanish. Work directly on branch `claude/vigilant-clarke-3impt6`.

Three one-off literal dimensions survived the S1–S6 tokenization. Convert each into a documented LOCAL custom property, defined at the top of its component's root selector with a Spanish comment explaining the derivation (these are intentionally local, not global tokens):

1. `assets/css/error-404.css:27` — `max-width: 560px` → define `--error-panel-max: 560px;` on the component root and consume it.
2. `assets/css/countdown-recursos.css:68` — `max-width: 880px` → define `--countdown-panel-max: 880px;` and consume it.
3. `assets/css/cards.css:206` — `grid-template-columns: 80px 1fr` on `.card-actividad` → define `--fecha-col: 80px;` and use `grid-template-columns: var(--fecha-col) 1fr;`.

Strictly zero visual change.

Verification: run `npm run build:css`; diff the regenerated bundle to confirm only the expected declarations changed; spot-check 404.html, pages/recursos.html and any card-actividad instance locally.

Commit sources + regenerated bundle with message `refactor(css): documentar anchos fijos puntuales como custom properties locales`, then `git push -u origin claude/vigilant-clarke-3impt6`. Do NOT create a pull request.
```

---

## Pilar 3 — Color y contraste

### PROMPT C1 — Fallbacks literales para las tintas color-mix del footer

```text
You are a senior design engineer hardening a production static website (Spanish es-AR; pure CSS with design tokens/BEM; `assets/css/main.bundle.css` is GENERATED — regenerate with `npm run build:css`). CSS comments in Spanish. Work directly on branch `claude/vigilant-clarke-3impt6`.

In `assets/css/footer.css:39–43`, five local custom properties derive footer tints via `color-mix()` with no fallback (unlike tokens.css, which documents fallbacks for its mixed colors):

    --footer-ink-soft:  color-mix(in srgb, var(--color-on-accent) 78%, transparent);
    --footer-ink-faint: color-mix(in srgb, var(--color-on-accent) 60%, transparent);
    --footer-rule:      color-mix(in srgb, var(--color-on-accent) 18%, transparent);
    --footer-rule-soft: color-mix(in srgb, var(--color-on-accent) 10%, transparent);
    --footer-bg-hover:  color-mix(in srgb, var(--color-on-accent) 10%, transparent);

Task: before each `color-mix()` declaration, add a literal fallback declaration of the SAME custom property using `rgba(250, 247, 243, A)` (derived from `--color-on-accent` = --arena-50 = #FAF7F3) with alphas 0.78, 0.60, 0.18, 0.10, 0.10 respectively, so the cascade keeps the modern value where supported and degrades gracefully elsewhere. Add a Spanish comment stating these literals must be re-derived if `--color-on-accent` ever changes.

Verification: run `npm run build:css`; serve locally and confirm the footer renders identically in a current browser; optionally toggle `color-mix` support off in devtools to confirm the fallback renders sanely.

Commit sources + regenerated bundle with message `fix(footer): añadir fallbacks literales a las tintas color-mix`, then `git push -u origin claude/vigilant-clarke-3impt6`. Do NOT create a pull request.
```

### PROMPT C2 — Variantes semánticas de estado para .tag

```text
You are a senior design engineer extending the design system of a production static website (Spanish es-AR; pure CSS with design tokens/BEM; `tokens.css` is the single source of truth; `assets/css/main.bundle.css` is GENERATED — regenerate with `npm run build:css`). CSS comments in Spanish, documenting WCAG ratios as the codebase does. Work directly on branch `claude/vigilant-clarke-3impt6`.

`assets/css/states.css` defines `.tag` (line 97) with a single `.tag--primary` variant (line 110). The codebase has an established soft-tint recipe for semantic surfaces — see `.loader-error` (states.css:75–77) and `.form__status` (forms.css:246–248).

Task: after `.tag--primary` (line 113), add three state variants following exactly that recipe, with `<estado>` = positive / negative / warning:

    .tag--<estado> {
      background: color-mix(in oklab, var(--color-<estado>) 8%, var(--color-surface-raised));
      color: var(--color-<estado>);
      border: 1px solid color-mix(in oklab, var(--color-<estado>) 25%, var(--color-border));
    }

Document in a Spanish comment that all three semantic inks meet AA on the raised surface (per tokens.css: positive 7.2:1, negative 7.9:1, warning 5.7:1).

Verification: run `npm run build:css`; create a throwaway local HTML snippet (do not commit it) rendering the four tag variants side by side and confirm legibility and visual harmony with the existing .tag base.

Commit sources + regenerated bundle with message `feat(states): añadir variantes semánticas de tag (positive, negative, warning)`, then `git push -u origin claude/vigilant-clarke-3impt6`. Do NOT create a pull request.
```

### PROMPT C3 — Señal de error no dependiente del borde en campos inválidos

```text
You are a senior design engineer polishing the accessibility of a production static website (Spanish es-AR; pure CSS with design tokens/BEM; `assets/css/main.bundle.css` is GENERATED — regenerate with `npm run build:css`). CSS comments in Spanish. Work directly on branch `claude/vigilant-clarke-3impt6`.

In `assets/css/forms.css`, the invalid-field block (lines 126–134, selector `.form__input[aria-invalid="true"], .form__input:user-invalid`) signals errors via a 2px `--color-negative` border with padding compensation. The error summary at forms.css:202 additionally uses a 4% negative tint.

Task: add to that invalid-field block (keeping the existing border and padding compensation untouched):

    background: color-mix(in oklab, var(--color-negative) 4%, var(--color-surface-raised));

exactly mirroring the `.form__error-summary` tint, so the invalid field reads as part of the same error system. Add one Spanish comment line referencing the shared recipe.

Verification: run `npm run build:css`; serve locally, open `pages/contacto.html`, submit the form empty, and confirm invalid fields show the subtle tint plus the existing border/summary signals; confirm the placeholder and typed text remain ≥ AA legible on the tinted background.

Commit sources + regenerated bundle with message `feat(forms): teñir fondo de campos inválidos con la receta del error-summary`, then `git push -u origin claude/vigilant-clarke-3impt6`. Do NOT create a pull request.
```

---

## Pilar 4 — Micro-interacciones y pulido

### PROMPT M1 — Feedback de elevación en botones

```text
You are a senior design engineer polishing the micro-interactions of a production static website (Spanish es-AR; pure CSS with design tokens/BEM; `tokens.css` is the single source of truth; `assets/css/main.bundle.css` is GENERATED — regenerate with `npm run build:css`). CSS comments in Spanish. Work directly on branch `claude/vigilant-clarke-3impt6`.

In `tokens.css` §COMPONENTE — BOTÓN (lines 914–931), `.btn` currently signals hover/active with opacity alone (`transition: opacity var(--transition-fast)`, hover 0.88, active 0.75), which reads as unresponsive next to the cards' lift behavior.

Task:
1. Extend the transition: `transition: opacity var(--transition-fast), transform var(--transition-fast), box-shadow var(--transition-fast);`
2. `.btn:hover  { opacity: 0.92; transform: translateY(-1px); box-shadow: var(--shadow-xs); }`
3. `.btn:active { opacity: 0.85; transform: translateY(0); box-shadow: none; }`
4. Spanish comment noting the lift is -1px (half of `--elevation-lift`) to keep buttons subordinate to cards, and that the global `prefers-reduced-motion` block (main.css:240–253) already neutralizes the motion.

Verification: run `npm run build:css`; serve locally and exercise hover/active on: hero buttons (dark photo bg), `.cta-final` inverted buttons (accent bg), the contact form submit, and navbar CTA — the lift must look correct on dark and light contexts. Run a keyboard-tab pass to confirm focus rings are unaffected. Check with reduced motion enabled that buttons do not move.

Commit sources + regenerated bundle with message `feat(buttons): añadir elevación sutil en hover y active`, then `git push -u origin claude/vigilant-clarke-3impt6`. Do NOT create a pull request.
```

### PROMPT M2 — Estado disabled para botones

```text
You are a senior design engineer completing the state coverage of a production static website (Spanish es-AR; pure CSS with design tokens/BEM; `tokens.css` is the single source of truth; `assets/css/main.bundle.css` is GENERATED — regenerate with `npm run build:css`). CSS comments in Spanish. Work directly on branch `claude/vigilant-clarke-3impt6`.

`.btn` (tokens.css:914) has no disabled styling; the form controls already define the project's disabled convention (forms.css:139–144: semantic `--color-text-disabled`, no opacity dimming, `cursor: not-allowed`).

Task: in `tokens.css`, immediately after `.btn:active` (line 931), add:

    .btn:disabled,
    .btn[aria-disabled="true"] {
      background: var(--color-border-soft);
      color: var(--color-text-disabled);
      border-color: transparent;
      cursor: not-allowed;
      opacity: 1;
      transform: none;
      box-shadow: none;
    }

plus a hover/active-neutralizing rule for the same selectors (re-assert opacity/transform/box-shadow so disabled buttons never lift — written to compose correctly with the hover rules whether or not prompt M1 has run). Spanish comment referencing the forms.css disabled convention.

Verification: run `npm run build:css`; locally add `disabled` to the contact form submit in devtools and confirm appearance and that hover produces no feedback.

Commit sources + regenerated bundle with message `feat(buttons): definir estado disabled coherente con los controles de formulario`, then `git push -u origin claude/vigilant-clarke-3impt6`. Do NOT create a pull request.
```

### PROMPT M3 — Curva ease-out global y sincronía del panel móvil

```text
You are a senior design engineer unifying the motion language of a production static website (Spanish es-AR; pure CSS with design tokens/BEM; `tokens.css` is the single source of truth; `assets/css/main.bundle.css` is GENERATED — regenerate with `npm run build:css`). CSS comments in Spanish. Work directly on branch `claude/vigilant-clarke-3impt6`.

Today the only refined easing in the codebase is the navbar-local `--navbar-easing: cubic-bezier(0.22, 1, 0.36, 1)` (navbar.css:31); everything else uses plain `ease`. Additionally, the mobile panel closes with a 240ms transform (navbar.css:425) while its overlay fades in 220ms (navbar.css:403) — a visible desync.

Task:
(a) In `tokens.css` §transitions (lines 766–777) add `--ease-out: cubic-bezier(0.22, 1, 0.36, 1);` with a Spanish comment (decelerated exit curve for transform-based motion).
(b) In `assets/css/navbar.css:31`, redefine `--navbar-easing: var(--ease-out);` (keep the local alias so navbar rules stay self-documenting).
(c) Fix the desync: at `assets/css/navbar.css:425` change `transform 240ms` → `transform 220ms` to match the overlay at line 403.
(d) Apply the curve to the transform/box-shadow entries of the interactive-card transitions at `assets/css/cards.css:26–28, 392–394, 445–447, 587–590`: change `transform var(--transition-fast)` → `transform 150ms var(--ease-out)` and `box-shadow var(--transition-fast)` → `box-shadow 150ms var(--ease-out)`, keeping border-color/color entries on `var(--transition-fast)` (plain ease).

Verification: run `npm run build:css`; test mobile panel open/close at < 1024px (panel and overlay must finish together), desktop dropdown, and all interactive card hovers; reduced-motion check (main.css:240–253 must still neutralize everything).

Commit sources + regenerated bundle with message `refactor(motion): unificar curva ease-out global y sincronizar cierre del panel móvil`, then `git push -u origin claude/vigilant-clarke-3impt6`. Do NOT create a pull request.
```

### PROMPT M4 — Extender scroll-reveal a las grillas interiores

```text
You are a senior design engineer extending the entrance-motion system of a production static website (Spanish es-AR; semantic HTML5 + pure CSS with design tokens/BEM + vanilla ES-module JS; `assets/css/main.bundle.css` is GENERATED — regenerate with `npm run build:css`). CSS comments in Spanish. Work directly on branch `claude/vigilant-clarke-3impt6`.

`assets/js/scroll-reveal.js` (IntersectionObserver) currently animates only the index about-intro figure (`index.html:108`) and the sobre-asociacion gallery; its armed-state styles live in `assets/css/sobre-asociacion.css` (~line 208, `.scroll-reveal--armed`), a per-page sheet NOT included in the bundle.

Task:
1. Read `assets/js/scroll-reveal.js` first and confirm its contract: it must arm arbitrary `[data-scroll-reveal]` elements and add the armed class ONLY when `prefers-reduced-motion` allows motion. Preserve that contract — do not modify the reduced-motion logic.
2. Move (not duplicate) the `.scroll-reveal--armed` rules from `sobre-asociacion.css` into a bundled shared sheet (`assets/css/states.css` is the natural home), so non-index pages receive the styles via `main.bundle.css`. Keep index.html working (it loads both the bundle and sobre-asociacion.css).
3. Add `data-scroll-reveal` to the main `.grid-cards` sections in `pages/gabinetes.html` and `pages/recursos.html`, and to the contact grid in `pages/contacto.html`. Add the script include (`<script src="…/assets/js/scroll-reveal.js" defer>`) to those pages, mirroring how index.html loads it (mind the relative path depth).
4. Keep the effect subtle and institutional: reuse the existing reveal styling as-is; do not invent new keyframes.

Verification: run `npm run build:css`; serve locally and confirm the reveal on the three pages, that content is fully visible without JS (progressive enhancement), and that with reduced motion enabled everything renders statically with no armed state.

Commit sources + regenerated bundle with message `feat(motion): extender scroll-reveal a las grillas de gabinetes, recursos y contacto`, then `git push -u origin claude/vigilant-clarke-3impt6`. Do NOT create a pull request.
```

---

## Transversal — robustez percibida (CLS / LCP)

### PROMPT X1 — Reservar espacio de imágenes inyectadas (CLS)

```text
You are a senior design engineer eliminating layout-shift risk in a production static website (Spanish es-AR; vanilla ES-module JS renders content from `data/*.json`; the renderers use safe `createElement` helpers — never introduce `innerHTML` on data). Work directly on branch `claude/vigilant-clarke-3impt6`.

Task: audit every renderer in `assets/js/loaders.js` (596 lines) and `assets/js/gabinete-detalle.js` that creates `<img>` elements (member photos, gallery images, materia covers, noticia covers). For each:
- If the aspect contract is known (1:1 for integrantes, 16:9 for covers), set explicit `width` and `height` attributes on the created element (e.g., 800×800, 1280×720 — the CSS `object-fit: cover` containers make the exact numbers safe) so the browser reserves space before load.
- If dimensions are genuinely unknowable, confirm the CSS container already enforces `aspect-ratio` (as `.card-materia__cover` does at `assets/css/cards.css:475`) and document that in a short code comment.
Do not modify the data-loader engine's control flow, the security helpers, or any JSON schema.

Verification: serve locally with devtools network throttling (Slow 3G) and confirm zero visible layout shift while gabinetes.html (directiva), gabinete detail galleries, and recursos/apuntes.html load; run a Lighthouse pass and confirm CLS < 0.1 per RENDIMIENTO_Presupuesto.md. No CSS changed, so no bundle rebuild is needed.

List each renderer touched in the commit body. Commit with message `fix(js): reservar espacio de imágenes inyectadas para evitar CLS`, then `git push -u origin claude/vigilant-clarke-3impt6`. Do NOT create a pull request.
```

### PROMPT X2 — Variantes responsive del hero (excepción LCP documentada)

```text
You are a senior design engineer attacking the one documented performance-budget exception of a production static website (Spanish es-AR, GitHub Pages; vanilla ES-module JS; no frameworks). `RENDIMIENTO_Presupuesto.md` records Inicio's mobile LCP at 3.8s (budget: < 2.5s) caused by serving `assets/img/hero/*-1920.webp` (~115 KB first frame) to ALL viewports. Work directly on branch `claude/vigilant-clarke-3impt6`.

Task:
1. Generate 800w and 1280w WebP variants of every hero frame into `assets/img/hero/` (use `cwebp` or `sharp` via npx; keep the 1920w originals; match the existing naming pattern, e.g., `2014-800.webp`, `2014-1280.webp`).
2. Update `assets/js/hero-carrousel.js` to select the variant at init via `matchMedia('(max-width: 768px)')` → 800w, `(max-width: 1280px)` → 1280w, else 1920w. Keep the existing preload/defer strategy (first frame eager with priority, rest after window.load) intact.
3. Update the first-frame `<link rel="preload">` in `index.html` to use `imagesrcset` + `imagesizes` so the preloaded resource matches whatever the JS will pick (avoid double-download).
4. Re-measure with the commands documented in `RENDIMIENTO_Presupuesto.md` and update its baseline table and the exception note with the new mobile LCP figure.

Verification: serve locally; in devtools confirm at 375px the 800w file is both preloaded and used (no duplicate hero requests), and at 1440px the 1920w path is unchanged; confirm the slideshow rotation still works and reduced-motion behavior is unaffected.

Commit images, JS, HTML and the updated budget doc with message `perf(hero): servir variantes responsive del slideshow y actualizar presupuesto`, then `git push -u origin claude/vigilant-clarke-3impt6`. Do NOT create a pull request.
```
