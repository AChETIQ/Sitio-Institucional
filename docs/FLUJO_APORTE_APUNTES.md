# Flujo de aporte y publicación de apuntes

> Documento operativo del modelo de apuntes por materia. Pensado para
> integrarse en `GUIA_COLABORADORES.md` (Fase 7, P7.1) y en la referencia
> de datos `data/README.md` (P7.2). Registro de la decisión: Apéndice C
> de `PLAN_MAESTRO_FASES_3-7.md` (2026-05-29).

## Modelo adoptado

El material de estudio no se aloja dentro del sitio. Cada materia del Plan
2023 tiene asociada una **carpeta de Google Drive institucional**, y la
tarjeta de la materia en la página de Apuntes enlaza directamente a esa
carpeta. La página solo guarda el enlace, no los archivos.

Esto mantiene el repositorio liviano, permite que la curaduría la haga
cualquier integrante de la comisión con acceso al Drive (sin tocar código)
y separa el contenido académico —que cambia seguido— del sitio.

No existe `data/apuntes.json` ni una subpágina por materia. La única fuente
de verdad es el campo `drive_url` de cada materia en `data/recursos.json`.

## Cómo se asocia una carpeta a una materia

En `data/recursos.json`, cada materia es un objeto con cuatro campos:

```json
{
  "id": "termodinamica",
  "nombre": "Termodinámica",
  "anio": 3,
  "drive_url": "https://drive.google.com/drive/folders/XXXXXXXX"
}
```

- `drive_url` con una URL válida → la tarjeta se vuelve un enlace que abre
  la carpeta en una pestaña nueva, con la leyenda **«Abrir carpeta»**.
- `drive_url` vacío (`""`) → la tarjeta queda no interactiva y muestra
  **«Carpeta no disponible»**.

Para publicar el material de una materia, basta con pegar el enlace de su
carpeta de Drive en `drive_url`. Para despublicarla, se vuelve a dejar `""`.

**Reglas de oro al editar `recursos.json`:** respetar las comillas dobles,
no borrar las comas entre campos, no dejar una coma después del último
campo, y pegar la URL completa (debe empezar con `https://`). Cualquier
otra cosa que no empiece con `https://` se ignora por seguridad y la
tarjeta cae a «Carpeta no disponible».

### Permisos de la carpeta

La carpeta de Drive debe estar compartida en modo **«Cualquier persona con
el enlace: Lector»**, para que el material sea accesible sin pedir acceso.
Conviene revisar periódicamente que los enlaces sigan vivos (los permisos
o las carpetas pueden cambiar).

## Flujo de contribución de material

1. **Envío.** Quien quiera aportar material escribe a
   `achetiq.resistencia+apuntes@aneiqa.org` con el asunto
   **«Envío de material académico»**, indicando la materia y adjuntando
   o enlazando el archivo. (Este es el mecanismo que figura en la sección
   «¿Querés aportar material?» de la página de Apuntes; el correo y el
   asunto están escritos de forma literal en el HTML para que funcionen
   aun con JavaScript deshabilitado.)
2. **Curaduría.** La comisión revisa el material: pertinencia, calidad,
   ausencia de contenido indebido y acreditación del autor original.
3. **Publicación.** El material aprobado se sube a la carpeta de Drive de
   la materia correspondiente. Si la materia todavía no tenía carpeta, se
   crea, se comparte como «Lector con enlace» y se pega su URL en el campo
   `drive_url` de esa materia en `data/recursos.json`.
4. **Verificación.** Se comprueba que la tarjeta de la materia muestre
   «Abrir carpeta» y que el enlace abra la carpeta correcta.

## Accesibilidad del enlace

Cada tarjeta enlazada se marca como enlace externo: abre en pestaña nueva
con `target="_blank"` y `rel="noopener noreferrer"`, lleva una etiqueta
accesible que nombra la materia y advierte «se abre en una pestaña nueva»,
e incluye un ícono de enlace externo decorativo. Las tarjetas sin carpeta
no son interactivas y comunican su estado por texto, sin depender del color.
