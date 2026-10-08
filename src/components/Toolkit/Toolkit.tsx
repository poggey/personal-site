import { content } from "@/content";
import { Section } from "../Section/Section";
import { Matrix, type MatrixProps } from "./Matrix";
import styles from "./Toolkit.module.css";

const { toolkit, projects, microcopy } = content;

/**
 * Skills against the projects that prove them. Only projects that prove at least one skill
 * get a column, and the content loader guarantees every skill has at least one project.
 */
export function Toolkit() {
  const used = new Set(toolkit.skills.flatMap((s) => s.projects));
  const columns: MatrixProps["columns"] = projects
    .filter((p) => used.has(p.slug))
    .map((p) => ({ slug: p.slug, title: p.title }));
  return (
    <Section id="toolkit" heading={microcopy.toolkitHeading} minDepth="3m" ink="yellow">
      <Matrix
        skills={toolkit.skills.map((s) => ({ id: s.id, label: s.label, projects: s.projects }))}
        columns={columns}
        caption={microcopy.matrixCaption}
        proofLabel={microcopy.matrixProof}
      />
      <p className={styles.tools}>{toolkit.tools.join(", ")}</p>
    </Section>
  );
}
