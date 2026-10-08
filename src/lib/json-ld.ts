import { content } from "@/content";
import { siteUrl } from "./site";

const { profile, positions } = content;

/** schema.org Person for search engines, built from the same content as the page. */
export function personJsonLd() {
  const current = positions.find((p) => p.end === null);
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    url: siteUrl,
    email: `mailto:${profile.email}`,
    alumniOf: { "@type": "CollegeOrUniversity", name: profile.university },
    ...(current ? { worksFor: { "@type": "Organization", name: current.employer } } : {}),
    sameAs: [profile.links.linkedin.href, profile.links.github.href],
  };
}
