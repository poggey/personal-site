import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { PALETTE } from "@/styles/palette";
import { contrast } from "@/lib/contrast";

const css = readFileSync("src/styles/tokens.css", "utf8").toLowerCase();

describe("colour tokens", () => {
  it("match the values the styleguide computes contrast from", () => {
    for (const mode of ["light", "dark"] as const) {
      for (const [name, hex] of Object.entries(PALETTE[mode])) {
        expect(css, `${mode} ${name}`).toContain(`--${name}: ${hex.toLowerCase()}`);
      }
    }
  });

  it("keep text at WCAG AA (4.5:1) on paper in both themes", () => {
    for (const mode of ["light", "dark"] as const) {
      const p = PALETTE[mode];
      expect(contrast(p.print, p.paper)).toBeGreaterThanOrEqual(4.5);
      expect(contrast(p.pencil, p.paper)).toBeGreaterThanOrEqual(4.5);
      expect(contrast(p.biro, p.paper)).toBeGreaterThanOrEqual(4.5);
    }
  });
});
