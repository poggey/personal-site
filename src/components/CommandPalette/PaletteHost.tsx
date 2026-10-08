"use client";

import { lazy, Suspense, useEffect, useState } from "react";
import type { PaletteData } from "./CommandPalette";
import { PALETTE_EVENT, type PaletteMode } from "./events";

// The palette's code loads the first time it is asked for, not with the page.
const CommandPalette = lazy(() => import("./CommandPalette"));

const TEXT_INPUTS = ["text", "search", "email", "url", "tel", "password", "number"];

/** Shortcuts stand aside while someone is typing; sliders and radios don't count. */
function typingInField(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target instanceof HTMLInputElement) return TEXT_INPUTS.includes(target.type);
  return target.isContentEditable || ["TEXTAREA", "SELECT"].includes(target.tagName);
}

/** Listens for Cmd/Ctrl+K, "/" and "?" anywhere on the page, and for the menu button. */
export function PaletteHost({ data }: { data: PaletteData }) {
  const [mode, setMode] = useState<PaletteMode | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setMode((m) => (m ? null : "commands"));
        return;
      }
      if (typingInField(e.target) || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "/") {
        e.preventDefault();
        setMode("commands");
      } else if (e.key === "?") {
        e.preventDefault();
        setMode("shortcuts");
      }
    };
    const onOpen = (e: Event) => setMode((e as CustomEvent<PaletteMode>).detail);
    window.addEventListener("keydown", onKey);
    window.addEventListener(PALETTE_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(PALETTE_EVENT, onOpen);
    };
  }, []);

  if (!mode) return null;
  return (
    <Suspense fallback={null}>
      <CommandPalette data={data} mode={mode} onClose={() => setMode(null)} />
    </Suspense>
  );
}
