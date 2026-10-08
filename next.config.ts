import { execSync } from "node:child_process";
import createMDX from "@next/mdx";
import type { NextConfig } from "next";

// Build-time facts for the footer and the time axis. Vercel gives the commit hash but not
// its date, so ask git; a shallow clone or no git falls back to the build date.
function git(command: string): string {
  try {
    return execSync(`git ${command}`, { stdio: ["ignore", "pipe", "ignore"] })
      .toString()
      .trim();
  } catch {
    return "";
  }
}

const buildDate = new Date().toISOString().slice(0, 10);
const commitDate = git("log -1 --format=%cs") || buildDate;
const commitSha = (process.env.VERCEL_GIT_COMMIT_SHA ?? git("rev-parse HEAD")).slice(0, 7);

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  env: {
    NEXT_PUBLIC_BUILD_DATE: buildDate,
    NEXT_PUBLIC_COMMIT_DATE: commitDate,
    NEXT_PUBLIC_COMMIT_SHA: commitSha,
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

// Case-study copy lives in src/content/projects/*.mdx and is imported, not routed,
// so pageExtensions stays at the default.
const withMDX = createMDX({});

export default withMDX(nextConfig);
