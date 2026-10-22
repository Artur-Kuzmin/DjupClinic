import type { ReactNode } from "react";
import styles from "./SectionLabel.module.css";

type SectionLabelProps = {
  /** Section number, rendered as two digits. Omit for an unnumbered label. */
  index?: number;
  children: ReactNode;
  className?: string;
};

/** Pixel-mono section label in the "01 — Approach" form. */
export function SectionLabel({ index, children, className }: SectionLabelProps) {
  return (
    <p className={[styles.label, className].filter(Boolean).join(" ")}>
      {index !== undefined ? (
        <>
          <span>{String(index).padStart(2, "0")}</span>
          <span className={styles.dash} aria-hidden="true" />
        </>
      ) : null}
      <span>{children}</span>
    </p>
  );
}
