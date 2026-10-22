import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Fragment, type ReactNode } from "react";
import { Dither } from "@/components/Dither";
import { EmailList } from "@/components/EmailList";
import { Section } from "@/components/Section";
import { SectionLabel } from "@/components/SectionLabel";
import { site } from "@/config/site";
import { isLocale, slugs, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { pageMetadata } from "@/i18n/metadata";
import styles from "./LegalPage.module.css";

/**
 * Legal notice / mentions légales, served at /en/legal-notice and
 * /fr/mentions-legales. Both route files delegate here.
 */
function resolveLocale(lang: string, slug: string): Locale | undefined {
  return isLocale(lang) && slugs.legal[lang] === slug ? lang : undefined;
}

export async function legalMetadata(lang: string, slug: string): Promise<Metadata> {
  const locale = resolveLocale(lang, slug);
  if (!locale) return {};
  return pageMetadata(locale, "legal", getDictionary(locale).meta.legal);
}

function Row({ id, heading, children }: { id: string; heading: string; children: ReactNode }) {
  return (
    <section className={styles.row} aria-labelledby={id}>
      <h2 id={id} className={styles.rowLabel}>
        {heading}
      </h2>
      <div className={styles.rowBody}>{children}</div>
    </section>
  );
}

export function LegalPage({ lang, slug }: { lang: string; slug: string }) {
  const locale = resolveLocale(lang, slug);
  if (!locale) notFound();
  const t = getDictionary(locale).legal;

  return (
    <>
      <Section depth={0} padded={false} className={styles.page}>
        <div className={`container grid ${styles.grid}`}>
          <div className={styles.head}>
            <SectionLabel>{site.name}</SectionLabel>
            <h1 className={styles.title}>{t.title}</h1>
            <p className={styles.intro}>{t.intro}</p>
          </div>

          <div className={styles.rows}>
            <Row id="legal-publisher" heading={t.publisher.heading}>
              <p>{t.publisher.text}</p>
            </Row>
            <Row id="legal-contact" heading={t.contact.heading}>
              <p>
                {t.contact.text} <EmailList locale={locale} linkClassName={styles.email} />
              </p>
            </Row>
            <Row id="legal-host" heading={t.host.heading}>
              <p>
                {t.host.name}
                {t.host.address.map((line) => (
                  <Fragment key={line}>
                    <br />
                    {line}
                  </Fragment>
                ))}
              </p>
              <p>
                <a href={`https://${t.host.website}`} className={styles.link}>
                  {t.host.website}
                </a>
              </p>
            </Row>
            <Row id="legal-privacy" heading={t.privacy.heading}>
              {t.privacy.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
            </Row>
          </div>
        </div>
      </Section>
      <Dither from="var(--depth-0)" to="var(--depth-4)" rows={12} />
    </>
  );
}
