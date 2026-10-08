import { approachSchema } from "./schema";

// Three working principles, each with one concrete example from a project.
// Facts from the portfolio reference (Stirling trust model, Escape Velocity build, Marginalia limits).
export const approach = approachSchema.parse({
  principles: [
    {
      id: "code-decides",
      // DRAFT
      principle: "Code decides, AI words it.",
      // DRAFT
      example:
        "Stirling picks the day's story with a deterministic salience score. The language model only writes it up.",
      project: "stirling",
    },
    {
      id: "every-line-explainable",
      // DRAFT
      principle: "Every line explainable.",
      // DRAFT
      example:
        "Escape Velocity uses no frameworks or chart libraries, so I can talk through any part of it.",
      project: "escape-velocity",
    },
    {
      id: "say-where-it-breaks",
      // DRAFT
      principle: "Say where it breaks.",
      // DRAFT
      example:
        "Every project has a limits section. Marginalia's is the most interesting thing about it.",
      project: "marginalia",
    },
  ],
});
