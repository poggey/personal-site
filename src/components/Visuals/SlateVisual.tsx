import { scaleLinear } from "d3-scale";
import { content } from "@/content";
import styles from "./Visuals.module.css";

const { slate } = content.visuals;

const W = 640;
const H = 220;
const M = { left: 12, right: 12 };

/** The Slate's finding in two marks: the mean far from the median, and the share of five films. */
export function SlateVisual() {
  const x = scaleLinear()
    .domain([-100, 250])
    .range([M.left, W - M.right]);
  const ticks = [-100, 0, 100, 200];
  const share = slate.topFiveProfitSharePct / 100;
  const barW = W - M.left - M.right;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={styles.svg} role="img" aria-labelledby="slate-desc">
      <desc id="slate-desc">
        Across {slate.films} films, the median return on investment is {slate.medianRoiPct}% and the
        mean is +{slate.meanRoiPct}%. Five films made about {slate.topFiveProfitSharePct}% of all
        the profit.
      </desc>
      <text x={M.left} y={18} className={styles.label}>
        Return on investment, per film
      </text>
      <line x1={M.left} x2={W - M.right} y1={70} y2={70} className={styles.axis} />
      {ticks.map((t) => (
        <g key={t}>
          <line x1={x(t)} x2={x(t)} y1={66} y2={74} className={styles.axis} />
          <text x={x(t)} y={92} className={styles.tick} textAnchor="middle">
            {t > 0 ? `+${t}%` : `${t}%`}
          </text>
        </g>
      ))}
      <g className={styles.markerSoft}>
        <circle cx={x(slate.medianRoiPct)} cy={70} r={6} />
        <text x={x(slate.medianRoiPct)} y={50} textAnchor="middle">
          Median {slate.medianRoiPct}%
        </text>
      </g>
      <g className={styles.marker}>
        <circle cx={x(slate.meanRoiPct)} cy={70} r={6} />
        <text x={x(slate.meanRoiPct)} y={50} textAnchor="middle">
          Mean +{slate.meanRoiPct}%
        </text>
      </g>
      <text x={M.left} y={140} className={styles.label}>
        Share of all the profit
      </text>
      <rect x={M.left} y={152} width={barW * share} height={24} className={styles.barStrong} />
      <rect
        x={M.left + barW * share}
        y={152}
        width={barW * (1 - share)}
        height={24}
        className={styles.bar}
      />
      <text x={M.left + 8} y={198} className={styles.tick}>
        Five films, about {slate.topFiveProfitSharePct}%
      </text>
      <text x={W - M.right} y={198} className={styles.tick} textAnchor="end">
        The other {slate.films - 5}
      </text>
    </svg>
  );
}
