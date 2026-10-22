import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { defaultLocale, locales, pathFor, routeKeys, type RouteKey } from "@/i18n/config";

const absolute = (path: string) => new URL(path, site.url).toString();

const priority: Record<RouteKey, number> = { home: 1, startups: 0.8, schools: 0.8, legal: 0.3 };

/**
 * Every page in both languages, each entry listing its language
 * alternates (with x-default) so search engines pair the translations.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return routeKeys.flatMap((key) => {
    const languages: Record<string, string> = {};
    for (const locale of locales) languages[locale] = absolute(pathFor(locale, key));
    languages["x-default"] = absolute(pathFor(defaultLocale, key));

    return locales.map((locale) => ({
      url: absolute(pathFor(locale, key)),
      changeFrequency: key === "legal" ? ("yearly" as const) : ("monthly" as const),
      priority: priority[key],
      alternates: { languages },
    }));
  });
}
