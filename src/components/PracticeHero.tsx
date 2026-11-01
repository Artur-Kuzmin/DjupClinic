import type { ReactNode } from "react";
import { Section } from "./Section";
import { SectionLabel } from "./SectionLabel";
import styles from "./PracticeHero.module.css";

type PracticeHeroProps = {
  label: string;
  title: string;
  lead: string;
  action: ReactNode;
  illustration?: ReactNode;
  /** A large illustration: under the text on phones and tablets, half the hero beside it on wide screens. */
  wideIllustration?: boolean;
};

/** Opening of a practice page: practice label, headline, lead, one action. */
export function PracticeHero({ label, title, lead, action, illustration, wideIllustration = false }: PracticeHeroProps) {
  return (
    <Section depth={0} padded={false} className={styles.hero}>
      <div className={`container grid ${styles.grid} ${wideIllustration ? styles.wide : ""}`}>
        <div className={styles.head}>
          <SectionLabel>{label}</SectionLabel>
          <h1 className={styles.title}>{title}</h1>
        </div>
        <div className={styles.body}>
          <p className={styles.lead}>{lead}</p>
          <div className={styles.action}>{action}</div>
        </div>
        {illustration ? <div className={styles.illustration}>{illustration}</div> : null}
      </div>
    </Section>
  );
}
