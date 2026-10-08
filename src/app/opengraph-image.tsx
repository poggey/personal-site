import { content } from "@/content";
import { ogCard, ogSize } from "@/lib/og";

const { profile } = content;

export const alt = `${profile.name}: ${profile.heroLine}`;
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return ogCard({
    kicker: `${profile.degree}, ${profile.university}`,
    title: profile.name,
    line: profile.heroLine,
    footer: profile.availability,
  });
}
