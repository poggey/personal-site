import { approach } from "./approach";
import { education } from "./education";
import { factSheet } from "./facts";
import { flags } from "./flags";
import { interests } from "./interests";
import { interlude } from "./interlude";
import { microcopy } from "./microcopy";
import { positions } from "./positions";
import { profile } from "./profile";
import { projects } from "./projects";
import { toolkit } from "./skills";
import { specialism } from "./specialism";
import { visuals } from "./visuals";

// The one entry point for content. Each file has already parsed itself against its schema;
// this adds the checks that span files, so a broken reference fails the build too.
// Components import from "@/content", never from the individual files.

const visibleProjects = projects.filter((p) => flags.showGreenline || p.slug !== "greenline");
const slugs = new Set(projects.map((p) => p.slug));

function assertSlug(slug: string, where: string): void {
  if (!slugs.has(slug))
    throw new Error(`Content error: ${where} refers to unknown project "${slug}"`);
}

const duplicate = projects.find((p, i) => projects.findIndex((q) => q.slug === p.slug) !== i);
if (duplicate) throw new Error(`Content error: duplicate project slug "${duplicate.slug}"`);

for (const skill of toolkit.skills) {
  for (const slug of skill.projects) assertSlug(slug, `skill "${skill.id}"`);
}
for (const interest of interests) {
  if (interest.project) assertSlug(interest.project, `interest "${interest.id}"`);
}
for (const principle of approach.principles)
  assertSlug(principle.project, `approach "${principle.id}"`);
assertSlug(flags.featuredThird, "flags.featuredThird");

if (!profile.heroLineOptions.includes(profile.heroLine)) {
  throw new Error("Content error: heroLine must be one of heroLineOptions");
}

/** Featured case studies in page order: the fixed two, then the flagged third. */
const featured = [
  ...visibleProjects.filter((p) => p.featured),
  ...visibleProjects.filter((p) => p.slug === flags.featuredThird),
];

/** Everything not featured, for the Index. */
const indexed = visibleProjects.filter((p) => !featured.includes(p));

export const content = {
  profile,
  factSheet,
  approach,
  featured,
  indexed,
  projects: visibleProjects,
  interlude,
  positions,
  specialism,
  education,
  toolkit,
  interests,
  microcopy,
  visuals,
  flags,
} as const;

export type Content = typeof content;
