import { expect, test } from "@playwright/test";
import { expectNoSeriousA11yIssues, skipIntro } from "./helpers";

test.beforeEach(async ({ page }) => skipIntro(page));

const open = (page: import("@playwright/test").Page) =>
  page.getByRole("link", { name: /Open the case study.*Stirling/ }).click();

test("a case study opens as a panel over the page, and Esc closes it", async ({ page }) => {
  await page.goto("/");
  await open(page);
  const panel = page.getByRole("dialog", { name: "Stirling" });
  await expect(panel).toBeVisible();
  await expect(page).toHaveURL(/\/work\/stirling$/);
  await expect(panel.getByRole("heading", { name: "What it found" })).toBeVisible();
  // Let the 400ms open animation finish, so contrast is measured at full opacity.
  await page.waitForTimeout(600);
  await expectNoSeriousA11yIssues(page);

  await page.keyboard.press("Escape");
  await expect(panel).toBeHidden();
  await expect(page).toHaveURL(/\/$/);
});

test("the close button and the back button both close the panel", async ({ page }) => {
  await page.goto("/");
  await open(page);
  await page.getByRole("button", { name: "Close" }).click();
  await expect(page.getByRole("dialog")).toBeHidden();

  await open(page);
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.goBack();
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(page).toHaveURL(/\/$/);
});

test("focus returns to the link that opened the panel", async ({ page }) => {
  await page.goto("/");
  const link = page.getByRole("link", { name: /Open the case study.*Stirling/ });
  await link.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(link).toBeFocused();
});

test("a direct visit renders the standalone case study", async ({ page }) => {
  await page.goto("/work/stirling");
  await expect(page.getByRole("heading", { level: 1, name: "Stirling" })).toBeVisible();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Back to the page" })).toBeVisible();
  await expectNoSeriousA11yIssues(page);
});

test("a private project opens with no code link", async ({ page }) => {
  await page.goto("/work/shariah-research");
  await expect(page.getByText("Private work, described but not linked.")).toBeVisible();
  await expect(page.getByRole("link", { name: "Code" })).toHaveCount(0);
});
