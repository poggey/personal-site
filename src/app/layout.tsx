import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Archivo, Newsreader } from "next/font/google";
import { content } from "@/content";
import { bootScript } from "@/lib/boot-script";
import { siteUrl } from "@/lib/site";
import "@/styles/tokens.css";
import "@/styles/globals.css";

// Archivo carries the name, headings, UI and figures; its width axis is the hero's device.
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

// Newsreader carries the reading: body, sidenotes and case-study prose.
const newsreader = Newsreader({
  subsets: ["latin"],
  axes: ["opsz"],
  // Italic is only used on /cv, which loads its own (see app/cv/fonts.ts).
  style: ["normal"],
  variable: "--font-newsreader",
  display: "swap",
  // Not preloaded, so the hero's Archivo (the LCP text) gets the bandwidth first.
  preload: false,
});

const { profile } = content;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: profile.name, template: `%s, ${profile.name}` },
  description: `${profile.degree}, ${profile.university}. ${profile.heroLine}`,
  alternates: { canonical: "/" },
  openGraph: { type: "website", siteName: profile.name, locale: "en_GB" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3f4f2" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({ children, panel }: LayoutProps<"/">) {
  return (
    // The boot script sets data-depth, data-theme and a "js" class before React hydrates.
    <html
      lang="en-GB"
      data-depth="3m"
      className={`${archivo.variable} ${newsreader.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        {children}
        {panel}
        {/* Vercel Web Analytics: cookieless, so no consent banner. Only on Vercel, where its
            script exists; locally it would 404. */}
        {process.env.VERCEL ? <Analytics /> : null}
      </body>
    </html>
  );
}
