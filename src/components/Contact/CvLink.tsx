"use client";

import { track } from "@/lib/analytics";
import { buttonClass } from "../Button/Button";

/** The one filled control on the page: the CV is the thing most people came for. */
export function CvLink({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} className={buttonClass("solid")} download onClick={() => track("cv_download")}>
      {label}
    </a>
  );
}
