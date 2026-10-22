import type { Locale } from "@/i18n/config";

/** Social card settings, shared by the image routes and page metadata. */
export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";
export const ogImageId = "card";

/** Path of a language's card, as served by app/[lang]/opengraph-image and twitter-image. */
export function ogImagePath(locale: Locale, kind: "opengraph" | "twitter"): string {
  return `/${locale}/${kind}-image/${ogImageId}`;
}
