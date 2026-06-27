#!/usr/bin/env node
/**
 * verify:csp — verifica la Content-Security-Policy del sitio en modo REPORT-ONLY.
 *
 * GitHub Pages no permite cabeceras y una <meta> no puede entregar
 * Content-Security-Policy-Report-Only (los navegadores la ignoran en <meta>).
 * Así que el modo report-only —el que manda la metodología «medir → observar →
 * apretar → forzar»— se reproduce localmente: este script
 *   1. LEE la CSP ya publicada en el <meta> de index.html (fuente única; sin
 *      duplicar la política — verifica exactamente lo que se sirve),
 *   2. sirve el repo en localhost mandándola como cabecera
 *      `Content-Security-Policy-Report-Only`,
 *   3. recorre TODAS las páginas servidas con Chromium headless y recolecta los
 *      eventos `securitypolicyviolation`,
 *   4. en seguimiento.html ejecuta además el round-trip real de exportación a
 *      Excel (xlsx-populate: fromDataAsync → outputAsync) para confirmar que
 *      ningún camino eval/Function dispara `script-src`.
 * Sale con código ≠ 0 si hay cualquier violación → apto como compuerta de CI
 * (06-ci-integration).
 *
 * Requisitos: `playwright-core` (lo arrastra el devDep @axe-core/playwright) y un
 * binario de Chromium apuntado por CHROME_PATH (misma convención que
 * perf-matrix.mjs); si falta, se prueban rutas habituales de Playwright.
 *
 *   CHROME_PATH=/ruta/al/chrome  node scripts/verify-csp.mjs
 */
import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, extname, normalize, relative, sep, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PORT = Number(process.env.CSP_VERIFY_PORT || 8137);

/* ── localizar Chromium ─────────────────────────────────────────────── */
function findChrome() {
  if (process.env.CHROME_PATH && existsSync(process.env.CHROME_PATH)) return process.env.CHROME_PATH;
  const roots = [process.env.PLAYWRIGHT_BROWSERS_PATH, "/opt/pw-browsers"].filter(Boolean);
  for (const r of roots) {
    try {
      for (const d of readdirSync(r).sort().reverse()) {
        for (const bin of ["chrome-linux/chrome", "chrome-linux/headless_shell"]) {
          const p = join(r, d, bin);
          if (existsSync(p)) return p;
        }
      }
    } catch { /* sigue */ }
  }
  return null;
}

/* ── leer la CSP publicada en index.html (fuente única) ─────────────── */
function publishedCsp() {
  const html = readFileSync(join(ROOT, "index.html"), "utf8");
  const m = html.match(/<meta\s+http-equiv="Content-Security-Policy"\s+content="([^"]+)"/i);
  if (!m) throw new Error("No se encontró la <meta> CSP en index.html (¿corriste build:csp?)");
  return m[1];
}

/* ── listar páginas servidas ────────────────────────────────────────── */
function walkHtml(dir) {
  const out = [];
  for (const e of readdirSync(dir).sort()) {
    const full = join(dir, e);
    if (statSync(full).isDirectory()) out.push(...walkHtml(full));
    else if (e.endsWith(".html")) out.push(full);
  }
  return out;
}
const PAGES = [join(ROOT, "index.html"), join(ROOT, "404.html"), ...walkHtml(join(ROOT, "pages"))]
  .map((f) => "/" + relative(ROOT, f).split(sep).join("/"));

const MIME = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8", ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8", ".svg": "image/svg+xml", ".woff2": "font/woff2",
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp",
  ".ico": "image/x-icon", ".webmanifest": "application/manifest+json",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
};

const INIT = `window.__csp=[];document.addEventListener('securitypolicyviolation',function(e){window.__csp.push({directive:e.effectiveDirective||e.violatedDirective,blocked:e.blockedURI,sample:e.sample||'',source:(e.sourceFile||'')+':'+(e.lineNumber||'')});});`;

async function main() {
  const CHROME = findChrome();
  if (!CHROME) {
    console.error("verify:csp — no se encontró Chromium. Definí CHROME_PATH=/ruta/al/chrome");
    process.exit(2);
  }
  const CSP = publishedCsp();

  const server = http.createServer(async (req, res) => {
    try {
      let p = decodeURIComponent(req.url.split("?")[0]);
      if (p.endsWith("/")) p += "index.html";
      const abs = normalize(join(ROOT, p));
      if (!abs.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
      await stat(abs);
      const body = await readFile(abs);
      res.writeHead(200, {
        "Content-Type": MIME[extname(abs)] || "application/octet-stream",
        "Content-Security-Policy-Report-Only": CSP,
      });
      res.end(body);
    } catch { res.writeHead(404); res.end("404"); }
  });
  await new Promise((r) => server.listen(PORT, r));

  const browser = await chromium.launch({ executablePath: CHROME, args: ["--no-sandbox"] });
  console.log("verify:csp — report-only against the published <meta> policy");
  console.log("  CSP:", CSP, "\n");

  let total = 0;
  for (const path of PAGES) {
    const page = await browser.newPage();
    await page.addInitScript(INIT);
    await page.goto(`http://localhost:${PORT}${path}`, { waitUntil: "load" }).catch(() => {});
    await page.waitForTimeout(1800); // deja correr loaders diferidos (navbar/footer/main)

    let xlsx = "";
    if (path.endsWith("seguimiento.html")) {
      const r = await page.evaluate(async () => {
        try {
          if (!window.XlsxPopulate) return "NO-GLOBAL";
          const url = new URL("../../assets/docs/Seguimiento_de_Carrera.xlsx", location.href).href;
          const buf = await (await fetch(url)).arrayBuffer();
          const wb = await window.XlsxPopulate.fromDataAsync(buf);
          const out = await wb.outputAsync("arraybuffer");
          return "OK " + out.byteLength + "B";
        } catch (e) { return "ERR " + (e && e.message || e); }
      });
      await page.waitForTimeout(300);
      xlsx = "  xlsx-export=" + r;
    }

    const v = await page.evaluate(() => window.__csp);
    total += v.length;
    console.log(`${v.length ? "✗" : "✓"}  ${path}${v.length ? "  (" + v.length + " violations)" : ""}${xlsx}`);
    for (const x of v) console.log(`     - ${x.directive} blocked=${x.blocked}${x.sample ? ' sample="' + x.sample.slice(0, 60) + '"' : ""}`);
    await page.close();
  }

  await browser.close();
  await new Promise((r) => server.close(r));
  console.log(`\n${total === 0 ? "PASS" : "FAIL"} — ${total} CSP violation(s) across ${PAGES.length} pages.`);
  process.exit(total === 0 ? 0 : 1);
}

main().catch((e) => { console.error(e); process.exit(2); });
