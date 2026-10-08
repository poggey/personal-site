import { z } from "zod";

// The parts of a Stirling edition this site reads. Field names come from a real edition
// (tests/fixtures/stirling-edition.json) and stirling-report/lib/editions/types.ts.
// zod strips everything else, so new fields upstream don't break the page.

const instrumentSchema = z.object({
  id: z.string(),
  label: z.string(),
  class: z.string(),
  precision: z.number().int().min(0).max(8),
  level: z.number().nullable(),
  change: z.number().nullable(),
  changePct: z.number().nullable(),
});

export const editionSchema = z.object({
  number: z.number().int().positive(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  story: z.object({
    headlinePlain: z.string(),
    headlineEm: z.string().nullish(),
    aiHeadline: z.string().nullish(),
  }),
  salience: z.array(z.object({ id: z.string() })),
  instruments: z.array(instrumentSchema),
});

export type Edition = z.infer<typeof editionSchema>;

/** What the site keeps from an edition. Also validates the committed fallback file. */
export const summarySchema = z.object({
  number: z.number().int().positive(),
  date: z.string(),
  headline: z.string().min(1),
  moves: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
      change: z.string(),
      direction: z.enum(["up", "down", "flat"]),
    }),
  ),
  href: z.url(),
});

export type EditionSummary = z.infer<typeof summarySchema>;
export type LedgerMove = EditionSummary["moves"][number];

export const STIRLING_SITE = "https://stirling-report.vercel.app";

// Stirling's home page leaves these out of the ledger: policy rates move by decision, not
// by the market, and the 20y gilt and curve-only tenors are shown on the yield curve instead.
const NOT_IN_LEDGER = new Set([
  "gilt20y",
  "bankrate",
  "fedtarget",
  "ecbdeposit",
  "ust5y",
  "ust30y",
]);

/** The headline rule Stirling's archive page uses: the AI headline, else the plain one. */
export function headline(story: Edition["story"]): string {
  const plain = story.headlineEm
    ? `${story.headlinePlain} ${story.headlineEm}`
    : story.headlinePlain;
  return tidy(story.aiHeadline ?? plain);
}

/** The four most unusual moves: salience order, skipping instruments with no level. */
export function ledger(edition: Edition, count = 4): LedgerMove[] {
  const byId = new Map(edition.instruments.map((i) => [i.id, i]));
  const moves: LedgerMove[] = [];
  for (const { id } of edition.salience) {
    const inst = byId.get(id);
    if (!inst || inst.level === null || NOT_IN_LEDGER.has(id)) continue;
    moves.push(formatMove(inst));
    if (moves.length === count) break;
  }
  return moves;
}

function formatMove(inst: z.infer<typeof instrumentSchema>): LedgerMove {
  const isRate = inst.class === "rate";
  const value =
    (inst.level ?? 0).toLocaleString("en-GB", {
      minimumFractionDigits: inst.precision,
      maximumFractionDigits: inst.precision,
    }) + (isRate ? "%" : "");
  const change = inst.change ?? 0;
  // Rates move in basis points; everything else in per cent, as on Stirling.
  const size = isRate
    ? `${Math.abs(change * 100).toFixed(1)}bp`
    : `${Math.abs(inst.changePct ?? 0).toFixed(2)}%`;
  const direction = change > 0 ? "up" : change < 0 ? "down" : "flat";
  return { label: inst.label, value, change: size, direction };
}

/** This site never shows a dash used as a dash, even in text from elsewhere. */
function tidy(text: string): string {
  return text.replace(/\s*[—–]\s*/g, ", ").trim();
}

export function summarise(edition: Edition): EditionSummary {
  return {
    number: edition.number,
    date: edition.date,
    headline: headline(edition.story),
    moves: ledger(edition),
    href: `${STIRLING_SITE}/archive/${edition.date}`,
  };
}
