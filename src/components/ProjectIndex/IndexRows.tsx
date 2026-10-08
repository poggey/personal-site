"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import styles from "./ProjectIndex.module.css";

export type IndexRow = {
  slug: string;
  title: string;
  type: string;
  year: number;
  stack: string;
  status: string;
  talkingPoint: string;
  preview: { src: string; alt: string } | null;
};

const LERP = 0.15;

/**
 * Rows link to the case-study panels. With a fine pointer, hovering a row shows its preview
 * image, which follows the cursor with a lag (each frame closes 15% of the gap). The
 * talking point sits in each row and shows on hover or focus; on touch it is always shown.
 */
export function IndexRows({ rows, caption }: { rows: IndexRow[]; caption: string }) {
  const [active, setActive] = useState<string | null>(null);
  const preview = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!active) return;
    let frame = 0;
    const tick = () => {
      pos.current.x += (target.current.x - pos.current.x) * LERP;
      pos.current.y += (target.current.y - pos.current.y) * LERP;
      if (preview.current) {
        preview.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active]);

  const activeRow = rows.find((r) => r.slug === active);

  return (
    <div
      className={styles.wrap}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const box = e.currentTarget.getBoundingClientRect();
        target.current = { x: e.clientX - box.left + 24, y: e.clientY - box.top - 80 };
      }}
    >
      <p className="visually-hidden">{caption}</p>
      <ul className={styles.list} role="list">
        {rows.map((r) => (
          <li key={r.slug}>
            <Link
              href={`/work/${r.slug}`}
              scroll={false}
              className={styles.row}
              onPointerEnter={(e) => {
                if (e.pointerType !== "mouse") return;
                const box = e.currentTarget.closest(`.${styles.wrap}`)?.getBoundingClientRect();
                if (box && !active) {
                  pos.current = { x: e.clientX - box.left + 24, y: e.clientY - box.top - 80 };
                  target.current = { ...pos.current };
                }
                setActive(r.slug);
              }}
              onPointerLeave={() => setActive(null)}
            >
              <span className={styles.title}>{r.title}</span>
              <span className={styles.type}>{r.type}</span>
              <span className={styles.year}>{r.year}</span>
              <span className={styles.stack}>{r.stack}</span>
              <span className={styles.status}>{r.status}</span>
              <span className={styles.point}>{r.talkingPoint}</span>
            </Link>
          </li>
        ))}
      </ul>
      {activeRow?.preview ? (
        <div ref={preview} className={styles.preview} aria-hidden="true" key={activeRow.slug}>
          <Image src={activeRow.preview.src} alt="" width={320} height={200} sizes="320px" />
        </div>
      ) : null}
    </div>
  );
}
