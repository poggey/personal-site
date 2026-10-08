import type { ReactNode } from "react";
import styles from "./Text.module.css";

type Props = {
  as?: "p" | "span" | "div";
  variant?: "body" | "lead" | "small" | "ui";
  muted?: boolean;
  className?: string;
  children: ReactNode;
};

/** Running text. "ui" is Archivo for interface text; the rest are Newsreader. */
export function Text({ as = "p", variant = "body", muted = false, className, children }: Props) {
  const Tag = as;
  const classes = [styles.text, styles[variant], muted ? styles.muted : "", className ?? ""];
  return <Tag className={classes.join(" ").trim()}>{children}</Tag>;
}
