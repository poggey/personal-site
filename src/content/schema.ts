import { z } from "zod";

// Phase 01 defines a schema per content file. Every fact on the site passes through here.
export const profileSchema = z.object({
  name: z.string().min(1),
});

export type Profile = z.infer<typeof profileSchema>;
