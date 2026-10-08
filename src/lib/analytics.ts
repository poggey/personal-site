import { track as vercelTrack } from "@vercel/analytics";

// Custom events for Vercel Web Analytics. Cookieless, so no consent banner.
// Every event the site sends is listed here, so the set is easy to audit.
export type EventName =
  | "depth_change"
  | "panel_open"
  | "interlude_start"
  | "interlude_target_hit"
  | "interlude_reveal"
  | "cv_download"
  | "email_copy";

export function track(name: EventName, data?: Record<string, string | number>): void {
  try {
    vercelTrack(name, data);
  } catch {
    // Analytics must never break the page.
  }
}
