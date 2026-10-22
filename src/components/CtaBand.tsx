import { site } from "@/config/site";
import { ButtonLink } from "./ButtonLink";
import { Section } from "./Section";
import { SectionLabel } from "./SectionLabel";
import styles from "./CtaBand.module.css";

type CtaBandProps = {
  index: number;
  label: string;
  heading: string;
  headingId: string;
  text: string;
  button: string;
  /** A prefilled mailto: link for now. */
  href: string;
  hint?: string;
  emailPrefix: string;
};

/**
 * The fjord call-to-action band near the foot of every page. Small text
 * here is bone; fjord pale is too weak on this ground (see tokens.css).
 */
export function CtaBand({ index, label, heading, headingId, text, button, href, hint, emailPrefix }: CtaBandProps) {
  return (
    <Section depth={3} labelledBy={headingId}>
      <div className={`container grid ${styles.grid}`}>
        <div className={styles.head}>
          <SectionLabel index={index}>{label}</SectionLabel>
          <h2 id={headingId} className={styles.heading}>
            {heading}
          </h2>
          <p className={styles.text}>{text}</p>
        </div>
        <div className={styles.actions}>
          <ButtonLink href={href} icon="mail" hint={hint}>
            {button}
          </ButtonLink>
          <p className={styles.email}>
            {emailPrefix} <a href={href}>{site.email}</a>
          </p>
        </div>
      </div>
    </Section>
  );
}
