# Manual / semi-automated keyboard pass — baseline

Method: Playwright drove `Tab` through each page and recorded the first 10 focus
stops, each element's tag/label, and whether a visible focus indicator (outline or
box-shadow) was computed. Raw data: `keyboard-pass.json`. **No code changed.**

This is a code-/DOM-level pass; it is **not** a screen-reader (NVDA/VoiceOver) test —
that remains a gap (see SUMMARY 'cannot measure yet').

## Results (4 representative pages)

| Page | First focus = skip link? | Visible focus on all stops? | Tab order |
|---|---|---|---|
| index | ✅ "Saltar al contenido principal" | ✅ | skip → logo → nav (logical) |
| contacto | ✅ | ✅ | skip → logo → nav (logical) |
| recursos/seguimiento | ✅ | ✅ | skip → logo → nav (logical) |
| sobre-achetiq | ✅ | ✅ | skip → logo → nav (logical) |

## Widget-level keyboard handling (code inspection)

| Widget (file) | Keyboard support found | Assessment |
|---|---|---|
| Navbar / menu (`navbar.js`) | 4 key-listeners, Escape×2, Arrow keys×4, focus mgmt ×10, 27 aria/role | **PASS** (rich) |
| Seguimiento (`seguimiento.js`) | 2 key-listeners, Escape×2, Arrows×2, 33 aria/role | **PASS** |
| Easter-egg overlay (`easter-egg.js`) | 6 aria/role, 1 focus; **no Escape/key handler found** | **VERIFY in 02** (modal should trap focus + close on Esc) |
| Hero slideshow (`hero-carrousel.js`) | none — decorative `aria-hidden=true`, auto-advance, no controls | **PASS** (presentational) |
| Sobre-AChETIQ (`sobre-achetiq.js`) | 4 aria/role, no key handlers | **VERIFY** (depends on widget type) |
| Contacto form (`contacto-form.js`) | native form controls, 3 focus calls, 6 aria | **PASS** (native) |

## Findings logged for 02-accessibility.md (not fixed here)
- Easter-egg overlay: confirm focus-trap + `Escape`-to-close (no key handler seen in source).
- sobre-achetiq.js interactive widget(s): confirm keyboard operability of any custom controls.
