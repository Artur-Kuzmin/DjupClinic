import type { Locale } from "./config";
import type { Dictionary } from "./dictionaries/en";
import en from "./dictionaries/en";
import fr from "./dictionaries/fr";
import { typeset } from "./typeset";

const dictionaries = {
  en: typeset(en, "en"),
  fr: typeset(fr, "fr"),
} satisfies Record<Locale, Dictionary>;

/** Returns the typeset dictionary for a locale. */
export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export type { Dictionary };
