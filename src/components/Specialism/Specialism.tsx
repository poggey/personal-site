import type { ReactNode } from "react";
import { content } from "@/content";
import { Section } from "../Section/Section";
import { Sidenote } from "../Sidenote/Sidenote";
import styles from "./Specialism.module.css";

const { specialism } = content;

/**
 * Puts a glossary sidenote after the first use of each term in the text. Terms the text
 * doesn't use are returned so they can be listed separately.
 */
function annotate(text: string): { nodes: ReactNode[]; unused: typeof specialism.glossary } {
  const nodes: ReactNode[] = [];
  const unused: typeof specialism.glossary = [];
  let rest = text;
  let n = 0;
  for (const entry of specialism.glossary) {
    const at = rest.toLowerCase().indexOf(entry.term.toLowerCase());
    if (at === -1) {
      unused.push(entry);
      continue;
    }
    const end = at + entry.term.length;
    n += 1;
    nodes.push(
      rest.slice(0, end),
      <Sidenote key={entry.term} n={n} label={entry.term}>
        <strong>{entry.term}.</strong> {entry.definition}
      </Sidenote>,
    );
    rest = rest.slice(end);
  }
  nodes.push(rest);
  return { nodes, unused };
}

/** Islamic finance: what was built, and the one finding, stated without figures. */
export function Specialism() {
  const { nodes, unused } = annotate(specialism.body);
  const finding = specialism.finding;
  return (
    <Section id="specialism" heading={specialism.heading} minDepth="3m">
      <div className={`${styles.layout} has-margin-notes`}>
        <div className={styles.text}>
          {finding ? <p className={styles.summary}>{finding.summary}</p> : null}
          <p>{nodes}</p>
          {finding ? <p className={styles.cause}>{finding.cause}</p> : null}
          {specialism.extras.map((e) => (
            <p key={e.text} data-min-depth={e.depth} className={styles.extra}>
              {e.text}
            </p>
          ))}
          {unused.length > 0 ? (
            <dl className={styles.glossary} data-min-depth="10m">
              {unused.map((g) => (
                <div key={g.term}>
                  <dt>{g.term}</dt>
                  <dd>{g.definition}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
      </div>
    </Section>
  );
}
