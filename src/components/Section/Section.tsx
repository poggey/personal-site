import type { ReactNode } from "react";
import type { Depth } from "@/content/schema";
import { Container } from "../Container/Container";
import styles from "./Section.module.css";

type Props = {
  id: string;
  heading: string;
  /** The shallowest depth this whole section shows at. */
  minDepth?: Depth;
  /** A short line under the heading, in the label column. */
  aside?: ReactNode;
  /** Extra class, e.g. the interlude's dark scope. */
  className?: string;
  /** Heading above a full-width body, for sections that need all 12 columns. */
  wide?: boolean;
  /** The riso ink this section is printed in: a full-bleed spot colour. */
  ink?: "blue" | "pink" | "green" | "yellow";
  children: ReactNode;
};

/**
 * The page's one repeated structure: heading in the left label column (cols 1 to 3),
 * content to the right (cols 4 to 12). Sections own their inner layout from there.
 * data-rail-label feeds the progress rail.
 */
export function Section({
  id,
  heading,
  minDepth = "30s",
  aside,
  className,
  wide = false,
  ink,
  children,
}: Props) {
  const headingId = `${id}-heading`;
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      data-min-depth={minDepth}
      data-rail-label={heading}
      data-motion="register"
      className={`${styles.section} ${wide ? styles.wide : ""} ${ink ? `ink-${ink} ${styles.inked}` : ""} ${className ?? ""}`}
    >
      <Container grid>
        <header className={styles.label}>
          {/* data-text feeds the misregistered second ink layer drawn in CSS. */}
          <h2 id={headingId} className={styles.heading} data-text={heading}>
            {heading}
          </h2>
          {aside ? <div className={styles.aside}>{aside}</div> : null}
        </header>
        <div className={styles.body}>{children}</div>
      </Container>
    </section>
  );
}
