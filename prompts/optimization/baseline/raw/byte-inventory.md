# Byte inventory — baseline (2026-06-26T22:39:50Z)

Raw bytes via `du -b`; gzip column = `gzip -c -9` (representative of the gzip transfer encoding `serve` negotiates).

## CSS render-blocking bundle

| File | Raw (B) | Gzip (B) |
|---|---:|---:|
| assets/css/main.bundle.css | 110591 | 17805 |

### Component CSS sheets (pre-bundle `@import` sources)

| File | Raw (B) |
|---|---:|
| assets/css/cards.css | 26990 |
| assets/css/congresos.css | 11328 |
| assets/css/countdown-recursos.css | 10497 |
| assets/css/cta.css | 7897 |
| assets/css/easter-egg.css | 8218 |
| assets/css/error-404.css | 8172 |
| assets/css/figure.css | 2184 |
| assets/css/focus.css | 4802 |
| assets/css/footer.css | 12224 |
| assets/css/forms.css | 11793 |
| assets/css/gabinetes.css | 12726 |
| assets/css/headers.css | 22383 |
| assets/css/lists.css | 21775 |
| assets/css/loader.css | 15992 |
| assets/css/main.css | 23311 |
| assets/css/motion.css | 6795 |
| assets/css/nav-secondary.css | 8204 |
| assets/css/navbar.css | 21092 |
| assets/css/print.css | 8216 |
| assets/css/recursos.css | 12324 |
| assets/css/seguimiento.css | 22463 |
| assets/css/sobre-asociacion.css | 40033 |
| assets/css/states.css | 9017 |
| assets/css/text.css | 4925 |

## JS modules (no bundler — shipped as-is, ES modules)

| File | Raw (B) | Gzip (B) |
|---|---:|---:|
| assets/js/seguimiento.js | 60134 | 16055 |
| assets/js/loaders.js | 36924 | 11684 |
| assets/js/sobre-achetiq.js | 15090 | 4942 |
| assets/js/navbar.js | 13638 | 4233 |
| assets/js/easter-egg.js | 10552 | 4049 |
| assets/js/apuntes.js | 10004 | 3768 |
| assets/js/footer.js | 9817 | 3545 |
| assets/js/main.js | 7618 | 3205 |
| assets/js/scroll-reveal.js | 6346 | 2465 |
| assets/js/contacto-form.js | 6018 | 2473 |
| assets/js/countdown-recursos.js | 5907 | 2269 |
| assets/js/hero-carrousel.js | 5825 | 2566 |
| assets/js/loader.js | 4455 | 2033 |
| assets/js/gabinete-detalle.js | 3336 | 1532 |

**Total JS:** raw 195664 B · gzip 56688 B (all 14 modules concatenated; actual per-page transfer is a subset, loaded on demand).

## Fonts (self-hosted WOFF2)

| File | Bytes |
|---|---:|
| assets/fonts/fraunces-400-600-italic.woff2 | 39192 |
| assets/fonts/fraunces-400-600.woff2 | 31660 |
| assets/fonts/geist-mono-400-500.woff2 | 23128 |
| assets/fonts/hanken-grotesk-400-600.woff2 | 22428 |
