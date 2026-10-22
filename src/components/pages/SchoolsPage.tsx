import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PagePlaceholder } from "@/components/pages/PagePlaceholder";
import { isLocale, slugs, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { pageMetadata } from "@/i18n/metadata";

/**
 * The School Audits page is served at /en/schools and /fr/ecoles.
 * Both route files delegate here; a slug in the wrong language is a 404
 * (the proxy redirects it before it gets this far).
 */
function resolveLocale(lang: string, slug: string): Locale | undefined {
  return isLocale(lang) && slugs.schools[lang] === slug ? lang : undefined;
}

export async function schoolsMetadata(lang: string, slug: string): Promise<Metadata> {
  const locale = resolveLocale(lang, slug);
  if (!locale) return {};
  return pageMetadata(locale, "schools", getDictionary(locale).meta.schools);
}

export function SchoolsPage({ lang, slug }: { lang: string; slug: string }) {
  const locale = resolveLocale(lang, slug);
  if (!locale) notFound();
  const dict = getDictionary(locale);
  return <PagePlaceholder label={dict.practices.schools} title={dict.schools.hero.title} />;
}
