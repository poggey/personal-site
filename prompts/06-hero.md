# Phase 06: Intro and hero resolve

Read `CLAUDE.md` and the white paper sections "00 Intro", "01 Hero" and "Motion and interaction". This is the one orchestrated moment on the page. Make it excellent and keep everything else quiet. Plan, then wait.

## Tasks

1. **The text stays real.** The `h1` name is real text in the DOM for screen readers and no-JS. The canvas visually replaces it only once WebGL is running.
2. **Targets:** render "Padraig" and "Middleton" in Archivo at their final layout size to an offscreen canvas and sample filled pixels on a grid. About 12,000 points on desktop and 4,000 on mobile, scaled by viewport area, with devicePixelRatio capped at 2.
3. **Renderer:** OGL point renderer, lazy-loaded after first paint. Points start from a Gaussian scatter (the noise) and settle with a damped spring. Stiffness and damping are named constants. If tightening Archivo's width axis in step with the settle helps, prove it with a before and after screenshot pair; otherwise drop it.
4. **Interaction:** points within about 120px of the cursor or a touch are pushed away and re-settle when it leaves. Skip device tilt.
5. **Scroll exit:** as the hero leaves, points loosen, drift down and fade, scrubbed with ScrollTrigger. Pause the render loop when the hero is off screen or the tab is hidden.
6. **Intro:** a counter, "Resolving 0" to "100", tied to real loading (fonts ready, WebGL program compiled, first frame drawn). Maximum 1.6 seconds, skipped on repeat visits in the session and under reduced motion.
7. **Performance guard:** measure frame time over the first second. Below 30fps, cancel WebGL and show the static name, with no layout shift from the swap.
8. **Reduced motion:** no intro, no canvas, static name.

## Done when

A local mobile Lighthouse run shows LCP and CLS within budget (report the numbers); an e2e test confirms the `h1` exists and reduced motion shows no canvas; screenshots of the resolve at 0, 400, 800 and 1600ms are saved; and you've given me a review list.
