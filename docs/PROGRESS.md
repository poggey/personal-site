# Progress

One entry per phase: what was built, what was decided, what is left.

## Phase 00: Project setup (2026-10-08)

**Built**

- Next.js 16.4.0 (App Router, Turbopack, Cache Components on), React 19.3.0, TypeScript 5.9.3 strict with `noUncheckedIndexedAccess`, `src/` directory, `@/*` alias, no Tailwind. `.nvmrc` is 24 (current LTS).
- All approved dependencies, pinned to exact versions. Companions added with approval: `eslint-config-next`, `eslint-config-prettier`, `@mdx-js/loader`, `@mdx-js/react`, `@types/mdx`, `@types/node`, `@types/react`, `@types/react-dom`, `@types/d3-*`.
- Folder structure from CLAUDE.md with placeholders: content stubs (`profile.ts` validated by zod, `flags.ts` with the CLAUDE.md defaults), stub routes for `/cv`, `/work/[slug]`, `/styleguide` (404 in production) and `not-found.tsx`, `mdx-components.tsx`, token and global CSS skeletons, script stubs.
- `scripts/check-copy.ts`: parses TS/TSX with the TypeScript compiler and checks only user-facing text (JSX text, string and template literals; comments and import paths skipped), plus MDX/Markdown in full. Flags em dashes, en dashes between letters or digits, and the banned words (with inflections; "robust" allowed before "standard errors"). Prints `file:line:col`, exits 1 on any hit. Runs with plain `node` (Node 24 strips types), so no `tsx` dependency.
- Vitest (7 unit tests for the checker, including a CLI exit-code test). Playwright with projects at 375x812, 768x1024 and 1440x900 against the production build; one test checks the home page heading and runs axe (WCAG 2.2 AA tags).
- `.gitignore` merged with the Next.js defaults; every original line kept. `git check-ignore` confirms `docs/private/`, `design/higgsfield/` and `.env*` are ignored.

**Decided**

- TypeScript 5.9.3 and ESLint 9.39.5 rather than the newest majors (TS 7, ESLint 10): `create-next-app` for Next 16.4 pins `typescript ^5` and `eslint ^9`, so these are the versions Next is tested against.
- `"type": "module"` in `package.json` so Node runs the `.ts` scripts as ES modules without a warning.
- Padraig cleared the Raymond James figures and fund names, and Greenline HSE, for publication. Both are kept low-key: `flags.showRaymondJamesFigures` and `flags.showGreenline` are now `true`, and CLAUDE.md and DECISIONS.md are updated.
- The intercepting route for case-study panels is deferred to phase 04, when there is a panel to show. `/work/[slug]` returns one placeholder param because Cache Components requires at least one at build time.
- Prettier ignores the handwritten docs (`CLAUDE.md`, `START-HERE.md`, `prompts/`, `docs/PROGRESS.md`, `design/README.md`) and the generated `AGENTS.md`.

**Left over**

- `npm` reports a pending install script for `unrs-resolver` (used by ESLint's import resolver). Lint works without it.
- Lighthouse CI config arrives in phase 10; `@lhci/cli` is installed.

## Phase 01: Content lock (2026-10-08)

**Built**

- `src/content/schema.ts`: zod schemas for profile, fact sheet, positions, education, toolkit, interests, projects, flags, plus approach, specialism, interlude and microcopy so every word on the page lives in `src/content/`.
- Content files filled from the sources only. Months stored as `YYYY-MM` and shown through `src/lib/dates.ts` ("Jun 2022", "Jun 2022 to present").
- `src/content/projects.ts` (metadata for ten projects) and `src/content/projects/<slug>.mdx` (panel prose under the five fixed headings, every paragraph marked DRAFT). Palettes read from each project's repo; risk-dashboard, portfolio-optimiser, built-by, shariah-research and greenline have none.
- `src/content/index.ts`: the single loader. Each file parses itself; the loader checks cross-file references (skills, interests, approach, featuredThird) and derives the featured and Index lists. `page.tsx` imports it, so a schema error fails `next build` (confirmed by breaking a date).
- Tests: content loads, skills map to real projects, every project has a status and a link or `privateOnly`, private projects carry no links, each MDX has the five headings in order, no phone number, copy check passes on content, date formatting.
- `docs/private/CONTENT-CHECK.md`: source line for every figure, a conflicts table and a list of unsourced items.

**Decided**

- Project metadata lives in TypeScript, not MDX front matter: no extra MDX plugin, and Vitest reads it directly.
- Featured: risk-dashboard and stirling are fixed; the third comes from `flags.featuredThird`.
- Conflicts resolved in favour of the CV or DECISIONS.md defaults (see CONTENT-CHECK.md).

**Left over**

- Padraig to rewrite DRAFT copy and confirm the open items in CONTENT-CHECK.md (Parkdean cohort size, glossary wording, the "1" fact sheet row).
- `shariah-research.mdx` shows the bps figures directly; if `flags.showRaymondJamesFigures` is ever turned off, that panel needs a flag-aware component (phase 04).
- Fact sheet tenure and GitHub count become build-time computations in phase 03.

## Phases 02 to 10: full build in one pass (2026-10-08)

Padraig asked for every remaining phase to be carried through to a finished product first, with questions afterwards. The per-phase plan-and-wait step was skipped for that reason; every decision that is Padraig's to make is listed under "Left over" rather than resolved.

**Built**

- **02 Design system.** `docs/DESIGN-PLAN.md`; `tokens.css` (palette light and dark, a 1.25 type scale fluid between 375 and 1440, 8px spacing, grid, two radii, motion); `globals.css` (focus ring in biro, selection, depth rules, reduced motion). Fonts through `next/font`: Archivo (wght 100 to 900, wdth 62 to 125) and Newsreader (wght 200 to 800, opsz 6 to 72). Both have `tnum`; neither has old-style figures, so lining is the default. Primitives: Container, Section, Heading, Text, Sidenote, FactTable, Figure, TextLink, Button, Toaster, DepthDial, ProgressRail. `/styleguide` (dev only, noindex) shows computed contrast, type, spacing and primitives in light and dark.
- **03 Static build.** Every section from `src/content/`; the depth dial works (sessionStorage and `?depth=`, set before first paint). Positions drawn to scale with `d3-scale`; Toolkit is a real table (a list on narrow screens).
- **04 Panels and routes.** Intercepting route `@panel/(.)work/[slug]` in a native modal `<dialog>` (focus trap, Esc, back button, focus return); standalone `/work/[slug]`; all slugs static. Panels wear each project's palette (`src/content/projects/palettes.ts` turns a palette into tokens and keeps AA; tested). `/cv` prints to one A4 page via `scripts/cv-pdf.ts` (postbuild), which fails on a second page or a bullet past the margin. Designed 404.
- **05 Interlude.** `scripts/export-optimiser.py` reproduces the notebook: max Sharpe 0.762531 (12.18% return, 10.73% volatility, 56.06% SGLN, 43.94% VWRL), equal weight -0.313594, min variance -0.331387. `src/lib/portfolio.ts` matches to 4 dp (tested). Beat my Sharpe loads its chunk and data only near the section.
- **06 Hero.** OGL point field over the real `<h1>`, sampled from the rendered text, spring constants in `src/lib/point-field.ts` (tested), cursor push within 120px, ScrollTrigger exit, pause off screen, a 30fps guard, and the intro counter tied to fonts, WebGL and first frame (max 1.6s, once per visit, never under reduced motion). The width-axis animation was dropped: the canvas replaces the text while it would play, so it can't be seen.
- **07 Interactions.** Lenis (fine pointers only, synced to ScrollTrigger), Index cursor preview (lerp 0.15, clip reveal), Positions expand and dim, Toolkit row and column highlight, command palette (Cmd/Ctrl+K, "/", "?" for shortcuts; combobox pattern), progress rail, email toast, crosshair readout on the interlude chart, console note left out (see below).
- **08 Live data.** Stirling from `/api/editions/latest` (shape read from a real edition, fixture in `tests/fixtures/`), 30-minute cache, committed fallback. GitHub public repo count at build (forks excluded, falls back to content). Footer: London time without hydration mismatch, last commit date and hash.
- **09 Imagery.** `scripts/capture.ts`; real screenshots of Risk Dashboard, Stirling, APEX and Escape Velocity with alt text, used in the Index preview and the panels.
- **10 QA and launch.** axe in e2e (zero serious or critical at three widths), keyboard walk, `lighthouserc.json` with the budgets, `.github/workflows/ci.yml`, sitemap, robots, JSON-LD Person, Open Graph images from content (one per case study in its palette), Vercel Analytics events, README, `docs/LAUNCH.md`.

**Checks:** lint, 48 unit tests, build, `check:copy` and 46 e2e tests pass. Lighthouse (mobile, local): accessibility 100, SEO 100, best practices 96 locally (the analytics script 404s off Vercel; now Vercel-only), performance 0.89 to 0.93. LCP 1.5 to 2.7s with real throttling, 3.0 to 3.5s simulated; CLS 0; TBT 40 to 130ms.

**Decided**

- The README and `.env.example`: CLAUDE.md forbids committing `.env*`, so environment variables are documented in the README and `.env.example` stays local.
- built-by badge vendored in `public/vendor/` with two local edits (no dash in its aria-label, no monospace glyph) and loaded only when the footer is in view, so it never covers the hero.
- No shared-element panel transition: the page stays mounted under the panel, so a shared view-transition name would exist twice. Panels fade and rise instead (instant under reduced motion).
- No section numbers; Approach principles are not a sequence.
- Fact sheet footnotes are a third table column on wide screens and sidenote toggles on narrow ones.

**Left over (Padraig to decide)**

- LCP misses the 2.0s budget in Lighthouse's simulated run, so CI's Lighthouse step will fail. Options are in the review list.
- The Slate and Marginalia live URLs are behind Vercel login; Risk Dashboard 390-wide and dark captures and all video loops are missing (ffmpeg not installed: `brew install ffmpeg`).
- Higgsfield prompts await approval; no photos in `design/photos/` yet.
- All DRAFT copy, including the new interface text in `microcopy.ts`, the visual captions in `visuals.ts` and the README.
- The console note for developers was not added (one line, waiting on wording).
