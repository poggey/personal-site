import { content } from "@/content";
import { DepthDial } from "../DepthDial/DepthDial";
import { PaletteTrigger } from "../CommandPalette/PaletteTrigger";
import styles from "./SiteHeader.module.css";

const { microcopy } = content;

/** Fixed top right: the depth dial and the menu (the command palette). */
export function SiteHeader() {
  return (
    <header className={styles.header}>
      <a href="#main" className="skip-link">
        {microcopy.skipToContent}
      </a>
      <div className={styles.controls}>
        <DepthDial
          legend={microcopy.depthLegend}
          labels={{ "30s": microcopy.depth30s, "3m": microcopy.depth3m, "10m": microcopy.depth10m }}
        />
        <PaletteTrigger label={microcopy.commandPalette} />
      </div>
    </header>
  );
}
