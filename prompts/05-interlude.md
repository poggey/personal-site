# Phase 05: Beat my Sharpe

Read `CLAUDE.md` and the white paper section "05 Interlude". Read github.com/poggey/portfolio-optimiser so the method matches exactly, and read the auto-rebalancing slider code in github.com/poggey/risk-dashboard. Plan, then wait.

## Data

1. `scripts/export-optimiser.py`: the same eight tickers (ISF.L, VWRL.L, IGLT.L, IBTM.L, INXG.L, SGLN.L, SLXX.L, IUKP.L) and the same date range and settings as the notebook. Check the notebook rather than assuming, but expect 252-day annualisation, sample mean and covariance, risk-free 4%, long-only, weights summing to 1, SLSQP. Output `src/content/data/optimiser.json`: tickers with plain names, annualised mean vector, covariance matrix, as-of dates, the max-Sharpe and min-variance portfolios, 100 frontier points, and 2,000 random portfolios sampled (seeded) from 10,000.
2. **Reproduce the README as a check:** max Sharpe about 0.76 at about 12.2% return and 10.7% volatility, weights about 56% SGLN.L and 44% VWRL.L; equal-weight Sharpe about -0.31. If the export doesn't match within rounding (yfinance data can shift), stop and show me the difference. Nothing goes on the site until I approve the numbers.
3. Commit the JSON and the script, not raw price data.

## Maths

4. `src/lib/portfolio.ts`: `portfolioReturn(w, mu)`, `portfolioVol(w, cov)`, `sharpe(w, mu, cov, rf)`, and `rebalance(weights, index, value)` that keeps the total at 1 by scaling the others proportionally, matching the Risk Dashboard's behaviour. Pure functions, no dependencies.
5. Vitest, with fixtures from the JSON: the TypeScript Sharpe for the max-Sharpe weights matches Python to 4 decimal places; `rebalance` always sums to 1 and never goes negative.

## Interface (lazy-loaded as the section approaches)

6. The page's only dark section. Chart: canvas for the 2,000 random portfolios, SVG for the frontier, axes and the reader's dot (biro). Volatility on x, return on y. Eight labelled sliders with live percentages; a readout of return, volatility and Sharpe in tabular figures; the target "Get within 0.05 of 0.76"; Reset; "Show me the optimum".
7. **Reveal** when the reader gets within 0.05 or presses the button: the dot moves to the optimum, the reveal copy from `src/content` appears (don't invent new copy), and the depth layer explains weight caps and Ledoit-Wolf shrinkage.
8. **Accessibility:** native range inputs (or `role="slider"`) with `aria-valuetext` such as "Gold 56%"; 1% keyboard steps; the readout announced politely and throttled; a text summary of the chart for screen readers. Reduced motion: instant moves.
9. Analytics hook points as no-ops until phase 10: `interlude_start`, `interlude_target_hit`, `interlude_reveal`.

## Done when

Tests pass, the numbers match and are approved, and you've given me a 30-second checklist to play it and judge how it feels.
