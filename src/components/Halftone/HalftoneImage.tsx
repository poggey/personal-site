"use client";

import { useEffect, useRef, type ImgHTMLAttributes } from "react";
import styles from "./HalftoneImage.module.css";

type Props = {
  /** Props for the real image, worked out on the server by getImageProps. */
  image: ImgHTMLAttributes<HTMLImageElement>;
  alt: string;
  /** The ink the dots are printed in. */
  ink: string;
  /** The paper behind the dots. */
  paper: string;
  /** Distance between dot centres, in CSS pixels. */
  cell?: number;
};

/**
 * A real screenshot that arrives as a riso halftone (dots sized by darkness, in one ink)
 * and resolves into the image itself as it scrolls in. MotionDirector scrubs --resolve
 * from 0 to 1. At rest --resolve is 1, so without motion it is simply the image.
 */
export function HalftoneImage({ image, alt, ink, paper, cell = 7 }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const img = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const c = canvas.current;
    const source = img.current;
    if (!c || !source) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const draw = () => {
      const { width, height } = c.getBoundingClientRect();
      if (!width || !height || !source.naturalWidth) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      c.width = Math.round(width * dpr);
      c.height = Math.round(height * dpr);
      const ctx = c.getContext("2d");
      if (!ctx) return;

      // Sample the image at one pixel per cell, then draw a dot per cell.
      const cols = Math.ceil(width / cell);
      const rows = Math.ceil(height / cell);
      const sample = document.createElement("canvas");
      sample.width = cols;
      sample.height = rows;
      const sctx = sample.getContext("2d", { willReadFrequently: true });
      if (!sctx) return;
      sctx.drawImage(source, 0, 0, cols, rows);
      const data = sctx.getImageData(0, 0, cols, rows).data;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = paper;
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = ink;
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = (y * cols + x) * 4;
          const lum =
            (0.2126 * (data[i] ?? 255) +
              0.7152 * (data[i + 1] ?? 255) +
              0.0722 * (data[i + 2] ?? 255)) /
            255;
          // Darker pixels make bigger dots; the square root keeps mid-tones readable.
          const r = (cell / 2) * Math.sqrt(1 - lum) * 1.05;
          if (r < 0.35) continue;
          ctx.beginPath();
          ctx.arc(x * cell + cell / 2, y * cell + cell / 2, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      c.dataset.ready = "true";
    };

    // Drawing is a few hundred thousand pixel reads, so it waits until the image is within
    // about a screen of view, then redraws only if its size changes.
    const resize = new ResizeObserver(() => {
      if (c.dataset.ready) draw();
    });
    const near = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        near.disconnect();
        if (source.complete) draw();
        else source.addEventListener("load", draw, { once: true });
        resize.observe(c);
      },
      { rootMargin: "100% 100%" },
    );
    near.observe(c);
    return () => {
      near.disconnect();
      resize.disconnect();
    };
  }, [ink, paper, cell]);

  return (
    <div className={styles.frame} data-motion="resolve">
      {/* eslint-disable-next-line @next/next/no-img-element -- props come from getImageProps */}
      <img ref={img} {...image} alt={alt} className={styles.image} />
      <canvas ref={canvas} className={styles.dots} aria-hidden="true" />
    </div>
  );
}
