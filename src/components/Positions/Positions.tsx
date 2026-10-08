import { scaleUtc } from "d3-scale";
import { content } from "@/content";
import { buildDate } from "@/lib/build-info";
import { formatRange } from "@/lib/dates";
import { Section } from "../Section/Section";
import { PositionRows, type PositionRow } from "./PositionRows";

const { positions, microcopy } = content;

/** First day of a "YYYY-MM" month, in UTC so the axis never shifts with the server's zone. */
const monthStart = (m: string) => new Date(`${m}-01T00:00:00Z`);
/** First day of the following month: a one-month role still has width. */
const monthEnd = (m: string) => {
  const d = monthStart(m);
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 1));
};

/**
 * Experience as a holdings chart: one row per role on a shared time axis from the first
 * start to the build date. Positions are computed here (d3-scale) and passed down as
 * percentages, so the rows lay out with plain CSS at any width.
 */
export function Positions() {
  const today = new Date(`${buildDate}T00:00:00Z`);
  const starts = positions.map((p) => monthStart(p.start));
  const first = new Date(Math.min(...starts.map(Number)));
  const x = scaleUtc().domain([first, today]).range([0, 100]).clamp(true);

  // Newest first reads like a CV; the axis still runs left to right in time.
  const rows: PositionRow[] = [...positions]
    .sort((a, b) => b.start.localeCompare(a.start))
    .map((p) => {
      const left = x(monthStart(p.start));
      const right = p.end === null ? 100 : x(monthEnd(p.end));
      return {
        id: p.id,
        employer: p.employer,
        role: p.role,
        type: p.type,
        dates: formatRange(p.start, p.end),
        current: p.end === null,
        left,
        width: Math.max(right - left, 0),
        // Placements of a month or so are marks, not bars.
        point: p.end !== null && p.start === p.end,
        outcomes: p.outcomes,
      };
    });

  const ticks = x.ticks(5).map((t) => ({ label: String(t.getUTCFullYear()), at: x(t) }));

  return (
    <Section id="positions" heading={microcopy.positionsHeading} ink="pink">
      <PositionRows
        rows={rows}
        ticks={ticks}
        labels={{ show: microcopy.outcomes, hide: microcopy.hideOutcomes }}
      />
    </Section>
  );
}
