# Análisis Visual del Logo de AChETIQ
*Documento de referencia para Fase 1 — Diseño Visual*
*Generado a partir del logo oficial provisto el 2026-05-08*

---

## Componentes del logo

El logo está compuesto por cuatro elementos visuales superpuestos:

1. **Grilla 3×3** — conjunto de seis rectángulos/cuadrados en gris claro, dispuestos en una cuadrícula de 3 columnas × 2 filas (fila superior completa, fila inferior con los dos primeros cuadros). Los bordes de la grilla son de color negro, con relleno gris claro. La posición es centrada-superior en la composición.

2. **Tipografía script "achetiq"** — nombre de la asociación en estilo caligráfico/manuscrito, color negro, superpuesto sobre la grilla de forma diagonal descendente de izquierda a derecha. La tipografía es de trazo libre, similar a una firma cursiva.

3. **Dos líneas diagonales** — aparecen debajo del texto "achetiq", ligeramente inclinadas, a modo de subrayado dinámico. Una línea en **verde oliva** (encima) y otra en **naranja** (debajo), de trazo orgánico/irregular que refuerza el carácter artesanal del logo.

4. **Cuadrado azul redondeado** — elemento flotante en la esquina inferior derecha, de color azul claro con bordes redondeados, ligeramente rotado. Actúa como contrapunto visual y rompe la grilla rectangular.

---

## Paleta de colores extraída del logo

*Valores verificados contra el archivo fuente SVG (recibido 2026-05-08, `img/logo/achetiq-logo.svg`).*

| Elemento | Color | Hex verificado | Uso |
|---|---|---|---|
| Grilla — relleno principal | Gris medio neutro | `#A3A6AA` | Elemento estructural |
| Grilla — detalle secundario | Gris claro neutro | `#B6B9BD` | Sombreado/detalles |
| Tipografía y bordes de grilla | Negro puro | `#000000` | Texto e isotipo |
| Cuadrado flotante | Azul claro grisáceo | `#77A8C9` | Acento institucional |
| Línea oblicua superior | Verde oliva oscuro | `#758346` | Acento 1 |
| Línea oblicua inferior | Naranja ámbar | `#DF8642` | Acento 2 |
| Fondo (versión circular) | Blanco | `#FFFFFF` | Background |
| Fondo (versión cuadrada) | Negro | `#000000` | Background alternativo |

> Los valores listados son los exactos definidos en el SVG. La paleta del sitio (`tokens.css` — Océano & Areia) no replica directamente estos colores: los tokens de sitio fueron seleccionados para garantizar contrastes WCAG AA y coherencia institucional, mientras que los del logo se mantienen como **identidad de marca pura**, reservados al propio isotipo.

---

## Variantes disponibles

| Variante | Descripción | Uso recomendado |
|---|---|---|
| Circular (fondo blanco) | Logo recortado en círculo sobre fondo blanco | Favicon, avatar de redes sociales, header sobre fondo claro |
| Cuadrada (fondo negro) | Logo completo sobre fondo negro | Fondo oscuro, presentaciones, redes en modo oscuro |

---

## Implicancias para el diseño web (Fase 1)

- La paleta del logo define los **colores primarios del sitio**: el azul (`#7AB0D4`) como color institucional principal, y el verde oliva/naranja como acentos secundarios.
- El carácter **manuscrito/artesanal** del logotipo sugiere un diseño web que equilibre profesionalismo institucional con cercanía estudiantil — sin caer en frialdad corporativa ni en informalidad excesiva.
- La **grilla 3×3** es un motivo visual aprovechable como elemento decorativo en el diseño de la interfaz (por ejemplo, como patrón de fondo sutil o separador de secciones).
- Para el **favicon**, usar la versión circular recortada o generar una versión simplificada con solo el cuadrado azul y las iniciales "A".
- Se recomienda solicitar o recrear el logo en formato **SVG** para uso en el sitio, ya que permite escalado sin pérdida de calidad y ajuste de colores vía CSS.

---

## Archivos de logo a incluir en el repositorio

| Archivo | Descripción | Estado |
|---|---|---|
| `img/logo/achetiq-logo-circular.png` | Versión circular, fondo blanco | ✅ Recibido (a copiar manualmente) |
| `img/logo/achetiq-logo-cuadrado.png` | Versión cuadrada, fondo negro | ✅ Recibido (a copiar manualmente) |
| `img/logo/achetiq-logo.svg` | Versión vectorial — fuente primaria | ✅ Recibido 2026-05-08 (4000×4000, 45 KB) |
| `img/logo/achetiq-logo.original.svg` | Backup del SVG original | ✅ Generado 2026-05-08 |
| `img/logo/favicon.ico` | Favicon 32×32 px | 🔲 Pendiente — generar desde SVG |
| `img/logo/favicon.svg` | Favicon vectorial moderno | 🔲 Pendiente — extraer del logo |
| `img/logo/achetiq-logo.min.svg` | SVG optimizado vía SVGO | 🔲 Opcional — reduce tamaño ~50% |

---

## Logos de instituciones vinculadas

### UTN FRRe
Logo oficial de la Universidad Tecnológica Nacional Facultad Regional Resistencia. Versión recibida: horizontal, sobre fondo negro/oscuro. Contiene el isotipo UTN (símbolo en negro) y el texto "UNIVERSIDAD TECNOLÓGICA NACIONAL / FACULTAD REGIONAL / RESISTENCIA".
- Archivo a guardar: `img/institucional/utn-frre-logo.png`
- Uso en sitio: footer, página "Sobre AChETIQ"

### ANEIQA
Logo de la Asociación Nacional de Estudiantes de Ingeniería Química y en Alimentos. Ícono de matraz combinado con engranaje, en degradado púrpura-cyan sobre fondo negro.
- Colores: púrpura (~`#7B3FBF`) y cyan/azul eléctrico (~`#00BFFF`)
- Archivo a guardar: `img/institucional/aneiqa-logo.png`
- Uso en sitio: footer, página "Sobre AChETIQ"

> Nota: ambos logos fueron recibidos como PNG con fondo negro. Para uso sobre fondos claros puede ser necesario solicitar versiones con fondo transparente.

---

*AChETIQ — Documento interno de diseño — 2026*
