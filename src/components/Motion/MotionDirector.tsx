"use client";

import { useEffect } from "react";

/**
 * The page's scroll-linked moves, in one place. Components only mark elements with
 * data-motion="..."; this loads GSAP and ScrollTrigger after the page has loaded and wires
 * each mark to the scroll. The page's resting CSS is always the finished state, so with no
 * JavaScript, or with reduced motion, nothing is hidden and nothing moves.
 *
 * Only moves that say something about their content:
 *   draw-x    a bar draws from its left edge (time on the Positions axis, marks out of 100)
 *   resolve   a halftone image resolves into the real screenshot (noise to signal)
 *   gallery   the case studies scroll sideways while the section is pinned (desktop)
 * Everything animated is a transform or opacity, so the browser can keep it off the
 * main thread and scrolling stays smooth.
 */
export function MotionDirector() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let revert = () => {};
    let cancelled = false;

    const start = async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      const all = (name: string) =>
        Array.from(document.querySelectorAll<HTMLElement>(`[data-motion="${name}"]`));

      const mm = gsap.matchMedia();
      const ctx = gsap.context(() => {
        // One trigger per group of bars (a chart), not one per bar: fewer page measurements.
        const barGroups = new Map<Element, HTMLElement[]>();
        for (const bar of all("draw-x")) {
          const group = bar.closest("[data-motion-group]") ?? bar;
          barGroups.set(group, [...(barGroups.get(group) ?? []), bar]);
        }
        for (const [group, bars] of barGroups) {
          gsap.fromTo(
            bars,
            { scaleX: 0 },
            {
              scaleX: 1,
              ease: "none",
              stagger: 0.08,
              scrollTrigger: { trigger: group, start: "top 85%", end: "top 40%", scrub: true },
            },
          );
        }
      });

      // The gallery pins only on wide screens; phones swipe the same row natively. Halftone
      // images inside the gallery resolve as they travel across, so they are set up here too.
      mm.add({ wide: "(min-width: 1024px)", narrow: "(max-width: 1023px)" }, (context) => {
        const wide = Boolean(context.conditions?.wide);
        const tracks = new Map<Element, gsap.core.Tween>();
        if (wide) {
          for (const section of all("gallery")) {
            const track = section.querySelector<HTMLElement>("[data-gallery-track]");
            if (!track) continue;
            section.dataset.galleryOn = "true";
            const distance = () => track.scrollWidth - window.innerWidth;
            tracks.set(
              track,
              gsap.to(track, {
                x: () => -distance(),
                ease: "none",
                scrollTrigger: {
                  trigger: section,
                  start: "top top",
                  end: () => `+=${distance()}`,
                  pin: true,
                  scrub: 0.6,
                  invalidateOnRefresh: true,
                },
              }),
            );
          }
        }

        for (const el of all("resolve")) {
          const track = el.closest("[data-gallery-track]");
          const along = track ? tracks.get(track) : undefined;
          gsap.fromTo(
            el,
            { "--resolve": 0 },
            {
              "--resolve": 1,
              ease: "none",
              scrollTrigger: along
                ? {
                    trigger: el,
                    containerAnimation: along,
                    start: "left 90%",
                    end: "left 35%",
                    scrub: true,
                  }
                : { trigger: el, start: "top 90%", end: "top 40%", scrub: true },
            },
          );
        }

        return () => {
          for (const section of all("gallery")) delete section.dataset.galleryOn;
        };
      });

      ScrollTrigger.refresh();
      // Lets tests (and anything else) know the page has finished its measuring and pinning.
      document.documentElement.dataset.motion = "ready";
      revert = () => {
        ctx.revert();
        mm.revert();
      };
    };

    // After load, when the browser is idle, so setting up the scroll work never blocks input.
    const run = () => {
      if (typeof window.requestIdleCallback === "function") {
        window.requestIdleCallback(() => void start(), { timeout: 2000 });
      } else window.setTimeout(() => void start(), 300);
    };
    if (document.readyState === "complete") run();
    else window.addEventListener("load", run, { once: true });
    return () => {
      cancelled = true;
      window.removeEventListener("load", run);
      revert();
    };
  }, []);

  return null;
}
