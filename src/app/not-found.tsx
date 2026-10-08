import type { Metadata } from "next";
import Link from "next/link";
import { content } from "@/content";
import styles from "./not-found.module.css";

const { microcopy, profile } = content;

export const metadata: Metadata = { title: microcopy.notFoundHeading, robots: { index: false } };

/**
 * The designed 404. A field of scattered dots that never resolves (drawn once, on the
 * server, from a fixed seed so every render matches), then the way back.
 */
function noise(count: number): { x: number; y: number }[] {
  let seed = 404;
  const random = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  return Array.from({ length: count }, () => ({ x: random() * 100, y: random() * 100 }));
}

export default function NotFound() {
  return (
    <main id="main" className={styles.page}>
      <svg
        className={styles.field}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {noise(320).map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={0.25} />
        ))}
      </svg>
      <div className={styles.copy}>
        <p className={styles.code}>404</p>
        <h1 className={styles.heading}>{microcopy.notFoundHeading}</h1>
        <p className={styles.back}>
          <Link href="/">{microcopy.notFoundLink}</Link>
        </p>
        <p className={styles.name}>{profile.name}</p>
      </div>
    </main>
  );
}
