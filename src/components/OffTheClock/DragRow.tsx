"use client";

import { useRef, type ReactNode } from "react";
import styles from "./OffTheClock.module.css";

/**
 * A row that scrolls sideways natively (touch, trackpad, keyboard once focused) and can also
 * be dragged with a mouse. Dragging only moves scrollLeft, so scroll snapping and
 * accessibility stay the browser's.
 */
export function DragRow({ label, children }: { label: string; children: ReactNode }) {
  const row = useRef<HTMLUListElement>(null);
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);

  return (
    <ul
      ref={row}
      className={styles.row}
      role="list"
      tabIndex={0}
      aria-label={label}
      onPointerDown={(e) => {
        if (e.pointerType !== "mouse" || !row.current) return;
        drag.current = { x: e.clientX, left: row.current.scrollLeft, moved: false };
        row.current.dataset.dragging = "true";
      }}
      onPointerMove={(e) => {
        if (!drag.current || !row.current) return;
        const dx = e.clientX - drag.current.x;
        if (Math.abs(dx) > 4) drag.current.moved = true;
        row.current.scrollLeft = drag.current.left - dx;
      }}
      onPointerUp={() => {
        drag.current = null;
        if (row.current) delete row.current.dataset.dragging;
      }}
      onPointerLeave={() => {
        drag.current = null;
        if (row.current) delete row.current.dataset.dragging;
      }}
      onClickCapture={(e) => {
        // A drag that ends over a link shouldn't follow it.
        if (drag.current?.moved) e.preventDefault();
      }}
    >
      {children}
    </ul>
  );
}
