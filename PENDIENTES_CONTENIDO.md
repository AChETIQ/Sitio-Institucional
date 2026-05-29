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
> Última revisión: 2026-05-29.

---

## 1. Subárbol Gabinetes

### 1.1 Por gabinete — campos en `data/gabinetes.json`

**Cerrado (2026-05-29).** El contenido editorial de los cuatro
gabinetes —`proposito`, `actividades` e `historia`— se cargó desde
la copia institucional aprobada en
[`content/gabinetes_copy.md`](./content/gabinetes_copy.md). El campo
`descripcion_corta` se deriva de la primera oración del `proposito`.
Se eliminaron el borrador de `historia` y el array
`proyectos_activos` (reemplazado por el campo de prosa `actividades`).
Las cuatro páginas de detalle renderizan `proposito`, `actividades` e
`historia` desde el JSON vía el `data-loader` `gabinetes`. Quedan
cerrados, por tanto, los pendientes de borrador de historia y de
listado de actividades.

**Pendiente — imágenes ⭐ (bloqueante para publicar con identidad
visual completa).** Cada gabinete tiene en `data/gabinetes.json` las
claves `imagen`, `imagen_alt` e `imagen_og` cargadas con placeholder
vacío (`""`). Faltan los archivos y sus URLs:

| Gabinete | Foto representativa (`imagen` + `imagen_alt`) | Imagen OG / Twitter (`imagen_og`) |
|---|---|---|
| Cursos y Conferencias | 🔲 Pendiente — archivo en `assets/img/gabinetes/` + texto alternativo para encabezado/galería del gabinete. | 🔲 Pendiente — imagen social 1200×630 + URL absoluta para `og:image`/`twitter:image`. Hoy ambos `<meta>` apuntan al placeholder `icon-512.png`. |
| Eventos | 🔲 Pendiente. | 🔲 Pendiente. |
| Prensa y Difusión | 🔲 Pendiente. | 🔲 Pendiente. |
| Solidario | 🔲 Pendiente. | 🔲 Pendiente. |

> Al cargar cada imagen: subir el archivo a `assets/img/gabinetes/`,
> completar las claves `imagen`/`imagen_alt`/`imagen_og` del gabinete
> en `data/gabinetes.json`, actualizar los `<meta property="og:image">`
> y `<meta name="twitter:image">` de la página de detalle, y cerrar la
> fila correspondiente de esta tabla en el mismo commit.

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
