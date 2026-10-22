import Link from "next/link";
import { site } from "@/config/site";
import { allPaths, localeCodes, localeNames, pathFor, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { HeaderNav } from "./HeaderNav";
import { PixelMark } from "./pixel/PixelMark";
import styles from "./SiteHeader.module.css";

type SiteHeaderProps = { locale: Locale; dict: Dictionary };

export function SiteHeader({ locale, dict }: SiteHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link href={pathFor(locale, "home")} className={styles.logo} aria-label={dict.a11y.home}>
          <PixelMark className={styles.mark} />
          <span className={styles.wordmark}>{site.name}</span>
        </Link>
        <HeaderNav
          locale={locale}
          paths={allPaths()}
          labels={dict.nav}
          mainNavLabel={dict.a11y.mainNav}
          languageNavLabel={dict.a11y.languageNav}
          localeNames={localeNames}
          localeCodes={localeCodes}
        />
      </div>
    </header>
  );
}
