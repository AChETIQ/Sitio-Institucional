# Lighthouse category scores — 6 pages (single run, mobile preset)

Tool: Lighthouse 13.4.0 · Chromium 141 · emulated mobile (default LH throttling).
Raw JSON per page in this folder. Perf scores here are SINGLE-run; the authoritative,
median-of-3 perf table is `../perf/perf-matrix-table.md` (4 reference pages, mobile+desktop).

| Page | Perf | SEO | A11y | Best-Pr. | LCP | CLS | TBT |
|---|---:|---:|---:|---:|---:|---:|---:|
| / | 96 | 100 | 100 | 100 | 2.72s | 0.000 | 0ms |
| /pages/gabinetes/eventos.html | 97 | 100 | 100 | 100 | 2.41s | 0.026 | 0ms |
| /pages/recursos/apuntes.html | 97 | 100 | 100 | 100 | 2.26s | 0.000 | 0ms |
| /pages/contacto.html | 99 | 100 | 100 | 100 | 2.12s | 0.001 | 0ms |
| /pages/sobre-achetiq.html | 76 | 100 | 100 | 100 | 2.56s | 0.455 | 0ms |
| /pages/recursos/seguimiento.html | 98 | 100 | 100 | 96 | 2.26s | 0.000 | 51ms |

## Sandbox network artifacts (NOT site defects)

The execution sandbox blocks outbound HTTPS to external origins used by the site.
Confirmed blocked (proxy 403): `cdnjs.cloudflare.com`, `www.google.com`, `drive.google.com`.

- **recursos/seguimiento — Best-Practices 96**: the only failing audit is `errors-in-console`,
  caused by `net::ERR_TUNNEL_CONNECTION_FAILED` loading `xlsx-populate` from cdnjs (blocked).
  In production this script loads; **the 96 is a sandbox artifact, not a site bug**. (Separately,
  the script lacks SRI — a real finding, see security inventory.)
- **contacto**: the Google Maps iframe origin is blocked, so the embedded map does not render
  in-sandbox. Scores (perf 99 / a11y 100) are unaffected, but transfer bytes exclude the map.
- **recursos/apuntes**: cover images load from Google Drive (blocked), so its transfer figures
  in the perf matrix are unreliable and dominated by sandbox behavior, not production delivery.
- **sobre-achetiq — CLS 0.455 / Perf 76 (single run)**: high layout shift observed; Lighthouse
  did not isolate culprit nodes. Page is NOT in the median perf-matrix set. **Re-measure with
  median-of-3 in 03-performance** before treating as definitive; flagged as the top perf finding.
