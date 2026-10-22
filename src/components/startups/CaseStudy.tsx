import Image from "next/image";
import { PlaceholderSlot } from "@/components/PlaceholderSlot";
import { Section } from "@/components/Section";
import { SectionLabel } from "@/components/SectionLabel";
import { caseStudies, site } from "@/config/site";
import type { TrackKey } from "@/i18n/dictionaries/en";
import type { Dictionary } from "@/i18n/get-dictionary";
import styles from "./CaseStudy.module.css";

type CaseStudyProps = {
  index: number;
  headingId: string;
  t: Dictionary["startups"]["caseStudy"];
  trackNames: Record<TrackKey, string>;
};

/**
 * ReBound Nordic, the founding pilot client. Scope and approach only: no
 * results, metrics or quotes until the client approves them. The testimonial
 * and logo render as marked slots while they are missing.
 */
export function CaseStudy({ index, headingId, t, trackNames }: CaseStudyProps) {
  const { logo } = caseStudies.reboundNordic;
  const showSlots = site.showPlaceholderSlots;

  return (
    <Section depth={2} labelledBy={headingId}>
      <div className={`container grid ${styles.grid}`}>
        <div className={styles.intro}>
          <SectionLabel index={index}>{t.label}</SectionLabel>
          <h2 id={headingId} className={styles.name}>
            {t.name}
          </h2>
          <p className={styles.tag}>{t.tag}</p>
          <p className={styles.lead}>{t.intro}</p>
          {logo ? (
            <Image src={logo.src} width={logo.width} height={logo.height} alt={t.logoAlt} className={styles.logo} />
          ) : showSlots ? (
            <div className={styles.logoSlot}>
              <PlaceholderSlot variant="logo" label={t.slots.logoLabel} text={t.slots.logoText} />
            </div>
          ) : null}
        </div>

        <div className={styles.detail}>
          <div className={styles.block}>
            <h3 className={styles.blockLabel}>{t.scopeLabel}</h3>
            <ul role="list" className={styles.scope}>
              {t.scope.map((item) => (
                <li key={item.title} className={styles.scopeItem}>
                  <span className={styles.scopeTitle}>{item.title}</span>
                  <span className={styles.scopeTrack}>{trackNames[item.track]}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.block}>
            <h3 className={styles.blockLabel}>{t.approachLabel}</h3>
            {t.approach.map((paragraph) => (
              <p key={paragraph.slice(0, 32)} className={styles.paragraph}>
                {paragraph}
              </p>
            ))}
          </div>

          {t.testimonial ? (
            <figure className={`${styles.block} ${styles.quote}`}>
              <blockquote className={styles.quoteText}>
                <p>{t.testimonial.quote}</p>
              </blockquote>
              <figcaption className={styles.quoteSource}>
                {t.testimonial.name}, {t.testimonial.role}
              </figcaption>
            </figure>
          ) : showSlots ? (
            <div className={styles.block}>
              <PlaceholderSlot label={t.slots.testimonialLabel} text={t.slots.testimonialText} />
            </div>
          ) : null}
        </div>
      </div>
    </Section>
  );
}
