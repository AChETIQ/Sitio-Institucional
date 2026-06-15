# AUDITORÍA UI/UX — Batería unificada de prompts (con skills `impeccable` + `ui-ux-pro-max`)

> **Qué es esto.** La lista **única, ordenada y autocontenida** que unifica los prompts de la **Ronda 1** (las sesiones S1–S6 del plan maestro) y la **Ronda 2** (los 15 prompts de pulido) en **una sola secuencia** que se corre en orden. Los cuerpos de tareas de ambas rondas están **incorporados aquí (inline)**: este documento es la única fuente: los archivos originales `AUDITORIA_UIUX_Prompts.md`, `AUDITORIA_UIUX_Prompts_Ronda2.md` y `AUDITORIA_UIUX_Plan.md` fueron consolidados en esta batería y eliminados. Cada prompt está reescrito para ejecutarse **apoyándose en las dos skills cargadas en el proyecto** (`.claude/skills/impeccable` y `.claude/skills/ui-ux-pro-max`), porque las dos rondas ya se ejecutaron **sin skills** y el resultado no fue bueno.
>
> **Por qué con skills.** Las skills no son decoración: cada una se invoca **donde está optimizada**. `ui-ux-pro-max` aporta la *inteligencia de referencia* (reglas, paletas, emparejamientos, guías UX y checklists de prioridad 1–10); `impeccable` aporta la *ejecución con criterio de director de diseño* (anti-slop, registro de marca, craft de producción, iteración en navegador). Una decide y valida; la otra ejecuta con gusto. El detalle del reparto está en §2.
>
> Los prompts están redactados en inglés (convención de las rondas previas); el sitio, sus comentarios CSS y sus commits permanecen en español.

---

## 0. Reglas de oro (leer una vez, aplican a TODOS los prompts)

Estas reglas **sustituyen** a las instrucciones equivalentes de los archivos originales donde haya conflicto.

1. **Tipografía y color están CONGELADOS.** Las tipografías y la paleta actuales del sitio **gustan y se conservan**. El antiguo prompt **S1 de Ronda 1 (rediseño de tipografía y color) queda EXCLUIDO de esta batería: no se ejecuta.** Ninguna skill puede proponer reemplazar la familia tipográfica ni la paleta. En concreto, **no aplica** la guía de impeccable para "New projects only" (ni `palette.mjs`, ni elegir estrategia de color, ni cambiar el body bg): el propio paso 5 del setup de impeccable manda que, cuando ya existen colores de marca comprometidos en los tokens, **gana la preservación de identidad**. Las skills trabajan *dentro* de la identidad existente; pueden añadir alias/escala/estados derivados de los tokens vigentes, nunca redefinir la marca.
2. **Una rama nueva por prompt.** Cada prompt crea **su propia rama** `design/pNN-…` (indicada en su cabecera). Para que la secuencia "en orden" acumule el trabajo sin pull requests, **cada rama se crea a partir de la rama del prompt inmediatamente anterior** (la primera, P00, parte de `main`). Push con `git push -u origin design/pNN-…`.
3. **Prohibido abrir Pull Requests.** Al terminar la tarea de cada prompt **NO se abre PR**. Solo se hace commit y push de la rama nueva. (Esto reemplaza el "open a PR" de Ronda 1 y confirma la regla de Ronda 2.)
4. **`main.bundle.css` es un artefacto generado.** Tras tocar cualquier CSS fuente, regenerar con `npm run build:css` y commitear el bundle junto con las fuentes. Nunca editar el bundle a mano. Las páginas enlazan `assets/css/main.bundle.css`.
5. **Stack y datos intocables.** HTML5 semántico, CSS puro con tokens + BEM, JS vanilla. Sin frameworks, sin CDN. No se toca el motor data-loader (`assets/js/main.js`, `assets/js/loaders.js`), los helpers `createElement`/`safeHref` (prohibido `innerHTML` sobre datos), ni los `data/*.json`. Copia editorial en español intocable (solo se reestructura su presentación).
6. **Commits en español, modo imperativo** (se mantiene el mensaje de commit sugerido de cada prompt original).
7. **`prefers-reduced-motion`.** El reset global con escape `.safe-motion` (`assets/css/main.css`) se preserva exactamente; toda animación nueva debe comportarse bien bajo él.
8. **Documentación sincronizada.** Todo cambio de componente o token actualiza `FASE_1_Catalogo_Componentes.md`.
9. **Reconciliar el estado real ANTES de actuar (regla crítica).** Donde un «TASK BODY» reproduce hallazgos de estado heredados de las rondas previas, esos hallazgos describen el repo **antes** de ejecutar esas rondas. **Hoy ambas rondas ya están aplicadas** (existen `main.bundle.css`, `assets/css/focus.css`, `assets/css/print.css`, los breadcrumbs en páginas de detalle, los tokens de sombra/elevación, los skip-links unificados, etc.). Por eso, **esos hallazgos son históricos, no la verdad presente**: cada prompt debe **re-verificar el estado actual del repo** (leer el archivo/selector concreto, hacer el grep correspondiente) antes de tocar nada. Si una tarea ya está hecha, **no se rehace**: el objetivo de esta batería es **elevar la calidad de lo existente con criterio de diseño**, no reconstruir desde cero. Donde un hallazgo original ya no aplique, registrarlo en el cuerpo del commit como "ya resuelto en ronda previa, verificado".
10. **Fuera de alcance explícito (ninguna skill los propone).** (a) La integración **shadcn/ui MCP** de `ui-ux-pro-max` es N/A: el sitio es HTML/CSS/JS vanilla sin framework ni componentes shadcn; no buscar ni sugerir componentes shadcn. (b) **Dark mode** no se aborda en esta batería: la identidad/paleta está congelada y la S1 de tipografía/color quedó excluida; si una skill lo sugiere, se ignora y se anota, no se implementa.

---

## 1. Cómo ejecutar (protocolo de cada sesión)

Cada prompt se copia **completo** en una sesión nueva de Claude Code. El cuerpo de tareas de dominio está **incorporado (inline)** en cada prompt (sección «TASK BODY»), sobre el **contexto común de repositorio** de §3.0 y la **capa de skills** + **reglas de oro**. La batería es autocontenida; no depende de ningún otro archivo del repo salvo el código y la documentación que cada tarea nombra. Flujo invariable dentro de cada prompt:

1. **Consultar `ui-ux-pro-max`** para el dominio del prompt → obtener reglas, anti-patrones y la sección de checklist de prioridad relevante. (Aterriza la decisión en evidencia, no en intuición.)
2. **Ejecutar con `impeccable`** el sub-comando indicado → hace el trabajo de diseño con criterio y craft de producción, tomando como restricciones las reglas del paso 1 y las reglas de oro de §0.
3. **Iterar visualmente con `/impeccable live`** (paso clave en prompts de alta carga visual — marcados abajo). No basta con "verificar": `live` levanta el sitio en el navegador, permite seleccionar elementos y generar/comparar variantes hasta que el resultado se ve bien. Es precisamente la capacidad que faltó en las rondas sin skills. Usarlo en P01 (jerarquía), P16 (botones) y, si aporta, P04 (movimiento). En el resto de prompts (cambios pequeños/tokenización) basta con verificación por captura.
4. **Validar con el checklist de `ui-ux-pro-max`** (Quick Reference, prioridades 1–10 según dominio) como puerta de pre-entrega.
5. **Verificar en navegador** a 375 px y 1280 px, `npm run build:css`, commit, push de la rama nueva, **sin PR**.

> ⚠️ `ui-ux-pro-max` está sesgada a mobile/React Native. **Este es un sitio web estático**: usar siempre `--design-system` y `--domain ux|color|typography|landing|web`, y **nunca** `--stack react-native`. Tomar de sus checklists las reglas aplicables a web (contraste, foco, CLS, jerarquía, formularios, navegación, animación) e ignorar las específicas de iOS/Android (safe-area, haptics, tab-bar, gestos del sistema).

---

## 2. Reparto de skills (cada una donde está optimizada)

| Skill | Rol | Cuándo lidera | Invocación |
|---|---|---|---|
| **`ui-ux-pro-max`** | *Inteligencia de referencia y validación.* 161 paletas, 57 emparejamientos, 99 guías UX, 161 tipos de producto, checklists de prioridad 1–10. No escribe código ni tiene gusto: aporta reglas, anti-patrones y un checklist de pre-entrega objetivo. | **Antes** de decidir (aterrizar la decisión) y **después** de ejecutar (validar). En prompts donde la pregunta es "¿qué regla/anti-patrón aplica aquí?": accesibilidad, performance, formularios, navegación, color semántico, tipografía. | `python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<query>" --design-system` y `--domain <dom>` |
| **`impeccable`** | *Ejecución con criterio de director de diseño.* Anti-AI-slop, registro de marca (`brand`), craft de producción, materiales de movimiento, iteración en navegador. 22 sub-comandos. | **Durante** la ejecución de cada cambio visual/UX: es quien efectivamente diseña y escribe el código a nivel de envío. | Skill tool → `/impeccable <comando> <objetivo>` |

**Mapa prompt → comando(s) de skill** (detalle en cada prompt):

| Prompt | Dominio | `impeccable` (lidera ejecución) | `ui-ux-pro-max` (referencia + checklist) |
|---|---|---|---|
| P00 | Contexto + crítica base | `init` → `document` → `critique` | `--design-system` (registro institucional/educativo) |
| P01 | Jerarquía de componentes, elevación, breadcrumbs | `layout` | `--domain ux "visual-hierarchy spacing elevation z-index"`, `--domain ux "breadcrumb navigation"`; §4–§5 |
| P02 | Responsive (container queries, fluido, print) | `adapt` | `--domain ux "mobile-first breakpoint container-width"`; §5 |
| P03 | Accesibilidad WCAG 2.2 AA | `audit` → `harden` | `--domain ux "accessibility focus contrast keyboard"`; §1, §8 |
| P04 | Sistema de movimiento + View Transitions | `animate` | `--domain ux "animation easing reduced-motion"`; §7 |
| P05 | Rendimiento y entrega de activos | `optimize` | `--domain ux "performance image-optimization font-loading CLS"`; §3 |
| P06 | Tokenizar offset de subrayado y sombra | `typeset` + `polish` | `--domain typography` |
| P07 | Huérfanas en prosa (`text-wrap: pretty`) | `typeset` | `--domain typography "line-length"` |
| P08 | Selección de texto con marca | `colorize` + `polish` | `--domain color` |
| P09 | Medida de lectura 65ch | `typeset` / `layout` | `--domain ux "line-length-control"` |
| P10 | Centralizar ritmo vertical de secciones | `layout` | §5 (`spacing-scale`, `section spacing hierarchy`) |
| P11 | Compensar navbar sticky en anclas | `adapt` | §5 (`fixed-element-offset`) |
| P12 | Nombrar números mágicos restantes | `polish` | — (higiene de tokens) |
| P13 | Fallbacks literales del footer (color-mix) | `harden` | `--domain color "color-accessible-pairs"` |
| P14 | Variantes semánticas de `.tag` | `colorize` | `--domain color "color-semantic"` |
| P15 | Señal de error no dependiente del color | `harden` + `clarify` | §8 (`color-not-only`, `contrast-feedback`) |
| P16 | Elevación de botones en hover/active | `delight` / `animate` | §2 (`press-feedback`, `state-clarity`) |
| P17 | Estado `disabled` de botones | `harden` | §8 (`disabled-states`) |
| P18 | Curva ease-out global + sincronía panel móvil | `animate` | §7 (`motion-consistency`, `easing`) |
| P19 | Extender scroll-reveal a las grillas | `animate` | §7 (`stagger-sequence`, `reduced-motion`) |
| P20 | Reservar espacio de imágenes inyectadas (CLS) | `optimize` | §3 (`image-dimension`, `content-jumping`) |
| P21 | Variantes responsive del hero (LCP) | `optimize` | §3 (`image-optimization`) |
| P22 | Pulido final + crítica de cierre | `polish` → `critique` | Pre-Delivery Checklist completo (§1–§3) |

**Orden vinculante:** P00 → P01 → … → P22. P01–P05 reusan Ronda 1 (S2–S6, **S1 excluido**); P06–P21 reusan Ronda 2 por pilares; P00 y P22 son los bookends que habilitan las skills (crítica base medible al inicio, pulido + re-crítica al cierre).

---

## 3. La batería

### 3.0 Contexto común de repositorio (vale para todos los prompts; no repetir)

- **Stack:** sitio estático en español (es-AR), GitHub Pages. HTML5 semántico, CSS puro con tokens + BEM, JS vanilla en ES-modules. Sin frameworks, sin preprocesadores, sin CDN.
- **`tokens.css`** (raíz del repo) es la única fuente de verdad de valores visuales (color, tipografía, espaciado en escala de 4px, radios, z-index, duraciones). Prohibido hexadecimales/tamaños/fuentes fuera de él (excepción histórica: paleta local de `assets/css/seguimiento.css`).
- **CSS:** 18 hojas BEM en `assets/css/` (entre ellas `cards.css`, `lists.css`, `headers.css`, `navbar.css`, `footer.css`, `cta.css`, `forms.css`, `states.css`, `focus.css`, `print.css`, `nav-secondary.css`, `sobre-asociacion.css`, `countdown-recursos.css`, `seguimiento.css`). Se compilan a `assets/css/main.bundle.css` con `npm run build:css`; las páginas enlazan el bundle.
- **Las 9 páginas:** `index.html`, `pages/sobre-achetiq.html`, `pages/gabinetes.html`, `pages/gabinetes/*.html` (4 detalles), `pages/recursos.html`, `pages/recursos/apuntes.html`, `pages/recursos/seguimiento.html`, `pages/contacto.html`, `404.html`.
- **Datos/JS:** motor data-loader (`assets/js/main.js` escanea `[data-loader]`; `assets/js/loaders.js` renderiza con helpers seguros `createElement`/`safeHref`, nunca `innerHTML` sobre datos) que lee `data/*.json`; navbar/footer son parciales inyectados (`assets/js/navbar.js`, `assets/js/footer.js` + `partials/*.html`). No se modifica el motor, los helpers ni los esquemas JSON.
- **Documentación viva:** `FASE_1_Catalogo_Componentes.md` (catálogo de 23+ componentes) e `INSTRUCCION_PROYECTO.md`. `RENDIMIENTO_Presupuesto.md` guarda el presupuesto de rendimiento.
- **Invariante de movimiento:** reset global `prefers-reduced-motion: reduce` con escape `.safe-motion` en `assets/css/main.css` — preservar exactamente.

> Cada «TASK BODY» nombra los archivos/selectores concretos; las líneas citadas (p. ej. `cards.css:554`) son orientativas de las rondas previas: **verificar la ubicación real** antes de editar (regla de oro 9).

---

### P00 — Contexto de proyecto y crítica base (habilitador de skills)

```text
You are a senior design director establishing the design-skill baseline for a production static website before a multi-session UI/UX elevation pass (Spanish es-AR, GitHub Pages; semantic HTML5 + pure CSS tokens/BEM + vanilla ES-module JS; no frameworks, no CDNs). Two prior improvement rounds were executed WITHOUT design skills and the result was mediocre; you are now grounding the work in the project's two loaded skills. Work on a NEW branch `design/p00-contexto-critica` created from `main`.

GOLDEN RULES (apply to every step): the existing fonts and palette are FROZEN and well-liked — never propose replacing them; impeccable's "new project / palette.mjs / color-strategy" guidance does NOT apply (committed brand identity wins). `assets/css/main.bundle.css` is generated (`npm run build:css`). Do not touch the data-loader engine, security helpers, JSON data, or Spanish copy. Do NOT open a pull request.

Steps:
1. Run `/impeccable init`. Register is `brand` (this is an institutional/association marketing site — design IS part of the product). Produce `PRODUCT.md` and `DESIGN.md` capturing the EXISTING visual system (read `tokens.css`, `assets/css/main.css`, `FASE_1_Catalogo_Componentes.md`, `INSTRUCCION_PROYECTO.md`). DESIGN.md must record the current font pairing and palette as fixed identity, so later sessions preserve it.
2. Run `/impeccable document` to fully capture the design system from existing code.
3. Ground the register with ui-ux-pro-max AND persist it for the 22 downstream sessions: `python3 .claude/skills/ui-ux-pro-max/scripts/search.py "education association nonprofit institutional website" --design-system --persist -p "AChETIQ"`. This writes `design-system/MASTER.md` (a cross-session source of truth that complements impeccable's DESIGN.md). Reconcile its recommendations with the FROZEN identity — keep what aligns, and in MASTER.md explicitly mark the existing font pairing and palette as fixed (note, do not apply, anything that would change them). Commit `design-system/MASTER.md` so P01–P22 can read it.
4. Run `/impeccable critique` on the homepage and the key surfaces (`index.html`, `pages/sobre-achetiq.html`, `pages/gabinetes.html`, one gabinete detail, `pages/recursos/apuntes.html`, `pages/contacto.html`). This produces the measurable BEFORE score (Nielsen 0–40, P0–P3 backlog) that P22 will re-run to prove improvement.

Deliverables: `PRODUCT.md`, `DESIGN.md`, `design-system/MASTER.md`, the `.impeccable/critique/` snapshots, and a short Spanish summary in the commit body mapping each P0/P1 finding to the downstream prompt (P01–P21) that will fix it. Commit `feat(diseño): fijar contexto de marca y crítica base con skills`, push `git push -u origin design/p00-contexto-critica`. Do NOT create a pull request.
```

---

### P01 — Jerarquía de componentes, elevación y breadcrumbs · (reusa Ronda 1 · Sesión 2)

```text
You are a senior design engineer refactoring the component hierarchy and layout of a production static website. Branch from `design/p00-contexto-critica` into a NEW branch `design/p01-jerarquia-layout`.

SKILL PROTOCOL:
1. Reference: `python3 .claude/skills/ui-ux-pro-max/scripts/search.py "layout visual hierarchy elevation spacing" --domain ux` and `… "breadcrumb navigation web" --domain ux`. Note the relevant rules (visual-hierarchy, elevation-consistent, primary-action, breadcrumb-web, spacing-scale) and §4–§5 of its Quick Reference.
2. Execute with `/impeccable layout` (feed it the P00 critique findings about hierarchy/structure and the ui-ux-pro-max rules as constraints). Use impeccable's design judgment for the elevation system and rhythm; respect its bans (no side-stripe borders, no identical card-grid reflex, cards only when truly the best affordance).
3. **Iterate visually with `/impeccable live`** on the homepage and a hub page: this is a high-visual-craft prompt — select the hierarchy/card elements in the browser and refine variants until the structure reads clearly, instead of committing the first pass (this is what the skill-less rounds lacked).
4. Validate against ui-ux-pro-max §5 (Layout) before committing.

TASK BODY (reconcile against the live repo first — golden rule 9: elevation tokens, breadcrumbs and the rhythm contract may already exist from the prior round; verify and ELEVATE, don't redo):
1. Read `FASE_1_Catalogo_Componentes.md` and audit every page against it; produce a reconciliation table (component spec'd vs implemented vs drifted) in the commit body.
2. Tokenize an elevation system in `tokens.css` (`--shadow-1..4` plus a border-based "flat elevation" alternative consistent with the palette) and apply it deliberately: interactive cards get hover elevation, static panels stay flat.
3. Establish vertical rhythm: a documented spacing contract (section padding, header-to-content gap, card internal padding) on the existing 4px-scale tokens, applied across `headers.css`, `cards.css`, `lists.css`, `cta.css`, `sobre-asociacion.css`; deduplicate the header patterns shared by `headers.css` and `sobre-asociacion.css`.
4. Strengthen hierarchy on the homepage and hub pages: one clear primary action per viewport, secondary actions visually subordinate (semantic tokens only — no new colors).
5. Deploy breadcrumbs per the catalog spec on all detail pages (`pages/gabinetes/*.html`, `pages/recursos/apuntes.html`, `pages/recursos/seguimiento.html`) with `<nav aria-label>` + `<ol>` markup and BEM classes in `assets/css/nav-secondary.css`.
6. Modernize the grid layer where it pays off: `gap`, `repeat(auto-fit, minmax(...))` where fixed counts aren't required, CSS subgrid for card internals (title/body/footer) with graceful fallback.
7. Apply the prose-measure token to any long-form text block still lacking it.
8. Update `FASE_1_Catalogo_Componentes.md` (elevation tokens, spacing contract, breadcrumb status, changed components).

OVERRIDES to that body (golden rules win): S1 is considered DONE/frozen — consume the existing color/type tokens, never change their VALUES, and never propose new fonts or palette. Regenerate `assets/css/main.bundle.css` with `npm run build:css` and commit it with the sources.

Verify at 375px and 1280px; confirm breadcrumbs render on every detail page and zero new hardcoded hex/px outside `tokens.css`. Commit `refactar(layout): refinar jerarquía de componentes y desplegar breadcrumbs`, push `git push -u origin design/p01-jerarquia-layout`. Do NOT create a pull request.
```

---

### P02 — Comportamiento responsive · (reusa Ronda 1 · Sesión 3)

```text
You are a senior design engineer upgrading the responsive behavior of a production static website. Branch from `design/p01-jerarquia-layout` into a NEW branch `design/p02-responsive`.

SKILL PROTOCOL:
1. Reference: `python3 .claude/skills/ui-ux-pro-max/scripts/search.py "responsive mobile-first breakpoint container width horizontal-scroll" --domain ux`. Note mobile-first, breakpoint-consistency, container-width, horizontal-scroll, visual-hierarchy; §5 of Quick Reference (web rules only — ignore safe-area/landscape-mobile specifics).
2. Execute with `/impeccable adapt` — it owns multi-width adaptation; use its judgment to make wide screens feel designed (not stretched) and to kill abrupt column jumps. Test heading copy at every breakpoint (impeccable ban: no text overflow).
3. Validate against ui-ux-pro-max §5.

TASK BODY (reconcile first — `print.css` and some fluid spacing may already exist; verify and ELEVATE):
1. Build a responsive audit matrix: every page × {360, 640, 768, 1024, 1280, 1480} by serving locally; record breakages, abrupt jumps, wasted space (include it in the commit body).
2. Convert card grids to container queries (`container-type: inline-size` + `@container` rules) so components adapt to their context; keep viewport media queries as progressive-enhancement fallback.
3. Make spacing fluid: replace per-breakpoint jumps of `--page-padding-x/y`, `--section-gap` and grid gaps with `clamp()` in `tokens.css`.
4. Exploit wide screens at 1280/1480px with deliberate enrichment (wider hero composition, 4-column resource grids, generous whitespace) instead of stretching the 1024px layout.
5. Refine tablet landscape (~1024px): nav, card grids and the seguimiento tool must feel designed, not interpolated.
6. Add `@media print` (`assets/css/print.css` in the build): hide nav/footer/CTA/loaders, black-on-white text, expanded URLs for external links, page-break control on cards/headings.
7. Audit the navbar's responsive transition (hamburger ↔ desktop) for awkward intermediate widths in `assets/css/navbar.css` (visual/layout only).
8. Update `FASE_1_Catalogo_Componentes.md` with the container-query strategy and the breakpoint usage contract.

OVERRIDES: color/type token VALUES are frozen (S1 done) — make spacing fluid, never redefine identity. Regenerate and commit `assets/css/main.bundle.css`.

Verify the full matrix (360/640/768/1024/1280/1480) plus a print preview. Commit `mejorar(responsive): container queries, espaciado fluido y estilos de impresión`, push `git push -u origin design/p02-responsive`. Do NOT create a pull request.
```

---

### P03 — Accesibilidad WCAG 2.2 AA · (reusa Ronda 1 · Sesión 4)

```text
You are a senior accessibility engineer doing a WCAG 2.2 AA pass on a production static website. Branch from `design/p02-responsive` into a NEW branch `design/p03-accesibilidad`.

SKILL PROTOCOL:
1. Reference: `python3 .claude/skills/ui-ux-pro-max/scripts/search.py "accessibility focus contrast keyboard form labels aria" --domain ux`. This is its PRIORITY 1 (CRITICAL) category — treat §1 (Accessibility) and §8 (Forms & Feedback) of the Quick Reference as the mandatory checklist (color-contrast 4.5:1, focus-states, keyboard-nav, aria-labels, form-labels, aria-live-errors, error-summary, focus-management).
2. Execute with `/impeccable audit` first (technical a11y/responsive/perf checks), then `/impeccable harden` for the form pattern and edge/error states. impeccable owns the centralized focus treatment with design taste.
3. Validate: re-run an automated pass (axe-core/Lighthouse a11y) on all 9 pages — zero serious/critical — and the ui-ux-pro-max §1 checklist.

TASK BODY (reconcile first — `assets/css/focus.css` and unified skip-links may already exist from the prior round; verify and ELEVATE):
1. Full audit: keyboard-only walkthrough of every page (tab order, focus visibility, Esc, focus return), landmark/heading review, and an automated pass (axe-core/Lighthouse a11y) on all 9 pages; summarize in a table for the commit body.
2. Unify skip links: same target id `#main-content` and identical markup on every page; ensure the target is focusable (`tabindex="-1"` if needed).
3. Centralized focus system: a tokens-based `:focus-visible` treatment (≥2px outline with offset, AA against every surface it can appear on) defined once in `assets/css/focus.css`; remove scattered per-component focus rules. Cover links, buttons, pills, nav items, form controls, skip links, link-wrapped cards.
4. Fix dynamic announcements: errors inserted by `main.js`/`loaders.js` use `role="alert"`; status updates go into an existing `aria-live` region; the loader→content swap is announced sanely without spamming.
5. Harden the mobile nav: Esc closes the panel and returns focus to the hamburger; focus trapped inside the open panel; `aria-expanded` stays in sync (extend `assets/js/navbar.js`).
6. Target sizes: all interactive targets ≥24×24 CSS px (aim 44×44 on primary controls); fix via padding, not magic numbers.
7. Forms groundwork in `assets/css/forms.css` + `pages/contacto.html`: visible `<label>`s, `aria-describedby` hint/error wiring, error-summary pattern, `:user-invalid` styling with non-color error indication. Markup/CSS/JS pattern only, no backend.
8. Verify contrast of every text/surface pair introduced since the redesign (incl. focus outlines, seguimiento palette) and document ratios in `tokens.css` comments.
9. Update `FASE_1_Catalogo_Componentes.md` (states, focus, forms sections).

OVERRIDES: palette/type token VALUES frozen — if a pair fails contrast, raise it as a finding in the commit body rather than changing the brand tokens (focus-outline tokens are the only ones you may add). Regenerate and commit `assets/css/main.bundle.css` if CSS changed.

Commit `corregir(a11y): centralizar foco y cumplir WCAG 2.2 AA`, push `git push -u origin design/p03-accesibilidad`. Do NOT create a pull request.
```

---

### P04 — Sistema de movimiento + View Transitions · (reusa Ronda 1 · Sesión 5)

```text
You are a senior motion-design engineer adding a restrained motion system to a production static website. Branch from `design/p03-accesibilidad` into a NEW branch `design/p04-movimiento`.

SKILL PROTOCOL:
1. Reference: `python3 .claude/skills/ui-ux-pro-max/scripts/search.py "animation easing duration reduced-motion stagger" --domain ux`. Note §7 (Animation): duration-timing 150–300ms, transform-performance (transform/opacity only), motion-meaning, easing, stagger-sequence, motion-consistency, reduced-motion.
2. Execute with `/impeccable animate` — it owns the motion craft. Follow impeccable's motion rules: ease-out exponential curves (no bounce/elastic), reveals must enhance already-visible content (never gate visibility on a class), staggering a list is legitimate but avoid the uniform-reflex on every section. Premium materials (blur/clip-path/glow) only where they materially help.
3. Optional but recommended for the tricky transitions (data-loader swap, View Transitions): use `/impeccable live` to watch the motion in the real browser and tune timing/easing instead of guessing.
4. Validate against ui-ux-pro-max §7 and the reduced-motion reset.

TASK BODY (reconcile first — duration tokens and a scroll-reveal system already exist; verify and ELEVATE):
1. Inventory every existing animation/transition (file, trigger, duration, easing, reduced-motion behavior) into a table for the commit body; define your motion principles (what moves, why, how far, how long).
2. Tokenize the motion system in `tokens.css`: easing tokens (`--ease-out`, `--ease-in-out`, `--ease-emphasized` ≈ cubic-bezier(0.2,0,0,1), a spring-like `linear()` with documented fallback) and a duration ramp consistent with the existing tokens; migrate all existing transitions/keyframes to use them.
3. Micro-interactions (CSS-only where possible): buttons (hover lift/press compression ≤2px, using the elevation tokens), cards (hover elevation + subtle image scale within `overflow:hidden`), nav links (underline/indicator transitions), pills (selection). Subtle and fast (≤ `--transition-normal`); transform/opacity only, never layout properties.
4. Choreograph content entry: when the data-loader swaps loader → rendered content, fade/translate it in (one class added by JS, animated in CSS) with stagger via an `--index` custom property set on grid children during render in `assets/js/loaders.js`.
5. Upgrade scroll-reveal (`assets/js/scroll-reveal.js` + CSS): add stagger and a translate-distance token; apply deliberately to homepage/hub sections (never above-the-fold) and only as enhancement of already-visible content.
6. Cross-document View Transitions as progressive enhancement: `@view-transition { navigation: auto; }` + tasteful `::view-transition-*` rules (persistent navbar, soft root cross-fade ≤250ms); degrade to instant navigation and disable under reduced motion.
7. Every new animation respects the global reduced-motion reset (or provides a `.safe-motion` alternative); nothing flashes, loops indefinitely (except existing loaders), or exceeds ~500ms for UI feedback.
8. Update `FASE_1_Catalogo_Componentes.md` with motion principles, tokens, and per-component motion specs.

OVERRIDES: token VALUES for color/type/spacing/elevation frozen — add only motion (easing/duration) tokens. Preserve the global `prefers-reduced-motion` reset and `.safe-motion` exactly. Regenerate and commit `assets/css/main.bundle.css`.

Verify every page normally AND with reduced motion emulated; confirm animations run only on transform/opacity/filter. Commit `incorporar(movimiento): sistema de easing, microinteracciones y View Transitions`, push `git push -u origin design/p04-movimiento`. Do NOT create a pull request.
```

---

### P05 — Rendimiento y entrega de activos · (reusa Ronda 1 · Sesión 6)

```text
You are a senior web-performance engineer optimizing asset delivery for a production static website. Branch from `design/p04-movimiento` into a NEW branch `design/p05-rendimiento`.

SKILL PROTOCOL:
1. Reference: `python3 .claude/skills/ui-ux-pro-max/scripts/search.py "performance image optimization font loading critical css CLS LCP" --domain ux`. Note §3 (Performance): image-optimization (WebP/AVIF), image-dimension (CLS), font-loading/font-preload, critical-css, content-jumping.
2. Execute with `/impeccable optimize` — it diagnoses and fixes UI performance with zero visual regression as the goal.
3. Validate: before/after Lighthouse matrix and the ui-ux-pro-max §3 checklist.

TASK BODY (reconcile first — the `build:css` bundle and `RENDIMIENTO_Presupuesto.md` already exist; the @import waterfall is likely already solved — verify and ELEVATE, re-measuring rather than redoing):
1. Lighthouse baseline (mobile + desktop, against a local server) on `index.html`, one gabinete detail, `pages/recursos/apuntes.html`, `pages/contacto.html`; record LCP, CLS, INP/TBT, transfer size per page in a table ("before" column).
2. CSS delivery: confirm the render-blocking `@import` chain is gone and the `npm run build:css` bundle is the single delivered stylesheet; keep the 18-file modular source for development.
3. Font loading: `<link rel="preload" as="font" crossorigin>` for the 1–2 above-the-fold fonts; add `size-adjust`/`ascent-override` fallback metrics to each @font-face fallback so the swap is visually quiet (measure CLS before/after).
4. Image strategy: explicit `width`/`height` (or CSS `aspect-ratio`) on every `<img>` and image-emitting renderer in `assets/js/loaders.js`; `loading="lazy"` + `decoding="async"` below the fold; `fetchpriority="high"` on the LCP hero and eager-load only the first slideshow frame; convert oversized rasters to right-sized WebP.
5. Tame the fetch waterfall: preload the critical path (navbar partial + `data/navbar.json`); reserve space for injected navbar/footer via CSS min-height to remove their CLS.
6. JS scheduling: verify all scripts are `type="module"` (deferred) and page-specific scripts stay page-scoped.
7. Define/refresh the performance budget in `RENDIMIENTO_Presupuesto.md` (LCP < 2.5s mobile, CLS < 0.1, total CSS < 75KB, per-page transfer < 500KB) with re-checkable measurement commands.
8. Re-run the full Lighthouse matrix ("after" column); every metric must improve or hold — explain any that don't.

OVERRIDES: pixel-identical rendering is mandatory (compare screenshots at 375/1280). Token values, component CSS, motion (P04), and a11y (P03) behavior are not to change — only delivery. The CSS bundle already exists via `npm run build:css`; keep it as the delivery mechanism and regenerate/commit it.

Commit `optimizar(rendimiento): entrega de activos y presupuesto de rendimiento`, push `git push -u origin design/p05-rendimiento`. Do NOT create a pull request.
```

---

### P06 — Tokenizar offset de subrayado y sombra de texto del hero · (reusa Ronda 2 · T1)

```text
You are a senior design engineer polishing typography tokens of a production static website. Branch from `design/p05-rendimiento` into a NEW branch `design/p06-tokens-tipograficos`.

SKILL PROTOCOL: consult `python3 .claude/skills/ui-ux-pro-max/scripts/search.py "typography spacing tokens" --domain typography` for confirmation that underline-offset and text-shadow belong in a token tier; execute the change with `/impeccable typeset` (typography craft) and finish with `/impeccable polish`. Fonts and type scale are FROZEN — this is pure tokenization of existing rendered values, zero visual change.

TASK BODY (verify line numbers against the live files first):
1. In `tokens.css` (radii/transitions region) add, with Spanish doc comments: `--underline-offset: 2px;` and `--text-shadow-media: 0 4px 16px color-mix(in srgb, var(--color-text) 60%, transparent), 0 2px 4px color-mix(in srgb, var(--color-text) 80%, transparent);`.
2. Replace hardcoded `text-underline-offset` with `var(--underline-offset)` in `cards.css`, `footer.css`, `forms.css`, `error-404.css`. If any uses 3px, keep its rendered value via a documented local override instead of changing it.
3. Replace the duplicated two-layer `text-shadow` blocks in `headers.css` (the hero title rules) with `text-shadow: var(--text-shadow-media);`. Strictly zero visual change.

OVERRIDES: branch name and "no PR" per golden rules (ignore Ronda 2's single-branch instruction). Regenerate and commit `assets/css/main.bundle.css`. Commit `refactar(tokens): tokenizar offset de subrayado y sombra de texto sobre media`, push `git push -u origin design/p06-tokens-tipograficos`. Do NOT create a pull request.
```

---

### P07 — Control de huérfanas en prosa · (reusa Ronda 2 · T2)

```text
You are a senior design engineer polishing prose typography of a production static website. Branch from `design/p06-tokens-tipograficos` into a NEW branch `design/p07-huerfanas-prosa`.

SKILL PROTOCOL: consult `python3 .claude/skills/ui-ux-pro-max/scripts/search.py "line length readable prose" --domain typography`; execute with `/impeccable typeset` (it explicitly recommends `text-wrap: pretty` on long prose and `balance` on headings — confirm the split). Identity frozen.

TASK BODY: in `assets/css/main.css` global typography section (near the body/heading baseline) add `p, li, figcaption, dd { text-wrap: pretty; }` with a Spanish comment noting (a) it is progressive enhancement — unsupported browsers ignore it — and (b) headings already use `text-wrap: balance` in `headers.css`, so this rule deliberately targets prose only.

OVERRIDES: branch + no-PR per golden rules. Regenerate and commit the bundle. Commit `mejorar(tipografía): controlar huérfanas en prosa con text-wrap pretty`, push `git push -u origin design/p07-huerfanas-prosa`. Do NOT create a pull request.
```

---

### P08 — Selección de texto con marca · (reusa Ronda 2 · T3)

```text
You are a senior design engineer adding branded text selection to a production static website. Branch from `design/p07-huerfanas-prosa` into a NEW branch `design/p08-seleccion-texto`.

SKILL PROTOCOL: consult `python3 .claude/skills/ui-ux-pro-max/scripts/search.py "selection color contrast accessible pairs" --domain color` to confirm both selection pairs meet AA; execute with `/impeccable colorize` then `/impeccable polish`. Uses ONLY the existing frozen palette tokens (patina/arena) — no new colors.

TASK BODY: in `tokens.css`, after the global element baseline (the `body`/`a` rules), add branded selection styling using ONLY existing palette tokens: `::selection { background: var(--patina-100); color: var(--arena-950); }` and `.footer ::selection, .cta-final ::selection, .hero ::selection { background: var(--patina-300); color: var(--patina-950); }`. Compute the real contrast ratio of both pairs and state them in the Spanish comment, matching the file's documentation style. (Reference literals: --patina-100 #CFEAF2, --arena-950 #1C1914, --patina-300 #81BCCD, --patina-950 #072229.)

OVERRIDES: branch + no-PR. Regenerate and commit the bundle. Commit `mejorar(color): marcar la selección de texto con la paleta pátina`, push `git push -u origin design/p08-seleccion-texto`. Do NOT create a pull request.
```

---

### P09 — Imponer medida de lectura en bloques de prosa largos · (reusa Ronda 2 · T4)

```text
You are a senior design engineer enforcing reading measure on a production static website. Branch from `design/p08-seleccion-texto` into a NEW branch `design/p09-medida-lectura`.

SKILL PROTOCOL: consult `python3 .claude/skills/ui-ux-pro-max/scripts/search.py "line length control 65 characters" --domain ux` (line-length-control 60–75 desktop); execute with `/impeccable typeset` (cap body line length 65–75ch — its core typography rule). HTML-only via the existing `.prose` class, no new CSS.

TASK BODY: the reading-measure constraint `max-width: var(--measure-prose)` (65ch) exists only contextually (`.prose` in `text.css`, `.page-header__lead` in `headers.css`). Audit `pages/sobre-achetiq.html`, the four `pages/gabinetes/*.html` details and `pages/recursos.html` for paragraph runs NOT constrained to the prose measure; for each, apply the existing `.prose` class IN THE HTML (no new CSS). Don't touch cards, captions, in-component list items, or single-line text. For content injected by `loaders.js`, the class goes on the container in HTML, not on injected nodes — do not modify the JS. List the blocks changed (page + section) in the commit body.

OVERRIDES: branch + no-PR. No CSS changed → no bundle rebuild needed (confirm). Commit `corregir(tipografía): limitar medida de lectura a 65ch en bloques de prosa largos`, push `git push -u origin design/p09-medida-lectura`. Do NOT create a pull request.
```

---

### P10 — Centralizar el ritmo vertical de secciones · (reusa Ronda 2 · S1)

```text
You are a senior design engineer centralizing vertical rhythm of a production static website. Branch from `design/p09-medida-lectura` into a NEW branch `design/p10-ritmo-vertical`.

SKILL PROTOCOL: consult ui-ux-pro-max §5 (`spacing-scale`, section spacing hierarchy via `python3 .claude/skills/ui-ux-pro-max/scripts/search.py "spacing scale section rhythm" --domain ux`); execute with `/impeccable layout` (it owns spacing rhythm and varying spacing for hierarchy). Strictly zero rendered change — pure centralization.

TASK BODY: several components carry their own literal vertical padding clamps encoding the same two rhythm tiers. (1) In `tokens.css` (fluid layout section) add, with Spanish comments, `--section-pad-y: clamp(48px, 42.86px + 1.43vw, 64px);` (standard section breathing) and `--section-pad-y-lg: clamp(64px, 53.71px + 2.86vw, 96px);` (hero-grade). (2) Consume them, replacing ONLY the vertical component of each literal clamp (keep the distinct horizontal clamps): `.cta-final` (`cta.css`), footer padding (`footer.css`), hero padding (`headers.css` → the `-lg` token), the countdown panel (`countdown-recursos.css`). Confirm computed vertical padding is identical at 360/768/1480px.

OVERRIDES: branch + no-PR. Regenerate and commit the bundle; verify computed padding is identical at 360/768/1480. Commit `refactar(tokens): centralizar ritmo vertical de secciones en alias de padding`, push `git push -u origin design/p10-ritmo-vertical`. Do NOT create a pull request.
```

---

### P11 — Compensar la navbar sticky en destinos de anclas · (reusa Ronda 2 · S2)

```text
You are a senior design engineer fixing sticky-navbar anchor offsets on a production static website. Branch from `design/p10-ritmo-vertical` into a NEW branch `design/p11-scroll-margin`.

SKILL PROTOCOL: consult ui-ux-pro-max §5 (`fixed-element-offset` — fixed navbar must reserve safe space for underlying content); execute with `/impeccable adapt` (layout/viewport behavior).

TASK BODY: the navbar is sticky (`--navbar-height`) and the site uses hash navigation (e.g. `#asociacion`/`#galeria` on `pages/sobre-achetiq.html`), but no `scroll-margin-top` exists, so anchored targets can land under the bar. In `assets/css/main.css` (global reset) add `[id] { scroll-margin-top: calc(var(--navbar-height) + var(--space-4)); }` with a Spanish comment explaining the sticky-navbar compensation (covers current hash panels and future heading anchors). Confirm `scroll-behavior: smooth` still respects the reduced-motion override in `main.css`.

OVERRIDES: branch + no-PR. Regenerate and commit the bundle. Commit `corregir(layout): compensar navbar sticky en destinos de anclas con scroll-margin-top`, push `git push -u origin design/p11-scroll-margin`. Do NOT create a pull request.
```

---

### P12 — Nombrar los números mágicos restantes · (reusa Ronda 2 · S3)

```text
You are a senior design engineer documenting one-off literal dimensions on a production static website. Branch from `design/p11-scroll-margin` into a NEW branch `design/p12-numeros-magicos`.

SKILL PROTOCOL: execute with `/impeccable polish` (final-quality hygiene pass). ui-ux-pro-max not strictly needed; optionally confirm token discipline. Strictly zero visual change.

TASK BODY: convert three one-off literal dimensions into documented LOCAL custom properties, defined at the top of each component's root selector with a Spanish comment explaining the derivation (intentionally local, not global tokens): (1) `error-404.css` `max-width: 560px` → `--error-panel-max: 560px;`; (2) `countdown-recursos.css` `max-width: 880px` → `--countdown-panel-max: 880px;`; (3) `cards.css` `.card-actividad` `grid-template-columns: 80px 1fr` → `--fecha-col: 80px;` and `grid-template-columns: var(--fecha-col) 1fr;`. Strictly zero visual change; diff the bundle to confirm only the expected declarations changed.

OVERRIDES: branch + no-PR. Regenerate and commit the bundle; diff it to confirm only the expected declarations changed. Commit `refactar(css): documentar anchos fijos puntuales como custom properties locales`, push `git push -u origin design/p12-numeros-magicos`. Do NOT create a pull request.
```

---

### P13 — Fallbacks literales para las tintas color-mix del footer · (reusa Ronda 2 · C1)

```text
You are a senior design engineer hardening color robustness of a production static website. Branch from `design/p12-numeros-magicos` into a NEW branch `design/p13-fallbacks-footer`.

SKILL PROTOCOL: consult `python3 .claude/skills/ui-ux-pro-max/scripts/search.py "accessible color pairs fallback" --domain color`; execute with `/impeccable harden` (production robustness, graceful degradation). Uses only existing palette — no new colors.

TASK BODY: in `assets/css/footer.css`, five local custom properties derive footer tints via `color-mix()` with no fallback (`--footer-ink-soft` 78%, `--footer-ink-faint` 60%, `--footer-rule` 18%, `--footer-rule-soft` 10%, `--footer-bg-hover` 10%, all of `--color-on-accent` into transparent). Before each `color-mix()` declaration add a literal fallback declaration of the SAME property using `rgba(250, 247, 243, A)` (from `--color-on-accent` = --arena-50 = #FAF7F3) with alphas 0.78 / 0.60 / 0.18 / 0.10 / 0.10, so the cascade keeps the modern value where supported and degrades gracefully. Add a Spanish comment noting these literals must be re-derived if `--color-on-accent` changes.

OVERRIDES: branch + no-PR. Regenerate and commit the bundle; verify the footer renders identically. Commit `corregir(footer): añadir fallbacks literales a las tintas color-mix`, push `git push -u origin design/p13-fallbacks-footer`. Do NOT create a pull request.
```

---

### P14 — Variantes semánticas de estado para `.tag` · (reusa Ronda 2 · C2)

```text
You are a senior design engineer extending the design system of a production static website. Branch from `design/p13-fallbacks-footer` into a NEW branch `design/p14-tags-semanticos`.

SKILL PROTOCOL: consult `python3 .claude/skills/ui-ux-pro-max/scripts/search.py "semantic color tokens states" --domain color` (color-semantic: define semantic tokens, not raw hex); execute with `/impeccable colorize` (strategic color, reusing the established soft-tint recipe). Derive from existing semantic tokens — no new brand colors.

TASK BODY: `assets/css/states.css` defines `.tag` with a single `.tag--primary` variant; the codebase has an established soft-tint recipe for semantic surfaces (`.loader-error`, `.form__status`). After `.tag--primary`, add three state variants following exactly that recipe, with `<estado>` = positive / negative / warning:
`.tag--<estado> { background: color-mix(in oklab, var(--color-<estado>) 8%, var(--color-surface-raised)); color: var(--color-<estado>); border: 1px solid color-mix(in oklab, var(--color-<estado>) 25%, var(--color-border)); }`
Document in a Spanish comment that all three semantic inks meet AA on the raised surface (positive 7.2:1, negative 7.9:1, warning 5.7:1).

OVERRIDES: branch + no-PR. Regenerate and commit the bundle. Commit `añadir(states): variantes semánticas de tag (positive, negative, warning)`, push `git push -u origin design/p14-tags-semanticos`. Do NOT create a pull request.
```

---

### P15 — Señal de error no dependiente del borde en campos inválidos · (reusa Ronda 2 · C3)

```text
You are a senior design engineer polishing form-error accessibility of a production static website. Branch from `design/p14-tags-semanticos` into a NEW branch `design/p15-campos-invalidos`.

SKILL PROTOCOL: consult ui-ux-pro-max §1/§8 (`color-not-only` — don't convey info by color/border alone; `contrast-feedback` — error states ≥4.5:1) via `python3 .claude/skills/ui-ux-pro-max/scripts/search.py "error not color only contrast feedback" --domain ux`; execute with `/impeccable harden` plus `/impeccable clarify` for any error-affordance copy.

TASK BODY: in `assets/css/forms.css`, the invalid-field block (`.form__input[aria-invalid="true"], .form__input:user-invalid`) signals errors via a 2px `--color-negative` border + padding compensation; the error summary additionally uses a 4% negative tint. Add to that invalid-field block (keeping the existing border and padding compensation): `background: color-mix(in oklab, var(--color-negative) 4%, var(--color-surface-raised));` — mirroring `.form__error-summary` so the field reads as part of the same error system. Add one Spanish comment referencing the shared recipe; confirm placeholder/typed text stays ≥AA on the tint.

OVERRIDES: branch + no-PR. Regenerate and commit the bundle; confirm placeholder/typed text remains ≥AA on the tint. Commit `añadir(forms): teñir fondo de campos inválidos con la receta del error-summary`, push `git push -u origin design/p15-campos-invalidos`. Do NOT create a pull request.
```

---

### P16 — Feedback de elevación en botones · (reusa Ronda 2 · M1)

```text
You are a senior design engineer polishing button micro-interactions of a production static website. Branch from `design/p15-campos-invalidos` into a NEW branch `design/p16-botones-elevacion`.

SKILL PROTOCOL: consult ui-ux-pro-max §2 (`press-feedback`, `state-clarity`) and §7 (`scale-feedback`); execute with `/impeccable delight` (memorable but restrained press/hover) honoring impeccable's motion rules (transform/opacity only, ease-out, reduced-motion neutralizes it). **Use `/impeccable live`** to tune the hover-lift and active-compression in the browser across the dark (hero) and light (cta-final) button contexts — feel matters more than numbers here.

TASK BODY: in `tokens.css` §COMPONENTE — BOTÓN, `.btn` signals hover/active with opacity alone, which reads as unresponsive next to the cards' lift. (1) Extend the transition: `transition: opacity var(--transition-fast), transform var(--transition-fast), box-shadow var(--transition-fast);`. (2) `.btn:hover { opacity: 0.92; transform: translateY(-1px); box-shadow: var(--shadow-xs); }`. (3) `.btn:active { opacity: 0.85; transform: translateY(0); box-shadow: none; }`. (4) Spanish comment noting the lift is -1px (half of `--elevation-lift`) to keep buttons subordinate to cards, and that the global reduced-motion block already neutralizes the motion.

OVERRIDES: branch + no-PR. Do not regress the P05 performance budget (no new render-blocking assets). Regenerate and commit the bundle; test on dark (hero) and light (cta-final) contexts and confirm focus rings unaffected and no motion under reduced-motion. Commit `añadir(buttons): elevación sutil en hover y active`, push `git push -u origin design/p16-botones-elevacion`. Do NOT create a pull request.
```

---

### P17 — Estado disabled para botones · (reusa Ronda 2 · M2)

```text
You are a senior design engineer completing button state coverage of a production static website. Branch from `design/p16-botones-elevacion` into a NEW branch `design/p17-botones-disabled`.

SKILL PROTOCOL: consult ui-ux-pro-max §8 (`disabled-states`: reduced emphasis + cursor change + semantic attribute) via `… "disabled state buttons" --domain ux`; execute with `/impeccable harden` (state coverage / edge cases). Follow the project's existing disabled convention (semantic `--color-text-disabled`, no opacity dimming).

TASK BODY: `.btn` has no disabled styling; the form controls already define the project convention (`forms.css`: semantic `--color-text-disabled`, no opacity dimming, `cursor: not-allowed`). In `tokens.css`, immediately after `.btn:active`, add:
`.btn:disabled, .btn[aria-disabled="true"] { background: var(--color-border-soft); color: var(--color-text-disabled); border-color: transparent; cursor: not-allowed; opacity: 1; transform: none; box-shadow: none; }`
plus a hover/active-neutralizing rule for the same selectors (re-assert opacity/transform/box-shadow so disabled buttons never lift — written to compose correctly whether or not P16 ran). Spanish comment referencing the `forms.css` disabled convention.

OVERRIDES: branch + no-PR. Do not regress the P05 performance budget. Regenerate and commit the bundle. Commit `añadir(buttons): estado disabled coherente con los controles de formulario`, push `git push -u origin design/p17-botones-disabled`. Do NOT create a pull request.
```

---

### P18 — Curva ease-out global y sincronía del panel móvil · (reusa Ronda 2 · M3)

```text
You are a senior design engineer unifying the motion language of a production static website. Branch from `design/p17-botones-disabled` into a NEW branch `design/p18-ease-out-global`.

SKILL PROTOCOL: consult ui-ux-pro-max §7 (`motion-consistency`: unify duration/easing tokens globally; `easing`); execute with `/impeccable animate` (motion craft, single ease-out vocabulary). Aligns with P04's tokenized system — extend it, don't fork it.

TASK BODY: the only refined easing is the navbar-local `--navbar-easing: cubic-bezier(0.22, 1, 0.36, 1)`; everything else uses plain `ease`, and the mobile panel closes with a 240ms transform while its overlay fades 220ms (visible desync). (a) In `tokens.css` §transitions add `--ease-out: cubic-bezier(0.22, 1, 0.36, 1);` (Spanish comment: decelerated exit curve for transform-based motion). (b) In `navbar.css` redefine `--navbar-easing: var(--ease-out);` (keep the alias). (c) Fix the desync: change the panel `transform 240ms` → `220ms` to match the overlay. (d) Apply the curve to the transform/box-shadow entries of the interactive-card transitions in `cards.css`: `transform var(--transition-fast)` → `transform 150ms var(--ease-out)` and `box-shadow var(--transition-fast)` → `box-shadow 150ms var(--ease-out)`, keeping border-color/color on `var(--transition-fast)`. If P04 already tokenized easing, EXTEND that system instead of forking it.

OVERRIDES: branch + no-PR. Do not regress the P05 performance budget. Regenerate and commit the bundle; verify mobile panel + overlay finish together and reduced-motion still neutralizes. Commit `refactar(motion): unificar curva ease-out global y sincronizar cierre del panel móvil`, push `git push -u origin design/p18-ease-out-global`. Do NOT create a pull request.
```

---

### P19 — Extender scroll-reveal a las grillas interiores · (reusa Ronda 2 · M4)

```text
You are a senior design engineer extending entrance-motion of a production static website. Branch from `design/p18-ease-out-global` into a NEW branch `design/p19-scroll-reveal-grillas`.

SKILL PROTOCOL: consult ui-ux-pro-max §7 (`stagger-sequence` 30–50ms/item, `reduced-motion`); execute with `/impeccable animate`. Heed impeccable's rules: reveals must enhance already-visible content (progressive enhancement, never gate visibility), avoid the uniform-reflex.

TASK BODY: `assets/js/scroll-reveal.js` (IntersectionObserver) currently animates only the index about-intro figure and the sobre-asociacion gallery; its armed-state styles live in `assets/css/sobre-asociacion.css` (`.scroll-reveal--armed`), a per-page sheet NOT in the bundle. (1) Read `scroll-reveal.js` first and confirm its contract: it arms arbitrary `[data-scroll-reveal]` elements and adds the armed class ONLY when `prefers-reduced-motion` allows motion — preserve that logic. (2) MOVE (not duplicate) the `.scroll-reveal--armed` rules from `sobre-asociacion.css` into a bundled shared sheet (`assets/css/states.css` is the natural home) so non-index pages get them via the bundle. (3) Add `data-scroll-reveal` to the main `.grid-cards` sections in `pages/gabinetes.html` and `pages/recursos.html` and the contact grid in `pages/contacto.html`, plus the `<script src="…/assets/js/scroll-reveal.js" defer>` include (mind relative-path depth). (4) Reuse the existing reveal styling as-is; no new keyframes; content fully visible without JS.

OVERRIDES: branch + no-PR. Do not regress the P05 performance budget (the moved sheet must not bloat the bundle materially). Regenerate and commit the bundle; confirm content fully visible without JS and static under reduced motion. Commit `añadir(motion): extender scroll-reveal a las grillas de gabinetes, recursos y contacto`, push `git push -u origin design/p19-scroll-reveal-grillas`. Do NOT create a pull request.
```

---

### P20 — Reservar espacio de imágenes inyectadas (CLS) · (reusa Ronda 2 · X1)

```text
You are a senior design engineer eliminating layout-shift risk on a production static website. Branch from `design/p19-scroll-reveal-grillas` into a NEW branch `design/p20-cls-imagenes`.

SKILL PROTOCOL: consult ui-ux-pro-max §3 (`image-dimension` declare width/height or aspect-ratio; `content-jumping` reserve space) via `… "image dimension layout shift CLS" --domain ux`; execute with `/impeccable optimize` (UI performance / CLS). Do not modify the data-loader engine, security helpers, or JSON schema.

TASK BODY: audit every renderer in `assets/js/loaders.js` and `assets/js/gabinete-detalle.js` that creates `<img>` elements (member photos, gallery images, materia covers, noticia covers). For each: if the aspect contract is known (1:1 for integrantes, 16:9 for covers) set explicit `width`/`height` attributes on the created element (e.g. 800×800, 1280×720 — the CSS `object-fit: cover` containers make exact numbers safe) so the browser reserves space before load; if dimensions are genuinely unknowable, confirm the CSS container already enforces `aspect-ratio` (as `.card-materia__cover` does in `cards.css`) and note it in a short code comment. Do NOT modify the data-loader control flow, the security helpers, or any JSON schema. List each renderer touched in the commit body.

OVERRIDES: branch + no-PR. No CSS changed → no bundle rebuild (confirm). Verify zero shift on Slow 3G and CLS < 0.1. Commit `corregir(js): reservar espacio de imágenes inyectadas para evitar CLS`, push `git push -u origin design/p20-cls-imagenes`. Do NOT create a pull request.
```

---

### P21 — Variantes responsive del hero (excepción LCP) · (reusa Ronda 2 · X2)

```text
You are a senior design engineer attacking the documented LCP budget exception of a production static website. Branch from `design/p20-cls-imagenes` into a NEW branch `design/p21-hero-lcp`.

SKILL PROTOCOL: consult ui-ux-pro-max §3 (`image-optimization` responsive srcset; `lazy-load-below-fold`) via `… "responsive images srcset LCP hero" --domain ux`; execute with `/impeccable optimize`. Pixel/visual result unchanged — only resolution served per viewport.

TASK BODY: `RENDIMIENTO_Presupuesto.md` records Inicio's mobile LCP at 3.8s (budget < 2.5s) caused by serving `assets/img/hero/*-1920.webp` (~115KB first frame) to ALL viewports. (1) Generate 800w and 1280w WebP variants of every hero frame into `assets/img/hero/` (use `cwebp` or `sharp` via npx; keep the 1920w originals; match the existing naming, e.g. `2014-800.webp`, `2014-1280.webp`). (2) Update `assets/js/hero-carrousel.js` to select the variant at init via `matchMedia('(max-width: 768px)')`→800w, `(max-width: 1280px)`→1280w, else 1920w; keep the existing preload/defer strategy (first frame eager with priority, the rest after `window.load`). (3) Update the first-frame `<link rel="preload">` in `index.html` to use `imagesrcset` + `imagesizes` so the preloaded resource matches what the JS picks (avoid double-download). (4) Re-measure with the commands documented in `RENDIMIENTO_Presupuesto.md` and update its baseline table and the exception note with the new mobile LCP.

OVERRIDES: branch + no-PR. Verify at 375px the 800w file is preloaded and used with no duplicate request, slideshow rotation and reduced-motion intact. Commit `optimizar(hero): servir variantes responsive del slideshow y actualizar presupuesto`, push `git push -u origin design/p21-hero-lcp`. Do NOT create a pull request.
```

---

### P22 — Pulido final y crítica de cierre (habilitador de skills)

```text
You are a senior design director running the final quality gate of a production static website after a 21-prompt UI/UX elevation pass. Branch from `design/p21-hero-lcp` into a NEW branch `design/p22-pulido-final`.

SKILL PROTOCOL:
1. Run `/impeccable polish` site-wide (it reads the P00 critique snapshot as its backlog) — final cohesion pass across the surfaces touched in P01–P21. Honor the AI-slop test and absolute bans; identity (fonts/palette) stays frozen.
2. Run the ui-ux-pro-max Pre-Delivery Checklist: `python3 .claude/skills/ui-ux-pro-max/scripts/search.py "accessibility animation z-index loading" --domain ux` plus a full pass of its Quick Reference §1–§3 (CRITICAL + HIGH) as the objective gate. Web rules only.
3. **Performance budget guard (re-verify after the mid-sequence additions):** P05 set the budget early, but P06–P21 added CSS to the bundle, motion, and image logic afterward. Re-run the Lighthouse matrix from P05 and check the current `assets/css/main.bundle.css` size against the limits in `RENDIMIENTO_Presupuesto.md` (LCP < 2.5s mobile, CLS < 0.1, total CSS < 75KB, per-page transfer < 500KB). If any metric regressed versus P05's "after" column, fix it here (or, if out of scope, record it as a finding in the commit body).
4. Re-run `/impeccable critique` on the same surfaces as P00 and report the BEFORE→AFTER Nielsen score (trend line) to prove the elevation. Map any remaining P0/P1 to a short follow-up note.

OVERRIDES: branch + no-PR. Regenerate and commit the bundle if any CSS changed. Update `FASE_1_Catalogo_Componentes.md` for anything still stale. Commit `pulir(diseño): pase final de cohesión y crítica de cierre`, push `git push -u origin design/p22-pulido-final`. Do NOT create a pull request.
```

---

## 4. Notas de cierre

- **Trazabilidad de la reutilización.** P01–P05 = Ronda 1 sesiones **S2, S3, S4, S5, S6** (la **S1 de tipografía/color queda excluida**). P06–P21 = Ronda 2 prompts **T1, T2, T3, T4, S1, S2, S3, C1, C2, C3, M1, M2, M3, M4, X1, X2** (16). P00 y P22 son los bookends que las skills habilitan (crítica base medible y pulido + re-crítica de cierre). Total: **23 prompts** en orden estricto.
- **Cadena de ramas.** P00 parte de `main`; cada prompt posterior parte de la rama del anterior, de modo que el trabajo se acumula sin pull requests. Si en algún momento se decide consolidar, se hace fuera de esta batería (la directiva revisa las ramas; esta batería nunca abre PRs).
- **Identidad intacta.** En cualquier prompt, si una skill sugiere cambiar tipografías o paleta, se ignora esa sugerencia y se registra como nota — la identidad visual vigente es un requisito, no una variable.
