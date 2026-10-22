import type { Locale } from "./config";

const NBSP = " "; // before a colon, inside guillemets
const NNBSP = " "; // before ? ! ;
const WORD_JOINER = "⁠"; // invisible; forbids a line break after a hyphen

/** Keys whose strings leave the page (head tags, prefilled emails): no invisible characters. */
const PLAIN_KEYS = /^(meta|email)/;

function typesetString(text: string, locale: Locale, plain: boolean): string {
  let out = text.replace(/'/g, "’");
  if (locale === "fr") {
    out = out
      .replace(/\s+([?!;])/g, `${NNBSP}$1`)
      .replace(/\s+:/g, `${NBSP}:`)
      .replace(/«\s*/g, `«${NBSP}`)
      .replace(/\s*»/g, `${NBSP}»`);
  }
  if (!plain) {
    // Keep hyphenated words together ("early-stage", "post-bac", "pré-amorçage").
    // Geist has no non-breaking hyphen glyph, so the hyphen stays and a word
    // joiner after it removes the break opportunity.
    out = out.replace(/(\p{L})-(?=\p{L})/gu, `$1-${WORD_JOINER}`);
  }
  return out;
}

/**
 * Applies typographic conventions to every string in a dictionary:
 * curly apostrophes in both languages, French non-breaking spaces before
 * high punctuation and inside guillemets, and unbreakable hyphenated words.
 */
export function typeset<T>(value: T, locale: Locale, plain = false): T {
  if (typeof value === "string") return typesetString(value, locale, plain) as T;
  if (Array.isArray(value)) return value.map((item) => typeset(item, locale, plain)) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, typeset(item, locale, plain || PLAIN_KEYS.test(key))]),
    ) as T;
  }
  return value;
}
