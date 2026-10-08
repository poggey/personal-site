"use client";

import { useState } from "react";
import type { Depth } from "@/content/schema";
import styles from "./Positions.module.css";

export type PositionRow = {
  id: string;
  employer: string;
  role: string;
  type: string;
  dates: string;
  current: boolean;
  /** Bar start and width as percentages of the time axis. */
  left: number;
  width: number;
  point: boolean;
  outcomes: { text: string; depth: Depth }[];
};

type Props = {
  rows: PositionRow[];
  ticks: { label: string; at: number }[];
  labels: { show: string; hide: string };
};

/**
 * Each row is a button controlling its outcomes region. Opening one dims the others, so
 * the open role reads against the rest. Outcomes at the 30 sec depth show without opening.
 */
export function PositionRows({ rows, ticks, labels }: Props) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className={styles.chart} data-has-open={open !== null}>
      <div className={styles.axis} aria-hidden="true">
        {ticks.map((t) => (
          <span key={t.label} className={styles.tick} style={{ left: `${t.at}%` }}>
            {t.label}
          </span>
        ))}
      </div>
      <ul className={styles.rows} role="list">
        {rows.map((r) => {
          const isOpen = open === r.id;
          const regionId = `outcomes-${r.id}`;
          const headline = r.outcomes.filter((o) => o.depth === "30s");
          const more = r.outcomes.filter((o) => o.depth !== "30s");
          return (
            <li key={r.id} className={styles.row} data-open={isOpen}>
              <button
                type="button"
                className={styles.head}
                aria-expanded={isOpen}
                aria-controls={regionId}
                onClick={() => setOpen(isOpen ? null : r.id)}
              >
                <span className={styles.who}>
                  <span className={styles.employer}>{r.employer}</span>
                  <span className={styles.role}>
                    {r.role}
                    {r.type !== r.role ? `, ${r.type.toLowerCase()}` : ""}
                  </span>
                </span>
                <span className={styles.dates}>{r.dates}</span>
                <span className={styles.track} aria-hidden="true">
                  {r.point ? (
                    <span className={styles.point} style={{ left: `${r.left + r.width / 2}%` }} />
                  ) : (
                    <span
                      className={`${styles.bar} ${r.current ? styles.current : ""}`}
                      style={{ left: `${r.left}%`, width: `${r.width}%` }}
                    />
                  )}
                </span>
                <span className="visually-hidden">{isOpen ? labels.hide : labels.show}</span>
              </button>
              <ul className={styles.headline} role="list">
                {headline.map((o) => (
                  <li key={o.text}>{o.text}</li>
                ))}
              </ul>
              <div id={regionId} className={styles.more} data-open={isOpen}>
                <ul role="list">
                  {more.map((o) => (
                    <li key={o.text} data-min-depth={o.depth}>
                      {o.text}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
