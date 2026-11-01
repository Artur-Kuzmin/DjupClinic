@AGENTS.md

# Djup Clinic: design brief

Marketing site for Djup Clinic, a consulting studio with two practices. It must read as a professional consulting firm made by a design studio, never as a template or AI output. "Djup" is Swedish for "deep".

## Practices and routes

| Page | English | French |
|---|---|---|
| Welcome | `/en` | `/fr` |
| Startup Clinic: fundraising and growth for early-stage startups | `/en/startups` | `/fr/startups` |
| School Audits: AI search audits for French post-bac schools | `/en/schools` | `/fr/ecoles` |
| Legal notice | `/en/legal-notice` | `/fr/mentions-legales` |

`/` redirects by browser language, falling back to English. Slugs live in `src/i18n/config.ts`; build links with `pathFor()`, never by hand.

## EN / FR

- Every page exists in both languages. All copy lives in one dictionary per language (`src/i18n/dictionaries/en.ts`, `fr.ts`); no strings in components.
- French is written natively, not translated, and addresses the reader as "vous".
- Fixed French names: the practice is "Audit de visibilité IA", the nav item "Écoles", the free offer "Diagnostic flash gratuit".
- French runs about 20% longer: every layout must hold with the French copy.

## Stack

Next.js 16 App Router (read `node_modules/next/dist/docs/` before using an API), TypeScript, plain CSS: `src/styles/tokens.css` plus CSS Modules. No component, icon or animation libraries. Components read semantic tokens (`--color-*`, `--text-*`), not raw palette values.

## Aesthetic

- Scandinavian base: calm, generous whitespace, a strict 12-column grid, hairline rules, few colours.
- 8-bit is a detail, at about 10% of the page: pixel illustrations drawn on a cell grid, the Departure Mono labels, ordered-dither transitions. Never gamified.
- Depth is expressed visually only: sections darken as the page goes down (bone, bone-1, mist, fjord, ink) with ordered-dither transitions between them. Never spell it out in copy.
- Pixel illustrations always render at a whole number of px per cell (`shapeRendering="crispEdges"`). Motion moves by whole cells (`steps()`), loops slowly through `AmbientLoop`, pauses off-screen, and holds the finished frame under `prefers-reduced-motion`.

### Never

- Purple/blue gradients, glassmorphism, blurred blobs, soft drop shadows
- Rounded-2xl cards everywhere, the generic 3-card feature grid
- Emoji as icons, icon packs, component libraries (no shadcn/MUI/Chakra)
- Centred-everything hero, stock photos, generic SaaS illustration
- Fake social proof, invented results, metrics or quotes
- Scroll-jacking
- Anything gamified: no scores, levels, progress meters, HUDs, game UI metaphors, playful copy or easter eggs. Krillion is a reference for visual style only.
- Prices anywhere on the site
- Banned words: unlock, supercharge, elevate, seamless, game-changing, leverage

## Palette and type

| Token | Value | Use |
|---|---|---|
| `--bone-0` | `#f2eee6` | page ground, depth 0 |
| `--bone-1` | `#e9e4da` | depth 1 |
| `--mist` | `#dedbd3` | depth 2 |
| `--fjord-700` | `#234a63` | depth 3, CTA bands (bone text on it) |
| `--ink` | `#15181b` | text, depth 4, footer |
| `--ink-600` | `#4e555b` | secondary text |
| `--fjord-500` | `#35607a` | labels, decorative marks, pixel fills |
| `--fjord-200` | `#9dbbcd` | large text and marks on dark grounds |
| `--coral-500` | `#ee6a4c` | CTAs and key highlights only, ink text on it |

- Coral appears only on CTAs and the single key highlight in a view, and never as text on bone (2.7:1).
- The fjord CTA band must stay clearly distinct from the ink footer.
- Small text on fjord is bone; fjord pale (`--fjord-200`) is for large text and marks only.

Type: Geist for headings and body; Departure Mono only for labels, section numbers, nav and buttons, at 11px multiples (its pixel grid). Fluid sizes run from 375px to 1440px viewports; see `tokens.css`.

## Copy

- No prices anywhere, in either language.
- Banned words (and their French equivalents): unlock, supercharge, elevate, seamless, game-changing, leverage.
- No invented results, metrics, testimonials or client names. Claims stay to what the practice actually does.
- School copy names "the main AI assistants students use (ChatGPT, Perplexity, Gemini, Google AI Overviews and others)", never a fixed number of tools.
- Every CTA ("Email us", "Book a call", snapshot requests) is a prefilled email to the addresses in `src/config/site.ts`. No forms.

## ReBound Nordic case study

- Nothing about the project may be invented: no results, figures, quotes or outcomes beyond what the client has approved.
- The testimonial and logo slots stay hidden (`showPlaceholderSlots: false` in `src/config/site.ts`) until the client approves the content. Approved content goes in `startups.caseStudy.testimonial` in both dictionaries and the logo in `caseStudies`; each appears as soon as it is filled in.

## Process

1. Show concepts (sketches or rendered options) and agree on one before building anything new.
2. Build one page or feature at a time.
3. Check at 375, 768 and 1440px in both English and French, plus reduced motion where something animates.
4. Critique against this brief, fix, then show the result.
5. `npx tsc --noEmit`, `npm run lint` and `npm run build` pass; Lighthouse 95+ on every category in both languages.
   Mobile Lighthouse performance must stay at 95+ on every page. Illustrations use the shared pixel-grid.ts helpers and tiled textures; check page weight before and after any visual change.
6. Commit, then push to `origin` (GitHub `Artur-Kuzmin/DjupClinic`) after every commit.
