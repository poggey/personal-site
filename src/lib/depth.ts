import type { Depth } from "@/content/schema";

// The depth dial's state lives on <html data-depth>, so CSS can show and hide content
// without React re-rendering the page. This module is the only place that writes it.

export const DEPTHS: readonly Depth[] = ["30s", "3m", "10m"];
export const DEFAULT_DEPTH: Depth = "3m";
export const DEPTH_STORAGE_KEY = "depth";
export const DEPTH_EVENT = "depthchange";

export function parseDepth(value: string | null | undefined): Depth | null {
  return DEPTHS.find((d) => d === value) ?? null;
}

/** Depth from the URL first (so a link can set it), then this visit's stored choice. */
export function readInitialDepth(search: string, stored: string | null): Depth {
  const fromUrl = parseDepth(new URLSearchParams(search).get("depth"));
  return fromUrl ?? parseDepth(stored) ?? DEFAULT_DEPTH;
}

export function getDepth(): Depth {
  if (typeof document === "undefined") return DEFAULT_DEPTH;
  return parseDepth(document.documentElement.dataset.depth) ?? DEFAULT_DEPTH;
}

export function setDepth(depth: Depth): void {
  document.documentElement.dataset.depth = depth;
  try {
    sessionStorage.setItem(DEPTH_STORAGE_KEY, depth);
  } catch {
    // Storage can be blocked (private mode); the dial still works for this page view.
  }
  // Keep ?depth= in step if the visitor arrived with one, so a reload keeps their choice.
  const url = new URL(window.location.href);
  if (url.searchParams.has("depth")) {
    url.searchParams.set("depth", depth);
    window.history.replaceState(window.history.state, "", url);
  }
  window.dispatchEvent(new CustomEvent<Depth>(DEPTH_EVENT, { detail: depth }));
}

export function subscribeDepth(callback: () => void): () => void {
  window.addEventListener(DEPTH_EVENT, callback);
  return () => window.removeEventListener(DEPTH_EVENT, callback);
}
