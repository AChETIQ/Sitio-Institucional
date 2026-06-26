# 06 — CI Integration (AChETIQ) — run LAST

> Paste everything below the line into Claude Code at the repo root. Self-contained.
> Wire the pillar checks into GitHub Actions so gains can't silently regress. Read
> `00-index.md` first. The repo currently has **no `.github/workflows/`**.

---

You are a senior DevEx/CI engineer. Add a GitHub Actions pipeline that enforces the
SEO / Accessibility / Performance / Security thresholds from `01`–`04` on every push and
pull request, with **failing gates** — not advisory output.

## 1. Objective
A green-or-blocking CI pipeline that runs Lighthouse CI (Perf/SEO/A11y/Best-Practices),
axe-core, link checking, and a dependency/secret scan against the built static site, and
**fails the build** when any pillar drops below its threshold.

## 2. Scope
**In scope:** new `.github/workflows/*.yml`, a `lighthouserc.json` (or `.js`) LHCI
config, an axe test runner (reusing the Playwright pattern from `scripts/shoot.mjs`), and
any minimal `package.json` devDependencies/scripts needed to run them via `npx`.
**Out of scope:** changing the GitHub Pages deploy mechanism, and the optimizations
themselves (those are `01`–`04`). This prompt only **gates** them.

## 3. Preconditions (measure first)
1. The baseline (`05`) and at least the P0 passes from `01`/`04` should exist so the
   thresholds you set are currently achievable (don't gate at a level the site fails).
2. Read existing scripts (`scripts/perf-matrix.mjs`, `scripts/shoot.mjs`,
   `scripts/build-*.mjs`) and reuse them where possible instead of duplicating logic.
3. Confirm how the site is served in CI: it is static, so the job just runs
   `npm run build` then serves the repo root (e.g. `npx serve`) for the auditors.

## 4. Methodology (mandatory loop)
**Measure → Diagnose → Implement → Verify → Document.** Build the workflow incrementally:
add one check, push, confirm it runs green on the current (optimized) tree and **red**
on an intentional regression (prove the gate bites), then add the next. Document the
chosen thresholds and why.

## 5. Stack-specific guidance
- **Workflow triggers:** `on: [push, pull_request]` for the audit job; keep any future
  Pages **deploy** job separate so audits gate before deploy.
- **Build step:** `actions/setup-node`, `npm ci` (add a lockfile when you introduce
  devDeps), `npm run build` (runs `build:urls` + `build:css`), then serve statically.
- **Lighthouse CI:** use `treosh/lighthouse-ci-action` (or `npx @lhci/cli autorun`) with
  a `lighthouserc.json` listing the same URLs `perf-matrix.mjs` uses. Set
  `assert.assertions` to fail under: Performance ≥ 0.95 (mobile preset), SEO ≥ 0.95,
  Accessibility ≥ 0.95, Best-Practices ≥ 0.95, plus CWV assertions (LCP, CLS, TBT).
  Run mobile and desktop form factors.
- **axe:** a small Playwright + `@axe-core/playwright` script (model on `scripts/shoot.mjs`,
  reuse `PLAYWRIGHT_BROWSERS_PATH`/preinstalled chromium) that visits each page and
  **exits non-zero on any critical/serious violation**.
- **Links:** `npx --yes linkinator` over the served site to fail on broken internal links / 404s.
- **Security/deps:** `npm audit --audit-level=high` (fails on high/critical) and a secret
  scan (e.g. `gitleaks` action). Optionally validate the `<meta>` CSP exists on built
  pages. Note: live header grading can't run against Pages — document that it's covered
  by the portable config from `04`, not CI.
- **Caching & cost:** cache npm + the Playwright browser; run the matrix on a small,
  fixed URL set to keep CI fast.

## 6. Tooling
- `treosh/lighthouse-ci-action` / `@lhci/cli`, `@axe-core/playwright` + `playwright`,
  `linkinator`, `npm audit`, `gitleaks` action, `actions/setup-node`,
  `actions/upload-artifact` (store LHCI/axe reports per run).

## 7. Acceptance criteria
- A workflow that **fails** when: any Lighthouse category < 0.95, LCP ≥ 2.5 s / CLS ≥ 0.1
  (lab), any axe critical/serious violation, a broken internal link, or a high/critical
  `npm audit` finding / leaked secret.
- Proven to go **red on a deliberate regression** and **green on the current tree** (show both runs).
- Reports uploaded as build artifacts; thresholds documented in the workflow and in
  `prompts/optimization/reports/ci.md`.

## 8. Output expectations
Small, atomic commits ("ci: lighthouse-ci gate", "ci: axe a11y gate", "ci: deps + secret
scan"). A short `reports/ci.md` describing each gate, its threshold, and the rationale.
Add a status badge to `README.md` only if asked.

## 9. Guardrails
- **Do not** set thresholds the optimized site cannot currently meet (that makes CI
  permanently red and gets ignored) — gate at the achieved level and ratchet up later.
- **Do not** alter the GitHub Pages deploy flow or `npm run build` semantics.
- Keep the pipeline fast and cached; a slow gate gets disabled. State the trade-off if
  you reduce coverage for speed.
- Pin action versions; treat third-party actions as a supply-chain surface (prefer SHA pins).
- If introducing devDependencies, add and commit a lockfile so `npm ci` is reproducible,
  and note the new dependency footprint (the repo started at zero deps).
