import { flags } from "./flags";
import { specialismSchema } from "./schema";

// Islamic finance. Sources: CV (Raymond James), portfolio reference 3.2 and 4.2.
// The bps gaps are left out (2026-10-08): what they measure isn't clear from the sources,
// so the finding is stated without numbers.
export const specialism = specialismSchema.parse({
  heading: "Islamic finance",
  // DRAFT
  body: "At Raymond James I built a Shariah-compliant model portfolio, matched to an existing mandate on risk first and then on exposure, with sukuk in place of conventional bonds. I've since extended it into model portfolios for risk levels 4 to 7, built from UCITS instruments and tested in BlackRock Portfolio 360 against the equivalent conventional models.",
  finding: flags.showRaymondJamesFigures
    ? {
        // DRAFT
        summary: "Risk-matching holds at lower risk and breaks down at higher risk.",
        // DRAFT
        cause: "No financials, limited alternatives and a heavy reliance on sukuk.",
      }
    : null,
  // DRAFT: definitions are not from the sources. Padraig to confirm the wording.
  glossary: [
    {
      term: "Sukuk",
      definition:
        "Shariah-compliant certificates that give holders a share in an underlying asset and its income, used where a conventional portfolio would hold bonds.",
    },
    {
      term: "AAOIFI",
      definition:
        "The Accounting and Auditing Organization for Islamic Financial Institutions, which sets Shariah standards. Standard No. 62 covers sukuk.",
    },
  ],
  extras: [
    {
      // DRAFT
      text: "The research workbook covers 56+ indices, the investable products that track them, screening standards and structural risks.",
      depth: "10m",
    },
    {
      // DRAFT
      text: "Currency is a constraint: much of the sukuk on offer is unhedged USD, while the risk targets are in GBP.",
      depth: "10m",
    },
  ],
});
