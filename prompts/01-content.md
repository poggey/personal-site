# Phase 01: Content lock

Read `CLAUDE.md`, `docs/private/WHITEPAPER.md` (sections "Section by section" and "Copy and tone"), every file in `docs/private/sources/`, and `docs/private/DECISIONS.md`. Plan, then wait.

**Goal:** every fact and every word the site will show lives in `src/content/`, validated, traced to a source, with drafted copy marked for me to rewrite.

## Tasks

1. `src/content/schema.ts`: zod schemas for profile, facts (fact sheet rows: label, value, footnote, source), positions (employer, role, type, start, end or null, location, outcomes, depth visibility), education, skills (each skill mapped to project ids), interests, projects (front matter: slug, title, type, year, status, links, stack, question, result, talkingPoint, palette, featured, privateOnly) and flags.
2. Fill the content files from the sources only. Use the defaults in `CLAUDE.md` for open decisions. Dates as "Jun 2022", ranges as "Jun 2022 to present".
3. One MDX file per project in `src/content/projects/` with the five panel headings: The question, What I built, How it works, What it found, Where it breaks. Draft from the portfolio reference and mark every drafted paragraph with `{/* DRAFT */}`.
4. Put the three hero line options from `DECISIONS.md` in `profile.ts` as `heroLineOptions`, with `heroLine` set to option 1.
5. A content loader that validates everything at build time and fails the build on any schema error.
6. `docs/private/CONTENT-CHECK.md`: a table of every figure, date and claim the site shows, with the source file and the exact source wording. List conflicts between sources separately. Known ones: Parkdean ~25 vs ~30; Zaltek migration wording; Escape Velocity stub data; Portfolio Optimiser equal-weight Sharpe (use -0.31, the README figure).
7. Unit tests: content loads; every skill maps to at least one project; every project has a status and either a link or `privateOnly: true`; `check:copy` passes on content.

Do not build UI.

## Done when

The build passes and you have given me: the conflicts list, the list of DRAFT paragraphs with file paths, and any fact you could not source.
