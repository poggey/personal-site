import { interludeSchema } from "./schema";

// Beat my Sharpe. Figures from the Portfolio Optimiser README (portfolio reference 2.1).
// The mean vector and covariance matrix arrive in data/ in phase 05.
export const interlude = interludeSchema.parse({
  heading: "Beat my Sharpe",
  // DRAFT
  prompt: "Eight London-listed ETFs, five years of data. Build the best portfolio you can.",
  tickers: [
    { ticker: "ISF.L", name: "FTSE 100" },
    { ticker: "VWRL.L", name: "Global equity" },
    { ticker: "IGLT.L", name: "UK gilts" },
    { ticker: "IBTM.L", name: "US Treasuries" },
    { ticker: "INXG.L", name: "Index-linked gilts" },
    { ticker: "SGLN.L", name: "Gold" },
    { ticker: "SLXX.L", name: "UK corporate bonds" },
    { ticker: "IUKP.L", name: "UK property" },
  ],
  riskFreeRate: 0.04,
  target: { sharpe: 0.76, tolerance: 0.05 },
  optimum: {
    sharpe: 0.76,
    annualReturn: 0.122,
    annualVolatility: 0.107,
    weights: { "SGLN.L": 0.56, "VWRL.L": 0.44 },
  },
  equalWeightSharpe: -0.31,
  // DRAFT
  reveal:
    "The optimiser's answer: 56% gold, 44% global equity. That isn't insight. It's the optimiser fitting the noise in five years that included Covid, the 2022 hiking cycle and the gilt crisis.",
  // DRAFT
  fix: "The fixes are maximum-weight constraints and a shrinkage estimator for the covariance matrix, such as Ledoit-Wolf.",
});
