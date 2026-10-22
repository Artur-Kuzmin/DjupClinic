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
   * Contact addresses. Every "Email us", "Book a call" and snapshot request
   * opens one prefilled email addressed to all of them.
   */
  emails: ["a_kuzmin@stu-psbedu.paris", "g_minigulov@stu-psbedu.paris"],
  /** Absolute origin used for canonical and hreflang URLs. Set SITE_URL in production. */
  url: resolveSiteUrl(),
  /**
   * Shows clearly marked empty slots where approved content is still missing
   * (the ReBound Nordic testimonial and logo). Off until the client approves;
   * content added to the dictionaries and caseStudies appears regardless.
   */
  showPlaceholderSlots: false,
} as const;

type Logo = { src: string; width: number; height: number };

/** Client assets that need approval before they appear on the site. */
export const caseStudies: { reboundNordic: { logo: Logo | null } } = {
  reboundNordic: {
    // Once approved: { src: "/clients/rebound-nordic.svg", width: 160, height: 40 }
    logo: null,
  },
};

/**
 * Builds a mailto: link with an optional prefilled subject and body.
 * Addressed to every contact unless specific recipients are given.
 */
export function mailto(subject?: string, body?: string, to: readonly string[] = site.emails): string {
  const params = new URLSearchParams();
  if (subject) params.set("subject", subject);
  if (body) params.set("body", body);
  const query = params.toString().replace(/\+/g, "%20");
  return `mailto:${to.join(",")}${query ? `?${query}` : ""}`;
}
