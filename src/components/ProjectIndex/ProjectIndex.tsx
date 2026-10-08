import { getImageProps } from "next/image";
import { content } from "@/content";
import { Section } from "../Section/Section";
import { IndexRows, type IndexRow } from "./IndexRows";

const { indexed, microcopy } = content;

/** Every project not featured, newest first, as a compact table of rows that open panels. */
export function ProjectIndex() {
  const rows: IndexRow[] = [...indexed]
    .sort((a, b) => b.year - a.year)
    .map((p) => ({
      slug: p.slug,
      title: p.title,
      type: p.type,
      year: p.year,
      stack: p.stack.slice(0, 3).join(", "),
      status: p.status,
      talkingPoint: p.talkingPoint,
      // Optimised image props worked out here, so the client rows need no image component.
      preview: p.preview
        ? getImageProps({ src: p.preview.src, alt: "", width: 320, height: 200, sizes: "320px" })
            .props
        : null,
    }));
  return (
    <Section id="index" heading={microcopy.indexHeading} minDepth="3m">
      <IndexRows rows={rows} caption={microcopy.indexColumns} />
    </Section>
  );
}
