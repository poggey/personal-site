import { Suspense } from "react";
import { content } from "@/content";
import { Container } from "../Container/Container";
import { StirlingChip } from "../StirlingChip/StirlingChip";
import { HeroStage } from "./HeroStage";
import styles from "./Hero.module.css";

const { profile } = content;
const [first, ...rest] = profile.name.split(" ");

/**
 * The name, the line and the status. The <h1> is real text for screen readers, search and
 * no-JS; HeroStage draws the point field over it once WebGL is running.
 */
export function Hero() {
  return (
    <div className={styles.hero} id="top" data-hero data-rail-label={profile.name}>
      <Container grid className={styles.grid}>
        <p className={styles.kicker}>
          {profile.degree}, {profile.university}
          <br />
          {profile.locations.join(" and ")}
        </p>

        <HeroStage>
          <h1 className={styles.name} id="hero-name">
            <span className={styles.first} data-hero-line>
              {first}
            </span>{" "}
            <span className={styles.last} data-hero-line>
              {rest.join(" ")}
            </span>
          </h1>
        </HeroStage>

        <div className={styles.foot}>
          <div className={styles.lines}>
            <p className={styles.line}>{profile.heroLine}</p>
            <p className={styles.status}>{profile.availability}</p>
          </div>
          <div className={styles.chip} data-min-depth="3m">
            <Suspense fallback={null}>
              <StirlingChip />
            </Suspense>
          </div>
        </div>
      </Container>
    </div>
  );
}
