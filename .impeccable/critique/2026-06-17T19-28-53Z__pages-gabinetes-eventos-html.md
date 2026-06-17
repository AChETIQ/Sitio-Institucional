---
target: "Detalle gabinete: Eventos"
total_score: 33
p0_count: 0
p1_count: 0
timestamp: 2026-06-17T19-28-53Z
slug: pages-gabinetes-eventos-html
---
# Crítica de diseño — Detalle de gabinete: Eventos (`pages/gabinetes/eventos.html`)

> Re-corrida de cierre **DESPUÉS** de E01–E06 + cohesión E07. Registro: brand. Representa la
> **plantilla de detalle de gabinete** (los cuatro detalles la comparten). Evaluación A +
> Evaluación B (`detect.mjs` sin hallazgos + navegador). Compara contra la baseline 2026-06-16
> (30/40).

## Design Health Score

| # | Heurística | Puntaje | Hallazgo clave |
|---|-----------|---------|----------------|
| 1 | Visibilidad del estado | 3 | Tres bloques `data-loader` con reservas de altura **por campo** (CLS 0,015 móvil, el mejor del rediseño P05); sin esqueleto explícito. |
| 2 | Correspondencia con el mundo real | 4 | Copia institucional aprobada, registro formal. |
| 3 | Control y libertad | 4 | Breadcrumbs Inicio › Gabinetes › Eventos; `aria-current="page"`. |
| 4 | Consistencia y estándares | 4 | Plantilla única para los 4 detalles; cadencia E07 (un kicker de cabecera, cierre sin eyebrow). |
| 5 | Prevención de errores | 3 | `mailto:` literal (funciona sin JS). |
| 6 | Reconocer antes que recordar | 4 | Breadcrumbs + estructura temática clara. |
| 7 | Flexibilidad y eficiencia | 3 | Lineal. |
| 8 | Estético y minimalista | 3 | De "tres prosas equivalentes + CTA" a **monografía editorial**: cada bloque temático es una fila con título de imprenta a un lado y prosa de lectura al otro, separadas por filetes hairline. Falta imagen representativa (registro image-led; pendiente de activo aprobado). |
| 9 | Recuperación de errores | 3 | `<noscript>` de chrome; bloques de datos sin fallback visible. |
| 10 | Ayuda y documentación | 2 | Sin material de apoyo. |
| **Total** | | **33/40** | **Bueno** |

## Anti-Patterns Verdict

**¿Parece hecho con IA?** No. La baseline marcaba la página como "muy delgada" (texto-solo, sin
jerarquía). E04 la reescribió como **monografía** de filetes hairline y blanco estructural: jerarquía
interna real (título de imprenta ↔ prosa), sin cajas ni eyebrow por sección. La cadencia E07 dejó un
único kicker de cabecera y un cierre sin eyebrow. La mitad pendiente —**imagen representativa**— no
se fuerza: no hay activo institucional aprobado y el principio #4 prohíbe inventarlo; la elevación
eligió composición type-led, válida para el sistema.

**Detector (`detect.mjs`):** sin hallazgos. **Navegador:** a11y 100/100; CLS 0,015 móvil; LCP
2,42 s; TBT 0.

## What's Working

- **Monografía type-led** con jerarquía interna: ya no lee como ficha incompleta.
- **CLS líder del sitio** gracias a las reservas por campo (P05) — preservadas en E07.
- **Breadcrumbs + plantilla compartida**: orientación y consistencia entre los 4 gabinetes.

## Priority Issues (remanentes)

- **[P2] Sin imagen representativa** (registro brand image-led). Pendiente de activo aprobado;
  cuando exista, sumar figura con `alt` con voz. *Sugerido:* `/impeccable craft` (+ imagen).
- **[P2] Sin esqueleto de carga** en los `data-loader`. *Sugerido:* `/impeccable harden`.

## Persona Red Flags

- **Jordan (primera vez):** la jerarquía título↔prosa guía la lectura; ya no es un muro plano.
- **Casey (móvil):** sin saltos de layout (CLS 0,015); breadcrumbs alcanzables.

## Minor Observations

- La plantilla aplica a los 4 detalles: cualquier mejora (imagen, esqueleto) se hereda de una vez.

## Questions to Consider

- ¿Una sola imagen ancla por gabinete bastaría para cerrar la brecha image-led sin sobrecargar?
