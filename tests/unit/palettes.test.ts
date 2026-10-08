import { describe, expect, it } from "vitest";
import { panelTokens } from "@/content/projects/palettes";
import { projects } from "@/content/projects";
import { AA_TEXT, contrast } from "@/lib/contrast";

/** srgb color-mix(a p%, b), as the browser computes it, to check the panel's pencil colour. */
function mix(a: string, b: string, p: number): string {
  const ch = (hex: string, i: number) => Number.parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16);
  const out = [0, 1, 2].map((i) => Math.round(ch(a, i) * p + ch(b, i) * (1 - p)));
  return `#${out.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

describe("case-study palettes", () => {
  for (const project of projects.filter((p) => p.palette)) {
    it(`${project.slug}: text, secondary text and links stay at AA`, () => {
      const palette = project.palette!;
      const tokens = panelTokens(palette)!;
      expect(contrast(palette.text, palette.background)).toBeGreaterThanOrEqual(AA_TEXT);
      expect(
        contrast(mix(palette.text, palette.background, 0.72), palette.background),
      ).toBeGreaterThanOrEqual(AA_TEXT);
      expect(contrast(tokens["--biro"], palette.background)).toBeGreaterThanOrEqual(AA_TEXT);
    });
  }
});
