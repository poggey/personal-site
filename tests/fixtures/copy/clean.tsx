import { leverage } from "./not-copy";

// "robust" in a comment is fine, and so is this em dash: —
export function Clean() {
  return (
    <section>
      {/* DRAFT */}
      <p>Estimated with robust standard errors.</p>
      <p>A well-known, two-factor model. Pages 4 to 7.</p>
      <p>Elevation data, on a locked table.</p>
      <p>{leverage}</p>
    </section>
  );
}
