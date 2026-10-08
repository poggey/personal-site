import Link from "next/link";
import { content } from "@/content";
import { Section } from "../Section/Section";
import styles from "./OffTheClock.module.css";

const { interests, projects, microcopy } = content;

/** The person, in one line each. A swipe row on mobile, a row of columns on desktop. */
export function OffTheClock() {
  return (
    <Section id="off-the-clock" heading={microcopy.offTheClockHeading} minDepth="3m">
      <ul className={styles.row} role="list">
        {interests.map((item) => {
          const project = item.project ? projects.find((p) => p.slug === item.project) : null;
          return (
            <li key={item.id} className={styles.item}>
              <p>{item.text}</p>
              {project ? (
                <Link href={`/work/${project.slug}`} scroll={false} className={styles.link}>
                  {project.title}
                </Link>
              ) : null}
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
