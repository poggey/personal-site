import { content } from "@/content";
import { getLatestEdition } from "@/lib/stirling";
import styles from "./StirlingChip.module.css";

const { microcopy } = content;

/** Today's Stirling edition, linked to the live site. Shows "Last edition" when stale. */
export async function StirlingChip() {
  const edition = await getLatestEdition();
  return (
    <a className={styles.chip} href={edition.href}>
      <span className={styles.meta}>
        <span className={styles.signal} aria-hidden="true" />
        {microcopy.stirlingChip}, {microcopy.stirlingEdition} No. {edition.number}
      </span>
      <span className={styles.headline}>
        <span className={styles.label}>
          {edition.stale ? microcopy.stirlingStale : microcopy.stirlingToday}:
        </span>{" "}
        {edition.headline}
      </span>
    </a>
  );
}
