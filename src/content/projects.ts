import { flags } from "./flags";
import { projectSchema } from "./schema";

// Project metadata. The panel prose lives in projects/<slug>.mdx under the five fixed headings.
// Sources: portfolio reference sections 1 to 3 and 7. Palettes are read from each project's
// own repo (the source field names the file). Questions and results marked DRAFT are my wording.
const shariahResult = flags.showRaymondJamesFigures
  ? "Risk-matching held at Risk 4.5 (7 bps apart) and broke down at Risk 7 (108 bps apart)."
  : "Risk-matching held at lower risk levels and broke down at higher ones.";

export const projects = projectSchema.array().parse([
  {
    slug: "risk-dashboard",
    title: "Portfolio Risk Dashboard",
    type: "Risk analytics web app",
    year: 2026,
    status: "Live",
    links: [
      { label: "Live", href: "https://risk-dashboard-padraig.streamlit.app" },
      { label: "Code", href: "https://github.com/poggey/risk-dashboard" },
    ],
    stack: ["Python", "Streamlit", "Plotly", "pandas", "NumPy"],
    question: "Once you've built a portfolio, how do you measure and stress-test its risk?",
    // DRAFT
    result:
      "VaR, CVaR, Sharpe, Sortino, beta and drawdowns for any portfolio, plus factor-based stress tests.",
    talkingPoint:
      'Why factor shocks beat "what if X falls 40%", and the Sleep Test as behavioural risk.',
    // The app uses Streamlit's default theme; there are no project tokens to read.
    palette: null,
    featured: true,
    privateOnly: false,
  },
  {
    slug: "stirling",
    title: "Stirling",
    type: "Automated daily economic briefing",
    year: 2026,
    status: "Live, updated daily",
    links: [
      { label: "Live", href: "https://stirling-report.vercel.app" },
      { label: "Code", href: "https://github.com/poggey/stirling-report" },
    ],
    stack: ["Next.js", "TypeScript", "Vercel", "Gemini", "GitHub Actions"],
    question: "Can a junior analyst's morning routine run itself, for £0 a month?",
    // DRAFT
    result:
      "One numbered edition every day, at £0 a month, with a replayable archive and 46 fixture-backed tests.",
    talkingPoint:
      "Code decides what mattered, AI only words it. Immutable editions, built and run for £0.",
    palette: {
      name: "Racing Ink",
      background: "#F6F4EC",
      text: "#17251E",
      accent: "#0C3B2A",
      source: "stirling-report/tailwind.config.ts",
    },
    featured: true,
    privateOnly: false,
  },
  {
    slug: "the-slate",
    title: "The Slate",
    type: "Data analysis and scroll essay",
    year: 2026,
    status: "Analysis and site built",
    links: [{ label: "Code", href: "https://github.com/poggey/the-slate" }],
    stack: ["Python", "pandas", "statsmodels", "GSAP", "Lenis"],
    question: "Is A24 a film studio or a venture fund?",
    // DRAFT
    result: "58 films: mean ROI +191%, median −10%. Five films made about 65% of the profit.",
    talkingPoint: "Acclaim does pay, and the result survived all 13 sensitivity runs.",
    palette: {
      name: "Final Frame",
      background: "#0D0A08",
      text: "#F0EBE0",
      accent: "#E8B45A",
      source: "the-slate/site/src/styles/tokens.css",
    },
    featured: false,
    privateOnly: false,
  },
  {
    slug: "escape-velocity",
    title: "Escape Velocity",
    type: "IPO analysis and data essay",
    year: 2026,
    status: "Built, live data to come",
    links: [{ label: "Code", href: "https://github.com/poggey/escape-velocity" }],
    stack: ["Python", "yfinance", "Vite", "JavaScript", "GSAP", "WebGL"],
    question: "How did the largest IPO in history break the rules?",
    // DRAFT
    result: "Five deviations from IPO convention, at a $135 IPO price and a 94× multiple.",
    talkingPoint:
      "The five deviations from IPO convention, and my own fair-value view with dated predictions.",
    palette: {
      name: "Escape Velocity",
      background: "#0A0A0C",
      text: "#F2F2EF",
      accent: "#C96F3B",
      source: "escape-velocity/styles/tokens.css",
    },
    featured: false,
    privateOnly: false,
  },
  {
    slug: "portfolio-optimiser",
    title: "Portfolio Optimiser",
    type: "Quant finance",
    year: 2026,
    status: "Complete",
    links: [{ label: "Code", href: "https://github.com/poggey/portfolio-optimiser" }],
    stack: ["Python", "pandas", "NumPy", "SciPy", "yfinance"],
    // DRAFT
    question: "Which mix of eight London-listed ETFs gives the best return for its risk?",
    // DRAFT
    result: "Max Sharpe 0.76 against −0.31 for equal weights, from just two assets.",
    talkingPoint: "Why max Sharpe went all in on two assets, and how I'd fix it.",
    palette: null,
    featured: false,
    privateOnly: false,
  },
  {
    slug: "apex",
    title: "APEX",
    type: "Statistical modelling",
    year: 2026,
    status: "Live",
    links: [
      { label: "Live", href: "https://f1-pace-analyser.vercel.app" },
      { label: "Code", href: "https://github.com/poggey/f1-pace-analyser" },
    ],
    stack: ["Python", "FastF1", "networkx", "Next.js", "D3"],
    question: "Great driver, or just a great car?",
    // DRAFT
    result:
      "12,270 qualifying laps from 2018 to 2024, split into driver, car and circuit, with a confidence interval on every number.",
    talkingPoint: "Driver and car are only separable because the teammate network is connected.",
    palette: {
      name: "APEX",
      background: "#0A0A0B",
      text: "#F2F3F5",
      accent: "#E10600",
      source: "f1-pace-analyser/frontend/src/app/globals.css",
    },
    featured: false,
    privateOnly: false,
  },
  {
    slug: "marginalia",
    title: "Marginalia",
    type: "Recommender system",
    year: 2026,
    status: "Built",
    links: [{ label: "Code", href: "https://github.com/poggey/marginalia-app" }],
    stack: ["Next.js", "TypeScript", "IndexedDB"],
    // DRAFT
    question: "Can explicit maths pick the next book you'll like?",
    // DRAFT
    result: "The maths worked; the inputs didn't. Only 20 books had hand-authored tone profiles.",
    talkingPoint: "A recommender that failed for data reasons, not maths, and what would fix it.",
    palette: {
      name: "Porcelain and Ink",
      background: "#F7F7F4",
      text: "#17181C",
      accent: "#3546E8",
      source: "marginalia-app/app/globals.css",
    },
    featured: false,
    privateOnly: false,
  },
  {
    slug: "shariah-research",
    title: "Shariah portfolio research",
    type: "Islamic finance",
    year: 2026,
    status: "Ongoing, private",
    links: [],
    stack: ["Excel", "BlackRock Portfolio 360"],
    // DRAFT
    question: "Can a Shariah-compliant portfolio match a conventional one on risk?",
    result: shariahResult,
    talkingPoint: "Why risk-matching breaks down at higher risk levels.",
    palette: null,
    featured: false,
    privateOnly: true,
  },
  {
    slug: "greenline",
    title: "Greenline HSE",
    type: "Client website",
    year: 2026,
    status: "In build",
    links: [],
    stack: ["HTML", "CSS", "JavaScript", "GSAP"],
    // DRAFT
    question: "What does a one-person safety consultancy need from its website?",
    // DRAFT
    result: "Six sections and a custom booking flow, with no third-party scheduler.",
    talkingPoint: "Designing for credibility, not lead generation.",
    palette: null,
    featured: false,
    privateOnly: true,
  },
  {
    slug: "built-by",
    title: "built-by",
    type: "Utility",
    year: 2026,
    status: "Complete",
    links: [{ label: "Code", href: "https://github.com/poggey/built-by" }],
    stack: ["JavaScript"],
    // DRAFT
    question: "How do I sign every project the same way?",
    result: "A one-line, zero-dependency attribution badge with automatic light and dark modes.",
    talkingPoint: "The badge at the bottom of this page.",
    palette: null,
    featured: false,
    privateOnly: false,
  },
]);
