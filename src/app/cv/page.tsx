import type { Metadata } from "next";
import Link from "next/link";
import { content } from "@/content";
import { cv } from "@/content/cv";
import { formatRange } from "@/lib/dates";
import { newsreaderCv } from "./fonts";
import { PrintButton } from "./PrintButton";
import styles from "./cv.module.css";

const { profile, education, positions, projects, microcopy } = content;

export const metadata: Metadata = {
  title: "CV",
  description: `${profile.name}, ${profile.degree}, ${profile.university}. One-page CV.`,
  alternates: { canonical: "/cv" },
};

const bare = (href: string) => href.replace(/^https?:\/\/(www\.)?/, "");

// The CV lists the current role first, then the rest newest first.
const roles = [...positions].sort((a, b) => {
  if (a.end === null) return -1;
  if (b.end === null) return 1;
  return b.start.localeCompare(a.start);
});

/**
 * The print CV: one A4 page in the shape of Padraig's own CV, generated from the same
 * content as the site. scripts/cv-pdf.ts prints it to public/cv/.
 */
export default function CvPage() {
  return (
    <main id="main" className={`${styles.page} ${newsreaderCv.variable}`}>
      <div className={styles.tools}>
        <Link href="/">{microcopy.backToPage}</Link>
        <PrintButton label={microcopy.printCv} />
      </div>
      <article className={styles.sheet}>
        <header className={styles.header}>
          <h1 className={styles.name}>{profile.name}</h1>
          <p className={styles.contact}>
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
            <span aria-hidden="true"> | </span>
            <a href={profile.links.linkedin.href}>{bare(profile.links.linkedin.href)}</a>
            <span aria-hidden="true"> | </span>
            <a href={profile.links.github.href}>{bare(profile.links.github.href)}</a>
          </p>
        </header>

        <section aria-labelledby="cv-education">
          <h2 id="cv-education" className={styles.heading}>
            {microcopy.cvEducation}
          </h2>
          {education.map((e) => (
            <div key={e.id} className={styles.entry}>
              <p className={styles.line}>
                <strong>{e.institution}</strong>
                <strong>{e.location}</strong>
              </p>
              <p className={styles.line}>
                <em>
                  {e.qualification}
                  {e.result ? ` | ${e.result}` : ""}
                </em>
                <em>{formatRange(e.start, e.end)}</em>
              </p>
              <ul className={styles.bullets}>
                {e.modules.length > 0 ? (
                  <li>Modules: {e.modules.map((m) => `${m.name} (${m.mark}%)`).join(", ")}</li>
                ) : null}
                {e.grades?.map((g) => (
                  <li key={g}>{g}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section aria-labelledby="cv-work">
          <h2 id="cv-work" className={styles.heading}>
            {microcopy.cvWork}
          </h2>
          {roles.map((p) => (
            <div key={p.id} className={styles.entry}>
              <p className={styles.line}>
                <strong>{p.employer}</strong>
                <strong>{p.location}</strong>
              </p>
              <p className={styles.line}>
                <em>
                  {p.role}
                  {p.type === "Part-time" ? " (Part-time)" : ""}
                </em>
                <em>{formatRange(p.start, p.end)}</em>
              </p>
              <ul className={styles.bullets}>
                {p.outcomes
                  .filter((o) => o.depth !== "10m")
                  .map((o) => (
                    // CV bullets carry no full stop, as on the CV itself.
                    <li key={o.text}>{(o.cvText ?? o.text).replace(/\.$/, "")}</li>
                  ))}
              </ul>
            </div>
          ))}
        </section>

        <section aria-labelledby="cv-projects">
          <h2 id="cv-projects" className={styles.heading}>
            {microcopy.cvProjects}
          </h2>
          {cv.projects.map((p) => {
            const project = projects.find((q) => q.slug === p.slug);
            const href = project?.links[0]?.href;
            return (
              <div key={p.slug} className={styles.entry}>
                <p className={styles.line}>
                  <strong>{p.title}</strong>
                  {href ? (
                    <a href={href}>
                      <strong>{p.linkLabel}</strong>
                    </a>
                  ) : null}
                </p>
                <ul className={styles.bullets}>
                  {p.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </section>

        <section aria-labelledby="cv-extra">
          <h2 id="cv-extra" className={styles.heading}>
            {microcopy.cvExtracurricular}
          </h2>
          <ul className={styles.bullets}>
            {cv.extracurricular.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="cv-skills">
          <h2 id="cv-skills" className={styles.heading}>
            {microcopy.cvSkills}
          </h2>
          {cv.skills.map((s) => (
            <p key={s.label} className={styles.skill}>
              <em>{s.label}:</em> {s.text}
            </p>
          ))}
        </section>
      </article>
    </main>
  );
}
