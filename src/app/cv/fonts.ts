import { Newsreader } from "next/font/google";

// The CV is set entirely in Newsreader, roman and italic, so this route preloads its own
// copy (the home page defers Newsreader so the hero's Archivo loads first). Preloading
// here stops the CV text reflowing when the font arrives.
export const newsreaderCv = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-newsreader-cv",
  display: "swap",
});
