# AChETIQ — Presupuesto de rendimiento (S6)

Versión: 1.0 · Sesión 6 — Rendimiento y entrega de activos
Fundamento: auditoría Lighthouse 13.4 (Chrome 138) del 2026-06-11.

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

## 2. Estado actual (2026-06-11, después de S6)

| Página (mobile, gzip) | LCP | CLS | TBT | Transferencia |
|---|---|---|---|---|
| Inicio | 3,8 s ⚠ (excepción §4) | 0,000 | 0 ms | 441 KB |
| Gabinete (eventos) | 2,3 s | 0,037 | 0 ms | 169 KB |
| Apuntes | 2,1 s | 0,010 | 0 ms | 171 KB |
| Contacto | 2,3 s | 0,000 | 0 ms | 172 KB |

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

**LCP de Inicio en mobile (3,8 s > 2,5 s).** El elemento LCP es la fotografía
de fondo del hero a pantalla completa (primer cuadro del slideshow,
`2014-1920.webp`, 115 KB). En 4G lento simulado, la foto compite con CSS y
tipografías por 1,6 Mbit/s de ancho de banda; ninguna compresión razonable de
una fotografía full-viewport la baja de ~2,5 s en esas condiciones sin
degradar la calidad visual del hero (decisión de diseño de S1–S5 que esta
sesión no modifica). Mitigaciones ya aplicadas: WebP 1920 px (de 947 KB JPG a
115 KB), `<link rel="preload" fetchpriority="high">`, cuadros restantes
diferidos. En desktop el LCP de Inicio es 0,8 s. Posible mejora futura (v2):
variante responsive del primer cuadro (~1280 px) servida por media query.

**Las páginas interiores no tienen excepciones**: todo umbral aplica.

## 5. Reglas de mantenimiento

1. **CSS**: las hojas se editan en `tokens.css` / `assets/css/*.css` y se
   aplana con `npm run build` (genera `assets/css/main.bundle.css`, que se
   commitea: GitHub Pages no ejecuta builds). No editar el bundle a mano; no
   volver a introducir `@import` encadenados en producción. Hoja nueva =
   `@import` en `main.css` §1 + `npm run build`.
2. **Imágenes**: toda imagen nueva de contenido se exporta a WebP al tamaño
   máximo de render real (hero: 1920 px). Los originales pueden quedar en el
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
