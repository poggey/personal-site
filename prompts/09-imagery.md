# Phase 09: Imagery

Read `CLAUDE.md` ("Imagery and Higgsfield"). Plan, then wait.

## Real project imagery

1. `scripts/capture.ts` (Playwright): screenshots of each live project at 1440x900 and 390x844, in both themes where they exist: risk-dashboard-padraig.streamlit.app, stirling-report.vercel.app, f1-pace-analyser.vercel.app, plus The Slate and Escape Velocity if I give you URLs (ask). Wait for charts to render; hide platform chrome where possible.
2. Short muted loops (5 to 8 seconds) of the key interaction in each featured project, recorded with Playwright and converted with ffmpeg to WebM (VP9) and MP4 (H.264), each under 1.5MB, with a poster frame. If ffmpeg isn't installed, tell me how to install it.
3. Optimise stills to AVIF and WebP, with `next/image` sizes set. Write alt text for each that says what the image shows.
4. **My photos:** I'll put originals in `design/photos/`. Convert them to duotone using the print and paper tokens. Ask before using any photo.

## Higgsfield (approved uses only)

5. Draft `design/IMAGE-PROMPTS.md` with prompts for: the Awwwards cover (1600x1200) showing the site on a neutral surface, two detail mockups, and an optional social share background. **Show me the prompts and wait for approval before calling `higgsfield-generate`.** Save outputs to `design/higgsfield/` only.

## Done when

The page weight budget still holds, no image lacks alt text, nothing from `design/` ships without approval, and you've given me a review list.
