---
target: Sobre AChETIQ
total_score: 33
p0_count: 0
p1_count: 0
timestamp: 2026-06-17T19-28-53Z
slug: pages-sobre-achetiq-html
---
# Crítica de diseño — Sobre AChETIQ (`pages/sobre-achetiq.html`)

> Re-corrida de cierre **DESPUÉS** de E01–E06 + cohesión E07. Registro: brand. Evaluación A +
> Evaluación B (`detect.mjs` sin hallazgos + navegador). Compara contra la baseline 2026-06-16
> (29/40).

## Design Health Score

| # | Heurística | Puntaje | Hallazgo clave |
|---|-----------|---------|----------------|
| 1 | Visibilidad del estado | 3 | Timeline y paneles cargan vía loader; las pestañas Asociación/Galería marcan el panel activo. |
| 2 | Correspondencia con el mundo real | 4 | Texto institucional preciso, cronología natural. |
| 3 | Control y libertad | 3 | Pestañas en página + navegación por hash; salidas claras. |
| 4 | Consistencia y estándares | 4 | Tokens/BEM consistentes; aperturas de sección unificadas (`section-ruled` + standfirst). |
| 5 | Prevención de errores | 3 | Enlaces externos con `rel` correcto; sin formularios. |
| 6 | Reconocer antes que recordar | 4 | La «Galería» ya tiene afordancia en página: `.about-tabs` (Asociación/Galería), no solo el desplegable del navbar. |
| 7 | Flexibilidad y eficiencia | 3 | Camino lineal; archivo de galería extenso sin filtro por año. |
| 8 | Estético y minimalista | 3 | Densidad editorial fuerte: timeline de trazo estructural, aperturas con filete + titular display, cero eyebrows por sección. La grilla de 6 valores conserva su forma. |
| 9 | Recuperación de errores | 3 | `<noscript>` espejo fiel de misión/visión y valores. |
| 10 | Ayuda y documentación | 3 | Las pestañas orientan sobre la existencia de la galería (deuda de la baseline saldada). |
| **Total** | | **33/40** | **Bueno** |

## Anti-Patterns Verdict

**¿Parece hecho con IA?** No. La página institucional es la más densa en oficio editorial: el
**timeline** se rediseñó con trazo estructural (E03), las secciones abren con filete hairline +
titular display + standfirst (no eyebrow mono), y el **eyebrow casi por sección** de la baseline se
redujo a un único kicker de cabecera (cadencia E01 enforced por E07). La **galería**, que estaba
oculta tras un hash del navbar, expone ahora pestañas en página.

**Detector (`detect.mjs`):** sin hallazgos. **Navegador:** a11y 100/100 (footer heading-order
corregido en E07; encabezados secuenciales).

## What's Working

- **Timeline editorial** de presencia estructural: el componente más distintivo de la página.
- **Afordancia de la galería** resuelta con pestañas accesibles (`aria` + estado activo).
- **Aperturas de sección** unificadas; la jerarquía la carga la tipografía y el aire.

## Priority Issues (remanentes)

- **[P2] Grilla de 6 valores homogénea.** Variar ritmo/composición si se busca subir el listón.
  *Sugerido:* `/impeccable layout`.
- **[P2] Archivo de galería sin filtro por año** cuando crezca. *Sugerido:* `/impeccable harden`.

## Persona Red Flags

- **Jordan (primera vez):** las pestañas dejan claro que existe una galería; ya no es contenido
  invisible.
- **Sam (teclado/SR):** orden de encabezados secuencial tras E07; pestañas con `aria`.

## Minor Observations

- Las pestañas son enlaces con `data-about-tab` y degradan a hash sin JS (camino sin JS preservado).

## Questions to Consider

- ¿La grilla de valores ganaría con una composición asimétrica que jerarquice 1–2 valores ancla?
