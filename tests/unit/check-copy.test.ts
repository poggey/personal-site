import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { checkFile, findInText } from "../../scripts/check-copy";

const fixture = (name: string) => `tests/fixtures/copy/${name}`;
const rules = (file: string) => checkFile(fixture(file)).map((h) => h.rule);

describe("check-copy", () => {
  it("flags dashes and banned words in JSX text, attributes and template literals", () => {
    expect(rules("bad.tsx")).toEqual([
      "em dash",
      "banned word: leverage",
      "banned word: unlock",
      "en dash",
      "banned word: robust",
    ]);
  });

  it("reports the line and column of each hit", () => {
    const [first] = checkFile(fixture("bad.tsx"));
    expect(first).toMatchObject({ line: 4, column: 31, match: "—" });
  });

  it("checks MDX prose in full", () => {
    expect(rules("bad.mdx").sort()).toEqual(
      [
        "banned word: journey",
        "banned word: seamless",
        "en dash",
        "banned phrase: in today's",
        "banned word: synergy",
      ].sort(),
    );
  });

  it("ignores comments, imports, hyphens and allowed phrasing", () => {
    expect(checkFile(fixture("clean.tsx"))).toEqual([]);
  });

  it("allows robust only before standard errors", () => {
    expect(findInText("robust standard errors")).toEqual([]);
    expect(findInText("a robust standard")).toHaveLength(1);
  });

  it("allows a lone en dash that is not between words or numbers", () => {
    expect(findInText("Score: –")).toEqual([]);
    expect(findInText("pages 4 – 7")).toHaveLength(1);
  });

  it("exits 1 with file:line output when there are hits, and 0 when clean", () => {
    const run = (path: string) =>
      spawnSync(process.execPath, ["scripts/check-copy.ts", path], { encoding: "utf8" });

    const bad = run(fixture("bad.mdx"));
    expect(bad.status).toBe(1);
    expect(bad.stdout).toContain("tests/fixtures/copy/bad.mdx:3:");

    const clean = run(fixture("clean.tsx"));
    expect(clean.status).toBe(0);
  });
});
