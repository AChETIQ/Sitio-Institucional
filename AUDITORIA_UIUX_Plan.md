# AUDITORÍA UI/UX — Plan maestro

> Plan de auditoría de diseño del sitio web oficial de AChETIQ. Define el diagnóstico de línea base, la metodología de evaluación y la hoja de ruta de ejecución en **seis sesiones aisladas de Claude Code**, cada una acotada a un dominio del frontend. Los prompts ejecutables correspondientes viven en `AUDITORIA_UIUX_Prompts.md`.
>
> Versión: 1.0 · Fecha: 2026-06-09 · Documento complementario de `INSTRUCCION_PROYECTO.md`, `FASE_0_Arquitectura.md` y `FASE_1_Catalogo_Componentes.md`

---

## 1. Resumen ejecutivo

### 1.1. Objetivo
Elevar de manera sustancial la estética visual, la usabilidad y la arquitectura frontend del sitio, llevándolo de un nivel «correcto y disciplinado» a un nivel **profesional de referencia**. La comisión directiva autorizó un **rediseño visual ambicioso**: la auditoría no se limita a refinar la identidad «Océano & Areia» vigente, sino que puede proponer nueva paleta, nuevos emparejamientos tipográficos y nuevos paradigmas de layout, siempre dentro del stack técnico no negociable (HTML5 semántico, CSS puro con tokens y BEM, JavaScript vanilla, GitHub Pages).

### 1.2. Diagnóstico sintético del estado actual

**Fortalezas verificadas**

| Área | Evidencia |
|---|---|
| Sistema de tokens maduro | `tokens.css` (548 líneas): 24 tokens de color, escala tipográfica de 10 pasos, escala de espaciado de 4 px, capas de z-index, duraciones de transición. Regla estricta: sin hexadecimales ni nombres de fuente fuera de tokens (única excepción documentada: paleta local de `assets/css/seguimiento.css`). |
| CSS modular y consistente | 18 hojas BEM (~5.600 líneas) bajo `assets/css/`, importadas por `main.css`. Organización por componente, no por página. |
| Base de accesibilidad sólida | HTML semántico, skip-links, navegación por teclado en navbar (flechas, Home/End, Esc), `aria-live` en loaders, reset global de `prefers-reduced-motion` con patrón `.safe-motion`, ratios de contraste documentados en comentarios de tokens. |
| Cero dependencias externas | Fuentes autoalojadas (woff2), sin CDN, sin frameworks, JS con helpers seguros (`createElement`, `safeHref`; sin `innerHTML` sobre datos). |
| Sistema documentado | Catálogo de 23+ componentes en `FASE_1_Catalogo_Componentes.md`; arquitectura en `FASE_0_Arquitectura.md`. |

**Debilidades verificadas**

| # | Hallazgo | Evidencia | Dominio |
|---|---|---|---|
| D1 | Tipografía no fluida: tamaños absolutos en px, sin `clamp()` ni rem. El H1 de 48 px no escala en pantallas de 360–414 px. | `tokens.css` (escala `--text-*`) | Tipografía |
| D2 | Geist se carga solo en peso 400; `--weight-medium` (500) se sintetiza por el navegador (faux weight). | `assets/fonts/` (3 archivos), `assets/css/main.css` §@font-face | Tipografía |
| D3 | `--font-mono: 'Geist Mono'` no tiene archivo de fuente: degrada silenciosamente a Courier New. | `tokens.css` línea 145; ausencia en `assets/fonts/` | Tipografía |
| D4 | Sin límite de medida en prosa (sin `max-width` tipo `65ch`): párrafos a ancho completo en pantallas anchas. | hojas de texto/headers | Layout |
| D5 | Breadcrumbs especificados en el catálogo pero no desplegados en páginas de detalle. | `FASE_1_Catalogo_Componentes.md` §navegación | Layout |
| D6 | Breakpoints 1280/1480 px definidos como referencia pero casi sin uso; salto brusco de 1 columna a 2/3 sin refinamiento para tablet apaisada. | hojas con `@media` (11 archivos usan 768 px) | Responsive |
| D7 | Sin estilos de impresión (`@media print`). | todo `assets/css/` | Responsive |
| D8 | Destinos de skip-link inconsistentes: `#contenido` en `index.html` vs `#main-content` en el resto. | `index.html`, `pages/*.html` | Accesibilidad |
| D9 | Cobertura de `:focus-visible` no centralizada ni verificada en todos los elementos interactivos. | hojas de componentes | Accesibilidad |
| D10 | Estados de error dinámicos sin `role="alert"`/`aria-live` garantizado al momento de inserción. | `assets/js/main.js`, `assets/js/loaders.js` | Accesibilidad |
| D11 | Cadena de 14 `@import` en `main.css`: descarga secuencial que bloquea el primer render. | `assets/css/main.css` líneas 51–64 | Rendimiento |
| D12 | Sin línea base de rendimiento documentada (Lighthouse/Core Web Vitals); sin `loading="lazy"`, `fetchpriority` ni dimensiones explícitas de imagen sistematizadas. | páginas HTML | Rendimiento |
| D13 | Microinteracciones mínimas: transiciones de hover básicas; sin sistema de easing con intención, sin View Transitions. | `tokens.css` §transiciones, `assets/js/scroll-reveal.js` | Animaciones |
| D14 | Formulario de contacto en esqueleto (`forms.css` diferido), sin patrón de validación accesible definido. | `assets/css/forms.css`, `pages/contacto.html` | Accesibilidad |

---

## 2. Metodología de auditoría

Cada sesión de ejecución aplica, dentro de su dominio, las fases que correspondan:

1. **Inventario de tokens y deuda visual.** Mapear todos los valores en uso (colores, tamaños, espaciados, sombras, easing) y contrastarlos contra `tokens.css`. Detectar valores huérfanos, duplicados o sintetizados.
2. **Evaluación heurística por página.** Recorrido de las 9 páginas (`index.html`, `pages/sobre-achetiq.html`, `pages/gabinetes.html`, 4 detalles de gabinete, `pages/recursos.html`, `pages/recursos/apuntes.html`, `pages/recursos/seguimiento.html`, `pages/contacto.html`, `404.html`) aplicando heurísticas de Nielsen: jerarquía visual, consistencia, prevención de errores, reconocimiento sobre recuerdo, estética minimalista.
3. **Matriz responsive.** Verificación de cada página en 360 / 640 / 768 / 1024 / 1280 / 1480 px, registrando roturas, saltos bruscos y espacio desaprovechado.
4. **Checklist WCAG 2.2 AA.** Contraste, foco visible, orden de tabulación, nombres accesibles, tamaños de objetivo (24×24 mínimo, 44×44 recomendado), estados anunciados.
5. **Inventario de movimiento.** Catalogar keyframes, transiciones y reveals; evaluar propósito, duración y respeto de `prefers-reduced-motion`.
6. **Línea base de rendimiento.** Lighthouse (móvil y escritorio) sobre las páginas principales; registro de LCP, CLS, INP y peso transferido antes y después.

---

## 3. Hoja de ruta de ejecución — seis sesiones aisladas

El orden es **vinculante** porque existe dependencia de fundación: la Sesión 1 rediseña `tokens.css` y todas las demás consumen su resultado.

| Orden | Sesión | Dominio | Depende de | Rama sugerida |
|---|---|---|---|---|
| 1 | S1 | Sistemas de tipografía y color (rediseño de tokens) | — | `design/s1-tipografia-color` |
| 2 | S2 | Jerarquía de componentes y layout | S1 fusionada | `design/s2-componentes-layout` |
| 3 | S3 | Comportamiento responsive | S1–S2 fusionadas | `design/s3-responsive` |
| 4 | S4 | Accesibilidad (WCAG 2.2 AA) | S1–S3 fusionadas | `design/s4-accesibilidad` |
| 5 | S5 | Animaciones y microinteracciones | S1–S4 fusionadas | `design/s5-animaciones` |
| 6 | S6 | Rendimiento y entrega de activos | S1–S5 fusionadas | `design/s6-rendimiento` |

**Reglas de aislamiento**

- Una sesión = una rama = un pull request. No se inicia una sesión hasta fusionar la anterior, para que cada una lea el estado real del sistema (en especial `tokens.css` y `FASE_1_Catalogo_Componentes.md` actualizados).
- Cada prompt declara explícitamente qué archivos están **fuera de alcance** para evitar solapamientos (p. ej., los estilos de foco pertenecen solo a S4; los tokens de easing solo a S5).
- S6 cierra el ciclo midiendo el resultado final contra la línea base que ella misma establece al inicio.

---

## 4. Convenciones transversales (invariantes de todas las sesiones)

1. **Stack intocable:** HTML5 semántico, CSS puro, JS vanilla. Sin frameworks, sin generadores estáticos, sin preprocesadores, sin CDN.
2. **Arquitectura de datos intocable:** motor `data-loader` (`assets/js/main.js`), registro de renderers (`assets/js/loaders.js`), helpers de seguridad `createElement`/`safeHref` (prohibido `innerHTML` sobre datos), inyección de parciales (`assets/js/navbar.js`, `assets/js/footer.js` + `partials/*.html` + `data/*.json`).
3. **Tokens como única fuente de verdad:** todo valor visual nuevo nace en `tokens.css`; prohibido hardcodear hexadecimales, tamaños o fuentes en hojas de componente (excepción vigente: paleta local de `seguimiento.css`, que debe migrarse o re-documentarse, no multiplicarse).
4. **Nomenclatura BEM** y archivos en kebab-case.
5. **Copia editorial intocable:** los textos en español del sitio (`data/site_copy.json`, JSON de contenido, HTML) no se reescriben en estas sesiones; solo se reestructura su presentación.
6. **Activos autoalojados:** toda fuente o icono nuevo se incorpora como archivo local optimizado (woff2/SVG).
7. **Documentación sincronizada:** todo cambio de componente o token actualiza `FASE_1_Catalogo_Componentes.md` (y este plan si cambia el alcance).
8. **Commits en español, modo imperativo** (convención del proyecto).
9. **Metodología colaborativa adaptada:** dado que las sesiones son aisladas y autónomas, la ronda de propuesta se materializa como **resumen de decisiones de diseño escrito al inicio del PR**; la revisión de la directiva ocurre sobre el pull request antes de fusionar. Esta adaptación del ciclo de dos rondas de `INSTRUCCION_PROYECTO.md` §5.2 queda autorizada para esta auditoría.

---

## 5. Criterios de aceptación por sesión (definition of done)

| Sesión | Criterios mínimos |
|---|---|
| S1 | Nueva escala tipográfica fluida (`clamp()` + rem) y paleta definitiva en `tokens.css`; pesos/fuentes reales cargados (resolver D2, D3); contraste AA documentado por par fondo/texto; las 18 hojas migradas sin hexadecimales huérfanos; sitio íntegro renderiza con los nuevos tokens. |
| S2 | Sistema de elevación/sombras tokenizado; ritmo vertical consistente entre secciones; breadcrumbs desplegados (D5); medida de prosa aplicada (D4); catálogo FASE_1 reconciliado y actualizado. |
| S3 | Las 9 páginas verificadas en los 6 anchos de la matriz sin roturas; breakpoints 1280/1480 aprovechados (D6); espaciado fluido; `@media print` para páginas de contenido (D7). |
| S4 | Checklist WCAG 2.2 AA completa sin fallos; skip-links unificados (D8); sistema de foco centralizado (D9); errores dinámicos anunciados (D10); base de formulario accesible (D14). |
| S5 | Sistema de movimiento tokenizado (duraciones + easing con intención); microinteracciones en tarjetas, botones y navegación; View Transitions como mejora progresiva; reset de `prefers-reduced-motion` y patrón `.safe-motion` preservados. |
| S6 | Línea base Lighthouse documentada antes/después; eliminación de la cadena de `@import` (D11); estrategia de imágenes y fuentes optimizada (D12); presupuesto de rendimiento definido (LCP < 2,5 s móvil, CLS < 0,1). |

---

## 6. Ejecución

Los seis prompts listos para copiar en sesiones nuevas de Claude Code se encuentran en **`AUDITORIA_UIUX_Prompts.md`**. Cada prompt es autocontenido: incluye contexto del repositorio, hallazgos del dominio, tareas numeradas, técnicas modernas requeridas, restricciones duras y verificación, sin depender de esta conversación ni de este documento.
