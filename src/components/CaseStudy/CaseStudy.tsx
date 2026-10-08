import Image from "next/image";
import { content } from "@/content";
import { panels } from "@/content/panels";
import { isDarkPalette, panelTokens } from "@/content/projects/palettes";
import type { Project } from "@/content/schema";
import styles from "./CaseStudy.module.css";

const { microcopy } = content;

/**
 * A case study: title, question and result, then the five fixed headings from the
 * project's MDX, then stack, links and "Ask me about". Rendered in the project's own
 * palette when it has one. Used by both the panel and the standalone page.
 */
export function CaseStudy({
  project,
  headingLevel = 2,
}: {
  project: Project;
  headingLevel?: 1 | 2;
}) {
  const Body = panels[project.slug];
  const Title = `h${headingLevel}` as const;
  const tokens = panelTokens(project.palette);
  return (
    <article
      className={`${styles.study} ${isDarkPalette(project.palette) ? styles.dark : ""}`}
      style={tokens ?? undefined}
      aria-labelledby={`study-${project.slug}`}
    >
      <header className={styles.header}>
        <p className={styles.type}>
          {project.type}, {project.year}
        </p>
        <Title id={`study-${project.slug}`} className={styles.title}>
          {project.title}
        </Title>
        <p className={styles.question}>{project.question}</p>
        <p className={styles.result}>{project.result}</p>
      </header>

      {project.preview ? (
        <figure className={styles.shot}>
          <Image
            src={project.preview.src}
            alt={project.preview.alt}
            width={1440}
            height={900}
            sizes="(min-width: 1024px) 44rem, 100vw"
          />
        </figure>
      ) : null}

      {/* The MDX headings sit one level below the title, whichever level that is. */}
      <div className={styles.prose}>
        {Body ? (
          <Body components={headingLevel === 1 ? {} : { h2: (props) => <h3 {...props} /> }} />
        ) : null}
      </div>

      <dl className={styles.facts}>
        <div>
          <dt>{microcopy.stack}</dt>
          <dd>{project.stack.join(", ")}</dd>
        </div>
        <div>
          <dt>{microcopy.links}</dt>
          <dd>
            {project.privateOnly || project.links.length === 0 ? (
              microcopy.privateProject
            ) : (
              <ul className={styles.links} role="list">
                {project.links.map((l) => (
                  <li key={l.href}>
                    <a href={l.href}>{l.label}</a>
                  </li>
                ))}
              </ul>
            )}
          </dd>
        </div>
        <div className={styles.ask}>
          <dt>{microcopy.askMeAbout}</dt>
          <dd>{project.talkingPoint}</dd>
        </div>
      </dl>
    </article>
  );
}
