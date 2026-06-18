#!/usr/bin/env node
/**
 * build:urls — inyecta la URL base centralizada en los metadatos sociales.
 *
 * Aplica `BASE_URL` (site.config.mjs) a las etiquetas og:url, og:image y
 * twitter:image de las páginas HTML servidas (index.html, 404.html y todo
 * pages/**), además de mantener sincronizada la imagen social de la plantilla
 * partials/_boilerplate.html.
 *
 * Diseño — reescritura idempotente «in place»:
 *   El sitio se sirve tal cual desde GitHub Pages (sin paso de build), por lo
 *   que el HTML versionado conserva URLs absolutas REALES y este script las
 *   regenera desde una sola variable. Como los scrapers sociales (WhatsApp,
 *   LinkedIn, X…) no ejecutan JavaScript, las URLs deben existir ya resueltas
 *   en el HTML entregado; por eso se reescriben en disco, no en el cliente.
 *
 * Migración de dominio (cambio de una sola línea):
 *   1. Editar BASE_URL en site.config.mjs.
 *   2. Ejecutar `npm run build:urls`.
 *   3. Commitear el HTML regenerado.
 *
 * Sin dependencias externas. Idempotente: ejecutarlo dos veces no cambia nada.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { BASE_URL } from "../site.config.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

// Logo social compartido por todas las páginas (ruta absoluta del sitio).
// Imagen Open Graph global 1200×630 (logo AChETIQ centrado sobre fondo blanco).
const IMAGE_PATH = "/assets/img/og-image-achetiq.png";

// BASE_URL normalizada sin barra final, para componer rutas sin dobles barras.
const baseUrl = BASE_URL.replace(/\/+$/, "");

/** Devuelve todos los .html bajo `dir`, de forma recursiva. */
function walkHtml(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walkHtml(full));
    else if (entry.endsWith(".html")) out.push(full);
  }
  return out;
}

/** Ruta absoluta de archivo → URL canónica del sitio (BASE_URL + ruta web). */
function siteUrlFor(absPath) {
  const rel = relative(ROOT, absPath).split(sep).join("/");
  return rel === "index.html" ? `${baseUrl}/` : `${baseUrl}/${rel}`;
}

/**
 * Reemplaza el `content` de una etiqueta <meta> concreta, si existe.
 * `selector` es el par atributo="valor" identificador, p. ej. `property="og:url"`.
 */
function setMetaContent(html, selector, newContent) {
  const re = new RegExp(`(<meta\\s+${selector}\\s+content=")[^"]*(")`, "g");
  return html.replace(re, `$1${newContent}$2`);
}

/** Páginas reales servidas: reciben og:url + og:image + twitter:image. */
const pageFiles = [
  join(ROOT, "index.html"),
  join(ROOT, "404.html"),
  ...walkHtml(join(ROOT, "pages")),
];

/** Plantilla: solo se sincroniza la imagen social (su og:url es un placeholder). */
const templateFiles = [join(ROOT, "partials", "_boilerplate.html")];

let scanned = 0;
let updated = 0;

function rewrite(file, { withUrl }) {
  scanned++;
  const before = readFileSync(file, "utf8");
  let after = before;
  if (withUrl) {
    after = setMetaContent(after, 'property="og:url"', siteUrlFor(file));
  }
  after = setMetaContent(after, 'property="og:image"', `${baseUrl}${IMAGE_PATH}`);
  after = setMetaContent(after, 'name="twitter:image"', `${baseUrl}${IMAGE_PATH}`);

  const label = relative(ROOT, file).split(sep).join("/");
  if (after !== before) {
    writeFileSync(file, after);
    updated++;
    console.log(`  updated  ${label}`);
  } else {
    console.log(`  ok       ${label}`);
  }
}

console.log(`build:urls — BASE_URL = ${baseUrl}`);
for (const f of pageFiles) rewrite(f, { withUrl: true });
for (const f of templateFiles) rewrite(f, { withUrl: false });
console.log(`Done. ${updated} file(s) updated, ${scanned} scanned.`);
