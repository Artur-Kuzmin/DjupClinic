import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/ButtonLink";
import { CtaBand } from "@/components/CtaBand";
import { Dither } from "@/components/Dither";
import { AnswerCard } from "@/components/illustrations/AnswerCard";
import { PracticeHero } from "@/components/PracticeHero";
import { Section } from "@/components/Section";
import { SectionLabel } from "@/components/SectionLabel";
import { Staircase } from "@/components/Staircase";
import { Steps } from "@/components/Steps";
import { mailto } from "@/config/site";
import { isLocale, slugs, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { pageMetadata } from "@/i18n/metadata";
import styles from "./SchoolsPage.module.css";

/**
 * The School Audits page is served at /en/schools and /fr/ecoles.
 * Both route files delegate here; a slug in the wrong language is a 404
 * (the proxy redirects it before it gets this far).
 */
function resolveLocale(lang: string, slug: string): Locale | undefined {
  return isLocale(lang) && slugs.schools[lang] === slug ? lang : undefined;
}

export async function schoolsMetadata(lang: string, slug: string): Promise<Metadata> {
  const locale = resolveLocale(lang, slug);
  if (!locale) return {};
  return pageMetadata(locale, "schools", getDictionary(locale).meta.schools);
}

export function SchoolsPage({ lang, slug }: { lang: string; slug: string }) {
  const locale = resolveLocale(lang, slug);
  if (!locale) notFound();
  const dict = getDictionary(locale);
  const t = dict.schools;

  return (
    <>
      <PracticeHero
        label={dict.practices.schools}
        title={t.hero.title}
        lead={t.hero.lead}
        action={
          <ButtonLink href={mailto(t.cta.emailSubject, t.cta.emailBody)} icon="mail" hint={dict.a11y.opensEmail}>
            {t.hero.cta}
          </ButtonLink>
        }
        illustration={<AnswerCard label={t.hero.illustrationAlt} />}
      />

      <Section depth={0} labelledBy="problem-heading" className={styles.problem}>
        <div className={`container grid ${styles.problemGrid}`}>
          <div className={styles.problemHead}>
            <SectionLabel index={1}>{t.problem.label}</SectionLabel>
            <h2 id="problem-heading" className={styles.heading}>
              {t.problem.heading}
            </h2>
            <p className={styles.problemText}>{t.problem.text}</p>
          </div>
          <div className={styles.checks}>
            <h3 className={styles.checksLabel}>{t.problem.listLabel}</h3>
            <dl className={styles.checkList}>
              {t.problem.items.map((item) => (
                <div key={item.title} className={styles.check}>
                  <dt className={styles.checkTitle}>{item.title}</dt>
                  <dd className={styles.checkText}>{item.text}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Section>

      <Dither from="var(--depth-0)" to="var(--depth-1)" />

      <Steps
        index={2}
        label={t.method.label}
        heading={t.method.heading}
        headingId="method-heading"
        steps={t.method.steps}
        depth={1}
      />

      <Staircase
        index={3}
        label={t.process.label}
        heading={t.process.heading}
        headingId="process-heading"
        receiveLabel={t.process.receiveLabel}
        steps={t.process.steps}
        flushTop
      />

      <Dither from="var(--depth-2)" to="var(--depth-3)" rows={12} />

      <CtaBand
        locale={locale}
        index={4}
        label={t.cta.label}
        heading={t.cta.heading}
        headingId="cta-heading"
        text={t.cta.text}
        button={t.cta.button}
        emailSubject={t.cta.emailSubject}
        emailBody={t.cta.emailBody}
        hint={dict.a11y.opensEmail}
        emailPrefix={t.cta.emailPrefix}
      />

      <Dither from="var(--depth-3)" to="var(--depth-4)" />
    </>
  );
}
