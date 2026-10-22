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
        "Un cabinet de conseil, deux pôles. Startup Clinic aide les jeunes startups à lever des fonds et à trouver leurs clients. L'audit de visibilité IA vérifie ce que les assistants IA disent des écoles post-bac aux futurs étudiants.",
    },
    startups: {
      title: "Startup Clinic",
      description:
        "Préparation à la levée de fonds et acquisition clients pour les jeunes startups : pitch deck, études de marché, listes d'investisseurs, profil client idéal et prospection.",
    },
    schools: {
      title: "Audit de visibilité IA",
      description:
        "Audits de visibilité IA pour les écoles post-bac. Nous vérifions ce que les principaux assistants IA utilisés par les étudiants, de ChatGPT aux AI Overviews de Google, disent de votre école, et nous établissons le plan de correction.",
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
        cta: "Découvrir Startup Clinic",
      },
      schools: {
        title: "Écoles",
        text: "Audits de visibilité IA pour les écoles post-bac. Nous vérifions ce que les principaux assistants IA répondent à vos futurs étudiants, puis nous établissons le plan de correction.",
        items: ["Diagnostic flash gratuit", "Audit pilote", "Audit complet"],
        cta: "Découvrir l'audit de visibilité IA",
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
      lead: "Deux volets ciblés pour les fondateurs en phase de démarrage : se préparer aux investisseurs, et trouver ses premiers clients. Nous menons les recherches et construisons les livrables avec vous.",
      cta: "Réserver un appel",
      illustrationAlt:
        "Dessin en pixels d'une carte marine : des isobathes au large d'une côte, et une route tracée qui les traverse.",
    },
    tracks: {
      label: "Deux volets",
      heading: "Investisseurs ou clients : commencez par ce qui vous bloque.",
      deliverablesLabel: "Ce que nous livrons",
      items: [
        {
          key: "investors",
          name: "Préparation à la levée",
          fit: "Pour les fondateurs qui préparent un tour de pré-amorçage ou d'amorçage.",
          summary:
            "Nous faisons en sorte que votre deck, votre récit et vos recherches tiennent face aux investisseurs.",
          deliverables: [
            {
              title: "Audit et refonte du pitch deck",
              text: "Une revue slide par slide, puis un deck entièrement retravaillé.",
            },
            {
              title: "Récit investisseur",
              text: "Un fil conducteur clair, du problème au montant recherché, cohérent dans le deck, les e-mails et les rendez-vous.",
            },
            {
              title: "Étude de marché et de la concurrence",
              text: "Taille de marché, segments et concurrents, avec des sources que vous pouvez citer.",
            },
            {
              title: "Liste d'investisseurs cibles",
              text: "Les fonds et business angels qui investissent à votre stade et dans votre secteur, avec le bon interlocuteur à contacter.",
            },
          ],
        },
        {
          key: "customers",
          name: "Acquisition clients",
          fit: "Pour les fondateurs dont les ventes viennent encore de leur propre réseau.",
          summary:
            "Nous identifions qui achète, nous trouvons ces personnes nommément, et nous vous donnons les messages et l'outil pour les contacter.",
          deliverables: [
            {
              title: "Profil client idéal (ICP)",
              text: "Qui achète, qui décide, et le problème qui les pousse à agir.",
            },
            {
              title: "Listes de prospects qualifiés",
              text: "Des entreprises qui correspondent au profil, avec les décideurs identifiés nommément.",
            },
            {
              title: "Séquences de prospection et modèles",
              text: "Des séquences en plusieurs étapes et des modèles de messages, rédigés pour chaque segment.",
            },
            {
              title: "Fichier CRM",
              text: "Un tableau de suivi simple, prêt à l'emploi, pour piloter votre pipeline vous-même.",
            },
          ],
        },
      ],
    },
    approach: {
      label: "Démarche",
      heading: "Les mêmes quatre étapes, quel que soit le volet choisi.",
      steps: [
        {
          title: "Diagnostic",
          text: "Un premier appel et une revue de l'existant : deck, données, pipeline, prospection passée. Le périmètre est validé par écrit avant tout démarrage.",
        },
        {
          title: "Recherche",
          text: "Marché, concurrents, investisseurs ou acheteurs, selon le volet. Chaque information est sourcée.",
        },
        {
          title: "Construction",
          text: "Nous rédigeons et concevons les livrables avec vous, par courtes boucles de relecture.",
        },
        {
          title: "Passation",
          text: "Une présentation de chaque livrable, pour que votre équipe puisse l'utiliser et le faire évoluer sans nous.",
        },
      ],
    },
    caseStudy: {
      label: "Étude de cas",
      tag: "Premier client pilote",
      name: "ReBound Nordic",
      intro:
        "ReBound Nordic aide les entreprises à récupérer la TVA payée sur leurs frais professionnels à l'étranger. Premier client pilote du cabinet, la startup nous a confié des missions sur les deux volets.",
      scopeLabel: "Périmètre",
      scope: [
        { title: "Audit et refonte du pitch deck", track: "investors" },
        { title: "Étude de marché et de la concurrence", track: "investors" },
        { title: "Stratégie investisseurs", track: "investors" },
        { title: "Profil client idéal (ICP)", track: "customers" },
        { title: "Stratégie de prospection et modèles de messages", track: "customers" },
      ],
      approachLabel: "Démarche",
      approach: [
        "Nous avons commencé par le deck : un audit slide par slide, puis une refonte autour d'un récit investisseur clair. L'étude de marché et de la concurrence a nourri à la fois le deck et la stratégie investisseurs.",
        "Côté clients, nous avons défini le profil client idéal avec l'équipe, puis rédigé la stratégie de prospection et des modèles de messages pour chaque segment.",
      ],
      // À compléter une fois la citation validée par ReBound Nordic.
      testimonial: null,
      logoAlt: "Logo de ReBound Nordic",
      slots: {
        testimonialLabel: "Emplacement témoignage",
        testimonialText: "Réservé à une citation de ReBound Nordic, ajoutée après sa validation.",
        logoLabel: "Emplacement logo",
        logoText: "Logo de ReBound Nordic",
      },
    },
    cta: {
      label: "Prochaine étape",
      heading: "Dites-nous où en est votre entreprise, et ce qui bloque la prochaine étape.",
      text: "Quelques lignes sur votre entreprise et votre prochain jalon suffisent. Nous vous répondrons avec des créneaux pour un appel.",
      button: "Réserver un appel",
      emailPrefix: "Ou écrivez-nous directement à",
      emailSubject: "Startup Clinic : demande d'appel",
      emailBody: "Entreprise :\nStade :\nProchain jalon :\n",
    },
  },

  schools: {
    hero: {
      title: "Vos futurs étudiants interrogent l'IA avant de visiter votre site.",
      lead: "Nous mesurons ce que disent de votre école les principaux assistants IA utilisés par les étudiants (ChatGPT, Perplexity, Gemini, les AI Overviews de Google et d'autres). Puis nous le confrontons à vos informations officielles et vous remettons un plan pour corriger ce qui est faux.",
      cta: "Demander votre diagnostic gratuit",
      illustrationAlt: "Dessin en pixels d'une réponse d'IA : une ligne barrée, et sa correction soulignée.",
    },
    problem: {
      label: "Le constat",
      heading: "Les réponses sont souvent datées, voire fausses.",
      text: "Les assistants IA assemblent leurs réponses à partir de ce qu'ils trouvent : anciennes brochures, classements passés, forums, pages d'autres écoles. Un futur étudiant qui compare des programmes vérifie rarement la source, et retient ce qu'il a lu.",
      listLabel: "Ce que nous vérifions",
      items: [
        { title: "Programmes", text: "Des programmes fermés, renommés ou fusionnés, toujours présentés comme ouverts." },
        { title: "Niveau de diplôme", text: "Un Bac+3 présenté comme un Bac+5, ou l'inverse." },
        {
          title: "Reconnaissance des diplômes",
          text: "Grade de licence ou de master, niveau RNCP, visa : revendiqués à tort, oubliés ou attribués au mauvais programme.",
        },
        {
          title: "Voies d'admission",
          text: "Parcoursup au lieu de votre concours, ou l'inverse, avec les dates d'une année passée.",
        },
        { title: "Frais de scolarité", text: "Les montants d'une année passée, ou ceux d'une autre école." },
        {
          title: "Classements",
          text: "Des classements anciens, des positions tirées d'une autre liste, voire des classements qui n'existent pas.",
        },
        { title: "Campus", text: "Des campus fermés ou déménagés, et des villes où vous n'avez jamais enseigné." },
        { title: "Homonymes", text: "Votre école confondue avec une autre au nom proche." },
      ],
    },
    method: {
      label: "Notre intervention",
      heading: "Mesurer, vérifier, corriger.",
      steps: [
        {
          title: "Mesure",
          text: "Nous posons aux principaux assistants IA les questions que vos futurs étudiants posent réellement sur votre école, et nous archivons chaque réponse.",
        },
        {
          title: "Vérification",
          text: "Nous confrontons chaque affirmation à vos sources officielles et la classons : exacte, obsolète, fausse ou manquante.",
        },
        {
          title: "Plan de correction",
          text: "Vous recevez une liste de corrections hiérarchisée : ce qu'il faut modifier sur votre site, et les sources publiques sur lesquelles s'appuient ces assistants.",
        },
      ],
    },
    process: {
      label: "Déroulement",
      heading: "Commencez par un diagnostic flash gratuit. Allez plus loin seulement si c'est utile.",
      receiveLabel: "Vous recevez",
      steps: [
        {
          title: "Diagnostic flash gratuit",
          text: "Un échantillon de vraies questions, les réponses de chaque IA et les erreurs les plus visibles.",
          receive: "Une synthèse d'une page, gratuite et sans engagement.",
        },
        {
          title: "Audit pilote",
          text: "Un audit complet d'un programme ou d'un campus.",
          receive: "Un rapport vérifié et les premières corrections.",
        },
        {
          title: "Audit complet",
          text: "Tous vos programmes et campus, sur les principaux assistants IA utilisés par les étudiants.",
          receive: "Un rapport complet et un plan de correction hiérarchisé pour vos équipes.",
        },
      ],
    },
    cta: {
      label: "Prochaine étape",
      heading: "Découvrez ce que l'IA dit de votre école à vos futurs étudiants.",
      text: "Envoyez-nous le nom et le site de votre école. Nous vous répondrons avec un diagnostic flash d'une page, gratuit.",
      button: "Demander votre diagnostic gratuit",
      emailPrefix: "Ou écrivez-nous directement à",
      emailSubject: "Demande de diagnostic flash gratuit",
      emailBody: "École :\nSite web :\nNom et fonction :\n",
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
