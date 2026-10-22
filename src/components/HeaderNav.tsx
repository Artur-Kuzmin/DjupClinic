"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, routeKeys, type Locale, type RouteKey } from "@/i18n/config";
import styles from "./SiteHeader.module.css";

type HeaderNavProps = {
  locale: Locale;
  paths: Record<RouteKey, Record<Locale, string>>;
  labels: { startups: string; schools: string; contact: string };
  mainNavLabel: string;
  languageNavLabel: string;
  localeNames: Record<Locale, string>;
  localeCodes: Record<Locale, string>;
};

/**
 * Practice links, Contact and the EN / FR switch. A client component only
 * because it reads the current path: it marks the active page and keeps the
 * visitor on the equivalent page when they switch language.
 */
export function HeaderNav({
  locale,
  paths,
  labels,
  mainNavLabel,
  languageNavLabel,
  localeNames,
  localeCodes,
}: HeaderNavProps) {
  const pathname = usePathname();
  const current = routeKeys.find((key) => paths[key][locale] === pathname);

  const practiceLinks: { key: RouteKey; label: string }[] = [
    { key: "startups", label: labels.startups },
    { key: "schools", label: labels.schools },
  ];

  return (
    <>
      <nav aria-label={mainNavLabel} className={styles.nav}>
        <ul role="list" className={styles.navList}>
          {practiceLinks.map(({ key, label }) => (
            <li key={key}>
              <Link
                href={paths[key][locale]}
                className={styles.navLink}
                aria-current={current === key ? "page" : undefined}
              >
                {label}
              </Link>
            </li>
          ))}
          <li>
            <a href="#contact" className={styles.navLink}>
              {labels.contact}
            </a>
          </li>
        </ul>
      </nav>

      <nav aria-label={languageNavLabel} className={styles.lang}>
        <ul role="list" className={styles.langList}>
          {locales.map((code) => (
            <li key={code} className={styles.langItem}>
              {code === locale ? (
                <span className={styles.langCurrent} aria-current="true">
                  <span aria-hidden="true">{localeCodes[code]}</span>
                  <span className="visually-hidden">{localeNames[code]}</span>
                </span>
              ) : (
                <Link
                  href={paths[current ?? "home"][code]}
                  hrefLang={code}
                  lang={code}
                  className={styles.langLink}
                >
                  <span aria-hidden="true">{localeCodes[code]}</span>
                  <span className="visually-hidden">{localeNames[code]}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
