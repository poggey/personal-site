# Phase 03: Static build

Read `CLAUDE.md`, the white paper sections "Section by section" and "Responsive behaviour", `docs/DESIGN-PLAN.md` and `docs/PROGRESS.md`. If I give you Figma frame links, read them with the Figma MCP first and match them; ask if a frame conflicts with `CLAUDE.md`. Plan, then wait.

**Goal:** the whole page built with real content, responsive and accessible. No motion, no WebGL, no live data yet.

## Sections

Build each as its own component reading from `src/content/`:

- **Hero:** the name as static Archivo text, kicker, hero line, availability status, a placeholder for the Stirling chip.
- **Fact sheet:** a real factsheet table, as in `CLAUDE.md`.
- **Approach:** three principles, each with one concrete example.
- **Selected work:** three case-study rows (featured set from flags); mini visuals as static SVG with real labels for now.
- **Interlude:** the dark section shell and its copy only.
- **Index:** every other project.
- **Positions:** a static timeline drawn to scale with `d3-scale`; rows expand to show outcomes (a button controlling a region).
- **Specialism:** respects `flags.showRaymondJamesFigures`; with it off, show the method only.
- **Education**, **Off the clock**.
- **Toolkit:** the skills matrix as an accessible table with row and column headers (highlighting comes later).
- **Contact and footer:** copy-email button, CV link (placeholder), GitHub, LinkedIn, colophon.

## Requirements

- Semantic landmarks and heading order; one `h1`, the name.
- Every section declares its depth visibility. The DepthDial works now: switching it shows and hides content without layout jumps, state in sessionStorage and `?depth=`.
- Responsive behaviour per the white paper table, built mobile first. Touch targets at least 44px.
- Sidenotes: margin notes on desktop, inline expanders on mobile, reachable by keyboard.
- No facts hard-coded in components.

## Done when

Lint, test, build and `check:copy` pass; an axe scan of the page has zero serious or critical issues; Playwright screenshots of every section at 375, 768 and 1440 are in `docs/private/screens/03/` and you have reviewed them against "Design direction v2" and fixed what failed; and you've given me a review list.
