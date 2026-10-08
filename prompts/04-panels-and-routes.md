# Phase 04: Case-study panels, /cv and 404

Read `CLAUDE.md` and the white paper sections "Page architecture" and "04 Selected work". Plan, then wait.

## Tasks

1. **`/work/[slug]`:** an intercepting route so clicking a case study opens a full-screen panel over the page. The URL changes, the back button and Esc close it, focus is trapped while open and returned on close. Visiting the URL directly renders a standalone page with the same content and a link back. Statically generate every slug.
2. **Panel content:** the project's MDX with the five fixed headings, then stack, links and "Ask me about".
3. **Project palettes:** read each project's own repo on github.com/poggey for its real colour and type tokens. Record them in `src/content/projects/palettes.ts` with the source file path for each. Don't guess; if a repo has no tokens, ask me. Keep text contrast at AA inside every palette.
4. Index rows and Selected work rows open the panels. Private projects open a panel with no code link.
5. **`/cv`:** a print-first page generated from the same content. One A4 page, close to my preferred CV format (one page, 11pt, no bullet wraps onto a second line). Contact line with email, LinkedIn and GitHub only (no phone). `scripts/cv-pdf.ts` uses Playwright to print `/cv` to `public/cv/Padraig-Middleton-CV.pdf`; wire `npm run cv:pdf` into the build. Verify the PDF is exactly one page.
6. **404:** "This page didn't resolve." with a clear way back. Designed, not the default.
7. Metadata per route (title, description, canonical).

## Done when

Usual checks pass, plus e2e tests for: opening and closing a panel by click, Esc and the back button; a direct load of `/work/<slug>`; `/cv` producing one page. Screenshots of two panels and `/cv`, then a review list.
