"use client";

import { openPalette } from "./events";
import styles from "./CommandPalette.module.css";

export function PaletteTrigger({ label }: { label: string }) {
  return (
    <button
      type="button"
      className={styles.trigger}
      onClick={() => openPalette()}
      aria-haspopup="dialog"
    >
      {label}
      <kbd className={styles.hint} aria-hidden="true">
        /
      </kbd>
    </button>
  );
}
