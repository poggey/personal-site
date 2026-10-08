import type { ReactNode } from "react";
import styles from "./Figure.module.css";

type Props = {
  caption: ReactNode;
  source?: ReactNode;
  className?: string;
  children: ReactNode;
};

/** A chart or image with its caption and source line, as in a paper. */
export function Figure({ caption, source, className, children }: Props) {
  return (
    <figure className={`${styles.figure} ${className ?? ""}`}>
      <div className={styles.frame}>{children}</div>
      <figcaption className={styles.caption}>
        <span>{caption}</span>
        {source ? <span className={styles.source}>{source}</span> : null}
      </figcaption>
    </figure>
  );
}
