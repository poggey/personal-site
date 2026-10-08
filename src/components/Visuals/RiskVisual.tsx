"use client";

import { scaleLinear } from "d3-scale";
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
 * The Risk Dashboard's return histogram with its VaR and CVaR lines. Picking a confidence
 * level moves the lines: the dashboard's main idea in one control. Rendered already drawn.
 */
export function RiskVisual({ histogram, confidenceLabel }: Props) {
  const [level, setLevel] = useState<Level>("95");
  const { bins } = histogram;
  const x = scaleLinear()
    .domain([bins[0]?.x0 ?? -0.05, bins.at(-1)?.x1 ?? 0.05])
    .range([M.left, W - M.right]);
  const y = scaleLinear()
    .domain([0, Math.max(...bins.map((b) => b.count))])
    .range([H - M.bottom, M.top]);

  const varX = x(histogram.var[level] ?? 0);
  const cvarX = x(histogram.cvar[level] ?? 0);
  const ticks = x.ticks(5);

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
