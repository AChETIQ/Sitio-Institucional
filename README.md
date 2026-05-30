# UI Kit — Sitio Web AChETIQ

A faithful, **interactive** recreation of the AChETIQ institutional website, built in the same stack the real site uses: **vanilla HTML + vanilla CSS (BEM) + vanilla JS**, consuming CSS custom-property design tokens. No frameworks.

Open `index.html`. It is a single-page click-through — the navbar and in-page links switch between five views without page reloads.

## Views (click-through)

| View | Shows |
|---|---|
| **Inicio** | Hero (Instrument-Serif headline w/ italic emphasis), KPI strip, "Quiénes somos" prose, gabinetes grid, recursos teaser, CTA-final block. |
| **Sobre AChETIQ** | Page header, Misión/Visión dual block, 6 value cards (Lucide icons), history prose + pull-quote. |
| **Gabinetes** | The four gabinete cards at full width with footer meta. |
| **Recursos** | Apuntes hub: a working **pill-nav year filter** (Todos / 1°–5°) over subject cards. Cards with a Drive folder are links; others show "Próximamente". Covers are tinted by the year ramp. |
| **Contacto** | Direct-channel contact cards (general mail, Instagram, one per gabinete). |

## Interactions implemented

- **Navbar:** sticky, translucent blurred background. Desktop hover/focus submenus for Gabinetes & Recursos. Mobile hamburger → slide-in panel with overlay (Esc / overlay-click closes; scroll lock).
- **View switching** via `data-view-link` → `data-view`, with active-link sync and hash routing.
- **Year filter** toggles `[hidden]` on subject cards.
- All icons are **Lucide** (`<i data-lucide>` + `lucide.createIcons()`).

## Component inventory (real BEM classes from the repo)

`.navbar` · `.nav-link--{ghost,outline,primary}` · `.navbar__submenu` · `.navbar__panel` ·
`.hero` · `.kpi-strip` · `.section-title` · `.page-header` · `.mission-vision` ·
`.card-gabinete` · `.card--valor` · `.card-materia` (+ `--drive` / `--placeholder`) · `.contact-card` ·
`.btn-primary` · `.btn-secondary` · `.pill-nav` · `.prose` · `.quote` · `.cta-final` · `.footer`.

## Files

```
index.html        all five views + navbar + footer
css/
  tokens.css      canonical tokens (vars, base, .btn, .card, .kpi)
  kit.css         glue: @font-face, .page, a11y helpers, view switching
  navbar.css footer.css headers.css cards.css cta.css
  forms.css states.css text.css nav-secondary.css   (verbatim from repo)
js/
  data.js         sample data (gabinetes, valores, materias, contacto)
  kit.js          vanilla interactivity
```

## Notes for reuse

- These are **cosmetic recreations** for prototyping — `kit.js` is a thin renderer, not production logic. The real site loads partials/JSON via `fetch` and a `data-loader` pattern.
- To build a new AChETIQ screen, copy the relevant component markup + link `tokens.css` + the needed component CSS. Keep every colour/size as a `var(--token)` — never hardcode.
- Fonts: Geist 500 + Geist Mono come from Google Fonts here (see root README caveat).
