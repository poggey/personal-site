import { content } from "@/content";
import { buildDate, yearsSince } from "@/lib/build-info";
import { formatMonth } from "@/lib/dates";
import { countPublicRepos } from "@/lib/github";
import { FactTable } from "../FactTable/FactTable";
import { Section } from "../Section/Section";
import { Sidenote } from "../Sidenote/Sidenote";

const { factSheet, positions, microcopy } = content;

const zaltekStart = positions.find((p) => p.id === "zaltek")?.start;

/**
 * The fund-factsheet table. Two rows are computed at build time: Zaltek tenure from its
 * start month, and the public GitHub count from the API (falling back to the content value).
 */
export async function FactSheet() {
  const repoCount = await countPublicRepos("poggey");
  const rows = factSheet.rows.map((row, i) => {
    let value = row.value;
    if (row.id === "zaltek-tenure" && zaltekStart) value = `${yearsSince(zaltekStart)} yrs`;
    if (row.id === "public-projects" && repoCount !== null) value = String(repoCount);
    return {
      id: row.id,
      label: row.label,
      value,
      footnote: row.footnote,
      note: (
        <Sidenote n={i + 1} label={row.label}>
          {row.footnote}
        </Sidenote>
      ),
    };
  });

  return (
    <Section
      id="facts"
      tone="deep"
      heading={microcopy.factSheetHeading}
      aside={`${microcopy.asOf} ${formatMonth(buildDate.slice(0, 7))}`}
    >
      <div>
        <FactTable
          caption={microcopy.factSheetHeading}
          rows={rows}
          footer={<p>{factSheet.sourcesLine}</p>}
        />
      </div>
    </Section>
  );
}
