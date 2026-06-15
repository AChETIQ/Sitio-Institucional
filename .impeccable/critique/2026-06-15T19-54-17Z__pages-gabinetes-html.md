---
target: Gabinetes
total_score: 32
p0_count: 0
p1_count: 2
timestamp: 2026-06-15T19-54-17Z
slug: pages-gabinetes-html
---
# Crítica de diseño — Gabinetes (`pages/gabinetes.html`)

> Línea base ANTES de P01–P22. Registro: brand. Evaluación A + B (`detect.mjs` sin
> hallazgos). Sin navegador: sin overlay.

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
| 8 | Estético y minimalista | 3 | Limpio; depende mucho del render JSON; tarjetas de gabinete homogéneas. |
| 9 | Recuperación de errores | 3 | `<noscript>` de chrome; bloques de datos sin fallback visible. |
| 10 | Ayuda y documentación | 2 | Sin orientación adicional. |
| **Total** | | **32/40** | **Bueno** |

## Anti-Patterns Verdict

**¿Parece IA?** Neutral. La página es esqueleto + datos: poco riesgo de tell propio, pero
también **poca personalidad** (casi todo el peso visual lo cargan tarjetas de directiva y de
gabinetes renderizadas, homogéneas). Un eyebrow por sección (`Organización`, `Gestión 2026`,
`Cuatro frentes de trabajo`, `Participación`).

**Detector:** sin hallazgos. **Overlay:** no disponible.

## Overall Impression

Funciona y es coherente, pero es la página más "plantilla-neutra": tres bloques de datos y un
CTA. Oportunidad: dar jerarquía/imagen a la directiva y a los gabinetes (hoy ambos son grillas
de tarjetas) y resolver el pendiente de fondo `--color-surface-raised` anotado en el markup.

## What's Working

- **Orden editorial cerrado** y documentado en el propio markup (decisión 2026-05-27).
- **Placeholder con iniciales** cuando falta la foto de un miembro: estado vacío resuelto.
- Reutilización limpia de componentes del catálogo.

## Priority Issues

- **[P1] Doble grilla de tarjetas homogéneas (directiva + gabinetes) sin jerarquía ni
  imagen.** *Por qué importa:* registro brand; la página lee como índice neutro. *Fix:*
  jerarquizar (destacar gabinetes, variar densidad) e incorporar imagen/identidad por
  gabinete. *Comando sugerido:* `/impeccable layout` (+ `bolder`).
- **[P1] Eyebrow por sección.** `/impeccable typeset`.
- **[P2] Pendiente visual anotado:** fondo `--color-surface-raised` full-bleed para la
  sección directiva. *Comando:* `/impeccable layout`.
- **[P2] Sin esqueleto de carga** en los bloques `data-loader`. `/impeccable harden`.

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
