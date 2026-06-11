#!/usr/bin/env node
/**
 * build:css — genera el bundle CSS de producción (assets/css/main.bundle.css).
 *
 * Problema que resuelve (S6 — rendimiento):
 *   main.css encadena ~16 hojas vía @import. El navegador descubre cada
 *   import recién cuando descarga la hoja padre: una cascada SERIALIZADA y
 *   render-blocking de dos niveles (HTML → main.css → 16 hojas). GitHub
 *   Pages no permite server push ni headers, así que la única salida es
 *   entregar el CSS ya aplanado.
 *
 * Qué hace:
 *   1. Lee tokens.css (raíz) — las páginas lo enlazaban primero, por lo que
 *      abre el bundle para preservar el orden de cascada exacto.
 *   2. Lee assets/css/main.css y resuelve su cadena @import EN EL ORDEN
 *      DECLARADO (semántica @import: las hojas importadas preceden a las
 *      reglas propias del archivo importador).
 *   3. Concatena: tokens.css → hojas importadas → resto de main.css, y
 *      elimina comentarios y líneas en blanco (minificación conservadora:
 *      no reescribe selectores ni valores — cero riesgo de cascada).
 *   4. Escribe assets/css/main.bundle.css (ARTEFACTO GENERADO: no editar a
 *      mano; regenerar con `npm run build` y commitear — GitHub Pages sirve
 *      el repo tal cual, sin pipeline de build).
 *
 * La estructura modular (tokens.css + 18 hojas en assets/css/) sigue siendo
 * la fuente de verdad para desarrollo; main.css conserva la lista @import
 * como única definición del orden. Este script NO mantiene una lista
 * propia: la parsea de main.css, de modo que agregar una hoja nueva sigue
 * siendo «añadir su @import en main.css §1» + `npm run build`.
 *
 * Sin dependencias externas. Determinista e idempotente.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CSS_DIR = join(ROOT, "assets", "css");
const ENTRY = join(CSS_DIR, "main.css");
const TOKENS = join(ROOT, "tokens.css");
const OUT = join(CSS_DIR, "main.bundle.css");

/** Elimina comentarios /* … *​/ respetando strings ('…' y "…"). */
function stripComments(css) {
  let out = "";
  let i = 0;
  while (i < css.length) {
    const ch = css[i];
    if (ch === "/" && css[i + 1] === "*") {
      const end = css.indexOf("*/", i + 2);
      i = end === -1 ? css.length : end + 2;
      continue;
    }
    if (ch === '"' || ch === "'") {
      const quote = ch;
      out += ch;
      i++;
      while (i < css.length && css[i] !== quote) {
        out += css[i];
        if (css[i] === "\\") {
          out += css[i + 1] ?? "";
          i++;
        }
        i++;
      }
      out += css[i] ?? "";
      i++;
      continue;
    }
    out += ch;
    i++;
  }
  return out;
}

/** Quita indentación y líneas en blanco (CSS ignora whitespace entre tokens;
    los strings no abarcan más de una línea, así que recortar bordes de línea
    es seguro). Deja una regla por línea: compacto y legible en DevTools. */
function collapseBlankLines(css) {
  return css
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l !== "")
    .join("\n");
}

function clean(css) {
  return collapseBlankLines(stripComments(css));
}

// ── 1. Parsear la cadena @import de main.css (orden declarado) ──
const entryRaw = readFileSync(ENTRY, "utf8");
const entryNoComments = stripComments(entryRaw);
const IMPORT_RE = /@import\s+url\(\s*['"]?([^'")]+)['"]?\s*\)\s*;/g;
const imports = [...entryNoComments.matchAll(IMPORT_RE)].map((m) => m[1]);

if (imports.length === 0) {
  console.error("build:css — no se encontró ningún @import en main.css; abortando.");
  process.exit(1);
}

// ── 2. Concatenar en orden de cascada ──
const parts = [];

parts.push(`/* ============================================================
   AChETIQ — Bundle CSS de producción (GENERADO — NO EDITAR)
   Regenerar con: npm run build  (scripts/build-css.mjs)
   Contenido, en orden de cascada:
     tokens.css → ${imports.join(" → ")} → main.css
   ============================================================ */`);

parts.push(clean(readFileSync(TOKENS, "utf8")));

for (const rel of imports) {
  // Las hojas importadas viven junto a main.css; el bundle también, por lo
  // que sus url() relativos (../fonts/…) siguen siendo válidos sin reescritura.
  parts.push(clean(readFileSync(join(CSS_DIR, rel), "utf8")));
}

parts.push(clean(entryNoComments.replace(IMPORT_RE, "")));

const bundle = parts.join("\n");
writeFileSync(OUT, bundle);

const kb = (n) => (n / 1024).toFixed(1) + " KB";
const srcBytes =
  readFileSync(TOKENS, "utf8").length +
  entryRaw.length +
  imports.reduce((acc, rel) => acc + readFileSync(join(CSS_DIR, rel), "utf8").length, 0);
console.log(
  `build:css — ${imports.length} hojas + tokens.css + main.css → assets/css/main.bundle.css` +
  ` (${kb(srcBytes)} fuente → ${kb(bundle.length)} bundle)`
);
