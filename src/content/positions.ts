import { flags } from "./flags";
import { positionSchema } from "./schema";

// Experience, oldest first. Wording follows the CV; the application copy fills in detail
// only where it agrees with the CV. Conflicts are listed in docs/private/CONTENT-CHECK.md.
const raymondJamesFunds = flags.showRaymondJamesFigures
  ? [
      {
        text: "The report compared SVS RM Defensive Capital, Fidelity Absolute Return Global Equity and Jupiter Merian Global Equity Absolute Return. RM is long-only alternatives; the other two are equity market neutral long/short.",
        depth: "10m",
      },
    ]
  : [];

export const positions = positionSchema.array().parse([
  {
    id: "zaltek",
    employer: "Zaltek Digital",
    role: "Junior Associate",
    type: "Part-time",
    start: "2022-06",
    end: null,
    location: "Newcastle, UK",
    outcomes: [
      {
        text: "Designed a council website template in Figma, now used by 650+ UK councils, and led the migration onto it.",
        depth: "30s",
      },
      {
        text: "Managed the company accounts and reported profit by project from time-tracking data.",
        depth: "3m",
      },
      {
        text: "Designed a digital tool for the NHS-SPS in Figma, applying UK Government Design Principles.",
        depth: "3m",
      },
      {
        text: "Built automated email marketing workflows in n8n, generating qualified sales contacts.",
        depth: "3m",
      },
    ],
  },
  {
    id: "house-of-lords",
    employer: "UK Parliament, House of Lords",
    role: "Work experience",
    type: "Work experience",
    start: "2023-07",
    end: "2023-07",
    location: "London, UK",
    outcomes: [
      {
        text: "Researched policy issues for House of Lords peers, focusing on UK productivity rates.",
        depth: "30s",
      },
      {
        text: "Co-wrote and fact-checked a speech delivered by a Labour peer under tight deadlines.",
        depth: "3m",
      },
    ],
  },
  {
    id: "icd-energy",
    employer: "ICD Energy",
    role: "Intern",
    type: "Internship",
    start: "2024-09",
    end: "2024-09",
    location: "Newcastle, UK",
    outcomes: [
      {
        text: "Compiled 1,000+ records from several sources into a single Excel workbook for the team.",
        depth: "30s",
      },
    ],
  },
  {
    id: "parkdean",
    employer: "Parkdean Resorts",
    role: "Customer Sales Support Advisor",
    type: "Seasonal",
    start: "2026-06",
    end: "2026-09",
    location: "Newcastle, UK",
    outcomes: [
      {
        text: "Consistently ranked top three of around 25 call centre advisors on the daily revenue leaderboard.",
        depth: "30s",
      },
      {
        text: "Beat all eight other summer hires on conversion rate and total sales value.",
        depth: "3m",
      },
    ],
  },
  {
    id: "raymond-james",
    employer: "Raymond James Monument",
    role: "Wealth Management",
    type: "Work experience",
    start: "2026-08",
    end: "2026-08",
    location: "Newcastle, UK",
    outcomes: [
      {
        text: "Built a Shariah-compliant portfolio matched on risk, then on exposure, using sukuk in place of bonds.",
        depth: "30s",
      },
      {
        text: "Compared holdings in client portfolios against a fund pitched by its manager, and wrote a recommendation.",
        depth: "3m",
      },
      {
        text: "Used BlackRock Portfolio 360 to analyse the portfolios I built.",
        depth: "3m",
      },
      ...raymondJamesFunds,
    ],
  },
]);
