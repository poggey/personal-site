import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { content } from "@/content";
import { projects } from "@/content/projects";
import { checkFile, collectFiles } from "../../scripts/check-copy";

const PANEL_HEADINGS = [
  "The question",
  "What I built",
  "How it works",
  "What it found",
  "Where it breaks",
];

describe("content", () => {
  it("loads and validates", () => {
    expect(content.profile.name).toBe("Padraig Middleton");
    expect(content.featured).toHaveLength(3);
    expect(content.featured.map((p) => p.slug)).toContain(content.flags.featuredThird);
  });

  it("sets the hero line to option 1 by default", () => {
    expect(content.profile.heroLine).toBe(content.profile.heroLineOptions[0]);
  });

  it("maps every skill to at least one existing project", () => {
    const slugs = new Set(projects.map((p) => p.slug));
    for (const skill of content.toolkit.skills) {
      expect(skill.projects.length, skill.id).toBeGreaterThan(0);
      for (const slug of skill.projects)
        expect(slugs.has(slug), `${skill.id} -> ${slug}`).toBe(true);
    }
  });

  it("gives every project a status and either a link or privateOnly", () => {
    for (const p of projects) {
      expect(p.status, p.slug).not.toBe("");
      expect(p.privateOnly || p.links.length > 0, p.slug).toBe(true);
    }
  });

  it("never links a private project", () => {
    for (const p of projects.filter((q) => q.privateOnly)) expect(p.links, p.slug).toEqual([]);
  });

  it("has an MDX panel per project with the five headings in order", () => {
    for (const p of projects) {
      const mdx = readFileSync(`src/content/projects/${p.slug}.mdx`, "utf8");
      const headings = [...mdx.matchAll(/^## (.+)$/gm)].map((m) => m[1]);
      expect(headings, p.slug).toEqual(PANEL_HEADINGS);
    }
  });

  it("never shows a phone number", () => {
    const text = collectFiles(["src/content"])
      .map((f) => readFileSync(f, "utf8"))
      .join("\n");
    expect(text).not.toMatch(/\+44|07\d{3}\s?\d{6}/);
  });

  it("passes check:copy", () => {
    const hits = collectFiles(["src/content"]).flatMap((f) => checkFile(f));
    expect(hits).toEqual([]);
  });
});
