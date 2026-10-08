import { cacheLife } from "next/cache";
import fallback from "@/content/data/stirling-fallback.json";
import {
  editionSchema,
  summarise,
  summarySchema,
  STIRLING_SITE,
  type EditionSummary,
} from "./stirling-edition";

export type StirlingResult = EditionSummary & {
  /** True when the live fetch failed and this is the last good edition kept in the repo. */
  stale: boolean;
};

const fallbackSummary: EditionSummary = summarySchema.parse(fallback);

/**
 * Today's Stirling edition, cached and refreshed every 30 minutes. Any failure (network,
 * status, shape) falls back to the last good edition, so this can never break the page.
 */
export async function getLatestEdition(): Promise<StirlingResult> {
  "use cache";
  cacheLife({ stale: 1800, revalidate: 1800, expire: 86400 });
  return fetchLatestEdition(fetch);
}

/** The fetch is injected so tests can simulate failures without touching the network. */
export async function fetchLatestEdition(fetcher: typeof fetch): Promise<StirlingResult> {
  try {
    const res = await fetcher(`${STIRLING_SITE}/api/editions/latest`, {
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) throw new Error(`Stirling responded ${res.status}`);
    const edition = editionSchema.parse(await res.json());
    return { ...summarise(edition), stale: false };
  } catch {
    return { ...fallbackSummary, stale: true };
  }
}
