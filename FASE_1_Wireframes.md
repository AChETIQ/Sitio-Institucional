# Fase 1 — Wireframes de Páginas Prioritarias
## Sitio Web Oficial de AChETIQ

*Documento elaborado: 2026-05-08*
*Estado: Referencia técnica para desarrollo front-end (Fase 2)*

---

## Propósito y convenciones

Este documento especifica la **composición vertical** de las cinco páginas prioritarias del sitio (Inicio, Sobre AChETIQ, Gabinetes, Recursos Académicos, Contacto) más sus dos plantillas de detalle (gabinete individual, materia individual). Cada wireframe define qué secciones aparecen, en qué orden, con qué componente del catálogo se construye cada bloque, qué fuente de datos lo alimenta, y cómo se comporta en estados vacíos.

**Convenciones del documento.**

- Los componentes citados (`navbar`, `hero`, `card-gabinete`, etc.) están especificados en `FASE_1_Catalogo_Componentes.md`. Este wireframe no introduce componentes nuevos: solo composición.
- Los archivos JSON citados (`data/directiva.json`, `data/gabinetes.json`, etc.) ya existen en el repositorio o están programados por el patrón `data-loader`.
- Los wireframes son textuales y estructurales, no visuales. Las cajas ASCII representan jerarquía y orden, no proporciones exactas.
- "ATB" significa "above the fold" — visible sin scroll en desktop estándar (1366×768).
- Las decisiones de copy son provisorias y editables por la comisión directiva.

**Lectura del esquema ASCII.**

```
┌─────────────────────────────────────┐
│ NOMBRE_DE_SECCIÓN                   │
│ componente: clase-bem               │
│ datos: archivo o estático           │
│ contenido: descripción              │
└─────────────────────────────────────┘
```

---

## 1. Página: Inicio (`index.html`)

**Propósito.** Página de entrada al sitio. Establece la identidad de AChETIQ, presenta sus pilares (asociación, gabinetes, actividad académica) y conduce a las secciones de mayor valor para el usuario.

**Audiencia primaria del flujo.** Estudiante que llega por primera vez (búsqueda, link de redes) o estudiante recurrente que busca novedades.

**Metadatos.**

- `<title>`: "AChETIQ — Asociación Chaqueña de Estudiantes Tecnológicos de Ingeniería Química"
- `<meta name="description">`: "Asociación de estudiantes de Ingeniería Química de la UTN Facultad Regional Resistencia. Actividades académicas, eventos y recursos."
- Open Graph: imagen institucional 1200×630, título y descripción equivalentes.

**Composición vertical.**

```
┌─────────────────────────────────────────────────────────────┐
│ [1] SKIP-LINK                                               │
│     componente: .skip-link                                  │
│     destino: #main-content                                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ [2] NAVBAR (sticky)                                         │
│     componente: .navbar                                     │
│     contenido: logo + 6 links + toggle mobile               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐  ATB
│ [3] HERO                                                    │
│     componente: .hero                                       │
│     contenido:                                              │
│       eyebrow: "Asociación Chaqueña de Estudiantes          │
│                 Tecnológicos de Ingeniería Química"         │
│       h1: "Estudiantes de Ingeniería Química                │
│            <em>organizados</em>, formados y conectados."    │
│       lead: 1-2 frases — clave `hero_lead` de              │
│             data/site_copy.json                             │
│             ⚠ pendiente de redacción por directiva         │
│       cta primario:  "Conocé la asociación"                 │
│                      → /sobre-achetiq.html                  │
│       cta secundario: "Ver gabinetes"                       │
│                       → /gabinetes.html                     │
│       visual: composición decorativa con grilla del         │
│               logo SVG (isotipo, sin texto)                 │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ [4] STRIP DE INDICADORES INSTITUCIONALES                    │
│     componente: .kpi-strip (grid-4 desktop / grid-2 mobile) │
│     datos: estáticos (hardcodeados en HTML)                 │
│     contenido (4 KPI):                                      │
│       • etiqueta: "Año de fundación"  valor: 2003           │
│       • etiqueta: "Socios activos"    valor: +100           │
│       • etiqueta: "Gabinetes"         valor: 4              │
│       • etiqueta: "Carrera"           valor: "Ingeniería    │
│                                               Química"      │
│     nota: valores numéricos en --color-primary;             │
│     no usar --color-cta en este componente                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ [5] SECCIÓN — MISIÓN INSTITUCIONAL                          │
│     componente: .section-title + .prose                     │
│     datos: clave `mision` de data/site_copy.json            │
│             ⚠ pendiente de redacción por directiva          │
│     contenido:                                              │
│       eyebrow: "Nuestra razón de ser"                       │
│       h2: "Misión <em>institucional</em>"                   │
│       prose: párrafo de misión, ≤ 100 palabras              │
│     CTA al pie: "Conocé más sobre AChETIQ"                  │
│                 → /sobre-achetiq.html (.link-arrow)         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ [6] SECCIÓN — GABINETES                                     │
│     componente: .section-title + .grid-cards.grid-cards--2  │
│     datos: data/gabinetes.json (data-loader="gabinetes")    │
│     contenido:                                              │
│       eyebrow: "Cuatro frentes de trabajo"                  │
│       h2: "Nuestros <em>gabinetes</em>"                     │
│       grid: 4 cards .card-gabinete                          │
│       orden: Cursos y Conferencias · Eventos ·              │
│              Prensa y Difusión · Solidario                  │
│     CTA al pie: "Ver todos los gabinetes"                   │
│                 → /gabinetes.html (.link-arrow)             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ [7] SECCIÓN — GALERÍA INSTITUCIONAL                         │
│     componente: .gallery-events                             │
│     datos: data/galeria.json (data-loader="galeria")        │
│     contenido: 4 eventos, cada uno con:                     │
│       • título del evento                                   │
│       • descripción breve (2-3 líneas)                      │
│       • grid de 3-4 fotos (.gallery-event__photos)          │
│                                                             │
│     Eventos planificados:                                   │
│       1. Congreso IQ 2024 (tipo: congreso)                  │
│          ⚠ título oficial, descripción y fotos pendientes   │
│       2. Congreso IQ 2025 (tipo: congreso)                  │
│          ⚠ título oficial, descripción y fotos pendientes   │
│       3. Actividad institucional A (tipo: actividad)        │
│          ⚠ selección, título, descripción y fotos           │
│            pendientes de definir                            │
│       4. Actividad institucional B (tipo: actividad)        │
│          ⚠ selección, título, descripción y fotos           │
│            pendientes de definir                            │
│                                                             │
│     Estructura de data/galeria.json:                        │
│       [{ "id": "congreso-iq-2024",                          │
│          "tipo": "congreso",                                │
│          "titulo": "...",                                   │
│          "descripcion": "...",                              │
│          "fotos": ["assets/img/galeria/...", ...] }]        │
│                                                             │
│     Layout desktop: evento como fila — descripción izq,    │
│     grid de fotos der. Mobile: descripción arriba,          │
│     fotos abajo en scroll horizontal.                       │
│     eyebrow de sección: "Nuestra trayectoria"               │
│     h2: "Momentos <em>institucionales</em>"                 │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ [8] BLOQUE CTA — "SUMATE A ACHETIQ"                         │
│     componente: bloque dedicado, fondo --color-primary      │
│     contenido (texto blanco):                               │
│       h2: "Querés <em>sumarte</em> a la asociación?"        │
│       lead: "AChETIQ se construye con la participación de   │
│              cada estudiante. Hay un lugar para vos en      │
│              alguno de los cuatro gabinetes."               │
│       cta: "Contactanos" → /contacto.html                   │
│            (.btn-primary, color invertido sobre fondo azul) │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ [9] FOOTER                                                  │
│     componente: .footer                                     │
└─────────────────────────────────────────────────────────────┘
```

**Decisiones de diseño aplicadas.**

- Bloques Actividades y Noticias eliminados de v1.0. Se incorporan en una iteración posterior cuando exista contenido real.
- Galería institucional [7] agregada: 4 eventos (2 congresos + 2 actividades); contenido y fotos pendientes de aporte por directiva.
- KPI strip corregido respecto al skeleton original: reemplaza "integrantes de directiva: 12" por "Socios activos: +100".
- El texto del `lead` del Hero y el prose de Misión se inyectan desde `data/site_copy.json`; ambos están marcados como pendientes de redacción institucional.
- Las animaciones de entrada son opcionales; si se incluyen, usar `transition-slow` y respetar `prefers-reduced-motion`.
- El strip de KPIs [4] no debe usar `--color-cta` (reservado a botones de acción primaria). Usar `--color-primary` para los valores numéricos.

---

## 2. Página: Sobre AChETIQ (`sobre-achetiq.html`)

**Propósito.** Presentar la asociación en profundidad: su trayectoria histórica, misión y visión, valores institucionales, marco de pertenencia institucional y documentación oficial.

**Metadatos.**

- `<title>`: "Sobre AChETIQ — Quiénes somos | AChETIQ"
- `<meta name="description">`: "La Asociación Chaqueña de Estudiantes Tecnológicos de Ingeniería Química: historia, misión, valores y documentación institucional."

**Composición vertical.** (✅ cerrado · 🔲 pendiente)

```
┌─────────────────────────────────────────────────────────────┐
│ [1] SKIP-LINK + [2] NAVBAR                                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐  🔲 ATB
│ [3] PAGE-HEADER                                             │
│     componente: .page-header                                │
│     contenido:                                              │
│       eyebrow: "Sobre AChETIQ"                              │
│       h1: "Quiénes <em>somos</em>"                          │
│       lead: "Una asociación de estudiantes de Ingeniería    │
│              Química de la UTN Facultad Regional Resistencia│
│              (FRRe), Resistencia, Chaco."                   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐  ✅
│ [4] SECCIÓN — NUESTRA HISTORIA                              │
│     componente: .section-title + .timeline                  │
│     datos: data/historia.json (a crear en Fase 2)           │
│     fondo: --color-bg                                       │
│     contenido:                                              │
│       eyebrow: "Trayectoria"                                │
│       h2: "Nuestra <em>historia</em>"                       │
│       timeline: 6 hitos 2003–2013 + 1 entrada ghost         │
│         · 2003 — Primeros pasos ante la FeNEIQ              │
│         · 2005 — Delegación y continuidad estudiantil       │
│         · 2007 — Nueva delegada ante la FeNEIQ              │
│         · 2009 — Fundación formal de AChETIQ (30/04/2009)   │
│         · 2010 — 1.ª Jornada de Ingeniería Química          │
│         · 2013 — XIX CONEIQ en Resistencia                  │
│         · [ghost] "La historia continúa..."                 │
│     notas:                                                  │
│       - Íconos Lucide por hito: pendiente de selección      │
│       - Timeline extensible: incorporar hitos 2014–2026     │
│         a medida que se recopilen                           │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐  ✅
│ [5] SECCIÓN — MISIÓN Y VISIÓN                               │
│     layout: grid 2 columnas (desktop) · 1 columna (mobile)  │
│     fondo: --color-panel (#F8F6F2)                          │
│     sin eyebrow global ni H2 global                         │
│     datos: data/site_copy.json → clave "mision_vision"      │
│            estructura: { mision: "...", vision: "..." }      │
│            (label e ícono hardcoded en HTML)                │
│                                                             │
│     columna izquierda — MISIÓN                              │
│       label: "MISIÓN" (Geist Mono uppercase)                │
│       ícono Lucide: target (inline izq. del label)          │
│       borde lateral: 3 px, --color-primary, altura completa │
│       texto: desde data/site_copy.json                      │
│                                                             │
│     columna derecha — VISIÓN                                │
│       label: "VISIÓN" (Geist Mono uppercase)                │
│       ícono Lucide: telescope ⚠ verificar disponibilidad    │
│                    (fallback: compass o eye)                 │
│       borde lateral: 3 px, --color-primary, altura completa │
│       texto: desde data/site_copy.json                      │
│                                                             │
│     sin CTA — transición natural al bloque siguiente        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐  ✅
│ [6] SECCIÓN — VALORES INSTITUCIONALES                       │
│     componente: .section-title + .grid-cards                │
│     variante de tarjeta: .card--valor (nueva — agregar al   │
│                           catálogo en Fase 1 menor)         │
│     fondo: --color-bg                                       │
│     datos: data/site_copy.json → clave "valores" (arreglo)  │
│            esquema por ítem: { id, nombre, icono,           │
│                               descripcion }                 │
│     contenido:                                              │
│       sin eyebrow                                           │
│       h2: "Valores <em>institucionales</em>"                │
│       grid: 3 col (desktop) · 2 col (tablet) · 1 (mobile)  │
│       tarjeta: ícono Lucide + nombre (H3 Instrument Serif)  │
│                + descripción breve                          │
│       bordes: 1 px --color-border, radio pequeño            │
│               sin color de fondo de tarjeta                 │
│       uniformidad visual: min-height por CSS                │
│                                                             │
│     valores (6 ítems — borradores ⚠ pendientes aprobación   │
│     comisión directiva antes del despliegue):               │
│       innovacion           · flask-conical                  │
│       proactividad         · arrow-up-right                 │
│       companerismo         · users-round                    │
│       integracion          · link-2                         │
│       conciencia-ambiental · sprout                         │
│       solidaridad          · heart-handshake ⚠ verificar    │
│                                                             │
│     separación con bloque siguiente: espacio vertical       │
│     generoso (sin divider, sin cambio de fondo)             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐  ✅
│ [7] SECCIÓN — INSTITUCIONES VINCULADAS                      │
│     componente: .section-title + .grid-cards.grid-cards--2  │
│     datos: data/instituciones.json (2 entradas)             │
│     fondo: --color-panel (#F8F6F2)                          │
│     contenido:                                              │
│       eyebrow: "Marco de pertenencia"                       │
│       h2: "Instituciones <em>vinculadas</em>"               │
│       card por institución:                                 │
│         logo (img con fondo transparente)                   │
│         nombre completo                                     │
│         nombre corto (Geist Mono)                           │
│         descripción breve (rol respecto a AChETIQ)          │
│         link "Visitar sitio" → web oficial                  │
│     instituciones: UTN FRRe · ANEIQA                        │
│     ⚠ logos requieren versión con fondo transparente        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐  ✅
│ [8] SECCIÓN — DOCUMENTOS INSTITUCIONALES                    │
│     componente: .section-title + .grid-cards.grid-cards--2  │
│     variante de tarjeta: .card-documento (nueva — agregar   │
│                           al catálogo en Fase 1 menor)      │
│     fondo: --color-bg                                       │
│     separación superior: borde 1 px --color-border          │
│     datos: data/documentos.json                             │
│     contenido:                                              │
│       eyebrow: "Marco normativo"                            │
│       h2: "Documentos <em>institucionales</em>"             │
│       card por documento:                                   │
│         badge de tipo (PDF)                                 │
│         título del documento                                │
│         descripción de 1–2 líneas                           │
│         metadato: tipo · tamaño                             │
│         botón: "Ver documento" → archivo                    │
│                                                             │
│     documentos (2 ítems):                                   │
│       · Estatuto de AChETIQ                                 │
│         "Documento fundacional de AChETIQ. Establece sus    │
│          objetivos, órganos de gobierno y normas de         │
│          funcionamiento."                                   │
│         PDF · ~6.9 MB ⚠ comprimir antes del lanzamiento     │
│         → docs/Estatuto.pdf                                 │
│       · Reglamento de Sanciones                             │
│         "Regula las conductas que pueden dar lugar a        │
│          sanciones dentro de la asociación."                │
│         PDF · 92 KB                                         │
│         → docs/Reglamento_Sanciones.pdf                     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐  ✅
│ [9] CTA FINAL — SUMATE A AChETIQ                            │
│     componente: bloque dedicado                             │
│     fondo: --color-primary (#0D3B66) · texto blanco         │
│     contenido:                                              │
│       eyebrow: "Formá parte"                                │
│       h2: "Sumate a AChETIQ"                                │
│       bajada: "Participá en los gabinetes de trabajo,       │
│               accedé a recursos académicos y conectá con    │
│               otros estudiantes de Ingeniería Química."     │
│       botón primario:           "Sumate" → contacto.html    │
│       botón secundario (outline): "Conocé los gabinetes"    │
│                                   → gabinetes.html          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ [10] FOOTER                                                 │
└─────────────────────────────────────────────────────────────┘
```
---

## 3. Página: Gabinetes (`gabinetes.html`)

**Propósito.** Presentar la estructura organizativa de AChETIQ: su comisión directiva vigente y los cuatro gabinetes de trabajo, invitando a los socios a participar activamente.

**Metadatos.**

- `<title>`: "Organización — AChETIQ"
- `<meta name="description">`: "Conocé la comisión directiva de AChETIQ y sus cuatro gabinetes de trabajo: Cursos y Conferencias, Eventos, Prensa y Difusión, y Solidario."

**Composición vertical.** (✅ cerrado · 🔲 pendiente)

```
┌─────────────────────────────────────────────────────────────┐
│ [1] SKIP-LINK + [2] NAVBAR                                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐  🔲 ATB
│ [3] PAGE-HEADER                                             │
│     componente: .page-header                                │
│     contenido:                                              │
│       eyebrow: "Organización"                               │
│       h1: "Cómo nos <em>organizamos</em>"                   │
│       lead: "AChETIQ se organiza a través de su comisión    │
│              directiva y cuatro gabinetes de trabajo, cada  │
│              uno orientado a un eje específico de la        │
│              actividad asociativa."                         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐  ✅
│ [4] SECCIÓN — COMISIÓN DIRECTIVA                            │
│     componente: .section-title + .grid-cards                │
│     variante de tarjeta: .card-integrante                   │
│     datos: data/directiva.json (data-loader="directiva")    │
│     fondo: --color-panel (#F8F6F2)                          │
│     contenido:                                              │
│       eyebrow: "Gestión 2026"                               │
│       h2: "Comisión <em>directiva</em>"                     │
│       lead: "Quienes conducen la asociación durante         │
│              el período 2026."                              │
│                                                             │
│     3 subgrupos renderizados por el componente              │
│     (campo "subgrupo" del JSON); sin etiqueta h3 —          │
│     separación visual únicamente (divider o espacio):       │
│                                                             │
│     · presidencia (2): Presidente · Vicepresidente          │
│     · titulares   (5): Secretaria · Tesorero ·              │
│                        Titular CRC · 1° Vocal · 2° Vocal    │
│     · suplentes   (5): Prosecretaria · Protesorero ·        │
│                        Suplente CRC · 1° Vocal sup. ·       │
│                        2° Vocal sup.                        │
│                                                             │
│     estado de fotos faltantes:                              │
│       placeholder con iniciales sobre --color-panel         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐  ✅
│ [5] SECCIÓN — GABINETES DE TRABAJO                          │
│     componente: .section-title + .grid-cards.grid-cards--2  │
│     datos: data/gabinetes.json (data-loader="gabinetes")    │
│     fondo: --color-bg                                       │
│     orden de renderizado (campo "orden" a ajustar en JSON): │
│       1. Cursos y Conferencias                              │
│       2. Eventos                                            │
│       3. Prensa y Difusión                                  │
│       4. Solidario                                          │
│                                                             │
│     cada card .card-gabinete:                               │
│       ícono Lucide                                          │
│       nombre del gabinete                                   │
│       descripcion_corta                                     │
│       footer: "N integrantes" + link "Conocer más →"        │
│               → pages/gabinete.html?id=<slug>               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐  ✅
│ [6] BLOQUE CTA — CÓMO SUMARTE                               │
│     componente: bloque dedicado                             │
│     fondo: --color-panel (#F8F6F2)                          │
│     contenido:                                              │
│       eyebrow: "Participación"                              │
│       h2: "¿Querés <em>integrar</em> un gabinete?"          │
│       prose: "La participación en los gabinetes está        │
│               abierta a todo socio activo de AChETIQ.       │
│               Escribinos contándonos cuál te interesa."     │
│       botón: "Escribinos"                                   │
│               → contacto.html?asunto=gabinete               │
│               (query string pre-selecciona opción en el     │
│               form de contacto vía JS)                      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ [7] FOOTER                                                  │
└─────────────────────────────────────────────────────────────┘
```

> **Pendiente técnico:** el campo `orden` en `data/gabinetes.json` debe actualizarse para reflejar el nuevo orden editorial: Cursos y Conferencias (1) · Eventos (2) · Prensa y Difusión (3) · Solidario (4).

### 3.1 Plantilla de gabinete individual (`pages/gabinete.html`)

🔲 **Pendiente — se aborda en sesión separada.**

Página dinámica que toma el `id` del gabinete por query string (`?id=cursos-y-conferencias`) y renderiza el detalle completo. Estructura preliminar a validar en su momento:

```
[1] SKIP-LINK + [2] NAVBAR
[3] BREADCRUMBS: Inicio › Gabinetes › [Nombre del gabinete]
[4] PAGE-HEADER: eyebrow "Gabinete" · h1 nombre · lead descripcion_corta
[5] DESCRIPCIÓN COMPLETA: .prose 65ch · desde descripcion_completa del JSON
[6] INTEGRANTES: .grid-cards--4 · desde integrantes[] · fallback empty-state
[7] PROYECTOS ACTIVOS: lista · desde proyectos_activos[] · fallback empty-state
[8] CTA: "Sumate al [nombre]" → contacto.html?asunto=<slug>
[9] FOOTER
```
---

## 4. Página: Recursos Académicos (`recursos-academicos.html`)

**Propósito.** Centralizar el material académico de la carrera organizado por año y materia. Es la sección de mayor valor utilitario para el estudiante recurrente.

**Metadatos.**

- `<title>`: "Recursos Académicos — AChETIQ"
- `<meta name="description">`: "Apuntes, guías y bibliografía de Ingeniería Química UTN FRRe, organizados por año y materia. Plan 2023."

**Composición vertical.** (✅ cerrado · 🔲 pendiente)

```
┌─────────────────────────────────────────────────────────────┐
│ [1] SKIP-LINK + [2] NAVBAR                                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐  🔲 ATB
│ [3] PAGE-HEADER                                             │
│     componente: .page-header                                │
│     contenido:                                              │
│       eyebrow: "Material de estudio"                        │
│       h1: "Recursos <em>académicos</em>"                    │
│       lead: "Apuntes, guías y bibliografía organizados por  │
│              año y materia, aportados por la comunidad      │
│              estudiantil de Ingeniería Química."            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐  ✅
│ [4] BLOQUE — RECURSOS DE REFERENCIA (2 columnas)            │
│     eyebrow flotante: "Recursos de referencia"              │
│     sin H2 de sección                                       │
│     fondo: --color-bg                                       │
│                                                             │
│     ┌──────────────────────┐  ┌──────────────────────┐     │
│     │ Diseño Curricular —  │  │ Planilla de           │     │
│     │ IQ UTN FRRe          │  │ Seguimiento de        │     │
│     │                      │  │ Carrera               │     │
│     │ Plan de estudios      │  │ Herramienta para      │     │
│     │ oficial de la        │  │ registrar el estado   │     │
│     │ carrera. Plan 2023.  │  │ de cada materia,      │     │
│     │                      │  │ calcular el avance y  │     │
│     │ PDF · 2.1 MB         │  │ verificar             │     │
│     │                      │  │ correlativas.         │     │
│     │ [Descargar]          │  │ Plan 2023.            │     │
│     │ → docs/Diseno        │  │                       │     │
│     │   _Curricular_IQ.pdf │  │ [Acceder ↗]           │     │
│     └──────────────────────┘  │ → Drive (nueva        │     │
│                                │   pestaña)            │     │
│                                │ ícono: external-link  │     │
│                                └──────────────────────┘     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐  ✅
│ [5] FILTROS POR AÑO                                         │
│     componente: .pill-nav                                   │
│     pills: [Todos] [1° año] [2° año] [3° año] [4°] [5°]    │
│     comportamiento: seleccionar un año OCULTA las cards     │
│                     de todos los demás años (no filtra      │
│                     in-place); "Todos" muestra todo         │
│     estado por defecto: "Todos" activo                      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐  ✅
│ [6] GRID DE MATERIAS                                        │
│     componente: .grid-cards (columnas adaptativas)          │
│     datos: data/recursos.json (41 materias, Plan 2023)      │
│            data-loader="recursos"                           │
│     card por materia (.card-materia):                       │
│       imagen representativa (fondo de color por año         │
│       como placeholder hasta contar con imágenes reales;   │
│       imágenes definitivas provistas por comisión directiva)│
│       nombre de la materia                                  │
│       toda la card es clickeable                            │
│       → pages/recurso.html?id=<slug>                        │
│     sin badge de año · sin conteo de archivos               │
│     colores de placeholder por año (a definir en Fase 2):   │
│       1° año · 2° año · 3° año · 4° año · 5° año           │
│     orden: por anio asc, orden natural dentro del año       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐  ✅
│ [7] CTA — APORTAR MATERIAL                                  │
│     componente: bloque dedicado                             │
│     fondo: --color-primary (#0D3B66) · texto blanco         │
│     contenido:                                              │
│       eyebrow: "Comunidad"                                  │
│       h2: "¿Querés <em>aportar</em> material?"              │
│       prose: "Si tenés apuntes, guías resueltas o material  │
│               de estudio que pueda servirle a otros         │
│               estudiantes, escribinos. Todo aporte queda    │
│               disponible para la comunidad y se acredita    │
│               al autor original."                           │
│       botón: "Quiero aportar"                               │
│               → mailto:achetiq.resistencia+apuntes          │
│                          @aneiqa.org                        │
│                 ?subject=Envío%20de%20material%20académico  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ [8] FOOTER                                                  │
└─────────────────────────────────────────────────────────────┘
```

> **Nota:** los criterios de publicación (material aportado por estudiantes, respeto de autoría, no se publican parciales filtrados ni material de uso restringido, la asociación se reserva la decisión de publicar) se incorporan como nota al pie del bloque CTA [7] o en el footer, no como bloque independiente.

> **Pendiente técnico:** colores de placeholder por año para `.card-materia` a definir en Fase 2. Seguir la paleta Océano & Areia; no usar los colores del isotipo.

### 4.1 Plantilla de materia individual (`pages/recurso.html`)

🔲 **Pendiente — se aborda en sesión separada.**

Página dinámica que toma el `id` de la materia por query string y renderiza el detalle completo. Estructura preliminar a validar en su momento:

```
[1] SKIP-LINK + [2] NAVBAR
[3] BREADCRUMBS: Inicio › Recursos Académicos › [Nombre de materia]
[4] PAGE-HEADER: eyebrow "[N°] año" · h1 nombre de materia
[5] APUNTES Y GUÍAS: .grid-cards--2 ó .list-downloads según volumen · fallback empty-state
[6] BIBLIOGRAFÍA RECOMENDADA: lista numerada estilo APA
[7] RECURSOS EXTERNOS: lista con título + URL + dominio
[8] NAVEGACIÓN: ← Materia anterior | Materia siguiente →
[9] FOOTER
```
---

## 5. Página: Contacto (`contacto.html`)

**Propósito.** Punto de contacto directo entre el usuario y la asociación: canales activos, redes sociales y ubicación física. Sin formulario de envío.

**Metadatos.**

- `<title>`: "Contacto — AChETIQ"
- `<meta name="description">`: "Escribinos a AChETIQ. Datos de contacto, redes sociales y ubicación de la facultad."

**Composición vertical.**

```
┌─────────────────────────────────────────────────────────────┐
│ [1] SKIP-LINK + [2] NAVBAR                                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐  ATB
│ [3] PAGE-HEADER                                             │
│     contenido:                                              │
│       eyebrow: "Comunicación"                               │
│       h1: "Escribinos a <em>AChETIQ</em>"                   │
│       lead: "Consultas sobre la asociación, propuestas de   │
│              actividades, intención de sumarte a un         │
│              gabinete o aportes de material académico."     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ [4] INFORMACIÓN DE CONTACTO DIRECTA                         │
│     componente: .contact-grid                               │
│     fuente: data-loader="redes" → data/redes.json           │
│     grid: 4 col desktop / 2 col tablet / 1 col mobile       │
│                                                             │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌────┐ │
│  │ TARJETA      │ │ TARJETA      │ │ TARJETA      │ │TAR-│ │
│  │ EMAIL        │ │ INSTAGRAM    │ │ LINKEDIN     │ │JETA│ │
│  │              │ │              │ │              │ │DIR.│ │
│  │ ícono: mail  │ │ ícono:       │ │ ícono:       │ │    │ │
│  │ eyebrow:     │ │  instagram   │ │  linkedin    │ │íco-│ │
│  │  "Email"     │ │ eyebrow:     │ │ eyebrow:     │ │no: │ │
│  │ valor:       │ │  "Instagram" │ │  "LinkedIn"  │ │map-│ │
│  │  achetiq.re- │ │ valor:       │ │ estado:      │ │pin │ │
│  │  sistencia   │ │  @achetiq    │ │  badge       │ │eye-│ │
│  │  @aneiqa.org │ │ link:        │ │  "Próxima-   │ │bro-│ │
│  │ link:        │ │  instagram   │ │  mente"      │ │w:  │ │
│  │  mailto:     │ │  (nueva      │ │ link:        │ │"Vi-│ │
│  │              │ │  pestaña)    │ │  deshabili-  │ │si- │ │
│  │              │ │              │ │  tado        │ │ta- │ │
│  │              │ │              │ │              │ │nos"│ │
│  └──────────────┘ └──────────────┘ └──────────────┘ └────┘ │
│                                                             │
│  TARJETA DIRECCIÓN:                                         │
│    ícono: map-pin                                           │
│    eyebrow: "Visitanos"                                     │
│    título: "Facultad Regional Resistencia — UTN"            │
│    detalle: "Calle French 4141, H3506 Resistencia, Chaco"   │
│    link: Google Maps (nueva pestaña)                        │
│                                                             │
│  Notas de implementación:                                   │
│  · Solo se renderizan tarjetas con valor no-null en JSON.   │
│  · LinkedIn: valor null en JSON → badge "Próximamente",     │
│    tarjeta visible pero atenuada (opacity reducida),        │
│    sin enlace activo. Se activa cuando el campo sea no-null.│
│  · Dirección es campo estático (hardcodeado en HTML o en    │
│    un campo extra de data/redes.json).                      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ [5] BLOQUE — MAPA                                           │
│     componente: <iframe> de Google Maps embebido            │
│     centrado en la dirección de la UTN FRRe                 │
│     altura: 400 px en desktop, 300 px en mobile             │
│     border-radius: var(--radius-lg)                         │
│     ⚠ lazy-loading + carga diferida para no penalizar       │
│       Core Web Vitals                                       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ [6] FOOTER                                                  │
└─────────────────────────────────────────────────────────────┘
```

**Decisiones de diseño aplicadas.**

- Sin formulario de envío: la página no incluye ningún `<form>`. El usuario es dirigido a los canales directos.
- Canales mostrados: solo los que tengan valor no-null en `data/redes.json`. En v1.0: email e Instagram.
- LinkedIn: se muestra con badge "Próximamente" y enlace deshabilitado; se activa automáticamente cuando se agregue el campo en el JSON.
- La tarjeta de dirección puede alimentarse desde un campo adicional en `data/redes.json` (`direccion_facultad`, ya presente) o hardcodearse en HTML dado que es un dato estático.
- Los vínculos a páginas externas (Instagram, Google Maps) abren siempre en nueva pestaña (`target="_blank" rel="noopener noreferrer"`).

---

## 6. Patrones transversales

### 6.1 Navbar y Footer en todas las páginas

Las cinco páginas (más las dos plantillas de detalle) comparten el mismo `<header class="navbar">` y `<footer class="footer">`. Para el primer release con HTML estático sin SSI, se acepta la duplicación. En una iteración posterior, se puede extraer mediante un script JS que inyecte los fragmentos en runtime, o mediante una build mínima con `html-includes` o similar.

### 6.2 Comportamiento del navbar en cada página

- Link de la página actual: `aria-current="page"` agregado manualmente en cada HTML.
- Logo: siempre lleva a `/`.
- En mobile: el toggle abre la lista en modo full-width drop-down.

### 6.3 Manejo de query strings

Las páginas que reciben parámetros (`pages/gabinete.html?id=...`, `pages/recurso.html?slug=...`) leen el query string en `js/pages/<página>.js` con `URLSearchParams`. Si el parámetro es inválido o falta, redirigir al listado padre con un mensaje opcional.

### 6.4 Fallbacks y estados de error

| Situación | Comportamiento |
|---|---|
| `fetch()` falla (offline, archivo movido) | Mostrar empty-state con texto "No se pudo cargar el contenido. Reintentá en unos minutos." |
| JSON malformado | Idem anterior; loguear el error en consola para debugging |
| Imagen no encontrada | Placeholder con iniciales (para fotos de personas) o color de fondo neutro (para imágenes de noticias/eventos) |
| Página individual con `id` inexistente | Redirigir al listado padre (`gabinetes.html`, `recursos.html`) |

### 6.5 Accesibilidad — checklist mínimo

- Todas las páginas tienen `<html lang="es">`.
- Toda imagen decorativa lleva `alt=""`.
- Todo input lleva `<label>` asociado.
- Todo botón puramente icónico lleva `aria-label`.
- Contraste de texto cumple WCAG AA (validado por la paleta Océano & Areia ya analizada).
- Foco visible en todos los elementos interactivos (override del outline default solo si se reemplaza por uno equivalente o mejor).
- Orden de tabulación lógico (DOM order coincide con lectura visual).

### 6.6 SEO — checklist mínimo

- Cada página con `<title>` único y descriptivo.
- Cada página con `<meta name="description">` única, ≤ 160 caracteres.
- Cada página con tags Open Graph (`og:title`, `og:description`, `og:image`, `og:url`).
- `sitemap.xml` con todas las páginas estáticas.
- `robots.txt` permitiendo indexación completa.
- URLs canónicas vía `<link rel="canonical">`.
- Estructura de encabezados respetando jerarquía (un solo `<h1>` por página).

---

## 7. Estado de cierre de Fase 1

Con este documento, los tres bloqueantes de la Fase 1 están resueltos:

| Bloqueante | Estado |
|---|---|
| #1 Wireframes de páginas clave | ✅ Resuelto en este documento (5 páginas + 2 plantillas) |
| #2 Logo SVG vectorial | ✅ Resuelto (`assets/img/logo/achetiq-logo.svg`) |
| #3 Catálogo de componentes | ✅ Resuelto (`FASE_1_Catalogo_Componentes.md`) |

**Pendientes menores de Fase 1, no bloqueantes para iniciar Fase 2:**

- Generación de favicon (`favicon.ico` + `favicon.svg`) desde el SVG del logo.
- Optimización del SVG vía SVGO (reducción de ~50% del tamaño).

Estos pueden completarse en cualquier momento durante la Fase 2 sin bloquear el desarrollo.

---

## 8. Próximos pasos (Fase 2 — Desarrollo front-end)

Con el sistema de tokens, el catálogo de componentes y los wireframes cerrados, la Fase 2 puede iniciarse mecánicamente. La secuencia recomendada es:

1. **Andamiaje del repositorio** según la estructura de `FASE_0_Arquitectura.md` §5.
2. **Implementación de globales:** `css/main.css` (importa `tokens.css` y agrega resets adicionales si hacen falta), `css/components.css` (todos los componentes del catálogo), `js/main.js` (navbar mobile, skip-link), `js/loaders.js` (sistema `data-loader`).
3. **Implementación de páginas en orden de prioridad:**
   1. `index.html` — usa todos los componentes globales y secciones de demostración.
   2. `sobre-achetiq.html` — máxima densidad de contenido ya disponible.
   3. `gabinetes.html` + `pages/gabinete.html` — contenido completo en JSON.
   4. `contacto.html` — sin formulario; solo información directa. Sin dependencias externas.
   5. `recursos.html` + `pages/recurso.html` — esqueleto navegable; el contenido se carga iterativamente.

4. **Validación cross-browser y responsive** antes del despliegue.
5. **Despliegue inicial en GitHub Pages** (Fase 4, paralela a la finalización de Fase 2).

---

*AChETIQ — Documento técnico interno — Fase 1 — 2026-05-08*
