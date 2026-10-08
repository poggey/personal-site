import { notFound } from "next/navigation";

// Dev-only reference page for tokens and primitives (built in phase 02).
export default function StyleguidePage() {
  if (process.env.NODE_ENV === "production") notFound();
  return (
    <main>
      <h1>Styleguide</h1>
    </main>
  );
}
