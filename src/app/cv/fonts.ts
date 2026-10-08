import { Newsreader } from "next/font/google";

// The CV sets roles and dates in italic, as Padraig's own CV does. Only this route needs
// the italic file, so it is loaded here rather than with the page.
export const newsreaderItalic = Newsreader({
  subsets: ["latin"],
  style: ["italic"],
  variable: "--font-newsreader-italic",
  display: "swap",
});
