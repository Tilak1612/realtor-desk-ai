import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      nav: {
        features: "Features",
        pricing: "Pricing",
        integrations: "Integrations",
        canadianMarket: "Canadian Market",
        resources: "Resources",
        bookDemo: "Book Your Free Demo",
        startClosing: "Start Closing More Deals"
      },
      hero: {
        title: "Transform Your Real Estate Business with AI-Powered Intelligence",
        subtitle: "The only AI platform built specifically for Canadian realtors - featuring CREA DDF® integration, bilingual capabilities, and predictive analytics that increase conversions by 300%",
        getStarted: "Start Closing More Deals",
        watchDemo: "Book Your Free Demo",
        trustLine: "No credit card required • Cancel anytime • Free onboarding included",
        badge1: "CREA Certified",
        badge2: "SOC 2 Compliant",
        badge3: "2,000+ Canadian Agents",
        conversionBadge: "300% Conversion Increase"
      },
      home: {
        socialProof: {
          agents: "agents",
          usingNow: "using now",
          demos: "demos",
          bookedThisWeek: "booked this week",
          joinAgents: "Join agents closing 3X more deals"
        },
        credibility: {
          title: "Trusted & Secure"
        },
        demo: {
          title: "See Realtor Desk AI in Action",
          description: "Watch how AI can transform your real estate business in just 2 minutes",
          watchDemo: "Watch 2-Minute Product Demo",
          bookDemo: "Book Live Demo",
          exploreFeatures: "Explore All Features"
        }
      },
      features: {
        hero: {
          title: "Every Feature Your Real Estate Business Needs,",
          titleGradient: "Powered by AI",
          subtitle: "From first contact to closed deal - intelligent automation at every step"
        },
        tabs: {
          crm: "Predictive CRM",
          chatbot: "AI Chatbot",
          market: "Market Intelligence",
          transaction: "Transaction Management",
          marketing: "Marketing Automation"
        },
        comparison: {
          title: "How We Compare to Leading CRMs",
          disclaimer: "* Pricing and features as of October 2025. Contact competitors directly for current information."
        },
        mobile: {
          title: "Work From Anywhere with Our Mobile App",
          subtitle: "Manage your entire real estate business from your phone. Respond to leads, schedule showings, and close deals on the go.",
          appStores: "Available on iOS & Android"
        }
      },
      pricing: {
        hero: {
          badge: "🇨🇦 Proud Canadian Company",
          title: "Simple, Transparent Pricing for",
          titleGradient: "Canadian Real Estate Professionals",
          subtitle: "No setup fees. No hidden costs. No surprises. Just powerful AI to grow your business.",
          monthly: "Monthly",
          yearly: "Yearly",
          saveYearly: "Save up to $500/year"
        },
        plans: {
          agent: {
            name: "AGENT",
            description: "Perfect for individual agents ready to scale",
            ctaMonthly: "Start Free Trial",
            ctaYearly: "Start 60-Day Free Trial"
          },
          team: {
            name: "TEAM",
            description: "For growing teams of 2-5 agents",
            cta: "Request Team Demo"
          },
          brokerage: {
            name: "BROKERAGE",
            price: "Custom",
            description: "For brokerages with 6+ agents",
            cta: "Get Custom Quote"
          }
        },
        addons: {
          title: "Enhance Your Plan with Add-Ons"
        },
        guarantees: {
          title: "Our Guarantees to You",
          moneyBack: "30-Day Money-Back Guarantee",
          noContracts: "No Contracts, Cancel Anytime",
          freeSetup: "Free Setup & Migration"
        },
        faq: {
          title: "Frequently Asked Questions"
        }
      },
      demo: {
        hero: {
          title: "See",
          titleGradient: "Realtor Desk AI",
          titleEnd: "in Action",
          subtitle: "Schedule a personalized demo and see how we can help your business"
        },
        form: {
          title: "Request a Personalized Demo",
          submit: "Request Demo",
          submitting: "Submitting...",
          orStart: "Or",
          getStarted: "get started",
          rightAway: "right away"
        },
        expect: {
          title: "What to Expect",
          discovery: "Discovery Call (15 min)",
          discoveryDesc: "We learn about your business, challenges, and goals",
          liveDemo: "Live Demo (30 min)",
          liveDemoDesc: "See Realtor Desk AI in action with examples specific to your market",
          onboarding: "Custom Onboarding",
          onboardingDesc: "Get started with personalized onboarding and support"
        },
        contact: {
          title: "Contact Information",
          email: "Email",
          phone: "Phone",
          address: "Address"
        },
        explore: {
          title: "Prefer to explore on your own?",
          subtitle: "Get started today - no demo required",
          cta: "Get Started"
        }
      },
      contact: {
        hero: {
          title: "Get in",
          titleGradient: "Touch",
          subtitle: "Have questions? We're here to help you transform your real estate business with AI"
        },
        info: {
          emailUs: "Email Us",
          callUs: "Call Us",
          visitUs: "Visit Us",
          hours: "Business Hours",
          hoursDetails: "Monday - Friday: 9:00 AM - 6:00 PM EST\nSaturday: 10:00 AM - 4:00 PM EST\nSunday: Closed"
        },
        form: {
          title: "Send Us a Message",
          name: "Full Name *",
          email: "Email *",
          phone: "Phone",
          message: "Message *",
          submit: "Send Message",
          submitting: "Sending...",
          success: "Message Sent! ✅",
          successDesc: "Thanks for reaching out! We'll get back to you within 24 hours."
        },
        map: {
          placeholder: "Map integration placeholder"
        }
      },
      canadianMarket: {
        hero: {
          title: "The Only AI Platform Built Specifically for",
          titleGradient: "Canadian Real Estate",
          subtitle: "CREA DDF®, bilingual AI, and provincial compliance - not an afterthought, but the foundation"
        }
      },
      resources: {
        hero: {
          title: "Real Estate",
          titleGradient: "Intelligence Hub",
          subtitle: "Guides, tips, and insights for Canadian real estate professionals"
        }
      },
      integrations: {
        hero: {
          title: "Connect Your Entire",
          titleGradient: "Real Estate Tech Stack",
          subtitle: "Realtor Desk AI integrates seamlessly with all your favorite tools and platforms"
        }
      },
      comparison: {
        badge: "Comparison Guide",
        savings: "Save",
        firstYear: "first year!",
        complaints: "Common Complaints We Hear",
        schedule: "Schedule Free Migration Call"
      }
    }
  },
  fr: {
    translation: {
      nav: {
        features: "Fonctionnalités",
        pricing: "Tarification",
        integrations: "Intégrations",
        canadianMarket: "Marché Canadien",
        resources: "Ressources",
        bookDemo: "Réserver Votre Démo Gratuite",
        startClosing: "Commencer à Conclure Plus"
      },
      hero: {
        title: "Transformez Votre Entreprise Immobilière avec l'Intelligence IA",
        subtitle: "La seule plateforme IA construite spécifiquement pour les agents immobiliers canadiens - avec intégration CREA DDF®, capacités bilingues et analyses prédictives qui augmentent les conversions de 300%",
        getStarted: "Commencer à Conclure Plus",
        watchDemo: "Réserver Votre Démo Gratuite",
        trustLine: "Aucune carte de crédit requise • Annulez à tout moment • Intégration gratuite incluse",
        badge1: "Certifié CREA",
        badge2: "Conforme SOC 2",
        badge3: "2 000+ Agents Canadiens",
        conversionBadge: "Augmentation de 300% des Conversions"
      },
      home: {
        socialProof: {
          agents: "agents",
          usingNow: "l'utilisent maintenant",
          demos: "démos",
          bookedThisWeek: "réservées cette semaine",
          joinAgents: "Rejoignez les agents qui concluent 3X plus"
        },
        credibility: {
          title: "Approuvé et Sécurisé"
        },
        demo: {
          title: "Voyez Realtor Desk AI en Action",
          description: "Découvrez comment l'IA peut transformer votre entreprise immobilière en seulement 2 minutes",
          watchDemo: "Regarder la Démo Produit de 2 Minutes",
          bookDemo: "Réserver une Démo en Direct",
          exploreFeatures: "Explorer Toutes les Fonctionnalités"
        }
      },
      features: {
        hero: {
          title: "Toutes les Fonctionnalités Dont Votre Entreprise Immobilière A Besoin,",
          titleGradient: "Propulsées par l'IA",
          subtitle: "Du premier contact à la vente conclue - automation intelligente à chaque étape"
        },
        tabs: {
          crm: "CRM Prédictif",
          chatbot: "Chatbot IA",
          market: "Intelligence de Marché",
          transaction: "Gestion des Transactions",
          marketing: "Automation Marketing"
        },
        comparison: {
          title: "Comment Nous Comparons aux Principaux CRM",
          disclaimer: "* Prix et fonctionnalités à partir d'octobre 2025. Contactez les concurrents directement pour les informations actuelles."
        },
        mobile: {
          title: "Travaillez de N'importe Où avec Notre Application Mobile",
          subtitle: "Gérez toute votre entreprise immobilière depuis votre téléphone. Répondez aux prospects, planifiez des visites et concluez des ventes en déplacement.",
          appStores: "Disponible sur iOS et Android"
        }
      },
      pricing: {
        hero: {
          badge: "🇨🇦 Fière Entreprise Canadienne",
          title: "Tarification Simple et Transparente pour les",
          titleGradient: "Professionnels de l'Immobilier Canadiens",
          subtitle: "Aucuns frais d'installation. Aucuns coûts cachés. Aucune surprise. Juste une IA puissante pour développer votre entreprise.",
          monthly: "Mensuel",
          yearly: "Annuel",
          saveYearly: "Économisez jusqu'à 500 $ /an"
        },
        plans: {
          agent: {
            name: "AGENT",
            description: "Parfait pour les agents individuels prêts à se développer",
            ctaMonthly: "Commencer l'Essai Gratuit",
            ctaYearly: "Commencer l'Essai Gratuit de 60 Jours"
          },
          team: {
            name: "ÉQUIPE",
            description: "Pour les équipes en croissance de 2 à 5 agents",
            cta: "Demander une Démo Équipe"
          },
          brokerage: {
            name: "COURTAGE",
            price: "Personnalisé",
            description: "Pour les courtages avec 6+ agents",
            cta: "Obtenir un Devis Personnalisé"
          }
        },
        addons: {
          title: "Améliorez Votre Plan avec des Modules Complémentaires"
        },
        guarantees: {
          title: "Nos Garanties Pour Vous",
          moneyBack: "Garantie de Remboursement de 30 Jours",
          noContracts: "Aucun Contrat, Annulez à Tout Moment",
          freeSetup: "Installation et Migration Gratuites"
        },
        faq: {
          title: "Questions Fréquemment Posées"
        }
      },
      demo: {
        hero: {
          title: "Voyez",
          titleGradient: "Realtor Desk AI",
          titleEnd: "en Action",
          subtitle: "Planifiez une démo personnalisée et voyez comment nous pouvons aider votre entreprise"
        },
        form: {
          title: "Demander une Démo Personnalisée",
          submit: "Demander une Démo",
          submitting: "Envoi en cours...",
          orStart: "Ou",
          getStarted: "commencez",
          rightAway: "tout de suite"
        },
        expect: {
          title: "À Quoi S'Attendre",
          discovery: "Appel Découverte (15 min)",
          discoveryDesc: "Nous en apprenons sur votre entreprise, vos défis et vos objectifs",
          liveDemo: "Démo en Direct (30 min)",
          liveDemoDesc: "Voyez Realtor Desk AI en action avec des exemples spécifiques à votre marché",
          onboarding: "Intégration Personnalisée",
          onboardingDesc: "Démarrez avec une intégration et un support personnalisés"
        },
        contact: {
          title: "Informations de Contact",
          email: "E-mail",
          phone: "Téléphone",
          address: "Adresse"
        },
        explore: {
          title: "Préférez explorer par vous-même?",
          subtitle: "Commencez aujourd'hui - aucune démo requise",
          cta: "Commencer"
        }
      },
      contact: {
        hero: {
          title: "Entrer en",
          titleGradient: "Contact",
          subtitle: "Vous avez des questions? Nous sommes là pour vous aider à transformer votre entreprise immobilière avec l'IA"
        },
        info: {
          emailUs: "Nous Écrire",
          callUs: "Nous Appeler",
          visitUs: "Nous Rendre Visite",
          hours: "Heures d'Ouverture",
          hoursDetails: "Lundi - Vendredi: 9h00 - 18h00 HNE\nSamedi: 10h00 - 16h00 HNE\nDimanche: Fermé"
        },
        form: {
          title: "Envoyez-Nous un Message",
          name: "Nom Complet *",
          email: "E-mail *",
          phone: "Téléphone",
          message: "Message *",
          submit: "Envoyer le Message",
          submitting: "Envoi...",
          success: "Message Envoyé! ✅",
          successDesc: "Merci de nous avoir contactés! Nous vous répondrons dans les 24 heures."
        },
        map: {
          placeholder: "Placeholder de carte"
        }
      },
      canadianMarket: {
        hero: {
          title: "La Seule Plateforme IA Construite Spécifiquement pour l'",
          titleGradient: "Immobilier Canadien",
          subtitle: "CREA DDF®, IA bilingue et conformité provinciale - pas une réflexion après coup, mais la fondation"
        }
      },
      resources: {
        hero: {
          title: "Centre d'",
          titleGradient: "Intelligence Immobilière",
          subtitle: "Guides, conseils et perspectives pour les professionnels de l'immobilier canadiens"
        }
      },
      integrations: {
        hero: {
          title: "Connectez Toute Votre",
          titleGradient: "Suite Technologique Immobilière",
          subtitle: "Realtor Desk AI s'intègre parfaitement avec tous vos outils et plateformes préférés"
        }
      },
      comparison: {
        badge: "Guide de Comparaison",
        savings: "Économisez",
        firstYear: "la première année!",
        complaints: "Plaintes Courantes Que Nous Entendons",
        schedule: "Planifier un Appel de Migration Gratuit"
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
