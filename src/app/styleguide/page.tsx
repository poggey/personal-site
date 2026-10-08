import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button } from "@/components/Button/Button";
import { Container } from "@/components/Container/Container";
import { DepthDial } from "@/components/DepthDial/DepthDial";
import { FactTable } from "@/components/FactTable/FactTable";
import { Figure } from "@/components/Figure/Figure";
import { Heading } from "@/components/Heading/Heading";
import { Sidenote } from "@/components/Sidenote/Sidenote";
import { Text } from "@/components/Text/Text";
import { TextLink } from "@/components/TextLink/TextLink";
import { SlateVisual } from "@/components/Visuals/SlateVisual";
import { content } from "@/content";
import { contrast } from "@/lib/contrast";
import { PALETTE } from "@/styles/palette";
import { StyleguideToast } from "./StyleguideToast";
import styles from "./styleguide.module.css";

export const metadata: Metadata = { title: "Styleguide", robots: { index: false, follow: false } };

const STEPS = [
  "--step-5",
  "--step-4",
  "--step-3",
  "--step-2",
  "--step-1",
  "--step-0",
  "--step--1",
  "--step--2",
];
const SPACES = [
  "--space-1",
  "--space-2",
  "--space-3",
  "--space-4",
  "--space-6",
  "--space-8",
  "--space-12",
  "--space-16",
];

const { microcopy, factSheet, featured } = content;

function Swatches({ mode }: { mode: "light" | "dark" }) {
  const p = PALETTE[mode];
  return (
    <ul className={styles.swatches} role="list">
      {Object.entries(p).map(([name, hex]) => (
        <li key={name} className={styles.swatch}>
          <span className={styles.chip} style={{ background: hex }} />
          <span className={styles.swatchName}>{name}</span>
          <span className={styles.swatchMeta}>{hex}</span>
          {name !== "paper" ? (
            <span className={styles.swatchMeta}>
              {contrast(hex, p.paper).toFixed(2)}:1 on paper
              {name === "rule" ? " (data lines only)" : ""}
            </span>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

function Specimen() {
  const slate = featured.find((p) => p.slug === "the-slate") ?? featured[0];
  return (
    <div className={styles.specimen}>
      <section className={styles.block}>
        <Heading level={2} size={2}>
          Type
        </Heading>
        {STEPS.map((step) => (
          <p key={step} className={styles.typeRow}>
            <span className={styles.stepName}>{step}</span>
            <span
              style={{ fontFamily: "var(--font-sans)", fontSize: `var(${step})`, fontWeight: 600 }}
            >
              Archivo 650+ councils
            </span>
          </p>
        ))}
        <p className={styles.typeRow}>
          <span className={styles.stepName}>body</span>
          <span>
            Newsreader body at 1.6 line height. Numbers are tabular and lining: 0123456789, 85%, 108
            bps.
          </span>
        </p>
        <p className={styles.hero}>Padraig</p>
      </section>

      <section className={styles.block}>
        <Heading level={2} size={2}>
          Primitives
        </Heading>
        <div className={styles.row}>
          <DepthDial
            legend={microcopy.depthLegend}
            labels={{
              "30s": microcopy.depth30s,
              "3m": microcopy.depth3m,
              "10m": microcopy.depth10m,
            }}
          />
        </div>
        <div className={styles.row}>
          <Button>{microcopy.copyEmail}</Button>
          <Button aria-pressed="true">Pressed</Button>
          <Button disabled>Disabled</Button>
          <Button variant="solid">{microcopy.downloadCv}</Button>
          <StyleguideToast label="Show toast" message={microcopy.emailCopied} />
        </div>
        <Text>
          A paragraph with a <TextLink href="/">link in biro</TextLink> and a margin note
          <Sidenote n={1} label="sidenote example">
            Sidenotes sit in the margin on wide screens and open inline on narrow ones.
          </Sidenote>{" "}
          that opens on narrow screens.
        </Text>
        <Text variant="small" muted>
          Small, muted: captions and sources.
        </Text>
      </section>

      <section className={styles.block}>
        <Heading level={2} size={2}>
          Fact table
        </Heading>
        <FactTable
          caption="Sample"
          rows={factSheet.rows
            .slice(0, 3)
            .map((r) => ({ id: r.id, label: r.label, value: r.value, footnote: r.footnote }))}
          footer={<p>{factSheet.sourcesLine}</p>}
        />
      </section>

      {slate ? (
        <section className={styles.block}>
          <Heading level={2} size={2}>
            Case-study row
          </Heading>
          <div className={styles.caseRow}>
            <div>
              <Heading level={3} size={4}>
                {slate.title}
              </Heading>
              <Text variant="lead">{slate.question}</Text>
              <Text>{slate.result}</Text>
            </div>
            <Figure caption={content.visuals.slate.caption} source={content.visuals.slate.source}>
              <SlateVisual />
            </Figure>
          </div>
        </section>
      ) : null}
    </div>
  );
}

/** Dev-only style tile: tokens, contrast and every primitive, light and dark side by side. */
export default function StyleguidePage() {
  if (process.env.NODE_ENV === "production") notFound();
  return (
    <main id="main" className={styles.page}>
      <Container>
        <h1 className={styles.title}>Styleguide</h1>
        <div className={styles.columns}>
          <div className={styles.theme} data-theme-preview="light">
            <Heading level={2} size={3}>
              Light
            </Heading>
            <Swatches mode="light" />
            <Specimen />
          </div>
          <div className={`${styles.theme} night`} data-theme-preview="dark">
            <Heading level={2} size={3}>
              Dark
            </Heading>
            <Swatches mode="dark" />
            <Specimen />
          </div>
        </div>
        <section className={styles.block}>
          <Heading level={2} size={2}>
            Spacing
          </Heading>
          {SPACES.map((space) => (
            <p key={space} className={styles.spaceRow}>
              <span className={styles.stepName}>{space}</span>
              <span className={styles.spaceBar} style={{ width: `var(${space})` }} />
            </p>
          ))}
        </section>
      </Container>
    </main>
  );
}
