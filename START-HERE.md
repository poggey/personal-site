# Start here

This kit builds your personal site in Claude Code inside VS Code, one phase at a time. You type one line per phase; the detail lives in `prompts/`.

## Part 1: one-time setup (about 30 minutes)

1. **Install the tools** (skip any you already have):
   - VS Code, version 1.98 or later
   - Node.js LTS (nodejs.org)
   - Git, and the GitHub CLI (`gh`), then run `gh auth login`
   - Python 3 with `pip install pandas numpy yfinance scipy` (for the interlude data)
   - ffmpeg (for the project video loops in phase 09)
2. **Install Claude Code for VS Code:** Extensions panel, search "Claude Code" by Anthropic, install, sign in.
3. **Make the project folder:** unzip this kit so `CLAUDE.md` sits at the top level of a folder called `personal-site`.
4. **Add the white paper:** open the Resolution white paper in Claude, export it as Markdown, and save it as `docs/private/WHITEPAPER.md`. Your CV, application copy and portfolio reference are already in `docs/private/sources/`. That whole folder is gitignored, so none of it goes public.
5. **Open the folder in VS Code** (File, Open Folder) and open the Claude Code panel.
6. **Check the tools Claude Code can see.** Ask it: `List the MCP servers and tools you have available.` You want to see Figma and Higgsfield (higgsfield-generate). If Figma is missing, add it (the Figma plugin or Figma's MCP server setup) and start a new session.
7. **Make plan mode the default (recommended):** in VS Code settings, set `claudeCode.initialPermissionMode` to `plan`. Otherwise switch to Plan mode with the mode indicator at the bottom of the prompt box before each phase.

## Part 2: the loop, once per phase

1. Start a **new conversation** in the Claude Code panel (fresh context for every phase).
2. Check you're in **Plan mode**.
3. Type: `Read prompts/00-setup.md and carry it out.` (change the number each phase)
4. Claude opens a plan as a document. Read it, add inline comments where you disagree, then approve.
5. Review the diffs as they come in. Run `npm run dev` and look at `localhost:3000` yourself.
6. When Claude gives you its "Please review" list, go through it. Ask for fixes in the same conversation.
7. Make sure it has committed, then push (`git push`) or ask it to.

## Part 3: the phases and your jobs between them

| Phase | Prompt | What Claude Code does | Your job after it |
| --- | --- | --- | --- |
| 00 | `00-setup.md` | Scaffolds the project, tooling, the em dash checker, first commit | Approve creating the GitHub repo |
| 01 | `01-content.md` | Puts every fact into typed content files, drafts case-study copy, writes a fact-check table | **Rewrite every DRAFT paragraph in your own voice.** Resolve the conflicts list. Pick the hero line |
| 02 | `02-design-system.md` | Writes a design plan, then builds tokens, fonts and a `/styleguide` page | **Approve the plan and the style tile.** Then, if you want to, design the hero, fact sheet, one case-study row, the interlude and Positions in Figma, desktop and mobile, and paste the frame links into phase 03 |
| 03 | `03-static-build.md` | Builds every section with real content, responsive and accessible, no motion | Read the whole page on your phone and laptop. Note anything that reads wrong |
| 04 | `04-panels-and-routes.md` | Case-study panels in each project's palette, `/cv` and its PDF, the 404 | Check the CV PDF against your real CV |
| 05 | `05-interlude.md` | Exports the optimiser data, checks it reproduces your README, builds Beat my Sharpe | **Approve the numbers.** Play it for a minute |
| 06 | `06-hero.md` | The intro and the WebGL hero resolve | Judge the feel. Ask for tuning (speed, density, how much the cursor disturbs it) |
| 07 | `07-interactions.md` | Panel transitions, index previews, matrix, command palette, progress rail | Try the whole page with only a keyboard once |
| 08 | `08-live-data.md` | Today's Stirling edition, GitHub counts, London time | Check the Stirling chip matches the live site |
| 09 | `09-imagery.md` | Screenshots and loops of your real projects; Higgsfield prompts for award assets | Put your photos in `design/photos/`. **Approve the Higgsfield prompts** before anything is generated |
| 10 | `10-qa-launch.md` | Accessibility, Lighthouse CI, SEO, analytics, README, deployment walkthrough | Buy the domain, deploy, add the link to your CV, LinkedIn and GitHub, submit to awards |

## Before or during phase 01

Settle what you can in `docs/private/DECISIONS.md`: the domain, the hero line, Escape Velocity or The Slate as the third featured project, the Parkdean headcount, the Zaltek migration wording, permission from Raymond James to publish the Shariah figures, and whether Greenline HSE can be listed. Claude Code uses the safe defaults until you change them.

## Rules worth knowing

- `CLAUDE.md` is the constitution. Claude Code reads it every session. Where it differs from the white paper, `CLAUDE.md` wins: the design direction was updated (cool white paper, black print, one blue "biro" accent, Archivo and Newsreader, no monospace, motion only where it matters).
- Claude Code may only use facts from `docs/private/sources/` and `DECISIONS.md`. If it asks you a question about a fact, answer it rather than letting it guess.
- Higgsfield is only for award submission mockups and clearly labelled placeholders. Nothing generated appears on the page as if it were real.
- If a phase goes wrong, roll back with git (`git restore .` for uncommitted changes, `git revert <commit>` for committed ones) and start that phase again in a new conversation.
- You should be able to explain every line. If you can't explain something Claude wrote, ask it to walk you through it before moving on.
