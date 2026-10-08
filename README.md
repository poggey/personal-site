<!-- DRAFT: Padraig to rewrite in his own voice -->

# Resolution

The personal site of Padraig Middleton, BSc Economics and Finance at Queen Mary University of London.

The concept is resolution: the page opens as noise and settles into a clear record of one person, because most of what I build is about separating signal from noise in financial data. It reads as a CV in 30 seconds and explains itself in 5 minutes. The depth dial at the top right chooses which.

## What is on the page

- **Hero:** the name drawn by about 12,000 points (OGL) that settle from a Gaussian scatter onto the letterforms. The `<h1>` stays real text underneath.
- **Fact sheet:** a fund-factsheet table. Zaltek tenure and the GitHub repo count are computed at build time.
- **Selected work:** three case studies. Each opens as a full-screen panel at its own URL (`/work/<slug>`), in that project's own palette.
- **Beat my Sharpe:** the Portfolio Optimiser as a 60-second game. Eight sliders, 2,000 random portfolios, the efficient frontier, and the maths in the browser.
- **Live data:** today's Stirling edition, refreshed every 30 minutes, with a committed fallback.
- **`/cv`:** a one-page A4 CV built from the same content and printed to PDF at build time.

## Architecture

```
src/content/      every fact and word on the site, validated with zod at build time
src/app/          routes: page, @panel/(.)work/[slug] (intercepted panel), work/[slug], cv, 404
src/components/   one folder per section or primitive: Component.tsx + Component.module.css
src/lib/          portfolio maths, point-field physics, Stirling and GitHub fetchers, depth state
src/styles/       tokens.css (the design system) and globals.css
scripts/          optimiser export (Python), CV PDF, copy checker, screenshot capture
tests/            Vitest unit tests and Playwright end-to-end tests at 375, 768 and 1440 wide
```

- **One source of truth.** Components never hard-code a fact. `src/content/index.ts` is the only loader and checks references across files, so a bad value fails `next build`.
- **Depth without re-rendering.** The dial writes `<html data-depth>`; CSS hides content marked `data-min-depth`. A small inline script sets it before first paint from `?depth=` or the visit's stored choice.
- **Motion answers the reader.** The hero resolve is the one orchestrated moment. Everything else responds to a click, a drag or a key. Reduced motion gets no intro, no canvas and no smooth scrolling.
- **Lazy by default.** OGL, GSAP, Lenis, the interlude and its data, and the command palette all load after first paint or on demand.

## Running it

Node 24 or later (see `.nvmrc`).

| Command | What it does |
| --- | --- |
| `npm run dev` | Local dev server at localhost:3000 (`/styleguide` is dev only) |
| `npm run build` | Production build, then prints `/cv` to `public/cv/` |
| `npm run lint` | ESLint |
| `npm run test` | Unit tests (Vitest), no network calls |
| `npm run e2e` | Playwright and axe at 375, 768 and 1440 wide |
| `npm run check:copy` | Fails on em dashes, en dashes used as dashes, and banned words |
| `npm run lhci` | Lighthouse CI against the budgets in `lighthouserc.json` |
| `npm run capture` | Screenshots of the live projects into `public/images/projects/` |
| `npm run stirling:fallback` | Refreshes the edition shown if Stirling is unreachable |
| `python3 scripts/export-optimiser.py` | Re-exports the interlude data from Yahoo Finance |

Environment variables, all optional:

| Variable | Use |
| --- | --- |
| `GITHUB_TOKEN` | Lifts the GitHub API rate limit for the build-time repo count. Public data only |
| `NEXT_PUBLIC_SITE_URL` | The canonical origin once the domain is live |

## Decisions and trade-offs

- **CSS Modules and custom properties, not a utility framework.** The design system is small enough to read in one file (`src/styles/tokens.css`).
- **No chart library.** Charts are hand-written SVG with `d3-scale` and `d3-shape` for the maths only, so every mark can be explained.
- **A native `<dialog>` for panels and the palette.** Focus trapping, Esc and the inert page behind come from the browser.
- **The optimiser's numbers are exported, not recomputed live.** `scripts/export-optimiser.py` reproduces the notebook (max Sharpe 0.7625 at 12.18% return and 10.73% volatility) and the unit tests check the TypeScript maths against it to 4 decimal places.
- **Where it breaks.** The interlude uses one sample of five years, so its optimum fits that sample's noise. That is the point of the game.

## Credits

Typefaces: Archivo (Omnibus-Type) and Newsreader (Production Type), both under the SIL Open Font License. Libraries: Next.js, React, GSAP, Lenis, OGL, d3-scale, d3-shape, zod, Vercel Analytics. Data: Yahoo Finance via yfinance; Stirling's open edition API.

Built with AI assistance (Claude Code). Every line has been read and can be explained.
