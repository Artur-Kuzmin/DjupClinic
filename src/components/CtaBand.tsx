import { mailto } from "@/config/site";
import type { Locale } from "@/i18n/config";
import { ButtonLink } from "./ButtonLink";
import { EmailList } from "./EmailList";
import { Section } from "./Section";
import { SectionLabel } from "./SectionLabel";
import styles from "./CtaBand.module.css";

type CtaBandProps = {
  locale: Locale;
  index: number;
  label: string;
  heading: string;
  headingId: string;
  text: string;
  button: string;
  /** The button opens an email prefilled with this subject and body. */
  emailSubject: string;
  emailBody?: string;
  hint?: string;
  emailPrefix: string;
};

/**
 * The fjord call-to-action band near the foot of every page. Small text
 * here is bone; fjord pale is too weak on this ground (see tokens.css).
 */
export function CtaBand({
  locale,
  index,
  label,
  heading,
  headingId,
  text,
  button,
  emailSubject,
  emailBody,
  hint,
  emailPrefix,
}: CtaBandProps) {
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
          <ButtonLink href={mailto(emailSubject, emailBody)} icon="mail" hint={hint}>
            {button}
          </ButtonLink>
          <p className={styles.email}>
            {emailPrefix} <EmailList locale={locale} subject={emailSubject} body={emailBody} />
          </p>
        </div>
      </div>
    </Section>
  );
}
