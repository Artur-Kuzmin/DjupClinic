import { Fragment } from "react";
import { mailto, site } from "@/config/site";
import type { Locale } from "@/i18n/config";

type EmailListProps = {
  locale: Locale;
  /** Prefilled subject and body for each address's own link. */
  subject?: string;
  body?: string;
  linkClassName?: string;
};

/**
 * The contact addresses as separate links, joined the way the language
 * joins alternatives ("a or b", "a ou b"). The joining words come from
 * Intl.ListFormat, so no copy is hardcoded here.
 */
export function EmailList({ locale, subject, body, linkClassName }: EmailListProps) {
  const parts = new Intl.ListFormat(locale, { type: "disjunction" }).formatToParts([...site.emails]);
  return (
    <>
      {parts.map((part, i) =>
        part.type === "element" ? (
          <a key={i} href={mailto(subject, body, [part.value])} className={linkClassName}>
            {part.value}
          </a>
        ) : (
          <Fragment key={i}>{part.value}</Fragment>
        ),
      )}
    </>
  );
}
