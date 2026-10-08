import { z } from "zod";

// Figures drawn by the Selected work mini visuals that are not in a data file.
// Sources: portfolio reference 2.6 (The Slate) and 2.5 (Escape Velocity), as recorded in
// docs/private/CONTENT-CHECK.md. Captions marked DRAFT are my wording.
const visualsSchema = z.object({
  slate: z.object({
    films: z.number().int(),
    meanRoiPct: z.number(),
    medianRoiPct: z.number(),
    topFiveProfitSharePct: z.number(),
    caption: z.string(),
    source: z.string(),
  }),
  escapeVelocity: z.object({
    ipoPrice: z.string(),
    multiple: z.string(),
    valuation: z.string(),
    caption: z.string(),
    source: z.string(),
  }),
  riskDashboard: z.object({
    caption: z.string(),
    source: z.string(),
    confidenceLabel: z.string(),
  }),
  stirling: z.object({
    caption: z.string(),
    source: z.string(),
  }),
});

export const visuals = visualsSchema.parse({
  slate: {
    films: 58,
    meanRoiPct: 191,
    medianRoiPct: -10,
    topFiveProfitSharePct: 65,
    // DRAFT
    caption:
      "Return on investment across 58 A24 films. The mean sits far from the median: a few hits carry the slate.",
    source: "Source: The Slate, TMDB and OMDb data, real 2025 dollars.",
  },
  escapeVelocity: {
    ipoPrice: "$135",
    multiple: "94×",
    valuation: "$1.77tn",
    // DRAFT
    caption: "The SpaceX IPO, June 2026: the deal in three numbers.",
    source: "Source: Escape Velocity. Price data is a labelled stub until rerun on live data.",
  },
  riskDashboard: {
    // DRAFT
    caption:
      "Daily returns of an equal-weight portfolio of eight London-listed ETFs, with historical VaR and CVaR at the chosen confidence.",
    source: "Source: Yahoo Finance, Jan 2020 to Dec 2024. Method as in the Risk Dashboard.",
    confidenceLabel: "Confidence", // DRAFT
  },
  stirling: {
    // DRAFT
    caption: "Today's edition: the Story of the Day and the four most unusual moves.",
    source: "Source: Stirling, refreshed every 30 minutes.",
  },
});
