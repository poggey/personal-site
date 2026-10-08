import { cacheLife } from "next/cache";
import { z } from "zod";

const repoSchema = z.array(z.object({ fork: z.boolean(), private: z.boolean() }));

/**
 * Public repositories on GitHub that are Padraig's own (forks excluded), counted at build
 * time for the fact sheet. Returns null on any failure so the content value is used instead.
 * GITHUB_TOKEN is optional: it only lifts the unauthenticated rate limit (60 an hour).
 */
export async function countPublicRepos(user: string): Promise<number | null> {
  "use cache";
  cacheLife("days");
  return fetchPublicRepoCount(user, fetch, process.env.GITHUB_TOKEN);
}

export async function fetchPublicRepoCount(
  user: string,
  fetcher: typeof fetch,
  token?: string,
): Promise<number | null> {
  try {
    const res = await fetcher(
      `https://api.github.com/users/${user}/repos?type=owner&per_page=100`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        signal: AbortSignal.timeout(5000),
      },
    );
    if (!res.ok) return null;
    const repos = repoSchema.parse(await res.json());
    return repos.filter((r) => !r.fork && !r.private).length;
  } catch {
    return null;
  }
}
