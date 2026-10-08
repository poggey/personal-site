import { z } from "zod";

// Every fact on the site passes through one of these schemas. Content files parse
// themselves on import, so a bad value fails the build rather than reaching the page.

/** How long the reader has: the depth dial. An item shows at its depth and every deeper one. */
export const depthSchema = z.enum(["30s", "3m", "10m"]);
export type Depth = z.infer<typeof depthSchema>;

/** A calendar month as "YYYY-MM". Stored this way so charts can compute with it; shown as "Jun 2022". */
export const monthSchema = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Use YYYY-MM");

const hexSchema = z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Use a six-digit hex colour");
const slugSchema = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use kebab-case");

export const linkSchema = z.object({
  label: z.string().min(1),
  href: z.url(),
});

/** A line of copy and the shallowest depth at which it appears. */
export const depthTextSchema = z.object({
  text: z.string().min(1),
  depth: depthSchema,
  /** The CV's own wording, where the site says more than the one-page CV has room for. */
  cvText: z.string().min(1).optional(),
});

export const profileSchema = z.object({
  name: z.string().min(1),
  degree: z.string().min(1),
  university: z.string().min(1),
  locations: z.array(z.string().min(1)).min(1),
  heroLineOptions: z.tuple([z.string(), z.string(), z.string()]),
  heroLine: z.string().min(1),
  availability: z.string().min(1),
  email: z.email(),
  links: z.object({
    linkedin: linkSchema,
    github: linkSchema,
    cv: z.string().startsWith("/"),
  }),
  colophon: z.string().min(1),
});

export const factSchema = z.object({
  id: slugSchema,
  label: z.string().min(1),
  value: z.string().min(1),
  /** Shown in the depth layer as a sidenote. */
  footnote: z.string().min(1),
  /** Where the figure comes from, in words a reader would accept ("Transcript", "GitHub API"). */
  source: z.string().min(1),
});

export const factSheetSchema = z.object({
  asOf: monthSchema,
  sourcesLine: z.string().min(1),
  rows: z.array(factSchema).min(1),
});

export const positionSchema = z.object({
  id: slugSchema,
  employer: z.string().min(1),
  role: z.string().min(1),
  type: z.enum(["Part-time", "Work experience", "Internship", "Seasonal"]),
  start: monthSchema,
  /** null means the role is current. */
  end: monthSchema.nullable(),
  location: z.string().min(1),
  outcomes: z.array(depthTextSchema).min(1),
});

export const moduleSchema = z.object({
  name: z.string().min(1),
  mark: z.number().int().min(0).max(100).optional(),
  note: z.string().optional(),
});

export const educationSchema = z.object({
  id: slugSchema,
  institution: z.string().min(1),
  qualification: z.string().min(1),
  location: z.string().min(1),
  start: monthSchema,
  end: monthSchema,
  result: z.string().optional(),
  modules: z.array(moduleSchema),
  currentModules: z.array(moduleSchema).optional(),
  grades: z.array(z.string().min(1)).optional(),
  extras: z.array(depthTextSchema).optional(),
});

export const skillSchema = z.object({
  id: slugSchema,
  label: z.string().min(1),
  /** Project slugs that prove this skill. The loader checks each one exists. */
  projects: z.array(slugSchema).min(1),
});

export const toolkitSchema = z.object({
  skills: z.array(skillSchema).min(1),
  tools: z.array(z.string().min(1)).min(1),
});

export const interestSchema = z.object({
  id: slugSchema,
  text: z.string().min(1),
  /** Optional link to a project slug, such as APEX from Formula 1. */
  project: slugSchema.optional(),
});

export const paletteSchema = z.object({
  name: z.string().min(1),
  background: hexSchema,
  text: hexSchema,
  accent: hexSchema,
  /** The file in the project's repo the colours were read from. */
  source: z.string().min(1),
});

export const projectSchema = z
  .object({
    slug: slugSchema,
    title: z.string().min(1),
    type: z.string().min(1),
    year: z.number().int().min(2020).max(2100),
    status: z.string().min(1),
    links: z.array(linkSchema),
    stack: z.array(z.string().min(1)).min(1),
    question: z.string().min(1),
    result: z.string().min(1),
    talkingPoint: z.string().min(1),
    /** null until the project's own tokens are known; the panel then falls back to site tokens. */
    palette: paletteSchema.nullable(),
    /** Always featured. The third featured slot is chosen by flags.featuredThird. */
    featured: z.boolean(),
    /** Not public: described on the site but never linked. */
    privateOnly: z.boolean(),
    /** A real screenshot of the project for the Index hover preview, in public/images/. */
    preview: z.object({ src: z.string().startsWith("/"), alt: z.string().min(1) }).optional(),
  })
  .refine((p) => p.privateOnly || p.links.length > 0, {
    message: "A public project needs at least one link",
  });

export const approachSchema = z.object({
  principles: z
    .array(
      z.object({
        id: slugSchema,
        principle: z.string().min(1),
        example: z.string().min(1),
        project: slugSchema,
      }),
    )
    .length(3),
});

export const specialismSchema = z.object({
  heading: z.string().min(1),
  body: z.string().min(1),
  finding: z
    .object({
      summary: z.string().min(1),
      cause: z.string().min(1),
    })
    // null when flags.showRaymondJamesFigures is off: the method shows, the numbers don't.
    .nullable(),
  glossary: z.array(z.object({ term: z.string().min(1), definition: z.string().min(1) })),
  extras: z.array(depthTextSchema),
});

export const interludeSchema = z.object({
  heading: z.string().min(1),
  prompt: z.string().min(1),
  tickers: z.array(z.object({ ticker: z.string().min(1), name: z.string().min(1) })).length(8),
  riskFreeRate: z.number(),
  target: z.object({ sharpe: z.number(), tolerance: z.number() }),
  optimum: z.object({
    sharpe: z.number(),
    annualReturn: z.number(),
    annualVolatility: z.number(),
    weights: z.record(z.string(), z.number()),
  }),
  equalWeightSharpe: z.number(),
  reveal: z.string().min(1),
  fix: z.string().min(1),
});

/** Short interface text: section headings, buttons, the 404. */
export const microcopySchema = z.record(z.string(), z.string().min(1));

export const flagsSchema = z.object({
  showRaymondJamesFigures: z.boolean(),
  showGreenline: z.boolean(),
  featuredThird: z.enum(["the-slate", "escape-velocity"]),
});

export type Profile = z.infer<typeof profileSchema>;
export type Fact = z.infer<typeof factSchema>;
export type FactSheet = z.infer<typeof factSheetSchema>;
export type Position = z.infer<typeof positionSchema>;
export type Education = z.infer<typeof educationSchema>;
export type Skill = z.infer<typeof skillSchema>;
export type Toolkit = z.infer<typeof toolkitSchema>;
export type Interest = z.infer<typeof interestSchema>;
export type Project = z.infer<typeof projectSchema>;
export type Flags = z.infer<typeof flagsSchema>;
export type Approach = z.infer<typeof approachSchema>;
export type Specialism = z.infer<typeof specialismSchema>;
export type Interlude = z.infer<typeof interludeSchema>;
