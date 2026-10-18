// Labels shared by the /app lead and conversation screens, merged into
// `rd.shared` in i18n/config.ts. These were hard-coded English and showed
// through on the French screens ("40 total · 6 hot", "Form", "2d ago", "You").
// FR follows the app's existing vocabulary: "clients potentiels", "chauds /
// tièdes / froids" as on the Leads tabs.

export const rdSharedEn = {
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
