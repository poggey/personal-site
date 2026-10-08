import { describe, expect, it, vi } from "vitest";
import { fetchPublicRepoCount } from "@/lib/github";
import { yearsSince } from "@/lib/build-info";

const respond = (body: unknown, status = 200) =>
  vi.fn(async () => new Response(JSON.stringify(body), { status })) as unknown as typeof fetch;

describe("GitHub repo count", () => {
  it("counts public repos and leaves out forks", async () => {
    const repos = [
      { fork: false, private: false },
      { fork: true, private: false },
      { fork: false, private: false },
    ];
    expect(await fetchPublicRepoCount("poggey", respond(repos))).toBe(2);
  });

  it("returns null on failure so the content value is used", async () => {
    expect(
      await fetchPublicRepoCount("poggey", respond({ message: "rate limited" }, 403)),
    ).toBeNull();
    const failing = vi.fn(async () => {
      throw new Error("offline");
    }) as unknown as typeof fetch;
    expect(await fetchPublicRepoCount("poggey", failing)).toBeNull();
  });

  it("sends the token only when there is one", async () => {
    const fetcher = respond([]);
    await fetchPublicRepoCount("poggey", fetcher, "abc");
    const init = (fetcher as unknown as ReturnType<typeof vi.fn>).mock.calls[0]?.[1] as RequestInit;
    expect((init.headers as Record<string, string>).Authorization).toBe("Bearer abc");
  });
});

describe("tenure", () => {
  it("counts whole years from the start month", () => {
    expect(yearsSince("2022-06", "2026-10-08")).toBe(4);
    expect(yearsSince("2022-06", "2026-05-31")).toBe(3);
  });
});
