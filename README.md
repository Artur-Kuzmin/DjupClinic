# Djup Clinic

Marketing site for Djup Clinic, a consulting studio with two practices:

- **Startup Clinic** (`/startups`): growth and fundraising for early-stage startups.
- **School Audits** (`/schools`): AI search audits for French post-bac schools.

## Stack

- Next.js 16 (App Router) and TypeScript
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

## Structure

```
src/
  app/                  routes: / (welcome), /startups, /schools
    layout.tsx          root layout, fonts, metadata
    globals.css         reset, base type, focus, grid utilities
  components/           shared UI (header, footer, buttons, pixel icons)
  content/              site copy and navigation
  fonts/departure-mono/ Departure Mono woff2 + licence
  styles/tokens.css     every design token: colour, type, spacing, grid,
                        borders, shadows, motion
```

## Design rules

- All values come from `src/styles/tokens.css`. Components use semantic tokens (`--color-text`, `--text-h2`, `--space-6`), never raw hex or pixel values.
- Dark sections set `data-tone="dark"`, which remaps the semantic colour tokens.
- Coral is reserved for calls to action and key highlights, always as a fill behind ink text.
- Departure Mono is set at 11px multiples, where it renders on its pixel grid.
- Motion is minimal and respects `prefers-reduced-motion`.
