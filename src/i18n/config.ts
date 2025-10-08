import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "nav": {
        "features": "Features",
        "pricing": "Pricing",
        "integrations": "Integrations",
        "canadianMarket": "Canadian Market",
        "resources": "Resources",
        "bookDemo": "Book Your Free Demo",
        "startClosing": "Start Closing More Deals"
      },
      "hero": {
        "title": "Close 3X More Deals with AI-Powered Real Estate Automation",
        "subtitle": "Realtor Desk AI transforms Canadian realtors into closing machines with predictive intelligence, 24/7 bilingual engagement, and automated transaction management.",
        "getStarted": "Start Closing More Deals",
        "watchDemo": "Book Your Free Demo",
        "badge1": "CREA Certified",
        "badge2": "SOC 2 Compliant",
        "badge3": "500+ Canadian Agents",
        "conversionBadge": "300% Conversion Increase"
      },
      "trust": {
        "title": "Trusted by 500+ Canadian Real Estate Professionals",
        "crea": "CREA Certified",
        "google": "Google Partner",
        "microsoft": "Microsoft AI"
      },
      "howItWorks": {
        "title": "How Realtor Desk AI Works",
        "subtitle": "From lead to closed deal in 4 simple steps",
        "step1Title": "Capture Leads",
        "step1Desc": "AI chatbot engages visitors 24/7, qualifying prospects automatically",
        "step2Title": "Smart Follow-Up",
        "step2Desc": "Automated, personalized email & SMS campaigns nurture leads to conversion",
        "step3Title": "MLS Integration",
        "step3Desc": "Sync with CREA DDF® to send perfect property matches instantly",
        "step4Title": "Close Deals",
        "step4Desc": "AI-powered transaction management ensures faster, smoother closings"
      },
      "solutions": {
        "title": "Meet Your AI-Powered Real Estate Operating System",
        "subtitle": "Transform how you work with intelligent automation designed specifically for Canadian realtors",
        "feature1Title": "Predictive Lead Intelligence",
        "feature1Desc": "AI identifies high-probability buyers/sellers 3-6 months before they list, increasing conversion rates from 5% to 18%",
        "feature2Title": "24/7 Bilingual AI Agent",
        "feature2Desc": "Engage leads in English or French, qualify prospects, and schedule showings automatically - even at 2 AM",
        "feature3Title": "Intelligent Transaction Management",
        "feature3Desc": "Reduce closing time from 60 days to 35 days with AI-powered coordination and risk prediction"
      },
      "faq": {
        "title": "Frequently Asked Questions",
        "subtitle": "Everything you need to know about Realtor Desk AI",
        "q1": "Does it integrate with MLS?",
        "a1": "Yes, native CREA DDF® integration is included in all plans for seamless MLS data access across Canada.",
        "q2": "Is the AI truly bilingual?",
        "a2": "Absolutely. Our AI handles contextual English-French conversations naturally, not just translation.",
        "q3": "Are you compliant with Canadian regulations?",
        "a3": "Yes, we automatically adhere to RECO, BCFSA, RECA, and all provincial real estate regulations.",
        "q4": "How secure is my client data?",
        "a4": "SOC 2 compliant with enterprise-grade encryption. Your data is stored in Canadian data centers.",
        "q5": "Can I cancel anytime?",
        "a5": "Yes, all plans are month-to-month with no long-term contracts. Cancel anytime without penalty.",
        "q6": "Can I import my existing contacts?",
        "a6": "Yes, we support CSV imports from all major CRMs. Free migration assistance included.",
        "q7": "What if I need to upgrade my plan?",
        "a7": "You can upgrade or downgrade anytime. Changes take effect immediately with prorated billing.",
        "q8": "What kind of support do you offer?",
        "a8": "Email support on Starter, phone & chat on Professional, and 24/7 priority support on Enterprise."
      },
      "cta": {
        "title": "Join 500+ Canadian Agents Growing Their Business with AI",
        "subtitle": "Start closing more deals with AI-powered automation today",
        "urgency": "⚡ Limited spots available this month • Join 14 agents who signed up this week"
      }
    }
  },
  fr: {
    translation: {
      "nav": {
        "features": "Fonctionnalités",
        "pricing": "Tarification",
        "integrations": "Intégrations",
        "canadianMarket": "Marché Canadien",
        "resources": "Ressources",
        "bookDemo": "Réserver Votre Démo Gratuite",
        "startClosing": "Commencer à Conclure Plus de Ventes"
      },
      "hero": {
        "title": "Concluez 3X Plus de Ventes avec l'Automatisation Immobilière par IA",
        "subtitle": "Realtor Desk AI transforme les agents immobiliers canadiens en machines à conclure avec intelligence prédictive, engagement bilingue 24/7 et gestion automatisée des transactions.",
        "getStarted": "Commencer à Conclure Plus de Ventes",
        "watchDemo": "Réserver Votre Démo Gratuite",
        "badge1": "Certifié CREA",
        "badge2": "Conforme SOC 2",
        "badge3": "500+ Agents Canadiens",
        "conversionBadge": "Augmentation de 300% des Conversions"
      },
      "trust": {
        "title": "Approuvé par Plus de 500 Professionnels de l'Immobilier Canadiens",
        "crea": "Certifié CREA",
        "google": "Partenaire Google",
        "microsoft": "IA Microsoft"
      },
      "howItWorks": {
        "title": "Comment Fonctionne Realtor Desk AI",
        "subtitle": "Du prospect à la vente conclue en 4 étapes simples",
        "step1Title": "Capturer les Prospects",
        "step1Desc": "Le chatbot IA engage les visiteurs 24/7, qualifiant automatiquement les prospects",
        "step2Title": "Suivi Intelligent",
        "step2Desc": "Des campagnes e-mail et SMS personnalisées et automatisées convertissent les prospects",
        "step3Title": "Intégration MLS",
        "step3Desc": "Synchronisation avec CREA DDF® pour envoyer instantanément les propriétés parfaites",
        "step4Title": "Conclure les Ventes",
        "step4Desc": "La gestion des transactions par IA garantit des clôtures plus rapides et plus fluides"
      },
      "solutions": {
        "title": "Découvrez Votre Système d'Exploitation Immobilier Propulsé par l'IA",
        "subtitle": "Transformez votre façon de travailler avec l'automatisation intelligente conçue spécifiquement pour les agents immobiliers canadiens",
        "feature1Title": "Intelligence Prédictive des Prospects",
        "feature1Desc": "L'IA identifie les acheteurs/vendeurs à forte probabilité 3 à 6 mois avant qu'ils ne listent, augmentant les taux de conversion de 5% à 18%",
        "feature2Title": "Agent IA Bilingue 24/7",
        "feature2Desc": "Engagez les prospects en anglais ou en français, qualifiez les prospects et planifiez les visites automatiquement - même à 2h du matin",
        "feature3Title": "Gestion Intelligente des Transactions",
        "feature3Desc": "Réduisez le temps de clôture de 60 à 35 jours avec coordination par IA et prédiction des risques"
      },
      "faq": {
        "title": "Questions Fréquemment Posées",
        "subtitle": "Tout ce que vous devez savoir sur Realtor Desk AI",
        "q1": "S'intègre-t-il avec MLS?",
        "a1": "Oui, l'intégration native CREA DDF® est incluse dans tous les forfaits pour un accès transparent aux données MLS à travers le Canada.",
        "q2": "L'IA est-elle vraiment bilingue?",
        "a2": "Absolument. Notre IA gère les conversations contextuelles anglais-français naturellement, pas seulement la traduction.",
        "q3": "Êtes-vous conforme aux réglementations canadiennes?",
        "a3": "Oui, nous respectons automatiquement les réglementations RECO, BCFSA, RECA et toutes les réglementations immobilières provinciales.",
        "q4": "Quelle est la sécurité de mes données clients?",
        "a4": "Conforme SOC 2 avec chiffrement de niveau entreprise. Vos données sont stockées dans des centres de données canadiens.",
        "q5": "Puis-je annuler à tout moment?",
        "a5": "Oui, tous les forfaits sont mensuels sans contrat à long terme. Annulez à tout moment sans pénalité.",
        "q6": "Puis-je importer mes contacts existants?",
        "a6": "Oui, nous prenons en charge les importations CSV de tous les principaux CRM. Assistance à la migration gratuite incluse.",
        "q7": "Que se passe-t-il si je dois améliorer mon forfait?",
        "a7": "Vous pouvez mettre à niveau ou rétrograder à tout moment. Les changements prennent effet immédiatement avec facturation au prorata.",
        "q8": "Quel type de support offrez-vous?",
        "a8": "Support par e-mail sur Starter, téléphone et chat sur Professional, et support prioritaire 24/7 sur Enterprise."
      },
      "cta": {
        "title": "Rejoignez 500+ Agents Canadiens qui Développent leur Entreprise avec l'IA",
        "subtitle": "Commencez à conclure plus de ventes avec l'automatisation par IA aujourd'hui",
        "urgency": "⚡ Places limitées ce mois-ci • Rejoignez les 14 agents qui se sont inscrits cette semaine"
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    }
  });

export default i18n;
