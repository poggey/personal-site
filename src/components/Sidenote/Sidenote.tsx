"use client";

import { useId, useState, type ReactNode } from "react";
import styles from "./Sidenote.module.css";

type Props = {
  /** The marker number, in reading order within its section. */
  n: number;
  /** Short text the marker sits after, read with the note's button. */
  label: string;
  children: ReactNode;
};

/**
 * A Tufte-style margin note. On wide screens the note sits in the margin column and is
 * always visible. On narrow screens the biro marker is a button that opens it inline;
 * at the 10 min depth every note is open. Built from spans so it can sit inside a <p>.
 */
export function Sidenote({ n, label, children }: Props) {
  const [open, setOpen] = useState(false);
  const noteId = useId();
  return (
    <span className={styles.wrap}>
      <button
        type="button"
        className={styles.marker}
        aria-expanded={open}
        aria-controls={noteId}
        onClick={() => setOpen((o) => !o)}
      >
        <span aria-hidden="true">{n}</span>
        <span className="visually-hidden">
          Note {n}: {label}
        </span>
      </button>
      <span id={noteId} className={styles.note} data-open={open} role="note">
        <span className={styles.number} aria-hidden="true">
          {n}
        </span>
        {children}
      </span>
    </span>
  );
}
