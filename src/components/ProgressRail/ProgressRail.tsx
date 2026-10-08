"use client";

import { useEffect, useState } from "react";
import styles from "./ProgressRail.module.css";

export type Mark = { id: string; label: string };

/**
 * Where you are on the page. The page passes the section list; sections also carry
 * data-rail-label so the observer can find them. An
 * IntersectionObserver marks the one crossing the middle of the viewport as current.
 * Desktop: a thin rail on the left with the current label. Mobile: a bar across the top.
 */
export function ProgressRail({ marks }: { marks: Mark[] }) {
  const [current, setCurrent] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-rail-label]"));

    // A band 1px tall in the middle of the viewport: whichever section crosses it is current.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setCurrent(entry.target.id);
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    sections.forEach((s) => observer.observe(s));

    // Progress is read on scroll, but only written once per frame.
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(max > 0 ? window.scrollY / max : 0);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  const index = marks.findIndex((m) => m.id === current);
  const label = index >= 0 ? marks[index]?.label : null;

  return (
    // Over the dark interlude the rail switches to the dark tokens, so it stays legible.
    <nav
      className={`${styles.rail} ${current === "interlude" ? "night" : ""}`}
      aria-label="Sections"
    >
      <div className={styles.track} aria-hidden="true">
        <div className={styles.fill} style={{ transform: `scaleY(${progress})` }} />
      </div>
      <div className={styles.bar} aria-hidden="true" style={{ transform: `scaleX(${progress})` }} />
      <ol className={styles.list} role="list">
        {marks.map((m, i) => (
          <li key={m.id}>
            <a
              href={`#${m.id}`}
              className={styles.link}
              aria-current={m.id === current ? "location" : undefined}
            >
              <span className="visually-hidden">{m.label}</span>
              <span className={styles.tick} aria-hidden="true" data-index={i} />
            </a>
          </li>
        ))}
      </ol>
      {label ? (
        <p className={styles.label} aria-hidden="true">
          {label}
        </p>
      ) : null}
    </nav>
  );
}
