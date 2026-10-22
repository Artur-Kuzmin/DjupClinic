/**
 * English copy. Every user-facing string on the site lives here or in fr.ts.
 * British spelling. Straight apostrophes are converted to typographic ones
 * at load time (see src/i18n/typeset.ts).
 */
const en = {
  meta: {
    siteDescription:
      "Djup Clinic is a consulting studio with two practices: fundraising and client acquisition for early-stage startups, and AI search audits for French post-bac schools.",
    home: {
      title: "Djup Clinic · Consulting for startups and schools",
      description:
        "A consulting studio with two practices. Startup Clinic helps early-stage startups raise and find customers. School Audits checks what AI tools tell students about French post-bac schools.",
    },
    startups: {
      title: "Startup Clinic",
      description:
        "Investor readiness and client acquisition for early-stage startups: pitch decks, market research, investor lists, ideal customer profiles and outreach.",
    },
    schools: {
      title: "School Audits",
      description:
        "AI search audits for French post-bac schools. We measure what ChatGPT, Perplexity and Gemini tell students about your school, fact-check it and plan the corrections.",
    },
    notFound: {
      title: "Page not found",
      description: "This page does not exist.",
    },
  },

  a11y: {
    skipToContent: "Skip to content",
    mainNav: "Main",
    languageNav: "Language",
    home: "Djup Clinic, home page",
    opensEmail: "opens your email app",
  },

  nav: {
    startups: "Startups",
    schools: "Schools",
    contact: "Contact",
  },

  practices: {
    startups: "Startup Clinic",
    schools: "School Audits",
  },

  footer: {
    tagline: "Consulting for early-stage startups and French post-bac schools.",
    practicesHeading: "Practices",
    contactHeading: "Contact",
  },

  home: {
    // Option C, chosen in review. Other options presented:
    // A: "We do the research others skip, for founders and for schools."
    // B: "We help startups raise funds and win customers, and French schools correct what AI says about them."
    // D: "Consulting for early-stage startups and French schools, built on research others skip."
    statement:
      "Fundraising and growth for early-stage startups. AI search audits for French schools.",
    illustrationAlt:
      "Pixel drawing: a sounding line and its lead weight dropping through deepening water.",
    split: {
      heading: "Choose a practice",
      startups: {
        title: "Startups",
        text: "Investor readiness and client acquisition for early-stage founders. We build the deck, the research and the lists with you.",
        items: ["Investor readiness", "Client acquisition"],
        cta: "View Startup Clinic",
      },
      schools: {
        title: "Schools",
        text: "AI search audits for French post-bac schools. We check what ChatGPT, Perplexity and Gemini tell prospective students, then plan the corrections.",
        items: ["Free snapshot", "Pilot audit", "Full audit"],
        cta: "View School Audits",
      },
    },
    principles: {
      label: "How we work",
      heading: "A small team, careful research, a clear scope.",
      items: [
        {
          title: "You work with the people doing the work.",
          text: "No hand-offs to junior staff. The people on your first call write your deck, build your lists and run your audit.",
        },
        {
          title: "Research before recommendations.",
          text: "We study your market, your competitors and your sources before we suggest a single change.",
        },
        {
          title: "Clear scope, agreed up front.",
          text: "Before we start, you know exactly what we will deliver and when.",
        },
      ],
    },
    contact: {
      label: "Contact",
      heading: "Tell us what you're working on.",
      text: "A few lines are enough. We'll tell you which practice fits, or whether neither does.",
      cta: "Email us",
      emailPrefix: "Or write directly to",
      emailSubject: "Enquiry from the website",
    },
  },

  startups: {
    hero: {
      title: "Fundraising and first customers for early-stage startups.",
    },
  },

  schools: {
    hero: {
      title: "Students ask AI about your school before they visit your website.",
    },
  },

  notFound: {
    label: "404",
    title: "This page doesn't exist.",
    text: "The link may be out of date, or the address mistyped.",
    cta: "Back to the home page",
  },
};

export type Dictionary = typeof en;
export default en;
