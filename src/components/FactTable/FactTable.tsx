import type { ReactNode } from "react";
import styles from "./FactTable.module.css";

export type FactRow = {
  id: string;
  label: string;
  value: string;
  /** Rendered after the label on narrow screens: a sidenote marker that opens the footnote. */
  note?: ReactNode;
  /** The footnote text, shown in its own column on wide screens. */
  footnote?: string;
};

type Props = {
  caption: string;
  rows: FactRow[];
  /** Small print under the table: as-of date and sources. */
  footer?: ReactNode;
};

/**
 * A fund-factsheet table: label left, value right in tabular figures, rules between rows.
 * Footnotes are a third column on wide screens and sidenote toggles on narrow ones; CSS
 * shows exactly one of the two, so nothing is read twice.
 */
export function FactTable({ caption, rows, footer }: Props) {
  return (
    <div className={styles.wrap}>
      <table className={styles.table}>
        <caption className="visually-hidden">{caption}</caption>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className={styles.row}>
              <th scope="row" className={styles.label}>
                {row.label}
                {row.note ? <span className={styles.marker}>{row.note}</span> : null}
              </th>
              <td className={styles.value}>{row.value}</td>
              {row.footnote ? <td className={styles.footnote}>{row.footnote}</td> : null}
            </tr>
          ))}
        </tbody>
      </table>
      {footer ? <div className={styles.footer}>{footer}</div> : null}
    </div>
  );
}
