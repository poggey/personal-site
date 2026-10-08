import { content } from "@/content";
import { lastCommit } from "@/lib/build-info";
import { Container } from "../Container/Container";
import { BuiltByBadge } from "./BuiltByBadge";
import { CopyEmail } from "./CopyEmail";
import { ContactSignal } from "./ContactSignal";
import { CvLink } from "./CvLink";
import { LondonTime } from "./LondonTime";
import styles from "./Contact.module.css";

const { profile, microcopy } = content;

/** The last screen: the email, the CV and the profiles. */
export function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      data-rail-label={microcopy.contactHeading}
      className={`${styles.contact} tone-deep`}
    >
      <Container grid>
        <div className={styles.body}>
          <h2 id="contact-heading" className={styles.heading}>
            {microcopy.contactHeading}
          </h2>
          <div className={styles.signal}>
            <ContactSignal />
          </div>
          <CopyEmail
            email={profile.email}
            copyLabel={microcopy.copyEmail}
            copiedText={microcopy.emailCopied}
          />
          <ul className={styles.links} role="list">
            <li>
              <CvLink href={profile.links.cv} label={microcopy.downloadCv} />
            </li>
            <li>
              <a href={profile.links.linkedin.href}>{profile.links.linkedin.label}</a>
            </li>
            <li>
              <a href={profile.links.github.href}>{profile.links.github.label}</a>
            </li>
          </ul>
          <p className={styles.availability}>{profile.availability}</p>
        </div>
      </Container>
    </section>
  );
}

/** The footer: London time, last updated, the colophon and the badge. */
export function SiteFooter() {
  const updated = new Date(`${lastCommit.date}T12:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Europe/London",
  });
  return (
    <footer className={`${styles.footer} tone-deep`}>
      <Container grid>
        <div className={styles.footRow}>
          <LondonTime label={microcopy.londonTime} />
          <p>
            {microcopy.lastUpdated} {updated}
            {lastCommit.sha ? ` (${lastCommit.sha})` : ""}
          </p>
          <p data-min-depth="3m">
            {microcopy.colophonType} {profile.colophon}{" "}
            <a href={`${profile.links.github.href}/personal-site`}>{microcopy.sourceCode}</a>
          </p>
        </div>
      </Container>
      <BuiltByBadge name={profile.name} github={profile.links.github.href} />
    </footer>
  );
}
