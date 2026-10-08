// Portfolio maths for Beat my Sharpe. Pure functions, no dependencies, so each line can be
// checked against the Portfolio Optimiser notebook (annualised mean vector mu and
// covariance matrix cov, both already multiplied by 252).

export type Weights = readonly number[];

/** Expected annual return: w · mu. */
export function portfolioReturn(w: Weights, mu: readonly number[]): number {
  let total = 0;
  for (let i = 0; i < w.length; i++) total += (w[i] ?? 0) * (mu[i] ?? 0);
  return total;
}

/** Annual volatility: the square root of wᵀ Σ w. */
export function portfolioVol(w: Weights, cov: readonly (readonly number[])[]): number {
  let variance = 0;
  for (let i = 0; i < w.length; i++) {
    for (let j = 0; j < w.length; j++) {
      variance += (w[i] ?? 0) * (w[j] ?? 0) * (cov[i]?.[j] ?? 0);
    }
  }
  return Math.sqrt(Math.max(variance, 0));
}

/** Sharpe ratio: excess return over the risk-free rate, per unit of volatility. */
export function sharpe(
  w: Weights,
  mu: readonly number[],
  cov: readonly (readonly number[])[],
  rf: number,
): number {
  const vol = portfolioVol(w, cov);
  return vol === 0 ? 0 : (portfolioReturn(w, mu) - rf) / vol;
}

/**
 * Set one weight and keep the total at 1, as the Risk Dashboard's sliders do: the other
 * weights absorb the change in proportion to their current size. The dashboard leaves the
 * total off 1 when every other weight is zero; here the remainder is shared equally instead,
 * so the portfolio is always fully invested.
 */
export function rebalance(weights: Weights, index: number, value: number): number[] {
  const target = Math.min(1, Math.max(0, value));
  const others = weights.reduce((sum, w, i) => (i === index ? sum : sum + w), 0);
  const remainder = 1 - target;
  const count = weights.length - 1;

  return weights.map((w, i) => {
    if (i === index) return target;
    if (others <= 1e-9) return count > 0 ? remainder / count : 0;
    return Math.max(0, (w / others) * remainder);
  });
}

/** Equal weights across n assets. */
export const equalWeights = (n: number): number[] => Array.from({ length: n }, () => 1 / n);
