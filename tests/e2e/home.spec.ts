import { expect, test } from "@playwright/test";
import { expectNoSeriousA11yIssues, skipIntro } from "./helpers";

test.beforeEach(async ({ page }) => skipIntro(page));

test("the name is a real h1 and the page has no serious axe issues", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "Padraig Middleton" })).toBeVisible();
  await expect(page.locator("h1")).toHaveCount(1);
  // Scroll through so the lazy interlude loads before scanning.
  await page.locator("#interlude").scrollIntoViewIfNeeded();
  await expect(page.getByRole("slider").first()).toBeVisible();
  await expectNoSeriousA11yIssues(page);
});

test("reduced motion: no intro, no canvas, the static name", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto("/");
  await page.waitForTimeout(1500);
  await expect(page.locator("[data-hero] canvas")).toHaveCount(0);
  await expect(page.locator("html")).not.toHaveClass(/intro/);
  await expect(page.locator("h1")).toHaveCSS("color", /rgb\(0, 0, 0\)|rgb\(230, 231, 228\)/);
  await context.close();
});

test("the depth dial shows and hides content, and remembers the choice", async ({ page }) => {
  await page.goto("/");
  const approach = page.locator("#approach");
  await expect(approach).toBeVisible();

  await page.getByRole("radio", { name: "30 sec" }).check({ force: true });
  await expect(approach).toBeHidden();
  await expect(page.locator("#positions")).toBeVisible();

  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-depth", "30s");
  await expect(approach).toBeHidden();
});

test("?depth= sets the depth on arrival", async ({ page }) => {
  await page.goto("/?depth=10m");
  await expect(page.locator("html")).toHaveAttribute("data-depth", "10m");
  await expect(page.getByRole("radio", { name: "10 min" })).toBeChecked();
});

test("nothing animates on scroll except the hero", async ({ page }) => {
  await page.goto("/");
  for (let y = 0; y < 12000; y += 600) {
    await page.mouse.wheel(0, 600);
    await page.waitForTimeout(30);
  }
  await page.waitForTimeout(500);
  // CSS and Web Animations still running after scrolling: there should be none.
  const running = await page.evaluate(
    () => document.getAnimations().filter((a) => a.playState === "running").length,
  );
  expect(running).toBe(0);
});

test("the 404 is designed and leads back", async ({ page }) => {
  const response = await page.goto("/not-a-page");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("This page didn't resolve.");
  await page.getByRole("link", { name: "Back to the signal." }).click();
  await expect(page).toHaveURL("/");
});
