import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";
import { countPdfPages } from "../../scripts/cv-pdf";
import { expectNoSeriousA11yIssues } from "./helpers";

test("/cv renders from content with no phone number", async ({ page }) => {
  await page.goto("/cv");
  await expect(page.getByRole("heading", { level: 1, name: "Padraig Middleton" })).toBeVisible();
  await expect(page.getByRole("link", { name: "padraigmiddleton@gmail.com" })).toBeVisible();
  await expect(page.locator("body")).not.toContainText("+44");
  await expectNoSeriousA11yIssues(page);
});

test("/cv prints to exactly one A4 page", async ({ page, browserName }) => {
  test.skip(browserName !== "chromium", "PDF printing is Chromium only");
  await page.goto("/cv");
  await page.evaluate(() => document.fonts.ready);
  const pdf = await page.pdf({ format: "A4", printBackground: true, preferCSSPageSize: true });
  expect(countPdfPages(pdf)).toBe(1);
});

test("the committed CV PDF is one page", () => {
  expect(countPdfPages(readFileSync("public/cv/Padraig-Middleton-CV.pdf"))).toBe(1);
});
