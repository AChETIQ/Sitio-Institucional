# Solicitud de Contenido — Sitio Web AChETIQ
*Documento de trabajo para la recopilación de contenido — Fase 0/1*

---

## Cómo cargar el contenido

| Tipo de contenido | Cómo proporcionarlo |
|---|---|
| **Texto corrido** (historia, misión, descripciones) | Escribirlo o pegarlo directamente en el chat |
| **Datos estructurados** (directiva, gabinetes, recursos) | Completar los templates JSON de este documento y pegarlo en el chat |
| **Imágenes** (logo, fotos, banners) | Subir directamente al chat (PNG, JPG, SVG) |
| **PDFs** (estatuto, apuntes) | Subir directamente al chat |
| **Links** (redes sociales, bibliografía) | Pegar la URL en el chat |

> Los items marcados con ⭐ son **bloqueantes**: sin ellos no se puede avanzar en el desarrollo de esa sección. Los marcados con 🔲 son necesarios pero pueden incorporarse en iteraciones posteriores.

---

## BLOQUE 1 — Identidad Institucional

### 1.1 Logo ⭐
Proporcionar el logo oficial de AChETIQ. Formatos aceptados, en orden de preferencia:
- SVG (ideal — escalable sin pérdida de calidad)
- PNG con fondo transparente, mínimo 500×500 px
- Si no existe versión digital, describir los elementos visuales del logo para recrearlo

**Cómo cargarlo:** Subir el archivo directamente al chat.

---

### 1.2 Misión y Visión ⭐
Texto institucional de la asociación. Si no existe versión redactada, puedo redactarla a partir de una descripción oral.

**Template:**
```
MISIÓN (qué hace AChETIQ, para quién, cómo):
[texto aquí]

VISIÓN (hacia dónde apunta la asociación a futuro):
[texto aquí]
```

---

### 1.3 Historia de AChETIQ 🔲
Reseña histórica de la asociación: año de fundación, hitos principales, evolución.
Longitud sugerida: 400–600 palabras. Puede ser un borrador que luego se eleva.

**Cómo cargarlo:** Texto en el chat o subir un .txt / .docx

---

### 1.4 Redes Sociales y Contacto ⭐
```
Email institucional:
Instagram (URL completa):
Facebook (URL completa):
WhatsApp / grupo de difusión (opcional):
Otras redes (LinkedIn, Twitter/X, YouTube, etc.):
Dirección de la Facultad (para la sección Contacto):
```

---

## BLOQUE 2 — Comisión Directiva

### 2.1 Integrantes ⭐
Completar para cada miembro:

```json
[
  {
    "nombre": "Nombre Apellido",
    "cargo": "Presidente",
    "foto": "nombre-apellido.jpg"
  },
  {
    "nombre": "Nombre Apellido",
    "cargo": "Vicepresidente",
    "foto": "nombre-apellido.jpg"
  }
]
```
*(Repetir el bloque `{}` por cada integrante. Si no hay foto disponible, poner `"foto": null`)*

### 2.2 Fotos de directiva 🔲
Subir una foto por integrante. Nombre de archivo sugerido: `nombre-apellido.jpg`. 
Formato: JPG o PNG, mínimo 300×300 px, cuadrada o recortable a cuadrado.

---

## BLOQUE 3 — Gabinetes

### 3.1 Listado de gabinetes activos ⭐
```json
[
  {
    "id": "gabinete-academico",
    "nombre": "Gabinete Académico",
    "descripcion_corta": "Una oración que resume el objetivo del gabinete.",
    "descripcion_completa": "Párrafo de 100-200 palabras describiendo objetivos, actividades y enfoque.",
    "integrantes": ["Nombre Apellido", "Nombre Apellido"],
    "proyectos_activos": ["Nombre del proyecto o iniciativa"]
  }
]
```
*(Repetir el bloque `{}` por cada gabinete)*

---

## BLOQUE 4 — Recursos Académicos

### 4.1 Plan de estudios 🔲
El plan de estudios vigente de la carrera, para organizar los recursos por año y materia.
**Cómo cargarlo:** Subir el PDF o pegar el listado de materias en el chat.

### 4.2 Archivos de recursos ⭐ (para lanzar la sección)
Para cada materia que tenga material disponible, completar:
```json
[
  {
    "materia": "Química General",
    "año_carrera": 1,
    "archivos": [
      {
        "nombre": "Guía de Ejercicios Unidad 1",
        "tipo": "PDF",
        "archivo": "quimica-general-guia-u1.pdf"
      }
    ],
    "bibliografia": [
      "Chang, R. (2010). Química. 10.ª ed. McGraw-Hill.",
      "Atkins, P. (2018). Química General. 10.ª ed. Oxford."
    ],
    "links_externos": [
      {
        "titulo": "Khan Academy — Química",
        "url": "https://es.khanacademy.org/science/chemistry"
      }
    ]
  }
]
```
**Archivos:** Subir los PDFs/DOCX directamente al chat.

---

## BLOQUE 5 — Noticias y Actividades

### 5.1 Noticias pasadas para migrar 🔲
Si hay noticias del sitio Wix que se quieran conservar, proporcionar para cada una:
```
TÍTULO:
FECHA:
TEXTO:
IMAGEN (subir archivo o indicar si hay una):
```

### 5.2 Próximas actividades 🔲
```json
[
  {
    "titulo": "Nombre del evento",
    "fecha": "2026-06-15",
    "hora": "18:00",
    "lugar": "Aula X, Facultad de ...",
    "descripcion": "Descripción breve del evento.",
    "imagen": "nombre-archivo.jpg"
  }
]
```

---

## BLOQUE 6 — Galería

### 6.1 Álbumes fotográficos 🔲
Por cada álbum que se quiera incluir:
```
NOMBRE DEL ÁLBUM:
FECHA DEL EVENTO:
DESCRIPCIÓN (opcional):
FOTOS: [subir archivos al chat]
```
Formato recomendado: JPG, máximo 2MB por foto. Subir en tandas si hay muchas.

---

## BLOQUE 7 — Imagen Institucional

### 7.1 Imagen para el Hero (banner principal) 🔲
Foto o imagen de alta calidad para el banner principal de la página de inicio.
Puede ser: foto de un evento, de la facultad, de integrantes trabajando, o una imagen abstracta relacionada con la química.
**Formato:** JPG/PNG, horizontal (landscape), mínimo 1200×600 px.

---

## BLOQUE 8 — Estatuto

### 8.1 Estatuto vigente 🔲
Documento PDF del estatuto oficial de la asociación para ofrecer como descarga.
**Cómo cargarlo:** Subir el PDF al chat.

---

## Estado del inventario

| Bloque | Sección | Estado | Prioridad |
|---|---|---|---|
| 1 | Logo | ✅ Recibido — SVG en `img/logo/achetiq-logo.svg` (2026-05-08) + 2 variantes PNG | ⭐ Bloqueante |
| 1 | Misión y visión | ✅ Recibida — en `content/mision_vision.txt` (incluye valores y objetivos) | ⭐ Bloqueante |
| 1 | Historia | ✅ Recibida — depurada en `content/historia.txt` | Media |
| 1 | Redes y contacto | ✅ Completo — Instagram, email, dirección, web UTN FRRe en `data/redes.json` | ⭐ Bloqueante |
| — | Instituciones vinculadas | ✅ UTN FRRe + ANEIQA en `data/instituciones.json` (logos PNG recibidos, a copiar a `img/institucional/`) | — |
| 2 | Comisión directiva (datos) | ✅ Recibida — en `data/directiva.json` (fotos pendientes) | ⭐ Bloqueante |
| 2 | Fotos directiva | 🔲 Pendiente | Media |
| 3 | Gabinetes | ✅ Recibidos — 4 gabinetes en `data/gabinetes.json` | ⭐ Bloqueante |
| 4 | Plan de estudios | 🔲 Pendiente | Media |
| 4 | Archivos de recursos | 🔲 Pendiente | ⭐ Para lanzar sección |
| 5 | Noticias pasadas | 🔲 Pendiente | Baja |
| 5 | Próximas actividades | 🔲 Pendiente | Media |
| 6 | Galería | 🔲 Pendiente | Baja |
| 7 | Imagen hero | 🔲 Pendiente | Media |
| 8 | Estatuto PDF | ✅ en `docs/Estatuto.pdf` (6.7 MB) — enlace en "Sobre AChETIQ" | Baja |
| 8 | Reglamento de Sanciones | ✅ en `docs/Reglamento_Sanciones.pdf` (92 KB) — enlace en "Sobre AChETIQ" | Baja |
| 4 | Diseño Curricular IQ | ✅ en `docs/Disenio_Curricular_IQ.pdf` (2.1 MB) — enlace en "Recursos" | Media |

---

*AChETIQ — Proyecto Web 2026*
