# Pendientes de Contenido — Sitio Web AChETIQ

> Registro vivo de los contenidos que faltan para que las páginas
> ya construidas pasen de estado «esqueleto válido» a estado
> «publicable». Este archivo es la **única fuente de verdad** sobre
> contenido faltante: cualquier nuevo bloque construido debe
> sumar sus pendientes aquí y, al cerrarse, removerse de la tabla.
>
> Para el inventario más amplio de contenido institucional (logo,
> misión, redes, estatuto, etc.), seguir consultando
> [`INVENTARIO_Solicitud_de_Contenido.md`](./INVENTARIO_Solicitud_de_Contenido.md).
> Este archivo se concentra en lo derivado del trabajo de
> construcción de páginas en curso.
>
> **Convención de prioridad**
> - ⭐ Bloqueante para publicar la página correspondiente.
> - 🔲 Necesario, no bloqueante (la página se puede publicar con
>   placeholder o empty-state hasta que se cargue).
>
> Última revisión: 2026-05-27.

---

## 1. Subárbol Gabinetes

### 1.1 Por gabinete — campos en `data/gabinetes.json`

| Gabinete | `proyectos_activos[]` | `historia` (borrador a validar) | Imagen OG / Twitter | Foto institucional |
|---|---|---|---|---|
| Cursos y Conferencias | 🔲 Pendiente — lista de cursos y conferencias regulares con título y descripción breve. | ⭐ Borrador cargado el 2026-05-27 a partir de `descripcion_completa`. La comisión directiva debe **validarlo o sustituirlo** antes de publicar. | 🔲 Pendiente — URL absoluta + archivo en `assets/img/gabinetes/`. Hoy `<meta property="og:image">` queda como placeholder de Fase 6. | 🔲 Pendiente — opcional, foto representativa para encabezado/galería del gabinete. |
| Eventos | 🔲 Pendiente — calendario tipo de eventos del año. | ⭐ Borrador cargado el 2026-05-27. Validar o sustituir. | 🔲 Pendiente. | 🔲 Pendiente. |
| Prensa y Difusión | 🔲 Pendiente — rutinas de cobertura, periodicidad de publicaciones, cobertura fotográfica. | ⭐ Borrador cargado el 2026-05-27. Validar o sustituir. | 🔲 Pendiente. | 🔲 Pendiente. |
| Solidario | 🔲 Parcial — está cargado «Apadrinamiento EEP N° 1026»; falta descripción, frecuencia y modalidad del proyecto, y eventuales nuevos proyectos. | ⭐ Borrador cargado el 2026-05-27. Validar o sustituir. | 🔲 Pendiente. | 🔲 Pendiente. |

**Decisión cerrada (2026-05-27).** No se publica el listado de
integrantes por gabinete en la web. El campo `integrantes` se
removió de `data/gabinetes.json` y la sección correspondiente de
cada página hija fue eliminada.

### 1.2 Hub `pages/gabinetes.html`

| Pendiente | Tipo | Prioridad | Notas |
|---|---|---|---|
| Fondo `--color-bg-panel` para la sección «Comisión directiva» (wireframe §3 bloque [4]). | Refinamiento visual | 🔲 No bloqueante | Requiere wrapper full-bleed que rompa el `padding` de `.page`. Diferido a iteración de refinamiento. |
| Fotos de la comisión directiva. | Asset | 🔲 No bloqueante | Mientras tanto, el renderer dibuja un placeholder con las iniciales del nombre sobre `--color-rule-soft` (ver `card-integrante__placeholder` en `assets/css/cards.css`). Pendiente compartido con `INVENTARIO_Solicitud_de_Contenido.md` §2.2. |

---

## 2. Convención para nuevos pendientes

Cuando una página o componente se cierra estructuralmente, los
pendientes derivados se agregan a este documento bajo una nueva
sección numerada (ej. «3. Subárbol Recursos», «4. Página
Contacto»), siguiendo el mismo formato tabular.

Reglas de mantenimiento:

1. **No duplicar** entradas que ya viven en
   `INVENTARIO_Solicitud_de_Contenido.md`. Si hay solapamiento,
   referenciar el item del inventario en lugar de copiarlo.
2. **Cerrar entradas, no editarlas en silencio.** Cuando un
   pendiente se resuelve, removerlo de la tabla en el mismo
   commit que carga el contenido. Así el diff documenta el cierre.
3. **Diferenciar prioridad.** Usar ⭐ solamente cuando la falta
   de contenido impide publicar la página o degrada la experiencia
   por debajo de un mínimo razonable.

---

*AChETIQ — Proyecto Web 2026 · Documento de trabajo interno.*
