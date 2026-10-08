# Resolution: Padraig Middleton's personal site

A one-page personal site for Padraig Middleton (BSc Economics and Finance, Queen Mary University of London). It reads as a CV in 30 seconds, explains itself in 5 minutes, and is built to award standard.

The full brief is `docs/private/WHITEPAPER.md`. This file is the constitution. **Where this file and the white paper disagree, this file wins.** The design direction was revised after the white paper was written (see "Design direction v2").

## Sources of truth

- **Facts:** only `docs/private/sources/` (CV, application experience copy, projects portfolio reference) and `docs/private/DECISIONS.md`. Nothing else, including your own knowledge.
- **Content in code:** only `src/content/`. Components never hard-code facts, figures, dates or names.
- If a fact is missing, ambiguous, or the sources disagree: stop and ask. Never invent, round, or improve a figure.

## Non-negotiables

1. Every figure, date and claim on the site traces to a source line, recorded in `docs/private/CONTENT-CHECK.md`.
2. `docs/private/` is gitignored. Never commit it, quote it in public files, or deploy it. The site never shows a phone number, a home address, or links to Claude chats.
3. Copy rules (all user-facing text, alt text, metadata, README):
   - No em dashes, and no en dashes used as dashes. Use commas, colons, full stops or parentheses. `npm run check:copy` enforces this.
   - British English.
   - Numbers first. Short sentences in the skim layer.
   - No self-praise adjectives (passionate, driven, motivated), no soft-skill lists, no defensive framing, no overexplaining.
   - Banned words: delve, leverage, seamless, unlock, elevate, cutting-edge, journey, "in today's", synergy, robust (allowed only as "robust standard errors").
   - Limits are stated plainly as findings ("Where it breaks"), never as apologies.
   - Facts can be reworded but never changed relative to the CV.
   - Never rewrite copy Padraig has written himself unless asked. Copy you draft is marked `{/* DRAFT */}`.
4. Code must be explainable line by line in an interview. Small readable modules over clever ones. Comments explain why, not what. No dependency outside the approved list without asking.
5. WCAG 2.2 AA and reduced motion are built in from the first commit.
6. The performance budgets below fail the build. They are not aspirations.

## Approved stack

Next.js (App Router) with TypeScript strict; CSS Modules plus CSS custom properties (no Tailwind); `gsap` (ScrollTrigger, Flip); `lenis`; `ogl`; `d3-scale`, `d3-shape`, `d3-array` only; `zod`; MDX (`@next/mdx` or `next-mdx-remote`); `@vercel/analytics`; `vitest`; `@playwright/test`; `@axe-core/playwright`; `@lhci/cli`; `prettier`; `eslint`. Fonts through `next/font/google` (self-hosted at build). Python 3 (pandas, numpy, yfinance) for data export scripts in `scripts/` only.

## Structure

```
src/app/            page.tsx, intercepting route for /work/[slug], work/[slug], cv/, not-found.tsx, styleguide/ (dev only)
src/content/        schema.ts, profile.ts, facts.ts, positions.ts, education.ts, skills.ts, interests.ts, flags.ts, projects/*.mdx, data/*.json
src/components/     one folder per section and per primitive: Component.tsx + Component.module.css
src/lib/            portfolio maths, stirling fetcher, github, depth state
src/styles/         tokens.css, globals.css
public/             images, video, cv/Padraig-Middleton-CV.pdf
scripts/            export-optimiser.py, check-copy.ts, cv-pdf.ts, capture.ts
tests/              unit/, e2e/, fixtures/
design/             design plan notes, IMAGE-PROMPTS.md, higgsfield/ (gitignored), photos/ (gitignored)
docs/               PROGRESS.md, DESIGN-PLAN.md, LAUNCH.md (public); private/ (gitignored)
```

## The page

Top to bottom: Intro, Hero, Fact sheet, Approach, Selected work (three case studies), Interlude (Beat my Sharpe), Index, Positions, Specialism (Islamic finance), Education, Toolkit, Off the clock, Contact and footer. Section detail: white paper "Section by section".

Routes: `/work/[slug]` case-study panels (open over the page via an intercepting route; standalone page when visited directly), `/cv` print page plus generated PDF, a designed 404.

**Depth dial:** 30 sec / 3 min (default) / 10 min. Every section declares what it shows at each depth. State persists for the visit (sessionStorage) and accepts `?depth=30s|3m|10m`.

## Design direction v2 (supersedes the white paper on colour, type, labels and motion)

**Why it changed.** The white paper's tokens (warm cream background, vermilion accent, monospace uppercase labels, middle-dot meta strings, hairline broadsheet rules, one italic word per headline, count-ups, text scrambles on every label) are among the most common traits of AI-generated pages. Padraig has rejected directions before for looking AI-generated. The concept, structure and interactions are unchanged.

**Concept: Resolution, as print plus annotation.** The page is a clean printed record. Padraig's own marks are the single accent, like blue biro on a printout. The accent only ever means "a person's mark" or "the signal": sidenote markers, the reader's portfolio dot in the interlude, highlights, focus rings, the active depth setting, links.

**Colour** (light / dark)

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| paper | #F3F4F2 | #000000 | Background. Cool copier-paper white, never cream |
| print | #000000 | #E6E7E4 | Text and data |
| pencil | #5B5F63 | #9A9EA2 | Secondary text (verify 4.5:1) |
| rule | #D5D8D6 | #26282A | Only where a line encodes data: table rows, chart axes |
| biro | #2340E0 | #6F86FF | The accent (about 6:1 on paper, so usable for link text) |
| biro-wash | biro at 10% | biro at 18% | Highlights, selected rows |

Inside case-study panels, switch to that project's own tokens (read them from its repo). No gradients. No shadows except the focus ring and the open panel. No film grain unless the style tile proves it earns its place.

**Type** (two clearly distinct families)

- **Archivo** (variable: weight and width axes) for the name, headlines, UI and figures. Width is a design device: the hero name can settle from compressed to its final width as part of the resolve.
- **Newsreader** (variable: weight and optical size) for body copy, sidenotes and case-study prose. Line height about 1.6, measure under 70 characters.
- No monospace anywhere.
- Labels in sentence case. No tracked uppercase eyebrows, no middle-dot meta strings, no arrow characters appended to link or button text, no single italic or coloured word in headlines.
- All numbers in tabular lining figures (`font-variant-numeric: tabular-nums lining-nums`). Verify both fonts support this in phase 02.
- Choose a modular type scale in phase 02 and document it in `tokens.css`.

**Layout.** 12-column grid, max width 1440px, outer margins 24 / 48 / 80px, gutter 24px, 8px spacing scale. Hierarchy comes from size and space, not boxes. No grids of identical rounded cards; no single border-radius applied to everything. Numbering only where content is a real sequence (the Positions timeline, interlude steps); sections are not numbered. The fact sheet is a real factsheet table (label left, value right, tabular figures, as-of date, sources line), not a grid of giant numbers with small labels.

**Motion.** One orchestrated moment: the hero resolve and its scroll exit. Everything else answers a user action: opening panels, expanding rows, dragging sliders, hover previews, changing depth. No scroll-triggered fade-and-slide on sections, no count-ups, no text scrambles, no magnetic buttons, no custom cursor (a crosshair value readout over charts is allowed). Charts render already drawn.
Tokens: `--ease-settle: cubic-bezier(0.16, 1, 0.3, 1)`, `--ease-snap: cubic-bezier(0.65, 0, 0.35, 1)`, durations 200 / 400 / 800ms.
Reduced motion: no intro, static hero name, no Lenis, instant state changes.

**Spend boldness in three places only:** the hero point-field resolve, the Beat my Sharpe interlude (the only dark section), and case-study panels in each project's own palette. Everything else stays quiet and disciplined. Before finishing any visual work, remove one thing that doesn't earn its place.

## Budgets (mobile, mid-range device, 4G; Lighthouse CI fails the build)

LCP under 2.0s, INP under 200ms, CLS under 0.05, first-load JS under 150KB gzipped (OGL, GSAP plugins and the interlude lazy-loaded), page weight before interaction under 1MB excluding lazy video. Hero holds 60fps on desktop and falls back to static text below 30fps. Lighthouse 95+ in all four categories.

## Defaults for open decisions

Never resolve these yourself. The current values live in `src/content/flags.ts` and `docs/private/DECISIONS.md`.

- Parkdean: "around 25 advisors".
- Zaltek: "led the migration onto it". No automation claim.
- Raymond James Shariah figures (7 bps, 108 bps) and fund names: cleared to publish, `flags.showRaymondJamesFigures = true`. Keep it low-key: a small example inside Specialism, never its own section or a headline figure.
- Greenline HSE: cleared to list, `flags.showGreenline = true`. Keep it low-key: a small entry, never featured.
- Third featured case study: `flags.featuredThird = "the-slate"` (alternative `"escape-velocity"`).
- Portrait: none until `public/images/portrait.jpg` exists.
- APEX: in the Index, plus a link from "Off the clock" (Formula 1). Not featured.

## Imagery and Higgsfield

On the page: real screenshots and screen recordings of Padraig's projects, and his own photos, only.
Higgsfield (`higgsfield-generate`) is allowed for: the award submission cover and mockups, a social share background if approved, and clearly named design placeholders (`design/higgsfield/placeholder-*`) that must be replaced before launch. Never for portraits, project screenshots, photos of real events, or anything presented as real.
Before any generation: write the prompt in `design/IMAGE-PROMPTS.md`, get Padraig's approval, then generate. Outputs go to `design/higgsfield/` and move to `public/` only when approved.

## Figma

If the Figma MCP is available and Padraig links frames, read them before building that section and match them. If a frame conflicts with this file, ask. Create Figma variables or files only when asked.

## Workflow

- One phase per session, from `prompts/NN-*.md`. Start each session by reading this file, the phase prompt, `docs/PROGRESS.md`, and the white paper sections the prompt names.
- Plan first and wait for approval before editing.
- Small commits with clear prefixes (feat, fix, content, style, test, chore). Never commit `docs/private/`, `.env*` files, or `design/higgsfield/`. Ask before pushing or creating remote resources.
- Before saying a phase is done: `npm run lint`, `npm run test`, `npm run build` and `npm run check:copy` all pass. For visual work, take Playwright screenshots at 375, 768 and 1440 wide, look at them, and check them against Design direction v2.
- End every phase by appending to `docs/PROGRESS.md` (built, decided, left over) and giving Padraig a short "Please review" list with URLs and file paths.
- When unsure, ask one specific question instead of guessing.
