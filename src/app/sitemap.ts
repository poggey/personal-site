import type { MetadataRoute } from "next";
import { content } from "@/content";
import { lastCommit } from "@/lib/build-info";
import { siteUrl } from "@/lib/site";

// The page, the CV and every case study. The styleguide is dev-only and never listed.
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = lastCommit.date;
  return [
    { url: siteUrl, lastModified, priority: 1 },
    { url: `${siteUrl}/cv`, lastModified, priority: 0.8 },
    ...content.projects.map((p) => ({
      url: `${siteUrl}/work/${p.slug}`,
      lastModified,
      priority: 0.6,
    })),
  ];
}
