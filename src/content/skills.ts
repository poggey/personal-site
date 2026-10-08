import { toolkitSchema } from "./schema";

// The toolkit matrix: every skill names the projects that prove it (portfolio reference
// section 6). No skill without a project, no soft skills.
export const toolkit = toolkitSchema.parse({
  skills: [
    {
      id: "portfolio-theory",
      label: "Portfolio theory",
      projects: ["portfolio-optimiser", "shariah-research"],
    },
    { id: "risk-metrics", label: "Risk metrics", projects: ["risk-dashboard"] },
    { id: "stress-testing", label: "Stress testing", projects: ["risk-dashboard"] },
    {
      id: "regression-inference",
      label: "Regression and inference",
      projects: ["apex", "the-slate"],
    },
    { id: "monte-carlo", label: "Monte Carlo", projects: ["portfolio-optimiser"] },
    { id: "valuation", label: "Valuation", projects: ["escape-velocity"] },
    { id: "islamic-finance", label: "Islamic finance", projects: ["shariah-research"] },
    {
      id: "data-engineering",
      label: "Data engineering and APIs",
      projects: ["stirling", "the-slate", "apex"],
    },
    { id: "production-systems", label: "Production systems and testing", projects: ["stirling"] },
    {
      id: "front-end",
      label: "Front-end and data visualisation",
      projects: ["stirling", "escape-velocity", "the-slate", "apex", "greenline"],
    },
    {
      id: "design",
      label: "Design",
      projects: ["stirling", "the-slate", "marginalia", "greenline"],
    },
  ],
  tools: [
    "Python (pandas, NumPy, SciPy, scikit-learn, statsmodels)",
    "R",
    "TypeScript",
    "Next.js",
    "GSAP",
    "Excel",
    "BlackRock Portfolio 360",
    "Bloomberg",
    "Figma",
    "n8n",
    "Git",
  ],
});
