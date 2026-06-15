---
target: Apuntes por materia
total_score: 30
p0_count: 0
p1_count: 2
timestamp: 2026-06-15T19-54-17Z
slug: pages-recursos-apuntes-html
---
# Crítica de diseño — Apuntes por materia (`pages/recursos/apuntes.html`)

> Línea base ANTES de P01–P22. Registro: brand (con superficie utilitaria: índice de 41
> materias filtrable). Evaluación A + B (`detect.mjs` sin hallazgos). Sin navegador: sin overlay.

## Design Health Score

| # | Heurística | Puntaje | Hallazgo clave |
|---|-----------|---------|----------------|
| 1 | Visibilidad del estado | 2 | El filtro por año oculta/muestra tarjetas **sin** anunciar resultados ni región live. |
| 2 | Correspondencia con el mundo real | 4 | "1.º año … 5.º año", Plan 2023: lenguaje del estudiante. |
| 3 | Control y libertad | 3 | "Todos" reinicia el filtro; sin estado en URL para compartir un año. |
| 4 | Consistencia y estándares | 4 | `pill-nav` con `aria-pressed`; tarjetas de materia coherentes. |
| 5 | Prevención de errores | 3 | Materias sin carpeta → tarjeta placeholder "no disponible". |
| 6 | Reconocer antes que recordar | 3 | 41 materias con **solo** filtro por año, **sin búsqueda textual**. |
| 7 | Flexibilidad y eficiencia | 2 | Sin búsqueda ni atajo para saltar a una materia entre 41. |
| 8 | Estético y minimalista | 3 | Cubiertas coloreadas por año dan identidad; grilla larga homogénea. |
| 9 | Recuperación de errores | 3 | Placeholder por materia; sin estado vacío global por si un año queda sin nada. |
| 10 | Ayuda y documentación | 3 | Instrucción de aporte clara (correo + asunto canónico). |
| **Total** | | **30/40** | **Bueno (límite inferior)** |

## Anti-Patterns Verdict

**¿Parece IA?** No: la cubierta coloreada por año (`--color-materia-anio-1..5`, arena →
cobalto profundo) es un recurso con voz. El riesgo es **usabilidad de índice largo**: filtrar
41 ítems solo por año, sin búsqueda ni feedback de estado, no escala bien.

**Detector:** sin hallazgos. **Overlay:** no disponible.

## Overall Impression

La página utilitaria más lograda en identidad (color por año), pero la **interacción de
filtrado** está a medio resolver: sin región live ni conteo de resultados, y sin búsqueda
para 41 materias. Oportunidad mayor: cerrar el bucle de feedback del filtro y sumar búsqueda.

## What's Working

- **Color por año** como sistema de reconocimiento visual.
- **Tarjeta placeholder** "Carpeta no disponible" para materias sin `drive_url`: estado vacío
  por ítem resuelto.
- **Enlaces externos** con `aria-label` de enlace externo y `rel` correcto; aporte por correo
  con asunto canónico, funcional sin JS.

## Priority Issues

- **[P1] Filtro por año sin feedback de estado (visibilidad).** *Por qué importa:* al ocultar
  tarjetas de otros años no se anuncia "mostrando N materias de 1.º"; para lector de pantalla
  el cambio es silencioso. *Fix:* región `aria-live` con conteo de resultados y, si un año
  queda vacío, estado vacío explícito. *Comando sugerido:* `/impeccable harden`.
- **[P1] 41 materias sin búsqueda textual (reconocer vs recordar / eficiencia).** *Fix:*
  campo de búsqueda/filtro por nombre además del año. *Comando sugerido:* `/impeccable harden`
  (+ `clarify` para el copy del campo).
- **[P2] Estado del filtro no reflejado en URL.** Impide compartir "apuntes de 3.º".
  `/impeccable harden`.

## Persona Red Flags

- **Alex (experto):** quiere teclear el nombre de la materia; en cambio debe escanear 41
  tarjetas o filtrar por año. Fricción.
- **Sam (lector de pantalla):** activa "3.º año" y no recibe confirmación de cuántas materias
  quedan visibles; el `aria-pressed` ayuda pero falta el resultado.
- **Casey (móvil):** la grilla larga en una sola columna exige mucho scroll sin búsqueda.

## Minor Observations

- `pill-nav` usa botones con `aria-pressed` (patrón válido); evaluar si un `tablist`/conteo
  comunicaría mejor el filtro.
- El `<h2>` "Materias del Plan 2023" es `sr-only`: bien para lectores, pero verificar que la
  jerarquía visual no quede huérfana.

## Questions to Consider

- ¿Una búsqueda por nombre + conteo de resultados convertiría el índice en algo realmente
  rápido para el estudiante apurado?
- ¿El filtro debería reflejarse en la URL para compartir un año concreto?
