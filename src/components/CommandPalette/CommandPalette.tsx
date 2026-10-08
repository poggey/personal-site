"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { Depth } from "@/content/schema";
import { track } from "@/lib/analytics";
import { setDepth } from "@/lib/depth";
import { toggleTheme } from "@/lib/theme";
import { showToast } from "../Toast/toast";
import type { PaletteMode } from "./events";
import styles from "./CommandPalette.module.css";

export type PaletteData = {
  sections: { id: string; label: string }[];
  projects: { slug: string; title: string }[];
  email: string;
  cv: string;
  text: {
    placeholder: string;
    heading: string;
    shortcutsHeading: string;
    copyEmail: string;
    emailCopied: string;
    downloadCv: string;
    toggleTheme: string;
    depth: Record<Depth, string>;
    depthLegend: string;
    groupSections: string;
    groupProjects: string;
    groupActions: string;
    noResults: string;
    consoleNote: string;
    shortcuts: { keys: string; action: string }[];
  };
};

/** Commands are plain data; run() turns one into an action when it is chosen. */
type Command =
  | { id: string; group: string; label: string; kind: "section"; target: string }
  | { id: string; group: string; label: string; kind: "project"; target: string }
  | { id: string; group: string; label: string; kind: "depth"; depth: Depth }
  | { id: string; group: string; label: string; kind: "copy-email" | "download-cv" | "theme" };

/**
 * A native <dialog> (focus trapped, Esc closes, focus returns) holding the ARIA combobox
 * pattern: typing filters a listbox, arrow keys move the active option, Enter runs it.
 */
export default function CommandPalette({
  data,
  mode,
  onClose,
}: {
  data: PaletteData;
  mode: PaletteMode;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const listId = useId();
  const { text } = data;

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    el.showModal();
    const onCancel = () => onClose();
    el.addEventListener("close", onCancel);
    return () => {
      el.removeEventListener("close", onCancel);
      if (el.open) el.close();
    };
  }, [onClose]);

  const commands = useMemo<Command[]>(
    () => [
      ...data.sections.map((sec) => ({
        id: `section-${sec.id}`,
        group: text.groupSections,
        label: sec.label,
        kind: "section" as const,
        target: sec.id,
      })),
      ...data.projects.map((p) => ({
        id: `project-${p.slug}`,
        group: text.groupProjects,
        label: p.title,
        kind: "project" as const,
        target: p.slug,
      })),
      { id: "copy-email", group: text.groupActions, label: text.copyEmail, kind: "copy-email" },
      { id: "download-cv", group: text.groupActions, label: text.downloadCv, kind: "download-cv" },
      ...(["30s", "3m", "10m"] as const).map((d) => ({
        id: `depth-${d}`,
        group: text.groupActions,
        label: `${text.depthLegend}: ${text.depth[d]}`,
        kind: "depth" as const,
        depth: d,
      })),
      { id: "theme", group: text.groupActions, label: text.toggleTheme, kind: "theme" },
    ],
    [data, text],
  );

  function run(command: Command) {
    dialog.current?.close();
    switch (command.kind) {
      case "section": {
        const section = document.getElementById(command.target);
        section?.scrollIntoView();
        section?.querySelector<HTMLElement>("h2")?.setAttribute("tabindex", "-1");
        section?.querySelector<HTMLElement>("h2")?.focus({ preventScroll: true });
        break;
      }
      case "project":
        router.push(`/work/${command.target}`, { scroll: false });
        break;
      case "copy-email":
        navigator.clipboard
          .writeText(data.email)
          .then(() => {
            showToast(text.emailCopied);
            track("email_copy");
          })
          .catch(() => {});
        break;
      case "download-cv":
        track("cv_download");
        window.location.href = data.cv;
        break;
      case "depth":
        setDepth(command.depth);
        track("depth_change", { depth: command.depth });
        break;
      case "theme":
        toggleTheme();
        break;
    }
  }

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? commands.filter((c) => c.label.toLowerCase().includes(q)) : commands;
  }, [commands, query]);

  const activeIndex = Math.min(active, Math.max(results.length - 1, 0));
  const optionId = (i: number) => `${listId}-option-${i}`;

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((activeIndex + 1) % Math.max(results.length, 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((activeIndex - 1 + results.length) % Math.max(results.length, 1));
    } else if (e.key === "Home") {
      setActive(0);
    } else if (e.key === "End") {
      setActive(results.length - 1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const chosen = results[activeIndex];
      if (chosen) run(chosen);
    }
  }

  // Keep the active option in view as the arrows move through a long list.
  useEffect(() => {
    document.getElementById(optionId(activeIndex))?.scrollIntoView({ block: "nearest" });
  });

  return (
    <dialog
      ref={dialog}
      data-lenis-prevent
      className={styles.dialog}
      aria-label={mode === "shortcuts" ? text.shortcutsHeading : text.heading}
      onClick={(e) => {
        // A click on the backdrop (the dialog element itself, outside its content) closes it.
        if (e.target === dialog.current) dialog.current?.close();
      }}
    >
      <div className={styles.panel}>
        {mode === "shortcuts" ? (
          <>
            <h2 className={styles.title}>{text.shortcutsHeading}</h2>
            <dl className={styles.shortcuts}>
              {text.shortcuts.map((s) => (
                <div key={s.keys}>
                  <dt>
                    <kbd>{s.keys}</kbd>
                  </dt>
                  <dd>{s.action}</dd>
                </div>
              ))}
            </dl>
          </>
        ) : (
          <>
            <input
              className={styles.input}
              role="combobox"
              aria-expanded="true"
              aria-controls={listId}
              aria-autocomplete="list"
              aria-activedescendant={results.length ? optionId(activeIndex) : undefined}
              aria-label={text.placeholder}
              placeholder={text.placeholder}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActive(0);
              }}
              onKeyDown={onKeyDown}
              autoFocus
            />
            <ul id={listId} role="listbox" className={styles.list} aria-label={text.heading}>
              {results.map((c, i) => (
                <li
                  key={c.id}
                  id={optionId(i)}
                  role="option"
                  aria-selected={i === activeIndex}
                  className={styles.option}
                  onMouseMove={() => setActive(i)}
                  onClick={() => run(c)}
                >
                  <span>{c.label}</span>
                  <span className={styles.group}>{c.group}</span>
                </li>
              ))}
            </ul>
            {results.length === 0 ? <p className={styles.empty}>{text.noResults}</p> : null}
          </>
        )}
      </div>
    </dialog>
  );
}
