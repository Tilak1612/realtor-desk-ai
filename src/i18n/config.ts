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
        faq: "FAQ",
        bookDemo: "Book your free demo",
        startClosing: "Start Closing More Deals",
        getStarted: "Get Started",
        giveFeedback: "Give Feedback",
        signedOut: "Signed out successfully",
        searchPlaceholder: "Search contacts, properties, deals...",
        add: "Add",
        addContact: "Contact",
        addProperty: "Property",
        addDeal: "Deal",
        addTask: "Task",
        notifications: "Notifications",
        viewAllNotifications: "View all notifications",
        profile: "Profile",
        settings: "Settings",
        signOut: "Sign out",
        uploadPhoto: "Upload photo",
        changePhoto: "Change photo",
        removePhoto: "Remove photo",
        uploadingPhoto: "Uploading..."
      },
      hero: {
        title: "Close More Deals with AI Built for Canadian Realtors",
        subtitle: "24/7 AI-powered lead capture, call handling, and email automation—designed for the Canadian market with full bilingual support. CREA DDF® integration on the roadmap for Q3 2026.",
        getStarted: "Start Your 14-Day Free Trial",
        watchDemo: "Book your free demo",
        trustLine: "14 Days Free Trial • No credit card required • Cancel anytime",
        badge1: "PIPEDA-Aware Design",
        badge2: "Bilingual EN/FR",
        badge3: "50+ Beta Users",
        conversionBadge: "Conservative 30% Conversion Lift",
        badge: "14-Day Free Trial",
        bullet1: "AI responds to leads instantly, 24/7",
        bullet2: "Built for Canadian agents — PIPEDA, CASL, bilingual EN/FR",
        bullet3: "Bilingual EN/FR",
        testimonial: "\"Captured 3 leads in my first 48 hours I would have lost\"",
        joinAgents: "Join 50+ Canadian agents",
        activeAgents: "Active Agents",
        leads: "Leads",
        aiActive: "AI Active"
      },
      roi: {
        badge: "Calculate Your ROI",
        title: "See Your Potential Savings",
        subtitle: "Discover how much time and money you could save with AI automation"
      },
      home: {
        faq: {
          title: "Frequently Asked Questions",
          subtitle: "Get answers to common questions about RealtorDesk AI",
          moreQuestions: "Have more questions? We're here to help!",
          viewAll: "View All FAQs",
          contactSupport: "Contact Support"
        },
        security: {
          archTitle: "Security-First Architecture",
          archDesc: "Enterprise-grade encryption and security practices protecting your client data",
          pipedaTitle: "PIPEDA-Aware Design",
          pipedaDesc: "Built with Canadian privacy principles — consent management, right to erasure, breach notifications",
          mlsTitle: "Canadian MLS Integration",
          mlsDesc: "Import and sync Canadian property data directly into your CRM",
          bilingualTitle: "Bilingual Support",
          bilingualDesc: "Seamless English & French communication",
          infraTitle: "Canadian-Optimized Infrastructure",
          infraDesc: "Hosted on infrastructure designed to keep your data within Canadian borders",
          aiTitle: "AI Lead Scoring",
          aiDesc: "Prioritize hot leads automatically"
        },
        audience: {
          agentTitle: "For Agents",
          agentDesc: "To automate your marketing programs, capture and convert more leads into transactions.",
          teamTitle: "For Teams",
          teamDesc: "To streamline your sales process, maximize collaboration, and close more team deals.",
          brokerTitle: "For Brokers",
          brokerDesc: "To accelerate profitable growth by boosting agent productivity and lowering operational costs.",
          learnMore: "Learn More"
        },
        socialProof: {
          agents: "agents",
          usingNow: "using now",
          demos: "demos",
          bookedThisWeek: "booked this week",
          joinAgents: "Join agents closing meaningfully more deals"
        },
        credibility: {
          title: "Trusted & Secure"
        },
        demo: {
          title: "See Realtor Desk in Action",
          description: "Watch how AI can transform your real estate business in just 2 minutes",
          watchDemo: "Watch 2-Minute Product Demo",
          bookDemo: "Book a live demo",
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
        tab1: "Predictive CRM",
        tab2: "AI Chatbot",
        tab3: "Market Intelligence",
        tab4: "Transaction Management",
        tab5: "Marketing Automation",
        crm: { h1: "Multi-Dimensional Lead Scoring", p1: "AI analyzes engagement signals including property searches, email opens, social activity, mortgage indicators, and life events to rank your leads", sub1: "Focus on your hottest leads and close more deals", h2: "Conversational Intelligence", p2: "Real-time sentiment analysis across email, text, and chat with urgency detection and automated response suggestions", sub2: "45% more relevant responses, 60% fewer deals falling through", h3: "Automated Data Enrichment", p3: "Autonomous contact profile building from public records, social media, and behavior tracking", sub3: "Dramatically reduce manual data entry with automated profile building" },
        chatbot: { h1: "24/7 Multilingual Engagement", p1: "Intelligent conversations in English and French, handles property inquiries, qualifies leads, schedules showings", sub1: "Maximize after-hours lead capture with AI that never sleeps", h2: "Smart Qualification System", p2: "AI conducts natural conversations to assess buyer readiness, budget, timeline, and preferences", sub2: "Only qualified leads reach your calendar", h3: "Seamless Human Handoff", p3: "AI knows when to transfer to human agent with complete conversation context", sub3: "Never lose a hot lead to automation" },
        market: { h1: "AI-Powered Property Insights (Coming Soon)", p1: "AI-assisted property analysis using local market trends, comparable sales, and neighbourhood data to support your CMA process", sub1: "Faster, data-backed CMAs for your clients", h2: "Off-Market Opportunity Detection", p2: "AI predicts which homeowners are likely to sell 3-6 months before listing", sub2: "Get exclusive listings before competitors", h3: "Real-Time Market Reports", p3: "Automated comparative market analysis with absorption rates, days-on-market trends, price-per-sqft evolution", sub3: "Position yourself as the local market expert" },
        transaction: { h1: "Intelligent Timeline Prediction", p1: "AI forecasts closing dates based on transaction type, parties involved, and historical performance", sub1: "Designed to accelerate your closing timeline with fewer missed steps", h2: "Automated Vendor Coordination", p2: "Smart scheduling of inspectors, appraisers, lawyers with availability optimization", sub2: "75% fewer missed deadlines", h3: "Risk Detection Engine", p3: "Predictive alerts for financing issues, inspection problems, and buyer/seller cold feet", sub3: "Deal fall-through reduced from 12% to 4%" },
        marketing: { h1: "AI Content Generation", p1: "Automated creation of property descriptions, social posts, email campaigns, and neighborhood guides", sub1: "85% less time on marketing content", h2: "Intelligent Distribution", p2: "AI determines optimal posting times, channels, and audience segments for each piece of content", sub2: "150% increase in engagement rates", h3: "Performance Analytics", p3: "ROI tracking by content type, platform, and campaign with improvement recommendations", sub3: "45% reduction in cost per lead" },
        mobile: {
          title: "Work From Anywhere with Our Mobile App",
          subtitle: "Manage your entire real estate business from your phone. Respond to leads, schedule showings, and close deals on the go.",
          appStores: "Available on iOS & Android",
          f1title: "Full CRM Access", f1desc: "View and manage all contacts, leads, and deals from your phone",
          f2title: "Push Notifications", f2desc: "Get instant alerts for new leads, messages, and deal updates",
          f3title: "Offline Mode", f3desc: "Access your data even without internet connection",
          f4title: "Voice Commands", f4desc: "Add notes and create tasks hands-free while driving",
          download: "Download from App Store or Google Play"
        },
        comparison: {
          title: "How We Compare to Leading CRMs",
          disclaimer: "* Pricing and features as of October 2025. Contact competitors directly for current information.",
          feature: "Feature",
          leadScoring: "Predictive Lead Scoring", advancedAI: "✓ Advanced AI", basic: "Basic", manual: "Manual", limited: "Limited",
          chatbot: "24/7 AI Chatbot", bilingual: "✓ Bilingual", addon: "Add-on",
          ddf: "CREA DDF® Integration", comingQ3: "Coming Q3 2026", thirdParty: "Third-party",
          transactionAI: "Transaction AI", fullAutomation: "✓ Full automation",
          compliance: "Canadian Compliance", builtIn: "✓ Built-in",
          marketingAuto: "Marketing Automation", aiGenerated: "✓ AI-generated", templates: "Templates",
          mobileApp: "Mobile App", fullFeatured: "✓ Full-featured",
          startingPrice: "Starting Price", setupFee: "Setup Fee",
          contract: "Contract", monthToMonth: "Month-to-month", annual: "Annual"
        }
      },
      pricing: {
        taxDisclaimer: "Prices are in Canadian dollars (CAD). GST/HST is applied at checkout based on your billing province. Every amount on this page matches what you will see on Stripe's secure checkout.",
        compare: {
          boldtrailCost: "$5,988/year + $999 setup fee",
          loftyCost: "$1,788 – $3,588/year per user",
          ourCost: "$999/year (Founding Member), $0 setup",
          saveCallout: "Save up to 85% compared to BoldTrail, 45% vs Lofty"
        },
        banner: {
          trial: "🎉 14 Days Free Trial - Start Today!",
          launch: "🎉 Launch Pricing — Save $498/year vs. Monthly!"
        },
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
            badge: "14 Days Free Trial",
            description: "Perfect for individual agents ready to scale",
            savings: "Save $789/year with annual billing",
            yearlySavingsDetail: "Save $789 vs monthly ($498 vs regular yearly)",
            period: "/month",
            ctaMonthly: "Start 14-Day Free Trial",
            ctaYearly: "Start 14-Day Free Trial",
            feature1: "Unlimited contacts & leads",
            feature2: "AI-powered predictive CRM",
            feature3: "24/7 AI chatbot (website, SMS, email)",
            feature4: "ROI tracking & analytics",
            feature5: "Email & SMS automation",
            feature6: "Canadian market intelligence",
            feature7: "Bilingual support (EN/FR)",
            feature8: "Mobile app included",
            feature9: "Free migration assistance",
            feature10: "No setup fees",
            feature11: "Priority support"
          },
          team: {
            name: "TEAM",
            badge: "Most Popular",
            description: "For growing teams of 2-5 agents",
            period: "/month",
            cta: "Start 14-Day Free Trial",
            feature1: "Everything in Agent tier, plus:",
            feature2: "Team collaboration tools",
            feature3: "Lead distribution & routing",
            feature4: "Team performance dashboard",
            feature5: "Shared pipeline management",
            feature6: "Advanced reporting & analytics",
            feature7: "Priority support",
            feature8: "Dedicated account manager",
            feature9: "Custom training sessions",
            feature10: "API access available",
            feature11: "White-label options"
          },
          brokerage: {
            name: "BROKERAGE",
            badge: "14 Days Free Trial",
            price: "Custom",
            description: "For brokerages with 6+ agents",
            cta: "Start 14-Day Free Trial",
            feature1: "Everything in Team tier, plus:",
            feature2: "Unlimited agents",
            feature3: "Custom branding & white-label",
            feature4: "Advanced admin controls",
            feature5: "Multi-office management",
            feature6: "Brokerage compliance tools",
            feature7: "Dedicated success manager",
            feature8: "Custom AI model training",
            feature9: "Volume pricing discounts",
            feature10: "Premium 24/7 support"
          }
        },
        compareTable: {
          heading: "Compare with Competitors",
          sub: "See how much you save with Realtor Desk AI",
          firstYear: "First year",
          perYear: "Per year",
          saveThousands: "Save thousands!"
        },
        table: {
          heading: "Feature Comparison: Why Agents Switch to Realtor Desk AI",
          featureCol: "Feature",
          annualPrice: "Annual Price (Agent)",
          setupFee: "Setup Fee",
          aiScoring: "AI Predictive Lead Scoring",
          chatbot: "24/7 Bilingual AI Chatbot",
          migration: "Free Migration",
          compliance: "Canadian Compliance (RECO, BCFSA)",
          mobileApp: "Mobile App",
          totalCost: "Total First Year Cost",
          comingQ3: "(Coming Q3 2026)",
          comingSoon: "Coming Soon",
          extraCost: "Extra Cost",
          partial: "Partial",
          basic: "Basic",
          limited: "Limited",
          varies: "Varies",
          boldtrailSwitch: "💰 Switching from BoldTrail?",
          boldtrailSave: "You'll save $5,988 in year one alone!"
        },
        social: {
          heading: "Real Results from Real Agents",
          stat1: "Additional GCI in first year",
          stat2: "Closed from AI chatbot leads",
          stat3: "Time saved on admin tasks",
          stat3Headline: "15 hrs/wk",
          quote1: "\"Switched from BoldTrail and never looked back. The AI lead scoring is incredible.\"",
          quote2: "\"The 24/7 bilingual chatbot captures leads while I sleep. Game changer.\"",
          quote3: "\"Automation handles follow-ups. I focus on closing deals, not data entry.\""
        },
        annual: {
          heading: "Why Choose Annual Billing?",
          monthly: "Monthly Plan",
          mo: "/mo",
          bestValue: "Best Value",
          annualPlan: "Annual Plan (Founding Member)",
          disclaimer: "Annual billing locks in your Founding Member rate forever. Monthly plans may increase to $149/month after promotion ends.",
          yr: "/yr",
          save: "Save $789/year!",
          foundingBonus: "Founding Member Bonus"
        },
        addons: {
          heading: "Enhance Your Plan with Add-Ons",
          staging: "Virtual Staging AI",
          stagingDesc: "Unlimited virtual staging for all your listings",
          reports: "Advanced Market Reports",
          reportsDesc: "Branded reports with your logo and branding",
          leads: "Lead Generation Module",
          leadsDesc: "Targeted seller/buyer lead identification"
        },
        guarantees: {
          heading: "Our Guarantees to You",
          moneyBack: "30-Day Money-Back Guarantee",
          moneyBackDesc: "Close at least one additional deal in your first 30 days or get a full refund. No questions asked.",
          noContracts: "No Contracts, Cancel Anytime",
          noContractsDesc: "All plans are month-to-month. Cancel anytime with one click. No penalties, no hassles.",
          freeSetup: "Free Setup & Migration",
          freeSetupDesc: "We'll migrate your contacts and data from any CRM for free. Plus complimentary onboarding and training.",
          badge1: "No contracts",
          badge2: "No setup fees",
          badge3: "Cancel anytime"
        },
        faq: {
          heading: "Frequently Asked Questions",
          q1: "Do I need to sign a long-term contract?",
          q2: "Is CREA DDF® integration included?",
          q3: "Can I try before I buy?",
          q4: "What if I exceed my contact limit?",
          q5: "Do you offer training?"
        }
      },
        demo: {
          hero: {
            title: "See",
            titleGradient: "Realtor Desk",
            titleEnd: "in Action",
            subtitle: "Schedule a personalized demo and see how we can help your business"
        },
        form: {
          heading: "Request a Personalized Demo",
          title: "Request a Personalized Demo",
          fullName: "Full Name *",
          fullNamePlaceholder: "John Smith",
          email: "Email Address *",
          emailPlaceholder: "john@example.com",
          phone: "Phone Number *",
          brokerage: "Brokerage/Company",
          brokeragePlaceholder: "ABC Realty",
          province: "Province *",
          provincePlaceholder: "Select province",
          crm: "Current CRM (if any)",
          crmPlaceholder: "Select CRM",
          teamSize: "Number of Team Members",
          teamSizePlaceholder: "Select team size",
          challenge: "Biggest Challenge",
          challengePlaceholder: "Select challenge",
          comments: "Comments/Questions",
          commentsPlaceholder: "Tell us more about your needs…",
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
            liveDemoDesc: "See Realtor Desk in action with examples specific to your market",
            onboarding: "Custom Onboarding",
          onboardingDesc: "Get started with personalized onboarding and support"
        },
        contact: {
          heading: "Contact Information",
          title: "Contact Information",
          email: "Email",
          phone: "Phone",
          address: "Address"
        },
        selfServe: {
          heading: "Prefer to explore on your own?",
          sub: "Start your 14-day free trial - no demo required",
          cta: "Start 14-Day Free Trial"
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
          visitUs: "Our HQ",
          noWalkIn: "Mailing address only — no walk-in office.",
          support: "Support",
          responseTime: "We respond within 24 hours",
          hours: "Business Hours",
          hoursDetails: "Monday - Friday: 9:00 AM - 6:00 PM MT\nSaturday: 10:00 AM - 4:00 PM MT\nSunday: Closed"
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
        },
        consent: "I consent to my information being collected and used as described in the",
        privacyPolicyLink: "Privacy Policy",
        pipedaNote: "Required under PIPEDA - Your data will only be used to respond to your inquiry"
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
      // Landing-page i18n scaffold (R-18a Path A, authorized 2026-04-21).
      // EN values are canonical. FR values below are first-draft from the
      // initial scaffold commit — product will deliver approved FR copy
      // to drop in place. Every `landing.*` key used in a component MUST
      // exist in both locales (enforced by the shape parity test at
      // src/i18n/__tests__/shape.test.ts).
      landing: {
        hero: {
          badge: "Now in public beta · 14-day free trial",
          headline1: "Close more deals.",
          headline2: "Calmly.",
          subtitle: "Realtor Desk answers every lead the instant they land — in French or English, on-brand, PIPEDA-aware. You show up to a shortlist, not a fire drill.",
          ctaPrimary: "Start 14-day free trial",
          ctaSecondary: "Book a 15-min demo",
          trustNoCard: "No credit card",
          trustSetup: "5-min setup",
          trustDdf: "CREA DDF ready"
        },
        heroProduct: {
          deskLive: "Desk AI · Live",
          answering: "answering now",
          leadCaptured: "LEAD CAPTURED",
          hotBadge: "Hot · 92",
          kListing: "LISTING",
          kTimeline: "TIMELINE",
          kLang: "LANG",
          kBudget: "BUDGET FIT",
          vLangDetected: "French (detected)",
          vBudgetPreApproved: "✓ pre-approved",
          vTimelineTomorrow: "Tomorrow 7pm",
          leadMsg: "Bonsoir — est-ce que le condo sur rue St-Laurent est encore disponible ? Je peux visiter demain soir.",
          aiReply: "Oui, Émilie ! Il est disponible. J'ai un créneau demain à 19h ou 19h30 — lequel vous convient ? Je vous envoie l'adresse par texto.",
          avgResponseLabel: "AVG RESPONSE TIME"
        },
        trustStrip: {
          label: "Built with · integrated for"
        },
        featureGrid: {
          eyebrow: "Why Realtor Desk",
          heading: "An AI teammate who speaks Canadian real estate.",
          intro: "Five capabilities, one clean console. No plugins, no duct-tape integrations, no midnight follow-ups.",
          meetDeskAi: "Meet Desk AI",
          chatbotTitle: "24/7 AI chatbot",
          chatbotDesc: "Answers MLS questions, qualifies budget, books showings into your calendar — in the tone you train it on.",
          bilingualTitle: "Bilingual EN · FR",
          bilingualDesc: "Detects the lead's language from the first message. Provincially-ready (OACIQ · RECO · RECA · RECBC) out of the box.",
          pipedaTitle: "PIPEDA-native",
          pipedaDesc: "Canadian-hosted data. Consent timestamps on every lead. CASL-compliant email footers.",
          pipelineTitle: "Pipeline that moves",
          pipelineDesc: "Drag-drop kanban, AI-suggested next step, deal-value rollup — nothing sits stale for 14 days.",
          scoringTitle: "Lead scoring",
          scoringDesc: "Intent, urgency, budget, timeline. A live 0–100 score with the \"why\" in plain English.",
          automationsTitle: "Email automations",
          automationsDesc: "Drip templates written for Canadian markets — Toronto pre-construction, Calgary first-time buyers, Montreal relocs."
        },
        pipelinePreview: {
          eyebrow: "The morning read",
          heading: "You show up to a prioritized pipeline. Not an inbox.",
          body: "Every overnight lead triaged. Hot prospects surface at the top with a timestamped transcript of what AI already said — so your first call is informed, not a cold intro.",
          ctaPrimary: "Try the pipeline",
          ctaSecondary: "Watch 2-min tour",
          colNewLeads: "New leads",
          colContacted: "Contacted",
          colShowingBooked: "Showing booked",
          tagHot: "Hot",
          tagWarm: "Warm"
        },
        compareStrip: {
          eyebrow: "The BoldTrail alternative",
          heading: "US-first tools, retrofit for Canada. Or us — where Canada is the brief.",
          hCapability: "Capability",
          hThem: "BoldTrail",
          hUs: "Realtor Desk",
          rowHosting: "Canadian hosting (PIPEDA)",
          rowBilingual: "Bilingual EN/FR out of the box",
          rowCasl: "CASL-compliant email",
          rowDdf: "CREA DDF® native integration",
          rowCad: "CAD pricing",
          rowTtfr: "Time to first AI response",
          valAddon: "Add-on",
          valManual: "Manual",
          valThirdParty: "3rd-party",
          valUsdPremium: "USD, +20%",
          valDays: "2–3 days",
          valMinutes: "5 minutes",
          valIncluded: "Included",
          seeFull: "See the full comparison"
        },
        testimonial: {
          quote: "Customer story coming soon.",
          author: "",
          role: ""
        },
        closingCta: {
          title: "Start your 14-day trial.",
          body: "No credit card. Full access. Import one lead, send one bilingual reply — then decide.",
          cta: "Claim your desk"
        }
      },
      compareBoldtrail: {
        seoTitle: "Realtor Desk vs BoldTrail — the Canadian-first alternative",
        seoDesc: "BoldTrail is a great platform — for KW agents in Dallas. If you're selling pre-construction in Mississauga or condos in Le Plateau, here's how we compare.",
        eyebrow: "Realtor Desk vs BoldTrail",
        headline1: "One's built for the US.",
        headline2: "One's built for you",
        subtitle: "BoldTrail is a great platform — for Keller Williams agents in Dallas. If you're selling pre-construction in Mississauga or condos in Le Plateau, a few things change.",
        heroCardThemTag: "The US market leader",
        heroCardUsTag: "The Canadian-first alternative",
        statFounded: "Founded",
        statParent: "Parent co.",
        statPricing: "Pricing",
        statLaunched: "Launched",
        statHq: "HQ",
        secCanadianFit: "Canadian fit",
        secAiSpeed: "AI & speed",
        secCost: "Cost",
        fCanadianHosted: "Canadian-hosted data (PIPEDA)",
        vThemUsOnly: "✕ US-only",
        vUsCanadianCenters: "✓ Canadian data centers",
        fBilingual: "Bilingual EN · FR",
        vThemAddonCost: "Add-on, $$",
        vUsBuiltIn: "✓ Built in",
        fCaslFooters: "CASL email auto-footers",
        vThemManualTemplate: "Manual template",
        vUsAutomatic: "✓ Automatic",
        fDdfIntegration: "CREA DDF® integration",
        vThemThirdParty: "3rd-party plugin",
        vUsNative: "✓ Native",
        fCadPricing: "CAD pricing",
        vThemUsdPremium: "USD + ~20% premium",
        vUsPureCad: "✓ Pure CAD",
        fAiResponseTime: "AI lead response time",
        vThemMinutes: "2–3 min",
        vUsFast: "< 45s",
        fBilingualAiOob: "Bilingual AI out of the box",
        vNo: "✕",
        vYes: "✓",
        fVoiceAi2026: "Voice AI coming 2026",
        vThemUnknown: "Unknown",
        vUsQ3Beta: "Q3 2026, in beta now",
        fStartingPrice: "Starting price",
        vThemPriceSetup: "USD $499 setup + $99/mo",
        vUsPriceNoSetup: "CAD $149/mo, no setup",
        fAnnualSingle: "Annual plan (single agent)",
        vThemAnnual: "USD $1,188/yr",
        vUsAnnualSave: "CAD $999/yr — save $789",
        fPerUserAfter5: "Per-user cost after 5",
        vThemPerUser: "USD $49",
        vUsPerUser: "CAD $15",
        fOnboardingFee: "Onboarding fee",
        vThemOnboardingFee: "USD $499",
        vUsIncluded: "Included",
        closingHeadline: "Ready to trade USD for a product that speaks your market?",
        closingBody: "Import your BoldTrail leads in one click. 14-day trial. We'll match your remaining annual contract.",
        closingCtaPrimary: "Start your switch",
        closingCtaSecondary: "Talk to a Canadian"
      },
      marketingHeader: {
        navFeatures: "Features",
        navHowItWorks: "How it works",
        navPricing: "Pricing",
        navCompare: "Compare",
        navResources: "Resources",
        navPartners: "Partners",
        ctaSignIn: "Sign in",
        ctaStartFreeTrial: "Start free trial",
        langAriaLabel: "Language",
        openMenu: "Open menu",
        closeMenu: "Close menu",
        drawerNavLabel: "Main navigation menu",
        drawerTitle: "Realtor Desk navigation"
      },
      pricingRd: {
        seoTitle: "Pricing — Realtor Desk",
        seoDesc: "One price. Every feature. Bilingual, PIPEDA-native, CREA DDF-ready. CAD pricing, 14-day trial, no credit card.",
        eyebrow: "Pricing in CAD",
        heading1: "One price.",
        heading2: "Every",
        heading3: "feature.",
        subtitle: "No AI quotas on Team or Brokerage. No \"growth\" tier that hides the integrations. 14-day trial, no credit card.",
        toggleMonthly: "Monthly",
        toggleAnnual: "Annual · save up to $789/yr",
        taxNote: "Prices shown in CAD. GST/HST applied at checkout based on your billing province. The amount on this page matches what you will see on Stripe's secure checkout.",
        compareHeading: "Compare every feature",
        planSoloName: "Solo",
        planSoloTag: "For the single agent",
        planSoloDesc: "Everything you need to stop losing leads at 2 a.m.",
        planSoloSavings: "Save $789 vs monthly",
        planTeamName: "Team",
        planTeamTag: "For 2–10 agents",
        planTeamDesc: "Shared pipeline, round-robin routing, team reports.",
        planTeamSavings: "Save $591 vs monthly",
        planBrokerageName: "Brokerage",
        planBrokerageTag: "For 10+ agents",
        planBrokerageDesc: "Multi-tenant, SSO, dedicated CSM, FINTRAC tooling.",
        featuredTag: "Most agents pick this",
        ctaStart: "Start free trial",
        ctaTalkSales: "Talk to sales",
        unitMo: "/mo",
        unitYr: "/yr",
        billedMonthly: "CAD · billed monthly",
        billedYearly: "CAD · billed yearly",
        customLabel: "Custom",
        customAnnualLabel: "Annual · CAD",
        perMoEffective: "CAD · ${{amount}}/mo effective",
        featEveryIn: "Everything in {{plan}}, plus —",
        featSoloDesk: "Desk AI chatbot, 500 msgs/mo",
        featSoloBilingual: "Bilingual EN · FR",
        featSoloDdf1: "CREA DDF® feed (1 board)",
        featSoloScoring: "Lead scoring + pipeline",
        featSoloCasl: "CASL-compliant email drip",
        featSoloUser: "1 user",
        featTeamAiUnl: "Unlimited AI messages",
        featTeamDdfUnl: "CREA DDF® feed (unlimited)",
        featTeamRouting: "Round-robin lead routing",
        featTeamReports: "Team reports & leaderboard",
        featTeamSeats: "5 users, $15 each after",
        featBrokerageSso: "SAML SSO + Azure AD",
        featBrokerageCompliance: "FINTRAC & provincial regulator workflows",
        featBrokerageDdfCustom: "Custom DDF mappings",
        featBrokerageCsm: "Dedicated Canadian CSM",
        featBrokerageSla: "99.95% uptime SLA",
        matrixSecAi: "AI & automation",
        matrixSecIntegrations: "Integrations",
        matrixSecCompliance: "Compliance · Canada",
        matrixRowDeskMsgs: "Desk AI chatbot (msgs/mo)",
        matrixRowBilingual: "Bilingual EN · FR",
        matrixRowVoice: "Custom voice training",
        matrixRowScoring: "AI lead scoring",
        matrixRowDdfBoards: "CREA DDF® boards",
        matrixRowStack: "Stripe / Twilio / Resend",
        matrixRowSso: "SAML SSO",
        matrixRowPipeda: "PIPEDA hosting (Canada)",
        matrixRowCasl: "CASL email auto-footer",
        matrixRowFintrac: "FINTRAC workflows",
        matrixValUnl: "Unlimited",
        matrixValUnlCustom: "Unlimited + custom",
        colSolo: "Solo",
        colTeam: "Team",
        colBrokerage: "Brokerage"
      },
      marketingFooter: {
        tagline: "The CRM built for Canadian real estate. Hosted in Canada, bilingual, PIPEDA-native.",
        madeInCanada: "Made in Canada",
        colProduct: "Product",
        colCompare: "Compare",
        colCanada: "Canada",
        colCompany: "Company",
        itemFeatures: "Features",
        itemPricing: "Pricing",
        itemHowItWorks: "How it works",
        itemIntegrations: "Integrations",
        itemRoadmap: "Roadmap",
        itemVsBoldtrail: "vs BoldTrail",
        itemVsFub: "vs Follow Up Boss",
        itemVsLofty: "vs Lofty",
        itemVsIxact: "vs IXACT",
        itemVsWiseAgent: "vs Wise Agent",
        itemPipeda: "PIPEDA",
        itemCasl: "CASL",
        itemFintrac: "FINTRAC",
        itemCreaDdf: "CREA DDF",
        itemBlog: "Blog",
        itemCareers: "Careers",
        itemContact: "Contact",
        itemPrivacy: "Privacy",
        itemTerms: "Terms",
        itemUnsubscribe: "Unsubscribe",
        copyright: "© {{year}} Realtor Desk · Brainfy AI Inc. · Edmonton, AB"
      },
      featuresRd: {
        seoTitle: "Features — Realtor Desk",
        seoDesc: "24/7 bilingual AI chatbot, priority pipeline, PIPEDA-native data, CASL-compliant email automations, CREA DDF sync. The feature set Canadian realtors actually use.",
        badge: "What Desk does",
        heroH1Pre: "One desk that handles the",
        heroH1Italic1: "overnight",
        heroH1Mid: ", so you can handle the",
        heroH1Italic2: "close",
        heroSubtitle: "Desk is your 24/7 bilingual AI colleague. It replies, qualifies, and books — then hands you the conversation when it matters.",
        pillar1Cat: "AI that closes",
        pillar1Title: "24/7 bilingual reply engine",
        pillar1Body: "Desk detects language from the first word and replies in French or English — instantly, day or night. Answers MLS questions, qualifies budget, and books showings straight into your calendar.",
        pillar1Tag1: "EN ↔ FR auto-detect",
        pillar1Tag2: "38s average reply",
        pillar1Tag3: "Books into Google/Outlook",
        pillar2Cat: "Lead intelligence",
        pillar2Title: "Priority pipeline, not an inbox",
        pillar2Body: "Every overnight lead gets triaged. Intent, urgency, budget fit, and timeline scored on one line — so your first call each morning is informed, not cold.",
        pillar2Tag1: "Intent + urgency scoring",
        pillar2Tag2: "Next-best-action queue",
        pillar2Tag3: "CRM since 2020",
        pillar3Cat: "Built for Canada",
        pillar3Title: "PIPEDA-native. CASL-aware. Provincially-ready.",
        pillar3Body: "Canadian data stays in Canadian data centres. Consent is captured at first touch, logged, and revocable. Quebec disclosures and FINTRAC verifications tracked per deal.",
        pillar3Tag1: "AWS ca-central-1",
        pillar3Tag2: "PIPEDA consent log",
        pillar3Tag3: "Quebec bilingual disclosures",
        capsEyebrow: "Everything else",
        capsHeading1: "The plumbing,",
        capsHeadingItalic: "done right",
        capsIntro: "The unsexy stuff most real-estate SaaS forgets. We don't. Each of these is the default, not a premium add-on.",
        capDdfTitle: "CREA DDF sync",
        capDdfBody: "Live MLS listings, 15-minute refresh, pulled straight from your board.",
        capChatTitle: "Website chat widget",
        capChatBody: "Drop-in script. Matches your brokerage colours. Routes overflow to Desk.",
        capEmailTitle: "Email sequences (CASL)",
        capEmailBody: "Drip campaigns with consent gating. Auto-pauses on unsubscribe.",
        capCalendarTitle: "Showing calendar",
        capCalendarBody: "Desk books time slots from your real availability, in the buyer's timezone.",
        capRoutingTitle: "Team routing",
        capRoutingBody: "Round-robin by geography, language, or listing type — whatever fits your team.",
        capRolesTitle: "Roles & permissions",
        capRolesBody: "Team lead, agent, assistant, brokerage admin. Granular access per lead.",
        capAuditTitle: "Activity & audit log",
        capAuditBody: "Every AI action, every agent touch. Immutable. Exportable for compliance.",
        capReportingTitle: "Reporting",
        capReportingBody: "Response time, source ROI, stage conversion, agent leaderboard. CAD throughout.",
        ctaH1Pre: "Free for 14 days.",
        ctaH1Italic: "No card.",
        ctaBody: "Connect your DDF feed, answer a few questions about your brokerage, and Desk is answering leads within 15 minutes.",
        ctaPrimary: "Start free trial",
        ctaSecondary: "Book a demo"
      },
      pageSeo: {
        howItWorksTitle: "How Realtor Desk Works | Setup in 20 Minutes",
        howItWorksDesc: "Get started with Realtor Desk in about 20 minutes. Simple CRM setup, AI tools for Realtors, lead generation configuration, and virtual tour integration.",
        resourcesTitle: "Resources | Guides for Canadian Real Estate Agents",
        resourcesDesc: "Expert guides on AI tools, lead generation, compliance, and marketing for Canadian real estate agents using Realtor Desk.",
        loginTitle: "Sign in — Realtor Desk",
        loginDesc: "Sign in to your Realtor Desk workspace. Canadian-hosted, PIPEDA-aware, bilingual EN/FR.",
        signupTitle: "Start your 14-day free trial — Realtor Desk",
        signupDesc: "Start your 14-day free trial of Realtor Desk. AI lead response, 24/7 chatbot, CREA DDF-ready, CAD pricing. No credit card required.",
        integrationsTitle: "Integrations — Realtor Desk",
        integrationsDesc: "Integrate Realtor Desk via Zapier, Make, and n8n (5,000+ apps). Native connectors on the roadmap. CREA DDF® coming Q3 2026.",
        roadmapTitle: "Product Roadmap — Realtor Desk",
        roadmapDesc: "See what's shipping next. Voice AI, CREA DDF, Centris sync, and more on the Realtor Desk roadmap for 2026.",
        contactTitle: "Contact — Realtor Desk",
        contactDesc: "Get in touch with the Realtor Desk team. Canadian support, bilingual EN/FR, average reply in under 24 hours.",
        faqTitle: "FAQ — Realtor Desk",
        faqDesc: "Answers to common questions about Realtor Desk: pricing in CAD, PIPEDA/CASL compliance, CREA DDF, bilingual support, cancellation.",
        unsubscribeTitle: "Unsubscribe — Realtor Desk",
        unsubscribeDesc: "Manage your Realtor Desk email preferences or unsubscribe. CASL-compliant one-click opt-out.",
        careersTitle: "Careers — Realtor Desk",
        careersDesc: "Build the future of Canadian real estate with Realtor Desk. Remote-friendly roles across engineering, customer success, and growth.",
        privacyTitle: "Privacy Policy — Realtor Desk",
        privacyDesc: "Realtor Desk's privacy policy. Canadian-hosted data, PIPEDA-native, explicit consent tracking, revocable at any time.",
        termsTitle: "Terms of Service — Realtor Desk",
        termsDesc: "Realtor Desk's terms of service, including billing, cancellation, acceptable use, and Canadian jurisdiction.",
        partnersTitle: "Partner Program — Realtor Desk",
        partnersDesc: "Earn recurring commissions by referring Canadian real estate teams to Realtor Desk. 25% starting rate, tiers up to 40%, 90-day last-click attribution, monthly CAD payouts.",
        partnersApplyTitle: "Apply to the Partner Program — Realtor Desk",
        partnersApplyDesc: "Apply to become a Realtor Desk partner. We review every application within 5 business days.",
        partnersTermsTitle: "Partner Program Terms — Realtor Desk",
        partnersTermsDesc: "Realtor Desk Partner Program terms: commission structure, attribution, clawback, prohibited traffic, termination, governing law."
      },
      partnersPage: {
        heroEyebrow: "Partner Program",
        heroHeadline1: "Earn recurring commissions on every Canadian realtor you refer.",
        heroHeadlineItalic: "every",
        heroSubtitle: "Refer coaches, brokerages, and team leads to Realtor Desk. We pay 25% recurring to start, with tiers up to 40% at scale. Canadian-first, CAD payouts, 90-day last-click attribution.",
        heroCtaPrimary: "Apply to become a partner",
        heroCtaSecondary: "Read the program terms",
        heroTrustAttribution: "90-day last-click",
        heroTrustPayout: "Monthly CAD payouts",
        heroTrustReview: "Applications reviewed in 5 business days",
        commissionsEyebrow: "How you earn",
        commissionsHeading: "Starting rate is 25%. Tiers climb with your active referrals.",
        commissionsBody: "Every paying customer you refer counts toward your tier. The commission rate snapshots at the moment each invoice is paid — later promotions don't retro-rate earlier commissions.",
        tierStarterName: "Starter",
        tierStarterRate: "25%",
        tierStarterRule: "0–10 active referrals",
        tierStarterBody: "Recurring commission on every paid invoice, first 12 months of each customer's subscription.",
        tierGrowthName: "Growth",
        tierGrowthRate: "30%",
        tierGrowthRule: "11–25 active referrals",
        tierGrowthBody: "Rate lifts automatically once 11 of your referrals are actively paying.",
        tierEliteName: "Elite",
        tierEliteRate: "40%",
        tierEliteRule: "26+ active referrals",
        tierEliteBody: "Top tier. Reserved for partners who bring consistent, qualified Canadian real-estate volume.",
        tierAmbassadorName: "Ambassador",
        tierAmbassadorRate: "20%",
        tierAmbassadorRule: "Invitation-only track",
        tierAmbassadorBody: "Partnered coaches, educators, and brand ambassadors who get co-marketing support at a fixed rate.",
        howItWorksEyebrow: "How it works",
        howItWorksHeading: "Three steps, no contracts to sign to get started.",
        step1Number: "01",
        step1Title: "Apply",
        step1Body: "Fill out the partner application. We review every submission within 5 business days and approve partners whose audience is a fit for the Canadian realtor market.",
        step2Number: "02",
        step2Title: "Share your link",
        step2Body: "Once approved, you get a referral link and a set of co-branded marketing assets. Post it on your site, email list, YouTube channel, or newsletter — last-click attribution works across channels.",
        step3Number: "03",
        step3Title: "Get paid",
        step3Body: "Every paid invoice triggers a commission snapshot on your dashboard. We pay monthly once you clear CAD $50. Interac e-Transfer for Canadian partners; Wise or PayPal for international.",
        whoEyebrow: "Who's a fit",
        whoHeading: "Most partners fall into one of four archetypes.",
        whoCreatorTitle: "Real estate coaches and content creators",
        whoCreatorBody: "YouTube educators, LinkedIn voices, newsletter authors. Canadian agents trust voices that sound like them — not US-first ad channels.",
        whoBrokerageTitle: "Brokerage leaders and team builders",
        whoBrokerageBody: "If you run a team of 10+ agents, referring your brokerage gets you the Elite tier rate on every seat.",
        whoConsultantTitle: "PropTech consultants and integrators",
        whoConsultantBody: "You already sell CRM setup, automation audits, or tech-stack migrations. Add Realtor Desk as the Canadian-first recommendation.",
        whoAgencyTitle: "Marketing agencies serving realtors",
        whoAgencyBody: "White-label-friendly. We'll train your team on the product so you can onboard clients without escalating to us every time.",
        faqEyebrow: "FAQ",
        faqHeading: "The details partners always ask about.",
        faqAttributionQ: "How does attribution work?",
        faqAttributionA: "Last-click, 90-day cookie. If a lead clicks your link and signs up within 90 days, you get the commission — even if they clicked another partner's link later, the most recent one wins. Clearing the cookie resets the window.",
        faqClawbackQ: "What happens if a customer refunds?",
        faqClawbackA: "We claw back commissions on refunds within a 60-day window. If the commission hasn't been paid out yet, we cancel it. If it's already been paid, we deduct the equivalent from your next payout — never charge back money that's already hit your account.",
        faqPayoutQ: "When do I get paid?",
        faqPayoutA: "Monthly, on the 15th, for all commissions that cleared the 60-day clawback window in the prior month. Minimum payout is CAD $50; balances under that roll forward.",
        faqCurrencyQ: "What currency?",
        faqCurrencyA: "Payouts default to CAD. International partners can choose USD in their settings. Commissions are always recorded in the invoice's original currency plus a CAD-equivalent snapshot so your dashboard totals don't drift when exchange rates move.",
        faqDisallowedQ: "What traffic isn't allowed?",
        faqDisallowedA: "No self-referrals, no incentivized traffic (cashback / loyalty sites), no bidding on Realtor Desk branded keywords, no misleading reviews. Full rules in the program terms.",
        faqStatusQ: "Is the program live right now?",
        faqStatusA: "The program is open for applications. The self-serve partner dashboard ships once our platform migration completes — until then we process approvals and send payout reports manually every month. You'll never miss a commission; attribution is tracked from day one.",
        ctaFinalHeading: "Ready to start earning?",
        ctaFinalBody: "Applications take about 5 minutes. We respond within 5 business days.",
        ctaFinalPrimary: "Apply to become a partner",
        ctaFinalSecondary: "Read the program terms"
      },
      partnersApply: {
        pageHeading: "Apply to the Realtor Desk Partner Program",
        pageSubtitle: "Tell us who you are, how you'll promote Realtor Desk, and who your audience is. We review every application within 5 business days.",
        sectionAbout: "About you",
        sectionAudience: "Your audience",
        sectionConsent: "Consent",
        fieldFullName: "Full name *",
        fieldFullNamePh: "First and last name",
        fieldEmail: "Email *",
        fieldEmailPh: "We'll use this to reach you",
        fieldCompany: "Company or brand (optional)",
        fieldCompanyPh: "Your agency, brokerage, or personal brand",
        fieldCountry: "Country *",
        fieldCountryPh: "e.g. Canada",
        fieldWebsite: "Primary website or social URL *",
        fieldWebsitePh: "LinkedIn, YouTube, Substack, personal site — wherever your audience lives",
        fieldAudienceSize: "Audience size",
        fieldAudienceSizePh: "Select a range",
        audienceTier1: "Under 1,000",
        audienceTier2: "1,000 – 10,000",
        audienceTier3: "10,000 – 50,000",
        audienceTier4: "50,000 – 250,000",
        audienceTier5: "250,000+",
        fieldPromoteHow: "How will you promote Realtor Desk? *",
        fieldPromoteHowPh: "Newsletter, YouTube channel, brokerage email list, consulting engagements — be specific. (150 words max.)",
        fieldAudienceWhy: "Why is Realtor Desk a fit for your audience? *",
        fieldAudienceWhyPh: "What do they struggle with that Realtor Desk solves? (150 words max.)",
        fieldPipedaConsent: "I consent to Brainfy AI Inc. storing my application data under PIPEDA for partner-program review. *",
        fieldPipedaConsentHelp: "We use this only to review your application. You can request deletion at any time by emailing partners@realtordesk.ai.",
        fieldTermsConsent: "I have read and accept the Partner Program Terms. *",
        submitBtn: "Submit application",
        submittingBtn: "Submitting…",
        successHeading: "Application received",
        successBody: "Thanks for applying. We review every submission within 5 business days and will email you at the address above either way.",
        successCta: "Back to the partner program",
        errorHeading: "We couldn't submit your application",
        errorBody: "Please try again in a moment. If the issue persists, email partners@realtordesk.ai directly.",
        errFullNameReq: "Full name is required",
        errEmail: "Please enter a valid email address",
        errCountryReq: "Country is required",
        errWebsiteReq: "Please share at least one public URL so we can review your audience",
        errWebsiteInvalid: "That doesn't look like a valid URL",
        errPromoteMin: "Tell us a bit about how you'll promote Realtor Desk",
        errPromoteMax: "Please keep this answer to 150 words or less",
        errAudienceMin: "Tell us a bit about why Realtor Desk fits your audience",
        errAudienceMax: "Please keep this answer to 150 words or less",
        errPipedaConsent: "We can't process your application without PIPEDA consent",
        errTermsConsent: "Please read and accept the Partner Program Terms"
      },
      partnersTerms: {
        pageHeading: "Realtor Desk Partner Program Terms",
        effective: "Effective {{date}} · subject to revision · contact partners@realtordesk.ai for the current version",
        draftNotice: "These terms are the baseline program agreement. They do not override separately negotiated contracts with named partners.",
        sect1Title: "1. Who can join",
        sect1Body: "The Partner Program is open to individuals and businesses who can lawfully promote Realtor Desk in their jurisdiction and whose audience or client base aligns with Canadian real estate professionals. Applications are reviewed within 5 business days. We reserve the right to accept, reject, or suspend any applicant at our sole discretion.",
        sect2Title: "2. Commission structure",
        sect2Body: "Standard partners earn 25% recurring commission on every paid invoice from referred customers, moving to 30% at 11 active referrals and 40% at 26 active referrals. Ambassador-track partners earn a fixed 20% under separately agreed terms. The commission rate is snapshotted at the moment each invoice is paid; subsequent tier changes do not retroactively re-rate earlier commissions.",
        sect3Title: "3. Attribution",
        sect3Body: "Attribution is last-click with a 90-day cookie window. When a prospect clicks your referral link, a cookie records the attribution. The most recent partner referral within that 90-day window receives credit when the prospect subscribes. Clearing browser cookies ends the attribution window.",
        sect4Title: "4. Payouts",
        sect4Body: "Commissions are approved after a 60-day clawback window expires and are paid out monthly on the 15th for all commissions that cleared the prior month. Minimum payout is CAD $50; lower balances roll forward. Canadian partners are paid by Interac e-Transfer; international partners by Wise or PayPal. Partners are responsible for their own tax reporting; we issue T4A slips to Canadian partners who earn over the CRA reporting threshold in a calendar year.",
        sect5Title: "5. Clawbacks",
        sect5Body: "If a referred customer refunds, disputes, or is detected as fraudulent within 60 days of their paid invoice, the associated commission is reversed. If the commission has not yet been paid out, it is cancelled. If it has been paid out, the equivalent is deducted from your next payout. We never retroactively debit funds that have already cleared to your account.",
        sect6Title: "6. Prohibited conduct",
        sect6Body: "Self-referrals, incentivized traffic (cashback/loyalty programs unless separately approved), bidding on Realtor Desk branded keywords in paid search, misleading reviews, trademark violations, impersonation of Realtor Desk staff, spam as defined by CASL (Canada's Anti-Spam Legislation), and promoting Realtor Desk via channels that violate PIPEDA are all prohibited. Violations terminate participation and forfeit any unpaid commissions.",
        sect7Title: "7. Marketing assets",
        sect7Body: "Approved partners may use the Realtor Desk wordmark and official marketing assets solely to promote Realtor Desk. You may not modify the wordmark, create derivative logos, or imply affiliation beyond being an independent partner. Realtor Desk is not affiliated with or endorsed by the Canadian Real Estate Association (CREA); REALTOR® is a registered trademark of CREA.",
        sect8Title: "8. Termination",
        sect8Body: "Either party may terminate participation at any time with written notice to partners@realtordesk.ai. Upon termination, any approved-but-unpaid commissions are paid in the next regular payout cycle. Pending commissions inside the 60-day clawback window may still be clawed back if the underlying transaction is refunded.",
        sect9Title: "9. Data and privacy",
        sect9Body: "Application data and partner account data are stored by Brainfy AI Inc. in Canadian data centres under PIPEDA. Quebec applicants' data is handled in accordance with Quebec's Law 25. You can request access, correction, or deletion of your data by emailing partners@realtordesk.ai.",
        sect10Title: "10. Limitation of liability",
        sect10Body: "Realtor Desk's aggregate liability under this program is limited to commissions earned in the preceding 12 months. We provide the program and marketing assets on an \"as-is\" basis and make no warranty of conversion rates, uptime, or earnings.",
        sect11Title: "11. Governing law",
        sect11Body: "This agreement is governed by the laws of Alberta, Canada. Disputes will be resolved in the courts of Alberta unless both parties agree in writing to arbitration.",
        sect12Title: "12. Changes",
        sect12Body: "We may update these terms with 30 days' notice by email to registered partners and by updating this page. Continued participation after the notice period constitutes acceptance.",
        contactHeading: "Questions?",
        contactBody: "Email partners@realtordesk.ai. We respond within 2 business days."
      },
      careersPage: {
        heroH1Pre: "Build the future of",
        heroH1Gradient: "Canadian real estate",
        heroH1Post: "with us",
        heroSubtitle: "Realtor Desk helps agents close more deals with less manual work. Join a lean, high-ownership team shipping AI products built for the Canadian market.",
        valueRemoteTitle: "Remote-first",
        valueRemoteBody: "Work from anywhere in Canada or North America with async-friendly collaboration.",
        valueActionTitle: "Bias to action",
        valueActionBody: "Own outcomes, move quickly, and make practical decisions with imperfect information.",
        valueCanadaTitle: "Canada-focused",
        valueCanadaBody: "Solve real workflows for Canadian agents with local compliance and market context.",
        valueImpactTitle: "Real impact",
        valueImpactBody: "Your work ships fast and directly affects retention, revenue, and customer success.",
        prioritySectionTitle: "Hiring now — priority roles",
        prioritySectionBody: "These 4 roles are critical hires that directly unblock product velocity, retention, and growth.",
        priorityBadge: "Hiring Now",
        priorityApplyCta: "Apply now",
        priorityOptionalFifth: "Optional 5th hire:",
        priorityOptionalBody: "If the founder is stretched thin on product decisions, a part-time Product Manager / Founding PM who can own roadmap execution and cross-functional coordination would be a high-leverage addition.",
        allRolesTitle: "All roles",
        catEngineering: "Product & Engineering",
        catCustomerGrowth: "Customer & Growth",
        catOperations: "Operations & Strategy",
        accordionResponsibilities: "Responsibilities",
        accordionQualifications: "Qualifications",
        applicationSectionTitle: "Application form",
        applicationSectionBody: "Submit one application for any role. Role-specific fields appear automatically based on your selection.",
        sectionCoreInfo: "Core information",
        sectionProfessionalBackground: "Professional background",
        sectionRoleSpecific: "Role-specific links (optional)",
        sectionFitQuestions: "Fit questions (required, 150 words max each)",
        sectionFinalDetails: "Final details",
        fieldFullName: "Full name *",
        fieldFullNamePh: "Your full name as it appears professionally",
        fieldEmail: "Email address *",
        fieldEmailPh: "We'll use this to reach you",
        fieldPhone: "Phone number *",
        fieldPhonePh: "Including area code (Canada/US preferred)",
        fieldLocation: "Location (City, Province) *",
        fieldLocationPh: "e.g., Toronto, ON",
        fieldRole: "Role applying for *",
        fieldRolePh: "Select the role that best matches your background",
        fieldAvailability: "Availability to start *",
        fieldAvailabilityPh: "Select one",
        availImmediately: "Immediately",
        avail2Weeks: "2 weeks",
        avail1Month: "1 month",
        avail2PlusMonths: "2+ months",
        fieldWorkAuth: "Work authorization *",
        fieldWorkAuthPh: "Select one",
        authCitizen: "Canadian Citizen",
        authPR: "Permanent Resident",
        authWorkPermit: "Valid Work Permit",
        authUsBased: "US-based (open to consideration)",
        fieldResume: "Resume / CV upload *",
        fieldResumeHelp: "Max 5 MB. PDF preferred.",
        fieldLinkedIn: "LinkedIn profile URL *",
        fieldLinkedInPh: "Your up-to-date LinkedIn profile",
        fieldExperience: "Years of relevant experience *",
        fieldExperiencePh: "Select experience range",
        expUnder1: "Under 1 yr",
        exp1to2: "1–2 yrs",
        exp3to5: "3–5 yrs",
        exp5to10: "5–10 yrs",
        exp10plus: "10+ yrs",
        fieldGithub: "GitHub profile URL",
        fieldGithubPh: "Link to your GitHub or GitLab",
        fieldPortfolio: "Portfolio / personal site",
        fieldPortfolioPh: "Personal site, portfolio, or work samples",
        fieldWriting: "Writing samples URL",
        fieldWritingPh: "Published articles, posts, or portfolio",
        fieldCrmTools: "CRM / sales tools used",
        fieldCrmToolsPh: "e.g., HubSpot, Salesforce, Follow Up Boss",
        fieldWhyNow: "Why Realtor Desk — and why now?",
        fieldWhyNowPh: "Tell us what drew you to this role and why an early-stage, Canadian real estate SaaS company excites you now.",
        fieldLimitedGuidance: "Tell us about a time you had to figure something out with limited guidance or resources.",
        fieldLimitedGuidancePh: "Walk us through the situation, what you did, and what happened.",
        fieldCanadaView: "What do you know about the Canadian real estate market, and what do you think agents struggle with most?",
        fieldCanadaViewPh: "Share your perspective on Canadian market dynamics and agent pain points.",
        fieldReferredBy: "Referred by",
        fieldReferredByPh: "Were you referred by someone in our network?",
        fieldAdditional: "Anything else you'd like us to know?",
        fieldAdditionalPh: "Add context your resume doesn't capture — side projects, non-linear paths, motivations, and more.",
        fieldPipedaConsent: "I consent to store my application data in accordance with PIPEDA. *",
        fieldPipedaConsentHelp: "We store your application information securely and use it only for hiring purposes.",
        submitBtn: "Submit application",
        submittingBtn: "Submitting application…",
        dontSeeRoleTitle: "Don't see your role?",
        dontSeeRoleBody: "Send us a short note and tell us how you can help us build Realtor Desk.",
        errFullNameReq: "Full name is required",
        errFullNameMax: "Name is too long",
        errEmail: "Please enter a valid email address",
        errPhone: "Please enter a valid phone number",
        errLocationReq: "Location is required",
        errLocationMax: "Location is too long",
        errRoleReq: "Please select a role",
        errAvailabilityReq: "Please select your availability",
        errWorkAuthReq: "Please select your work authorization",
        errResumeReq: "Resume/CV is required",
        errResumeSize: "Max file size is 5 MB",
        errResumeType: "Please upload a PDF or DOCX file",
        errLinkedInReq: "Please enter a valid LinkedIn URL",
        errExperienceReq: "Please select experience level",
        errUrlInvalid: "Please enter a valid URL",
        errCrmMax: "Please keep this under 250 characters",
        errAnswerMin: "Please provide at least a short answer",
        errAnswerWords: "Please keep this answer to 150 words or less",
        errReferredByMax: "Please keep this under 120 characters",
        errAdditionalMax: "Please keep this under 2000 characters",
        errConsentReq: "Consent is required to submit your application"
      },
      resourcesDisclosure: {
        frOnlyBody: "Some guides are currently English-only while we translate them. {{hidden}} additional articles are available in the English catalogue.",
        viewEnCta: "View the full English catalogue"
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
        badge: "The Bottleneck",
        title: "Struggling with slow,",
        titleHighlight: "expensive lead management?",
        subtitle: "Stop relying on fragmented tools and manual follow-ups. 48% of leads are lost to slow response times.",
        leadsLost: "of leads lost",
        toolsUsed: "tools used daily",
        monthlyWaste: "wasted monthly",
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
        badge: "The Solution",
        title: "AI-Powered Tools",
        titleHighlight: "Built for Canadian Realtors",
        subtitle: "24/7 automation that speaks English and French, with PIPEDA compliance and CREA DDF® integration coming soon.",
        chatbot: {
          title: "24/7 AI Chatbot",
          description: "Capture and qualify leads around the clock with a bilingual AI chatbot that answers property questions, books showings, and never misses a lead.",
          benefit1: "Responds to leads in under 2 minutes",
          benefit2: "Bilingual English & French conversations",
          benefit3: "Automatically qualifies and scores leads",
          feature1: "Answers property questions instantly",
          feature2: "Qualifies buyers/sellers automatically",
          feature3: "Captures contact info & preferences",
          feature4: "Bilingual (English/French)",
          feature5: "Works on your website & social media"
        },
        voice: {
          title: "Smart Follow-Up Engine",
          description: "Never miss a callback. AI prioritizes your daily call list based on lead scores, engagement signals, and optimal contact times.",
          benefit1: "AI-prioritized daily call lists",
          benefit2: "Automated follow-up reminders",
          benefit3: "Call summaries generated by AI",
          feature1: "Takes calls when you're busy",
          feature2: "Schedules showings automatically",
          feature3: "Natural-sounding Canadian voice",
          feature4: "Routes hot leads to your phone",
          feature5: "Records & transcribes every call"
        },
        email: {
          title: "Automated Email Campaigns",
          description: "Nurture leads on autopilot with personalized drip campaigns, property alerts, and market updates — all CASL-compliant.",
          benefit1: "Pre-built drip campaign templates",
          benefit2: "Personalized property alert emails",
          benefit3: "CASL-compliant with one-click unsubscribe",
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
        feature5: "Performance analytics & ROI tracking",
        loadFailed: "Failed to load profile"
      },
      ai: {
        title: "Realtor AI Assistant",
        subtitle: "Your intelligent real estate CRM assistant",
        clearChat: "Clear Chat",
        quickActions: "Quick Actions",
        welcomeTitle: "Welcome to Realtor AI Assistant",
        welcomeDesc: "I can help you manage contacts, analyze deals, create tasks, and provide real estate insights. Try one of the quick actions above!",
        placeholder: "Ask me anything about your CRM, contacts, deals...",
        actions: {
          analyzePipeline: "Analyze my pipeline",
          draftEmail: "Draft follow-up email",
          createTask: "Create task",
          marketResearch: "Market research"
        }
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
      faq: {
        title: "Frequently Asked",
        titleGradient: "Questions",
        subtitle: "Find answers to common questions about Realtor Desk AI",
        q1: {
          question: "Is Realtor Desk ready for production use?",
          answer: "We're currently in public beta with 50+ active realtors across Canada. The platform is fully functional and stable, but we're actively gathering feedback and adding features. Beta users help shape our roadmap and receive lifetime discounts."
        },
        q2: {
          question: "What does 'beta' mean for me?",
          answer: "You get full access to all features at a discounted rate. We may add/modify features based on feedback. You'll receive priority support and direct access to our team. Your pricing is locked in for life—you'll never pay more than your beta rate."
        },
        q3: {
          question: "Can I trust the platform with my client data?",
          answer: "Absolutely. We use bank-level encryption (AES-256), host data on Canadian-optimized infrastructure, and are designed with PIPEDA principles — including right-to-erasure and breach notification protocols."
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
          answer: "We are built on enterprise-grade infrastructure with strong security practices, designed with PIPEDA principles, and use Canadian MLS data integration. As we grow, we plan to pursue formal third-party security certifications and display them proudly."
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
          answer: "Today: native Zapier, Make, and n8n — which cover 5,000+ apps including Follow Up Boss, Brivity, HubSpot, and Salesforce via Zapier. Direct connectors for Salesforce, Zoho CRM, Pipedrive, Freshsales, and Microsoft Dynamics are on the roadmap. You can also bulk-import any CRM via CSV."
        },
        q12: {
          question: "Can I customize the AI's responses?",
          answer: "Yes! You control the AI's personality, response templates, and which questions it handles vs. escalates to you. It learns your style over time."
        },
        q13: {
          question: "How does RealtorDesk AI compare to Follow Up Boss?",
          answer: "RealtorDesk AI offers AI-powered instant lead response (under 3 seconds) and bilingual support starting at $149/mo CAD, with CREA DDF® integration on the Q3 2026 roadmap. Follow Up Boss requires manual follow-up, lacks AI features, and costs $49-$99 USD/user/month without Canadian-specific features."
        },
        q14: {
          question: "Does RealtorDesk AI work with CREA DDF®?",
          answer: "CREA DDF® integration is on the Q3 2026 roadmap for RealtorDesk AI. When it launches, you'll be able to sync MLS listings automatically, match buyers to properties in real-time, and manage listing data directly within the CRM. In the meantime, you can import listings from Realtor.ca via the built-in importer."
        },
        q15: {
          question: "What's the average ROI for agents using RealtorDesk AI?",
          answer: "Based on our beta user data, agents see a meaningful lift in lead conversion due to sub-3-second response times. With an average agent closing 12-18 deals per year, adding just 2-3 extra deals from better follow-up pays for the CRM many times over."
        },
        q16: {
          question: "Can RealtorDesk AI handle phone calls?",
          answer: "Yes! Our AI Voice Agent can handle inbound phone calls 24/7, answer questions about listings, qualify leads, and book appointments directly into your calendar—all with a natural Canadian accent in English or French."
        },
        q17: {
          question: "Is RealtorDesk AI suitable for real estate teams?",
          answer: "Absolutely. Our Teams plan supports unlimited users with shared inbox, team performance analytics, round-robin lead distribution, and custom AI training. Perfect for brokerages and teams of 2-50+ agents."
        },
        q18: {
          question: "How long does it take to see results with RealtorDesk AI?",
          answer: "Most agents see immediate improvements in response time (instant instead of hours/days). Within the first 30 days, agents typically see 25-40% more qualified appointments booked. Measurable deal increases usually show within 60-90 days."
        },
        q19: {
          question: "Does RealtorDesk AI integrate with my existing website?",
          answer: "Yes! Our AI chatbot widget installs on any website with a simple code snippet (works with WordPress, Wix, Squarespace, custom sites). It takes less than 5 minutes to set up and starts capturing leads immediately."
        },
        q20: {
          question: "What makes RealtorDesk AI different from traditional CRMs?",
          answer: "Traditional CRMs organize contacts but require YOU to do all the follow-up. RealtorDesk AI actively engages leads 24/7 via chat, email, SMS, and voice—qualifying them and booking appointments while you focus on closings. It's the difference between a filing cabinet and an AI assistant."
        },
        cta: {
          title: "Still Have Questions?",
          subtitle: "We're here to help! Get in touch with our team or start your free trial today.",
          contactSupport: "Contact Support",
          startTrial: "Start Your 14-Day Free Trial",
          noCreditCard: "No credit card required • Cancel anytime"
        }
      },
        cta: {
        title: "Ready to Never Miss a Lead Again?",
        subtitle: "Join our growing Canadian beta community using AI to close more deals",
        button: "Start Your 14-Day Free Trial",
        note: "14 Days Free • No credit card required • Cancel anytime"
      },
      mobileCTA: {
        title: "Start Your 14-Day Free Trial",
        subtitle: "Join Our Canadian Beta Community"
      },
      trustTransparency: {
        badge: "Trust & Transparency",
        title: "Built on Honesty",
        subtitle: "We believe in transparent communication about our beta program",
        beta: {
          title: "Beta Program",
          desc: "Early access with special pricing",
          description: "We're currently in beta with select Canadian realtors. Join our pilot program and help shape the future of AI in real estate.",
          badge: "Limited Spots Available"
        },
        results: {
          title: "Real Results",
          desc: "Verified testimonials from beta users",
          description: "Performance metrics based on our pilot program with 50+ active users. Individual results may vary based on market conditions and usage.",
          disclaimer: "*Results from pilot participants"
        },
        security: {
          title: "Security First",
          desc: "Enterprise-grade data protection",
          description: "Security-first architecture, PIPEDA-aware data handling, and enterprise-grade encryption from day one."
        },
        canadian: {
          title: "Canadian Built",
          desc: "Made for Canadian realtors",
          description: "Designed specifically for Canadian realtors with data residency in Toronto/Vancouver and full bilingual support."
        },
        disclaimer: "Realtor Desk is currently in beta. All performance metrics are based on pilot program results. Individual outcomes may vary."
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
              responseTime: "avg AI response time",
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
          soc2Title: "Security-First Architecture",
          soc2Desc: "Enterprise-grade encryption and data protection",
          pipedaTitle: "PIPEDA-Aware Design",
          pipedaDesc: "Built around Canadian privacy principles",
          creaTitle: "CREA DDF® Integration",
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
          sec1: "Security-First Architecture:",
          sec1Desc: "Enterprise-grade encryption, regular security reviews, high-availability infrastructure",
          sec2: "PIPEDA-Aware Design:",
          sec2Desc: "Right to access, delete, data portability. Breach notification <72hrs",
          sec3: "CASL-Aware:",
          sec3Desc: "Express consent tracking, auto-unsubscribe, 24-month proof retention",
          sec4: "Canadian-Optimized Infrastructure:",
          sec4Desc: "Hosted on infrastructure optimized for Canadian data residency requirements",
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
          api3Desc: "Native Zapier, Make, and n8n. Direct connectors for Salesforce, Zoho, Pipedrive on the roadmap.",
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
          title: "Join 50+ Canadian Agents Growing Their Business with AI",
          subtitle: "Start closing more deals with AI-powered automation today",
          startTrial: "Start Your 14-Day Free Trial",
          bookDemo: "Book your free demo",
          note: "⚡ 14 Days Free Trial • No credit card required • Cancel anytime"
        },
        betaNotice: {
          title: "Beta Program Notice",
          description: "RealtorDesk AI is currently in public beta. We're continuously improving based on user feedback. All features, pricing, and metrics are subject to change. Early adopters receive special lifetime pricing."
        }
      },
      // Dashboard & App Translations
      app: {
        sidebar: {
          today: "Today",
          automations: "Automations",
          advanced: "Advanced",
          dashboard: "Dashboard",
          contacts: "Contacts",
          properties: "Properties",
          deals: "Deals",
          tasks: "Tasks",
          aiAssistant: "AI Assistant",
          campaigns: "Campaigns",
          calendar: "Calendar",
          reports: "Reports",
          market: "Market Intelligence",
          integrations: "Integrations",
          billing: "Billing",
          settings: "Settings",
          trialActive: "Trial active",
          daysLeft: "days left in your trial",
          upgradeNow: "Upgrade"
        },
        navbar: {
          search: "Search contacts, deals, tasks...",
          notifications: "Notifications",
          profile: "Profile",
          signOut: "Sign Out",
          help: "Help"
        },
        dashboard: {
          welcomeBack: "Welcome back",
          tasksDueToday: "tasks due today",
          hotLeadsToFollow: "hot leads to follow up",
          newLeadsThisMonth: "New Leads (This Month)",
          activeDeals: "Active Deals",
          tasksDue: "Tasks Due Today",
          revenueYTD: "Revenue YTD",
          pipeline: "pipeline",
          overdue: "overdue",
          ofAnnualGoal: "of annual goal",
          trialDaysLeft: "days left in your free trial",
          upgradeNowContinue: "Upgrade now to continue after your trial ends",
          loading: "Loading..."
        },
        contacts: {
          title: "Contacts",
          addContact: "Add Contact",
          importContacts: "Import",
          exportContacts: "Export",
          searchPlaceholder: "Search contacts...",
          allContacts: "All Contacts",
          leads: "Leads",
          clients: "Clients",
          pastClients: "Past Clients",
          noContacts: "No contacts found",
          addFirst: "Add your first contact to get started",
          firstName: "First Name",
          lastName: "Last Name",
          email: "Email",
          phone: "Phone",
          source: "Source",
          status: "Status",
          tags: "Tags",
          leadScore: "Lead Score",
          lastContact: "Last Contact",
          actions: "Actions",
          edit: "Edit",
          delete: "Delete",
          view: "View Details",
          bulkActions: "Bulk Actions",
          selected: "selected",
          deleteSelected: "Delete Selected",
          addTags: "Add Tags",
          sendEmail: "Send Email",
          startCallSession: "Start Call Session",
          viewTable: "Table",
          viewCards: "Cards",
          filters: {
            searchPlaceholder: "Search by name, email, or phone...",
            leadScore: "Lead Score",
            coldRange: "Cold (0-49)",
            warmRange: "Warm (50-79)",
            hotRange: "Hot (80+)",
            hotLeads: "Hot leads",
            warmLeads: "Warm leads",
            coldLeads: "Cold leads",
            clearAll: "Clear All Filters",
            searchChip: "Search",
            scoreChip: "Score"
          },
          empty: {
            title: "No contacts yet",
            importCta: "Import contacts",
            refresh: "Refresh"
          }
        },
        deals: {
          title: "Deals",
          addDeal: "Add Deal",
          searchPlaceholder: "Search deals...",
          allDeals: "All Deals",
          active: "Active",
          won: "Won",
          lost: "Lost",
          noDeals: "No deals found",
          addFirst: "Add your first deal to get started",
          dealName: "Deal Name",
          client: "Client",
          property: "Property",
          value: "Value",
          stage: "Stage",
          probability: "Probability",
          expectedClose: "Expected Close",
          stages: {
            lead: "Lead",
            viewing: "Viewing",
            offer: "Offer",
            negotiation: "Negotiation",
            closing: "Closing",
            won: "Won",
            lost: "Lost"
          },
          pipeline: "Pipeline",
          totalValue: "Total Value",
          avgDealSize: "Avg Deal Size",
          winRate: "Win Rate"
        },
        tasks: {
          title: "Tasks",
          addTask: "Add Task",
          searchPlaceholder: "Search tasks...",
          allTasks: "All Tasks",
          today: "Today",
          upcoming: "Upcoming",
          overdue: "Overdue",
          completed: "Completed",
          noTasks: "No tasks found",
          addFirst: "Add your first task to get started",
          taskName: "Task Name",
          dueDate: "Due Date",
          dueTime: "Due Time",
          priority: "Priority",
          priorities: {
            low: "Low",
            medium: "Medium",
            high: "High",
            urgent: "Urgent"
          },
          status: "Status",
          statuses: {
            pending: "Pending",
            inProgress: "In Progress",
            completed: "Completed",
            cancelled: "Cancelled"
          },
          relatedTo: "Related To",
          description: "Description",
          markComplete: "Mark Complete",
          markIncomplete: "Mark Incomplete"
        },
        properties: {
          title: "Properties",
          addProperty: "Add Property",
          searchPlaceholder: "Search properties...",
          allProperties: "All Properties",
          active: "Active",
          pending: "Pending",
          sold: "Sold",
          noProperties: "No properties found",
          addFirst: "Add your first property to get started",
          propertyTitle: "Title",
          address: "Address",
          city: "City",
          province: "Province",
          postalCode: "Postal Code",
          price: "Price",
          type: "Type",
          bedrooms: "Bedrooms",
          bathrooms: "Bathrooms",
          squareFeet: "Square Feet",
          yearBuilt: "Year Built",
          mlsNumber: "MLS Number",
          listingType: "Listing Type",
          types: {
            house: "House",
            condo: "Condo",
            townhouse: "Townhouse",
            land: "Land",
            commercial: "Commercial"
          }
        },
        settings: {
          title: "Settings",
          profile: "Profile",
          profileDesc: "Update your name, brokerage, and contact details",
          accountDesc: "Manage your session and account access",
          avatarHint: "Click the avatar to upload a new photo",
          phone: "Phone",
          selectProvince: "Select province",
          selectCity: "Select city",
          endsOn: "Ends on",
          language: {
            english: "English",
            french: "French",
            both: "Bilingual"
          },
          account: "Account",
          notifications: {
            label: "Notifications",
            desc: "Manage your email and push notification preferences",
            email: "Email notifications",
            emailDesc: "Receive email alerts for new leads and deal updates",
            sms: "SMS notifications",
            smsDesc: "Get text alerts for urgent follow-ups",
            comingSoon: "Coming Soon"
          },
          integrations: "Integrations",
          billing: "Billing",
          security: "Security",
          language: "Language",
          timezone: "Timezone",
          fullName: "Full Name",
          emailAddress: "Email Address",
          phoneNumber: "Phone Number",
          company: "Company/Brokerage",
          licenseNumber: "License Number",
          province: "Province",
          city: "City",
          save: "Save Changes",
          cancel: "Cancel",
          twoFactor: {
            title: "Two-Factor Authentication (2FA)",
            subtitle: "Protect your account with two-factor authentication",
            helper: "Add an extra layer of security with an authenticator app.",
            enable: "Enable 2FA",
            disable: "Disable 2FA",
            verify: "Verify",
            activeBody: "Your account is protected with TOTP-based 2FA.",
            inactiveBody: "Add an extra layer of security with an authenticator app.",
            setupHeading: "Set up Two-Factor Authentication",
            setupHelp: "Scan this QR code with your authenticator app (Google Authenticator, Authy, or 1Password), then enter the 6-digit code below.",
            qrAlt: "TOTP QR Code",
            disableConfirmTitle: "Disable Two-Factor Authentication?",
            disableConfirmBody: "This will make your account less secure. You can re-enable it at any time.",
            enabledToastTitle: "2FA Enabled",
            enabledToastDesc: "Two-factor authentication is now active on your account.",
            disabledToastTitle: "2FA Disabled",
            disabledToastDesc: "Two-factor authentication has been removed.",
            enrollFailed: "Failed to start MFA enrollment",
            verifyFailed: "Verification failed",
            invalidCode: "Invalid TOTP code. Try again.",
            disableFailed: "Failed to disable 2FA",
            noFactor: "No 2FA factor found"
          },
          profileMenu: {
            changePhoto: "Change photo",
            removePhoto: "Remove photo"
          },
          dataRights: {
            exportTitle: "Export my data",
            exportDesc: "Download everything we store about you as a JSON file (PIPEDA access right).",
            deleteTitle: "Delete my account",
            deleteDesc: "Erase your profile and all associated data (PIPEDA right to erasure). Processed within 30 days.",
            confirmTitle: "Delete your account?",
            confirmBody: "This is a PIPEDA right-to-erasure request. We'll confirm by email and fully erase your data within 30 days. Undo is not available once processed."
          }
        },
        common: {
          loading: "Loading...",
          save: "Save",
          cancel: "Cancel",
          delete: "Delete",
          edit: "Edit",
          add: "Add",
          search: "Search",
          filter: "Filter",
          sort: "Sort",
          export: "Export",
          import: "Import",
          refresh: "Refresh",
          back: "Back",
          next: "Next",
          previous: "Previous",
          close: "Close",
          confirm: "Confirm",
          yes: "Yes",
          no: "No",
          all: "All",
          none: "None",
          selectAll: "Select All",
          deselectAll: "Deselect All",
          noResults: "No results found",
          error: "Error",
          success: "Success",
          warning: "Warning",
          info: "Info",
          required: "Required",
          optional: "Optional",
          saving: "Saving...",
          continue: "Continue",
          skip: "Skip for now"
        },
        auth: {
          signIn: "Sign In",
          signUp: "Sign Up",
          signOut: "Sign Out",
          email: "Email",
          password: "Password",
          confirmPassword: "Confirm Password",
          forgotPassword: "Forgot Password?",
          resetPassword: "Reset Password",
          createAccount: "Create Account",
          alreadyHaveAccount: "Already have an account?",
          dontHaveAccount: "Don't have an account?",
          verifyEmail: "Verify Email",
          checkYourEmail: "Check your email for a verification link",
          invalidCredentials: "Invalid email or password",
          emailRequired: "Email is required",
          passwordRequired: "Password is required",
          passwordMinLength: "Password must be at least 8 characters",
          passwordsDoNotMatch: "Passwords do not match",
          passwordRequirements: {
            minLength: "At least 8 characters",
            uppercase: "At least 1 uppercase letter (A-Z)",
            lowercase: "At least 1 lowercase letter (a-z)",
            number: "At least 1 number (0-9)",
            special: "At least 1 special character (!@#$%^&*)",
            notMet: "Password does not meet all requirements"
          }
        },
        validation: {
          required: "This field is required",
          email: "Please enter a valid email address",
          phone: "Please enter a valid phone number",
          minLength: "Must be at least {{min}} characters",
          maxLength: "Must be no more than {{max}} characters",
          number: "Please enter a valid number",
          date: "Please enter a valid date",
          url: "Please enter a valid URL"
        },
        notifications: {
          contactCreated: "Contact created successfully",
          contactUpdated: "Contact updated successfully",
          contactDeleted: "Contact deleted successfully",
          dealCreated: "Deal created successfully",
          dealUpdated: "Deal updated successfully",
          dealDeleted: "Deal deleted successfully",
          taskCreated: "Task created successfully",
          taskUpdated: "Task updated successfully",
          taskDeleted: "Task deleted successfully",
          taskCompleted: "Task marked as complete",
          propertyCreated: "Property created successfully",
          propertyUpdated: "Property updated successfully",
          propertyDeleted: "Property deleted successfully",
          settingsSaved: "Settings saved successfully",
          errorOccurred: "An error occurred. Please try again."
        },
        modals: {
          addContact: {
            title: "Add New Contact",
            firstName: "First Name",
            lastName: "Last Name",
            email: "Email",
            phone: "Phone",
            source: "Source",
            selectSource: "Select source",
            tags: "Tags",
            tagsPlaceholder: "First-time buyer, Pre-approved, Urgent (comma separated)",
            notes: "Notes",
            notesPlaceholder: "Add any additional information about this contact...",
            caslTitle: "🇨🇦 Canadian Compliance (CASL)",
            preferredLanguage: "Preferred Language",
            selectLanguage: "Select language",
            english: "English",
            french: "French",
            consentLabel: "Contact has given consent for communication (CASL)",
            consentDescription: "Required under Canada's Anti-Spam Legislation for sending commercial electronic messages",
            cancel: "Cancel",
            addContact: "Add Contact",
            adding: "Adding...",
            notAuthenticated: "Not authenticated",
            pleaseLogin: "Please log in to add contacts",
            success: "Contact added successfully",
            contactAdded: "has been added to your contacts",
            errorAdding: "Error adding contact",
            validation: {
              firstNameRequired: "First name is required",
              lastNameRequired: "Last name is required",
              invalidEmail: "Please enter a valid email address"
            },
            sources: {
              website: "Website",
              referral: "Referral",
              openHouse: "Open House",
              zillow: "Zillow",
              realtorCom: "Realtor.com",
              socialMedia: "Social Media",
              import: "Import",
              other: "Other"
            }
          },
          addDeal: {
            title: "Add New Transaction",
            contact: "Contact",
            selectContact: "Select a contact",
            transactionTitle: "Transaction Title",
            titlePlaceholder: "e.g., Downtown Condo Purchase",
            clientType: "Client Type",
            selectType: "Select type",
            buyer: "Buyer",
            seller: "Seller",
            both: "Both",
            propertyType: "Property Type",
            propertyAddress: "Property Address",
            addressPlaceholder: "123 Main St, Toronto, ON M1A 1A1",
            mlsNumber: "MLS Number",
            listingPrice: "Listing Price (CAD)",
            commission: "Commission %",
            stage: "Stage",
            stages: {
              newLead: "New Lead",
              contacted: "Contacted",
              showingScheduled: "Showing Scheduled",
              offerMade: "Offer Made",
              underContract: "Under Contract",
              closing: "Closing"
            },
            dealProbability: "Deal Probability",
            expectedClosingDate: "Expected Closing Date",
            pickDate: "Pick a date",
            notes: "Notes",
            notesPlaceholder: "Additional details about this transaction...",
            cancel: "Cancel",
            createTransaction: "Create Transaction",
            creating: "Creating...",
            fillRequired: "Please fill in contact and title",
            failedCreate: "Failed to create transaction",
            successCreate: "Transaction created successfully",
            propertyTypes: {
              condo: "Condo",
              house: "House",
              townhouse: "Townhouse",
              commercial: "Commercial",
              land: "Land",
              other: "Other"
            }
          },
          addTask: {
            title: "Add New Task",
            taskTitle: "Task Title",
            titlePlaceholder: "e.g., Call client about property viewing",
            description: "Description",
            descriptionPlaceholder: "Additional details...",
            dueDate: "Due Date",
            pickDate: "Pick a date",
            dueTime: "Due Time",
            priority: "Priority",
            priorities: {
              low: "Low",
              medium: "Normal",
              high: "High",
              urgent: "Urgent"
            },
            taskType: "Task Type",
            taskTypes: {
              call: "Call",
              email: "Email",
              meeting: "Meeting",
              viewing: "Viewing",
              followup: "Follow-up",
              other: "Other"
            },
            associatedContact: "Associated Contact",
            selectContactOptional: "Select a contact (optional)",
            associatedDeal: "Associated Deal",
            selectDealOptional: "Select a deal (optional)",
            reminder: "Reminder",
            reminders: {
              none: "None",
              fifteenMin: "15 minutes before",
              oneHour: "1 hour before",
              oneDay: "1 day before"
            },
            cancel: "Cancel",
            addAnother: "Add & Add Another",
            addTask: "Add Task",
            creating: "Creating...",
            fillRequired: "Please fill in required fields",
            failedCreate: "Failed to create task",
            successCreate: "Task created successfully"
          },
          addProperty: {
            title: "Add New Property",
            quickAdd: "🚀 Quick Add from MLS Listing URL",
            pasteUrl: "Paste Listing URL (Coming Soon: Auto-fill from CREA DDF)",
            urlPlaceholder: "https://realtor.ca/listing/...",
            urlNote: "Phase 1: We'll scrape basic info. Phase 2: CREA DDF integration is planned for Q3 2026.",
            propertyTitle: "Property Title",
            titlePlaceholder: "Beautiful 3BR Family Home",
            address: "Address",
            addressPlaceholder: "123 Main Street",
            city: "City",
            cityPlaceholder: "Toronto",
            province: "Province",
            provincePlaceholder: "ON",
            propertyType: "Property Type",
            types: {
              house: "House",
              condo: "Condo",
              townhouse: "Townhouse",
              land: "Land",
              commercial: "Commercial"
            },
            status: "Status",
            statuses: {
              active: "Active",
              pending: "Pending",
              sold: "Sold",
              comingSoon: "Coming Soon",
              offMarket: "Off Market"
            },
            price: "Price (CAD)",
            bedrooms: "Bedrooms",
            bathrooms: "Bathrooms",
            squareFeet: "Square Feet",
            mlsNumber: "MLS Number",
            imageUrl: "Image URL",
            description: "Description",
            descriptionPlaceholder: "Describe the property features, amenities, location benefits...",
            cancel: "Cancel",
            addProperty: "Add Property",
            adding: "Adding...",
            success: "Property added successfully",
            errorAdding: "Error adding property"
          },
          importContacts: {
            title: "Import Contacts",
            uploadDescription: "Upload a CSV file with your contacts",
            chooseFile: "Choose File",
            selected: "Selected:",
            formatGuide: "CSV Format Guide",
            formatDescription: "Your CSV should include these columns:",
            importing: "Importing contacts...",
            cancel: "Cancel",
            import: "Import",
            importingBtn: "Importing...",
            imported: "Imported",
            errors: "Errors",
            done: "Done",
            importComplete: "Import complete",
            importSuccess: "contacts imported successfully.",
            importFailed: "Import failed",
            invalidFileType: "Invalid file type",
            pleaseSelectCSV: "Please select a CSV file",
            notAuthenticated: "Not authenticated",
            pleaseLogin: "Please log in to import contacts"
          }
        },
        tasks: {
          title: "Tasks",
          addTask: "Add task",
          allTasks: "All",
          today: "Today",
          upcoming: "This week",
          overdue: "Overdue",
          empty: {
            title: "No tasks yet.",
            body: "Create your first task to get started."
          },
          stats: {
            dueToday: "Due today",
            overdue: "Overdue",
            completedToday: "Completed today",
            thisWeek: "This week"
          }
        },
        campaigns: {
          title: "Email campaigns",
          subtitle: "Manage and track your email marketing campaigns",
          newCampaign: "New campaign",
          recent: "Recent campaigns",
          comingSoon: "Email campaigns are coming soon — we'll let you know the moment they're live.",
          stats: {
            total: "Total campaigns",
            sent: "Emails sent",
            openRate: "Avg. open rate",
            clickRate: "Click rate",
            startSending: "Start sending to see metrics",
            requiresSent: "Requires sent campaigns"
          },
          empty: {
            title: "No campaigns yet",
            body: "Create your first email campaign to stay in touch with leads and clients.",
            cta: "Create your first campaign"
          }
        },
        automations: {
          title: "Email automations",
          subtitle: "Create automated email sequences to nurture leads and engage contacts",
          create: "Create automation",
          comingSoon: "Email automations are coming soon — the trigger engine is still in development. We'll notify you the moment it's live.",
          stats: {
            total: "Total automations",
            active: "Active",
            enrolled: "Contacts enrolled"
          },
          empty: {
            title: "No automations yet",
            body: "Create your first automation to start engaging contacts automatically",
            cta: "Create your first automation"
          }
        },
        properties: {
          title: "Properties",
          addProperty: "Add property",
          active: "active",
          pending: "pending",
          sold: "sold",
          view: {
            grid: "Grid",
            list: "List"
          },
          searchPlaceholder: "Search by address, MLS#, city…",
          priceOnRequest: "Price on request",
          beds: {
            label: "Bedrooms",
            any: "Any beds",
            plus: "{{n}}+ beds"
          },
          filters: {
            status: "Status",
            propertyType: "Property type",
            priceRange: "Price range"
          },
          status: {
            active: "Active",
            pending: "Pending",
            sold: "Sold",
            comingSoon: "Coming soon",
            offMarket: "Off market"
          },
          types: {
            house: "House",
            condo: "Condo",
            townhouse: "Townhouse",
            land: "Land",
            commercial: "Commercial"
          },
          empty: {
            title: "No properties yet",
            body: "Add your first property to start tracking listings, managing showings, and closing deals faster.",
            importMls: "Import from MLS",
            addManual: "Add property manually",
            tip: "💡 Tip: You can also import properties from Realtor.ca search URLs"
          }
        }
      },
      howItWorks: {
        hero: {
          title: "Get Up and Running in",
          titleGradient: "20 Minutes",
          subtitle: "From signup to capturing leads in less time than it takes to drive to a showing. No technical skills required."
        },
        steps: {
          signUp: {
            title: "Sign Up",
            time: "2 minutes",
            description: "Create your account and choose your plan. No credit card required for 14-day trial.",
            details: [
              "Enter your name, email, and brokerage info",
              "Choose your subscription tier",
              "Verify your email address",
              "Access your dashboard immediately"
            ]
          },
          connectTools: {
            title: "Connect Your Tools",
            time: "5 minutes",
            description: "Link your CRM, email, website, and phone system with simple one-click integrations.",
            details: [
              "Connect existing CRM via Zapier/Make or CSV import",
              "Link Gmail or Outlook email",
              "Add website widget code snippet",
              "Import existing contacts (CSV or direct sync)"
            ]
          },
          trainAI: {
            title: "Train Your AI",
            time: "10 minutes",
            description: "Teach the AI about your properties, style, and preferences. Our wizard makes it easy.",
            details: [
              "Upload current listings and property info",
              "Add frequently asked questions",
              "Define your communication style",
              "Set qualification criteria for leads",
              "Configure notification preferences"
            ]
          },
          customize: {
            title: "Customize",
            time: "5 minutes",
            description: "Fine-tune greetings, response templates, and escalation rules to match your workflow.",
            details: [
              "Customize chatbot greeting messages",
              "Set business hours and after-hours behavior",
              "Create response templates",
              "Define when to escalate to human",
              "Configure lead routing rules"
            ]
          },
          goLive: {
            title: "Go Live",
            time: "Instant",
            description: "Flip the switch and watch your AI team start capturing and qualifying leads 24/7.",
            details: [
              "Enable chatbot on your website",
              "Activate email automation",
              "Turn on voice agent",
              "Start receiving lead notifications",
              "Monitor dashboard for real-time activity"
            ]
          },
          optimize: {
            title: "Optimize & Scale",
            time: "Ongoing",
            description: "Review analytics, improve responses, and watch your conversion rates soar.",
            details: [
              "Review weekly performance reports",
              "Refine AI responses based on data",
              "A/B test different approaches",
              "Scale up as you grow",
              "Access ongoing support & training"
            ]
          }
        },
        dashboard: {
          title: "Your Command Center Awaits",
          subtitle: "Everything you need to manage leads, conversations, and deals in one beautiful interface",
          unifiedInbox: "Unified Inbox",
          unifiedInboxDesc: "All conversations in one place",
          aiInsights: "AI Insights",
          aiInsightsDesc: "Smart lead scoring & recommendations",
          analytics: "Real-time Analytics",
          analyticsDesc: "Track performance & ROI",
          cta: "Start Your 14-Day Free Trial"
        },
        support: {
          title: "We're Here to Help Every Step",
          subtitle: "Our Canadian-based support team ensures you never feel stuck",
          videoTutorials: "📚 Video Tutorials",
          videoTutorialsDesc: "Step-by-step guides for every feature",
          liveChat: "💬 Live Chat",
          liveChatDesc: "Instant answers during business hours",
          freeOnboarding: "🎓 Free Onboarding",
          freeOnboardingDesc: "Personalized setup assistance",
          avgSetupTime: "Average setup time: 22 minutes",
          basedOn: "(based on our beta onboarding sessions)"
        }
      },
      integrationsPage: {
        stats: {
          nativeIntegrations: "Native Integrations",
          viaZapier: "Via Zapier Connection",
          realTimeSync: "Real-Time Sync"
        },
        badges: {
          nativeIntegration: "Native integration",
          comingSoon: "Coming Soon",
          viaZapierMake: "Via Zapier/Make"
        },
        partners: {
          title: "Our Integration Partners",
          subtitle: "Connect with {{count}}+ industry-leading tools and platforms"
        },
        categories: {
          crmPlatforms: "CRM Platforms",
          automationTools: "Automation & Workflow Tools",
          communicationTools: "Communication Tools",
          calendarTools: "Calendar Tools",
          contactLeadTools: "Contact & Lead Tools"
        },
        api: {
          title: "Need a Custom Integration?",
          subtitle: "Our REST API and Zapier integration give you unlimited flexibility to connect any tool in your workflow.",
          restApi: "Full REST API Access",
          restApiDesc: "Enterprise plan includes complete API documentation",
          zapier: "Zapier Integration",
          zapierDesc: "Connect to 5,000+ apps without coding",
          webhooks: "Webhook Support",
          webhooksDesc: "Real-time data sync with your custom tools",
          devSupport: "Developer Support",
          devSupportDesc: "Dedicated technical team for custom integrations",
          enterpriseApi: "Enterprise API Access",
          enterpriseApiDesc: "Build custom integrations with our comprehensive API. Available on Enterprise plans."
        },
        cta: {
          title: "Ready to Connect Your Tech Stack?",
          subtitle: "Start integrating your tools today and experience seamless workflow automation",
          button: "Start Closing More Deals",
          pricing: "View Pricing"
        },
        buttons: {
          bookDemo: "Book your free demo",
          viewFeatures: "View All Features"
        }
      },
      resourcesPage: {
        categories: {
          all: "All articles",
          aiTech: "AI & Technology",
          canadianMarket: "Canadian Market",
          marketing: "Marketing",
          compliance: "Compliance",
          sales: "Sales & Leads",
          successStories: "Success Stories",
          comparison: "CRM Comparisons"
        },
        allArticlesHeading: "All articles",
        articles: {
          aiTransformation: {
            title: "How AI Is Transforming Canadian Real Estate in 2025",
            excerpt: "Discover the latest AI innovations revolutionizing how Canadian realtors work, from predictive analytics to automated transaction management."
          },
          creaDdf: {
            title: "The Complete Guide to CREA DDF® Integration",
            excerpt: "Everything you need to know about accessing national MLS data and integrating CREA DDF® into your real estate workflow."
          },
          compliance: {
            title: "Provincial Compliance Checklist: ON, BC, AB, QC",
            excerpt: "Stay compliant with regulations across Canada. A comprehensive guide to RECO, BCFSA, RECA, and AMF requirements."
          },
          leadConversion: {
            title: "10 Ways to Increase Lead Conversion with Predictive Analytics",
            excerpt: "Learn how AI-powered lead scoring and predictive analytics can increase your conversion rate from 5% to 18%."
          },
          bilingual: {
            title: "Bilingual Real Estate Marketing: Beyond Translation",
            excerpt: "Master the art of true bilingual marketing for Canadian markets. It's not just about translation - it's about cultural communication."
          },
          successStory: {
            title: "How Sarah Chen Closed 14 Extra Deals in Q1 with AI",
            excerpt: "A Toronto agent's journey from traditional CRM to AI-powered success. Real numbers, real results, real transformation."
          }
        },
        readTime: "min read",
        readMore: "Read More",
        newsletter: {
          title: "Get weekly insights delivered to your inbox",
          subtitle: "Actionable AI and real estate tips for Canadian agents, delivered weekly",
          placeholder: "Enter your email",
          subscribe: "Subscribe",
          noSpam: "No spam. Unsubscribe anytime. Privacy policy.",
          consent: "I agree to receive marketing emails from RealtorDesk AI (you can unsubscribe at any time)."
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
        blogs: "Articles",
        blog: "Articles",
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
        copyright: "© 2026 Realtor Desk · Brainfy AI Inc. · Edmonton, AB",
        madeInCanada: "Made in Canada 🇨🇦 for Canadian Realtors",
        poweredBy: "Powered by Brainfy AI Inc",
        cookieSettings: "Cookie Settings",
        resourcesHeading: "Resources"
      },
      notFound: {
        heading: "Oops! Page not found",
        body: "The page you're looking for doesn't exist or has been moved.",
        goDashboard: "Go to dashboard",
        goHome: "Return to home",
        seoTitle: "Page not found — Realtor Desk",
        seoDesc: "The page you're looking for doesn't exist or has been moved."
      },
      trial: {
        daysRemaining: "{{count}} days remaining in your free trial",
        oneDay: "1 day remaining in your free trial",
        expirestoday: "Your trial expires today!",
        upgradeMessage: "Upgrade now to keep all your data and unlock premium features",
        upgradeNow: "Upgrade Now",
        expired: {
          title: "Your Free Trial Has Ended",
          description: "Subscribe now to continue using Realtor Desk and keep all your data"
        },
        monthly: "Monthly",
        yearly: "Yearly",
        savePercent: "Save 44%",
        billedYearly: "Billed annually at ${{price}}",
        subscribeMonthly: "Subscribe Monthly",
        subscribeYearly: "Subscribe Yearly",
        includesFeatures: "All plans include:",
        guarantee: "30-day money-back guarantee • Cancel anytime",
        feature: {
          unlimitedContacts: "Unlimited contacts & leads",
          aiLeadScoring: "AI-powered lead scoring",
          emailAutomation: "Email automation",
          dealPipeline: "Deal pipeline management",
          marketInsights: "Market insights & analytics",
          prioritySupport: "Priority support"
        },
        status: {
          title: "Subscription status",
          trialActive: "Trial active",
          trialExpired: "Trial expired",
          subscribed: "Active subscription",
          daysLeft: "{{count}} days left in trial",
          endsOn: "Ends on {{date}}",
          tier: "Current plan: {{tier}}"
        }
      },
      today: {
        loading: "Loading your day...",
        goodMorning: "Good morning",
        goodAfternoon: "Good afternoon",
        goodEvening: "Good evening",
        there: "there",
        weeklyActivity: "This Week's Activity",
        callsLogged: "Calls Logged",
        followUps: "Follow-ups Scheduled",
        dealsMoved: "Deals Moved Forward",
        makeCalls: "Make Today's Calls",
        contact: "contact",
        contacts: "contacts",
        readyToCall: "ready to call",
        whoToTalk: "Who to Talk to Today",
        whoToTalkDesc: "Your top priority contacts for today, sorted by urgency",
        allCaughtUp: "All caught up!",
        noUrgent: "No urgent follow-ups scheduled for today. Check back tomorrow or review your contact list.",
        noCalls: "No contacts to call today. Great job staying on top of things!",
        quickActions: "Quick Actions",
        viewContacts: "View All Contacts",
        checkDeals: "Check Deals",
        noContactsYet: "Add contacts to start making calls",
        importContacts: "Import Contacts",
        unnamedContact: "Unnamed Contact",
        loadFailed: "Failed to load data",
        reasons: {
          checkIn: "Regular check-in",
          firstContact: "First contact - new lead",
          overdue: "Overdue follow-up",
          scheduledToday: "Scheduled follow-up today",
          hotLead: "Hot lead - needs attention",
          activeDeal: "Active deal - check status",
          activeProspect: "Active prospect - nurture relationship",
          longOverdue: "Long overdue - reconnect"
        }
      },
      stages: {
        newLead: "New Lead",
        coldLead: "Cold Lead",
        warmLead: "Warm Lead",
        hotLead: "Hot Lead",
        viewing: "Viewing",
        offer: "Offer",
        negotiation: "Negotiation",
        underContract: "Under Contract",
        closed: "Closed",
        lost: "Lost",
        pastClient: "Past Client",
        sphere: "Sphere"
      },
      billing: {
        title: "Billing & subscription",
        subtitle: "Manage your subscription and billing details",
        activated: "Subscription activated successfully!",
        trialAccount: "Trial account",
        trialBadge: "Trial",
        daysLeft: "days left in your free trial",
        upgradeNow: "Upgrade now to unlock unlimited access and continue growing your business with AI-powered CRM.",
        agentPlan: "Agent plan",
        teamPlan: "Team plan",
        subscriptionActive: "Your subscription is active",
        nextBilling: "Next billing date",
        opening: "Opening...",
        manageBilling: "Manage billing",
        selectPeriod: "Select billing period",
        monthly: "Monthly",
        yearly: "Yearly",
        year: "year",
        month: "month",
        saveYearly: "Save up to $789/year",
        availablePlans: "Available plans",
        choosePlan: "Choose your plan",
        current: "Current",
        mostPopular: "Most popular",
        agentDesc: "Perfect for individual agents",
        teamDesc: "For growing teams of 2-5 agents",
        switchAgent: "Switch to Agent plan",
        upgradeAgent: "Upgrade to Agent plan",
        upgradeTeam: "Upgrade to Team plan",
        features: {
          unlimitedContacts: "Unlimited contacts & leads",
          aiCrm: "AI-powered predictive CRM",
          chatbot: "24/7 AI chatbot",
          emailSms: "Email & SMS automation",
          mobileApp: "Mobile app included",
          everythingAgent: "Everything in Agent, plus:",
          teamCollab: "Team collaboration tools",
          leadRouting: "Lead distribution & routing",
          advReporting: "Advanced reporting",
          accountManager: "Dedicated account manager"
        }
      },
      
      onboarding: {
        profile: {
          title: "Let's Set Up Your Profile",
          subtitle: "Tell us about yourself to personalize your experience",
          fullName: "Full Name",
          companyName: "Company/Brokerage Name",
          licenseNumber: "Real Estate License Number",
          province: "Province",
          city: "City",
          primaryLanguage: "Primary Language",
          avatarUploaded: "Avatar uploaded!",
          avatarFailed: "Failed to upload avatar",
          saveFailed: "Failed to save profile"
        },
        goals: {
          title: "Your Business Goals",
          subtitle: "Help us tailor Realtor Desk AI to your objectives",
          role: "Your Role",
          soloAgent: "Solo Agent",
          teamLeader: "Team Leader",
          brokerManager: "Broker/Manager",
          saveFailed: "Failed to save business goals"
        },
        chatbot: {
          title: "AI Chatbot Setup",
          subtitle: "Customize your AI assistant to qualify leads 24/7",
          botName: "Chatbot Name",
          greeting: "Greeting Message",
          configured: "Chatbot configured!",
          saveFailed: "Failed to save chatbot settings"
        },
        calendar: {
          title: "Calendar Integration",
          subtitle: "Connect your calendar and set your availability",
          saved: "Calendar settings saved!",
          saveFailed: "Failed to save calendar settings",
          finish: "Finish Setup"
        },
        import: {
          title: "Import Your Contacts",
          subtitle: "Choose how you'd like to add your contacts",
          skipContacts: "Skip - I'll add contacts later"
        },
        complete: {
          title: "You're All Set!",
          welcome: "Welcome to Realtor Desk AI",
          whatWeSetUp: "What We Set Up",
          whatsNext: "What's Next?",
          goDashboard: "Go to Dashboard",
          watchTutorial: "Watch Tutorial",
          skipTutorial: "Skip Tutorial",
          needHelp: "Need help getting started?",
          contactSupport: "Contact our support team"
        },
        saveFailed: "Failed to save progress. Please try again.",
        welcome: "Welcome to Realtor Desk AI!",
        completeFailed: "Failed to complete setup. Please try again.",
        heading: "Getting started — 60 minutes, guided",
        subheading: "Five steps to go from empty dashboard to first follow-up call.",
        ack: "Got it",
        step: {
          profile: {
            title: "Complete your profile",
            desc: "Add your brokerage, license, and contact info."
          },
          contact: {
            title: "Add your first contact",
            desc: "Import a CSV or add a lead manually."
          },
          property: {
            title: "Add your first property",
            desc: "Paste a realtor.ca URL or enter details."
          },
          widget: {
            title: "Set up your website widget",
            desc: "Launches Q3 2026 — see roadmap."
          },
          calendar: {
            title: "Connect Google or Outlook Calendar",
            desc: "Sync appointments into your dashboard."
          }
        }
      },
      auth: {
        backToWebsite: "Back to realtordesk.ai",
        protectedSession: "Protected Session",
        pipedaCompliant: "PIPEDA Compliant",
        ssl: "256-bit SSL",
        canadianData: "Canadian Data",
        login: {
          subtitle: "Sign in to your workspace",
          orEmail: "Or continue with email",
          emailAddress: "Email address",
          password: "Password",
          forgotPassword: "Forgot password?",
          signInSecurely: "Sign in securely",
          sslNotice: "Your connection is secured with 256-bit SSL encryption",
          noAccount: "Don't have an account?",
          startTrial: "Start your free trial"
        },
        signup: {
          subtitle: "Start your 14-day free trial",
          orEmail: "Or register with email",
          agreeToThe: "I agree to the",
          privacyPolicy: "Privacy Policy",
          termsOfService: "Terms of Service",
          marketingConsent: "Send me tips & product updates (optional)",
          sslNote: "Your data is stored securely on Canadian servers with 256-bit SSL encryption"
        },
        forgot: {
          title: "Reset password",
          subtitle: "Enter your email and we'll send you a reset link",
          enterEmail: "Please enter your email address",
          emailSent: "Password reset email sent!",
          sendFailed: "Failed to send reset email",
          sending: "Sending...",
          sendLink: "Send reset link",
          backToLogin: "Back to sign in",
          checkEmail: "Check your email",
          sentTo: "We've sent a password reset link to",
          linkExpiry: "Click the link in the email to reset your password. The link will expire in 1 hour.",
          checkSpam: "If you don't see the email, check your spam folder."
        },
        reset: {
          title: "Set new password",
          subtitle: "Enter your new password below",
          newPassword: "New Password",
          confirmPassword: "Confirm Password",
          success: "Password reset successful!",
          fillAll: "Please fill in all fields",
          noMatch: "Passwords do not match",
          requirements: "Password does not meet all requirements",
          updated: "Password updated successfully!",
          failed: "Failed to reset password",
          resetting: "Resetting...",
          resetButton: "Reset Password"
        }
      },
      cookie: {
        title: "🍪 Cookie Preferences",
        description: "We use cookies to enhance your browsing experience and analyze site traffic. You can customize your cookie preferences or accept all.",
        privacyLink: "Privacy Policy",
        acceptAll: "Accept All Cookies",
        necessaryOnly: "Necessary Only",
        customize: "Customize",
        necessary: "Necessary Cookies",
        necessaryDesc: "Required for basic site functionality. Cannot be disabled.",
        analytics: "Analytics Cookies",
        analyticsDesc: "Help us understand how visitors interact with our website.",
        marketing: "Marketing Cookies",
        marketingDesc: "Used to deliver personalized advertisements relevant to you.",
        functional: "Functional Cookies",
        functionalDesc: "Enable enhanced functionality like chat widgets and preferences.",
        savePreferences: "Save Preferences",
        back: "Back"
      },
      boldtrail: {
        compare: {
          heading: "Four rows. Not forty.",
          sub: "We do not compare on feature breadth. BoldTrail has 400,000+ agents on their platform; we have fewer than a hundred. These are the four axes where we can defend the claim, each sourced from BoldTrail's own help center, pricing signals, or public reviews."
        },
        betterWhen: {
          heading: "When BoldTrail is the better choice",
          body: "If you run a large brokerage in the United States, need BackOffice commission splits, or require deep integration with US-specific MLS systems that our CREA DDF work does not yet cover, BoldTrail is the more mature choice today. We are built for the independent Canadian agent or boutique team \u2014 we are smaller, more focused, and will remain so for the foreseeable future. Pick the tool that fits, not the longer feature list."
        }
      },
      leadScore: {
        title: "Why this lead scored",
        openExplainer: "Why this lead scored",
        emailActivity: "Email activity (last 30 days)",
        propertyViews: "Property views",
        daysSinceContact: "Days since last contact",
        loading: "Loading signals\u2026",
        noSignals: "No behavioural signals yet. Log calls, emails, and property views to see this panel populate.",
        manualNotice: "Your score is currently derived from a fixed formula. AI-derived scoring trained on your own conversion history ships Q2 2026."
      },
      onboardingChecklist: {
        heading: "Getting started — 60 minutes, guided",
        subheading: "Five steps to go from empty dashboard to first follow-up call.",
        ack: "Got it",
        step: {
          profile: {
            title: "Complete your profile",
            desc: "Add your brokerage, license, and contact info."
          },
          contact: {
            title: "Add your first contact",
            desc: "Import a CSV or add a lead manually."
          },
          property: {
            title: "Add your first property",
            desc: "Paste a realtor.ca URL or enter details."
          },
          widget: {
            title: "Set up your website widget",
            desc: "Launches Q3 2026 — see roadmap."
          },
          calendar: {
            title: "Connect Google or Outlook Calendar",
            desc: "Sync appointments into your dashboard."
          }
        }
      },
      roadmap: {
        badge: "Public roadmap",
        title: "What we are shipping — and what we are not.",
        subtitle: "Honesty is a feature. This page lists dated commitments for the capabilities our customers and competitors ask about most. If a date slips, we move it — we don't silently drop it.",
        lastUpdated: "Last updated: 2026-04-20",
        status: {
          shipping: "Shipping",
          shipped: "Shipped",
          building: "Building",
          designing: "Designing",
          roadmapped: "Roadmapped",
          considering: "Considering"
        },
        quarter: {
          apr_2026: "Apr 2026",
          q2_2026: "Q2 2026",
          q3_2026: "Q3 2026",
          q1_2027: "Q1 2027",
          tbd: "—"
        },
        section: {
          now: { heading: "Shipping This Sprint (April 2026)" },
          q2: { heading: "Q2 2026" },
          q3: { heading: "Q3 2026" },
          q1_2027: { heading: "Q1 2027 — Teams tier" },
          not_on: { heading: "Not on the 2026 Roadmap" }
        },
        item: {
          casl_footer: {
            title: "CASL-compliant email footer + functional unsubscribe",
            desc: "Every system email we send carries sender ID, physical address, consent basis, and a one-click unsubscribe that actually writes to an opt-out list."
          },
          pricing_parity: {
            title: "Pricing page = Stripe checkout parity",
            desc: "Every amount on /pricing is derived from the same constant that create-checkout forwards to Stripe, with a CAD label and GST/HST disclaimer."
          },
          lead_score_explainer: {
            title: "Lead score explainer",
            desc: "Contact detail page surfaces the 3 behavioural signals behind the score instead of showing a number-only."
          },
          onboarding_checklist: {
            title: "Onboarding checklist on /today",
            desc: "New accounts see a 5-step guided setup (profile, contact, property, website widget link, calendar connect). Persisted to the database, not localStorage."
          },
          ai_scoring: {
            title: "AI-derived lead scoring",
            desc: "Replace the current manual/formula-based score with a model trained on per-agent conversion history. Web push when a lead heats up (no native app required)."
          },
          trigger_campaigns: {
            title: "Trigger-based email sequences",
            desc: "Wire /campaigns and /automations to a real sequence runner. New-lead, went-cold, birthday, listing-anniversary triggers. Pause-on-reply detection. All templates ship bilingual with the CASL footer."
          },
          idx_sites: {
            title: "Public agent websites + behavioural lead capture (CREA DDF)",
            desc: "realtordesk.ai-hosted agent sites backed by the CREA DDF feed. Behavioural widgets feed lead scores in real time. Free with all paid tiers."
          },
          teams_tier: {
            title: "Teams tier launch",
            desc: "Multi-agent accountability dashboard, manager views, and daily-vitals rollups. Until this ships, RealtorDesk AI is built for solo agents and boutique teams (≤5)."
          },
          social_promotion: {
            title: "One-click social promotion",
            desc: "Reconsidered for Q1 2027 at the earliest. Today, you can share the public listing page to socials manually."
          },
          native_mobile: {
            title: "Native mobile app",
            desc: "We support mobile via web push + a Capacitor-wrapped PWA. A native iOS/Android app is not planned for 2026."
          },
          commissions: {
            title: "Commissions / BackOffice module",
            desc: "Out of scope. This would be a separate product surface, not an add-on to the CRM."
          },
          recruiting: {
            title: "Agent recruitment tooling",
            desc: "Out of scope. We are building for working agents, not brokerages recruiting agents."
          }
        },
        footer: {
          title: "See something missing or want to vote on priority?",
          body: "Email product@realtordesk.ai or open an item in the in-app feedback panel. Items with customer signal get prioritized before internal asks.",
          viewPricing: "View pricing",
          viewFeatures: "What ships today"
        }
      },
      unsubscribe: {
        title: "Unsubscribe from Realtor Desk emails",
        working: "Processing your request\u2026",
        success: "You've been unsubscribed. We will not send further emails to",
        thisAddress: "this address",
        effectiveImmediate: "Your opt-out is effective immediately per CASL \u00a711.",
        errorExpired: "This unsubscribe link has expired. Request a fresh one below.",
        errorInvalid: "This unsubscribe link is invalid. Request a fresh one below.",
        linkSent: "If this address is on our list, we just sent you a confirmation link. Click it to finish opting out.",
        linkSentNote: "Links expire in 30 days. Check your spam folder if you don't see it in a minute.",
        manualPrompt: "Enter the email address you want removed from our list. We will send you a one-click confirmation link.",
        ctaSendLink: "Send me an unsubscribe link",
        casl: "Operated under CASL by Brainfy AI Inc. (Realtor Desk).",
        back: "Back to Realtor Desk"
      },
      rd: {
        sidebar: {
          workspaceTier: "Team plan",
          collapse: "Collapse sidebar",
          nav: {
            dashboard: "Dashboard",
            leads: "Leads",
            conversations: "Conversations",
            pipeline: "Pipeline",
            automation: "Automation",
            reports: "Reports",
            settings: "Settings"
          },
          desk: {
            title: "Desk AI · on duty",
            summary: "Answered {{count}} leads this week. Avg response {{response}}."
          }
        },
        topnav: {
          search: "Search leads, listings, conversations…",
          live: "Live",
          notifications: "Notifications",
          language: "Language"
        },
        pages: {
          dashboard: {
            title: "Dashboard",
            saluteMorning: "Good morning",
            saluteAfternoon: "Good afternoon",
            saluteEvening: "Good evening",
            subhead: "Desk worked overnight."
          },
          leads: { title: "Leads" },
          inbox: { title: "Conversations" },
          pipeline: { title: "Pipeline" },
          automation: { title: "Automation" },
          reports: { title: "Reports" }
        },
        stages: {
          new: "New",
          contacted: "Contacted",
          qualified: "Qualified",
          showing: "Showing",
          offer: "Offer",
          won: "Won",
          lost: "Lost"
        },
        bands: { hot: "Hot", warm: "Warm", cold: "Cold" },
        actions: {
          addLead: "Add lead",
          filter: "Filter",
          import: "Import",
          sort: "Sort",
          scoreHighToLow: "Score · high to low",
          allAgents: "All agents",
          newSequence: "New sequence",
          templates: "Templates",
          editFlow: "Edit flow",
          preview: "Preview",
          call: "Call",
          bookShowing: "Book showing",
          takeOver: "Take over",
          draftWithAi: "Draft with AI",
          attachListing: "Attach listing",
          send: "Send",
          sending: "Sending…",
          use: "Use",
          exportCsv: "Export CSV",
          share: "Share",
          backToLeads: "Back to leads",
          openActivityLog: "Open activity log",
          openPipeline: "Open pipeline"
        },
        tabs: {
          leads: {
            all: "All",
            hot: "Hot",
            warm: "Warm",
            cold: "Cold",
            aiHandled: "AI-handled",
            needsReply: "Needs reply"
          },
          automation: { all: "All", active: "Active", draft: "Draft" },
          inbox: { all: "All", unread: "Unread", ai: "AI", flagged: "Flagged", mine: "Mine" }
        },
        common: {
          sampleData: "sample data",
          sampleLeads: "sample leads",
          sampleLead: "sample lead",
          loading: "loading…",
          live: "Live",
          selectAll: "Select all",
          active: "Active",
          draft: "Draft",
          noResultsMatch: "No results match this filter.",
          noConversationsMatch: "No conversations match.",
          noSequencesMatch: "No sequences match this filter.",
          noMessagesYet: "No messages yet.",
          unreadCount: "{{count}} unread"
        },
        columns: {
          leads: {
            lead: "Lead",
            listing: "Listing",
            source: "Source",
            aiScore: "AI score",
            stage: "Stage",
            lastActivity: "Last activity"
          },
          reports: {
            source: "Source",
            spend: "Spend",
            leads: "Leads",
            closed: "Closed",
            roi: "ROI"
          }
        },
        kpi: {
          activeLeads: "Active leads",
          showingsBooked: "Showings booked",
          pipelineValue: "Pipeline value",
          avgResponseTime: "Avg response time",
          dealsClosed: "Deals closed",
          leadToShowing: "Lead → Showing",
          revenueAttributed: "Revenue attributed"
        },
        sections: {
          today: "Today",
          pipelineSnapshot: "Pipeline snapshot",
          leadSources30d: "Lead sources · 30d",
          compliance: "Compliance",
          deskAiActivity: "Desk AI activity",
          responseTimeTrend: "Response time trend",
          aiVsAgent21d: "AI vs. Agent · last 21 days",
          pipelineConversion: "Pipeline conversion",
          stageFunnel: "Stage funnel",
          sourceRoi: "Source ROI",
          revenuePerLeadSource: "Revenue per lead source",
          agentLeaderboard: "Agent leaderboard",
          thisMonth: "This month",
          buyingProfile: "Buying profile",
          viewedListings: "Viewed listings",
          timeline: "Timeline",
          contact: "Contact",
          aiLeadScore: "AI lead score"
        },
        inbox: {
          searchConversations: "Search conversations…",
          selectConversation: "Select a conversation from the left.",
          emptyThread: "No messages yet. When a lead replies to a drip or sends a chat, it appears here.",
          suggestedReply: "Suggested reply:",
          composerPlaceholder: "Type a message to the lead…",
          deskAiReplying: "Desk AI replying",
          manualHandling: "Manual handling"
        },
        pipelinePage: {
          totalPipeline: "Total pipeline · {{value}} · {{count}} leads",
          listViewLives: "List view lives at /app/leads — this toggle exists for parity with the design; it links rather than duplicating the table.",
          forecastShips: "Forecast view ships in the Reports phase.",
          viewKanban: "Kanban",
          viewList: "List",
          viewForecast: "Forecast"
        },
        reportsPage: {
          aiAvg: "AI · {{label}} avg",
          agentManual: "Agent · manual timing (not yet tracked)",
          noSourcesYet: "No sources yet"
        },
        funnel: {
          leadsCaptured: "Leads captured",
          showingBooked: "Showing booked",
          closedWon: "Closed won"
        },
        onboarding: {
          loading: "Loading your onboarding…",
          stepOfFive: "Step {{n}} of 5",
          stepLabels: {
            welcome: "Welcome",
            profile: "Profile",
            connectDdf: "Connect DDF",
            aiVoice: "AI voice",
            goLive: "Go live"
          },
          status: { complete: "Complete", inProgress: "In progress" },
          rail: {
            setupTime: "Typical setup takes 5 minutes. Your data is hosted in Canada from the second you sign up.",
            saving: "Saving your progress…"
          },
          welcome: {
            titleLead: "Welcome to",
            titleBrand: "RealtorDesk",
            subtitle: "Let's get your AI deskmate on duty. In about five minutes, she'll be answering leads in French and English.",
            helperCanadaTitle: "Hosted in Canada",
            helperCanadaBody: "Your leads, messages, and MLS data stay on Canadian soil. PIPEDA-compliant from minute one.",
            helperMarketTitle: "Built for our market",
            helperMarketBody: "Designed with brokers from Toronto, Montreal, Vancouver, Calgary — not retrofit from a US tool.",
            helperLiveTitle: "Five minutes, live",
            helperLiveBody: "Most agents answer their first lead before the setup email even arrives.",
            workEmail: "Work email",
            password: "Create a password",
            consent: "I consent to RealtorDesk AI storing my data in Canada per PIPEDA, and I'll only use the product to contact people who've consented (CASL).",
            continueBtn: "Continue",
            signInInstead: "Sign in instead",
            orContinueWith: "or continue with",
            google: "Google",
            microsoft: "Microsoft 365"
          },
          profile: {
            title: "Tell us about your desk.",
            subtitle: "We use this to tailor templates, pick a default language, and make sure the AI sounds like you.",
            helperLanguageTitle: "Language detection",
            helperLanguageBody: "Desk AI detects each lead's language automatically. You pick the default it reverts to if the message is short.",
            helperTemplatesTitle: "Brokerage templates",
            helperTemplatesBody: "We pre-load RECO/OACIQ-safe disclaimers based on your province.",
            firstName: "First name",
            lastName: "Last name",
            brokerage: "Brokerage",
            province: "Province",
            defaultLanguage: "Default language",
            frDetectedBadge: "+ FR detected",
            regNumber: "RECO / OACIQ registration #",
            back: "Back",
            continueBtn: "Continue"
          },
          ddf: {
            title: "Connect your CREA DDF® feed.",
            subtitle: "Desk AI listens to your board's DDF so new inquiries, price changes, and status flips show up instantly.",
            helperReadOnlyTitle: "Read-only & scoped",
            helperReadOnlyBody: "We only read listings assigned to your RECO/OACIQ #. No shared brokerage data leaves your seat.",
            helperSyncTitle: "Sync in < 60 seconds",
            helperSyncBody: "We reindex every minute. Your new listing is live in the AI's knowledge before your sign goes in the ground.",
            boardName: "Toronto Regional Real Estate Board",
            boardMeta: "Matched from your RECO # · 247 active listings",
            connectedBadge: "Connected",
            statListings: "Listings",
            statNewLast30d: "New last 30d",
            statSyncCadence: "Sync cadence",
            addBoard: "Add another board",
            addBoardDesc: "REBGV, OACIQ, CREB — connect as many as you service.",
            addBtn: "Add",
            back: "Back",
            continueBtn: "Continue",
            skip: "Skip for now"
          },
          voice: {
            title: "Give Desk AI your voice.",
            subtitle: "Pick a tone. Paste a sample of how you actually write. Desk AI will answer leads in your voice — not a generic chatbot.",
            helperBetterTitle: "It gets better daily",
            helperBetterBody: "Every time you edit an AI draft, Desk learns. After week one, 90% of agents approve drafts without changes.",
            helperBilingualTitle: "Bilingual by design",
            helperBilingualBody: "Train once — Desk adapts your tone across French and English automatically.",
            toneLabel: "Tone",
            toneWarmLabel: "Warm & conversational",
            toneWarmDesc: "Friendly, uses first names. Default.",
            tonePolishedLabel: "Polished & formal",
            tonePolishedDesc: "Good for luxury, QC OACIQ.",
            toneDirectLabel: "Direct & brief",
            toneDirectDesc: "For investors, commercial.",
            pasteLabel: "Paste a recent email or DM (optional, 50+ words)",
            previewLabel: "Desk AI preview —",
            previewText: "Hi Priya — quick one, a new listing in Oakville dropped this morning that fits your list. Want to swing by tomorrow before offers come in?",
            back: "Back",
            continueBtn: "Continue"
          },
          live: {
            titleLead: "Desk is",
            titleAccent: "on duty",
            subtitle: "You're live. The next lead that comes in — night or day, English or French — gets an instant reply in your voice.",
            helperPingsTitle: "How you'll be pinged",
            helperPingsBody: "Push notifications on mobile. Email digest at 9 AM. SMS only for Hot leads (score ≥ 80).",
            helperCustomizeTitle: "Customize anytime",
            helperCustomizeBody: "Workspace → Desk AI settings. Pause AI per lead, per listing, or per time of day.",
            deskLabel: "Desk AI",
            liveBadge: "Live",
            listeningNote: "Listening on TRREB · EN + FR · Warm tone",
            kpiListings: "Listings synced",
            kpiLanguages: "Languages",
            kpiSla: "Response SLA",
            kpiAlwaysOn: "Always on",
            nextLeadsTitle: "Import your leads",
            nextLeadsDesc: "CSV, BoldTrail, Follow Up Boss, kvCORE.",
            nextInboxTitle: "Forward your inbox",
            nextInboxDesc: "Set up lead@yourdomain.ca to forward here.",
            nextWidgetTitle: "Add your website widget",
            nextWidgetDesc: "One script tag. Bilingual chat bubble.",
            nextTeamTitle: "Invite your team",
            nextTeamDesc: "5 seats on Team plan. $15 each after.",
            takeToDashboard: "Take me to the dashboard",
            tour: "Watch the 2-min tour"
          }
        },
        automationPage: {
          allSequences: "All sequences",
          stepFlow: "{{count}}-step flow",
          sent: "{{count}} sent",
          replied: "{{count}} replied",
          rate: "{{pct}}% rate",
          caslRequired: "CASL consent required",
          notYetRun: "Not yet run",
          selectSequence: "Select a sequence to preview.",
          pauseSequence: "Pause sequence",
          activateSequence: "Activate sequence",
          triggers: {
            newLead: "New lead",
            wentCold: "Went cold",
            showing: "Showing",
            consent: "Consent"
          }
        }
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
        faq: "FAQ",
        bookDemo: "Réservez votre démo gratuite",
        startClosing: "Commencer à Conclure Plus",
        getStarted: "Commencer",
        giveFeedback: "Donner un avis",
        signedOut: "Déconnexion réussie",
        searchPlaceholder: "Rechercher contacts, propriétés, transactions...",
        add: "Ajouter",
        addContact: "Contact",
        addProperty: "Propriété",
        addDeal: "Transaction",
        addTask: "Tâche",
        notifications: "Notifications",
        viewAllNotifications: "Voir toutes les notifications",
        profile: "Profil",
        settings: "Paramètres",
        signOut: "Se déconnecter",
        uploadPhoto: "Téléverser une photo",
        changePhoto: "Changer la photo",
        removePhoto: "Retirer la photo",
        uploadingPhoto: "Téléversement…"
      },
      hero: {
        title: "Concluez Plus de Transactions avec une IA Conçue pour les Courtiers Canadiens",
        subtitle: "Capture de prospects 24/7, gestion d'appels et automation par courriel—conçue pour le marché canadien avec support bilingue complet. Intégration CREA DDF® prévue pour Q3 2026.",
        getStarted: "Commencez Votre Essai Gratuit de 14 Jours",
        watchDemo: "Réservez votre démo gratuite",
        trustLine: "14 Jours Gratuits • Aucune carte de crédit • Annulez à tout moment",
        badge1: "Conforme PIPEDA par Conception",
        badge2: "Bilingue EN/FR",
        badge3: "50+ Utilisateurs Bêta",
        conversionBadge: "Hausse de Conversion de 30% (Conservatrice)",
        badge: "Essai Gratuit de 14 Jours",
        bullet1: "L'IA répond aux prospects instantanément, 24/7",
        bullet2: "Conçu pour les courtiers canadiens — LPRPDE, LCAP, bilingue EN/FR",
        bullet3: "Bilingue EN/FR",
        testimonial: "\"3 prospects capturés en 48h que j'aurais perdus\"",
        joinAgents: "Rejoignez 50+ courtiers canadiens",
        activeAgents: "Courtiers actifs",
        leads: "Prospects",
        aiActive: "IA Active"
      },
      roi: {
        badge: "Calculez Votre ROI",
        title: "Voyez Vos Économies Potentielles",
        subtitle: "Découvrez combien de temps et d'argent vous pourriez économiser avec l'automatisation IA"
      },
      home: {
        faq: {
          title: "Questions Fréquemment Posées",
          subtitle: "Obtenez des réponses aux questions courantes sur RealtorDesk AI",
          moreQuestions: "Vous avez d'autres questions? Nous sommes là pour vous aider!",
          viewAll: "Voir Toutes les FAQ",
          contactSupport: "Contacter le Support"
        },
        security: {
          archTitle: "Architecture Axée sur la Sécurité",
          archDesc: "Chiffrement de niveau entreprise et pratiques de sécurité protégeant vos données clients",
          pipedaTitle: "Conception Axée sur la LPRPDE",
          pipedaDesc: "Construit avec les principes canadiens de confidentialité — gestion du consentement, droit à l'effacement, notifications de violation",
          mlsTitle: "Intégration MLS Canadienne",
          mlsDesc: "Importez et synchronisez les données de propriétés canadiennes directement dans votre CRM",
          bilingualTitle: "Support bilingue",
          bilingualDesc: "Communication transparente en anglais et en français",
          infraTitle: "Infrastructure Optimisée pour le Canada",
          infraDesc: "Hébergé sur une infrastructure conçue pour maintenir vos données au Canada",
          aiTitle: "Score IA des Prospects",
          aiDesc: "Priorisez les prospects chauds automatiquement"
        },
        audience: {
          agentTitle: "Pour les Agents",
          agentDesc: "Pour automatiser vos programmes marketing, capturer et convertir plus de prospects en transactions.",
          teamTitle: "Pour les Équipes",
          teamDesc: "Pour optimiser votre processus de vente, maximiser la collaboration et conclure plus de transactions d'équipe.",
          brokerTitle: "Pour les Courtages",
          brokerDesc: "Pour accélérer la croissance rentable en augmentant la productivité des courtiers et en réduisant les coûts opérationnels.",
          learnMore: "En Savoir Plus"
        },
        socialProof: {
          agents: "agents",
          usingNow: "l'utilisent maintenant",
          demos: "démos",
          bookedThisWeek: "réservées cette semaine",
          joinAgents: "Rejoignez les agents qui concluent significativement plus de transactions"
        },
        credibility: {
          title: "Approuvé et Sécurisé"
        },
        demo: {
          title: "Voyez Realtor Desk AI en Action",
          description: "Découvrez comment l'IA peut transformer votre entreprise immobilière en seulement 2 minutes",
          watchDemo: "Regarder la Démo Produit de 2 Minutes",
          bookDemo: "Réservez une démo en direct",
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
          market: "Intelligence de marché",
          transaction: "Gestion des transactions",
          marketing: "Automation Marketing"
        },
        tab1: "CRM Prédictif",
        tab2: "Chatbot IA",
        tab3: "Intelligence du Marché",
        tab4: "Gestion des Transactions",
        tab5: "Automatisation Marketing",
        crm: { h1: "Score Multi-Dimensionnel de Prospects", p1: "L'IA analyse les signaux d'engagement — recherches de propriétés, ouvertures de courriels, activité sociale, indicateurs hypothécaires — pour classer vos prospects", sub1: "Concentrez-vous sur vos meilleurs prospects et concluez plus de transactions", h2: "Intelligence Conversationnelle", p2: "Analyse de sentiment en temps réel par courriel, SMS et chat, avec détection d'urgence et suggestions de réponses automatisées", sub2: "45% de réponses plus pertinentes, 60% moins de transactions perdues", h3: "Enrichissement Automatisé des Données", p3: "Construction autonome de profils de contacts à partir des registres publics, des réseaux sociaux et du suivi comportemental", sub3: "Réduisez radicalement la saisie manuelle avec la création automatique de profils" },
        chatbot: { h1: "Engagement Multilingue 24/7", p1: "Conversations intelligentes en anglais et français, gère les demandes immobilières, qualifie les prospects, planifie les visites", sub1: "Maximisez la capture de prospects hors heures avec une IA qui ne dort jamais", h2: "Système de Qualification Intelligent", p2: "L'IA mène des conversations naturelles pour évaluer la préparation, le budget, le calendrier et les préférences de l'acheteur", sub2: "Seuls les prospects qualifiés atteignent votre agenda", h3: "Transfert Transparent vers un Humain", p3: "L'IA sait quand transférer vers un agent humain avec le contexte complet de la conversation", sub3: "Ne perdez jamais un prospect chaud à l'automatisation" },
        market: { h1: "Analyses de Propriétés Propulsées par l'IA (Bientôt)", p1: "Analyse de propriétés assistée par IA utilisant les tendances du marché local, les ventes comparables et les données de quartier", sub1: "Des ACM plus rapides, basées sur les données, pour vos clients", h2: "Détection d'Opportunités Hors-Marché", p2: "L'IA prédit quels propriétaires sont susceptibles de vendre 3 à 6 mois avant la mise en vente", sub2: "Obtenez des inscriptions exclusives avant vos concurrents", h3: "Rapports de Marché en Temps Réel", p3: "Analyse comparative de marché automatisée avec taux d'absorption, tendances des jours sur le marché, évolution du prix au pied carré", sub3: "Positionnez-vous comme l'expert du marché local" },
        transaction: { h1: "Prédiction Intelligente des Délais", p1: "L'IA prévoit les dates de clôture selon le type de transaction, les parties impliquées et les performances historiques", sub1: "Conçu pour accélérer vos délais de clôture avec moins d'étapes manquées", h2: "Coordination Automatisée des Fournisseurs", p2: "Planification intelligente des inspecteurs, évaluateurs et avocats avec optimisation des disponibilités", sub2: "75% moins de délais manqués", h3: "Moteur de Détection des Risques", p3: "Alertes prédictives pour problèmes de financement, d'inspection et hésitations acheteur/vendeur", sub3: "Taux d'échec des transactions réduit de 12% à 4%" },
        marketing: { h1: "Génération de Contenu par IA", p1: "Création automatisée de descriptions de propriétés, publications sociales, campagnes courriel et guides de quartier", sub1: "85% moins de temps sur le contenu marketing", h2: "Distribution Intelligente", p2: "L'IA détermine les horaires de publication optimaux, les canaux et segments d'audience pour chaque contenu", sub2: "150% d'augmentation des taux d'engagement", h3: "Analyses de Performance", p3: "Suivi du ROI par type de contenu, plateforme et campagne avec recommandations d'amélioration", sub3: "45% de réduction du coût par prospect" },
        mobile: {
          title: "Travaillez de N'importe Où avec Notre Application Mobile",
          subtitle: "Gérez toute votre entreprise immobilière depuis votre téléphone. Répondez aux prospects, planifiez des visites et concluez des ventes en déplacement.",
          appStores: "Disponible sur iOS et Android",
          f1title: "Accès CRM Complet", f1desc: "Consultez et gérez tous vos contacts, prospects et transactions depuis votre téléphone",
          f2title: "Notifications Push", f2desc: "Recevez des alertes instantanées pour les nouveaux prospects, messages et mises à jour",
          f3title: "Mode Hors Ligne", f3desc: "Accédez à vos données même sans connexion internet",
          f4title: "Commandes Vocales", f4desc: "Ajoutez des notes et créez des tâches en mains libres en conduisant",
          download: "Téléchargez depuis l'App Store ou Google Play"
        },
        comparison: {
          title: "Comment Nous Comparons aux Principaux CRM",
          disclaimer: "* Prix et fonctionnalités à partir d'octobre 2025. Contactez les concurrents directement pour les informations actuelles.",
          feature: "Fonctionnalité",
          leadScoring: "Score Prédictif de Prospects", advancedAI: "✓ IA Avancée", basic: "Basique", manual: "Manuel", limited: "Limité",
          chatbot: "Chatbot IA 24/7", bilingual: "✓ Bilingue", addon: "Module complémentaire",
          ddf: "Intégration CREA DDF®", comingQ3: "Disponible T3 2026", thirdParty: "Tiers",
          transactionAI: "IA de Transactions", fullAutomation: "✓ Automatisation complète",
          compliance: "Conformité canadienne", builtIn: "✓ Intégré",
          marketingAuto: "Automatisation Marketing", aiGenerated: "✓ Généré par IA", templates: "Modèles",
          mobileApp: "Application Mobile", fullFeatured: "✓ Complète",
          startingPrice: "Prix de Départ", setupFee: "Frais d'Installation",
          contract: "Contrat", monthToMonth: "Mois par mois", annual: "Annuel"
        }
      },
      pricing: {
        taxDisclaimer: "Les prix sont en dollars canadiens (CAD). La TPS/TVH est appliquée au paiement selon votre province de facturation. Chaque montant affiché ici correspond exactement à ce que vous verrez sur la page de paiement sécurisée Stripe.",
        compare: {
          boldtrailCost: "5\u00a0988\u00a0$/an + frais d'installation de 999\u00a0$",
          loftyCost: "1\u00a0788\u00a0$ à 3\u00a0588\u00a0$/an par utilisateur",
          ourCost: "999\u00a0$/an (Membre Fondateur), 0\u00a0$ d'installation",
          saveCallout: "Économisez jusqu'à 85\u00a0% par rapport à BoldTrail, 45\u00a0% vs Lofty"
        },
        banner: {
          trial: "🎉 Essai Gratuit de 14 Jours - Commencez Aujourd'hui!",
          launch: "🎉 Prix de Lancement — Économisez 498 $/an vs. Mensuel!"
        },
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
            badge: "14 Jours d'Essai Gratuit",
            description: "Idéal pour les courtiers individuels prêts à se développer",
            savings: "Économisez 789 $/an avec la facturation annuelle",
            yearlySavingsDetail: "Économisez 789\u00a0$ vs mensuel (498\u00a0$ vs annuel standard)",
            period: "/mois",
            ctaMonthly: "Commencer l'Essai Gratuit de 14 Jours",
            ctaYearly: "Commencer l'Essai Gratuit de 14 Jours",
            feature1: "Contacts et prospects illimités",
            feature2: "CRM prédictif propulsé par l'IA",
            feature3: "Chatbot IA 24/7 (site web, SMS, courriel)",
            feature4: "Suivi du ROI et analyses",
            feature5: "Automatisation courriel et SMS",
            feature6: "Intelligence du marché canadien",
            feature7: "Support bilingue (EN/FR)",
            feature8: "Application mobile incluse",
            feature9: "Assistance à la migration gratuite",
            feature10: "Aucuns frais d'installation",
            feature11: "Support prioritaire"
          },
          team: {
            name: "ÉQUIPE",
            badge: "Le Plus Populaire",
            description: "Pour les équipes en croissance de 2 à 5 courtiers",
            period: "/mois",
            cta: "Commencer l'Essai Gratuit de 14 Jours",
            feature1: "Tout du plan Agent, plus :",
            feature2: "Outils de collaboration d'équipe",
            feature3: "Distribution et routage des prospects",
            feature4: "Tableau de bord de performance d'équipe",
            feature5: "Gestion de pipeline partagée",
            feature6: "Rapports et analyses avancés",
            feature7: "Support prioritaire",
            feature8: "Gestionnaire de compte dédié",
            feature9: "Sessions de formation personnalisées",
            feature10: "Accès API disponible",
            feature11: "Options en marque blanche"
          },
          brokerage: {
            name: "COURTAGE",
            badge: "14 Jours d'Essai Gratuit",
            price: "Sur devis",
            description: "Pour les courtages avec 6 courtiers et plus",
            cta: "Commencer l'Essai Gratuit de 14 Jours",
            feature1: "Tout du plan Équipe, plus :",
            feature2: "Courtiers illimités",
            feature3: "Image de marque personnalisée et marque blanche",
            feature4: "Contrôles administratifs avancés",
            feature5: "Gestion multi-bureau",
            feature6: "Outils de conformité pour courtage",
            feature7: "Gestionnaire de succès dédié",
            feature8: "Formation de modèle IA personnalisée",
            feature9: "Remises sur volume",
            feature10: "Support premium 24/7"
          }
        },
        compareTable: {
          heading: "Comparer avec les Concurrents",
          sub: "Voyez combien vous économisez avec Realtor Desk AI",
          firstYear: "Première année",
          perYear: "Par année",
          saveThousands: "Économisez des milliers !"
        },
        table: {
          heading: "Comparaison des Fonctionnalités : Pourquoi les Courtiers Passent à Realtor Desk AI",
          featureCol: "Fonctionnalité",
          annualPrice: "Prix Annuel (Agent)",
          setupFee: "Frais d'Installation",
          aiScoring: "Score Prédictif de Prospects par IA",
          chatbot: "Chatbot IA Bilingue 24/7",
          migration: "Migration Gratuite",
          compliance: "Conformité canadienne (RECO, BCFSA)",
          mobileApp: "Application Mobile",
          totalCost: "Coût Total Première Année",
          comingQ3: "(Disponible T3 2026)",
          comingSoon: "Bientôt disponible",
          extraCost: "Coût supplémentaire",
          partial: "Partielle",
          basic: "De base",
          limited: "Limité",
          varies: "Variable",
          boldtrailSwitch: "💰 Vous venez de BoldTrail ?",
          boldtrailSave: "Vous économiserez 5 988 $ dès la première année !"
        },
        social: {
          heading: "Résultats Réels de Courtiers Réels",
          stat1: "GCI supplémentaire la première année",
          stat2: "Transactions conclues via le chatbot IA",
          stat3: "Temps économisé sur les tâches administratives",
          stat3Headline: "15\u00a0h/sem",
          quote1: "\"Passé de BoldTrail et je n'ai jamais regardé en arrière. La notation des prospects par IA est incroyable.\"",
          quote2: "\"Le chatbot bilingue 24/7 capture des prospects pendant que je dors. Un vrai changement.\"",
          quote3: "\"L'automatisation gère les suivis. Je me concentre sur la conclusion, pas la saisie.\""
        },
        annual: {
          heading: "Pourquoi Choisir la Facturation Annuelle ?",
          monthly: "Plan Mensuel",
          mo: "/mois",
          bestValue: "Meilleur Rapport Qualité-Prix",
          annualPlan: "Plan Annuel (Membre Fondateur)",
          yr: "/an",
          save: "Économisez 789 $/an !",
          foundingBonus: "Bonus Membre Fondateur",
          disclaimer: "La facturation annuelle bloque votre tarif de Membre Fondateur pour toujours. Les plans mensuels peuvent augmenter à 149 $/mois après la fin de la promotion."
        },
        addons: {
          heading: "Améliorez Votre Plan avec des Modules Complémentaires",
          staging: "Mise en Scène Virtuelle IA",
          stagingDesc: "Mise en scène virtuelle illimitée pour toutes vos inscriptions",
          reports: "Rapports de Marché Avancés",
          reportsDesc: "Rapports personnalisés avec votre logo et votre image de marque",
          leads: "Module de Génération de Prospects",
          leadsDesc: "Identification ciblée de prospects vendeurs/acheteurs"
        },
        guarantees: {
          heading: "Nos Garanties pour Vous",
          moneyBack: "Garantie de Remboursement de 30 Jours",
          moneyBackDesc: "Concluez au moins une transaction supplémentaire dans vos 30 premiers jours ou obtenez un remboursement complet. Sans questions.",
          noContracts: "Sans Contrat, Annulez à Tout Moment",
          noContractsDesc: "Tous les plans sont mensuels. Annulez à tout moment en un clic. Sans pénalités, sans tracas.",
          freeSetup: "Installation et Migration Gratuites",
          freeSetupDesc: "Nous migrerons vos contacts et données depuis n'importe quel CRM gratuitement. Plus une intégration et une formation offertes.",
          badge1: "Sans contrat",
          badge2: "Aucuns frais d'installation",
          badge3: "Annulez à tout moment"
        },
        faq: {
          heading: "Questions Fréquemment Posées",
          q1: "Dois-je signer un contrat à long terme ?",
          q2: "L'intégration CREA DDF® est-elle incluse ?",
          q3: "Puis-je essayer avant d'acheter ?",
          q4: "Que se passe-t-il si je dépasse ma limite de contacts ?",
          q5: "Offrez-vous de la formation ?"
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
          heading: "Demander une Démo Personnalisée",
          title: "Demander une Démo Personnalisée",
          fullName: "Nom complet *",
          fullNamePlaceholder: "Jean Dupont",
          email: "Adresse courriel *",
          emailPlaceholder: "jean@exemple.com",
          phone: "Numéro de Téléphone *",
          brokerage: "Courtage/Entreprise",
          brokeragePlaceholder: "ABC Immobilier",
          province: "Province *",
          provincePlaceholder: "Sélectionner la province",
          crm: "CRM Actuel (le cas échéant)",
          crmPlaceholder: "Sélectionner le CRM",
          teamSize: "Nombre de Membres d'Équipe",
          teamSizePlaceholder: "Sélectionner la taille d'équipe",
          challenge: "Principal Défi",
          challengePlaceholder: "Sélectionner le défi",
          comments: "Commentaires/Questions",
          commentsPlaceholder: "Parlez-nous de vos besoins…",
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
          heading: "Coordonnées",
          title: "Informations de Contact",
          email: "Courriel",
          phone: "Téléphone",
          address: "Adresse"
        },
        selfServe: {
          heading: "Vous préférez explorer par vous-même?",
          sub: "Commencez votre essai gratuit de 14 jours — sans démo requise",
          cta: "Commencer l'Essai Gratuit de 14 Jours"
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
          visitUs: "Notre siège",
          noWalkIn: "Adresse postale uniquement — aucun bureau pour visite.",
          support: "Support",
          responseTime: "Nous répondons dans les 24 heures",
          hours: "Heures d'Ouverture",
          hoursDetails: "Lundi - Vendredi : 9 h à 18 h HE\nSamedi : 10 h à 16 h HE\nDimanche : Fermé"
        },
        form: {
          title: "Envoyez-Nous un Message",
          name: "Nom complet *",
          email: "Courriel *",
          phone: "Téléphone",
          message: "Message *",
          submit: "Envoyer le Message",
          submitting: "Envoi...",
          success: "Message Envoyé! ✅",
          successDesc: "Merci de nous avoir contactés! Nous vous répondrons dans les 24 heures."
        },
        map: {
          placeholder: "Placeholder de carte"
        },
        consent: "Je consens à ce que mes informations soient collectées et utilisées comme décrit dans la",
        privacyPolicyLink: "Politique de Confidentialité",
        pipedaNote: "Requis en vertu de la LPRPDE — Vos données ne seront utilisées que pour répondre à votre demande"
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
          title: "Centre",
          titleGradient: "d'Intelligence Immobilière",
          subtitle: "Guides, conseils et analyses pour les professionnels de l'immobilier canadiens"
        }
      },
      // First-draft FR copy — product to replace with approved translations.
      // Keep the exact same key shape as en.landing so the parity test
      // stays green and drop-in replacement is trivial.
      landing: {
        hero: {
          badge: "Maintenant en bêta publique · Essai gratuit de 14 jours",
          headline1: "Concluez plus de transactions.",
          headline2: "Sans stress.",
          subtitle: "Realtor Desk répond à chaque client potentiel dès son arrivée — en français ou en anglais, dans votre voix, conforme à la LPRPDE. Vous arrivez à une liste courte, pas à un branle-bas de combat.",
          ctaPrimary: "Essai gratuit de 14 jours",
          ctaSecondary: "Réserver une démo de 15 min",
          trustNoCard: "Sans carte de crédit",
          trustSetup: "Installation en 5 min",
          trustDdf: "Compatible DDF de l'ACI"
        },
        heroProduct: {
          deskLive: "Desk IA · En direct",
          answering: "répond maintenant",
          leadCaptured: "PROSPECT CAPTURÉ",
          hotBadge: "Chaud · 92",
          kListing: "INSCRIPTION",
          kTimeline: "ÉCHÉANCIER",
          kLang: "LANGUE",
          kBudget: "BUDGET COMPATIBLE",
          vLangDetected: "Français (détecté)",
          vBudgetPreApproved: "✓ pré-approuvé",
          vTimelineTomorrow: "Demain, 19 h",
          leadMsg: "Bonsoir — est-ce que le condo sur rue St-Laurent est encore disponible ? Je peux visiter demain soir.",
          aiReply: "Oui, Émilie ! Il est disponible. J'ai un créneau demain à 19 h ou 19 h 30 — lequel vous convient ? Je vous envoie l'adresse par texto.",
          avgResponseLabel: "TEMPS DE RÉPONSE MOYEN"
        },
        trustStrip: {
          label: "Conçu avec · Intégré pour"
        },
        featureGrid: {
          eyebrow: "Pourquoi Realtor Desk",
          heading: "Un coéquipier IA qui parle l'immobilier canadien.",
          intro: "Cinq capacités, une seule console. Sans module, sans bricolage d'intégrations, sans suivis à minuit.",
          meetDeskAi: "Rencontrer Desk IA",
          chatbotTitle: "Agent IA 24/7",
          chatbotDesc: "Répond aux questions MLS, qualifie le budget, réserve les visites dans votre calendrier — dans le ton que vous lui enseignez.",
          bilingualTitle: "Bilingue FR · EN",
          bilingualDesc: "Détecte la langue du prospect dès le premier message. Conforme aux régulateurs provinciaux (OACIQ · RECO · RECA · RECBC) dès le départ.",
          pipedaTitle: "Conforme LPRPDE",
          pipedaDesc: "Données hébergées au Canada. Horodatage du consentement pour chaque prospect. Pieds de page de courriels conformes à la LCAP.",
          pipelineTitle: "Un pipeline qui avance",
          pipelineDesc: "Kanban glisser-déposer, prochaine étape suggérée par l'IA, valeur totale du pipeline — rien ne stagne pendant 14 jours.",
          scoringTitle: "Notation des prospects",
          scoringDesc: "Intention, urgence, budget, échéancier. Un score 0–100 en direct avec le « pourquoi » expliqué simplement.",
          automationsTitle: "Automatisations de courriels",
          automationsDesc: "Modèles de relance écrits pour les marchés canadiens — pré-construction à Toronto, premiers acheteurs à Calgary, relocalisations à Montréal."
        },
        pipelinePreview: {
          eyebrow: "Lecture du matin",
          heading: "Vous arrivez devant un pipeline priorisé. Pas une boîte de réception.",
          body: "Chaque prospect de la nuit est trié. Les prospects chauds remontent en haut avec une transcription horodatée de ce que l'IA a déjà dit — votre premier appel est informé, pas une prise de contact à froid.",
          ctaPrimary: "Essayer le pipeline",
          ctaSecondary: "Visionner la tournée de 2 min",
          colNewLeads: "Nouveaux prospects",
          colContacted: "Contactés",
          colShowingBooked: "Visite réservée",
          tagHot: "Chaud",
          tagWarm: "Tiède"
        },
        compareStrip: {
          eyebrow: "L'alternative à BoldTrail",
          heading: "Des outils pensés pour les États-Unis, adaptés au Canada. Ou nous — où le Canada est le mandat.",
          hCapability: "Capacité",
          hThem: "BoldTrail",
          hUs: "Realtor Desk",
          rowHosting: "Hébergement canadien (LPRPDE)",
          rowBilingual: "Bilingue FR/EN dès le départ",
          rowCasl: "Courriel conforme à la LCAP",
          rowDdf: "Intégration native du SDD® de l'ACI",
          rowCad: "Tarifs en CAD",
          rowTtfr: "Délai jusqu'à la première réponse de l'IA",
          valAddon: "Module additionnel",
          valManual: "Manuel",
          valThirdParty: "Tiers",
          valUsdPremium: "USD, +20 %",
          valDays: "2 à 3 jours",
          valMinutes: "5 minutes",
          valIncluded: "Inclus",
          seeFull: "Voir la comparaison complète"
        },
        testimonial: {
          quote: "Histoire client à venir.",
          author: "",
          role: ""
        },
        closingCta: {
          title: "Commencez votre essai de 14 jours.",
          body: "Sans carte de crédit. Accès complet. Importez un prospect, envoyez une réponse bilingue — puis décidez.",
          cta: "Réservez votre poste"
        }
      },
      compareBoldtrail: {
        seoTitle: "Realtor Desk vs BoldTrail — l'alternative canadienne d'abord",
        seoDesc: "BoldTrail est une excellente plateforme — pour les agents KW à Dallas. Si vous vendez de la pré-construction à Mississauga ou des condos au Plateau, voici comment nous nous comparons.",
        eyebrow: "Realtor Desk vs BoldTrail",
        headline1: "L'une est conçue pour les États-Unis.",
        headline2: "L'autre est conçue pour vous",
        subtitle: "BoldTrail est une excellente plateforme — pour les agents Keller Williams à Dallas. Si vous vendez de la pré-construction à Mississauga ou des condos au Plateau, certaines choses changent.",
        heroCardThemTag: "Le chef de file américain",
        heroCardUsTag: "L'alternative canadienne d'abord",
        statFounded: "Fondée",
        statParent: "Société mère",
        statPricing: "Tarifs",
        statLaunched: "Lancée",
        statHq: "Siège",
        secCanadianFit: "Adéquation canadienne",
        secAiSpeed: "IA et rapidité",
        secCost: "Coût",
        fCanadianHosted: "Données hébergées au Canada (LPRPDE)",
        vThemUsOnly: "✕ États-Unis seulement",
        vUsCanadianCenters: "✓ Centres de données canadiens",
        fBilingual: "Bilingue FR · EN",
        vThemAddonCost: "Module additionnel, $$",
        vUsBuiltIn: "✓ Intégré",
        fCaslFooters: "Pieds de page LCAP automatiques",
        vThemManualTemplate: "Modèle manuel",
        vUsAutomatic: "✓ Automatique",
        fDdfIntegration: "Intégration SDD® de l'ACI",
        vThemThirdParty: "Module tiers",
        vUsNative: "✓ Native",
        fCadPricing: "Tarifs en CAD",
        vThemUsdPremium: "USD + ~20 % de prime",
        vUsPureCad: "✓ CAD seulement",
        fAiResponseTime: "Délai de réponse IA aux prospects",
        vThemMinutes: "2 à 3 min",
        vUsFast: "< 45 s",
        fBilingualAiOob: "IA bilingue dès le départ",
        vNo: "✕",
        vYes: "✓",
        fVoiceAi2026: "IA vocale en 2026",
        vThemUnknown: "Inconnu",
        vUsQ3Beta: "T3 2026, en bêta maintenant",
        fStartingPrice: "Prix de départ",
        vThemPriceSetup: "USD 499 $ d'installation + 99 $/mois",
        vUsPriceNoSetup: "CAD 149 $/mois, sans frais d'installation",
        fAnnualSingle: "Forfait annuel (un agent)",
        vThemAnnual: "USD 1 188 $/an",
        vUsAnnualSave: "CAD 999 $/an — économisez 789 $",
        fPerUserAfter5: "Coût par utilisateur après 5",
        vThemPerUser: "USD 49 $",
        vUsPerUser: "CAD 15 $",
        fOnboardingFee: "Frais d'intégration",
        vThemOnboardingFee: "USD 499 $",
        vUsIncluded: "Inclus",
        closingHeadline: "Prêt à troquer les USD pour un produit qui parle votre marché ?",
        closingBody: "Importez vos prospects BoldTrail en un clic. Essai de 14 jours. Nous égalons le reste de votre contrat annuel.",
        closingCtaPrimary: "Commencez votre transition",
        closingCtaSecondary: "Parler à une équipe canadienne"
      },
      marketingHeader: {
        navFeatures: "Fonctionnalités",
        navHowItWorks: "Fonctionnement",
        navPricing: "Tarifs",
        navCompare: "Comparer",
        navResources: "Ressources",
        navPartners: "Partenaires",
        ctaSignIn: "Se connecter",
        ctaStartFreeTrial: "Essai gratuit",
        langAriaLabel: "Langue",
        openMenu: "Ouvrir le menu",
        closeMenu: "Fermer le menu",
        drawerNavLabel: "Menu de navigation principal",
        drawerTitle: "Navigation Realtor Desk"
      },
      pricingRd: {
        seoTitle: "Tarifs — Realtor Desk",
        seoDesc: "Un seul prix. Toutes les fonctionnalités. Bilingue, conforme LPRPDE, compatible SDD de l'ACI. Tarifs en CAD, essai de 14 jours, sans carte de crédit.",
        eyebrow: "Tarifs en CAD",
        heading1: "Un seul prix.",
        heading2: "Toutes",
        heading3: "les fonctionnalités.",
        subtitle: "Pas de quotas d'IA sur Équipe ou Agence. Pas de forfait « croissance » qui cache les intégrations. Essai de 14 jours, sans carte de crédit.",
        toggleMonthly: "Mensuel",
        toggleAnnual: "Annuel · économisez jusqu'à 789 $/an",
        taxNote: "Prix affichés en CAD. TPS/TVH ajoutée au paiement selon votre province de facturation. Le montant sur cette page correspond à celui affiché sur la page de paiement sécurisée de Stripe.",
        compareHeading: "Comparer chaque fonctionnalité",
        planSoloName: "Solo",
        planSoloTag: "Pour l'agent autonome",
        planSoloDesc: "Tout ce qu'il faut pour cesser de perdre des prospects à 2 h du matin.",
        planSoloSavings: "Économisez 789 $ vs mensuel",
        planTeamName: "Équipe",
        planTeamTag: "Pour 2 à 10 agents",
        planTeamDesc: "Pipeline partagé, distribution round-robin, rapports d'équipe.",
        planTeamSavings: "Économisez 591 $ vs mensuel",
        planBrokerageName: "Agence",
        planBrokerageTag: "Pour 10+ agents",
        planBrokerageDesc: "Multi-locataire, SSO, gestion de compte dédiée, outils CANAFE.",
        featuredTag: "Le plus choisi",
        ctaStart: "Essai gratuit",
        ctaTalkSales: "Parler aux ventes",
        unitMo: "/mois",
        unitYr: "/an",
        billedMonthly: "CAD · facturé mensuellement",
        billedYearly: "CAD · facturé annuellement",
        customLabel: "Sur mesure",
        customAnnualLabel: "Annuel · CAD",
        perMoEffective: "CAD · {{amount}} $/mois effectif",
        featEveryIn: "Tout ce qui est dans {{plan}}, plus —",
        featSoloDesk: "Desk IA, 500 messages/mois",
        featSoloBilingual: "Bilingue FR · EN",
        featSoloDdf1: "Flux SDD® de l'ACI (1 chambre)",
        featSoloScoring: "Notation de prospects + pipeline",
        featSoloCasl: "Relances par courriel conformes LCAP",
        featSoloUser: "1 utilisateur",
        featTeamAiUnl: "Messages IA illimités",
        featTeamDdfUnl: "Flux SDD® de l'ACI (illimité)",
        featTeamRouting: "Distribution round-robin des prospects",
        featTeamReports: "Rapports d'équipe et classement",
        featTeamSeats: "5 utilisateurs, 15 $ par utilisateur supplémentaire",
        featBrokerageSso: "SAML SSO + Azure AD",
        featBrokerageCompliance: "Flux CANAFE et régulateurs provinciaux",
        featBrokerageDdfCustom: "Mappages SDD personnalisés",
        featBrokerageCsm: "Gestion de compte canadienne dédiée",
        featBrokerageSla: "Disponibilité garantie 99,95 %",
        matrixSecAi: "IA et automatisation",
        matrixSecIntegrations: "Intégrations",
        matrixSecCompliance: "Conformité · Canada",
        matrixRowDeskMsgs: "Desk IA (messages/mois)",
        matrixRowBilingual: "Bilingue FR · EN",
        matrixRowVoice: "Entraînement de la voix personnalisée",
        matrixRowScoring: "Notation IA des prospects",
        matrixRowDdfBoards: "Chambres SDD® de l'ACI",
        matrixRowStack: "Stripe / Twilio / Resend",
        matrixRowSso: "SAML SSO",
        matrixRowPipeda: "Hébergement LPRPDE (Canada)",
        matrixRowCasl: "Pied de page courriel LCAP automatique",
        matrixRowFintrac: "Flux CANAFE",
        matrixValUnl: "Illimité",
        matrixValUnlCustom: "Illimité + personnalisé",
        colSolo: "Solo",
        colTeam: "Équipe",
        colBrokerage: "Agence"
      },
      marketingFooter: {
        tagline: "Le CRM conçu pour l'immobilier canadien. Hébergé au Canada, bilingue, conforme LPRPDE.",
        madeInCanada: "Fait au Canada",
        colProduct: "Produit",
        colCompare: "Comparaisons",
        colCanada: "Canada",
        colCompany: "Entreprise",
        itemFeatures: "Fonctionnalités",
        itemPricing: "Tarifs",
        itemHowItWorks: "Fonctionnement",
        itemIntegrations: "Intégrations",
        itemRoadmap: "Feuille de route",
        itemVsBoldtrail: "vs BoldTrail",
        itemVsFub: "vs Follow Up Boss",
        itemVsLofty: "vs Lofty",
        itemVsIxact: "vs IXACT",
        itemVsWiseAgent: "vs Wise Agent",
        itemPipeda: "LPRPDE",
        itemCasl: "LCAP",
        itemFintrac: "CANAFE",
        itemCreaDdf: "SDD de l'ACI",
        itemBlog: "Blogue",
        itemCareers: "Carrières",
        itemContact: "Contact",
        itemPrivacy: "Confidentialité",
        itemTerms: "Conditions",
        itemUnsubscribe: "Se désabonner",
        copyright: "© {{year}} Realtor Desk · Brainfy AI Inc. · Edmonton, AB"
      },
      featuresRd: {
        seoTitle: "Fonctionnalités — Realtor Desk",
        seoDesc: "Desk IA bilingue 24/7, pipeline priorisé, données conformes LPRPDE, automatisations courriel conformes LCAP, synchronisation SDD de l'ACI. L'ensemble de fonctionnalités que les courtiers canadiens utilisent réellement.",
        badge: "Ce que fait Desk",
        heroH1Pre: "Un bureau qui gère la",
        heroH1Italic1: "nuit",
        heroH1Mid: ", pour que vous gériez la",
        heroH1Italic2: "conclusion",
        heroSubtitle: "Desk est votre coéquipier IA bilingue 24/7. Il répond, qualifie, et réserve — puis vous passe la conversation quand ça compte.",
        pillar1Cat: "L'IA qui conclut",
        pillar1Title: "Moteur de réponse bilingue 24/7",
        pillar1Body: "Desk détecte la langue dès le premier mot et répond en français ou en anglais — instantanément, jour et nuit. Répond aux questions MLS, qualifie le budget et réserve les visites directement dans votre calendrier.",
        pillar1Tag1: "Détection FR ↔ EN automatique",
        pillar1Tag2: "38 s de réponse moyenne",
        pillar1Tag3: "Réservation dans Google/Outlook",
        pillar2Cat: "Intelligence des prospects",
        pillar2Title: "Un pipeline priorisé, pas une boîte de réception",
        pillar2Body: "Chaque prospect de la nuit est trié. L'intention, l'urgence, la compatibilité budgétaire et l'échéancier notés sur une ligne — pour que votre premier appel du matin soit informé, pas à froid.",
        pillar2Tag1: "Notation intention + urgence",
        pillar2Tag2: "File d'action suivante",
        pillar2Tag3: "CRM depuis 2020",
        pillar3Cat: "Conçu pour le Canada",
        pillar3Title: "Conforme LPRPDE. Conforme LCAP. Prêt pour chaque province.",
        pillar3Body: "Les données canadiennes restent dans des centres de données canadiens. Le consentement est capturé dès le premier contact, enregistré et révocable. Divulgations du Québec et vérifications CANAFE suivies par transaction.",
        pillar3Tag1: "AWS ca-central-1",
        pillar3Tag2: "Registre de consentement LPRPDE",
        pillar3Tag3: "Divulgations bilingues du Québec",
        capsEyebrow: "Tout le reste",
        capsHeading1: "La plomberie,",
        capsHeadingItalic: "bien faite",
        capsIntro: "Ce que la plupart des SaaS immobiliers oublient. Nous non. Chacune de ces fonctionnalités est la norme, pas un module premium.",
        capDdfTitle: "Synchronisation SDD de l'ACI",
        capDdfBody: "Inscriptions MLS en direct, actualisation aux 15 minutes, tirées directement de votre chambre.",
        capChatTitle: "Widget de clavardage Web",
        capChatBody: "Script prêt à déployer. S'harmonise aux couleurs de votre agence. Transfère le surplus à Desk.",
        capEmailTitle: "Séquences courriel (LCAP)",
        capEmailBody: "Campagnes de relance avec gestion du consentement. Pause automatique au désabonnement.",
        capCalendarTitle: "Calendrier de visites",
        capCalendarBody: "Desk réserve les plages selon vos vraies disponibilités, dans le fuseau horaire de l'acheteur.",
        capRoutingTitle: "Distribution d'équipe",
        capRoutingBody: "Round-robin par géographie, langue ou type d'inscription — ce qui convient à votre équipe.",
        capRolesTitle: "Rôles et permissions",
        capRolesBody: "Chef d'équipe, courtier, assistant, administrateur d'agence. Accès granulaire par prospect.",
        capAuditTitle: "Journal d'activité et d'audit",
        capAuditBody: "Chaque action IA, chaque contact du courtier. Immuable. Exportable pour la conformité.",
        capReportingTitle: "Rapports",
        capReportingBody: "Temps de réponse, ROI par source, conversion par étape, classement des courtiers. En CAD partout.",
        ctaH1Pre: "Gratuit pendant 14 jours.",
        ctaH1Italic: "Sans carte.",
        ctaBody: "Connectez votre flux SDD, répondez à quelques questions sur votre agence, et Desk répond aux prospects en 15 minutes.",
        ctaPrimary: "Essai gratuit",
        ctaSecondary: "Réserver une démo"
      },
      pageSeo: {
        howItWorksTitle: "Fonctionnement de Realtor Desk | Installation en 20 minutes",
        howItWorksDesc: "Commencez avec Realtor Desk en environ 20 minutes. Configuration CRM simple, outils IA pour courtiers, configuration de génération de prospects, et intégration de visites virtuelles.",
        resourcesTitle: "Ressources | Guides pour courtiers immobiliers canadiens",
        resourcesDesc: "Guides d'experts sur les outils IA, la génération de prospects, la conformité et le marketing pour les courtiers immobiliers canadiens qui utilisent Realtor Desk.",
        loginTitle: "Se connecter — Realtor Desk",
        loginDesc: "Connectez-vous à votre espace de travail Realtor Desk. Hébergé au Canada, conforme LPRPDE, bilingue FR/EN.",
        signupTitle: "Commencez votre essai gratuit de 14 jours — Realtor Desk",
        signupDesc: "Commencez votre essai gratuit de 14 jours de Realtor Desk. Réponse IA aux prospects, agent 24/7, compatible SDD de l'ACI, tarifs en CAD. Sans carte de crédit.",
        integrationsTitle: "Intégrations — Realtor Desk",
        integrationsDesc: "Intégrez Realtor Desk via Zapier, Make et n8n (5 000+ applications). Connecteurs natifs sur la feuille de route. SDD de l'ACI prévu pour le T3 2026.",
        roadmapTitle: "Feuille de route du produit — Realtor Desk",
        roadmapDesc: "Découvrez ce qui arrive. IA vocale, SDD de l'ACI, synchronisation Centris et plus encore sur la feuille de route Realtor Desk 2026.",
        contactTitle: "Contact — Realtor Desk",
        contactDesc: "Contactez l'équipe Realtor Desk. Soutien canadien, bilingue FR/EN, réponse moyenne en moins de 24 heures.",
        faqTitle: "Foire aux questions — Realtor Desk",
        faqDesc: "Réponses aux questions fréquentes sur Realtor Desk : tarifs en CAD, conformité LPRPDE/LCAP, SDD de l'ACI, soutien bilingue, annulation.",
        unsubscribeTitle: "Se désabonner — Realtor Desk",
        unsubscribeDesc: "Gérez vos préférences de courriel Realtor Desk ou désabonnez-vous. Retrait en un clic conforme à la LCAP.",
        careersTitle: "Carrières — Realtor Desk",
        careersDesc: "Bâtissez l'avenir de l'immobilier canadien avec Realtor Desk. Postes à distance en ingénierie, succès client et croissance.",
        privacyTitle: "Politique de confidentialité — Realtor Desk",
        privacyDesc: "Politique de confidentialité de Realtor Desk. Données hébergées au Canada, conforme LPRPDE, suivi du consentement explicite, révocable à tout moment.",
        termsTitle: "Conditions d'utilisation — Realtor Desk",
        termsDesc: "Conditions d'utilisation de Realtor Desk : facturation, annulation, utilisation acceptable et juridiction canadienne.",
        partnersTitle: "Programme partenaires — Realtor Desk",
        partnersDesc: "Gagnez des commissions récurrentes en référant des équipes immobilières canadiennes à Realtor Desk. Taux de départ de 25 %, paliers jusqu'à 40 %, attribution 90 jours (dernier clic), versements mensuels en CAD.",
        partnersApplyTitle: "Postuler au programme partenaires — Realtor Desk",
        partnersApplyDesc: "Postulez pour devenir partenaire Realtor Desk. Nous examinons chaque demande sous 5 jours ouvrables.",
        partnersTermsTitle: "Conditions du programme partenaires — Realtor Desk",
        partnersTermsDesc: "Conditions du programme partenaires Realtor Desk : structure de commission, attribution, reprise, trafic interdit, résiliation, droit applicable."
      },
      partnersPage: {
        heroEyebrow: "Programme partenaires",
        heroHeadline1: "Gagnez des commissions récurrentes pour chaque courtier canadien que vous référez.",
        heroHeadlineItalic: "chaque",
        heroSubtitle: "Référez des coachs, agences et chefs d'équipe à Realtor Desk. Nous versons 25 % récurrents au départ, avec des paliers jusqu'à 40 % à l'échelle. Canadien d'abord, versements en CAD, attribution 90 jours (dernier clic).",
        heroCtaPrimary: "Postuler pour devenir partenaire",
        heroCtaSecondary: "Lire les conditions du programme",
        heroTrustAttribution: "Dernier clic, 90 jours",
        heroTrustPayout: "Versements mensuels en CAD",
        heroTrustReview: "Candidatures examinées sous 5 jours ouvrables",
        commissionsEyebrow: "Comment vous gagnez",
        commissionsHeading: "Taux de départ : 25 %. Les paliers montent avec vos référrals actifs.",
        commissionsBody: "Chaque client payant que vous référez compte dans votre palier. Le taux de commission est figé au moment où chaque facture est payée — les promotions ultérieures ne modifient pas rétroactivement les commissions antérieures.",
        tierStarterName: "Débutant",
        tierStarterRate: "25 %",
        tierStarterRule: "0 à 10 référrals actifs",
        tierStarterBody: "Commission récurrente sur chaque facture payée, pendant les 12 premiers mois de l'abonnement de chaque client.",
        tierGrowthName: "Croissance",
        tierGrowthRate: "30 %",
        tierGrowthRule: "11 à 25 référrals actifs",
        tierGrowthBody: "Le taux grimpe automatiquement dès que 11 de vos référrals paient activement.",
        tierEliteName: "Élite",
        tierEliteRate: "40 %",
        tierEliteRule: "26+ référrals actifs",
        tierEliteBody: "Le palier supérieur. Réservé aux partenaires qui apportent un volume canadien qualifié et constant.",
        tierAmbassadorName: "Ambassadeur",
        tierAmbassadorRate: "20 %",
        tierAmbassadorRule: "Sur invitation seulement",
        tierAmbassadorBody: "Coachs, éducateurs et ambassadeurs partenaires qui reçoivent un soutien co-marketing à un taux fixe.",
        howItWorksEyebrow: "Comment ça fonctionne",
        howItWorksHeading: "Trois étapes, aucun contrat à signer pour commencer.",
        step1Number: "01",
        step1Title: "Postulez",
        step1Body: "Remplissez la candidature partenaire. Nous examinons chaque soumission sous 5 jours ouvrables et approuvons les partenaires dont l'audience correspond au marché immobilier canadien.",
        step2Number: "02",
        step2Title: "Partagez votre lien",
        step2Body: "Une fois approuvé·e, vous recevez un lien de référence et un jeu de ressources marketing co-signées. Publiez-le sur votre site, votre infolettre, votre chaîne YouTube — l'attribution dernier clic fonctionne sur tous les canaux.",
        step3Number: "03",
        step3Title: "Soyez payé·e",
        step3Body: "Chaque facture payée déclenche un enregistrement de commission sur votre tableau de bord. Nous versons mensuellement dès que vous dépassez 50 $ CA. Virement Interac pour les partenaires canadiens ; Wise ou PayPal à l'international.",
        whoEyebrow: "À qui c'est destiné",
        whoHeading: "La plupart des partenaires correspondent à l'un de quatre profils.",
        whoCreatorTitle: "Coachs immobiliers et créateurs de contenu",
        whoCreatorBody: "Éducateurs YouTube, voix LinkedIn, auteurs d'infolettres. Les courtiers canadiens font confiance aux voix qui leur ressemblent — pas aux canaux publicitaires américains.",
        whoBrokerageTitle: "Dirigeants d'agence et bâtisseurs d'équipe",
        whoBrokerageBody: "Si vous dirigez une équipe de 10+ courtiers, référer votre agence vous donne le taux Élite sur chaque siège.",
        whoConsultantTitle: "Consultants PropTech et intégrateurs",
        whoConsultantBody: "Vous vendez déjà la configuration CRM, des audits d'automatisation ou des migrations de pile techno. Ajoutez Realtor Desk comme la recommandation canadienne d'abord.",
        whoAgencyTitle: "Agences de marketing au service des courtiers",
        whoAgencyBody: "Compatible marque blanche. Nous formerons votre équipe sur le produit pour que vous intégriez vos clients sans nous escalader chaque fois.",
        faqEyebrow: "FAQ",
        faqHeading: "Les détails que les partenaires posent toujours.",
        faqAttributionQ: "Comment fonctionne l'attribution ?",
        faqAttributionA: "Dernier clic, cookie de 90 jours. Si un prospect clique sur votre lien et s'inscrit dans les 90 jours, vous recevez la commission — même s'il a cliqué sur un autre lien partenaire plus tard, c'est le plus récent qui l'emporte. Effacer les cookies réinitialise la fenêtre.",
        faqClawbackQ: "Que se passe-t-il si un client est remboursé ?",
        faqClawbackA: "Nous reprenons les commissions sur les remboursements dans une fenêtre de 60 jours. Si la commission n'a pas encore été versée, nous l'annulons. Si elle a déjà été versée, nous déduisons l'équivalent de votre prochain versement — jamais de prélèvement sur l'argent déjà entré dans votre compte.",
        faqPayoutQ: "Quand suis-je payé·e ?",
        faqPayoutA: "Mensuellement, le 15, pour toutes les commissions ayant passé la fenêtre de reprise de 60 jours au cours du mois précédent. Versement minimum : 50 $ CA ; les soldes inférieurs sont reportés.",
        faqCurrencyQ: "Quelle devise ?",
        faqCurrencyA: "Les versements sont en CAD par défaut. Les partenaires internationaux peuvent choisir USD dans leurs paramètres. Les commissions sont toujours enregistrées dans la devise d'origine de la facture plus un instantané équivalent en CAD pour que les totaux du tableau de bord ne dérivent pas avec les taux de change.",
        faqDisallowedQ: "Quel trafic est interdit ?",
        faqDisallowedA: "Pas d'auto-référence, pas de trafic incité (sites de récompenses / fidélité), pas d'enchères sur les mots-clés de marque Realtor Desk, pas d'avis trompeurs. Règles complètes dans les conditions du programme.",
        faqStatusQ: "Le programme est-il actif en ce moment ?",
        faqStatusA: "Le programme est ouvert aux candidatures. Le tableau de bord partenaire en libre-service sera livré après la migration de notre plateforme — d'ici là, nous traitons les approbations et envoyons les rapports de versement manuellement chaque mois. Vous ne raterez aucune commission ; l'attribution est suivie dès le premier jour.",
        ctaFinalHeading: "Prêt·e à commencer à gagner ?",
        ctaFinalBody: "Les candidatures prennent environ 5 minutes. Nous répondons sous 5 jours ouvrables.",
        ctaFinalPrimary: "Postuler pour devenir partenaire",
        ctaFinalSecondary: "Lire les conditions du programme"
      },
      partnersApply: {
        pageHeading: "Postuler au programme partenaires Realtor Desk",
        pageSubtitle: "Dites-nous qui vous êtes, comment vous promouverez Realtor Desk et qui compose votre audience. Nous examinons chaque candidature sous 5 jours ouvrables.",
        sectionAbout: "À propos de vous",
        sectionAudience: "Votre audience",
        sectionConsent: "Consentement",
        fieldFullName: "Nom complet *",
        fieldFullNamePh: "Prénom et nom",
        fieldEmail: "Courriel *",
        fieldEmailPh: "Nous l'utiliserons pour vous joindre",
        fieldCompany: "Entreprise ou marque (facultatif)",
        fieldCompanyPh: "Votre agence, votre agence immobilière ou votre marque personnelle",
        fieldCountry: "Pays *",
        fieldCountryPh: "ex. Canada",
        fieldWebsite: "Site Web principal ou URL de média social *",
        fieldWebsitePh: "LinkedIn, YouTube, Substack, site personnel — là où vit votre audience",
        fieldAudienceSize: "Taille de l'audience",
        fieldAudienceSizePh: "Choisissez une tranche",
        audienceTier1: "Moins de 1 000",
        audienceTier2: "1 000 à 10 000",
        audienceTier3: "10 000 à 50 000",
        audienceTier4: "50 000 à 250 000",
        audienceTier5: "250 000+",
        fieldPromoteHow: "Comment promouvrez-vous Realtor Desk ? *",
        fieldPromoteHowPh: "Infolettre, chaîne YouTube, liste d'envoi d'agence, mandats de consultation — soyez précis·e. (150 mots max.)",
        fieldAudienceWhy: "Pourquoi Realtor Desk convient-il à votre audience ? *",
        fieldAudienceWhyPh: "Quels sont leurs irritants que Realtor Desk résout ? (150 mots max.)",
        fieldPipedaConsent: "Je consens à ce que Brainfy AI Inc. conserve mes données de candidature conformément à la LPRPDE pour l'examen du programme partenaires. *",
        fieldPipedaConsentHelp: "Nous les utilisons uniquement pour examiner votre candidature. Vous pouvez demander leur suppression à tout moment à partners@realtordesk.ai.",
        fieldTermsConsent: "J'ai lu et j'accepte les conditions du programme partenaires. *",
        submitBtn: "Soumettre la candidature",
        submittingBtn: "Soumission…",
        successHeading: "Candidature reçue",
        successBody: "Merci pour votre candidature. Nous examinons chaque soumission sous 5 jours ouvrables et vous répondrons par courriel à l'adresse ci-dessus dans tous les cas.",
        successCta: "Retour au programme partenaires",
        errorHeading: "Impossible de soumettre votre candidature",
        errorBody: "Veuillez réessayer dans un instant. Si le problème persiste, écrivez directement à partners@realtordesk.ai.",
        errFullNameReq: "Le nom complet est obligatoire",
        errEmail: "Veuillez saisir une adresse courriel valide",
        errCountryReq: "Le pays est obligatoire",
        errWebsiteReq: "Partagez au moins une URL publique pour que nous puissions examiner votre audience",
        errWebsiteInvalid: "Ce ne semble pas être une URL valide",
        errPromoteMin: "Dites-nous un peu comment vous promouverez Realtor Desk",
        errPromoteMax: "Veuillez limiter cette réponse à 150 mots ou moins",
        errAudienceMin: "Dites-nous un peu pourquoi Realtor Desk convient à votre audience",
        errAudienceMax: "Veuillez limiter cette réponse à 150 mots ou moins",
        errPipedaConsent: "Nous ne pouvons traiter votre candidature sans consentement LPRPDE",
        errTermsConsent: "Veuillez lire et accepter les conditions du programme partenaires"
      },
      partnersTerms: {
        pageHeading: "Conditions du programme partenaires Realtor Desk",
        effective: "Entrée en vigueur le {{date}} · susceptibles de modification · contactez partners@realtordesk.ai pour la version actuelle",
        draftNotice: "Ces conditions constituent l'accord de programme de base. Elles ne remplacent pas les contrats négociés séparément avec des partenaires nommés.",
        sect1Title: "1. Qui peut adhérer",
        sect1Body: "Le programme partenaires est ouvert aux personnes et entreprises qui peuvent légalement promouvoir Realtor Desk dans leur juridiction et dont l'audience ou la clientèle s'aligne avec les professionnels canadiens de l'immobilier. Les candidatures sont examinées sous 5 jours ouvrables. Nous nous réservons le droit d'accepter, de rejeter ou de suspendre tout candidat à notre seule discrétion.",
        sect2Title: "2. Structure de commission",
        sect2Body: "Les partenaires standard gagnent 25 % de commission récurrente sur chaque facture payée de clients référés, passant à 30 % à 11 référrals actifs et 40 % à 26 référrals actifs. Les partenaires de la voie ambassadeur gagnent 20 % fixe selon des conditions convenues séparément. Le taux de commission est figé au moment où chaque facture est payée ; les changements de palier ultérieurs ne modifient pas rétroactivement les commissions antérieures.",
        sect3Title: "3. Attribution",
        sect3Body: "L'attribution est en dernier clic avec une fenêtre cookie de 90 jours. Lorsqu'un prospect clique sur votre lien de référence, un cookie enregistre l'attribution. Le plus récent référrer partenaire dans cette fenêtre de 90 jours reçoit le crédit lorsque le prospect s'abonne. Effacer les cookies du navigateur met fin à la fenêtre d'attribution.",
        sect4Title: "4. Versements",
        sect4Body: "Les commissions sont approuvées après expiration de la fenêtre de reprise de 60 jours et versées mensuellement le 15 pour toutes les commissions ayant passé cette fenêtre le mois précédent. Versement minimum : 50 $ CA ; les soldes inférieurs sont reportés. Les partenaires canadiens sont payés par virement Interac ; les partenaires internationaux par Wise ou PayPal. Les partenaires sont responsables de leur propre déclaration fiscale ; nous émettons des feuillets T4A aux partenaires canadiens qui dépassent le seuil de déclaration de l'ARC dans une année civile.",
        sect5Title: "5. Reprises",
        sect5Body: "Si un client référé est remboursé, conteste sa facture ou est détecté comme frauduleux dans les 60 jours suivant sa facture payée, la commission associée est annulée. Si la commission n'a pas encore été versée, elle est annulée. Si elle a déjà été versée, l'équivalent est déduit de votre prochain versement. Nous ne débitons jamais rétroactivement des fonds déjà entrés dans votre compte.",
        sect6Title: "6. Conduite interdite",
        sect6Body: "Sont interdits : l'auto-référence, le trafic incité (sites de récompenses/fidélité sauf approbation séparée), les enchères sur les mots-clés de marque Realtor Desk en recherche payante, les avis trompeurs, les violations de marque, l'usurpation d'identité du personnel Realtor Desk, le pourriel au sens de la LCAP et la promotion de Realtor Desk par des canaux violant la LPRPDE. Les infractions mettent fin à la participation et font perdre toute commission impayée.",
        sect7Title: "7. Ressources marketing",
        sect7Body: "Les partenaires approuvés peuvent utiliser la marque verbale Realtor Desk et les ressources marketing officielles uniquement pour promouvoir Realtor Desk. Vous ne pouvez pas modifier la marque verbale, créer des logos dérivés, ni laisser entendre une affiliation au-delà de votre statut de partenaire indépendant. Realtor Desk n'est pas affilié à l'Association canadienne de l'immeuble (ACI) ni approuvé par celle-ci ; REALTOR® est une marque déposée de l'ACI.",
        sect8Title: "8. Résiliation",
        sect8Body: "Chaque partie peut mettre fin à la participation à tout moment sur préavis écrit à partners@realtordesk.ai. À la résiliation, les commissions approuvées mais non versées sont payées lors du prochain cycle régulier de versement. Les commissions en attente dans la fenêtre de reprise de 60 jours peuvent encore être reprises si la transaction sous-jacente est remboursée.",
        sect9Title: "9. Données et confidentialité",
        sect9Body: "Les données de candidature et les données de compte partenaire sont conservées par Brainfy AI Inc. dans des centres de données canadiens sous LPRPDE. Les données des candidats québécois sont traitées conformément à la Loi 25 du Québec. Vous pouvez demander l'accès, la correction ou la suppression de vos données en écrivant à partners@realtordesk.ai.",
        sect10Title: "10. Limitation de responsabilité",
        sect10Body: "La responsabilité globale de Realtor Desk dans le cadre de ce programme est limitée aux commissions gagnées dans les 12 mois précédents. Nous fournissons le programme et les ressources marketing « tels quels » et ne garantissons aucun taux de conversion, disponibilité ou revenu.",
        sect11Title: "11. Droit applicable",
        sect11Body: "Cet accord est régi par les lois de l'Alberta, Canada. Les différends seront résolus devant les tribunaux de l'Alberta, sauf si les deux parties conviennent par écrit d'un arbitrage.",
        sect12Title: "12. Modifications",
        sect12Body: "Nous pouvons mettre à jour ces conditions avec un préavis de 30 jours par courriel aux partenaires enregistrés et en mettant à jour cette page. La participation continue après la période de préavis constitue une acceptation.",
        contactHeading: "Des questions ?",
        contactBody: "Écrivez à partners@realtordesk.ai. Nous répondons sous 2 jours ouvrables."
      },
      careersPage: {
        heroH1Pre: "Bâtissez l'avenir de",
        heroH1Gradient: "l'immobilier canadien",
        heroH1Post: "avec nous",
        heroSubtitle: "Realtor Desk aide les courtiers à conclure plus de transactions avec moins de travail manuel. Joignez-vous à une petite équipe responsabilisée qui livre des produits d'IA conçus pour le marché canadien.",
        valueRemoteTitle: "À distance d'abord",
        valueRemoteBody: "Travaillez de n'importe où au Canada ou en Amérique du Nord avec une collaboration asynchrone.",
        valueActionTitle: "Biais d'action",
        valueActionBody: "Possédez les résultats, avancez vite et prenez des décisions pragmatiques avec de l'information imparfaite.",
        valueCanadaTitle: "Centré sur le Canada",
        valueCanadaBody: "Résolvez de vrais flux de travail pour les courtiers canadiens avec la conformité locale et le contexte du marché.",
        valueImpactTitle: "Impact réel",
        valueImpactBody: "Votre travail est livré rapidement et influence directement la rétention, les revenus et le succès client.",
        prioritySectionTitle: "On embauche maintenant — postes prioritaires",
        prioritySectionBody: "Ces 4 postes sont des embauches critiques qui débloquent directement la vélocité produit, la rétention et la croissance.",
        priorityBadge: "Embauche en cours",
        priorityApplyCta: "Postuler maintenant",
        priorityOptionalFifth: "5e embauche optionnelle :",
        priorityOptionalBody: "Si le fondateur est tiraillé sur les décisions produit, un·e gestionnaire de produit à temps partiel (PM fondateur·rice) qui peut piloter l'exécution de la feuille de route et la coordination interfonctionnelle serait un ajout à fort levier.",
        allRolesTitle: "Tous les postes",
        catEngineering: "Produit et ingénierie",
        catCustomerGrowth: "Client et croissance",
        catOperations: "Opérations et stratégie",
        accordionResponsibilities: "Responsabilités",
        accordionQualifications: "Qualifications",
        applicationSectionTitle: "Formulaire de candidature",
        applicationSectionBody: "Soumettez une seule candidature pour n'importe quel poste. Les champs spécifiques au poste apparaissent automatiquement selon votre sélection.",
        sectionCoreInfo: "Informations de base",
        sectionProfessionalBackground: "Parcours professionnel",
        sectionRoleSpecific: "Liens spécifiques au poste (facultatif)",
        sectionFitQuestions: "Questions de compatibilité (obligatoires, 150 mots max chacune)",
        sectionFinalDetails: "Derniers détails",
        fieldFullName: "Nom complet *",
        fieldFullNamePh: "Votre nom complet tel qu'il apparaît professionnellement",
        fieldEmail: "Adresse courriel *",
        fieldEmailPh: "Nous l'utiliserons pour vous joindre",
        fieldPhone: "Numéro de téléphone *",
        fieldPhonePh: "Avec indicatif régional (Canada/É.-U. préféré)",
        fieldLocation: "Emplacement (ville, province) *",
        fieldLocationPh: "ex. : Montréal, QC",
        fieldRole: "Poste visé *",
        fieldRolePh: "Sélectionnez le poste qui correspond le mieux à votre parcours",
        fieldAvailability: "Disponibilité pour commencer *",
        fieldAvailabilityPh: "Sélectionnez une option",
        availImmediately: "Immédiatement",
        avail2Weeks: "2 semaines",
        avail1Month: "1 mois",
        avail2PlusMonths: "2+ mois",
        fieldWorkAuth: "Autorisation de travail *",
        fieldWorkAuthPh: "Sélectionnez une option",
        authCitizen: "Citoyen·ne canadien·ne",
        authPR: "Résident·e permanent·e",
        authWorkPermit: "Permis de travail valide",
        authUsBased: "Basé·e aux États-Unis (ouvert à considération)",
        fieldResume: "Téléversement du CV *",
        fieldResumeHelp: "Max 5 Mo. PDF préféré.",
        fieldLinkedIn: "URL de profil LinkedIn *",
        fieldLinkedInPh: "Votre profil LinkedIn à jour",
        fieldExperience: "Années d'expérience pertinente *",
        fieldExperiencePh: "Sélectionnez une tranche d'expérience",
        expUnder1: "Moins d'un an",
        exp1to2: "1 à 2 ans",
        exp3to5: "3 à 5 ans",
        exp5to10: "5 à 10 ans",
        exp10plus: "Plus de 10 ans",
        fieldGithub: "URL de profil GitHub",
        fieldGithubPh: "Lien vers votre GitHub ou GitLab",
        fieldPortfolio: "Portfolio / site personnel",
        fieldPortfolioPh: "Site personnel, portfolio ou échantillons de travail",
        fieldWriting: "URL d'échantillons de rédaction",
        fieldWritingPh: "Articles publiés, billets ou portfolio",
        fieldCrmTools: "Outils CRM / ventes utilisés",
        fieldCrmToolsPh: "ex. : HubSpot, Salesforce, Follow Up Boss",
        fieldWhyNow: "Pourquoi Realtor Desk — et pourquoi maintenant ?",
        fieldWhyNowPh: "Dites-nous ce qui vous a attiré vers ce poste et pourquoi une jeune pousse SaaS immobilière canadienne vous motive maintenant.",
        fieldLimitedGuidance: "Parlez-nous d'une fois où vous avez dû vous débrouiller avec peu d'encadrement ou de ressources.",
        fieldLimitedGuidancePh: "Décrivez la situation, ce que vous avez fait et ce qui en est ressorti.",
        fieldCanadaView: "Que savez-vous du marché immobilier canadien, et quelle est selon vous la plus grande difficulté des courtiers ?",
        fieldCanadaViewPh: "Partagez votre perspective sur les dynamiques du marché canadien et les irritants des courtiers.",
        fieldReferredBy: "Référé·e par",
        fieldReferredByPh: "Avez-vous été référé·e par quelqu'un de notre réseau ?",
        fieldAdditional: "Autre chose que vous aimeriez nous partager ?",
        fieldAdditionalPh: "Ajoutez du contexte que votre CV ne capture pas — projets personnels, parcours non linéaire, motivations, etc.",
        fieldPipedaConsent: "Je consens à ce que mes données de candidature soient conservées conformément à la LPRPDE. *",
        fieldPipedaConsentHelp: "Nous conservons vos informations de candidature de façon sécurisée et les utilisons uniquement à des fins de recrutement.",
        submitBtn: "Soumettre ma candidature",
        submittingBtn: "Soumission en cours…",
        dontSeeRoleTitle: "Vous ne voyez pas votre poste ?",
        dontSeeRoleBody: "Envoyez-nous un court mot pour nous dire comment vous pouvez nous aider à bâtir Realtor Desk.",
        errFullNameReq: "Le nom complet est obligatoire",
        errFullNameMax: "Le nom est trop long",
        errEmail: "Veuillez saisir une adresse courriel valide",
        errPhone: "Veuillez saisir un numéro de téléphone valide",
        errLocationReq: "L'emplacement est obligatoire",
        errLocationMax: "L'emplacement est trop long",
        errRoleReq: "Veuillez sélectionner un poste",
        errAvailabilityReq: "Veuillez sélectionner votre disponibilité",
        errWorkAuthReq: "Veuillez sélectionner votre autorisation de travail",
        errResumeReq: "Le CV est obligatoire",
        errResumeSize: "La taille maximale du fichier est de 5 Mo",
        errResumeType: "Veuillez téléverser un fichier PDF ou DOCX",
        errLinkedInReq: "Veuillez saisir une URL LinkedIn valide",
        errExperienceReq: "Veuillez sélectionner un niveau d'expérience",
        errUrlInvalid: "Veuillez saisir une URL valide",
        errCrmMax: "Veuillez limiter à moins de 250 caractères",
        errAnswerMin: "Veuillez fournir au moins une courte réponse",
        errAnswerWords: "Veuillez limiter cette réponse à 150 mots ou moins",
        errReferredByMax: "Veuillez limiter à moins de 120 caractères",
        errAdditionalMax: "Veuillez limiter à moins de 2000 caractères",
        errConsentReq: "Le consentement est requis pour soumettre votre candidature"
      },
      resourcesDisclosure: {
        frOnlyBody: "Certains guides ne sont disponibles qu'en anglais pour le moment, le temps qu'on les traduise. {{hidden}} autres articles sont accessibles dans le catalogue anglais.",
        viewEnCta: "Voir le catalogue anglais complet"
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
        badge: "Le Goulot d'Étranglement",
        title: "Fatigué de la gestion",
        titleHighlight: "lente et coûteuse des prospects?",
        subtitle: "Arrêtez de dépendre d'outils fragmentés et de suivis manuels. 48% des prospects sont perdus à cause des temps de réponse lents.",
        leadsLost: "de prospects perdus",
        toolsUsed: "outils utilisés quotidiennement",
        monthlyWaste: "gaspillés chaque mois",
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
        badge: "La Solution",
        title: "Outils Propulsés par l'IA",
        titleHighlight: "Conçus pour les Courtiers Canadiens",
        subtitle: "Automatisation 24/7 qui parle anglais et français, avec conformité LPRPDE et intégration CREA DDF® bientôt disponible.",
        chatbot: {
          title: "Chatbot IA 24/7",
          description: "Capturez et qualifiez des prospects en continu avec un chatbot IA bilingue qui répond aux questions, réserve des visites et ne rate jamais un prospect.",
          benefit1: "Répond aux prospects en moins de 2 minutes",
          benefit2: "Conversations bilingues anglais et français",
          benefit3: "Qualifie et évalue automatiquement les prospects",
          feature1: "Répond aux questions sur les propriétés instantanément",
          feature2: "Qualifie les acheteurs/vendeurs automatiquement",
          feature3: "Capture les coordonnées et préférences",
          feature4: "Bilingue (Anglais/Français)",
          feature5: "Fonctionne sur votre site Web et réseaux sociaux"
        },
        voice: {
          title: "Moteur de Suivi Intelligent",
          description: "Ne manquez plus aucun rappel. L'IA priorise votre liste d'appels quotidiens selon les scores, les signaux d'engagement et les moments optimaux.",
          benefit1: "Listes d'appels quotidiens priorisées par l'IA",
          benefit2: "Rappels de suivi automatisés",
          benefit3: "Résumés d'appels générés par l'IA",
          feature1: "Prend les appels quand vous êtes occupé",
          feature2: "Planifie les visites automatiquement",
          feature3: "Voix canadienne au son naturel",
          feature4: "Achemine les prospects chauds vers votre téléphone",
          feature5: "Enregistre et transcrit chaque appel"
        },
        email: {
          title: "Campagnes Courriel Automatisées",
          description: "Entretenez les prospects en pilote automatique avec des campagnes personnalisées, des alertes de propriétés et des mises à jour du marché — le tout conforme à la LCAP.",
          benefit1: "Modèles de campagnes goutte-à-goutte prêts à l'emploi",
          benefit2: "Courriels d'alertes de propriétés personnalisés",
          benefit3: "Conforme à la LCAP avec désinscription en un clic",
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
        feature5: "Analyses de performance et suivi du ROI",
        loadFailed: "Échec du chargement du profil"
      },
      ai: {
        title: "Assistant IA immobilier",
        subtitle: "Votre assistant CRM immobilier intelligent",
        clearChat: "Effacer la conversation",
        quickActions: "Actions rapides",
        welcomeTitle: "Bienvenue sur l'assistant IA Immobilier",
        welcomeDesc: "Je peux vous aider à gérer vos contacts, analyser vos transactions, créer des tâches et fournir des perspectives immobilières. Essayez une des actions rapides ci-dessus!",
        placeholder: "Posez-moi une question sur votre CRM, contacts, transactions...",
        actions: {
          analyzePipeline: "Analyser mon pipeline",
          draftEmail: "Rédiger un courriel de suivi",
          createTask: "Créer une tâche",
          marketResearch: "Recherche de marché"
        }
      },
      canadian: {
        title: "Conçu pour le Marché Canadien",
        bilingual: "Support bilingue (EN/FR)",
        mls: "S'intègre avec les Systèmes MLS Canadiens",
        compliant: "Conforme PIPEDA et LCAP",
        timezones: "Couvre les 6 Fuseaux Horaires Canadiens",
        crea: "Aligné avec le Code d'Éthique CREA",
        pricing: "Tarification en CAD"
      },
      faq: {
        title: "Questions",
        titleGradient: "Fréquentes",
        subtitle: "Trouvez des réponses aux questions courantes sur Realtor Desk AI",
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
          answer: "Absolument. Nous utilisons un chiffrement de niveau bancaire (AES-256), hébergeons les données sur une infrastructure optimisée pour le Canada, et sommes conçus selon les principes de la LPRPDE — y compris le droit à l'effacement et les protocoles de notification de violation."
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
          answer: "RealtorDesk AI est conçu autour des principes de la LPRPDE et des meilleures pratiques de sécurité. Nous sommes honnêtes : nous n'avons pas encore de certification SOC 2 formelle ni de badge CREA DDF® — ces étapes sont prévues à mesure que nous sortons de la bêta. Ce qui est actif aujourd'hui : chiffrement, suivi du consentement et exportation des données. Nous publierons les certifications dès qu'elles seront obtenues."
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
          answer: "Aujourd'hui : Zapier, Make et n8n natifs — qui couvrent plus de 5 000 applications dont Follow Up Boss, Brivity, HubSpot et Salesforce via Zapier. Les connecteurs directs Salesforce, Zoho CRM, Pipedrive, Freshsales et Microsoft Dynamics sont prévus. Vous pouvez aussi importer en masse depuis n'importe quel CRM par CSV."
        },
        q12: {
          question: "Puis-je personnaliser les réponses de l'IA?",
          answer: "Oui! Vous contrôlez la personnalité de l'IA, les modèles de réponse et les questions qu'elle gère par rapport à celles qu'elle vous transmet. Elle apprend votre style au fil du temps."
        },
        q13: {
          question: "Comment RealtorDesk AI se compare-t-il à Follow Up Boss?",
          answer: "RealtorDesk AI offre une réponse instantanée aux prospects par IA (moins de 3 secondes) et un support bilingue à partir de 149$/mois CAD, avec l'intégration CREA DDF® prévue pour le 3e trimestre 2026. Follow Up Boss nécessite un suivi manuel, manque de fonctionnalités IA et coûte 49-99$ USD/utilisateur/mois sans fonctionnalités spécifiques au Canada."
        },
        q14: {
          question: "RealtorDesk AI fonctionne-t-il avec CREA DDF®?",
          answer: "L'intégration CREA DDF® est prévue pour le 3e trimestre 2026 pour RealtorDesk AI. Lors du lancement, vous pourrez synchroniser les inscriptions MLS automatiquement, jumeler les acheteurs aux propriétés en temps réel et gérer les données d'inscription directement dans le CRM. En attendant, vous pouvez importer les inscriptions de Realtor.ca via l'outil d'importation intégré."
        },
        q15: {
          question: "Quel est le ROI moyen pour les agents utilisant RealtorDesk AI?",
          answer: "Selon les données de nos utilisateurs bêta, les agents voient une augmentation significative de la conversion des prospects grâce à des temps de réponse inférieurs à 3 secondes. Avec un agent moyen concluant 12-18 transactions par an, ajouter seulement 2-3 transactions supplémentaires grâce à un meilleur suivi paie le CRM plusieurs fois."
        },
        q16: {
          question: "RealtorDesk AI peut-il gérer les appels téléphoniques?",
          answer: "Oui! Notre Agent Vocal IA peut gérer les appels téléphoniques entrants 24/7, répondre aux questions sur les inscriptions, qualifier les prospects et réserver des rendez-vous directement dans votre calendrier—le tout avec un accent canadien naturel en anglais ou en français."
        },
        q17: {
          question: "RealtorDesk AI convient-il aux équipes immobilières?",
          answer: "Absolument. Notre plan Teams prend en charge un nombre illimité d'utilisateurs avec boîte de réception partagée, analyses de performance d'équipe, distribution de prospects en rotation et formation IA personnalisée. Parfait pour les courtages et équipes de 2 à 50+ agents."
        },
        q18: {
          question: "Combien de temps faut-il pour voir des résultats avec RealtorDesk AI?",
          answer: "La plupart des agents voient des améliorations immédiates du temps de réponse (instantané au lieu d'heures/jours). Dans les 30 premiers jours, les agents voient généralement 25-40% plus de rendez-vous qualifiés réservés. Les augmentations mesurables de transactions apparaissent généralement dans les 60-90 jours."
        },
        q19: {
          question: "RealtorDesk AI s'intègre-t-il avec mon site web existant?",
          answer: "Oui! Notre widget de chatbot IA s'installe sur n'importe quel site web avec un simple extrait de code (fonctionne avec WordPress, Wix, Squarespace, sites personnalisés). La configuration prend moins de 5 minutes et commence à capturer des prospects immédiatement."
        },
        q20: {
          question: "Qu'est-ce qui rend RealtorDesk AI différent des CRM traditionnels?",
          answer: "Les CRM traditionnels organisent les contacts mais nécessitent que VOUS fassiez tout le suivi. RealtorDesk AI engage activement les prospects 24/7 via chat, courriel, SMS et voix—les qualifiant et réservant des rendez-vous pendant que vous vous concentrez sur les clôtures. C'est la différence entre un classeur et un assistant IA."
        },
        cta: {
          title: "Vous Avez Encore des Questions?",
          subtitle: "Nous sommes là pour vous aider! Contactez notre équipe ou commencez votre essai gratuit aujourd'hui.",
          contactSupport: "Contacter le Support",
          startTrial: "Commencer Votre Essai Gratuit de 14 Jours",
          noCreditCard: "Aucune carte de crédit requise • Annulez à tout moment"
        }
      },
      cta: {
        title: "Prêt à Ne Plus Jamais Manquer un Prospect?",
        subtitle: "Rejoignez notre communauté bêta canadienne utilisant l'IA pour conclure plus de ventes",
        button: "Commencez Votre Essai Gratuit de 14 Jours",
        note: "Aucune carte de crédit requise • Configuration en 20 minutes • Annulez à tout moment"
      },
      mobileCTA: {
        title: "Commencez Votre Essai Gratuit de 14 Jours",
        subtitle: "Rejoignez Notre Communauté Bêta Canadienne"
      },
      trustTransparency: {
        badge: "Confiance et Transparence",
        title: "Bâti sur l'Honnêteté",
        subtitle: "Nous croyons en une communication transparente sur notre programme bêta",
        beta: {
          title: "Programme Bêta",
          desc: "Accès anticipé avec tarification spéciale",
          description: "Nous sommes actuellement en version bêta avec des agents immobiliers canadiens sélectionnés. Rejoignez notre programme pilote et aidez à façonner l'avenir de l'IA dans l'immobilier.",
          badge: "Places Limitées Disponibles"
        },
        results: {
          title: "Résultats Réels",
          desc: "Témoignages vérifiés d'utilisateurs bêta",
          description: "Métriques de performance basées sur notre programme pilote avec plus de 50 utilisateurs actifs. Les résultats individuels peuvent varier selon les conditions du marché et l'utilisation.",
          disclaimer: "*Résultats des participants au programme pilote"
        },
        security: {
          title: "La Sécurité d'Abord",
          desc: "Protection des données de niveau entreprise",
          description: "Architecture axée sur la sécurité, traitement des données conforme à la LPRPDE et chiffrement de niveau entreprise dès le premier jour."
        },
        canadian: {
          title: "Conçu au Canada",
          desc: "Conçu pour les courtiers immobiliers canadiens",
          description: "Conçu spécifiquement pour les courtiers immobiliers canadiens avec résidence des données à Toronto/Vancouver et support bilingue complet."
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
              responseTime: "temps de réponse moyen de l'IA",
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
        emailLabel: "Courriel *",
        emailPlaceholder: "votre.courriel@exemple.com",
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
          soc2Title: "Architecture Axée Sécurité",
          soc2Desc: "Chiffrement et protection des données de niveau entreprise",
          pipedaTitle: "Conforme PIPEDA par Conception",
          pipedaDesc: "Construit autour des principes canadiens de confidentialité",
          creaTitle: "Intégration CREA DDF®",
          creaDesc: "Intégration CREA DDF® prévue pour Q3 2026"
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
          sec1: "Architecture Axée sur la Sécurité:",
          sec1Desc: "Chiffrement de niveau entreprise, révisions de sécurité régulières, infrastructure haute disponibilité",
          sec2: "Conception LPRPDE-Consciente:",
          sec2Desc: "Droit d'accès, de suppression, portabilité des données. Notification de violation <72h",
          sec3: "Conscient de la LCAP:",
          sec3Desc: "Suivi du consentement exprès, désinscription automatique, preuve conservée 24 mois",
          sec4: "Infrastructure Optimisée pour le Canada:",
          sec4Desc: "Hébergé sur une infrastructure optimisée pour les exigences canadiennes de résidence des données",
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
          api3Desc: "Zapier, Make et n8n natifs. Connecteurs directs Salesforce, Zoho, Pipedrive prévus.",
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
          title: "Rejoignez 50+ Agents Canadiens Qui Développent Leur Entreprise avec l'IA",
          subtitle: "Commencez à conclure plus de ventes avec l'automation propulsée par l'IA aujourd'hui",
          startTrial: "Commencez Votre Essai Gratuit de 14 Jours",
          bookDemo: "Réservez votre démo gratuite",
          note: "⚡ 14 Jours Gratuits • Aucune carte de crédit • Annulez à tout moment"
        },
        betaNotice: {
          title: "Avis sur le Programme Bêta",
          description: "RealtorDesk AI est actuellement en version bêta publique. Nous nous améliorons continuellement en fonction des commentaires des utilisateurs. Toutes les fonctionnalités, tarifs et métriques sont sujets à changement. Les premiers adopteurs bénéficient de tarifs à vie spéciaux."
        }
      },
      // Dashboard & App Translations (French)
      app: {
        sidebar: {
          today: "Aujourd'hui",
          automations: "Automatisations",
          advanced: "Avancé",
          dashboard: "Tableau de bord",
          contacts: "Contacts",
          properties: "Propriétés",
          deals: "Transactions",
          tasks: "Tâches",
          aiAssistant: "Assistant IA",
          campaigns: "Campagnes",
          calendar: "Calendrier",
          reports: "Rapports",
          market: "Intelligence de marché",
          integrations: "Intégrations",
          billing: "Facturation",
          settings: "Paramètres",
          trialActive: "Essai actif",
          daysLeft: "jours restants dans votre essai",
          upgradeNow: "Mettre à niveau"
        },
        navbar: {
          search: "Rechercher contacts, transactions, tâches...",
          notifications: "Notifications",
          profile: "Profil",
          signOut: "Se déconnecter",
          help: "Aide"
        },
        dashboard: {
          welcomeBack: "Bienvenue",
          tasksDueToday: "tâches dues aujourd'hui",
          hotLeadsToFollow: "prospects chauds à suivre",
          newLeadsThisMonth: "Nouveaux Prospects (Ce Mois)",
          activeDeals: "Transactions Actives",
          tasksDue: "Tâches Dues Aujourd'hui",
          revenueYTD: "Revenus Année",
          pipeline: "pipeline",
          overdue: "en retard",
          ofAnnualGoal: "de l'objectif annuel",
          trialDaysLeft: "jours restants dans votre essai gratuit",
          upgradeNowContinue: "Mettez à niveau pour continuer après votre essai",
          loading: "Chargement..."
        },
        contacts: {
          title: "Contacts",
          addContact: "Ajouter un contact",
          importContacts: "Importer",
          exportContacts: "Exporter",
          searchPlaceholder: "Rechercher des contacts...",
          allContacts: "Tous les Contacts",
          leads: "Prospects",
          clients: "Clients",
          pastClients: "Anciens Clients",
          noContacts: "Aucun contact trouvé",
          addFirst: "Ajoutez votre premier contact pour commencer",
          firstName: "Prénom",
          lastName: "Nom de famille",
          email: "Courriel",
          phone: "Téléphone",
          source: "Source",
          status: "Statut",
          tags: "Étiquettes",
          leadScore: "Score Prospect",
          lastContact: "Dernier Contact",
          actions: "Actions",
          edit: "Modifier",
          delete: "Supprimer",
          view: "Voir les Détails",
          bulkActions: "Actions Groupées",
          selected: "sélectionné(s)",
          deleteSelected: "Supprimer la Sélection",
          addTags: "Ajouter des Étiquettes",
          sendEmail: "Envoyer un Courriel",
          startCallSession: "Démarrer une session d'appels",
          viewTable: "Tableau",
          viewCards: "Cartes",
          filters: {
            searchPlaceholder: "Rechercher par nom, courriel ou téléphone…",
            leadScore: "Score du prospect",
            coldRange: "Froid (0-49)",
            warmRange: "Tiède (50-79)",
            hotRange: "Chaud (80+)",
            hotLeads: "Prospects chauds",
            warmLeads: "Prospects tièdes",
            coldLeads: "Prospects froids",
            clearAll: "Effacer tous les filtres",
            searchChip: "Recherche",
            scoreChip: "Score"
          },
          empty: {
            title: "Aucun contact pour l'instant",
            importCta: "Importer des contacts",
            refresh: "Actualiser"
          }
        },
        deals: {
          title: "Transactions",
          addDeal: "Ajouter une Transaction",
          searchPlaceholder: "Rechercher des transactions...",
          allDeals: "Toutes les Transactions",
          active: "Actives",
          won: "Gagnées",
          lost: "Perdues",
          noDeals: "Aucune transaction trouvée",
          addFirst: "Ajoutez votre première transaction pour commencer",
          dealName: "Nom de la Transaction",
          client: "Client",
          property: "Propriété",
          value: "Valeur",
          stage: "Étape",
          probability: "Probabilité",
          expectedClose: "Clôture Prévue",
          stages: {
            lead: "Prospect",
            viewing: "Visite",
            offer: "Offre",
            negotiation: "Négociation",
            closing: "Clôture",
            won: "Gagnée",
            lost: "Perdue"
          },
          pipeline: "Pipeline",
          totalValue: "Valeur Totale",
          avgDealSize: "Taille Moyenne",
          winRate: "Taux de Réussite"
        },
        tasks: {
          title: "Tâches",
          addTask: "Ajouter une Tâche",
          searchPlaceholder: "Rechercher des tâches...",
          allTasks: "Toutes les Tâches",
          today: "Aujourd'hui",
          upcoming: "À Venir",
          overdue: "En Retard",
          completed: "Terminées",
          noTasks: "Aucune tâche trouvée",
          addFirst: "Ajoutez votre première tâche pour commencer",
          taskName: "Nom de la Tâche",
          dueDate: "Date d'Échéance",
          dueTime: "Heure d'Échéance",
          priority: "Priorité",
          priorities: {
            low: "Basse",
            medium: "Moyenne",
            high: "Haute",
            urgent: "Urgente"
          },
          status: "Statut",
          statuses: {
            pending: "En Attente",
            inProgress: "En Cours",
            completed: "Terminée",
            cancelled: "Annulée"
          },
          relatedTo: "Lié à",
          description: "Description",
          markComplete: "Marquer Terminée",
          markIncomplete: "Marquer Incomplète"
        },
        properties: {
          title: "Propriétés",
          addProperty: "Ajouter une Propriété",
          searchPlaceholder: "Rechercher des propriétés...",
          allProperties: "Toutes les Propriétés",
          active: "Actives",
          pending: "En Attente",
          sold: "Vendues",
          noProperties: "Aucune propriété trouvée",
          addFirst: "Ajoutez votre première propriété pour commencer",
          propertyTitle: "Titre",
          address: "Adresse",
          city: "Ville",
          province: "Province",
          postalCode: "Code Postal",
          price: "Prix",
          type: "Type",
          bedrooms: "Chambres",
          bathrooms: "Salles de Bain",
          squareFeet: "Pieds Carrés",
          yearBuilt: "Année de Construction",
          mlsNumber: "Numéro MLS",
          listingType: "Type d'Inscription",
          types: {
            house: "Maison",
            condo: "Condo",
            townhouse: "Maison de Ville",
            land: "Terrain",
            commercial: "Commercial"
          }
        },
        settings: {
          title: "Paramètres",
          profile: "Profil",
          profileDesc: "Mettez à jour votre nom, votre courtage et vos coordonnées",
          accountDesc: "Gérez votre session et votre accès au compte",
          avatarHint: "Cliquez sur l'avatar pour téléverser une nouvelle photo",
          phone: "Téléphone",
          selectProvince: "Sélectionner une province",
          selectCity: "Sélectionner une ville",
          endsOn: "Se termine le",
          language: {
            english: "Anglais",
            french: "Français",
            both: "Bilingue"
          },
          account: "Compte",
          notifications: {
            label: "Notifications",
            desc: "Gérez vos préférences de notifications par courriel et par message poussé.",
            email: "Notifications par courriel",
            emailDesc: "Recevez des alertes par courriel pour les nouveaux prospects et les mises à jour de transactions.",
            sms: "Notifications SMS",
            smsDesc: "Recevez des alertes texto pour les suivis urgents.",
            comingSoon: "Bientôt disponible"
          },
          integrations: "Intégrations",
          billing: "Facturation",
          security: "Sécurité",
          language: "Langue",
          timezone: "Fuseau horaire",
          fullName: "Nom complet",
          emailAddress: "Adresse courriel",
          phoneNumber: "Numéro de téléphone",
          company: "Nom de l'agence / du courtage immobilier",
          licenseNumber: "Numéro de permis",
          province: "Province",
          city: "Ville",
          save: "Enregistrer les modifications",
          cancel: "Annuler",
          twoFactor: {
            title: "Authentification à deux facteurs (A2F)",
            subtitle: "Protégez votre compte avec l'authentification à deux facteurs.",
            helper: "Ajoutez une couche de sécurité supplémentaire avec une application d'authentification.",
            enable: "Activer l'A2F",
            disable: "Désactiver l'A2F",
            verify: "Vérifier",
            activeBody: "Votre compte est protégé par l'A2F basée sur TOTP.",
            inactiveBody: "Ajoutez une couche de sécurité supplémentaire avec une application d'authentification.",
            setupHeading: "Configurer l'authentification à deux facteurs",
            setupHelp: "Balayez ce code QR avec votre application d'authentification (Google Authenticator, Authy ou 1Password), puis saisissez le code à 6 chiffres ci-dessous.",
            qrAlt: "Code QR TOTP",
            disableConfirmTitle: "Désactiver l'authentification à deux facteurs ?",
            disableConfirmBody: "Cela rendra votre compte moins sécurisé. Vous pouvez la réactiver à tout moment.",
            enabledToastTitle: "A2F activée",
            enabledToastDesc: "L'authentification à deux facteurs est maintenant active sur votre compte.",
            disabledToastTitle: "A2F désactivée",
            disabledToastDesc: "L'authentification à deux facteurs a été retirée.",
            enrollFailed: "Échec du démarrage de l'inscription A2F",
            verifyFailed: "La vérification a échoué",
            invalidCode: "Code TOTP invalide. Réessayez.",
            disableFailed: "Échec de la désactivation de l'A2F",
            noFactor: "Aucun facteur A2F trouvé"
          },
          profileMenu: {
            changePhoto: "Changer la photo",
            removePhoto: "Retirer la photo"
          },
          dataRights: {
            exportTitle: "Exporter mes données",
            exportDesc: "Téléchargez au format JSON toutes les informations que nous conservons à votre sujet (droit d'accès LPRPDE).",
            deleteTitle: "Supprimer mon compte",
            deleteDesc: "Effacez votre profil et toutes les données associées (droit à l'effacement LPRPDE). Traité en moins de 30 jours.",
            confirmTitle: "Supprimer votre compte ?",
            confirmBody: "Il s'agit d'une demande d'effacement en vertu de la LPRPDE. Nous confirmerons par courriel et effacerons entièrement vos données en moins de 30 jours. Le retrait n'est pas réversible."
          }
        },
        common: {
          loading: "Chargement...",
          save: "Enregistrer",
          cancel: "Annuler",
          delete: "Supprimer",
          edit: "Modifier",
          add: "Ajouter",
          search: "Rechercher",
          filter: "Filtrer",
          sort: "Trier",
          export: "Exporter",
          import: "Importer",
          refresh: "Actualiser",
          back: "Retour",
          next: "Suivant",
          previous: "Précédent",
          close: "Fermer",
          confirm: "Confirmer",
          yes: "Oui",
          no: "Non",
          all: "Tout",
          none: "Aucun",
          selectAll: "Tout Sélectionner",
          deselectAll: "Tout Désélectionner",
          noResults: "Aucun résultat trouvé",
          error: "Erreur",
          success: "Succès",
          warning: "Avertissement",
          info: "Info",
          required: "Requis",
          optional: "Optionnel",
          saving: "Sauvegarde...",
          continue: "Continuer",
          skip: "Passer pour l'instant"
        },
        auth: {
          signIn: "Se Connecter",
          signUp: "S'Inscrire",
          signOut: "Se déconnecter",
          email: "Courriel",
          password: "Mot de Passe",
          confirmPassword: "Confirmer le Mot de Passe",
          forgotPassword: "Mot de Passe Oublié?",
          resetPassword: "Réinitialiser le Mot de Passe",
          createAccount: "Créer un Compte",
          alreadyHaveAccount: "Vous avez déjà un compte?",
          dontHaveAccount: "Vous n'avez pas de compte?",
          verifyEmail: "Vérifier le Courriel",
          checkYourEmail: "Vérifiez votre courriel pour un lien de vérification",
          invalidCredentials: "Courriel ou mot de passe invalide",
          emailRequired: "Le courriel est requis",
          passwordRequired: "Le mot de passe est requis",
          passwordMinLength: "Le mot de passe doit contenir au moins 8 caractères",
          passwordsDoNotMatch: "Les mots de passe ne correspondent pas",
          passwordRequirements: {
            minLength: "Au moins 8 caractères",
            uppercase: "Au moins 1 lettre majuscule (A-Z)",
            lowercase: "Au moins 1 lettre minuscule (a-z)",
            number: "Au moins 1 chiffre (0-9)",
            special: "Au moins 1 caractère spécial (!@#$%^&*)",
            notMet: "Le mot de passe ne répond pas à toutes les exigences"
          }
        },
        validation: {
          required: "Ce champ est requis",
          email: "Veuillez entrer une adresse courriel valide",
          phone: "Veuillez entrer un numéro de téléphone valide",
          minLength: "Doit contenir au moins {{min}} caractères",
          maxLength: "Ne doit pas dépasser {{max}} caractères",
          number: "Veuillez entrer un nombre valide",
          date: "Veuillez entrer une date valide",
          url: "Veuillez entrer une URL valide"
        },
        notifications: {
          contactCreated: "Contact créé avec succès",
          contactUpdated: "Contact mis à jour avec succès",
          contactDeleted: "Contact supprimé avec succès",
          dealCreated: "Transaction créée avec succès",
          dealUpdated: "Transaction mise à jour avec succès",
          dealDeleted: "Transaction supprimée avec succès",
          taskCreated: "Tâche créée avec succès",
          taskUpdated: "Tâche mise à jour avec succès",
          taskDeleted: "Tâche supprimée avec succès",
          taskCompleted: "Tâche marquée comme terminée",
          propertyCreated: "Propriété créée avec succès",
          propertyUpdated: "Propriété mise à jour avec succès",
          propertyDeleted: "Propriété supprimée avec succès",
          settingsSaved: "Paramètres enregistrés avec succès",
          errorOccurred: "Une erreur s'est produite. Veuillez réessayer."
        },
        modals: {
          addContact: {
            title: "Ajouter un nouveau contact",
            firstName: "Prénom",
            lastName: "Nom de famille",
            email: "Courriel",
            phone: "Téléphone",
            source: "Source",
            selectSource: "Sélectionner la source",
            tags: "Étiquettes",
            tagsPlaceholder: "Premier acheteur, Pré-approuvé, Urgent (séparés par des virgules)",
            notes: "Notes",
            notesPlaceholder: "Ajoutez des informations supplémentaires sur ce contact...",
            caslTitle: "🇨🇦 Conformité Canadienne (LCAP)",
            preferredLanguage: "Langue préférée",
            selectLanguage: "Sélectionner la langue",
            english: "Anglais",
            french: "Français",
            consentLabel: "Le contact a donné son consentement pour les communications (LCAP)",
            consentDescription: "Requis en vertu de la Loi canadienne anti-pourriel pour l'envoi de messages électroniques commerciaux",
            cancel: "Annuler",
            addContact: "Ajouter le contact",
            adding: "Ajout en cours...",
            notAuthenticated: "Non authentifié",
            pleaseLogin: "Veuillez vous connecter pour ajouter des contacts",
            success: "Contact ajouté avec succès",
            contactAdded: "a été ajouté à vos contacts",
            errorAdding: "Erreur lors de l'ajout du contact",
            validation: {
              firstNameRequired: "Le prénom est obligatoire.",
              lastNameRequired: "Le nom de famille est obligatoire.",
              invalidEmail: "Veuillez saisir une adresse courriel valide."
            },
            sources: {
              website: "Site Web",
              referral: "Référence",
              openHouse: "Portes Ouvertes",
              zillow: "Zillow",
              realtorCom: "Realtor.com",
              socialMedia: "Médias Sociaux",
              import: "Importation",
              other: "Autre"
            }
          },
          addDeal: {
            title: "Ajouter une Nouvelle Transaction",
            contact: "Contact",
            selectContact: "Sélectionner un contact",
            transactionTitle: "Titre de la Transaction",
            titlePlaceholder: "ex., Achat de Condo au Centre-Ville",
            clientType: "Type de Client",
            selectType: "Sélectionner le type",
            buyer: "Acheteur",
            seller: "Vendeur",
            both: "Les Deux",
            propertyType: "Type de Propriété",
            propertyAddress: "Adresse de la Propriété",
            addressPlaceholder: "123 Rue Principale, Toronto, ON M1A 1A1",
            mlsNumber: "Numéro MLS",
            listingPrice: "Prix d'Inscription (CAD)",
            commission: "Commission %",
            stage: "Étape",
            stages: {
              newLead: "Nouveau Prospect",
              contacted: "Contacté",
              showingScheduled: "Visite Planifiée",
              offerMade: "Offre Faite",
              underContract: "Sous Contrat",
              closing: "Conclusion"
            },
            dealProbability: "Probabilité de Transaction",
            expectedClosingDate: "Date de Conclusion Prévue",
            pickDate: "Choisir une date",
            notes: "Notes",
            notesPlaceholder: "Détails supplémentaires sur cette transaction...",
            cancel: "Annuler",
            createTransaction: "Créer la Transaction",
            creating: "Création en cours...",
            fillRequired: "Veuillez remplir le contact et le titre",
            failedCreate: "Échec de la création de la transaction",
            successCreate: "Transaction créée avec succès",
            propertyTypes: {
              condo: "Condo",
              house: "Maison",
              townhouse: "Maison en Rangée",
              commercial: "Commercial",
              land: "Terrain",
              other: "Autre"
            }
          },
          addTask: {
            title: "Ajouter une Nouvelle Tâche",
            taskTitle: "Titre de la Tâche",
            titlePlaceholder: "ex., Appeler le client pour la visite de propriété",
            description: "Description",
            descriptionPlaceholder: "Détails supplémentaires...",
            dueDate: "Date d'Échéance",
            pickDate: "Choisir une date",
            dueTime: "Heure d'Échéance",
            priority: "Priorité",
            priorities: {
              low: "Basse",
              medium: "Normale",
              high: "Haute",
              urgent: "Urgente"
            },
            taskType: "Type de Tâche",
            taskTypes: {
              call: "Appel",
              email: "Courriel",
              meeting: "Réunion",
              viewing: "Visite",
              followup: "Suivi",
              other: "Autre"
            },
            associatedContact: "Contact Associé",
            selectContactOptional: "Sélectionner un contact (optionnel)",
            associatedDeal: "Transaction Associée",
            selectDealOptional: "Sélectionner une transaction (optionnel)",
            reminder: "Rappel",
            reminders: {
              none: "Aucun",
              fifteenMin: "15 minutes avant",
              oneHour: "1 heure avant",
              oneDay: "1 jour avant"
            },
            cancel: "Annuler",
            addAnother: "Ajouter et En Ajouter Une Autre",
            addTask: "Ajouter la Tâche",
            creating: "Création en cours...",
            fillRequired: "Veuillez remplir les champs requis",
            failedCreate: "Échec de la création de la tâche",
            successCreate: "Tâche créée avec succès"
          },
          addProperty: {
            title: "Ajouter une Nouvelle Propriété",
            quickAdd: "🚀 Ajout Rapide depuis l'URL de l'Inscription MLS",
            pasteUrl: "Coller l'URL de l'Inscription (Bientôt: Remplissage Auto depuis CREA DDF)",
            urlPlaceholder: "https://realtor.ca/listing/...",
            urlNote: "Phase 1: Nous récupérerons les infos de base. Phase 2: Intégration complète CREA DDF prévue T1 2026.",
            propertyTitle: "Titre de la Propriété",
            titlePlaceholder: "Belle Maison Familiale 3 Chambres",
            address: "Adresse",
            addressPlaceholder: "123 Rue Principale",
            city: "Ville",
            cityPlaceholder: "Toronto",
            province: "Province",
            provincePlaceholder: "ON",
            propertyType: "Type de Propriété",
            types: {
              house: "Maison",
              condo: "Condo",
              townhouse: "Maison en Rangée",
              land: "Terrain",
              commercial: "Commercial"
            },
            status: "Statut",
            statuses: {
              active: "Actif",
              pending: "En Attente",
              sold: "Vendu",
              comingSoon: "Bientôt Disponible",
              offMarket: "Hors Marché"
            },
            price: "Prix (CAD)",
            bedrooms: "Chambres",
            bathrooms: "Salles de Bain",
            squareFeet: "Pieds Carrés",
            mlsNumber: "Numéro MLS",
            imageUrl: "URL de l'Image",
            description: "Description",
            descriptionPlaceholder: "Décrivez les caractéristiques, commodités et avantages de l'emplacement...",
            cancel: "Annuler",
            addProperty: "Ajouter la Propriété",
            adding: "Ajout en cours...",
            success: "Propriété ajoutée avec succès",
            errorAdding: "Erreur lors de l'ajout de la propriété"
          },
          importContacts: {
            title: "Importer des Contacts",
            uploadDescription: "Téléversez un fichier CSV avec vos contacts",
            chooseFile: "Choisir un Fichier",
            selected: "Sélectionné:",
            formatGuide: "Guide de Format CSV",
            formatDescription: "Votre CSV devrait inclure ces colonnes:",
            importing: "Importation des contacts...",
            cancel: "Annuler",
            import: "Importer",
            importingBtn: "Importation...",
            imported: "Importés",
            errors: "Erreurs",
            done: "Terminé",
            importComplete: "Importation terminée",
            importSuccess: "contacts importés avec succès.",
            importFailed: "Échec de l'importation",
            invalidFileType: "Type de fichier invalide",
            pleaseSelectCSV: "Veuillez sélectionner un fichier CSV",
            notAuthenticated: "Non authentifié",
            pleaseLogin: "Veuillez vous connecter pour importer des contacts"
          }
        },
        tasks: {
          title: "Tâches",
          addTask: "Ajouter une tâche",
          allTasks: "Toutes",
          today: "Aujourd'hui",
          upcoming: "Cette semaine",
          overdue: "En retard",
          empty: {
            title: "Aucune tâche pour l'instant.",
            body: "Créez votre première tâche pour commencer."
          },
          stats: {
            dueToday: "À faire aujourd'hui",
            overdue: "En retard",
            completedToday: "Complétées aujourd'hui",
            thisWeek: "Cette semaine"
          }
        },
        campaigns: {
          title: "Campagnes courriel",
          subtitle: "Gérez et suivez vos campagnes de marketing par courriel",
          newCampaign: "Nouvelle campagne",
          recent: "Campagnes récentes",
          comingSoon: "Les campagnes courriel arrivent bientôt — nous vous informerons dès qu'elles seront en ligne.",
          stats: {
            total: "Total de campagnes",
            sent: "Courriels envoyés",
            openRate: "Taux d'ouverture moyen",
            clickRate: "Taux de clics",
            startSending: "Lancez des envois pour voir les indicateurs",
            requiresSent: "Nécessite des campagnes envoyées"
          },
          empty: {
            title: "Aucune campagne pour l'instant",
            body: "Créez votre première campagne courriel pour rester en contact avec vos prospects et clients.",
            cta: "Créer votre première campagne"
          }
        },
        automations: {
          title: "Automatisations courriel",
          subtitle: "Créez des séquences courriel automatisées pour entretenir vos prospects et engager vos contacts",
          create: "Créer une automatisation",
          comingSoon: "Les automatisations courriel arrivent bientôt — le moteur de déclenchement est en cours de développement. Nous vous informerons dès qu'il sera en ligne.",
          stats: {
            total: "Total d'automatisations",
            active: "Actives",
            enrolled: "Contacts inscrits"
          },
          empty: {
            title: "Aucune automatisation pour l'instant",
            body: "Créez votre première automatisation pour commencer à engager vos contacts automatiquement",
            cta: "Créer votre première automatisation"
          }
        },
        properties: {
          title: "Propriétés",
          addProperty: "Ajouter une propriété",
          active: "active",
          pending: "en attente",
          sold: "vendue",
          view: {
            grid: "Grille",
            list: "Liste"
          },
          searchPlaceholder: "Rechercher par adresse, MLS#, ville…",
          priceOnRequest: "Prix sur demande",
          beds: {
            label: "Chambres",
            any: "Tout nombre de chambres",
            plus: "{{n}}+ chambres"
          },
          filters: {
            status: "Statut",
            propertyType: "Type de propriété",
            priceRange: "Fourchette de prix"
          },
          status: {
            active: "Active",
            pending: "En attente",
            sold: "Vendue",
            comingSoon: "Bientôt sur le marché",
            offMarket: "Hors marché"
          },
          types: {
            house: "Maison",
            condo: "Condo",
            townhouse: "Maison de ville",
            land: "Terrain",
            commercial: "Commercial"
          },
          empty: {
            title: "Aucune propriété pour l'instant",
            body: "Ajoutez votre première propriété pour suivre vos inscriptions, gérer les visites et conclure plus vite.",
            importMls: "Importer depuis MLS",
            addManual: "Ajouter une propriété manuellement",
            tip: "💡 Astuce : vous pouvez aussi importer des propriétés à partir des liens de recherche Realtor.ca"
          }
        }
      },
      howItWorks: {
        hero: {
          title: "Soyez opérationnel en",
          titleGradient: "20 minutes",
          subtitle: "De l'inscription à la capture de prospects en moins de temps qu'il n'en faut pour se rendre à une visite. Aucune compétence technique requise."
        },
        steps: {
          signUp: {
            title: "Inscription",
            time: "2 minutes",
            description: "Créez votre compte et choisissez votre forfait. Aucune carte de crédit requise pour l'essai de 14 jours.",
            details: [
              "Entrez votre nom, courriel et info courtage",
              "Choisissez votre niveau d'abonnement",
              "Vérifiez votre adresse courriel",
              "Accédez immédiatement à votre tableau de bord"
            ]
          },
          connectTools: {
            title: "Connectez Vos Outils",
            time: "5 minutes",
            description: "Liez votre CRM, courriel, site web et système téléphonique avec des intégrations en un clic.",
            details: [
              "Connectez votre CRM existant via Zapier/Make ou import CSV",
              "Liez Gmail ou Outlook",
              "Ajoutez le code widget à votre site",
              "Importez vos contacts existants (CSV ou sync directe)"
            ]
          },
          trainAI: {
            title: "Entraînez Votre IA",
            time: "10 minutes",
            description: "Enseignez à l'IA vos propriétés, style et préférences. Notre assistant rend cela facile.",
            details: [
              "Téléversez vos inscriptions actuelles et infos propriétés",
              "Ajoutez les questions fréquemment posées",
              "Définissez votre style de communication",
              "Configurez les critères de qualification des prospects",
              "Configurez les préférences de notification"
            ]
          },
          customize: {
            title: "Personnalisez",
            time: "5 minutes",
            description: "Affinez les salutations, modèles de réponse et règles d'escalade selon votre flux de travail.",
            details: [
              "Personnalisez les messages d'accueil du chatbot",
              "Définissez les heures d'ouverture et le comportement hors heures",
              "Créez des modèles de réponse",
              "Définissez quand escalader vers un humain",
              "Configurez les règles de routage des prospects"
            ]
          },
          goLive: {
            title: "Mettez en Ligne",
            time: "Instantané",
            description: "Activez le commutateur et regardez votre équipe IA capturer et qualifier des prospects 24/7.",
            details: [
              "Activez le chatbot sur votre site web",
              "Activez l'automatisation des courriels",
              "Activez l'agent vocal",
              "Commencez à recevoir des notifications de prospects",
              "Surveillez le tableau de bord pour l'activité en temps réel"
            ]
          },
          optimize: {
            title: "Optimisez et Développez",
            time: "En continu",
            description: "Examinez les analyses, améliorez les réponses et regardez vos taux de conversion monter.",
            details: [
              "Examinez les rapports de performance hebdomadaires",
              "Affinez les réponses IA selon les données",
              "Testez différentes approches en A/B",
              "Développez à mesure que vous grandissez",
              "Accédez au support et formation continus"
            ]
          }
        },
        dashboard: {
          title: "Votre Centre de Commande Vous Attend",
          subtitle: "Tout ce dont vous avez besoin pour gérer prospects, conversations et transactions dans une interface élégante",
          unifiedInbox: "Boîte de Réception Unifiée",
          unifiedInboxDesc: "Toutes les conversations au même endroit",
          aiInsights: "Insights IA",
          aiInsightsDesc: "Notation intelligente des prospects et recommandations",
          analytics: "Analyses en Temps Réel",
          analyticsDesc: "Suivez la performance et le ROI",
          cta: "Commencez Votre Essai Gratuit de 14 Jours"
        },
        support: {
          title: "Nous Sommes Là pour Vous Aider à Chaque Étape",
          subtitle: "Notre équipe de support basée au Canada s'assure que vous ne soyez jamais bloqué",
          videoTutorials: "📚 Tutoriels Vidéo",
          videoTutorialsDesc: "Guides étape par étape pour chaque fonctionnalité",
          liveChat: "💬 Chat en Direct",
          liveChatDesc: "Réponses instantanées pendant les heures d'ouverture",
          freeOnboarding: "🎓 Intégration Gratuite",
          freeOnboardingDesc: "Assistance personnalisée à la configuration",
          avgSetupTime: "Temps de configuration moyen : 22 minutes",
          basedOn: "(basé sur nos sessions d'intégration bêta)"
        }
      },
      integrationsPage: {
        stats: {
          nativeIntegrations: "Intégrations Natives",
          viaZapier: "Via Connexion Zapier",
          realTimeSync: "Synchronisation en Temps Réel"
        },
        badges: {
          nativeIntegration: "Intégration native",
          comingSoon: "Bientôt disponible",
          viaZapierMake: "Via Zapier/Make"
        },
        partners: {
          title: "Nos Partenaires d'Intégration",
          subtitle: "Connectez-vous à {{count}}+ outils et plateformes de premier plan"
        },
        categories: {
          crmPlatforms: "Plateformes CRM",
          automationTools: "Outils d'Automatisation et Flux de Travail",
          communicationTools: "Outils de Communication",
          calendarTools: "Outils de Calendrier",
          contactLeadTools: "Outils de Contacts et Prospects"
        },
        api: {
          title: "Besoin d'une Intégration Personnalisée?",
          subtitle: "Notre API REST et intégration Zapier vous offrent une flexibilité illimitée pour connecter n'importe quel outil.",
          restApi: "Accès API REST Complet",
          restApiDesc: "Le plan Entreprise inclut la documentation API complète",
          zapier: "Intégration Zapier",
          zapierDesc: "Connectez-vous à 5 000+ applications sans coder",
          webhooks: "Support Webhook",
          webhooksDesc: "Synchronisation de données en temps réel avec vos outils personnalisés",
          devSupport: "Support Développeur",
          devSupportDesc: "Équipe technique dédiée pour les intégrations personnalisées",
          enterpriseApi: "Accès API Entreprise",
          enterpriseApiDesc: "Créez des intégrations personnalisées avec notre API complète. Disponible sur les plans Entreprise."
        },
        cta: {
          title: "Prêt à Connecter Votre Pile Technologique?",
          subtitle: "Commencez à intégrer vos outils aujourd'hui et profitez d'une automatisation fluide",
          button: "Commencez à Conclure Plus",
          pricing: "Voir les Tarifs"
        },
        buttons: {
          bookDemo: "Réservez votre démo gratuite",
          viewFeatures: "Voir Toutes les Fonctionnalités"
        }
      },
      resourcesPage: {
        categories: {
          all: "Tous les articles",
          aiTech: "IA et technologie",
          canadianMarket: "Marché canadien",
          marketing: "Marketing",
          compliance: "Conformité",
          sales: "Ventes et prospects",
          successStories: "Histoires de succès",
          comparison: "Comparaisons CRM"
        },
        allArticlesHeading: "Tous les articles",
        articles: {
          aiTransformation: {
            title: "Comment l'IA Transforme l'Immobilier Canadien en 2025",
            excerpt: "Découvrez les dernières innovations IA qui révolutionnent le travail des agents immobiliers canadiens, de l'analyse prédictive à la gestion automatisée des transactions."
          },
          creaDdf: {
            title: "Le Guide Complet de l'Intégration CREA DDF®",
            excerpt: "Tout ce que vous devez savoir pour accéder aux données MLS nationales et intégrer CREA DDF® dans votre flux de travail immobilier."
          },
          compliance: {
            title: "Liste de Contrôle de Conformité Provinciale : ON, BC, AB, QC",
            excerpt: "Restez conforme aux réglementations à travers le Canada. Un guide complet des exigences RECO, BCFSA, RECA et AMF."
          },
          leadConversion: {
            title: "10 Façons d'Augmenter la Conversion des Prospects avec l'Analyse Prédictive",
            excerpt: "Apprenez comment la notation des prospects et l'analyse prédictive alimentées par l'IA peuvent augmenter votre taux de conversion de 5% à 18%."
          },
          bilingual: {
            title: "Marketing Immobilier Bilingue : Au-delà de la Traduction",
            excerpt: "Maîtrisez l'art du vrai marketing bilingue pour les marchés canadiens. Ce n'est pas juste de la traduction - c'est de la communication culturelle."
          },
          successStory: {
            title: "Comment Sarah Chen a Conclu 14 Transactions de Plus au T1 avec l'IA",
            excerpt: "Le parcours d'une agente de Toronto du CRM traditionnel au succès propulsé par l'IA. Vrais chiffres, vrais résultats, vraie transformation."
          }
        },
        readTime: "min de lecture",
        readMore: "Lire la suite",
        newsletter: {
          title: "Recevez des analyses hebdomadaires dans votre boîte de réception",
          subtitle: "Rejoignez 2 000+ agents immobiliers canadiens qui reçoivent des conseils pratiques sur l'IA et l'immobilier chaque semaine",
          placeholder: "Entrez votre courriel",
          subscribe: "S'abonner",
          noSpam: "Pas de spam. Désabonnez-vous à tout moment. Politique de confidentialité.",
          consent: "J'accepte de recevoir des courriels marketing de RealtorDesk AI (vous pouvez vous désabonner à tout moment)."
        }
      },
      footer: {
        tagline: "Succès immobilier propulsé par l'IA",
        product: "Produit",
        features: "Fonctionnalités",
        pricing: "Tarification",
        howItWorks: "Comment ça marche",
        integrations: "Intégrations",
        roadmap: "Feuille de route",
        status: "Page de statut",
        blogs: "Articles",
        blog: "Articles",
        helpCenter: "Centre d'aide",
        apiDocs: "Documentation API",
        videoTutorials: "Tutoriels vidéo",
        caseStudies: "Études de cas",
        webinars: "Webinaires",
        company: "Entreprise",
        about: "À propos",
        contact: "Contact",
        careers: "Carrières",
        privacy: "Politique de confidentialité",
        terms: "Conditions d'utilisation",
        casl: "Conformité LCAP",
        copyright: "© 2026 Realtor Desk · Brainfy AI Inc. · Edmonton, AB",
        madeInCanada: "Fabriqué au Canada 🇨🇦 pour les agents immobiliers canadiens",
        poweredBy: "Propulsé par Brainfy AI Inc",
        cookieSettings: "Paramètres des cookies",
        resourcesHeading: "Ressources"
      },
      notFound: {
        heading: "Oups ! Page introuvable",
        body: "La page que vous recherchez n'existe pas ou a été déplacée.",
        goDashboard: "Aller au tableau de bord",
        goHome: "Retour à l'accueil",
        seoTitle: "Page introuvable — Realtor Desk",
        seoDesc: "La page que vous recherchez n'existe pas ou a été déplacée."
      },
      trial: {
        daysRemaining: "{{count}} jours restants dans votre essai gratuit",
        oneDay: "1 jour restant dans votre essai gratuit",
        expirestoday: "Votre essai expire aujourd'hui !",
        upgradeMessage: "Passez à l'offre supérieure maintenant pour conserver vos données et débloquer les fonctionnalités premium",
        upgradeNow: "Passer à l'offre supérieure",
        expired: {
          title: "Votre Essai Gratuit Est Terminé",
          description: "Abonnez-vous maintenant pour continuer à utiliser Realtor Desk et conserver toutes vos données"
        },
        monthly: "Mensuel",
        yearly: "Annuel",
        savePercent: "Économisez 44%",
        billedYearly: "Facturé annuellement à {{price}} $",
        subscribeMonthly: "S'Abonner Mensuellement",
        subscribeYearly: "S'Abonner Annuellement",
        includesFeatures: "Tous les plans incluent :",
        guarantee: "Garantie de remboursement de 30 jours • Annulez à tout moment",
        feature: {
          unlimitedContacts: "Contacts et prospects illimités",
          aiLeadScoring: "Score de prospects propulsé par l'IA",
          emailAutomation: "Automatisation des courriels",
          dealPipeline: "Gestion du pipeline de transactions",
          marketInsights: "Analyses et aperçus du marché",
          prioritySupport: "Support prioritaire"
        },
        status: {
          title: "Statut de l'abonnement",
          trialActive: "Essai actif",
          trialExpired: "Essai expiré",
          subscribed: "Abonnement actif",
          daysLeft: "{{count}} jours restants dans l'essai",
          endsOn: "Se termine le {{date}}",
          tier: "Plan actuel : {{tier}}"
        }
      },
      today: {
        loading: "Chargement de votre journée...",
        goodMorning: "Bonjour",
        goodAfternoon: "Bon après-midi",
        goodEvening: "Bonsoir",
        there: "cher courtier",
        weeklyActivity: "Activité de la semaine",
        callsLogged: "Appels effectués",
        followUps: "Suivis planifiés",
        dealsMoved: "Transactions avancées",
        makeCalls: "Passer les appels du jour",
        contact: "contact",
        contacts: "contacts",
        readyToCall: "prêt(s) à appeler",
        whoToTalk: "À qui parler aujourd'hui",
        whoToTalkDesc: "Vos contacts prioritaires pour aujourd'hui, triés par urgence",
        allCaughtUp: "Tout est à jour!",
        noUrgent: "Aucun suivi urgent prévu pour aujourd'hui. Revenez demain ou consultez votre liste de contacts.",
        noCalls: "Aucun contact à appeler aujourd'hui. Excellent travail!",
        quickActions: "Actions rapides",
        viewContacts: "Voir tous les contacts",
        checkDeals: "Vérifier les transactions",
        noContactsYet: "Ajoutez des contacts pour commencer à appeler",
        importContacts: "Importer des contacts",
        unnamedContact: "Contact sans nom",
        loadFailed: "Échec du chargement des données",
        reasons: {
          checkIn: "Suivi régulier",
          firstContact: "Premier contact - nouveau prospect",
          overdue: "Suivi en retard",
          scheduledToday: "Suivi prévu aujourd'hui",
          hotLead: "Prospect chaud - attention requise",
          activeDeal: "Transaction active - vérifier le statut",
          activeProspect: "Prospect actif - entretenir la relation",
          longOverdue: "Très en retard - recontacter"
        }
      },
      stages: {
        newLead: "Nouveau prospect",
        coldLead: "Prospect froid",
        warmLead: "Prospect tiède",
        hotLead: "Prospect chaud",
        viewing: "Visite",
        offer: "Offre",
        negotiation: "Négociation",
        underContract: "Sous contrat",
        closed: "Conclu",
        lost: "Perdu",
        pastClient: "Ancien client",
        sphere: "Réseau"
      },
      billing: {
        title: "Facturation et abonnement",
        subtitle: "Gérez votre abonnement et vos informations de facturation",
        activated: "Abonnement activé avec succès!",
        trialAccount: "Compte d'essai",
        trialBadge: "Essai",
        daysLeft: "jours restants dans votre essai gratuit",
        upgradeNow: "Passez à un forfait payant pour un accès illimité et continuez à développer votre entreprise avec un CRM propulsé par l'IA.",
        agentPlan: "Forfait courtier",
        teamPlan: "Forfait équipe",
        subscriptionActive: "Votre abonnement est actif",
        nextBilling: "Prochaine date de facturation",
        opening: "Ouverture...",
        manageBilling: "Gérer la facturation",
        selectPeriod: "Sélectionner la période de facturation",
        monthly: "Mensuel",
        yearly: "Annuel",
        year: "an",
        month: "mois",
        saveYearly: "Économisez jusqu'à 789 $/an",
        availablePlans: "Forfaits disponibles",
        choosePlan: "Choisissez votre forfait",
        current: "Actuel",
        mostPopular: "Le plus populaire",
        agentDesc: "Parfait pour les courtiers individuels",
        teamDesc: "Pour les équipes de 2 à 5 courtiers",
        switchAgent: "Passer au forfait courtier",
        upgradeAgent: "Passer au forfait courtier",
        upgradeTeam: "Passer au forfait équipe",
        features: {
          unlimitedContacts: "Contacts et prospects illimités",
          aiCrm: "CRM prédictif propulsé par l'IA",
          chatbot: "Chatbot IA 24/7",
          emailSms: "Automatisation courriel et SMS",
          mobileApp: "Application mobile incluse",
          everythingAgent: "Tout le forfait courtier, plus :",
          teamCollab: "Outils de collaboration d'équipe",
          leadRouting: "Distribution et routage des prospects",
          advReporting: "Rapports avancés",
          accountManager: "Gestionnaire de compte dédié"
        }
      },
      
      onboarding: {
        profile: {
          title: "Configurons votre profil",
          subtitle: "Parlez-nous de vous pour personnaliser votre expérience",
          fullName: "Nom complet",
          companyName: "Nom de l'entreprise/courtage",
          licenseNumber: "Numéro de permis immobilier",
          province: "Province",
          city: "Ville",
          primaryLanguage: "Langue principale",
          avatarUploaded: "Photo téléchargée!",
          avatarFailed: "Échec du téléchargement de la photo",
          saveFailed: "Échec de la sauvegarde du profil"
        },
        goals: {
          title: "Vos objectifs d'affaires",
          subtitle: "Aidez-nous à adapter Realtor Desk AI à vos objectifs",
          role: "Votre rôle",
          soloAgent: "Courtier individuel",
          teamLeader: "Chef d'équipe",
          brokerManager: "Courtier/Gestionnaire",
          saveFailed: "Échec de la sauvegarde des objectifs"
        },
        chatbot: {
          title: "Configuration du chatbot IA",
          subtitle: "Personnalisez votre assistant IA pour qualifier les prospects 24/7",
          botName: "Nom du chatbot",
          greeting: "Message d'accueil",
          configured: "Chatbot configuré!",
          saveFailed: "Échec de la sauvegarde des paramètres du chatbot"
        },
        calendar: {
          title: "Intégration du calendrier",
          subtitle: "Connectez votre calendrier et définissez vos disponibilités",
          saved: "Paramètres du calendrier sauvegardés!",
          saveFailed: "Échec de la sauvegarde des paramètres du calendrier",
          finish: "Terminer la configuration"
        },
        import: {
          title: "Importez vos contacts",
          subtitle: "Choisissez comment ajouter vos contacts",
          skipContacts: "Passer - J'ajouterai mes contacts plus tard"
        },
        complete: {
          title: "Tout est prêt!",
          welcome: "Bienvenue sur Realtor Desk AI",
          whatWeSetUp: "Ce que nous avons configuré",
          whatsNext: "Et maintenant?",
          goDashboard: "Aller au tableau de bord",
          watchTutorial: "Voir le tutoriel",
          skipTutorial: "Passer le tutoriel",
          needHelp: "Besoin d'aide pour commencer?",
          contactSupport: "Contactez notre équipe de support"
        },
        saveFailed: "Échec de la sauvegarde. Veuillez réessayer.",
        welcome: "Bienvenue sur Realtor Desk AI!",
        completeFailed: "Échec de la configuration. Veuillez réessayer.",
        heading: "Mise en route — 60 minutes, guidée",
        subheading: "Cinq étapes pour passer d'un tableau de bord vide à votre premier rappel.",
        ack: "Compris",
        step: {
          profile: {
            title: "Compléter votre profil",
            desc: "Ajoutez votre agence, votre numéro de permis et vos coordonnées."
          },
          contact: {
            title: "Ajouter votre premier contact",
            desc: "Importez un fichier CSV ou ajoutez un prospect manuellement."
          },
          property: {
            title: "Ajouter votre première propriété",
            desc: "Collez un lien realtor.ca ou saisissez les détails."
          },
          widget: {
            title: "Configurer votre widget Web",
            desc: "Disponible au T3 2026 — voir la feuille de route."
          },
          calendar: {
            title: "Connecter votre agenda Google ou Outlook",
            desc: "Synchronisez vos rendez-vous dans votre tableau de bord."
          }
        }
      },
      auth: {
        backToWebsite: "Retour à realtordesk.ai",
        protectedSession: "Session Protégée",
        pipedaCompliant: "Conforme LPRPDE",
        ssl: "Chiffrement SSL 256 bits",
        canadianData: "Données Canadiennes",
        login: {
          subtitle: "Connectez-vous à votre espace de travail",
          orEmail: "Ou continuer avec un courriel",
          emailAddress: "Adresse courriel",
          password: "Mot de passe",
          forgotPassword: "Mot de passe oublié?",
          signInSecurely: "Connexion sécurisée",
          sslNotice: "Votre connexion est sécurisée avec un chiffrement SSL 256 bits",
          noAccount: "Vous n'avez pas de compte?",
          startTrial: "Commencez votre essai gratuit"
        },
        signup: {
          subtitle: "Commencez votre essai gratuit de 14 jours",
          orEmail: "Ou inscrivez-vous avec un courriel",
          agreeToThe: "J'accepte la",
          privacyPolicy: "Politique de Confidentialité",
          termsOfService: "Conditions d'Utilisation",
          marketingConsent: "Envoyez-moi des conseils et mises à jour produit (facultatif)",
          sslNote: "Vos données sont stockées en toute sécurité sur des serveurs canadiens avec un chiffrement SSL 256 bits"
        },
        forgot: {
          title: "Réinitialiser le mot de passe",
          subtitle: "Entrez votre courriel et nous vous enverrons un lien de réinitialisation",
          enterEmail: "Veuillez entrer votre adresse courriel",
          emailSent: "Courriel de réinitialisation envoyé!",
          sendFailed: "Échec de l'envoi du courriel de réinitialisation",
          sending: "Envoi...",
          sendLink: "Envoyer le lien de réinitialisation",
          backToLogin: "Retour à la connexion",
          checkEmail: "Vérifiez votre courriel",
          sentTo: "Nous avons envoyé un lien de réinitialisation à",
          linkExpiry: "Cliquez sur le lien dans le courriel pour réinitialiser votre mot de passe. Le lien expire dans 1 heure.",
          checkSpam: "Si vous ne voyez pas le courriel, vérifiez votre dossier de courrier indésirable."
        },
        reset: {
          title: "Nouveau mot de passe",
          subtitle: "Entrez votre nouveau mot de passe ci-dessous",
          newPassword: "Nouveau mot de passe",
          confirmPassword: "Confirmer le mot de passe",
          success: "Mot de passe réinitialisé avec succès!",
          fillAll: "Veuillez remplir tous les champs",
          noMatch: "Les mots de passe ne correspondent pas",
          requirements: "Le mot de passe ne répond pas à toutes les exigences",
          updated: "Mot de passe mis à jour avec succès!",
          failed: "Échec de la réinitialisation du mot de passe",
          resetting: "Réinitialisation...",
          resetButton: "Réinitialiser le mot de passe"
        }
      },
      cookie: {
        title: "🍪 Préférences de cookies",
        description: "Nous utilisons des cookies pour améliorer votre expérience de navigation et analyser le trafic du site. Vous pouvez personnaliser vos préférences ou tout accepter.",
        privacyLink: "Politique de confidentialité",
        acceptAll: "Accepter tous les cookies",
        necessaryOnly: "Nécessaires uniquement",
        customize: "Personnaliser",
        necessary: "Cookies nécessaires",
        necessaryDesc: "Requis pour le fonctionnement de base du site. Ne peut pas être désactivé.",
        analytics: "Cookies analytiques",
        analyticsDesc: "Nous aident à comprendre comment les visiteurs interagissent avec notre site.",
        marketing: "Cookies marketing",
        marketingDesc: "Utilisés pour diffuser des publicités personnalisées pertinentes pour vous.",
        functional: "Cookies fonctionnels",
        functionalDesc: "Permettent des fonctionnalités améliorées comme les widgets de chat et les préférences.",
        savePreferences: "Sauvegarder les préférences",
        back: "Retour"
      },
      boldtrail: {
        compare: {
          heading: "Quatre lignes. Pas quarante.",
          sub: "Nous ne nous comparons pas sur l'étendue des fonctionnalités. BoldTrail compte plus de 400\u00a0000 agents; nous en avons moins d'une centaine. Voici les quatre axes que nous pouvons défendre, chacun sourcé du centre d'aide de BoldTrail, de signaux tarifaires ou d'avis publics."
        },
        betterWhen: {
          heading: "Quand BoldTrail est le meilleur choix",
          body: "Si vous dirigez un grand courtage aux États-Unis, avez besoin de BackOffice pour les partages de commissions, ou d'une intégration profonde avec des systèmes MLS propres aux États-Unis que notre travail CREA DDF ne couvre pas encore, BoldTrail est aujourd'hui l'option plus mature. Nous sommes bâtis pour l'agent canadien indépendant ou la petite équipe — nous sommes plus petits, plus ciblés, et le resterons dans un avenir prévisible. Choisissez l'outil qui convient, pas la liste la plus longue."
        }
      },
      leadScore: {
        title: "Pourquoi ce score",
        openExplainer: "Pourquoi ce score",
        emailActivity: "Activité courriel (30 derniers jours)",
        propertyViews: "Vues de propriétés",
        daysSinceContact: "Jours depuis le dernier contact",
        loading: "Chargement des signaux\u2026",
        noSignals: "Aucun signal comportemental pour le moment. Consignez des appels, courriels et vues de propriétés pour alimenter ce panneau.",
        manualNotice: "Votre score est actuellement calculé par une formule fixe. Le scoring dérivé par IA, entraîné sur votre propre historique de conversion, sera livré au T2 2026."
      },
      onboardingChecklist: {
        heading: "Démarrage — 60 minutes, guidé",
        subheading: "Cinq étapes pour passer d'un tableau de bord vide à votre premier appel de suivi.",
        ack: "Compris",
        step: {
          profile: {
            title: "Complétez votre profil",
            desc: "Ajoutez votre courtage, permis et coordonnées."
          },
          contact: {
            title: "Ajoutez votre premier contact",
            desc: "Importez un CSV ou saisissez un prospect manuellement."
          },
          property: {
            title: "Ajoutez votre première propriété",
            desc: "Collez un lien realtor.ca ou saisissez les détails."
          },
          widget: {
            title: "Configurez votre widget de site web",
            desc: "Livraison au T3 2026 — voir la feuille de route."
          },
          calendar: {
            title: "Connectez Google ou Outlook Calendar",
            desc: "Synchronisez vos rendez-vous dans votre tableau de bord."
          }
        }
      },
      roadmap: {
        badge: "Feuille de route publique",
        title: "Ce que nous livrons — et ce que nous ne livrons pas.",
        subtitle: "L'honnêteté est une fonctionnalité. Cette page liste nos engagements datés sur les capacités que nos clients et concurrents demandent le plus. Si une date glisse, nous la déplaçons — nous ne l'abandonnons pas en silence.",
        lastUpdated: "Dernière mise à jour : 2026-04-20",
        status: {
          shipping: "En livraison",
          shipped: "Livré",
          building: "En construction",
          designing: "En conception",
          roadmapped: "Planifié",
          considering: "À l'étude"
        },
        quarter: {
          apr_2026: "Avr 2026",
          q2_2026: "T2 2026",
          q3_2026: "T3 2026",
          q1_2027: "T1 2027",
          tbd: "—"
        },
        section: {
          now: { heading: "Livraisons du sprint en cours (avril 2026)" },
          q2: { heading: "T2 2026" },
          q3: { heading: "T3 2026" },
          q1_2027: { heading: "T1 2027 — palier Équipes" },
          not_on: { heading: "Hors feuille de route 2026" }
        },
        item: {
          casl_footer: {
            title: "Pied de courriel conforme à la LCAP + désabonnement fonctionnel",
            desc: "Chaque courriel système envoyé contient l'identification de l'expéditeur, l'adresse physique, la base de consentement et un désabonnement en un clic qui écrit réellement dans une liste d'exclusion."
          },
          pricing_parity: {
            title: "Page de tarifs alignée sur le paiement Stripe",
            desc: "Chaque montant sur /pricing est dérivé de la même constante que la fonction create-checkout transmet à Stripe, avec une étiquette CAD et une mention TPS/TVH."
          },
          lead_score_explainer: {
            title: "Explication du score des prospects",
            desc: "La page de détail du contact expose les 3 signaux comportementaux derrière le score au lieu d'afficher un simple chiffre."
          },
          onboarding_checklist: {
            title: "Liste d'intégration sur /today",
            desc: "Les nouveaux comptes voient une configuration guidée en 5 étapes (profil, contact, propriété, widget de site, connexion du calendrier). Persistée en base de données, pas en localStorage."
          },
          ai_scoring: {
            title: "Scoring de prospects dérivé par IA",
            desc: "Remplace le score manuel actuel par un modèle entraîné sur votre historique de conversion. Notification web quand un prospect chauffe (aucune application native requise)."
          },
          trigger_campaigns: {
            title: "Séquences de courriels déclenchées",
            desc: "Connecte /campaigns et /automations à un véritable moteur de séquences. Déclencheurs : nouveau prospect, refroidi, anniversaire, anniversaire d'inscription. Détection de réponse pour mise en pause. Tous les modèles sont bilingues et incluent le pied LCAP."
          },
          idx_sites: {
            title: "Sites publics d'agents + capture comportementale (CREA DDF)",
            desc: "Sites d'agent hébergés sur realtordesk.ai, alimentés par le flux CREA DDF. Les widgets comportementaux alimentent les scores en temps réel. Inclus avec tous les paliers payants."
          },
          teams_tier: {
            title: "Lancement du palier Équipes",
            desc: "Tableau de bord multi-agents, vues gestionnaire, agrégats de vitaux quotidiens. Jusqu'à cette livraison, RealtorDesk AI est conçu pour l'agent solo ou la petite équipe (≤5)."
          },
          social_promotion: {
            title: "Promotion sociale en un clic",
            desc: "Reconsidéré au T1 2027 au plus tôt. Aujourd'hui, vous pouvez partager la page publique de la propriété manuellement."
          },
          native_mobile: {
            title: "Application mobile native",
            desc: "Nous prenons en charge le mobile via notifications web + PWA encapsulée par Capacitor. Une application iOS/Android native n'est pas prévue pour 2026."
          },
          commissions: {
            title: "Module Commissions / BackOffice",
            desc: "Hors champ. Cela constituerait une surface produit distincte, pas un module additionnel du CRM."
          },
          recruiting: {
            title: "Outils de recrutement d'agents",
            desc: "Hors champ. Nous construisons pour les agents actifs, pas pour les courtiers qui recrutent des agents."
          }
        },
        footer: {
          title: "Vous voyez quelque chose qui manque ou voulez voter sur les priorités\u00a0?",
          body: "Écrivez à product@realtordesk.ai ou ouvrez une demande dans le panneau de rétroaction de l'application. Les éléments avec un signal client sont priorisés avant les demandes internes.",
          viewPricing: "Voir la tarification",
          viewFeatures: "Ce qui est livré aujourd'hui"
        }
      },
      unsubscribe: {
        title: "Se désabonner des courriels de Realtor Desk",
        working: "Traitement de votre demande\u2026",
        success: "Vous êtes désabonné. Nous n'enverrons plus de courriels à",
        thisAddress: "cette adresse",
        effectiveImmediate: "Votre désinscription prend effet immédiatement conformément à la LCAP §11.",
        errorExpired: "Ce lien de désabonnement a expiré. Demandez-en un nouveau ci-dessous.",
        errorInvalid: "Ce lien de désabonnement est invalide. Demandez-en un nouveau ci-dessous.",
        linkSent: "Si cette adresse figure sur notre liste, nous venons de vous envoyer un lien de confirmation. Cliquez dessus pour terminer le désabonnement.",
        linkSentNote: "Les liens expirent dans 30 jours. Vérifiez votre dossier «\u00a0pourriels\u00a0» si vous ne le voyez pas d'ici une minute.",
        manualPrompt: "Saisissez l'adresse courriel à retirer de notre liste. Nous vous enverrons un lien de confirmation en un clic.",
        ctaSendLink: "M'envoyer un lien de désabonnement",
        casl: "Exploité sous LCAP par Brainfy AI Inc. (Realtor Desk).",
        back: "Retour à Realtor Desk"
      },
      rd: {
        sidebar: {
          workspaceTier: "Forfait Équipe",
          collapse: "Réduire la barre latérale",
          nav: {
            dashboard: "Tableau de bord",
            leads: "Clients potentiels",
            conversations: "Conversations",
            pipeline: "Pipeline",
            automation: "Automatisation",
            reports: "Rapports",
            settings: "Paramètres"
          },
          desk: {
            title: "Desk IA · de garde",
            summary: "{{count}} clients répondus cette semaine. Réponse moyenne {{response}}."
          }
        },
        topnav: {
          search: "Rechercher clients, inscriptions, conversations…",
          live: "En direct",
          notifications: "Notifications",
          language: "Langue"
        },
        pages: {
          dashboard: {
            title: "Tableau de bord",
            saluteMorning: "Bonjour",
            saluteAfternoon: "Bon après-midi",
            saluteEvening: "Bonsoir",
            subhead: "Desk IA a travaillé pendant la nuit."
          },
          leads: { title: "Clients potentiels" },
          inbox: { title: "Conversations" },
          pipeline: { title: "Pipeline" },
          automation: { title: "Automatisation" },
          reports: { title: "Rapports" }
        },
        stages: {
          new: "Nouveau",
          contacted: "Contacté",
          qualified: "Qualifié",
          showing: "Visite",
          offer: "Offre",
          won: "Conclu",
          lost: "Perdu"
        },
        bands: { hot: "Chaud", warm: "Tiède", cold: "Froid" },
        actions: {
          addLead: "Ajouter un client",
          filter: "Filtrer",
          import: "Importer",
          sort: "Trier",
          scoreHighToLow: "Score · du plus élevé",
          allAgents: "Tous les agents",
          newSequence: "Nouvelle séquence",
          templates: "Modèles",
          editFlow: "Modifier le flux",
          preview: "Aperçu",
          call: "Appeler",
          bookShowing: "Planifier une visite",
          takeOver: "Reprendre",
          draftWithAi: "Rédiger avec l'IA",
          attachListing: "Joindre une inscription",
          send: "Envoyer",
          sending: "Envoi…",
          use: "Utiliser",
          exportCsv: "Exporter CSV",
          share: "Partager",
          backToLeads: "Retour aux clients",
          openActivityLog: "Ouvrir le journal d'activité",
          openPipeline: "Ouvrir le pipeline"
        },
        tabs: {
          leads: {
            all: "Tous",
            hot: "Chauds",
            warm: "Tièdes",
            cold: "Froids",
            aiHandled: "Gérés par l'IA",
            needsReply: "À répondre"
          },
          automation: { all: "Toutes", active: "Actives", draft: "Brouillons" },
          inbox: { all: "Toutes", unread: "Non lues", ai: "IA", flagged: "Signalées", mine: "Mes conv." }
        },
        common: {
          sampleData: "données d'exemple",
          sampleLeads: "clients d'exemple",
          sampleLead: "client d'exemple",
          loading: "chargement…",
          live: "En direct",
          selectAll: "Tout sélectionner",
          active: "Actif",
          draft: "Brouillon",
          noResultsMatch: "Aucun résultat ne correspond à ce filtre.",
          noConversationsMatch: "Aucune conversation ne correspond.",
          noSequencesMatch: "Aucune séquence ne correspond à ce filtre.",
          noMessagesYet: "Aucun message pour l'instant.",
          unreadCount: "{{count}} non lu·e·s"
        },
        columns: {
          leads: {
            lead: "Client",
            listing: "Inscription",
            source: "Source",
            aiScore: "Score IA",
            stage: "Étape",
            lastActivity: "Dernière activité"
          },
          reports: {
            source: "Source",
            spend: "Dépense",
            leads: "Clients",
            closed: "Conclus",
            roi: "RSI"
          }
        },
        kpi: {
          activeLeads: "Clients actifs",
          showingsBooked: "Visites réservées",
          pipelineValue: "Valeur du pipeline",
          avgResponseTime: "Temps de réponse moyen",
          dealsClosed: "Transactions conclues",
          leadToShowing: "Client → Visite",
          revenueAttributed: "Revenu attribué"
        },
        sections: {
          today: "Aujourd'hui",
          pipelineSnapshot: "Aperçu du pipeline",
          leadSources30d: "Sources de clients · 30 j",
          compliance: "Conformité",
          deskAiActivity: "Activité Desk IA",
          responseTimeTrend: "Tendance du temps de réponse",
          aiVsAgent21d: "IA vs agent · 21 derniers jours",
          pipelineConversion: "Conversion du pipeline",
          stageFunnel: "Entonnoir par étape",
          sourceRoi: "RSI par source",
          revenuePerLeadSource: "Revenu par source de client",
          agentLeaderboard: "Classement des agents",
          thisMonth: "Ce mois-ci",
          buyingProfile: "Profil d'achat",
          viewedListings: "Inscriptions consultées",
          timeline: "Chronologie",
          contact: "Contact",
          aiLeadScore: "Score IA du client"
        },
        inbox: {
          searchConversations: "Rechercher des conversations…",
          selectConversation: "Sélectionnez une conversation à gauche.",
          emptyThread: "Aucun message pour l'instant. Lorsqu'un client répond à une séquence ou écrit en clavardage, le message apparaît ici.",
          suggestedReply: "Réponse suggérée :",
          composerPlaceholder: "Écrire un message au client…",
          deskAiReplying: "Desk IA répond",
          manualHandling: "Gestion manuelle"
        },
        pipelinePage: {
          totalPipeline: "Pipeline total · {{value}} · {{count}} clients",
          listViewLives: "La vue liste se trouve sur /app/leads — cette bascule existe par parité avec la maquette ; elle redirige plutôt que de dupliquer le tableau.",
          forecastShips: "La vue prévisionnelle arrive avec la phase Rapports.",
          viewKanban: "Kanban",
          viewList: "Liste",
          viewForecast: "Prévision"
        },
        reportsPage: {
          aiAvg: "IA · {{label}} moy.",
          agentManual: "Agent · délai manuel (non suivi)",
          noSourcesYet: "Aucune source pour l'instant"
        },
        funnel: {
          leadsCaptured: "Clients captés",
          showingBooked: "Visite réservée",
          closedWon: "Conclu gagné"
        },
        onboarding: {
          loading: "Chargement de votre intégration…",
          stepOfFive: "Étape {{n}} sur 5",
          stepLabels: {
            welcome: "Bienvenue",
            profile: "Profil",
            connectDdf: "Connecter DDF",
            aiVoice: "Voix de l'IA",
            goLive: "Mise en service"
          },
          status: { complete: "Terminée", inProgress: "En cours" },
          rail: {
            setupTime: "La configuration prend environ 5 minutes. Vos données sont hébergées au Canada dès votre inscription.",
            saving: "Enregistrement de votre progression…"
          },
          welcome: {
            titleLead: "Bienvenue sur",
            titleBrand: "RealtorDesk",
            subtitle: "Mettons votre adjoint IA en service. En environ cinq minutes, il répondra aux clients potentiels en français et en anglais.",
            helperCanadaTitle: "Hébergé au Canada",
            helperCanadaBody: "Vos clients, messages et données MLS restent en territoire canadien. Conforme à la LPRPDE dès la première minute.",
            helperMarketTitle: "Conçu pour notre marché",
            helperMarketBody: "Conçu avec des courtiers de Toronto, Montréal, Vancouver et Calgary — pas une adaptation d'un outil américain.",
            helperLiveTitle: "Cinq minutes, en direct",
            helperLiveBody: "La plupart des agents répondent à leur premier client avant même que le courriel d'installation arrive.",
            workEmail: "Courriel professionnel",
            password: "Créer un mot de passe",
            consent: "Je consens à ce que RealtorDesk AI stocke mes données au Canada selon la LPRPDE, et je m'engage à n'utiliser le produit que pour contacter des personnes ayant consenti (LCAP).",
            continueBtn: "Continuer",
            signInInstead: "Se connecter plutôt",
            orContinueWith: "ou continuer avec",
            google: "Google",
            microsoft: "Microsoft 365"
          },
          profile: {
            title: "Parlez-nous de votre bureau.",
            subtitle: "Nous utilisons ces informations pour adapter les modèles, choisir une langue par défaut et faire en sorte que l'IA vous ressemble.",
            helperLanguageTitle: "Détection de la langue",
            helperLanguageBody: "Desk IA détecte automatiquement la langue de chaque client. Vous choisissez la valeur par défaut si le message est trop court.",
            helperTemplatesTitle: "Modèles par courtier",
            helperTemplatesBody: "Nous préchargeons des clauses conformes RECO/OACIQ selon votre province.",
            firstName: "Prénom",
            lastName: "Nom",
            brokerage: "Courtier",
            province: "Province",
            defaultLanguage: "Langue par défaut",
            frDetectedBadge: "+ FR détecté",
            regNumber: "N° de permis RECO / OACIQ",
            back: "Retour",
            continueBtn: "Continuer"
          },
          ddf: {
            title: "Connectez votre flux DDF® de l'ACI.",
            subtitle: "Desk IA surveille le DDF de votre chambre pour que les nouvelles demandes, changements de prix et bascules de statut apparaissent instantanément.",
            helperReadOnlyTitle: "Lecture seule et ciblée",
            helperReadOnlyBody: "Nous ne lisons que les inscriptions liées à votre n° RECO/OACIQ. Aucune donnée partagée du courtier ne quitte votre poste.",
            helperSyncTitle: "Synchronisation en moins de 60 s",
            helperSyncBody: "Nous réindexons chaque minute. Votre nouvelle inscription est présente dans l'IA avant même que la pancarte soit en terre.",
            boardName: "Toronto Regional Real Estate Board",
            boardMeta: "Associé à votre n° RECO · 247 inscriptions actives",
            connectedBadge: "Connecté",
            statListings: "Inscriptions",
            statNewLast30d: "Nouvelles 30 j",
            statSyncCadence: "Cadence",
            addBoard: "Ajouter une autre chambre",
            addBoardDesc: "REBGV, OACIQ, CREB — connectez-en autant que vous desservez.",
            addBtn: "Ajouter",
            back: "Retour",
            continueBtn: "Continuer",
            skip: "Passer pour l'instant"
          },
          voice: {
            title: "Donnez votre voix à Desk IA.",
            subtitle: "Choisissez un ton. Collez un échantillon de votre écriture réelle. Desk IA répondra aux clients avec votre voix — et non celle d'un robot générique.",
            helperBetterTitle: "Elle s'améliore chaque jour",
            helperBetterBody: "Chaque fois que vous modifiez une ébauche, Desk IA apprend. Après une semaine, 90 % des agents approuvent les ébauches sans retouche.",
            helperBilingualTitle: "Bilingue par conception",
            helperBilingualBody: "Entraînez une fois — Desk IA adapte votre ton en français et en anglais automatiquement.",
            toneLabel: "Ton",
            toneWarmLabel: "Chaleureux et conversationnel",
            toneWarmDesc: "Convivial, utilise les prénoms. Par défaut.",
            tonePolishedLabel: "Soigné et formel",
            tonePolishedDesc: "Idéal pour le luxe, l'OACIQ (QC).",
            toneDirectLabel: "Direct et bref",
            toneDirectDesc: "Pour investisseurs, commercial.",
            pasteLabel: "Collez un courriel ou message récent (facultatif, 50 mots et plus)",
            previewLabel: "Aperçu Desk IA —",
            previewText: "Bonjour Priya — petite nouvelle, une inscription à Oakville vient de paraître ce matin et correspond à votre liste. Voulez-vous passer demain avant les offres ?",
            back: "Retour",
            continueBtn: "Continuer"
          },
          live: {
            titleLead: "Desk IA est",
            titleAccent: "de garde",
            subtitle: "Vous êtes en ligne. Le prochain client — jour ou nuit, anglais ou français — recevra une réponse instantanée dans votre voix.",
            helperPingsTitle: "Comment nous vous alertons",
            helperPingsBody: "Notifications push sur mobile. Résumé courriel à 9 h. SMS uniquement pour les clients chauds (score ≥ 80).",
            helperCustomizeTitle: "Personnalisable à tout moment",
            helperCustomizeBody: "Espace → Paramètres Desk IA. Mettre l'IA en pause par client, par inscription ou par plage horaire.",
            deskLabel: "Desk IA",
            liveBadge: "En direct",
            listeningNote: "À l'écoute sur TRREB · EN + FR · Ton chaleureux",
            kpiListings: "Inscriptions synchro.",
            kpiLanguages: "Langues",
            kpiSla: "Délai de réponse",
            kpiAlwaysOn: "Toujours actif",
            nextLeadsTitle: "Importer vos clients",
            nextLeadsDesc: "CSV, BoldTrail, Follow Up Boss, kvCORE.",
            nextInboxTitle: "Rediriger votre boîte courriel",
            nextInboxDesc: "Configurez lead@votredomaine.ca pour qu'il redirige ici.",
            nextWidgetTitle: "Ajouter le widget du site",
            nextWidgetDesc: "Une seule balise script. Bulle de clavardage bilingue.",
            nextTeamTitle: "Inviter votre équipe",
            nextTeamDesc: "5 sièges inclus avec le forfait Équipe. 15 $ chacun ensuite.",
            takeToDashboard: "Aller au tableau de bord",
            tour: "Visionner la visite de 2 min"
          }
        },
        automationPage: {
          allSequences: "Toutes les séquences",
          stepFlow: "Flux de {{count}} étape·s",
          sent: "{{count}} envoyés",
          replied: "{{count}} réponses",
          rate: "Taux {{pct}} %",
          caslRequired: "Consentement LCAP requis",
          notYetRun: "Jamais exécutée",
          selectSequence: "Sélectionnez une séquence pour l'aperçu.",
          pauseSequence: "Mettre en pause",
          activateSequence: "Activer la séquence",
          triggers: {
            newLead: "Nouveau client",
            wentCold: "Devenu froid",
            showing: "Visite",
            consent: "Consentement"
          }
        }
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
    },
    detection: {
      // Order matters — querystring first so `/?lang=fr` wins over any
      // stale localStorage or browser-locale choice on first paint. This
      // is what fixes the R-18a `?lang=fr` first-paint regression: before
      // this config, the URL param was only read by a React useEffect
      // that fired after Hero's first render, so Hero latched EN.
      order: ['querystring', 'localStorage', 'navigator', 'htmlTag'],
      // Honor the public spec — ?lang= not the library default ?lng=.
      lookupQuerystring: 'lang',
      caches: ['localStorage'],
    }
  });

// Keep <html lang> in sync with the active locale so screen readers
// pronounce text correctly, Lighthouse a11y passes, and Google reads
// hreflang signals right. Runs on init and on every language change.
function syncHtmlLang(lng: string | undefined) {
  if (typeof document === "undefined") return;
  const normalized = (lng || "en").toLowerCase().startsWith("fr") ? "fr-CA" : "en-CA";
  document.documentElement.lang = normalized;
}
syncHtmlLang(i18n.language);
i18n.on("languageChanged", syncHtmlLang);

export default i18n;
