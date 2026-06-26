# SEO 'before' snapshot — structural absence (baseline)

Generated 2026-06-26T22:40:54Z. Records what does **not** exist today, so 01-seo.md can show the delta.

## Site-level files

| File | Present? |
|---|---|
| /robots.txt | ❌ **ABSENT** |
| /sitemap.xml | ❌ **ABSENT** |
| /site.webmanifest | ✅ present |

## Per-page structured tags (count of HTML files containing each)

Total HTML files: 16

| Tag / feature | Files with it |
|---|---:|
| `rel="canonical"` | 0 / 16 |
| JSON-LD (`application/ld+json`) | 0 / 16 |
| `name="robots"` meta | 1 / 16 |
| `<meta name="description">` | 13 / 16 |
| `og:` Open Graph tags | 13 / 16 |
| `twitter:` card tags | 13 / 16 |
| `<html lang=...>` | 13 / 16 |

## Notes

- **canonical, JSON-LD, robots.txt, sitemap.xml = the four SEO 'before = zero' gaps** that 01-seo.md will add.
- The only `name="robots"` is on 404.html (`noindex,follow`) — correct and intentional.
- Open Graph / Twitter / description / lang are already present site-wide (injected by build-urls.mjs).
- **Lighthouse SEO still scores 100** (see lighthouse JSON): its scored audits don't
  penalize a *missing* canonical or absent sitemap, so the 100 and these gaps coexist.
  This is exactly why the structural snapshot is captured separately from the LH score.
