/**
 * Locales, routes and URL helpers. Shared by the proxy, layouts and pages.
 */

export const locales = ["en", "fr"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export function isLocale(value: string | undefined): value is Locale {
  return value !== undefined && (locales as readonly string[]).includes(value);
}

/** Language names written in their own language, for the language switch. */
export const localeNames: Record<Locale, string> = { en: "English", fr: "Français" };
export const localeCodes: Record<Locale, string> = { en: "EN", fr: "FR" };
export const openGraphLocales: Record<Locale, string> = { en: "en_GB", fr: "fr_FR" };

export const routeKeys = ["home", "startups", "schools", "legal"] as const;
export type RouteKey = (typeof routeKeys)[number];

/** URL slug of every page in every locale. An empty slug is the locale root. */
export const slugs: Record<RouteKey, Record<Locale, string>> = {
  home: { en: "", fr: "" },
  startups: { en: "startups", fr: "startups" },
  schools: { en: "schools", fr: "ecoles" },
  legal: { en: "legal-notice", fr: "mentions-legales" },
};

export function pathFor(locale: Locale, key: RouteKey): string {
  const slug = slugs[key][locale];
  return slug ? `/${locale}/${slug}` : `/${locale}`;
}

/** Every page's path in both locales, keyed by route. */
export function allPaths(): Record<RouteKey, Record<Locale, string>> {
  return Object.fromEntries(
    routeKeys.map((key) => [
      key,
      Object.fromEntries(locales.map((locale) => [locale, pathFor(locale, key)])),
    ]),
  ) as Record<RouteKey, Record<Locale, string>>;
}

/** Finds the page a slug belongs to, in any locale. */
export function routeKeyForSlug(slug: string): RouteKey | undefined {
  return routeKeys.find(
    (key) => slugs[key].en !== "" && locales.some((locale) => slugs[key][locale] === slug),
  );
}
