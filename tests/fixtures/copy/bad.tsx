// A comment with an em dash — is code, not copy, so it is ignored.
export function Bad() {
  return (
    <section aria-label="Risk — return">
      {/* DRAFT */}
      <p>We leverage data to unlock insight.</p>
      <p>Held 2019–2021.</p>
      <p>{`A robust model`}</p>
    </section>
  );
}
