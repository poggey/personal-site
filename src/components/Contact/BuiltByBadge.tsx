"use client";

import { useEffect, useRef } from "react";

/**
 * Padraig's attribution badge (github.com/poggey/built-by, vendored in public/vendor).
 * It is a floating badge, so it is only loaded once the footer is in view: it signs the
 * end of the page rather than covering the hero.
 */
export function BuiltByBadge({ name, github }: { name: string; github: string }) {
  const sentinel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      observer.disconnect();
      if (document.querySelector("script[data-built-by-loader]")) return;
      const script = document.createElement("script");
      script.src = "/vendor/built-by.js";
      script.defer = true;
      script.dataset.builtByLoader = "";
      script.dataset.name = name;
      script.dataset.github = github;
      script.dataset.position = "bottom-right";
      document.body.append(script);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [name, github]);
  return <div ref={sentinel} aria-hidden="true" />;
}
