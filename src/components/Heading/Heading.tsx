import type { ReactNode } from "react";
import styles from "./Heading.module.css";

type Props = {
  level: 2 | 3 | 4;
  /** Visual size from the type scale, independent of the outline level. */
  size?: 1 | 2 | 3 | 4;
  id?: string;
  className?: string;
  children: ReactNode;
};

export function Heading({ level, size = 2, id, className, children }: Props) {
  const Tag = `h${level}` as const;
  return (
    <Tag id={id} className={`${styles.heading} ${styles[`size${size}`]} ${className ?? ""}`}>
      {children}
    </Tag>
  );
}
