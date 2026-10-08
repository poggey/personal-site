import { z } from "zod";
import raw from "./optimiser.json";

// The Beat my Sharpe data exported by scripts/export-optimiser.py, validated once here.
// Server components pick out what each client component needs, so the 2,000 random
// portfolios only ship with the interlude, never with the first page load.

const pointSchema = z.object({ return: z.number(), volatility: z.number() });
const portfolioSchema = pointSchema.extend({ weights: z.array(z.number()), sharpe: z.number() });

export const optimiserSchema = z.object({
  tickers: z.array(z.object({ ticker: z.string(), name: z.string() })).length(8),
  riskFreeRate: z.number(),
  annualisationDays: z.number(),
  asOf: z.object({ start: z.string(), end: z.string() }),
  mu: z.array(z.number()).length(8),
  cov: z.array(z.array(z.number()).length(8)).length(8),
  maxSharpe: portfolioSchema,
  minVariance: portfolioSchema,
  equalWeight: pointSchema.extend({ sharpe: z.number() }),
  frontier: z.array(pointSchema),
  random: z.array(pointSchema.extend({ sharpe: z.number() })),
  sampleReturns: z.object({
    description: z.string(),
    days: z.number(),
    bins: z.array(z.object({ x0: z.number(), x1: z.number(), count: z.number() })),
    var: z.record(z.enum(["90", "95", "99"]), z.number()),
    cvar: z.record(z.enum(["90", "95", "99"]), z.number()),
  }),
});

export type OptimiserData = z.infer<typeof optimiserSchema>;
export const optimiser: OptimiserData = optimiserSchema.parse(raw);
