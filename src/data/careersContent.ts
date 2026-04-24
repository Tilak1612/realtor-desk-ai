// Careers page role data — split out of Careers.tsx so FR translations
// don't bloat src/i18n/config.ts. The i18n config still owns page
// chrome / form labels / validation messages via the `careersPage.*`
// namespace; this file owns the 8 role listings.
//
// Quebec-FR terminology follows memory/bilingual_glossary.md:
// - courtier (not agent), courriel (not e-mail), relance (follow-up),
//   pipeline (left as-is), LPRPDE (PIPEDA), SDD de l'ACI (CREA DDF).
// - Sentence case on section titles.

import type { SupportedLocale } from "@/lib/i18n/format";

export type RoleCategory = "engineering" | "sales-cs" | "marketing" | "operations";

export interface Role {
  id: string;
  title: string;
  category: RoleCategory;
  mission: string;
  responsibilities: string[];
  qualifications: string[];
  hiringNow?: boolean;
}

export interface PriorityRole {
  roleId: string;
  why: string;
}

export interface CareersContent {
  roles: Role[];
  priorityRoles: PriorityRole[];
}

const EN: CareersContent = {
  roles: [
    {
      id: "full-stack-engineer-ai-backend",
      title: "Full-Stack Engineer (AI/Backend Focus)",
      category: "engineering",
      hiringNow: true,
      mission:
        "Build and maintain the core Realtor Desk platform — from AI-powered lead response pipelines to CRM automation workflows. You'll work across our stack to ship features that help Canadian real estate agents close more deals with less manual work.",
      responsibilities: [
        "Build and scale backend APIs powering AI lead response, contact management, and automation triggers",
        "Integrate with third-party platforms (CREA DDF/MLS, Brevo, Twilio, Stripe)",
        "Maintain AWS Canada infrastructure with a focus on data residency and PIPEDA compliance",
        "Implement AI/LLM workflows for lead qualification, follow-up sequencing, and property matching",
        "Write clean, well-tested code and participate in code reviews",
        "Optimize platform performance to maintain sub-60-second AI response times",
        "Collaborate directly with the founder on feature prioritization and architecture decisions",
      ],
      qualifications: [
        "3+ years with Node.js, Python, or similar backend stack",
        "Experience with relational + NoSQL databases (PostgreSQL, DynamoDB, or similar)",
        "Familiarity with OpenAI/Anthropic APIs or LLM integrations",
        "Comfort working in a fast-moving startup where you wear multiple hats",
        "Bonus: Experience in PropTech, SaaS, or Canadian compliance frameworks",
      ],
    },
    {
      id: "frontend-engineer-react-next",
      title: "Frontend Engineer (React/Next.js)",
      category: "engineering",
      mission:
        "Own the visual and interactive layer of Realtor Desk — the dashboards, pipelines, and workflows that agents use every day. You care deeply about UX and build interfaces that feel fast, intuitive, and polished for non-technical users.",
      responsibilities: [
        "Build responsive, accessible UI components in React/Next.js following our brand guidelines",
        "Develop the agent-facing CRM dashboard, lead inbox, pipeline views, and reporting screens",
        "Implement real-time features (live lead alerts, conversation feeds) using WebSockets or SSE",
        "Collaborate closely with the backend team on API contracts and data flows",
        "Optimize for mobile responsiveness for agents using the platform in the field",
        "Ensure bilingual (EN/FR) support is built into UI components for the Quebec market",
      ],
      qualifications: [
        "2+ years in React and/or Next.js",
        "Strong CSS/Tailwind skills and an eye for detail in UI design",
        "Experience consuming REST or GraphQL APIs",
        "Ability to work independently without a dedicated design team",
        "Bonus: Experience with Framer, Figma-to-code workflows, or building SaaS dashboards",
      ],
    },
    {
      id: "qa-devops-engineer",
      title: "QA & DevOps Engineer",
      category: "engineering",
      mission:
        "Keep Realtor Desk reliable, secure, and fast as we scale. You'll own our CI/CD pipelines, cloud infrastructure, and testing frameworks — making sure every release is smooth and every agent's data is protected.",
      responsibilities: [
        "Manage and optimize AWS Canada infrastructure (ECS, RDS, Lambda, S3)",
        "Build and maintain CI/CD pipelines (GitHub Actions or similar)",
        "Write automated test suites (unit, integration, end-to-end)",
        "Monitor system health, uptime, and performance metrics; set up alerting",
        "Enforce security best practices aligned with PIPEDA and SOC 2 requirements",
        "Manage environment configurations across dev, staging, and production",
      ],
      qualifications: [
        "2+ years in DevOps or cloud infrastructure roles",
        "Hands-on AWS experience (certifications a plus)",
        "Familiarity with Docker, Kubernetes, or serverless architectures",
        "Experience with monitoring tools (Datadog, CloudWatch, Sentry)",
        "Bonus: Experience with compliance-focused environments (PIPEDA, SOC 2, HIPAA)",
      ],
    },
    {
      id: "customer-success-manager",
      title: "Customer Success Manager (Real Estate Focus)",
      category: "sales-cs",
      hiringNow: true,
      mission:
        "Be the human anchor that keeps our agents successful and retained. You'll onboard new real estate professionals onto the platform, train them on AI automation features, and proactively prevent churn by turning hesitant realtors into power users.",
      responsibilities: [
        "Own the full onboarding journey from signup to first AI-assisted lead follow-up",
        "Conduct 1:1 and group training sessions via video call and pre-recorded walkthroughs",
        "Monitor usage metrics and proactively reach out to at-risk accounts",
        "Gather product feedback from agents and communicate it clearly to the product team",
        "Build a library of reusable onboarding resources (guides, videos, FAQ docs)",
        "Support renewal and upsell conversations in collaboration with sales",
        "Handle inbound support tickets with a focus on fast, empathetic resolution",
      ],
      qualifications: [
        "2+ years in customer success or account management for a B2B SaaS product",
        "Strong communication skills — both written and on video/phone",
        "Comfortable learning and explaining technical products to non-technical users",
        "Highly organized, self-directed, and comfortable in ambiguous startup environments",
        "Bonus: Background in or direct exposure to Canadian real estate industry",
      ],
    },
    {
      id: "sales-development-representative",
      title: "Sales Development Representative (SDR)",
      category: "sales-cs",
      hiringNow: true,
      mission:
        "Fill the top of our pipeline by connecting with Canadian real estate agents, teams, and brokerages who are frustrated with slow follow-ups and overpriced US-built tools. You'll be the first voice of Realtor Desk for many prospects.",
      responsibilities: [
        "Prospect and qualify leads across Canadian real estate agent communities (Facebook Groups, LinkedIn, CREA directories, brokerage networks)",
        "Run outbound email, LinkedIn, and phone outreach sequences",
        "Book demo calls for the founder or account executive",
        "Manage and track all activity accurately in the CRM (yes, you'll use our own product)",
        "Develop scripts and messaging that speak directly to Canadian agent pain points",
        "Attend virtual real estate events and webinars to generate leads",
        "Report weekly on pipeline activity and conversion metrics",
      ],
      qualifications: [
        "1+ years in SaaS sales, SDR, or business development role",
        "Excellent written communication — you know how to write a cold email that gets opened",
        "Comfortable with rejection and motivated by results",
        "Familiarity with the Canadian real estate market is a strong asset",
        "Bonus: Experience selling to small business owners or professional services clients",
      ],
    },
    {
      id: "growth-marketer-demand-generation",
      title: "Growth Marketer / Demand Generation",
      category: "marketing",
      hiringNow: true,
      mission:
        "Drive qualified traffic and leads into the Realtor Desk funnel through SEO, paid campaigns, email marketing, and content distribution. You understand what makes a Canadian realtor click, sign up, and stay.",
      responsibilities: [
        "Own and execute multi-channel demand generation: SEO/blog, paid social (Facebook, Instagram, LinkedIn), email sequences via Brevo",
        "Manage and optimize Google Ads and Meta Ads campaigns targeting Canadian real estate agents",
        "Build and A/B test landing pages, email subject lines, and ad creatives",
        "Maintain our editorial calendar across 50+ planned blog posts targeting Canadian real estate keywords",
        "Track funnel performance (MQLs, CPL, CAC) and report weekly with actionable insights",
        "Collaborate with SDR and CS teams to align messaging across the funnel",
        "Support local SEO strategy for city-specific pages (Toronto, Vancouver, Calgary, Montreal)",
      ],
      qualifications: [
        "2+ years in growth marketing or demand generation for a B2B SaaS product",
        "Hands-on experience with Google Ads, Meta Ads, and email marketing platforms",
        "Strong analytical skills — you make decisions based on data, not gut feel",
        "Excellent writing skills for producing or editing Canadian real estate content",
        "Bonus: Experience in Canadian digital advertising, bilingual content (EN/FR), or PropTech",
      ],
    },
    {
      id: "content-writer-seo-specialist",
      title: "Content Writer / SEO Specialist",
      category: "marketing",
      mission:
        "Build Realtor Desk's authority in the Canadian real estate space through high-quality, search-optimized content that helps agents solve real problems — and naturally leads them to discover our platform.",
      responsibilities: [
        "Research and write 4–8 long-form blog posts per month targeting Canadian real estate SEO keywords",
        "Optimize all content for on-page SEO (title tags, meta descriptions, internal linking, schema)",
        "Develop city-specific landing page copy for major Canadian markets",
        "Write email newsletter content, social media captions, and short-form ad copy",
        "Conduct keyword research using Ahrefs, Semrush, or similar tools",
        "Repurpose blog content into LinkedIn posts, Twitter threads, and YouTube scripts",
      ],
      qualifications: [
        "2+ years writing long-form SEO content, preferably in SaaS or real estate",
        "Strong understanding of on-page and technical SEO fundamentals",
        "Ability to write in a clear, professional, and relatable voice for Canadian realtors",
        "Experience using keyword research and content performance tools",
        "Bonus: Bilingual writing in English and French",
      ],
    },
    {
      id: "operations-partnerships-manager",
      title: "Operations & Partnerships Manager",
      category: "operations",
      mission:
        "Keep the business running smoothly and build strategic relationships with Canadian real estate associations, brokerages, and technology partners that expand Realtor Desk's reach and credibility.",
      responsibilities: [
        "Manage internal workflows, vendor relationships, and operational processes",
        "Identify and pursue partnership opportunities with brokerages, CREA chapters, and real estate coaches",
        "Coordinate product launches, campaigns, and cross-functional initiatives",
        "Draft partnership proposals, co-marketing agreements, and referral program structures",
        "Track business KPIs and prepare regular reporting for leadership",
        "Support hiring, contractor onboarding, and team coordination as we scale",
      ],
      qualifications: [
        "3+ years in operations, business development, or strategy roles",
        "Strong project management skills (Notion, Linear, Asana, or similar)",
        "Excellent relationship-building and written communication skills",
        "Comfortable working in a startup with no defined playbook",
        "Bonus: Existing network in Canadian real estate or PropTech",
      ],
    },
  ],
  priorityRoles: [
    {
      roleId: "full-stack-engineer-ai-backend",
      why: "Without core platform reliability and AI pipeline performance, everything else breaks. This is the technical foundation.",
    },
    {
      roleId: "customer-success-manager",
      why: "Early churn kills SaaS startups. A dedicated CSM converts trial users into loyal paying customers and captures the product feedback loop needed to improve fast.",
    },
    {
      roleId: "sales-development-representative",
      why: "You need qualified pipeline. An SDR generates demos consistently and tests messaging in the market — giving you real signal on who your best-fit customer is.",
    },
    {
      roleId: "growth-marketer-demand-generation",
      why: "Organic and paid acquisition need to be running in parallel with outbound. This role owns the top-of-funnel engine and reduces CAC over time through compounding SEO and paid efficiency.",
    },
  ],
};

const FR: CareersContent = {
  roles: [
    {
      id: "full-stack-engineer-ai-backend",
      title: "Ingénieur·e full-stack (IA / Back-end)",
      category: "engineering",
      hiringNow: true,
      mission:
        "Développer et entretenir la plateforme Realtor Desk — des pipelines de réponse IA aux prospects jusqu'aux flux d'automatisation du CRM. Vous travaillerez à travers notre pile pour livrer des fonctionnalités qui aident les courtiers immobiliers canadiens à conclure plus de transactions avec moins de travail manuel.",
      responsibilities: [
        "Concevoir et faire évoluer les API back-end qui alimentent la réponse IA aux prospects, la gestion des contacts et les déclencheurs d'automatisation",
        "Intégrer des plateformes tierces (SDD de l'ACI / MLS, Brevo, Twilio, Stripe)",
        "Entretenir l'infrastructure AWS Canada en mettant l'accent sur la résidence des données et la conformité LPRPDE",
        "Mettre en œuvre des flux IA/LLM pour la qualification des prospects, les séquences de relance et l'appariement de propriétés",
        "Rédiger du code propre, bien testé, et participer aux revues de code",
        "Optimiser la performance de la plateforme pour maintenir des temps de réponse IA sous 60 secondes",
        "Collaborer directement avec le fondateur sur la priorisation des fonctionnalités et les décisions d'architecture",
      ],
      qualifications: [
        "Plus de 3 ans avec Node.js, Python ou une pile back-end similaire",
        "Expérience avec des bases de données relationnelles et NoSQL (PostgreSQL, DynamoDB ou similaire)",
        "Familiarité avec les API OpenAI/Anthropic ou les intégrations LLM",
        "À l'aise dans une jeune pousse au rythme rapide où vous portez plusieurs chapeaux",
        "Atout : expérience en PropTech, SaaS ou cadres de conformité canadiens",
      ],
    },
    {
      id: "frontend-engineer-react-next",
      title: "Ingénieur·e front-end (React / Next.js)",
      category: "engineering",
      mission:
        "Posséder la couche visuelle et interactive de Realtor Desk — les tableaux de bord, les pipelines et les flux de travail que les courtiers utilisent au quotidien. Vous accordez une grande importance à l'expérience utilisateur et construisez des interfaces rapides, intuitives et soignées pour des utilisateurs non techniques.",
      responsibilities: [
        "Construire des composants d'interface réactifs et accessibles en React/Next.js selon nos règles de marque",
        "Développer le tableau de bord CRM pour les courtiers, la boîte de réception des prospects, les vues pipeline et les écrans de rapports",
        "Mettre en œuvre des fonctionnalités en temps réel (alertes prospects en direct, fils de conversation) avec WebSockets ou SSE",
        "Collaborer étroitement avec l'équipe back-end sur les contrats d'API et les flux de données",
        "Optimiser la réactivité mobile pour les courtiers qui utilisent la plateforme sur le terrain",
        "S'assurer que le soutien bilingue (FR/EN) est intégré aux composants d'interface pour le marché québécois",
      ],
      qualifications: [
        "Plus de 2 ans en React et/ou Next.js",
        "Solides compétences en CSS/Tailwind et un œil pour les détails en conception d'interface",
        "Expérience dans la consommation d'API REST ou GraphQL",
        "Capacité de travailler de manière autonome sans équipe de design dédiée",
        "Atout : expérience avec Framer, les flux Figma-to-code ou la construction de tableaux de bord SaaS",
      ],
    },
    {
      id: "qa-devops-engineer",
      title: "Ingénieur·e AQ et DevOps",
      category: "engineering",
      mission:
        "Garder Realtor Desk fiable, sécurisée et rapide à mesure que nous évoluons. Vous serez responsable de nos pipelines CI/CD, de notre infrastructure infonuagique et de nos cadres de tests — pour que chaque livraison se passe bien et que les données de chaque courtier soient protégées.",
      responsibilities: [
        "Gérer et optimiser l'infrastructure AWS Canada (ECS, RDS, Lambda, S3)",
        "Construire et entretenir les pipelines CI/CD (GitHub Actions ou similaire)",
        "Rédiger des suites de tests automatisés (unitaires, d'intégration, de bout en bout)",
        "Surveiller la santé du système, la disponibilité et les métriques de performance ; configurer les alertes",
        "Faire respecter les bonnes pratiques de sécurité alignées sur les exigences LPRPDE et SOC 2",
        "Gérer les configurations d'environnement entre dev, préproduction et production",
      ],
      qualifications: [
        "Plus de 2 ans en DevOps ou en infrastructure infonuagique",
        "Expérience pratique AWS (certifications un plus)",
        "Familiarité avec Docker, Kubernetes ou les architectures sans serveur",
        "Expérience avec des outils de surveillance (Datadog, CloudWatch, Sentry)",
        "Atout : expérience dans des environnements axés sur la conformité (LPRPDE, SOC 2, HIPAA)",
      ],
    },
    {
      id: "customer-success-manager",
      title: "Gestionnaire de succès client (domaine immobilier)",
      category: "sales-cs",
      hiringNow: true,
      mission:
        "Être l'ancrage humain qui garde nos courtiers performants et fidèles. Vous intégrerez les nouveaux professionnels de l'immobilier à la plateforme, les formerez aux fonctionnalités d'automatisation IA et préviendrez activement le désabonnement en transformant les courtiers hésitants en utilisateurs chevronnés.",
      responsibilities: [
        "Posséder le parcours d'intégration complet, de l'inscription à la première relance assistée par IA",
        "Animer des séances de formation 1:1 et de groupe par visioconférence et tutoriels préenregistrés",
        "Surveiller les métriques d'utilisation et contacter de façon proactive les comptes à risque",
        "Recueillir les commentaires des courtiers et les communiquer clairement à l'équipe produit",
        "Bâtir une bibliothèque de ressources d'intégration réutilisables (guides, vidéos, foires aux questions)",
        "Soutenir les conversations de renouvellement et de montée en gamme en collaboration avec les ventes",
        "Traiter les billets de soutien entrants avec un souci de résolution rapide et empathique",
      ],
      qualifications: [
        "Plus de 2 ans en succès client ou en gestion de comptes pour un produit SaaS B2B",
        "Solides compétences en communication — à l'écrit comme en vidéo/téléphone",
        "À l'aise pour apprendre et expliquer des produits techniques à des utilisateurs non techniques",
        "Très organisé·e, autonome et à l'aise dans un environnement de jeune pousse ambigu",
        "Atout : antécédents ou exposition directe à l'industrie immobilière canadienne",
      ],
    },
    {
      id: "sales-development-representative",
      title: "Représentant·e au développement des ventes (SDR)",
      category: "sales-cs",
      hiringNow: true,
      mission:
        "Remplir le haut de notre pipeline en joignant les courtiers, les équipes et les agences immobilières canadiennes qui en ont assez des relances lentes et des outils américains hors de prix. Vous serez la première voix de Realtor Desk pour de nombreux clients potentiels.",
      responsibilities: [
        "Prospecter et qualifier des prospects dans les communautés de courtiers canadiens (groupes Facebook, LinkedIn, répertoires de l'ACI, réseaux d'agences)",
        "Exécuter des séquences de prospection par courriel, LinkedIn et téléphone",
        "Réserver des appels de démonstration pour le fondateur ou le cadre de comptes",
        "Gérer et suivre avec exactitude toute l'activité dans le CRM (oui, vous utiliserez notre propre produit)",
        "Développer des scripts et des messages qui parlent directement aux irritants des courtiers canadiens",
        "Assister à des événements et webinaires virtuels du secteur pour générer des prospects",
        "Produire un rapport hebdomadaire d'activité pipeline et de métriques de conversion",
      ],
      qualifications: [
        "Au moins 1 an en ventes SaaS, SDR ou développement des affaires",
        "Excellente communication écrite — vous savez rédiger un courriel à froid qui se fait ouvrir",
        "À l'aise avec le rejet et motivé·e par les résultats",
        "La familiarité avec le marché immobilier canadien est un atout important",
        "Atout : expérience de vente à des propriétaires de petites entreprises ou à des services professionnels",
      ],
    },
    {
      id: "growth-marketer-demand-generation",
      title: "Spécialiste croissance / génération de demande",
      category: "marketing",
      hiringNow: true,
      mission:
        "Amener du trafic et des prospects qualifiés dans l'entonnoir Realtor Desk grâce au référencement, aux campagnes payantes, au marketing par courriel et à la distribution de contenu. Vous comprenez ce qui fait qu'un courtier canadien clique, s'inscrit et reste.",
      responsibilities: [
        "Posséder et exécuter la génération de demande multicanal : référencement/blogue, médias sociaux payants (Facebook, Instagram, LinkedIn), séquences courriel via Brevo",
        "Gérer et optimiser les campagnes Google Ads et Meta Ads ciblant les courtiers canadiens",
        "Construire et tester A/B des pages de destination, des objets de courriel et des créatifs publicitaires",
        "Tenir notre calendrier éditorial sur plus de 50 articles prévus ciblant des mots-clés immobiliers canadiens",
        "Suivre la performance de l'entonnoir (MQL, CPL, CAC) et produire un rapport hebdomadaire avec des pistes d'action",
        "Collaborer avec les équipes SDR et succès client pour aligner le message le long de l'entonnoir",
        "Soutenir la stratégie de référencement local pour les pages par ville (Toronto, Vancouver, Calgary, Montréal)",
      ],
      qualifications: [
        "Plus de 2 ans en marketing de croissance ou génération de demande pour un produit SaaS B2B",
        "Expérience pratique de Google Ads, Meta Ads et des plateformes de marketing par courriel",
        "Solides compétences analytiques — vous décidez avec des données, pas avec votre intuition",
        "Excellentes compétences rédactionnelles pour produire ou réviser du contenu immobilier canadien",
        "Atout : expérience en publicité numérique canadienne, contenu bilingue (FR/EN) ou PropTech",
      ],
    },
    {
      id: "content-writer-seo-specialist",
      title: "Rédacteur·rice / spécialiste du référencement",
      category: "marketing",
      mission:
        "Bâtir l'autorité de Realtor Desk dans l'espace immobilier canadien grâce à un contenu de haute qualité, optimisé pour la recherche, qui aide les courtiers à résoudre de vrais problèmes — et les mène naturellement à découvrir notre plateforme.",
      responsibilities: [
        "Rechercher et rédiger de 4 à 8 articles long-format par mois ciblant des mots-clés immobiliers canadiens",
        "Optimiser tout le contenu pour le référencement sur la page (balises title, méta-descriptions, maillage interne, schéma)",
        "Développer le texte de pages de destination par ville pour les grands marchés canadiens",
        "Rédiger le contenu des infolettres, des légendes de médias sociaux et des textes publicitaires courts",
        "Mener la recherche de mots-clés avec Ahrefs, Semrush ou des outils similaires",
        "Réutiliser le contenu de blogue en publications LinkedIn, fils Twitter et scénarios YouTube",
      ],
      qualifications: [
        "Plus de 2 ans à rédiger du contenu SEO long-format, de préférence en SaaS ou immobilier",
        "Solide compréhension des fondamentaux du référencement technique et sur la page",
        "Capacité à écrire avec une voix claire, professionnelle et accessible pour les courtiers canadiens",
        "Expérience avec des outils de recherche de mots-clés et de performance de contenu",
        "Atout : rédaction bilingue en français et en anglais",
      ],
    },
    {
      id: "operations-partnerships-manager",
      title: "Gestionnaire des opérations et des partenariats",
      category: "operations",
      mission:
        "Assurer le bon fonctionnement de l'entreprise et bâtir des relations stratégiques avec les associations immobilières canadiennes, les agences et les partenaires technologiques qui élargissent la portée et la crédibilité de Realtor Desk.",
      responsibilities: [
        "Gérer les flux de travail internes, les relations fournisseurs et les processus opérationnels",
        "Identifier et poursuivre des occasions de partenariat avec des agences, des sections de l'ACI et des coachs en immobilier",
        "Coordonner les lancements de produits, les campagnes et les initiatives interfonctionnelles",
        "Rédiger des propositions de partenariat, des ententes de co-marketing et des structures de programmes de recommandation",
        "Suivre les indicateurs de performance d'affaires et produire des rapports réguliers pour la direction",
        "Soutenir le recrutement, l'intégration des contractuels et la coordination de l'équipe à mesure que nous grandissons",
      ],
      qualifications: [
        "Plus de 3 ans en opérations, développement des affaires ou stratégie",
        "Solides compétences en gestion de projet (Notion, Linear, Asana ou similaires)",
        "Excellentes aptitudes en développement de relations et en communication écrite",
        "À l'aise dans une jeune pousse sans manuel de jeu défini",
        "Atout : réseau existant en immobilier canadien ou PropTech",
      ],
    },
  ],
  priorityRoles: [
    {
      roleId: "full-stack-engineer-ai-backend",
      why: "Sans fiabilité de la plateforme et performance du pipeline IA, tout le reste s'effondre. C'est la fondation technique.",
    },
    {
      roleId: "customer-success-manager",
      why: "Le désabonnement précoce tue les jeunes pousses SaaS. Un·e gestionnaire de succès client dédié·e transforme les utilisateurs d'essai en clients payants fidèles et ferme la boucle de rétroaction produit nécessaire pour avancer vite.",
    },
    {
      roleId: "sales-development-representative",
      why: "Il vous faut un pipeline qualifié. Un·e SDR génère des démos de façon constante et teste les messages sur le marché — vous donnant un vrai signal sur votre client idéal.",
    },
    {
      roleId: "growth-marketer-demand-generation",
      why: "L'acquisition organique et payante doit rouler en parallèle avec la prospection sortante. Ce rôle pilote le moteur du haut d'entonnoir et réduit le CAC avec le temps grâce à un référencement et une efficacité publicitaire qui composent.",
    },
  ],
};

export function getCareersContent(locale: SupportedLocale): CareersContent {
  return locale === "fr-CA" ? FR : EN;
}
