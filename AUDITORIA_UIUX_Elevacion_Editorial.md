# ELEVACIÓN EDITORIAL — Batería de rediseño página por página (skills `impeccable` + `ui-ux-pro-max`)

> **Qué es esto.** Una batería **nueva y distinta** de la anterior (`AUDITORIA_UIUX_Bateria_Skills.md`, 23 prompts P00–P22), que **no la reemplaza**: aquella queda como referencia histórica. La de antes era un rosario de **micro-ajustes de token** (offset de subrayado, sombra de texto, viudas, fallbacks de `color-mix`…) que **las rondas previas ya aplicaron** — por eso, prompt tras prompt, la consola respondía "ya estaba implementado". Y además **congelaba** tipografía y paleta, así que el cambio visible era casi nulo.
>
> **Esta batería es otra cosa.** Son **8 prompts grandes** (E00–E07), **uno por vista** (rediseño página por página), cuyo objetivo es **elevar el sitio a nivel profesional y elegante** con un carácter **editorial / institucional sofisticado** (tipografía protagonista, mucho aire, retícula fuerte, sobrio y atemporal — propio de una asociación histórica), **evolucionando dentro del espíritu de marca**: el ADN se conserva, pero el sistema visual sí puede madurar.
>
> **Las skills se usan donde rinden.** `ui-ux-pro-max` aporta la *inteligencia de referencia* (reglas, anti-patrones, checklists de prioridad). `impeccable` aporta la *ejecución con criterio de director de diseño* y, sobre todo, **`/impeccable live`** para **iterar en el navegador** — exactamente lo que faltó en las rondas que se hicieron sin skills y quedaron mediocres.
>
> Los prompts están redactados en **inglés** (convención de la casa); el sitio, sus comentarios CSS y sus commits permanecen en **español (es-AR)**.

---

## 0. Reglas de oro (leer una vez; aplican a TODOS los prompts)

Estas reglas sustituyen a cualquier instrucción equivalente en conflicto. **La diferencia central con la batería vieja está en la regla 1.**

1. **La identidad EVOLUCIONA, no se reinicia (y tampoco se congela).** La web debe seguir siendo **reconociblemente AChETIQ**, pero el sistema visual puede **madurar** hacia lo editorial.
   - **Núcleo intocable:** las **familias** tipográficas Fraunces (display), Hanken Grotesk (cuerpo) y Geist Mono (etiqueta/mono); y los **anclas** de paleta Cobalto y Mauveína (Mauveína sigue siendo el acento de acción, regla del ≤10% de pantalla).
   - **Permitido y esperado:** refinar la **escala y jerarquía tipográfica** (tamaños, pesos, tracking, line-height, optical sizing de Fraunces), **extender la rampa de neutros y superficies** (más peldaños, superficies de "papel frío" — nunca cálidas), **añadir tintes/acentos derivados** de los tonos vigentes (alias, estados, una superficie de realce sobria), **reglas hairline y divisores editoriales**, y refinar **elevación y ritmo**. Todo valor nuevo va a `tokens.css`.
   - **Prohibido:** reemplazar las familias tipográficas; abandonar Cobalto/Mauveína como marca; **fondo cálido crema/arena/papel** ("el default saturado de la IA 2026" — el fondo es **porcelana fría**, anti-patrón ya documentado en `PRODUCT.md`/`DESIGN.md` y en la guía de impeccable); y **dark mode** (fuera de alcance en esta batería).
2. **No regresar lo ya ganado.** El repo ya trae trabajo real: accesibilidad (foco centralizado en `assets/css/focus.css`, skip-links unificados, WCAG 2.2 AA), rendimiento (bundle `npm run build:css`, presupuesto en `RENDIMIENTO_Presupuesto.md`), movimiento tokenizado y el reset `prefers-reduced-motion` con escape `.safe-motion`. **Todo rediseño preserva o mejora esto; jamás lo rompe.** Si un cambio editorial entra en tensión con la accesibilidad, gana la accesibilidad.
3. **Una rama nueva por prompt, cadena lineal, sin PR.** Cada prompt crea su rama `design/eNN-…` **a partir de la rama del prompt anterior** (E00 parte de `main`). Solo `commit` + `git push -u origin design/eNN-…`. **Prohibido abrir Pull Requests.**
4. **`main.bundle.css` es un artefacto generado.** Tras tocar cualquier CSS fuente, regenerar con `npm run build:css` y commitear el bundle junto con las fuentes. Nunca editar el bundle a mano. Las páginas enlazan `assets/css/main.bundle.css`.
5. **Stack y datos intocables.** HTML5 semántico, CSS puro con tokens + BEM, JS vanilla ES-modules. Sin frameworks, sin CDN, sin preprocesadores. No se toca el **motor data-loader** (`assets/js/main.js`, `assets/js/loaders.js`), los **helpers seguros** (`createElement`/`safeHref`; prohibido `innerHTML` sobre datos), ni los **`data/*.json`**. La **copia editorial en español no se reescribe**: solo se reestructura su *presentación*. Cualquier mejora de microcopy se propone con `/impeccable clarify` y se marca como propuesta en el cuerpo del commit, no se impone.
6. **Commits en español, modo imperativo.** Documentación viva sincronizada en cada prompt que corresponda: `DESIGN.md`, `design-system/MASTER.md`, `FASE_1_Catalogo_Componentes.md`, `RENDIMIENTO_Presupuesto.md`.
7. **Reconciliar el estado real ANTES de actuar.** Leer el archivo/selector concreto y hacer el grep correspondiente antes de tocar nada. No rehacer lo hecho: el objetivo es **elevar**, no reconstruir. Lo que ya esté resuelto se anota como "verificado, ya existente".
8. **Las skills, donde rinden.** Flujo invariable de cada prompt:
   1. **Consultar `ui-ux-pro-max`** para el dominio: `python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<query>" --design-system --domain <ux|typography|color|landing|web>`. **Nunca** `--stack react-native` (la skill está sesgada a mobile/RN): tomar solo reglas web (contraste, foco, jerarquía, CLS, formularios, navegación, animación) e ignorar lo de iOS/Android (safe-area, haptics, tab-bar).
   2. **Ejecutar con `impeccable`** el/los sub-comandos indicados, pasándole como restricciones las reglas de oro y los hallazgos de ui-ux-pro-max.
   3. **Iterar en el navegador con `/impeccable live`** en toda vista de alta carga visual (E01–E06): seleccionar elementos, generar variantes y refinar hasta que se vea bien — no commitear el primer pase. **Esto es lo que faltó en las rondas sin skills.**
   4. **Validar con el checklist de `ui-ux-pro-max`** (Quick Reference, prioridades 1–10 del dominio) como puerta de pre-entrega.
9. **Verificación obligatoria por prompt:** revisar a **375px y 1280px**; correr `npm run build:css`; comprobar **navegación por teclado y foco visibles**; emular **`prefers-reduced-motion`**; confirmar **cero hex/px nuevos fuera de `tokens.css`** (excepción histórica: paleta local de `assets/css/seguimiento.css`).

---

## 1. Reparto de skills (cada una donde está optimizada)

| Skill | Rol | Invocación |
|---|---|---|
| **`ui-ux-pro-max`** | *Inteligencia de referencia y validación.* Reglas, anti-patrones, paletas, emparejamientos, 99 guías UX y checklists de prioridad 1–10. No tiene gusto ni escribe código: aterriza la decisión en evidencia y da una puerta objetiva de pre-entrega. | `python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<query>" --design-system --domain <dom>` |
| **`impeccable`** | *Ejecución con criterio de director de diseño.* Anti-AI-slop, registro de marca (`brand`), craft de producción, materiales de movimiento e **iteración en navegador (`live`)**. | Skill tool → `/impeccable <comando> <objetivo>` |

**Sub-comandos de `impeccable` usados** (existen y están verificados en el proyecto): `critique`, `audit`, `polish`, `layout`, `typeset`, `bolder`, `distill`, `craft`, `colorize`, `animate`, `delight`, `harden`, `clarify`, `optimize`, `live`. Cada prompt usa solo los pertinentes a su vista.

**Mapa prompt → comandos:**

| Prompt | Vista | `impeccable` (lidera ejecución) | `ui-ux-pro-max` (referencia + checklist) |
|---|---|---|---|
| **E00** | Dirección editorial + crítica base | `critique` | `--design-system "editorial institutional typography-led layout"` |
| **E01** | Home `index.html` (nace el sistema) | `layout` + `typeset` + `bolder` + **`live`** | `--domain landing "visual hierarchy editorial grid whitespace hero"` |
| **E02** | Chrome global (navbar/footer/breadcrumbs) | `layout` + `animate` + `polish` + **`live`** | `--domain ux "navigation footer breadcrumb sticky header"` |
| **E03** | Sobre AChETIQ | `layout` + `typeset` + `craft` + **`live`** | `--domain typography "long-form reading measure timeline"` |
| **E04** | Gabinetes (hub + 4 detalles) | `layout` + `craft` + `distill` + **`live`** | `--domain ux "hub detail template visual hierarchy"` |
| **E05** | Recursos (hub + apuntes + seguimiento) | `layout` + `clarify` + `harden` + **`live`** | `--domain ux "filter table empty-state form data display"` |
| **E06** | Contacto + 404 | `harden` + `clarify` + `delight` + **`live`** | `--domain ux "form labels error feedback empty 404"` |
| **E07** | Pulido final + crítica de cierre + guardas | `polish` + `audit` + `critique` | Pre-Delivery Checklist §1–§3 (CRITICAL + HIGH) |

**Orden vinculante:** E00 → E01 → E02 → E03 → E04 → E05 → E06 → E07. **E01 nace el sistema editorial** en `tokens.css`; **E02 cierra el marco** compartido; **E03–E06** aplican vista por vista heredando ese sistema; **E07 mide y sella** (prueba BEFORE→AFTER).

---

## 2. Contexto común de repositorio (vale para todos los prompts; no repetir)

- **Stack:** sitio estático es-AR en GitHub Pages. HTML5 semántico, CSS puro con tokens + BEM, JS vanilla en ES-modules. Sin frameworks, sin CDN.
- **`tokens.css`** (raíz) es la única fuente de verdad de valores visuales (color OKLCH + fallback, tipografía, espaciado en escala de 4px, radios, z-index semántico, duraciones/easing). Prohibido valores fuera de él (excepción histórica: `assets/css/seguimiento.css`).
- **CSS:** 18 hojas BEM en `assets/css/` (incluye `cards.css`, `lists.css`, `headers.css`, `navbar.css`, `footer.css`, `cta.css`, `forms.css`, `states.css`, `focus.css`, `print.css`, `nav-secondary.css`, `text.css`, `figure.css`, `motion.css`, `loader.css`, `error-404.css`, `sobre-asociacion.css`, `countdown-recursos.css`, `seguimiento.css`). Se compilan a `assets/css/main.bundle.css` con `npm run build:css`; las páginas enlazan el bundle.
- **Las 9 páginas:** `index.html`, `pages/sobre-achetiq.html`, `pages/gabinetes.html`, `pages/gabinetes/{cursos-y-conferencias,eventos,prensa-y-difusion,solidario}.html`, `pages/recursos.html`, `pages/recursos/apuntes.html`, `pages/recursos/seguimiento.html`, `pages/contacto.html`, `404.html`.
- **Datos/JS:** motor data-loader (`assets/js/main.js` escanea `[data-loader]`; `assets/js/loaders.js` renderiza con helpers seguros; `assets/js/gabinete-detalle.js` para detalles) que lee `data/*.json`; navbar/footer son parciales inyectados (`assets/js/navbar.js`, `assets/js/footer.js` + `partials/navbar.html`, `partials/footer.html`). No se modifica el motor, los helpers ni los esquemas JSON.
- **Documentación viva:** `DESIGN.md` (sistema visual), `PRODUCT.md` (estrategia/marca/anti-referencias), `design-system/MASTER.md` (fuente entre sesiones), `FASE_1_Catalogo_Componentes.md` (catálogo de componentes), `RENDIMIENTO_Presupuesto.md` (presupuesto de rendimiento).
- **Invariante de movimiento:** reset global `prefers-reduced-motion: reduce` con escape `.safe-motion` en `assets/css/main.css` — preservar exactamente.

> Cada «TASK BODY» nombra los archivos/selectores concretos; **verificar su ubicación real antes de editar** (regla de oro 7).

---

## 3. La batería

### E00 — Dirección editorial y crítica base (habilitador + medición)

```text
You are a senior design director setting the editorial north star for a production static institutional website (Spanish es-AR, GitHub Pages; semantic HTML5 + pure CSS tokens/BEM + vanilla ES-module JS; no frameworks, no CDNs) before a page-by-page elevation pass. The ambition this time is HIGH: take the site to a sophisticated editorial / institutional level (typography-led, generous whitespace, strong grid, sober and timeless), EVOLVING the brand rather than freezing it. Prior incremental work already shipped; you are now raising the bar. Work on a NEW branch `design/e00-direccion-editorial` created from `main`.

GOLDEN RULES (apply to every step of every prompt — see the battery preamble): identity EVOLVES but stays recognizably AChETIQ — Fraunces/Hanken/Geist FAMILIES and the Cobalto/Mauveína anchors stay; you MAY refine the type scale, extend the neutral/surface ramp, add derived tints/accents, hairline rules and editorial dividers, refine elevation/rhythm; you MAY NOT swap font families, abandon Cobalto/Mauveína, introduce a WARM cream/sand background (the bg is cold porcelain), or add dark mode. Never regress the existing a11y/perf/motion work. No pull requests.

SKILL PROTOCOL:
1. Reference: `python3 .claude/skills/ui-ux-pro-max/scripts/search.py "editorial institutional typography-led layout whitespace visual hierarchy" --design-system` and `… "nonprofit association education website" --design-system`. Note the rules and the relevant Quick Reference sections; keep only web-applicable guidance (never `--stack react-native`).
2. Run `/impeccable critique` (register `brand` — design IS part of this institutional product) on the six key surfaces: `index.html`, `pages/sobre-achetiq.html`, `pages/gabinetes.html`, one gabinete detail (`pages/gabinetes/eventos.html`), `pages/recursos/apuntes.html`, `pages/contacto.html`. This produces the measurable BEFORE score (Nielsen 0–40, P0–P3 backlog) that E07 re-runs to prove the elevation. Read the existing `.impeccable/critique/` snapshots if present and treat THIS run as a fresh baseline at the new (higher) ambition.

TASK BODY:
1. Read `PRODUCT.md`, `DESIGN.md`, `design-system/MASTER.md`, `tokens.css` and `FASE_1_Catalogo_Componentes.md` to ground yourself in the existing identity and what each prior round already did.
2. Write a concise NEW document `DIRECCION_EDITORIAL.md` (es-AR) — the north star for E01–E07 — covering: (a) the editorial/institutional character in one paragraph (mood, references: think quality-magazine and serious-institution, NOT SaaS landing); (b) an explicit "qué evoluciona vs qué se conserva" table mapping golden rule 1 to this site (families & Cobalto/Mauveína conserved; type scale, surface ramp, accents/tints, dividers, elevation/rhythm allowed to mature); (c) anti-references to refuse, reconciled with `PRODUCT.md`'s existing vetoes (Wix-template look, warm SaaS-cream bg, tracked uppercase eyebrow on every section, identical card grids, hero-metric template, gradient text, side-stripe borders); (d) the editorial principles the pages will share (one clear primary action per viewport, hairline rules over heavy boxes, type carries hierarchy before color, whitespace is structural).
3. From the critique backlog, map each P0/P1 finding to the downstream prompt (E01–E06) that will resolve it, as a table in the commit body.

OVERRIDES: identity evolves within golden rule 1 — do NOT change any token VALUES in this prompt (E00 only measures and sets direction). No CSS changed → no bundle rebuild (confirm). Commit `docs(diseño): fijar dirección editorial y crítica base medible`, push `git push -u origin design/e00-direccion-editorial`. Do NOT create a pull request.
```

---

### E01 — Home `index.html` · vista insignia (aquí nace el sistema editorial)

```text
You are a senior design engineer redesigning the homepage of a production static institutional website to a sophisticated editorial standard. This is the FLAGSHIP view: the evolved design system is BORN here in `tokens.css` and every later page inherits it. Branch from `design/e00-direccion-editorial` into a NEW branch `design/e01-home-editorial`.

SKILL PROTOCOL:
1. Reference: `python3 .claude/skills/ui-ux-pro-max/scripts/search.py "visual hierarchy editorial grid whitespace hero landing" --domain landing` and `… "type scale spacing rhythm" --domain typography`. Note visual-hierarchy, spacing-scale, primary-action, grid rules; web only.
2. Execute with `/impeccable layout` (composition, grid, rhythm) + `/impeccable typeset` (refine the type scale and hierarchy) + `/impeccable bolder` (raise editorial impact WITHOUT noise — restraint is the point). Honor impeccable's bans: no tracked uppercase eyebrow on every section, no identical card grids by reflex, cards only when truly the best affordance, no gradient text, no side-stripe borders, headings must not overflow at any breakpoint.
3. **Iterate intensively with `/impeccable live`** on the homepage: select the hero, the gabinetes grid and the section rhythm in the browser and refine variants until the structure reads like an editorial cover — do not ship the first pass.
4. Validate against the ui-ux-pro-max Layout + Typography checklists before committing.

TASK BODY (reconcile against the live repo first — read `tokens.css`, `index.html`, `headers.css`, `cards.css`, `cta.css`, `text.css`; elevation tokens, a type scale and a rhythm contract may already exist — verify and ELEVATE, don't redo):
1. Establish the EVOLVED system in `tokens.css` (this is the shared foundation): refine the modular type scale and its line-height/tracking for an editorial voice (Fraunces for display/H1–H2 with optical sizing, Hanken for body, Geist Mono for sparse labels — never an eyebrow per section); extend the neutral/surface ramp with cold (never warm) editorial paper surfaces and add any derived accent/tint needed (derived from Cobalto/Mauveína, documented in Spanish with computed contrast); add hairline rule tokens and confirm the spacing/elevation/rhythm tokens. Every new value documented in es-AR comments.
2. Redesign the homepage sections in `index.html` + their CSS: the hero (type-led, generous, one clear primary action; respect the LCP hero and the slideshow/reduced-motion behavior already in place), the "quiénes somos" intro (editorial measure 65ch via the existing `.prose`), the gabinetes grid (composition that earns the grid, not a card factory), the recursos section, and the CTA final (Mauveína ≤10% rule).
3. Use hairline rules / whitespace for section separation instead of heavy boxes; one primary action per viewport, secondary actions visually subordinate (semantic tokens only).
4. Update `DESIGN.md`, `design-system/MASTER.md` and `FASE_1_Catalogo_Componentes.md` with the evolved type scale, surface ramp, rule tokens and the signature section pattern, so E02–E07 inherit them.

OVERRIDES (golden rules win): identity evolves within rule 1 — refine, never replace families or abandon Cobalto/Mauveína; no warm bg; no dark mode. Preserve the hero LCP/preload strategy, the `prefers-reduced-motion` reset and the focus system (rules 2). Regenerate and commit `assets/css/main.bundle.css`.

Verify at 375px and 1280px, keyboard focus visible, reduced motion emulated, zero new hex/px outside `tokens.css`. Commit `rediseñar(home): elevar la portada a un sistema editorial sofisticado`, push `git push -u origin design/e01-home-editorial`. Do NOT create a pull request.
```

---

### E02 — Chrome global: navbar, footer y breadcrumbs

```text
You are a senior design engineer elevating the shared chrome of a production static institutional website to the editorial standard set on the homepage, so every content view inherits a finished frame. Branch from `design/e01-home-editorial` into a NEW branch `design/e02-chrome-global`.

SKILL PROTOCOL:
1. Reference: `python3 .claude/skills/ui-ux-pro-max/scripts/search.py "navigation header footer breadcrumb sticky" --domain ux`. Note navigation clarity, fixed-element-offset, breadcrumb-web, footer information architecture; web only.
2. Execute with `/impeccable layout` (structure of navbar/footer/breadcrumbs) + `/impeccable animate` (cohesive, restrained motion for the chrome, reusing the tokenized easing/duration system) + `/impeccable polish`. **Use `/impeccable live`** to tune the navbar at desktop and the hamburger transition at mobile.
3. Validate against the ui-ux-pro-max Navigation checklist.

TASK BODY (reconcile first — read `partials/navbar.html`, `partials/footer.html`, `assets/css/navbar.css`, `footer.css`, `nav-secondary.css`, `assets/js/navbar.js`; a focus system, skip-links, sticky navbar, aria wiring and breadcrumbs already exist — verify and ELEVATE, do NOT regress them):
1. Navbar: refine to an editorial frame consuming the E01 system (type scale, hairline rules, surfaces); active-state and hover treatments via tokens; keep it sticky with `--navbar-height`. PRESERVE the keyboard behavior (Arrow/Home/End/Esc), `aria-expanded` sync, focus trap and focus return already implemented in `navbar.js`.
2. Footer: elevate its information architecture and rhythm to match (columns, social, copy year) using hairline rules and the surface ramp; keep its `color-mix` tints with their literal fallbacks.
3. Breadcrumbs (`nav-secondary.css`): refine the editorial treatment on the detail pages where they render; confirm `<nav aria-label>` + `<ol>` markup and that they sit correctly under the sticky navbar (`scroll-margin-top` compensation already present).
4. Chrome motion: any hover/transition uses the tokenized easing/duration and is neutralized under reduced motion.
5. Update `FASE_1_Catalogo_Componentes.md` (navbar, footer, breadcrumb sections).

OVERRIDES: identity evolves within rule 1; preserve all a11y behavior of `navbar.js` (rule 2) — visual/CSS elevation only, do not rewrite the JS logic. Regenerate and commit `assets/css/main.bundle.css`.

Verify across pages at 375px/1280px, full keyboard walkthrough of the navbar, reduced motion emulated. Commit `rediseñar(chrome): elevar navbar, footer y breadcrumbs al estándar editorial`, push `git push -u origin design/e02-chrome-global`. Do NOT create a pull request.
```

---

### E03 — Sobre AChETIQ `pages/sobre-achetiq.html`

```text
You are a senior design engineer redesigning the long-form "Sobre AChETIQ" page of a production static institutional website to a sophisticated editorial standard. Branch from `design/e02-chrome-global` into a NEW branch `design/e03-sobre`.

SKILL PROTOCOL:
1. Reference: `python3 .claude/skills/ui-ux-pro-max/scripts/search.py "long-form reading measure timeline editorial" --domain typography` and `… "tabs section navigation" --domain ux`. Note line-length-control (65–75ch), reading rhythm, section hierarchy; web only.
2. Execute with `/impeccable layout` + `/impeccable typeset` (this is a type-forward page) + `/impeccable craft` to build the history timeline as a SIGNATURE editorial component. **Use `/impeccable live`** to refine the timeline and the long-form rhythm.
3. Validate against the ui-ux-pro-max Typography checklist.

TASK BODY (reconcile first — read `pages/sobre-achetiq.html`, `assets/css/sobre-asociacion.css`, `text.css`, `headers.css`, and the data via `data/historia.json`/`directiva.json`/`documentos.json` rendered by `loaders.js`; the `.prose` 65ch measure, the Asociación/Galería tabs and scroll-reveal already exist — verify and ELEVATE):
1. Elevate the page header and the long-form sections (historia, misión/visión/valores, directiva, documentos) into a coherent editorial reading experience consuming the E01 system; enforce the 65ch reading measure on every prose run via the existing `.prose` class IN THE HTML (no new measure CSS).
2. Redesign the history TIMELINE as the page's signature component (`/impeccable craft`): an editorial, type-led treatment with hairline rules; reuse the existing `scroll-reveal` (progressive enhancement, content fully visible without JS, neutralized under reduced motion) — do not modify the data-loader engine or `historia.json`.
3. Refine the Asociación/Galería tab navigation and the directiva cards to read as designed, not interpolated; keep hash navigation working.
4. Update `FASE_1_Catalogo_Componentes.md` (timeline, long-form, directiva, tabs).

OVERRIDES: identity evolves within rule 1; copy in Spanish is not rewritten (only its presentation); preserve scroll-reveal/reduced-motion and the data-loader engine (rules 2, 5). Regenerate and commit `assets/css/main.bundle.css`.

Verify at 375px/1280px, prose ≤75ch, timeline visible without JS and static under reduced motion, focus visible. Commit `rediseñar(sobre): elevar la página institucional con timeline editorial`, push `git push -u origin design/e03-sobre`. Do NOT create a pull request.
```

---

### E04 — Gabinetes: hub + 4 detalles (familia de vistas)

```text
You are a senior design engineer redesigning the "Gabinetes" hub and its four detail pages of a production static institutional website to a sophisticated editorial standard, as ONE coherent family (they share a template). Branch from `design/e03-sobre` into a NEW branch `design/e04-gabinetes`.

SKILL PROTOCOL:
1. Reference: `python3 .claude/skills/ui-ux-pro-max/scripts/search.py "hub detail template visual hierarchy card" --domain ux`. Note visual-hierarchy, primary-action, when-cards-help; web only.
2. Execute with `/impeccable layout` + `/impeccable craft` (a reusable detail layout that all four inherit) + `/impeccable distill` (strip noise from the detail pages — sophistication is reduction). **Use `/impeccable live`** on the hub and one detail to refine the family.
3. Validate against the ui-ux-pro-max checklist.

TASK BODY (reconcile first — read `pages/gabinetes.html`, the four `pages/gabinetes/*.html`, `assets/css/cards.css`, `lists.css`, `assets/js/gabinete-detalle.js` and `data/gabinetes.json`; breadcrumbs already render on details — verify and ELEVATE):
1. Hub (`pages/gabinetes.html`): elevate the overview of the four committees + directiva into an editorial composition that earns its grid (not a card factory); one clear path into each gabinete.
2. Detail template: derive a single, elegant, type-led detail layout consuming the E01 system and apply it consistently across the four `gabinetes/*.html` (history, current projects, contact); use hairline rules and whitespace over heavy boxes; distill redundant chrome.
3. Keep breadcrumbs (E02 treatment), the data-loader engine, the security helpers and `gabinetes.json` untouched.
4. Update `FASE_1_Catalogo_Componentes.md` (gabinete hub + detail template).

OVERRIDES: identity evolves within rule 1; do not touch the data-loader engine, helpers or JSON (rule 5); preserve breadcrumbs/focus (rule 2). Regenerate and commit `assets/css/main.bundle.css`.

Verify hub + all four details at 375px/1280px, breadcrumbs present, focus visible, reduced motion emulated. Commit `rediseñar(gabinetes): unificar hub y detalles en una familia editorial`, push `git push -u origin design/e04-gabinetes`. Do NOT create a pull request.
```

---

### E05 — Recursos: hub + apuntes + seguimiento (vistas-herramienta)

```text
You are a senior design engineer redesigning the "Recursos" hub and its two tool views (apuntes, seguimiento) of a production static institutional website so they feel deliberately designed, not interpolated, at a sophisticated editorial standard. Branch from `design/e04-gabinetes` into a NEW branch `design/e05-recursos`.

SKILL PROTOCOL:
1. Reference: `python3 .claude/skills/ui-ux-pro-max/scripts/search.py "filter table empty-state data display loading" --domain ux`. Note filter clarity, empty/loading/error states, data legibility, target sizes; web only.
2. Execute with `/impeccable layout` + `/impeccable clarify` (microcopy of filters/states — proposed, not imposed) + `/impeccable harden` (empty/loading/error states under real data). **Use `/impeccable live`** to refine the apuntes filter UI and the seguimiento tool.
3. Validate against the ui-ux-pro-max Forms & Feedback checklist.

TASK BODY (reconcile first — read `pages/recursos.html`, `pages/recursos/apuntes.html`, `pages/recursos/seguimiento.html`, `assets/css/seguimiento.css`, `countdown-recursos.css`, and `assets/js/apuntes.js`/`seguimiento.js`/`countdown-recursos.js`; breadcrumbs, countdown and loaders already exist — verify and ELEVATE):
1. Hub (`recursos.html`): elevate into an editorial entry to the academic resources, with one clear path into apuntes and seguimiento.
2. Apuntes: make the filtering/search UI legible and calm — clear filter affordances, generous results layout, dignified empty/loading/error states (reuse the established soft-tint state recipe). Touch only presentation; do not modify the data-loader control flow or JSON schema.
3. Seguimiento: elevate the tracking tool to feel designed. IMPORTANT: `seguimiento.css` carries a historical LOCAL palette — reconcile it visually with the evolved system where it improves cohesion, but never break the tool's data/logic; document any local color kept.
4. Confirm interactive targets ≥24×24 CSS px and that any microcopy change is proposed in the commit body (copy not imposed).
5. Update `FASE_1_Catalogo_Componentes.md` (recursos hub, apuntes filters, seguimiento, states).

OVERRIDES: identity evolves within rule 1; data-loader engine/helpers/JSON untouched (rule 5); copy proposed not imposed; preserve a11y states (rule 2). Regenerate and commit `assets/css/main.bundle.css`.

Verify all three views at 375px/1280px, empty/loading/error states, keyboard + focus, reduced motion. Commit `rediseñar(recursos): elevar hub, apuntes y seguimiento como herramientas diseñadas`, push `git push -u origin design/e05-recursos`. Do NOT create a pull request.
```

---

### E06 — Contacto + 404

```text
You are a senior design engineer redesigning the contact page and the 404 page of a production static institutional website to a sophisticated editorial standard: a form that feels crafted and an error page that is a branded, sober moment. Branch from `design/e05-recursos` into a NEW branch `design/e06-contacto-404`.

SKILL PROTOCOL:
1. Reference: `python3 .claude/skills/ui-ux-pro-max/scripts/search.py "form labels error feedback validation empty 404" --domain ux`. This includes PRIORITY 1 rules: form-labels, aria-live-errors, error-summary, color-not-only, contrast-feedback; web only.
2. Execute with `/impeccable harden` (form edge/error states, resilience) + `/impeccable clarify` (error/label microcopy — proposed) + `/impeccable delight` (the 404 as a memorable but restrained brand moment). **Use `/impeccable live`** to refine the form and the 404 composition.
3. Validate against the ui-ux-pro-max Forms & Feedback checklist (zero color-only error signals).

TASK BODY (reconcile first — read `pages/contacto.html`, `404.html`, `assets/css/forms.css`, `error-404.css`, `assets/js/contacto-form.js`; visible labels, `aria-describedby`, error-summary, `:user-invalid` styling and a non-color error tint already exist — verify and ELEVATE, do not regress):
1. Contacto: elevate the form into a crafted editorial layout consuming the E01 system; keep visible `<label>`s, `aria-describedby` hint/error wiring, the error-summary pattern, `:user-invalid` styling with non-color error indication, and the social links + lazy map. Markup/CSS pattern only — no backend; do not change the security helpers.
2. 404: redesign as a sober, on-brand moment (type-led, one clear path home) — delightful by restraint, not by gimmick; respect the cold-porcelain bg and reduced motion.
3. Confirm contrast on every text/surface pair introduced (incl. error tints); document ratios in `tokens.css` comments if any token is added.
4. Update `FASE_1_Catalogo_Componentes.md` (form, 404).

OVERRIDES: identity evolves within rule 1; copy proposed not imposed; preserve form a11y wiring and reduced motion (rule 2). Regenerate and commit `assets/css/main.bundle.css`.

Verify at 375px/1280px, full keyboard form walkthrough, error states announced and non-color-only, reduced motion. Commit `rediseñar(contacto-404): elevar el formulario y volver la 404 un momento de marca`, push `git push -u origin design/e06-contacto-404`. Do NOT create a pull request.
```

---

### E07 — Pulido final, crítica de cierre y guardas

```text
You are a senior design director running the final quality gate of a production static institutional website after a page-by-page editorial elevation pass (E01–E06). Branch from `design/e06-contacto-404` into a NEW branch `design/e07-pulido-final`.

SKILL PROTOCOL:
1. Run `/impeccable polish` site-wide — final cohesion pass across every surface touched in E01–E06 (consistent type scale, surface ramp, rules, rhythm, elevation; no drift between pages). Honor the AI-slop test and the absolute bans; identity stays within golden rule 1.
2. Run `/impeccable audit` for the performance + a11y guard: the redesign added CSS to the bundle and new layout/motion, so re-verify. Re-run the Lighthouse matrix and check `assets/css/main.bundle.css` size against `RENDIMIENTO_Presupuesto.md` (LCP < 2.5s mobile, CLS < 0.1, total CSS < 75KB, per-page transfer < 500KB). Re-check WCAG 2.2 AA (axe/Lighthouse a11y, zero serious/critical) so nothing regressed. Fix regressions here or, if out of scope, record them as findings.
3. Run the ui-ux-pro-max Pre-Delivery Checklist: `python3 .claude/skills/ui-ux-pro-max/scripts/search.py "accessibility animation z-index loading contrast" --domain ux` plus a full pass of its Quick Reference §1–§3 (CRITICAL + HIGH), web rules only.
4. Re-run `/impeccable critique` on the SAME six surfaces as E00 and report the BEFORE→AFTER Nielsen score (trend line) to prove the elevation. Map any remaining P0/P1 to a short follow-up note.

TASK BODY:
1. Cohesion sweep across all 9 pages: reconcile any page that drifted from the E01 system; deduplicate one-off rules that should be shared tokens.
2. Update `RENDIMIENTO_Presupuesto.md` (new baseline + any exception), `DESIGN.md`, `design-system/MASTER.md` and `FASE_1_Catalogo_Componentes.md` for anything still stale.
3. Write the closing summary in the commit body: BEFORE→AFTER Nielsen per surface, budget status, a11y status, and remaining follow-ups.

OVERRIDES: identity evolves within rule 1; never regress a11y/perf/motion (rule 2). Regenerate and commit `assets/css/main.bundle.css` if any CSS changed. Commit `pulir(diseño): cohesión final, guardas de rendimiento y crítica de cierre`, push `git push -u origin design/e07-pulido-final`. Do NOT create a pull request.
```

---

## 4. Notas de cierre

- **Por qué esta batería sí mueve la aguja.** No son micro-ajustes ya hechos: cada prompt **rediseña una vista completa** con criterio editorial e **iteración real en navegador (`/impeccable live`)**. El sistema visual **evoluciona** (escala tipográfica, superficies, acentos, reglas, ritmo) en vez de quedar congelado, así que el cambio **se ve**.
- **Cadena de ramas.** E00 parte de `main`; cada prompt posterior parte de la rama del anterior, acumulando el trabajo sin pull requests. Cualquier consolidación se decide fuera de esta batería (la directiva revisa las ramas; esta batería nunca abre PRs).
- **El sistema nace una vez.** E01 crea la base editorial en `tokens.css`/`DESIGN.md`/`MASTER.md`; E02 cierra el marco; E03–E06 heredan y aplican; E07 mide y sella. Si una vista posterior necesita un token nuevo, se agrega a `tokens.css` y se documenta, nunca se hardcodea.
- **Identidad reconocible.** En cualquier prompt, si una skill propone reemplazar las familias tipográficas, abandonar Cobalto/Mauveína, poner fondo cálido o introducir dark mode, se ignora y se registra como nota: son límites de marca, no variables.
```
