"use client";

import { scaleLinear } from "d3-scale";
import { line } from "d3-shape";
import { useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import { optimiser } from "@/content/data/optimiser";
import { track } from "@/lib/analytics";
import { equalWeights, portfolioReturn, portfolioVol, rebalance, sharpe } from "@/lib/portfolio";
import { formatMonth } from "@/lib/dates";
import { fill } from "@/lib/template";
import { Button } from "../Button/Button";
import type { InterludeCopy } from "./Interlude";
import styles from "./Interlude.module.css";

const { tickers, mu, cov, riskFreeRate: rf, maxSharpe, frontier, random, asOf } = optimiser;

// The chart's own coordinate system; the SVG and canvas both scale it to fit.
const W = 720;
const H = 480;
const M = { top: 16, right: 16, bottom: 40, left: 52 };

const allVol = [...random.map((p) => p.volatility), ...frontier.map((p) => p.volatility)];
const allRet = [...random.map((p) => p.return), ...frontier.map((p) => p.return)];
const x = scaleLinear()
  .domain([0, Math.max(...allVol) * 1.05])
  .range([M.left, W - M.right])
  .nice();
const y = scaleLinear()
  .domain([Math.min(...allRet, 0) - 0.01, Math.max(...allRet) + 0.01])
  .range([H - M.bottom, M.top])
  .nice();

const frontierPath =
  line<{ volatility: number; return: number }>()
    .x((p) => x(p.volatility))
    .y((p) => y(p.return))(frontier) ?? "";

const pct = (v: number, dp = 1) => `${(v * 100).toFixed(dp)}%`;
const REVEAL_MS = 800;

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** The random portfolios, drawn once per size change. Canvas because 2,000 SVG nodes is slow. */
function Cloud() {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const draw = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { width, height } = el.getBoundingClientRect();
      el.width = Math.round(width * dpr);
      el.height = Math.round(height * dpr);
      const ctx = el.getContext("2d");
      if (!ctx) return;
      const scale = (width / W) * dpr;
      ctx.setTransform(scale, 0, 0, scale, 0, 0);
      ctx.fillStyle = getComputedStyle(el).color;
      ctx.globalAlpha = 0.45;
      for (const p of random) {
        ctx.beginPath();
        ctx.arc(x(p.volatility), y(p.return), 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
    };
    draw();
    const observer = new ResizeObserver(draw);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return <canvas ref={canvas} aria-hidden="true" style={{ color: "var(--pencil)" }} />;
}

export default function BeatMySharpe({ copy }: { copy: InterludeCopy }) {
  const [weights, setWeights] = useState<number[]>(() => equalWeights(tickers.length));
  const [revealed, setRevealed] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const [crosshair, setCrosshair] = useState<{ vx: number; vy: number } | null>(null);
  const started = useRef(false);
  const hitOnce = useRef(false);
  const animation = useRef(0);

  const ret = portfolioReturn(weights, mu);
  const vol = portfolioVol(weights, cov);
  const s = sharpe(weights, mu, cov, rf);
  const hit = Math.abs(s - copy.targetSharpe) <= copy.tolerance;

  // Read the result out politely, at most once every 800ms, so dragging doesn't flood it.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setAnnouncement(
        `${copy.text.interludeReturn} ${pct(ret)}, ${copy.text.interludeVolatility} ${pct(vol)}, ${copy.text.interludeSharpe} ${s.toFixed(2)}.`,
      );
    }, 800);
    return () => window.clearTimeout(timer);
  }, [ret, vol, s, copy.text]);

  useEffect(() => {
    if (hit && !hitOnce.current) {
      hitOnce.current = true;
      track("interlude_target_hit", { sharpe: Number(s.toFixed(2)) });
      setRevealed(true);
    }
  }, [hit, s]);

  useEffect(() => () => cancelAnimationFrame(animation.current), []);

  function onSlide(index: number, percent: number) {
    if (!started.current) {
      started.current = true;
      track("interlude_start");
    }
    cancelAnimationFrame(animation.current);
    setWeights((w) => rebalance(w, index, percent / 100));
  }

  /** Moves the weights (and so the dot) to the optimum: eased over 800ms, or instantly. */
  function showOptimum() {
    track("interlude_reveal");
    setRevealed(true);
    const from = weights;
    const to = maxSharpe.weights;
    if (prefersReducedMotion()) {
      setWeights([...to]);
      return;
    }
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / REVEAL_MS);
      const eased = 1 - (1 - t) ** 4; // close to --ease-settle
      setWeights(from.map((w, i) => w + ((to[i] ?? 0) - w) * eased));
      if (t < 1) animation.current = requestAnimationFrame(step);
    };
    animation.current = requestAnimationFrame(step);
  }

  function reset() {
    cancelAnimationFrame(animation.current);
    setWeights(equalWeights(tickers.length));
  }

  /** The crosshair readout: chart coordinates back to volatility and return. */
  function onPointerMove(event: PointerEvent<SVGSVGElement>) {
    if (event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const px = ((event.clientX - rect.left) / rect.width) * W;
    const py = ((event.clientY - rect.top) / rect.height) * H;
    if (px < M.left || px > W - M.right || py < M.top || py > H - M.bottom) {
      setCrosshair(null);
      return;
    }
    setCrosshair({ vx: x.invert(px), vy: y.invert(py) });
  }

  const summary = useMemo(
    () =>
      `${copy.text.interludeChartLabel}. ${copy.text.interludeOptimum}: ${copy.text.interludeReturn} ${pct(maxSharpe.return)}, ${copy.text.interludeVolatility} ${pct(maxSharpe.volatility)}, ${copy.text.interludeSharpe} ${maxSharpe.sharpe.toFixed(2)}.`,
    [copy.text],
  );

  return (
    <div className={styles.game}>
      <div className={styles.chartCol}>
        <div className={styles.chart}>
          <Cloud />
          <svg
            viewBox={`0 0 ${W} ${H}`}
            role="img"
            aria-label={summary}
            onPointerMove={onPointerMove}
            onPointerLeave={() => setCrosshair(null)}
          >
            {x.ticks(6).map((t) => (
              <g key={`x${t}`}>
                <line
                  x1={x(t)}
                  x2={x(t)}
                  y1={H - M.bottom}
                  y2={H - M.bottom + 5}
                  className={styles.axis}
                />
                <text x={x(t)} y={H - M.bottom + 18} textAnchor="middle" className={styles.tick}>
                  {pct(t, 0)}
                </text>
              </g>
            ))}
            {y.ticks(6).map((t) => (
              <g key={`y${t}`}>
                <line x1={M.left} x2={W - M.right} y1={y(t)} y2={y(t)} className={styles.axis} />
                <text x={M.left - 8} y={y(t) + 4} textAnchor="end" className={styles.tick}>
                  {pct(t, 0)}
                </text>
              </g>
            ))}
            <text x={W - M.right} y={H - 4} textAnchor="end" className={styles.axisLabel}>
              {copy.text.interludeVolatility}
            </text>
            <text x={M.left} y={M.top - 4} className={styles.axisLabel}>
              {copy.text.interludeReturn}
            </text>
            <path d={frontierPath} className={styles.frontier} />
            {revealed ? (
              <g>
                <circle
                  cx={x(maxSharpe.volatility)}
                  cy={y(maxSharpe.return)}
                  r={9}
                  className={styles.optimum}
                />
                <text
                  x={x(maxSharpe.volatility) + 14}
                  y={y(maxSharpe.return) - 10}
                  className={styles.markLabel}
                >
                  {copy.text.interludeOptimum} {maxSharpe.sharpe.toFixed(2)}
                </text>
              </g>
            ) : null}
            <circle cx={x(vol)} cy={y(ret)} r={7} className={styles.you} />
            {crosshair ? (
              <g className={styles.crosshair} aria-hidden="true">
                <line x1={x(crosshair.vx)} x2={x(crosshair.vx)} y1={M.top} y2={H - M.bottom} />
                <line x1={M.left} x2={W - M.right} y1={y(crosshair.vy)} y2={y(crosshair.vy)} />
                <text x={x(crosshair.vx) + 6} y={y(crosshair.vy) - 6}>
                  {pct(crosshair.vx)}, {pct(crosshair.vy)}
                </text>
              </g>
            ) : null}
          </svg>
        </div>
        <p className={styles.legend} aria-hidden="true">
          <span>
            <span className={`${styles.swatch} ${styles.swatchRandom}`} />
            {copy.text.interludeRandom}
          </span>
          <span>
            <span className={`${styles.swatch} ${styles.swatchFrontier}`} />
            {copy.text.interludeFrontier}
          </span>
          <span>
            <span className={`${styles.swatch} ${styles.swatchYou}`} />
            {copy.text.interludeYou}
          </span>
        </p>
        <dl className={styles.readout}>
          <div>
            <dt>{copy.text.interludeReturn}</dt>
            <dd>{pct(ret)}</dd>
          </div>
          <div>
            <dt>{copy.text.interludeVolatility}</dt>
            <dd>{pct(vol)}</dd>
          </div>
          <div>
            <dt>{copy.text.interludeSharpe}</dt>
            <dd className={styles.sharpeValue} data-hit={hit}>
              {s.toFixed(2)}
            </dd>
          </div>
        </dl>
        <p className="visually-hidden" role="status" aria-live="polite">
          {announcement}
        </p>
        {revealed ? (
          <div className={styles.reveal}>
            <p className={styles.revealText}>{copy.reveal}</p>
            <p className={styles.fix}>{copy.fix}</p>
          </div>
        ) : null}
      </div>

      <div className={styles.controls}>
        <h3 className={styles.weightsHeading}>{copy.text.interludeWeights}</h3>
        <ul className={styles.sliders} role="list">
          {tickers.map((t, i) => {
            const name = copy.names[t.ticker] ?? t.name;
            const percent = Math.round((weights[i] ?? 0) * 100);
            const id = `weight-${t.ticker.replace(".", "-")}`;
            return (
              <li key={t.ticker} className={styles.slider}>
                <label htmlFor={id} className={styles.sliderName}>
                  <span>{name}</span>
                  <span className={styles.ticker}>{t.ticker}</span>
                </label>
                <output htmlFor={id} className={styles.sliderValue}>
                  {percent}%
                </output>
                <input
                  id={id}
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={percent}
                  aria-valuetext={`${name} ${percent}%`}
                  onChange={(e) => onSlide(i, Number(e.target.value))}
                  className={styles.range}
                />
              </li>
            );
          })}
        </ul>
        <div className={styles.buttons}>
          <Button onClick={reset}>{copy.text.interludeReset}</Button>
          <Button onClick={showOptimum}>{copy.text.interludeShowOptimum}</Button>
        </div>
        <p className={styles.dataNote}>
          {fill(copy.text.interludeData, {
            start: formatMonth(asOf.start.slice(0, 7)),
            end: formatMonth(asOf.end.slice(0, 7)),
            rf: pct(rf, 0),
          })}
        </p>
      </div>
    </div>
  );
}
