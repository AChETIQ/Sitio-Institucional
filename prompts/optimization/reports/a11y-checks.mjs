#!/usr/bin/env node
/**
 * a11y-checks.mjs — verificación reproducible del paso de accesibilidad
 * (02-accessibility.md). Cubre lo que axe NO automatiza: contraste real
 * resuelto por el navegador (OKLCH→sRGB) y el comportamiento de teclado
 * de los widgets a medida (navbar, temporizador, diálogo, motion).
 *
 *   node prompts/optimization/reports/a11y-checks.mjs [baseURL]
 *
 * Sirve el sitio estático antes (p.ej. `python3 -m http.server 8099`).
 * Usa playwright-core (devDependency transitiva) + el Chromium
 * preinstalado vía CHROME_PATH, porque el paquete `playwright` completo
 * no resuelve bajo ESM en este entorno. Mismo motor que scripts/shoot.mjs.
 */
import { chromium } from "playwright-core";

const BASE = process.argv[2] || "http://localhost:8099";
const EXEC = process.env.CHROME_PATH || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";

/* ── Matemática de contraste WCAG 2.x (sRGB) ───────────────── */
function lin(c) { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }
function lum([r, g, b]) { return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b); }
function ratio(a, b) { const la = lum(a), lb = lum(b), hi = Math.max(la, lb), lo = Math.min(la, lb); return (hi + 0.05) / (lo + 0.05); }
const fmt = (n) => n.toFixed(2);

const browser = await chromium.launch({ executablePath: EXEC, args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"] });
let failures = 0;
const note = (ok, msg) => { if (!ok) failures++; console.log(`  ${ok ? "✓" : "✗"} ${msg}`); };

/* ── 1. Contraste de tokens (resueltos a sRGB por canvas) ───── */
{
  const page = await browser.newPage();
  await page.goto(BASE + "/pages/recursos/seguimiento.html", { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  const TOKENS = ["--color-surface", "--color-surface-raised", "--color-surface-white", "--color-text",
    "--color-text-soft", "--color-text-faint", "--color-accent", "--color-cta-text", "--color-negative",
    "--color-positive", "--color-warning", "--color-on-accent", "--color-on-cta", "--color-cta",
    "--color-surface-inverse", "--focus-ring-color", "--color-border", "--color-border-interactive"];
  const rgb = await page.evaluate((tokens) => {
    const probe = document.createElement("span"); document.body.appendChild(probe);
    const cv = document.createElement("canvas"); cv.width = cv.height = 1; const cx = cv.getContext("2d");
    const out = {};
    for (const t of tokens) {
      probe.style.color = ""; probe.style.color = `var(${t})`;
      cx.clearRect(0, 0, 1, 1); cx.fillStyle = "#000"; cx.fillStyle = getComputedStyle(probe).color; cx.fillRect(0, 0, 1, 1);
      const d = cx.getImageData(0, 0, 1, 1).data; out[t] = [d[0], d[1], d[2]];
    }
    probe.remove(); return out;
  }, TOKENS);
  await page.close();
  console.log("\n[1] Contraste (umbral 4.5 texto · 3.0 texto-grande/UI):");
  const textPairs = [
    ["--color-text", "--color-surface", 4.5], ["--color-text-soft", "--color-surface", 4.5],
    ["--color-text-faint", "--color-surface", 4.5], ["--color-accent", "--color-surface", 4.5],
    ["--color-cta-text", "--color-surface", 4.5], ["--color-negative", "--color-surface", 4.5],
    ["--color-positive", "--color-surface", 4.5], ["--color-warning", "--color-surface", 4.5],
    ["--color-on-accent", "--color-accent", 4.5], ["--color-on-cta", "--color-cta", 4.5],
    ["--color-on-accent", "--color-surface-inverse", 4.5],
  ];
  for (const [fg, bg, thr] of textPairs) note(ratio(rgb[fg], rgb[bg]) >= thr, `${fmt(ratio(rgb[fg], rgb[bg]))}:1  ${fg} on ${bg}`);
  const uiPairs = [
    ["--focus-ring-color", "--color-surface", 3, "focus ring vs page"],
    ["--color-border-interactive", "--color-surface-white", 3, "control border vs white cell"],
    ["--color-border-interactive", "--color-surface-raised", 3, "control border vs field fill"],
  ];
  for (const [a, b, thr, lbl] of uiPairs) note(ratio(rgb[a], rgb[b]) >= thr, `${fmt(ratio(rgb[a], rgb[b]))}:1  ${lbl}`);
  note(true, `(decorative --color-border vs page = ${fmt(ratio(rgb["--color-border"], rgb["--color-surface"]))}:1 — exempt, cards/separators only)`);
}

/* ── 2. Navbar: aria-expanded refleja el estado real ───────── */
{
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.waitForSelector(".navbar__item--has-submenu > [aria-haspopup='menu']", { timeout: 5000 });
  const trig = page.locator(".navbar__item--has-submenu > [aria-haspopup='menu']").first();
  await trig.focus(); await page.keyboard.press("ArrowDown"); await page.waitForTimeout(150);
  const open = await trig.getAttribute("aria-expanded");
  const onItem = await page.evaluate(() => document.activeElement?.getAttribute("role") === "menuitem");
  await page.keyboard.press("Escape"); await page.waitForTimeout(120);
  console.log("\n[2] Navbar submenú desktop:");
  note(onItem, "ArrowDown mueve el foco al primer menuitem");
  note(open === "true", `aria-expanded=${open} con el panel abierto (sin mentir)`);
  await page.close();
}

/* ── 3. Temporizador: sin aria-live de reloj + anuncio throttleado */
{
  const page = await browser.newPage();
  await page.goto(BASE + "/pages/recursos.html?preview=true", { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  const m = await page.evaluate(() => {
    const clock = document.querySelector('[role="timer"]');
    const ann = document.querySelector('[data-countdown-announce]');
    return { clockLive: clock?.getAttribute("aria-live"), annLive: ann?.getAttribute("aria-live"), text: ann?.textContent };
  });
  const s = []; for (let i = 0; i < 3; i++) { s.push(await page.evaluate(() => document.querySelector('[data-countdown-announce]')?.textContent)); await page.waitForTimeout(1100); }
  console.log("\n[3] Temporizador de Recursos:");
  note(m.clockLive === null, "el reloj (tick por segundo) ya NO es región viva");
  note(m.annLive === "polite" && !!m.text, "anuncio sr-only polite en lenguaje natural presente");
  note(s.every((x) => x === s[0]), "el anuncio NO cambia cada segundo (throttle a minuto)");
  await page.close();
}

/* ── 4. Easter-egg <dialog>: trampa de foco + Esc + restitución */
{
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.waitForSelector(".egg-trigger", { timeout: 5000 });
  await page.locator(".egg-trigger").focus(); await page.keyboard.press("Enter"); await page.waitForTimeout(250);
  const o = await page.evaluate(() => { const d = document.querySelector("dialog.egg-dialog"); return { modal: d?.matches(":modal"), inside: d?.contains(document.activeElement) }; });
  await page.keyboard.press("Escape"); await page.waitForTimeout(250);
  const c = await page.evaluate(() => ({ open: document.querySelector("dialog.egg-dialog")?.open, onTrig: document.activeElement?.classList.contains("egg-trigger") }));
  console.log("\n[4] Easter-egg <dialog>:");
  note(o.modal && o.inside, "abre como modal nativo y el foco entra al diálogo");
  note(c.open === false && c.onTrig, "Esc cierra y restituye el foco al disparador");
  await page.close();
}

/* ── 5. Movimiento reducido: nada oculto, sin auto-motion ───── */
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(BASE + "/", { waitUntil: "networkidle" }); await page.waitForTimeout(800);
  const stuck = await page.evaluate(() => Array.from(document.querySelectorAll("[data-reveal], .anim-enter, .reveal-armed"))
    .filter((e) => parseFloat(getComputedStyle(e).opacity) < 0.99 && e.offsetParent !== null).length);
  const a = await page.evaluate(() => Array.from(document.querySelectorAll(".hero__slide")).findIndex((s) => s.classList.contains("hero__slide--active")));
  await page.waitForTimeout(2600);
  const b = await page.evaluate(() => Array.from(document.querySelectorAll(".hero__slide")).findIndex((s) => s.classList.contains("hero__slide--active")));
  console.log("\n[5] prefers-reduced-motion: reduce:");
  note(stuck === 0, "ningún contenido revelado queda oculto (opacity 0)");
  note(a === b, "el slideshow del hero no auto-avanza");
  await ctx.close();
}

await browser.close();
console.log(`\n${failures === 0 ? "✓ TODAS las verificaciones manuales pasan" : "✗ " + failures + " verificación(es) fallaron"}`);
process.exit(failures === 0 ? 0 : 1);
