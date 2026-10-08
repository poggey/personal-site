"""Export the data behind the Beat my Sharpe interlude.

Reproduces the method in github.com/poggey/portfolio-optimiser (notebook.ipynb)
and writes the results to src/content/data/optimiser.json. It also adds the
equal-weight return histogram used by the Risk Dashboard visual, using the
VaR method from github.com/poggey/risk-dashboard. Only derived
statistics are written: the raw prices stay out of the repo.

Run from the project root:
    python3 scripts/export-optimiser.py
"""

import json
from pathlib import Path

import numpy as np
import pandas as pd
import yfinance as yf
from scipy.optimize import minimize

# The universe, in the order the notebook lists it. yfinance returns columns
# alphabetically, so every array below is reordered to match this list.
TICKERS = [
    ("ISF.L", "FTSE 100"),
    ("VWRL.L", "Global equity"),
    ("IGLT.L", "UK gilts"),
    ("IBTM.L", "US Treasuries"),
    ("INXG.L", "Index-linked gilts"),
    ("SGLN.L", "Gold"),
    ("SLXX.L", "UK corporate bonds"),
    ("IUKP.L", "UK property"),
]
SYMBOLS = [symbol for symbol, _ in TICKERS]

# Notebook cell 0: five years of daily data. yfinance treats `end` as
# exclusive, so the last row is the final trading day of 2024.
START = "2020-01-01"
END = "2025-01-01"

# Notebook cell 4: the risk-free rate (UK short-term gilt yield).
RISK_FREE_RATE = 0.04
# Notebook cell 2: daily figures are annualised with 252 trading days.
TRADING_DAYS = 252

# Notebook cell 5 draws 10,000 random portfolios. The notebook sets no seed;
# a fixed one here makes the export repeatable, and 2,000 of the draws are
# kept so the JSON stays small enough to ship to the browser.
SEED = 20240101
RANDOM_DRAWS = 10_000
RANDOM_KEPT = 2_000

# Notebook cell 12: the frontier is traced with 100 target returns.
FRONTIER_POINTS = 100

# Enough bars to show the fat left tail without the histogram turning to noise.
HISTOGRAM_BINS = 40

OUTPUT = Path(__file__).resolve().parent.parent / "src" / "content" / "data" / "optimiser.json"


def load_returns() -> pd.DataFrame:
    """Daily simple returns, exactly as notebook cells 0 and 1 build them."""
    # The notebook takes the 'Close' column with yfinance's default settings.
    # Since yfinance 0.2.51 that default is auto_adjust=True, so 'Close' is
    # adjusted for dividends and splits. It is set explicitly here so a future
    # change of default cannot silently change the numbers.
    prices = yf.download(SYMBOLS, start=START, end=END, auto_adjust=True, progress=False)["Close"]
    prices = prices[SYMBOLS]
    # Drop any day where one of the eight is missing, then take simple
    # (not log) percentage returns.
    prices = prices.dropna()
    return prices.pct_change().dropna()


def performance(weights, mu, cov):
    """Return, volatility and Sharpe ratio, as notebook cell 4's portfolio_perf."""
    ret = float(weights @ mu)
    vol = float(np.sqrt(weights @ cov @ weights))
    return ret, vol, (ret - RISK_FREE_RATE) / vol


def solve(objective, mu, cov, extra_constraints=()):
    """Long-only, fully invested SLSQP solve with the notebook's settings.

    Bounds 0 to 1 per asset, weights sum to 1, starting from equal weights,
    and scipy's default tolerance and iteration limit (the notebook sets none).
    """
    n = len(mu)
    constraints = [{"type": "eq", "fun": lambda w: np.sum(w) - 1}, *extra_constraints]
    bounds = tuple((0, 1) for _ in range(n))
    first_guess = np.full(n, 1 / n)
    return minimize(
        objective, first_guess, args=(mu, cov), method="SLSQP", bounds=bounds, constraints=constraints
    )


def negative_sharpe(weights, mu, cov):
    # Minimising the negative Sharpe ratio maximises the Sharpe ratio.
    return -performance(weights, mu, cov)[2]


def variance(weights, mu, cov):
    # The notebook minimises variance (not volatility): same optimum, smoother objective.
    return float(weights @ cov @ weights)


def sig(x: float, digits: int = 8) -> float:
    """Round to significant digits, so tiny covariances keep their precision."""
    return float(f"{x:.{digits - 1}e}")


def dp(x: float, places: int = 5) -> float:
    return round(float(x), places)


def sample_returns(returns: pd.DataFrame) -> dict:
    """Histogram and tail risk of the equal-weight portfolio's daily returns.

    Feeds the Risk Dashboard mini visual. The method copies
    github.com/poggey/risk-dashboard, src/metrics.py:
      portfolio_returns: returns @ weights, i.e. fixed weights every day
        (rebalanced daily back to equal weight).
      value_at_risk: np.percentile(returns, (1 - confidence) * 100), with
        numpy's default linear interpolation. It is a return, so a loss is
        negative.
      conditional_value_at_risk: the mean of the returns at or below VaR.
    """
    equal = np.full(returns.shape[1], 1 / returns.shape[1])
    daily = returns.to_numpy() @ equal

    counts, edges = np.histogram(daily, bins=HISTOGRAM_BINS)
    bins = [
        {"x0": dp(edges[i], 6), "x1": dp(edges[i + 1], 6), "count": int(counts[i])}
        for i in range(len(counts))
    ]

    var, cvar = {}, {}
    for level in (90, 95, 99):
        threshold = np.percentile(daily, 100 - level)
        var[str(level)] = dp(threshold, 6)
        cvar[str(level)] = dp(daily[daily <= threshold].mean(), 6)

    return {
        "description": (
            "Daily simple returns of an equal-weight portfolio of the eight ETFs, "
            "rebalanced to equal weight every day. Historical VaR and CVaR, "
            "given as daily returns (negative means a loss)."
        ),
        "days": int(len(daily)),
        "bins": bins,
        "var": var,
        "cvar": cvar,
    }


def portfolio_summary(weights, mu, cov):
    ret, vol, sharpe = performance(weights, mu, cov)
    # SLSQP leaves values like 2e-16 where the true weight is zero; clip them
    # so the site never shows a negative or noise weight.
    clean = np.clip(weights, 0, 1)
    return {
        "weights": [dp(w, 6) for w in clean],
        "return": dp(ret, 6),
        "volatility": dp(vol, 6),
        "sharpe": dp(sharpe, 6),
    }


def main() -> None:
    returns = load_returns()

    # Notebook cell 2: annualised mean returns, and the covariance matrix
    # scaled by 252 (cell 4 scales it inside portfolio_perf).
    mu = returns.mean().to_numpy() * TRADING_DAYS
    cov = returns.cov().to_numpy() * TRADING_DAYS

    # Notebook cells 8 and 10.
    max_sharpe = solve(negative_sharpe, mu, cov)
    min_variance = solve(variance, mu, cov)

    # Notebook cell 14: the equal-weight benchmark.
    equal = np.full(len(mu), 1 / len(mu))
    eq_ret, eq_vol, eq_sharpe = performance(equal, mu, cov)

    # Notebook cell 12: 100 target returns from the minimum-variance return up
    # to the best single asset's return. For each, find the lowest-variance
    # portfolio that earns exactly that return.
    min_var_return = performance(min_variance.x, mu, cov)[0]
    frontier = []
    for target in np.linspace(min_var_return, mu.max(), FRONTIER_POINTS):
        on_target = {"type": "eq", "fun": lambda w, t=target: w @ mu - t}
        result = solve(variance, mu, cov, extra_constraints=[on_target])
        frontier.append({"return": dp(target), "volatility": dp(np.sqrt(result.fun))})

    # Notebook cell 5: uniform random weights, normalised to sum to 1.
    rng = np.random.default_rng(SEED)
    draws = rng.random((RANDOM_DRAWS, len(mu)))
    draws /= draws.sum(axis=1, keepdims=True)
    kept = rng.choice(RANDOM_DRAWS, size=RANDOM_KEPT, replace=False)
    random_portfolios = []
    for weights in draws[np.sort(kept)]:
        ret, vol, sharpe = performance(weights, mu, cov)
        random_portfolios.append({"return": dp(ret), "volatility": dp(vol), "sharpe": dp(sharpe)})

    export = {
        "tickers": [{"ticker": symbol, "name": name} for symbol, name in TICKERS],
        "riskFreeRate": RISK_FREE_RATE,
        "annualisationDays": TRADING_DAYS,
        "asOf": {
            "start": returns.index[0].strftime("%Y-%m-%d"),
            "end": returns.index[-1].strftime("%Y-%m-%d"),
        },
        "mu": [sig(x) for x in mu],
        "cov": [[sig(x) for x in row] for row in cov],
        "maxSharpe": portfolio_summary(max_sharpe.x, mu, cov),
        "minVariance": portfolio_summary(min_variance.x, mu, cov),
        "equalWeight": {
            "return": dp(eq_ret, 6),
            "volatility": dp(eq_vol, 6),
            "sharpe": dp(eq_sharpe, 6),
        },
        "frontier": frontier,
        "random": random_portfolios,
        "sampleReturns": sample_returns(returns),
    }

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    # Compact separators keep the file small; the site parses it, nobody reads it raw.
    OUTPUT.write_text(json.dumps(export, separators=(",", ":")) + "\n")

    print(f"Wrote {OUTPUT} ({OUTPUT.stat().st_size:,} bytes)")
    print(f"Data: {export['asOf']['start']} to {export['asOf']['end']}, {len(returns)} daily returns")
    for label, key in (("Max Sharpe", "maxSharpe"), ("Min variance", "minVariance")):
        p = export[key]
        print(f"{label}: return {p['return']:.4f}, vol {p['volatility']:.4f}, Sharpe {p['sharpe']:.4f}")
        print("  " + ", ".join(f"{s} {w:.4f}" for s, w in zip(SYMBOLS, p["weights"]) if w > 0.0005))
    eq = export["equalWeight"]
    print(f"Equal weight: return {eq['return']:.4f}, vol {eq['volatility']:.4f}, Sharpe {eq['sharpe']:.4f}")
    tail = export["sampleReturns"]
    print(f"Equal-weight daily VaR {tail['var']}, CVaR {tail['cvar']}")


if __name__ == "__main__":
    main()
