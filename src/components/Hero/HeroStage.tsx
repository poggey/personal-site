"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { MILESTONES, reportProgress } from "./resolve-progress";
import styles from "./Hero.module.css";

/** Below this, the field is cancelled and the plain name stays. */
const MIN_FPS = 30;

function webglAvailable(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") ?? c.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * Wraps the real <h1>. After first paint it lazy-loads the point field (OGL) and GSAP's
 * ScrollTrigger, draws the name as points over the text and, once the first frame is up,
 * hides the text visually (it stays in the DOM). Reduced motion, no WebGL, or a slow first
 * second all leave the plain text. Nothing here changes layout, so the swap can't shift it.
 */
export function HeroStage({ children }: { children: ReactNode }) {
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !webglAvailable()) {
      reportProgress(MILESTONES.firstFrame);
      return;
    }

    let cancelled = false;
    let cleanup = () => {};

    const start = async () => {
      await document.fonts.ready;
      if (cancelled) return;
      reportProgress(MILESTONES.fonts);

      const [{ startPointField }, { gsap }, { ScrollTrigger }] = await Promise.all([
        import("./pointFieldRenderer"),
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      reportProgress(MILESTONES.compiled);

      const lines = Array.from(el.querySelectorAll<HTMLElement>("[data-hero-line]"));
      const h1 = el.querySelector<HTMLElement>("h1");
      if (!h1) return;
      const field = startPointField({
        stage: el,
        lines,
        colorSource: h1,
        onFirstFrame: () => {
          el.dataset.field = "on";
          reportProgress(MILESTONES.firstFrame);
        },
        onFrameRate: (fps) => {
          if (fps < MIN_FPS) stop();
        },
      });

      // The exit: as the hero scrolls away the points loosen, fall and fade.
      const trigger = ScrollTrigger.create({
        trigger: el.closest("[data-hero]") ?? el,
        start: "top top",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => field.setExit(self.progress),
      });

      function stop() {
        trigger.kill();
        field.destroy();
        delete el!.dataset.field;
      }
      cleanup = stop;
    };

    // Start only after the page has loaded and the browser is idle, so the WebGL code never
    // competes with the fonts and the text for the first paint.
    // Safari has no requestIdleCallback; a short timeout does the same job there.
    const hasIdle = typeof window.requestIdleCallback === "function";
    let idle = 0;
    const schedule = () => {
      idle = hasIdle
        ? window.requestIdleCallback(() => void start(), { timeout: 1500 })
        : window.setTimeout(() => void start(), 200);
    };
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener("load", schedule);
      if (hasIdle) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
      cleanup();
    };
  }, []);

  return (
    <div ref={stage} className={styles.stage}>
      {children}
    </div>
  );
}
