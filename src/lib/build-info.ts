// Values fixed at build time in next.config.ts, so every render of a build agrees and
// nothing reads the clock during prerendering.

/** The day this build was made, as YYYY-MM-DD. Used as "today" for tenure and the time axis. */
export const buildDate = process.env.NEXT_PUBLIC_BUILD_DATE ?? "2026-10-08";

/** The last commit's date and short hash: the footer's "Last updated". */
export const lastCommit = {
  date: process.env.NEXT_PUBLIC_COMMIT_DATE ?? buildDate,
  sha: process.env.NEXT_PUBLIC_COMMIT_SHA ?? "",
};

/** Whole years between a "YYYY-MM" month and the build date. Jun 2022 to Oct 2026 is 4. */
export function yearsSince(month: string, today: string = buildDate): number {
  const [y1, m1] = month.split("-").map(Number);
  const [y2, m2] = today.split("-").map(Number);
  if (!y1 || !m1 || !y2 || !m2) throw new Error(`Bad date: ${month} or ${today}`);
  const months = (y2 - y1) * 12 + (m2 - m1);
  return Math.floor(months / 12);
}
