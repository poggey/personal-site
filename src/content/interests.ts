import { interestSchema } from "./schema";

// Sources: CV extracurricular section; DECISIONS.md "Off the clock items" (pending confirmation).
export const interests = interestSchema.array().parse([
  {
    id: "zambia",
    title: "Zambia", // DRAFT
    text: "Raised over £2,000 across a year for a project in Zambia, then built houses and taught on site.",
  },
  {
    id: "karate",
    title: "Karate", // DRAFT
    text: "Karate black belt. Competed, and led and taught classes.",
  },
  { id: "music", title: "Music", text: "Guitar and piano." }, // DRAFT title
  { id: "formula-1", title: "F1", text: "Formula 1.", project: "apex" }, // DRAFT title
  { id: "science-fiction", title: "Sci-fi", text: "Science fiction." }, // DRAFT title
]);
