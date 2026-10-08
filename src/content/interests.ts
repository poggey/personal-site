import { interestSchema } from "./schema";

// Sources: CV extracurricular section; DECISIONS.md "Off the clock items" (pending confirmation).
export const interests = interestSchema.array().parse([
  {
    id: "zambia",
    text: "Raised over £2,000 across a year for a project in Zambia, then built houses and taught on site.",
  },
  {
    id: "karate",
    text: "Karate black belt. Competed, and led and taught classes.",
  },
  { id: "music", text: "Guitar and piano." },
  { id: "formula-1", text: "Formula 1.", project: "apex" },
  { id: "science-fiction", text: "Science fiction." },
]);
