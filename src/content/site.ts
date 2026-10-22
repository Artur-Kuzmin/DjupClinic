/**
 * Site-wide content: name, description, navigation.
 * Page copy lives next to each page in src/content/.
 */
export const site = {
  name: "Djup Clinic",
  description:
    "Djup Clinic is a consulting studio with two practices: growth and fundraising for early-stage startups, and AI search audits for French post-bac schools.",
  practices: [
    { key: "startups", label: "Startups", name: "Startup Clinic", href: "/startups" },
    { key: "schools", label: "Schools", name: "School Audits", href: "/schools" },
  ],
} as const;
