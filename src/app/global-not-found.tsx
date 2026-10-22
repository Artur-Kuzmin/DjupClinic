import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/ButtonLink";
import { Dither } from "@/components/Dither";
import { PixelMark } from "@/components/pixel/PixelMark";
import { SectionLabel } from "@/components/SectionLabel";
import { site } from "@/config/site";
import { localeCodes, localeNames, pathFor } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { copyrightYear } from "@/lib/copyright-year";
import header from "@/components/SiteHeader.module.css";
import styles from "./global-not-found.module.css";
import { fontVariables } from "./fonts";
import "@/styles/tokens.css";
import "./globals.css";

const en = getDictionary("en");
const fr = getDictionary("fr");

export const metadata: Metadata = {
  title: `${en.meta.notFound.title} · ${fr.meta.notFound.title} · ${site.name}`,
  description: en.meta.notFound.description,
};

/**
 * One 404 for every unmatched URL. The locale is not known here (the root
 * layout lives under /[lang]), so the page speaks both languages.
 */
export default async function GlobalNotFound() {
  const year = await copyrightYear();
  const versions = [
    { locale: "en" as const, t: en.notFound },
    { locale: "fr" as const, t: fr.notFound },
  ];

  return (
    <html lang="en" className={fontVariables}>
      <body className={styles.page}>
        <header className={header.header}>
          <div className={`container ${header.inner}`}>
            <Link href="/" className={header.logo} aria-label={en.a11y.home}>
              <PixelMark className={header.mark} />
              <span className={header.wordmark}>{site.name}</span>
            </Link>
            <nav aria-label={en.a11y.languageNav} className={header.lang}>
              <ul role="list" className={header.langList}>
                {versions.map(({ locale }) => (
                  <li key={locale} className={header.langItem}>
                    <Link href={pathFor(locale, "home")} hrefLang={locale} lang={locale} className={header.langLink}>
                      <span aria-hidden="true">{localeCodes[locale]}</span>
                      <span className="visually-hidden">{localeNames[locale]}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </header>

        <main id="main" className={styles.main}>
          <section className={styles.hero}>
            <div className="container grid">
              {versions.map(({ locale, t }, i) => (
                <div key={locale} lang={locale} className={i === 0 ? styles.primary : styles.secondary}>
                  <SectionLabel>{t.label}</SectionLabel>
                  {i === 0 ? (
                    <h1 className={styles.title}>{t.title}</h1>
                  ) : (
                    <p className={styles.title}>{t.title}</p>
                  )}
                  <p className={styles.text}>{t.text}</p>
                  <div className={styles.action}>
                    <ButtonLink href={pathFor(locale, "home")} variant="secondary">
                      {t.cta}
                    </ButtonLink>
                  </div>
                </div>
              ))}
            </div>
          </section>
          <Dither from="var(--depth-0)" to="var(--depth-4)" rows={12} />
        </main>

        <footer className={styles.footer} data-tone="dark">
          <div className="container">
            <p>
              <span className={styles.copyright}>©</span> {year} {site.name}
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
