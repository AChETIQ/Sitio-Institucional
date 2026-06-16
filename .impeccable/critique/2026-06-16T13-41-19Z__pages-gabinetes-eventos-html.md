---
target: "Detalle gabinete: Eventos"
total_score: 30
p0_count: 0
p1_count: 1
timestamp: 2026-06-16T13-41-19Z
slug: pages-gabinetes-eventos-html
---
# Crítica de diseño — Detalle de gabinete: Eventos (`pages/gabinetes/eventos.html`)

> Línea base **fresca** ANTES de E01–E07 (ambición editorial ALTA). Registro: brand.
> Representa la **plantilla de detalle de gabinete** (los cuatro detalles la comparten). En la
> baseline anterior (2026-06-15) el detalle muestreado fue `solidario.html`; esta corrida usa
> `eventos.html` por indicación de E00, pero el veredicto es de plantilla y aplica a los cuatro.
> Evaluación A + B (`detect.mjs` sin hallazgos). Sin navegador: sin overlay.

## Design Health Score

| # | Heurística | Puntaje | Hallazgo clave |
|---|-----------|---------|----------------|
| 1 | Visibilidad del estado | 3 | Tres bloques `data-loader` (propósito, actividades, historia); sin esqueleto de carga. |
| 2 | Correspondencia con el mundo real | 4 | Copia institucional aprobada, registro formal. |
| 3 | Control y libertad | 4 | Breadcrumbs Inicio › Gabinetes › Eventos; salida clara. |
| 4 | Consistencia y estándares | 4 | Misma plantilla de detalle para todos los gabinetes. |
| 5 | Prevención de errores | 3 | `mailto:` literal (funciona sin JS). |
| 6 | Reconocer antes que recordar | 4 | Breadcrumbs + `aria-current="page"`. |
| 7 | Flexibilidad y eficiencia | 3 | Lineal. |
| 8 | Estético y minimalista | 2 | **Muy delgada**: tres prosas equivalentes + CTA, sin imagen ni jerarquía interna; al listón editorial, lee incompleta. |
| 9 | Recuperación de errores | 3 | `<noscript>` de chrome; bloques de datos sin fallback visible. |
| 10 | Ayuda y documentación | 2 | Sin material de apoyo. |
| **Total** | | **30/40** | **Bueno** |

## Anti-Patterns Verdict

**¿Parece IA?** No por estilo, sino por **vacío**: la página de detalle es texto-solo
(propósito, actividades, historia) + CTA, con eyebrow en el `page-header` (`Gabinete`) y en el
CTA (`Participación`). El registro brand para una página con historia y actividades **pide
imagen** (la arquitectura original preveía "galería del gabinete", hoy ausente). Un bloque
sólido de color donde debería haber foto es peor que una foto. E04 debe derivar una plantilla de
detalle única, type-led, con jerarquía interna y reglas hairline, y aplicarla a los cuatro.

**Detector:** sin hallazgos. **Overlay:** no disponible.

## Overall Impression

La plantilla es correcta y accesible (breadcrumbs ejemplares), pero **anémica**: tres
encabezados de sección, prosa pareja y un CTA. Es la superficie con mayor brecha de imaginería
del sitio. Oportunidad mayor para E04: jerarquizar la prosa (la historia no pesa igual que el
propósito), dar respiro con reglas y blanco estructural, e incorporar la imagen/galería prevista.

## What's Working

- **Breadcrumbs** con `aria-current` y salida clara: lo mejor de la página (tratamiento que
  E02 eleva y E04 hereda).
- **`mailto:` literal** por gabinete: canal directo sin dependencia de JS.
- Plantilla reutilizable y consistente entre los cuatro gabinetes: una sola intervención en E04
  eleva a la familia entera.

## Priority Issues

- **[P1] Página de detalle sin imagen / galería (texto-solo) y sin jerarquía interna de
  prosa.** *Por qué importa:* registro brand image-led; una historia institucional sin imagen
  ni ritmo lee como incompleta. *Fix:* plantilla de detalle type-led con jerarquía (destacado /
  figura), reglas hairline y blanco estructural; incorporar imagen representativa con `alt` con
  voz. *Resuelve:* **E04** → `/impeccable craft` + `layout` (+ imagen).
- **[P2] Sin esqueleto de carga** en los `data-loader`. *Resuelve:* **E04** → `/impeccable harden`.
- **[P2] Eyebrow en `page-header` + CTA.** Revisar contra la cadencia del sistema (en detalle,
  el eyebrow de categoría "Gabinete" puede justificarse; el del CTA, evaluar). *Resuelve:* **E04**.

## Persona Red Flags

- **Jordan:** entiende qué es el gabinete, pero la página se siente "vacía"; sin imagen, poca
  conexión emocional con "Eventos".
- **Casey (móvil):** tres bloques de prosa larga seguidos; sin imagen ni respiro, scroll
  monótono.
- **Sam:** estructura de encabezados correcta y breadcrumbs accesibles; verificar fallback de
  los bloques `data-loader` sin JS.

## Minor Observations

- Coherencia con la plantilla `solidario.html`: lo que resuelva E04 aquí debe replicarse en los
  cuatro detalles (`cursos-y-conferencias`, `eventos`, `prensa-y-difusion`, `solidario`).

## Questions to Consider

- ¿La "galería del gabinete" prevista vuelve como sección, enriqueciendo las cuatro plantillas
  de detalle a la vez?
- ¿Qué imagen cuenta "Eventos" sin caer en stock genérico?
- ¿La historia y el propósito deben pesar lo mismo, o la jerarquía cuenta la trayectoria?
