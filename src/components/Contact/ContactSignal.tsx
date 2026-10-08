"use client";

import { useEffect, useRef } from "react";
import { createField, step } from "@/lib/point-field";

const SIZE = 120;
const POINTS = 260;

/**
 * The page's last move: a small scatter beside the email that collapses into a single dot,
 * the signal, when the section comes into view. It uses the hero's physics, all points
 * aiming at one target. Reduced motion shows the dot alone.
 */
export function ContactSignal() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.width = SIZE * dpr;
    c.height = SIZE * dpr;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    const colour = getComputedStyle(c).color;

    const target = new Float32Array(POINTS * 2).fill(SIZE / 2);
    const field = createField(target, SIZE, SIZE);
    const draw = (radius: number) => {
      ctx.clearRect(0, 0, SIZE, SIZE);
      ctx.fillStyle = colour;
      for (let i = 0; i < POINTS; i++) {
        ctx.beginPath();
        ctx.arc(field.position[i * 2] ?? 0, field.position[i * 2 + 1] ?? 0, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      field.position.set(target);
      draw(6);
      return;
    }
    draw(1.2);

    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          for (let i = 0; i < 2; i++) step(field, { cursor: null, exit: 0 });
          // Points grow as they converge, so the last frame is one solid dot.
          const t = Math.min(1, (now - start) / 1400);
          draw(1.2 + t * 4.8);
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    observer.observe(c);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <canvas
      ref={canvas}
      aria-hidden="true"
      style={{ width: SIZE, height: SIZE, color: "var(--biro)" }}
    />
  );
}
