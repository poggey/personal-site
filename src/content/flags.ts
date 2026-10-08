import { flagsSchema } from "./schema";

// Open decisions. Change only when docs/private/DECISIONS.md changes.
// Raymond James figures and Greenline HSE are shown but kept low-key (see CLAUDE.md).
export const flags = flagsSchema.parse({
  showRaymondJamesFigures: true,
  showGreenline: true,
  featuredThird: "the-slate",
});
