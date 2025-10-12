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
        "title": "Transform Your Real Estate Business with AI-Powered Intelligence",
        "subtitle": "The only AI platform built specifically for Canadian realtors - featuring CREA DDF® integration, bilingual capabilities, and predictive analytics that increase conversions by 300%",
        "getStarted": "Start Closing More Deals",
        "watchDemo": "Book Your Free Demo",
        "trustLine": "No credit card required • Cancel anytime • Free onboarding included",
        "badge1": "CREA Certified",
        "badge2": "SOC 2 Compliant",
        "badge3": "2,000+ Canadian Agents",
        "conversionBadge": "300% Conversion Increase"
      },
      "home": {
        "socialProof": {
          "agents": "agents",
          "usingNow": "using now",
          "demos": "demos",
          "bookedThisWeek": "booked this week",
          "joinAgents": "Join agents closing 3X more deals"
        },
        "credibility": {
          "title": "Trusted & Secure"
        },
        "demo": {
          "title": "See Realtor Desk AI in Action",
          "description": "Watch how AI can transform your real estate business in just 2 minutes",
          "watchDemo": "Watch 2-Minute Product Demo",
          "bookDemo": "Book Live Demo",
          "exploreFeatures": "Explore All Features"
        }
      },
      "credibility": {
        "title": "Trusted & Secure",
        "soc2": "SOC 2 Compliant",
        "soc2Desc": "Enterprise-grade security and data protection",
        "pipeda": "PIPEDA Compliant",
        "pipedaDesc": "Full Canadian privacy law compliance",
        "crea": "CREA Certified",
        "creaDesc": "Official CREA DDF® integration partner"
      },
      "demo": {
        "title": "See Realtor Desk AI in Action",
        "subtitle": "Watch how AI can transform your real estate business in just 2 minutes",
        "videoPlaceholder": "2-Minute Product Demo",
        "bookLive": "Book Live Demo",
        "exploreFeatures": "Explore All Features"
      },
      "trust": {
        "title": "Trusted by 500+ Canadian Real Estate Professionals",
        "crea": "CREA Certified",
        "google": "Google Partner",
        "microsoft": "Microsoft AI"
      },
      "problem": {
        "title": "The Hidden Costs of Outdated Real Estate Technology",
        "subtitle": "Traditional CRMs are holding Canadian realtors back from their full potential",
        "stat1": "12%",
        "stat1Desc": "of agents use AI capabilities despite 72% using CRMs",
        "stat2": "48%",
        "stat2Desc": "of buyer inquiries receive NO response",
        "stat3": "15+",
        "stat3Desc": "hours weekly spent on tasks that could be automated",
        "stat4": "2-5%",
        "stat4Desc": "lead conversion rate with traditional methods"
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
      "roi": {
        "title": "Calculate Your Potential Revenue Increase",
        "leads": "Monthly Leads",
        "commission": "Average Commission ($)",
        "conversion": "Current Conversion Rate (%)",
        "achieve": "With Realtor Desk AI, You Could Achieve:",
        "additionalRevenue": "Additional Annual Revenue",
        "additionalDeals": "Additional Deals Closed/Year",
        "timeSaved": "Time Saved Per Week"
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
      "canadian": {
        "title": "Built for the Canadian Real Estate Market",
        "subtitle": "Not adapted - designed from the ground up for Canadian realtors",
        "crea": "CREA DDF® Integration",
        "creaDesc": "Access national MLS data seamlessly",
        "compliance": "Provincial Compliance Engine",
        "complianceDesc": "RECO, BCFSA, RECA auto-compliance",
        "bilingual": "True Bilingual AI",
        "bilingualDesc": "Contextual English-French conversations",
        "data": "Canadian Data Residency",
        "dataDesc": "All data stored in Canadian servers"
      },
      "cta": {
        "title": "Join 500+ Canadian Agents Growing Their Business with AI",
        "subtitle": "Start closing more deals with AI-powered automation today",
        "urgency": "⚡ Limited spots available this month • Join 14 agents who signed up this week",
        "bookDemo": "Book Your Free Demo",
        "getStarted": "Get Started"
      },
      "demoPage": {
        "title": "See Realtor Desk AI in Action",
        "subtitle": "Schedule a personalized demo and see how we can help your business",
        "formTitle": "Request a Personalized Demo",
        "fullName": "Full Name",
        "email": "Email Address",
        "phone": "Phone Number",
        "brokerage": "Brokerage/Company",
        "province": "Province",
        "selectProvince": "Select province",
        "currentCrm": "Current CRM (if any)",
        "selectCrm": "Select CRM",
        "teamSize": "Number of Team Members",
        "selectTeam": "Select team size",
        "challenge": "Biggest Challenge",
        "selectChallenge": "Select challenge",
        "comments": "Comments/Questions",
        "commentsPlaceholder": "Tell us more about your needs...",
        "submit": "Request Demo",
        "submitting": "Submitting...",
        "orGetStarted": "Or",
        "getStartedNow": "get started",
        "getStartedRight": "right away",
        "whatToExpect": "What to Expect",
        "discovery": "Discovery Call (15 min)",
        "discoveryDesc": "We learn about your business, challenges, and goals",
        "liveDemo": "Live Demo (30 min)",
        "liveDemoDesc": "See Realtor Desk AI in action with examples specific to your market",
        "onboarding": "Custom Onboarding",
        "onboardingDesc": "Get started with personalized onboarding and support",
        "contactInfo": "Contact Information",
        "emailLabel": "Email",
        "phoneLabel": "Phone",
        "addressLabel": "Address",
        "exploreOwn": "Prefer to explore on your own?",
        "exploreDesc": "Get started today - no demo required",
        "getStartedBtn": "Get Started"
      },
      "contactPage": {
        "title": "Get in Touch",
        "subtitle": "Have questions? We're here to help you transform your real estate business with AI",
        "emailUs": "Email Us",
        "callUs": "Call Us",
        "visitUs": "Visit Us",
        "hours": "Business Hours",
        "hoursLine1": "Monday - Friday: 9:00 AM - 6:00 PM EST",
        "hoursLine2": "Saturday: 10:00 AM - 4:00 PM EST",
        "hoursLine3": "Sunday: Closed",
        "sendMessage": "Send Us a Message",
        "name": "Full Name",
        "email": "Email",
        "phone": "Phone",
        "message": "Message",
        "messagePlaceholder": "Tell us how we can help you...",
        "send": "Send Message",
        "sending": "Sending...",
        "mapPlaceholder": "Map integration placeholder"
      },
      "footer": {
        "tagline": "AI-powered solutions for Canadian real estate professionals.",
        "poweredBy": "Powered by Brainfy AI Inc",
        "product": "Product",
        "features": "Features",
        "pricing": "Pricing",
        "canadianMarket": "Canadian Market",
        "requestDemo": "Request Demo",
        "resources": "Resources",
        "blog": "Blog",
        "integrations": "Integrations",
        "helpCenter": "Help Center",
        "systemStatus": "System Status",
        "contact": "Contact Us",
        "contactForm": "Contact Form →",
        "privacyPolicy": "Privacy Policy",
        "termsOfService": "Terms of Service",
        "allRights": "All rights reserved."
      },
      "exitPopup": {
        "title": "Wait! Before You Go...",
        "subtitle": "Get our free guide: \"10 Ways AI Can Triple Your Real Estate Closings\"",
        "emailPlaceholder": "Enter your email",
        "submit": "Send Me The Free Guide",
        "submitting": "Submitting...",
        "noSpam": "No spam. Unsubscribe anytime."
      },
      "chat": {
        "title": "Chat with us",
        "greeting": "👋 Hi! Have questions about Realtor Desk AI? Send us a message and we'll get back to you right away.",
        "placeholder": "Type your message...",
        "send": "Send Message",
        "emailUs": "Or email us at: support@realtordesk.ai"
      },
      "testimonials": {
        "quote1": "I closed 14 additional deals in Q1 using Realtor Desk AI. The predictive lead scoring is a game-changer.",
        "name1": "Sarah Chen",
        "title1": "Top Producer",
        "company1": "Royal LePage Toronto",
        "quote2": "The bilingual AI chatbot captures leads 24/7. I wake up to qualified appointments every morning.",
        "name2": "Marc Dubois",
        "title2": "Broker",
        "company2": "RE/MAX Québec",
        "quote3": "My transaction closings went from 60 days to 35 days. The AI coordination is incredible.",
        "name3": "Priya Sharma",
        "title3": "Sales Representative",
        "company3": "Century 21 Vancouver"
      },
      "features": {
        "hero": {
          "title": "Every Feature Your Real Estate Business Needs,",
          "titleGradient": "Powered by AI",
          "subtitle": "From first contact to closed deal - intelligent automation at every step"
        },
        "tabs": {
          "crm": "Predictive CRM",
          "chatbot": "AI Chatbot",
          "market": "Market Intelligence",
          "transaction": "Transaction Management",
          "marketing": "Marketing Automation"
        },
        "comparison": {
          "title": "How We Compare to Leading CRMs",
          "disclaimer": "* Pricing and features as of October 2025. Contact competitors directly for current information."
        },
        "mobile": {
          "title": "Work From Anywhere with Our Mobile App",
          "subtitle": "Manage your entire real estate business from your phone. Respond to leads, schedule showings, and close deals on the go.",
          "appStores": "Available on iOS & Android"
        }
      },
      "pricing": {
        "hero": {
          "badge": "🇨🇦 Proud Canadian Company",
          "title": "Simple, Transparent Pricing for",
          "titleGradient": "Canadian Real Estate Professionals",
          "subtitle": "No setup fees. No hidden costs. No surprises. Just powerful AI to grow your business.",
          "monthly": "Monthly",
          "yearly": "Yearly",
          "saveYearly": "Save up to $500/year"
        },
        "plans": {
          "agent": {
            "name": "AGENT",
            "description": "Perfect for individual agents ready to scale",
            "ctaMonthly": "Start Free Trial",
            "ctaYearly": "Start 60-Day Free Trial"
          },
          "team": {
            "name": "TEAM",
            "description": "For growing teams of 2-5 agents",
            "cta": "Request Team Demo"
          },
          "brokerage": {
            "name": "BROKERAGE",
            "price": "Custom",
            "description": "For brokerages with 6+ agents",
            "cta": "Get Custom Quote"
          }
        },
        "addons": {
          "title": "Enhance Your Plan with Add-Ons"
        },
        "guarantees": {
          "title": "Our Guarantees to You",
          "moneyBack": "30-Day Money-Back Guarantee",
          "noContracts": "No Contracts, Cancel Anytime",
          "freeSetup": "Free Setup & Migration"
        },
        "faq": {
          "title": "Frequently Asked Questions"
        }
      },
      "demo": {
        "hero": {
          "title": "See",
          "titleGradient": "Realtor Desk AI",
          "titleEnd": "in Action",
          "subtitle": "Schedule a personalized demo and see how we can help your business"
        },
        "form": {
          "title": "Request a Personalized Demo",
          "submit": "Request Demo",
          "submitting": "Submitting...",
          "orStart": "Or",
          "getStarted": "get started",
          "rightAway": "right away"
        },
        "expect": {
          "title": "What to Expect",
          "discovery": "Discovery Call (15 min)",
          "discoveryDesc": "We learn about your business, challenges, and goals",
          "liveDemo": "Live Demo (30 min)",
          "liveDemoDesc": "See Realtor Desk AI in action with examples specific to your market",
          "onboarding": "Custom Onboarding",
          "onboardingDesc": "Get started with personalized onboarding and support"
        },
        "contact": {
          "title": "Contact Information",
          "email": "Email",
          "phone": "Phone",
          "address": "Address"
        },
        "explore": {
          "title": "Prefer to explore on your own?",
          "subtitle": "Get started today - no demo required",
          "cta": "Get Started"
        }
      },
      "contact": {
        "hero": {
          "title": "Get in",
          "titleGradient": "Touch",
          "subtitle": "Have questions? We're here to help you transform your real estate business with AI"
        },
        "info": {
          "emailUs": "Email Us",
          "callUs": "Call Us",
          "visitUs": "Visit Us",
          "hours": "Business Hours",
          "hoursDetails": "Monday - Friday: 9:00 AM - 6:00 PM EST\nSaturday: 10:00 AM - 4:00 PM EST\nSunday: Closed"
        },
        "form": {
          "title": "Send Us a Message",
          "name": "Full Name *",
          "email": "Email *",
          "phone": "Phone",
          "message": "Message *",
          "submit": "Send Message",
          "submitting": "Sending...",
          "success": "Message Sent! ✅",
          "successDesc": "Thanks for reaching out! We'll get back to you within 24 hours."
        },
        "map": {
          "placeholder": "Map integration placeholder"
        }
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
        "startClosing": "Commencer à Conclure Plus"
      },
      "hero": {
        "title": "Transformez Votre Entreprise Immobilière avec l'Intelligence IA",
        "subtitle": "La seule plateforme IA construite spécifiquement pour les agents immobiliers canadiens - avec intégration CREA DDF®, capacités bilingues et analyses prédictives qui augmentent les conversions de 300%",
        "getStarted": "Commencer à Conclure Plus",
        "watchDemo": "Réserver Votre Démo Gratuite",
        "trustLine": "Aucune carte de crédit requise • Annulez à tout moment • Intégration gratuite incluse",
        "badge1": "Certifié CREA",
        "badge2": "Conforme SOC 2",
        "badge3": "2 000+ Agents Canadiens",
        "conversionBadge": "Augmentation de 300% des Conversions"
      },
      "home": {
        "socialProof": {
          "agents": "agents",
          "usingNow": "l'utilisent maintenant",
          "demos": "démos",
          "bookedThisWeek": "réservées cette semaine",
          "joinAgents": "Rejoignez les agents qui concluent 3X plus"
        },
        "credibility": {
          "title": "Approuvé et Sécurisé"
        },
        "demo": {
          "title": "Voyez Realtor Desk AI en Action",
          "description": "Découvrez comment l'IA peut transformer votre entreprise immobilière en seulement 2 minutes",
          "watchDemo": "Regarder la Démo Produit de 2 Minutes",
          "bookDemo": "Réserver une Démo en Direct",
          "exploreFeatures": "Explorer Toutes les Fonctionnalités"
      },
      "features": {
        "hero": {
          "title": "Toutes les Fonctionnalités Dont Votre Entreprise Immobilière A Besoin,",
          "titleGradient": "Propulsées par l'IA",
          "subtitle": "Du premier contact à la vente conclue - automation intelligente à chaque étape"
        },
        "tabs": {
          "crm": "CRM Prédictif",
          "chatbot": "Chatbot IA",
          "market": "Intelligence de Marché",
          "transaction": "Gestion des Transactions",
          "marketing": "Automation Marketing"
        },
        "comparison": {
          "title": "Comment Nous Comparons aux Principaux CRM",
          "disclaimer": "* Prix et fonctionnalités à partir d'octobre 2025. Contactez les concurrents directement pour les informations actuelles."
        },
        "mobile": {
          "title": "Travaillez de N'importe Où avec Notre Application Mobile",
          "subtitle": "Gérez toute votre entreprise immobilière depuis votre téléphone. Répondez aux prospects, planifiez des visites et concluez des ventes en déplacement.",
          "appStores": "Disponible sur iOS et Android"
        }
      },
      "pricing": {
        "hero": {
          "badge": "🇨🇦 Fière Entreprise Canadienne",
          "title": "Tarification Simple et Transparente pour les",
          "titleGradient": "Professionnels de l'Immobilier Canadiens",
          "subtitle": "Aucuns frais d'installation. Aucuns coûts cachés. Aucune surprise. Juste une IA puissante pour développer votre entreprise.",
          "monthly": "Mensuel",
          "yearly": "Annuel",
          "saveYearly": "Économisez jusqu'à 500 $ /an"
        },
        "plans": {
          "agent": {
            "name": "AGENT",
            "description": "Parfait pour les agents individuels prêts à se développer",
            "ctaMonthly": "Commencer l'Essai Gratuit",
            "ctaYearly": "Commencer l'Essai Gratuit de 60 Jours"
          },
          "team": {
            "name": "ÉQUIPE",
            "description": "Pour les équipes en croissance de 2 à 5 agents",
            "cta": "Demander une Démo Équipe"
          },
          "brokerage": {
            "name": "COURTAGE",
            "price": "Personnalisé",
            "description": "Pour les courtages avec 6+ agents",
            "cta": "Obtenir un Devis Personnalisé"
          }
        },
        "addons": {
          "title": "Améliorez Votre Plan avec des Modules Complémentaires"
        },
        "guarantees": {
          "title": "Nos Garanties Pour Vous",
          "moneyBack": "Garantie de Remboursement de 30 Jours",
          "noContracts": "Aucun Contrat, Annulez à Tout Moment",
          "freeSetup": "Installation et Migration Gratuites"
        },
        "faq": {
          "title": "Questions Fréquemment Posées"
        }
      },
      "demo": {
        "hero": {
          "title": "Voyez",
          "titleGradient": "Realtor Desk AI",
          "titleEnd": "en Action",
          "subtitle": "Planifiez une démo personnalisée et voyez comment nous pouvons aider votre entreprise"
        },
        "form": {
          "title": "Demander une Démo Personnalisée",
          "submit": "Demander une Démo",
          "submitting": "Envoi en cours...",
          "orStart": "Ou",
          "getStarted": "commencez",
          "rightAway": "tout de suite"
        },
        "expect": {
          "title": "À Quoi S'Attendre",
          "discovery": "Appel Découverte (15 min)",
          "discoveryDesc": "Nous en apprenons sur votre entreprise, vos défis et vos objectifs",
          "liveDemo": "Démo en Direct (30 min)",
          "liveDemoDesc": "Voyez Realtor Desk AI en action avec des exemples spécifiques à votre marché",
          "onboarding": "Intégration Personnalisée",
          "onboardingDesc": "Démarrez avec une intégration et un support personnalisés"
        },
        "contact": {
          "title": "Informations de Contact",
          "email": "E-mail",
          "phone": "Téléphone",
          "address": "Adresse"
        },
        "explore": {
          "title": "Préférez explorer par vous-même?",
          "subtitle": "Commencez aujourd'hui - aucune démo requise",
          "cta": "Commencer"
        }
      },
      "contact": {
        "hero": {
          "title": "Entrer en",
          "titleGradient": "Contact",
          "subtitle": "Vous avez des questions? Nous sommes là pour vous aider à transformer votre entreprise immobilière avec l'IA"
        },
        "info": {
          "emailUs": "Nous Écrire",
          "callUs": "Nous Appeler",
          "visitUs": "Nous Rendre Visite",
          "hours": "Heures d'Ouverture",
          "hoursDetails": "Lundi - Vendredi: 9h00 - 18h00 HNE\nSamedi: 10h00 - 16h00 HNE\nDimanche: Fermé"
        },
        "form": {
          "title": "Envoyez-Nous un Message",
          "name": "Nom Complet *",
          "email": "E-mail *",
          "phone": "Téléphone",
          "message": "Message *",
          "submit": "Envoyer le Message",
          "submitting": "Envoi...",
          "success": "Message Envoyé! ✅",
          "successDesc": "Merci de nous avoir contactés! Nous vous répondrons dans les 24 heures."
        },
        "map": {
          "placeholder": "Placeholder de carte"
        }
      }
      },
      "credibility": {
        "title": "Approuvé et Sécurisé",
        "soc2": "Conforme SOC 2",
        "soc2Desc": "Sécurité et protection des données de niveau entreprise",
        "pipeda": "Conforme PIPEDA",
        "pipedaDesc": "Conformité complète aux lois canadiennes sur la vie privée",
        "crea": "Certifié CREA",
        "creaDesc": "Partenaire officiel d'intégration CREA DDF®"
      },
      "demo": {
        "title": "Voyez Realtor Desk AI en Action",
        "subtitle": "Découvrez comment l'IA peut transformer votre entreprise immobilière en seulement 2 minutes",
        "videoPlaceholder": "Démo Produit de 2 Minutes",
        "bookLive": "Réserver une Démo en Direct",
        "exploreFeatures": "Explorer Toutes les Fonctionnalités"
      },
      "trust": {
        "title": "Approuvé par Plus de 500 Professionnels de l'Immobilier Canadiens",
        "crea": "Certifié CREA",
        "google": "Partenaire Google",
        "microsoft": "IA Microsoft"
      },
      "problem": {
        "title": "Les Coûts Cachés des Technologies Immobilières Obsolètes",
        "subtitle": "Les CRM traditionnels empêchent les agents immobiliers canadiens d'atteindre leur plein potentiel",
        "stat1": "12%",
        "stat1Desc": "des agents utilisent les capacités IA malgré 72% utilisant des CRM",
        "stat2": "48%",
        "stat2Desc": "des demandes d'acheteurs ne reçoivent AUCUNE réponse",
        "stat3": "15+",
        "stat3Desc": "heures par semaine passées sur des tâches qui pourraient être automatisées",
        "stat4": "2-5%",
        "stat4Desc": "taux de conversion des prospects avec les méthodes traditionnelles"
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
      "roi": {
        "title": "Calculez Votre Augmentation Potentielle de Revenus",
        "leads": "Prospects Mensuels",
        "commission": "Commission Moyenne ($)",
        "conversion": "Taux de Conversion Actuel (%)",
        "achieve": "Avec Realtor Desk AI, Vous Pourriez Atteindre:",
        "additionalRevenue": "Revenus Annuels Supplémentaires",
        "additionalDeals": "Ventes Supplémentaires Conclues/An",
        "timeSaved": "Temps Économisé Par Semaine"
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
      "canadian": {
        "title": "Conçu pour le Marché Immobilier Canadien",
        "subtitle": "Pas adapté - conçu dès le départ pour les agents immobiliers canadiens",
        "crea": "Intégration CREA DDF®",
        "creaDesc": "Accès transparent aux données MLS nationales",
        "compliance": "Moteur de Conformité Provincial",
        "complianceDesc": "Conformité automatique RECO, BCFSA, RECA",
        "bilingual": "Véritable IA Bilingue",
        "bilingualDesc": "Conversations contextuelles anglais-français",
        "data": "Résidence des Données Canadiennes",
        "dataDesc": "Toutes les données stockées sur des serveurs canadiens"
      },
      "cta": {
        "title": "Rejoignez 500+ Agents Canadiens qui Développent leur Entreprise avec l'IA",
        "subtitle": "Commencez à conclure plus de ventes avec l'automatisation par IA aujourd'hui",
        "urgency": "⚡ Places limitées ce mois-ci • Rejoignez les 14 agents qui se sont inscrits cette semaine",
        "bookDemo": "Réserver Votre Démo Gratuite",
        "getStarted": "Commencer"
      },
      "demoPage": {
        "title": "Voyez Realtor Desk AI en Action",
        "subtitle": "Planifiez une démo personnalisée et voyez comment nous pouvons aider votre entreprise",
        "formTitle": "Demander une Démo Personnalisée",
        "fullName": "Nom Complet",
        "email": "Adresse E-mail",
        "phone": "Numéro de Téléphone",
        "brokerage": "Courtage/Entreprise",
        "province": "Province",
        "selectProvince": "Sélectionner la province",
        "currentCrm": "CRM Actuel (si applicable)",
        "selectCrm": "Sélectionner le CRM",
        "teamSize": "Nombre de Membres de l'Équipe",
        "selectTeam": "Sélectionner la taille de l'équipe",
        "challenge": "Plus Grand Défi",
        "selectChallenge": "Sélectionner le défi",
        "comments": "Commentaires/Questions",
        "commentsPlaceholder": "Parlez-nous de vos besoins...",
        "submit": "Demander une Démo",
        "submitting": "Envoi en cours...",
        "orGetStarted": "Ou",
        "getStartedNow": "commencez",
        "getStartedRight": "tout de suite",
        "whatToExpect": "À Quoi S'Attendre",
        "discovery": "Appel de Découverte (15 min)",
        "discoveryDesc": "Nous en apprenons plus sur votre entreprise, vos défis et vos objectifs",
        "liveDemo": "Démo en Direct (30 min)",
        "liveDemoDesc": "Voyez Realtor Desk AI en action avec des exemples spécifiques à votre marché",
        "onboarding": "Intégration Personnalisée",
        "onboardingDesc": "Démarrez avec une intégration personnalisée et un support",
        "contactInfo": "Informations de Contact",
        "emailLabel": "E-mail",
        "phoneLabel": "Téléphone",
        "addressLabel": "Adresse",
        "exploreOwn": "Vous préférez explorer par vous-même?",
        "exploreDesc": "Commencez aujourd'hui - aucune démo requise",
        "getStartedBtn": "Commencer"
      },
      "contactPage": {
        "title": "Contactez-Nous",
        "subtitle": "Vous avez des questions? Nous sommes là pour vous aider à transformer votre entreprise immobilière avec l'IA",
        "emailUs": "Envoyez-nous un E-mail",
        "callUs": "Appelez-nous",
        "visitUs": "Visitez-nous",
        "hours": "Heures d'Ouverture",
        "hoursLine1": "Lundi - Vendredi: 9h00 - 18h00 EST",
        "hoursLine2": "Samedi: 10h00 - 16h00 EST",
        "hoursLine3": "Dimanche: Fermé",
        "sendMessage": "Envoyez-nous un Message",
        "name": "Nom Complet",
        "email": "E-mail",
        "phone": "Téléphone",
        "message": "Message",
        "messagePlaceholder": "Dites-nous comment nous pouvons vous aider...",
        "send": "Envoyer le Message",
        "sending": "Envoi...",
        "mapPlaceholder": "Placeholder intégration carte"
      },
      "footer": {
        "tagline": "Solutions IA pour les professionnels de l'immobilier canadiens.",
        "poweredBy": "Propulsé par Brainfy AI Inc",
        "product": "Produit",
        "features": "Fonctionnalités",
        "pricing": "Tarification",
        "canadianMarket": "Marché Canadien",
        "requestDemo": "Demander une Démo",
        "resources": "Ressources",
        "blog": "Blog",
        "integrations": "Intégrations",
        "helpCenter": "Centre d'Aide",
        "systemStatus": "État du Système",
        "contact": "Contactez-nous",
        "contactForm": "Formulaire de Contact →",
        "privacyPolicy": "Politique de Confidentialité",
        "termsOfService": "Conditions d'Utilisation",
        "allRights": "Tous droits réservés."
      },
      "exitPopup": {
        "title": "Attendez! Avant de Partir...",
        "subtitle": "Obtenez notre guide gratuit: \"10 Façons dont l'IA Peut Tripler Vos Ventes Immobilières\"",
        "emailPlaceholder": "Entrez votre e-mail",
        "submit": "Envoyez-moi le Guide Gratuit",
        "submitting": "Envoi...",
        "noSpam": "Pas de spam. Désabonnez-vous à tout moment."
      },
      "chat": {
        "title": "Discutez avec nous",
        "greeting": "👋 Bonjour! Vous avez des questions sur Realtor Desk AI? Envoyez-nous un message et nous vous répondrons immédiatement.",
        "placeholder": "Tapez votre message...",
        "send": "Envoyer le Message",
        "emailUs": "Ou envoyez-nous un e-mail: support@realtordesk.ai"
      },
      "testimonials": {
        "quote1": "J'ai conclu 14 ventes supplémentaires au T1 en utilisant Realtor Desk AI. Le scoring prédictif des prospects change la donne.",
        "name1": "Sarah Chen",
        "title1": "Meilleure Productrice",
        "company1": "Royal LePage Toronto",
        "quote2": "Le chatbot IA bilingue capture des prospects 24/7. Je me réveille avec des rendez-vous qualifiés chaque matin.",
        "name2": "Marc Dubois",
        "title2": "Courtier",
        "company2": "RE/MAX Québec",
        "quote3": "Mes clôtures de transactions sont passées de 60 à 35 jours. La coordination par IA est incroyable.",
        "name3": "Priya Sharma",
        "title3": "Représentante des Ventes",
        "company3": "Century 21 Vancouver"
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
