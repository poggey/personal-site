import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { content } from "@/content";
import { optimiser } from "@/content/data/optimiser";
import type { Project } from "@/content/schema";
import { Figure } from "../Figure/Figure";
import { Section } from "../Section/Section";
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

function CaseStudyRow({ project, flip }: { project: Project; flip: boolean }) {
  const visual = visualFor(project.slug);
  const titleId = `work-${project.slug}`;
  return (
    <article className={`${styles.row} ${flip ? styles.flip : ""}`} aria-labelledby={titleId}>
      <div className={styles.text}>
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
      {visual ? (
        <div className={styles.visual} data-min-depth="3m">
          <Figure caption={visual.caption} source={visual.source}>
            {visual.node}
          </Figure>
        </div>
      ) : null}
    </article>
  );
}

export function SelectedWork() {
  return (
    <Section id="work" heading={microcopy.selectedWorkHeading}>
      <div className={styles.rows}>
        {featured.map((p, i) => (
          <CaseStudyRow key={p.slug} project={p} flip={i % 2 === 1} />
        ))}
      </div>
    </Section>
  );
}
