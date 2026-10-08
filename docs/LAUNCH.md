# Launch

The final checklist. Tick each item when it is done.

## Before deploying

- [ ] Rewrite every `DRAFT` marker in your own voice (`grep -rn DRAFT src README.md`)
- [ ] Confirm the open items in `docs/private/CONTENT-CHECK.md`
- [ ] Check `/cv` and `public/cv/Padraig-Middleton-CV.pdf` against your real CV
- [ ] Approve or reject the Higgsfield prompts in `design/IMAGE-PROMPTS.md`
- [ ] CI green on main (lint, test, copy, build, e2e, Lighthouse)

## Deploying on Vercel

1. vercel.com, Add New, Project, import `poggey/personal-site`. The framework (Next.js) is detected; leave the build command as `npm run build`.
2. Environment variables (Settings, Environment Variables): `GITHUB_TOKEN` (optional, a fine-grained token with no permissions) and, once the domain is live, `NEXT_PUBLIC_SITE_URL`.
3. Deploy. Check the preview URL on your phone.
4. Enable Web Analytics (Analytics tab). No cookie banner is needed.
5. Optional: a daily redeploy (Settings, Git, Deploy Hooks, then a scheduled GitHub Action or cron calling the hook) so the GitHub count stays current. Stirling refreshes itself every 30 minutes without one.

## Domain

1. Buy the domain (padraigmiddleton.com or .co.uk).
2. Vercel project, Settings, Domains, add it, and set the DNS records Vercel shows at your registrar.
3. Set `NEXT_PUBLIC_SITE_URL` to `https://<domain>` and redeploy, so canonical links, the sitemap and Open Graph images use it.

## Real-device tests

- [ ] An older iPhone (Safari): intro, hero resolve, depth dial, a panel open and close (swipe back), Beat my Sharpe sliders, `/cv`
- [ ] A mid-range Android (Chrome): the same, plus check the hero falls back to the plain name if it stutters
- [ ] VoiceOver: the hero reads "Padraig Middleton, heading level 1"; the fact sheet reads as a table; each interlude slider reads "Gold 13%"; a panel announces its title and Esc closes it
- [ ] Keyboard only: Tab through the whole page once, open the palette with "/", open and close a panel

## After launch

- [ ] Add the link to your CV, LinkedIn (Featured and contact info) and GitHub profile README
- [ ] Pin `personal-site` on GitHub
- [ ] Wait a week of stable running, then submit:

| Gallery | Cost | Needs |
| --- | --- | --- |
| Awwwards | Paid | 1600 x 1200 cover, 3 or 4 detail shots, 30-second recording (hero, a panel, the interlude), concept note, credits, repo link |
| CSS Design Awards | Paid | Cover, screenshots, short description |
| The FWA | Free to submit | Recording, screenshots, concept note |
| Godly | Free | URL |
| Siteinspire | Free | URL, categories (portfolio, typography) |
| One Page Love | Free | URL, one screenshot |
| Minimal Gallery | Free | URL |

Submission note, two sentences to adapt: the page opens as noise and resolves into one person's record; a depth dial lets readers choose 30 seconds or 10 minutes, and the interlude turns a portfolio optimiser into a game.
