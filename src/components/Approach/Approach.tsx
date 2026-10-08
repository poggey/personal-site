import { content } from "@/content";
import { Section } from "../Section/Section";
import styles from "./Approach.module.css";

const { approach, microcopy } = content;

/** Three principles, each with one concrete example. Not numbered: they are not a sequence. */
export function Approach() {
  return (
    <Section id="approach" heading={microcopy.approachHeading} minDepth="3m">
      <ul className={styles.list} role="list">
        {approach.principles.map((p) => {
          return (
            <li key={p.id} className={styles.item}>
              <h3 className={styles.principle}>{p.principle}</h3>
              <p className={styles.example}>{p.example}</p>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
