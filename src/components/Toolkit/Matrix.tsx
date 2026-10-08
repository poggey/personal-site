"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./Toolkit.module.css";

export type MatrixProps = {
  skills: { id: string; label: string; projects: string[] }[];
  columns: { slug: string; title: string }[];
  caption: string;
  proofLabel: string;
};

type Focus = { kind: "skill"; id: string } | { kind: "project"; slug: string } | null;

/**
 * A real table with row and column headers. Hovering or focusing a skill lights its row
 * and the columns of the projects that prove it; a project lights its column and the skills
 * it proves. On narrow screens the same data is a list: each skill and its projects.
 */
export function Matrix({ skills, columns, caption, proofLabel }: MatrixProps) {
  const [focus, setFocus] = useState<Focus>(null);

  const lit = (skill: MatrixProps["skills"][number], slug: string): boolean => {
    if (!focus) return false;
    if (focus.kind === "skill") return focus.id === skill.id && skill.projects.includes(slug);
    return focus.slug === slug && skill.projects.includes(slug);
  };
  const rowLit = (skill: MatrixProps["skills"][number]) =>
    focus?.kind === "skill"
      ? focus.id === skill.id
      : focus
        ? skill.projects.includes(focus.slug)
        : false;
  const colLit = (slug: string) =>
    focus?.kind === "project"
      ? focus.slug === slug
      : focus
        ? (skills.find((s) => s.id === focus.id)?.projects.includes(slug) ?? false)
        : false;

  const titleOf = (slug: string) => columns.find((c) => c.slug === slug)?.title ?? slug;

  return (
    <>
      <div className={styles.scroller} data-motion="gather">
        <table
          className={styles.matrix}
          data-focus={focus !== null}
          onMouseLeave={() => setFocus(null)}
        >
          <caption className="visually-hidden">{caption}</caption>
          <thead>
            <tr>
              <td />
              {columns.map((c) => (
                <th
                  key={c.slug}
                  scope="col"
                  className={styles.colHead}
                  data-lit={colLit(c.slug)}
                  onMouseEnter={() => setFocus({ kind: "project", slug: c.slug })}
                >
                  <Link
                    href={`/work/${c.slug}`}
                    scroll={false}
                    className={styles.colLink}
                    onFocus={() => setFocus({ kind: "project", slug: c.slug })}
                    onBlur={() => setFocus(null)}
                  >
                    <span>{c.title}</span>
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {skills.map((s) => (
              <tr key={s.id} data-lit={rowLit(s)}>
                <th
                  scope="row"
                  className={styles.rowHead}
                  tabIndex={0}
                  onMouseEnter={() => setFocus({ kind: "skill", id: s.id })}
                  onFocus={() => setFocus({ kind: "skill", id: s.id })}
                  onBlur={() => setFocus(null)}
                >
                  {s.label}
                </th>
                {columns.map((c) => {
                  const proves = s.projects.includes(c.slug);
                  return (
                    <td
                      key={c.slug}
                      className={styles.cell}
                      data-lit={lit(s, c.slug)}
                      data-col-lit={colLit(c.slug)}
                    >
                      {proves ? (
                        <>
                          <span className={styles.dot} aria-hidden="true" data-dot />
                          <span className="visually-hidden">Yes</span>
                        </>
                      ) : null}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <dl className={styles.list}>
        {skills.map((s) => (
          <div key={s.id} className={styles.listItem}>
            <dt>{s.label}</dt>
            <dd>
              <span className="visually-hidden">{proofLabel}: </span>
              {s.projects.map((slug, i) => (
                <span key={slug}>
                  {i > 0 ? ", " : ""}
                  <Link href={`/work/${slug}`} scroll={false}>
                    {titleOf(slug)}
                  </Link>
                </span>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </>
  );
}
