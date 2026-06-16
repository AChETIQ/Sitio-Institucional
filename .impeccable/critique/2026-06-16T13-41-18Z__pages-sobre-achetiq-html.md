---
target: Sobre AChETIQ
total_score: 29
p0_count: 0
p1_count: 2
timestamp: 2026-06-16T13-41-18Z
slug: pages-sobre-achetiq-html
---
# Crítica de diseño — Sobre AChETIQ (`pages/sobre-achetiq.html`)

> Línea base **fresca** ANTES de E01–E07 (ambición editorial ALTA). Registro: brand.
> Evaluación A (revisión sobre código) + Evaluación B (`detect.mjs`, sin hallazgos en esta
> página). Sin navegador: sin overlay visual. Baseline oficial que E07 re-mide.

## Design Health Score

| # | Heurística | Puntaje | Hallazgo clave |
|---|-----------|---------|----------------|
| 1 | Visibilidad del estado | 3 | Timeline y paneles cargan vía loader; el cambio asociación↔galería no señaliza dónde estoy. |
| 2 | Correspondencia con el mundo real | 4 | Texto institucional preciso, cronología natural. |
| 3 | Control y libertad | 3 | Navegación por hash; sin control en página para volver entre paneles. |
| 4 | Consistencia y estándares | 4 | Tokens/BEM consistentes; misión/visión y valores bien sistematizados. |
| 5 | Prevención de errores | 3 | Enlaces externos con `rel` correcto; sin formularios. |
| 6 | Reconocer antes que recordar | 2 | El panel "Galería" solo se alcanza por el desplegable del navbar (`#galeria`): invisible en página. |
| 7 | Flexibilidad y eficiencia | 3 | Camino lineal; archivo de galería extenso sin filtro. |
| 8 | Estético y minimalista | 2 | Buena densidad editorial, pero eyebrow en casi cada sección y grilla de 6 valores idéntica: al nuevo listón, falta jerarquía tipográfica protagonista. |
| 9 | Recuperación de errores | 3 | `<noscript>` espejo fiel de misión/visión y valores. |
| 10 | Ayuda y documentación | 2 | Sin orientación sobre la existencia de la galería. |
| **Total** | | **29/40** | **Bueno (límite inferior)** |

## Anti-Patterns Verdict

**¿Parece IA?** No en lo cromático/tipográfico. Tells presentes que el listón editorial agrava:
**eyebrow en casi cada sección** (`Trayectoria`, `Marco de pertenencia`, `Marco normativo`,
`Formá parte`, `Archivo histórico`) y **grilla de 6 tarjetas de valores idénticas** (ícono +
título + texto). El timeline ramificado y la galería por años aportan personalidad y compensan;
son la base que E03 debe llevar a componente insignia.

**Detector:** sin hallazgos. **Overlay:** no disponible (sin navegador).

## Overall Impression

La página más rica del sitio en contenido y estructura, pero arrastra dos deudas: la
**descubribilidad del panel Galería** (existe, pero nada en la página lo anuncia) y la
**cadencia de eyebrow**. La oportunidad mayor para E03: convertir la trayectoria en un timeline
editorial protagonista (tipografía que carga jerarquía antes que color, reglas hairline) y
hacer visible la galería en la propia página, respetando la medida de lectura de 65ch.

## What's Working

- **Timeline ramificado** con entrada *ghost* "Próximamente": componente con voz propia — el
  candidato natural a componente insignia de E03.
- **Fuente única de verdad:** misión/visión y valores se sirven de `site_copy.json` con
  `<noscript>` espejo; sin duplicar texto.
- **Archivo de galería** por años con enlaces externos correctamente atribuidos
  (`target=_blank` + `rel=noopener`), `sr-only` "(abre en pestaña nueva)".

## Priority Issues

- **[P1] Panel "Galería" sin afordancia en página.** *Por qué importa:* un contenido entero
  queda oculto tras un hash del navbar; el usuario no sabe que existe (reconocer vs recordar).
  *Fix:* exponer un control en página (tabs Asociación/Galería) con estado activo visible.
  *Resuelve:* **E03** → `/impeccable clarify` (+ refinar tabs en `layout`).
- **[P1] Eyebrow en casi todas las secciones.** *Fix:* reducir a kickers intencionales según
  la cadencia del sistema. *Resuelve:* **E03** (aplicando la cadencia nacida en E01) →
  `/impeccable typeset`.
- **[P2] Grilla de 6 valores idéntica.** Variar ritmo/composición. **E03** → `/impeccable layout`.
- **[P2] Archivo de galería sin filtro por año** cuando crezca. **E03** → `/impeccable harden`.

## Persona Red Flags

- **Jordan:** no descubre la galería; cree que la página termina en el CTA.
- **Sam:** el ruteo por hash con `[hidden]` es correcto, pero sin control en página el cambio
  de panel no se anuncia; conviene `aria-live` o foco gestionado al cambiar de panel.
- **Riley (estrés):** al entrar con `#galeria` directo, ¿hay foco/scroll al panel correcto?
  Verificar que `hashchange` mueva el foco al encabezado del panel.

## Minor Observations

- Sprite SVG local (`<use>`) para íconos de carpeta/flecha: buena economía de markup.
- Comentario obsoleto en `mission-vision` mencionaba "borde lateral --color-accent"; el CSS
  real usa icon-box (no hay franja lateral). Limpiar el comentario en E03.

## Questions to Consider

- ¿La galería merece ser una pestaña en página, o incluso su propia ruta?
- ¿El eyebrow "Marco de pertenencia" agrega significado o solo repite la gramática?
- ¿El timeline puede llevar el peso visual de la página sin una sola tarjeta?
