import { content } from "@/content";
import styles from "./Visuals.module.css";

const { escapeVelocity } = content.visuals;

/** The deal in three figures, set large. Used if Escape Velocity is the third featured project. */
export function EscapeVelocityVisual() {
  const figures = [
    { value: escapeVelocity.valuation, label: "Valuation at listing" },
    { value: escapeVelocity.ipoPrice, label: "IPO price" },
    { value: escapeVelocity.multiple, label: "Multiple" },
  ];
  return (
    <dl className={styles.figures}>
      {figures.map((f) => (
        <div key={f.label}>
          <dt>{f.label}</dt>
          <dd>{f.value}</dd>
        </div>
      ))}
    </dl>
  );
}
