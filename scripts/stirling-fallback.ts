// Refreshes src/content/data/stirling-fallback.json, the edition shown if Stirling's API
// is down. Run before a deploy: `node scripts/stirling-fallback.ts`.
import { writeFileSync } from "node:fs";
import { editionSchema, summarise, STIRLING_SITE } from "../src/lib/stirling-edition.ts";

const res = await fetch(`${STIRLING_SITE}/api/editions/latest`);
if (!res.ok) throw new Error(`Stirling responded ${res.status}`);
const summary = summarise(editionSchema.parse(await res.json()));
writeFileSync("src/content/data/stirling-fallback.json", JSON.stringify(summary, null, 2) + "\n");
console.log(`Saved edition No. ${summary.number} (${summary.date}).`);
