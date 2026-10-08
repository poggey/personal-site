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
