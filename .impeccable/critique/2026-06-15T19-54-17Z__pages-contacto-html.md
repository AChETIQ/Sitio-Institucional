---
target: Contacto
total_score: 34
p0_count: 0
p1_count: 2
timestamp: 2026-06-15T19-54-17Z
slug: pages-contacto-html
---
# Crítica de diseño — Contacto (`pages/contacto.html`)

> Línea base ANTES de P01–P22. Registro: brand (con formulario). Evaluación A + B. El
> detector marca `single-font` (línea 78): **falso positivo** — la página hereda Fraunces vía
> tokens globales; el `<style>` local solo nombra `--font-body`. Sin navegador: sin overlay.

## Design Health Score

| # | Heurística | Puntaje | Hallazgo clave |
|---|-----------|---------|----------------|
| 1 | Visibilidad del estado | 3 | `form__status` con `role=status`/`aria-live`; el mapa difiere bien. |
| 2 | Correspondencia con el mundo real | 4 | "Canales directos", "Escribinos": registro propio. |
| 3 | Control y libertad | 4 | Salidas claras; campos no destructivos. |
| 4 | Consistencia y estándares | 4 | Tarjetas de contacto coherentes con el sistema. |
| 5 | Prevención de errores | 4 | `novalidate` + validación accesible; tipos `email`/`inputmode`; `maxlength`. |
| 6 | Reconocer antes que recordar | 3 | Tarjeta LinkedIn "Próximamente" puede confundir (canal inexistente visible). |
| 7 | Flexibilidad y eficiencia | 3 | `autocomplete` correcto; un solo camino. |
| 8 | Estético y minimalista | 3 | Limpio; eyebrow por sección (`Comunicación`, `Canales directos`, `Mensaje directo`, `Ubicación`). |
| 9 | Recuperación de errores | 4 | Resumen `role=alert` con anclas + error por campo + señal NO cromática (borde+glifo+texto). |
| 10 | Ayuda y documentación | 2 | Hints por campo; sin ayuda más amplia. |
| **Total** | | **34/40** | **Bueno (alto)** |

## Anti-Patterns Verdict

**¿Parece IA?** No. Es la superficie **más pulida** del sitio: el manejo de errores accesible
es de referencia. Tells menores: **eyebrow por sección** y **grilla de 4 tarjetas de contacto
homogéneas**. El punto sensible no es estético sino de expectativa: el formulario **no envía**
—compone un `mailto:`—, lo que puede sorprender a quien espera un envío real.

**Detector:** un warning `single-font` = **falso positivo** (ver cabecera). **Overlay:** no
disponible.

## Overall Impression

Excelente oficio de formularios accesibles. La oportunidad no es arreglar errores sino
**alinear expectativa** (que quede claro que el botón abre el cliente de correo) y suavizar la
cadencia de eyebrow. La decisión "solo canales" + `mailto` está documentada en el markup.

## What's Working

- **Manejo de errores ejemplar:** resumen `role="alert"` con anclas por campo, `aria-invalid`
  solo en campos con error, **señal no cromática** (borde engrosado + glifo + mensaje).
- **Formulario accesible y robusto:** labels visibles, `aria-describedby`, tipos e `inputmode`
  semánticos, `autocomplete`, `maxlength`, `<noscript>` que deriva a canales directos.
- **Mapa diferido** con `aspect-ratio` fijo (sin reflow) y enlace textual alternativo a Maps.

## Priority Issues

- **[P1] El botón "Enviar mensaje" abre el cliente de correo (`mailto`), no envía.** *Por qué
  importa:* expectativa rota; un usuario sin cliente de correo configurado queda sin vía clara.
  *Fix:* dejar explícito el comportamiento (microcopy: "Se abrirá tu correo para enviar el
  mensaje") o evaluar servicio real; mantener los canales directos como respaldo. *Comando
  sugerido:* `/impeccable clarify` (microcopy) — backend fuera de alcance de diseño.
- **[P1] Eyebrow por sección.** Reducir a kickers intencionales. `/impeccable typeset`.
- **[P2] Tarjeta LinkedIn "Próximamente".** Mostrar un canal inexistente puede confundir;
  evaluar ocultar hasta tenerlo o aclarar. `/impeccable clarify`.

## Persona Red Flags

- **Jordan:** "Enviar mensaje" sugiere envío directo; al abrirse el correo puede pensar que
  algo falló. Microcopy lo resolvería.
- **Sam:** flujo de error de primer nivel: resumen anunciado, foco gestionable, señal no
  cromática. Verificar que el foco vaya al primer campo inválido tras enviar.
- **Casey (móvil):** `inputmode`/`autocomplete` ayudan; el `mailto` en móvil sí abre la app de
  correo (mejor caso); en escritorio sin cliente, fricción.

## Minor Observations

- `single-font` del detector: falso positivo documentado; no accionar.
- Eyebrows "Comunicación" (page-header) + "Canales directos" + "Mensaje directo" + "Ubicación":
  cuatro kickers en una página de contacto.

## Questions to Consider

- ¿El microcopy del botón debería anticipar la apertura del correo?
- ¿"Mensaje directo" y "Canales directos" coexistiendo no es redundante para el usuario?
