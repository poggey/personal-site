import Link from "next/link";
import { content } from "@/content";
import { Section } from "../Section/Section";
import { DragRow } from "./DragRow";
import styles from "./OffTheClock.module.css";

const { interests, projects, microcopy } = content;

// The cards cycle through the riso inks, so the row reads as a set of printed cards.
const INKS = ["pink", "yellow", "green", "blue"] as const;

/** The person, one card each: a word set large, one line beneath. A row you can drag. */
export function OffTheClock() {
  return (
    <Section id="off-the-clock" heading={microcopy.offTheClockHeading} minDepth="3m">
      <DragRow label={microcopy.offTheClockHeading}>
        {interests.map((item, i) => {
          const project = item.project ? projects.find((p) => p.slug === item.project) : null;
          return (
            <li key={item.id} className={`${styles.card} ink-${INKS[i % INKS.length]}`}>
              <p className={styles.text}>{item.text}</p>
              {project ? (
                <Link href={`/work/${project.slug}`} scroll={false} className={styles.link}>
                  {project.title}
                </Link>
              ) : null}
              <p className={styles.title} aria-hidden="true">
                {item.title}
              </p>
            </li>
          );
        })}
      </DragRow>
    </Section>
  );
}
