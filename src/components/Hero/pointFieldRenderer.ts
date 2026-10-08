import { Geometry, Mesh, Program, Renderer } from "ogl";
import { createField, sampleTargets, step, STEP, type Field, type Forces } from "@/lib/point-field";

// Draws the hero's points with OGL. Loaded only after first paint, and only when WebGL
// and motion are both available. Physics lives in lib/point-field.ts.

const vertex = /* glsl */ `
  attribute vec2 position;
  attribute vec2 target;
  uniform vec2 uResolution;
  uniform float uSize;
  varying float vNoise;
  void main() {
    // 0 on its letter, 1 when 40px or more away: how much this point is still noise.
    vNoise = clamp(distance(position, target) / 40.0, 0.0, 1.0);
    // CSS pixels (origin top left) to clip space (origin centre, y up).
    vec2 clip = (position / uResolution) * 2.0 - 1.0;
    gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
    gl_PointSize = uSize;
  }
`;

const fragment = /* glsl */ `
  precision mediump float;
  uniform vec3 uColor;
  uniform vec3 uNoiseColor;
  uniform float uAlpha;
  varying float vNoise;
  void main() {
    // Round points: discard the corners of each square sprite.
    if (length(gl_PointCoord - 0.5) > 0.5) discard;
    // Noise is printed in pink ink; a point turns to print as it lands on its letter.
    gl_FragColor = vec4(mix(uColor, uNoiseColor, vNoise), uAlpha);
  }
`;

function parseColor(css: string): [number, number, number] {
  const m = css.match(/\d+(\.\d+)?/g)?.map(Number) ?? [0, 0, 0];
  return [(m[0] ?? 0) / 255, (m[1] ?? 0) / 255, (m[2] ?? 0) / 255];
}

/** Points per screen: about 12,000 on a 1440 x 900 desktop, scaled by area, 4,000 minimum. */
function wantedPoints(width: number, height: number): number {
  const area = (width * height) / (1440 * 900);
  return Math.round(Math.min(12000, Math.max(4000, 12000 * area)));
}

/** Renders each line of the name to an offscreen canvas, exactly where the DOM text sits. */
function sampleName(
  stage: HTMLElement,
  lines: HTMLElement[],
  dpr: number,
): { points: Float32Array; spacing: number } {
  const box = stage.getBoundingClientRect();
  const canvas = document.createElement("canvas");
  canvas.width = Math.ceil(box.width * dpr);
  canvas.height = Math.ceil(box.height * dpr);
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return { points: new Float32Array(), spacing: 1 };
  ctx.scale(dpr, dpr);
  ctx.textBaseline = "alphabetic";
  for (const line of lines) {
    const style = getComputedStyle(line);
    const r = line.getBoundingClientRect();
    // The width axis is set as font-stretch so the canvas draws the same condensed cut.
    ctx.font = `condensed ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    if ("fontStretch" in ctx)
      (ctx as CanvasRenderingContext2D & { fontStretch: string }).fontStretch = "condensed";
    ctx.letterSpacing = style.letterSpacing;
    const metrics = ctx.measureText(line.textContent ?? "");
    // Place the baseline where the browser placed it: centre the glyph box in the line box.
    const glyphHeight = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent;
    const baseline = r.top - box.top + (r.height - glyphHeight) / 2 + metrics.fontBoundingBoxAscent;
    ctx.fillText(line.textContent ?? "", r.left - box.left, baseline);
  }
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  return sampleTargets(data, canvas.width, canvas.height, wantedPoints(box.width, box.height), dpr);
}

export type PointFieldHandle = {
  destroy: () => void;
  setExit: (progress: number) => void;
};

export type PointFieldOptions = {
  stage: HTMLElement;
  lines: HTMLElement[];
  colorSource: HTMLElement;
  onFirstFrame: () => void;
  /** Called once with the average frame rate over the first second. */
  onFrameRate: (fps: number) => void;
};

export function startPointField(opts: PointFieldOptions): PointFieldHandle {
  const { stage } = opts;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const box = stage.getBoundingClientRect();

  const renderer = new Renderer({ dpr, alpha: true, depth: false, premultipliedAlpha: false });
  const gl = renderer.gl;
  const canvas = gl.canvas as HTMLCanvasElement;
  canvas.setAttribute("aria-hidden", "true");
  canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;pointer-events:none";
  renderer.setSize(box.width, box.height);
  gl.clearColor(0, 0, 0, 0);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  const sample = sampleName(stage, opts.lines, dpr);
  let field: Field = createField(sample.points, box.width, box.height);
  // Points a little smaller than their spacing: the letters read solid, the grain still shows.
  const pointSize = (spacing: number) => Math.max(1.5, spacing * 0.85) * dpr;
  const geometry = new Geometry(gl, {
    position: { size: 2, data: field.position },
    target: { size: 2, data: field.target },
  });
  const program = new Program(gl, {
    vertex,
    fragment,
    transparent: true,
    depthTest: false,
    uniforms: {
      uResolution: { value: [box.width, box.height] },
      uSize: { value: pointSize(sample.spacing) },
      uColor: { value: parseColor(getComputedStyle(opts.colorSource).color) },
      // The riso pink from tokens.css (--ink-pink).
      uNoiseColor: { value: parseColor("rgb(255, 72, 176)") },
      uAlpha: { value: 1 },
    },
  });
  const mesh = new Mesh(gl, { mode: gl.POINTS, geometry, program });
  stage.append(canvas);

  const forces: Forces = { cursor: null, exit: 0 };
  let running = true;
  let visible = true;
  let frame = 0;
  let last = performance.now();
  let accumulator = 0;
  let firstFrame = true;
  const startedAt = last;
  let frames = 0;
  let measured = false;

  function render(now: number) {
    frame = requestAnimationFrame(render);
    // Cap the catch-up after a stall, so a background tab doesn't explode the springs.
    accumulator += Math.min((now - last) / 1000, 0.1);
    last = now;
    while (accumulator >= STEP) {
      step(field, forces);
      accumulator -= STEP;
    }
    geometry.attributes.position!.needsUpdate = true;
    program.uniforms.uAlpha!.value = 1 - forces.exit;
    renderer.render({ scene: mesh });

    if (firstFrame) {
      firstFrame = false;
      opts.onFirstFrame();
    }
    if (!measured) {
      frames += 1;
      if (now - startedAt >= 1000) {
        measured = true;
        opts.onFrameRate((frames * 1000) / (now - startedAt));
      }
    }
  }

  function play() {
    if (running && visible && !document.hidden && !frame) {
      last = performance.now();
      frame = requestAnimationFrame(render);
    }
  }
  function pause() {
    cancelAnimationFrame(frame);
    frame = 0;
  }

  // Pause when the hero is off screen or the tab is hidden.
  const io = new IntersectionObserver(([entry]) => {
    visible = entry?.isIntersecting ?? true;
    if (visible) play();
    else pause();
  });
  io.observe(stage);
  const onVisibility = () => (document.hidden ? pause() : play());
  document.addEventListener("visibilitychange", onVisibility);

  // The cursor (or a touch) adds noise; points re-settle when it leaves.
  const hero = stage.closest("[data-hero]") ?? stage;
  const onMove = (e: Event) => {
    const p = e as PointerEvent;
    const r = stage.getBoundingClientRect();
    forces.cursor = { x: p.clientX - r.left, y: p.clientY - r.top };
  };
  const onLeave = () => (forces.cursor = null);
  hero.addEventListener("pointermove", onMove);
  hero.addEventListener("pointerleave", onLeave);
  hero.addEventListener("pointerup", onLeave);

  // Re-sample on resize so the points always land on the text's new position.
  let resizeTimer = 0;
  const ro = new ResizeObserver(() => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      const b = stage.getBoundingClientRect();
      renderer.setSize(b.width, b.height);
      program.uniforms.uResolution!.value = [b.width, b.height];
      const { points: target, spacing } = sampleName(stage, opts.lines, dpr);
      program.uniforms.uSize!.value = pointSize(spacing);
      if (target.length === field.target.length) {
        field.target.set(target);
        geometry.attributes.target!.needsUpdate = true;
      } else {
        field = createField(target, b.width, b.height);
        field.position.set(target);
        geometry.attributes.position!.data = field.position;
        geometry.attributes.position!.count = field.count;
        geometry.updateAttribute(geometry.attributes.position!);
        geometry.attributes.target!.data = field.target;
        geometry.attributes.target!.count = field.count;
        geometry.updateAttribute(geometry.attributes.target!);
        geometry.setDrawRange(0, field.count);
      }
    }, 150);
  });
  ro.observe(stage);

  frame = requestAnimationFrame(render);

  return {
    setExit(progress) {
      forces.exit = Math.min(1, Math.max(0, progress));
    },
    destroy() {
      running = false;
      pause();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
      hero.removeEventListener("pointerup", onLeave);
      canvas.remove();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}
