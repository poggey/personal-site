import type { ComponentPropsWithoutRef, ElementType } from "react";
import styles from "./Container.module.css";

type Props<T extends ElementType> = {
  as?: T;
  /** Lay children on the 12-column grid. Children place themselves with grid-column. */
  grid?: boolean;
} & ComponentPropsWithoutRef<T>;

/** The page width: 1440px max with the 24 / 48 / 80px outer margins. */
export function Container<T extends ElementType = "div">({
  as,
  grid = false,
  className,
  ...rest
}: Props<T>) {
  const Tag = as ?? "div";
  const classes = [styles.container, grid ? styles.grid : "", className ?? ""].join(" ").trim();
  return <Tag className={classes} {...rest} />;
}
