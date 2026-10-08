import Link from "next/link";

// Placeholder. The designed 404 is built in phase 04.
export default function NotFound() {
  return (
    <main>
      <h1>Page not found</h1>
      <Link href="/">Back to the home page</Link>
    </main>
  );
}
