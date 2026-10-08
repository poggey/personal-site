// The palette is opened by event so any button can open it without importing its code.
export const PALETTE_EVENT = "palette:open";

export type PaletteMode = "commands" | "shortcuts";

export function openPalette(mode: PaletteMode = "commands"): void {
  window.dispatchEvent(new CustomEvent<PaletteMode>(PALETTE_EVENT, { detail: mode }));
}
