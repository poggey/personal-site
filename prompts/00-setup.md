# Phase 00: Project setup

Read `CLAUDE.md` first. Plan, then wait for my approval.

**Goal:** an empty but production-ready Next.js project with tooling, folders and checks in place. No UI design yet.

## Tasks

1. Scaffold in the current folder, keeping `CLAUDE.md`, `START-HERE.md`, `prompts/`, `docs/`, `design/` and `.gitignore`: latest Next.js, TypeScript strict, App Router, `src/` directory, ESLint, import alias `@/*`, no Tailwind. Add `.nvmrc` with the current Node LTS.
2. Install only the approved dependencies from `CLAUDE.md`, with exact versions.
3. Create the folder structure from `CLAUDE.md`, with placeholder files where needed.
4. `package.json` scripts: `dev`, `build`, `start`, `lint`, `format`, `test` (vitest), `e2e` (playwright), `check:copy`, `cv:pdf` (stub for now).
5. `scripts/check-copy.ts`: scan `src/content/**`, `src/components/**`, `src/app/**` (JSX text and string literals), MDX files and `README.md` for em dashes (U+2014), en dashes (U+2013) used between words or numbers, and the banned words list in `CLAUDE.md`. Print `file:line` for each hit and exit 1 if any. Add a unit test for it.
6. Configure Vitest and Playwright, with one passing test each. Playwright projects at 375x812, 768x1024 and 1440x900.
7. Merge `.gitignore` with the Next.js defaults without losing any existing line. Prove the private folder is ignored: `git check-ignore -v docs/private/sources/Padraig_Middleton_CV.pdf`.
8. `git init` if needed and make the first commit. If the GitHub CLI is installed and logged in, ask me before creating a public repo `poggey/personal-site` and pushing. Otherwise give me the exact commands.
9. Add a Phase 00 entry to `docs/PROGRESS.md`.

## Done when

`npm run lint`, `test`, `build` and `check:copy` pass; `git ls-files | grep -i private` returns nothing; and you have listed what you installed and why.
