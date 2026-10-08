import AxeBuilder from "@axe-core/playwright";
import { expect, type Page } from "@playwright/test";

/** Skips the intro, so tests see the page straight away. */
export async function skipIntro(page: Page): Promise<void> {
  await page.addInitScript(() => sessionStorage.setItem("intro-seen", "1"));
}

/** WCAG 2.2 AA axe scan; fails on any serious or critical violation. */
export async function expectNoSeriousA11yIssues(page: Page): Promise<void> {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  const serious = results.violations.filter(
    (v) => v.impact === "serious" || v.impact === "critical",
  );
  expect(
    serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`),
  ).toEqual([]);
}

/**
 * Waits until MotionDirector has pinned the gallery and measured the page, so clicks land
 * where they will stay. Under reduced motion it never runs, so the wait simply times out.
 */
export async function waitForMotion(page: Page): Promise<void> {
  await page
    .waitForSelector("html[data-motion='ready']", { state: "attached", timeout: 5000 })
    .catch(() => {});
}
