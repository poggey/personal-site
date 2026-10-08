import { z } from "zod";

// The parts of the printable CV that aren't already in the site content: the CV's own
// project bullets, extracurriculars and skills line. Wording copied from the CV
// (docs/private/sources/Padraig_Middleton_CV.pdf); dates and roles come from positions.ts
// and education.ts so the two can't disagree.
const cvSchema = z.object({
  projects: z.array(
    z.object({
      slug: z.string(),
      title: z.string(),
      linkLabel: z.string(),
      bullets: z.array(z.string()).min(1),
    }),
  ),
  extracurricular: z.array(z.string()),
  skills: z.array(z.object({ label: z.string(), text: z.string() })),
});

export const cv = cvSchema.parse({
  projects: [
    {
      slug: "risk-dashboard",
      title: "Portfolio Risk Dashboard",
      linkLabel: "risk-dashboard-padraig.streamlit.app",
      bullets: [
        "Built a dashboard measuring VaR, CVaR, Sharpe, Sortino, beta and drawdowns for any portfolio",
        "Added factor-based stress testing that shocks market, rate and volatility exposures",
      ],
    },
    {
      slug: "escape-velocity",
      title: "Escape Velocity: SpaceX IPO Analysis",
      linkLabel: "github.com/poggey/escape-velocity",
      bullets: [
        "Analysed the June 2026 SpaceX IPO: pricing mechanics, valuation and post-listing performance",
      ],
    },
    {
      slug: "stirling",
      title: "Stirling: Daily Economic Briefing",
      linkLabel: "github.com/poggey/stirling-report",
      bullets: [
        "Automated a daily economic briefing from public APIs, with a permanent replayable archive",
      ],
    },
  ],
  extracurricular: [
    "Raised over £2,000 across a year for a Zambian project, then built houses and taught on site",
    "Competed in martial arts as a black belt, and led and taught classes",
  ],
  skills: [
    {
      label: "Technical Skills",
      text: "Python (pandas, NumPy, scikit-learn), regression and Monte Carlo modelling, Excel",
    },
  ],
});
