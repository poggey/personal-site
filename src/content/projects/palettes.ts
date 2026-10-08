import type { CSSProperties } from "react";
import { contrast, AA_TEXT } from "@/lib/contrast";
import type { Project } from "../schema";

// Each case-study panel wears its project's own colours, read from the project's repo
// (the palette's `source` field names the file; checked 2026-10-08). This turns a palette
// into the site's token names, keeping text at AA: an accent that fails AA on its
// background is kept for marks and rules, and links fall back to the text colour.

type TokenName = "--paper" | "--print" | "--pencil" | "--rule" | "--biro" | "--biro-wash";
/** Custom properties set as an inline style; React accepts them as CSSProperties. */
export type PanelTokens = Record<TokenName, string> & CSSProperties;

export function panelTokens(palette: Project["palette"]): PanelTokens | null {
  if (!palette) return null;
  const { background, text, accent } = palette;
  const accentReadable = contrast(accent, background) >= AA_TEXT;
  return {
    "--paper": background,
    "--print": text,
    // Secondary text is the text colour thinned towards the background; 72% keeps AA on
    // every palette in projects.ts (checked in tests/unit/palettes.test.ts).
    "--pencil": `color-mix(in srgb, ${text} 72%, ${background})`,
    "--rule": `color-mix(in srgb, ${text} 18%, ${background})`,
    "--biro": accentReadable ? accent : text,
    "--biro-wash": `color-mix(in srgb, ${accent} 16%, transparent)`,
  };
}

/** Whether the palette's accent is dark-on-light or light-on-dark, for color-scheme. */
export function isDarkPalette(palette: Project["palette"]): boolean {
  return palette
    ? contrast(palette.background, "#000000") < contrast(palette.background, "#ffffff")
    : false;
}
