// The first-load JavaScript budget from CLAUDE.md: under 150KB gzipped for the home page.
// "First load" means the scripts the built HTML asks for. Code that loads later on purpose
// (OGL and GSAP for the hero, Lenis, the interlude, the command palette) is not counted;
// Lighthouse can't tell the two apart, which is why this is a separate check.
// Run after `next build`: `npm run check:bundle`.
import { existsSync, readFileSync } from "node:fs";
import { gzipSync } from "node:zlib";

const BUDGET = 150 * 1024;
const PAGES = [".next/server/app/index.html", ".next/server/app/cv.html"];

/**
 * Script files a page loads up front, as /_next/static/... paths. Tags marked noModule
 * (Next's legacy polyfills) are skipped: modern browsers never download them.
 */
export function firstLoadScripts(html: string): string[] {
  const found = new Set<string>();
  for (const tag of html.matchAll(/<(?:script|link)\b[^>]*>/g)) {
    if (/nomodule/i.test(tag[0])) continue;
    const src = tag[0].match(/(?:src|href)="(\/_next\/static\/[^"]+\.js)"/)?.[1];
    if (src) found.add(src);
  }
  return [...found];
}

function main(): void {
  let failed = false;
  for (const page of PAGES) {
    if (!existsSync(page)) throw new Error(`${page} not found: run next build first`);
    const scripts = firstLoadScripts(readFileSync(page, "utf8"));
    const bytes = scripts.reduce(
      (sum, src) => sum + gzipSync(readFileSync(`.next${src.replace("/_next", "")}`)).length,
      0,
    );
    const kb = (bytes / 1024).toFixed(1);
    const ok = bytes <= BUDGET;
    failed ||= !ok;
    console.log(`${ok ? "ok  " : "FAIL"} ${page}: ${kb}KB gzipped across ${scripts.length} files (budget 150KB)`);
  }
  if (failed) process.exit(1);
}

if (import.meta.url === `file://${process.argv[1]}`) main();
