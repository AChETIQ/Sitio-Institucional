# PROMPT DE CONTINUACIÓN — Nuevo chat AChETIQ Web

> Generado: 2026-05-14 · Estado: Inicio ✅ · Sobre AChETIQ ✅ · Gabinetes ✅ · Recursos Académicos ✅ · Contacto ✅. Revisión de wireframes de páginas prioritarias completada. Próximos: plantillas `pages/gabinete.html` y `pages/recurso.html` (sesión separada) → luego Fase 2.

---

# CONTEXTO DEL PROYECTO — Sitio Web AChETIQ

Soy Lautaro R. Zalazar, estudiante de Ingeniería Química en UTN FRRe y Protesorero de AChETIQ. Estamos desarrollando el sitio web oficial de la asociación migrándolo desde Wix a GitHub Pages.

## INSTRUCCIÓN MAESTRA — Lectura obligatoria antes de responder

1. `INSTRUCCION_PROYECTO.md` — contexto, stack, identidad visual, convenciones y metodología (Secciones 5 y 10 vinculantes).
2. Memoria del proyecto (referenciada en `MEMORY.md` del espacio de trabajo).
3. `FASE_1_Wireframes.md` — estado actualizado (Secciones 2–5 reescritas y cerradas).
4. `FASE_1_Catalogo_Componentes.md` — catálogo de componentes UI.

## ESTADO EXACTO DEL TRABAJO (al cierre de sesión 2026-05-14)

- **Fase 2 (desarrollo front-end):** aún no iniciada.
- **Páginas cerradas:** Inicio ✅ · Sobre AChETIQ ✅ · Gabinetes ✅ · Recursos Académicos ✅ · Contacto ✅
- **Revisión de wireframes de v1.0: COMPLETA.** Las 5 páginas prioritarias tienen wireframe cerrado en `FASE_1_Wireframes.md`.
- **Pendientes separados:** plantillas `pages/gabinete.html` y `pages/recurso.html` (sesión separada)
- **Siguiente etapa:** Fase 2 — desarrollo front-end (o cierre de plantillas de detalle, si se priorizan)

## COMPOSICIÓN FINAL DE CONTACTO (referencia rápida)

| # | Bloque | Estado |
|---|---|---|
| 1 | page-header | 🔲 ATB — skeleton válido para Fase 2 |
| 2 | Información de contacto directa (.contact-grid, 4 tarjetas) | ✅ email + instagram + LinkedIn (próx) + dirección |
| 3 | Mapa (iframe Google Maps, lazy-load) | ✅ incluido |

**Decisiones clave de Contacto:**
- Sin formulario de envío. Solo canales directos.
- Solo se renderizan tarjetas con valor no-null en `data/redes.json`. En v1.0: email e Instagram.
- LinkedIn: `null` en JSON → tarjeta visible, atenuada, badge "Próximamente", sin link activo.
- `direccion_facultad` se toma del campo ya existente en `data/redes.json`.
- Todos los links externos: `target="_blank" rel="noopener noreferrer"`.
- Referencia eliminada: `contacto.html?asunto=...` (no aplica sin formulario).

## COMPOSICIÓN FINAL DE RECURSOS ACADÉMICOS (referencia rápida)

| # | Bloque | Estado |
|---|---|---|
| 1 | page-header | 🔲 ATB — skeleton válido para Fase 2 |
| 2 | Recursos de referencia (2 col) | ✅ Diseño Curricular + Planilla de Seguimiento |
| 3 | Filtros por año | ✅ .pill-nav, Todos + 1°–5° año, oculta/muestra por año |
| 4 | Grid de materias | ✅ 41 materias Plan 2023, imagen + nombre, card clickeable |
| 5 | CTA aportar material | ✅ fondo --color-primary, mailto: con asunto prefijado |

## ARCHIVOS ACTUALIZADOS EN ESTA SESIÓN (2026-05-14)

- `FASE_1_Wireframes.md` — Sección 1 (Inicio) reescrita. Sección 5 (Contacto) reescrita. Referencias a formulario y D7 eliminadas.

## ARCHIVOS ACTUALIZADOS EN SESIÓN ANTERIOR (2026-05-13)

- `FASE_1_Wireframes.md` — Secciones 2, 3 y 4 reescritas.
- `data/documentos.json` — creado.
- `data/directiva.json` — campo subgrupo y orden actualizados.
- `data/gabinetes.json` — orden editorial actualizado.
- `data/recursos.json` — creado con 41 materias del Plan 2023 (campos: id, nombre, anio).

## DATOS CLAVE DE RECURSOS ACADÉMICOS

- Diseño Curricular: `docs/Disenio_Curricular_IQ.pdf` · 2.1 MB · Plan 2023 ✓
- Planilla de Seguimiento: https://drive.google.com/drive/folders/1p5m6S9I8v44XcMj8MtCTO8DoxY3ezz_J · nueva pestaña
- Email aporte material: achetiq.resistencia+apuntes@aneiqa.org · asunto: "Envío de material académico"
- Colores placeholder por año para `.card-materia`: pendiente de definir en Fase 2

## PENDIENTES DE CATÁLOGO (Fase 1 menor)

- `.card--valor`, `.card-documento`, `.card-integrante`, `.card-materia` — variantes de `.card-base`.
- `.contact-card` — tarjeta de canal de contacto con ícono Lucide, eyebrow, valor y estado "Próximamente".
- `.kpi-strip` — strip de 4 indicadores institucionales estáticos.
- `.gallery-events` — sección de galería por evento (título + descripción + grid de fotos).
- `.timeline` — componente de línea de tiempo con entrada ghost.
- `data/site_copy.json` — alta de claves `mision_vision`, `valores` y `hero_lead`.
- `data/galeria.json` — a crear cuando estén disponibles fotos y descripciones de los 4 eventos.

## PENDIENTES RECURRENTES DEL SITIO

- ~~Comprimir `docs/Estatuto.pdf` (6.7 MB)~~ — **RESUELTO 2026-05-20** (nuevo peso 3.12 MB; reducción del 55.1%; 19 páginas conservadas; `data/documentos.json` actualizado con `tamano_kb: 3045`).
- ~~Logos UTN FRRe y ANEIQA con fondo transparente~~ — **RESUELTO 2026-05-20** (`assets/img/institucional/utn-frre-logo.svg` y `assets/img/institucional/aneiqa-logo.svg`). Bloqueo del Bloque 5 de Sobre AChETIQ levantado. Pendiente menor (no bloqueante): optimización post-despliegue de los SVG vectorizados.
- ⚠ Valores institucionales pendientes de aprobación por comisión directiva.
- ⚠ Selección de íconos Lucide para cada hito de la timeline (data ya completa 2003–2026 en `data/historia.json`) y verificar disponibilidad de `telescope` / `heart-handshake`.
- ⚠ Fotos y descripciones de los 4 eventos de la galería (2 congresos IQ 2024/2025 + 2 actividades a definir).
- ⚠ Texto `hero_lead` y prose de Misión institucional — pendientes de redacción por directiva.
- Fotos de integrantes de la comisión directiva.
- Imágenes representativas por materia (directiva); placeholder por color de año en v1.0.
- ~~Favicon~~ — **RESUELTO 2026-05-20** (`favicon.svg`, `favicon.ico`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png` en raíz). Pendientes: dominio, usuario GitHub de organización.
- LinkedIn de AChETIQ (pendiente — tarjeta "Próximamente" en Contacto hasta que esté disponible).
- ~~Extender timeline histórica 2003–2013 hasta 2026~~ — **RESUELTO 2026-05-19** (`data/historia.json` con 14 hitos 2003–2026).

## METODOLOGÍA (10 reglas — resumen)

1. Preguntar antes de decidir — opciones etiquetadas con implicancias y recomendación.
2. Estructura antes que contenido — Ronda 1 luego Ronda 2; nunca mezclar.
3. Sección por sección — prohibido producir documentos extensos unilateralmente.
4. Verificar el repositorio antes de proponer.
5. Marcar incertidumbres — nunca inventar datos institucionales.
6. Consolidar decisiones en tablas.
7. Acumular cambios y aplicar al cierre de cada página.
8. Mantener la memoria del proyecto actualizada.
9. Reconocer errores de forma directa con remediaciones concretas.
10. Tono formal académico. Voseo en CTAs. Sin exclamaciones ni emojis.

---

## SESIÓN 2026-05-20 — Componentes front-end anticipados (integraciones externas)

> Se integraron tres componentes provistos por el usuario (originalmente en React/shadcn/TS). Por coherencia de stack se reescribieron a **HTML/CSS/JS vanilla con `tokens.css`** (ver memoria `feedback_stack_vanilla.md`). Son adelantos de Fase 2; el resto de Fase 2 sigue sin iniciarse formalmente.

**Importante:** los archivos están guardados en la carpeta local del proyecto, pero **no fueron commiteados ni publicados en GitHub**. La publicación queda a cargo del usuario.

### 1. Cuenta regresiva — Recursos Académicos
- **Propósito:** habilitar la sección de Recursos 20 días después del lanzamiento; hasta entonces muestra un contador.
- **Archivos:** `partials/countdown-recursos.html`, `assets/css/countdown-recursos.css`, `assets/js/countdown-recursos.js`.
- **Decisiones:** fecha objetivo por atributo `data-target-date` (ISO 8601, se fija el día del lanzamiento); al expirar oculta el contador y **revela automáticamente** el contenido de `[data-countdown-revealed]` (evento `countdown:revealed`); **sin botones**; unidades Días/Horas/Minutos/Segundos; dígitos en `--color-primary`.
- **Pendiente:** fijar fecha real de apertura (placeholder `2026-06-09`) y nombre del include de contenido a revelar (placeholder `recursos-grid.html`).

### 2. Spinner loader global — "Bouncing Dots"
- **Estado:** especificación canónica guardada en memoria (`achetiq_spinner_loader.md`); **no implementada en código** aún (a ejecutar en Fase 2).
- **Decisiones:** puntos en `--color-primary`; documentadas **ambas variantes** (inline reutilizable + overlay de pantalla completa); 3 puntos por defecto, rebote 0.6 s, desfase 0.2 s; animación 100% CSS, sin dependencias.

### 3. Página de error 404
- **Archivos:** `404.html` (raíz, `permalink: /404.html`; GitHub Pages la sirve automáticamente) y `assets/css/error-404.css`.
- **Decisiones:** **un solo botón** primario "Volver al inicio" (`/`); ilustración de fantasma con imagen externa original + **fallback** automático a SVG Lucide en `--color-primary` si el host de terceros no responde; copy amistoso sin exclamaciones; dígitos en Instrument Serif sobre `--color-primary`; rutas con filtro `relative_url`.
- **Encabezado/pie:** se decidió (2026-05-20) **mantener el 404 como pantalla limpia por ahora**; navbar y footer se agregarán en Fase 2, una vez construidos esos `_includes`.

### Pendientes abiertos de la sesión
- 404 con navbar + footer: pospuesto a Fase 2 (cuando existan esos includes).
- Definir fecha de apertura de Recursos y el include de contenido a revelar.
- Implementar el spinner en código cuando arranque Fase 2.

---

## SESIÓN 2026-05-27 — Implementación de `pages/contacto.html`

> Construcción front-end de la página de Contacto siguiendo el wireframe §5 y el componente `.contact-card` (§4.10).

### Decisión sobre el formulario de envío

Antes de implementar se reabrió la discusión, dado que GitHub Pages no procesa envíos del lado del servidor. Se evaluaron tres caminos:

| Opción | Experiencia del visitante | Costos / dependencias |
|---|---|---|
| (a) Servicio externo (Formspree, FormSubmit, Web3Forms y similares) | Formulario embebido; envía y recibe confirmación sin abandonar la página; funciona aunque no haya cliente de correo configurado. | Crear cuenta y verificar dominio; dependencia operativa de un tercero; cuotas y branding en planes gratuitos; el sitio deja de ser 100 % independiente. |
| (b) `mailto:` con asunto prefijado | Bot­ón que abre el cliente de correo del visitante con `Para`/`Asunto` ya cargados. | Cero dependencias. Riesgo: en mobile y entornos sin cliente de correo configurado el clic puede no hacer nada visible. |
| (c) Solo canales de contacto (sin formulario) | Tarjetas de Email, Instagram, LinkedIn (Próximamente) y Dirección; el visitante elige el canal preferido. | Cero. Coincide con la decisión ya cerrada en wireframe §5 y catálogo §6.1 ("form diferido a v1.1+"). |

**Decisión ratificada (2026-05-27): opción (c) — solo canales, sin formulario.**

- Mantiene la coherencia con la decisión del 2026-05-14 registrada en `FASE_1_Wireframes.md §5` y `FASE_1_Catalogo_Componentes.md §6.1`.
- Cero dependencias de terceros y cero cuentas que mantener; consistente con el resto del stack vanilla.
- El componente `.form` queda diferido a v1.1+; se reactivará el día que se decida sumar captura, evaluando nuevamente las opciones (a)/(b) con datos de uso reales.

### Bloques implementados

| # | Bloque | Estado |
|---|---|---|
| 3 | `page-header` (eyebrow "Comunicación", h1 "Escribinos a *AChETIQ*", lead) | ✅ |
| 4 | Canales directos: grid `.grid-cards--4` + `.contact-grid` con `.contact-card` renderizadas desde `data/redes.json` vía `data-loader="redes"` (renderer local registrado en la página) | ✅ |
| 5 | Mapa: `<figure>` con iframe liviano de Google Maps (`?q=…&output=embed`, `loading="lazy"`, sin API key) + figcaption con dirección textual y link "Abrir en Google Maps" en nueva pestaña | ✅ |

### Reglas de renderizado de `data-loader="redes"`

- `email`, `instagram`, `facebook`, `whatsapp`, `youtube`, `twitter`: tarjeta activa solo si el valor en `data/redes.json` es no nulo (en v1.0 se renderizan email e Instagram).
- `linkedin`: caso especial — tarjeta "Próximamente" mientras sea `null`; pasa automáticamente a activa cuando deje de serlo.
- Dirección: tarjeta estática alimentada por `direccion_facultad` y `web_facultad` (link a la web de la FRRe en nueva pestaña). Si `web_facultad` faltara, la tarjeta degrada a placeholder no interactivo en lugar de romper la grilla.
- Todos los enlaces externos llevan `target="_blank" rel="noopener noreferrer"`. Los `href` pasan por `safeHref()` (rechaza `javascript:`, `data:`, etc.).

### Nota técnica

`loaders.js` no registra renderer por defecto para `redes` (lo usa `footer.js` internamente). La página define el renderer en un módulo inline propio, importando `registerLoader`, `createElement` y `safeHref` desde `assets/js/loaders.js` y registrándolo antes de la carga de `main.js`, según el patrón documentado en el encabezado de `loaders.js`. Los íconos (Lucide `mail`, `instagram`, `linkedin`, `map-pin`) se construyen como SVG inline con `aria-hidden="true"`.

### Archivo actualizado

- `pages/contacto.html` — creado.

---

## SESIÓN 2026-05-22 — Reconciliación de la estructura de directorios

> El repositorio conservaba andamiaje residual de tipo Jekyll que contradecía el
> stack vanilla definitivo (`INSTRUCCION_PROYECTO.md §2`). Se reconcilió la
> estructura a un árbol vanilla puro, preservando los componentes de Fase 2 ya
> anticipados.

### Inventario de carpetas Jekyll
- De las cinco carpetas Jekyll posibles (`_includes/`, `_layouts/`, `_collections/`, `_data/`, `_posts/`), **solo existía `_includes/`**; las otras cuatro nunca se crearon.
- `_includes/` contenía un único archivo útil: `countdown-recursos.html` (cuenta regresiva de Recursos), escrito con sintaxis Liquid.

### Cambios aplicados
- **Migración del countdown:** `_includes/countdown-recursos.html` → `partials/countdown-recursos.html`. Se convirtió la sintaxis Liquid a HTML vanilla: `{%- comment -%}` → comentarios HTML; `data-target-date` fijado al placeholder `2026-06-09T00:00:00-03:00`; se eliminó el bloque `{% include %}` (el slot `[data-countdown-revealed]` queda vacío, a poblar en Fase 2); encabezado de uso reescrito para inyección vía `fetch()`. El CSS y el JS ya eran vanilla y no se movieron.
- **Consolidación de imágenes:** `img/logo/` e `img/institucional/` → `assets/img/`. La carpeta `img/` de la raíz se eliminó. Se actualizó la ruta funcional en `data/instituciones.json` y se barrieron las referencias `img/` en la documentación (FASE_0, FASE_1_Wireframes, FASE_1_Catalogo_Componentes, README, INVENTARIO, INSTRUCCION_PROYECTO, `content/analisis_logo.md`, PROMPT_CONTINUACION, PLAN_MAESTRO L192/L308). No se tocó el prompt citado en PLAN_MAESTRO L105 (registro literal de esta consigna).
- **Carpetas de detalle:** se crearon `pages/gabinetes/` y `pages/recursos/` (con `.gitkeep`); las plantillas se desarrollarán en sesión separada.
- **Eliminación de Jekyll:** se borró `_includes/` (vacío tras la migración).
- **Documentación:** `FASE_0_Arquitectura.md §5` reescrito con el árbol vanilla reconciliado, con nota de reconciliación fechada.

### Pendiente abierto / a confirmar por la directiva
- ⚠ Contradicción a resolver: `INSTRUCCION_PROYECTO.md §4.2` define las plantillas de detalle como archivos únicos con query param (`pages/gabinete.html?id=<slug>`), mientras que la estructura adoptada usa carpetas `pages/gabinetes/` y `pages/recursos/`. Conviene alinear ambos documentos al cerrar las plantillas de detalle.
