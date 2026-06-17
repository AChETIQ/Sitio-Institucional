# Design System Master File — AChETIQ

> **Fuente de verdad entre sesiones (P01–P22).** Complementa a `DESIGN.md` (raíz, formato
> Stitch) y a `PRODUCT.md` (estrategia). Si chocan, **manda `DESIGN.md`** para tokens y
> `PRODUCT.md` para registro/voz; este archivo los resume y agrega los guardarraíles
> universales de UX/accesibilidad de ui-ux-pro-max ya reconciliados con la identidad.
>
> **LÓGICA DE RECUPERACIÓN:** al construir una página, primero revisá
> `design-system/pages/[nombre].md`. Si existe, sus reglas **sobrescriben** a este Master.
> Si no, seguí estrictamente lo de abajo.

**Proyecto:** AChETIQ · **Registro:** brand (el diseño ES el producto) · **Idioma:** es-AR
**Generado:** 2026-06-15 (ui-ux-pro-max `--design-system --persist`) y **reconciliado a mano**
contra la identidad comprometida.

---

## ⚠ 0. Identidad CONGELADA (no se toca en P01–P22)

Dos rondas previas de mejora se hicieron **sin** las skills de diseño y dieron un resultado
mediocre. Esta línea base ancla el trabajo en las skills, **preservando** lo que ya está bien
valorado. Lo siguiente es identidad enviada y ratificada; las sesiones de elevación la
**preservan, no la reemplazan**:

| Capa | Valor congelado | Origen |
|------|-----------------|--------|
| Display | **Fraunces** (serif de alto contraste) — solo H1/H2 | `tokens.css --font-display` |
| Cuerpo | **Hanken Grotesk** (grotesca humanista) | `tokens.css --font-body` |
| Etiqueta | **Geist Mono** (monoespaciada técnica) | `tokens.css --font-mono` |
| Marca | **Cobalto** `oklch(0.420 0.165 262)` / #1344A5 | `--color-accent` |
| Acción | **Mauveína** `oklch(0.500 0.190 322)` / #922FA1 | `--color-cta` |
| Fondo | **Porcelana fría** `oklch(0.967 0.005 265)` / #F2F4F8 | `--color-surface` |
| Tinta | **Grafito** `oklch(0.205 0.018 265)` / #131720 | `--color-text` |

> **Nota de reconciliación con impeccable:** la guía de impeccable para **proyecto nuevo**
> (`palette.mjs`, "color-strategy", elegir fuentes desde cero) **NO aplica** a este proyecto.
> Gana la identidad comprometida. Que **Fraunces** figure en la lista de "reflejo a evitar"
> de impeccable es irrelevante: ya es marca enviada (la lista es para decisiones greenfield).

> **Nota de reconciliación con ui-ux-pro-max:** el recomendador automático devolvió, para la
> consulta "education association nonprofit", un sistema **Claymorphism + Baloo 2 / Comic
> Neue + #2563EB/#F97316**. Es el reflejo de catálogo "educación = infantil/lúdico" y queda
> **anotado pero NO aplicado**: contradice el registro académico serio. Se conservan solo sus
> guardarraíles universales (sección 5). La paleta y tipografía de esa recomendación están
> **vetadas** (sección 4).

---

## 1. Paleta de color (semántica · congelada)

Valores canónicos en OKLCH (doctrina del proyecto); `tokens.css` ofrece el fallback hex sRGB.
**Consumir siempre `var(--token)`; nunca hex crudo en componentes.**

| Rol | Token | OKLCH | Hex |
|-----|-------|-------|-----|
| Marca / acento | `--color-accent` | `oklch(0.420 0.165 262)` | `#1344A5` |
| Acento suave | `--color-accent-soft` | `oklch(0.515 0.150 262)` | `#3463BC` |
| Acción (CTA) | `--color-cta` | `oklch(0.500 0.190 322)` | `#922FA1` |
| Acción como texto | `--color-cta-text` | `oklch(0.440 0.175 322)` | `#7C228A` |
| Fondo | `--color-surface` | `oklch(0.967 0.005 265)` | `#F2F4F8` |
| Superficie elevada | `--color-surface-raised` | `oklch(0.985 0.003 265)` | `#F9FAFC` |
| Papel hundido (E01) | `--color-surface-sunken` | `oklch(0.945 0.006 265)` | `#EAEDF2` |
| Realce frío derivado (E01) | `--color-surface-accent` | `oklch(0.965 0.012 262)` | `#EFF4FC` |
| Texto | `--color-text` | `oklch(0.205 0.018 265)` | `#131720` |
| Texto apoyo | `--color-text-soft` | `oklch(0.404 0.018 265)` | `#444953` |
| Texto tenue | `--color-text-faint` | `oklch(0.486 0.017 265)` | `#5B5F69` |
| Borde / borde suave | `--color-border` / `-soft` | `0.862 / 0.918 · 265` | `#CED2D9` / `#E1E4E9` |
| Regla hairline / tinta (E01) | `--color-rule` / `--color-rule-ink` | = borde / = texto | `#CED2D9` / `#131720` |
| Positivo / Negativo / Alerta | `--color-positive/negative/warning` | ver `tokens.css` | `#165E2E`/`#9B171F`/`#915900` |

**Regla de la Mauveína Escasa:** el magenta de acción aparece en ≤ 10 % de la pantalla (botón
primario y poco más). **Regla de la Porcelana Fría:** el fondo es grafito frío, jamás crema.

## 2. Tipografía (congelada)

- **Display (Fraunces 400):** solo H1 y héroe. `clamp(2.5rem … 3.25rem)`, lh 1.08, tracking -0.015em.
  **E01:** el héroe cierra a `--tracking-display` -0.021em (piso -0.04em) para el color de portada.
- **Headline (Fraunces 400):** H2. `clamp(2.06rem … 2.56rem)`, lh 1.3. **La serif no baja de H2.**
- **Title (Hanken Grotesk 500):** H3/H4. La grotesca de cuerpo, no la serif.
- **Body (Hanken Grotesk 400):** prosa, lh 1.7, medida 65–75ch.
- **Label/Eyebrow (Geist Mono 400):** 0.6875rem, tracking 0.12em, mayúsculas. **Con mesura: no
  en cada sección.** **Cadencia E01 (la estrena la portada, E02–E07 heredan):** UN solo kicker
  deliberado por vista (el *dateline* del héroe, `.hero__dateline` — mono, tracking abierto, NO
  mayúsculas tracked; en las interiores, el eyebrow del `.page-header`) y CERO eyebrows bajo el
  pliegue; las secciones abren con titular display + *standfirst* en Hanken
  (`.section-title__standfirst`). **E07 enforcement:** las 11 superficies cumplen la cadencia —
  exactamente un kicker por vista; el cierre `.cta-final` abre directo con el titular, sin eyebrow.

## 3. Espaciado, radio, elevación, movimiento

- **Espaciado:** escala de 4 px — `--space-1..16` (4/8/12/16/20/24/32/40/44/48/56/64).
- **Radio:** `sm 4` · `md 6` (botones/inputs) · `lg 10` (tarjetas) · `xl 14` · `pill 999`.
- **Elevación PLANA por defecto:** tarjetas con borde 1 px, **sin sombra en reposo**. Sombra
  solo como respuesta a estado. **Sombras frías** mezcladas desde `cobalto-950` (`color-mix`),
  nunca `rgba(0,0,0,…)`. **El borde de 1 px se consume siempre por token** (`--elevation-border`
  / `--elevation-border-soft`); nada de pesos sub-pixel literales (`0.5px`), que redondean a 0 en
  pantallas 1× y rompen el contrato hairline (drift de seguimiento saldado en E07).
- **Reglas hairline (E01):** la separación entre secciones es **aire + filete 1 px**, no caja.
  Tokens compuestos `--rule` (1px, estándar, `.section-ruled`) y `--rule-ink` (1.5px tinta,
  *masthead*, una vez por página, `.section-ruled--mast`). Nunca un `border-top` literal.
- **Movimiento:** `--transition-fast 150ms` (UI), `normal 250ms`, `slow 400ms` (tope micro),
  `--ease-out cubic-bezier(0.22,1,0.36,1)` para entradas. **`prefers-reduced-motion` obligatorio.**
- **Breakpoints:** sm 640 · md 768 · lg 1024 · xl 1280 · 2xl 1480 (= `--max-width`). Mobile-first.

## 4. Anti-patrones (PROHIBIDO)

Específicos de este proyecto (marca):
- ❌ **Reemplazar fuentes o paleta.** Son identidad congelada.
- ❌ **Estética "educación = infantil":** claymorphism, Baloo 2 / Comic Neue, azul-naranja
  saturado (#2563EB/#F97316), mascota. (Recomendación automática **vetada**.)
- ❌ **Fondo crema/arena cálido** "por elegancia": tell de IA 2026.
- ❌ **Eyebrow en mono sobre cada sección** (gramática automática de IA). **Resuelto en la portada
  (E01):** un solo *dateline* en el héroe + *standfirst* por sección; patrón a heredar, no la deuda.
- ❌ **Grillas de tarjetas idénticas** (ícono + título + texto) como recurso por defecto.
  Alternativa canónica (E01): el **índice editorial** con filetes hairline (`.gabinetes-index`).
- ❌ **Parecer plantilla de Wix / constructor comercial** (el fracaso que motivó la migración).

Transversales (impeccable + ui-ux-pro-max):
- ❌ `border-left`/`border-right` > 1 px como franja de acento.
- ❌ Texto en gradiente (`background-clip: text`), glassmorfismo decorativo, plantilla métrica-héroe.
- ❌ Emojis como íconos (usar SVG Lucide), texto < 12 px de cuerpo, gris-sobre-gris, hex crudo.
- ❌ Cambios de estado instantáneos (0 ms), foco invisible, hover-only para acciones primarias.

## 5. Guardarraíles universales de UX/accesibilidad (de ui-ux-pro-max, ya alineados)

Estos sí se conservan de la recomendación automática porque coinciden con la identidad:
- Contraste **4.5:1** texto normal / **3:1** texto grande; documentar el ratio calculado.
- **Foco visible** en todo elemento interactivo (anillo cobalto tokenizado).
- **Alt** descriptivo en imágenes informativas; `alt=""` en decorativas.
- **`aria-label`** en botones solo-ícono; orden de tabulación = orden visual.
- Áreas táctiles **≥ 44×44 px**; `cursor: pointer` en clicables.
- Transiciones **150–300 ms**; respetar **`prefers-reduced-motion`**.
- Formularios: **etiqueta visible** (no placeholder), error junto al campo, **señal no
  cromática** (borde + glifo + texto), `aria-live`/`role="alert"` para el resumen.
- Imágenes **WebP/AVIF**, `loading="lazy"` bajo el pliegue, reservar dimensiones (CLS < 0.1).
- **Movimiento autónomo > 5 s con control de pausa (WCAG 2.2.2):** el slideshow del héroe expone
  `.hero__pause` (revelado por JS sólo cuando corre; oculto bajo `prefers-reduced-motion`).
- Responsive verificado en 375 / 768 / 1024 / 1440; sin scroll horizontal en móvil.
- **Camino sin JavaScript** funcional (`<noscript>` espejo de cada bloque dinámico).

## 6. Checklist previo a entregar (cada P01–P22)

- [ ] No se tocaron fuentes ni paleta congeladas.
- [ ] Fraunces solo en H1/H2; mauveína ≤ 10 %; fondo porcelana fría.
- [ ] Sin eyebrow en cada sección; sin grillas de tarjetas idénticas por reflejo.
- [ ] Contraste y foco verificados; señales de estado con glifo/texto.
- [ ] `prefers-reduced-motion` y camino sin JS preservados.
- [ ] `npm run build:css` corrido si cambió CSS modular (no editar `main.bundle.css` a mano).
- [ ] Verificado en 375 / 768 / 1024 / 1440 px.
