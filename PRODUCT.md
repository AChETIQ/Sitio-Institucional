# Product

> Documento estratégico (el "quién / qué / por qué"). El "cómo se ve" vive en `DESIGN.md`.
> Encabezados en inglés por compatibilidad con las herramientas de impeccable (`context.mjs`
> lee la sección `## Register`); la prosa va en español para respetar el registro es-AR del proyecto.

## Register

brand

<!-- Sitio institucional de una asociación: el diseño ES parte del producto. La primera
     impresión del visitante (estudiante, ingresante, par institucional) es lo que se está
     fabricando. Por eso el registro es `brand`, no `product`, aunque haya módulos utilitarios
     (formulario de contacto, filtro de apuntes). -->

## Users

**Primaria:** estudiantes activos de la carrera de Ingeniería Química en UTN FRRe (Resistencia,
Chaco). Llegan al sitio desde el celular, entre cursadas, buscando algo concreto: apuntes de una
materia, la carpeta de Drive de un congreso, el correo para sumarse a un gabinete. Tienen poca
paciencia para la ceremonia y reconocen al instante una plantilla genérica.

**Secundaria:** aspirantes e ingresantes (evalúan si la carrera y la vida estudiantil valen la
pena), docentes, otras asociaciones estudiantiles, FeNEIQ, ANEIQA y empresas del sector. Para esta
audiencia el sitio funciona como carta de presentación institucional: tiene que transmitir seriedad
y trayectoria (la asociación existe desde 2009, con antecedentes en 2003).

**Trabajo a resolver:** "Quiero entender qué es AChETIQ y acceder rápido a lo que la asociación me
ofrece (recursos, gabinetes, contacto), con la confianza de estar ante una institución real y no
ante una plantilla de Wix."

## Product Purpose

Migrar el sitio institucional de AChETIQ desde Wix a una plataforma propia (HTML/CSS/JS puro sobre
GitHub Pages) que cumpla tres metas: (1) recuperar control técnico y editorial; (2) proyectar una
identidad visual profesional, moderna y **deliberadamente diferenciada de la estética de plantilla
comercial**; (3) servir como plataforma de utilidad real para los estudiantes (recursos académicos
por materia, información de gabinetes, archivo de actividades, canales de contacto).

El éxito se mide en dos planos: **funcional** (un estudiante encuentra los apuntes de su materia o
el contacto de un gabinete en menos de un minuto, también sin JavaScript) e **identitario** (un par
institucional percibe una asociación seria y con voz propia; nadie diría "esto lo hizo una IA con
una plantilla").

## Brand Personality

**Tres palabras:** instrumental, riguroso, cálido-con-mesura.

- **Voz:** formal académico de alto nivel. Precisión técnica y claridad antes que entusiasmo. Sin
  signos de exclamación en el sitio, sin emojis, sin frases de relleno ("en el mundo de hoy", "es
  importante destacar"), sin anglicismos cuando existe la forma castellana.
- **Tono:** tercera persona en textos institucionales; **voseo rioplatense** en los CTA y los
  mensajes orientados al estudiante ("sumate", "conocé", "escribinos"). La calidez se admite, pero
  contenida: una institución que respeta a su lector, no una marca que lo corteja.
- **Metáfora de marca:** doble linaje químico. El **cobalto** (pigmento inorgánico histórico) como
  color estructural; la **mauveína** (Perkin, 1856 — partida de nacimiento de la química orgánica
  sintética) como color exclusivo de acción. La identidad cuenta una historia disciplinar, no
  decora.
- **Emociones a evocar:** confianza, pertenencia, precisión. Que el estudiante sienta que la
  asociación es suya y que está bien hecha.

## Anti-references

Lo que el sitio NO debe parecer, por nombre:

- **Plantilla de Wix / constructor comercial.** El motivo central de la migración. Hero genérico,
  secciones intercambiables, "diseño de stock". Si se puede adivinar el constructor, falló.
- **Landing de SaaS 2024.** El template de métrica-héroe (número enorme + label + stats + acento en
  gradiente), las grillas de tarjetas idénticas (ícono + título + texto, repetidas al infinito), el
  *eyebrow* en mayúsculas y tracking sobre cada sección como gramática automática.
- **"Educación = infantil/lúdico".** El reflejo de catálogo (clay/burbujas, Baloo 2 / Comic Neue,
  azul-y-naranja saturado, mascota) es exactamente lo contrario a una asociación universitaria
  seria. Queda **explícitamente vetado** (ver `design-system/MASTER.md`).
- **Editorial-magazine por defecto.** Serif display en itálica + drop caps + grilla de broadsheet
  sobre un brief que no es una revista. Es una sola línea estética, no la línea por defecto del
  registro brand.
- **Fondo crema/arena cálido** como neutro "elegante". La identidad usa porcelana fría (grafito),
  no el beige saturado que delata la generación por IA de 2026.

## Design Principles

1. **La identidad cuenta química, no decora.** Cada decisión cromática y tipográfica se justifica
   en la disciplina (cobalto/mauveína, precisión instrumental). El color es voz, no relleno.
2. **Diferenciarse de la plantilla es el requisito, no el adorno.** "Promedio" equivale a invisible
   y traiciona el motivo de la migración. La distinción se gana con un punto de vista, no con
   efectos.
3. **Accesibilidad y robustez como identidad, no como checklist.** El sitio funciona sin
   JavaScript, documenta cada ratio WCAG y trata el foco, los estados vacíos y los errores como
   parte del diseño. La seriedad institucional se demuestra en los bordes, no solo en el héroe.
4. **El usuario decide; la herramienta propone y verifica.** Toda elección con margen se ofrece como
   opciones. Nunca se inventan datos institucionales (nombres, fechas, cargos, eventos).
5. **Utilidad real antes que vitrina.** Un estudiante con una tarea concreta (apuntes, gabinete,
   contacto) la completa rápido y desde el celular. La belleza no puede costar funcionalidad.

## Accessibility & Inclusion

- **Objetivo:** WCAG 2.2 nivel AA como piso; varios pares texto/fondo ya alcanzan AAA y están
  documentados con su ratio calculado (no estimado) en `tokens.css`.
- HTML semántico, *skip-link* al contenido principal, foco visible con anillo tokenizado, jerarquía
  de encabezados secuencial, `alt` en imágenes informativas y `alt=""` en decorativas.
- **Señal de error no cromática:** los errores de formulario combinan borde engrosado + glifo +
  mensaje, además del color, para no depender del color solo.
- **`prefers-reduced-motion`** es obligatorio: toda animación necesita su alternativa de movimiento
  reducido (la clase `safe-motion` ya lo contempla).
- **Sin JavaScript** el sitio sigue siendo navegable y legible: cada bloque dinámico tiene su
  `<noscript>` espejo del JSON.
- Idioma `es-AR` declarado; comillas, fechas (DD/MM/AAAA) y unidades SI siguen la convención
  rioplatense.
