import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/ButtonLink";
import { Dither } from "@/components/Dither";
import { PracticePanel } from "@/components/home/PracticePanel";
import { SoundingLine } from "@/components/illustrations/SoundingLine";
import { SectionLabel } from "@/components/SectionLabel";
import { mailto, site } from "@/config/site";
import { isLocale, pathFor } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { pageMetadata } from "@/i18n/metadata";
import styles from "./home.module.css";

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const { meta } = getDictionary(lang);
  return pageMetadata(lang, "home", meta.home, { absoluteTitle: true });
}

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const t = dict.home;

  return (
    <>
      <section className={styles.hero}>
        <div className={`container grid ${styles.heroGrid}`}>
          <h1 className={styles.statement}>{t.statement}</h1>
          <SoundingLine label={t.illustrationAlt} className={styles.illustration} />
        </div>
      </section>

      <section className={styles.split} aria-labelledby="split-heading">
        <h2 id="split-heading" className="visually-hidden">
          {t.split.heading}
        </h2>
        <div className={`container grid ${styles.splitGrid}`}>
          <PracticePanel
            index={1}
            practice={dict.practices.startups}
            title={t.split.startups.title}
            text={t.split.startups.text}
            items={t.split.startups.items}
            cta={t.split.startups.cta}
            href={pathFor(lang, "startups")}
            className={styles.panelStartups}
          />
          <PracticePanel
            index={2}
            practice={dict.practices.schools}
            title={t.split.schools.title}
            text={t.split.schools.text}
            items={t.split.schools.items}
            cta={t.split.schools.cta}
            href={pathFor(lang, "schools")}
            className={styles.panelSchools}
          />
        </div>
      </section>

      <Dither from="var(--depth-0)" to="var(--depth-1)" />

      <section className={styles.principles} aria-labelledby="principles-heading">
        <div className={`container grid ${styles.principlesGrid}`}>
          <div className={styles.principlesHead}>
            <SectionLabel index={3}>{t.principles.label}</SectionLabel>
            <h2 id="principles-heading" className={styles.sectionTitle}>
              {t.principles.heading}
            </h2>
          </div>
          <ol role="list" className={styles.principlesList}>
            {t.principles.items.map((item, i) => (
              <li key={item.title} className={styles.principle}>
                <span className={styles.principleIndex} aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className={styles.principleTitle}>{item.title}</h3>
                <p className={styles.principleText}>{item.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Dither from="var(--depth-1)" to="var(--depth-3)" rows={12} />

      <section className={styles.contact} data-tone="dark" aria-labelledby="contact-heading">
        <div className={`container grid ${styles.contactGrid}`}>
          <div className={styles.contactHead}>
            <SectionLabel index={4}>{t.contact.label}</SectionLabel>
            <h2 id="contact-heading" className={styles.sectionTitle}>
              {t.contact.heading}
            </h2>
            <p className={styles.contactText}>{t.contact.text}</p>
          </div>
          <div className={styles.contactActions}>
            <ButtonLink href={mailto(t.contact.emailSubject)} icon="mail" hint={dict.a11y.opensEmail}>
              {t.contact.cta}
            </ButtonLink>
            <p className={styles.contactEmail}>
              {t.contact.emailPrefix}{" "}
              <a href={mailto(t.contact.emailSubject)}>{site.email}</a>
            </p>
          </div>
        </div>
      </section>

      <Dither from="var(--depth-3)" to="var(--depth-4)" />
    </>
  );
}
