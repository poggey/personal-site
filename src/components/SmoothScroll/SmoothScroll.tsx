"use client";

import { useEffect } from "react";

/**
 * Lenis smooth scrolling, for mouse and trackpad only: touch scrolling is already smooth,
 * and reduced motion gets the browser's own. ScrollTrigger (the hero exit) reads Lenis's
 * position so the two never disagree. Both libraries load lazily.
 */
export function SmoothScroll() {
  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    let destroy = () => {};
    let cancelled = false;
    void Promise.all([import("lenis"), import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([{ default: Lenis }, { gsap }, { ScrollTrigger }]) => {
        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger);
        const lenis = new Lenis({ lerp: 0.12, anchors: true });
        lenis.on("scroll", ScrollTrigger.update);
        // One clock: GSAP's ticker drives Lenis, so scrubbed animations stay in step.
        const raf = (time: number) => lenis.raf(time * 1000);
        gsap.ticker.add(raf);
        gsap.ticker.lagSmoothing(0);
        destroy = () => {
          gsap.ticker.remove(raf);
          lenis.destroy();
        };
      },
    );
    return () => {
      cancelled = true;
      destroy();
    };
  }, []);
  return null;
}
