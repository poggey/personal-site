# Phase 07: Interactions

Read `CLAUDE.md`, especially the motion rule: apart from the hero, motion only answers a user action. Plan, then wait.

## Tasks

1. Lenis smooth scroll on desktop pointer devices only. Off for touch and reduced motion. ScrollTrigger synced to it.
2. **Panels:** a shared-element transition from the case-study visual to the panel hero (View Transitions API where supported, GSAP Flip as fallback, a plain fade under reduced motion), with the palette crossfade.
3. **Index:** a preview image follows the cursor with a lerp of about 0.15 and a clip reveal. On touch, rows expand in place.
4. **Positions:** rows expand on click and the others dim. Bars may grow once on first view only if that reads as information; otherwise render them drawn.
5. **Toolkit:** hovering or focusing a skill highlights its row and project columns, and the reverse for projects. Clicking a project opens its panel.
6. **Command palette** (Cmd or Ctrl+K, and "/"): jump to a section, open a project, copy email, download CV, set depth, toggle theme. Accessible combobox pattern. "?" shows the shortcuts.
7. **ProgressRail:** current section from IntersectionObserver; a thin bar at the top on mobile.
8. Copy email shows a toast: "Email copied".
9. Crosshair value readout over charts only, in tabular figures.
10. One short line in the browser console for developers, pointing to the GitHub repo.

## Done when

Usual checks pass, plus a keyboard-only e2e walk through the whole page (Tab, Enter, Esc, arrows, the palette). Confirm nothing animates on scroll except the hero and, if kept, the Positions bars. Then a review list.
