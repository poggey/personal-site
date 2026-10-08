import { microcopySchema } from "./schema";

// Interface text. Wording from the white paper's microcopy table unless marked DRAFT.
// Parsed for the build check; exported as the literal object so every key is typed.
const text = {
  factSheetHeading: "Key facts",
  approachHeading: "Approach", // DRAFT
  selectedWorkHeading: "Selected work",
  indexHeading: "Index",
  positionsHeading: "Positions",
  educationHeading: "Education",
  toolkitHeading: "Toolkit",
  offTheClockHeading: "Off the clock",
  contactHeading: "Let's talk.",
  openCaseStudy: "Open the case study",
  readMethod: "Read the method",
  downloadCv: "Download CV (PDF)",
  emailCopied: "Email copied.", // DRAFT
  copyEmail: "Copy email", // DRAFT
  notFound: "This page didn't resolve. Back to the signal.",
  notFoundHeading: "This page didn't resolve.",
  notFoundLink: "Back to the signal.",
  depth30s: "30 sec",
  depth3m: "3 min",
  depth10m: "10 min",
  depthLegend: "Reading depth", // DRAFT
  askMeAbout: "Ask me about",
  whereItBreaks: "Where it breaks",
  skipToContent: "Skip to content", // DRAFT
  asOf: "As of", // DRAFT
  stirlingChip: "Stirling", // DRAFT
  stirlingEdition: "Edition", // DRAFT
  stirlingToday: "Today", // DRAFT
  stirlingStale: "Last edition", // DRAFT
  closePanel: "Close", // DRAFT
  backToPage: "Back to the page", // DRAFT
  stack: "Stack", // DRAFT
  links: "Links", // DRAFT
  privateProject: "Private work, described but not linked.", // DRAFT
  indexColumns: "Project, type, year, stack, status", // DRAFT
  londonTime: "London", // DRAFT
  lastUpdated: "Last updated", // DRAFT
  colophonType: "Set in Archivo and Newsreader.", // DRAFT
  sourceCode: "Source on GitHub", // DRAFT
  commandPalette: "Menu", // DRAFT
  commandPlaceholder: "Jump to a section, open a project, or type a command", // DRAFT
  shortcutsHeading: "Keyboard shortcuts", // DRAFT
  toggleTheme: "Switch light or dark", // DRAFT
  matrixCaption: "Skills against the projects that prove them", // DRAFT
  matrixProof: "Shown in", // DRAFT
  outcomes: "Show outcomes", // DRAFT
  hideOutcomes: "Hide outcomes", // DRAFT
  printCv: "Print", // DRAFT
  resolving: "Resolving", // the intro counter, from the white paper ("Resolving 042")
  paletteHeading: "Go to", // DRAFT
  paletteSections: "Section", // DRAFT
  paletteProjects: "Project", // DRAFT
  paletteActions: "Action", // DRAFT
  paletteNoResults: "Nothing matches.", // DRAFT
  consoleNote:
    "Reading the source? It is all on GitHub: github.com/poggey/personal-site. Press ? for shortcuts.", // DRAFT
  shortcutPalette: "Open this menu", // DRAFT
  shortcutHelp: "Show these shortcuts", // DRAFT
  shortcutClose: "Close a panel or menu", // DRAFT
  shortcutSliders: "Move a focused slider by 1%", // DRAFT
  cvEducation: "Education",
  cvWork: "Work experience",
  cvProjects: "Projects",
  cvExtracurricular: "Extracurricular activities",
  cvSkills: "Skills",
  interludeTarget: "Get within {tolerance} of the optimiser's {sharpe}.", // DRAFT
  interludeReset: "Reset",
  interludeShowOptimum: "Show me the optimum",
  interludeReturn: "Return",
  interludeVolatility: "Volatility",
  interludeSharpe: "Sharpe",
  interludeYou: "Your portfolio", // DRAFT
  interludeOptimum: "Max Sharpe", // DRAFT
  interludeFrontier: "Efficient frontier",
  interludeRandom: "2,000 random portfolios", // DRAFT
  interludeWeights: "Weights", // DRAFT
  interludeLoading: "Loading the optimiser data.", // DRAFT
  interludeData: "Data: Yahoo Finance daily closes, {start} to {end}. Risk-free rate {rf}.", // DRAFT
  interludeChartLabel:
    "Volatility against return for random portfolios, the efficient frontier and your portfolio", // DRAFT
};

microcopySchema.parse(text);

export const microcopy = text;
