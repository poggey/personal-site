import { content } from "@/content";
import { getLatestEdition } from "@/lib/stirling";
import { panelTokens } from "@/content/projects/palettes";
import styles from "./Visuals.module.css";

const stirling = content.projects.find((p) => p.slug === "stirling");
const tokens = panelTokens(stirling?.palette ?? null);
const { microcopy } = content;

const arrow = { up: "Up", down: "Down", flat: "Flat" } as const;

/** Today's edition as a small clipping in Stirling's own palette (Racing Ink). */
export async function StirlingClipping() {
  const edition = await getLatestEdition();
  const date = new Date(`${edition.date}T12:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Europe/London",
  });
  return (
    <div className={styles.clipping} style={tokens ?? undefined}>
      <p className={styles.clipMeta}>
        <span>
          {microcopy.stirlingEdition} No. {edition.number}
        </span>
        <span>{date}</span>
      </p>
      <p className={styles.clipHeadline}>{edition.headline}</p>
      <table className={styles.ledger}>
        <caption className="visually-hidden">The four most unusual moves</caption>
        <tbody>
          {edition.moves.map((m) => (
            <tr key={m.label}>
              <th scope="row">{m.label}</th>
              <td>{m.value}</td>
              <td>
                <span className="visually-hidden">{arrow[m.direction]} </span>
                <span aria-hidden="true">
                  {m.direction === "up" ? "+" : m.direction === "down" ? "−" : ""}
                </span>
                {m.change}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
