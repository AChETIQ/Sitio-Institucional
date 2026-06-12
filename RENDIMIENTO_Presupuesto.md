# AChETIQ — Presupuesto de rendimiento (S6)

Versión: 1.1 · Sesión 6 — Rendimiento y entrega de activos · Revisión S7 (hero responsive)
Fundamento: auditoría Lighthouse 13.4 (Chrome 138) del 2026-06-11; re-medición 2026-06-12 tras servir variantes responsive del slideshow del hero.

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

## 2. Estado actual (2026-06-12, después de S7 — hero responsive)

| Página (mobile, gzip) | LCP | CLS | TBT | Transferencia |
|---|---|---|---|---|
| Inicio | 2,8 s ⚠ (excepción §4) | 0,000 | 0 ms | 296 KB |
| Gabinete (eventos) | 2,4 s | 0,037 | 0 ms | 172 KB |
| Apuntes | 2,1 s | 0,008 | 0 ms | 173 KB |
| Contacto | 2,3 s | 0,001 | 0 ms | 176 KB |

LCP de Inicio: mediana de 3 corridas (2,9 / 2,8 / 2,7 s). Era 3,8 s antes de
S7: servir el primer cuadro del hero en 800 px (32 KB) en vez de 1920 px
(115 KB) a viewports mobile recortó ~1 s de LCP y 145 KB de transferencia.

CSS transferido por página: **≈ 14 KB** (main.bundle.css gzip) + hoja de
página cuando existe (≤ 4 KB gzip). Cumple < 75 KB con amplio margen.

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

## 4. Excepciones documentadas

**LCP de Inicio en mobile (2,8 s > 2,5 s).** El elemento LCP es la fotografía
de fondo del hero a pantalla completa (primer cuadro del slideshow). Era
3,8 s sirviendo `2014-1920.webp` (115 KB) a todos los viewports; en S7 cada
cuadro existe en 800/1280/1920 px y `hero-carrousel.js` elige la variante al
iniciar (≤768 px → 800w, ≤1280 px → 1280w, resto 1920w), con el preload de
`index.html` (`imagesrcset`/`imagesizes`) apuntando al mismo archivo para no
duplicar la descarga. El primer cuadro mobile pesa ahora 32 KB y el LCP bajó
a 2,8 s. El excedente restante (~0,3 s) ya no es peso de imagen: en 4G lento
simulado lo dominan la ruta crítica (CSS + tipografías, FCP 1,5 s) y el
retraso de render del cuadro, cuyo `background-image` recién se inyecta al
ejecutarse el script diferido. Mitigaciones aplicadas: WebP responsive
800/1280/1920 px, `<link rel="preload" fetchpriority="high">` con
`imagesrcset`, cuadros restantes diferidos hasta `window.load`. En desktop el
LCP de Inicio es 0,8 s (camino 1920w sin cambios). Posible mejora futura
(v2): pintar el primer cuadro desde CSS (media queries) en vez de JS para
eliminar el retraso de render del script diferido.

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
   para el elemento LCP.
3. **Tipografías**: si se agrega una familia, definir su alias «… Fallback»
   con `size-adjust`/`*-override` (ver main.css §1) y sumarla a la pila del
   token correspondiente; precargar solo las fuentes del primer render.
4. **Fetch crítico**: toda página nueva precarga `partials/navbar.html` +
   `data/navbar.json` (ver plantilla `partials/_boilerplate.html`) y el JSON
   de datos que pinte sobre el primer viewport.
5. **Regiones dinámicas**: si cambia sustancialmente la altura del contenido
   de un `[data-loader]`, re-medir y ajustar los pisos `min-height` de
   `assets/css/loader.css` §RESERVA (siempre ≤ a la altura real mínima en
   todo viewport, para no provocar shifts ascendentes).
