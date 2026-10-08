// Content stores months as "YYYY-MM" so charts can compute with them.
// These turn them into the site's display style: "Jun 2022", "Jun 2022 to present".
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function formatMonth(month: string): string {
  const [year, monthNumber] = month.split("-");
  const name = MONTHS[Number(monthNumber) - 1];
  if (!year || !name) throw new Error(`Not a YYYY-MM month: ${month}`);
  return `${name} ${year}`;
}

/** A one-month role reads as that month alone; a current role ends "to present". */
export function formatRange(start: string, end: string | null): string {
  if (end === start) return formatMonth(start);
  return `${formatMonth(start)} to ${end === null ? "present" : formatMonth(end)}`;
}
