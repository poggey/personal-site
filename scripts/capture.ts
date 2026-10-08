// Screenshots of Padraig's live projects for the Index previews and case studies.
// Real pages only: nothing here is generated. Run: `npm run capture` (needs network).
// Output: public/images/projects/<slug>-<width>-<theme>.jpg
import { mkdirSync } from "node:fs";
import { chromium } from "@playwright/test";

type Target = { slug: string; url: string; waitMs: number; hide?: string[] };

const TARGETS: Target[] = [
  {
    slug: "risk-dashboard",
    url: "https://risk-dashboard-padraig.streamlit.app",
    // Streamlit Cloud wakes the app and renders charts late.
    waitMs: 15000,
    hide: ["header", "[data-testid='stToolbar']", ".viewerBadge_container__1QSob", "footer"],
  },
  { slug: "stirling", url: "https://stirling-report.vercel.app", waitMs: 3000 },
  { slug: "apex", url: "https://f1-pace-analyser.vercel.app", waitMs: 4000 },
  // The Slate and Marginalia deployments are behind Vercel's login (deployment protection),
  // so they are left out until their public URLs are confirmed.
  { slug: "escape-velocity", url: "https://escape-velocity-blue.vercel.app", waitMs: 3000 },
];

const SIZES = [
  { width: 1440, height: 900 },
  { width: 390, height: 844 },
];
const THEMES = ["light", "dark"] as const;
const OUT = "public/images/projects";

async function main(): Promise<void> {
  mkdirSync(OUT, { recursive: true });
  const only = process.argv.slice(2);
  const browser = await chromium.launch();
  for (const target of TARGETS.filter((t) => !only.length || only.includes(t.slug))) {
    for (const size of SIZES) {
      for (const theme of THEMES) {
        const page = await browser.newPage({
          viewport: size,
          colorScheme: theme,
          deviceScaleFactor: 1,
        });
        try {
          await page.goto(target.url, { waitUntil: "networkidle", timeout: 60_000 });
          // Streamlit Cloud apps sleep when idle; press its wake button and wait for the app.
          const wake = page.getByRole("button", { name: /get this app back up/i });
          if (await wake.isVisible().catch(() => false)) {
            await wake.click();
            await page.waitForTimeout(90_000);
          }
          await page.waitForTimeout(target.waitMs);
          if (target.hide?.length) {
            await page.addStyleTag({
              content: `${target.hide.join(",")}{visibility:hidden!important}`,
            });
          }
          const path = `${OUT}/${target.slug}-${size.width}-${theme}.jpg`;
          await page.screenshot({ path, type: "jpeg", quality: 82 });
          console.log(`saved ${path}`);
        } catch (error) {
          console.warn(
            `skipped ${target.slug} ${size.width} ${theme}: ${(error as Error).message}`,
          );
        } finally {
          await page.close();
        }
      }
    }
  }
  await browser.close();
}

void main();
