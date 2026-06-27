#!/usr/bin/env node
/**
 * build:csp — inyecta la Content-Security-Policy como <meta http-equiv>.
 *
 * GitHub Pages no permite cabeceras HTTP propias, así que la ÚNICA CSP que el
 * navegador aplica en producción es la entregada vía <meta http-equiv> en el
 * documento. Este script escribe esa etiqueta «in place» en el <head> de cada
 * página servida y de la plantilla, dentro de una región marcada e idempotente
 * (igual patrón que build-jsonld.mjs).
 *
 * UBICACIÓN: la <meta> CSP se inserta JUSTO DESPUÉS de <meta name="viewport">,
 * antes de cualquier <link>/<style>/<script>. Una <meta> CSP sólo gobierna los
 * recursos que aparecen DESPUÉS de ella en el documento; por eso va al tope del
 * <head>.
 *
 * POLÍTICA (única fuente de verdad: la constante CSP de abajo). Verificada en
 * modo report-only contra las 12 páginas servidas (0 violaciones), incluyendo
 * el round-trip de exportación a Excel de seguimiento.html. Cada directiva está
 * justificada en prompts/optimization/reports/security.md.
 *
 * LÍMITES DE LA <meta> CSP (documentados, no ocultados):
 *   · `frame-ancestors`  → IGNORADA en <meta> (sólo cabecera). Va en la config
 *     portable (_headers), no aquí, para no emitir un warning inerte en consola.
 *   · `report-uri`/`report-to`, sandbox de documento → también sólo-cabecera.
 *   · HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy y
 *     Permissions-Policy NO se pueden fijar en Pages por ningún medio.
 *   Ver _headers (config portable) para el set completo «enforced later».
 *
 * Sin dependencias externas. Determinista e idempotente.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

/* ── Política (única fuente de verdad) ──────────────────────────────────
   default-src 'self'  fallback restrictivo para todo lo no listado.
   base-uri 'self'     impide secuestrar URLs relativas con <base>.
   object-src 'none'   sin <object>/<embed>/<applet> (vector legado de XSS).
   script-src 'self'   sólo JS de mismo origen; sin 'unsafe-inline' ni
                       'unsafe-eval'. Los <script type="application/ld+json">
                       son bloques de DATOS, exentos de script-src. xlsx-populate
                       es autoalojado y no requiere 'unsafe-eval' (verificado).
   style-src 'self'    sin 'unsafe-inline': el sitio no tiene <style>/style=
                       embebidos (refactorizados a clases/hojas externas).
   img-src 'self'      imágenes de mismo origen; el sitio no usa data: URIs.
   font-src 'self'     WOFF2 autoalojadas (sin Google Fonts/CDN).
   connect-src 'self'  fetch/XHR sólo a mismo origen (partials, JSON, plantilla).
   frame-src https://www.google.com  único iframe de terceros: el mapa de Maps.
   form-action 'self'  destino de envío de formularios acotado a mismo origen.
   upgrade-insecure-requests  defensa pasiva: promueve cualquier subrecurso http
                       a https (el sitio ya es 100% https; no-op de seguridad).
   ─────────────────────────────────────────────────────────────────────── */
const CSP = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "script-src 'self'",
  "style-src 'self'",
  "img-src 'self'",
  "font-src 'self'",
  "connect-src 'self'",
  "frame-src https://www.google.com",
  "form-action 'self'",
  "upgrade-insecure-requests",
].join("; ");

/* ── región marcada ─────────────────────────────────────────────────── */
const BEGIN = "<!-- SEC:CSP — generado por scripts/build-csp.mjs · no editar a mano -->";
const END = "<!-- /SEC:CSP -->";
const REGION = /[ \t]*<!-- SEC:CSP[\s\S]*?<!-- \/SEC:CSP -->\n?/;
const AFTER_VIEWPORT = /(<meta\s+name="viewport"[^>]*>\n)/;

function block() {
  return (
    `  ${BEGIN}\n` +
    `  <meta http-equiv="Content-Security-Policy" content="${CSP}">\n` +
    `  ${END}\n`
  );
}

/** Inserta/reemplaza la región. Idempotente. */
function inject(html) {
  const region = block();
  if (REGION.test(html)) return html.replace(REGION, region);
  if (AFTER_VIEWPORT.test(html)) return html.replace(AFTER_VIEWPORT, `$1${region}`);
  // Respaldo: si no hay viewport, insertar tras la apertura de <head>.
  return html.replace(/(<head>\s*\n)/, `$1${region}`);
}

/** Todos los .html bajo `dir`, recursivo y ordenado (salida determinista). */
function walkHtml(dir) {
  const out = [];
  for (const entry of readdirSync(dir).sort()) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walkHtml(full));
    else if (entry.endsWith(".html")) out.push(full);
  }
  return out;
}

/* ── ejecución ──────────────────────────────────────────────────────── */
// Todas las páginas servidas (incluida 404.html: la seguridad también aplica)
// más la plantilla, para que cada página nueva nazca con la CSP.
const files = [
  join(ROOT, "index.html"),
  join(ROOT, "404.html"),
  ...walkHtml(join(ROOT, "pages")),
  join(ROOT, "partials", "_boilerplate.html"),
];

let updated = 0;
console.log("build:csp — Content-Security-Policy (<meta http-equiv>)");
for (const file of files) {
  const before = readFileSync(file, "utf8");
  const after = inject(before);
  const label = relative(ROOT, file).split(sep).join("/");
  if (after !== before) {
    writeFileSync(file, after);
    updated++;
    console.log(`  updated  ${label}`);
  } else {
    console.log(`  ok       ${label}`);
  }
}
console.log(`Done. ${updated} file(s) updated, ${files.length} scanned.`);
