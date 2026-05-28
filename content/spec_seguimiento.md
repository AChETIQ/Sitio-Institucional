# Especificación funcional — Seguimiento de Carrera (P4.4)

> Documento de especificación para la herramienta web de seguimiento académico de AChETIQ.
> Migración funcional de la planilla "Seguimiento de Carrera.xlsx" (Plan 2023, UTN FRRe — Ingeniería Química) a una página estática alojable en GitHub Pages, sin backend ni cuentas de usuario.
> Insumo estructural: `content/contentspec_seguimiento.md`.
> Alcance: especificación funcional. No incluye decisiones de implementación (selección de librerías, estructura de archivos JS, etc.).

---

## 1. Propósito y alcance

La herramienta permite a un estudiante de Ingeniería Química (Plan 2023, UTN FRRe) registrar el estado de avance académico de cada materia del plan, registrar las instancias de examen final rendidas, visualizar la disponibilidad para cursar cada materia en función de las correlatividades, y consultar un panel de indicadores agregados (KPIs) equivalente al de la planilla Excel actual.

La herramienta vive en `pages/recursos/seguimiento.html` (hija de la página hub `pages/recursos.html`), y constituye una herramienta interactiva del subdominio Recursos Académicos del sitio AChETIQ.

No es objeto de esta especificación:

- La gestión multiusuario, autenticación o cuentas.
- La sincronización entre dispositivos con respaldo en servidor.
- La actualización del plan académico (versionado del JSON del plan); ese mantenimiento es manual y queda fuera de la herramienta.

---

## 2. Decisiones de diseño consolidadas

Las decisiones que estructuran la herramienta provienen de dos rondas de validación.

**Ronda 1 (estructura):**

| Dimensión | Decisión adoptada |
|---|---|
| (a) Métricas | Réplica fiel de los nueve KPIs del Excel (ver §6). |
| (b) Carga de datos | Selector inline de estado y nota final en una pestaña principal; registro de fechas e intentos de examen en una pestaña secundaria; pestaña informativa adicional. Arquitectura de tres pestañas tipo selector de hojas de Excel (ver §3.1). |
| (c) Respaldo | Exportar/importar JSON canónico (bidireccional) y exportar CSV humano-legible (unidireccional). Persistencia primaria en `localStorage` del navegador (ver §10, §11). |
| (d) Correlatividades | Réplica fiel del Excel en vista de escritorio (columnas tabulares con badge de disponibilidad y texto de materias faltantes); vista simplificada en móvil (badge + tooltip/popover de faltantes). Ver §7, §9. |

**Ronda 2 (resoluciones puntuales sobre pendientes de redacción):** ver bitácora completa en §14. Resumen: archivo del plan confirmado como `data/plan_academico.json`; cargas horarias y correlatividades de las 41 obligatorias y las 13 electivas provistas íntegramente (§4.2); fórmula oficial del Promedio con aplazos adoptada (§6.7); paleta cromática de niveles preservada del Excel sin reinterpretación a Océano & Areia (§8.1); breakpoint móvil fijado en 1024 px (§3.2, §9); subordinación del campo manual `nota_final` a la lógica de intentos con advertencia visual (§5.1, §6.6, §8.1); backup automático local descartado en v1 y diferido (§14).

---

## 3. Arquitectura de la interfaz

### 3.1 Pestañas

La herramienta presenta tres pestañas mutuamente excluyentes, dispuestas como un selector de hojas en la parte inferior o superior del contenedor principal (análogo al selector de hojas de Excel). La pestaña activa por defecto al ingresar es `Seguimiento`. Los encabezados literales de cada pestaña (incluyendo el carácter emoji) son canónicos y deben renderizarse exactamente como se indica:

1. **`📊 SEGUIMIENTO`** — Vista principal. Contiene el dashboard de KPIs (§6) y la tabla maestra de 54 materias con sus columnas de identificación, estado editable, nota final editable, disponibilidad calculada y correlatividades.
2. **`📝 REGISTRO DE EXÁMENES FINALES`** — Vista de registro de instancias de examen final. Tabla con una fila por materia y hasta seis pares de columnas (fecha, nota) por intento. Calcula la nota final definitiva por materia y la propaga a la pestaña principal.
3. **`📝 NOTA AL ESTUDIANTE`** — Vista informativa estática. Contiene un texto explicativo sobre el uso de la herramienta, las implicancias de privacidad y portabilidad (§12), las instrucciones para exportar e importar respaldos, y la advertencia sobre la condición no oficial de los datos respecto del sistema académico de UTN FRRe.

Observación: la cadena emoji `📊` propuesta para la pestaña principal es congruente con las otras dos pestañas; si la directiva prefiere otro símbolo o texto sin emoji para esa primera pestaña, se ajusta sin impacto funcional.

La conmutación entre pestañas no recarga la página ni pierde estado. Sólo modifica la región visible.

### 3.2 Layout responsivo

La página adopta dos breakpoints funcionales:

- **Escritorio** (ancho útil ≥ 1024 px): tabla de 10 columnas visible en su totalidad, dashboard de KPIs en grilla de tres columnas en la parte superior.
- **Móvil** (ancho útil < 1024 px): tabla colapsada a las columnas esenciales (N°, Asignatura, Estado, Disponibilidad como badge); las columnas de correlatividades detalladas se ocultan por defecto y se acceden mediante tap sobre el badge de disponibilidad, que despliega un popover con la lista de materias faltantes. El dashboard se reorganiza en columna única o grilla 2×N.

El breakpoint de 1024 px queda fijado como definitivo. Su definición concreta en CSS se documenta como token (`--breakpoint-seguimiento: 1024px`) en `tokens.css` durante la Fase 2.

---

## 4. Fuente del plan académico

El plan académico (catálogo de 54 materias con sus correlatividades, niveles, cargas horarias) es **dato de la herramienta, no dato del estudiante**, y se distribuye en un archivo JSON estático versionado en el repositorio.

**Decisión confirmada (Ronda 2):** el catálogo vive en `data/plan_academico.json`. Esta nomenclatura desambigua respecto del archivo `data/recursos.json`, que organiza el contenido del hub Recursos Académicos. Se ejecuta el cambio de nombre desde la denominación original `data/recursos.json` mencionada en la Ronda 1.

### 4.1 Esquema propuesto de `data/plan_academico.json`

```
{
  "version": "2023.1",
  "plan": "Plan 2023 — Ingeniería Química — UTN FRRe",
  "total_obligatorias": 41,
  "total_electivas": 13,
  "horas_electivas_requeridas": 24,
  "materias": [
    {
      "numero": 1,
      "nombre": "Análisis Matemático I",
      "nivel": "I",
      "tipo": "obligatoria",
      "carga_horaria": 8,
      "cursadas_requeridas": [],
      "aprobadas_requeridas": []
    },
    {
      "numero": 12,
      "nombre": "...",
      "nivel": "III",
      "tipo": "obligatoria",
      "carga_horaria": 6,
      "cursadas_requeridas": [4, 5],
      "aprobadas_requeridas": [1, 2]
    }
  ]
}
```

Notas sobre el esquema:

- `numero` es el identificador estable; coincide con la columna `N°` del Excel.
- `nivel` toma valores `"I" | "II" | "III" | "IV" | "V" | "X"` (X para electivas).
- `tipo` toma valores `"obligatoria" | "electiva"`.
- `cursadas_requeridas` y `aprobadas_requeridas` son arreglos de `numero`. Reemplazan la representación textual del Excel (que es ambigua) por listas explícitas, lo que permite el cálculo programático de la disponibilidad sin parsing de texto.
- Las cargas horarias y las correlatividades canónicas de las 54 materias se proveen íntegramente en §4.2.
- El total de horas electivas requeridas (24, hardcodeado en el Excel en el cálculo de `% electivas completadas`) se expone como dato del plan para permitir su actualización futura sin tocar el código.

### 4.2 Inventario canónico del Plan 2023

Tabla maestra del Plan 2023 — Ingeniería Química — UTN FRRe. Es la fuente autoritativa para la construcción de `data/plan_academico.json`. Las cargas horarias son semanales. Cursadas req. y Aprobadas req. listan los `numero` de las materias requeridas; `—` indica ausencia de requisitos. El símbolo `Ⓞ` marca obligatorias y `Ⓔ` marca electivas.

#### Nivel I

| N° | Materia | Tipo | Hs. | Cursadas req. | Aprobadas req. |
|---|---|---|---|---|---|
| 1 | Introducción a la Ingeniería Química | Ⓞ | 3 | — | — |
| 2 | Ingeniería y Sociedad | Ⓞ | 2 | — | — |
| 3 | Álgebra y Geometría Analítica | Ⓞ | 5 | — | — |
| 4 | Análisis Matemático I | Ⓞ | 5 | — | — |
| 5 | Física I | Ⓞ | 5 | — | — |
| 6 | Química | Ⓞ | 5 | — | — |
| 7 | Sistemas de Representación | Ⓞ | 2 | — | — |
| 8 | Fundamentos de Informática | Ⓞ | 2 | — | — |

#### Nivel II

| N° | Materia | Tipo | Hs. | Cursadas req. | Aprobadas req. |
|---|---|---|---|---|---|
| 9 | Introducción a Equipos y Procesos | Ⓞ | 3 | 1, 6 | — |
| 10 | Probabilidad y Estadística | Ⓞ | 3 | 3, 4 | — |
| 11 | Química Inorgánica | Ⓞ | 4 | 6 | — |
| 12 | Análisis Matemático II | Ⓞ | 5 | 3, 4 | — |
| 13 | Física II | Ⓞ | 5 | 4, 5 | — |
| 14 | Química Orgánica | Ⓞ | 5 | 6 | — |
| 15 | Legislación | Ⓞ | 2 | 1, 2 | — |
| 40 | Inglés I | Ⓞ | 2 | — | — |

#### Nivel III

| N° | Materia | Tipo | Hs. | Cursadas req. | Aprobadas req. |
|---|---|---|---|---|---|
| 16 | Balances de Masa y Energía | Ⓞ | 3 | 6, 7, 8, 9, 13 | 1, 3, 4 |
| 17 | Termodinámica | Ⓞ | 4 | 11, 12, 13 | 4, 6 |
| 18 | Matemática Superior Aplicada | Ⓞ | 3 | 12 | 3, 4 |
| 19 | Ciencia de los Materiales | Ⓞ | 2 | 9, 11, 14 | 1, 6 |
| 20 | Fisicoquímica | Ⓞ | 4 | 9, 12, 13 | 3, 4, 6 |
| 21 | Fenómenos de Transporte | Ⓞ | 5 | 9, 12, 13 | 3, 4, 6 |
| 22 | Química Analítica | Ⓞ | 4 | 10, 11, 14 | 2, 6 |
| 23 | Microbiología y Química Biológica | Ⓞ | 3 | 11, 14 | 6 |
| 24 | Química Aplicada | Ⓞ | 2 | 9, 11, 13, 14 | 1, 2, 6, 40 |
| 41 | Inglés II | Ⓞ | 2 | 40 | — |

#### Nivel IV

| N° | Materia | Tipo | Hs. | Cursadas req. | Aprobadas req. |
|---|---|---|---|---|---|
| 25 | Diseño, simulación, optimización y seguridad de procesos | Ⓞ | 4 | 16, 18 | 7, 8, 9, 12, 41 |
| 26 | Operaciones Unitarias I | Ⓞ | 5 | 16, 17, 21 | 9, 12, 13 |
| 27 | Tecnología de la Energía Térmica | Ⓞ | 5 | 16, 17, 20, 21 | 9, 12, 13 |
| 28 | Economía | Ⓞ | 3 | 9 | 2, 3 |
| 29 | Operaciones Unitarias II | Ⓞ | 5 | 17, 20, 21 | 9, 12, 13, 14 |
| 30 | Ingeniería de las Reacciones Químicas | Ⓞ | 5 | 16, 17, 20, 21 | 11, 12, 14 |
| 31 | Calidad y Control Estadístico de Procesos | Ⓞ | 3 | 10 | 4 |
| 32 | Organización Industrial | Ⓞ | 3 | 10 | 2, 9, 15 |

#### Nivel V

| N° | Materia | Tipo | Hs. | Cursadas req. | Aprobadas req. |
|---|---|---|---|---|---|
| 33 | Control Automático de Procesos | Ⓞ | 4 | 25, 29 | 16, 18, 22 |
| 34 | Mecánica Industrial | Ⓞ | 3 | 9, 20 | 5, 11, 19 |
| 35 | Ingeniería Ambiental | Ⓞ | 3 | 24, 26, 29, 30 | 15, 16, 22 |
| 36 | Procesos Biotecnológicos | Ⓞ | 3 | 16, 20, 21, 23 | 9, 11, 14 |
| 37 | Higiene y Seguridad en el Trabajo | Ⓞ | 2 | 11, 14, 16 | 9 |
| 38 | Máquinas e Instalaciones Eléctricas | Ⓞ | 2 | 26 | 9, 13 |
| 39 | Proyecto Final | Ⓞ | 4 | 25, 26, 27, 29, 30, 32 | 16, 20, 21, 24, 28 |

#### Nivel X (Electivas)

Las electivas se enumeran con `numero` 42–54 en el orden provisto. Para la versión inicial de la herramienta no se modelan correlatividades formales en las electivas (`cursadas_requeridas` y `aprobadas_requeridas` vacíos); si en una iteración futura se confirma que alguna electiva tiene prerrequisitos institucionales, se actualiza el JSON sin cambios en el modelo de datos.

| N° | Materia | Tipo | Hs. | Cursadas req. | Aprobadas req. |
|---|---|---|---|---|---|
| 42 | Comunicación Lingüística | Ⓔ | 6 | — | — |
| 43 | Prácticas de Laboratorio | Ⓔ | 5 | — | — |
| 44 | Formación de Emprendedores | Ⓔ | 8 | — | — |
| 45 | Gestión de Recursos Humanos | Ⓔ | 5 | — | — |
| 46 | Gestión de Residuos | Ⓔ | 6 | — | — |
| 47 | Química de los Alimentos | Ⓔ | 6 | — | — |
| 48 | Administración de Negocios | Ⓔ | 5 | — | — |
| 49 | Energías Renovables | Ⓔ | 6 | — | — |
| 50 | Ingeniería de las Instalaciones | Ⓔ | 6 | — | — |
| 51 | Tecnología de los Alimentos | Ⓔ | 6 | — | — |
| 52 | Métodos Emergentes de Preservación de Alimentos | Ⓔ | 6 | — | — |
| 53 | Procedimientos y Normativas en Alimentos | Ⓔ | 6 | — | — |
| 54 | Estudios y Análisis de Procesos de Trabajo | Ⓔ | 6 | — | — |

Suma total de carga horaria semanal de electivas ofrecidas: 77 hs. Requisito de aprobación: ≥ 24 hs de electivas aprobadas (umbral del Plan 2023 que el KPI `% electivas completadas` toma como denominador).

---

## 5. Modelo de datos del estado del estudiante

### 5.1 Esquema canónico

El estado del estudiante es el único dato persistido por la herramienta. Su esquema canónico es:

```
{
  "schema_version": 1,
  "plan_version": "2023.1",
  "actualizado_en": "2026-05-28T18:42:11.000Z",
  "materias": {
    "1": {
      "estado": "Aprobada",
      "nota_final": 8,
      "intentos": [
        { "fecha": "2024-02-15", "nota": 4 },
        { "fecha": "2024-07-22", "nota": 8 }
      ]
    },
    "2": {
      "estado": "Regular",
      "nota_final": null,
      "intentos": []
    }
  }
}
```

Reglas del esquema:

- `schema_version` es un entero que se incrementa cuando cambia la estructura del estado. Permite migraciones futuras al importar respaldos antiguos.
- `plan_version` referencia la versión del plan académico bajo el cual se generó el estado; ver §10.2 para el manejo de divergencias.
- `actualizado_en` es ISO 8601 UTC.
- `materias` es un mapa cuya clave es el `numero` de materia (string) y cuyo valor es el registro de estado.
- `estado` toma uno de cuatro valores literales: `"No Cursada"`, `"Cursando"`, `"Regular"`, `"Aprobada"`. Por defecto `"No Cursada"`.
- `nota_final` es entero en 1–10, o `null` si no aplica. Es un campo de conveniencia editable manualmente desde la pestaña principal. Su rol es subordinado: si la materia tiene `intentos` registrados, la nota de referencia para los KPIs proviene de los intentos (§6.6, §6.7), no de este campo. Cuando el valor manual difiere de la nota efectiva calculada desde intentos, la interfaz muestra una advertencia visual en la fila correspondiente (§8.1).
- `intentos` es un arreglo de hasta seis objetos `{ fecha, nota }`. `fecha` en formato ISO 8601 (YYYY-MM-DD). `nota` entero en 1–10.

Una materia sin registro en `materias` se interpreta como `estado: "No Cursada"`, sin nota y sin intentos. Esto evita inflar `localStorage` con registros vacíos.

### 5.2 Estructura de claves de `localStorage`

La herramienta utiliza una sola clave en `localStorage`:

- **Clave:** `achetiq:seguimiento:estado:v1`
- **Valor:** string JSON serializado con el esquema de §5.1.

El prefijo `achetiq:` previene colisiones con otras herramientas del sitio. El sufijo `v1` permite coexistencia transitoria de esquemas durante migraciones.

### 5.3 Versionado del esquema

Si en una versión futura cambia el esquema (por ejemplo, agregando un campo `condicion_libre` por intento), se incrementa `schema_version` en el código, y al cargar un estado con `schema_version` inferior la herramienta ejecuta una rutina de migración interna sin pérdida de datos. La rutina de migración no es parte de esta especificación funcional.

---

## 6. Lógica de cálculo de KPIs

Se replican los nueve KPIs del Excel. Las fórmulas se expresan en notación natural sobre el estado del estudiante (§5) y el plan académico (§4). Donde corresponde se preserva la inconsistencia de rangos del Excel original (algunos KPIs cuentan sólo obligatorias, otros incluyen electivas), porque la decisión de Ronda 1 es réplica fiel.

Nomenclatura usada en las fórmulas:

- `M_obl` = conjunto de materias obligatorias del plan (`tipo === "obligatoria"`, 41 elementos).
- `M_ele` = conjunto de materias electivas (`tipo === "electiva"`, 13 elementos).
- `estado(m)` = estado registrado de la materia `m` (o `"No Cursada"` por defecto).
- `nota(m)` = nota final efectiva de la materia `m` (definida en §6.6).
- `ch(m)` = carga horaria de la materia `m`.
- `H_req` = horas electivas requeridas (24).

### 6.1 Aprobadas (incluye electivas)

Definición: cantidad total de materias con estado `"Aprobada"`, considerando obligatorias y electivas.

Fórmula: `Aprobadas = |{ m ∈ M_obl ∪ M_ele : estado(m) = "Aprobada" }|`.

Equivalente Excel: `COUNTIF(F12:F64,"Aprobada")` (celda A5).

### 6.2 Avance (% sobre 41 obligatorias)

Definición: fracción de materias obligatorias aprobadas, expresada como porcentaje. Las electivas no participan del numerador ni del denominador.

Fórmula: `Avance = |{ m ∈ M_obl : estado(m) = "Aprobada" }| / 41`.

Presentación: porcentaje con un decimal (`xx,x %`).

Equivalente Excel: `IFERROR(COUNTIF(F12:F52,"Aprobada")/41, 0)` (celda C5).

### 6.3 No Cursadas / Cursando (sólo obligatorias)

Definición: cantidad de materias obligatorias con estado `"No Cursada"` más las que tienen estado `"Cursando"`. Mide el "pendiente activo" en obligatorias.

Fórmula: `NoCursadasCursando = |{ m ∈ M_obl : estado(m) ∈ {"No Cursada", "Cursando"} }|`.

Equivalente Excel: `COUNTIF(F12:F52,"No Cursada") + COUNTIF(F12:F52,"Cursando")` (celda E5).

### 6.4 Disponibles para cursar (sólo obligatorias)

Definición: cantidad de materias obligatorias cuya disponibilidad calculada (§7) es `"Disponible"`, es decir, no han sido cursadas/aprobadas y cumplen todas sus correlatividades.

Fórmula: `Disponibles = |{ m ∈ M_obl : disponibilidad(m) = "Disponible" }|`.

Equivalente Excel: `COUNTIF(H12:H52,"✅ Disponible")` (celda A7).

### 6.5 Regulares (incluye electivas)

Definición: cantidad de materias con estado `"Regular"`, considerando obligatorias y electivas.

Fórmula: `Regulares = |{ m ∈ M_obl ∪ M_ele : estado(m) = "Regular" }|`.

Equivalente Excel: `COUNTIF(F12:F64,"Regular")` (celda E7).

### 6.6 Promedio sin aplazos

Definición: promedio aritmético de la nota final efectiva por materia, considerando únicamente las materias cuya nota efectiva es ≥ 6. Mide el rendimiento "limpio", sin penalización por aplazos.

La nota final efectiva por materia `m`, notada `nota_ef(m)`, se construye según el siguiente orden de prioridad:

1. Si la materia tiene intentos registrados (`intentos(m) ≠ ∅`), `nota_ef(m)` = nota del último intento cuya nota es ≥ 6 (orden cronológico por `fecha`). Si ningún intento alcanza 6, `nota_ef(m)` queda indefinida y la materia no participa.
2. Si la materia no tiene intentos pero está marcada como `"Aprobada"` y se cargó manualmente `nota_final ≥ 6`, `nota_ef(m)` = `nota_final`. Este escenario cubre las aprobaciones por promoción directa registradas sin examen final.
3. En cualquier otro caso, `nota_ef(m)` queda indefinida.

Fórmula: `PromSinAplazos = mean({ nota_ef(m) : m ∈ M_obl ∪ M_ele, nota_ef(m) ≥ 6 })`.

Si el conjunto es vacío, el KPI muestra el carácter `"—"` (en lugar de un cero engañoso). Esta convención replica el `IFERROR(..., "—")` del Excel.

Equivalente Excel: `IFERROR(AVERAGEIF(G12:G64, ">="&6), "—")` (celda G5). En el Excel, la columna G de `Seguimiento` es eco de `Finales!E`, por lo que las materias sin intentos no contribuyen al promedio. En la herramienta web se admite adicionalmente la nota manual para materias aprobadas por promoción sin intentos cargados, con el fin de no penalizar al estudiante que no carga registros formales de examen.

### 6.7 Promedio con aplazos

Definición: promedio aritmético sobre **todas las notas individuales de intentos de examen final** registradas en la hoja `Notas Finales`, contando los aplazos como notas reales. Cada intento cargado es un punto de dato; si una materia se rindió tres veces (4, 4, 8), las tres notas participan del promedio.

Fórmula oficial confirmada (replica literal de la celda G7 del Excel):

```
PromConAplazos = PROMEDIO(Finales!G:G; Finales!I:I; Finales!K:K; Finales!M:M; Finales!O:O; Finales!Q:Q)
```

En notación del modelo de datos web (§5.1):

```
PromConAplazos = mean({ intento.nota : m ∈ M_obl ∪ M_ele, intento ∈ intentos(m) })
```

Si el conjunto es vacío (ningún intento cargado en ninguna materia), el KPI muestra `"—"`.

Consecuencias semánticas a explicitar:

1. Las materias aprobadas por promoción que tienen únicamente `nota_final` manual cargada (sin intentos) **no contribuyen a este promedio**. La fórmula oficial sólo agrega valores presentes en las seis columnas de notas de `Finales`.
2. Un estudiante que desee que su nota de promoción cuente en el promedio con aplazos debe registrarla como un intento con la fecha correspondiente en la pestaña `📝 REGISTRO DE EXÁMENES FINALES`.
3. Cada intento desaprobado (nota < 6) pesa lo mismo que un intento aprobado en el promedio.

Esta asimetría con respecto al Promedio sin aplazos (§6.6, que sí admite `nota_final` manual para materias sin intentos) es deliberada y preserva la semántica del Excel original.

### 6.8 Horas electivas aprobadas

Definición: suma de la carga horaria de las materias electivas con estado `"Aprobada"`.

Fórmula: `HsElectivasAprobadas = Σ ch(m), m ∈ M_ele, estado(m) = "Aprobada"`.

Equivalente Excel: `SUMPRODUCT((F53:F65="Aprobada") * J53:J65)` (celda I5).

### 6.9 Porcentaje de electivas completadas

Definición: fracción de horas electivas aprobadas sobre el total de horas electivas requeridas (24).

Fórmula: `PorcElectivas = HsElectivasAprobadas / H_req`.

Presentación: porcentaje con un decimal. Se permite superar 100 % si el estudiante aprueba más horas que las requeridas.

Equivalente Excel: `IFERROR(SUMPRODUCT((F53:F65="Aprobada") * J53:J65) / 24, 0)` (celda I7).

### 6.10 Tabla resumen de KPIs

| KPI | Sobre | Materias contadas | Presentación |
|---|---|---|---|
| Aprobadas | conteo | obligatorias + electivas | entero |
| Avance | porcentaje | sólo obligatorias (41) | xx,x % |
| No Cursadas/Cursando | conteo | sólo obligatorias | entero |
| Disponibles | conteo | sólo obligatorias | entero |
| Regulares | conteo | obligatorias + electivas | entero |
| Prom. sin aplazos | promedio | notas finales ≥ 6 (obl. + elect.) | x,xx o "—" |
| Prom. con aplazos | promedio | todos los intentos (obl. + elect.) | x,xx o "—" |
| Hs. electivas aprobadas | suma | sólo electivas Aprobadas | entero (hs) |
| % electivas completadas | porcentaje | electivas aprobadas / 24 hs | xx,x % |

---

## 7. Lógica de cálculo de disponibilidad (correlatividades)

### 7.1 Algoritmo

Para cada materia `m` del plan, la herramienta calcula su disponibilidad observable en la columna `Disponible` de la pestaña `Seguimiento`. El cálculo se realiza en tiempo real ante cualquier cambio de estado, sin persistirse (es derivable del estado).

El algoritmo es:

1. Si `estado(m) = "Aprobada"`, devolver `"Aprobada"`.
2. Si `estado(m) = "Regular"`, devolver `"Regular"`.
3. Si `estado(m) = "Cursando"`, devolver `"Cursando"`.
4. Si `estado(m) = "No Cursada"`:
   1. Sea `C` el conjunto `cursadas_requeridas(m)`. Si existe `c ∈ C` tal que `estado(c) ∉ {"Regular", "Aprobada"}`, devolver `"No Disponible"`.
   2. Sea `A` el conjunto `aprobadas_requeridas(m)`. Si existe `a ∈ A` tal que `estado(a) ≠ "Aprobada"`, devolver `"No Disponible"`.
   3. Si ambos conjuntos se satisfacen, devolver `"Disponible"`.

Los cinco valores resultantes (`"Aprobada"`, `"Regular"`, `"Cursando"`, `"Disponible"`, `"No Disponible"`) se renderizan en la columna con el ícono y el color correspondiente al estado, replicando la columna `H DISPONIBLE` del Excel.

### 7.2 Texto generado para "Materias faltantes"

La columna `Materias faltantes` del Excel (columna I) replica una lista textual. La herramienta la regenera por cálculo en cada render, con la siguiente lógica:

1. Si la disponibilidad es `"Aprobada"`, `"Regular"` o `"Cursando"`, mostrar `"—"`.
2. Si la disponibilidad es `"Disponible"`, mostrar `"Sin faltantes"`.
3. Si la disponibilidad es `"No Disponible"`, construir una cadena que liste cada materia requerida no satisfecha, con su número y nombre, indicando si falta cursarla o aprobarla. Formato propuesto:

   `"3-Análisis Matemático II (cursar); 5-Química General (aprobar);"`

   El orden es ascendente por `numero`. El delimitador es `"; "`. La cadena termina con `";"`.

En la vista de escritorio se muestra completa en la columna. En la vista móvil se accede al texto desde el popover gatillado por el badge de disponibilidad.

---

## 8. Interacciones detalladas

### 8.1 Pestaña `📊 SEGUIMIENTO`

Disposición:

- Encabezado con el título canónico `📊 SEGUIMIENTO` y, debajo, dashboard de los nueve KPIs (§6) en grilla de tres columnas (escritorio) o columna única / grilla 2×N (móvil).
- Tabla maestra con 54 filas, una por materia, agrupadas visualmente por nivel (I → V → X). El nivel se delimita con un borde horizontal grueso del color de acento del nivel y filas alternadas con tono del nivel.

**Paleta cromática por nivel (preservada del Excel original sin reinterpretación):**

| Nivel | Fondo alternado | Color de acento (borde, badges) | Color de texto destacado |
|---|---|---|---|
| I | `#FFFFFF` / `#EFF6FF` | `#3B82F6` (azul) | `#2563EB` |
| II | `#FFFFFF` / `#F5F3FF` | `#8B5CF6` (violeta) | `#7C3AED` |
| III | `#FFFFFF` / `#E2F6F4` | `#14B8A6` (verde-agua) | `#0D9488` |
| IV | `#FFFFFF` / `#FFFBEB` | `#F59E0B` (ámbar) | `#D97706` |
| V | `#FFFFFF` / `#FEF2F2` | `#EF4444` (rojo) | `#DC2626` |
| X (Electivas) | `#FFFFFF` / `#EEF2FF` | `#6366F1` (índigo) | `#4F46E5` |

Esta paleta es **constitutiva de la herramienta** y convive con la paleta general Océano & Areia del sitio sólo en este contexto. Se documenta como un conjunto de variables CSS dedicadas (por ejemplo, `--nivel-i-accent`, `--nivel-i-fondo-alt`, etc.) en `tokens.css` o en un archivo de tokens auxiliar específico de la herramienta. El resto de la página (encabezados, botones de acciones globales, navegación de pestañas, paneles informativos) sigue utilizando los tokens generales del sitio.

Columnas de la tabla (escritorio):

| Col | Encabezado | Contenido |
|---|---|---|
| 1 | N° | número de materia, no editable. |
| 2 | Nivel | romano, no editable. |
| 3 | Asignatura | nombre, no editable. |
| 4 | Cursadas req. | lista de números separados por coma, no editable. |
| 5 | Aprobadas req. | lista de números separados por coma, no editable. |
| 6 | Estado | dropdown con cuatro opciones; editable. |
| 7 | Nota final | input numérico 1–10 o vacío; editable. |
| 8 | Disponible | badge calculado (no editable); ver §7. |
| 9 | Materias faltantes | texto generado (no editable); ver §7.2. |
| 10 | Carga horaria | entero, no editable. |

Interacciones:

- **Cambio de estado:** al modificar el dropdown de una fila, se actualiza el estado en memoria, se recalculan los nueve KPIs y se recalcula la columna `Disponible` para todas las filas (porque un cambio puede liberar o bloquear correlativas). El estado se persiste a `localStorage` con debounce (por ejemplo, 300 ms) para evitar escrituras excesivas.
- **Cambio de nota final manual:** al ingresar una nota válida (entero 1–10) en el campo manual de la fila, se persiste en `materias[N].nota_final` y se recalculan los promedios. El campo manual es de naturaleza secundaria: si la materia tiene intentos registrados en `📝 REGISTRO DE EXÁMENES FINALES`, la nota efectiva la determina §6.6 a partir de los intentos. Cuando el valor manual difiere de la nota efectiva calculada, la UI muestra una advertencia visual no bloqueante en la fila (ícono Lucide `alert-triangle` color ámbar en el costado del campo, con tooltip explicativo: "El valor manual no coincide con la última nota aprobatoria registrada en los intentos."). El cálculo de los KPIs siempre prevalece sobre el valor manual.
- **Validación:** valores fuera de 1–10 se rechazan con feedback visual; estados fuera del enum no son seleccionables.
- **Reordenamiento, filtrado y ordenamiento:** no son parte de v1; las filas se muestran siempre en el orden canónico del plan (por número, agrupadas por nivel).

### 8.2 Pestaña `📝 REGISTRO DE EXÁMENES FINALES`

Disposición:

- Título canónico de la pestaña: `📝 REGISTRO DE EXÁMENES FINALES`.
- Tabla con 54 filas, una por materia. Columnas: N°, Nivel, Asignatura, Estado (eco de la pestaña principal, no editable aquí), Nota final calculada (no editable), seis pares de columnas (Fecha 1º, 1º Nota, Fecha 2º, 2º Nota, …, Fecha 6º, 6º Nota).

Interacciones:

- Cada par fecha/nota es editable. Las fechas se ingresan con un selector de fecha nativo o equivalente accesible. Las notas se validan en 1–10.
- Al ingresar un par válido, se actualiza el arreglo `intentos` de la materia correspondiente en el estado, y se recalcula la nota final efectiva (§6.6), el promedio sin aplazos (§6.6) y el promedio con aplazos (§6.7).
- Los intentos vacíos (fecha sin nota o nota sin fecha) se rechazan con feedback visual.
- Encabezado informativo bajo el título: "Se aprueba con 6. Máximo 4 instancias en condición regular; las instancias 5° y 6° aplican a casos excepcionales (libres o por reválida)." Texto sujeto a confirmación institucional definitiva (ver §14, ítem residual de bibliografía institucional).

### 8.3 Pestaña `📝 NOTA AL ESTUDIANTE`

Título canónico de la pestaña: `📝 NOTA AL ESTUDIANTE`.

Disposición: contenido estático en prosa, no interactivo. Estructura sugerida:

1. Bienvenida y propósito de la herramienta (analogía con la planilla Excel).
2. Aclaración sobre la condición no oficial: la herramienta no se conecta con el SysAdmin/SysAcad de UTN FRRe; el estado de las materias debe ser cargado y mantenido por el estudiante, y la fuente oficial sigue siendo el sistema académico de la universidad.
3. Resumen de privacidad: los datos viven exclusivamente en este navegador; AChETIQ no los recibe (ver §12).
4. Instrucciones de respaldo: cómo exportar, dónde guardar el archivo, cómo importarlo en otro dispositivo (ver §11).
5. Advertencias: borrado de caché, modo incógnito, cambio de navegador, formateo del equipo (cualquier escenario que limpie `localStorage` elimina los datos sin recuperación).

El contenido textual completo se redacta en una sesión de copy posterior.

### 8.4 Acciones globales

La barra de acciones (ubicada idealmente en el encabezado de la herramienta, persistente entre pestañas) contiene tres botones:

- **Exportar respaldo** — abre un selector de formato (JSON o CSV) y descarga el archivo correspondiente (§11).
- **Importar respaldo** — abre un selector de archivo limitado a JSON; al cargar uno válido, reemplaza el estado actual con confirmación previa (modal de advertencia: "Esto sobrescribirá tu progreso actual. ¿Continuar?").
- **Reiniciar progreso** — elimina la clave de `localStorage` previa confirmación de doble paso (modal con campo de texto que requiere escribir la palabra `REINICIAR` para habilitar el botón). Restaura el estado a vacío.

---

## 9. Comportamiento responsivo de las correlatividades

En escritorio se muestran las cuatro columnas de correlatividades (4 Cursadas req., 5 Aprobadas req., 8 Disponible, 9 Materias faltantes), replicando el Excel.

En móvil:

- Las columnas 4, 5 y 9 se ocultan por defecto.
- La columna 8 (Disponible) permanece como badge.
- Al hacer tap sobre el badge, se despliega un popover anclado a la fila con el contenido textual de "Materias faltantes" (§7.2) y, opcionalmente, las listas Cursadas req. y Aprobadas req. originales.
- El popover se cierra al tocar fuera de él o al cambiar de fila.

El criterio para activar el modo móvil es ancho de viewport < 1024 px. Este umbral queda fijado como definitivo y se documenta como variable CSS (`--breakpoint-seguimiento: 1024px`) en la Fase 2.

---

## 10. Estrategia de almacenamiento local

### 10.1 localStorage

La herramienta utiliza `localStorage` del navegador como única fuente de verdad del estado del estudiante. La clave canónica es `achetiq:seguimiento:estado:v1` (§5.2). El estado se lee al cargar la página y se persiste tras cada modificación con debounce.

`localStorage` es síncrono, persistente entre sesiones del navegador, y aislado por origen (esquema + dominio + puerto). En el dominio definitivo de AChETIQ (a confirmar; ver `project_achetiq.md`), la herramienta tendrá su propio espacio. La capacidad típica es de 5 MB por origen, muy por encima del tamaño esperado del estado (< 50 KB incluso con seis intentos por materia en las 54 materias).

### 10.2 Comportamiento ante cambios en el plan académico

Si una versión futura del sitio actualiza `data/plan_academico.json` (por ejemplo, agrega una nueva materia electiva o corrige una correlatividad), el estado local del estudiante puede quedar parcialmente desactualizado. La herramienta reconcilia así:

1. Al cargar el estado, compara `plan_version` del estado contra `version` del plan académico cargado.
2. Si coinciden, se carga normalmente.
3. Si difieren, se muestra un aviso no bloqueante: "Tu progreso fue creado con la versión X del plan; ahora estás viendo la versión Y. Los datos se conservaron y se mostrarán contra el plan actual; revisá las materias nuevas o modificadas."
4. Las materias presentes en el estado pero ausentes del plan actual se conservan en el JSON pero no se renderizan; al importar/exportar mantienen su lugar.
5. Las materias presentes en el plan pero ausentes en el estado se inicializan como `"No Cursada"`.

---

## 11. Estrategia de exportar/importar

### 11.1 Exportar JSON (canónico, reimportable)

- **Disparador:** botón Exportar respaldo, opción "JSON".
- **Contenido:** serialización exacta del estado vigente, con esquema §5.1. Se incluye `schema_version`, `plan_version` y `actualizado_en`.
- **Nombre de archivo sugerido:** `achetiq-seguimiento-YYYYMMDD.json` (fecha local del usuario).
- **Comportamiento:** descarga inmediata mediante `Blob` y un anchor de un solo uso. No requiere conexión a internet.

### 11.2 Importar JSON

- **Disparador:** botón Importar respaldo.
- **Aceptación:** archivos `.json` exclusivamente.
- **Validación:**
   1. Parse del JSON. Si falla, error.
   2. Verificación de campos obligatorios (`schema_version`, `materias`). Si faltan, error.
   3. Verificación de tipos (estados dentro del enum, notas en 1–10, fechas ISO válidas).
   4. Verificación de versión: si `schema_version` del archivo es mayor que la actual del código, advertir que el archivo proviene de una versión más nueva; ofrecer importar de todos modos con pérdida potencial de campos desconocidos.
- **Confirmación previa:** modal "¿Reemplazar el progreso actual con el del archivo? Esta acción no se puede deshacer."
- **Efecto:** sobrescribe la clave de `localStorage`, recarga el estado, recalcula KPIs y disponibilidades.

### 11.3 Exportar CSV (sólo lectura)

- **Disparador:** botón Exportar respaldo, opción "CSV".
- **Contenido:** tabla derivada del estado. Una fila por materia. Columnas: N°, Nivel, Asignatura, Estado, Nota final, Disponible, Cursadas req., Aprobadas req., Carga horaria. Opcionalmente, una segunda hoja (o un archivo aparte) con los intentos: N°, Asignatura, Intento, Fecha, Nota.
- **Codificación:** UTF-8 con BOM (para compatibilidad con Excel en sistemas Windows que pueden malinterpretar acentos sin BOM).
- **Separador:** coma (`,`). Las cadenas se entrecomillan cuando contienen comas o saltos de línea.
- **Nombre de archivo sugerido:** `achetiq-seguimiento-YYYYMMDD.csv`.
- **Reimportable:** no. El CSV es estrictamente para consulta humana, impresión o auditoría externa.

---

## 12. Privacidad, portabilidad y limitaciones

Se enumeran explícitamente para inclusión literal en la pestaña `Nota al Estudiante` y en la documentación del sitio:

1. **Privacidad estricta del dispositivo.** El estado académico cargado en esta herramienta se guarda exclusivamente en el navegador del dispositivo desde el cual se ingresa. No se transmite a ningún servidor; AChETIQ no recibe, almacena ni puede acceder a esta información. No es necesario crear una cuenta para usar la herramienta.

2. **Aislamiento por navegador y dispositivo.** Cada navegador (Chrome, Firefox, Safari, etc.) y cada dispositivo (PC, notebook, teléfono, tablet) mantiene su propio almacenamiento aislado. Cargar el progreso en una PC no lo hace visible en el teléfono, ni viceversa.

3. **Aislamiento por modo de navegación.** El modo incógnito o privado no persiste datos: cualquier información cargada en una pestaña incógnito se pierde al cerrarla.

4. **Riesgo de pérdida por limpieza de almacenamiento.** Borrar el caché del navegador, limpiar los datos del sitio, desinstalar el navegador, formatear el equipo o cualquier acción que elimine `localStorage` del dominio de AChETIQ destruye el progreso sin recuperación posible desde el sitio.

5. **Mitigación: respaldo manual.** Se recomienda exportar el estado a JSON periódicamente y guardar el archivo en un lugar seguro (almacenamiento en la nube personal, correo a uno mismo, pendrive). El archivo JSON es la única forma de migrar el progreso entre dispositivos o de recuperarlo tras una pérdida.

6. **Condición no oficial.** Esta herramienta es de uso personal y voluntario. No reemplaza el sistema académico oficial de UTN FRRe; los datos cargados no se sincronizan con el legajo oficial del estudiante y no tienen validez administrativa.

---

## 13. Criterios de aceptación

Una implementación de la herramienta se considera aceptable si y sólo si:

1. La página `pages/recursos/seguimiento.html` carga sin errores en los navegadores soportados por el sitio AChETIQ (definidos en Fase 2).
2. El catálogo de 54 materias se renderiza correctamente desde `data/plan_academico.json` con todos los campos del esquema §4.1.
3. Las tres pestañas (`Seguimiento`, `Notas Finales`, `Nota al Estudiante`) son navegables y mantienen estado entre cambios.
4. Los nueve KPIs del dashboard se calculan en tiempo real y coinciden, para el mismo dataset, con los valores que produce la planilla Excel original. Se valida con un conjunto de prueba de al menos tres estados distintos (vacío, mitad de carrera con varias condiciones mezcladas, fin de carrera).
5. La columna de disponibilidad se recalcula correctamente al cambiar el estado de cualquier materia, sin requerir recarga de la página.
6. El texto de "Materias faltantes" se genera correctamente para todas las materias con disponibilidad "No Disponible".
7. El estado se persiste en `localStorage` y sobrevive a recargas y a cierre/reapertura del navegador en el mismo dispositivo.
8. La función Exportar JSON genera un archivo descargable con el esquema §5.1 válido.
9. La función Importar JSON acepta el archivo exportado por la propia herramienta y restaura el estado idénticamente.
10. La función Exportar CSV genera un archivo legible en Excel/LibreOffice/Google Sheets sin pérdida de caracteres acentuados.
11. La vista móvil oculta las columnas de correlatividades detalladas y presenta el popover de materias faltantes al tocar el badge de disponibilidad.
12. La función Reiniciar progreso requiere doble confirmación y deja el estado en `localStorage` ausente o equivalente a vacío.
13. La pestaña `Nota al Estudiante` declara las seis limitaciones de §12 con texto canónico.
14. La carga inicial con `localStorage` vacío no produce errores y muestra los 54 estados como "No Cursada" con KPIs en cero o "—" según corresponda.

---

## 14. Bitácora de resoluciones y extensiones diferidas

Los diez puntos abiertos identificados en la redacción inicial fueron resueltos en Ronda 2. Se documentan a continuación para trazabilidad.

### 14.1 Resoluciones aplicadas

| # | Punto original | Resolución | Sección donde se aplicó |
|---|---|---|---|
| 1 | Nombre del archivo del plan académico | Confirmado `data/plan_academico.json`; ejecutar renombrado desde `data/recursos.json` | §4 |
| 2 | Cargas horarias por materia | Provistas íntegramente para las 41 obligatorias y las 13 electivas (horas semanales) | §4.2 |
| 3 | Listas de correlatividades por materia | Provistas íntegramente para las 41 obligatorias como arreglos de `numero`; las electivas no presentan correlatividades formales en v1 | §4.2 |
| 4 | Fórmula exacta del Promedio con aplazos | Adoptada la fórmula oficial `=PROMEDIO(Finales!G:G; Finales!I:I; Finales!K:K; Finales!M:M; Finales!O:O; Finales!Q:Q)` y explicitadas sus consecuencias semánticas | §6.7 |
| 5 | Encabezado de la pestaña de finales | Cadena canónica fijada: `📝 REGISTRO DE EXÁMENES FINALES` | §3.1, §8.2 |
| 6 | Encabezado de la pestaña de nota al estudiante | Cadena canónica fijada: `📝 NOTA AL ESTUDIANTE` | §3.1, §8.3 |
| 7 | Paleta cromática de niveles | Preservada estrictamente del Excel original (azul, violeta, verde-agua, ámbar, rojo, índigo) sin reinterpretación a Océano & Areia; convive con la paleta general del sitio sólo dentro de esta herramienta | §8.1 |
| 8 | Breakpoint del modo móvil | Fijado en 1024 px y documentado como variable CSS dedicada | §3.2, §9 |
| 9 | Conflicto entre nota manual y intentos | Adoptada la subordinación del campo manual a la lógica automática derivada de intentos, con advertencia visual no bloqueante (`alert-triangle` ámbar + tooltip) | §5.1, §6.6, §6.7, §8.1 |
| 10 | Backup automático local | Descartado para v1; queda diferido como extensión futura (§14.2) | §14.2 |

### 14.2 Extensiones diferidas a versiones posteriores

1. **Backup automático local.** Posible extensión futura: el sistema podría guardar de forma transparente las últimas N exportaciones (por ejemplo, N = 5) en una sub-clave separada de `localStorage` (por ejemplo, `achetiq:seguimiento:backups:v1`), rotándolas en cola FIFO. La interfaz expondría una sección "Restaurar respaldo automático" con una lista de timestamps; la restauración requeriría confirmación de doble paso análoga al reinicio. Provee protección contra borrados accidentales del estado principal por el propio estudiante, pero no contra limpieza completa del `localStorage` por el navegador. No incluido en v1.

2. **Correlatividades en electivas.** Si en una iteración futura se confirma que alguna materia electiva tiene prerrequisitos institucionales (cursadas o aprobadas), basta con poblar los campos `cursadas_requeridas` y `aprobadas_requeridas` correspondientes en `data/plan_academico.json`; el motor de cálculo de disponibilidad (§7) ya soporta correlatividades en electivas sin modificación.

3. **Filtros y ordenamientos en la tabla principal.** No previstos en v1. Una v1.1 podría incorporar filtros por estado, por nivel o por disponibilidad, y ordenamiento por columnas.

4. **Visualización en grafo de correlatividades.** Descartada para v1 en favor de la réplica tabular fiel. Podría incorporarse en una iteración avanzada con el inventario canónico de §4.2 como insumo directo.

5. **Sincronización entre dispositivos.** Fuera del alcance del sitio estático. Cualquier sincronización requeriría backend (descartado por la arquitectura GitHub Pages). El mecanismo de exportar/importar JSON (§11) cubre la necesidad de manera manual.

### 14.3 Pendientes residuales menores (no bloqueantes)

1. **Confirmación institucional del texto del encabezado informativo de la pestaña de finales** (la cadena `"Se aprueba con 6. Máximo 4 instancias..."`) ante la directiva de AChETIQ para garantizar exactitud reglamentaria.
2. **Redacción definitiva del cuerpo de la pestaña `📝 NOTA AL ESTUDIANTE`**, conforme la estructura sugerida en §8.3.
3. **Validación del cálculo de KPIs contra un dataset real**: replicar tres estados de avance distintos en la planilla Excel y en la herramienta web tras la implementación, contrastando cada KPI numéricamente como parte del criterio de aceptación §13.4.
