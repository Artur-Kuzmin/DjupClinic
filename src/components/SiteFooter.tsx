import Link from "next/link";
import { mailto, site } from "@/config/site";
import { pathFor, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { copyrightYear } from "@/lib/copyright-year";
import { PixelMark } from "./pixel/PixelMark";
import styles from "./SiteFooter.module.css";

type SiteFooterProps = { locale: Locale; dict: Dictionary };

/** The deepest point of every page: ink ground, small type, reference links. */
export async function SiteFooter({ locale, dict }: SiteFooterProps) {
  const year = await copyrightYear();

  return (
    <footer className={styles.footer} data-tone="dark">
      <div className={`container grid ${styles.top}`}>
        <div className={styles.brand}>
          <Link href={pathFor(locale, "home")} className={styles.logo} aria-label={dict.a11y.home}>
            <PixelMark />
            <span className={styles.wordmark}>{site.name}</span>
          </Link>
          <p className={styles.tagline}>{dict.footer.tagline}</p>
        </div>

        <nav className={styles.practices} aria-labelledby="footer-practices">
          <h2 id="footer-practices" className={styles.heading}>
            {dict.footer.practicesHeading}
          </h2>
          <ul role="list" className={styles.list}>
            <li>
              <Link href={pathFor(locale, "startups")} className={styles.link}>
                {dict.practices.startups}
              </Link>
            </li>
            <li>
              <Link href={pathFor(locale, "schools")} className={styles.link}>
                {dict.practices.schools}
              </Link>
            </li>
          </ul>
        </nav>

        <div id="contact" className={styles.contact}>
          <h2 className={styles.heading}>{dict.footer.contactHeading}</h2>
          <ul role="list" className={styles.list}>
            {site.emails.map((email) => (
              <li key={email}>
                <a href={mailto(dict.home.contact.emailSubject, undefined, [email])} className={styles.link}>
                  {email}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={`container ${styles.bottom}`}>
        <p>
          <span className={styles.copyright}>©</span> {year} {site.name}
        </p>
      </div>
    </footer>
  );
}
