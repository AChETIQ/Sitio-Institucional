# AUDITORÍA UI/UX — Batería unificada de prompts (con skills `impeccable` + `ui-ux-pro-max`)

> **Qué es esto.** La lista única, ordenada y autocontenida que unifica los prompts de **Ronda 1** (`AUDITORIA_UIUX_Prompts.md`, las sesiones S1–S6) y **Ronda 2** (`AUDITORIA_UIUX_Prompts_Ronda2.md`, los 15 prompts de pulido) en **una sola secuencia** que se corre en orden. Cada prompt está reescrito para ejecutarse **apoyándose en las dos skills cargadas en el proyecto** (`.claude/skills/impeccable` y `.claude/skills/ui-ux-pro-max`), porque las dos rondas ya se ejecutaron **sin skills** y el resultado no fue bueno.
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

---

## 1. Cómo ejecutar (protocolo de cada sesión)

Cada prompt se copia **completo** en una sesión nueva de Claude Code. El cuerpo de tareas de dominio **se reutiliza por referencia** de los archivos de las rondas previas (siguen en el repo), y este documento añade encima la **capa de skills** y las **reglas de oro**. Flujo invariable dentro de cada prompt:

1. **Consultar `ui-ux-pro-max`** para el dominio del prompt → obtener reglas, anti-patrones y la sección de checklist de prioridad relevante. (Aterriza la decisión en evidencia, no en intuición.)
2. **Ejecutar con `impeccable`** el sub-comando indicado → hace el trabajo de diseño con criterio y craft de producción, tomando como restricciones las reglas del paso 1 y las reglas de oro de §0.
3. **Validar con el checklist de `ui-ux-pro-max`** (Quick Reference, prioridades 1–10 según dominio) como puerta de pre-entrega.
4. **Verificar en navegador** a 375 px y 1280 px, `npm run build:css`, commit, push de la rama nueva, **sin PR**.

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

### P00 — Contexto de proyecto y crítica base (habilitador de skills)

```text
You are a senior design director establishing the design-skill baseline for a production static website before a multi-session UI/UX elevation pass (Spanish es-AR, GitHub Pages; semantic HTML5 + pure CSS tokens/BEM + vanilla ES-module JS; no frameworks, no CDNs). Two prior improvement rounds were executed WITHOUT design skills and the result was mediocre; you are now grounding the work in the project's two loaded skills. Work on a NEW branch `design/p00-contexto-critica` created from `main`.

GOLDEN RULES (apply to every step): the existing fonts and palette are FROZEN and well-liked — never propose replacing them; impeccable's "new project / palette.mjs / color-strategy" guidance does NOT apply (committed brand identity wins). `assets/css/main.bundle.css` is generated (`npm run build:css`). Do not touch the data-loader engine, security helpers, JSON data, or Spanish copy. Do NOT open a pull request.

Steps:
1. Run `/impeccable init`. Register is `brand` (this is an institutional/association marketing site — design IS part of the product). Produce `PRODUCT.md` and `DESIGN.md` capturing the EXISTING visual system (read `tokens.css`, `assets/css/main.css`, `FASE_1_Catalogo_Componentes.md`, `INSTRUCCION_PROYECTO.md`). DESIGN.md must record the current font pairing and palette as fixed identity, so later sessions preserve it.
2. Run `/impeccable document` to fully capture the design system from existing code.
3. Ground the register with ui-ux-pro-max: `python3 .claude/skills/ui-ux-pro-max/scripts/search.py "education association nonprofit institutional website" --design-system`. Reconcile its recommendations with the FROZEN identity — keep what aligns, note (do not apply) anything that would change fonts/colors.
4. Run `/impeccable critique` on the homepage and the key surfaces (`index.html`, `pages/sobre-achetiq.html`, `pages/gabinetes.html`, one gabinete detail, `pages/recursos/apuntes.html`, `pages/contacto.html`). This produces the measurable BEFORE score (Nielsen 0–40, P0–P3 backlog) that P22 will re-run to prove improvement.

Deliverables: `PRODUCT.md`, `DESIGN.md`, the `.impeccable/critique/` snapshots, and a short Spanish summary in the commit body mapping each P0/P1 finding to the downstream prompt (P01–P21) that will fix it. Commit `feat(diseño): fijar contexto de marca y crítica base con skills`, push `git push -u origin design/p00-contexto-critica`. Do NOT create a pull request.
```

---

### P01 — Jerarquía de componentes, elevación y breadcrumbs · (reusa Ronda 1 · Sesión 2)

```text
You are a senior design engineer refactoring the component hierarchy and layout of a production static website. Branch from `design/p00-contexto-critica` into a NEW branch `design/p01-jerarquia-layout`.

SKILL PROTOCOL:
1. Reference: `python3 .claude/skills/ui-ux-pro-max/scripts/search.py "layout visual hierarchy elevation spacing" --domain ux` and `… "breadcrumb navigation web" --domain ux`. Note the relevant rules (visual-hierarchy, elevation-consistent, primary-action, breadcrumb-web, spacing-scale) and §4–§5 of its Quick Reference.
2. Execute with `/impeccable layout` (feed it the P00 critique findings about hierarchy/structure and the ui-ux-pro-max rules as constraints). Use impeccable's design judgment for the elevation system and rhythm; respect its bans (no side-stripe borders, no identical card-grid reflex, cards only when truly the best affordance).
3. Validate against ui-ux-pro-max §5 (Layout) before committing.

TASK BODY: execute the numbered Tasks 1–8 of "Sesión 2 — Component Hierarchy & Layout" in `AUDITORIA_UIUX_Prompts.md` (elevation tokens, vertical-rhythm contract, hierarchy on home/hub pages, deploy breadcrumbs on all detail pages via `assets/css/nav-secondary.css`, modernize grids, prose measure, update the catalog).

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

TASK BODY: execute Tasks 1–8 of "Sesión 3 — Responsive Behavior" in `AUDITORIA_UIUX_Prompts.md` (responsive audit matrix, container queries for card grids with viewport fallback, fluid spacing via clamp(), wide-screen enrichment, tablet-landscape refinement, `assets/css/print.css`, navbar transition audit, update catalog).

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

TASK BODY: execute Tasks 1–9 of "Sesión 4 — Accessibility" in `AUDITORIA_UIUX_Prompts.md` (unify skip links to `#main-content`, centralized `:focus-visible` in `assets/css/focus.css`, dynamic announcements `role="alert"`/`aria-live`, harden mobile nav focus trap + Esc, 24×24 target sizes, accessible contact-form pattern, contrast verification, update catalog).

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
3. Validate against ui-ux-pro-max §7 and the reduced-motion reset.

TASK BODY: execute Tasks 1–8 of "Sesión 5 — Animations & Micro-interactions" in `AUDITORIA_UIUX_Prompts.md` (motion inventory + principles, tokenize easing + duration ramp, micro-interactions on buttons/cards/nav/pills, content-entry choreography on data-loader swap with `--index` stagger, upgrade scroll-reveal with stagger, cross-document View Transitions as progressive enhancement, reduced-motion safety, update catalog).

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

TASK BODY: execute Tasks 1–8 of "Sesión 6 — Performance & Asset Delivery" in `AUDITORIA_UIUX_Prompts.md` (Lighthouse baseline, kill the @import waterfall / keep the build:css bundle, font preload + size-adjust fallback metrics, image width/height + lazy + fetchpriority + WebP, tame the fetch waterfall, JS scheduling, write/update `RENDIMIENTO_Presupuesto.md`, re-run the matrix).

OVERRIDES: pixel-identical rendering is mandatory (compare screenshots at 375/1280). Token values, component CSS, motion (P04), and a11y (P03) behavior are not to change — only delivery. The CSS bundle already exists via `npm run build:css`; keep it as the delivery mechanism and regenerate/commit it.

Commit `optimizar(rendimiento): entrega de activos y presupuesto de rendimiento`, push `git push -u origin design/p05-rendimiento`. Do NOT create a pull request.
```

---

### P06 — Tokenizar offset de subrayado y sombra de texto del hero · (reusa Ronda 2 · T1)

```text
You are a senior design engineer polishing typography tokens of a production static website. Branch from `design/p05-rendimiento` into a NEW branch `design/p06-tokens-tipograficos`.

SKILL PROTOCOL: consult `python3 .claude/skills/ui-ux-pro-max/scripts/search.py "typography spacing tokens" --domain typography` for confirmation that underline-offset and text-shadow belong in a token tier; execute the change with `/impeccable typeset` (typography craft) and finish with `/impeccable polish`. Fonts and type scale are FROZEN — this is pure tokenization of existing rendered values, zero visual change.

TASK BODY: execute PROMPT T1 of `AUDITORIA_UIUX_Prompts_Ronda2.md` (add `--underline-offset` and `--text-shadow-media` tokens; consume them in cards/footer/forms/error-404 and headers).

OVERRIDES: branch name and "no PR" per golden rules (ignore Ronda 2's single-branch instruction). Regenerate and commit `assets/css/main.bundle.css`. Commit `refactar(tokens): tokenizar offset de subrayado y sombra de texto sobre media`, push `git push -u origin design/p06-tokens-tipograficos`. Do NOT create a pull request.
```

---

### P07 — Control de huérfanas en prosa · (reusa Ronda 2 · T2)

```text
You are a senior design engineer polishing prose typography of a production static website. Branch from `design/p06-tokens-tipograficos` into a NEW branch `design/p07-huerfanas-prosa`.

SKILL PROTOCOL: consult `python3 .claude/skills/ui-ux-pro-max/scripts/search.py "line length readable prose" --domain typography`; execute with `/impeccable typeset` (it explicitly recommends `text-wrap: pretty` on long prose and `balance` on headings — confirm the split). Identity frozen.

TASK BODY: execute PROMPT T2 of `AUDITORIA_UIUX_Prompts_Ronda2.md` (`p, li, figcaption, dd { text-wrap: pretty; }` in the global typography section, with the documented progressive-enhancement note).

OVERRIDES: branch + no-PR per golden rules. Regenerate and commit the bundle. Commit `mejorar(tipografía): controlar huérfanas en prosa con text-wrap pretty`, push `git push -u origin design/p07-huerfanas-prosa`. Do NOT create a pull request.
```

---

### P08 — Selección de texto con marca · (reusa Ronda 2 · T3)

```text
You are a senior design engineer adding branded text selection to a production static website. Branch from `design/p07-huerfanas-prosa` into a NEW branch `design/p08-seleccion-texto`.

SKILL PROTOCOL: consult `python3 .claude/skills/ui-ux-pro-max/scripts/search.py "selection color contrast accessible pairs" --domain color` to confirm both selection pairs meet AA; execute with `/impeccable colorize` then `/impeccable polish`. Uses ONLY the existing frozen palette tokens (patina/arena) — no new colors.

TASK BODY: execute PROMPT T3 of `AUDITORIA_UIUX_Prompts_Ronda2.md` (`::selection` and context-specific footer/cta/hero selection rules, with computed contrast ratios documented in Spanish).

OVERRIDES: branch + no-PR. Regenerate and commit the bundle. Commit `mejorar(color): marcar la selección de texto con la paleta pátina`, push `git push -u origin design/p08-seleccion-texto`. Do NOT create a pull request.
```

---

### P09 — Imponer medida de lectura en bloques de prosa largos · (reusa Ronda 2 · T4)

```text
You are a senior design engineer enforcing reading measure on a production static website. Branch from `design/p08-seleccion-texto` into a NEW branch `design/p09-medida-lectura`.

SKILL PROTOCOL: consult `python3 .claude/skills/ui-ux-pro-max/scripts/search.py "line length control 65 characters" --domain ux` (line-length-control 60–75 desktop); execute with `/impeccable typeset` (cap body line length 65–75ch — its core typography rule). HTML-only via the existing `.prose` class, no new CSS.

TASK BODY: execute PROMPT T4 of `AUDITORIA_UIUX_Prompts_Ronda2.md` (audit `sobre-achetiq`, the four gabinete details, `recursos`; apply `.prose` to unconstrained long-form blocks; list changed blocks in the commit body).

OVERRIDES: branch + no-PR. No CSS changed → no bundle rebuild needed (confirm). Commit `corregir(tipografía): limitar medida de lectura a 65ch en bloques de prosa largos`, push `git push -u origin design/p09-medida-lectura`. Do NOT create a pull request.
```

---

### P10 — Centralizar el ritmo vertical de secciones · (reusa Ronda 2 · S1)

```text
You are a senior design engineer centralizing vertical rhythm of a production static website. Branch from `design/p09-medida-lectura` into a NEW branch `design/p10-ritmo-vertical`.

SKILL PROTOCOL: consult ui-ux-pro-max §5 (`spacing-scale`, section spacing hierarchy via `python3 .claude/skills/ui-ux-pro-max/scripts/search.py "spacing scale section rhythm" --domain ux`); execute with `/impeccable layout` (it owns spacing rhythm and varying spacing for hierarchy). Strictly zero rendered change — pure centralization.

TASK BODY: execute PROMPT S1 of `AUDITORIA_UIUX_Prompts_Ronda2.md` (add `--section-pad-y` / `--section-pad-y-lg` clamps; consume the vertical component in cta/footer/hero/countdown).

OVERRIDES: branch + no-PR. Regenerate and commit the bundle; verify computed padding is identical at 360/768/1480. Commit `refactar(tokens): centralizar ritmo vertical de secciones en alias de padding`, push `git push -u origin design/p10-ritmo-vertical`. Do NOT create a pull request.
```

---

### P11 — Compensar la navbar sticky en destinos de anclas · (reusa Ronda 2 · S2)

```text
You are a senior design engineer fixing sticky-navbar anchor offsets on a production static website. Branch from `design/p10-ritmo-vertical` into a NEW branch `design/p11-scroll-margin`.

SKILL PROTOCOL: consult ui-ux-pro-max §5 (`fixed-element-offset` — fixed navbar must reserve safe space for underlying content); execute with `/impeccable adapt` (layout/viewport behavior).

TASK BODY: execute PROMPT S2 of `AUDITORIA_UIUX_Prompts_Ronda2.md` (`[id] { scroll-margin-top: calc(var(--navbar-height) + var(--space-4)); }` in the global reset, with Spanish comment; confirm reduced-motion override still respected).

OVERRIDES: branch + no-PR. Regenerate and commit the bundle. Commit `corregir(layout): compensar navbar sticky en destinos de anclas con scroll-margin-top`, push `git push -u origin design/p11-scroll-margin`. Do NOT create a pull request.
```

---

### P12 — Nombrar los números mágicos restantes · (reusa Ronda 2 · S3)

```text
You are a senior design engineer documenting one-off literal dimensions on a production static website. Branch from `design/p11-scroll-margin` into a NEW branch `design/p12-numeros-magicos`.

SKILL PROTOCOL: execute with `/impeccable polish` (final-quality hygiene pass). ui-ux-pro-max not strictly needed; optionally confirm token discipline. Strictly zero visual change.

TASK BODY: execute PROMPT S3 of `AUDITORIA_UIUX_Prompts_Ronda2.md` (turn the 560px error-panel, 880px countdown-panel, and `80px 1fr` card-actividad grid into documented LOCAL custom properties).

OVERRIDES: branch + no-PR. Regenerate and commit the bundle; diff it to confirm only the expected declarations changed. Commit `refactar(css): documentar anchos fijos puntuales como custom properties locales`, push `git push -u origin design/p12-numeros-magicos`. Do NOT create a pull request.
```

---

### P13 — Fallbacks literales para las tintas color-mix del footer · (reusa Ronda 2 · C1)

```text
You are a senior design engineer hardening color robustness of a production static website. Branch from `design/p12-numeros-magicos` into a NEW branch `design/p13-fallbacks-footer`.

SKILL PROTOCOL: consult `python3 .claude/skills/ui-ux-pro-max/scripts/search.py "accessible color pairs fallback" --domain color`; execute with `/impeccable harden` (production robustness, graceful degradation). Uses only existing palette — no new colors.

TASK BODY: execute PROMPT C1 of `AUDITORIA_UIUX_Prompts_Ronda2.md` (literal `rgba()` fallbacks before each `color-mix()` footer tint, with the re-derivation note).

OVERRIDES: branch + no-PR. Regenerate and commit the bundle; verify the footer renders identically. Commit `corregir(footer): añadir fallbacks literales a las tintas color-mix`, push `git push -u origin design/p13-fallbacks-footer`. Do NOT create a pull request.
```

---

### P14 — Variantes semánticas de estado para `.tag` · (reusa Ronda 2 · C2)

```text
You are a senior design engineer extending the design system of a production static website. Branch from `design/p13-fallbacks-footer` into a NEW branch `design/p14-tags-semanticos`.

SKILL PROTOCOL: consult `python3 .claude/skills/ui-ux-pro-max/scripts/search.py "semantic color tokens states" --domain color` (color-semantic: define semantic tokens, not raw hex); execute with `/impeccable colorize` (strategic color, reusing the established soft-tint recipe). Derive from existing semantic tokens — no new brand colors.

TASK BODY: execute PROMPT C2 of `AUDITORIA_UIUX_Prompts_Ronda2.md` (add `.tag--positive/negative/warning` following the loader-error/form-status recipe, documenting AA ratios).

OVERRIDES: branch + no-PR. Regenerate and commit the bundle. Commit `añadir(states): variantes semánticas de tag (positive, negative, warning)`, push `git push -u origin design/p14-tags-semanticos`. Do NOT create a pull request.
```

---

### P15 — Señal de error no dependiente del borde en campos inválidos · (reusa Ronda 2 · C3)

```text
You are a senior design engineer polishing form-error accessibility of a production static website. Branch from `design/p14-tags-semanticos` into a NEW branch `design/p15-campos-invalidos`.

SKILL PROTOCOL: consult ui-ux-pro-max §1/§8 (`color-not-only` — don't convey info by color/border alone; `contrast-feedback` — error states ≥4.5:1) via `python3 .claude/skills/ui-ux-pro-max/scripts/search.py "error not color only contrast feedback" --domain ux`; execute with `/impeccable harden` plus `/impeccable clarify` for any error-affordance copy.

TASK BODY: execute PROMPT C3 of `AUDITORIA_UIUX_Prompts_Ronda2.md` (add the 4% negative tint background to the invalid-field block, mirroring `.form__error-summary`).

OVERRIDES: branch + no-PR. Regenerate and commit the bundle; confirm placeholder/typed text remains ≥AA on the tint. Commit `añadir(forms): teñir fondo de campos inválidos con la receta del error-summary`, push `git push -u origin design/p15-campos-invalidos`. Do NOT create a pull request.
```

---

### P16 — Feedback de elevación en botones · (reusa Ronda 2 · M1)

```text
You are a senior design engineer polishing button micro-interactions of a production static website. Branch from `design/p15-campos-invalidos` into a NEW branch `design/p16-botones-elevacion`.

SKILL PROTOCOL: consult ui-ux-pro-max §2 (`press-feedback`, `state-clarity`) and §7 (`scale-feedback`); execute with `/impeccable delight` (memorable but restrained press/hover) honoring impeccable's motion rules (transform/opacity only, ease-out, reduced-motion neutralizes it).

TASK BODY: execute PROMPT M1 of `AUDITORIA_UIUX_Prompts_Ronda2.md` (extend `.btn` transition; hover lift -1px + `--shadow-xs`; active compression; Spanish comment about subordination to cards and reduced-motion).

OVERRIDES: branch + no-PR. Regenerate and commit the bundle; test on dark (hero) and light (cta-final) contexts and confirm focus rings unaffected and no motion under reduced-motion. Commit `añadir(buttons): elevación sutil en hover y active`, push `git push -u origin design/p16-botones-elevacion`. Do NOT create a pull request.
```

---

### P17 — Estado disabled para botones · (reusa Ronda 2 · M2)

```text
You are a senior design engineer completing button state coverage of a production static website. Branch from `design/p16-botones-elevacion` into a NEW branch `design/p17-botones-disabled`.

SKILL PROTOCOL: consult ui-ux-pro-max §8 (`disabled-states`: reduced emphasis + cursor change + semantic attribute) via `… "disabled state buttons" --domain ux`; execute with `/impeccable harden` (state coverage / edge cases). Follow the project's existing disabled convention (semantic `--color-text-disabled`, no opacity dimming).

TASK BODY: execute PROMPT M2 of `AUDITORIA_UIUX_Prompts_Ronda2.md` (`.btn:disabled` / `[aria-disabled="true"]` styling + hover/active-neutralizing rule that composes correctly whether or not M1/P16 ran).

OVERRIDES: branch + no-PR. Regenerate and commit the bundle. Commit `añadir(buttons): estado disabled coherente con los controles de formulario`, push `git push -u origin design/p17-botones-disabled`. Do NOT create a pull request.
```

---

### P18 — Curva ease-out global y sincronía del panel móvil · (reusa Ronda 2 · M3)

```text
You are a senior design engineer unifying the motion language of a production static website. Branch from `design/p17-botones-disabled` into a NEW branch `design/p18-ease-out-global`.

SKILL PROTOCOL: consult ui-ux-pro-max §7 (`motion-consistency`: unify duration/easing tokens globally; `easing`); execute with `/impeccable animate` (motion craft, single ease-out vocabulary). Aligns with P04's tokenized system — extend it, don't fork it.

TASK BODY: execute PROMPT M3 of `AUDITORIA_UIUX_Prompts_Ronda2.md` (add `--ease-out` token; redefine `--navbar-easing` to it; fix the 240ms→220ms desync; apply the curve to interactive-card transform/box-shadow transitions).

OVERRIDES: branch + no-PR. Regenerate and commit the bundle; verify mobile panel + overlay finish together and reduced-motion still neutralizes. Commit `refactar(motion): unificar curva ease-out global y sincronizar cierre del panel móvil`, push `git push -u origin design/p18-ease-out-global`. Do NOT create a pull request.
```

---

### P19 — Extender scroll-reveal a las grillas interiores · (reusa Ronda 2 · M4)

```text
You are a senior design engineer extending entrance-motion of a production static website. Branch from `design/p18-ease-out-global` into a NEW branch `design/p19-scroll-reveal-grillas`.

SKILL PROTOCOL: consult ui-ux-pro-max §7 (`stagger-sequence` 30–50ms/item, `reduced-motion`); execute with `/impeccable animate`. Heed impeccable's rules: reveals must enhance already-visible content (progressive enhancement, never gate visibility), avoid the uniform-reflex.

TASK BODY: execute PROMPT M4 of `AUDITORIA_UIUX_Prompts_Ronda2.md` (preserve scroll-reveal.js reduced-motion contract; MOVE `.scroll-reveal--armed` into a bundled sheet; add `data-scroll-reveal` + script include to gabinetes/recursos/contacto grids).

OVERRIDES: branch + no-PR. Regenerate and commit the bundle; confirm content fully visible without JS and static under reduced motion. Commit `añadir(motion): extender scroll-reveal a las grillas de gabinetes, recursos y contacto`, push `git push -u origin design/p19-scroll-reveal-grillas`. Do NOT create a pull request.
```

---

### P20 — Reservar espacio de imágenes inyectadas (CLS) · (reusa Ronda 2 · X1)

```text
You are a senior design engineer eliminating layout-shift risk on a production static website. Branch from `design/p19-scroll-reveal-grillas` into a NEW branch `design/p20-cls-imagenes`.

SKILL PROTOCOL: consult ui-ux-pro-max §3 (`image-dimension` declare width/height or aspect-ratio; `content-jumping` reserve space) via `… "image dimension layout shift CLS" --domain ux`; execute with `/impeccable optimize` (UI performance / CLS). Do not modify the data-loader engine, security helpers, or JSON schema.

TASK BODY: execute PROMPT X1 of `AUDITORIA_UIUX_Prompts_Ronda2.md` (set explicit width/height on `<img>` created by `loaders.js`/`gabinete-detalle.js`, or confirm CSS aspect-ratio; list each renderer touched).

OVERRIDES: branch + no-PR. No CSS changed → no bundle rebuild (confirm). Verify zero shift on Slow 3G and CLS < 0.1. Commit `corregir(js): reservar espacio de imágenes inyectadas para evitar CLS`, push `git push -u origin design/p20-cls-imagenes`. Do NOT create a pull request.
```

---

### P21 — Variantes responsive del hero (excepción LCP) · (reusa Ronda 2 · X2)

```text
You are a senior design engineer attacking the documented LCP budget exception of a production static website. Branch from `design/p20-cls-imagenes` into a NEW branch `design/p21-hero-lcp`.

SKILL PROTOCOL: consult ui-ux-pro-max §3 (`image-optimization` responsive srcset; `lazy-load-below-fold`) via `… "responsive images srcset LCP hero" --domain ux`; execute with `/impeccable optimize`. Pixel/visual result unchanged — only resolution served per viewport.

TASK BODY: execute PROMPT X2 of `AUDITORIA_UIUX_Prompts_Ronda2.md` (generate 800w/1280w WebP hero variants; select by matchMedia in `hero-carrousel.js`; update the `<link rel=preload>` with `imagesrcset`/`imagesizes`; re-measure and update `RENDIMIENTO_Presupuesto.md`).

OVERRIDES: branch + no-PR. Verify at 375px the 800w file is preloaded and used with no duplicate request, slideshow rotation and reduced-motion intact. Commit `optimizar(hero): servir variantes responsive del slideshow y actualizar presupuesto`, push `git push -u origin design/p21-hero-lcp`. Do NOT create a pull request.
```

---

### P22 — Pulido final y crítica de cierre (habilitador de skills)

```text
You are a senior design director running the final quality gate of a production static website after a 21-prompt UI/UX elevation pass. Branch from `design/p21-hero-lcp` into a NEW branch `design/p22-pulido-final`.

SKILL PROTOCOL:
1. Run `/impeccable polish` site-wide (it reads the P00 critique snapshot as its backlog) — final cohesion pass across the surfaces touched in P01–P21. Honor the AI-slop test and absolute bans; identity (fonts/palette) stays frozen.
2. Run the ui-ux-pro-max Pre-Delivery Checklist: `python3 .claude/skills/ui-ux-pro-max/scripts/search.py "accessibility animation z-index loading" --domain ux` plus a full pass of its Quick Reference §1–§3 (CRITICAL + HIGH) as the objective gate. Web rules only.
3. Re-run `/impeccable critique` on the same surfaces as P00 and report the BEFORE→AFTER Nielsen score (trend line) to prove the elevation. Map any remaining P0/P1 to a short follow-up note.

OVERRIDES: branch + no-PR. Regenerate and commit the bundle if any CSS changed. Update `FASE_1_Catalogo_Componentes.md` for anything still stale. Commit `pulir(diseño): pase final de cohesión y crítica de cierre`, push `git push -u origin design/p22-pulido-final`. Do NOT create a pull request.
```

---

## 4. Notas de cierre

- **Trazabilidad de la reutilización.** P01–P05 = Ronda 1 sesiones **S2, S3, S4, S5, S6** (la **S1 de tipografía/color queda excluida**). P06–P21 = Ronda 2 prompts **T1, T2, T3, T4, S1, S2, S3, C1, C2, C3, M1, M2, M3, M4, X1, X2** (16). P00 y P22 son los bookends que las skills habilitan (crítica base medible y pulido + re-crítica de cierre). Total: **23 prompts** en orden estricto.
- **Cadena de ramas.** P00 parte de `main`; cada prompt posterior parte de la rama del anterior, de modo que el trabajo se acumula sin pull requests. Si en algún momento se decide consolidar, se hace fuera de esta batería (la directiva revisa las ramas; esta batería nunca abre PRs).
- **Identidad intacta.** En cualquier prompt, si una skill sugiere cambiar tipografías o paleta, se ignora esa sugerencia y se registra como nota — la identidad visual vigente es un requisito, no una variable.
