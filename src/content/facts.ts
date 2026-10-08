import { factSheetSchema } from "./schema";

// The fact sheet. Every row traces to a source line in docs/private/CONTENT-CHECK.md.
// The Zaltek tenure and the GitHub count are recomputed at build time in phase 03;
// the values here are the fallbacks as of the asOf month.
export const factSheet = factSheetSchema.parse({
  asOf: "2026-10",
  sourcesLine: "Sources: transcript, employers, GitHub.",
  rows: [
    {
      id: "year-one-average",
      label: "Year 1 average, First Class, Queen Mary",
      value: "85%",
      footnote: "Mathematical Methods 94%, Microeconomics 91%, Statistical Methods 88%.",
      source: "Transcript",
    },
    {
      id: "councils",
      label: "UK councils using a website template I designed",
      value: "650+",
      footnote: "Designed in Figma at Zaltek Digital. I led the migration onto it.",
      source: "Zaltek Digital",
    },
    {
      id: "zaltek-tenure",
      label: "At Zaltek Digital, alongside school and university",
      value: "4 yrs",
      footnote: "Part-time since Jun 2022.",
      source: "Zaltek Digital",
    },
    {
      id: "parkdean-leaderboard",
      label: "Daily revenue leaderboard, Parkdean Resorts call centre",
      value: "Top 3",
      footnote:
        "Of around 25 advisors. Also beat all eight other summer hires on conversion rate and total sales value.",
      source: "Parkdean Resorts",
    },
    {
      id: "public-projects",
      label: "Public projects on GitHub",
      value: "8",
      footnote: "Counted from the GitHub API at build time.",
      source: "GitHub",
    },
  ],
});
