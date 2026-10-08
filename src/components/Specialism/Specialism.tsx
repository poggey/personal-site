import type { ReactNode } from "react";
import { content } from "@/content";
import { Figure } from "../Figure/Figure";
import { Section } from "../Section/Section";
import { Sidenote } from "../Sidenote/Sidenote";
import styles from "./Specialism.module.css";

const { specialism, microcopy } = content;

/**
 * Puts a glossary sidenote after the first use of each term in the text. Terms the text
 * doesn't use are returned so they can be listed separately.
 */
function annotate(text: string): { nodes: ReactNode[]; unused: typeof specialism.glossary } {
  const nodes: ReactNode[] = [];
  const unused: typeof specialism.glossary = [];
  let rest = text;
  let n = 0;
  for (const entry of specialism.glossary) {
    const at = rest.toLowerCase().indexOf(entry.term.toLowerCase());
    if (at === -1) {
      unused.push(entry);
      continue;
    }
    const end = at + entry.term.length;
    n += 1;
    nodes.push(
      rest.slice(0, end),
      <Sidenote key={entry.term} n={n} label={entry.term}>
        <strong>{entry.term}.</strong> {entry.definition}
      </Sidenote>,
    );
    rest = rest.slice(end);
  }
  nodes.push(rest);
  return { nodes, unused };
}

function GapChart({
  points,
  axisLabel,
}: {
  points: { riskLevel: number; gapBps: number }[];
  axisLabel: string;
}) {
  const W = 480;
  const rowH = 56;
  const H = rowH * points.length + 60;
  // The axis label sits just below the tick labels, inside a slightly taller viewBox.
  const left = 96;
  const right = 24;
  const max = Math.ceil(Math.max(...points.map((p) => p.gapBps)) / 50) * 50 + 10;
  const x = (bps: number) => left + (bps / max) * (W - left - right);
  return (
    <svg
      viewBox={`0 0 ${W} ${H + 8}`}
      className={styles.chart}
      role="img"
      aria-labelledby="gap-desc"
    >
      <desc id="gap-desc">
        {points.map((p) => `Risk ${p.riskLevel}: ${p.gapBps} basis points apart.`).join(" ")}
      </desc>
      {points.map((p, i) => {
        const cy = 24 + i * rowH;
        return (
          <g key={p.riskLevel}>
            <text x={0} y={cy + 4} className={styles.rowLabel}>
              Risk {p.riskLevel}
            </text>
            <line x1={x(0)} x2={x(p.gapBps)} y1={cy} y2={cy} className={styles.stem} />
            <circle cx={x(0)} cy={cy} r={4} className={styles.base} />
            <circle cx={x(p.gapBps)} cy={cy} r={6} className={styles.dot} />
            <text x={x(p.gapBps)} y={cy - 12} textAnchor="middle" className={styles.value}>
              {p.gapBps} bps
            </text>
          </g>
        );
      })}
      <line x1={x(0)} x2={W - right} y1={H - 30} y2={H - 30} className={styles.axis} />
      {[0, 50, 100]
        .filter((t) => t <= max)
        .map((t) => (
          <text key={t} x={x(t)} y={H - 12} textAnchor="middle" className={styles.tick}>
            {t}
          </text>
        ))}
      <text x={W - right} y={H + 4} textAnchor="end" className={styles.tick}>
        {axisLabel}
      </text>
    </svg>
  );
}

/** Islamic finance: what was built, and the one finding, kept to a small example. */
export function Specialism() {
  const { nodes, unused } = annotate(specialism.body);
  const finding = specialism.finding;
  return (
    <Section id="specialism" heading={specialism.heading} minDepth="3m">
      <div className={`${styles.layout} has-margin-notes`}>
        <div className={styles.text}>
          {finding ? <p className={styles.summary}>{finding.summary}</p> : null}
          <p>{nodes}</p>
          {finding ? <p className={styles.cause}>{finding.cause}</p> : null}
          {specialism.extras.map((e) => (
            <p key={e.text} data-min-depth={e.depth} className={styles.extra}>
              {e.text}
            </p>
          ))}
          {unused.length > 0 ? (
            <dl className={styles.glossary} data-min-depth="10m">
              {unused.map((g) => (
                <div key={g.term}>
                  <dt>{g.term}</dt>
                  <dd>{g.definition}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
        {finding ? (
          <div className={styles.figure}>
            <Figure caption={finding.summary} source={microcopy.specialismSource}>
              <GapChart points={finding.points} axisLabel={microcopy.specialismAxis} />
            </Figure>
          </div>
        ) : null}
      </div>
    </Section>
  );
}
