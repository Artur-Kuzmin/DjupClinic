export type TrackKey = "investors" | "customers";
export type Testimonial = { quote: string; name: string; role: string };
type ScopeItem = { title: string; track: TrackKey };

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
      lead: "Two focused tracks for early-stage founders: getting ready for investors, and finding your first customers. We do the research and build the material with you.",
      cta: "Book a call",
      illustrationAlt:
        "Pixel drawing of a sea chart: depth contours off a coastline, and a course plotted across them.",
    },
    tracks: {
      label: "Two tracks",
      heading: "Investors or customers: start with whatever is blocking you.",
      deliverablesLabel: "What we deliver",
      items: [
        {
          key: "investors" as TrackKey,
          name: "Investor readiness",
          fit: "For founders preparing a pre-seed or seed round.",
          summary: "We make sure your deck, your story and your research hold up in front of investors.",
          deliverables: [
            { title: "Pitch deck audit and rebuild", text: "A slide-by-slide review, then a rebuilt deck." },
            {
              title: "Investor narrative",
              text: "One clear story from problem to ask, consistent across deck, emails and meetings.",
            },
            {
              title: "Market and competitor research",
              text: "Market size, segments and competitors, with sources you can cite.",
            },
            {
              title: "Investor target list",
              text: "Funds and angels that invest at your stage and in your sector, with the right person to contact.",
            },
          ],
        },
        {
          key: "customers" as TrackKey,
          name: "Client acquisition",
          fit: "For founders whose sales still come from their own network.",
          summary:
            "We work out who buys, find those people by name, and give you the messages and the system to reach them.",
          deliverables: [
            {
              title: "Ideal customer profile (ICP)",
              text: "Who buys, who decides, and the problem that makes them act.",
            },
            {
              title: "Qualified prospect lists",
              text: "Companies that match the profile, with named decision makers.",
            },
            {
              title: "Outreach sequences and templates",
              text: "Multi-step sequences and message templates, written for each segment.",
            },
            {
              title: "CRM sheet",
              text: "A simple tracking sheet, set up so you can run the pipeline yourself.",
            },
          ],
        },
      ],
    },
    approach: {
      label: "Approach",
      heading: "The same four steps, whichever track you choose.",
      steps: [
        {
          title: "Diagnose",
          text: "A first call and a review of what you already have: deck, data, pipeline, past outreach. We agree the scope in writing before any work starts.",
        },
        {
          title: "Research",
          text: "Market, competitors, investors or buyers, depending on the track. Every finding comes with its source.",
        },
        {
          title: "Build",
          text: "We write and design the material with you, in short review rounds.",
        },
        {
          title: "Hand over",
          text: "A walkthrough of every deliverable, so your team can use and update it without us.",
        },
      ],
    },
    caseStudy: {
      label: "Case study",
      tag: "Founding pilot client",
      name: "ReBound Nordic",
      intro:
        "ReBound Nordic helps companies recover the VAT they pay on business expenses abroad. As our founding pilot client, they worked with us across both tracks.",
      scopeLabel: "Scope",
      scope: [
        { title: "Pitch deck audit and rebuild", track: "investors" },
        { title: "Market and competitor research", track: "investors" },
        { title: "Investor strategy", track: "investors" },
        { title: "Ideal customer profile (ICP)", track: "customers" },
        { title: "Outreach strategy and templates", track: "customers" },
      ] as ScopeItem[],
      approachLabel: "Approach",
      approach: [
        "We started with the deck: a slide-by-slide audit, then a rebuild around one clear investor narrative. The market and competitor research fed both the deck and the investor strategy.",
        "On the customer side, we defined the ideal customer profile with the team, then wrote the outreach strategy and message templates for each segment.",
      ],
      // Fill in once ReBound Nordic approves a quote. Until then the page shows a marked slot.
      testimonial: null as Testimonial | null,
      logoAlt: "ReBound Nordic logo",
      slots: {
        testimonialLabel: "Testimonial slot",
        testimonialText: "Reserved for a quote from ReBound Nordic, added once they approve it.",
        logoLabel: "Logo slot",
        logoText: "ReBound Nordic logo",
      },
    },
    cta: {
      label: "Next step",
      heading: "Tell us where the company is, and what's blocking the next step.",
      text: "Send a few lines about your company and your next milestone. We'll reply with times for a call.",
      button: "Book a call",
      emailPrefix: "Or write directly to",
      emailSubject: "Startup Clinic: booking a call",
      emailBody: "Company:\nStage:\nNext milestone:\n",
    },
  },

  schools: {
    hero: {
      title: "Students ask AI about your school before they visit your website.",
      lead: "We measure what ChatGPT, Perplexity and Gemini tell students about your school, check it against your official information, and give you a plan to correct what's wrong.",
      cta: "Request your free snapshot",
      illustrationAlt: "Pixel drawing of an AI answer: one line struck through, and its correction underlined.",
    },
    problem: {
      label: "The problem",
      heading: "The answers are often out of date, or simply wrong.",
      text: "AI tools assemble answers from whatever they find: old brochures, past rankings, forum threads, other schools' pages. A student comparing programmes rarely checks the source, and remembers what they read.",
      listLabel: "What we check",
      items: [
        { title: "Programmes", text: "Closed, renamed or merged programmes still described as open." },
        { title: "Degree level", text: "A Bac+3 presented as a Bac+5, or the other way round." },
        {
          title: "Accreditation",
          text: "Grade de licence or grade de master, RNCP level, visa: claimed wrongly, left out, or attached to the wrong programme.",
        },
        {
          title: "Admission routes",
          text: "Parcoursup instead of your own concours, or the reverse, with deadlines from a past year.",
        },
        { title: "Tuition fees", text: "Fees from a past year, or another school's." },
        { title: "Rankings", text: "Old rankings, positions from another list, or rankings that do not exist." },
        { title: "Campuses", text: "Closed or moved campuses, and cities you have never taught in." },
        { title: "Name mix-ups", text: "Your school confused with another that has a similar name." },
      ],
    },
    method: {
      label: "What we do",
      heading: "Measure, check, correct.",
      steps: [
        {
          title: "Measure",
          text: "We ask ChatGPT, Perplexity and Gemini the questions prospective students actually ask about your school, and record every answer.",
        },
        {
          title: "Fact-check",
          text: "We check each claim against your official sources and mark it correct, outdated, wrong or missing.",
        },
        {
          title: "Correction plan",
          text: "You get a prioritised list of fixes: what to change on your own site, and which public sources the AI tools draw on.",
        },
      ],
    },
    process: {
      label: "How it works",
      heading: "Start with a free snapshot. Go further only if it's useful.",
      receiveLabel: "You receive",
      steps: [
        {
          title: "Free snapshot",
          text: "A sample of real questions, what each AI answered, and the most visible errors.",
          receive: "A one-page summary, free and with no commitment.",
        },
        {
          title: "Pilot audit",
          text: "A complete audit of one part of your offer, such as a programme or a campus.",
          receive: "A fact-checked report and the first corrections.",
        },
        {
          title: "Full audit",
          text: "Every programme and campus, across all three AI tools.",
          receive: "A full report and a prioritised correction plan for your team.",
        },
      ],
    },
    cta: {
      label: "Free snapshot",
      heading: "See what AI tells students about your school.",
      text: "Send us your school's name and website. We'll reply with a one-page snapshot, free of charge.",
      button: "Request your free snapshot",
      emailPrefix: "Or write directly to",
      emailSubject: "Free snapshot request",
      emailBody: "School:\nWebsite:\nName and role:\n",
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
