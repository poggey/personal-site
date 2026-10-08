import { content } from "@/content";
import { ogCard, ogSize } from "@/lib/og";

const { projects, profile } = content;

export const alt = "Case study";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

/** One card per case study, in the project's own palette where it has one. */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug) ?? projects[0]!;
  return ogCard({
    kicker: `${project.type}, ${project.year}`,
    title: project.title,
    line: project.question,
    footer: profile.name,
    colours: project.palette ?? undefined,
  });
}
