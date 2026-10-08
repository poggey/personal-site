import { getImageProps } from "next/image";
import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { content } from "@/content";
import { optimiser } from "@/content/data/optimiser";
import type { Project } from "@/content/schema";
import { Figure } from "../Figure/Figure";
import { HalftoneImage } from "../Halftone/HalftoneImage";
import { panelTokens } from "@/content/projects/palettes";
import { EscapeVelocityVisual } from "../Visuals/EscapeVelocityVisual";
import { RiskVisual } from "../Visuals/RiskVisual";
import { SlateVisual } from "../Visuals/SlateVisual";
import { StirlingClipping } from "../Visuals/StirlingClipping";
import styles from "./SelectedWork.module.css";

const { featured, microcopy, visuals } = content;

/** Each featured project's mini visual, with its caption and source line. */
function visualFor(slug: string): { node: ReactNode; caption: string; source: string } | null {
  switch (slug) {
    case "risk-dashboard":
      return {
        node: (
          <RiskVisual
            histogram={optimiser.sampleReturns}
            confidenceLabel={visuals.riskDashboard.confidenceLabel}
          />
        ),
        ...visuals.riskDashboard,
      };
    case "stirling":
      return {
        node: (
          <Suspense fallback={null}>
            <StirlingClipping />
          </Suspense>
        ),
        ...visuals.stirling,
      };
    case "the-slate":
      return { node: <SlateVisual />, ...visuals.slate };
    case "escape-velocity":
      return { node: <EscapeVelocityVisual />, ...visuals.escapeVelocity };
    default:
      return null;
  }
}

/** One full-screen slide: the project's own colours, its real screenshot and its visual. */
function Slide({ project, index, total }: { project: Project; index: number; total: number }) {
  const visual = visualFor(project.slug);
  const tokens = panelTokens(project.palette);
  const titleId = `work-${project.slug}`;
  const shot = project.preview
    ? getImageProps({
        src: project.preview.src,
        alt: project.preview.alt,
        width: 1440,
        height: 900,
        sizes: "(min-width: 1024px) 55vw, 88vw",
      }).props
    : null;
  return (
    <article
      className={`${styles.slide} ${tokens ? "" : "tone-deep"}`}
      style={tokens ?? undefined}
      aria-labelledby={titleId}
    >
      <div className={styles.text}>
        <p className={styles.count}>
          {index + 1} of {total}
        </p>
        <h3 id={titleId} className={styles.title}>
          {project.title}
        </h3>
        <p className={styles.type}>{project.type}</p>
        <p className={styles.question} data-min-depth="3m">
          {project.question}
        </p>
        <p className={styles.result}>{project.result}</p>
        <p className={styles.stack} data-min-depth="3m">
          {project.stack.join(", ")}
        </p>
        <ul className={styles.links} role="list">
          <li>
            <Link href={`/work/${project.slug}`} className={styles.primary} scroll={false}>
              {microcopy.openCaseStudy}
              <span className="visually-hidden">: {project.title}</span>
            </Link>
          </li>
          {project.links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className={styles.link}>
                {l.label}
                <span className="visually-hidden">: {project.title}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.media} data-min-depth="3m">
        {shot && project.preview ? (
          <HalftoneImage
            image={shot}
            alt={project.preview.alt}
            ink={project.palette?.text ?? "#ffffff"}
            paper={project.palette?.background ?? "#0f1b3d"}
          />
        ) : null}
        {visual ? (
          <div className={shot ? styles.inset : styles.feature}>
            <Figure caption={visual.caption} source={visual.source}>
              {visual.node}
            </Figure>
          </div>
        ) : null}
      </div>
    </article>
  );
}

/**
 * Selected work as a gallery. On wide screens MotionDirector pins the section and scrolls
 * the slides sideways; on phones they are a native swipe row. Without motion the slides
 * simply stack, so every word is reachable in any mode.
 */
export function SelectedWork() {
  return (
    <section
      id="work"
      aria-labelledby="work-heading"
      data-rail-label={microcopy.selectedWorkHeading}
      data-motion="gallery"
      className={styles.gallery}
    >
      <div className={styles.track} data-gallery-track>
        <div className={styles.intro}>
          <h2 id="work-heading" className={styles.heading}>
            {microcopy.selectedWorkHeading}
          </h2>
          <ol className={styles.contents}>
            {featured.map((p) => (
              <li key={p.slug}>{p.title}</li>
            ))}
          </ol>
        </div>
        {featured.map((p, i) => (
          <Slide key={p.slug} project={p} index={i} total={featured.length} />
        ))}
      </div>
    </section>
  );
}
