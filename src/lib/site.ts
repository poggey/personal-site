// The canonical origin. Set NEXT_PUBLIC_SITE_URL once the domain is bought; until then
// Vercel's production URL, then localhost, keep canonical links and OG images absolute.
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");
