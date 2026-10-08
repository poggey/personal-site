import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./TextLink.module.css";

type Props = {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  /** Plain print with an underline, for links inside a dark or palette-tinted area. */
  quiet?: boolean;
  download?: boolean;
};

/**
 * Links are biro: a person's mark. External links open in the same tab (people know the
 * back button); the domain change is announced so it isn't a surprise.
 */
export function TextLink({ href, children, className, onClick, quiet, download }: Props) {
  const external = /^https?:\/\//.test(href);
  const classes = `${styles.link} ${quiet ? styles.quiet : ""} ${className ?? ""}`;
  if (external || download || href.startsWith("mailto:")) {
    return (
      <a href={href} className={classes} onClick={onClick} download={download || undefined}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes} onClick={onClick}>
      {children}
    </Link>
  );
}
