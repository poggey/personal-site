# Phase 08: Live data

Read `CLAUDE.md` and the white paper "Technical specification" (Live data). Plan, then wait.

## Tasks

1. **Stirling:** inspect github.com/poggey/stirling-report to find where daily editions are mirrored (the `/data` folder written by its GitHub Action) and the exact edition JSON shape. Do not assume field names. Write a zod schema from a real file and save that file as a test fixture.
2. `src/lib/stirling.ts`: fetch the latest edition (number, date, Story of the Day headline, the four ledger moves, link). Revalidate every 30 minutes. Validate with zod. On any failure, fall back to the last good edition captured at build time and show its "as of" date. It must never break the page.
3. Wire the hero chip and the Stirling case-study mini visual (a small clipping in Stirling's own palette) to it.
4. **GitHub:** count of public repos for poggey, excluding forks, at build time for the fact sheet, falling back to the content value. "Last updated" from the deploy commit (`VERCEL_GIT_COMMIT_SHA` and its date, or `git log` locally).
5. **Footer:** live London time (Europe/London), updating each minute, rendered without hydration mismatches.
6. If a `GITHUB_TOKEN` is needed for rate limits, read it from env and document it in `.env.example`. Never commit a real token.

## Done when

Schema tests run against fixtures, a fallback test simulates a failed fetch, unit tests make no network calls, and you've given me a review list.
