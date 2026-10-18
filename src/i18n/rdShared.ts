// Labels shared by the /app lead and conversation screens, merged into
// `rd.shared` in i18n/config.ts. These were hard-coded English and showed
// through on the French screens ("40 total · 6 hot", "Form", "2d ago", "You").
// FR follows the app's existing vocabulary: "clients potentiels", "chauds /
// tièdes / froids" as on the Leads tabs.

export const rdSharedEn = {
  aiConsent: {
    title: "Allow AI features?",
    what: "Some features send your data to outside AI providers to produce a result:",
    anthropic: "Anthropic, for the AI Assistant: what you type, plus a short summary of your CRM (top contacts, recent deals and pending tasks).",
    openai: "OpenAI, for lead insights and call summaries: a lead's name, tags, notes and activity when it is scored, and your call notes with the contact's name.",
    where: "They may process it outside Canada. Nothing is sent until you allow it. If you don't, these AI features stay off and lead scores use rules only.",
    policy: "Read our Privacy Policy",
    allow: "Allow",
    decline: "Not now",
  },
  backToDesk: "Back to Desk",
  leadCounts: "{{total}} total · {{hot}} hot",
  temp: { hot: "Hot", warm: "Warm", cold: "Cold" },
  source: {
    ddf: "DDF",
    realtorCa: "Realtor.ca",
    form: "Form",
    openHouse: "Open house",
    ads: "Ads",
    referral: "Referral",
    other: "Other",
  },
  ago: {
    seconds: "{{count}}s ago",
    minutes: "{{count}}m ago",
    hours: "{{count}}h ago",
    yesterday: "yesterday",
    days: "{{count}}d ago",
    weeks: "{{count}}w ago",
  },
  inbox: {
    noMessages: "No messages yet.",
    you: "You",
    flagged: "Flagged for you",
  },
};

export const rdSharedFr: typeof rdSharedEn = {
  aiConsent: {
    title: "Autoriser les fonctions d’IA?",
    what: "Certaines fonctions envoient vos données à des fournisseurs d’IA externes pour produire un résultat :",
    anthropic: "Anthropic, pour l’assistant IA : ce que vous écrivez et un bref résumé de votre CRM (contacts les mieux cotés, transactions récentes et tâches en attente).",
    openai: "OpenAI, pour l’analyse des clients potentiels et les résumés d’appels : le nom, les étiquettes, les notes et l’activité d’un client potentiel lors de son évaluation, ainsi que vos notes d’appel avec le nom du contact.",
    where: "Ces données peuvent être traitées à l’extérieur du Canada. Rien n’est envoyé avant votre autorisation. Sinon, ces fonctions d’IA restent désactivées et le pointage des clients potentiels utilise seulement des règles.",
    policy: "Lire notre politique de confidentialité",
    allow: "Autoriser",
    decline: "Pas maintenant",
  },
  backToDesk: "Retour au bureau",
  leadCounts: "{{total}} au total · {{hot}} chauds",
  temp: { hot: "Chaud", warm: "Tiède", cold: "Froid" },
  source: {
    ddf: "DDF",
    realtorCa: "Realtor.ca",
    form: "Formulaire",
    openHouse: "Visite libre",
    ads: "Publicité",
    referral: "Recommandation",
    other: "Autre",
  },
  ago: {
    seconds: "il y a {{count}} s",
    minutes: "il y a {{count}} min",
    hours: "il y a {{count}} h",
    yesterday: "hier",
    days: "il y a {{count}} j",
    weeks: "il y a {{count}} sem.",
  },
  inbox: {
    noMessages: "Aucun message pour l’instant.",
    you: "Vous",
    flagged: "Signalé pour vous",
  },
};
