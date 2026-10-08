import { profileSchema } from "./schema";

// Sources: CV header and education; DECISIONS.md (hero lines, colophon);
// portfolio reference "Who" (availability). See docs/private/CONTENT-CHECK.md.
const heroLineOptions: [string, string, string] = [
  "I build tools that pull the signal out of financial data.",
  "Most of what moves in a market is noise. I build the filter.",
  "Risk models, market briefings and portfolio tools, designed and shipped.",
];

export const profile = profileSchema.parse({
  name: "Padraig Middleton",
  degree: "BSc (Econ) Economics and Finance",
  university: "Queen Mary University of London",
  locations: ["London", "Newcastle"],
  heroLineOptions,
  heroLine: heroLineOptions[0],
  // DRAFT
  availability: "Open to Summer 2027 internships: markets, banking, quant, asset management.",
  email: "padraigmiddleton@gmail.com",
  links: {
    linkedin: { label: "LinkedIn", href: "https://www.linkedin.com/in/padraig-middleton" },
    github: { label: "GitHub", href: "https://github.com/poggey" },
    cv: "/cv/Padraig-Middleton-CV.pdf",
  },
  colophon: "Designed in Figma, built with Next.js and Claude Code.",
});
