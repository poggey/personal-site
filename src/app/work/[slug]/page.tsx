import { notFound } from "next/navigation";

// Cache Components needs at least one param to validate the route at build time.
// Phase 04 replaces this with the real case-study slugs.
export function generateStaticParams() {
  return [{ slug: "placeholder" }];
}

export default async function WorkPage({ params }: PageProps<"/work/[slug]">) {
  await params;
  notFound();
}
