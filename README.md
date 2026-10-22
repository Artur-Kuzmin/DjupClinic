# Djup Clinic

Marketing site for Djup Clinic, a consulting studio with two practices:

- **Startup Clinic**: growth and fundraising for early-stage startups.
- **School Audits**: AI search audits for French post-bac schools.

The site is fully bilingual:

| Page | English | French |
|---|---|---|
| Welcome | `/en` | `/fr` |
| Startup Clinic | `/en/startups` | `/fr/startups` |
| School Audits | `/en/schools` | `/fr/ecoles` |

`/` redirects by browser language and falls back to English. A page slug in the wrong language redirects to its equivalent, for example `/fr/schools` to `/fr/ecoles`.

## Stack

- Next.js 16 (App Router, Cache Components) and TypeScript
- Plain CSS: one tokens file plus CSS Modules. No component, icon or animation libraries.
- Fonts: Geist (headings and body, via `next/font/google`) and Departure Mono (pixel labels, self-hosted under the SIL Open Font License).

## Scripts

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm run start   # serve the production build
npm run lint
```

## Before launch

- Replace the placeholder address in `src/config/site.ts`. Every "Email us", "Book a call" and snapshot request uses it.
- Set `SITE_URL` to the production origin, for example `https://www.example.com`. Canonical and hreflang URLs are built from it. On Vercel the production domain is used automatically.
- The ReBound Nordic case study shows marked slots for a testimonial and a logo. Once the client approves them, add the quote to `startups.caseStudy.testimonial` in both dictionaries and the logo to `caseStudies` in `src/config/site.ts`. To launch without them, set `showPlaceholderSlots` to `false`; the slots then disappear.

## Upgrade notes

- **The 404 page relies on an experimental Next.js feature.** `src/app/global-not-found.tsx` needs `experimental.globalNotFound` in `next.config.ts`. It is the only way to server-render a 404 while the root layout lives under `/[lang]`. Recheck it on every Next.js upgrade: the flag may be renamed, stabilised or removed. After upgrading, confirm that an unknown URL such as `/en/missing` returns status 404 with the bilingual page in the HTML.

## Structure

```
src/
  proxy.ts                 locale detection and slug redirects
  app/
    [lang]/                root layout (<html lang>), one folder per page
      layout.tsx           fonts, header, footer, base metadata
      page.tsx             welcome page
      startups/  schools/  ecoles/
    global-not-found.tsx   bilingual 404 for every unmatched URL
    fonts.ts  globals.css  icon.svg
  components/              header, footer, buttons, dither, pixel art
  config/site.ts           brand name, contact email, site URL
  i18n/
    dictionaries/en.ts     every English string
    dictionaries/fr.ts     every French string
    config.ts              locales, slugs, path helpers
    metadata.ts            titles, descriptions, canonical, hreflang
    typeset.ts             curly apostrophes, French non-breaking spaces
  styles/tokens.css        every design token
```

## Copy

- All copy lives in `src/i18n/dictionaries/`, one file per language. Components contain no strings.
- `fr.ts` is typed against `en.ts`, so a missing French key fails the type check.
- Write ordinary spaces before `: ; ? !` in French. The typesetter inserts the correct non-breaking spaces at load time.

## Design rules

- All values come from `src/styles/tokens.css`. Components use semantic tokens such as `--color-text`, `--text-h2` and `--space-6`, never raw values.
- Sections darken toward the footer. Each change of depth uses an ordered-dither band (`<Dither>`) instead of a gradient.
- Dark sections set `data-tone="dark"`, which remaps the semantic colour tokens. Sections declare their background through `--color-bg` so focus rings match it.
- Coral is reserved for calls to action and key highlights, always as a fill behind ink text.
- Departure Mono is set at 11px multiples, where it renders on its pixel grid.
- Motion is minimal, uses `steps()` for pixel details, and respects `prefers-reduced-motion`.
