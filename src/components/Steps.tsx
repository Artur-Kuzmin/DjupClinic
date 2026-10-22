import { Section, type Depth } from "./Section";
import { SectionLabel } from "./SectionLabel";
import styles from "./Steps.module.css";

type StepsProps = {
  index: number;
  label: string;
  heading: string;
  headingId: string;
  steps: { title: string; text: string }[];
  depth?: Depth;
};

/** A numbered sequence as plain rows on the 12-column grid. No timeline graphic. */
export function Steps({ index, label, heading, headingId, steps, depth = 1 }: StepsProps) {
  return (
    <Section depth={depth} labelledBy={headingId}>
      <div className={`container grid ${styles.grid}`}>
        <div className={styles.head}>
          <SectionLabel index={index}>{label}</SectionLabel>
          <h2 id={headingId} className={styles.heading}>
            {heading}
          </h2>
        </div>
        <ol role="list" className={styles.list}>
          {steps.map((step, i) => (
            <li key={step.title} className={styles.step}>
              <span className={styles.number} aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className={styles.title}>{step.title}</h3>
              <p className={styles.text}>{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
