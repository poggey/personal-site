import { describe, expect, it } from "vitest";
import { optimiser } from "@/content/data/optimiser";
import { content } from "@/content";
import { equalWeights, portfolioReturn, portfolioVol, rebalance, sharpe } from "@/lib/portfolio";

const { mu, cov, riskFreeRate } = optimiser;

describe("portfolio maths against the notebook export", () => {
  it("reproduces the max-Sharpe portfolio to 4 dp", () => {
    const w = optimiser.maxSharpe.weights;
    expect(portfolioReturn(w, mu)).toBeCloseTo(optimiser.maxSharpe.return, 4);
    expect(portfolioVol(w, cov)).toBeCloseTo(optimiser.maxSharpe.volatility, 4);
    expect(sharpe(w, mu, cov, riskFreeRate)).toBeCloseTo(optimiser.maxSharpe.sharpe, 4);
  });

  it("reproduces the minimum-variance and equal-weight portfolios", () => {
    const mv = optimiser.minVariance;
    expect(sharpe(mv.weights, mu, cov, riskFreeRate)).toBeCloseTo(mv.sharpe, 4);
    expect(sharpe(equalWeights(8), mu, cov, riskFreeRate)).toBeCloseTo(
      optimiser.equalWeight.sharpe,
      4,
    );
  });

  it("matches the figures quoted in the README and the site copy", () => {
    const { optimum, equalWeightSharpe } = content.interlude;
    expect(optimiser.maxSharpe.sharpe).toBeCloseTo(optimum.sharpe, 2);
    expect(optimiser.maxSharpe.return).toBeCloseTo(optimum.annualReturn, 3);
    expect(optimiser.maxSharpe.volatility).toBeCloseTo(optimum.annualVolatility, 3);
    expect(optimiser.equalWeight.sharpe).toBeCloseTo(equalWeightSharpe, 2);
    const gold = optimiser.tickers.findIndex((t) => t.ticker === "SGLN.L");
    expect(optimiser.maxSharpe.weights[gold]).toBeCloseTo(0.56, 2);
  });

  it("has no random portfolio beating the optimum", () => {
    const best = Math.max(...optimiser.random.map((p) => p.sharpe));
    expect(best).toBeLessThan(optimiser.maxSharpe.sharpe);
  });
});

describe("rebalance", () => {
  const sum = (w: number[]) => w.reduce((a, b) => a + b, 0);

  it("keeps the total at 1 and never goes negative, across many random moves", () => {
    let w = equalWeights(8);
    let seed = 1;
    const random = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    for (let step = 0; step < 2000; step++) {
      w = rebalance(w, Math.floor(random() * 8), random() * 1.2 - 0.1);
      expect(sum(w)).toBeCloseTo(1, 9);
      for (const x of w) expect(x).toBeGreaterThanOrEqual(0);
    }
  });

  it("scales the others in proportion", () => {
    const w = rebalance([0.5, 0.3, 0.2], 0, 0.75);
    expect(w[0]).toBe(0.75);
    expect(w[1]).toBeCloseTo(0.15, 10);
    expect(w[2]).toBeCloseTo(0.1, 10);
  });

  it("shares the remainder equally when every other weight is zero", () => {
    const w = rebalance([1, 0, 0, 0, 0], 0, 0.6);
    expect(w).toEqual([0.6, 0.1, 0.1, 0.1, 0.1].map((x) => expect.closeTo(x, 10)));
  });
});
