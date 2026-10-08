import { profileSchema } from "./schema";

// Filled in phase 01 from docs/private/sources/.
export const profile = profileSchema.parse({
  name: "Padraig Middleton",
});
