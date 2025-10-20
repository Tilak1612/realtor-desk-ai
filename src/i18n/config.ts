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
        title: "The AI Platform Built for Canadian Realtors",
        subtitle: "24/7 AI-powered lead capture, call handling, and email automation—designed for the Canadian market with CREA DDF® integration and full bilingual support.",
        getStarted: "Start Closing More Deals",
        watchDemo: "Book Your Free Demo",
        trustLine: "No credit card required • Cancel anytime • Free onboarding included",
        badge1: "CREA Certified",
        badge2: "SOC 2 Compliant",
        badge3: "50+ Beta Users",
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
            ctaYearly: "Start 30-Day Free Trial"
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
      },
      problem: {
        title: "Tired of Missing Leads While You Sleep?",
        lostOpportunities: {
          title: "Lost Opportunities",
          text: "67% of leads contact agents outside business hours. Are you there to respond?"
        },
        toolOverload: {
          title: "Tool Overload",
          text: "Juggling 5+ platforms for chat, email, calls, and CRM. There's a better way."
        },
        wastedSpend: {
          title: "Wasted Ad Spend",
          text: "You pay for leads, but slow response times mean competitors close them first."
        }
      },
      solution: {
        title: "Meet Your 24/7 AI Real Estate Team",
        chatbot: {
          title: "Intelligent Lead Capture",
          feature1: "Answers property questions instantly",
          feature2: "Qualifies buyers/sellers automatically",
          feature3: "Captures contact info & preferences",
          feature4: "Bilingual (English/French)",
          feature5: "Works on your website & social media"
        },
        voice: {
          title: "Smart Call Handling",
          feature1: "Takes calls when you're busy",
          feature2: "Schedules showings automatically",
          feature3: "Natural-sounding Canadian voice",
          feature4: "Routes hot leads to your phone",
          feature5: "Records & transcribes every call"
        },
        email: {
          title: "Follow-Up That Never Stops",
          feature1: "Responds to inquiries instantly",
          feature2: "Sends personalized property matches",
          feature3: "Nurtures leads over 90+ days",
          feature4: "Integrates with your email",
          feature5: "CASL-compliant unsubscribe"
        }
      },
      dashboard: {
        title: "Everything in One Place",
        subtitle: "Manage all your conversations, leads, and insights from a single powerful dashboard",
        feature1: "All conversations (chat, voice, email) in one view",
        feature2: "AI-powered lead scoring highlights hot prospects",
        feature3: "Real-time notifications for urgent inquiries",
        feature4: "One-click response templates",
        feature5: "Performance analytics & ROI tracking"
      },
      canadian: {
        title: "Built for the Canadian Market",
        bilingual: "Bilingual Support (EN/FR)",
        mls: "Integrates with Canadian MLS Systems",
        compliant: "PIPEDA & CASL Compliant",
        timezones: "All 6 Canadian Time Zones Covered",
        crea: "CREA Code of Ethics Aligned",
        pricing: "Pricing in CAD"
      },
      howItWorks: {
        title: "Get Up and Running in Minutes",
        step1: {
          title: "Sign Up",
          time: "2 minutes",
          description: "Create account, choose your plan"
        },
        step2: {
          title: "Connect Your Tools",
          time: "5 minutes",
          description: "Link CRM, email, website"
        },
        step3: {
          title: "Train Your AI",
          time: "10 minutes",
          description: "Add property info, FAQs, your style"
        },
        step4: {
          title: "Go Live",
          time: "Instant",
          description: "AI starts capturing leads 24/7"
        }
      },
      faq: {
        title: "Frequently Asked Questions",
        q1: {
          question: "Is RealtorDesk AI ready for production use?",
          answer: "We're currently in public beta with 50+ active realtors across Canada. The platform is fully functional and stable, but we're actively gathering feedback and adding features. Beta users help shape our roadmap and receive lifetime discounts."
        },
        q2: {
          question: "What does 'beta' mean for me?",
          answer: "You get full access to all features at a discounted rate. We may add/modify features based on feedback. You'll receive priority support and direct access to our team. Your pricing is locked in for life—you'll never pay more than your beta rate."
        },
        q3: {
          question: "Can I trust the platform with my client data?",
          answer: "Absolutely. We use bank-level encryption (AES-256), store data exclusively in Canadian data centers (Toronto/Vancouver), and follow SOC 2 Type II controls. We're PIPEDA-ready with full right-to-erasure and breach notification protocols."
        },
        q4: {
          question: "What if the platform doesn't work as described?",
          answer: "We offer a 30-day money-back guarantee. If you're not satisfied for any reason, we'll refund you in full. During beta, we also offer unlimited support to ensure your success."
        },
        q5: {
          question: "Are the '300% conversion increase' claims real?",
          answer: "This metric comes from our pilot program participants who saw an average 300% improvement in lead response time, which correlated with increased conversions. Individual results vary based on market, lead quality, and how you use the platform. We're tracking metrics as we scale."
        },
        q6: {
          question: "What certifications do you actually have?",
          answer: "We're built on SOC 2 Type II compliant infrastructure and follow PIPEDA requirements. Our CREA DDF® integration is compatible with official data feeds. As we exit beta, we'll complete formal third-party audits and display certification badges."
        },
        q7: {
          question: "Does the AI sound robotic?",
          answer: "Our AI uses advanced natural language processing and sounds remarkably human. For voice calls, we use Canadian-accented voices that clients find warm and professional."
        },
        q8: {
          question: "How long does setup take?",
          answer: "Most agents are fully operational within 20 minutes. Our setup wizard guides you through connecting your tools, training the AI on your listings, and customizing responses."
        },
        q9: {
          question: "What if the AI can't answer a question?",
          answer: "The AI seamlessly escalates complex questions to you via SMS or phone. It provides full conversation context so you can pick up exactly where it left off."
        },
        q10: {
          question: "Is this CASL compliant?",
          answer: "Absolutely. RealtorDesk.ai is built specifically for Canadian regulations. All emails include proper sender identification, consent tracking, and easy unsubscribe options."
        },
        q11: {
          question: "Which CRMs do you integrate with?",
          answer: "We currently integrate with Follow Up Boss, Brivity, LionDesk, and RealtyJuggler - the most popular CRMs among Canadian agents."
        },
        q12: {
          question: "Can I customize the AI's responses?",
          answer: "Yes! You control the AI's personality, response templates, and which questions it handles vs. escalates to you. It learns your style over time."
        }
      },
      cta: {
        title: "Ready to Never Miss a Lead Again?",
        subtitle: "Join 500+ Canadian realtors using AI to close more deals",
        button: "Start Your Free 14-Day Trial",
        note: "No credit card required • Setup in 20 minutes • Cancel anytime"
      },
      mobileCTA: {
        title: "Start Your Free Trial",
        subtitle: "Join 500+ Canadian Realtors"
      },
      footer: {
        tagline: "AI-Powered Real Estate Success",
        product: "Product",
        features: "Features",
        pricing: "Pricing",
        howItWorks: "How It Works",
        integrations: "Integrations",
        roadmap: "Roadmap",
        status: "Status Page",
        resources: "Resources",
        blog: "Blog",
        helpCenter: "Help Center",
        apiDocs: "API Docs",
        videoTutorials: "Video Tutorials",
        caseStudies: "Case Studies",
        webinars: "Webinars",
        company: "Company",
        about: "About Us",
        contact: "Contact",
        careers: "Careers",
        privacy: "Privacy Policy",
        terms: "Terms of Service",
        casl: "CASL Compliance",
        copyright: "© 2025 RealtorDesk.ai. All rights reserved.",
        madeInCanada: "Made in Canada 🇨🇦 for Canadian Realtors"
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
        title: "La Plateforme IA Conçue pour les Agents Immobiliers Canadiens",
        subtitle: "Capture de prospects 24/7, gestion d'appels et automation par courriel—conçue pour le marché canadien avec intégration CREA DDF® et support bilingue complet.",
        getStarted: "Commencer à Conclure Plus",
        watchDemo: "Réserver Votre Démo Gratuite",
        trustLine: "Aucune carte de crédit requise • Annulez à tout moment • Intégration gratuite incluse",
        badge1: "Certifié CREA",
        badge2: "Conforme SOC 2",
        badge3: "50+ Utilisateurs Bêta",
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
            ctaYearly: "Commencer l'Essai Gratuit de 30 Jours"
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
      },
      problem: {
        title: "Fatigué de Manquer des Prospects Pendant Votre Sommeil?",
        lostOpportunities: {
          title: "Opportunités Perdues",
          text: "67% des prospects contactent les agents en dehors des heures d'ouverture. Êtes-vous là pour répondre?"
        },
        toolOverload: {
          title: "Surcharge d'Outils",
          text: "Jongler avec 5+ plateformes pour chat, email, appels et CRM. Il y a une meilleure façon."
        },
        wastedSpend: {
          title: "Dépenses Publicitaires Gaspillées",
          text: "Vous payez pour des prospects, mais les temps de réponse lents signifient que les concurrents les concluent en premier."
        }
      },
      solution: {
        title: "Rencontrez Votre Équipe Immobilière IA 24/7",
        chatbot: {
          title: "Capture de Prospects Intelligente",
          feature1: "Répond aux questions sur les propriétés instantanément",
          feature2: "Qualifie les acheteurs/vendeurs automatiquement",
          feature3: "Capture les coordonnées et préférences",
          feature4: "Bilingue (Anglais/Français)",
          feature5: "Fonctionne sur votre site Web et réseaux sociaux"
        },
        voice: {
          title: "Gestion d'Appels Intelligente",
          feature1: "Prend les appels quand vous êtes occupé",
          feature2: "Planifie les visites automatiquement",
          feature3: "Voix canadienne au son naturel",
          feature4: "Achemine les prospects chauds vers votre téléphone",
          feature5: "Enregistre et transcrit chaque appel"
        },
        email: {
          title: "Suivi Qui Ne S'Arrête Jamais",
          feature1: "Répond aux demandes instantanément",
          feature2: "Envoie des correspondances de propriétés personnalisées",
          feature3: "Nourrit les prospects pendant plus de 90 jours",
          feature4: "S'intègre avec votre email",
          feature5: "Désinscription conforme à la LCAP"
        }
      },
      dashboard: {
        title: "Tout en Un Seul Endroit",
        subtitle: "Gérez toutes vos conversations, prospects et perspectives depuis un tableau de bord puissant et unique",
        feature1: "Toutes les conversations (chat, voix, email) en une vue",
        feature2: "Le scoring de prospects propulsé par l'IA met en évidence les prospects chauds",
        feature3: "Notifications en temps réel pour les demandes urgentes",
        feature4: "Modèles de réponse en un clic",
        feature5: "Analyses de performance et suivi du ROI"
      },
      canadian: {
        title: "Conçu pour le Marché Canadien",
        bilingual: "Support Bilingue (EN/FR)",
        mls: "S'intègre avec les Systèmes MLS Canadiens",
        compliant: "Conforme PIPEDA et LCAP",
        timezones: "Couvre les 6 Fuseaux Horaires Canadiens",
        crea: "Aligné avec le Code d'Éthique CREA",
        pricing: "Tarification en CAD"
      },
      howItWorks: {
        title: "Opérationnel en Quelques Minutes",
        step1: {
          title: "Inscription",
          time: "2 minutes",
          description: "Créez un compte, choisissez votre plan"
        },
        step2: {
          title: "Connectez Vos Outils",
          time: "5 minutes",
          description: "Liez CRM, email, site Web"
        },
        step3: {
          title: "Entraînez Votre IA",
          time: "10 minutes",
          description: "Ajoutez infos propriétés, FAQ, votre style"
        },
        step4: {
          title: "En Direct",
          time: "Instantané",
          description: "L'IA commence à capturer des prospects 24/7"
        }
      },
      faq: {
        title: "Questions Fréquemment Posées",
        q1: {
          question: "RealtorDesk AI est-il prêt pour une utilisation en production?",
          answer: "Nous sommes actuellement en bêta publique avec plus de 50 agents immobiliers actifs à travers le Canada. La plateforme est entièrement fonctionnelle et stable, mais nous recueillons activement des commentaires et ajoutons des fonctionnalités. Les utilisateurs bêta aident à façonner notre feuille de route et reçoivent des réductions à vie."
        },
        q2: {
          question: "Que signifie 'bêta' pour moi?",
          answer: "Vous obtenez un accès complet à toutes les fonctionnalités à un tarif réduit. Nous pouvons ajouter/modifier des fonctionnalités en fonction des commentaires. Vous recevrez un support prioritaire et un accès direct à notre équipe. Vos tarifs sont verrouillés à vie—vous ne paierez jamais plus que votre tarif bêta."
        },
        q3: {
          question: "Puis-je faire confiance à la plateforme avec les données de mes clients?",
          answer: "Absolument. Nous utilisons un chiffrement de niveau bancaire (AES-256), stockons les données exclusivement dans des centres de données canadiens (Toronto/Vancouver), et suivons les contrôles SOC 2 Type II. Nous sommes conformes à la LPRPDE avec droit complet à l'effacement et protocoles de notification de violation."
        },
        q4: {
          question: "Que se passe-t-il si la plateforme ne fonctionne pas comme décrit?",
          answer: "Nous offrons une garantie de remboursement de 30 jours. Si vous n'êtes pas satisfait pour quelque raison que ce soit, nous vous rembourserons intégralement. Pendant la bêta, nous offrons également un support illimité pour assurer votre succès."
        },
        q5: {
          question: "Les affirmations d'augmentation de conversion de 300% sont-elles réelles?",
          answer: "Cette métrique provient de nos participants au programme pilote qui ont constaté une amélioration moyenne de 300% du temps de réponse aux prospects, ce qui est corrélé avec une augmentation des conversions. Les résultats individuels varient en fonction du marché, de la qualité des prospects et de la façon dont vous utilisez la plateforme. Nous suivons les métriques à mesure que nous nous développons."
        },
        q6: {
          question: "Quelles certifications avez-vous réellement?",
          answer: "Nous sommes construits sur une infrastructure conforme SOC 2 Type II et suivons les exigences de la LPRPDE. Notre intégration CREA DDF® est compatible avec les flux de données officiels. Alors que nous quittons la bêta, nous compléterons des audits tiers formels et afficherons des badges de certification."
        },
        q7: {
          question: "L'IA sonne-t-elle robotique?",
          answer: "Notre IA utilise un traitement du langage naturel avancé et sonne remarquablement humaine. Pour les appels vocaux, nous utilisons des voix à accent canadien que les clients trouvent chaleureuses et professionnelles."
        },
        q8: {
          question: "Combien de temps prend la configuration?",
          answer: "La plupart des agents sont pleinement opérationnels en 20 minutes. Notre assistant de configuration vous guide dans la connexion de vos outils, la formation de l'IA sur vos annonces et la personnalisation des réponses."
        },
        q9: {
          question: "Que se passe-t-il si l'IA ne peut pas répondre à une question?",
          answer: "L'IA transmet de manière transparente les questions complexes vers vous par SMS ou téléphone. Elle fournit le contexte complet de la conversation afin que vous puissiez reprendre exactement là où elle s'est arrêtée."
        },
        q10: {
          question: "Est-ce conforme à la LCAP?",
          answer: "Absolument. RealtorDesk.ai est construit spécifiquement pour les réglementations canadiennes. Tous les emails incluent une identification appropriée de l'expéditeur, un suivi du consentement et des options de désinscription faciles."
        },
        q11: {
          question: "Avec quels CRM vous intégrez-vous?",
          answer: "Nous nous intégrons actuellement avec Follow Up Boss, Brivity, LionDesk et RealtyJuggler - les CRM les plus populaires parmi les agents canadiens."
        },
        q12: {
          question: "Puis-je personnaliser les réponses de l'IA?",
          answer: "Oui! Vous contrôlez la personnalité de l'IA, les modèles de réponse et les questions qu'elle gère par rapport à celles qu'elle vous transmet. Elle apprend votre style au fil du temps."
        }
      },
      cta: {
        title: "Prêt à Ne Plus Jamais Manquer un Prospect?",
        subtitle: "Rejoignez 500+ agents immobiliers canadiens utilisant l'IA pour conclure plus de ventes",
        button: "Commencez Votre Essai Gratuit de 14 Jours",
        note: "Aucune carte de crédit requise • Configuration en 20 minutes • Annulez à tout moment"
      },
      mobileCTA: {
        title: "Commencez Votre Essai Gratuit",
        subtitle: "Rejoignez 500+ Agents Canadiens"
      },
      footer: {
        tagline: "Succès Immobilier Propulsé par l'IA",
        product: "Produit",
        features: "Fonctionnalités",
        pricing: "Tarification",
        howItWorks: "Comment Ça Marche",
        integrations: "Intégrations",
        roadmap: "Feuille de Route",
        status: "Page de Statut",
        resources: "Ressources",
        blog: "Blog",
        helpCenter: "Centre d'Aide",
        apiDocs: "Documentation API",
        videoTutorials: "Tutoriels Vidéo",
        caseStudies: "Études de Cas",
        webinars: "Webinaires",
        company: "Entreprise",
        about: "À Propos",
        contact: "Contact",
        careers: "Carrières",
        privacy: "Politique de Confidentialité",
        terms: "Conditions d'Utilisation",
        casl: "Conformité LCAP",
        copyright: "© 2025 RealtorDesk.ai. Tous droits réservés.",
        madeInCanada: "Fabriqué au Canada 🇨🇦 pour les Agents Immobiliers Canadiens"
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
