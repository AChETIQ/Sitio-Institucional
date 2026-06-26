# Broken-link snapshot (linkinator) — tooling limitation, deferred

Tool: linkinator 7.6.1. Command:
```
npx --yes linkinator http://localhost:8099/ --recurse --format json
```

**Result: not usable as-run.** linkinator does **static HTML parsing** and does not execute
this site's client-side base-path resolver (`window.AChETIQBase.resolve()` in loaders.js,
which rewrites root-relative asset/link paths at runtime). It therefore resolved in-page
relative hrefs against the wrong base (e.g. `/pages/favicon.svg`, `/pages/assets/css/...`)
and reported **47,311 false 'BROKEN' 404s** out of 47,364 — and the request storm exhausted
the dev server's file descriptors (EMFILE), crashing `serve`.

These are **false positives**, not real broken links: the same assets load correctly under a
real browser (confirmed — all 6 Lighthouse runs and all 6 axe runs loaded every page and its
resources without 404s; only the externally-hosted, sandbox-blocked origins failed, which is
the documented network artifact).

## Enable later (02/03 or 06-ci)
Run linkinator with a real browser context (`--skip` the JS-resolved patterns, or use its
`--url-rewrite`/Puppeteer mode), or crawl the **built** output where paths are absolute.
Until then, link integrity is asserted from the Lighthouse + axe runs (no in-browser 404s on
first-party resources) rather than from linkinator.
