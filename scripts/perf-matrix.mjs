#!/usr/bin/env node
/**
 * perf-matrix.mjs — corre Lighthouse (performance) sobre las 4 páginas de
 * referencia del presupuesto, en mobile y desktop, y emite una tabla
 * Markdown con LCP / CLS / TBT / transferencia. Herramienta de medición
 * interna (no se sirve); úsese con el sitio servido CON compresión.
 *
 *   node scripts/perf-matrix.mjs <baseURL> <label> [runs]
 *
 * <label> nombra la columna (p. ej. "before"/"after"); los JSON crudos van
 * a /tmp/lh-<label>/. Toma la MEDIANA de <runs> corridas (default 2) para
 * LCP/TBT, que son ruidosas en lab. Requiere CHROME_PATH.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync } from "node:fs";

const BASE = process.argv[2] || "http://localhost:8099";
const LABEL = process.argv[3] || "run";
const RUNS = Number(process.argv[4] || 2);

const PAGES = [
  ["Inicio", "/"],
  ["Gabinete (eventos)", "/pages/gabinetes/eventos.html"],
  ["Apuntes", "/pages/recursos/apuntes.html"],
  ["Contacto", "/pages/contacto.html"],
];
const FORMS = [
  ["mobile", []],
  ["desktop", ["--preset=desktop"]],
];

const OUT = `/tmp/lh-${LABEL}`;
mkdirSync(OUT, { recursive: true });

const median = (xs) => {
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

function audit(url, form, formFlags, slug) {
  const lcp = [], cls = [], tbt = [], bytes = [], fcp = [];
  for (let i = 0; i < RUNS; i++) {
    const path = `${OUT}/${slug}-${form}-${i}.json`;
    execFileSync("npx", ["--yes", "lighthouse", url,
      "--only-categories=performance",
      "--chrome-flags=--headless=new --no-sandbox --disable-gpu --disable-dev-shm-usage",
      ...formFlags,
      "--output=json", `--output-path=${path}`, "--quiet"],
      { stdio: ["ignore", "ignore", "inherit"], timeout: 240000 });
    const a = JSON.parse(readFileSync(path, "utf8")).audits;
    lcp.push(a["largest-contentful-paint"].numericValue);
    cls.push(a["cumulative-layout-shift"].numericValue);
    tbt.push(a["total-blocking-time"].numericValue);
    fcp.push(a["first-contentful-paint"].numericValue);
    bytes.push(a["total-byte-weight"].numericValue);
  }
  return {
    lcp: median(lcp) / 1000, cls: median(cls), tbt: median(tbt),
    fcp: median(fcp) / 1000, kb: median(bytes) / 1024,
  };
}

const rows = [];
for (const [name, p] of PAGES) {
  const slug = p === "/" ? "index" : p.replace(/[\/.]/g, "_");
  for (const [form, flags] of FORMS) {
    process.stderr.write(`· ${name} [${form}] …\n`);
    const r = audit(BASE + p, form, flags, slug);
    rows.push([name, form, r]);
  }
}

console.log(`\n## Matriz Lighthouse — ${LABEL} (mediana de ${RUNS}, gzip)\n`);
console.log("| Página | Modo | LCP | CLS | TBT | FCP | Transferencia |");
console.log("|---|---|---|---|---|---|---|");
for (const [name, form, r] of rows) {
  console.log(`| ${name} | ${form} | ${r.lcp.toFixed(2)} s | ${r.cls.toFixed(3)} | ${Math.round(r.tbt)} ms | ${r.fcp.toFixed(2)} s | ${Math.round(r.kb)} KB |`);
}
