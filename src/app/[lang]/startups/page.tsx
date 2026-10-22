import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/ButtonLink";
import { CtaBand } from "@/components/CtaBand";
import { Dither } from "@/components/Dither";
import { SeaChart } from "@/components/illustrations/SeaChart";
import { PracticeHero } from "@/components/PracticeHero";
import { Section } from "@/components/Section";
import { SectionLabel } from "@/components/SectionLabel";
import { CaseStudy } from "@/components/startups/CaseStudy";
import { TrackBlock } from "@/components/startups/TrackBlock";
import { Steps } from "@/components/Steps";
import { mailto } from "@/config/site";
import { isLocale } from "@/i18n/config";
import type { TrackKey } from "@/i18n/dictionaries/en";
import { getDictionary } from "@/i18n/get-dictionary";
import { pageMetadata } from "@/i18n/metadata";
import styles from "./startups.module.css";

export async function generateMetadata({ params }: PageProps<"/[lang]/startups">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return pageMetadata(lang, "startups", getDictionary(lang).meta.startups);
}

export default async function StartupsPage({ params }: PageProps<"/[lang]/startups">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const t = dict.startups;

  const bookCall = mailto(t.cta.emailSubject, t.cta.emailBody);
  const trackNames = Object.fromEntries(t.tracks.items.map((track) => [track.key, track.name])) as Record<
    TrackKey,
    string
  >;
  const [investors, customers] = t.tracks.items;

  return (
    <>
      <PracticeHero
        label={dict.practices.startups}
        title={t.hero.title}
        lead={t.hero.lead}
        action={
          <ButtonLink href={bookCall} icon="mail" hint={dict.a11y.opensEmail}>
            {t.hero.cta}
          </ButtonLink>
        }
        illustration={<SeaChart label={t.hero.illustrationAlt} />}
      />

      <Section depth={0} id="tracks" labelledBy="tracks-heading" className={styles.tracks}>
        <div className={`container grid ${styles.tracksGrid}`}>
          <div className={styles.tracksHead}>
            <SectionLabel index={1}>{t.tracks.label}</SectionLabel>
            <h2 id="tracks-heading" className={styles.heading}>
              {t.tracks.heading}
            </h2>
          </div>
          {[investors, customers].map((track, i) => (
            <TrackBlock
              key={track.key}
              track={track.key}
              name={track.name}
              fit={track.fit}
              summary={track.summary}
              deliverablesLabel={t.tracks.deliverablesLabel}
              deliverables={track.deliverables}
              className={i === 0 ? styles.trackFirst : styles.trackSecond}
            />
          ))}
        </div>
      </Section>

      <Dither from="var(--depth-0)" to="var(--depth-1)" />

      <Steps
        index={2}
        label={t.approach.label}
        heading={t.approach.heading}
        headingId="approach-heading"
        steps={t.approach.steps}
        depth={1}
      />

      <Dither from="var(--depth-1)" to="var(--depth-2)" />

      <CaseStudy index={3} headingId="case-heading" t={t.caseStudy} trackNames={trackNames} />

      <Dither from="var(--depth-2)" to="var(--depth-3)" rows={12} />

      <CtaBand
        index={4}
        label={t.cta.label}
        heading={t.cta.heading}
        headingId="cta-heading"
        text={t.cta.text}
        button={t.cta.button}
        href={bookCall}
        hint={dict.a11y.opensEmail}
        emailPrefix={t.cta.emailPrefix}
      />

      <Dither from="var(--depth-3)" to="var(--depth-4)" />
    </>
  );
}
