import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";
import { editionSchema, headline, ledger, summarise, summarySchema } from "@/lib/stirling-edition";
import { fetchLatestEdition } from "@/lib/stirling";
import fallback from "@/content/data/stirling-fallback.json";

// A real edition (No. 98, 2026-10-07) saved from stirling-report/data/editions.
const fixture = JSON.parse(readFileSync("tests/fixtures/stirling-edition.json", "utf8"));

const respond = (body: unknown, status = 200) =>
  vi.fn(async () => new Response(JSON.stringify(body), { status })) as unknown as typeof fetch;

describe("Stirling edition", () => {
  it("parses a real edition", () => {
    const edition = editionSchema.parse(fixture);
    expect(edition.number).toBe(98);
    expect(edition.date).toBe("2026-10-07");
  });

  it("uses the AI headline, falling back to the plain one", () => {
    const edition = editionSchema.parse(fixture);
    expect(headline(edition.story)).toBe("EUR/USD Slides 0.82% Amidst Broader Currency Weakness");
    expect(headline({ ...edition.story, aiHeadline: null })).toBe(
      "EUR/USD slides as GBP/USD slides",
    );
  });

  it("takes the four most unusual moves, formatted as Stirling shows them", () => {
    const moves = ledger(editionSchema.parse(fixture));
    expect(moves.map((m) => m.label)).toEqual([
      "EUR/USD",
      "GBP/USD",
      "US 10y Treasury",
      "Ethereum",
    ]);
    expect(moves[0]).toEqual({
      label: "EUR/USD",
      value: "1.1177",
      change: "0.82%",
      direction: "down",
    });
    expect(moves[2]?.change).toBe("4.0bp");
  });

  it("never passes a dash used as a dash through to the page", () => {
    const edition = editionSchema.parse(fixture);
    expect(headline({ ...edition.story, aiHeadline: "Gilts slide — again" })).toBe(
      "Gilts slide, again",
    );
  });

  it("keeps a valid committed fallback", () => {
    expect(() => summarySchema.parse(fallback)).not.toThrow();
  });
});

describe("fetchLatestEdition", () => {
  it("returns the live edition when the fetch works", async () => {
    const result = await fetchLatestEdition(respond(fixture));
    expect(result.stale).toBe(false);
    expect(result).toMatchObject(summarise(editionSchema.parse(fixture)));
  });

  it("falls back to the last good edition when the fetch fails", async () => {
    const failing = vi.fn(async () => {
      throw new Error("network down");
    }) as unknown as typeof fetch;
    const result = await fetchLatestEdition(failing);
    expect(result.stale).toBe(true);
    expect(result.number).toBe(fallback.number);
  });

  it("falls back on a bad status or an unexpected shape", async () => {
    expect((await fetchLatestEdition(respond({}, 500))).stale).toBe(true);
    expect((await fetchLatestEdition(respond({ number: "ninety" }))).stale).toBe(true);
  });
});
