// Prints the /cv route to public/cv/Padraig-Middleton-CV.pdf and checks it is one A4 page.
// Runs after `next build` (npm's postbuild). It starts the built site on a spare port,
// prints with Playwright's Chromium, then stops the server. Where Chromium isn't installed
// (some CI and hosting builds) it keeps the committed PDF and exits cleanly; pass --strict
// to fail instead.
import { spawn } from "node:child_process";
import { mkdirSync, readFileSync } from "node:fs";

const PORT = 3199;
const OUT = "public/cv/Padraig-Middleton-CV.pdf";
const strict = process.argv.includes("--strict");

/** Counts pages in a PDF by its page objects: enough for a file we generate ourselves. */
export function countPdfPages(pdf: Buffer): number {
  return (pdf.toString("latin1").match(/\/Type\s*\/Page(?!s)/g) ?? []).length;
}

async function waitFor(url: string, ms = 30_000): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < ms) {
    try {
      if ((await fetch(url)).ok) return;
    } catch {
      // Not up yet.
    }
    await new Promise((r) => setTimeout(r, 300));
  }
  throw new Error(`Timed out waiting for ${url}`);
}

async function main(): Promise<void> {
  let chromium;
  try {
    ({ chromium } = await import("@playwright/test"));
    // Throws if the browser binary isn't installed.
    const probe = await chromium.launch();
    await probe.close();
  } catch {
    const message = "cv:pdf: Chromium not available, keeping the committed PDF.";
    if (strict) throw new Error(message);
    console.log(message);
    return;
  }

  const server = spawn("npx", ["next", "start", "-p", String(PORT)], { stdio: "ignore" });
  try {
    await waitFor(`http://localhost:${PORT}/cv`);
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto(`http://localhost:${PORT}/cv`, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    // The CV rule: no bullet wraps or runs past the margin. Bullets are nowrap, so a long
    // one shows up as wider than its list.
    await page.emulateMedia({ media: "print" });
    const overflowing = await page.$$eval("article li", (items) =>
      items
        .filter((li) => li.scrollWidth > (li.parentElement?.clientWidth ?? Infinity) + 1)
        .map((li) => li.textContent ?? ""),
    );
    if (overflowing.length) throw new Error(`cv:pdf: bullets too long:\n${overflowing.join("\n")}`);
    mkdirSync("public/cv", { recursive: true });
    await page.pdf({ path: OUT, format: "A4", printBackground: true, preferCSSPageSize: true });
    await browser.close();
  } finally {
    server.kill();
  }

  const pages = countPdfPages(readFileSync(OUT));
  if (pages !== 1) throw new Error(`cv:pdf: expected 1 page, got ${pages}`);
  console.log(`cv:pdf: wrote ${OUT} (1 page).`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  });
}
