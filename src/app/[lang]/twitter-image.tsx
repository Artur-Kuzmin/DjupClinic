import { defaultLocale, isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { ogContentType, ogImageId, ogSize } from "@/lib/og-config";
import { renderOgImage } from "@/lib/og-image";

export const contentType = "image/png";

type LangParams = { lang: string };

/** Same card as Open Graph, served for Twitter / X large image cards. */
export async function generateImageMetadata({ params }: { params: LangParams | Promise<LangParams> }) {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : defaultLocale;
  return [{ id: ogImageId, alt: getDictionary(locale).meta.ogImageAlt, size: ogSize, contentType: ogContentType }];
}

export default async function Image({ params }: { params: Promise<LangParams> }) {
  const { lang } = await params;
  return renderOgImage(isLocale(lang) ? lang : defaultLocale);
}
