/**
 * Copie française. Rédigée directement en français, vouvoiement partout.
 * Les espaces insécables avant : ; ? ! et dans les guillemets sont ajoutées
 * au chargement (voir src/i18n/typeset.ts) : écrire ici des espaces normales.
 */
import type { Dictionary } from "./en";

const fr: Dictionary = {
  meta: {
    siteDescription:
      "Djup Clinic est un cabinet de conseil à deux pôles : levée de fonds et acquisition clients pour les jeunes startups, audits de visibilité IA pour les écoles post-bac.",
    home: {
      title: "Djup Clinic · Conseil pour startups et écoles",
      description:
        "Un cabinet de conseil, deux pôles. Startup Clinic aide les jeunes startups à lever des fonds et à trouver leurs clients. L'audit de visibilité IA vérifie ce que les IA disent des écoles post-bac aux futurs étudiants.",
    },
    startups: {
      title: "Startup Clinic",
      description:
        "Préparation à la levée de fonds et acquisition clients pour les jeunes startups : pitch deck, études de marché, listes d'investisseurs, profil client idéal et prospection.",
    },
    schools: {
      title: "Audit de visibilité IA",
      description:
        "Audits de visibilité IA pour les écoles post-bac. Nous mesurons ce que ChatGPT, Perplexity et Gemini disent de votre école, nous le vérifions et nous établissons le plan de correction.",
    },
    notFound: {
      title: "Page introuvable",
      description: "Cette page n'existe pas.",
    },
  },

  a11y: {
    skipToContent: "Aller au contenu",
    mainNav: "Navigation principale",
    languageNav: "Choix de la langue",
    home: "Djup Clinic, page d'accueil",
    opensEmail: "ouvre votre messagerie",
  },

  nav: {
    startups: "Startups",
    schools: "Écoles",
    contact: "Contact",
  },

  practices: {
    startups: "Startup Clinic",
    schools: "Audit de visibilité IA",
  },

  footer: {
    tagline: "Conseil pour les jeunes startups et les écoles post-bac.",
    practicesHeading: "Pôles",
    contactHeading: "Contact",
  },

  home: {
    // Variante C, retenue. Autres variantes proposées :
    // A : « Nous faisons le travail de fond que d'autres survolent, pour les startups comme pour les écoles. »
    // B : « Nous aidons les startups à lever des fonds et à trouver leurs clients, et les écoles à corriger ce que l'IA dit d'elles. »
    // D : « Du conseil pour les jeunes startups et les écoles, fondé sur le travail de fond que d'autres survolent. »
    statement:
      "Levée de fonds et croissance pour les jeunes startups. Audits de visibilité IA pour les écoles.",
    illustrationAlt:
      "Dessin en pixels : une ligne de sonde et son plomb descendant dans une eau de plus en plus profonde.",
    split: {
      heading: "Choisissez votre pôle",
      startups: {
        title: "Startups",
        text: "Préparation à la levée de fonds et acquisition clients pour les jeunes startups. Nous construisons avec vous le deck, les études et les listes.",
        items: ["Préparation à la levée", "Acquisition clients"],
        cta: "Voir l'offre Startups",
      },
      schools: {
        title: "Écoles",
        text: "Audits de visibilité IA pour les écoles post-bac. Nous vérifions ce que ChatGPT, Perplexity et Gemini répondent à vos futurs étudiants, puis nous établissons le plan de correction.",
        items: ["Diagnostic flash gratuit", "Audit pilote", "Audit complet"],
        cta: "Voir l'offre Écoles",
      },
    },
    principles: {
      label: "Notre méthode",
      heading: "Une petite équipe, une recherche rigoureuse, un périmètre clair.",
      items: [
        {
          title: "Vous travaillez avec ceux qui font le travail.",
          text: "Aucun relais vers des juniors : les personnes présentes au premier appel rédigent votre deck, construisent vos listes et mènent votre audit.",
        },
        {
          title: "La recherche avant les recommandations.",
          text: "Nous étudions votre marché, vos concurrents et vos sources avant de proposer le moindre changement.",
        },
        {
          title: "Un périmètre clair, validé en amont.",
          text: "Avant de commencer, vous savez précisément ce que nous livrons, et dans quels délais.",
        },
      ],
    },
    contact: {
      label: "Contact",
      heading: "Parlez-nous de votre projet.",
      text: "Quelques lignes suffisent. Nous vous dirons quel pôle vous correspond, ou si aucun ne convient.",
      cta: "Nous écrire",
      emailPrefix: "Ou écrivez-nous directement à",
      emailSubject: "Prise de contact depuis le site",
    },
  },

  startups: {
    hero: {
      title: "Levée de fonds et premiers clients pour les jeunes startups.",
    },
  },

  schools: {
    hero: {
      title: "Vos futurs étudiants interrogent l'IA avant de visiter votre site.",
    },
  },

  notFound: {
    label: "404",
    title: "Cette page n'existe pas.",
    text: "Le lien est peut-être ancien, ou l'adresse mal saisie.",
    cta: "Retour à l'accueil",
  },
};

export default fr;
