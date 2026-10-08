import { notFound } from "next/navigation";
import { CaseStudy } from "@/components/CaseStudy/CaseStudy";
import { PanelShell } from "@/components/CaseStudy/PanelShell";
import { content } from "@/content";
import { panelTokens } from "@/content/projects/palettes";

// Intercepts /work/<slug> when it is reached from the page, and shows it as a panel over
// the page instead of navigating away. A direct visit renders app/work/[slug] instead.
export function generateStaticParams() {
  return content.projects.map((p) => ({ slug: p.slug }));
}

export default async function WorkPanel({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = content.projects.find((p) => p.slug === slug);
  if (!project) notFound();
  return (
    <PanelShell
      slug={project.slug}
      closeLabel={content.microcopy.closePanel}
      tokens={panelTokens(project.palette) ?? undefined}
    >
      <CaseStudy project={project} headingLevel={2} />
    </PanelShell>
  );
}
