---
target: Apuntes por materia
total_score: 34
p0_count: 0
p1_count: 1
timestamp: 2026-06-17T19-28-53Z
slug: pages-recursos-apuntes-html
---
# Crítica de diseño — Apuntes por materia (`pages/recursos/apuntes.html`)

> Re-corrida de cierre **DESPUÉS** de E01–E06 + cohesión E07. Registro: brand (con superficie
> utilitaria: índice de 41 materias filtrable). Evaluación A + Evaluación B (`detect.mjs` sin
> hallazgos + navegador). Compara contra la baseline 2026-06-16 (29/40).

## Design Health Score

| # | Heurística | Puntaje | Hallazgo clave |
|---|-----------|---------|----------------|
| 1 | Visibilidad del estado | 4 | El filtro por año ahora **anuncia** el resultado: región `role=status`/`aria-live` inyectada por `apuntes.js` ("Mostrando N materias de X año"). |
| 2 | Correspondencia con el mundo real | 4 | "1.º año … 5.º año", Plan 2023: lenguaje del estudiante. |
| 3 | Control y libertad | 3 | "Todos" reinicia el filtro; sin estado en URL para compartir un año. |
| 4 | Consistencia y estándares | 4 | `pill-nav` con `aria-pressed`; tarjetas de materia coherentes; cierre sin eyebrow (E07). |
| 5 | Prevención de errores | 3 | Materias sin carpeta → tarjeta placeholder "no disponible". |
| 6 | Reconocer antes que recordar | 3 | 41 materias con filtro por año; **aún sin búsqueda textual** por nombre. |
| 7 | Flexibilidad y eficiencia | 3 | Filtro por año rápido; sin búsqueda ni salto directo a una materia. |
| 8 | Estético y minimalista | 4 | Cubiertas coloreadas por año (rampa arena→cobalto) dan identidad; ritmo editorial del índice; cero eyebrows bajo el pliegue. |
| 9 | Recuperación de errores | 3 | Placeholder por materia; sin estado vacío global. |
| 10 | Ayuda y documentación | 3 | Instrucción de aporte clara (correo + asunto canónico). |
| **Total** | | **34/40** | **Bueno** |

## Anti-Patterns Verdict

**¿Parece hecho con IA?** No. La identidad del componente —tarjeta de materia con cubierta por año—
es distintiva del registro utilitario. La baseline marcaba dos P1: (1) **filtro sin feedback** —
resuelto en E05 con la región viva que verbaliza el conteo— y (2) **41 materias sin búsqueda
textual**, que **sigue abierto** (solo hay filtro por año). El eyebrow residual del cierre se retiró
en E07.

**Detector (`detect.mjs`):** sin hallazgos. **Navegador:** a11y 100/100; CLS 0,000; LCP 2,27 s.

## What's Working

- **Feedback de filtro accesible:** la región `aria-live` comunica el EFECTO (conteo), no solo el
  estado del control.
- **Identidad por año:** las cubiertas convierten un índice de 41 materias en una grilla legible.
- **Camino sin JS** y placeholders honestos para materias sin carpeta.

## Priority Issues (remanentes)

- **[P1] 41 materias sin búsqueda textual** (reconocer vs recordar / eficiencia). *Fix:* campo de
  búsqueda por nombre además del filtro por año. *Sugerido:* `/impeccable harden` (+ `clarify`).
- **[P2] Estado del filtro no reflejado en URL.** Impide compartir "apuntes de 3.º". *Sugerido:*
  `/impeccable harden`.

## Persona Red Flags

- **Alex (power user):** sin búsqueda ni atajo, encontrar una materia concreta entre 41 obliga a
  escanear el año — fricción real para el usuario recurrente.
- **Sam (SR):** el filtro ahora se verbaliza; el cambio dejó de ser silencioso.

## Minor Observations

- La búsqueda textual es la única deuda P1 que el ciclo E01–E07 no cerró; queda como follow-up
  prioritario.

## Questions to Consider

- ¿Un campo de búsqueda por nombre (con `aria-live` de resultados) cerraría a la vez las heurísticas
  6 y 7?
