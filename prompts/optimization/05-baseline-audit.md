# 05 — Baseline Audit (AChETIQ) — run this FIRST

> Paste everything below the line into Claude Code at the repo root. Self-contained.
> This prompt **measures only**. It must run before `01`–`04` so every later change is
> justified by a measured delta. Read `00-index.md` first.

---

You are a senior web-performance/quality engineer establishing a **defensible baseline**.
Capture pre-optimization metrics for all four pillars and commit them as the reference
every other pass compares against. **Change no application code in this run.**

## 1. Objective
A committed, reproducible **baseline report** with concrete numbers for SEO,
Accessibility, Performance, and Security on this site as it exists today — plus an
honest list of metrics that **cannot yet be measured** because tooling is missing.

## 2. Scope
**In scope:** measuring the 4 reference pages (`/`, `/pages/gabinetes/eventos.html`,
`/pages/recursos/apuntes.html`, `/pages/contacto.html`) plus 2 nested pages
(`/pages/sobre-achetiq.html`, `/pages/recursos/seguimiento.html`); writing results under
`prompts/optimization/baseline/`.
**Out of scope:** any fix or code change. If you find something broken, **record it** —
do not fix it here (that belongs to `01`–`04`).

## 3. Preconditions
1. Serve the site statically with compression-representative delivery:
   `npx --yes serve -l 8099 .` (or `python3 -m http.server 8099`).
2. Ensure a Chromium is available (`scripts/shoot.mjs` confirms Playwright chromium;
   set `CHROME_PATH` for Lighthouse). Record exact tool versions used.
3. Create `prompts/optimization/baseline/` and a `reports/` sibling for later passes.

## 4. Methodology
This run is **Measure → Document** only (the first two beats of the global loop). Run
each tool ≥ 2× where noisy (LCP/TBT/INP), take the median, and store **raw outputs**
(JSON) alongside the summarized tables so results are auditable and reproducible.

## 5. Stack-specific guidance — what to capture per pillar
- **Performance:** run `node scripts/perf-matrix.mjs http://localhost:8099 baseline 3`
  and save its Markdown table (LCP/CLS/TBT/FCP/transfer, mobile+desktop). Add full
  Lighthouse Performance JSON per page. Record CSS bundle size (`du -b
  assets/css/main.bundle.css`) and per-file `assets/js/*.js` weights as the byte baseline.
- **SEO:** `npx --yes lighthouse <url> --only-categories=seo` per page; record score +
  failing audits. Snapshot the absence of `robots.txt`, `sitemap.xml`, canonical tags,
  and JSON-LD (these are the "before").
- **Accessibility:** install the harness (`@axe-core/playwright`) — **note this is a new
  dev-dependency** in a repo that currently has none — and run axe per page, saving JSON
  with violation counts by impact. Also capture Lighthouse Accessibility scores. Do a
  manual keyboard pass and record which widgets pass/fail (do not fix).
- **Security:** `curl -sI` the deployed Pages URL and the local server; record present/
  absent headers. Run `npm audit` and record (expected empty — note it). Snapshot the
  CSP absence and the inventory of external origins + `innerHTML` sinks (read-only).

## 6. Tooling
- `scripts/perf-matrix.mjs` (Lighthouse), `scripts/shoot.mjs` (CLS region heights),
  `npx --yes lighthouse`, `@axe-core/playwright`, `curl`, `npm audit`,
  `npx --yes linkinator` (broken-link snapshot). Pin versions in the report.

## 7. Acceptance criteria
- `prompts/optimization/baseline/` contains, for all 6 pages: Lighthouse JSON (perf+SEO+a11y), axe JSON, the `perf-matrix` table, header `curl` output, and the byte inventory.
- A single `baseline/SUMMARY.md` with one table per pillar (page × metric) and a clearly labeled **"cannot measure yet"** section (missing tooling/config) with the step needed to enable each.
- Every number is reproducible from the committed raw outputs + the documented commands/versions.

## 8. Output expectations
One commit: "baseline: capture pre-optimization metrics (all pillars)". The only files
added are under `prompts/optimization/baseline/` (and the dev-dependency for axe, with a
note). No application code touched.

## 9. Guardrails
- **Do not** fix anything in this run — measurement only; broken findings get logged for the relevant pillar prompt.
- **Be explicit about gaps:** if a metric (e.g. field INP, header grade on Pages) cannot be captured, say why and which prompt/tool will enable it — never fabricate or estimate a number.
- Record tool versions and exact commands so `01`–`04` can re-run the identical measurement for their "after" numbers.
