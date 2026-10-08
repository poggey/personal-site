"use client";

import { track } from "@/lib/analytics";
import { showToast } from "../Toast/toast";
import styles from "./Contact.module.css";

/**
 * The address is a real mailto link, so it works without JavaScript and in every mail app.
 * The button beside it copies the address and confirms with a toast.
 */
export function CopyEmail({
  email,
  copyLabel,
  copiedText,
}: {
  email: string;
  copyLabel: string;
  copiedText: string;
}) {
  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      showToast(copiedText);
      track("email_copy");
    } catch {
      // Clipboard can be blocked; the mailto link is still there.
    }
  }
  return (
    <div className={styles.email}>
      <a href={`mailto:${email}`} className={styles.address}>
        {email}
      </a>
      <button type="button" className={styles.copy} onClick={copy}>
        {copyLabel}
      </button>
    </div>
  );
}
