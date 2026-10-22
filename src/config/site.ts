/**
 * Site-wide settings that do not change with language.
 * Copy lives in src/i18n/dictionaries; this file holds data only.
 */

function resolveSiteUrl(): string {
  if (process.env.SITE_URL) return process.env.SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return "http://localhost:3000";
}

export const site = {
  name: "Djup Clinic",
  /**
   * PLACEHOLDER: replace with the studio's real address before launch.
   * Every "Email us", "Book a call" and snapshot request uses it.
   */
  email: "hello@djupclinic.com",
  /** Absolute origin used for canonical and hreflang URLs. Set SITE_URL in production. */
  url: resolveSiteUrl(),
} as const;

/** Builds a mailto: link with an optional prefilled subject and body. */
export function mailto(subject?: string, body?: string): string {
  const params = new URLSearchParams();
  if (subject) params.set("subject", subject);
  if (body) params.set("body", body);
  const query = params.toString().replace(/\+/g, "%20");
  return `mailto:${site.email}${query ? `?${query}` : ""}`;
}
