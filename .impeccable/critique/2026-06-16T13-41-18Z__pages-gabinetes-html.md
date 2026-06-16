---
target: Gabinetes
total_score: 30
p0_count: 0
p1_count: 2
timestamp: 2026-06-16T13-41-18Z
slug: pages-gabinetes-html
---
# Crítica de diseño — Gabinetes (`pages/gabinetes.html`)

> Línea base **fresca** ANTES de E01–E07 (ambición editorial ALTA). Registro: brand.
> Evaluación A + B (`detect.mjs` sin hallazgos). Sin navegador: sin overlay. Baseline oficial
> que E07 re-mide.

## Design Health Score

| # | Heurística | Puntaje | Hallazgo clave |
|---|-----------|---------|----------------|
| 1 | Visibilidad del estado | 3 | Directiva y gabinetes vía loader; sin esqueleto explícito mientras cargan. |
| 2 | Correspondencia con el mundo real | 4 | "Comisión directiva", "gabinetes": lenguaje propio de la asociación. |
| 3 | Control y libertad | 3 | Página corta y lineal. |
| 4 | Consistencia y estándares | 4 | `page-header` + `section-title` + `cta-final` reutilizados. |
| 5 | Prevención de errores | 3 | CTA con `?asunto=gabinete`; placeholder de foto con iniciales. |
| 6 | Reconocer antes que recordar | 4 | Estructura clara: intro → directiva → gabinetes → CTA. |
| 7 | Flexibilidad y eficiencia | 3 | Camino único. |
| 8 | Estético y minimalista | 2 | La página más "plantilla-neutra": doble grilla de tarjetas homogéneas (directiva + gabinetes) sin jerarquía ni imagen. |
| 9 | Recuperación de errores | 3 | `<noscript>` de chrome; bloques de datos sin fallback visible. |
| 10 | Ayuda y documentación | 2 | Sin orientación adicional. |
| **Total** | | **30/40** | **Bueno** |

## Anti-Patterns Verdict

**¿Parece IA?** Neutral en estilo, pero **poca personalidad**: casi todo el peso visual lo
cargan tarjetas de directiva y de gabinetes renderizadas, homogéneas. Un eyebrow por sección
(`Organización`, `Gestión 2026`, `Cuatro frentes de trabajo`, `Participación`). Al nuevo listón
editorial, "índice neutro de tres bloques de datos + CTA" es justamente lo que E04 debe elevar a
una familia editorial con jerarquía y reglas hairline.

**Detector:** sin hallazgos. **Overlay:** no disponible.

## Overall Impression

Funciona y es coherente, pero es la página más "plantilla-neutra": tres bloques de datos y un
CTA. Oportunidad para E04: dar jerarquía e identidad a la directiva y a los gabinetes (hoy ambos
son grillas de tarjetas), componer una retícula que se la gane, y resolver el pendiente de fondo
`--color-surface-raised` anotado en el markup — como hub de una familia que comparte plantilla
de detalle.

## What's Working

- **Orden editorial cerrado** y documentado en el propio markup (decisión 2026-05-27).
- **Placeholder con iniciales** cuando falta la foto de un miembro: estado vacío resuelto.
- Reutilización limpia de componentes del catálogo.

## Priority Issues

- **[P1] Doble grilla de tarjetas homogéneas (directiva + gabinetes) sin jerarquía ni
  imagen.** *Por qué importa:* registro brand; la página lee como índice neutro. *Fix:*
  jerarquizar (destacar gabinetes, variar densidad) e incorporar imagen/identidad por gabinete;
  reglas hairline sobre cajas. *Resuelve:* **E04** → `/impeccable layout` + `craft` + `distill`.
- **[P1] Eyebrow por sección.** *Fix:* cadencia del sistema. *Resuelve:* **E04** (heredando E01)
  → `/impeccable typeset`.
- **[P2] Pendiente visual anotado:** fondo `--color-surface-raised` full-bleed para la
  sección directiva. *Resuelve:* **E04** → `/impeccable layout`.
- **[P2] Sin esqueleto de carga** en los bloques `data-loader`. *Resuelve:* **E04/E05** →
  `/impeccable harden`.

## Persona Red Flags

- **Jordan:** entiende la estructura; las tarjetas de gabinete compiten en igualdad y no
  guían cuál mirar primero.
- **Casey (móvil):** si el JSON tarda, no hay esqueleto: posible salto de contenido (verificar
  reserva de espacio / CLS).
- **Sam:** verificar que las tarjetas de directiva renderizadas expongan nombre/rol como texto
  accesible y no solo visual.

## Minor Observations

- `data-scroll-reveal` en el bloque de gabinetes: cuidar que el contenido sea visible por
  defecto (no depender de la clase para mostrarlo en renders sin JS/headless).

## Questions to Consider

- ¿La directiva necesita el mismo tratamiento de tarjeta que los gabinetes, o una jerarquía
  distinta (lista densa vs. destacados)?
- ¿Qué composición "se gana" la grilla en lugar de repetirla por reflejo?
