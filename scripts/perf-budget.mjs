#!/usr/bin/env node
/**
 * perf-budget.mjs — guarda de presupuesto de bytes (S03 — rendimiento).
 *
 * Verifica, de forma determinista y sin servidor, que el peso de los
 * activos que cada página entrega siga dentro del presupuesto fijado en
 * RENDIMIENTO_Presupuesto.md. Está pensado para correr en local y como
 * gate de CI (06-ci-integration): sale con código ≠ 0 si algún umbral se
 * supera, e imprime una tabla Markdown del estado.
 *
 *   node scripts/perf-budget.mjs            # verifica y reporta
 *   node scripts/perf-budget.mjs --md       # sólo la tabla Markdown
 *
 * MÉTRICA. El presupuesto se define sobre bytes COMPRIMIDOS (gzip -9),
 * porque es lo que GitHub Pages entrega (gzip/brotli). El peso «plano»
 * no representa la transferencia real y por eso no se presupuesta.
 *
 * QUÉ MIDE, por página:
 *   · CSS render-blocking — toda hoja en <link rel="stylesheet"> del <head>
 *     (el bundle + la hoja de página si existe). Es la ruta crítica que
 *     bloquea el primer pintado.
 *   · JS inicial — todo <script src> MÁS el grafo de <link rel="modulepreload">
 *     (los módulos que el navegador descarga para el arranque). No incluye
 *     módulos cargados perezosamente vía import() dinámico.
 *
 * Sin dependencias externas. Determinista e idempotente.
 */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { join, dirname, resolve, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const MD_ONLY = process.argv.includes("--md");

/* ── Presupuesto (única fuente de verdad; reconciliado con
      RENDIMIENTO_Presupuesto.md §1). Bytes comprimidos. ──────────────── */
const KB = 1024;
const BUDGET = {
  // CSS de ruta crítica por página (bundle + hoja de página). El presupuesto
  // histórico fija «CSS total < 75 KB gzip»; lo mantenemos como techo.
  cssPerPageGzip: 75 * KB,
  // JS inicial por página (scripts + modulepreload). Umbral nuevo de S03:
  // holgado sobre el peor caso real (seguimiento ~40 KB) para detectar
  // regresiones estructurales sin penalizar el estado actual.
  jsPerPageGzip: 50 * KB,
};

/* ── Utilidades ──────────────────────────────────────────────────────── */
const gz = (file) => gzipSync(readFileSync(file), { level: 9 }).length;
const kb = (n) => (n / KB).toFixed(1);
const rel = (p) => relative(ROOT, p).split(sep).join("/");

/** Todos los .html servibles (raíz + pages/, excluye partials/_*). */
function htmlPages(dir, out = []) {
  for (const entry of readdirSync(dir).sort()) {
    if (entry === "node_modules" || entry === ".git") continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (full === join(ROOT, "partials") || full === join(ROOT, "prompts")) continue;
      htmlPages(full, out);
    } else if (entry.endsWith(".html")) {
      out.push(full);
    }
  }
  return out;
}

/** Resuelve una ruta relativa de la página a un archivo del repo; descarta
    URLs absolutas/externas (http(s)://, //, data:). */
function resolveLocal(htmlFile, ref) {
  if (/^(https?:)?\/\//i.test(ref) || ref.startsWith("data:")) return null;
  const clean = ref.split("?")[0].split("#")[0];
  const abs = resolve(dirname(htmlFile), clean);
  return existsSync(abs) ? abs : null;
}

function extractAssets(htmlFile) {
  const html = readFileSync(htmlFile, "utf8");
  const head = (html.match(/<head[\s\S]*?<\/head>/i) || [html])[0];

  const css = new Set();
  for (const m of head.matchAll(/<link\b[^>]*\brel=["']stylesheet["'][^>]*>/gi)) {
    const href = (m[0].match(/\bhref=["']([^"']+)["']/i) || [])[1];
    const f = href && resolveLocal(htmlFile, href);
    if (f) css.add(f);
  }

  const js = new Set();
  for (const m of html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi)) {
    const f = resolveLocal(htmlFile, m[1]);
    if (f) js.add(f);
  }
  // <link rel="modulepreload"> = módulos del grafo de arranque.
  for (const m of head.matchAll(/<link\b[^>]*\brel=["']modulepreload["'][^>]*>/gi)) {
    const href = (m[0].match(/\bhref=["']([^"']+)["']/i) || [])[1];
    const f = href && resolveLocal(htmlFile, href);
    if (f) js.add(f);
  }
  return { css: [...css], js: [...js] };
}

/* ── Ejecución ───────────────────────────────────────────────────────── */
const rows = [];
let failed = false;

for (const page of htmlPages(ROOT)) {
  const { css, js } = extractAssets(page);
  const cssGz = css.reduce((a, f) => a + gz(f), 0);
  const jsGz = js.reduce((a, f) => a + gz(f), 0);
  const cssOk = cssGz <= BUDGET.cssPerPageGzip;
  const jsOk = jsGz <= BUDGET.jsPerPageGzip;
  if (!cssOk || !jsOk) failed = true;
  rows.push({ page: rel(page), cssGz, jsGz, cssOk, jsOk });
}

const mark = (ok) => (ok ? "✅" : "❌ EXCEDE");

console.log(`## Presupuesto de bytes — estado (gzip -9)\n`);
console.log(
  `Umbrales: CSS ruta crítica/página ≤ ${kb(BUDGET.cssPerPageGzip)} KB · ` +
  `JS inicial/página ≤ ${kb(BUDGET.jsPerPageGzip)} KB (gzip)\n`
);
console.log("| Página | CSS gzip | JS gzip | Estado |");
console.log("|---|---:|---:|---|");
for (const r of rows) {
  console.log(
    `| ${r.page} | ${kb(r.cssGz)} KB | ${kb(r.jsGz)} KB | ${mark(r.cssOk && r.jsOk)} |`
  );
}

if (!MD_ONLY) {
  console.log(
    failed
      ? "\n❌ Presupuesto EXCEDIDO en al menos una página."
      : "\n✅ Todas las páginas dentro del presupuesto."
  );
}
process.exit(failed ? 1 : 0);
