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
| Legal notice | `/en/legal-notice` | `/fr/mentions-legales` |

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
npm run icons   # rebuild favicon, Apple icon and icon.svg from the pixel mark
```

## Before launch

- Contact addresses live in `src/config/site.ts`. Every "Email us", "Book a call" and snapshot request opens one prefilled email addressed to all of them.
- Set `SITE_URL` to the production origin, for example `https://www.example.com`. Canonical and hreflang URLs are built from it. On Vercel the production domain is used automatically.
- The ReBound Nordic testimonial and logo are hidden until the client approves them. Add the quote to `startups.caseStudy.testimonial` in both dictionaries and the logo to `caseStudies` in `src/config/site.ts`; each appears as soon as it is filled in. To preview the marked empty slots, set `showPlaceholderSlots` to `true`.
- The legal notice lists the publishers, contact addresses, host and a short privacy note. French law (LCEN) usually also expects the publisher's postal address and phone number, a named publication director, and company registration details once the business is registered. Add them to the `legal` section of both dictionaries when available.

## Search and sharing

- `sitemap.xml` lists every page in both languages with hreflang alternates. `robots.txt` allows all crawlers and points to it. Both use `SITE_URL`.
- Each language has its own social card (1200 x 630) for Open Graph and Twitter / X. It is generated at build time from the welcome statement and practice names in the dictionaries, the colours in `tokens.css` and the pixel mark, so it updates with the copy.
- The favicon, Apple touch icon and `icon.svg` are generated from the same mark by `npm run icons`.

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
      startups/  schools/  ecoles/  legal-notice/  mentions-legales/
      opengraph-image.tsx  twitter-image.tsx   social card per language
    global-not-found.tsx   bilingual 404 for every unmatched URL
    sitemap.ts  robots.ts  sitemap with hreflang alternates, robots rules
    fonts.ts  globals.css  favicon.ico  icon.svg  apple-icon.png
  components/              header, footer, buttons, dither, pixel art
  config/site.ts           brand name, contact emails, site URL
  fonts/                   Departure Mono and Geist files + licences (OFL)
  i18n/
    dictionaries/en.ts     every English string
    dictionaries/fr.ts     every French string
    config.ts              locales, slugs, path helpers
    metadata.ts            titles, descriptions, canonical, hreflang
    typeset.ts             curly apostrophes, French non-breaking spaces
  lib/og-image.tsx         social card renderer (with lib/og-config.ts)
  styles/tokens.css        every design token
scripts/generate-icons.mjs builds the icons from the pixel mark (npm run icons)
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
