import type { ReactNode } from "react";
import styles from "./Section.module.css";

export type Depth = 0 | 1 | 2 | 3 | 4;

/** Depth 3 is the fjord call-to-action band, depth 4 the ink footer. */
const TONES: Partial<Record<Depth, "deep" | "dark">> = { 3: "deep", 4: "dark" };

type SectionProps = {
  depth?: Depth;
  id?: string;
  labelledBy?: string;
  className?: string;
  /** Standard vertical padding. Turn off for sections that set their own. */
  padded?: boolean;
  children: ReactNode;
};

/**
 * A full-bleed page section at a given depth. The depth sets the ground
 * colour (exposed as --color-bg for focus rings) and, for the deepest two,
 * the dark colour tone.
 */
export function Section({ depth = 0, id, labelledBy, className, padded = true, children }: SectionProps) {
  const classes = [styles.section, styles[`depth${depth}`], padded && styles.padded, className]
    .filter(Boolean)
    .join(" ");
  return (
    <section id={id} aria-labelledby={labelledBy} data-tone={TONES[depth]} className={classes}>
      {children}
    </section>
  );
}
