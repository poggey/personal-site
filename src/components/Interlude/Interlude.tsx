import { content } from "@/content";
import { fill } from "@/lib/template";
import { Section } from "../Section/Section";
import { InterludeLoader } from "./InterludeLoader";
import styles from "./Interlude.module.css";

const { interlude, microcopy } = content;

export type InterludeCopy = {
  reveal: string;
  fix: string;
  target: string;
  names: Record<string, string>;
  text: Pick<
    typeof microcopy,
    | "interludeReset"
    | "interludeShowOptimum"
    | "interludeReturn"
    | "interludeVolatility"
    | "interludeSharpe"
    | "interludeYou"
    | "interludeOptimum"
    | "interludeFrontier"
    | "interludeRandom"
    | "interludeWeights"
    | "interludeData"
    | "interludeChartLabel"
    | "readMethod"
  >;
  tolerance: number;
  targetSharpe: number;
};

/**
 * Beat my Sharpe: the page's one dark room. The copy renders on the server; the game and
 * its data load only as the section approaches (see InterludeLoader).
 */
export function Interlude() {
  const copy: InterludeCopy = {
    reveal: interlude.reveal,
    fix: interlude.fix,
    target: fill(microcopy.interludeTarget, {
      tolerance: interlude.target.tolerance.toFixed(2),
      sharpe: interlude.target.sharpe.toFixed(2),
    }),
    names: Object.fromEntries(interlude.tickers.map((t) => [t.ticker, t.name])),
    text: {
      interludeReset: microcopy.interludeReset,
      interludeShowOptimum: microcopy.interludeShowOptimum,
      interludeReturn: microcopy.interludeReturn,
      interludeVolatility: microcopy.interludeVolatility,
      interludeSharpe: microcopy.interludeSharpe,
      interludeYou: microcopy.interludeYou,
      interludeOptimum: microcopy.interludeOptimum,
      interludeFrontier: microcopy.interludeFrontier,
      interludeRandom: microcopy.interludeRandom,
      interludeWeights: microcopy.interludeWeights,
      interludeData: microcopy.interludeData,
      interludeChartLabel: microcopy.interludeChartLabel,
      readMethod: microcopy.readMethod,
    },
    tolerance: interlude.target.tolerance,
    targetSharpe: interlude.target.sharpe,
  };

  return (
    <Section
      id="interlude"
      heading={interlude.heading}
      minDepth="3m"
      wide
      className={`night ${styles.interlude}`}
    >
      <p className={styles.prompt}>{interlude.prompt}</p>
      <p className={styles.target}>{copy.target}</p>
      <InterludeLoader copy={copy} loadingText={microcopy.interludeLoading} />
    </Section>
  );
}
