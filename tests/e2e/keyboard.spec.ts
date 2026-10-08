import { expect, test } from "@playwright/test";
import { skipIntro } from "./helpers";

test.beforeEach(async ({ page }) => skipIntro(page));

test("keyboard only: skip link, dial, panel, palette, sliders", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop-1440", "one keyboard walk, at desktop width");
  await page.goto("/");

  // The skip link is the first stop and moves focus to the content.
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();

  // Tab through the whole page: every stop must be visible and the walk must reach the footer.
  const seen = new Set<string>();
  for (let i = 0; i < 160; i++) {
    await page.keyboard.press("Tab");
    const label = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      if (!el || el === document.body) return "";
      const box = el.getBoundingClientRect();
      if (box.width === 0 || box.height === 0) return `INVISIBLE ${el.outerHTML.slice(0, 80)}`;
      return el.textContent?.trim().slice(0, 40) || el.getAttribute("aria-label") || el.tagName;
    });
    expect(label).not.toMatch(/^INVISIBLE/);
    seen.add(label);
    if (label.includes("Source on GitHub")) break;
  }
  expect([...seen].some((l) => l.includes("Source on GitHub"))).toBe(true);

  // Arrow keys change the depth dial.
  await page.getByRole("radio", { name: "3 min" }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.locator("html")).toHaveAttribute("data-depth", "10m");
  await page.keyboard.press("ArrowLeft");

  // The palette opens with "/", filters, and Enter opens a project panel.
  await page.locator("body").press("/");
  const combobox = page.getByRole("combobox");
  await expect(combobox).toBeFocused();
  await combobox.fill("APEX");
  await page.keyboard.press("Enter");
  // A client navigation under a loaded test machine can take a few seconds.
  await expect(page.getByRole("dialog", { name: "APEX" })).toBeVisible({ timeout: 10_000 });
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();

  // Ctrl+K opens it too; "?" shows the shortcuts.
  await page.keyboard.press("Control+k");
  await expect(page.getByRole("combobox")).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("combobox")).toBeHidden();
  await page.locator("body").press("?");
  await expect(page.getByRole("dialog", { name: "Keyboard shortcuts" })).toBeVisible();
  await page.keyboard.press("Escape");

  // Sliders: 1% steps with the arrow keys, announced with a name.
  await page.locator("#interlude").scrollIntoViewIfNeeded();
  const gold = page.getByRole("slider", { name: /Gold/ });
  await gold.focus();
  const before = Number(await gold.inputValue());
  await page.keyboard.press("ArrowRight");
  expect(Number(await gold.inputValue())).toBe(before + 1);
  await expect(gold).toHaveAttribute("aria-valuetext", `Gold ${before + 1}%`);
});

test("Show me the optimum reveals the answer", async ({ page }) => {
  await page.goto("/");
  await page.locator("#interlude").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "Show me the optimum" }).click();
  await expect(page.getByText("The optimiser's answer: 56% gold")).toBeVisible();
  await expect(page.locator("#interlude dd").nth(2)).toHaveText("0.76", { timeout: 3000 });
});
