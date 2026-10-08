import type { ButtonHTMLAttributes } from "react";
import styles from "./Button.module.css";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** "text": print with an underline (the default). "solid": the one filled control, for the CV. */
  variant?: "text" | "solid";
};

export function Button({ variant = "text", className, type = "button", ...rest }: Props) {
  return (
    <button
      type={type}
      className={`${styles.button} ${styles[variant]} ${className ?? ""}`}
      {...rest}
    />
  );
}

/** The same look for an <a>, so links that act like buttons match. */
export const buttonClass = (variant: "text" | "solid" = "text") =>
  `${styles.button} ${styles[variant]}`;
