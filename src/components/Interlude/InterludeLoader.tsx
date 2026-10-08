"use client";

import { lazy, Suspense, useEffect, useRef, useState } from "react";
import type { InterludeCopy } from "./Interlude";
import styles from "./Interlude.module.css";

// The game and its 2,000-point data file are a separate chunk, fetched only when the
// interlude is within about a screen and a half of the viewport.
const BeatMySharpe = lazy(() => import("./BeatMySharpe"));

export function InterludeLoader({
  copy,
  loadingText,
}: {
  copy: InterludeCopy;
  loadingText: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: "150% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // The reserved height matches the loaded game, so nothing shifts when it arrives.
  const placeholder = <div className={styles.placeholder}>{loadingText}</div>;
  return (
    <div ref={ref} className={styles.stage}>
      {near ? (
        <Suspense fallback={placeholder}>
          <BeatMySharpe copy={copy} />
        </Suspense>
      ) : (
        placeholder
      )}
    </div>
  );
}
