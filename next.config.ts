import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
};

// Case-study copy lives in src/content/projects/*.mdx and is imported, not routed,
// so pageExtensions stays at the default.
const withMDX = createMDX({});

export default withMDX(nextConfig);
