"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { track } from "@/lib/analytics";
import styles from "./PanelShell.module.css";

/**
 * The case study as a full-screen panel over the page. A native modal <dialog> gives the
 * focus trap, Esc and the inert page behind it for free. Closing goes back in history, so
 * the URL returns to the page and the browser's back button closes the panel too.
 */
export function PanelShell({
  slug,
  closeLabel,
  tokens,
  children,
}: {
  slug: string;
  closeLabel: string;
  /** The project's palette as custom properties, so the whole panel (close bar too) wears it. */
  tokens?: CSSProperties;
  children: ReactNode;
}) {
  const router = useRouter();
  const dialog = useRef<HTMLDialogElement>(null);
  const closing = useRef(false);

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    // Remember what had focus, so it gets it back on close.
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    if (!el.open) el.showModal();
    el.scrollTop = 0;
    document.documentElement.dataset.panelOpen = "true";
    track("panel_open", { slug });

    const onCancel = (e: Event) => {
      e.preventDefault();
      close();
    };
    el.addEventListener("cancel", onCancel);
    return () => {
      el.removeEventListener("cancel", onCancel);
      delete document.documentElement.dataset.panelOpen;
      if (el.open) el.close();
      opener?.focus({ preventScroll: true });
    };
    // close is stable for the panel's lifetime; slug changes remount the panel.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  function close() {
    if (closing.current) return;
    closing.current = true;
    router.back();
  }

  return (
    <dialog
      ref={dialog}
      data-lenis-prevent
      className={styles.panel}
      style={tokens}
      aria-labelledby={`study-${slug}`}
      onClick={(e) => {
        if (e.target === dialog.current) close();
      }}
    >
      <button type="button" className={styles.close} onClick={close}>
        {closeLabel}
      </button>
      {children}
    </dialog>
  );
}
