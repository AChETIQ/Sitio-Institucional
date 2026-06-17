---
target: Contacto
total_score: 36
p0_count: 0
p1_count: 0
timestamp: 2026-06-17T19-28-53Z
slug: pages-contacto-html
---
# Crítica de diseño — Contacto (`pages/contacto.html`)

> Re-corrida de cierre **DESPUÉS** de E01–E06 + cohesión E07. Registro: brand (con formulario).
> Evaluación A + Evaluación B (`detect.mjs` + navegador). Compara contra la baseline 2026-06-16
> (33/40). El detector marca `single-font` (línea 78): **falso positivo** — la regla está en un
> `<style>` inline del *caption* del mapa que sólo nombra `--font-body`; la página hereda Fraunces
> vía la cabecera compartida.

## Design Health Score

| # | Heurística | Puntaje | Hallazgo clave |
|---|-----------|---------|----------------|
| 1 | Visibilidad del estado | 3 | `form__status` con `role=status`/`aria-live`; el mapa difiere bien. |
| 2 | Correspondencia con el mundo real | 4 | "Canales directos", "Escribinos": registro propio. |
| 3 | Control y libertad | 4 | Salidas claras; campos no destructivos. |
| 4 | Consistencia y estándares | 4 | Tarjetas de contacto y cierre coherentes con el sistema; cadencia E07. |
| 5 | Prevención de errores | 4 | `novalidate` + validación accesible; `email`/`inputmode`; `maxlength`. |
| 6 | Reconocer antes que recordar | 3 | La tarjeta LinkedIn "Próximamente" sigue visible (canal inexistente). |
| 7 | Flexibilidad y eficiencia | 3 | `autocomplete` correcto; un solo camino. |
| 8 | Estético y minimalista | 4 | Formulario elevado a layout editorial; microcopy explícito sobre el `mailto`; cero eyebrows bajo el pliegue. |
| 9 | Recuperación de errores | 4 | Resumen `role=alert` con anclas + error por campo + señal NO cromática (borde+glifo+texto). |
| 10 | Ayuda y documentación | 3 | Microcopy que explica que el mensaje se prepara en la app de correo (deuda de expectativa saldada). |
| **Total** | | **36/40** | **Bueno (muy alto)** |

## Anti-Patterns Verdict

**¿Parece hecho con IA?** No. La baseline marcaba el formulario como "no crafted" y la expectativa
rota del botón `mailto`. E06 elevó el formulario a layout editorial y añadió **microcopy explícito**
(«Preparamos el mensaje en tu aplicación de correo: lo revisás, lo enviás vos»), de modo que el
`mailto:` deja de sorprender. El eyebrow por sección desapareció (cadencia E07).

**Detector (`detect.mjs`):** `single-font` en línea 78 = **falso positivo** (style inline del
caption). **Navegador:** a11y 97/100 — el único flag (`color-contrast` en las contact-cards) es un
**falso positivo de axe**: convierte mal `oklch(0.486 0.017 265)` a #adb1b7 (1,95:1); la conversión
correcta es **#5b5f69 = 5,80:1 (AA)**, verificada a mano y coincidente con el ratio documentado en
`tokens.css`. El mismo token no se marca en las otras tres páginas de referencia. **Cero hallazgos
de contraste reales.**

## What's Working

- **Recuperación de errores ejemplar:** resumen `role=alert` con anclas + señal no cromática.
- **Microcopy honesto** sobre el comportamiento `mailto` (sin backend).
- **Formulario editorial** que ya se siente diseñado, no un bloque utilitario.

## Priority Issues (remanentes)

- **[P2] Tarjeta LinkedIn "Próximamente".** Mostrar un canal inexistente puede confundir; evaluar
  ocultar hasta tenerlo. *Sugerido:* `/impeccable clarify`.

## Persona Red Flags

- **Sam (teclado/SR):** validación accesible con resumen anclado; contraste real AA verificado
  (el flag de axe es artefacto de su parser oklch).
- **Casey (móvil):** `inputmode`/`autocomplete` correctos; menos tecleo.

## Minor Observations

- El falso positivo de `color-contrast` queda documentado en `RENDIMIENTO_Presupuesto.md §2` para
  que futuras auditorías no lo persigan.

## Questions to Consider

- ¿Conviene ocultar la tarjeta "Próximamente" o convertirla en una invitación ("avisanos si
  querés que sumemos LinkedIn")?
