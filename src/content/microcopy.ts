import { microcopySchema } from "./schema";

// Interface text. Wording from the white paper's microcopy table unless marked DRAFT.
export const microcopy = microcopySchema.parse({
  factSheetHeading: "Key facts",
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
  // DRAFT
  emailCopied: "Email copied.",
  notFound: "This page didn't resolve. Back to the signal.",
  depth30s: "30 sec",
  depth3m: "3 min",
  depth10m: "10 min",
  askMeAbout: "Ask me about",
  whereItBreaks: "Where it breaks",
});
