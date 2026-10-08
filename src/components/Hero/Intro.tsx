"use client";

import { useEffect, useRef, useState } from "react";
import { INTRO_STORAGE_KEY } from "@/lib/boot-script";
import { RESOLVE_EVENT } from "./resolve-progress";
import styles from "./Intro.module.css";

/** The intro never holds the page longer than this. */
const MAX_MS = 1600;

/**
 * "Resolving 0" to "100", counting real milestones from HeroStage (fonts ready, WebGL
 * compiled, first frame drawn). Shown only when the boot script added html.intro, so a
 * repeat visit or reduced motion never sees it. CSS also hides it after 1.8s on its own,
 * so a script failure can't leave the page covered.
 */
export function Intro({ label }: { label: string }) {
  const [shown, setShown] = useState(0);
  const target = useRef(0);

  useEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains("intro")) return;

    let frame = 0;
    const finish = () => {
      try {
        sessionStorage.setItem(INTRO_STORAGE_KEY, "1");
      } catch {
        // Storage blocked: the intro may play again, which is harmless.
      }
      root.classList.add("intro-done");
      window.setTimeout(() => root.classList.remove("intro", "intro-done"), 400);
    };
    // Count up towards the latest milestone, a few steps per frame.
    const tick = () => {
      setShown((n) => {
        const next = Math.min(target.current, n + 3);
        if (next >= 100) {
          finish();
          return 100;
        }
        frame = requestAnimationFrame(tick);
        return next;
      });
    };
    const onProgress = (e: Event) => {
      target.current = Math.max(target.current, (e as CustomEvent<number>).detail);
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(tick);
    };
    window.addEventListener(RESOLVE_EVENT, onProgress);
    const limit = window.setTimeout(() => {
      target.current = 100;
      frame = requestAnimationFrame(tick);
    }, MAX_MS - 300);
    return () => {
      window.removeEventListener(RESOLVE_EVENT, onProgress);
      window.clearTimeout(limit);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className={styles.intro} aria-hidden="true">
      <p className={styles.counter}>
        {label} <span className={styles.number}>{String(shown).padStart(3, "0")}</span>
      </p>
    </div>
  );
}
