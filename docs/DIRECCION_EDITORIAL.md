# Dirección editorial — Norte de la elevación E01–E07

> **Qué es esto.** El documento-norte de la batería de elevación editorial (E00–E07, ver
> `AUDITORIA_UIUX_Elevacion_Editorial.md`). No reemplaza a `DESIGN.md` (sistema visual),
> `PRODUCT.md` (estrategia/marca) ni `design-system/MASTER.md` (fuente entre sesiones): los
> **destila en una sola dirección** para que las seis vistas clave maduren con un criterio
> común. Si choca con esos archivos, mandan ellos para valores; este fija el *carácter*.
>
> **Regla de oro 1 (la que cambia respecto de la batería vieja):** la identidad **EVOLUCIONA,
> no se reinicia ni se congela**. La web sigue siendo **reconociblemente AChETIQ** —familias
> Fraunces/Hanken/Geist y anclas Cobalto/Mauveína intactas— pero el sistema visual **puede
> madurar** hacia lo editorial. E00 solo **mide y dirige**: no cambia ningún VALOR de token.

---

## a. El carácter: editorial sobrio, institución con trayectoria

AChETIQ debe leerse como una **publicación de calidad de una institución seria**, no como una
landing de SaaS ni como un folleto estudiantil. El modelo mental es el de una **revista
disciplinar bien compuesta cruzada con la papelería de una asociación con historia** (existe
desde 2009, con antecedentes en 2003): tipografía protagonista, mucho aire estructural, una
retícula fuerte y silenciosa, jerarquía que se siente *atemporal* en vez de *de temporada*. La
porcelana fría (grafito hue 265) es el papel; la tinta grafito hace el trabajo pesado; el
cobalto firma la estructura y la mauveína —escasa, ≤10% de pantalla— aparece solo cuando hay
una acción que importa. El registro sigue siendo el del «cuaderno de laboratorio» del
`MASTER.md`, pero subido de gama: del apunte prolijo a la **monografía bien impuesta**. Frío,
preciso, con calidez cargada en la voz (voseo en los CTA) y en la imagen, nunca en un neutro
tibio. Referencias de actitud —no de copia literal—: el rigor de una memoria institucional, la
respiración de una revista de oficio, la sobriedad de una placa de museo. **Anti-modelo:** la
home de herramienta 2024 (métrica-héroe, grilla de tarjetas, eyebrow por sección, acento en
gradiente). El objetivo del *slop test* de marca: que un par institucional pregunte «¿cómo se
hizo esto?», nunca «¿qué IA lo hizo?».

---

## b. Qué evoluciona vs qué se conserva

Mapa explícito de la regla de oro 1 a este sitio. **Conservar** = núcleo intocable de marca;
**Evolucionar** = madurez esperada, todo valor nuevo a `tokens.css` documentado en es-AR con su
ratio de contraste calculado.

| Capa | **Se conserva** (núcleo de marca) | **Puede evolucionar** (madurez editorial) |
|------|-----------------------------------|-------------------------------------------|
| **Familias tipográficas** | Fraunces (display), Hanken Grotesk (cuerpo), Geist Mono (etiqueta). No se reemplazan. | Escala modular y jerarquía: tamaños, pesos, tracking, line-height, *optical sizing* de Fraunces; refinar pasos `--type-step-*`. |
| **Reparto de voces** | Fraunces solo en H1/H2; H3/H4 en Hanken; mono reservada a metadatos. | Afinar el contraste display↔cuerpo; cómo y cuándo entra la itálica de titular (cobalto). |
| **Anclas de color** | Cobalto (`#1344A5`, estructura) y Mauveína (`#922FA1`, acción ≤10%). No se abandonan. | Tintes/acentos **derivados** de esos tonos (alias de estado, una superficie de realce sobria), siempre fríos. |
| **Fondo** | Porcelana **fría** (grafito hue 265). Jamás crema/arena/papel cálido. | Extender la rampa de neutros y superficies: más peldaños de «papel frío», realces sutiles. |
| **Neutros / superficies** | La banda grafito fría y sus ratios documentados. | Nuevos pasos de superficie y borde para jerarquía; reglas **hairline** y divisores editoriales. |
| **Elevación** | Plana por defecto; sombras frías mezcladas desde cobalto-950, nunca negras. | Refinar el vocabulario de sombra reactiva y el ritmo de elevación entre superficies. |
| **Ritmo y retícula** | Escala de espaciado de 4px; contratos de ritmo S2 vigentes. | Madurar el ritmo vertical, el ancho de medida y la composición (asimetría intencional). |
| **Accesibilidad / perf / movimiento** | WCAG 2.2 AA piso, foco centralizado, camino sin JS, `prefers-reduced-motion`, presupuesto de rendimiento. | Solo **mejorar**; si un cambio editorial tensiona con la a11y, gana la a11y. |
| **Modo de color** | Un solo modo (claro/porcelana). | **Nada**: dark mode queda fuera de alcance de esta batería. |

---

## c. Anti-referencias a rechazar

Reconciliadas con los vetos ya vigentes en `PRODUCT.md` (§Anti-references) y `MASTER.md` (§4),
más los *absolute bans* de impeccable. Si una skill propone algo de esta lista, se ignora y se
registra como nota de marca.

- **Plantilla de Wix / constructor comercial.** El motivo de la migración. Si se adivina el
  constructor, falló. *(Veto histórico de `PRODUCT.md`.)*
- **Fondo crema/arena/papel cálido «por elegancia».** El *tell* de IA 2026 (banda OKLCH
  L 0.84–0.97, C < 0.06, hue 40–100). El fondo es porcelana fría; la calidez la cargan voz e
  imagen. *(Regla de la Porcelana Fría.)*
- **Eyebrow en mayúsculas con tracking sobre CADA sección.** Un kicker deliberado es voz; el
  eyebrow por bloque es gramática automática. **Deuda actual concreta a saldar** (aparece en 4
  de las 6 vistas medidas). *(Regla del Eyebrow con Mesura.)*
- **Grillas de tarjetas idénticas** (ícono + título + texto, repetidas) como recurso por
  defecto. Las tarjetas se usan solo cuando son la mejor afordancia; nunca anidadas.
- **Plantilla de métrica-héroe** (número enorme + label + stats + acento en gradiente). Cliché
  de landing de SaaS.
- **Texto en gradiente** (`background-clip: text`) y **glassmorfismo decorativo**: prohibidos.
- **Franjas de acento laterales** (`border-left`/`border-right` > 1px como color). Se reescribe
  con borde completo, tinte de fondo o nada.
- **Educación = infantil/lúdico** (claymorphism, Baloo 2 / Comic Neue, azul-naranja saturado,
  mascota): la recomendación automática de `ui-ux-pro-max` para «nonprofit association
  education» — **vista y vetada**, contradice el registro académico serio.
- **Editorial-magazine por reflejo** (serif display en itálica + drop caps + grilla de
  broadsheet) como *default*. Lo editorial es **una** decisión con intención, no la coartada de
  copiar la estética saturada de 2026. Aterrizar el carácter de (a) sin caer en la *aesthetic
  lane* «editorial-typographic» que impeccable marca como segundo reflejo.

---

## d. Principios editoriales compartidos (E01–E07)

Las seis vistas (y las nueve páginas) heredan estas cuatro reglas de composición:

1. **Una acción primaria clara por viewport.** Un CTA dominante (mauveína) por pliegue; las
   acciones secundarias quedan visualmente subordinadas (contorno cobalto, peso menor). Nada de
   dos botones de acción compitiendo.
2. **Reglas hairline y blanco antes que cajas pesadas.** La separación entre secciones la hace
   el aire estructural y un divisor de 1px, no un marco con sombra. La sombra es respuesta a
   estado, no atmósfera.
3. **La tipografía carga la jerarquía antes que el color.** Primero tamaño/peso/medida deciden
   qué se lee primero; el color (cobalto, mauveína) confirma, no sustituye. Sin depender del
   color para comunicar estructura ni estado (señales siempre con glifo/texto además del color).
4. **El blanco es estructural, no relleno.** El espacio se compone con intención: separaciones
   generosas entre bloques, agrupaciones ajustadas dentro de cada bloque. La medida de prosa se
   mantiene en 65–75ch. El aire es parte del mensaje institucional, no lo que sobra.

---

## Crítica base medible (BEFORE) — nuevo listón

Corrida fresca de `/impeccable critique` (registro `brand`) sobre las seis superficies clave, a
la ambición ALTA de esta batería. Reemplaza como baseline oficial a la corrida 2026-06-15; E07
re-mide estas mismas seis para probar la elevación. Sin navegador (contenedor headless): sin
overlay; Evaluación B se apoya en `detect.mjs` (sin hallazgos reales — el único warning,
`single-font` en contacto, es falso positivo documentado). Snapshots en `.impeccable/critique/`.

| Superficie | Nielsen 0–40 | P0 | P1 | Lectura |
|------------|:---:|:--:|:--:|---------|
| `index.html` | **31** | 0 | 3 | Héroe convence; genérico bajo el pliegue (eyebrow + grilla + carrusel sin pausa). |
| `pages/sobre-achetiq.html` | **29** | 0 | 2 | La más rica; galería no descubrible + cadencia de eyebrow. |
| `pages/gabinetes.html` | **30** | 0 | 2 | La más «plantilla-neutra»: doble grilla homogénea sin jerarquía ni imagen. |
| `pages/gabinetes/eventos.html` | **30** | 0 | 1 | Plantilla de detalle anémica: texto-solo, sin imagen ni jerarquía de prosa. |
| `pages/recursos/apuntes.html` | **29** | 0 | 2 | Identidad utilitaria lograda (color por año); filtro sin feedback + sin búsqueda. |
| `pages/contacto.html` | **33** | 0 | 2 | La más pulida (a11y de formulario de referencia); `mailto` rompe expectativa. |

**Total batería: 182/240 (promedio 30,3/40 — banda «Bueno»). P0 = 0 · P1 = 12.** El sitio es
funcional y accesible; la brecha es de **carácter editorial y personalidad**, no de usabilidad
rota. Esa brecha es precisamente lo que E01–E06 elevan.

### Mapa P0/P1 → prompt que lo resuelve

| # | Severidad | Hallazgo | Superficie(s) | Resuelve |
|---|:---:|----------|---------------|:---:|
| 1 | P1 | Eyebrow en cada sección (cadencia automática) | index, sobre, gabinetes, contacto, (eventos parcial) | **E01** nace la cadencia → E02–E06 la aplican |
| 2 | P1 | Grilla de gabinetes de 4 tarjetas idénticas + poca imagen bajo el pliegue | index | **E01** |
| 3 | P1 | Carrusel del héroe sin control de pausa (WCAG 2.2.2) | index | **E01** |
| 4 | P1 | Panel «Galería» sin afordancia en página | sobre | **E03** |
| 5 | P1 | Cadencia de eyebrow + grilla de 6 valores idéntica | sobre | **E03** |
| 6 | P1 | Doble grilla homogénea (directiva + gabinetes) sin jerarquía ni imagen | gabinetes | **E04** |
| 7 | P1 | Eyebrow por sección | gabinetes | **E04** |
| 8 | P1 | Plantilla de detalle texto-solo, sin imagen ni jerarquía de prosa | eventos (y los 4 detalles) | **E04** |
| 9 | P1 | Filtro por año sin feedback de estado / región live | apuntes | **E05** |
| 10 | P1 | 41 materias sin búsqueda textual | apuntes | **E05** |
| 11 | P1 | Botón «Enviar» abre `mailto` (expectativa rota) | contacto | **E06** |
| 12 | P1 | Eyebrow por sección + tarjetas de contacto homogéneas | contacto | **E06** |

> **E02 (chrome global)** no resuelve un P1 puntual: cierra el marco compartido (navbar/footer/
> breadcrumbs) que heredan E03–E06, y porta la cadencia de eyebrow nacida en E01 a la
> navegación. **E07** re-mide las seis superficies y reporta la tendencia BEFORE→AFTER.
