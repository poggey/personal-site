"use client";

import { useSyncExternalStore } from "react";

const format = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/London",
});

// One shared minute clock. The server snapshot is empty, so the server HTML and the first
// client render agree (no hydration mismatch); the time fills in straight after.
function subscribe(callback: () => void): () => void {
  const timer = window.setInterval(callback, 15_000);
  return () => window.clearInterval(timer);
}
const getTime = () => format.format(new Date());
const getServerTime = () => "";

export function LondonTime({ label }: { label: string }) {
  const time = useSyncExternalStore(subscribe, getTime, getServerTime);
  return (
    <p>
      {label} <time suppressHydrationWarning>{time}</time>
    </p>
  );
}
