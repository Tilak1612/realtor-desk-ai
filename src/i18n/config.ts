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
        getStarted: "Start Your 14-Day Free Trial",
        watchDemo: "Book Your Free Demo",
        trustLine: "14 Days Free Trial • No credit card required • Cancel anytime",
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
            ctaMonthly: "Start 14-Day Free Trial",
            ctaYearly: "Start 14-Day Free Trial"
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
        button: "Start Your 14-Day Free Trial",
        note: "14 Days Free • No credit card required • Cancel anytime"
      },
      mobileCTA: {
        title: "Start Your 14-Day Free Trial",
        subtitle: "Join 500+ Canadian Realtors"
      },
      trustTransparency: {
        title: "Built on Trust & Transparency",
        beta: {
          title: "Beta Program",
          description: "We're currently in beta with select Canadian realtors. Join our pilot program and help shape the future of AI in real estate.",
          badge: "Limited Spots Available"
        },
        results: {
          title: "Real Results",
          description: "Performance metrics based on our pilot program with 50+ active users. Individual results may vary based on market conditions and usage.",
          disclaimer: "*Results from pilot participants"
        },
        security: {
          title: "Security First",
          description: "SOC 2 compliant architecture, PIPEDA-ready data handling, and enterprise-grade security from day one."
        },
        canadian: {
          title: "Canadian Built",
          description: "Designed specifically for Canadian realtors with data residency in Toronto/Vancouver and full bilingual support."
        },
        disclaimer: "RealtorDesk AI is currently in beta. All performance metrics are based on pilot program results. Individual outcomes may vary."
      },
      betaCommunity: {
        title: "Join Our Growing Beta Community",
        participants: "50+ Beta Participants",
        limitedSpots: "Limited Beta Spots Available",
        resultsTitle: "Real Results from Our Beta Community",
        resultsSubtitle: "Canadian realtors are already seeing measurable results. Here's what early adopters are experiencing:",
        testimonialDisclaimer: "*Testimonials represent individual experiences from our pilot program. Results vary and are not guaranteed. Average results may differ.",
        ctaTitle: "Ready to Join Our Beta Program?",
        ctaSubtitle: "Limited spots available. Be part of shaping the future of real estate AI in Canada.",
        ctaButton: "Apply for Beta Access",
        ctaNote: "Beta participants get lifetime discounts and priority feature access",
        testimonials: {
          sarah: {
            quote: "I was skeptical about AI, but after the first week, I had 3 showings booked while I was sleeping. The voice agent sounds natural and captures all the details I need.",
            brokerage: "Independent Agent",
            stats: {
              leads: "leads captured in first month",
              showings: "showings booked automatically",
              deals: "deals closed"
            },
            badge: "Beta Participant Since Nov 2024"
          },
          marc: {
            quote: "The seamless English/French switching is perfect for Montreal. My AI handles both languages naturally, which has opened up my market significantly.",
            brokerage: "Century 21",
            stats: {
              increase: "increase in francophone leads",
              response: "of inquiries answered <2 minutes",
              saved: "hours/week saved"
            },
            badge: "Beta Participant Since Dec 2024"
          },
          jennifer: {
            quote: "Our team of 5 agents now operates like a team of 15. The unified dashboard means no lead falls through the cracks, even when we're all busy.",
            brokerage: "RE/MAX Team Lead",
            stats: {
              responseTime: "Team response time",
              leadIncrease: "increase in qualified leads",
              additionalDeals: "additional deals in Q1"
            },
            badge: "Beta Participant Since Jan 2025"
          }
        }
      },
      aiActive: "AI ACTIVE",
      roiCalculator: {
        title: "Calculate Your Potential ROI",
        subtitle: "See your projected returns with conservative estimates",
        monthlyLeads: "Current Monthly Leads",
        leadsPerMonth: "leads/month",
        conversionRate: "Current Conversion Rate",
        avgCommission: "Average Commission per Deal",
        planSelection: "Plan Selection",
        solo: "Solo",
        team: "Team",
        withoutAI: "Without RealtorDesk AI",
        withAI: "With RealtorDesk AI",
        dealsPerMonth: "Deals per month:",
        monthlyRevenue: "Monthly revenue:",
        annualRevenue: "Annual revenue:",
        improvedConversion: "Improved conversion:",
        platformCost: "Platform cost:",
        netGain: "Net Gain:",
        roi: "ROI:",
        disclaimer1: "Conservative estimate based on improved response time and 24/7 availability.",
        disclaimer2: "*Assumes 30% conversion improvement, lower than pilot program average.",
        ctaButton: "See this ROI for yourself—Start Free Trial"
      },
      demoBooking: {
        title: "See RealtorDesk AI in Action",
        demoTitle: "15-Minute Personalized Demo",
        liveDemo: "Live, not recorded",
        whatYouSee: "What you'll see:",
        benefit1: "Live walkthrough of AI chatbot, voice agent, and email automation",
        benefit2: "How to set up in under 15 minutes",
        benefit3: "Custom configuration for your market and needs",
        benefit4: "Q&A with our team",
        benefit5: "Exclusive beta pricing offer",
        testimonial: "\"The demo sold me instantly. Seeing the AI handle real estate questions in real-time was impressive.\"",
        testimonialAuthor: "- Beta Participant",
        flexibleScheduling: "Flexible Scheduling",
        flexibleSchedulingDesc: "Available across all Canadian time zones. We'll accommodate your schedule.",
        bookYourDemo: "Book Your Demo",
        nameLabel: "Name *",
        namePlaceholder: "Your full name",
        emailLabel: "Email *",
        emailPlaceholder: "your.email@example.com",
        phoneLabel: "Phone *",
        phonePlaceholder: "(555) 123-4567",
        brokerageLabel: "Brokerage *",
        brokeragePlaceholder: "Your brokerage name",
        interestsLabel: "What interests you most? *",
        interestChatbot: "AI Chatbot",
        interestVoice: "Voice Agent",
        interestEmail: "Email Automation",
        interestAll: "All Features",
        detectedTimezone: "Detected timezone:",
        submitButton: "Request Demo",
        submitting: "Submitting...",
        cantFindTime: "Can't find a time? Email",
        andAccommodate: "and we'll accommodate you.",
        successTitle: "Demo Request Received! 🎉",
        successDescription: "We'll contact you within 24 hours to schedule your personalized demo.",
        validationError: "Validation Error",
        errorTitle: "Error",
        errorDescription: "There was an error submitting your request. Please try again.",
        nameRequired: "Name is required",
        emailInvalid: "Invalid email address",
        phoneRequired: "Phone is required",
        brokerageRequired: "Brokerage is required",
        interestsRequired: "Select at least one interest"
      },
      indexPage: {
        socialProof: {
          banner: "Join Our Growing Beta Community",
          betaParticipants: "Beta Participants",
          limitedSpots: "Limited Beta Spots Available"
        },
        credibility: {
          soc2Title: "SOC 2 Compliant",
          soc2Desc: "Enterprise-grade security and data protection",
          pipedaTitle: "PIPEDA Compliant",
          pipedaDesc: "Full Canadian privacy law compliance",
          creaTitle: "CREA Certified",
          creaDesc: "Official CREA DDF® integration partner"
        },
        problemStatement: {
          title: "The Hidden Costs of Outdated Real Estate Technology",
          subtitle: "Traditional CRMs are holding Canadian realtors back from their full potential",
          stat1: "of agents use AI capabilities despite 72% using CRMs",
          stat2: "of buyer inquiries receive NO response",
          stat3: "hours weekly spent on tasks that could be automated",
          stat4: "lead conversion rate with traditional methods"
        },
        solutionOverview: {
          title: "Meet Your AI-Powered Real Estate Operating System",
          subtitle: "Transform how you work with intelligent automation designed specifically for Canadian realtors",
          feature1Title: "Predictive Lead Scoring",
          feature1Desc: "AI analyzes 40+ signals to identify hot leads 3-6 months early. Converts 18% vs industry 5%. Built on 500,000+ Canadian transactions",
          feature2Title: "24/7 Bilingual AI Chatbot",
          feature2Desc: "Captures leads in EN/FR, qualifies buyers, schedules showings, answers 200+ property questions. Never miss a 2 AM inquiry again",
          feature3Title: "Smart Transaction Coordinator",
          feature3Desc: "Automate status updates, document requests, deadline tracking. Cut closing time from 60 to 35 days with 99% accuracy"
        },
        roiDisclaimer: "*ROI calculations are projections based on industry averages and pilot program data. Actual results depend on market conditions, lead quality, individual effort, and other factors. Past performance does not guarantee future results.",
        security: {
          title: "Enterprise-Grade Security & Developer Tools",
          subtitle: "Built for scale, secured for compliance, ready for integration",
          securityTitle: "Security & Compliance",
          sec1: "SOC 2 Type II Certified:",
          sec1Desc: "Annual audits, penetration testing, 99.9% uptime SLA",
          sec2: "PIPEDA Compliant:",
          sec2Desc: "Right to access, delete, data portability. Breach notification <72hrs",
          sec3: "CASL Compliant:",
          sec3Desc: "Express consent tracking, auto-unsubscribe, 24-month proof retention",
          sec4: "Canadian Data Centers:",
          sec4Desc: "All data stored in Toronto/Vancouver. No cross-border transfer",
          sec5: "Encryption:",
          sec5Desc: "TLS 1.3 in transit, AES-256 at rest, end-to-end for sensitive docs",
          sec6: "Access Control:",
          sec6Desc: "Role-based permissions, 2FA, SSO (Enterprise), audit logs",
          apiTitle: "API & Integration Capabilities",
          api1: "REST API:",
          api1Desc: "Full CRUD access to contacts, deals, tasks. Rate limit: 1000 req/min",
          api2: "Webhooks:",
          api2Desc: "Real-time events (new lead, deal closed, task overdue)",
          api3: "CRM Sync:",
          api3Desc: "Pre-built connectors for Brivity, Follow Up Boss, Salesforce, HubSpot",
          api4: "Calendar Integration:",
          api4Desc: "2-way sync with Google/Outlook. Auto-create Zoom links",
          api5: "Email Platforms:",
          api5Desc: "Gmail, Outlook, MailChimp, SendGrid. SMTP/IMAP support",
          api6: "Documentation:",
          api6Desc: "Interactive API docs, SDK (JavaScript/Python), Postman collection",
          viewIntegrations: "View Integration Library",
          performanceTitle: "Platform Performance",
          perf1: "Uptime SLA",
          perf2: "AI Response Time",
          perf3: "Concurrent Users",
          perf4: "Support (Enterprise)"
        },
        finalCTA: {
          title: "Join 500+ Canadian Agents Growing Their Business with AI",
          subtitle: "Start closing more deals with AI-powered automation today",
          startTrial: "Start Your 14-Day Free Trial",
          bookDemo: "Book Your Free Demo",
          note: "⚡ 14 Days Free Trial • No credit card required • Cancel anytime"
        },
        betaNotice: {
          title: "Beta Program Notice",
          description: "RealtorDesk AI is currently in public beta. We're continuously improving based on user feedback. All features, pricing, and metrics are subject to change. Early adopters receive special lifetime pricing."
        }
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
        getStarted: "Commencez Votre Essai Gratuit de 14 Jours",
        watchDemo: "Réserver Votre Démo Gratuite",
        trustLine: "14 Jours Gratuits • Aucune carte de crédit • Annulez à tout moment",
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
        title: "Commencez Votre Essai Gratuit de 14 Jours",
        subtitle: "Rejoignez 500+ Agents Canadiens"
      },
      trustTransparency: {
        title: "Bâti sur la Confiance et la Transparence",
        beta: {
          title: "Programme Bêta",
          description: "Nous sommes actuellement en version bêta avec des agents immobiliers canadiens sélectionnés. Rejoignez notre programme pilote et aidez à façonner l'avenir de l'IA dans l'immobilier.",
          badge: "Places Limitées Disponibles"
        },
        results: {
          title: "Résultats Réels",
          description: "Métriques de performance basées sur notre programme pilote avec plus de 50 utilisateurs actifs. Les résultats individuels peuvent varier selon les conditions du marché et l'utilisation.",
          disclaimer: "*Résultats des participants au programme pilote"
        },
        security: {
          title: "La Sécurité d'Abord",
          description: "Architecture conforme SOC 2, gestion des données prête pour PIPEDA et sécurité de niveau entreprise dès le premier jour."
        },
        canadian: {
          title: "Conçu au Canada",
          description: "Conçu spécifiquement pour les agents immobiliers canadiens avec résidence des données à Toronto/Vancouver et support bilingue complet."
        },
        disclaimer: "RealtorDesk AI est actuellement en version bêta. Toutes les métriques de performance sont basées sur les résultats du programme pilote. Les résultats individuels peuvent varier."
      },
      betaCommunity: {
        title: "Rejoignez Notre Communauté Bêta en Croissance",
        participants: "50+ Participants Bêta",
        limitedSpots: "Places Bêta Limitées",
        resultsTitle: "Résultats Réels de Notre Communauté Bêta",
        resultsSubtitle: "Les agents immobiliers canadiens constatent déjà des résultats mesurables. Voici ce que vivent les premiers adopteurs :",
        testimonialDisclaimer: "*Les témoignages représentent des expériences individuelles de notre programme pilote. Les résultats varient et ne sont pas garantis. Les résultats moyens peuvent différer.",
        ctaTitle: "Prêt à Rejoindre Notre Programme Bêta?",
        ctaSubtitle: "Places limitées disponibles. Participez à façonner l'avenir de l'IA immobilière au Canada.",
        ctaButton: "Postuler pour l'Accès Bêta",
        ctaNote: "Les participants bêta bénéficient de réductions à vie et d'un accès prioritaire aux fonctionnalités",
        testimonials: {
          sarah: {
            quote: "J'étais sceptique à propos de l'IA, mais après la première semaine, j'avais 3 visites réservées pendant que je dormais. L'agent vocal semble naturel et capture tous les détails dont j'ai besoin.",
            brokerage: "Agent Indépendant",
            stats: {
              leads: "prospects capturés le premier mois",
              showings: "visites réservées automatiquement",
              deals: "transactions conclues"
            },
            badge: "Participant Bêta Depuis Nov 2024"
          },
          marc: {
            quote: "Le basculement transparent entre l'anglais et le français est parfait pour Montréal. Mon IA gère les deux langues naturellement, ce qui a considérablement élargi mon marché.",
            brokerage: "Century 21",
            stats: {
              increase: "d'augmentation des prospects francophones",
              response: "des demandes répondues en <2 minutes",
              saved: "heures/semaine économisées"
            },
            badge: "Participant Bêta Depuis Déc 2024"
          },
          jennifer: {
            quote: "Notre équipe de 5 agents fonctionne maintenant comme une équipe de 15. Le tableau de bord unifié signifie qu'aucun prospect ne passe entre les mailles du filet, même lorsque nous sommes tous occupés.",
            brokerage: "Chef d'Équipe RE/MAX",
            stats: {
              responseTime: "Temps de réponse de l'équipe",
              leadIncrease: "d'augmentation des prospects qualifiés",
              additionalDeals: "transactions supplémentaires au T1"
            },
            badge: "Participant Bêta Depuis Jan 2025"
          }
        }
      },
      aiActive: "IA ACTIVE",
      roiCalculator: {
        title: "Calculez Votre ROI Potentiel",
        subtitle: "Voyez vos rendements projetés avec des estimations conservatrices",
        monthlyLeads: "Prospects Mensuels Actuels",
        leadsPerMonth: "prospects/mois",
        conversionRate: "Taux de Conversion Actuel",
        avgCommission: "Commission Moyenne par Transaction",
        planSelection: "Sélection du Plan",
        solo: "Solo",
        team: "Équipe",
        withoutAI: "Sans RealtorDesk AI",
        withAI: "Avec RealtorDesk AI",
        dealsPerMonth: "Transactions par mois:",
        monthlyRevenue: "Revenu mensuel:",
        annualRevenue: "Revenu annuel:",
        improvedConversion: "Conversion améliorée:",
        platformCost: "Coût de la plateforme:",
        netGain: "Gain Net:",
        roi: "ROI:",
        disclaimer1: "Estimation conservatrice basée sur l'amélioration du temps de réponse et la disponibilité 24/7.",
        disclaimer2: "*Suppose une amélioration de conversion de 30%, inférieure à la moyenne du programme pilote.",
        ctaButton: "Voyez ce ROI par vous-même—Commencer l'Essai Gratuit"
      },
      demoBooking: {
        title: "Voyez RealtorDesk AI en Action",
        demoTitle: "Démo Personnalisée de 15 Minutes",
        liveDemo: "En direct, pas enregistré",
        whatYouSee: "Ce que vous verrez:",
        benefit1: "Présentation en direct du chatbot IA, de l'agent vocal et de l'automation des emails",
        benefit2: "Comment configurer en moins de 15 minutes",
        benefit3: "Configuration personnalisée pour votre marché et vos besoins",
        benefit4: "Questions-réponses avec notre équipe",
        benefit5: "Offre de tarification bêta exclusive",
        testimonial: "\"La démo m'a convaincu instantanément. Voir l'IA gérer des questions immobilières en temps réel était impressionnant.\"",
        testimonialAuthor: "- Participant Bêta",
        flexibleScheduling: "Planification Flexible",
        flexibleSchedulingDesc: "Disponible dans tous les fuseaux horaires canadiens. Nous nous adapterons à votre horaire.",
        bookYourDemo: "Réservez Votre Démo",
        nameLabel: "Nom *",
        namePlaceholder: "Votre nom complet",
        emailLabel: "E-mail *",
        emailPlaceholder: "votre.email@exemple.com",
        phoneLabel: "Téléphone *",
        phonePlaceholder: "(555) 123-4567",
        brokerageLabel: "Courtage *",
        brokeragePlaceholder: "Nom de votre courtage",
        interestsLabel: "Qu'est-ce qui vous intéresse le plus? *",
        interestChatbot: "Chatbot IA",
        interestVoice: "Agent Vocal",
        interestEmail: "Automation des E-mails",
        interestAll: "Toutes les Fonctionnalités",
        detectedTimezone: "Fuseau horaire détecté:",
        submitButton: "Demander une Démo",
        submitting: "Envoi...",
        cantFindTime: "Vous ne trouvez pas de créneau? Écrivez à",
        andAccommodate: "et nous vous accommoderons.",
        successTitle: "Demande de Démo Reçue! 🎉",
        successDescription: "Nous vous contacterons dans les 24 heures pour planifier votre démo personnalisée.",
        validationError: "Erreur de Validation",
        errorTitle: "Erreur",
        errorDescription: "Une erreur s'est produite lors de l'envoi de votre demande. Veuillez réessayer.",
        nameRequired: "Le nom est requis",
        emailInvalid: "Adresse e-mail invalide",
        phoneRequired: "Le téléphone est requis",
        brokerageRequired: "Le courtage est requis",
        interestsRequired: "Sélectionnez au moins un intérêt"
      },
      indexPage: {
        socialProof: {
          banner: "Rejoignez Notre Communauté Bêta en Croissance",
          betaParticipants: "Participants Bêta",
          limitedSpots: "Places Bêta Limitées"
        },
        credibility: {
          soc2Title: "Conforme SOC 2",
          soc2Desc: "Sécurité et protection des données de niveau entreprise",
          pipedaTitle: "Conforme PIPEDA",
          pipedaDesc: "Conformité totale aux lois canadiennes sur la vie privée",
          creaTitle: "Certifié CREA",
          creaDesc: "Partenaire officiel d'intégration CREA DDF®"
        },
        problemStatement: {
          title: "Les Coûts Cachés de la Technologie Immobilière Désuète",
          subtitle: "Les CRM traditionnels freinent les agents immobiliers canadiens",
          stat1: "des agents utilisent les capacités IA malgré 72% utilisant des CRM",
          stat2: "des demandes d'acheteurs ne reçoivent AUCUNE réponse",
          stat3: "heures hebdomadaires consacrées à des tâches automatisables",
          stat4: "taux de conversion avec les méthodes traditionnelles"
        },
        solutionOverview: {
          title: "Rencontrez Votre Système d'Exploitation Immobilier Propulsé par l'IA",
          subtitle: "Transformez votre façon de travailler avec l'automation intelligente conçue spécifiquement pour les agents immobiliers canadiens",
          feature1Title: "Score de Prospects Prédictif",
          feature1Desc: "L'IA analyse plus de 40 signaux pour identifier les prospects chauds 3 à 6 mois à l'avance. Convertit 18% vs 5% de l'industrie. Basé sur 500 000+ transactions canadiennes",
          feature2Title: "Chatbot IA Bilingue 24/7",
          feature2Desc: "Capture les prospects en EN/FR, qualifie les acheteurs, planifie les visites, répond à plus de 200 questions sur les propriétés. Ne manquez plus jamais une demande à 2h du matin",
          feature3Title: "Coordinateur de Transactions Intelligent",
          feature3Desc: "Automatisez les mises à jour de statut, les demandes de documents, le suivi des échéances. Réduisez le temps de clôture de 60 à 35 jours avec 99% de précision"
        },
        roiDisclaimer: "*Les calculs de ROI sont des projections basées sur les moyennes de l'industrie et les données du programme pilote. Les résultats réels dépendent des conditions du marché, de la qualité des prospects, des efforts individuels et d'autres facteurs. Les performances passées ne garantissent pas les résultats futurs.",
        security: {
          title: "Sécurité de Niveau Entreprise et Outils pour Développeurs",
          subtitle: "Construit pour l'échelle, sécurisé pour la conformité, prêt pour l'intégration",
          securityTitle: "Sécurité et Conformité",
          sec1: "Certifié SOC 2 Type II:",
          sec1Desc: "Audits annuels, tests de pénétration, SLA de disponibilité de 99,9%",
          sec2: "Conforme PIPEDA:",
          sec2Desc: "Droit d'accès, de suppression, portabilité des données. Notification de violation <72h",
          sec3: "Conforme LCAP:",
          sec3Desc: "Suivi du consentement exprès, désinscription automatique, preuve conservée 24 mois",
          sec4: "Centres de Données Canadiens:",
          sec4Desc: "Toutes les données stockées à Toronto/Vancouver. Aucun transfert transfrontalier",
          sec5: "Chiffrement:",
          sec5Desc: "TLS 1.3 en transit, AES-256 au repos, de bout en bout pour les documents sensibles",
          sec6: "Contrôle d'Accès:",
          sec6Desc: "Permissions basées sur les rôles, 2FA, SSO (Entreprise), journaux d'audit",
          apiTitle: "Capacités API et Intégration",
          api1: "API REST:",
          api1Desc: "Accès CRUD complet aux contacts, offres, tâches. Limite: 1000 req/min",
          api2: "Webhooks:",
          api2Desc: "Événements en temps réel (nouveau prospect, offre conclue, tâche en retard)",
          api3: "Synchronisation CRM:",
          api3Desc: "Connecteurs pré-construits pour Brivity, Follow Up Boss, Salesforce, HubSpot",
          api4: "Intégration Calendrier:",
          api4Desc: "Synchronisation bidirectionnelle avec Google/Outlook. Création auto de liens Zoom",
          api5: "Plateformes Email:",
          api5Desc: "Gmail, Outlook, MailChimp, SendGrid. Support SMTP/IMAP",
          api6: "Documentation:",
          api6Desc: "Documentation API interactive, SDK (JavaScript/Python), collection Postman",
          viewIntegrations: "Voir la Bibliothèque d'Intégration",
          performanceTitle: "Performance de la Plateforme",
          perf1: "SLA de Disponibilité",
          perf2: "Temps de Réponse IA",
          perf3: "Utilisateurs Simultanés",
          perf4: "Support (Entreprise)"
        },
        finalCTA: {
          title: "Rejoignez 500+ Agents Canadiens Qui Développent Leur Entreprise avec l'IA",
          subtitle: "Commencez à conclure plus de ventes avec l'automation propulsée par l'IA aujourd'hui",
          startTrial: "Commencez Votre Essai Gratuit de 14 Jours",
          bookDemo: "Réservez Votre Démo Gratuite",
          note: "⚡ 14 Jours Gratuits • Aucune carte de crédit • Annulez à tout moment"
        },
        betaNotice: {
          title: "Avis sur le Programme Bêta",
          description: "RealtorDesk AI est actuellement en version bêta publique. Nous nous améliorons continuellement en fonction des commentaires des utilisateurs. Toutes les fonctionnalités, tarifs et métriques sont sujets à changement. Les premiers adopteurs bénéficient de tarifs à vie spéciaux."
        }
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
