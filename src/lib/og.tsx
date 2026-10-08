import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { PALETTE } from "@/styles/palette";

// Shared Open Graph card: the site's print-on-paper look, built from content.
// Static font files live in src/assets/fonts (next/og can't read variable fonts).

export const ogSize = { width: 1200, height: 630 };

const font = (file: string) => readFile(join(process.cwd(), "src/assets/fonts", file));

type Card = {
  kicker: string;
  title: string;
  line: string;
  footer: string;
  /** A project's own palette, or the site's light palette. */
  colours?: { background: string; text: string; accent: string };
};

export async function ogCard({ kicker, title, line, footer, colours }: Card) {
  const c = colours ?? {
    background: PALETTE.light.paper,
    text: PALETTE.light.print,
    accent: PALETTE.light.biro,
  };
  const [display, ui, serif] = await Promise.all([
    font("archivo-condensed-800.ttf"),
    font("archivo-500.ttf"),
    font("newsreader-400.ttf"),
  ]);
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 64,
        background: c.background,
        color: c.text,
        fontFamily: "Archivo",
      }}
    >
      <div style={{ display: "flex", fontSize: 26, opacity: 0.75 }}>{kicker}</div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            fontFamily: "Archivo Condensed",
            fontSize: title.length > 18 ? 112 : 150,
            lineHeight: 0.9,
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </div>
        <div style={{ fontFamily: "Newsreader", fontSize: 40, marginTop: 28, maxWidth: 940 }}>
          {line}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", fontSize: 24 }}>
        <div
          style={{ width: 14, height: 14, borderRadius: 7, background: c.accent, marginRight: 14 }}
        />
        {footer}
      </div>
    </div>,
    {
      ...ogSize,
      fonts: [
        { name: "Archivo Condensed", data: display, weight: 800, style: "normal" },
        { name: "Archivo", data: ui, weight: 500, style: "normal" },
        { name: "Newsreader", data: serif, weight: 400, style: "normal" },
      ],
    },
  );
}
