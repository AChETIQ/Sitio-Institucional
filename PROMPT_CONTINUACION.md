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
- ~~Logos UTN FRRe y ANEIQA con fondo transparente~~ — **RESUELTO 2026-05-20** (`img/institucional/utn-frre-logo.svg` y `img/institucional/aneiqa-logo.svg`). Bloqueo del Bloque 5 de Sobre AChETIQ levantado. Pendiente menor (no bloqueante): optimización post-despliegue de los SVG vectorizados.
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
- **Archivos:** `_includes/countdown-recursos.html`, `assets/css/countdown-recursos.css`, `assets/js/countdown-recursos.js`.
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
