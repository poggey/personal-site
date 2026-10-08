"use client";

import { useState } from "react";
import type { OptimiserData } from "@/content/data/optimiser";
import styles from "./Visuals.module.css";

type Props = {
  histogram: OptimiserData["sampleReturns"];
  confidenceLabel: string;
};

const LEVELS = ["90", "95", "99"] as const;
type Level = (typeof LEVELS)[number];

const W = 640;
const H = 280;
const M = { top: 24, right: 12, bottom: 32, left: 12 };

const pct = (x: number, dp = 1) => `${(x * 100).toFixed(dp)}%`;

/**
 * A straight-line map from data to pixels. This chart only needs that, so it skips
 * d3-scale and keeps the first page load lighter.
 */
function linear([d0, d1]: [number, number], [r0, r1]: [number, number]) {
  return (v: number) => r0 + ((v - d0) / (d1 - d0)) * (r1 - r0);
}

/** Round steps of 1% or 2% across the domain, for the axis labels. */
function percentTicks([d0, d1]: [number, number]): number[] {
  const step = d1 - d0 > 0.06 ? 0.02 : 0.01;
  const ticks: number[] = [];
  for (let t = Math.ceil(d0 / step) * step; t <= d1 + 1e-9; t += step)
    ticks.push(Number(t.toFixed(4)));
  return ticks;
}

/**
 * The Risk Dashboard's return histogram with its VaR and CVaR lines. Picking a confidence
 * level moves the lines: the dashboard's main idea in one control. Rendered already drawn.
 */
export function RiskVisual({ histogram, confidenceLabel }: Props) {
  const [level, setLevel] = useState<Level>("95");
  const { bins } = histogram;
  const domain: [number, number] = [bins[0]?.x0 ?? -0.05, bins.at(-1)?.x1 ?? 0.05];
  const x = linear(domain, [M.left, W - M.right]);
  const y = linear([0, Math.max(...bins.map((b) => b.count))], [H - M.bottom, M.top]);

  const varX = x(histogram.var[level] ?? 0);
  const cvarX = x(histogram.cvar[level] ?? 0);
  const ticks = percentTicks(domain);

  return (
    <div className={styles.risk}>
      <fieldset className={styles.levels}>
        <legend className={styles.legend}>{confidenceLabel}</legend>
        {LEVELS.map((l) => (
          <label key={l} className={styles.level}>
            <input
              type="radio"
              name="risk-confidence"
              value={l}
              checked={level === l}
              onChange={() => setLevel(l)}
            />
            <span>{l}%</span>
          </label>
        ))}
      </fieldset>
      <svg viewBox={`0 0 ${W} ${H}`} className={styles.svg} role="img" aria-labelledby="risk-desc">
        <desc id="risk-desc">
          Histogram of {histogram.days} daily returns. At {level}% confidence, VaR is{" "}
          {pct(histogram.var[level] ?? 0, 2)} and CVaR is {pct(histogram.cvar[level] ?? 0, 2)}.
        </desc>
        {bins.map((b) => (
          <rect
            key={b.x0}
            x={x(b.x0) + 0.5}
            width={Math.max(0, x(b.x1) - x(b.x0) - 1)}
            y={y(b.count)}
            height={y(0) - y(b.count)}
            className={b.x1 <= (histogram.var[level] ?? 0) ? styles.tail : styles.bar}
          />
        ))}
        <line x1={M.left} x2={W - M.right} y1={y(0)} y2={y(0)} className={styles.axis} />
        {ticks.map((t) => (
          <text key={t} x={x(t)} y={H - 10} className={styles.tick} textAnchor="middle">
            {pct(t, 0)}
          </text>
        ))}
        <g className={styles.marker}>
          <line x1={varX} x2={varX} y1={M.top - 8} y2={y(0)} />
          <text x={varX + 6} y={M.top}>
            VaR {pct(histogram.var[level] ?? 0, 2)}
          </text>
        </g>
        <g className={styles.markerSoft}>
          <line x1={cvarX} x2={cvarX} y1={M.top + 18} y2={y(0)} />
          <text x={cvarX - 6} y={M.top + 26} textAnchor="end">
            CVaR {pct(histogram.cvar[level] ?? 0, 2)}
          </text>
        </g>
      </svg>
    </div>
  );
}
