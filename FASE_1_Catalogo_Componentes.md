# Fase 1 — Catálogo de Componentes Visuales
## Sitio Web Oficial de AChETIQ

*Documento elaborado: 2026-05-08 · Última actualización: 2026-06-15*
*Estado: Referencia técnica para desarrollo front-end (Fase 2) · Tokens v3 «Cobalto & Mauveína» · Contratos S2 de elevación y ritmo (§0.3)*

---

## Propósito y alcance

Este documento traduce los design tokens definidos en `tokens.css` a un conjunto cerrado de componentes reutilizables. Cada componente se especifica con su HTML semántico, sus clases BEM, su comportamiento responsive y sus estados interactivos. La meta es que la Fase 2 (desarrollo front-end) pueda implementarse sin tomar decisiones de diseño adicionales.

**Convenciones de este catálogo**

- Toda referencia a colores, tipografías, espacios y radios se hace mediante tokens declarados en `tokens.css`. No se introducen valores hardcodeados.
- Las clases siguen la convención BEM (Block — Element — Modifier) ya pactada: `.bloque__elemento--modificador`.
- Cada componente incluye especificación de **estados** (hover, focus, active, disabled) cuando es interactivo.
- Cada componente incluye notas de **accesibilidad** (rol ARIA, semántica HTML, foco visible) cuando aplican.

---

## 0. Sistema de tokens v3 — «Cobalto & Mauveína» (S1, 2026-06-15)

La sesión S1 (rediseño fundacional) reemplazó por completo los sistemas de color y tipografía de `tokens.css`. La identidad de doble linaje químico opone el **cobalto** (azul, pigmento inorgánico) como color estructural de marca y la **mauveína** (magenta, el primer tinte sintético orgánico — Perkin, 1856) como color exclusivo de acción, sobre un neutro **grafito** frío (porcelana → tinta azulada) de registro editorial y mayor contraste que el papel cálido de la v2 («Pátina & Cobre»). Esta sección es la referencia normativa del sistema vigente; toda mención de tokens en los componentes de este catálogo remite a ella.

### 0.1 Color — arquitectura en tres capas

1. **Primitivas** (`--grafito-*`, `--cobalto-*`, `--mauveina-*`, `--verde-700`, `--rojo-700`, `--ambar-600`): escalas crudas definidas en OKLCH con fallback hex sRGB (bloque `@supports`). No se consumen desde componentes.
2. **Semánticas** (capa de consumo):

| Token | Valor | Rol | Contraste (sobre surface / raised) |
|---|---|---|---|
| `--color-surface` | grafito-100 `#F2F4F8` | Fondo de página | — |
| `--color-surface-raised` | grafito-50 `#F9FAFC` | Tarjetas, paneles, modales | — |
| `--color-surface-inverse` | cobalto-900 `#0B2964` | Footer, base del hero | — |
| `--color-text` | grafito-950 `#131720` | Texto principal | 16.3 / 17.2 — AAA |
| `--color-text-soft` | grafito-700 `#444953` | Cuerpo de prosa | 8.2 / 8.6 — AAA |
| `--color-text-faint` | grafito-600 `#5B5F69` | Eyebrows, captions | 5.8 / 6.1 — AA |
| `--color-text-disabled` | grafito-600 | Estados inactivos declarados | 5.8 — AA |
| `--color-accent` | cobalto-700 `#1344A5` | Enlaces, énfasis, itálicas de titular | 7.9 / 8.4 — AAA |
| `--color-accent-soft` | cobalto-500 `#3463BC` | Hover de enlaces, eyebrows de categoría, íconos | 5.2 / 5.5 — AA |
| `--color-on-accent` | grafito-50 | Texto sobre rellenos accent/inverse | 8.4 / 13.3 — AAA |
| `--color-cta` | mauveina-600 `#922FA1` | SOLO botones de acción primaria (relleno) | 6.4 con on-cta — AA |
| `--color-cta-text` | mauveina-700 `#7C228A` | Mauveína como texto («Abrir →», «Descargar →») | 7.8 / 8.2 — AAA |
| `--color-on-cta` | grafito-50 | Texto sobre relleno CTA | 6.4 — AA |
| `--color-positive` | verde-700 `#165E2E` | Confirmaciones, datos positivos | 7.1 / 7.5 — AAA |
| `--color-negative` | rojo-700 `#9B171F` | Errores, datos negativos | 7.5 / 7.9 — AAA |
| `--color-warning` | ambar-600 `#915900` | Avisos no destructivos | 5.5 / 5.3 — AA |
| `--color-border` | grafito-300 `#CED2D9` | Bordes de tarjeta y separadores | decorativo |
| `--color-border-soft` | grafito-200 `#E1E4E9` | Separadores internos | decorativo |
| `--color-overlay` / `--color-scrim` | derivados con alfa | Velo de modales / velo del hero | scrim: ≥ 5.4 con blanco |
| `--color-on-media` / `--color-on-media-soft` | blanco / blanco 88 % | Texto sobre fotografía | ≥ 4.6 sobre scrim |

Los dos polos de marca (cobalto, matiz 262 · mauveína, matiz 322) y los colores de estado (rojo 25 · verde 150 · ámbar 70) ocupan matices separados ≥ 50°: no se confunden entre sí. Todo par texto/fondo cumple WCAG 2.2 AA; el cuerpo de prosa (`--color-text-soft`) y los acentos alcanzan AAA.

3. **Alias de componente**: `--color-materia-anio-1…5` (narrativa arena dorada → cobalto profundo) y la paleta por nivel del Seguimiento (`--nivel-*-accent/-fondo-alt/-texto`, antes excepción local de `seguimiento.css`, hoy centralizada y re-derivada en OKLCH con contraste verificado 6.4–7.5:1).

Sombras: tiers globales `--shadow-xs/-sm/-md/-lg` derivados de `--cobalto-950` vía `color-mix()` (sombra fría y azulada, integrada con la porcelana). Ninguna hoja declara sombras propias. Los componentes no consumen los tiers crudos sino los alias del contrato de elevación (§0.3).

### 0.3 Elevación y ritmo vertical — contratos S2 (2026-06-10)

La sesión S2 (componentes y layout) formalizó dos contratos sobre los tokens existentes. Son la referencia normativa de profundidad y espaciado; ningún componente declara estos valores con escalones propios.

**Contrato de elevación.** Regla del sistema: *en reposo todo es plano* — la elevación de base la expresa el borde, nunca una sombra. Sólo se proyecta sombra ante interacción u superposición real.

| Alias (tokens.css) | Valor | Uso |
|---|---|---|
| `--elevation-border` | `1px solid var(--color-border)` | «Elevación plana»: contorno de tarjeta/panel en reposo. El hover interactivo intensifica `border-color` a `--color-accent`. |
| `--elevation-border-soft` | `1px solid var(--color-border-soft)` | Bandas de baja jerarquía (`.gabinetes-feature`) y separadores internos (pie de tarjeta, filas de lista). |
| `--elevation-hover` | `var(--shadow-sm)` | Sombra de tarjeta interactiva al hover, acompañada de `transform: translateY(var(--elevation-lift))`. |
| `--elevation-overlay` | `var(--shadow-md)` | Capas flotantes (dropdown del navbar). |
| `--elevation-modal` | `var(--shadow-lg)` | Paneles protagónicos (panel del countdown); único caso de sombra en reposo. |
| `--elevation-lift` | `-2px` | Desplazamiento vertical que acompaña a `--elevation-hover`. |

Reciben elevación al hover **sólo** las tarjetas interactivas (son `<a>` o contienen su enlace de apertura): `.card-gabinete`, `.gabinete-card`, `.card-materia` (variante `--drive`), `.card-institucion`, `a.contact-card`. Permanecen planos sin hover los paneles estáticos: `.card--valor`, `.card-documento`, `.card-integrante`, `.mission-vision__col`, `.cta-final`, `.contact-card--proximamente`, `.card-materia--placeholder`.

**Contrato de ritmo vertical** (alias sobre la escala de 4 px):

| Nivel | Token | Valor | Implementación |
|---|---|---|---|
| Sección ↔ sección | `--section-gap` | 64 px | Regla genérica `:where(.page) > section + section` en `main.css` §4 (especificidad 0-0-2: cualquier componente con ritmo propio la sobreescribe; los márgenes colapsan, no se duplican). |
| page-header → contenido | `--space-12` | 48 px | `margin-bottom` de `.page-header`. |
| section-title → bloque | `--header-gap` | 32 px | `margin-bottom` de `.section-title`; también `.pill-nav + *`. |
| Interior de tarjeta estándar | `--card-pad` | 20 px | `.card` base, `.card--valor`, body de `.card-noticia`. |
| Interior de tarjeta extensa | `--card-pad-lg` | 24 px | `.card-gabinete`, `.gabinete-card`, `.card-documento`, `.contact-card`, `.mission-vision__col`. |

Medidas asociadas: `--measure-title` (22ch, titulares display de `.page-header` y `.cta-final`) y `--card-min` (17.5rem, pista mínima de `.grid-cards--fluid`).

### 0.2 Tipografía

- **Familias** (autoalojadas, woff2 variable subset latin, `font-display: swap`): **Fraunces variable 400–600** + itálica (display — serif Old Style de alto contraste, óptica de display fija `opsz 72`; reemplaza a Instrument Serif de la v2 y, a diferencia de aquella, ofrece peso real, aunque el énfasis se mantiene en la itálica, no en bold); **Hanken Grotesk variable 400–600** (cuerpo/UI — grotesca humanista de alta legibilidad; reemplaza a Geist; pesos medium/semibold reales, no sintetizados); **Geist Mono variable 400–500** (eyebrows, metadatos, dígitos tabulares — voz técnica neutra retenida de la v2). Cada webfont tiene un fallback con métricas ajustadas (`size-adjust`/overrides verticales; Fraunces→Georgia, Hanken→Arial, Geist Mono→Courier New) para CLS ≈ 0 durante el `swap`.
- **Pesos**: `--weight-regular` 400 · `--weight-medium` 500 · `--weight-semibold` 600 (reservado a `<strong>`).
- **Escala fluida** (rem + `clamp()`, interpolada entre 360 px y 1280 px; ratio tercera menor 1.2 → tercera mayor 1.25, niveles display ampliados):

| Token | 360 px | 1280 px | Uso |
|---|---|---|---|
| `--text-display-2xl` | 72 | 120 | Dígitos del 404 |
| `--text-display-xl` | 40 | 65 | Titular del hero |
| `--text-display` | 40 | 52 | H1, titulares feature |
| `--text-h2` | 33 | 41 | H2 |
| `--text-kpi` / `--text-wordmark` | 28 | 33 | KPI / wordmark del footer |
| `--text-lead` | 22 | 26 | Bajada del hero |
| `--text-h3` | 19 | 21 | H3, leads de página |
| `--text-h4` | 17 | 18 | H4, UI |
| `--text-body` | 16 | 17 | Cuerpo (mínimo 1 rem) |
| `--text-small` | 14 | 14 | Auxiliar |
| `--text-caption` | 12 | 12 | Metadatos mono |
| `--text-eyebrow` / `--text-eyebrow-sm` | 11 / 12 | estáticos | Supratítulos mono |
| `--text-digits` | 28 | 52 | Reloj del countdown |

- **Interlineado**: `--leading-tight` 1.08 · `--leading-snug` 1.3 · `--leading-normal` 1.5 · `--leading-relaxed` 1.7.
- **Tracking**: `--tracking-tight` −0.015em · `--tracking-normal` 0 · `--tracking-wide` 0.04em · `--tracking-wider` 0.12em.
- **Medida de lectura**: `--measure-prose` 65ch (bloques de prosa) · `--measure-narrow` 56ch (leads junto a titulares).
- `html` ya no fija `font-size: 16px`: la escala respeta la preferencia de tamaño de la persona usuaria.

> **Nota de migración.** Equivalencias v1 → v2: `--color-surface`→`surface` · `--color-surface-raised`→`surface-raised` · `--color-text/-soft/-faint`→`text/-soft/-faint` · `--color-accent`→`accent` · `--color-accent-soft`→`accent-soft` · `--color-border/-soft`→`border/-soft` · `--color-negative/-pos`→`negative/positive` · `--color-scrim`→`scrim` · `--color-surface-overlay`→`overlay`. Las menciones de tamaños en px que persistan en las especificaciones de componentes de este catálogo son orientativas de la v1; el valor normativo es siempre el token indicado.

### 0.4 Sistema centralizado de foco — contrato S4 (2026-06-11)

La sesión S4 (accesibilidad WCAG 2.2 AA) centralizó el tratamiento de foco. **Un solo lugar declara `outline`: `assets/css/focus.css`**, sobre los tokens `--focus-ring-*` de tokens.css §FOCO VISIBLE.

| Token | Valor | Nota |
|---|---|---|
| `--focus-ring-width` | `2px` | Mínimo recomendado WCAG 2.4.13. |
| `--focus-ring-offset` | `2px` | El color adyacente al anillo es siempre la superficie del contexto, no el relleno del control. |
| `--focus-ring-color` | `var(--color-accent)` | 8.1:1 sobre `surface` · 8.6:1 sobre `raised` (mínimo 1.4.11: 3:1). |
| `--focus-ring-color-inverse` | `var(--color-on-accent)` | Superficies oscuras: 8.6:1 sobre `accent` (cta-final) · 13.2:1 sobre `surface-inverse` (footer) · 16.5:1 sobre el peor caso del scrim del hero. |

**Reglas del contrato.**

- El anillo aparece solo con foco por teclado (`:focus-visible`); el foco por puntero no lo dibuja.
- Ningún componente declara ni suprime `outline`. Para adaptar el anillo a una superficie oscura, el contexto redeclara `--focus-ring-color: var(--focus-ring-color-inverse)` (hoy: `.footer`, `.cta-final`, `.hero` — declarado centralmente en focus.css §2).
- Los componentes pueden añadir refuerzos cosméticos compartidos con `:hover` (cambio de fondo de `.nav-link`, de borde de `.form__input`), nunca el anillo en sí.
- Los destinos de salto programático (`[tabindex="-1"]`: `<main>`, resumen de errores) no dibujan anillo: no son controles operables.

---

## 1. Componentes globales

### 1.1 Page container — `.page`

**Propósito.** Contenedor de ancho máximo y padding consistente para el contenido principal de cualquier página.

**Aparición.** Envuelve el `<main>` de cada página HTML.

**Especificación.** Definido en `assets/css/main.css` (clase estructural; `tokens.css` queda reservado para variables). Ancho máximo 1480 px. Padding **fluido** (S3): horizontal `--page-padding-x` 20 → 64 px y vertical `--page-padding-y` 24 → 44 px, interpolados con `clamp()` entre los viewports 360 y 1480 px (sin saltos por breakpoint; antes conmutaba 20/52 y 24/44 en 768 px).

**HTML.**

```html
<main class="page">
  <!-- contenido de página -->
</main>
```

---

### 1.2 Navbar — `.navbar`

**Propósito.** Barra de navegación principal, fija al tope de la página, con acceso a las seis secciones de primer nivel del sitio y desplegables para Gabinetes y Recursos Académicos.

**Aparición.** En todas las páginas, fuera del `.page`.

**Estructura semántica.** `<header>` que contiene un `<nav>` con `aria-label="Principal"`.

**Especificación visual.**

- Altura: 56–64 px.
- Fondo: `var(--color-surface)` con alfa 0.92 y `backdrop-filter: blur(12px)`; fallback opaco mediante `@supports not (backdrop-filter: blur(...))`.
- Borde inferior: 1 px `var(--color-border)`.
- Posición: `position: sticky; top: 0; z-index: var(--z-navbar)`.
- Layout interno: flexbox con `justify-content: space-between`. Logo + wordmark a la izquierda, lista de enlaces + CTA a la derecha.

**Inserción en cada página.**

```html
<div data-loader="navbar"></div>
```

El placeholder es reemplazado por `js/navbar.js`, que carga `partials/navbar.html` y configura los enlaces desde `data/navbar.json`.

**Variantes de enlace (modificadores de `.nav-link`).**

- `.nav-link--ghost`: sin borde ni fondo. Hover: fondo `var(--color-surface-raised)`, texto `var(--color-accent)`.
- `.nav-link--outline`: borde 1 px `var(--color-border)`, fondo transparente.
- `.nav-link--primary`: fondo `var(--color-accent)`, texto `var(--color-on-accent)`. Hover: fondo `var(--color-accent-soft)`.

**Comportamiento de submenús (desktop ≥ 1024 px).** El label permanece como `<a>` clickeable a la página general; el panel desplegable se abre únicamente por hover del mouse o focus del teclado (`:hover` + `:focus-within`). Chevron Lucide a la derecha del label, decorativo, rota 180° al abrir.

**Comportamiento mobile/tablet (< 1024 px).** Lista colapsa en botón hamburguesa; panel lateral con overlay. Submenús como acordeón anidado in-place, con botón independiente para el chevron (área táctil ≥ 44×44 px). Scroll del body bloqueado mientras el panel está visible.

**Endurecimiento S4 (accesibilidad del panel mobile, 2026-06-11).** Mientras el panel está abierto, el foco queda **atrapado dentro** (Tab/Shift+Tab ciclan entre sus enlaces y botones visibles; los sublinks de acordeones colapsados se excluyen). `Esc`, el tap sobre el overlay y el toggle cierran el panel y **devuelven el foco al botón hamburguesa**; el cierre automático por resize a desktop no roba el foco. `aria-expanded` del toggle se mantiene en sincronía en todos los caminos de cierre; el umbral JS del patrón desktop coincide con el del CSS (1024 px, corrección S3 — antes el JS seguía en 768 y forzaba cierres prematuros en tablet).

**Corrección S3 (auditoría responsive).** El cambio hamburguesa ↔ lista horizontal vivía en 768 px, pero la lista completa (brand + 5 ítems + CTA) mide ≈ 851 px: entre 768 y ~850 px desbordaba el viewport con scroll horizontal en todas las páginas. El umbral se retrasó al breakpoint canónico siguiente (`--bp-lg`, 1024 px): tablet portrait conserva el panel hamburguesa como estado diseñado. El contenedor interno además se alinea con `.page` (mismo `--max-width` y mismo padding fluido `--page-padding-x`).

**Especificación normativa.** Esta sección es un resumen operativo. La fuente normativa completa del componente —incluida la configuración definitiva de `data/navbar.json`, criterios de aceptación, accesibilidad por teclado, transiciones y restricciones explícitas— está consolidada en el documento canónico de la navbar (memoria del proyecto, referencia *AChETIQ — Prompt canónico de la barra de navegación*, cerrado 2026-05-16). Cualquier divergencia entre ambos textos se resuelve en favor del prompt canónico.

---

### 1.3 Footer — `.footer`

**Propósito.** Pie de página institucional con información de contacto, redes sociales, instituciones vinculadas y créditos.

**Aparición.** En todas las páginas.

**Especificación visual.**

- Fondo: `var(--color-surface)` (sin contraste contra el body — separación dada por borde superior).
- Borde superior: `1px solid var(--color-border)`.
- Padding vertical generoso: `var(--space-16)` = 64 px arriba y abajo.
- Layout interno: grid de 4 columnas en desktop, colapsa a 1 columna en mobile.

**Estructura HTML.**

```html
<footer class="footer">
  <div class="footer__inner">
    <div class="footer__col footer__col--brand">
      <img src="/assets/img/logo/achetiq-logo.svg" alt="AChETIQ" class="footer__logo">
      <p class="footer__tagline">Asociación Chaqueña de Estudiantes Tecnológicos de Ingeniería Química</p>
    </div>
    <div class="footer__col">
      <h4 class="footer__heading">Navegación</h4>
      <ul class="footer__list">
        <li><a href="/sobre-achetiq.html">Sobre AChETIQ</a></li>
        <li><a href="/gabinetes.html">Gabinetes</a></li>
        <li><a href="/recursos.html">Recursos</a></li>
        <li><a href="/contacto.html">Contacto</a></li>
      </ul>
    </div>
    <div class="footer__col">
      <h4 class="footer__heading">Contacto</h4>
      <ul class="footer__list" data-loader="redes"></ul>
      <!-- poblado dinámicamente desde data/redes.json -->
    </div>
    <div class="footer__col">
      <h4 class="footer__heading">Vinculados</h4>
      <ul class="footer__instituciones" data-loader="instituciones"></ul>
      <!-- logos UTN FRRe + ANEIQA, poblado desde data/instituciones.json -->
    </div>
  </div>
  <div class="footer__bottom">
    <p class="caption">© 2026 AChETIQ. Sitio mantenido por la comisión directiva.</p>
  </div>
</footer>
```

**Tipografía.**

- `.footer__heading`: tipografía mono, eyebrow style (`--text-eyebrow`, uppercase, tracking wider).
- `.footer__list`: tipografía body, `--text-small`, tintas locales derivadas de `--color-on-accent` (el footer vive sobre `--color-surface-inverse`).
- `.footer__tagline`: tipografía body, `--text-small`, tinta atenuada local.

---

### 1.4 Skip-link — `.skip-link`

**Propósito.** Enlace de accesibilidad que permite a usuarios de teclado/lector de pantalla saltar la navegación e ir directo al contenido principal.

**Aparición.** Primer elemento del `<body>`, antes del navbar.

**HTML.**

```html
<a class="skip-link" href="#main-content">Saltar al contenido principal</a>
```

**Comportamiento visual.** Oculto fuera de pantalla por defecto (vía `position: absolute; left: -9999px`). Al recibir foco (Tab), salta a posición visible en la esquina superior izquierda con fondo `var(--color-accent)` y texto `var(--color-on-accent)` (8.6:1 — AAA). El `<main>` correspondiente debe tener `id="main-content"` y `tabindex="-1"`.

**Unificación S4 (2026-06-11).** El destino es `#main-content` con markup idéntico en **las 9 páginas** (la portada usaba `#contenido`; corregido). El destino con `tabindex="-1"` no dibuja anillo de foco (focus.css §1): no es un control operable.

---

## 2. Componentes de cabecera de sección

### 2.1 Hero principal — `.hero`

**Propósito.** Bloque de apertura prominente de la página de Inicio. Establece el tono institucional, presenta la asociación en una frase, y ofrece un par de CTAs hacia las secciones más importantes.

**Aparición.** Solo en `index.html`.

**Especificación visual.**

- Padding vertical: `var(--space-16)` arriba y abajo (64 px); en pantallas ≥ 1024 px, escalar a 96 px (`calc(var(--space-16) * 1.5)`).
- Layout: dos columnas en desktop (texto + imagen/decoración), una columna en mobile.
- Fondo: `var(--color-surface)` con un detalle decorativo (ver "decoración" abajo).

**Estructura HTML.**

```html
<section class="hero">
  <div class="hero__content">
    <p class="eyebrow hero__eyebrow">Asociación estudiantil — UTN FRRe</p>
    <h1 class="hero__title">
      Estudiantes de Ingeniería Química <em>organizados</em>, formados y conectados.
    </h1>
    <p class="hero__lead">
      AChETIQ reúne a los estudiantes de la carrera en torno a actividades académicas, eventos y proyectos solidarios.
    </p>
    <div class="hero__cta">
      <a href="/sobre-achetiq.html" class="btn btn-primary">Conocé la asociación</a>
      <a href="/gabinetes.html" class="btn btn-secondary">Ver gabinetes</a>
    </div>
  </div>
  <div class="hero__visual">
    <!-- imagen institucional o composición decorativa basada en grilla del logo -->
  </div>
</section>
```

**Tipografía.**

- `.hero__title`: hereda de `<h1>` global (Fraunces) y sube al rol `--text-display-xl` (fluido 40→65 px), en `--color-on-media` sobre el scrim. El `<em>` interno aplica el color de la regla global de `h1 em`.
- `.hero__lead` / `.hero__subtitle`: rol `--text-lead` (fluido 22→26 px), body font, `--color-on-media-soft`, ancho máximo `--measure-narrow`.

**Decoración (opcional, recomendada).** Usar la grilla 3×3 del logo como patrón geométrico de fondo en la columna visual: cuadrados de `var(--color-border)` sobre `var(--color-surface)`, dispuestos como una grilla decorativa que evoca el isotipo sin replicarlo.

---

### 2.2 Page header — `.page-header`

**Propósito.** Cabecera de páginas interiores (Sobre AChETIQ, Gabinetes, etc.). Versión más compacta que el hero.

**Aparición.** Primera sección de toda página que no sea el inicio.

**Estructura HTML.**

```html
<header class="page-header">
  <p class="eyebrow">Sobre AChETIQ</p>
  <h1 class="page-header__title">Quiénes <em>somos</em></h1>
  <p class="page-header__lead">
    Una asociación de estudiantes de Ingeniería Química, con sede en la Facultad Regional Resistencia.
  </p>
</header>
```

**Especificación visual.** Padding vertical 48 px arriba, 32 px abajo. Borde inferior `1px solid var(--color-border)` para separar del contenido.

---

### 2.3 Section title — `.section-title`

**Propósito.** Encabezado de cada sección dentro de una página. Permite estructurar el contenido en bloques visualmente distinguibles.

**HTML.**

```html
<header class="section-title">
  <p class="eyebrow">Comisión directiva</p>
  <h2>Quienes <em>conducen</em> la asociación en 2026</h2>
</header>
```

**Especificación visual.** Margen inferior `var(--header-gap)` (32 px, contrato de ritmo §0.3) antes del bloque siguiente. Sin borde, sin fondo.

**Elementos y modificadores (S2).**

- `.section-title__lead`: bajada opcional bajo el `<h2>`, en escalón `--text-body` y medida `--measure-narrow` (subordinada al lead de página; reemplaza la reutilización indebida de `.page-header__lead` dentro de secciones).
- `.section-title--display`: eleva el `<h2>` al rol `--text-display` (40→52 px) con `leading-tight`, `tracking-tight` y `text-wrap: balance`. Es el patrón de las cabeceras protagónicas de portada («Quiénes somos», «Nuestros gabinetes»), antes duplicado en `sobre-asociacion.css`.

---

### 2.4 Mission-Vision block — `.mission-vision`

**Propósito.** Bloque de dos columnas que presenta la Misión y la Visión institucionales de AChETIQ en paralelo. Patrón estructural específico de Sobre AChETIQ — Bloque 3.

**Aparición.** Una vez por página (Sobre AChETIQ).

**Estructura HTML.**

```html
<section class="mission-vision">
  <article class="mission-vision__col">
    <p class="mission-vision__label">
      <svg class="mission-vision__icon" aria-hidden="true"><!-- Lucide `target` --></svg>
      Misión
    </p>
    <p class="mission-vision__prose">
      Texto de misión institucional, en prose, sin viñetas ni jerarquía interna.
    </p>
  </article>
  <article class="mission-vision__col">
    <p class="mission-vision__label">
      <svg class="mission-vision__icon" aria-hidden="true"><!-- Lucide `telescope` --></svg>
      Visión
    </p>
    <p class="mission-vision__prose">
      Texto de visión institucional, mismo registro.
    </p>
  </article>
</section>
```

**Especificación visual.**

- Layout: `display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-8)` en desktop; colapsa a una columna (`1fr`) en mobile.
- Sin `<h2>` global encabezando el bloque; las etiquetas `Misión` y `Visión` actúan como rótulos internos. Decisión deliberada de simetría visual (sin jerarquía entre Misión y Visión).
- Cada columna: borde lateral izquierdo de `3px solid var(--color-accent)`, fondo `var(--color-surface-raised)`, padding `var(--space-6) var(--space-6) var(--space-6) var(--space-8)`, radio `var(--radius-md)`.
- Etiqueta (`.mission-vision__label`): tipografía `Geist Mono`, uppercase, tracking-wider, `--text-caption`, color `var(--color-accent)`, con ícono Lucide inline a la izquierda (16×16 px, `currentColor`).
- Prose (`.mission-vision__prose`): tipografía body, `--text-h4`, color `var(--color-text-soft)`, ancho máximo `--measure-narrow`.

**Íconos Lucide previstos.** `target` (Misión) y `telescope` (Visión). Disponibilidad de `telescope` a verificar; fallback: `compass` o `eye`.

**Pendiente.** Texto definitivo de Misión y Visión a redactar por la comisión directiva.

---

### 2.5 KPI strip — `.kpi-strip`

**Propósito.** Strip horizontal de cuatro indicadores institucionales destacados. Refuerza la presencia institucional sin generar carga cognitiva narrativa.

**Aparición.** Inicio, una vez por página. Posición preliminar después del hero y antes del primer bloque temático.

**Indicadores definitivos (cerrados 2026-05-20).**

| Slot | Valor | Etiqueta |
|---|---|---|
| 1 | +17 | Años de historia |
| 2 | +100 | Socios activos |
| 3 | 4 | Gabinetes |
| 4 | Ingeniería Química | Carrera |

El cuarto slot demuestra que el componente debe admitir valores no numéricos: en ese caso la "etiqueta" actúa como contextualización del valor textual.

**Estructura HTML.**

```html
<section class="kpi-strip" aria-label="Indicadores de AChETIQ">
  <div class="kpi-strip__item">
    <p class="kpi-strip__value">+17</p>
    <p class="kpi-strip__label">Años de historia</p>
  </div>
  <div class="kpi-strip__item">
    <p class="kpi-strip__value">+100</p>
    <p class="kpi-strip__label">Socios activos</p>
  </div>
  <div class="kpi-strip__item">
    <p class="kpi-strip__value">4</p>
    <p class="kpi-strip__label">Gabinetes</p>
  </div>
  <div class="kpi-strip__item kpi-strip__item--text">
    <p class="kpi-strip__value">Ingeniería Química</p>
    <p class="kpi-strip__label">Carrera</p>
  </div>
</section>
```

**Especificación visual.**

- Layout: `display: grid; grid-template-columns: repeat(4, 1fr)` en desktop; colapsa a 2 columnas en tablet (`≤ 768 px`) y 2 columnas en mobile pequeño (`≤ 480 px`).
- Fondo: `var(--color-surface-raised)`; borde superior e inferior `1px solid var(--color-border)`; sin radios.
- Padding vertical: `var(--space-10)` (40 px); padding horizontal según `.page`.
- Separadores verticales entre ítems en desktop: `border-right: 1px solid var(--color-border)` excepto el último.
- Item (`.kpi-strip__item`): alineación centrada, padding `0 var(--space-6)`.
- Valor numérico (`.kpi-strip__value`): tipografía `Fraunces`, rol `--text-display` (fluido 40→52 px), color `var(--color-accent)`, peso normal. Permite prefijos como "+" y sufijos como "k", "%".
- Modificador `.kpi-strip__item--text` para slots de valor textual (caso 4): reducir el valor al rol `--text-lead` y mantener la misma tipografía y color, para preservar coherencia tipográfica sin generar disonancia visual con los slots numéricos.
- Label (`.kpi-strip__label`): tipografía body, `--text-small`, color `var(--color-text-soft)`, alineación centrada.

**Carga.** Estática en v1.0. Los valores se hardcodean en el HTML de `index.html`; revisión semestral por la comisión directiva. No se justifica un JSON dedicado mientras los KPIs no superen 4 valores.

**Accesibilidad.** `<section aria-label="...">` para anunciar el bloque. Cada ítem mantiene la dupla valor + label en orden lógico (el lector de pantalla lee primero el valor, luego la etiqueta, replicando la cognición visual).

---

## 3. Componentes de contenido textual

### 3.1 Prose block — `.prose`

**Propósito.** Contenedor de texto largo (historia, misión, descripción). Aplica reglas tipográficas optimizadas para lectura.

**HTML.**

```html
<article class="prose">
  <p>Primer párrafo…</p>
  <p>Segundo párrafo…</p>
  <h3>Subtítulo</h3>
  <p>Tercer párrafo…</p>
</article>
```

**Especificación visual.**

- Ancho máximo `var(--measure-prose)` (65ch, medida óptima de lectura).
- Espaciado entre párrafos: `var(--space-4)` (16 px).
- Espaciado superior antes de un `<h3>` interno: `var(--space-8)` (32 px).
- Color de texto: `var(--color-text-soft)` para mejor confort de lectura larga.
- Color de subtítulos `<h3>`: `var(--color-text)`.

---

### 3.2 Blockquote — `.quote`

**Propósito.** Cita destacada (testimonio de un integrante, frase institucional).

**HTML.**

```html
<blockquote class="quote">
  <p class="quote__text">El gabinete solidario es el corazón humano de la asociación.</p>
  <footer class="quote__attribution">— Comisión directiva, 2026</footer>
</blockquote>
```

**Especificación visual.** Borde izquierdo de 3 px en `var(--color-accent)`, padding izquierdo `var(--space-5)`, tipografía `var(--font-display)` en cursiva para `.quote__text`, body normal para `.quote__attribution`.

---

## 4. Tarjetas

### 4.1 Card base — `.card`

Ya definida en `tokens.css` (§COMPONENTE — TARJETA). Sirve como base de las variantes que siguen.

*Actualización S2.* El borde pasó de 0.5 px a `var(--elevation-border)` (1 px — el medio píxel rendía de forma inconsistente en pantallas no retina) y el padding consume `var(--card-pad)`. El separador de `.card-footer` usa `var(--elevation-border-soft)`.

---

### 4.2 Card de gabinete — `.card-gabinete`

**Propósito.** Representa un gabinete en el listado de la página `/gabinetes.html`.

**Aparición.** Grid de 2 columnas en desktop, 1 columna en mobile.

**Estructura HTML.**

```html
<article class="card card-gabinete">
  <div class="card-gabinete__icon">
    <!-- ícono SVG inline correspondiente al gabinete (cursos, eventos, etc.) -->
  </div>
  <h3 class="card-gabinete__title">Gabinete de Cursos y Conferencias</h3>
  <p class="card-gabinete__desc">Lleva adelante las actividades académicas de la asociación.</p>
  <footer class="card-footer">
    <a href="/pages/gabinetes/cursos-y-conferencias.html" class="card-gabinete__link">
      Conocer más →
    </a>
  </footer>
</article>
```

**Especificación visual.**

- Padding interno: `var(--space-6)` (24 px).
- Icono: 32×32 px, color `var(--color-accent)`.
- Título: usa `<h3>` con tipografía global.
- Link de footer: color `var(--color-cta-text)` (mauveína tipográfica, 7.8:1 — uso permitido por ser enlace de apertura directa).
- Hover: borde se intensifica a `var(--color-accent)` con `transition: border-color var(--transition-fast)`.

*Nota (2026-05-16).* El patrón de plantilla única parametrizada por query string fue descartado. Cada gabinete tiene su propia página dedicada bajo `pages/gabinetes/`. El listado completo de URLs hijas está fijado en `data/navbar.json`.

---

### 4.3 Card de integrante de directiva — `.card-integrante`

**Propósito.** Representa a un miembro de la comisión directiva en la página "Sobre AChETIQ".

**Aparición.** Grid de 4 columnas en desktop, 2 en tablet, 1 en mobile.

**Estructura HTML.**

```html
<article class="card-integrante">
  <div class="card-integrante__photo">
    <img src="/assets/img/directiva/dafne-ritterband.jpg" alt="" loading="lazy">
    <!-- alt vacío porque el nombre está justo debajo (decisión de a11y: evita redundancia) -->
  </div>
  <h3 class="card-integrante__name">Dafne Ritterband</h3>
  <p class="card-integrante__role">Presidente</p>
</article>
```

**Especificación visual.**

- Foto: aspecto cuadrado 1:1, `border-radius: var(--radius-lg)` (10 px), `object-fit: cover`.
- Sin borde de tarjeta — es un "tarjeta sin caja", visualmente más liviana.
- Nombre: `<h3>` con tipografía body (`--text-h3`), peso medium.
- Cargo: `<p>` con tipografía body, `--text-small`, color `var(--color-text-soft)`.
- Estado sin foto (`foto: null`): placeholder con iniciales del nombre sobre fondo `var(--color-border-soft)` y color `var(--color-accent)`.

---

### 4.4 Card de noticia — `.card-noticia`

**Propósito.** Preview de una noticia en grids de noticias o en el inicio.

**Estructura HTML.**

```html
<article class="card card-noticia">
  <a class="card-noticia__cover-link" href="/pages/noticia.html?slug=jornadas-2026">
    <img class="card-noticia__cover" src="/assets/img/eventos/jornadas-2026.jpg" alt="" loading="lazy">
  </a>
  <div class="card-noticia__body">
    <p class="eyebrow card-noticia__category">Eventos</p>
    <h3 class="card-noticia__title">
      <a href="/pages/noticia.html?slug=jornadas-2026">Jornadas Académicas 2026</a>
    </h3>
    <p class="card-noticia__excerpt">Resumen breve de la noticia, en dos líneas máximo.</p>
    <footer class="card-footer">
      <time class="caption" datetime="2026-04-15">15 de abril, 2026</time>
      <a href="/pages/noticia.html?slug=jornadas-2026" class="card-noticia__readmore">Leer →</a>
    </footer>
  </div>
</article>
```

**Especificación visual.**

- Imagen de cover: aspecto 16:9, `object-fit: cover`, `border-radius: var(--radius-lg) var(--radius-lg) 0 0` (solo esquinas superiores).
- Body padding: `var(--space-5)` (20 px).
- Título: `<h3>`, 2 líneas máximo con `-webkit-line-clamp: 2`.
- Excerpt: 3 líneas máximo con `-webkit-line-clamp: 3`.

---

### 4.5 Card de actividad próxima — `.card-actividad`

**Propósito.** Mostrar una actividad futura con énfasis en la fecha.

**Estructura HTML.**

```html
<article class="card card-actividad">
  <div class="card-actividad__date">
    <span class="card-actividad__day">15</span>
    <span class="card-actividad__month">JUN</span>
  </div>
  <div class="card-actividad__content">
    <h3 class="card-actividad__title">Charla introductoria a Ingeniería Química</h3>
    <p class="card-actividad__meta">
      <span>18:00 hs</span> ·
      <span>Aula Magna, FRRe</span>
    </p>
    <p class="card-actividad__desc">Descripción breve del evento, dos líneas.</p>
  </div>
</article>
```

**Especificación visual.**

- Layout interno horizontal: bloque de fecha a la izquierda (ancho fijo 80 px), contenido a la derecha (flex: 1).
- Bloque de fecha: fondo `var(--color-accent)`, texto blanco, padding `var(--space-3)`.
- Día: tipografía display, `--text-h2`.
- Mes: tipografía mono, `--text-caption`, uppercase, tracking-wider. Texto del bloque en `--color-on-accent` sobre relleno `--color-accent`.

---

### 4.6 Card de recurso académico — `.card-recurso`

**Propósito.** Listar un archivo descargable (apunte, guía, bibliografía) en la sección Recursos.

**Estructura HTML.**

```html
<article class="card card-recurso">
  <div class="card-recurso__icon">
    <!-- icono SVG según tipo: PDF, DOCX, link externo -->
  </div>
  <div class="card-recurso__content">
    <h4 class="card-recurso__title">Guía de Ejercicios — Unidad 1</h4>
    <p class="card-recurso__meta">PDF · 1.2 MB · 24 páginas</p>
  </div>
  <a class="card-recurso__action" href="/docs/quimica-general-guia-u1.pdf" download>
    Descargar →
  </a>
</article>
```

**Especificación visual.** Layout horizontal en desktop, vertical en mobile. Icono: 24×24 px, color `var(--color-accent-soft)`. Acción: `var(--color-cta-text)` (mauveína tipográfica; uso permitido por ser enlace de apertura/descarga directa).

---

### 4.7 Card de valor institucional — `.card--valor`

**Propósito.** Tarjeta representativa de un valor institucional. Modificador de `.card` base.

**Aparición.** Grid en Sobre AChETIQ — Bloque 4 (Valores). 3 columnas en desktop, 2 en tablet, 1 en mobile (preliminar; sujeto a confirmación en wireframes).

**Estructura HTML.**

```html
<article class="card card--valor">
  <div class="card--valor__icon">
    <!-- ícono Lucide inline, decorativo, aria-hidden="true" -->
  </div>
  <h3 class="card--valor__title">Compromiso</h3>
  <p class="card--valor__desc">
    Descripción breve del valor en una a dos líneas, sin retórica adornada.
  </p>
</article>
```

**Especificación visual.**

- Borde `1px solid var(--color-border)`; radio `var(--radius-md)`; sin fondo (`background: transparent`, hereda `var(--color-surface)`).
- Padding interno: `var(--space-5)` (20 px).
- `min-height` uniforme entre tarjetas del grid (≈ 180 px) para evitar discrepancia visual cuando las descripciones varían en longitud. Valor exacto a ajustar en Fase 2 contra el texto definitivo.
- Ícono: 28×28 px, color `var(--color-accent)`. Margen inferior `var(--space-3)`.
- Título: `<h3>`, tipografía body (`--text-h3`), peso medium, color `var(--color-text)`.
- Descripción: tipografía body, `--text-small`, color `var(--color-text-soft)`.

**Estados.** No interactivo. Sin hover.

**Accesibilidad.** Ícono decorativo (`aria-hidden="true"`); semántica auto-explicada por la dupla `<h3>` + `<p>`.

**Pendiente institucional.** Las seis descripciones de valores son borradores no autoritativos a la espera de aprobación de la comisión directiva.

---

### 4.8 Card de institución vinculada — `.card-institucion`

**Propósito.** Tarjeta representativa de una institución vinculada a AChETIQ (UTN FRRe, ANEIQA).

**Aparición.** Sobre AChETIQ — Bloque 5 (Instituciones vinculadas). Grid de 2 columnas en desktop, 1 columna en mobile.

**Estructura HTML.**

```html
<article class="card card-institucion">
  <img class="card-institucion__logo"
       src="/assets/img/institucional/utn-frre-logo.svg"
       alt="Logo UTN Facultad Regional Resistencia"
       loading="lazy">
  <h3 class="card-institucion__name">UTN — Facultad Regional Resistencia</h3>
  <a class="card-institucion__link"
     href="https://frre.utn.edu.ar/"
     target="_blank" rel="noopener noreferrer">
    frre.utn.edu.ar →
  </a>
</article>
```

**Especificación visual.**

- Borde `1px solid var(--color-border)`; radio `var(--radius-md)`; fondo `var(--color-surface-raised)`.
- Padding generoso: `var(--space-8)` (32 px), para dar respiración al logo.
- Layout interno vertical centrado: logo arriba, nombre al medio, link al pie.
- Logo: altura fija ≈ 64 px, ancho `auto`, `object-fit: contain`. Sin manipulación de colores; el logo debe entregarse con fondo transparente.
- Nombre: tipografía body, `--text-h4`, peso medium, color `var(--color-text)`, alineación centrada.
- Link: tipografía body, `--text-small`, color `var(--color-cta-text)` (uso permitido — enlace externo institucional). Margen superior `var(--space-2)`.

**Estados.** Hover sobre la tarjeta: borde se intensifica a `var(--color-accent)`; transición `var(--transition-fast)`.

**Carga dinámica.** Poblada vía `data-loader="instituciones"` desde `data/instituciones.json`.

**Estado de assets (2026-05-20).** Los logos transparentes de UTN FRRe (`assets/img/institucional/utn-frre-logo.svg`) y ANEIQA (`assets/img/institucional/aneiqa-logo.svg`) están provistos y disponibles en el repositorio. Ambos son SVG con fondo transparente, compatibles con el fondo `var(--color-surface-raised)` de la tarjeta. Pendiente menor (no bloqueante): optimización de los SVG (actualmente vectorizados a partir de bitmaps; ~30 KB cada uno) en una iteración post-despliegue.

---

### 4.9 Card de materia — `.card-materia`

**Propósito.** Tarjeta de materia individual en el grid de Recursos Académicos. Card clickeable que conduce a la página de detalle de la materia.

**Aparición.** Recursos Académicos — Bloque 4. Grid de 41 materias (Plan 2023), distribuidas en 5 grupos por año académico, filtradas mediante `.pill-nav` (§7.2).

**Estructura HTML.**

```html
<a class="card card-materia"
   href="/pages/recursos/apuntes.html#termodinamica"
   data-anio="3">
  <div class="card-materia__cover" aria-hidden="true">
    <!-- placeholder visual por color de año en v1.0; imagen representativa en v1.1+ -->
  </div>
  <div class="card-materia__body">
    <p class="card-materia__year caption">3.º año</p>
    <h3 class="card-materia__name">Termodinámica</h3>
  </div>
</a>
```

**Especificación visual.**

- Tarjeta como elemento `<a>` para hacer toda la superficie clickeable (no envolver con `<a>` exterior).
- Borde `1px solid var(--color-border)`; radio `var(--radius-md)`; fondo `var(--color-surface)`.
- Layout interno: cover en la parte superior (aspecto 16:9 o 4:3, a definir contra wireframe), body debajo con padding `var(--space-4)`.
- Cover (placeholder v1.0): fondo `var(--color-materia-anio-N)` donde `N ∈ {1,2,3,4,5}`, derivado del atributo `data-anio` mediante regla CSS:

  ```css
  .card-materia[data-anio="1"] .card-materia__cover { background: var(--color-materia-anio-1); }
  /* idem 2–5 */
  ```

  Los cinco colores `--color-materia-anio-1` a `--color-materia-anio-5` están **definidos en tokens v3** (capa de alias de componente): narrativa arena dorada (1.°) → mauveína clara → cobalto niebla → cobalto medio → cobalto profundo (5.°), derivados de las primitivas «Cobalto & Mauveína», distintos entre sí y sin solapamiento con los colores reservados al isotipo.
- Año (`.card-materia__year`): mono `--text-eyebrow-sm`, color `var(--color-text-faint)`, uppercase, tracking-wider.
- Nombre (`.card-materia__name`): `<h3>`, tipografía body, `--text-h4`, peso medium, color `var(--color-text)`.

**Estados.**

- Hover: borde se intensifica a `var(--color-accent)`; cover aumenta brillo levemente (`filter: brightness(1.05)`). Transición `var(--transition-fast)`.
- Foco: anillo del sistema centralizado (§0.4, focus.css) — la tarjeta no declara outline propio.

**Carga dinámica.** Poblada vía `data-loader="recursos"` desde `data/recursos.json` (41 materias). El loader debe agrupar visualmente por año y conectar con el filtro de `.pill-nav`.

**Versionado.**

- v1.0: cover como placeholder por color de año.
- v1.1+: cover con imagen representativa por materia (campo `imagen` a agregar en `data/recursos.json`; provisión por comisión directiva).

---

### 4.10 Card de canal de contacto — `.contact-card`

**Propósito.** Tarjeta de canal de contacto institucional. Aparece en Contacto — Bloque 2 (Información de contacto directa).

**Aparición.** `.contact-grid` con 4 tarjetas en desktop (Email, Instagram, LinkedIn, Dirección), colapsa a 2 columnas en tablet y 1 en mobile.

**Estructura HTML — variante activa.**

```html
<a class="contact-card"
   href="mailto:achetiq.resistencia@aneiqa.org">
  <div class="contact-card__icon">
    <svg aria-hidden="true"><!-- Lucide `mail` --></svg>
  </div>
  <p class="contact-card__eyebrow">Correo institucional</p>
  <p class="contact-card__value">achetiq.resistencia@aneiqa.org</p>
</a>
```

**Estructura HTML — variante "Próximamente"** (cuando el valor en `data/redes.json` es `null`).

```html
<div class="contact-card contact-card--proximamente" aria-disabled="true">
  <div class="contact-card__icon">
    <svg aria-hidden="true"><!-- Lucide `linkedin` --></svg>
  </div>
  <p class="contact-card__eyebrow">LinkedIn</p>
  <p class="contact-card__value">—</p>
  <span class="contact-card__badge">Próximamente</span>
</div>
```

**Especificación visual.**

- Tarjeta como `<a>` en su forma activa (toda la superficie clickeable); como `<div>` en variante "Próximamente" (no interactiva).
- Borde `1px solid var(--color-border)`; radio `var(--radius-md)`; fondo `var(--color-surface)`.
- Padding interno: `var(--space-6)` (24 px).
- Layout interno vertical: ícono arriba, eyebrow, valor; opcionalmente badge en variante "Próximamente".
- Ícono: 28×28 px, color `var(--color-accent)`, margen inferior `var(--space-3)`.
- Eyebrow (`.contact-card__eyebrow`): tipografía `Geist Mono`, uppercase, tracking-wider, `--text-eyebrow-sm`, color `var(--color-text-faint)`.
- Valor (`.contact-card__value`): tipografía body, `--text-body`, peso medium, color `var(--color-text)`. Truncar con `text-overflow: ellipsis` si excede el ancho.
- Badge (`.contact-card__badge`): pill con fondo `var(--color-border-soft)`, color `var(--color-text-soft)`, tipografía mono `--text-eyebrow`, padding `var(--space-px-2) var(--space-2)`, radio `var(--radius-pill)`.

**Estados.**

- Hover (variante activa): borde se intensifica a `var(--color-accent)`; ícono cambia a `var(--color-accent-soft)`. Transición `var(--transition-fast)`.
- Variante "Próximamente": opacidad global 0.7, cursor `default`, sin hover.

**Carga dinámica.** Las cuatro tarjetas se generan desde `data/redes.json`. Solo se renderizan canales con campo `valor` no nulo, excepto LinkedIn que se renderiza siempre en variante "Próximamente" hasta que el campo deje de ser `null`.

**Atributos externos.** Para canales externos (Instagram, LinkedIn cuando esté activo), incluir `target="_blank" rel="noopener noreferrer"`.

*Nota de restauración (S2).* Los estilos de la variante «Próximamente» y de `.contact-card__badge` se habían perdido por un truncamiento de `cards.css` en un commit de carga manual (el archivo terminaba a mitad de comentario); fueron restaurados desde el historial y migrados a los tokens v2 (`--color-text-disabled`, `--color-border-soft`).

---

## 5. Listas y grids

### 5.1 Card grid — `.grid-cards`

**Propósito.** Contenedor responsive para cualquier conjunto de tarjetas.

**Especificación.**

- Display: `grid`.
- Gap: `var(--grid-gap)` (fluido 12 → 20 px, S3) en su forma compacta, `var(--space-6)` (24 px) en su forma cómoda.
- Modificadores de columnas: `.grid-cards--2`, `.grid-cards--3`, `.grid-cards--4` (definen `grid-template-columns: repeat(N, 1fr)`). Reservados a conjuntos cuya cuenta de columnas es semántica (4 gabinetes en 2×2, 6 valores en 3×2, pares de documentos/instituciones).
- Modificador `.grid-cards--fluid` (S2): `repeat(auto-fit, minmax(min(var(--card-min), 100%), 1fr))` para colecciones sin cuenta semántica (las 41 materias de Apuntes). Sin `@media`: la densidad escala sola entre 1 y 4 columnas según el ancho disponible.
- Alineación interna por subgrid (S2): dentro de `.grid-cards`, las tarjetas de tres filas (`.card-gabinete`, `.card--valor`) comparten pistas de fila vía `grid-template-rows: subgrid` (bloque `@supports`), de modo que título/descripción/pie quedan alineados entre tarjetas hermanas. Fallback sin soporte: pila flex original con `.card-footer { margin-top: auto }` — sólo se pierde la alineación fina intermedia.

**Estrategia de container queries (S3).** Los modificadores `--2/--3/--4` ya **no consultan el viewport sino el ancho del contenedor del grid**: un grid colocado en un contexto angosto (panel, columna lateral) colapsa solo aunque el viewport sea ancho. Arquitectura en dos niveles:

1. **El padre del grid** se declara query container mediante `:where(:has(> .grid-cards)) { container-type: inline-size }` (un elemento no puede consultar su propio tamaño): de él leen los modificadores de columnas vía `@container`.
2. **El propio `.grid-cards`** se declara container a su vez: de él leen las **tarjetas** para sus ajustes internos (el cambio vertical → horizontal de `.card-documento` y `.card-recurso` es `@container`, no `@media`).

Umbrales de contenedor canónicos (referencia en `tokens.css` §UMBRALES DE CONTENEDOR): **560 px → 2 columnas · 860 px → 3 columnas / tarjetas horizontales · 1080 px → 4 columnas** (la grilla de banda `.gabinetes-grid` usa 960 px para su paso a 4, y la directiva —`--4` con `.card-integrante`— intercala un paso de 3 columnas en 860 px). El mismo patrón se replica en `.gabinetes-grid` (sobre-asociacion.css) y `.seg-dashboard__grid` (seguimiento.css).

**Progressive enhancement.** La rama activa exige container queries **y** `:has()` — `@supports (container-type: inline-size) and (selector(:has(*)))` — (Chrome/Edge 105+, Safari 16+, Firefox 121+). Cualquier navegador que no cumpla ambas cae en la rama `@supports not (…)`, que conserva las `@media` por viewport previas a S3 (768 px → 2/3 columnas; 1024 px → 4). Así un navegador con CQ pero sin `:has()` (Firefox 110–120) nunca queda clavado en una columna.

**HTML.**

```html
<div class="grid-cards grid-cards--3">
  <article class="card card-gabinete">…</article>
  <article class="card card-gabinete">…</article>
  <article class="card card-gabinete">…</article>
</div>
```

---

### 5.2 Lista de descargas — `.list-downloads`

**Propósito.** Listado vertical compacto de archivos descargables (estatuto, reglamento, etc.) cuando no amerita una tarjeta completa.

**HTML.**

```html
<ul class="list-downloads">
  <li class="list-downloads__item">
    <a class="list-downloads__link" href="/docs/Estatuto.pdf" download>
      <span class="list-downloads__icon"><!-- icono PDF --></span>
      <span class="list-downloads__title">Estatuto de AChETIQ</span>
      <span class="list-downloads__meta caption">PDF · 6.7 MB</span>
    </a>
  </li>
</ul>
```

**Especificación.** Cada ítem: `display: flex`, padding `var(--space-3)`, separador inferior `0.5px solid var(--color-border-soft)`. Hover: fondo `var(--color-surface-raised)`.

---

### 5.3 Lista de redes sociales — `.list-redes`

**Propósito.** Listado de íconos + URLs de redes sociales en el footer.

**HTML.**

```html
<ul class="list-redes" data-loader="redes">
  <!-- generado dinámicamente desde data/redes.json -->
  <li><a href="https://instagram.com/achetiq" aria-label="Instagram"><!-- icono --></a></li>
</ul>
```

**Especificación.** Layout horizontal con `gap: var(--space-3)`. Cada icono: 24×24 px, color `var(--color-text-soft)`, hover a `var(--color-accent)`.

---

### 5.4 Card de documento institucional — `.card-documento`

**Propósito.** Tarjeta de documento institucional descargable (Estatuto, Reglamento de Sanciones). Convive con `.list-downloads` como alternativa de mayor jerarquía visual.

**Criterio de elección entre `.list-downloads` y `.card-documento`.**

- `.list-downloads`: listado compacto cuando hay 3 o más documentos sin distinción jerárquica.
- `.card-documento`: tarjeta con espacio para ícono prominente y descripción extensa, cuando los documentos requieren visibilidad institucional (Estatuto, Reglamento). Usar en Sobre AChETIQ — Bloque 6.

**Distinción frente a `.card-recurso` (§4.6).** `.card-recurso` está reservado a archivos académicos individuales (apuntes, guías de ejercicios) dentro de Recursos Académicos. `.card-documento` es exclusivo de documentación institucional formal.

**Aparición.** Grid de 2 columnas en desktop, 1 en mobile (Sobre AChETIQ — Bloque 6 contiene 2 ítems según `data/documentos.json`).

**Estructura HTML.**

```html
<article class="card card-documento">
  <div class="card-documento__icon">
    <!-- ícono Lucide `file-text`, decorativo, aria-hidden="true" -->
  </div>
  <div class="card-documento__body">
    <h3 class="card-documento__title">Estatuto de AChETIQ</h3>
    <p class="card-documento__desc">
      Documento fundacional que establece la estructura, objetivos y régimen interno de la asociación.
    </p>
    <p class="card-documento__meta caption">PDF · 3.12 MB</p>
  </div>
  <a class="card-documento__action btn btn-secondary"
     href="/docs/Estatuto.pdf"
     download>
    Descargar
  </a>
</article>
```

**Especificación visual.**

- Borde `1px solid var(--color-border)`; radio `var(--radius-md)`; fondo `var(--color-surface-raised)`.
- Padding interno: `var(--space-6)` (24 px).
- Layout interno: en desktop, ícono a la izquierda (48×48 px), body al centro (`flex: 1`), acción al pie del body o a la derecha; en mobile, vertical apilado.
- Ícono: 32×32 px, color `var(--color-accent)`.
- Título: `<h3>` global, tipografía body (`--text-h3`), peso medium.
- Descripción: tipografía body, `--text-small`, color `var(--color-text-soft)`.
- Metadatos (formato y peso): estilo `caption`, color `var(--color-text-faint)`.
- Acción: botón secundario, no link plano, para enfatizar la naturaleza institucional de la descarga.

**Carga dinámica.** Poblada vía `data-loader="documentos"` desde `data/documentos.json` (2 ítems en v1.0).

**Estado de assets (2026-05-20).** `docs/Estatuto.pdf` comprimido a 3.12 MB (reducción del 55.1% respecto de los 6.94 MB originales; 19 páginas conservadas). Peso aceptable para descarga institucional, ligeramente por encima del objetivo inicial de ≤ 2 MB. No requiere acción adicional para v1.0.

---

### 5.5 Timeline — `.timeline`

**Propósito.** Componente de línea de tiempo institucional que enumera hitos cronológicos de la historia de AChETIQ. Extensible a medida que se incorporan hitos. Soporta una "entrada ghost" al final que proyecta hacia el futuro sin contenido cerrado.

**Aparición.** Sobre AChETIQ — Bloque 2 (Nuestra historia). Único bloque del sitio que utiliza este componente en v1.0.

**Estructura HTML.**

```html
<ol class="timeline" data-loader="historia">
  <li class="timeline__entry">
    <div class="timeline__marker">
      <svg class="timeline__icon" aria-hidden="true"><!-- ícono Lucide --></svg>
    </div>
    <div class="timeline__content">
      <p class="timeline__year">2003</p>
      <h3 class="timeline__title">Primeros pasos ante la FeNEIQ</h3>
      <p class="timeline__desc">Descripción del hito, en prose.</p>
    </div>
  </li>
  <!-- ... más entradas ... -->
  <li class="timeline__entry timeline__entry--ghost">
    <div class="timeline__marker timeline__marker--ghost"></div>
    <div class="timeline__content">
      <p class="timeline__year">Próximamente</p>
      <p class="timeline__desc">La historia de AChETIQ continúa. Los próximos capítulos se escriben hoy.</p>
    </div>
  </li>
</ol>
```

**Especificación visual.**

- Línea vertical continua `1px solid var(--color-border)` recorre el eje izquierdo del bloque (en desktop). Decisión de eje centrado vs lateral en mobile a confirmar en Fase 2.
- Cada entrada: `display: grid; grid-template-columns: 48px 1fr; gap: var(--space-5)`.
- Marker: círculo de 32×32 px, fondo `var(--color-surface)`, borde `2px solid var(--color-accent)`, posicionado sobre la línea vertical para taparla. Ícono Lucide centrado, 16×16 px, color `var(--color-accent)`.
- Entrada ghost (`--ghost`): marker con `border-style: dashed` y `opacity: 0.6`; contenido con color `var(--color-text-faint)` y `font-style: italic` en `__desc`.
- Año (`.timeline__year`): tipografía `Geist Mono`, `--text-small`, peso medium, color `var(--color-accent)`.
- Título (`.timeline__title`): `<h3>`, tipografía body (`--text-h3`), peso medium.
- Descripción (`.timeline__desc`): tipografía body, `--text-small`, color `var(--color-text-soft)`, ancho máximo `var(--measure-prose)`.
- Separación vertical entre entradas: `margin-bottom: var(--space-8)`.

**Carga dinámica.** Poblada vía `data-loader="historia"` desde `data/historia.json`. La entrada ghost se incluye al final del array como objeto con `anio: "Próximamente"` o se renderiza estáticamente desde el template (decisión menor de Fase 2; mantener configurable).

**Accesibilidad.** Lista ordenada `<ol>` para reflejar la secuencia cronológica. Íconos decorativos (`aria-hidden="true"`); el año está siempre en el contenido textual, no en el marker.

**Estado de datos.** `data/historia.json` contiene 14 hitos cubriendo 2003–2026 (verificado 2026-05-20). La entrada ghost final no está incluida en el JSON; debe definirse el patrón en Fase 2.

**Pendiente.** Selección definitiva de íconos Lucide por hito.

---

### 5.6 Gallery events — `.gallery-events` [DIFERIDO A v1.1+]

**Propósito.** Bloque de galería organizado por evento. Cada evento se presenta con título, descripción contextual y grid de fotografías. Estructura diseñada para ser repetida verticalmente cuando hay múltiples eventos en la página.

**Aparición.** Página Galería. No incluida en v1.0. Especificación adelantada en el catálogo para evitar dependencia futura.

**Estructura HTML.**

```html
<section class="gallery-events">
  <article class="gallery-events__event">
    <header class="gallery-events__header">
      <p class="eyebrow">2024</p>
      <h2 class="gallery-events__title">XXVII CoNEIQ — Resistencia</h2>
      <p class="gallery-events__desc">
        Descripción contextual del evento, una a tres líneas.
      </p>
    </header>
    <div class="gallery-events__grid">
      <figure class="gallery-events__figure">
        <img src="/assets/img/galeria/coneiq-2024/01.jpg"
             alt="Acto de apertura del XXVII CoNEIQ"
             loading="lazy">
        <figcaption class="caption">Acto de apertura.</figcaption>
      </figure>
      <!-- ... más figuras ... -->
    </div>
  </article>
  <!-- ... más eventos ... -->
</section>
```

**Especificación visual.**

- Cada `.gallery-events__event` separado del siguiente por `margin-top: var(--space-16)` (64 px).
- Header del evento: alineación a la izquierda; eyebrow encima del título; descripción debajo. Ancho máximo del header coherente con `.prose`.
- Grid de fotografías: `display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-4)` en desktop; 2 columnas en tablet; 1 columna en mobile.
- Figura: imagen con `aspect-ratio: 4/3`, `object-fit: cover`, `border-radius: var(--radius-md)`. Figcaption opcional debajo (estilo `caption`).
- Hover sobre figura: leve aumento de brillo (`filter: brightness(1.05)`) y cursor `zoom-in` si se decide habilitar lightbox en v1.1+.

**Estado.**

- v1.0: componente especificado, no implementado.
- v1.1+: implementación dependiente de la provisión de fotografías y descripciones por la comisión directiva (4 eventos: 2 congresos IQ 2024/2025 más 2 actividades a definir).

**Pendiente.** `data/galeria.json` no existe en el repositorio. Cuando se implemente, debe seguir el patrón `data-loader="galeria"` con estructura jerárquica por evento.

**Componente complementario diferido.** Lightbox de galería para visualización ampliada de fotos (ya listado en §13 como diferido a v1.1+).

---

## 6. Formularios

### 6.1 Form de contacto — `.form` [ACTIVO DESDE S4]

*Estado (S4, 2026-06-11).* Implementado en `pages/contacto.html` como patrón accesible **sin backend**: la validación es client-side (`assets/js/contacto-form.js`) y el envío válido compone un `mailto:` hacia el correo institucional de `data/redes.json`. La decisión 2026-05-14 («solo canales») queda superada; el canal de fondo sigue siendo el correo institucional.

**Propósito.** Formulario de contacto en la página `/pages/contacto.html` y patrón normativo para todo formulario futuro del sitio.

**Estructura HTML (patrón normativo).**

```html
<form class="form" data-contact-form novalidate>
  <p class="form__hint">Los tres campos son obligatorios.</p>

  <!-- Resumen de errores: PRE-EXISTENTE, vacío + hidden. Recibe el
       foco tras un envío inválido; cada error es un enlace al campo. -->
  <div class="form__error-summary" role="alert" tabindex="-1" hidden>
    <p class="form__error-summary-title">Revisá estos campos antes de enviar:</p>
    <ul class="form__error-summary-list"></ul>
  </div>

  <div class="form__field">
    <label class="form__label" for="contacto-email">Correo electrónico</label>
    <input class="form__input" id="contacto-email" name="email" type="email"
           autocomplete="email" required
           aria-describedby="contacto-email-hint contacto-email-error">
    <p class="form__hint" id="contacto-email-hint">Lo usamos únicamente para responderte.</p>
    <!-- Error por campo: PRE-EXISTENTE, vacío + hidden, ya referenciado
         por aria-describedby. El JS escribe el texto y quita hidden. -->
    <p class="form__error" id="contacto-email-error" hidden></p>
  </div>
  <!-- … resto de campos con el mismo patrón … -->

  <p class="form__status" role="status" aria-live="polite"></p>
  <button class="btn btn-primary" type="submit">Enviar mensaje</button>
</form>
```

**Especificación visual.**

- `.form__row`: layout grid de 2 columnas en desktop, 1 en mobile, gap `var(--space-4)`.
- `.form__field`: layout vertical, gap `var(--space-2)` entre label e input.
- `.form__label`: tipografía body, `--text-small`, peso medium, color `var(--color-text)`. Siempre visible (nunca placeholder como única etiqueta).
- `.form__input`: padding `var(--space-3) var(--space-4)`, borde `1px solid var(--color-border)`, radio `var(--radius-md)`, fondo `var(--color-surface-raised)`.
- `.form__input--textarea`: `resize: vertical; min-height: 120px`.
- `.form__error-summary`: registro visual de `.loader-error` compacto; lista de enlaces en `--color-negative` subrayados.
- `.form__status`: registro de confirmación en `--color-positive`; oculto mientras está vacío (`:empty`).

**Estados.**

- **Foco**: anillo del sistema centralizado (§0.4). El foco por puntero cambia el borde a `--color-accent` (focus.css §3); esta hoja ya no suprime el outline ni engrosa el borde en foco.
- **Inválido** (`aria-invalid="true"` aplicado por JS, o `:user-invalid` nativo): borde `var(--color-negative)` engrosado a 2 px (señal no cromática, con compensación de padding) + mensaje `.form__error` visible con glifo `✕` antepuesto por CSS (decorativo, `content` con texto alternativo vacío). En foco, el borde se mantiene rojo para no diluir la señal.
- **Disabled**: `--color-text-disabled` + fondo `surface` + cursor `not-allowed` — sin `opacity` (contraste auditable).

**Accesibilidad (WCAG 3.3.1 / 3.3.3 / 4.1.3).**

- Cada input tiene `<label>` visible asociado por `for/id`; hints y errores referenciados vía `aria-describedby` **desde el markup inicial** (la asociación existe antes de que el error aparezca).
- Validación al enviar (`novalidate` + submit handler): sin interrupciones mientras se escribe; al salir de un campo corregido su error se limpia.
- Envío inválido → se puebla el resumen `role="alert"` y recibe foco (`tabindex="-1"`); cada ítem enlaza y focaliza su campo.
- Envío válido → `.form__status` (`role="status"`, región viva pre-existente) anuncia el resultado sin robar el foco.
- Los campos requeridos llevan `required` (estado expuesto a tecnologías de asistencia y habilita `:user-invalid`); `novalidate` suprime solo los globos nativos.

---

## 7. Navegación secundaria

### 7.1 Breadcrumbs — `.breadcrumbs`

**Propósito.** Navegación contextual en páginas profundas (un gabinete específico, un recurso de una materia).

**Estado de despliegue (S2, 2026-06-10).** DESPLEGADO en las seis páginas de detalle: `pages/gabinetes/{cursos-y-conferencias,eventos,prensa-y-difusion,solidario}.html` y `pages/recursos/{apuntes,seguimiento}.html`. El `aria-label` canónico es **«Ruta de navegación»** (las dos páginas de Recursos usaban «Migas de pan»; unificado). Cuando las migas abren la página, `.page-header` reduce su padding superior (`.breadcrumbs + .page-header`, headers.css) para no duplicar la respiración bajo el navbar.

**HTML.**

```html
<nav class="breadcrumbs" aria-label="Ruta de navegación">
  <ol class="breadcrumbs__list">
    <li><a href="/">Inicio</a></li>
    <li><a href="/gabinetes.html">Gabinetes</a></li>
    <li aria-current="page">Gabinete de Cursos y Conferencias</li>
  </ol>
</nav>
```

**Especificación visual.** Tipografía body, `--text-small`, color `var(--color-text-faint)`. Separador entre items: ` / ` o ` › ` (texto, no imagen). El último ítem es texto plano (no link), color `var(--color-text)`.

---

### 7.2 Pill navigation — `.pill-nav`

**Propósito.** Navegación tabular para filtrar contenido por categoría, año o tipo. Aplicable al índice por año en Recursos.

**HTML.**

```html
<nav class="pill-nav" aria-label="Filtrar por año">
  <button class="pill-nav__pill is-active" aria-pressed="true">Todos</button>
  <button class="pill-nav__pill" aria-pressed="false">1° año</button>
  <button class="pill-nav__pill" aria-pressed="false">2° año</button>
  <button class="pill-nav__pill" aria-pressed="false">3° año</button>
  <button class="pill-nav__pill" aria-pressed="false">4° año</button>
  <button class="pill-nav__pill" aria-pressed="false">5° año</button>
</nav>
```

**Especificación visual.**

- Cada pill: padding `var(--space-3) var(--space-5)` (altura efectiva ≈ 41 px — supera el mínimo 24 px de WCAG 2.5.8 y roza el estándar 44 px), borde `1px solid var(--color-border)`, radio `var(--radius-pill)` (999 px), tipografía body, `--text-small`.
- Estado activo (`is-active` + `aria-pressed="true"`): fondo `var(--color-accent)`, texto `var(--color-on-accent)` (8.6:1 — AAA), borde acento.
- Hover (no activo): fondo `var(--color-surface-raised)`, borde `var(--color-accent)`.
- Foco: anillo del sistema centralizado (§0.4); sobre la pill activa el offset deja el anillo sobre el fondo de página (8.1:1).
- El efecto del filtro se anuncia en una región viva `sr-only` polite («Mostrando N materias…», ver §8.1bis).

---

## 8. Estados y mensajes

### 8.1 Empty state — `.empty-state`

**Propósito.** Bloque que se muestra cuando una sección no tiene contenido aún (galería sin álbumes, noticias vacías, gabinete sin proyectos activos).

**HTML.**

```html
<div class="empty-state">
  <div class="empty-state__icon"><!-- icono SVG decorativo --></div>
  <h3 class="empty-state__title">Aún no hay contenido publicado</h3>
  <p class="empty-state__desc">
    Estamos trabajando en esta sección. Pronto encontrarás aquí novedades de la asociación.
  </p>
</div>
```

**Especificación.** Padding generoso (64 px arriba y abajo), texto centrado, color de íconos y títulos en `var(--color-text-faint)` para que la sección se sienta "en pausa" pero no rota.

**Anuncio a lectores de pantalla (S4).** Cuando el empty-state **sucede a un loader** (motor `data-loader`), `loaders.js` lo inserta con `role="status"` + `aria-live="polite"` y escribe la descripción en **dos fases** (nodo vivo primero, texto en el frame siguiente): una región viva insertada ya con texto puede pasar en silencio. Los empty-states estáticos del sitio usan el mismo markup **sin** estas ARIA (no representan un cambio dinámico).

---

### 8.1bis Error de carga — `.loader-error`

**Propósito.** Tercer estado del patrón `data-loader`: el fetch o el renderer fallaron. Mismo registro visual que el empty-state, con tinta `--color-negative` y borde de aviso sutil (states.css §8.1bis).

**Anuncio (S4).** `role="alert"` (assertive implícito), texto en dos fases igual que el empty-state. El detalle técnico va a consola; la persona ve solo el aviso accionable («Probá recargar la página»).

**Política de anuncios del motor (`main.js`/`loaders.js`).** La llegada del **contenido real no se anuncia**: el loader (región viva) se retira con `replaceChildren()` y el contenido entra sin `aria-live`, evitando ráfagas. Hablan únicamente el estado de carga («Cargando…», polite), el empty (polite) y el error (alert). El filtro por año de Apuntes anuncia su **efecto** («Mostrando N materias…») en una región `sr-only` polite propia (apuntes.js).

---

### 8.2 Tag/Chip — `.tag`

**Propósito.** Etiqueta pequeña para clasificar contenido (categoría de noticia, año de carrera de un recurso).

**HTML.** `<span class="tag">Termodinámica</span>`

**Especificación.** Padding `var(--space-px-2) var(--space-2)`, fondo `var(--color-border-soft)`, color `var(--color-text)`, tipografía mono `--text-eyebrow-sm`, radio `var(--radius-sm)`. Variante `--primary` con fondo `var(--color-accent-soft)` y texto `var(--color-on-accent)` (5.5:1 — AA).

---

## 9. Componentes visuales auxiliares

### 9.1 Image with caption — `.figure`

**HTML.**

```html
<figure class="figure">
  <img src="…" alt="Descripción de la imagen para lectores de pantalla">
  <figcaption class="figure__caption">Pie de imagen, contexto u origen.</figcaption>
</figure>
```

**Especificación.** `<img>` con `border-radius: var(--radius-lg)`, `width: 100%`. `<figcaption>` con `caption` style global.

---

### 9.2 Divider — `.divider`

**Propósito.** Separador visual entre bloques de contenido cuando el espaciado solo no alcanza.

**HTML.** `<hr class="divider">`

**Especificación.** `border: 0; border-top: 1px solid var(--color-border); margin: var(--space-12) 0;` (48 px arriba y abajo).

---

## 10. Patrones de carga dinámica

### 10.1 Convención `data-loader`

Todos los nodos cuyo contenido provenga de archivos JSON llevan un atributo `data-loader="<nombre>"` que indica al script qué archivo cargar.

**Ejemplo.**

```html
<div class="grid-cards grid-cards--3" data-loader="gabinetes"></div>
```

El script `js/loaders.js` recorre el DOM al cargar la página, identifica todos los `[data-loader]`, hace `fetch()` del JSON correspondiente (`data/<nombre>.json`), y renderiza las tarjetas usando una función de plantilla específica del componente.

**Mapeo loader → JSON → componente.**

| `data-loader` | Archivo | Componente generado |
|---|---|---|
| `navbar` | `partials/navbar.html` + `data/navbar.json` | `.navbar` (caso especial: carga HTML + config) |
| `directiva` | `data/directiva.json` | `.card-integrante` |
| `gabinetes` | `data/gabinetes.json` | `.card-gabinete` |
| `recursos` | `data/recursos.json` | `.card-materia` |
| `apuntes` | `data/apuntes.json` (futuro) | `.card-recurso` |
| `noticias` | `data/noticias.json` | `.card-noticia` |
| `actividades` | `data/actividades.json` | `.card-actividad` |
| `historia` | `data/historia.json` | `.timeline` |
| `documentos` | `data/documentos.json` | `.card-documento` |
| `redes` | `data/redes.json` | `.contact-card` items |
| `instituciones` | `data/instituciones.json` | `.card-institucion` items |

### 10.2 Skeleton loader — `.skeleton`

**Propósito.** Placeholder visual que se muestra mientras `fetch()` está en curso, evitando saltos de layout.

**Especificación.** Bloque con dimensiones equivalentes al componente final, fondo `var(--color-border-soft)` con animación sutil de pulso (opacity 0.6 → 1 → 0.6 en 1.5 s, ease-in-out, infinita).

---

## 11. Iconografía

### 11.1 Sistema de íconos

Se utilizará un set único de íconos vectoriales en SVG inline (no fuentes de iconos, no imágenes raster). Todos los íconos del sitio pertenecen al mismo set para mantener coherencia visual.

**Set recomendado.** **Lucide Icons** (`https://lucide.dev`) — set abierto, MIT, ~1 000 íconos, estilo de trazo consistente (1.5 px, esquinas redondeadas), formato SVG.

**Convención de inserción.** Íconos como SVG inline, no `<img>`, para que hereden `currentColor` y puedan colorearse vía CSS:

```html
<svg width="24" height="24" viewBox="0 0 24 24" fill="none"
     stroke="currentColor" stroke-width="1.5"
     stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <!-- path del icono -->
</svg>
```

**Mapeo gabinete → ícono** (orden editorial cerrado 2026-05-16).

| Gabinete | Ícono Lucide |
|---|---|
| Cursos y Conferencias | `presentation` (fallback: `book-open`) |
| Eventos | `calendar-days` |
| Prensa y Difusión | `megaphone` |
| Solidario | `heart-handshake` (fallback: `hand-helping`, `heart`) |

*Verificación pendiente.* La disponibilidad efectiva de `presentation` y `heart-handshake` en el set Lucide debe confirmarse en `https://lucide.dev/icons/` antes de fijar el código en `partials/*.html`. Si alguno no estuviera disponible, aplicar el fallback indicado.

---

## 12. Responsive — Contrato de breakpoints y contenedores (S3)

Tras la auditoría responsive S3, el sitio reparte responsabilidades en tres mecanismos. **Contrato de uso:**

1. **El viewport gobierna el layout de página** (`@media min-width`): navbar, footer, composiciones de cabecera, `about-intro`, columnas del Seguimiento.
2. **El contenedor gobierna los grids de tarjetas** (`@container`, §5.1): la densidad de columnas depende del contexto donde vive el grid, no de la pantalla.
3. **El espaciado de página no usa breakpoints**: `--page-padding-x/y`, `--section-gap` y `--grid-gap` interpolan con `clamp()` entre 360 y 1480 px (tokens.css §LAYOUT), igual que la escala tipográfica fluida.

**Breakpoints de viewport** (declarados en `tokens.css`; el literal de cada `@media` SIEMPRE corresponde a uno canónico):

| Breakpoint | Uso real tras S3 |
|---|---|
| `< 640 px` | Móvil: 1 columna en todo, navbar hamburguesa, hero compacto |
| `640 px` (`--bp-sm`) | Footer a 2 columnas (fallback sin CQ: grids de banda a 2) |
| `768 px` (`--bp-md`) | `mission-vision` y `form__row` a 2 columnas; fila de CTA del hero (fallback sin CQ: grids a 2/3 columnas) |
| `1024 px` (`--bp-lg`) | **Navbar pasa de hamburguesa a lista horizontal** (corrección S3, §1.2); footer a 4 columnas; `about-intro` a 2 columnas parejas; tabla completa del Seguimiento (`--breakpoint-seguimiento`) |
| `1280 px` (`--bp-xl`) | Enriquecimientos de pantalla ancha: `page-header` a composición editorial de dos columnas (titular ‖ bajada); `about-intro` pasa a la asimetría 6.5/9 con corrimiento de imagen |
| `1480 px` (`--bp-2xl`) | El hero abre su medida de texto a 64 rem; el contenido capea en `--max-width` con padding fluido en su máximo (64 px) |

**Umbrales de contenedor** (`@container`, referencia en `tokens.css`): 560 px → 2 columnas · 860 px → 3 columnas / tarjetas horizontales · 960 px → 4 columnas en grids de banda · 1080 px → 4 columnas en grids de página.

**Reglas duras.**

- Mobile-first estricto: las reglas base son para móvil y los `min-width` añaden complejidad progresivamente. **`max-width` queda prohibido** fuera de `@media print` (las excepciones históricas de countdown, error-404 y seguimiento fueron absorbidas por `clamp()` o convertidas a `min-width` en S3).
- Impresión: `assets/css/print.css` (S3), importada al final de la cadena de `main.css`. Oculta interfaz (nav, footer, CTA, loaders, countdown, filtros), fuerza tinta negra sobre papel blanco, expande las URL de los enlaces externos de recursos y controla los saltos de página en tarjetas y títulos.

---

## 13. Estado del catálogo

| Categoría | Componentes definidos | Suficientes para v1.0 |
|---|---|---|
| Globales | navbar, footer, page, skip-link | ✅ |
| Cabeceras | hero, page-header, section-title, mission-vision, kpi-strip | ✅ |
| Texto | prose, quote | ✅ |
| Tarjetas | card base + card-gabinete, card-integrante, card-noticia, card-actividad, card-recurso, card--valor, card-institucion, card-materia, contact-card | ✅ |
| Listas y grids | grid-cards, list-downloads, list-redes, card-documento, timeline, gallery-events | ✅ (gallery-events diferido a v1.1+) |
| Formularios | form de contacto (diferido a v1.1+) | ✅ (v1.0 sin formulario) |
| Navegación 2.ª | breadcrumbs, pill-nav | ✅ |
| Estados | empty-state, tag, skeleton | ✅ |
| Auxiliares | figure, divider | ✅ |
| Carga dinámica | convención `data-loader` | ✅ |

**Componentes diferidos a v1.1+:** form de contacto (§6.1), gallery-events (§5.6), lightbox de galería, paginador, comentarios, modal de búsqueda. Se especificarán o reactivarán cuando esas secciones entren en alcance.

**Pendientes técnicos identificados (no bloquean Fase 2, sí v1.0):**

- ~~Cinco colores `--color-materia-anio-1` a `--color-materia-anio-5` para `.card-materia`~~ — resuelto en tokens v3 (§0.1, capa de alias de componente).
- Verificación en `https://lucide.dev/icons/` de la disponibilidad de `presentation`, `telescope` y `heart-handshake`; aplicación de fallbacks si corresponde.
- Selección de íconos Lucide por hito de la timeline.

---

## 14. Próximos pasos

Con este catálogo cerrado (incluidas las nueve altas y las cuatro correcciones aplicadas el 2026-05-20) y los wireframes de v1.0 completos, **Fase 1 queda resuelta**. La Fase 2 (desarrollo front-end) puede iniciarse mecánicamente sobre las páginas prioritarias: Inicio, Sobre AChETIQ, Gabinetes, Recursos Académicos y Contacto.

**Antes de generar el primer archivo HTML de Fase 2 conviene resolver, en este orden:**

1. **Esqueleto base HTML (boilerplate)** reutilizable para todas las páginas y para las páginas hijas de `pages/gabinetes/` y `pages/recursos/`. Reemplaza a las plantillas parametrizadas descartadas el 2026-05-16.
2. ~~**Paleta placeholder por año** para `.card-materia`~~ — resuelta en tokens v3 (§0.1).
3. **Verificación de íconos Lucide** críticos (`presentation`, `telescope`, `heart-handshake`).

Los pendientes de contenido (validación de valores, prose de Misión, contenido de gabinetes, fotos de directiva, logos transparentes, compresión del Estatuto) no bloquean el desarrollo técnico inicial, pero sí el despliegue público de v1.0.

---

*AChETIQ — Documento técnico interno — Fase 1 — 2026-05-08 · actualizado 2026-06-15 (tokens v3 «Cobalto & Mauveína» — rediseño fundacional S1 de tipografía y color: paleta OKLCH de tres capas, tipografías Fraunces + Hanken Grotesk, escala fluida heredada de la v2)*
