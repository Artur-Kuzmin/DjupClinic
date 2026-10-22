import type { Metadata } from "next";
import { site } from "@/config/site";
import {
  defaultLocale,
  locales,
  openGraphLocales,
  pathFor,
  type Locale,
  type RouteKey,
} from "./config";

type PageMeta = { title: string; description: string };

/**
 * Localised metadata for a page: title, description, canonical URL,
 * hreflang alternates (with x-default) and Open Graph locale.
 * Relative URLs resolve against metadataBase, set in the root layout.
 */
export function pageMetadata(
  locale: Locale,
  key: RouteKey,
  meta: PageMeta,
  options: { absoluteTitle?: boolean } = {},
): Metadata {
  const languages: Record<string, string> = {};
  for (const l of locales) languages[l] = pathFor(l, key);
  languages["x-default"] = pathFor(defaultLocale, key);

  return {
    title: options.absoluteTitle ? { absolute: meta.title } : meta.title,
    description: meta.description,
    alternates: {
      canonical: pathFor(locale, key),
      languages,
    },
    openGraph: {
      type: "website",
      siteName: site.name,
      url: pathFor(locale, key),
      title: meta.title,
      description: meta.description,
      locale: openGraphLocales[locale],
      alternateLocale: locales.filter((l) => l !== locale).map((l) => openGraphLocales[l]),
    },
  };
}
