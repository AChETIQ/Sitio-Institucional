---
target: Gabinetes
total_score: 33
p0_count: 0
p1_count: 0
timestamp: 2026-06-17T19-28-53Z
slug: pages-gabinetes-html
---
# Crítica de diseño — Gabinetes (`pages/gabinetes.html`)

> Re-corrida de cierre **DESPUÉS** de E01–E06 + cohesión E07. Registro: brand. Evaluación A
> (revisión sobre código) + Evaluación B (`detect.mjs` sin hallazgos + inspección en navegador).
> Compara contra la baseline 2026-06-16 (30/40).

## Design Health Score

| # | Heurística | Puntaje | Hallazgo clave |
|---|-----------|---------|----------------|
| 1 | Visibilidad del estado | 3 | Directiva y gabinetes vía loader con reservas de espacio (CLS controlado); sin esqueleto explícito. |
| 2 | Correspondencia con el mundo real | 4 | "Comisión directiva", "gabinetes": lenguaje de la asociación. |
| 3 | Control y libertad | 3 | Página corta y lineal; navegación clara. |
| 4 | Consistencia y estándares | 4 | `page-header` + `gabinetes-hub` + `cta-final` reutilizados; E07 alineó la cadencia (se añadió el eyebrow de `page-header` que faltaba y se retiró el del cierre). |
| 5 | Prevención de errores | 3 | CTA con asunto canónico; placeholder de foto con iniciales. |
| 6 | Reconocer antes que recordar | 4 | Estructura clara: índice de gabinetes → directiva → CTA. |
| 7 | Flexibilidad y eficiencia | 3 | Camino único. |
| 8 | Estético y minimalista | 4 | La doble grilla homogénea es ahora un **índice editorial** de los cuatro frentes con filetes hairline y jerarquía; cero eyebrows bajo el pliegue. |
| 9 | Recuperación de errores | 3 | `<noscript>` de chrome; bloques de datos sin fallback visible. |
| 10 | Ayuda y documentación | 2 | Sin orientación adicional. |
| **Total** | | **33/40** | **Bueno** |

## Anti-Patterns Verdict

**¿Parece hecho con IA?** No. La «doble grilla de tarjetas homogéneas» que la baseline señalaba
como el tell más fuerte de la página fue reemplazada por el índice editorial de gabinetes (E04).
El eyebrow por sección se resolvió: E07 dejó **exactamente un kicker** —el eyebrow del
`page-header` («Equipos de trabajo»), que antes faltaba en este hub mientras su hermano `recursos`
sí lo tenía— y retiró el eyebrow residual del cierre. Cohesión restaurada entre los dos hubs.

**Detector (`detect.mjs`):** sin hallazgos. **Navegador:** a11y 100/100 esperado (footer
heading-order corregido site-wide en E07).

## What's Working

- **Índice editorial** que se gana la retícula en lugar de la grilla perezosa.
- **Consistencia entre hubs** (gabinetes ↔ recursos) tras la reconciliación E07.
- Reservas de espacio para datos inyectados (CLS bajo).

## Priority Issues (remanentes)

- **[P2] Sin esqueleto de carga** en los bloques `data-loader`. *Sugerido:* `/impeccable harden`.
- **[P3] Foto de directiva** con placeholder de iniciales hasta tener retratos aprobados (no se
  inventan activos — principio #4).

## Persona Red Flags

- **Jordan (primera vez):** el índice jerarquiza "por dónde empiezo" mejor que cuatro tarjetas
  iguales.
- **Casey (móvil):** filas-enlace de ancho completo, buen objetivo táctil.

## Minor Observations

- El kicker «Equipos de trabajo» se eligió para igualar la cadencia de `recursos` («Material de
  estudio»); ambos hubs abren ahora con el mismo patrón.

## Questions to Consider

- ¿La sección de directiva ganaría con un tratamiento de superficie (plancha tonal) que la separe
  del índice sin volver a la caja?
