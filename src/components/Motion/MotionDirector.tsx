"use client";

import { useEffect } from "react";

/**
 * Every section's one signature move, in one place. Components only mark elements with
 * data-motion="..."; this loads GSAP and ScrollTrigger after the page has loaded and wires
 * each mark to the scroll. The page's resting CSS is always the finished state, so with no
 * JavaScript, or with reduced motion, nothing is hidden and nothing moves.
 *
 *   register  a section's second ink slides into register as it arrives
 *   stretch   a figure widens along Archivo's width axis
 *   draw-x    a bar draws from its left edge
 *   gather    scattered dots settle into their grid
 *   words     a statement darkens word by word
 *   resolve   a halftone image resolves into the real screenshot
 *   gallery   a row of slides scrolls sideways while the section is pinned (desktop)
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
        for (const section of all("register")) {
          gsap.fromTo(
            section,
            { "--reg": "16px" },
            {
              "--reg": "2px",
              ease: "none",
              scrollTrigger: { trigger: section, start: "top 95%", end: "top 35%", scrub: true },
            },
          );
        }

        for (const el of all("stretch")) {
          gsap.fromTo(
            el,
            { "--wdth": 62, "--wght": 300 },
            {
              "--wdth": 100,
              "--wght": 700,
              ease: "none",
              scrollTrigger: { trigger: el, start: "top 92%", end: "top 60%", scrub: true },
            },
          );
        }

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

        for (const group of all("gather")) {
          const dots = Array.from(group.querySelectorAll<HTMLElement>("[data-dot]"));
          // A fixed scatter (golden-angle spiral), so it looks the same on every visit.
          // One tween with per-dot start values, driven by a single trigger.
          gsap.fromTo(
            dots,
            {
              x: (i: number) => Math.cos(i * 2.39996) * (60 + ((i * 37) % 140)),
              y: (i: number) => Math.sin(i * 2.39996) * (60 + ((i * 37) % 140)),
              opacity: 0.2,
            },
            {
              x: 0,
              y: 0,
              opacity: 1,
              ease: "none",
              scrollTrigger: { trigger: group, start: "top 85%", end: "top 30%", scrub: true },
            },
          );
        }

        for (const el of all("words")) {
          const words = el.querySelectorAll("[data-word]");
          gsap.fromTo(
            words,
            { opacity: 0.55 },
            {
              opacity: 1,
              stagger: 0.1,
              ease: "none",
              scrollTrigger: { trigger: el, start: "top 85%", end: "bottom 55%", scrub: true },
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
