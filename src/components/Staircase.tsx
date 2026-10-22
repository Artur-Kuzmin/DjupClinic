import { Section } from "./Section";
import { SectionLabel } from "./SectionLabel";
import styles from "./Staircase.module.css";

type StaircaseProps = {
  index: number;
  label: string;
  heading: string;
  headingId: string;
  receiveLabel: string;
  steps: { title: string; text: string; receive: string }[];
  /** Drop the top padding when the section above shares this depth. */
  flushTop?: boolean;
};

/**
 * A sequence laid out as a descending staircase: each step sits lower than
 * the last, on ground one depth deeper than the section. The ground closes
 * into a full-width floor, ready for the next transition.
 */
export function Staircase({ index, label, heading, headingId, receiveLabel, steps, flushTop = false }: StaircaseProps) {
  return (
    <Section
      depth={1}
      padded={false}
      labelledBy={headingId}
      className={[styles.section, flushTop && styles.flushTop].filter(Boolean).join(" ")}
    >
      <div className={`container grid ${styles.grid}`}>
        <div className={styles.head}>
          <SectionLabel index={index}>{label}</SectionLabel>
          <h2 id={headingId} className={styles.heading}>
            {heading}
          </h2>
        </div>
        <ol role="list" className={styles.stairs}>
          {steps.map((step, i) => (
            <li key={step.title} className={styles.step}>
              <span className={styles.number} aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className={styles.title}>{step.title}</h3>
              <p className={styles.text}>{step.text}</p>
              <p className={styles.receiveLabel}>{receiveLabel}</p>
              <p className={styles.receive}>{step.receive}</p>
            </li>
          ))}
        </ol>
      </div>
      <div className={styles.floor} aria-hidden="true" />
    </Section>
  );
}
