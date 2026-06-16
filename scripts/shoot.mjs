#!/usr/bin/env node
/**
 * shoot.mjs — captura de pantalla + medición de regiones, para verificar
 * paridad pixel y reservas de espacio (CLS) de regiones inyectadas.
 * Herramienta interna de medición (no se sirve).
 *
 *   node scripts/shoot.mjs <url> <out.png|-> <width> [selectores,csv]
 *
 * Imprime (JSON) la altura renderizada de cada selector pedido; «-» como
 * salida omite la captura. Requiere Playwright disponible:
 *   npx playwright install chromium      (o un Chromium global)
 * y, si el binario vive fuera de la caché por defecto:
 *   PLAYWRIGHT_BROWSERS_PATH=/ruta node scripts/shoot.mjs …
 */
import { chromium } from "playwright";

const [url, out = "-", width = "375", selectors = ""] = process.argv.slice(2);

const browser = await chromium.launch({
  args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"],
});
const page = await browser.newPage({
  viewport: { width: Number(width), height: 900 },
  deviceScaleFactor: 2,
});
await page.goto(url, { waitUntil: "networkidle" });
await page.waitForTimeout(900); // dejar resolver loaders + fuentes

if (out && out !== "-") await page.screenshot({ path: out, fullPage: true });

const sels = selectors.split(",").map((s) => s.trim()).filter(Boolean);
const heights = {};
for (const sel of sels) {
  heights[sel] = await page.$$eval(sel, (els) =>
    els.map((e) => Math.round(e.getBoundingClientRect().height))
  );
}
console.log(JSON.stringify(heights));

await browser.close();
