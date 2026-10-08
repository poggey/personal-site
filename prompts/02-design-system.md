# Phase 02: Design system and style tile

Read `CLAUDE.md` (especially "Design direction v2") and the white paper sections "Concept", "Design system", "Motion and interaction" and "References and inspirations". Where they differ, `CLAUDE.md` wins. Plan, then wait.

**Goal:** a coded design system and a `/styleguide` page that I approve before any section is built.

## Tasks

1. **Design plan first**, in `docs/DESIGN-PLAN.md`: palette (named hex values), type roles and scale, a layout concept with ASCII wireframes for the hero, fact sheet, a case-study row, Positions and the interlude, and the principles. Then review the plan against the traits listed in "Design direction v2": for each part, ask whether it reads as the generic default for a student portfolio. Revise anything that does, and note what changed and why. **Show me the plan and wait for approval before writing code.**
2. **Fonts:** load Archivo (weight and width axes) and Newsreader (weight and optical size) with `next/font/google`. Verify tabular lining figures in both and the available width range. Report what you found. If anything fails, stop and propose alternatives.
3. `src/styles/tokens.css`: colour tokens for light and dark (via `prefers-color-scheme` and `[data-theme]`), type scale (clamp based), spacing, grid, radii (justify each one), motion tokens. `globals.css`: reset, base type, focus ring in biro, selection colour, reduced-motion handling.
4. Primitive components: Container/Grid, Heading, Text, Sidenote (margin note on desktop, inline toggle on mobile), FactTable, Figure (chart wrapper with caption and source line), Link, Button, Toast, DepthDial (UI only), ProgressRail (UI only).
5. `/styleguide` route (noindex and excluded from the sitemap): colours with computed contrast ratios shown, type specimens at every step, spacing, each primitive in every state, light and dark side by side, a sample fact sheet and a sample case-study row using real content.
6. Take Playwright screenshots of `/styleguide` at 375 and 1440 in both themes, save them to `docs/private/screens/02/`, look at them, and critique them against "Design direction v2". Fix what fails. Remove one thing that doesn't earn its place.
7. If the Figma MCP is available, ask whether I want these tokens created as Figma variables. Only do it if I say yes, and ask which file.

## Done when

Checks pass, the style tile is at `localhost:3000/styleguide`, and you have listed the decisions I need to approve.
