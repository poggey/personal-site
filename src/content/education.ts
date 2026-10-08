import { educationSchema } from "./schema";

// Sources: CV education section; portfolio reference section 5 (current modules,
// trading programme, defence report).
export const education = educationSchema.array().parse([
  {
    id: "qmul",
    institution: "Queen Mary University of London",
    qualification: "BSc (Econ) Economics and Finance",
    location: "London, UK",
    start: "2025-09",
    end: "2028-06",
    result: "85% average (First Class)",
    modules: [
      { name: "Mathematical Methods", mark: 94 },
      { name: "Microeconomics", mark: 91 },
      { name: "Statistical Methods", mark: 88 },
    ],
    currentModules: [
      { name: "Econometrics 1", note: "R" },
      { name: "Financial Statements and Analysis" },
      { name: "Games and Strategies" },
      { name: "Asset Pricing", note: "Python" },
    ],
    extras: [
      { text: "QMUL Finance Trading Programme, including the Bloomberg terminal.", depth: "3m" },
      {
        // DRAFT
        text: "Statistical Methods report: an equal-weighted UK defence portfolio (Melrose, Babcock, QinetiQ, BAE Systems, Rolls-Royce) against the FTSE 100 over 51 weeks of 2025. Paired t-test on mean weekly returns: t = 1.58, not significant. At that effect size, about 682 weeks of data would be needed.",
        depth: "10m",
      },
    ],
  },
  {
    id: "st-marys",
    institution: "St Mary's Catholic School",
    qualification: "A-levels and GCSEs",
    location: "Newcastle, UK",
    start: "2018-09",
    end: "2025-07",
    modules: [],
    grades: [
      "A-levels: Maths A*, Further Maths A, Economics A, English Language B",
      "GCSEs: seven grade 9s and three grade 8s, including 9s in Maths and English",
    ],
  },
]);
