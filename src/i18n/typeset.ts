import type { Locale } from "./config";

const NBSP = "\u00A0"; // before a colon, inside guillemets
const NNBSP = "\u202F"; // before ? ! ;

function typesetString(text: string, locale: Locale): string {
  let out = text.replace(/'/g, "\u2019");
  if (locale === "fr") {
    out = out
      .replace(/\s+([?!;])/g, `${NNBSP}$1`)
      .replace(/\s+:/g, `${NBSP}:`)
      .replace(/«\s*/g, `«${NBSP}`)
      .replace(/\s*»/g, `${NBSP}»`);
  }
  return out;
}

/**
 * Applies typographic conventions to every string in a dictionary:
 * curly apostrophes in both languages, and French non-breaking spaces
 * before high punctuation and inside guillemets.
 */
export function typeset<T>(value: T, locale: Locale): T {
  if (typeof value === "string") return typesetString(value, locale) as T;
  if (Array.isArray(value)) return value.map((item) => typeset(item, locale)) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, typeset(item, locale)]),
    ) as T;
  }
  return value;
}
