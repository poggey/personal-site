import { content } from "@/content";
import { formatRange } from "@/lib/dates";
import { Section } from "../Section/Section";
import styles from "./Education.module.css";

const { education, microcopy } = content;

/** Styled like a transcript: marks right-aligned in tabular figures, bars to 100. */
export function Education() {
  return (
    <Section id="education" heading={microcopy.educationHeading}>
      <div className={styles.list}>
        {education.map((e, i) => (
          // The degree line shows at every depth; the school and detail from 3 min.
          <article key={e.id} className={styles.entry} data-min-depth={i === 0 ? "30s" : "3m"}>
            <header className={styles.head}>
              <h3 className={styles.institution}>{e.institution}</h3>
              <p className={styles.dates}>{formatRange(e.start, e.end)}</p>
            </header>
            <p className={styles.qualification}>
              {e.qualification}
              {e.result ? <span className={styles.result}>, {e.result}</span> : null}
            </p>

            {e.modules.length > 0 ? (
              <table className={styles.marks} data-min-depth="3m" data-motion-group>
                <caption className="visually-hidden">Top module marks, out of 100</caption>
                <tbody>
                  {e.modules.map((m) => (
                    <tr key={m.name}>
                      <th scope="row">{m.name}</th>
                      <td className={styles.barCell} aria-hidden="true">
                        <span
                          className={styles.bar}
                          style={{ width: `${m.mark ?? 0}%` }}
                          data-motion="draw-x"
                        />
                      </td>
                      <td className={styles.mark}>{m.mark}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : null}

            {e.currentModules ? (
              <p className={styles.current} data-min-depth="3m">
                {e.currentModules
                  .map((m) => (m.note ? `${m.name} (${m.note})` : m.name))
                  .join(", ")}
              </p>
            ) : null}

            {e.grades?.map((g) => (
              <p key={g} className={styles.grades}>
                {g}
              </p>
            ))}

            {e.extras?.map((x) => (
              <p key={x.text} className={styles.extra} data-min-depth={x.depth}>
                {x.text}
              </p>
            ))}
          </article>
        ))}
      </div>
    </Section>
  );
}
