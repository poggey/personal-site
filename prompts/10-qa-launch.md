# Phase 10: QA, SEO, analytics and launch

Read `CLAUDE.md` and the white paper sections "Technical specification" and "Build plan, awards and open decisions". Plan, then wait.

## Tasks

1. **Accessibility:** axe across the page, panels, `/cv` and the 404 at all three viewports, with zero serious or critical issues. Give me a short manual screen-reader checklist (VoiceOver or NVDA) for the hero, fact sheet, interlude and panels.
2. **Performance:** `lighthouserc` with the `CLAUDE.md` budgets as assertions, and a GitHub Action running lint, test, build, `check:copy`, e2e and Lighthouse on every push and pull request.
3. **Copy audit:** run `check:copy`, then read every user-facing string against the copy rules and list anything that sounds generic or AI-written for me to rewrite. Don't rewrite my copy yourself. Confirm every figure against `docs/private/CONTENT-CHECK.md`. List any remaining `DRAFT` markers.
4. **SEO and sharing:** metadata per route; Open Graph images from `next/og` built from content (one per case study and one for the home page) in the site's design; JSON-LD `Person` (name, alumniOf Queen Mary University of London, worksFor Zaltek Digital, sameAs LinkedIn and GitHub); `sitemap.xml`, `robots.txt`, canonical URLs.
5. **Analytics:** `@vercel/analytics` with custom events `depth_change`, `panel_open`, `interlude_start`, `interlude_target_hit`, `interlude_reveal`, `cv_download`, `email_copy`. No cookies, no banner.
6. **README.md** for the public repo: what it is, the concept in two sentences, architecture, how to run it, decisions and trade-offs, credits for fonts and libraries, and a plain note that it was built with AI assistance and is fully understood. Copy rules apply.
7. **Deployment:** walk me through importing the repo into Vercel (or use the Vercel CLI if installed), environment variables, and adding the custom domain once I've bought it. Don't deploy without asking.
8. `docs/LAUNCH.md` final checklist: real-device tests (an older iPhone and a mid-range Android); the link added to my CV, LinkedIn and GitHub profile; pinned repo; award and gallery submissions (Awwwards, CSS Design Awards, The FWA, Godly, Siteinspire, One Page Love, Minimal Gallery) with the assets each needs.

## Done when

CI is green on main and you've given me the launch checklist.
