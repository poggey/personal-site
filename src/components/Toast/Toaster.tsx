"use client";

import { useEffect, useState } from "react";
import { TOAST_EVENT } from "./toast";
import styles from "./Toaster.module.css";

const VISIBLE_MS = 2000;

/** One live region for the whole page. Mounted once in the layout. */
export function Toaster() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    let timer: number | undefined;
    const onToast = (event: Event) => {
      setMessage((event as CustomEvent<string>).detail);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setMessage(""), VISIBLE_MS);
    };
    window.addEventListener(TOAST_EVENT, onToast);
    return () => {
      window.removeEventListener(TOAST_EVENT, onToast);
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <div className={styles.region} role="status" aria-live="polite">
      {message ? <p className={styles.toast}>{message}</p> : null}
    </div>
  );
}
