# 04 — Security Pass (AChETIQ, OWASP lens on a static GitHub Pages site)

> Paste everything below the line into Claude Code at the repo root. Self-contained.
> Read `00-index.md` first — especially the GitHub Pages header limitation.

---

You are a senior application-security engineer. Harden this **static** site under an
OWASP Top 10 lens, being **honest about what GitHub Pages can and cannot enforce**.

## 1. Objective
A defensible security posture: a **valid, justified Content-Security-Policy** (delivered
the only way Pages allows — `<meta http-equiv>`), a **portable header config** ready for
a future CDN/proxy, confirmed **XSS-safe** DOM handling, **SRI** on external resources,
and **zero high/critical known vulnerabilities** — with every limitation documented, not
hidden.

## 2. Scope
**In scope:** `partials/_boilerplate.html` + all `*.html` (`<meta>` CSP + SRI), the
`<iframe>` on `pages/contacto.html`, `assets/js/*.js` (`innerHTML`/`safeHref` audit),
`package.json` (dependency posture), and a new portable header file
(`_headers` / Cloudflare snippet) + docs.
**Out of scope:** SEO (`01`), a11y (`02`), perf (`03`), and any change requiring a
server runtime (Pages has none).

## 3. Preconditions (measure first)
1. Confirm the security baseline exists (`05-baseline-audit.md`); if missing, run it.
2. Record the **honest header reality**: GitHub Pages serves fixed headers and **cannot**
   set CSP/HSTS/X-Frame-Options/Permissions-Policy via response headers. Confirm with
   `curl -sI https://ingqcautnfrre-lab.github.io/achetiq-lab/ | sort` and note what is present/absent.
3. Inventory the attack surface:
   - `grep -rn 'innerHTML\|insertAdjacentHTML\|document.write' assets/js` — classify each (expected: static SVG / `<template>` only).
   - Read `safeHref()` in `assets/js/loaders.js` and list every call site.
   - List every external origin loaded (fonts are self-hosted; the Maps iframe + any Google Drive/Docs links) — candidates for SRI / `sandbox`.
   - `grep -rn 'NEXT_PUBLIC\|process.env\|API_KEY\|secret\|token' .` and `ls -a` for stray `.env*` (expected: none).
4. Run a dependency scan and record the result honestly (`package.json` has zero deps — `npm audit` will be empty; say so rather than implying coverage).

## 4. Methodology (mandatory loop)
**Measure → Diagnose → Implement → Verify → Document.** For CSP especially: build it
**report-only first**, observe violations against real pages (inline styles, JS-injected
SVG, the Maps frame), tighten, then enforce. Never ship a CSP that breaks the site;
never ship one looser than necessary without a written justification.

## 5. Stack-specific guidance
- **CSP via `<meta http-equiv>` (what works on Pages):** add a Content-Security-Policy
  meta tag to the template `<head>`. Start strict and justify each relaxation:
  - `default-src 'self'`; `img-src 'self' data:` (data: only if actually used);
    `font-src 'self'`; `script-src 'self'` (the site uses ES modules, no inline scripts —
    verify and keep it that way, **no `unsafe-inline` for scripts**);
  - `style-src` — the site uses some inline `style="…"` and JS-injected SVG; prefer
    refactoring inline styles to classes so you can avoid `'unsafe-inline'`. If a
    documented few remain, either hash them or record `'unsafe-inline'` as a **stated
    trade-off** with a plan to remove it.
  - `frame-src https://www.google.com` for the Maps embed; `frame-ancestors 'none'`
    (note: `frame-ancestors` is **ignored** in a meta tag — see limitation below);
    `base-uri 'self'`; `form-action 'self'`; `object-src 'none'`.
- **Document what `<meta>` CSP cannot do:** `frame-ancestors`, `report-uri`/`report-to`,
  and sandbox directives are ignored in meta form; HSTS, X-Frame-Options,
  X-Content-Type-Options, Referrer-Policy, and Permissions-Policy **cannot be set at all**
  on GitHub Pages. State this plainly in the report.
- **Portable header config (for the future):** create a host-agnostic header file —
  a Cloudflare `_headers` / Transform Rule snippet (and/or Netlify `_headers`) — carrying
  the **full** set: `Content-Security-Policy` (with real `frame-ancestors 'none'`),
  `Strict-Transport-Security`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`,
  `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` (deny
  camera/mic/geolocation). Document that it is **inert until a proxy/host that honors
  headers is put in front of Pages** — do not imply Pages applies it.
- **XSS:** confirm the audit — all `innerHTML` uses are static constants or
  same-origin `<template>` fragments, never `data/*.json` strings (the JSON renderers in
  `loaders.js`/`seguimiento.js` use `textContent`/`setAttribute`). Keep it that way; add
  a short code comment/convention so future contributors don't introduce a sink. Verify
  `safeHref()` still blocks `javascript:`/`data:` and is applied to **every** href built
  from data.
- **iframe hardening:** add `sandbox` (minimum needed) and a tight `referrerpolicy` to
  the Maps `<iframe>`; ensure all `target="_blank"` links keep `rel="noopener noreferrer"`.
- **SRI:** any resource loaded from a third-party origin must carry
  `integrity` + `crossorigin`. (Most assets are self-hosted — confirm and note that SRI
  is mostly N/A, applying it only where an external script/style is added later.)
- **Secrets/env:** confirm no secrets, no `.env`, and that no `NEXT_PUBLIC_`-style public
  config leaks anything sensitive (there is none — record it).

## 6. Tooling
- `curl -sI <url>` to read live headers; an online securityheaders.com / Mozilla Observatory scan of the deployed URL.
- CSP evaluation: Google CSP Evaluator on the proposed policy; browser console in report-only mode against served pages.
- `grep`/ripgrep for sinks, secrets, and external origins.
- `npm audit --omit=dev` (record that it is empty with zero deps); `npx --yes osv-scanner .` if any deps are ever added.

## 7. Acceptance criteria
- A working **`<meta>` CSP** enforced on every page that **does not break** rendering, the Maps embed, fonts, or any widget — and contains **no `unsafe-*` directive that isn't documented and justified**.
- Portable full-header config committed, with a doc clearly stating it is inert on Pages and where to apply it for **A/A+** on a header scan.
- XSS audit: **zero** `innerHTML`/sink uses fed by untrusted/JSON data; `safeHref` covers all data-driven hrefs.
- Maps iframe sandboxed + referrer-limited; all external links `noopener noreferrer`.
- Dependency posture: **zero high/critical** known vulns (and the honest note that the dep tree is empty).

## 8. Output expectations
Small, atomic commits ("sec: add report-only CSP meta", "sec: enforce CSP + sandbox maps
iframe", "sec: portable header config for future proxy"). Report at
`prompts/optimization/reports/security.md` with the final CSP (annotated per directive),
the explicit Pages-limitation section, and the header-scan expectation once proxied.

## 9. Guardrails
- **Never** weaken the CSP just to make something work without recording the trade-off and a tightening plan; prefer fixing the page (e.g. removing inline styles) over loosening policy.
- **Be honest:** do not present the portable header file as if GitHub Pages enforces it. Clearly separate "enforced now (meta)" from "enforced later (proxy)".
- **Do not** introduce a build/server dependency or break `npm run build`.
- Test the CSP in **report-only** before enforcing; ship enforcement only after zero unexpected violations on all pages. Request confirmation before any change that could block the Maps embed or third-party links.
