# AChETIQ — Presupuesto de rendimiento (S6)

Versión: 1.2 · Sesión 6 — Rendimiento y entrega de activos · Revisión S7 (hero responsive) · Revisión P05 (elevación de entrega)
Fundamento: auditoría Lighthouse 13.4 (Chrome 138) del 2026-06-11; re-medición 2026-06-12 (hero responsive) y 2026-06-16 (P05: cuadro LCP del hero pintado desde CSS + reservas de prosa de gabinete por campo). Medición P05 con Chromium 141 headless y `serve` (gzip), mediana de 2 corridas.

Este documento fija el **presupuesto de rendimiento** del sitio: los umbrales
que toda página debe cumplir, las condiciones de medición que los hacen
re-chequeables y las excepciones documentadas. Cualquier cambio que rompa un
umbral debe corregirse o justificarse aquí antes de mergearse.

---

## 1. Umbrales

| Métrica | Umbral | Condición de medición |
|---|---|---|
| LCP | **< 2,5 s** | Lighthouse mobile, throttling por defecto (Moto G Power simulado, 4G lento) |
| CLS | **< 0,1** | Lighthouse mobile y desktop |
| TBT (proxy de INP en lab) | **< 200 ms** | Lighthouse mobile |
| CSS total transferido | **< 75 KB** | Suma de hojas CSS **comprimidas** (GitHub Pages sirve gzip/brotli) |
| Transferencia por página | **< 500 KB** | `total-byte-weight` de Lighthouse contra un servidor **con compresión** |

Notas:

- Los umbrales de transferencia se definen sobre bytes **comprimidos**, porque
  es lo que GitHub Pages entrega en producción. Medir contra un servidor sin
  gzip (p. ej. `python3 -m http.server`) infla CSS/JS/HTML ~5× y no representa
  el sitio publicado.
- El CSS fuente (tokens.css + 18 hojas modulares) pesa ~200 KB con su
  documentación; el bundle generado queda en ~82 KB planos / **~14 KB gzip**.

## 2. Estado actual (2026-06-16, después de P05)

Matriz **antes → después** de P05 (mediana de 2 corridas, gzip; mobile =
throttling por defecto, desktop = `--preset=desktop`). «Antes» = estado
mergeado de S7; «después» = esta sesión.

| Página | Modo | LCP | CLS | TBT | Transferencia |
|---|---|---|---|---|---|
| Inicio | mobile | 2,74 → **2,64 s** ⚠ (excepción §4) | 0,000 → 0,000 | 0 → 0 ms | 306 → 306 KB |
| Inicio | desktop | 0,67 → 0,78 s ¹ | 0,000 → 0,000 | 0 → 0 ms | 458 → 459 KB |
| Gabinete (eventos) | mobile | 2,28 → 2,34 s ¹ | **0,056 → 0,014** | 0 → 0 ms | 181 → 181 KB |
| Gabinete (eventos) | desktop | 0,54 → 0,59 s ¹ | **0,031 → 0,005** | 0 → 0 ms | 181 → 181 KB |
| Apuntes | mobile | 2,28 → 2,27 s | 0,008 → 0,008 | 0 → 0 ms | 182 → 183 KB |
| Apuntes | desktop | 0,55 → 0,57 s | 0,011 → 0,011 | 0 → 0 ms | 182 → 183 KB |
| Contacto | mobile | 2,12 → 2,13 s | 0,001 → 0,001 | 0 → 0 ms | 186 → 186 KB |
| Contacto | desktop | 0,59 → 0,58 s | 0,002 → 0,002 | 0 → 0 ms | 186 → 186 KB |

Cambios de P05 (solo entrega; renderizado **pixel-idéntico** verificado por
captura a 375 y 1280 px — los PNG resultaron byte-idénticos antes/después):

- **CLS del detalle de gabinete: −75 % móvil (0,056 → 0,014) y −84 % desktop
  (0,031 → 0,005)**, el peor CLS del sitio. Causa: las tres regiones de prosa
  (`proposito`/`actividades`/`historia`) se inyectan tras `fetch` y antes solo
  reservaban un piso genérico de 48 px; ahora reservan pisos **por campo**
  medidos como el mínimo cruzado entre los 4 gabinetes y todos los viewports
  (`loader.css` §RESERVA, regiones de datos). El piso queda siempre ≤ al
  contenido real, de modo que no abre hueco ni provoca shift ascendente.
- **LCP de Inicio móvil: 2,74 → 2,64 s.** El cuadro LCP del hero (primer
  fotograma del slideshow) lo pintaba un `background-image` que inyectaba el
  script diferido `hero-carrousel.js`: no era pintable hasta ejecutar JS.
  Ahora lo pinta el CSS sobre `[data-hero-slideshow]` (`headers.css` §HERO),
  pintable en el primer render sin esperar al JS; el script construye luego su
  `slide[0]` idéntico encima y limpia ese fondo (los cross-fades posteriores
  conservan la base oscura). Sin JS, el hero ahora muestra el fotograma
  (mejora del fallback). Sigue siendo excepción (> 2,5 s, ver §4).

¹ Diferencias de ±0,06–0,11 s en celdas sub-segundo de desktop y en Gabinete
móvil: ruido de laboratorio (mediana de 2; varianza típica ±0,1–0,2 s). No
hay regresión estructural — transferencia, CSS y CLS (deterministas) se
mantienen o mejoran, y el LCP móvil de Inicio (el único objetivo en riesgo)
mejora.

CSS transferido por página: **≈ 14,6 KB** (main.bundle.css gzip; 88,7 KB
planos) + hoja de página cuando existe (≤ 4 KB gzip). Cumple < 75 KB con
amplio margen.

## 3. Cómo re-verificar el presupuesto

Requisitos: Node 18+, Chrome/Chromium instalado (o `CHROME_PATH` apuntando a
un binario de Chrome for Testing).

```bash
# 1. Regenerar artefactos y servir el sitio CON compresión (como GitHub Pages)
npm run build
npx serve -l 8081 .

# 2. Auditar las cuatro páginas de referencia (mobile = por defecto)
for p in index.html pages/gabinetes/eventos.html \
         pages/recursos/apuntes.html pages/contacto.html; do
  npx lighthouse "http://localhost:8081/$p" \
    --only-categories=performance \
    --output=json --output-path="./lh-$(basename $p .html).json" --quiet
done

# 3. Desktop: añadir --preset=desktop a los mismos comandos.

# 4. Leer las métricas presupuestadas de cada JSON
node -e "
const r = require('./lh-index.json');
const a = r.audits;
console.log('LCP', a['largest-contentful-paint'].displayValue);
console.log('CLS', a['cumulative-layout-shift'].displayValue);
console.log('TBT', a['total-blocking-time'].displayValue);
console.log('Transferencia', Math.round(a['total-byte-weight'].numericValue/1024), 'KB');
"
```

Para el peso del CSS comprimido:

```bash
curl -s -H 'Accept-Encoding: gzip' -o /dev/null \
  -w '%{size_download} bytes\n' http://localhost:8081/assets/css/main.bundle.css
```

**Atajo — matriz completa (4 páginas × mobile/desktop) en una tabla
Markdown.** `scripts/perf-matrix.mjs` envuelve los pasos 2-4 y emite la tabla
de §2 (mediana de N corridas para amortiguar el ruido de LCP/TBT):

```bash
export CHROME_PATH=/ruta/al/chromium      # o Chrome for Testing
npx serve -l 8088 . &                      # servidor con gzip
node scripts/perf-matrix.mjs http://localhost:8088 after 3
```

**Reservas de espacio (CLS) y paridad pixel.** Para re-medir las alturas que
fijan los pisos `min-height` de regiones inyectadas (regla §5.5) o comprobar
que un cambio de entrega no altera el render, `scripts/shoot.mjs` (requiere
Playwright) captura a un ancho dado e imprime la altura de los selectores
pedidos:

```bash
node scripts/shoot.mjs http://localhost:8088/pages/gabinetes/eventos.html - 767 \
  '[data-gabinete-field="proposito"],[data-gabinete-field="actividades"],[data-gabinete-field="historia"]'
```

## 4. Excepciones documentadas

**LCP de Inicio en mobile (2,64 s > 2,5 s).** El elemento LCP es la fotografía
de fondo del hero a pantalla completa (primer cuadro del slideshow). Era
3,8 s sirviendo `2014-1920.webp` (115 KB) a todos los viewports; en S7 cada
cuadro existe en 800/1280/1920 px y `hero-carrousel.js` elige la variante al
iniciar (≤768 px → 800w, ≤1280 px → 1280w, resto 1920w), con el preload de
`index.html` (`imagesrcset`/`imagesizes`) apuntando al mismo archivo para no
duplicar la descarga. El primer cuadro mobile pesa 32 KB. En P05 se aplicó la
mejora que esta sección anticipaba: **pintar el primer cuadro desde CSS**
(`headers.css` §HERO, media queries que espejan el preload), de modo que ya
no espera al script diferido para ser pintable; el LCP bajó a 2,64 s. El
excedente restante (~0,14 s) ya no es ni peso de imagen ni retraso de JS: en
4G lento simulado lo domina la ruta crítica (CSS + tipografías, FCP ~1,7 s).
Mitigaciones aplicadas: WebP responsive 800/1280/1920 px, `<link
rel="preload" fetchpriority="high">` con `imagesrcset`, primer cuadro pintado
por CSS, cuadros restantes diferidos hasta `window.load`. En desktop el LCP de
Inicio es ~0,7 s. Posible mejora futura (v3): inlinear el CSS crítico del hero
(o reducir el subset de tipografías del primer render) para recortar la FCP,
que es ahora el límite real.

**Las páginas interiores no tienen excepciones**: todo umbral aplica.

## 5. Reglas de mantenimiento

1. **CSS**: las hojas se editan en `tokens.css` / `assets/css/*.css` y se
   aplana con `npm run build` (genera `assets/css/main.bundle.css`, que se
   commitea: GitHub Pages no ejecuta builds). No editar el bundle a mano; no
   volver a introducir `@import` encadenados en producción. Hoja nueva =
   `@import` en `main.css` §1 + `npm run build`.
2. **Imágenes**: toda imagen nueva de contenido se exporta a WebP al tamaño
   máximo de render real (hero: 1920 px, más variantes 800/1280 px por cuadro
   — ver §4; un cuadro nuevo del slideshow necesita las TRES anchuras con el
   patrón `<base>-<ancho>.webp`). Los originales pueden quedar en el
   repo pero NO se referencian desde páginas. `<img>` siempre con
   `width`/`height` (o caja dimensionada por CSS), `loading="lazy"` +
   `decoding="async"` si está bajo el pliegue; `fetchpriority="high"` solo
   para el elemento LCP. **Primer cuadro del hero**: su archivo está fijado en
   TRES lugares que deben cambiarse juntos si se cambia el fotograma inicial —
   el `<link rel="preload">` de `index.html` (`imagesrcset`), el array
   `HERO_IMAGES[0]` de `hero-carrousel.js` y el `background-image` de
   `.hero__slideshow` en `headers.css` §HERO (las tres anchuras).
3. **Tipografías**: si se agrega una familia, definir su alias «… Fallback»
   con `size-adjust`/`*-override` (ver main.css §1) y sumarla a la pila del
   token correspondiente; precargar solo las fuentes del primer render.
4. **Fetch crítico**: toda página nueva precarga `partials/navbar.html` +
   `data/navbar.json` (ver plantilla `partials/_boilerplate.html`) y el JSON
   de datos que pinte sobre el primer viewport.
5. **Regiones dinámicas**: si cambia sustancialmente la altura del contenido
   de un `[data-loader]`, re-medir con `scripts/shoot.mjs` y ajustar los pisos
   `min-height` de `assets/css/loader.css` §RESERVA (siempre ≤ a la altura
   real mínima en todo viewport, para no provocar shifts ascendentes). El
   detalle de gabinete usa pisos **por campo** (`proposito`/`actividades`/
   `historia`): cada uno es el mínimo CRUZADO entre los 4 gabinetes y todos
   los viewports, porque el mismo selector aplica a las 4 páginas con copia de
   longitud distinta. Si se agrega un gabinete o se reescribe su copia,
   re-medir los 4 a 767 px (mínimo móvil) y a 1480 px (mínimo desktop) y bajar
   el piso al menor de los valores observados.
