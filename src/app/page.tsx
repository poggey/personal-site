import { content } from "@/content";

// Placeholder until phase 03 builds the sections. Importing the loader here means
// every content schema runs during `next build`, so invalid content fails the build.
export default function Home() {
  return (
    <main>
      <h1>{content.profile.name}</h1>
    </main>
  );
}
