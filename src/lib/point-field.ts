// The hero's physics, kept free of WebGL so it can be read (and tested) on its own.
// Every point has a target on the name's letterforms; a damped spring pulls it there.

/** How hard a point is pulled towards its target, per second squared per pixel. */
export const STIFFNESS = 38;
/** How quickly motion dies away. Below 2·√STIFFNESS (about 12.3) it overshoots a little. */
export const DAMPING = 9;
/** The cursor pushes points within this many CSS pixels. */
export const CURSOR_RADIUS = 120;
/** How hard the cursor pushes at its centre. */
export const CURSOR_FORCE = 9000;
/** Fixed physics step, so the settle looks the same at any frame rate. */
export const STEP = 1 / 120;

export type Field = {
  count: number;
  /** x, y pairs in CSS pixels, relative to the stage. */
  position: Float32Array;
  velocity: Float32Array;
  target: Float32Array;
};

/** A seeded generator, so the scatter is the same on every visit. */
export function seeded(seed: number): () => number {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

/** A standard normal sample (Box-Muller): the "noise" the points start as. */
export function gaussian(random: () => number): number {
  const u = Math.max(random(), 1e-9);
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * random());
}

/**
 * Picks target points from a rendered image of the name: every filled pixel on a grid.
 * The grid spacing is chosen so the count lands near `wanted`, and each point is nudged by
 * up to a third of a cell (seeded) so the letters read as grain, not as a screen pattern.
 * Returns the points in CSS pixels and the spacing between them.
 */
export function sampleTargets(
  alpha: Uint8ClampedArray,
  width: number,
  height: number,
  wanted: number,
  scale: number,
): { points: Float32Array; spacing: number } {
  let filled = 0;
  for (let i = 3; i < alpha.length; i += 4) if ((alpha[i] ?? 0) > 128) filled += 1;
  const step = Math.max(1, Math.sqrt(filled / wanted));
  const random = seeded(7);
  const jitter = () => (random() - 0.5) * (step / 1.5);
  const points: number[] = [];
  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const i = (Math.floor(y) * width + Math.floor(x)) * 4 + 3;
      if ((alpha[i] ?? 0) > 128) points.push((x + jitter()) / scale, (y + jitter()) / scale);
    }
  }
  return { points: new Float32Array(points), spacing: step / scale };
}

/** Starts every point in a Gaussian cloud around the middle of the stage. */
export function createField(target: Float32Array, width: number, height: number): Field {
  const count = target.length / 2;
  const random = seeded(20260708);
  const position = new Float32Array(target.length);
  for (let i = 0; i < count; i++) {
    position[i * 2] = width / 2 + gaussian(random) * width * 0.28;
    position[i * 2 + 1] = height / 2 + gaussian(random) * height * 0.45;
  }
  return { count, position, velocity: new Float32Array(target.length), target };
}

export type Forces = {
  /** Cursor position in stage pixels, or null when it is away. */
  cursor: { x: number; y: number } | null;
  /** 0 at rest, 1 when the hero has scrolled away: springs loosen and points fall. */
  exit: number;
};

/** Advances the field by one fixed step. */
export function step(field: Field, forces: Forces, dt: number = STEP): void {
  const { position: p, velocity: v, target: t } = field;
  const k = STIFFNESS * (1 - forces.exit * 0.9);
  const gravity = forces.exit * 900;
  const r2 = CURSOR_RADIUS * CURSOR_RADIUS;
  for (let i = 0; i < field.count; i++) {
    const ix = i * 2;
    const iy = ix + 1;
    const px = p[ix] ?? 0;
    const py = p[iy] ?? 0;
    let ax = k * ((t[ix] ?? 0) - px) - DAMPING * (v[ix] ?? 0);
    let ay = k * ((t[iy] ?? 0) - py) - DAMPING * (v[iy] ?? 0) + gravity;
    if (forces.cursor) {
      const dx = px - forces.cursor.x;
      const dy = py - forces.cursor.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < r2 && d2 > 0.01) {
        // Push straight away from the cursor, strongest at the centre, zero at the edge.
        const d = Math.sqrt(d2);
        const push = CURSOR_FORCE * (1 - d / CURSOR_RADIUS);
        ax += (dx / d) * push;
        ay += (dy / d) * push;
      }
    }
    v[ix] = (v[ix] ?? 0) + ax * dt;
    v[iy] = (v[iy] ?? 0) + ay * dt;
    p[ix] = px + (v[ix] ?? 0) * dt;
    p[iy] = py + (v[iy] ?? 0) * dt;
  }
}

/** Mean distance from target: how "resolved" the field is (0 means fully settled). */
export function unresolved(field: Field): number {
  let total = 0;
  for (let i = 0; i < field.count * 2; i += 2) {
    total += Math.hypot(
      (field.position[i] ?? 0) - (field.target[i] ?? 0),
      (field.position[i + 1] ?? 0) - (field.target[i + 1] ?? 0),
    );
  }
  return field.count ? total / field.count : 0;
}
