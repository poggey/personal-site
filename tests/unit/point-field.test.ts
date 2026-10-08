import { describe, expect, it } from "vitest";
import { createField, gaussian, sampleTargets, seeded, step, unresolved } from "@/lib/point-field";

describe("hero point field", () => {
  it("samples about the wanted number of points from filled pixels", () => {
    const w = 200;
    const h = 100;
    const alpha = new Uint8ClampedArray(w * h * 4);
    // Fill the left half.
    for (let y = 0; y < h; y++) for (let x = 0; x < w / 2; x++) alpha[(y * w + x) * 4 + 3] = 255;
    const { points: targets, spacing } = sampleTargets(alpha, w, h, 1000, 1);
    expect(spacing).toBeGreaterThan(2);
    const count = targets.length / 2;
    expect(count).toBeGreaterThan(800);
    expect(count).toBeLessThan(1300);
    for (let i = 0; i < targets.length; i += 2) expect(targets[i]).toBeLessThan(w / 2 + spacing);
  });

  it("is repeatable: the same seed gives the same scatter", () => {
    const a = seeded(1);
    const b = seeded(1);
    expect([gaussian(a), gaussian(a)]).toEqual([gaussian(b), gaussian(b)]);
  });

  it("settles every point onto its target", () => {
    const target = new Float32Array([10, 10, 50, 20, 90, 40]);
    const field = createField(target, 100, 50);
    expect(unresolved(field)).toBeGreaterThan(1);
    for (let i = 0; i < 120 * 4; i++) step(field, { cursor: null, exit: 0 });
    expect(unresolved(field)).toBeLessThan(0.05);
  });

  it("pushes points away from the cursor", () => {
    const target = new Float32Array([100, 100]);
    const field = createField(target, 200, 200);
    field.position.set([100, 100]);
    field.velocity.set([0, 0]);
    for (let i = 0; i < 30; i++) step(field, { cursor: { x: 90, y: 100 }, exit: 0 });
    expect(field.position[0]).toBeGreaterThan(100);
  });
});
