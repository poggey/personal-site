import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CaseStudy } from "@/components/CaseStudy/CaseStudy";
import { content } from "@/content";
import styles from "./page.module.css";

const { projects, microcopy, profile } = content;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: project.title,
    description: `${project.question} ${project.result}`,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: { title: `${project.title}, ${profile.name}`, description: project.question },
  };
}

/** The standalone case study, for a shared link or a refresh: same content, plus a way back. */
export default async function WorkPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();
  return (
    <main id="main" className={styles.page}>
      <nav className={styles.nav} aria-label={profile.name}>
        <Link href="/#work">{microcopy.backToPage}</Link>
        <span className={styles.name}>{profile.name}</span>
      </nav>
      <CaseStudy project={project} headingLevel={1} />
    </main>
  );
}
