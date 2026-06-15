---
target: "Detalle gabinete: Solidario"
total_score: 33
p0_count: 0
p1_count: 1
timestamp: 2026-06-15T19-54-17Z
slug: pages-gabinetes-solidario-html
---
# Crítica de diseño — Detalle de gabinete: Solidario (`pages/gabinetes/solidario.html`)

> Línea base ANTES de P01–P22. Registro: brand. Representa la plantilla de detalle de
> gabinete. Evaluación A + B (`detect.mjs` sin hallazgos). Sin navegador: sin overlay.

## Design Health Score

| # | Heurística | Puntaje | Hallazgo clave |
|---|-----------|---------|----------------|
| 1 | Visibilidad del estado | 3 | Tres bloques `data-loader`; sin esqueleto de carga. |
| 2 | Correspondencia con el mundo real | 4 | Copia institucional aprobada, registro formal. |
| 3 | Control y libertad | 4 | Breadcrumbs Inicio › Gabinetes › Solidario; salida clara. |
| 4 | Consistencia y estándares | 4 | Misma plantilla de detalle para todos los gabinetes. |
| 5 | Prevención de errores | 3 | `mailto:` literal (funciona sin JS). |
| 6 | Reconocer antes que recordar | 4 | Breadcrumbs + `aria-current="page"`. |
| 7 | Flexibilidad y eficiencia | 3 | Lineal. |
| 8 | Estético y minimalista | 3 | Limpio pero **muy delgado**: tres prosas + CTA, sin imagen. |
| 9 | Recuperación de errores | 3 | `<noscript>` de chrome; bloques de datos sin fallback visible. |
| 10 | Ayuda y documentación | 2 | Sin material de apoyo. |
| **Total** | | **33/40** | **Bueno** |

## Anti-Patterns Verdict

**¿Parece IA?** No por estilo, sino por **vacío**: la página de detalle es texto-solo
(propósito, actividades, historia) + CTA. El registro brand para una página con historia y
actividades **pide imagen** (la arquitectura original preveía "galería del gabinete", hoy
ausente). Un bloque sólido de color donde debería haber foto es peor que una foto.

**Detector:** sin hallazgos. **Overlay:** no disponible.

## Overall Impression

La plantilla es correcta y accesible (breadcrumbs ejemplares), pero **anémica**: tres
encabezados de sección sin eyebrow, prosa, y un CTA. Es la superficie con mayor brecha de
imaginería del sitio. Oportunidad mayor: incorporar la galería/imagen prevista y dar respiro
a la prosa.

## What's Working

- **Breadcrumbs** con `aria-current` y salida clara: lo mejor de la página.
- **`mailto:` literal** por gabinete: canal directo sin dependencia de JS.
- Plantilla reutilizable y consistente entre gabinetes.

## Priority Issues

- **[P1] Página de detalle sin imagen / galería (texto-solo).** *Por qué importa:* registro
  brand image-led; una historia institucional sin imagen lee como incompleta. *Fix:*
  incorporar la galería del gabinete prevista y/o una imagen representativa con `alt` con voz.
  *Comando sugerido:* `/impeccable bolder` (+ imagen).
- **[P2] Prosa sin jerarquía interna** (tres bloques equivalentes). *Fix:* ritmo tipográfico,
  posible destacado/figura. `/impeccable layout`.
- **[P2] Sin esqueleto de carga** en los `data-loader`. `/impeccable harden`.

## Persona Red Flags

- **Jordan:** entiende qué es el gabinete, pero la página se siente "vacía"; sin imagen, poca
  conexión emocional con "Solidario".
- **Casey (móvil):** tres bloques de prosa larga seguidos; sin imagen ni respiro, scroll
  monótono.
- **Sam:** estructura de encabezados correcta y breadcrumbs accesibles; verificar fallback de
  los bloques `data-loader` sin JS.

## Minor Observations

- Los `<h2>` de detalle no llevan eyebrow (bien: aquí el eyebrow sí sobraría). Coherente con
  la recomendación de cadencia.

## Questions to Consider

- ¿La "galería del gabinete" prevista vuelve como sección, enriqueciendo todas las plantillas
  de detalle a la vez?
- ¿Qué imagen cuenta "Solidario" sin caer en stock genérico?
