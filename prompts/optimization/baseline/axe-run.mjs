#!/usr/bin/env node
/**
 * axe-run.mjs — corre @axe-core/playwright (WCAG 2.x) sobre las 6 páginas de
 * referencia y emite, por página, el JSON crudo de violaciones + un resumen
 * por impacto (critical/serious/moderate/minor). Herramienta de medición
 * (no se sirve). Mismo patrón Playwright que scripts/shoot.mjs.
 *
 *   NODE_PATH=/opt/node22/lib/node_modules \
 *   node prompts/optimization/baseline/axe-run.mjs <baseURL> <outDir>
 *
 * Requiere: @axe-core/playwright (devDependency) + un Chromium de Playwright.
 * Evalúa etiquetas WCAG 2.0/2.1/2.2 niveles A y AA.
 */
import { chromium } from "playwright";
import { AxeBuilder } from "@axe-core/playwright";
import { mkdirSync, writeFileSync } from "node:fs";

const BASE = process.argv[2] || "http://localhost:8099";
const OUT = process.argv[3] || "prompts/optimization/baseline/raw/axe";
mkdirSync(OUT, { recursive: true });

const PAGES = [
  ["index", "/"],
  ["gabinetes_eventos", "/pages/gabinetes/eventos.html"],
  ["recursos_apuntes", "/pages/recursos/apuntes.html"],
  ["contacto", "/pages/contacto.html"],
  ["sobre-achetiq", "/pages/sobre-achetiq.html"],
  ["recursos_seguimiento", "/pages/recursos/seguimiento.html"],
];
const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

const browser = await chromium.launch({
  args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"],
});

const summary = [];
for (const [slug, path] of PAGES) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  await page.goto(BASE + path, { waitUntil: "networkidle" });
  await page.waitForTimeout(900); // dejar resolver loaders + fuentes

  const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();
  writeFileSync(`${OUT}/${slug}.json`, JSON.stringify(results, null, 2));

  const byImpact = { critical: 0, serious: 0, moderate: 0, minor: 0, null: 0 };
  for (const v of results.violations) {
    byImpact[v.impact ?? "null"] += v.nodes.length;
  }
  summary.push({ slug, path, violations: results.violations.length, byImpact,
    ids: results.violations.map((v) => `${v.id}(${v.impact})`) });
  await context.close();
  process.stderr.write(`· ${slug}: ${results.violations.length} violation rule(s)\n`);
}
await browser.close();

writeFileSync(`${OUT}/_summary.json`, JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary, null, 2));
