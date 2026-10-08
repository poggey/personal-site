"use client";

import { useSyncExternalStore } from "react";
import type { Depth } from "@/content/schema";
import { DEFAULT_DEPTH, DEPTHS, getDepth, setDepth, subscribeDepth } from "@/lib/depth";
import { track } from "@/lib/analytics";
import styles from "./DepthDial.module.css";

type Props = {
  labels: Record<Depth, string>;
  legend: string;
};

/**
 * Three native radio buttons, so arrow keys, focus and screen readers work without ARIA
 * plumbing. The state itself lives on <html data-depth> (see lib/depth.ts); this only
 * mirrors it, so the server render and the first client render agree.
 */
export function DepthDial({ labels, legend }: Props) {
  const depth = useSyncExternalStore(subscribeDepth, getDepth, () => DEFAULT_DEPTH);

  return (
    <fieldset className={styles.dial}>
      <legend className="visually-hidden">{legend}</legend>
      {DEPTHS.map((d) => (
        <label key={d} className={styles.option}>
          <input
            type="radio"
            name="depth"
            value={d}
            checked={depth === d}
            onChange={() => {
              setDepth(d);
              track("depth_change", { depth: d });
            }}
            className={styles.input}
          />
          <span className={styles.text}>{labels[d]}</span>
        </label>
      ))}
    </fieldset>
  );
}
